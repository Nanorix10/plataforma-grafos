---
name: rascunhar-resumo
description: Rascunha um resumo novo no modelo do autor, das fontes até o PR aberto. Pode rodar em subagentes em paralelo.
disable-model-invocation: true
---

# Rascunhar resumo

Leva um assunto do caderno do autor até um **PR aberto** com a migration do resumo. A skill termina no PR: mesclar, aplicar no banco e conferir em produção acontecem só depois da aprovação do autor ([`publicar.md`](publicar.md)).

**A norma é [`docs/produto/modelo-de-resumo.md`](../../../docs/produto/modelo-de-resumo.md).** Leia o arquivo inteiro antes do passo 3. É ele que define o estilo do autor (§3), o esqueleto (§4), a variante da matéria (§5), as fontes permitidas (§6) e a lista de conferência (§7). Esta skill não repete nada disso: ela diz onde estão as fontes, em que ordem trabalhar e quando parar.

## Parada

Uma **parada** interrompe o rascunho até o autor responder. Há duas:

- **Tópico** (passo 1): o autor confirma o tópico antes de qualquer escrita.
- **Erro de conteúdo** (passo 3): uma fórmula, conta, dado, nome ou classificação do caderno contradiz a matemática, uma prova real ou outro caderno do autor. Erro de forma (acento, concordância, registro informal) não é parada: ele é normalizado e listado no PR (modelo, §3).

Numa sessão com o autor, pergunte com `AskUserQuestion`. Num subagente, encerre a execução com este bloco, e nada depois dele:

```
PARADA: <tópico | erro de conteúdo>
Onde: <arquivo do caderno, §parágrafo>
O caderno diz: <texto exato>
O problema: <o que contradiz, com a fonte: conta, prova e gabarito>
Opções: <seguir o caderno | corrigir para X | tirar o item>
Estado: <worktree, branch, o que já está pronto>
```

Quem disparou o subagente leva a pergunta ao autor e retoma o agente com a resposta.

## Em paralelo

Quando vários agentes rodam ao mesmo tempo, quem dispara reserva um tópico por agente e passa no prompt: o tópico confirmado, os tópicos de edital que ele pode ligar e as questões já tomadas por outro agente. Cada agente trabalha no **próprio worktree** (`git worktree add ../_pg-<slug> -b content/<slug> origin/main`), com uma junção para o `node_modules` do checkout principal (`cmd //c "mklink /J node_modules C:\Users\leand\_pg\node_modules"`). A migration de cada um leva o timestamp da hora em que foi criada, então dois agentes não geram o mesmo nome.

## Passos

### 1. Tópico

Com o tópico já dado pelo autor ou pelo prompt de disparo, pule para o passo 2.

Sem tópico, cruze as três fontes:

```sql
select processo_slug, etapa, materia_slug, texto
  from edital_topicos
 where resumo_id is null and materia_slug = '<matéria>'
 order by processo_slug, etapa, ordem;
```

Para cada lacuna, procure o assunto no caderno (`scripts/busca_caderno.py procurar "<regex>"`) e em prova (`scripts/busca_questoes.py "<regex>" --pas`). Confira também se já existe resumo sobre ele no `resumos_catalogo`, por título **e** por corpo: há resumos existentes que só não estão ligados ao edital.

Proponha até três candidatos, cada um com: tópicos de edital que cobriria, o documento do caderno, as questões encontradas. **Parada de tópico.**

*Pronto quando* o autor confirmou um tópico.

### 2. Fontes

1. **Caderno.** `busca_caderno.py procurar` lista todos os documentos com o assunto. Extraia o mais completo com `busca_caderno.py extrair "<trecho do caminho>" <pasta no scratchpad>` e leia o `doc.txt` da seção inteira, do cabeçalho de matéria até o seguinte. O cabeçalho (`MATEMÁTICA B`, `BIOLOGIA A`) decide a matéria do resumo, mesmo que o edital ponha o tópico em outra.
2. **Edital.** Liste os tópicos que citam o assunto, em todos os processos. Classifique cada um como *coberto inteiro* ou *coberto pela metade*. Só os inteiros serão ligados.
3. **Provas.** `busca_questoes.py` com dois ou três regex diferentes (o termo, a sigla, a fórmula). Para cada candidata, abra o PDF na página indicada e confira enunciado e itens: o texto extraído achata fórmulas. Recalcule o gabarito item a item; ele tem de bater com o oficial. O índice cobre só a UEM (PAS e vestibular); as provas do PASSE estão em PDF solto em `Downloads`, sem índice. Sem questão de prova sobre o assunto, o resumo sai sem questão, e o PR registra a falta.

*Pronto quando* você tem o texto integral da seção do caderno, a classificação de cada tópico de edital e as questões conferidas contra o gabarito (ou a busca registrada sem resultado).

### 3. Conferência do caderno

Antes de escrever, confira **cada** afirmação da seção: refaça toda conta e todo exemplo resolvido, teste toda fórmula num caso numérico, compare com as questões do passo 2 e com outros documentos que tragam o mesmo assunto. Cada divergência é uma **parada de erro de conteúdo**. Pare uma vez só, com todas as divergências juntas no bloco.

Com a resposta do autor, o texto segue o que ele decidiu, e o PR registra a decisão.

*Pronto quando* toda afirmação, conta e exemplo da seção foi conferido, e cada divergência tem a decisão do autor.

### 4. Corpo

Escreva o `corpo.html` no scratchpad, seguindo o modelo (§3, §4 e a variante da §5). Os moldes de HTML de cada peça estão em [`formato.md`](formato.md).

- **Figuras:** todas as do caderno entram, na âncora `[IMG]` em que o caderno as põe. Converta para WebP q82 em `public/img/resumos/<matéria>/<nome-descritivo>.webp`, com `alt` que descreva o que a figura mostra. No PR, liste cada figura e marque as que parecem tiradas de livro didático ou da internet.
- **Wikilinks:** só para títulos que existem. Confira cada um no `resumos_catalogo` e monte o `links.json` (`{"Título exato": "slug"}`) que a prévia usa.
- **Questão:** `data-id` com um uuid novo por questão (`python -c "import uuid;print(uuid.uuid4())"`).

*Pronto quando* cada item da lista de conferência do modelo (§7) está atendido ou tem o motivo no PR.

### 5. Prévia

Da raiz do worktree:

```bash
npx tsx .claude/skills/rascunhar-resumo/scripts/previa.mts --corpo <corpo.html> --links <links.json> --slug <slug> --titulo "<Título>" --materia <matéria> --cai "<processo · etapa>" --saida <previa.html>
```

O script renderiza pelo mesmo pipeline da página do resumo e imprime um relatório. Saída 1 significa reprovado: corrija e rode de novo. Com saída 0, confira ainda no relatório:
- cada questão com gabarito saiu como `somatoria` ou `objetiva` (`aberta` quer dizer que o gabarito não casou com os itens);
- `itensClicaveis` é a soma dos itens das questões.

Com navegador disponível, abra a prévia e olhe a página inteira uma vez; sem ele, quem disparou o agente faz essa leitura.

*Pronto quando* o script sai com 0 e nenhuma questão com gabarito ficou `aberta`.

### 6. Migration e PR

No worktree, crie `supabase/migrations/<AAAAMMDDHHMMSS>_rascunho_<slug>.sql` pelo molde de [`formato.md`](formato.md): cabeçalho com as fontes e as decisões, `insert … on conflict (slug) do nothing`, e o `update edital_topicos` só com os tópicos cobertos inteiros. Faça commit em inglês, dê push e abra o PR com o corpo do molde. Anexe a prévia ao relatório final.

**Não mescle e não aplique no banco.** Isso é do [`publicar.md`](publicar.md), depois da aprovação.

*Pronto quando* o PR está aberto e o relatório final tem a URL do PR, o caminho da prévia e a lista do que o autor precisa decidir.

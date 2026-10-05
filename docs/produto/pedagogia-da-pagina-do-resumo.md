# Prompt guardado — pedagogia da página do resumo

> **Como usar:** cole o bloco abaixo numa sessão nova, no repo `_pg`. Ele carrega
> o diagnóstico já levantado (com números medidos no banco em 04/10/2026) e as
> três propostas, para retomar sem refazer a investigação. Confira os números
> antes de agir: o acervo cresce.

---

## Contexto para colar

Estou na `plataforma-grafos` (repo `_pg`). Quero retomar um trabalho de
pedagogia da página do resumo (`src/app/(app)/resumos/[slug]/page.tsx`).
O diagnóstico abaixo já foi feito — não refaça, mas **revalide os números**
contra o banco antes de propor qualquer coisa.

### Diagnóstico medido (04/10/2026, Supabase `fprcopgihmxegagsqfqw`)

| Medida | Valor |
|---|---|
| Resumos | 254 |
| Tamanho mediano do corpo | 1.578 caracteres (~250 palavras) |
| Subtítulos no acervo | 496 — **416 "corridos"** (`data-corrido="sim"`, termo + definição na mesma linha) |
| Termos em negrito (`<strong>`) | 764 |
| Fórmulas | 568 |
| Bullets (`<li>`) | 3.083 |
| Resumos com figura | 82 |
| Resumos com questão | 22 (25 questões no total) |
| Resumos com tabela | 22 |
| Resumos com pai na árvore | 40 |
| Resumos cobrados por edital | 46 |
| Conexões `[[wikilink]]` no acervo inteiro | **5** |
| Páginas sem nenhum backlink | **249 (98%)** |
| Páginas com a ficha inteira vazia (sem "Dentro de"/"Cai em"/"Quando") | **153 (60%)** |
| Resumos sem nenhum subtítulo (trilho vazio) | 107 |
| Páginas que são só etiqueta + título + corpo + aviso de vazio | 67 |

### As duas conclusões

1. **A página foi desenhada para um resumo que o acervo não tem.** Trilho
   lateral, ficha de três linhas e backlinks, contra um resumo mediano de 250
   palavras sem pai, sem edital, sem evento e sem ninguém citando. O formato
   não está feio — está vazio em 60% dos casos.
2. **O acervo já é um baralho de flashcards escrito.** 416 pares
   "termo → definição telegráfica" (`Dipolo-Dipolo:` → `interação de força
   média entre moléculas polares;`), mais 764 termos em negrito. É o insumo
   exato da técnica mais bem evidenciada que existe, servindo hoje só de
   tipografia.

O problema pedagógico central não é o layout: **a página só oferece
releitura.** Na revisão de Dunlosky et al. (2013), releitura e grifo são de
*baixa* utilidade; prática de teste e prática distribuída são as duas únicas de
*alta* utilidade. Hoje o site tem grifo e releitura em 254 páginas e teste em 22.

---

## Proposta A — a página fecha pedindo recuperação  *(recomendada)*

**Princípio:** efeito de teste / prática de recuperação (Roediger & Karpicke,
2006). Releitura produz confiança sem memória — a *ilusão de fluência*. Puxar da
memória não só mede: grava. Errar e depois ver a resposta grava melhor do que
não ter tentado.

**Mecanismo:** cada `h2[data-corrido="sim"]` já é um par pergunta/resposta
escrito pelo autor. No fim do resumo, onde hoje mora "Nenhum outro resumo cita
este ainda", entra **"Fechar o resumo"**: 4–6 cartões tirados do próprio corpo
(frente = o termo; verso = o parágrafo que o segue). O aluno tenta lembrar,
revela, marca *sabia / não sabia*.

**Sem conteúdo novo e sem IA inventando resposta.** O verso é o texto do autor.

**O que destrava de graça:**
- A aba "Para refazer" da `/resumos` sai de 25 itens para ~416.
- Os dias seguidos da `/conta` passam a medir estudo, não visita.
- Abre caminho para "revisar em N dias" (prática distribuída, a outra técnica
  de alta utilidade).

**Custo:** zero de conteúdo; médio de código (extrair pares do HTML — há
precedente em `ancorarTitulos`, `extrairTrilho`, `renderizarQuestoes`; componente
de cartão; gravação em `respostas` ou tabela nova).

**Risco:** nem todo par vira cartão bom ("Propriedades dos compostos
influenciadas pelas interações" tem três bullets como verso). Regra
conservadora: **só `data-corrido="sim"`**, mais um veto por cartão no editor.
Vale aqui a mesma lei da decisão 22: nunca um mecanismo que corrige errado.

---

## Proposta B — a página abre enquadrando, e o corpo vem em etapas

**Princípios:** organizador prévio (Ausubel, 1960 — o fator isolado mais
importante é o que o aluno já sabe; o organizador dá o gancho onde pendurar o
novo); sinalização e segmentação (Mayer) — marcar a estrutura poupa o esforço
gasto em descobri-la, e material em pedaços com ritmo controlado é melhor retido
que fluxo contínuo. É economia de carga cognitiva.

**Mecanismo:**
- Promover o primeiro parágrafo a **definição** destacada — ele já é o
  organizador prévio em quase todo resumo, só está vestido de bullet.
- Trocar a ficha que some em 60% das páginas por um cabeçalho que **sempre**
  tem o que dizer (tempo de leitura, nº de pontos, quando você abriu da última
  vez, o que a página responde).
- Segmentar o corpo por seção, com progresso.

**Custo:** baixo (quase tudo CSS e front-end; nada de banco). As linhas de
"esta página responde" não se derivam do texto com honestidade — ou o autor
escreve, ou mostram-se só os subtítulos.

**Limite a declarar:** B melhora orientação e compreensão no momento, **não
retenção**. Feita sozinha, a página fica melhor e o aluno esquece na mesma
velocidade. B é complemento de A, nunca substituto.

---

## Proposta C — a resolução abre em passos e desbota

**Princípios:** efeito do exemplo resolvido (Sweller & Cooper, 1985) — para quem
ainda não domina, estudar exemplos resolvidos ensina mais, em menos tempo, que
resolver problemas; resolver do zero sem base consome a memória de trabalho na
busca por caminho. Refinamento necessário: **desbotamento** (Renkl & Atkinson) —
exemplo completo → com o último passo faltando → com dois faltando → problema
inteiro. E o *expertise reversal effect*: para quem já domina, o exemplo
resolvido vira redundância e atrapalha; por isso o apoio se retira.

**Mecanismo:** a `.resolucao` hoje é `<details>` — fechada ou aberta. Passa a
abrir um passo por vez, com o último a cargo do aluno.

**Custo:** alto, e de conteúdo: exige o autor quebrar cada resolução em passos.
Alcance hoje: 22 resumos. O `CONTEXTO.md` já registra isso na decisão 22 —
*"O preço declarado: o conteúdo."* C cobra o mesmo preço antes de ele ter sido pago.

---

## Recomendação registrada

**A como movimento principal, B junto (é barato e conserta o vazio), C guardado
para quando o acervo de questões crescer.**

E uma correção de uma linha, independente de tudo: **"Nenhum outro resumo cita
este ainda" aparece em 249 das 254 páginas** — num produto cujo posicionamento é
que as conexões são o mecanismo. Deve sumir quando não há backlink.

## Regras do repo que qualquer uma das três tem de respeitar

- **Títulos do corpo não têm tamanho próprio** — todo título é o nome de um
  grafo (decisão 12), e escala tipográfica diria uma hierarquia que não existe.
  Hierarquia vem de margem. `h2/h3/h4` = peso 800 + cor da matéria; `strong` =
  peso 500. Os dois valores andam juntos.
- **O HTML gravado do corpo não muda na leitura.** Os grifos se ancoram no
  texto (decisão 21) e o trilho conta posição (decisão 12d). Transformação é na
  renderização, e sem alterar um caractere do texto.
- **RLS é a proteção real** (decisão 14): regra de acesso nova mora no banco.
- **Fluxo por PR**, build é o único typecheck, não há suíte de testes.

# Modelo de resumo

> **07/10/2026.** Norma editorial de todo resumo **novo** do acervo, e de todo
> resumo antigo que o autor decidir reescrever. Ela não reescreve nada sozinha:
> os 255 resumos que existem continuam como estão até alguém abrir um deles com
> essa intenção.

Três decisões do autor fecham o escopo, e o resto do documento sai delas:

| decisão | escolha | consequência |
|---|---|---|
| para que momento | **ensinar**, com um **fecho de revisão** | o corpo explica o porquê; o fim vira cartões |
| quem escreve | **Claude rascunha, o autor revisa** | o modelo é também uma especificação de rascunho (§5) e uma lista de conferência (§6) |
| o que é uma unidade | **um assunto do caderno** | não se reorganiza o acervo pelo edital; o edital só diz o que falta |

## 1. Por que mudar

Medido no banco em 07/10/2026: mediana de **250 palavras** por resumo, 108 sem
nenhum subtítulo, 9 com o corpo vazio, 21 com questão e **7 conexões** no acervo
inteiro. O formato telegráfico (`Termo:` → definição curta) é ótimo para quem já
estudou e inútil para quem nunca viu o assunto: ele diz *o quê* e quase nunca
*por quê*.

Os melhores resumos do acervo já mostram o que falta aos outros, e o modelo é a
generalização deles:

- **Existencialismo** — a angústia de Kierkegaard explicada pela beira do
  precipício e pela escolha do curso no 3º ano. Analogia e exemplo próximo do
  aluno: é *isso* que ensina.
- **Movimento circular** — grandeza, figura, regra de três que leva à fórmula,
  exemplo. A fórmula chega depois de o aluno saber o que ela mede.
- **Ciclo celular** — estrutura em níveis (`h2` → `h3` → `h4`) que espelha o
  próprio processo, uma figura por fase.

## 2. Os princípios, e o que cada um obriga

Cada seção do esqueleto existe por causa de uma evidência, não por gosto. Se uma
seção parecer sobrar num resumo, a pergunta é se o princípio dela deixou de valer
ali, não se ela "fica feia".

| princípio | evidência | vira, no resumo |
|---|---|---|
| **Organizador prévio** | Ausubel (1960): o que o aluno já sabe é o fator que mais pesa; o organizador dá onde pendurar o novo | o campo `definicao` e a **abertura** |
| **Sinalização e segmentação** | Mayer: marcar a estrutura poupa o esforço de descobri-la; material em pedaços é mais retido | cada `h2` responde **uma** pergunta; 3 a 6 seções |
| **Elaboração / interrogação** | Dunlosky et al. (2013): perguntar "por que isso é assim?" é de utilidade moderada, e barato | cada seção explica a **causa**, não só o fato |
| **Exemplo concreto** | Weinstein, Madan & Sumeracki (2018): abstração só fixa ancorada em caso | **todo** conceito central tem um exemplo, de preferência do cotidiano do aluno ou do Brasil/MS/PR |
| **Codificação dupla** | Paivio; Mayer (princípio multimídia): palavra + imagem rende mais que palavra sozinha | figura ou tabela onde a informação **é** espacial ou comparativa — nunca enfeite |
| **Exemplo resolvido** | Sweller & Cooper (1985): para iniciante, estudar a resolução ensina mais que resolver do zero | nas exatas e em Química, um exemplo resolvido passo a passo antes da questão |
| **Prática de recuperação** | Roediger & Karpicke (2006); Dunlosky: uma das duas técnicas de **alta** utilidade | a **questão** com resolução escondida e o fecho **Para revisar** |
| **Erros previsíveis** | quem prestou a prova sabe onde ela pega — é o posicionamento do produto | a caixa **Pegadinha** |

O que **não** entra, também por evidência: resumo do resumo no topo (repetir não é
recuperar), lista de "curiosidades" (detalhe sedutor, Harp & Mayer 1998 — atrai a
atenção para o que não cai) e escala tipográfica nos títulos (decisão 12).

## 3. O esqueleto comum

Vale para todas as matérias. A §4 diz o que muda **dentro** do corpo de cada uma;
a ordem abaixo não muda.

| # | parte | como se grava (blocos que o editor já tem) | regra |
|---|---|---|---|
| 0 | **Definição** | campo `definicao` do resumo | uma frase, ≤ 160 caracteres, diz o que é **e** para que serve. É o que aparece no cartão da lista e no balão do mapa |
| 1 | **Abertura** | 1 a 3 `<p>` comuns, antes do primeiro grafo | situa: de onde o assunto vem, que problema resolve, ou a pergunta que o resumo vai responder. Sem título |
| 2 | **Corpo** | grafos `h2` (3 a 6), `h3`/`h4` dentro deles; `Termo:` corrido (decisão 12c) para definição | cada `h2` é uma pergunta respondida. Dentro dela: **ideia → porquê → exemplo**, e só então fórmula, lista ou detalhe |
| 3 | **Exemplo resolvido** | `h2` "Exemplo resolvido" (exatas, Química; opcional nas outras) | passos numerados, cada passo dizendo **o que** se faz e **por quê** |
| 4 | **Pegadinha** | caixa (tabela de uma célula, decisão 8c), começando por `<strong>Pegadinha:</strong>` | 1 a 3 erros que a prova explora. Se o autor não souber de nenhum, a caixa sai — não se inventa pegadinha |
| 5 | **Questão** | `<aside class="questao">` com `<div class="resolucao">` (decisões 9b e 22), gabarito marcado | ao menos **uma**. Prova real (vestibular ou escola) com a origem escrita; questão criada leva o rótulo "Exercício" e nunca nome de vestibular |
| 6 | **Para revisar** | `h2` "Para revisar" seguido de 4 a 8 `h3` corridos `Termo:` → uma linha | o fecho de revisão. Cada par é um cartão: a frente (`h3`) cabe numa pergunta, o verso numa frase. É o insumo da proposta A de `pedagogia-da-pagina-do-resumo.md` |
| 7 | **Ligações** | `[[wikilinks]]` **no meio do texto**; "Está dentro de" (`pai_id`); edital; evento | ao menos **dois** `[[…]]`, onde o conceito aparece — nunca numa lista solta no fim. Pai preenchido sempre que houver um assunto que contenha este |

**Tamanho: 800 a 1.500 palavras.** Abaixo disso, quase sempre falta o porquê ou o
exemplo. Acima, o resumo vira dois: o assunto-pai fica com a abertura e o mapa
do todo, e cada parte vira filho por `pai_id` — é o que dá nó de verdade ao mapa
(decisão 9c, último parágrafo).

Duas regras de forma que valem em todo o corpo:

- **Lista é para itens paralelos, não para raciocínio.** Causa → consequência,
  argumento e explicação vão em parágrafo. A lista de três níveis com uma frase
  partida em cada nível é o defeito mais comum do acervo de hoje.
- **Negrito marca o termo que vai para o "Para revisar"**, e só ele. Se tudo é
  negrito (como em *Colonização na América*), nada é.

## 4. As variantes por matéria

O esqueleto é o mesmo; o que muda é a **estrutura da informação** dentro do
corpo (parte 2) — a ordem em que aquela disciplina constrói conhecimento. Os
`h2` sugeridos abaixo são a espinha, não títulos obrigatórios: o nome de cada
grafo continua sendo o do assunto.

### Física e Matemática — conceito → intuição → fórmula → aplicação

1. **O fenômeno ou o objeto**, em palavras e com figura (o que acontece, o que
   se mede).
2. **A intuição**: um caso extremo ou cotidiano que antecipa a relação ("se o
   raio dobra, a volta dobra").
3. **A fórmula**, em bloco, com **cada símbolo nomeado e com unidade** logo
   abaixo, numa tabela de duas colunas (símbolo | significado e unidade).
4. **De onde ela sai**, quando a dedução couber em três passos; se não couber,
   a frase "isto se deduz de [[…]]".
5. **Gráfico** quando a relação tiver um (MU, MUV, funções).
6. Exemplo resolvido obrigatório. Pegadinhas típicas: unidade, sinal, escalar ×
   vetorial, grau × radiano.

Matemática troca 3–4 por **definição → propriedades → procedimento**, e acrescenta
**casos especiais** (zero, negativo, conjunto vazio).

### Química — macro → micro → símbolo

O triângulo de Johnstone: a química se entende em três níveis, e o aluno trava
quando o texto pula direto para o terceiro.

1. **Macroscópico**: o que se vê (o sal dissolve, o ferro enferruja).
2. **Submicroscópico**: o que acontece com partículas e ligações — figura.
3. **Simbólico**: a equação (`\ce{...}`, decisão 8) ou a fórmula.
4. Cálculo, quando houver, com exemplo resolvido.

### Biologia — estrutura → função → processo → relação

1. **Estrutura**: do que é feito e onde fica — **figura obrigatória**.
2. **Função**: para que serve, e o que acontece quando falha (a doença ou a
   anomalia é o melhor exemplo da função).
3. **Processo**: as etapas **em ordem**, um grafo por etapa quando forem
   cobradas separadamente (o modelo é *Ciclo celular*).
4. **Relação**: com que outro sistema ou nível se liga — é onde nascem os
   `[[wikilinks]]`.
5. **Tabela comparativa** quando o assunto tem um par confundível (mitose ×
   meiose, xilema × floema).

### História — contexto → causas → processo → consequências

1. **Contexto**: onde, quando e quem — com os anos escritos, que é o que
   alimenta a linha do tempo (decisão 9d).
2. **Causas**, separadas em estruturais e imediatas.
3. **Processo**: a sequência de eventos, com data.
4. **Consequências** e **permanências** (o que ficou até hoje).
5. **Tabela comparativa** quando o assunto é um contraste (o modelo é a tabela de
   *Colonização na América*).

Cada evento com ano vira, além do texto, uma linha em `/admin/eventos` ligada ao
resumo.

### Geografia — conceito → fatores → distribuição → impacto

1. **Conceito**.
2. **Fatores**: o que causa ou condiciona.
3. **Distribuição espacial**: onde acontece — mapa ou figura sempre que possível.
4. **Impactos** (sociais, econômicos, ambientais).
5. **O caso brasileiro**, e de MS ou PR quando existir: os vestibulares são da
   UFMS e da UEM, e o exemplo regional é o que a prova adora.

### Filosofia e Sociologia — problema → pensador → conceito → exemplo → contraste

1. **O problema** que o pensador tentava resolver, no contexto dele.
2. **O pensador**, com datas (em `Termo:` corrido, como já se faz).
3. **O conceito central**, com o nome técnico em negrito.
4. **Analogia ou exemplo do cotidiano do aluno** — obrigatório (o modelo é a beira
   do precipício de *Existencialismo*).
5. **Contraste** com outro pensador ou corrente, que é como a prova cobra —
   linkado em `[[…]]`.

### Língua Portuguesa — regra → exemplo → exceção → como a prova cobra

1. **A regra** em uma frase.
2. **Exemplos certo × errado**, numa tabela de duas colunas.
3. **Exceções** que a prova usa.
4. **Como cai**: o tipo de questão (reescrita, identificação, interpretação).

### Literatura e Arte — contexto → características → autores e obras → leitura

1. **Contexto histórico** — `[[…]]` para o resumo de História correspondente.
2. **Características** da escola ou do movimento.
3. **Autores e obras**, e as **obras obrigatórias** do edital em destaque.
4. **Um trecho ou uma obra lida de perto** (texto citado ou figura), mostrando
   onde cada característica aparece.
5. **Contraste** com a escola anterior.

## 5. Como Claude rascunha

A regra 9c do `CONTEXTO.md` — **transportar não é reescrever** — continua valendo
inteira para a **migração** de texto que já existe. O rascunho é outra coisa, e
existe por decisão explícita do autor em 07/10/2026: texto novo, escrito por
Claude dentro deste modelo, que só vira acervo depois que o autor lê e aprova. A
partir da aprovação, quem responde pelo texto é o autor.

**Fontes, em ordem de autoridade:**

1. **O caderno do autor** sobre o assunto (documento-mestre da matéria ou prova
   da escola) — é a base, e o que ele afirma prevalece.
2. **O edital** — diz o escopo: o que tem de estar e até onde ir.
3. **Questões de prova reais** (vestibulares e as 59 provas da escola) — para a
   parte 5 e para as pegadinhas.
4. **Conhecimento consolidado de livro didático** — só para explicação, exemplo e
   analogia, nunca para dado.

**O que Claude não faz:**

- **Não inventa dado.** Ano, número, nome, citação e porcentagem só entram se
  estiverem numa das fontes 1–3. Na dúvida, sai.
- **Não atribui questão.** Questão criada é "Exercício"; nome de vestibular só
  com a prova à mão.
- **Não contradiz o caderno em silêncio.** Se o caderno parecer errado, o
  rascunho segue o caderno e o PR aponta o trecho (mesmo princípio de 9c:
  mostrar e perguntar).
- **Não inventa pegadinha.** Sem prova real que a explore, a caixa sai.

**O que Claude marca para o autor conferir**, na descrição do PR, e não no texto:

- toda analogia e todo exemplo criados (não vieram do caderno);
- todo trecho que vai além do caderno, com a fonte de onde saiu;
- toda divergência entre caderno e edital.

**Como o rascunho chega.** Por enquanto, pelo caminho que já existe: uma
migration em PR (decisão 9c), em que o diff mostra exatamente que texto entra.
**Aprovar o PR é publicar** — não há estado de rascunho no banco. Isso serve
para começar; se o ritmo crescer, o estado de rascunho é a primeira mudança de
código a propor (§8).

## 6. Lista de conferência do autor

Antes de aprovar um resumo, rascunhado ou escrito à mão:

- [ ] A **definição** diz o que é e para que serve, em uma frase.
- [ ] A **abertura** situa o assunto sem título.
- [ ] Cada **`h2`** responde uma pergunta, e há de 3 a 6.
- [ ] Todo conceito central tem **porquê** e **exemplo**.
- [ ] A estrutura do corpo segue a **variante da matéria** (§4).
- [ ] Fórmula: cada símbolo **nomeado, com unidade**.
- [ ] Figura ou tabela onde a informação é espacial ou comparativa.
- [ ] **Exemplo resolvido** (exatas e Química).
- [ ] **Pegadinha** só se for real.
- [ ] Ao menos **uma questão**, com origem e gabarito marcado.
- [ ] **Para revisar** com 4 a 8 pares, cada um respondível de memória.
- [ ] Ao menos **dois `[[wikilinks]]`** no texto, todos resolvendo (sem `<span>`
      de link quebrado na página).
- [ ] **Pai** preenchido, se houver; tópico do **edital** ligado, se houver;
      **evento** cadastrado, se houver ano.
- [ ] Nada que eu não sustentaria na frente de um aluno.
- [ ] Entre 800 e 1.500 palavras, ou dividido em filhos.

## 7. Exemplo aplicado: *Movimento circular* contra o modelo

O resumo que mais se aproxima do modelo hoje, lido parte por parte:

| parte | hoje | falta |
|---|---|---|
| 0 Definição | "Rotação de um corpo ao longo de uma trajetória em forma de circunferência." | dizer para que serve (descrever polias, engrenagens, satélites) |
| 1 Abertura | repete a definição | uma situação: por que a roda de trás da bicicleta gira mais rápido que o pedal |
| 2 Corpo | grandezas angulares com figura e regra de três; fórmulas | o **porquê** antes de cada fórmula; tabela símbolo × unidade; um exemplo concreto por grandeza |
| 3 Exemplo resolvido | ✔ existe | numerar os passos e dizer o porquê de cada um |
| 4 Pegadinha | — | grau × radiano; velocidade angular igual × linear diferente nas polias ligadas pelo eixo |
| 5 Questão | — | uma do PAS UEM ou PASSE sobre transmissão de movimento |
| 6 Para revisar | — | radiano, período, frequência, velocidade angular, aceleração centrípeta |
| 7 Ligações | pai = *Forças da Mecânica*; nenhum `[[…]]` | `[[Dinâmica do movimento circular]]` onde aparece a aceleração centrípeta, e `[[Cinemática]]` na abertura. O pai merece ser conferido pelo autor: o conteúdo é cinemático, e *Cinemática* existe sob o mesmo avô (*Mecânica*) |

O texto que já existe fica. O trabalho é **acrescentar** as partes 1, 4, 5 e 6 e
o porquê dentro da 2 — o que custa muito menos que escrever do zero.

## 8. O que este documento não decide (e as mudanças de código a propor)

Fora do escopo desta norma, e cada uma vira proposta separada, consultada antes:

1. **Molde no editor**: um botão "Novo resumo pelo modelo" que abre com as partes
   1–7 já postas, com o texto-guia da variante da matéria.
2. **Estado de rascunho**: o resumo existe no banco sem aparecer para o aluno
   até o autor aprovar — tira a revisão do PR e a põe no próprio editor.
3. **Cartões a partir de "Para revisar"**: a proposta A de
   `pedagogia-da-pagina-do-resumo.md`, que passa a ter fonte regular e
   conservadora (só os `h3` corridos daquela seção).
4. **Medidor de conformidade** em `/admin/editor`: quais partes cada resumo tem,
   para saber quanto do acervo está no modelo.

E fica de fora, de propósito: **reescrever o acervo de uma vez**. A ordem de
trabalho é o edital — primeiro os tópicos sem resumo da etapa mais próxima da
prova, depois os resumos existentes daqueles tópicos.

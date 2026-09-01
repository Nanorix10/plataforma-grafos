# Identidade visual — Plataforma Grafos

Este documento descreve a **linguagem visual** do site: o que precisa se manter
quando estrutura, textos e layout mudarem.

> **Como ler.** Os valores aqui são os que estão em `src/app/globals.css`, medidos
> no CSS computado — não são intenção nem proposta. Quando este arquivo e o
> `globals.css` divergirem, **o CSS ganha**, e o certo é corrigir este arquivo.
> A razão está no ADR `docs/adr/0001-identidade-visual.md`.
>
> As decisões que sustentam cada escolha vivem no `CONTEXTO.md` (seção "Decisões
> que não dá pra adivinhar lendo o código"), e este documento aponta para elas em
> vez de repeti-las.

---

## 1. Filosofia

**Contorno, não preenchimento.** Botão e destaque usam `border` + cor de texto,
não fundo sólido (`.botao-primario` em `globals.css`). Combina com "material de
estudo" e não com "produto SaaS agressivo". A exceção é o cartão em destaque,
que ganha o anel de acento.

**Profundidade por superfície, e o anel antes da sombra.** A elevação vem de qual
token de fundo o elemento usa (`--page` → `--canvas` → `--paper` → `--raised` →
`--sel`), não de sombra pesada. E toda elevação começa por um **anel de 1px**
(`--sombra`), nos dois temas: no escuro a sombra sozinha não separa camadas. O
claro acrescenta a sombra de verdade por cima.

**O acento é escasso.** O lilás marca só o que é acionável ou é literalmente a
marca. Se tudo tem acento, nada tem.

**Neutro morno, e isso é conforto medido.** Em todos os neutros o vermelho fica
acima do azul. Antes era o contrário — o escuro nascia de um azul-violeta —, e
azul frio é a ponta fria do espectro. Um site onde o aluno passa a tarde não pode
ter a temperatura de uma tela de sistema. A dose é curta de propósito: puxar mais
o amarelo cairia no bege de papel envelhecido, que brigaria com o lilás.

**Três famílias, com papéis que não se cruzam.** Interface, leitura longa e dado
são coisas diferentes e cada uma tem a sua fonte. Não entra uma quarta.

**Os motivos vêm do conteúdo.** Grafo e faixa, e nada além. Ícone ou
ilustração solta que não nasça do que o produto já é não pertence aqui.

---

## 2. Cor

### O mecanismo: `light-dark()`, e uma cópia só

Cada token traz os dois valores lado a lado:

```css
--page: light-dark(#F3F1EC, #14120D);
```

A alternativa seria repetir a paleta num `@media (prefers-color-scheme)` **e** de
novo num seletor `[data-tema]` — três cópias que divergem no primeiro ajuste.
Assim é impossível mudar um tema e esquecer o outro. Ver decisão **4b** do
`CONTEXTO.md`.

Sem escolha do aluno, o aparelho decide (`color-scheme: light dark`). Com escolha,
`<html data-tema="claro|escuro">` fixa um. O botão (`components/BotaoTema.tsx`)
cicla **claro → escuro → seguir o aparelho**; o terceiro estado existe porque, com
só dois, quem clica uma vez fica preso e não volta a acompanhar o celular quando
ele troca sozinho ao anoitecer.

### Superfícies

| Token | Claro | Escuro | Para quê |
|---|---|---|---|
| `--page` | `#F3F1EC` | `#14120D` | fundo atrás de tudo |
| `--paper` | `#FCFAF6` | `#1C1914` | fundo do conteúdo, a superfície mais comum |
| `--panel` | `#F6F3ED` | `#1F1C16` | barra lateral, cabeçalho |
| `--canvas` | — | — | área com textura de fundo (usada por `.quadro`) |
| `--raised` / `--raised-hover` | — | — | cartão e botão secundário, e o hover deles |
| `--sel` | `#EBE7DF` | `#29251D` | item selecionado ou sob o cursor |

### Texto, linha e acento

| Token | Para quê |
|---|---|
| `--ink` | título, ou texto que precisa de leitura máxima |
| `--ink-soft` | corpo enfatizado |
| `--ink-dim` | corpo padrão |
| `--ink-faint` | legenda, metadado, apoio |
| `--line` / `--line-forte` | divisória sutil / borda que precisa aparecer |
| `--acento` | `#5B4BC4` claro, `#9184D9` escuro — algo é acionável |
| `--acento-claro` | texto no hover do acionável |
| `--acento-fraco` | fundo no hover do acionável |
| `--ok` / `--erro` | confirmação / erro |

Dois apelidos existem só para a migração e devem sair quando a última referência
sumir: `--acento-escuro` (aponta para `--acento-claro`) e `--stamp` (aponta para
`--acento`, e era o vermelho-carimbo do desenho antigo).

### A faixa: a única superfície saturada

`--faixa: light-dark(#262A60, #3D4399)`, com `--faixa-ink: #F3F5FE` e
`--faixa-dim: #C7C8F0` fixos.

**Ela JÁ FOI cor única nos dois temas, e isso foi desfeito em agosto/2026.** A
medição mostrou por quê: `#262A60` dá 11,76:1 contra o fundo claro e **1,41:1**
contra o escuro — praticamente o mesmo valor do fundo. No claro ela quebrava a
página; no escuro era um retângulo invisível, e o respiro de cor que a decisão
existia para proteger já estava perdido justamente no tema onde ela mandava não
mexer.

Agora a lógica **inverte** entre os temas: mancha escura sobre papel no claro,
mancha clara sobre a página no escuro. Mesmo matiz (236) e mesma saturação
(43%) — só o tom e a luz mudam.

O lado escuro dá 2,19:1 contra o fundo, e isso basta: a referência num tema
escuro é o quanto `--paper` já se separa de `--page` (1,28:1), que lê como
cartão distinto sem esforço. 3:1 é limiar de COMPONENTE de interface, não de
superfície decorativa.

**Regra dura: no máximo um elemento em `--faixa` por tela.** Dois pontos gritando
na mesma rolagem anulam um ao outro. Na dúvida entre `--faixa` e `--acento`, use
`--acento`.

### A cor da matéria

`lib/materias.ts` traz o par claro/escuro de cada uma das 12 matérias, e o valor
desce por `--cor-materia`. Ela pinta **título e `<strong>`** — o que o olho procura
ao varrer o resumo — e nunca o texto corrido. Ver decisão **4c**.

Três coisas que não dá para adivinhar:

- **Resumo bloqueado não recebe cor.** Fica em `--ink-faint`: cor cheia o faria
  parecer disponível e desmentiria o cadeado ao lado.
- **Cada título usa a cor da PRÓPRIA matéria**, não a do bloco onde está.
- **A cor nunca é a única pista.** O ponto de matéria na barra lateral continua
  existindo, para quem não distingue os matizes.

> As 12 matérias passam em WCAG AA (≥4,5:1) nos dois temas sobre `--paper`,
> `--panel` e `--raised`. As mais apertadas são Redação (4,53) e Física (4,81).
> **Quem mexer num tom está mexendo em texto de 12,5px, não num ponto de 6px** —
> refaça a conta.

### A regra que fecha a seção

Se um componente precisa de um tom que não está no `:root`, **o tom entra no
`:root` primeiro**. Antes deste sistema havia 27 cores soltas pelo código.

---

## 3. Tipografia

### As três famílias

| Variável | Família | Papel |
|---|---|---|
| `--fonte-texto` | **Inter** | interface e prosa da UI |
| `--fonte-resumo` | **Nunito** | corpo do resumo — o texto que o aluno lê por horas |
| `--fonte-mono` | **IBM Plex Mono** | número, código e fórmula. Nunca em frase |

Vêm por `next/font`, não por `@import` no CSS: o import encadeia três viagens de
rede antes do primeiro texto. Ver decisão **7**.

A **Nunito é separada de propósito**: a interface pode mudar de cara sem afetar a
leitura, e vice-versa. A Fraunces e a Work Sans saíram no redesenho escuro — a
serifa dava ar de revista quando o pedido é material de estudo.

**Não introduzir uma quarta família.**

### A escala: sete degraus, e nada entre eles

```css
--t-mini:   0.75rem;   /* 12px — rótulo, contador */
--t-peq:    0.8125rem; /* 13px — apoio, item de menu */
--t-base:   0.9375rem; /* 15px — interface */
--t-medio:  1.0625rem; /* 17px — corpo do resumo */
--t-grande: 1.375rem;  /* 22px — título de seção */
--t-titulo: 1.75rem;   /* 28px — título de página */
--t-hero:   clamp(2.375rem, 4.6vw, 3rem); /* 38→48px — só o h1 da landing */
```

**Diferenças de 0,5px não são percebidas como intenção, só como desleixo.** Se um
tamanho parece faltar, quase sempre o certo é usar o degrau vizinho — foi assim
que os `30px` e `32px` da landing colapsaram em `--t-titulo`.

> [!warning] A escala não tem degrau abaixo de 12px, e a linha do tempo precisa de um
> `/linha-do-tempo` usa **11px cru** nos numerais miúdos — marca de ano, linha de
> data do rótulo, balão do fio-guia. É **exceção declarada**, como o `--t-hero`:
> empurrar a linha de data para 12px alarga todo rótulo contra a densidade que o
> teto de faixas veio ganhar (decisão **9d-bis** do `CONTEXTO.md`). O resto da
> tela usa `--t-peq`, `--t-mini` e `--t-base` — antes eram sete tamanhos avulsos
> entre 10,5 e 14px, vários a 0,5px de distância um do outro.
>
> **O grupo `(app)` inteiro ainda está fora desta escala**: ~145 tamanhos
> arbitrários, incluindo `9.5px` e `13.5px`, e nenhum arquivo usando `var(--t-*)`.
> A linha do tempo foi a primeira a entrar. Alinhar o resto é tarefa própria, e
> quem for fazê-la decide antes o que fazer com os numerais miúdos do mapa, que
> têm o mesmo problema.

`--t-hero` é o único que escala com a tela, e existe só para o `h1` da landing: é
a primeira coisa que um desconhecido lê. Nas outras telas quem chegou já sabe onde
está.

### Peso

Peso **500** é o peso de destaque da interface. Evite 700/800 na UI.

**No corpo do resumo a regra é outra, e é o oposto:** título em **800**, `<strong>`
em **500**, e a distância entre os dois É a decisão. Se o negrito marca o grafo,
ele não pode marcar mais nada. Os dois valores são um par; mexer num sem o outro
fecha a distância de novo. Ver decisão **12** — e note que ali o título **não tem
tamanho**: hierarquia é ritmo de margem, porque grafo não é "maior", é "contém".

---

## 4. Forma

```css
--raio: 12px;      /* cartão, botão, painel — o padrão */
--raio-peq: 9px;   /* badge, tag, chip */
```

**12 e 9, e não 8 e 6.** Canto é a parte do desenho que o olho lê como postura:
quanto mais reto, mais formal. A folga a mais tira do site o ar de painel de
controle. Não vai além disso — raio grande faz cartão de texto virar balão de
aplicativo de conversa, e o que está dentro deles é matéria de prova.

Nunca 0 (não é "hairline newspaper") nem pill (não é "app consumer").

```css
--sombra:          0 0 0 1px var(--line-forte);          /* anel, uso corriqueiro */
--sombra-profunda: light-dark(0 12px 28px …, 0 16px 40px …);
--sombra-alta:     var(--sombra), var(--sombra-profunda); /* destaque, raro */
```

`--sombra-profunda` vive num token próprio porque `light-dark()` separa seus dois
valores por vírgula, e uma lista de sombras também usa vírgula: as duas coisas não
cabem na mesma função.

---

## 5. Ritmo

```css
--ritmo-secao: clamp(3.5rem, 7vw, 5rem); /* 56→80px */
```

A distância entre um assunto e o próximo nas páginas públicas. Um valor só: cinco
espaçamentos parecidos não leem como cinco intenções, leem como nenhuma. Encolhe
no celular porque 80px numa tela de 390px empurra a seção seguinte fora do
primeiro alcance do polegar.

No corpo do resumo o espaçamento é feito pela "coruja" (`> * + *`), que põe tudo
na margem de **cima** — a de baixo do anterior é sempre 0. Quem mexer ali precisa
ler a decisão **12c**: o título corrido depende dessas margens serem iguais.

---

## 6. Motivos de marca

Dois elementos que vêm do próprio nome e conteúdo do produto — eram três, e o
terceiro foi retirado depois de testado (ver abaixo). A marca cresce a partir
deles, e não somando ícone genérico por cima.

### Grafo

O nome do produto, literal: nós conectados representam assuntos interligados. É o
que o site inteiro já é por dentro (`pai_id` contém, `conexoes` cita).

**Como textura** (`components/marca/Grafo.tsx`): sobre `--canvas`, atrás do
conteúdo, nunca como ilustração central. Arestas em `--line-forte`, maioria dos
nós em `--ink-faint`, **poucos** em `--acento`, opacidade ~38%.

**Como demonstração** (`components/landing/GrafoInterativo.tsx`): aí ele é o
protagonista, porque a função dele é ensinar. Usa as duas linhas do `/mapa` — e
essa correspondência é obrigatória:

| Linha | Significa | Onde mora |
|---|---|---|
| cheia | **contém** — estrutura escrita à mão | `resumos.pai_id` |
| tracejada | **cita** — referência achada no `[[wikilink]]` | tabela `conexoes` |

Quem aprende a ler uma delas na landing não pode ter que reaprender dentro do
produto.

**O desenho é fixo, escrito à mão, em ambos.** Layout aleatório mudaria a cada
carregamento, e marca que muda de forma não é marca. E nenhum dos dois usa d3: a
landing é a página que todo visitante baixa, e a decisão **10** vale mais aqui do
que dentro do `/mapa`.

### ~~Cartão-resposta~~ — retirado em agosto/2026

**Não é mais um motivo de marca.** Ficou aqui enquanto foi hipótese; foi
testado e não passou.

A afirmação original dizia que bolhas de múltipla escolha eram "o elemento mais
diferenciado disponível, porque nenhum concorrente do nicho tem isso". Ela veio
de um documento anterior e foi preservada sem auditoria quando este arquivo foi
reescrito a partir do código.

Ela é mais fraca que os outros dois, e a diferença importa: o **grafo** é o nome
da empresa E a estrutura de dados do produto (`pai_id`, `conexoes`, "todo
título é um nó"); a **faixa** é um token com propósito escrito no CSS. O
cartão-resposta se apoiava só no ASSUNTO do produto ser vestibular — que é o
mesmo grau de conexão que um ícone de birrete teria.

O que decidiu foram duas evidências, não a argumentação:

1. Ele esteve na primeira dobra da landing por meses, ocupando metade da
   largura, e a primeira pessoa próxima do produto a olhar com atenção não
   entendeu o que era.
2. Foi levado ao acervo para ganhar o lugar dizendo algo verdadeiro — uma bolha
   por prova, indicando em qual vestibular cada matéria cai — e **perdeu** para
   a variante que mostra os assuntos de cada matéria. E duplicava a matriz de
   cobertura que `/planos` já traz, num lugar pior.

Não sobrou superfície onde ele diga algo que o site precise dizer. Se alguém
quiser trazê-lo de volta, o ônus é mostrar onde ele informa — não onde ele
combina.

### Faixa

Cor fixa, para destaque pontual. Ver a regra dura na seção 2.

### O que a marca ainda NÃO tem

**A logo.** `components/Marca.tsx` tem o encaixe pronto e `Simbolo` devolve `null`
de propósito: **a logo é do autor e ele mesmo vai desenhá-la.** Uma logo genérica
de encher espaço seria pior do que nenhuma, porque pareceria decidida. As
instruções do que o SVG precisa ter estão no cabeçalho daquele arquivo.

O **ícone de aba** (`src/app/icon.svg`) é outra coisa e já existe: três nós e duas
arestas, uma cor cravada, forma cheia. Regras diferentes das da logo, e o motivo
está no arquivo.

---

## 7. Movimento

### ~~Quase nada se move~~ — retirado em setembro/2026

> ~~Quase nada se move, e isso é a escolha. Nenhuma animação de entrada por
> rolagem, nenhum pulso, nenhuma física. O que muda é o que o dedo ou a tecla
> causou.~~

A proibição foi **retirada a pedido do autor em 01/09/2026**, e o que a derrubou
não foi gosto: ela já não descrevia o site. A landing tinha virado exceção
declarada seis dias antes (§9 e decisão **13b**), com cascata de entrada, stagger
e parallax de rolagem — três coisas que o parágrafo acima proíbe pelo nome. Uma
regra que a maior página do site já contradiz não está governando nada; está só
cobrando das telas pequenas um rigor que as grandes não pagam.

Fica registrada, e não apagada, porque o argumento dela continua valendo como
**instinto**: material de estudo não pede espetáculo, e movimento que não foi
pedido por um gesto atrapalha quem está lendo. O que muda é que isso virou
critério, e deixou de ser proibição.

### A régua que fica no lugar

**Todo movimento responde a alguma coisa.** Um gesto (toque, tecla, rolagem), ou
uma mudança de estado que o site causou e precisa mostrar. Movimento que começa
sozinho e se repete — pulso, respiração, brilho passeando — continua fora, e
agora por um motivo dizível: ele compete com o texto, e aqui o texto é o produto.
A única exceção é o `.esqueleto`, que pulsa justamente para dizer "ainda não
chegou".

**Três durações, e nada entre elas.**

| Duração | Para quê |
|---|---|
| **120ms** | troca de estado: cor, borda, sombra. É o que já estava aqui. |
| **180ms** | algo abre, fecha ou muda de tamanho na tela |
| **200–400ms** | algo entra ou sai da tela inteira: gaveta, painel, transição de contexto |

Acima de 400ms, só na landing, que é exceção declarada e tem outro trabalho a
fazer (§9).

**Entrada desacelera, saída acelera.** `ease-out` para o que chega, `ease-in`
para o que sai, `ease` para troca de estado. Nada de overshoot fora da landing:
o quique é simpático numa primeira dobra e é ruído numa barra lateral que a
pessoa usa cem vezes por dia.

**Stagger tem orçamento: 500ms no total, e ele estoura fácil.** Uma matéria com
46 resumos a 25ms cada dá 1,15s — inaceitável. A saída é **teto no atraso**, não
atraso menor: os primeiros seis itens escalonam, o resto chega junto. Quem olha
lê a cascata; quem não olha não espera.

**`prefers-reduced-motion` não é tratado caso a caso.** O `globals.css` zera
duração de transição e de animação globalmente, então qualquer coisa nova já
nasce coberta. O que NÃO está coberto é animação escrita em JavaScript, que
ignora CSS — foi por isso que o `Movimento.tsx` da landing precisou do
`gsap.matchMedia()` além da regra global.

**Conteúdo escondido não pode ficar focável.** Isto não é estética e é o erro
mais fácil de cometer ao animar: um bloco recolhido com `height: 0` e
`overflow: hidden` continua no Tab, e quem navega por teclado cai dentro do que
não está na tela. Use `inert` no invólucro fechado.

---

## 8. A regra de ouro

Todo elemento novo tem que responder **sim** a pelo menos uma:

1. Usa um token da lista acima, sem inventar cor nem tamanho novo?
2. É contorno, e não preenchimento sólido — a menos que seja o elemento em
   destaque da tela?
3. Nasce do grafo, do cartão-resposta, ou é neutro o bastante para não competir
   com os dois?

E uma que não é negociável: **contraste é medido, não estimado.** Este projeto já
teve comentário no CSS afirmando um contraste que a medição desmentiu. Todo par
novo de cor e fundo vai medido nos dois temas antes de entrar.

---

## 9. A landing é exceção declarada, desde 31/08

Este documento descreve a linguagem visual do **produto**. Desde 31/08 a
**landing** (`/`) não a segue: ela tem gramática própria, monoespaçada, com
reveal por rolagem e uma primeira dobra saturada e escura nos dois temas.

Foi decisão do Leandro, a partir de uma referência que ele trouxe. O que a
landing suspende — e que **continua valendo em todo o resto do site**:

- **§3, a mono "nunca em frase".** Lá ela é a única família.
- **§7, "quase nada se move".** Lá há animação de entrada por rolagem, com
  cascata, e uma parallaxe de fundo presa à rolagem. Desde 31/08 o movimento
  de lá é DIRIGIDO: duração e amplitude variam com o peso do elemento (um
  rótulo não entra igual a um `h1`), e a curva é a do registro Premium, não a
  ease-out seca de antes. Quem manda é `landing/Movimento.tsx`; a decisão
  **13b** do `CONTEXTO.md` traz a régua e o que ela custou.
- **§2, o acento escasso e o neutro morno.** A dobra é um campo saturado.
- **§6, "os motivos vêm do conteúdo".** A textura de grafo do fundo é
  decorativa.

A gramática vive em `globals.css`, escopada em `.landing`, com o motivo escrito
em cima dela — e a decisão **13** do `CONTEXTO.md` registra o que ela custou.
Vale a regra de sempre: o CSS é a fonte da verdade, e este documento é que se
corrige.

`/planos` divide o layout de `(site)` com a landing e **não** foi redesenhada.
É o motivo de o escopo existir.

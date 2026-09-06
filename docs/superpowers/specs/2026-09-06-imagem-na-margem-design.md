# A imagem ganha a margem

**Data:** 2026-09-06
**Estado:** aprovado, a implementar

---

## O pedido, e o que ele corrige

"Áreas laterais para inserir imagens ao lado, para não atrapalhar o texto" —
mais "opções de acomodação como no Google Docs".

O que existe hoje para pôr imagem ao lado do texto é o `float` (`aoRedorEsq` /
`aoRedorDir`, decisão 11c). Ele resolve *uma* coisa e cobra outra: a figura mora
**dentro** da coluna, então o parágrafo se deforma em volta dela — as linhas
mudam de comprimento no meio da frase e voltam ao normal quando a figura acaba.
É exatamente o "atrapalhar o texto" do pedido.

A margem da folha, enquanto isso, está vazia. São **150px de cada lado** no
padrão (`src/lib/pagina.ts`), ajustáveis pela régua. O desenho abaixo dá à
figura esse lugar, e o texto não se mexe uma letra.

## O que NÃO entra, e por quê

O pedido citava o Google Docs. Três modos de lá continuam recusados, pelo mesmo
motivo da decisão 11c — e ele não mudou:

| modo do Docs | por que não |
|---|---|
| atrás do texto / à frente do texto | pedem posição absoluta sobre o texto, que só fecha com página de largura fixa; a coluna do resumo muda com a régua e com a tela |
| fixar posição na página | não há páginas: o resumo é uma rolagem só |
| recortar / máscara de forma | pedem interface de recorte própria; `altura` + `object-fit: cover` cobre o caso simples |

**A área lateral é uma resposta melhor à necessidade que "atrás do texto"
tentava atender**: dar à figura um lugar próprio em vez de fazê-la disputar
espaço com o parágrafo. Ela cabe num modelo de coluna fluida; os três acima não.

Fica fora também, **como projeto seguinte e não como esquecimento**, a *faixa
lateral* — o texto encolher para abrir uma coluna maior ao lado. Ver "O projeto
seguinte", no fim.

## O modelo

### Duas `quebra` novas, não um atributo novo

`quebra` já é o eixo "como a figura se relaciona com o fluxo do texto":
`bloco | emLinha | aoRedorEsq | aoRedorDir`. Morar na margem é uma posição
**desse mesmo eixo** — nenhuma figura é bloco e lateral ao mesmo tempo. Entram:

```
margemEsq | margemDir
```

O lado vai **dentro do valor**, como `aoRedorEsq`/`aoRedorDir` já fazem, e não
num `alinhamento` à parte. Assim o `parseHTML` continua lendo um `data-quebra`
só, e cada valor tem a sua regra de CSS, sem cruzamento de seletores.

O HTML gravado ganha um valor novo e nada mais — sem classe nova, sem elemento
novo, sem wrapper:

```html
<figure class="figura" data-quebra="margemDir"> … </figure>
```

Isso mantém de pé a regra que manda em toda a extensão de imagem: **a página do
aluno renderiza HTML cru, sem React, então tudo o que se vê tem de sair do que
está gravado.**

### A geometria: `float` mais margem negativa do tamanho da régua

```css
.conteudo-resumo .figura[data-quebra='margemDir'] {
  float: right;
  margin-top: 0.3em;
  margin-right: calc(var(--margem-dir, 0px) * -1);
  max-width: calc(var(--margem-dir, 0px) - var(--vao-lateral));
}
.conteudo-resumo .figura[data-quebra='margemEsq'] {
  float: left;
  margin-top: 0.3em;
  margin-left: calc(var(--margem-esq, 0px) * -1);
  max-width: calc(var(--margem-esq, 0px) - var(--vao-lateral));
}
```

`--vao-lateral` é o respiro entre a figura e o texto (16px).

Três coisas fazem esse mecanismo ser o certo aqui:

1. **É o espelho do `data-escapa`, que já funciona em produção.** Mesma ideia —
   margem negativa do tamanho exato da régua —, mesmas variáveis
   `--margem-esq`/`--margem-dir` no editor e na leitura. Não é modelo de layout
   novo; é a segunda regra de uma família que já existe.
2. **A caixa do float não reserva espaço dentro da coluna.** Com largura 134 e
   margem `-150`, o que sobra dentro do texto é negativo: o parágrafo não
   encurta uma letra. Verificado na maquete.
3. **A âncora vertical sai de graça.** A figura nasce na altura do parágrafo em
   que foi inserida, sem `position: absolute` e sem contexto de posicionamento.

O `clear: both` que já existe no fim de `.conteudo-resumo` continua cobrindo a
figura no fim do resumo.

### O caso "não cabe" tem duas metades, e o CSS resolve só uma

A régua deixa a margem chegar a 20px (`MARGEM_MINIMA`). O `max-width` amarrado à
variável impede a figura de sair da folha — mas **não impede que ela vire um
selo ilegível**. Com a margem em 60px a figura fica com 44px: não quebra nada, e
não serve para nada. O aluno recebe isso como se fosse intenção.

Por isso o desenho tem também um **piso de utilidade: 90px.** Abaixo dele o modo
lateral não fica em silêncio — o painel avisa que a margem daquele lado está
estreita demais e nomeia o gesto (arrastar a régua). É a mesma regra que a tela
de espera ensinou em 05/09: **o modo de falha a vigiar é o que falha calado.**

## O editor

### Onde o modo aparece

No grupo de quebra do `PainelImagem.tsx`, que o próprio código já descreve como
"a decisão que mais muda o desenho, então vem primeiro":

```
▭ Quebrar texto   ⏤ Em linha   ◧ Texto à direita   ◨ Texto à esquerda
◐ Margem esquerda   ◑ Margem direita
```

**O nome muda de eixo, e é de propósito.** Os rótulos de hoje dizem onde fica o
*texto* ("Texto à direita"), porque é o texto que se deforma. Os novos dizem
onde fica a *figura*, porque o texto não se mexe — não há lado de texto a nomear.

### Duas exclusões, uma delas obrigatória

- **`alinhamento` fica inerte** no modo lateral (as regras são
  `[data-quebra='bloco'][data-alinhamento=…]`) e some do painel.
- **`escapa` é o oposto exato do modo novo** — ele faz a figura comer as duas
  margens; o modo lateral a faz morar dentro de uma. Ligados juntos, o
  `width:auto` e as margens negativas dos dois lados do `escapa` brigam com o
  `float`, e quem ganha depende da ordem das regras.

A exclusão é **dupla, de propósito**: o painel desliga um ao ligar o outro, *e*
o CSS se protege com `[data-escapa='sim']:not([data-quebra^='margem'])`. O
painel sozinho não bastaria — já há HTML gravado com `escapa`, e trocar o modo
dele deixaria os dois atributos na mesma figura.

### Uma invariante nova para a porcentagem

Hoje `50%` quer dizer metade da coluna. No modo lateral isso não fecha: 100% da
coluna são 620px numa margem de 150. A regra passa a ser uma só, sem exceção:

> **A porcentagem é sempre do espaço onde a figura mora** — a coluna, quando ela
> está no texto; a margem, quando está na lateral.

Vale para os botões `25/50/75/100%` e para o denominador das alças.

### As alças

`AlcasImagem.tsx` calcula `pct = nova / larguraDaColuna` e grava de 5% a 100%.
Nos modos laterais o denominador passa a ser a largura da margem daquele lado —
senão o número gravado diria uma coisa e o CSS mostraria outra, que é a versão
silenciosa do comentário que mente.

Hoje **só as alças da direita puxam** (11c: as da esquerda exigiriam mover a
imagem enquanto ela cresce). Nos modos laterais a borda de fora é a presa e a de
dentro é a que cresce, então **a alça que puxa é a de dentro** — a que aponta
para o texto. Em `margemEsq` isso já é a alça direita, que existe; em
`margemDir` é a esquerda, e é o que precisa ser habilitado. Mudança contida:
qual alça pinta e o sinal do delta.

A alternativa considerada — desligar o arrasto no modo lateral e sizar só pelos
botões — foi recusada: tiraria em silêncio um gesto que o autor já tem.

### Celular

Abaixo de **767px** o modo lateral vira bloco. O número não é o do `float`
(640px) e a diferença é de motivo, não de descuido:

- o `float` cai em **640** porque abaixo disso não sobra linha para contornar;
- o lateral cai em **767** porque é aí que as variáveis da régua deixam de
  valer — sem margem, não há lateral onde morar.

## O conserto que este trabalho atravessa

A folha do editor aplica as margens da régua em `sm:` (**640px**,
`EditorCorpo.tsx`); a página do aluno aplica em `md:` (**768px**,
`resumos/[slug]/page.tsx`). **Entre 640 e 767px os dois discordam hoje:** o
editor recua o texto pela régua e a leitura não. A regra de celular do `escapa`
no `globals.css` usa `max-width: 767px`, ou seja, está casada com a página do
aluno e desalinhada do editor — nessa faixa, "Sair da margem" já se comporta
diferente nos dois lados.

É defeito vivo, anterior a este projeto, e o modo lateral o tornaria muito mais
visível: figura na margem no editor, sem margem nenhuma na leitura. **Os dois
vão para `md:` dentro deste trabalho** — é o conserto pontual no código que o
trabalho atravessa, não refatoração à parte.

## Fronteiras

- Nenhuma migration. Nada de banco: o modo é atributo de HTML dentro do corpo do
  resumo, que já é uma coluna de texto.
- Nenhuma dependência nova.
- O acervo publicado não muda de forma: nenhuma figura existente ganha o modo
  novo sozinha. `quebra` continua com `bloco` por padrão.
- A extensão de tabela (`escapa` compartilhado) **não** ganha modo lateral.
  Tabela na margem de 150px não teria coluna nenhuma.

## Verificação

Não há suíte de testes no projeto (`CLAUDE.md`), então a verificação é medida e
olhada, não automatizada:

1. **`npm run build`** — é o único typecheck. Lint com os mesmos 5 erros
   pré-existentes de `admin/editor/`, nunca mais.
2. **As duas telas lado a lado, na mesma largura:** a figura lateral tem de
   ocupar o mesmo lugar no editor e em `/resumos/[slug]`. É o teste do WYSIWYG,
   e é o que pega o `sm`/`md`.
3. **A régua nos três pontos:** margem padrão (150), alargada (260) e apertada
   (60). A figura acompanha nos dois primeiros; no terceiro o aviso do piso de
   90px aparece.
4. **A faixa de 640–767px**, que é onde o defeito do `sm`/`md` mora.
5. **Celular (< 767px):** a figura lateral vira bloco, nos dois lados.
6. **Reabrir o resumo depois de salvar:** o `parseHTML` tem de reler
   `data-quebra="margemDir"` e devolver o modo — sem isso o modo se perde no
   primeiro fechamento, calado.
7. **Uma figura com `escapa` gravado, trocada para lateral:** os dois atributos
   não podem coexistir.

## O projeto seguinte: a faixa lateral

Decidido junto com este desenho: **A agora, B depois.**

A "faixa lateral" — o texto encolher naquele trecho para abrir uma coluna maior
ao lado — resolve o que a margem não resolve: figura grande. O custo apareceu na
maquete e é estrutural: para o texto ficar ao lado da faixa, **o corpo precisa
ser partido em dois blocos**. Isso não é atributo da imagem; é uma *região de
duas colunas*, nó novo no esquema do TipTap, com o autor tendo que cortar o
parágrafo. É outro projeto, com a sua própria spec.

## Correção a fazer no `CONTEXTO.md`

A seção "Imagem: feito em agosto/2026" afirma que **redimensionar arrastando o
canto e legenda "ficaram de fora de propósito"**. Os dois existem —
`AlcasImagem.tsx` e o atributo `legenda` com `<figcaption>`. O documento está
desatualizado ali, e corrigir isso entra neste trabalho: num repositório que
documenta em profundidade, o texto que mente é o modo de falha que interessa
vigiar.

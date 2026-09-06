# Recortar a imagem, sem tocar no arquivo

**Data:** 2026-09-06
**Estado:** aprovado, a implementar
**Ordem:** vem depois de `2026-09-06-imagem-na-margem-design.md`. PR próprio.

---

## O que muda de decisão

A decisão **11c** listou "recortar e máscara de forma" entre o que o editor
**não** teria, com este motivo: *"pedem uma interface de recorte própria; a
altura fixa com `object-fit: cover` cobre o caso simples."*

O caso simples deixou de bastar. `altura` corta **sempre pelo meio** — não há
como escolher o pedaço. Isso não cobre o que o autor faz o tempo todo: print com
a barra do Windows em cima, foto de prova com folga nas bordas, página de livro
com sobra em volta, marca d'água num canto.

O motivo da 11c continua verdadeiro (recorte **pede** interface própria) — mas o
custo dela caiu: a sobreposição de alças de `AlcasImagem.tsx` já existe, já é
medida por cima da figura e já some quando a figura é desmarcada. O modo de
recorte reaproveita essa máquina em vez de construir outra.

## O que o recorte é, e o que ele não é

**Não destrutivo, por decisão do autor (06/09).** O arquivo no bucket continua
inteiro; o recorte é CSS, como brilho, contraste, borda e giro. Isso mantém as
três propriedades que o projeto já paga por elas: dá para desfazer sempre, a
mesma imagem serve a dois resumos com recortes diferentes, e nada é reenviado.

**O preço, declarado:** o pedaço cortado continua no arquivo. Quem abrir o
endereço da imagem numa aba vê a foto inteira. **Recorte não é censura** — se um
dia for preciso que o pedaço suma de verdade (gabarito no canto, dado pessoal),
isso é outra funcionalidade, e ela grava arquivo novo. Esta não faz isso, e o
painel não deve sugerir que faz.

## O modelo

### O que fica gravado

Dois atributos novos no nó `image` (`admin/editor/imagem.ts`):

| atributo | forma | o que é |
|---|---|---|
| `recorte` | `"t r b l"`, quatro números em % da imagem original | quanto foi cortado de cada lado; `""` quando não há recorte |
| `natural` | `"L A"`, dois inteiros em px | largura e altura originais do arquivo |

Ambos seguem a regra que manda na extensão: vão em `data-*`, e o `parseHTML` os
relê ao reabrir — ninguém decompõe uma string de `style`.

### Por que `natural` é obrigatório, e o que ele conserta de brinde

Para recortar em cima e embaixo, a moldura precisa saber a **proporção** do que
sobrou, e ela depende das dimensões originais. O site nunca as guardou.

O editor passa a lê-las com `naturalWidth`/`naturalHeight` quando a imagem
carrega, e a gravar. **De brinde, isso mata o pulo de layout**: com as dimensões
no HTML, o navegador reserva o espaço certo antes de a imagem chegar, e o resumo
para de saltar ao abrir — um defeito que hoje existe em toda imagem do acervo.

**Imagens antigas não têm o dado.** Sem `natural`, o modo de recorte fica
indisponível para aquela figura, com o motivo dito na tela — não some calado. O
editor preenche o atributo assim que a imagem carrega, então o acervo se cura
sozinho conforme os resumos vão sendo abertos. Nenhuma migração, nenhum script.

### Como a página do aluno desenha

A `<figure>` ganha **uma caixa interna** — a moldura — e a `<img>` vai dentro
dela. Só quando há recorte: sem recorte, o HTML gravado é exatamente o de hoje,
e nenhuma figura já publicada muda de forma.

```html
<figure class="figura" data-quebra="bloco">
  <span class="moldura" style="aspect-ratio:<Lv>/<Av>">
    <img src="…" style="width:<W>%;transform:translate(-<l>%,-<t>%)">
  </span>
  <figcaption>…</figcaption>
</figure>
```

As contas saem no `renderHTML`, como já é feito com os filtros — a página do
aluno continua sem JavaScript:

- fração visível: `fw = (100 − l − r)/100`, `fh = (100 − t − b)/100`
- largura da imagem dentro da moldura: `W = 100 / fw` por cento
- deslocamento: `translate(−l%, −t%)` — porcentagem de `translate` é do próprio
  elemento, então os números crus de recorte servem direto, sem conversão
- proporção da moldura: `(fw × Lnat) / (fh × Anat)`
- a moldura tem `overflow: hidden`

### O giro, que é onde isso podia quebrar em silêncio

`rotacao` hoje é `transform: rotate(...)` **na `<img>`**. O recorte também
precisa de `transform` na `<img>`, e girar depois de deslocar giraria em torno
do ponto errado — a imagem sairia da moldura.

Regra: **com recorte, o giro vai na moldura**; sem recorte, continua na `<img>`,
byte por byte como hoje. São dois caminhos, e o segundo existe para que nenhuma
figura já publicada mude de aparência por causa desta funcionalidade.

### O conflito com `altura`

`altura` já corta, sempre pelo meio (`object-fit: cover`). São duas formas da
mesma coisa e brigam pela mesma imagem.

Regra: **ao recortar, `altura` é limpo e o campo fica desligado**, com o motivo
na dica. É a mesma exclusão que a spec da margem estabelece entre "margem" e
"sair da margem" — e, como lá, ela vale **nos dois lados**: o painel impede a
combinação, e o `renderHTML` ignora `altura` quando há recorte, porque HTML
antigo pode chegar com os dois.

## O editor

**Um botão de modo**, no grupo de tamanho: `⛶ Recortar`. Ligado, a sobreposição
de `AlcasImagem.tsx` troca de função — as alças passam a puxar as bordas para
dentro em vez de mudar a largura da figura, e o que ficará de fora aparece
escurecido, não some, para você ver o que está descartando.

Sair do modo confirma. **`↺ Imagem inteira`** desfaz o recorte a qualquer
momento, inclusive dias depois: o arquivo nunca foi tocado.

Limites: cada lado vai de 0% a um teto que garanta pelo menos **10% de imagem
visível** em cada eixo — alça que pode zerar a figura é alça que produz uma
figura invisível sem avisar.

## Fronteiras

- Nenhuma migration, nenhum script de acervo: o dado novo se preenche sozinho ao
  abrir o resumo no editor.
- Nenhuma dependência nova. Nenhum processamento de imagem no servidor.
- **Máscara de forma (círculo, estrela) continua fora.** É outra coisa: pede
  `clip-path` por forma e uma galeria de formas, e ninguém pediu.
- Recorte **não** vale para tabela (o `escapa` é compartilhado com ela; isto não
  é).

## Verificação

Não há suíte de testes no projeto (`CLAUDE.md`) — a verificação é medida e
olhada:

1. **`npm run build`** (único typecheck) e lint com os mesmos 5 erros
   pré-existentes de `admin/editor/`.
2. **Editor e `/resumos/[slug]` lado a lado, mesma largura:** o pedaço visível
   tem de ser o mesmo pixel a pixel. É o teste do WYSIWYG.
3. **Recorte em cada um dos quatro lados, um de cada vez**, e depois nos quatro
   juntos — é onde as contas de `translate` erram de sinal.
4. **Imagem girada e recortada ao mesmo tempo:** tem de girar a moldura, e a
   imagem não pode escapar dela.
5. **Uma figura já publicada, sem `natural`:** abre no editor, ganha o atributo,
   e o modo de recorte passa de indisponível a disponível — sem a figura mudar
   de aparência no caminho.
6. **Reabrir depois de salvar:** `parseHTML` devolve o recorte. Sem isso o
   recorte se perde no primeiro fechamento, calado.
7. **Uma figura com `altura` gravada, recortada em seguida:** `altura` sai, e o
   resultado é o recorte, não a soma dos dois.
8. **O pulo de layout:** abrir um resumo com imagem grande antes e depois do
   `natural`, e confirmar que o texto para de saltar.

## Correção a fazer no `CONTEXTO.md`

A decisão **11c** precisa registrar que "recortar" saiu da lista do que não
existe, com o motivo da mudança: não foi o argumento que caiu, foi o custo — a
sobreposição de alças passou a existir e o recorte reaproveita ela. **Máscara de
forma continua na lista.**

A seção "Imagem: feito em agosto/2026" também está desatualizada (afirma que
redimensionar arrastando e legenda ficaram de fora; os dois existem). A spec da
margem já registra essa correção; se ela for implementada antes, aqui não
sobra nada a fazer.

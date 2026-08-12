import { InputRule } from '@tiptap/core'
import { Heading } from '@tiptap/extension-heading'

/**
 * O título ganha um modo "corrido": ele e a explicação na MESMA linha.
 *
 * É o formato em que os resumos sempre foram escritos. No Google Docs a linha
 * é `**Termo:** definição;` — o nome do assunto e o que ele significa, um
 * atrás do outro. Depois da decisão 12 o título passou a ser texto do mesmo
 * corpo, só em negrito, e ficou parecido com esse termo em tudo menos numa
 * coisa: o termo divide a linha com a definição, e o título ainda a ocupava
 * sozinho. Este atributo desfaz a última diferença.
 *
 * **O título continua sendo um h2/h3/h4 de verdade, e um bloco separado do
 * parágrafo.** É isso que mantém tudo o mais funcionando: `lib/titulos.ts`
 * segue lendo só o título ao montar o nó do mapa, o nível continua dizendo
 * quem pendura em quem, e o leitor de tela continua anunciando um cabeçalho.
 * Fosse a explicação para DENTRO do título, o nó do mapa passaria a se chamar
 * "Leis de Newton todo corpo permanece em repouso ou em movimento…" — a frase
 * inteira viraria o nome do grafo.
 *
 * O caminho alternativo seria fazer do título uma marca dentro do parágrafo,
 * como o negrito. Foi descartado: marca não tem nível, e sem nível não há o que
 * aninhar — o mapa perderia a árvore que a decisão 12 acabou de ganhar.
 *
 * Quem junta as duas linhas é o CSS, com `float` (ver `globals.css`). O modo é
 * fechado — ligado ou desligado —, então vai num `data-*` que o CSS lê, e não
 * em `style` embutido: é a mesma regra que vale para a imagem (decisão 11c),
 * e pela mesma razão de sempre — a página do aluno renderiza HTML cru.
 */
export const TituloCorrido = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      corrido: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-corrido') === 'sim',
        renderHTML: (attrs) => (attrs.corrido ? { 'data-corrido': 'sim' } : {}),
      },
    }
  },

  /**
   * Digitar `:` no fim de um grafo fecha o título e abre a explicação.
   *
   * O botão `T¶` continua existindo, mas exige que o autor lembre dele. Este é
   * o gesto: o formato de origem é `**Termo:** definição`, e nele os dois
   * pontos são justamente onde o nome do assunto acaba. Quem escreve já digita
   * esse caractere — ele só não fazia nada. Agora ele liga o modo corrido, abre
   * o parágrafo da explicação e deixa o cursor lá, que é o que o autor ia fazer
   * na mão em seguida.
   *
   * Três guardas, e nenhuma é preciosismo:
   *
   * - **Só dentro de um grafo.** Prosa comum é cheia de dois pontos, e uma
   *   regra que valesse no parágrafo quebraria toda frase enumerativa em duas.
   * - **Só com o cursor no fim.** Corrigir um `:` no meio de um título já
   *   escrito partiria o texto ao meio, e o autor perderia a metade da direita
   *   dentro de um parágrafo que ele não pediu.
   * - **Só uma vez.** Com o modo já ligado, o parágrafo da explicação existe;
   *   um segundo `:` só enfiaria um parágrafo vazio entre os dois.
   *
   * **O `:` fica gravado no título, como texto.** É o que o autor digitou e é o
   * que o resumo de origem tem — inventar o caractere no CSS (`::after`) faria
   * a página mostrar um caractere que não está no documento, e cairia na mesma
   * armadilha do wikilink virar nó (decisão 1): o que a página mostra tem que
   * sair do HTML gravado. Quem tira o dois-pontos do RÓTULO do nó é
   * `lib/titulos.ts`, no mapa, onde ele seria pontuação órfã.
   *
   * A saída, quando a quebra não era desejada ("Capítulo 3: Dinâmica"), é o
   * Backspace: o TipTap liga `undoInputRule` a ele por padrão, e uma tecla
   * devolve o `:` como texto comum. Por isso a regra não precisa de exceção
   * para título que já contenha dois pontos no meio.
   */
  addInputRules() {
    return [
      // O `#` do kit continua valendo; sem o `parent` ele seria substituído.
      ...(this.parent?.() ?? []),
      new InputRule({
        find: /^(.+):$/,
        handler: ({ state, chain }) => {
          const { $from } = state.selection

          if ($from.parent.type.name !== this.name) return null
          if ($from.parent.attrs.corrido) return null
          if ($from.parentOffset !== $from.parent.content.size) return null

          chain()
            // O caractere ainda NÃO está no documento: a regra casa contra o
            // texto do bloco + o que se digitou, e cabe ao handler inserir.
            .insertContent({ type: 'text', text: ':' })
            .updateAttributes(this.name, { corrido: true })
            // No fim de um bloco, `splitBlock` cria o tipo padrão — parágrafo —,
            // que é exatamente o vizinho que o `float` do corrido espera.
            .splitBlock()
            // E a explicação começa em texto normal. Sem isto ela sairia em
            // negrito: o plugin do `termoNegrito` liga o negrito em toda linha
            // VAZIA, e o parágrafo recém-aberto é exatamente isso. Ele só
            // desiste quando alguém já decidiu — é o teste `storedMarks !==
            // null` de lá —, e `unsetMark` numa seleção vazia é o que grava
            // essa decisão.
            .unsetMark('bold')
            .run()

          return
        },
      }),
    ]
  },
})

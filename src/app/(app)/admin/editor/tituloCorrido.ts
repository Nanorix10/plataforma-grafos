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
})

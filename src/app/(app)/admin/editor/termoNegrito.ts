import { Extension, InputRule } from '@tiptap/core'

/**
 * O padrão em que os resumos são escritos: `**Termo:** definição;`
 *
 * **Quem liga o negrito é o `:`, e só ele.** O autor digita o nome do tópico em
 * texto normal; ao fechar com dois-pontos, o termo inteiro (o `:` junto, como
 * no original) vira negrito de uma vez, e a definição segue em texto comum.
 *
 * Havia uma segunda metade aqui: um plugin que acendia o negrito sozinho toda
 * vez que o cursor caía numa linha vazia, porque no resumo a linha começa pelo
 * nome do tópico. **Saiu a pedido do autor.** O motivo é o que ele via
 * escrevendo: negrito sai na cor da matéria (decisão 4c), então a linha nova
 * nascia colorida e voltava ao normal no `:` — a cor piscava a cada quebra de
 * linha, inclusive nas linhas que nunca iam ter termo nenhum.
 *
 * Nada se perdeu no caminho: a regra abaixo sempre soube negritar o termo
 * retroativamente, que era como ela já atendia quem colava texto de fora.
 * A única diferença é QUANDO o destaque aparece — no `:`, e não desde a
 * primeira letra.
 */

/** Limite de caracteres antes do `:` para valer como termo, e não como frase. */
const LIMITE_TERMO = 60

export const TermoNegrito = Extension.create({
  name: 'termoNegrito',

  addInputRules() {
    return [
      new InputRule({
        // Só casa no PRIMEIRO `:` da linha — o `[^:\n]` garante que não há
        // outro antes. É isso que salva "…tal que: F2=-F1" no meio de uma linha
        // que já usou o padrão.
        //
        // O `:` NÃO está no documento quando isto roda: numa input rule o
        // caractere que casa é o que está sendo digitado, e o ProseMirror o
        // consome. Por isso o handler o reinsere. (A primeira versão pedia
        // `:\s` e comia o espaço, saindo "Termo:definição".)
        find: new RegExp(`^([^:\\n]{1,${LIMITE_TERMO}}):$`),
        handler: ({ state, range, chain }) => {
          const bold = state.schema.marks.bold
          if (!bold) return

          // Título fica de fora: h2/h3/h4 se destacam sozinhos, e `<strong>`
          // ali não acrescenta nada — só embrulha o texto do nó do mapa.
          //
          // Sair sem produzir passo NÃO cancela a digitação: o TipTap só
          // considera a regra casada se ela mexer na transação, e passa para a
          // seguinte. É `tituloCorrido` quem atende o `:` dentro de um grafo.
          if (state.selection.$from.parent.type.name === 'heading') return

          const inicio = range.from
          const fimDoTermo = range.to
          if (fimDoTermo <= inicio) return

          chain()
            .insertContentAt(fimDoTermo, ':')
            // cobre o termo inteiro com negrito, inclusive o `:`
            .setTextSelection({ from: inicio, to: fimDoTermo + 1 })
            .setMark('bold')
            // e encerra: a definição sai em texto normal
            .setTextSelection(fimDoTermo + 1)
            .unsetMark('bold')
            .run()
        },
      }),
    ]
  },
})

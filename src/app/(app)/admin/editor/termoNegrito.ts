import { Extension, InputRule } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * O padrão em que os resumos são escritos: `**Termo:** definição;`
 *
 * São duas metades, e uma não serve sem a outra:
 *
 * 1. **Começa em negrito.** Linha nova (ou item de lista novo) já nasce com o
 *    negrito ligado, porque no resumo a linha começa pelo nome do tópico.
 * 2. **Os dois-pontos encerram.** Ao digitar `:`, ele entra no negrito — no
 *    original o `:` faz parte do destaque — e a definição segue em texto normal.
 *
 * Também funciona ao contrário: se a linha começou sem negrito, digitar `:`
 * negrita o termo retroativamente. Assim o padrão sai certo tanto para quem
 * digita direto quanto para quem colou o texto de fora.
 */

const chaveNegritoInicial = new PluginKey('negritoNoInicioDaLinha')

/** Limite de caracteres antes do `:` para valer como termo, e não como frase. */
const LIMITE_TERMO = 60

export const TermoNegrito = Extension.create({
  name: 'termoNegrito',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: chaveNegritoInicial,

        /**
         * Liga o negrito quando o cursor está numa linha vazia.
         *
         * Duas guardas que evitam que isso vire um estorvo:
         *
         * - **`storedMarks === null`.** É o que diferencia "ninguém mexeu" de
         *   "o autor decidiu". Quando ele aperta Ctrl+B para desligar, o
         *   ProseMirror grava um `storedMarks` explícito; sem esta checagem o
         *   plugin religaria o negrito no gesto seguinte e o Ctrl+B pareceria
         *   quebrado. Também é o que impede o laço: depois de ligar uma vez,
         *   `storedMarks` deixa de ser nulo.
         *
         * - **Título fica de fora.** h2/h3/h4 já são destacados por conta
         *   própria; negrito ali não acrescenta nada.
         */
        appendTransaction(transacoes, _estadoAntigo, estado) {
          if (!transacoes.some((t) => t.docChanged || t.selectionSet)) return null

          const bold = estado.schema.marks.bold
          if (!bold) return null

          const { $from, empty } = estado.selection
          if (!empty) return null
          if (estado.storedMarks !== null) return null

          // só em linha vazia: no meio do texto o autor é quem manda
          if ($from.parent.content.size !== 0) return null
          if ($from.parent.type.name === 'heading') return null

          return estado.tr.addStoredMark(bold.create())
        },
      }),
    ]
  },

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

          // Título fica de fora, pela mesma razão que o plugin acima já o
          // deixa: h2/h3/h4 se destacam sozinhos, e `<strong>` ali não
          // acrescenta nada — só embrulha o texto do nó do mapa. A guarda
          // estava só no plugin, e a regra ficou pegando os dois casos.
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
            // cobre o termo inteiro com negrito, inclusive o `:`. Vale tanto
            // quando a linha já nasceu em negrito quanto quando não nasceu.
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

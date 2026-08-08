import { Extension, InputRule } from '@tiptap/core'

/**
 * Negrita o termo antes dos dois-pontos, no padrão em que os resumos são
 * escritos: `**Dinâmica:** estuda o movimento dos corpos;`
 *
 * Dispara quando o autor digita o espaço logo depois do `:`. Nesse instante o
 * trecho do começo da linha até o `:` (inclusive — no original o `:` está
 * dentro do negrito) vira negrito, e o que vier depois volta ao texto normal.
 *
 * ---
 *
 * A ideia original era mais ambiciosa: começar TODO item de lista já em negrito
 * e desligar no `:`. Os documentos derrubaram isso — boa parte dos itens não
 * segue o padrão e é texto puro:
 *
 *     - Todo referencial em repouso ou em MRU também é inercial;
 *     - A Terra é considerada, na prática, um referencial inercial;
 *
 * Com o negrito ligado por padrão, esses itens sairiam inteiros em negrito e o
 * autor teria que desligar na mão em cada um — trocaria um atalho por um
 * estorvo mais frequente que ele.
 *
 * Três travas para a regra não atrapalhar quem escreve fora do padrão:
 *
 * 1. **Só no começo do bloco.** O `^` na expressão garante isso. Sem ele,
 *    "…tal que: F2=-F1" no meio de uma frase viraria negrito — e esse caso
 *    existe nos resumos, na mesma linha em que o padrão já foi usado.
 *
 * 2. **Só uma vez por linha.** Se o começo do bloco já está em negrito, a regra
 *    não age. É o que salva o item que tem dois `:`, como
 *    "**3ª Lei de Newton (Ação e reação):** … tal que: F2=-F1".
 *
 * 3. **Só para termos, não para frases.** Até 60 caracteres antes do `:`.
 *
 * Como é uma input rule do ProseMirror, um Ctrl+Z (ou Backspace na hora)
 * desfaz só o negrito e devolve o texto — a regra nunca fica no caminho.
 */
export const TermoNegrito = Extension.create({
  name: 'termoNegrito',

  addInputRules() {
    return [
      new InputRule({
        // Dispara no próprio `:`. Note que ele NÃO está no documento ainda:
        // numa input rule o caractere que casa é o que está sendo digitado, e
        // o ProseMirror o consome. Por isso o handler reinsere o `:` na mão —
        // a primeira versão desta regra pedia `:\s` e comia o espaço, saindo
        // "Termo:definição".
        find: /^([^:\n]{1,60}):$/,
        handler: ({ state, range, chain }) => {
          const bold = state.schema.marks.bold
          if (!bold) return

          const inicio = range.from
          const fimDoTermo = range.to

          // linha vazia antes do `:` não tem termo nenhum para destacar
          if (fimDoTermo <= inicio) return

          // já está em negrito? então este é o segundo `:` da linha — sai fora,
          // senão "…tal que: F2=-F1" apagaria o destaque do termo de verdade
          if (state.doc.rangeHasMark(inicio, inicio + 1, bold)) return

          chain()
            // devolve o `:` que a regra consumiu
            .insertContentAt(fimDoTermo, ':')
            // negrita o termo COM o `:`, como no original:
            // `**Dinâmica:** estuda o movimento`
            .setTextSelection({ from: inicio, to: fimDoTermo + 1 })
            .setMark('bold')
            // cursor depois do `:`, sem negrito — a definição sai normal
            .setTextSelection(fimDoTermo + 1)
            .unsetMark('bold')
            .run()
        },
      }),
    ]
  },
})

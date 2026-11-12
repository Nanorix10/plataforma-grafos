import { InlineMath, BlockMath } from '@tiptap/extension-mathematics'
import type { NodeViewRenderer } from '@tiptap/core'
import { lerTamanho, estiloTamanho } from '@/lib/formula-tamanho'

/**
 * As fórmulas do TipTap com um atributo a mais: `tamanho`, em px.
 *
 * Gravado como `data-tamanho="26"` só quando o autor ajustou. Sem ele, a
 * fórmula segue `--t-formula` do CSS (22px) — e é por isso que nenhum resumo
 * do acervo precisou ser regravado. Quem lê o atributo na página do aluno é
 * `lib/matematica.ts`.
 *
 * O NodeView continua sendo o da extensão: ela cria o elemento e desenha o
 * KaTeX dentro, e aqui só se pendura a variável `--formula-tam` nele. Como o
 * NodeView da extensão não tem `update`, mudar o tamanho recria o elemento
 * inteiro — que é o mesmo que já acontece quando o LaTeX muda.
 */

const atributoTamanho = {
  tamanho: {
    default: null as number | null,
    parseHTML: (el: HTMLElement) => lerTamanho(el.getAttribute('data-tamanho')),
    renderHTML: (attrs: Record<string, unknown>) => {
      const t = lerTamanho(attrs.tamanho)
      return t === null ? {} : { 'data-tamanho': String(t) }
    },
  },
}

function comTamanho(pai: NodeViewRenderer | undefined): NodeViewRenderer | null {
  if (!pai) return null
  return (props) => {
    const vista = pai(props)
    const el = vista.dom as HTMLElement
    const estilo = estiloTamanho(lerTamanho(props.node.attrs.tamanho))
    if (estilo) el.setAttribute('style', estilo)
    return vista
  }
}

export const FormulaEmLinha = InlineMath.extend({
  addAttributes() {
    return { ...this.parent?.(), ...atributoTamanho }
  },
  addNodeView() {
    return comTamanho(this.parent?.() ?? undefined)
  },
})

export const FormulaEmBloco = BlockMath.extend({
  addAttributes() {
    return { ...this.parent?.(), ...atributoTamanho }
  },
  addNodeView() {
    return comTamanho(this.parent?.() ?? undefined)
  },
})

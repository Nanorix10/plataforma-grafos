import { InlineMath, BlockMath } from '@tiptap/extension-mathematics'
import type { NodeViewRenderer } from '@tiptap/core'
import { lerTamanho, estiloTamanho } from '@/lib/formula-tamanho'
import { lerTextoDestaque } from '@/lib/formula-destaque'

/**
 * As fórmulas do TipTap com atributos a mais.
 *
 * `tamanho` (as duas), em px: gravado como `data-tamanho="26"` só quando o
 * autor ajustou. Sem ele, a fórmula segue `--t-formula` do CSS (22px) — e é
 * por isso que nenhum resumo do acervo precisou ser regravado.
 *
 * `destaque`, `titulo` e `legenda` (só a de linha própria): o plano na cor da
 * matéria da decisão 8g, ver `lib/formula-destaque.ts`.
 *
 * Quem lê tudo isso na página do aluno é `lib/matematica.ts`. Aqui o NodeView
 * continua sendo o da extensão — ela cria o elemento e desenha o KaTeX dentro
 * — e só se pendura o resto nele: a variável `--formula-tam`, a classe do
 * plano e o título e a legenda, com as MESMAS classes que o servidor escreve,
 * para o CSS ser um só. Como o NodeView da extensão não tem `update`, mudar
 * um atributo recria o elemento inteiro, o mesmo que já acontece com o LaTeX.
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

const atributosDestaque = {
  destaque: {
    default: false,
    parseHTML: (el: HTMLElement) => el.getAttribute('data-destaque') === 'sim',
    renderHTML: (attrs: Record<string, unknown>) =>
      attrs.destaque ? { 'data-destaque': 'sim' } : {},
  },
  titulo: {
    default: null as string | null,
    parseHTML: (el: HTMLElement) => lerTextoDestaque(el.getAttribute('data-titulo')),
    renderHTML: (attrs: Record<string, unknown>) => {
      const t = attrs.destaque ? lerTextoDestaque(attrs.titulo) : null
      return t === null ? {} : { 'data-titulo': t }
    },
  },
  legenda: {
    default: null as string | null,
    parseHTML: (el: HTMLElement) => lerTextoDestaque(el.getAttribute('data-legenda')),
    renderHTML: (attrs: Record<string, unknown>) => {
      const t = attrs.destaque ? lerTextoDestaque(attrs.legenda) : null
      return t === null ? {} : { 'data-legenda': t }
    },
  },
}

function rotulo(classe: string, texto: string) {
  const el = document.createElement('span')
  el.className = classe
  el.textContent = texto
  return el
}

function decorar(pai: NodeViewRenderer | undefined): NodeViewRenderer | null {
  if (!pai) return null
  return (props) => {
    const vista = pai(props)
    const el = vista.dom as HTMLElement
    const { attrs } = props.node
    const estilo = estiloTamanho(lerTamanho(attrs.tamanho))
    if (estilo) el.setAttribute('style', estilo)
    if (attrs.destaque) {
      el.classList.add('formula-destaque')
      const titulo = lerTextoDestaque(attrs.titulo)
      const legenda = lerTextoDestaque(attrs.legenda)
      if (titulo) el.prepend(rotulo('formula-destaque-titulo', titulo))
      if (legenda) el.append(rotulo('formula-destaque-legenda', legenda))
    }
    return vista
  }
}

export const FormulaEmLinha = InlineMath.extend({
  addAttributes() {
    return { ...this.parent?.(), ...atributoTamanho }
  },
  addNodeView() {
    return decorar(this.parent?.() ?? undefined)
  },
})

export const FormulaEmBloco = BlockMath.extend({
  addAttributes() {
    return { ...this.parent?.(), ...atributoTamanho, ...atributosDestaque }
  },
  addNodeView() {
    return decorar(this.parent?.() ?? undefined)
  },
})

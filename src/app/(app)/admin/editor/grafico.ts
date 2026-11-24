import { Node } from '@tiptap/core'
import katex from 'katex'
import { lerConfig } from '@/lib/grafico/modelo'
import { montarFigura } from '@/lib/grafico/figura'
import { ativarGrafico } from '@/lib/grafico/vivo'

/**
 * O gráfico interativo dentro do resumo (decisão 34).
 *
 * O corpo guarda só a RECEITA — `<div class="grafico" data-type="grafico"
 * data-config="{…}">`, sem nada dentro. Quem desenha é `lib/grafico/figura.ts`,
 * no servidor para o aluno e aqui para o autor.
 *
 * ## Por que aqui TEM NodeView, se a imagem recusou uma (decisão 11c)
 *
 * Lá o medo era o editor desenhar de um jeito (React) e o aluno receber
 * outro (`renderHTML`). Aqui o editor chama a MESMA `montarFigura` que o
 * servidor, então as duas pontas não têm como divergir — e sem NodeView o
 * autor veria uma caixa vazia no lugar do gráfico.
 *
 * ## O nó também protege o gráfico
 *
 * Como o modelo 3D (decisão 28): o TipTap descarta o que não conhece, e o
 * autosave gravaria o corpo sem o gráfico na primeira edição do resumo.
 *
 * Não é `<figure>` de propósito: `lib/figuras.ts` reescreve toda `<figure>`
 * do corpo, e o CSS de `figure` é o das imagens.
 */

export type AoEditarGrafico = (config: string, pos: number) => void

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    grafico: {
      /** Troca a receita do gráfico que está em `pos`. */
      atualizarGrafico: (pos: number, config: string) => ReturnType
    }
  }
}

const renderLatex = (tex: string) =>
  katex.renderToString(tex, { throwOnError: false, errorColor: 'var(--erro)', strict: false })

export const Grafico = Node.create<{ aoEditar: AoEditarGrafico }>({
  name: 'grafico',
  group: 'block',
  atom: true,
  draggable: true,
  // ganha das outras regras de `div` (a gaveta de resolução, por exemplo)
  priority: 100,

  addOptions() {
    return { aoEditar: () => {} }
  },

  addAttributes() {
    return {
      config: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-config'),
        renderHTML: (attrs) => ({ 'data-config': attrs.config }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="grafico"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, class: 'grafico', 'data-type': 'grafico' }]
  },

  addCommands() {
    return {
      atualizarGrafico:
        (pos, config) =>
        ({ tr, dispatch }) => {
          const no = tr.doc.nodeAt(pos)
          if (!no || no.type.name !== this.name) return false
          if (dispatch) tr.setNodeMarkup(pos, undefined, { ...no.attrs, config })
          return true
        },
    }
  },

  addNodeView() {
    return ({ node, getPos }) => {
      const dom = document.createElement('div')
      dom.className = 'grafico-no'
      dom.contentEditable = 'false'
      let atual: unknown = undefined
      let limpar = () => {}

      const editar = () => {
        const pos = typeof getPos === 'function' ? getPos() : undefined
        if (typeof pos === 'number') this.options.aoEditar(String(atual ?? ''), pos)
      }

      const pintar = (config: unknown) => {
        limpar()
        atual = config
        const g = lerConfig(config)
        dom.innerHTML = g
          ? montarFigura(g, renderLatex)
          : '<div class="grafico grafico-invalido">Gráfico com receita inválida — clique em Editar para refazer.</div>'
        const barra = document.createElement('div')
        barra.className = 'grafico-no-barra'
        const botao = document.createElement('button')
        botao.type = 'button'
        botao.textContent = '✎ Editar gráfico'
        botao.addEventListener('click', editar)
        barra.append(botao)
        dom.prepend(barra)
        const raiz = dom.querySelector<HTMLElement>('.grafico[data-config]')
        limpar = raiz ? ativarGrafico(raiz) : () => {}
      }
      pintar(node.attrs.config)

      return {
        dom,
        update(novo) {
          if (novo.type.name !== 'grafico') return false
          if (novo.attrs.config !== atual) pintar(novo.attrs.config)
          return true
        },
        // Controles, zoom e o arrasto do plano são do gráfico, não do editor:
        // sem isto o ProseMirror tomaria o clique como seleção e o arrasto
        // como "mover o bloco".
        stopEvent(e) {
          const alvo = e.target as Element | null
          return !!alvo?.closest?.('.grafico-palco, .grafico-controles, .grafico-no-barra button')
        },
        ignoreMutation: () => true,
        destroy() {
          limpar()
        },
      }
    }
  },
})

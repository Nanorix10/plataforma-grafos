import { Node, mergeAttributes } from '@tiptap/core'
import { PASTA_MODELOS_3D } from '@/lib/modelos3d'

/**
 * Modelo 3D interativo dentro do resumo: um `<iframe>` para um arquivo de
 * `public/modelos-3d/`.
 *
 * ## Por que um nó, se a página do aluno já mostra o iframe sozinha
 *
 * A página do aluno injeta o corpo como HTML cru, então um `<iframe>` gravado
 * no banco aparece sem precisar de nada. Quem o APAGARIA é o editor: o TipTap
 * só guarda os nós que conhece e descarta o resto sem avisar. O autor abriria o
 * resumo para corrigir uma vírgula, e o autosave gravaria o corpo já sem o
 * modelo. Este nó existe para o editor reconhecer o iframe e devolvê-lo intacto.
 *
 * ## Só iframe da pasta dos modelos
 *
 * O `parseHTML` casa `iframe[src^="/modelos-3d/"]`, e não qualquer iframe: o
 * corpo é HTML cru na página do aluno, e um iframe colado de fora (um vídeo,
 * uma página qualquer) continuaria sendo descartado como sempre foi.
 *
 * O HTML gravado é o iframe comum, com os atributos que a página do aluno
 * precisa — nada de `data-*` que só o editor entenda.
 */

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    modelo3d: {
      /** Insere o modelo `arquivo` (ex.: `agua.html`) no lugar do cursor. */
      inserirModelo3D: (arquivo: string, titulo: string, altura?: number) => ReturnType
    }
  }
}

export const Modelo3D = Node.create({
  name: 'modelo3d',
  group: 'block',
  // Átomo: o iframe é uma peça só, sem texto dentro para o cursor entrar.
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      arquivo: {
        default: null,
        parseHTML: (el) => el.getAttribute('src')?.slice(PASTA_MODELOS_3D.length) ?? null,
      },
      titulo: { default: 'Modelo 3D', parseHTML: (el) => el.getAttribute('title') ?? 'Modelo 3D' },
      altura: {
        default: 450,
        parseHTML: (el) => Number(el.getAttribute('height')) || 450,
      },
    }
  },

  parseHTML() {
    return [{ tag: `iframe[src^="${PASTA_MODELOS_3D}"]` }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { arquivo, titulo, altura } = node.attrs
    // `arquivo`, `titulo` e `altura` viram atributos do próprio iframe, e não
    // atributos soltos com esses nomes.
    delete HTMLAttributes.arquivo
    delete HTMLAttributes.titulo
    delete HTMLAttributes.altura
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        src: PASTA_MODELOS_3D + arquivo,
        width: '100%',
        height: String(altura),
        style: 'border:0;border-radius:8px',
        loading: 'lazy',
        title: titulo,
        // O botão ⛶ do visualizador só funciona com esta permissão; sem ela
        // `document.fullscreenEnabled` é falso e o botão nem aparece.
        allowfullscreen: 'true',
      }),
    ]
  },

  addCommands() {
    return {
      inserirModelo3D:
        (arquivo, titulo, altura) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { arquivo, titulo, ...(altura ? { altura } : {}) } }),
    }
  },
})

import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

export type EstadoSugestao = {
  itens: string[]
  indice: number
  rect: DOMRect | null
  escolher: (titulo: string) => void
}

type Opcoes = {
  titulos: () => string[]
  onEstado: (estado: EstadoSugestao | null) => void
  onIndice: (mover: (atual: number, total: number) => number) => void
}

// Digitar `[[` abre a lista de resumos existentes. O item escolhido é inserido
// como TEXTO literal `[[Título]]` — e não como um nó especial — porque o trigger
// `sync_conexoes_resumo` no Postgres lê o campo `corpo` com regex procurando
// exatamente esse formato. Guardar como nó customizado quebraria as conexões.
export const WikilinkSuggestion = Extension.create<Opcoes>({
  name: 'wikilinkSuggestion',

  addOptions() {
    return {
      titulos: () => [],
      onEstado: () => {},
      onIndice: () => {},
    }
  },

  addProseMirrorPlugins() {
    const opcoes = this.options

    return [
      Suggestion({
        editor: this.editor,
        char: '[[',
        startOfLine: false,
        allowSpaces: true,

        items: ({ query }) => {
          const busca = query.toLowerCase()
          return opcoes
            .titulos()
            .filter((t) => t.toLowerCase().includes(busca))
            .slice(0, 8)
        },

        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, `[[${props}]]`)
            .run()
        },

        render: () => {
          let indice = 0
          let itensAtuais: string[] = []
          let cmd: ((props: string) => void) | null = null

          const publicar = (props: {
            items: string[]
            clientRect?: (() => DOMRect | null) | null
            command: (props: string) => void
          }) => {
            itensAtuais = props.items
            cmd = props.command
            opcoes.onEstado({
              itens: props.items,
              indice,
              rect: props.clientRect?.() ?? null,
              escolher: (titulo: string) => props.command(titulo),
            })
          }

          return {
            onStart: (props) => {
              indice = 0
              publicar(props as never)
            },
            onUpdate: (props) => {
              publicar(props as never)
            },
            onKeyDown: ({ event }) => {
              if (itensAtuais.length === 0) return false

              if (event.key === 'ArrowDown') {
                indice = (indice + 1) % itensAtuais.length
                opcoes.onIndice(() => indice)
                return true
              }
              if (event.key === 'ArrowUp') {
                indice = (indice - 1 + itensAtuais.length) % itensAtuais.length
                opcoes.onIndice(() => indice)
                return true
              }
              if (event.key === 'Enter' || event.key === 'Tab') {
                cmd?.(itensAtuais[indice])
                return true
              }
              if (event.key === 'Escape') {
                opcoes.onEstado(null)
                return true
              }
              return false
            },
            onExit: () => {
              opcoes.onEstado(null)
            },
          }
        },
      }),
    ]
  },
})

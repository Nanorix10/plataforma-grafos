'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extension-placeholder'
import { CharacterCount } from '@tiptap/extension-character-count'
import { useCallback, useEffect, useRef, useState } from 'react'
import { WikilinkSuggestion, type EstadoSugestao } from './wikilinkSuggestion'
import { salvarCorpoAuto } from './actions'

const CORES = ['#1D1B18', '#8A1224', '#185E9E', '#3F7848', '#AC2573', '#BC462F', '#6B665D']
const MARCAS = ['#FFF3A3', '#C9EFC4', '#BFE0FF', '#FFD1DC']
const TAMANHOS = ['14px', '16px', '18px', '22px', '28px']

function Bt({
  ativo,
  onClick,
  title,
  largo,
  children,
}: {
  ativo?: boolean
  onClick: () => void
  title: string
  largo?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`${largo ? 'px-2' : 'w-[28px]'} h-[28px] rounded text-[13px] leading-none flex items-center justify-center shrink-0 ${
        ativo ? 'bg-[var(--sel)] text-[var(--ink)]' : 'text-[var(--ink-dim)] hover:bg-[var(--sel)]'
      }`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="w-px h-[18px] bg-[var(--line)] mx-1 shrink-0" />
}

function Barra({ editor }: { editor: Editor }) {
  const estilo = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : editor.isActive('heading', { level: 4 })
        ? 'h4'
        : 'p'

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 px-3 py-1.5 bg-[var(--panel)] border-b border-[var(--line)]">
      <Bt title="Desfazer (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>
        ↶
      </Bt>
      <Bt title="Refazer (Ctrl+Shift+Z)" onClick={() => editor.chain().focus().redo().run()}>
        ↷
      </Bt>

      <Sep />

      <select
        value={estilo}
        onChange={(e) => {
          const v = e.target.value
          const c = editor.chain().focus()
          if (v === 'p') c.setParagraph().run()
          else c.setHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run()
        }}
        className="h-[28px] text-[12.5px] bg-transparent border border-[var(--line)] rounded px-1.5 outline-none cursor-pointer"
      >
        <option value="p">Texto normal</option>
        <option value="h2">Título 1</option>
        <option value="h3">Título 2</option>
        <option value="h4">Título 3</option>
      </select>

      <select
        value={editor.getAttributes('textStyle').fontSize ?? ''}
        onChange={(e) => {
          const v = e.target.value
          const c = editor.chain().focus()
          if (v) c.setFontSize(v).run()
          else c.unsetFontSize().run()
        }}
        className="h-[28px] text-[12.5px] bg-transparent border border-[var(--line)] rounded px-1.5 outline-none cursor-pointer"
      >
        <option value="">Tamanho</option>
        {TAMANHOS.map((t) => (
          <option key={t} value={t}>
            {t.replace('px', '')}
          </option>
        ))}
      </select>

      <Sep />

      <Bt title="Negrito (Ctrl+B)" ativo={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </Bt>
      <Bt title="Itálico (Ctrl+I)" ativo={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </Bt>
      <Bt title="Sublinhado (Ctrl+U)" ativo={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <u>U</u>
      </Bt>
      <Bt title="Tachado" ativo={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <s>S</s>
      </Bt>

      {/* cor do texto */}
      <div className="flex items-center gap-0.5 px-1">
        {CORES.map((cor) => (
          <button
            key={cor}
            type="button"
            title={`Cor ${cor}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setColor(cor).run()}
            className="w-[14px] h-[14px] rounded-full border border-black/15 shrink-0"
            style={{ background: cor }}
          />
        ))}
      </div>

      {/* marca-texto */}
      <div className="flex items-center gap-0.5 px-1">
        {MARCAS.map((cor) => (
          <button
            key={cor}
            type="button"
            title="Marca-texto"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHighlight({ color: cor }).run()}
            className="w-[14px] h-[14px] rounded-sm border border-black/15 shrink-0"
            style={{ background: cor }}
          />
        ))}
      </div>

      <Sep />

      <Bt title="Alinhar à esquerda" ativo={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        ≡
      </Bt>
      <Bt title="Centralizar" ativo={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        ⁃
      </Bt>
      <Bt title="Alinhar à direita" ativo={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        ≣
      </Bt>
      <Bt title="Justificar" ativo={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
        ☰
      </Bt>

      <Sep />

      <Bt title="Lista com marcadores" ativo={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        •
      </Bt>
      <Bt title="Lista numerada" ativo={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1.
      </Bt>
      <Bt title="Citação" ativo={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        &rdquo;
      </Bt>
      <Bt title="Código" ativo={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
        {'</>'}
      </Bt>
      <Bt title="Linha divisória" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        —
      </Bt>

      <Sep />

      <Bt
        title="Link externo"
        ativo={editor.isActive('link')}
        largo
        onClick={() => {
          const atual = editor.getAttributes('link').href ?? ''
          const url = window.prompt('Endereço do link (deixe vazio pra remover):', atual)
          if (url === null) return
          if (url === '') editor.chain().focus().unsetLink().run()
          else editor.chain().focus().setLink({ href: url }).run()
        }}
      >
        🔗
      </Bt>
      <Bt title="Link para outro resumo" largo onClick={() => editor.chain().focus().insertContent('[[').run()}>
        [[ ]]
      </Bt>

      <Sep />

      <Bt
        title="Limpar formatação"
        largo
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        ⌫
      </Bt>
    </div>
  )
}

export default function EditorCorpo({
  conteudoInicial,
  titulos,
  resumoId,
}: {
  conteudoInicial: string
  titulos: string[]
  resumoId?: string
}) {
  const [html, setHtml] = useState(conteudoInicial)
  const [sugestao, setSugestao] = useState<EstadoSugestao | null>(null)
  const [indice, setIndice] = useState(0)
  const [status, setStatus] = useState<'parado' | 'salvando' | 'salvo' | 'erro'>('parado')
  const [palavras, setPalavras] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const aoEstado = useCallback((estado: EstadoSugestao | null) => {
    setSugestao(estado)
    if (estado) setIndice(estado.indice)
  }, [])

  const aoIndice = useCallback((mover: (atual: number, total: number) => number) => {
    setIndice((atual) => mover(atual, 0))
  }, [])

  // agendado a cada digitação (não num efeito): espera 1,2s de silêncio antes
  // de gravar, pra não bater no banco a cada tecla.
  const agendarAutosave = useCallback(
    (novoHtml: string) => {
      if (!resumoId) return
      setStatus('salvando')
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        const r = await salvarCorpoAuto(resumoId, novoHtml)
        setStatus(r?.ok ? 'salvo' : 'erro')
      }, 1200)
    },
    [resumoId]
  )

  // limpa o timer pendente se sair da página no meio da digitação
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const editor = useEditor({
    // evita erro de hidratação: o editor só monta no cliente
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Comece a escrever o resumo…' }),
      CharacterCount,
      WikilinkSuggestion.configure({
        titulos: () => titulos,
        onEstado: aoEstado,
        onIndice: aoIndice,
      }),
    ],
    content: conteudoInicial || '<p></p>',
    editorProps: {
      attributes: { class: 'conteudo-resumo focus:outline-none' },
    },
    onUpdate: ({ editor }) => {
      const novoHtml = editor.getHTML()
      setHtml(novoHtml)
      setPalavras(editor.storage.characterCount?.words?.() ?? 0)
      agendarAutosave(novoHtml)
    },
    onCreate: ({ editor }) => {
      setPalavras(editor.storage.characterCount?.words?.() ?? 0)
    },
  })

  const rotuloStatus = {
    parado: resumoId ? 'Salvamento automático ligado' : 'Salve uma vez pra ligar o automático',
    salvando: 'Salvando…',
    salvo: 'Tudo salvo',
    erro: 'Falha ao salvar — use o botão Salvar',
  }[status]

  return (
    <div className="border border-[var(--line)] rounded-md overflow-hidden bg-white">
      {editor && <Barra editor={editor} />}

      {/* área cinza com a "folha" no meio, igual editor de documento */}
      <div className="bg-[#EDEBE7] px-4 py-6 max-h-[62vh] overflow-y-auto">
        <div className="mx-auto bg-white shadow-[0_1px_4px_rgba(0,0,0,0.13)] rounded-[2px] max-w-[760px] min-h-[520px] px-[70px] py-[58px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* rodapé de status */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-t border-[var(--line)] bg-[var(--panel)] text-[11px] text-[var(--ink-dim)]">
        <span>{palavras} palavras</span>
        <span className="opacity-40">·</span>
        <span className={status === 'erro' ? 'text-[var(--stamp)]' : undefined}>{rotuloStatus}</span>
        <span className="ml-auto opacity-70">
          digite <code className="font-mono-plex">[[</code> pra linkar outro resumo
        </span>
      </div>

      {/* é isto que o server action recebe */}
      <input type="hidden" name="corpo" value={html} />

      {sugestao && sugestao.itens.length > 0 && sugestao.rect && (
        <ul
          className="fixed z-50 bg-white border border-[var(--line)] rounded-md shadow-lg py-1 min-w-[220px] max-h-[240px] overflow-auto"
          style={{ top: sugestao.rect.bottom + 6, left: sugestao.rect.left }}
        >
          {sugestao.itens.map((titulo, i) => (
            <li key={titulo}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  sugestao.escolher(titulo)
                }}
                className={`w-full text-left px-3 py-1.5 text-sm ${
                  i === indice ? 'bg-[var(--sel)] font-medium' : ''
                }`}
              >
                {titulo}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

'use client'

// idem à página do resumo: o CSS do KaTeX é carregado por quem mostra fórmula,
// e não pelo globals.css, que embarca em toda página do site
import 'katex/dist/katex.min.css'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extension-placeholder'
import { CharacterCount } from '@tiptap/extension-character-count'
import { InlineMath, BlockMath } from '@tiptap/extension-mathematics'
import { TableKit } from '@tiptap/extension-table'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
// o mhchem ensina o KaTeX a ler \ce{...}; aqui é pro preview dentro do editor,
// o mesmo import existe em lib/matematica.ts para a renderização no servidor
import 'katex/dist/contrib/mhchem.mjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { WikilinkSuggestion, type EstadoSugestao } from './wikilinkSuggestion'
import { TermoNegrito } from './termoNegrito'
import BarraFormula, { type Alvo } from './BarraFormula'
import { salvarCorpoAuto } from './actions'

/* Cores de texto claras: no tema escuro as antigas (#1D1B18, #8A1224…) eram
   quase invisíveis sobre a folha. Mesmos matizes das matérias, pra que o
   destaque dentro do resumo converse com o marcador da matéria. */
const CORES = ['#E9E9ED', '#E08088', '#7FA8CF', '#8FAE94', '#C576A6', '#C98663', '#B2B6CA']

/* Os grifos continuam pastéis claros — `.conteudo-resumo mark` força o texto
   escuro por cima deles, então seguem legíveis. */
const MARCAS = ['#FFF3A3', '#C9EFC4', '#BFE0FF', '#FFD1DC']
const TAMANHOS = ['14px', '16px', '18px', '22px', '28px']

/* Símbolos tirados dos resumos de Física: são os que apareciam colados de
   fora, um a um. Agrupados como se lê, não em ordem de código. */
const SIMBOLOS: { grupo: string; itens: string[] }[] = [
  { grupo: 'Gregas', itens: ['α', 'β', 'γ', 'θ', 'λ', 'μ', 'π', 'ρ', 'τ', 'ω', 'Δ', 'Σ', 'Ω'] },
  { grupo: 'Operadores', itens: ['×', '·', '÷', '±', '√', '∛', '∞', '∝', '∑', '∫'] },
  { grupo: 'Comparação', itens: ['≠', '≤', '≥', '≈', '≡', '→', '⇌', '∴'] },
  { grupo: 'Índices', itens: ['²', '³', '⁻¹', '₀', '₁', '₂', '°', 'Å'] },
]

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

/**
 * Paleta de símbolos que insere TEXTO, não fórmula.
 *
 * O editor de equação já existe e continua sendo o caminho para a fórmula
 * inteira. Mas metade do resumo de Física é prosa que só precisa de um `μ` ou
 * de um `Δ` no meio da frase — abrir o KaTeX pra isso é caro, e era o que
 * empurrava o autor pro "copiar de outro lugar e colar".
 */
function MenuSimbolos({ editor }: { editor: Editor }) {
  const [aberto, setAberto] = useState(false)
  const caixa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return
    function aoClicarFora(e: MouseEvent) {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false)
    }
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto])

  return (
    <div className="relative shrink-0" ref={caixa}>
      <Bt title="Inserir símbolo" largo ativo={aberto} onClick={() => setAberto((v) => !v)}>
        Ω Símbolos
      </Bt>
      {aberto && (
        <div className="absolute z-50 top-[32px] left-0 w-[268px] bg-[var(--raised)] border border-[var(--line-forte)] rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.5)] p-2.5">
          {SIMBOLOS.map(({ grupo, itens }) => (
            <div key={grupo} className="mb-2 last:mb-0">
              <div className="rotulo-secao text-[9.5px] mb-1">{grupo}</div>
              <div className="flex flex-wrap gap-0.5">
                {itens.map((s) => (
                  <button
                    key={s}
                    type="button"
                    title={s}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().insertContent(s).run()
                      setAberto(false)
                    }}
                    className="w-[26px] h-[26px] rounded text-[14px] text-[var(--ink)] hover:bg-[var(--sel)] flex items-center justify-center"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Controles de tabela — só aparecem com o cursor dentro de uma.
 *
 * Ficam numa faixa separada em vez de na barra principal: são oito ações que
 * não servem pra mais nada, e deixá-las sempre visíveis (cinzas) só faria a
 * barra crescer e esconder o que se usa a toda hora.
 */
function BarraTabela({ editor }: { editor: Editor }) {
  if (!editor.isActive('table')) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5 bg-[var(--surface-2,var(--panel))] border-b border-[var(--line)]">
      <span className="rotulo-secao text-[10px] mr-1.5">Tabela</span>
      <Bt title="Inserir linha acima" largo onClick={() => editor.chain().focus().addRowBefore().run()}>
        ↑+ linha
      </Bt>
      <Bt title="Inserir linha abaixo" largo onClick={() => editor.chain().focus().addRowAfter().run()}>
        ↓+ linha
      </Bt>
      <Bt title="Remover linha" largo onClick={() => editor.chain().focus().deleteRow().run()}>
        − linha
      </Bt>
      <Sep />
      <Bt title="Inserir coluna à esquerda" largo onClick={() => editor.chain().focus().addColumnBefore().run()}>
        ←+ coluna
      </Bt>
      <Bt title="Inserir coluna à direita" largo onClick={() => editor.chain().focus().addColumnAfter().run()}>
        →+ coluna
      </Bt>
      <Bt title="Remover coluna" largo onClick={() => editor.chain().focus().deleteColumn().run()}>
        − coluna
      </Bt>
      <Sep />
      <Bt
        title="Alternar linha de cabeçalho"
        largo
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        Cabeçalho
      </Bt>
      <Bt title="Juntar ou separar células" largo onClick={() => editor.chain().focus().mergeOrSplit().run()}>
        Juntar/separar
      </Bt>
      <Bt
        title="Remover a tabela inteira"
        largo
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        🗑 Remover tabela
      </Bt>
    </div>
  )
}

function Barra({
  editor,
  telaCheia,
  aoAlternarTela,
  aoAbrirFormula,
  formulaAberta,
}: {
  editor: Editor
  telaCheia: boolean
  aoAlternarTela: () => void
  aoAbrirFormula: () => void
  formulaAberta: boolean
}) {
  const estilo = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : editor.isActive('heading', { level: 4 })
        ? 'h4'
        : 'p'

  // "18px" → "18"; sem fontSize definido o campo fica vazio e mostra o padrão
  // do corpo como placeholder
  const tamanhoDoEditor = String(editor.getAttributes('textStyle').fontSize ?? '').replace('px', '')

  /**
   * O que está no campo enquanto se digita, que nem sempre é o que o editor
   * tem. Sem esse estado o campo seria controlado direto pelo editor e não
   * daria pra digitar número de dois dígitos: o "2" de "23" é menor que o
   * mínimo, seria recusado, e o React repintaria o campo com o valor antigo
   * antes do "3" chegar. `null` significa "espelhe o editor".
   */
  const [tamanhoDigitado, setTamanhoDigitado] = useState<string | null>(null)
  const tamanhoAtual = tamanhoDigitado ?? tamanhoDoEditor

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

      {/* Tamanho é campo numérico livre, não uma lista fechada: os cinco
          valores de antes cobriam o que se imaginou na mesa, não o que o texto
          pede. A `datalist` mantém os atalhos comuns a um clique, e os limites
          (8–96) só barram o que quebraria a leitura. Vazio = tamanho padrão do
          corpo do resumo. */}
      <span className="inline-flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={8}
          max={96}
          step={1}
          list="tamanhos-de-texto"
          aria-label="Tamanho do texto, em pixels"
          title="Tamanho do texto (px) — vazio usa o tamanho padrão"
          value={tamanhoAtual}
          onChange={(e) => {
            const v = e.target.value
            setTamanhoDigitado(v)

            // Sem `.focus()` de propósito: devolver o foco ao editor aqui
            // tiraria o cursor do campo no meio da digitação. Os comandos do
            // TipTap agem sobre a seleção guardada, que continua de pé.
            if (v === '') return editor.chain().unsetFontSize().run()
            const n = Number(v)
            // fora da faixa, guarda o que foi digitado mas não aplica —
            // é o estado passageiro de quem ainda está digitando "23"
            if (!Number.isFinite(n) || n < 8 || n > 96) return
            editor.chain().setFontSize(`${n}px`).run()
          }}
          // ao sair, o campo volta a espelhar o editor: se o que ficou ali era
          // inválido, ele some em vez de mentir sobre o tamanho aplicado
          onBlur={() => setTamanhoDigitado(null)}
          // as setinhas nativas do `number` comiam metade da caixa e cortavam
          // o segundo dígito; sem elas cabe o número e o marcador da datalist
          className="campo !w-[52px] h-[28px] !py-0 !px-1.5 text-[12.5px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
          placeholder="17"
        />
        <datalist id="tamanhos-de-texto">
          {TAMANHOS.map((t) => (
            <option key={t} value={t.replace('px', '')} />
          ))}
        </datalist>
      </span>

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
      <Bt
        title="Subscrito (Ctrl+,) — v₀, μc"
        ativo={editor.isActive('subscript')}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        x<sub>2</sub>
      </Bt>
      <Bt
        title="Sobrescrito (Ctrl+.) — x², 10⁻¹¹"
        ativo={editor.isActive('superscript')}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        x<sup>2</sup>
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
      {/* Recuo por botão, além do Tab. O corpo do resumo é uma árvore de
          tópicos de 4 ou 5 níveis, e nessa profundidade o Tab exige que o
          cursor esteja no lugar certo do item — o botão funciona de qualquer
          posição da linha, como no editor de documentos de origem. */}
      <Bt
        title="Diminuir recuo (Shift+Tab)"
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
      >
        ⇤
      </Bt>
      <Bt
        title="Aumentar recuo (Tab)"
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
      >
        ⇥
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
      <Bt
        // 2 colunas por padrão porque é o formato dos dois usos reais:
        // linha do tempo (ano | evento) e glossário (termo | definição)
        title="Inserir tabela 2 colunas — linha do tempo, glossário"
        largo
        ativo={editor.isActive('table')}
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()
        }
      >
        ▦ Tabela
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
        title="Inserir equação ou reação química"
        largo
        ativo={formulaAberta}
        onClick={aoAbrirFormula}
      >
        ∑ Equação
      </Bt>
      <MenuSimbolos editor={editor} />

      <Sep />

      <Bt
        title="Limpar formatação"
        largo
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        ⌫
      </Bt>

      <div className="ml-auto flex items-center gap-0.5">
        <Bt
          title={telaCheia ? 'Sair da janela completa (Esc)' : 'Janela completa'}
          largo
          ativo={telaCheia}
          onClick={aoAlternarTela}
        >
          {telaCheia ? '⤡ Sair' : '⤢ Janela completa'}
        </Bt>
      </div>
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
  const [telaCheia, setTelaCheia] = useState(false)
  const [alvoFormula, setAlvoFormula] = useState<Alvo | null>(null)
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

  // Esc sai da janela completa, e enquanto ela está aberta a página de trás não
  // rola — senão o fundo desliza junto quando se rola o texto
  useEffect(() => {
    if (!telaCheia) return
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') setTelaCheia(false)
    }
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = overflowAnterior
      window.removeEventListener('keydown', aoTeclar)
    }
  }, [telaCheia])

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
      // Subscrito e sobrescrito com marca de verdade, no lugar dos caracteres
      // Unicode (v₀, x², μ_c) que só existem para alguns símbolos e não seguem
      // o tamanho do texto em volta.
      Subscript,
      Superscript,
      // negrita o termo antes do `:`, no padrão em que os resumos são escritos
      TermoNegrito,
      // `resizable` deixa arrastar a divisa entre colunas: uma linha do tempo
      // quer a coluna do ano estreita, e um glossário quer o termo estreito.
      TableKit.configure({ table: { resizable: true } }),
      // fórmulas renderizadas ao vivo enquanto escreve. `throwOnError: false`
      // pra que uma fórmula pela metade (normal enquanto se digita) apareça em
      // vermelho em vez de estourar o editor.
      // clicar numa fórmula do texto abre a barra já preenchida.
      // `setAlvoFormula` pode ser capturado direto: setters do useState são
      // estáveis entre renders, então este closure nunca fica velho.
      InlineMath.configure({
        katexOptions: { throwOnError: false, errorColor: '#8A1224', strict: false },
        onClick: (node, pos) =>
          setAlvoFormula({
            modo: 'editar',
            pos,
            latex: String(node.attrs.latex ?? ''),
            emBloco: false,
          }),
      }),
      BlockMath.configure({
        katexOptions: { throwOnError: false, errorColor: '#8A1224', strict: false },
        onClick: (node, pos) =>
          setAlvoFormula({
            modo: 'editar',
            pos,
            latex: String(node.attrs.latex ?? ''),
            emBloco: true,
          }),
      }),
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

  /**
   * Grava a fórmula. Editar sempre apaga o nó antigo e insere outro, em vez de
   * usar updateInlineMath: assim trocar entre "em linha" e "linha própria"
   * funciona pelo mesmo caminho, sem um segundo ramo de código.
   */
  function confirmarFormula(latex: string, emBloco: boolean) {
    if (!editor) return
    if (alvoFormula?.modo === 'editar') {
      editor.chain().focus().setNodeSelection(alvoFormula.pos).deleteSelection().run()
    }
    const c = editor.chain().focus()
    if (emBloco) c.insertBlockMath({ latex }).run()
    else c.insertInlineMath({ latex }).run()
    setAlvoFormula(null)
  }

  function removerFormula() {
    if (!editor || alvoFormula?.modo !== 'editar') return setAlvoFormula(null)
    editor.chain().focus().setNodeSelection(alvoFormula.pos).deleteSelection().run()
    setAlvoFormula(null)
  }

  const rotuloStatus = {
    parado: resumoId ? 'Salvamento automático ligado' : 'Salve uma vez pra ligar o automático',
    salvando: 'Salvando…',
    salvo: 'Tudo salvo',
    erro: 'Falha ao salvar — use o botão Salvar',
  }[status]

  return (
    <div
      className={
        telaCheia
          ? 'fixed inset-0 z-40 bg-[var(--paper)] flex flex-col'
          : 'border border-[var(--line-forte)] rounded-lg overflow-hidden bg-[var(--paper)]'
      }
    >
      {editor && (
        <>
          <Barra
            editor={editor}
            telaCheia={telaCheia}
            aoAlternarTela={() => setTelaCheia((v) => !v)}
            formulaAberta={alvoFormula !== null}
            aoAbrirFormula={() =>
              setAlvoFormula((a) => (a ? null : { modo: 'novo', emBloco: false }))
            }
          />
          <BarraTabela editor={editor} />
        </>
      )}

      {alvoFormula ? (
        <BarraFormula
          // remonta ao trocar de fórmula, pra o campo carregar o LaTeX certo
          key={alvoFormula.modo === 'editar' ? `e${alvoFormula.pos}` : 'novo'}
          alvo={alvoFormula}
          aoConfirmar={confirmarFormula}
          aoRemover={removerFormula}
          aoCancelar={() => setAlvoFormula(null)}
        />
      ) : null}

      {/* Mesa e "folha" no meio, igual editor de documento. A folha é escura
          porque `.conteudo-resumo` agora escreve em texto claro: uma folha
          branca aqui deixaria o autor digitando cinza-claro sobre branco, e
          quebraria o WYSIWYG que faz o editor valer a pena. */}
      <div
        className={`bg-[var(--page)] px-4 py-6 overflow-y-auto ${
          telaCheia ? 'flex-1 min-h-0' : 'max-h-[62vh]'
        }`}
      >
        <div
          className={`mx-auto bg-[var(--paper)] shadow-[0_0_0_1px_var(--line-forte),0_8px_24px_rgba(0,0,0,0.4)] rounded-[3px] max-w-[760px] px-[70px] py-[58px] ${
            telaCheia ? 'min-h-full' : 'min-h-[520px]'
          }`}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* rodapé de status */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-t border-[var(--line)] bg-[var(--panel)] text-[11px] text-[var(--ink-dim)]">
        <span>{palavras} palavras</span>
        <span className="opacity-40">·</span>
        <span className={status === 'erro' ? 'text-[var(--stamp)]' : undefined}>{rotuloStatus}</span>
        <span className="ml-auto opacity-70">
          <code className="font-mono-plex">[[</code> linka outro resumo ·{' '}
          <code className="font-mono-plex">$x^2$</code> vira fórmula
          {telaCheia ? ' · Esc sai da janela completa' : ''}
        </span>
      </div>

      {/* é isto que o server action recebe */}
      <input type="hidden" name="corpo" value={html} />

      {sugestao && sugestao.itens.length > 0 && sugestao.rect && (
        <ul
          className="fixed z-50 bg-[var(--raised)] border border-[var(--line-forte)] rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.5)] py-1 min-w-[220px] max-h-[240px] overflow-auto"
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

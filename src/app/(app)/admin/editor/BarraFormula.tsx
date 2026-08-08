'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/contrib/mhchem.mjs'
import { PALETAS, EXEMPLOS, type Simbolo } from './paletas'

/**
 * Barra de equação no espírito do Google Docs: paletas de símbolos clicáveis,
 * campo com o LaTeX e prévia ao vivo. O autor monta a fórmula clicando; quem
 * já sabe LaTeX digita direto no campo. Os dois caminhos editam a mesma coisa.
 */

export type Alvo =
  | { modo: 'novo'; emBloco: boolean }
  | { modo: 'editar'; pos: number; emBloco: boolean; latex: string }

/** `@` marca onde o cursor deve parar depois de inserir o símbolo. */
function aplicarSimbolo(texto: string, inicio: number, fim: number, simbolo: Simbolo) {
  const marca = simbolo.latex.indexOf('@')
  const selecionado = texto.slice(inicio, fim)
  const corpo = simbolo.latex.replace('@', selecionado)
  const novo = texto.slice(0, inicio) + corpo + texto.slice(fim)
  // sem `@` o cursor vai pro fim do que foi inserido
  const cursor = marca === -1 ? inicio + corpo.length : inicio + marca + selecionado.length
  return { novo, cursor }
}

function previa(latex: string, emBloco: boolean) {
  const limpo = latex.trim()
  if (!limpo) return { html: '', erro: null as string | null }
  try {
    return {
      html: katex.renderToString(limpo, {
        displayMode: emBloco,
        throwOnError: true,
        strict: false,
        trust: false,
      }),
      erro: null,
    }
  } catch (e) {
    return {
      html: '',
      erro: e instanceof Error ? e.message.replace(/^KaTeX parse error:\s*/, '') : 'fórmula inválida',
    }
  }
}

function BotaoSimbolo({
  simbolo,
  aoEscolher,
}: {
  simbolo: Simbolo
  aoEscolher: (s: Simbolo) => void
}) {
  // renderiza o próprio símbolo no botão — é o que faz a paleta ser navegável
  // por reconhecimento visual em vez de leitura de comandos
  const html = useMemo(() => {
    try {
      return katex.renderToString(simbolo.mostra, { throwOnError: false, strict: false })
    } catch {
      return simbolo.mostra
    }
  }, [simbolo.mostra])

  return (
    <button
      type="button"
      title={`${simbolo.nome}  ·  ${simbolo.latex.replace('@', '')}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => aoEscolher(simbolo)}
      className="min-w-[38px] h-[34px] px-1.5 rounded border border-transparent hover:border-[var(--line)] hover:bg-[var(--sel)] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default function BarraFormula({
  alvo,
  aoConfirmar,
  aoRemover,
  aoCancelar,
}: {
  alvo: Alvo
  aoConfirmar: (latex: string, emBloco: boolean) => void
  aoRemover: () => void
  aoCancelar: () => void
}) {
  const [latex, setLatex] = useState(alvo.modo === 'editar' ? alvo.latex : '')
  const [emBloco, setEmBloco] = useState(alvo.emBloco)
  const [paleta, setPaleta] = useState(PALETAS[0].id)
  const campo = useRef<HTMLTextAreaElement>(null)
  const cursorDesejado = useRef<number | null>(null)

  const { html, erro } = useMemo(() => previa(latex, emBloco), [latex, emBloco])

  // foca o campo ao abrir, pra dar pra digitar imediatamente
  useEffect(() => {
    campo.current?.focus()
    campo.current?.setSelectionRange(latex.length, latex.length)
    // só na montagem: reposicionar a cada tecla atrapalharia a digitação
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // reposiciona o cursor depois que o React aplicou o texto novo
  useEffect(() => {
    if (cursorDesejado.current === null) return
    const pos = cursorDesejado.current
    cursorDesejado.current = null
    campo.current?.focus()
    campo.current?.setSelectionRange(pos, pos)
  }, [latex])

  function inserir(simbolo: Simbolo) {
    const el = campo.current
    const inicio = el?.selectionStart ?? latex.length
    const fim = el?.selectionEnd ?? latex.length
    const { novo, cursor } = aplicarSimbolo(latex, inicio, fim, simbolo)
    cursorDesejado.current = cursor
    setLatex(novo)
  }

  function confirmar() {
    if (!latex.trim()) return aoCancelar()
    aoConfirmar(latex.trim(), emBloco)
  }

  const simbolosDaPaleta = PALETAS.find((p) => p.id === paleta)?.simbolos ?? []

  return (
    <div
      className="border-b border-[var(--line)] bg-[var(--panel)]"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          aoCancelar()
        }
      }}
    >
      {/* abas das paletas */}
      <div className="flex items-center gap-1 px-3 pt-2 flex-wrap">
        {PALETAS.map((p) => (
          <button
            key={p.id}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setPaleta(p.id)}
            className={`px-2.5 py-1 rounded text-[12px] ${
              paleta === p.id
                ? 'bg-[var(--sel)] font-medium text-[var(--ink)]'
                : 'text-[var(--ink-dim)] hover:bg-[var(--sel)]'
            }`}
          >
            {p.rotulo}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1">
          <label className="flex items-center gap-1.5 text-[12px] text-[var(--ink-dim)] cursor-pointer">
            <input
              type="checkbox"
              checked={emBloco}
              onChange={(e) => setEmBloco(e.target.checked)}
              className="accent-[var(--stamp)]"
            />
            Linha própria
          </label>
        </div>
      </div>

      {/* grade de símbolos */}
      <div className="px-3 py-2 flex flex-wrap gap-0.5 max-h-[132px] overflow-y-auto">
        {simbolosDaPaleta.map((s) => (
          <BotaoSimbolo key={s.nome} simbolo={s} aoEscolher={inserir} />
        ))}
      </div>

      {/* campo + prévia */}
      <div className="px-3 pb-2.5 flex gap-3 items-start flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <label htmlFor="campo-latex" className="block text-[11px] text-[var(--ink-dim)] mb-1">
            Fórmula
          </label>
          <textarea
            id="campo-latex"
            ref={campo}
            rows={2}
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            onKeyDown={(e) => {
              // Enter confirma; Shift+Enter quebra linha dentro da fórmula
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                confirmar()
              }
            }}
            placeholder="Clique nos símbolos acima ou digite LaTeX…"
            spellCheck={false}
            className="w-full font-mono-plex text-[12.5px] border border-[var(--line)] rounded px-2.5 py-2 outline-none resize-y bg-[var(--raised)] focus:border-[var(--stamp)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
          />
        </div>

        <div className="flex-1 min-w-[220px]">
          <span className="block text-[11px] text-[var(--ink-dim)] mb-1">Prévia</span>
          <div className="min-h-[52px] border border-[var(--line)] rounded bg-[var(--raised)] px-3 py-2 flex items-center overflow-x-auto">
            {erro ? (
              <span className="text-[11.5px] text-[var(--stamp)] font-mono-plex">{erro}</span>
            ) : html ? (
              <span dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <span className="text-[11.5px] text-[var(--ink-dim)]">
                A fórmula aparece aqui enquanto você monta.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* exemplos + ações */}
      <div className="px-3 pb-2.5 flex items-center gap-2 flex-wrap">
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) setLatex(e.target.value)
          }}
          className="h-[28px] text-[12px] bg-[var(--raised)] border border-[var(--line)] rounded px-1.5 outline-none cursor-pointer"
        >
          <option value="">Começar de um exemplo…</option>
          {EXEMPLOS.map((ex) => (
            <option key={ex.nome} value={ex.latex}>
              {ex.nome}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          {alvo.modo === 'editar' ? (
            <button
              type="button"
              onClick={aoRemover}
              className="text-[12px] px-3 py-1.5 rounded border border-[var(--line)] text-[var(--ink-dim)] hover:text-[var(--stamp)] hover:border-[var(--stamp)]"
            >
              Remover
            </button>
          ) : null}
          <button
            type="button"
            onClick={aoCancelar}
            className="text-[12px] px-3 py-1.5 rounded border border-[var(--line)] text-[var(--ink-dim)] hover:bg-[var(--sel)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={!latex.trim() || !!erro}
            className="text-[12px] font-semibold px-4 py-1.5 rounded botao-primario disabled:opacity-45"
          >
            {alvo.modo === 'editar' ? 'Atualizar' : 'Inserir'}
          </button>
        </div>
      </div>
    </div>
  )
}

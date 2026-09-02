'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/contrib/mhchem.mjs'
import {
  PALETAS,
  EXEMPLOS,
  buscarSimbolos,
  normalizar,
  TOTAL_DE_SIMBOLOS,
  type Simbolo,
} from './paletas'
// `import type`, e tem de continuar assim: `lib/formulas.ts` importa
// `getSessao` → `next/headers`, e um import de valor arrastaria isso para o
// pacote do navegador. Como tipo, ele é apagado na compilação.
import type { FormulaSalva } from '@/lib/formulas'

/**
 * Barra de equação no espírito do Google Docs: paletas de símbolos clicáveis,
 * campo com o LaTeX e prévia ao vivo. O autor monta a fórmula clicando; quem
 * já sabe LaTeX digita direto no campo. Os dois caminhos editam a mesma coisa.
 *
 * A BUSCA É O QUE FAZ O CATÁLOGO INTEIRO SER USÁVEL
 * -------------------------------------------------
 * As paletas passaram de ~140 símbolos para os 726 que o KaTeX sabe desenhar
 * (ver `catalogo.ts`). Doze abas com até 180 botões cada não se navegam só por
 * rolagem: o que estava a um relance de olho vira uma caçada. Por isso a busca
 * vem junto e varre TUDO de uma vez, ignorando a aba aberta — e casa três
 * coisas, porque as três são jeitos reais de saber o que se quer: o nome em
 * português ("raiz"), o comando ("\\sqrt") e o próprio caractere colado de
 * outro lugar ("√"). O último é o caso que motivou tudo: o autor achava o
 * símbolo fora do site e colava.
 *
 * "MINHAS FÓRMULAS" É LISTA, E AS OUTRAS DOZE SÃO GRADE
 * ----------------------------------------------------
 * A grade existe para varrer glifo por reconhecimento; uma fórmula guardada
 * tem NOME, e o nome é o que se procura. Por isso a aba do autor é uma lista
 * com o nome à esquerda em coluna fixa e o desenho à direita — nessa ordem,
 * porque o nome é a identidade e não pode cortar nunca. O desenho, quando não
 * couber, ESMAECE no fim em vez de cortar seco: corte seco parece defeito,
 * esmaecido diz que tem mais. (A primeira versão punha o desenho numa coluna
 * fixa de 200px e cortava fórmula longa em silêncio — 231px de conteúdo.)
 */

export type Alvo =
  | { modo: 'novo'; emBloco: boolean }
  | { modo: 'editar'; pos: number; emBloco: boolean; latex: string }

/** A aba do autor. Não sai de `PALETAS` porque o conteúdo dela vem do banco. */
const ABA_MINHAS = 'minhas'

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

/** Uma fórmula guardada, na lista da aba "Minhas fórmulas" e nos resultados. */
function LinhaFormula({
  formula,
  aoUsar,
  aoExcluir,
  ocupado,
}: {
  formula: FormulaSalva
  aoUsar: (f: FormulaSalva) => void
  aoExcluir: (f: FormulaSalva) => void
  ocupado: boolean
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula.latex, { throwOnError: false, strict: false })
    } catch {
      return formula.latex
    }
  }, [formula.latex])

  return (
    <li className="flex items-center gap-1.5">
      <button
        type="button"
        title={`Inserir no cursor — ${formula.latex}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => aoUsar(formula)}
        className="flex-1 min-w-0 flex items-center gap-3 text-left px-2 py-1 rounded border border-transparent hover:border-[var(--line)] hover:bg-[var(--sel)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
      >
        <span className="shrink-0 w-[190px] truncate text-[12px] text-[var(--ink)]">
          {formula.nome}
        </span>
        {/* o desenho esmaece no fim quando não cabe — ver o cabeçalho */}
        <span
          className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-[var(--ink-dim)]"
          style={{
            maskImage: 'linear-gradient(to right, #000 calc(100% - 28px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, #000 calc(100% - 28px), transparent)',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </button>
      <button
        type="button"
        title={`Excluir ${formula.nome}`}
        aria-label={`Excluir a fórmula ${formula.nome}`}
        disabled={ocupado}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => aoExcluir(formula)}
        className="shrink-0 w-6 h-6 rounded border border-transparent text-[var(--ink-dim)] leading-none hover:border-[var(--stamp)] hover:text-[var(--stamp)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
      >
        ×
      </button>
    </li>
  )
}

export default function BarraFormula({
  alvo,
  formulas,
  aoConfirmar,
  aoRemover,
  aoCancelar,
  aoSalvarFormula,
  aoExcluirFormula,
}: {
  alvo: Alvo
  formulas: FormulaSalva[]
  aoConfirmar: (latex: string, emBloco: boolean) => void
  aoRemover: () => void
  aoCancelar: () => void
  aoSalvarFormula: (nome: string, latex: string, emBloco: boolean) => Promise<void>
  aoExcluirFormula: (id: string) => Promise<void>
}) {
  const [latex, setLatex] = useState(alvo.modo === 'editar' ? alvo.latex : '')
  const [emBloco, setEmBloco] = useState(alvo.emBloco)
  const [paleta, setPaleta] = useState(ABA_MINHAS)
  const [busca, setBusca] = useState('')
  // nomeando: null = a fileira de ações normal; string = a caixa de salvar
  const [nomeNovo, setNomeNovo] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const campo = useRef<HTMLTextAreaElement>(null)
  const campoNome = useRef<HTMLInputElement>(null)
  const cursorDesejado = useRef<number | null>(null)

  const { html, erro } = useMemo(() => previa(latex, emBloco), [latex, emBloco])

  // foca o campo ao abrir, pra dar pra digitar imediatamente
  useEffect(() => {
    campo.current?.focus()
    campo.current?.setSelectionRange(latex.length, latex.length)
    // só na montagem: reposicionar a cada tecla atrapalharia a digitação
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // abrir a caixa de nomear já põe o cursor lá — quem clicou em Salvar quer
  // digitar o nome, não caçar o campo
  useEffect(() => {
    if (nomeNovo === '') campoNome.current?.focus()
  }, [nomeNovo])

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

  const procurando = busca.trim().length > 0
  const resultados = useMemo(() => (procurando ? buscarSimbolos(busca) : []), [busca, procurando])

  // As guardadas entram na busca junto com os símbolos, e por nome: elas não
  // cabem no índice de `paletas.ts`, que é montado uma vez no módulo, porque
  // mudam a cada salvar.
  const formulasAchadas = useMemo(() => {
    if (!procurando) return []
    const partes = normalizar(busca.trim()).split(/\s+/)
    return formulas.filter((f) => {
      const chave = normalizar(f.nome)
      return partes.every((p) => chave.includes(p))
    })
  }, [busca, procurando, formulas])

  const simbolosDaPaleta = PALETAS.find((p) => p.id === paleta)?.simbolos ?? []
  const naGrade = procurando ? resultados : paleta === ABA_MINHAS ? [] : simbolosDaPaleta
  const naLista = procurando ? formulasAchadas : paleta === ABA_MINHAS ? formulas : []
  const achados = resultados.length + formulasAchadas.length

  function usarFormula(f: FormulaSalva) {
    // Uma fórmula guardada é inserida no cursor, como todo botão da barra —
    // uma regra só. Com o campo vazio (o caso normal ao abrir) inserir e
    // substituir dão no mesmo; com o campo cheio, ela vira peça de uma
    // expressão maior.
    inserir({ mostra: f.latex, latex: f.latex, nome: f.nome })
    // "Linha própria" faz parte do que foi guardado (ver a migration)
    if (f.em_bloco) setEmBloco(true)
  }

  async function excluirFormula(f: FormulaSalva) {
    setOcupado(true)
    try {
      await aoExcluirFormula(f.id)
    } finally {
      setOcupado(false)
    }
  }

  const nomeLimpo = (nomeNovo ?? '').trim()
  const jaExiste = formulas.some((f) => f.nome.toLowerCase() === nomeLimpo.toLowerCase())

  async function guardar() {
    if (!nomeLimpo || !latex.trim() || erro) return
    setOcupado(true)
    try {
      await aoSalvarFormula(nomeLimpo, latex.trim(), emBloco)
      setNomeNovo(null)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div
      className="border-b border-[var(--line)] bg-[var(--panel)]"
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return
        e.stopPropagation()
        // Esc desfaz a última camada aberta antes de fechar a barra: quem
        // desistiu de nomear, ou procurou e não achou, quer voltar — não
        // perder a fórmula que já montou.
        if (nomeNovo !== null) setNomeNovo(null)
        else if (procurando) setBusca('')
        else aoCancelar()
      }}
    >
      {/* abas das paletas — a do autor vem primeiro, é a bancada dele */}
      <div className="flex items-center gap-1 px-3 pt-2 flex-wrap">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setPaleta(ABA_MINHAS)
            setBusca('')
          }}
          className={`px-2.5 py-1 rounded text-[12px] ${
            paleta === ABA_MINHAS && !procurando
              ? 'bg-[var(--sel)] font-medium text-[var(--ink)]'
              : 'text-[var(--ink-dim)] hover:bg-[var(--sel)]'
          }`}
        >
          Minhas fórmulas
          {formulas.length > 0 ? (
            <span className="ml-1 text-[var(--ink-dim)] tabular-nums">{formulas.length}</span>
          ) : null}
        </button>
        {PALETAS.map((p) => (
          <button
            key={p.id}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setPaleta(p.id)
              setBusca('')
            }}
            className={`px-2.5 py-1 rounded text-[12px] ${
              paleta === p.id && !procurando
                ? 'bg-[var(--sel)] font-medium text-[var(--ink)]'
                : 'text-[var(--ink-dim)] hover:bg-[var(--sel)]'
            }`}
          >
            {p.rotulo}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
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

      {/* busca — varre as doze paletas de uma vez */}
      <div className="px-3 pt-2 flex items-center gap-2">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={`Buscar entre ${TOTAL_DE_SIMBOLOS} símbolos: nome, comando ou o próprio sinal…`}
          aria-label="Buscar símbolo por nome, comando LaTeX ou caractere"
          spellCheck={false}
          className="flex-1 min-w-0 h-[28px] text-[12px] bg-[var(--raised)] text-[var(--ink)] border border-[var(--line)] rounded px-2.5 outline-none focus:border-[var(--stamp)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
        />
        {procurando ? (
          <span aria-live="polite" className="text-[11px] text-[var(--ink-dim)] whitespace-nowrap">
            {achados === 0
              ? 'nada encontrado'
              : `${achados}${resultados.length >= 200 ? '+' : ''} resultado${achados === 1 ? '' : 's'}`}
          </span>
        ) : null}
      </div>

      {/* fórmulas guardadas (lista) e símbolos (grade) dividem a mesma caixa
          rolante: buscando, as duas coisas aparecem juntas, e a forma de cada
          uma já as distingue sem precisar de título */}
      <div className="px-3 py-2 max-h-[152px] overflow-y-auto">
        {naLista.length > 0 ? (
          <ul className={`flex flex-col gap-0.5 ${naGrade.length > 0 ? 'mb-2' : ''}`}>
            {naLista.map((f) => (
              <LinhaFormula
                key={f.id}
                formula={f}
                aoUsar={usarFormula}
                aoExcluir={excluirFormula}
                ocupado={ocupado}
              />
            ))}
          </ul>
        ) : null}

        {naGrade.length > 0 ? (
          <div className="flex flex-wrap gap-0.5">
            {naGrade.map((s) => (
              <BotaoSimbolo key={s.latex} simbolo={s} aoEscolher={inserir} />
            ))}
          </div>
        ) : null}

        {procurando && achados === 0 ? (
          <p className="text-[12px] text-[var(--ink-dim)] py-2">
            Nada com isso. O editor escreve o que o KaTeX desenha — se o sinal não está aqui, ele
            não renderiza na página do aluno.
          </p>
        ) : null}

        {!procurando && paleta === ABA_MINHAS && formulas.length === 0 ? (
          <p className="text-[12px] text-[var(--ink-dim)] py-2">
            Nenhuma fórmula guardada ainda. Monte uma aqui embaixo e clique em{' '}
            <strong className="font-medium text-[var(--ink)]">Salvar</strong> — ela volta nesta aba,
            com o nome que você der.
          </p>
        ) : null}
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

      {/* Nomear substitui a fileira de ações inteira em vez de conviver com
          ela: uma tarefa por vez, e Cancelar traz tudo de volta. */}
      {nomeNovo !== null ? (
        <div className="px-3 pb-2.5 flex items-center gap-2 flex-wrap">
          <input
            ref={campoNome}
            value={nomeNovo}
            onChange={(e) => setNomeNovo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                guardar()
              }
            }}
            maxLength={80}
            placeholder="Nome desta fórmula…"
            aria-label="Nome desta fórmula"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 min-w-[200px] h-[30px] text-[12px] bg-[var(--raised)] text-[var(--ink)] border border-[var(--line)] rounded px-2.5 outline-none focus:border-[var(--stamp)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          />
          {/* sobrescrever calado é o jeito de perder uma fórmula sem saber */}
          {jaExiste ? (
            <span aria-live="polite" className="text-[11px] text-[var(--stamp)] whitespace-nowrap">
              já existe — guardar substitui
            </span>
          ) : null}
          <button
            type="button"
            onClick={guardar}
            disabled={!nomeLimpo || ocupado}
            className="text-[12px] font-semibold px-4 py-1.5 rounded botao-primario disabled:opacity-45"
          >
            {jaExiste ? 'Substituir' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => setNomeNovo(null)}
            disabled={ocupado}
            className="text-[12px] px-3 py-1.5 rounded border border-[var(--line)] text-[var(--ink-dim)] hover:bg-[var(--sel)] disabled:opacity-45"
          >
            Cancelar
          </button>
        </div>
      ) : null}

      {/* exemplos + ações.
          Desmonta enquanto se nomeia, em vez de levar `hidden` junto do
          `flex`: as duas são utilitárias de `display`, e quem ganha é a ordem
          no CSS GERADO pelo Tailwind, não a ordem no atributo `class` — medido,
          `flex` vencia e a fileira continuava na tela. Mesma família da
          armadilha da decisão 9g-quinquies. */}
      {nomeNovo === null ? (
        <div className="px-3 pb-2.5 flex items-center gap-2 flex-wrap">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) setLatex(e.target.value)
            }}
            aria-label="Começar de um exemplo"
            className="h-[28px] text-[12px] bg-[var(--raised)] text-[var(--ink)] border border-[var(--line)] rounded px-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            <option value="">Começar de um exemplo…</option>
            {EXEMPLOS.map((ex) => (
              <option key={ex.nome} value={ex.latex}>
                {ex.nome}
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-2">
            {/* Trava pela MESMA regra do Inserir: não dá para guardar o que a
                prévia recusa — a fórmula guardada tem de renderizar depois. */}
            <button
              type="button"
              onClick={() => setNomeNovo('')}
              disabled={!latex.trim() || !!erro}
              title="Guardar esta fórmula com um nome, para reusar depois"
              className="text-[12px] px-3 py-1.5 rounded border border-[var(--line)] text-[var(--ink-dim)] hover:bg-[var(--sel)] disabled:opacity-45"
            >
              Salvar
            </button>
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
      ) : null}
    </div>
  )
}

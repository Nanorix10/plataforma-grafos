'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MATERIAS } from '@/lib/materias'
// de `lib/tempo` e não de `lib/eventos`: este é um componente de cliente, e
// `eventos.ts` importa `getSessao`, que depende de `next/headers`
import { anoFinal, formatarAno, rotuloDoEvento, type Evento } from '@/lib/tempo'

/**
 * Eras da divisão escolar brasileira. Não são filtro — são atalhos de zoom.
 *
 * O eixo é LINEAR de propósito: um ano vale sempre o mesmo tanto de pixel, e é
 * isso que ensina que a Idade Média são mil anos enquanto a Revolução Francesa
 * é uma década. O preço é que, vendo tudo de uma vez, a Antiguidade fica vazia
 * e o século XX vira um bolo — e é exatamente esse preço que estes botões
 * pagam, levando o recorte até onde a leitura volta a ser possível.
 */
const ERAS = [
  { nome: 'Antiguidade', de: -3500, ate: 476 },
  { nome: 'Medieval', de: 476, ate: 1453 },
  { nome: 'Moderna', de: 1453, ate: 1789 },
  { nome: 'Contemporânea', de: 1789, ate: new Date().getFullYear() },
] as const

/** Menor janela em anos. Sem piso, o zoom continua até o eixo perder sentido. */
const JANELA_MINIMA = 5
/* Teto do afastamento. Não é estética: `marcas` percorre a janela de passo em
   passo, e sem limite um afastamento insistente monta uma lista de milhares de
   marcas invisíveis a cada quadro. */
const JANELA_MAXIMA = 20000
const ALTURA_FAIXA = 30
const ALTURA_EIXO = 34
const FOLGA = 12

type Janela = { de: number; ate: number }

/** Largura aproximada do rótulo, em px, para o empacotamento não sobrepor. */
function larguraRotulo(titulo: string) {
  return titulo.length * 6.4 + 26
}

/**
 * Passo "redondo" para as marcas do eixo.
 *
 * A lista é fechada porque marca de tempo boa é a que o aluno já usa para
 * pensar — 25, 50, 100, 500 anos. Um passo calculado por fórmula acertaria a
 * densidade e erraria isso, produzindo marcas de 37 em 37 anos.
 */
function passoDoEixo(span: number, largura: number) {
  const alvo = Math.max(1, Math.round(largura / 90))
  const bruto = span / alvo
  const opcoes = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
  return opcoes.find((o) => o >= bruto) ?? 10000
}

export default function LinhaDoTempo({ eventos }: { eventos: Evento[] }) {
  const caixaRef = useRef<HTMLDivElement>(null)
  const [largura, setLargura] = useState(0)
  const [selecionado, setSelecionado] = useState<Evento | null>(null)

  /* As matérias começam TODAS ligadas, e o chip só existe para as que têm
     evento. Uma lista fixa das cinco humanidades criaria chip morto agora (o
     banco ainda não tem esse conteúdo) e esconderia um evento de Física no dia
     em que a história da ciência entrar. Quem manda são os dados. */
  const materiasComEvento = useMemo(() => {
    const vistas = new Set(eventos.map((e) => e.materia_slug))
    return Object.keys(MATERIAS).filter((m) => vistas.has(m))
  }, [eventos])

  const [desligadas, setDesligadas] = useState<Set<string>>(new Set())

  /* O filtro NÃO vive na URL, ao contrário do `visao` do mapa. Lá a URL troca
     a tela inteira e vale ser favoritada; aqui cada clique num chip dispararia
     uma volta ao servidor, que recarregaria todos os eventos para mudar o que
     é uma decisão puramente visual. */
  const visiveis = useMemo(
    () => eventos.filter((e) => !desligadas.has(e.materia_slug)),
    [eventos, desligadas]
  )

  /** Janela que cobre tudo o que está ligado, com uma folga de respiro. */
  const janelaCheia = useCallback((lista: Evento[]): Janela => {
    if (lista.length === 0) return { de: 1000, ate: new Date().getFullYear() }
    const min = Math.min(...lista.map((e) => e.ano_inicio))
    const max = Math.max(...lista.map(anoFinal))
    const span = Math.max(JANELA_MINIMA, max - min)
    const folga = span * 0.06
    return { de: Math.floor(min - folga), ate: Math.ceil(max + folga) }
  }, [])

  const [janela, setJanela] = useState<Janela>(() => janelaCheia(eventos))

  // mede a caixa; sem largura real não dá para posicionar nada
  useEffect(() => {
    const el = caixaRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setLargura(e.contentRect.width))
    ro.observe(el)
    setLargura(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  const span = janela.ate - janela.de
  const escala = useCallback(
    (ano: number) => ((ano - janela.de) / span) * largura,
    [janela.de, span, largura]
  )

  /** Aplica zoom mantendo fixo o ano que está sob o ponteiro. */
  const aplicarZoom = useCallback(
    (fator: number, ancoraPx: number) => {
      setJanela((j) => {
        const s = j.ate - j.de
        const novo = Math.min(JANELA_MAXIMA, Math.max(JANELA_MINIMA, s * fator))
        if (novo === s) return j
        const frac = largura > 0 ? ancoraPx / largura : 0.5
        const anoAncora = j.de + frac * s
        return { de: anoAncora - frac * novo, ate: anoAncora + (1 - frac) * novo }
      })
    },
    [largura]
  )

  /* Roda do mouse dá zoom, e por isso precisa de `preventDefault` — senão a
     página inteira rola junto. O React registra `onWheel` como listener
     passivo, onde `preventDefault` é ignorado (com aviso no console), então
     este tem de ser nativo e explicitamente não-passivo. */
  useEffect(() => {
    const el = caixaRef.current
    if (!el) return
    function aoRolar(e: WheelEvent) {
      e.preventDefault()
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
      aplicarZoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX - r.left)
    }
    el.addEventListener('wheel', aoRolar, { passive: false })
    return () => el.removeEventListener('wheel', aoRolar)
  }, [aplicarZoom])

  /* Arrastar desloca no tempo. Com Pointer Events e captura, e não mousemove
     no window: o mesmo código serve para dedo e mouse, e soltar fora da caixa
     não deixa o arrasto preso. */
  const arrasto = useRef<{ x: number; de: number; ate: number } | null>(null)
  /* Arrastar termina num `click` sobre o evento que estava embaixo do dedo, e
     sem esta marca o aluno abriria o detalhe de um evento que só queria
     empurrar para o lado. */
  const arrastou = useRef(false)

  function aoPressionar(e: React.PointerEvent) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    arrasto.current = { x: e.clientX, de: janela.de, ate: janela.ate }
    arrastou.current = false
  }

  function aoMover(e: React.PointerEvent) {
    const a = arrasto.current
    if (!a || largura === 0) return
    if (Math.abs(e.clientX - a.x) > 4) arrastou.current = true
    const anosPorPx = (a.ate - a.de) / largura
    const d = (e.clientX - a.x) * anosPorPx
    setJanela({ de: a.de - d, ate: a.ate - d })
  }

  function aoSoltar(e: React.PointerEvent) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    arrasto.current = null
  }

  /**
   * Empacota os eventos em faixas, do jeito guloso: cada um desce para a
   * primeira faixa onde não encosta em quem já está lá.
   *
   * Refeito a cada zoom porque a conta é em PIXEL, não em ano — o rótulo tem
   * largura fixa na tela, então dois eventos que se sobrepõem afastados podem
   * caber lado a lado de perto.
   */
  const { colocados, faixas } = useMemo(() => {
    if (largura === 0) return { colocados: [], faixas: 0 }
    const fimDaFaixa: number[] = []
    const saida: { e: Evento; x1: number; x2: number; faixa: number }[] = []

    for (const e of visiveis) {
      const x1 = escala(e.ano_inicio)
      const xFim = e.ano_fim === null ? x1 : escala(e.ano_fim)
      const extensao = Math.max(xFim, x1 + larguraRotulo(e.titulo))

      // fora da tela não é desenhado nem ocupa faixa: com zoom fundo, isso é a
      // diferença entre desenhar 20 eventos e desenhar todos os do banco
      if (extensao < -FOLGA || x1 > largura + FOLGA) continue

      let faixa = fimDaFaixa.findIndex((fim) => x1 > fim + FOLGA)
      if (faixa === -1) faixa = fimDaFaixa.length
      fimDaFaixa[faixa] = extensao
      saida.push({ e, x1, x2: xFim, faixa })
    }
    return { colocados: saida, faixas: Math.max(1, fimDaFaixa.length) }
  }, [visiveis, escala, largura])

  /** Marcas do eixo, em anos redondos dentro da janela visível. */
  const marcas = useMemo(() => {
    if (largura === 0) return []
    const passo = passoDoEixo(span, largura)
    const primeira = Math.ceil(janela.de / passo) * passo
    const saida: number[] = []
    for (let a = primeira; a <= janela.ate; a += passo) saida.push(a)
    return saida
  }, [janela.de, janela.ate, span, largura])

  function alternarMateria(slug: string) {
    setDesligadas((atual) => {
      const novo = new Set(atual)
      if (novo.has(slug)) novo.delete(slug)
      else novo.add(slug)
      return novo
    })
  }

  const alturaConteudo = faixas * ALTURA_FAIXA + 16

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ---- controles ---- */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-[var(--line)]">
        {materiasComEvento.map((slug) => {
          const m = MATERIAS[slug as keyof typeof MATERIAS]
          const ligada = !desligadas.has(slug)
          return (
            <button
              key={slug}
              type="button"
              onClick={() => alternarMateria(slug)}
              aria-pressed={ligada}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
              style={{
                borderColor: ligada ? m.cor : 'var(--line-forte)',
                color: ligada ? m.cor : 'var(--ink-faint)',
              }}
            >
              {/* o ponto some quando o chip está desligado: sem ele, cor de
                  borda apagada e cor de ponto viva se contradiziam */}
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: ligada ? m.cor : 'transparent', boxShadow: ligada ? undefined : 'inset 0 0 0 1px var(--ink-faint)' }}
              />
              {m.nome}
            </button>
          )
        })}

        <div className="ml-auto flex items-center gap-1">
          {ERAS.map((era) => (
            <button
              key={era.nome}
              type="button"
              onClick={() => setJanela({ de: era.de, ate: era.ate })}
              className="rounded-md px-2 py-1 text-[11.5px] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
            >
              {era.nome}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setJanela(janelaCheia(visiveis))}
            className="rounded-md px-2 py-1 text-[11.5px] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            Tudo
          </button>
          {/* Zoom por botão além da roda: é o único caminho no celular, e o
              único que funciona por teclado. */}
          <button
            type="button"
            onClick={() => aplicarZoom(1 / 1.4, largura / 2)}
            aria-label="Aproximar"
            className="w-7 h-7 rounded-md text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => aplicarZoom(1.4, largura / 2)}
            aria-label="Afastar"
            className="w-7 h-7 rounded-md text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            −
          </button>
        </div>
      </div>

      {/* ---- o eixo ---- */}
      <div
        ref={caixaRef}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        // fase de captura: roda ANTES do onClick do evento, que é o único
        // jeito de engolir o clique que fecha um arrasto
        onClickCapture={(e) => {
          if (arrastou.current) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
        /* `pan-y` e não `none`: o dedo continua rolando a lista de faixas na
           vertical (que é navegação normal da página), e só o movimento
           horizontal chega aos nossos handlers, como deslocamento no tempo. */
        style={{ touchAction: 'pan-y' }}
        className="quadro relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden select-none cursor-grab active:cursor-grabbing"
      >
        {/* régua fixa no topo da área que rola */}
        <div
          className="sticky top-0 z-10 bg-[var(--canvas)]/90 backdrop-blur border-b border-[var(--line)]"
          style={{ height: ALTURA_EIXO }}
        >
          {marcas.map((ano) => (
            <div
              key={ano}
              className="absolute top-0 h-full flex items-end pb-1"
              style={{ left: escala(ano), transform: 'translateX(-50%)' }}
            >
              <span className="text-[10.5px] text-[var(--ink-faint)] tabular-nums whitespace-nowrap">
                {formatarAno(ano)}
              </span>
            </div>
          ))}
        </div>

        <div className="relative" style={{ height: alturaConteudo }}>
          {/* linhas verticais das marcas, atrás dos eventos */}
          {marcas.map((ano) => (
            <div
              key={ano}
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-px bg-[var(--line)]"
              style={{ left: escala(ano) }}
            />
          ))}

          {colocados.map(({ e, x1, x2, faixa }) => {
            const cor = MATERIAS[e.materia_slug as keyof typeof MATERIAS]?.cor ?? 'var(--ink)'
            const periodo = e.ano_fim !== null
            const largoBarra = Math.max(3, x2 - x1)
            const aberto = selecionado?.id === e.id

            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setSelecionado(aberto ? null : e)}
                aria-pressed={aberto}
                title={`${e.titulo} — ${rotuloDoEvento(e)}`}
                className="absolute flex items-center gap-1.5 rounded pr-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
                style={{
                  left: x1,
                  top: faixa * ALTURA_FAIXA + 8,
                  height: ALTURA_FAIXA - 8,
                  background: aberto ? 'var(--acento-fraco)' : undefined,
                }}
              >
                {periodo ? (
                  // período é barra: a largura NO EIXO é a informação, então
                  // ela não pode ser um enfeite de tamanho fixo
                  <span
                    aria-hidden="true"
                    className="h-[6px] rounded-full shrink-0"
                    style={{ width: largoBarra, background: cor }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="w-[7px] h-[7px] rounded-full shrink-0"
                    style={{ background: cor }}
                  />
                )}
                <span
                  className="text-[11.5px] whitespace-nowrap"
                  style={{ color: cor }}
                >
                  {e.titulo}
                </span>
              </button>
            )
          })}

          {visiveis.length === 0 ? (
            <p className="absolute inset-x-0 top-8 text-center text-[13px] text-[var(--ink-faint)]">
              {eventos.length === 0
                ? 'Nenhum evento cadastrado ainda.'
                : 'Nenhuma matéria ligada.'}
            </p>
          ) : null}
        </div>
      </div>

      {/* ---- detalhe do evento escolhido ----
          Painel fixo embaixo, e não balão flutuante ancorado no ponto: o balão
          precisaria se virar contra as bordas e contra a área que rola, e no
          celular acabaria cobrindo justamente o trecho do eixo que o aluno
          está olhando. */}
      {selecionado ? (
        <div className="border-t border-[var(--line)] bg-[var(--panel)] px-4 sm:px-6 py-3 flex items-start gap-3">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
            style={{
              background:
                MATERIAS[selecionado.materia_slug as keyof typeof MATERIAS]?.cor ?? 'var(--ink)',
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <span
                className="font-medium text-[14px]"
                style={{
                  color:
                    MATERIAS[selecionado.materia_slug as keyof typeof MATERIAS]?.cor ??
                    'var(--ink)',
                }}
              >
                {selecionado.titulo}
              </span>
              <span className="text-[12px] text-[var(--ink-dim)] tabular-nums">
                {rotuloDoEvento(selecionado)}
              </span>
            </div>
            {selecionado.descricao ? (
              <p className="text-[12.5px] leading-snug text-[var(--ink-dim)] mt-1 text-pretty">
                {selecionado.descricao}
              </p>
            ) : null}
            {selecionado.resumo_slug ? (
              <Link
                href={`/resumos/${selecionado.resumo_slug}`}
                className="inline-block text-[12.5px] text-[var(--acento)] hover:underline mt-1.5"
              >
                Abrir o resumo →
              </Link>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setSelecionado(null)}
            aria-label="Fechar detalhe"
            className="shrink-0 w-7 h-7 rounded-md text-[var(--ink-faint)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            ✕
          </button>
        </div>
      ) : null}
    </div>
  )
}

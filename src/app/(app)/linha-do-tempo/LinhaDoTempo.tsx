'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MATERIAS } from '@/lib/materias'
// de `lib/tempo` e não de `lib/eventos`: este é um componente de cliente, e
// `eventos.ts` importa `getSessao`, que depende de `next/headers`
import {
  anoFinal,
  coresDoEvento,
  corDoRotulo,
  formatarAno,
  fundoDoMarcador,
  rotuloDoEvento,
  type Evento,
} from '@/lib/tempo'

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

const ALTURA_FAIXA = 26
/* Folga entre o eixo e a primeira faixa de cada lado. Embaixo é maior porque é
   ali que moram os anos escritos — sem a diferença, o primeiro evento de baixo
   sentaria em cima do "1453". */
const FOLGA_CIMA = 14
const FOLGA_BAIXO = 26
const PADDING_V = 22
const FOLGA = 12

type Janela = { de: number; ate: number }
type Lado = 'cima' | 'baixo'

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
    const vistas = new Set(eventos.flatMap((e) => e.materia_slugs))
    return Object.keys(MATERIAS).filter((m) => vistas.has(m))
  }, [eventos])

  const [desligadas, setDesligadas] = useState<Set<string>>(new Set())

  /* O filtro NÃO vive na URL, ao contrário do `visao` do mapa. Lá a URL troca
     a tela inteira e vale ser favoritada; aqui cada clique num chip dispararia
     uma volta ao servidor, que recarregaria todos os eventos para mudar o que
     é uma decisão puramente visual.

     `some` e não `every`: o Renascimento continua na tela enquanto QUALQUER
     uma das suas matérias estiver ligada. Exigir todas o faria sumir ao
     desligar Filosofia, que não é o que "filtrar por Arte" quer dizer. */
  const visiveis = useMemo(
    () => eventos.filter((e) => e.materia_slugs.some((m) => !desligadas.has(m))),
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
   * Distribui os eventos dos DOIS lados do eixo central.
   *
   * O lado alterna a cada evento, em ordem cronológica: é o que faz o desenho
   * abrir em leque a partir da linha, em vez de empilhar tudo para baixo. Se o
   * lado da vez estiver ocupado naquele trecho, o evento desce uma faixa
   * daquele mesmo lado — trocar de lado quebraria a alternância e, com ela, a
   * leitura de "um acima, um abaixo" que orienta o olho.
   *
   * Refeito a cada zoom porque a conta é em PIXEL, não em ano: o rótulo tem
   * largura fixa na tela, então dois eventos que se sobrepõem afastados podem
   * caber lado a lado de perto.
   */
  const { colocados, faixasCima, faixasBaixo } = useMemo(() => {
    if (largura === 0) return { colocados: [], faixasCima: 1, faixasBaixo: 1 }

    const fim: Record<Lado, number[]> = { cima: [], baixo: [] }
    const saida: {
      e: Evento
      x1: number
      x2: number
      xRotulo: number
      lado: Lado
      faixa: number
    }[] = []
    let lado: Lado = 'cima'

    for (const e of visiveis) {
      const x1 = escala(e.ano_inicio)
      const periodo = e.ano_fim !== null
      const x2 = periodo ? escala(e.ano_fim as number) : x1

      /* Período que atravessa a tela inteira teria o rótulo ancorado fora dela,
         à esquerda — o aluno estaria DENTRO da Idade Média sem ler o nome dela.
         Aqui o rótulo encosta na borda e continua visível enquanto a barra
         estiver passando. O conector acompanha, e segue caindo sobre a barra. */
      const xRotulo =
        periodo && x1 < 4 && x2 > 4 ? Math.min(4, x2 - larguraRotulo(e.titulo)) : x1

      const extensao = Math.max(x2, xRotulo + larguraRotulo(e.titulo))
      // fora da tela não é desenhado nem ocupa faixa: com zoom fundo, isso é a
      // diferença entre desenhar 20 eventos e desenhar todos os do banco
      if (extensao < -FOLGA || Math.min(x1, xRotulo) > largura + FOLGA) continue

      const inicio = Math.min(x1, xRotulo)
      let faixa = fim[lado].findIndex((f) => inicio > f + FOLGA)
      if (faixa === -1) faixa = fim[lado].length
      fim[lado][faixa] = extensao

      saida.push({ e, x1, x2, xRotulo, lado, faixa })
      lado = lado === 'cima' ? 'baixo' : 'cima'
    }

    return {
      colocados: saida,
      faixasCima: Math.max(1, fim.cima.length),
      faixasBaixo: Math.max(1, fim.baixo.length),
    }
  }, [visiveis, escala, largura])

  /** Onde o eixo central mora, em px do topo da área desenhável. */
  const centro = PADDING_V + faixasCima * ALTURA_FAIXA + FOLGA_CIMA
  const alturaConteudo = centro + FOLGA_BAIXO + faixasBaixo * ALTURA_FAIXA + PADDING_V

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

  const coresSelecionado = selecionado ? coresDoEvento(selecionado.materia_slugs) : []

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
                style={{
                  background: ligada ? m.cor : 'transparent',
                  boxShadow: ligada ? undefined : 'inset 0 0 0 1px var(--ink-faint)',
                }}
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
        <div className="relative" style={{ height: alturaConteudo }}>
          {/* linhas verticais dos anos, atrás de tudo */}
          {marcas.map((ano) => (
            <div
              key={ano}
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-px bg-[var(--line)]"
              style={{ left: escala(ano) }}
            />
          ))}

          {/* ---- o eixo central ----
              É dele que os eventos se abrem, para cima e para baixo. Os anos
              ficam logo abaixo da linha, e é por isso que a folga de baixo é
              maior que a de cima. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 h-[2px] bg-[var(--line-forte)]"
            style={{ top: centro }}
          />
          {marcas.map((ano) => (
            <div
              key={`marca-${ano}`}
              aria-hidden="true"
              className="absolute flex flex-col items-center"
              style={{ left: escala(ano), top: centro, transform: 'translateX(-50%)' }}
            >
              <span className="w-px h-[5px] bg-[var(--line-forte)]" />
              <span className="text-[10.5px] text-[var(--ink-faint)] tabular-nums whitespace-nowrap mt-0.5">
                {formatarAno(ano)}
              </span>
            </div>
          ))}

          {colocados.map(({ e, x1, x2, xRotulo, lado, faixa }) => {
            const cores = coresDoEvento(e.materia_slugs)
            const periodo = e.ano_fim !== null
            const aberto = selecionado?.id === e.id
            const alturaCaixa = ALTURA_FAIXA - 6

            const topoCaixa =
              lado === 'cima'
                ? centro - FOLGA_CIMA - (faixa + 1) * ALTURA_FAIXA
                : centro + FOLGA_BAIXO + faixa * ALTURA_FAIXA

            // o conector sai da borda da caixa que olha para o eixo
            const bordaProxima = lado === 'cima' ? topoCaixa + alturaCaixa : topoCaixa
            const topoConector = lado === 'cima' ? bordaProxima : centro
            const alturaConector = Math.max(0, Math.abs(centro - bordaProxima))

            return (
              <div key={e.id}>
                {/* haste ligando o evento à sua data no eixo */}
                <div
                  aria-hidden="true"
                  className="absolute w-px"
                  style={{
                    left: xRotulo,
                    top: topoConector,
                    height: alturaConector,
                    background: aberto ? 'var(--acento)' : 'var(--line-forte)',
                  }}
                />

                {/* marcador na própria linha: ponto para data única, barra
                    para período — e a largura da barra É a duração */}
                {periodo ? (
                  <div
                    aria-hidden="true"
                    className="absolute h-[7px] rounded-full"
                    style={{
                      left: x1,
                      width: Math.max(3, x2 - x1),
                      top: centro - 2.5,
                      background: fundoDoMarcador(cores),
                    }}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute w-[9px] h-[9px] rounded-full overflow-hidden"
                    style={{
                      left: x1 - 4.5,
                      top: centro - 3.5,
                      background: fundoDoMarcador(cores),
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={() => setSelecionado(aberto ? null : e)}
                  aria-pressed={aberto}
                  title={`${e.titulo} — ${rotuloDoEvento(e)}`}
                  className="absolute flex items-center rounded px-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
                  style={{
                    left: xRotulo,
                    top: topoCaixa,
                    height: alturaCaixa,
                    background: aberto ? 'var(--acento-fraco)' : undefined,
                  }}
                >
                  <span
                    className="text-[11.5px] whitespace-nowrap"
                    style={{ color: corDoRotulo(cores) }}
                  >
                    {e.titulo}
                  </span>
                </button>
              </div>
            )
          })}

          {visiveis.length === 0 ? (
            <p
              className="absolute inset-x-0 text-center text-[13px] text-[var(--ink-faint)]"
              style={{ top: centro + FOLGA_BAIXO + 18 }}
            >
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
            className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
            style={{ background: fundoDoMarcador(coresSelecionado) }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <span
                className="font-medium text-[14px]"
                style={{ color: corDoRotulo(coresSelecionado) }}
              >
                {selecionado.titulo}
              </span>
              <span className="text-[12px] text-[var(--ink-dim)] tabular-nums">
                {rotuloDoEvento(selecionado)}
              </span>
            </div>

            {/* As matérias por extenso. É aqui que o evento de várias delas
                deixa de depender das listras do marcador, que dizem "são
                três" mas não dizem quais. */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {selecionado.materia_slugs.map((slug) => {
                const m = MATERIAS[slug as keyof typeof MATERIAS]
                if (!m) return null
                return (
                  <span
                    key={slug}
                    className="text-[11px] rounded-full border px-1.5 py-0.5"
                    style={{ borderColor: m.cor, color: m.cor }}
                  >
                    {m.nome}
                  </span>
                )
              })}
            </div>

            {selecionado.descricao ? (
              <p className="text-[12.5px] leading-snug text-[var(--ink-dim)] mt-1.5 text-pretty">
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

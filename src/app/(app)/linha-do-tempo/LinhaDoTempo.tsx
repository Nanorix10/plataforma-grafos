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

/* O cartão do evento tem duas linhas — título e data —, então a faixa é bem
   mais alta do que era quando o rótulo era só um texto solto. */
const ALTURA_CARTAO = 38
const ALTURA_FAIXA = 46
/* Folga entre o eixo e o primeiro cartão de cada lado. Embaixo é maior porque
   é ali que moram os anos escritos — sem a diferença, o primeiro cartão de
   baixo sentaria em cima do "1453". */
const FOLGA_CIMA = 18
const FOLGA_BAIXO = 30
const PADDING_V = 16
const FOLGA = 10
const DURACAO_ANIMACAO = 420

type Janela = { de: number; ate: number }
type Lado = 'cima' | 'baixo'

/** Largura aproximada do cartão, em px, para o empacotamento não sobrepor. */
function larguraCartao(titulo: string, data: string) {
  return Math.max(titulo.length * 7.1, data.length * 6.2) + 26
}

/**
 * Passo "redondo" para as marcas do eixo.
 *
 * A lista é fechada porque marca de tempo boa é a que o aluno já usa para
 * pensar — 25, 50, 100, 500 anos. Um passo calculado por fórmula acertaria a
 * densidade e erraria isso, produzindo marcas de 37 em 37 anos.
 */
function passoDoEixo(span: number, largura: number) {
  const alvo = Math.max(1, Math.round(largura / 100))
  const bruto = span / alvo
  const opcoes = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
  return opcoes.find((o) => o >= bruto) ?? 10000
}

export default function LinhaDoTempo({ eventos }: { eventos: Evento[] }) {
  const caixaRef = useRef<HTMLDivElement>(null)
  const [largura, setLargura] = useState(0)
  const [altura, setAltura] = useState(0)
  const [selecionado, setSelecionado] = useState<Evento | null>(null)
  const [sobre, setSobre] = useState<string | null>(null)
  /** x do ponteiro dentro da caixa, para o fio-guia que lê o ano ao vivo. */
  const [guia, setGuia] = useState<number | null>(null)

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

  // mede a caixa; a ALTURA importa tanto quanto a largura, porque é ela que
  // decide onde fica o meio da página
  useEffect(() => {
    const el = caixaRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setLargura(e.contentRect.width)
      setAltura(e.contentRect.height)
    })
    ro.observe(el)
    const r = el.getBoundingClientRect()
    setLargura(r.width)
    setAltura(r.height)
    return () => ro.disconnect()
  }, [])

  const span = janela.ate - janela.de
  const escala = useCallback(
    (ano: number) => ((ano - janela.de) / span) * largura,
    [janela.de, span, largura]
  )
  const anoEm = useCallback(
    (px: number) => janela.de + (px / Math.max(1, largura)) * span,
    [janela.de, span, largura]
  )

  /* ---- movimento animado ----
     Os botões de era saltam de um século para outro; sem transição, o eixo
     "pisca" para outro lugar e o aluno perde a noção de para onde foi. A
     animação existe para preservar essa continuidade, e por isso é desligada
     por completo em `prefers-reduced-motion`, onde ela vira só desconforto. */
  const animRef = useRef<number | null>(null)
  const pararAnimacao = useCallback(() => {
    if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    animRef.current = null
  }, [])
  useEffect(() => pararAnimacao, [pararAnimacao])

  const irPara = useCallback(
    (destino: Janela) => {
      pararAnimacao()
      const menos = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (menos) return setJanela(destino)

      const inicio = janela
      const t0 = performance.now()
      const passo = (t: number) => {
        const p = Math.min(1, (t - t0) / DURACAO_ANIMACAO)
        const e = 1 - Math.pow(1 - p, 3) // easeOutCubic
        setJanela({
          de: inicio.de + (destino.de - inicio.de) * e,
          ate: inicio.ate + (destino.ate - inicio.ate) * e,
        })
        animRef.current = p < 1 ? requestAnimationFrame(passo) : null
      }
      animRef.current = requestAnimationFrame(passo)
    },
    [janela, pararAnimacao]
  )

  /** Aplica zoom mantendo fixo o ano que está sob o ponteiro. */
  const aplicarZoom = useCallback(
    (fator: number, ancoraPx: number) => {
      pararAnimacao()
      setJanela((j) => {
        const s = j.ate - j.de
        const novo = Math.min(JANELA_MAXIMA, Math.max(JANELA_MINIMA, s * fator))
        if (novo === s) return j
        const frac = largura > 0 ? ancoraPx / largura : 0.5
        const anoAncora = j.de + frac * s
        return { de: anoAncora - frac * novo, ate: anoAncora + (1 - frac) * novo }
      })
    },
    [largura, pararAnimacao]
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
    pararAnimacao()
    e.currentTarget.setPointerCapture(e.pointerId)
    arrasto.current = { x: e.clientX, de: janela.de, ate: janela.ate }
    arrastou.current = false
  }

  function aoMover(e: React.PointerEvent) {
    const r = e.currentTarget.getBoundingClientRect()
    setGuia(e.clientX - r.left)

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

  /* Teclado: a linha do tempo é uma região focável, e sem isto ela seria a
     única parte do site que só funciona com mouse. */
  function aoTeclar(e: React.KeyboardEvent) {
    const passo = span * 0.18
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      pararAnimacao()
      setJanela((j) => ({ de: j.de - passo, ate: j.ate - passo }))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      pararAnimacao()
      setJanela((j) => ({ de: j.de + passo, ate: j.ate + passo }))
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      aplicarZoom(1 / 1.4, largura / 2)
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault()
      aplicarZoom(1.4, largura / 2)
    } else if (e.key === 'Home') {
      e.preventDefault()
      irPara(janelaCheia(visiveis))
    } else if (e.key === 'Escape') {
      setSelecionado(null)
    }
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
   * Refeito a cada zoom porque a conta é em PIXEL, não em ano: o cartão tem
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
      xCartao: number
      lado: Lado
      faixa: number
    }[] = []
    /* O lado sai do ÍNDICE em `visiveis`, e não de um contador que avança
       dentro do laço. A diferença aparece ao navegar: o descarte do que está
       fora da tela (o `continue` logo abaixo) acontece ANTES de o cartão ser
       empilhado, então um contador só alternaria entre os DESENHADOS — e o lado
       de cada evento passaria a depender de quais vizinhos calharam de estar na
       moldura. Arrastar o eixo fazia os cartões pularem de cima para baixo.

       `visiveis` é a lista cronológica já filtrada e não muda com o zoom nem
       com o arrasto, então o lado fica estável. Ele muda só quando o filtro de
       matéria muda, que é quando deve mudar mesmo. E a alternância continua
       valendo entre vizinhos na tela: quem está visível é um trecho contíguo
       da lista, então os índices seguem alternando a paridade. */
    const ladoDoIndice = (i: number): Lado => (i % 2 === 0 ? 'cima' : 'baixo')

    for (const [i, e] of visiveis.entries()) {
      const lado = ladoDoIndice(i)
      const x1 = escala(e.ano_inicio)
      const periodo = e.ano_fim !== null
      const x2 = periodo ? escala(e.ano_fim as number) : x1
      const larg = larguraCartao(e.titulo, rotuloDoEvento(e))

      /* Período que atravessa a tela inteira teria o cartão ancorado fora dela,
         à esquerda — o aluno estaria DENTRO da Idade Média sem ler o nome dela.
         Aqui o cartão encosta na borda e continua visível enquanto a barra
         estiver passando. A haste acompanha, e segue caindo sobre a barra. */
      const xCartao = periodo && x1 < 6 && x2 > 6 ? Math.min(6, x2 - larg) : x1

      const extensao = Math.max(x2, xCartao + larg)
      // fora da tela não é desenhado nem ocupa faixa: com zoom fundo, isso é a
      // diferença entre desenhar 20 eventos e desenhar todos os do banco
      if (extensao < -FOLGA || Math.min(x1, xCartao) > largura + FOLGA) continue

      const inicio = Math.min(x1, xCartao)
      let faixa = fim[lado].findIndex((f) => inicio > f + FOLGA)
      if (faixa === -1) faixa = fim[lado].length
      fim[lado][faixa] = extensao

      saida.push({ e, x1, x2, xCartao, lado, faixa })
    }

    return {
      colocados: saida,
      faixasCima: Math.max(1, fim.cima.length),
      faixasBaixo: Math.max(1, fim.baixo.length),
    }
  }, [visiveis, escala, largura])

  /* ---- o eixo fica no MEIO ----
     A altura desenhada é o DOBRO do lado mais cheio, e não a soma dos dois.
     Assim o meio do conteúdo é sempre o eixo, mesmo com quatro faixas em cima
     e uma embaixo — somando, a linha escorregaria para longe do centro a cada
     zoom. E como a altura nunca é menor que a da caixa, quando tudo cabe o
     eixo cai exatamente no meio da tela. */
  const precisaCima = FOLGA_CIMA + faixasCima * ALTURA_FAIXA + PADDING_V
  const precisaBaixo = FOLGA_BAIXO + faixasBaixo * ALTURA_FAIXA + PADDING_V
  const alturaConteudo = Math.max(altura, 2 * Math.max(precisaCima, precisaBaixo))
  const centro = alturaConteudo / 2

  /* ---- e o eixo tem que estar À VISTA, não só no meio do palco ----

     `alturaConteudo` é o dobro do lado mais cheio, então com muitos eventos
     empilhados o palco fica bem mais alto que a caixa — 3.036px contra 632px,
     medido com os 85 eventos que entraram em 25/08. A caixa rola, e rolagem
     começa no TOPO: o eixo, que mora em `centro`, nascia fora da tela, e quem
     abria a página caía num campo vazio acima de tudo.

     Enquanto o eixo coube na caixa isto não existia — com um evento só, o
     palco tinha a altura da caixa. É defeito que só aparece com acervo, e por
     isso ficou dois meses invisível.

     A regra copia o `mexeuNoZoom` do grafo: o ajuste automático vale ENQUANTO
     a pessoa não tiver rolado. A partir do primeiro gesto dela, a posição é
     dela — rolar para ver a quarta faixa de cima e ser puxado de volta ao
     centro seria pior que o defeito. */
  const mexeuNaRolagem = useRef(false)
  const rolagemNossa = useRef(false)

  useEffect(() => {
    const el = caixaRef.current
    if (!el || mexeuNaRolagem.current) return
    const alvo = centro - el.clientHeight / 2
    if (alvo <= 0 || Math.abs(el.scrollTop - alvo) < 1) return
    rolagemNossa.current = true
    el.scrollTop = alvo
  }, [centro])

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
              onClick={() => irPara({ de: era.de, ate: era.ate })}
              className="rounded-md px-2 py-1 text-[11.5px] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
            >
              {era.nome}
            </button>
          ))}
          <button
            type="button"
            onClick={() => irPara(janelaCheia(visiveis))}
            className="rounded-md px-2 py-1 text-[11.5px] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            Tudo
          </button>
          {/* Zoom por botão além da roda: é o único caminho no celular, e um
              dos dois que funcionam por teclado (o outro é a tecla +). */}
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
        tabIndex={0}
        role="group"
        aria-label="Linha do tempo. Setas andam no tempo, mais e menos aproximam, Home mostra tudo."
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onPointerLeave={() => setGuia(null)}
        /* A rolagem que o efeito acima faz também dispara este evento. A
           bandeira distingue as duas: sem ela, o próprio ajuste automático se
           cancelaria na primeira vez que rodasse. */
        onScroll={() => {
          if (rolagemNossa.current) {
            rolagemNossa.current = false
            return
          }
          mexeuNaRolagem.current = true
        }}
        onDoubleClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          aplicarZoom(1 / 2, e.clientX - r.left)
        }}
        onKeyDown={aoTeclar}
        // fase de captura: roda ANTES do onClick do evento, que é o único
        // jeito de engolir o clique que fecha um arrasto
        onClickCapture={(e) => {
          if (arrastou.current) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
        /* `pan-y` e não `none`: o dedo continua rolando na vertical quando o
           desenho é mais alto que a caixa, e só o movimento horizontal chega
           aos nossos handlers, como deslocamento no tempo. */
        /* `scrollbar-gutter: stable` evita um laço de layout real: quando o
           desenho passa da altura da caixa, aparece a barra de rolagem, que
           estreita a caixa; mais estreita, os cartões se reempacotam e podem
           caber em menos faixas; cabendo, a barra some e a caixa alarga de
           novo. Com a calha sempre reservada, a largura para de oscilar. */
        style={{ touchAction: 'pan-y', scrollbarGutter: 'stable' }}
        className="quadro relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden select-none cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--acento)]"
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

          {/* ---- fio-guia ----
              Segue o ponteiro e lê o ano ali. Numa escala linear que vai de
              -3500 a 2026, "onde exatamente eu estou?" é a pergunta constante,
              e as marcas redondas sozinhas obrigam a interpolar de cabeça. */}
          {guia !== null && largura > 0 ? (
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{ left: guia }}
            >
              <div className="absolute top-0 bottom-0 w-px bg-[var(--acento)] opacity-35" />
              <div
                className="absolute -translate-x-1/2 rounded px-1.5 py-0.5 text-[10.5px] tabular-nums whitespace-nowrap bg-[var(--acento)] text-[var(--page)]"
                style={{ top: centro - 30 }}
              >
                {formatarAno(Math.round(anoEm(guia)))}
              </div>
            </div>
          ) : null}

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
              <span className="w-px h-[6px] bg-[var(--line-forte)]" />
              <span className="text-[11px] text-[var(--ink-faint)] tabular-nums whitespace-nowrap mt-0.5">
                {formatarAno(ano)}
              </span>
            </div>
          ))}

          {colocados.map(({ e, x1, x2, xCartao, lado, faixa }) => {
            const cores = coresDoEvento(e.materia_slugs)
            const periodo = e.ano_fim !== null
            const aberto = selecionado?.id === e.id
            const realce = aberto || sobre === e.id

            const topoCartao =
              lado === 'cima'
                ? centro - FOLGA_CIMA - (faixa + 1) * ALTURA_FAIXA
                : centro + FOLGA_BAIXO + faixa * ALTURA_FAIXA

            // a haste sai da borda do cartão que olha para o eixo
            const bordaProxima = lado === 'cima' ? topoCartao + ALTURA_CARTAO : topoCartao
            const topoHaste = lado === 'cima' ? bordaProxima : centro
            const alturaHaste = Math.max(0, Math.abs(centro - bordaProxima))

            return (
              <div key={e.id}>
                {/* haste ligando o evento à sua data no eixo */}
                <div
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    left: xCartao,
                    top: topoHaste,
                    height: alturaHaste,
                    width: realce ? 2 : 1,
                    background: realce ? 'var(--acento)' : 'var(--line-forte)',
                  }}
                />

                {/* marcador na própria linha: ponto para data única, barra
                    para período — e a largura da barra É a duração */}
                {periodo ? (
                  <div
                    aria-hidden="true"
                    className="absolute rounded-full"
                    style={{
                      left: x1,
                      width: Math.max(4, x2 - x1),
                      height: realce ? 12 : 10,
                      top: centro - (realce ? 5 : 4),
                      background: fundoDoMarcador(cores),
                    }}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute rounded-full"
                    style={{
                      width: realce ? 16 : 13,
                      height: realce ? 16 : 13,
                      left: x1 - (realce ? 8 : 6.5),
                      top: centro - (realce ? 7 : 5.5),
                      background: fundoDoMarcador(cores),
                      boxShadow: realce ? '0 0 0 3px var(--acento-fraco)' : undefined,
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={() => setSelecionado(aberto ? null : e)}
                  onPointerEnter={() => setSobre(e.id)}
                  onPointerLeave={() => setSobre((s) => (s === e.id ? null : s))}
                  onFocus={() => setSobre(e.id)}
                  onBlur={() => setSobre((s) => (s === e.id ? null : s))}
                  aria-pressed={aberto}
                  className="absolute flex flex-col justify-center rounded-lg border px-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
                  style={{
                    left: xCartao,
                    top: topoCartao,
                    height: ALTURA_CARTAO,
                    background: realce ? 'var(--raised-hover)' : 'var(--raised)',
                    borderColor: realce ? 'var(--acento)' : 'var(--line-forte)',
                  }}
                >
                  <span
                    className="text-[13px] font-medium leading-tight whitespace-nowrap"
                    style={{ color: corDoRotulo(cores) }}
                  >
                    {e.titulo}
                  </span>
                  <span className="text-[10.5px] leading-tight text-[var(--ink-faint)] tabular-nums whitespace-nowrap">
                    {rotuloDoEvento(e)}
                  </span>
                </button>
              </div>
            )
          })}

          {visiveis.length === 0 ? (
            <p
              className="absolute inset-x-0 text-center text-[13px] text-[var(--ink-faint)]"
              style={{ top: centro + FOLGA_BAIXO + 22 }}
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

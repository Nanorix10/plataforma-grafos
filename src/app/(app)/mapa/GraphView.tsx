'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// imports granulares de propósito: `import * as d3 from 'd3'` arrastaria os 30
// submódulos (geo, chord, contour…) pra usar quatro
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom, zoomIdentity } from 'd3-zoom'
// import só pelo efeito colateral: é ele que adiciona .transition() ao Selection.
// Não custa nada no bundle — o d3-zoom já depende do d3-transition.
import 'd3-transition'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force'
import { useRouter } from 'next/navigation'
import Balao, { type PosicaoBalao } from './Balao'

type No = {
  id: string
  titulo: string
  materia: string
  cor: string
  liberado: boolean
  definicao: string
  /** id do resumo que contém este; null = assunto principal da matéria */
  pai: string | null
}
type Link = { origem: string; destino: string }
type Materia = { slug: string; nome: string; cor: string }

type NoSim = SimulationNodeDatum & {
  id: string
  titulo: string
  cor: string
  liberado: boolean
  definicao: string
  tipo: 'materia' | 'resumo'
  grau: number
  filhos: number
  expandido: boolean
}
type LinkSim = SimulationLinkDatum<NoSim> & { tipo: 'contem' | 'cita' }

/** Nó com poucas conexões fica pequeno; um tópico central fica grande. */
function raio(d: NoSim) {
  if (d.tipo === 'materia') return 13
  return 7 + Math.sqrt(d.grau + d.filhos) * 4.5
}

const idMateria = (slug: string) => `materia:${slug}`

export default function GraphView({
  nos,
  links,
  materias,
}: {
  nos: No[]
  links: Link[]
  materias: Materia[]
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [balao, setBalao] = useState<PosicaoBalao | null>(null)
  const router = useRouter()

  /**
   * Quem está aberto. As matérias começam abertas e os resumos fechados: assim
   * o mapa abre mostrando as matérias e os assuntos principais de cada uma, e
   * não os 200 tópicos de uma vez.
   */
  const [expandidos, setExpandidos] = useState<Set<string>>(
    () => new Set(materias.map((m) => idMateria(m.slug)))
  )

  /**
   * Posições da última passada, guardadas por id.
   *
   * É isto que faz o assunto "abrir no lugar": ao expandir, a simulação é
   * remontada, e sem memória de posição o mapa inteiro saltaria para um layout
   * novo a cada clique. Com ela, quem já estava na tela continua onde estava e
   * só os filhos novos se acomodam — saindo de dentro do pai.
   */
  const posicoes = useRef(new Map<string, { x: number; y: number }>())

  const alternar = useCallback((id: string) => {
    setExpandidos((atual) => {
      const novo = new Set(atual)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }, [])

  const porId = useMemo(() => new Map(nos.map((n) => [n.id, n])), [nos])

  const filhosDe = useMemo(() => {
    const m = new Map<string, No[]>()
    for (const n of nos) {
      const chave = n.pai ?? idMateria(n.materia)
      m.set(chave, [...(m.get(chave) ?? []), n])
    }
    return m
  }, [nos])

  /**
   * Um resumo aparece quando toda a cadeia acima dele está aberta. Subir a
   * cadeia (em vez de descer a partir das raízes) mantém a regra num lugar só e
   * imune à ordem em que os resumos chegam.
   */
  const visiveis = useMemo(() => {
    const ok = new Set<string>()
    for (const n of nos) {
      let atual: No | undefined = n
      let visivel = true
      // sobe até a raiz; qualquer ancestral fechado esconde este nó
      while (atual?.pai) {
        if (!expandidos.has(atual.pai)) {
          visivel = false
          break
        }
        atual = porId.get(atual.pai)
      }
      if (visivel && expandidos.has(idMateria(n.materia))) ok.add(n.id)
    }
    return ok
  }, [nos, porId, expandidos])

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ---------- dados ----------
    // grau = quantas ligações de citação o tópico tem, nos dois sentidos
    const grausPorId = new Map<string, number>()
    for (const l of links) {
      grausPorId.set(l.origem, (grausPorId.get(l.origem) ?? 0) + 1)
      grausPorId.set(l.destino, (grausPorId.get(l.destino) ?? 0) + 1)
    }

    // só entram matérias que têm resumo — uma matéria vazia seria um nó solto
    const materiasUsadas = materias.filter((m) => nos.some((n) => n.materia === m.slug))

    const simNodes: NoSim[] = [
      ...materiasUsadas.map((m) => ({
        id: idMateria(m.slug),
        titulo: m.nome,
        cor: m.cor,
        liberado: true,
        definicao: '',
        tipo: 'materia' as const,
        grau: 0,
        filhos: (filhosDe.get(idMateria(m.slug)) ?? []).length,
        expandido: expandidos.has(idMateria(m.slug)),
      })),
      ...nos
        .filter((n) => visiveis.has(n.id))
        .map((n) => ({
          id: n.id,
          titulo: n.titulo,
          cor: n.cor,
          liberado: n.liberado,
          definicao: n.definicao,
          tipo: 'resumo' as const,
          grau: grausPorId.get(n.id) ?? 0,
          filhos: (filhosDe.get(n.id) ?? []).length,
          expandido: expandidos.has(n.id),
        })),
    ]

    // reaproveita a posição de quem já estava na tela; quem é novo nasce em
    // cima do pai, pra parecer que saiu de dentro dele
    const idsAgora = new Set(simNodes.map((n) => n.id))
    for (const n of simNodes) {
      const anterior = posicoes.current.get(n.id)
      if (anterior) {
        n.x = anterior.x
        n.y = anterior.y
      } else {
        const paiId = porId.get(n.id)?.pai ?? idMateria(porId.get(n.id)?.materia ?? '')
        const doPai = posicoes.current.get(paiId)
        if (doPai) {
          // desloca um tico: nós exatamente sobrepostos não recebem direção da
          // física e ficariam empilhados
          n.x = doPai.x + (Math.random() - 0.5) * 30
          n.y = doPai.y + (Math.random() - 0.5) * 30
        }
      }
    }
    // esquece quem saiu, senão o mapa "lembra" posições velhas ao reexpandir
    for (const id of [...posicoes.current.keys()]) {
      if (!idsAgora.has(id)) posicoes.current.delete(id)
    }

    const simLinks: LinkSim[] = [
      // "contém": a espinha da árvore, escrita à mão pelo autor
      ...simNodes
        .filter((n) => n.tipo === 'resumo')
        .map((n) => {
          const original = porId.get(n.id)
          const paiId = original?.pai ?? idMateria(original?.materia ?? '')
          return idsAgora.has(paiId)
            ? { source: paiId, target: n.id, tipo: 'contem' as const }
            : null
        })
        .filter((l): l is { source: string; target: string; tipo: 'contem' } => l !== null),
      // "cita": os [[wikilinks]], só entre nós que estão na tela
      ...links
        .filter((l) => idsAgora.has(l.origem) && idsAgora.has(l.destino))
        .map((l) => ({ source: l.origem, target: l.destino, tipo: 'cita' as const })),
    ]

    // vizinhança, pra destacar ao passar o mouse
    const vizinhos = new Map<string, Set<string>>()
    for (const n of simNodes) vizinhos.set(n.id, new Set([n.id]))
    for (const l of simLinks) {
      vizinhos.get(l.source as string)?.add(l.target as string)
      vizinhos.get(l.target as string)?.add(l.source as string)
    }

    // ---------- estrutura ----------
    const svg = select(svgEl)
    svg.selectAll('*').remove()

    let width = svgEl.clientWidth || 800
    let height = svgEl.clientHeight || 600

    // tudo que dá zoom vive dentro deste <g>
    const palco = svg.append('g')
    const camadaLinks = palco.append('g')
    const camadaNos = palco.append('g')

    /* A linha de "contém" é sólida e mais forte; a de "cita" é tracejada.
       São dois eixos diferentes do acervo, e sem essa distinção a estrutura
       que o autor montou some no meio das referências cruzadas. */
    const linkSel = camadaLinks
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', (l) => (l.tipo === 'contem' ? 'var(--ink-faint)' : 'var(--line-forte)'))
      .attr('stroke-width', (l) => (l.tipo === 'contem' ? 1.8 : 1.3))
      .attr('stroke-dasharray', (l) => (l.tipo === 'contem' ? 'none' : '4,3'))
      .attr('stroke-linecap', 'round')

    const noSel = camadaNos
      .selectAll<SVGGElement, NoSim>('g')
      .data(simNodes)
      .join('g')
      .attr('cursor', (d) =>
        d.tipo === 'materia' ? 'pointer' : d.liberado ? 'pointer' : 'not-allowed'
      )

    noSel
      .append('circle')
      .attr('r', raio)
      .attr('fill', (d) => d.cor)
      .attr('fill-opacity', (d) =>
        d.tipo === 'materia' ? 0.22 : d.liberado ? 0.9 : 0.18
      )
      // o anel em volta do nó é o fundo do próprio mapa: ele "recorta" o nó
      // das arestas que passam por trás
      .attr('stroke', (d) => (d.tipo === 'materia' ? d.cor : d.liberado ? 'var(--canvas)' : 'var(--ink-faint)'))
      .attr('stroke-width', (d) => (d.tipo === 'materia' ? 2 : d.liberado ? 2 : 1))
      .attr('stroke-dasharray', (d) => (d.tipo === 'resumo' && !d.liberado ? '3,2' : 'none'))

    /* Selo de "tem coisa dentro". Fica num alvo próprio, e não no nó, porque
       clicar no nó já significa abrir o resumo — misturar as duas ações no
       mesmo lugar tiraria do autor o controle de qual delas ele quis. */
    const comFilhos = noSel.filter((d) => d.filhos > 0)

    const selo = comFilhos
      .append('g')
      .attr('class', 'selo')
      .attr('transform', (d) => `translate(${raio(d) + 9},${-raio(d) - 4})`)
      .attr('cursor', 'pointer')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) =>
        d.expandido ? `Recolher ${d.titulo}` : `Expandir ${d.titulo} (${d.filhos})`
      )

    selo
      .append('circle')
      .attr('r', 8.5)
      .attr('fill', 'var(--canvas)')
      .attr('stroke', (d) => (d.expandido ? d.cor : 'var(--ink-faint)'))
      .attr('stroke-width', 1.4)

    selo
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.34em')
      .attr('font-size', '9px')
      .attr('font-family', 'var(--fonte-texto), sans-serif')
      .attr('fill', (d) => (d.expandido ? d.cor : 'var(--ink-dim)'))
      .attr('pointer-events', 'none')
      .text((d) => (d.expandido ? '−' : String(d.filhos)))

    const rotuloSel = noSel
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => raio(d) + 14)
      .attr('font-size', (d) => (d.tipo === 'materia' ? '12px' : '11px'))
      .attr('font-weight', (d) => (d.tipo === 'materia' ? 600 : 400))
      .attr('font-family', 'var(--fonte-texto), sans-serif')
      .attr('fill', (d) =>
        d.tipo === 'materia' ? d.cor : d.liberado ? 'var(--ink)' : 'var(--ink-faint)'
      )
      .attr('paint-order', 'stroke')
      .attr('stroke', 'var(--canvas)')
      .attr('stroke-width', 3.5)
      .attr('stroke-linejoin', 'round')
      .attr('pointer-events', 'none')
      .text((d) => d.titulo)

    // acessível por teclado e leitor de tela: cada nó vira um destino real
    noSel
      .attr('tabindex', (d) => (d.tipo === 'resumo' && d.liberado ? 0 : -1))
      .attr('role', (d) => (d.tipo === 'materia' ? 'group' : 'link'))
      .attr('aria-label', (d) =>
        d.tipo === 'materia'
          ? `Matéria ${d.titulo}`
          : d.liberado
            ? d.titulo
            : `${d.titulo} — fora do seu plano`
      )

    // ---------- física ----------
    const sim: Simulation<NoSim, LinkSim> = forceSimulation(simNodes)
      .force(
        'link',
        forceLink<NoSim, LinkSim>(simLinks)
          .id((d) => d.id)
          // "contém" puxa mais curto que "cita": a estrutura do autor deve
          // dominar o desenho, e as referências cruzadas só ajustam
          .distance((l) => (l.tipo === 'contem' ? 62 : 100))
          .strength((l) => (l.tipo === 'contem' ? 0.9 : 0.25))
      )
      .force('charge', forceManyBody().strength(-320))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide<NoSim>().radius((d) => raio(d) + 26))

    function posicionar() {
      linkSel
        .attr('x1', (l) => (l.source as NoSim).x ?? 0)
        .attr('y1', (l) => (l.source as NoSim).y ?? 0)
        .attr('x2', (l) => (l.target as NoSim).x ?? 0)
        .attr('y2', (l) => (l.target as NoSim).y ?? 0)
      noSel.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    }
    sim.on('tick', posicionar)

    // guarda onde cada nó parou, pra próxima expansão abrir no lugar
    sim.on('end', () => {
      for (const n of simNodes) {
        if (n.x != null && n.y != null) posicoes.current.set(n.id, { x: n.x, y: n.y })
      }
    })

    // quem pediu menos movimento recebe o layout já pronto, sem a dança inicial
    if (semMovimento) {
      sim.stop()
      for (let i = 0; i < 300; i++) sim.tick()
      posicionar()
      for (const n of simNodes) {
        if (n.x != null && n.y != null) posicoes.current.set(n.id, { x: n.x, y: n.y })
      }
    }

    // ---------- destaque ao passar o mouse ----------
    function focar(id: string | null) {
      if (!id) {
        noSel.attr('opacity', 1)
        linkSel
          .attr('stroke', (l) => (l.tipo === 'contem' ? 'var(--ink-faint)' : 'var(--line-forte)'))
          .attr('stroke-opacity', 1)
        return
      }
      const perto = vizinhos.get(id) ?? new Set([id])
      noSel.attr('opacity', (d) => (perto.has(d.id) ? 1 : 0.15))
      linkSel
        .attr('stroke-opacity', (l) =>
          (l.source as NoSim).id === id || (l.target as NoSim).id === id ? 1 : 0.08
        )
        .attr('stroke', (l) =>
          (l.source as NoSim).id === id || (l.target as NoSim).id === id
            ? 'var(--acento)'
            : l.tipo === 'contem'
              ? 'var(--ink-faint)'
              : 'var(--line-forte)'
        )
    }

    /**
     * Ancora o balão no próprio nó, e não no cursor: com a física em movimento
     * o nó desliza, e um balão preso ao mouse ficaria descolado do que explica.
     * Mede o elemento na tela, então já vem com zoom e deslocamento aplicados.
     */
    function mostrarBalao(elemento: SVGGElement, d: NoSim) {
      const caixaWrap = wrapRef.current?.getBoundingClientRect()
      if (!caixaWrap || !d.definicao) return setBalao(null)
      const caixaNo = elemento.getBoundingClientRect()
      setBalao({
        no: { titulo: d.titulo, cor: d.cor, definicao: d.definicao },
        x: caixaNo.left - caixaWrap.left + caixaNo.width / 2,
        y: caixaNo.top - caixaWrap.top,
      })
    }

    noSel
      .on('mouseenter', function (_e, d) {
        focar(d.id)
        mostrarBalao(this, d)
      })
      .on('mouseleave', () => {
        focar(null)
        setBalao(null)
      })
      .on('focus', function (_e, d) {
        focar(d.id)
        mostrarBalao(this, d)
      })
      .on('blur', () => {
        focar(null)
        setBalao(null)
      })

    // ---------- arrastar ----------
    // `arrastou` separa um arrasto de um clique. A checagem vive DENTRO do
    // handler de clique de propósito: um segundo listener 'click.guarda' com
    // stopImmediatePropagation não funcionaria, porque o d3 dispara os handlers
    // na ordem de registro e a navegação já teria acontecido.
    let arrastou = false

    noSel.call(
      drag<SVGGElement, NoSim>()
        .on('start', (event, d) => {
          arrastou = false
          setBalao(null)
          if (!event.active) sim.alphaTarget(0.25).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          arrastou = true
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0)
          // solta o nó de volta pra física, como o Obsidian faz
          d.fx = null
          d.fy = null
          if (d.x != null && d.y != null) posicoes.current.set(d.id, { x: d.x, y: d.y })
        })
    )

    // ---------- abrir e expandir ----------
    function abrir(d: NoSim) {
      // matéria não tem página própria: clicar nela abre e fecha o ramo
      if (d.tipo === 'materia') return alternar(d.id)
      if (d.liberado) router.push(`/resumos/${d.id}`)
    }
    noSel.on('click', (_e, d) => {
      if (arrastou) return
      abrir(d)
    })
    noSel.on('keydown', (e: KeyboardEvent, d) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        abrir(d)
      }
    })

    // o selo tem os próprios eventos e para a propagação, senão o clique
    // chegaria no nó e abriria o resumo junto
    selo
      .on('click', (e: MouseEvent, d) => {
        e.stopPropagation()
        if (arrastou) return
        setBalao(null)
        alternar(d.id)
      })
      .on('keydown', (e: KeyboardEvent, d) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          alternar(d.id)
        }
      })
      .on('mousedown', (e: MouseEvent) => e.stopPropagation())

    // ---------- zoom e navegação ----------
    const comportamentoZoom = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .on('zoom', (event) => {
        // o balão foi medido na posição antiga; some em vez de ficar torto
        setBalao(null)
        palco.attr('transform', event.transform.toString())
        // rótulo some quando o mapa está longe: senão vira um borrão de texto
        const k = event.transform.k
        rotuloSel.attr('opacity', k < 0.55 ? 0 : Math.min(1, (k - 0.55) / 0.35))
      })

    svg.call(comportamentoZoom).on('dblclick.zoom', null)

    // ---------- responder ao tamanho da janela ----------
    const observer = new ResizeObserver(() => {
      width = svgEl.clientWidth || width
      height = svgEl.clientHeight || height
      sim.force('center', forceCenter(width / 2, height / 2))
      sim.alpha(0.3).restart()
    })
    observer.observe(svgEl)

    // guarda a função de reset pro botão "centralizar"
    ;(svgEl as SVGSVGElement & { __reset?: () => void }).__reset = () => {
      svg.transition().duration(semMovimento ? 0 : 400).call(comportamentoZoom.transform, zoomIdentity)
    }

    return () => {
      observer.disconnect()
      sim.stop()
    }
  }, [nos, links, materias, router, expandidos, visiveis, filhosDe, porId, alternar])

  if (nos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-8">
        <p className="text-sm text-[var(--ink-dim)] text-center">
          Nenhum resumo publicado ainda. O mapa aparece assim que existirem
          resumos ligados por <code className="font-mono-plex">[[wikilinks]]</code>.
        </p>
      </div>
    )
  }

  const totalExpansiveis = nos.filter((n) => nos.some((o) => o.pai === n.id)).length

  return (
    <div ref={wrapRef} className="relative h-full overflow-hidden quadro">
      <svg ref={svgRef} className="w-full h-full block touch-none" />

      <Balao dados={balao} />

      <div className="absolute bottom-4 right-4 flex gap-2">
        {totalExpansiveis > 0 ? (
          <button
            type="button"
            onClick={() =>
              setExpandidos((atual) => {
                // se já há algum assunto aberto, o botão fecha tudo; senão abre
                const algumAberto = nos.some((n) => atual.has(n.id))
                return algumAberto
                  ? new Set(materias.map((m) => idMateria(m.slug)))
                  : new Set([
                      ...materias.map((m) => idMateria(m.slug)),
                      ...nos.map((n) => n.id),
                    ])
              })
            }
            className="text-[11.5px] bg-[var(--raised)]/90 backdrop-blur border border-[var(--line-forte)] rounded-lg px-2.5 py-1.5 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            {nos.some((n) => expandidos.has(n.id)) ? 'Recolher tudo' : 'Expandir tudo'}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() =>
            (svgRef.current as (SVGSVGElement & { __reset?: () => void }) | null)?.__reset?.()
          }
          className="text-[11.5px] bg-[var(--raised)]/90 backdrop-blur border border-[var(--line-forte)] rounded-lg px-2.5 py-1.5 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
        >
          Centralizar
        </button>
      </div>

      <p className="absolute bottom-4 left-4 text-[11px] text-[var(--ink-dim)] pointer-events-none select-none">
        Clique no número ao lado do tópico para abrir o que está dentro dele ·
        linha cheia = contém, tracejada = cita
      </p>
    </div>
  )
}

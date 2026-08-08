'use client'

import { useEffect, useRef, useState } from 'react'
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
}
type Link = { origem: string; destino: string }

type NoSim = No & SimulationNodeDatum & { grau: number }
type LinkSim = SimulationLinkDatum<NoSim>

/** Nó com poucas conexões fica pequeno; um tópico central fica grande. */
function raio(grau: number) {
  return 7 + Math.sqrt(grau) * 4.5
}

export default function GraphView({ nos, links }: { nos: No[]; links: Link[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [balao, setBalao] = useState<PosicaoBalao | null>(null)
  const router = useRouter()

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ---------- dados ----------
    // grau = quantas ligações o tópico tem, nos dois sentidos
    const grausPorId = new Map<string, number>()
    for (const l of links) {
      grausPorId.set(l.origem, (grausPorId.get(l.origem) ?? 0) + 1)
      grausPorId.set(l.destino, (grausPorId.get(l.destino) ?? 0) + 1)
    }

    const simNodes: NoSim[] = nos.map((n) => ({ ...n, grau: grausPorId.get(n.id) ?? 0 }))
    const simLinks: LinkSim[] = links.map((l) => ({ source: l.origem, target: l.destino }))

    // vizinhança, pra destacar ao passar o mouse
    const vizinhos = new Map<string, Set<string>>()
    for (const n of simNodes) vizinhos.set(n.id, new Set([n.id]))
    for (const l of links) {
      vizinhos.get(l.origem)?.add(l.destino)
      vizinhos.get(l.destino)?.add(l.origem)
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

    const linkSel = camadaLinks
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', 'var(--line-forte)')
      .attr('stroke-width', 1.3)
      .attr('stroke-linecap', 'round')

    const noSel = camadaNos
      .selectAll<SVGGElement, NoSim>('g')
      .data(simNodes)
      .join('g')
      .attr('cursor', (d) => (d.liberado ? 'pointer' : 'not-allowed'))

    noSel
      .append('circle')
      .attr('r', (d) => raio(d.grau))
      .attr('fill', (d) => d.cor)
      .attr('fill-opacity', (d) => (d.liberado ? 0.9 : 0.18))
      // o anel em volta do nó é o fundo do próprio mapa: ele "recorta" o nó
      // das arestas que passam por trás
      .attr('stroke', (d) => (d.liberado ? 'var(--canvas)' : 'var(--ink-faint)'))
      .attr('stroke-width', (d) => (d.liberado ? 2 : 1))
      .attr('stroke-dasharray', (d) => (d.liberado ? 'none' : '3,2'))

    const rotuloSel = noSel
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => raio(d.grau) + 14)
      .attr('font-size', '11px')
      .attr('font-family', 'var(--fonte-texto), sans-serif')
      .attr('fill', (d) => (d.liberado ? 'var(--ink)' : 'var(--ink-faint)'))
      .attr('paint-order', 'stroke')
      .attr('stroke', 'var(--canvas)')
      .attr('stroke-width', 3.5)
      .attr('stroke-linejoin', 'round')
      .text((d) => d.titulo)

    // acessível por teclado e leitor de tela: cada nó vira um destino real
    noSel
      .attr('tabindex', (d) => (d.liberado ? 0 : -1))
      .attr('role', 'link')
      .attr('aria-label', (d) =>
        d.liberado ? d.titulo : `${d.titulo} — fora do seu plano`
      )

    // ---------- física ----------
    const sim: Simulation<NoSim, LinkSim> = forceSimulation(simNodes)
      .force(
        'link',
        forceLink<NoSim, LinkSim>(simLinks)
          .id((d) => d.id)
          // tópicos muito conectados ficam mais afastados, pra não empelotar
          .distance((l) => 70 + ((l.source as NoSim).grau + (l.target as NoSim).grau) * 4)
      )
      .force('charge', forceManyBody().strength(-320))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide<NoSim>().radius((d) => raio(d.grau) + 26))

    function posicionar() {
      linkSel
        .attr('x1', (l) => (l.source as NoSim).x ?? 0)
        .attr('y1', (l) => (l.source as NoSim).y ?? 0)
        .attr('x2', (l) => (l.target as NoSim).x ?? 0)
        .attr('y2', (l) => (l.target as NoSim).y ?? 0)
      noSel.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    }
    sim.on('tick', posicionar)

    // quem pediu menos movimento recebe o layout já pronto, sem a dança inicial
    if (semMovimento) {
      sim.stop()
      for (let i = 0; i < 300; i++) sim.tick()
      posicionar()
    }

    // ---------- destaque ao passar o mouse ----------
    function focar(id: string | null) {
      if (!id) {
        noSel.attr('opacity', 1)
        linkSel.attr('stroke', 'var(--line-forte)').attr('stroke-opacity', 1).attr('stroke-width', 1.3)
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
            : 'var(--line-forte)'
        )
        .attr('stroke-width', (l) =>
          (l.source as NoSim).id === id || (l.target as NoSim).id === id ? 2 : 1.3
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
        })
    )

    // ---------- abrir o resumo ----------
    function abrir(d: NoSim) {
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
  }, [nos, links, router])

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

  return (
    <div ref={wrapRef} className="relative h-full overflow-hidden quadro">
      <svg ref={svgRef} className="w-full h-full block touch-none" />

      <Balao dados={balao} />

      <button
        type="button"
        onClick={() =>
          (svgRef.current as (SVGSVGElement & { __reset?: () => void }) | null)?.__reset?.()
        }
        className="absolute bottom-4 right-4 text-[11.5px] bg-[var(--raised)]/90 backdrop-blur border border-[var(--line-forte)] rounded-lg px-2.5 py-1.5 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
      >
        Centralizar
      </button>

      <p className="absolute bottom-4 left-4 text-[11px] text-[var(--ink-dim)] pointer-events-none select-none">
        Role para aproximar · arraste o fundo para mover · arraste um tópico para reorganizar
      </p>
    </div>
  )
}

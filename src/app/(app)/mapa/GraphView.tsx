'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useRouter } from 'next/navigation'

type No = { id: string; titulo: string; materia: string; cor: string; liberado: boolean }
type Link = { origem: string; destino: string }

export default function GraphView({ nos, links }: { nos: No[]; links: Link[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!svgRef.current) return
    // mede o próprio container: o grafo agora divide a tela com a barra lateral
    const width = svgRef.current.clientWidth || 800
    const height = svgRef.current.clientHeight || 600

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const simNodes = nos.map((n) => ({ ...n }))
    const simLinks = links.map((l) => ({ source: l.origem, target: l.destino }))

    const sim = d3
      .forceSimulation(simNodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(simLinks as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[]).id((d) => (d as { id: string }).id).distance(120))
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(42))

    const linkSel = svg.append('g').selectAll('line').data(simLinks).enter().append('line')
      .attr('stroke', '#E4E0D8').attr('stroke-width', 1.4)

    const nodeGroup = svg.append('g').selectAll('g').data(simNodes).enter().append('g')
      .style('cursor', 'pointer')

    nodeGroup.append('circle')
      .attr('r', 17)
      .attr('fill', (d) => d.cor)
      .attr('fill-opacity', (d) => (d.liberado ? 0.85 : 0.25))
      .attr('stroke', (d) => (d.liberado ? 'none' : '#B9C2BC'))
      .attr('stroke-dasharray', (d) => (d.liberado ? 'none' : '3,2'))

    nodeGroup.append('text')
      .attr('text-anchor', 'middle').attr('dy', 32)
      .attr('font-size', '11.5px').attr('font-family', 'Work Sans, sans-serif')
      .attr('fill', (d) => (d.liberado ? '#1D1B18' : '#6B665D'))
      .text((d) => d.titulo)

    nodeGroup.on('click', (_event, d) => {
      if (d.liberado) router.push(`/resumos/${d.id}`)
    })

    sim.on('tick', () => {
      linkSel
        .attr('x1', (d) => (d.source as unknown as { x: number }).x)
        .attr('y1', (d) => (d.source as unknown as { y: number }).y)
        .attr('x2', (d) => (d.target as unknown as { x: number }).x)
        .attr('y2', (d) => (d.target as unknown as { y: number }).y)
      nodeGroup.attr('transform', (d) => `translate(${(d as unknown as { x: number }).x},${(d as unknown as { y: number }).y})`)
    })

    return () => { sim.stop() }
  }, [nos, links, router])

  return <svg ref={svgRef} className="w-full h-full block" />
}

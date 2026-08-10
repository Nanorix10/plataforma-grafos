'use client'

import { useEffect, useRef, useState } from 'react'
import { select } from 'd3-selection'
import { zoom, zoomIdentity } from 'd3-zoom'
import { hierarchy, tree, type HierarchyPointNode } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
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
  /** `titulo` é uma seção de dentro de um resumo (decisão 12), não um resumo. */
  tipo: 'resumo' | 'titulo'
}

/** Um item da árvore: a raiz, uma matéria, um resumo ou um título dele. */
type Item = {
  nome: string
  tipo: 'raiz' | 'materia' | 'resumo' | 'titulo'
  cor: string
  no?: No
  filhos?: Item[]
}

/**
 * Quem leva a algum lugar quando clicado.
 *
 * Resumo e título são as duas pontas navegáveis — o título abre o resumo na
 * âncora dele. Raiz e matéria não abrem nada, e nunca abriram.
 */
const ehDestino = (t: Item['tipo']) => t === 'resumo' || t === 'titulo'

const LARGURA_CARTAO = 176
const ALTURA_CARTAO = 30

export default function MindMapView({
  nos,
  materias,
  titulo,
}: {
  nos: No[]
  materias: { slug: string; nome: string; cor: string }[]
  titulo: string
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [balao, setBalao] = useState<PosicaoBalao | null>(null)
  const router = useRouter()

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    // Sem checagem de prefers-reduced-motion aqui: a árvore é desenhada numa
    // posição fixa e não anima, ao contrário do grafo de forças.

    // ---------- monta a árvore ----------
    // Dois níveis de estrutura, os dois escritos à mão pelo autor:
    //   matéria  → o guarda-chuva de sempre
    //   pai_id   → a hierarquia entre resumos, de profundidade livre
    //
    // Continua sem usar os [[wikilinks]] para isso, e a razão original vale:
    // wikilinks formam um grafo sem raiz, e forçar uma árvore neles daria um
    // desenho que muda de forma a cada resumo novo. A diferença é que agora a
    // árvore não para nos dois níveis — "Atrito" pendura em "Dinâmica", que
    // pendura em "Mecânica".
    const filhosDe = new Map<string | null, No[]>()
    for (const n of nos) {
      const chave = n.pai ?? `materia:${n.materia}`
      filhosDe.set(chave, [...(filhosDe.get(chave) ?? []), n])
    }

    // `vistos` corta ciclo: o banco já barra por trigger, mas quem desenha não
    // pode travar num laço infinito se algum dado escapar
    const vistos = new Set<string>()
    function ramo(n: No, cor: string): Item {
      vistos.add(n.id)
      const filhos = (filhosDe.get(n.id) ?? []).filter((f) => !vistos.has(f.id))
      return {
        nome: n.titulo,
        tipo: n.tipo,
        cor,
        no: n,
        filhos: filhos.map((f) => ramo(f, cor)),
      }
    }

    const raiz: Item = {
      nome: titulo,
      tipo: 'raiz',
      cor: 'var(--acento)',
      filhos: materias
        .filter((m) => nos.some((n) => n.materia === m.slug))
        .map((m) => ({
          nome: m.nome,
          tipo: 'materia' as const,
          cor: m.cor,
          filhos: (filhosDe.get(`materia:${m.slug}`) ?? []).map((n) => ramo(n, m.cor)),
        })),
    }

    const dados = hierarchy<Item>(raiz, (d) => d.filhos)
    const folhas = dados.leaves().length

    // altura cresce com o número de folhas: um mapa mental rola verticalmente
    // em vez de espremer tudo na tela
    const alturaMapa = Math.max(400, folhas * 42)
    const larguraMapa = 760

    const layout = tree<Item>().size([alturaMapa, larguraMapa]).separation((a, b) => (a.parent === b.parent ? 1 : 1.4))
    const arvore = layout(dados)

    // ---------- desenha ----------
    const svg = select(svgEl)
    svg.selectAll('*').remove()

    const palco = svg.append('g')
    const camadaRamos = palco.append('g')
    const camadaItens = palco.append('g')

    const curva = linkHorizontal<unknown, HierarchyPointNode<Item>>()
      .x((d) => d.y)
      .y((d) => d.x)

    camadaRamos
      .selectAll('path')
      .data(arvore.links())
      .join('path')
      .attr('d', (l) => curva({ source: l.source, target: l.target }))
      .attr('fill', 'none')
      .attr('stroke', (l) => (l.target.data.tipo === 'materia' ? l.target.data.cor : 'var(--line-forte)'))
      .attr('stroke-width', (l) => (l.target.data.tipo === 'materia' ? 2 : 1.4))
      .attr('stroke-opacity', (l) => (l.target.data.tipo === 'materia' ? 0.55 : 1))

    const itemSel = camadaItens
      .selectAll<SVGGElement, HierarchyPointNode<Item>>('g')
      .data(arvore.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .attr('cursor', (d) => (ehDestino(d.data.tipo) && d.data.no?.liberado ? 'pointer' : 'default'))

    // cartão
    //
    // O título é VAZADO: mesma caixa do resumo, sem preenchimento. É a diferença
    // entre "isto é um resumo, tem página própria" e "isto é uma seção lá
    // dentro". Distinguir por tamanho estava fora de questão — foi justamente o
    // tamanho que saiu dos títulos no corpo do texto (decisão 12), e reintroduzi-lo
    // aqui faria o mapa contradizer a página.
    itemSel
      .append('rect')
      .attr('x', (d) => (d.data.tipo === 'raiz' ? -LARGURA_CARTAO / 2 : -10))
      .attr('y', -ALTURA_CARTAO / 2)
      .attr('width', LARGURA_CARTAO)
      .attr('height', ALTURA_CARTAO)
      .attr('rx', 6)
      .attr('fill', (d) => {
        if (d.data.tipo === 'titulo') return 'none'
        return d.data.tipo === 'resumo' ? 'var(--raised)' : d.data.cor
      })
      .attr('fill-opacity', (d) => {
        if (d.data.tipo === 'resumo') return d.data.no?.liberado ? 1 : 0.45
        return d.data.tipo === 'raiz' ? 1 : 0.14
      })
      .attr('stroke', (d) => {
        if (d.data.tipo === 'titulo') return d.data.no?.cor ?? 'var(--line-forte)'
        return d.data.tipo === 'resumo' ? 'var(--line-forte)' : d.data.cor
      })
      .attr('stroke-opacity', (d) => (d.data.tipo === 'titulo' ? 0.45 : 1))
      .attr('stroke-width', (d) => (d.data.tipo === 'raiz' ? 0 : 1.4))
      .attr('stroke-dasharray', (d) =>
        d.data.tipo === 'resumo' && !d.data.no?.liberado ? '3,2' : 'none'
      )

    // texto
    itemSel
      .append('text')
      .attr('x', (d) => (d.data.tipo === 'raiz' ? 0 : 0))
      .attr('dy', '0.34em')
      .attr('text-anchor', (d) => (d.data.tipo === 'raiz' ? 'middle' : 'start'))
      // Título e resumo saem no MESMO corpo de letra. Só raiz e matéria, que são
      // guarda-chuvas e não levam a lugar nenhum, ficam maiores.
      .attr('font-size', (d) => (ehDestino(d.data.tipo) ? '11.5px' : '12.5px'))
      .attr('font-weight', (d) => (ehDestino(d.data.tipo) ? 400 : 600))
      .attr('font-family', 'var(--fonte-texto), sans-serif')
      .attr('fill', (d) => {
        // o cartão da raiz é preenchido de lilás; texto escuro em cima dele
        // dá 7:1, enquanto o branco de antes ficava em 3,2:1
        if (d.data.tipo === 'raiz') return 'var(--page)'
        if (d.data.tipo === 'materia') return d.data.cor
        // `no.cor` e não `data.cor`: o segundo é a cor do RAMO, herdada da
        // matéria que abre aquele galho. Um tópico interdisciplinar pendurado
        // em outra disciplina (decisão 9 do CONTEXTO) tem que sair na cor da
        // matéria dele, senão o mapa afirma o que a barra lateral nega.
        return d.data.no?.liberado ? d.data.no.cor : 'var(--ink-faint)'
      })
      .text((d) => {
        const limite = 22
        const t = d.data.nome
        return t.length > limite ? `${t.slice(0, limite - 1)}…` : t
      })
      .append('title')
      .text((d) => d.data.nome)

    // cadeado nos que estão fora do plano
    itemSel
      .filter((d) => d.data.tipo === 'resumo' && !d.data.no?.liberado)
      .append('text')
      .attr('x', LARGURA_CARTAO - 26)
      .attr('dy', '0.34em')
      .attr('font-size', '11px')
      .attr('aria-hidden', 'true')
      .text('🔒')

    // ---------- acessibilidade e interação ----------
    const resumoSel = itemSel.filter((d) => ehDestino(d.data.tipo))

    resumoSel
      .attr('tabindex', (d) => (d.data.no?.liberado ? 0 : -1))
      .attr('role', 'link')
      .attr('aria-label', (d) =>
        d.data.no?.liberado ? d.data.nome : `${d.data.nome} — fora do seu plano`
      )

    function mostrarBalao(elemento: SVGGElement, d: HierarchyPointNode<Item>) {
      const caixaWrap = wrapRef.current?.getBoundingClientRect()
      const no = d.data.no
      if (!caixaWrap || !no?.definicao) return setBalao(null)
      const caixa = elemento.getBoundingClientRect()
      setBalao({
        no: { titulo: no.titulo, cor: no.cor, definicao: no.definicao },
        x: caixa.left - caixaWrap.left + caixa.width / 2,
        y: caixa.top - caixaWrap.top,
      })
    }

    function realcar(d: HierarchyPointNode<Item> | null) {
      if (!d) {
        itemSel.attr('opacity', 1)
        return
      }
      // acende o resumo e a linhagem dele até a raiz
      const linhagem = new Set(d.ancestors())
      itemSel.attr('opacity', (o) => (linhagem.has(o) ? 1 : 0.28))
    }

    resumoSel
      .on('mouseenter', function (_e, d) {
        realcar(d)
        mostrarBalao(this, d)
      })
      .on('mouseleave', () => {
        realcar(null)
        setBalao(null)
      })
      .on('focus', function (_e, d) {
        realcar(d)
        mostrarBalao(this, d)
      })
      .on('blur', () => {
        realcar(null)
        setBalao(null)
      })

    function abrir(d: HierarchyPointNode<Item>) {
      if (d.data.no?.liberado) router.push(`/resumos/${d.data.no.id}`)
    }
    resumoSel.on('click', (_e, d) => abrir(d))
    resumoSel.on('keydown', (e: KeyboardEvent, d) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        abrir(d)
      }
    })

    // ---------- zoom ----------
    const comportamentoZoom = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 2.5])
      .on('zoom', (event) => {
        setBalao(null)
        palco.attr('transform', event.transform.toString())
      })

    svg.call(comportamentoZoom).on('dblclick.zoom', null)

    // enquadra o mapa inteiro na abertura, com uma margem.
    // arrow function e não `function`: declarações de função são içadas, e o
    // TypeScript descarta o estreitamento de `svgEl` dentro delas
    const enquadrar = () => {
      const w = svgEl.clientWidth || 800
      const h = svgEl.clientHeight || 600

      // O cartão da raiz é centrado no ponto zero, então metade dele fica à
      // ESQUERDA da origem. Sem contar essa metade, translate(40) jogava 88px
      // do cartão pra fora da tela e o título aparecia cortado.
      const sobraEsquerda = LARGURA_CARTAO / 2
      const larguraTotal = sobraEsquerda + larguraMapa + LARGURA_CARTAO

      const margem = 40
      const escala = Math.min(
        1,
        (w - margem * 2) / larguraTotal,
        (h - 60) / alturaMapa
      )

      const inicial = zoomIdentity
        .translate(margem + sobraEsquerda * escala, (h - alturaMapa * escala) / 2)
        .scale(escala)
      svg.call(comportamentoZoom.transform, inicial)
    }
    enquadrar()


    ;(svgEl as SVGSVGElement & { __reset?: () => void }).__reset = enquadrar

    const observer = new ResizeObserver(() => enquadrar())
    observer.observe(svgEl)

    return () => {
      observer.disconnect()
    }
  }, [nos, materias, titulo, router])

  if (nos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-8">
        <p className="text-sm text-[var(--ink-dim)] text-center">
          Nenhum resumo publicado ainda. O mapa mental se organiza por matéria
          assim que existirem resumos.
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
        Enquadrar
      </button>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom'
import { hierarchy, tree, type HierarchyPointNode } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
import { useRouter } from 'next/navigation'
import Balao, { type PosicaoBalao } from './Balao'
import Controles from './Controles'
import { idMateria, useExpansao, type Materia, type No } from './useExpansao'

/** Um item da árvore: a raiz, uma matéria, um resumo ou um título dele. */
type Item = {
  nome: string
  tipo: 'raiz' | 'materia' | 'resumo' | 'titulo'
  cor: string
  no?: No
  /** só na matéria: o slug, para o id do nó de expansão */
  materiaSlug?: string
  /** quantos filhos há para abrir; 0 = folha de verdade */
  filhos?: Item[]
  paraAbrir?: number
  aberto?: boolean
  casou?: boolean
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
const ESCALA_MIN = 0.2
const ESCALA_MAX = 2.5

export default function MindMapView({
  nos,
  materias,
  titulo,
}: {
  nos: No[]
  materias: Materia[]
  titulo: string
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [balao, setBalao] = useState<PosicaoBalao | null>(null)
  const router = useRouter()

  const [busca, setBusca] = useState('')
  const [materiasAtivas, setMateriasAtivas] = useState<Set<string> | null>(null)

  const {
    expandidos,
    casados,
    visiveis,
    buscando,
    filhosDe,
    contarFilhos,
    alternar,
    abrirTudo,
    fecharTudo,
    algumAberto,
  } = useExpansao({ nos, materias, busca, materiasAtivas })

  /* O enquadramento do aluno é dele. Expandir um ramo NÃO pode reenquadrar o
     mapa — ele acabou de dar zoom onde queria olhar. Buscar e filtrar, sim:
     ali o resultado pode estar fora da tela, e não reenquadrar pareceria que a
     busca não achou nada. Este efeito é declarado ANTES do que desenha, porque
     efeitos rodam na ordem em que aparecem e a marca precisa chegar primeiro. */
  const transformAtual = useRef<ZoomTransform | null>(null)
  const pedirEnquadre = useRef(true)
  useEffect(() => {
    pedirEnquadre.current = true
  }, [busca, materiasAtivas])

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
    // desenho que muda de forma a cada resumo novo.
    //
    // O que mudou é que a árvore não desenha mais TUDO. Só o que `visiveis`
    // deixa passar — o resto está recolhido atrás de um selo, como no grafo.

    // `vistos` corta ciclo: o banco já barra por trigger, mas quem desenha não
    // pode travar num laço infinito se algum dado escapar
    const vistos = new Set<string>()
    function ramo(n: No, cor: string): Item {
      vistos.add(n.id)
      const filhos = (filhosDe.get(n.id) ?? []).filter(
        (f) => !vistos.has(f.id) && visiveis.has(f.id)
      )
      return {
        nome: n.titulo,
        tipo: n.tipo,
        cor,
        no: n,
        paraAbrir: contarFilhos(n.id),
        aberto: expandidos.has(n.id),
        casou: casados.has(n.id),
        filhos: filhos.map((f) => ramo(f, cor)),
      }
    }

    const materiasNaTela = materias.filter(
      (m) =>
        nos.some((n) => n.materia === m.slug) &&
        (materiasAtivas === null || materiasAtivas.has(m.slug))
    )

    const raiz: Item = {
      nome: titulo,
      tipo: 'raiz',
      cor: 'var(--acento)',
      filhos: materiasNaTela.map((m) => ({
        nome: m.nome,
        tipo: 'materia' as const,
        cor: m.cor,
        materiaSlug: m.slug,
        paraAbrir: contarFilhos(idMateria(m.slug)),
        aberto: expandidos.has(idMateria(m.slug)),
        filhos: (filhosDe.get(idMateria(m.slug)) ?? [])
          .filter((n) => visiveis.has(n.id))
          .map((n) => ramo(n, m.cor)),
      })),
    }

    const dados = hierarchy<Item>(raiz, (d) => d.filhos)
    const folhas = dados.leaves().length

    /* A altura cresce com as folhas VISÍVEIS, e é isso que faz o recolher valer
       alguma coisa: antes ela crescia com as 674 do acervo inteiro, e a árvore
       passava de 19.000px de altura com o mapa todo fechado ou aberto. */
    const alturaMapa = Math.max(400, folhas * 42)
    const larguraMapa = Math.max(360, (dados.height || 1) * 210)

    const layout = tree<Item>()
      .size([alturaMapa, larguraMapa])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.4))
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
        // quem casou com a busca ganha o anel de acento: é o único jeito de
        // achar o resultado num ramo aberto cheio de irmãos parecidos
        if (d.data.casou) return 'var(--acento)'
        if (d.data.tipo === 'titulo') return d.data.no?.cor ?? 'var(--line-forte)'
        return d.data.tipo === 'resumo' ? 'var(--line-forte)' : d.data.cor
      })
      .attr('stroke-opacity', (d) =>
        d.data.casou ? 1 : d.data.tipo === 'titulo' ? 0.45 : 1
      )
      .attr('stroke-width', (d) => (d.data.casou ? 2 : d.data.tipo === 'raiz' ? 0 : 1.4))
      .attr('stroke-dasharray', (d) =>
        d.data.tipo === 'resumo' && !d.data.no?.liberado ? '3,2' : 'none'
      )

    // texto
    itemSel
      .append('text')
      .attr('x', 0)
      .attr('dy', '0.34em')
      .attr('text-anchor', (d) => (d.data.tipo === 'raiz' ? 'middle' : 'start'))
      // Título e resumo saem no MESMO corpo de letra. Só raiz e matéria, que são
      // guarda-chuvas e não levam a lugar nenhum, ficam maiores.
      .attr('font-size', (d) => (ehDestino(d.data.tipo) ? '11.5px' : '12.5px'))
      .attr('font-weight', (d) => (ehDestino(d.data.tipo) ? 400 : 600))
      .attr('font-family', 'var(--fonte-texto), sans-serif')
      .attr('pointer-events', 'none')
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
      .attr('pointer-events', 'none')
      .text('🔒')

    /* Selo de "tem coisa dentro", igual ao do grafo — inclusive por ficar num
       alvo próprio: clicar no cartão do resumo já significa abrir o resumo, e
       misturar as duas ações no mesmo pixel tiraria do aluno o controle de qual
       delas ele quis. Na matéria, que não abre página nenhuma, o cartão inteiro
       também alterna. */
    const comFilhos = itemSel.filter((d) => (d.data.paraAbrir ?? 0) > 0)

    const selo = comFilhos
      .append('g')
      .attr('transform', `translate(${LARGURA_CARTAO - 8},0)`)
      .attr('cursor', 'pointer')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) =>
        d.data.aberto
          ? `Recolher ${d.data.nome}`
          : `Expandir ${d.data.nome} (${d.data.paraAbrir})`
      )

    selo
      .append('circle')
      .attr('r', 8.5)
      .attr('fill', 'var(--canvas)')
      .attr('stroke', (d) => (d.data.aberto ? d.data.cor : 'var(--ink-faint)'))
      .attr('stroke-width', 1.4)

    selo
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.34em')
      .attr('font-size', '9px')
      .attr('font-family', 'var(--fonte-texto), sans-serif')
      .attr('fill', (d) => (d.data.aberto ? d.data.cor : 'var(--ink-dim)'))
      .attr('pointer-events', 'none')
      .text((d) => (d.data.aberto ? '−' : String(d.data.paraAbrir)))

    function idDeExpansao(d: HierarchyPointNode<Item>) {
      if (d.data.tipo === 'materia') return idMateria(d.data.materiaSlug ?? '')
      return d.data.no?.id ?? null
    }

    selo
      .on('click', (e: MouseEvent, d) => {
        e.stopPropagation()
        const id = idDeExpansao(d)
        if (id) alternar(id)
      })
      .on('keydown', (e: KeyboardEvent, d) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        e.stopPropagation()
        const id = idDeExpansao(d)
        if (id) alternar(id)
      })

    // ---------- acessibilidade e interação ----------
    const materiaSel = itemSel.filter((d) => d.data.tipo === 'materia')
    materiaSel
      .attr('cursor', 'pointer')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-expanded', (d) => String(!!d.data.aberto))
      .attr('aria-label', (d) => `Matéria ${d.data.nome}`)
      .on('click', (_e, d) => alternar(idMateria(d.data.materiaSlug ?? '')))
      .on('keydown', (e: KeyboardEvent, d) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        alternar(idMateria(d.data.materiaSlug ?? ''))
      })

    const resumoSel = itemSel.filter((d) => ehDestino(d.data.tipo))

    resumoSel
      .attr('cursor', (d) => (d.data.no?.liberado ? 'pointer' : 'default'))
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
      .scaleExtent([ESCALA_MIN, ESCALA_MAX])
      .on('zoom', (event) => {
        setBalao(null)
        transformAtual.current = event.transform
        palco.attr('transform', event.transform.toString())
      })

    svg.call(comportamentoZoom).on('dblclick.zoom', null)

    /**
     * Enquadra pela LARGURA, e deixa a altura rolar.
     *
     * A versão anterior punha `(h - 60) / alturaMapa` no mesmo `Math.min` e
     * espremia o mapa inteiro na tela: com a árvore cheia dava escala 0,033 e
     * o texto de 11,5px saía a 0,4px. Pior, isso ficava ABAIXO do piso de 0.2
     * do `scaleExtent`, então o primeiro toque no zoom saltava seis vezes e o
     * enquadramento se perdia. Um mapa mental rola para baixo — é o que o
     * comentário desta função sempre prometeu, e agora é o que ela faz.
     *
     * arrow function e não `function`: declarações de função são içadas, e o
     * TypeScript descarta o estreitamento de `svgEl` dentro delas
     */
    const enquadrar = () => {
      const w = svgEl.clientWidth || 800
      const h = svgEl.clientHeight || 600

      // O cartão da raiz é centrado no ponto zero, então metade dele fica à
      // ESQUERDA da origem. Sem contar essa metade, translate(40) jogava 88px
      // do cartão pra fora da tela e o título aparecia cortado.
      const sobraEsquerda = LARGURA_CARTAO / 2
      const larguraTotal = sobraEsquerda + larguraMapa + LARGURA_CARTAO

      const margem = 40
      const escala = Math.max(
        ESCALA_MIN,
        Math.min(1, (w - margem * 2) / larguraTotal)
      )

      // cabendo na altura, centraliza; não cabendo, encosta no topo e rola
      const alturaEscalada = alturaMapa * escala
      const y = alturaEscalada < h - 60 ? (h - alturaEscalada) / 2 : 30

      const inicial = zoomIdentity
        .translate(margem + sobraEsquerda * escala, y)
        .scale(escala)
      transformAtual.current = inicial
      svg.call(comportamentoZoom.transform, inicial)
    }

    /* Expandir mantém a vista do aluno; buscar e filtrar reenquadram. */
    if (pedirEnquadre.current || !transformAtual.current) {
      enquadrar()
      pedirEnquadre.current = false
    } else {
      svg.call(comportamentoZoom.transform, transformAtual.current)
    }

    ;(svgEl as SVGSVGElement & { __reset?: () => void }).__reset = enquadrar

    const observer = new ResizeObserver(() => enquadrar())
    observer.observe(svgEl)

    return () => {
      observer.disconnect()
    }
  }, [
    nos,
    materias,
    titulo,
    router,
    visiveis,
    expandidos,
    casados,
    filhosDe,
    contarFilhos,
    alternar,
    materiasAtivas,
  ])

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
      <Controles
        busca={busca}
        setBusca={setBusca}
        materias={materias}
        materiasAtivas={materiasAtivas}
        setMateriasAtivas={setMateriasAtivas}
        achados={casados.size}
        buscando={buscando}
      />

      <svg ref={svgRef} className="w-full h-full block touch-none" />

      <Balao dados={balao} />

      <div className="absolute bottom-4 right-4 flex gap-2">
        <BotaoCanto onClick={() => (algumAberto ? fecharTudo() : abrirTudo())}>
          {algumAberto ? 'Recolher tudo' : 'Expandir tudo'}
        </BotaoCanto>
        <BotaoCanto
          onClick={() =>
            (svgRef.current as (SVGSVGElement & { __reset?: () => void }) | null)?.__reset?.()
          }
        >
          Enquadrar
        </BotaoCanto>
      </div>

      <p className="absolute bottom-4 left-4 text-[11px] text-[var(--ink-dim)] pointer-events-none select-none">
        Clique no número ao lado do cartão para abrir o que está dentro dele
      </p>
    </div>
  )
}

function BotaoCanto({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11.5px] bg-[var(--raised)]/90 backdrop-blur border border-[var(--line-forte)] rounded-lg px-2.5 py-1.5 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
    >
      {children}
    </button>
  )
}

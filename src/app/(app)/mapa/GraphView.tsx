'use client'

import { useEffect, useRef, useState } from 'react'
// imports granulares de propósito: `import * as d3 from 'd3'` arrastaria os 30
// submódulos (geo, chord, contour…) pra usar quatro
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom'
// import só pelo efeito colateral: é ele que adiciona .transition() ao Selection.
// Não custa nada no bundle — o d3-zoom já depende do d3-transition.
import 'd3-transition'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force'
// a colisão do d3 é circular e o rótulo é largo e baixo; ver o cabeçalho de lá
import { colisaoElipse, medidasElipse } from './colisaoElipse'
import { useRouter } from 'next/navigation'
import Balao, { type PosicaoBalao } from './Balao'
import Controles from './Controles'
// `No`, `Materia` e a lógica de expansão vivem fora daqui porque as DUAS visões
// do mapa precisam da mesma resposta; ver o cabeçalho de `useExpansao.ts`.
import { idMateria, useExpansao, type Materia, type No } from './useExpansao'

type Link = { origem: string; destino: string }

type NoSim = SimulationNodeDatum & {
  id: string
  titulo: string
  cor: string
  liberado: boolean
  definicao: string
  tipo: 'materia' | 'resumo' | 'titulo'
  grau: number
  filhos: number
  expandido: boolean
  casou: boolean
}
type LinkSim = SimulationLinkDatum<NoSim> & { tipo: 'contem' | 'cita' }

/**
 * Nó com poucas conexões fica pequeno; um tópico central fica grande.
 *
 * O título entra nesta mesma conta sem cláusula própria, e sai pequeno por
 * consequência: `grau` conta as citações `[[...]]`, e quem cita é sempre um
 * resumo inteiro, nunca uma seção. Um título só cresce se tiver subtítulos.
 * Aqui o tamanho mede alcance, não nível — um h4 muito citado por dentro
 * ficaria maior que o h2 vizinho, e estaria certo.
 */
function raio(d: NoSim) {
  if (d.tipo === 'materia') return 13
  return 7 + Math.sqrt(d.grau + d.filhos) * 4.5
}

/**
 * Quantos caracteres do título são desenhados no mapa.
 *
 * "Movimento circular uniformemente variado" tem 40 caracteres e, a 11px,
 * ocupa uns 215px — mais largo que qualquer folga que a colisão consiga abrir
 * entre dois nós. Sem corte, um título desses atravessa os vizinhos por mais
 * que a física empurre, porque quem colide é o CÍRCULO e o texto não faz parte
 * dele.
 *
 * Nada se perde: o `Balao` mostra o título inteiro ao passar o mouse ou focar,
 * e o `aria-label` do nó também — o corte é só do que se desenha.
 */
const MAX_ROTULO = 26

function rotuloCurto(titulo: string) {
  return titulo.length > MAX_ROTULO ? `${titulo.slice(0, MAX_ROTULO - 1).trimEnd()}…` : titulo
}

/**
 * Meia-largura do rótulo desenhado, em pixels.
 *
 * 5,4px por caractere é a largura média da fonte de interface nos 11px usados
 * aqui — medida, não chutada, mas ainda uma média: título com muitos "i" ocupa
 * menos.
 *
 * O número foi medido na Inter, e SOBREVIVEU à troca dela pela Bricolage
 * Grotesque em 27/08: lendo as larguras de avanço direto no arquivo das duas,
 * a Bricolage saiu 0,04% mais estreita. Quem trocar a família de novo tem de
 * remedir — o jeito barato é somar o avanço dos glifos do título mais longo do
 * acervo e dividir pelo número de caracteres.
 *
 * O teto de 40px existia para o título comprido não inflar um CÍRCULO de
 * exclusão gigante em volta de um ponto de 8px. Ele fica, agora por outro
 * motivo: a colisão virou elíptica (ver `colisaoElipse.ts`) e já não paga a
 * largura na vertical, mas o rótulo continua cortado em `MAX_ROTULO`, e um
 * teto acima do que se desenha reservaria espaço para texto que não existe.
 */
function meiaLarguraDoRotulo(d: NoSim) {
  return Math.min((Math.min(d.titulo.length, MAX_ROTULO) * 5.4) / 2, 40)
}

/* As duas medidas da elipse de cada nó, do mesmo par de acessadores: a colisão
   empurra por elas e o `enquadrar` mede a moldura por elas. Ver o cabeçalho de
   `colisaoElipse.ts` para por que uma diverge da outra em silêncio. */
const { rx: raioX, ry: raioY } = medidasElipse<NoSim>(raio, meiaLarguraDoRotulo)

/**
 * Raio que a estrela de um pai precisa para caber sem briga.
 *
 * Este número é a correção do defeito central da física antiga: a aresta
 * "contém" pedia 62px para TODO mundo, e a colisão precisava de muito mais
 * quando o pai tinha dezenas de filhos. As duas forças puxavam em sentidos
 * opostos para sempre — a aresta assentava a 5x o comprimento pedido, o mapa
 * tremia e a estrela invadia as matérias vizinhas.
 *
 * A conta é empacotamento em disco: `n` filhos de área `π·rx·ry` cabem, com
 * aproveitamento `DENSIDADE`, num disco de raio `√(n·rx·ry/DENSIDADE)`. Os
 * 59x24 são as medidas do resumo típico do acervo (título de 19 caracteres, já
 * no teto da meia-largura); a densidade de 0,62 é o que empacotamento
 * desordenado alcança na prática, medida na simulação e não deduzida.
 *
 * Com isso a aresta pede o comprimento que ela vai mesmo ter: o estiramento
 * médio caiu de 4,93 para 0,88.
 */
const DENSIDADE = 0.62

function raioEstrela(filhos: number) {
  if (filhos <= 1) return 62
  return Math.max(62, Math.sqrt((filhos * 59 * 24) / DENSIDADE))
}

/**
 * Espessura do anel do nó no estado normal.
 *
 * Existe como função porque o pino a engrossa e depois precisa DEVOLVER o
 * valor certo. Um `.attr('stroke-width', null)` apagaria o atributo e o nó
 * bloqueado (que usa 1) voltaria com a espessura do liberado.
 */
function larguraDoAnel(d: NoSim) {
  if (d.casou) return 3
  return d.tipo === 'materia' ? 2 : d.liberado ? 2 : 1
}

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

  const [busca, setBusca] = useState('')
  const [materiasAtivas, setMateriasAtivas] = useState<Set<string> | null>(null)

  /* Quem está aberto, quem casou com a busca e quem aparece por causa disso —
     tudo em `useExpansao`, compartilhado com o mapa mental. Ver o cabeçalho
     daquele arquivo para saber por que as matérias agora nascem FECHADAS. */
  const {
    expandidos,
    casados,
    visiveis,
    buscando,
    porId,
    filhosDe,
    contarFilhos,
    alternar,
    abrirTudo,
    fecharTudo,
    algumAberto,
  } = useExpansao({ nos, materias, busca, materiasAtivas })

  /**
   * Posições da última passada, guardadas por id.
   *
   * É isto que faz o assunto "abrir no lugar": ao expandir, a simulação é
   * remontada, e sem memória de posição o mapa inteiro saltaria para um layout
   * novo a cada clique. Com ela, quem já estava na tela continua onde estava e
   * só os filhos novos se acomodam — saindo de dentro do pai.
   */
  const posicoes = useRef(new Map<string, { x: number; y: number }>())

  /**
   * Quem o autor arrastou e prendeu no lugar.
   *
   * Fica num ref, e não em estado, porque mudá-lo não deve repintar o React:
   * quem desenha o mapa é o d3, dentro do efeito, e um `setState` aqui
   * remontaria a simulação inteira no meio de um arrasto.
   *
   * Precisa sobreviver à remontagem do efeito (que acontece a cada expansão),
   * senão o arranjo que o autor montou à mão se desfaria no primeiro clique
   * num selo.
   */
  const pregados = useRef(new Set<string>())

  /* O ref guarda QUEM está pregado; este estado só diz SE há alguém, para o
     botão "Soltar nós" aparecer. São coisas separadas de propósito: o conjunto
     muda no meio de um arrasto e não pode repintar nada, e o botão precisa de
     estado do React para existir na árvore. Note que `temPino` não entra nas
     dependências do efeito — se entrasse, prender um nó remontaria a
     simulação inteira. */
  const [temPino, setTemPino] = useState(false)

  /**
   * Se a simulação já rodou uma vez nesta tela.
   *
   * `forceSimulation` nasce com `alpha = 1`, que é "reorganize tudo". Isso é o
   * certo na primeira vez e errado em todas as outras: como as posições são
   * restauradas de `posicoes`, expandir um ramo não precisa reacomodar o mapa
   * inteiro — precisa só acomodar os filhos que acabaram de aparecer.
   */
  const jaRodou = useRef(false)

  /**
   * A moldura: o que o aluno está olhando, e se foi ELE quem escolheu.
   *
   * O efeito é remontado a cada expansão, e a remontagem apaga o `<g>` do palco
   * com a transformação junto — as posições dos nós sobrevivem em `posicoes`,
   * o enquadramento não sobrevivia. Guardá-la aqui é o que impede o mapa de
   * saltar para a escala 1 na origem a cada clique num selo.
   *
   * `mexeuNoZoom` decide quem manda. O gatilho antigo era "primeira montagem",
   * lido de um ref que sobrevive à remontagem: em desenvolvimento o StrictMode
   * monta o efeito duas vezes, a segunda passada já não era a primeira, e o
   * mapa abria SEM enquadramento nenhum — com onze bolhas, ele nascia no canto
   * de cima, metade escondida atrás do painel de busca. `event.sourceEvent` é
   * o idioma do d3 para "isto partiu de um gesto", e não de um `zoom.transform`
   * que o próprio código chamou.
   */
  const transformAtual = useRef<ZoomTransform | null>(null)
  const mexeuNoZoom = useRef(false)

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

    /* Só entram matérias que têm resumo — uma matéria vazia seria um nó solto —
       e, com filtro ligado, só as escolhidas. A matéria some do anel junto com
       os resumos dela: deixá-la ali, vazia, diria que a disciplina não tem
       conteúdo, que é o contrário do que o filtro fez. */
    const materiasUsadas = materias.filter((m) => {
      if (materiasAtivas !== null && !materiasAtivas.has(m.slug)) return false
      if (!nos.some((n) => n.materia === m.slug)) return false
      // buscando, a matéria sem resultado sai junto: um nó de matéria sozinho
      // no anel diz "procure aqui" apontando para nada
      if (!buscando) return true
      return (filhosDe.get(idMateria(m.slug)) ?? []).some((n) => visiveis.has(n.id))
    })

    const simNodes: NoSim[] = [
      ...materiasUsadas.map((m) => ({
        id: idMateria(m.slug),
        titulo: m.nome,
        cor: m.cor,
        liberado: true,
        definicao: '',
        tipo: 'materia' as const,
        grau: 0,
        filhos: contarFilhos(idMateria(m.slug)),
        expandido: expandidos.has(idMateria(m.slug)),
        casou: false,
      })),
      ...nos
        .filter((n) => visiveis.has(n.id))
        .map((n) => ({
          id: n.id,
          titulo: n.titulo,
          cor: n.cor,
          liberado: n.liberado,
          definicao: n.definicao,
          tipo: n.tipo,
          grau: grausPorId.get(n.id) ?? 0,
          filhos: contarFilhos(n.id),
          expandido: expandidos.has(n.id),
          casou: casados.has(n.id),
        })),
    ]

    /* Quantos filhos cada pai tem DE FATO NA TELA — não quantos ele tem no
       acervo. É esta contagem que dimensiona a estrela, e ela precisa respeitar
       o filtro de matéria e a busca: uma matéria com 46 resumos dos quais 3
       casaram com a busca é uma estrela de 3, e pedir o raio de 46 abriria um
       vazio do tamanho da tela em volta dela. */
    const filhosNaTela = new Map<string, number>()
    for (const n of simNodes) {
      if (n.tipo === 'materia') continue
      const original = porId.get(n.id)
      const paiId = original?.pai ?? idMateria(original?.materia ?? '')
      filhosNaTela.set(paiId, (filhosNaTela.get(paiId) ?? 0) + 1)
    }
    const filhosVisiveis = (id: string) => filhosNaTela.get(id) ?? 1

    /* Reaproveita a posição de quem já estava na tela; quem é novo nasce em
       volta do pai, pra parecer que saiu de dentro dele.

       O filho novo nasce num LEQUE, e não num ponto aleatório perto do pai.
       Antes era `pai ± 15px` sorteados: seis irmãos apareciam praticamente no
       mesmo lugar, e a física tinha de desempilhá-los à força — é essa briga
       que se vê como bagunça ao expandir um ramo. Distribuídos num arco desde
       o começo, eles já nascem separados e a simulação só ajusta.

       O ângulo vem do ÍNDICE do filho, não de `Math.random()`: expandir e
       recolher o mesmo ramo duas vezes devolve o mesmo desenho, em vez de um
       arranjo novo a cada clique.

       E o leque tem o raio de EQUILÍBRIO (`raioEstrela`), não os 40px de antes.
       Nascer colado no pai era o que fazia o mapa saltar: os 46 filhos de
       Biologia apareciam empilhados num ponto e se abriam até 300px, a moldura
       crescia enquanto isso e o enquadramento automático corria atrás. Nascendo
       onde vão ficar, quem já estava na tela anda 35px em média no lugar dos
       194 de antes, e o pico de velocidade cai de 74px/tick para 30.

       O leque é ELÍPTICO pela mesma razão da colisão: a estrela que assenta é
       mais larga que alta, e um leque circular obrigaria a física a achatá-lo
       à força — que é justamente o movimento que se queria eliminar. */
    const idsAgora = new Set(simNodes.map((n) => n.id))
    const nascidosPorPai = new Map<string, number>()
    for (const n of simNodes) {
      const anterior = posicoes.current.get(n.id)
      if (anterior) {
        n.x = anterior.x
        n.y = anterior.y
        continue
      }
      const paiId = porId.get(n.id)?.pai ?? idMateria(porId.get(n.id)?.materia ?? '')
      const doPai = posicoes.current.get(paiId)
      if (!doPai) continue

      const irmaos = filhosVisiveis(paiId)
      const ordem = nascidosPorPai.get(paiId) ?? 0
      nascidosPorPai.set(paiId, ordem + 1)

      const angulo = (ordem / irmaos) * Math.PI * 2
      const distancia = raioEstrela(irmaos)
      n.x = doPai.x + Math.cos(angulo) * distancia * 1.6
      n.y = doPai.y + Math.sin(angulo) * distancia * 0.6
    }

    // devolve o pino a quem o autor tinha prendido antes desta remontagem
    for (const n of simNodes) {
      if (pregados.current.has(n.id) && n.x != null && n.y != null) {
        n.fx = n.x
        n.fy = n.y
      }
    }
    // esquece quem saiu, senão o mapa "lembra" posições velhas ao reexpandir
    for (const id of [...posicoes.current.keys()]) {
      if (!idsAgora.has(id)) posicoes.current.delete(id)
    }

    const simLinks: LinkSim[] = [
      // "contém": a espinha da árvore, escrita à mão pelo autor
      ...simNodes
        .filter((n) => n.tipo !== 'materia')
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
      // O título é vazado, como no mapa mental: a mesma diferença entre "tem
      // página própria" e "é uma seção lá dentro", dita do mesmo jeito nas duas
      // visões — quem aprende a ler numa não precisa reaprender na outra.
      .attr('fill-opacity', (d) => {
        if (d.tipo === 'titulo') return 0.12
        return d.tipo === 'materia' ? 0.22 : d.liberado ? 0.9 : 0.18
      })
      // o anel em volta do nó é o fundo do próprio mapa: ele "recorta" o nó
      // das arestas que passam por trás. No título o anel é da cor da matéria,
      // porque sem preenchimento é ele que dá a cor ao nó.
      .attr('stroke', (d) => {
        // quem casou com a busca ganha o anel de acento: num ramo aberto cheio
        // de irmãos parecidos, é o que separa o resultado do resto
        if (d.casou) return 'var(--acento)'
        if (d.tipo === 'titulo') return d.cor
        return d.tipo === 'materia' ? d.cor : d.liberado ? 'var(--canvas)' : 'var(--ink-faint)'
      })
      .attr('stroke-opacity', (d) => (d.casou ? 1 : d.tipo === 'titulo' ? 0.55 : 1))
      .attr('stroke-width', larguraDoAnel)
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
        // o rótulo do resumo agora acompanha a cor da matéria, como todo
        // título do site; o bloqueado segue apagado, pra não parecer aberto
        d.tipo === 'materia' ? d.cor : d.liberado ? d.cor : 'var(--ink-faint)'
      )
      .attr('paint-order', 'stroke')
      .attr('stroke', 'var(--canvas)')
      .attr('stroke-width', 3.5)
      .attr('stroke-linejoin', 'round')
      .attr('pointer-events', 'none')
      // cortado, porque o texto não colide (ver `rotuloCurto`); o título
      // inteiro segue no balão e no `aria-label` logo abaixo
      .text((d) => rotuloCurto(d.titulo))

    // acessível por teclado e leitor de tela: cada nó vira um destino real
    noSel
      .attr('tabindex', (d) => (d.tipo !== 'materia' && d.liberado ? 0 : -1))
      .attr('role', (d) => (d.tipo === 'materia' ? 'group' : 'link'))
      .attr('aria-label', (d) =>
        d.tipo === 'materia'
          ? `Matéria ${d.titulo}`
          : d.liberado
            ? d.titulo
            : `${d.titulo} — fora do seu plano`
      )

    /* ---------- âncoras das matérias ----------
       Cada matéria ganha um lugar num anel, e os resumos dela são puxados de
       leve para o mesmo ponto. Sem isto o mapa é seis estrelas soltas: hoje o
       acervo tem UMA citação `[[...]]` no total, então as matérias não se
       ligam por nada e o desenho depende só de onde os nós nasceram — cada
       recarregamento dava uma forma diferente.

       O ângulo sai do índice em `materiasUsadas`, que chega na ordem do
       `MATERIAS` (o `page.tsx` monta a lista com `Object.entries`). Ordem
       canônica e não ordem de chegada da consulta: assim publicar um resumo
       novo não gira o mapa inteiro. Ganhar uma matéria INÉDITA muda os ângulos,
       e deve mudar mesmo — é um setor novo que passou a existir. */
    const anguloDaMateria = new Map<string, number>()
    materiasUsadas.forEach((m, i) => {
      // -π/2 põe a primeira matéria no topo, e não à direita, que é onde o
      // ângulo zero cai; topo é onde o olho começa a ler o círculo
      anguloDaMateria.set(m.slug, (i / materiasUsadas.length) * Math.PI * 2 - Math.PI / 2)
    })

    /* 0,34 e não os 0,24 de antes.
       O anel só precisa manter as matérias afastadas o bastante para as
       estrelas delas não se misturarem, e a conta mudou duas vezes desde que o
       número foi escolhido: o acervo foi de 38 para 232 resumos, e a colisão
       elíptica encolheu cada estrela. Com 0,24, abrir duas matérias deixava 61%
       dos vizinhos mais próximos de cada resumo pertencendo a OUTRA matéria;
       com 0,34, 48% — e o desenho ainda cabe na tela com escala 0,60, acima do
       0,55 em que os rótulos somem.
       Passar de 0,44 devolve pouca separação e começa a apertar o zoom: medido,
       48% → 45% em troca de 0,60 → 0,57. */
    const raioDoAnel = Math.min(width, height) * 0.34

    /** Para onde este nó tende: o ponto da matéria dele, ou o centro. */
    function alvo(d: NoSim): { x: number; y: number } {
      const slug =
        d.tipo === 'materia'
          ? d.id.slice('materia:'.length)
          : (porId.get(d.id)?.materia ?? '')
      const ang = anguloDaMateria.get(slug)
      if (ang === undefined) return { x: width / 2, y: height / 2 }
      return {
        x: width / 2 + Math.cos(ang) * raioDoAnel,
        y: height / 2 + Math.sin(ang) * raioDoAnel,
      }
    }

    // ---------- física ----------
    const sim: Simulation<NoSim, LinkSim> = forceSimulation(simNodes)
      .force(
        'link',
        forceLink<NoSim, LinkSim>(simLinks)
          .id((d) => d.id)
          /* "contém" puxa mais curto que "cita": a estrutura do autor deve
             dominar o desenho, e as referências cruzadas só ajustam.

             Mas "curto" deixou de ser um número fixo. Os 62px valiam quando
             cada matéria segurava meia dúzia de assuntos; hoje Biologia segura
             46 filhos diretos, que não cabem num círculo de 62px de raio por
             mais que a aresta puxe — a colisão ganha, a aresta fica esticada
             para sempre e a briga entre as duas é o tremor. `raioEstrela` pede
             o comprimento que a estrela vai mesmo ter. */
          .distance((l) =>
            l.tipo === 'contem' ? raioEstrela(filhosVisiveis((l.source as NoSim).id)) : 100
          )
          .strength((l) => (l.tipo === 'contem' ? 0.9 : 0.25))
      )
      /* A matéria empurra mais forte porque é o centro de uma estrela de até
         dez resumos e precisa abrir espaço para todos eles.

         `distanceMax` é o que impede o mapa de se esfarelar: sem teto, a
         repulsão é de alcance INFINITO, e dois grupos que não se ligam por
         aresta nenhuma continuam se empurrando de um canto ao outro da tela
         para sempre. Com 420px ela vira uma força de vizinhança — separa quem
         está perto e ignora quem já está longe. */
      .force(
        'charge',
        forceManyBody<NoSim>()
          .strength((d) => (d.tipo === 'materia' ? -520 : -260))
          .distanceMax(420)
      )
      /* `forceX`/`forceY` no lugar do `forceCenter`, e a diferença é a causa do
         mapa fugir da tela.

         `forceCenter` NÃO puxa nó nenhum: ele desloca o sistema inteiro a cada
         tick para manter o centroide no lugar. Com componentes desconexos, o
         centroide fica parado enquanto os grupos se afastam — a média entre
         seis blocos fugindo em direções opostas continua no meio. Estas duas
         forças agem POR NÓ, então cada um tem para onde voltar.

         A matéria é presa com força; o resumo só é sugerido, e quem de fato o
         posiciona é a aresta que o liga ao pai. Apertar aqui empilharia os
         irmãos todos no mesmo ponto.

         0,20 e não os 0,12 de antes. Aquele valor era o certo enquanto a aresta
         "contém" pedia 62px para todo mundo: com ela puxando os filhos para
         cima do pai, uma âncora firme só somaria aperto. Agora a aresta pede o
         raio de equilíbrio da estrela e não empilha mais ninguém, então a
         âncora pode fazer o trabalho dela — que é manter cada estrela em cima
         da própria matéria. Medido com duas matérias abertas: rótulos
         encavalados caem de 15 pares para 3. */
      .force(
        'x',
        forceX<NoSim>((d) => alvo(d).x).strength((d) => (d.tipo === 'materia' ? 0.25 : 0.2))
      )
      .force(
        'y',
        forceY<NoSim>((d) => alvo(d).y).strength((d) => (d.tipo === 'materia' ? 0.25 : 0.2))
      )
      /* Elíptica, e não o `forceCollide` do d3 — que é circular e cobrava na
         VERTICAL a largura de um rótulo que é só horizontal. Ver o cabeçalho de
         `colisaoElipse.ts`: é a mudança que faz as estrelas caberem. */
      .force('collide', colisaoElipse<NoSim>(raioX, raioY))
      /* Mais atrito e esfriamento mais rápido. `velocityDecay` é o parâmetro do
         "nervoso": com o padrão 0.4 o nó passa do ponto de equilíbrio, volta,
         passa de novo, e o mapa fica vibrando por segundos. `alphaDecay` a
         0.035 faz a simulação assentar em ~130 ticks em vez de ~300. */
      .velocityDecay(0.55)
      .alphaDecay(0.035)

    /* Remontagem abre FRIA. Este efeito roda de novo a cada expansão, e uma
       `forceSimulation` nova nasce com `alpha = 1`, que significa "reorganize
       tudo do zero". Na primeira vez é o que se quer; da segunda em diante,
       não: as posições já vieram de `posicoes.current`, e o que falta acomodar
       são só os filhos que acabaram de nascer. Com 1, o mapa inteiro se
       reorganizava a cada clique num selo. */
    let jaEnquadrou = false
    const primeiraMontagem = !jaRodou.current
    if (!primeiraMontagem) sim.alpha(0.35)
    jaRodou.current = true

    function posicionar() {
      linkSel
        .attr('x1', (l) => (l.source as NoSim).x ?? 0)
        .attr('y1', (l) => (l.source as NoSim).y ?? 0)
        .attr('x2', (l) => (l.target as NoSim).x ?? 0)
        .attr('y2', (l) => (l.target as NoSim).y ?? 0)
      noSel.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    }
    /* Um primeiro enquadramento assim que a simulação ESFRIA (alpha < 0.06),
       além do que acontece no `end`. Não é redundância: `end` só dispara se a
       simulação chegar sozinha ao fim, e o `ResizeObserver` pode reaquecê-la
       antes disso — sem este, o mapa passaria esse tempo todo fora da tela.
       0.06 é onde os nós já pararam de andar de forma visível. */
    sim.on('tick', () => {
      posicionar()
      if (!jaEnquadrou && !mexeuNoZoom.current && sim.alpha() < 0.06) {
        jaEnquadrou = true
        enquadrar(semMovimento ? 0 : 400)
      }
    })

    // guarda onde cada nó parou, pra próxima expansão abrir no lugar
    sim.on('end', () => {
      for (const n of simNodes) {
        if (n.x != null && n.y != null) posicoes.current.set(n.id, { x: n.x, y: n.y })
      }
      /* Assentou pela primeira vez: enquadra. `enquadrar` é declaração de
         função (içada) e este callback é assíncrono, então quando ele roda o
         `comportamentoZoom` lá de baixo já existe. */
      /* Enquadra DE NOVO, mesmo já tendo enquadrado no tick. O primeiro
         enquadramento acontece com alpha ~0.06, quando o mapa já dá para ler
         mas os nós ainda estão andando; sem este segundo, o desenho terminava
         deslocado para o lado, do tanto que eles ainda se moveram depois. */
      if (!mexeuNoZoom.current) {
        jaEnquadrou = true
        enquadrar(semMovimento ? 0 : 500)
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

    /* O nó pregado ganha um anel mais grosso. Sem marca visível, "está preso"
       viraria um estado invisível: o autor arrastaria um nó, ele ficaria, e não
       haveria como saber por que aquele não obedece mais à física — nem como
       descobrir que existe um jeito de soltar. */
    function marcarPino(grupo: SVGGElement, d: NoSim, preso: boolean) {
      select(grupo)
        .select('circle')
        .attr('stroke-width', preso ? larguraDoAnel(d) + 1.8 : larguraDoAnel(d))
    }
    noSel.each(function (d) {
      if (pregados.current.has(d.id)) marcarPino(this, d, true)
    })

    noSel.call(
      drag<SVGGElement, NoSim>()
        .on('start', (event, d) => {
          arrastou = false
          setBalao(null)
          /* 0.1 e não 0.25: o alvo de alpha reaquece o mapa INTEIRO enquanto o
             dedo está em cima de um nó só. Alto demais, arrastar um resumo
             fazia as seis matérias saírem do lugar junto. */
          if (!event.active) sim.alphaTarget(0.1).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          arrastou = true
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', function (event, d) {
          if (!event.active) sim.alphaTarget(0)

          /* O nó FICA onde foi solto. Antes o `end` fazia `d.fx = null` e a
             física o puxava de volta assim que o dedo saía — de perto, parece
             que o nó escapou da mão. Quem arrasta um nó no mapa está montando
             um arranjo, não empurrando um brinquedo: o certo é ele obedecer.

             Um clique sem arrasto não prega nada — senão abrir um resumo
             deixaria um pino para trás sem ninguém ter pedido.

             Quem desfaz é o botão "Soltar nós", e NÃO um duplo clique no nó:
             duplo clique dispara dois `click` antes do `dblclick`, e o `click`
             aqui navega para o resumo. O gesto abriria a página duas vezes
             antes de chegar a soltar coisa alguma. */
          if (arrastou) {
            pregados.current.add(d.id)
            marcarPino(this, d, true)
            setTemPino(true)
          }
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
        transformAtual.current = event.transform
        // só gesto do aluno conta; `zoom.transform` chamado por nós vem sem
        // `sourceEvent` e não deve tirar o enquadramento automático do mapa
        if (event.sourceEvent) mexeuNoZoom.current = true
        palco.attr('transform', event.transform.toString())
        // rótulo some quando o mapa está longe: senão vira um borrão de texto
        const k = event.transform.k
        rotuloSel.attr('opacity', k < 0.55 ? 0 : Math.min(1, (k - 0.55) / 0.35))
      })

    svg.call(comportamentoZoom).on('dblclick.zoom', null)

    /* Repõe a moldura de antes da remontagem. Sem isto, expandir um ramo
       devolvia o palco à escala 1 na origem: as posições dos nós sobrevivem em
       `posicoes`, mas o `<g>` que carrega a transformação é recriado a cada
       passada do efeito. */
    if (transformAtual.current) {
      svg.call(comportamentoZoom.transform, transformAtual.current)
    }

    // ---------- responder ao tamanho da janela ----------
    /* O observador era uma fonte de tremor por conta própria, por dois
       motivos que se somavam:

       1. `observe()` dispara uma notificação IMEDIATA, com o tamanho atual.
          A simulação levava um `alpha(0.3)` na cara logo ao montar, por nada.
       2. No celular, a barra do navegador entra e sai da tela conforme a
          rolagem, e cada aparição mudava a altura em alguns pixels. O mapa
          reaquecia a cada roçada de dedo.

       Agora: mudanças pequenas não contam, e o reaquecimento é fraco (0.12) —
       o bastante para reacomodar as âncoras novas, não para redesenhar o mapa.

       A primeira notificação deixou de ser descartada em bloco: agora ela sai
       cedo quando o tamanho é o MESMO que o efeito já tinha lido — que é o caso
       normal e o motivo do descarte original — e é adotada quando difere. O
       descarte cego apostava que a medida do efeito estivesse sempre certa; se
       o contêiner ainda não tiver altura naquele instante, as âncoras ficam
       calculadas para uma caixa que não é a da tela e ninguém corrige depois. */
    let larguraVista = width
    let alturaVista = height
    let primeiraMedicao = true

    /* `forceX`/`forceY` leem o acessador uma vez, no `initialize()`, e guardam
       o alvo de cada nó. Trocar só o alpha deixaria as âncoras apontando para o
       centro da janela ANTIGA — por isso a força inteira é reinstalada. */
    function reancorar() {
      sim.force(
        'x',
        forceX<NoSim>((d) => alvo(d).x).strength((d) => (d.tipo === 'materia' ? 0.25 : 0.2))
      )
      sim.force(
        'y',
        forceY<NoSim>((d) => alvo(d).y).strength((d) => (d.tipo === 'materia' ? 0.25 : 0.2))
      )
    }

    const observer = new ResizeObserver(() => {
      const l = svgEl.clientWidth || larguraVista
      const a = svgEl.clientHeight || alturaVista

      const primeira = primeiraMedicao
      primeiraMedicao = false

      if (!primeira && Math.abs(l - larguraVista) < 24 && Math.abs(a - alturaVista) < 24) return

      larguraVista = l
      alturaVista = a
      if (l === width && a === height) return

      width = l
      height = a
      reancorar()

      /* Reaquece SEMPRE que o tamanho mudou de verdade, inclusive na primeira
         medida. Não reaquecer ali era apostar que a simulação ainda estivesse
         quente quando o observador chegasse — e quando ela já esfriou, as
         âncoras novas ficam instaladas sem ninguém para puxar os nós até elas.
         O caso que este `return` acima protege (reaquecer à toa) já está
         coberto: tamanho igual sai antes de chegar aqui. */
      sim.alpha(primeira ? 0.3 : 0.12).restart()
    })
    observer.observe(svgEl)

    /**
     * Enquadra o desenho inteiro na moldura.
     *
     * As forças resolvem o desenho no desktop, mas há um limite que nenhuma
     * afinação vence: 35 nós com rótulo ocupam uns 840x680, e a tela de um
     * celular tem 380px de largura. Medido — apertar as forças até caber ali
     * empilharia os nós uns sobre os outros, trocando um problema por outro.
     *
     * Então quem resolve o celular é o ZOOM, não a física: mede-se onde os nós
     * pararam e ajusta-se a escala para que caibam. É também o que "Centralizar"
     * deveria ter feito desde sempre — ele voltava para `zoomIdentity`, que é
     * escala 1 na origem, e portanto não centralizava nada se o desenho tivesse
     * se acomodado longe do canto superior esquerdo.
     */
    function enquadrar(duracao: number) {
      const comPosicao = simNodes.filter((n) => n.x != null && n.y != null)
      if (comPosicao.length === 0) return

      /* Mede na hora, em vez de usar o `width`/`height` do início do efeito:
         enquadrar é a última coisa a rodar e não custa nada ler o tamanho de
         agora, o que torna o resultado imune a qualquer defasagem entre as
         variáveis e a tela. O `alvo()` das forças continua lendo as variáveis,
         que o observador mantém em dia. */
      // `svgRef.current` e não `svgEl`: declaração de função é içada, e o
      // TypeScript descarta ali o estreitamento feito na guarda do efeito
      const larguraAgora = svgRef.current?.clientWidth || width
      const alturaAgora = svgRef.current?.clientHeight || height

      const margem = 48
      // um raio por EIXO: o rótulo estoura a moldura de lado, não por cima
      const x1 = Math.min(...comPosicao.map((n) => n.x! - raioX(n)))
      const x2 = Math.max(...comPosicao.map((n) => n.x! + raioX(n)))
      const y1 = Math.min(...comPosicao.map((n) => n.y! - raioY(n)))
      const y2 = Math.max(...comPosicao.map((n) => n.y! + raioY(n)))

      const larg = Math.max(1, x2 - x1)
      const alt = Math.max(1, y2 - y1)

      /* A faixa de cima é do painel de busca e dos chips de matéria, que
         flutuam por cima do mapa. Centrar na altura CHEIA punha o desenho
         debaixo deles — com as onze matérias fechadas, quatro bolhas nasciam
         atrás dos chips. A área útil começa abaixo do painel. */
      /* Reserva da faixa do painel: 12px do `top-3`, a linha do campo de
         busca, e os chips de matéria — que com onze matérias quebram em DUAS
         linhas na maioria das larguras. Medido na tela: o painel termina por
         volta de 116px, e a folga leva o primeiro nó para longe da borda dele
         em vez de encostado. */
      const topo = 150
      const util = Math.max(120, alturaAgora - topo)

      // nunca AMPLIA além de 1: um mapa de três nós não deve aparecer gigante
      const escala = Math.min(1, (larguraAgora - margem * 2) / larg, (util - margem * 2) / alt)

      const transform = zoomIdentity
        .translate(larguraAgora / 2, topo + util / 2)
        .scale(escala)
        .translate(-(x1 + x2) / 2, -(y1 + y2) / 2)

      svg.transition().duration(duracao).call(comportamentoZoom.transform, transform)
    }

    /* Enquadra sozinho quando a simulação assenta pela primeira vez. Só a
       primeira: depois disso o enquadramento é do autor — ele deu zoom onde
       queria olhar, e reenquadrar a cada expansão desfaria isso na cara dele. */

    /* Saídas imperativas para os botões do canto. O padrão já existia para o
       "Centralizar": o d3 vive dentro deste efeito e o botão vive no JSX, e
       pendurar a função no próprio elemento evita subir a simulação inteira
       para o estado do React só para dois cliques. */
    type ComAtalhos = SVGSVGElement & { __reset?: () => void; __soltarPinos?: () => void }
    ;(svgEl as ComAtalhos).__reset = () => enquadrar(semMovimento ? 0 : 400)
    ;(svgEl as ComAtalhos).__soltarPinos = () => {
      pregados.current.clear()
      noSel.each(function (d) {
        d.fx = null
        d.fy = null
        marcarPino(this, d, false)
      })
      sim.alpha(0.3).restart()
    }

    /* Com `prefers-reduced-motion` a simulação nunca dispara `end`: ela é
       parada e adiantada à mão, 300 ticks acima. Então o enquadramento da
       primeira vez precisa ser pedido aqui — e daqui, não lá em cima, porque
       `enquadrar` depende do `comportamentoZoom`, que só existe a esta altura
       do efeito. */
    if (semMovimento && !mexeuNoZoom.current && !jaEnquadrou) {
      jaEnquadrou = true
      enquadrar(0)
    }

    return () => {
      observer.disconnect()
      sim.stop()
    }
  }, [
    nos,
    links,
    materias,
    router,
    expandidos,
    visiveis,
    buscando,
    casados,
    filhosDe,
    porId,
    alternar,
    contarFilhos,
    materiasAtivas,
  ])

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
        <button
          type="button"
          onClick={() => (algumAberto ? fecharTudo() : abrirTudo())}
          className="text-[11.5px] bg-[var(--raised)]/90 backdrop-blur border border-[var(--line-forte)] rounded-lg px-2.5 py-1.5 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
        >
          {algumAberto ? 'Recolher tudo' : 'Expandir tudo'}
        </button>
        {/* Só aparece quando há o que soltar: um botão permanentemente inútil
            ensinaria menos do que este, que surge no instante em que o autor
            prende o primeiro nó e explica sozinho o que aconteceu. */}
        {temPino ? (
          <button
            type="button"
            onClick={() => {
              ;(
                svgRef.current as (SVGSVGElement & { __soltarPinos?: () => void }) | null
              )?.__soltarPinos?.()
              setTemPino(false)
            }}
            className="text-[11.5px] bg-[var(--raised)]/90 backdrop-blur border border-[var(--line-forte)] rounded-lg px-2.5 py-1.5 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            Soltar nós
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

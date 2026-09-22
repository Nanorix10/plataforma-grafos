'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { CONTEXTO_DO_GRIFO, MAXIMO_DO_GRIFO, type Grifo } from '@/lib/grifos-tipo'
import { criarGrifo, salvarNota, tirarGrifo } from '../acoes-grifos'

/**
 * Grifar e anotar o resumo.
 *
 * **O HTML do resumo nunca é tocado.** A pintura usa a CSS Custom Highlight
 * API: o navegador recebe uma lista de `Range` e pinta por cima, sem criar um
 * `<mark>` sequer. O corpo é HTML cru injetado (`dangerouslySetInnerHTML`), com
 * fórmula do KaTeX, wikilink e a lupa das figuras pendurados nele — embrulhar
 * trecho em elemento novo partiria nó de texto que outros componentes contam
 * (o trilho acha os links pela POSIÇÃO, decisão 12d).
 *
 * O preço: Safari antes do 17.2 e Firefox antes do 140 não pintam. Nesses o
 * grifo continua sendo gravado e aparece na lista do fim, que é a metade que
 * guarda a nota — a pintura é a metade que falta, e a lista avisa.
 *
 * **A âncora é o trecho, não a posição** — ver a migration `grifos`. Quem
 * procura o trecho no texto é `ancorar`, a cada vez que a lista muda.
 */
export default function Grifos({
  resumoId,
  iniciais,
  seletor,
}: {
  resumoId: string
  iniciais: Grifo[]
  seletor: string
}) {
  const [grifos, setGrifos] = useState(iniciais)
  const [barra, setBarra] = useState<{ top: number; left: number; embaixo: boolean } | null>(null)
  const [balao, setBalao] = useState<{ id: string; top: number; left: number; rascunho: string } | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  // As âncoras dependem do DOM, que o React não conhece: é estado de fora, e
  // entra pelo mesmo caminho do tema e da barra lateral (decisões 4b e 18).
  const [loja] = useState(criarLoja)
  const ancoras = useSyncExternalStore(loja.assinar, loja.ler, lerNoServidor)
  const pinta = useSyncExternalStore(nuncaMuda, temPintura, pintaNoServidor)

  // O que os ouvintes do DOM precisam ler sem se reinscrever a cada render.
  const grifosRef = useRef(grifos)
  const selecaoRef = useRef<{ trecho: Omit<Grifo, 'id' | 'nota'>; caixa: DOMRect } | null>(null)
  // Grifo recém-criado tem id provisório até o banco responder; quem tentar
  // salvar nota ou tirar o grifo nesse meio-tempo espera pelo id de verdade.
  const pendentes = useRef(new Map<string, Promise<string | null>>())

  const ativo = balao?.id ?? null

  useEffect(() => {
    grifosRef.current = grifos
    const conteudo = document.querySelector(seletor)
    if (!conteudo) return
    loja.trocar(ancorar(conteudo, grifos, ativo))
  }, [grifos, ativo, seletor, loja])

  // Ao sair do resumo, os nomes de grifo não podem continuar pintando: a
  // navegação do Next troca o corpo sem recarregar a página.
  useEffect(() => () => apagarPintura(), [])

  // Seleção → barra "Grifar / Anotar".
  useEffect(() => {
    const conteudo = document.querySelector(seletor)
    if (!conteudo) return
    let espera: ReturnType<typeof setTimeout> | undefined

    function aoMudar() {
      clearTimeout(espera)
      // Espera a seleção assentar: no celular ela muda a cada quadro enquanto
      // o dedo arrasta as alças.
      espera = setTimeout(() => {
        const r = selecaoDentro(conteudo!)
        if (!r) {
          setBarra(null)
          return
        }
        // Guardada AGORA, e não no clique do botão: no celular, tocar no botão
        // pode desfazer a seleção antes de o clique chegar.
        const caixa = r.getBoundingClientRect()
        selecaoRef.current = { trecho: capturar(conteudo!, r), caixa }
        const embaixo = caixa.top < 110 // a barra do caminho é fixa no topo
        setBarra({
          top: window.scrollY + (embaixo ? caixa.bottom + 8 : caixa.top - 8),
          left: Math.min(
            window.innerWidth - 100,
            Math.max(100, caixa.left + caixa.width / 2)
          ) + window.scrollX,
          embaixo,
        })
      }, 150)
    }

    document.addEventListener('selectionchange', aoMudar)
    return () => {
      clearTimeout(espera)
      document.removeEventListener('selectionchange', aoMudar)
    }
  }, [seletor])

  // Clique num trecho grifado → balão da nota.
  useEffect(() => {
    const conteudo = document.querySelector(seletor)
    if (!conteudo) return

    function aoClicar(e: Event) {
      const { clientX, clientY, target } = e as MouseEvent
      // Link, figura e a gaveta da resolução têm clique próprio.
      if ((target as Element).closest('a, summary, figure, button')) return
      if (!window.getSelection()?.isCollapsed) return
      const mapa = loja.ler()
      if (!mapa) return
      for (const g of grifosRef.current) {
        const range = mapa.get(g.id)
        if (!range) continue
        const dentro = [...range.getClientRects()].some(
          (c) => clientX >= c.left && clientX <= c.right && clientY >= c.top && clientY <= c.bottom
        )
        if (dentro) {
          abrir(g, range.getBoundingClientRect())
          return
        }
      }
    }

    conteudo.addEventListener('click', aoClicar)
    return () => conteudo.removeEventListener('click', aoClicar)
  }, [seletor, loja])

  // Fora do balão fecha (e guarda o que foi escrito); Esc também.
  useEffect(() => {
    if (!balao) return
    function fora(e: PointerEvent) {
      if (!(e.target as Element).closest('.balao-grifo')) fechar()
    }
    function tecla(e: KeyboardEvent) {
      if (e.key === 'Escape') fechar()
    }
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', tecla)
    }
  })

  function abrir(g: Grifo, caixa: DOMRect) {
    setBarra(null)
    setBalao({
      id: g.id,
      top: window.scrollY + caixa.bottom + 8,
      left: Math.max(16, Math.min(window.innerWidth - 16 - 320, caixa.left)) + window.scrollX,
      rascunho: g.nota,
    })
  }

  /** Fechar GUARDA. Uma nota perdida por um clique fora é o pior erro desta tela. */
  function fechar() {
    if (!balao) return
    const g = grifos.find((x) => x.id === balao.id)
    setBalao(null)
    if (g && balao.rascunho.trim() !== g.nota) {
      const nota = balao.rascunho.trim()
      setGrifos((gs) => gs.map((x) => (x.id === g.id ? { ...x, nota } : x)))
      void idDe(g.id).then(async (id) => {
        if (!id || !(await salvarNota(id, nota))) {
          setErro('Não deu para salvar a nota. Ela está na tela, mas não foi gravada — tente de novo.')
        }
      })
    }
  }

  function idDe(id: string) {
    return pendentes.current.get(id) ?? Promise.resolve(id)
  }

  function grifar(comNota: boolean) {
    const guardada = selecaoRef.current
    if (!guardada) return
    const s = guardada.trecho
    if (s.exato.length > MAXIMO_DO_GRIFO) {
      setErro(`Trecho longo demais para um grifo — o limite é de ${MAXIMO_DO_GRIFO} letras.`)
      setBarra(null)
      return
    }
    const provisorio = `novo-${Date.now()}`
    const novo: Grifo = { id: provisorio, ...s, nota: '' }
    window.getSelection()?.removeAllRanges()
    selecaoRef.current = null
    setBarra(null)
    setErro(null)
    setGrifos((gs) => [...gs, novo])

    const pedido = criarGrifo({ resumoId, ...s, nota: '' }).then((id) => {
      pendentes.current.delete(provisorio)
      if (id) {
        setGrifos((gs) => gs.map((g) => (g.id === provisorio ? { ...g, id } : g)))
        setBalao((b) => (b && b.id === provisorio ? { ...b, id } : b))
      } else {
        setGrifos((gs) => gs.filter((g) => g.id !== provisorio))
        setBalao((b) => (b && b.id === provisorio ? null : b))
        setErro('Não deu para salvar o grifo. Tente de novo.')
      }
      return id
    })
    pendentes.current.set(provisorio, pedido)

    if (comNota) abrir(novo, guardada.caixa)
  }

  function tirar() {
    if (!balao) return
    const g = grifos.find((x) => x.id === balao.id)
    setBalao(null)
    if (!g) return
    setGrifos((gs) => gs.filter((x) => x.id !== g.id))
    void idDe(g.id).then(async (id) => {
      if (id && !(await tirarGrifo(id))) {
        setGrifos((gs) => [...gs, g])
        setErro('Não deu para tirar o grifo. Tente de novo.')
      }
    })
  }

  function irAte(g: Grifo, botao: HTMLElement) {
    const range = ancoras?.get(g.id)
    if (!range) {
      abrir(g, botao.getBoundingClientRect())
      return
    }
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alvo = range.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3
    window.scrollTo({ top: alvo, behavior: calmo ? 'auto' : 'smooth' })
    setTimeout(() => abrir(g, range.getBoundingClientRect()), calmo ? 0 : 400)
  }

  const noBalao = balao ? grifos.find((g) => g.id === balao.id) : undefined

  return (
    <>
      {grifos.length > 0 || erro ? (
        <section className="mt-16 pt-7 border-t border-[var(--line)]" aria-labelledby="titulo-grifos">
          <h2
            id="titulo-grifos"
            className="text-[length:var(--t-mini)] font-medium text-[var(--ink-faint)] uppercase tracking-[0.04em] mb-4"
          >
            Seus grifos neste resumo
          </h2>

          <p aria-live="polite" className="text-[length:var(--t-peq)] text-[var(--erro)] empty:hidden mb-3">
            {erro}
          </p>

          {!pinta && grifos.length > 0 ? (
            <p className="text-[length:var(--t-peq)] text-[var(--ink-faint)] mb-3">
              Este navegador não pinta os grifos no texto. Eles ficam guardados aqui.
            </p>
          ) : null}

          <ol className="flex flex-col gap-1">
            {grifos.map((g) => {
              // `ancoras` nulo = ainda não procurou (no servidor, e no primeiro
              // quadro do cliente). Só depois de procurar é que dá para dizer
              // que o trecho sumiu.
              const orfao = ancoras !== null && !ancoras.has(g.id)
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={(e) => irAte(g, e.currentTarget)}
                    className="block w-full text-left rounded-lg px-3 py-2 -mx-3 hover:bg-[var(--acento-fraco)] focus-visible:outline-2 focus-visible:outline-[var(--acento)]"
                  >
                    <span className="block font-[family-name:var(--fonte-resumo)] text-[length:var(--t-peq)] leading-relaxed text-[var(--ink-soft)]">
                      “
                      <span
                        className={
                          orfao
                            ? 'line-through decoration-[var(--ink-faint)]'
                            : 'bg-[var(--grifo)] rounded-[2px] px-[0.1em]'
                        }
                      >
                        {g.exato}
                      </span>
                      ”
                    </span>
                    {g.nota ? (
                      <span className="block mt-1 text-[length:var(--t-peq)] text-[var(--ink-dim)] whitespace-pre-line">
                        {g.nota}
                      </span>
                    ) : null}
                    {orfao ? (
                      <span className="block mt-1 text-[length:var(--t-mini)] text-[var(--ink-faint)]">
                        O autor reescreveu este trecho. A sua nota continua aqui.
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      ) : null}

      {barra
        ? createPortal(
            <div
              className="barra-grifo"
              data-embaixo={barra.embaixo ? 'sim' : undefined}
              style={{ top: barra.top, left: barra.left }}
            >
              {/* `preventDefault` no mousedown: sem ele, o clique no botão
                  desfaz a seleção no computador antes de o botão agir. */}
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => grifar(false)}>
                Grifar
              </button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => grifar(true)}>
                Anotar
              </button>
            </div>,
            document.body
          )
        : null}

      {balao && noBalao
        ? createPortal(
            <div
              className="balao-grifo"
              role="dialog"
              aria-label="Nota do grifo"
              style={{ top: balao.top, left: balao.left }}
            >
              <p className="balao-grifo-trecho">“{noBalao.exato}”</p>
              <textarea
                autoFocus
                value={balao.rascunho}
                maxLength={MAXIMO_DO_GRIFO}
                placeholder="Escreva uma nota (opcional)"
                aria-label="Nota"
                onChange={(e) => setBalao({ ...balao, rascunho: e.target.value })}
              />
              <div className="balao-grifo-acoes">
                <button type="button" onClick={tirar}>
                  Tirar grifo
                </button>
                <button type="button" data-primario="sim" onClick={fechar}>
                  Pronto
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}

// ---------------------------------------------------------------------------
// A loja das âncoras: o `Map` de id → `Range` que a última procura achou.

type Ancoras = Map<string, Range>

function criarLoja() {
  let atual: Ancoras | null = null
  const ouvintes = new Set<() => void>()
  return {
    assinar(f: () => void) {
      ouvintes.add(f)
      return () => {
        ouvintes.delete(f)
      }
    },
    ler: () => atual,
    trocar(novo: Ancoras) {
      atual = novo
      ouvintes.forEach((f) => f())
    },
  }
}

const lerNoServidor = () => null
const nuncaMuda = () => () => {}
const temPintura = () => typeof CSS !== 'undefined' && 'highlights' in CSS
// No servidor, supõe que pinta: o aviso de "não pinta" só aparece quando o
// navegador de fato disser que não.
const pintaNoServidor = () => true

// ---------------------------------------------------------------------------
// Texto e âncora.

/**
 * A distância, em letras, do começo do conteúdo até um ponto.
 *
 * `Range.toString()` junta os nós de texto na mesma ordem que o `TreeWalker`
 * de `ancorar` percorre, então os dois contam igual — inclusive o texto
 * escondido do MathML que o KaTeX deixa para leitor de tela. E funciona com o
 * ponto caindo num elemento, e não num nó de texto, o que acontece ao
 * selecionar com três cliques.
 */
function deslocamento(conteudo: Element, no: Node, off: number) {
  const r = document.createRange()
  r.setStart(conteudo, 0)
  r.setEnd(no, off)
  return r.toString().length
}

function selecaoDentro(conteudo: Element): Range | null {
  const s = window.getSelection()
  if (!s || !s.rangeCount || s.isCollapsed) return null
  const r = s.getRangeAt(0)
  if (!conteudo.contains(r.startContainer) || !conteudo.contains(r.endContainer)) return null
  if (!r.toString().trim()) return null
  return r
}

function capturar(conteudo: Element, r: Range): Omit<Grifo, 'id' | 'nota'> {
  const texto = conteudo.textContent ?? ''
  let ini = deslocamento(conteudo, r.startContainer, r.startOffset)
  let fim = deslocamento(conteudo, r.endContainer, r.endOffset)
  // O duplo clique pega o espaço seguinte; grifo com espaço sobrando nas
  // pontas não acharia o mesmo trecho numa reescrita que só mudou a vírgula.
  while (ini < fim && /\s/.test(texto[ini])) ini++
  while (fim > ini && /\s/.test(texto[fim - 1])) fim--
  return {
    exato: texto.slice(ini, fim),
    prefixo: texto.slice(Math.max(0, ini - CONTEXTO_DO_GRIFO), ini),
    sufixo: texto.slice(fim, fim + CONTEXTO_DO_GRIFO),
  }
}

/**
 * Procura cada grifo no texto e pinta os que achou.
 *
 * Trecho que aparece mais de uma vez é desempatado pelo que vem antes e
 * depois; empate completo fica com a primeira ocorrência. Trecho que não
 * aparece mais fica FORA do mapa — é assim que a lista sabe que ele é órfão.
 */
function ancorar(conteudo: Element, grifos: Grifo[], ativo: string | null): Ancoras {
  const nos: { no: Text; inicio: number }[] = []
  let texto = ''
  const andar = document.createTreeWalker(conteudo, NodeFilter.SHOW_TEXT)
  for (let n = andar.nextNode(); n; n = andar.nextNode()) {
    nos.push({ no: n as Text, inicio: texto.length })
    texto += (n as Text).data
  }

  function ponto(posicao: number, fim: boolean) {
    // No fim de um trecho, o ponto fica no nó que TERMINA ali, e não no que
    // começa — senão o grifo pintaria o nó seguinte inteiro por zero letras.
    for (let i = nos.length - 1; i >= 0; i--) {
      const { no, inicio } = nos[i]
      if (fim ? inicio < posicao : inicio <= posicao) return { no, off: posicao - inicio }
    }
    return { no: nos[0].no, off: 0 }
  }

  const mapa: Ancoras = new Map()
  for (const g of grifos) {
    let melhor = -1
    let pontos = -1
    for (let i = texto.indexOf(g.exato); i !== -1; i = texto.indexOf(g.exato, i + 1)) {
      const antes = texto.slice(Math.max(0, i - g.prefixo.length), i)
      const depois = texto.slice(i + g.exato.length, i + g.exato.length + g.sufixo.length)
      const p = (antes === g.prefixo ? 1 : 0) + (depois === g.sufixo ? 1 : 0)
      if (p > pontos) {
        melhor = i
        pontos = p
        if (p === 2) break
      }
    }
    if (melhor === -1 || !g.exato) continue
    const a = ponto(melhor, false)
    const b = ponto(melhor + g.exato.length, true)
    const r = document.createRange()
    r.setStart(a.no, a.off)
    r.setEnd(b.no, b.off)
    mapa.set(g.id, r)
  }

  pintar(grifos, mapa, ativo)
  return mapa
}

function pintar(grifos: Grifo[], mapa: Ancoras, ativo: string | null) {
  if (!temPintura()) return
  const semNota: Range[] = []
  const comNota: Range[] = []
  const aberto: Range[] = []
  for (const g of grifos) {
    const r = mapa.get(g.id)
    if (!r) continue
    ;(g.nota ? comNota : semNota).push(r)
    if (g.id === ativo) aberto.push(r)
  }
  CSS.highlights.set('grifo', new Highlight(...semNota))
  CSS.highlights.set('grifo-nota', new Highlight(...comNota))
  const destaque = new Highlight(...aberto)
  destaque.priority = 1
  CSS.highlights.set('grifo-ativo', destaque)
}

function apagarPintura() {
  if (!temPintura()) return
  CSS.highlights.delete('grifo')
  CSS.highlights.delete('grifo-nota')
  CSS.highlights.delete('grifo-ativo')
}

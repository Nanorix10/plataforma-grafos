import { casasDoPasso, compilar, formatarNumero, lerConfig, valoresIniciais, type Janela } from './modelo'
import { desenharSvg } from './desenho'

/**
 * Dá vida a um gráfico já desenhado (decisão 34): controles, ▶ animar, zoom e
 * arrastar o plano. Só roda no navegador — na página do aluno, chamado por
 * `resumos/[slug]/Graficos.tsx`, e na prévia do editor.
 *
 * O HTML chega pronto do servidor (`figura.ts`). Aqui só se REDESENHA o
 * `<svg>` de dentro, com a MESMA `desenharSvg`, agora na largura real da
 * coluna — o servidor desenhou em 640px sem saber o tamanho da tela.
 *
 * ## A rodinha e o dedo só mexem no gráfico depois de um clique
 *
 * Mesma regra do modelo 3D (decisão 28): o gráfico mora no meio de um resumo
 * comprido, e quem só está rolando o texto não pode ficar preso nele. Antes
 * do primeiro clique, a rodinha rola a página e o dedo também; depois, os dois
 * mexem no plano, até o clique sair do gráfico. O arrasto com o MOUSE vale
 * sempre — ele não disputa nada com a rolagem.
 */

const ZOOM_PASSO = 1.25

export function ativarGrafico(raiz: HTMLElement): () => void {
  const g = lerConfig(raiz.getAttribute('data-config'))
  const palco = raiz.querySelector<HTMLElement>('.grafico-palco')
  if (!g || !palco) return () => {}

  const c = compilar(g)
  const valores = valoresIniciais(g)
  const original: Janela = { ...g.janela }
  let janela: Janela = { ...g.janela }
  let ativo = false
  let quadro = 0
  const animando = new Map<string, { quadro: number; sentido: 1 | -1; antes: number }>()
  const limpezas: (() => void)[] = []

  const ouvir = <K extends keyof HTMLElementEventMap>(
    alvo: HTMLElement | Document,
    tipo: K,
    fn: (e: HTMLElementEventMap[K]) => void,
    opcoes?: AddEventListenerOptions,
  ) => {
    alvo.addEventListener(tipo, fn as EventListener, opcoes)
    limpezas.push(() => alvo.removeEventListener(tipo, fn as EventListener, opcoes))
  }

  function desenhar() {
    quadro = 0
    const largura = Math.max(120, Math.round(palco!.clientWidth))
    const altura = Math.max(120, Math.round(palco!.clientHeight))
    const modelo = document.createElement('template')
    modelo.innerHTML = desenharSvg(c, valores, janela, { largura, altura })
    const novo = modelo.content.firstElementChild
    const velho = palco!.querySelector('svg')
    if (novo && velho) velho.replaceWith(novo)
    else if (novo) palco!.prepend(novo)
  }

  function pedirDesenho() {
    if (!quadro) quadro = requestAnimationFrame(desenhar)
  }

  // o valor mostrado tem as casas do passo, mesmo no meio de uma animação
  const casas = Object.fromEntries(g.parametros.map((p) => [p.nome, casasDoPasso(p.passo)]))
  function mostrarValor(nome: string) {
    for (const out of raiz.querySelectorAll<HTMLOutputElement>('output[data-param]')) {
      if (out.dataset.param === nome) out.textContent = formatarNumero(valores[nome], casas[nome])
    }
    for (const input of raiz.querySelectorAll<HTMLInputElement>('input[data-param]')) {
      if (input.dataset.param === nome && Number(input.value) !== valores[nome]) input.value = String(valores[nome])
    }
  }

  // ---- controles deslizantes
  ouvir(raiz, 'input', (e) => {
    const input = e.target as HTMLInputElement
    const nome = input.dataset?.param
    if (!nome || !(nome in valores)) return
    valores[nome] = Number(input.value)
    pararAnimacao(nome)
    mostrarValor(nome)
    pedirDesenho()
  })

  // ---- ▶ animar: vai e volta entre o mínimo e o máximo, ~5 s por ida
  function pararAnimacao(nome: string) {
    const a = animando.get(nome)
    if (!a) return
    cancelAnimationFrame(a.quadro)
    animando.delete(nome)
    const botao = raiz.querySelector<HTMLButtonElement>(`button[data-acao="animar"][data-param="${CSS.escape(nome)}"]`)
    if (botao) {
      botao.textContent = '▶'
      botao.setAttribute('aria-pressed', 'false')
    }
  }

  function animar(nome: string, botao: HTMLButtonElement) {
    if (animando.has(nome)) return pararAnimacao(nome)
    const p = g!.parametros.find((x) => x.nome === nome)
    if (!p) return
    const estado = { quadro: 0, sentido: 1 as 1 | -1, antes: performance.now() }
    animando.set(nome, estado)
    botao.textContent = '⏸'
    botao.setAttribute('aria-pressed', 'true')
    const passo = (agora: number) => {
      const dt = Math.min(0.1, (agora - estado.antes) / 1000)
      estado.antes = agora
      let v = valores[nome] + estado.sentido * ((p.max - p.min) / 5) * dt
      if (v >= p.max) {
        v = p.max
        estado.sentido = -1
      } else if (v <= p.min) {
        v = p.min
        estado.sentido = 1
      }
      valores[nome] = v
      mostrarValor(nome)
      desenhar()
      estado.quadro = requestAnimationFrame(passo)
    }
    estado.quadro = requestAnimationFrame(passo)
  }

  // ---- zoom em torno de um ponto (o centro, ou o cursor na rodinha)
  function zoom(fator: number, fx = 0.5, fy = 0.5) {
    const cx = janela.xmin + fx * (janela.xmax - janela.xmin)
    const cy = janela.ymax - fy * (janela.ymax - janela.ymin)
    const larg = (janela.xmax - janela.xmin) * fator
    const alt = (janela.ymax - janela.ymin) * fator
    if (larg < 1e-4 || larg > 1e6 || alt < 1e-4 || alt > 1e6) return
    janela = {
      xmin: cx - fx * larg,
      xmax: cx + (1 - fx) * larg,
      ymin: cy - (1 - fy) * alt,
      ymax: cy + fy * alt,
    }
    pedirDesenho()
  }

  ouvir(raiz, 'click', (e) => {
    const botao = (e.target as Element).closest<HTMLButtonElement>('button[data-acao]')
    if (!botao || !raiz.contains(botao)) return
    const acao = botao.dataset.acao
    if (acao === 'mais') zoom(1 / ZOOM_PASSO)
    else if (acao === 'menos') zoom(ZOOM_PASSO)
    else if (acao === 'voltar') {
      janela = { ...original }
      pedirDesenho()
    } else if (acao === 'animar' && botao.dataset.param) animar(botao.dataset.param, botao)
  })

  // ---- ativar / desativar (rodinha e dedo)
  function definirAtivo(sim: boolean) {
    ativo = sim
    raiz.toggleAttribute('data-ativo', sim)
    palco!.style.touchAction = sim ? 'none' : 'pan-y'
  }
  definirAtivo(false)
  ouvir(document, 'pointerdown', (e) => {
    if (!raiz.contains(e.target as Node)) definirAtivo(false)
  })

  ouvir(
    palco,
    'wheel',
    (e) => {
      if (!ativo) return
      e.preventDefault()
      const r = palco.getBoundingClientRect()
      zoom(e.deltaY > 0 ? ZOOM_PASSO : 1 / ZOOM_PASSO, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)
    },
    // não-passivo: sem isso o `preventDefault` é ignorado e a página rola junto
    { passive: false },
  )

  // ---- arrastar o plano
  let arrasto: { id: number; x: number; y: number; j: Janela } | null = null
  ouvir(palco, 'pointerdown', (e) => {
    if ((e.target as Element).closest('button')) return
    const eraAtivo = ativo
    definirAtivo(true)
    // o primeiro toque só acorda o gráfico; arrastar com o dedo vem depois
    if (e.pointerType !== 'mouse' && !eraAtivo) return
    arrasto = { id: e.pointerId, x: e.clientX, y: e.clientY, j: { ...janela } }
    palco.setPointerCapture(e.pointerId)
    raiz.setAttribute('data-arrastando', '')
  })
  ouvir(palco, 'pointermove', (e) => {
    if (!arrasto || e.pointerId !== arrasto.id) return
    const dx = ((e.clientX - arrasto.x) / palco.clientWidth) * (arrasto.j.xmax - arrasto.j.xmin)
    const dy = ((e.clientY - arrasto.y) / palco.clientHeight) * (arrasto.j.ymax - arrasto.j.ymin)
    janela = { xmin: arrasto.j.xmin - dx, xmax: arrasto.j.xmax - dx, ymin: arrasto.j.ymin + dy, ymax: arrasto.j.ymax + dy }
    pedirDesenho()
  })
  const soltar = (e: PointerEvent) => {
    if (!arrasto || e.pointerId !== arrasto.id) return
    arrasto = null
    raiz.removeAttribute('data-arrastando')
  }
  ouvir(palco, 'pointerup', soltar)
  ouvir(palco, 'pointercancel', soltar)

  // ---- teclado: setas movem, + e − aproximam
  palco.tabIndex = 0
  palco.setAttribute('role', 'group')
  palco.setAttribute('aria-label', 'Plano do gráfico. Setas movem, + e − aproximam e afastam, 0 volta ao início.')
  ouvir(palco, 'keydown', (e) => {
    const lx = (janela.xmax - janela.xmin) * 0.1
    const ly = (janela.ymax - janela.ymin) * 0.1
    const mover = (dx: number, dy: number) => {
      janela = { xmin: janela.xmin + dx, xmax: janela.xmax + dx, ymin: janela.ymin + dy, ymax: janela.ymax + dy }
      pedirDesenho()
    }
    if (e.key === 'ArrowLeft') mover(-lx, 0)
    else if (e.key === 'ArrowRight') mover(lx, 0)
    else if (e.key === 'ArrowUp') mover(0, ly)
    else if (e.key === 'ArrowDown') mover(0, -ly)
    else if (e.key === '+' || e.key === '=') zoom(1 / ZOOM_PASSO)
    else if (e.key === '-') zoom(ZOOM_PASSO)
    else if (e.key === '0') {
      janela = { ...original }
      pedirDesenho()
    } else return
    e.preventDefault()
  })

  // ---- largura real, e de novo a cada mudança de tamanho
  let larguraAntes = 0
  const observador = new ResizeObserver(() => {
    const w = palco.clientWidth
    if (Math.abs(w - larguraAntes) < 1) return
    larguraAntes = w
    pedirDesenho()
  })
  observador.observe(palco)

  raiz.setAttribute('data-vivo', '')
  desenhar()

  return () => {
    observador.disconnect()
    for (const nome of [...animando.keys()]) pararAnimacao(nome)
    if (quadro) cancelAnimationFrame(quadro)
    for (const f of limpezas) f()
    raiz.removeAttribute('data-vivo')
  }
}

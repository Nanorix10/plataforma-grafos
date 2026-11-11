/**
 * O visualizador comum dos modelos 3D (decisão 28 do CONTEXTO.md).
 *
 * Um modelo é um .html em `public/modelos-3d/` que entra no resumo por
 * <iframe>. Antes deste arquivo, cada modelo copiava ~150 linhas de
 * encanamento — tema, giro com o mouse, laço de animação — e copiou junto o
 * bug do observador de tema que travava a aba (ver o aviso na decisão 28).
 * Agora o modelo só DESCREVE as peças dele, e tudo o que é ferramenta mora
 * aqui, igual em todos:
 *
 *   - girar arrastando (e pelo teclado), zoom por botão, voltar à vista;
 *   - "Abrir": um plano de corte tira a metade da frente das cascas
 *     (membrana, parede, carioteca) para mostrar o que há dentro;
 *   - rótulos com linha-guia, que somem quando a peça fica escondida;
 *   - clicar numa peça acende ela e abre o cartão com o que ela FAZ;
 *   - "Estruturas": a lista de peças, que também é o caminho do teclado e
 *     do leitor de tela;
 *   - "Teste-se": os nomes viram "?", o aluno tenta lembrar e revela
 *     (prática de recuperação, a mesma regra do mapa 3D da decisão 26);
 *   - tela cheia.
 *
 * O contrato do modelo:
 *
 *   criarVisualizador({
 *     titulo, dica?,
 *     variantes?: [{ id, nome }],          // ex.: Animal / Vegetal
 *     montar(THREE, varianteId) => {
 *       grupo,                              // THREE.Group com tudo
 *       raio,                               // raio que precisa caber na tela
 *       partes: [{
 *         id, nome, curto?, descricao,
 *         so?,                              // 'Só na célula vegetal', etc.
 *         casca?: true,                     // é cortada ao abrir
 *         objetos: [Object3D],              // o que pertence à peça
 *         ancoras: [Vector3],               // pontos LOCAIS para o rótulo
 *         miuda?: true,                     // não esconde as outras (ribossomos)
 *       }]
 *     }
 *   })
 */

const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.0/three.module.min.js'

/** Largura da coluna de rótulos de cada lado, quando a janela é larga. */
const COLUNA = 128
/** Abaixo disto não há colunas: o rótulo fica perto da peça. */
const LARGA = 560
/** Espaço vertical mínimo entre dois rótulos da mesma coluna. */
const PASSO = 21

const CSS = `
:root {
  --tinta: #1f2233; --tinta-fraca: #5b6078; --caixa: rgba(255,255,255,.86);
  --borda: rgba(31,34,51,.16); --acento: #6a5cc7; --acento-fundo: rgba(106,92,199,.12);
  color-scheme: light;
}
:root[data-tema='escuro'] {
  --tinta: #e6e8f2; --tinta-fraca: #a3a8c0; --caixa: rgba(30,28,40,.86);
  --borda: rgba(230,232,242,.18); --acento: #a99ef0; --acento-fundo: rgba(169,158,240,.16);
  color-scheme: dark;
}
html, body { margin: 0; height: 100%; background: transparent; overflow: hidden;
  font: 13px/1.4 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: var(--tinta); }
:fullscreen body, body:fullscreen { background: var(--caixa); }
#palco { position: relative; width: 100%; height: 100%; }
/* Sem isto, todo painel com display próprio (a lista é grid) ignora o hidden. */
[hidden] { display: none !important; }
canvas { display: block; width: 100%; height: 100%; cursor: grab; touch-action: pan-y; outline: none; }
canvas.arrastando { cursor: grabbing; }
canvas.sobre-peca { cursor: pointer; }
canvas:focus-visible { box-shadow: inset 0 0 0 2px var(--acento); border-radius: 8px; }
.painel { position: absolute; background: var(--caixa); border: 1px solid var(--borda);
  border-radius: 8px; backdrop-filter: blur(6px); }
button { font: inherit; color: var(--tinta); background: var(--caixa); border: 1px solid var(--borda);
  border-radius: 7px; padding: 5px 9px; cursor: pointer; white-space: nowrap; }
button:hover { border-color: var(--acento); }
button:focus-visible { outline: 2px solid var(--acento); outline-offset: 1px; }
button[aria-pressed='true'] { background: var(--acento-fundo); border-color: var(--acento); font-weight: 600; }
.topo { position: absolute; top: 8px; left: 8px; right: 8px; display: flex; gap: 6px;
  align-items: flex-start; justify-content: space-between; pointer-events: none; }
.topo > * { pointer-events: auto; }
.grupo-botoes { display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; }
.variantes { display: flex; gap: 0; }
.variantes button { border-radius: 0; }
.variantes button:first-child { border-radius: 7px 0 0 7px; }
.variantes button:last-child { border-radius: 0 7px 7px 0; }
.variantes button + button { margin-left: -1px; }
.so-icone .txt { display: none; }
.linhas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.linhas line { stroke: var(--tinta-fraca); stroke-width: 1; opacity: .7; }
.linhas circle { fill: var(--tinta); stroke: var(--caixa); stroke-width: 1.5; }
.rotulo { position: absolute; left: 0; top: 0; pointer-events: none; white-space: nowrap;
  font-size: 12px; font-weight: 600; padding: 1px 5px; border-radius: 5px;
  text-shadow: 0 0 3px var(--caixa), 0 0 6px var(--caixa); will-change: transform; }
.rotulo.ativo { background: var(--acento); color: #fff; text-shadow: none; }
.rotulo.pergunta { pointer-events: auto; cursor: pointer; background: var(--caixa);
  border: 1px dashed var(--acento); text-shadow: none; }
.rotulo.revelado { border: 1px solid var(--borda); background: var(--caixa); text-shadow: none; }
.cartao { left: 8px; right: 8px; bottom: 8px; padding: 9px 34px 10px 12px; max-width: 520px;
  margin: 0 auto; }
.cartao h2 { margin: 0 0 2px; font-size: 14px; }
.cartao p { margin: 0; color: var(--tinta); }
.cartao .so { display: inline-block; margin-left: 6px; font-size: 11px; font-weight: 600;
  color: var(--acento); border: 1px solid var(--acento); border-radius: 99px; padding: 0 6px;
  vertical-align: 1px; }
.cartao .fechar { position: absolute; top: 5px; right: 5px; padding: 1px 7px; }
.lista { top: 46px; right: 8px; max-height: calc(100% - 60px); overflow: auto; padding: 6px;
  display: grid; gap: 3px; min-width: 170px; }
.lista button { text-align: left; border-color: transparent; background: transparent; }
.lista button:hover, .lista button[aria-current='true'] { background: var(--acento-fundo); }
.lista small { color: var(--tinta-fraca); }
.placar { left: 50%; transform: translateX(-50%); top: 46px; padding: 5px 10px;
  display: flex; gap: 8px; align-items: center; }
.dica { left: 50%; transform: translateX(-50%); bottom: 10px; padding: 3px 9px; font-size: 12px;
  color: var(--tinta-fraca); pointer-events: none; transition: opacity .4s; }
.aviso { position: absolute; inset: 0; display: grid; place-items: center; padding: 20px;
  text-align: center; color: var(--tinta-fraca); }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
`

/* ------------------------------------------------------------------ */

export async function criarVisualizador(cfg) {
  const estilo = document.createElement('style')
  estilo.textContent = CSS
  document.head.append(estilo)
  document.title = cfg.titulo

  const palco = document.createElement('div')
  palco.id = 'palco'
  document.body.append(palco)

  const avisar = (texto) => {
    const p = document.createElement('p')
    p.className = 'aviso'
    p.textContent = texto
    palco.append(p)
  }

  /* Se o Three.js não carregar (sem internet, CDN fora do ar), a janela diz
     o porquê em vez de ficar em branco. */
  let THREE
  try {
    THREE = await import(THREE_URL)
  } catch {
    avisar('Não foi possível carregar o modelo 3D. Verifique a conexão e recarregue a página.')
    return
  }

  vigiarTema()

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    avisar('Este navegador não consegue desenhar em 3D (WebGL desligado).')
    return
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  // Recorte por material: só as cascas recebem o plano, o resto fica inteiro.
  renderer.localClippingEnabled = true
  const tela = renderer.domElement
  tela.tabIndex = 0
  tela.setAttribute('role', 'img')
  tela.setAttribute('aria-label', `${cfg.titulo}. Arraste ou use as setas para girar.`)
  palco.append(tela)

  const cena = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200)
  cena.add(new THREE.HemisphereLight(0xffffff, 0x8088a0, 1.5))
  const sol = new THREE.DirectionalLight(0xffffff, 2.0)
  sol.position.set(4, 6, 8)
  cena.add(sol)
  const contraluz = new THREE.DirectionalLight(0xffffff, 0.6)
  contraluz.position.set(-5, -2, -4)
  cena.add(contraluz)

  /* O plano de corte é FIXO no mundo, de frente para a câmera: gira-se a
     célula, não o corte. Por isso a janela aberta fica sempre virada para o
     aluno, como uma lâmina de microscópio que ele vira com a mão. Corta o
     que tem z > 0 (o lado da câmera). */
  const plano = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)

  /* ---------- DOM das ferramentas ---------- */
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('linhas')
  svg.setAttribute('aria-hidden', 'true')
  palco.append(svg)
  const camadaRotulos = document.createElement('div')
  camadaRotulos.setAttribute('aria-hidden', 'true')
  palco.append(camadaRotulos)

  const topo = el('div', 'topo')
  const esquerda = el('div', 'grupo-botoes')
  const direita = el('div', 'grupo-botoes')
  topo.append(esquerda, direita)
  palco.append(topo)

  const variantes = cfg.variantes ?? []
  let varianteAtual = variantes[0]?.id ?? null
  const botoesVariante = []
  if (variantes.length > 1) {
    const caixa = el('div', 'variantes')
    caixa.setAttribute('role', 'group')
    caixa.setAttribute('aria-label', 'Tipo')
    for (const v of variantes) {
      const b = botao(v.nome, '', () => trocarVariante(v.id))
      b.dataset.id = v.id
      botoesVariante.push(b)
      caixa.append(b)
    }
    esquerda.append(caixa)
  }

  const bLista = botao('Estruturas', '☰', () => alternarLista())
  const bRotulos = botao('Rótulos', '🏷', () => { rotulosLigados = !rotulosLigados; atualizarBotoes() })
  const bAbrir = botao('Abrir', '✂', () => { aberto = !aberto; aplicarCorte(); atualizarBotoes() })
  const bTeste = botao('Teste-se', '?', () => alternarTeste())
  const bMenos = botao('Afastar', '−', () => mudarZoom(1 / 1.2))
  const bMais = botao('Aproximar', '+', () => mudarZoom(1.2))
  const bVoltar = botao('Voltar à vista inicial', '⟲', () => vistaInicial())
  const bTela = botao('Tela cheia', '⛶', () => alternarTelaCheia())
  for (const b of [bMenos, bMais, bVoltar, bTela]) b.classList.add('so-icone')
  direita.append(bLista, bRotulos, bAbrir, bTeste, bMenos, bMais, bVoltar)
  // Tela cheia só aparece onde ela funciona: o iframe precisa de `allowfullscreen`.
  if (document.fullscreenEnabled) direita.append(bTela)

  const lista = el('div', 'painel lista')
  lista.hidden = true
  lista.setAttribute('role', 'list')
  palco.append(lista)

  const cartao = el('section', 'painel cartao')
  cartao.hidden = true
  cartao.setAttribute('aria-live', 'polite')
  palco.append(cartao)

  const placar = el('div', 'painel placar')
  placar.hidden = true
  palco.append(placar)

  const dica = el('span', 'painel dica')
  dica.textContent = cfg.dica ?? 'Arraste para girar · clique numa estrutura'
  dica.setAttribute('aria-hidden', 'true')
  palco.append(dica)

  /* ---------- Estado ---------- */
  let modelo = null // { grupo, raio, partes }
  let pecas = [] // partes enriquecidas
  let selecionada = null
  let aberto = true
  let teste = false
  let revelados = new Set()
  let largura = 1, altura = 1
  let zoom = 1
  let rotulosLigados = true
  let girandoSozinho = !matchMedia('(prefers-reduced-motion: reduce)').matches

  const ROT_INICIAL = { x: 0.32, y: -0.55 }

  /* ---------- Montar / trocar variante ---------- */
  function montar() {
    if (modelo) {
      cena.remove(modelo.grupo)
      modelo.grupo.traverse((o) => {
        o.geometry?.dispose()
        const m = o.material
        if (Array.isArray(m)) m.forEach((x) => x.dispose())
        else m?.dispose()
      })
    }
    camadaRotulos.replaceChildren()
    svg.replaceChildren()
    modelo = cfg.montar(THREE, varianteAtual)
    const rot = modelo.grupo.rotation
    rot.x = ROT_INICIAL.x
    rot.y = ROT_INICIAL.y
    cena.add(modelo.grupo)

    pecas = modelo.partes.map((p, i) => {
      const malhas = []
      for (const o of p.objetos) {
        o.traverse((m) => {
          if (!m.isMesh) return
          m.userData.parte = p.id
          malhas.push(m)
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          for (const mat of mats) {
            if (mat.userData.emissiva === undefined) mat.userData.emissiva = mat.emissive?.getHex?.() ?? 0
            if (p.casca) mat.userData.casca = true
          }
        })
      }
      const rotulo = el('span', 'rotulo')
      camadaRotulos.append(rotulo)
      rotulo.addEventListener('click', () => {
        if (teste) revelar(p.id)
      })
      const linha = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      const ponto = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      ponto.setAttribute('r', '2.6')
      svg.append(linha, ponto)
      return { ...p, numero: i + 1, malhas, rotulo, linha, ponto, ancora: null }
    })

    // Cada peça miúda (ribossomo) não esconde as outras do rótulo.
    oclusores = pecas.filter((p) => !p.miuda).flatMap((p) => p.malhas)
    clicaveis = pecas.flatMap((p) => p.malhas)

    if (selecionada && !pecas.some((p) => p.id === selecionada)) selecionada = null
    revelados = new Set([...revelados].filter((id) => pecas.some((p) => p.id === id)))
    aplicarCorte()
    aplicarDestaque()
    montarLista()
    mostrarCartao()
    atualizarPlacar()
    atualizarBotoes()
    ajustarTamanho()
    tempoOclusao = 0
  }

  function trocarVariante(id) {
    if (id === varianteAtual) return
    varianteAtual = id
    const rx = modelo.grupo.rotation.x
    const ry = modelo.grupo.rotation.y
    montar()
    // Trocar de animal para vegetal não deve desfazer o ângulo que o aluno escolheu.
    modelo.grupo.rotation.x = rx
    modelo.grupo.rotation.y = ry
  }

  /* ---------- Corte e destaque ---------- */
  function aplicarCorte() {
    modelo.grupo.traverse((m) => {
      if (!m.isMesh) return
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      for (const mat of mats) {
        if (!mat.userData.casca) continue
        mat.clippingPlanes = aberto ? [plano] : []
        mat.needsUpdate = true
      }
    })
    tempoOclusao = 0
  }

  function aplicarDestaque() {
    for (const p of pecas) {
      const acesa = p.id === selecionada
      for (const m of p.malhas) {
        const mats = Array.isArray(m.material) ? m.material : [m.material]
        for (const mat of mats) {
          if (!mat.emissive) continue
          if (acesa) mat.emissive.copy(mat.color).multiplyScalar(0.45)
          else mat.emissive.setHex(mat.userData.emissiva)
        }
      }
    }
  }

  function selecionar(id) {
    selecionada = selecionada === id ? null : id
    if (teste && id) revelar(id)
    aplicarDestaque()
    mostrarCartao()
    for (const b of lista.querySelectorAll('button')) {
      b.setAttribute('aria-current', String(b.dataset.id === selecionada))
    }
  }

  function mostrarCartao() {
    const p = pecas.find((x) => x.id === selecionada)
    if (!p) {
      cartao.hidden = true
      return
    }
    cartao.replaceChildren()
    const h = document.createElement('h2')
    h.textContent = p.nome
    if (p.so) {
      const s = el('span', 'so')
      s.textContent = p.so
      h.append(s)
    }
    const d = document.createElement('p')
    d.textContent = p.descricao
    const f = botao('Fechar', '×', () => selecionar(null))
    f.classList.add('fechar', 'so-icone')
    cartao.append(h, d, f)
    cartao.hidden = false
  }

  function montarLista() {
    lista.replaceChildren()
    for (const p of pecas) {
      const b = document.createElement('button')
      b.type = 'button'
      b.dataset.id = p.id
      b.setAttribute('role', 'listitem')
      b.textContent = p.nome
      if (p.so) {
        const s = document.createElement('small')
        s.textContent = ' · ' + p.so.toLowerCase()
        b.append(s)
      }
      b.addEventListener('click', () => selecionar(p.id))
      lista.append(b)
    }
  }

  function alternarLista(forcar) {
    lista.hidden = forcar !== undefined ? !forcar : !lista.hidden
    bLista.setAttribute('aria-pressed', String(!lista.hidden))
  }

  /* ---------- Teste-se ---------- */
  function alternarTeste() {
    teste = !teste
    revelados = new Set()
    if (teste) {
      alternarLista(false) // a lista entregaria as respostas
      selecionada = null
      aplicarDestaque()
      mostrarCartao()
    }
    atualizarPlacar()
    atualizarBotoes()
  }

  function revelar(id) {
    revelados.add(id)
    atualizarPlacar()
  }

  function atualizarPlacar() {
    placar.hidden = !teste
    if (!teste) return
    placar.replaceChildren()
    const t = document.createElement('span')
    const total = pecas.length
    t.textContent =
      revelados.size === total
        ? `Pronto: ${total} de ${total}. Recomece e tente sem olhar.`
        : `${revelados.size} de ${total} reveladas — clique num "?" depois de tentar lembrar`
    const r = botao('Recomeçar', '', () => {
      revelados = new Set()
      atualizarPlacar()
    })
    placar.append(t, r)
  }

  function atualizarBotoes() {
    bRotulos.setAttribute('aria-pressed', String(rotulosLigados || teste))
    bRotulos.disabled = teste
    bAbrir.setAttribute('aria-pressed', String(aberto))
    bAbrir.querySelector('.txt').textContent = aberto ? ' Fechar' : ' Abrir'
    bTeste.setAttribute('aria-pressed', String(teste))
    bLista.disabled = teste
    bLista.setAttribute('aria-pressed', String(!lista.hidden))
    for (const b of botoesVariante) b.setAttribute('aria-pressed', String(b.dataset.id === varianteAtual))
  }

  /* ---------- Câmera ---------- */
  function ajustarTamanho() {
    largura = palco.clientWidth || 1
    altura = palco.clientHeight || 1
    renderer.setSize(largura, altura, false)
    camera.aspect = largura / altura
    const tg = Math.tan((camera.fov * Math.PI) / 360)
    // Na janela larga, o modelo cabe ENTRE as duas colunas de rótulos.
    const util = largura >= LARGA ? largura - 2 * COLUNA : largura
    const vertical = altura - 70 // barra de cima e um respiro embaixo
    const d = (modelo.raio / tg) * Math.max(altura / Math.max(vertical, 1), altura / Math.max(util, 1)) * 1.18
    camera.position.set(0, 0, d / zoom)
    camera.updateProjectionMatrix()
    // No celular os rótulos abrem desligados: não há onde pôr catorze nomes.
    if (!jaDecidiuRotulos) rotulosLigados = largura >= LARGA
    for (const b of [bLista, bRotulos, bAbrir, bTeste]) b.classList.toggle('so-icone', largura < 470)
    atualizarBotoes()
    tempoOclusao = 0
  }
  let jaDecidiuRotulos = false
  bRotulos.addEventListener('click', () => { jaDecidiuRotulos = true })

  function mudarZoom(f) {
    zoom = Math.min(2.6, Math.max(0.6, zoom * f))
    ajustarTamanho()
  }

  function vistaInicial() {
    zoom = 1
    modelo.grupo.rotation.x = ROT_INICIAL.x
    modelo.grupo.rotation.y = ROT_INICIAL.y
    ajustarTamanho()
  }

  async function alternarTelaCheia() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { /* recusado pelo navegador: fica como está */ }
  }

  /* ---------- Gestos ---------- */
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  let oclusores = []
  let clicaveis = []
  let arrastando = false, moveu = 0, ux = 0, uy = 0

  function primeiroGesto() {
    girandoSozinho = false
    dica.style.opacity = '0'
  }

  /** Primeira peça sob o ponteiro, ignorando o que o plano de corte apagou. */
  function pecaEm(cx, cy) {
    const r = tela.getBoundingClientRect()
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    for (const hit of ray.intersectObjects(clicaveis, false)) {
      if (cortado(hit)) continue
      return hit.object.userData.parte
    }
    return null
  }

  /** O raio do Three não sabe do recorte: um ponto cortado continua "sólido" para ele. */
  function cortado(hit) {
    const mat = hit.object.material
    return !!(mat.clippingPlanes?.length && plano.distanceToPoint(hit.point) < 0)
  }

  tela.addEventListener('pointerdown', (e) => {
    arrastando = true
    moveu = 0
    ux = e.clientX
    uy = e.clientY
    tela.setPointerCapture(e.pointerId)
    tela.classList.add('arrastando')
  })
  tela.addEventListener('pointermove', (e) => {
    if (!arrastando) {
      if (e.pointerType === 'mouse') tela.classList.toggle('sobre-peca', !!pecaEm(e.clientX, e.clientY))
      return
    }
    const dx = e.clientX - ux, dy = e.clientY - uy
    moveu += Math.abs(dx) + Math.abs(dy)
    if (moveu > 4) primeiroGesto()
    girar(dx * 0.008, dy * 0.008)
    ux = e.clientX
    uy = e.clientY
  })
  function soltar(e) {
    if (!arrastando) return
    arrastando = false
    tela.classList.remove('arrastando')
    // Soltar sem ter arrastado é um clique: escolhe a peça.
    if (moveu <= 4 && e.type === 'pointerup') {
      primeiroGesto()
      // Clicar na peça acesa (ou no vazio) apaga; `selecionar` alterna sozinho.
      selecionar(pecaEm(e.clientX, e.clientY))
    }
  }
  tela.addEventListener('pointerup', soltar)
  tela.addEventListener('pointercancel', soltar)

  tela.addEventListener('keydown', (e) => {
    const passo = 0.12
    const mapa = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] }
    if (mapa[e.key]) {
      e.preventDefault()
      primeiroGesto()
      girar(...mapa[e.key])
    } else if (e.key === '+' || e.key === '=') mudarZoom(1.2)
    else if (e.key === '-') mudarZoom(1 / 1.2)
  })

  function girar(ay, ax) {
    const r = modelo.grupo.rotation
    r.y += ay
    // Trava o tombo em ±80°, senão a célula vira de cabeça para baixo.
    r.x = Math.max(-1.4, Math.min(1.4, r.x + ax))
  }

  /* ---------- Rótulos ----------
     A escolha da âncora (qual ponto de cada peça está à vista) custa raios, e
     é refeita só a cada poucos quadros. O desenho segue a âncora em todo
     quadro. */
  let tempoOclusao = 0
  const v = new THREE.Vector3()
  const doCamera = new THREE.Vector3()

  function escolherAncoras() {
    const mundo = modelo.grupo.matrixWorld
    for (const p of pecas) {
      p.ancora = null
      // Mais perto da câmera primeiro: é a que o aluno está vendo.
      const candidatas = p.ancoras
        .map((a) => a.clone().applyMatrix4(mundo))
        .filter((a) => !(p.casca && aberto && plano.distanceToPoint(a) < -0.02))
        .sort((a, b) => b.z - a.z)
      for (const a of candidatas) {
        if (visivel(a, p.id)) {
          p.ancora = a
          break
        }
      }
    }
  }

  function visivel(ponto, id) {
    doCamera.copy(ponto).sub(camera.position)
    const dist = doCamera.length()
    ray.set(camera.position, doCamera.normalize())
    ray.far = dist - 0.12
    for (const hit of ray.intersectObjects(oclusores, false)) {
      if (cortado(hit)) continue
      ray.far = Infinity
      return hit.object.userData.parte === id
    }
    ray.far = Infinity
    return true
  }

  function desenharRotulos() {
    const larga = largura >= LARGA
    const mostrar = []
    for (const p of pecas) {
      const quer = teste || rotulosLigados || p.id === selecionada
      if (!quer || !p.ancora) {
        esconder(p)
        continue
      }
      v.copy(p.ancora).project(camera)
      if (v.z > 1) {
        esconder(p)
        continue
      }
      const sx = (v.x * 0.5 + 0.5) * largura
      const sy = (-v.y * 0.5 + 0.5) * altura
      mostrar.push({ p, sx, sy, lado: sx < largura / 2 ? -1 : 1, y: sy })
    }

    // Cada coluna é ordenada por altura e empurra os vizinhos, para não encavalar.
    const topoUtil = 50, baseUtil = altura - (cartao.hidden ? 14 : cartao.offsetHeight + 16)
    for (const lado of [-1, 1]) {
      const col = mostrar.filter((m) => m.lado === lado).sort((a, b) => a.y - b.y)
      for (let i = 0; i < col.length; i++) {
        col[i].y = Math.max(col[i].y, topoUtil, i ? col[i - 1].y + PASSO : -Infinity)
      }
      for (let i = col.length - 1; i >= 0; i--) {
        col[i].y = Math.min(col[i].y, baseUtil, i < col.length - 1 ? col[i + 1].y - PASSO : Infinity)
      }
    }

    for (const m of mostrar) {
      const { p, sx, sy, lado } = m
      const r = p.rotulo
      const revelado = !teste || revelados.has(p.id)
      // O nome inteiro só cabe na coluna com folga; na coluna do resumo (620px)
      // "Retículo endoplasmático rugoso" invadia a célula. O cartão diz o nome todo.
      const inteiro = largura >= 760
      r.textContent = revelado ? (inteiro ? p.nome : (p.curto ?? p.nome)) : `? ${p.numero}`
      r.className = 'rotulo' + (p.id === selecionada ? ' ativo' : '') +
        (teste ? (revelado ? ' revelado' : ' pergunta') : '')
      r.style.display = ''
      let x
      if (larga) {
        // Coluna fixa na borda, como numa prancha de anatomia.
        x = lado < 0 ? 8 : largura - 8
        r.style.transform = `translate(${lado < 0 ? '0' : '-100%'}, -50%) translate(${x}px, ${m.y}px)`
      } else {
        // Sem colunas: o nome fica ao lado da peça, preso dentro da janela.
        const w = r.offsetWidth
        x = sx + lado * 22
        const esq = lado < 0 ? x - w : x
        const desloc = Math.max(4, Math.min(largura - 4 - w, esq)) - esq
        x += desloc
        r.style.transform = `translate(${lado < 0 ? '-100%' : '0'}, -50%) translate(${x}px, ${m.y}px)`
      }
      const fimLinha = larga ? (lado < 0 ? 8 + r.offsetWidth + 3 : largura - 8 - r.offsetWidth - 3) : x
      p.linha.setAttribute('x1', sx)
      p.linha.setAttribute('y1', sy)
      p.linha.setAttribute('x2', fimLinha)
      p.linha.setAttribute('y2', m.y)
      p.ponto.setAttribute('cx', sx)
      p.ponto.setAttribute('cy', sy)
      p.linha.style.display = p.ponto.style.display = ''
    }
  }

  function esconder(p) {
    p.rotulo.style.display = 'none'
    p.linha.style.display = p.ponto.style.display = 'none'
  }

  /* ---------- Laço ----------
     Gira sozinho, devagar, até o primeiro gesto (rotação é o que torna um
     objeto 3D legível; depois disso o ângulo é do aluno). Só roda com o
     modelo visível: um resumo com três modelos não gasta bateria com os que
     ficaram lá em cima. */
  const relogio = new THREE.Clock()
  function quadro() {
    const dt = Math.min(relogio.getDelta(), 0.1)
    if (girandoSozinho) modelo.grupo.rotation.y += dt * 0.22
    modelo.grupo.updateMatrixWorld()
    if (tempoOclusao-- <= 0) {
      escolherAncoras()
      tempoOclusao = arrastando || girandoSozinho ? 5 : 12
    }
    renderer.render(cena, camera)
    desenharRotulos()
  }

  new ResizeObserver(() => modelo && ajustarTamanho()).observe(palco)
  new IntersectionObserver(([entrada]) => {
    if (entrada.isIntersecting) {
      relogio.getDelta()
      renderer.setAnimationLoop(quadro)
    } else renderer.setAnimationLoop(null)
  }).observe(palco)

  montar()

  /* ---------- auxiliares de DOM ---------- */
  function el(tag, classe) {
    const e = document.createElement(tag)
    e.className = classe
    return e
  }
  function botao(texto, icone, acao) {
    const b = document.createElement('button')
    b.type = 'button'
    b.title = texto
    b.setAttribute('aria-label', texto)
    if (icone) {
      const i = document.createElement('span')
      i.textContent = icone
      i.setAttribute('aria-hidden', 'true')
      b.append(i)
    }
    const t = el('span', 'txt')
    t.textContent = (icone ? ' ' : '') + texto
    b.append(t)
    b.addEventListener('click', acao)
    return b
  }
}

/* ------------------------------------------------------------------ */

/**
 * Tema: dentro do site o iframe tem a mesma origem da página, então lê o
 * `data-tema` que o botão de tema grava no <html> de lá. Aberto sozinho,
 * segue o aparelho.
 *
 * As DUAS travas abaixo são a correção do bug que travava a aba (decisão 28):
 * fora de um iframe, `parent` é a própria janela, e observar o pai seria
 * observar o mesmo <html> em que `aplicar` escreve — e escrever o mesmo valor
 * ainda conta como mutação. Laço sem fim.
 */
function vigiarTema() {
  const mq = matchMedia('(prefers-color-scheme: dark)')
  const dentro = parent !== window
  function aplicar() {
    let tema = null
    if (dentro) try { tema = parent.document.documentElement.dataset.tema } catch { /* outra origem */ }
    if (tema !== 'claro' && tema !== 'escuro') tema = mq.matches ? 'escuro' : 'claro'
    if (document.documentElement.dataset.tema !== tema) document.documentElement.dataset.tema = tema
  }
  aplicar()
  mq.addEventListener('change', aplicar)
  if (dentro) try {
    new MutationObserver(aplicar).observe(parent.document.documentElement, {
      attributes: true,
      attributeFilter: ['data-tema'],
    })
  } catch { /* sem acesso ao pai: fica só o aparelho */ }
}

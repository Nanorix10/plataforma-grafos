/**
 * O visualizador comum dos modelos 3D (decisão 28 do CONTEXTO.md).
 *
 * Um modelo é um .html em `public/modelos-3d/` que entra no resumo por
 * <iframe>. O modelo só DESCREVE as peças; tudo o que é ferramenta mora aqui,
 * igual em todos:
 *
 *   - girar arrastando (e pelo teclado), zoom por botão, voltar à vista;
 *   - "Abrir": um corte em CUNHA, fixo no mundo e virado para o aluno, tira
 *     um quarto da célula e mostra o interior de tudo o que atravessa;
 *   - pinos em cada estrutura (nome ao passar o mouse), que somem quando ela fica escondida;
 *   - clicar numa peça acende ela e abre o cartão com o que ela FAZ;
 *   - "Estruturas": a lista de peças (caminho do teclado e do leitor de tela);
 *   - "Teste-se": os nomes viram "?", o aluno lembra e revela;
 *   - variantes (Animal / Vegetal) e tela cheia.
 *
 * Duas formas de dar as peças:
 *
 *   1. ARQUIVO (o caminho de qualidade): `arquivo(variante)` devolve a URL de
 *      um .glb exportado do Blender. Cada malha traz em `extras.parte` o id da
 *      estrutura; `partes` dá nome e texto de cada id. Uma parte listada que
 *      não existe no arquivo da variante simplesmente não aparece.
 *
 *   2. CÓDIGO: `montar(THREE, variante)` devolve { grupo, raio, partes } com
 *      os objetos já montados (era o caminho da primeira Célula).
 *
 * A página que usa este arquivo precisa de um <script type="importmap"> que
 * diga onde estão `three`, `three/addons/` e `three-mesh-bvh` — o GLTFLoader
 * importa `three` pelo nome, e os dois têm de ser o MESMO módulo.
 */

const DRACO = 'https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/libs/draco/gltf/'


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
button:disabled { opacity: .45; cursor: default; }
.topo { position: absolute; top: 8px; left: 8px; right: 8px; display: flex; gap: 6px;
  align-items: flex-start; justify-content: space-between; pointer-events: none; }
.topo > * { pointer-events: auto; }
.grupo-botoes { display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; }
.variantes { display: flex; gap: 0; }
.variantes button { border-radius: 0; }
.variantes button:first-child { border-radius: 7px 0 0 7px; }
.variantes button:last-child { border-radius: 0 7px 7px 0; }
.variantes button + button { margin-left: -1px; }
/* Com 4 vistas (célula + lupas), a fileira não cabia num celular de 375px. */
@media (max-width: 480px) { .variantes button { padding: 5px 6px; font-size: 12px; } }
.so-icone .txt { display: none; }
/* O pino: área de toque de 24px (dedo), com o ponto de 11px no meio. */
.pino { position: absolute; left: 0; top: 0; width: 24px; height: 24px; padding: 0; margin: 0;
  border: 0; border-radius: 50%; background: transparent; cursor: pointer; will-change: transform; }
.pino::after { content: ''; position: absolute; inset: 6.5px; border-radius: 50%;
  background: #fff; border: 2.5px solid var(--acento); box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0,0,0,.45); transition: transform .12s; }
.pino:hover::after, .pino.ativo::after { transform: scale(1.35); }
.pino.ativo::after { background: var(--acento); border-color: #fff; }
.pino:focus-visible { outline: 2px solid var(--acento); outline-offset: 0; }
/* Teste-se: o pino ainda não revelado é uma pergunta. */
.pino.pergunta::after { content: '?'; inset: 3px; display: grid; place-items: center;
  font: 700 11px/1 system-ui, sans-serif; color: var(--acento); border-style: dashed; }
.pino.revelado::after { background: var(--tinta-fraca); border-color: #fff; }
.rotulo { position: absolute; left: 0; top: 0; pointer-events: none; white-space: nowrap;
  font-size: 12px; font-weight: 600; padding: 2px 7px; border-radius: 6px;
  background: var(--caixa); border: 1px solid var(--borda);
  box-shadow: 0 2px 8px rgba(0,0,0,.25); will-change: transform; }
.rotulo.ativo { background: var(--acento); border-color: var(--acento); color: #fff; }
.cartao { left: 8px; right: 8px; bottom: 8px; padding: 9px 34px 10px 12px; max-width: 520px;
  margin: 0 auto; }
.cartao h2 { margin: 0 0 2px; font-size: 14px; }
.cartao p { margin: 0; color: var(--tinta); }
.cartao .so { display: inline-block; margin-left: 6px; font-size: 11px; font-weight: 600;
  color: var(--acento); border: 1px solid var(--acento); border-radius: 99px; padding: 0 6px;
  vertical-align: 1px; }
.cartao .fechar { position: absolute; top: 5px; right: 5px; padding: 1px 7px; }
.cartao.editor { max-height: calc(100% - 60px); overflow: auto; }
.cartao.editor label { display: grid; gap: 2px; margin-top: 6px; font-size: 12px; color: var(--tinta-fraca); }
.cartao.editor input, .cartao.editor textarea { font: inherit; font-size: 13px; color: var(--tinta);
  background: transparent; border: 1px solid var(--borda); border-radius: 6px; padding: 4px 6px; resize: vertical; }
.cartao.editor input:focus-visible, .cartao.editor textarea:focus-visible { outline: 2px solid var(--acento); }
.cartao.editor .status { margin-top: 6px; font-size: 12px; color: var(--acento); }
.cartao.editor .acoes { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
.cartao.editor.compacto { display: flex; gap: 8px; align-items: center; padding: 6px 10px; }
.cartao.editor.compacto .status { margin: 0; flex: 1; }
.cartao.editor .principal { background: var(--acento); color: #fff; border-color: var(--acento); }
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
  text-align: center; color: var(--tinta-fraca); margin: 0; }
.carregando { position: absolute; inset: 0; display: grid; place-items: center; color: var(--tinta-fraca);
  pointer-events: none; }
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
  let THREE, GLTFLoader, DRACOLoader, RoomEnvironment, bvh
  try {
    THREE = await import('three')
    if (cfg.arquivo) {
      ;[{ GLTFLoader }, { DRACOLoader }, { RoomEnvironment }, bvh] = await Promise.all([
        import('three/addons/loaders/GLTFLoader.js'),
        import('three/addons/loaders/DRACOLoader.js'),
        import('three/addons/environments/RoomEnvironment.js'),
        import('three-mesh-bvh'),
      ])
      /* Malha detalhada (centenas de milhares de triângulos) e um raio por
         rótulo a cada poucos quadros: sem a árvore de caixas (BVH), cada raio
         testaria triângulo por triângulo. */
      THREE.BufferGeometry.prototype.computeBoundsTree = bvh.computeBoundsTree
      THREE.Mesh.prototype.raycast = bvh.acceleratedRaycast
    }
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
  renderer.localClippingEnabled = true
  /* Mapeamento "Neutral" (o da Khronos para materiais PBR): preserva o matiz
     e a saturação da cor do material. O AgX, que é o do Blender, aqui
     desbotava tudo para um rosa-quase-branco — testado lado a lado com a
     prévia aprovada. */
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.0
  const tela = renderer.domElement
  tela.tabIndex = 0
  tela.setAttribute('role', 'img')
  tela.setAttribute('aria-label', `${cfg.titulo}. Arraste ou use as setas para girar.`)
  palco.append(tela)

  const cena = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200)
  if (RoomEnvironment) {
    // Luz de estúdio refletida: é o que dá volume e brilho de verdade às
    // superfícies, em vez de cor chapada.
    const pmrem = new THREE.PMREMGenerator(renderer)
    cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    cena.environmentIntensity = 0.35
  }
  cena.add(new THREE.HemisphereLight(0xffffff, 0x6a7088, RoomEnvironment ? 0.55 : 1.5))
  const sol = new THREE.DirectionalLight(0xfff4ea, RoomEnvironment ? 1.9 : 2.0)
  sol.position.set(4, 6, 8)
  cena.add(sol)
  const contraluz = new THREE.DirectionalLight(0xe8ecff, 0.7)
  contraluz.position.set(-5, -2, -4)
  cena.add(contraluz)

  /* O CORTE: uma cunha de 90°, fixa no mundo, com a ponta para dentro e a
     boca virada para a câmera. Gira-se a célula, não o corte — a janela
     aberta fica sempre de frente para o aluno.

     Um ponto some quando está do lado "de fora" dos DOIS planos
     (`clipIntersection`): é isso que tira só a cunha, e não meia célula. */
  const R2 = Math.SQRT1_2
  /* Cada variante escolhe o corte em `cfg.corte`:
     - 'em-pe' (padrão) → a cunha vertical descrita acima;
     - 'nenhum'         → sem corte (a lupa da membrana já é um retalho
                          aberto); o botão Abrir some. */
  const CORTES = {
    'em-pe': [
      new THREE.Plane(new THREE.Vector3(-R2, 0, -R2), 0),
      new THREE.Plane(new THREE.Vector3(R2, 0, -R2), 0),
    ],
    nenhum: [],
  }
  const corteDe = (variante) => CORTES[cfg.corte?.[variante] ?? 'em-pe'] ?? CORTES['em-pe']
  let planos = CORTES['em-pe']
  const naCunha = (p) => planos.length > 0 && planos.every((pl) => pl.distanceToPoint(p) < 0)

  /* ---------- DOM das ferramentas ---------- */
  /* Rótulos são PINOS: um ponto liso preso em cada estrutura, sem linha nem
     coluna de nomes (com 20 estruturas, as linhas viravam uma teia por cima
     do modelo). O nome aparece só ao passar o mouse, na estrutura
     selecionada e nas reveladas do Teste-se. A camada é aria-hidden: o
     caminho acessível é a lista "Estruturas". */
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

  const carregando = el('div', 'carregando')
  carregando.textContent = 'Carregando o modelo…'
  palco.append(carregando)

  /* ---------- Estado ---------- */
  let modelo = null // { grupo, raio }
  let pecas = []
  let selecionada = null
  let aberto = true
  let teste = false
  let revelados = new Set()
  let largura = 1, altura = 1
  let zoom = 1
  // Até 6×: nas lupas, chegar numa ATP sintase pede bem mais que os 3× de antes.
  const ZOOM_MIN = 0.6, ZOOM_MAX = 6
  const desvio = new THREE.Vector2() // deslize lateral da câmera (zoom no cursor)
  let distBase = 1
  let rotulosLigados = true
  let sobrePino = null // pino sob o mouse
  let sobrePeca = null // estrutura sob o mouse, no próprio modelo
  let girandoSozinho = !matchMedia('(prefers-reduced-motion: reduce)').matches
  let oclusores = []
  let clicaveis = []
  let tempoOclusao = 0

  const ROT_INICIAL = { x: 0.38, y: 0.35 }
  const cache = new Map() // variante -> modelo já carregado

  /* ---------- Textos: fábrica + o que o admin editou ----------
     A fábrica é o que está escrito no .html do modelo. O que o admin grava
     mora na tabela `modelos3d_partes` e chega pela rota /api/modelos-3d/<id>;
     campo nulo lá = vale a fábrica. Quem lê nome/texto/selo passa SEMPRE por
     `info(id)`, nunca pelo objeto da peça: assim salvar atualiza tudo na hora. */
  const fabrica = new Map((cfg.partes ?? []).map((p) => [p.id, p]))
  const gravado = new Map()
  let podeEditar = false
  let editando = false
  let marcandoPonto = false
  let pontoNovo = null // { parte, ponto: Vector3 local | null } ainda não salvo
  // O que foi digitado e não salvo. O formulário é redesenhado ao entrar e
  // sair de "escolher ponto"; sem isto, o texto digitado sumia (achado no teste).
  let rascunho = null // { parte, nome, curto, so, descricao }

  function info(id) {
    const f = fabrica.get(id) ?? {}
    const g = gravado.get(id) ?? {}
    return {
      nome: g.nome ?? f.nome ?? id,
      curto: g.curto ?? f.curto ?? null,
      so: g.so ?? f.so ?? null,
      descricao: g.descricao ?? f.descricao ?? '',
      ancoras: g.ancoras ?? {},
    }
  }

  async function carregarTextos() {
    if (!cfg.id) return
    try {
      const r = await fetch(`/api/modelos-3d/${cfg.id}`, { credentials: 'same-origin' })
      if (!r.ok) return
      const dado = await r.json()
      podeEditar = dado.podeEditar === true
      for (const linha of dado.partes ?? []) gravado.set(linha.parte, linha)
    } catch { /* aberto fora do site, ou sem rede: fica a fábrica */ }
  }

  /* ---------- Carregar / trocar variante ---------- */
  let gltf = null
  async function obterModelo(variante) {
    if (cache.has(variante)) return cache.get(variante)
    let m
    if (cfg.arquivo) {
      if (!gltf) {
        gltf = new GLTFLoader()
        const draco = new DRACOLoader()
        draco.setDecoderPath(DRACO)
        gltf.setDRACOLoader(draco)
      }
      const dado = await gltf.loadAsync(cfg.arquivo(variante))
      m = deArquivo(dado.scene)
    } else {
      m = cfg.montar(THREE, variante)
    }
    prepararMateriais(m.grupo)
    cache.set(variante, m)
    return m
  }

  /** Agrupa as malhas do .glb pela `parte` que o Blender gravou em cada uma. */
  function deArquivo(raiz) {
    const grupo = new THREE.Group()
    grupo.add(raiz)
    // Centraliza: o meio da célula no meio da tela, qualquer que seja a origem do arquivo.
    const caixa = new THREE.Box3().setFromObject(raiz)
    const centro = caixa.getCenter(new THREE.Vector3())
    raiz.position.sub(centro)
    grupo.updateMatrixWorld(true)
    // O maior semi-eixo, e não a esfera que envolve a caixa: essa mede até o
    // canto da caixa, que a célula não tem, e deixava o modelo miúdo.
    const tam = caixa.getSize(new THREE.Vector3())
    const raio = Math.max(tam.x, tam.y, tam.z) / 2

    const porParte = new Map()
    raiz.traverse((o) => {
      if (!o.isMesh) return
      // O exportador põe os `extras` no nó; a malha às vezes é filha dele.
      let n = o, id = null
      while (n && !id) { id = n.userData?.parte; n = n.parent }
      if (!id) return
      if (!porParte.has(id)) porParte.set(id, [])
      porParte.get(id).push(o)
    })

    const partes = []
    for (const meta of cfg.partes) {
      const malhas = porParte.get(meta.id)
      if (!malhas) continue
      partes.push({ ...meta, objetos: malhas, ancoras: ancorasDa(malhas, grupo) })
    }
    return { grupo, raio, partes }
  }

  /** Pontos da superfície, espalhados, para o rótulo prender. Em coordenadas do grupo. */
  function ancorasDa(malhas, grupo) {
    const inv = new THREE.Matrix4().copy(grupo.matrixWorld).invert()
    const pts = []
    const v = new THREE.Vector3()
    for (const m of malhas) {
      const pos = m.geometry.attributes.position
      const passo = Math.max(1, Math.floor(pos.count / (28 / malhas.length)))
      for (let i = 0; i < pos.count; i += passo) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld).applyMatrix4(inv)
        pts.push(v.clone())
      }
    }
    return pts
  }

  function prepararMateriais(grupo) {
    grupo.traverse((m) => {
      if (!m.isMesh) return
      m.geometry.computeBoundsTree?.()
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      for (const mat of mats) {
        if (mat.userData.preparado) continue
        mat.userData.preparado = true
        mat.userData.emissiva = mat.emissive?.getHex?.() ?? 0
        // Os dois lados: com o corte aberto, o que se vê é o AVESSO das superfícies.
        mat.side = THREE.DoubleSide
        mat.clipIntersection = true
        if (mat.transparent) mat.depthWrite = false
        // O "sheen" (brilho de veludo) sai muito mais forte aqui que no
        // Blender: com o valor exportado, a parede virava um véu esbranquiçado.
        if (mat.sheen) mat.sheen = Math.min(mat.sheen, 0.08)
        /* O avesso sai mais escuro: é o que faz a borda cortada se ler como
           "fatia", e não como casca oca do mesmo tom. */
        mat.onBeforeCompile = (sh) => {
          sh.fragmentShader = sh.fragmentShader.replace(
            '#include <color_fragment>',
            '#include <color_fragment>\n  if (!gl_FrontFacing) diffuseColor.rgb *= 0.62;'
          )
        }
      }
    })
  }

  async function montar(variante) {
    carregando.hidden = false
    let m
    try {
      m = await obterModelo(variante)
    } catch {
      carregando.hidden = true
      avisar('Não foi possível abrir o arquivo do modelo. Recarregue a página.')
      return
    }
    carregando.hidden = true
    /* Cada variante abre no ÂNGULO DELA (`cfg.vista`): na vegetal o núcleo
       fica na borda, e o ângulo da animal o deixava inteiro dentro da cunha
       cortada. Por isso trocar de variante volta à vista dela, em vez de
       manter o giro do aluno. */
    const ini = vistaDe(variante)
    const rx = ini.x
    const ry = ini.y
    if (modelo) cena.remove(modelo.grupo)
    camadaRotulos.replaceChildren()
    modelo = m
    // Trocar de animal para vegetal não desfaz o ângulo que o aluno escolheu.
    modelo.grupo.rotation.set(rx, ry, 0)
    zoom = 1
    desvio.set(0, 0)
    cena.add(modelo.grupo)

    pecas = m.partes.map((p, i) => {
      const malhas = []
      for (const o of p.objetos) {
        o.traverse((x) => {
          if (!x.isMesh) return
          x.userData.parteId = p.id
          malhas.push(x)
          // Modelo por código: só quem é casca recebe o corte (ver `aplicarCorte`).
          if (p.casca) for (const mat of [x.material].flat()) mat.userData.casca = true
        })
      }
      const pino = document.createElement('button')
      pino.type = 'button'
      pino.className = 'pino'
      pino.tabIndex = -1 // pelo teclado, o caminho é a lista "Estruturas"
      pino.addEventListener('click', () => {
        primeiroGesto()
        // No Teste-se, clicar no "?" revela; selecionar abre o cartão.
        if (teste) revelar(p.id)
        if (selecionada !== p.id) selecionar(p.id)
      })
      pino.addEventListener('pointerenter', () => { sobrePino = p.id })
      pino.addEventListener('pointerleave', () => { if (sobrePino === p.id) sobrePino = null })
      const rotulo = el('span', 'rotulo')
      camadaRotulos.append(pino, rotulo)
      return { ...p, numero: i + 1, malhas, rotulo, pino, ancora: null }
    })

    // Peça miúda (ribossomo, citoesqueleto) não esconde as outras do rótulo.
    oclusores = pecas.filter((p) => !p.miuda).flatMap((p) => p.malhas)
    clicaveis = pecas.flatMap((p) => p.malhas)

    if (selecionada && !pecas.some((p) => p.id === selecionada)) selecionada = null
    revelados = new Set([...revelados].filter((id) => pecas.some((p) => p.id === id)))
    planos = corteDe(variante)
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
    atualizarBotoes()
    montar(id)
  }

  /* ---------- Corte e destaque ---------- */
  function aplicarCorte() {
    modelo.grupo.traverse((m) => {
      if (!m.isMesh) return
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      for (const mat of mats) {
        // No modelo por código, só as cascas são cortadas; no arquivo, tudo.
        if (!cfg.arquivo && !mat.userData.casca) continue
        mat.clippingPlanes = aberto ? planos : []
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
          else mat.emissive.setHex(mat.userData.emissiva ?? 0)
        }
      }
    }
  }

  function selecionar(id) {
    selecionada = selecionada === id ? null : id
    // Trocar de estrutura descarta o que não foi salvo da anterior.
    marcandoPonto = false
    if (rascunho?.parte !== selecionada) rascunho = null
    if (pontoNovo?.parte !== selecionada) pontoNovo = null
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
    if (editando) return formulario(p)
    const t = info(p.id)
    cartao.classList.remove('editor')
    cartao.replaceChildren()
    const h = document.createElement('h2')
    h.textContent = t.nome
    if (t.so) {
      const s = el('span', 'so')
      s.textContent = t.so
      h.append(s)
    }
    const d = document.createElement('p')
    d.textContent = t.descricao
    const f = botao('Fechar', '×', () => selecionar(null))
    f.classList.add('fechar', 'so-icone')
    cartao.append(h, d, f)
    cartao.hidden = false
  }

  /* ---------- Modo de edição (só admin) ----------
     O cartão vira formulário. "Escolher ponto" faz o PRÓXIMO clique na célula
     marcar para onde o rótulo aponta, nesta variante. Salvar grava na tabela
     pela rota; o banco confere de novo se quem grava é admin. */
  function formulario(p) {
    const t = info(p.id)
    const f0 = fabrica.get(p.id) ?? {}
    cartao.classList.add('editor')
    cartao.replaceChildren()

    // Escolhendo o ponto, o cartão encolhe: o formulário cobria a célula
    // justamente quando era preciso clicar nela.
    if (marcandoPonto) {
      cartao.classList.add('compacto')
      const m = el('p', 'status')
      m.textContent = `Clique na célula, no lugar onde o pino de "${t.nome}" deve ficar.`
      const c = botao('Cancelar', '', () => { marcandoPonto = false; formulario(p) })
      cartao.append(m, c)
      cartao.hidden = false
      return
    }
    cartao.classList.remove('compacto')

    const titulo = document.createElement('h2')
    titulo.textContent = `Editar: ${t.nome}`
    const campo = (rotulo, valor, padrao, tipo = 'input', max = 80) => {
      const l = document.createElement('label')
      const s = document.createElement('span')
      s.textContent = rotulo
      const i = document.createElement(tipo)
      i.value = valor ?? ''
      i.placeholder = padrao ?? ''
      i.maxLength = max
      if (tipo === 'textarea') i.rows = 4
      l.append(s, i)
      return { l, i }
    }
    // Preenchidos com o texto EM VIGOR: corrigir uma palavra não pode exigir
    // redigitar o parágrafo. Ao salvar, o que ficou igual à fábrica vira null.
    const r0 = rascunho?.parte === p.id ? rascunho : t
    const nome = campo('Nome', r0.nome, f0.nome)
    const curto = campo('Nome curto (rótulo em tela estreita)', r0.curto, f0.curto, 'input', 40)
    const so = campo('Selo (ex.: Só na vegetal)', r0.so, '', 'input', 40)
    const desc = campo('Texto do cartão', r0.descricao, f0.descricao, 'textarea', 1500)
    const igualFabrica = (v, f) => (v.trim() === (f ?? '').trim() ? '' : v)
    const guardarRascunho = () => {
      rascunho = { parte: p.id, nome: nome.i.value, curto: curto.i.value, so: so.i.value, descricao: desc.i.value }
    }
    for (const c of [nome, curto, so, desc]) c.i.addEventListener('input', guardarRascunho)

    const fixado = pontoNovo?.parte === p.id ? pontoNovo.ponto : t.ancoras[varianteAtual]
    const status = el('p', 'status')
    status.textContent = marcandoPonto
      ? 'Clique na célula, no lugar onde o pino deve ficar.'
      : fixado ? `Pino num lugar escolhido (${varianteAtual}).` : 'Pino em posição automática.'

    const acoes = el('div', 'acoes')
    const bPonto = botao(marcandoPonto ? 'Cancelar ponto' : 'Escolher lugar do pino', '📍', () => {
      marcandoPonto = !marcandoPonto
      formulario(p)
    })
    const bAuto = botao('Ponto automático', '', () => {
      pontoNovo = { parte: p.id, ponto: null }
      formulario(p)
    })
    const bSalvar = botao('Salvar', '', async () => {
      const anc = { ...t.ancoras }
      if (pontoNovo?.parte === p.id) {
        if (pontoNovo.ponto) anc[varianteAtual] = pontoNovo.ponto.toArray()
        else delete anc[varianteAtual]
      }
      await salvar(p.id, {
        nome: igualFabrica(nome.i.value, f0.nome),
        curto: igualFabrica(curto.i.value, f0.curto),
        so: igualFabrica(so.i.value, f0.so),
        descricao: igualFabrica(desc.i.value, f0.descricao),
        ancoras: anc,
      }, status)
    })
    const bOriginal = botao('Restaurar original', '', async () => {
      await salvar(p.id, { nome: '', curto: '', so: '', descricao: '', ancoras: {} }, status)
    })
    bSalvar.classList.add('principal')
    acoes.append(bPonto, bAuto, bSalvar, bOriginal)
    const fechar = botao('Fechar', '×', () => selecionar(null))
    fechar.classList.add('fechar', 'so-icone')
    cartao.append(titulo, nome.l, curto.l, so.l, desc.l, status, acoes, fechar)
    cartao.hidden = false
  }

  async function salvar(id, campos, status) {
    status.textContent = 'Salvando…'
    try {
      const r = await fetch(`/api/modelos-3d/${cfg.id}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parte: id, ...campos }),
      })
      const dado = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(dado.erro ?? 'erro')
      gravado.set(id, dado.parte)
      pontoNovo = null
      rascunho = null
      marcandoPonto = false
      montarLista()
      tempoOclusao = 0
      mostrarCartao()
      cartao.querySelector('.status').textContent = 'Salvo. O aluno já vê assim.'
    } catch (e) {
      status.textContent = `Não salvou: ${e.message}. Confira se você está logado como admin.`
    }
  }

  function alternarEdicao() {
    editando = !editando
    marcandoPonto = false
    pontoNovo = null
    if (editando && teste) alternarTeste()
    bEditar.setAttribute('aria-pressed', String(editando))
    mostrarCartao()
  }

  function montarLista() {
    lista.replaceChildren()
    for (const p of pecas) {
      const b = document.createElement('button')
      b.type = 'button'
      b.dataset.id = p.id
      b.setAttribute('role', 'listitem')
      const t = info(p.id)
      b.textContent = t.nome
      if (t.so) {
        const s = document.createElement('small')
        s.textContent = ' · ' + t.so.toLowerCase()
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
    if (teste && editando) alternarEdicao()
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
    // Sem corte nesta variante, o botão não tem o que fazer.
    bAbrir.hidden = planos.length === 0
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
    if (!modelo) return
    const tg = Math.tan((camera.fov * Math.PI) / 360)
    // Sem colunas de nomes, o modelo usa a largura toda.
    const util = largura
    const vertical = altura - 70 // barra de cima e um respiro embaixo
    const d = (modelo.raio / tg) * Math.max(altura / Math.max(vertical, 1), altura / Math.max(util, 1)) * 1.12
    distBase = d
    camera.position.set(desvio.x, desvio.y, d / zoom)
    camera.near = d / 50
    camera.far = d * 4
    camera.updateProjectionMatrix()
    for (const b of [bLista, bRotulos, bAbrir, bTeste]) b.classList.toggle('so-icone', largura < 470)
    atualizarBotoes()
    tempoOclusao = 0
  }

  /* Zoom em direção a um ponto da tela (`nx`, `ny` de -1 a 1; 0,0 = centro,
     que é o que os botões + e − usam).

     A câmera olha sempre reto para -z. O ponto do plano z=0 que está sob o
     cursor fica em  câmera.xy + n · dist · tg · (aspecto, 1). Para ele
     continuar sob o cursor depois do zoom, a câmera desliza (`desvio`) na
     mesma proporção em que se aproxima — é o "aproximar onde o mouse está"
     dos mapas. */
  function mudarZoom(f, nx = 0, ny = 0) {
    if (!modelo) return
    const antes = zoom
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom * f))
    if (zoom <= 1) {
      // Do tamanho inicial para trás, volta ao centro: sem modelo perdido no canto.
      desvio.set(0, 0)
    } else {
      const tg = Math.tan((camera.fov * Math.PI) / 360)
      const meia = (distBase / antes) * tg
      const px = desvio.x + nx * meia * camera.aspect
      const py = desvio.y + ny * meia
      const k = antes / zoom
      desvio.set(px - (px - desvio.x) * k, py - (py - desvio.y) * k)
      // O modelo nunca sai inteiro da tela.
      const lim = modelo.raio
      desvio.set(Math.max(-lim, Math.min(lim, desvio.x)), Math.max(-lim, Math.min(lim, desvio.y)))
    }
    ajustarTamanho()
  }

  function vistaDe(variante) {
    return cfg.vista?.[variante] ?? ROT_INICIAL
  }

  function vistaInicial() {
    zoom = 1
    desvio.set(0, 0)
    const ini = vistaDe(varianteAtual)
    modelo.grupo.rotation.set(ini.x, ini.y, 0)
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
  let arrastando = false, moveu = 0, ux = 0, uy = 0

  function primeiroGesto() {
    girandoSozinho = false
    dica.style.opacity = '0'
  }

  /** O raio do Three não sabe do corte: um ponto cortado continua "sólido" para ele. */
  function cortado(hit) {
    const mat = hit.object.material
    return !!(mat.clippingPlanes?.length && naCunha(hit.point))
  }

  /** Ponto da superfície sob o ponteiro (opaco, fora do corte), para marcar o rótulo. */
  function pontoEm(cx, cy) {
    if (!modelo) return null
    const r = tela.getBoundingClientRect()
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    for (const hit of ray.intersectObjects(clicaveis, false)) {
      if (cortado(hit) || hit.object.material.transparent) continue
      return hit.point.clone()
    }
    return null
  }

  /** Primeira peça sob o ponteiro, ignorando o que o corte apagou. */
  function pecaEm(cx, cy) {
    if (!modelo) return null
    const r = tela.getBoundingClientRect()
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    /* Translúcido (vacúolo, citoplasma, estroma) não rouba o clique de quem
       se vê ATRAVÉS dele: vale o primeiro opaco; o translúcido só ganha se
       não houver nada opaco atrás. Achado clicando no núcleo da vegetal e
       acendendo o vacúolo. */
    let translucido = null
    for (const hit of ray.intersectObjects(clicaveis, false)) {
      if (cortado(hit)) continue
      if (!hit.object.material.transparent) return hit.object.userData.parteId
      translucido ??= hit.object.userData.parteId
    }
    return translucido
  }

  tela.addEventListener('pointerdown', (e) => {
    arrastando = true
    moveu = 0
    ux = e.clientX
    uy = e.clientY
    tela.setPointerCapture(e.pointerId)
    tela.classList.add('arrastando')
  })
  let ultimoHover = 0
  tela.addEventListener('pointermove', (e) => {
    if (!arrastando) {
      // Só o mouse tem "passar por cima"; e com folga de tempo, que o raio custa.
      const agora = performance.now()
      if (e.pointerType === 'mouse' && agora - ultimoHover > 60) {
        ultimoHover = agora
        sobrePeca = pecaEm(e.clientX, e.clientY)
        tela.classList.toggle('sobre-peca', !!sobrePeca)
      }
      return
    }
    const dx = e.clientX - ux, dy = e.clientY - uy
    moveu += Math.abs(dx) + Math.abs(dy)
    if (moveu > 4) primeiroGesto()
    girar(dx * 0.008, dy * 0.008)
    ux = e.clientX
    uy = e.clientY
  })
  tela.addEventListener('pointerleave', () => {
    sobrePeca = null
    tela.classList.remove('sobre-peca')
  })
  function soltar(e) {
    if (!arrastando) return
    arrastando = false
    tela.classList.remove('arrastando')
    // Soltar sem ter arrastado é um clique: escolhe a peça.
    if (moveu <= 4 && e.type === 'pointerup') {
      primeiroGesto()
      // Modo "escolher ponto": este clique marca o rótulo, não troca de peça.
      if (marcandoPonto && selecionada) {
        const p = pontoEm(e.clientX, e.clientY)
        if (p) {
          pontoNovo = { parte: selecionada, ponto: modelo.grupo.worldToLocal(p) }
          marcandoPonto = false
          tempoOclusao = 0
          mostrarCartao()
        }
        return
      }
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

  /* ---------- Rodinha do mouse ----------
     O modelo mora num <iframe> no meio de um resumo comprido. Se a rodinha
     desse zoom sempre, quem só está rolando o texto e passa o mouse por cima
     ficaria "preso" no modelo. Então ela só dá zoom quando o aluno mostrou
     que quer mexer aqui: depois de clicar no modelo (até clicar fora dele),
     em tela cheia, ou com a página do modelo aberta sozinha. Antes disso a
     rodinha rola a página, e a dica avisa como ligar o zoom. */
  const dentroDeIframe = window.self !== window.top
  let rodinhaLigada = !dentroDeIframe
  tela.addEventListener('pointerdown', () => { rodinhaLigada = true }, true)
  // Clicar fora do iframe tira o foco desta janela: a rodinha volta a rolar a página.
  window.addEventListener('blur', () => { rodinhaLigada = !dentroDeIframe })

  const textoDica = dica.textContent
  let tempoDica = 0
  function avisarRodinha() {
    dica.textContent = 'Clique no modelo para dar zoom com a rodinha'
    dica.style.opacity = '1'
    clearTimeout(tempoDica)
    tempoDica = setTimeout(() => {
      dica.style.opacity = '0'
      setTimeout(() => { dica.textContent = textoDica }, 450)
    }, 1600)
  }

  tela.addEventListener('wheel', (e) => {
    if (!rodinhaLigada && !document.fullscreenElement) {
      avisarRodinha()
      return // sem preventDefault: a rolagem segue para a página do resumo
    }
    e.preventDefault()
    primeiroGesto()
    // deltaMode 1 = linhas (Firefox): ~16px cada. Passo suave e proporcional
    // ao giro, para o touchpad (passos miúdos) e a rodinha (passos de ~100).
    const px = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1)
    const r = tela.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1)
    mudarZoom(Math.exp(-Math.max(-300, Math.min(300, px)) * 0.0015), nx, ny)
  }, { passive: false })

  function girar(ay, ax) {
    if (!modelo) return
    const r = modelo.grupo.rotation
    r.y += ay
    // Trava o tombo em ±80°, senão a célula vira de cabeça para baixo.
    r.x = Math.max(-1.4, Math.min(1.4, r.x + ax))
  }

  /* ---------- Rótulos ----------
     A escolha da âncora (qual ponto de cada peça está à vista) custa raios, e
     é refeita só a cada poucos quadros. O desenho segue a âncora em todo
     quadro. */
  const v = new THREE.Vector3()
  const doCamera = new THREE.Vector3()

  function escolherAncoras() {
    const mundo = modelo.grupo.matrixWorld
    for (const p of pecas) {
      p.ancora = null
      /* Ponto escolhido pelo admin vem primeiro; se ele estiver escondido ou
         cortado neste ângulo, o rótulo cai no automático em vez de sumir. */
      const novo = pontoNovo?.parte === p.id ? pontoNovo.ponto : undefined
      const fixo = novo !== undefined ? novo : info(p.id).ancoras[varianteAtual]
      if (fixo) {
        const a = new THREE.Vector3().fromArray(Array.isArray(fixo) ? fixo : fixo.toArray()).applyMatrix4(mundo)
        if (!(aberto && naCunha(a)) && visivel(a, p.id, true)) {
          p.ancora = a
          continue
        }
      }
      // Mais perto da câmera primeiro: é a que o aluno está vendo.
      const candidatas = p.ancoras
        .map((a) => a.clone().applyMatrix4(mundo))
        .filter((a) => !(aberto && (cfg.arquivo || p.casca) && naCunha(a)))
        .sort((a, b) => b.z - a.z)
        .slice(0, 8)
      for (const a of candidatas) {
        if (visivel(a, p.id)) {
          p.ancora = a
          break
        }
      }
    }
  }

  /** `escolhido`: o ponto foi marcado à mão, e pode cair em OUTRA peça (o
   *  admin aponta para onde quiser) — aí basta não haver nada na frente. */
  function visivel(ponto, id, escolhido = false) {
    doCamera.copy(ponto).sub(camera.position)
    const dist = doCamera.length()
    ray.set(camera.position, doCamera.normalize())
    ray.far = dist - 0.05
    try {
      for (const hit of ray.intersectObjects(oclusores, false)) {
        if (cortado(hit)) continue
        if (hit.object.material.transparent) continue // gel translúcido não esconde
        if (escolhido) return hit.distance > dist - 0.12
        return hit.object.userData.parteId === id
      }
      return true
    } finally {
      ray.far = Infinity
    }
  }

  function desenharRotulos() {
    const curto = largura < 760 // "Retículo endoplasmático rugoso" não cabe no resumo estreito
    const realce = sobrePino ?? sobrePeca
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
      const ativo = p.id === selecionada
      const revelado = revelados.has(p.id)

      p.pino.className = 'pino' + (ativo ? ' ativo' : '') +
        (teste ? (revelado ? ' revelado' : ' pergunta') : '')
      p.pino.setAttribute('aria-label', teste && !revelado ? 'Estrutura a descobrir' : info(p.id).nome)
      p.pino.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px)`
      p.pino.style.display = ''

      // O NOME só aparece quando pedido: mouse em cima (do pino ou da
      // estrutura), selecionada, ou já revelada no Teste-se.
      const nome = teste ? revelado : ativo || realce === p.id
      if (!nome) {
        p.rotulo.style.display = 'none'
        continue
      }
      const t = info(p.id)
      const r = p.rotulo
      r.textContent = curto ? (t.curto ?? t.nome) : t.nome
      r.className = 'rotulo' + (ativo ? ' ativo' : '')
      r.style.display = ''
      // Ao lado do pino, do lado que tiver mais espaço, e sempre dentro da janela.
      const w = r.offsetWidth
      const direita = sx < largura / 2
      let x = direita ? sx + 15 : sx - 15 - w
      x = Math.max(4, Math.min(largura - 4 - w, x))
      r.style.transform = `translate(${x}px, ${sy}px) translateY(-50%)`
    }
  }

  function esconder(p) {
    p.rotulo.style.display = 'none'
    p.pino.style.display = 'none'
  }

  /* ---------- Laço ----------
     Gira sozinho, devagar, até o primeiro gesto (rotação é o que torna um
     objeto 3D legível; depois disso o ângulo é do aluno). Só roda com o
     modelo visível: um resumo com três modelos não gasta bateria com os que
     ficaram lá em cima. */
  const relogio = new THREE.Clock()
  function quadro() {
    if (!modelo) return
    const dt = Math.min(relogio.getDelta(), 0.1)
    if (girandoSozinho) modelo.grupo.rotation.y += dt * 0.18
    modelo.grupo.updateMatrixWorld()
    if (tempoOclusao-- <= 0) {
      escolherAncoras()
      tempoOclusao = arrastando || girandoSozinho ? 6 : 14
    }
    renderer.render(cena, camera)
    desenharRotulos()
  }

  new ResizeObserver(() => ajustarTamanho()).observe(palco)
  new IntersectionObserver(([entrada]) => {
    if (entrada.isIntersecting) {
      relogio.getDelta()
      renderer.setAnimationLoop(quadro)
    } else renderer.setAnimationLoop(null)
  }).observe(palco)

  atualizarBotoes()
  await carregarTextos()
  // O lápis só existe para o admin (quem salva de verdade é conferido no banco).
  const bEditar = botao('Editar textos', '✎', () => alternarEdicao())
  if (podeEditar) direita.prepend(bEditar)
  await montar(varianteAtual)

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

/**
 * O motor da aba 3D: cena, câmera, física da constelação solta, rótulos e o
 * Teste-se. Imperativo de propósito — mil nós animados a cada quadro não
 * passam pelo React. O componente `Mapa3D` só desenha a ficha e os controles
 * a partir do `Retrato` que este motor publica a cada mudança.
 *
 * O Three.js chega por parâmetro, e não por `import`: quem chama faz o
 * `import('three')` dinâmico, e o pacote só é baixado por quem abre a aba
 * (decisão 10 — o grafo e o mapa mental não pagam por ele).
 */

import type * as Three from 'three'
import type { Materia, No } from './useExpansao'

type T = typeof Three
type Vec = Three.Vector3

export type Modo = 'arvore' | 'solta'
type Marca = 'ok' | 'x'

type Nó = {
  i: number
  id: string
  tipo: 'materia' | 'resumo' | 'secao'
  m: string
  titulo: string
  cor: string
  liberado: boolean
  pai: Nó | null
  filhos: Nó[]
  nivel: number
  /** só na seção: 2 = h2, 3 = h3 e assim por diante, relativo ao resumo */
  lv: number
  /** só na seção: o resumo que a contém */
  resumo: Nó | null
  cita: Nó[]
  citadoPor: Nó[]
  ceu: Vec
  cam: Vec | null
  sol: Vec | null
  p: Vec
}

type Ponte = { a: Nó; b: Nó; cruza: boolean }

export type Item = {
  id: string
  titulo: string
  cor: string
  /** nome da matéria, quando é outra que não a aberta */
  outra?: string
  recuo?: boolean
  ativo?: boolean
  seta?: '→' | '←'
  para?: string
}

export type Ficha =
  | {
      tipo: 'materia'
      titulo: string
      cor: string
      resumo: string
      primeiros: Item[]
      pontes: Item[]
      podeTestar: boolean
    }
  | {
      tipo: 'resumo' | 'secao'
      titulo: string
      cor: string
      rotulo: string
      href: string | null
      liberado: boolean
      marcou: Marca | null
      sub: Item[]
      secoes: Item[]
      cita: Item[]
      citadoPor: Item[]
      podeTestar: boolean
      emTeste: boolean
    }
  | {
      tipo: 'pergunta'
      cor: string
      rotulo: string
      aberto: boolean
      titulo: string
      pai: string
      abre: number
      aoLado: string[]
    }
  | { tipo: 'fim'; titulo: string; total: number; ok: number; x: number }

export type Retrato = {
  foco: { slug: string; nome: string } | null
  trilha: string[]
  modo: Modo
  pontes: boolean
  girar: boolean
  quiz: { raiz: string; total: number; ok: number; x: number } | null
  ficha: Ficha | null
  podeTestar: boolean
}

export type Entrada = {
  nos: No[]
  links: { origem: string; destino: string }[]
  materias: Materia[]
}

const ANDAR = 62
const SEG = 22
const CHAVE_TESTE = 'mapa3d-teste:'
const CHAVE_MODO = 'mapa3d-modo'

function hash(s: string) {
  let h = 2166136261
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return ((h >>> 0) % 10000) / 10000
}

const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function ler<V>(chave: string, padrao: V): V {
  try {
    const v = localStorage.getItem(chave)
    return v === null ? padrao : (JSON.parse(v) as V)
  } catch {
    return padrao
  }
}
function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    /* sem armazenamento, o progresso vale só nesta visita */
  }
}

export class Motor3D {
  private T: T
  private palco: HTMLElement
  private canvas: HTMLCanvasElement
  private camadaRotulos: HTMLElement
  private ficha: HTMLElement
  private sonda: HTMLSpanElement
  private aoMudar: (r: Retrato) => void
  private abrirHref: (href: string) => void

  private nos: Nó[] = []
  private porId = new Map<string, Nó>()
  private arestas: [number, number][] = []
  private pontes: Ponte[] = []
  private mats: string[] = []
  private nomeMat = new Map<string, string>()
  private centro = new Map<string, Vec>()
  private soltas = new Map<string, number>()
  private info: { R1: number; niveis: number } = { R1: 70, niveis: 1 }

  private ren: Three.WebGLRenderer
  private cena: Three.Scene
  private cam: Three.PerspectiveCamera
  private inst: Three.InstancedMesh
  private linhaGeo: Three.BufferGeometry
  private lp: Float32Array
  private lc: Float32Array
  private ponteGeo: Three.BufferGeometry
  private ponteLinhas: Three.LineSegments
  private pp: Float32Array
  private pc: Float32Array
  private pd: Float32Array
  private aneis: Three.Group

  private cores: { bg: Three.Color; erro: Three.Color; oculto: Three.Color; mat: Map<string, Three.Color> }

  private modo: Modo
  private mostrarPontes = true
  private girar: boolean
  private reduz: boolean
  private foco: string | null = null
  private sel: Nó | null = null
  private sob: Nó | null = null
  private t = 0
  private alvoT = 0
  private alvo: Vec
  private alvoAlvo: Vec
  private dist = 820
  private alvoDist = 820
  private theta = 0.6
  private phi = 1.12
  private desloc: [number, number] = [0, 0]
  private quiz: {
    raiz: Nó
    ordem: Nó[]
    escopo: Set<number>
    est: Map<number, Marca>
    aberto: number | null
  } | null = null

  private quadroId = 0
  private arrasto: [number, number] | null = null
  private movido = 0
  private toques = new Map<number, [number, number]>()
  private pinca = 0
  private pool: HTMLDivElement[] = []
  private desfazer: (() => void)[] = []

  constructor(opts: {
    three: T
    palco: HTMLElement
    canvas: HTMLCanvasElement
    rotulos: HTMLElement
    ficha: HTMLElement
    dados: Entrada
    aoMudar: (r: Retrato) => void
    abrirHref: (href: string) => void
  }) {
    const T = (this.T = opts.three)
    this.palco = opts.palco
    this.canvas = opts.canvas
    this.camadaRotulos = opts.rotulos
    this.ficha = opts.ficha
    this.aoMudar = opts.aoMudar
    this.abrirHref = opts.abrirHref
    this.reduz = matchMedia('(prefers-reduced-motion: reduce)').matches
    this.girar = !this.reduz
    this.modo = ler<Modo>(CHAVE_MODO, 'arvore') === 'solta' ? 'solta' : 'arvore'
    this.alvo = new T.Vector3()
    this.alvoAlvo = new T.Vector3()

    /* A sonda resolve as cores do site. Os tokens são `light-dark(…)`, e o
       `getPropertyValue` devolve a expressão, não a cor; pintar um elemento e
       ler a cor computada é o que entrega o RGB do tema vigente. */
    this.sonda = document.createElement('span')
    this.sonda.style.display = 'none'
    this.palco.appendChild(this.sonda)

    this.montarNos(opts.dados)

    this.ren = new T.WebGLRenderer({ canvas: this.canvas, antialias: true })
    this.ren.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.cena = new T.Scene()
    this.cam = new T.PerspectiveCamera(50, 1, 1, 5000)
    const geo = new T.SphereGeometry(1, 14, 10)
    this.inst = new T.InstancedMesh(geo, new T.MeshBasicMaterial(), this.nos.length)
    this.inst.instanceMatrix.setUsage(T.DynamicDrawUsage)
    this.cena.add(this.inst)

    this.linhaGeo = new T.BufferGeometry()
    this.lp = new Float32Array(this.arestas.length * 6)
    this.lc = new Float32Array(this.arestas.length * 6)
    this.linhaGeo.setAttribute('position', new T.BufferAttribute(this.lp, 3))
    this.linhaGeo.setAttribute('color', new T.BufferAttribute(this.lc, 3))
    this.cena.add(
      new T.LineSegments(this.linhaGeo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 })),
    )

    /* Galho é reta cheia; citação é arco tracejado cujos traços correm de quem
       cita para quem é citado. A distância ao longo do arco é escrita à mão a
       cada quadro, deslocada pelo tempo — é isso que faz o traço andar. */
    this.ponteGeo = new T.BufferGeometry()
    this.pp = new Float32Array(this.pontes.length * SEG * 6)
    this.pc = new Float32Array(this.pontes.length * SEG * 6)
    this.pd = new Float32Array(this.pontes.length * SEG * 2)
    this.ponteGeo.setAttribute('position', new T.BufferAttribute(this.pp, 3))
    this.ponteGeo.setAttribute('color', new T.BufferAttribute(this.pc, 3))
    this.ponteGeo.setAttribute('lineDistance', new T.BufferAttribute(this.pd, 1))
    this.ponteLinhas = new T.LineSegments(
      this.ponteGeo,
      new T.LineDashedMaterial({ vertexColors: true, dashSize: 4, gapSize: 3.2 }),
    )
    this.cena.add(this.ponteLinhas)

    this.aneis = new T.Group()
    this.cena.add(this.aneis)

    this.cores = { bg: new T.Color(), erro: new T.Color(), oculto: new T.Color(), mat: new Map() }
    this.pintarTema()

    this.ouvir()
    this.tamanho()
    this.dist = this.alvoDist = 820 * this.largo()
    this.quadro()
    this.publicar()
  }

  /* ---------------- dados ---------------- */

  private montarNos({ nos, links, materias }: Entrada) {
    const T = this.T
    const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z)
    const novo = (o: Omit<Nó, 'i' | 'filhos' | 'cita' | 'citadoPor' | 'ceu' | 'cam' | 'sol' | 'p' | 'nivel'> & { nivel?: number }) => {
      const n: Nó = {
        ...o,
        i: this.nos.length,
        filhos: [],
        cita: [],
        citadoPor: [],
        nivel: o.nivel ?? -1,
        ceu: V(),
        cam: null,
        sol: null,
        p: V(),
      }
      this.nos.push(n)
      this.porId.set(n.id, n)
      return n
    }

    this.mats = materias.map((m) => m.slug)
    for (const m of materias) {
      this.nomeMat.set(m.slug, m.nome)
      novo({ id: 'materia:' + m.slug, tipo: 'materia', m: m.slug, titulo: m.nome, cor: m.cor, liberado: true, pai: null, lv: 0, resumo: null, nivel: 0 })
    }
    for (const n of nos) {
      novo({
        id: n.id,
        tipo: n.tipo === 'titulo' ? 'secao' : 'resumo',
        m: n.materia,
        titulo: n.titulo,
        cor: n.cor,
        liberado: n.liberado,
        pai: null,
        lv: 0,
        resumo: null,
      })
    }
    /* Pai de resumo de OUTRA matéria vira a própria matéria: a árvore de cada
       galáxia precisa fechar nela mesma, ou o andar desenharia um galho
       atravessando o céu. */
    for (const n of nos) {
      const eu = this.porId.get(n.id)!
      const pai = n.pai ? this.porId.get(n.pai) : undefined
      eu.pai = pai && pai.m === eu.m ? pai : this.porId.get('materia:' + eu.m) ?? null
    }
    for (const n of this.nos) if (n.pai) {
      n.pai.filhos.push(n)
      this.arestas.push([n.pai.i, n.i])
    }
    const nivel = (n: Nó): number => (n.nivel >= 0 ? n.nivel : (n.nivel = n.pai ? nivel(n.pai) + 1 : 0))
    this.nos.forEach(nivel)
    for (const n of this.nos) if (n.tipo === 'secao') {
      let r = n.pai
      let lv = 2
      while (r && r.tipo === 'secao') {
        r = r.pai
        lv++
      }
      n.resumo = r
      n.lv = lv
    }

    for (const l of links) {
      const a = this.porId.get(l.origem)
      const b = this.porId.get(l.destino)
      if (!a || !b || a === b) continue
      a.cita.push(b)
      b.citadoPor.push(a)
      this.pontes.push({ a, b, cruza: a.m !== b.m })
    }

    /* O céu: cada matéria num lugar fixo do anel, pela ordem canônica de
       MATERIAS — publicar um resumo nunca gira o céu (mesma regra da 10b). */
    const fib = this.fib
    this.mats.forEach((m, k) => {
      const a = (k / this.mats.length) * Math.PI * 2
      this.centro.set(m, V(Math.cos(a) * 300, (k % 2 ? 1 : -1) * 55, Math.sin(a) * 300))
    })
    for (const m of this.mats) {
      const c = this.centro.get(m)!
      const mm = this.porId.get('materia:' + m)!
      mm.ceu.copy(c)
      const tops = mm.filhos
      const R = 26 + Math.sqrt(tops.length) * 9
      tops.forEach((r, i) => {
        r.ceu.copy(c).add(fib(i, tops.length).multiplyScalar(R * (0.75 + 0.25 * hash(r.id))))
        const desce = (p: Nó, esc: number) =>
          p.filhos.forEach((f, j) => {
            f.ceu.copy(p.ceu).add(fib(j, Math.max(p.filhos.length, 2)).multiplyScalar(esc))
            desce(f, esc * 0.6)
          })
        desce(r, 14)
      })
    }
    for (const n of this.nos) n.p.copy(n.ceu)
  }

  private fib = (i: number, n: number) => {
    const y = 1 - ((i + 0.5) / n) * 2
    const r = Math.sqrt(1 - y * y)
    const t = i * 2.39996
    return new this.T.Vector3(Math.cos(t) * r, y, Math.sin(t) * r)
  }

  /* ---------------- arranjos da matéria aberta ---------------- */

  private andares(m: string) {
    const T = this.T
    const mm = this.porId.get('materia:' + m)!
    const c = this.centro.get(m)!
    mm.cam = c.clone().add(new T.Vector3(0, ANDAR * 1.4, 0))
    const tops = mm.filhos.slice().sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt'))
    const R1 = Math.max(70, (tops.length * 15) / (2 * Math.PI))
    const poe = (n: Nó, ang: number, raio: number) => {
      const y = ANDAR * 1.4 - n.nivel * ANDAR
      n.cam = c.clone().add(new T.Vector3(Math.cos(ang) * raio, y, Math.sin(ang) * raio))
      const k = n.filhos.length
      const passo = Math.min(0.16, ((Math.PI * 2) / Math.max(tops.length, 1)) * 0.9 / Math.max(k, 1))
      n.filhos.forEach((f, j) => poe(f, ang + (j - (k - 1) / 2) * passo, raio + 26))
    }
    tops.forEach((r, i) => poe(r, (i / tops.length) * Math.PI * 2, R1))
    let niveis = 1
    for (const n of this.nos) if (n.m === m) niveis = Math.max(niveis, n.nivel)
    return { R1, niveis }
  }

  /** Constelação solta: molas nos galhos e nas citações, repulsão entre todos. */
  private espalhar(m: string) {
    const ja = this.soltas.get(m)
    if (ja !== undefined) return ja
    const T = this.T
    const c = this.centro.get(m)!
    const L = this.nos.filter((n) => n.m === m)
    const loc = new Map(L.map((n, i) => [n, i]))
    const P = L.map((n, i) =>
      n.ceu.clone().sub(c).multiplyScalar(2.2).add(this.fib(i, L.length).multiplyScalar(n.tipo === 'secao' ? 12 : 4)),
    )
    const molas: [number, number, number, number][] = []
    for (const n of L) if (n.pai && loc.has(n.pai))
      molas.push([loc.get(n.pai)!, loc.get(n)!, n.pai.tipo === 'materia' ? 58 : n.tipo === 'secao' ? 16 : 34, 0.1])
    for (const p of this.pontes) if (loc.has(p.a) && loc.has(p.b)) molas.push([loc.get(p.a)!, loc.get(p.b)!, 46, 0.04])
    const F = P.map(() => new T.Vector3())
    const d = new T.Vector3()
    const N = L.length
    const IT = 240
    for (let it = 0; it < IT; it++) {
      const temp = 1 - it / IT
      F.forEach((f) => f.set(0, 0, 0))
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++) {
          d.subVectors(P[i], P[j])
          const d2 = Math.max(d.lengthSq(), 4)
          const k = (L[i].tipo === 'secao' && L[j].tipo === 'secao' ? 220 : 700) / d2
          d.multiplyScalar(k / Math.sqrt(d2))
          F[i].add(d)
          F[j].sub(d)
        }
      for (const [a, b, rep, f] of molas) {
        d.subVectors(P[b], P[a])
        const l = Math.max(d.length(), 0.01)
        d.multiplyScalar(((l - rep) * f) / l)
        F[a].add(d)
        F[b].sub(d)
      }
      for (let i = 0; i < N; i++) {
        F[i].addScaledVector(P[i], -0.012)
        const l = F[i].length()
        if (l > 9) F[i].multiplyScalar(9 / l)
        P[i].addScaledVector(F[i], temp)
      }
    }
    const p0 = P[loc.get(this.porId.get('materia:' + m)!)!].clone()
    let raio = 0
    L.forEach((n, i) => {
      P[i].sub(p0)
      raio = Math.max(raio, P[i].length())
      n.sol = c.clone().add(P[i])
    })
    this.soltas.set(m, raio)
    return raio
  }

  private largo() {
    return Math.max(1, 1 / (this.cam.aspect * 1.25))
  }

  private enquadrar() {
    const m = this.foco
    if (!m) return
    const c = this.centro.get(m)!
    if (this.modo === 'arvore') {
      const { R1, niveis } = this.info
      this.alvoAlvo.copy(c).y += ANDAR * 1.4 - (niveis * ANDAR) / 2
      this.alvoDist = Math.max(340, (R1 + niveis * 26) * 1.9 + niveis * ANDAR * 0.7) * this.largo()
      this.phi = 1.18
    } else {
      this.alvoAlvo.copy(c)
      this.alvoDist = Math.max(300, this.espalhar(m) * 2.5) * this.largo()
      this.phi = 1.1
    }
  }

  private abrir(m: string) {
    const T = this.T
    this.info = this.andares(m)
    this.espalhar(m)
    this.foco = m
    this.alvoT = 1
    this.sel = null
    this.enquadrar()
    this.aneis.clear()
    for (let k = 1; k <= this.info.niveis; k++) {
      const R = this.info.R1 + (k - 1) * 26
      const pts: Vec[] = []
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2
        pts.push(new T.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R))
      }
      const l = new T.LineLoop(
        new T.BufferGeometry().setFromPoints(pts),
        new T.LineBasicMaterial({ color: this.cores.mat.get(m), transparent: true, opacity: 0.22 }),
      )
      l.position.copy(this.centro.get(m)!).y += ANDAR * 1.4 - k * ANDAR
      this.aneis.add(l)
    }
  }

  /* ---------------- ações (chamadas pelo componente) ---------------- */

  fechar() {
    this.quiz = null
    this.foco = null
    this.alvoT = 0
    this.sel = null
    this.alvoAlvo.set(0, 0, 0)
    this.alvoDist = 820 * this.largo()
    this.aneis.clear()
    this.publicar()
  }

  abrirMateria(slug: string) {
    if (this.foco === slug) return this.fechar()
    this.quiz = null
    this.abrir(slug)
    this.sel = this.porId.get('materia:' + slug) ?? null
    this.publicar()
  }

  selecionar(id: string | null) {
    if (this.quiz) this.quiz.aberto = null
    const n = id ? this.porId.get(id) ?? null : null
    if (n && this.foco !== n.m) {
      this.quiz = null
      this.abrir(n.m)
    }
    this.sel = n
    this.publicar()
  }

  setModo(modo: Modo) {
    this.modo = modo
    gravar(CHAVE_MODO, modo)
    this.enquadrar()
    this.publicar()
  }

  setPontes(v: boolean) {
    this.mostrarPontes = v
    this.publicar()
  }

  setGirar(v: boolean) {
    this.girar = v
    this.publicar()
  }

  /* ---------------- Teste-se ---------------- */

  private escondido(n: Nó) {
    const q = this.quiz
    return !!q && q.escopo.has(n.i) && !q.est.has(n.i) && q.aberto !== n.i
  }
  private nome(n: Nó) {
    return this.escondido(n) ? '?' : n.titulo
  }
  private descendentes(n: Nó) {
    const s: Nó[] = []
    const d = (x: Nó) => x.filhos.forEach((f) => {
      if (f.liberado) {
        s.push(f)
        d(f)
      }
    })
    d(n)
    return s
  }

  iniciarTeste(id?: string) {
    const base = (id && this.porId.get(id)) || (this.sel && this.sel.tipo !== 'secao' && this.descendentes(this.sel).length ? this.sel : null) || (this.foco ? this.porId.get('materia:' + this.foco) : null)
    if (!base) return
    if (this.foco !== base.m) this.abrir(base.m)
    const ordem = this.descendentes(base).sort((a, b) => a.nivel - b.nivel)
    const salvo = new Map(ler<[string, Marca][]>(CHAVE_TESTE + base.id, []))
    const est = new Map<number, Marca>()
    for (const n of ordem) {
      const v = salvo.get(n.id)
      if (v) est.set(n.i, v)
    }
    this.quiz = { raiz: base, ordem, escopo: new Set(ordem.map((n) => n.i)), est, aberto: null }
    this.proximo()
  }
  private salvarTeste() {
    const q = this.quiz
    if (q) gravar(CHAVE_TESTE + q.raiz.id, [...q.est].map(([i, v]) => [this.nos[i].id, v]))
  }
  private proximo() {
    const q = this.quiz!
    q.aberto = null
    this.sel = q.ordem.find((x) => !q.est.has(x.i)) ?? null
    this.publicar()
  }
  revelar() {
    if (this.quiz && this.sel && this.escondido(this.sel)) {
      this.quiz.aberto = this.sel.i
      this.publicar()
    }
  }
  julgar(v: Marca) {
    const q = this.quiz
    if (!q || q.aberto === null) return
    q.est.set(q.aberto, v)
    this.salvarTeste()
    this.proximo()
  }
  pular() {
    const q = this.quiz
    if (!q || !this.sel) return
    const i = q.ordem.indexOf(this.sel)
    const prox = q.ordem.slice(i + 1).concat(q.ordem.slice(0, i)).find((x) => !q.est.has(x.i))
    if (prox) {
      this.sel = prox
      this.publicar()
    }
  }
  refazer() {
    const q = this.quiz
    if (!q) return
    for (const [i, v] of [...q.est]) if (v === 'x') q.est.delete(i)
    this.salvarTeste()
    this.proximo()
  }
  zerar() {
    if (!this.quiz) return
    this.quiz.est.clear()
    this.salvarTeste()
    this.proximo()
  }
  sairTeste() {
    const r = this.quiz?.raiz ?? null
    this.quiz = null
    this.sel = r
    this.publicar()
  }

  /* ---------------- retrato para o React ---------------- */

  private item(x: Nó, base: string, extra: Partial<Item> = {}): Item {
    return {
      id: x.id,
      titulo: this.nome(x),
      cor: x.cor,
      outra: x.m !== base ? this.nomeMat.get(x.m) : undefined,
      ...extra,
    }
  }

  private publicar() {
    const q = this.quiz
    const n = this.sel
    const trilha: string[] = []
    for (let p = n; p && p.tipo !== 'materia'; p = p.pai) trilha.unshift(this.nome(p))

    let ficha: Ficha | null = null
    if (q && !n) {
      const ok = [...q.est.values()].filter((v) => v === 'ok').length
      ficha = { tipo: 'fim', titulo: q.raiz.titulo, total: q.ordem.length, ok, x: q.ordem.length - ok }
    } else if (n && q && q.escopo.has(n.i) && !q.est.has(n.i)) {
      const aberto = q.aberto === n.i
      const feito = q.ordem.filter((x) => q.est.has(x.i)).length
      const irm = (n.pai?.filhos ?? []).filter((x) => x !== n)
      ficha = {
        tipo: 'pergunta',
        cor: n.cor,
        rotulo: `item ${feito + 1} de ${q.ordem.length} · andar ${n.nivel}`,
        aberto,
        titulo: aberto ? n.titulo : '',
        pai: n.pai ? this.nome(n.pai) : '',
        abre: n.filhos.length,
        aoLado: irm.slice(0, 6).map((x) => this.nome(x)).concat(irm.length > 6 ? ['…'] : []),
      }
    } else if (n && n.tipo === 'materia') {
      const resumos = this.nos.filter((x) => x.m === n.m && x.tipo === 'resumo').length
      const secoes = this.nos.filter((x) => x.m === n.m && x.tipo === 'secao').length
      ficha = {
        tipo: 'materia',
        titulo: n.titulo,
        cor: n.cor,
        resumo: `${n.filhos.length} assuntos no primeiro andar, ${resumos} resumos ao todo, ${secoes} seções no fundo.`,
        primeiros: n.filhos
          .slice()
          .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt'))
          .map((x) => this.item(x, n.m)),
        pontes: this.mostrarPontes
          ? this.pontes
              .filter((p) => p.cruza && (p.a.m === n.m || p.b.m === n.m))
              .map((p) => {
                const de = p.a.m === n.m ? p.a : p.b
                const para = de === p.a ? p.b : p.a
                return this.item(de, n.m, { seta: de === p.a ? '→' : '←', para: this.nome(para), outra: this.nomeMat.get(para.m), cor: para.cor })
              })
          : [],
        podeTestar: !q && this.descendentes(n).length > 0,
      }
    } else if (n) {
      const r = n.tipo === 'secao' ? n.resumo ?? n : n
      const secoes = this.nos.filter((x) => x.resumo === r)
      const marcou = q && q.escopo.has(n.i) ? q.est.get(n.i) ?? null : null
      ficha = {
        tipo: n.tipo === 'secao' ? 'secao' : 'resumo',
        titulo: n.titulo,
        cor: n.cor,
        rotulo: n.tipo === 'secao' ? 'seção de ' + this.nome(r) : `resumo · andar ${r.nivel}`,
        href: r.liberado ? `/resumos/${n.id}` : null,
        liberado: r.liberado,
        marcou,
        sub: r.filhos.filter((x) => x.tipo === 'resumo').map((x) => this.item(x, n.m)),
        secoes: secoes.map((x) => this.item(x, n.m, { recuo: x.lv > 2, ativo: x === n })),
        cita: this.mostrarPontes && n.tipo === 'resumo' ? n.cita.map((x) => this.item(x, n.m)) : [],
        citadoPor: this.mostrarPontes && n.tipo === 'resumo' ? n.citadoPor.map((x) => this.item(x, n.m)) : [],
        podeTestar: !q && n.tipo === 'resumo' && this.descendentes(n).length > 0,
        emTeste: !!q,
      }
    }

    const ok = q ? [...q.est.values()].filter((v) => v === 'ok').length : 0
    const x = q ? [...q.est.values()].filter((v) => v === 'x').length : 0
    this.aoMudar({
      foco: this.foco ? { slug: this.foco, nome: this.nomeMat.get(this.foco) ?? '' } : null,
      trilha,
      modo: this.modo,
      pontes: this.mostrarPontes,
      girar: this.girar,
      quiz: q ? { raiz: q.raiz.titulo, total: q.ordem.length, ok, x } : null,
      ficha,
      podeTestar: !!this.foco && !q,
    })
  }

  /* ---------------- tema ---------------- */

  private resolver(cor: string, alvo: Three.Color) {
    this.sonda.style.color = ''
    this.sonda.style.color = cor
    const m = getComputedStyle(this.sonda).color.match(/[\d.]+/g)
    // a cor computada é sRGB; sem dizer isso, o Three a lê como linear e clareia
    if (m && m.length >= 3) alvo.setRGB(+m[0] / 255, +m[1] / 255, +m[2] / 255, this.T.SRGBColorSpace)
    return alvo
  }

  private pintarTema = () => {
    const T = this.T
    this.resolver('var(--canvas)', this.cores.bg)
    this.resolver('var(--erro)', this.cores.erro)
    this.resolver('var(--ink-faint)', this.cores.oculto)
    for (const n of this.nos) if (n.tipo === 'materia') this.cores.mat.set(n.m, this.resolver(n.cor, new T.Color()))
    this.cena.background = this.cores.bg
    this.cena.fog = new T.Fog(this.cores.bg, this.dist * 0.55, this.dist * 2.1)
    for (const l of this.aneis.children) {
      const mat = (l as Three.LineLoop).material as Three.LineBasicMaterial
      if (this.foco) mat.color.copy(this.cores.mat.get(this.foco)!)
    }
  }

  /* ---------------- câmera, tamanho e ponteiro ---------------- */

  private tamanho = () => {
    const r = this.palco.getBoundingClientRect()
    if (!r.width || !r.height) return
    this.ren.setSize(r.width, r.height, false)
    this.cam.aspect = r.width / r.height
    if (this.desloc[0] || this.desloc[1]) this.cam.setViewOffset(r.width, r.height, this.desloc[0], this.desloc[1], r.width, r.height)
    else this.cam.clearViewOffset()
    this.cam.updateProjectionMatrix()
  }

  /** A cena desvia da ficha: para a esquerda no desktop, para cima no celular. */
  private ajustarDesloc = () => {
    const w = this.palco.clientWidth
    const h = this.ficha.offsetHeight
    const d: [number, number] = h ? (w > 720 ? [Math.round((this.ficha.offsetWidth + 24) / 2), 0] : [0, Math.round((h + 12) / 2)]) : [0, 0]
    if (d[0] !== this.desloc[0] || d[1] !== this.desloc[1]) {
      this.desloc = d
      this.tamanho()
    }
  }

  private tela(p: Vec, v: Vec) {
    v.copy(p).project(this.cam)
    const r = this.canvas.getBoundingClientRect()
    return { x: ((v.x + 1) / 2) * r.width, y: ((1 - v.y) / 2) * r.height, z: v.z }
  }

  private maisPerto(cx: number, cy: number) {
    const r = this.canvas.getBoundingClientRect()
    const v = new this.T.Vector3()
    let melhor: Nó | null = null
    let bd = 16
    for (const n of this.nos) {
      if (n.tipo === 'secao' && this.foco !== n.m) continue
      const s = this.tela(n.p, v)
      if (s.z > 1) continue
      const d = Math.hypot(s.x - (cx - r.left), s.y - (cy - r.top)) - (n.tipo === 'materia' ? 8 : 0)
      if (d < bd) {
        bd = d
        melhor = n
      }
    }
    return melhor
  }

  private ouvir() {
    const c = this.canvas
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, ev: K, fn: (e: HTMLElementEventMap[K]) => void, o?: AddEventListenerOptions) => {
      el.addEventListener(ev, fn as EventListener, o)
      this.desfazer.push(() => el.removeEventListener(ev, fn as EventListener, o))
    }
    on(c, 'pointerdown', (e) => {
      this.toques.set(e.pointerId, [e.clientX, e.clientY])
      c.setPointerCapture(e.pointerId)
      this.arrasto = [e.clientX, e.clientY]
      this.movido = 0
      c.style.cursor = 'grabbing'
      if (this.toques.size === 2) {
        const [a, b] = [...this.toques.values()]
        this.pinca = Math.hypot(a[0] - b[0], a[1] - b[1])
      }
    })
    on(c, 'pointermove', (e) => {
      if (this.toques.has(e.pointerId)) this.toques.set(e.pointerId, [e.clientX, e.clientY])
      if (this.toques.size === 2) {
        const [a, b] = [...this.toques.values()]
        const d = Math.hypot(a[0] - b[0], a[1] - b[1])
        if (this.pinca) this.alvoDist = Math.min(1600, Math.max(120, (this.alvoDist * this.pinca) / d))
        this.pinca = d
        this.movido = 99
        return
      }
      if (this.arrasto) {
        const dx = e.clientX - this.arrasto[0]
        const dy = e.clientY - this.arrasto[1]
        this.movido += Math.abs(dx) + Math.abs(dy)
        this.theta += dx * 0.006
        this.phi = Math.min(2.8, Math.max(0.25, this.phi - dy * 0.006))
        this.arrasto = [e.clientX, e.clientY]
        return
      }
      const n = this.maisPerto(e.clientX, e.clientY)
      if (n !== this.sob) {
        this.sob = n
        c.style.cursor = n ? 'pointer' : 'grab'
      }
    })
    const solta = (e: PointerEvent) => {
      this.toques.delete(e.pointerId)
      if (this.toques.size < 2) this.pinca = 0
      c.style.cursor = 'grab'
      if (this.arrasto && this.movido < 6) {
        const n = this.maisPerto(e.clientX, e.clientY)
        if (n) {
          if (n.tipo === 'materia' && this.foco !== n.m) this.abrirMateria(n.m)
          else this.selecionar(n.id)
        } else if (this.sel) this.selecionar(null)
      }
      if (!this.toques.size) this.arrasto = null
    }
    on(c, 'pointerup', solta)
    on(c, 'pointercancel', solta)
    on(c, 'pointerleave', () => {
      this.sob = null
    })
    on(c, 'dblclick', () => {
      const n = this.sel
      if (n && n.tipo !== 'materia' && n.liberado && !this.escondido(n)) this.abrirHref(`/resumos/${n.id}`)
    })
    on(c, 'wheel', (e) => {
      e.preventDefault()
      this.alvoDist = Math.min(1600, Math.max(120, this.alvoDist * Math.exp(e.deltaY * 0.0012)))
    }, { passive: false })
    on(window, 'keydown', (e) => {
      const alvo = e.target as HTMLElement | null
      if (alvo?.closest?.('input,textarea,[contenteditable]')) return
      if (this.quiz) {
        if (alvo?.closest?.('button,a')) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          this.revelar()
          return
        }
        if (e.key === '1') return this.julgar('ok')
        if (e.key === '2') return this.julgar('x')
        if (e.key === 'Escape') return this.sairTeste()
      }
      if (e.key === 'Escape') {
        if (this.sel) this.selecionar(null)
        else if (this.foco) this.fechar()
      }
    })

    const mq = matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', this.pintarTema)
    this.desfazer.push(() => mq.removeEventListener('change', this.pintarTema))
    const mo = new MutationObserver(this.pintarTema)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] })
    this.desfazer.push(() => mo.disconnect())
    const ro = new ResizeObserver(() => {
      this.tamanho()
      this.ajustarDesloc()
    })
    ro.observe(this.palco)
    ro.observe(this.ficha)
    this.desfazer.push(() => ro.disconnect())
  }

  /* ---------------- quadro ---------------- */

  private ramo(n: Nó | null) {
    const s = new Set<number>()
    if (!n) return s
    for (let p: Nó | null = n; p; p = p.pai) s.add(p.i)
    const d = (x: Nó) => x.filhos.forEach((f) => {
      s.add(f.i)
      d(f)
    })
    d(n)
    return s
  }

  private quadro = () => {
    const T = this.T
    const passo = this.reduz ? 1 : 0.045
    this.t += Math.sign(this.alvoT - this.t) * Math.min(passo, Math.abs(this.alvoT - this.t))
    const k = suave(this.t)
    this.alvo.lerp(this.alvoAlvo, this.reduz ? 1 : 0.07)
    this.dist += (this.alvoDist - this.dist) * (this.reduz ? 1 : 0.07)
    if (this.girar && !this.arrasto) this.theta += this.foco ? 0.0012 : 0.0018

    const s = Math.sin(this.phi)
    this.cam.position.set(
      this.alvo.x + this.dist * s * Math.cos(this.theta),
      this.alvo.y + this.dist * Math.cos(this.phi),
      this.alvo.z + this.dist * s * Math.sin(this.theta),
    )
    this.cam.lookAt(this.alvo)
    const fog = this.cena.fog as Three.Fog | null
    if (fog) {
      fog.near = this.dist * 0.55
      fog.far = this.dist * 2.1
    }

    const foco = this.sel || this.sob
    const destaque = this.ramo(foco)
    if (foco && this.mostrarPontes && foco.tipo === 'resumo') {
      foco.cita.forEach((x) => destaque.add(x.i))
      foco.citadoPor.forEach((x) => destaque.add(x.i))
    }

    const mtx = new T.Matrix4()
    const quat = new T.Quaternion()
    const esc = new T.Vector3()
    const cor = new T.Color()
    for (const n of this.nos) {
      const alvo = n.m === this.foco ? (this.modo === 'arvore' ? n.cam : n.sol) ?? n.ceu : n.ceu
      n.p.lerp(alvo, this.reduz ? 1 : 0.08)
      const noFoco = this.foco === n.m
      let r = n.tipo === 'materia' ? (noFoco ? 5 : 7) : n.tipo === 'resumo' ? (n.nivel === 1 ? 3.6 : 2.8) : 2
      if (n.tipo === 'secao') r = noFoco ? r * k : 0
      if (!n.liberado) r *= 0.8
      if (destaque.has(n.i)) r *= 1.35
      esc.set(r, r, r)
      mtx.compose(n.p, quat, esc)
      this.inst.setMatrixAt(n.i, mtx)
      let a = 1
      if (this.foco && !noFoco) a = destaque.has(n.i) ? 1 : 0.18
      if (destaque.size && !destaque.has(n.i) && noFoco) a = 0.35
      // bloqueado não recebe cor: cor cheia o faria parecer disponível (decisão 4c)
      cor.copy(n.liberado ? this.cores.mat.get(n.m) ?? this.cores.oculto : this.cores.oculto)
      if (n.tipo === 'secao') cor.lerp(this.cores.bg, 0.2)
      const q = this.quiz
      if (q && q.escopo.has(n.i)) {
        if (q.est.get(n.i) === 'x') cor.copy(this.cores.erro)
        else if (this.escondido(n)) cor.copy(this.cores.oculto).lerp(this.cores.bg, 0.25)
      }
      cor.lerp(this.cores.bg, 1 - a)
      this.inst.setColorAt(n.i, cor)
    }
    this.inst.instanceMatrix.needsUpdate = true
    if (this.inst.instanceColor) this.inst.instanceColor.needsUpdate = true

    this.arestas.forEach(([ia, ib], j) => {
      const A = this.nos[ia].p
      const nb = this.nos[ib]
      const B = nb.p
      const vis = !(nb.tipo === 'secao' && this.foco !== nb.m)
      if (vis) this.lp.set([A.x, A.y, A.z, B.x, B.y, B.z], j * 6)
      else this.lp.fill(0, j * 6, j * 6 + 6)
      let a2 = this.foco && this.foco !== nb.m ? 0.06 : 0.5
      if (destaque.size && nb.m === this.foco) a2 = destaque.has(ib) && destaque.has(ia) ? 1 : 0.15
      cor.copy(this.cores.mat.get(nb.m) ?? this.cores.oculto).lerp(this.cores.bg, 1 - a2)
      this.lc.set([cor.r, cor.g, cor.b, cor.r, cor.g, cor.b], j * 6)
    })
    this.linhaGeo.attributes.position.needsUpdate = true
    this.linhaGeo.attributes.color.needsUpdate = true
    this.linhaGeo.computeBoundingSphere()

    this.ponteLinhas.visible = this.mostrarPontes
    if (this.mostrarPontes) this.desenharPontes(foco)

    this.aneis.visible = this.modo === 'arvore'
    for (const l of this.aneis.children) (((l as Three.LineLoop).material) as Three.LineBasicMaterial).opacity = 0.22 * k

    this.ren.render(this.cena, this.cam)
    this.rotular(destaque, foco)
    this.quadroId = requestAnimationFrame(this.quadro)
  }

  private desenharPontes(foco: Nó | null) {
    const T = this.T
    const corre = this.reduz ? 0 : (performance.now() / 1000) * 9
    const ctl = new T.Vector3()
    const pa = new T.Vector3()
    const pb = new T.Vector3()
    const ca = new T.Color()
    const cb = new T.Color()
    const cor = new T.Color()
    const bez = (A: Vec, C: Vec, B: Vec, t: number, o: Vec) =>
      o.set(
        (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * C.x + t * t * B.x,
        (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * C.y + t * t * B.y,
        (1 - t) * (1 - t) * A.z + 2 * (1 - t) * t * C.z + t * t * B.z,
      )
    this.pontes.forEach((P, j) => {
      const A = P.a.p
      const B = P.b.p
      ctl.addVectors(A, B).multiplyScalar(0.5)
      ctl.y += A.distanceTo(B) * (P.cruza ? 0.4 : 0.32)
      let al = P.cruza ? 0.85 : 0.32
      if (this.foco) al = P.a.m === this.foco || P.b.m === this.foco ? (P.cruza ? 0.95 : 0.55) : 0.07
      if (foco && foco.tipo === 'resumo') al = P.a === foco || P.b === foco ? 1 : al * 0.25
      ca.copy(this.cores.mat.get(P.a.m) ?? this.cores.oculto)
      cb.copy(this.cores.mat.get(P.b.m) ?? this.cores.oculto)
      let acc = 0
      for (let s = 0; s < SEG; s++) {
        const t0 = s / SEG
        const t1 = (s + 1) / SEG
        bez(A, ctl, B, t0, pa)
        bez(A, ctl, B, t1, pb)
        const o2 = (j * SEG + s) * 2
        this.pd[o2] = acc - corre
        acc += pa.distanceTo(pb)
        this.pd[o2 + 1] = acc - corre
        const o = (j * SEG + s) * 6
        this.pp.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], o)
        cor.copy(ca).lerp(cb, t0).lerp(this.cores.bg, 1 - al)
        this.pc.set([cor.r, cor.g, cor.b], o)
        cor.copy(ca).lerp(cb, t1).lerp(this.cores.bg, 1 - al)
        this.pc.set([cor.r, cor.g, cor.b], o + 3)
      }
    })
    this.ponteGeo.attributes.position.needsUpdate = true
    this.ponteGeo.attributes.color.needsUpdate = true
    this.ponteGeo.attributes.lineDistance.needsUpdate = true
    this.ponteGeo.computeBoundingSphere()
  }

  /** Rótulos em HTML, por prioridade, sem se atropelarem. */
  private rotular(destaque: Set<number>, foco: Nó | null) {
    const v = new this.T.Vector3()
    const cands: { n: Nó; pr: number; x: number; y: number; d: number }[] = []
    for (const n of this.nos) {
      const noFoco = this.foco === n.m
      const q = this.quiz
      let pr = -1
      if (q && q.escopo.has(n.i)) pr = (destaque.has(n.i) ? (n === this.sel ? 100 : 70) : 45) - n.nivel
      else if (destaque.has(n.i) && (n.tipo !== 'secao' || noFoco)) pr = n === foco ? 100 : 60 - n.nivel
      else if (n.tipo === 'materia') pr = this.foco && !noFoco ? (this.t < 0.3 ? 20 : -1) : 50
      else if (noFoco && this.t > 0.6 && n.tipo === 'resumo') pr = 30 - n.nivel
      else if (noFoco && this.t > 0.6 && n.tipo === 'secao' && n.lv === 2 && this.dist < 300) pr = 5
      if (pr < 0) continue
      const s = this.tela(n.p, v)
      if (s.z > 1) continue
      const d = this.cam.position.distanceTo(n.p)
      cands.push({ n, pr: pr - d / 400, x: s.x, y: s.y, d })
    }
    cands.sort((a, b) => b.pr - a.pr)
    const caixas: number[][] = []
    let u = 0
    for (const c of cands) {
      if (u >= 90) break
      const n = c.n
      const grande = n.tipo === 'materia'
      const oc = this.escondido(n)
      const nome = n.titulo
      const txt = oc ? '?' : nome.length > 34 && !destaque.has(n.i) ? nome.slice(0, 32) + '…' : nome
      const w = oc ? 20 : txt.length * (grande ? 8.2 : 6.3) + 6
      const h = grande ? 18 : 14
      const x = c.x - w / 2
      const y = c.y - (grande ? 26 : 18)
      if (caixas.some((b) => x < b[2] && x + w > b[0] && y < b[3] && y + h > b[1])) continue
      caixas.push([x, y, x + w, y + h])
      let el = this.pool[u]
      if (!el) {
        el = document.createElement('div')
        this.camadaRotulos.appendChild(el)
        this.pool[u] = el
      }
      const st = this.quiz && this.quiz.escopo.has(n.i) ? this.quiz.est.get(n.i) : undefined
      const cls =
        'mapa3d-rotulo' +
        (grande ? ' mapa3d-materia' : n.tipo === 'secao' ? ' mapa3d-secao' : '') +
        (destaque.has(n.i) ? ' mapa3d-on' : '') +
        (n.liberado ? '' : ' mapa3d-bloq') +
        (oc ? ' mapa3d-q' : st === 'ok' ? ' mapa3d-ok' : st === 'x' ? ' mapa3d-x' : '')
      if (el.className !== cls) el.className = cls
      if (el.textContent !== txt) el.textContent = txt
      el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`
      el.style.opacity = String(
        this.foco && this.foco !== n.m && !destaque.has(n.i) ? 0.45 : Math.max(0.55, Math.min(1, 1.5 - c.d / 1400)),
      )
      el.style.display = ''
      u++
    }
    for (let i = u; i < this.pool.length; i++) this.pool[i].style.display = 'none'
  }

  destruir() {
    cancelAnimationFrame(this.quadroId)
    this.desfazer.forEach((f) => f())
    this.pool.forEach((el) => el.remove())
    this.sonda.remove()
    this.ren.dispose()
  }
}

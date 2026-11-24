import {
  calcular,
  chamadasDe,
  ErroExpressao,
  EXPRESSAO_MAX,
  lerExpressao,
  variaveisDe,
  type No,
} from './expressao'

/**
 * A RECEITA de um gráfico interativo (decisão 34).
 *
 * É isto que o resumo guarda, num atributo do nó — nunca o desenho. Quem
 * desenha é `desenho.ts`, a partir da receita, nos três lugares: servidor,
 * editor e navegador do aluno. Mudar como se desenha um eixo muda todos os
 * gráficos do acervo de uma vez, sem regravar resumo nenhum.
 */

export type Janela = { xmin: number; xmax: number; ymin: number; ymax: number }

export type Parametro = {
  nome: string
  min: number
  max: number
  passo: number
  valor: number
}

/** Índice da cor, de 1 a 6 — vira `var(--grafico-N)` no desenho. */
export type Cor = number

export type Funcao = { tipo: 'funcao'; nome: string; expr: string; cor: Cor; rotulo: string }

/**
 * Como o ponto se apresenta: só o nome, nome e coordenadas, só a bolinha, ou
 * escondido — o ponto que existe só para apoiar um vetor ou uma reta.
 */
export type RotuloPonto = 'nome' | 'coordenadas' | 'nada' | 'oculto'

export type Ponto = { tipo: 'ponto'; nome: string; x: string; y: string; cor: Cor; rotulo: RotuloPonto }

export type TipoLigacao = 'segmento' | 'reta' | 'vetor'

/** Segmento, reta ou vetor entre dois pontos do gráfico, pelo nome. */
export type Ligacao = { tipo: TipoLigacao; de: string; ate: string; cor: Cor; rotulo: string }

export type Objeto = Funcao | Ponto | Ligacao

export type Grafico = {
  v: 1
  /** A variável do eixo horizontal: `x` na Matemática, `t` na Cinemática. */
  variavel: string
  janela: Janela
  /** Altura da área de desenho, em px. A largura é a da coluna. */
  altura: number
  grade: boolean
  /** Nome dos eixos ("t (s)", "s (m)"). Vazio = a variável e nada. */
  eixoX: string
  eixoY: string
  parametros: Parametro[]
  objetos: Objeto[]
  titulo: string
  legenda: string
}

export const LIMITES = {
  objetos: 12,
  parametros: 6,
  texto: 160,
  rotulo: 40,
  /** Nenhum número da receita passa disto: o desenho trabalha em float. */
  modulo: 1e6,
  alturaMin: 200,
  alturaMax: 640,
  cores: 6,
} as const

export const ALTURA_PADRAO = 360

/** Nome de variável, parâmetro ou função: uma letra, e um índice opcional. */
export const NOME_VALIDO = /^\p{L}(?:\d+|_[\p{L}\d]+)?$/u

/** Nome de ponto: letra maiúscula, com índice opcional (`A`, `P1`, `B_2`). */
export const NOME_PONTO = /^\p{Lu}(?:\d+|_[\p{L}\d]+)?$/u

const RESERVADOS = new Set(['e', 'pi', 'π'])

export function grafico(parcial: Partial<Grafico> = {}): Grafico {
  return {
    v: 1,
    variavel: 'x',
    janela: { xmin: -6, xmax: 6, ymin: -4, ymax: 4 },
    altura: ALTURA_PADRAO,
    grade: true,
    eixoX: '',
    eixoY: '',
    parametros: [],
    objetos: [],
    titulo: '',
    legenda: '',
    ...parcial,
  }
}

// ---------------------------------------------------------------- leitura

function texto(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : ''
}

function numero(v: unknown, padrao: number): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN
  return Number.isFinite(n) && Math.abs(n) <= LIMITES.modulo ? n : padrao
}

function cor(v: unknown, padrao: number): Cor {
  const n = Math.round(numero(v, padrao))
  return n >= 1 && n <= LIMITES.cores ? n : padrao
}

function nome(v: unknown, re: RegExp): string | null {
  return typeof v === 'string' && re.test(v) ? v : null
}

function objeto(o: unknown): Record<string, unknown> {
  return o && typeof o === 'object' && !Array.isArray(o) ? (o as Record<string, unknown>) : {}
}

/**
 * Lê a receita de forma DEFENSIVA. Ela chega de um atributo do corpo, que é
 * HTML cru na página do aluno: tudo é conferido campo a campo, numa lista
 * branca. O que não passa é descartado — o objeto inteiro, se for o caso —,
 * e uma receita sem conserto devolve `null`.
 */
export function lerConfig(bruto: unknown): Grafico | null {
  let dado: unknown = bruto
  if (typeof bruto === 'string') {
    try {
      dado = JSON.parse(bruto)
    } catch {
      return null
    }
  }
  const o = objeto(dado)
  if (o.v !== 1) return null

  const j = objeto(o.janela)
  const janela: Janela = {
    xmin: numero(j.xmin, -6),
    xmax: numero(j.xmax, 6),
    ymin: numero(j.ymin, -4),
    ymax: numero(j.ymax, 4),
  }
  if (!(janela.xmax > janela.xmin) || !(janela.ymax > janela.ymin)) return null

  const variavel = nome(o.variavel, NOME_VALIDO) ?? 'x'
  const usados = new Set<string>([variavel])

  const parametros: Parametro[] = []
  for (const bruto of Array.isArray(o.parametros) ? o.parametros.slice(0, LIMITES.parametros) : []) {
    const p = objeto(bruto)
    const n = nome(p.nome, NOME_VALIDO)
    if (!n || usados.has(n) || RESERVADOS.has(n)) continue
    const min = numero(p.min, 0)
    const max = numero(p.max, 1)
    if (!(max > min)) continue
    const passoBruto = numero(p.passo, (max - min) / 100)
    const passo = passoBruto > 0 ? passoBruto : (max - min) / 100
    const valor = Math.min(max, Math.max(min, numero(p.valor, min)))
    usados.add(n)
    parametros.push({ nome: n, min, max, passo, valor })
  }

  const objetos: Objeto[] = []
  for (const bruto of Array.isArray(o.objetos) ? o.objetos.slice(0, LIMITES.objetos) : []) {
    const b = objeto(bruto)
    const corO = cor(b.cor, 1)
    if (b.tipo === 'funcao') {
      const n = nome(b.nome, NOME_VALIDO)
      if (!n || usados.has(n) || RESERVADOS.has(n)) continue
      usados.add(n)
      objetos.push({ tipo: 'funcao', nome: n, expr: texto(b.expr, EXPRESSAO_MAX), cor: corO, rotulo: texto(b.rotulo, LIMITES.rotulo) })
    } else if (b.tipo === 'ponto') {
      const n = nome(b.nome, NOME_PONTO)
      if (!n || objetos.some((x) => x.tipo === 'ponto' && x.nome === n)) continue
      const rotulo: RotuloPonto =
        b.rotulo === 'coordenadas' || b.rotulo === 'nada' || b.rotulo === 'oculto' ? b.rotulo : 'nome'
      objetos.push({ tipo: 'ponto', nome: n, x: texto(b.x, EXPRESSAO_MAX), y: texto(b.y, EXPRESSAO_MAX), cor: corO, rotulo })
    } else if (b.tipo === 'segmento' || b.tipo === 'reta' || b.tipo === 'vetor') {
      const de = nome(b.de, NOME_PONTO)
      const ate = nome(b.ate, NOME_PONTO)
      if (!de || !ate) continue
      objetos.push({ tipo: b.tipo, de, ate, cor: corO, rotulo: texto(b.rotulo, LIMITES.rotulo) })
    }
  }

  return {
    v: 1,
    variavel,
    janela,
    altura: Math.round(Math.min(LIMITES.alturaMax, Math.max(LIMITES.alturaMin, numero(o.altura, ALTURA_PADRAO)))),
    grade: o.grade !== false,
    eixoX: texto(o.eixoX, LIMITES.rotulo),
    eixoY: texto(o.eixoY, LIMITES.rotulo),
    parametros,
    objetos,
    titulo: texto(o.titulo, LIMITES.texto),
    legenda: texto(o.legenda, LIMITES.texto),
  }
}

/**
 * Grava a receita para o atributo `data-config`.
 *
 * Dentro das STRINGS do JSON, `< > & $ [ ] '` saem como `\uXXXX`. Não é
 * capricho, cada um tem um leitor que o pegaria:
 *
 * - `[[` e `]]` — o trigger `sync_conexoes_resumo` lê o `corpo` CRU com
 *   `\[\[(.+?)\]\]` (decisão 1). Um rótulo "[[Dinâmica]]" viraria uma conexão
 *   fantasma no grafo. A estrutura da receita não tem array dentro de array,
 *   então fora das strings `[[` nunca aparece.
 * - `$` — a passada de `$…$` de `lib/matematica.ts` (decisão 8).
 * - `<` `>` `&` — o atributo sobrevive a qualquer serialização de HTML.
 */
export function escreverConfig(g: Grafico): string {
  return JSON.stringify(g).replace(/"(?:[^"\\]|\\.)*"/g, (s) =>
    s.replace(/[<>&$[\]']/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')),
  )
}

// ---------------------------------------------------------------- compilação

export type Compilado = {
  g: Grafico
  /** Erro de cada objeto, pelo índice em `g.objetos`. */
  erros: Map<number, string>
  /** Letras usadas nas expressões que não têm controle nem são a variável. */
  faltando: string[]
  arvores: Map<number, { a: No; b?: No }>
}

/** Lê cada expressão uma vez. O desenho calcula a partir das árvores. */
export function compilar(g: Grafico): Compilado {
  const nomesFuncao = g.objetos.filter((o): o is Funcao => o.tipo === 'funcao').map((f) => f.nome)
  const conhecidos = new Set([...g.parametros.map((p) => p.nome)])
  const pontos = new Set(g.objetos.filter((o) => o.tipo === 'ponto').map((o) => (o as Ponto).nome))
  const erros = new Map<number, string>()
  const arvores = new Map<number, { a: No; b?: No }>()
  const faltando = new Set<string>()

  const ler = (expr: string, i: number, livres: Set<string>, rotulo = '') => {
    try {
      const a = lerExpressao(expr, nomesFuncao)
      for (const v of variaveisDe(a)) if (!livres.has(v)) faltando.add(v)
      return a
    } catch (e) {
      const msg = e instanceof ErroExpressao ? e.message : 'expressão inválida'
      if (!erros.has(i)) erros.set(i, rotulo ? `${rotulo}: ${msg}` : msg)
      return null
    }
  }

  g.objetos.forEach((o, i) => {
    if (o.tipo === 'funcao') {
      const a = ler(o.expr, i, new Set([...conhecidos, g.variavel]))
      if (a) {
        if (chamadasDe(a).has(o.nome)) erros.set(i, `${o.nome} não pode usar a si mesma`)
        else arvores.set(i, { a })
      }
    } else if (o.tipo === 'ponto') {
      const a = ler(o.x, i, conhecidos, 'x')
      const b = ler(o.y, i, conhecidos, 'y')
      if (a && b) arvores.set(i, { a, b })
    } else {
      for (const p of [o.de, o.ate]) {
        if (!pontos.has(p) && !erros.has(i)) erros.set(i, `não existe ponto ${p}`)
      }
      if (o.de === o.ate && !erros.has(i)) erros.set(i, 'escolha dois pontos diferentes')
    }
  })

  return { g, erros, faltando: [...faltando].filter((v) => v !== g.variavel), arvores }
}

/** Ambiente de cálculo com os valores atuais dos parâmetros. */
export function preparar(c: Compilado, valores: Record<string, number>) {
  const vars: Record<string, number> = Object.create(null)
  for (const p of c.g.parametros) vars[p.nome] = valores[p.nome] ?? p.valor
  const funcoes: Record<string, (x: number) => number> = Object.create(null)
  // Profundidade de chamada: `f` usa `g` que usa `f` daria laço infinito, e
  // a conferência só barra o caso direto (`f` dentro de `f`).
  let profundidade = 0
  c.g.objetos.forEach((o, i) => {
    const arv = c.arvores.get(i)
    if (o.tipo !== 'funcao' || !arv) return
    funcoes[o.nome] = (x: number) => {
      if (profundidade > 8) return NaN
      profundidade++
      try {
        return calcular(arv.a, { vars: { ...vars, [c.g.variavel]: x }, funcoes })
      } finally {
        profundidade--
      }
    }
  })
  const pontos = new Map<string, { x: number; y: number }>()
  c.g.objetos.forEach((o, i) => {
    const arv = c.arvores.get(i)
    if (o.tipo !== 'ponto' || !arv?.b) return
    pontos.set(o.nome, { x: calcular(arv.a, { vars, funcoes }), y: calcular(arv.b, { vars, funcoes }) })
  })
  return { vars, funcoes, pontos }
}

export function valoresIniciais(g: Grafico): Record<string, number> {
  return Object.fromEntries(g.parametros.map((p) => [p.nome, p.valor]))
}

/** Quantas casas decimais o passo do controle pede (0,1 → 1; 0,05 → 2). */
export function casasDoPasso(passo: number): number {
  for (let k = 0; k <= 6; k++) if (Math.abs(Math.round(passo * 10 ** k) - passo * 10 ** k) < 1e-9) return k
  return 3
}

/** Um valor com vírgula decimal e sem rabo de float (`0,30000000004`). */
export function formatarNumero(v: number, casas = 3): string {
  if (!Number.isFinite(v)) return '—'
  const r = Number(v.toFixed(casas))
  return (Object.is(r, -0) ? 0 : r).toLocaleString('pt-BR', { maximumFractionDigits: casas })
}

// ---------------------------------------------------------------- exemplos

/** Pontos de partida do "Começar de um exemplo…" do painel. */
export const EXEMPLOS: { nome: string; g: Grafico }[] = [
  {
    nome: 'Parábola: y = ax² + bx + c',
    g: grafico({
      parametros: [
        { nome: 'a', min: -3, max: 3, passo: 0.1, valor: 1 },
        { nome: 'b', min: -5, max: 5, passo: 0.1, valor: 0 },
        { nome: 'c', min: -5, max: 5, passo: 0.1, valor: -2 },
      ],
      objetos: [{ tipo: 'funcao', nome: 'f', expr: 'ax^2 + bx + c', cor: 1, rotulo: '' }],
    }),
  },
  {
    nome: 'Reta: y = ax + b',
    g: grafico({
      parametros: [
        { nome: 'a', min: -4, max: 4, passo: 0.1, valor: 1 },
        { nome: 'b', min: -4, max: 4, passo: 0.1, valor: 1 },
      ],
      objetos: [
        { tipo: 'funcao', nome: 'f', expr: 'ax + b', cor: 1, rotulo: '' },
        { tipo: 'ponto', nome: 'B', x: '0', y: 'b', cor: 2, rotulo: 'coordenadas' },
      ],
    }),
  },
  {
    nome: 'Senoide: y = A·sen(kx)',
    g: grafico({
      janela: { xmin: -7, xmax: 7, ymin: -3, ymax: 3 },
      parametros: [
        { nome: 'A', min: 0, max: 2.5, passo: 0.1, valor: 1 },
        { nome: 'k', min: 0.2, max: 4, passo: 0.1, valor: 1 },
      ],
      objetos: [
        { tipo: 'funcao', nome: 'f', expr: 'A sen(kx)', cor: 1, rotulo: '' },
        { tipo: 'funcao', nome: 'g', expr: 'sen(x)', cor: 3, rotulo: '' },
      ],
    }),
  },
  {
    nome: 'MRU: s = s₀ + vt',
    g: grafico({
      variavel: 't',
      janela: { xmin: -1, xmax: 10, ymin: -10, ymax: 30 },
      eixoX: 't (s)',
      eixoY: 's (m)',
      parametros: [
        { nome: 's_0', min: -10, max: 20, passo: 1, valor: 5 },
        { nome: 'v', min: -4, max: 4, passo: 0.5, valor: 2 },
      ],
      objetos: [{ tipo: 'funcao', nome: 's', expr: 's_0 + vt', cor: 1, rotulo: '' }],
    }),
  },
  {
    nome: 'Reta tangente num ponto',
    g: grafico({
      parametros: [{ nome: 'p', min: -2.5, max: 2.5, passo: 0.05, valor: 1 }],
      objetos: [
        { tipo: 'funcao', nome: 'f', expr: 'x^3/3 - x', cor: 1, rotulo: '' },
        { tipo: 'funcao', nome: 't', expr: '(p^2 - 1)(x - p) + f(p)', cor: 2, rotulo: 'reta tangente' },
        { tipo: 'ponto', nome: 'P', x: 'p', y: 'f(p)', cor: 2, rotulo: 'coordenadas' },
      ],
    }),
  },
  {
    nome: 'Soma de vetores',
    g: grafico({
      janela: { xmin: -1, xmax: 9, ymin: -1, ymax: 6 },
      grade: true,
      parametros: [
        { nome: 'a', min: -3, max: 6, passo: 0.5, valor: 4 },
        { nome: 'b', min: -3, max: 6, passo: 0.5, valor: 1 },
        { nome: 'c', min: -3, max: 6, passo: 0.5, valor: 1 },
        { nome: 'd', min: -3, max: 6, passo: 0.5, valor: 3 },
      ],
      objetos: [
        { tipo: 'ponto', nome: 'O', x: '0', y: '0', cor: 6, rotulo: 'oculto' },
        { tipo: 'ponto', nome: 'A', x: 'a', y: 'b', cor: 1, rotulo: 'oculto' },
        { tipo: 'ponto', nome: 'S', x: 'a + c', y: 'b + d', cor: 5, rotulo: 'oculto' },
        { tipo: 'vetor', de: 'O', ate: 'A', cor: 1, rotulo: 'u' },
        { tipo: 'vetor', de: 'A', ate: 'S', cor: 2, rotulo: 'v' },
        { tipo: 'vetor', de: 'O', ate: 'S', cor: 5, rotulo: 'u + v' },
      ],
    }),
  },
]

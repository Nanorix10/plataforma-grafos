/**
 * Leitor de expressões do gráfico interativo (decisão 34).
 *
 * Transforma o texto que o autor digita (`ax^2 + bx + c`, `3sen(x)`, `f(a)`)
 * numa árvore, e a árvore numa função que calcula. **Nunca usa `eval` nem
 * `new Function`**: o texto vem do corpo do resumo, que é HTML cru na página
 * do aluno, e uma expressão é dado, não código.
 *
 * Roda nos três lugares que desenham o gráfico — servidor, editor e o
 * navegador do aluno —, por isso não importa nada.
 *
 * ## A regra das letras
 *
 * Toda VARIÁVEL tem uma letra só (`x`, `a`, `θ`), com um índice opcional
 * colado (`s0`, `v_0`, `v_max`). Só nome de função conhecido
 * (`sen`, `raiz`, `ln`) e a constante `pi` têm mais de uma. É essa regra que
 * permite escrever como no caderno: `ax` é `a·x`, `2bx` é `2·b·x`. O custo é
 * que `vel` não é uma variável — é `v·e·l`.
 *
 * Letra seguida de `(` é chamada de função quando a letra é o nome de uma
 * função DO GRÁFICO (`f(a)`). Fora disso é multiplicação: `a(x+1)` é
 * `a·(x+1)`.
 *
 * ## Vírgula decimal
 *
 * `2,5` é dois e meio, como na escola. Nenhuma função aceita dois
 * argumentos, então a vírgula não tem outro papel aqui.
 */

export type No =
  | { t: 'num'; v: number }
  | { t: 'var'; nome: string }
  | { t: 'un'; op: '-'; a: No }
  | { t: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: No; b: No; implicito?: boolean }
  | { t: 'fn'; nome: string; a: No }
  | { t: 'chama'; nome: string; a: No }

export class ErroExpressao extends Error {
  posicao: number
  constructor(mensagem: string, posicao: number) {
    super(mensagem)
    this.posicao = posicao
  }
}

/** Tamanho máximo de uma expressão. Mais do que isso não é gráfico de resumo. */
export const EXPRESSAO_MAX = 200

/** Funções embutidas. Os apelidos em português são os da escola. */
const FUNCOES: Record<string, (v: number) => number> = {
  sen: Math.sin,
  sin: Math.sin,
  cos: Math.cos,
  tg: Math.tan,
  tan: Math.tan,
  raiz: Math.sqrt,
  sqrt: Math.sqrt,
  abs: Math.abs,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
}

/** Nome canônico de cada função, para o LaTeX. */
const LATEX_FUNCAO: Record<string, string> = {
  sen: '\\operatorname{sen}',
  sin: '\\operatorname{sen}',
  cos: '\\cos',
  tg: '\\operatorname{tg}',
  tan: '\\operatorname{tg}',
  ln: '\\ln',
  log: '\\log',
  exp: '\\exp',
}

const CONSTANTES: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E }

// Os nomes de várias letras, do mais longo para o mais curto, e eles ganham
// de qualquer leitura letra a letra: `senx` é `sen x`, `pi` é π (não `p·i`).
// Quem quiser duas variáveis `p` e `i` coladas escreve `p i` ou `p*i`.
const NOMES_LONGOS = [...Object.keys(FUNCOES), 'pi'].sort((a, b) => b.length - a.length)

type Ficha =
  | { k: 'num'; v: number; p: number }
  | { k: 'id'; v: string; p: number }
  | { k: 'op'; v: string; p: number }

function eLetra(c: string) {
  return /\p{L}/u.test(c)
}

function fatiar(texto: string): Ficha[] {
  const fichas: Ficha[] = []
  let i = 0
  while (i < texto.length) {
    const c = texto[i]
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (/[0-9]/.test(c) || ((c === '.' || c === ',') && /[0-9]/.test(texto[i + 1] ?? ''))) {
      let j = i
      let separador = false
      while (j < texto.length) {
        const d = texto[j]
        if (/[0-9]/.test(d)) j++
        else if ((d === '.' || d === ',') && !separador && /[0-9]/.test(texto[j + 1] ?? '')) {
          separador = true
          j++
        } else break
      }
      fichas.push({ k: 'num', v: Number(texto.slice(i, j).replace(',', '.')), p: i })
      i = j
      continue
    }
    if (eLetra(c)) {
      const resto = texto.slice(i).toLowerCase()
      const longo = NOMES_LONGOS.find((n) => resto.startsWith(n))
      if (longo) {
        fichas.push({ k: 'id', v: longo, p: i })
        i += longo.length
      } else {
        // uma letra, e o índice dela se houver: `s0`, `v_0`, `v_max`
        const indice = /^(\d+|_[\p{L}\d]+)/u.exec(texto.slice(i + 1))?.[0] ?? ''
        fichas.push({ k: 'id', v: c + indice, p: i })
        i += 1 + indice.length
      }
      continue
    }
    // `x²` colado de fora: vira `x^2`
    if (c === '²' || c === '³') {
      fichas.push({ k: 'op', v: '^', p: i }, { k: 'num', v: c === '²' ? 2 : 3, p: i })
      i++
      continue
    }
    if ('+-*/^()·×−'.includes(c)) {
      const op = c === '·' || c === '×' ? '*' : c === '−' ? '-' : c
      fichas.push({ k: 'op', v: op, p: i })
      i++
      continue
    }
    throw new ErroExpressao(`não entendi o caractere “${c}”`, i)
  }
  return fichas
}

/** Precedência: `^` > unário > `*` `/` implícito > `+` `-`. */
class Leitor {
  private i = 0
  private fichas: Ficha[]
  private funcoesDoGrafico: Set<string>
  private fim: number
  constructor(fichas: Ficha[], funcoesDoGrafico: Set<string>, fim: number) {
    this.fichas = fichas
    this.funcoesDoGrafico = funcoesDoGrafico
    this.fim = fim
  }

  ler(): No {
    if (this.fichas.length === 0) throw new ErroExpressao('a expressão está vazia', 0)
    const no = this.soma()
    if (this.i < this.fichas.length) {
      const f = this.fichas[this.i]
      throw new ErroExpressao(`não entendi a partir de “${f.v}”`, f.p)
    }
    return no
  }

  private espia() {
    return this.fichas[this.i]
  }

  private posAtual() {
    return this.espia()?.p ?? this.fim
  }

  private soma(): No {
    let no = this.produto()
    for (;;) {
      const f = this.espia()
      if (f?.k === 'op' && (f.v === '+' || f.v === '-')) {
        this.i++
        no = { t: 'bin', op: f.v, a: no, b: this.produto() }
      } else return no
    }
  }

  private produto(): No {
    let no = this.unario()
    for (;;) {
      const f = this.espia()
      if (f?.k === 'op' && (f.v === '*' || f.v === '/')) {
        this.i++
        no = { t: 'bin', op: f.v, a: no, b: this.unario() }
      } else if (f && (f.k === 'num' || f.k === 'id' || (f.k === 'op' && f.v === '('))) {
        // multiplicação implícita: `2x`, `ax`, `a(x+1)`, `x sen(x)`
        no = { t: 'bin', op: '*', a: no, b: this.potencia(), implicito: true }
      } else return no
    }
  }

  private unario(): No {
    const f = this.espia()
    if (f?.k === 'op' && (f.v === '-' || f.v === '+')) {
      this.i++
      const a = this.unario()
      return f.v === '-' ? { t: 'un', op: '-', a } : a
    }
    return this.potencia()
  }

  /** `^` associa à direita: `2^3^2` é `2^9`. E `-x^2` é `-(x^2)`. */
  private potencia(): No {
    const base = this.atomo()
    const f = this.espia()
    if (f?.k === 'op' && f.v === '^') {
      this.i++
      if (!this.espia()) throw new ErroExpressao('falta o expoente depois de “^”', this.posAtual())
      return { t: 'bin', op: '^', a: base, b: this.unario() }
    }
    return base
  }

  private atomo(): No {
    const f = this.espia()
    if (!f) throw new ErroExpressao('a expressão termina no meio', this.fim)
    if (f.k === 'num') {
      this.i++
      return { t: 'num', v: f.v }
    }
    if (f.k === 'op' && f.v === '(') {
      this.i++
      const dentro = this.soma()
      this.fechar(f.p)
      return dentro
    }
    if (f.k === 'id') {
      this.i++
      if (f.v in FUNCOES) {
        const prox = this.espia()
        // `sen(x)` ou `sen x` (como no caderno: `sen x` = `sen(x)`)
        if (prox?.k === 'op' && prox.v === '(') {
          this.i++
          const a = this.soma()
          this.fechar(prox.p)
          return { t: 'fn', nome: f.v, a }
        }
        if (!prox) throw new ErroExpressao(`falta o que vem depois de “${f.v}”`, this.fim)
        return { t: 'fn', nome: f.v, a: this.potencia() }
      }
      const prox = this.espia()
      if (this.funcoesDoGrafico.has(f.v) && prox?.k === 'op' && prox.v === '(') {
        this.i++
        const a = this.soma()
        this.fechar(prox.p)
        return { t: 'chama', nome: f.v, a }
      }
      return { t: 'var', nome: f.v }
    }
    throw new ErroExpressao(`não esperava “${f.v}” aqui`, f.p)
  }

  private fechar(abertura: number) {
    const f = this.espia()
    if (f?.k === 'op' && f.v === ')') {
      this.i++
      return
    }
    throw new ErroExpressao('falta fechar o parêntese', f?.p ?? abertura)
  }
}

/**
 * Lê `texto` e devolve a árvore. Lança `ErroExpressao` com uma mensagem para
 * mostrar ao autor.
 *
 * `funcoesDoGrafico` são os nomes que, seguidos de `(`, viram chamada
 * (`f(a)`). Sem eles, `f(a)` seria `f·a`.
 */
export function lerExpressao(texto: string, funcoesDoGrafico: Iterable<string> = []): No {
  if (texto.length > EXPRESSAO_MAX) {
    throw new ErroExpressao(`a expressão passa de ${EXPRESSAO_MAX} caracteres`, EXPRESSAO_MAX)
  }
  return new Leitor(fatiar(texto), new Set(funcoesDoGrafico), texto.length).ler()
}

/** As variáveis livres que a expressão usa (sem constantes). */
export function variaveisDe(no: No, saida = new Set<string>()): Set<string> {
  switch (no.t) {
    case 'var':
      if (!(no.nome in CONSTANTES)) saida.add(no.nome)
      break
    case 'un':
    case 'fn':
      variaveisDe(no.a, saida)
      break
    case 'chama':
      variaveisDe(no.a, saida)
      break
    case 'bin':
      variaveisDe(no.a, saida)
      variaveisDe(no.b, saida)
      break
  }
  return saida
}

/** As funções do gráfico que a expressão chama (`f` em `f(a)`). */
export function chamadasDe(no: No, saida = new Set<string>()): Set<string> {
  if (no.t === 'chama') saida.add(no.nome)
  if (no.t === 'un' || no.t === 'fn' || no.t === 'chama') chamadasDe(no.a, saida)
  if (no.t === 'bin') {
    chamadasDe(no.a, saida)
    chamadasDe(no.b, saida)
  }
  return saida
}

export type Ambiente = {
  /** Valor de cada variável (parâmetros e o `x`). */
  vars: Record<string, number>
  /** Funções do gráfico já compiladas, para `f(a)`. */
  funcoes: Record<string, (x: number) => number>
  /** Profundidade de chamada, contra `f(x) = f(x)`. */
  profundidade?: number
}

/**
 * Calcula a árvore. Variável desconhecida dá `NaN` (o desenho só pula o
 * ponto); o painel do editor avisa antes, então isso só acontece com config
 * velha ou forjada.
 */
export function calcular(no: No, amb: Ambiente): number {
  switch (no.t) {
    case 'num':
      return no.v
    case 'var':
      if (Object.prototype.hasOwnProperty.call(amb.vars, no.nome)) return amb.vars[no.nome]
      if (no.nome in CONSTANTES) return CONSTANTES[no.nome]
      return NaN
    case 'un':
      return -calcular(no.a, amb)
    case 'fn':
      return FUNCOES[no.nome](calcular(no.a, amb))
    case 'chama': {
      const f = Object.prototype.hasOwnProperty.call(amb.funcoes, no.nome) ? amb.funcoes[no.nome] : null
      return f ? f(calcular(no.a, amb)) : NaN
    }
    case 'bin': {
      const a = calcular(no.a, amb)
      const b = calcular(no.b, amb)
      switch (no.op) {
        case '+':
          return a + b
        case '-':
          return a - b
        case '*':
          return a * b
        case '/':
          return a / b
        case '^':
          return Math.pow(a, b)
      }
    }
  }
}

// ---------------------------------------------------------------- LaTeX

const PREC: Record<string, number> = { soma: 1, produto: 2, unario: 3, potencia: 4, atomo: 5 }

function precedencia(no: No): number {
  if (no.t === 'bin') {
    if (no.op === '+' || no.op === '-') return PREC.soma
    if (no.op === '*' || no.op === '/') return PREC.produto
    return PREC.potencia
  }
  if (no.t === 'un') return PREC.unario
  return PREC.atomo
}

function numeroLatex(v: number) {
  // vírgula decimal, como o aluno escreve; `{,}` impede o espaço que o TeX põe
  // depois de vírgula
  return String(Number(v.toPrecision(10))).replace('.', '{,}')
}

export function nomeLatex(nome: string) {
  if (nome === 'pi' || nome === 'π') return '\\pi'
  const gregas: Record<string, string> = {
    α: '\\alpha', β: '\\beta', γ: '\\gamma', δ: '\\delta', θ: '\\theta', λ: '\\lambda',
    μ: '\\mu', ω: '\\omega', φ: '\\varphi', ρ: '\\rho', σ: '\\sigma', τ: '\\tau',
  }
  const m = /^(\p{L})_?([\p{L}\d]*)$/u.exec(nome)
  if (!m) return '?'
  const letra = gregas[m[1]] ?? (/^[a-zA-Z]$/.test(m[1]) ? m[1] : '?')
  if (!m[2]) return letra
  const indice = /^\d+$/.test(m[2]) || m[2].length === 1 ? m[2] : `\\text{${m[2].replace(/[^a-zA-Z\d]/g, '')}}`
  return `${letra}_{${indice}}`
}

/** Começa com algo que não pode vir colado num número (`2x`, mas `2·3`). */
function comecaComNumero(no: No): boolean {
  if (no.t === 'num') return true
  if (no.t === 'bin') return comecaComNumero(no.a)
  return false
}

/** Converte a árvore em LaTeX, para o rótulo `f(x) = …` da legenda. */
export function paraLatex(no: No): string {
  const emvolta = (filho: No, minimo: number) => {
    const s = paraLatex(filho)
    return precedencia(filho) < minimo ? `\\left(${s}\\right)` : s
  }
  switch (no.t) {
    case 'num':
      return numeroLatex(no.v)
    case 'var':
      return nomeLatex(no.nome)
    case 'un':
      return `-${emvolta(no.a, PREC.unario)}`
    case 'fn':
      if (no.nome === 'raiz' || no.nome === 'sqrt') return `\\sqrt{${paraLatex(no.a)}}`
      if (no.nome === 'abs') return `\\left|${paraLatex(no.a)}\\right|`
      return `${LATEX_FUNCAO[no.nome]}\\left(${paraLatex(no.a)}\\right)`
    case 'chama':
      return `${nomeLatex(no.nome)}\\left(${paraLatex(no.a)}\\right)`
    case 'bin':
      switch (no.op) {
        case '+':
          return `${paraLatex(no.a)} + ${emvolta(no.b, PREC.soma)}`
        case '-':
          return `${paraLatex(no.a)} - ${emvolta(no.b, PREC.produto)}`
        case '/':
          return `\\frac{${paraLatex(no.a)}}{${paraLatex(no.b)}}`
        case '^': {
          const base = no.a.t === 'fn' || no.a.t === 'chama' ? `\\left(${paraLatex(no.a)}\\right)` : emvolta(no.a, PREC.atomo)
          return `${base}^{${paraLatex(no.b)}}`
        }
        case '*': {
          const a = emvolta(no.a, PREC.produto)
          const b = emvolta(no.b, PREC.unario)
          // `2x`, `ax`: sem sinal, como no caderno. Número depois de algo
          // precisa do ponto, senão `x·2` viraria `x2`.
          const sinal = comecaComNumero(no.b) || no.b.t === 'un' ? ' \\cdot ' : ' '
          return `${a}${sinal}${b}`
        }
      }
  }
}

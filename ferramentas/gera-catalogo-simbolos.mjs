/**
 * Gera `src/app/(app)/admin/editor/catalogo.ts` — o catálogo completo de
 * símbolos do editor de equações.
 *
 * Rode da raiz do projeto:  node ferramentas/gera-catalogo-simbolos.mjs
 *
 * POR QUE ISTO É GERADO, E NÃO ESCRITO À MÃO
 * -----------------------------------------
 * O pedido era "todos os símbolos matemáticos". O teto real não é o Unicode: é
 * o que o KaTeX sabe desenhar — a prévia usa `throwOnError: true` e o botão de
 * inserir trava no erro, então símbolo que o KaTeX não conhece não teria como
 * ser escrito de qualquer jeito. Este arquivo lê `node_modules/katex/src` e
 * RENDERIZA cada candidato antes de aceitá-lo. O que sai daqui é, por
 * construção, exatamente o conjunto que a tela consegue mostrar.
 *
 * Consequência: quando o KaTeX for atualizado, rode isto de novo. O `package.json`
 * prende a versão, então o catálogo não caduca sozinho.
 *
 * O QUE NÃO É GERADO
 * ------------------
 * As paletas curadas (`paletas.ts`) continuam escritas à mão: elas têm nome em
 * português, gabarito com `@` no lugar do cursor e uma ordem pensada para quem
 * está montando uma fórmula. O catálogo é a cauda longa — a garantia de que
 * nada falta —, não o substituto delas.
 */

import fs from 'node:fs'
import path from 'node:path'
import katex from 'katex'

const RAIZ = 'node_modules/katex/src/'
const DESTINO = 'src/app/(app)/admin/editor/catalogo.ts'

// ---------------------------------------------------------------------------
// 1. Colheita: tudo o que o KaTeX define como símbolo, macro ou função
// ---------------------------------------------------------------------------

const fonte = fs.readFileSync(RAIZ + 'symbols.ts', 'utf8')
const fonteMacros = fs.readFileSync(RAIZ + 'macros.ts', 'utf8')

/** `defineSymbol(modo, fonte, grupo, "troca", "\\nome")` */
const RE_SIMBOLO = new RegExp(
  '^defineSymbol\\(\\s*(\\w+)\\s*,\\s*(\\w+)\\s*,\\s*(\\w+)\\s*,' +
    '\\s*("(?:[^"\\\\]|\\\\.)*"|null)\\s*,\\s*"((?:[^"\\\\]|\\\\.)*)"',
)

const candidatos = new Map() // latex -> { grupo, chr }

for (const linha of fonte.split('\n')) {
  const m = linha.match(RE_SIMBOLO)
  if (!m) continue
  const [, modo, , grupo, troca, nomeBruto] = m
  if (modo !== 'math') continue
  const latex = JSON.parse('"' + nomeBruto + '"')
  if (!/^\\[a-zA-Z]+$/.test(latex)) continue
  candidatos.set(latex, { grupo, chr: troca === 'null' ? '' : JSON.parse(troca) })
}

for (const m of fonteMacros.matchAll(/defineMacro\(\s*"((?:[^"\\]|\\.)*)"/g)) {
  const latex = JSON.parse('"' + m[1] + '"')
  if (!/^\\[a-zA-Z]+$/.test(latex)) continue
  if (!candidatos.has(latex)) candidatos.set(latex, { grupo: 'macro', chr: '' })
}

/**
 * Comandos que só existem em `functions/` e que PEDEM ARGUMENTO. `symbols.ts` e
 * `macros.ts` não os conhecem, e renderizá-los sozinhos falha — por isso vêm
 * com gabarito escrito à mão, onde `@` marca onde o cursor para. O gabarito é
 * conferido igual ao resto: o que não renderiza com um `x` no buraco não entra.
 */
const COM_ARGUMENTO = {
  funcoes: [
    ...('sin cos tan cot sec csc arcsin arccos arctan sinh cosh tanh coth exp lg ln log'
      .split(' ')
      .map((f) => [`\\${f}(@)`, `\\${f}`])),
    ['\\log_{@}', '\\log_b'],
    ['\\sqrt[@]{}', '\\sqrt[n]{x}'],
    ['\\lim_{@ \\to }', '\\lim'],
    ['\\limsup_{@}', '\\limsup'],
    ['\\liminf_{@}', '\\liminf'],
    ['\\max_{@}', '\\max'],
    ['\\min_{@}', '\\min'],
    ['\\sup_{@}', '\\sup'],
    ['\\inf_{@}', '\\inf'],
    ['\\det(@)', '\\det'],
    ['\\dim(@)', '\\dim'],
    ['\\deg(@)', '\\deg'],
    ['\\ker(@)', '\\ker'],
    ['\\arg(@)', '\\arg'],
    ['\\gcd(@)', '\\gcd'],
    ['\\Pr(@)', '\\Pr'],
    ['\\operatorname{@}', '\\operatorname{f}'],
    ['@ \\pmod{}', 'a \\pmod b'],
  ],
  acentos: [
    ['\\hat{@}', '\\hat{x}'],
    ['\\widehat{@}', '\\widehat{xy}'],
    ['\\bar{@}', '\\bar{x}'],
    ['\\overline{@}', '\\overline{xy}'],
    ['\\underline{@}', '\\underline{xy}'],
    ['\\vec{@}', '\\vec{v}'],
    ['\\dot{@}', '\\dot{x}'],
    ['\\ddot{@}', '\\ddot{x}'],
    ['\\dddot{@}', '\\dddot{x}'],
    ['\\ddddot{@}', '\\ddddot{x}'],
    ['\\tilde{@}', '\\tilde{x}'],
    ['\\widetilde{@}', '\\widetilde{xy}'],
    ['\\check{@}', '\\check{x}'],
    ['\\widecheck{@}', '\\widecheck{xy}'],
    ['\\acute{@}', '\\acute{x}'],
    ['\\grave{@}', '\\grave{x}'],
    ['\\breve{@}', '\\breve{x}'],
    ['\\mathring{@}', '\\mathring{x}'],
    ['\\utilde{@}', '\\utilde{x}'],
    ['\\overrightarrow{@}', '\\overrightarrow{AB}'],
    ['\\overleftarrow{@}', '\\overleftarrow{AB}'],
    ['\\overleftrightarrow{@}', '\\overleftrightarrow{AB}'],
    ['\\underrightarrow{@}', '\\underrightarrow{AB}'],
    ['\\underleftarrow{@}', '\\underleftarrow{AB}'],
    ['\\underleftrightarrow{@}', '\\underleftrightarrow{AB}'],
    ['\\overbrace{@}^{}', '\\overbrace{ab}'],
    ['\\underbrace{@}_{}', '\\underbrace{ab}'],
    ['\\overbracket{@}', '\\overbracket{ab}'],
    ['\\underbracket{@}', '\\underbracket{ab}'],
    ['\\overgroup{@}', '\\overgroup{ab}'],
    ['\\undergroup{@}', '\\undergroup{ab}'],
    ['\\overlinesegment{@}', '\\overlinesegment{ab}'],
    ['\\underlinesegment{@}', '\\underlinesegment{ab}'],
    ['\\cancel{@}', '\\cancel{xy}'],
    ['\\bcancel{@}', '\\bcancel{xy}'],
    ['\\xcancel{@}', '\\xcancel{xy}'],
    ['\\sout{@}', '\\sout{xy}'],
    ['\\boxed{@}', '\\boxed{x}'],
    ['\\phase{@}', '\\phase{x}'],
    ['\\angl{@}', '\\angl{x}'],
  ],
  estruturas: [
    ['\\frac{@}{}', '\\frac{a}{b}'],
    ['\\dfrac{@}{}', '\\dfrac{a}{b}'],
    ['\\tfrac{@}{}', '\\tfrac{a}{b}'],
    ['\\cfrac{@}{}', '\\cfrac{a}{b}'],
    ['\\binom{@}{}', '\\binom{n}{k}'],
    ['\\dbinom{@}{}', '\\dbinom{n}{k}'],
    ['\\tbinom{@}{}', '\\tbinom{n}{k}'],
    ['\\genfrac{}{}{}{}{@}{}', '\\genfrac(){}{0}{a}{b}'],
    ['\\sqrt{@}', '\\sqrt{x}'],
    ['\\substack{@ \\\\ }', '\\substack{a \\\\ b}'],
    ['\\overset{@}{}', '\\overset{a}{b}'],
    ['\\underset{@}{}', '\\underset{a}{b}'],
    ['\\stackrel{@}{}', '\\stackrel{a}{=}'],
    ['\\text{@}', '\\text{texto}'],
    ['\\textbf{@}', '\\textbf{texto}'],
    ['\\textit{@}', '\\textit{texto}'],
    ['\\phantom{@}', '\\phantom{x}'],
    ['\\vphantom{@}', '\\vphantom{x}'],
    ['\\smash{@}', '\\smash{x}'],
    ['\\left(@\\right)', '\\left(x\\right)'],
    ['\\left[@\\right]', '\\left[x\\right]'],
    ['\\left\\{@\\right\\}', '\\left\\{x\\right\\}'],
    ['\\left|@\\right|', '\\left|x\\right|'],
    ['\\left\\|@\\right\\|', '\\left\\|x\\right\\|'],
    ['\\left\\langle @\\right\\rangle', '\\left\\langle x\\right\\rangle'],
    ['\\left\\lfloor @\\right\\rfloor', '\\left\\lfloor x\\right\\rfloor'],
    ['\\left\\lceil @\\right\\rceil', '\\left\\lceil x\\right\\rceil'],
    ['\\begin{cases} @ \\\\  \\end{cases}', '\\begin{cases} a \\\\ b \\end{cases}'],
    ['\\begin{pmatrix} @ &  \\\\  &  \\end{pmatrix}', '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'],
    ['\\begin{bmatrix} @ &  \\\\  &  \\end{bmatrix}', '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}'],
    ['\\begin{Bmatrix} @ &  \\\\  &  \\end{Bmatrix}', '\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}'],
    ['\\begin{vmatrix} @ &  \\\\  &  \\end{vmatrix}', '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}'],
    ['\\begin{Vmatrix} @ &  \\\\  &  \\end{Vmatrix}', '\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}'],
    ['\\begin{matrix} @ &  \\\\  &  \\end{matrix}', '\\begin{matrix} a & b \\\\ c & d \\end{matrix}'],
    ['\\begin{array}{cc} @ &  \\\\  &  \\end{array}', '\\begin{array}{cc} a & b \\\\ c & d \\end{array}'],
    ['\\begin{aligned} @ &=  \\\\  &=  \\end{aligned}', '\\begin{aligned} a &= b \\end{aligned}'],
    ['\\xrightarrow{@}', '\\xrightarrow{f}'],
    ['\\xleftarrow{@}', '\\xleftarrow{f}'],
    ['\\xRightarrow{@}', '\\xRightarrow{f}'],
    ['\\xLeftarrow{@}', '\\xLeftarrow{f}'],
    ['\\xleftrightarrow{@}', '\\xleftrightarrow{f}'],
    ['\\xrightleftharpoons{@}{}', '\\xrightleftharpoons{a}{b}'],
    ['\\xmapsto{@}', '\\xmapsto{f}'],
    ['\\xlongequal{@}', '\\xlongequal{f}'],
  ],
  estilos: [
    ['\\mathbb{@}', '\\mathbb{R}'],
    ['\\mathcal{@}', '\\mathcal{L}'],
    ['\\mathscr{@}', '\\mathscr{L}'],
    ['\\mathfrak{@}', '\\mathfrak{g}'],
    ['\\mathbf{@}', '\\mathbf{v}'],
    ['\\mathit{@}', '\\mathit{x}'],
    ['\\mathrm{@}', '\\mathrm{d}'],
    ['\\mathsf{@}', '\\mathsf{A}'],
    ['\\mathtt{@}', '\\mathtt{A}'],
    ['\\mathnormal{@}', '\\mathnormal{x}'],
    ['\\boldsymbol{@}', '\\boldsymbol{\\alpha}'],
    ['\\bm{@}', '\\bm{v}'],
    ['\\pmb{@}', '\\pmb{\\mu}'],
    ['\\textstyle @', '\\textstyle\\sum'],
    ['\\displaystyle @', '\\displaystyle\\sum'],
    ['\\scriptstyle @', '\\scriptstyle x'],
    ['\\scriptscriptstyle @', '\\scriptscriptstyle x'],
  ],
}

/** Nomes dos comandos com argumento — a chave é o gabarito, não o comando. */
const NOMES_GABARITO = {
  '\\frac{@}{}': 'fração',
  '\\dfrac{@}{}': 'fração grande',
  '\\tfrac{@}{}': 'fração pequena',
  '\\cfrac{@}{}': 'fração continuada',
  '\\sqrt{@}': 'raiz quadrada',
  '\\sqrt[@]{}': 'raiz de índice n',
  '\\binom{@}{}': 'combinação (binomial)',
  '\\dbinom{@}{}': 'combinação grande',
  '\\tbinom{@}{}': 'combinação pequena',
  '\\genfrac{}{}{}{}{@}{}': 'fração com delimitador livre',
  '\\substack{@ \\\\ }': 'linhas empilhadas sob o operador',
  '\\overset{@}{}': 'sobrepor em cima',
  '\\underset{@}{}': 'sobrepor embaixo',
  '\\stackrel{@}{}': 'texto sobre a relação',
  '\\text{@}': 'texto normal dentro da fórmula',
  '\\textbf{@}': 'texto em negrito',
  '\\textit{@}': 'texto em itálico',
  '\\phantom{@}': 'espaço do tamanho de (invisível)',
  '\\vphantom{@}': 'altura de (invisível)',
  '\\smash{@}': 'ignorar a altura',
  '\\hat{@}': 'chapéu',
  '\\widehat{@}': 'chapéu largo',
  '\\bar{@}': 'barra em cima',
  '\\overline{@}': 'barra em cima (larga)',
  '\\underline{@}': 'barra embaixo',
  '\\vec{@}': 'vetor',
  '\\dot{@}': 'ponto em cima (derivada no tempo)',
  '\\ddot{@}': 'dois pontos em cima',
  '\\dddot{@}': 'três pontos em cima',
  '\\ddddot{@}': 'quatro pontos em cima',
  '\\tilde{@}': 'til',
  '\\widetilde{@}': 'til largo',
  '\\check{@}': 'chapéu invertido',
  '\\widecheck{@}': 'chapéu invertido largo',
  '\\acute{@}': 'acento agudo',
  '\\grave{@}': 'acento grave',
  '\\breve{@}': 'breve',
  '\\mathring{@}': 'anel em cima',
  '\\utilde{@}': 'til embaixo',
  '\\overrightarrow{@}': 'seta para a direita em cima (vetor)',
  '\\overleftarrow{@}': 'seta para a esquerda em cima',
  '\\overleftrightarrow{@}': 'seta dupla em cima',
  '\\underrightarrow{@}': 'seta para a direita embaixo',
  '\\underleftarrow{@}': 'seta para a esquerda embaixo',
  '\\underleftrightarrow{@}': 'seta dupla embaixo',
  '\\overbrace{@}^{}': 'chave em cima',
  '\\underbrace{@}_{}': 'chave embaixo',
  '\\overbracket{@}': 'colchete em cima',
  '\\underbracket{@}': 'colchete embaixo',
  '\\overgroup{@}': 'arco em cima',
  '\\undergroup{@}': 'arco embaixo',
  '\\overlinesegment{@}': 'segmento em cima',
  '\\underlinesegment{@}': 'segmento embaixo',
  '\\cancel{@}': 'cortado (risco)',
  '\\bcancel{@}': 'cortado ao contrário',
  '\\xcancel{@}': 'cortado em X',
  '\\sout{@}': 'riscado na horizontal',
  '\\boxed{@}': 'dentro de uma caixa',
  '\\phase{@}': 'fase (ângulo)',
  '\\angl{@}': 'ângulo em volta',
  '\\left(@\\right)': 'parênteses que crescem',
  '\\left[@\\right]': 'colchetes que crescem',
  '\\left\\{@\\right\\}': 'chaves que crescem',
  '\\left|@\\right|': 'módulo que cresce',
  '\\left\\|@\\right\\|': 'norma que cresce',
  '\\left\\langle @\\right\\rangle': 'ângulos que crescem',
  '\\left\\lfloor @\\right\\rfloor': 'piso que cresce',
  '\\left\\lceil @\\right\\rceil': 'teto que cresce',
  '\\begin{cases} @ \\\\  \\end{cases}': 'sistema de equações',
  '\\begin{pmatrix} @ &  \\\\  &  \\end{pmatrix}': 'matriz com parênteses',
  '\\begin{bmatrix} @ &  \\\\  &  \\end{bmatrix}': 'matriz com colchetes',
  '\\begin{Bmatrix} @ &  \\\\  &  \\end{Bmatrix}': 'matriz com chaves',
  '\\begin{vmatrix} @ &  \\\\  &  \\end{vmatrix}': 'determinante',
  '\\begin{Vmatrix} @ &  \\\\  &  \\end{Vmatrix}': 'norma de matriz',
  '\\begin{matrix} @ &  \\\\  &  \\end{matrix}': 'matriz sem delimitador',
  '\\begin{array}{cc} @ &  \\\\  &  \\end{array}': 'tabela alinhada',
  '\\begin{aligned} @ &=  \\\\  &=  \\end{aligned}': 'equações alinhadas pelo igual',
  '\\xrightarrow{@}': 'seta para a direita com texto',
  '\\xleftarrow{@}': 'seta para a esquerda com texto',
  '\\xRightarrow{@}': 'seta dupla para a direita com texto',
  '\\xLeftarrow{@}': 'seta dupla para a esquerda com texto',
  '\\xleftrightarrow{@}': 'seta de dois lados com texto',
  '\\xrightleftharpoons{@}{}': 'equilíbrio com texto',
  '\\xmapsto{@}': 'leva a, com texto',
  '\\xlongequal{@}': 'igual longo com texto',
  '\\mathbb{@}': 'vazado (conjuntos numéricos)',
  '\\mathcal{@}': 'caligráfico',
  '\\mathscr{@}': 'manuscrito',
  '\\mathfrak{@}': 'gótico (fraktur)',
  '\\mathbf{@}': 'negrito',
  '\\mathit{@}': 'itálico',
  '\\mathrm{@}': 'romano (reto)',
  '\\mathsf{@}': 'sem serifa',
  '\\mathtt{@}': 'monoespaçado',
  '\\mathnormal{@}': 'itálico matemático padrão',
  '\\boldsymbol{@}': 'símbolo em negrito',
  '\\bm{@}': 'símbolo em negrito (bm)',
  '\\pmb{@}': 'negrito falso (pmb)',
  '\\textstyle @': 'tamanho de linha',
  '\\displaystyle @': 'tamanho de bloco',
  '\\scriptstyle @': 'tamanho de índice',
  '\\scriptscriptstyle @': 'tamanho de índice de índice',
  '\\operatorname{@}': 'nome de função próprio',
  '\\log_{@}': 'logaritmo de base b',
  '\\lim_{@ \\to }': 'limite',
  '@ \\pmod{}': 'módulo (entre parênteses)',
}

// ---------------------------------------------------------------------------
// 2. Exclusões — coisas que o KaTeX define e que não são símbolo de fórmula
// ---------------------------------------------------------------------------

const FORA = [
  /^\\(blue|green|red|gold|gray|maroon|mint|purple|teal|orange|pink|kaBlue|kaGreen)[A-Z]?$/,
  // paleta legada da Khan Academy: cor, não matemática
  /^\\(newcommand|renewcommand|providecommand|def|edef|gdef|xdef|let|futurelet|global|long)$/,
  /^\\(expandafter|noexpand|relax|show|message|errmessage|end|begin)$/,
  /^\\(DOTSB|DOTSI|DOTSX|TextOrMath|html@mathml)$/,
  /^\\(KaTeX|LaTeX|TeX)$/,
  /^\\(html|htmlClass|htmlData|htmlId|htmlStyle|href|url|includegraphics|verb|raisebox)$/,
  /^\\(bgroup|egroup)$/,
  /^\\@/, // internos do KaTeX
]

const excluido = (latex) => FORA.some((re) => re.test(latex))

// ---------------------------------------------------------------------------
// 3. Validação — só entra o que de fato renderiza
// ---------------------------------------------------------------------------

function renderiza(tex) {
  try {
    return katex.renderToString(tex, { throwOnError: true, strict: false }).length > 0
  } catch {
    return false
  }
}

/** O HTML que o botão vai mostrar. É a chave da deduplicação — ver abaixo. */
function desenho(tex) {
  try {
    return katex.renderToString(tex, { throwOnError: true, strict: false, output: 'html' })
  } catch {
    return tex
  }
}

/**
 * O caractere que o comando desenha, tirado do MathML — e NÃO do campo
 * `replace` do `defineSymbol`.
 *
 * A diferença decide a busca por caractere. `\neq` não é um símbolo do KaTeX:
 * é uma macro que expande para `\not=`, então `replace` vem vazio e o `≠` do
 * teclado do autor não acharia nada. O MathML sabe: ele carrega o `≠`, o `∉` e
 * o `≰` prontos, porque é a saída semântica. Vale para as ~60 negações e para
 * toda macro com apelido (`\R`, `\dots`, `\lArr`).
 */
function caractereDe(tex) {
  try {
    const html = katex.renderToString(tex, {
      throwOnError: true,
      strict: false,
      output: 'mathml',
    })
    const math = html.match(/<math[\s\S]*?<\/math>/)?.[0] ?? ''
    const texto = math
      .replace(/<annotation[\s\S]*?<\/annotation>/g, '')
      .replace(/<[^>]*>/g, '')
      .trim()
    // só interessa quando o comando desenha UM sinal; `\frac` daria "ab"
    return [...texto].length === 1 ? texto : ''
  } catch {
    return ''
  }
}

// ---------------------------------------------------------------------------
// 4. Nomes em português
//
// O dicionário cobre o que se usa; o resto passa pelo compositor de morfemas,
// que dá conta das duas famílias grandes e regulares (setas e negações). O que
// escapa dos dois fica com o próprio comando como nome — e continua achável,
// porque a busca casa comando e caractere além do nome.
// ---------------------------------------------------------------------------

const NOMES = {
  // letras gregas
  '\\alpha': 'alfa', '\\beta': 'beta', '\\gamma': 'gama', '\\delta': 'delta',
  '\\epsilon': 'épsilon', '\\varepsilon': 'épsilon variante', '\\zeta': 'zeta',
  '\\eta': 'eta', '\\theta': 'teta', '\\vartheta': 'teta variante', '\\iota': 'iota',
  '\\kappa': 'capa', '\\varkappa': 'capa variante', '\\lambda': 'lambda', '\\mu': 'mi',
  '\\nu': 'ni', '\\xi': 'csi', '\\omicron': 'ômicron', '\\pi': 'pi',
  '\\varpi': 'pi variante', '\\rho': 'rô', '\\varrho': 'rô variante', '\\sigma': 'sigma',
  '\\varsigma': 'sigma final', '\\tau': 'tau', '\\upsilon': 'úpsilon', '\\phi': 'fi',
  '\\varphi': 'fi variante', '\\chi': 'qui', '\\psi': 'psi', '\\omega': 'ômega',
  '\\digamma': 'digama', '\\Gamma': 'Gama maiúsculo', '\\Delta': 'Delta maiúsculo (variação)',
  '\\Theta': 'Teta maiúsculo', '\\Lambda': 'Lambda maiúsculo', '\\Xi': 'Csi maiúsculo',
  '\\Pi': 'Pi maiúsculo', '\\Sigma': 'Sigma maiúsculo', '\\Upsilon': 'Úpsilon maiúsculo',
  '\\Phi': 'Fi maiúsculo', '\\Psi': 'Psi maiúsculo', '\\Omega': 'Ômega maiúsculo',
  '\\aleph': 'álefe', '\\beth': 'bete', '\\gimel': 'guímel', '\\daleth': 'dálete',

  // relações
  '=': 'igual', '\\ne': 'diferente', '\\neq': 'diferente', '\\approx': 'aproximadamente',
  '\\equiv': 'equivalente', '\\cong': 'congruente', '\\simeq': 'assintoticamente igual',
  '\\sim': 'semelhante', '\\propto': 'proporcional a', '\\varpropto': 'proporcional a (variante)',
  '\\leq': 'menor ou igual', '\\le': 'menor ou igual', '\\geq': 'maior ou igual',
  '\\ge': 'maior ou igual', '\\ll': 'muito menor', '\\gg': 'muito maior',
  '\\lll': 'muitíssimo menor', '\\ggg': 'muitíssimo maior', '\\leqslant': 'menor ou igual (inclinado)',
  '\\geqslant': 'maior ou igual (inclinado)', '\\lesssim': 'menor ou aproximado',
  '\\gtrsim': 'maior ou aproximado', '\\doteq': 'define como igual', '\\triangleq': 'igual por definição',
  '\\asymp': 'assintótico', '\\bowtie': 'gravata', '\\perp': 'perpendicular',
  '\\parallel': 'paralelo', '\\nparallel': 'não paralelo', '\\mid': 'divide',
  '\\nmid': 'não divide', '\\vdash': 'deduz', '\\dashv': 'é deduzido de',
  '\\models': 'satisfaz', '\\vDash': 'satisfaz (duplo)', '\\therefore': 'portanto',
  '\\because': 'porque', '\\prec': 'precede', '\\succ': 'sucede',
  '\\preceq': 'precede ou igual', '\\succeq': 'sucede ou igual', '\\between': 'entre',
  '\\smile': 'sorriso', '\\frown': 'carranca', '\\pitchfork': 'forquilha',

  // conjuntos
  '\\in': 'pertence', '\\notin': 'não pertence', '\\ni': 'contém elemento',
  '\\subset': 'contido', '\\supset': 'contém', '\\subseteq': 'contido ou igual',
  '\\supseteq': 'contém ou igual', '\\subsetneq': 'contido estritamente',
  '\\supsetneq': 'contém estritamente', '\\nsubseteq': 'não contido',
  '\\nsupseteq': 'não contém', '\\Subset': 'contido (duplo)', '\\Supset': 'contém (duplo)',
  '\\cup': 'união', '\\cap': 'interseção', '\\bigcup': 'união de vários',
  '\\bigcap': 'interseção de vários', '\\Cup': 'união dupla', '\\Cap': 'interseção dupla',
  '\\setminus': 'diferença de conjuntos', '\\smallsetminus': 'diferença de conjuntos (menor)',
  '\\emptyset': 'conjunto vazio', '\\varnothing': 'conjunto vazio (variante)',
  '\\complement': 'complementar', '\\sqsubseteq': 'contido (quadrado)',
  '\\sqsupseteq': 'contém (quadrado)', '\\sqcup': 'união (quadrado)',
  '\\sqcap': 'interseção (quadrado)',

  // operadores
  '\\pm': 'mais ou menos', '\\mp': 'menos ou mais', '\\times': 'multiplicação',
  '\\div': 'divisão', '\\cdot': 'ponto de multiplicação', '\\cdots': 'reticências centradas',
  '\\ldots': 'reticências na base', '\\vdots': 'reticências verticais',
  '\\ddots': 'reticências diagonais', '\\ast': 'asterisco', '\\star': 'estrela',
  '\\circ': 'composição', '\\bullet': 'ponto cheio', '\\oplus': 'soma direta',
  '\\ominus': 'subtração em círculo', '\\otimes': 'produto tensorial',
  '\\oslash': 'divisão em círculo', '\\odot': 'produto em círculo',
  '\\boxplus': 'soma em quadrado', '\\boxminus': 'subtração em quadrado',
  '\\boxtimes': 'produto em quadrado', '\\boxdot': 'ponto em quadrado',
  '\\wedge': 'e lógico', '\\land': 'e lógico', '\\vee': 'ou lógico', '\\lor': 'ou lógico',
  '\\neg': 'negação', '\\lnot': 'negação', '\\veebar': 'ou exclusivo',
  '\\barwedge': 'não-e', '\\bigwedge': 'e lógico de vários', '\\bigvee': 'ou lógico de vários',
  '\\uplus': 'união com multiplicidade', '\\amalg': 'coproduto', '\\wr': 'produto entrelaçado',
  '\\ltimes': 'produto semidireto à esquerda', '\\rtimes': 'produto semidireto à direita',
  '\\dagger': 'adaga', '\\ddagger': 'adaga dupla', '\\intercal': 'transposta',
  '\\dotplus': 'mais com ponto', '\\bmod': 'resto da divisão', '\\pmod': 'módulo (entre parênteses)',
  '\\bigoplus': 'soma direta de vários', '\\bigotimes': 'produto tensorial de vários',
  '\\bigodot': 'produto em círculo de vários', '\\bigsqcup': 'união (quadrado) de vários',
  '\\biguplus': 'união com multiplicidade de vários', '\\coprod': 'coproduto de vários',

  // símbolos
  '\\infty': 'infinito', '\\infin': 'infinito', '\\partial': 'derivada parcial',
  '\\nabla': 'nabla (gradiente)', '\\forall': 'para todo', '\\exists': 'existe',
  '\\nexists': 'não existe', '\\top': 'verdadeiro', '\\bot': 'falso',
  '\\angle': 'ângulo', '\\measuredangle': 'ângulo medido', '\\sphericalangle': 'ângulo esférico',
  '\\triangle': 'triângulo', '\\square': 'quadrado', '\\lozenge': 'losango',
  '\\blacksquare': 'quadrado cheio', '\\blacktriangle': 'triângulo cheio',
  '\\bigstar': 'estrela cheia', '\\checkmark': 'visto', '\\maltese': 'cruz de malta',
  '\\prime': 'linha (derivada)', '\\backprime': 'linha invertida', '\\degree': 'grau',
  '\\hbar': 'h cortado (Planck reduzida)', '\\hslash': 'h cortado (variante)',
  '\\ell': 'ele cursivo', '\\wp': 'p de Weierstrass', '\\Re': 'parte real',
  '\\Im': 'parte imaginária', '\\imath': 'i sem pingo', '\\jmath': 'j sem pingo',
  '\\mho': 'condutância (mho)', '\\surd': 'radical', '\\flat': 'bemol',
  '\\sharp': 'sustenido', '\\natural': 'bequadro', '\\clubsuit': 'paus',
  '\\diamondsuit': 'ouros', '\\heartsuit': 'copas', '\\spadesuit': 'espadas',
  '\\S': 'parágrafo (seção)', '\\P': 'pilcrow', '\\%': 'porcentagem',
  '\\#': 'cerquilha', '\\&': 'e comercial', '\\$': 'cifrão',
  '\\pounds': 'libra', '\\yen': 'iene', '\\copyright': 'direito autoral',

  // setas de uso corrente (o compositor cobre o resto)
  '\\to': 'seta para a direita', '\\rightarrow': 'seta para a direita',
  '\\gets': 'seta para a esquerda', '\\leftarrow': 'seta para a esquerda',
  '\\leftrightarrow': 'seta para os dois lados', '\\Rightarrow': 'implica',
  '\\Leftarrow': 'é implicado por', '\\Leftrightarrow': 'se e somente se',
  '\\implies': 'implica (com espaço)', '\\impliedby': 'é implicado por (com espaço)',
  '\\iff': 'se e somente se (com espaço)', '\\mapsto': 'leva a',
  '\\uparrow': 'seta para cima', '\\downarrow': 'seta para baixo',
  '\\updownarrow': 'seta para cima e para baixo', '\\nearrow': 'seta nordeste',
  '\\searrow': 'seta sudeste', '\\swarrow': 'seta sudoeste', '\\nwarrow': 'seta noroeste',
  '\\leadsto': 'leva a (ondulada)', '\\multimap': 'multimapa',
  '\\rightleftharpoons': 'equilíbrio (setas opostas)',

  // funções
  '\\sin': 'seno', '\\cos': 'cosseno', '\\tan': 'tangente', '\\cot': 'cotangente',
  '\\sec': 'secante', '\\csc': 'cossecante', '\\arcsin': 'arco seno',
  '\\arccos': 'arco cosseno', '\\arctan': 'arco tangente', '\\sinh': 'seno hiperbólico',
  '\\cosh': 'cosseno hiperbólico', '\\tanh': 'tangente hiperbólica',
  '\\coth': 'cotangente hiperbólica', '\\log': 'logaritmo', '\\ln': 'logaritmo natural',
  '\\lg': 'logaritmo base 10', '\\exp': 'exponencial', '\\lim': 'limite',
  '\\limsup': 'limite superior', '\\liminf': 'limite inferior', '\\max': 'máximo',
  '\\min': 'mínimo', '\\sup': 'supremo', '\\inf': 'ínfimo', '\\det': 'determinante',
  '\\dim': 'dimensão', '\\deg': 'grau (de polinômio)', '\\ker': 'núcleo',
  '\\hom': 'homomorfismos', '\\arg': 'argumento', '\\gcd': 'máximo divisor comum',
  '\\Pr': 'probabilidade', '\\argmax': 'argumento do máximo', '\\argmin': 'argumento do mínimo',

  // delimitadores
  '\\langle': 'ângulo esquerdo', '\\rangle': 'ângulo direito',
  '\\lfloor': 'piso esquerdo', '\\rfloor': 'piso direito',
  '\\lceil': 'teto esquerdo', '\\rceil': 'teto direito',
  '\\lbrace': 'chave esquerda', '\\rbrace': 'chave direita',
  '\\lbrack': 'colchete esquerdo', '\\rbrack': 'colchete direito',
  '\\lparen': 'parêntese esquerdo', '\\rparen': 'parêntese direito',
  '\\vert': 'barra vertical', '\\Vert': 'barra vertical dupla',
  '\\lvert': 'módulo (abre)', '\\rvert': 'módulo (fecha)',
  '\\lVert': 'norma (abre)', '\\rVert': 'norma (fecha)',
  '\\llbracket': 'colchete duplo esquerdo', '\\rrbracket': 'colchete duplo direito',
  '\\ulcorner': 'canto superior esquerdo', '\\urcorner': 'canto superior direito',
  '\\llcorner': 'canto inferior esquerdo', '\\lrcorner': 'canto inferior direito',
  '\\backslash': 'barra invertida',

  // conjuntos numéricos (macros)
  '\\R': 'números reais', '\\N': 'números naturais', '\\Z': 'números inteiros',
  '\\Q': 'números racionais', '\\C': 'números complexos', '\\Complex': 'números complexos',
  '\\Reals': 'números reais', '\\reals': 'números reais', '\\natnums': 'números naturais',
  '\\cnums': 'números complexos',

  // espaços
  '\\quad': 'espaço de um quadrat', '\\qquad': 'espaço de dois quadrats',
  '\\thinspace': 'espaço fino', '\\medspace': 'espaço médio', '\\thickspace': 'espaço largo',
  '\\negthinspace': 'espaço fino negativo', '\\negmedspace': 'espaço médio negativo',
  '\\negthickspace': 'espaço largo negativo', '\\enspace': 'espaço de meia quadrat',
  '\\enskip': 'espaço de meia quadrat', '\\newline': 'quebra de linha',
  '\\space': 'espaço', '\\mathstrut': 'escora invisível (altura de parêntese)',

  // grandes operadores — os que abrem uma fórmula inteira
  '\\sum': 'somatório', '\\prod': 'produtório', '\\int': 'integral',
  '\\iint': 'integral dupla', '\\iiint': 'integral tripla',
  '\\oint': 'integral de contorno', '\\oiint': 'integral de superfície',
  '\\oiiint': 'integral de volume', '\\smallint': 'integral pequena',

  // setas que o compositor erra ou não alcança
  '\\Uparrow': 'seta dupla para cima', '\\Downarrow': 'seta dupla para baixo',
  '\\updownarrow': 'seta para cima e para baixo',
  '\\Updownarrow': 'seta dupla para cima e para baixo',
  '\\longmapsto': 'leva a (longa)', '\\Lsh': 'sobe e vira à esquerda',
  '\\Rsh': 'sobe e vira à direita', '\\upuparrows': 'duas setas para cima',
  '\\downdownarrows': 'duas setas para baixo',
  '\\leftharpoonup': 'arpão à esquerda, gume em cima',
  '\\leftharpoondown': 'arpão à esquerda, gume embaixo',
  '\\rightharpoonup': 'arpão à direita, gume em cima',
  '\\rightharpoondown': 'arpão à direita, gume embaixo',
  '\\upharpoonleft': 'arpão para cima, gume à esquerda',
  '\\upharpoonright': 'arpão para cima, gume à direita',
  '\\downharpoonleft': 'arpão para baixo, gume à esquerda',
  '\\downharpoonright': 'arpão para baixo, gume à direita',
  '\\restriction': 'restrição', '\\leftarrowtail': 'seta à esquerda com cauda',
  '\\rightarrowtail': 'seta à direita com cauda',
  '\\looparrowleft': 'seta à esquerda com laço',
  '\\looparrowright': 'seta à direita com laço',
  '\\curvearrowleft': 'seta curva à esquerda',
  '\\curvearrowright': 'seta curva à direita',
  '\\circlearrowleft': 'seta circular anti-horária',
  '\\circlearrowright': 'seta circular horária',
  '\\leftrightsquigarrow': 'seta ondulada para os dois lados',
  '\\larr': 'seta para a esquerda', '\\rarr': 'seta para a direita',
  '\\uarr': 'seta para cima', '\\darr': 'seta para baixo',
  '\\harr': 'seta para os dois lados', '\\lrarr': 'seta para os dois lados',

  // relações que aparecem em material de ensino médio
  '\\leqq': 'menor ou igual (duplo)', '\\geqq': 'maior ou igual (duplo)',
  '\\lneq': 'menor e diferente', '\\gneq': 'maior e diferente',
  '\\nless': 'não menor', '\\ngtr': 'não maior',
  '\\lessgtr': 'menor ou maior', '\\gtrless': 'maior ou menor',
  '\\lessdot': 'menor (ponto)', '\\gtrdot': 'maior (ponto)',
  '\\lessapprox': 'menor ou aproximadamente igual',
  '\\gtrapprox': 'maior ou aproximadamente igual',
  '\\approxeq': 'aproximadamente igual', '\\eqsim': 'igual ou semelhante',
  '\\backsim': 'semelhante (invertido)', '\\Doteq': 'igual por definição (duplo)',
  '\\circeq': 'igual com círculo', '\\eqcirc': 'círculo com igual',
  '\\bumpeq': 'igual com arco', '\\risingdotseq': 'igual com pontos subindo',
  '\\fallingdotseq': 'igual com pontos descendo',
  '\\sqsubset': 'contido próprio (quadrado)', '\\sqsupset': 'contém próprio (quadrado)',
  '\\subseteqq': 'contido ou igual (duplo)', '\\supseteqq': 'contém ou igual (duplo)',
  '\\subsetneqq': 'contido estritamente (duplo)',
  '\\supsetneqq': 'contém estritamente (duplo)',
  '\\preccurlyeq': 'precede ou igual (curvo)', '\\succcurlyeq': 'sucede ou igual (curvo)',
  '\\precsim': 'precede ou semelhante', '\\succsim': 'sucede ou semelhante',
  '\\Vdash': 'força (duplo)', '\\Vvdash': 'força (triplo)',
  '\\vartriangle': 'triângulo (relação)',
  '\\vartriangleleft': 'subgrupo normal à esquerda',
  '\\vartriangleright': 'subgrupo normal à direita',
  '\\trianglelefteq': 'subgrupo normal ou igual à esquerda',
  '\\trianglerighteq': 'subgrupo normal ou igual à direita',
  '\\blacktriangleleft': 'triângulo cheio à esquerda',
  '\\blacktriangleright': 'triângulo cheio à direita',
  '\\Join': 'junção', '\\backepsilon': 'épsilon invertido (tal que)',
  '\\isin': 'pertence', '\\notni': 'não contém elemento',
  '\\sub': 'contido', '\\sube': 'contido ou igual', '\\supe': 'contém ou igual',
  '\\ne': 'diferente',

  // operadores binários da cauda
  '\\bigcirc': 'círculo grande', '\\diamond': 'losango pequeno',
  '\\triangleleft': 'triângulo à esquerda', '\\triangleright': 'triângulo à direita',
  '\\bigtriangleup': 'triângulo grande', '\\bigtriangledown': 'triângulo grande invertido',
  '\\circledast': 'asterisco em círculo', '\\circledcirc': 'círculo em círculo',
  '\\circleddash': 'traço em círculo', '\\curlyvee': 'ou lógico curvo',
  '\\curlywedge': 'e lógico curvo', '\\divideontimes': 'divisão vezes',
  '\\doublebarwedge': 'e lógico com duas barras',
  '\\leftthreetimes': 'produto semidireto à esquerda (três)',
  '\\rightthreetimes': 'produto semidireto à direita (três)',
  '\\unlhd': 'subgrupo normal ou igual à esquerda',
  '\\unrhd': 'subgrupo normal ou igual à direita',
  '\\lhd': 'subgrupo normal à esquerda', '\\rhd': 'subgrupo normal à direita',
  '\\And': 'e comercial (espaçado)', '\\sdot': 'ponto de multiplicação',
  '\\plusmn': 'mais ou menos', '\\minuso': 'menos em círculo',

  // símbolos avulsos
  '\\Box': 'quadrado vazio', '\\Diamond': 'losango vazio',
  '\\triangledown': 'triângulo invertido', '\\blacktriangledown': 'triângulo cheio invertido',
  '\\blacklozenge': 'losango cheio', '\\diagup': 'barra diagonal',
  '\\diagdown': 'barra diagonal invertida', '\\eth': 'eth',
  '\\Finv': 'F invertido', '\\Game': 'G invertido',
  '\\circledR': 'marca registrada', '\\circledS': 'S em círculo',
  '\\textregistered': 'marca registrada', '\\textcopyright': 'direito autoral',
  '\\Dagger': 'adaga dupla', '\\dag': 'adaga', '\\ddag': 'adaga dupla',
  '\\sect': 'parágrafo (seção)', '\\bull': 'ponto cheio',
  '\\clubs': 'paus', '\\diamonds': 'ouros', '\\hearts': 'copas', '\\spades': 'espadas',
  '\\weierp': 'p de Weierstrass', '\\real': 'parte real', '\\image': 'parte imaginária',
  '\\empty': 'conjunto vazio', '\\exist': 'existe',
  '\\dots': 'reticências', '\\varvdots': 'reticências verticais',
  '\\colon': 'dois pontos', '\\ldotp': 'ponto na base', '\\cdotp': 'ponto centrado',
  '\\ratio': 'razão (dois pontos)', '\\not': 'barra de negação (sobre o próximo)',
  '\\aa': 'a com anel', '\\AA': 'A com anel',
  '\\lq': 'aspa simples esquerda', '\\rq': 'aspa simples direita',
  '\\angln': 'ângulo com n', '\\nobreak': 'não quebrar aqui',
  '\\allowbreak': 'pode quebrar aqui',

  // limites com nome próprio
  '\\injlim': 'limite injetivo', '\\projlim': 'limite projetivo',
  '\\varinjlim': 'limite direto', '\\varprojlim': 'limite inverso',
  '\\varliminf': 'limite inferior (variante)', '\\varlimsup': 'limite superior (variante)',
  '\\plim': 'limite em probabilidade',

  // gregas maiúsculas que são latinas idênticas, e as "var" do AMS
  '\\Alpha': 'Alfa maiúsculo', '\\Beta': 'Beta maiúsculo', '\\Epsilon': 'Épsilon maiúsculo',
  '\\Zeta': 'Zeta maiúsculo', '\\Eta': 'Eta maiúsculo', '\\Iota': 'Iota maiúsculo',
  '\\Kappa': 'Capa maiúsculo', '\\Mu': 'Mi maiúsculo', '\\Nu': 'Ni maiúsculo',
  '\\Omicron': 'Ômicron maiúsculo', '\\Rho': 'Rô maiúsculo', '\\Tau': 'Tau maiúsculo',
  '\\Chi': 'Qui maiúsculo',
  '\\varGamma': 'Gama maiúsculo em itálico', '\\varDelta': 'Delta maiúsculo em itálico',
  '\\varTheta': 'Teta maiúsculo em itálico', '\\varLambda': 'Lambda maiúsculo em itálico',
  '\\varXi': 'Csi maiúsculo em itálico', '\\varPi': 'Pi maiúsculo em itálico',
  '\\varSigma': 'Sigma maiúsculo em itálico',
  '\\varUpsilon': 'Úpsilon maiúsculo em itálico',
  '\\varPhi': 'Fi maiúsculo em itálico', '\\varPsi': 'Psi maiúsculo em itálico',
  '\\varOmega': 'Ômega maiúsculo em itálico',
  '\\alef': 'álefe', '\\alefsym': 'álefe', '\\thetasym': 'teta variante',
  '\\Bbbk': 'k vazado',

  // delimitadores com apelido
  '\\lang': 'ângulo esquerdo', '\\rang': 'ângulo direito',
  '\\lBrace': 'chave dupla esquerda', '\\rBrace': 'chave dupla direita',
  '\\lgroup': 'grupo esquerdo', '\\rgroup': 'grupo direito',
  '\\lmoustache': 'bigode esquerdo', '\\rmoustache': 'bigode direito',
  '\\lt': 'menor', '\\gt': 'maior',

  // apelidos de seta dupla (herança do HTML: lArr, rArr…)
  '\\lArr': 'seta dupla para a esquerda', '\\Larr': 'seta dupla para a esquerda',
  '\\rArr': 'seta dupla para a direita', '\\Rarr': 'seta dupla para a direita',
  '\\uArr': 'seta dupla para cima', '\\Uarr': 'seta dupla para cima',
  '\\dArr': 'seta dupla para baixo', '\\Darr': 'seta dupla para baixo',
  '\\hArr': 'seta dupla para os dois lados', '\\Harr': 'seta dupla para os dois lados',
  '\\lrArr': 'seta dupla para os dois lados', '\\Lrarr': 'seta dupla para os dois lados',

  // reticências com espaçamento próprio de cada contexto
  '\\dotsb': 'reticências entre operadores', '\\dotsc': 'reticências entre vírgulas',
  '\\dotsi': 'reticências entre integrais', '\\dotsm': 'reticências de multiplicação',
  '\\dotso': 'reticências no fim da frase', '\\dotsx': 'reticências (genérico)',

  // negações e variantes "duplas" do AMS
  '\\lneqq': 'menor e diferente (duplo)', '\\gneqq': 'maior e diferente (duplo)',
  '\\lnsim': 'menor e não semelhante', '\\gnsim': 'maior e não semelhante',
  '\\lnapprox': 'menor e não aproximado', '\\gnapprox': 'maior e não aproximado',
  '\\lvertneqq': 'menor e diferente (barra)', '\\gvertneqq': 'maior e diferente (barra)',
  '\\precneqq': 'precede e diferente', '\\succneqq': 'sucede e diferente',
  '\\precnsim': 'precede e não semelhante', '\\succnsim': 'sucede e não semelhante',
  '\\precnapprox': 'precede e não aproximado',
  '\\succnapprox': 'sucede e não aproximado',
  '\\precapprox': 'precede ou aproximado', '\\succapprox': 'sucede ou aproximado',
  '\\curlyeqprec': 'igual curvo que precede', '\\curlyeqsucc': 'igual curvo que sucede',
  '\\varsubsetneq': 'contido estritamente (variante)',
  '\\varsupsetneq': 'contém estritamente (variante)',
  '\\varsubsetneqq': 'contido estritamente (duplo, variante)',
  '\\varsupsetneqq': 'contém estritamente (duplo, variante)',
  '\\nshortmid': 'não divide (curto)', '\\nshortparallel': 'não paralelo (curto)',
  '\\backsimeq': 'assintoticamente igual (invertido)',
  '\\Bumpeq': 'igual com arco (duplo)',
  '\\nVDash': 'não satisfaz (duplo)',
  '\\eqslantless': 'menor ou igual (inclinado, AMS)',
  '\\eqslantgtr': 'maior ou igual (inclinado, AMS)',
  '\\lesseqgtr': 'menor, igual ou maior', '\\gtreqless': 'maior, igual ou menor',
  '\\lesseqqgtr': 'menor, igual ou maior (duplo)',
  '\\gtreqqless': 'maior, igual ou menor (duplo)',
  '\\origof': 'origem de', '\\imageof': 'imagem de',

  // a família dos dois pontos: notação de definição (:=, ::=, :≈…)
  '\\dblcolon': 'dois pontos duplos', '\\vcentcolon': 'dois pontos centrados',
  '\\coloneq': 'define como (:−)', '\\Coloneq': 'define como (::−)',
  '\\coloneqq': 'define como (:=)', '\\Coloneqq': 'define como (::=)',
  '\\eqcolon': 'é definido por (−:)', '\\Eqcolon': 'é definido por (−::)',
  '\\eqqcolon': 'é definido por (=:)', '\\Eqqcolon': 'é definido por (=::)',
  '\\colonsim': 'define como semelhante', '\\Colonsim': 'define como semelhante (duplo)',
  '\\simcolon': 'semelhante por definição',
  '\\simcoloncolon': 'semelhante por definição (duplo)',
  '\\colonapprox': 'define como aproximado',
  '\\Colonapprox': 'define como aproximado (duplo)',
  '\\approxcolon': 'aproximado por definição',
  '\\approxcoloncolon': 'aproximado por definição (duplo)',
  '\\colonequals': 'define como (:=)',
  '\\coloncolonequals': 'define como (::=)',
  '\\equalscolon': 'é definido por (=:)',
  '\\equalscoloncolon': 'é definido por (=::)',
  '\\colonminus': 'define como (:−)', '\\coloncolonminus': 'define como (::−)',
  '\\minuscolon': 'é definido por (−:)', '\\minuscoloncolon': 'é definido por (−::)',
  '\\coloncolon': 'dois pontos duplos', '\\coloncolonsim': 'define como semelhante (duplo)',
  '\\coloncolonapprox': 'define como aproximado (duplo)',
  '\\ordinarycolon': 'dois pontos comuns',
}

/** Morfemas para compor nome de seta e de negação — as duas famílias regulares. */
const MORFEMAS = [
  ['leftrightarrows', 'setas para os dois lados (paralelas)'],
  ['leftrightarrow', 'seta para os dois lados'],
  ['leftrightharpoons', 'arpões para os dois lados'],
  ['leftarrow', 'seta para a esquerda'],
  ['rightarrow', 'seta para a direita'],
  ['uparrow', 'seta para cima'],
  ['downarrow', 'seta para baixo'],
  ['leftharpoon', 'arpão à esquerda'],
  ['rightharpoon', 'arpão à direita'],
  ['upharpoon', 'arpão para cima'],
  ['downharpoon', 'arpão para baixo'],
  ['leftarrows', 'setas para a esquerda'],
  ['rightarrows', 'setas para a direita'],
]

const PREFIXOS = [
  ['long', 'longa'],
  ['two', 'de duas pontas'],
  ['twohead', 'de duas pontas'],
  ['dash', 'tracejada'],
  ['hook', 'com gancho'],
  ['curve', 'curva'],
  ['circle', 'circular'],
  ['loop', 'com laço'],
]

function nomePortugues(latex) {
  if (NOMES[latex]) return NOMES[latex]

  const cru = latex.slice(1)

  // negações: \nleq, \nsubseteq, \nRightarrow…
  if (/^n[A-Za-z]/.test(cru)) {
    const base = NOMES['\\' + cru.slice(1)] || nomeDeSeta(cru.slice(1))
    if (base) return 'não ' + base
  }

  const seta = nomeDeSeta(cru)
  if (seta) return seta

  return cru
}

function nomeDeSeta(cru) {
  const baixo = cru.toLowerCase()
  for (const [raiz, nome] of MORFEMAS) {
    if (!baixo.endsWith(raiz)) continue
    const resto = baixo.slice(0, -raiz.length)
    const extras = PREFIXOS.filter(([p]) => resto.includes(p)).map(([, n]) => n)
    const duplo = /^[A-Z]/.test(cru) ? ' dupla' : ''
    return [nome + duplo, ...extras].join(', ')
  }
  return null
}

// ---------------------------------------------------------------------------
// 5. Classificação em paletas
// ---------------------------------------------------------------------------

const GREGO = new Set(
  ('alpha beta gamma delta epsilon varepsilon zeta eta theta vartheta iota kappa ' +
    'varkappa lambda mu nu xi omicron pi varpi rho varrho sigma varsigma tau upsilon ' +
    'phi varphi chi psi omega digamma Gamma Delta Theta Lambda Xi Pi Sigma Upsilon ' +
    'Phi Psi Omega Alpha Beta Epsilon Zeta Eta Iota Kappa Mu Nu Omicron Rho Tau ' +
    'varGamma varDelta varTheta varLambda varXi varPi varSigma varUpsilon varPhi ' +
    'varPsi varOmega aleph beth gimel daleth alef alefsym thetasym Bbbk')
    .split(' ')
    .map((n) => '\\' + n),
)

const FUNCOES = (
  'sin cos tan cot sec csc arcsin arccos arctan sinh cosh tanh coth arg deg det dim ' +
  'exp gcd hom inf ker lg lim liminf limsup ln log max min Pr sup argmax argmin ' +
  'injlim projlim varinjlim varprojlim varliminf varlimsup plim bmod sh ch th tg ctg ' +
  'cth cosec arctg arcctg cotg'
)
  .split(' ')
  .map((n) => '\\' + n)

const ESPACOS = (
  'quad qquad thinspace medspace thickspace negthinspace negmedspace negthickspace ' +
  'enspace enskip newline nobreakspace space'
)
  .split(' ')
  .map((n) => '\\' + n)

const DELIMITADORES = new Set(
  ('langle rangle lfloor rfloor lceil rceil lbrace rbrace lbrack rbrack lparen rparen ' +
    'vert Vert lvert rvert lVert rVert llbracket rrbracket lBrace rBrace lang rang ' +
    'ulcorner urcorner llcorner lrcorner lmoustache rmoustache lgroup rgroup backslash ' +
    'lt gt')
    .split(' ')
    .map((n) => '\\' + n),
)

/**
 * A família do átomo, lida da árvore de análise do próprio KaTeX.
 *
 * O `grupo` do `defineSymbol` só existe para os símbolos declarados ali. Uma
 * MACRO (`\ne`, `\sube`, `\isin`, `\larr`) não tem grupo nenhum — e sem isto
 * todas as ~280 caíam na aba "Símbolos", que é o balaio do resto. `__parse`
 * expande a macro e diz o que ela virou: relação, operador, delimitador.
 *
 * `\ne` e `\notni` chegam embrulhados num nó `htmlmathml` (são desenhados com
 * `\html@mathml`), por isso a busca desce pela árvore inteira em vez de olhar
 * só o nó de cima.
 */
function familiaDe(tex) {
  let achado = null
  const desce = (no) => {
    if (achado || !no || typeof no !== 'object') return
    if (Array.isArray(no)) return no.forEach(desce)
    if (no.type === 'atom' && no.family) return void (achado = no.family)
    if (no.type === 'mathord' || no.type === 'textord' || no.type === 'op') {
      return void (achado = no.type === 'op' ? 'op' : 'ord')
    }
    for (const v of Object.values(no)) desce(v)
  }
  try {
    desce(katex.__parse(tex, { strict: false }))
  } catch {
    /* já foi validado antes; se falhar aqui, cai no grupo declarado */
  }
  return achado
}

function paletaDe(latex, grupo, chr) {
  if (GREGO.has(latex)) return 'grego'
  if (DELIMITADORES.has(latex) || grupo === 'open' || grupo === 'close') return 'delimitadores'
  if (ESPACOS.includes(latex)) return 'espacos'
  if (FUNCOES.includes(latex)) return 'funcoes'
  if (/arrow|harpoon|mapsto|leadsto|multimap|^\\(to|gets|iff|implies|impliedby)$/i.test(latex)) {
    return 'setas'
  }
  if (/^[⇐-⇿←-⇏]/.test(chr)) return 'setas'
  if (grupo === 'rel') return 'relacoes'
  if (grupo === 'bin' || grupo === 'op') return 'operacoes'
  return 'simbolos'
}

// ---------------------------------------------------------------------------
// 6. Montagem
// ---------------------------------------------------------------------------

const porPaleta = {}
let descartados = 0

for (const [latex, { grupo, chr }] of candidatos) {
  if (excluido(latex)) continue
  if (!renderiza(latex)) {
    descartados++
    continue
  }
  const p = paletaDe(latex, familiaDe(latex) ?? grupo, chr)
  ;(porPaleta[p] ||= []).push({
    l: latex,
    n: nomePortugues(latex),
    c: caractereDe(latex) || chr,
    h: desenho(latex),
    apelido: grupo === 'macro',
  })
}

// os que pedem argumento entram pelo gabarito, e a conferência é a mesma:
// renderiza com um `x` no buraco ou não entra.
for (const [p, pares] of Object.entries(COM_ARGUMENTO)) {
  for (const [gabarito, mostra] of pares) {
    if (!renderiza(mostra) || !renderiza(gabarito.replace('@', 'x'))) {
      descartados++
      console.warn('  ! descartado:', gabarito)
      continue
    }
    const comando = (gabarito.match(/\\[a-zA-Z]+/) || [gabarito])[0]
    ;(porPaleta[p] ||= []).push({
      l: gabarito,
      m: mostra,
      n: NOMES_GABARITO[gabarito] || NOMES[comando] || nomePortugues(comando),
      h: desenho(mostra),
    })
  }
}

// Dedupe pelo DESENHO, não pelo caractere. `\ne` e `\neq` produzem o mesmo
// HTML e viram um botão só (o outro fica de sinônimo na busca); mas `\Gamma` e
// `\varGamma` levam ao mesmo Γ do Unicode e são desenhos DIFERENTES — reto e
// itálico —, então continuam sendo dois botões. Chavear pelo caractere fundia
// os dois pares, e fazia a paleta esconder um símbolo que existe.
//
// Só os símbolos SEM gabarito entram na dedupe. `\frac` e `\tfrac` desenham
// igual quando o botão os mostra em linha, mas inserem coisas diferentes — e
// a diferença aparece na fórmula em bloco, que é justamente onde se escolhe
// entre os dois. Fundir gabarito por desenho apaga a escolha.
for (const [p, lista] of Object.entries(porPaleta)) {
  // Quem sobrevive à dedupe é o comando de VERDADE, não o apelido: `\aleph` é
  // símbolo do KaTeX e `\alef` é macro que aponta para ele. Ordenar só por
  // tamanho deixaria o apelido no botão e o nome consagrado escondido na busca.
  lista.sort(
    (a, b) =>
      Number(a.apelido ?? false) - Number(b.apelido ?? false) ||
      a.l.length - b.l.length ||
      a.l.localeCompare(b.l),
  )
  const vistos = new Map()
  const saida = []
  for (const item of lista) {
    if (item.m) {
      saida.push(item)
      continue
    }
    const antes = vistos.get(item.h)
    if (antes) {
      antes.s = (antes.s ? antes.s + ' ' : '') + item.l
      antes.c = antes.c || item.c
      continue
    }
    vistos.set(item.h, item)
    saida.push(item)
  }

  // O gabarito ganha do comando cru: `\liminf_{@}` já leva o cursor para
  // debaixo do limite, e ter os dois botões lado a lado só faz o autor
  // escolher errado metade das vezes. O comando cru vira sinônimo na busca.
  const comGabarito = new Map()
  for (const i of saida) {
    if (!i.m) continue
    const base = i.l.match(/\\[a-zA-Z]+/)?.[0]
    if (base && !comGabarito.has(base)) comGabarito.set(base, i)
  }
  porPaleta[p] = saida.filter((i) => {
    const dono = i.m ? null : comGabarito.get(i.l)
    if (!dono) return true
    dono.c = dono.c || i.c
    dono.s = [dono.s, i.s].filter(Boolean).join(' ') || undefined
    return false
  })
}

const ordem = [
  'operacoes',
  'grego',
  'relacoes',
  'setas',
  'simbolos',
  'delimitadores',
  'acentos',
  'estruturas',
  'estilos',
  'funcoes',
  'espacos',
]
const total = Object.values(porPaleta).reduce((s, l) => s + l.length, 0)

const corpo = ordem
  .filter((p) => porPaleta[p])
  .map((p) => {
    const linhas = porPaleta[p]
      .map((i) => {
        const partes = [`l: ${JSON.stringify(i.l)}`, `n: ${JSON.stringify(i.n)}`]
        if (i.m) partes.push(`m: ${JSON.stringify(i.m)}`)
        if (i.c) partes.push(`c: ${JSON.stringify(i.c)}`)
        if (i.s) partes.push(`s: ${JSON.stringify(i.s)}`)
        return `  { ${partes.join(', ')} },`
      })
      .join('\n')
    return `  ${p}: [\n${linhas.replace(/^/gm, '  ')}\n  ],`
  })
  .join('\n')

const arquivo = `/**
 * GERADO POR \`ferramentas/gera-catalogo-simbolos.mjs\` — NÃO EDITE À MÃO.
 *
 * Catálogo completo de símbolos do KaTeX ${JSON.parse(fs.readFileSync('node_modules/katex/package.json', 'utf8')).version},
 * ${total} entradas, extraídas de \`node_modules/katex/src\` e conferidas uma a uma
 * pela própria renderização. É o teto real do editor: o que não está aqui o
 * KaTeX não desenha, e a prévia recusaria.
 *
 * As paletas curadas de \`paletas.ts\` vêm ANTES destas na tela — elas têm nome,
 * gabarito de cursor e ordem pensados à mão. Isto é a cauda longa.
 *
 * Campos: l = o que é inserido (\`@\` marca onde o cursor para) ·
 * n = nome em português · m = o que o botão desenha, quando difere de \`l\` ·
 * c = caractere (busca) · s = sinônimos que desenham o mesmo sinal (busca, não
 * aparecem na grade).
 */

export type ItemCatalogo = { l: string; n: string; m?: string; c?: string; s?: string }

export const CATALOGO: Record<string, ItemCatalogo[]> = {
${corpo}
}
`

fs.mkdirSync(path.dirname(DESTINO), { recursive: true })
fs.writeFileSync(DESTINO, arquivo)

console.log(`${DESTINO}: ${total} símbolos`)
for (const p of ordem) if (porPaleta[p]) console.log(`  ${p.padEnd(15)} ${porPaleta[p].length}`)
console.log(`  (${descartados} candidatos descartados por não renderizarem sozinhos)`)

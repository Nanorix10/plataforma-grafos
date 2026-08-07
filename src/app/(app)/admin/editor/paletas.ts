/**
 * Símbolos das paletas do editor de equações, no espírito do Google Docs:
 * o autor clica no símbolo em vez de decorar o comando LaTeX.
 *
 * Cada símbolo tem:
 *   mostra — o que aparece no botão (renderizado com KaTeX)
 *   latex  — o que é inserido no campo
 *   nome   — texto do tooltip, em português
 *
 * `@` dentro do latex marca onde o cursor deve parar depois de inserir, e onde
 * ficam os "buracos" a preencher. É trocado por {} antes de renderizar.
 */

export type Simbolo = { mostra: string; latex: string; nome: string }
export type Paleta = { id: string; rotulo: string; simbolos: Simbolo[] }

const grego: Simbolo[] = [
  { mostra: '\\alpha', latex: '\\alpha', nome: 'alfa' },
  { mostra: '\\beta', latex: '\\beta', nome: 'beta' },
  { mostra: '\\gamma', latex: '\\gamma', nome: 'gama' },
  { mostra: '\\delta', latex: '\\delta', nome: 'delta' },
  { mostra: '\\epsilon', latex: '\\epsilon', nome: 'épsilon' },
  { mostra: '\\zeta', latex: '\\zeta', nome: 'zeta' },
  { mostra: '\\eta', latex: '\\eta', nome: 'eta' },
  { mostra: '\\theta', latex: '\\theta', nome: 'teta' },
  { mostra: '\\lambda', latex: '\\lambda', nome: 'lambda' },
  { mostra: '\\mu', latex: '\\mu', nome: 'mi' },
  { mostra: '\\nu', latex: '\\nu', nome: 'ni' },
  { mostra: '\\xi', latex: '\\xi', nome: 'csi' },
  { mostra: '\\pi', latex: '\\pi', nome: 'pi' },
  { mostra: '\\rho', latex: '\\rho', nome: 'rô' },
  { mostra: '\\sigma', latex: '\\sigma', nome: 'sigma' },
  { mostra: '\\tau', latex: '\\tau', nome: 'tau' },
  { mostra: '\\phi', latex: '\\phi', nome: 'fi' },
  { mostra: '\\chi', latex: '\\chi', nome: 'qui' },
  { mostra: '\\psi', latex: '\\psi', nome: 'psi' },
  { mostra: '\\omega', latex: '\\omega', nome: 'ômega' },
  { mostra: '\\Gamma', latex: '\\Gamma', nome: 'Gama maiúsculo' },
  { mostra: '\\Delta', latex: '\\Delta', nome: 'Delta maiúsculo (variação)' },
  { mostra: '\\Theta', latex: '\\Theta', nome: 'Teta maiúsculo' },
  { mostra: '\\Lambda', latex: '\\Lambda', nome: 'Lambda maiúsculo' },
  { mostra: '\\Pi', latex: '\\Pi', nome: 'Pi maiúsculo' },
  { mostra: '\\Sigma', latex: '\\Sigma', nome: 'Sigma maiúsculo' },
  { mostra: '\\Phi', latex: '\\Phi', nome: 'Fi maiúsculo' },
  { mostra: '\\Omega', latex: '\\Omega', nome: 'Ômega maiúsculo' },
]

const operacoes: Simbolo[] = [
  { mostra: '\\frac{a}{b}', latex: '\\frac{@}{}', nome: 'fração' },
  { mostra: '\\sqrt{x}', latex: '\\sqrt{@}', nome: 'raiz quadrada' },
  { mostra: '\\sqrt[n]{x}', latex: '\\sqrt[@]{}', nome: 'raiz de índice n' },
  { mostra: 'x^{n}', latex: '^{@}', nome: 'expoente' },
  { mostra: 'x_{n}', latex: '_{@}', nome: 'índice (subscrito)' },
  { mostra: 'x_{a}^{b}', latex: '_{@}^{}', nome: 'índice e expoente' },
  { mostra: '\\sum_{i=1}^{n}', latex: '\\sum_{@}^{}', nome: 'somatório' },
  { mostra: '\\prod_{i=1}^{n}', latex: '\\prod_{@}^{}', nome: 'produtório' },
  { mostra: '\\int_{a}^{b}', latex: '\\int_{@}^{}', nome: 'integral' },
  { mostra: '\\iint', latex: '\\iint_{@}', nome: 'integral dupla' },
  { mostra: '\\oint', latex: '\\oint_{@}', nome: 'integral de contorno' },
  { mostra: '\\lim_{x \\to 0}', latex: '\\lim_{@ \\to }', nome: 'limite' },
  { mostra: '\\log_{b}', latex: '\\log_{@}', nome: 'logaritmo' },
  { mostra: '\\ln', latex: '\\ln(@)', nome: 'logaritmo natural' },
  { mostra: '\\sin', latex: '\\sin(@)', nome: 'seno' },
  { mostra: '\\cos', latex: '\\cos(@)', nome: 'cosseno' },
  { mostra: '\\tan', latex: '\\tan(@)', nome: 'tangente' },
  { mostra: '\\binom{n}{k}', latex: '\\binom{@}{}', nome: 'combinação' },
  { mostra: '\\overline{x}', latex: '\\overline{@}', nome: 'barra em cima (média)' },
  { mostra: '\\vec{v}', latex: '\\vec{@}', nome: 'vetor' },
  { mostra: '|x|', latex: '|@|', nome: 'módulo' },
  { mostra: '\\left(\\right)', latex: '\\left(@\\right)', nome: 'parênteses que crescem' },
]

const relacoes: Simbolo[] = [
  { mostra: '=', latex: '=', nome: 'igual' },
  { mostra: '\\neq', latex: '\\neq', nome: 'diferente' },
  { mostra: '\\approx', latex: '\\approx', nome: 'aproximadamente' },
  { mostra: '\\equiv', latex: '\\equiv', nome: 'equivalente' },
  { mostra: '<', latex: '<', nome: 'menor' },
  { mostra: '>', latex: '>', nome: 'maior' },
  { mostra: '\\leq', latex: '\\leq', nome: 'menor ou igual' },
  { mostra: '\\geq', latex: '\\geq', nome: 'maior ou igual' },
  { mostra: '\\propto', latex: '\\propto', nome: 'proporcional a' },
  { mostra: '\\sim', latex: '\\sim', nome: 'semelhante' },
  { mostra: '\\in', latex: '\\in', nome: 'pertence' },
  { mostra: '\\notin', latex: '\\notin', nome: 'não pertence' },
  { mostra: '\\subset', latex: '\\subset', nome: 'contido' },
  { mostra: '\\subseteq', latex: '\\subseteq', nome: 'contido ou igual' },
  { mostra: '\\supset', latex: '\\supset', nome: 'contém' },
  { mostra: '\\cup', latex: '\\cup', nome: 'união' },
  { mostra: '\\cap', latex: '\\cap', nome: 'interseção' },
  { mostra: '\\emptyset', latex: '\\emptyset', nome: 'conjunto vazio' },
  { mostra: '\\mathbb{R}', latex: '\\mathbb{R}', nome: 'números reais' },
  { mostra: '\\mathbb{N}', latex: '\\mathbb{N}', nome: 'números naturais' },
  { mostra: '\\mathbb{Z}', latex: '\\mathbb{Z}', nome: 'números inteiros' },
  { mostra: '\\mathbb{Q}', latex: '\\mathbb{Q}', nome: 'números racionais' },
]

const setas: Simbolo[] = [
  { mostra: '\\to', latex: '\\to', nome: 'seta para a direita' },
  { mostra: '\\gets', latex: '\\gets', nome: 'seta para a esquerda' },
  { mostra: '\\leftrightarrow', latex: '\\leftrightarrow', nome: 'seta dupla' },
  { mostra: '\\Rightarrow', latex: '\\Rightarrow', nome: 'implica' },
  { mostra: '\\Leftarrow', latex: '\\Leftarrow', nome: 'é implicado por' },
  { mostra: '\\Leftrightarrow', latex: '\\Leftrightarrow', nome: 'se e somente se' },
  { mostra: '\\uparrow', latex: '\\uparrow', nome: 'para cima' },
  { mostra: '\\downarrow', latex: '\\downarrow', nome: 'para baixo' },
  { mostra: '\\mapsto', latex: '\\mapsto', nome: 'leva a' },
  { mostra: '\\longrightarrow', latex: '\\longrightarrow', nome: 'seta longa' },
]

const simbolos: Simbolo[] = [
  { mostra: '\\infty', latex: '\\infty', nome: 'infinito' },
  { mostra: '\\pm', latex: '\\pm', nome: 'mais ou menos' },
  { mostra: '\\mp', latex: '\\mp', nome: 'menos ou mais' },
  { mostra: '\\times', latex: '\\times', nome: 'multiplicação' },
  { mostra: '\\div', latex: '\\div', nome: 'divisão' },
  { mostra: '\\cdot', latex: '\\cdot', nome: 'ponto de multiplicação' },
  { mostra: '\\partial', latex: '\\partial', nome: 'derivada parcial' },
  { mostra: '\\nabla', latex: '\\nabla', nome: 'nabla' },
  { mostra: '\\forall', latex: '\\forall', nome: 'para todo' },
  { mostra: '\\exists', latex: '\\exists', nome: 'existe' },
  { mostra: '\\therefore', latex: '\\therefore', nome: 'portanto' },
  { mostra: '\\because', latex: '\\because', nome: 'porque' },
  { mostra: '^\\circ', latex: '^\\circ', nome: 'grau' },
  { mostra: '\\%', latex: '\\%', nome: 'porcentagem' },
  { mostra: '\\angle', latex: '\\angle', nome: 'ângulo' },
  { mostra: '\\perp', latex: '\\perp', nome: 'perpendicular' },
  { mostra: '\\parallel', latex: '\\parallel', nome: 'paralelo' },
  { mostra: '\\triangle', latex: '\\triangle', nome: 'triângulo' },
  { mostra: '\\cdots', latex: '\\cdots', nome: 'reticências' },
]

const quimica: Simbolo[] = [
  { mostra: '\\ce{A -> B}', latex: '\\ce{@ -> }', nome: 'reação direta' },
  { mostra: '\\ce{A <=> B}', latex: '\\ce{@ <=> }', nome: 'equilíbrio' },
  { mostra: '\\ce{A <- B}', latex: '\\ce{@ <- }', nome: 'reação inversa' },
  { mostra: '\\ce{H2O}', latex: '\\ce{@}', nome: 'fórmula molecular' },
  { mostra: '\\ce{SO4^2-}', latex: '\\ce{@^2-}', nome: 'íon negativo' },
  { mostra: '\\ce{Na+}', latex: '\\ce{@+}', nome: 'íon positivo' },
  { mostra: '\\ce{AgCl v}', latex: '\\ce{@ v}', nome: 'precipitado (desce)' },
  { mostra: '\\ce{H2 ^}', latex: '\\ce{@ ^}', nome: 'gás liberado (sobe)' },
  { mostra: '\\ce{A(s)}', latex: '\\ce{@(s)}', nome: 'sólido' },
  { mostra: '\\ce{A(l)}', latex: '\\ce{@(l)}', nome: 'líquido' },
  { mostra: '\\ce{A(g)}', latex: '\\ce{@(g)}', nome: 'gasoso' },
  { mostra: '\\ce{A(aq)}', latex: '\\ce{@(aq)}', nome: 'aquoso' },
  { mostra: '\\ce{A ->[C] B}', latex: '\\ce{@ ->[\\text{}] }', nome: 'reação com condição' },
  { mostra: '\\ce{^{227}_{90}Th}', latex: '\\ce{^{@}_{}Th}', nome: 'isótopo' },
  { mostra: '\\Delta H', latex: '\\Delta H', nome: 'variação de entalpia' },
]

const estruturas: Simbolo[] = [
  {
    mostra: '\\begin{cases} a \\\\ b \\end{cases}',
    latex: '\\begin{cases} @ \\\\  \\end{cases}',
    nome: 'sistema de equações',
  },
  {
    mostra: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
    latex: '\\begin{pmatrix} @ &  \\\\  &  \\end{pmatrix}',
    nome: 'matriz com parênteses',
  },
  {
    mostra: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
    latex: '\\begin{bmatrix} @ &  \\\\  &  \\end{bmatrix}',
    nome: 'matriz com colchetes',
  },
  {
    mostra: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',
    latex: '\\begin{vmatrix} @ &  \\\\  &  \\end{vmatrix}',
    nome: 'determinante',
  },
  { mostra: '\\text{texto}', latex: '\\text{@}', nome: 'texto normal dentro da fórmula' },
  { mostra: '\\underbrace{ab}', latex: '\\underbrace{@}_{}', nome: 'chave embaixo' },
  { mostra: '\\overbrace{ab}', latex: '\\overbrace{@}^{}', nome: 'chave em cima' },
]

export const PALETAS: Paleta[] = [
  { id: 'operacoes', rotulo: 'Operações', simbolos: operacoes },
  { id: 'grego', rotulo: 'Letras gregas', simbolos: grego },
  { id: 'relacoes', rotulo: 'Relações', simbolos: relacoes },
  { id: 'setas', rotulo: 'Setas', simbolos: setas },
  { id: 'simbolos', rotulo: 'Símbolos', simbolos: simbolos },
  { id: 'estruturas', rotulo: 'Estruturas', simbolos: estruturas },
  { id: 'quimica', rotulo: 'Química', simbolos: quimica },
]

/** Fórmulas inteiras, pra quem prefere começar de um exemplo. */
export const EXEMPLOS: { nome: string; latex: string }[] = [
  { nome: 'Bhaskara', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
  { nome: 'Teorema de Pitágoras', latex: 'a^2 = b^2 + c^2' },
  { nome: 'Área do círculo', latex: 'A = \\pi r^2' },
  { nome: 'Progressão aritmética', latex: 'a_n = a_1 + (n-1)r' },
  { nome: 'Juros compostos', latex: 'M = C(1 + i)^t' },
  { nome: 'Velocidade média', latex: 'v_m = \\frac{\\Delta s}{\\Delta t}' },
  { nome: 'Segunda lei de Newton', latex: '\\vec{F} = m\\vec{a}' },
  { nome: 'Energia de Einstein', latex: 'E = mc^2' },
  { nome: 'Combustão do metano', latex: '\\ce{CH4 + 2O2 -> CO2 + 2H2O}' },
  { nome: 'Síntese da amônia', latex: '\\ce{N2 + 3H2 <=> 2NH3}' },
  { nome: 'Fotossíntese', latex: '\\ce{6CO2 + 6H2O ->[\\text{luz}] C6H12O6 + 6O2}' },
  { nome: 'Concentração molar', latex: 'M = \\frac{n}{V}' },
]

/**
 * Símbolos das paletas do editor de equações, no espírito do Google Docs:
 * o autor clica no símbolo em vez de decorar o comando LaTeX.
 *
 * Cada símbolo tem:
 *   mostra — o que aparece no botão (renderizado com KaTeX)
 *   latex  — o que é inserido no campo
 *   nome   — texto do tooltip, em português
 *   alias  — sinônimos e o caractere Unicode, só para a busca achar
 *
 * `@` dentro do latex marca onde o cursor deve parar depois de inserir, e onde
 * ficam os "buracos" a preencher. É trocado por {} antes de renderizar.
 *
 * DUAS CAMADAS, E A ORDEM É A DECISÃO
 * -----------------------------------
 * O que está escrito à mão neste arquivo abre cada paleta: são os símbolos que
 * o autor usa todo dia, na ordem em que fazem sentido e com o gabarito de
 * cursor pensado (a fração já deixa o cursor no numerador). Depois deles vem o
 * `CATALOGO`, gerado da própria fonte do KaTeX, que garante que NADA falta —
 * 726 comandos, todos conferidos pela renderização.
 *
 * A ordem é o ponto: fila curada primeiro faz a paleta continuar navegável por
 * reconhecimento; ordenar tudo junto (alfabético, por Unicode) afogaria a
 * fração entre trinta variantes de dois pontos. Quem procura o que não está na
 * frente usa a busca, que varre as duas camadas de uma vez.
 */

import { CATALOGO } from './catalogo'

export type Simbolo = { mostra: string; latex: string; nome: string; alias?: string }
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

/**
 * Junta a fila curada com a cauda do catálogo, sem repetir o que já está na
 * frente. O `alias` carrega o caractere Unicode e os comandos que desenham o
 * mesmo sinal (`\ne` para o `\neq` que ficou), que é o que faz colar um `≠` na
 * busca encontrar o símbolo.
 */
function comCatalogo(id: string, curados: Simbolo[] = []): Simbolo[] {
  const jaTem = new Set(curados.map((s) => s.latex))
  // o sinônimo entra no mapa junto com o comando: a curada escreve `\neq`, e no
  // catálogo o dono do `≠` é o `\ne`, que carrega `\neq` como sinônimo
  const caractereDe = new Map<string, string>()
  for (const i of CATALOGO[id] ?? []) {
    if (!i.c) continue
    for (const nome of [i.l, ...(i.s?.split(' ') ?? [])]) caractereDe.set(nome, i.c)
  }

  // O símbolo curado costuma ser um GABARITO (`\oint_{@}`), e o catálogo tem o
  // comando cru (`\oint`) com o caractere. Sem emprestar o caractere, colar um
  // `∮` na busca acharia só a versão crua — e a curada é a melhor das duas,
  // porque já põe o cursor no limite de baixo.
  const comAlias = curados.map((s) => {
    const base = s.latex.match(/\\[a-zA-Z]+/)?.[0]
    const chr = base ? caractereDe.get(base) : undefined
    return chr ? { ...s, alias: [s.alias, chr].filter(Boolean).join(' ') } : s
  })

  const cauda = (CATALOGO[id] ?? [])
    .filter((i) => !jaTem.has(i.l))
    .map((i) => ({
      // espaço não desenha nada: o botão sairia em branco e a paleta inteira
      // ficaria uma fileira de vazios. As barras mostram o tamanho do vão.
      mostra: id === 'espacos' ? `|${i.l}|` : (i.m ?? i.l),
      latex: i.l,
      nome: i.n,
      alias: [i.c, i.s].filter(Boolean).join(' ') || undefined,
    }))
  return [...comAlias, ...cauda]
}

export const PALETAS: Paleta[] = [
  { id: 'operacoes', rotulo: 'Operações', simbolos: comCatalogo('operacoes', operacoes) },
  { id: 'grego', rotulo: 'Letras gregas', simbolos: comCatalogo('grego', grego) },
  { id: 'relacoes', rotulo: 'Relações', simbolos: comCatalogo('relacoes', relacoes) },
  { id: 'setas', rotulo: 'Setas', simbolos: comCatalogo('setas', setas) },
  { id: 'simbolos', rotulo: 'Símbolos', simbolos: comCatalogo('simbolos', simbolos) },
  { id: 'delimitadores', rotulo: 'Delimitadores', simbolos: comCatalogo('delimitadores') },
  { id: 'acentos', rotulo: 'Acentos e marcas', simbolos: comCatalogo('acentos') },
  { id: 'estruturas', rotulo: 'Estruturas', simbolos: comCatalogo('estruturas', estruturas) },
  { id: 'estilos', rotulo: 'Estilos de letra', simbolos: comCatalogo('estilos') },
  { id: 'funcoes', rotulo: 'Funções', simbolos: comCatalogo('funcoes') },
  { id: 'espacos', rotulo: 'Espaços', simbolos: comCatalogo('espacos') },
  { id: 'quimica', rotulo: 'Química', simbolos: quimica },
]

/**
 * Tira acento e caixa: quem digita "epsilon" tem de achar "épsilon".
 *
 * O recorte a LETRA LATINA não é preciosismo. Em Unicode `≠` é `=` mais uma
 * barra combinante, e `∉` é `∈` mais a mesma barra — tirar todo combinante
 * transformaria os dois no sinal que eles NEGAM, e colar um `≠` na busca
 * traria `=` no topo, dizendo o contrário do que o autor procurou.
 */
function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/([A-Za-z])[̀-ͯ]+/g, '$1')
    .normalize('NFC')
    .toLowerCase()
}

/**
 * Índice único da busca. Um símbolo pode estar em mais de uma paleta (o `\cup`
 * é operação e é conjunto), então a chave é o LaTeX — sem isso o mesmo botão
 * apareceria duas vezes no resultado.
 */
const INDICE = (() => {
  const porLatex = new Map<string, { simbolo: Simbolo; chave: string }>()
  for (const paleta of PALETAS) {
    for (const s of paleta.simbolos) {
      if (porLatex.has(s.latex)) continue
      porLatex.set(s.latex, {
        simbolo: s,
        chave: normalizar([s.nome, s.latex, s.alias, paleta.rotulo].filter(Boolean).join(' ')),
      })
    }
  }
  return [...porLatex.values()]
})()

/** Quantos símbolos o editor sabe escrever. Vai no rodapé da barra. */
export const TOTAL_DE_SIMBOLOS = INDICE.length

export function buscarSimbolos(termo: string, teto = 200): Simbolo[] {
  const alvo = normalizar(termo.trim())
  if (!alvo) return []
  // termos separados por espaço são um E: "seta dupla" acha só quem tem os dois
  const partes = alvo.split(/\s+/)
  const achados: Simbolo[] = []
  for (const { simbolo, chave } of INDICE) {
    if (partes.every((p) => chave.includes(p))) achados.push(simbolo)
    if (achados.length >= teto) break
  }
  return achados
}

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

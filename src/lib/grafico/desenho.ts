import { formatarNumero, preparar, type Compilado, type Janela } from './modelo'

/**
 * Desenha o gráfico como uma string SVG (decisão 34).
 *
 * É a MESMA função no servidor, na prévia do editor e no navegador do aluno —
 * é o que garante que o autor vê o que o aluno vê (decisão 4). Por isso
 * devolve texto, e não elementos: o servidor não tem DOM.
 *
 * As cores são `var(--grafico-N)` e os traços neutros `var(--ink-…)`, então o
 * tema claro/escuro troca sozinho, sem redesenhar.
 */

export type Dimensao = { largura: number; altura: number }

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const r1 = (v: number) => Math.round(v * 10) / 10

/** Passo "redondo" (1, 2 ou 5 × 10ⁿ) para caber ~`alvo` marcas na faixa. */
export function passoRedondo(faixa: number, alvo: number) {
  const bruto = faixa / Math.max(1, alvo)
  const ordem = Math.pow(10, Math.floor(Math.log10(bruto)))
  const m = bruto / ordem
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * ordem
}

export function desenharSvg(c: Compilado, valores: Record<string, number>, janela: Janela, dim: Dimensao): string {
  const { largura: W, altura: H } = dim
  const { xmin, xmax, ymin, ymax } = janela
  const px = (x: number) => ((x - xmin) / (xmax - xmin)) * W
  const py = (y: number) => H - ((y - ymin) / (ymax - ymin)) * H
  const amb = preparar(c, valores)
  const partes: string[] = []

  // ---- grade e marcas
  const passoX = passoRedondo(xmax - xmin, W / 70)
  const passoY = passoRedondo(ymax - ymin, H / 50)
  const xs: number[] = []
  const ys: number[] = []
  for (let k = Math.ceil(xmin / passoX); k * passoX <= xmax + 1e-9 && xs.length < 200; k++) xs.push(k * passoX)
  for (let k = Math.ceil(ymin / passoY); k * passoY <= ymax + 1e-9 && ys.length < 200; k++) ys.push(k * passoY)

  if (c.g.grade) {
    const linhas = [
      ...xs.map((x) => `M${r1(px(x))} 0V${H}`),
      ...ys.map((y) => `M0 ${r1(py(y))}H${W}`),
    ].join('')
    partes.push(`<path class="g-grade" d="${linhas}"/>`)
  }

  // ---- eixos: se o zero está fora da janela, o eixo cola na borda (sem
  // linha) e os números continuam lá, para o aluno não perder a escala
  const zeroX = Math.min(W, Math.max(0, px(0)))
  const zeroY = Math.min(H, Math.max(0, py(0)))
  const eixoYVisivel = xmin <= 0 && xmax >= 0
  const eixoXVisivel = ymin <= 0 && ymax >= 0
  const eixos: string[] = []
  if (eixoXVisivel) eixos.push(`M0 ${r1(zeroY)}H${W}`)
  if (eixoYVisivel) eixos.push(`M${r1(zeroX)} 0V${H}`)
  if (eixos.length) partes.push(`<path class="g-eixo" d="${eixos.join('')}"/>`)

  // números do eixo x embaixo do eixo (ou em cima, se ele estiver no rodapé)
  const yNumX = zeroY > H - 18 ? zeroY - 6 : zeroY + 14
  const xNumY = zeroX < 30 ? zeroX + 5 : zeroX - 5
  const ancoraY = zeroX < 30 ? 'start' : 'end'
  const numeros: string[] = []
  for (const x of xs) {
    if (Math.abs(x) < passoX / 2) continue
    const X = px(x)
    if (X < 10 || X > W - 10) continue
    numeros.push(`<text x="${r1(X)}" y="${r1(yNumX)}" text-anchor="middle">${esc(formatarNumero(x))}</text>`)
  }
  for (const y of ys) {
    if (Math.abs(y) < passoY / 2) continue
    const Y = py(y)
    // o topo é do nome do eixo
    if (Y < 24 || Y > H - 8) continue
    numeros.push(`<text x="${r1(xNumY)}" y="${r1(Y + 4)}" text-anchor="${ancoraY}">${esc(formatarNumero(y))}</text>`)
  }
  if (eixoXVisivel && eixoYVisivel) {
    numeros.push(`<text x="${r1(zeroX - 5)}" y="${r1(zeroY + 14)}" text-anchor="end">0</text>`)
  }
  partes.push(`<g class="g-numeros">${numeros.join('')}</g>`)

  // nomes dos eixos, nas pontas
  const nomeX = c.g.eixoX || c.g.variavel
  const nomeY = c.g.eixoY || (c.g.eixoX ? '' : 'y')
  const nomes: string[] = []
  if (nomeX) nomes.push(`<text x="${W - 6}" y="${r1(zeroY > H - 30 ? zeroY - 22 : zeroY - 6)}" text-anchor="end">${esc(nomeX)}</text>`)
  if (nomeY) {
    const ancora = zeroX > W - 80 ? 'end' : 'start'
    nomes.push(`<text x="${r1(ancora === 'end' ? zeroX - 8 : zeroX + 8)}" y="14" text-anchor="${ancora}">${esc(nomeY)}</text>`)
  }
  partes.push(`<g class="g-nome-eixo">${nomes.join('')}</g>`)

  // ---- funções
  c.g.objetos.forEach((o, i) => {
    if (o.tipo !== 'funcao' || !c.arvores.has(i)) return
    const f = amb.funcoes[o.nome]
    partes.push(`<path class="g-curva" style="stroke:var(--grafico-${o.cor})" d="${caminhoDaCurva(f, janela, W, H)}"/>`)
  })

  // ---- segmentos, retas e vetores (embaixo dos pontos)
  c.g.objetos.forEach((o, i) => {
    if ((o.tipo !== 'segmento' && o.tipo !== 'reta' && o.tipo !== 'vetor') || c.erros.has(i)) return
    const A = amb.pontos.get(o.de)
    const B = amb.pontos.get(o.ate)
    if (!A || !B || ![A.x, A.y, B.x, B.y].every(Number.isFinite)) return
    let x1 = px(A.x)
    let y1 = py(A.y)
    let x2 = px(B.x)
    let y2 = py(B.y)
    const dx = x2 - x1
    const dy = y2 - y1
    const comp = Math.hypot(dx, dy)
    const estilo = `stroke:var(--grafico-${o.cor})`
    if (o.tipo === 'reta') {
      if (comp < 1e-9) return
      const ext = (W + H) * 2 / comp
      ;[x1, y1, x2, y2] = [x1 - dx * ext, y1 - dy * ext, x2 + dx * ext, y2 + dy * ext]
    }
    const limitado = [x1, y1, x2, y2].map((v) => Math.max(-1e5, Math.min(1e5, v)))
    if (o.tipo === 'vetor' && comp > 1) {
      // a haste para antes da ponta, senão o traço grosso aparece além dela
      const ux = dx / comp
      const uy = dy / comp
      const ponta = Math.min(12, comp * 0.6)
      const bx = x2 - ux * ponta
      const by = y2 - uy * ponta
      partes.push(`<path class="g-traco" style="${estilo}" d="M${r1(x1)} ${r1(y1)}L${r1(bx)} ${r1(by)}"/>`)
      const lado = ponta * 0.45
      partes.push(
        `<path class="g-seta" style="fill:var(--grafico-${o.cor})" d="M${r1(x2)} ${r1(y2)}L${r1(bx - uy * lado)} ${r1(by + ux * lado)}L${r1(bx + uy * lado)} ${r1(by - ux * lado)}Z"/>`,
      )
    } else {
      partes.push(
        `<path class="g-traco" style="${estilo}" d="M${r1(limitado[0])} ${r1(limitado[1])}L${r1(limitado[2])} ${r1(limitado[3])}"/>`,
      )
    }
    if (o.rotulo && comp > 1) {
      // rótulo no meio do segmento entre os pontos, deslocado para fora
      const mx = (px(A.x) + px(B.x)) / 2
      const my = (py(A.y) + py(B.y)) / 2
      const nx = -dy / comp
      const ny = dx / comp
      const lado = ny > 0 ? -1 : 1
      partes.push(
        `<text class="g-rotulo" style="fill:var(--grafico-${o.cor})" x="${r1(mx + nx * 12 * lado)}" y="${r1(my + ny * 12 * lado + 4)}" text-anchor="middle">${esc(o.rotulo)}</text>`,
      )
    }
  })

  // ---- pontos, por cima de tudo
  c.g.objetos.forEach((o) => {
    if (o.tipo !== 'ponto' || o.rotulo === 'oculto') return
    const P = amb.pontos.get(o.nome)
    if (!P || !Number.isFinite(P.x) || !Number.isFinite(P.y)) return
    const X = px(P.x)
    const Y = py(P.y)
    if (X < -20 || X > W + 20 || Y < -20 || Y > H + 20) return
    partes.push(`<circle class="g-ponto" style="fill:var(--grafico-${o.cor})" cx="${r1(X)}" cy="${r1(Y)}" r="4.5"/>`)
    if (o.rotulo === 'nada') return
    const texto = o.rotulo === 'coordenadas' ? `${o.nome} = (${formatarNumero(P.x, 2)}; ${formatarNumero(P.y, 2)})` : o.nome
    const aDireita = X < W - 150
    partes.push(
      `<text class="g-rotulo" x="${r1(aDireita ? X + 8 : X - 8)}" y="${r1(Y < 20 ? Y + 18 : Y - 8)}" text-anchor="${aDireita ? 'start' : 'end'}">${esc(texto)}</text>`,
    )
  })

  return (
    `<svg class="g-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">` +
    partes.join('') +
    '</svg>'
  )
}

/**
 * O caminho da curva, amostrado a cada pixel.
 *
 * Duas coisas que o jeito ingênuo erra:
 *
 * - **Descontinuidade.** Em `1/x` e `tg(x)` a curva some num lado da tela e
 *   volta do outro. Ligar os dois pontos risca uma parede vertical que não
 *   existe. Quando o salto é maior que a tela, um ponto do MEIO decide: se o
 *   valor dele não fica entre os dois, há uma assíntota ali e o traço se parte.
 * - **Coordenada gigante.** Perto da assíntota o valor vai a 10¹⁵ px, e
 *   navegador desenha mal número assim. O valor é preso a três telas de
 *   distância, que ainda sai da borda na direção certa.
 */
function caminhoDaCurva(f: (x: number) => number, j: Janela, W: number, H: number): string {
  const amostras = Math.min(1200, Math.max(100, Math.round(W)))
  const prender = (Y: number) => Math.max(-2 * H, Math.min(3 * H, Y))
  const yPx = (y: number) => H - ((y - j.ymin) / (j.ymax - j.ymin)) * H
  const xDe = (k: number) => j.xmin + (k / amostras) * (j.xmax - j.xmin)
  let d = ''
  let anterior: number | null = null
  for (let k = 0; k <= amostras; k++) {
    const x = xDe(k)
    const y = f(x)
    if (!Number.isFinite(y)) {
      anterior = null
      continue
    }
    const Y = yPx(y)
    let partir = anterior === null
    if (anterior !== null && Math.abs(Y - anterior) > H) {
      const meio = f((xDe(k - 1) + x) / 2)
      const M = Number.isFinite(meio) ? yPx(meio) : NaN
      const entre = Math.min(Y, anterior) - 1 <= M && M <= Math.max(Y, anterior) + 1
      if (!entre) partir = true
    }
    const X = r1((k / amostras) * W)
    d += `${partir ? 'M' : 'L'}${X} ${r1(prender(Y))}`
    anterior = Y
  }
  return d || 'M0 0'
}

/** Ajusta a janela às curvas e pontos (botão "Enquadrar" do painel). */
export function enquadrar(c: Compilado, valores: Record<string, number>, j: Janela): Janela {
  const amb = preparar(c, valores)
  const ys: number[] = []
  const xs: number[] = []
  for (const f of Object.values(amb.funcoes)) {
    for (let k = 0; k <= 200; k++) {
      const y = f(j.xmin + (k / 200) * (j.xmax - j.xmin))
      if (Number.isFinite(y) && Math.abs(y) < 1e6) ys.push(y)
    }
  }
  for (const p of amb.pontos.values()) {
    if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
      xs.push(p.x)
      ys.push(p.y)
    }
  }
  if (!ys.length) return j
  // corta os 3% de cada ponta: uma assíntota não pode decidir a escala
  ys.sort((a, b) => a - b)
  const corte = Math.floor(ys.length * 0.03)
  let ymin = ys[corte]
  let ymax = ys[ys.length - 1 - corte]
  let xmin = Math.min(j.xmin, ...xs)
  let xmax = Math.max(j.xmax, ...xs)
  if (ymax - ymin < 1e-6) {
    ymin -= 1
    ymax += 1
  }
  const folgaY = (ymax - ymin) * 0.12
  const folgaX = xs.length ? (xmax - xmin) * 0.05 : 0
  ymin -= folgaY
  ymax += folgaY
  xmin -= folgaX
  xmax += folgaX
  const redondo = (v: number) => Number(v.toPrecision(3))
  return { xmin: redondo(xmin), xmax: redondo(xmax), ymin: redondo(ymin), ymax: redondo(ymax) }
}


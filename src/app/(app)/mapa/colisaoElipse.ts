'use client'

/**
 * Colisão que sabe que o rótulo é largo e baixo.
 *
 * O `forceCollide` do d3 é CIRCULAR, e o nó do mapa não é: um resumo é um ponto
 * de 7px carregando embaixo uma linha de texto de 11px que chega a 140px de
 * largura. Pedir a um círculo que cubra esse retângulo obriga o raio a ser a
 * meia-largura do TEXTO — e o círculo passa a reservar na vertical uma folga de
 * 59px que nenhum pixel usa. Cada nó ficava com uma área de exclusão de
 * ~10.900px², contra os ~4.400px² que ele de fato ocupa.
 *
 * Isso não era um detalhe. Com 46 resumos pendurados direto em Biologia (223
 * dos 232 resumos do acervo têm `pai_id` nulo — a árvore quase não existe), a
 * estrela precisava de ~500px de raio para caber, contra os 187px do anel das
 * matérias: a estrela de uma matéria engolia as âncoras das vizinhas, a aresta
 * "contém" assentava a 5x o comprimento pedido, e a briga entre a aresta que
 * puxa e a colisão que empurra era o tremor que se via na tela.
 *
 * Medido na topologia real (simulação headless, o mesmo método da decisão 10b),
 * trocando o círculo pela elipse: com Biologia aberta o desenho caiu de 828x858
 * para 644x876 e a velocidade de pico de 74px/tick para 30; com TUDO aberto, de
 * 2052x1855 para 1440x1218 — o que leva o enquadramento de escala 0,40 para
 * 0,60 e devolve os rótulos, que somem abaixo de 0,55.
 *
 * O preço, declarado: rótulo pode encostar em rótulo. Com uma matéria aberta
 * são 1 par em 56 nós; com o acervo inteiro, 16 pares em 242. Era zero antes —
 * mas antes, com tudo aberto, não havia rótulo nenhum para se sobrepor.
 *
 * ---------- como funciona ----------
 *
 * Elipse é círculo num espaço esticado. Multiplicando o `y` de todo mundo por
 * K = largura/altura média, o problema vira o mesmo do `forceCollide`, e o
 * empurrão volta ao espaço real dividindo a componente vertical por K de novo.
 * O quadtree é construído JÁ no espaço esticado, senão a poda de ramos
 * descartaria vizinhos que na elipse ainda se tocam.
 *
 * O `d3-quadtree` entra como import direto pelo mesmo motivo dos outros
 * (decisão 10): ele já vem instalado como dependência do `d3-force`, que o usa
 * por baixo — declará-lo no `package.json` não acrescenta um byte ao pacote e
 * evita depender de uma dependência de terceiro por acidente.
 */

import { quadtree } from 'd3-quadtree'
import type { Force, SimulationNodeDatum } from 'd3-force'

/**
 * Folga horizontal, menor que os 12px do raio circular antigo de propósito: na
 * horizontal o vizinho é outro rótulo, e o traço de contorno na cor do fundo
 * (`paint-order: stroke`) já separa os dois quando eles quase se tocam.
 */
const FOLGA_X = 8

/**
 * Folga vertical. O rótulo é desenhado em `dy = raio + 14` com 11px de corpo,
 * então termina por volta de `raio + 18`; os 20 deixam sobrar o traço de
 * contorno e o anel mais grosso do nó pregado.
 */
const FOLGA_Y = 20

/**
 * As duas medidas da elipse de um nó, derivadas dos mesmos acessadores.
 *
 * Vem em par por uma razão prática: a colisão e o `enquadrar` precisam medir o
 * MESMO retângulo. Se divergirem, o mapa assenta sem sobreposição e mesmo assim
 * termina com um rótulo cortado pela borda da tela, sem nada avisando — é o
 * mesmo cuidado que obriga `extrairTitulos` e `ancorarTitulos` a andarem juntas.
 */
export function medidasElipse<No>(raio: (d: No) => number, meiaLargura: (d: No) => number) {
  return {
    rx: (d: No) => raio(d) + FOLGA_X + meiaLargura(d),
    ry: (d: No) => raio(d) + FOLGA_Y,
  }
}

/**
 * Quanto da sobreposição é corrigido por passada.
 *
 * Igual ao `strength` do `forceCollide`, e menor que 1 pelo mesmo motivo:
 * resolver a colisão inteira de uma vez faz o nó saltar para fora e voltar. Com
 * duas iterações, 0,7 fecha a conta antes de o alpha cair.
 */
const FORCA = 0.7
const ITERACOES = 2

/** Só o que é lido do nó interno do quadtree — o pacote não exporta isso. */
type RamoDaArvore<No> = { data?: No; r?: number } & Record<number, { r?: number } | undefined>

/**
 * Força de colisão elíptica, com a mesma interface das forças do d3.
 */
export function colisaoElipse<No extends SimulationNodeDatum>(
  rx: (d: No) => number,
  ry: (d: No) => number
): Force<No, undefined> {
  let nos: No[] = []
  let K = 1

  function forca() {
    // `x + vx` e não `x`: a colisão do d3 corrige a posição PREVISTA, senão
    // estaria sempre resolvendo o quadro anterior.
    const arvore = quadtree(
      nos,
      (d) => (d.x ?? 0) + (d.vx ?? 0),
      (d) => ((d.y ?? 0) + (d.vy ?? 0)) * K
    ).visitAfter(maiorRaio)

    for (let k = 0; k < ITERACOES; k++) {
      for (const no of nos) {
        const ri = rx(no)
        const ri2 = ri * ri
        const xi = (no.x ?? 0) + (no.vx ?? 0)
        const yi = ((no.y ?? 0) + (no.vy ?? 0)) * K

        arvore.visit((q, x0, y0, x1, y1) => {
          const ramo = q as RamoDaArvore<No>
          const outro = ramo.data
          const rj = ramo.r ?? 0
          const r = ri + rj

          if (outro) {
            // só metade dos pares: um empurrão já move os dois
            if ((outro.index ?? 0) <= (no.index ?? 0)) return
            let x = xi - (outro.x ?? 0) - (outro.vx ?? 0)
            let y = yi - ((outro.y ?? 0) + (outro.vy ?? 0)) * K
            let l = x * x + y * y
            if (l >= r * r) return

            // dois nós no mesmo ponto não têm direção para separar
            if (x === 0) {
              x = 1e-6
              l += x * x
            }
            if (y === 0) {
              y = 1e-6
              l += y * y
            }

            l = Math.sqrt(l)
            l = ((r - l) / l) * FORCA
            // o menor cede mais, como no `forceCollide`
            const rj2 = rj * rj
            const parte = rj2 / (ri2 + rj2)

            x *= l
            y *= l
            no.vx = (no.vx ?? 0) + x * parte
            no.vy = (no.vy ?? 0) + (y * parte) / K
            outro.vx = (outro.vx ?? 0) - x * (1 - parte)
            outro.vy = (outro.vy ?? 0) - (y * (1 - parte)) / K
            return
          }

          // ramo inteiro longe demais: não desce nele
          return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r
        })
      }
    }
  }

  /** Guarda em cada ramo o maior raio de dentro dele, que é o que poda a busca. */
  function maiorRaio(q: unknown) {
    const ramo = q as RamoDaArvore<No>
    if (ramo.data) {
      ramo.r = rx(ramo.data)
      return
    }
    ramo.r = 0
    for (let i = 0; i < 4; i++) {
      const filho = ramo[i]
      if (filho && (filho.r ?? 0) > ramo.r) ramo.r = filho.r ?? 0
    }
  }

  forca.initialize = (novos: No[]) => {
    nos = novos
    /* K é global, e não por nó, porque é o que faz o truque do espaço esticado
       valer: dois nós só podem ser comparados como círculos se estiverem no
       MESMO espaço. A razão média mantém a largura certa e aproxima a altura —
       o erro é de poucos pixels num rótulo que já tem folga, e a alternativa
       (colisão elipse-elipse de verdade) é uma equação de quarto grau por par. */
    const soma = nos.reduce((s, d) => s + rx(d) / ry(d), 0)
    K = nos.length > 0 ? soma / nos.length : 1
  }

  return forca
}

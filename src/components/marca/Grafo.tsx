/**
 * A textura de grafo que faltava na cara pública do site.
 *
 * A empresa se chama Plataforma **Grafos**, o produto inteiro é construído em
 * cima disso — `pai_id` contém, `conexoes` cita, todo título é um nó — e quem
 * chegava pela landing não via um nó sequer. Esta é a peça que fecha esse
 * buraco, e ela é a marca crescendo do que o produto já é, e não um ícone
 * genérico somado por cima.
 *
 * **É textura, nunca protagonista.** Três regras que a mantêm assim, e que são
 * o que separa "identidade" de "papel de parede":
 *
 * 1. **Vive sobre `--canvas`, atrás do conteúdo.** Nunca no meio da leitura,
 *    nunca como ilustração central.
 * 2. **Contraste baixo, e o acento é escasso.** As arestas saem em
 *    `--line-forte`, a maioria dos nós em `--ink-faint`, e só TRÊS em
 *    `--acento`. Se todo nó fosse lilás o desenho brigaria com os botões, que
 *    são o que de fato precisa ser clicado — e acento em tudo é acento em nada.
 * 3. **Some sob `prefers-reduced-motion`?** Não: ele não se move. Não há
 *    animação nenhuma aqui de propósito — um grafo que pulsa atrás de um texto
 *    de venda é exatamente o "visualmente caótico" que não se quer.
 *
 * O desenho é FIXO e escrito à mão, não gerado ao acaso. Um layout aleatório
 * mudaria a cada carregamento, e uma marca que muda de forma não é marca. As
 * posições formam três grupos frouxos ligados entre si — que é a forma real do
 * conteúdo: matérias que se tocam em alguns pontos, não uma malha uniforme.
 *
 * `preserveAspectRatio="xMidYMid slice"` porque isto é fundo: ele cobre a área
 * e deixa sobrar o que não couber, em vez de esticar e entortar os círculos.
 */

/** [x, y] no sistema do viewBox. Índices são citados por `ARESTAS`. */
const NOS: [number, number][] = [
  // grupo da esquerda
  [70, 120], [140, 62], [128, 196], [212, 130], [58, 258],
  // grupo do meio
  [300, 76], [356, 168], [284, 236], [392, 268], [330, 330],
  // grupo da direita
  [486, 116], [556, 190], [472, 250], [600, 96], [614, 292],
  // periferia, que é o que impede o desenho de virar um bloco compacto
  [180, 330], [700, 200], [246, 26], [660, 372], [96, 384],
]

/** Pares de índices de `NOS`. Densidade maior dentro do grupo do que entre eles. */
const ARESTAS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [0, 4], [2, 4], [1, 17],
  [3, 5], [5, 6], [6, 7], [7, 8], [6, 8], [8, 9], [7, 9], [5, 17],
  [6, 10], [10, 11], [10, 12], [11, 12], [11, 14], [10, 13], [13, 16], [11, 16],
  [9, 15], [15, 2], [4, 19], [15, 19], [14, 18], [16, 18], [12, 8],
]

/** Os três únicos nós em acento. Escolhidos um por grupo, para o olho ligar os três. */
const NOS_EM_ACENTO = new Set([3, 6, 11])

export default function Grafo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 420"
      preserveAspectRatio="xMidYMid slice"
      /* Decorativo: não acrescenta informação que o texto ao lado já não dê.
         Sem isto, o leitor de tela anunciaria uma imagem sem conteúdo no meio
         da frase de abertura do site. */
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* As arestas vêm primeiro para os nós pousarem por cima delas — senão a
          linha atravessa o círculo e o nó deixa de parecer um ponto de parada. */}
      <g stroke="var(--line-forte)" strokeWidth="1.25">
        {ARESTAS.map(([a, z]) => (
          <line
            key={`${a}-${z}`}
            x1={NOS[a][0]}
            y1={NOS[a][1]}
            x2={NOS[z][0]}
            y2={NOS[z][1]}
          />
        ))}
      </g>

      {NOS.map(([x, y], i) => {
        const acento = NOS_EM_ACENTO.has(i)
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            /* Os de acento são um pouco maiores. Tamanho e cor dizendo a mesma
               coisa é redundância de propósito: quem não distingue o lilás do
               cinza ainda vê que aqueles três são outra coisa — é a mesma regra
               do ponto de matéria na barra lateral. */
            r={acento ? 6 : 4}
            fill={acento ? 'var(--acento)' : 'var(--ink-faint)'}
          />
        )
      })}
    </svg>
  )
}

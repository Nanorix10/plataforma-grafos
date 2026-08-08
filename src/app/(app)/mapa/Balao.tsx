'use client'

/**
 * Cartão com a definição do tópico. Compartilhado pelos dois modos do mapa
 * (grafo e mapa mental) pra que a explicação apareça igual nos dois.
 *
 * Recebe coordenadas em pixels já relativas ao container — quem chama é
 * responsável por medir, porque cada modo posiciona os nós de um jeito.
 */

export type NoComDefinicao = {
  titulo: string
  cor: string
  definicao: string
}

export type PosicaoBalao = { no: NoComDefinicao; x: number; y: number }

export default function Balao({ dados }: { dados: PosicaoBalao | null }) {
  if (!dados) return null

  return (
    <div
      role="tooltip"
      // -translate-x-1/2 centraliza no nó; -translate-y-full sobe o cartão pra
      // ele ficar acima, sem tapar o que está sendo lido
      className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full"
      style={{ left: dados.x, top: dados.y - 12 }}
    >
      <div className="w-[248px] max-w-[70vw] bg-[var(--raised)] border border-[var(--line-forte)] rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.5)] px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            aria-hidden="true"
            className="w-[7px] h-[7px] rounded-sm shrink-0"
            style={{ background: dados.no.cor }}
          />
          <span className="font-semibold text-[12.5px] leading-tight text-balance">
            {dados.no.titulo}
          </span>
        </div>
        <p className="text-[12px] leading-snug text-[var(--ink-dim)] text-pretty">
          {dados.no.definicao}
        </p>
      </div>
    </div>
  )
}

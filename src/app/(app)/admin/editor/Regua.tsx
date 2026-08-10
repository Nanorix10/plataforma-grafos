'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  LARGURA_PAGINA,
  MARGEM_PADRAO,
  ajustarMargens,
} from '@/lib/pagina'

/**
 * A régua da folha, com os dois marcadores de margem.
 *
 * Copia o gesto do Google Docs de propósito: é onde os resumos nasceram, e é o
 * único lugar em que o autor já sabe arrastar margem sem ninguém explicar.
 *
 * A régua fica na LARGURA REAL da folha (920px), não numa escala reduzida.
 * Réguas em miniatura obrigam a converter mentalmente "arrastei 3px, mexi
 * quanto?" — aqui o marcador anda junto com a borda do texto, que é o retorno
 * que faz o gesto ser entendido de primeira.
 */

const ALTURA = 22

export default function Regua({
  esq,
  dir,
  aoMudar,
}: {
  esq: number
  dir: number
  aoMudar: (esq: number, dir: number) => void
}) {
  const trilhoRef = useRef<HTMLDivElement>(null)
  const [arrastando, setArrastando] = useState<'esq' | 'dir' | null>(null)
  /** Escala da folha na tela: em janela estreita ela é desenhada menor. */
  const [escala, setEscala] = useState(1)

  useEffect(() => {
    const el = trilhoRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setEscala(e.contentRect.width / LARGURA_PAGINA)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* O arrasto escuta no WINDOW, não no marcador. O ponteiro sai do marcador de
     6px de largura no primeiro movimento rápido, e um listener preso a ele
     perderia o resto do gesto — o marcador "escapa" da mão. */
  const arrastandoRef = useRef<'esq' | 'dir' | null>(null)
  arrastandoRef.current = arrastando

  const mover = useCallback(
    (clientX: number) => {
      const el = trilhoRef.current
      const lado = arrastandoRef.current
      if (!el || !lado) return
      const r = el.getBoundingClientRect()
      // de pixel de tela para pixel de folha
      const naFolha = (clientX - r.left) / (r.width / LARGURA_PAGINA)
      const novo =
        lado === 'esq'
          ? ajustarMargens(naFolha, dir)
          : ajustarMargens(esq, LARGURA_PAGINA - naFolha)
      aoMudar(novo.esq, novo.dir)
    },
    [esq, dir, aoMudar]
  )

  useEffect(() => {
    if (!arrastando) return
    function aoMover(e: PointerEvent) {
      e.preventDefault()
      mover(e.clientX)
    }
    function aoSoltar() {
      setArrastando(null)
    }
    window.addEventListener('pointermove', aoMover)
    window.addEventListener('pointerup', aoSoltar)
    window.addEventListener('pointercancel', aoSoltar)
    return () => {
      window.removeEventListener('pointermove', aoMover)
      window.removeEventListener('pointerup', aoSoltar)
      window.removeEventListener('pointercancel', aoSoltar)
    }
  }, [arrastando, mover])

  const coluna = LARGURA_PAGINA - esq - dir

  /** Teclado: setas de 10 em 10, com Shift de 1 em 1 para o ajuste fino. */
  function aoTeclar(e: React.KeyboardEvent, lado: 'esq' | 'dir') {
    const passo = e.shiftKey ? 1 : 10
    let d = 0
    if (e.key === 'ArrowLeft') d = lado === 'esq' ? -passo : passo
    else if (e.key === 'ArrowRight') d = lado === 'esq' ? passo : -passo
    else if (e.key === 'Home') {
      e.preventDefault()
      return aoMudar(
        ...(Object.values(
          ajustarMargens(
            lado === 'esq' ? MARGEM_PADRAO : esq,
            lado === 'dir' ? MARGEM_PADRAO : dir
          )
        ) as [number, number])
      )
    } else return

    e.preventDefault()
    const novo =
      lado === 'esq' ? ajustarMargens(esq + d, dir) : ajustarMargens(esq, dir + d)
    aoMudar(novo.esq, novo.dir)
  }

  function Marcador({ lado }: { lado: 'esq' | 'dir' }) {
    const valor = lado === 'esq' ? esq : dir
    const ativo = arrastando === lado
    return (
      <button
        type="button"
        role="slider"
        aria-label={`Margem ${lado === 'esq' ? 'esquerda' : 'direita'}`}
        aria-valuenow={valor}
        aria-valuetext={`${valor} pixels`}
        onPointerDown={(e) => {
          e.preventDefault()
          setArrastando(lado)
        }}
        onDoubleClick={() => {
          // volta ao padrão sem obrigar a mirar o valor exato de novo
          const novo =
            lado === 'esq'
              ? ajustarMargens(MARGEM_PADRAO, dir)
              : ajustarMargens(esq, MARGEM_PADRAO)
          aoMudar(novo.esq, novo.dir)
        }}
        onKeyDown={(e) => aoTeclar(e, lado)}
        title={`${valor}px — arraste, ou duplo clique para voltar ao padrão`}
        className="absolute top-0 bottom-0 w-[13px] -translate-x-1/2 cursor-col-resize touch-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] rounded"
        style={{
          left: `${((lado === 'esq' ? esq : LARGURA_PAGINA - dir) / LARGURA_PAGINA) * 100}%`,
        }}
      >
        {/* triângulo apontando para o texto, como no editor de documentos */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-[5px] w-0 h-0 border-x-[6px] border-x-transparent border-t-[7px]"
          style={{ borderTopColor: ativo ? 'var(--acento)' : 'var(--ink-faint)' }}
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-[7px]"
          style={{ background: ativo ? 'var(--acento)' : 'var(--line-forte)' }}
        />
      </button>
    )
  }

  return (
    <div className="flex justify-center px-4 pt-2 select-none">
      <div className="w-full" style={{ maxWidth: LARGURA_PAGINA }}>
        <div
          ref={trilhoRef}
          className="relative"
          style={{ height: ALTURA }}
          // a régua não é um controle de texto; o clique fora dos marcadores
          // não deve tirar o cursor de onde o autor estava escrevendo
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* trilho: a parte de dentro é a coluna de texto, as pontas são margem */}
          <div className="absolute inset-x-0 bottom-[6px] h-[5px] rounded-sm bg-[var(--sel)]" />
          <div
            className="absolute bottom-[6px] h-[5px] rounded-sm bg-[var(--raised-hover)] shadow-[inset_0_0_0_1px_var(--line-forte)]"
            style={{
              left: `${(esq / LARGURA_PAGINA) * 100}%`,
              right: `${(dir / LARGURA_PAGINA) * 100}%`,
            }}
          />

          <Marcador lado="esq" />
          <Marcador lado="dir" />

          {/* Enquanto arrasta, o número aparece — sem ele o gesto é adivinhação.
              Fora do arrasto ele some, para a régua não virar mais um painel. */}
          {arrastando ? (
            <span
              className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10.5px] tabular-nums px-1.5 py-0.5 rounded bg-[var(--acento)] text-[var(--page)] whitespace-nowrap"
              role="status"
              aria-live="polite"
            >
              {esq} · {coluna} · {dir}
            </span>
          ) : null}
        </div>

        {/* aviso honesto quando a folha está sendo desenhada menor do que é */}
        {escala < 0.95 ? (
          <p className="text-[10.5px] text-[var(--ink-faint)] text-center -mt-0.5">
            folha reduzida a {Math.round(escala * 100)}% para caber na janela — as
            margens continuam valendo em pixels de verdade
          </p>
        ) : null}
      </div>
    </div>
  )
}

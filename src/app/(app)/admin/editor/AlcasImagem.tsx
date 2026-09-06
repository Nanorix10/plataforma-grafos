'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { naMargem, VAO_LATERAL } from './imagem'

/**
 * As alças de redimensionar da imagem selecionada — o gesto do Google Docs.
 *
 * ============================================================
 * Por que sobreposição, e não um NodeView
 * ============================================================
 * O caminho normal do TipTap seria um NodeView em React, que substitui o
 * desenho do nó dentro do editor. O problema é que aí passariam a existir DUAS
 * renderizações da mesma imagem: a do React, que o autor vê, e a do
 * `renderHTML`, que o aluno recebe. Elas divergiriam no primeiro ajuste, e o
 * WYSIWYG — a razão de o editor existir (decisão 4) — cairia junto.
 *
 * Aqui o desenho continua vindo do `renderHTML`. Isto é só uma camada de alças
 * medida por cima da figura de verdade, que some quando ela é desmarcada.
 */

type Caixa = { topo: number; esq: number; larg: number; alt: number }

export default function AlcasImagem({
  editor,
  containerRef,
  margemEsq,
  margemDir,
}: {
  editor: Editor
  containerRef: React.RefObject<HTMLDivElement | null>
  /* Só para o modo lateral: lá a porcentagem é da margem, não da coluna. */
  margemEsq: number
  margemDir: number
}) {
  const [caixa, setCaixa] = useState<Caixa | null>(null)
  const arrasto = useRef<{
    x0: number
    larg0: number
    alt0: number
    /* O denominador da porcentagem gravada: a coluna quando a figura está no
       texto, a margem quando está na lateral. Uma frase só, sem exceção — ver
       a spec `2026-09-06-imagem-na-margem-design.md`. */
    referencia: number
    /* +1 quando arrastar para a DIREITA aumenta a figura, −1 quando é o
       contrário. Em `margemDir` a borda de fora é a presa e quem cresce é a de
       dentro, que fica à esquerda: sem inverter, o gesto puxa ao contrário. */
    sinal: 1 | -1
  } | null>(null)
  const [arrastando, setArrastando] = useState(false)

  const quebra = editor.getAttributes('image').quebra
  const lateral = naMargem(quebra)

  /** Acha a `<figure>` do nó selecionado e mede onde ela está na tela. */
  const medir = useCallback(() => {
    const container = containerRef.current
    if (!container || !editor.isActive('image')) return setCaixa(null)

    const pos = editor.state.selection.from
    const dom = editor.view.nodeDOM(pos)
    const figura =
      dom instanceof HTMLElement
        ? (dom.closest('figure') ?? dom.querySelector('figure') ?? dom)
        : null
    const img = figura?.querySelector('img')
    if (!img) return setCaixa(null)

    const r = img.getBoundingClientRect()
    const rc = container.getBoundingClientRect()
    setCaixa({
      topo: r.top - rc.top + container.scrollTop,
      esq: r.left - rc.left,
      larg: r.width,
      alt: r.height,
    })
  }, [editor, containerRef])

  /* Remede a cada transação e a cada rolagem: mudar a régua, trocar o
     alinhamento ou rolar a folha move a figura, e alça fora de lugar é pior do
     que alça nenhuma. */
  useEffect(() => {
    medir()
    const container = containerRef.current
    editor.on('transaction', medir)
    editor.on('selectionUpdate', medir)
    window.addEventListener('resize', medir)
    container?.addEventListener('scroll', medir)
    return () => {
      editor.off('transaction', medir)
      editor.off('selectionUpdate', medir)
      window.removeEventListener('resize', medir)
      container?.removeEventListener('scroll', medir)
    }
  }, [editor, medir, containerRef])

  useEffect(() => {
    if (!arrastando) return
    function aoMover(e: PointerEvent) {
      const a = arrasto.current
      if (!a) return
      e.preventDefault()
      const nova = Math.max(24, a.larg0 + (e.clientX - a.x0) * a.sinal)
      /* Grava em PORCENTAGEM do espaço onde a figura mora, não nos pixels
         arrastados: pixel amarraria a imagem à largura da folha do dia em que
         foi arrastada, e bastaria mexer na régua para ela estourar. */
      const pct = Math.round((nova / a.referencia) * 100)
      editor
        .chain()
        .updateAttributes('image', { largura: `${Math.min(100, Math.max(5, pct))}%`, altura: '' })
        .run()
    }
    function aoSoltar() {
      setArrastando(false)
      arrasto.current = null
    }
    window.addEventListener('pointermove', aoMover)
    window.addEventListener('pointerup', aoSoltar)
    window.addEventListener('pointercancel', aoSoltar)
    return () => {
      window.removeEventListener('pointermove', aoMover)
      window.removeEventListener('pointerup', aoSoltar)
      window.removeEventListener('pointercancel', aoSoltar)
    }
  }, [arrastando, editor])

  if (!caixa) return null

  function comecar(e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    const c = caixa
    if (!c) return
    // a coluna de texto é o pai da figura: é dela que a porcentagem sai
    const pos = editor.state.selection.from
    const dom = editor.view.nodeDOM(pos)
    const pai =
      dom instanceof HTMLElement ? (dom.closest('.conteudo-resumo') as HTMLElement | null) : null
    arrasto.current = {
      x0: e.clientX,
      larg0: c.larg,
      alt0: c.alt,
      referencia: lateral
        ? Math.max(24, (quebra === 'margemEsq' ? margemEsq : margemDir) - VAO_LATERAL)
        : pai?.clientWidth || c.larg,
      sinal: quebra === 'margemDir' ? -1 : 1,
    }
    setArrastando(true)
  }

  const alca =
    'absolute w-[11px] h-[11px] rounded-full bg-[var(--acento)] shadow-[0_0_0_2px_var(--paper)] pointer-events-auto'

  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none z-20"
      style={{ top: caixa.topo, left: caixa.esq, width: caixa.larg, height: caixa.alt }}
    >
      {/* moldura fina: é ela que diz QUAL imagem está selecionada quando há
          várias perto uma da outra */}
      <div className="absolute inset-0 outline outline-2 outline-[var(--acento)] outline-offset-1 rounded-[2px]" />

      {/* Puxa sempre a alça de DENTRO — a que aponta para o texto —, porque a
          de fora fica na borda presa e arrastá-la não teria para onde crescer.
          No fluxo normal e em `margemEsq` a de dentro é a direita, que é a de
          sempre; em `margemDir` a borda presa é a direita (ela encosta na beira
          da folha), então quem puxa é a esquerda.

          A regra da 11c continua valendo onde ela foi escrita: numa figura
          CENTRALIZADA, alça da esquerda faz o desenho fugir do ponteiro. Na
          lateral não há esse problema — a figura está ancorada numa borda, e o
          lado oposto é o único que se move. */}
      {(lateral && quebra === 'margemDir'
        ? ['left-[-6px] top-[-6px] cursor-nwse-resize', 'left-[-6px] bottom-[-6px] cursor-nesw-resize', 'left-[-6px] top-1/2 -translate-y-1/2 cursor-ew-resize']
        : ['right-[-6px] top-[-6px] cursor-nesw-resize', 'right-[-6px] bottom-[-6px] cursor-nwse-resize', 'right-[-6px] top-1/2 -translate-y-1/2 cursor-ew-resize']
      ).map((posicao) => (
        <button
          key={posicao}
          type="button"
          tabIndex={-1}
          onPointerDown={comecar}
          title="Arraste para redimensionar"
          className={`${alca} ${posicao}`}
        />
      ))}

      {/* o tamanho aparece enquanto arrasta, como na régua */}
      {arrastando ? (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10.5px] tabular-nums px-1.5 py-0.5 rounded bg-[var(--acento)] text-[var(--page)] whitespace-nowrap">
          {Math.round(caixa.larg)} × {Math.round(caixa.alt)}
        </span>
      ) : null}
    </div>
  )
}

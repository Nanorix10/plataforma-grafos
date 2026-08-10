'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'

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
}: {
  editor: Editor
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const [caixa, setCaixa] = useState<Caixa | null>(null)
  const arrasto = useRef<{ x0: number; larg0: number; alt0: number; larguraDaColuna: number } | null>(null)
  const [arrastando, setArrastando] = useState(false)

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
      const nova = Math.max(24, a.larg0 + (e.clientX - a.x0))
      /* Grava em PORCENTAGEM da coluna, não nos pixels arrastados: pixel
         amarraria a imagem à largura da folha do dia em que foi arrastada, e
         bastaria mexer na régua para ela estourar. */
      const pct = Math.round((nova / a.larguraDaColuna) * 100)
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
      larguraDaColuna: pai?.clientWidth || c.larg,
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

      {/* Só as alças da direita puxam. As da esquerda exigiriam mover a imagem
          enquanto ela cresce, e numa figura centralizada isso faz o desenho
          fugir do ponteiro — o gesto vira briga. */}
      <button
        type="button"
        tabIndex={-1}
        onPointerDown={comecar}
        title="Arraste para redimensionar"
        className={`${alca} right-[-6px] top-[-6px] cursor-nesw-resize`}
      />
      <button
        type="button"
        tabIndex={-1}
        onPointerDown={comecar}
        title="Arraste para redimensionar"
        className={`${alca} right-[-6px] bottom-[-6px] cursor-nwse-resize`}
      />
      <button
        type="button"
        tabIndex={-1}
        onPointerDown={comecar}
        title="Arraste para redimensionar"
        className={`${alca} right-[-6px] top-1/2 -translate-y-1/2 cursor-ew-resize`}
      />

      {/* o tamanho aparece enquanto arrasta, como na régua */}
      {arrastando ? (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10.5px] tabular-nums px-1.5 py-0.5 rounded bg-[var(--acento)] text-[var(--page)] whitespace-nowrap">
          {Math.round(caixa.larg)} × {Math.round(caixa.alt)}
        </span>
      ) : null}
    </div>
  )
}

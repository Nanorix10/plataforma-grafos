'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { TAMANHOS, type Tamanho } from './imagem'

/**
 * A pergunta que toda figura nova responde antes de entrar no resumo.
 *
 * **A legenda é obrigatória, e é por isso que esta tela existe** (decisão 32).
 * O campo do painel sempre esteve lá, e as 22 imagens que o autor subiu pelo
 * editor entraram TODAS sem ele: o aviso "figura sem legenda" não trava nada, e
 * depois de colar a imagem ninguém volta para descrevê-la. Sem legenda o aluno
 * não lê explicação nenhuma e o leitor de tela não tem o que dizer.
 *
 * A legenda vai para o `alt`, que a página do aluno transforma em
 * `<figcaption>` (decisão 24) — o mesmo campo "legenda" do painel.
 *
 * O envio do arquivo NÃO espera esta tela: quem a abre já disparou o upload, e
 * o autor escreve enquanto ele corre. Cancelar descarta a figura; o arquivo que
 * já subiu fica no bucket, com nome uuid e sem ninguém apontando para ele —
 * mesma regra do "Remover" do painel.
 */

export type RespostaFigura = { legenda: string; tamanho: Tamanho }

/** Menos que isto não descreve nada ("a", "fig"). */
const LEGENDA_MINIMA = 3

export default function NovaFigura({
  previa,
  aoResponder,
}: {
  /** URL local do arquivo, só para o autor ver o que está legendando. */
  previa: string
  aoResponder: (r: RespostaFigura | null) => void
}) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const [legenda, setLegenda] = useState('')
  const [tamanho, setTamanho] = useState<Tamanho>('coluna')
  const pronta = legenda.trim().length >= LEGENDA_MINIMA

  // Abre ao montar. O pai monta um diálogo novo por figura (`key`), então o
  // estado nasce limpo sem efeito nenhum zerando campo.
  useEffect(() => {
    const d = dialogo.current
    if (d && !d.open) d.showModal()
    return () => d?.close()
  }, [])

  /* **Portal para o `<body>`, e não é estética.** O editor mora DENTRO do
     `<form>` do resumo (`ResumoForm`), e este diálogo tem o próprio `<form>`.
     Formulário dentro de formulário é HTML inválido, e pior: o `submit` do
     React sobe pela árvore de componentes, então "Inserir figura" chegava ao
     `onSubmit` do resumo. No teste isso deixou o envio da imagem pendurado em
     "enviando…". O portal tira o diálogo da árvore do DOM do formulário, e o
     `stopPropagation` corta a subida pela árvore do React, que o portal
     sozinho não corta. */
  return createPortal(
    <dialog
      ref={dialogo}
      aria-labelledby="nova-figura-titulo"
      className="m-auto w-[min(520px,calc(100vw-2rem))] rounded-xl border border-[var(--line-forte)] bg-[var(--paper)] text-[var(--ink)] p-0 backdrop:bg-black/60"
      // Esc: o navegador fecha sozinho; aqui só se avisa que foi cancelado.
      onCancel={() => aoResponder(null)}
    >
      <form
        method="dialog"
        className="flex flex-col gap-4 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (pronta) aoResponder({ legenda: legenda.trim(), tamanho })
        }}
      >
        <h2 id="nova-figura-titulo" className="text-[var(--t-base)] font-semibold">
          Nova figura
        </h2>

        {/* eslint-disable-next-line @next/next/no-img-element -- URL local (blob:), não há o que otimizar */}
        <img
          src={previa}
          alt=""
          className="max-h-[180px] w-auto max-w-full self-center rounded-md border border-[var(--line-forte)] bg-[var(--raised)] object-contain"
        />

        <label className="flex flex-col gap-1.5 text-[var(--t-peq)]">
          <span className="font-medium">
            Legenda <span className="text-[var(--ink-faint)] font-normal">— obrigatória</span>
          </span>
          <textarea
            value={legenda}
            onChange={(e) => setLegenda(e.target.value)}
            rows={3}
            autoFocus
            required
            minLength={LEGENDA_MINIMA}
            placeholder="O que a figura mostra. Ex.: Prófase: o fuso já formado entre os dois centrossomos."
            className="campo text-[var(--t-base)] leading-snug resize-y"
            onKeyDown={(e) => {
              // Enter insere; Shift+Enter quebra linha, como num chat.
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                e.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <span className="text-[var(--ink-faint)]">
            Sai embaixo da figura, com o número dela, e é lida pelo leitor de tela.
          </span>
        </label>

        <fieldset className="flex flex-col gap-1.5 text-[var(--t-peq)]">
          <legend className="font-medium mb-1.5">Largura</legend>
          <div className="flex gap-2 flex-wrap">
            {TAMANHOS.map((t) => (
              <label
                key={t.id}
                title={t.dica}
                className={`cursor-pointer rounded-full border px-3 py-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--acento)] ${
                  tamanho === t.id
                    ? 'border-[var(--acento)] bg-[var(--acento)] text-[var(--paper)]'
                    : 'border-[var(--line-forte)] text-[var(--ink-dim)] hover:bg-[var(--sel)]'
                }`}
              >
                <input
                  type="radio"
                  name="tamanho"
                  value={t.id}
                  checked={tamanho === t.id}
                  onChange={() => setTamanho(t.id)}
                  className="sr-only"
                />
                {t.rotulo}
              </label>
            ))}
          </div>
          <span className="text-[var(--ink-faint)]">
            {TAMANHOS.find((t) => t.id === tamanho)?.dica}
          </span>
        </fieldset>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            className="botao"
            onClick={() => {
              dialogo.current?.close()
              aoResponder(null)
            }}
          >
            Descartar figura
          </button>
          <button type="submit" className="botao botao-primario" disabled={!pronta}>
            Inserir figura
          </button>
        </div>
      </form>
    </dialog>,
    document.body
  )
}

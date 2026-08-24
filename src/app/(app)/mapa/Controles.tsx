'use client'

/**
 * Busca e filtro por matéria, os mesmos nos dois mapas.
 *
 * O acervo passou de 38 para 186 resumos e não havia como achar nada em
 * nenhuma das visões: só dava para abrir ramo por ramo até topar com o tópico.
 *
 * **Sem atalho de teclado aqui, de propósito.** A barra lateral já captura `/`
 * no `window` (`Sidebar.tsx`) e ela é renderizada nesta página pelo layout;
 * um segundo ouvinte brigaria com o primeiro pelo mesmo toque. O aluno que
 * teclar `/` continua caindo na busca da barra, que é o que ele já aprendeu.
 */

import { useRef } from 'react'
import type { Materia } from './useExpansao'

export default function Controles({
  busca,
  setBusca,
  materias,
  materiasAtivas,
  setMateriasAtivas,
  achados,
  buscando,
}: {
  busca: string
  setBusca: (v: string) => void
  materias: Materia[]
  /** null = todas. */
  materiasAtivas: Set<string> | null
  setMateriasAtivas: (v: Set<string> | null) => void
  achados: number
  buscando: boolean
}) {
  const campoRef = useRef<HTMLInputElement>(null)

  /* Clicar numa matéria quando TODAS estão ligadas significa "só esta", e não
     "todas menos esta". É o gesto que o aluno quer em um clique — ele veio
     escolher uma matéria, não desmarcar dez. Depois disso o chip alterna
     normalmente, e desligar o último devolve o mapa inteiro em vez de deixar a
     tela vazia. */
  function alternarMateria(slug: string) {
    if (materiasAtivas === null) {
      setMateriasAtivas(new Set([slug]))
      return
    }
    const novo = new Set(materiasAtivas)
    if (novo.has(slug)) novo.delete(slug)
    else novo.add(slug)
    setMateriasAtivas(novo.size === 0 || novo.size === materias.length ? null : novo)
  }

  const todas = materiasAtivas === null

  return (
    // o wrapper não recebe clique: o mapa continua arrastável no vão entre os
    // controles, que ocupam a faixa de cima inteira
    <div className="absolute top-3 left-3 right-3 z-10 flex flex-col gap-2 pointer-events-none">
      <div className="flex items-center gap-2">
        <div className="relative pointer-events-auto">
          <input
            ref={campoRef}
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && busca) {
                // para o Escape não fechar nada por cima do mapa antes da hora
                e.stopPropagation()
                setBusca('')
              }
            }}
            placeholder="Buscar no mapa…"
            aria-label="Buscar resumo ou seção no mapa"
            className="w-52 sm:w-64 text-[12px] bg-[var(--raised)]/95 backdrop-blur border border-[var(--line-forte)] rounded-lg pl-3 pr-7 py-1.5 text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] [&::-webkit-search-cancel-button]:hidden"
          />
          {busca ? (
            <button
              type="button"
              onClick={() => {
                setBusca('')
                campoRef.current?.focus()
              }}
              aria-label="Limpar busca"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)] text-[13px] leading-none px-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] rounded"
            >
              ×
            </button>
          ) : null}
        </div>

        {/* o contador é o que diz que a busca funcionou quando o resultado está
            fora da tela — sem ele, digitar e não ver nada mudar parece defeito */}
        {buscando ? (
          <span
            role="status"
            className="pointer-events-none text-[11.5px] text-[var(--ink-dim)] bg-[var(--raised)]/90 backdrop-blur border border-[var(--line)] rounded-lg px-2 py-1"
          >
            {achados === 0 ? 'nada encontrado' : `${achados} ${achados === 1 ? 'resultado' : 'resultados'}`}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5 pointer-events-auto max-w-[min(100%,44rem)]">
        <Chip ativo={todas} cor="var(--acento)" onClick={() => setMateriasAtivas(null)}>
          Todas
        </Chip>
        {materias.map((m) => {
          const ativo = !todas && materiasAtivas.has(m.slug)
          return (
            <Chip key={m.slug} ativo={ativo} cor={m.cor} onClick={() => alternarMateria(m.slug)}>
              {m.nome}
            </Chip>
          )
        })}
      </div>
    </div>
  )
}

function Chip({
  ativo,
  cor,
  onClick,
  children,
}: {
  ativo: boolean
  cor: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      // A cor da matéria entra como borda e texto quando o chip está ligado, e
      // fica só no ponto quando desligado. Preencher o chip inteiro competiria
      // com os nós do mapa, que já são desses mesmos onze tons.
      style={ativo ? { borderColor: cor, color: cor } : undefined}
      className={`inline-flex items-center gap-1.5 text-[11px] rounded-full border px-2 py-[3px] backdrop-blur transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'bg-[var(--raised)] font-medium'
          : 'bg-[var(--raised)]/85 border-[var(--line-forte)] text-[var(--ink-dim)] hover:text-[var(--ink)]'
      }`}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: cor, opacity: ativo ? 1 : 0.5 }}
      />
      {children}
    </button>
  )
}

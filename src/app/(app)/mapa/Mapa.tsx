'use client'

/**
 * Cabeçalho do mapa e a troca entre as duas visões, SEM ir ao servidor.
 *
 * As abas eram `<Link href="/mapa?visao=…">`. Os dados das duas visões são os
 * mesmos, mas cada clique refazia a página inteira no servidor — sessão,
 * catálogo, conexões e o `corpo` de todos os resumos (509 kB), numa função em
 * `iad1` buscando num banco em `sa-east-1`. E como só o `?visao=` mudava, o
 * Next mantinha a tela antiga até a nova chegar, sem passar pelo
 * `loading.tsx`: o clique parecia não ter feito nada, e o aluno clicava de
 * novo (25 pedidos em 6 segundos nos logs de 06/10).
 *
 * Agora a visão sai da URL por `useSearchParams` e a troca é
 * `history.pushState`, que o roteador do Next acompanha sem buscar nada. O
 * modo continua na URL — favoritar e compartilhar seguem valendo, e o Voltar
 * do navegador desfaz a troca, como fazia com o link.
 */

import { useSearchParams } from 'next/navigation'
import GraphView from './GraphView'
import MindMapView from './MindMapView'
import type { Materia, No } from './useExpansao'

type Visao = 'grafo' | 'mental'
type Link = { origem: string; destino: string }

export default function Mapa({
  nos,
  links,
  materias,
}: {
  nos: No[]
  links: Link[]
  materias: Materia[]
}) {
  const params = useSearchParams()
  const visao: Visao = params.get('visao') === 'mental' ? 'mental' : 'grafo'

  function trocar(nova: Visao) {
    if (nova === visao) return
    const novos = new URLSearchParams(params.toString())
    novos.set('visao', nova)
    window.history.pushState(null, '', `?${novos.toString()}`)
  }

  const resumos = nos.filter((n) => n.tipo === 'resumo').length
  const secoes = nos.length - resumos

  return (
    <div className="h-[calc(100vh-3rem)] lg:h-screen flex flex-col">
      <div className="border-b border-[var(--line)] px-5 sm:px-10 py-3 flex items-center gap-4 shrink-0">
        <span className="text-xs text-[var(--ink-faint)]">
          <b className="text-[var(--ink)] font-medium">
            {visao === 'grafo' ? 'Mapa de conexões' : 'Mapa mental'}
          </b>{' '}
          · {resumos} resumos · {secoes} seções ·{' '}
          {visao === 'grafo'
            ? `${links.length} ligações`
            : `${new Set(nos.map((n) => n.materia)).size} matérias`}
        </span>

        {/* divide-x põe a linha entre as abas sem depender de qual está ativa */}
        <div role="tablist" className="ml-auto inline-flex divide-x divide-[var(--line-forte)] overflow-hidden rounded-lg border border-[var(--line-forte)]">
          <Aba ativo={visao === 'grafo'} onClick={() => trocar('grafo')}>
            Grafo
          </Aba>
          <Aba ativo={visao === 'mental'} onClick={() => trocar('mental')}>
            Mapa mental
          </Aba>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {visao === 'grafo' ? (
          <GraphView nos={nos} links={links} materias={materias} />
        ) : (
          <MindMapView nos={nos} materias={materias} titulo="Plataforma Grafos" />
        )}
      </div>
    </div>
  )
}

function Aba({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={ativo}
      onClick={onClick}
      className={`px-3.5 py-1.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento)]'
          : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </button>
  )
}

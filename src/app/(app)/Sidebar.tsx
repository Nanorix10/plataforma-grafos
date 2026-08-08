'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { MATERIAS } from '@/lib/materias'
import type { ResumoItem } from '@/lib/resumos'
import { alternarVisao } from './acoes'

type Grupo = { materia: string; itens: ResumoItem[] }

function Chevron({ aberto }: { aberto: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      className={`shrink-0 transition-transform ${aberto ? 'rotate-90' : ''}`}
      aria-hidden
    >
      <path d="M3 1.5 L7 5 L3 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Marcador dos itens fixos do menu. Substitui os glifos ▤ ◈ ✎, que eram
 * caracteres tipográficos — desenhavam diferente em cada sistema e não
 * significavam nada pra quem não conhece o símbolo. Um ponto que acende
 * quando o item está aberto diz a mesma coisa sem depender da fonte.
 */
function Ponto({ ativo }: { ativo: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        ativo ? 'bg-[var(--acento)]' : 'border border-[var(--ink-faint)]'
      }`}
    />
  )
}

function ItemNav({
  href,
  ativo,
  children,
}: {
  href: string
  ativo: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? 'page' : undefined}
      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento-claro)]'
          : 'text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </Link>
  )
}

export default function Sidebar({
  grupos,
  isAdmin,
  isAdminReal,
  vendoComoAluno,
  plano,
}: {
  grupos: Grupo[]
  isAdmin: boolean
  isAdminReal: boolean
  vendoComoAluno: boolean
  plano: string
}) {
  const pathname = usePathname()
  const [busca, setBusca] = useState('')
  const [fechados, setFechados] = useState<Set<string>>(new Set())

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return grupos
    return grupos
      .map((g) => ({ ...g, itens: g.itens.filter((i) => i.titulo.toLowerCase().includes(q)) }))
      .filter((g) => g.itens.length > 0)
  }, [grupos, busca])

  function alternarGrupo(materia: string) {
    setFechados((atual) => {
      const novo = new Set(atual)
      if (novo.has(materia)) novo.delete(materia)
      else novo.add(materia)
      return novo
    })
  }

  const total = grupos.reduce((n, g) => n + g.itens.length, 0)

  return (
    <aside className="w-[262px] shrink-0 h-screen sticky top-0 flex flex-col bg-[var(--panel)] border-r border-[var(--line)]">
      {/* topo */}
      <div className="px-3 pt-3.5 pb-2.5">
        <Link
          href="/resumos"
          className="marca block font-medium text-[14px] mb-3.5 px-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
        >
          Plataforma Grafos
        </Link>

        <input
          type="search"
          name="busca"
          aria-label="Buscar resumo"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar resumo…"
          className="campo text-[12.5px] !py-1.5"
        />
      </div>

      {/* navegação fixa */}
      <nav className="px-2 pb-2 flex flex-col gap-0.5">
        <ItemNav href="/resumos" ativo={pathname === '/resumos'}>
          <Ponto ativo={pathname === '/resumos'} /> Todos os resumos
        </ItemNav>
        <ItemNav href="/mapa" ativo={pathname === '/mapa'}>
          <Ponto ativo={pathname === '/mapa'} /> Mapa de conexões
        </ItemNav>
        {isAdmin ? (
          <ItemNav href="/admin/editor" ativo={pathname.startsWith('/admin')}>
            <Ponto ativo={pathname.startsWith('/admin')} /> Editor
          </ItemNav>
        ) : null}
      </nav>

      <div className="mx-3 border-t border-[var(--line)]" />

      {/* árvore de matérias */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="rotulo-secao text-[10px] px-2.5 pb-2">
          Matérias ({total})
        </div>

        {filtrados.length === 0 && (
          <p className="text-[12px] text-[var(--ink-dim)] px-2.5 py-2">
            {busca ? 'Nada encontrado.' : 'Nenhum resumo ainda.'}
          </p>
        )}

        {filtrados.map(({ materia, itens }) => {
          const info = MATERIAS[materia as keyof typeof MATERIAS]
          const aberto = !fechados.has(materia) || !!busca

          return (
            <div key={materia} className="mb-0.5">
              <button
                type="button"
                onClick={() => alternarGrupo(materia)}
                aria-expanded={aberto}
                className="w-full flex items-center gap-2 px-2.5 py-[5px] rounded-md text-[12.5px] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
              >
                <Chevron aberto={aberto} />
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: info?.cor ?? 'var(--ink-faint)' }}
                />
                <span className="truncate">{info?.nome ?? materia}</span>
                <span className="ml-auto text-[10.5px] opacity-60">{itens.length}</span>
              </button>

              {aberto && (
                <ul className="ml-[13px] border-l border-[var(--line)] pl-1.5">
                  {itens.map((r) => {
                    const href = `/resumos/${r.slug}`
                    const ativo = pathname === href
                    return (
                      <li key={r.slug}>
                        <Link
                          href={href}
                          title={r.liberado ? r.titulo : `${r.titulo} — fora do seu plano`}
                          aria-current={ativo ? 'page' : undefined}
                          className={`block px-2 py-[5px] rounded-md text-[12.5px] truncate focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
                            ativo
                              ? 'shadow-[inset_0_0_0_1px_var(--line-forte)] text-[var(--ink)]'
                              : r.liberado
                                ? 'text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
                                : 'text-[var(--ink-faint)] hover:bg-[var(--sel)]'
                          }`}
                        >
                          {/* o cadeado é decorativo: a informação já está no
                              title, então o leitor de tela não deve lê-lo */}
                          {r.liberado ? null : <span aria-hidden="true" className="mr-1">🔒</span>}
                          {r.titulo}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {/* rodapé */}
      <div className="border-t border-[var(--line)] px-3 py-2.5 flex flex-col gap-2">
        {isAdminReal ? (
          <form action={alternarVisao}>
            <button
              type="submit"
              className={`w-full text-[12px] rounded-lg px-2.5 py-1.5 border text-left flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
                vendoComoAluno
                  ? 'border-[var(--acento)] text-[var(--acento)] hover:bg-[var(--acento-fraco)]'
                  : 'border-[var(--line-forte)] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
              }`}
            >
              <span aria-hidden="true">{vendoComoAluno ? '👁' : '⚙'}</span>
              {vendoComoAluno ? 'Vendo como aluno — voltar' : 'Ver como aluno'}
            </button>
          </form>
        ) : null}

        <div className="text-[10.5px] text-[var(--ink-faint)] px-0.5">
          plano: {plano}
          {isAdmin && ' · admin'}
        </div>
      </div>
    </aside>
  )
}

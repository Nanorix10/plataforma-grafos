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
      className={`flex items-center gap-2 px-2.5 py-[7px] rounded text-[13px] ${
        ativo
          ? 'bg-[var(--sel)] text-[var(--ink)] font-medium'
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
        <Link href="/resumos" className="flex items-center gap-2 font-semibold text-[14.5px] mb-3 px-1">
          <span className="w-[22px] h-[22px] rounded-full border-[1.5px] border-[var(--stamp)] flex items-center justify-center font-mono-plex text-[9px] text-[var(--stamp)]">
            MR
          </span>
          Mestre Ronny
        </Link>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar resumo…"
          className="w-full bg-[var(--paper)] border border-[var(--line)] rounded px-2.5 py-1.5 text-[12.5px] outline-none focus:border-[var(--stamp)]"
        />
      </div>

      {/* navegação fixa */}
      <nav className="px-2 pb-2 flex flex-col gap-0.5">
        <ItemNav href="/resumos" ativo={pathname === '/resumos'}>
          <span className="w-[15px] text-center opacity-70">▤</span> Todos os resumos
        </ItemNav>
        <ItemNav href="/mapa" ativo={pathname === '/mapa'}>
          <span className="w-[15px] text-center opacity-70">◈</span> Mapa de conexões
        </ItemNav>
        {isAdmin && (
          <ItemNav href="/admin/editor" ativo={pathname.startsWith('/admin')}>
            <span className="w-[15px] text-center opacity-70">✎</span> Editor
          </ItemNav>
        )}
      </nav>

      <div className="mx-3 border-t border-[var(--line)]" />

      {/* árvore de matérias */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="font-mono-plex text-[9.5px] tracking-wide text-[var(--ink-dim)] px-2.5 pb-1.5">
          MATÉRIAS ({total})
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
                className="w-full flex items-center gap-1.5 px-2.5 py-[5px] rounded text-[12.5px] text-[var(--ink-dim)] hover:bg-[var(--sel)]"
              >
                <Chevron aberto={aberto} />
                <span
                  className="w-[7px] h-[7px] rounded-sm shrink-0"
                  style={{ background: info?.cor ?? '#999' }}
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
                          className={`block px-2 py-[5px] rounded text-[12.5px] truncate ${
                            ativo
                              ? 'bg-[var(--sel)] text-[var(--ink)] font-medium'
                              : r.liberado
                                ? 'text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
                                : 'text-[var(--ink-dim)] opacity-50 hover:bg-[var(--sel)]'
                          }`}
                        >
                          {!r.liberado && <span className="mr-1">🔒</span>}
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
        {isAdminReal && (
          <form action={alternarVisao}>
            <button
              type="submit"
              className={`w-full text-[12px] rounded px-2.5 py-1.5 border text-left flex items-center gap-2 ${
                vendoComoAluno
                  ? 'border-[var(--stamp)] text-[var(--stamp)] bg-[var(--paper)]'
                  : 'border-[var(--line)] text-[var(--ink-dim)] hover:bg-[var(--paper)]'
              }`}
            >
              <span>{vendoComoAluno ? '👁' : '⚙'}</span>
              {vendoComoAluno ? 'Vendo como aluno — voltar' : 'Ver como aluno'}
            </button>
          </form>
        )}

        <div className="text-[10.5px] font-mono-plex text-[var(--ink-dim)] px-0.5">
          plano: {plano}
          {isAdmin && ' · admin'}
        </div>
      </div>
    </aside>
  )
}

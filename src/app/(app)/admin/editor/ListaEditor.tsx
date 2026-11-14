'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { MATERIAS } from '@/lib/materias'

type Item = { slug: string; titulo: string; materia_slug: string }

/** Minúsculas e sem acento: ninguém digita "Bacterias" com acento no meio da pressa. */
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * A lista do `/admin/editor`, com busca por título e filtro por matéria.
 *
 * Eram ~250 títulos em ordem alfabética e nada mais: achar um resumo era rolar
 * ou dar a volta pela barra lateral → resumo → "Editar". O filtro roda no
 * navegador porque a lista já vem inteira (só título e matéria, sem corpo) —
 * uma ida ao servidor por tecla não compraria nada.
 *
 * A matéria é chip e não `<select>` pelo mesmo motivo do mapa e do edital: só
 * aparece matéria que TEM resumo, então nenhum chip esvazia a tela sem dizer
 * por quê.
 */
export default function ListaEditor({ resumos }: { resumos: Item[] }) {
  const [busca, setBusca] = useState('')
  const [materia, setMateria] = useState<string | null>(null)

  const materias = useMemo(
    () =>
      (Object.keys(MATERIAS) as (keyof typeof MATERIAS)[]).filter((m) =>
        resumos.some((r) => r.materia_slug === m)
      ),
    [resumos]
  )

  const visiveis = useMemo(() => {
    const q = normalizar(busca.trim())
    return resumos.filter(
      (r) =>
        (!materia || r.materia_slug === materia) && (!q || normalizar(r.titulo).includes(q))
    )
  }, [resumos, busca, materia])

  return (
    <>
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar pelo título…"
          aria-label="Buscar resumo pelo título"
          className="campo text-sm"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por matéria">
          <Chip ativo={materia === null} onClick={() => setMateria(null)}>
            Todas
          </Chip>
          {materias.map((m) => (
            <Chip key={m} ativo={materia === m} onClick={() => setMateria(m)} cor={MATERIAS[m].cor}>
              {MATERIAS[m].nome}
            </Chip>
          ))}
        </div>
        <p className="text-[12px] text-[var(--ink-faint)] m-0" aria-live="polite">
          {visiveis.length === resumos.length
            ? `${resumos.length} resumos`
            : `${visiveis.length} de ${resumos.length} resumos`}
        </p>
      </div>

      {visiveis.length > 0 ? (
        <div className="flex flex-col divide-y divide-[var(--line)] border border-[var(--line)] rounded-md">
          {visiveis.map((r) => {
            const cor = MATERIAS[r.materia_slug as keyof typeof MATERIAS]?.cor
            return (
              <Link
                key={r.slug}
                href={`/admin/editor/${r.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--panel)]"
              >
                <span
                  className="w-[10px] h-[10px] rounded-sm shrink-0"
                  style={{ background: cor ?? '#999' }}
                />
                <span className="text-sm font-medium" style={{ color: cor }}>
                  {r.titulo}
                </span>
              </Link>
            )
          })}
        </div>
      ) : resumos.length > 0 ? (
        <p className="text-[var(--ink-dim)] text-sm mt-4">Nenhum título com esse filtro.</p>
      ) : null}
    </>
  )
}

function Chip({
  ativo,
  onClick,
  cor,
  children,
}: {
  ativo: boolean
  onClick: () => void
  cor?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`text-[11.5px] rounded-full border px-3 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'border-[var(--acento)] bg-[var(--raised)]'
          : 'border-[var(--line-forte)] hover:bg-[var(--sel)]'
      }`}
      style={{ color: cor ?? (ativo ? 'var(--acento)' : 'var(--ink-dim)') }}
    >
      {children}
    </button>
  )
}

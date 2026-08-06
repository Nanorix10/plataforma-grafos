import Link from 'next/link'
import { MATERIAS } from '@/lib/materias'
import { getResumos } from '@/lib/resumos'

export default async function ResumosPage() {
  // a guarda de login e a barra lateral ficam no layout do grupo (app)
  const resumos = await getResumos()

  return (
    <div className="max-w-[900px] mx-auto px-8 py-10">
      <h1 className="text-[26px] font-semibold mb-1">Seus resumos</h1>
      <p className="text-sm text-[var(--ink-dim)] mb-8">
        {resumos.length === 0
          ? 'Nenhum resumo publicado ainda.'
          : `${resumos.filter((r) => r.liberado).length} liberados de ${resumos.length}.`}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {resumos.map((r) => {
          const materia = MATERIAS[r.materia_slug as keyof typeof MATERIAS]
          const conteudo = (
            <div
              className={`border rounded-md p-5 h-full ${
                r.liberado
                  ? 'border-[var(--line)] bg-white hover:border-[var(--ink-dim)]'
                  : 'border-dashed border-[var(--line)] bg-[var(--panel)] opacity-70'
              }`}
            >
              <div
                className="w-[22px] h-1 rounded-sm mb-3"
                style={{ background: materia?.cor ?? '#999' }}
              />
              <div className="font-semibold text-[15px] mb-1">{r.titulo}</div>
              <div className="font-mono-plex text-[11.5px] text-[var(--ink-dim)]">
                {materia?.nome} {!r.liberado && '· 🔒 fora do seu plano'}
              </div>
            </div>
          )
          return r.liberado ? (
            <Link key={r.slug} href={`/resumos/${r.slug}`}>
              {conteudo}
            </Link>
          ) : (
            <div key={r.slug}>{conteudo}</div>
          )
        })}
      </div>
    </div>
  )
}

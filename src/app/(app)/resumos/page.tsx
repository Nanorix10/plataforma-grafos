import Link from 'next/link'
import { MATERIAS } from '@/lib/materias'
import { getResumos } from '@/lib/resumos'

export default async function ResumosPage() {
  // a guarda de login e a barra lateral ficam no layout do grupo (app)
  const resumos = await getResumos()

  return (
    <div className="max-w-[900px] mx-auto px-10 py-11">
      <h1 className="text-2xl font-medium mb-1">Seus resumos</h1>
      <p className="text-[13px] text-[var(--ink-faint)] mb-7">
        {resumos.length === 0
          ? 'Nenhum resumo publicado ainda.'
          : `${resumos.filter((r) => r.liberado).length} liberados de ${resumos.length}.`}
      </p>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {resumos.map((r) => {
          const materia = MATERIAS[r.materia_slug as keyof typeof MATERIAS]
          // A matéria vira um rótulo na própria cor, no lugar do tracinho
          // colorido: diz o nome e a cor de uma vez, num elemento só.
          const conteudo = (
            <div
              className={`rounded-lg p-4 h-full flex flex-col gap-1.5 ${
                r.liberado
                  ? 'bg-[var(--raised)] hover:bg-[#2A2D3C]'
                  : 'bg-[var(--panel)] opacity-55'
              }`}
            >
              <span
                className="text-[10px] tracking-[0.1em] uppercase"
                style={{ color: materia?.cor ?? 'var(--ink-faint)' }}
              >
                {materia?.nome}
              </span>
              <span className="font-medium text-[15px] text-pretty break-words">{r.titulo}</span>
              {r.liberado ? null : (
                <span className="text-[11px] text-[var(--ink-faint)]">
                  <span aria-hidden="true">🔒 </span>
                  fora do seu plano
                </span>
              )}
            </div>
          )
          return r.liberado ? (
            <Link
              key={r.slug}
              href={`/resumos/${r.slug}`}
              className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
            >
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

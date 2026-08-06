import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { MATERIAS } from '@/lib/materias'
import { renderizarWikilinks, PLANO_PROCESSOS } from '@/lib/wikilinks'
import { getSessao } from '@/lib/sessao'

export default async function ResumoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { supabase, userId, plano, isAdmin } = await getSessao()
  if (!userId) redirect('/login')

  const { data: resumo } = await supabase
    .from('resumos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!resumo) notFound()

  const liberado = (PLANO_PROCESSOS[plano] ?? []).includes(resumo.processo_slug)

  if (!liberado) {
    return (
      <div className="max-w-[640px] mx-auto px-7 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-3">Esse resumo faz parte de outro plano</h1>
        <p className="text-[var(--ink-dim)] mb-8">
          &quot;{resumo.titulo}&quot; está disponível no Acesso Completo.
        </p>
        <Link href="/#planos" className="inline-block bg-[var(--stamp)] text-white px-6 py-3 rounded-md font-semibold text-sm">
          Ver planos
        </Link>
      </div>
    )
  }

  // todos os títulos (pra resolver os [[wikilinks]]) e os backlinks, em paralelo
  const [{ data: todosResumos }, { data: backlinksRaw }] = await Promise.all([
    supabase.from('resumos').select('slug, titulo'),
    supabase
      .from('conexoes')
      .select('origem:resumos!conexoes_origem_id_fkey(slug, titulo)')
      .eq('destino_id', resumo.id),
  ])
  const tituloParaSlug = Object.fromEntries((todosResumos ?? []).map((r) => [r.titulo, r.slug]))

  const materia = MATERIAS[resumo.materia_slug as keyof typeof MATERIAS]
  const corpoHtml = renderizarWikilinks(resumo.corpo, tituloParaSlug)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backlinks = (backlinksRaw ?? []).map((c: any) => c.origem).filter(Boolean)

  return (
    <>
      {/* barra de título da "nota", estilo Obsidian */}
      <div className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)] px-8 py-2.5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="w-[8px] h-[8px] rounded-sm shrink-0"
          style={{ background: materia?.cor ?? '#999' }}
        />
        <span className="font-mono-plex text-[11px] text-[var(--ink-dim)] truncate min-w-0">
          {materia?.nome} <span aria-hidden="true" className="opacity-40">/</span>{' '}
          <b className="text-[var(--ink)]">{resumo.titulo}</b>
        </span>
        {isAdmin ? (
          <Link
            href={`/admin/editor/${resumo.slug}`}
            className="ml-auto shrink-0 text-[11.5px] border border-[var(--line)] rounded px-2.5 py-1 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--panel)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
          >
            <span aria-hidden="true">✎</span> Editar
          </Link>
        ) : null}
      </div>

      <div className="max-w-[820px] mx-auto px-8 py-10">
      <h1 className="text-[30px] font-semibold mb-8 text-balance" style={{ color: materia?.cor }}>{resumo.titulo}</h1>

      <div
        className="conteudo-resumo"
        dangerouslySetInnerHTML={{ __html: corpoHtml }}
      />

      <div className="mt-14 pt-6 border-t border-dashed border-[var(--line)]">
        <div className="font-mono-plex text-[10.5px] text-[var(--ink-dim)] mb-3">RESUMOS RELACIONADOS</div>
        {backlinks.length === 0 ? (
          <p className="text-sm text-[var(--ink-dim)]">Nenhum outro resumo cita este ainda.</p>
        ) : (
          <ul className="space-y-1.5">
            {backlinks.map((b: { slug: string; titulo: string }) => (
              <li key={b.slug}>
                <Link href={`/resumos/${b.slug}`} className="text-sm font-semibold underline underline-offset-2">
                  {b.titulo}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </>
  )
}

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import ResumoForm from '../ResumoForm'

export default async function EditarResumoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId) redirect('/login')
  if (!isAdmin) redirect('/resumos')

  const [{ data: resumo }, { data: todos }] = await Promise.all([
    supabase
      .from('resumos')
      .select('id, slug, titulo, materia_slug, processo_slug, corpo, definicao, pai_id')
      .eq('slug', slug)
      .single(),
    // id, matéria e pai também: além do autocomplete de [[wikilinks]], esta
    // lista alimenta o seletor "está dentro de", que precisa saber a árvore
    // para não oferecer um descendente como pai.
    supabase.from('resumos').select('id, titulo, materia_slug, pai_id').order('titulo'),
  ])
  if (!resumo) notFound()

  // títulos dos outros resumos, pro autocomplete de [[wikilinks]]
  const titulos = (todos ?? []).map((r) => r.titulo).filter((t) => t !== resumo.titulo)

  return (
    <div className="max-w-[1000px] mx-auto px-8 py-8">
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-[22px] font-semibold">{resumo.titulo}</h1>
        <Link
          href={`/resumos/${resumo.slug}`}
          className="text-[12px] text-[var(--ink-dim)] underline underline-offset-2 hover:text-[var(--ink)]"
        >
          ver publicado
        </Link>
      </div>
      <ResumoForm resumo={resumo} titulos={titulos} candidatosPai={todos ?? []} />
    </div>
  )
}

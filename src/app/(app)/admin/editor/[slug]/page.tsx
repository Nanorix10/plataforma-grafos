import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { PROCESSOS } from '@/lib/processos'
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
      .select(
        'id, slug, titulo, materia_slug, processo_slug, corpo, definicao, pai_id, margem_esq, margem_dir'
      )
      .eq('slug', slug)
      .single(),
    // id, matéria e pai também: além do autocomplete de [[wikilinks]], esta
    // lista alimenta o seletor "está dentro de", que precisa saber a árvore
    // para não oferecer um descendente como pai.
    supabase.from('resumos').select('id, titulo, materia_slug, pai_id').order('titulo'),
  ])
  if (!resumo) notFound()

  /* Os tópicos do edital que este resumo pode cobrir (decisão 9i). A lista vem
     inteira e o formulário filtra pela matéria escolhida — buscar de novo a
     cada troca de <select> custaria uma ida ao servidor por clique. */
  const { data: topicos } = await supabase
    .from('edital_topicos')
    .select('id, texto, etapa, processo_slug, materia_slug, resumo_id')
    .order('processo_slug')
    .order('etapa')
    .order('ordem')

  const topicosEdital = (topicos ?? []).map((x) => ({
    id: x.id,
    texto: x.texto,
    etapa: x.etapa,
    materia_slug: x.materia_slug,
    processo_nome: PROCESSOS[x.processo_slug]?.nome ?? x.processo_slug,
    resumo_id: x.resumo_id,
  }))
  const topicosMarcados = topicosEdital.filter((x) => x.resumo_id === resumo.id).map((x) => x.id)


  // títulos dos outros resumos, pro autocomplete de [[wikilinks]]
  const titulos = (todos ?? []).map((r) => r.titulo).filter((t) => t !== resumo.titulo)

  return (
    <div className="max-w-[1000px] mx-auto px-5 sm:px-8 py-8">
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-[22px] font-semibold">{resumo.titulo}</h1>
        <Link
          href={`/resumos/${resumo.slug}`}
          className="text-[12px] text-[var(--ink-dim)] underline underline-offset-2 hover:text-[var(--ink)]"
        >
          ver publicado
        </Link>
      </div>
      <ResumoForm
        resumo={resumo}
        titulos={titulos}
        candidatosPai={todos ?? []}
        topicosEdital={topicosEdital}
        topicosMarcados={topicosMarcados}
      />
    </div>
  )
}

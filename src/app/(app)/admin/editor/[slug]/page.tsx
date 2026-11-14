import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { PROCESSOS } from '@/lib/processos'
import { getFormulasSalvas } from '@/lib/formulas'
import ResumoForm from '../ResumoForm'

export default async function EditarResumoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ salvo?: string }>
}) {
  const [{ slug }, { salvo }] = await Promise.all([params, searchParams])
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
  const [
    { data: topicos },
    formulas,
    { count: citadoPor },
    { count: cita },
    { count: eventos },
  ] = await Promise.all([
    supabase
      .from('edital_topicos')
      .select('id, texto, etapa, processo_slug, materia_slug, resumo_id')
      .order('processo_slug')
      .order('etapa')
      .order('ordem'),
    // as fórmulas guardadas do autor (decisão 8e)
    getFormulasSalvas(),
    // quantos resumos escrevem [[este título]] — o aviso de renomear (ResumoForm)
    supabase
      .from('conexoes')
      .select('origem_id', { count: 'exact', head: true })
      .eq('destino_id', resumo.id),
    // as outras duas contas servem à confirmação do "Excluir" (o que vai junto)
    supabase
      .from('conexoes')
      .select('destino_id', { count: 'exact', head: true })
      .eq('origem_id', resumo.id),
    supabase
      .from('eventos')
      .select('id', { count: 'exact', head: true })
      .eq('resumo_id', resumo.id),
  ])

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
        {/* Depois de "Salvar" a action volta para cá com `?salvo=1`, em vez
            de despejar o autor na lista inteira. */}
        {salvo ? (
          <span role="status" className="ml-auto text-[12px] text-[var(--ok)]">
            ✓ Salvo
          </span>
        ) : null}
      </div>
      <ResumoForm
        resumo={resumo}
        titulos={titulos}
        candidatosPai={todos ?? []}
        topicosEdital={topicosEdital}
        topicosMarcados={topicosMarcados}
        formulas={formulas}
        citadoPor={citadoPor ?? 0}
        vaiJunto={{
          conexoes: (citadoPor ?? 0) + (cita ?? 0),
          topicos: topicosMarcados.length,
          eventos: eventos ?? 0,
        }}
      />
    </div>
  )
}

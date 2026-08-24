import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { PROCESSOS } from '@/lib/processos'
import ResumoForm from '../ResumoForm'

export default async function NovoResumoPage() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId) redirect('/login')
  if (!isAdmin) redirect('/resumos')

  // alimenta o autocomplete de [[wikilinks]] e o seletor "está dentro de"
  const { data: todos } = await supabase
    .from('resumos')
    .select('id, titulo, materia_slug, pai_id')
    .order('titulo')
  const titulos = (todos ?? []).map((r) => r.titulo)

  // os tópicos do edital que o resumo novo pode cobrir (decisão 9i); o
  // formulário filtra pela matéria escolhida
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

  return (
    <div className="max-w-[1000px] mx-auto px-5 sm:px-8 py-8">
      <h1 className="text-[22px] font-semibold mb-6">Novo resumo</h1>
      <ResumoForm
        titulos={titulos}
        candidatosPai={todos ?? []}
        topicosEdital={topicosEdital}
      />
    </div>
  )
}

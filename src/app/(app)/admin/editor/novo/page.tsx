import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
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

  return (
    <div className="max-w-[1000px] mx-auto px-8 py-8">
      <h1 className="text-[22px] font-semibold mb-6">Novo resumo</h1>
      <ResumoForm titulos={titulos} candidatosPai={todos ?? []} />
    </div>
  )
}

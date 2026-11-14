import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import ListaEditor from './ListaEditor'

export default async function AdminEditorPage() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId) redirect('/login')
  if (!isAdmin) redirect('/resumos')

  const { data: resumos } = await supabase
    .from('resumos')
    .select('slug, titulo, materia_slug')
    .order('titulo')

  return (
    <div className="max-w-[820px] mx-auto px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[26px] font-semibold">Editor</h1>
        <Link
          href="/admin/editor/novo"
          className="botao botao-primario !rounded-lg px-4 py-2 text-sm"
        >
          + Novo resumo
        </Link>
      </div>

      <ListaEditor resumos={resumos ?? []} />

      {(resumos ?? []).length === 0 && (
        <p className="text-[var(--ink-dim)] text-sm mt-4">Nenhum resumo cadastrado ainda.</p>
      )}
    </div>
  )
}

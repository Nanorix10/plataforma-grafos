import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { getEventos } from '@/lib/eventos'
import GerenciarEventos from './GerenciarEventos'

export default async function AdminEventosPage() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId) redirect('/login')
  if (!isAdmin) redirect('/resumos')

  const [eventos, { data: resumos }] = await Promise.all([
    getEventos(),
    supabase.from('resumos').select('id, titulo, materia_slug').order('titulo'),
  ])

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-[26px] font-semibold">Eventos</h1>
        <Link
          href="/linha-do-tempo"
          className="botao botao-neutro ml-auto !rounded-lg !py-1.5 !px-3 text-[length:var(--t-peq)]"
        >
          Ver a linha do tempo
        </Link>
      </div>
      <p className="text-[13px] text-[var(--ink-faint)] mb-8 max-w-[60ch]">
        O que entra aqui aparece na linha do tempo. Um evento não precisa de
        resumo para existir — dá para marcar tudo o que você quer situar e
        escrever o texto depois.
      </p>

      <GerenciarEventos eventos={eventos} resumos={resumos ?? []} />
    </div>
  )
}

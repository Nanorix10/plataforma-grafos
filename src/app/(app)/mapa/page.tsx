import { redirect } from 'next/navigation'
import { MATERIAS } from '@/lib/materias'
import { PLANO_PROCESSOS } from '@/lib/wikilinks'
import { getSessao } from '@/lib/sessao'
import GraphView from './GraphView'

export default async function MapaPage() {
  const { supabase, userId, plano } = await getSessao()
  if (!userId) redirect('/login')

  const [{ data: resumos }, { data: conexoesRaw }] = await Promise.all([
    supabase.from('resumos').select('slug, titulo, materia_slug, processo_slug'),
    supabase
      .from('conexoes')
      .select('origem_id, destino_id, resumos!conexoes_origem_id_fkey(slug), destino:resumos!conexoes_destino_id_fkey(slug)'),
  ])

  const processosLiberados = PLANO_PROCESSOS[plano] ?? []

  const nos = (resumos ?? []).map((r) => ({
    id: r.slug,
    titulo: r.titulo,
    materia: r.materia_slug,
    cor: MATERIAS[r.materia_slug as keyof typeof MATERIAS]?.cor ?? '#999',
    liberado: processosLiberados.includes(r.processo_slug),
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links = (conexoesRaw ?? []).map((c: any) => ({
    origem: c.resumos?.slug,
    destino: c.destino?.slug,
  })).filter((l) => l.origem && l.destino)

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-[var(--line)] px-8 py-2.5 flex items-center gap-3 shrink-0">
        <span className="font-mono-plex text-[11px] text-[var(--ink-dim)]">
          <b className="text-[var(--ink)]">Mapa de conexões</b> · {nos.length} tópicos ·{' '}
          {links.length} ligações
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <GraphView nos={nos} links={links} />
      </div>
    </div>
  )
}

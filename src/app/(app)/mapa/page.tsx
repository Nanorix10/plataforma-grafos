import Link from 'next/link'
import { redirect } from 'next/navigation'
import { MATERIAS } from '@/lib/materias'
import { PLANO_PROCESSOS } from '@/lib/wikilinks'
import { getSessao } from '@/lib/sessao'
import GraphView from './GraphView'
import MindMapView from './MindMapView'

type Visao = 'grafo' | 'mental'

export default async function MapaPage({
  searchParams,
}: {
  searchParams: Promise<{ visao?: string }>
}) {
  const { visao: visaoParam } = await searchParams
  // o modo vive na URL, e não em estado local, pra que o aluno possa favoritar
  // ou compartilhar exatamente a visão que estava usando
  const visao: Visao = visaoParam === 'mental' ? 'mental' : 'grafo'

  const { supabase, userId, plano } = await getSessao()
  if (!userId) redirect('/login')

  const [{ data: resumos }, { data: conexoesRaw }] = await Promise.all([
    supabase.from('resumos').select('slug, titulo, materia_slug, processo_slug, definicao'),
    supabase
      .from('conexoes')
      .select('origem_id, destino_id, resumos!conexoes_origem_id_fkey(slug), destino:resumos!conexoes_destino_id_fkey(slug)'),
  ])

  const processosLiberados = PLANO_PROCESSOS[plano] ?? []

  const nos = (resumos ?? []).map((r) => {
    const liberado = processosLiberados.includes(r.processo_slug)
    return {
      id: r.slug,
      titulo: r.titulo,
      materia: r.materia_slug,
      cor: MATERIAS[r.materia_slug as keyof typeof MATERIAS]?.cor ?? '#999',
      liberado,
      // a definição de um tópico fora do plano não vai pro navegador: seria
      // entregar conteúdo pago pra quem não pagou
      definicao: liberado ? (r.definicao ?? '') : '',
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links = (conexoesRaw ?? []).map((c: any) => ({
    origem: c.resumos?.slug,
    destino: c.destino?.slug,
  })).filter((l) => l.origem && l.destino)

  const listaMaterias = Object.entries(MATERIAS).map(([slug, m]) => ({
    slug,
    nome: m.nome,
    cor: m.cor,
  }))

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-[var(--line)] px-8 py-2.5 flex items-center gap-4 shrink-0">
        <span className="font-mono-plex text-[11px] text-[var(--ink-dim)]">
          <b className="text-[var(--ink)]">
            {visao === 'grafo' ? 'Mapa de conexões' : 'Mapa mental'}
          </b>{' '}
          · {nos.length} tópicos ·{' '}
          {visao === 'grafo'
            ? `${links.length} ligações`
            : `${new Set(nos.map((n) => n.materia)).size} matérias`}
        </span>

        <div role="tablist" className="ml-auto flex gap-1 bg-[var(--panel)] rounded-md p-1">
          <Alternador href="/mapa?visao=grafo" ativo={visao === 'grafo'}>
            Grafo
          </Alternador>
          <Alternador href="/mapa?visao=mental" ativo={visao === 'mental'}>
            Mapa mental
          </Alternador>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {visao === 'grafo' ? (
          <GraphView nos={nos} links={links} />
        ) : (
          <MindMapView nos={nos} materias={listaMaterias} titulo="Plataforma Grafos" />
        )}
      </div>
    </div>
  )
}

function Alternador({
  href,
  ativo,
  children,
}: {
  href: string
  ativo: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={ativo}
      className={`px-3 py-1 rounded text-[12px] font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)] ${
        ativo
          ? 'bg-[var(--paper)] shadow-sm text-[var(--ink)]'
          : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </Link>
  )
}

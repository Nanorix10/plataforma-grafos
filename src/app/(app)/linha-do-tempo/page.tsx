import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { getEventos } from '@/lib/eventos'
import { lerEnquadramento } from '@/lib/tempo'
import LinhaDoTempo from './LinhaDoTempo'

export default async function LinhaDoTempoPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>
}) {
  const { userId, isAdmin } = await getSessao()
  if (!userId) redirect('/login')

  const [eventos, params] = await Promise.all([getEventos(), searchParams])
  const janelaInicial = lerEnquadramento(params)

  return (
    // mesma altura do mapa: é uma tela de trabalho, não um documento que rola
    <div className="h-[calc(100vh-3rem)] lg:h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-12 border-b border-[var(--line)]">
        <h1 className="text-[length:var(--t-base)] font-medium">Linha do tempo</h1>
        <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)] tabular-nums">
          {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
        </span>
        <span className="hidden md:inline text-[length:var(--t-mini)] text-[var(--ink-faint)] ml-2">
          arraste ou setas para andar · roda do mouse, duplo clique ou +/− para
          aproximar · Home mostra tudo
        </span>
        {isAdmin ? (
          <Link
            href="/admin/eventos"
            className="botao botao-neutro ml-auto shrink-0 !text-[length:var(--t-peq)] !py-1.5 !px-3"
          >
            Gerenciar eventos
          </Link>
        ) : null}
      </header>

      <div className="flex-1 min-h-0">
        <LinhaDoTempo eventos={eventos} janelaInicial={janelaInicial} />
      </div>
    </div>
  )
}

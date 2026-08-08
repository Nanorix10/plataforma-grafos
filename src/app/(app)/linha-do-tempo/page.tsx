import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { getEventos } from '@/lib/eventos'
import LinhaDoTempo from './LinhaDoTempo'

export default async function LinhaDoTempoPage() {
  const { userId, isAdmin } = await getSessao()
  if (!userId) redirect('/login')

  const eventos = await getEventos()

  return (
    // mesma altura do mapa: é uma tela de trabalho, não um documento que rola
    <div className="h-[calc(100vh-3rem)] lg:h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-12 border-b border-[var(--line)]">
        <h1 className="text-[15px] font-medium">Linha do tempo</h1>
        <span className="text-[11.5px] text-[var(--ink-faint)] tabular-nums">
          {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
        </span>
        <span className="hidden sm:inline text-[11.5px] text-[var(--ink-faint)] ml-2">
          arraste para andar no tempo · roda do mouse para aproximar
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
        <LinhaDoTempo eventos={eventos} />
      </div>
    </div>
  )
}

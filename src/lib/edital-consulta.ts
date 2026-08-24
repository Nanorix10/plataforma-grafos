import { getSessao } from './sessao'
import { MATERIAS } from './materias'
import { PLANO_PROCESSOS } from './planos'
import type { TopicoEdital } from './edital'

/**
 * Busca dos tópicos do edital. SÓ SERVIDOR.
 *
 * O tipo e o agrupamento moram em `lib/edital.ts`, que é puro: este arquivo
 * importa `getSessao` (e portanto `next/headers`), então componente de cliente
 * não pode encostar aqui. Mesma divisão de `lib/eventos.ts` × `lib/tempo.ts`.
 */
export async function getEdital(): Promise<TopicoEdital[]> {
  const { supabase, plano } = await getSessao()

  const { data } = await supabase
    .from('edital_topicos')
    .select('id, processo_slug, etapa, materia_slug, ordem, texto, resumo:resumos(slug, processo_slug)')
    .order('processo_slug')
    .order('etapa')
    .order('ordem')

  const liberados = PLANO_PROCESSOS[plano] ?? []

  /* A ordem das matérias é a canônica de `MATERIAS`, e não a alfabética nem a
     que o banco devolve: é a mesma sequência que a barra lateral e o mapa usam,
     e trocá-la aqui faria a mesma matéria aparecer em posições diferentes em
     duas telas do mesmo site. */
  const ordemDaMateria = Object.keys(MATERIAS)

  const linhas = (data ?? []).map((t) => {
    // O join devolve objeto quando há vínculo e null quando não há; a tipagem
    // gerada não distingue os dois, então a normalização acontece aqui e o
    // resto do app só vê `resumo_slug`. Mesmo tratamento de `getEventos`.
    const { resumo, ...resto } = t as typeof t & {
      resumo: { slug: string; processo_slug: string } | { slug: string; processo_slug: string }[] | null
    }
    const r = Array.isArray(resumo) ? resumo[0] : resumo

    return {
      ...resto,
      resumo_slug: r?.slug ?? null,
      // `liberado` olha o processo do RESUMO, não o do edital: um tópico do PAS
      // UEM pode ser coberto por um resumo `comum`, e é o processo dele que o
      // plano abre ou fecha.
      liberado: r ? liberados.includes(r.processo_slug) : false,
    } as TopicoEdital
  })

  return linhas.sort((a, b) => {
    if (a.processo_slug !== b.processo_slug) return a.processo_slug.localeCompare(b.processo_slug)
    if (a.etapa !== b.etapa) return a.etapa - b.etapa
    const ia = ordemDaMateria.indexOf(a.materia_slug)
    const ib = ordemDaMateria.indexOf(b.materia_slug)
    if (ia !== ib) return ia - ib
    return a.ordem - b.ordem
  })
}

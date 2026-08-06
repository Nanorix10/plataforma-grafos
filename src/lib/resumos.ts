import { cache } from 'react'
import { getSessao } from '@/lib/sessao'
import { MATERIAS } from '@/lib/materias'
import { PLANO_PROCESSOS } from '@/lib/wikilinks'

export type ResumoItem = {
  slug: string
  titulo: string
  materia_slug: string
  processo_slug: string
  liberado: boolean
}

// Lista usada pela barra lateral E pelas páginas. Memoizada por request pelo
// `cache()`, então a sidebar e a página não fazem a mesma consulta duas vezes.
export const getResumos = cache(async (): Promise<ResumoItem[]> => {
  const { supabase, plano } = await getSessao()
  const liberados = PLANO_PROCESSOS[plano] ?? []

  const { data } = await supabase
    .from('resumos')
    .select('slug, titulo, materia_slug, processo_slug')
    .order('titulo')

  return (data ?? []).map((r) => ({
    ...r,
    liberado: liberados.includes(r.processo_slug),
  }))
})

// Agrupa por matéria, na ordem em que as matérias estão definidas.
export function agruparPorMateria(resumos: ResumoItem[]) {
  const grupos = new Map<string, ResumoItem[]>()

  for (const slug of Object.keys(MATERIAS)) {
    const doGrupo = resumos.filter((r) => r.materia_slug === slug)
    if (doGrupo.length > 0) grupos.set(slug, doGrupo)
  }

  // matérias que não estão em MATERIAS (segurança contra dados inesperados)
  const conhecidas = new Set(Object.keys(MATERIAS))
  const orfaos = resumos.filter((r) => !conhecidas.has(r.materia_slug))
  if (orfaos.length > 0) grupos.set('outros', orfaos)

  return [...grupos.entries()].map(([materia, itens]) => ({ materia, itens }))
}

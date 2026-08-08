import { cache } from 'react'
import { getSessao } from '@/lib/sessao'
import { MATERIAS } from '@/lib/materias'
import { PLANO_PROCESSOS } from '@/lib/wikilinks'
import { montarArvore, type ResumoItem } from '@/lib/arvore'

// A montagem da árvore mora em `lib/arvore.ts`, sem nada de servidor, porque a
// barra lateral (componente de cliente) também precisa dela. Reexportado aqui
// para quem já importava daqui não ter que saber dessa divisão.
export { montarArvore, descendentes } from '@/lib/arvore'
export type { ResumoItem, NoResumo } from '@/lib/arvore'

// Lista usada pela barra lateral E pelas páginas. Memoizada por request pelo
// `cache()`, então a sidebar e a página não fazem a mesma consulta duas vezes.
export const getResumos = cache(async (): Promise<ResumoItem[]> => {
  const { supabase, plano } = await getSessao()
  const liberados = PLANO_PROCESSOS[plano] ?? []

  const { data } = await supabase
    .from('resumos')
    .select('id, slug, titulo, materia_slug, processo_slug, pai_id')
    .order('titulo')

  return (data ?? []).map((r) => ({
    ...r,
    liberado: liberados.includes(r.processo_slug),
  }))
})

// Agrupa por matéria, na ordem em que as matérias estão definidas. Dentro de
// cada matéria os resumos vêm em árvore, não em lista: a matéria é o
// guarda-chuva, e a hierarquia de assuntos começa dentro dela.
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

  return [...grupos.entries()].map(([materia, itens]) => ({
    materia,
    itens,
    arvore: montarArvore(itens),
  }))
}

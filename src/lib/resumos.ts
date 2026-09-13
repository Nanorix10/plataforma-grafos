import { cache } from 'react'
import { getSessao } from '@/lib/sessao'
import { MATERIAS } from '@/lib/materias'
import { PLANO_PROCESSOS } from '@/lib/planos'
import { montarArvore, type NoResumo, type ResumoItem } from '@/lib/arvore'

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

  /**
   * `resumos_catalogo`, e não `resumos`: desde a migration de 13/09 a tabela só
   * devolve o que o plano cobre, porque `corpo` mora nela e o acervo é pago. O
   * catálogo é a vista sem o corpo, e é ela que continua listando os 249 —
   * inclusive os bloqueados, que aparecem com cadeado e são o que prova ao
   * visitante que existe acervo.
   *
   * `liberado` continua sendo conta da aplicação: o banco agora decide quem lê
   * o TEXTO, e esta linha decide quem vê o cadeado. São perguntas diferentes.
   */
  const { data } = await supabase
    .from('resumos_catalogo')
    .select('id, slug, titulo, materia_slug, processo_slug, pai_id')
    .order('titulo')

  return (data ?? []).map((r) => ({
    ...r,
    liberado: liberados.includes(r.processo_slug),
  }))
})

/**
 * Agrupa por matéria, na ordem em que as matérias estão definidas.
 *
 * A árvore é montada **uma vez, com tudo**, e só depois as RAÍZES são
 * distribuídas entre as matérias. Montar uma árvore por matéria quebraria os
 * assuntos interdisciplinares: um tópico de Química pendurado em "Energia", de
 * Física, não acharia o pai dentro do próprio grupo e voltaria a aparecer solto
 * na raiz de Química — a hierarquia sumiria justamente onde ela é mais
 * interessante.
 *
 * Consequência: um resumo aparece **onde o autor o pendurou**, e não
 * necessariamente sob a própria matéria. `itens` segue contando todos os da
 * disciplina, que é o número que interessa no cabeçalho do grupo.
 */
export function agruparPorMateria(resumos: ResumoItem[]) {
  const raizes = montarArvore(resumos)

  const conhecidas = new Set(Object.keys(MATERIAS))
  const materiaDe = (slug: string) => (conhecidas.has(slug) ? slug : 'outros')

  const ordem = [...Object.keys(MATERIAS), 'outros']
  const grupos: { materia: string; itens: ResumoItem[]; arvore: NoResumo[] }[] = []

  for (const slug of ordem) {
    const itens = resumos.filter((r) => materiaDe(r.materia_slug) === slug)
    if (itens.length === 0) continue
    grupos.push({
      materia: slug,
      itens,
      arvore: raizes.filter((r) => materiaDe(r.materia_slug) === slug),
    })
  }

  return grupos
}

import { getSessao } from '@/lib/sessao'
import type { Grifo } from '@/lib/grifos-tipo'

/**
 * Os grifos do aluno num resumo. SÓ SERVIDOR.
 *
 * O tipo mora em `lib/grifos-tipo.ts`, que é puro: este arquivo importa
 * `getSessao` → `next/headers`, e o componente que desenha os grifos é de
 * cliente. Mesma divisão de `tempo.ts` × `eventos.ts`.
 *
 * Por que o grifo guarda o TRECHO e não a posição está no cabeçalho de
 * `supabase/migrations/..._grifos.sql`.
 */
export async function getGrifos(resumoId: string): Promise<Grifo[]> {
  const { supabase, userId } = await getSessao()
  if (!userId) return []

  const { data } = await supabase
    .from('grifos')
    .select('id, exato, prefixo, sufixo, nota')
    .eq('resumo_id', resumoId)
    .order('criado_em')

  return (data ?? []).map((g) => ({ ...g, nota: g.nota ?? '' }))
}

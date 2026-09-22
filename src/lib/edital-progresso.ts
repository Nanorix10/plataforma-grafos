import { cache } from 'react'
import { getSessao } from '@/lib/sessao'

/**
 * Os tópicos do edital que o aluno marcou como estudados. SÓ SERVIDOR.
 *
 * Devolve só os ids: a página já tem os tópicos inteiros de `getEdital()`, e o
 * cruzamento acontece em memória. Ver o cabeçalho de
 * `supabase/migrations/..._edital_progresso.sql` para o porquê de a marca ser
 * por tópico, e não por resumo.
 *
 * Sem `limit`: o teto é o edital inteiro (1114 linhas de um uuid), menos do que
 * a lista de tópicos que a mesma página carrega.
 */
export const getProgresso = cache(async (): Promise<string[]> => {
  const { supabase, userId } = await getSessao()
  if (!userId) return []

  const { data } = await supabase.from('edital_progresso').select('topico_id')

  return (data ?? []).map((l) => l.topico_id)
})

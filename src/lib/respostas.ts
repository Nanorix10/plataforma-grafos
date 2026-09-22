import { cache } from 'react'
import { getSessao } from '@/lib/sessao'

/**
 * As respostas do aluno às questões dos resumos. SÓ SERVIDOR — componente de
 * cliente importa daqui só com `import type` (decisão 8e).
 *
 * Ver o cabeçalho de `supabase/migrations/..._respostas.sql` para o porquê de
 * a questão ter id próprio e de valer só a última tentativa.
 */
export type Resposta = {
  questao_id: string
  resumo_id: string
  acertou: boolean
  /** A letra, a soma com dois dígitos, ou nulo no "acertei / errei". */
  resposta: string | null
  trecho: string
  respondido_em: string
}

/** O que o aluno respondeu nas questões deste resumo. */
export async function getRespostasDoResumo(resumoId: string): Promise<Resposta[]> {
  const { supabase, userId } = await getSessao()
  if (!userId) return []
  const { data } = await supabase
    .from('respostas')
    .select('questao_id, resumo_id, acertou, resposta, trecho, respondido_em')
    .eq('resumo_id', resumoId)
  return data ?? []
}

/**
 * As questões cujo último resultado foi erro — a aba "Para refazer" da
 * `/resumos`. As mais recentes primeiro: quem volta para refazer está
 * lembrando do que errou por último.
 *
 * `cache()` pela mesma razão do `getMarcas`: a lista pode pedir duas vezes.
 */
export const getParaRefazer = cache(async (): Promise<Resposta[]> => {
  const { supabase, userId } = await getSessao()
  if (!userId) return []
  const { data } = await supabase
    .from('respostas')
    .select('questao_id, resumo_id, acertou, resposta, trecho, respondido_em')
    .eq('acertou', false)
    .order('respondido_em', { ascending: false })
  return data ?? []
})

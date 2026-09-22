import { getSessao } from '@/lib/sessao'

/**
 * Os números da página do aluno (decisão 23). SÓ SERVIDOR.
 *
 * Grifos, respostas e edital por etapa vêm contados do banco (`meu_estudo()`),
 * porque somá-los aqui exigiria trazer centenas de linhas para devolver um
 * número. A função é `security invoker`: as policies de cada tabela valem lá
 * dentro, e o aluno só conta o que é dele.
 *
 * Resumos abertos por matéria NÃO estão aqui: saem de `getResumos()` e
 * `getMarcas()`, que a página já tem, e são a mesma conta da `/resumos`.
 */
export type EtapaDoEdital = {
  processo: string
  etapa: number
  total: number
  marcados: number
}

export type Estudo = {
  grifos: number
  grifos_com_nota: number
  resumos_grifados: number
  respondidas: number
  acertos: number
  edital: EtapaDoEdital[]
}

const VAZIO: Estudo = {
  grifos: 0,
  grifos_com_nota: 0,
  resumos_grifados: 0,
  respondidas: 0,
  acertos: 0,
  edital: [],
}

export async function getEstudo(): Promise<Estudo> {
  const { supabase, userId } = await getSessao()
  if (!userId) return VAZIO
  const { data } = await supabase.rpc('meu_estudo')
  return (data as Estudo | null) ?? VAZIO
}

/**
 * Os dias em que o aluno abriu algum resumo, do mais recente para o mais
 * antigo, como `AAAA-MM-DD`. Quatrocentos dá para mais de um ano de sequência
 * sem cortar a conta do recorde.
 *
 * Quem calcula a sequência é o navegador (`DiasSeguidos`), e não o servidor:
 * "hoje" depende do fuso do aluno, e é justamente o que o servidor não sabe.
 */
export async function getDias(): Promise<string[]> {
  const { supabase, userId } = await getSessao()
  if (!userId) return []
  const { data } = await supabase
    .from('dias_de_estudo')
    .select('dia')
    .order('dia', { ascending: false })
    .limit(400)
  return (data ?? []).map((d) => d.dia as string)
}

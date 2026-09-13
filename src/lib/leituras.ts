import { cache } from 'react'
import { getSessao } from '@/lib/sessao'

/**
 * As marcas do aluno num resumo: quando ele abriu, e se favoritou.
 *
 * Ver o cabeçalho de `supabase/migrations/..._historico_e_favoritos.sql` para
 * o porquê de serem duas marcas e de morarem na mesma linha.
 */
export type Marca = {
  resumo_id: string
  visto_em: string
  favorito: boolean
  favoritado_em: string | null
}

/**
 * Todas as marcas do aluno, de uma vez.
 *
 * **Sem `limit`, e sem junção com `resumos`.** São no máximo 249 linhas de
 * quatro colunas — menos do que a lista de resumos que a página já carrega. Em
 * troca:
 *
 * - o histórico e os favoritos saem da MESMA consulta, e não de duas;
 * - quem cruza id → título é o `getResumos()`, que já está em memória e já é
 *   memoizado por request. Uma junção no PostgREST teria de atravessar a vista
 *   `resumos_catalogo`, onde a chave estrangeira não existe (ela aponta para a
 *   tabela), e o embed é frágil justamente aí.
 *
 * `cache()` pelo mesmo motivo do `getResumos`: a lista e a barra podem pedir
 * as marcas na mesma página sem consultar duas vezes.
 */
export const getMarcas = cache(async (): Promise<Marca[]> => {
  const { supabase, userId } = await getSessao()
  if (!userId) return []

  const { data } = await supabase
    .from('leituras')
    .select('resumo_id, visto_em, favorito, favoritado_em')
    .order('visto_em', { ascending: false })

  return data ?? []
})

/**
 * Quantos resumos recentes cabem na faixa "Continuar de onde parou".
 *
 * Seis, e não vinte: a faixa existe para devolver o aluno ao ponto onde ele
 * parou, e "onde parou" são os últimos dias, não o mês. Uma lista longa aqui
 * viraria uma segunda árvore do acervo, que é exatamente o que a barra lateral
 * já é — e a `/resumos` voltaria a competir com ela e a perder.
 */
export const QUANTOS_RECENTES = 6

/**
 * "há 2 dias" — quanto tempo passou desde que o aluno abriu.
 *
 * **Só tempo decorrido, nunca "hoje" ou "ontem".** É tentador, e seria errado:
 * a página é montada no servidor, que roda em UTC, e o aluno estuda no fuso de
 * Campo Grande. Um resumo aberto às 22h de terça viraria "hoje" na madrugada
 * de quarta para quem está a três horas de distância do relógio do servidor.
 * Tempo decorrido é a mesma verdade em qualquer fuso, porque não depende de
 * onde a meia-noite cai.
 *
 * Acima de um mês vira "há 5 sem" e para por aí: passado esse ponto, o número
 * exato não muda nada para quem está procurando onde parou.
 */
export function quandoFoi(iso: string): string {
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)

  if (minutos < 2) return 'agora'
  if (minutos < 60) return `há ${minutos} min`

  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `há ${horas} h`

  const dias = Math.floor(horas / 24)
  if (dias < 7) return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`

  const semanas = Math.floor(dias / 7)
  return `há ${semanas} sem`
}

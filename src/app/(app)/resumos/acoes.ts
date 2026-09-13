'use server'

import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'

/**
 * As duas escritas de `leituras`. Nada aqui decide acesso — quem decide é a
 * policy, que consulta a de `resumos` em vez de repetir a regra de plano.
 * Chamada forjada com a chave pública bate na mesma trava.
 */

/**
 * O aluno abriu este resumo.
 *
 * **Por que uma ação, e não uma linha na página do resumo.** A página é um
 * componente de servidor, e um GET que escreve é um GET que mente: o Next pode
 * renderizar de novo por conta própria (prefetch, recarga, revalidação) e cada
 * uma dessas viradas viraria uma visita que o aluno não fez. A visita é um
 * efeito do NAVEGADOR ter aberto a página, então quem a dispara é o cliente.
 *
 * `upsert` e não `insert`: a segunda abertura do mesmo resumo atualiza a hora,
 * não cria uma linha. O histórico é "os últimos resumos", não "os últimos
 * cliques" — abrir Mitose três vezes hoje não deve empurrar os outros cinco
 * para fora da faixa.
 *
 * Só `visto_em` vai no corpo, então o `favorito` da linha existente fica
 * intocado: o PostgREST só atualiza as colunas que você manda.
 *
 * **Sem `revalidatePath`.** Toda página daqui é dinâmica (lê cookie de sessão),
 * então não há cache a invalidar — e chamar isso a cada abertura de resumo
 * seria trabalho puro. A faixa de recentes é montada na próxima vez que
 * `/resumos` for pedida, que é sempre do servidor.
 */
export async function registrarVisita(resumoId: string) {
  const { supabase, userId } = await getSessao()
  if (!userId) return

  await supabase
    .from('leituras')
    .upsert(
      { user_id: userId, resumo_id: resumoId, visto_em: new Date().toISOString() },
      { onConflict: 'user_id,resumo_id' }
    )
}

/**
 * Liga e desliga a estrela.
 *
 * `favorito` e `favoritado_em` vão sempre juntos porque o banco exige — há um
 * `check` que recusa favorito sem data. A lista de favoritos ordena por essa
 * data, e uma linha sem ela cairia no fim sem explicação.
 *
 * Aqui o `revalidatePath` VALE: a estrela muda o que `/resumos` mostra, e o
 * aluno volta para lá logo depois de favoritar. Sem isto ele veria a estrela
 * acesa no resumo e a lista sem o favorito.
 */
export async function alternarFavorito(resumoId: string, favorito: boolean) {
  const { supabase, userId } = await getSessao()
  if (!userId) return

  await supabase.from('leituras').upsert(
    {
      user_id: userId,
      resumo_id: resumoId,
      favorito,
      favoritado_em: favorito ? new Date().toISOString() : null,
    },
    { onConflict: 'user_id,resumo_id' }
  )

  revalidatePath('/resumos')
}

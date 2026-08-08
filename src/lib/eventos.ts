import { getSessao } from './sessao'
import type { Evento } from './tempo'

/**
 * Busca dos eventos da linha do tempo. SÓ SERVIDOR.
 *
 * O tipo `Evento` e as contas de data moram em `lib/tempo.ts`, que é puro:
 * este arquivo importa `getSessao` (e portanto `next/headers`), então quem for
 * componente de cliente não pode encostar aqui. Mesma divisão de
 * `lib/resumos.ts` × `lib/arvore.ts`.
 */

/**
 * Todos os eventos, em ordem cronológica.
 *
 * Sem filtro por plano: evento é só título, data e uma linha — o conteúdo
 * gateado continua sendo o resumo, e a página dele já barra quem não tem o
 * processo. Ver a migration para o raciocínio inteiro.
 */
export async function getEventos(): Promise<Evento[]> {
  const { supabase } = await getSessao()

  const { data } = await supabase
    .from('eventos')
    .select(
      'id, titulo, ano_inicio, ano_fim, rotulo_data, materia_slug, resumo_id, descricao, resumo:resumos(slug)'
    )
    .order('ano_inicio', { ascending: true })

  return (data ?? []).map((e) => {
    // O join devolve objeto quando há vínculo e null quando não há; a tipagem
    // gerada pelo supabase-js não distingue os dois, então a normalização
    // acontece aqui e o resto do app só vê `resumo_slug`.
    const { resumo, ...resto } = e as typeof e & {
      resumo: { slug: string } | { slug: string }[] | null
    }
    const ligado = Array.isArray(resumo) ? resumo[0] : resumo
    return { ...resto, resumo_slug: ligado?.slug ?? null } as Evento
  })
}

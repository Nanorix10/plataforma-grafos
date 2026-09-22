'use server'

import { getSessao } from '@/lib/sessao'

/**
 * Marca ou desmarca um tópico do edital.
 *
 * Marcar é insert, desmarcar é delete — a linha É a marca (ver a migration).
 * O `upsert` com `ignoreDuplicates` torna o duplo clique inofensivo: a segunda
 * marcação do mesmo tópico não vira erro de chave primária.
 *
 * Sem `revalidatePath`: a página lê o cookie de sessão e é dinâmica, então não
 * há cache para invalidar, e a tela já mostrou a mudança de forma otimista.
 */
export async function marcarTopico(topicoId: string, marcado: boolean) {
  const { supabase, userId } = await getSessao()
  if (!userId) return

  if (marcado) {
    await supabase
      .from('edital_progresso')
      .upsert(
        { user_id: userId, topico_id: topicoId },
        { onConflict: 'user_id,topico_id', ignoreDuplicates: true }
      )
  } else {
    await supabase
      .from('edital_progresso')
      .delete()
      .eq('user_id', userId)
      .eq('topico_id', topicoId)
  }
}

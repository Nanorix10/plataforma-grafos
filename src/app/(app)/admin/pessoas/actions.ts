'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { PLANO_PROCESSOS } from '@/lib/planos'

async function exigirAdmin() {
  const { supabase, userId, isAdminReal } = await getSessao()
  // `isAdminReal`, não `isAdmin`: o alternador "ver como aluno" é conveniência
  // de interface e não pode tirar de alguém a permissão de verdade.
  if (!userId || !isAdminReal) redirect('/resumos')
  return { supabase, userId }
}

const PLANOS_VALIDOS = new Set(Object.keys(PLANO_PROCESSOS))

/**
 * Define o plano de um aluno e se ele está ativo.
 *
 * É este o passo que hoje acontece depois do Pix cair na conta. Enquanto o
 * pagamento não for automático, alguém precisa apertar o botão — a diferença é
 * que agora esse alguém não precisa abrir o SQL Editor do Supabase.
 */
export async function definirPlano(formData: FormData) {
  const { supabase } = await exigirAdmin()

  const userId = String(formData.get('user_id') ?? '')
  const plano = String(formData.get('plano') ?? '')
  const ativo = formData.get('ativo') === 'true'

  if (!userId) throw new Error('Usuário não informado.')
  if (!PLANOS_VALIDOS.has(plano)) throw new Error(`Plano desconhecido: ${plano}`)

  const { error } = await supabase
    .from('planos_usuarios')
    .update({ plano, ativo, atualizado_em: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/pessoas')
  // o plano muda o que a pessoa enxerga: a lista e o mapa precisam refazer
  revalidatePath('/resumos')
  revalidatePath('/mapa')
}

/**
 * Dá ou tira o selo de admin.
 *
 * A policy no banco impede tirar o próprio selo — é ela que vale. A checagem
 * aqui existe para o erro chegar em português, e não como um estouro cru de RLS.
 */
export async function alternarAdmin(formData: FormData) {
  const { supabase, userId: meuId } = await exigirAdmin()

  const userId = String(formData.get('user_id') ?? '')
  const virarAdmin = formData.get('is_admin') === 'true'

  if (!userId) throw new Error('Usuário não informado.')
  if (userId === meuId && !virarAdmin) {
    throw new Error(
      'Você não pode remover o próprio acesso de admin — peça a outro admin.'
    )
  }

  const { error } = await supabase
    .from('planos_usuarios')
    .update({ is_admin: virarAdmin, atualizado_em: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/pessoas')
}

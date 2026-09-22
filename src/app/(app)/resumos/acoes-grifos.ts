'use server'

import { getSessao } from '@/lib/sessao'
import { CONTEXTO_DO_GRIFO, MAXIMO_DO_GRIFO } from '@/lib/grifos-tipo'

/**
 * As três escritas de `grifos`. Como em `acoes.ts`, nada aqui decide acesso —
 * quem decide é a policy, que consulta a de `resumos`.
 *
 * Nenhuma chama `revalidatePath`: a página do resumo lê o cookie de sessão e é
 * dinâmica, então não há cache para invalidar, e a tela já mostrou a mudança.
 *
 * As três devolvem se deu certo. Ao contrário da estrela do favorito, um grifo
 * que falhou em silêncio é uma NOTA perdida — o aluno escreveu, fechou, e ela
 * não existe. A tela precisa saber para avisar.
 */

/** Grava o grifo e devolve o id que o banco deu, ou `null` se não gravou. */
export async function criarGrifo(dados: {
  resumoId: string
  exato: string
  prefixo: string
  sufixo: string
  nota: string
}): Promise<string | null> {
  const { supabase, userId } = await getSessao()
  if (!userId) return null

  // Server action é endereço público: o recorte que a tela faz é conveniência,
  // e o de verdade é refeito aqui antes de chegar no `check` do banco.
  const exato = dados.exato.slice(0, MAXIMO_DO_GRIFO)
  if (!exato.trim()) return null

  const { data, error } = await supabase
    .from('grifos')
    .insert({
      user_id: userId,
      resumo_id: dados.resumoId,
      exato,
      prefixo: dados.prefixo.slice(-CONTEXTO_DO_GRIFO),
      sufixo: dados.sufixo.slice(0, CONTEXTO_DO_GRIFO),
      nota: dados.nota.trim().slice(0, MAXIMO_DO_GRIFO) || null,
    })
    .select('id')
    .single()

  return error ? null : data.id
}

export async function salvarNota(id: string, nota: string): Promise<boolean> {
  const { supabase, userId } = await getSessao()
  if (!userId) return false

  const { error } = await supabase
    .from('grifos')
    .update({
      nota: nota.trim().slice(0, MAXIMO_DO_GRIFO) || null,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id)

  return !error
}

export async function tirarGrifo(id: string): Promise<boolean> {
  const { supabase, userId } = await getSessao()
  if (!userId) return false

  const { error } = await supabase.from('grifos').delete().eq('id', id)
  return !error
}

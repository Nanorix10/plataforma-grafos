'use server'

import { getSessao } from '@/lib/sessao'

/**
 * Grava a última tentativa do aluno numa questão. Devolve se gravou, porque a
 * tela avisa quando não: uma resposta perdida some da lista "Para refazer" sem
 * o aluno saber por quê.
 *
 * **Quem corrige é o navegador**, e o banco aceita o `acertou` que chega. É
 * uma escolha consciente: a resposta é do aluno, sobre o estudo dele, e a
 * única pessoa que ganharia forjando "acertei" é ele mesmo, contra ele mesmo.
 * Conferir no servidor exigiria reler o `corpo` e refazer a análise da
 * questão a cada clique, por nada.
 *
 * Nada de `revalidatePath`: a página é dinâmica, e a `/resumos` relê as
 * respostas quando for aberta.
 */
export async function responder(dados: {
  resumoId: string
  questaoId: string
  acertou: boolean
  resposta: string | null
  trecho: string
}): Promise<boolean> {
  const { supabase, userId } = await getSessao()
  if (!userId) return false

  const { error } = await supabase.from('respostas').upsert(
    {
      user_id: userId,
      questao_id: dados.questaoId,
      resumo_id: dados.resumoId,
      acertou: dados.acertou,
      resposta: dados.resposta?.slice(0, 8) ?? null,
      trecho: dados.trecho.slice(0, 200),
      respondido_em: new Date().toISOString(),
    },
    { onConflict: 'user_id,questao_id' }
  )
  return !error
}

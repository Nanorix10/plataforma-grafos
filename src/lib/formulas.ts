import { getSessao } from './sessao'

/**
 * As fórmulas que o autor guardou no editor de equações. SÓ SERVIDOR.
 *
 * Este arquivo importa `getSessao` (e portanto `next/headers`), então
 * componente de cliente não pode encostar aqui — mesma divisão de
 * `lib/eventos.ts` × `lib/tempo.ts`. O TIPO abaixo é a exceção, e por isso a
 * `BarraFormula` o importa com `import type`: assim ele é apagado na
 * compilação e o módulo nunca chega ao pacote do navegador.
 */
export type FormulaSalva = {
  id: string
  nome: string
  latex: string
  em_bloco: boolean
}

/** Colunas que a tela precisa. `criado_em` não desce: ninguém o mostra. */
const CAMPOS = 'id, nome, latex, em_bloco'

/**
 * Em ordem alfabética, e não pela mais recente.
 *
 * Quem abre a aba está procurando uma fórmula de que LEMBRA o nome — a ordem
 * que serve é a que deixa achar por nome. "A última que salvei" é o caso raro,
 * e para ele existe a busca.
 *
 * Sem filtro por dono aqui: quem recorta é o RLS (`user_id = auth.uid()`).
 * Repetir o `.eq()` daria a impressão de que a segurança mora no cliente.
 */
export async function getFormulasSalvas(): Promise<FormulaSalva[]> {
  const { supabase, userId } = await getSessao()
  if (!userId) return []

  const { data } = await supabase.from('formulas_salvas').select(CAMPOS).order('nome')
  return data ?? []
}

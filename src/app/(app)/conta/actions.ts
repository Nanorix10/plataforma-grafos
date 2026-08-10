'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Sair da conta.
 *
 * Até agora o site não tinha saída: quem entrava ficava logado para sempre, e a
 * única forma de trocar de conta era apagar cookie na mão. Em computador
 * compartilhado — a lan house, o laboratório da escola, o notebook de casa que
 * dois irmãos usam — isso não é um incômodo, é o resumo de um aluno aberto para
 * outro.
 *
 * Server action, e não `supabase.auth.signOut()` no navegador, porque quem
 * precisa sumir é o COOKIE, e cookie de sessão aqui é `httpOnly`: o JavaScript
 * do navegador não o enxerga. O cliente de servidor (`lib/supabase/server.ts`)
 * escreve cookie de verdade — e é justamente numa server action que o `setAll`
 * dele funciona, ao contrário do Server Component, onde ele cai no `try/catch`
 * vazio.
 */
export async function sair() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

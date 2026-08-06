'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'
import { COOKIE_VISAO } from '@/lib/sessao'

// Alterna entre "modo admin" e "ver como aluno". É só uma preferência de
// interface — a proteção real da escrita continua nas policies de RLS.
export async function alternarVisao() {
  const { isAdminReal, vendoComoAluno } = await getSessao()
  if (!isAdminReal) return

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_VISAO, vendoComoAluno ? 'admin' : 'aluno', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  revalidatePath('/', 'layout')
}

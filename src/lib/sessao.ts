import { cache } from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const COOKIE_VISAO = 'visao'

// Identidade do usuário logado + plano, numa leitura só e memoizada por request.
//
// Por que não `auth.getUser()`: ele pergunta ao servidor do Supabase a cada
// chamada (uma ida à rede por página). `getClaims()` valida o token localmente
// quando o projeto usa chaves assimétricas, caindo pra rede só se precisar.
// O `cache()` do React garante que, se duas partes da mesma página pedirem a
// sessão, a consulta acontece uma vez só.
//
// `isAdmin` é a visão EFETIVA (o que a interface deve mostrar) e respeita o
// alternador "ver como aluno". `isAdminReal` é a permissão de verdade — use só
// pra decidir se o alternador aparece. Nada disso é segurança: quem protege a
// escrita são as policies de RLS no Postgres.
export const getSessao = cache(async () => {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub

  if (!userId) {
    return {
      supabase,
      userId: null,
      plano: 'nenhum',
      ativo: false,
      isAdmin: false,
      isAdminReal: false,
      vendoComoAluno: false,
    }
  }

  const [{ data: planoRow }, cookieStore] = await Promise.all([
    supabase
      .from('planos_usuarios')
      .select('plano, ativo, is_admin')
      .eq('user_id', userId)
      .single(),
    cookies(),
  ])

  const isAdminReal = planoRow?.is_admin === true
  const vendoComoAluno = cookieStore.get(COOKIE_VISAO)?.value === 'aluno'

  return {
    supabase,
    userId,
    plano: planoRow?.ativo ? (planoRow.plano as string) : 'nenhum',
    ativo: planoRow?.ativo === true,
    isAdmin: isAdminReal && !vendoComoAluno,
    isAdminReal,
    vendoComoAluno: isAdminReal && vendoComoAluno,
  }
})

import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Onde o link do e-mail aterrissa.
 *
 * Quem trocou o e-mail em `/conta` recebe um link, e o link precisa cair em
 * algum lugar deste site. Antes disto não havia lugar nenhum: o único e-mail
 * que o projeto mandava era o de confirmação de cadastro, e ele largava o aluno
 * na raiz — foi o item 2 da auditoria de segurança, onde o Davi clicou no link
 * e parou num muro da Vercel.
 *
 * ## Por que a rota aceita TRÊS formatos
 *
 * O Supabase manda o aluno para cá de jeitos diferentes conforme o modelo de
 * e-mail configurado no painel, e a rota não tem como saber qual está em uso.
 * Em vez de exigir uma configuração específica para funcionar, ela reconhece as
 * três:
 *
 * - **`token_hash` + `type`** — o modelo recomendado para site com renderização
 *   no servidor. Quem confere o código é `verifyOtp` AQUI, e é por isso que
 *   este é o único caminho que grava os cookies da sessão nova. Exige trocar
 *   `{{ .ConfirmationURL }}` nos modelos do painel (ver `docs/emails-do-supabase.md`).
 * - **`code`** — o fluxo PKCE, que devolve um código a trocar por sessão.
 * - **nem um nem outro** — o modelo PADRÃO do Supabase. O link vai primeiro ao
 *   `/auth/v1/verify` deles, que JÁ conferiu o código e já trocou o e-mail
 *   antes de redirecionar para cá; aqui só sobra levar o aluno até a página e
 *   dizer que deu certo. É o caso que faz a troca de e-mail funcionar sem
 *   ninguém precisar mexer no painel.
 *
 * A rota é pública de propósito: quem clica no link pode estar no celular, sem
 * sessão aberta nesse navegador. Não há o que proteger — o segredo é o código
 * do próprio link, e conferi-lo é o trabalho desta rota.
 */
export async function GET(request: NextRequest) {
  const parametros = request.nextUrl.searchParams
  const tokenHash = parametros.get('token_hash')
  const tipo = parametros.get('type') as EmailOtpType | null
  const codigo = parametros.get('code')

  /* `next` vem da URL, então é entrada de fora: sem a checagem, um link
     `?next=https://outro-site` faria o SITE redirecionar o aluno para lá com a
     credibilidade do domínio junto. Só caminho interno passa, e `//` é barrado
     porque `//outro-site` é URL absoluta para o navegador. */
  const pedido = parametros.get('next') ?? '/conta'
  const destino = pedido.startsWith('/') && !pedido.startsWith('//') ? pedido : '/conta'

  const supabase = await createClient()
  let deuErrado = false

  if (tokenHash && tipo) {
    const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash })
    deuErrado = Boolean(error)
  } else if (codigo) {
    const { error } = await supabase.auth.exchangeCodeForSession(codigo)
    deuErrado = Boolean(error)
  }

  const url = new URL(destino, request.nextUrl.origin)
  url.searchParams.set('troca', deuErrado ? 'falhou' : 'ok')
  redirect(url.pathname + url.search)
}

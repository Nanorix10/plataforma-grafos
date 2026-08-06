import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Renova a sessão do Supabase a cada navegação.
 *
 * O token de acesso vence em ~1h. Quem detecta isso e troca pelo token novo é
 * `getClaims()` → `getSession()` → `_callRefreshToken()`, dentro do auth-js.
 * Só que a renovação precisa de alguém que grave os cookies novos na resposta,
 * e um Server Component não pode escrever cookie — em `lib/supabase/server.ts`
 * o `setAll` vive dentro de um try/catch justamente por isso.
 *
 * Sem este arquivo, o token vence e ninguém persiste o substituto: o aluno que
 * deixa a aba aberta volta e cai na tela de login.
 *
 * No Next 16 este arquivo se chama `proxy.ts` — `middleware.ts` foi renomeado
 * (ver node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
 */
export async function proxy(request: NextRequest) {
  let resposta = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // grava no request pra que o render enxergue o token já renovado…
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          resposta = NextResponse.next({ request })
          // …e na resposta pra que o navegador guarde o cookie novo
          cookiesToSet.forEach(({ name, value, options }) =>
            resposta.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // É esta chamada que dispara a renovação. Não remover.
  await supabase.auth.getClaims()

  return resposta
}

export const config = {
  /**
   * Roda em tudo, menos arquivos estáticos e imagens. Sem `matcher` o proxy
   * rodaria até em `_next/static`, gastando tempo à toa em cada CSS e JS.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

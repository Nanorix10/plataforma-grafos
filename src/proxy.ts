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
   * Roda em tudo, menos:
   *
   * - arquivos estáticos e imagens — sem isso o proxy rodaria até em
   *   `_next/static`, gastando tempo à toa em cada CSS e JS;
   * - a landing (`/`) e o `/login`, que é o ponto principal aqui. As duas são
   *   páginas estáticas e PÚBLICAS: ninguém tem sessão pra renovar nelas. Com
   *   o proxy ligado, toda visita à landing virava uma execução de função —
   *   instanciar o cliente do Supabase e chamar `getClaims()` — em vez de ser
   *   servida direto do CDN. É o primeiro contato de todo aluno novo, e era
   *   justamente o mais lento.
   *
   * Quem já está logado e entra pela landing não perde nada: a renovação
   * acontece na primeira rota do app que ele abrir, que é onde a sessão
   * realmente é usada.
   */
  /* O `$` solto na alternância é o que exclui a própria raiz: nela o trecho
     depois da barra é vazio, então só um `$` casa ali. */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login$|$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

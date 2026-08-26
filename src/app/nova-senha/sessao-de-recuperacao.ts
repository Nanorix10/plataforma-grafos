/**
 * Esta sessão nasceu de um link de e-mail, ou de uma senha digitada?
 *
 * ## O buraco que isto tapa
 *
 * `/nova-senha` troca a senha SEM pedir a atual — não tem como pedir, quem
 * chega ali é justamente quem a esqueceu. Se a única exigência fosse "estar
 * logado", a tela viraria o contrário do que a decisão 9g-bis decidiu: quem
 * encontrasse a aba aberta — o notebook de irmãos, o laboratório da escola,
 * os mesmos casos que motivaram o botão de sair — abriria `/nova-senha`,
 * escolheria uma senha e ficaria com a conta. Um aluno pagante perderia o
 * acesso sem ter errado nada.
 *
 * O que separa os dois é a ORIGEM da sessão, e o próprio token diz qual foi.
 *
 * ## `amr`, e por que ele serve
 *
 * O JWT do Supabase traz `amr` — *authentication method references*, o padrão
 * RFC 8176 —, que registra por qual método a sessão foi aberta. Sessão de quem
 * digitou e-mail e senha em `/login` traz `password`; sessão aberta pelo link
 * de recuperação traz `otp`, que é como o GoTrue chama tudo que se prova pela
 * caixa de entrada. São valores diferentes, e é exatamente a distinção que a
 * tela precisa fazer.
 *
 * **Ele vem em dois formatos**, e o tipo do `@supabase/auth-js` declara os
 * dois: `['otp']` (a forma do RFC) ou `[{ method: 'otp', timestamp }]` (a
 * detalhada). Um gancho de token personalizado pode devolver qualquer um dos
 * dois. Ler só um deles daria um "link expirado" que ninguém explicaria.
 *
 * ## Falha para o lado FECHADO, de propósito
 *
 * Se um dia o `amr` sumir ou mudar de forma, esta função devolve `false` e a
 * recuperação de senha para de funcionar — o aluno vê "peça outro link" e volta
 * a depender do Ronny, que é onde ele já estava antes desta tela existir. O
 * outro lado da moeda seria deixar passar, e aí o preço não é um incômodo: é a
 * conta de alguém. Entre parar de funcionar e parar de proteger, para.
 *
 * ## Por que não vale para `/conta`
 *
 * Lá o pedágio é a senha atual, conferida num cliente avulso, e ela é uma prova
 * mais forte: prova que a pessoa SABE a senha, não só que alcança o e-mail. As
 * duas telas usam a prova que cabe em cada uma.
 */

/** Os métodos que significam "provou pela caixa de entrada". */
const POR_EMAIL = new Set(['otp', 'magiclink', 'recovery', 'email'])

export function veioDeLinkDeEmail(claims: unknown): boolean {
  if (typeof claims !== 'object' || claims === null) return false

  const amr = (claims as { amr?: unknown }).amr
  if (!Array.isArray(amr)) return false

  return amr.some((entrada) => {
    if (typeof entrada === 'string') return POR_EMAIL.has(entrada)
    if (typeof entrada === 'object' && entrada !== null) {
      const metodo = (entrada as { method?: unknown }).method
      return typeof metodo === 'string' && POR_EMAIL.has(metodo)
    }
    return false
  })
}

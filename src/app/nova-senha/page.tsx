import { createClient } from '@/lib/supabase/server'
import { CartaoAcesso, LinkAcesso } from '@/components/CartaoAcesso'
import { Forma, LinkVencido } from './Forma'
import { veioDeLinkDeEmail } from './sessao-de-recuperacao'

/**
 * Onde o link de "esqueci minha senha" aterrissa.
 *
 * ## O caminho inteiro, que passa por três arquivos
 *
 * 1. `/recuperar` chama `resetPasswordForEmail` do navegador (fluxo PKCE, com
 *    o verificador guardado em cookie).
 * 2. O aluno abre o link do e-mail, que cai em `app/auth/confirmar/route.ts` —
 *    a mesma rota que já recebia a confirmação de cadastro e a troca de e-mail.
 *    Ela troca o `code` por sessão e GRAVA os cookies, o que só funciona por
 *    ser um route handler (decisão 6).
 * 3. Ela redireciona para cá, e aqui a sessão já existe.
 *
 * ## Por que conferir no SERVIDOR
 *
 * Duas razões, e as duas importam.
 *
 * A primeira é que a conferência é de segurança: `veioDeLinkDeEmail` separa a
 * sessão que nasceu do link da que nasceu de uma senha digitada, e sem essa
 * separação a tela viraria "troque a senha de quem esqueceu a aba aberta". O
 * arquivo ao lado explica o buraco inteiro.
 *
 * A segunda é de forma: a alternativa seria um componente de cliente lendo a
 * sessão dentro de um `useEffect` e guardando o resultado num `useState` — que
 * é exatamente o `setState` dentro de efeito que o lint do React Compiler
 * recusa (é o erro que `admin/editor/AlcasImagem.tsx` ainda carrega). No
 * servidor a pergunta é respondida antes da primeira pintura, e não sobra
 * estado nenhum para dessincronizar.
 *
 * `getClaims()` e não `getUser()`, seguindo a decisão 5: o que se pergunta aqui
 * é como a sessão nasceu, e isso está gravado no próprio token — ir à rede não
 * traria resposta melhor. (`/conta` faz o contrário, e por um motivo que não
 * vale aqui: lá é preciso o e-mail conferido AGORA, que o token de até uma hora
 * atrás pode ter aposentado.)
 */
export default async function NovaSenhaPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const podeTrocar = veioDeLinkDeEmail(data?.claims)

  return (
    <CartaoAcesso
      legenda="Recuperar o acesso"
      rodape={<LinkAcesso href="/login">Voltar para entrar</LinkAcesso>}
    >
      {podeTrocar ? <Forma /> : <LinkVencido />}
    </CartaoAcesso>
  )
}

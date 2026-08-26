'use server'

import { createClient } from '@/lib/supabase/server'
import { mensagemDeErro } from '@/lib/erros-auth'
import { veioDeLinkDeEmail } from './sessao-de-recuperacao'

/**
 * O que a tela recebe de volta. Mesma forma do `EstadoTroca` de `/conta`, e
 * pela mesma razão: quem erra aqui é o aluno digitando, não o site quebrando,
 * e derrubar a página num `error.tsx` perderia o formulário e não diria o que
 * fazer a seguir.
 */
export type EstadoNovaSenha = { ok: boolean; mensagem: string } | null

function falha(mensagem: string): EstadoNovaSenha {
  return { ok: false, mensagem }
}

/**
 * Grava a senha nova de quem chegou pelo link de recuperação.
 *
 * ## Por que server action, e não `updateUser` no navegador
 *
 * Porque o passo seguinte é derrubar a sessão, e derrubar sessão aqui é mexer
 * em cookie: o cliente de servidor escreve cookie de verdade, e é justamente
 * numa server action que o `setAll` de `lib/supabase/server.ts` funciona — no
 * Server Component ele cai no `try/catch` vazio (decisão 6). É a mesma razão
 * que fez o `sair()` de `/conta` ser server action.
 *
 * ## A conferência é refeita AQUI
 *
 * A página já barra quem não veio de link de e-mail, e isso não basta: server
 * action é endereço público, responde a qualquer POST, e quem chamar direto
 * nunca passou pela página. Mesmo princípio da lista colada de eventos
 * (decisão 10c), do `ajustarMargens` (decisão 11) e das policies de RLS — a
 * interface ajuda, quem decide é a camada de baixo.
 *
 * ## Por que não pede a senha atual
 *
 * `/conta` pede, e a decisão 9g-bis explica por quê. Aqui não dá: quem chegou
 * é exatamente quem não a tem. O que faz as vezes dela é o link — só chega a
 * esta função quem provou controlar a caixa de entrada da conta, e
 * `veioDeLinkDeEmail` é o que confere isso.
 *
 * ## E por que derruba TODAS as sessões, inclusive esta
 *
 * `scope: 'global'`, ao contrário do `'others'` de `/conta`. Lá quem trocou
 * digitou a senha atual e está no aparelho dele; expulsá-lo seria prêmio por
 * ter feito a coisa certa. Aqui a sessão em uso é descartável — nasceu do
 * link, para esta tarefa —, e metade dos pedidos de senha nova vem de quem
 * desconfia que perdeu a conta. Derrubar tudo é o que fecha a porta do outro
 * lado; entrar de novo com a senha nova ainda prova, ali mesmo, que ela pegou.
 *
 * Efeito colateral que também é proteção: sem sessão, `/nova-senha` volta a
 * ser inalcançável. Se ela continuasse aberta, a aba esquecida no laboratório
 * da escola trocaria a senha de novo sem pedágio nenhum — que é o buraco que a
 * decisão 9g-bis existe para não abrir.
 */
export async function definirSenha(
  _anterior: EstadoNovaSenha,
  formData: FormData
): Promise<EstadoNovaSenha> {
  const nova = String(formData.get('senha_nova') ?? '')
  const repetida = String(formData.get('senha_nova_repetida') ?? '')

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!veioDeLinkDeEmail(data?.claims)) {
    return falha('Este link não vale mais. Peça outro em "Esqueci minha senha".')
  }

  /* O `minLength` do campo já barra isto no navegador; continua aqui porque
     este endereço responde a qualquer POST, não só ao que saiu do formulário. */
  if (nova.length < 6) return falha('A senha nova precisa ter pelo menos 6 caracteres.')

  /* A repetição é conferida antes de ir à rede: quem se enganou na digitação
     descobre na hora, sem gastar uma tentativa no limite do Supabase. */
  if (nova !== repetida) return falha('As duas senhas não são iguais.')

  const { error } = await supabase.auth.updateUser({ password: nova })
  if (error) return falha(mensagemDeErro(error, 'conta'))

  await supabase.auth.signOut({ scope: 'global' })

  return {
    ok: true,
    mensagem:
      'Senha trocada. Todas as sessões abertas foram encerradas — entre de novo com a senha nova.',
  }
}

'use server'

import { headers } from 'next/headers'
import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as criarClienteAvulso } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { mensagemDeErro } from '@/lib/erros-auth'

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

/**
 * O que as duas trocas devolvem para a tela.
 *
 * `useActionState` no lugar de `throw new Error`, que é o que as actions de
 * `/admin/pessoas` fazem. Lá quem erra é o admin mexendo na própria ferramenta,
 * e um estouro na tela de erro é resposta suficiente. Aqui quem erra é o aluno
 * digitando a senha errada — situação esperada, não falha do site —, e derrubar
 * a página inteira num `error.tsx` por causa disso perderia o formulário
 * preenchido e não diria o que fazer a seguir.
 */
export type EstadoTroca = { ok: boolean; mensagem: string } | null

function falha(mensagem: string): EstadoTroca {
  return { ok: false, mensagem }
}

/**
 * Quem está pedindo a troca, conferido no servidor do Supabase.
 *
 * `getUser()` e não o `getClaims()` da decisão 5. Aquela regra existe para a
 * navegação, onde a ida à rede se paga em toda página; aqui é uma escrita que
 * já vai à rede de qualquer jeito, e o que está em jogo é a identidade da conta
 * que vai mudar de dono. O JWT é uma cópia de até uma hora atrás — o e-mail que
 * ele carrega pode ser justamente o que uma troca anterior acabou de aposentar.
 */
async function exigirDono() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user?.email) redirect('/login')
  return { supabase, email: data.user.email }
}

/**
 * Confere a senha atual sem mexer na sessão de quem está logado.
 *
 * As duas trocas pedem a senha, e é isto que as separa de um enfeite: sem a
 * confirmação, qualquer pessoa que encontre a aba aberta — o mesmo notebook de
 * irmãos, o mesmo laboratório da escola que motivou o botão de sair — troca o
 * e-mail para o dela e fica com a conta. Um aluno pagante perderia o acesso sem
 * nunca ter errado nada.
 *
 * O cliente é AVULSO de propósito. Chamar `signInWithPassword` no cliente com
 * cookie faria o Supabase emitir uma sessão nova e o `setAll` gravaria os
 * cookies dela por cima: o aluno seria trocado de sessão só por ter digitado a
 * senha para conferir, e uma falha no passo seguinte o deixaria numa sessão que
 * ele não pediu. Com `persistSession: false` nada é gravado em lugar nenhum, e
 * a conferência é o que promete ser — uma pergunta de sim ou não.
 *
 * (A sessão que o Supabase abre do lado dele nessa conferência é descartada
 * aqui e vence sozinha em ~1h. Ninguém recebe o token: ele nasce e morre dentro
 * desta função.)
 *
 * Devolve `null` quando a senha confere, ou a frase a mostrar quando não.
 */
async function conferirSenha(email: string, senha: string): Promise<string | null> {
  if (!senha) return 'Digite sua senha atual para confirmar.'

  const avulso = criarClienteAvulso(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  )

  const { error } = await avulso.auth.signInWithPassword({ email, password: senha })
  if (!error) return null

  /* Senha errada é o caso comum e ganha frase própria: a de `invalid_credentials`
     fala em "e-mail ou senha", e aqui o e-mail não está em jogo — quem digitou
     só pode ter errado a senha. O resto (limite de tentativas, servidor fora)
     passa pelo tradutor, senão um 429 viraria "senha incorreta" e o aluno
     tentaria de novo achando que tinha errado. */
  if (error.code === 'invalid_credentials') return 'Senha incorreta.'
  return mensagemDeErro(error, 'conta')
}

/**
 * O endereço público deste site, para onde o link do e-mail volta.
 *
 * Lido do pedido, não de uma variável de ambiente. O site responde por vários
 * domínios (`plataforma-grafos.vercel.app`, o de pré-visualização de cada
 * deploy, `localhost` no desenvolvimento), e uma constante mandaria o aluno
 * para o domínio errado a partir de todos menos um. O cabeçalho diz por onde
 * ele ENTROU, que é para onde ele espera voltar.
 *
 * O Supabase ainda tem a palavra final: o `redirect_to` precisa casar com a
 * Site URL ou com a lista de Redirect URLs do painel, e o que não casar cai na
 * Site URL. Domínio novo pede uma linha nova lá.
 */
async function origemDoSite() {
  const cabecalhos = await headers()
  const origem = cabecalhos.get('origin')
  if (origem) return origem

  const host = cabecalhos.get('x-forwarded-host') ?? cabecalhos.get('host')
  const protocolo = cabecalhos.get('x-forwarded-proto') ?? 'https'
  return `${protocolo}://${host}`
}

/**
 * Troca o e-mail da conta.
 *
 * O e-mail NÃO muda aqui: `updateUser` só abre a troca e dispara o link de
 * confirmação. Enquanto o link não é aberto, a conta segue a mesma e o aluno
 * segue entrando com o endereço antigo — é por isso que a tela fala em
 * "confirmação pendente" em vez de dizer que deu certo.
 *
 * Isso é de propósito, e é o que impede um erro de digitação de virar perda de
 * conta: quem escrever `gmial.com` nunca recebe o link, a troca simplesmente
 * não acontece, e o endereço de sempre continua valendo. Se o e-mail mudasse na
 * hora, esse mesmo deslize trancaria a pessoa para fora de um jeito que só o
 * SQL Editor desfaria.
 *
 * Com "Secure email change" ligado no painel (o padrão), o Supabase manda o
 * link para os DOIS endereços e cobra os dois cliques — assim ninguém perde a
 * conta sem que um aviso chegue ao endereço antigo.
 */
export async function trocarEmail(
  _anterior: EstadoTroca,
  formData: FormData
): Promise<EstadoTroca> {
  const { supabase, email: emailAtual } = await exigirDono()

  const novo = String(formData.get('email_novo') ?? '')
    .trim()
    .toLowerCase()
  const senha = String(formData.get('senha_atual') ?? '')

  if (!novo) return falha('Escreva o e-mail novo.')
  if (novo === emailAtual.toLowerCase()) return falha('Esse já é o e-mail da sua conta.')

  const senhaErrada = await conferirSenha(emailAtual, senha)
  if (senhaErrada) return falha(senhaErrada)

  const { error } = await supabase.auth.updateUser(
    { email: novo },
    { emailRedirectTo: `${await origemDoSite()}/auth/confirmar?next=/conta` }
  )
  if (error) return falha(mensagemDeErro(error, 'conta'))

  // a página precisa repintar para mostrar a troca pendente
  refresh()

  return {
    ok: true,
    mensagem:
      `Enviamos um link de confirmação para ${novo}. Abra o link para concluir — ` +
      `até lá, você continua entrando com ${emailAtual}. Por segurança, um aviso ` +
      `também vai para o endereço antigo.`,
  }
}

/**
 * Troca a senha da conta.
 *
 * Diferente do e-mail, esta troca vale na hora: não há endereço novo a
 * confirmar, e quem pediu acabou de provar que é o dono ao digitar a senha
 * atual.
 */
export async function trocarSenha(
  _anterior: EstadoTroca,
  formData: FormData
): Promise<EstadoTroca> {
  const { supabase, email } = await exigirDono()

  const atual = String(formData.get('senha_atual') ?? '')
  const nova = String(formData.get('senha_nova') ?? '')
  const repetida = String(formData.get('senha_nova_repetida') ?? '')

  /* O `minLength` do campo já barra isto no navegador, e a checagem continua
     aqui porque server action é endereço público: ela responde a qualquer POST,
     não só ao que saiu do formulário. */
  if (nova.length < 6) return falha('A senha nova precisa ter pelo menos 6 caracteres.')

  /* A repetição é conferida ANTES da senha atual. Assim quem se enganou na
     digitação descobre na hora, sem gastar uma tentativa de login no limite de
     requisições do Supabase. */
  if (nova !== repetida) return falha('As duas senhas novas não são iguais.')
  if (nova === atual) return falha('A senha nova precisa ser diferente da atual.')

  const senhaErrada = await conferirSenha(email, atual)
  if (senhaErrada) return falha(senhaErrada)

  const { error } = await supabase.auth.updateUser({ password: nova })
  if (error) return falha(mensagemDeErro(error, 'conta'))

  /* Trocar a senha derruba as OUTRAS sessões, e essa é metade do motivo de
     alguém trocar: quem desconfia que a conta vazou não quer só uma senha nova,
     quer o outro fora. Sem isto, a sessão aberta no aparelho alheio continuaria
     valendo — o cookie já foi emitido e não deixa de valer porque a senha mudou.
     `scope: 'others'` e não o padrão: o padrão é 'global' e derrubaria também
     quem está trocando a senha, que seria expulso do site como prêmio por ter
     feito a coisa certa. */
  await supabase.auth.signOut({ scope: 'others' })

  return {
    ok: true,
    mensagem:
      'Senha trocada. As sessões abertas em outros aparelhos foram encerradas — ' +
      'neste aqui você continua conectado.',
  }
}

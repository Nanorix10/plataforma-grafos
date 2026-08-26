'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mensagemDeErro } from '@/lib/erros-auth'
import { CartaoAcesso, LinkAcesso } from '@/components/CartaoAcesso'

/**
 * "Esqueci minha senha" — o pedido do link.
 *
 * ## Por que esta tela precisou existir
 *
 * Era a última peça de suporte manual desta área, e o `docs/emails-do-supabase.md`
 * já a nomeava: quem esquecia a senha dependia do Ronny mexer no SQL Editor. O
 * público é adolescente e a senha se esquece — este é o pedido de socorro que o
 * produto criava sozinho, do mesmo jeito que a troca de e-mail criava antes da
 * decisão 9g-bis.
 *
 * ## Por que uma rota, e não uma terceira aba em `/login`
 *
 * A cápsula de lá é "entrar OU criar conta", duas portas para o mesmo lugar.
 * Recuperar senha não é uma terceira porta: é um desvio, com um fim próprio
 * (o e-mail sai) e um retorno. Enfiá-la na cápsula faria o leitor de tela
 * anunciar "aba 3 de 3" para um caminho que não é irmão dos outros dois.
 *
 * Rota própria ainda dá o que estado não daria: endereço para colar, botão de
 * voltar do navegador funcionando, e a possibilidade de mandar o link para um
 * aluno por mensagem.
 *
 * ## O envio parte do NAVEGADOR, e isso não é descuido
 *
 * `resetPasswordForEmail` daqui e não de uma server action porque o cliente de
 * navegador (`@supabase/ssr`) usa o fluxo PKCE: ele guarda um verificador em
 * cookie e o link do e-mail volta com um `code` que só casa com esse
 * verificador. Quem troca o código por sessão é `app/auth/confirmar/route.ts`,
 * do lado do servidor — e ele consegue porque o verificador está em cookie, e
 * não no localStorage. É o mesmo caminho que `/login` já usa para entrar.
 *
 * O `origin` sai do navegador pela mesma razão que `origemDoSite()` existe em
 * `conta/actions.ts`: o site responde por vários domínios (produção,
 * pré-visualização de cada deploy, `localhost`), e uma constante mandaria o
 * aluno para o domínio errado a partir de todos menos um.
 *
 * > O Supabase tem a palavra final: o `redirect_to` precisa casar com a Site
 * > URL ou com a lista de Redirect URLs do painel. Domínio novo pede uma linha
 * > nova lá — ver `docs/emails-do-supabase.md`.
 *
 * ## A resposta é a mesma exista a conta ou não
 *
 * De propósito, e não é teatro: `resetPasswordForEmail` não devolve erro para
 * e-mail desconhecido, então "enviamos, se houver conta" é literalmente o que o
 * site sabe. Dizer "essa conta não existe" transformaria a tela num verificador
 * de quem é aluno daqui — e ainda mandaria de volta para o cadastro quem só
 * digitou o endereço errado.
 */
export default function RecuperarPage() {
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const supabase = createClient()

  /* Campo não controlado, pela mesma razão de `/login`: o cofre de senhas do
     celular preenche o e-mail escrevendo direto no DOM, sem passar pelo
     `onChange` do React. O `<input>` é a única cópia do valor. */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim()

    setErro(null)
    setCarregando(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirmar?next=/nova-senha`,
    })

    setCarregando(false)

    if (error) {
      setErro(mensagemDeErro(error))
      return
    }
    setEnviadoPara(email)
  }

  if (enviadoPara) {
    return (
      <CartaoAcesso
        legenda="Recuperar o acesso"
        rodape={<LinkAcesso href="/login">Voltar para entrar</LinkAcesso>}
      >
        {/* `role="status"` porque o cartão inteiro TROCA depois de uma ida à
            rede: sem ele, quem usa leitor de tela apertaria "Enviar link" e
            não seria avisado de nada — o foco continua num botão que já não
            está na tela. */}
        <div role="status">
          <h1 className="text-[var(--t-grande)] font-semibold text-[var(--ink)]">
            Confira seu e-mail
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
            Se existe conta em <strong className="text-[var(--ink)]">{enviadoPara}</strong>, o
            link para criar uma senha nova já saiu. Ele vale por pouco tempo — abra assim que
            chegar.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
            Não chegou em alguns minutos? Olhe no spam e confira se o endereço está certo.
          </p>

          <button
            type="button"
            onClick={() => setEnviadoPara(null)}
            className="botao botao-neutro mt-5 w-full py-2.5 !rounded-lg text-sm font-medium"
          >
            Usar outro e-mail
          </button>
        </div>
      </CartaoAcesso>
    )
  }

  return (
    <CartaoAcesso
      legenda="Recuperar o acesso"
      rodape={
        <>
          Lembrou? <LinkAcesso href="/login">Voltar para entrar</LinkAcesso>
        </>
      }
    >
      <h1 className="text-[var(--t-grande)] font-semibold text-[var(--ink)]">
        Esqueci minha senha
      </h1>
      <p className="mt-2 mb-5 text-sm leading-relaxed text-[var(--ink-dim)]">
        Escreva o e-mail da sua conta. Mandamos um link para você escolher uma senha nova.
      </p>

      {/* `method="post"` pelo mesmo motivo de `/login`: se o React não hidratar,
          o navegador envia o formulário sozinho, e sem isto o padrão é GET —
          o e-mail iria parar na barra de endereço e no histórico. */}
      <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-xs text-[var(--ink-soft)] mb-1.5">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            autoCapitalize="none"
            required
            className="campo text-sm"
            placeholder="voce@email.com"
          />
        </div>

        <p role="status" aria-live="polite" className="text-sm text-[var(--erro)] empty:hidden">
          {erro}
        </p>

        <button
          type="submit"
          disabled={carregando}
          className="botao botao-primario mt-1.5 w-full py-2.5 !rounded-lg text-sm font-medium"
        >
          {carregando ? 'Enviando…' : 'Enviar link'}
        </button>
      </form>
    </CartaoAcesso>
  )
}

'use client'

import { useActionState } from 'react'
import BotaoEnviar from '@/components/BotaoEnviar'
import { CampoSenha } from '@/components/CampoSenha'
import { LinkAcesso } from '@/components/CartaoAcesso'
import { definirSenha, type EstadoNovaSenha } from './actions'

/**
 * Os dois campos da senha nova.
 *
 * Componente de cliente porque `useActionState` e `useFormStatus` são hooks; a
 * página em volta continua sendo de servidor, que é quem confere a sessão antes
 * de desenhar qualquer coisa.
 *
 * **Depois do sucesso o formulário SOME.** A ação derruba a sessão (inclusive
 * esta), então deixar os campos na tela ofereceria um botão que só pode falhar.
 * O que fica no lugar é a saída: entrar com a senha que acabou de ser criada.
 */
export function Forma() {
  const [estado, acao] = useActionState<EstadoNovaSenha, FormData>(definirSenha, null)

  if (estado?.ok) {
    return (
      /* `role="status"` porque o cartão inteiro troca depois de uma ida à rede:
         sem ele, quem usa leitor de tela apertaria "Salvar senha" e não seria
         avisado de nada — o foco fica num botão que já saiu da tela. */
      <div role="status">
        <h1 className="text-[var(--t-grande)] font-semibold text-[var(--ink)]">Senha trocada</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">{estado.mensagem}</p>
        {/* `<a>` e não `<Link>`, de propósito: a ação acabou de derrubar a
            sessão, e o cache do roteador do Next ainda guarda páginas
            renderizadas para ela. Navegação de cliente entregaria uma delas —
            a tela de um aluno que já não está logado. Recarga de verdade joga
            o cache fora junto com a sessão. */}
        <a
          href="/login"
          className="botao botao-primario mt-5 w-full py-2.5 !rounded-lg text-sm font-medium"
        >
          Entrar
        </a>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-[var(--t-grande)] font-semibold text-[var(--ink)]">Escolha a senha nova</h1>
      <p className="mt-2 mb-5 text-sm leading-relaxed text-[var(--ink-dim)]">
        Depois de salvar, você entra de novo com ela.
      </p>

      <form action={acao} className="flex flex-col gap-4">
        <CampoSenha
          id="senha-nova"
          nome="senha_nova"
          rotulo="Senha nova"
          autoComplete="new-password"
          placeholder="mínimo 6 caracteres"
        />
        <CampoSenha
          id="senha-nova-repetida"
          nome="senha_nova_repetida"
          rotulo="Repita a senha nova"
          autoComplete="new-password"
        />

        <p
          role="status"
          aria-live="polite"
          className="text-sm text-[var(--erro)] empty:hidden"
        >
          {estado && !estado.ok ? estado.mensagem : null}
        </p>

        {/* `BotaoEnviar` e não um `<button>` comum: a escrita é server action e
            a espera acontece do outro lado do mundo (decisão 9f). Ele também
            desliga o botão durante o envio, e dois envios em voo aqui trocariam
            a senha duas vezes. */}
        <BotaoEnviar
          carregando="Salvando…"
          className="botao botao-primario mt-1.5 w-full py-2.5 !rounded-lg text-sm font-medium"
        >
          Salvar senha
        </BotaoEnviar>
      </form>
    </>
  )
}

/**
 * O que a tela mostra quando o link não vale mais.
 *
 * Link de recuperação vence, e vence rápido — é assim que ele protege. Então
 * este estado é normal, não é falha, e a frase não pode acusar o aluno nem
 * mandá-lo "tentar de novo" sem dizer de onde. A saída é o pedido de um link
 * novo, que é a única coisa que resolve.
 */
export function LinkVencido() {
  return (
    <>
      <h1 className="text-[var(--t-grande)] font-semibold text-[var(--ink)]">
        Este link não vale mais
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
        Links de senha vencem depois de um tempo, e cada um serve uma vez só. Peça outro — leva
        um minuto.
      </p>
      <p className="mt-4 text-sm text-[var(--ink-dim)]">
        <LinkAcesso href="/recuperar">Pedir um link novo</LinkAcesso>
      </p>
    </>
  )
}

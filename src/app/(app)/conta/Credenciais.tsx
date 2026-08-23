'use client'

import { useActionState, useId, useRef, useState } from 'react'
import BotaoEnviar from '@/components/BotaoEnviar'
import { trocarEmail, trocarSenha, type EstadoTroca } from './actions'

/**
 * As duas trocas de `/conta`: e-mail e senha.
 *
 * ## Por que os campos são NÃO CONTROLADOS
 *
 * Mesma razão da tela de `/login`, e a mesma armadilha: quem preenche por fora
 * — autofill do Chrome, cofre do Android, 1Password — escreve o `value` do DOM
 * sem passar pelo `onChange` do React. Com `useState`, a tela mostraria os
 * campos cheios e o envio mandaria strings vazias. Aqui isso é pior do que no
 * login, porque o cofre é justamente de onde sai a senha ATUAL que estas duas
 * trocas exigem: um formulário controlado recusaria a senha certa dizendo que
 * está errada. O `<input>` é a única cópia do valor, e o `FormData` da server
 * action lê dele.
 *
 * ## Por que uma gaveta e não os campos à mostra
 *
 * São cinco campos de senha entre as duas trocas, num lugar onde o aluno entra
 * para conferir o plano dele. Abertos, empurrariam para baixo tudo o que a
 * página existe para mostrar e sugeririam uma pendência que não existe. A
 * gaveta é o padrão de `aria-expanded` + `aria-controls`, escrito à mão como o
 * resto do site — `<details>` não serve porque o conteúdo precisa reagir ao
 * resultado da action.
 */

/** Um cartão com título, explicação e a gaveta do formulário. */
function Troca({
  titulo,
  descricao,
  rotuloAbrir,
  rotuloEnviar,
  enviando: textoEnviando,
  acao,
  children,
}: {
  titulo: string
  descricao: string
  rotuloAbrir: string
  rotuloEnviar: string
  enviando: string
  acao: (anterior: EstadoTroca, formData: FormData) => Promise<EstadoTroca>
  children: React.ReactNode
}) {
  const [aberto, setAberto] = useState(false)
  const formulario = useRef<HTMLFormElement>(null)
  const painel = useId()

  /* Fecha a gaveta e limpa os campos quando deu certo.
     Embrulhar a action em vez de observar o resultado num `useEffect`: o
     `setState` dentro de efeito é o que o lint recusa (e com razão), e aqui não
     há nada para sincronizar — o momento de fechar é o retorno da chamada, que
     esta função já tem na mão. O `reset()` importa: sem ele, a senha digitada
     fica no DOM até a próxima navegação. */
  const [estado, enviar, enviandoAgora] = useActionState(
    async (anterior: EstadoTroca, formData: FormData) => {
      const resultado = await acao(anterior, formData)
      if (resultado?.ok) {
        formulario.current?.reset()
        setAberto(false)
      }
      return resultado
    },
    null
  )

  return (
    <section className="bg-[var(--raised)] rounded-lg p-5 mb-4">
      <div className="rotulo mb-1">{titulo}</div>
      <p className="text-[12.5px] text-[var(--ink-dim)] mb-3.5">{descricao}</p>

      {/* A resposta vive FORA da gaveta, senão ela sumiria junto no sucesso —
          que é exatamente quando o aluno mais precisa lê-la (o aviso da troca
          de e-mail diz que falta abrir o link). `aria-live` porque o texto
          aparece depois da resposta da rede, e sem isso o leitor de tela não
          anunciaria nada. */}
      <p
        role="status"
        aria-live="polite"
        className={`text-[12.5px] mb-3.5 empty:hidden ${
          estado?.ok ? 'text-[var(--ok)]' : 'text-[var(--erro)]'
        }`}
      >
        {estado?.mensagem}
      </p>

      {/* Um botão só, que abre e fecha. A alternativa — botão "Trocar" fora e
          "Cancelar" dentro — deixaria o `aria-controls` do primeiro apontando
          para um id que não existe enquanto a gaveta está fechada, e o leitor
          de tela anunciaria um controle sem alvo. */}
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={painel}
        disabled={enviandoAgora}
        onClick={() => setAberto((estava) => !estava)}
        className="botao botao-neutro !rounded-lg px-4 py-2 text-[13px] disabled:opacity-60"
      >
        {aberto ? 'Cancelar' : rotuloAbrir}
      </button>

      {/* O formulário fica MONTADO e escondido, em vez de sair da árvore: é o
          que mantém o alvo do `aria-controls` de pé, e é o que deixa o cofre de
          senhas achar os campos para preencher — ele varre a página quando ela
          carrega, não quando alguém clica. */}
      <form
        id={painel}
        ref={formulario}
        hidden={!aberto}
        action={enviar}
        /* `method="post"` pela mesma razão do `/login`: se o React não hidratar,
           o navegador envia o formulário do jeito dele, e sem isto o padrão é
           GET — a senha iria parar na barra de endereço, no histórico e no
           cabeçalho `Referer`. */
        method="post"
        className="flex flex-col gap-3.5 mt-4"
      >
        {children}
        <div className="mt-1">
          <BotaoEnviar
            carregando={textoEnviando}
            className="botao botao-primario !rounded-lg px-4 py-2 text-[13px]"
          >
            {rotuloEnviar}
          </BotaoEnviar>
        </div>
      </form>
    </section>
  )
}

/** Um campo de texto com rótulo, no formato dos campos do site. */
function Campo({
  id,
  nome,
  rotulo,
  tipo = 'text',
  autoComplete,
  placeholder,
  minLength,
  ajuda,
}: {
  id: string
  nome: string
  rotulo: string
  tipo?: string
  autoComplete: string
  placeholder?: string
  minLength?: number
  ajuda?: string
}) {
  const idAjuda = `${id}-ajuda`
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-[var(--ink-soft)] mb-1.5">
        {rotulo}
      </label>
      <input
        id={id}
        name={nome}
        type={tipo}
        inputMode={tipo === 'email' ? 'email' : undefined}
        autoComplete={autoComplete}
        spellCheck={false}
        autoCapitalize="none"
        required
        minLength={minLength}
        aria-describedby={ajuda ? idAjuda : undefined}
        placeholder={placeholder}
        className="campo text-sm"
      />
      {ajuda ? (
        <p id={idAjuda} className="text-[11.5px] text-[var(--ink-faint)] mt-1.5">
          {ajuda}
        </p>
      ) : null}
    </div>
  )
}

export function TrocarEmail({ emailAtual }: { emailAtual: string }) {
  return (
    <Troca
      titulo="Trocar de e-mail"
      descricao={
        `A troca não vale na hora: mandamos um link para o endereço novo e ela só ` +
        `acontece quando você abrir esse link. Assim, um erro de digitação não ` +
        `tranca você fora da conta — ${emailAtual} continua valendo até lá.`
      }
      rotuloAbrir="Trocar e-mail"
      rotuloEnviar="Enviar link de confirmação"
      enviando="Enviando…"
      acao={trocarEmail}
    >
      <Campo
        id="email-novo"
        nome="email_novo"
        rotulo="E-mail novo"
        tipo="email"
        autoComplete="email"
        placeholder="voce@email.com"
      />
      <Campo
        id="email-senha"
        nome="senha_atual"
        rotulo="Sua senha"
        tipo="password"
        autoComplete="current-password"
        ajuda="Pedimos a senha para ninguém trocar o seu e-mail numa aba que você deixou aberta."
      />
    </Troca>
  )
}

export function TrocarSenha() {
  return (
    <Troca
      titulo="Trocar de senha"
      descricao="Vale na hora. As sessões abertas em outros aparelhos são encerradas."
      rotuloAbrir="Trocar senha"
      rotuloEnviar="Trocar senha"
      enviando="Trocando…"
      acao={trocarSenha}
    >
      <Campo
        id="senha-atual"
        nome="senha_atual"
        rotulo="Senha atual"
        tipo="password"
        autoComplete="current-password"
      />
      <Campo
        id="senha-nova"
        nome="senha_nova"
        rotulo="Senha nova"
        tipo="password"
        /* 'new-password' nos dois campos de baixo: é o que faz o cofre oferecer
           uma senha forte e, depois, guardar a nova no lugar da antiga. */
        autoComplete="new-password"
        minLength={6}
        placeholder="mínimo 6 caracteres"
      />
      <Campo
        id="senha-nova-repetida"
        nome="senha_nova_repetida"
        rotulo="Repita a senha nova"
        tipo="password"
        autoComplete="new-password"
        minLength={6}
        ajuda="Como a senha fica escondida enquanto você digita, a repetição é o que pega o erro antes que ele vire perda de acesso."
      />
    </Troca>
  )
}

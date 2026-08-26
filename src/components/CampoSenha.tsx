'use client'

import { useState } from 'react'

/**
 * O campo de senha, com o olho que mostra o que foi digitado.
 *
 * ## Por que o olho existe
 *
 * Senha é o único campo do site que o aluno preenche sem ver, e é o campo em
 * que errar custa mais: uma letra trocada vira "E-mail ou senha incorretos" —
 * frase que acusa as duas coisas e não diz qual delas. No celular, que é metade
 * do uso, o teclado ainda troca maiúscula sozinho no primeiro caractere.
 *
 * ## O que ele NÃO pode quebrar
 *
 * **O campo continua não controlado.** A página de acesso já tinha decidido
 * isso: quem preenche por fora — autofill do Chrome, cofre do Android,
 * 1Password — escreve o `value` do DOM sem passar pelo `onChange` do React, e
 * um campo controlado ficava com o estado vazio enquanto a tela mostrava a
 * senha preenchida. Trocar o `type` não encosta no valor: o React só remonta o
 * atributo, e o `value` do DOM é a única cópia que existe.
 *
 * **`autoComplete` é obrigatório e vem de fora.** `current-password` ao entrar
 * e `new-password` ao criar ou trocar — é o que faz o cofre sugerir senha forte
 * na hora certa e não sugerir na hora errada. Por isso é prop sem valor padrão:
 * quem esquecer de passar não compila.
 *
 * ## O botão
 *
 * `type="button"` explícito. Botão dentro de formulário é `submit` por padrão,
 * então sem isso clicar no olho ENVIARIA o formulário — com a senha ainda pela
 * metade, gastando uma tentativa no limite de requisições do Supabase.
 *
 * O nome acessível troca junto com o estado ("Mostrar senha" ↔ "Ocultar
 * senha"), e não há `aria-pressed`: com os dois, o leitor de tela anuncia o
 * estado duas vezes e em ordens diferentes conforme o programa.
 */
export function CampoSenha({
  id,
  nome = 'senha',
  rotulo = 'Senha',
  autoComplete,
  placeholder,
  minLength = 6,
  ajuda,
  acao,
}: {
  id: string
  nome?: string
  rotulo?: string
  autoComplete: 'current-password' | 'new-password'
  placeholder?: string
  minLength?: number
  ajuda?: string
  /** O que fica à direita do rótulo — hoje só o "Esqueci minha senha". */
  acao?: React.ReactNode
}) {
  const [visivel, setVisivel] = useState(false)
  const idAjuda = `${id}-ajuda`
  const rotuloBotao = visivel ? 'Ocultar senha' : 'Mostrar senha'

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <label htmlFor={id} className="text-xs text-[var(--ink-soft)]">
          {rotulo}
        </label>
        {acao}
      </div>

      <div className="relative">
        <input
          id={id}
          name={nome}
          type={visivel ? 'text' : 'password'}
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          required
          minLength={minLength}
          placeholder={placeholder}
          aria-describedby={ajuda ? idAjuda : undefined}
          className="campo campo-com-acao text-sm"
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={rotuloBotao}
          title={rotuloBotao}
          /* Sem `focus-visible:outline-*` aqui: a regra global do `globals.css`
             está fora de `@layer` e ganha de qualquer utilitário do Tailwind,
             então o anel já vem de lá — e um utilitário local seria código
             morto que dá a impressão de estar valendo. */
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--raised-hover)]"
        >
          <Olho cortado={visivel} />
        </button>
      </div>

      {ajuda ? (
        <p id={idAjuda} className="text-[11.5px] text-[var(--ink-faint)] mt-1.5">
          {ajuda}
        </p>
      ) : null}
    </div>
  )
}

/**
 * O olho, aberto ou cortado.
 *
 * O corte é desenhado DUAS vezes: primeiro grosso na cor do campo, depois fino
 * na cor do ícone. O traço grosso abre uma vala no desenho embaixo, senão a
 * diagonal cruza a pálpebra e a íris e as três linhas viram um borrão a 17px.
 * A vala usa `--raised` porque é o fundo do `.campo`, então ela acompanha os
 * dois temas sozinha.
 *
 * Qual dos dois aparece segue a convenção: o ícone mostra a AÇÃO, não o estado.
 * Senha escondida → olho aberto ("clique para ver"); senha à mostra → olho
 * cortado ("clique para esconder").
 */
function Olho({ cortado }: { cortado: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1.9 10S5 4.9 10 4.9 18.1 10 18.1 10 15 15.1 10 15.1 1.9 10 1.9 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      {cortado ? (
        <>
          <path d="M3.8 3.8 16.2 16.2" stroke="var(--raised)" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M3.8 3.8 16.2 16.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  )
}

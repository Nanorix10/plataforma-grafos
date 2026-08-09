'use client'

import { useFormStatus } from 'react-dom'

/**
 * Botão de enviar que mostra que está enviando.
 *
 * Toda escrita do site é server action, e a espera acontece do outro lado do
 * mundo: sem isto, o autor aperta "Salvar", nada muda na tela, e ele aperta de
 * novo. `disabled` enquanto pendente resolve o clique duplo; a roda resolve a
 * dúvida.
 *
 * `useFormStatus` só enxerga o formulário ACIMA dele — por isso isto é um
 * componente separado, e não um `pending` que o formulário passaria por prop.
 *
 * O par `name`/`value` cobre o formulário com mais de um botão de enviar, como
 * o "Liberar"/"Bloquear" da tela de pessoas: `data` traz o FormData que está
 * indo, então dá para saber qual dos dois foi apertado e girar só nele. Sem
 * eles, qualquer envio acende este botão.
 */
export default function BotaoEnviar({
  children,
  carregando = 'Salvando…',
  name,
  value,
  className = 'botao botao-primario !rounded-lg px-5 py-2 text-sm',
  ...resto
}: {
  children: React.ReactNode
  carregando?: string
  name?: string
  value?: string
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'className'>) {
  const { pending, data } = useFormStatus()
  const souEu = pending && (!name || data?.get(name) === value)

  return (
    <button
      type="submit"
      name={name}
      value={value}
      // desliga TODOS os botões do formulário durante o envio, não só o
      // apertado: dois envios em voo escreveriam a mesma linha duas vezes
      disabled={pending}
      aria-busy={souEu}
      className={`${className} disabled:opacity-60`}
      {...resto}
    >
      {souEu ? (
        <>
          <span className="girando" aria-hidden="true" />
          {carregando}
        </>
      ) : (
        children
      )}
    </button>
  )
}

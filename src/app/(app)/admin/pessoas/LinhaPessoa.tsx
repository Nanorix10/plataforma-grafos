'use client'

import { useState } from 'react'
import BotaoEnviar from '@/components/BotaoEnviar'
import { definirPlano, alternarAdmin } from './actions'
import { PLANOS, type Pessoa } from './planos'

/**
 * Uma pessoa na lista, com as duas ações que importam: liberar o acesso e dar
 * ou tirar o selo de admin.
 *
 * O plano e o "ativo" viajam no MESMO formulário de propósito. São uma decisão
 * só — "esta pessoa pagou o Acesso Completo" —, e separar em dois botões
 * deixaria passar o estado sem sentido de um plano escolhido mas inativo, que
 * na prática é o mesmo que nenhum acesso.
 */
export default function LinhaPessoa({
  pessoa,
  souEu,
}: {
  pessoa: Pessoa
  souEu: boolean
}) {
  const [plano, setPlano] = useState(pessoa.plano)
  const [erro, setErro] = useState<string | null>(null)

  const liberado = pessoa.ativo && pessoa.plano !== 'nenhum'

  return (
    <li className="bg-[var(--raised)] rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium truncate">
          {pessoa.email ?? pessoa.user_id}
        </span>

        {pessoa.is_admin ? (
          <span className="text-[10px] tracking-[0.08em] uppercase text-[var(--acento)] border border-[var(--acento)] rounded px-1.5 py-0.5">
            admin
          </span>
        ) : null}

        <span
          className={`text-[11px] ${liberado ? 'text-[var(--ok)]' : 'text-[var(--ink-faint)]'}`}
        >
          {liberado ? `acesso: ${pessoa.plano}` : 'sem acesso'}
        </span>

        {souEu ? (
          <span className="text-[11px] text-[var(--ink-faint)]">— você</span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <form action={definirPlano} className="flex items-center gap-2 flex-wrap">
          <input type="hidden" name="user_id" value={pessoa.user_id} />

          <label className="sr-only" htmlFor={`plano-${pessoa.user_id}`}>
            Plano de {pessoa.email ?? 'usuário'}
          </label>
          <select
            id={`plano-${pessoa.user_id}`}
            name="plano"
            value={plano}
            onChange={(e) => setPlano(e.target.value)}
            className="campo !w-auto text-[12.5px] !py-1"
          >
            {PLANOS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.slug}
                {p.processos ? ` — ${p.processos}` : ' — nada liberado'}
              </option>
            ))}
          </select>

          {/* Liberar e bloquear são o mesmo formulário com `ativo` diferente:
              o que muda é só o valor enviado, não a operação. */}
          {/* `name`/`value` também servem ao BotaoEnviar: é por eles que ele
              descobre qual dos dois foi apertado e gira só nele. */}
          <BotaoEnviar
            name="ativo"
            value="true"
            carregando="Liberando…"
            className="botao botao-primario !rounded-lg !py-1 !px-3 text-[12.5px]"
          >
            Liberar
          </BotaoEnviar>
          <BotaoEnviar
            name="ativo"
            value="false"
            carregando="Bloqueando…"
            className="botao botao-neutro !rounded-lg !py-1 !px-3 text-[12.5px]"
          >
            Bloquear
          </BotaoEnviar>
        </form>

        <form
          action={async (fd) => {
            setErro(null)
            try {
              await alternarAdmin(fd)
            } catch (e) {
              setErro(e instanceof Error ? e.message : 'Não deu certo.')
            }
          }}
          className="ml-auto"
        >
          <input type="hidden" name="user_id" value={pessoa.user_id} />
          <input type="hidden" name="is_admin" value={String(!pessoa.is_admin)} />
          <button
            type="submit"
            // o próprio admin não pode se rebaixar: a policy no banco recusaria,
            // e é melhor o botão nem convidar ao erro
            disabled={souEu && pessoa.is_admin}
            title={
              souEu && pessoa.is_admin
                ? 'Peça a outro admin para remover o seu acesso'
                : undefined
            }
            className="botao botao-neutro !rounded-lg !py-1 !px-3 text-[12.5px] disabled:opacity-40"
          >
            {pessoa.is_admin ? 'Tirar admin' : 'Tornar admin'}
          </button>
        </form>
      </div>

      {erro ? (
        <p role="status" aria-live="polite" className="text-[12px] text-[var(--erro)] m-0">
          {erro}
        </p>
      ) : null}
    </li>
  )
}

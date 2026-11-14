'use client'

import { useState } from 'react'
import BotaoEnviar from '@/components/BotaoEnviar'
import { definirPlano, alternarAdmin } from './actions'
import { PLANOS, type Pessoa } from './planos'

const NOME_DO_PLANO = Object.fromEntries(PLANOS.map((p) => [p.slug, p.nome]))

/**
 * Uma pessoa na lista, com as duas ações que importam: liberar o acesso e dar
 * ou tirar o selo de admin.
 *
 * O plano e o "ativo" viajam no MESMO formulário de propósito. São uma decisão
 * só — "esta pessoa pagou o Acesso Completo" —, e separar em dois botões
 * deixaria passar o estado sem sentido de um plano escolhido mas inativo, que
 * na prática é o mesmo que nenhum acesso.
 *
 * **O botão principal muda com o estado, e é por isso que só existe um.** Até
 * 13/11 "Liberar" e "Bloquear" apareciam sempre, e "Liberar" saía destacado
 * até para quem já estava liberado — além de ser o único jeito de salvar uma
 * troca de plano, sem dizer isso. Agora:
 *
 * | estado                         | botão principal |
 * |--------------------------------|-----------------|
 * | sem acesso                     | Liberar         |
 * | liberado, plano trocado no select | Salvar plano |
 * | liberado, nada mudou           | nenhum          |
 *
 * "Bloquear" só aparece para quem está liberado, e nunca na própria linha:
 * admin bloqueado vira plano `nenhum`, e `resumos/[slug]` passa a mostrar a ele
 * a tela de cadeado — continuaria editando sem conseguir ler. A server action
 * recusa o mesmo caso, porque o botão não é a única porta.
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
  const trocouPlano = plano !== pessoa.plano

  /* Erro de server action sem `try` derruba a tela inteira na página de erro;
     aqui ele vira uma linha embaixo da pessoa, igual ao do selo de admin. */
  async function enviar(acao: (fd: FormData) => Promise<void>, fd: FormData) {
    setErro(null)
    try {
      await acao(fd)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu certo.')
    }
  }

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
          {liberado ? NOME_DO_PLANO[pessoa.plano] ?? pessoa.plano : 'sem acesso'}
        </span>

        {souEu ? (
          <span className="text-[11px] text-[var(--ink-faint)]">— você</span>
        ) : null}

        {/* A data é a pista para casar a conta com o Pix: "cadastrou ontem à
            noite" separa dois e-mails parecidos na mesma semana. */}
        {pessoa.criado_em ? (
          <span className="text-[11px] text-[var(--ink-faint)] ml-auto tabular-nums">
            desde{' '}
            {new Date(pessoa.criado_em).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <form
          action={(fd) => enviar(definirPlano, fd)}
          className="flex items-center gap-2 flex-wrap"
        >
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
                {p.nome}
                {p.processos ? ` — ${p.processos}` : ''}
              </option>
            ))}
          </select>

          {/* `name`/`value` servem ao BotaoEnviar: é por eles que ele descobre
              qual dos dois foi apertado e gira só nele. */}
          {!liberado ? (
            <BotaoEnviar
              name="ativo"
              value="true"
              carregando="Liberando…"
              /* Liberar "Sem acesso" gravaria ativo sem abrir nada. */
              disabled={plano === 'nenhum'}
              title={plano === 'nenhum' ? 'Escolha um plano antes de liberar' : undefined}
              className="botao botao-primario !rounded-lg !py-1 !px-3 text-[12.5px]"
            >
              Liberar
            </BotaoEnviar>
          ) : trocouPlano ? (
            <BotaoEnviar
              name="ativo"
              value={plano === 'nenhum' ? 'false' : 'true'}
              carregando="Salvando…"
              className="botao botao-primario !rounded-lg !py-1 !px-3 text-[12.5px]"
            >
              Salvar plano
            </BotaoEnviar>
          ) : null}

          {liberado && !souEu ? (
            <BotaoEnviar
              name="ativo"
              value="false"
              carregando="Bloqueando…"
              className="botao botao-neutro !rounded-lg !py-1 !px-3 text-[12.5px]"
            >
              Bloquear
            </BotaoEnviar>
          ) : null}
        </form>

        <form action={(fd) => enviar(alternarAdmin, fd)} className="ml-auto">
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
            /* O selo dá poder de editar e excluir o acervo inteiro e de ver os
               e-mails de todo mundo, e mora na mesma linha do Liberar. Um
               clique errado não pode bastar. Tirar o selo também pergunta: é
               a mesma linha, e o mesmo dedo escorrega. */
            onClick={(ev) => {
              const quem = pessoa.email ?? 'esta conta'
              const pergunta = pessoa.is_admin
                ? `Tirar o acesso de admin de ${quem}?`
                : `Dar acesso de admin a ${quem}? Essa pessoa poderá editar e excluir resumos e ver os e-mails de todos.`
              if (!confirm(pergunta)) ev.preventDefault()
            }}
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

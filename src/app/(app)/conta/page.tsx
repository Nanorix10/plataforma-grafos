import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { PLANO_PROCESSOS } from '@/lib/wikilinks'
import { PROCESSOS } from '@/lib/processos'
import BotaoEnviar from '@/components/BotaoEnviar'
import { sair } from './actions'

/** Como cada plano se chama para o aluno. O slug do banco é nome de código. */
const NOME_DO_PLANO: Record<string, string> = {
  passe: 'PASSE',
  pas: 'PAS',
  completo: 'Acesso Completo',
  nenhum: 'Sem acesso',
}

export default async function ContaPage() {
  const { supabase, userId, plano, ativo, isAdminReal } = await getSessao()
  if (!userId) redirect('/login')

  /* O e-mail sai de `planos_usuarios`, não de `auth.users`: aquela tabela não é
     legível pelas policies normais, e o projeto roda só com a chave anônima.
     A cópia existe desde a migration de gestão de pessoas — ver decisão 1b. */
  const { data: linha } = await supabase
    .from('planos_usuarios')
    .select('email, criado_em')
    .eq('user_id', userId)
    .single()

  const liberados = PLANO_PROCESSOS[plano] ?? []
  const todos = Object.entries(PROCESSOS)

  return (
    <div className="max-w-[680px] mx-auto px-5 py-8 sm:px-8 sm:py-11">
      <h1 className="text-2xl font-medium mb-1">Sua conta</h1>
      <p className="text-[13px] text-[var(--ink-faint)] mb-8">
        Quem você é aqui e o que o seu plano libera.
      </p>

      {/* ---- identidade ---- */}
      <section className="bg-[var(--raised)] rounded-lg p-5 mb-4">
        <div className="rotulo mb-1">E-mail</div>
        <p className="text-[15px] break-words">{linha?.email ?? '—'}</p>

        {linha?.criado_em ? (
          <p className="text-[12px] text-[var(--ink-faint)] mt-2">
            Conta criada em{' '}
            {new Date(linha.criado_em).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        ) : null}

        {isAdminReal ? (
          <span className="inline-block mt-3 text-[10px] tracking-[0.08em] uppercase text-[var(--acento)] border border-[var(--acento)] rounded px-1.5 py-0.5">
            admin
          </span>
        ) : null}
      </section>

      {/* ---- plano ---- */}
      <section className="bg-[var(--raised)] rounded-lg p-5 mb-4">
        <div className="flex items-baseline gap-2.5 flex-wrap mb-4">
          <div>
            <div className="rotulo mb-1">Plano</div>
            <p className="text-[15px] font-medium">
              {NOME_DO_PLANO[plano] ?? plano}
            </p>
          </div>
          <span
            className={`ml-auto text-[11.5px] ${
              ativo ? 'text-[var(--ok)]' : 'text-[var(--ink-faint)]'
            }`}
          >
            {ativo ? 'ativo' : 'inativo'}
          </span>
        </div>

        {/* Todos os processos aparecem SEMPRE, com o liberado marcado. Listar
            só o que está liberado esconderia justamente o que o aluno ganha ao
            trocar de plano — e para quem está sem acesso, a lista viria vazia
            e a tela não diria nada. */}
        <div className="rotulo mb-2">Vestibulares</div>
        <ul className="flex flex-col gap-1.5">
          {todos.map(([slug, p]) => {
            const liberado = liberados.includes(slug)
            return (
              <li key={slug} className="flex items-center gap-2.5 text-[13.5px]">
                <span
                  aria-hidden="true"
                  className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[10px] ${
                    liberado
                      ? 'bg-[var(--ok)] text-[var(--page)]'
                      : 'border border-[var(--line-forte)] text-[var(--ink-faint)]'
                  }`}
                >
                  {liberado ? '✓' : ''}
                </span>
                <span className={liberado ? '' : 'text-[var(--ink-faint)]'}>
                  {p.nome}
                </span>
                {/* o estado também vai por texto, não só por cor e ícone */}
                <span className="ml-auto text-[11.5px] text-[var(--ink-faint)]">
                  {liberado ? 'liberado' : 'fora do plano'}
                </span>
              </li>
            )
          })}
        </ul>

        {liberados.length < todos.length ? (
          <div className="mt-5 pt-4 border-t border-[var(--line)]">
            <p className="text-[12.5px] text-[var(--ink-dim)] mb-3">
              {liberados.length === 0
                ? 'Sua conta ainda não tem acesso liberado. A liberação é feita à mão depois do pagamento.'
                : 'Quer os outros vestibulares? O Acesso Completo libera os três.'}
            </p>
            <Link
              href="/#planos"
              className="botao botao-primario !rounded-lg px-4 py-2 text-[13px]"
            >
              Ver planos
            </Link>
          </div>
        ) : null}
      </section>

      {/* ---- sair ---- */}
      <section className="bg-[var(--raised)] rounded-lg p-5">
        <div className="rotulo mb-1">Sessão</div>
        <p className="text-[12.5px] text-[var(--ink-dim)] mb-3.5">
          Encerra a sessão neste aparelho. Vale a pena em computador
          compartilhado — sem isso, quem usar depois entra direto na sua conta.
        </p>
        <form action={sair}>
          <BotaoEnviar
            carregando="Saindo…"
            className="botao botao-neutro !rounded-lg px-4 py-2 text-[13px]"
          >
            Sair da conta
          </BotaoEnviar>
        </form>
      </section>

      <p className="text-[12px] text-[var(--ink-faint)] mt-6">
        Precisa trocar o e-mail ou a senha? Fale com o Ronny — essa parte ainda
        é feita à mão.
      </p>
    </div>
  )
}

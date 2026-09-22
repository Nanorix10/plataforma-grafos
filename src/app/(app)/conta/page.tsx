import Link from 'next/link'
import { AvisoAcesso } from '@/components/AvisoAcesso'
import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { PLANO_PROCESSOS, PLANOS } from '@/lib/planos'
import { PROVAS } from '@/lib/processos'
import BotaoEnviar from '@/components/BotaoEnviar'
import { sair } from './actions'
import { TrocarEmail, TrocarSenha } from './Credenciais'
import { MATERIAS } from '@/lib/materias'
import { getResumos, type ResumoItem } from '@/lib/resumos'
import { getMarcas, quandoFoi } from '@/lib/leituras'
import { getEstudo, getDias } from '@/lib/estudo'
import { porcentagem } from '@/lib/edital'
import DiasSeguidos from './DiasSeguidos'

export default async function ContaPage({
  searchParams,
}: {
  searchParams: Promise<{ troca?: string }>
}) {
  const { supabase, userId, plano, ativo, isAdminReal } = await getSessao()
  if (!userId) redirect('/login')

  /* `getUser()` aqui, apesar da decisão 5 mandar usar `getClaims()`.
     A regra existe para a NAVEGAÇÃO, onde a ida à rede se paga em toda página;
     esta é uma página só, que o aluno abre de vez em quando. E ela precisa de
     duas coisas que o JWT não dá: o e-mail conferido agora (o do token é uma
     cópia de até uma hora atrás, e pode ser justamente o que uma troca acabou
     de aposentar) e o `new_email`, que só existe na resposta do servidor e é o
     que permite dizer "falta abrir o link". */
  const { data: usuario } = await supabase.auth.getUser()
  const email = usuario.user?.email ?? null
  const emailPendente = usuario.user?.new_email ?? null

  /* A data de criação continua vindo de `planos_usuarios`: `auth.users` não é
     legível pelas policies normais, e o projeto roda só com a chave anônima —
     ver decisão 1b. O e-mail daquela tabela é a cópia que a tela do admin usa,
     e não a fonte da verdade desta aqui. */
  const { data: linha } = await supabase
    .from('planos_usuarios')
    .select('criado_em')
    .eq('user_id', userId)
    .single()

  const troca = (await searchParams).troca

  /* O estudo (decisão 23). Quatro leituras independentes, em paralelo. As
     duas primeiras são as mesmas da /resumos e já são memoizadas; as outras
     duas só existem aqui. */
  const [resumos, marcas, estudo, dias] = await Promise.all([
    getResumos(),
    getMarcas(),
    getEstudo(),
    getDias(),
  ])

  // "Abertos" conta só o que o plano cobre, como a /resumos (decisão 17): a
  // marca de um resumo que saiu do plano continua no banco, e contá-la daria
  // mais abertos que liberados.
  const liberadosIds = new Set(resumos.filter((r) => r.liberado).map((r) => r.id))
  const liberadosNoAcervo = liberadosIds.size
  const abertosIds = new Set(marcas.map((m) => m.resumo_id).filter((id) => liberadosIds.has(id)))
  const abertos = abertosIds.size

  const porId = new Map(resumos.map((r) => [r.id, r]))
  const continuar = marcas
    .map((m) => ({ resumo: porId.get(m.resumo_id), visto_em: m.visto_em }))
    .find((x): x is { resumo: ResumoItem; visto_em: string } => !!x.resumo?.liberado)

  // Na ordem canônica de `MATERIAS`, e só as matérias com algo liberado:
  // "0 de 0" não é progresso, é ruído.
  const porMateria = Object.keys(MATERIAS)
    .map((slug) => {
      const daMateria = resumos.filter((r) => r.materia_slug === slug && r.liberado)
      return {
        slug,
        liberados: daMateria.length,
        abertos: daMateria.filter((r) => abertosIds.has(r.id)).length,
      }
    })
    .filter((m) => m.liberados > 0)

  const editalDoPlano = estudo.edital.filter((e) => liberados.includes(e.processo))
  const marcadosNoEdital = editalDoPlano.reduce((s, e) => s + e.marcados, 0)
  const etapasComMarca = editalDoPlano.filter((e) => e.marcados > 0).length
  const paraRefazer = estudo.respondidas - estudo.acertos

  /* Sem nenhum sinal de estudo, a página não mostra uma parede de zeros: mostra
     o que vai aparecer ali e onde começar. */
  const comecou =
    marcas.length > 0 ||
    dias.length > 0 ||
    marcadosNoEdital > 0 ||
    estudo.respondidas > 0 ||
    estudo.grifos > 0

  const liberados = PLANO_PROCESSOS[plano] ?? []
  /* `PROVAS`, e não `PROCESSOS`: a lista abaixo se chama
     "Vestibulares", e `comum` não é um. Ver `lib/processos.ts`. */
  const todos = Object.entries(PROVAS)

  return (
    <div className="max-w-[680px] mx-auto px-5 py-8 sm:px-8 sm:py-11">
      <h1 className="text-2xl font-medium mb-1">Sua página</h1>
      <p className="text-[13px] text-[var(--ink-faint)] mb-8">
        O seu estudo e a sua conta.
      </p>

      {/* Recado de quem acabou de voltar do link do e-mail (ver
          `app/auth/confirmar/route.ts`). Vive numa região `status` porque
          aparece por causa de uma navegação, e não de um clique nesta tela:
          sem isso, quem usa leitor de tela chegaria aqui sem saber que a troca
          que começou noutro aparelho tinha se concluído. */}
      {troca === 'ok' || troca === 'falhou' ? (
        <p
          role="status"
          className={`text-[13px] rounded-lg px-4 py-3 mb-6 ${
            troca === 'ok'
              ? 'text-[var(--ok)] bg-[var(--raised)]'
              : 'text-[var(--erro)] bg-[var(--raised)]'
          }`}
        >
          {troca === 'ok'
            ? 'Confirmado. Se você trocou o e-mail, o endereço abaixo já é o novo.'
            : 'Esse link não vale mais — eles expiram e só funcionam uma vez. Peça a troca de novo aqui embaixo.'}
        </p>
      ) : null}

      {/* ---- o estudo (decisão 23) ----
          Vem ANTES da conta: é o que o aluno vem ver toda semana, e e-mail e
          senha ele troca uma vez por ano. Some para quem não tem plano — a
          seção do plano, logo abaixo, já explica o que falta, e um "abra um
          resumo" para quem não pode abrir nenhum seria mentira. */}
      {liberadosNoAcervo > 0 ? (
        comecou ? (
          <>
            {continuar ? (
              <section className="mb-7">
                <div className="rotulo mb-2">Continuar</div>
                <Link
                  href={`/resumos/${continuar.resumo.slug}`}
                  className="group flex items-center gap-3 rounded-lg bg-[var(--raised)] px-4 py-3 hover:bg-[var(--raised-hover)] focus-visible:outline-2 focus-visible:outline-[var(--acento)]"
                >
                  <span className="min-w-0">
                    <span
                      className="block text-[15px] font-medium truncate"
                      style={{ color: corDe(continuar.resumo.materia_slug) }}
                    >
                      {continuar.resumo.titulo}
                    </span>
                    <span className="block text-[12px] text-[var(--ink-faint)]">
                      {nomeDe(continuar.resumo.materia_slug)} · aberto {quandoFoi(continuar.visto_em)}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-[var(--acento)] transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </section>
            ) : null}

            <section className="mb-7">
              <div className="rotulo mb-2">Seu estudo</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <Numero
                  para="/resumos?ver=novos"
                  grande={abertos}
                  de={liberadosNoAcervo}
                  legenda="resumos abertos"
                  extra={`${porcentagem(abertos, liberadosNoAcervo)}% do seu plano`}
                />
                <Numero
                  para="/edital"
                  grande={marcadosNoEdital}
                  legenda="tópicos marcados no edital"
                  extra={
                    etapasComMarca > 0
                      ? `em ${etapasComMarca} ${etapasComMarca === 1 ? 'etapa' : 'etapas'}`
                      : 'nenhum ainda'
                  }
                />
                <Numero
                  para={paraRefazer > 0 ? '/resumos?ver=refazer' : undefined}
                  grande={estudo.acertos}
                  de={estudo.respondidas}
                  legenda={estudo.acertos === 1 ? 'questão certa' : 'questões certas'}
                  extra={
                    paraRefazer > 0
                      ? `${paraRefazer} para refazer`
                      : estudo.respondidas > 0
                        ? 'nada para refazer'
                        : 'nenhuma respondida'
                  }
                  alerta={paraRefazer > 0}
                />
                <Numero
                  grande={estudo.grifos}
                  legenda={estudo.grifos === 1 ? 'grifo' : 'grifos'}
                  extra={
                    estudo.grifos > 0
                      ? `em ${estudo.resumos_grifados} ${estudo.resumos_grifados === 1 ? 'resumo' : 'resumos'} · ${estudo.grifos_com_nota} com nota`
                      : 'selecione um trecho num resumo'
                  }
                />
              </div>
            </section>

            <section className="mb-7">
              <div className="rotulo mb-2">Dias de estudo</div>
              <div className="bg-[var(--raised)] rounded-lg p-4">
                <DiasSeguidos dias={dias} />
                <p className="text-[11.5px] text-[var(--ink-faint)] mt-3">
                  Conta o dia em que você abre algum resumo, no relógio do seu aparelho. O site
                  começou a contar em 23 de setembro de 2026.
                </p>
              </div>
            </section>

            <section className="mb-7">
              <div className="rotulo mb-2">Resumos abertos, por matéria</div>
              <ul className="flex flex-col gap-2">
                {porMateria.map((m) => (
                  <Barra
                    key={m.slug}
                    nome={nomeDe(m.slug)}
                    cor={corDe(m.slug)}
                    feitos={m.abertos}
                    total={m.liberados}
                  />
                ))}
              </ul>
              {/* "aberto", nunca "lido" — a mesma palavra da /resumos, pelo
                  mesmo motivo (decisão 16). */}
              <p className="text-[11.5px] text-[var(--ink-faint)] mt-2.5">
                “Aberto” quer dizer que você abriu a página — o site não tem como saber se você leu.
              </p>
            </section>

            {editalDoPlano.length > 0 ? (
              <section className="mb-7">
                <div className="rotulo mb-2">Edital, por etapa</div>
                <ul className="flex flex-col gap-2">
                  {editalDoPlano.map((e) => (
                    <Barra
                      key={`${e.processo}-${e.etapa}`}
                      nome={`${PROVAS[e.processo as keyof typeof PROVAS]?.nome ?? e.processo} · ${e.etapa}ª etapa`}
                      cor="var(--acento)"
                      feitos={e.marcados}
                      total={e.total}
                    />
                  ))}
                </ul>
                <p className="text-[11.5px] text-[var(--ink-faint)] mt-2.5">
                  Só as provas do seu plano. Marque o que já estudou na{' '}
                  <Link href="/edital" className="text-[var(--acento)] underline underline-offset-2">
                    página do edital
                  </Link>
                  .
                </p>
              </section>
            ) : null}
          </>
        ) : (
          <section className="mb-7">
            <div className="rotulo mb-2">Seu estudo</div>
            <div className="bg-[var(--raised)] rounded-lg p-5 text-[13.5px] leading-relaxed text-[var(--ink-dim)]">
              Nada por aqui ainda. Esta página junta o que você faz no site:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  os <Link href="/resumos" className="text-[var(--acento)] underline underline-offset-2">resumos</Link> que você abrir, e os dias em que estudou;
                </li>
                <li>
                  os tópicos que marcar no{' '}
                  <Link href="/edital" className="text-[var(--acento)] underline underline-offset-2">edital</Link>;
                </li>
                <li>as questões que responder e os trechos que grifar.</li>
              </ul>
            </div>
          </section>
        )
      ) : null}

      <h2 className="rotulo mb-2 mt-2">Conta</h2>

      {/* ---- identidade ---- */}
      <section className="bg-[var(--raised)] rounded-lg p-5 mb-4">
        <div className="rotulo mb-1">E-mail</div>
        <p className="text-[15px] break-words">{email ?? '—'}</p>

        {/* Troca pedida e ainda não confirmada. Dizer isto é o que separa
            "o site não fez nada" de "falta um clique seu": sem a linha, quem
            não achou o e-mail voltaria aqui, veria o endereço antigo e
            concluiria que a troca falhou. */}
        {emailPendente ? (
          <p className="text-[12.5px] text-[var(--ink-dim)] mt-2.5 border-l-2 border-[var(--acento)] pl-2.5">
            Troca pendente para <span className="break-words">{emailPendente}</span>. Abra o
            link que enviamos para concluir — até lá, você entra com o endereço acima.
          </p>
        ) : null}

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
              {PLANOS[plano]?.nome ?? plano}
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
          <AvisoAcesso
            caso={liberados.length === 0 ? 'nenhum' : 'parcial'}
            className="mt-5 pt-4 border-t border-[var(--line)]"
          />
        ) : null}
      </section>

      {/* ---- trocar e-mail e senha ---- */}
      {email ? <TrocarEmail emailAtual={email} /> : null}
      <TrocarSenha />

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
    </div>
  )
}

function nomeDe(slug: string) {
  return MATERIAS[slug as keyof typeof MATERIAS]?.nome ?? slug
}

function corDe(slug: string) {
  return MATERIAS[slug as keyof typeof MATERIAS]?.cor ?? 'var(--ink)'
}

/**
 * Um dos quatro números do topo. Vira link quando há para onde levar — o
 * número é a pergunta, e a tela de destino é a resposta.
 */
function Numero({
  para,
  grande,
  de,
  legenda,
  extra,
  alerta,
}: {
  para?: string
  grande: number
  de?: number
  legenda: string
  extra: string
  alerta?: boolean
}) {
  const miolo = (
    <>
      <span className="text-[26px] font-medium leading-tight tabular-nums">
        {grande}
        {de !== undefined ? (
          <span className="text-[14px] font-normal text-[var(--ink-faint)]"> de {de}</span>
        ) : null}
      </span>
      <span className="text-[12.5px] text-[var(--ink-dim)] leading-snug">{legenda}</span>
      <span
        className={`text-[11.5px] mt-1 ${alerta ? 'text-[var(--erro)]' : 'text-[var(--ink-faint)]'}`}
      >
        {extra}
      </span>
    </>
  )
  const classe = 'flex flex-col gap-0.5 rounded-lg bg-[var(--raised)] px-3.5 pt-3.5 pb-3'
  return para ? (
    <Link
      href={para}
      className={`${classe} hover:bg-[var(--raised-hover)] focus-visible:outline-2 focus-visible:outline-[var(--acento)]`}
    >
      {miolo}
    </Link>
  ) : (
    <div className={classe}>{miolo}</div>
  )
}

/** Uma linha de progresso: nome, barra e "x de y". */
function Barra({
  nome,
  cor,
  feitos,
  total,
}: {
  nome: string
  cor: string
  feitos: number
  total: number
}) {
  return (
    <li className="grid grid-cols-[minmax(0,9.5rem)_1fr_4.5rem] items-center gap-3 text-[13px]">
      <span className="truncate" style={{ color: cor }}>
        {nome}
      </span>
      <span aria-hidden="true" className="h-[5px] rounded-full bg-[var(--line)] overflow-hidden">
        <span
          className="block h-full rounded-full"
          style={{ width: `${porcentagem(feitos, total)}%`, background: cor }}
        />
      </span>
      <span className="text-right text-[12px] text-[var(--ink-faint)] tabular-nums">
        {feitos} de {total}
      </span>
    </li>
  )
}

import Link from 'next/link'
import { AvisoAcesso } from '@/components/AvisoAcesso'
import { MATERIAS } from '@/lib/materias'
import { agruparPorMateria, getResumos, type ResumoItem } from '@/lib/resumos'
import { getMarcas, quandoFoi, QUANTOS_RECENTES } from '@/lib/leituras'

/**
 * Um resumo na grade.
 *
 * Sem o rótulo da matéria **nas seções por matéria**: o cabeçalho logo acima já
 * diz qual é, e repetir em cada cartão só rouba a linha que o título usa para
 * respirar.
 *
 * Nas duas faixas do topo — recentes e favoritos — o cabeçalho não diz matéria
 * nenhuma, porque elas misturam as dez. Daí o `rodape`: é lá que entram a
 * matéria e o "há 2 dias", e é a única diferença entre um cartão e o outro.
 */
function Cartao({ resumo, rodape }: { resumo: ResumoItem; rodape?: React.ReactNode }) {
  const conteudo = (
    <div
      className={`rounded-lg p-4 h-full flex flex-col gap-1.5 ${
        resumo.liberado
          ? 'bg-[var(--raised)] hover:bg-[var(--raised-hover)]'
          : 'bg-[var(--panel)] opacity-55'
      }`}
    >
      {/* O título vai na cor da matéria. Só o liberado: o bloqueado precisa
          continuar lendo como apagado, e cor cheia desmentiria o cadeado. */}
      <span
        className="font-medium text-[15px] text-pretty break-words"
        style={
          resumo.liberado
            ? { color: MATERIAS[resumo.materia_slug as keyof typeof MATERIAS]?.cor }
            : undefined
        }
      >
        {resumo.titulo}
      </span>
      {resumo.liberado ? null : (
        <span className="text-[11px] text-[var(--ink-faint)]">
          <span aria-hidden="true">🔒 </span>
          fora do seu plano
        </span>
      )}
      {rodape}
    </div>
  )

  return resumo.liberado ? (
    <Link
      href={`/resumos/${resumo.slug}`}
      className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
    >
      {conteudo}
    </Link>
  ) : (
    conteudo
  )
}

/**
 * Uma das duas faixas do topo. Só existe quando tem o que mostrar.
 *
 * As duas respondem à pergunta que a barra lateral não responde. A barra é uma
 * árvore de 249 itens, igual para todo mundo, e serve para **procurar**. Estas
 * faixas são só do aluno que está logado e servem para **voltar** — uma com o
 * que ele abriu, outra com o que ele escolheu guardar. É o trabalho próprio
 * desta tela, que antes repetia o da barra e perdia.
 */
function Faixa({
  titulo,
  descricao,
  children,
}: {
  titulo: string
  descricao: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-9">
      <div className="flex items-baseline gap-2.5 mb-3">
        <h2 className="text-[15px] font-medium">{titulo}</h2>
        <span className="text-[11.5px] text-[var(--ink-faint)]">{descricao}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">{children}</div>
    </section>
  )
}

export default async function ResumosPage() {
  // a guarda de login e a barra lateral ficam no layout do grupo (app)
  //
  // As duas em paralelo: uma não depende da outra, e são consultas a bancos
  // diferentes da mesma conexão. Em série, a página esperaria duas idas.
  const [resumos, marcas] = await Promise.all([getResumos(), getMarcas()])

  /**
   * O cruzamento marca → resumo acontece AQUI, em memória, e não numa junção
   * no banco. `getResumos()` já trouxe os 249 com id, e `getMarcas()` trouxe as
   * marcas deste aluno; juntar as duas listas é percorrer um `Map`.
   *
   * O filtro por `liberado` não é detalhe. Um resumo marcado enquanto o plano o
   * cobria continua marcado depois que o plano muda — e um cadeado na faixa
   * "Continuar de onde parou" seria o site oferecendo de volta o que acabou de
   * tirar. Nas faixas, só o que ele pode abrir agora.
   */
  const porId = new Map(resumos.map((r) => [r.id, r]))

  const recentes = marcas
    .map((m) => ({ resumo: porId.get(m.resumo_id), visto_em: m.visto_em }))
    .filter((x): x is { resumo: ResumoItem; visto_em: string } => !!x.resumo && x.resumo.liberado)
    .slice(0, QUANTOS_RECENTES)

  const favoritos = marcas
    .filter((m) => m.favorito)
    // Por quando foi favoritado, o mais novo primeiro — a estrela que o aluno
    // acabou de acender aparece no topo, onde ele vai procurá-la. `getMarcas`
    // devolve ordenado por `visto_em`, que é outra coisa.
    .sort((a, b) => (b.favoritado_em ?? '').localeCompare(a.favoritado_em ?? ''))
    .map((m) => porId.get(m.resumo_id))
    .filter((r): r is ResumoItem => !!r && r.liberado)

  /**
   * A mesma função que monta a barra lateral, então as duas listas ficam na
   * mesma ordem — a de `MATERIAS`, e não alfabética nem por data. Aqui usamos
   * `itens` (todos os resumos da disciplina) e não `arvore`: esta página é o
   * acervo por matéria, e a hierarquia de assuntos é assunto da barra lateral
   * e do mapa.
   */
  const grupos = agruparPorMateria(resumos)
  const liberados = resumos.filter((r) => r.liberado).length

  return (
    <div className="max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-11">
      <h1 className="text-2xl font-medium mb-1">Seus resumos</h1>
      <p className="text-[13px] text-[var(--ink-faint)] mb-8">
        {resumos.length === 0
          ? 'Nenhum resumo publicado ainda.'
          : `${liberados} liberados de ${resumos.length} · ${grupos.length} ${
              grupos.length === 1 ? 'matéria' : 'matérias'
            }`}
      </p>

      {/* O aluno novo cai AQUI, não em `/conta` — o cadastro manda para esta
          tela. Sem este bloco ele encontra a parede de cadeados, o seco "0
          liberados de N" e nenhuma saída, e o recado que explica tudo fica numa
          tela que ele não tem motivo para abrir.

          Só no caso de zero: com plano parcial a lista já funciona, e um
          chamariz de plano em cima dos resumos que ele PAGOU seria cobrar duas
          vezes pela mesma tela. */}
      {resumos.length > 0 && liberados === 0 ? (
        <AvisoAcesso caso="nenhum" className="bg-[var(--raised)] rounded-lg p-5 mb-9" />
      ) : null}

      {/* As duas faixas vêm ANTES do acervo por matéria, e somem sozinhas para
          quem ainda não abriu nem guardou nada — o aluno novo vê a página que
          sempre existiu, sem duas seções vazias explicando o que ele ainda não
          fez. */}
      {recentes.length > 0 ? (
        <Faixa titulo="Continuar de onde parou" descricao="os últimos que você abriu">
          {recentes.map(({ resumo, visto_em }) => (
            <Cartao
              key={resumo.slug}
              resumo={resumo}
              rodape={
                <span className="mt-auto pt-1 text-[11px] text-[var(--ink-faint)]">
                  {MATERIAS[resumo.materia_slug as keyof typeof MATERIAS]?.nome ??
                    resumo.materia_slug}
                  {' · '}
                  {quandoFoi(visto_em)}
                </span>
              }
            />
          ))}
        </Faixa>
      ) : null}

      {favoritos.length > 0 ? (
        <Faixa
          titulo="Favoritos"
          descricao={`${favoritos.length} ${favoritos.length === 1 ? 'resumo' : 'resumos'}`}
        >
          {favoritos.map((resumo) => (
            <Cartao
              key={resumo.slug}
              resumo={resumo}
              rodape={
                <span className="mt-auto pt-1 text-[11px] text-[var(--ink-faint)]">
                  {MATERIAS[resumo.materia_slug as keyof typeof MATERIAS]?.nome ??
                    resumo.materia_slug}
                </span>
              }
            />
          ))}
        </Faixa>
      ) : null}

      {/* A linha que separa "o que é seu" do acervo inteiro. Sem ela as faixas
          e as matérias leriam como uma lista só de dezenas de seções. */}
      {recentes.length > 0 || favoritos.length > 0 ? (
        <hr className="border-0 border-t border-[var(--line)] mb-9" />
      ) : null}

      {grupos.map(({ materia, itens }) => {
        const info = MATERIAS[materia as keyof typeof MATERIAS]
        const liberadosAqui = itens.filter((r) => r.liberado).length

        return (
          <section key={materia} className="mb-9 last:mb-0">
            <div className="flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: info?.cor ?? 'var(--ink-faint)' }}
              />
              <h2
                className="text-[15px] font-medium"
                style={{ color: info?.cor ?? 'var(--ink)' }}
              >
                {info?.nome ?? materia}
              </h2>
              {/* o contador só aparece quando há o que contar: numa matéria
                  inteiramente liberada ele seria ruído */}
              <span className="text-[11.5px] text-[var(--ink-faint)] tabular-nums">
                {liberadosAqui === itens.length
                  ? itens.length
                  : `${liberadosAqui} de ${itens.length}`}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {itens.map((r) => (
                <Cartao key={r.slug} resumo={r} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

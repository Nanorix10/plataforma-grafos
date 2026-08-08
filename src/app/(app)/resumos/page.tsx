import Link from 'next/link'
import { MATERIAS } from '@/lib/materias'
import { agruparPorMateria, getResumos, type ResumoItem } from '@/lib/resumos'

/**
 * Um resumo na grade.
 *
 * Sem o rótulo da matéria: o cabeçalho da seção logo acima já diz qual é, e
 * repetir em cada cartão só rouba a linha que o título usa para respirar.
 */
function Cartao({ resumo }: { resumo: ResumoItem }) {
  const conteudo = (
    <div
      className={`rounded-lg p-4 h-full flex flex-col gap-1.5 ${
        resumo.liberado
          ? 'bg-[var(--raised)] hover:bg-[var(--raised-hover)]'
          : 'bg-[var(--panel)] opacity-55'
      }`}
    >
      <span className="font-medium text-[15px] text-pretty break-words">
        {resumo.titulo}
      </span>
      {resumo.liberado ? null : (
        <span className="text-[11px] text-[var(--ink-faint)]">
          <span aria-hidden="true">🔒 </span>
          fora do seu plano
        </span>
      )}
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

export default async function ResumosPage() {
  // a guarda de login e a barra lateral ficam no layout do grupo (app)
  const resumos = await getResumos()

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
              <h2 className="text-[15px] font-medium">
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

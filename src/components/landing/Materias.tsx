import { MATERIAS } from '@/lib/materias'
import { ASSUNTOS, PROCESSOS_DA_MATERIA } from '@/lib/assuntos'

/**
 * A vitrine do acervo.
 *
 * Antes cada célula trazia um ponto de 8px e repetia o nome da matéria —
 * informação que o aluno já tem antes de chegar ao site. A seção nomeava
 * disciplinas sem provar que havia conteúdo atrás delas.
 *
 * Duas mudanças, e as duas resolvem o mesmo problema por caminhos diferentes:
 *
 * - **Cada matéria mostra o que tem dentro.** Três assuntos são a diferença
 *   entre "temos Física" e "temos Leis de Newton, Trabalho e energia,
 *   Gravitação". O segundo é verificável; o primeiro é categoria.
 * - **A cor vira área.** Uma faixa de 4px no topo do cartão, em vez do ponto.
 *   As 12 cores passam em contraste medido, então dá para usá-las com peso.
 *
 * **A última célula não é enfeite.** Com oito cartões cheios, a grade fecha
 * como se aquelas fossem todas as matérias que existem — e não são. Ela nomeia
 * as que ficaram de fora, porque "e outras" deixaria o aluno adivinhando se a
 * dele está entre elas, que é exatamente a dúvida que faz alguém fechar a aba.
 */

const SLUGS = Object.keys(MATERIAS) as (keyof typeof MATERIAS)[]
const NA_GRADE = SLUGS.slice(0, 8)
const RESTANTES = SLUGS.slice(8)

export default function Materias() {
  return (
    <section
      id="materias"
      className="py-[var(--ritmo-secao)] max-w-[1120px] mx-auto px-8"
    >
      <div className="max-w-[560px] mb-11">
        <div className="rotulo-secao mb-3">Acervo</div>
        <h2 className="text-[length:var(--t-titulo)] font-medium mb-3">
          Uma pasta por matéria, dentro de cada processo seletivo.
        </h2>
        <p className="text-sm text-[var(--ink-dim)]">
          Filtre por disciplina e pelo vestibular que você está estudando.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {NA_GRADE.map((slug) => (
          <div
            key={slug}
            className="bg-[var(--raised)] rounded-[var(--raio)] overflow-hidden shadow-[var(--sombra)] flex flex-col"
          >
            {/* A cor ocupa a largura inteira do cartão. Era um ponto de 8px. */}
            <div className="h-1 shrink-0" style={{ background: MATERIAS[slug].cor }} />
            <div className="p-4 flex flex-col gap-2.5 flex-1">
              <div>
                <h3 className="font-medium text-[length:var(--t-base)]">
                  {MATERIAS[slug].nome}
                </h3>
                <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)]">
                  {PROCESSOS_DA_MATERIA[slug]}
                </span>
              </div>
              <ul className="mt-auto space-y-1">
                {(ASSUNTOS[slug] ?? []).map((a) => (
                  <li
                    key={a}
                    className="text-[length:var(--t-peq)] text-[var(--ink-dim)] flex items-baseline gap-1.5"
                  >
                    <span aria-hidden="true" style={{ color: MATERIAS[slug].cor }}>
                      ·
                    </span>
                    {a}
                  </li>
                ))}
                {/* As reticências dizem que a lista da MATÉRIA também continua:
                    são três assuntos de muitos, não os três que existem. */}
                <li className="text-[length:var(--t-peq)] text-[var(--ink-faint)] pl-[13px]">
                  e outros
                </li>
              </ul>
            </div>
          </div>
        ))}

        {/* A célula que fecha a grade sem fechar o assunto. Desenho diferente
            dos cartões de propósito — contornada e sem faixa de cor —, para
            ninguém a confundir com uma matéria chamada "e mais". */}
        <div className="rounded-[var(--raio)] border border-dashed border-[var(--line-forte)] p-4 flex flex-col justify-center gap-2">
          <div className="text-[length:var(--t-base)] font-medium text-[var(--ink-dim)]">
            E também
          </div>
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {RESTANTES.map((slug) => (
              <li
                key={slug}
                className="text-[length:var(--t-peq)]"
                style={{ color: MATERIAS[slug].cor }}
              >
                {MATERIAS[slug].nome}
              </li>
            ))}
          </ul>
          <p className="text-[length:var(--t-mini)] text-[var(--ink-faint)] mt-1">
            O acervo cresce a cada etapa.
          </p>
        </div>
      </div>
    </section>
  )
}

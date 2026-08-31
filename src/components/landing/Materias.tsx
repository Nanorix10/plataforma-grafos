import { MATERIAS } from '@/lib/materias'
import { ASSUNTOS, PROCESSOS_DA_MATERIA } from '@/lib/assuntos'

/**
 * A vitrine do acervo.
 *
 * **O que esta seção precisa provar não mudou no redesenho de 31/08:** que há
 * conteúdo atrás dos nomes. Listar doze disciplinas é categoria; listar "Leis
 * de Newton, Trabalho e energia, Gravitação" é verificável, e é a diferença
 * entre dizer que existe Física e mostrar Física. Por isso cada linha continua
 * trazendo os assuntos de `lib/assuntos.ts`.
 *
 * O que mudou é a forma: os cartões com faixa de cor viraram linhas com
 * filete, que é a gramática da página. A cor deixou de ser área e voltou a ser
 * o nome — o que aliás alinha esta seção com o resto do site, onde a regra
 * (decisão 4c) é que a cor da matéria pinta o TÍTULO.
 *
 * **A cor nunca é a única pista**, e aqui ela nem precisa ser: o nome da
 * matéria está escrito ao lado, que é o que a regra do `lib/materias.ts` pede.
 *
 * A última linha nomeia as matérias que ficaram fora da lista de assuntos. Sem
 * ela a seção fecha como se aquelas fossem todas as que existem — e "e outras"
 * deixaria o aluno adivinhando se a dele está entre elas, que é exatamente a
 * dúvida que faz alguém fechar a aba.
 */

const SLUGS = Object.keys(MATERIAS) as (keyof typeof MATERIAS)[]
const COM_ASSUNTOS = SLUGS.filter((slug) => (ASSUNTOS[slug]?.length ?? 0) > 0)
const SEM_ASSUNTOS = SLUGS.filter((slug) => (ASSUNTOS[slug]?.length ?? 0) === 0)

export default function Materias() {
  return (
    <section id="materias" className="py-[var(--ritmo-secao)] max-w-[1240px] mx-auto px-6 sm:px-10">
      <div className="grid gap-6 mb-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">o que tem dentro</p>
        <h2 className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)]" data-atraso="1">
          uma pasta por matéria, e <em>cada uma tem a cor dela</em> no site inteiro.
        </h2>
        <p className="reveal text-[var(--ink-dim)] max-w-[62ch] leading-relaxed" data-atraso="2">
          título, cartão e nó do mapa saem sempre na cor da própria matéria — e o nome vem junto do
          ponto colorido em todo lugar, porque cor nunca é a única pista.
        </p>
      </div>

      <div className="grid border-t border-[var(--line)]">
        {COM_ASSUNTOS.map((slug) => {
          const materia = MATERIAS[slug]
          return (
            <article
              key={slug}
              className="reveal grid gap-2 py-6 border-b border-[var(--line)] md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10 md:items-baseline"
            >
              <h3
                className="flex items-center gap-3 text-[1.375rem] font-normal lowercase leading-snug"
                style={{ color: materia.cor }}
              >
                <span
                  className="w-[9px] h-[9px] rounded-full shrink-0"
                  style={{ background: materia.cor }}
                  aria-hidden="true"
                />
                {materia.nome}
              </h3>
              <div className="grid gap-1">
                <p className="text-[var(--ink-dim)] text-[0.95rem] leading-relaxed">
                  {ASSUNTOS[slug].join(' · ')}
                </p>
                {PROCESSOS_DA_MATERIA[slug] && (
                  <p className="rotulo">{PROCESSOS_DA_MATERIA[slug]}</p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {SEM_ASSUNTOS.length > 0 && (
        <p className="reveal mt-8 text-[var(--ink-faint)] text-[0.9rem] leading-relaxed max-w-[62ch]">
          também no acervo:{' '}
          {SEM_ASSUNTOS.map((slug) => MATERIAS[slug].nome).join(', ')}.
        </p>
      )}
    </section>
  )
}

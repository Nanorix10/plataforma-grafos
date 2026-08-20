import { DEPOIMENTOS } from '@/lib/depoimentos'

/**
 * O que alunos reais disseram.
 *
 * **Devolve `null` enquanto a lista estiver vazia**, e é aí que está a decisão:
 * a seção não existe na página em vez de aparecer como um bloco vazio, ou —
 * muito pior — preenchida com depoimento de exemplo.
 *
 * Esta landing vende a reputação do autor. Depoimento inventado numa página que
 * usa reputação como argumento não é placeholder, é a destruição do argumento;
 * e não tem como desinventar depois que um aluno percebe que o colega citado não
 * existe. Ver o cabeçalho de `lib/depoimentos.ts` para o que um depoimento
 * precisa ter antes de entrar.
 *
 * Quando houver dois ou mais, a grade se ajusta sozinha por `auto-fit` — sem
 * breakpoint, e sem forçar três colunas quando só há dois textos.
 */
export default function Depoimentos() {
  if (!DEPOIMENTOS.length) return null

  return (
    <section
      id="depoimentos"
      className="py-[var(--ritmo-secao)] max-w-[1120px] mx-auto px-8"
    >
      <div className="max-w-[520px] mb-11">
        <div className="rotulo-secao mb-3">Quem já usou</div>
        <h2 className="text-[length:var(--t-titulo)] font-medium">
          O que os alunos do ano passado disseram.
        </h2>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {DEPOIMENTOS.map((d) => (
          <figure
            key={d.nome}
            className="bg-[var(--raised)] rounded-[var(--raio)] p-6 shadow-[var(--sombra)] flex flex-col gap-4"
          >
            <blockquote className="text-[length:var(--t-base)] leading-relaxed text-[var(--ink-soft)]">
              {d.texto}
            </blockquote>
            <figcaption className="mt-auto">
              <div className="font-medium text-[length:var(--t-peq)]">{d.nome}</div>
              <div className="text-[length:var(--t-mini)] text-[var(--ink-faint)]">
                {d.contexto}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

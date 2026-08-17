import { FAQ_PUBLICO } from '@/lib/faq'

/**
 * As perguntas que decidem a compra, logo depois do preço — que é onde a
 * objeção nasce.
 *
 * **Usa `<details>`/`<summary>`, e isso não é só economia de JavaScript.** É o
 * mesmo gesto que o produto já usa na questão resolvida (decisão 9b): a
 * resposta fica escondida até a pessoa querer. Quem chega pela landing aprende
 * aqui o gesto que vai usar lá dentro, e a página não precisa de estado nem de
 * `'use client'` para isso.
 *
 * Abre e fecha sem JavaScript nenhum — então funciona antes da hidratação, ao
 * contrário de um acordeão feito à mão. Numa página onde a interatividade
 * demora até 1,8s para chegar, isso é a diferença entre responder ao primeiro
 * toque e não responder.
 *
 * Só as perguntas com resposta de verdade chegam aqui (`FAQ_PUBLICO`). As que
 * dependem de política ainda não escrita ficam em `lib/faq.ts`, fora da tela.
 */
export default function Faq() {
  if (!FAQ_PUBLICO.length) return null

  return (
    <section
      id="duvidas"
      className="pb-[var(--ritmo-secao)] max-w-[760px] mx-auto px-8"
    >
      <div className="mb-9">
        <div className="rotulo-secao mb-3">Dúvidas</div>
        <h2 className="text-[length:var(--t-titulo)] font-medium">
          O que costumam perguntar antes de assinar.
        </h2>
      </div>

      <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {FAQ_PUBLICO.map((d) => (
          <details key={d.pergunta} className="group">
            {/* `list-none` + `[&::-webkit-details-marker]:hidden` tiram o
                triângulo padrão nos dois motores; o sinal fica sendo o `+` à
                direita, que gira ao abrir. */}
            <summary className="flex items-center justify-between gap-4 cursor-pointer py-4 text-[length:var(--t-base)] font-medium list-none [&::-webkit-details-marker]:hidden rounded-[var(--raio-peq)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]">
              {d.pergunta}
              <span
                aria-hidden="true"
                className="shrink-0 text-[var(--acento)] text-lg leading-none transition-transform duration-150 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-sm text-[var(--ink-dim)] leading-relaxed pb-5 max-w-[65ch]">
              {d.resposta}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

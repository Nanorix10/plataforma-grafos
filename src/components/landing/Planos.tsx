import Link from 'next/link'
import {
  AVISO_SEM_PRECO,
  INCLUI_SEMPRE,
  PLANOS_A_VENDA,
  PRECOS_ANUNCIADOS,
  precoLegivel,
} from '@/lib/planos'

/**
 * A vitrine de planos.
 *
 * **A afirmação que a seção existe para fazer:** o plano escolhe quais PROVAS
 * abrem, nunca quais funções. É o princípio 3 do `PRODUCT.md`, e esconder isso
 * venderia mais no primeiro mês e geraria pedido de reembolso no segundo. Por
 * isso o `INCLUI_SEMPRE` vem logo abaixo dos três cartões, e não num rodapé
 * que ninguém lê.
 *
 * **Nada de preço é escrito aqui.** `precoLegivel` devolve "A definir"
 * enquanto `preco` for `null`, e o `AVISO_SEM_PRECO` explica o que isso
 * significa para quem está decidindo — que criar conta agora é de graça e não
 * gera cobrança. Os dois somem sozinhos quando o preço entrar em
 * `lib/planos.ts`; nenhuma tela precisa lembrar de os tirar.
 *
 * O selo do cartão em destaque também sai do arquivo, e diz "Mais completo" e
 * não "Mais escolhido" — não há um aluno pagante sequer, e popularidade sem
 * dado atrás é exatamente o tipo de afirmação que esta página não faz.
 */
export default function Planos() {
  return (
    <section id="planos" className="py-[var(--ritmo-secao)] envelope">
      <div className="grid gap-6 mb-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">acesso</p>
        <h2 className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)]" data-atraso="1">
          o plano escolhe <em>quais provas</em> abrem. nunca quais funções.
        </h2>
        <p className="reveal text-[var(--ink-dim)] max-w-[62ch] leading-relaxed" data-atraso="2">
          ninguém compra o mais caro para destravar recurso — compra porque presta mais de uma
          prova. os três entregam exatamente as mesmas funções.
        </p>
      </div>

      <div className="reveal grid gap-px bg-[var(--line)] border border-[var(--line)] lg:grid-cols-3">
        {PLANOS_A_VENDA.map((plano) => (
          <article
            key={plano.slug}
            className={`grid gap-5 content-start p-[clamp(1.75rem,3.5vw,2.5rem)] transition-colors duration-200 ${
              plano.selo
                ? 'bg-[var(--paper)] shadow-[inset_0_0_0_1px_var(--acento)]'
                : 'bg-[var(--page)] hover:bg-[var(--paper)]'
            }`}
          >
            <span
              className={`rotulo justify-self-start border px-2 py-1 text-[var(--acento)] border-[var(--acento)] ${
                plano.selo ? '' : 'invisible'
              }`}
            >
              {plano.selo ?? '—'}
            </span>

            <h3 className="declaracao text-[clamp(1.5rem,2.6vw,2.125rem)]">{plano.nome}</h3>

            <p className="text-[var(--ink-dim)] text-[0.92rem] leading-relaxed min-h-[4.5em]">
              {plano.paraQuem}
            </p>

            <ul className="grid gap-2">
              {plano.processosLegiveis.split(' · ').map((nome) => (
                <li key={nome} className="flex gap-2.5 text-[0.9rem] text-[var(--ink-dim)]">
                  <span className="text-[var(--acento)] shrink-0" aria-hidden="true">
                    —
                  </span>
                  {nome}
                </li>
              ))}
            </ul>

            <p className="rotulo border-t border-[var(--line)] pt-4">
              {precoLegivel(plano.preco)}
            </p>
          </article>
        ))}
      </div>

      {!PRECOS_ANUNCIADOS && (
        <div className="reveal mt-10 grid gap-2 max-w-[62ch]">
          <b className="font-normal text-[1.375rem] lowercase leading-snug text-[var(--ink)]">
            {AVISO_SEM_PRECO.titulo}
          </b>
          <p className="text-[var(--ink-dim)] text-[0.95rem] leading-relaxed">
            {AVISO_SEM_PRECO.texto}
          </p>
        </div>
      )}

      <div className="mt-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">em todos os planos, sem exceção</p>
        <ul className="reveal grid gap-3 mt-7 md:grid-cols-2 md:gap-x-12">
          {INCLUI_SEMPRE.map((item) => (
            <li key={item} className="flex gap-3 text-[0.92rem] text-[var(--ink-dim)]">
              <span className="text-[var(--ok)] shrink-0" aria-hidden="true">
                +
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Link href="/planos" className="chamada reveal inline-flex items-center gap-6 mt-14 no-underline">
        <span className="rotulo">ver a cobertura prova por prova</span>
        <span className="seta w-[58px] h-[58px] rounded-full grid place-items-center shrink-0">
          <svg viewBox="0 0 26 10" className="w-[26px] h-[10px] block" aria-hidden="true">
            <path
              d="M0,5 L24,5 M19,1 L24,5 L19,9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </section>
  )
}

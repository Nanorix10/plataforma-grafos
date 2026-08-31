import { FAQ_PUBLICO } from '@/lib/faq'

/**
 * As dúvidas que travam a compra.
 *
 * **A seção se recompõe sozinha.** `FAQ_PUBLICO` já é `FAQ` filtrado pelas
 * perguntas que TÊM resposta — resposta pela metade sobre reembolso é pior que
 * pergunta ausente, porque o comprador lê como evasiva justamente no ponto em
 * que está decidindo confiar. Se todas as respostas saírem, a seção some
 * inteira em vez de aparecer vazia.
 *
 * `<details>` e `<summary>` nativos, sem estado em React: abrir e fechar não
 * precisa de JavaScript, e o teclado e o leitor de tela já sabem o que fazer
 * com eles. O `+` e o `–` são `::after` no CSS da própria página.
 */
export default function Faq() {
  if (FAQ_PUBLICO.length === 0) return null

  return (
    <section className="py-[var(--ritmo-secao)] envelope">
      <div className="grid gap-6 mb-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">antes de assinar</p>
        <h2 className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)]" data-atraso="1">
          o que costuma travar.
        </h2>
      </div>

      <div className="reveal border-t border-[var(--line)]">
        {FAQ_PUBLICO.map((duvida) => (
          <details key={duvida.pergunta} className="border-b border-[var(--line)] group">
            <summary className="flex items-baseline justify-between gap-8 py-6 cursor-pointer list-none text-[1.375rem] lowercase text-[var(--ink)] transition-colors duration-200 hover:text-[var(--acento)] [&::-webkit-details-marker]:hidden">
              {duvida.pergunta}
              <span
                className="text-[var(--acento)] text-[1.375rem] leading-none shrink-0 after:content-['+'] group-open:after:content-['–']"
                aria-hidden="true"
              />
            </summary>
            <p className="text-[var(--ink-dim)] text-[0.95rem] leading-relaxed max-w-[70ch] mb-6">
              {duvida.resposta}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

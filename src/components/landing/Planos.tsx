import Link from 'next/link'
import { PLANOS_A_VENDA, precoLegivel } from '@/lib/planos'

/**
 * A vitrine de planos. Tudo o que ela mostra sai de `lib/planos.ts` — nome,
 * processos e preço. Nada é escrito à mão aqui.
 *
 * Duas coisas que a seção NÃO faz, e que são decisão:
 *
 * - **Não mostra preço inventado.** Enquanto `preco` for `null`, sai
 *   "A definir". Um `R$ 00` no lugar parece decidido e barato ao mesmo tempo,
 *   que é o pior jeito de mentir numa vitrine.
 * - **Não diz "Assinar".** Quem clica em Assinar espera pagar; o que existe
 *   hoje é um cadastro, e a liberação é manual depois do Pix (decisão 1b).
 *   O botão volta a dizer "Assinar" no dia em que o webhook do Mercado Pago
 *   fizer isso ser verdade — e a mudança acontece aqui, num lugar só.
 */
export default function Planos() {
  return (
    <section
      id="planos"
      className="pb-[var(--ritmo-secao)] max-w-[1120px] mx-auto px-8"
    >
      <div className="max-w-[520px] mb-11">
        <div className="rotulo-secao mb-3">Planos</div>
        <h2 className="text-[length:var(--t-titulo)] font-medium">
          Escolha o acesso pelo processo seletivo que você está fazendo.
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {PLANOS_A_VENDA.map((p) => (
          <div
            key={p.slug}
            className={`bg-[var(--raised)] rounded-[var(--raio)] p-7 flex flex-col gap-[1.125rem] ${
              p.destaque ? 'shadow-[var(--sombra-alta)]' : 'shadow-[var(--sombra)]'
            }`}
          >
            {p.destaque && (
              <span className="self-start rotulo-secao border border-[var(--acento)] text-[var(--acento)] rounded-[var(--raio-peq)] px-2 py-0.5">
                Mais escolhido
              </span>
            )}
            <div>
              <div className="font-medium text-[length:var(--t-medio)]">{p.nome}</div>
              <div className="text-[length:var(--t-mini)] text-[var(--ink-faint)] mt-0.5">
                {p.processosLegiveis}
              </div>
            </div>
            <div className="text-[length:var(--t-titulo)] font-medium">
              {precoLegivel(p.preco)}
              {p.preco !== null && (
                <span className="text-[length:var(--t-peq)] text-[var(--ink-faint)] font-normal">
                  /mês
                </span>
              )}
            </div>
            <Link
              href="/login"
              className={`botao mt-auto w-full ${
                p.destaque ? 'botao-primario' : 'botao-neutro'
              }`}
            >
              Criar conta
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

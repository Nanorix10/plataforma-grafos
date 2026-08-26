import Link from 'next/link'
import {
  PLANOS_A_VENDA,
  PRECOS_ANUNCIADOS,
  AVISO_SEM_PRECO,
  precoLegivel,
} from '@/lib/planos'

/**
 * A vitrine de planos. Tudo o que ela mostra sai de `lib/planos.ts` — nome,
 * processos, preço e selo. Nada é escrito à mão aqui.
 *
 * Três coisas que a seção NÃO faz, e que são decisão:
 *
 * - **Não mostra preço inventado.** Enquanto `preco` for `null`, o cartão não
 *   exibe linha de preço nenhuma e a seção assume o estado por inteiro (ver
 *   abaixo). Um `R$ 00` no lugar parece decidido e barato ao mesmo tempo, que
 *   é o pior jeito de mentir numa vitrine.
 * - **Não diz "Assinar".** Quem clica em Assinar espera pagar; o que existe
 *   hoje é um cadastro, e a liberação é manual depois do Pix (decisão 1b).
 *   O botão volta a dizer "Assinar" no dia em que o webhook do Mercado Pago
 *   fizer isso ser verdade — e a mudança acontece aqui, num lugar só.
 * - **Não afirma popularidade.** O selo do cartão em destaque vem do
 *   `selo` do plano e fala de cobertura, não de escolha de aluno. Ver o
 *   campo em `lib/planos.ts` para o porquê.
 *
 * ---
 *
 * **O aviso de preço substitui as três não-respostas, e isso é o ponto.**
 * Antes os três cartões diziam "A definir" cada um, e o visitante saía da
 * seção sem saber quanto custa, sem saber o que o botão faz e sem saber que a
 * conta nasce sem acesso. A resposta existia — é a primeira do FAQ —, mas
 * fechada num acordeão DEPOIS do momento em que ela decide a compra.
 *
 * Repetir a mesma não-resposta três vezes não informa três vezes mais: informa
 * que a página não está pronta. Dita uma vez, no lugar certo, ela vira o
 * estado declarado de um produto que ainda não abriu — que é a verdade.
 */
export default function Planos() {
  return (
    <section
      id="planos"
      className="pb-[var(--ritmo-secao)] max-w-[1120px] mx-auto px-8"
    >
      <div className="max-w-[520px] mb-8">
        <div className="rotulo-secao mb-3">Planos</div>
        <h2 className="text-[length:var(--t-titulo)] font-medium mb-3">
          Escolha o acesso pelo processo seletivo que você está fazendo.
        </h2>
        {/* A comparação completa é página própria. Os cartões ficam aqui
            porque preço é o que mais decide e esconder isso da página
            inicial custaria mais do que a rolagem extra. */}
        <Link
          href="/planos"
          className="text-sm text-[var(--acento)] underline underline-offset-[3px] hover:text-[var(--acento-claro)]"
        >
          Ver a comparação completa
        </Link>
      </div>

      {!PRECOS_ANUNCIADOS && (
        /* Contornado e sem preenchimento, como o resto do sistema: é a
           filosofia do `identidade-visual.md`, e aqui ela também impede que o
           aviso vire um quarto cartão na fileira logo abaixo. Borda de 1px em
           volta inteira, não uma tarja lateral grossa. */
        <div className="mb-9 max-w-[640px] rounded-[var(--raio)] border border-[var(--line-forte)] p-5">
          <p className="text-[length:var(--t-base)] font-medium mb-1.5">
            {AVISO_SEM_PRECO.titulo}
          </p>
          <p className="text-[length:var(--t-peq)] text-[var(--ink-dim)] leading-relaxed">
            {AVISO_SEM_PRECO.texto}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {PLANOS_A_VENDA.map((p) => (
          <div
            key={p.slug}
            className={`bg-[var(--raised)] rounded-[var(--raio)] p-7 flex flex-col gap-[1.125rem] ${
              p.selo ? 'shadow-[var(--sombra-alta)]' : 'shadow-[var(--sombra)]'
            }`}
          >
            {p.selo && (
              <span className="self-start rotulo-secao border border-[var(--acento)] text-[var(--acento)] rounded-[var(--raio-peq)] px-2 py-0.5">
                {p.selo}
              </span>
            )}
            <div>
              <div className="font-medium text-[length:var(--t-medio)]">{p.nome}</div>
              <div className="text-[length:var(--t-mini)] text-[var(--ink-faint)] mt-0.5">
                {p.processosLegiveis}
              </div>
            </div>
            {/* Sem preço anunciado o cartão simplesmente não tem linha de
                preço: quem responde por todos é o aviso acima. Repeti-lo aqui
                devolveria as três não-respostas que ele veio substituir. */}
            {p.preco !== null && (
              <div className="text-[length:var(--t-titulo)] font-medium">
                {precoLegivel(p.preco)}
                <span className="text-[length:var(--t-peq)] text-[var(--ink-faint)] font-normal">
                  /mês
                </span>
              </div>
            )}
            <Link
              href="/login"
              className={`botao mt-auto w-full ${
                p.selo ? 'botao-primario' : 'botao-neutro'
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

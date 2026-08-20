import Link from 'next/link'
import type { Metadata } from 'next'
import { PLANOS_A_VENDA, INCLUI_SEMPRE, precoLegivel } from '@/lib/planos'
import { PROCESSOS } from '@/lib/processos'

export const metadata: Metadata = {
  title: 'Planos — Plataforma Grafos',
  description:
    'Escolha o acesso pelo processo seletivo que você presta: PASSE UFMS, PAS UEM ou PAS UnB.',
}

/**
 * A página de planos.
 *
 * Antes "Planos" no menu era uma âncora que rolava para o fim da landing e
 * acabava ali — sem espaço para comparar, sem dizer para quem cada um serve, e
 * sem caminho de volta. Agora é página, e ela herda a barra e o rodapé do
 * `(site)/layout.tsx` de graça: foi exatamente para isto que aquele route group
 * foi criado.
 *
 * **A tese da página é que os planos NÃO diferem em recurso, só em cobertura.**
 * Isso é verdade no produto e é a informação mais útil que um comprador pode
 * receber aqui — ninguém compra o mais caro para destravar uma função, compra
 * porque presta mais de uma prova. A tabela existe para mostrar isso de uma
 * vez, e é por isso que ela tem uma coluna de "todos" em vez de repetir os
 * mesmos itens três vezes com visto verde.
 *
 * Tudo vem de `lib/planos.ts`. Nada de nome, cobertura ou preço escrito à mão
 * aqui — quando o preço for decidido, esta página se completa sozinha.
 */
export default function PlanosPage() {
  return (
    <div className="max-w-[860px] mx-auto px-8 py-[var(--ritmo-secao)]">
      {/* O caminho de volta. Página que se alcança pelo menu precisa de saída
          própria: quem chegou por link direto não tem "voltar" do navegador
          para lugar nenhum útil. */}
      <Link
        href="/"
        /* `py-2 -ml-1 px-1` existe pelo alvo de toque, nao pelo desenho: sem
           isso o link media 182x21 e ficava ABAIXO do minimo de 24px da WCAG
           2.2 (critério 2.5.8). O recuo negativo devolve o alinhamento visual
           que o padding tirou. */
        className="inline-flex items-center gap-1.5 py-2 px-1 -ml-1 text-[length:var(--t-peq)] text-[var(--ink-faint)] hover:text-[var(--ink)] mb-9 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
      >
        <span aria-hidden="true">←</span> Voltar para a página inicial
      </Link>

      <div className="max-w-[60ch] mb-11">
        <div className="rotulo-secao mb-3">Planos</div>
        <h1 className="text-[length:var(--t-titulo)] font-medium mb-4">
          Escolha pelo vestibular que você presta.
        </h1>
        <p className="text-[var(--ink-dim)] leading-relaxed">
          Os três planos entregam exatamente as mesmas coisas. O que muda entre
          eles é <strong className="font-medium text-[var(--ink)]">quais provas</strong> o
          seu acesso cobre — nada fica trancado atrás do plano mais caro.
        </p>
      </div>

      {/* ---- os três, com para-quem ---- */}
      <div className="grid md:grid-cols-3 gap-4 mb-14">
        {PLANOS_A_VENDA.map((p) => (
          <div
            key={p.slug}
            className={`bg-[var(--raised)] rounded-[var(--raio)] p-6 flex flex-col gap-4 ${
              p.destaque ? 'shadow-[var(--sombra-alta)]' : 'shadow-[var(--sombra)]'
            }`}
          >
            {p.destaque && (
              <span className="self-start rotulo-secao border border-[var(--acento)] text-[var(--acento)] rounded-[var(--raio-peq)] px-2 py-0.5">
                Mais escolhido
              </span>
            )}
            <div>
              <h2 className="font-medium text-[length:var(--t-medio)]">{p.nome}</h2>
              <p className="text-[length:var(--t-mini)] text-[var(--ink-faint)] mt-1">
                {p.processosLegiveis}
              </p>
            </div>

            <div className="text-[length:var(--t-titulo)] font-medium">
              {precoLegivel(p.preco)}
              {p.preco !== null && (
                <span className="text-[length:var(--t-peq)] text-[var(--ink-faint)] font-normal">
                  /mês
                </span>
              )}
            </div>

            <p className="text-[length:var(--t-peq)] text-[var(--ink-dim)] leading-relaxed border-t border-[var(--line)] pt-4">
              {p.paraQuem}
            </p>

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

      {/* ---- o que todo plano inclui ---- */}
      <section className="mb-14">
        <h2 className="text-[length:var(--t-grande)] font-medium mb-2">
          O que vem em todos eles
        </h2>
        <p className="text-[length:var(--t-peq)] text-[var(--ink-faint)] mb-6 max-w-[60ch]">
          Sem exceção e sem letra miúda: a lista abaixo vale igual nos três.
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {INCLUI_SEMPRE.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[length:var(--t-base)]">
              <span aria-hidden="true" className="text-[var(--ok)] mt-0.5 shrink-0">
                ✓
              </span>
              <span className="text-[var(--ink-dim)]">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- a única diferença, numa tabela ---- */}
      <section className="mb-14">
        <h2 className="text-[length:var(--t-grande)] font-medium mb-2">
          A única diferença
        </h2>
        <p className="text-[length:var(--t-peq)] text-[var(--ink-faint)] mb-6 max-w-[60ch]">
          Quais processos seletivos cada plano abre.
        </p>
        {/* `overflow-x-auto` no invólucro: a tabela é a coisa mais larga da
            página, e sem isto ela empurraria o corpo inteiro para o lado no
            celular. */}
        <div className="overflow-x-auto rounded-[var(--raio)] shadow-[var(--sombra)]">
          <table className="relative w-full border-collapse text-[length:var(--t-base)] bg-[var(--raised)]">
            <caption className="sr-only">
              Processos seletivos cobertos por cada plano
            </caption>
            <thead>
              <tr>
                <th scope="col" className="text-left font-medium p-4 border-b border-[var(--line)]">
                  Processo seletivo
                </th>
                {PLANOS_A_VENDA.map((p) => (
                  <th
                    key={p.slug}
                    scope="col"
                    className="font-medium p-4 border-b border-[var(--line)] whitespace-nowrap"
                  >
                    {p.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(PROCESSOS).map(([slug, proc]) => (
                <tr key={slug}>
                  <th
                    scope="row"
                    className="text-left font-normal text-[var(--ink-dim)] p-4 border-b border-[var(--line)]"
                  >
                    {proc.nome}
                  </th>
                  {PLANOS_A_VENDA.map((p) => {
                    const tem = p.processos.includes(slug)
                    return (
                      <td
                        key={p.slug}
                        /* `relative` é obrigatório e não é enfeite: o
                           `sr-only` abaixo é `position: absolute`, e sem um
                           ancestral posicionado ele se resolve contra o bloco
                           raiz da página — acompanha a tabela para fora do
                           invólucro e estica a rolagem horizontal do documento
                           inteiro. Medido: 103px de rolagem lateral em 390px,
                           que o `overflow-x-auto` do invólucro não pegava
                           porque o elemento tinha escapado do fluxo dele. */
                        className="relative text-center p-4 border-b border-[var(--line)]"
                      >
                        {/* O estado vai por TEXTO no leitor de tela, não só por
                            símbolo: "✓" sozinho é anunciado como "marca de
                            verificação" ou como nada, dependendo do leitor. */}
                        <span className={tem ? 'text-[var(--ok)]' : 'text-[var(--ink-faint)]'}>
                          <span aria-hidden="true">{tem ? '✓' : '—'}</span>
                          <span className="sr-only">
                            {tem ? 'incluído' : 'não incluído'}
                          </span>
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- como o acesso funciona hoje ---- */}
      <section className="bg-[var(--panel)] rounded-[var(--raio)] p-6 max-w-[62ch]">
        <h2 className="text-[length:var(--t-base)] font-medium mb-2">
          Como o acesso é liberado
        </h2>
        {/* Diz o que ACONTECE hoje, e não o que seria bonito prometer. A
            liberação é manual depois do Pix (decisão 1b do CONTEXTO.md); quando
            o webhook do Mercado Pago existir, este parágrafo muda junto. */}
        <p className="text-[length:var(--t-peq)] text-[var(--ink-dim)] leading-relaxed">
          Você cria sua conta aqui no site e nos avisa do pagamento. A liberação
          é feita por nós e o acesso aparece na sua conta — nada é enviado por
          e-mail ou WhatsApp, porque o material vive no site e é lá que você lê.
        </p>
      </section>
    </div>
  )
}

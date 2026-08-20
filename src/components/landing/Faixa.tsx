import { NUMEROS_DA_FAIXA } from '@/lib/numeros'

/**
 * A única superfície saturada do site inteiro — azul-marinho nos dois temas
 * (ver decisão 4b). Existe para quebrar a sequência de seções iguais no meio
 * da rolagem; sem ela a landing lê como uma parede só.
 *
 * É também o único elemento em `--faixa` da página, e tem que continuar sendo:
 * a regra é no máximo um por tela. Dois pontos gritando na mesma rolagem
 * anulam um ao outro.
 *
 * ---
 *
 * **O que ela diz mudou, e o motivo é que quatro números não diziam nada.**
 * `24 · 3 · 180+ · Campo Grande` em corpo grande com rótulo pequeno é a forma
 * que toda landing usa, e por isso não é lida: o visitante reconhece o padrão
 * e pula. Os números continuam aqui — a decisão de anunciá-los é do Leandro e
 * está tomada (ver `lib/numeros.ts`) —, mas voltaram ao tamanho de texto e
 * viraram uma linha de fatos no rodapé da faixa, que é o peso que eles têm.
 *
 * **No lugar deles entrou a coisa mais específica deste mundo: o seriado.**
 * PASSE, PAS UEM e PAS UnB são feitos etapa por etapa ao longo dos três anos
 * do ensino médio — o aluno não está estudando para uma prova, está num
 * percurso de três anos. Quase todo concorrente vende prova única e não tem
 * como dizer isto. É o argumento que a faixa passa a carregar.
 *
 * **Não há promessa nova aqui.** Que o acervo é organizado por processo e por
 * etapa já é afirmado no FAQ (`lib/faq.ts`), e "revisado a cada etapa" já está
 * em `lib/autor.ts`. As três frases descrevem o produto que já existe — os
 * resumos interligados e o mapa —, não um conteúdo por série que ninguém
 * cadastrou.
 *
 * O eixo com os três pontos é decorativo e vai `aria-hidden`: quem usa leitor
 * de tela recebe a sequência pela ordem dos itens da lista, que é a mesma
 * informação sem o desenho.
 */

/** As três etapas do seriado, na ordem em que o aluno as vive. */
const ETAPAS = [
  {
    serie: '1ª série',
    etapa: '1ª etapa',
    texto:
      'Você começa a acumular. Cada resumo já nasce ligado aos que vêm nas próximas etapas.',
  },
  {
    serie: '2ª série',
    etapa: '2ª etapa',
    texto:
      'O conteúdo novo encosta no antigo — e a ligação entre os dois já está escrita, não é você que precisa lembrar dela.',
  },
  {
    serie: '3ª série',
    etapa: '3ª etapa',
    texto:
      'Revisar as três de uma vez, andando pelo mapa, em vez de reler três pilhas separadas.',
  },
] as const

export default function Faixa() {
  return (
    <section className="bg-[var(--faixa)] py-16">
      <div className="max-w-[1120px] mx-auto px-8">
        <h2 className="text-[length:var(--t-titulo)] font-medium text-[var(--faixa-ink)] max-w-[30ch] mb-12">
          Três anos, três etapas, um acervo só.
        </h2>

        <ol className="grid md:grid-cols-3 gap-x-10 gap-y-9">
          {ETAPAS.map((e, i) => (
            <li key={e.serie}>
              {/* O eixo: ponto cheio e a linha que sai dele para o próximo.
                  A linha NÃO é desenhada na última etapa — senão a terceira
                  terminaria apontando para fora da faixa, prometendo uma
                  quarta que não existe. É condicional no índice e não um
                  `last:hidden`, porque o alvo é um filho do `li` e não o `li`.
                  O eixo inteiro some abaixo de `md`, onde as três empilham e
                  uma linha horizontal ligaria itens que já não estão lado a
                  lado. */}
              <div
                aria-hidden="true"
                className="hidden md:flex items-center gap-3 mb-5"
              >
                <span className="w-[9px] h-[9px] rounded-full bg-[var(--faixa-ink)] shrink-0" />
                {i < ETAPAS.length - 1 && (
                  <span className="h-px flex-1 bg-[var(--faixa-dim)] opacity-40" />
                )}
              </div>

              <div className="flex items-baseline gap-2.5 mb-2">
                <span className="text-[length:var(--t-medio)] font-medium text-[var(--faixa-ink)]">
                  {e.serie}
                </span>
                <span className="text-[length:var(--t-mini)] uppercase tracking-[0.1em] text-[var(--faixa-dim)]">
                  {e.etapa}
                </span>
              </div>
              <p className="text-[length:var(--t-peq)] leading-relaxed text-[var(--faixa-dim)] max-w-[34ch]">
                {e.texto}
              </p>
            </li>
          ))}
        </ol>

        {/* Os números da decisão do Leandro, agora em tamanho de texto. Ficam
            depois das etapas porque é essa a ordem do argumento: primeiro o
            percurso, depois o tamanho do que cobre o percurso. */}
        <ul className="mt-12 pt-7 border-t border-[var(--faixa-dim)]/25 flex flex-wrap gap-x-8 gap-y-2">
          {NUMEROS_DA_FAIXA.map((n) => (
            <li
              key={n.label}
              className="text-[length:var(--t-peq)] text-[var(--faixa-dim)]"
            >
              {/* `.numeros` é a classe do sistema para número em destaque —
                  aqui ela serve pelo `tabular-nums`, que alinha os dígitos. */}
              <span className="numeros font-medium text-[var(--faixa-ink)]">
                {n.valor}
              </span>{' '}
              {n.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

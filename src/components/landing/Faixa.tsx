import { NUMEROS_DA_FAIXA } from '@/lib/numeros'

/**
 * A única superfície saturada do site inteiro — azul-marinho nos dois temas
 * (decisão 4b). Existe para quebrar a sequência de seções iguais no meio da
 * rolagem; sem ela a landing lê como uma parede só.
 *
 * **É o único elemento em `--faixa` da página, e tem que continuar sendo.** A
 * regra é no máximo um por tela: dois pontos gritando na mesma rolagem anulam
 * um ao outro. Vale notar que a dobra NÃO conta como segundo — ela usa os
 * tokens `--dobra-*`, que são um campo próprio, e está a uma tela inteira de
 * distância.
 *
 * ---
 *
 * **O que ela argumenta é o seriado**, e essa parte não mudou no redesenho de
 * 31/08. PASSE, PAS UEM e PAS UnB são feitos etapa por etapa ao longo dos três
 * anos do ensino médio: o aluno não está estudando para uma prova, está num
 * percurso de três anos. Quase todo concorrente vende prova única e não tem
 * como dizer isto.
 *
 * **Os números vêm de `lib/numeros.ts` e NÃO são contagem do banco.** Aquele
 * arquivo tem um aviso em maiúsculas sobre isso: eles são o escopo declarado
 * da plataforma, uma decisão do Leandro, e por isso `24` convive com as 12
 * entradas de `MATERIAS` sem que nenhum dos dois esteja errado. Não derive
 * nada daqui, e não troque por contagem sem trocar lá primeiro.
 *
 * O eixo com os três pontos é decorativo e vai `aria-hidden`: quem usa leitor
 * de tela recebe a sequência pela ordem dos itens da lista.
 */

/** As três etapas do seriado, na ordem em que o aluno as vive. */
const ETAPAS = [
  {
    serie: '1ª série',
    etapa: '1ª etapa',
    texto: 'você começa a acumular. cada resumo já nasce ligado aos que vêm nas próximas etapas.',
  },
  {
    serie: '2ª série',
    etapa: '2ª etapa',
    texto:
      'o conteúdo novo encosta no antigo — e a ligação entre os dois já está escrita, não é você que precisa lembrar dela.',
  },
  {
    serie: '3ª série',
    etapa: '3ª etapa',
    texto:
      'revisar as três de uma vez, andando pelo mapa, em vez de reler três pilhas separadas.',
  },
] as const

export default function Faixa() {
  return (
    <section className="bg-[var(--faixa)] text-[var(--faixa-ink)] py-[var(--ritmo-secao)]">
      <div className="envelope">
        <p className="rotulo reveal text-[var(--faixa-dim)]">o percurso</p>
        <h2
          className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)] text-[var(--faixa-ink)] max-w-[24ch] mt-6"
          data-atraso="1"
        >
          você não está estudando para uma prova. <em className="text-[var(--faixa-dim)]">está num percurso de três anos.</em>
        </h2>

        <ol className="grid gap-x-10 gap-y-9 mt-[clamp(3rem,6vw,4.5rem)] md:grid-cols-3">
          {ETAPAS.map((e, i) => (
            <li key={e.etapa} className="reveal grid gap-3" data-atraso={String(i)}>
              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--faixa-dim)] shrink-0" />
                {i < ETAPAS.length - 1 && (
                  <span className="h-px flex-1 bg-[var(--faixa-dim)] opacity-40" />
                )}
              </div>
              <p className="rotulo text-[var(--faixa-dim)]">
                {e.serie} · {e.etapa}
              </p>
              <p className="text-[0.95rem] leading-relaxed text-[var(--faixa-dim)] max-w-[34ch]">
                {e.texto}
              </p>
            </li>
          ))}
        </ol>

        <ul className="reveal grid grid-cols-2 gap-8 mt-[clamp(3rem,6vw,4.5rem)] pt-8 border-t border-[var(--faixa-dim)]/25 md:grid-cols-4">
          {NUMEROS_DA_FAIXA.map((n) => (
            <li key={n.label} className="grid gap-2">
              <b className="font-normal text-[clamp(1.75rem,4vw,2.5rem)] leading-none tabular-nums tracking-tight text-[var(--faixa-ink)]">
                {n.valor}
              </b>
              <span className="rotulo text-[var(--faixa-dim)]">{n.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import ListaGrande, { type ItemDaLista } from './ListaGrande'

/**
 * As duas velocidades — o princípio 4 do `PRODUCT.md` dito na página de venda.
 *
 * Ali está escrito que revisar no celular e estudar no notebook são cenários
 * distintos, que nenhum dos dois é exceção, e que **toda superfície declara
 * para qual foi desenhada**. A landing nunca tinha declarado a sua, e é a
 * primeira que o aluno vê.
 *
 * O que cada coluna afirma é verificável no código, e nenhuma promete o que o
 * site não faz: o trilho de fato some abaixo de 1340px (decisão 12d) e a linha
 * do tempo de fato vira lista nas telas estreitas (decisão 12f).
 */
const VELOCIDADES: readonly ItemDaLista[] = [
  {
    rotulo: 'no celular',
    titulo: 'revisar',
    texto:
      'você abre para conferir, não para aprender do zero. lista, busca e leitura funcionam com uma mão só; a linha do tempo vira lista onde o eixo de arrastar não caberia. nada para baixar.',
  },
  {
    rotulo: 'no notebook',
    titulo: 'estudar',
    texto:
      'aqui aparece o que não cabe na tela estreita: o trilho lateral com as seções do resumo e as conexões que saem dele, e o mapa em tamanho de arrastar e dar zoom.',
  },
]

export default function Velocidades() {
  return (
    <section className="py-[var(--ritmo-secao)] envelope">
      <div className="grid gap-6 mb-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">onde você lê</p>
        <h2 className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)]" data-atraso="1">
          o mesmo conteúdo em <em>duas velocidades</em>.
        </h2>
      </div>

      <ListaGrande itens={VELOCIDADES} />
    </section>
  )
}

/**
 * A lista de tipo grande — o formato que a referência usa para enumerar o que
 * ela faz, e que aqui serve a duas seções: as quatro portas e as duas
 * velocidades.
 *
 * **É lista e não grade de cartões, e isso é a decisão.** Cartão dá a cada
 * item uma moldura e os iguala; a lista os põe numa coluna com filete entre
 * eles, e o título grande em caixa baixa é quem carrega o peso. Numa página
 * onde tudo é monoespaçado, a escala do título é a única hierarquia forte que
 * sobra — gastar isso em caixinhas seria desperdiçar o recurso.
 *
 * As três colunas (rótulo · título · explicação) viram uma só abaixo de 900px,
 * porque a do meio sozinha já ocupa a largura de um celular.
 */
export type ItemDaLista = {
  /** O rótulo em caixa alta, à esquerda. É o recorte, não um número. */
  rotulo: string
  /** O título grande, escrito em caixa baixa no fonte. */
  titulo: string
  /** Uma frase que prova o título em vez de repeti-lo. */
  texto: string
}

export default function ListaGrande({ itens }: { itens: readonly ItemDaLista[] }) {
  return (
    <div className="grid border-t border-[var(--line)]">
      {itens.map((item) => (
        <article
          key={item.titulo}
          className="reveal group grid gap-3 py-[clamp(1.75rem,3.5vw,2.75rem)] border-b border-[var(--line)] transition-[background,padding] duration-200 hover:bg-[var(--acento-fraco)] hover:pl-4 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-x-10 md:items-baseline lg:grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,24rem)]"
        >
          <p className="rotulo md:col-start-1 md:row-start-1">{item.rotulo}</p>
          <h3 className="declaracao text-[clamp(2rem,4.4vw,2.875rem)] transition-colors duration-200 group-hover:text-[var(--acento)] md:col-start-2 md:row-start-1">
            {item.titulo}
          </h3>
          {/* No passo do meio (768–1024) a explicação desce para baixo do
              título, na MESMA coluna — três colunas ali dariam ~75px ao
              título, que é menos que a palavra "revisar". Só a partir de
              1024 ela vira a terceira coluna. */}
          <p className="text-[var(--ink-dim)] text-[0.95rem] leading-relaxed md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1">
            {item.texto}
          </p>
        </article>
      ))}
    </div>
  )
}

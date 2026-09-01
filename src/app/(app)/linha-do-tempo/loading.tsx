/**
 * Espera da linha do tempo.
 *
 * Aqui o esqueleto já desenha o eixo no meio, com rótulos nos dois lados: é a
 * peça que define a tela, e vê-la aparecer antes do conteúdo é o que evita o
 * salto de layout quando os eventos chegam.
 *
 * **As medidas daqui são cópia das do componente e têm de andar com elas.**
 * `ALTURA_CARTAO` (30) e `ALTURA_FAIXA` (36) estão escritas à mão porque o
 * `loading.tsx` não pode importar de um componente de cliente só para pegar
 * dois números — mas se lá mudarem e aqui não, o esqueleto volta a mentir e o
 * salto de layout que ele existe para evitar volta junto.
 *
 * As barras não têm mais borda nem canto de cartão: o rótulo real perdeu a
 * caixa, e um esqueleto de caixas anunciaria uma tela que não vem.
 */
export default function Carregando() {
  const cima = [12, 34, 58, 80]
  const baixo = [22, 46, 70]
  const ALTURA_CARTAO = 30
  const ALTURA_FAIXA = 36

  return (
    <div className="h-[calc(100vh-3rem)] lg:h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-12 border-b border-[var(--line)]">
        <div className="esqueleto h-4 w-[120px]" />
        <div className="esqueleto h-3 w-[70px]" />
      </header>

      <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-[var(--line)]">
        {[86, 74, 92].map((l, i) => (
          <div
            key={i}
            className="esqueleto h-[26px] !rounded-[var(--raio-peq)]"
            style={{ width: l }}
          />
        ))}
      </div>

      <div className="quadro relative flex-1 min-h-0">
        {/* o eixo, na mesma posição em que o componente real o coloca */}
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[var(--line-forte)]" />

        {cima.map((x, i) => (
          <div
            key={`c${i}`}
            className="esqueleto absolute w-[130px] !rounded-[var(--raio-peq)]"
            style={{
              left: `${x}%`,
              height: ALTURA_CARTAO,
              top: `calc(50% - ${48 + (i % 2) * ALTURA_FAIXA}px)`,
            }}
          />
        ))}
        {baixo.map((x, i) => (
          <div
            key={`b${i}`}
            className="esqueleto absolute w-[130px] !rounded-[var(--raio-peq)]"
            style={{
              left: `${x}%`,
              height: ALTURA_CARTAO,
              top: `calc(50% + ${30 + (i % 2) * ALTURA_FAIXA}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

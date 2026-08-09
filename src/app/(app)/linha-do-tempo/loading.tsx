/**
 * Espera da linha do tempo.
 *
 * Aqui o esqueleto já desenha o eixo no meio, com cartões nos dois lados: é a
 * peça que define a tela, e vê-la aparecer antes do conteúdo é o que evita o
 * salto de layout quando os eventos chegam.
 */
export default function Carregando() {
  const cima = [12, 34, 58, 80]
  const baixo = [22, 46, 70]

  return (
    <div className="h-[calc(100vh-3rem)] lg:h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-12 border-b border-[var(--line)]">
        <div className="esqueleto h-4 w-[120px]" />
        <div className="esqueleto h-3 w-[70px]" />
      </header>

      <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-[var(--line)]">
        {[86, 74, 92].map((l, i) => (
          <div key={i} className="esqueleto h-[26px] !rounded-full" style={{ width: l }} />
        ))}
      </div>

      <div className="quadro relative flex-1 min-h-0">
        {/* o eixo, na mesma posição em que o componente real o coloca */}
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[var(--line-forte)]" />

        {cima.map((x, i) => (
          <div
            key={`c${i}`}
            className="esqueleto absolute h-[38px] w-[130px] !rounded-lg"
            style={{ left: `${x}%`, top: `calc(50% - ${64 + (i % 2) * 46}px)` }}
          />
        ))}
        {baixo.map((x, i) => (
          <div
            key={`b${i}`}
            className="esqueleto absolute h-[38px] w-[130px] !rounded-lg"
            style={{ left: `${x}%`, top: `calc(50% + ${30 + (i % 2) * 46}px)` }}
          />
        ))}
      </div>
    </div>
  )
}

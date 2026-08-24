/**
 * Espera do edital.
 *
 * O esqueleto desenha a FORMA da página — cabeçalho de etapa, blocos de matéria
 * e listas de tópicos —, não um "carregando" centralizado. A forma certa faz a
 * troca parecer a página chegando; a palavra faz parecer que a página sumiu
 * (decisão 9e).
 */
export default function Carregando() {
  const blocos = [
    { materias: [7, 5, 9] },
    { materias: [6, 8] },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-12 border-b border-[var(--line)]">
        <div className="esqueleto h-4 w-[60px]" />
        <div className="esqueleto h-3 w-[180px]" />
      </header>

      <div className="flex-1 px-4 sm:px-6 py-5">
        <div className="flex flex-wrap gap-1.5 mb-6">
          {[96, 82, 74].map((l, i) => (
            <div key={i} className="esqueleto h-[26px] !rounded-full" style={{ width: l }} />
          ))}
        </div>

        <div className="flex flex-col gap-10 max-w-4xl">
          {blocos.map((b, bi) => (
            <section key={bi}>
              <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-[var(--line)]">
                <div className="esqueleto h-4 w-[170px]" />
                <div className="esqueleto h-3 w-[80px]" />
              </div>
              <div className="flex flex-col gap-6">
                {b.materias.map((n, mi) => (
                  <div key={mi}>
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="esqueleto h-3.5 w-[110px]" />
                      <div className="esqueleto h-3 w-[34px]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {Array.from({ length: n }).map((_, ti) => (
                        <div key={ti} className="flex gap-2 items-center">
                          <div className="esqueleto w-[7px] h-[7px] !rounded-full shrink-0" />
                          {/* larguras irregulares: linha de tamanho igual não
                              parece texto, parece tabela */}
                          <div
                            className="esqueleto h-3"
                            style={{ width: `${38 + ((ti * 37) % 45)}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

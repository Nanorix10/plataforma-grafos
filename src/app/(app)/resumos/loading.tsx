/**
 * Espera da lista de resumos.
 *
 * O esqueleto imita a FORMA da página — cabeçalho, dois blocos de matéria, a
 * grade de cartões — e não um "carregando..." centralizado. A forma certa faz
 * a troca parecer a página chegando; a palavra faz parecer que a página sumiu.
 *
 * A barra lateral não entra aqui: ela vive no layout do grupo `(app)`, então
 * continua na tela e continua clicável enquanto isto aparece.
 */
export default function Carregando() {
  return (
    <div className="max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-11">
      <div className="esqueleto h-7 w-[190px] mb-2" />
      <div className="esqueleto h-4 w-[240px] mb-8" />

      {[0, 1].map((grupo) => (
        <section key={grupo} className="mb-9">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="esqueleto w-2 h-2 !rounded-full" />
            <div className="esqueleto h-4 w-[120px]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="esqueleto h-[62px] !rounded-lg" />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

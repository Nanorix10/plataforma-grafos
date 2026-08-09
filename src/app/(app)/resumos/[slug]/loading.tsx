/**
 * Espera do resumo.
 *
 * As larguras das linhas variam de propósito: um bloco de linhas do mesmo
 * tamanho lê como tabela, não como texto. É o que faz o esqueleto anunciar
 * "vem um resumo aqui" em vez de "vem alguma coisa aqui".
 */
export default function Carregando() {
  const linhas = [96, 88, 92, 70, 84, 90, 62]

  return (
    <>
      {/* mesma barra fina da página real, para o cabeçalho não saltar de
          altura quando o conteúdo chegar */}
      <header className="sticky top-12 lg:top-0 z-10 bg-[var(--paper)]/85 backdrop-blur border-b border-[var(--line)] px-6 md:px-10 h-12 flex items-center gap-2">
        <div className="esqueleto h-3.5 w-[70px]" />
        <span aria-hidden="true" className="text-[var(--ink-faint)]">
          /
        </span>
        <div className="esqueleto h-3.5 w-[160px]" />
      </header>

      <article className="max-w-[720px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="esqueleto h-[26px] w-[110px] !rounded-md mb-5" />
        <div className="esqueleto h-8 w-[75%] mb-8" />

        <div className="flex flex-col gap-3">
          {linhas.map((l, i) => (
            <div key={i} className="esqueleto h-4" style={{ width: `${l}%` }} />
          ))}
        </div>

        <div className="esqueleto h-5 w-[45%] mt-9 mb-3" />
        <div className="flex flex-col gap-3">
          {[92, 78, 86].map((l, i) => (
            <div key={i} className="esqueleto h-4" style={{ width: `${l}%` }} />
          ))}
        </div>
      </article>
    </>
  )
}

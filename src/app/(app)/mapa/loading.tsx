/**
 * Espera do mapa.
 *
 * O mapa é a rota mais pesada do site — carrega todos os resumos e ainda monta
 * o layout de força no navegador —, então é a que mais precisa dizer que está
 * viva. O quadriculado (`.quadro`) já aparece aqui: ele é o fundo do mapa, e
 * chegar antes faz a tela parecer montada pela metade em vez de vazia.
 */
export default function Carregando() {
  return (
    <div className="h-[calc(100vh-3rem)] lg:h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-12 border-b border-[var(--line)]">
        <div className="esqueleto h-4 w-[130px]" />
        <div className="esqueleto h-[26px] w-[150px] !rounded-md ml-auto" />
      </header>

      <div className="quadro relative flex-1 min-h-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="girando text-[var(--ink-faint)] !w-6 !h-6" aria-hidden="true" />
          <span className="text-[12.5px] text-[var(--ink-faint)]">Montando o mapa…</span>
        </div>
      </div>
    </div>
  )
}

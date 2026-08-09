/**
 * Espera de todas as telas de admin.
 *
 * Uma só para `editor`, `eventos` e `pessoas`: o `loading.tsx` de um segmento
 * também cobre os segmentos abaixo dele que não têm o próprio, e as três telas
 * abrem igual — título à esquerda, ação à direita, lista embaixo. Três arquivos
 * quase idênticos seriam três lugares para divergir.
 */
export default function Carregando() {
  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="esqueleto h-7 w-[150px]" />
        <div className="esqueleto h-9 w-[140px] !rounded-lg ml-auto" />
      </div>

      <div className="flex flex-col gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="esqueleto h-[52px] !rounded-lg" />
        ))}
      </div>
    </div>
  )
}

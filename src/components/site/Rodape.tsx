import Marca from '@/components/Marca'

/** O rodapé das páginas públicas. Mesma razão da `NavPublica`: é moldura do site, não da landing. */
export default function Rodape() {
  return (
    <footer className="py-9 max-w-[1120px] mx-auto px-8 flex justify-between flex-wrap gap-3 shadow-[inset_0_1px_0_var(--line)]">
      <Marca tamanho="medio" />
      <p className="text-[var(--t-peq)] text-[var(--ink-faint)]">
        Material próprio, revisado por edital · Campo Grande — MS
      </p>
    </footer>
  )
}

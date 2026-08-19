import { Atual, VarianteA, VarianteB, VarianteC, VarianteD } from '@/components/landing/acervo/Variantes'

/**
 * Página TEMPORÁRIA de comparação do acervo.
 *
 * Existe só para o Davi decidir vendo, em vez de lendo. Sai do repositório
 * junto com as variantes que não forem escolhidas.
 */
export default function AcervoTeste() {
  return (
    <div className="max-w-[1120px] mx-auto px-8 py-12 flex flex-col gap-16">
      <div>
        <h1 className="text-[length:var(--t-titulo)] font-medium mb-2">
          Acervo — quatro caminhos
        </h1>
        <p className="text-[var(--ink-dim)] max-w-[70ch]">
          Página temporária. Compare e escolha; o que não for escolhido some.
        </p>
      </div>
      <Atual />
      <VarianteA />
      <VarianteB />
      <VarianteC />
      <VarianteD />
    </div>
  )
}

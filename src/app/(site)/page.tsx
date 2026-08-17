import Hero from '@/components/landing/Hero'
import Faixa from '@/components/landing/Faixa'
import Materias from '@/components/landing/Materias'
import Planos from '@/components/landing/Planos'

/**
 * A landing, agora como composição.
 *
 * Antes era um arquivo de ~200 linhas com barra, rodapé, quatro seções e os
 * dados de todas elas escritos no meio do JSX. Quem precisasse mexer numa
 * seção lia a página inteira, e nenhuma das partes dava para usar em outro
 * lugar.
 *
 * A ordem das seções É o argumento de venda, e ler esta função tem que
 * mostrar isso de uma vez: o que é (Hero) → o tamanho (Faixa) → o que tem
 * dentro (Materias) → quanto custa (Planos).
 *
 * Barra e rodapé não estão aqui: são moldura do site aberto e vivem em
 * `(site)/layout.tsx`.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Faixa />
      <Materias />
      <Planos />
    </>
  )
}

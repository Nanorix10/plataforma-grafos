import Hero from '@/components/landing/Hero'
import Faixa from '@/components/landing/Faixa'
import ComoFunciona from '@/components/landing/ComoFunciona'
import Autor from '@/components/landing/Autor'
import Materias from '@/components/landing/Materias'
import Depoimentos from '@/components/landing/Depoimentos'
import Planos from '@/components/landing/Planos'
import Faq from '@/components/landing/Faq'

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
 * dentro (ComoFunciona) → quem escreveu (Autor) → o acervo (Materias) → quem
 * já usou (Depoimentos) → quanto custa (Planos) → o que trava (Faq).
 *
 * `Depoimentos` e `Faq` se recompõem sozinhos: o primeiro devolve `null` sem
 * depoimento real cadastrado, o segundo mostra só as perguntas que já têm
 * resposta. A página encurta em vez de exibir bloco vazio.
 *
 * Barra e rodapé não estão aqui: são moldura do site aberto e vivem em
 * `(site)/layout.tsx`.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Faixa />
      <ComoFunciona />
      <Autor />
      <Materias />
      <Depoimentos />
      <Planos />
      <Faq />
    </>
  )
}

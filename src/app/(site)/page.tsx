import Hero from '@/components/landing/Hero'
import Faixa from '@/components/landing/Faixa'
import Autor from '@/components/landing/Autor'
import Materias from '@/components/landing/Materias'
import Depoimentos from '@/components/landing/Depoimentos'
import Planos from '@/components/landing/Planos'
import Faq from '@/components/landing/Faq'

/**
 * A landing — **direção B: o mapa primeiro**, escolhida pelo Leandro entre as
 * três desenhadas em 26/08 (`design/landing/`, artboard `Mapa.dc.html`).
 *
 * A ordem das seções É o argumento de venda, e ler esta função tem que mostrar
 * isso de uma vez. Antes ela dizia: o que é (Hero) → o tamanho (Faixa) → o que
 * tem dentro (ComoFunciona) → quem escreveu (Autor) → o acervo (Materias) →
 * quem já usou (Depoimentos) → quanto custa (Planos) → o que trava (Faq).
 *
 * Agora diz: **o produto funcionando (Hero, com o grafo tocável) → quem
 * escreveu (Autor) → o tamanho (Faixa) → o acervo (Materias) → quem já usou
 * (Depoimentos) → quanto custa (Planos) → o que trava (Faq)**.
 *
 * Duas mudanças, e as duas são a mesma decisão:
 *
 * 1. **O grafo subiu para a dobra** e o `ComoFunciona` deixou de existir — ele
 *    era a moldura que apresentava o grafo três seções abaixo, e uma seção que
 *    apresenta o que já está na dobra é redundância. O texto dele ("Não é uma
 *    pilha de PDF. É um mapa.") não foi transportado: a dobra agora demonstra
 *    o que aquela frase afirmava, e repetir a afirmação depois da demonstração
 *    é desconfiar dela.
 * 2. **O autor subiu de quarto para segundo.** Com a dobra respondendo "o que
 *    é isso", a pergunta seguinte é "por que acreditar em você" — e a resposta
 *    tem que vir antes do tamanho do acervo, não depois.
 *
 * O tradeoff está documentado no `Hero.tsx` e na anotação do canvas: B chega
 * mais longe com quem fica e perde mais gente na porta.
 *
 * `Depoimentos` e `Faq` se recompõem sozinhos: o primeiro devolve `null` sem
 * depoimento real cadastrado, o segundo mostra só as perguntas que já têm
 * resposta. A página encurta em vez de exibir bloco vazio. `Depoimentos` não
 * aparece no artboard de B justamente porque hoje devolve `null` — ele segue
 * aqui para voltar sozinho no dia em que houver depoimento de verdade.
 *
 * Barra e rodapé não estão aqui: são moldura do site aberto e vivem em
 * `(site)/layout.tsx`.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Autor />
      <Faixa />
      <Materias />
      <Depoimentos />
      <Planos />
      <Faq />
    </>
  )
}

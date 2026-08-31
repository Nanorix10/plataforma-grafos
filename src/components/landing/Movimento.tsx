'use client'

import { type ReactNode, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * O movimento da landing — **substitui o `RevelarNaRolagem.tsx`**, que fazia
 * só o reveal e o fazia com `IntersectionObserver` mais `transition` de CSS.
 *
 * O nome mudou porque o arquivo passou a fazer três coisas, e um nome que
 * anuncia uma delas mente sobre as outras duas. É a mesma régua que trocou
 * "Título 1" por "Grafo 1" e `.quadro-branco` por `.quadro`.
 *
 * ============================================================
 * POR QUE TROCAR O QUE FUNCIONAVA
 * ============================================================
 * O reveal antigo tinha UMA duração (900ms) e UMA amplitude (34px) para tudo
 * — o `h1` da primeira dobra e o pontinho de 7px da linha de etapas entravam
 * exatamente igual. A régua de motion design diz que 900ms é "revelação
 * dramática", a faixa reservada ao que abre uma página; item de lista pede
 * 200–350ms. Quando tudo é dramático, nada é: a página inteira ficava com o
 * mesmo peso de anúncio, e a primeira dobra não se distinguia de um rodapé.
 *
 * O que a troca comprou, e que CSS sozinho não dava:
 *
 * 1. **Duração e amplitude por peso do elemento** (tabela `PESOS` abaixo).
 * 2. **Cascata de verdade**, com `stagger`, em vez dos três baldes de atraso
 *    do `data-atraso` — que travavam em três, e as listas daqui têm quatro e
 *    mais.
 * 3. **A camada ambiente**: a textura de grafo do fundo da dobra deixou de ser
 *    um SVG parado e passou a ter parallaxe presa à rolagem (`scrub`). Isso
 *    exige ler a posição da rolagem quadro a quadro, que é justamente o que
 *    `transition` de CSS não sabe fazer.
 *
 * **O que isso custou, e está declarado:** `gsap` + `ScrollTrigger` viram um
 * chunk de **43 KB comprimidos** (112 KB crus) — medido no `npm run build`,
 * não estimado —, num projeto que tirou o pacote `d3` do `package.json`
 * para não arrastar 30 submódulos (decisão 10) e que só baixa o KaTeX nas
 * rotas do editor (decisão 8). É a dívida desta decisão, e ela é da landing —
 * o `(app)` não importa nada disto.
 *
 * ============================================================
 * DUAS ARMADILHAS FECHADAS DE PASSAGEM
 * ============================================================
 * **A landing nascia EM BRANCO sem JavaScript.** O cabeçalho do arquivo antigo
 * afirmava o contrário — "quem chega sem JS vê tudo opaco, mas VÊ" —, mas
 * `.landing .reveal { opacity: 0 }` no `globals.css` não tinha condição
 * nenhuma: sem o observador, a classe `.visivel` nunca chegava e as 43
 * marcações de reveal ficavam invisíveis para sempre. Quem fecha isso agora é
 * o `<noscript>` de `(site)/page.tsx`, que devolve a opacidade por CSS puro.
 * Esconder pelo CSS continua sendo o certo — é o que evita o piscar entre o
 * HTML do servidor e a hidratação.
 *
 * **`prefers-reduced-motion` é conferido em DOIS lugares, e não é redundância.**
 * O `globals.css` revela tudo na hora (vale mesmo sem JavaScript), e o
 * `gsap.matchMedia()` aqui impede que qualquer tween chegue a existir. Sem o
 * segundo, o GSAP escreveria `opacity: 0` embutido por cima da regra do CSS e
 * a página sumiria justamente para quem pediu menos movimento.
 *
 * ============================================================
 * POR QUE ELE VIROU UM INVÓLUCRO
 * ============================================================
 * Antes era um irmão que devolvia `null` e varria o documento inteiro por
 * seletor solto. Agora ele DESENHA a raiz `.landing` e passa a `ref` como
 * `scope` do `useGSAP` — a regra do GSAP com React é que seletor sem escopo
 * pode casar fora do componente. As seções continuam sendo componentes de
 * servidor: elas chegam por `children`, que atravessa a fronteira de cliente
 * já renderizado.
 */

/**
 * A identidade de movimento da landing, nos três valores que uma marca precisa
 * fixar: a curva, a paleta de durações e a amplitude.
 *
 * **A personalidade é "Premium"** — é o que a página já dizia por escrito
 * (monoespaçada, caixa baixa, campo escuro, nada apressado), e a curva antiga
 * a contradizia: `cubic-bezier(0.16, 0.7, 0.3, 1)` arranca rápido e freia
 * seco, que é o registro "energético". `power2.out` é a aproximação da curva
 * Premium (0.4, 0, 0.2, 1) entre as prontas do GSAP — sem `CustomEase`, que
 * seria um segundo plugin para uma curva só.
 */
const ENTRADA = 'power2.out'

/**
 * Peso do elemento → quanto ele anda e em quanto tempo.
 *
 * Entrada desacelera (`power2.out`) porque é entrada; a regra direcional vale
 * para os três. A distância escala a duração, e não o contrário: o que anda
 * 14px em 350ms tem a mesma velocidade aparente do que anda 34px em 900ms.
 */
const PESOS = {
  /** rótulo, etiqueta — coisa pequena, tem de chegar quase pronta */
  leve: { y: 14, duracao: 0.35 },
  /** parágrafo, item de lista, cartão — o caso comum */
  medio: { y: 22, duracao: 0.55 },
  /** as declarações: os `h1`/`h2` que carregam o argumento da seção */
  pesado: { y: 34, duracao: 0.9 },
} as const

/**
 * O peso sai da PRÓPRIA gramática da landing, não de um atributo novo.
 *
 * `.declaracao` e `.rotulo` já existem no `globals.css` e já significam
 * exatamente "isto é o título que carrega a seção" e "isto é etiqueta". Ler
 * deles evita espalhar um `data-peso` por dez componentes para dizer de novo
 * o que a classe já diz — e evita as duas fontes divergirem no primeiro ajuste.
 */
function pesoDe(el: Element) {
  if (el.classList.contains('declaracao')) return PESOS.pesado
  if (el.classList.contains('rotulo')) return PESOS.leve
  return PESOS.medio
}

/**
 * Ordena um lote pelo `data-atraso` que já está na marcação.
 *
 * Os 17 `data-atraso` do projeto viraram os três baldes de `transition-delay`
 * que o CSS tinha. Com o `stagger` do GSAP eles seriam marcação morta —
 * atributo que não faz nada é pior que atributo que não existe. Aqui eles
 * voltam a ter função: dizem a ORDEM da cascata, e o `stagger` cuida do tempo.
 *
 * `sort` é estável desde o ES2019, então quem não tem atraso declarado
 * mantém a ordem do documento — que é a ordem certa em todas as seções de
 * hoje. O atributo é a alavanca para quando não for.
 */
function porAtraso(els: Element[]) {
  return [...els].sort(
    (a, b) =>
      Number(a.getAttribute('data-atraso') ?? 0) - Number(b.getAttribute('data-atraso') ?? 0)
  )
}

export default function Movimento({ children }: { children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = raiz.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const dobra = el.querySelector('.dobra')

        /* ---- a primeira dobra: linha do tempo, não rolagem ----
           Ela já está na tela quando a página abre, então prendê-la ao
           `ScrollTrigger` seria pedir uma rolagem que ninguém vai dar. É aqui
           que mora a revelação dramática — a única da página, e é isso que a
           faz ser dramática.

           A cascata é de 120ms por elemento (a faixa de "seção principal"), e
           são cinco: 480ms de cascata, abaixo do teto de 500ms que mantém a
           sequência legível como UMA entrada em vez de uma fila. */
        if (dobra) {
          const alvos = porAtraso(Array.from(dobra.querySelectorAll('.reveal')))
          const tl = gsap.timeline({ defaults: { ease: ENTRADA } })

          alvos.forEach((alvo, i) => {
            const { y, duracao } = pesoDe(alvo)
            tl.fromTo(alvo, { opacity: 0, y }, { opacity: 1, y: 0, duration: duracao }, i * 0.12)
          })
        }

        /* ---- o resto da página: um lote por vez ----
           `ScrollTrigger.batch` junta o que entrou na tela no mesmo intervalo
           e anima o conjunto de uma vez, com cascata. É o que o
           `IntersectionObserver` não dava: lá cada alvo se revelava sozinho,
           e três cartões lado a lado entravam no mesmo instante ou em baldes
           de atraso escritos à mão.

           A duração aqui é UMA (0.55s), e é a decisão: fora da dobra, nenhuma
           seção é a abertura da página. O que continua variando é a amplitude,
           que é o que separa um rótulo de um título sem transformar cada
           seção num segundo anúncio. */
        const fora = Array.from(el.querySelectorAll<HTMLElement>('.reveal')).filter(
          (alvo) => !alvo.closest('.dobra')
        )

        fora.forEach((alvo) => gsap.set(alvo, { opacity: 0, y: pesoDe(alvo).y }))

        /* NÃO ponha `once: true` aqui. Ele PARECE ser exatamente o que se
           quer — revelar uma vez e largar o gatilho — e foi o que esta função
           tinha na primeira escrita. Rolando a página inteira depressa, 46 dos
           57 alvos ficavam presos em `opacity: 0`, incluindo seções que já
           tinham passado da tela fazia milhares de pixels. Matando o gatilho
           de dentro do `onEnter`, a mesma varredura deixa zero presos —
           conferido forçando os tweens criados até o fim e medindo: 40 de 40
           alvos que cruzaram o gatilho terminam opacos e sem transform.

           **A explicação provável** (o número acima é medição; isto é
           leitura): o `batch` não chama `onEnter` na hora, ele JUNTA quem
           entrou dentro de um intervalo de ~1 quadro e chama uma vez só com o
           lote. `once` manda o gatilho se matar ao passar do fim. Numa rolagem
           que atravessa começo e fim no mesmo quadro, o gatilho morre antes de
           o lote ser entregue e leva a chamada junto; o alvo fica no estado
           que o `gsap.set` escreveu, que é invisível.

           Isso não é caso de laboratório: a própria dobra tem
           `href="#portas"`, e um salto de âncora atravessa gatilho atrás de
           gatilho num quadro só.

           Matar DEPOIS de animar fecha os dois lados — o `onEnter` já
           aconteceu (é de dentro dele que se mata) e o gatilho não sobra para
           reprocessar a cada rolagem. O tween corre sobre os ELEMENTOS, então
           não depende de o gatilho continuar vivo. */
        ScrollTrigger.batch(fora, {
          start: 'top 85%',
          onEnter: (lote, gatilhos) => {
            gsap.to(porAtraso(lote), {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: ENTRADA,
              stagger: 0.07,
              overwrite: true,
            })
            gatilhos.forEach((g) => g.kill())
          },
        })

        /* ---- a camada ambiente ----
           A textura de grafo do fundo da dobra é decorativa (é a §6 da
           identidade que a landing suspende) e, parada, era decoração e mais
           nada. Presa à rolagem ela vira profundidade: desce 14% enquanto a
           página sobe, então o fundo anda MENOS que o texto e os dois se
           separam em planos.

           `ease: 'none'` é obrigatório com `scrub` — qualquer outra curva
           desalinha a posição da textura da posição da rolagem, e o olho lê
           isso como travamento. O `scrub: 0.6` é o amortecimento: a textura
           leva 0,6s para alcançar a rolagem, o que tira o passo a passo da
           roda do mouse.

           `yPercent` é transform, não `top` — a regra de performance que vale
           para a página inteira: transform não remede o layout. */
        const textura = el.querySelector('.textura-grafo')
        if (textura && dobra) {
          gsap.to(textura, {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: { trigger: dobra, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
        }
      })

      return () => mm.revert()
    },
    { scope: raiz }
  )

  return (
    <div className="landing" ref={raiz}>
      {children}
    </div>
  )
}

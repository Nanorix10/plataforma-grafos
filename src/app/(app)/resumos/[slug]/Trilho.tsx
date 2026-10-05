'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { ItemTrilho } from '@/lib/titulos'
import { secaoAtual } from './secaoAtual'

/**
 * O trilho de leitura — a coluna estreita à esquerda da folha.
 *
 * É o grafo desta página desenhado enquanto se lê. As seções (que são nós do
 * mapa, decisão 12) marcam onde o olho está; as arestas que saem daqui, os
 * `[[wikilinks]]` do corpo, ficam recuadas sob a seção em que aparecem.
 *
 * **Não rouba um pixel da coluna de texto.** A folha continua com os 920px e as
 * margens que o autor arrastou na régua do editor (decisão 4) — o trilho mora
 * no vão morto à esquerda dela e some abaixo de 1340px de janela, onde esse vão
 * deixa de existir. Apertar a coluna para caber o trilho seria trocar a tela de
 * leitura pelo enfeite que a acompanha.
 *
 * **O nível do grafo é dito pelo RECUO, nunca por tamanho.** É a decisão 12
 * aplicada ao sumário: Grafo 1, 2 e 3 são h2/h3/h4, e um grafo não é *maior*
 * que o outro — ele CONTÉM o outro. O `data-nivel` no `<li>` é o que o CSS lê
 * para escalonar o recuo; a aresta entra um degrau abaixo do grafo em que
 * aparece, que é o que faz o trilho dizer de onde cada saída sai.
 *
 * A lista continua PLANA, sem `<ol>` aninhado: as arestas se intercalam com as
 * seções em ordem de leitura, e aninhar de verdade obrigaria a escolher entre a
 * ordem do documento e a estrutura — o trilho existe para acompanhar a leitura,
 * então a ordem ganha.
 *
 * Por que um ouvinte de `scroll` e não `IntersectionObserver`: a pergunta aqui
 * não é "este título está visível", é "qual foi o ÚLTIMO título que passou pela
 * linha do olho". Com títulos curtos e seções de um parágrafo — o formato de
 * quase todo resumo — há três ou quatro visíveis ao mesmo tempo, e o observer
 * só diria que todos entraram. O `rAF` garante uma conta por quadro.
 */
export default function Trilho({ itens }: { itens: ItemTrilho[] }) {
  const [ativa, setAtiva] = useState<string | null>(null)
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!itens.some((i) => i.tipo === 'secao')) return

    let agendado = false

    function medir() {
      agendado = false
      setAtiva(secaoAtual(itens))
    }

    function aoRolar() {
      if (agendado) return
      agendado = true
      requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
  }, [itens])

  /**
   * Acende no texto o link que está sob o cursor no trilho.
   *
   * O `<a>` é achado pela POSIÇÃO, e não por um `id` que o servidor teria de
   * gravar: mexer em `renderizarWikilinks` para isso mudaria também o HTML que
   * o editor mostra, e o WYSIWYG (decisão 4) obriga os dois a serem o mesmo
   * documento. `extrairTrilho` conta os links exatamente como o renderizador os
   * escreve, então o índice bate.
   */
  function acender(indice: number, ligado: boolean) {
    const links = document.querySelectorAll<HTMLAnchorElement>(
      '.conteudo-resumo a[href^="/resumos/"]'
    )
    links[indice]?.classList.toggle('aceso', ligado)
  }

  if (itens.length === 0) return null

  /**
   * Até onde o olho já passou.
   *
   * A seção ativa é a última que cruzou a linha do olho, então tudo o que vem
   * ANTES dela na ordem do documento já foi percorrido — a conta sai de graça
   * do que `secaoAtual` já calcula, sem um segundo ouvinte de rolagem.
   *
   * É progresso, não leitura: o aluno pode ter rolado sem ler, exatamente como
   * um resumo aberto não é um resumo lido (decisão 16). Por isso a marca é
   * discreta e não vai para o banco — ela orienta dentro desta página e morre
   * quando ela fecha.
   */
  const ondeEstou = itens.findIndex((i) => i.tipo === 'secao' && i.ancora === ativa)

  return (
    <nav ref={nav} className="trilho" aria-label="Nesta página">
      <div className="trilho-fixa">
        <h2>Nesta página</h2>
        <ol>
          {itens.map((item, i) =>
            item.tipo === 'secao' ? (
              <li
                key={`s-${item.ancora}`}
                className="trilho-secao"
                data-nivel={item.nivel}
                data-percorrida={ondeEstou > -1 && i < ondeEstou ? 'sim' : undefined}
              >
                <a
                  href={`#${item.ancora}`}
                  aria-current={ativa === item.ancora ? 'true' : undefined}
                >
                  {item.texto}
                </a>
              </li>
            ) : (
              <li key={`l-${item.slug}`} className="trilho-liga" data-nivel={item.nivel}>
                <Link
                  href={`/resumos/${item.slug}`}
                  onMouseEnter={() => acender(item.indice, true)}
                  onMouseLeave={() => acender(item.indice, false)}
                  onFocus={() => acender(item.indice, true)}
                  onBlur={() => acender(item.indice, false)}
                >
                  {item.texto}
                </Link>
              </li>
            )
          )}
        </ol>
      </div>
    </nav>
  )
}

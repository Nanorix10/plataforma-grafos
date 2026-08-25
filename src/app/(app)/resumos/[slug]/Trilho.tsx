'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { ItemTrilho } from '@/lib/titulos'

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
    const ancoras = itens.filter((i) => i.tipo === 'secao').map((i) => i.ancora)
    if (ancoras.length === 0) return

    let agendado = false

    function medir() {
      agendado = false
      // a linha do olho: um terço da janela abaixo do topo. Mais alto e o
      // título ativo troca antes de o aluno chegar nele; mais baixo e a
      // primeira seção nunca acende.
      const linha = window.innerHeight * 0.35
      let atual: string | null = null
      for (const ancora of ancoras) {
        const el = document.getElementById(ancora)
        if (el && el.getBoundingClientRect().top <= linha) atual = ancora
      }
      setAtiva(atual)
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

  return (
    <nav ref={nav} className="trilho" aria-label="Nesta página">
      <div className="trilho-fixa">
        <h2>Nesta página</h2>
        <ol>
          {itens.map((item) =>
            item.tipo === 'secao' ? (
              <li key={`s-${item.ancora}`} className="trilho-secao">
                <a
                  href={`#${item.ancora}`}
                  aria-current={ativa === item.ancora ? 'true' : undefined}
                >
                  {item.texto}
                </a>
              </li>
            ) : (
              <li key={`l-${item.slug}`} className="trilho-liga">
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

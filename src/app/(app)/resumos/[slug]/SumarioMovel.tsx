'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import type { ItemTrilho } from '@/lib/titulos'
import { secaoAtual } from './secaoAtual'

/**
 * O sumário na tela estreita — o trilho da coluna, alcançável por um botão.
 *
 * O trilho mora no vão morto à esquerda da folha e some abaixo de 1340px,
 * porque abaixo disso o vão não existe. Só que o sumário vale MAIS na tela
 * pequena, não menos: no notebook um resumo de dez seções cabe em três
 * rolagens, no celular vira quinze — e é onde o aluno revisa, que é pular, não
 * ler do começo.
 *
 * **O botão mora na barra do caminho, que já é fixa.** Nenhuma barra nova: a
 * tela do celular já carrega a do site e a do caminho, e uma terceira comeria a
 * leitura, que é o conteúdo. Naquela barra o canto direito está vazio no
 * celular — "Editar" é só de admin e o pai do resumo só entra a partir de `md`.
 *
 * **Sem um segundo ouvinte de rolagem.** O trilho da coluna recalcula a seção
 * ativa a cada quadro porque está sempre à vista. Este só precisa saber onde o
 * aluno está no instante em que abre, então calcula UMA vez, no toque. Uma
 * conta por abertura contra uma por quadro.
 */
export default function SumarioMovel({ itens }: { itens: ItemTrilho[] }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const [ativa, setAtiva] = useState<string | null>(null)

  const fechar = useCallback(() => dialogo.current?.close(), [])

  /* Sem seção não há sumário: 208 dos 248 resumos não têm subtítulo, e um botão
     que abre uma folha vazia é pior que botão nenhum. */
  if (!itens.some((i) => i.tipo === 'secao')) return null

  return (
    <>
      <button
        type="button"
        className="sumario-botao"
        onClick={() => {
          setAtiva(secaoAtual(itens))
          dialogo.current?.showModal()
        }}
      >
        Nesta página
      </button>

      <dialog
        ref={dialogo}
        className="sumario-folha"
        aria-label="Nesta página"
        onClick={(e) => {
          if (e.target === dialogo.current) fechar()
        }}
      >
        {/* `trilho` junto: o recuo por nível, as cores e os tamanhos estão todos
            escritos como `.trilho …`. Emprestar a classe é fonte única; copiar
            as regras seriam duas que divergem no primeiro ajuste. A classe
            `trilho-folha` desfaz só o que é de coluna — a posição na grade e o
            `display:none` da tela estreita, que aqui seria autossabotagem. */}
        <nav className="trilho trilho-folha">
          <div className="sumario-cabeca">
            <h2>Nesta página</h2>
            <button type="button" onClick={fechar} aria-label="Fechar">
              ✕
            </button>
          </div>
          <ol>
            {itens.map((item) =>
              item.tipo === 'secao' ? (
                <li key={`s-${item.ancora}`} className="trilho-secao" data-nivel={item.nivel}>
                  {/* Fecha ANTES de o navegador pular: dentro de um diálogo
                      modal, um salto de âncora rola a página por baixo e a
                      folha fica aberta sobre o destino. */}
                  <a
                    href={`#${item.ancora}`}
                    aria-current={ativa === item.ancora ? 'true' : undefined}
                    onClick={fechar}
                  >
                    {item.texto}
                  </a>
                </li>
              ) : (
                <li key={`l-${item.slug}`} className="trilho-liga" data-nivel={item.nivel}>
                  <Link href={`/resumos/${item.slug}`} onClick={fechar}>
                    {item.texto}
                  </Link>
                </li>
              )
            )}
          </ol>
        </nav>
      </dialog>
    </>
  )
}

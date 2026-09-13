'use client'

import { useState, useTransition } from 'react'
import { alternarFavorito } from '../acoes'

/**
 * A estrela na barra do caminho.
 *
 * **Otimista de propósito.** O estado vira no clique e a ação sai atrás. Uma
 * estrela que espera a rede para acender dá a sensação de que o clique não
 * pegou, e o aluno clica de novo — o que desfaz o que ele acabou de fazer. Aqui
 * a marca é do próprio aluno e não tem conflito possível com ninguém; se a
 * escrita falhar, ele perde uma estrela, não um dado.
 *
 * **Por que ela mora aqui, e não num canto do texto.** Favoritar é uma decisão
 * sobre o resumo INTEIRO, tomada geralmente no fim da leitura. A barra do
 * caminho é fixa: está à mão no começo e no fim, sem o aluno ter de voltar ao
 * topo para alcançá-la.
 */
export default function BotaoFavorito({
  resumoId,
  inicial,
}: {
  resumoId: string
  inicial: boolean
}) {
  const [favorito, setFavorito] = useState(inicial)
  const [, iniciar] = useTransition()

  return (
    <button
      type="button"
      aria-pressed={favorito}
      aria-label={favorito ? 'Tirar dos favoritos' : 'Guardar nos favoritos'}
      title={favorito ? 'Tirar dos favoritos' : 'Guardar nos favoritos'}
      onClick={() => {
        const novo = !favorito
        setFavorito(novo)
        iniciar(() => {
          alternarFavorito(resumoId, novo)
        })
      }}
      className={`shrink-0 grid place-items-center w-8 h-8 rounded-md transition-colors hover:bg-[var(--raised-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)] ${
        favorito ? 'text-[var(--acento)]' : 'text-[var(--ink-faint)] hover:text-[var(--ink-dim)]'
      }`}
    >
      {/* Um desenho só, e o preenchimento é que muda: contorno vazio = não
          favoritado, cheio = favoritado. Dois ícones diferentes fariam o botão
          "pular" de forma no clique, e o que tem de mudar é o estado, não o
          objeto. `currentColor` deixa a cor sair da classe acima. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-[18px] h-[18px]"
        fill={favorito ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      >
        <path d="M12 3.5l2.6 5.28 5.83.85-4.22 4.11.997 5.81L12 16.81l-5.21 2.74.996-5.81-4.22-4.11 5.83-.85z" />
      </svg>
    </button>
  )
}

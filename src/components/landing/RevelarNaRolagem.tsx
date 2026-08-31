'use client'

import { useEffect } from 'react'

/**
 * O reveal por rolagem da landing.
 *
 * **A identidade dizia "nenhuma animação de entrada por rolagem"** (§7 de
 * `docs/identidade-visual.md`), e isto a contraria. Foi decisão do Leandro em
 * 31/08, junto com a linguagem visual da referência que ele trouxe.
 *
 * Três cuidados que não são enfeite:
 *
 * - **O conteúdo nasce visível para quem não tem JavaScript.** A classe
 *   `.reveal` esconde, mas quem a aplica é o CSS; se este componente nunca
 *   rodar, a página ficaria em branco. Por isso o observador roda no cliente e
 *   a página é servida com o conteúdo no HTML — quem chega sem JS vê tudo
 *   opaco, mas VÊ. O buscador também.
 * - **`prefers-reduced-motion` desliga tudo de uma vez**, revelando na hora.
 *   O CSS já anula a transição; aqui a classe é adicionada em bloco para o
 *   caso de o observador nem chegar a existir.
 * - **Cada alvo é desobservado ao aparecer.** Sem isso o observador continua
 *   sendo chamado a cada rolagem, para sempre, num documento com dezenas de
 *   alvos.
 */
export default function RevelarNaRolagem() {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>('.landing .reveal'))
    if (alvos.length === 0) return

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduz.matches || !('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.classList.add('visivel'))
      return
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return
          entrada.target.classList.add('visivel')
          observador.unobserve(entrada.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    alvos.forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [])

  return null
}

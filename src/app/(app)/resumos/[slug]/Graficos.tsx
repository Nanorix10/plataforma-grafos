'use client'

import { useEffect } from 'react'

/**
 * Dá vida aos gráficos interativos do resumo (decisão 34): controles, ▶,
 * zoom e arrastar. O desenho já chegou pronto do servidor
 * (`lib/graficos.ts`); daqui em diante quem redesenha é `lib/grafico/vivo.ts`.
 *
 * Não desenha nada e não guarda estado React — mesmo padrão da `LupaFigura` e
 * das `Questoes`: o corpo é HTML cru, então o componente procura os gráficos
 * no contêiner e pendura os ouvintes neles.
 *
 * **O código do gráfico só desce se a página tiver gráfico.** O `import()` fica
 * dentro do efeito, depois de conferir que existe um — mesma regra do Three.js
 * no mapa (decisão 26). Resumo sem gráfico não paga um byte por isto.
 */
export default function Graficos({ seletor }: { seletor: string }) {
  useEffect(() => {
    const raiz = document.querySelector(seletor)
    const graficos = raiz ? Array.from(raiz.querySelectorAll<HTMLElement>('.grafico[data-config]')) : []
    if (graficos.length === 0) return
    let vivo = true
    const limpezas: (() => void)[] = []
    void import('@/lib/grafico/vivo').then(({ ativarGrafico }) => {
      if (!vivo) return
      for (const g of graficos) limpezas.push(ativarGrafico(g))
    })
    return () => {
      vivo = false
      for (const f of limpezas) f()
    }
  }, [seletor])

  return null
}

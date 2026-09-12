'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * Clicar numa figura do resumo abre ela grande.
 *
 * **Por que um ouvinte só, e não um por figura.** O corpo do resumo é HTML cru
 * injetado com `dangerouslySetInnerHTML` — quando ele chega na página já é
 * texto, e não há componente React onde pendurar um `onClick`. Então o ouvinte
 * mora no contêiner e pergunta, no clique, o que foi atingido. Um ouvinte para
 * o resumo inteiro, não um para cada imagem.
 *
 * **Por que a figura é CLONADA em vez de reconstruída.** O recorte deste
 * projeto é CSS: o `<img>` continua sendo a foto inteira e quem esconde o resto
 * é a `.moldura` por cima (ver `admin/editor/imagem.ts`). Montar a ampliação a
 * partir do `src` mostraria de volta o pedaço que o autor cortou — o mesmo erro
 * que as alças de seleção cometeram em 06/09, medindo o `<img>` em vez da
 * moldura.
 *
 * Clonando, todo o CSS vem junto: recorte, giro, borda, filtros, opacidade.
 * E escala sozinho, porque o recorte é escrito em PORCENTAGEM — a largura da
 * imagem é % da moldura e o empurrão é % dela mesma. Trocar só a largura da
 * moldura reamplia tudo na proporção certa, sem uma conta deste lado.
 */

const NIVEIS = [1, 1.5, 2, 3] as const

/* Atributos que posicionam a figura DENTRO da folha — margem, faixa, escape,
   flutuação. No diálogo ela está sozinha e centrada, e qualquer um deles a
   jogaria para um canto ou para fora da tela. */
const POSICIONAIS = ['data-quebra', 'data-escapa', 'data-margem', 'data-topo', 'data-alinhamento']

export default function LupaFigura({ seletor }: { seletor: string }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const [nivel, setNivel] = useState(0)
  const [legenda, setLegenda] = useState('')
  /**
   * Largura ÷ altura do que se vê — com recorte, é a proporção da moldura, não
   * a do arquivo.
   *
   * Ela precisa vir para o CSS porque "caber na tela" tem duas restrições ao
   * mesmo tempo, e nenhuma sozinha resolve: só largura e a figura alta
   * transborda; só `max-height` e ela é CORTADA, porque `aspect-ratio` com
   * `max-height` violado não reescala a largura — foi o que a medição mostrou,
   * uma figura de 1.333 saindo em 1.722. Com a proporção em mãos, a largura
   * ajustada é `min(largura do palco, altura disponível × proporção)`, e as
   * duas restrições valem juntas.
   */
  const [proporcao, setProporcao] = useState(1.4)

  const fechar = useCallback(() => {
    dialogo.current?.close()
  }, [])

  useEffect(() => {
    const raiz = document.querySelector(seletor)
    if (!raiz) return

    function aoClicar(e: MouseEvent) {
      const alvo = e.target as HTMLElement | null
      const img = alvo?.closest('img')
      if (!img) return
      const figura = img.closest('figure.figura')
      if (!figura) return
      /* Figura com link já tem dono para o clique. Roubá-lo seria trocar uma
         ação que o autor escolheu por uma que ele não pediu. */
      if (img.closest('a')) return

      e.preventDefault()

      /* Medida ANTES de clonar: na página a figura está desenhada, e é dali
         que sai a proporção real do que o aluno está vendo. */
      const visivel = figura.querySelector('.moldura') ?? img
      const cx = visivel.getBoundingClientRect()
      if (cx.width > 0 && cx.height > 0) setProporcao(cx.width / cx.height)

      const clone = figura.cloneNode(true) as HTMLElement
      POSICIONAIS.forEach((a) => clone.removeAttribute(a))
      clone.removeAttribute('style')
      clone.classList.add('figura-ampliada')

      /* A legenda sai da figura e vira rodapé do diálogo: dentro do clone ela
         herdaria a largura ampliada e viraria uma linha de texto gigante. */
      const cap = clone.querySelector('figcaption')
      setLegenda(cap?.textContent?.trim() ?? '')
      cap?.remove()

      const palcoEl = palco.current
      if (!palcoEl) return
      palcoEl.replaceChildren(clone)

      setNivel(0)
      dialogo.current?.showModal()
    }

    raiz.addEventListener('click', aoClicar as EventListener)
    return () => raiz.removeEventListener('click', aoClicar as EventListener)
  }, [seletor])

  return (
    <dialog
      ref={dialogo}
      className="lupa"
      aria-label="Figura ampliada"
      /* Clique no fundo fecha. O `<dialog>` recebe o clique do backdrop como
         clique nele mesmo, então comparar o alvo com o próprio elemento é o
         teste de "foi fora do conteúdo". */
      onClick={(e) => {
        if (e.target === dialogo.current) fechar()
      }}
    >
      <div className="lupa-barra">
        <button
          type="button"
          onClick={() => setNivel((n) => Math.max(0, n - 1))}
          disabled={nivel === 0}
          aria-label="Diminuir"
        >
          −
        </button>
        <span aria-live="polite" className="lupa-nivel">
          {nivel === 0 ? 'Ajustada' : `${NIVEIS[nivel]}×`}
        </span>
        <button
          type="button"
          onClick={() => setNivel((n) => Math.min(NIVEIS.length - 1, n + 1))}
          disabled={nivel === NIVEIS.length - 1}
          aria-label="Aumentar"
        >
          +
        </button>
        <button type="button" onClick={fechar} aria-label="Fechar" className="lupa-fechar">
          ✕
        </button>
      </div>

      {/* O fator de zoom mora AQUI, no elemento que o React controla, e desce
          para a figura clonada por herança de variável CSS. Escrever no clone
          seria mutar um nó que o React não possui — e é justamente o que as
          regras do React Compiler recusam.

          O arrasto da figura ampliada é a ROLAGEM deste contêiner: o navegador
          já sabe fazer isso com o dedo, com as barras e com as setas. Um gesto
          de pinça escrito à mão daria o mesmo com muito mais código e sem
          funcionar no teclado. */}
      <div
        /* `conteudo-resumo` junto: TODO o desenho da figura — o
           `overflow:hidden` da moldura que faz o recorte existir, o
           `box-sizing:content-box` que o mantém no lugar com borda, o
           `max-width:none` da imagem — está escrito como
           `.conteudo-resumo .figura …`. Sem a classe aqui, a figura clonada
           cai fora de todas essas regras e a lupa mostra a foto inteira.
           Emprestar a classe é a fonte única; copiar as regras seriam duas que
           divergem no primeiro ajuste. */
        className="lupa-palco conteudo-resumo"
        ref={palco}
        data-ajustada={nivel === 0 ? 'sim' : 'nao'}
        style={{ '--z': NIVEIS[nivel], '--proporcao': proporcao } as CSSProperties}
      />

      {legenda ? <p className="lupa-legenda">{legenda}</p> : null}
    </dialog>
  )
}

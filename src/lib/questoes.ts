/**
 * Transforma a resolução gravada pelo editor numa gaveta que abre no clique.
 *
 * O editor grava `<div class="resolucao">…</div>` (veja o porquê em
 * `admin/editor/questaoResolvida.ts`). Aqui, na leitura, isso vira
 * `<details>` — o elemento nativo do HTML para "conteúdo que abre e fecha".
 *
 * Nativo importa: não desce nenhum JavaScript por causa disso, funciona com o
 * teclado e com leitor de tela sem código nosso, e o Ctrl+F do navegador acha
 * o texto lá dentro mesmo com a gaveta fechada.
 *
 * Roda ANTES de `renderizarMatematica`: o KaTeX gera montanhas de `<div>`
 * aninhados, e a contagem de profundidade abaixo teria que atravessar todos
 * eles à toa. Antes dele, o que existe dentro da resolução são parágrafos e
 * listas.
 */

const ABERTURA = '<div class="resolucao">'
const FECHAMENTO = '</div>'

export function renderizarQuestoes(html: string): string {
  if (!html || !html.includes(ABERTURA)) return html

  let saida = ''
  let resto = html

  for (;;) {
    const inicioTag = resto.indexOf(ABERTURA)
    if (inicioTag === -1) {
      saida += resto
      break
    }

    saida += resto.slice(0, inicioTag)
    const inicioConteudo = inicioTag + ABERTURA.length

    /* Acha o `</div>` que fecha ESTE div, e não o primeiro que aparecer: uma
       resolução pode conter outro div (uma segunda gaveta, um bloco de
       fórmula). Procurar `indexOf('</div>')` direto fecharia no lugar errado e
       cortaria o resto do resumo para fora da página. */
    let profundidade = 1
    let cursor = inicioConteudo

    while (profundidade > 0) {
      const abre = resto.indexOf('<div', cursor)
      const fecha = resto.indexOf(FECHAMENTO, cursor)

      if (fecha === -1) break // HTML truncado

      if (abre !== -1 && abre < fecha) {
        profundidade += 1
        cursor = abre + '<div'.length
      } else {
        profundidade -= 1
        cursor = fecha + FECHAMENTO.length
      }
    }

    // Não fechou: devolve o trecho como veio em vez de inventar uma gaveta
    // sobre HTML quebrado — o resumo sai feio, mas sai inteiro.
    if (profundidade > 0) {
      saida += resto.slice(inicioTag)
      break
    }

    const dentro = resto.slice(inicioConteudo, cursor - FECHAMENTO.length)
    saida +=
      '<details class="resolucao">' +
      '<summary>Ver resolução</summary>' +
      dentro +
      '</details>'

    resto = resto.slice(cursor)
  }

  return saida
}

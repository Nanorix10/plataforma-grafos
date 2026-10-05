/**
 * Marca o parágrafo cujo conteúdo inteiro é UMA fórmula.
 *
 * ============================================================
 * Por que isto não é CSS
 * ============================================================
 * A primeira versão desta regra vivia inteira no `globals.css`, como
 * `p:has(> .katex:only-child)`. Parecia certa e está errada, e o erro é o tipo
 * que não aparece lendo: **`:only-child` conta ELEMENTOS, e ignora nós de
 * texto.** Então um parágrafo como
 *
 *   <p>um objeto é arremessado paralelamente ao solo (<span …>v_{y_0}=0</span>),
 *      a partir de uma certa altura;</p>
 *
 * — que é a abertura de um resumo real de Física — casa com o seletor, porque
 * a fórmula é o único *elemento* ali dentro. O parágrafo de abertura do resumo
 * saía centralizado, dentro de uma caixa, como se fosse a conclusão da seção.
 * Pego na conferência visual, não na leitura do CSS.
 *
 * CSS não tem como perguntar "este elemento tem texto solto dentro?", então
 * quem responde é o servidor, que enxerga a string.
 *
 * ============================================================
 * Roda ANTES do KaTeX
 * ============================================================
 * Aqui o parágrafo ainda é `<p><span data-type="inline-math" …></span></p>`, um
 * padrão curto e fechado. Depois de `renderizarMatematica` ele vira dezenas de
 * `<span>` aninhados do KaTeX (decisão 8), e a mesma pergunta passaria a exigir
 * contagem de profundidade — o problema que `lib/questoes.ts` já descreve.
 *
 * ============================================================
 * O editor NÃO recebe esta marca, e é deliberado
 * ============================================================
 * Isto cria uma divergência entre a folha do autor e a página do aluno, que a
 * decisão 4 normalmente proíbe. O precedente é a decisão 9b: a resolução é
 * `<div>` aberta no editor e `<details>` fechada na leitura, porque no editor a
 * gaveta atrapalharia quem escreve. Aqui é o mesmo tipo de preço, menor: o
 * autor vê a fórmula no fluxo, o aluno vê com respiro, e o TEXTO é o mesmo nos
 * dois. Nada do que o autor escreve muda de sentido por causa disso.
 *
 * O `corpo` gravado também não muda: o atributo é escrito na renderização,
 * como as âncoras de título e as legendas de figura.
 */

/**
 * Um `<p>` cujo conteúdo é exatamente um nó de fórmula do editor.
 *
 * `[^>]*` no `<p` cobre o parágrafo com atributos; `\s*` de cada lado tolera a
 * quebra de linha que o editor grava entre os blocos (`\r\n` aparece no acervo
 * importado). O `</span>` é opcional porque o nó é gravado vazio — o LaTeX vive
 * no atributo, não entre as tags (decisão 8).
 */
const PARAGRAFO_SO_FORMULA =
  /<p\b([^>]*)>\s*(<span\b[^>]*?\bdata-type="inline-math"[^>]*?>\s*(?:<\/span>)?)\s*<\/p>/gi

export function marcarFormulaSolta(html: string | null | undefined): string {
  if (!html) return ''

  return html.replace(PARAGRAFO_SO_FORMULA, (bruto, atributos: string, formula: string) => {
    // Parágrafo que já traga o atributo (texto colado de fora, improvável mas
    // possível) não ganha um segundo: dois `data-formula` no mesmo elemento e
    // o navegador fica com o primeiro, que não é necessariamente o nosso.
    if (/\bdata-formula\s*=/i.test(atributos)) return bruto
    return `<p${atributos} data-formula="solta">${formula}</p>`
  })
}

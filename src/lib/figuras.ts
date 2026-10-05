/**
 * A descrição da figura deixa de ser só do leitor de tela e vira legenda.
 *
 * ============================================================
 * O achado
 * ============================================================
 * Medido no acervo em 04/10/2026: **223 imagens, 223 com `alt`, zero
 * `<figcaption>`**. E os `alt` deste acervo não são rótulos de três palavras —
 * são explicações inteiras, escritas pelo autor:
 *
 *   "Objeto arremessado horizontalmente do alto de uma altura h: a componente
 *    horizontal é constante e a aceleração é vertical, igual a g."
 *
 * Isso é exatamente o que a literatura de aprendizagem multimídia chama de
 * legenda instrucional, e o site estava entregando as 223 apenas a quem usa
 * leitor de tela. Palavra e imagem lidas juntas, uma ao lado da outra, é o
 * princípio da contiguidade espacial; aqui ele custa uma função de renderização
 * e nenhuma linha de conteúdo novo.
 *
 * ============================================================
 * O `alt` é ESVAZIADO, e isso não é descuido de acessibilidade
 * ============================================================
 * Repetir o mesmo texto em `alt` e em `<figcaption>` faz o leitor de tela
 * anunciar a figura duas vezes seguidas, palavra por palavra — é pior que o
 * estado anterior, não melhor. A recomendação de quem escreve as normas é a
 * oposta: quando a descrição está visível na legenda, a imagem recebe
 * `alt=""` e passa a ser decorativa para a tecnologia assistiva, que lê a
 * legenda uma vez só, como qualquer outro texto da página.
 *
 * Quem NÃO tem `alt`, ou tem um `alt` vazio, não ganha legenda e não é tocado:
 * não há o que mostrar, e inventar legenda é o que esta função não faz.
 *
 * ============================================================
 * Por que agora, e o que isto custaria antes
 * ============================================================
 * A legenda acrescenta TEXTO ao documento, e o grifo do aluno se ancora no
 * texto com 32 letras de contexto de cada lado (decisão 21). Um grifo cujo
 * contexto atravessasse a figura poderia deixar de casar e virar órfão.
 *
 * Conferido no banco antes de escrever isto: a tabela `grifos` tem **zero
 * linhas**. Não há âncora para quebrar. Quem mexer aqui depois de o acervo
 * ter grifos de verdade precisa refazer essa conta — e aí a conversa é outra,
 * porque órfão é a nota de um aluno deixando de pintar.
 *
 * Pela mesma razão isto roda **antes** de `renderizarMatematica` e das gavetas:
 * o `alt` é texto puro, sem fórmula e sem `<div>`, então nada do que vem depois
 * tem de atravessar o que esta função escreveu.
 */

/** Uma `<figure>` do corpo, com o que houver dentro. */
const CADA_FIGURA = /<figure\b([^>]*)>([\s\S]*?)<\/figure>/gi

/** O `alt` da primeira `<img>` de dentro dela. */
const ALT_DA_IMAGEM = /(<img\b[^>]*?\balt\s*=\s*)("([^"]*)"|'([^']*)')/i

/**
 * Entidades HTML viram texto de novo.
 *
 * O `alt` é gravado como atributo, então `&amp;` e `&quot;` chegam escapados.
 * Como legenda eles vão para o corpo do documento, onde `&amp;` continua sendo
 * a escrita correta de `&` — por isso o `&amp;` fica. O que se desfaz é o que
 * só precisava de escape por estar dentro de aspas.
 */
function comoTexto(bruto: string): string {
  return bruto.replace(/&quot;/g, '"').replace(/&#3[59];/g, "'")
}

export function legendarFiguras(html: string | null | undefined): string {
  if (!html) return ''

  return html.replace(CADA_FIGURA, (bruto, atributos, interno) => {
    // Legenda escrita à mão ganha sempre: ela é do autor, e esta função só
    // existe para o caso em que não há nenhuma.
    if (/<figcaption\b/i.test(interno)) return bruto

    const m = ALT_DA_IMAGEM.exec(interno)
    if (!m) return bruto

    const texto = comoTexto((m[3] ?? m[4] ?? '').trim())
    if (!texto) return bruto

    // O `alt` da PRIMEIRA imagem é esvaziado — é a dela que virou legenda.
    // `replace` com string literal, e não função, é seguro aqui porque o que
    // entra é `alt=""` fixo: não há `$` vindo de dado.
    const semAlt = interno.replace(ALT_DA_IMAGEM, '$1""')

    // `data-de-alt` separa esta legenda da que o AUTOR escreveu no painel de
    // imagem (decisão 11c), e as duas não se parecem de propósito: a dele é
    // curta e centralizada, esta é uma frase explicativa que se lê como texto
    // e por isso alinha à esquerda. Sem a marca, uma regra serviria mal às
    // duas.
    return `<figure${atributos}>${semAlt}<figcaption data-de-alt="sim">${texto}</figcaption></figure>`
  })
}

/**
 * Os títulos de dentro do resumo, que são nós do mapa (decisão 12).
 *
 * Funções puras, sem nada de servidor — mesma divisão de `arvore.ts` ×
 * `resumos.ts`, e pela mesma razão: as duas visões do mapa são componentes de
 * cliente e não podem arrastar `next/headers` junto.
 *
 * **As duas funções daqui têm que andar juntas, sempre.** `extrairTitulos` diz
 * ao mapa para onde apontar e `ancorarTitulos` grava o destino na página; se
 * cada uma calculasse a âncora do seu jeito, o link do mapa cairia no topo do
 * resumo em silêncio — o navegador não reclama de âncora que não existe. Por
 * isso ambas passam pelo mesmo `percorrer`, e é ele que numera as repetições.
 *
 * Rodam sobre o `corpo` CRU, antes de wikilinks, questões e fórmulas. Não é
 * detalhe de ordem: `renderizarQuestoes` conta `<div>` e o KaTeX enche o HTML
 * de `<span>`, então passar por eles primeiro faria as duas lerem documentos
 * diferentes — que é exatamente o desencontro que o parágrafo acima descreve.
 */

export type TituloNo = {
  /** 2, 3 ou 4 — o mesmo h2/h3/h4 que o editor grava. */
  nivel: number
  /** O que o aluno lê no nó. */
  texto: string
  /** O `id` gravado no título, e o que vai depois do `#` no link. */
  ancora: string
}

/** Casa h2, h3 e h4 com o que houver dentro, inclusive quebras de linha. */
const CADA_TITULO = /<h([234])\b([^>]*)>([\s\S]*?)<\/h\1>/gi

/**
 * Texto limpo de um título, a partir do HTML de dentro dele.
 *
 * O `[[Fulano]]` perde os colchetes: no corpo do resumo eles são a marcação do
 * wikilink e viram link na leitura, mas no rótulo de um nó do mapa sairiam como
 * dois colchetes literais no meio do desenho.
 *
 * **O dois-pontos do fim também cai, e pela mesma razão.** No corpo ele é
 * pontuação de verdade — separa o termo da definição em `**Termo:** definição`,
 * que é como o editor grava um grafo corrido. No mapa não há definição do outro
 * lado: o nó se chamaria "Leis de Newton:", com um sinal apontando para nada.
 * Some só quando encerra o título, então "Razão 3:4" continua inteiro.
 *
 * Isto não mexe nas âncoras — `comoAncora` já descartava o caractere e apagava
 * o traço sobrando —, mas a limpeza mora aqui de propósito: rótulo e âncora
 * saem do MESMO texto, que é a garantia que o cabeçalho deste arquivo exige.
 */
function textoLimpo(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\[\[(.+?)\]\]/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#3[59];/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*:+$/, '')
    .trim()
}

/**
 * Título → pedaço de URL.
 *
 * O `NFD` separa a letra do acento e o intervalo seguinte joga o acento fora,
 * então "Inércia" vira "inercia" em vez de perder a letra inteira.
 */
function comoAncora(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Um título encontrado. `ancora` nula marca os que ficam de fora — eles
 * PRECISAM continuar na lista, e não ser filtrados aqui, porque quem regrava o
 * HTML casa achado com ocorrência pela posição. Some com um do meio e todos os
 * seguintes recebem a âncora do vizinho.
 */
type Achado = { nivel: number; texto: string; ancora: string | null }

/**
 * Percorre os títulos uma vez e resolve as âncoras, incluindo as repetidas.
 *
 * Título repetido acontece de verdade — "Exemplo" e "Resumo" aparecem duas ou
 * três vezes no mesmo documento. Sem o sufixo, os dois nós do mapa levariam ao
 * primeiro, e o segundo viraria um link que mente.
 *
 * Título sem texto (um que só tenha uma fórmula dentro, por exemplo) fica de
 * fora dos dois lados: não há rótulo para desenhar no mapa, e ancorar um
 * destino que ninguém alcança só sujaria o HTML.
 */
function percorrer(html: string): Achado[] {
  const usadas = new Map<string, number>()
  const achados: Achado[] = []

  for (const m of html.matchAll(new RegExp(CADA_TITULO))) {
    const texto = textoLimpo(m[3])
    if (!texto) {
      achados.push({ nivel: Number(m[1]), texto: '', ancora: null })
      continue
    }

    const base = comoAncora(texto) || 'secao'
    const vezes = (usadas.get(base) ?? 0) + 1
    usadas.set(base, vezes)

    achados.push({
      nivel: Number(m[1]),
      texto,
      ancora: vezes === 1 ? base : `${base}-${vezes}`,
    })
  }

  return achados
}

/** Os títulos do resumo, em ordem de documento. */
export function extrairTitulos(html: string | null | undefined): TituloNo[] {
  if (!html) return []
  return percorrer(html)
    .filter((a): a is Achado & { ancora: string } => a.ancora !== null)
    .map(({ nivel, texto, ancora }) => ({ nivel, texto, ancora }))
}

/**
 * Grava o `id` de cada título, para o link do mapa ter onde chegar.
 *
 * Duas coisas que parecem preciosismo e não são:
 *
 * - **O substituto é uma FUNÇÃO, não uma string.** Numa string de substituição
 *   o `$` é sintaxe (`$&` repete o casado, `$1` repete um grupo), e título de
 *   resumo tem cifrão de verdade — "Custo em R$ e a demanda" sairia adulterado.
 *   A forma de função entrega o texto literal.
 * - **`id` que já viesse no HTML é descartado.** Texto colado de fora pode
 *   trazer o seu, e com dois `id` no mesmo elemento o navegador fica com o
 *   primeiro — justamente o que o mapa não conhece.
 */
export function ancorarTitulos(html: string | null | undefined): string {
  if (!html) return ''

  const achados = percorrer(html)
  let i = 0

  return html.replace(new RegExp(CADA_TITULO), (bruto, nivel, atributos, interno) => {
    const a = achados[i++]
    if (!a?.ancora) return bruto
    const limpos = String(atributos).replace(/\s+id\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    return `<h${nivel}${limpos} id="${a.ancora}">${interno}</h${nivel}>`
  })
}

/**
 * Um item do trilho de leitura, na coluna à esquerda da folha.
 *
 * O trilho é o grafo DESTA página desenhado enquanto se lê: as seções, que já
 * são nós do mapa (decisão 12), e as arestas que saem daqui — os
 * `[[wikilinks]]` do corpo, recuados sob a seção em que aparecem.
 *
 * Mora aqui, e não num módulo próprio, pela mesma razão que obriga
 * `extrairTitulos` e `ancorarTitulos` a andarem juntas: a âncora de cada seção
 * tem que sair do MESMO `percorrer`, senão o trilho leva a um destino que a
 * página não gravou.
 */
export type ItemTrilho =
  | { tipo: 'secao'; nivel: number; texto: string; ancora: string }
  | { tipo: 'liga'; texto: string; slug: string; indice: number }

/** Casa um título inteiro OU um wikilink solto, em ordem de documento. */
const TITULO_OU_LINK = /<h([234])\b[^>]*>([\s\S]*?)<\/h\1>|\[\[(.+?)\]\]/gi

/**
 * O trilho de um resumo, em ordem de leitura.
 *
 * **`indice` é a posição do link no HTML final, não no corpo cru**, e é por ele
 * que o componente do trilho acha o `<a>` correspondente na página. Contam
 * apenas os wikilinks que `renderizarWikilinks` consegue resolver: título que
 * não existe vira `<span>`, não `<a>`, e incluí-lo aqui deslocaria todos os
 * seguintes em um.
 *
 * Pela mesma conta, um wikilink DENTRO de um título também ocupa índice — ele
 * vira `<a>` no HTML como qualquer outro. Ele não entra no trilho (seria a
 * seção repetindo o próprio nome um nível abaixo), mas precisa ser contado.
 *
 * Destino repetido aparece uma vez só. O trilho é o mapa de para ONDE esta
 * página leva; citar "Tordesilhas" três vezes não são três arestas.
 */
export function extrairTrilho(
  html: string | null | undefined,
  tituloParaSlug: Record<string, string>
): ItemTrilho[] {
  if (!html) return []

  const achados = percorrer(html)
  const itens: ItemTrilho[] = []
  const jaVistos = new Set<string>()
  let iTitulo = 0
  let iLiga = 0

  for (const m of html.matchAll(new RegExp(TITULO_OU_LINK))) {
    // wikilink solto no corpo
    if (m[3] !== undefined) {
      const slug = tituloParaSlug[m[3]]
      if (!slug) continue
      const indice = iLiga++
      if (jaVistos.has(slug)) continue
      jaVistos.add(slug)
      itens.push({ tipo: 'liga', texto: m[3], slug, indice })
      continue
    }

    // título: os wikilinks de dentro dele não viram item, mas gastam índice
    for (const dentro of String(m[2]).matchAll(/\[\[(.+?)\]\]/g)) {
      if (tituloParaSlug[dentro[1]]) iLiga++
    }

    const a = achados[iTitulo++]
    if (a?.ancora) itens.push({ tipo: 'secao', nivel: a.nivel, texto: a.texto, ancora: a.ancora })
  }

  return itens
}

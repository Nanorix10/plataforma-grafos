import { mergeAttributes, Node } from '@tiptap/core'
import { Table } from '@tiptap/extension-table'

/**
 * A imagem do resumo, com o conjunto de opções do Google Docs.
 *
 * ============================================================
 * Por que um nó próprio, e não mais o `@tiptap/extension-image`
 * ============================================================
 * A extensão de origem grava um `<img>` solto. Legenda pede `<figure>` +
 * `<figcaption>`, e "texto ao redor" pede o `float` num elemento que ENVOLVA a
 * imagem — os dois são estrutura, não atributo, e nenhum cabia lá dentro.
 *
 * ============================================================
 * A regra que manda em tudo aqui
 * ============================================================
 * A página do aluno renderiza HTML cru (`dangerouslySetInnerHTML`), sem React.
 * Então **tudo o que se vê tem de sair do HTML gravado** — ou por `data-*` que
 * o CSS lê, ou por `style` embutido. Nada pode depender do NodeView, que só
 * existe dentro do editor.
 *
 * Daí a divisão:
 *   `data-*`  para os modos fechados (quebra, alinhamento, escapa, recolorir)
 *   `style`   para os valores contínuos (largura, rotação, brilho, borda…),
 *             que um seletor de atributo não teria como cobrir
 *
 * ============================================================
 * Compatibilidade com o que já está gravado
 * ============================================================
 * As primeiras imagens foram salvas como `<img data-largura="100">`, em que o
 * número era PORCENTAGEM. `largura` agora guarda a medida CSS inteira ("100%",
 * "340px"), e o `parseHTML` converte o formato antigo. Sem isso, um "100"
 * viraria 100 pixels e a imagem encolheria sozinha ao reabrir o resumo.
 */

type Quebra = 'bloco' | 'emLinha' | 'aoRedorEsq' | 'aoRedorDir'

/** Lê um atributo no elemento ou no `<img>` de dentro dele. */
function pegar(el: HTMLElement, nome: string): string | null {
  return el.getAttribute(nome) ?? el.querySelector('img')?.getAttribute(nome) ?? null
}

function numero(v: string | null, padrao: number) {
  const n = Number(v)
  return Number.isFinite(n) ? n : padrao
}

/** Junta só as partes de `filter` que saíram do padrão. */
function filtro(a: Record<string, unknown>) {
  const partes: string[] = []
  if (a.recolorir === 'cinza') partes.push('grayscale(1)')
  if (a.recolorir === 'sepia') partes.push('sepia(1)')
  if (a.brilho !== 100) partes.push(`brightness(${Number(a.brilho) / 100})`)
  if (a.contraste !== 100) partes.push(`contrast(${Number(a.contraste) / 100})`)
  if (a.saturacao !== 100) partes.push(`saturate(${Number(a.saturacao) / 100})`)
  return partes.join(' ')
}

export const Imagem = Node.create({
  name: 'image',
  group: 'block',
  // `atom` porque não há nada editável DENTRO da imagem: a legenda é atributo,
  // editada no painel. Sem isso o cursor entraria na figura e ficaria preso.
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null, parseHTML: (el) => pegar(el, 'src') },
      alt: { default: '', parseHTML: (el) => pegar(el, 'alt') ?? '' },
      legenda: { default: '', parseHTML: (el) => el.querySelector('figcaption')?.textContent ?? '' },
      link: { default: '', parseHTML: (el) => el.querySelector('a')?.getAttribute('href') ?? '' },

      /** Medida CSS inteira: "100%", "340px". Ver a nota de compatibilidade. */
      largura: {
        default: '100%',
        parseHTML: (el) => {
          const bruto = pegar(el, 'data-largura')
          if (!bruto) return '100%'
          return /^\d+$/.test(bruto) ? `${bruto}%` : bruto
        },
      },
      /** Vazio = a altura acompanha a proporção. */
      altura: { default: '', parseHTML: (el) => pegar(el, 'data-altura') ?? '' },
      rotacao: { default: 0, parseHTML: (el) => numero(pegar(el, 'data-rotacao'), 0) },

      quebra: {
        default: 'bloco' as Quebra,
        parseHTML: (el) => (pegar(el, 'data-quebra') as Quebra) ?? 'bloco',
      },
      alinhamento: { default: 'centro', parseHTML: (el) => pegar(el, 'data-alinhamento') ?? 'centro' },
      escapa: { default: false, parseHTML: (el) => pegar(el, 'data-escapa') === 'sim' },
      margem: { default: 0, parseHTML: (el) => numero(pegar(el, 'data-margem'), 0) },

      bordaLargura: { default: 0, parseHTML: (el) => numero(pegar(el, 'data-borda-largura'), 0) },
      bordaCor: { default: '#9184D9', parseHTML: (el) => pegar(el, 'data-borda-cor') ?? '#9184D9' },
      bordaEstilo: { default: 'solid', parseHTML: (el) => pegar(el, 'data-borda-estilo') ?? 'solid' },

      brilho: { default: 100, parseHTML: (el) => numero(pegar(el, 'data-brilho'), 100) },
      contraste: { default: 100, parseHTML: (el) => numero(pegar(el, 'data-contraste'), 100) },
      saturacao: { default: 100, parseHTML: (el) => numero(pegar(el, 'data-saturacao'), 100) },
      opacidade: { default: 100, parseHTML: (el) => numero(pegar(el, 'data-opacidade'), 100) },
      recolorir: { default: 'nenhum', parseHTML: (el) => pegar(el, 'data-recolorir') ?? 'nenhum' },
    }
  },

  parseHTML() {
    return [
      { tag: 'figure.figura' },
      // as duas imagens já gravadas são `<img>` solto, sem figura em volta
      { tag: 'img[src]' },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const a = node.attrs

    const estiloImagem: string[] = [`width:${a.largura}`]
    if (a.altura) estiloImagem.push(`height:${a.altura}`, 'object-fit:cover')
    if (a.rotacao) estiloImagem.push(`transform:rotate(${a.rotacao}deg)`)
    if (a.opacidade !== 100) estiloImagem.push(`opacity:${Number(a.opacidade) / 100}`)
    if (a.bordaLargura > 0) {
      estiloImagem.push(`border:${a.bordaLargura}px ${a.bordaEstilo} ${a.bordaCor}`)
    }
    const f = filtro(a)
    if (f) estiloImagem.push(`filter:${f}`)

    const estiloFigura: string[] = []
    if (a.margem > 0) estiloFigura.push(`--margem-figura:${a.margem}px`)

    const imagem = [
      'img',
      mergeAttributes(HTMLAttributes, {
        src: a.src,
        alt: a.alt,
        style: estiloImagem.join(';'),
        // `data-*` continuam gravados: são o que o `parseHTML` relê ao reabrir
        // o resumo no editor, já que ninguém decompõe a string de `style`
        'data-largura': a.largura,
        'data-altura': a.altura || null,
        'data-rotacao': a.rotacao || null,
        'data-borda-largura': a.bordaLargura || null,
        'data-borda-cor': a.bordaLargura ? a.bordaCor : null,
        'data-borda-estilo': a.bordaLargura ? a.bordaEstilo : null,
        'data-brilho': a.brilho !== 100 ? a.brilho : null,
        'data-contraste': a.contraste !== 100 ? a.contraste : null,
        'data-saturacao': a.saturacao !== 100 ? a.saturacao : null,
        'data-opacidade': a.opacidade !== 100 ? a.opacidade : null,
        'data-recolorir': a.recolorir !== 'nenhum' ? a.recolorir : null,
      }),
    ]

    const miolo = a.link
      ? ['a', { href: a.link, target: '_blank', rel: 'noopener noreferrer' }, imagem]
      : imagem

    return [
      'figure',
      {
        class: 'figura',
        'data-quebra': a.quebra,
        'data-alinhamento': a.alinhamento,
        'data-escapa': a.escapa ? 'sim' : null,
        'data-margem': a.margem || null,
        style: estiloFigura.join(';'),
      },
      miolo,
      ...(a.legenda ? [['figcaption', {}, a.legenda]] : []),
    ]
  },

  /* Sem `addCommands`: quem insere usa `insertContent({type:'image'})` direto.
     Um comando próprio exigiria aumentar a interface `Commands` do TipTap por
     declaração de módulo só para economizar meia linha na chamada. */
})

/** As larguras de atalho do painel, em porcentagem da coluna. */
export const LARGURAS = [25, 50, 75, 100] as const

/**
 * A tabela ganha o MESMO `escapa` da imagem.
 *
 * "Imagens e tabelas sempre têm liberdade de estar onde eu quiser" — e a
 * tabela é onde isso mais rende: os resumos de origem usam tabela de duas
 * colunas para linha do tempo (ano | evento) e glossário (termo | definição),
 * e as duas ficam apertadas dentro do recuo do texto.
 *
 * O atributo tem o mesmo nome e o mesmo `data-escapa` de propósito: uma regra
 * só no CSS atende os dois, e não há como um divergir do outro.
 */
export const TabelaLivre = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      escapa: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-escapa') === 'sim',
        renderHTML: (attrs) => (attrs.escapa ? { 'data-escapa': 'sim' } : {}),
      },
    }
  },
})

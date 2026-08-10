import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'

/**
 * A imagem do resumo, com as liberdades que o autor pediu: onde ela fica, que
 * tamanho tem, e se ela pode passar das margens da folha.
 *
 * Tudo vai em `data-*` no próprio `<img>`, e quem desenha é o CSS de
 * `.conteudo-resumo`. Isso é o mesmo caminho da fórmula (decisão 8): atributo
 * no elemento, não sintaxe no texto. E é seguro pelo mesmo motivo — nenhum
 * trigger do Postgres lê imagem, só `[[wikilinks]]`.
 *
 * Por que atributo e não classe: classe é um campo só, e três decisões
 * independentes (alinhamento, largura, escapar) espremidas numa string
 * viram `"esq largo escapa"` — que o TipTap teria de partir e remontar a cada
 * edição, e que qualquer classe extra do ProseMirror contaminaria.
 */
export const Imagem = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),

      /** esquerda | centro | direita. Centro é o padrão de figura em texto. */
      alinhamento: {
        default: 'centro',
        parseHTML: (el) => el.getAttribute('data-alinhamento') ?? 'centro',
        renderHTML: (attrs) => ({ 'data-alinhamento': attrs.alinhamento }),
      },

      /**
       * Largura em porcentagem da coluna de texto — não em pixels.
       *
       * Pixel amarraria a imagem à largura da folha do dia em que foi
       * inserida: bastaria o autor arrastar a régua, ou o aluno abrir no
       * celular, para a imagem estourar. Porcentagem acompanha as duas coisas.
       */
      largura: {
        default: 100,
        parseHTML: (el) => Number(el.getAttribute('data-largura')) || 100,
        renderHTML: (attrs) => ({ 'data-largura': String(attrs.largura) }),
      },

      /**
       * Passar das margens.
       *
       * É o "quando eu quiser algo maior": a imagem sai do recuo do texto e
       * ocupa a folha inteira. O CSS faz isso com margem negativa do tamanho
       * exato das margens — por isso `--margem-esq`/`--margem-dir` precisam
       * existir tanto no editor quanto na página do aluno.
       */
      escapa: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-escapa') === 'sim',
        renderHTML: (attrs) => (attrs.escapa ? { 'data-escapa': 'sim' } : {}),
      },
    }
  },
}).configure({
  // `inline: false` é o padrão e é o que queremos: a imagem é um bloco, não
  // uma letra grande no meio do parágrafo. É isso que permite centralizar e
  // deixar escapar das margens.
  allowBase64: false,
})

/** Os tamanhos oferecidos na barra. Passo grosso de propósito: o autor está
 *  escolhendo proporção, não fazendo diagramação fina. */
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

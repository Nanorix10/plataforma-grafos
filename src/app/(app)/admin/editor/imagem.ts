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

type Quebra =
  | 'bloco'
  | 'emLinha'
  | 'aoRedorEsq'
  | 'aoRedorDir'
  | 'margemEsq'
  | 'margemDir'

/**
 * A figura mora na MARGEM da folha, e não dentro da coluna.
 *
 * É posição do mesmo eixo que `bloco` e `aoRedor*` — nenhuma figura é bloco e
 * lateral ao mesmo tempo —, por isso entrou aqui e não num atributo novo. O
 * lado vai dentro do valor, como `aoRedorEsq`/`aoRedorDir` já faziam: assim
 * cada modo tem uma regra de CSS sua, sem seletores se cruzando.
 */
export function naMargem(q: unknown): boolean {
  return q === 'margemEsq' || q === 'margemDir'
}

/**
 * O respiro entre a figura lateral e o texto.
 *
 * **Este número está escrito DUAS vezes**: aqui e em `--vao-lateral`, no
 * `globals.css`. O CSS não importa de TypeScript, e o painel precisa da conta
 * para saber se ainda sobra largura útil na margem. Se mudarem lá e não aqui, o
 * aviso do painel passa a mentir — é a mesma armadilha do `ALTURA_CARTAO` do
 * `loading.tsx` da linha do tempo.
 */
export const VAO_LATERAL = 16

/**
 * Abaixo disto a lateral não serve para nada.
 *
 * O `max-width` amarrado à régua impede a figura de sair da folha, e só isso:
 * numa margem estreita ela vira um selo ilegível, e o aluno recebe esse selo
 * como se fosse intenção. O painel avisa antes.
 *
 * **Este número já foi 90, e 90 era o pior valor possível**: a margem padrão é
 * 150, o que deixa 134px de figura — acima de 90, então o aviso nunca disparava
 * justamente no ÚNICO estado em que todo resumo começa. Quem clicava em "margem
 * direita" numa folha recém-aberta recebia um gráfico de 134×84px, ilegível, e
 * nenhuma explicação. Um piso que só pega o caso raro é um piso decorativo.
 *
 * 170 põe o padrão dentro do aviso, e é aí que o botão de alargar aparece.
 */
export const LARGURA_MINIMA_LATERAL = 170

/**
 * A margem que o botão "Alargar a margem" persegue.
 *
 * 300 deixa 284px de figura — a mesma ordem de grandeza do que o modo "texto ao
 * redor" alcança (60% de uma coluna de 620 = 372px), que é o tamanho em que um
 * gráfico volta a ser legível. Não é o máximo possível: alargar mais estreita a
 * coluna de leitura, e a lateral existe para não atrapalhar o texto.
 */
export const MARGEM_LATERAL_CONFORTAVEL = 300

/* ============================================================
   RECORTE
   ============================================================
   Não destrutivo: o arquivo no bucket continua inteiro e o recorte é CSS, como
   brilho e giro. Dá para desfazer sempre, e a mesma imagem serve a dois resumos
   com recortes diferentes.

   **O preço, declarado:** o pedaço cortado continua no arquivo, e quem abrir o
   endereço da imagem vê a foto inteira. Recorte aqui NÃO é censura — se um dia
   for preciso que o pedaço suma de verdade, isso é outra funcionalidade, e ela
   grava arquivo novo.

   Ver `docs/superpowers/specs/2026-09-06-recorte-de-imagem-design.md`. */

/** Quanto foi cortado de cada lado, em % da imagem ORIGINAL. */
export type Recorte = { t: number; r: number; b: number; l: number }

/** Sobra pelo menos isto de imagem em cada eixo. Alça que pode zerar a figura
    produz uma figura invisível sem avisar. */
export const RECORTE_MINIMO_VISIVEL = 10

/** `"10 0 25 5"` → `{t:10,r:0,b:25,l:5}`. Vazio ou torto vira `null`. */
export function lerRecorte(bruto: unknown): Recorte | null {
  if (typeof bruto !== 'string' || !bruto.trim()) return null
  const p = bruto.trim().split(/\s+/).map(Number)
  if (p.length !== 4 || p.some((n) => !Number.isFinite(n) || n < 0)) return null
  const [t, r, b, l] = p
  // sem isto, uma string gravada errada geraria divisão por zero no renderHTML
  if (t + b > 100 - RECORTE_MINIMO_VISIVEL || l + r > 100 - RECORTE_MINIMO_VISIVEL) return null
  if (t === 0 && r === 0 && b === 0 && l === 0) return null
  return { t, r, b, l }
}

export function escreverRecorte(r: Recorte): string {
  const n = (v: number) => Math.round(v * 10) / 10
  return `${n(r.t)} ${n(r.r)} ${n(r.b)} ${n(r.l)}`
}

/** `"1600 900"` → `{l:1600,a:900}`. */
export function lerNatural(bruto: unknown): { l: number; a: number } | null {
  if (typeof bruto !== 'string' || !bruto.trim()) return null
  const [l, a] = bruto.trim().split(/\s+/).map(Number)
  if (!Number.isFinite(l) || !Number.isFinite(a) || l <= 0 || a <= 0) return null
  return { l, a }
}

/** A fração da imagem que sobra visível em cada eixo. */
export function fracoes(r: Recorte) {
  return { fw: (100 - r.l - r.r) / 100, fh: (100 - r.t - r.b) / 100 }
}

/** Lê um atributo no elemento ou no `<img>` de dentro dele. */
function pegar(el: HTMLElement, nome: string): string | null {
  return el.getAttribute(nome) ?? el.querySelector('img')?.getAttribute(nome) ?? null
}

/**
 * O atributo ausente cai no padrão — e é por isso que a conversão vem depois.
 *
 * `Number(null)` e `Number('')` valem 0, e 0 é um valor LEGÍTIMO para brilho,
 * contraste, saturação e opacidade. Convertendo primeiro, toda imagem sem
 * `data-brilho` ganhava brilho 0 e opacidade 0 — ou seja, sumia. E o
 * `renderHTML` só grava esses atributos quando eles FOGEM do padrão, então a
 * imagem que ninguém ajustou é exatamente a que não os tem: bastava reabrir o
 * resumo no editor para ela desaparecer.
 */
function numero(v: string | null, padrao: number) {
  if (v === null || v.trim() === '') return padrao
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

      /** `"t r b l"` em % da imagem original; vazio = imagem inteira. */
      recorte: { default: '', parseHTML: (el) => pegar(el, 'data-recorte') ?? '' },
      /**
       * `"largura altura"` do ARQUIVO, em px.
       *
       * É o que torna o recorte de cima e de baixo possível: sem a proporção
       * original não dá para saber a altura do que sobrou. O editor preenche
       * sozinho quando a imagem carrega, então o acervo antigo se cura ao ser
       * aberto — sem migration e sem script.
       *
       * Serve a uma segunda coisa de graça: com ela, `renderHTML` emite
       * `width`/`height` no `<img>`, o navegador reserva o espaço certo antes
       * de a imagem chegar, e o resumo para de saltar ao abrir.
       */
      natural: { default: '', parseHTML: (el) => pegar(el, 'data-natural') ?? '' },
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

    /* O recorte só existe com a proporção original em mãos: sem ela não dá para
       saber a altura do que sobrou. Imagem antiga, sem `natural`, simplesmente
       não recorta — e o painel diz isso em vez de a opção sumir calada. */
    const rec = lerRecorte(a.recorte)
    const nat = lerNatural(a.natural)
    const recortando = rec !== null && nat !== null

    const estiloImagem: string[] = []
    const estiloMoldura: string[] = []

    if (recortando) {
      const { fw, fh } = fracoes(rec)
      /* A imagem é ampliada até que a FATIA visível ocupe a moldura inteira, e
         empurrada para que a fatia comece na borda. A porcentagem de
         `translate` é do próprio elemento, então os números crus do recorte
         servem direto — sem conversão, sem depender da largura da coluna. */
      estiloImagem.push(`width:${Math.round((100 / fw) * 1000) / 1000}%`)
      estiloImagem.push(`transform:translate(-${rec.l}%,-${rec.t}%)`)
      estiloMoldura.push(`width:${a.largura}`)
      estiloMoldura.push(
        `aspect-ratio:${Math.round(fw * nat.l)}/${Math.round(fh * nat.a)}`
      )
      /* O giro passa para a MOLDURA. Na imagem ele giraria depois do
         `translate`, em torno de um centro que já saiu do lugar, e o desenho
         escaparia da moldura. A borda vem junto: ela emoldura o que se vê. */
      if (a.rotacao) estiloMoldura.push(`transform:rotate(${a.rotacao}deg)`)
      if (a.bordaLargura > 0) {
        estiloMoldura.push(`border:${a.bordaLargura}px ${a.bordaEstilo} ${a.bordaCor}`)
      }
      /* `altura` é a MESMA coisa feita de outro jeito: ela corta pelo meio com
         `object-fit: cover`. Com recorte, quem manda é o recorte. O painel já
         limpa o campo; isto atende o HTML gravado antes de o painel existir. */
    } else {
      estiloImagem.push(`width:${a.largura}`)
      if (a.altura) estiloImagem.push(`height:${a.altura}`, 'object-fit:cover')
      if (a.rotacao) estiloImagem.push(`transform:rotate(${a.rotacao}deg)`)
      if (a.bordaLargura > 0) {
        estiloImagem.push(`border:${a.bordaLargura}px ${a.bordaEstilo} ${a.bordaCor}`)
      }
    }

    if (a.opacidade !== 100) estiloImagem.push(`opacity:${Number(a.opacidade) / 100}`)
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
        'data-recorte': recortando ? a.recorte : null,
        'data-natural': a.natural || null,
        /* As dimensões do arquivo viram atributos de verdade, e não só `data-`:
           é o que faz o navegador reservar o espaço certo antes de a imagem
           chegar. O CSS acima continua mandando no tamanho exibido. */
        width: nat?.l ?? null,
        height: nat?.a ?? null,
      }),
    ]

    const comLink = a.link
      ? ['a', { href: a.link, target: '_blank', rel: 'noopener noreferrer' }, imagem]
      : imagem

    const miolo = recortando
      ? ['span', { class: 'moldura', style: estiloMoldura.join(';') }, comLink]
      : comLink

    return [
      'figure',
      {
        class: 'figura',
        'data-quebra': a.quebra,
        'data-alinhamento': a.alinhamento,
        /* `escapa` e os modos de margem são opostos exatos: um faz a figura
           comer as duas margens, o outro a faz morar dentro de uma. O painel já
           impede a combinação, mas HTML antigo pode chegar com `escapa` gravado
           e ser trocado para lateral — então o atributo morre aqui também. */
        'data-escapa': a.escapa && !naMargem(a.quebra) ? 'sim' : null,
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

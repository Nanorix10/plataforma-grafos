import { MATERIAS } from './materias'

/**
 * O evento da linha do tempo e as contas de data — funções puras, sem nada de
 * servidor.
 *
 * Vive separado de `lib/eventos.ts` pela MESMA razão que `lib/arvore.ts` vive
 * separado de `lib/resumos.ts`: o eixo e a tela de cadastro são componentes de
 * cliente, e `eventos.ts` importa `getSessao`, que usa `next/headers`. Arrastar
 * isso para o cliente quebra o build — e quebrou, antes desta separação.
 *
 * O par de campos que confunde à primeira vista:
 *
 * - `ano_inicio` / `ano_fim` são INTEIROS e servem para POSICIONAR no eixo.
 *   Negativo é a.C. `ano_fim` nulo significa evento pontual; preenchido, o
 *   evento é um período e vira barra.
 * - `rotulo_data` é o que o aluno LÊ. Existe porque "séc. V a.C." e
 *   "14/07/1789" não cabem num inteiro, e um eixo que só sabe anos não pode
 *   obrigar o autor a escrever a data errada. Vazio, é derivado dos anos.
 *
 * Ver a migration 20260808230000 para o porquê de não ser `date`.
 */
export type Evento = {
  id: string
  titulo: string
  ano_inicio: number
  ano_fim: number | null
  rotulo_data: string
  /**
   * Um evento pode ser de VÁRIAS matérias — o Renascimento é História, Arte,
   * Literatura e Filosofia ao mesmo tempo. Nunca vazio: o banco recusa
   * (`eventos_tem_materia`), porque evento sem matéria não teria chip que o
   * mostrasse e sumiria da tela sem sumir do banco.
   */
  materia_slugs: string[]
  resumo_id: string | null
  descricao: string
  /** slug do resumo ligado, quando há — resolvido na consulta, para o link */
  resumo_slug: string | null
}

/** Um ano como se escreve: 1789, 476, "300 a.C.". */
export function formatarAno(ano: number): string {
  return ano < 0 ? `${Math.abs(ano)} a.C.` : String(ano)
}

/**
 * Lê um ano escrito à mão.
 *
 * Morava em `admin/eventos/actions.ts`, que é `'use server'`. Mudou para cá
 * porque a pré-visualização do cadastro em lote é componente de CLIENTE e
 * precisa da mesma conta: sem isso haveria duas leituras de ano no projeto, e
 * elas discordariam no primeiro formato exótico. Este arquivo existe
 * exatamente para o que os dois lados compartilham.
 *
 * O campo é texto e não `<input type="number">` de propósito: as setinhas
 * nativas comem metade da caixa (mesma razão já registrada no editor), e ano
 * histórico é digitado com sinal — "-350" para 350 a.C. Aceitar "350 a.C."
 * escrito por extenso também evita que o autor tenha de traduzir na cabeça o
 * que ele já sabe escrever.
 */
const ANTES_DE_CRISTO = /a\.?\s*c\.?/i
const DEPOIS_DE_CRISTO = /d\.?\s*c\.?/i

export function lerAno(bruto: string): number | null {
  const t = bruto.trim()
  if (!t) return null

  const antesDeCristo = ANTES_DE_CRISTO.test(t)
  const limpo = t.replace(ANTES_DE_CRISTO, '').replace(DEPOIS_DE_CRISTO, '').replace(/\s+/g, '')

  /* Exigir que sobre EXATAMENTE um número, em vez de varrer os dígitos com um
     `replace(/[^\d-]/g, '')`.

     A versão antiga colava os dígitos de tudo o que encontrasse: "1914 até
     1918" virava o ano 19141918, sem erro nenhum — um evento silenciosamente
     jogado a dezenove milhões de anos daqui, que no eixo esmagaria todos os
     outros contra a margem esquerda. Recusar é o certo: quem escreveu isso
     queria um intervalo, e é `lerPeriodo` que sabe ler intervalo. */
  if (!/^-?\d+$/.test(limpo)) return null

  const numero = Number.parseInt(limpo, 10)
  if (Number.isNaN(numero)) return null
  return antesDeCristo ? -Math.abs(numero) : numero
}

/**
 * O que aparece embaixo do título do evento.
 *
 * O rótulo escrito à mão sempre ganha: é ele que carrega "séc. XV" e
 * "14/07/1789", que os inteiros não sabem representar. Sem ele, deriva.
 *
 * No período, o "a.C." sai do primeiro ano quando os dois são a.C. — "500–300
 * a.C." em vez de "500 a.C.–300 a.C.", que é como se escreve e como o material
 * do autor já traz.
 */
export function rotuloDoEvento(e: {
  ano_inicio: number
  ano_fim: number | null
  rotulo_data: string
}): string {
  if (e.rotulo_data.trim()) return e.rotulo_data.trim()
  if (e.ano_fim === null) return formatarAno(e.ano_inicio)
  // a contração do "a.C." mora no `faixaDeAnos`, que o "Quando" do resumo
  // também usa — duas cópias discordariam no primeiro ajuste
  return faixaDeAnos(e.ano_inicio, e.ano_fim)
}

/** O ano em que o evento termina — o próprio início, se for pontual. */
export function anoFinal(e: { ano_inicio: number; ano_fim: number | null }): number {
  return e.ano_fim ?? e.ano_inicio
}

/**
 * Menor janela do eixo, em anos. Sem piso, o zoom continua até o eixo perder
 * sentido — e o enquadramento vindo de fora pede um ponto.
 *
 * Mora aqui, e não no componente, porque `enquadrar` precisa dele e a página
 * do resumo também: o mesmo número decidindo o zoom manual, a vista cheia e o
 * link de "Quando" é o que impede os três de discordarem.
 */
export const JANELA_MINIMA = 5

/**
 * Uma faixa de anos vira a janela que o eixo abre nela.
 *
 * Duas coisas acontecem aqui, e a segunda é a que estava faltando:
 *
 * - **Folga de respiro**, para o primeiro e o último evento não nascerem
 *   colados na margem.
 * - **Piso de `JANELA_MINIMA`**, aplicado à janela RESULTANTE. O `janelaCheia`
 *   do eixo calculava o piso e depois o perdia, porque tirava a folga de 6% de
 *   `min` e `max` em vez de tirar da janela: com um evento pontual (`de` igual
 *   a `ate`) a folga era 0,3 ano e saía uma janela de 2 anos — abaixo do
 *   próprio mínimo que a linha acima tinha acabado de calcular. Ficou
 *   invisível enquanto a única entrada era o acervo inteiro, que abre com
 *   milênios; o link de um resumo com um evento só é a primeira entrada capaz
 *   de pedir um ponto.
 */
export function enquadrar(de: number, ate: number): { de: number; ate: number } {
  const bruto = Math.max(0, ate - de)
  const comFolga = bruto + Math.max(bruto * 0.12, 1)
  const span = Math.max(JANELA_MINIMA, comFolga)
  // alarga em torno do meio: o que o aluno pediu continua centrado
  const meio = (de + ate) / 2
  return { de: Math.floor(meio - span / 2), ate: Math.ceil(meio + span / 2) }
}

/**
 * O enquadramento pedido pela URL da linha do tempo (`?de=&ate=`), quando
 * existe e faz sentido.
 *
 * Mora aqui, e não dentro da página, para poder ser PROVADA: a página redireciona
 * para `/login` antes de chegar nesta linha, então exercitar a rota deslogado
 * não exercita esta conta — e é ela que decide o que o aluno vê ao clicar no
 * "Quando" de um resumo.
 *
 * Parâmetro ausente, vazio, não numérico ou invertido devolve `undefined`, e o
 * eixo abre mostrando tudo — o comportamento de sempre. **Não é erro do
 * aluno**: quem chega com `?de=abc` colou uma URL torta, e uma tela de erro no
 * lugar da linha do tempo puniria alguém que só queria ver a linha do tempo.
 */
export function lerEnquadramento(p: {
  de?: string
  ate?: string
}): { de: number; ate: number } | undefined {
  // o teste do vazio vem antes do `Number`, que devolve 0 para '' e faria
  // `?de=&ate=` enquadrar o ano zero em silêncio
  if (!p.de?.trim() || !p.ate?.trim()) return undefined
  const de = Number(p.de)
  const ate = Number(p.ate)
  if (!Number.isInteger(de) || !Number.isInteger(ate) || ate < de) return undefined
  return enquadrar(de, ate)
}

/**
 * Uma faixa de anos como se escreve.
 *
 * O "a.C." sai do primeiro quando os dois são a.C. — "500–300 a.C." e não
 * "500 a.C.–300 a.C.", que é como o material do autor já traz. Dois anos
 * iguais devolvem um ano só: "1789–1789" não é faixa, é gagueira.
 */
export function faixaDeAnos(de: number, ate: number): string {
  if (de === ate) return formatarAno(de)
  if (de < 0 && ate < 0) return `${Math.abs(de)}–${Math.abs(ate)} a.C.`
  return `${formatarAno(de)}–${formatarAno(ate)}`
}

/** O que o cabeçalho do resumo diz em "Quando", e para onde ele leva. */
export type PeriodoDoResumo = {
  /** primeiro e último ano cobertos — o enquadramento pedido ao eixo */
  de: number
  ate: number
  /** a data, como o aluno lê */
  rotulo: string
  /** o que vem depois do ponto: o título, com um evento; a contagem, com vários */
  legenda: string
}

/**
 * O período que um resumo cobre, a partir dos eventos ligados a ele.
 *
 * **Com um evento, mostra o evento**; com vários, mostra a faixa e quantos
 * são. A regra existe porque os dois extremos do acervo são reais: a maior
 * parte dos resumos datados tem um evento só, onde "1453 · 1 evento" seria
 * bobo e "1453 · Queda de Constantinopla" diz tudo; e o
 * `o-conceito-de-idade-media` carrega mais de dez, onde listar todos empurraria
 * o texto do resumo para fora da tela justamente no celular.
 *
 * Com um evento o rótulo é o `rotuloDoEvento`, que respeita o `rotulo_data`
 * escrito à mão — é ele que carrega "Séc. V a IX", que dois inteiros não sabem
 * dizer. Com vários a faixa é derivada dos anos, porque misturar rótulos
 * escritos à mão de eventos diferentes não daria uma frase.
 *
 * Devolve `null` sem evento nenhum, que é o caso da maioria do acervo: 84
 * eventos cobrem uma fração dos resumos, e o bloco some inteiro em vez de
 * aparecer vazio — a mesma regra do "Cai em" ausente e do `Depoimentos` sem
 * depoimento.
 */
export function periodoDosEventos(
  eventos: Pick<Evento, 'titulo' | 'ano_inicio' | 'ano_fim' | 'rotulo_data'>[]
): PeriodoDoResumo | null {
  if (eventos.length === 0) return null

  const de = Math.min(...eventos.map((e) => e.ano_inicio))
  const ate = Math.max(...eventos.map(anoFinal))

  if (eventos.length === 1) {
    const unico = eventos[0]
    return { de, ate, rotulo: rotuloDoEvento(unico), legenda: unico.titulo }
  }

  return { de, ate, rotulo: faixaDeAnos(de, ate), legenda: `${eventos.length} eventos` }
}

/** As cores das matérias do evento, na ordem em que ele as lista. */
export function coresDoEvento(materiaSlugs: string[]): string[] {
  return materiaSlugs
    .map((s) => MATERIAS[s as keyof typeof MATERIAS]?.cor)
    .filter((c): c is string => Boolean(c))
}

/**
 * Fundo do marcador no eixo: uma cor só, ou faixas de parada dura quando o
 * evento é de mais de uma matéria.
 *
 * Parada dura (`c 20% 40%`) e não degradê: degradê inventaria cores
 * intermediárias que não são de matéria nenhuma, e num ponto de 9px o
 * resultado vira uma mancha marrom. Assim as duas ou três cores continuam
 * reconhecíveis.
 */
export function fundoDoMarcador(cores: string[]): string {
  if (cores.length === 0) return 'var(--ink-faint)'
  if (cores.length === 1) return cores[0]
  const paradas = cores.map(
    (c, i) => `${c} ${(i / cores.length) * 100}% ${((i + 1) / cores.length) * 100}%`
  )
  return `linear-gradient(90deg, ${paradas.join(', ')})`
}

/* ============================================================
   Cadastro em lote
   ============================================================ */

/** O que uma linha do lote vira, pronto para o `insert`. */
export type EventoEmLote = {
  titulo: string
  ano_inicio: number
  ano_fim: number | null
  rotulo_data: string
  materia_slugs: string[]
  /** null = evento sem resumo que o explique; é o padrão. */
  resumo_id: string | null
}

/**
 * Título normalizado e slug de cada resumo → id, para o quinto campo do lote.
 *
 * Quem monta é quem tem a lista: a tela usa os resumos que `admin/eventos` já
 * carrega para o `<select>`, e o servidor monta o DELE, com a própria consulta.
 * A função continua pura — ela recebe o mapa, nunca vai buscá-lo —, e é isso
 * que permite ao servidor reanalisar o texto bruto sem confiar no navegador.
 */
export type ResumosPorNome = Map<string, string>

export function mapearResumos(
  resumos: { id: string; titulo: string; slug?: string }[]
): ResumosPorNome {
  const m: ResumosPorNome = new Map()
  for (const r of resumos) {
    m.set(normalizar(r.titulo), r.id)
    if (r.slug) m.set(normalizar(r.slug), r.id)
  }
  return m
}

/**
 * Sem acento, sem caixa, e com todo traço virando hífen simples.
 *
 * O acento e a caixa são para casar "História" com `historia`. O traço entrou
 * junto com o quinto campo do lote: títulos de resumo trazem travessão —
 * `Período regencial (1831–1840)`, `Congresso de Viena (1814–1815)` —, e
 * ninguém digita travessão. Sem esta dobra, o autor escreveria o título certo,
 * veria "Resumo desconhecido" e não teria como saber o que está errado, porque
 * as duas strings são visualmente iguais.
 *
 * É a mesma tolerância que `INTERVALO` já dá ao ano, onde `–`, `—` e `-` valem
 * a mesma coisa. Seguro para as matérias, cujos slugs não têm traço nenhum.
 */
function normalizar(t: string) {
  return t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‐-―−]/g, '-')
    .trim()
    .toLowerCase()
}

/** slug → slug, e também "História" → `historia`. */
const SLUG_POR_NOME = new Map<string, string>()
for (const [slug, m] of Object.entries(MATERIAS)) {
  SLUG_POR_NOME.set(slug, slug)
  SLUG_POR_NOME.set(normalizar(m.nome), slug)
}

/**
 * Ano isolado ou intervalo, num campo só.
 *
 * O hífen é ambíguo aqui, e é essa ambiguidade que obriga o casamento a ser
 * feito de uma vez em vez de um `split('-')`: em `1453-1492` ele separa dois
 * anos, e em `-350` ele é o SINAL de "antes de Cristo". Partir a string pelo
 * hífen leria "350 a.C." como um intervalo do ano vazio até 350.
 *
 * Casos que passam: `1789`, `-350`, `350 a.C.`, `1453-1492`, `-500--300`,
 * `500 a.C. – 300 a.C.`, `1914 até 1918`.
 */
/* O separador aceita travessão, hífen ou a palavra "até".
   `at[ée]` vai SEM `\b` no fim: sem a flag `u`, `\b` do JavaScript é ASCII, e
   "é" não conta como caractere de palavra — não há fronteira entre "é" e o
   espaço seguinte, então `\bat[ée]\b` nunca casava com "até". O espaço
   obrigatório de cada lado faz o mesmo trabalho e não depende disso. */
const INTERVALO =
  /^\s*(-?\d+\s*(?:a\.?\s*c\.?)?)\s*(?:\s*(?:–|—|-)\s*|\s+at[ée]\s+)\s*(-?\d+\s*(?:a\.?\s*c\.?)?)\s*$/i

function lerPeriodo(campo: string): { inicio: number; fim: number | null } | null {
  const faixa = INTERVALO.exec(campo)
  if (faixa) {
    const inicio = lerAno(faixa[1])
    const fim = lerAno(faixa[2])
    if (inicio === null || fim === null) return null
    return { inicio, fim }
  }
  const unico = lerAno(campo)
  return unico === null ? null : { inicio: unico, fim: null }
}

/**
 * Uma linha colada vira um evento — ou uma frase dizendo o que está errado.
 *
 * ```
 * 1789        | Queda da Bastilha | historia
 * 1453-1492   | Renascimento      | História, Arte, Literatura
 * -500        | Grécia clássica   | filosofia | séc. V a.C.
 * 1840        | Golpe da Maioridade | historia |  | Período regencial (1831–1840)
 * ```
 *
 * Os três primeiros campos são obrigatórios; o quarto é o `rotulo_data`, para
 * quando a data escrita não cabe num inteiro ("séc. XV", "14/07/1789"); o
 * quinto é o RESUMO que explica o evento, por título ou por slug.
 *
 * O quinto campo existe porque sem ele o lote gravava `resumo_id` nulo para a
 * remessa inteira, e ligar cada evento ao seu resumo era abrir um por um num
 * `<select>` de duzentas e trinta opções sem busca. Ele é o que faz o eixo
 * virar porta de entrada para o acervo em vez de uma lista solta.
 *
 * Nome desconhecido é ERRO, nunca silêncio: até aqui um quinto campo era
 * ignorado sem aviso, que é a mesma armadilha do ano de fim que engolia
 * `séc XV` e gravava um ponto.
 *
 * Função pura, sem rede: é o que permite a tela mostrar o resultado enquanto o
 * autor digita, e é o que deixa o servidor reanalisar tudo sem confiar no que
 * o navegador mandou.
 */
export function analisarLinhaDeEvento(
  linha: string,
  resumos?: ResumosPorNome
): { ok: true; evento: EventoEmLote } | { ok: false; erro: string } {
  const campos = linha.split('|').map((c) => c.trim())

  if (campos.length < 3) {
    return { ok: false, erro: 'Faltam campos — o formato é ano | título | matérias.' }
  }

  const periodo = lerPeriodo(campos[0])
  if (!periodo) {
    return { ok: false, erro: `Não entendi o ano "${campos[0]}". Use 1789, -350 ou 1453-1492.` }
  }
  if (periodo.fim !== null && periodo.fim < periodo.inicio) {
    return { ok: false, erro: 'O ano de fim vem antes do de início.' }
  }

  const titulo = campos[1]
  if (!titulo) return { ok: false, erro: 'O evento precisa de um título.' }

  const pedidas = campos[2]
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)
  if (pedidas.length === 0) return { ok: false, erro: 'Escolha pelo menos uma matéria.' }

  const slugs: string[] = []
  for (const pedida of pedidas) {
    const slug = SLUG_POR_NOME.get(normalizar(pedida))
    if (!slug) return { ok: false, erro: `Matéria desconhecida: "${pedida}".` }
    // sem repetir: "historia, História" é um engano de digitação, não dois chips
    if (!slugs.includes(slug)) slugs.push(slug)
  }

  /* O quinto campo é opcional, mas quando vem preenchido tem de casar. Sem o
     mapa (a tela ainda não carregou os resumos), o campo é aceito e ignorado —
     senão a pré-visualização acusaria erro em linha boa enquanto os dados não
     chegam. Quem grava de verdade é o servidor, e lá o mapa existe sempre. */
  const pedido = campos[4]?.trim() ?? ''
  let resumoId: string | null = null
  if (pedido && resumos) {
    const achado = resumos.get(normalizar(pedido))
    if (!achado) {
      return {
        ok: false,
        erro: `Resumo desconhecido: "${pedido}". Use o título exato ou o slug.`,
      }
    }
    resumoId = achado
  }

  return {
    ok: true,
    evento: {
      titulo,
      ano_inicio: periodo.inicio,
      ano_fim: periodo.fim,
      rotulo_data: campos[3] ?? '',
      materia_slugs: slugs,
      resumo_id: resumoId,
    },
  }
}

/**
 * Cor do título do evento no eixo.
 *
 * Com uma matéria, a cor dela — é a regra do site inteiro (decisão 4c). Com
 * mais de uma, NEUTRO: escolher a primeira faria o Renascimento parecer só de
 * História, que é exatamente a mentira que o evento multimatéria veio desfazer.
 * Quem conta quais são é o marcador listrado ao lado, e o painel de detalhe.
 */
export function corDoRotulo(cores: string[]): string {
  return cores.length === 1 ? cores[0] : 'var(--ink)'
}

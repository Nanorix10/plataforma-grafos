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
  if (e.ano_inicio < 0 && e.ano_fim < 0) {
    return `${Math.abs(e.ano_inicio)}–${Math.abs(e.ano_fim)} a.C.`
  }
  return `${formatarAno(e.ano_inicio)}–${formatarAno(e.ano_fim)}`
}

/** O ano em que o evento termina — o próprio início, se for pontual. */
export function anoFinal(e: { ano_inicio: number; ano_fim: number | null }): number {
  return e.ano_fim ?? e.ano_inicio
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
}

/** Sem acento e em minúsculas, para casar "História" com `historia`. */
function normalizar(t: string) {
  return t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
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
 * ```
 *
 * Os três primeiros campos são obrigatórios; o quarto é o `rotulo_data`, para
 * quando a data escrita não cabe num inteiro ("séc. XV", "14/07/1789").
 *
 * Função pura, sem rede: é o que permite a tela mostrar o resultado enquanto o
 * autor digita, e é o que deixa o servidor reanalisar tudo sem confiar no que
 * o navegador mandou.
 */
export function analisarLinhaDeEvento(
  linha: string
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

  return {
    ok: true,
    evento: {
      titulo,
      ano_inicio: periodo.inicio,
      ano_fim: periodo.fim,
      rotulo_data: campos[3] ?? '',
      materia_slugs: slugs,
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

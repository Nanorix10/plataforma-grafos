/**
 * A faixa do cabeçalho: o que a página sempre tem a dizer sobre si mesma.
 *
 * ============================================================
 * Por que ela existe
 * ============================================================
 * A `.ficha` (decisões 9j, 12e e 12f) responde três perguntas — em que isto
 * está dentro, em que provas cai, quando acontece —, e **cada linha some
 * sozinha quando não tem o que dizer**. Medido no acervo em 04/10/2026, as três
 * somem ao mesmo tempo em **153 dos 254 resumos**: 60% das páginas vão do
 * título direto ao texto, sem degrau nenhum.
 *
 * Não é defeito da ficha — é o acervo: 40 resumos têm pai, 46 são cobrados por
 * edital. A ficha diz a verdade; o que falta é alguma coisa que seja verdade
 * sempre.
 *
 * Esta faixa é derivada, nunca declarada: as seções saem da contagem de
 * títulos que a página já extraiu, o tempo sai do tamanho do corpo, e a última
 * visita sai da tabela `leituras` que a página já carrega. **Nenhuma consulta
 * nova, nenhum campo novo no editor** — e por isso ela não tem como ficar
 * desatualizada em relação ao texto.
 *
 * ============================================================
 * O tempo de leitura é honesto, e por isso é grosso
 * ============================================================
 * 200 palavras por minuto é a faixa baixa da leitura adulta em silêncio, e é a
 * escolhida de propósito: material de estudo não se lê na velocidade de uma
 * notícia, e um número otimista faria o aluno se sentir lento lendo no ritmo
 * certo. O valor é arredondado para cima e **nunca passa de "~1 min" para
 * baixo** — "~0 min" é o tipo de número que parece decidido e não é.
 *
 * A contagem ignora o HTML e conta o TEXTO, senão cada `<span>` do KaTeX
 * entraria como palavra e um resumo de Física leria o dobro do que é.
 */

/** Palavras por minuto. Ver o cabeçalho para o porquê deste número. */
const PALAVRAS_POR_MINUTO = 200

export type FichaResumo = {
  /** Quantos Grafo 1 o resumo tem. Zero em 107 resumos do acervo. */
  secoes: number
  /** "~3 min" — sempre pelo menos 1. */
  leitura: string
  /** As seções como lista de perguntas implícitas; vazia quando não há. */
  responde: string[]
}

/**
 * Só o texto, sem uma tag.
 *
 * As tags viram ESPAÇO, não vazio: `<p>uma</p><p>duas</p>` sem o espaço daria
 * "umaduas", uma palavra onde há duas. É o mesmo cuidado de `textoLimpo` em
 * `lib/titulos.ts`, por motivo diferente — lá para não colar rótulo, aqui para
 * não errar a conta.
 */
function soTexto(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tempoDeLeitura(corpo: string | null | undefined): string {
  const palavras = soTexto(corpo ?? '').split(' ').filter(Boolean).length
  return `~${Math.max(1, Math.ceil(palavras / PALAVRAS_POR_MINUTO))} min`
}

/**
 * O que esta página responde, derivado dos títulos que o autor já escreveu.
 *
 * **Deriva, não inventa.** Seria tentador gerar perguntas de verdade ("por que
 * a polaridade muda o ponto de ebulição?") a partir do texto — e seria o site
 * afirmando o que o autor não escreveu, que é a mesma régua da decisão 9c:
 * transportar não é reescrever. O que entra aqui são os nomes das seções, na
 * ordem em que elas aparecem.
 *
 * **Só Grafo 1**, pelo mesmo motivo que o contador do `globals.css`: a lista
 * existe para dizer de que o resumo trata, e descer a subseção a transformaria
 * no trilho, que já existe e faz isso melhor.
 *
 * **Abaixo de duas seções não vale a pena**, e acima de cinco deixa de ser um
 * enquadramento para virar índice — para índice há o trilho. Nos resumos de
 * seção única e nos 107 sem título nenhum, a lista volta vazia e a faixa mostra
 * só tempo e última visita.
 */
const MINIMO_RESPONDE = 2
const MAXIMO_RESPONDE = 5

export function oQueResponde(titulos: { nivel: number; texto: string }[]): string[] {
  const secoes = titulos.filter((t) => t.nivel === 2).map((t) => t.texto)
  if (secoes.length < MINIMO_RESPONDE) return []
  return secoes.slice(0, MAXIMO_RESPONDE)
}

export function montarFicha(
  corpo: string | null | undefined,
  titulos: { nivel: number; texto: string }[]
): FichaResumo {
  return {
    secoes: titulos.filter((t) => t.nivel === 2).length,
    leitura: tempoDeLeitura(corpo),
    responde: oQueResponde(titulos),
  }
}

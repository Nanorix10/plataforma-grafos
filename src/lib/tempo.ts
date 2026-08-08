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
  materia_slug: string
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

/**
 * O quarto eixo do acervo: **o que cada prova cobra**.
 *
 * Os três que já existiam são `pai_id` ("contém"), `conexoes` ("cita") e
 * `eventos.ano_inicio` ("quando"). Este é "é cobrado em", e ele passou algum
 * tempo escondido dentro do `pai_id` — resumos-sumário chamados "Física na 2ª
 * etapa do PAS UEM" seguravam os tópicos como se fossem filhos. Não são: a
 * etapa não CONTÉM o tópico, ela o COBRA. Ver a decisão 9i do `CONTEXTO.md`.
 *
 * Arquivo puro, sem nada de servidor — mesma divisão de `tempo.ts` × `eventos.ts`
 * e de `arvore.ts` × `resumos.ts`, e pela mesma razão: a tela do edital tem um
 * filtro de cliente e não pode arrastar `next/headers` junto.
 */

export type TopicoEdital = {
  id: string
  processo_slug: string
  etapa: number
  materia_slug: string
  ordem: number
  /** O tópico como o edital escreve. */
  texto: string
  /** `null` quando ainda não há resumo escrito para ele. */
  resumo_slug: string | null
  /** Se o plano do aluno abre esse resumo. */
  liberado: boolean
}

/** Uma matéria dentro de uma etapa, com a conta de cobertura pronta. */
export type BlocoMateria = {
  materia_slug: string
  topicos: TopicoEdital[]
  escritos: number
}

/** Uma etapa de uma prova. */
export type BlocoEtapa = {
  processo_slug: string
  etapa: number
  materias: BlocoMateria[]
  total: number
  escritos: number
}

/**
 * Agrupa a lista chapada em prova → etapa → matéria, preservando a ordem.
 *
 * A ordem das matérias é a que vem da consulta (a canônica de `MATERIAS`, que o
 * `page.tsx` impõe), e a dos tópicos é a coluna `ordem` — que é a posição no
 * documento do autor. Reordenar por nome faria o aluno ler o edital numa ordem
 * que a prova não usa.
 */
export function agruparEdital(topicos: TopicoEdital[]): BlocoEtapa[] {
  const etapas = new Map<string, BlocoEtapa>()

  for (const t of topicos) {
    const chave = `${t.processo_slug}#${t.etapa}`
    let etapa = etapas.get(chave)
    if (!etapa) {
      etapa = {
        processo_slug: t.processo_slug,
        etapa: t.etapa,
        materias: [],
        total: 0,
        escritos: 0,
      }
      etapas.set(chave, etapa)
    }

    let materia = etapa.materias.find((m) => m.materia_slug === t.materia_slug)
    if (!materia) {
      materia = { materia_slug: t.materia_slug, topicos: [], escritos: 0 }
      etapa.materias.push(materia)
    }

    materia.topicos.push(t)
    etapa.total += 1
    if (t.resumo_slug) {
      materia.escritos += 1
      etapa.escritos += 1
    }
  }

  return [...etapas.values()]
}

/** "5 de 21" vira 24. Sem tópico, 0 — e não NaN. */
export function porcentagem(escritos: number, total: number) {
  return total === 0 ? 0 : Math.round((escritos / total) * 100)
}

/**
 * Montagem da árvore de resumos — funções puras, sem nada de servidor.
 *
 * Vive separado de `lib/resumos.ts` porque a barra lateral é um componente de
 * cliente e precisa remontar a árvore ao filtrar pela busca. O `resumos.ts`
 * importa `getSessao`, que usa `next/headers`, e arrastar isso para o cliente
 * quebra o build.
 */

export type ResumoItem = {
  id: string
  slug: string
  titulo: string
  materia_slug: string
  processo_slug: string
  pai_id: string | null
  liberado: boolean
}

/** Um resumo com os que moram dentro dele. */
export type NoResumo = ResumoItem & { filhos: NoResumo[] }

/**
 * Monta a árvore a partir do `pai_id`.
 *
 * Dois cuidados que não são teóricos:
 *
 * 1. Um filho cujo pai não está na lista vira raiz, em vez de sumir. Isso
 *    acontece de verdade — a lista pode ser um recorte (o resultado de uma
 *    busca), e sem esta regra o resumo desapareceria da barra lateral.
 *
 * 2. O `visitados` protege contra ciclo. O banco já barra ciclos por trigger,
 *    mas quem monta a árvore não pode depender disso para não travar a página
 *    inteira num laço infinito se algum dado escapar.
 */
export function montarArvore(resumos: ResumoItem[]): NoResumo[] {
  const porId = new Map<string, NoResumo>()
  for (const r of resumos) porId.set(r.id, { ...r, filhos: [] })

  const raizes: NoResumo[] = []
  for (const no of porId.values()) {
    const pai = no.pai_id ? porId.get(no.pai_id) : undefined
    if (pai && pai.id !== no.id) pai.filhos.push(no)
    else raizes.push(no)
  }

  const visitados = new Set<string>()
  function ordenar(nos: NoResumo[]): NoResumo[] {
    return nos
      .filter((n) => {
        if (visitados.has(n.id)) return false
        visitados.add(n.id)
        return true
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'))
      .map((n) => ({ ...n, filhos: ordenar(n.filhos) }))
  }

  return ordenar(raizes)
}

/** Todos os descendentes de um resumo, em profundidade. */
export function descendentes(no: NoResumo): NoResumo[] {
  return no.filhos.flatMap((f) => [f, ...descendentes(f)])
}

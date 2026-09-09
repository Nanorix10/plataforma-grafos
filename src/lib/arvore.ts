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

/** Um degrau do caminho: o bastante para escrever um link com a cor certa. */
export type Elo = { slug: string; titulo: string; materia_slug: string }

/**
 * O caminho da raiz até o PAI de um resumo — vazio quando ele é raiz.
 *
 * Serve ao indicador de patamar da página de leitura: quem cai em "Movimento
 * circular" pela busca ou pelo mapa não tem como saber que está dentro de
 * "Mecânica > Forças da Mecânica", e a árvore da barra lateral fica fora do
 * campo de visão de quem já rolou a página.
 *
 * Sobe pelo `pai_id` em vez de descer pela árvore montada porque a página de
 * leitura só tem a lista crua, e montar `montarArvore` inteira para achar um
 * ramo seria pagar o percurso de todos os resumos por uma cadeia de dois.
 *
 * O `vistos` é a mesma proteção de `montarArvore`: o trigger do banco barra
 * ciclos, mas quem desenha não pode travar num laço se algum dado escapar.
 */
export function caminhoAteRaiz(
  paiId: string | null,
  porId: Map<string, { id: string; pai_id: string | null } & Elo>
): Elo[] {
  const caminho: Elo[] = []
  const vistos = new Set<string>()

  let atual = paiId
  while (atual && !vistos.has(atual)) {
    vistos.add(atual)
    const no = porId.get(atual)
    if (!no) break
    caminho.unshift({ slug: no.slug, titulo: no.titulo, materia_slug: no.materia_slug })
    atual = no.pai_id
  }

  return caminho
}

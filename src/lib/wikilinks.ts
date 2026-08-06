// Extrai títulos referenciados via [[Nome do resumo]] no corpo de um resumo
export function extrairLinks(corpo: string): string[] {
  const matches = [...corpo.matchAll(/\[\[(.+?)\]\]/g)]
  return matches.map((m) => m[1])
}

// Converte [[Nome]] em HTML de link, resolvendo pelo mapa titulo -> slug
export function renderizarWikilinks(
  corpo: string,
  tituloParaSlug: Record<string, string>
): string {
  return corpo.replace(/\[\[(.+?)\]\]/g, (match, titulo) => {
    const slug = tituloParaSlug[titulo]
    if (!slug) {
      return `<span class="text-[var(--ink-dim)]">[[${titulo}]]</span>`
    }
    return `<a href="/resumos/${slug}" class="font-semibold underline underline-offset-2">${titulo}</a>`
  })
}

// Planos e quais processos seletivos cada um libera
export const PLANO_PROCESSOS: Record<string, string[]> = {
  passe: ['passe'],
  pas: ['pas-uem', 'pas-unb'],
  completo: ['passe', 'pas-uem', 'pas-unb'],
  nenhum: [],
}

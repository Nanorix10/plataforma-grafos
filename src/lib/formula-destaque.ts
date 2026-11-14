/**
 * Fórmula destacada (decisão 8g): um plano na cor da matéria, com filete à
 * esquerda, título opcional em cima e legenda opcional embaixo.
 *
 * Mora em três atributos do nó de fórmula em LINHA PRÓPRIA (`block-math`):
 * `data-destaque="sim"`, `data-titulo` e `data-legenda`. Só a fórmula em bloco
 * pode ser destacada — uma caixa colorida no meio de uma frase partiria a
 * leitura —, e por isso a barra liga "Linha própria" junto com "Destacar".
 *
 * Arquivo sem dependências: é lido pelo editor (navegador) e por
 * `lib/matematica.ts` (servidor).
 */

/** Teto de caracteres de título e legenda. Mais que isso é parágrafo, não rótulo. */
export const TEXTO_DESTAQUE_MAX = 160

/** Texto de título/legenda limpo, ou `null` quando vazio. */
export function lerTextoDestaque(valor: unknown): string | null {
  if (typeof valor !== 'string') return null
  const limpo = valor.replace(/\s+/g, ' ').trim().slice(0, TEXTO_DESTAQUE_MAX)
  return limpo || null
}

/** Escapa para entrar como TEXTO no HTML que o aluno recebe. */
export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

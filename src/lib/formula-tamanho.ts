/**
 * Tamanho das fórmulas, em px.
 *
 * O PADRÃO NÃO É GRAVADO NO NÓ
 * ----------------------------
 * Uma fórmula sem `data-tamanho` segue o padrão, que mora no CSS
 * (`--t-formula` em `globals.css`). Só quem o autor ajustou ganha o atributo.
 * Assim os resumos do acervo não precisam de migration nenhuma, e trocar o
 * padrão um dia é trocar um número — não reescrever o `corpo` de cada resumo.
 *
 * Pelo mesmo motivo a barra grava `null` quando o autor escolhe exatamente o
 * padrão: "22" escolhido e "22" herdado são a mesma intenção, e só o segundo
 * acompanha uma mudança futura do padrão.
 *
 * `TAMANHO_PADRAO` repete o valor de `--t-formula`. São dois lugares porque o
 * CSS desenha e este número só serve para a barra MOSTRAR de onde parte o
 * ajuste — quem mudar um muda o outro.
 *
 * Arquivo sem dependências de propósito: é lido pelo editor (navegador) e por
 * `lib/matematica.ts` (servidor).
 */

export const TAMANHO_PADRAO = 22
export const TAMANHO_MIN = 10
export const TAMANHO_MAX = 64

/**
 * Lê o tamanho de um atributo. Qualquer coisa fora da faixa, ou que não seja
 * número, vale como "sem tamanho" — e a fórmula cai no padrão em vez de sair
 * minúscula ou gigante por um atributo colado de fora.
 */
export function lerTamanho(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null
  const n = Math.round(Number(valor))
  if (!Number.isFinite(n) || n < TAMANHO_MIN || n > TAMANHO_MAX) return null
  return n
}

/** A variável CSS que leva o tamanho até o `.katex` lá dentro. */
export function estiloTamanho(tamanho: number | null): string {
  return tamanho === null ? '' : `--formula-tam:${tamanho}px`
}

/**
 * O grifo como o navegador o conhece. Arquivo puro — ver `lib/grifos.ts`.
 */
export type Grifo = {
  id: string
  /** O texto grifado, exatamente como estava na tela. */
  exato: string
  /** Até `CONTEXTO_DO_GRIFO` letras antes do trecho — desempata trecho repetido. */
  prefixo: string
  /** Até `CONTEXTO_DO_GRIFO` letras depois do trecho. */
  sufixo: string
  /** Vazio quando o aluno só grifou. */
  nota: string
}

/**
 * Quantas letras de cada lado vão junto do trecho. Trinta e duas bastam para
 * desempatar "Proteínas" repetido num resumo, e ficam abaixo dos 64 que a
 * migration aceita.
 */
export const CONTEXTO_DO_GRIFO = 32

/** O teto do banco, repetido aqui para a tela recusar antes de ir e voltar. */
export const MAXIMO_DO_GRIFO = 2000

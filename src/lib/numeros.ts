/**
 * Os números da faixa da landing.
 *
 * ⚠️ **LEIA ANTES DE USAR ESTES VALORES EM QUALQUER OUTRO LUGAR.**
 *
 * Eles são o **escopo declarado da plataforma** — o que ela cobre quando o
 * acervo estiver completo —, e NÃO uma contagem do banco de hoje. A decisão de
 * anunciá-los assim é do Leandro e está tomada: o acervo chega lá, e a landing
 * fala do produto, não do estoque de terça-feira.
 *
 * O que isso significa na prática, e é a razão deste arquivo existir:
 *
 * - **Não derive nada daqui.** `MATERIAS` tem 12 entradas, este arquivo diz 24,
 *   e os dois estão certos sobre coisas diferentes: um é o que já está
 *   cadastrado, o outro é o que o produto cobre. Quem precisar do número REAL
 *   conta a fonte real (`Object.keys(MATERIAS).length`, ou um `count` no
 *   Supabase) — nunca lê daqui.
 * - **Estes valores nunca entram em tela de aluno logado.** Prometer 180 e o
 *   aluno abrir a lista e achar 12 é onde a promessa vira reclamação. Faixa da
 *   landing e mais nada.
 * - Quando o acervo alcançar os números, a coisa certa a fazer é **trocar isto
 *   por contagem de verdade** e apagar este aviso.
 */
export const NUMEROS_DA_FAIXA = [
  { valor: '24', label: 'matérias cobertas' },
  { valor: '3', label: 'processos seletivos' },
  { valor: '180+', label: 'resumos interligados' },
  { valor: 'Campo Grande', label: 'MS, material próprio' },
] as const

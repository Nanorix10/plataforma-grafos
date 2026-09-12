import type { ItemTrilho } from '@/lib/titulos'

/**
 * Qual seção o olho está lendo AGORA.
 *
 * Mora aqui, e não em `lib/titulos.ts`, porque lê o DOM: `titulos.ts` roda no
 * servidor para extrair o trilho do HTML gravado, e arrastar `document` para lá
 * quebraria o build.
 *
 * A pergunta não é "este título está visível" — é "qual foi o ÚLTIMO que passou
 * pela linha do olho". Com títulos curtos e seções de um parágrafo, o formato
 * de quase todo resumo, há três ou quatro visíveis ao mesmo tempo.
 *
 * A linha do olho é um terço da janela abaixo do topo: mais alto e a seção
 * ativa troca antes de o aluno chegar nela; mais baixo e a primeira nunca
 * acende.
 *
 * Usada pelo trilho da coluna, que a chama a cada quadro de rolagem, e pelo
 * sumário do celular, que a chama uma vez ao abrir. Uma função só: duas cópias
 * discordariam sobre onde o aluno está, e o sumário abriria marcando outra
 * seção que a coluna.
 */
export function secaoAtual(itens: ItemTrilho[]): string | null {
  const linha = window.innerHeight * 0.35
  let atual: string | null = null
  for (const item of itens) {
    if (item.tipo !== 'secao') continue
    const el = document.getElementById(item.ancora)
    if (el && el.getBoundingClientRect().top <= linha) atual = item.ancora
  }
  return atual
}

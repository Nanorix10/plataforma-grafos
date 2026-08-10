/**
 * A folha: largura da página e margens do texto.
 *
 * Funções e constantes puras — o editor (cliente) e a página do resumo
 * (servidor) precisam das duas, e é justamente daí que vem o WYSIWYG: se o
 * editor e a leitura calculassem a coluna de formas diferentes, a folha do
 * autor deixaria de mostrar o que o aluno vê (decisão 4).
 *
 * ============================================================
 * Por que a página é MAIOR do que o texto de hoje
 * ============================================================
 * Antes o editor tinha folha de 760px com 70px de recuo (coluna de 620) e a
 * página publicada tinha 720px com 40px (coluna de 640) — dois números
 * diferentes para a mesma coisa, e nenhum ajustável.
 *
 * Agora a folha tem 920px e a margem padrão é 150, o que devolve a MESMA
 * coluna de 620px de antes. A diferença é que agora sobra para onde crescer:
 * arrastando as margens até o mínimo, o texto vai a 880px. Sem essa folga, a
 * régua só saberia apertar.
 */
export const LARGURA_PAGINA = 920

/** Margem padrão de cada lado. 920 − 150 − 150 = a coluna de 620 de sempre. */
export const MARGEM_PADRAO = 150

/** Nada de margem negativa: o texto não pode sair da folha. */
export const MARGEM_MINIMA = 20

/**
 * Coluna mínima de texto.
 *
 * Não é capricho: abaixo de ~280px a linha fica tão curta que quebra no meio
 * de qualquer palavra composta, e uma fórmula do KaTeX passa a estourar a
 * caixa. É o piso que impede a régua de produzir uma folha inutilizável.
 */
export const COLUNA_MINIMA = 280

/** Prende os dois valores dentro do que a folha aguenta. */
export function ajustarMargens(esq: number, dir: number) {
  const e = Math.max(MARGEM_MINIMA, Math.round(esq))
  const d = Math.max(MARGEM_MINIMA, Math.round(dir))

  // se os dois juntos comeriam a coluna, o excesso sai proporcionalmente —
  // encolher só um dos lados moveria o texto de lugar sem o autor ter pedido
  const sobra = LARGURA_PAGINA - e - d
  if (sobra >= COLUNA_MINIMA) return { esq: e, dir: d }

  const excesso = COLUNA_MINIMA - sobra
  const total = e + d
  return {
    esq: Math.max(MARGEM_MINIMA, Math.round(e - (excesso * e) / total)),
    dir: Math.max(MARGEM_MINIMA, Math.round(d - (excesso * d) / total)),
  }
}

/**
 * As variáveis que a folha e a página publicada consomem.
 *
 * Vão como custom properties, e não como `padding` direto, porque
 * `.conteudo-resumo` precisa das margens para DUAS coisas opostas: recuar o
 * texto e deixar imagem e tabela escaparem do recuo (ver `.escapa` em
 * globals.css). Um `padding` só serviria à primeira.
 */
export function estiloDaPagina(esq: number, dir: number) {
  const m = ajustarMargens(esq, dir)
  return {
    '--pagina': `${LARGURA_PAGINA}px`,
    '--margem-esq': `${m.esq}px`,
    '--margem-dir': `${m.dir}px`,
  } as React.CSSProperties
}

import { PROCESSOS } from '@/lib/processos'

/**
 * Fonte única do que é um plano: nome comercial, o que abre, e quanto custa.
 *
 * Antes isso morava em três lugares que não conversavam. O mapa plano→processos
 * estava encalhado no fim de `lib/wikilinks.ts` — o módulo que converte
 * `[[Título]]` em link, que não tem nada a ver com o que o aluno comprou. O
 * nome comercial estava escrito à mão dentro do JSX da landing, e OUTRA grafia
 * dos mesmos planos estava em `(app)/conta/page.tsx`. O mesmo produto se
 * chamava "Acesso PASSE" na página de vendas e "PASSE" na conta do aluno.
 *
 * O preço entra aqui pelo mesmo motivo, e ainda não existe: `preco: null` é
 * "não decidido", e a interface é obrigada a tratar esse caso em vez de
 * mostrar um `R$ 00` de mentira — que era o que estava no ar.
 *
 * **Quando o pagamento pelo Mercado Pago entrar**, é este arquivo que o
 * checkout lê. Nada mais precisa saber de preço.
 */

export type Plano = {
  /** Como o aluno vê, na landing e na conta. Um nome só, no site inteiro. */
  nome: string
  /** Processos seletivos que o plano libera. Vazio = não vê resumo nenhum. */
  processos: string[]
  /** Preço mensal em reais. `null` enquanto o Leandro não decidir. */
  preco: number | null
  /** O cartão em destaque na landing. No máximo um. */
  destaque?: boolean
  /**
   * Para quem este plano serve, em uma frase que o aluno reconheça.
   *
   * É a única informação de venda escrita à mão aqui, e ela é DERIVADA do
   * produto: diz qual prova o plano cobre, não promete benefício. Vantagem
   * inventada numa página de preço é a mentira que mais custa caro depois.
   */
  paraQuem: string
}

export const PLANOS: Record<string, Plano> = {
  passe: {
    nome: 'Acesso PASSE',
    processos: ['passe'],
    preco: null,
    paraQuem: 'Você presta só o PASSE, da UFMS.',
  },
  completo: {
    nome: 'Acesso Completo',
    processos: ['passe', 'pas-uem', 'pas-unb'],
    preco: null,
    paraQuem: 'Você presta mais de um, ou ainda não decidiu quais vai fazer.',
    destaque: true,
  },
  pas: {
    nome: 'Acesso PAS',
    processos: ['pas-uem', 'pas-unb'],
    preco: null,
    paraQuem: 'Você presta o PAS da UEM, o da UnB, ou os dois — e não o PASSE.',
  },
  /**
   * `nenhum` é o plano de quem acabou de se cadastrar — ver a decisão 1b do
   * CONTEXTO.md. Lista vazia, então o trigger do banco pode abrir a conta sem
   * liberar conteúdo nenhum. Fica FORA da landing (não é produto à venda), e é
   * por isso que quem monta a vitrine usa `PLANOS_A_VENDA`, não `PLANOS`.
   */
  nenhum: {
    nome: 'Sem acesso',
    processos: [],
    preco: null,
    paraQuem: 'Estado de quem se cadastrou e ainda não teve o acesso liberado.',
  },
}

/**
 * O mapa cru que sete arquivos já consumiam, agora derivado em vez de escrito
 * à mão. Mantido com o mesmo nome e o mesmo formato de propósito: o que muda é
 * de ONDE ele vem, não o que ele é — assim a troca não toca na lógica de
 * liberação de acesso, que é a parte que não pode quebrar.
 */
export const PLANO_PROCESSOS: Record<string, string[]> = Object.fromEntries(
  Object.entries(PLANOS).map(([slug, p]) => [slug, p.processos])
)

/**
 * O que TODO plano entrega, sem exceção.
 *
 * Vale a pena dizer isto em voz alta na página de planos, porque é a coisa
 * mais útil que ela tem a informar: **os planos não diferem em recurso, só em
 * cobertura**. Ninguém compra o mais caro para destravar uma função — compra
 * porque presta mais de uma prova. Esconder isso venderia mais no primeiro mês
 * e geraria pedido de reembolso no segundo.
 */
export const INCLUI_SEMPRE = [
  'Todas as matérias do processo seletivo escolhido',
  'Resumos interligados, com o mapa de conexões',
  'Linha do tempo dos eventos históricos',
  'Leitura no próprio site, sem baixar nada',
  'Atualizações do acervo enquanto o acesso estiver ativo',
] as const

/** Os planos que aparecem na vitrine, na ordem em que ela os mostra. */
export const PLANOS_A_VENDA = (['passe', 'completo', 'pas'] as const).map((slug) => ({
  slug,
  ...PLANOS[slug],
  /** "PASSE UFMS · PAS UEM · PAS UnB" — nome de verdade, não slug. */
  processosLegiveis: PLANOS[slug].processos
    .map((p) => PROCESSOS[p]?.nome ?? p)
    .join(' · '),
}))

/**
 * Como o preço aparece enquanto não há preço.
 *
 * Devolver "R$ 00" seria mentir com número, que é o pior jeito de mentir numa
 * página de venda — parece decidido e barato ao mesmo tempo. "A definir" diz a
 * verdade e não custa credibilidade nenhuma num produto que ainda vai abrir.
 */
export function precoLegivel(preco: number | null): string {
  if (preco === null) return 'A definir'
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

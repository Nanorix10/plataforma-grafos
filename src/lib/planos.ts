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
}

export const PLANOS: Record<string, Plano> = {
  passe: {
    nome: 'Acesso PASSE',
    processos: ['passe'],
    preco: null,
  },
  completo: {
    nome: 'Acesso Completo',
    processos: ['passe', 'pas-uem', 'pas-unb'],
    preco: null,
    destaque: true,
  },
  pas: {
    nome: 'Acesso PAS',
    processos: ['pas-uem', 'pas-unb'],
    preco: null,
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

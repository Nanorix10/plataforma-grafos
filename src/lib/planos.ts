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
 * O preço entra aqui pelo mesmo motivo. Ficou `null` ("não decidido") até
 * 16/10/2026, e a interface continua tratando esse caso em vez de mostrar um
 * `R$ 00` de mentira. Os valores de hoje são de PRIMEIRA TURMA: pagamento
 * único, valendo até o fim das provas de 2026 — ver `PERIODO_DE_ACESSO`. A
 * conta por trás (concorrência, custo de infraestrutura, dias até cada prova,
 * conteúdo de cada plano) está na wiki, em "Preços dos planos".
 *
 * **Quando o pagamento pelo Mercado Pago entrar**, é este arquivo que o
 * checkout lê. Nada mais precisa saber de preço.
 */

export type Plano = {
  /** Como o aluno vê, na landing e na conta. Um nome só, no site inteiro. */
  nome: string
  /**
   * Processos seletivos que o plano libera. Vazio = não vê resumo nenhum.
   *
   * Todo plano à venda inclui `comum`, o conteúdo que não é de um vestibular
   * só (ver `lib/processos.ts`). `nenhum` continua com a lista vazia de
   * propósito: cadastro é aberto (decisão 1b), então pôr `comum` ali daria
   * acervo de graça a quem só criou conta.
   *
   * > [!important] Esta lista também existe no BANCO, em `plano_processos`.
   * > Mudou aqui? **Gere uma migration junto**, senão as duas discordam.
   * >
   * > A duplicação não é descuido: desde 13/09 é o Postgres que decide quem lê
   * > o `corpo` de um resumo, e uma policy não consegue ler um arquivo
   * > TypeScript. O que fica aqui é a vitrine (nome, preço, para quem); o que
   * > desce para lá é só o que a regra de acesso precisa saber.
   * >
   * > Se as duas divergirem, o banco nega e o aluno vê a tela de bloqueio —
   * > falha para o lado seguro, mas continua sendo falha.
   */
  processos: string[]
  /**
   * Preço em reais, pago UMA vez, pelo período de `PERIODO_DE_ACESSO`.
   * `null` = não decidido. Não é mensalidade: a tela não pode dizer "/mês".
   */
  preco: number | null
  /**
   * O selo do cartão em destaque, **e o texto dele**. No máximo um plano tem.
   *
   * É um campo só, e não um `destaque: boolean` mais um texto escrito no JSX,
   * porque era assim que estava e o texto tinha divergido do fato: a landing e
   * a página de planos escreviam **"Mais escolhido"** à mão, cada uma na sua
   * cópia. Ninguém escolheu nada — não há um aluno pagante sequer. Era uma
   * afirmação de popularidade sem dado nenhum atrás, numa página cujo
   * argumento inteiro é que nada aqui é inventado (o `Depoimentos.tsx` devolve
   * `null` em vez de mostrar depoimento de exemplo, pelo mesmo motivo).
   *
   * "Mais completo" é comparação entre os três planos desta mesma página, e a
   * tabela de cobertura em `/planos` a comprova. Não depende de aluno nenhum
   * para ser verdade.
   *
   * O selo volta a poder falar de escolha no dia em que houver escolha para
   * contar — e muda aqui, num lugar só.
   */
  selo?: string
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
    processos: ['passe', 'comum'],
    preco: 39,
    paraQuem: 'Você presta só o PASSE, da UFMS.',
  },
  completo: {
    nome: 'Acesso Completo',
    processos: ['passe', 'pas-uem', 'pas-unb', 'comum'],
    preco: 49,
    paraQuem: 'Você presta mais de um, ou ainda não decidiu quais vai fazer.',
    selo: 'Mais completo',
  },
  pas: {
    nome: 'Acesso PAS',
    processos: ['pas-uem', 'pas-unb', 'comum'],
    preco: 35,
    /*
     * A segunda frase é obrigatória enquanto o PAS UnB não tiver resumo
     * próprio (0 em 16/10/2026, nem tópico de edital). Sem ela, quem presta só
     * a UnB compraria esperando o que não existe — o pedido de reembolso que o
     * `paraQuem` existe para evitar. Tire quando houver conteúdo da UnB.
     */
    paraQuem:
      'Você presta o PAS da UEM, o da UnB, ou os dois — e não o PASSE. O PAS UnB ainda não tem resumo próprio: por enquanto, ele leva o conteúdo comum.',
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
 * Quanto tempo o pagamento vale. Um fato só, lido pelos cartões de preço, pela
 * lista do `INCLUI_SEMPRE` e pela FAQ — trocar a data aqui troca em todas.
 *
 * É até 31/12 e não até a data de cada prova porque as três caem entre 1º/11
 * (PAS UEM) e 13/12 (PASSE e PAS 2 da UnB), e um prazo por plano seria uma
 * regra que o admin teria de lembrar aluno a aluno. **A expiração é manual**,
 * como a liberação: em janeiro, bloquear em `/admin/pessoas`.
 */
export const PERIODO_DE_ACESSO = {
  curto: 'pagamento único',
  longo: 'Pagamento único. O acesso vale até 31/12/2026, depois das provas deste ano.',
  ate: '31/12/2026',
} as const

/**
 * Em quanto tempo o acesso é liberado depois do pagamento.
 *
 * A liberação é manual (decisão 1b do `CONTEXTO.md`), e "feita por nós depois
 * do pagamento" sem prazo é o ponto em que um comprador que nunca ouviu falar
 * do site desiste: parece dinheiro mandado para ninguém. 24 horas foi o prazo
 * que o Leandro escolheu por conseguir cumprir mesmo em semana de prova — é
 * promessa, então só muda aqui, e as quatro telas que falam da liberação leem
 * esta frase. Quando o webhook do pagamento existir, ela vira "na hora".
 */
export const PRAZO_DE_LIBERACAO = 'em até 24 horas' as const

/**
 * Por onde o aluno avisa que pagou.
 *
 * "Nos avisa do pagamento" sem dizer ONDE deixava o comprador sem o passo
 * seguinte justamente depois de pagar. É o perfil pessoal do Leandro, e não um
 * perfil da marca, de propósito: a confiança do lançamento vem de ser ele.
 */
export const CANAL_DE_AVISO = {
  nome: 'direct do Instagram',
  arroba: '@leandroverduguez',
  url: 'https://www.instagram.com/leandroverduguez/',
} as const

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
  'O conteúdo comum a mais de um vestibular, seja qual for o plano',
  'Resumos interligados, com o mapa de conexões',
  'Questões de prova com resolução, respondidas no próprio resumo',
  'Linha do tempo dos eventos históricos',
  'Leitura no próprio site, sem baixar nada',
  `Atualizações do acervo até ${PERIODO_DE_ACESSO.ate}`,
] as const

/** Os planos que aparecem na vitrine, na ordem em que ela os mostra. */
export const PLANOS_A_VENDA = (['passe', 'completo', 'pas'] as const).map((slug) => ({
  slug,
  ...PLANOS[slug],
  /**
   * "PASSE UFMS · PAS UEM · PAS UnB" — nome de verdade, não slug.
   *
   * `comum` sai daqui: a linha diz qual PROVA o plano cobre, e é isso que
   * decide a compra. "Conteúdo comum" no meio da lista pareceria um quarto
   * vestibular. Que ele entra em todos os planos, quem informa é o
   * `INCLUI_SEMPRE`, logo abaixo na mesma página.
   */
  processosLegiveis: PLANOS[slug].processos
    .filter((p) => !PROCESSOS[p]?.universal)
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

/**
 * Se já dá para falar de preço na vitrine.
 *
 * Derivado, e não uma chave escrita à mão, porque um interruptor separado do
 * `preco` é a coisa que fica ligada depois que o fato mudou.
 */
export const PRECOS_ANUNCIADOS = PLANOS_A_VENDA.every((p) => p.preco !== null)

/**
 * O que a vitrine diz **no lugar** do preço, enquanto não há preço.
 *
 * O `precoLegivel` já resolvia o cartão isolado ("A definir" em vez de um
 * `R$ 00` de mentira). O que ele não resolve é a seção: três cartões repetindo
 * "A definir" e um botão "Criar conta" deixavam o visitante sem resposta
 * justamente no ponto em que ele decide — e as três não-respostas juntas leem
 * como site inacabado, não como produto que ainda não abriu.
 *
 * As três frases abaixo não inventam nada e não prometem nada. Cada uma já era
 * verdade escrita em outro lugar do repositório; o que faltava era estarem no
 * momento da decisão, e não coladas embaixo:
 *
 * - o preço não decidido é o `preco: null` daqui de cima;
 * - a conta que nasce sem acesso é o plano `nenhum` (decisão 1b do
 *   `CONTEXTO.md`);
 * - a liberação manual é a primeira resposta do `lib/faq.ts`, que hoje só
 *   aparece se o visitante abrir o acordeão no fim da página.
 *
 * Some sozinho quando o preço entrar. Nenhuma tela precisa lembrar de o tirar.
 */
export const AVISO_SEM_PRECO = {
  titulo: 'Os preços ainda não foram anunciados.',
  texto:
    'Criar conta agora é de graça e não gera cobrança: ela nasce sem acesso, e a liberação é feita por nós depois do pagamento.',
} as const

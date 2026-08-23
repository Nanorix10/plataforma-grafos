export type Processo = {
  /** Como aparece na conta do aluno, na vitrine de planos e no editor. */
  nome: string
  /**
   * Verdadeiro para o que NÃO é uma prova que o aluno presta.
   *
   * `comum` é o único caso: conteúdo que todo plano abre, porque cai em mais de
   * um edital (a Estatística está no do PASSE e no do PAS UEM, com o mesmo
   * texto) ou porque não é de vestibular nenhum — é o destino do material de
   * prova de escola que ainda vai entrar.
   *
   * A marca existe porque `resumos.processo_slug` é escalar: um resumo pertence
   * a UM processo. Sem ela, conteúdo compartilhado só teria duas saídas, e as
   * duas são ruins — ficar preso a um dos vestibulares, ou virar dois resumos
   * com o MESMO título, o que quebra os `[[wikilinks]]` em silêncio (o trigger
   * `sync_conexoes_resumo` resolve o destino pelo título).
   *
   * Quem lê a marca são as telas que listam "os vestibulares": a conta do aluno
   * e a tabela de cobertura da vitrine. Lá `comum` não pode aparecer — ninguém
   * presta Conteúdo comum, e mostrá-lo como linha faria o aluno procurar a
   * prova com esse nome. No editor ele aparece, porque lá é o autor escolhendo
   * onde o resumo mora.
   */
  universal?: boolean
}

export const PROCESSOS: Record<string, Processo> = {
  passe: { nome: 'PASSE UFMS' },
  'pas-uem': { nome: 'PAS UEM' },
  'pas-unb': { nome: 'PAS UnB' },
  comum: { nome: 'Conteúdo comum', universal: true },
}

/** Só o que é prova de verdade — o que o aluno escolhe ao comprar. */
export const PROVAS: Record<string, Processo> = Object.fromEntries(
  Object.entries(PROCESSOS).filter(([, p]) => !p.universal)
)

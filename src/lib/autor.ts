/**
 * Quem escreveu o material.
 *
 * A landing vende "os resumos de quem passou pela prova", e essa frase só tem
 * lastro se disser QUEM e COM QUAL resultado. Este arquivo é onde isso mora.
 *
 * **Campo `null` não é renderizado.** É de propósito: a seção precisa poder
 * entrar no ar verdadeira e incompleta, em vez de esperar por um dado ou —
 * pior — inventá-lo. Afirmação de desempenho numa página de venda é o tipo de
 * coisa que, se sair errada, derruba a credibilidade que ela veio construir.
 *
 * Preencher aqui completa a seção. Nada mais precisa mudar.
 */

export type Conquista = {
  /** O que foi conquistado. Ex.: "1º lugar geral" */
  titulo: string
  /** Onde. Ex.: "ranking do PASSE — UFMS" */
  onde: string
  /** Quando. Ano é obrigatório: conquista sem ano soa inventada. */
  ano: number
}

export const AUTOR = {
  nome: 'Leandro',

  /**
   * ⏳ FALTA: a colocação exata, com posição, ranking e ano.
   *
   * Enquanto a lista estiver vazia a seção mostra o material e o método, e
   * NÃO faz afirmação de desempenho. É o que sustenta a headline do campeão —
   * sem isso, "melhor do estado" seria uma frase sem prova ao lado dela, que
   * é a única forma de ela enfraquecer em vez de vender.
   *
   * Exemplo do formato esperado, para preencher e apagar este comentário:
   *   { titulo: '1º lugar geral', onde: 'ranking do PASSE — UFMS', ano: 2025 }
   */
  conquistas: [] as Conquista[],

  /**
   * O que é verdade hoje e já dá para dizer. Vem do checklist do produto:
   * material 100% original, escrito por quem prestou as mesmas provas.
   */
  pontos: [
    {
      titulo: 'Material 100% original',
      texto:
        'Nada de resumo compilado de terceiros. Cada assunto foi escrito de novo, do zero, para este acervo.',
    },
    {
      titulo: 'Escrito por quem prestou a prova',
      texto:
        'Não é professor explicando o que imagina que o aluno não entende. É quem passou pela dificuldade escolhendo por onde começar.',
    },
    {
      titulo: 'Revisado a cada etapa',
      texto:
        'O conteúdo acompanha o edital do ano, e cada resumo é revisto antes da etapa a que ele serve.',
    },
  ],

  /**
   * ⏳ FALTA: a foto. Caminho reservado em `public/img/`.
   *
   * Decidido com o Davi: mesa de estudo sem pessoa — caderno aberto com resumo
   * escrito à mão, caneta, luz morna de fim de tarde. Sem rosto: vende o ritual
   * de estudar, não envelhece, e não corre o risco de o aluno não se
   * identificar com quem aparece.
   *
   * `null` até o arquivo existir. A seção se recompõe sem ela em vez de deixar
   * um retângulo cinza no lugar, que é pior que ausência.
   */
  foto: null as { src: string; alt: string; largura: number; altura: number } | null,
}

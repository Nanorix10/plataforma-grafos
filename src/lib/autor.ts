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
   * O que ele conquistou, com onde e quando.
   *
   * **O tempo verbal do 1º lugar é decisão, não estilo.** O PASSE é seriado:
   * liderar hoje não é ter vencido. "Está em 1º lugar" é presente e diz a
   * verdade sozinho; "tirou o 1º lugar" afirmaria um resultado final que ainda
   * não existe, e é o tipo de frase que um concorrente desmonta com uma
   * pergunta. Por isso o `titulo` abaixo não usa passado, e a headline da
   * landing também não.
   *
   * **O "cursando o primeiro ano" do ENEM não é adorno.** 920 na redação é
   * ótimo; 920 fazendo a prova no primeiro ano do ensino médio é outra
   * categoria. Se essa parte cair num corte de texto, a conquista encolhe pela
   * metade.
   *
   * **O ano fica em todas.** Conquista com data lê como registro; sem data lê
   * como slogan, e é a primeira coisa que alguém pede ao duvidar.
   */
  conquistas: [
    {
      titulo: 'Está em 1º lugar em medicina',
      onde: 'PASSE da UFMS, entre todos os candidatos',
      ano: 2025,
    },
    {
      titulo: '920 na redação do ENEM',
      onde: 'cursando o primeiro ano do ensino médio',
      ano: 2025,
    },
    {
      titulo: 'Medalha de ouro',
      onde: 'ranking de notas do Poliedro no Colégio Harmonia',
      ano: 2025,
    },
  ] as Conquista[],

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
   * A foto da seção.
   *
   * Decidido com o Davi: mesa de estudo **sem pessoa** — vende o ritual de
   * estudar, não envelhece, e não corre o risco de o aluno não se identificar
   * com quem aparece. Sem rosto também elimina a questão de gerar a imagem de
   * alguém que não existe numa página que vende credibilidade.
   *
   * **Por que clara, e não a primeira tentativa.** A primeira saiu quase
   * noturna, e o tema claro do site tem `--paper` quase branco: uma foto escura
   * viraria um bloco preto no meio da página. A escolhida tem madeira clara e
   * papel creme, então convive com os dois temas — o que era exatamente o
   * critério, já que a landing tem que funcionar nos três estados de tema.
   *
   * WebP de 84 KB a 960px de largura, que é o dobro da coluna em que ela é
   * exibida (~440px). O `next/image` reduz mais conforme a tela pede.
   *
   * O tipo continua aceitando `null`: se a foto sair, a seção volta a se
   * recompor em uma coluna em vez de deixar um retângulo vazio.
   */
  foto: {
    src: '/img/mesa-de-estudo.webp',
    /* Alt descreve o que a foto MOSTRA, não "foto de estudo". Quem usa leitor
       de tela recebe a cena, que é o que o vidente recebe. */
    alt: 'Caderno espiral aberto sobre uma mesa de madeira clara, com páginas de anotações escritas à mão, uma caneta apoiada e uma xícara de café ao lado, junto a uma janela',
    largura: 960,
    altura: 1280,
  } as { src: string; alt: string; largura: number; altura: number } | null,
}

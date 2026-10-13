import type { JSONContent } from '@tiptap/core'

/**
 * Os blocos do estilo do site, prontos para inserir.
 *
 * Cada um é o molde de `docs/produto/modelo-de-resumo.md` §4 — o mesmo que a
 * skill `rascunhar-resumo` escreve (`formato.md`). Antes, o autor montava cada
 * peça à mão: a caixa de pegadinhas era uma tabela de duas colunas com uma
 * apagada, e a questão saía como "(Banca) enunciado…", sem os itens (01),
 * (02)… nem as alternativas A)…E) que a página precisa para ficar clicável
 * (decisão 22). O molde já nasce no formato que `analisarQuestao` reconhece.
 *
 * O texto dentro de cada molde é instrução para quem escreve, no lugar exato
 * onde o conteúdo entra, e é para ser sobrescrito.
 */

const texto = (t: string, negrito = false): JSONContent => ({
  type: 'text',
  text: t,
  ...(negrito ? { marks: [{ type: 'bold' }] } : {}),
})

const p = (...partes: (string | JSONContent)[]): JSONContent => ({
  type: 'paragraph',
  content: partes.map((x) => (typeof x === 'string' ? texto(x) : x)),
})

const vazio: JSONContent = { type: 'paragraph' }

const item = (...blocos: JSONContent[]): JSONContent => ({ type: 'listItem', content: blocos })

const celula = (tipo: 'tableCell' | 'tableHeader', ...blocos: JSONContent[]): JSONContent => ({
  type: tipo,
  content: blocos,
})

const ITENS_SOMA = ['01', '02', '04', '08', '16']
const LETRAS = ['A', 'B', 'C', 'D', 'E']

export type Bloco = {
  chave: string
  nome: string
  /** Para que serve, em uma linha — é o que o menu mostra embaixo do nome. */
  uso: string
  conteudo: () => JSONContent | JSONContent[]
}

export const BLOCOS: Bloco[] = [
  {
    chave: 'somatoria',
    nome: 'Questão somatória',
    uso: 'Itens (01) a (16), resolução item a item e a soma',
    conteudo: () => ({
      type: 'questao',
      attrs: { id: crypto.randomUUID() },
      content: [
        p('(Prova Ano, etapa) Enunciado. Assinale o que for correto.'),
        ...ITENS_SOMA.map((n) => p(`(${n}) item;`)),
        p('Dê a soma dos itens corretos.'),
        {
          type: 'resolucao',
          content: [
            ...ITENS_SOMA.map((n) => p(`(${n}) Correta. / Incorreta. porque…;`)),
            p(texto('Soma: ', true)),
          ],
        },
      ],
    }),
  },
  {
    chave: 'objetiva',
    nome: 'Questão objetiva',
    uso: 'Alternativas A) a E), uma por linha',
    conteudo: () => ({
      type: 'questao',
      attrs: { id: crypto.randomUUID() },
      content: [
        p('(Prova Ano) Enunciado.'),
        ...LETRAS.map((l) => p(`${l}) alternativa;`)),
        { type: 'resolucao', content: [p('Resolução: …')] },
      ],
    }),
  },
  {
    chave: 'discursiva',
    nome: 'Questão discursiva',
    uso: 'Sem alternativas; o aluno responde Acertei / Errei',
    conteudo: () => ({
      type: 'questao',
      attrs: { id: crypto.randomUUID() },
      content: [p('(Prova Ano) Enunciado.'), { type: 'resolucao', content: [p('Resolução: …')] }],
    }),
  },
  {
    chave: 'pegadinhas',
    nome: 'Pegadinhas',
    uso: 'Caixa com o erro que a prova cobrou e a origem',
    conteudo: () => ({
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            celula(
              'tableCell',
              p(texto('Pegadinhas:', true)),
              {
                type: 'bulletList',
                content: [item(p('afirmação correta que a prova inverteu (Prova Ano, etapa).'))],
              },
            ),
          ],
        },
      ],
    }),
  },
  {
    chave: 'comparativa',
    nome: 'Tabela comparativa',
    uso: 'Par ou série confundível, critério por linha',
    conteudo: () => ({
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            celula('tableHeader', vazio),
            celula('tableHeader', p(texto('A', true))),
            celula('tableHeader', p(texto('B', true))),
          ],
        },
        {
          type: 'tableRow',
          content: [celula('tableCell', p('Critério')), celula('tableCell', p('…')), celula('tableCell', p('…'))],
        },
      ],
    }),
  },
  {
    chave: 'resolvido',
    nome: 'Exemplo resolvido',
    uso: 'Um passo por item, com a fórmula usada',
    conteudo: () => [
      p(texto('Ex:', true), ' enunciado do exemplo;'),
      {
        type: 'orderedList',
        content: [
          item(p('o que se faz e com que fórmula;')),
          item(p('a conta;')),
          item(p('o resultado, com unidade.')),
        ],
      },
    ],
  },
  {
    chave: 'revisar',
    nome: 'Para revisar',
    uso: 'Fecho de 4 a 8 pares que viram cartões',
    conteudo: () => [
      { type: 'heading', attrs: { level: 2 }, content: [texto('Para revisar')] },
      ...[1, 2, 3, 4].flatMap(() => [
        { type: 'heading', attrs: { level: 3, corrido: true }, content: [texto('Termo:')] },
        p('resposta em uma linha;'),
      ]),
    ],
  },
]

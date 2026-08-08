import { Node, mergeAttributes } from '@tiptap/core'

/**
 * Questão resolvida com a resolução escondida até o aluno pedir.
 *
 * É o único bloco que existe PORQUE o material virou site. No Google Docs a
 * resolução fica logo abaixo do enunciado, então o olho a lê antes de a cabeça
 * tentar — a questão vira exemplo, não exercício. Aqui ela só aparece no
 * clique.
 *
 * São dois nós, e não um só com um atributo, porque o enunciado e a resolução
 * têm destinos diferentes na hora de ler: o enunciado é texto normal do resumo,
 * a resolução é uma gaveta. Um nó com "parte escondida" precisaria de uma marca
 * arbitrária dizendo onde uma acaba e a outra começa.
 *
 * ## Por que <div> e não <details> aqui
 *
 * O natural seria o editor já gravar `<details>`, que abre e fecha sozinho, sem
 * JavaScript. O problema é do lado de quem ESCREVE: dentro do editor um
 * `<details>` fechado esconde o próprio texto que o autor está editando, e o
 * clique no `<summary>` briga com o clique que posiciona o cursor.
 *
 * Então o editor grava `<div class="resolucao">`, sempre visível, e a troca
 * para `<details>` acontece na leitura, em `lib/questoes.ts` — no mesmo ponto
 * em que wikilinks e fórmulas já são convertidos. O corpo guardado continua
 * sendo HTML honesto, legível sem nenhuma das duas pontas.
 */

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    questaoResolvida: {
      /** Insere o esqueleto de uma questão com a gaveta de resolução. */
      inserirQuestao: () => ReturnType
    }
  }
}

/** A gaveta. Vira `<details>` na página publicada. */
export const Resolucao = Node.create({
  name: 'resolucao',
  group: 'block',
  content: 'block+',
  // `defining` mantém o nó vivo quando se apaga tudo que está dentro dele: sem
  // isso, um Ctrl+A seguido de Backspace dentro da resolução dissolveria a
  // gaveta e o texto voltaria a ser parágrafo solto do resumo.
  defining: true,

  parseHTML() {
    return [{ tag: 'div.resolucao' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'resolucao' }), 0]
  },
})

/** A moldura: enunciado, alternativas e, no fim, a gaveta. */
export const Questao = Node.create({
  name: 'questao',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'aside.questao' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['aside', mergeAttributes(HTMLAttributes, { class: 'questao' }), 0]
  },

  addCommands() {
    return {
      inserirQuestao:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '(Banca) enunciado da questão…' }],
              },
              {
                type: 'resolucao',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Resolução: ' }],
                  },
                ],
              },
            ],
          }),
    }
  },
})

/**
 * O que alunos reais disseram.
 *
 * ⚠️ **A LISTA ESTÁ VAZIA DE PROPÓSITO, E ESSA É A DECISÃO MAIS IMPORTANTE
 * DESTE ARQUIVO.**
 *
 * O material já foi vendido informalmente no ano passado, então existem alunos
 * de verdade com opinião de verdade. Até a opinião deles chegar — com nome e
 * autorização —, a seção não aparece no site.
 *
 * Por que não um depoimento "de exemplo" enquanto isso: esta landing vende a
 * reputação do autor. Depoimento inventado numa página que usa reputação como
 * argumento não é um placeholder, é a destruição do argumento — e não tem como
 * desinventar depois que um aluno reconhece que o colega citado não existe.
 * Também é propaganda enganosa, o que é problema de lei, não de gosto.
 *
 * `Depoimentos.tsx` devolve `null` com a lista vazia: a seção simplesmente não
 * existe na página, em vez de aparecer como um bloco vazio pedindo desculpa.
 *
 * ## Como preencher
 *
 * Um depoimento entra quando tem as três coisas:
 *
 * 1. **Texto que a pessoa escreveu**, não parafraseado. Se foi por áudio no
 *    WhatsApp, transcreva sem melhorar.
 * 2. **Nome real** e o processo seletivo que ela prestou. "Aluna, 17 anos" não
 *    é atribuição, é anonimato disfarçado, e o leitor sente.
 * 3. **Autorização explícita** para usar o nome no site. Guarde a mensagem em
 *    que ela autoriza.
 */

export type Depoimento = {
  /** O que a pessoa escreveu, na palavra dela. */
  texto: string
  nome: string
  /** Ex.: "PASSE 2025 — UFMS" */
  contexto: string
}

export const DEPOIMENTOS: Depoimento[] = []

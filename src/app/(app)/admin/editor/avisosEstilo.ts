import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

/**
 * Confere o resumo contra o modelo (`docs/produto/modelo-de-resumo.md`) enquanto
 * ele é escrito.
 *
 * A skill `rascunhar-resumo` tem a lista de conferência (§7) e o script de
 * prévia; quem escreve direto no editor não tinha nada, e só descobria uma
 * pegadinha sem prova ou um molde esquecido lendo a página publicada.
 *
 * São AVISOS, não travas: nada aqui impede salvar. O estilo do autor é a régua,
 * mas o autor é quem decide — um item sem `;` pode ser de propósito.
 *
 * Cada aviso guarda a posição da primeira ocorrência, para o clique levar até
 * ela. Roda sobre o documento do ProseMirror, e não sobre o HTML, porque é a
 * posição no documento que o cursor entende.
 */

export type Aviso = {
  chave: string
  texto: string
  /** Onde está a primeira ocorrência, para o clique levar até ela. */
  pos: number | null
  quantos: number
}

/* O texto-instrução dos moldes de `blocos.ts`. Sobrou um desses no resumo, o
   molde não foi preenchido. */
const MOLDE = [
  /\(Prova Ano/,
  /^\(\d{2}\) item;$/,
  /^[A-E]\) alternativa;$/,
  /Correta\. \/ Incorreta\./,
  /^resposta em uma linha;$/,
  /^Termo:$/,
  /^afirmação correta que a prova inverteu/,
  /^o que se faz e com que fórmula;$/,
  /^Resolução: …$/,
]

/** "(PAS-UEM 2025, 3ª etapa)" no fim do item: a origem da pegadinha. */
const ORIGEM = /\([^()]*\d{4}[^()]*\)[.;]?$/

const FIM_DE_ITEM = /[;.:!?…)]$/

export function avisosDeEstilo(doc: ProseMirrorNode): Aviso[] {
  const contagem = new Map<string, { texto: string; pos: number; quantos: number }>()
  const anotar = (chave: string, texto: string, pos: number) => {
    const a = contagem.get(chave)
    if (a) a.quantos++
    else contagem.set(chave, { texto, pos, quantos: 1 })
  }

  let links = 0
  let caracteres = 0
  // "Para revisar": quantos grafos de nível 3 vêm depois do h2, até o próximo h2
  let revisar: { pos: number; pares: number } | null = null
  const fecharRevisar = () => {
    if (revisar && (revisar.pares < 4 || revisar.pares > 8)) {
      anotar(
        'revisar',
        `“Para revisar” com ${revisar.pares} ${revisar.pares === 1 ? 'par' : 'pares'} — o modelo pede de 4 a 8`,
        revisar.pos
      )
    }
    revisar = null
  }

  doc.descendants((no, pos, pai) => {
    if (no.isText) {
      const t = no.text ?? ''
      caracteres += t.length
      links += (t.match(/\[\[[^\]]+\]\]/g) ?? []).length
      return
    }

    if (no.isTextblock) {
      const t = no.textContent.trim()
      if (MOLDE.some((re) => re.test(t))) anotar('molde', 'trecho de molde não preenchido', pos)
    }

    if (no.type.name === 'heading') {
      const t = no.textContent.trim()
      if (no.attrs.level === 2) {
        fecharRevisar()
        if (/^para revisar/i.test(t)) revisar = { pos, pares: 0 }
      } else if (no.attrs.level === 3 && revisar) {
        revisar.pares++
      }
      // A questão não tem título: todo h2 vira seção e nó do mapa (§4).
      if (/^quest(ão|ões)\b/i.test(t)) anotar('titulo-questao', 'grafo chamado “Questão” — a questão não leva título', pos)
    }

    if (no.type.name === 'questao' && !no.attrs.gabarito) {
      anotar('gabarito', 'questão sem gabarito — o aluno responde com Acertei / Errei', pos)
    }

    if (no.type.name === 'image' && !String(no.attrs.alt ?? '').trim() && !no.attrs.legenda) {
      anotar('legenda', 'figura sem legenda', pos)
    }

    if (no.type.name === 'listItem') {
      const primeiro = no.firstChild
      // Item que abre sub-lista é cabeçalho dela ("Ex: amostra 7, 9, 5",
      // "Procedimento:"), e cabeçalho não termina em `;`.
      const abreSubLista = no.childCount > 1 && /List$/.test(no.child(1).type.name)
      if (primeiro?.type.name === 'paragraph' && !abreSubLista) {
        const t = primeiro.textContent.trim()
        if (t && !FIM_DE_ITEM.test(t)) anotar('ponto', 'item de lista sem “;” no fim', pos)
      }
    }

    // A caixa de pegadinhas é uma tabela de uma célula que abre com o rótulo.
    if (no.type.name === 'tableCell' && pai?.childCount === 1 && /^pegadinhas:?$/i.test(no.firstChild?.textContent.trim() ?? '')) {
      no.descendants((filho, rel) => {
        if (filho.type.name !== 'listItem') return
        const t = filho.textContent.trim()
        if (t && !ORIGEM.test(t)) anotar('origem', 'pegadinha sem a prova de origem entre parênteses', pos + 1 + rel)
        return false
      })
    }
  })
  fecharRevisar()

  const avisos: Aviso[] = [...contagem].map(([chave, a]) => ({ chave, ...a }))

  // Ao menos dois `[[…]]` (§4, parte 8). Só cobra de resumo que já tem corpo:
  // num texto de três linhas o aviso seria só ruído.
  if (caracteres > 600 && links < 2) {
    avisos.push({
      chave: 'links',
      texto: `${links === 0 ? 'nenhum' : 'só um'} [[link]] para outro resumo — o modelo pede ao menos dois`,
      pos: null,
      quantos: 1,
    })
  }

  return avisos
}

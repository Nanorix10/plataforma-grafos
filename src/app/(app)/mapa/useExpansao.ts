'use client'

/**
 * O que está aberto, o que casa com a busca, e quem aparece por causa disso.
 *
 * Vive fora das duas visões porque as duas precisam da MESMA resposta. O grafo
 * já tinha esta lógica dentro dele; o mapa mental não tinha nenhuma e desenhava
 * os 674 nós de uma vez — uma árvore de ~19.000px de altura que o "Enquadrar"
 * espremia até o texto de 11,5px virar 0,4px. Escrever a segunda cópia aqui
 * seria garantir que as duas visões divergissem no primeiro ajuste.
 */

import { useCallback, useMemo, useState } from 'react'

export type No = {
  id: string
  titulo: string
  materia: string
  cor: string
  liberado: boolean
  definicao: string
  /** id do resumo que contém este; null = assunto principal da matéria */
  pai: string | null
  /** `titulo` é uma seção de dentro de um resumo (decisão 12), não um resumo. */
  tipo: 'resumo' | 'titulo'
}

export type Materia = { slug: string; nome: string; cor: string }

/** A matéria também é nó, e o prefixo é o que a separa do slug de um resumo. */
export const idMateria = (slug: string) => `materia:${slug}`

/**
 * Sem caixa e sem acento.
 *
 * O acervo é em português e os títulos são acentuados — "Função", "Genética",
 * "Água". Exigir o acento do aluno faria a busca falhar justamente nas palavras
 * que ele mais digita, e no celular o acento custa uma tecla morta a mais.
 */
export function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export type Expansao = {
  expandidos: Set<string>
  /** ids que casaram com a busca — vazio quando não há busca. */
  casados: Set<string>
  /** quem deve ser desenhado, já considerando expansão, filtro e busca. */
  visiveis: Set<string>
  buscando: boolean
  porId: Map<string, No>
  filhosDe: Map<string, No[]>
  /** quantos filhos VISÍVEIS este nó teria se fosse aberto. */
  contarFilhos: (id: string) => number
  alternar: (id: string) => void
  abrirTudo: () => void
  fecharTudo: () => void
  algumAberto: boolean
}

export function useExpansao({
  nos,
  materias,
  busca,
  materiasAtivas,
}: {
  nos: No[]
  materias: Materia[]
  busca: string
  /** null = todas. Um conjunto vazio esconderia tudo, e ninguém quer isso. */
  materiasAtivas: Set<string> | null
}): Expansao {
  /**
   * Quem está aberto — e ninguém está, na abertura.
   *
   * Antes as matérias nasciam abertas, "para mostrar as matérias e os assuntos
   * principais de cada uma, e não os 200 tópicos de uma vez". A intenção
   * continua certa e a conta é que mudou: quando ela foi escrita o acervo tinha
   * 38 resumos, e hoje abrir as onze matérias põe 162 resumos de raiz na tela —
   * que é exatamente o que a regra queria evitar. Pior, no grafo os rótulos
   * somem abaixo de `k = 0.55` e 173 nós enquadrados ficam abaixo disso: o mapa
   * abria como um punhado de bolinhas sem nome.
   */
  const [expandidos, setExpandidos] = useState<Set<string>>(() => new Set())

  const alternar = useCallback((id: string) => {
    setExpandidos((atual) => {
      const novo = new Set(atual)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }, [])

  const abrirTudo = useCallback(() => {
    setExpandidos(
      new Set([...materias.map((m) => idMateria(m.slug)), ...nos.map((n) => n.id)])
    )
  }, [materias, nos])

  const fecharTudo = useCallback(() => setExpandidos(new Set()), [])

  const porId = useMemo(() => new Map(nos.map((n) => [n.id, n])), [nos])

  const filhosDe = useMemo(() => {
    const m = new Map<string, No[]>()
    for (const n of nos) {
      const chave = n.pai ?? idMateria(n.materia)
      m.set(chave, [...(m.get(chave) ?? []), n])
    }
    return m
  }, [nos])

  const q = normalizar(busca.trim())
  const buscando = q.length > 0

  /** Passa no filtro de matéria. Sem filtro, todo mundo passa. */
  const naMateria = useCallback(
    (slug: string) => materiasAtivas === null || materiasAtivas.has(slug),
    [materiasAtivas]
  )

  const casados = useMemo(() => {
    if (!buscando) return new Set<string>()
    const ok = new Set<string>()
    for (const n of nos) {
      if (!naMateria(n.materia)) continue
      if (normalizar(n.titulo).includes(q)) ok.add(n.id)
    }
    return ok
  }, [nos, q, buscando, naMateria])

  /**
   * Quem aparece.
   *
   * Buscando, a expansão é ignorada e o que manda é o resultado: cada nó que
   * casou aparece com a linhagem inteira até a matéria, porque uma árvore
   * precisa do caminho para se desenhar. É onde esta busca difere da barra
   * lateral, que vira lista e descarta os ancestrais de propósito — lá eles não
   * têm o que segurar.
   *
   * Sem busca, um nó aparece quando toda a cadeia acima dele está aberta. Subir
   * a cadeia (em vez de descer a partir das raízes) mantém a regra num lugar só
   * e imune à ordem em que os resumos chegam.
   */
  const visiveis = useMemo(() => {
    const ok = new Set<string>()

    if (buscando) {
      for (const id of casados) {
        let atual: No | undefined = porId.get(id)
        while (atual && !ok.has(atual.id)) {
          ok.add(atual.id)
          // o ancestral entra mesmo que seja de outra matéria: sem ele o ramo
          // ficaria pendurado no nada (decisão 9 — tópico interdisciplinar
          // pendura em quem o autor escolheu, não na matéria dele)
          atual = atual.pai ? porId.get(atual.pai) : undefined
        }
      }
      return ok
    }

    for (const n of nos) {
      if (!naMateria(n.materia)) continue
      let atual: No | undefined = n
      let visivel = true
      while (atual?.pai) {
        if (!expandidos.has(atual.pai)) {
          visivel = false
          break
        }
        atual = porId.get(atual.pai)
      }
      if (visivel && expandidos.has(idMateria(n.materia))) ok.add(n.id)
    }
    return ok
  }, [nos, porId, expandidos, buscando, casados, naMateria])

  /* O selo mostra quantos filhos há de fato — buscando, quantos DESSES filhos
     sobreviveram ao filtro. Um "+8" que abre três itens ensinaria errado. */
  const contarFilhos = useCallback(
    (id: string) => {
      const filhos = filhosDe.get(id) ?? []
      if (!buscando) return filhos.filter((f) => naMateria(f.materia)).length
      return filhos.filter((f) => visiveis.has(f.id)).length
    },
    [filhosDe, buscando, naMateria, visiveis]
  )

  const algumAberto = useMemo(() => nos.some((n) => expandidos.has(n.id)), [nos, expandidos])

  return {
    expandidos,
    casados,
    visiveis,
    buscando,
    porId,
    filhosDe,
    contarFilhos,
    alternar,
    abrirTudo,
    fecharTudo,
    algumAberto,
  }
}

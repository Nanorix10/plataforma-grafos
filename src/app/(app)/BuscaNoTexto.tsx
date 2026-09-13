'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MATERIAS } from '@/lib/materias'

/**
 * O que a busca por título não alcança: a palavra no meio do texto.
 *
 * A busca da barra filtra os 249 TÍTULOS que já estão na memória, e por isso é
 * instantânea. Só que não é assim que se estuda: o professor cita um termo e o
 * aluno vai atrás dele, não do nome do capítulo. Quem digitava "mitocôndria" e
 * não tinha um resumo com esse nome recebia "nada encontrado" — com a palavra
 * escrita em dois resumos.
 *
 * **Quem responde é o Postgres**, por `buscar_no_texto`. Não dá para fazer no
 * navegador: seriam 500 kB de corpo baixados por sessão, e — desde a migration
 * de 13/09 — o banco só entrega o texto que o plano cobre. Buscar no cliente
 * exigiria justamente aquilo que a proteção existe para impedir.
 *
 * A função roda com as permissões de quem chama, então **a busca nunca devolve
 * resumo fora do plano**. Não há uma linha aqui filtrando isso; é o banco.
 *
 * O trecho vem com `«»` em volta do achado, e não com `<mark>`: ele nasce de
 * HTML, e devolver HTML para ser injetado seria abrir uma porta de script por
 * causa de um grifo. Aqui a string é PARTIDA nesses marcadores e o destaque
 * vira elemento React.
 */

type Achado = { slug: string; titulo: string; materia_slug: string; trecho: string }

/** Parte "a «palavra» no meio" em pedaços, marcando o que estava entre «». */
function comDestaque(trecho: string) {
  return trecho.split(/(«[^»]*»)/g).map((parte, i) =>
    parte.startsWith('«') && parte.endsWith('»') ? (
      <mark key={i} className="bg-transparent text-[var(--ink)] font-medium">
        {parte.slice(1, -1)}
      </mark>
    ) : (
      parte
    )
  )
}

export default function BuscaNoTexto({
  termo,
  jaNoTitulo,
}: {
  termo: string
  /** Slugs que a busca por título já mostrou — repetir seria ruído. */
  jaNoTitulo: Set<string>
}) {
  /**
   * O resultado guarda O TERMO QUE O GEROU, e não só a lista.
   *
   * Assim "ainda não respondi para este termo" é uma COMPARAÇÃO no render, e
   * não um `setState` de limpeza dentro do efeito — que é o que as regras do
   * React Compiler recusam, e com razão: limpar estado em efeito é um render a
   * mais para dizer o que já dava para derivar.
   *
   * De quebra resolve o resultado velho piscando: ao digitar a sétima letra, a
   * lista da sexta deixa de valer no mesmo instante, sem esperar a resposta.
   */
  const [resultado, setResultado] = useState<{ termo: string; achados: Achado[] } | null>(null)

  const q = termo.trim()
  /* Duas letras não são uma busca — são o caminho para a terceira. Sem o piso,
     cada tecla vira uma ida ao banco que devolve meio acervo. */
  const vale = q.length >= 3
  const respondido = resultado?.termo === q
  const buscando = vale && !respondido

  useEffect(() => {
    if (!vale) return

    /* Espera o dedo parar. 250ms é o intervalo em que digitar "célula" custa
       uma consulta em vez de seis. */
    let vivo = true
    const id = setTimeout(async () => {
      const { data } = await createClient().rpc('buscar_no_texto', { termo: q, limite: 8 })
      if (vivo) setResultado({ termo: q, achados: (data as Achado[]) ?? [] })
    }, 250)

    return () => {
      vivo = false
      clearTimeout(id)
    }
  }, [q, vale])

  if (!vale) return null

  /* Quem já apareceu pelo título sai daqui: o mesmo resumo em duas listas faz
     a segunda parecer erro. */
  const novos = respondido
    ? resultado.achados.filter((a) => !jaNoTitulo.has(a.slug))
    : []

  if (!buscando && novos.length === 0) return null

  return (
    <div className="mt-4 pt-3 border-t border-[var(--line)]">
      <h2 className="px-2.5 mb-1.5 text-[10.5px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
        {buscando ? 'Procurando no texto…' : 'No texto dos resumos'}
      </h2>

      {novos.map((a) => (
        <Link
          key={a.slug}
          href={`/resumos/${a.slug}`}
          className="block px-2.5 py-2 rounded-md hover:bg-[var(--sel)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
        >
          <span
            className="block text-[12.5px] font-medium truncate"
            style={{ color: MATERIAS[a.materia_slug as keyof typeof MATERIAS]?.cor }}
          >
            {a.titulo}
          </span>
          <span className="block text-[11px] leading-[1.45] text-[var(--ink-faint)] line-clamp-3">
            {comDestaque(a.trecho)}
          </span>
        </Link>
      ))}
    </div>
  )
}

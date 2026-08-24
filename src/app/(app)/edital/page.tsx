import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { getEdital } from '@/lib/edital-consulta'
import { agruparEdital } from '@/lib/edital'
import { MATERIAS } from '@/lib/materias'
import { PROVAS } from '@/lib/processos'
import VisaoEdital from './VisaoEdital'

export default async function EditalPage() {
  const { userId } = await getSessao()
  if (!userId) redirect('/login')

  const topicos = await getEdital()
  const blocos = agruparEdital(topicos)

  const escritos = topicos.filter((t) => t.resumo_slug).length

  /* Só as provas que TÊM edital carregado viram chip. Uma prova sem tópico
     nenhum (o PAS UnB, hoje) seria um filtro que esvazia a tela sem explicar
     por quê — mesmo raciocínio dos chips de matéria no mapa. */
  const provas = Object.entries(PROVAS)
    .filter(([slug]) => blocos.some((b) => b.processo_slug === slug))
    .map(([slug, p]) => ({ slug, nome: p.nome }))

  const nomesDeMateria = Object.fromEntries(
    Object.entries(MATERIAS).map(([slug, m]) => [slug, { nome: m.nome, cor: m.cor }])
  )

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-12 border-b border-[var(--line)]">
        <h1 className="text-[15px] font-medium">Edital</h1>
        <span className="text-[11.5px] text-[var(--ink-faint)] tabular-nums">
          {escritos} de {topicos.length} tópicos com resumo escrito
        </span>
      </header>

      <VisaoEdital
        blocos={blocos}
        provas={provas}
        materias={nomesDeMateria}
        nomeDaProva={Object.fromEntries(
          Object.entries(PROVAS).map(([slug, p]) => [slug, p.nome])
        )}
      />
    </div>
  )
}

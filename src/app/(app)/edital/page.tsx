import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { getEdital } from '@/lib/edital-consulta'
import { getProgresso } from '@/lib/edital-progresso'
import { agruparEdital } from '@/lib/edital'
import { MATERIAS } from '@/lib/materias'
import { PROVAS } from '@/lib/processos'
import VisaoEdital from './VisaoEdital'

export default async function EditalPage() {
  const { userId, isAdmin } = await getSessao()
  if (!userId) redirect('/login')

  const [topicos, marcados] = await Promise.all([getEdital(), getProgresso()])
  const blocos = agruparEdital(topicos)

  /* Só as provas que TÊM edital carregado viram chip. Uma prova sem tópico
     nenhum (o PAS UnB, hoje) seria um filtro que esvazia a tela sem explicar
     por quê — mesmo raciocínio dos chips de matéria no mapa. */
  const provas = Object.entries(PROVAS)
    .filter(([slug]) => blocos.some((b) => b.processo_slug === slug))
    .map(([slug, p]) => ({ slug, nome: p.nome }))

  const nomesDeMateria = Object.fromEntries(
    Object.entries(MATERIAS).map(([slug, m]) => [slug, { nome: m.nome, cor: m.cor }])
  )

  /* O cabeçalho mora dentro de `VisaoEdital` porque a conta dele muda a cada
     caixinha marcada, e isso é estado de cliente. */
  return (
    <VisaoEdital
      blocos={blocos}
      provas={provas}
      materias={nomesDeMateria}
      nomeDaProva={Object.fromEntries(
        Object.entries(PROVAS).map(([slug, p]) => [slug, p.nome])
      )}
      marcadosIniciais={marcados}
      comoAutor={isAdmin}
    />
  )
}

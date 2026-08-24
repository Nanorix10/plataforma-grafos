import Link from 'next/link'
import { redirect } from 'next/navigation'
import { MATERIAS } from '@/lib/materias'
import { PLANO_PROCESSOS } from '@/lib/planos'
import { getSessao } from '@/lib/sessao'
import { extrairTitulos } from '@/lib/titulos'
import GraphView from './GraphView'
import MindMapView from './MindMapView'
import type { No as NoMapa } from './useExpansao'

type Visao = 'grafo' | 'mental'

export default async function MapaPage({
  searchParams,
}: {
  searchParams: Promise<{ visao?: string }>
}) {
  const { visao: visaoParam } = await searchParams
  // o modo vive na URL, e não em estado local, pra que o aluno possa favoritar
  // ou compartilhar exatamente a visão que estava usando
  const visao: Visao = visaoParam === 'mental' ? 'mental' : 'grafo'

  const { supabase, userId, plano } = await getSessao()
  if (!userId) redirect('/login')

  const [{ data: resumos }, { data: conexoesRaw }] = await Promise.all([
    supabase
      .from('resumos')
      // `corpo` entra por causa dos nós de título (decisão 12). Ele é lido AQUI,
      // no servidor, e só a lista de títulos desce para o navegador — o texto
      // dos resumos nunca vai junto. Fosse o contrário, o mapa entregaria o
      // conteúdo inteiro do site a quem só queria ver o desenho.
      .select('id, slug, titulo, materia_slug, processo_slug, definicao, pai_id, corpo'),
    supabase
      .from('conexoes')
      .select('origem_id, destino_id, resumos!conexoes_origem_id_fkey(slug), destino:resumos!conexoes_destino_id_fkey(slug)'),
  ])

  const processosLiberados = PLANO_PROCESSOS[plano] ?? []

  // o grafo trabalha por slug (é o que vai na URL do resumo), mas a hierarquia
  // é gravada por id — este mapa traduz um no outro
  const slugPorId = new Map((resumos ?? []).map((r) => [r.id, r.slug]))

  const nos: NoMapa[] = []

  for (const r of resumos ?? []) {
    const liberado = processosLiberados.includes(r.processo_slug)
    const cor = MATERIAS[r.materia_slug as keyof typeof MATERIAS]?.cor ?? '#999'

    nos.push({
      id: r.slug,
      titulo: r.titulo,
      materia: r.materia_slug,
      cor,
      liberado,
      // pai por slug, ou null se este resumo é assunto principal da matéria
      pai: (r.pai_id && slugPorId.get(r.pai_id)) || null,
      // a definição de um tópico fora do plano não vai pro navegador: seria
      // entregar conteúdo pago pra quem não pagou
      definicao: liberado ? (r.definicao ?? '') : '',
    tipo: 'resumo',
    })

    // Resumo fora do plano não abre os títulos. Os nomes das seções JÁ SÃO
    // conteúdo — o sumário de "Dinâmica" entrega a estrutura da aula inteira —
    // e o nó do resumo continua aparecendo com o cadeado, que é o que interessa
    // mostrar a quem ainda não pagou.
    if (!liberado) continue

    /* A pilha traduz nível em parentesco. Um h4 pendura no h3 aberto mais
       recente, e não no resumo; ao encontrar um h2 novo, tudo o que estava
       aberto em nível igual ou mais fundo se fecha. É o mesmo raciocínio de um
       sumário, e é o que faz "1ª Lei" cair dentro de "Leis de Newton".

       Nível pulado (um h2 seguido direto de um h4) não quebra nada: a pilha só
       desempilha o que for mais fundo, então o h4 pendura no h2 mesmo. Salto de
       nível acontece em texto real e não é erro do autor. */
    const abertos: { nivel: number; id: string }[] = []

    for (const t of extrairTitulos(r.corpo)) {
      while (abertos.length > 0 && abertos[abertos.length - 1].nivel >= t.nivel) {
        abertos.pop()
      }

      const id = `${r.slug}#${t.ancora}`
      nos.push({
        id,
        titulo: t.texto,
        materia: r.materia_slug,
        cor,
        liberado: true,
        pai: abertos[abertos.length - 1]?.id ?? r.slug,
        // seção não tem definição própria; o balão fica para o resumo
        definicao: '',
        tipo: 'titulo',
      })

      abertos.push({ nivel: t.nivel, id })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links = (conexoesRaw ?? []).map((c: any) => ({
    origem: c.resumos?.slug,
    destino: c.destino?.slug,
  })).filter((l) => l.origem && l.destino)

  const listaMaterias = Object.entries(MATERIAS).map(([slug, m]) => ({
    slug,
    nome: m.nome,
    cor: m.cor,
  }))

  return (
    <div className="h-[calc(100vh-3rem)] lg:h-screen flex flex-col">
      <div className="border-b border-[var(--line)] px-5 sm:px-10 py-3 flex items-center gap-4 shrink-0">
        <span className="text-xs text-[var(--ink-faint)]">
          <b className="text-[var(--ink)] font-medium">
            {visao === 'grafo' ? 'Mapa de conexões' : 'Mapa mental'}
          </b>{' '}
          · {nos.filter((n) => n.tipo === 'resumo').length} resumos ·{' '}
          {nos.filter((n) => n.tipo === 'titulo').length} seções ·{' '}
          {visao === 'grafo'
            ? `${links.length} ligações`
            : `${new Set(nos.map((n) => n.materia)).size} matérias`}
        </span>

        {/* divide-x põe a linha entre as abas sem depender de qual está ativa */}
        <div role="tablist" className="ml-auto inline-flex divide-x divide-[var(--line-forte)] overflow-hidden rounded-lg border border-[var(--line-forte)]">
          <Alternador href="/mapa?visao=grafo" ativo={visao === 'grafo'}>
            Grafo
          </Alternador>
          <Alternador href="/mapa?visao=mental" ativo={visao === 'mental'}>
            Mapa mental
          </Alternador>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {visao === 'grafo' ? (
          <GraphView nos={nos} links={links} materias={listaMaterias} />
        ) : (
          <MindMapView nos={nos} materias={listaMaterias} titulo="Plataforma Grafos" />
        )}
      </div>
    </div>
  )
}

function Alternador({
  href,
  ativo,
  children,
}: {
  href: string
  ativo: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={ativo}
      className={`px-3.5 py-1.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento)]'
          : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </Link>
  )
}

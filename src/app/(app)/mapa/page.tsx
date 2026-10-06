import { redirect } from 'next/navigation'
import { MATERIAS } from '@/lib/materias'
import { PLANO_PROCESSOS } from '@/lib/planos'
import { getSessao } from '@/lib/sessao'
import { extrairTitulos } from '@/lib/titulos'
import Mapa from './Mapa'
import type { No as NoMapa } from './useExpansao'

/* O `?visao=` não é lido aqui de propósito. Quem decide entre grafo e mapa
   mental é o `Mapa`, no navegador: se a página dependesse do parâmetro, cada
   troca de aba voltaria ao servidor para refazer tudo isto. Ver o cabeçalho
   de `Mapa.tsx`. */
export default async function MapaPage() {
  const { supabase, userId, plano } = await getSessao()
  if (!userId) redirect('/login')

  const [{ data: resumos }, { data: corpos }, { data: conexoesRaw }] = await Promise.all([
    /* Duas consultas desde a migration de 13/09, e a divisão é a mesma que o
       banco passou a fazer:

       - o CATÁLOGO traz os 249, inclusive os bloqueados — o mapa mostra o
         acervo inteiro, com cadeado no que o plano não cobre;
       - `resumos` traz o `corpo`, e agora só devolve o que o plano cobre. Ele
         é lido AQUI, no servidor, e só a lista de títulos desce para o
         navegador — o texto nunca vai junto.

       A consequência, decidida com o autor: quem não tem o plano deixa de ver
       as SEÇÕES dentro de um resumo bloqueado. Vê que o resumo existe, não vê
       o índice do que tem dentro. */
    supabase
      .from('resumos_catalogo')
      .select('id, slug, titulo, materia_slug, processo_slug, definicao, pai_id'),
    supabase.from('resumos').select('id, corpo'),
    supabase
      .from('conexoes')
      .select('origem_id, destino_id, resumos!conexoes_origem_id_fkey(slug), destino:resumos!conexoes_destino_id_fkey(slug)'),
  ])

  const processosLiberados = PLANO_PROCESSOS[plano] ?? []

  // o grafo trabalha por slug (é o que vai na URL do resumo), mas a hierarquia
  // é gravada por id — este mapa traduz um no outro
  const slugPorId = new Map((resumos ?? []).map((r) => [r.id, r.slug]))
  const corpoPorId = new Map((corpos ?? []).map((c) => [c.id, c.corpo as string]))

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

    /* Sem corpo — resumo fora do plano — não há seção a desenhar, e o `?? ''`
       faz o laço simplesmente não rodar. */
    for (const t of extrairTitulos(corpoPorId.get(r.id) ?? '')) {
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

  /* Só matéria que TEM resumo. Redação está no `MATERIAS` e não tem nenhum:
     sem este filtro ela vira um chip que, clicado, esvazia o mapa sem dizer
     por quê. A barra lateral já conta 11 pelo mesmo critério. */
  const comResumo = new Set(nos.map((n) => n.materia))
  const listaMaterias = Object.entries(MATERIAS)
    .filter(([slug]) => comResumo.has(slug))
    .map(([slug, m]) => ({ slug, nome: m.nome, cor: m.cor }))

  return <Mapa nos={nos} links={links} materias={listaMaterias} />
}

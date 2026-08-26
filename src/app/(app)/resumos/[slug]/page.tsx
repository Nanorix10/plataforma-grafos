// Só as rotas que exibem fórmula carregam o CSS do KaTeX (~3 KB gzip). No
// globals.css ele ia junto da landing e do login, que não têm equação.
import 'katex/dist/katex.min.css'
import type { CSSProperties } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { MATERIAS } from '@/lib/materias'
import { renderizarWikilinks } from '@/lib/wikilinks'
import { PLANO_PROCESSOS } from '@/lib/planos'
import { renderizarMatematica } from '@/lib/matematica'
import { renderizarQuestoes } from '@/lib/questoes'
import { ancorarTitulos, extrairTrilho } from '@/lib/titulos'
import { getSessao } from '@/lib/sessao'
import { estiloDaPagina } from '@/lib/pagina'
import { PROCESSOS } from '@/lib/processos'
import { periodoDosEventos } from '@/lib/tempo'
import Trilho from './Trilho'

export default async function ResumoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { supabase, userId, plano, isAdmin } = await getSessao()
  if (!userId) redirect('/login')

  const { data: resumo } = await supabase
    .from('resumos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!resumo) notFound()

  const liberado = (PLANO_PROCESSOS[plano] ?? []).includes(resumo.processo_slug)

  if (!liberado) {
    return (
      <div className="max-w-[640px] mx-auto px-7 py-24 text-center">
        <h1 className="text-2xl font-medium mb-3">Esse resumo faz parte de outro plano</h1>
        <p className="text-[var(--ink-dim)] mb-8">
          &quot;{resumo.titulo}&quot; está disponível no Acesso Completo.
        </p>
        <Link href="/#planos" className="botao botao-primario !rounded-lg px-6 py-2.5 text-sm">
          Ver planos
        </Link>
      </div>
    )
  }

  // todos os títulos (pra resolver os [[wikilinks]]), os backlinks, as provas
  // que cobram este resumo e os eventos que ele explica, em paralelo
  const [{ data: todosResumos }, { data: backlinksRaw }, { data: cobrancas }, { data: datas }] =
    await Promise.all([
      supabase.from('resumos').select('slug, titulo'),
      supabase
        .from('conexoes')
        // `materia_slug` vem junto porque cada backlink é pintado na cor da
        // matéria DELE, não na deste resumo: quem cita costuma ser de outra
        // disciplina, e é justamente isso que a lista mostra.
        .select('origem:resumos!conexoes_origem_id_fkey(slug, titulo, materia_slug)')
        .eq('destino_id', resumo.id),
      // "cai em": o quarto eixo (decisão 9i). A relação é N-para-N, então um
      // resumo `comum` como "Medidas de tendência central" volta com duas linhas
      // — uma por prova que o cobra —, e é justamente isso que a tela mostra.
      supabase.from('edital_topicos').select('processo_slug, etapa').eq('resumo_id', resumo.id),
      // "quando": os eventos que este resumo explica (decisão 9d). O vínculo
      // `eventos.resumo_id` existia desde agosto e era usado numa direção só —
      // do eixo para o resumo. Sem esta consulta, quem acabava de ler não tinha
      // como se situar no tempo sem abrir a linha do tempo e procurar.
      supabase
        .from('eventos')
        .select('titulo, ano_inicio, ano_fim, rotulo_data')
        .eq('resumo_id', resumo.id),
    ])
  const tituloParaSlug = Object.fromEntries((todosResumos ?? []).map((r) => [r.titulo, r.slug]))

  // Um resumo pode explicar muitos eventos — `o-conceito-de-idade-media`
  // sozinho carrega mais de dez. O cabeçalho mostra o PERÍODO e a contagem, e
  // o eixo mostra o resto; ver `periodoDosEventos`.
  const periodo = periodoDosEventos(datas ?? [])

  // Um resumo costuma cobrir VÁRIOS tópicos do mesmo edital, e o aluno não quer
  // saber quantos: quer saber em que provas isto cai. Daí o par prova+etapa ser
  // reduzido a um conjunto antes de virar etiqueta.
  const provas = [
    ...new Map(
      (cobrancas ?? []).map((c: { processo_slug: string; etapa: number }) => [
        `${c.processo_slug}#${c.etapa}`,
        c,
      ])
    ).values(),
  ].sort((a, b) => a.processo_slug.localeCompare(b.processo_slug) || a.etapa - b.etapa)

  const trilho = extrairTrilho(resumo.corpo, tituloParaSlug)

  const materia = MATERIAS[resumo.materia_slug as keyof typeof MATERIAS]
  // A ordem importa, e é sempre a mesma: do estrutural para o miúdo.
  // As âncoras primeiro, no HTML ainda cru — é a MESMA entrada que o /mapa lê
  // para montar os nós de título (decisão 12), e ler documentos diferentes é o
  // que faria o link do mapa cair no topo da página em silêncio.
  // As gavetas de resolução depois, porque contam `<div>` para achar onde
  // fecham e o KaTeX enche o HTML deles; os wikilinks em seguida; as fórmulas
  // por último, já que o KaTeX gera muito HTML e passar as outras regexes por
  // cima dele seria trabalho à toa.
  const corpoHtml = renderizarMatematica(
    renderizarWikilinks(renderizarQuestoes(ancorarTitulos(resumo.corpo)), tituloParaSlug)
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backlinks = (backlinksRaw ?? []).map((c: any) => c.origem).filter(Boolean)

  return (
    <>
      {/* Barra fina só com o caminho e a ação. Antes era em fonte de código,
          o que fazia a página parecer console de desenvolvedor. */}
      <header className="sticky top-12 lg:top-0 z-10 bg-[var(--paper)]/85 backdrop-blur border-b border-[var(--line)] px-6 md:px-10 h-12 flex items-center gap-2">
        <nav aria-label="Caminho" className="min-w-0 flex items-center gap-2">
          <Link
            href="/resumos"
            className="text-[length:var(--t-peq)] text-[var(--ink-dim)] hover:text-[var(--ink)] shrink-0"
          >
            Resumos
          </Link>
          <span aria-hidden="true" className="text-[var(--ink-faint)]">
            /
          </span>
          {/* o título no caminho também vai na cor da matéria, pra a barra
              fixa não desmentir o título grande logo abaixo dela */}
          <span
            className="text-[length:var(--t-peq)] font-medium truncate"
            style={{ color: materia?.cor ?? 'var(--ink)' }}
          >
            {resumo.titulo}
          </span>
        </nav>

        {isAdmin ? (
          <Link
            href={`/admin/editor/${resumo.slug}`}
            className="botao botao-neutro ml-auto shrink-0 !text-[length:var(--t-peq)] !py-1.5 !px-3"
          >
            Editar
          </Link>
        ) : null}
      </header>

      {/* A largura e as margens são as que o autor arrastou na régua do editor.
          É o que fecha o WYSIWYG: sem isto, a folha do editor mostraria uma
          coluna e o aluno leria outra. Abaixo de `md` as margens são ignoradas
          e vale um recuo fixo — 150px numa tela de celular não sobraria texto. */}
      {/* O par trilho + folha, centralizado como um bloco só. As variáveis da
          régua ficam AQUI, e não no `<article>`, porque a grade precisa da
          largura da folha para dimensionar a própria coluna — e custom
          property herda, então o artigo continua lendo as mesmas. */}
      <div
        className="leitura"
        style={
          {
            ...estiloDaPagina(resumo.margem_esq ?? 150, resumo.margem_dir ?? 150),
            // O trilho é irmão do `.conteudo-resumo`, não filho: sem a cor
            // aqui em cima, a seção ativa nele cairia no `inherit` de reserva
            // enquanto os títulos que ela aponta saem na cor da matéria.
            '--cor-materia': materia?.cor,
          } as CSSProperties
        }
      >
        <Trilho itens={trilho} />

      <article className="max-w-[var(--pagina)] mx-auto px-6 md:pl-[var(--margem-esq)] md:pr-[var(--margem-dir)] py-10 md:py-14">
        {/* A etiqueta é contornada na cor da matéria, e o texto vai na mesma
            cor. Ela já foi a ÚNICA peça colorida da página, quando o título
            ficava neutro; agora a cor da matéria vale para todo título do
            site, e a etiqueta voltou a ser só a porta de volta para a lista. */}
        <Link
          href="/resumos"
          className="inline-flex items-center rounded-md border px-2.5 py-1 mb-5 hover:bg-[var(--sel)]"
          style={{ borderColor: materia?.cor ?? 'var(--line-forte)' }}
        >
          <span
            className="text-[11px] font-medium"
            style={{ color: materia?.cor ?? 'var(--ink-dim)' }}
          >
            {materia?.nome}
          </span>
        </Link>

        <h1
          className="text-[30px] font-medium leading-tight text-balance mb-8"
          style={{ color: materia?.cor ?? 'var(--ink)' }}
        >
          {resumo.titulo}
        </h1>

        {/* A ficha do resumo: em que provas ele cai, e quando ele acontece.
            Cada linha some sozinha quando não tem o que dizer, e a ficha
            inteira some quando nenhuma das duas tem — é ela que carrega o
            traço de cima e o respiro de baixo, para duas linhas presentes não
            desenharem dois traços. */}
        {provas.length > 0 || periodo ? (
          <div className="ficha">
            {/* Em que provas isto cai (decisão 9i). Some quando o resumo não é
                cobrado por edital nenhum — a maior parte do acervo de `comum`
                é assim, e uma linha "Cai em —" só ocuparia o lugar sem
                informar. Não são links: `/edital` não recebe filtro por prova,
                e etiqueta que não leva a lugar nenhum é pior do que etiqueta
                que não clica. */}
            {provas.length > 0 ? (
              <div className="cai-em">
                <h2>Cai em</h2>
                <ul>
                  {provas.map((p) => (
                    <li key={`${p.processo_slug}#${p.etapa}`}>
                      {PROCESSOS[p.processo_slug]?.nome ?? p.processo_slug}
                      <span> · {p.etapa}ª etapa</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Quando isto acontece (decisão 9d). Esta etiqueta CLICA, ao
                contrário das de cima, e é a mesma regra que decide as duas: o
                eixo recebe enquadramento por `?de=&ate=`, então há para onde
                levar. Se um dia `/edital` aceitar filtro por prova, as de cima
                viram link pelo mesmo critério. */}
            {periodo ? (
              <div className="cai-em">
                <h2>Quando</h2>
                <ul>
                  <li className="tem-link">
                    <Link href={`/linha-do-tempo?de=${periodo.de}&ate=${periodo.ate}`}>
                      {periodo.rotulo}
                      <span> · {periodo.legenda}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* A cor da matéria desce por variável, e o CSS decide onde ela pinta
            (hoje: títulos de seção e termos em negrito). Resumo de matéria
            desconhecida não recebe a variável e cai no `inherit` de reserva. */}
        <div
          className="conteudo-resumo"
          style={{ '--cor-materia': materia?.cor } as CSSProperties}
          dangerouslySetInnerHTML={{ __html: corpoHtml }}
        />

        <section className="mt-16 pt-7 border-t border-[var(--line)]">
          <h2 className="text-[length:var(--t-mini)] font-medium text-[var(--ink-faint)] uppercase tracking-[0.04em] mb-4">
            Resumos que citam este
          </h2>
          {backlinks.length === 0 ? (
            <p className="text-[length:var(--t-peq)] text-[var(--ink-faint)]">
              Nenhum outro resumo cita este ainda.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {backlinks.map((b: { slug: string; titulo: string; materia_slug: string }) => (
                <li key={b.slug}>
                  <Link
                    href={`/resumos/${b.slug}`}
                    className="group flex items-center gap-3 rounded-lg bg-[var(--raised)] px-4 py-3 hover:bg-[var(--raised-hover)]"
                  >
                    <span
                      className="text-sm font-medium truncate"
                      style={{
                        color:
                          MATERIAS[b.materia_slug as keyof typeof MATERIAS]?.cor ??
                          'var(--ink)',
                      }}
                    >
                      {b.titulo}
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-[var(--acento)] transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
      </div>
    </>
  )
}

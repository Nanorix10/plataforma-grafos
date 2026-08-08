// Só as rotas que exibem fórmula carregam o CSS do KaTeX (~3 KB gzip). No
// globals.css ele ia junto da landing e do login, que não têm equação.
import 'katex/dist/katex.min.css'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { MATERIAS } from '@/lib/materias'
import { renderizarWikilinks, PLANO_PROCESSOS } from '@/lib/wikilinks'
import { renderizarMatematica } from '@/lib/matematica'
import { renderizarQuestoes } from '@/lib/questoes'
import { getSessao } from '@/lib/sessao'

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

  // todos os títulos (pra resolver os [[wikilinks]]) e os backlinks, em paralelo
  const [{ data: todosResumos }, { data: backlinksRaw }] = await Promise.all([
    supabase.from('resumos').select('slug, titulo'),
    supabase
      .from('conexoes')
      .select('origem:resumos!conexoes_origem_id_fkey(slug, titulo)')
      .eq('destino_id', resumo.id),
  ])
  const tituloParaSlug = Object.fromEntries((todosResumos ?? []).map((r) => [r.titulo, r.slug]))

  const materia = MATERIAS[resumo.materia_slug as keyof typeof MATERIAS]
  // A ordem importa, e é sempre a mesma: do estrutural para o miúdo.
  // As gavetas de resolução primeiro, porque contam `<div>` para achar onde
  // fecham e o KaTeX enche o HTML deles; os wikilinks depois; as fórmulas por
  // último, já que o KaTeX gera muito HTML e passar as outras regexes por cima
  // dele seria trabalho à toa.
  const corpoHtml = renderizarMatematica(
    renderizarWikilinks(renderizarQuestoes(resumo.corpo), tituloParaSlug)
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
          <span className="text-[length:var(--t-peq)] text-[var(--ink)] font-medium truncate">
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

      <article className="max-w-[720px] mx-auto px-6 md:px-10 py-10 md:py-14">
        {/* A matéria vira uma etiqueta discreta. Antes ela pintava o título
            inteiro, e um título grande em cor saturada domina a página sem
            acrescentar informação. */}
        {/* A etiqueta é contornada na cor da matéria, e o texto vai na mesma
            cor. É a única peça colorida da página — o título fica neutro. */}
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

        <h1 className="text-[30px] font-medium leading-tight text-balance mb-8">
          {resumo.titulo}
        </h1>

        <div className="conteudo-resumo" dangerouslySetInnerHTML={{ __html: corpoHtml }} />

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
              {backlinks.map((b: { slug: string; titulo: string }) => (
                <li key={b.slug}>
                  <Link
                    href={`/resumos/${b.slug}`}
                    className="group flex items-center gap-3 rounded-lg bg-[var(--raised)] px-4 py-3 hover:bg-[var(--raised-hover)]"
                  >
                    <span className="text-sm font-medium truncate">
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
    </>
  )
}

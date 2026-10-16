// O CSS do KaTeX entra só onde há fórmula — mesmo motivo da página do aluno.
import 'katex/dist/katex.min.css'
import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { MATERIAS } from '@/lib/materias'
import { PROCESSOS } from '@/lib/processos'
import { PERIODO_DE_ACESSO } from '@/lib/planos'
import { renderizarWikilinks } from '@/lib/wikilinks'
import { renderizarMatematica } from '@/lib/matematica'
import { renderizarQuestoes } from '@/lib/questoes'
import { reunirQuestoes } from '@/lib/pratique'
import { legendarFiguras } from '@/lib/figuras'
import { marcarFormulaSolta } from '@/lib/formula-solta'
import { ancorarTitulos, extrairTrilho } from '@/lib/titulos'
import { estiloDaPagina, ladoDaFaixa } from '@/lib/pagina'
import { montarFicha } from '@/lib/ficha-resumo'
import Trilho from '@/app/(app)/resumos/[slug]/Trilho'
import SumarioMovel from '@/app/(app)/resumos/[slug]/SumarioMovel'
import LupaFigura from '@/app/(app)/resumos/[slug]/LupaFigura'
import Questoes from '@/app/(app)/resumos/[slug]/Questoes'

/**
 * A amostra grátis: um resumo inteiro, para quem não tem conta.
 *
 * Existe para o vídeo de lançamento — o visitante que nunca ouviu falar do
 * site lê um resumo de verdade antes de pagar, que é o que mais pesa na
 * confiança de quem compra de um desconhecido. Qual resumo é decide a coluna
 * `resumos.amostra` (migration `..._amostra_gratis.sql`); a policy abre só a
 * linha marcada, e a decisão 14 continua valendo para todo o resto.
 *
 * **O mesmo pipeline da página do aluno**, na mesma ordem e pelo mesmo motivo
 * (ver `(app)/resumos/[slug]/page.tsx`): Pratique, âncoras, legendas, fórmula
 * solta, questões, wikilinks, KaTeX. Quem mudar a ordem lá muda aqui.
 *
 * **O que fica de fora é o que exige conta:** grifos, favorito, "você abriu
 * há…", a visita e o dia de estudo. As questões se respondem e corrigem, mas
 * não se guardam (`guardar={false}`).
 *
 * **As ligações apontam para `/planos?de=<slug>`.** O resumo do outro lado não
 * é amostra, e mandar o visitante a `/resumos/…` o jogaria no login. O nome e
 * a definição de cada ligação vêm de `amostra_contexto()`, que entrega SÓ a
 * vizinhança da amostra — o catálogo continua fechado ao `anon` (decisão 14).
 * O prefixo diferente é também o que o `Trilho` usa para achar o `<a>` no texto.
 *
 * **Estática com revalidação**, e é por isso que o cliente é o `supabase-js`
 * puro, sem cookie: o pico de acessos de um vídeo cai sobre HTML pronto, não
 * sobre o banco. O autor editou a amostra? Ela se atualiza em até 5 minutos.
 */
export const revalidate = 300

const SLUG_DA_AMOSTRA = 'funcoes-inorganicas'
const PREFIXO_LIGA = '/planos?de='

export const metadata: Metadata = {
  title: 'Resumo grátis — Plataforma Grafos',
  description:
    'Leia um resumo inteiro da Plataforma Grafos, sem cadastro: Funções inorgânicas, com as ligações e as questões de prova resolvidas.',
}

type Vizinho = { slug: string; titulo: string; materia_slug: string; definicao: string | null }
type Contexto = {
  citados: Vizinho[]
  citam: Vizinho[]
  irmaos: Vizinho[]
  caminho: Omit<Vizinho, 'definicao'>[]
  provas: { processo_slug: string; etapa: number }[]
}

function escaparAtributo(texto: string) {
  return texto.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

export default async function AmostraPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )

  const [{ data: resumo }, { data: ctx }] = await Promise.all([
    supabase
      .from('resumos')
      .select('id, slug, titulo, materia_slug, corpo, pai_id, margem_esq, margem_dir')
      .eq('slug', SLUG_DA_AMOSTRA)
      .eq('amostra', true)
      .maybeSingle(),
    supabase.rpc('amostra_contexto', { p_slug: SLUG_DA_AMOSTRA }),
  ])

  // Desmarcada no banco, a página some em vez de mostrar um resumo vazio.
  if (!resumo) notFound()

  const contexto: Contexto = ctx ?? { citados: [], citam: [], irmaos: [], caminho: [], provas: [] }
  const vizinhos = [...contexto.citados, ...contexto.citam, ...contexto.irmaos]
  const tituloParaSlug = Object.fromEntries(contexto.citados.map((r) => [r.titulo, r.slug]))
  const definicao = Object.fromEntries(vizinhos.map((r) => [r.slug, r.definicao]))

  const corpo = reunirQuestoes(resumo.corpo)
  const trilho = extrairTrilho(corpo, tituloParaSlug)
  const ficha = montarFicha(
    corpo,
    trilho.filter((i) => i.tipo === 'secao')
  )

  // Os links saem com o prefixo da amostra e a definição no `title`: passar o
  // mouse diz o que há do outro lado, e o clique leva aos planos.
  const comLinks = renderizarWikilinks(
    renderizarQuestoes(marcarFormulaSolta(legendarFiguras(ancorarTitulos(corpo)))),
    tituloParaSlug
  ).replace(/<a href="\/resumos\/([^"]+)"/g, (_, slug: string) => {
    const def = definicao[slug]
    const titulo = def ? ` title="${escaparAtributo(`${def} — disponível nos planos`)}"` : ''
    return `<a href="${PREFIXO_LIGA}${slug}"${titulo}`
  })
  const corpoHtml = renderizarMatematica(comLinks)

  const provas = [...contexto.provas].sort(
    (a, b) => a.processo_slug.localeCompare(b.processo_slug) || a.etapa - b.etapa
  )
  const materia = MATERIAS[resumo.materia_slug as keyof typeof MATERIAS]
  const fim = contexto.citam.length > 0 ? contexto.citam : contexto.irmaos

  return (
    <div className="amostra">
      {/* O aviso de que isto é amostra vem PRIMEIRO, antes do título: quem
          chega pelo vídeo precisa saber em um segundo que está lendo o produto
          de verdade, e não uma página de propaganda. */}
      <div className="border-b border-[var(--line)] bg-[var(--raised)]">
        <div className="max-w-[920px] mx-auto px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-[length:var(--t-peq)] text-[var(--ink-dim)] flex-1 min-w-[16rem]">
            <strong className="font-medium text-[var(--ink)]">Resumo grátis.</strong> Inteiro, do
            jeito que o aluno lê na plataforma, sem cadastro.
          </p>
          <SumarioMovel itens={trilho} prefixoLiga={PREFIXO_LIGA} />
          <Link
            href="/planos"
            className="botao botao-primario !rounded-lg shrink-0 !text-[length:var(--t-peq)] !py-1.5 !px-3"
          >
            Ver planos
          </Link>
        </div>
      </div>

      <div
        className="leitura"
        data-faixa={ladoDaFaixa(corpoHtml) ?? undefined}
        style={
          {
            ...estiloDaPagina(resumo.margem_esq ?? 150, resumo.margem_dir ?? 150),
            '--cor-materia': materia?.cor,
          } as CSSProperties
        }
      >
        <Trilho itens={trilho} prefixoLiga={PREFIXO_LIGA} />

        {/* `w-full` não existe na página do aluno, e faz falta: item de grade com
            `mx-auto` mede pelo CONTEÚDO, e as tabelas deste resumo (que rolam
            sozinhas no celular) empurravam o artigo a 920px numa tela de 375. */}
        <article className="w-full max-w-[var(--pagina)] mx-auto px-6 md:pl-[var(--margem-esq)] md:pr-[var(--margem-dir)] py-10 md:py-14">
          <span
            className="inline-flex items-center rounded-md border px-2.5 py-1 mb-5"
            style={{ borderColor: materia?.cor ?? 'var(--line-forte)' }}
          >
            <span className="text-[11px] font-medium" style={{ color: materia?.cor ?? 'var(--ink-dim)' }}>
              {materia?.nome}
            </span>
          </span>

          <h1
            className="text-[30px] font-medium leading-tight text-balance mb-8"
            style={{ color: materia?.cor ?? 'var(--ink)' }}
          >
            {resumo.titulo}
          </h1>

          <p className="faixa-resumo">
            {ficha.secoes > 0 ? (
              <span>
                {ficha.secoes} {ficha.secoes === 1 ? 'seção' : 'seções'}
              </span>
            ) : null}
            <span>{ficha.leitura}</span>
          </p>

          {contexto.caminho.length > 0 || provas.length > 0 ? (
            <div className="ficha">
              {contexto.caminho.length > 0 ? (
                <div className="cai-em dentro-de">
                  <h2>Dentro de</h2>
                  <ol>
                    {contexto.caminho.map((elo) => (
                      <li key={elo.slug}>
                        <Link
                          href={`${PREFIXO_LIGA}${elo.slug}`}
                          style={{
                            color:
                              MATERIAS[elo.materia_slug as keyof typeof MATERIAS]?.cor ??
                              'var(--ink-dim)',
                          }}
                        >
                          {elo.titulo}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
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
            </div>
          ) : null}

          {ficha.responde.length > 0 ? (
            <section className="responde">
              <h2>Esta página responde</h2>
              <ul>
                {ficha.responde.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div
            className="conteudo-resumo"
            style={{ '--cor-materia': materia?.cor } as CSSProperties}
            dangerouslySetInnerHTML={{ __html: corpoHtml }}
          />

          <LupaFigura seletor=".conteudo-resumo" />
          <Questoes resumoId={resumo.id} respostas={[]} seletor=".conteudo-resumo" guardar={false} />

          {/* As ligações: o grafo desta página, com o que há do outro lado de
              cada aresta. É o que a amostra pode mostrar do mapa sem entregar
              o texto dos outros resumos. */}
          {contexto.citados.length > 0 || fim.length > 0 ? (
            <section className="mt-16 pt-7 border-t border-[var(--line)] flex flex-col gap-10">
              {[
                { titulo: 'Este resumo se liga a', lista: contexto.citados },
                {
                  titulo:
                    contexto.citam.length > 0
                      ? 'Resumos que citam este'
                      : `Continuar em ${materia?.nome ?? 'outros resumos'}`,
                  lista: fim,
                },
              ]
                .filter((g) => g.lista.length > 0)
                .map((g) => (
                  <div key={g.titulo}>
                    <h2 className="text-[length:var(--t-mini)] font-medium text-[var(--ink-faint)] uppercase tracking-[0.04em] mb-4">
                      {g.titulo}
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {g.lista.map((b) => (
                        <li key={b.slug}>
                          <Link
                            href={`${PREFIXO_LIGA}${b.slug}`}
                            className="group flex items-center gap-3 rounded-lg bg-[var(--raised)] px-4 py-3 hover:bg-[var(--raised-hover)]"
                          >
                            <span className="min-w-0 flex-1">
                              <span
                                className="block text-sm font-medium"
                                style={{
                                  color:
                                    MATERIAS[b.materia_slug as keyof typeof MATERIAS]?.cor ??
                                    'var(--ink)',
                                }}
                              >
                                {b.titulo}
                              </span>
                              {b.definicao ? (
                                <span className="block text-[length:var(--t-peq)] text-[var(--ink-dim)] mt-0.5">
                                  {b.definicao}
                                </span>
                              ) : null}
                            </span>
                            <span
                              aria-hidden="true"
                              className="shrink-0 text-[length:var(--t-mini)] text-[var(--ink-faint)] group-hover:text-[var(--acento)]"
                            >
                              nos planos →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </section>
          ) : null}

          {/* O fecho. Diz o que a amostra NÃO mostra — é o que a conta paga
              acrescenta — e leva aos planos, sem empurrar cadastro: conta sem
              pagamento nasce sem acesso (decisão 1b). */}
          <section className="mt-16 rounded-xl border border-[var(--line-forte)] bg-[var(--raised)] px-6 py-7">
            <h2 className="text-lg font-medium mb-2">Gostou? O resto do acervo é assim.</h2>
            <p className="text-[length:var(--t-peq)] text-[var(--ink-dim)] mb-5 max-w-[56ch]">
              Na plataforma, cada ligação acima abre o resumo do outro lado, o mapa mostra o
              acervo inteiro conectado, e o site guarda suas respostas, seus grifos e a lista das
              questões que você errou para refazer. {PERIODO_DE_ACESSO.longo}
            </p>
            <Link href="/planos" className="botao botao-primario !rounded-lg px-6 py-2.5 text-sm">
              Ver planos e preços
            </Link>
          </section>
        </article>
      </div>
    </div>
  )
}

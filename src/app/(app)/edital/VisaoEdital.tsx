'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { porcentagem, type BlocoEtapa } from '@/lib/edital'
import { marcarTopico } from './acoes'

/**
 * O edital, prova por prova — e o quanto dele o aluno já estudou.
 *
 * O que esta tela mostra existia antes espalhado em 21 resumos-sumário, um por
 * matéria e etapa, que eram páginas de lista sem contagem nenhuma. Ela nasceu
 * respondendo a pergunta do AUTOR — o que falta escrever — e passou a responder
 * a do ALUNO: o que falta estudar.
 *
 * **Duas marcas por linha, com donos diferentes.** A caixinha é do aluno: ele
 * declara que estudou, e o site não deduz isso de nada (ver a migration
 * `edital_progresso`). A bolinha é do autor: cheia, o tópico tem resumo;
 * vazada, ainda não. Uma não substitui a outra — tópico sem resumo também se
 * marca, porque o aluno pode ter estudado pelo caderno.
 *
 * **A conta de "com resumo escrito" só aparece para o admin.** Ela é a lista de
 * afazeres do autor (hoje, 70 de 1114); na tela de quem paga ela lia como "94%
 * do edital não tem material". A informação não some — a bolinha continua
 * dizendo, tópico a tópico, onde ainda não há resumo. Some o agregado.
 *
 * O filtro de prova fica em estado de cliente, e não na URL. É a mesma escolha
 * da linha do tempo (decisão 9d): a URL vale a ida ao servidor quando troca a
 * TELA, como o `?visao=` do mapa; um chip que recarregasse os tópicos a cada
 * clique não vale.
 */
export default function VisaoEdital({
  blocos,
  provas,
  materias,
  nomeDaProva,
  marcadosIniciais,
  comoAutor,
}: {
  blocos: BlocoEtapa[]
  provas: { slug: string; nome: string }[]
  materias: Record<string, { nome: string; cor: string }>
  nomeDaProva: Record<string, string>
  marcadosIniciais: string[]
  comoAutor: boolean
}) {
  const [prova, setProva] = useState<string | null>(null)
  const [marcados, setMarcados] = useState(() => new Set(marcadosIniciais))
  const [, iniciar] = useTransition()

  const visiveis = prova ? blocos.filter((b) => b.processo_slug === prova) : blocos

  function alternar(id: string) {
    const novo = !marcados.has(id)
    // Otimista: a caixinha responde no clique, e o servidor grava por trás.
    // Mesmo desenho da estrela do favorito (`BotaoFavorito`).
    setMarcados((atual) => {
      const proximo = new Set(atual)
      if (novo) proximo.add(id)
      else proximo.delete(id)
      return proximo
    })
    iniciar(() => {
      marcarTopico(id, novo)
    })
  }

  const contaMarcados = (topicos: { id: string }[]) =>
    topicos.filter((t) => marcados.has(t.id)).length

  /* O cabeçalho conta o que está NA TELA, e não o edital inteiro: com o chip
     do PASSE ligado, "4 de 1114" misturaria no denominador os tópicos de uma
     prova que o aluno nem vai fazer. */
  const topicosVisiveis = visiveis.flatMap((b) => b.materias.flatMap((m) => m.topicos))
  const total = topicosVisiveis.length
  const feitos = contaMarcados(topicosVisiveis)
  const escritos = visiveis.reduce((s, b) => s + b.escritos, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shrink-0 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 sm:px-6 min-h-12 py-2 border-b border-[var(--line)]">
        <h1 className="text-[15px] font-medium">Edital</h1>
        {total > 0 ? (
          <>
            <span className="text-[11.5px] text-[var(--ink-faint)] tabular-nums">
              {feitos} de {total} tópicos marcados
            </span>
            <Barra valor={porcentagem(feitos, total)} className="w-[140px]" />
            {comoAutor ? (
              <span className="text-[11.5px] text-[var(--acento)] tabular-nums">
                · {escritos} de {total} com resumo escrito
              </span>
            ) : null}
          </>
        ) : null}
      </header>

      {blocos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <p className="text-sm text-[var(--ink-dim)] text-center">
            Nenhum edital cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="flex-1 px-4 sm:px-6 py-5">
          {provas.length > 1 ? (
            <div className="flex flex-wrap gap-1.5 mb-6">
              <Chip ativo={prova === null} onClick={() => setProva(null)}>
                Todas as provas
              </Chip>
              {provas.map((p) => (
                <Chip key={p.slug} ativo={prova === p.slug} onClick={() => setProva(p.slug)}>
                  {p.nome}
                </Chip>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-10 max-w-4xl">
            {visiveis.map((bloco) => {
              const feitosEtapa = bloco.materias.reduce((s, m) => s + contaMarcados(m.topicos), 0)
              return (
                <section key={`${bloco.processo_slug}-${bloco.etapa}`}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 pb-2 border-b border-[var(--line)]">
                    <h2 className="text-[14px] font-medium">
                      {nomeDaProva[bloco.processo_slug] ?? bloco.processo_slug} ·{' '}
                      {bloco.etapa}ª etapa
                    </h2>
                    <span className="text-[11.5px] text-[var(--ink-faint)] tabular-nums">
                      {feitosEtapa} de {bloco.total} ({porcentagem(feitosEtapa, bloco.total)}%)
                    </span>
                    <Barra
                      valor={porcentagem(feitosEtapa, bloco.total)}
                      className="w-full max-w-[220px]"
                    />
                    {comoAutor ? (
                      <span className="text-[11.5px] text-[var(--acento)] tabular-nums">
                        · {bloco.escritos} com resumo
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-6">
                    {bloco.materias.map((m) => {
                      const cor = materias[m.materia_slug]?.cor ?? 'var(--ink)'
                      return (
                        <div key={m.materia_slug}>
                          <div className="flex items-baseline gap-2 mb-1.5">
                            {/* o título sai na cor da matéria, como todo título do
                                site desde a decisão 4c */}
                            <h3 className="text-[13px] font-medium" style={{ color: cor }}>
                              {materias[m.materia_slug]?.nome ?? m.materia_slug}
                            </h3>
                            <span className="text-[11px] text-[var(--ink-faint)] tabular-nums">
                              {contaMarcados(m.topicos)}/{m.topicos.length}
                              {comoAutor ? ` · ${m.escritos} com resumo` : null}
                            </span>
                          </div>

                          <ul className="flex flex-col">
                            {m.topicos.map((t) => {
                              const feito = marcados.has(t.id)
                              return (
                                <li key={t.id}>
                                  {/* O rótulo inteiro é alvo do clique, e não só
                                      o quadradinho de 14px: numa lista de mil
                                      linhas, mirar a caixa é o que cansa. O
                                      link do resumo, por ser conteúdo
                                      interativo, continua navegando em vez de
                                      marcar. */}
                                  <label
                                    className="grid grid-cols-[24px_7px_1fr] gap-x-2 items-start py-[3px] px-1.5 -mx-1.5 rounded-[7px] cursor-pointer text-[12.5px] leading-snug hover:bg-[var(--acento-fraco)]"
                                    style={{ '--cor': cor } as React.CSSProperties}
                                  >
                                    <input
                                      type="checkbox"
                                      className="caixa-edital"
                                      checked={feito}
                                      onChange={() => alternar(t.id)}
                                    />
                                    {/* A bolinha vai ANTES do texto e não é só
                                        cor: quem não distingue os matizes
                                        precisa dela (regra do `materias.ts`).
                                        Vazada = falta escrever. */}
                                    <span
                                      aria-hidden="true"
                                      className="mt-[5px] w-[7px] h-[7px] rounded-full border"
                                      style={
                                        t.resumo_slug
                                          ? { background: cor, borderColor: cor }
                                          : { borderColor: 'var(--ink-faint)' }
                                      }
                                    />
                                    {/* Marcado, o texto esmaece em vez de
                                        ganhar um risco: há tópicos de três
                                        linhas, e texto riscado não se relê. */}
                                    <span className={feito ? 'opacity-60' : undefined}>
                                      {t.resumo_slug && t.liberado ? (
                                        <Link
                                          href={`/resumos/${t.resumo_slug}`}
                                          className="hover:underline underline-offset-2"
                                          style={{ color: feito ? 'var(--ink-faint)' : cor }}
                                        >
                                          {t.texto}
                                        </Link>
                                      ) : (
                                        <span
                                          className={
                                            t.resumo_slug && !feito
                                              ? 'text-[var(--ink-dim)]'
                                              : 'text-[var(--ink-faint)]'
                                          }
                                        >
                                          {t.texto}
                                          {/* Escrito mas fora do plano: o aluno
                                              vê que EXISTE, e o cadeado diz por
                                              que não abre. É o mesmo tratamento
                                              do cartão no mapa. */}
                                          {t.resumo_slug && !t.liberado ? (
                                            <span className="ml-1.5" title="Fora do seu plano">
                                              🔒
                                            </span>
                                          ) : null}
                                        </span>
                                      )}
                                    </span>
                                  </label>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * A barra de progresso. `aria-hidden` porque o número ao lado já diz o mesmo
 * em texto; um `role="progressbar"` repetiria a conta para o leitor de tela.
 */
function Barra({ valor, className }: { valor: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-1 rounded-full bg-[var(--line)] overflow-hidden ${className ?? ''}`}
    >
      <div
        className="h-full rounded-full bg-[var(--acento)] transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${valor}%` }}
      />
    </div>
  )
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`text-[11.5px] rounded-full border px-3 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'border-[var(--acento)] text-[var(--acento)] bg-[var(--raised)]'
          : 'border-[var(--line-forte)] text-[var(--ink-dim)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </button>
  )
}

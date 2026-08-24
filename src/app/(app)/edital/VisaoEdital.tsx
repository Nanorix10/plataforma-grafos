'use client'

import { useState } from 'react'
import Link from 'next/link'
import { porcentagem, type BlocoEtapa } from '@/lib/edital'

/**
 * A cobertura do edital, prova por prova.
 *
 * O que esta tela mostra existia antes espalhado em 21 resumos-sumário, um por
 * matéria e etapa, que eram páginas de lista sem contagem nenhuma — quinze
 * deles nem tinham resumo pendurado. Aqui a mesma lista responde a pergunta que
 * eles não respondiam: **o que falta escrever.**
 *
 * O filtro fica em estado de cliente, e não na URL. É a mesma escolha da linha
 * do tempo (decisão 9d): a URL vale a ida ao servidor quando troca a TELA, como
 * o `?visao=` do mapa; um chip que recarregasse os 326 tópicos a cada clique
 * não vale.
 */
export default function VisaoEdital({
  blocos,
  provas,
  materias,
  nomeDaProva,
}: {
  blocos: BlocoEtapa[]
  provas: { slug: string; nome: string }[]
  materias: Record<string, { nome: string; cor: string }>
  nomeDaProva: Record<string, string>
}) {
  const [prova, setProva] = useState<string | null>(null)
  const visiveis = prova ? blocos.filter((b) => b.processo_slug === prova) : blocos

  if (blocos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <p className="text-sm text-[var(--ink-dim)] text-center">
          Nenhum edital cadastrado ainda.
        </p>
      </div>
    )
  }

  return (
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
        {visiveis.map((bloco) => (
          <section key={`${bloco.processo_slug}-${bloco.etapa}`}>
            <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-[var(--line)]">
              <h2 className="text-[14px] font-medium">
                {nomeDaProva[bloco.processo_slug] ?? bloco.processo_slug} ·{' '}
                {bloco.etapa}ª etapa
              </h2>
              <span className="text-[11.5px] text-[var(--ink-faint)] tabular-nums">
                {bloco.escritos} de {bloco.total} ({porcentagem(bloco.escritos, bloco.total)}%)
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {bloco.materias.map((m) => {
                const cor = materias[m.materia_slug]?.cor ?? 'var(--ink)'
                return (
                  <div key={m.materia_slug}>
                    <div className="flex items-baseline gap-2 mb-2">
                      {/* o título sai na cor da matéria, como todo título do
                          site desde a decisão 4c */}
                      <h3 className="text-[13px] font-medium" style={{ color: cor }}>
                        {materias[m.materia_slug]?.nome ?? m.materia_slug}
                      </h3>
                      <span className="text-[11px] text-[var(--ink-faint)] tabular-nums">
                        {m.escritos}/{m.topicos.length}
                      </span>
                    </div>

                    <ul className="flex flex-col gap-1">
                      {m.topicos.map((t) => (
                        <li key={t.id} className="flex gap-2 items-baseline text-[12.5px] leading-snug">
                          {/* A marca vai ANTES do texto e não é só cor: quem não
                              distingue os matizes precisa dela (regra do
                              `materias.ts`). Círculo vazado = falta escrever. */}
                          <span
                            aria-hidden="true"
                            className="shrink-0 mt-[3px] w-[7px] h-[7px] rounded-full border"
                            style={
                              t.resumo_slug
                                ? { background: cor, borderColor: cor }
                                : { borderColor: 'var(--ink-faint)' }
                            }
                          />
                          {t.resumo_slug && t.liberado ? (
                            <Link
                              href={`/resumos/${t.resumo_slug}`}
                              className="hover:underline underline-offset-2"
                              style={{ color: cor }}
                            >
                              {t.texto}
                            </Link>
                          ) : (
                            <span
                              className={
                                t.resumo_slug ? 'text-[var(--ink-dim)]' : 'text-[var(--ink-faint)]'
                              }
                            >
                              {t.texto}
                              {/* Escrito mas fora do plano: o aluno vê que
                                  EXISTE, e o cadeado diz por que não abre. É o
                                  mesmo tratamento do cartão no mapa. */}
                              {t.resumo_slug && !t.liberado ? (
                                <span className="ml-1.5" title="Fora do seu plano">🔒</span>
                              ) : null}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
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

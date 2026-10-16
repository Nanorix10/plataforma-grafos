'use client'

/**
 * A aba 3D do mapa: o céu de matérias, cada uma aberta em árvore de andares ou
 * em constelação solta, as citações como arcos tracejados e o Teste-se.
 *
 * Quem desenha é o `Motor3D` (imperativo, fora do React). Este componente só
 * monta a moldura, carrega o Three.js sob demanda e desenha a ficha e os
 * controles a partir do `Retrato` que o motor publica. Ver a decisão 26 do
 * CONTEXTO.
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Ficha, Item, Modo, Motor3D, Retrato } from './motor3d'
import type { Materia, No } from './useExpansao'

type Props = {
  nos: No[]
  links: { origem: string; destino: string }[]
  materias: Materia[]
}

export default function Mapa3D({ nos, links, materias }: Props) {
  const router = useRouter()
  const palco = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const rotulos = useRef<HTMLDivElement>(null)
  const ficha = useRef<HTMLDivElement>(null)
  const motor = useRef<Motor3D | null>(null)
  const [r, setR] = useState<Retrato | null>(null)
  const [falhou, setFalhou] = useState(false)

  useEffect(() => {
    let vivo = true
    let m: Motor3D | null = null
    /* O Three.js (~600 kB) só desce para quem abre esta aba. */
    Promise.all([import('three'), import('./motor3d')])
      .then(([three, { Motor3D }]) => {
        if (!vivo || !palco.current || !canvas.current || !rotulos.current || !ficha.current) return
        m = new Motor3D({
          three,
          palco: palco.current,
          canvas: canvas.current,
          rotulos: rotulos.current,
          ficha: ficha.current,
          dados: { nos, links, materias },
          aoMudar: (novo) => vivo && setR(novo),
          abrirHref: (href) => router.push(href),
        })
        motor.current = m
      })
      .catch(() => vivo && setFalhou(true))
    return () => {
      vivo = false
      m?.destruir()
      motor.current = null
    }
  }, [nos, links, materias, router])

  const mo = () => motor.current
  const cruzadas = links.filter((l) => {
    const a = nos.find((n) => n.id === l.origem)
    const b = nos.find((n) => n.id === l.destino)
    return a && b && a.materia !== b.materia
  }).length

  return (
    <div ref={palco} className="mapa3d relative h-full w-full overflow-hidden bg-[var(--canvas)]">
      <canvas
        ref={canvas}
        className="absolute inset-0 h-full w-full cursor-grab touch-none"
        aria-label="Mapa em 3D: cada matéria é uma galáxia; toque numa para abrir os resumos dela em andares"
      />
      <div ref={rotulos} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />

      {falhou && (
        <p className="absolute inset-x-4 top-4 rounded-[var(--raio)] border border-[var(--line-forte)] bg-[var(--raised)] p-3 text-sm text-[var(--ink-dim)]">
          O mapa 3D não abriu neste aparelho. As abas Grafo e Mapa mental mostram o mesmo acervo.
        </p>
      )}

      {/* controles */}
      <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1.5">
        {r?.foco && (
          <span className="mr-1 text-xs text-[var(--ink-dim)]">
            <b className="font-semibold text-[var(--ink)]">{r.foco.nome}</b>
            {r.trilha.map((t, i) => (
              <span key={i}> › {t.length > 28 ? t.slice(0, 26) + '…' : t}</span>
            ))}
          </span>
        )}
        <div role="group" aria-label="Organizar a matéria aberta" className="inline-flex divide-x divide-[var(--line-forte)] overflow-hidden rounded-lg border border-[var(--line-forte)] bg-[var(--raised)]">
          {(['arvore', 'solta'] as Modo[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={r?.modo === m}
              onClick={() => mo()?.setModo(m)}
              className={`px-2.5 py-1 text-xs ${r?.modo === m ? 'bg-[var(--acento-fraco)] text-[var(--acento)]' : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
            >
              {m === 'arvore' ? 'Árvore' : 'Solta'}
            </button>
          ))}
        </div>
        <Botao ativo={!!r?.pontes} onClick={() => mo()?.setPontes(!r?.pontes)}>
          Citações
        </Botao>
        <Botao ativo={!!r?.girar} onClick={() => mo()?.setGirar(!r?.girar)}>
          Girar sozinho
        </Botao>
        {r?.podeTestar && (
          <Botao acento onClick={() => mo()?.iniciarTeste()}>
            Teste-se
          </Botao>
        )}
        {r?.foco && <Botao onClick={() => mo()?.fechar()}>Ver o céu inteiro</Botao>}
      </div>

      {/* legenda ou placar do teste */}
      {r?.quiz ? (
        <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 rounded-[var(--raio)] border border-[var(--line-forte)] bg-[var(--raised)] px-3 py-2 text-xs text-[var(--ink-dim)]">
          <span>
            <b className="font-semibold text-[var(--ink)]">Teste-se</b> · {r.quiz.raiz}
          </span>
          <span className="flex h-1.5 w-28 overflow-hidden rounded bg-[var(--line)]" aria-hidden="true">
            <span className="h-full bg-[var(--ok)]" style={{ width: `${(r.quiz.ok / r.quiz.total) * 100}%` }} />
            <span className="h-full bg-[var(--erro)]" style={{ width: `${(r.quiz.x / r.quiz.total) * 100}%` }} />
          </span>
          <span className="tabular-nums">
            <b className="text-[var(--ink)]">{r.quiz.ok + r.quiz.x}</b>/{r.quiz.total}
          </span>
          <span className="text-[var(--ok)]">{r.quiz.ok} lembrei</span>
          <span className="text-[var(--erro)]">{r.quiz.x} para refazer</span>
          <Botao onClick={() => mo()?.sairTeste()}>Sair do teste</Botao>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 flex max-w-[min(560px,calc(100%-1.5rem))] flex-wrap items-center gap-1 max-md:hidden">
          {materias.map((m) => (
            <button
              key={m.slug}
              type="button"
              aria-pressed={r?.foco?.slug === m.slug}
              onClick={() => mo()?.abrirMateria(m.slug)}
              className={`inline-flex items-center gap-1.5 rounded-full border bg-[var(--raised)] px-2 py-0.5 text-[11.5px] ${r?.foco?.slug === m.slug ? 'border-[var(--line-forte)] text-[var(--ink)]' : 'border-[var(--line)] text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
            >
              <span className="size-2 rounded-full" style={{ background: m.cor }} aria-hidden="true" />
              {m.nome}
            </button>
          ))}
          {r?.pontes && (
            <span className="inline-flex items-center gap-2.5 px-2 text-[11.5px] text-[var(--ink-dim)]">
              <span className="inline-flex items-center gap-1">
                <svg width="22" height="6" aria-hidden="true">
                  <line x1="1" y1="3" x2="21" y2="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                contém
              </span>
              <span className="inline-flex items-center gap-1">
                <svg width="22" height="6" aria-hidden="true">
                  <path d="M1 5 Q11 -1 21 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2.5" />
                </svg>
                cita · {cruzadas} entre matérias
              </span>
            </span>
          )}
        </div>
      )}

      {/* ficha: o motor observa o tamanho dela para desviar a cena */}
      <div
        ref={ficha}
        className="absolute right-3 top-14 max-h-[calc(100%-4.5rem)] w-[300px] overflow-auto max-md:left-3 max-md:top-auto max-md:bottom-3 max-md:w-auto max-md:max-h-[38%]"
      >
        {r?.ficha && (
          <div className="rounded-[var(--raio)] border border-[var(--line-forte)] bg-[var(--raised)] px-4 py-3.5">
            <CorpoFicha f={r.ficha} motor={mo} />
          </div>
        )}
      </div>
    </div>
  )
}

function Botao({
  ativo,
  acento,
  onClick,
  children,
}: {
  ativo?: boolean
  acento?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`rounded-lg border bg-[var(--raised)] px-2.5 py-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo || acento
          ? 'border-[var(--acento)] text-[var(--acento)]'
          : 'border-[var(--line-forte)] text-[var(--ink-dim)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </button>
  )
}

function Rotulo({ cor, children }: { cor?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 font-[family-name:var(--fonte-mono)] text-[10.5px] uppercase tracking-wider text-[var(--ink-faint)]">
      {cor && <span className="size-2 rounded-full" style={{ background: cor }} aria-hidden="true" />}
      {children}
    </div>
  )
}

function Lista({ itens, motor, titulo }: { itens: Item[]; motor: () => Motor3D | null; titulo?: string }) {
  if (!itens.length) return null
  return (
    <div className="mb-3">
      {titulo && <Rotulo>{titulo}</Rotulo>}
      <ol className="mt-1 border-t border-[var(--line)]">
        {itens.map((x) => (
          <li key={x.id + (x.para ?? '')} className="border-b border-[var(--line)]">
            <button
              type="button"
              onClick={() => motor()?.selecionar(x.id)}
              className={`w-full py-1.5 text-left text-[13px] leading-snug hover:text-[var(--acento)] ${x.recuo ? 'pl-3.5 text-[12.5px] text-[var(--ink-dim)]' : ''} ${x.ativo ? 'text-[var(--acento)]' : ''} ${x.outra ? 'font-semibold' : ''}`}
            >
              {(x.outra || x.seta) && (
                <span className="mr-1.5 inline-block size-[7px] rounded-full align-[1px]" style={{ background: x.cor }} aria-hidden="true" />
              )}
              {x.titulo}
              {x.seta && ` ${x.seta} ${x.para}`}
              {x.outra && <span className="text-[11.5px] font-normal text-[var(--ink-faint)]"> · {x.outra}</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CorpoFicha({ f, motor }: { f: Ficha; motor: () => Motor3D | null }) {
  const h2 = 'mt-1.5 mb-1 text-xl font-bold leading-tight text-balance'
  const p = 'mb-2.5 text-[13px] leading-normal text-[var(--ink-dim)]'
  const linha = 'mb-3 flex flex-wrap gap-1.5'

  if (f.tipo === 'fim') {
    return (
      <>
        <Rotulo cor="var(--ok)">teste-se · ramo completo</Rotulo>
        <h2 className={h2}>{f.titulo}</h2>
        <p className={p}>
          Você passou pelos {f.total} itens: lembrou {f.ok}
          {f.x ? ` e marcou ${f.x} para refazer` : ', todos'}.
        </p>
        <div className={linha}>
          {f.x > 0 && (
            <Botao acento onClick={() => motor()?.refazer()}>
              Refazer os {f.x}
            </Botao>
          )}
          <Botao onClick={() => motor()?.zerar()}>Começar de novo</Botao>
          <Botao onClick={() => motor()?.sairTeste()}>Sair do teste</Botao>
        </div>
      </>
    )
  }

  if (f.tipo === 'pergunta') {
    return (
      <>
        <Rotulo cor={f.cor}>teste-se · {f.rotulo}</Rotulo>
        <h2 className={`${h2} ${f.aberto ? '' : 'text-[var(--ink-dim)]'}`}>
          {f.aberto ? f.titulo : 'Que assunto mora aqui?'}
        </h2>
        <p className={p}>
          Fica debaixo de <b className="text-[var(--ink)]">{f.pai}</b>
          {f.abre > 0 && ` e abre ${f.abre} ${f.abre > 1 ? 'itens' : 'item'} no andar de baixo`}.
        </p>
        {f.aoLado.length > 0 && <p className={`${p} text-xs`}>Ao lado: {f.aoLado.join(' · ')}</p>}
        {f.aberto ? (
          <>
            <p className={p}>Você lembrou?</p>
            <div className={linha}>
              <button type="button" onClick={() => motor()?.julgar('ok')} className="rounded-lg border border-[var(--ok)] px-3 py-1.5 text-[13px] text-[var(--ok)]">
                Lembrei <kbd className="ml-1 text-[10.5px]">1</kbd>
              </button>
              <button type="button" onClick={() => motor()?.julgar('x')} className="rounded-lg border border-[var(--erro)] px-3 py-1.5 text-[13px] text-[var(--erro)]">
                Não lembrei <kbd className="ml-1 text-[10.5px]">2</kbd>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={linha}>
              <button type="button" onClick={() => motor()?.revelar()} className="rounded-lg border border-[var(--acento)] px-3 py-1.5 text-[13px] text-[var(--acento)]">
                Revelar <kbd className="ml-1 text-[10.5px]">Enter</kbd>
              </button>
              <Botao onClick={() => motor()?.pular()}>Pular</Botao>
            </div>
            <p className={`${p} text-xs`}>
              Responda de cabeça antes de revelar. O esforço de lembrar é o que fixa o assunto.
            </p>
          </>
        )}
      </>
    )
  }

  if (f.tipo === 'materia') {
    return (
      <>
        <Rotulo cor={f.cor}>matéria</Rotulo>
        <h2 className={h2} style={{ color: f.cor }}>
          {f.titulo}
        </h2>
        <p className={p}>{f.resumo}</p>
        {f.podeTestar && (
          <div className={linha}>
            <Botao acento onClick={() => motor()?.iniciarTeste()}>
              Testar a matéria inteira
            </Botao>
          </div>
        )}
        <Lista titulo="Citações com outras matérias" itens={f.pontes} motor={motor} />
        <Lista itens={f.primeiros} motor={motor} />
      </>
    )
  }

  return (
    <>
      <Rotulo cor={f.liberado ? f.cor : 'var(--ink-faint)'}>{f.rotulo}</Rotulo>
      <h2 className={h2} style={{ color: f.liberado ? f.cor : 'var(--ink-faint)' }}>
        {f.titulo}
      </h2>
      {f.marcou && (
        <p className={`mb-2 text-xs ${f.marcou === 'ok' ? 'text-[var(--ok)]' : 'text-[var(--erro)]'}`}>
          {f.marcou === 'ok' ? 'Você lembrou deste.' : 'Marcado para refazer.'}
        </p>
      )}
      {!f.liberado && (
        <p className={p}>
          Fora do seu plano. <Link href="/planos" className="text-[var(--acento)] underline">Ver os planos</Link>
        </p>
      )}
      {f.podeTestar && (
        <div className={linha}>
          <Botao acento onClick={() => motor()?.iniciarTeste()}>
            Testar este ramo
          </Botao>
        </div>
      )}
      <Lista titulo="Cita" itens={f.cita} motor={motor} />
      <Lista titulo="É citado por" itens={f.citadoPor} motor={motor} />
      {f.sub.length > 0 && <p className={p}>Abre {f.sub.length} resumo{f.sub.length > 1 ? 's' : ''} no andar de baixo.</p>}
      <Lista itens={f.sub} motor={motor} />
      <Lista itens={f.secoes} motor={motor} />
      {f.liberado && !f.secoes.length && f.tipo === 'resumo' && (
        <p className={`${p} text-xs`}>Este resumo ainda não tem seções.</p>
      )}
      {f.href && !f.emTeste && (
        <Link
          href={f.href}
          className="inline-block rounded-lg border border-[var(--acento)] px-3 py-1.5 text-[13px] font-semibold text-[var(--acento)] hover:bg-[var(--acento-fraco)]"
        >
          Abrir o resumo
        </Link>
      )}
    </>
  )
}

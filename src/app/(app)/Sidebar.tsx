'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { MATERIAS } from '@/lib/materias'
// de `lib/arvore` e não de `lib/resumos`: este é um componente de cliente, e
// `resumos.ts` importa `getSessao`, que depende de `next/headers`
import { montarArvore, type NoResumo, type ResumoItem } from '@/lib/arvore'
import { alternarVisao } from './acoes'
import { BotaoTema } from '@/components/BotaoTema'

type Grupo = { materia: string; itens: ResumoItem[]; arvore: NoResumo[] }

function Chevron({ aberto }: { aberto: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      className={`shrink-0 transition-transform ${aberto ? 'rotate-90' : ''}`}
      aria-hidden
    >
      <path d="M3 1.5 L7 5 L3 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Marcador dos itens fixos do menu. Substitui os glifos ▤ ◈ ✎, que eram
 * caracteres tipográficos — desenhavam diferente em cada sistema e não
 * significavam nada pra quem não conhece o símbolo. Um ponto que acende
 * quando o item está aberto diz a mesma coisa sem depender da fonte.
 */
function Ponto({ ativo }: { ativo: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        ativo ? 'bg-[var(--acento)]' : 'border border-[var(--ink-faint)]'
      }`}
    />
  )
}

function ItemNav({
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
      aria-current={ativo ? 'page' : undefined}
      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento-claro)]'
          : 'text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </Link>
  )
}

/**
 * Um resumo na árvore, com os que moram dentro dele.
 *
 * A profundidade é livre, então isto se chama recursivamente. O recuo vem por
 * `style` e não por classe do Tailwind: o nível não é um valor conhecido em
 * tempo de build, e classe gerada em runtime (`pl-${n}`) não existe no CSS
 * final. Cada nível ganha uma guia vertical, que é o que deixa ler de relance
 * onde uma ramificação termina.
 */
function ItemArvore({
  no,
  pathname,
  nivel,
  materiaDoGrupo,
}: {
  no: NoResumo
  pathname: string
  nivel: number
  /** matéria do bloco onde esta árvore está sendo desenhada */
  materiaDoGrupo: string
}) {
  const [aberto, setAberto] = useState(true)
  const href = `/resumos/${no.slug}`
  const ativo = pathname === href
  const temFilhos = no.filhos.length > 0
  // um assunto pode segurar tópicos de outras disciplinas; quando isso
  // acontece, o ponto na cor da matéria de origem evita a leitura errada de
  // que o resumo pertence à matéria do bloco
  const deOutraMateria = no.materia_slug !== materiaDoGrupo
  const corOutra = MATERIAS[no.materia_slug as keyof typeof MATERIAS]?.cor

  return (
    <li>
      <div className="flex items-center gap-0.5" style={{ paddingLeft: nivel * 10 }}>
        {temFilhos ? (
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-label={aberto ? `Recolher ${no.titulo}` : `Expandir ${no.titulo}`}
            className="w-[14px] h-[18px] shrink-0 flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
          >
            <Chevron aberto={aberto} />
          </button>
        ) : (
          // espaço reservado: sem ele, os resumos sem filhos ficariam
          // desalinhados dos que têm
          <span className="w-[14px] shrink-0" aria-hidden="true" />
        )}

        <Link
          href={href}
          title={no.liberado ? no.titulo : `${no.titulo} — fora do seu plano`}
          aria-current={ativo ? 'page' : undefined}
          className={`flex-1 min-w-0 block px-1.5 py-[5px] rounded-md text-[12.5px] truncate focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
            ativo
              ? 'shadow-[inset_0_0_0_1px_var(--line-forte)] text-[var(--ink)]'
              : no.liberado
                ? 'text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
                : 'text-[var(--ink-faint)] hover:bg-[var(--sel)]'
          }`}
        >
          {no.liberado ? null : <span aria-hidden="true" className="mr-1">🔒</span>}
          {deOutraMateria && corOutra ? (
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
              style={{ background: corOutra }}
            />
          ) : null}
          {no.titulo}
        </Link>

        {temFilhos ? (
          <span className="text-[10px] text-[var(--ink-faint)] pr-1 shrink-0 tabular-nums">
            {no.filhos.length}
          </span>
        ) : null}
      </div>

      {temFilhos && aberto ? (
        <ul
          className="list-none m-0 p-0 shadow-[inset_1px_0_0_var(--line)]"
          style={{ marginLeft: nivel * 10 + 7 }}
        >
          {no.filhos.map((f) => (
            <ItemArvore key={f.slug} no={f} pathname={pathname} nivel={0} materiaDoGrupo={materiaDoGrupo} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default function Sidebar({
  grupos,
  isAdmin,
  isAdminReal,
  vendoComoAluno,
  plano,
}: {
  grupos: Grupo[]
  isAdmin: boolean
  isAdminReal: boolean
  vendoComoAluno: boolean
  plano: string
}) {
  const pathname = usePathname()
  const [busca, setBusca] = useState('')
  const [fechados, setFechados] = useState<Set<string>>(new Set())

  /**
   * No celular a barra vira gaveta. Ela tem 262px fixos: numa tela de 390px
   * sobrariam 128px para o resumo, que é o conteúdo que o aluno veio ler.
   * A partir de `lg` ela volta a ser coluna fixa, como sempre foi.
   */
  const [menuAberto, setMenuAberto] = useState(false)

  // Esc fecha, como em qualquer camada sobreposta
  useEffect(() => {
    if (!menuAberto) return
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuAberto(false)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [menuAberto])

  /**
   * Buscando, a árvore vira lista.
   *
   * Manter a hierarquia durante a busca obrigaria a mostrar os ancestrais de
   * cada resultado só para servirem de caminho — e o que se quer ao digitar é
   * a lista curta do que casou, não a estrutura em volta. Sem busca, a árvore
   * volta inteira. Ela é remontada a partir dos itens filtrados porque um
   * resultado pode ter ficado sem o pai.
   */
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return grupos
    return grupos
      .map((g) => {
        const itens = g.itens.filter((i) => i.titulo.toLowerCase().includes(q))
        return { ...g, itens, arvore: montarArvore(itens) }
      })
      .filter((g) => g.itens.length > 0)
  }, [grupos, busca])

  function alternarGrupo(materia: string) {
    setFechados((atual) => {
      const novo = new Set(atual)
      if (novo.has(materia)) novo.delete(materia)
      else novo.add(materia)
      return novo
    })
  }

  // conta MATÉRIAS, que é o que o rótulo promete. Antes somava os resumos de
  // todos os grupos: a barra dizia "Matérias (3)" com duas matérias na tela.
  const totalMaterias = grupos.length

  return (
    <>
      {/* Barra do celular: some a partir de `lg`, onde a coluna fixa dá conta.
          É `fixed` porque o conteúdo rola por baixo dela — o layout reserva a
          altura com um padding no <main>. */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-12 flex items-center gap-2 px-3 bg-[var(--panel)] border-b border-[var(--line)]">
        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-expanded={menuAberto}
          aria-controls="barra-lateral"
          aria-label="Abrir menu"
          className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
        >
          <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden>
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <Link href="/resumos" className="marca font-medium text-sm truncate">
          Plataforma Grafos
        </Link>
        <BotaoTema className="ml-auto" />
      </div>

      {/* Véu: fecha a gaveta ao tocar fora. Só existe com ela aberta. */}
      {menuAberto ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
        />
      ) : null}

      <aside
        id="barra-lateral"
        /* Tocar num link fecha a gaveta. Por delegação, e não por um efeito que
           observa a rota: assim fecha no toque, sem esperar a navegação — e um
           `setState` dentro de efeito dispara render em cascata à toa. Só links
           contam; os botões de expandir matéria mantêm o menu aberto, que é o
           que se espera de quem está procurando um resumo. */
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setMenuAberto(false)
        }}
        className={`w-[262px] shrink-0 flex flex-col bg-[var(--panel)] border-r border-[var(--line)]
          fixed inset-y-0 left-0 z-50 transition-transform duration-200
          ${menuAberto ? 'translate-x-0' : '-translate-x-full'}
          lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:translate-x-0 lg:transition-none`}
      >
      {/* topo */}
      <div className="px-3 pt-3.5 pb-2.5">
        <Link
          href="/resumos"
          className="marca block font-medium text-[14px] mb-3.5 px-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
        >
          Plataforma Grafos
        </Link>

        <input
          type="search"
          name="busca"
          aria-label="Buscar resumo"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar resumo…"
          className="campo text-[12.5px] !py-1.5"
        />
      </div>

      {/* navegação fixa */}
      <nav className="px-2 pb-2 flex flex-col gap-0.5">
        <ItemNav href="/resumos" ativo={pathname === '/resumos'}>
          <Ponto ativo={pathname === '/resumos'} /> Todos os resumos
        </ItemNav>
        <ItemNav href="/mapa" ativo={pathname === '/mapa'}>
          <Ponto ativo={pathname === '/mapa'} /> Mapa de conexões
        </ItemNav>
        {isAdmin ? (
          <>
            <ItemNav href="/admin/editor" ativo={pathname.startsWith('/admin/editor')}>
              <Ponto ativo={pathname.startsWith('/admin/editor')} /> Editor
            </ItemNav>
            <ItemNav href="/admin/pessoas" ativo={pathname.startsWith('/admin/pessoas')}>
              <Ponto ativo={pathname.startsWith('/admin/pessoas')} /> Pessoas
            </ItemNav>
          </>
        ) : null}
      </nav>

      <div className="mx-3 border-t border-[var(--line)]" />

      {/* árvore de matérias */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="rotulo-secao text-[10px] px-2.5 pb-2">
          Matérias ({totalMaterias})
        </div>

        {filtrados.length === 0 && (
          <p className="text-[12px] text-[var(--ink-dim)] px-2.5 py-2">
            {busca ? 'Nada encontrado.' : 'Nenhum resumo ainda.'}
          </p>
        )}

        {filtrados.map(({ materia, itens, arvore }) => {
          const info = MATERIAS[materia as keyof typeof MATERIAS]
          const aberto = !fechados.has(materia) || !!busca

          return (
            <div key={materia} className="mb-0.5">
              <button
                type="button"
                onClick={() => alternarGrupo(materia)}
                aria-expanded={aberto}
                className="w-full flex items-center gap-2 px-2.5 py-[5px] rounded-md text-[12.5px] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
              >
                <Chevron aberto={aberto} />
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: info?.cor ?? 'var(--ink-faint)' }}
                />
                <span className="truncate">{info?.nome ?? materia}</span>
                <span className="ml-auto text-[10.5px] opacity-60">{itens.length}</span>
              </button>

              {aberto && (
                <ul className="list-none m-0 ml-[13px] border-l border-[var(--line)] pl-0.5 p-0">
                  {arvore.map((no) => (
                    <ItemArvore key={no.slug} no={no} pathname={pathname} nivel={0} materiaDoGrupo={materia} />
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {/* rodapé */}
      <div className="border-t border-[var(--line)] px-3 py-2.5 flex flex-col gap-2">
        {isAdminReal ? (
          <form action={alternarVisao}>
            <button
              type="submit"
              className={`w-full text-[12px] rounded-lg px-2.5 py-1.5 border text-left flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
                vendoComoAluno
                  ? 'border-[var(--acento)] text-[var(--acento)] hover:bg-[var(--acento-fraco)]'
                  : 'border-[var(--line-forte)] text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
              }`}
            >
              <span aria-hidden="true">{vendoComoAluno ? '👁' : '⚙'}</span>
              {vendoComoAluno ? 'Vendo como aluno — voltar' : 'Ver como aluno'}
            </button>
          </form>
        ) : null}

        <div className="flex items-center gap-1">
          <div className="text-[10.5px] text-[var(--ink-faint)] px-0.5">
            plano: {plano}
            {isAdmin && ' · admin'}
          </div>
          <BotaoTema className="ml-auto -my-1" />
        </div>
      </div>
      </aside>
    </>
  )
}

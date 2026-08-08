'use client'

import { useSyncExternalStore } from 'react'

type Tema = 'claro' | 'escuro' | 'sistema'

/**
 * O tema vive no `<html data-tema>`, escrito pelo script do `layout.tsx` antes
 * da primeira pintura. Este módulo só lê e escreve esse atributo.
 *
 * `useSyncExternalStore` em vez de `useState` + `useEffect`: o valor mora fora
 * do React (no DOM e no localStorage), e o servidor não tem como saber qual é.
 * O hook existe para exatamente isso — devolve `null` na renderização do
 * servidor e o valor real no cliente, sem o `setState` dentro de efeito que
 * dispara render em cascata.
 */
const ouvintes = new Set<() => void>()

function assinar(aoMudar: () => void) {
  ouvintes.add(aoMudar)
  return () => {
    ouvintes.delete(aoMudar)
  }
}

function lerNoCliente(): Tema {
  const t = document.documentElement.dataset.tema
  return t === 'claro' || t === 'escuro' ? t : 'sistema'
}

/** O servidor não conhece a escolha do aluno — e não deve fingir que conhece. */
function lerNoServidor(): null {
  return null
}

function aplicarTema(novo: Tema) {
  const raiz = document.documentElement
  if (novo === 'sistema') delete raiz.dataset.tema
  else raiz.dataset.tema = novo

  try {
    if (novo === 'sistema') localStorage.removeItem('tema')
    else localStorage.setItem('tema', novo)
  } catch {
    // localStorage bloqueado (aba anônima restrita): a troca vale nesta
    // sessão, só não sobrevive ao recarregar
  }

  ouvintes.forEach((f) => f())
}

/**
 * Alterna claro → escuro → seguir o aparelho.
 *
 * Os três estados são de propósito. Com só dois, quem clica uma vez fica preso
 * à escolha e não tem como voltar a acompanhar o celular quando ele troca
 * sozinho ao anoitecer.
 */
export function BotaoTema({ className = '' }: { className?: string }) {
  const tema = useSyncExternalStore(assinar, lerNoCliente, lerNoServidor)

  const proximo: Tema =
    tema === 'claro' ? 'escuro' : tema === 'escuro' ? 'sistema' : 'claro'

  const rotulo =
    tema === 'claro'
      ? 'Tema claro. Trocar para escuro'
      : tema === 'escuro'
        ? 'Tema escuro. Trocar para o do aparelho'
        : 'Tema do aparelho. Trocar para claro'

  return (
    <button
      type="button"
      onClick={() => aplicarTema(proximo)}
      // até saber o tema (só no cliente) o botão ocupa o espaço sem afirmar
      // nada — um ícone chutado aqui piscaria ao ser corrigido
      disabled={tema === null}
      aria-label={rotulo}
      title={rotulo}
      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] disabled:opacity-0 ${className}`}
    >
      {tema === 'claro' ? (
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
          <circle cx="10" cy="10" r="3.4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4" />
          </g>
        </svg>
      ) : tema === 'escuro' ? (
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
          <path
            d="M16 12.3A6.8 6.8 0 0 1 7.7 4a6.9 6.9 0 1 0 8.3 8.3Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        // círculo meio cheio: está seguindo o aparelho
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
          <circle
            cx="10"
            cy="10"
            r="6.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M10 3.8a6.2 6.2 0 0 1 0 12.4Z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}

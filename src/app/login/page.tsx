'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    const { error } =
      modo === 'entrar'
        ? await supabase.auth.signInWithPassword({ email, password: senha })
        : await supabase.auth.signUp({ email, password: senha })

    setCarregando(false)

    if (error) {
      setErro(error.message)
      return
    }
    router.push('/resumos')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-2.5 font-semibold text-[19px] mb-10 justify-center">
          <span aria-hidden="true" className="w-[30px] h-[30px] rounded-full border-[1.5px] border-[var(--stamp)] flex items-center justify-center font-mono-plex text-[11px] text-[var(--stamp)]">PG</span>
          Plataforma Grafos
        </div>

        <div role="tablist" className="flex gap-1 bg-[var(--panel)] rounded-md p-1 mb-8">
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'entrar'}
            onClick={() => setModo('entrar')}
            className={`flex-1 py-2.5 rounded text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--stamp)] ${modo === 'entrar' ? 'bg-white shadow-sm' : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'cadastrar'}
            onClick={() => setModo('cadastrar')}
            className={`flex-1 py-2.5 rounded text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--stamp)] ${modo === 'cadastrar' ? 'bg-white shadow-sm' : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-[13px] text-[var(--ink-dim)] mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              // sem isso o gerenciador de senhas do celular não preenche nada
              autoComplete="email"
              spellCheck={false}
              autoCapitalize="none"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-[13px] text-[var(--ink-dim)] mb-1.5">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              // 'current-password' ao entrar e 'new-password' ao cadastrar: é o
              // que faz o cofre sugerir senha forte só na hora certa
              autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
              placeholder="mínimo 6 caracteres"
            />
          </div>

          {/* aria-live faz o leitor de tela anunciar o erro, que aparece depois
              da resposta da rede e portanto não seria lido de outra forma */}
          <p role="status" aria-live="polite" className="text-sm text-[var(--stamp)] empty:hidden">
            {erro}
          </p>

          <button
            type="submit"
            disabled={carregando}
            className="mt-2 bg-[var(--stamp)] text-white font-semibold py-3 rounded-md text-sm disabled:opacity-60 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--stamp)]"
          >
            {carregando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  )
}

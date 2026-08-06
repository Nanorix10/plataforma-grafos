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
          <span className="w-[30px] h-[30px] rounded-full border-[1.5px] border-[var(--stamp)] flex items-center justify-center font-mono-plex text-[11px] text-[var(--stamp)]">MR</span>
          Mestre Ronny
        </div>

        <div className="flex gap-1 bg-[var(--panel)] rounded-md p-1 mb-8">
          <button
            onClick={() => setModo('entrar')}
            className={`flex-1 py-2.5 rounded text-sm font-medium ${modo === 'entrar' ? 'bg-white shadow-sm' : 'text-[var(--ink-dim)]'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => setModo('cadastrar')}
            className={`flex-1 py-2.5 rounded text-sm font-medium ${modo === 'cadastrar' ? 'bg-white shadow-sm' : 'text-[var(--ink-dim)]'}`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)]"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)]"
              placeholder="mínimo 6 caracteres"
            />
          </div>

          {erro && <p className="text-sm text-[var(--stamp)]">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="mt-2 bg-[var(--stamp)] text-white font-semibold py-3 rounded-md text-sm disabled:opacity-60"
          >
            {carregando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  )
}

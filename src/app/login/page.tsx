'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BotaoTema } from '@/components/BotaoTema'
import Marca from '@/components/Marca'

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
    /* `dvh` e não `vh`: no celular a barra do navegador entra e sai da tela, e
       `100vh` é sempre a altura SEM ela — o cartão de login nascia empurrado
       para fora por alguns pixels. */
    <main className="min-h-dvh flex items-center px-6 md:px-24">
      <BotaoTema className="fixed top-4 right-4" />
      <div className="w-full max-w-[360px]">
        <Marca tamanho="grande" className="mb-9" />

        {/* Duas abas emendadas numa cápsula só, com a ativa marcada por um anel
            lilás. A versão anterior pintava a aba ativa de branco sobre cinza —
            no escuro esse contraste inverte e a aba ativa é que sumiria. */}
        <div role="tablist" className="inline-flex overflow-hidden rounded-lg border border-[var(--line-forte)] mb-7">
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'entrar'}
            onClick={() => setModo('entrar')}
            className={`px-4.5 py-2 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)] ${modo === 'entrar' ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento)]' : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'cadastrar'}
            onClick={() => setModo('cadastrar')}
            className={`px-4.5 py-2 text-[13px] border-l border-[var(--line-forte)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)] ${modo === 'cadastrar' ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento)]' : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs text-[var(--ink-soft)] mb-1.5">
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
              className="campo text-sm"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-xs text-[var(--ink-soft)] mb-1.5">
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
              className="campo text-sm"
              placeholder="mínimo 6 caracteres"
            />
          </div>

          {/* aria-live faz o leitor de tela anunciar o erro, que aparece depois
              da resposta da rede e portanto não seria lido de outra forma */}
          <p role="status" aria-live="polite" className="text-sm text-[var(--erro)] empty:hidden">
            {erro}
          </p>

          <button
            type="submit"
            disabled={carregando}
            className="botao botao-primario mt-1.5 w-full py-2.5 !rounded-lg text-sm font-medium"
          >
            {carregando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </main>
  )
}

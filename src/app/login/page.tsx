'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BotaoTema } from '@/components/BotaoTema'
import Marca from '@/components/Marca'

/**
 * As duas abas, como DADO e no escopo do módulo.
 *
 * Fora do componente de propósito: uma função de componente definida dentro do
 * render é remontada a cada pintura (é o que o `react-hooks/static-components`
 * acusa em `admin/editor/Regua.tsx`), e aqui isso custaria o foco no meio da
 * navegação por setas — justamente o que este bloco veio consertar.
 */
const ABAS = [
  { id: 'entrar', rotulo: 'Entrar' },
  { id: 'cadastrar', rotulo: 'Criar conta' },
] as const

const PAINEL = 'painel-acesso'

export default function LoginPage() {
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  /**
   * O que vai pro Supabase sai do FORMULÁRIO, não de `useState`.
   *
   * Antes os dois campos eram controlados e o envio mandava o estado. Quem
   * preenche por fora — autofill do Chrome, cofre do Android, 1Password —
   * escreve o `value` do DOM sem passar pelo `onChange` do React, então o
   * estado continuava vazio enquanto a tela mostrava e-mail e senha
   * preenchidos. O `required` olha o DOM, via preenchido, e deixava enviar:
   * o aluno via os campos cheios e recebia "missing email or phone".
   *
   * Isso contradizia o próprio projeto — os `autoComplete` abaixo existem
   * justamente pra o gerenciador de senhas preencher, e o formulário jogava
   * fora o que ele preenchia.
   *
   * Campo não controlado resolve na raiz: o `<input>` é a única cópia do
   * valor, então não há estado pra dessincronizar, seja qual for o caminho
   * que preencheu. Conferido com Playwright, escrevendo no DOM pelo setter
   * nativo sem disparar `input` — que é o pior caso que um preenchedor faz.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const dados = new FormData(e.currentTarget)
    const email = String(dados.get('email') ?? '')
    const senha = String(dados.get('senha') ?? '')

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
        {/* A `Marca` é um <span inline-flex> (para o símbolo e o nome ficarem
            lado a lado quando a logo existir), e a cápsula de abas abaixo
            também é inline. Dois elementos inline caem na MESMA linha, e a
            cápsula subia por cima do nome — `mb-9` num inline empurra a linha,
            não o vizinho. O invólucro de bloco é o que separa os dois. */}
        <div className="mb-9">
          <Marca tamanho="grande" />
        </div>

        {/* Duas abas emendadas numa cápsula só, com a ativa marcada por um anel
            lilás. A versão anterior pintava a aba ativa de branco sobre cinza —
            no escuro esse contraste inverte e a aba ativa é que sumiria.

            As SETAS andam entre elas, e isso não é enfeite de acessibilidade:
            o `role="tablist"` já estava aqui e as setas não faziam nada, então
            o leitor de tela anunciava "aba, 1 de 2, use as setas" e as setas
            não respondiam. A promessa saía do site e quem ficava sem saída era
            justamente quem dependia dela.

            Duas peças do padrão que não dá pra adivinhar lendo o CSS:

            - **Tabindex rotativo.** Só a aba ATIVA é alcançável por Tab (`0`);
              a outra sai da ordem (`-1`). É o que faz o Tab atravessar a
              cápsula de uma vez, em vez de parar duas vezes — dentro dela quem
              anda é a seta. Sem isso, seta e Tab fariam a mesma coisa e a seta
              não teria por que existir.
            - **`aria-controls` nos dois, apontando pro MESMO painel.** Aqui não
              existem dois conteúdos: o formulário é um só e o que muda é o que
              o envio faz. Então o painel é único, e quem troca é o
              `aria-labelledby` dele — dizendo qual aba o está rotulando agora. */}
        <div
          role="tablist"
          aria-label="Entrar ou criar conta"
          onKeyDown={(e) => {
            const atual = ABAS.findIndex((a) => a.id === modo)
            const destino =
              e.key === 'ArrowRight' ? (atual + 1) % ABAS.length
              : e.key === 'ArrowLeft' ? (atual - 1 + ABAS.length) % ABAS.length
              : e.key === 'Home' ? 0
              : e.key === 'End' ? ABAS.length - 1
              : null
            if (destino === null) return
            e.preventDefault()
            const proxima = ABAS[destino]
            setModo(proxima.id)
            // O foco acompanha a seleção: neste padrão a aba que a seta alcança
            // é a que fica ativa E focada, senão o anel de foco ficaria para
            // trás numa aba que já não é a escolhida.
            document.getElementById(`aba-${proxima.id}`)?.focus()
          }}
          className="inline-flex overflow-hidden rounded-lg border border-[var(--line-forte)] mb-7"
        >
          {ABAS.map((aba, i) => (
            <button
              key={aba.id}
              id={`aba-${aba.id}`}
              type="button"
              role="tab"
              aria-selected={modo === aba.id}
              aria-controls={PAINEL}
              tabIndex={modo === aba.id ? 0 : -1}
              onClick={() => setModo(aba.id)}
              className={`px-4.5 py-2 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)] ${i > 0 ? 'border-l border-[var(--line-forte)]' : ''} ${modo === aba.id ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento)]' : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
            >
              {aba.rotulo}
            </button>
          ))}
        </div>

        <form
          id={PAINEL}
          role="tabpanel"
          aria-labelledby={`aba-${modo}`}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
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

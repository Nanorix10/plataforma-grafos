'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { mensagemDeErro } from '@/lib/erros-auth'
import { CampoSenha } from '@/components/CampoSenha'
import { CartaoAcesso, LinkAcesso } from '@/components/CartaoAcesso'

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
  const [confirmarEmail, setConfirmarEmail] = useState<string | null>(null)
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

    const { data, error } =
      modo === 'entrar'
        ? await supabase.auth.signInWithPassword({ email, password: senha })
        : await supabase.auth.signUp({ email, password: senha })

    setCarregando(false)

    if (error) {
      setErro(mensagemDeErro(error))
      return
    }

    /* **Cadastrar nem sempre abre sessão, e ignorar isso era um beco.**
     *
     * Com a confirmação de e-mail ligada no painel do Supabase (Authentication
     * → Providers → Email), `signUp` devolve `session: null` e nenhum erro: a
     * conta nasceu, mas só vale depois do clique no link. O código antigo
     * empurrava todo mundo para `/resumos`, e lá o guard do `(app)` — que só
     * pergunta se há sessão — devolvia a pessoa para cá. Ela apertava "Criar
     * conta", a tela piscava e voltava ao mesmo lugar, sem uma palavra. Quem
     * lê isso conclui que o site quebrou, não que falta abrir um e-mail.
     *
     * A pergunta é `data.session`, e não uma leitura do painel: a configuração
     * mora do lado do Supabase e pode ser ligada ou desligada sem tocar neste
     * arquivo. Perguntar ao retorno funciona nos dois casos.
     *
     * `signUp` de e-mail que JÁ tem conta cai aqui também, e de propósito. Com
     * a proteção contra enumeração ligada (o padrão), o Supabase responde a
     * esse caso com um usuário de fachada e `session: null`, sem erro nenhum —
     * é assim que ele impede a tela de virar um verificador de quem estuda
     * aqui. Mandar essa pessoa conferir o e-mail é a resposta certa: ou o link
     * chega, ou ela já sabia a senha. (Com a proteção desligada vem
     * `user_already_exists`, que o `mensagemDeErro` acima já traduz para
     * "troque para Entrar".) */
    if (modo === 'cadastrar' && !data.session) {
      setConfirmarEmail(email)
      return
    }
    router.push('/resumos')
  }

  /**
   * O cadastro que espera o clique no e-mail.
   *
   * Substitui o cartão inteiro em vez de virar uma linha de aviso acima do
   * formulário: o formulário já cumpriu o que tinha para fazer, e deixá-lo na
   * tela oferece um botão "Criar conta" que só pode falhar a partir daqui.
   *
   * A segunda frase não é enfeite. Pela decisão 1b o cadastro é aberto e o
   * acesso é fechado: confirmado o e-mail, o aluno entra e não vê resumo
   * algum, porque `PLANO_PROCESSOS.nenhum` é lista vazia. Sem esse aviso, o
   * caminho natural é achar que a confirmação não funcionou e cadastrar de
   * novo. A frase é a mesma de `/conta`, palavra por palavra, para as duas
   * telas não parecerem descrever regras diferentes.
   */
  if (confirmarEmail) {
    return (
      <CartaoAcesso legenda="Criar conta">
        {/* `role="status"` porque o cartão TROCA depois de uma ida à rede: sem
            ele, quem usa leitor de tela apertaria "Criar conta" e não seria
            avisado de nada — o foco fica num botão que já saiu da tela. */}
        <div role="status">
          <h1 className="text-[var(--t-grande)] font-semibold text-[var(--ink)]">
            Confira seu e-mail
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
            Mandamos um link de confirmação para{' '}
            <strong className="text-[var(--ink)]">{confirmarEmail}</strong>. Abra o link e
            depois volte aqui para entrar.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
            Não chegou em alguns minutos? Olhe no spam e confira se o endereço está certo.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-faint)]">
            Depois de entrar, sua conta ainda começa sem acesso aos resumos. A liberação é
            feita à mão depois do pagamento.
          </p>

          <button
            type="button"
            onClick={() => {
              setConfirmarEmail(null)
              setModo('entrar')
            }}
            className="botao botao-neutro mt-5 w-full py-2.5 !rounded-lg text-sm font-medium"
          >
            Voltar para entrar
          </button>
        </div>
      </CartaoAcesso>
    )
  }

  return (
    <CartaoAcesso legenda="Resumos interligados para o PASSE, o PAS UEM e o PAS UnB.">
      {/* Duas abas emendadas numa cápsula só, com a ativa marcada por um anel
          lilás. A versão anterior pintava a aba ativa de branco sobre cinza —
          no escuro esse contraste inverte e a aba ativa é que sumiria.

          A cápsula ocupa a LARGURA do cartão (`grid-cols-2`), e não a largura
          do próprio texto. Solta, ela flutuava acima de um formulário mais
          largo e as duas peças não pareciam a mesma coisa; alinhada às bordas
          dos campos, a aba lê como o cabeçalho do que está embaixo dela. É
          também o que dispensou o invólucro de bloco que a separava da marca:
          `inline-flex` caía na mesma linha do nome do site, e `grid` não cai.

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
        className="grid grid-cols-2 rounded-lg border border-[var(--line-forte)] mb-6"
      >
        {ABAS.map((aba, i) => {
          const acesa = modo === aba.id

          /* **O divisor separa duas abas APAGADAS.** Com a vizinha acesa, o
             anel de acento dela já faz a separação, e as duas linhas coladas
             viram um traço duplo — lilás encostado no tan, que a 1px lê como
             sujeira e não como divisão. Com duas abas uma está sempre acesa,
             então na prática ele nunca aparece; a condição fica porque uma
             terceira aba o traria de volta sozinha. */
          const divisor = i > 0 && !acesa && modo !== ABAS[i - 1].id

          return (
            <button
              key={aba.id}
              id={`aba-${aba.id}`}
              type="button"
              role="tab"
              aria-selected={acesa}
              aria-controls={PAINEL}
              tabIndex={acesa ? 0 : -1}
              onClick={() => setModo(aba.id)}
              /* **O raio vem para os filhos, e a cápsula NÃO recorta.** O anel
                 de foco é desenhado fora do botão (o `globals.css` explica por
                 que só de lá dá para mudar isso), e um `overflow: hidden` aqui
                 o cortava contra a borda da cápsula: quem navega por teclado
                 via meio anel. Sem o recorte, o arredondamento passa a ser
                 trabalho de cada aba — 7px, que é o raio de dentro dos 8px da
                 cápsula menos a borda de 1px. */
              className={`px-4 py-2 text-[13px] ${i === 0 ? 'rounded-l-[7px]' : 'rounded-r-[7px]'} ${divisor ? 'border-l border-[var(--line-forte)]' : ''} ${acesa ? 'shadow-[inset_0_0_0_1px_var(--acento)] text-[var(--acento)]' : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'}`}
            >
              {aba.rotulo}
            </button>
          )
        })}
      </div>

      {/* `method="post"` num formulário que só o JavaScript envia parece
          inútil, e é a diferença entre um erro e um vazamento.

          O envio normal passa por `handleSubmit`, que chama `preventDefault`
          e nada nativo acontece. Mas se o React não hidratar — chunk que
          falhou, JS bloqueado, rede que caiu no meio — o handler não existe e
          o navegador envia o formulário do jeito dele. Sem `method`, o padrão
          é GET: e-mail e SENHA viram parâmetros na barra de endereço, e vão
          parar no histórico do navegador e no cabeçalho `Referer`.

          Não é hipótese: aconteceu aqui, com um servidor velho servindo chunk
          morto, e a URL virou `/login?email=…&senha=…`.

          Com POST os campos vão no corpo. A rota não trata POST e o aluno vê
          uma falha — que é o certo quando o site está quebrado. Falhar à
          vista é melhor do que funcionar vazando. */}
      <form
        id={PAINEL}
        role="tabpanel"
        aria-labelledby={`aba-${modo}`}
        method="post"
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

        {/* O "Esqueci minha senha" vive na LINHA DO RÓTULO, e só no modo de
            entrar. Embaixo do botão ele competiria com o próprio botão de
            enviar, que é a ação que a tela quer; ao lado do campo, ele fica
            onde o problema aparece — a pessoa só descobre que esqueceu
            enquanto olha para este campo. E no modo de cadastro não faz
            sentido nenhum: ninguém esqueceu uma senha que ainda não escolheu.

            O `autoComplete` troca com o modo: 'current-password' ao entrar e
            'new-password' ao cadastrar é o que faz o cofre sugerir senha forte
            só na hora certa. */}
        <CampoSenha
          id="senha"
          autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
          placeholder="mínimo 6 caracteres"
          acao={
            modo === 'entrar' ? (
              <span className="text-[12px]">
                <LinkAcesso href="/recuperar">Esqueci minha senha</LinkAcesso>
              </span>
            ) : null
          }
        />

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
    </CartaoAcesso>
  )
}

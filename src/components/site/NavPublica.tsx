import Link from 'next/link'
import Marca from '@/components/Marca'
import { BotaoTema } from '@/components/BotaoTema'

/**
 * A barra do topo das páginas públicas.
 *
 * Saiu de dentro da landing porque não é dela: é a moldura do site aberto.
 * Quando `/faq`, `/sobre` ou `/termos` existirem, herdam esta barra pelo
 * layout de `(site)` em vez de recopiá-la — que é exatamente como o nome da
 * marca acabou escrito à mão em cinco arquivos antes da decisão 9h.
 *
 * A âncora de Matérias é `/#materias`, com a barra, e não `#materias`: esta
 * barra vive em mais de uma página desde que `/planos` existe, e âncora sem
 * caminho só funciona na página que tem a seção — nas outras ela não faz nada,
 * em silêncio.
 *
 * `/login` NÃO usa esta barra, e é de propósito: lá a tarefa é uma só, e um
 * menu com saídas para catálogo e planos convida a abandoná-la.
 */
export default function NavPublica() {
  return (
    <nav className="sticky top-0 z-50 bg-[var(--paper)]/90 backdrop-blur">
      <div className="max-w-[1120px] mx-auto px-8 h-[68px] flex items-center justify-between gap-6">
        <Link
          href="/"
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acento)]"
        >
          <Marca tamanho="landing" />
        </Link>
        <div className="hidden md:flex gap-8 text-sm text-[var(--ink-dim)] ml-auto">
          <Link href="/#materias" className="hover:text-[var(--ink)]">
            Matérias
          </Link>
          <Link href="/planos" className="hover:text-[var(--ink)]">
            Planos
          </Link>
        </div>
        <BotaoTema className="md:ml-0 ml-auto" />
        {/* `.botao .botao-primario` e nada mais: a classe já traz raio, peso,
            hover, `:active`, `:disabled` e anel de foco. A landing reescrevia
            tudo isso à mão em cada botão, com um tamanho de texto que não
            existia na escala. Sem `text-sm` por cima — o tamanho é o do
            sistema, senão a classe volta a ser decoração. */}
        <Link href="/login" className="botao botao-primario">
          Entrar
        </Link>
      </div>
    </nav>
  )
}

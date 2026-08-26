import Link from 'next/link'
import { BotaoTema } from '@/components/BotaoTema'
import Marca from '@/components/Marca'

/**
 * A moldura das três telas de acesso: `/login`, `/recuperar` e `/nova-senha`.
 *
 * ## Por que uma moldura, e não copiar
 *
 * As três são a mesma tela com um miolo diferente. Copiar marca, cartão e
 * botão de tema em cada uma é como o nome do site acabou escrito à mão em cinco
 * arquivos antes da decisão 9h — e aqui seria pior, porque um cartão que
 * desalinha entre `/login` e `/recuperar` faz o aluno achar que mudou de site
 * no meio de uma recuperação de senha.
 *
 * Não leva `'use client'`: não tem estado nenhum. Assim serve tanto a
 * `/nova-senha` (componente de servidor, que precisa conferir a sessão antes de
 * desenhar) quanto a `/login` e `/recuperar` (que são de cliente e a arrastam
 * para o pacote junto, sem prejuízo).
 *
 * ## O enquadramento
 *
 * O cartão fica no MEIO da tela. Antes ele era um bloco de 360px encostado à
 * esquerda com `px-24`, e numa tela larga isso deixava a página inteira vazia à
 * direita — o aluno lia como "carregou torto", não como escolha.
 *
 * Centralizar é o enquadramento, e não o alinhamento: dentro do cartão tudo
 * segue alinhado à esquerda, que é como o resto do site trata texto. Cartão
 * centralizado com miolo centralizado vira formulário de banco.
 *
 * `dvh` e não `vh`: no celular a barra do navegador entra e sai da tela, e
 * `100vh` é sempre a altura SEM ela — o cartão nascia empurrado para fora por
 * alguns pixels. E `place-items-center` com `py-12` em vez de centralização
 * pura porque `/nova-senha` é mais alta que `/login`: sem o respiro, numa tela
 * baixa o topo do cartão sairia por cima e não haveria como rolar até ele.
 *
 * ## As superfícies
 *
 * `--page` no fundo e `--paper` no cartão, que é a escada de elevação do
 * `docs/identidade-visual.md` (`--page → --paper → --raised`) usada na ordem
 * certa: o campo continua em `--raised` e, por estar um degrau acima do cartão,
 * volta a ler como "dá para digitar aqui". Se o cartão fosse `--raised`, os
 * campos sumiriam dentro dele.
 *
 * A elevação começa pelo anel de 1px (`--sombra`), como manda a mesma folha:
 * no tema escuro sombra sozinha não separa camada nenhuma.
 *
 * ## Nada de `focus-visible:outline-*` nestes arquivos
 *
 * O anel de foco vem da regra global do `globals.css`, que está fora de
 * `@layer` e por isso ganha de todo utilitário do Tailwind. Um
 * `focus-visible:outline-offset-4` aqui não faria nada e ninguém perceberia —
 * foi assim que a cápsula de abas do `/login` passou meses com um anel
 * recortado que o utilitário local dizia estar consertando.
 *
 * ## A marca leva para a landing
 *
 * É a única saída da tela, e é de propósito que seja só ela. O `(site)/layout`
 * mantém `/login` fora da barra pública porque uma barra com atalhos para
 * matérias e planos convida a abandonar o cadastro no meio — mas ficar SEM
 * saída nenhuma é o outro extremo, e quem chegou aqui por engano não tinha como
 * voltar a não ser pelo botão do navegador. Logo que leva ao início é a saída
 * que ninguém precisa aprender.
 */
export function CartaoAcesso({
  legenda,
  children,
  rodape,
}: {
  /** A linha sob a marca, que diz onde o aluno está. */
  legenda?: React.ReactNode
  children: React.ReactNode
  /** O que fica FORA do cartão, embaixo — a saída para a outra tela de acesso. */
  rodape?: React.ReactNode
}) {
  return (
    <main className="min-h-dvh grow grid place-items-center bg-[var(--page)] px-5 py-12">
      <BotaoTema className="fixed top-4 right-4" />

      <div className="w-full max-w-[380px]">
        <Link
          href="/"
          title="Ir para o início"
          className="inline-block rounded-[var(--raio-peq)] text-[var(--ink)]"
        >
          <Marca tamanho="grande" />
        </Link>

        {legenda ? (
          <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--ink-faint)]">{legenda}</p>
        ) : null}

        <div className="mt-6 rounded-[var(--raio)] bg-[var(--paper)] shadow-[var(--sombra)] p-5 sm:p-6">
          {children}
        </div>

        {rodape ? (
          <div className="mt-4 text-[13px] text-[var(--ink-dim)]">{rodape}</div>
        ) : null}
      </div>
    </main>
  )
}

/**
 * O link de texto das telas de acesso, num lugar só.
 *
 * Três telas apontam umas para as outras e o link precisa ler igual nas três —
 * sublinhado discreto, acento no hover, anel de foco. Escrito à mão em cada
 * uma, o primeiro ajuste já os faria divergir.
 */
export function LinkAcesso({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-sm text-[var(--acento)] underline decoration-[color-mix(in_srgb,var(--acento)_35%,transparent)] underline-offset-2 hover:decoration-[var(--acento-claro)] hover:text-[var(--acento-claro)]"
    >
      {children}
    </Link>
  )
}

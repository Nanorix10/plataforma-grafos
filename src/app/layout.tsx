import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono, Nunito } from "next/font/google";
import "./globals.css";

/**
 * As fontes vêm por `next/font` de propósito, e não por `@import` no CSS.
 * Com `@import`, o navegador precisa baixar o globals.css, descobrir o import,
 * ir até o Google e só então buscar o arquivo da fonte — três viagens em série
 * antes do primeiro texto aparecer, o que dói no 4G do aluno.
 * Aqui os arquivos são servidos pelo próprio domínio, com `display: swap`
 * (texto aparece na hora, na fonte de sistema, e troca quando a real chega).
 */
/**
 * Uma única fonte de interface. Antes eram duas — Fraunces (serifa) na marca
 * e nos títulos, Work Sans no resto. A serifa dava ao site um ar editorial
 * que competia com o conteúdo; a Inter some e deixa o texto do resumo falar.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--fonte-texto",
  display: "swap",
});

/**
 * `preload: false` nas duas fontes abaixo — e a razão vale pra qualquer fonte
 * que entrar aqui depois.
 *
 * As três famílias são declaradas neste layout, que embrulha o site inteiro,
 * então o Next emitia `<link rel="preload">` das TRÊS em toda página. A landing
 * puxava 105 KB de fonte com prioridade alta e usava 47 KB: a Nunito só aparece
 * dentro de `.conteudo-resumo` e a Plex Mono só no editor, mas as duas
 * competiam com o CSS e o JS críticos de quem nunca vai abrir um resumo.
 *
 * Sem preload elas continuam declaradas e são baixadas assim que um elemento
 * pede a família — só que aí é numa página que de fato usa a fonte.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fonte-mono",
  display: "swap",
  preload: false,
});

/**
 * Fonte do corpo do resumo — o texto que o aluno realmente lê por longos
 * períodos. Separada da fonte de interface de propósito: a interface pode
 * mudar de cara sem afetar a leitura, e vice-versa.
 */
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--fonte-resumo",
  display: "swap",
  preload: false, // ver a nota em plexMono
});

/**
 * O cartão que aparece quando alguém compartilha o link.
 *
 * Antes o site servia só `description`, e nenhuma tag Open Graph. Compartilhar
 * no WhatsApp entregava um link pelado — sem título, sem imagem, sem uma linha
 * dizendo o que era. Num produto vendido para estudante, onde a divulgação
 * acontece justamente em grupo de WhatsApp e story de Instagram, esse cartão é
 * a vitrine que a maioria vê ANTES de decidir se clica.
 *
 * A imagem sai de `src/app/opengraph-image.jpg` — o Next reconhece o nome
 * sozinho e emite as tags de tamanho e tipo junto, sem configuração.
 *
 * `metadataBase` é obrigatório para o Next transformar caminho relativo em URL
 * absoluta; sem ele o `og:image` sai relativo e nenhuma rede social resolve.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://plataforma-grafos.vercel.app"),
  title: "Plataforma Grafos — Preparação PASSE · PAS · UnB",
  description: "Resumos interligados para PASSE, PAS UEM e PAS UnB.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Plataforma Grafos",
    title: "Plataforma Grafos — Preparação PASSE · PAS · UnB",
    /* Mais longa que a `description` de propósito: aqui há espaço para dizer o
       diferencial, e o cartão é lido por quem ainda não sabe o que é o site. */
    description:
      "Resumos interligados por matéria e por processo seletivo, lidos no próprio site. PASSE UFMS, PAS UEM e PAS UnB.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plataforma Grafos — Preparação PASSE · PAS · UnB",
    description:
      "Resumos interligados por matéria e por processo seletivo, lidos no próprio site.",
  },
};

export const viewport: Viewport = {
  // Uma cor de barra do navegador para cada tema, casando com `--paper`.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFAF6" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1822" },
  ],
  colorScheme: "light dark",
};

/**
 * Aplica o tema salvo ANTES da primeira pintura.
 *
 * Roda como script síncrono no `<head>`: se esperasse o React hidratar, quem
 * escolheu claro veria o site escuro por uma fração de segundo a cada
 * navegação — o clarão que todo site com tema salvo erra.
 *
 * Sem nada salvo, não escreve atributo nenhum e o `color-scheme: light dark`
 * do CSS deixa o aparelho decidir. O `try/catch` cobre navegador com
 * localStorage bloqueado (aba anônima restrita), onde o pior caso é cair na
 * preferência do sistema.
 */
const scriptDeTema = `try{var t=localStorage.getItem('tema');if(t==='claro'||t==='escuro')document.documentElement.dataset.tema=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${inter.variable} ${plexMono.variable} ${nunito.variable}`}
      // o script abaixo escreve `data-tema` antes do React assumir; sem isto o
      // React reclamaria de um atributo que não estava no HTML do servidor
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptDeTema }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

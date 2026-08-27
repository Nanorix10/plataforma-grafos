import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
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
 * Uma única fonte de interface, e ela é a que aparece em mais lugar do site:
 * menu, botões, cartões, barra lateral, rótulo de nó do mapa.
 *
 * Era a Inter até 27/08, e antes dela eram duas — Fraunces (serifa) na marca e
 * nos títulos, Work Sans no resto. A Inter entrou para SUMIR do caminho, e
 * sumiu bem demais: a landing precisou da Gabarito depois justamente porque
 * não sobrava personalidade nenhuma para o `h1` da primeira dobra.
 *
 * A Bricolage Grotesque é o contrário disso — uma grotesca deliberadamente
 * irregular. Duas consequências que quem for mexer precisa saber:
 *
 * 1. **Ela contrasta com a Plus Jakarta do corpo do resumo, e é para isso.**
 *    Duas humanistas geométricas lado a lado leem como erro, não como par: o
 *    corpo é redondo e aberto, a interface é irregular e seca.
 * 2. **Ela desce a 11px no rótulo do mapa**, que é o texto mais miúdo e mais
 *    repetido do site — são 232 resumos num canvas onde texto encosta em texto.
 *    A largura média por caractere dela entra na conta da colisão elíptica
 *    (`meiaLarguraDoRotulo`, em `mapa/GraphView.tsx`); trocar a família de novo
 *    obriga a remedir aquela constante.
 *
 * A esta única fonte o `preload` fica LIGADO (padrão), porque ela pinta texto
 * em toda rota — é a única das quatro em que isso se justifica.
 */
const bricolage = Bricolage_Grotesque({
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
 * puxava 105 KB de fonte com prioridade alta e usava 47 KB: a fonte do resumo só aparece
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
 *
 * Era a Nunito até 27/08. A troca não é de gosto solto: a Nunito é arredondada
 * e dava ao corpo do resumo um ar juvenil que competia com o que o texto está
 * dizendo. A Plus Jakarta Sans é humanista com desenho próprio no `a`, no `g`
 * e no `t`, e continua sendo texto de estudo.
 *
 * **Ela TEM de ser variável, e isso não é preferência.** A decisão 12 apoia a
 * hierarquia inteira do resumo na distância entre o peso 800 (que marca o nó do
 * mapa) e o 500 (que marca o termo). Numa fonte de dois pesos o navegador
 * improvisaria os dois engrossando o traço, a distância fecharia e o resumo
 * voltaria a ser um borrão de negrito. O eixo da Plus Jakarta vai de 200 a 800,
 * então os dois extremos são desenhos de verdade — como eram na Nunito.
 * Quem for trocar de novo: confira o eixo ANTES.
 */
const jakarta = Plus_Jakarta_Sans({
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
      className={`h-full antialiased ${bricolage.variable} ${plexMono.variable} ${jakarta.variable}`}
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

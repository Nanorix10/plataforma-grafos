import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono, Nunito } from "next/font/google";
import "./globals.css";

/**
 * As fontes vêm por `next/font` de propósito, e não por `@import` no CSS.
 * Com `@import`, o navegador precisa baixar o globals.css, descobrir o import,
 * ir até o Google e só então buscar o arquivo da fonte — três viagens em série
 * antes do primeiro texto aparecer, o que dói no 4G do aluno.
 * Aqui os arquivos são servidos pelo próprio domínio, com `display: swap`
 * (texto aparece na hora, na fonte de sistema, e troca quando a real chega).
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--fonte-titulo",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--fonte-texto",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fonte-mono",
  display: "swap",
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
});

export const metadata: Metadata = {
  title: "Plataforma Grafos — Preparação PASSE · PAS · UnB",
  description: "Resumos interligados para PASSE, PAS UEM e PAS UnB.",
};

export const viewport: Viewport = {
  themeColor: "#FDFCFA",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${fraunces.variable} ${workSans.variable} ${plexMono.variable} ${nunito.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

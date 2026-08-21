import { Gabarito } from 'next/font/google'
import NavPublica from '@/components/site/NavPublica'
import Rodape from '@/components/site/Rodape'

/**
 * A quarta família, e ela vive SÓ aqui — este é o ponto todo.
 *
 * A decisão 7 tirou a Fraunces porque uma serifa puxava o site pra "revista"
 * quando o pedido é material de estudo, e deixou três famílias com papéis que
 * não se cruzam. A Gabarito não desfaz isso: ela não é serifa, não entra na
 * interface e não encosta no corpo do resumo. Faz um papel que não existia —
 * o título da cara pública, que é onde a página tem três segundos para não
 * parecer um template de ed-tech.
 *
 * **O nome não é coincidência aproveitada, é o motivo.** Gabarito é o objeto
 * mais reconhecível de quem presta vestibular, e é o mundo do assunto que
 * escolheu a fonte. Uma display genérica faria o mesmo trabalho tipográfico e
 * não diria nada.
 *
 * **Por que declarada aqui e não no `layout.tsx` da raiz.** Lá as variáveis são
 * postas no `<html>`, e o `next/font` passaria a emitir o `preload` dela em
 * TODA rota — inclusive as do `(app)`, que nunca a usam. É exatamente o
 * desperdício que o `preload: false` da decisão 7 veio cortar. Declarada no
 * grupo `(site)`, ela é pré-carregada onde de fato aparece, e nem é baixada
 * por quem está lendo resumo.
 *
 * Por isso também o `preload` fica LIGADO (o padrão): aqui ela pinta o `h1` da
 * primeira dobra. Sem preload o visitante veria o título trocar de desenho
 * depois da primeira pintura, que é pior do que a requisição.
 *
 * `subsets: ['latin']` acompanha a Inter. O `latin` cobre os acentos do
 * português; `latin-ext` é para o leste europeu e só engordaria o arquivo.
 */
const gabarito = Gabarito({
  subsets: ['latin'],
  variable: '--fonte-display',
  display: 'swap',
})

/**
 * A moldura das páginas PÚBLICAS.
 *
 * `(site)` é route group, igual a `(app)` — os parênteses não aparecem na URL,
 * então a landing continua em `/`. A diferença entre os dois grupos é o que
 * cada um garante: `(app)` exige login e monta a barra lateral; `(site)` não
 * exige nada e monta a barra pública com o rodapé.
 *
 * Existe para o dia em que a segunda página pública nascer. Hoje a landing é a
 * única, e barra e rodapé viviam dentro dela — então `/faq` ou `/termos`
 * chegariam copiando os dois, que é como o nome da marca acabou escrito à mão
 * em cinco arquivos antes da decisão 9h. Agora chegam sabendo só do próprio
 * conteúdo.
 *
 * **`/login` fica de fora, e é decisão, não esquecimento.** Ela é tela de
 * tarefa única; uma barra com saídas para matérias e planos ali convida a
 * abandonar o cadastro no meio.
 *
 * O `main` e o alvo "Pular para o conteúdo" moram aqui e não em cada página:
 * é o link que a tecla Tab encontra primeiro, e ele não pode depender de cada
 * página nova lembrar de o repetir.
 *
 * A `div` de fora existe para carregar as duas classes da fonte, e nada mais:
 * `display: contents` faz o navegador ignorar a caixa dela na hora de montar o
 * layout, então barra, `main` e rodapé continuam filhos diretos do `body` para
 * todo efeito visual. Variável de CSS herda através dela normalmente.
 */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className={`${gabarito.variable} titulo-display contents`}>
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <NavPublica />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <Rodape />
    </div>
  )
}

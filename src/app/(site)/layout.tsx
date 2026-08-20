import NavPublica from '@/components/site/NavPublica'
import Rodape from '@/components/site/Rodape'

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
 */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <NavPublica />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <Rodape />
    </>
  )
}

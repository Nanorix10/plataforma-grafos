import GrafoInterativo from './GrafoInterativo'

/**
 * "Como é por dentro" — a seção que dá sentido ao nome da empresa.
 *
 * É a resposta ao problema mais concreto da landing antiga: ela afirmava que
 * os resumos eram "interligados entre si" e não mostrava um único link. Quem
 * chega não sabe o que é um grafo, e a palavra na marca ficava sem lastro.
 *
 * Por isso a seção é uma demonstração, não uma lista de benefícios com
 * ícones. O visitante toca num assunto e vê as ligações dele — e sai daqui
 * sabendo ler o `/mapa` antes de ter acesso a ele.
 */
export default function ComoFunciona() {
  return (
    <section
      id="por-dentro"
      className="py-[var(--ritmo-secao)] max-w-[1120px] mx-auto px-8"
    >
      <div className="max-w-[560px] mb-11">
        <div className="rotulo-secao mb-3">Por dentro</div>
        <h2 className="text-[length:var(--t-titulo)] font-medium mb-3">
          Não é uma pilha de PDF. É um mapa.
        </h2>
        <p className="text-sm text-[var(--ink-dim)] leading-relaxed">
          Resumo solto obriga você a lembrar sozinho onde um assunto encosta no
          outro. Aqui essa ligação já está escrita, e é ela que você navega.
        </p>
      </div>
      <GrafoInterativo />
    </section>
  )
}

import Grafo from '@/components/marca/Grafo'

/**
 * A primeira dobra.
 *
 * **O cartão-resposta saiu daqui, e a decisão vale registrar.** Ele ocupava
 * metade da largura com seis linhas de bolhas e não dizia nada: quem chegava
 * não entendia o que era, e nem parava para tentar. Foi levado ao acervo para
 * ver se ali ganhava sentido — uma bolha por prova, dizendo em qual vestibular
 * cada matéria cai — e perdeu para a variante que mostra os assuntos. Não
 * sobrou lugar no site onde ele diga algo verdadeiro.
 *
 * Com ele fora, o hero fica com uma coisa só: o texto sobre o grafo. O grafo é
 * o motivo que se sustenta sozinho — é o nome da empresa E a estrutura de
 * dados do produto —, e com a coluna inteira ele finalmente tem espaço para
 * ser lido como desenho em vez de ficar espremido atrás de metade da tela.
 *
 * Uma dobra, uma ideia.
 */
export default function Hero() {
  return (
    /* `relative` + `overflow-hidden` seguram o grafo: ele é maior que o hero
       de propósito (a textura precisa sangrar para não parecer um quadro
       pendurado), e sem o corte ele criaria barra de rolagem horizontal. */
    <header className="relative overflow-hidden">
      {/* A mesma superfície do `/mapa`: `.quadro` é o fundo quadriculado que o
          mapa do produto já usa. A landing pisa no mesmo chão que a
          ferramenta — consistência de marca que não custou token novo. */}
      <div aria-hidden="true" className="quadro absolute inset-0">
        <Grafo className="absolute inset-0 w-full h-full opacity-[0.38]" />
        {/* Esmaecimento até `--page` na base. Sem ele o grafo encosta na faixa
            da seção seguinte com uma borda dura, e o que era textura vira um
            bloco recortado. */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--page)]" />
      </div>

      <div className="relative max-w-[1120px] mx-auto px-8 pt-[var(--ritmo-secao)] pb-[var(--ritmo-secao)]">
        {/* A coluna de texto continua estreita mesmo sem o painel ao lado: a
            linha de leitura é o que decide a largura, não o espaço disponível.
            Esticar o parágrafo até 1120px passaria de 150 caracteres por linha
            e o olho perderia o começo da linha seguinte. */}
        <div className="max-w-[640px]">
          <div className="rotulo-secao mb-4 text-[var(--acento-claro)]">
            Preparação PASSE · PAS-UEM · PAS-UnB
          </div>
          <h1 className="text-[length:var(--t-hero)] leading-[1.1] font-medium tracking-[-0.02em] mb-5">
            {/* Presente, e não passado, de propósito: o PASSE é seriado, então
                liderar hoje não é ter vencido. "Está em" diz a verdade sozinho
                e dispensa asterisco; "tirou" afirmaria um resultado final que
                ainda não existe. A prova da frase está logo abaixo, na seção do
                autor — afirmação de primeiro lugar sem a colocação escrita ao
                lado é a única forma de ela enfraquecer em vez de vender. */}
            Os resumos de quem está em 1º lugar em medicina no PASSE.
          </h1>
          <p className="text-base leading-relaxed text-[var(--ink-dim)] max-w-[52ch] mb-8">
            Resumos organizados por matéria e por processo seletivo, interligados
            entre si — lidos no próprio site, sem baixar nada e sempre na versão
            mais recente.
          </p>
          <div className="flex items-center gap-5 flex-wrap">
            <a href="#planos" className="botao botao-primario">
              Ver planos de acesso
            </a>
            <a
              href="#materias"
              /* `py-2` pelo alvo de toque, não pelo desenho: sem ele o link
                 media 162x20 no celular, abaixo do mínimo de 24px da WCAG 2.2
                 (critério 2.5.8). O botão ao lado tem 44px de altura, então o
                 padding também alinha os dois pelo meio. */
              className="py-2 text-sm underline underline-offset-[3px] decoration-[var(--ink-faint)] hover:decoration-[var(--ink)]"
            >
              Ver matérias disponíveis
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

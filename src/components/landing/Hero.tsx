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
 *
 * ---
 *
 * **O peso é a informação, e é por isso que a frase tem dois.** A afirmação
 * inteira estava em 500, um peso só, e um peso só não tem hierarquia: o olho
 * chegava em "Os resumos de quem está em" com a mesma força de "1º lugar em
 * medicina", que é a única parte que outro cursinho não consegue escrever. Com
 * 400 na moldura e 900 no fato, a frase se lê em dois tempos — primeiro o que
 * é, depois de quem é.
 *
 * **900, e não 700, porque 700 não chegou.** Medido na tela, e não no olho: a
 * Gabarito já tem 400 encorpado, e sobre fundo escuro o texto claro "vaza" e
 * parece mais grosso do que é (é a mesma observação que mantém os títulos da
 * interface em 500). Os dois pesos ficavam a uma distância que o olho não
 * separava, e a hierarquia que a frase precisa não acontecia.
 *
 * **O `md:whitespace-nowrap` é o que salva o destaque.** Sem ele a frase
 * quebrava entre "1º lugar em" e "medicina", e um destaque partido em duas
 * linhas deixa de ser destaque. Só a partir de `md`: numa tela de 390px a
 * frase inteira numa linha só estouraria a largura.
 *
 * **"está em" fica no peso leve de propósito.** Ele é o verbo que mantém a
 * afirmação no presente (o PASSE é seriado, então liderar hoje não é ter
 * vencido); engordá-lo junto do resto empurraria a frase para "foi primeiro
 * lugar", que é o que ela cuidadosamente não diz. A prova continua logo
 * abaixo, na seção do autor.
 *
 * **A textura recuou para a direita.** Com o `h1` a 72px o grafo a 38% passava
 * por trás das letras e sujava a contraforma — a regra 2 do `Grafo.tsx` (baixo
 * contraste) vale ainda mais quando o texto por cima cresce. A máscara abre um
 * campo limpo na coluna de leitura e deixa o desenho inteiro do lado para onde
 * o olho vai depois de ler. Continua sendo textura atrás do conteúdo, que é a
 * regra 1 daquele arquivo.
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
        {/* A máscara é `style` e não classe utilitária porque precisa do par
            com prefixo: o Safari ainda pede `-webkit-mask-image`, e sem ele a
            textura volta a passar por baixo do texto justamente no navegador
            de metade dos celulares. */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 42%, #000 82%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 42%, #000 82%)',
          }}
        >
          <Grafo className="absolute inset-0 w-full h-full opacity-[0.34]" />
        </div>
        {/* Esmaecimento até `--page` na base. Sem ele o grafo encosta na faixa
            da seção seguinte com uma borda dura, e o que era textura vira um
            bloco recortado. */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--page)]" />
      </div>

      <div className="relative max-w-[1120px] mx-auto px-8 pt-[var(--ritmo-secao)] pb-[var(--ritmo-secao)]">
        {/* A coluna de texto continua estreita mesmo sem o painel ao lado: a
            linha de leitura é o que decide a largura, não o espaço disponível.
            Esticar o parágrafo até 1120px passaria de 150 caracteres por linha
            e o olho perderia o começo da linha seguinte.

            Subiu de 640 para 720 junto com o `h1`: a 72px, 640px quebrava a
            afirmação em cinco linhas curtas e ela deixava de ler como frase. */}
        <div className="max-w-[720px]">
          <div className="rotulo-secao mb-5 text-[var(--acento-claro)]">
            Preparação PASSE · PAS-UEM · PAS-UnB
          </div>
          <h1 className="text-[length:var(--t-hero)] leading-[1.03] font-normal mb-6 text-balance">
            {/* Presente, e não passado, de propósito: o PASSE é seriado, então
                liderar hoje não é ter vencido. "Está em" diz a verdade sozinho
                e dispensa asterisco; "tirou" afirmaria um resultado final que
                ainda não existe. */}
            Os resumos de quem está em{' '}
            <strong className="font-black md:whitespace-nowrap">
              1º lugar em medicina
            </strong>{' '}
            no PASSE.
          </h1>
          <p className="text-base leading-relaxed text-[var(--ink-dim)] max-w-[52ch] mb-9">
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

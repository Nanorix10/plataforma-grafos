/**
 * A primeira dobra — **campo escuro, lockup, declaração em caixa baixa**.
 *
 * Substituiu a `Hero` da direção B (o mapa tocável na dobra) em 31/08, quando
 * o Leandro escolheu a linguagem visual da Instituto Futuros. A troca é grande
 * e vale registrar o que ela ganha e o que ela paga:
 *
 * - **Ganha uma primeira tela que não parece template.** A dobra anterior
 *   pedia que o visitante entendesse um grafo em três segundos, e a evidência
 *   de que isso não é óbvio é do próprio site: a pergunta sobre o que é esse
 *   negócio de grafo está cadastrada no FAQ.
 * - **Paga a demonstração.** O `GrafoInterativo` saiu da dobra. Ele continua
 *   no repositório e não é mais referenciado por ninguém — se a decisão se
 *   confirmar, ele deve ser apagado; enquanto isso, fica.
 *
 * **O campo é escuro nos DOIS temas**, e é por isso que todo texto aqui sai
 * dos tokens `--dobra-*` em vez de `--ink`. No tema claro `--ink` é quase
 * preto e sumiria sobre o azul-marinho. Ver o comentário dos tokens em
 * `globals.css`.
 */

/**
 * O lockup grande, com as espessuras do ARQUIVO, sem compensação.
 *
 * Isto é o oposto do que o `Marca.tsx` faz, e de propósito: lá o `traco()`
 * eleva cada espessura a um piso em pixels porque a marca vive a 26–34px, onde
 * o traço do arquivo viraria véu. Aqui ela vive a ~116px, onde uma unidade do
 * quadro de 310 vale 0,37px — o contorno de 2,6 sai com ~1px e os raios com
 * 1,9/1,5/1px. **É o único lugar da interface onde o desenho manda**, e onde o
 * halo e o contorno dos nós, que a marca pequena descarta, fazem sentido.
 *
 * As cores são cravadas e claras porque o fundo é fixo e escuro. Usar
 * `--acento` aqui deixaria o símbolo roxo-escuro sobre azul-marinho no tema
 * claro — o mesmo erro que os tokens `--dobra-*` existem para evitar.
 */
function LockupGrande() {
  return (
    <svg
      viewBox="195 195 310 310"
      role="img"
      aria-label="Plataforma Grafos"
      className="w-[74px] sm:w-[92px] lg:w-[116px] h-auto shrink-0"
    >
      <circle cx="350" cy="350" r="38" fill="#C9C3FA" opacity="0.14" />
      <g fill="none" stroke="#C9C3FA" strokeOpacity="0.65" strokeWidth="2.6" strokeLinecap="round">
        <path d="M350,236 L443.5,294" />
        <path d="M443.5,294 L443.5,406" />
        <path d="M443.5,406 L350,464" />
        <path d="M350,464 L256.5,406" />
        <path d="M256.5,406 L256.5,294" />
        <path d="M256.5,294 L350,236" />
      </g>
      <g stroke="#C9C3FA" strokeLinecap="round" fill="none">
        <path d="M350,350 L350,236" strokeWidth="5" />
        <path d="M350,350 L443.5,294" strokeWidth="4" strokeDasharray="11 7" />
        <path d="M350,350 L443.5,406" strokeWidth="2.6" strokeDasharray="1.5 7" />
        <path d="M350,350 L350,464" strokeWidth="5" />
        <path d="M350,350 L256.5,406" strokeWidth="4" strokeDasharray="11 7" />
        <path d="M350,350 L256.5,294" strokeWidth="2.6" strokeDasharray="1.5 7" />
      </g>
      {/* O contorno dos nós é a cor do CAMPO, não o branco do arquivo: sobre o
          azul-marinho o branco virava um segundo anel que competia com o
          hexágono e apagava a diferença entre as seis cores. */}
      <g stroke="#1B1F45" strokeWidth="3">
        <circle cx="350" cy="236" r="25" fill="#E08088" />
        <circle cx="443.5" cy="294" r="25" fill="#7FA8CF" />
        <circle cx="443.5" cy="406" r="25" fill="#8FAE94" />
        <circle cx="350" cy="464" r="25" fill="#C576A6" />
        <circle cx="256.5" cy="406" r="25" fill="#C98663" />
        <circle cx="256.5" cy="294" r="25" fill="#8FA0C8" />
      </g>
      <circle cx="350" cy="350" r="24" fill="#C9C3FA" stroke="#1B1F45" strokeWidth="3" />
    </svg>
  )
}

/**
 * A textura de grafo do fundo.
 *
 * **Desenho fixo, escrito à mão, e sem d3** — as duas regras que o
 * `marca/Grafo.tsx` já seguia. Layout sorteado mudaria de forma a cada
 * carregamento, e marca que muda de forma não é marca; e a landing é a página
 * que todo visitante baixa, então a decisão 10 vale mais aqui do que no
 * `/mapa`.
 *
 * As duas espécies de linha são as mesmas do produto: cheia é `pai_id`
 * (contém), tracejada é `conexoes` (cita). Quem aprender a ler uma delas aqui
 * não precisa reaprender lá dentro.
 */
function TexturaDeGrafo() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="#C7C8F0" strokeOpacity="0.34" strokeWidth="1.1" strokeLinecap="round">
        <path d="M1080,250 L900,180" />
        <path d="M1080,250 L1230,190" />
        <path d="M1080,250 L1200,400" />
        <path d="M1080,250 L950,410" />
        <path d="M1080,250 L1290,330" />
        <path d="M900,180 L780,110" />
        <path d="M950,410 L860,540" />
        <path d="M1200,400 L1310,520" />
        <path d="M950,410 L1090,560" />
        <path d="M1090,560 L1230,650" />
        <path d="M860,540 L930,690" />
        <path d="M1310,520 L1380,660" />
      </g>
      <g
        fill="none"
        stroke="#D2CEFD"
        strokeOpacity="0.45"
        strokeWidth="1.1"
        strokeDasharray="8 8"
        strokeLinecap="round"
      >
        <path d="M900,180 Q1020,330 1200,400" />
        <path d="M860,540 Q1100,470 1290,330" />
        <path d="M780,110 Q1010,240 1230,190" />
      </g>
      <g>
        <circle cx="1080" cy="250" r="15" fill="#D2CEFD" fillOpacity="0.95" />
        <circle cx="900" cy="180" r="8.5" fill="#E08088" fillOpacity="0.9" />
        <circle cx="1230" cy="190" r="8.5" fill="#7FA8CF" fillOpacity="0.9" />
        <circle cx="1200" cy="400" r="8.5" fill="#8FAE94" fillOpacity="0.9" />
        <circle cx="950" cy="410" r="8.5" fill="#C576A6" fillOpacity="0.9" />
        <circle cx="1290" cy="330" r="8.5" fill="#C98663" fillOpacity="0.9" />
        <circle cx="780" cy="110" r="6" fill="#C7C8F0" fillOpacity="0.75" />
        <circle cx="860" cy="540" r="6" fill="#B57CB3" fillOpacity="0.85" />
        <circle cx="1310" cy="520" r="6" fill="#4FB3B8" fillOpacity="0.85" />
        <circle cx="1090" cy="560" r="6" fill="#C7C8F0" fillOpacity="0.7" />
        <circle cx="1230" cy="650" r="5" fill="#9B8CD1" fillOpacity="0.8" />
        <circle cx="930" cy="690" r="5" fill="#85B0BE" fillOpacity="0.8" />
        <circle cx="1380" cy="660" r="5" fill="#C7C8F0" fillOpacity="0.6" />
      </g>
    </svg>
  )
}

/** A seta circular da chamada, igual à da referência. */
export function Seta() {
  return (
    <span className="seta w-[58px] h-[58px] rounded-full grid place-items-center shrink-0">
      <svg viewBox="0 0 26 10" className="w-[26px] h-[10px] block" aria-hidden="true">
        <path
          d="M0,5 L24,5 M19,1 L24,5 L19,9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/**
 * O véu que costura a dobra escura ao papel.
 *
 * Ele termina em `--page`, que troca com o tema — é o que faz o campo
 * azul-marinho encontrar o creme no claro e o marrom-escuro no escuro sem
 * emenda visível. Vai em `style` e não em classe porque é um degradê com três
 * paradas, que não tem utilitário correspondente.
 */
const VEU =
  'linear-gradient(to top, var(--page) 2%, rgba(20,18,13,0.35) 42%, rgba(20,18,13,0.1) 100%)'

export default function Dobra() {
  return (
    <header className="dobra relative overflow-hidden min-h-[86svh] flex items-center">
      <TexturaDeGrafo />
      <div className="absolute inset-0 pointer-events-none" style={{ background: VEU }} />

      <div className="relative z-[2] w-full max-w-[1240px] mx-auto px-6 sm:px-10 py-[clamp(4rem,12vh,8rem)]">
        <div className="reveal flex items-center gap-4 lg:gap-7 mb-[clamp(2.5rem,5vw,3.5rem)]">
          <LockupGrande />
          <span className="border-l border-[rgba(199,200,240,0.34)] pl-4 lg:pl-7">
            <b className="font-normal text-[clamp(1.05rem,2vw,1.5rem)] leading-tight tracking-[0.16em] uppercase text-[var(--dobra-ink)]">
              Plataforma Grafos
            </b>
          </span>
        </div>

        <p className="rotulo reveal mb-8">
          PASSE&nbsp;UFMS &nbsp;·&nbsp; PAS&nbsp;UEM &nbsp;·&nbsp; PAS&nbsp;UnB
        </p>

        <h1
          className="declaracao reveal text-[clamp(2.25rem,5.4vw,3.44rem)] max-w-[17ch] mb-8"
          data-atraso="1"
        >
          e se cada assunto soubesse <em>onde ele se encaixa?</em>
        </h1>

        <p className="corpo-dobra reveal max-w-[52ch] leading-relaxed" data-atraso="2">
          resumos que se ligam uns aos outros e formam um mapa navegável. escritos por quem presta
          as mesmas provas que você.
        </p>

        <a
          href="#portas"
          className="chamada reveal inline-flex items-center gap-6 mt-14 no-underline"
          data-atraso="3"
        >
          <span className="rotulo">comece por onde faz sentido</span>
          <Seta />
        </a>
      </div>
    </header>
  )
}

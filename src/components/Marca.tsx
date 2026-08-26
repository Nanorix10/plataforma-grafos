/**
 * A marca do site, num lugar só.
 *
 * Antes o nome "Plataforma Grafos" estava escrito à mão em cinco arquivos — na
 * landing (topo e rodapé), no login e nas duas versões da barra lateral. Trocar
 * a marca significava caçar os cinco e acertar o tamanho de cada um.
 *
 * ============================================================
 * A LOGO, DESDE 26/08
 * ============================================================
 * O `Simbolo` esperou por um desenho do autor desde agosto, com o encaixe
 * documentado e `return null` no meio — porque logo genérica de encher espaço
 * é pior do que nenhuma, já que pareceria decidida. O desenho chegou.
 *
 * **Os originais estão versionados em `docs/marca/`**, no par claro/escuro que
 * o autor exportou. Eles são a fonte; o que está aqui embaixo é a adaptação, e
 * ela mudou três coisas — cada uma por uma regra que já valia no projeto:
 *
 * 1. **Só o badge entrou.** Os arquivos são o lockup inteiro, com o nome como
 *    `<text>`. O nome já é escrito aqui embaixo em HTML de verdade, então viria
 *    duplicado — e o `<text>` pede a fonte **Gabarito**, que o site não carrega
 *    (decisão 7): cairia para a Inter em quase toda máquina, sem avisar.
 *    Símbolo + texto HTML é o lockup, montado.
 * 2. **O par de arquivos virou um componente só.** A única diferença entre
 *    claro e escuro é o acento (`#5B4BC4` / `#8F86D9`) e a opacidade do anel.
 *    As duas coisas são o que `light-dark()` resolve sozinho (decisão 4b), e
 *    viraram `--acento` e `--marca-anel`.
 * 3. **As cores das matérias ficaram cravadas**, porque é o que elas são: cor
 *    de matéria, não token de interface. Ver a nota no `NOS_DA_MARCA`.
 *
 * Se um dia a logo mudar, o caminho é: trocar os arquivos de `docs/marca/` e
 * refazer a adaptação aqui — não editar um sem o outro.
 *
 * ============================================================
 * E O ÍCONE DA ABA (favicon)
 * ============================================================
 * É outro arquivo, e não passa por aqui: `src/app/icon.svg`, que o Next
 * reconhece pelo nome e serve sozinho. (O `favicon.ico` do template do Next
 * saiu quando ele entrou.)
 *
 * Desde 26/08 ele desenha a **redução** desta marca: o mesmo hexágono, sem o
 * anel externo e com os seis raios sólidos. Não é preguiça de copiar — a 16px
 * o anel sairia com 0,23px e o ponto do pontilhado com 0,14px, e três padrões
 * de traço nesse tamanho leem como sujeira, não como três espécies. O que fica
 * é o que reconhece: o hexágono, as seis cores e o acento no meio. O arquivo
 * explica cada corte.
 *
 * As regras do favicon são outras: 16 a 32px de lado, forma cheia, uma cor
 * cravada e nada de `currentColor` — na aba não existe texto do qual herdar.
 * Por isso o acento lá é o meio-caminho `#766ACE`, e não o token.
 */
/**
 * Os seis nós do hexágono, na ordem do desenho do autor e nas cores das
 * matérias. Ficam cravados de propósito: são as cores DAS MATÉRIAS, não tokens
 * de interface, e o autor as manteve idênticas nos dois temas — o arquivo
 * claro e o escuro trazem estes mesmos seis valores.
 *
 * Vale a nota de quem for mexer: estes hexes são as variantes CLARAS do
 * `lib/materias.ts`, e lá cada matéria é um par `light-dark()` cuja metade
 * escura é mais clara (decisão 4c). A diferença é deliberada aqui — círculo
 * cheio de 11 unidades não é texto de 12px, e a régua de contraste que obrigou
 * a clarear os títulos não se aplica a uma bolinha. Se um dia a marca parecer
 * apagada no tema escuro, é este comentário que explica onde mexer.
 */
const NOS_DA_MARCA: [number, number, string][] = [
  [100.0, 45.0, '#C2334D'], // Língua Portuguesa
  [147.6, 72.5, '#1F5F9E'], // Matemática
  [147.6, 127.5, '#3F7848'], // Biologia
  [100.0, 155.0, '#9E2E70'], // Química
  [52.4, 127.5, '#A65224'], // Geografia
  [52.4, 72.5, '#4A5C8C'], // Filosofia
]

/**
 * Os seis raios que saem do centro, em três espessuras e três traçados.
 *
 * **Isto não é ornamento: são as três espécies de aresta do produto.** Sólida é
 * `pai_id` (contém), tracejada é `conexoes` (cita), pontilhada é o relacionado.
 * A marca desenha o modelo de dados — é a mesma tese do `marca/Grafo.tsx`, de
 * que a identidade cresce do que o produto é em vez de ser somada por cima.
 */
const RAIOS: [number, number, number, 'solido' | 'tracejado' | 'pontilhado'][] = [
  [100, 45, 4, 'solido'],
  [147.6, 72.5, 3.2, 'tracejado'],
  [147.6, 127.5, 2.4, 'pontilhado'],
  [100, 155, 4, 'solido'],
  [52.4, 127.5, 3.2, 'tracejado'],
  [52.4, 72.5, 2.4, 'pontilhado'],
]

/**
 * Espessura de traço corrigida para o tamanho em que o símbolo vai ser
 * desenhado. **É o que faz a marca sobreviver ao cabeçalho.**
 *
 * O desenho vive num quadro de 140 unidades, então a 28px cada unidade vale
 * 0,2px: o anel de 2 unidades sai com 0,4px e o ponto do raio pontilhado com
 * 0,24px. Sub-pixel vira véu, não traço — e as três espécies de aresta, que são
 * a ideia inteira da marca, somem. Aumentar o símbolo não resolve isso sozinho:
 * para o anel chegar a 1px o símbolo precisaria de **70px**, que não é tamanho
 * de cabeçalho.
 *
 * Então o traço engrossa quando o quadro encolhe. Não é invenção: é o que o
 * material de marca do próprio autor prescreve ao dizer que o arquivo de 16–32px
 * "tem traço reforçado e não empasta". A GEOMETRIA não muda — nós, posições e
 * proporções entre as três espessuras seguem as do arquivo original.
 *
 * `alvoPx` é a espessura mínima desejada em pixels. Acima de ~70px a conta se
 * desliga sozinha (o `max` devolve o valor original) e o desenho volta a ser
 * exatamente o exportado.
 */
function traco(lado: number, unidadesOriginais: number, alvoPx: number) {
  const unidadesPorPixel = 140 / lado
  return Math.max(unidadesOriginais, unidadesPorPixel * alvoPx)
}

/**
 * Os alvos em pixels, conferidos OLHANDO — rasterizando o símbolo a 28px e
 * ampliando, não estimando.
 *
 * A primeira tentativa mirou mais alto (1,6px no raio sólido) e ficou pior que
 * o problema: o sólido virou uma barra vertical atravessando o centro, e o
 * traçado esticou tanto que o primeiro risco cobria 60% do raio e o resto
 * sumia — os raios tracejados viravam tocos que não chegavam nos nós.
 *
 * Estes valores foram escolhidos contra três alternativas renderizadas lado a
 * lado: raios uniformes (legível, mas perde a hierarquia de peso, que é parte
 * do desenho) e sem raios nenhum (limpo, mas vira um anel de pontos e perde o
 * eixo, que é a ideia). Estes mantêm as três espessuras E os três traçados
 * distinguíveis, sem nenhum dominar.
 */
const ALVO_PX = {
  anel: 1.0,
  solido: 1.1,
  tracejado: 0.9,
  pontilhado: 0.75,
  /** [risco, vão] em px. O vão é curto para caber 3 repetições nos 55 do raio. */
  riscoTracejado: [2.0, 1.6],
  riscoPontilhado: [0.45, 1.8],
} as const

/** O padrão do arquivo original, em unidades do quadro — o piso do traçado. */
const RISCO_ORIGINAL = {
  tracejado: [6, 5],
  pontilhado: [1.2, 5],
} as const

/**
 * O badge da marca, desenhado pelo autor em `docs/marca/`.
 *
 * **Só o badge, e não o lockup inteiro.** Os arquivos de origem trazem também a
 * palavra "Plataforma Grafos" como `<text>`, e ela não pode vir junto por duas
 * razões independentes: o `Marca` abaixo já escreve o nome como texto HTML de
 * verdade (viria duplicado), e o `<text>` do arquivo pede a **Gabarito**, que
 * não é uma das três famílias que o site carrega (decisão 7) — cairia para a
 * Inter em quase toda máquina, em silêncio. Montar o lockup com símbolo +
 * texto HTML é a saída que o próprio material de marca do autor recomenda.
 *
 * **Um componente, não dois arquivos.** Os SVGs de origem vêm em par
 * claro/escuro, e a única coisa que muda entre eles é o acento — `#5B4BC4` no
 * claro, `#8F86D9` no escuro. Isso é exatamente o que `--acento` já resolve
 * sozinho pelo `light-dark()` da decisão 4b, então aqui vai o token e o par de
 * arquivos não vira par de componentes. Efeito colateral bem-vindo: a marca
 * passa a acompanhar o acento se ele mudar, em vez de discordar dele.
 */
function Simbolo({ lado }: { lado: number }) {
  /* O traçado some pelo mesmo motivo que o traço fino: o risco e o vão são
     medidos em unidades do quadro, e a 28px cada unidade vale 0,2px. Aqui eles
     passam a ser medidos em pixels do resultado. */
  const upp = 140 / lado
  /* O `max` contra o padrão do arquivo é o que faz isto ser CORREÇÃO e não
     substituição: abaixo de ~70px o alvo em pixels ganha e o traçado sobrevive;
     acima, o original ganha e o desenho volta a ser o exportado. Sem ele, um
     símbolo grande (o `apple-icon`, de 132px) recebia riscos calibrados para
     28px — dezenas de traços miúdos que se fundiam de volta numa linha sólida,
     exatamente o defeito que a correção existe para evitar. */
  const traçado = (
    alvo: readonly [number, number],
    original: readonly [number, number]
  ) => `${Math.max(original[0], alvo[0] * upp)} ${Math.max(original[1], alvo[1] * upp)}`
  const tracejado = traçado(ALVO_PX.riscoTracejado, RISCO_ORIGINAL.tracejado)
  const pontilhado = traçado(ALVO_PX.riscoPontilhado, RISCO_ORIGINAL.pontilhado)

  return (
    <svg
      /* O desenho vive em 0–200; este recorte é o conteúdo real (34–166 no
         eixo mais alto) com folga, quadrado, para o símbolo não nascer
         achatado dentro do quadrado que `lado` pede. */
      viewBox="30 30 140 140"
      width={lado}
      height={lado}
      /* Decorativo: o nome vem escrito ao lado, em texto de verdade. Sem isto,
         o leitor de tela anunciaria a marca duas vezes. */
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      {/* O anel externo fecha a forma. A opacidade é a única outra coisa que
          diferia entre os dois arquivos (0,35 no claro, 0,5 no escuro), então
          virou token em `globals.css` pela mesma regra do acento. */}
      <g
        fill="none"
        stroke="var(--acento)"
        strokeOpacity="var(--marca-anel)"
        strokeWidth={traco(lado, 2, ALVO_PX.anel)}
        strokeLinecap="round"
      >
        <path d="M100,45 L147.6,72.5" />
        <path d="M147.6,72.5 L147.6,127.5" />
        <path d="M147.6,127.5 L100,155" />
        <path d="M100,155 L52.4,127.5" />
        <path d="M52.4,127.5 L52.4,72.5" />
        <path d="M52.4,72.5 L100,45" />
      </g>

      <g stroke="var(--acento)" strokeLinecap="round" fill="none">
        {RAIOS.map(([x, y, largura, especie]) => (
          <path
            key={`${x}-${y}`}
            d={`M100,100 L${x},${y}`}
            /* A hierarquia do arquivo (4 / 3,2 / 2,4) vira 1,1 / 0,9 / 0,75px:
               a sólida continua a mais pesada e a pontilhada a mais leve, que
               é o que distingue as três espécies quando o traçado já não se
               distingue sozinho. */
            strokeWidth={traco(lado, largura, ALVO_PX[especie])}
            strokeDasharray={
              especie === 'tracejado' ? tracejado : especie === 'pontilhado' ? pontilhado : undefined
            }
          />
        ))}
      </g>

      <g>
        {NOS_DA_MARCA.map(([x, y, cor]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill={cor} />
        ))}
      </g>

      <circle cx="100" cy="100" r="15" fill="var(--acento)" />
    </svg>
  )
}

/**
 * O símbolo é maior que a altura do texto, de propósito.
 *
 * Os valores antigos (17 a 22px) casavam o símbolo com a caixa da letra, que é
 * o que se faz quando não HÁ símbolo e o número é só um espaço reservado. Marca
 * não segue a altura do texto: ela é o elemento que o olho pega primeiro, e o
 * badge aqui carrega sete nós — a essa escala, casado com a linha, cada nó
 * saía com menos de 3px.
 *
 * Ficaram em ~1,85× o corpo do texto. É o que dá aos nós 4 a 5px de diâmetro,
 * onde as cores das matérias passam a se distinguir umas das outras em vez de
 * virarem uma fileira de pontos escuros.
 *
 * **Mexer aqui não desacerta o traço:** o `traco()` lê o `lado` e recalcula
 * sozinho. Foi para isso que ele existe.
 */
const TAMANHOS = {
  peq: { texto: 'text-[14px]', simbolo: 26 },
  medio: { texto: 'text-[15px]', simbolo: 28 },
  grande: { texto: 'text-[17px]', simbolo: 32 },
  landing: { texto: 'text-[18px]', simbolo: 34 },
} as const

export default function Marca({
  tamanho = 'medio',
  className = '',
}: {
  tamanho?: keyof typeof TAMANHOS
  className?: string
}) {
  const t = TAMANHOS[tamanho]

  return (
    // `inline-flex` com `items-center`: quando o símbolo existir, ele e o nome
    // ficam alinhados pelo meio, e não pela linha de base — que é o que
    // desalinha logo de texto na maioria dos sites.
    <span className={`marca inline-flex items-center gap-2 font-medium ${t.texto} ${className}`}>
      <Simbolo lado={t.simbolo} />
      <span className="truncate">Plataforma Grafos</span>
    </span>
  )
}

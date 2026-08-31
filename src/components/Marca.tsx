/**
 * A marca do site, num lugar só.
 *
 * Antes o nome "Plataforma Grafos" estava escrito à mão em cinco arquivos — na
 * landing (topo e rodapé), no login e nas duas versões da barra lateral. Trocar
 * a marca significava caçar os cinco e acertar o tamanho de cada um.
 *
 * ============================================================
 * A LOGO, DESDE 26/08 — E O DESENHO NOVO, DE 30/08
 * ============================================================
 * O `Simbolo` esperou por um desenho do autor desde agosto, com o encaixe
 * documentado e `return null` no meio — porque logo genérica de encher espaço
 * é pior do que nenhuma, já que pareceria decidida. O desenho chegou, e em
 * 30/08 foi substituído por uma segunda versão dele.
 *
 * **Os originais estão versionados em `docs/marca/`.** O símbolo em vigor é o
 * `simbolo.svg`; os dois `logo-completo-*.svg` são o lockup (badge + nome), e
 * o badge deles acompanha o `simbolo.svg`. Eles são a fonte; o que está aqui
 * embaixo é a adaptação, e ela muda três coisas — cada uma por uma regra que
 * já valia no projeto:
 *
 * 1. **Só o badge entrou.** Os arquivos de lockup trazem o nome como `<text>`.
 *    O nome já é escrito aqui embaixo em HTML de verdade, então viria
 *    duplicado — e o `<text>` pede a fonte **Gabarito**, que só é declarada no
 *    grupo `(site)`: dentro do `(app)`, que é onde a marca passa o dia na barra
 *    lateral, ela cairia numa fonte qualquer, sem avisar.
 *    Símbolo + texto HTML é o lockup, montado.
 * 2. **O par de arquivos virou um componente só.** A única diferença entre
 *    claro e escuro é o acento (`#5B4BC4` / `#8F86D9`) e a opacidade do anel.
 *    As duas coisas são o que `light-dark()` resolve sozinho (decisão 4b), e
 *    viraram `--acento` e `--marca-anel`.
 * 3. **As cores das matérias ficaram cravadas**, porque é o que elas são: cor
 *    de matéria, não token de interface. Ver a nota no `NOS_DA_MARCA`.
 *
 * **O que mudou de um desenho para o outro**, porque o diff sozinho não conta:
 * o arquivo novo vive num quadro de 290 (o anterior, de 200), então as medidas
 * daqui são as dele divididas por 108/55 — a razão entre os dois raios do
 * hexágono, que é exata. Os seis nós e as seis cores são os MESMOS, na mesma
 * ordem, e as três espécies de aresta continuam nas mesmas seis direções. Duas
 * coisas são novas:
 *
 * - **O anel externo virou curvo**, arqueado para DENTRO. Eram seis segmentos
 *   retos; agora cada lado é uma quadrática cujo ponto de controle puxa ~3,6
 *   unidades na direção do centro.
 * - **Os traços afinaram e o nó do centro encolheu** (raio 15 → 13,24). O anel
 *   foi de 2 para 0,71 e os raios de 4/3,2/2,4 para 1,53/1,22/0,92.
 *
 * Consequência que vale saber ANTES de estranhar: nos tamanhos de cabeçalho
 * (26–34px) o `traco()` abaixo já elevava todos esses traços ao mesmo piso em
 * pixels, então **a espessura NA TELA não mudou nada** — afinar o arquivo não
 * afina a marca na barra lateral, e é para isso que o `traco()` existe. O que
 * se vê mudar são as duas coisas de geometria: o anel arqueado e o nó do centro
 * menor.
 *
 * O arco sobrevive ao cabeçalho, e isso foi conferido rasterizando a 28px e
 * ampliando 10×, não estimando: a flecha é de 3,56 unidades contra um traço
 * compensado de 5, ou seja, ~70% da própria espessura. Não some debaixo da
 * linha — lê como curva suave em vez de curva marcada, que é o que se espera
 * de uma redução.
 *
 * Se um dia a logo mudar de novo, o caminho é: trocar os arquivos de
 * `docs/marca/` e refazer a adaptação aqui — não editar um sem o outro.
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
 * **O desenho de 30/08 não mexeu nele, e é consistente:** o que ele mudou foi
 * justamente o anel (que a redução já não tem) e a espessura dos traços (que a
 * redução já reescrevia por conta própria). As seis cores e as seis posições,
 * que são o que ela guarda, seguem idênticas.
 *
 * As regras do favicon são outras: 16 a 32px de lado, forma cheia, uma cor
 * cravada e nada de `currentColor` — na aba não existe texto do qual herdar.
 * Por isso o acento lá é o meio-caminho `#766ACE`, e não o token.
 */
/**
 * Os seis nós do hexágono, na ordem do desenho do autor e nas cores das
 * matérias. Ficam cravados de propósito: são as cores DAS MATÉRIAS, não tokens
 * de interface, e o autor as manteve idênticas nos dois temas — o arquivo
 * claro e o escuro trazem estes mesmos seis valores, e o desenho novo os
 * repete sem tocar em nenhum.
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

/** Raio do nó de matéria, no quadro de 200 (21 no arquivo, ÷ 108/55). */
const RAIO_NO = 10.69

/** Raio do nó-âncora do centro (26 no arquivo). Era 15 no desenho anterior. */
const RAIO_CENTRO = 13.24

/**
 * O anel externo, um lado por entrada.
 *
 * **Cada lado é uma quadrática arqueada para dentro**, e é a novidade do
 * desenho de 30/08 — antes eram seis segmentos retos. Os pontos de controle
 * saem do arquivo do autor divididos por 108/55; a flecha de cada arco é de
 * 3,56 unidades, o que a 28px vale 0,71px contra um traço compensado de 1px.
 * O arco lê, e ele é a diferença que se enxerga entre este desenho e o de
 * 26/08 (ver o cabeçalho).
 *
 * Os vértices são os mesmos seis nós do `NOS_DA_MARCA`: o anel não tem
 * geometria própria além da curvatura.
 */
const ANEL = [
  'M100,45 Q120.22,64.91 147.6,72.5',
  'M147.6,72.5 Q140.49,100 147.6,127.5',
  'M147.6,127.5 Q120.22,135.09 100,155',
  'M100,155 Q79.78,135.09 52.4,127.5',
  'M52.4,127.5 Q59.51,100 52.4,72.5',
  'M52.4,72.5 Q79.78,64.91 100,45',
]

/**
 * Os seis raios que saem do centro, em três espessuras e três traçados.
 *
 * **Isto não é ornamento: são as três espécies de aresta do produto.** Sólida é
 * `pai_id` (contém), tracejada é `conexoes` (cita), pontilhada é o relacionado.
 * A marca desenha o modelo de dados — é a mesma tese do `marca/Grafo.tsx`, de
 * que a identidade cresce do que o produto é em vez de ser somada por cima.
 *
 * As espessuras são as do arquivo novo (3 / 2,4 / 1,8) convertidas para o
 * quadro de 200. A ORDEM de peso é o que importa e não mudou: a sólida segue a
 * mais pesada e a pontilhada a mais leve.
 */
const RAIOS: [number, number, number, 'solido' | 'tracejado' | 'pontilhado'][] = [
  [100, 45, 1.53, 'solido'],
  [147.6, 72.5, 1.22, 'tracejado'],
  [147.6, 127.5, 0.92, 'pontilhado'],
  [100, 155, 1.53, 'solido'],
  [52.4, 127.5, 1.22, 'tracejado'],
  [52.4, 72.5, 0.92, 'pontilhado'],
]

/** Espessura do anel no arquivo de origem (1,4), no quadro de 200. */
const TRACO_ANEL = 0.71

/**
 * Espessura de traço corrigida para o tamanho em que o símbolo vai ser
 * desenhado. **É o que faz a marca sobreviver ao cabeçalho.**
 *
 * O desenho vive num quadro de 140 unidades, então a 28px cada unidade vale
 * 0,2px: o anel de 0,71 unidade sai com 0,14px e o ponto do raio pontilhado com
 * 0,09px. Sub-pixel vira véu, não traço — e as três espécies de aresta, que são
 * a ideia inteira da marca, somem. Aumentar o símbolo não resolve isso sozinho:
 * para o anel chegar a 1px o símbolo precisaria de **197px**, que não é tamanho
 * de cabeçalho.
 *
 * Então o traço engrossa quando o quadro encolhe. Não é invenção: é o que o
 * material de marca do próprio autor prescreve ao dizer que o arquivo de 16–32px
 * "tem traço reforçado e não empasta". A GEOMETRIA não muda — nós, posições,
 * curvatura do anel e proporções entre as três espessuras seguem as do arquivo
 * original.
 *
 * `alvoPx` é a espessura mínima desejada em pixels. Quando o símbolo cresce, a
 * conta se desliga sozinha (o `max` devolve o valor original) e o desenho volta
 * a ser exatamente o exportado: por volta de 100px para os raios e de 197px
 * para o anel. **O desenho de 30/08 empurrou esses limiares para cima**, porque
 * afinou os traços de origem — antes eram ~70px. É esperado, e é o motivo de a
 * marca não ter afinado na barra lateral junto com o arquivo: abaixo desses
 * limiares quem manda é o piso em pixels, não o arquivo.
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
 *
 * **Eles sobreviveram à troca de desenho de propósito:** descrevem o RESULTADO
 * em pixels, não o arquivo. Trocar o arquivo muda de onde a conta parte, não
 * onde ela precisa chegar.
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

/**
 * O padrão do arquivo original, em unidades do quadro — o piso do traçado.
 * São os `stroke-dasharray` do `docs/marca/simbolo.svg` ("8 6" no tracejado e
 * "1.5 6" no pontilhado) convertidos para o quadro de 200.
 */
const RISCO_ORIGINAL = {
  tracejado: [4.07, 3.06],
  pontilhado: [0.76, 3.06],
} as const

/**
 * O badge da marca, desenhado pelo autor em `docs/marca/simbolo.svg`.
 *
 * **Só o badge, e não o lockup inteiro.** Os arquivos de lockup trazem também a
 * palavra "Plataforma Grafos" como `<text>`, e ela não pode vir junto por duas
 * razões independentes: o `Marca` abaixo já escreve o nome como texto HTML de
 * verdade (viria duplicado), e o `<text>` do arquivo pede a **Gabarito**, que
 * só é declarada no grupo `(site)` (decisão 7) — dentro do `(app)` ela cairia
 * numa fonte qualquer, em silêncio. Montar o lockup com símbolo +
 * texto HTML é a saída que o próprio material de marca do autor recomenda.
 *
 * **Um componente, não dois arquivos.** Os SVGs de lockup vêm em par
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
     substituição: nos tamanhos pequenos o alvo em pixels ganha e o traçado
     sobrevive; nos grandes, o original ganha e o desenho volta a ser o
     exportado. Sem ele, um símbolo grande (o `apple-icon`, de 132px) recebia
     riscos calibrados para 28px — dezenas de traços miúdos que se fundiam de
     volta numa linha sólida, exatamente o defeito que a correção existe para
     evitar. */
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
        strokeWidth={traco(lado, TRACO_ANEL, ALVO_PX.anel)}
        strokeLinecap="round"
      >
        {ANEL.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <g stroke="var(--acento)" strokeLinecap="round" fill="none">
        {RAIOS.map(([x, y, largura, especie]) => (
          <path
            key={`${x}-${y}`}
            d={`M100,100 L${x},${y}`}
            /* A hierarquia do arquivo (1,53 / 1,22 / 0,92) vira 1,1 / 0,9 /
               0,75px: a sólida continua a mais pesada e a pontilhada a mais
               leve, que é o que distingue as três espécies quando o traçado já
               não se distingue sozinho. */
            strokeWidth={traco(lado, largura, ALVO_PX[especie])}
            strokeDasharray={
              especie === 'tracejado' ? tracejado : especie === 'pontilhado' ? pontilhado : undefined
            }
          />
        ))}
      </g>

      <g>
        {NOS_DA_MARCA.map(([x, y, cor]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={RAIO_NO} fill={cor} />
        ))}
      </g>

      <circle cx="100" cy="100" r={RAIO_CENTRO} fill="var(--acento)" />
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

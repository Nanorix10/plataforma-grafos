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
 * **Atenção — hoje ele desenha OUTRA marca.** O `icon.svg` traz três nós e
 * duas arestas com a base aberta, de antes de a logo existir; a logo é o
 * hexágono de sete nós. São dois símbolos para o mesmo produto, um na aba e
 * outro no cabeçalho. Alinhar os dois está pendente, e é decisão do autor:
 * o badge tem sete nós e três traçados de aresta, o que a 16px empasta —
 * então não é copiar, é desenhar a redução.
 *
 * As regras do favicon são outras: 16 a 32px de lado, forma cheia, uma cor
 * cravada e nada de `currentColor` — na aba não existe texto do qual herdar.
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
const RAIOS: [number, number, number, string][] = [
  [100, 45, 4, ''],
  [147.6, 72.5, 3.2, '6 5'],
  [147.6, 127.5, 2.4, '1.2 5'],
  [100, 155, 4, ''],
  [52.4, 127.5, 3.2, '6 5'],
  [52.4, 72.5, 2.4, '1.2 5'],
]

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
        strokeWidth="2"
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
        {RAIOS.map(([x, y, largura, traco]) => (
          <path
            key={`${x}-${y}`}
            d={`M100,100 L${x},${y}`}
            strokeWidth={largura}
            strokeDasharray={traco || undefined}
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

const TAMANHOS = {
  peq: { texto: 'text-[14px]', simbolo: 17 },
  medio: { texto: 'text-[15px]', simbolo: 18 },
  grande: { texto: 'text-[17px]', simbolo: 21 },
  landing: { texto: 'text-[18px]', simbolo: 22 },
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

/**
 * A marca do site, num lugar só.
 *
 * Antes o nome "Plataforma Grafos" estava escrito à mão em cinco arquivos — na
 * landing (topo e rodapé), no login e nas duas versões da barra lateral. Trocar
 * a marca significava caçar os cinco e acertar o tamanho de cada um.
 *
 * ============================================================
 * COMO COLOCAR A SUA LOGO
 * ============================================================
 * Cole o conteúdo do seu SVG dentro de `Simbolo` abaixo, no lugar do `return
 * null`. Só isso — ela aparece nos cinco lugares, no tamanho certo de cada um,
 * porque `Simbolo` já recebe o tamanho em `em` e acompanha o texto ao lado.
 *
 * Três coisas que o SVG precisa ter para funcionar bem aqui:
 *
 * 1. **`viewBox`, e nada de `width`/`height` fixos.** É o `viewBox` que deixa
 *    a logo nítida em qualquer tamanho; largura fixa no arquivo brigaria com o
 *    tamanho que cada tela pede.
 * 2. **`fill="currentColor"` nos traços que devem seguir o texto.** O site tem
 *    tema claro e escuro; uma cor fixa some num dos dois. Se alguma parte da
 *    logo tem cor própria e imutável (uma marca d'água, um detalhe de acento),
 *    aí sim deixe o valor cravado — mas confira nos DOIS temas.
 * 3. **Sem `<text>`.** Fonte dentro de SVG depende de a fonte existir na
 *    máquina de quem lê. Converta as letras em caminho (no Illustrator ou
 *    Inkscape, "criar contornos" / "object to path").
 *
 * Se preferir manter o arquivo separado, jogue-o em `public/logo.svg` e troque
 * o `return null` por
 *   `<img src="/logo.svg" alt="" width={...} height={...} />`
 * — mas o SVG embutido é melhor: não custa uma requisição, e é ele que
 * consegue herdar a cor do tema pelo `currentColor`.
 *
 * ============================================================
 * E O ÍCONE DA ABA (favicon)
 * ============================================================
 * É outro arquivo, e não passa por aqui. Hoje o site usa
 * `src/app/favicon.ico`, que é o padrão que veio com o Next. Para trocar,
 * ponha o seu como `src/app/icon.svg` — o Next reconhece o nome sozinho e
 * passa a servi-lo no lugar, sem configuração. Apague o `favicon.ico` junto,
 * senão os dois convivem e o navegador escolhe.
 *
 * Aí o SVG tem regras diferentes das de cima: ele é desenhado com 16 a 32px de
 * lado, então detalhe fino some. Use uma forma cheia e uma cor só, e nada de
 * `currentColor` — na aba do navegador não existe texto do qual herdar.
 *
 * Enquanto não houver logo, o componente rende só o nome. É de propósito: uma
 * logo genérica de encher espaço seria pior do que nenhuma, porque pareceria
 * decidida.
 */
function Simbolo({ lado }: { lado: number }) {
  // ↓↓↓ SUA LOGO AQUI ↓↓↓
  //
  // <svg viewBox="0 0 32 32" width={lado} height={lado} fill="currentColor"
  //      aria-hidden="true" className="shrink-0">
  //   …
  // </svg>
  void lado
  return null
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

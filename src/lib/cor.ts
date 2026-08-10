/**
 * Deriva o par claro/escuro de uma cor escolhida à mão no editor.
 *
 * Por que existe: a cor que o autor escolhe fica gravada no HTML do resumo,
 * então ela acompanha o texto para sempre — e o site tem dois temas. Uma cor
 * só serviria a um deles: um azul-marinho escolhido no papel claro vira uma
 * mancha invisível no fundo escuro, e um amarelo-pastel faz o contrário. Por
 * isso tudo o que o editor grava é `light-dark(claro, escuro)`, igual aos
 * tokens do `globals.css` (decisão 4b do CONTEXTO).
 *
 * As sete cores prontas da barra já vinham escritas como par, à mão. Com o
 * seletor livre não dá para escrever à mão: o autor escolhe UMA cor, e o par
 * precisa sair daqui.
 *
 * Os números saíram de medir os seis pares escritos à mão. O que eles têm em
 * comum é menos do que parece:
 *
 *   #C2334D L48 S58  →  #E08088 L69 S61
 *   #1F5F9E L37 S67  →  #7FA8CF L65 S45
 *   #3F7848 L36 S31  →  #8FAE94 L62 S16
 *   #565B6B L38 S11  →  #B2B6CA L75 S18
 *
 * **O matiz é preservado** (varia no máximo 6°, que é ruído de arredondamento)
 * e **o brilho sobe entre 19 e 37 pontos**. Esses dois são regra. A saturação
 * NÃO é: ela vai de ×0,52 a ×1,70, porque foi ajustada no olho, par a par. Não
 * há fórmula a extrair dali, e fingir que há seria inventar uma explicação para
 * um número que ninguém calculou.
 *
 * Então o ×0,7 abaixo não reproduz a paleta — é só o fator único que chega mais
 * perto dela no conjunto (medido: erro somado de 76 pontos de HSL, contra 112
 * se a saturação fosse mantida intacta). Ele existe porque cor saturada sobre
 * fundo quase preto vibra, e alguma queda ajuda em todos os casos.
 *
 * Consequência prática: uma cor derivada aqui não sai idêntica à do
 * `materias.ts`. As sete cores prontas da barra seguem escritas à mão
 * justamente por isso — quem quer exatamente aquele tom clica na bolinha.
 *
 * A faixa preserva a INTENÇÃO de claro/escuro em vez de achatar tudo num valor
 * fixo: quem escolhe um azul-bebê e quem escolhe um azul-marinho continua
 * recebendo cores diferentes nos dois temas — só que ambas legíveis.
 */

type Hsl = { h: number; s: number; l: number }

/** Faixa de brilho de cada tema. Fora dela a cor deixa de ler sobre o fundo. */
const CLARO_MIN = 0.2
const CLARO_AMPL = 0.28
const ESCURO_MIN = 0.58
const ESCURO_AMPL = 0.28

/** Abaixo disto a cor é cinza, e girar matiz de cinza não significa nada. */
const LIMIAR_CINZA = 0.08

/** Ver o cabeçalho: não reproduz a paleta, só é o fator que chega mais perto. */
const QUEDA_SATURACAO = 0.7

export function hexParaHsl(hex: string): Hsl {
  const limpo = hex.replace('#', '').trim()
  const cheio =
    limpo.length === 3
      ? limpo
          .split('')
          .map((c) => c + c)
          .join('')
      : limpo

  const r = parseInt(cheio.slice(0, 2), 16) / 255
  const g = parseInt(cheio.slice(2, 4), 16) / 255
  const b = parseInt(cheio.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) return { h: 0, s: 0, l }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h: number
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6

  return { h, s, l }
}

export function hslParaHex({ h, s, l }: Hsl): string {
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * Devolve `light-dark(claro, escuro)` a partir de uma cor só.
 *
 * Cinza é tratado à parte de propósito: sem matiz para preservar, o que o autor
 * está pedindo é "mais apagado" ou "mais forte que o texto normal", e a resposta
 * certa é um cinza espelhado — o que ficou claro num tema fica escuro no outro,
 * na mesma distância do texto de leitura.
 */
export function parDeTemas(hex: string): string {
  const { h, s, l } = hexParaHsl(hex)

  if (s < LIMIAR_CINZA) {
    const claro = hslParaHex({ h: 0, s: 0, l: CLARO_MIN + l * CLARO_AMPL })
    const escuro = hslParaHex({ h: 0, s: 0, l: ESCURO_MIN + (1 - l) * ESCURO_AMPL })
    return `light-dark(${claro}, ${escuro})`
  }

  const claro = hslParaHex({ h, s, l: CLARO_MIN + l * CLARO_AMPL })
  const escuro = hslParaHex({ h, s: s * QUEDA_SATURACAO, l: ESCURO_MIN + l * ESCURO_AMPL })
  return `light-dark(${claro}, ${escuro})`
}

/**
 * Tira do par a cor do tema claro, para alimentar o `<input type="color">`.
 *
 * O campo nativo só aceita `#rrggbb`; devolver o `light-dark(...)` inteiro faz
 * o navegador descartar em silêncio e mostrar preto, e aí o seletor abriria
 * sempre no preto em vez de na cor que o texto já tem.
 */
export function primeiroHex(valor: string | undefined, reserva = '#000000'): string {
  const achado = valor?.match(/#[0-9a-f]{6}|#[0-9a-f]{3}/i)?.[0]
  if (!achado) return reserva
  if (achado.length === 4) {
    return `#${achado
      .slice(1)
      .split('')
      .map((c) => c + c)
      .join('')}`
  }
  return achado
}

/**
 * Transforma a resolução gravada pelo editor numa gaveta que abre no clique.
 *
 * O editor grava `<div class="resolucao">…</div>` (veja o porquê em
 * `admin/editor/questaoResolvida.ts`). Aqui, na leitura, isso vira
 * `<details>` — o elemento nativo do HTML para "conteúdo que abre e fecha".
 *
 * Nativo importa: não desce nenhum JavaScript por causa disso, funciona com o
 * teclado e com leitor de tela sem código nosso, e o Ctrl+F do navegador acha
 * o texto lá dentro mesmo com a gaveta fechada.
 *
 * Roda ANTES de `renderizarMatematica`: o KaTeX gera montanhas de `<div>`
 * aninhados, e a contagem de profundidade abaixo teria que atravessar todos
 * eles à toa. Antes dele, o que existe dentro da resolução são parágrafos e
 * listas.
 */

const ABERTURA = '<div class="resolucao">'
const FECHAMENTO = '</div>'

export function renderizarQuestoes(html: string): string {
  return gavetas(prepararQuestoes(html))
}

function gavetas(html: string): string {
  if (!html || !html.includes(ABERTURA)) return html

  let saida = ''
  let resto = html

  for (;;) {
    const inicioTag = resto.indexOf(ABERTURA)
    if (inicioTag === -1) {
      saida += resto
      break
    }

    saida += resto.slice(0, inicioTag)
    const inicioConteudo = inicioTag + ABERTURA.length

    /* Acha o `</div>` que fecha ESTE div, e não o primeiro que aparecer: uma
       resolução pode conter outro div (uma segunda gaveta, um bloco de
       fórmula). Procurar `indexOf('</div>')` direto fecharia no lugar errado e
       cortaria o resto do resumo para fora da página. */
    let profundidade = 1
    let cursor = inicioConteudo

    while (profundidade > 0) {
      const abre = resto.indexOf('<div', cursor)
      const fecha = resto.indexOf(FECHAMENTO, cursor)

      if (fecha === -1) break // HTML truncado

      if (abre !== -1 && abre < fecha) {
        profundidade += 1
        cursor = abre + '<div'.length
      } else {
        profundidade -= 1
        cursor = fecha + FECHAMENTO.length
      }
    }

    // Não fechou: devolve o trecho como veio em vez de inventar uma gaveta
    // sobre HTML quebrado — o resumo sai feio, mas sai inteiro.
    if (profundidade > 0) {
      saida += resto.slice(inicioTag)
      break
    }

    const dentro = resto.slice(inicioConteudo, cursor - FECHAMENTO.length)
    saida +=
      '<details class="resolucao">' +
      '<summary>Ver resolução</summary>' +
      dentro +
      '</details>'

    resto = resto.slice(cursor)
  }

  return saida
}

// ---------------------------------------------------------------------------
// Questão que se responde na página (decisão 22).
//
// O autor marca o gabarito no editor (`data-gabarito` na `<aside>`): uma letra
// para a objetiva, um número para a somatória. Aqui, na leitura, as linhas de
// alternativa ganham `role="button"` e os dados que `Questoes.tsx` lê para
// corrigir no clique. Sem gabarito, ou com um gabarito que não bate com as
// alternativas escritas, a questão vira "aberta": a resolução ganha o
// "Acertei / Errei" e o aluno se avalia.
//
// **O texto não muda um caractere.** Só se acrescentam atributos às tags que
// já existem e dois blocos novos (o painel e o "E aí, acertou?"), sempre com o
// mesmo texto. Os grifos (decisão 21) se ancoram no texto, e ele precisa ser o
// mesmo em toda visita.
//
// **Nada aqui adivinha gabarito.** A resposta costuma estar escrita dentro da
// resolução ("…pela 1ª lei de Newton. D)"), e ler dali seria fácil. Seria
// também o jeito de o site dizer a um aluno que ele errou quando acertou.

export type TipoQuestao = 'objetiva' | 'somatoria' | 'aberta'

/** "A) texto", "a) texto", "(A) texto", "a. texto". */
const RE_LETRA = /^\s*\(?([A-Ea-e])[).]\s/
/** "(01) texto", "01. texto", "01) texto" — somatória usa dois dígitos. */
const RE_ITEM = /^\s*(?:\((\d{1,2})\)|(\d{2})[.)])\s/
const POTENCIAS = new Set([1, 2, 4, 8, 16, 32, 64])

type Paragrafo = { inicio: number; fim: number; texto: string }

/**
 * Decide o tipo da questão e acha as alternativas, olhando só os parágrafos do
 * primeiro nível da moldura ANTES da resolução — uma célula de tabela que
 * começa com "A)" não é alternativa.
 *
 * Exportada porque o editor chama a mesma função para dizer ao autor, na hora,
 * se o gabarito que ele marcou vai funcionar na página.
 */
export function analisarQuestao(
  interno: string,
  gabarito: string | null
): { tipo: TipoQuestao; opcoes: { paragrafo: Paragrafo; opcao: string }[] } {
  const aberta = { tipo: 'aberta' as const, opcoes: [] }
  if (!gabarito) return aberta
  const paragrafos = paragrafosDoTopo(interno)

  if (/^[A-Ea-e]$/.test(gabarito)) {
    const opcoes = paragrafos
      .map((p) => ({ paragrafo: p, m: RE_LETRA.exec(p.texto) }))
      .filter((x) => x.m)
      .map((x) => ({ paragrafo: x.paragrafo, opcao: x.m![1].toUpperCase() }))
    // Precisam ser A, B, C… nesta ordem, e o gabarito tem de estar entre elas.
    // Qualquer outra coisa é texto que PARECE alternativa.
    const emOrdem = opcoes.every((o, i) => o.opcao === 'ABCDE'[i])
    const temGabarito = opcoes.some((o) => o.opcao === gabarito.toUpperCase())
    if (opcoes.length >= 2 && emOrdem && temGabarito) return { tipo: 'objetiva', opcoes }
    return aberta
  }

  if (/^\d{1,3}$/.test(gabarito)) {
    const itens = paragrafos
      .map((p) => ({ paragrafo: p, m: RE_ITEM.exec(p.texto) }))
      .filter((x) => x.m)
      .map((x) => ({ paragrafo: x.paragrafo, valor: Number(x.m![1] ?? x.m![2]) }))
    const valores = itens.map((o) => o.valor)
    const crescentes = valores.every(
      (v, i) => POTENCIAS.has(v) && (i === 0 || v > valores[i - 1])
    )
    const mascara = valores.reduce((s, v) => s | v, 0)
    const soma = Number(gabarito)
    // A soma só pode usar itens que existem: 06 numa questão sem o item 04
    // é gabarito digitado errado, e corrigir por ele seria corrigir errado.
    if (itens.length >= 2 && crescentes && (soma & ~mascara) === 0) {
      return {
        tipo: 'somatoria',
        opcoes: itens.map((o) => ({
          paragrafo: o.paragrafo,
          opcao: String(o.valor).padStart(2, '0'),
        })),
      }
    }
    return aberta
  }

  return aberta
}

/** Os `<p>` que são filhos diretos da moldura, antes da primeira resolução. */
function paragrafosDoTopo(interno: string): Paragrafo[] {
  const saida: Paragrafo[] = []
  const tag = /<(\/?)(p|table|figure|ul|ol|blockquote|div)\b[^>]*>/g
  let fundura = 0
  let abertoEm = -1
  for (let m = tag.exec(interno); m; m = tag.exec(interno)) {
    const [inteira, fecha, nome] = m
    if (nome === 'div' && !fecha && fundura === 0 && inteira.includes('class="resolucao"')) break
    if (nome === 'p') {
      if (fundura !== 0) continue
      if (!fecha) abertoEm = m.index
      else if (abertoEm !== -1) {
        const fim = m.index + inteira.length
        const texto = interno
          .slice(abertoEm, fim)
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
        saida.push({ inicio: abertoEm, fim, texto })
        abertoEm = -1
      }
      continue
    }
    fundura += fecha ? -1 : 1
  }
  return saida
}

/** Índice logo depois do `</div>` que fecha o div cujo conteúdo começa em `de`. */
function fimDoDiv(html: string, de: number): number {
  let fundura = 1
  let cursor = de
  while (fundura > 0) {
    const abre = html.indexOf('<div', cursor)
    const fecha = html.indexOf('</div>', cursor)
    if (fecha === -1) return -1
    if (abre !== -1 && abre < fecha) {
      fundura += 1
      cursor = abre + 4
    } else {
      fundura -= 1
      cursor = fecha + 6
    }
  }
  return cursor
}

const COMO_FOI =
  '<div class="como-foi" role="group" aria-label="Como foi a questão">' +
  '<span>E aí, acertou?</span>' +
  '<button type="button" data-como-foi="acertei" aria-pressed="false">Acertei</button>' +
  '<button type="button" data-como-foi="errei" aria-pressed="false">Errei</button>' +
  '</div>'

const PAINEL: Record<Exclude<TipoQuestao, 'aberta'>, string> = {
  objetiva: '<div class="questao-painel"><span class="questao-veredito" aria-live="polite"></span></div>',
  somatoria:
    '<div class="questao-painel">' +
    '<button type="button" class="conferir-soma">Conferir soma</button>' +
    '<span class="questao-veredito" aria-live="polite"></span>' +
    '</div>',
}

/**
 * Prepara cada `<aside class="questao">` que tenha `data-id` para ser
 * respondida. Questão sem id (HTML colado de fora, que o editor ainda não
 * numerou) sai exatamente como entrou.
 */
export function prepararQuestoes(html: string): string {
  if (!html || !html.includes('questao')) return html
  const abertura = /<aside\b([^>]*)>/g
  let saida = ''
  let cursor = 0

  for (let m = abertura.exec(html); m; m = abertura.exec(html)) {
    const attrs = m[1]
    if (!/class="questao"/.test(attrs)) continue
    const id = /data-id="([0-9a-f-]{36})"/.exec(attrs)?.[1]
    if (!id) continue
    const fimAbertura = m.index + m[0].length
    const fecha = html.indexOf('</aside>', fimAbertura)
    if (fecha === -1) break

    const gabarito = /data-gabarito="([^"]*)"/.exec(attrs)?.[1] ?? null
    let interno = html.slice(fimAbertura, fecha)
    const { tipo, opcoes } = analisarQuestao(interno, gabarito)

    if (tipo === 'aberta') {
      // Na ÚLTIMA resolução: uma questão em partes (a, b) tem uma gaveta por
      // parte, e o "acertou?" vale para a questão inteira.
      const ultima = interno.lastIndexOf('<div class="resolucao">')
      if (ultima !== -1) {
        const fim = fimDoDiv(interno, ultima + '<div class="resolucao">'.length)
        if (fim !== -1) {
          const antesDoFecho = fim - '</div>'.length
          interno = interno.slice(0, antesDoFecho) + COMO_FOI + interno.slice(antesDoFecho)
        }
      }
    } else {
      // O painel entra antes da resolução, e as alternativas são marcadas de
      // trás para a frente para as posições anotadas continuarem valendo.
      const primeiraResolucao = interno.indexOf('<div class="resolucao">')
      const painelEm = primeiraResolucao === -1 ? interno.length : primeiraResolucao
      interno = interno.slice(0, painelEm) + PAINEL[tipo] + interno.slice(painelEm)
      for (const { paragrafo, opcao } of [...opcoes].reverse()) {
        const extra =
          ` class="alternativa" data-opcao="${opcao}" role="button" tabindex="0"` +
          (tipo === 'somatoria' ? ' aria-pressed="false"' : '')
        const em = paragrafo.inicio + 2 // logo depois de "<p"
        interno = interno.slice(0, em) + extra + interno.slice(em)
      }
    }

    saida += html.slice(cursor, m.index) + `<aside${attrs} id="q-${id}" data-tipo="${tipo}">` + interno
    cursor = fecha
    abertura.lastIndex = fecha
  }

  return saida + html.slice(cursor)
}

import katex from 'katex'
// carrega o mhchem, que ensina o KaTeX a entender \ce{...} — reações químicas.
// É import por efeito colateral: ele se registra dentro do próprio KaTeX.
import 'katex/dist/contrib/mhchem.mjs'

/**
 * Transforma as fórmulas gravadas no corpo em HTML já renderizado.
 *
 * Renderiza no SERVIDOR de propósito: o aluno recebe o HTML pronto e só o CSS
 * do KaTeX. O motor de renderização, que passa de 250 KB, fica no editor e
 * nunca é baixado por quem está só lendo o resumo.
 *
 * Dois formatos são aceitos:
 *
 * 1. Nós do editor — `<span data-type="inline-math" data-latex="…">` e
 *    `<div data-type="block-math" data-latex="…">`. É o que o TipTap grava.
 *    Guardar o TeX num atributo evita o problema clássico do delimitador `$`:
 *    "custa R$ 50 e R$ 80" não vira fórmula por acidente.
 *
 * 2. `$…$` e `$$…$$` em texto puro — para conteúdo colado de fora ou escrito
 *    à mão antes do editor existir.
 */

/** Entidades que o HTML cria e que precisam voltar a ser caracteres. */
function decodificarEntidades(texto: string) {
  return (
    texto
      .replace(/&lt;/g, '<')
      // reação química é cheia de `->` e `<=>`; sem isto, toda seta quebraria
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#(?:39|x27);/g, "'")
      .replace(/&nbsp;/g, ' ')
      // &amp; por último: decodificar antes transformaria `&amp;lt;` em `<`
      .replace(/&amp;/g, '&')
  )
}

function renderizar(tex: string, emBloco: boolean) {
  const limpo = decodificarEntidades(tex).trim()
  if (!limpo) return ''
  try {
    return katex.renderToString(limpo, {
      displayMode: emBloco,
      // uma fórmula com erro de digitação sai em vermelho e o resumo continua
      // legível, em vez de derrubar a página inteira
      throwOnError: false,
      errorColor: 'var(--erro)',
      strict: false,
      trust: false,
    })
  } catch {
    const seguro = limpo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<code class="formula-erro">${seguro}</code>`
  }
}

/** Nós de fórmula gravados pelo editor. */
const NO_FORMULA = /<(span|div)\b([^>]*?\bdata-type="(inline|block)-math"[^>]*?)>\s*(?:<\/\1>)?/gi
const ATRIBUTO_LATEX = /\bdata-latex="([^"]*)"/i

export function renderizarMatematica(html: string): string {
  if (!html) return html

  const comNos = html.replace(NO_FORMULA, (original, _tag, atributos: string, tipo: string) => {
    const tex = ATRIBUTO_LATEX.exec(atributos)?.[1]
    if (tex === undefined) return original
    return renderizar(tex, tipo.toLowerCase() === 'block')
  })

  return comNos.includes('$') ? renderizarDelimitadores(comNos) : comNos
}

/**
 * Percorre o HTML separando marcação de texto, e só mexe no texto.
 * Sem isso, um `$` dentro de um atributo (href, class) seria confundido com
 * abertura de fórmula e o HTML sairia corrompido.
 */
function renderizarDelimitadores(html: string): string {
  const partes = html.split(/(<[^>]+>)/g)
  let dentroDeCodigo = 0

  return partes
    .map((parte) => {
      if (parte.startsWith('<')) {
        // `$` dentro de <code>/<pre> é exemplo de código, não fórmula
        if (/^<(code|pre)\b/i.test(parte)) dentroDeCodigo++
        else if (/^<\/(code|pre)>/i.test(parte)) dentroDeCodigo = Math.max(0, dentroDeCodigo - 1)
        return parte
      }
      if (dentroDeCodigo > 0) return parte
      return substituirFormulas(parte)
    })
    .join('')
}

function substituirFormulas(texto: string) {
  let saida = ''
  let i = 0

  while (i < texto.length) {
    // \$ escapado: o autor queria o cifrão de verdade
    if (texto[i] === '\\' && texto[i + 1] === '$') {
      saida += '$'
      i += 2
      continue
    }

    if (texto[i] !== '$') {
      saida += texto[i]
      i += 1
      continue
    }

    const emBloco = texto.startsWith('$$', i)
    const marca = emBloco ? '$$' : '$'
    const fim = texto.indexOf(marca, i + marca.length)

    // cifrão solto, sem par: trata como texto comum (preço, por exemplo)
    if (fim === -1) {
      saida += texto[i]
      i += 1
      continue
    }

    const tex = texto.slice(i + marca.length, fim)

    /**
     * Regra de abertura/fechamento colados, igual à do Markdown matemático:
     * o `$` de abertura não pode ser seguido de espaço, nem o de fechamento
     * precedido de espaço.
     *
     * É isto que impede "De R$ 50 para R$ 80" de virar uma fórmula com
     * "50 para R" no meio — um bug que só apareceria em produção, num resumo
     * qualquer que mencionasse dois valores.
     */
    const abreColado = !emBloco ? !/^\s/.test(tex) : true
    const fechaColado = !emBloco ? !/\s$/.test(tex) : true

    if (!tex.trim() || !abreColado || !fechaColado) {
      saida += texto[i]
      i += 1
      continue
    }

    saida += renderizar(tex, emBloco)
    i = fim + marca.length
  }

  return saida
}

import katex from 'katex'
import { lerConfig } from './grafico/modelo'
import { montarFigura } from './grafico/figura'

/**
 * Troca cada gráfico gravado no corpo pelo gráfico já desenhado (decisão 34).
 *
 * O corpo guarda só a receita (`<div data-type="grafico" data-config="…">`).
 * Desenhar aqui, no servidor, é o mesmo raciocínio das fórmulas (decisão 8):
 * o aluno recebe o desenho pronto, sem esperar JavaScript e sem a página
 * pular quando ele chega, e o KaTeX da legenda não desce para o navegador.
 * Quem mexe nos controles depois é `resumos/[slug]/Graficos.tsx`.
 *
 * Roda POR ÚLTIMO na cadeia da página: o desenho é HTML grande, e as outras
 * regexes (questões, wikilinks, fórmulas) não têm nada a fazer dentro dele.
 */

const NO_GRAFICO = /<div\b([^>]*?\bdata-type="grafico"[^>]*)>\s*<\/div>/gi
const ATRIBUTO_CONFIG = /\bdata-config="([^"]*)"/i

function decodificarEntidades(texto: string) {
  return texto
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

const renderLatex = (tex: string) =>
  katex.renderToString(tex, { throwOnError: false, errorColor: 'var(--erro)', strict: false, trust: false })

export function renderizarGraficos(html: string): string {
  if (!html || !html.includes('data-type="grafico"')) return html
  return html.replace(NO_GRAFICO, (_original, atributos: string) => {
    const bruto = ATRIBUTO_CONFIG.exec(atributos)?.[1]
    const g = bruto === undefined ? null : lerConfig(decodificarEntidades(bruto))
    // receita estragada não derruba a página: vira um aviso discreto
    if (!g) return '<div class="grafico grafico-invalido">Gráfico indisponível.</div>'
    try {
      return montarFigura(g, renderLatex)
    } catch {
      return '<div class="grafico grafico-invalido">Gráfico indisponível.</div>'
    }
  })
}

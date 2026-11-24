import { nomeLatex, paraLatex } from './expressao'
import { casasDoPasso, compilar, escreverConfig, formatarNumero, valoresIniciais, type Grafico } from './modelo'
import { desenharSvg } from './desenho'

/**
 * Monta o bloco inteiro do gráfico — desenho, controles, legenda — como HTML
 * (decisão 34). Servidor e editor chamam esta função; o navegador do aluno
 * só redesenha o `<svg>` de dentro (`vivo.ts`).
 *
 * O KaTeX chega como parâmetro (`renderLatex`) para este módulo seguir puro:
 * o servidor passa o dele (decisão 8), o editor passa o que já baixou. O
 * aluno nunca baixa o KaTeX por causa do gráfico — os nomes e as fórmulas da
 * legenda não mudam quando ele mexe num controle, então vêm prontos.
 *
 * É um `<div role="figure">`, e não `<figure>`: `lib/figuras.ts` reescreve
 * toda `<figure>` do corpo (as legendas das imagens), e `.conteudo-resumo
 * figure` é das imagens (decisão 11c).
 */

/** Largura com que o servidor desenha; o navegador redesenha na largura real. */
export const LARGURA_SERVIDOR = 640

export type RenderLatex = (tex: string) => string

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function latexSeguro(render: RenderLatex, tex: string) {
  try {
    return render(tex)
  } catch {
    return `<code>${esc(tex)}</code>`
  }
}

export function montarFigura(g: Grafico, renderLatex: RenderLatex): string {
  const c = compilar(g)
  const valores = valoresIniciais(g)
  const svg = desenharSvg(c, valores, g.janela, { largura: LARGURA_SERVIDOR, altura: g.altura })

  const funcoes = g.objetos
    .map((o, i) => ({ o, i }))
    .filter(({ o }) => o.tipo === 'funcao')
    .map(({ o, i }) => {
      if (o.tipo !== 'funcao') return ''
      const arv = c.arvores.get(i)
      const tex = arv
        ? `${nomeLatex(o.nome)}(${nomeLatex(g.variavel)}) = ${paraLatex(arv.a)}`
        : null
      const formula = tex ? latexSeguro(renderLatex, tex) : `<code>${esc(o.expr)}</code>`
      const rotulo = o.rotulo ? ` <span class="grafico-funcao-rotulo">${esc(o.rotulo)}</span>` : ''
      return `<li><span class="grafico-chip" style="background:var(--grafico-${o.cor})" aria-hidden="true"></span>${formula}${rotulo}</li>`
    })
    .join('')

  const controles = g.parametros
    .map((p) => {
      const nome = latexSeguro(renderLatex, nomeLatex(p.nome))
      return (
        `<div class="grafico-param">` +
        `<span class="grafico-param-nome">${nome} =</span>` +
        `<output class="grafico-param-valor" data-param="${esc(p.nome)}">${esc(formatarNumero(p.valor, casasDoPasso(p.passo)))}</output>` +
        `<input type="range" data-param="${esc(p.nome)}" min="${p.min}" max="${p.max}" step="${p.passo}" value="${p.valor}" aria-label="Valor de ${esc(p.nome)}">` +
        `<button type="button" class="grafico-botao" data-acao="animar" data-param="${esc(p.nome)}" aria-label="Animar ${esc(p.nome)}" aria-pressed="false">▶</button>` +
        `</div>`
      )
    })
    .join('')

  const resumo = g.objetos
    .filter((o) => o.tipo === 'funcao')
    .map((o) => (o.tipo === 'funcao' ? `${o.nome}(${g.variavel}) = ${o.expr}` : ''))
    .join('; ')
  const rotuloAria = g.titulo || (resumo ? `Gráfico de ${resumo}` : 'Gráfico interativo')

  return (
    `<div class="grafico" data-type="grafico" role="figure" aria-label="${esc(rotuloAria)}" data-config="${esc(escreverConfig(g))}">` +
    (g.titulo ? `<p class="grafico-titulo">${esc(g.titulo)}</p>` : '') +
    // a altura também vai como variável: no celular o CSS a limita à largura
    `<div class="grafico-palco" style="height:${g.altura}px;--grafico-altura:${g.altura}px">${svg}` +
    `<div class="grafico-zoom">` +
    `<button type="button" class="grafico-botao" data-acao="mais" aria-label="Aproximar">+</button>` +
    `<button type="button" class="grafico-botao" data-acao="menos" aria-label="Afastar">−</button>` +
    `<button type="button" class="grafico-botao" data-acao="voltar" aria-label="Voltar ao enquadramento original">⟲</button>` +
    `</div></div>` +
    (controles ? `<div class="grafico-controles">${controles}</div>` : '') +
    (funcoes ? `<ul class="grafico-funcoes">${funcoes}</ul>` : '') +
    (g.legenda ? `<p class="grafico-legenda">${esc(g.legenda)}</p>` : '') +
    `</div>`
  )
}

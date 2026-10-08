// Prévia local de um rascunho, pelo MESMO pipeline da página do resumo
// (`src/app/(app)/resumos/[slug]/page.tsx`), e a conferência que decide se o
// rascunho pode virar PR.
//
// Uso, da raiz do repositório:
//   npx tsx .claude/skills/rascunhar-resumo/scripts/previa.mts \
//     --corpo corpo.html --links links.json --slug x --titulo "X" \
//     --materia matematica --cai "PAS UEM · 3ª etapa" --saida previa-x.html
//
// `links.json` é { "Título exato": "slug" } para cada [[wikilink]] do corpo,
// tirado do banco (resumos_catalogo). Título fora do arquivo conta como link
// quebrado, que é o que o trigger sync_conexoes_resumo faria em produção.
//
// Imprime um relatório JSON e sai com código 1 se algo falhar.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { pathToFileURL } from 'url'

const arg = (n: string) => {
  const i = process.argv.indexOf('--' + n)
  return i > 0 ? process.argv[i + 1] : undefined
}
const RAIZ = resolve(process.cwd())
const lib = (f: string) => import(pathToFileURL(join(RAIZ, 'src/lib', f)).href)

const { renderizarWikilinks, extrairLinks } = await lib('wikilinks.ts')
const { renderizarQuestoes, prepararQuestoes } = await lib('questoes.ts')
const { legendarFiguras } = await lib('figuras.ts')
const { marcarFormulaSolta } = await lib('formula-solta.ts')
const { ancorarTitulos, extrairTitulos } = await lib('titulos.ts')
const { montarFicha } = await lib('ficha-resumo.ts')
const { MATERIAS } = await lib('materias.ts')
const { renderizarMatematica } = await lib('matematica.ts')

const corpo = readFileSync(arg('corpo')!, 'utf8')
const links: Record<string, string> = JSON.parse(readFileSync(arg('links')!, 'utf8'))
const MAT = arg('materia')!
const materia = (MATERIAS as any)[MAT]
if (!materia) throw new Error('matéria desconhecida: ' + MAT)

const html = prepararQuestoes(
  renderizarMatematica(
    renderizarWikilinks(
      renderizarQuestoes(marcarFormulaSolta(legendarFiguras(ancorarTitulos(corpo)))),
      links,
    ),
  ),
)

// O CSS do site sai do dev server. O worktree costuma não ter `.next`; o
// checkout principal tem.
function acharCss(): string | null {
  for (const base of [RAIZ, 'C:/Users/leand/_pg']) {
    const d = join(base, '.next/dev/static/chunks')
    if (!existsSync(d)) continue
    const f = readdirSync(d).find((n) => /globals_css.*\.css$/.test(n))
    if (f) return readFileSync(join(d, f), 'utf8')
  }
  return null
}
const css = acharCss()

// Imagens embutidas: a prévia é aberta como arquivo solto.
const comImagens = html.replace(/src="(\/img\/[^"]+)"/g, (_m: string, u: string) => {
  const p = join(RAIZ, 'public', u)
  return existsSync(p) ? `src="data:image/webp;base64,${readFileSync(p).toString('base64')}"` : `src="${u}"`
})

const ficha = montarFicha(corpo, extrairTitulos(corpo))
const cor = materia.cor
const pagina = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prévia — ${arg('titulo')}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Plus+Jakarta+Sans:wght@200..800&display=swap" rel="stylesheet">
<style>${css ?? ''}</style>
<style>:root{--fonte-texto:'Bricolage Grotesque',sans-serif;--fonte-resumo:'Plus Jakarta Sans',sans-serif;--pagina:920px;--margem-esq:150px;--margem-dir:150px}</style>
</head><body>
<div class="leitura" style="--cor-materia:${cor}">
<article class="max-w-[var(--pagina)] mx-auto px-6 md:pl-[var(--margem-esq)] md:pr-[var(--margem-dir)] py-10 md:py-14">
<p style="font:12px sans-serif;opacity:.7">Prévia local — não publicado</p>
<h1 class="text-[30px] font-medium leading-tight mb-8" style="color:${cor}">${arg('titulo')}</h1>
<p class="faixa-resumo"><span>${ficha.secoes} seções</span><span>${ficha.leitura}</span></p>
<div class="ficha"><div class="cai-em"><h2>Cai em</h2><ul><li>${arg('cai') ?? '—'}</li></ul></div></div>
<div class="conteudo-resumo" style="--cor-materia:${cor}">${comImagens}</div>
</article></div></body></html>`
writeFileSync(arg('saida')!, pagina)

// Conferência
const contar = (re: RegExp) => (html.match(re) || []).length
const titulosLink: string[] = extrairLinks(corpo)
const quebrados = titulosLink.filter((t) => !(t in links))
const imagens = [...corpo.matchAll(/src="(\/img\/[^"]+)"/g)].map((m) => m[1])
const imagensFaltando = imagens.filter((u) => !existsSync(join(RAIZ, 'public', u)))
const questoes = [...html.matchAll(/<aside class="questao"[^>]*data-tipo="([^"]+)"/g)].map((m) => m[1])
const ids = [...corpo.matchAll(/<aside class="questao" data-id="([^"]+)"/g)].map((m) => m[1])
const revisar = (corpo.split(/<h2>Para revisar<\/h2>/)[1] || '').match(/<h3 /g)?.length ?? 0

const relatorio = {
  formulas: contar(/class="katex"/g),
  // `strict: false` (lib/matematica.ts) não lança em comando desconhecido:
  // ele sai pintado de --erro, e só o MathML denuncia
  errosDeFormula: contar(/katex-error|formula-erro|mathcolor="var\(--erro\)"/g),
  wikilinks: titulosLink,
  wikilinksQuebrados: quebrados,
  imagensFaltando,
  questoes, // tipo de cada uma: objetiva, somatoria ou aberta
  itensClicaveis: contar(/role="button"/g),
  idsDeQuestao: ids,
  paresParaRevisar: revisar,
  ficha,
  cssDoSite: css ? 'ok' : 'ausente: rode `npm run dev` uma vez no checkout principal',
}
console.log(JSON.stringify(relatorio, null, 2))

const falhas = [
  relatorio.errosDeFormula > 0 && 'fórmula com erro',
  quebrados.length > 0 && 'wikilink que não resolve',
  imagensFaltando.length > 0 && 'imagem que não existe em public/',
  titulosLink.length < 2 && 'menos de dois wikilinks',
  (revisar < 4 || revisar > 8) && 'Para revisar fora de 4 a 8 pares',
  new Set(ids).size !== ids.length && 'data-id de questão repetido',
].filter(Boolean)
if (falhas.length) {
  console.error('FALHOU: ' + falhas.join('; '))
  process.exit(1)
}

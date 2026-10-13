/**
 * Reúne as questões do resumo numa seção "Pratique", no fim da leitura.
 *
 * No meio do texto, uma questão de prova interrompe quem está lendo para
 * aprender: uma somatória de cinco itens entre dois conceitos é pulada, e quem
 * pula não volta. No fim, depois de ler tudo, ela é o que deve ser — a hora de
 * recuperar de memória o que acabou de passar pelos olhos.
 *
 * **O banco não muda.** O autor continua escrevendo a questão onde ela faz
 * sentido, colada ao conceito que cobra, e o editor continua mostrando ali.
 * Quem move é a leitura, e no lugar de origem fica uma ponte de uma linha
 * ("Questão 1 · PAS-UEM 2025, 3ª etapa — em Pratique"): o aluno ainda sabe que
 * aquele trecho cai em prova, sem parar para resolver.
 *
 * **Por que mover não quebra os grifos.** O grifo se ancora no TRECHO (o texto
 * exato e um pedaço antes e depois, decisão 21), não na posição. O trecho
 * continua existindo; só o contexto em volta muda num grifo que encoste numa
 * questão, e a âncora ainda casa pelo texto exato.
 *
 * **Roda uma vez, e todo mundo lê o resultado.** O trilho acha os wikilinks
 * pela ORDEM em que aparecem (decisão 12d): se o trilho lesse o corpo cru e a
 * página o reorganizado, uma questão com link no meio desalinharia a contagem.
 * Por isso `page.tsx` chama isto antes de `extrairTrilho`, `montarFicha` e do
 * renderizador, e passa o mesmo HTML aos três. O mapa (`extrairTitulos`) segue
 * lendo o corpo cru, e é de propósito: "Pratique" não é um conceito, não vira
 * nó.
 *
 * Questão sem `data-id` (HTML colado que o editor ainda não numerou) fica onde
 * está: sem id não há âncora para a ponte apontar, nem resposta a guardar.
 */

const ASIDE = /<aside\b[^>]*\bclass="questao"[^>]*>[\s\S]*?<\/aside>/g
const ID = /data-id="([0-9a-f-]{36})"/
/** "(PAS-UEM 2025, 3ª etapa) Enunciado…" → "PAS-UEM 2025, 3ª etapa" */
const ORIGEM = /^<p>\s*\(([^)]{3,60})\)/
const PARA_REVISAR = /<h2\b[^>]*>\s*Para revisar\s*<\/h2>/

export function reunirQuestoes(html: string | null | undefined): string {
  if (!html || !html.includes('class="questao"')) return html ?? ''

  const questoes: string[] = []
  const semQuestoes = html.replace(ASIDE, (aside) => {
    const id = ID.exec(aside)?.[1]
    if (!id) return aside
    questoes.push(aside)
    const abertura = aside.indexOf('>') + 1
    const origem = ORIGEM.exec(aside.slice(abertura))?.[1]
    const rotulo = `Questão ${questoes.length}${origem ? ` · ${origem}` : ''}`
    return `<p class="ponte-questao"><a href="#q-${id}">${rotulo}<span> — em Pratique</span></a></p>`
  })
  if (questoes.length === 0) return html

  const n = questoes.length
  const secao =
    '<h2 class="pratique">Pratique</h2>' +
    `<p class="pratique-intro">${n === 1 ? 'Uma questão de prova' : `${n} questões de prova`} sobre o que você acabou de ler. Tente de cabeça, sem voltar ao texto.</p>` +
    questoes.join('')

  const revisar = PARA_REVISAR.exec(semQuestoes)
  const em = revisar ? revisar.index : semQuestoes.length
  // Ponte colada no ponto onde a seção entra aponta para a linha de baixo, e
  // não poupa leitura nenhuma: é a questão que já fechava o texto. Ela sai.
  const antes = semQuestoes.slice(0, em).replace(PONTES_NO_FIM, '')
  return antes + secao + semQuestoes.slice(em)
}

const PONTES_NO_FIM = /(?:\s*<p class="ponte-questao">(?:(?!<\/p>)[\s\S])*<\/p>)+\s*$/

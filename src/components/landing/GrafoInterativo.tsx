'use client'

import { useState } from 'react'
import { MATERIAS } from '@/lib/materias'

/**
 * O grafo que se explica sozinho.
 *
 * Quem chega na landing não sabe o que é um grafo — e o nome da empresa é
 * esse. Uma seção que só AFIRMA "os resumos são interligados" pede fé; esta
 * deixa a pessoa tocar em um nó e ver o que acontece, que é a única forma de
 * a palavra virar entendimento.
 *
 * **Ela ensina as DUAS linhas do produto**, que são a decisão 9 do
 * `CONTEXTO.md` e a coisa que mais confunde quem chega:
 *
 * | linha | significa | no produto |
 * |---|---|---|
 * | cheia | contém — estrutura escrita à mão | `resumos.pai_id` |
 * | tracejada | cita — referência achada no `[[wikilink]]` | tabela `conexoes` |
 *
 * Quem entender isso aqui já sabe ler o `/mapa` no primeiro dia de acesso.
 *
 * **Sem d3, e isso é decisão.** O `/mapa` usa `d3-force` porque lá o layout
 * precisa acomodar um acervo que cresce. Aqui o desenho é fixo e escrito à
 * mão: são dez nós que nunca mudam, e a decisão 10 do CONTEXTO.md é clara
 * sobre não engordar bundle à toa — esta é a página que TODO visitante baixa,
 * inclusive quem nunca vai virar aluno. Layout fixo também é o que mantém a
 * marca reconhecível: um grafo que se redesenha a cada carregamento não é
 * marca, é ruído.
 *
 * **Nada se move sozinho.** Sem física, sem animação de entrada, sem pulso.
 * A única mudança é a que o dedo ou a tecla causou — é isso que separa
 * "interativo" de "caótico". As transições de cor são curtas e desligadas sob
 * `prefers-reduced-motion` pelo `globals.css`.
 */

type No = {
  id: string
  rotulo: string
  x: number
  y: number
  /** Matéria de origem, que dá a cor. `undefined` = nó de matéria, não de resumo. */
  materia?: keyof typeof MATERIAS
  /** Nó de matéria é desenhado maior; é o guarda-chuva, não um resumo. */
  raiz?: boolean
}

const NOS: No[] = [
  { id: 'fisica', rotulo: 'Física', x: 120, y: 60, materia: 'fisica', raiz: true },
  { id: 'dinamica', rotulo: 'Dinâmica', x: 120, y: 150, materia: 'fisica' },
  { id: 'newton', rotulo: 'Leis de Newton', x: 120, y: 240, materia: 'fisica' },
  { id: 'inercia', rotulo: '1ª Lei', x: 44, y: 322, materia: 'fisica' },
  { id: 'segunda', rotulo: '2ª Lei', x: 190, y: 322, materia: 'fisica' },
  { id: 'energia', rotulo: 'Energia', x: 330, y: 150, materia: 'fisica' },
  { id: 'trabalho', rotulo: 'Trabalho', x: 330, y: 240, materia: 'fisica' },
  { id: 'matematica', rotulo: 'Matemática', x: 470, y: 60, materia: 'matematica', raiz: true },
  { id: 'vetores', rotulo: 'Vetores', x: 470, y: 150, materia: 'matematica' },
  { id: 'trigono', rotulo: 'Trigonometria', x: 470, y: 240, materia: 'matematica' },
]

type Aresta = { de: string; para: string; tipo: 'contem' | 'cita' }

const ARESTAS: Aresta[] = [
  // contém — a estrutura que o autor escreveu à mão
  { de: 'fisica', para: 'dinamica', tipo: 'contem' },
  { de: 'fisica', para: 'energia', tipo: 'contem' },
  { de: 'dinamica', para: 'newton', tipo: 'contem' },
  { de: 'newton', para: 'inercia', tipo: 'contem' },
  { de: 'newton', para: 'segunda', tipo: 'contem' },
  { de: 'energia', para: 'trabalho', tipo: 'contem' },
  { de: 'matematica', para: 'vetores', tipo: 'contem' },
  { de: 'matematica', para: 'trigono', tipo: 'contem' },
  // cita — o que o [[wikilink]] achou sozinho, e o que atravessa matéria
  { de: 'segunda', para: 'vetores', tipo: 'cita' },
  { de: 'trabalho', para: 'segunda', tipo: 'cita' },
  { de: 'inercia', para: 'energia', tipo: 'cita' },
  { de: 'vetores', para: 'trigono', tipo: 'cita' },
]

/** O que a legenda diz quando um nó está escolhido. Montada, não escrita à mão. */
function explicar(id: string) {
  const no = NOS.find((n) => n.id === id)!
  const contem = ARESTAS.filter((a) => a.de === id && a.tipo === 'contem')
  const dentroDe = ARESTAS.find((a) => a.para === id && a.tipo === 'contem')
  const cita = ARESTAS.filter((a) => a.tipo === 'cita' && (a.de === id || a.para === id))
  const nome = (i: string) => NOS.find((n) => n.id === i)!.rotulo

  const partes: string[] = []
  if (dentroDe) partes.push(`está dentro de ${nome(dentroDe.de)}`)
  if (contem.length) partes.push(`contém ${contem.map((a) => nome(a.para)).join(' e ')}`)
  if (cita.length) {
    const outros = cita.map((a) => nome(a.de === id ? a.para : a.de))
    partes.push(`se conecta com ${outros.join(', ')}`)
  }
  return { titulo: no.rotulo, texto: partes.join('; ') + '.' }
}

/** Vizinhos diretos do nó escolhido, por qualquer uma das duas linhas. */
function vizinhosDe(id: string | null) {
  if (!id) return new Set<string>()
  const s = new Set<string>([id])
  for (const a of ARESTAS) {
    if (a.de === id) s.add(a.para)
    if (a.para === id) s.add(a.de)
  }
  return s
}

export default function GrafoInterativo() {
  const [escolhido, setEscolhido] = useState<string | null>('newton')
  const aceso = vizinhosDe(escolhido)
  const legenda = escolhido ? explicar(escolhido) : null

  /** Setas andam pelos nós. Sem isso o grafo só existiria para quem tem mouse. */
  function navegar(e: React.KeyboardEvent, i: number) {
    const passo =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1
      : 0
    if (!passo) return
    e.preventDefault()
    const proximo = NOS[(i + passo + NOS.length) % NOS.length]
    setEscolhido(proximo.id)
    document.getElementById(`no-${proximo.id}`)?.focus()
  }

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
      <div className="quadro rounded-[var(--raio)] p-4 shadow-[var(--sombra)]">
        <svg
          viewBox="0 0 560 380"
          className="w-full h-auto"
          role="group"
          aria-label="Grafo de exemplo: toque num assunto para ver com o que ele se liga"
        >
          {ARESTAS.map((a) => {
            const de = NOS.find((n) => n.id === a.de)!
            const para = NOS.find((n) => n.id === a.para)!
            const viva = !escolhido || (aceso.has(a.de) && aceso.has(a.para))
            return (
              <line
                key={`${a.de}-${a.para}`}
                x1={de.x}
                y1={de.y}
                x2={para.x}
                y2={para.y}
                stroke={viva ? 'var(--acento)' : 'var(--line-forte)'}
                strokeWidth={viva ? 1.75 : 1}
                /* Tracejada = cita. É a mesma linguagem do `/mapa`, para quem
                   aprendeu aqui não precisar reaprender lá dentro. */
                strokeDasharray={a.tipo === 'cita' ? '5 4' : undefined}
                opacity={viva ? 1 : 0.45}
                className="transition-[stroke,opacity] duration-150"
              />
            )
          })}

          {NOS.map((n, i) => {
            const viva = !escolhido || aceso.has(n.id)
            const alvo = escolhido === n.id
            const cor = n.materia ? MATERIAS[n.materia].cor : 'var(--ink-faint)'
            return (
              <g
                key={n.id}
                id={`no-${n.id}`}
                role="button"
                tabIndex={0}
                aria-pressed={alvo}
                aria-label={`${n.rotulo}. ${explicar(n.id).texto}`}
                onClick={() => setEscolhido(n.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setEscolhido(n.id)
                    return
                  }
                  navegar(e, i)
                }}
                className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-[var(--acento)] [&:focus-visible>circle]:stroke-[3]"
                opacity={viva ? 1 : 0.4}
              >
                {/* Alvo de toque generoso e invisível: o círculo visível tem 7px
                    de raio, que é metade do mínimo confortável para um dedo. */}
                <circle cx={n.x} cy={n.y} r={22} fill="transparent" />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.raiz ? 9 : 7}
                  /* Vazado = matéria (guarda-chuva), preenchido = resumo. Mesma
                     regra da decisão 12, com uma diferença: lá o vazado é o
                     título dentro do resumo. Aqui não há títulos, então o
                     vazado sobe um nível e marca a matéria. */
                  fill={n.raiz ? 'var(--paper)' : cor}
                  stroke={cor}
                  strokeWidth={2}
                  className="transition-[stroke-width] duration-150"
                />
                <text
                  x={n.x}
                  y={n.y - (n.raiz ? 17 : 15)}
                  textAnchor="middle"
                  className="text-[11px] font-medium select-none"
                  fill={alvo ? cor : 'var(--ink-dim)'}
                >
                  {n.rotulo}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div>
        <div className="rotulo-secao mb-3">O que é um grafo</div>
        <h3 className="text-[length:var(--t-grande)] font-medium mb-3">
          Cada assunto sabe onde mora e com quem conversa.
        </h3>
        <p className="text-sm text-[var(--ink-dim)] mb-5 leading-relaxed">
          Um grafo é isto: assuntos ligados por relações. Toque em qualquer um
          para ver as dele. É assim que o material está montado por dentro —
          e é daí que vem o nome da plataforma.
        </p>

        <dl className="text-sm space-y-2.5 mb-6">
          <div className="flex items-center gap-3">
            <svg width="34" height="8" aria-hidden="true" className="shrink-0">
              <line x1="0" y1="4" x2="34" y2="4" stroke="var(--acento)" strokeWidth="1.75" />
            </svg>
            <dt className="font-medium">Contém</dt>
            <dd className="text-[var(--ink-faint)]">Dinâmica está dentro de Física.</dd>
          </div>
          <div className="flex items-center gap-3">
            <svg width="34" height="8" aria-hidden="true" className="shrink-0">
              <line
                x1="0"
                y1="4"
                x2="34"
                y2="4"
                stroke="var(--acento)"
                strokeWidth="1.75"
                strokeDasharray="5 4"
              />
            </svg>
            <dt className="font-medium">Cita</dt>
            <dd className="text-[var(--ink-faint)]">A 2ª Lei precisa de Vetores.</dd>
          </div>
        </dl>

        {/* `aria-live`: quem navega por teclado ou leitor de tela recebe a
            explicação sem precisar procurá-la na tela. `min-h` para a caixa não
            saltar de altura a cada troca, que é o que faria a página tremer. */}
        <div
          role="status"
          aria-live="polite"
          className="bg-[var(--raised)] rounded-[var(--raio-peq)] p-4 min-h-[92px]"
        >
          {legenda && (
            <>
              <div className="font-medium text-[length:var(--t-base)] mb-1">
                {legenda.titulo}
              </div>
              <p className="text-[length:var(--t-peq)] text-[var(--ink-dim)] leading-relaxed">
                {legenda.texto}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { MATERIAS } from '@/lib/materias'
import { ASSUNTOS, PROCESSOS_DA_MATERIA } from '@/lib/assuntos'

/**
 * Quatro jeitos de mostrar o acervo, para comparar na tela.
 *
 * O problema comum às quatro: hoje a cor da matéria é um ponto de 8px num canto
 * do cartão, e o cartão repete o nome da matéria — informação que o aluno já
 * tem. A seção fica sem vida e sem conteúdo.
 *
 * As quatro compartilham **cor como área, não como ponto**. O que muda é o que
 * cada uma acrescenta de informação.
 *
 * Este arquivo é temporário: quando uma variante for escolhida, ela vira a
 * `Materias.tsx` e o resto sai.
 */

const SLUGS = Object.keys(MATERIAS) as (keyof typeof MATERIAS)[]
/** A vitrine mostra oito; as doze aparecem só na faixa da variante C. */
const VITRINE = SLUGS.slice(0, 8)

function Cabecalho({ letra, titulo, nota }: { letra: string; titulo: string; nota: string }) {
  return (
    <div className="mb-6 pb-3 border-b border-[var(--line-forte)]">
      <div className="rotulo-secao mb-1">Variante {letra}</div>
      <h2 className="text-[length:var(--t-grande)] font-medium">{titulo}</h2>
      <p className="text-[length:var(--t-peq)] text-[var(--ink-faint)] mt-1 max-w-[70ch]">{nota}</p>
    </div>
  )
}

/* ================= A — o que tem dentro ================= */
export function VarianteA() {
  return (
    <section>
      <Cabecalho
        letra="A"
        titulo="Mostrar o que tem dentro"
        nota="Cada matéria lista três assuntos reais e a cor vira uma faixa no topo. Prova que existe acervo em vez de só nomear a disciplina."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {VITRINE.map((slug) => (
          <div
            key={slug}
            className="bg-[var(--raised)] rounded-[var(--raio)] overflow-hidden shadow-[var(--sombra)] flex flex-col"
          >
            {/* A cor ocupa área: 4px de largura total em vez de um ponto. */}
            <div className="h-1" style={{ background: MATERIAS[slug].cor }} />
            <div className="p-4 flex flex-col gap-2.5 flex-1">
              <div>
                <h3 className="font-medium text-[length:var(--t-base)]">{MATERIAS[slug].nome}</h3>
                <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)]">
                  {PROCESSOS_DA_MATERIA[slug]}
                </span>
              </div>
              <ul className="mt-auto space-y-1">
                {(ASSUNTOS[slug] ?? []).map((a) => (
                  <li
                    key={a}
                    className="text-[length:var(--t-peq)] text-[var(--ink-dim)] flex items-baseline gap-1.5"
                  >
                    <span aria-hidden="true" style={{ color: MATERIAS[slug].cor }}>
                      ·
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ================= B — mini-grafo por matéria ================= */
export function VarianteB() {
  return (
    <section>
      <Cabecalho
        letra="B"
        titulo="Um mini-grafo em cada matéria"
        nota="Reforça a marca e diferencia cada célula. O risco é virar ruído: são oito desenhos parecidos na mesma tela."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {VITRINE.map((slug, i) => {
          const cor = MATERIAS[slug].cor
          /* Cada matéria recebe um arranjo levemente diferente, derivado do
             índice, para os oito não saírem idênticos. */
          const d = i % 3
          const nos = [
            [22, 16], [10, 34], [34, 32 + d * 3], [26, 46 - d * 2],
          ]
          return (
            <div
              key={slug}
              className="bg-[var(--raised)] rounded-[var(--raio)] p-4 shadow-[var(--sombra)] flex flex-col gap-3"
            >
              <svg viewBox="0 0 44 58" className="w-[44px] h-[58px]" aria-hidden="true">
                <g stroke={cor} strokeWidth="1.4" opacity="0.55">
                  <line x1={nos[0][0]} y1={nos[0][1]} x2={nos[1][0]} y2={nos[1][1]} />
                  <line x1={nos[0][0]} y1={nos[0][1]} x2={nos[2][0]} y2={nos[2][1]} />
                  <line x1={nos[1][0]} y1={nos[1][1]} x2={nos[3][0]} y2={nos[3][1]} />
                  <line x1={nos[2][0]} y1={nos[2][1]} x2={nos[3][0]} y2={nos[3][1]} />
                </g>
                {nos.map(([x, y], k) => (
                  <circle key={k} cx={x} cy={y} r={k === 0 ? 4.5 : 3.2} fill={cor} />
                ))}
              </svg>
              <div className="mt-auto">
                <h3 className="font-medium text-[length:var(--t-base)]">{MATERIAS[slug].nome}</h3>
                <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)]">
                  {PROCESSOS_DA_MATERIA[slug]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ================= C — faixa das 12 cores ================= */
export function VarianteC() {
  return (
    <section>
      <Cabecalho
        letra="C"
        titulo="Uma faixa com as doze cores"
        nota="Assinatura visual antes da grade. Barato e bonito, mas é decoração: não diz nada que o aluno precise saber."
      />
      {/* As doze, e não as oito da vitrine: a faixa é sobre o conjunto. */}
      <div className="flex rounded-[var(--raio-peq)] overflow-hidden h-2.5 mb-6">
        {SLUGS.map((slug) => (
          <div key={slug} className="flex-1" style={{ background: MATERIAS[slug].cor }} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {VITRINE.map((slug) => (
          <div
            key={slug}
            className="bg-[var(--raised)] rounded-[var(--raio)] p-4 min-h-[110px] shadow-[var(--sombra)] flex flex-col justify-end"
          >
            <h3
              className="font-medium text-[length:var(--t-base)]"
              style={{ color: MATERIAS[slug].cor }}
            >
              {MATERIAS[slug].nome}
            </h3>
            <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)]">
              {PROCESSOS_DA_MATERIA[slug]}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ================= D — folha de gabarito ================= */
export function VarianteD() {
  const PROVAS = ['PASSE', 'PAS UEM', 'PAS UnB']
  return (
    <section>
      <Cabecalho
        letra="D"
        titulo="O acervo como folha de gabarito"
        nota="O cartão-resposta sai do hero e vem para cá, onde teria o que dizer: a bolha preenchida indica em qual prova a matéria aparece."
      />
      <div className="bg-[var(--raised)] rounded-[var(--raio)] shadow-[var(--sombra)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--line)]">
          <span className="rotulo-secao flex-1">Matéria</span>
          {PROVAS.map((p) => (
            <span key={p} className="rotulo-secao w-[62px] text-center">
              {p}
            </span>
          ))}
        </div>
        {VITRINE.map((slug) => {
          const cobre = PROCESSOS_DA_MATERIA[slug]
          return (
            <div
              key={slug}
              className="flex items-center gap-3 px-5 py-2.5 border-b border-[var(--line)] last:border-0"
            >
              <span
                className="flex-1 text-[length:var(--t-base)] font-medium"
                style={{ color: MATERIAS[slug].cor }}
              >
                {MATERIAS[slug].nome}
              </span>
              {PROVAS.map((p) => {
                const tem = cobre.includes(p)
                return (
                  <span key={p} className="w-[62px] flex justify-center">
                    <span
                      className="w-3.5 h-3.5 rounded-full border-2 block"
                      style={
                        tem
                          ? { background: MATERIAS[slug].cor, borderColor: 'transparent' }
                          : { borderColor: 'var(--line-forte)' }
                      }
                    />
                    <span className="sr-only">{tem ? 'incluída' : 'não incluída'}</span>
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ================= hoje, para comparar ================= */
export function Atual() {
  return (
    <section>
      <Cabecalho
        letra="0"
        titulo="Como está hoje"
        nota="A cor é um ponto de 8px e o cartão repete o nome da matéria — informação que o aluno já tem."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line-forte)] rounded-[var(--raio)] overflow-hidden">
        {VITRINE.map((slug) => (
          <div
            key={slug}
            className="bg-[var(--raised)] p-[1.375rem] min-h-[140px] flex flex-col justify-between"
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full"
              style={{ background: MATERIAS[slug].cor }}
            />
            <div>
              <h3 className="font-medium text-[length:var(--t-base)] mb-1.5">
                {MATERIAS[slug].nome}
              </h3>
              <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)]">
                {PROCESSOS_DA_MATERIA[slug]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

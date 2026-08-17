import { MATERIAS } from '@/lib/materias'

/**
 * A grade de matérias.
 *
 * A lista é curada à mão e não derivada de `MATERIAS` de propósito: a vitrine
 * mostra as que já têm acervo e em quais processos, e `MATERIAS` é o cadastro
 * completo do sistema. Derivar daqui faria a landing anunciar disciplina sem
 * resumo nenhum atrás.
 */
const GRADE: { slug: keyof typeof MATERIAS; processos: string }[] = [
  { slug: 'portugues', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'quimica', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'matematica', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'geografia', processos: 'PASSE · PAS UEM' },
  { slug: 'literatura', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'fisica', processos: 'PASSE · PAS UnB' },
  { slug: 'filosofia', processos: 'PAS UnB' },
  { slug: 'arte', processos: 'PASSE · PAS UEM' },
]

export default function Materias() {
  return (
    <section
      id="materias"
      className="py-[var(--ritmo-secao)] max-w-[1120px] mx-auto px-8"
    >
      <div className="max-w-[520px] mb-11">
        <div className="rotulo-secao mb-3">Acervo</div>
        <h2 className="text-[length:var(--t-titulo)] font-medium mb-3">
          Uma pasta por matéria, dentro de cada processo seletivo.
        </h2>
        <p className="text-sm text-[var(--ink-dim)]">
          Filtre por disciplina e pelo vestibular que você está estudando.
        </p>
      </div>
      {/* `gap-px` sobre o fundo da borda: as células se tocam por uma linha de
          1px em vez de flutuarem separadas — é a mesma leitura de "pasta" que
          a barra lateral do produto usa. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line-forte)] rounded-[var(--raio)] overflow-hidden">
        {GRADE.map((m) => (
          <div
            key={m.slug}
            className="bg-[var(--raised)] p-[1.375rem] min-h-[140px] flex flex-col justify-between"
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full"
              style={{ background: MATERIAS[m.slug].cor }}
            />
            <div>
              <h3 className="font-medium text-[length:var(--t-base)] mb-1.5">
                {MATERIAS[m.slug].nome}
              </h3>
              <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)]">
                {m.processos}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

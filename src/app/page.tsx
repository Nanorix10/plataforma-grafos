import Link from 'next/link'
import { MATERIAS } from '@/lib/materias'

const cartaoResposta = [
  { num: '01', label: 'Biologia — PAS UEM', filled: 0, cor: MATERIAS.biologia.cor },
  { num: '02', label: 'Química — PASSE UFMS', filled: 0, cor: MATERIAS.quimica.cor },
  { num: '03', label: 'Matemática — PAS UnB', filled: 1, cor: MATERIAS.matematica.cor },
  { num: '04', label: 'Geografia — PASSE UFMS', filled: 2, cor: MATERIAS.geografia.cor },
  { num: '05', label: 'Literatura — PAS UEM', filled: 0, cor: MATERIAS.literatura.cor },
  { num: '06', label: 'Física — PAS UnB', filled: 2, cor: MATERIAS.fisica.cor },
]

const materiasGrid: { slug: keyof typeof MATERIAS; processos: string }[] = [
  { slug: 'portugues', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'quimica', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'matematica', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'geografia', processos: 'PASSE · PAS UEM' },
  { slug: 'literatura', processos: 'PASSE · PAS UEM · PAS UnB' },
  { slug: 'fisica', processos: 'PASSE · PAS UnB' },
  { slug: 'filosofia', processos: 'PAS UnB' },
  { slug: 'arte', processos: 'PASSE · PAS UEM' },
]

/**
 * A faixa de números é a única superfície saturada do site inteiro. Ela existe
 * pra quebrar a sequência de seções escuras iguais no meio da rolagem — sem
 * ela a landing lê como uma parede só.
 */
const numeros = [
  { valor: '24', label: 'matérias cobertas' },
  { valor: '3', label: 'processos seletivos' },
  { valor: '180+', label: 'resumos interligados' },
  { valor: 'Campo Grande', label: 'MS, material próprio' },
]

export default function LandingPage() {
  return (
    <div>
      <nav className="sticky top-0 z-50 bg-[var(--paper)]/90 backdrop-blur">
        <div className="max-w-[1120px] mx-auto px-8 h-[68px] flex items-center justify-between gap-6">
          <div className="marca font-medium text-[18px]">Plataforma Grafos</div>
          <div className="hidden md:flex gap-8 text-sm text-[var(--ink-dim)] ml-auto">
            <a href="#materias" className="hover:text-[var(--ink)]">Matérias</a>
            <a href="#planos" className="hover:text-[var(--ink)]">Planos</a>
          </div>
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg border border-[var(--acento)] text-[var(--acento)] font-medium text-sm hover:bg-[var(--acento-fraco)] hover:text-[var(--acento-claro)]"
          >
            Entrar
          </Link>
        </div>
      </nav>

      <header className="pt-24 pb-22 max-w-[1120px] mx-auto px-8 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-end">
        <div>
          <div className="text-xs tracking-[0.08em] uppercase text-[var(--acento-claro)] mb-4.5">
            Preparação PASSE · PAS-UEM · PAS-UnB
          </div>
          <h1 className="text-[38px] md:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] mb-5 max-w-[640px]">
            Estude com quem já corrigiu a prova mil vezes.
          </h1>
          <p className="text-base leading-relaxed text-[var(--ink-dim)] max-w-[460px] mb-8">
            Resumos organizados por matéria e por processo seletivo, interligados entre si — liberados assim que você assina, direto no site.
          </p>
          <div className="flex items-center gap-5 flex-wrap">
            <a
              href="#planos"
              className="px-4.5 py-2.5 rounded-lg border border-[var(--acento)] text-[var(--acento)] font-medium text-sm hover:bg-[var(--acento-fraco)] hover:text-[var(--acento-claro)]"
            >
              Ver planos de acesso
            </a>
            <a
              href="#materias"
              className="text-sm underline underline-offset-[3px] decoration-[var(--ink-faint)] hover:decoration-[var(--ink)]"
            >
              Ver matérias disponíveis
            </a>
          </div>
        </div>

        <div className="bg-[var(--raised)] rounded-2xl p-5.5 shadow-[var(--sombra)]">
          <div className="rotulo-secao text-[10px] mb-3.5">Cartão-resposta</div>
          {cartaoResposta.map((row) => (
            <div key={row.num} className="flex items-center gap-3 py-2.5">
              <span className="text-xs text-[var(--ink-faint)] w-[18px]">{row.num}</span>
              <span className="text-[13px] flex-1 text-[#CFD3E5]">{row.label}</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border"
                    style={
                      i === row.filled
                        ? { background: row.cor, borderColor: 'transparent' }
                        : { borderColor: 'var(--line-forte)' }
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </header>

      <section className="bg-[var(--faixa)] py-14">
        <div className="max-w-[1120px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {numeros.map((n) => (
            <div key={n.label}>
              <div className="text-[32px] font-medium text-[var(--faixa-ink)]">{n.valor}</div>
              <div className="text-[13px] text-[var(--faixa-dim)] mt-1">{n.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="materias" className="py-20 max-w-[1120px] mx-auto px-8">
        <div className="max-w-[520px] mb-11">
          <div className="rotulo-secao text-[11px] mb-3">Acervo</div>
          <h2 className="text-[30px] font-medium mb-3">Uma pasta por matéria, dentro de cada processo seletivo.</h2>
          <p className="text-sm text-[var(--ink-dim)]">Filtre por disciplina e pelo vestibular que você está estudando.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line-forte)] rounded-lg overflow-hidden">
          {materiasGrid.map((m) => (
            <div key={m.slug} className="bg-[#1C1F2C] p-5.5 min-h-[140px] flex flex-col justify-between">
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full"
                style={{ background: MATERIAS[m.slug].cor }}
              />
              <div>
                <h3 className="font-medium text-[15px] mb-1.5">{MATERIAS[m.slug].nome}</h3>
                <span className="text-[11.5px] text-[var(--ink-faint)]">{m.processos}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="pb-22 max-w-[1120px] mx-auto px-8">
        <div className="max-w-[520px] mb-11">
          <div className="rotulo-secao text-[11px] mb-3">Planos</div>
          <h2 className="text-[30px] font-medium">Escolha o acesso pelo processo seletivo que você está fazendo.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { nome: 'Acesso PASSE', proc: 'UFMS', destaque: false },
            { nome: 'Acesso Completo', proc: 'PASSE + PAS UEM + PAS UnB', destaque: true },
            { nome: 'Acesso PAS', proc: 'UEM + UnB', destaque: false },
          ].map((p) => (
            <div
              key={p.nome}
              className={`bg-[var(--raised)] rounded-2xl p-7 flex flex-col gap-4.5 ${
                p.destaque
                  ? 'shadow-[0_0_0_1px_var(--acento),0_16px_40px_rgba(0,0,0,0.5)]'
                  : 'shadow-[var(--sombra)]'
              }`}
            >
              {p.destaque && (
                <span className="self-start text-[10px] tracking-[0.08em] uppercase text-[var(--acento)] border border-[var(--acento)] rounded-md px-2 py-0.5">
                  Mais escolhido
                </span>
              )}
              <div>
                <div className="font-medium text-[17px]">{p.nome}</div>
                <div className="text-[11.5px] text-[var(--ink-faint)] mt-0.5">{p.proc}</div>
              </div>
              <div className="text-[30px] font-medium">
                R$ 00<span className="text-[13px] text-[var(--ink-faint)] font-normal">/mês</span>
              </div>
              <Link
                href="/login"
                className={`mt-auto text-center py-2.5 rounded-lg text-[13px] font-medium ${
                  p.destaque
                    ? 'border border-[var(--acento)] text-[var(--acento)] hover:bg-[var(--acento-fraco)]'
                    : 'border border-[var(--line-forte)] hover:bg-[var(--sel)]'
                }`}
              >
                Assinar
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-9 max-w-[1120px] mx-auto px-8 flex justify-between flex-wrap gap-3 shadow-[inset_0_1px_0_var(--line)]">
        <div className="marca font-medium text-[15px]">Plataforma Grafos</div>
        <p className="text-[12.5px] text-[var(--ink-faint)]">Material próprio, revisado por edital · Campo Grande — MS</p>
      </footer>
    </div>
  )
}

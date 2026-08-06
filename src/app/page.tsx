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

export default function LandingPage() {
  return (
    <div>
      <nav className="sticky top-0 z-50 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-[1120px] mx-auto px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-semibold text-[19px]">
            <span className="w-[30px] h-[30px] rounded-full border-[1.5px] border-[var(--stamp)] flex items-center justify-center font-mono-plex text-[11px] text-[var(--stamp)]">MR</span>
            Mestre Ronny
          </div>
          <div className="hidden md:flex gap-9 text-[14.5px] text-[var(--ink-dim)]">
            <a href="#materias" className="hover:text-[var(--ink)]">Matérias</a>
            <a href="#planos" className="hover:text-[var(--ink)]">Planos</a>
          </div>
          <Link href="/login" className="px-5 py-2.5 rounded bg-[var(--stamp)] text-white font-semibold text-sm">Entrar</Link>
        </div>
      </nav>

      <header className="py-22 max-w-[1120px] mx-auto px-8 grid md:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        <div>
          <div className="font-mono-plex text-[12.5px] tracking-widest uppercase text-[var(--stamp)] mb-5 flex items-center gap-2.5">
            <span className="w-[22px] h-px bg-[var(--stamp)]" /> Preparação PASSE · PAS-UEM · PAS-UnB
          </div>
          <h1 className="text-[44px] md:text-[50px] leading-[1.08] font-semibold mb-5">
            Estude com quem já <em className="italic text-[var(--stamp)] font-medium">corrigiu</em> a prova mil vezes.
          </h1>
          <p className="text-[17px] text-[var(--ink-dim)] max-w-[480px] mb-8">
            Resumos organizados por matéria e por processo seletivo, interligados entre si — liberados assim que você assina, direto no site.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            <a href="#planos" className="px-7 py-4 rounded bg-[var(--stamp)] text-white font-bold text-[15px]">Ver planos de acesso</a>
            <a href="#materias" className="text-[14.5px] underline underline-offset-4 decoration-[var(--ink-dim)]">Ver matérias disponíveis</a>
          </div>
        </div>

        <div className="bg-white border border-[var(--line)] rounded-md p-6 shadow-sm">
          <div className="font-mono-plex text-[10.5px] tracking-widest text-[var(--ink-dim)] mb-4">CARTÃO-RESPOSTA</div>
          {cartaoResposta.map((row) => (
            <div key={row.num} className="flex items-center gap-3.5 py-2.5 border-b border-dashed border-[var(--line)] last:border-none">
              <span className="font-mono-plex text-xs text-[var(--ink-dim)] w-5">{row.num}</span>
              <span className="text-[13.5px] flex-1">{row.label}</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-[17px] h-[17px] rounded-full border-[1.4px]"
                    style={
                      i === row.filled
                        ? { background: row.cor, borderColor: 'transparent' }
                        : { borderColor: 'var(--line)' }
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </header>

      <section id="materias" className="py-24 max-w-[1120px] mx-auto px-8">
        <div className="max-w-[560px] mb-14">
          <div className="font-mono-plex text-xs tracking-widest uppercase text-[var(--ink-dim)] mb-3.5">Acervo</div>
          <h2 className="text-[34px] font-semibold mb-3.5">Uma pasta por matéria, dentro de cada processo seletivo.</h2>
          <p className="text-[15.5px] text-[var(--ink-dim)]">Filtre por disciplina e pelo vestibular que você está estudando.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)] rounded-md overflow-hidden">
          {materiasGrid.map((m) => (
            <div key={m.slug} className="bg-white p-6 min-h-[150px] flex flex-col justify-between">
              <div className="w-[26px] h-1 rounded-sm mb-4" style={{ background: MATERIAS[m.slug].cor }} />
              <div>
                <h3 className="font-semibold text-[16px] mb-1.5">{MATERIAS[m.slug].nome}</h3>
                <span className="font-mono-plex text-[12.5px] text-[var(--ink-dim)]">{m.processos}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="py-24 max-w-[1120px] mx-auto px-8">
        <div className="max-w-[560px] mb-14">
          <div className="font-mono-plex text-xs tracking-widest uppercase text-[var(--ink-dim)] mb-3.5">Planos</div>
          <h2 className="text-[34px] font-semibold">Escolha o acesso pelo processo seletivo que você está fazendo.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { nome: 'Acesso PASSE', proc: 'UFMS', destaque: false },
            { nome: 'Acesso Completo', proc: 'PASSE + PAS UEM + PAS UnB', destaque: true },
            { nome: 'Acesso PAS', proc: 'UEM + UnB', destaque: false },
          ].map((p) => (
            <div
              key={p.nome}
              className={`relative bg-white border rounded-md p-8 flex flex-col gap-5 ${p.destaque ? 'border-[var(--stamp)]' : 'border-[var(--line)]'}`}
            >
              {p.destaque && (
                <span className="absolute -top-2.5 left-6 bg-[var(--stamp)] text-white font-mono-plex text-[10px] px-2.5 py-1 rounded font-semibold tracking-wide">
                  MAIS ESCOLHIDO
                </span>
              )}
              <div>
                <div className="font-semibold text-[19px]">{p.nome}</div>
                <div className="font-mono-plex text-[11.5px] text-[var(--ink-dim)]">{p.proc}</div>
              </div>
              <div className="text-[34px] font-semibold">R$ 00<span className="text-sm text-[var(--ink-dim)] font-normal">/mês</span></div>
              <Link
                href="/login"
                className={`mt-auto text-center py-3 rounded text-sm font-semibold ${p.destaque ? 'bg-[var(--stamp)] text-white' : 'border border-[var(--line)]'}`}
              >
                Assinar
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-14 border-t border-[var(--line)] max-w-[1120px] mx-auto px-8 flex justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5 font-semibold">
          <span className="w-[30px] h-[30px] rounded-full border-[1.5px] border-[var(--stamp)] flex items-center justify-center font-mono-plex text-[11px] text-[var(--stamp)]">MR</span>
          Mestre Ronny
        </div>
        <p className="text-[13px] text-[var(--ink-dim)]">Material próprio, revisado por edital · Campo Grande — MS</p>
      </footer>
    </div>
  )
}

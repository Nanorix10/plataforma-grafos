import Link from 'next/link'
import { PROVAS } from '@/lib/processos'
import { Seta } from './Dobra'

/**
 * O fechamento da página — o lugar onde ela pede a conta.
 *
 * **As três provas saem de `lib/processos.ts`, e usam `PROVAS` e não
 * `PROCESSOS`.** A diferença importa: `comum` é um processo para o banco, mas
 * ninguém presta Conteúdo comum, e mostrá-lo aqui faria o aluno procurar um
 * quarto vestibular com esse nome. Quem o distingue é a marca `universal`, e é
 * a mesma regra que a conta do aluno e a tabela de cobertura seguem.
 *
 * **Não há formulário.** A referência fecha com um formulário de contato com
 * seletor de intenção; aqui isso seria um cadastro paralelo ao que já existe
 * em `/login`, com dados que ninguém leria. O botão leva ao cadastro de
 * verdade, e a frase acima dele diz o que acontece depois — que a conta nasce
 * sem acesso e a liberação é feita à mão. Sem essa linha, o caminho natural de
 * quem se cadastra é achar que o site falhou (decisão 1b).
 */

/** Uma linha por prova, com o que o aluno reconhece dela. */
const SOBRE_A_PROVA: Record<string, string> = {
  passe: 'UFMS · seriado, uma etapa por ano do ensino médio',
  'pas-uem': 'Universidade Estadual de Maringá · três etapas',
  'pas-unb': 'Universidade de Brasília · três etapas',
}

export default function Fechamento() {
  return (
    <section
      id="entrar"
      className="py-[var(--ritmo-secao)] envelope"
    >
      <div className="grid gap-6 mb-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">começar</p>
        <h2 className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)]" data-atraso="1">
          qual prova <em>você presta?</em>
        </h2>
        <p className="reveal text-[var(--ink-dim)] max-w-[62ch] leading-relaxed" data-atraso="2">
          crie a conta agora — leva um minuto e não pede cartão. ela nasce sem acesso, e a liberação
          do acervo é feita por nós depois do pagamento.
        </p>
      </div>

      <div className="reveal grid gap-px bg-[var(--line)] border border-[var(--line)] md:grid-cols-3">
        {Object.entries(PROVAS).map(([slug, prova]) => (
          <div key={slug} className="bg-[var(--page)] p-8 grid gap-2.5">
            <b className="font-normal text-[1.375rem] tracking-[0.06em]">{prova.nome}</b>
            <span className="text-[0.85rem] text-[var(--ink-faint)] leading-relaxed">
              {SOBRE_A_PROVA[slug] ?? ''}
            </span>
          </div>
        ))}
      </div>

      <Link href="/login" className="chamada reveal inline-flex items-center gap-6 mt-14 no-underline">
        <span className="rotulo">criar minha conta</span>
        <Seta />
      </Link>
    </section>
  )
}

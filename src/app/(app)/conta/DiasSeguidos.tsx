'use client'

import { useSyncExternalStore } from 'react'

/**
 * Os dias seguidos de estudo e as últimas quatro semanas (decisão 23).
 *
 * **Calcula no navegador**, e é por isso que é componente de cliente: a
 * sequência depende de "hoje", e hoje é o dia no relógio do aluno. O servidor
 * roda em UTC; às 22h em Campo Grande ele já está no dia seguinte, e diria que
 * a sequência de quem estudou hoje "ainda não começou".
 *
 * "Hoje" vem por `useSyncExternalStore`, como o tema (decisão 4b): o servidor
 * não sabe o valor e devolve `null`, e o cliente troca na hidratação sem o
 * `setState` dentro de efeito que o React Compiler recusa.
 *
 * **Não ter estudado hoje ainda não quebra a sequência.** Ela conta até ontem
 * e avisa; quebra só no dia seguinte a um dia vazio. Zerar às 00h01 puniria
 * quem estuda à noite.
 */
export default function DiasSeguidos({ dias }: { dias: string[] }) {
  const hoje = useSyncExternalStore(nuncaMuda, diaLocal, noServidor)

  if (dias.length === 0) {
    return (
      <p className="text-[13px] text-[var(--ink-dim)]">
        Abra um resumo e o primeiro dia começa a contar.
      </p>
    )
  }

  // No servidor e no primeiro quadro, sem "hoje": a forma certa, sem número.
  if (!hoje) {
    return <div className="h-[92px]" aria-hidden="true" />
  }

  const feitos = new Set(dias)
  const ontem = deslocar(hoje, -1)
  const estudouHoje = feitos.has(hoje)

  let sequencia = 0
  for (let d = estudouHoje ? hoje : ontem; feitos.has(d); d = deslocar(d, -1)) sequencia++

  const recorde = maiorSequencia(dias)
  const semanas = Array.from({ length: 28 }, (_, i) => deslocar(hoje, i - 27))
  const nasQuatro = semanas.filter((d) => feitos.has(d)).length

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      <div>
        <p className="text-[26px] font-medium leading-tight tabular-nums">
          {sequencia} <span className="text-[14px] font-normal text-[var(--ink-faint)]">
            {sequencia === 1 ? 'dia seguido' : 'dias seguidos'}
          </span>
        </p>
        <p className="text-[12px] text-[var(--ink-faint)] mt-1">
          {sequencia === 0
            ? 'A sequência zerou. Abra um resumo hoje para começar outra.'
            : estudouHoje
              ? 'Hoje já conta.'
              : 'Abra um resumo hoje para não perder a sequência.'}
          {recorde > sequencia ? ` Seu recorde: ${recorde} dias.` : ''}
        </p>
      </div>

      {/* As quatro semanas terminam HOJE, na última célula — não num domingo:
          o que interessa é "os últimos 28 dias", e alinhar pelo calendário
          deixaria a semana corrente pela metade. */}
      <div
        role="img"
        aria-label={`${nasQuatro} ${nasQuatro === 1 ? 'dia' : 'dias'} com estudo nas últimas quatro semanas`}
        className="grid grid-cols-7 gap-[3px]"
      >
        {semanas.map((d) => (
          <span
            key={d}
            title={formatar(d)}
            className={`w-[12px] h-[12px] rounded-[3px] ${
              feitos.has(d) ? 'bg-[var(--acento)]' : 'bg-[var(--line)]'
            } ${d === hoje ? 'outline outline-1 outline-offset-1 outline-[var(--ink-faint)]' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

const nuncaMuda = () => () => {}
const diaLocal = () => new Date().toLocaleDateString('en-CA')
const noServidor = () => null

/** Soma dias a um `AAAA-MM-DD` em UTC puro — sem fuso, sem horário de verão. */
function deslocar(dia: string, n: number) {
  const [a, m, d] = dia.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10)
}

function maiorSequencia(dias: string[]) {
  const ordenados = [...dias].sort()
  let maior = 0
  let atual = 0
  for (let i = 0; i < ordenados.length; i++) {
    atual = i > 0 && deslocar(ordenados[i - 1], 1) === ordenados[i] ? atual + 1 : 1
    maior = Math.max(maior, atual)
  }
  return maior
}

function formatar(dia: string) {
  const [a, m, d] = dia.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

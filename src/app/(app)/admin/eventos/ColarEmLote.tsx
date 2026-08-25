'use client'

import { useMemo, useState } from 'react'
import { MATERIAS } from '@/lib/materias'
import { analisarLinhaDeEvento, mapearResumos, rotuloDoEvento } from '@/lib/tempo'
import BotaoEnviar from '@/components/BotaoEnviar'
import { salvarEventosEmLote } from './actions'

const EXEMPLO = `1789 | Queda da Bastilha | historia
1453-1492 | Renascimento | História, Arte, Literatura
-500--300 | Grécia clássica | filosofia | séc. V–III a.C.
1840 | Golpe da Maioridade | historia |  | Período regencial (1831–1840)`

/**
 * Cadastro de vários eventos de uma vez.
 *
 * O eixo da linha do tempo nasceu completo e passou a existência inteira com UM
 * evento dentro. Não faltava material: faltava um caminho que não fosse abrir
 * um formulário de sete campos, salvar, e recomeçar — trinta eventos eram
 * trinta idas e voltas, e ninguém faz isso numa tarde.
 *
 * ## Por que o campo é CONTROLADO, ao contrário dos de `/login` e `/conta`
 *
 * Lá os campos são não controlados de propósito, porque o gerenciador de senhas
 * escreve no DOM sem passar pelo React e o estado ficaria para trás. Aqui não
 * há cofre que preencha uma lista de eventos históricos, e existe uma razão
 * positiva para o estado: a pré-visualização precisa reagir a cada tecla. Sem
 * isso, o autor só descobriria o erro de digitação depois de enviar.
 *
 * ## Por que a análise roda duas vezes
 *
 * O que esta tela calcula é a PRÉ-visualização; quem decide é o servidor, que
 * reanalisa o texto bruto com a mesma função. Server action é endereço público,
 * e mandar daqui o JSON já pronto deixaria qualquer um escrever direto na
 * tabela. Como a função é a mesma (`analisarLinhaDeEvento`, no lado puro de
 * `lib/tempo.ts`), os dois lados nunca discordam.
 */
export default function ColarEmLote({
  resumos,
}: {
  resumos: { id: string; titulo: string; slug: string }[]
}) {
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [recado, setRecado] = useState<string | null>(null)

  const porNome = useMemo(() => mapearResumos(resumos), [resumos])
  /** id → título, para a pré-visualização dizer COM QUE o quinto campo casou. */
  const tituloPorId = useMemo(
    () => new Map(resumos.map((r) => [r.id, r.titulo])),
    [resumos]
  )

  /* Cada linha analisada, com o número que o autor vê. As linhas em branco
     somem daqui: elas são respiro no meio de uma lista colada, e numerá-las
     faria o "Linha 7" do erro apontar para o lugar errado — exatamente na hora
     em que a pessoa está procurando o que consertar. */
  const analisadas = useMemo(() => {
    return texto
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((linha, i) => ({ n: i + 1, linha, r: analisarLinhaDeEvento(linha, porNome) }))
  }, [texto, porNome])

  const comErro = analisadas.filter((a) => !a.r.ok).length
  const validas = analisadas.length - comErro

  async function aoEnviar(fd: FormData) {
    setErro(null)
    setRecado(null)
    const r = await salvarEventosEmLote(fd)
    if (!r.ok) return setErro(r.erro)
    setRecado(`${r.quantos} ${r.quantos === 1 ? 'evento criado' : 'eventos criados'}.`)
    setTexto('')
  }

  return (
    <form action={aoEnviar} className="flex flex-col gap-3.5">
      <div>
        <label htmlFor="lote-linhas" className="rotulo block mb-1.5">
          Uma linha por evento
        </label>
        <p id="lote-ajuda" className="text-[11.5px] text-[var(--ink-faint)] mb-2">
          <code className="font-[family-name:var(--fonte-mono)]">
            ano | título | matérias | data escrita | resumo
          </code>
          {' — '}os dois últimos campos são opcionais. O ano aceita <code>1789</code>,{' '}
          <code>-350</code>, <code>350 a.C.</code> e intervalos como{' '}
          <code>1453-1492</code>. As matérias vão separadas por vírgula, pelo nome ou
          pelo slug. O <strong>resumo</strong> é o que explica o evento, pelo título
          exato ou pelo slug — é ele que faz aparecer o link{' '}
          <em>Abrir o resumo</em> na linha do tempo. Para pular a data escrita e
          indicar só o resumo, deixe o quarto campo vazio entre duas barras.
        </p>
        <textarea
          id="lote-linhas"
          name="linhas"
          rows={9}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-describedby="lote-ajuda"
          spellCheck={false}
          placeholder={EXEMPLO}
          className="campo text-sm font-[family-name:var(--fonte-mono)] leading-relaxed"
        />
      </div>

      {/* ---- pré-visualização ---- */}
      {analisadas.length > 0 ? (
        <div>
          <div className="rotulo mb-1.5">
            Conferência
            <span className="ml-2 font-normal text-[var(--ink-faint)]">
              {validas} pronta{validas === 1 ? '' : 's'}
              {comErro > 0 ? ` · ${comErro} com problema` : ''}
            </span>
          </div>

          {/* Rola dentro de si, e não empurra a página: uma lista de quarenta
              eventos colados deixaria o botão de enviar fora do alcance. */}
          <ul className="max-h-[320px] overflow-y-auto flex flex-col gap-px rounded-lg border border-[var(--line)]">
            {analisadas.map(({ n, linha, r }) => (
              <li
                key={n}
                className={`px-3 py-2 text-[12.5px] ${
                  r.ok ? 'bg-[var(--raised)]' : 'bg-[var(--raised)] border-l-2 border-[var(--erro)]'
                }`}
              >
                <span className="text-[var(--ink-faint)] tabular-nums mr-2">{n}</span>
                {r.ok ? (
                  <>
                    <span className="font-medium">{r.evento.titulo}</span>
                    <span className="text-[var(--ink-dim)]">
                      {' · '}
                      {rotuloDoEvento({
                        ano_inicio: r.evento.ano_inicio,
                        ano_fim: r.evento.ano_fim,
                        rotulo_data: r.evento.rotulo_data,
                      })}
                    </span>
                    {/* as cores confirmam que a matéria foi reconhecida: um
                        slug escrito errado nunca chega aqui, mas um slug
                        TROCADO (historia por geografia) chega, e a cor é o que
                        denuncia antes de o evento entrar no banco */}
                    <span className="ml-2 inline-flex gap-1 align-middle">
                      {r.evento.materia_slugs.map((s) => (
                        <span
                          key={s}
                          title={MATERIAS[s as keyof typeof MATERIAS]?.nome ?? s}
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ background: MATERIAS[s as keyof typeof MATERIAS]?.cor }}
                        />
                      ))}
                    </span>
                    {/* o TÍTULO do resumo casado, pelo mesmo motivo das cores
                        acima: um slug inexistente é recusado, mas um slug
                        válido e trocado passa — e ver o nome do que casou é o
                        que denuncia antes de o evento entrar no banco */}
                    {r.evento.resumo_id && (
                      <span className="ml-2 text-[var(--ink-dim)]">
                        {'→ '}
                        {tituloPorId.get(r.evento.resumo_id) ?? r.evento.resumo_id}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-[var(--erro)]">{r.erro}</span>
                    <span className="block mt-0.5 ml-6 text-[var(--ink-faint)] font-[family-name:var(--fonte-mono)] text-[11.5px] break-all">
                      {linha}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="text-[12.5px] text-[var(--ok)] empty:hidden">
        {recado}
      </p>
      {/* `whitespace-pre-line` porque o servidor devolve um erro por linha,
          separados por `\n` — num parágrafo comum eles virariam uma frase só */}
      <p
        role="status"
        aria-live="polite"
        className="text-[12.5px] text-[var(--erro)] whitespace-pre-line empty:hidden"
      >
        {erro}
      </p>

      <div>
        {/* Travado enquanto houver linha ruim: é o "tudo ou nada" da action
            dito na interface. Sem isto o autor enviaria, receberia a lista de
            recusas e teria de descobrir sozinho que nada entrou. */}
        <BotaoEnviar
          carregando="Criando…"
          disabled={validas === 0 || comErro > 0}
          className="botao botao-primario !rounded-lg px-4 py-2 text-[13px]"
        >
          {comErro > 0
            ? `Conserte ${comErro} linha${comErro === 1 ? '' : 's'}`
            : `Criar ${validas} evento${validas === 1 ? '' : 's'}`}
        </BotaoEnviar>
      </div>
    </form>
  )
}

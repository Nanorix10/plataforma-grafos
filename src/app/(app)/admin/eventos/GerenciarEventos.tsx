'use client'

import { useState } from 'react'
import { MATERIAS } from '@/lib/materias'
// idem à linha do tempo: `lib/tempo` é o lado puro, seguro para o cliente
import {
  coresDoEvento,
  corDoRotulo,
  fundoDoMarcador,
  rotuloDoEvento,
  type Evento,
} from '@/lib/tempo'
import { salvarEvento, excluirEvento } from './actions'

type ResumoOpcao = { id: string; titulo: string; materia_slug: string }

/** Campos vazios = formulário de evento novo. */
type Rascunho = {
  id: string
  titulo: string
  ano_inicio: string
  ano_fim: string
  rotulo_data: string
  materia_slugs: string[]
  resumo_id: string
  descricao: string
}

const VAZIO: Rascunho = {
  id: '',
  titulo: '',
  ano_inicio: '',
  ano_fim: '',
  rotulo_data: '',
  materia_slugs: [],
  resumo_id: '',
  descricao: '',
}

function paraRascunho(e: Evento): Rascunho {
  return {
    id: e.id,
    titulo: e.titulo,
    ano_inicio: String(e.ano_inicio),
    ano_fim: e.ano_fim === null ? '' : String(e.ano_fim),
    rotulo_data: e.rotulo_data,
    materia_slugs: e.materia_slugs,
    resumo_id: e.resumo_id ?? '',
    descricao: e.descricao,
  }
}

/**
 * Cadastro dos eventos da linha do tempo.
 *
 * Um formulário só, que serve para criar e para editar — clicar num evento da
 * lista o carrega nos campos. Duas telas separadas dobrariam a marcação para
 * repetir os mesmos oito campos, e o autor cadastra em série: escreve um
 * evento, corrige o anterior, escreve o próximo.
 */
export default function GerenciarEventos({
  eventos,
  resumos,
}: {
  eventos: Evento[]
  resumos: ResumoOpcao[]
}) {
  const [rascunho, setRascunho] = useState<Rascunho>(VAZIO)
  const [erro, setErro] = useState<string | null>(null)
  const [recado, setRecado] = useState<string | null>(null)

  const editando = rascunho.id !== ''

  function campo<K extends keyof Rascunho>(chave: K, valor: Rascunho[K]) {
    setRascunho((r) => ({ ...r, [chave]: valor }))
  }

  async function aoEnviar(fd: FormData) {
    setErro(null)
    setRecado(null)
    const r = await salvarEvento(fd)
    if (!r.ok) return setErro(r.erro)
    setRecado(editando ? 'Evento atualizado.' : 'Evento criado.')
    setRascunho(VAZIO)
  }

  async function aoExcluir(fd: FormData) {
    setErro(null)
    setRecado(null)
    const r = await excluirEvento(fd)
    if (!r.ok) return setErro(r.erro)
    setRecado('Evento excluído.')
    setRascunho(VAZIO)
  }

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
      {/* ---- formulário ---- */}
      <form action={aoEnviar} className="flex flex-col gap-3.5 lg:sticky lg:top-6">
        <input type="hidden" name="id" value={rascunho.id} />

        <div>
          <label htmlFor="ev-titulo" className="rotulo block mb-1.5">
            Evento
          </label>
          <input
            id="ev-titulo"
            name="titulo"
            required
            value={rascunho.titulo}
            onChange={(e) => campo('titulo', e.target.value)}
            placeholder="Queda da Bastilha"
            className="campo"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ev-inicio" className="rotulo block mb-1.5">
              Ano de início
            </label>
            <input
              id="ev-inicio"
              name="ano_inicio"
              required
              value={rascunho.ano_inicio}
              onChange={(e) => campo('ano_inicio', e.target.value)}
              placeholder="1789 ou 350 a.C."
              className="campo"
            />
          </div>
          <div>
            <label htmlFor="ev-fim" className="rotulo block mb-1.5">
              Ano de fim
            </label>
            <input
              id="ev-fim"
              name="ano_fim"
              value={rascunho.ano_fim}
              onChange={(e) => campo('ano_fim', e.target.value)}
              placeholder="vazio = data única"
              className="campo"
            />
          </div>
        </div>
        <p className="text-[11.5px] text-[var(--ink-faint)] -mt-1.5">
          Preenchendo o fim, o evento vira um período e aparece como barra no
          eixo. Antes de Cristo: escreva <code className="font-mono-plex">-350</code> ou{' '}
          <code className="font-mono-plex">350 a.C.</code>
        </p>

        <div>
          <label htmlFor="ev-rotulo" className="rotulo block mb-1.5">
            Como a data aparece <span className="opacity-70">opcional</span>
          </label>
          <input
            id="ev-rotulo"
            name="rotulo_data"
            value={rascunho.rotulo_data}
            onChange={(e) => campo('rotulo_data', e.target.value)}
            placeholder="14/07/1789 · séc. XV · c. 1500"
            className="campo"
          />
          <p className="text-[11.5px] text-[var(--ink-faint)] mt-1">
            Os anos acima posicionam o evento; isto é o que o aluno lê. Vazio,
            a data é escrita a partir dos anos.
          </p>
        </div>

        {/* Matérias: caixas de seleção, não um `<select multiple>`.
            O evento costuma ser de mais de uma — o Renascimento é História,
            Arte, Literatura e Filosofia —, e num `select multiple` isso exige
            segurar Ctrl e mirar, sem mostrar o que já está marcado quando a
            lista rola. Aqui as escolhidas ficam à vista, na cor da matéria. */}
        <fieldset>
          <legend className="rotulo mb-1.5">Matérias</legend>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(MATERIAS).map(([slug, m]) => {
              const marcada = rascunho.materia_slugs.includes(slug)
              return (
                <label
                  key={slug}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] cursor-pointer focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[var(--acento)]"
                  style={{
                    borderColor: marcada ? m.cor : 'var(--line-forte)',
                    color: marcada ? m.cor : 'var(--ink-dim)',
                    background: marcada ? 'var(--acento-fraco)' : undefined,
                  }}
                >
                  {/* a caixa nativa fica invisível mas continua no formulário e
                      acessível pelo teclado — é ela que o `getAll` lê */}
                  <input
                    type="checkbox"
                    name="materia_slugs"
                    value={slug}
                    checked={marcada}
                    onChange={(ev) =>
                      campo(
                        'materia_slugs',
                        ev.target.checked
                          ? [...rascunho.materia_slugs, slug]
                          : rascunho.materia_slugs.filter((s) => s !== slug)
                      )
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: marcada ? m.cor : 'transparent',
                      boxShadow: marcada ? undefined : 'inset 0 0 0 1px var(--ink-faint)',
                    }}
                  />
                  {m.nome}
                </label>
              )
            })}
          </div>
          <p className="text-[11.5px] text-[var(--ink-faint)] mt-1.5">
            Marque quantas quiser. O evento aparece na linha enquanto qualquer
            uma delas estiver ligada, e o marcador sai listrado com as cores de
            todas.
          </p>
        </fieldset>

        <div>
          <label htmlFor="ev-resumo" className="rotulo block mb-1.5">
            Resumo ligado <span className="opacity-70">opcional</span>
          </label>
          <select
            id="ev-resumo"
            name="resumo_id"
            value={rascunho.resumo_id}
            onChange={(e) => campo('resumo_id', e.target.value)}
            className="campo"
          >
            <option value="">— nenhum —</option>
            {resumos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.titulo} ({MATERIAS[r.materia_slug as keyof typeof MATERIAS]?.nome ?? r.materia_slug})
              </option>
            ))}
          </select>
          <p className="text-[11.5px] text-[var(--ink-faint)] mt-1">
            Com resumo, clicar no evento abre a leitura. Sem, ele vive só com a
            descrição — que é o caso de todo evento que você ainda não escreveu.
          </p>
        </div>

        <div>
          <label htmlFor="ev-descricao" className="rotulo block mb-1.5">
            Descrição <span className="opacity-70">opcional</span>
          </label>
          <textarea
            id="ev-descricao"
            name="descricao"
            rows={3}
            value={rascunho.descricao}
            onChange={(e) => campo('descricao', e.target.value)}
            placeholder="Uma ou duas frases — aparece no detalhe embaixo do eixo."
            className="campo resize-y"
          />
        </div>

        <div className="flex gap-2.5 items-center">
          <button type="submit" className="botao botao-primario !rounded-lg px-5 py-2 text-sm">
            {editando ? 'Salvar alterações' : 'Adicionar evento'}
          </button>
          {editando ? (
            <button
              type="button"
              onClick={() => {
                setRascunho(VAZIO)
                setErro(null)
                setRecado(null)
              }}
              className="botao botao-neutro !rounded-lg px-4 py-2 text-sm"
            >
              Cancelar
            </button>
          ) : null}
        </div>

        {/* `aria-live` para o leitor de tela anunciar o resultado: o formulário
            não navega para lugar nenhum ao salvar, então sem isto a única
            confirmação seria visual. */}
        {erro ? (
          <p role="status" aria-live="polite" className="text-[12.5px] text-[var(--erro)] m-0">
            {erro}
          </p>
        ) : null}
        {recado ? (
          <p role="status" aria-live="polite" className="text-[12.5px] text-[var(--ok)] m-0">
            {recado}
          </p>
        ) : null}
      </form>

      {/* ---- lista ---- */}
      <div>
        <div className="rotulo-secao mb-3">
          {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}, em ordem cronológica
        </div>

        {eventos.length === 0 ? (
          <p className="text-[13px] text-[var(--ink-dim)]">
            Nenhum evento ainda. O primeiro que você adicionar já aparece na
            linha do tempo.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {eventos.map((e) => {
              const cores = coresDoEvento(e.materia_slugs)
              const emEdicao = rascunho.id === e.id
              return (
                <li
                  key={e.id}
                  className={`rounded-lg px-3.5 py-2.5 flex items-center gap-3 ${
                    emEdicao ? 'bg-[var(--acento-fraco)]' : 'bg-[var(--raised)]'
                  }`}
                >
                  {/* listrado quando o evento é de várias matérias — o mesmo
                      marcador que aparece no eixo */}
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: fundoDoMarcador(cores) }}
                  />
                  <span className="text-[12px] text-[var(--ink-dim)] tabular-nums shrink-0 w-[104px]">
                    {rotuloDoEvento(e)}
                  </span>
                  <span
                    className="text-[13px] font-medium truncate flex-1 min-w-0"
                    style={{ color: corDoRotulo(cores) }}
                  >
                    {e.titulo}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setRascunho(paraRascunho(e))
                      setErro(null)
                      setRecado(null)
                    }}
                    className="shrink-0 text-[12px] text-[var(--ink-dim)] hover:text-[var(--ink)] rounded px-1.5 py-0.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
                  >
                    Editar
                  </button>

                  <form action={aoExcluir} className="shrink-0">
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      type="submit"
                      aria-label={`Excluir ${e.titulo}`}
                      className="text-[12px] text-[var(--ink-faint)] hover:text-[var(--erro)] rounded px-1.5 py-0.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]"
                    >
                      Excluir
                    </button>
                  </form>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

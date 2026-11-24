'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import {
  compilar,
  EXEMPLOS,
  escreverConfig,
  grafico,
  lerConfig,
  LIMITES,
  NOME_PONTO,
  NOME_VALIDO,
  valoresIniciais,
  type Funcao,
  type Grafico,
  type Ligacao,
  type Objeto,
  type Parametro,
  type Ponto,
  type RotuloPonto,
  type TipoLigacao,
} from '@/lib/grafico/modelo'
import { montarFigura } from '@/lib/grafico/figura'
import { ativarGrafico } from '@/lib/grafico/vivo'
import { enquadrar } from '@/lib/grafico/desenho'
import { nomeLatex } from '@/lib/grafico/expressao'

/**
 * O painel que monta o gráfico interativo (decisão 34).
 *
 * Mesmo lugar e mesmas regras da `BarraFormula`: faixa entre a barra e a
 * folha, Esc fecha, `key` remonta ao trocar de alvo. A prévia à direita é o
 * desenho FINAL — a mesma `montarFigura` do servidor —, com os controles
 * funcionando, para o autor testar o que o aluno vai mexer.
 */

export type AlvoGrafico = { modo: 'novo' } | { modo: 'editar'; pos: number; config: string }

const renderLatex = (tex: string) =>
  katex.renderToString(tex, { throwOnError: false, errorColor: 'var(--erro)', strict: false })

const CAMPO =
  'h-[28px] text-[12.5px] bg-[var(--raised)] text-[var(--ink)] border border-[var(--line)] rounded px-1.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)]'
const BOTAO =
  'text-[12px] px-2.5 py-1 rounded border border-[var(--line)] text-[var(--ink-dim)] hover:bg-[var(--sel)] disabled:opacity-45'
const ROTULO = 'text-[11px] uppercase tracking-[0.04em] text-[var(--ink-faint)]'

const NOMES_FUNCAO = ['f', 'g', 'h', 'p', 'q', 'r', 'u', 'w']

function inicial(alvo: AlvoGrafico): Grafico {
  if (alvo.modo === 'editar') {
    const g = lerConfig(alvo.config)
    if (g) return g
  }
  return grafico({ objetos: [{ tipo: 'funcao', nome: 'f', expr: 'x^2', cor: 1, rotulo: '' }] })
}

/** Campo de número que deixa digitar "-" e "0," no meio do caminho. */
function CampoNumero({
  valor,
  aoMudar,
  rotulo,
  largura = 'w-[64px]',
}: {
  valor: number
  aoMudar: (v: number) => void
  rotulo: string
  largura?: string
}) {
  const formatar = (v: number) => String(v).replace('.', ',')
  const [texto, setTexto] = useState(formatar(valor))
  const [anterior, setAnterior] = useState(valor)
  // valor trocado por fora (Enquadrar, exemplo): o campo acompanha
  if (valor !== anterior) {
    setAnterior(valor)
    setTexto(formatar(valor))
  }
  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={rotulo}
      title={rotulo}
      value={texto}
      onChange={(e) => {
        setTexto(e.target.value)
        const n = Number(e.target.value.replace(',', '.'))
        if (e.target.value.trim() !== '' && Number.isFinite(n)) {
          setAnterior(n)
          aoMudar(n)
        }
      }}
      className={`${CAMPO} ${largura}`}
    />
  )
}

function SeletorCor({ cor, aoMudar }: { cor: number; aoMudar: (c: number) => void }) {
  return (
    <span className="inline-flex gap-0.5" role="radiogroup" aria-label="Cor">
      {Array.from({ length: LIMITES.cores }, (_, i) => i + 1).map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={cor === c}
          aria-label={`Cor ${c}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => aoMudar(c)}
          className={`w-[14px] h-[14px] rounded-full border ${cor === c ? 'border-[var(--ink)] ring-1 ring-[var(--ink)]' : 'border-transparent'}`}
          style={{ background: `var(--grafico-${c})` }}
        />
      ))}
    </span>
  )
}

export default function BarraGrafico({
  alvo,
  aoConfirmar,
  aoRemover,
  aoCancelar,
}: {
  alvo: AlvoGrafico
  aoConfirmar: (config: string) => void
  aoRemover: () => void
  aoCancelar: () => void
}) {
  const [g, setG] = useState<Grafico>(() => inicial(alvo))
  const c = useMemo(() => compilar(g), [g])
  const previa = useRef<HTMLDivElement>(null)

  // A prévia é HTML montado fora do React, pela mesma função do servidor.
  useEffect(() => {
    const caixa = previa.current
    if (!caixa) return
    caixa.innerHTML = montarFigura(g, renderLatex)
    const raiz = caixa.querySelector<HTMLElement>('.grafico')
    return raiz ? ativarGrafico(raiz) : undefined
  }, [g])

  const mudar = (parcial: Partial<Grafico>) => setG((v) => ({ ...v, ...parcial }))
  const mudarObjeto = (i: number, parcial: Partial<Objeto>) =>
    setG((v) => ({ ...v, objetos: v.objetos.map((o, k) => (k === i ? ({ ...o, ...parcial } as Objeto) : o)) }))
  const tirarObjeto = (i: number) => setG((v) => ({ ...v, objetos: v.objetos.filter((_, k) => k !== i) }))
  const mudarParametro = (i: number, parcial: Partial<Parametro>) =>
    setG((v) => ({ ...v, parametros: v.parametros.map((p, k) => (k === i ? { ...p, ...parcial } : p)) }))

  const pontos = g.objetos.filter((o): o is Ponto => o.tipo === 'ponto')
  const nomesUsados = new Set([
    g.variavel,
    ...g.parametros.map((p) => p.nome),
    ...g.objetos.filter((o): o is Funcao => o.tipo === 'funcao').map((f) => f.nome),
  ])
  const cheio = g.objetos.length >= LIMITES.objetos

  function novaFuncao() {
    const nome = NOMES_FUNCAO.find((n) => !nomesUsados.has(n))
    if (!nome) return
    const cor = (g.objetos.filter((o) => o.tipo === 'funcao').length % LIMITES.cores) + 1
    setG((v) => ({ ...v, objetos: [...v.objetos, { tipo: 'funcao', nome, expr: '', cor, rotulo: '' }] }))
  }
  function novoPonto() {
    const nome = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find((l) => !pontos.some((p) => p.nome === l))
    if (!nome) return
    setG((v) => ({ ...v, objetos: [...v.objetos, { tipo: 'ponto', nome, x: '1', y: '1', cor: 2, rotulo: 'nome' }] }))
  }
  function novaLigacao() {
    if (pontos.length < 2) return
    setG((v) => ({
      ...v,
      objetos: [...v.objetos, { tipo: 'segmento', de: pontos[0].nome, ate: pontos[1].nome, cor: 3, rotulo: '' }],
    }))
  }
  function criarControle(nome: string) {
    if (g.parametros.length >= LIMITES.parametros) return
    setG((v) => ({ ...v, parametros: [...v.parametros, { nome, min: -5, max: 5, passo: 0.1, valor: 1 }] }))
  }

  const semObjetos = g.objetos.length === 0
  const bloqueio = semObjetos
    ? 'Acrescente uma função ou um ponto.'
    : c.erros.size
      ? 'Corrija as linhas marcadas em vermelho.'
      : c.faltando.length
        ? `Crie o controle de ${c.faltando.join(', ')} — ou troque a letra.`
        : null

  function confirmar() {
    if (bloqueio) return
    // passa pela MESMA leitura do servidor: o que se grava é o que a página aceita
    const final = lerConfig(escreverConfig(g))
    if (final) aoConfirmar(escreverConfig(final))
  }

  return (
    <div
      className="border-b border-[var(--line)] bg-[var(--panel)] max-h-[60vh] overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return
        e.stopPropagation()
        aoCancelar()
      }}
    >
      <div className="grid gap-4 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ---------- a receita ---------- */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-[var(--ink)]">📈 Gráfico interativo</span>
            <select
              value=""
              onChange={(e) => {
                const ex = EXEMPLOS.find((x) => x.nome === e.target.value)
                if (ex) setG(structuredClone(ex.g))
              }}
              aria-label="Começar de um exemplo"
              className={`${CAMPO} cursor-pointer`}
            >
              <option value="">Começar de um exemplo…</option>
              {EXEMPLOS.map((ex) => (
                <option key={ex.nome} value={ex.nome}>
                  {ex.nome}
                </option>
              ))}
            </select>
          </div>

          {/* objetos */}
          <section className="flex flex-col gap-1.5">
            <span className={ROTULO}>O que desenhar</span>
            {g.objetos.map((o, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {o.tipo === 'funcao' ? (
                    <LinhaFuncao o={o} variavel={g.variavel} aoMudar={(p) => mudarObjeto(i, p)} />
                  ) : o.tipo === 'ponto' ? (
                    <LinhaPonto o={o} aoMudar={(p) => mudarObjeto(i, p)} />
                  ) : (
                    <LinhaLigacao o={o} pontos={pontos} aoMudar={(p) => mudarObjeto(i, p)} />
                  )}
                  <SeletorCor cor={o.cor} aoMudar={(cor) => mudarObjeto(i, { cor })} />
                  <button
                    type="button"
                    onClick={() => tirarObjeto(i)}
                    aria-label="Tirar esta linha"
                    title="Tirar esta linha"
                    className="w-[24px] h-[24px] rounded text-[var(--ink-faint)] hover:text-[var(--stamp)] hover:bg-[var(--sel)]"
                  >
                    ✕
                  </button>
                </div>
                {c.erros.has(i) ? (
                  <span className="text-[11.5px] text-[var(--erro)]" aria-live="polite">
                    {c.erros.get(i)}
                  </span>
                ) : null}
              </div>
            ))}
            <div className="flex gap-1.5 flex-wrap">
              <button type="button" className={BOTAO} onClick={novaFuncao} disabled={cheio}>
                + Função
              </button>
              <button type="button" className={BOTAO} onClick={novoPonto} disabled={cheio}>
                + Ponto
              </button>
              <button
                type="button"
                className={BOTAO}
                onClick={novaLigacao}
                disabled={cheio || pontos.length < 2}
                title={pontos.length < 2 ? 'Crie dois pontos primeiro' : 'Segmento, reta ou vetor entre dois pontos'}
              >
                + Segmento / reta / vetor
              </button>
            </div>
            <p className="text-[11.5px] text-[var(--ink-faint)] leading-snug">
              Escreva como no caderno: <code>ax^2 + bx + c</code>, <code>3sen(x)</code>, <code>raiz(x)</code>,{' '}
              <code>2,5x</code>. Toda letra é uma variável (<code>ax</code> = a·x); índice vai colado:{' '}
              <code>s_0</code>, <code>v0</code>. Um ponto pode usar a função: <code>f(a)</code>.
            </p>
          </section>

          {/* controles */}
          <section className="flex flex-col gap-1.5">
            <span className={ROTULO}>Controles que o aluno mexe</span>
            {g.parametros.map((p, i) => (
              <div key={p.nome} className="flex items-center gap-1.5 flex-wrap text-[12.5px] text-[var(--ink-dim)]">
                <span
                  className="min-w-[2.5em] text-[var(--ink)]"
                  dangerouslySetInnerHTML={{ __html: renderLatex(nomeLatex(p.nome)) }}
                />
                <label className="flex items-center gap-1">
                  de <CampoNumero rotulo={`Mínimo de ${p.nome}`} valor={p.min} aoMudar={(min) => mudarParametro(i, { min })} />
                </label>
                <label className="flex items-center gap-1">
                  até <CampoNumero rotulo={`Máximo de ${p.nome}`} valor={p.max} aoMudar={(max) => mudarParametro(i, { max })} />
                </label>
                <label className="flex items-center gap-1">
                  passo <CampoNumero rotulo={`Passo de ${p.nome}`} valor={p.passo} aoMudar={(passo) => mudarParametro(i, { passo })} largura="w-[52px]" />
                </label>
                <label className="flex items-center gap-1">
                  começa em <CampoNumero rotulo={`Valor inicial de ${p.nome}`} valor={p.valor} aoMudar={(valor) => mudarParametro(i, { valor })} />
                </label>
                <button
                  type="button"
                  onClick={() => setG((v) => ({ ...v, parametros: v.parametros.filter((_, k) => k !== i) }))}
                  aria-label={`Tirar o controle ${p.nome}`}
                  className="w-[24px] h-[24px] rounded text-[var(--ink-faint)] hover:text-[var(--stamp)] hover:bg-[var(--sel)]"
                >
                  ✕
                </button>
                {!(p.max > p.min) ? <span className="text-[11.5px] text-[var(--erro)]">o máximo tem de passar do mínimo</span> : null}
              </div>
            ))}
            {c.faltando.length ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {c.faltando.map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    className={`${BOTAO} border-[var(--acento)] text-[var(--acento)]`}
                    onClick={() => criarControle(nome)}
                    disabled={g.parametros.length >= LIMITES.parametros || !NOME_VALIDO.test(nome)}
                  >
                    + Criar controle {nome}
                  </button>
                ))}
              </div>
            ) : g.parametros.length === 0 ? (
              <p className="text-[11.5px] text-[var(--ink-faint)]">
                Use uma letra na expressão (por exemplo <code>ax</code>) e o botão para criar o controle dela aparece aqui.
              </p>
            ) : null}
          </section>

          {/* janela e eixos */}
          <section className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className={ROTULO}>Janela e eixos</span>
              <button
                type="button"
                className={BOTAO}
                onClick={() => mudar({ janela: enquadrar(c, valoresIniciais(g), g.janela) })}
                title="Ajusta a altura da janela às curvas e aos pontos"
              >
                Enquadrar
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-[12.5px] text-[var(--ink-dim)]">
              <label className="flex items-center gap-1">
                {g.variavel} de <CampoNumero rotulo="Menor valor do eixo horizontal" valor={g.janela.xmin} aoMudar={(xmin) => mudar({ janela: { ...g.janela, xmin } })} />
              </label>
              <label className="flex items-center gap-1">
                até <CampoNumero rotulo="Maior valor do eixo horizontal" valor={g.janela.xmax} aoMudar={(xmax) => mudar({ janela: { ...g.janela, xmax } })} />
              </label>
              <label className="flex items-center gap-1">
                · vertical de <CampoNumero rotulo="Menor valor do eixo vertical" valor={g.janela.ymin} aoMudar={(ymin) => mudar({ janela: { ...g.janela, ymin } })} />
              </label>
              <label className="flex items-center gap-1">
                até <CampoNumero rotulo="Maior valor do eixo vertical" valor={g.janela.ymax} aoMudar={(ymax) => mudar({ janela: { ...g.janela, ymax } })} />
              </label>
            </div>
            {!(g.janela.xmax > g.janela.xmin && g.janela.ymax > g.janela.ymin) ? (
              <span className="text-[11.5px] text-[var(--erro)]">O fim de cada eixo tem de passar do começo.</span>
            ) : null}
            <div className="flex items-center gap-1.5 flex-wrap text-[12.5px] text-[var(--ink-dim)]">
              <label className="flex items-center gap-1" title="A letra do eixo horizontal: x na Matemática, t na Cinemática">
                variável
                <input
                  value={g.variavel}
                  maxLength={4}
                  onChange={(e) => {
                    const v = e.target.value.trim()
                    if (NOME_VALIDO.test(v)) mudar({ variavel: v })
                  }}
                  className={`${CAMPO} w-[44px]`}
                  aria-label="Variável do eixo horizontal"
                />
              </label>
              <label className="flex items-center gap-1">
                nome do eixo horizontal
                <input
                  value={g.eixoX}
                  maxLength={LIMITES.rotulo}
                  placeholder={g.variavel}
                  onChange={(e) => mudar({ eixoX: e.target.value })}
                  className={`${CAMPO} w-[80px]`}
                />
              </label>
              <label className="flex items-center gap-1">
                vertical
                <input
                  value={g.eixoY}
                  maxLength={LIMITES.rotulo}
                  placeholder="y"
                  onChange={(e) => mudar({ eixoY: e.target.value })}
                  className={`${CAMPO} w-[80px]`}
                />
              </label>
              <label className="flex items-center gap-1">
                altura
                <CampoNumero rotulo="Altura do gráfico em pixels" valor={g.altura} aoMudar={(altura) => mudar({ altura })} largura="w-[56px]" />
                px
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={g.grade} onChange={(e) => mudar({ grade: e.target.checked })} />
                grade
              </label>
            </div>
          </section>

          {/* título e legenda */}
          <section className="flex flex-col gap-1.5">
            <span className={ROTULO}>Título e legenda (opcionais)</span>
            <input
              value={g.titulo}
              maxLength={LIMITES.texto}
              placeholder="Título — ex.: O que o “a” faz com a parábola"
              onChange={(e) => mudar({ titulo: e.target.value })}
              className={`${CAMPO} w-full`}
              aria-label="Título do gráfico"
            />
            <input
              value={g.legenda}
              maxLength={LIMITES.texto}
              placeholder="Legenda — ex.: Arraste o a e veja a concavidade virar"
              onChange={(e) => mudar({ legenda: e.target.value })}
              className={`${CAMPO} w-full`}
              aria-label="Legenda do gráfico"
            />
          </section>
        </div>

        {/* ---------- a prévia: o desenho final ---------- */}
        <div className="min-w-0">
          <span className={ROTULO}>Como o aluno vê</span>
          <div ref={previa} className="conteudo-resumo grafico-previa mt-1.5" />
        </div>
      </div>

      <div className="px-3 pb-2.5 flex items-center gap-2 flex-wrap">
        {bloqueio ? (
          <span className="text-[12px] text-[var(--ink-dim)]" aria-live="polite">
            {bloqueio}
          </span>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {alvo.modo === 'editar' ? (
            <button
              type="button"
              onClick={aoRemover}
              className="text-[12px] px-3 py-1.5 rounded border border-[var(--line)] text-[var(--ink-dim)] hover:text-[var(--stamp)] hover:border-[var(--stamp)]"
            >
              Remover
            </button>
          ) : null}
          <button
            type="button"
            onClick={aoCancelar}
            className="text-[12px] px-3 py-1.5 rounded border border-[var(--line)] text-[var(--ink-dim)] hover:bg-[var(--sel)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={!!bloqueio}
            className="text-[12px] font-semibold px-4 py-1.5 rounded botao-primario disabled:opacity-45"
          >
            {alvo.modo === 'editar' ? 'Atualizar' : 'Inserir'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * O nome enquanto se digita, que pode estar inválido no meio do caminho (o
 * campo vazio antes da letra nova). Só o nome válido sobe para a receita; se a
 * receita trocar o nome por fora — a linha de cima foi tirada e esta herdou o
 * lugar —, o campo acompanha.
 */
function useNomeDigitado(valor: string) {
  const [texto, setTexto] = useState(valor)
  const [anterior, setAnterior] = useState(valor)
  if (valor !== anterior) {
    setAnterior(valor)
    setTexto(valor)
  }
  return {
    texto,
    digitar: (t: string) => {
      setTexto(t)
      setAnterior((a) => (NOME_PONTO.test(t) || NOME_VALIDO.test(t) ? t : a))
    },
  }
}

function LinhaFuncao({ o, variavel, aoMudar }: { o: Funcao; variavel: string; aoMudar: (p: Partial<Funcao>) => void }) {
  const nome = useNomeDigitado(o.nome)
  return (
    <>
      <input
        value={nome.texto}
        maxLength={4}
        onChange={(e) => {
          nome.digitar(e.target.value)
          if (NOME_VALIDO.test(e.target.value)) aoMudar({ nome: e.target.value })
        }}
        className={`${CAMPO} w-[36px] text-center`}
        aria-label="Nome da função"
        title="Nome da função"
      />
      <span className="text-[12.5px] text-[var(--ink-dim)]">({variavel}) =</span>
      <input
        value={o.expr}
        onChange={(e) => aoMudar({ expr: e.target.value })}
        placeholder="ax^2 + bx + c"
        spellCheck={false}
        className={`${CAMPO} flex-1 min-w-[140px] font-[family-name:var(--fonte-mono)]`}
        aria-label={`Expressão de ${o.nome}`}
      />
      <input
        value={o.rotulo}
        maxLength={LIMITES.rotulo}
        onChange={(e) => aoMudar({ rotulo: e.target.value })}
        placeholder="rótulo"
        className={`${CAMPO} w-[90px]`}
        aria-label={`Rótulo de ${o.nome} na legenda`}
      />
    </>
  )
}

function LinhaPonto({ o, aoMudar }: { o: Ponto; aoMudar: (p: Partial<Ponto>) => void }) {
  const nome = useNomeDigitado(o.nome)
  return (
    <>
      <input
        value={nome.texto}
        maxLength={4}
        onChange={(e) => {
          nome.digitar(e.target.value)
          if (NOME_PONTO.test(e.target.value)) aoMudar({ nome: e.target.value })
        }}
        className={`${CAMPO} w-[36px] text-center`}
        aria-label="Nome do ponto (letra maiúscula)"
        title="Nome do ponto (letra maiúscula)"
      />
      <span className="text-[12.5px] text-[var(--ink-dim)]">= (</span>
      <input
        value={o.x}
        onChange={(e) => aoMudar({ x: e.target.value })}
        spellCheck={false}
        className={`${CAMPO} w-[84px] font-[family-name:var(--fonte-mono)]`}
        aria-label={`Coordenada horizontal de ${o.nome}`}
      />
      <span className="text-[12.5px] text-[var(--ink-dim)]">;</span>
      <input
        value={o.y}
        onChange={(e) => aoMudar({ y: e.target.value })}
        spellCheck={false}
        className={`${CAMPO} w-[84px] font-[family-name:var(--fonte-mono)]`}
        aria-label={`Coordenada vertical de ${o.nome}`}
      />
      <span className="text-[12.5px] text-[var(--ink-dim)]">)</span>
      <select
        value={o.rotulo}
        onChange={(e) => aoMudar({ rotulo: e.target.value as RotuloPonto })}
        className={`${CAMPO} cursor-pointer`}
        aria-label={`O que aparece ao lado de ${o.nome}`}
      >
        <option value="nome">mostra o nome</option>
        <option value="coordenadas">nome e coordenadas</option>
        <option value="nada">sem rótulo</option>
        <option value="oculto">escondido (só apoio)</option>
      </select>
    </>
  )
}

function LinhaLigacao({ o, pontos, aoMudar }: { o: Ligacao; pontos: Ponto[]; aoMudar: (p: Partial<Ligacao>) => void }) {
  const opcoes = pontos.map((p) => (
    <option key={p.nome} value={p.nome}>
      {p.nome}
    </option>
  ))
  return (
    <>
      <select
        value={o.tipo}
        onChange={(e) => aoMudar({ tipo: e.target.value as TipoLigacao })}
        className={`${CAMPO} cursor-pointer`}
        aria-label="Tipo de linha"
      >
        <option value="segmento">segmento</option>
        <option value="reta">reta</option>
        <option value="vetor">vetor</option>
      </select>
      <span className="text-[12.5px] text-[var(--ink-dim)]">de</span>
      <select value={o.de} onChange={(e) => aoMudar({ de: e.target.value })} className={`${CAMPO} cursor-pointer`} aria-label="Ponto de partida">
        {opcoes}
        {!pontos.some((p) => p.nome === o.de) ? <option value={o.de}>{o.de}?</option> : null}
      </select>
      <span className="text-[12.5px] text-[var(--ink-dim)]">até</span>
      <select value={o.ate} onChange={(e) => aoMudar({ ate: e.target.value })} className={`${CAMPO} cursor-pointer`} aria-label="Ponto de chegada">
        {opcoes}
        {!pontos.some((p) => p.nome === o.ate) ? <option value={o.ate}>{o.ate}?</option> : null}
      </select>
      <input
        value={o.rotulo}
        maxLength={LIMITES.rotulo}
        onChange={(e) => aoMudar({ rotulo: e.target.value })}
        placeholder="rótulo"
        className={`${CAMPO} w-[80px]`}
        aria-label="Rótulo da linha"
      />
    </>
  )
}

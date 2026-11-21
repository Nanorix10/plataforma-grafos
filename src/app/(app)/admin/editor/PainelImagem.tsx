'use client'

import { useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { lerNatural, lerRecorte, naFaixa, naMargem, TAMANHOS, tamanhoDe } from './imagem'
import { enviarImagem } from './actions'
import { otimizarImagem } from './otimizarImagem'

/**
 * O painel da imagem selecionada: uma linha só (decisão 33).
 *
 * Legenda, os três tamanhos, recortar, trocar e remover. Nada mais.
 *
 * Por que tão pouco: o painel anterior tinha mais de trinta controles (oito
 * modos de quebra de texto, alinhamento, larguras livres, giro, borda, filtros
 * de cor, link, rótulo...). Contados no acervo em 21/11/2026, das 304 figuras
 * NENHUMA usava giro, borda, filtro, link, altura ou espaço, e 300 estavam em
 * bloco. Eram botões que só serviam para o autor errar sem querer.
 *
 * Os atributos continuam existindo em `imagem.ts`: o HTML gravado com eles
 * segue saindo igual na página do aluno. Só não há mais botão para criá-los.
 * Voltar um deles é acrescentar um botão aqui, sem tocar no que está gravado.
 */

function Botao({
  ativo = false,
  perigo = false,
  onClick,
  title,
  children,
}: {
  ativo?: boolean
  perigo?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={ativo}
      className={`h-[30px] px-2.5 rounded text-[12.5px] border focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'border-[var(--acento)] text-[var(--acento)] bg-[var(--acento-fraco)]'
          : perigo
            ? 'border-transparent text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--erro)]'
            : 'border-transparent text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </button>
  )
}

/** Em palavras, o que uma figura antiga tem de diferente dos três tamanhos. */
function formatoAntigo(a: Record<string, unknown>): string {
  if (naFaixa(a.quebra as string)) return 'fica na faixa ao lado da folha'
  if (naMargem(a.quebra as string)) return 'fica na margem da folha'
  if (a.quebra === 'emLinha') return 'anda no meio da frase'
  if (String(a.quebra ?? '').startsWith('aoRedor')) return 'tem o texto contornando'
  if (a.largura && a.largura !== '100%') return `usa a largura ${a.largura}`
  return 'usa um ajuste antigo'
}

export default function PainelImagem({
  editor,
  aoEnviarErro,
  aoMudarEnvio,
  recortando,
  aoRecortar,
}: {
  editor: Editor
  aoEnviarErro: (erro: string | null) => void
  aoMudarEnvio: (delta: number) => void
  /* O modo de recorte vive no `EditorCorpo` porque duas telas o leem: este
     painel, que o liga, e a sobreposição de alças, que muda de função. */
  recortando: boolean
  aoRecortar: (ligado: boolean) => void
}) {
  const trocaRef = useRef<HTMLInputElement>(null)
  const a = editor.getAttributes('image')

  const set = (attrs: Record<string, unknown>) =>
    editor.chain().focus().updateAttributes('image', attrs).run()

  const tamanho = tamanhoDe(a)
  const semLegenda = !String(a.alt ?? '').trim() && !a.legenda
  const temRecorte = lerRecorte(a.recorte) !== null

  /* Sem a proporção do arquivo não há como saber a altura do que sobrou. O
     editor grava esse dado assim que a imagem carrega, então isto é falso por
     um instante numa imagem antiga — e o botão diz o motivo em vez de sumir. */
  const podeRecortar = lerNatural(a.natural) !== null && !a.rotacao
  const motivoSemRecorte = !lerNatural(a.natural)
    ? 'Ainda lendo o tamanho original desta imagem. Um instante e o recorte libera.'
    : 'Esta imagem está girada, e o recorte sairia torto.'

  /* Escolher um tamanho também PADRONIZA a figura: volta para o bloco
     centralizado, sem altura fixa. É o caminho de saída das figuras antigas. */
  const escolherTamanho = (attrs: Record<string, unknown>) =>
    set({ quebra: 'bloco', alinhamento: 'centro', altura: '', ...attrs })

  async function trocarArquivo(arquivo: File) {
    aoEnviarErro(null)
    aoMudarEnvio(1)
    try {
      const otimizado = await otimizarImagem(arquivo)
      const fd = new FormData()
      fd.append('arquivo', otimizado)
      const r = await enviarImagem(fd)
      if (!r.ok) {
        aoEnviarErro(r.erro)
        return
      }
      // troca o `src` e a proporção; legenda e tamanho ficam. A proporção TEM
      // de vir junto: com a do arquivo antigo, o espaço reservado e o recorte
      // sairiam com a forma da imagem anterior.
      let natural = ''
      try {
        const bmp = await createImageBitmap(otimizado)
        natural = `${bmp.width} ${bmp.height}`
        bmp.close()
      } catch {}
      set({ src: r.url, natural, recorte: '' })
    } finally {
      aoMudarEnvio(-1)
    }
  }

  return (
    <div className="px-3 py-2 border-b border-[var(--line)] bg-[var(--panel)]">
      <div className="flex items-center gap-2 flex-wrap">
        {/* A legenda vem primeiro e larga porque é o que o aluno LÊ (sai sob a
            imagem, com o número da figura), e fica vermelha enquanto vazia. */}
        <input
          value={a.alt ?? ''}
          onChange={(e) => set({ alt: e.target.value })}
          placeholder="Legenda: o que a figura mostra"
          aria-label="Legenda da figura"
          aria-invalid={semLegenda}
          title="Sai sob a imagem na página do aluno, com o número da figura, e é lida pelo leitor de tela."
          className={`campo h-[32px] flex-1 min-w-[220px] !py-0 !px-2.5 text-[13px] ${
            semLegenda ? '!border-[var(--erro)]' : ''
          }`}
        />

        <div role="group" aria-label="Tamanho" className="inline-flex gap-0.5 p-0.5 rounded-md bg-[var(--raised)]">
          {TAMANHOS.map((t) => (
            <Botao key={t.id} ativo={tamanho === t.id} onClick={() => escolherTamanho(t.attrs)} title={t.dica}>
              {t.rotulo}
            </Botao>
          ))}
        </div>

        <div className="inline-flex gap-0.5">
          <Botao
            ativo={recortando}
            onClick={() => (podeRecortar ? aoRecortar(!recortando) : undefined)}
            title={
              podeRecortar
                ? 'Puxe as bordas para dentro. O que sair fica escondido, não apagado: o arquivo continua inteiro.'
                : motivoSemRecorte
            }
          >
            <span className={podeRecortar ? undefined : 'opacity-45'}>
              {recortando ? '⛶ Concluir' : '⛶ Recortar'}
            </span>
          </Botao>
          {temRecorte ? (
            <Botao
              onClick={() => {
                set({ recorte: '' })
                aoRecortar(false)
              }}
              title="Desfaz o recorte e volta à imagem inteira"
            >
              ↺ Imagem inteira
            </Botao>
          ) : null}
          <Botao onClick={() => trocaRef.current?.click()} title="Trocar o arquivo, mantendo a legenda e o tamanho">
            ⇄ Trocar
          </Botao>
          <Botao
            perigo
            onClick={() => editor.chain().focus().deleteSelection().run()}
            title="Tirar a imagem do resumo (Ctrl+Z desfaz)"
          >
            ✕ Remover
          </Botao>
        </div>

        <input
          ref={trocaRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void trocarArquivo(f)
            e.target.value = ''
          }}
        />
      </div>

      {/* Figura de antes da decisão 33: continua saindo como foi gravada, e o
          aviso diz o que ela tem e qual é a saída, numa linha. */}
      {tamanho === null ? (
        <p role="status" className="mt-1.5 text-[12px] text-[var(--stamp)] leading-snug">
          Esta figura {formatoAntigo(a)}, um formato antigo. Escolha Estreita, Coluna ou Larga para padronizar.
        </p>
      ) : null}
    </div>
  )
}

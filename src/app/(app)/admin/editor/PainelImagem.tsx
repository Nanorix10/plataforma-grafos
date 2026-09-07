'use client'

import { useRef } from 'react'
import type { Editor } from '@tiptap/react'
import {
  LARGURA_MINIMA_LATERAL,
  LARGURAS,
  lerNatural,
  lerRecorte,
  MARGEM_LATERAL_CONFORTAVEL,
  naMargem,
  VAO_LATERAL,
} from './imagem'
import { COLUNA_MINIMA, LARGURA_PAGINA } from '@/lib/pagina'
import { enviarImagem } from './actions'

/**
 * O painel de opções da imagem — o equivalente ao "Opções da imagem" do Google
 * Docs, que lá abre numa coluna à direita.
 *
 * Aqui ele abre embaixo da barra de ferramentas, e não numa coluna lateral: a
 * folha do editor já disputa a largura com a barra do site, e uma terceira
 * coluna espremeria justamente o que o autor está tentando enxergar.
 *
 * Só aparece com uma imagem selecionada. Fora disso seria um painel de
 * controles sem alvo.
 */

function Campo({
  rotulo,
  children,
}: {
  rotulo: string
  children: React.ReactNode
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] text-[var(--ink-dim)] shrink-0">
      {rotulo}
      {children}
    </label>
  )
}

function Numerico({
  valor,
  aoMudar,
  min,
  max,
  sufixo,
  largura = 52,
}: {
  valor: number
  aoMudar: (n: number) => void
  min: number
  max: number
  sufixo?: string
  largura?: number
}) {
  return (
    <span className="inline-flex items-center">
      <input
        type="number"
        min={min}
        max={max}
        value={valor}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n) && n >= min && n <= max) aoMudar(n)
        }}
        className="campo h-[26px] !py-0 !px-1.5 text-[11.5px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
        style={{ width: largura }}
      />
      {sufixo ? <span className="ml-0.5 opacity-60">{sufixo}</span> : null}
    </span>
  )
}

function Grupo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap px-2.5 py-1.5 rounded-md bg-[var(--raised)]">
      {children}
    </div>
  )
}

function Opcao({
  ativo,
  onClick,
  title,
  children,
}: {
  ativo: boolean
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
      className={`h-[26px] px-2 rounded text-[11.5px] border focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--acento)] ${
        ativo
          ? 'border-[var(--acento)] text-[var(--acento)] bg-[var(--acento-fraco)]'
          : 'border-transparent text-[var(--ink-dim)] hover:bg-[var(--sel)] hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </button>
  )
}

export default function PainelImagem({
  editor,
  aoEnviarErro,
  aoMudarEnvio,
  margemEsq,
  margemDir,
  aoMudarMargens,
  recortando,
  aoRecortar,
}: {
  editor: Editor
  aoEnviarErro: (erro: string | null) => void
  aoMudarEnvio: (delta: number) => void
  /* As margens da régua chegam aqui para saber se ainda sobra largura útil
     quando a figura vai para a lateral — e, desde que o aviso ganhou botão,
     para poder alargá-la sem mandar o autor procurar a régua. */
  margemEsq: number
  margemDir: number
  /** A mesma função que a régua chama ao ser arrastada. */
  aoMudarMargens: (esq: number, dir: number) => void
  /* O modo de recorte vive no `EditorCorpo` porque duas telas o leem: este
     painel, que o liga, e a sobreposição de alças, que muda de função. */
  recortando: boolean
  aoRecortar: (ligado: boolean) => void
}) {
  const trocaRef = useRef<HTMLInputElement>(null)
  const a = editor.getAttributes('image')

  const set = (attrs: Record<string, unknown>) =>
    editor.chain().focus().updateAttributes('image', attrs).run()

  const lateral = naMargem(a.quebra)

  /** Largura que sobra na margem escolhida, já descontado o vão até o texto. */
  const larguraDaLateral =
    (a.quebra === 'margemEsq' ? margemEsq : margemDir) - VAO_LATERAL

  /* ---- alargar a margem sem sair do painel ----
     O aviso antigo dizia "arraste a régua" e parava aí. Era um diagnóstico
     mandando o autor executar o remédio à mão, num controle que fica na outra
     ponta da tela — e a régua é justamente o gesto que ninguém acerta de
     primeira, porque mover uma margem mexe na coluna inteira.

     O alvo não é `MARGEM_LATERAL_CONFORTAVEL` cru: `ajustarMargens` apararia o
     excesso dos DOIS lados proporcionalmente, e a margem oposta se mexeria sem
     ninguém ter pedido. Então o teto é calculado aqui, contra a margem oposta,
     e o que chega à régua já cabe. */
  const margemOposta = a.quebra === 'margemEsq' ? margemDir : margemEsq
  const alvoDaMargem = Math.min(
    MARGEM_LATERAL_CONFORTAVEL,
    LARGURA_PAGINA - margemOposta - COLUNA_MINIMA
  )
  /** Só oferece o botão quando ele tem o que fazer. */
  const podeAlargar =
    lateral && alvoDaMargem > (a.quebra === 'margemEsq' ? margemEsq : margemDir)

  const alargarMargem = () =>
    a.quebra === 'margemEsq'
      ? aoMudarMargens(alvoDaMargem, margemDir)
      : aoMudarMargens(margemEsq, alvoDaMargem)

  /* Ir para a lateral DESLIGA o `escapa`: um faz a figura comer as duas
     margens, o outro a faz morar dentro de uma. Deixar os dois ligados daria um
     desenho que depende da ordem das regras de CSS. O `renderHTML` tem a mesma
     trava, para o HTML gravado antes desta tela existir. */
  const irParaMargem = (lado: 'margemEsq' | 'margemDir') =>
    set({ quebra: lado, escapa: false })

  const temRecorte = lerRecorte(a.recorte) !== null
  /* Sem a proporção do arquivo não há como saber a altura do que sobrou. O
     editor grava esse dado assim que a imagem carrega, então isto é falso por
     um instante numa imagem antiga — e o botão diz o motivo em vez de sumir. */
  const podeRecortar = lerNatural(a.natural) !== null && !a.rotacao

  const motivoSemRecorte = !lerNatural(a.natural)
    ? 'Ainda lendo o tamanho original desta imagem. Um instante e o recorte libera.'
    : 'Zere o giro para recortar — as alças mediriam a caixa girada, e o corte sairia torto. Girar DEPOIS de recortar funciona.'

  /** Volta tudo ao estado de imagem recém-inserida, menos o arquivo em si. */
  function redefinir() {
    set({
      largura: '100%',
      altura: '',
      rotacao: 0,
      quebra: 'bloco',
      alinhamento: 'centro',
      escapa: false,
      margem: 0,
      bordaLargura: 0,
      brilho: 100,
      contraste: 100,
      saturacao: 100,
      opacidade: 100,
      recolorir: 'nenhum',
      recorte: '',
    })
  }

  async function trocarArquivo(arquivo: File) {
    aoEnviarErro(null)
    aoMudarEnvio(1)
    try {
      const fd = new FormData()
      fd.append('arquivo', arquivo)
      const r = await enviarImagem(fd)
      // troca só o `src`: tamanho, borda e ajustes ficam, que é o ponto de
      // "substituir imagem" em vez de apagar e inserir outra
      if (r.ok) set({ src: r.url })
      else aoEnviarErro(r.erro)
    } finally {
      aoMudarEnvio(-1)
    }
  }

  return (
    <div className="flex items-start gap-2 flex-wrap px-3 py-2 border-b border-[var(--line)] bg-[var(--panel)]">
      <span className="text-[11px] font-medium text-[var(--ink-faint)] uppercase tracking-[0.08em] mt-1.5 shrink-0">
        Imagem
      </span>

      {/* ---- quebra de texto ----
          É a decisão que mais muda o desenho, então vem primeiro.
          "Atrás do texto" e "à frente do texto" do Docs NÃO existem aqui, e não
          por esquecimento: os dois exigem posição absoluta por cima do texto,
          que depende de a página ter largura fixa. O resumo é uma coluna que
          muda de largura com a régua e com o tamanho da tela — a imagem
          flutuante cairia em cima da frase errada em metade dos aparelhos. */}
      <Grupo>
        <Opcao ativo={a.quebra === 'bloco'} onClick={() => set({ quebra: 'bloco' })} title="A imagem ocupa a linha inteira, com o texto acima e abaixo">
          ▭ Quebrar texto
        </Opcao>
        <Opcao ativo={a.quebra === 'emLinha'} onClick={() => set({ quebra: 'emLinha' })} title="A imagem anda no meio da frase, como se fosse uma letra">
          ⏤ Em linha
        </Opcao>
        <Opcao ativo={a.quebra === 'aoRedorEsq'} onClick={() => set({ quebra: 'aoRedorEsq' })} title="O texto contorna a imagem pela direita">
          ◧ Texto à direita
        </Opcao>
        <Opcao ativo={a.quebra === 'aoRedorDir'} onClick={() => set({ quebra: 'aoRedorDir' })} title="O texto contorna a imagem pela esquerda">
          ◨ Texto à esquerda
        </Opcao>
        {/* Os dois modos laterais. **O nome muda de eixo aqui**: os rótulos
            acima dizem onde fica o TEXTO ("Texto à direita"), porque é ele que
            se deforma; estes dizem onde fica a FIGURA, porque o texto não se
            mexe — não há lado de texto a nomear. */}
        <Opcao ativo={a.quebra === 'margemEsq'} onClick={() => irParaMargem('margemEsq')} title="A imagem sai da coluna e vai para a margem esquerda da folha; o texto não muda de largura">
          ◐ Margem esquerda
        </Opcao>
        <Opcao ativo={a.quebra === 'margemDir'} onClick={() => irParaMargem('margemDir')} title="A imagem sai da coluna e vai para a margem direita da folha; o texto não muda de largura">
          ◑ Margem direita
        </Opcao>
      </Grupo>

      {/* ---- posição ----
          Some inteiro no modo lateral: `alinhamento` só tem regra de CSS sob
          `[data-quebra='bloco']`, e "Sair da margem" é o oposto exato de morar
          dentro dela. Controle inerte na tela é pior que controle ausente —
          quem clica e não vê nada acontecer conclui que a tela quebrou. */}
      {lateral ? null : (
        <Grupo>
          <Opcao ativo={a.alinhamento === 'esquerda'} onClick={() => set({ alinhamento: 'esquerda' })} title="Alinhar à esquerda">⇤</Opcao>
          <Opcao ativo={a.alinhamento === 'centro'} onClick={() => set({ alinhamento: 'centro' })} title="Centralizar">⇔</Opcao>
          <Opcao ativo={a.alinhamento === 'direita'} onClick={() => set({ alinhamento: 'direita' })} title="Alinhar à direita">⇥</Opcao>
          <Opcao ativo={a.escapa === true} onClick={() => set({ escapa: !a.escapa })} title="A imagem passa das margens e ocupa a folha inteira">
            ⤢ Sair da margem
          </Opcao>
        </Grupo>
      )}

      {/* O `max-width` do CSS impede a figura de sair da folha e só isso: numa
          margem estreita ela vira um selo ilegível, e o aluno recebe isso como
          se fosse intenção. O aviso nomeia o gesto que resolve. */}
      {lateral && larguraDaLateral < LARGURA_MINIMA_LATERAL ? (
        <div role="status" className="w-full flex items-center gap-2 flex-wrap text-[11.5px] text-[var(--stamp)] leading-snug">
          <span>
            A margem {a.quebra === 'margemEsq' ? 'esquerda' : 'direita'} tem{' '}
            {Math.max(0, larguraDaLateral)}px úteis — a figura não passa disso, e
            nesse tamanho um gráfico deixa de se ler.
          </span>
          {podeAlargar ? (
            <Opcao
              ativo={false}
              onClick={alargarMargem}
              title={`Leva a margem para ${alvoDaMargem}px e a figura para ${alvoDaMargem - VAO_LATERAL}px. Mexe na régua da folha inteira, então o texto reflui — a régua desfaz.`}
            >
              ⇥ Alargar para {alvoDaMargem - VAO_LATERAL}px
            </Opcao>
          ) : null}
          {/* A outra saída, e às vezes a certa: "texto ao redor" põe a figura
              DENTRO da coluna, com até 60% dela (372px na régua padrão), ao
              preço de o parágrafo se deformar em volta. É mais largura do que
              qualquer margem dá sem estreitar a leitura. */}
          <Opcao
            ativo={false}
            onClick={() => set({ quebra: a.quebra === 'margemEsq' ? 'aoRedorEsq' : 'aoRedorDir' })}
            title="A figura volta para dentro da coluna e o texto a contorna. Cabe bem mais (até 60% da coluna), mas o parágrafo muda de forma."
          >
            {a.quebra === 'margemEsq' ? '◧' : '◨'} Ou deixe o texto contornar
          </Opcao>
        </div>
      ) : null}

      {/* ---- tamanho ---- */}
      <Grupo>
        {LARGURAS.map((l) => (
          <Opcao key={l} ativo={a.largura === `${l}%`} onClick={() => set({ largura: `${l}%`, altura: '' })} title={`${l}% da coluna`}>
            {l}%
          </Opcao>
        ))}
        <Campo rotulo="larg.">
          <input
            value={a.largura ?? ''}
            onChange={(e) => set({ largura: e.target.value })}
            title="Largura em qualquer medida CSS: 340px, 60%, 20rem"
            className="campo h-[26px] w-[66px] !py-0 !px-1.5 text-[11.5px]"
          />
        </Campo>
        <Campo rotulo="alt.">
          <input
            value={a.altura ?? ''}
            onChange={(e) => set({ altura: e.target.value })}
            placeholder="auto"
            disabled={temRecorte}
            title={
              temRecorte
                ? 'Desligado porque a imagem está recortada: os dois cortam, e o recorte manda.'
                : 'Vazio mantém a proporção original. Com valor, a imagem é cortada para caber (object-fit: cover).'
            }
            className="campo h-[26px] w-[66px] !py-0 !px-1.5 text-[11.5px] disabled:opacity-45"
          />
        </Campo>

        {/* ---- recorte ----
            A 11c recusava recorte porque ele "pede interface própria". O
            argumento não caiu; o custo caiu: a sobreposição de alças já existe,
            e aqui ela só troca de função. */}
        <Opcao
          ativo={recortando}
          onClick={() => (podeRecortar ? aoRecortar(!recortando) : undefined)}
          title={
            podeRecortar
              ? 'Puxe as bordas para dentro. O que sair fica escondido, não apagado — o arquivo continua inteiro.'
              : motivoSemRecorte
          }
        >
          <span className={podeRecortar ? undefined : 'opacity-45'}>
            {recortando ? '⛶ Concluir recorte' : '⛶ Recortar'}
          </span>
        </Opcao>
        {temRecorte ? (
          <Opcao
            ativo={false}
            onClick={() => {
              set({ recorte: '' })
              aoRecortar(false)
            }}
            title="Desfaz o recorte e volta à imagem inteira. O arquivo nunca foi tocado, então isto funciona a qualquer momento."
          >
            ↺ Imagem inteira
          </Opcao>
        ) : null}
        <Campo rotulo="giro">
          <Numerico valor={a.rotacao ?? 0} aoMudar={(n) => set({ rotacao: n })} min={-360} max={360} sufixo="°" />
        </Campo>
        <Opcao ativo={false} onClick={() => set({ rotacao: ((a.rotacao ?? 0) + 90) % 360 })} title="Girar 90° à direita">
          ↻
        </Opcao>
        <Campo rotulo="espaço">
          <Numerico valor={a.margem ?? 0} aoMudar={(n) => set({ margem: n })} min={0} max={80} sufixo="px" />
        </Campo>
      </Grupo>

      {/* ---- borda ---- */}
      <Grupo>
        <Campo rotulo="borda">
          <Numerico valor={a.bordaLargura ?? 0} aoMudar={(n) => set({ bordaLargura: n })} min={0} max={20} sufixo="px" largura={46} />
        </Campo>
        <input
          type="color"
          value={a.bordaCor ?? '#9184D9'}
          onChange={(e) => set({ bordaCor: e.target.value })}
          title="Cor da borda"
          aria-label="Cor da borda"
          className="w-[26px] h-[26px] rounded border border-[var(--line-forte)] bg-transparent cursor-pointer"
        />
        <select
          value={a.bordaEstilo ?? 'solid'}
          onChange={(e) => set({ bordaEstilo: e.target.value })}
          aria-label="Estilo da borda"
          className="campo h-[26px] !py-0 !px-1 text-[11.5px] !w-auto"
        >
          <option value="solid">sólida</option>
          <option value="dashed">tracejada</option>
          <option value="dotted">pontilhada</option>
        </select>
      </Grupo>

      {/* ---- ajustes de cor ----
          Filtros de CSS, então não tocam no arquivo: dá para voltar atrás
          sempre, e a mesma imagem serve a dois resumos com ajustes diferentes.
          O preço é que o aluno baixa a imagem original — o que é justo, já que
          o contrário exigiria processar e guardar uma cópia por ajuste. */}
      <Grupo>
        <Campo rotulo="brilho">
          <Numerico valor={a.brilho ?? 100} aoMudar={(n) => set({ brilho: n })} min={0} max={300} sufixo="%" largura={50} />
        </Campo>
        <Campo rotulo="contraste">
          <Numerico valor={a.contraste ?? 100} aoMudar={(n) => set({ contraste: n })} min={0} max={300} sufixo="%" largura={50} />
        </Campo>
        <Campo rotulo="cor">
          <Numerico valor={a.saturacao ?? 100} aoMudar={(n) => set({ saturacao: n })} min={0} max={300} sufixo="%" largura={50} />
        </Campo>
        <Campo rotulo="opacidade">
          <Numerico valor={a.opacidade ?? 100} aoMudar={(n) => set({ opacidade: n })} min={10} max={100} sufixo="%" largura={50} />
        </Campo>
        <Opcao ativo={a.recolorir === 'cinza'} onClick={() => set({ recolorir: a.recolorir === 'cinza' ? 'nenhum' : 'cinza' })} title="Preto e branco">
          ◑ P&B
        </Opcao>
        <Opcao ativo={a.recolorir === 'sepia'} onClick={() => set({ recolorir: a.recolorir === 'sepia' ? 'nenhum' : 'sepia' })} title="Sépia">
          ◐ Sépia
        </Opcao>
      </Grupo>

      {/* ---- texto ---- */}
      <Grupo>
        <Campo rotulo="legenda">
          <input
            value={a.legenda ?? ''}
            onChange={(e) => set({ legenda: e.target.value })}
            placeholder="aparece abaixo da imagem"
            title="Sai em texto menor e apagado sob a imagem"
            className="campo h-[26px] w-[170px] !py-0 !px-1.5 text-[11.5px]"
          />
        </Campo>
        <Campo rotulo="alt">
          <input
            value={a.alt ?? ''}
            onChange={(e) => set({ alt: e.target.value })}
            placeholder="descrição para quem não vê"
            title="Lido por leitor de tela e mostrado se a imagem não carregar"
            className="campo h-[26px] w-[170px] !py-0 !px-1.5 text-[11.5px]"
          />
        </Campo>
        <Campo rotulo="link">
          <input
            value={a.link ?? ''}
            onChange={(e) => set({ link: e.target.value })}
            placeholder="https://…"
            title="Clicar na imagem abre este endereço"
            className="campo h-[26px] w-[150px] !py-0 !px-1.5 text-[11.5px]"
          />
        </Campo>
      </Grupo>

      {/* ---- arquivo ---- */}
      <Grupo>
        <Opcao ativo={false} onClick={() => trocaRef.current?.click()} title="Trocar o arquivo mantendo tamanho, borda e ajustes">
          ⇄ Substituir
        </Opcao>
        <Opcao ativo={false} onClick={redefinir} title="Volta tamanho, borda e ajustes ao original — o arquivo continua o mesmo">
          ↺ Redefinir
        </Opcao>
        <Opcao
          ativo={false}
          onClick={() => editor.chain().focus().deleteSelection().run()}
          title="Remover a imagem do resumo (o arquivo continua no armazenamento)"
        >
          ✕ Remover
        </Opcao>
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
      </Grupo>
    </div>
  )
}

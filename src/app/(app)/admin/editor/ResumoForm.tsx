'use client'

import { useMemo, useState } from 'react'
import { salvarResumo, excluirResumo } from './actions'
import { MATERIAS } from '@/lib/materias'
import { PROCESSOS } from '@/lib/processos'
import EditorCorpo from './EditorCorpo'
import BotaoEnviar from '@/components/BotaoEnviar'
import { MARGEM_PADRAO } from '@/lib/pagina'

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type ResumoExistente = {
  id: string
  slug: string
  titulo: string
  materia_slug: string
  processo_slug: string
  corpo: string
  definicao: string
  pai_id: string | null
  margem_esq: number
  margem_dir: number
}

/** Resumo já existente, como candidato a receber este dentro dele. */
type CandidatoPai = {
  id: string
  titulo: string
  materia_slug: string
  pai_id: string | null
}

const LIMITE_DEFINICAO = 180

/**
 * Lista de possíveis pais, indentada pela profundidade e já sem as opções
 * inválidas.
 *
 * A lista atravessa matérias de propósito: um assunto pode ser
 * interdisciplinar — "Energia" segurando tópicos de Física e de Química é uma
 * árvore legítima. Por isso cada opção mostra a matéria a que pertence, senão
 * dois resumos de nome parecido em disciplinas diferentes ficariam
 * indistinguíveis no `<select>`.
 *
 * O que sai da lista: o próprio resumo e TODA a subárvore dele. Oferecer um
 * descendente como pai criaria um ciclo — "Atrito dentro de Dinâmica, Dinâmica
 * dentro de Atrito" — e a árvore deixaria de ter raiz. O trigger no banco
 * recusaria de qualquer forma, mas com um erro cru na cara de quem salvou;
 * melhor a opção nem aparecer.
 */
function opcoesPai(
  candidatos: CandidatoPai[],
  idAtual: string | undefined
): { id: string; rotulo: string }[] {
  const proibidos = new Set<string>()
  if (idAtual) {
    proibidos.add(idAtual)
    // varre até estabilizar: pega descendentes em qualquer profundidade sem
    // depender de a lista vir em ordem de árvore
    let cresceu = true
    while (cresceu) {
      cresceu = false
      for (const c of candidatos) {
        if (c.pai_id && proibidos.has(c.pai_id) && !proibidos.has(c.id)) {
          proibidos.add(c.id)
          cresceu = true
        }
      }
    }
  }

  const filhosDe = new Map<string | null, CandidatoPai[]>()
  for (const c of candidatos) {
    if (proibidos.has(c.id)) continue
    const chave = c.pai_id && !proibidos.has(c.pai_id) ? c.pai_id : null
    filhosDe.set(chave, [...(filhosDe.get(chave) ?? []), c])
  }

  const saida: { id: string; rotulo: string }[] = []
  function descer(paiId: string | null, nivel: number) {
    const filhos = (filhosDe.get(paiId) ?? []).sort((a, b) =>
      a.titulo.localeCompare(b.titulo, 'pt-BR')
    )
    for (const f of filhos) {
      const materia = MATERIAS[f.materia_slug as keyof typeof MATERIAS]?.nome ?? f.materia_slug
      saida.push({
        id: f.id,
        rotulo: `${'  '.repeat(nivel)}${nivel ? '└ ' : ''}${f.titulo}  ·  ${materia}`,
      })
      descer(f.id, nivel + 1)
    }
  }
  descer(null, 0)
  return saida
}

export default function ResumoForm({
  resumo,
  titulos = [],
  candidatosPai = [],
}: {
  resumo?: ResumoExistente
  titulos?: string[]
  candidatosPai?: CandidatoPai[]
}) {
  const [titulo, setTitulo] = useState(resumo?.titulo ?? '')
  const [slug, setSlug] = useState(resumo?.slug ?? '')
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(!!resumo)
  const [definicao, setDefinicao] = useState(resumo?.definicao ?? '')
  // a matéria é estado porque o seletor de pai depende dela: trocar de matéria
  // troca a lista de assuntos onde este resumo pode morar
  const [materia, setMateria] = useState(resumo?.materia_slug ?? '')
  const [margens, setMargens] = useState({
    esq: resumo?.margem_esq ?? MARGEM_PADRAO,
    dir: resumo?.margem_dir ?? MARGEM_PADRAO,
  })
  const [paiId, setPaiId] = useState(resumo?.pai_id ?? '')

  // não depende da matéria escolhida: um assunto pode segurar tópicos de
  // disciplinas diferentes
  const pais = useMemo(
    () => opcoesPai(candidatosPai, resumo?.id),
    [candidatosPai, resumo?.id]
  )

  return (
    <form action={salvarResumo} className="flex flex-col gap-4">
      {resumo && <input type="hidden" name="id" value={resumo.id} />}

      {/* metadados ficam numa coluna estreita; o editor usa a largura toda */}
      <div className="flex flex-col gap-4 max-w-[640px]">
      <div>
        <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Título</label>
        <input
          name="titulo"
          required
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value)
            if (!slugEditadoManualmente) setSlug(slugify(e.target.value))
          }}
          className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)]"
        />
      </div>

      <div>
        <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Slug (URL)</label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugEditadoManualmente(true)
          }}
          className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm font-mono-plex outline-none focus:border-[var(--stamp)]"
        />
      </div>

      <div>
        <label htmlFor="definicao" className="block text-[13px] text-[var(--ink-dim)] mb-1.5">
          Definição breve
          <span className="ml-2 opacity-70">
            aparece ao passar o mouse no mapa
          </span>
        </label>
        <textarea
          id="definicao"
          name="definicao"
          rows={2}
          maxLength={LIMITE_DEFINICAO}
          value={definicao}
          onChange={(e) => setDefinicao(e.target.value)}
          placeholder="Uma frase explicando o tópico para quem ainda não abriu o resumo…"
          className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none resize-y focus:border-[var(--stamp)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--stamp)]"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[11.5px] text-[var(--ink-dim)]">
            Deixe vazio se não quiser balão para este tópico.
          </span>
          <span
            className={`font-mono-plex text-[11px] ${
              definicao.length > LIMITE_DEFINICAO - 20
                ? 'text-[var(--stamp)]'
                : 'text-[var(--ink-dim)]'
            }`}
          >
            {definicao.length}/{LIMITE_DEFINICAO}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Matéria</label>
          <select
            name="materia_slug"
            required
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)]"
          >
            <option value="" disabled>Selecione…</option>
            {Object.entries(MATERIAS).map(([slugMateria, m]) => (
              <option key={slugMateria} value={slugMateria}>{m.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Processo seletivo</label>
          <select
            name="processo_slug"
            required
            defaultValue={resumo?.processo_slug ?? ''}
            className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)]"
          >
            <option value="" disabled>Selecione…</option>
            {Object.entries(PROCESSOS).map(([slugProcesso, p]) => (
              <option key={slugProcesso} value={slugProcesso}>{p.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="pai_id" className="block text-[13px] text-[var(--ink-dim)] mb-1.5">
          Está dentro de
          <span className="ml-2 opacity-70">define a hierarquia no mapa e na barra lateral</span>
        </label>
        <select
          id="pai_id"
          name="pai_id"
          value={paiId}
          onChange={(e) => setPaiId(e.target.value)}
          className="w-full border border-[var(--line)] rounded-md px-3.5 py-2.5 text-sm outline-none focus:border-[var(--stamp)]"
        >
          <option value="">— nenhum (assunto principal) —</option>
          {pais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.rotulo}
            </option>
          ))}
        </select>
        <span className="block text-[11.5px] text-[var(--ink-dim)] mt-1">
          Deixe vazio para começar um assunto novo. Um assunto pode segurar
          tópicos de matérias diferentes — a lista mostra a matéria de cada um, e
          esconde os que já estão dentro deste.
        </span>
      </div>
      </div>

      <div>
        <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Corpo</label>
        <EditorCorpo
          conteudoInicial={resumo?.corpo ?? ''}
          titulos={titulos}
          resumoId={resumo?.id}
          /* `materia` é estado, não `resumo.materia_slug`: trocar a matéria no
             `<select>` acima recolore a folha na hora, sem salvar antes. */
          corMateria={MATERIAS[materia as keyof typeof MATERIAS]?.cor}
          margemEsq={margens.esq}
          margemDir={margens.dir}
          aoMudarMargens={(esq, dir) => setMargens({ esq, dir })}
        />
        {/* As margens viajam no formulário como qualquer outro campo. Não entram
            no autosave: ele grava só o `corpo` (decisão 3), e a régua é ajuste
            de layout, não de texto — salvar junto faria um autosave atrasado
            devolver a margem antiga por cima da que o autor acabou de arrastar. */}
        <input type="hidden" name="margem_esq" value={margens.esq} />
        <input type="hidden" name="margem_dir" value={margens.dir} />
      </div>

      <div className="flex gap-3 mt-2">
        <BotaoEnviar className="botao botao-primario !rounded-lg py-2.5 px-6 text-sm">
          Salvar
        </BotaoEnviar>
        {resumo && (
          <button
            type="submit"
            formAction={excluirResumo}
            onClick={(e) => {
              if (!confirm(`Excluir "${resumo.titulo}"? Isso também remove as conexões dele.`)) {
                e.preventDefault()
              }
            }}
            className="border border-[var(--line)] text-sm font-semibold py-2.5 px-6 rounded-md"
          >
            Excluir
          </button>
        )}
      </div>
    </form>
  )
}

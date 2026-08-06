'use client'

import { useState } from 'react'
import { salvarResumo, excluirResumo } from './actions'
import { MATERIAS } from '@/lib/materias'
import { PROCESSOS } from '@/lib/processos'
import EditorCorpo from './EditorCorpo'

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
}

export default function ResumoForm({
  resumo,
  titulos = [],
}: {
  resumo?: ResumoExistente
  titulos?: string[]
}) {
  const [titulo, setTitulo] = useState(resumo?.titulo ?? '')
  const [slug, setSlug] = useState(resumo?.slug ?? '')
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(!!resumo)

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Matéria</label>
          <select
            name="materia_slug"
            required
            defaultValue={resumo?.materia_slug ?? ''}
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
      </div>

      <div>
        <label className="block text-[13px] text-[var(--ink-dim)] mb-1.5">Corpo</label>
        <EditorCorpo
          conteudoInicial={resumo?.corpo ?? ''}
          titulos={titulos}
          resumoId={resumo?.id}
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          className="bg-[var(--stamp)] text-white font-semibold py-2.5 px-6 rounded-md text-sm"
        >
          Salvar
        </button>
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

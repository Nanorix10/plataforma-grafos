'use server'

import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'

async function exigirAdmin() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId || !isAdmin) throw new Error('Só administrador pode mexer nos eventos.')
  return supabase
}

/**
 * Lê um ano do formulário.
 *
 * O campo é texto e não `<input type="number">` de propósito: as setinhas
 * nativas comem metade da caixa (mesma razão já registrada no editor), e ano
 * histórico é digitado com sinal — "-350" para 350 a.C. Aceitar "350 a.C."
 * escrito por extenso também evita que o autor tenha de traduzir na cabeça o
 * que ele já sabe escrever.
 */
function lerAno(bruto: string): number | null {
  const t = bruto.trim()
  if (!t) return null
  const antesDeCristo = /a\.?\s*c\.?/i.test(t)
  const numero = Number.parseInt(t.replace(/[^\d-]/g, ''), 10)
  if (Number.isNaN(numero)) return null
  return antesDeCristo ? -Math.abs(numero) : numero
}

export async function salvarEvento(formData: FormData) {
  const supabase = await exigirAdmin()

  const id = String(formData.get('id') ?? '')
  const titulo = String(formData.get('titulo') ?? '').trim()
  const anoInicio = lerAno(String(formData.get('ano_inicio') ?? ''))
  const anoFim = lerAno(String(formData.get('ano_fim') ?? ''))

  if (!titulo) return { ok: false as const, erro: 'O evento precisa de um título.' }
  if (anoInicio === null) {
    return { ok: false as const, erro: 'O ano de início é obrigatório (use -350 ou 350 a.C.).' }
  }
  if (anoFim !== null && anoFim < anoInicio) {
    return { ok: false as const, erro: 'O ano de fim não pode ser anterior ao de início.' }
  }

  const materia = String(formData.get('materia_slug') ?? '')
  if (!materia) return { ok: false as const, erro: 'Escolha a matéria.' }

  const dados = {
    titulo,
    ano_inicio: anoInicio,
    // vazio significa evento pontual, e isso é `null` — não 0, que cairia no
    // ano 1 a.C./1 d.C. e desenharia uma barra atravessando a era inteira
    ano_fim: anoFim,
    rotulo_data: String(formData.get('rotulo_data') ?? '').trim(),
    materia_slug: materia,
    resumo_id: String(formData.get('resumo_id') ?? '') || null,
    descricao: String(formData.get('descricao') ?? '').trim(),
  }

  const { error } = id
    ? await supabase.from('eventos').update(dados).eq('id', id)
    : await supabase.from('eventos').insert(dados)

  if (error) return { ok: false as const, erro: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/linha-do-tempo')
  return { ok: true as const }
}

export async function excluirEvento(formData: FormData) {
  const supabase = await exigirAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false as const, erro: 'id obrigatório.' }

  const { error } = await supabase.from('eventos').delete().eq('id', id)
  if (error) return { ok: false as const, erro: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/linha-do-tempo')
  return { ok: true as const }
}

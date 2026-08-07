'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'

async function exigirAdmin() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId || !isAdmin) redirect('/resumos')
  return supabase
}

export async function salvarResumo(formData: FormData) {
  const supabase = await exigirAdmin()

  const id = String(formData.get('id') ?? '')
  const dados = {
    slug: String(formData.get('slug') ?? '').trim(),
    titulo: String(formData.get('titulo') ?? '').trim(),
    materia_slug: String(formData.get('materia_slug') ?? ''),
    processo_slug: String(formData.get('processo_slug') ?? ''),
    corpo: String(formData.get('corpo') ?? ''),
    definicao: String(formData.get('definicao') ?? '').trim(),
  }

  if (!dados.slug || !dados.titulo) {
    throw new Error('Slug e título são obrigatórios.')
  }

  const { error } = id
    ? await supabase.from('resumos').update(dados).eq('id', id)
    : await supabase.from('resumos').insert(dados)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/editor')
  revalidatePath('/resumos')
  revalidatePath('/mapa')
  revalidatePath(`/resumos/${dados.slug}`)
  redirect('/admin/editor')
}

// Salvamento automático do corpo enquanto o Ronny escreve (estilo Google Docs).
// Grava SÓ o corpo de propósito: título, slug e matéria continuam saindo do
// formulário, pra um autosave nunca sobrescrever esses campos com valor velho.
// Não faz redirect nem revalidate — quem está digitando não pode ter a página
// recarregada embaixo do cursor.
export async function salvarCorpoAuto(id: string, corpo: string) {
  const supabase = await exigirAdmin()
  if (!id) return { ok: false, erro: 'id ausente' }

  const { error } = await supabase.from('resumos').update({ corpo }).eq('id', id)
  if (error) return { ok: false, erro: error.message }

  return { ok: true }
}

export async function excluirResumo(formData: FormData) {
  const supabase = await exigirAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('id obrigatório.')

  const { error } = await supabase.from('resumos').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/editor')
  revalidatePath('/resumos')
  revalidatePath('/mapa')
  redirect('/admin/editor')
}

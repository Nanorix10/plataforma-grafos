'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'
import { MARGEM_PADRAO, ajustarMargens } from '@/lib/pagina'

async function exigirAdmin() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId || !isAdmin) redirect('/resumos')
  return supabase
}

export async function salvarResumo(formData: FormData) {
  const supabase = await exigirAdmin()

  const id = String(formData.get('id') ?? '')
  const margens = ajustarMargens(
    Number(formData.get('margem_esq')) || MARGEM_PADRAO,
    Number(formData.get('margem_dir')) || MARGEM_PADRAO
  )
  const dados = {
    slug: String(formData.get('slug') ?? '').trim(),
    titulo: String(formData.get('titulo') ?? '').trim(),
    materia_slug: String(formData.get('materia_slug') ?? ''),
    processo_slug: String(formData.get('processo_slug') ?? ''),
    corpo: String(formData.get('corpo') ?? ''),
    definicao: String(formData.get('definicao') ?? '').trim(),
    // "" no <select> significa "na raiz da matéria" — vira null, não string
    // vazia, senão o Postgres recusa por não ser um uuid válido.
    pai_id: String(formData.get('pai_id') ?? '') || null,
    // A régua já prende os valores enquanto o autor arrasta, mas isso é
    // interface: `ajustarMargens` roda de novo aqui, e o `check` da migration
    // é a terceira e última palavra.
    margem_esq: margens.esq,
    margem_dir: margens.dir,
  }

  if (!dados.slug || !dados.titulo) {
    throw new Error('Slug e título são obrigatórios.')
  }

  // O trigger `trg_checar_ciclo_resumo` é quem realmente barra ciclos; o
  // <select> do formulário já esconde o próprio resumo e seus descendentes,
  // mas isso é conveniência de interface e pode ser burlado.
  if (id && dados.pai_id === id) {
    throw new Error('Um resumo não pode estar dentro de si mesmo.')
  }

  const { data: salvo, error } = id
    ? await supabase.from('resumos').update(dados).eq('id', id).select('id').single()
    : await supabase.from('resumos').insert(dados).select('id').single()

  if (error) throw new Error(error.message)

  /* O quarto eixo (decisão 9i): que tópicos do edital este resumo cobre.
     Mora em `edital_topicos.resumo_id`, e não numa coluna daqui, porque a
     relação é N-para-N — o mesmo resumo cai em mais de uma prova.

     São DUAS escritas, e a ordem importa: primeiro solta tudo o que apontava
     para este resumo, depois marca o que veio do formulário. Sem a primeira,
     desmarcar uma caixa não desfazia nada — o vínculo velho continuaria lá, e
     a tela do edital mostraria o tópico como escrito para sempre.

     `.select('id').single()` acima existe por isto: num resumo NOVO o id só
     nasce depois do insert, e sem ele não há o que marcar. */
  const idFinal = salvo?.id ?? id
  if (idFinal) {
    const topicos = formData.getAll('topicos_edital').map(String).filter(Boolean)

    await supabase.from('edital_topicos').update({ resumo_id: null }).eq('resumo_id', idFinal)
    if (topicos.length > 0) {
      await supabase.from('edital_topicos').update({ resumo_id: idFinal }).in('id', topicos)
    }
  }

  revalidatePath('/admin/editor')
  revalidatePath('/resumos')
  revalidatePath('/mapa')
  revalidatePath('/edital')
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

/** O que o bucket aceita. Repetido aqui para a mensagem de erro ser em português. */
const TIPOS = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
const TAMANHO_MAXIMO = 5 * 1024 * 1024

/**
 * Envia uma imagem e devolve a URL pública.
 *
 * Server action, e não upload direto do navegador, por uma razão só: a chave
 * que o navegador tem é a anônima, e é a policy `admin envia imagens` que
 * decide. Passando por aqui, o upload viaja com a sessão do autor e o Postgres
 * confere o `eh_admin()` — do lado do cliente não haveria nada a conferir.
 *
 * O nome do arquivo é um uuid, e não o nome original. Dois motivos: nome de
 * arquivo vindo do Windows traz acento, espaço e parêntese, que viram escape
 * na URL e quebram feio; e dois prints chamados "Captura de tela.png" se
 * sobrescreveriam em silêncio.
 */
export async function enviarImagem(formData: FormData) {
  const supabase = await exigirAdmin()

  const arquivo = formData.get('arquivo')
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { ok: false as const, erro: 'Nenhum arquivo veio junto.' }
  }
  if (!TIPOS.includes(arquivo.type)) {
    return { ok: false as const, erro: `Formato não aceito (${arquivo.type || 'desconhecido'}).` }
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    const mb = (arquivo.size / 1024 / 1024).toFixed(1)
    return { ok: false as const, erro: `Imagem de ${mb} MB — o limite é 5 MB.` }
  }

  const extensao = arquivo.type.split('/')[1]?.replace('svg+xml', 'svg') ?? 'png'
  const caminho = `${crypto.randomUUID()}.${extensao}`

  const { error } = await supabase.storage
    .from('imagens')
    .upload(caminho, arquivo, { contentType: arquivo.type, upsert: false })

  if (error) return { ok: false as const, erro: error.message }

  const { data } = supabase.storage.from('imagens').getPublicUrl(caminho)
  return { ok: true as const, url: data.publicUrl }
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

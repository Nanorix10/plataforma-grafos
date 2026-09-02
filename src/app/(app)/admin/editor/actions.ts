'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'
import { MARGEM_PADRAO, ajustarMargens } from '@/lib/pagina'
import type { FormulaSalva } from '@/lib/formulas'

async function exigirAdmin() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId || !isAdmin) redirect('/resumos')
  return supabase
}

/** O cliente que `exigirAdmin` devolve, sem ter de nomear o genérico do supabase-js. */
type SupabaseDoServidor = Awaited<ReturnType<typeof exigirAdmin>>

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

/* ---------------------------------------------------------------------------
   Fórmulas salvas (decisão 8e)

   As duas ações devolvem a LISTA INTEIRA já atualizada, em vez de só um "deu
   certo". A `BarraFormula` monta e desmonta a cada uso, então ela não tem como
   guardar estado entre aberturas; quem segura a lista é o `EditorCorpo`, e o
   retorno é o que o deixa acertar a lista sem uma segunda ida ao servidor.
   O `revalidatePath` continua, para quem recarregar a página achar o mesmo.
--------------------------------------------------------------------------- */

const CAMPOS_FORMULA = 'id, nome, latex, em_bloco'

async function listarFormulas(supabase: SupabaseDoServidor): Promise<FormulaSalva[]> {
  const { data } = await supabase.from('formulas_salvas').select(CAMPOS_FORMULA).order('nome')
  return data ?? []
}

export async function salvarFormula(
  nome: string,
  latex: string,
  emBloco: boolean
): Promise<FormulaSalva[]> {
  const supabase = await exigirAdmin()

  // O servidor reconfere tudo o que a tela já conferiu: server action é
  // endereço público, mesmo princípio da lista colada da decisão 10c.
  const limpo = nome.trim()
  const tex = latex.trim()
  if (!limpo) throw new Error('A fórmula precisa de um nome.')
  if (!tex) throw new Error('Não há fórmula para guardar.')
  if (limpo.length > 80) throw new Error('O nome deve ter no máximo 80 caracteres.')
  if (tex.length > 2000) throw new Error('A fórmula é longa demais para ser guardada.')

  // Procura pelo NOME, e não por um id vindo do cliente — o nome é a
  // identidade (ver a migration). A comparação sem caixa é a mesma que a tela
  // usa para avisar "já existe"; se as duas divergissem, a tela prometeria
  // substituir e o banco criaria uma segunda linha.
  //
  // A lista inteira desce em vez de um `ilike`: `_` e `%` são curingas do
  // Postgres, e um nome com sublinhado viraria uma busca que casa demais. São
  // dezenas de linhas, e o RLS já recorta pelo dono.
  const atuais = await listarFormulas(supabase)
  const igual = atuais.find((f) => f.nome.toLowerCase() === limpo.toLowerCase())

  const { error } = igual
    ? await supabase
        .from('formulas_salvas')
        .update({
          nome: limpo,
          latex: tex,
          em_bloco: emBloco,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', igual.id)
    : // `user_id` não vai aqui: a coluna tem `default auth.uid()` e a policy
      // confere que é quem está pedindo.
      await supabase.from('formulas_salvas').insert({ nome: limpo, latex: tex, em_bloco: emBloco })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/editor', 'layout')
  return listarFormulas(supabase)
}

export async function excluirFormula(id: string): Promise<FormulaSalva[]> {
  const supabase = await exigirAdmin()
  if (!id) throw new Error('id obrigatório.')

  const { error } = await supabase.from('formulas_salvas').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/editor', 'layout')
  return listarFormulas(supabase)
}

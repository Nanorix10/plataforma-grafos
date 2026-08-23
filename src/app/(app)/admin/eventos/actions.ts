'use server'

import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'
// `lerAno` morava aqui. Foi para o lado puro porque a pré-visualização do lote
// roda no navegador e precisa da mesma leitura de ano — duas cópias
// discordariam no primeiro formato exótico.
import { analisarLinhaDeEvento, lerAno, type EventoEmLote } from '@/lib/tempo'

async function exigirAdmin() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId || !isAdmin) throw new Error('Só administrador pode mexer nos eventos.')
  return supabase
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

  /* `getAll`, porque as matérias são caixas de seleção: um evento pode ser de
     várias (o Renascimento é História, Arte, Literatura e Filosofia). O banco
     também recusa a lista vazia — `eventos_tem_materia` —, mas errar aqui daria
     uma mensagem de Postgres em vez de uma frase. */
  const materias = formData
    .getAll('materia_slugs')
    .map((m) => String(m))
    .filter(Boolean)
  if (materias.length === 0) {
    return { ok: false as const, erro: 'Escolha pelo menos uma matéria.' }
  }

  const dados = {
    titulo,
    ano_inicio: anoInicio,
    // vazio significa evento pontual, e isso é `null` — não 0, que cairia no
    // ano 1 a.C./1 d.C. e desenharia uma barra atravessando a era inteira
    ano_fim: anoFim,
    rotulo_data: String(formData.get('rotulo_data') ?? '').trim(),
    materia_slugs: materias,
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

/**
 * Cadastra vários eventos de uma vez, a partir do texto colado.
 *
 * O eixo da linha do tempo tem UM evento no banco desde que foi construído, e a
 * razão não é falta de material: é que lançar evento era abrir um formulário de
 * sete campos, salvar, e recomeçar. Trinta eventos eram trinta idas e voltas.
 *
 * ## Por que reanalisar aqui
 *
 * A tela já analisou cada linha para mostrar a pré-visualização, e o resultado
 * dela é jogado fora: o que vale é o texto bruto, reanalisado aqui. Server
 * action é endereço público — responde a qualquer POST, não só ao que saiu do
 * formulário —, então confiar no JSON que o navegador mandou seria deixar
 * qualquer um escrever `ano_inicio` direto na tabela. A análise é a mesma
 * função nos dois lados (`analisarLinhaDeEvento`), então o resultado bate.
 *
 * ## Por que tudo ou nada
 *
 * Uma linha ruim cancela a remessa inteira. Inserir as boas e recusar as ruins
 * pareceria gentil e seria pior: o autor ficaria com uma lista pela metade sem
 * saber quais entraram, e o reenvio duplicaria as que já estavam lá — a tabela
 * não tem chave única de título e ano que o impeça.
 */
export async function salvarEventosEmLote(formData: FormData) {
  const supabase = await exigirAdmin()

  const bruto = String(formData.get('linhas') ?? '')
  const linhas = bruto
    .split('\n')
    .map((l) => l.trim())
    // linha vazia é respiro no meio da lista, não erro
    .filter(Boolean)

  if (linhas.length === 0) {
    return { ok: false as const, erro: 'Cole pelo menos uma linha.' }
  }

  const prontos: EventoEmLote[] = []
  const recusadas: string[] = []

  linhas.forEach((linha, i) => {
    const r = analisarLinhaDeEvento(linha)
    // numera pela posição na LISTA LIMPA, que é a que o autor vê na
    // pré-visualização — contar as linhas em branco apontaria para o lugar
    // errado justamente na hora de consertar
    if (r.ok) prontos.push(r.evento)
    else recusadas.push(`Linha ${i + 1}: ${r.erro}`)
  })

  if (recusadas.length > 0) {
    return { ok: false as const, erro: recusadas.join('\n') }
  }

  const { error } = await supabase.from('eventos').insert(
    prontos.map((e) => ({ ...e, resumo_id: null, descricao: '' }))
  )
  if (error) return { ok: false as const, erro: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/linha-do-tempo')
  return { ok: true as const, quantos: prontos.length }
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

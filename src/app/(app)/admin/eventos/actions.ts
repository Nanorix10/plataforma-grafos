'use server'

import { revalidatePath } from 'next/cache'
import { getSessao } from '@/lib/sessao'
// `lerAno` morava aqui. Foi para o lado puro porque a pré-visualização do lote
// roda no navegador e precisa da mesma leitura de ano — duas cópias
// discordariam no primeiro formato exótico.
import { analisarLinhaDeEvento, lerAno, mapearResumos, type EventoEmLote } from '@/lib/tempo'

async function exigirAdmin() {
  const { supabase, userId, isAdmin } = await getSessao()
  if (!userId || !isAdmin) throw new Error('Só administrador pode mexer nos eventos.')
  return supabase
}

export async function salvarEvento(formData: FormData) {
  const supabase = await exigirAdmin()

  const id = String(formData.get('id') ?? '')
  const titulo = String(formData.get('titulo') ?? '').trim()

  /* As strings CRUAS ficam guardadas, e não só o que `lerAno` devolveu.
     `lerAno` responde `null` para campo vazio E para valor que ele não
     entendeu, e os dois casos são coisas opostas: vazio no ano de fim
     significa "evento pontual", e inválido significa "o autor tentou dizer
     alguma coisa e eu não li". Sem a string crua para distinguir, digitar
     `séc XV` no ano de fim gravava um ponto em silêncio, onde devia haver uma
     barra — e o erro só aparecia olhando o eixo, dias depois. */
  const anoInicioBruto = String(formData.get('ano_inicio') ?? '').trim()
  const anoFimBruto = String(formData.get('ano_fim') ?? '').trim()
  const anoInicio = lerAno(anoInicioBruto)
  const anoFim = lerAno(anoFimBruto)

  if (!titulo) return { ok: false as const, erro: 'O evento precisa de um título.' }
  if (!anoInicioBruto) {
    return { ok: false as const, erro: 'O ano de início é obrigatório (use -350 ou 350 a.C.).' }
  }
  if (anoInicio === null) {
    return {
      ok: false as const,
      erro: `Não entendi o ano de início "${anoInicioBruto}". Use 1789, -350 ou 350 a.C.`,
    }
  }
  if (anoFimBruto && anoFim === null) {
    return {
      ok: false as const,
      erro: `Não entendi o ano de fim "${anoFimBruto}". Use 1789, -350 ou 350 a.C., ou deixe vazio para um evento de data única.`,
    }
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

  /* O mapa de resumos é montado AQUI, com a consulta do servidor, e não vem do
     navegador — pela mesma razão que o texto é reanalisado: aceitar um id
     mandado pelo cliente deixaria qualquer um apontar um evento para qualquer
     linha de `resumos`. A tela monta o mapa dela só para pré-visualizar. */
  const { data: resumos, error: erroResumos } = await supabase
    .from('resumos')
    .select('id, titulo, slug')
  if (erroResumos) return { ok: false as const, erro: erroResumos.message }
  const porNome = mapearResumos(resumos ?? [])

  const prontos: EventoEmLote[] = []
  const recusadas: string[] = []

  linhas.forEach((linha, i) => {
    const r = analisarLinhaDeEvento(linha, porNome)
    // numera pela posição na LISTA LIMPA, que é a que o autor vê na
    // pré-visualização — contar as linhas em branco apontaria para o lugar
    // errado justamente na hora de consertar
    if (r.ok) prontos.push(r.evento)
    else recusadas.push(`Linha ${i + 1}: ${r.erro}`)
  })

  if (recusadas.length > 0) {
    return { ok: false as const, erro: recusadas.join('\n') }
  }

  // `resumo_id` já vem resolvido de `analisarLinhaDeEvento`; a `descricao`
  // continua vazia, porque escrevê-la seria inventar texto do autor
  const { error } = await supabase
    .from('eventos')
    .insert(prontos.map((e) => ({ ...e, descricao: '' })))
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

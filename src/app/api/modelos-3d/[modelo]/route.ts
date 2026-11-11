import type { NextRequest } from 'next/server'
import { getSessao } from '@/lib/sessao'

/**
 * Textos editáveis dos modelos 3D (decisão 28).
 *
 * O modelo é um .html estático dentro de um <iframe>, sem React e sem o
 * cliente do Supabase; esta rota é a ponte dele com a tabela
 * `modelos3d_partes`. O iframe tem a mesma origem do site, então o cookie da
 * sessão vem junto e dá para saber se quem pede é admin.
 *
 * GET  — os textos gravados e `podeEditar`. Qualquer um lê, inclusive sem
 *        conta: texto de rótulo não é segredo, e um modelo pode entrar na
 *        amostra grátis (decisão 27).
 * POST — grava uma estrutura. Só admin; e quem tem a palavra final é a policy
 *        do banco (`eh_admin()`), não esta conferência — rota é endereço
 *        público, como server action (decisão 10c).
 *
 * Campo vazio vira `null`, que significa "volta ao texto de fábrica do .html".
 * Não existe DELETE: restaurar é anular campos.
 */

const ID = /^[a-z0-9_-]{1,40}$/
const PARTE = /^[a-z0-9_]{1,40}$/

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/modelos-3d/[modelo]'>) {
  const { modelo } = await ctx.params
  if (!ID.test(modelo)) return Response.json({ erro: 'modelo inválido' }, { status: 400 })

  const { supabase, isAdmin } = await getSessao()
  const { data, error } = await supabase
    .from('modelos3d_partes')
    .select('parte, nome, curto, so, descricao, ancoras')
    .eq('modelo', modelo)

  return Response.json(
    // Tabela ausente ou erro de leitura: o modelo segue com o texto de fábrica.
    { podeEditar: isAdmin, partes: error ? [] : (data ?? []) },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

type Corpo = {
  parte?: unknown
  nome?: unknown
  curto?: unknown
  so?: unknown
  descricao?: unknown
  ancoras?: unknown
}

/** Texto aparado, com teto; vazio vira null (= texto de fábrica). */
function texto(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t.slice(0, max) : null
}

/** Só aceita { variante: [x, y, z] } com números finitos e de tamanho sensato. */
function ancoras(v: unknown): Record<string, [number, number, number]> {
  const saida: Record<string, [number, number, number]> = {}
  if (!v || typeof v !== 'object' || Array.isArray(v)) return saida
  for (const [chave, ponto] of Object.entries(v)) {
    if (!ID.test(chave) || !Array.isArray(ponto) || ponto.length !== 3) continue
    if (!ponto.every((n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) < 1000)) continue
    saida[chave] = ponto.map((n) => Math.round(n * 1000) / 1000) as [number, number, number]
  }
  return saida
}

export async function POST(req: NextRequest, ctx: RouteContext<'/api/modelos-3d/[modelo]'>) {
  const { modelo } = await ctx.params
  if (!ID.test(modelo)) return Response.json({ erro: 'modelo inválido' }, { status: 400 })

  const { supabase, isAdmin } = await getSessao()
  if (!isAdmin) return Response.json({ erro: 'só o admin edita os modelos' }, { status: 403 })

  let corpo: Corpo
  try {
    corpo = await req.json()
  } catch {
    return Response.json({ erro: 'corpo inválido' }, { status: 400 })
  }
  if (typeof corpo.parte !== 'string' || !PARTE.test(corpo.parte)) {
    return Response.json({ erro: 'estrutura inválida' }, { status: 400 })
  }

  const linha = {
    modelo,
    parte: corpo.parte,
    nome: texto(corpo.nome, 80),
    curto: texto(corpo.curto, 40),
    so: texto(corpo.so, 40),
    descricao: texto(corpo.descricao, 1500),
    ancoras: ancoras(corpo.ancoras),
    atualizado_em: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('modelos3d_partes')
    .upsert(linha, { onConflict: 'modelo,parte' })
    .select('parte, nome, curto, so, descricao, ancoras')
    .single()

  if (error) return Response.json({ erro: 'não foi possível salvar' }, { status: 500 })
  return Response.json({ parte: data })
}

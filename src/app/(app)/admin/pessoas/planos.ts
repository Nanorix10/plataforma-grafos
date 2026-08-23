import { PLANO_PROCESSOS } from '@/lib/planos'
import { PROCESSOS } from '@/lib/processos'

/**
 * Tipo e lista de planos, num arquivo sem nada de servidor.
 *
 * Mora fora de `page.tsx` porque a linha da lista é um componente de cliente e
 * precisa dos dois; `page.tsx` importa `getSessao`, que depende de
 * `next/headers` e não pode atravessar para o cliente. Mesma divisão que
 * `lib/arvore.ts` faz para a barra lateral.
 */

export type Pessoa = {
  user_id: string
  email: string | null
  plano: string
  ativo: boolean
  is_admin: boolean
  criado_em: string | null
}

/**
 * Cada plano e, em nomes legíveis, o que ele abre.
 *
 * Só as provas: `comum` entra em todos os planos à venda, então repeti-lo em
 * cada linha da lista de pessoas seria ruído que não distingue ninguém — e a
 * pergunta desta tela é exatamente qual é a diferença entre um aluno e outro.
 */
export const PLANOS = Object.keys(PLANO_PROCESSOS).map((slug) => ({
  slug,
  processos: (PLANO_PROCESSOS[slug] ?? [])
    .filter((p) => !PROCESSOS[p]?.universal)
    .map((p) => PROCESSOS[p]?.nome ?? p)
    .join(' · '),
}))

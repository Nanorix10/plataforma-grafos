import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import LinhaPessoa from './LinhaPessoa'
import { type Pessoa } from './planos'

export const dynamic = 'force-dynamic'


export default async function PessoasPage() {
  const { supabase, userId, isAdminReal } = await getSessao()
  if (!userId) redirect('/login')
  if (!isAdminReal) redirect('/resumos')

  // a policy "admin ve todos os planos" é quem libera esta leitura; para um
  // não-admin a mesma consulta devolveria só a própria linha
  const { data } = await supabase
    .from('planos_usuarios')
    .select('user_id, email, plano, ativo, is_admin, criado_em')
    .order('criado_em', { ascending: false })

  const pessoas = (data ?? []) as Pessoa[]
  const comAcesso = pessoas.filter((p) => p.ativo && p.plano !== 'nenhum').length
  const admins = pessoas.filter((p) => p.is_admin).length

  return (
    <div className="max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-11">
      <h1 className="text-2xl font-medium mb-1">Pessoas</h1>
      <p className="text-[13px] text-[var(--ink-faint)] mb-7">
        {pessoas.length} {pessoas.length === 1 ? 'conta' : 'contas'} ·{' '}
        {comAcesso} com acesso liberado · {admins}{' '}
        {admins === 1 ? 'admin' : 'admins'}
      </p>

      <div className="bg-[var(--raised)] rounded-lg p-4 mb-7 text-[13px] text-[var(--ink-dim)] leading-relaxed">
        Qualquer pessoa pode criar conta sozinha, e quem cria não vê resumo
        nenhum até você liberar aqui. O pagamento ainda é confirmado por você:
        quando o Pix cair, escolha o plano e marque como ativo.
      </div>

      {pessoas.length === 0 ? (
        <p className="border border-dashed border-[var(--line-forte)] rounded-lg px-6 py-12 text-center text-sm text-[var(--ink-faint)]">
          Nenhuma conta criada ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 list-none m-0 p-0">
          {pessoas.map((p) => (
            <LinhaPessoa key={p.user_id} pessoa={p} souEu={p.user_id === userId} />
          ))}
        </ul>
      )}
    </div>
  )
}

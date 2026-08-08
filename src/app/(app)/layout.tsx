import { redirect } from 'next/navigation'
import { getSessao } from '@/lib/sessao'
import { getResumos, agruparPorMateria } from '@/lib/resumos'
import Sidebar from './Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId, plano, isAdmin, isAdminReal, vendoComoAluno } = await getSessao()
  if (!userId) redirect('/login')

  const grupos = agruparPorMateria(await getResumos())

  return (
    <div className="flex min-h-screen">
      <Sidebar
        grupos={grupos}
        isAdmin={isAdmin}
        isAdminReal={isAdminReal}
        vendoComoAluno={vendoComoAluno}
        plano={plano}
      />
      {/* `pt-12` reserva a altura da barra do celular, que é `fixed` e ficaria
          por cima do começo do conteúdo. A partir de `lg` a barra some e o
          espaço não faz mais sentido. */}
      <main className="flex-1 min-w-0 pt-12 lg:pt-0">{children}</main>
    </div>
  )
}

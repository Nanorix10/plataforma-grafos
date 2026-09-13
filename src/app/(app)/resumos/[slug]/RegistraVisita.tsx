'use client'

import { useEffect } from 'react'
import { registrarVisita } from '../acoes'

/**
 * Anota que este resumo foi aberto. Não desenha nada.
 *
 * **Por que um componente de cliente para uma escrita de servidor.** A visita é
 * um efeito de o NAVEGADOR ter aberto a página, e só o navegador sabe disso. A
 * página em si é renderizada no servidor, e pode sê-lo mais de uma vez sem o
 * aluno ter feito nada — o Next revalida, recarrega e re-renderiza por conta
 * própria. Escrever ali dentro contaria visitas que não aconteceram.
 *
 * O `prefetch` do `<Link>` não dispara isto: ele busca o conteúdo da página,
 * não a monta. Só a navegação de verdade monta o componente.
 *
 * **Sem estado, então sem re-render.** Retorna `null` e não guarda nada; o
 * resultado da ação não interessa a esta tela, porque o histórico só é lido em
 * `/resumos`. Uma falha de rede aqui custa uma linha de histórico, e não vale
 * um aviso na tela de quem está tentando ler.
 */
export default function RegistraVisita({ resumoId }: { resumoId: string }) {
  useEffect(() => {
    registrarVisita(resumoId)
  }, [resumoId])

  return null
}

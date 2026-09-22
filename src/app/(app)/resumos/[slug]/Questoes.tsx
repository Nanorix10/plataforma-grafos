'use client'

import { useEffect, useState } from 'react'
import type { Resposta } from '@/lib/respostas'
import { responder } from '../acoes-respostas'

/**
 * Dá vida às questões que `prepararQuestoes` (lib/questoes.ts) marcou no HTML.
 *
 * Um ouvinte só, no contêiner, como a lupa (decisão 19): o corpo é HTML cru e
 * não há componente React por questão. Tudo o que muda na tela muda por
 * ATRIBUTO (`data-estado`, `aria-pressed`) e o CSS desenha — inclusive os
 * selos "gabarito" e "sua resposta", que vêm de `::after` e por isso não
 * entram no texto que os grifos usam como âncora (decisão 21). O único texto
 * que muda é o veredito, que fica fora das alternativas.
 *
 * **Refazer começa do zero.** A última tentativa aparece como uma linha ("Da
 * última vez você errou — marcou B"), mas as alternativas voltam limpas: quem
 * chega pela lista "Para refazer" quer tentar de novo, e abrir a questão já
 * corrigida entregaria a resposta.
 */
export default function Questoes({
  resumoId,
  respostas,
  seletor,
}: {
  resumoId: string
  respostas: Resposta[]
  seletor: string
}) {
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const conteudo = document.querySelector(seletor)
    if (!conteudo) return

    for (const r of respostas) {
      const aside = conteudo.querySelector<HTMLElement>(`#q-${r.questao_id}`)
      if (!aside) continue
      if (aside.dataset.tipo === 'aberta') {
        pressionar(aside, r.acertou ? 'acertei' : 'errei')
      } else {
        veredito(aside, historico(r, aside.dataset.tipo))
      }
    }

    function salvar(aside: HTMLElement, acertou: boolean, resposta: string | null) {
      setErro(null)
      void responder({
        resumoId,
        questaoId: aside.id.slice(2),
        acertou,
        resposta,
        trecho: (aside.querySelector('p')?.textContent ?? '').trim().slice(0, 160),
      }).then((ok) => {
        if (!ok) setErro('Não deu para guardar sua resposta. Confira a conexão e responda de novo.')
      })
    }

    function agir(alvo: Element) {
      const aside = alvo.closest<HTMLElement>('aside.questao[data-tipo]')
      if (!aside) return false
      const tipo = aside.dataset.tipo

      const comoFoi = alvo.closest<HTMLElement>('[data-como-foi]')
      if (comoFoi) {
        const valor = comoFoi.dataset.comoFoi as 'acertei' | 'errei'
        pressionar(aside, valor)
        salvar(aside, valor === 'acertei', null)
        return true
      }

      if (alvo.closest('.de-novo')) {
        reiniciar(aside)
        return true
      }

      if (tipo === 'somatoria' && alvo.closest('.conferir-soma')) {
        if (aside.dataset.respondida) return true
        conferirSoma(aside, salvar)
        return true
      }

      const alternativa = alvo.closest<HTMLElement>('.alternativa')
      if (!alternativa || aside.dataset.respondida) return false

      if (tipo === 'objetiva') {
        corrigirObjetiva(aside, alternativa.dataset.opcao!, salvar)
      } else if (tipo === 'somatoria') {
        const ligado = alternativa.getAttribute('aria-pressed') === 'true'
        alternativa.setAttribute('aria-pressed', String(!ligado))
        veredito(aside, `Sua soma: ${dois(somaMarcada(aside))}`)
      }
      return true
    }

    function aoClicar(e: Event) {
      agir(e.target as Element)
    }
    // As alternativas são `<p role="button">`, e não `<button>`: trocar a tag
    // mudaria o HTML que os grifos e o trilho contam. Então o teclado é nosso.
    function aoTeclar(e: KeyboardEvent) {
      const alvo = e.target as Element
      if (!alvo.matches?.('.alternativa[role="button"]')) return
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault() // o espaço rolaria a página
      agir(alvo)
    }

    conteudo.addEventListener('click', aoClicar)
    conteudo.addEventListener('keydown', aoTeclar as EventListener)
    return () => {
      conteudo.removeEventListener('click', aoClicar)
      conteudo.removeEventListener('keydown', aoTeclar as EventListener)
    }
  }, [resumoId, respostas, seletor])

  return (
    <p role="status" className="text-[length:var(--t-peq)] text-[var(--erro)] empty:hidden mt-4">
      {erro}
    </p>
  )
}

// ---------------------------------------------------------------------------

function alternativas(aside: HTMLElement) {
  return [...aside.querySelectorAll<HTMLElement>('.alternativa')]
}

function veredito(aside: HTMLElement, texto: string, deNovo = false) {
  const alvo = aside.querySelector('.questao-veredito')
  if (!alvo) return
  alvo.textContent = texto
  if (deNovo) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'de-novo'
    b.textContent = 'Tentar de novo'
    alvo.append(' ', b)
  }
}

function abrirResolucao(aside: HTMLElement) {
  aside.querySelectorAll('details.resolucao').forEach((d) => ((d as HTMLDetailsElement).open = true))
}

/** Depois de corrigida, a alternativa deixa de ser botão — para o teclado e para o leitor de tela. */
function travar(aside: HTMLElement) {
  aside.dataset.respondida = 'sim'
  for (const a of alternativas(aside)) {
    a.setAttribute('tabindex', '-1')
    a.setAttribute('aria-disabled', 'true')
  }
}

function corrigirObjetiva(
  aside: HTMLElement,
  escolhida: string,
  salvar: (aside: HTMLElement, acertou: boolean, resposta: string) => void
) {
  const gabarito = (aside.dataset.gabarito ?? '').toUpperCase()
  const acertou = escolhida === gabarito
  for (const a of alternativas(aside)) {
    const opcao = a.dataset.opcao
    a.dataset.estado = opcao === gabarito ? 'certa' : opcao === escolhida ? 'errada' : 'apagada'
  }
  travar(aside)
  veredito(aside, acertou ? 'Você acertou.' : `Você marcou ${escolhida}. A resposta é ${gabarito}.`, true)
  abrirResolucao(aside)
  salvar(aside, acertou, escolhida)
}

function somaMarcada(aside: HTMLElement) {
  return alternativas(aside)
    .filter((a) => a.getAttribute('aria-pressed') === 'true')
    .reduce((s, a) => s + Number(a.dataset.opcao), 0)
}

function conferirSoma(
  aside: HTMLElement,
  salvar: (aside: HTMLElement, acertou: boolean, resposta: string) => void
) {
  const gabarito = Number(aside.dataset.gabarito)
  const soma = somaMarcada(aside)
  // Somatória se corrige item a item: cada potência de 2 do gabarito é um item
  // certo, e a decomposição é única. Mostrar só "errou a soma" esconderia
  // QUAL item derrubou o aluno, que é o que ele precisa saber.
  for (const a of alternativas(aside)) {
    const valor = Number(a.dataset.opcao)
    const correto = (gabarito & valor) !== 0
    const marcado = a.getAttribute('aria-pressed') === 'true'
    a.dataset.estado = correto && marcado ? 'certa' : correto ? 'faltou' : marcado ? 'errada' : 'apagada'
  }
  travar(aside)
  const acertou = soma === gabarito
  veredito(
    aside,
    acertou
      ? `Você acertou: soma ${dois(soma)}.`
      : `Sua soma: ${dois(soma)}. A resposta é ${dois(gabarito)}.`,
    true
  )
  abrirResolucao(aside)
  salvar(aside, acertou, dois(soma))
}

function reiniciar(aside: HTMLElement) {
  delete aside.dataset.respondida
  for (const a of alternativas(aside)) {
    delete a.dataset.estado
    a.setAttribute('tabindex', '0')
    a.removeAttribute('aria-disabled')
    if (aside.dataset.tipo === 'somatoria') a.setAttribute('aria-pressed', 'false')
  }
  veredito(aside, '')
  aside.querySelectorAll('details.resolucao').forEach((d) => ((d as HTMLDetailsElement).open = false))
  alternativas(aside)[0]?.focus()
}

function pressionar(aside: HTMLElement, valor: 'acertei' | 'errei') {
  aside
    .querySelectorAll<HTMLElement>('[data-como-foi]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.comoFoi === valor)))
}

function historico(r: Resposta, tipo: string | undefined) {
  const como =
    r.resposta == null ? '' : tipo === 'somatoria' ? ` — somou ${r.resposta}` : ` — marcou ${r.resposta}`
  return r.acertou ? `Da última vez você acertou${como}.` : `Da última vez você errou${como}.`
}

function dois(n: number) {
  return String(n).padStart(2, '0')
}

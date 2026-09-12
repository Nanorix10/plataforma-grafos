import Link from 'next/link'

/**
 * O recado de quem ainda não tem o acervo liberado — e o caminho para resolver.
 *
 * **Existe porque o mesmo fato aparecia em duas telas e morava em uma.** A
 * explicação estava escrita à mão dentro de `/conta`, que é justamente a tela
 * onde o aluno novo NÃO cai: depois do cadastro ele vai para `/resumos` e
 * encontra 248 cartões com cadeado, "0 liberados de 248" e nenhuma saída.
 *
 * Copiar a frase para lá criaria duas versões dela. No dia em que o pagamento
 * virar automático — e ele vai, o Pix na mão é estado declarado, não desenho —,
 * uma seria corrigida e a outra continuaria dizendo "a liberação é feita à mão".
 * É a regra do `CONTEXTO.md`: um fato, um arquivo.
 *
 * A moldura fica com quem chama, via `className`: na conta o bloco é um rodapé
 * com linha acima, na lista é um cartão inteiro antes dos resumos. O que não
 * varia — o texto e para onde o botão leva — mora aqui.
 */

const TEXTO = {
  nenhum:
    'Sua conta ainda não tem acesso liberado. A liberação é feita à mão depois do pagamento.',
  parcial: 'Quer os outros vestibulares? O Acesso Completo libera os três.',
} as const

export function AvisoAcesso({
  caso,
  className = '',
}: {
  caso: keyof typeof TEXTO
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-[12.5px] text-[var(--ink-dim)] mb-3">{TEXTO[caso]}</p>
      <Link href="/#planos" className="botao botao-primario !rounded-lg px-4 py-2 text-[13px]">
        Ver planos
      </Link>
    </div>
  )
}

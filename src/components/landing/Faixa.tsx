import { NUMEROS_DA_FAIXA } from '@/lib/numeros'

/**
 * A única superfície saturada do site inteiro — azul-marinho nos dois temas
 * (ver decisão 4b). Existe para quebrar a sequência de seções iguais no meio
 * da rolagem; sem ela a landing lê como uma parede só.
 *
 * É também o único elemento em `--faixa` da página, e tem que continuar sendo:
 * a regra é no máximo um por tela. Dois pontos gritando na mesma rolagem
 * anulam um ao outro.
 *
 * Os valores vêm de `lib/numeros.ts`, e o cabeçalho daquele arquivo diz o que
 * eles são e o que NÃO são. Não derive nada deles aqui.
 */
export default function Faixa() {
  return (
    <section className="bg-[var(--faixa)] py-14">
      <div className="max-w-[1120px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {NUMEROS_DA_FAIXA.map((n) => (
          <div key={n.label}>
            {/* `.numeros` é a classe do sistema para número em destaque —
                antes isto era um `text-[32px]` inventado no componente. */}
            <div className="numeros text-[length:var(--t-titulo)] font-medium text-[var(--faixa-ink)]">
              {n.valor}
            </div>
            <div className="text-[length:var(--t-peq)] text-[var(--faixa-dim)] mt-1">
              {n.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

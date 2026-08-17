import Image from 'next/image'
import { AUTOR } from '@/lib/autor'

/**
 * Quem escreveu o material.
 *
 * A landing afirma que o material é de quem passou pela prova, e essa frase
 * precisa de alguém atrás dela. Sem esta seção, a headline é uma frase; com
 * ela, é uma atribuição.
 *
 * **A composição é assimétrica de propósito.** Foto de um lado, texto do outro,
 * e os três pontos numa lista corrida em vez de três cartões — cartão de ícone
 * com título e parágrafo, repetido, é o desenho que toda landing gerada tem.
 * Aqui a lista é lista.
 *
 * **Tudo o que pode faltar, falta sem quebrar.** Sem foto, o texto ocupa a
 * largura de leitura. Sem conquista cadastrada, a seção mostra o método e não
 * faz afirmação de desempenho. Ver `lib/autor.ts`.
 */
export default function Autor() {
  const { nome, conquistas, pontos, foto } = AUTOR

  return (
    <section
      id="autor"
      className="py-[var(--ritmo-secao)] max-w-[1120px] mx-auto px-8"
    >
      <div
        className={
          foto
            ? 'grid lg:grid-cols-[0.85fr_1fr] gap-12 items-start'
            : 'max-w-[68ch]'
        }
      >
        {foto && (
          /* `width`/`height` declarados: sem eles o navegador não reserva o
             espaço e a página pula quando a imagem chega, que é exatamente o
             "caótico" que se quer evitar. `sizes` para o celular não baixar a
             versão de desktop. */
          <Image
            src={foto.src}
            alt={foto.alt}
            width={foto.largura}
            height={foto.altura}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="w-full h-auto rounded-[var(--raio)]"
          />
        )}

        <div>
          <div className="rotulo-secao mb-3">Quem escreveu</div>
          <h2 className="text-[length:var(--t-titulo)] font-medium mb-4">
            O material é de {nome}, e ele prestou as mesmas provas que você.
          </h2>

          {conquistas.length > 0 && (
            /* Só aparece com dado real. Uma afirmação de desempenho sem número
               e sem ano ao lado enfraquece em vez de vender. */
            <ul className="mb-6 space-y-2">
              {conquistas.map((c) => (
                <li key={`${c.titulo}-${c.ano}`} className="flex items-baseline gap-2.5">
                  <span className="numeros text-[length:var(--t-medio)] font-medium text-[var(--acento)]">
                    {c.ano}
                  </span>
                  <span className="text-[length:var(--t-base)]">
                    <strong className="font-medium">{c.titulo}</strong>
                    <span className="text-[var(--ink-faint)]"> · {c.onde}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <dl className="space-y-5">
            {pontos.map((p) => (
              <div key={p.titulo}>
                <dt className="font-medium text-[length:var(--t-base)] mb-1">
                  {p.titulo}
                </dt>
                <dd className="text-sm text-[var(--ink-dim)] leading-relaxed max-w-[60ch]">
                  {p.texto}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

import { AUTOR } from '@/lib/autor'

/**
 * Quem escreveu o material.
 *
 * **Nada aqui é escrito à mão.** Nome, conquistas e pontos saem de
 * `lib/autor.ts`, que é a fonte única — e onde está registrado por que o tempo
 * verbal do primeiro lugar é o presente ("está em 1º lugar" e não "tirou"): o
 * PASSE é seriado, liderar hoje não é ter vencido, e a frase no passado
 * afirmaria um resultado final que ainda não existe.
 *
 * **A foto saiu no redesenho de 31/08.** Ela era metade da seção e vendia o
 * ritual de estudar; numa página que passou a ser tipográfica inteira, uma
 * fotografia de mesa de madeira era o único objeto figurativo da rolagem e
 * ficava órfã. O campo `AUTOR.foto` continua existindo e continua preenchido —
 * se a seção voltar a querer imagem, o dado está lá.
 *
 * **O `.proprio` no nome não é detalhe.** A gramática da landing aplica
 * `text-transform: lowercase` a toda declaração, e sem ele o nome do autor
 * sairia "leandro" — que não é estilo, é erro. Mesma coisa com a sigla do
 * ENEM, logo abaixo.
 */
export default function Autor() {
  return (
    <section id="autor" className="py-[var(--ritmo-secao)] max-w-[1240px] mx-auto px-6 sm:px-10">
      <div className="grid gap-6 mb-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">quem escreve</p>
        <h2 className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)]" data-atraso="1">
          prazer, eu sou o <em className="proprio">{AUTOR.nome}</em>.
        </h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-20 lg:items-start">
        <div className="reveal">
          <p className="text-[var(--ink-dim)] max-w-[62ch] leading-relaxed mb-12">
            eu presto as mesmas provas que você. escrevi cada resumo deste acervo do zero, do meu
            lado da carteira — não é professor supondo onde o aluno trava, é quem travou escolhendo
            por onde começar.
          </p>

          <ul className="border-t border-[var(--line)]">
            {AUTOR.conquistas.map((c) => (
              <li
                key={c.titulo}
                className="grid gap-1.5 py-6 border-b border-[var(--line)]"
              >
                <span className="rotulo text-[var(--acento)] tabular-nums">{c.ano}</span>
                <b className="font-normal text-[1.375rem] leading-snug lowercase text-[var(--ink)]">
                  {/* A sigla escapa do lowercase pela mesma razão do nome. */}
                  {c.titulo.split('ENEM').length > 1 ? (
                    <>
                      {c.titulo.split('ENEM')[0]}
                      <span className="proprio">ENEM</span>
                      {c.titulo.split('ENEM')[1]}
                    </>
                  ) : (
                    c.titulo
                  )}
                </b>
                <span className="text-[var(--ink-faint)] text-[0.9rem] leading-relaxed">
                  {c.onde}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal grid gap-9" data-atraso="1">
          {AUTOR.pontos.map((p) => (
            <div key={p.titulo} className="grid gap-2">
              <b className="font-normal text-[1.375rem] leading-snug lowercase text-[var(--ink)]">
                {p.titulo}
              </b>
              <p className="text-[var(--ink-dim)] text-[0.95rem] leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Espera da conta.
 *
 * Era a única rota do `(app)` sem tela de espera, e ela é dinâmica como as
 * outras — a página faz duas idas à rede em série (`auth.getUser()` e a linha
 * de `planos_usuarios`), então é das mais lentas a chegar, não das mais
 * rápidas. Sem isto, clicar em "Conta" na barra deixava a interface parada sem
 * sinal nenhum (decisão 9e).
 *
 * O esqueleto imita a FORMA da página — os quatro cartões empilhados na
 * largura de leitura —, não um "carregando" centralizado.
 *
 * **O que ele NÃO desenha, de propósito:** o selo de admin, o aviso de troca de
 * e-mail pendente e o bloco "Ver planos" são condicionais. Um esqueleto que os
 * mostrasse anunciaria uma tela que, para a maioria de quem abre, não vem — é
 * a mesma razão pela qual o esqueleto da linha do tempo perdeu as caixas dos
 * rótulos.
 *
 * **Por que as barras usam `.esqueleto-em-cartao`.** Esta é a primeira tela de
 * espera cujo conteúdo cai dentro de cartões `--raised`, e lá o `.esqueleto`
 * puro some no tema escuro: `--sel` e `--raised` são a mesma cor. O cartão
 * apareceria e o miolo não, sem nada acusar. A variante está em `globals.css`,
 * ao lado da regra que ela conserta.
 *
 * As três linhas de vestibular são o número real de `PROVAS` (`lib/processos.ts`),
 * e não um número bonito: a lista aparece inteira para todo mundo, com o
 * liberado marcado, então aqui a contagem é conhecida de antemão.
 */
export default function Carregando() {
  return (
    <div className="max-w-[680px] mx-auto px-5 py-8 sm:px-8 sm:py-11">
      <div className="esqueleto h-7 w-[140px] mb-2" />
      <div className="esqueleto h-4 w-[260px] mb-8" />

      {/* ---- identidade ---- */}
      <section className="bg-[var(--raised)] rounded-lg p-5 mb-4">
        <div className="esqueleto esqueleto-em-cartao h-3 w-[52px] mb-2" />
        <div className="esqueleto esqueleto-em-cartao h-4 w-[210px]" />
        <div className="esqueleto esqueleto-em-cartao h-3 w-[175px] mt-3" />
      </section>

      {/* ---- plano ---- */}
      <section className="bg-[var(--raised)] rounded-lg p-5 mb-4">
        <div className="flex items-baseline gap-2.5 mb-4">
          <div>
            <div className="esqueleto esqueleto-em-cartao h-3 w-[42px] mb-2" />
            <div className="esqueleto esqueleto-em-cartao h-4 w-[130px]" />
          </div>
          <div className="esqueleto esqueleto-em-cartao h-3 w-[44px] ml-auto" />
        </div>

        <div className="esqueleto esqueleto-em-cartao h-3 w-[80px] mb-3" />
        <div className="flex flex-col gap-2">
          {[132, 96, 104].map((l, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="esqueleto esqueleto-em-cartao w-4 h-4 shrink-0 !rounded-full" />
              <div className="esqueleto esqueleto-em-cartao h-3.5" style={{ width: l }} />
              <div className="esqueleto esqueleto-em-cartao h-3 w-[62px] ml-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* ---- trocar e-mail, trocar senha e sair ----
          Os três cartões têm a mesma anatomia (rótulo, explicação, botão) e a
          gaveta das trocas nasce fechada, então o esqueleto deles é o mesmo. */}
      {[
        { titulo: 60, linhas: [96, 58], botao: 118 },
        { titulo: 46, linhas: [92, 44], botao: 112 },
        { titulo: 54, linhas: [98, 66], botao: 106 },
      ].map((cartao, i) => (
        <section
          key={i}
          className={`bg-[var(--raised)] rounded-lg p-5 ${i < 2 ? 'mb-4' : ''}`}
        >
          <div className="esqueleto esqueleto-em-cartao h-3 mb-2.5" style={{ width: cartao.titulo }} />
          <div className="flex flex-col gap-1.5 mb-4">
            {cartao.linhas.map((l, j) => (
              <div key={j} className="esqueleto esqueleto-em-cartao h-3" style={{ width: `${l}%` }} />
            ))}
          </div>
          <div className="esqueleto esqueleto-em-cartao h-[34px] !rounded-lg" style={{ width: cartao.botao }} />
        </section>
      ))}
    </div>
  )
}

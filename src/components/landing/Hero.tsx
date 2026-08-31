import GrafoInterativo from './GrafoInterativo'

/**
 * A primeira dobra — **direção B: o mapa primeiro**.
 *
 * ============================================================
 * O QUE MUDOU, E POR QUE
 * ============================================================
 * A dobra anterior era uma afirmação sobre o autor ("Os resumos de quem está
 * em 1º lugar em medicina no PASSE") sobre uma textura de grafo, com o grafo
 * de verdade três seções abaixo, dentro do "Por dentro". Ela apostava na
 * reputação: o argumento mais forte que o produto tem, e o mais difícil de
 * copiar.
 *
 * A direção B aposta no oposto — **a dobra É o produto**. O visitante toca num
 * assunto e vê as ligações dele antes de ler qualquer promessa. A troca foi
 * escolhida pelo Leandro entre três direções desenhadas em 26/08
 * (`design/landing/`), e o tradeoff está registrado na anotação do canvas, com
 * todas as letras: **B chega mais longe com quem fica, e perde mais gente na
 * porta**, porque exige entender uma abstração em três segundos. A evidência
 * de que ela não é óbvia é do próprio site — "O que é esse negócio de grafo?"
 * é uma das perguntas cadastradas no FAQ.
 *
 * A prova não sumiu: o autor passou a ser a **primeira seção abaixo da dobra**,
 * que é onde a página responde "por que acreditar em você" depois de já ter
 * respondido "o que é isso".
 *
 * ============================================================
 * A TEXTURA DE GRAFO SAIU, E ISSO NÃO É PERDA
 * ============================================================
 * O `marca/Grafo.tsx` desenhava um grafo decorativo atrás do texto, com
 * máscara para não sujar a contraforma das letras. Ele existia porque a dobra
 * falava de conexões sem mostrar nenhuma — era o lastro visual da palavra.
 *
 * Agora a dobra tem o grafo DE VERDADE, tocável. Manter os dois seria duas
 * figuras da mesma ideia disputando a mesma tela, e a decorativa venceria a
 * funcional no canto do olho. Regra 1 daquele arquivo: textura fica atrás do
 * conteúdo. Aqui o conteúdo virou a própria figura, então a textura não tem
 * mais atrás de quê ficar.
 *
 * ============================================================
 * O QUE A DOBRA NÃO AFIRMA
 * ============================================================
 * O `h1` novo — "Seus conhecimentos, todos conectados." — é uma descrição do
 * que a pessoa está vendo funcionar logo abaixo dele, e não uma promessa que
 * precise de prova. É de propósito: o `PRODUCT.md` fixa que onde a reputação é
 * o argumento nada é inventado, e a saída mais limpa para uma dobra que já não
 * lidera pela reputação é **não afirmar nada que o desenho não demonstre**.
 */
export default function Hero() {
  return (
    <header className="max-w-[1120px] mx-auto px-8 pt-[var(--ritmo-secao)] pb-[var(--ritmo-secao)]">
      {/* A coluna de texto é estreita mesmo com o grafo largo embaixo: quem
          decide a largura é a linha de leitura, não o espaço disponível. */}
      <div className="max-w-[720px] mb-11">
        <div className="rotulo-secao mb-5 text-[var(--acento-claro)]">
          Preparação PASSE · PAS-UEM · PAS-UnB
        </div>
        <h1 className="text-[length:var(--t-hero)] leading-[1.03] font-normal mb-6 text-balance">
          Seus conhecimentos, todos conectados.
        </h1>
        <p className="text-base leading-relaxed text-[var(--ink-dim)] max-w-[52ch]">
          {/* "abaixo" e não "ao lado": no celular o grafo cai embaixo do texto,
              e uma instrução que aponta para o lugar errado em metade dos
              aparelhos é pior do que nenhuma. */}
          Toque num assunto abaixo. O que aparece é o material de verdade — cada
          resumo sabe dentro de que ele está e quais outros ele cita.
        </p>
      </div>

      <GrafoInterativo />

      {/* Os botões vêm DEPOIS do grafo, como no artboard. É a consequência
          honesta de "a dobra é o produto": pedir a assinatura antes de mostrar
          o que ela compra desmancharia a aposta inteira da direção B. */}
      <div className="flex items-center gap-5 flex-wrap mt-11">
        <a href="#planos" className="botao botao-primario">
          Ver planos de acesso
        </a>
        <a
          href="#materias"
          /* `py-2` pelo alvo de toque, não pelo desenho: sem ele o link media
             162x20 no celular, abaixo do mínimo de 24px da WCAG 2.2 (critério
             2.5.8). O botão ao lado tem 44px de altura, então o padding também
             alinha os dois pelo meio. */
          className="py-2 text-sm underline underline-offset-[3px] decoration-[var(--ink-faint)] hover:decoration-[var(--ink)]"
        >
          Ver matérias disponíveis
        </a>
      </div>
    </header>
  )
}

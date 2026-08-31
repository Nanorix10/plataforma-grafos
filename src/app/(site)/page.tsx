import Dobra from '@/components/landing/Dobra'
import Portas from '@/components/landing/Portas'
import Faixa from '@/components/landing/Faixa'
import Autor from '@/components/landing/Autor'
import Materias from '@/components/landing/Materias'
import Velocidades from '@/components/landing/Velocidades'
import Depoimentos from '@/components/landing/Depoimentos'
import Planos from '@/components/landing/Planos'
import Faq from '@/components/landing/Faq'
import Fechamento from '@/components/landing/Fechamento'
import Movimento from '@/components/landing/Movimento'

/**
 * A landing — **redesenho de 31/08**, na linguagem visual que o Leandro
 * escolheu a partir da Instituto Futuros.
 *
 * ============================================================
 * O QUE ESTA PÁGINA CONTRARIA, E POR DECISÃO DE QUEM
 * ============================================================
 * Quatro regras de `docs/identidade-visual.md` foram suspensas AQUI, e só
 * aqui. Elas continuam valendo no `(app)` inteiro e em `/planos`:
 *
 * 1. **A monoespaçada "nunca em frase" (§3).** A landing é IBM Plex Mono
 *    inteira, num peso só.
 * 2. **"Quase nada se move" (§7).** Há reveal por rolagem, cascata e uma
 *    parallaxe de fundo presa à rolagem, em `Movimento`.
 * 3. **O acento escasso e o neutro morno da primeira tela (§2).** A dobra é um
 *    campo saturado escuro nos dois temas.
 * 4. **"Os motivos vêm do conteúdo" (§6).** A textura de grafo do fundo é
 *    decorativa, e o grafo tocável saiu.
 *
 * O QUE O `<noscript>` ABAIXO CONSERTA
 * ============================================================
 * `.landing .reveal` esconde por CSS, sem condição — é assim que a página não
 * pisca entre o HTML do servidor e a hidratação. O preço é que, sem
 * JavaScript, a classe que revela nunca chega e a landing fica EM BRANCO. Era
 * um defeito real desde 31/08: o cabeçalho do reveal antigo afirmava que o
 * conteúdo nascia visível, e o CSS dizia o contrário. O `<noscript>` devolve a
 * opacidade sem custar um byte para quem tem JavaScript.
 *
 * O ADR `docs/adr/0001-identidade-visual.md` diz que o `globals.css` é a fonte
 * da verdade e que o documento é que se corrige quando os dois divergem. Foi o
 * que se fez: a gramática está escrita no CSS, escopada em `.landing`, com o
 * motivo em cima dela.
 *
 * ============================================================
 * A ORDEM É O ARGUMENTO
 * ============================================================
 * o que é (Dobra) → por onde entrar (Portas) → o percurso de três anos
 * (Faixa) → quem escreveu (Autor) → o acervo (Materias) → onde se lê
 * (Velocidades) → quem já usou (Depoimentos) → quanto custa (Planos) → o que
 * trava (Faq) → a conta (Fechamento).
 *
 * **`Portas` vem antes de tudo por causa da dobra.** A dobra fala de mapa, que
 * é uma das quatro entradas do produto e a mais difícil de entender em três
 * segundos — a evidência é do próprio site, onde a pergunta sobre o que é um
 * grafo está cadastrada no FAQ. A seção seguinte existe para dizer, antes de
 * qualquer outra coisa, que ninguém é obrigado a entrar por ali.
 *
 * **`Depoimentos` continua na lista e continua devolvendo `null`**, porque a
 * lista de depoimentos está vazia. Ele fica aqui para voltar sozinho no dia em
 * que houver depoimento de verdade — e a página encurta em vez de exibir bloco
 * vazio. Preencher com nome fictício numa landing que vende reputação não é
 * placeholder, é a destruição do argumento.
 *
 * ============================================================
 * O QUE FICOU PARA TRÁS
 * ============================================================
 * `GrafoInterativo.tsx` não é mais referenciado por ninguém. Ele era a dobra
 * da direção B, funciona, e está documentado — por isso não foi apagado junto.
 * Se o redesenho se confirmar, apagá-lo é a próxima limpeza.
 *
 * Barra e rodapé não estão aqui: são moldura do site aberto e vivem em
 * `(site)/layout.tsx`. **Eles NÃO foram redesenhados**, porque `/planos` os
 * divide — a barra segue em Bricolage sobre uma página monoespaçada, e isso é
 * uma emenda visível que ficou em aberto.
 */
export default function LandingPage() {
  return (
    <Movimento>
      <noscript>
        <style>{'.landing .reveal{opacity:1!important;transform:none!important}'}</style>
      </noscript>
      <Dobra />
      <Portas />
      <Faixa />
      <Autor />
      <Materias />
      <Velocidades />
      <Depoimentos />
      <Planos />
      <Faq />
      <Fechamento />
    </Movimento>
  )
}

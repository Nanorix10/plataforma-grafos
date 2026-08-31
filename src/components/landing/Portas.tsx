import ListaGrande, { type ItemDaLista } from './ListaGrande'

/**
 * As quatro portas — por onde o aluno de fato entra no acervo.
 *
 * **Elas não foram inventadas para a página.** São as quatro entradas que o
 * `PRODUCT.md` registra como confirmadas: revisar às vésperas, percorrer o
 * edital do começo ao fim, tirar uma dúvida pontual e ver como os assuntos se
 * conectam. Ali está escrito também o que esta seção existe para consertar —
 * que o produto não pode ser desenhado como se só a última importasse, nem
 * como se ela fosse enfeite.
 *
 * A landing anterior não tinha essa seção, e a dobra dela apostava tudo na
 * quarta porta. Este é o contrapeso: a dobra segue falando de mapa, e logo
 * abaixo a página diz, com todas as letras, que ninguém é obrigado a entrar
 * por ali.
 */
const PORTAS: readonly ItemDaLista[] = [
  {
    rotulo: 'às vésperas',
    titulo: 'revisar',
    texto:
      'abrir a matéria, varrer os títulos e parar no que ficou frouxo. no celular, em pé, quinze minutos antes de entrar.',
  },
  {
    rotulo: 'do começo ao fim',
    titulo: 'percorrer o edital',
    texto:
      'o edital é um eixo próprio: cada tópico cobrado aparece com o resumo que o cobre — e com o que ainda não tem resumo, sem fingir que tem.',
  },
  {
    rotulo: 'uma dúvida só',
    titulo: 'destravar um assunto',
    texto:
      'chegar direto num tópico, ler, e sair pelos links que ele cita quando a dúvida estava um degrau atrás do que você achava.',
  },
  {
    rotulo: 'o mapa',
    titulo: 'ver tudo se ligando',
    texto:
      'o grafo, a árvore de assuntos e a linha do tempo dos eventos históricos — três eixos independentes sobre o mesmo acervo.',
  },
]

export default function Portas() {
  return (
    <section id="portas" className="py-[var(--ritmo-secao)] max-w-[1240px] mx-auto px-6 sm:px-10">
      <div className="grid gap-6 mb-[clamp(3rem,6vw,4.5rem)]">
        <p className="rotulo reveal">por dentro</p>
        <h2 className="declaracao reveal text-[clamp(2rem,4.4vw,2.875rem)]" data-atraso="1">
          ninguém estuda de um jeito só.
        </h2>
        <p
          className="reveal text-[clamp(1.5rem,2.6vw,2.125rem)] leading-tight lowercase text-[var(--acento)]"
          data-atraso="2"
        >
          escolha por onde entrar:
        </p>
      </div>

      <ListaGrande itens={PORTAS} />
    </section>
  )
}

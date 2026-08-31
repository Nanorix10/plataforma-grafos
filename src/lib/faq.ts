/**
 * As perguntas que decidem a compra.
 *
 * FAQ numa página de venda não é suporte, é a última objeção antes do Pix. Por
 * isso as perguntas aqui são as que travam a decisão — como recebo, quanto
 * dura, serve pro meu ano, e se eu não gostar —, e não "o que é a Plataforma
 * Grafos", que a página inteira já responde.
 *
 * **`resposta: null` não é renderizada**, e isso é a regra que importa. Resposta
 * pela metade sobre reembolso é pior que pergunta ausente: o comprador lê como
 * evasiva justamente no ponto em que está decidindo confiar. Então a pergunta
 * fica aqui, visível para quem mexe no código, e fora da tela do aluno até
 * existir política escrita.
 */

export type Duvida = {
  pergunta: string
  /** `null` = depende de decisão que ainda não foi tomada. Não vai para a tela. */
  resposta: string | null
}

export const FAQ: Duvida[] = [
  {
    pergunta: 'Como eu recebo o material depois de pagar?',
    /* Isto é o que o sistema faz hoje, e está descrito na decisão 1b do
       CONTEXTO.md: cadastro é aberto, liberação é ato explícito do admin depois
       do Pix. Quando o webhook do Mercado Pago entrar, esta resposta muda — e
       muda aqui, num lugar só. */
    resposta:
      'Você cria sua conta no site e nos avisa do pagamento. A liberação é feita por nós e o acesso aparece na sua conta. Nada é enviado por e-mail ou WhatsApp: o material vive no site.',
  },
  {
    pergunta: 'Preciso baixar algum arquivo?',
    resposta:
      'Não. Tudo é lido no próprio site, pelo navegador do computador ou do celular. Como não há arquivo para baixar, você sempre está lendo a versão mais recente do resumo.',
  },
  {
    pergunta: 'Serve para a etapa que eu vou fazer este ano?',
    resposta:
      'O acervo é organizado por processo seletivo e por etapa, e acompanha o edital do ano. Na página de cada matéria dá para ver em quais processos ela já está disponível.',
  },
  {
    pergunta: 'O que é esse negócio de grafo?',
    resposta:
      /* O ponteiro é para o TOPO da página desde que a landing virou a direção
         B (o grafo subiu para a dobra e a seção "Por dentro" deixou de
         existir). Esta resposta apontava para ela pelo nome, e teria ficado
         mandando o visitante procurar uma seção que não existe mais — o tipo
         de quebra que ninguém vê, porque texto de FAQ não dá erro de build. */
      'É o jeito como o material está montado: cada assunto sabe dentro de que ele está e com quais outros ele se conecta. Logo no topo desta página dá para tocar num assunto e ver as ligações dele.',
  },
  {
    pergunta: 'Quanto tempo dura o meu acesso?',
    /* ⏳ FALTA: decisão do Leandro. Mensal, por etapa, por ano, vitalício?
       A resposta muda o preço e muda o que o cartão de plano diz — hoje ele diz
       "/mês" quando o preço existir, o que já assume mensalidade. */
    resposta: null,
  },
  {
    pergunta: 'E se eu não gostar? Tem reembolso?',
    /* ⏳ FALTA: política de reembolso. Não invento prazo nem condição: é
       promessa contratual, e o Código de Defesa do Consumidor dá 7 dias para
       compra fora de estabelecimento de qualquer forma. Escrever "7 dias" aqui
       por dedução seria eu assinando algo no lugar do Leandro. */
    resposta: null,
  },
  {
    pergunta: 'Posso dividir minha conta com um amigo?',
    /* ⏳ FALTA: decisão. O produto tem visualizador sem download e acesso por
       conta, então tecnicamente a resposta é "uma conta, uma pessoa" — mas o que
       ACONTECE se alguém dividir (aviso, bloqueio, nada) é política, não
       técnica. */
    resposta: null,
  },
]

/** Só o que tem resposta de verdade chega ao aluno. */
export const FAQ_PUBLICO = FAQ.filter(
  (d): d is Duvida & { resposta: string } => d.resposta !== null
)

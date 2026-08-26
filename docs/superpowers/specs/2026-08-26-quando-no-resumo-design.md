# "Quando" no resumo, e para que serve a linha do tempo

**Data:** 2026-08-26
**Estado:** aprovado, implementado

---

## O achado, que vale mais que a mudança

A linha do tempo está documentada no `CONTEXTO.md` (decisão 9d) como um dos
eixos sobre o acervo, ao lado de `pai_id` ("contém"), `conexoes` ("cita") e
`edital_topicos` ("é cobrado em"). Os dados dizem outra coisa.

Contagem dos 84 eventos da `20260825081820_eventos_do_acervo.sql`, por matéria:

| matéria | eventos |
|---|---:|
| História | 69 |
| Literatura | 8 |
| Filosofia | 3 |
| Sociologia | 2 |
| Geografia | 2 |

Biologia (46 resumos), Química (35), Física (30), Matemática e Língua
Portuguesa têm **zero**.

**Isso não é acidente da leva, é estrutural.** A regra de carga — só vira evento
quem tem o ano escrito pelo autor — cruzada com a natureza das matérias
significa que não existe safra futura que equilibre a distribuição. A linha do
tempo é **o eixo da História, com quatro convidados**, e vai continuar sendo.

O texto de venda já sabia: o `INCLUI_SEMPRE` de `lib/planos.ts` anuncia
*"Linha do tempo dos eventos **históricos**"*.

Confirmado com o autor em 2026-08-26: a concentração é o desenho funcionando,
não um desvio. **A linha do tempo é a ferramenta de História**, e as outras
humanidades entram porque também têm data.

### E ela é navegação, não material

Perguntado em que momento o aluno a abre, o autor marcou três dos quatro
cenários oferecidos:

- **para achar um resumo** — "lembro que aquilo era século XVIII";
- **na véspera da prova** — varredura de uma era inteira, com pressa;
- **depois de ler um resumo** — situar o que acabou de ler.

E **não** marcou "no lugar do resumo". Isso resolve uma ambiguidade que estava
no código: o cartão do evento é um link e a `descricao` é sempre vazia (quem
explica é o resumo — isso é índice), mas o eixo é linear de propósito e o
comentário do `LinhaDoTempo.tsx` defende essa escolha dizendo que é o que ensina
que a Idade Média são mil anos e a Revolução Francesa é uma década (isso é
conteúdo). As duas leituras puxavam para lados opostos.

**Vale a de índice.** O eixo linear ensinar escala é propriedade bem-vinda, mas
o trabalho da tela é levar ao resumo a partir do tempo. Onde as duas
interpretações colidirem no futuro, decide esta.

### O buraco que isso expôs

`getEventos` é importado por exatamente dois lugares: a própria
`/linha-do-tempo` e as telas de `/admin/eventos`. A página do resumo nunca
tocou em eventos.

O vínculo `eventos.resumo_id` existe desde agosto e era usado **numa direção
só** — do eixo para o resumo. Dos três momentos que o autor marcou, a tela
servia bem um (achar um resumo, no notebook), servia mal o segundo (véspera, que
acontece no celular, contra um canvas de arrastar e dar zoom) e **não servia** o
terceiro: quem acabava de ler não tinha caminho nenhum para se situar no tempo.

## O que foi construído

Das três abordagens levantadas, o autor escolheu a mínima: fechar o buraco
verificado, sem mexer no resto.

### A superfície

No cabeçalho do resumo, abaixo do "Cai em", um bloco **"Quando"** com a mesma
gramática visual. Some inteiro quando o resumo não tem evento ligado — que é o
caso da maioria, já que 84 eventos cobrem uma fração dos 232 resumos. É a mesma
regra do "Cai em" ausente, do `Depoimentos` vazio e do FAQ com `resposta: null`:
a página encurta em vez de mostrar bloco oco.

O que o bloco mostra depende de quantos eventos o resumo explica:

- **um evento** — a data e o título: `1453 · Queda de Constantinopla`;
- **vários** — o período e a contagem: `476 – 1453 · 12 eventos`.

A regra existe porque os dois extremos são reais. A maior parte dos resumos
datados tem um evento só, onde "1453 · 1 evento" seria bobo; e o
`o-conceito-de-idade-media` sozinho carrega mais de dez, onde listar todos
empurraria o texto do resumo para fora da tela justamente no celular.

Com um evento o rótulo respeita o `rotulo_data` escrito à mão — é ele que
carrega "Séc. V a IX", que dois inteiros não sabem dizer. Com vários a faixa é
derivada dos anos, porque misturar rótulos manuais de eventos diferentes não
daria uma frase.

### A etiqueta clica, e por isso o eixo precisou de destino

O "Cai em" traz esta justificativa por escrito no código:

> Não são links: `/edital` não recebe filtro por prova, e etiqueta que não leva
> a lugar nenhum é pior do que etiqueta que não clica.

É regra da casa, e ela decidiu o desenho: a etiqueta de "Quando" só podia
existir com um lugar para levar. `/linha-do-tempo` passou a aceitar
`?de=<ano>&ate=<ano>` e abre enquadrada nesse período.

É ligação, não maquinário novo — o componente já tinha a janela como estado e o
`irPara` para animá-la. O enquadramento é só o valor **inicial**: a partir do
primeiro gesto a janela é do aluno, e nenhum efeito a traz de volta. Voltar ao
enquadramento do resumo depois de ele ter arrastado seria o mesmo erro que o
botão "Home" evita ao ser botão em vez de comportamento automático.

Parâmetro ausente, vazio, não numérico ou invertido cai no comportamento de
sempre (mostrar tudo), em silêncio. Não é erro do aluno: quem chega com
`?de=abc` colou uma URL torta, e uma tela de erro no lugar da linha do tempo
puniria alguém que só queria ver a linha do tempo.

### Um defeito latente que venceu aqui

O `janelaCheia` do eixo calculava o piso de `JANELA_MINIMA` (5 anos) e **o
jogava fora na linha seguinte**: a folga de 6% saía de `min` e `max` em vez de
sair da janela, então uma faixa de um ponto só terminava com 2 anos de janela —
abaixo do mínimo que a linha acima acabara de calcular.

Ficou invisível porque a única entrada era o acervo inteiro, que abre com
milênios. O link de um resumo com evento pontual (`de` igual a `ate`) é a
primeira entrada capaz de pedir um ponto, e a dívida venceu.

O `wiki/projetos/Linha do tempo.md` tinha previsto o retorno deste piso, e
errado a porta: esperava que voltasse pelo filtro de matéria deixando dois
eventos na tela.

É o **quarto** defeito da mesma família nesta tela — estado derivado de quem
estava presente na hora, e não do dado. Os outros três estão registrados no
vault.

## Fronteiras

| peça | onde | por quê |
|---|---|---|
| `periodoDosEventos`, `enquadrar`, `faixaDeAnos`, `lerEnquadramento`, `JANELA_MINIMA` | `lib/tempo.ts` | módulo puro, sem `next/headers` — é o que permite prová-las |
| consulta dos eventos do resumo | `Promise.all` de `resumos/[slug]/page.tsx` | é o padrão local (o `edital_topicos` está assim) e não custa ida extra ao banco |
| leitura do `searchParams` | `linha-do-tempo/page.tsx` | só a orquestração; a conta está no módulo puro |
| `.ficha` / `.cai-em` | `globals.css` | o traço e o respiro subiram para a ficha, senão duas linhas desenham dois traços |

`lib/eventos.ts` ficou de fora de propósito: ele importa `getSessao`, e a
divisão puro × servidor que o próprio arquivo documenta continua valendo.

**`lerEnquadramento` mora no módulo puro, e não dentro da página, para poder ser
provada.** A página redireciona para `/login` antes de chegar nela, então
exercitar a rota deslogado não exercita essa conta — e é ela que decide o que o
aluno vê ao clicar.

## O custo que este desenho escolhe pagar

**O link manda o aluno para o canvas de arrastar e dar zoom.** No notebook,
ótimo. No celular — que o `PRODUCT.md` fixa como metade do uso, e que é o
aparelho da véspera — ele chega numa tela que não foi desenhada para ele.

O princípio 4 do `PRODUCT.md` não proíbe isso, mas exige que seja declarado em
vez de silencioso. Fica declarado aqui.

A dívida se quita dando ao eixo uma **forma de lista** para telas estreitas — o
mesmo dado, outra forma, exatamente como `/mapa` (canvas) e `/resumos` (lista)
já convivem sobre o mesmo acervo. Foi a abordagem A das três levantadas, e não
foi a escolhida agora.

## Verificação

Não há runner no projeto, então:

- **28 provas** das funções puras, pelo método já usado nas 14 do `tempo.ts`:
  compilar `src/lib/tempo.ts` com `tsc` num diretório temporário e chamar o
  módulo **de verdade**, nunca uma cópia da lógica. Casos: zero eventos, um
  pontual, um com intervalo, vários misturando `ano_fim` nulo, todos no mesmo
  ano, a.C. contraído, faixa cruzando o ano zero; e para a URL, ausente, vazio,
  só um dos dois, texto, decimal, invertido, válido, ano igual e negativo.
  As provas não foram versionadas — o repositório declara não ter suíte, e criar
  a primeira é decisão maior que este PR.
- `npm run build`, que é o único typecheck. Passa.
- `npm run lint`: 5 erros, os mesmos 5 pré-existentes do editor
  (`AlcasImagem`, `EditorCorpo`, `Regua`). Nenhum novo.
- Rotas exercitadas sobre o build, em porta própria: as seis variantes de
  `/linha-do-tempo` e a página do resumo devolvem 307 para `/login` sem erro no
  servidor. **Isso prova pouco**, e está dito de propósito: o `redirect` acontece
  antes do `searchParams` ser lido. A conferência do que o aluno vê depende de
  sessão e fica para o autor.

## Fora de escopo, de propósito

- `eventos.atualizado_em` nunca é atualizada — não há trigger e o `update` não a
  toca.
- A "queda da bastilha" cadastrada à mão se sobrepõe à "Tomada da Bastilha" do
  resumo da Revolução Francesa.
- `Trovadorismo (séculos XII e XII)` repete o XII; o segundo deveria ser XIII.
- `Tratado de Zamorra` entrou com os dois erres que estão no resumo.
- As 753 linhas do `LinhaDoTempo.tsx`, que fazem medição, filtro, zoom,
  animação, arrasto, empacotamento em faixas e centralização de rolagem num
  componente só. Este trabalho não precisou tocar nisso.

## Correção a fazer no `CONTEXTO.md`

A decisão 9d chama a linha do tempo de "o terceiro eixo" e a 9i chama "cai em"
de "o quarto" — mas a 9d também lista três eixos incluindo ela mesma. A
contagem está inconsistente entre as duas decisões, e a descrição de "eixo sobre
o acervo" está desmentida pelos dados. Corrigido junto com este trabalho.

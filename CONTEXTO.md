# Contexto do projeto

Este arquivo existe pra que qualquer sessão nova do Claude entenda o projeto sem
precisar reler tudo. Está ligado ao `CLAUDE.md`, então é carregado automaticamente.

## O que é

**Plataforma Grafos** — site de resumos interligados (estilo Obsidian) para
os vestibulares seriados PASSE (UFMS), PAS UEM e PAS UnB. Alunos assinam um plano
e leem resumos; os resumos se conectam por `[[wikilinks]]` e formam um grafo.

Stack: **Next.js 16** (App Router + Turbopack), React 19, Tailwind CSS v4,
**Supabase** (Postgres + Auth + RLS), TipTap 3 no editor, d3 no grafo.

> ⚠️ Next 16 tem mudanças que quebram o que os modelos aprenderam. Antes de mexer
> em rotas, middleware ou APIs do framework, leia os guias em
> `node_modules/next/dist/docs/`. Exemplo já confirmado: `middleware.ts` virou
> `proxy.ts`.

## Mapa dos arquivos

```
src/lib/
  sessao.ts       getSessao() — auth + plano + admin, memoizado com cache() por request
  resumos.ts      getResumos() + agruparPorMateria()
  materias.ts     MATERIAS: nome, cor e ordem de cada matéria
  processos.ts    PROCESSOS: PASSE, PAS UEM, PAS UnB
  wikilinks.ts    converte [[Título]] em <a href="/resumos/slug">
  supabase/       clientes browser e server (@supabase/ssr)

src/app/
  page.tsx                    landing pública
  login/                      cadastro e login
  (app)/                      TUDO que exige login
    layout.tsx                guard de auth + Sidebar
    Sidebar.tsx               menu estilo Obsidian
    acoes.ts                  alternarVisao() — server action do cookie `visao`
    resumos/                  lista e página do resumo (com backlinks)
    mapa/                     grafo d3 das conexões
    admin/editor/             CRUD de resumos (só admin)
      EditorCorpo.tsx         TipTap com toolbar estilo Google Docs
      wikilinkSuggestion.ts   autocomplete do `[[`
      actions.ts              salvarResumo, excluirResumo, salvarCorpoAuto

supabase/schema.sql           tabelas, RLS e o trigger sync_conexoes_resumo
supabase/migrations/          histórico versionado (aplicado com `supabase db push`)
```

O banco nasceu montado à mão pelo SQL Editor, então o `schema.sql` é a foto do
estado inicial. A partir de agosto/2026 toda mudança vira arquivo em
`supabase/migrations/` e é aplicada pela CLI — o `schema.sql` deve ser atualizado
junto, só pra continuar servindo de leitura.

`(app)` é um **route group** — os parênteses não aparecem na URL.

## Decisões que não dá pra adivinhar lendo o código

**1. Wikilink é texto literal, não nó do TipTap.**
O editor grava `[[Título]]` como texto puro dentro do HTML. Isso é de propósito:
o trigger `sync_conexoes_resumo` no Postgres lê o campo `corpo` com a regex
`\[\[(.+?)\]\]` pra popular a tabela `conexoes`. Se alguém transformar o wikilink
num nó customizado com atributos, o grafo e os backlinks param de funcionar.

**1b. Cadastro é aberto; acesso é fechado por padrão.**
Qualquer pessoa cria conta sozinha em `/login`. Um trigger em `auth.users`
(`criar_plano_do_usuario`) abre a linha correspondente em `planos_usuarios` com
`plano = 'nenhum'` e `ativo = false` — e `PLANO_PROCESSOS.nenhum` é lista vazia,
então quem acabou de se cadastrar não enxerga resumo algum. Liberar é um ato
explícito do admin em `/admin/pessoas`, feito quando o Pix cai.

O e-mail é copiado para `planos_usuarios` de propósito: `auth.users` não é
legível pelas policies normais, e o projeto roda só com a chave anônima (não há
`service_role` em lugar nenhum). Sem essa cópia, a tela de gestão mostraria uma
lista de UUIDs.

Duas armadilhas resolvidas ali, que vão morder de novo se alguém mexer:

- **`eh_admin()` é `security definer`.** As policies de `resumos` perguntam
  "existe linha em `planos_usuarios` com `is_admin`?" direto, e funciona porque
  é outra tabela. Numa policy da PRÓPRIA `planos_usuarios`, esse mesmo `select`
  dispararia a policy de select dela, que dispararia de novo — recursão, e o
  Postgres recusa. A função roda fora do RLS e corta o laço.
- **O admin não tira o próprio selo.** O `with check` exige
  `user_id <> auth.uid() or is_admin = true`. Sem isso, um clique errado na
  própria linha tranca a pessoa para fora da gestão, e a única saída seria o
  SQL Editor — exatamente o que a tela veio eliminar.

**1c. `comum` é o processo de quem não é de um vestibular só.**
`resumos.processo_slug` é escalar — um resumo pertence a UM processo. Isso
bastou enquanto o acervo era só a 1ª etapa do PAS UEM, e rachou na 2ª etapa do
PASSE: os dois editais pedem Medidas de tendência central e de dispersão, e os
dois documentos do autor trazem o mesmo texto, palavra por palavra.

Duplicar o resumo não era opção. Dois resumos com o MESMO título quebram os
`[[wikilinks]]` **em silêncio**: o trigger `sync_conexoes_resumo` resolve o
destino com `where titulo = …`, e com duas linhas iguais ele passa a ser
indeterminado. E deixar o texto preso a um dos dois cobra do aluno do PASSE um
conteúdo que cai na prova dele.

Então entrou um quarto processo, `comum`, que todo plano à venda inclui
(`lib/planos.ts`). Para o banco ele é igual aos outros: mesma tabela, mesma FK,
mesma coluna. Quem o distingue é a marca `universal: true` em
`lib/processos.ts`, lida pelas duas telas que listam "os vestibulares" — a
conta do aluno e a tabela de cobertura de `/planos`. Lá ele não pode aparecer:
ninguém presta Conteúdo comum, e uma linha com visto em todas as colunas não
compara nada e ainda parece uma quarta prova. Quem o anuncia é o
`INCLUI_SEMPRE`. No editor ele aparece, porque ali é o autor escolhendo onde o
resumo mora.

**`nenhum` continua com a lista vazia**, e não é esquecimento: cadastro é
aberto (1b), então pôr `comum` ali entregaria acervo a quem só criou conta.

É também o destino combinado do material de prova de escola (PR1G1, Simulado
Harmonia, Simulado Poliedro), que não é de vestibular nenhum e que o autor quer
liberado para todo mundo que paga.

**2. `isAdmin` ≠ `isAdminReal`.**
`getSessao()` devolve os dois. `isAdmin` é a visão **efetiva** (o que a interface
deve usar); `isAdminReal` é a permissão de verdade, usada só pra decidir se o botão
"Ver como aluno" aparece. O alternador é conveniência de UI, **não** segurança —
quem barra escrita de não-admin são as policies de RLS no Postgres.

**3. O autosave salva só o `corpo`.**
`salvarCorpoAuto` nunca toca em título/slug/matéria, pra um autosave atrasado não
sobrescrever esses campos com valor velho. Dispara 1,2s depois que o usuário para
de digitar, e só quando o resumo já existe.

**4. Não existe plugin de typography do Tailwind aqui.**
Classes `prose` são inertes. A formatação do conteúdo vem da classe
`.conteudo-resumo` em `globals.css`, usada tanto no editor quanto na página
publicada — é o que faz o WYSIWYG bater.

Corolário do tema escuro: a "folha" do editor (`EditorCorpo.tsx`) é escura, e
não branca como num editor de texto comum. Não é enfeite — `.conteudo-resumo`
escreve em `#CFD3E5`, então uma folha branca deixaria o Ronny digitando
cinza-claro sobre branco. Se alguém clarear a folha, tem que clarear o texto
junto, e aí o editor deixa de mostrar o que o aluno vê.

**4b. Dois temas, e quem escolhe é `color-scheme` — não uma segunda paleta.**
Cada token traz os dois valores em `light-dark(claro, escuro)`. A alternativa
seria repetir a paleta inteira num `@media (prefers-color-scheme)` E de novo
num seletor `[data-tema]` — três cópias que divergem no primeiro ajuste. Assim
o par vive lado a lado, onde é impossível mudar um e esquecer o outro.

Sem escolha do aluno, o aparelho decide (`color-scheme: light dark`). Com
escolha, `<html data-tema="claro|escuro">` fixa um dos dois. O botão
(`components/BotaoTema.tsx`) cicla claro → escuro → seguir o aparelho; o
terceiro estado existe porque, com só dois, quem clica uma vez fica preso e não
volta a acompanhar o celular quando ele troca sozinho ao anoitecer.

Duas coisas que parecem exagero e não são:

- **O script inline no `<head>`** (`layout.tsx`) aplica o tema salvo antes da
  primeira pintura. Esperar o React hidratar faria o site piscar no tema errado
  a cada navegação. É ele que exige o `suppressHydrationWarning` no `<html>`.
- **`useSyncExternalStore` no botão**, não `useState` + `useEffect`. O tema mora
  fora do React (no DOM e no localStorage) e o servidor não sabe qual é; o hook
  devolve `null` no servidor e o valor real no cliente, sem o `setState` dentro
  de efeito que o lint (com razão) recusa.

Os tokens de `globals.css` seguem sendo a única fonte de cor: se um componente
precisa de um tom que não está lá, o tom entra no `:root` primeiro. Vale também
para cor que o autor escolhe no editor e para as cores das matérias — as duas
usam `light-dark()`, porque ficam gravadas no conteúdo e precisam ler bem nos
dois temas. A exceção deliberada é a **faixa de números** da landing, que fica
azul-marinho sempre: clareá-la tiraria o respiro de cor que ela existe para dar.

**4c. Todo título do site sai na cor da matéria dele.**
Nos documentos de origem cada matéria tinha uma cor e o resumo INTEIRO era
escrito nela: Língua Portuguesa `#FD0032`, História Global `#6C0B6A`, Geografia
`#BC462F`, Física `#007473`, Biologia `#3F7848`. É de lá que saíram as cores de
`lib/materias.ts` — Biologia é o mesmo hex até hoje. (Conferido exportando
"Resumo para PASSE 2° etapa 2026" e "Resumo para PAS UEM 2° etapa" como HTML: a
seção de cada matéria é monocromática na cor dela.)

Copiar isso ao pé da letra não dá. O Docs é papel branco e o site tem tema
escuro; uma página inteira em `#C2334D` cansa a vista de um jeito que a folha do
Docs não cansava, e os tons crus do Docs não passam de contraste sobre `--page`.
Por isso a cor pinta só `h2/h3/h4` e `<strong>` — que é justamente o que o olho
procura ao varrer o resumo —, e o texto corrido segue no tom de leitura.

O valor desce por `--cor-materia`, gravada no elemento pela página do resumo e
pela folha do editor (a partir do `MATERIAS`, que já traz o par claro/escuro).
Quem não tem matéria conhecida cai no `inherit` de reserva e continua como era.
Duas exceções no `globals.css`: negrito dentro de `<mark>` e de `<a>` mantém a
cor de quem o cerca — senão o termo troca a cor por cima do grifo pastel ou do
wikilink lilás e volta a ficar ilegível.

No editor a variável fica na "folha", não no elemento do TipTap: aquele é criado
pelo ProseMirror e só aceita atributos via `editorProps`, que não reage à troca
de matéria no `<select>`. Variável de CSS herda, então dá no mesmo — e o autor vê
a cor mudar na hora.

**Fora do corpo, a regra vale para todo título**, e não sobrou lugar de fora:
o `h1` do resumo e o título no caminho da barra fixa, o cartão e o cabeçalho de
matéria em `/resumos`, a árvore e o nome da matéria na barra lateral, o rótulo
dos nós nas duas visões do mapa, o balão do mapa e a lista do `/admin/editor`.
A etiqueta de matéria na página do resumo já foi a única peça colorida ali —
não é mais, e virou só a porta de volta para a lista.

Três regras que não dá pra adivinhar lendo o CSS:

- **Resumo bloqueado não recebe cor.** Fica em `--ink-faint`, porque cor cheia
  o faria parecer disponível e desmentiria o cadeado ao lado. Vale no cartão,
  na barra lateral e nos dois mapas.
- **Cada título usa a cor da PRÓPRIA matéria, não a do bloco onde está.** Os
  backlinks trazem `materia_slug` na consulta por isso, e o mapa mental lê
  `no.cor` em vez do `cor` do ramo — senão um tópico interdisciplinar (decisão
  9) sairia com a cor da disciplina que abre o galho, e o mapa afirmaria o que
  a barra lateral nega.
- **O ponto de "outra matéria" na barra lateral continua**, mesmo agora que a
  cor do título diz a mesma coisa. Cor é reforço, nunca a única pista — é a
  regra escrita no `lib/materias.ts`, e quem não distingue os matizes ainda
  depende do ponto.

Conferido antes de aplicar, porque a paleta nasceu para PONTO marcador e virou
texto de 12,5px: as 12 matérias passam em WCAG AA (≥4,5:1) nos dois temas sobre
`--paper`, `--panel` e `--raised`. As mais apertadas são Redação (4,53) e
Física (4,81). Quem mexer num tom do `materias.ts` está mexendo em texto agora,
não só num ponto de 6px — vale refazer a conta.

**5. `getClaims()`, não `getUser()`.**
`getClaims()` valida o JWT localmente; `getUser()` faz ida e volta na rede. Trocar
de volta reintroduz latência em toda navegação.

**6. `src/proxy.ts` não é opcional — ele é quem mantém o aluno logado.**
O token do Supabase vence em ~1h. Quem detecta e renova é `getClaims()` →
`getSession()` → `_callRefreshToken()`. Mas a renovação precisa gravar cookies
novos, e Server Component não escreve cookie — por isso o `setAll` em
`lib/supabase/server.ts` vive dentro de um `try/catch` vazio. Sem o `proxy.ts`,
o token vence e ninguém persiste o substituto: quem deixa a aba aberta volta e
cai no login. A chamada `await supabase.auth.getClaims()` dentro do proxy parece
inútil (o retorno é descartado) mas é ela que dispara tudo — **não remover**.

**7. Fontes vêm de `next/font`, não de `@import` no CSS.**
`@import url(fonts.googleapis...)` encadeia três viagens de rede antes do primeiro
texto: baixar o CSS, descobrir o import, buscar no Google. O `layout.tsx` carrega
Inter, Nunito e IBM Plex Mono por `next/font/google` e expõe `--fonte-texto`,
`--fonte-resumo` e `--fonte-mono`, que o `globals.css` consome. Os woff2 são
servidos pelo próprio domínio, com preload.

A Fraunces saiu no redesenho escuro: era a única serifa, valia só pra `.marca`
e pros títulos, e puxava o site pra "revista" quando o pedido é material de
estudo. A Work Sans saiu junto — Inter faz o papel das duas. Sobraram três
famílias com papéis que não se cruzam: **Inter** na interface, **Nunito** no
corpo do resumo (texto longo, escolha separada de propósito) e **IBM Plex Mono**
só em código e fórmula. `--fonte-titulo` não existe mais; se aparecer alguma
referência a ela, é resto.

**8. Fórmulas são renderizadas no SERVIDOR, e gravadas em atributo.**
Matemática e química usam KaTeX + mhchem (`\ce{...}`), um sistema só pros dois.
Duas decisões que não dá pra adivinhar:

*Onde renderiza.* `lib/matematica.ts` roda no servidor, então o aluno recebe HTML
pronto e só o CSS do KaTeX. O motor (716 KB) é baixado apenas em
`/admin/editor/*`. Verificável nos `page_client-reference-manifest.js` do build:
só as rotas do editor referenciam o chunk. Mover a renderização pro cliente
jogaria esses 716 KB em cima de todo aluno que abre um resumo.

*Como grava.* O editor grava `<span data-type="inline-math" data-latex="…">` —
o TeX vai num atributo, não como `$…$` no texto. Isso resolve o problema clássico
do delimitador: "De R$ 50 para R$ 80" transformaria "50 para R" numa fórmula.
O caminho `$…$` continua existindo como reserva pra texto colado de fora, com a
regra do Markdown matemático (`$` de abertura não pode ser seguido de espaço,
nem o de fechamento precedido de espaço) — é ela que salva o caso dos preços.
Diferente do wikilink, aqui o atributo é seguro: nenhum trigger do Postgres lê
fórmula, só `[[...]]`.

**8b. Símbolo solto é TEXTO; fórmula é KaTeX. São caminhos diferentes.**
A paleta `Ω Símbolos` insere o caractere direto no texto (`μ`, `Δ`, `≠`), sem
passar pelo KaTeX. Não é redundância com o botão `∑ Equação`: metade do resumo
de Física é prosa que precisa de um `μ` no meio da frase, e abrir o editor de
equação pra isso é caro — era justamente o que levava o autor a copiar o
símbolo de outro lugar e colar. Fórmula inteira continua sendo KaTeX, que
alinha, dimensiona e renderiza no servidor.

Subscrito e sobrescrito são marcas (`<sub>`, `<sup>`), não caracteres Unicode.
Os resumos antigos traziam `v₀` e `x²` colados, mas o Unicode só cobre alguns
caracteres (não existe `q` subscrito) e não acompanha o tamanho do texto.

**8c. As tabelas do editor viraram as caixas do Google Docs.**
Os resumos de origem usavam tabela de uma célula só como caixa de destaque, e
tabelas de duas colunas para linha do tempo (ano | evento) e glossário
(termo | definição). Por isso `insertTable` abre com 2 colunas: é o formato
dos dois usos reais. O CSS de tabela vive em `.conteudo-resumo`, então sai
igual no editor e na página publicada — e tem uma media query que faz a tabela
rolar sozinha no celular, porque não há garantia de que o `.tableWrapper` do
TipTap venha dentro do HTML salvo.

**9. A hierarquia é escrita à mão (`pai_id`), nunca deduzida dos `[[wikilinks]]`.**
Wikilinks formam um grafo sem raiz: tudo liga com tudo. Forçar uma árvore neles
(por exemplo, escolhendo o nó mais conectado como raiz) daria um desenho que muda
de forma toda vez que um resumo novo aparece. Por isso a estrutura é um campo que
o autor preenche — "Está dentro de", no editor — e não algo inferido.

São **dois eixos independentes**, e confundir os dois quebra os dois:

| eixo | onde mora | significa | no mapa |
|---|---|---|---|
| contém | `resumos.pai_id` | estrutura, escrita à mão | linha cheia |
| cita | tabela `conexoes` | referência, extraída do `[[…]]` | linha tracejada |

**A árvore pode atravessar matérias.** Um assunto interdisciplinar — "Energia"
segurando tópicos de Física e de Química — é uma estrutura legítima, e o
`<select>` do editor oferece resumos de qualquer disciplina (com o nome dela ao
lado, senão dois títulos parecidos ficariam indistinguíveis).

Isso obriga `agruparPorMateria` a montar a árvore **uma vez, com tudo**, e só
depois distribuir as RAÍZES entre as matérias. Montar uma árvore por matéria
faria o filho de outra disciplina não achar o pai dentro do grupo e reaparecer
solto na raiz — a hierarquia sumiria justo onde ela é mais interessante.
Consequência: um resumo aparece **onde o autor o pendurou**, não sob a própria
matéria; a barra lateral marca esses casos com um ponto na cor da matéria de
origem, e o contador do grupo segue contando todos os da disciplina.

A matéria continua sendo o guarda-chuva dos assuntos principais e um nó no
grafo. Matéria sem resumo não vira ramo.

No grafo (`/mapa?visao=grafo`) a matéria também é um nó, e cada assunto com
filhos ganha um selo com o número deles: clicar no selo abre e fecha o ramo **no
lugar**, sem trocar de tela. O selo é um alvo separado do nó de propósito —
clicar no nó abre o resumo, e as duas ações não podem morar no mesmo pixel.
As posições dos nós são guardadas entre expansões (`posicoes`, um `useRef`),
senão o mapa inteiro saltaria para um layout novo a cada clique.

Ciclos (A dentro de B, B dentro de A) são barrados pelo trigger
`trg_checar_ciclo_resumo` no Postgres — o editor esconder as opções inválidas é
conveniência de interface, e o banco é quem tem a palavra final (mesmo princípio
das policies de RLS). Ainda assim, todo código que percorre a árvore carrega um
`visitados`/`vistos`: quem desenha não pode travar num laço infinito se algum
dado escapar.

`/mapa?visao=mental` e `/mapa?visao=grafo` — o modo vive na URL pra poder ser
favoritado e compartilhado.

**9b. Questão resolvida: `<div>` no editor, `<details>` na leitura.**
A resolução fica escondida até o aluno clicar. É o único bloco que existe
*porque* o material virou site — no Google Docs a resolução aparece logo abaixo
do enunciado, então o olho a lê antes de a cabeça tentar, e a questão vira
exemplo em vez de exercício.

O caminho óbvio seria o editor já gravar `<details>`, que abre e fecha sem
JavaScript nenhum. Não dá: dentro do editor um `<details>` fechado esconde o
texto que o autor está escrevendo, e o clique no `<summary>` briga com o clique
que posiciona o cursor. Então o editor grava `<div class="resolucao">`, sempre
aberta, e `lib/questoes.ts` troca por `<details>` na hora de ler — no mesmo
ponto em que wikilinks e fórmulas já são convertidos.

A troca conta `<div>` para achar onde a gaveta fecha, e por isso roda **antes**
de `renderizarMatematica`: o KaTeX enche o HTML de `<div>` aninhado. A ordem em
`resumos/[slug]/page.tsx` é questões → wikilinks → matemática, do estrutural
para o miúdo.

**9c. Conteúdo entra por migração, não por tela de importação.**
Os resumos vindos do Google Docs entram como `insert` numa migration
(a primeira é `20260808143000_importa_dinamica_fisica.sql`). Uma tela de
importação seria código novo para um problema que acontece uma vez por matéria,
e uma caixa de colar não deixa rastro — a migration fica versionada e o PR
mostra exatamente que texto foi para o banco.

Dois cuidados que a migration precisa ter:

- **Fórmula é nó do editor** (`<span data-type="inline-math" data-latex="…">`),
  não `$…$`. As duas formas renderizam na página publicada, mas só o nó aparece
  renderizado **dentro do editor** — com `$…$` o autor abriria o resumo e veria
  texto cru esperando ser redigitado.
- **Um `update resumos set corpo = corpo` no fim.** O trigger
  `trg_sync_conexoes_resumo` resolve cada `[[wikilink]]` procurando um resumo
  com aquele título, e roda no insert. Como as linhas entram em sequência, todo
  link que aponta para um irmão inserido depois não acha destino e é descartado
  em silêncio. O update vazio dispara o trigger de novo com todos já no banco.
- **Migre a partir do `.docx`, não do texto exportado.** A exportação em texto
  do Google Docs perde TUDO o que não é letra: as fórmulas, as imagens e o
  subscrito. O `.docx` traz as equações em OMML (que viram LaTeX) e as imagens
  em `word/media/`. A primeira leva da Biologia entrou pelo texto e teve de
  ganhar uma segunda migration só para devolver as quinze figuras — e uma delas
  era um tópico inteiro ("Níveis de organização") que só existia como desenho.
- **O extrator do `.docx` é versionado**, em
  `supabase/ferramentas/docx_para_migration.py`. Ele existia solto, reescrito a
  cada sessão, e foi assim que três palavras saíram coladas na Geografia
  ("aqualidade", "linhademontagem") e chegaram ao ar — o espaço entre elas caía
  num run sublinhado sozinho e a junção de marcas o apagava. O cabeçalho do
  arquivo conta o defeito. Ele NÃO gera SQL: o HTML do `corpo` continua escrito
  à mão, porque o mapeamento é julgamento.
- **Imagem importada mora em `public/img/resumos/<matéria>/`, em WebP.** O que
  o autor sobe pelo editor vai para o bucket `imagens` do Supabase, cuja policy
  de INSERT exige sessão de admin — que uma migration não tem. As duas origens
  convivem porque o `<img src>` não distingue uma da outra, e a imagem que veio
  junto com o texto fica versionada junto com ele.

**Transportar não é reescrever.** O texto do resumo é do autor, e é ele que
responde por aquilo na frente dos alunos — "ficou melhor assim" não é régua de
quem está migrando. Isso já deu errado uma vez: a primeira versão da migration
da Dinâmica acrescentou quinze frases explicativas que não existiam no
documento, cortou as definições dos termos das fórmulas, renomeou itens,
inventou títulos de seção e apagou em silêncio uma linha julgada errada
("depende do meio onde os corpos estão"). A `20260808210000` desfez tudo isso.

Se algo no material parecer errado ou incompleto, a saída é **mostrar e
perguntar**, nunca corrigir de passagem. Vale inclusive para deslize de
digitação: o original tem "A molas podem ser associadas em…" e "1º Lei de
Kepler" com ordinal masculino, e os dois continuam lá.

Um documento do Docs vira **vários** resumos ligados por `pai_id`, não um só —
é o que faz o mapa ter nós de verdade. O pai não linka os filhos em `[[…]]`:
conter e citar são os dois eixos da decisão 9, e linkar quem já está pendurado
desenharia a mesma relação duas vezes.

**9d. A linha do tempo é o terceiro eixo, e tem tabela própria.**
`/linha-do-tempo` situa eventos históricos num eixo único, com chip por matéria.
Nasceu para as humanidades (História, Filosofia, Literatura, Arte, Sociologia),
mas **nada no banco restringe a matéria** — um `check` só criaria migration no
dia em que história da ciência entrar em Física. O chip aparece para a matéria
que TEM evento, então o recorte acontece pelos dados.

Já são três eixos, e o novo não substitui nenhum: `pai_id` é "contém",
`conexoes` é "cita", e `eventos.ano_inicio` é "quando".

**Por que tabela nova e não um campo de ano em `resumos`.** Um resumo cobre
vários eventos (1789, 1791, 1793 e 1799 estão todos dentro de "Revolução
Francesa"), e o autor precisa marcar evento que ainda NÃO tem resumo — o pedido
foi situar tudo o que ele quiser. O vínculo existe e é opcional (`resumo_id`,
`on delete set null`: apagar o texto não apaga o fato).

**Por que ano é inteiro e não `date`.** O material traz "séc. V a.C." ao lado
de "14/07/1789". `date` resolve o segundo e estraga o primeiro, obrigando a
inventar mês e dia — e o a.C. do Postgres não sobrevive bem à viagem até o
JavaScript. Então os papéis são separados: `ano_inicio`/`ano_fim` (inteiros,
negativo = a.C.) POSICIONAM; `rotulo_data` (texto livre) é o que o aluno LÊ.
Vazio, o rótulo é derivado dos anos. `ano_fim` nulo = evento pontual;
preenchido = período, e vira barra cuja largura no eixo é a informação.

**A escala é linear, e isso é a decisão.** Um ano vale sempre o mesmo tanto de
pixel — é o que ensina que a Idade Média são mil anos e a Revolução Francesa é
uma década. O preço (Antiguidade vazia, século XX espremido) é pago pelos
botões de era, que dão zoom no trecho em vez de deformar o eixo.

**O desenho é um eixo central, e os eventos se abrem dele.** Uma linha
horizontal no meio carrega as marcas de ano e os marcadores; cada evento sobe
ou desce por uma haste até seu rótulo, alternando de lado a cada evento em
ordem cronológica. Quando o lado da vez já está ocupado naquele trecho, o
evento desce uma faixa **do mesmo lado** — trocar de lado quebraria a
alternância e, com ela, a leitura de "um acima, um abaixo" que orienta o olho.
Data única é ponto sobre a linha; período é barra, e a largura dela É a
duração. Período que atravessa a tela inteira tem o rótulo encostado na borda,
senão o aluno estaria dentro da Idade Média sem conseguir ler o nome dela.

**Um evento pode ser de VÁRIAS matérias** (`materia_slugs`, array). O
Renascimento é História, Arte, Literatura e Filosofia; com uma matéria só, o
autor teria de escolher uma e mentir, ou cadastrar quatro cópias — e aí
desligar um chip esconderia três e deixaria uma. O filtro usa `some`, não
`every`: o evento fica na tela enquanto qualquer uma das suas matérias estiver
ligada.

Array e não tabela de junção porque a linha do tempo carrega todos os eventos
de uma vez e filtra no navegador — não existe consulta "eventos da matéria X"
para um índice servir, e a junção custaria uma tabela, três policies e um join
em toda leitura. O que o array não dá é a chave estrangeira, e quem devolve é o
trigger `trg_checar_materias_do_evento`.

Consequência visual: o marcador de evento multimatéria sai **listrado** com
paradas duras (degradê inventaria cores que não são de matéria nenhuma, e num
ponto de 9px viraria mancha). E o rótulo de evento multimatéria vai em cor
NEUTRA, não na primeira da lista — pintá-lo de roxo faria o Renascimento
parecer só de História, que é exatamente a mentira que o array veio desfazer.
Quais são elas, quem diz é o painel de detalhe.

**`lib/tempo.ts` × `lib/eventos.ts` é a mesma divisão de `arvore.ts` ×
`resumos.ts`**, e pela mesma razão: o eixo e a tela de cadastro são componentes
de cliente, e `eventos.ts` importa `getSessao` → `next/headers`. O tipo
`Evento` e as contas de data ficam no lado puro. Isto já quebrou o build uma
vez antes de separar.

Três detalhes do eixo que parecem exagero e não são:

- **A roda do mouse precisa de listener nativo não-passivo.** O `onWheel` do
  React é registrado como passivo, onde `preventDefault` é ignorado — e sem ele
  a página rola junto do zoom.
- **`touch-action: pan-y`**, não `none`. O dedo continua rolando a lista de
  faixas na vertical, e só o movimento horizontal vira deslocamento no tempo.
- **O arrasto marca que arrastou.** Soltar o dedo em cima de um evento dispara
  um `click`; sem a marca (engolida no `onClickCapture`), empurrar o eixo
  abriria o detalhe de um evento por acidente.

O filtro de matéria **não** vive na URL, ao contrário do `visao` do mapa: lá a
URL troca a tela inteira e vale ser favoritada, aqui cada clique num chip
dispararia uma volta ao servidor para recarregar todos os eventos.

**9e. Toda rota é dinâmica, e é por isso que existem os `loading.tsx`.**
Nenhuma página do `(app)` é estática: todas buscam no Supabase, então o build as
marca com `ƒ`. Sem tela de espera, clicar num link deixava a interface parada,
sem sinal nenhum, até a página trocar — e a reação natural é clicar de novo.

Os guias do Next (`node_modules/next/dist/docs/.../use-link-status.md`) são
explícitos: prefira `loading.js` a indicador inline, porque a espera de rota é
pré-carregada e a navegação vira instantânea. É o caminho seguido aqui. O
`useLinkStatus` continua sem uso no projeto.

Cada esqueleto imita a FORMA da página que vem — cabeçalho, grade de cartões, o
eixo no meio da linha do tempo —, e não um "carregando" centralizado: a forma
certa faz a troca parecer a página chegando, a palavra faz parecer que a página
sumiu. O de `admin/` é um só para as três telas de lá, porque o `loading.tsx` de
um segmento cobre os de baixo que não têm o próprio.

A barra lateral não entra em esqueleto nenhum: ela vive no layout do grupo, e o
ponto do `loading.tsx` é justamente que o layout continue na tela e clicável
enquanto o miolo carrega.

**9f. Botão que salva mostra que está salvando.**
Toda escrita é server action, e a espera acontece do outro lado do mundo. O
`components/BotaoEnviar.tsx` usa `useFormStatus` — que só enxerga o formulário
ACIMA dele, e é por isso que é um componente separado em vez de um `pending`
passado por prop.

Ele desliga **todos** os botões do formulário durante o envio, não só o
apertado: dois envios em voo gravariam a mesma linha duas vezes. E o par
`name`/`value` existe para o formulário com mais de um botão de enviar, como o
"Liberar"/"Bloquear" de `/admin/pessoas`: `useFormStatus` devolve o `FormData`
que está indo, então dá para saber qual foi apertado e girar só nele.

**9g. `/conta` existe porque não havia saída — literalmente.**
O site não tinha "sair" em lugar nenhum. Quem entrava ficava logado para
sempre, e trocar de conta exigia apagar cookie na mão. Em computador
compartilhado isso não é incômodo, é o resumo de um aluno aberto para outro.

O `sair()` é **server action**, não `signOut()` no navegador: o que precisa
sumir é o cookie, e o cookie de sessão é `httpOnly` — o JavaScript da página
não o enxerga. É também o único contexto em que o `setAll` de
`lib/supabase/server.ts` funciona de verdade; no Server Component ele cai no
`try/catch` vazio (ver decisão 6).

A tela mostra e-mail, plano, e **todos** os vestibulares com o liberado
marcado. Listar só os liberados esconderia o que o aluno ganha ao trocar de
plano — e, para quem está sem acesso, a lista viria vazia e a tela não diria
nada. O estado vai por texto ao lado do ícone, não só por cor.

O aluno **não pode mudar o próprio plano**, e isso não é esquecimento: não há
policy de update para si mesmo em `planos_usuarios` (decisão 1b). A tela leva
aos planos da landing; quem libera continua sendo o admin, depois do Pix.

Na barra lateral, o rótulo "plano: nenhum" virou link para cá. Era informação
sem saída: dizia que o aluno não tem acesso e não oferecia onde resolver.

**9g-bis. Trocar e-mail e senha é do aluno, e a senha atual é o pedágio.**
Até aqui a tela terminava com "fale com o Ronny — essa parte ainda é feita à
mão". Era o único pedido de suporte que o produto criava sozinho, e ele chega
sempre: adolescente troca de e-mail ao sair do colégio, e senha se esquece.

**As duas trocas pedem a senha atual, e isso não é enfeite.** Sem ela, quem
encontrar a aba aberta — o mesmo notebook de irmãos e o mesmo laboratório de
escola que motivaram o botão de sair (9g) — põe o próprio e-mail na conta e
fica com ela. Um aluno pagante perderia o acesso sem ter errado nada.

A conferência roda num cliente **avulso** (`persistSession: false`), não no
cliente com cookie. `signInWithPassword` no cliente com cookie faria o Supabase
emitir uma sessão nova e o `setAll` gravaria os cookies dela por cima: o aluno
seria trocado de sessão só por ter digitado a senha para conferir. Com o cliente
avulso nada é gravado, e a conferência é o que promete ser — sim ou não.

**O e-mail NÃO muda quando o formulário é enviado.** `updateUser({ email })` só
abre a troca e dispara o link; ela acontece quando o link é aberto. É isso que
impede um `gmial.com` de virar perda de conta: o link nunca chega, a troca
simplesmente não ocorre, e o endereço de sempre continua valendo. Por isso a
tela fala em "troca pendente" e mostra o `new_email`, em vez de dizer que deu
certo — sem essa linha, quem não achou o e-mail voltaria, veria o endereço
antigo e concluiria que o site falhou.

**A senha, ao contrário, vale na hora — e derruba as outras sessões.**
`signOut({ scope: 'others' })`, nunca o padrão: o padrão é `'global'` e
expulsaria também quem acabou de trocar a senha. Metade do motivo de trocar
senha é pôr o outro para fora, e o cookie já emitido não deixa de valer só
porque a senha mudou.

**A cópia de e-mail em `planos_usuarios` ganhou um trigger de update.** O de
20260808120000 era `after insert`: a cópia nascia com a conta e nunca mais era
tocada, o que bastava enquanto a troca era feita à mão no SQL Editor. Agora que
ela acontece sozinha, `trg_sincronizar_email_do_usuario` mantém as duas pontas
juntas — senão `/admin/pessoas` mostraria para sempre o endereço que a pessoa
trocou porque não usa mais. `of email` na declaração do trigger não é detalhe:
`auth.users` é escrita a cada login, e sem a coluna no gatilho a função rodaria
em toda navegação de todo aluno.

**`getUser()` em `/conta`, contra a decisão 5.** Aquela regra é sobre a
NAVEGAÇÃO, onde a ida à rede se paga em toda página. Aqui é uma tela só, e ela
precisa de duas coisas que o JWT não tem: o e-mail conferido agora (o do token é
cópia de até uma hora atrás, e pode ser justo o que a troca aposentou) e o
`new_email`, que só existe na resposta do servidor.

**`app/auth/confirmar/route.ts` aceita três formatos de link** —
`token_hash`+`type`, `code` (PKCE) e nenhum dos dois. O terceiro é o modelo
PADRÃO do Supabase, em que o `/auth/v1/verify` deles já conferiu tudo antes de
redirecionar: é ele que faz a troca funcionar sem ninguém mexer no painel. O
`next` da URL é conferido antes de virar destino (`/` sim, `//` não) — sem isso
o site redirecionaria para fora com a própria credibilidade junto. O que o
painel do Supabase ainda precisa ter está em `docs/emails-do-supabase.md`.

**9h. A marca vive em `components/Marca.tsx`, e a logo tem um encaixe pronto.**
O nome estava escrito à mão em cinco lugares — landing (topo e rodapé), login e
as duas versões da barra lateral. Agora é um componente com quatro tamanhos.

Dentro dele há `Simbolo`, que hoje devolve `null` de propósito: **a logo é do
autor e ele mesmo vai desenhá-la em SVG**. Uma logo genérica de encher espaço
seria pior do que nenhuma, porque pareceria decidida. O arquivo carrega as
instruções do que o SVG precisa ter (`viewBox` sem tamanho fixo,
`fill="currentColor"` para acompanhar os dois temas, nada de `<text>`) e a
observação de que o favicon é outro caminho — `src/app/icon.svg`, que o Next
reconhece sozinho e que NÃO deve usar `currentColor`.

As cinco sobras do template do Next (`public/file.svg`, `globe`, `next`,
`vercel`, `window`) saíram: nenhuma era referenciada, e o site as servia
publicamente.

**9i. "É cobrado em" é o quarto eixo, e tem tabela própria.**
`pai_id` significa **contém**, e só. Em 23/08 ele passou a carregar um segundo
sentido sem que ninguém decidisse isso: os resumos-sumário de edital ("Física na
2ª etapa do PAS UEM") seguravam tópicos como se fossem filhos. Não são —
"Dinâmica contém Leis de Newton" é verdade, "a 2ª etapa contém Calor latente"
não é. A etapa COBRA o tópico.

O estrago foi três organizações convivendo no mesmo acervo: a 1ª etapa do PAS
UEM por conteúdo, a 2ª por edital, e os 114 resumos de `comum` sem hierarquia
nenhuma.

A saída repete a da decisão 9d, que não enfiou "quando" dentro de `resumos`:
**`edital_topicos`**, com `processo_slug`, `etapa`, `materia_slug`, `ordem`,
`texto` e um `resumo_id` que pode ser nulo. Os 21 sumários foram apagados — nada
apontava para eles — e quem mostra a lista agora é `/edital`, com a contagem de
cobertura que a página de lista não sabia dar.

**Por que tabela e não uma coluna `etapa` em `resumos`.** Porque a relação é
N-para-N, e a coluna escalar já mordeu este projeto uma vez: foi ela que obrigou
o processo `comum` a existir (decisão 1c). A prova aparece na própria carga —
"Medidas de tendência central" é um resumo `comum` que consta do edital do PASSE
E do PAS UEM ao mesmo tempo, o que `pai_id` não sabia representar.

`resumo_id` é `on delete set null`, como em `eventos`: apagar o resumo não pode
apagar a linha do edital. O tópico continua sendo cobrado; o que se perde é o
texto que o cobria.

**A 1ª etapa do PAS UEM entrou pela metade, e não é falha de extração.** O
documento dela não é um edital — é o conteúdo escrito. A lista de nível 0 dele é
meio a meio: onde o autor ainda não escreveu, ele colou o edital; onde escreveu,
os itens são os títulos do texto. Sete matérias entraram; Língua Portuguesa,
Física e Química ficaram de fora por serem conteúdo, a Geografia porque a seção
dela traz a lista da Filosofia colada por engano, e a Redação porque tem um
tópico só, a letra "R". Ver o cabeçalho de `20260824120000`.

**10. O grafo importa `d3-selection` e `d3-force`, não `d3`.**
`import * as d3 from 'd3'` arrasta os 30 submódulos (geo, chord, brush, scale…)
pra usar cinco funções. O pacote `d3` foi removido do `package.json` de propósito
— se voltar, o bundle volta a crescer.

## Armadilhas do ambiente

- **`npm run dev` é lento de propósito** (~3s por página, recompila sob demanda).
  A velocidade real é ~0,02s. Pra medir performance, sempre `npm run build && npm start`.
- **O projeto vive dentro do OneDrive.** A sincronização atrapalha o file watcher do
  Next. Se aparecer *"Jest worker encountered N child process exceptions"*, é isso —
  reinicie o servidor, não é bug do código.
- **Mover ou apagar pastas com o dev server rodando dá "Permission denied"** no
  Windows. Pare o servidor antes.
- Se o `tsc` reclamar de caminhos que não existem mais, são tipos gerados velhos:
  `rm -rf .next/types .next/dev/types` e rode o build de novo.
- **A CLI do Supabase está travada na 2.60.0 de propósito.** A 2.112.0 quebra no
  `supabase link` com `LegacyLinkApiKeysNetworkError` — ela valida o campo
  `inserted_at` da resposta de api-keys com uma regex que exige `Z` no fim, e a
  API devolve outro formato. Não é problema de conta nem de rede. Se alguém
  atualizar e o `link` parar, é isso. A versão no `package.json` é exata (sem `^`).
- **`npx` não roda no PowerShell deste computador** — a política é `Restricted` e
  o `npx` é um `.ps1`. Use **`npx.cmd`** num terminal de verdade. Não desative a
  política; ela é proteção legítima e o `.cmd` resolve.
- **Nunca mande valor pra `vercel env add` por um pipe do PowerShell.** Ele grava um
  BOM (`﻿`) invisível no começo do valor. A chave anônima vai dentro do cabeçalho
  HTTP `apikey`, e o navegador exige Latin-1 ali — o login quebra em produção com
  *"Failed to read the 'headers' property from 'RequestInit': String contains
  non ISO-8859-1 code point"*, enquanto continua funcionando no localhost.
  Use bash: `printf '%s' "$VALOR" | vercel env add NOME production`.
  Pra conferir se uma chave publicada está limpa, baixe o chunk do `/login` e procure
  por `﻿` antes da URL do Supabase.

## Estado atual

Feito: landing, login, lista e página de resumo, backlinks, grafo, conexões
automáticas (trigger), admin/editor com editor rico, alternador admin/aluno,
sidebar estilo Obsidian, otimizações de performance, renovação de sessão
(`proxy.ts`) e uma passada de acessibilidade (rótulos ligados, `autoComplete`,
`aria-live` nos erros, `aria-expanded`/`aria-current`, ícones decorativos como
`aria-hidden`, anéis de foco, `prefers-reduced-motion`).

Feito em agosto/2026: **redesenho para tema escuro**, a partir do arquivo de
design "Plataforma Grafos — Redesign". Mudou a paleta inteira (lilás `#9184D9`
no lugar do azul), a tipografia (Inter única na interface), as cores das
matérias em `lib/materias.ts` (clareadas pro fundo escuro, mesmo matiz de
antes), os botões (contornados em vez de preenchidos) e o fundo do mapa
(quadriculado escuro, classe `.quadro` — chamava-se `.quadro-branco`). A faixa
de números da landing é nova.

Feito em agosto/2026: **gestão de pessoas** em `/admin/pessoas` — lista quem se
cadastrou, libera ou bloqueia o acesso por plano, e dá ou tira o selo de admin.
Antes disso, tudo isso exigia o SQL Editor do Supabase.

Feito em agosto/2026: **linha do tempo** em `/linha-do-tempo`, com cadastro em
`/admin/eventos`. Ver a decisão 9d. Nasce vazia — o banco ainda não tem conteúdo
de humanidades, e é o cadastro que a preenche.

Falta: **pagamento automático** — `planos_usuarios.ativo` continua sendo virado à
mão depois de um Pix pessoal, só que agora por um botão e não por SQL. Quando
automatizar, um webhook do gateway (Asaas, Efí Bank ou PagBank) deve atualizar
essa mesma coluna, e a tela de pessoas segue valendo para os casos manuais.

> Confirmação de e-mail é configuração do painel do Supabase (Authentication →
> Providers → Email), não do código. Com ela ligada, quem se cadastra só entra
> depois de clicar no link recebido; desligada, entra na hora.

**10b. A física do grafo é ancorada por matéria, e o `forceCenter` saiu.**
O acervo tem 38 resumos, 6 matérias e **uma** citação `[[…]]` no total. Ao
abrir, o mapa são seis estrelas que não se ligam por aresta nenhuma — e essa
topologia expõe uma armadilha do d3 que só aparece com componentes desconexos:

**`forceCenter` não puxa nó nenhum.** Ele TRANSLADA o sistema a cada tick para
manter o centroide parado. Com seis blocos se repelindo em direções opostas, a
média entre eles continua no meio da tela enquanto todos vão embora. Medido
numa simulação headless da topologia real: o desenho ocupava 2142x1274 numa
moldura de 1000x700, com 34 dos 35 nós fora dela. Quem substitui são `forceX` e
`forceY`, que agem POR NÓ.

Cada matéria tem um lugar fixo num anel, pelo índice em `MATERIAS` (ordem
canônica, não a ordem da consulta — senão publicar um resumo giraria o mapa).
A matéria é presa com força 0.25 e o resumo com 0.12; apertar o resumo
empilharia os irmãos, e quem de fato o posiciona é a aresta com o pai.

`forceManyBody` ganhou `distanceMax(420)`. Sem teto a repulsão tem alcance
infinito, e é ela que empurrava um grupo contra o outro do outro lado da tela.

**Os números saíram de medição, não de gosto.** Uma varredura de anel x força x
teto de rótulo sobre a topologia real escolheu `anel 0.24`, `força 0.12`,
`teto 40`: zero nós fora da moldura, zero círculos sobrepostos, um par de
rótulos se tocando. As alternativas testadas iam a 16 nós fora.

**O rótulo entra na colisão, e é cortado em 26 caracteres.** A colisão do d3 é
circular e o texto não faz parte do círculo: sem corte, "Movimento circular
uniformemente variado" (215px a 11px) atravessa os vizinhos por mais que a
física empurre. O título inteiro segue no balão e no `aria-label`.

**O que a física não resolve, o zoom resolve.** 35 nós com rótulo ocupam uns
840x680 — não cabem nos 380px de um celular, e apertar as forças até caberem
empilharia tudo. Então o mapa se ENQUADRA sozinho quando assenta pela primeira
vez, e o botão "Centralizar" passou a enquadrar em vez de voltar para
`zoomIdentity` (que é escala 1 na origem, e não centralizava nada).

**Nó arrastado agora FICA.** Antes o `end` do arrasto fazia `d.fx = null` e a
física o puxava de volta — de perto, parece que o nó escapou da mão. Quem
arrasta está montando um arranjo. Desfaz-se pelo botão "Soltar nós", que só
aparece quando há pino, e **não** por duplo clique: duplo clique dispara dois
`click` antes do `dblclick`, e o `click` no nó abre o resumo.

Três ajustes menores com a mesma origem — o mapa tremia: `velocityDecay` 0.55
(o padrão 0.4 faz o nó passar do ponto e voltar), `alphaDecay` 0.035, e o
`alphaTarget` do arrasto caiu de 0.25 para 0.1. O `ResizeObserver` era fonte
independente de tremor: ele reaquecia em toda notificação, inclusive a que o
`observe()` dispara sozinho ao montar e a que a barra do navegador do celular
provoca ao aparecer. Agora ignora a primeira e exige 24px de variação.

E a remontagem abre fria (`alpha(0.35)` em vez de 1, a partir da segunda):
expandir um ramo reacomoda os filhos novos, não o mapa inteiro. Os filhos
nascem num leque de ângulo determinístico pelo índice, e não em `pai ± 15px`
sorteados — irmãos nascendo no mesmo ponto era a bagunça que se via ao expandir.

**10c. Evento entra em lote, colando uma lista.**
A linha do tempo passou a existência inteira com UM evento no banco. Não
faltava material: lançar evento era um formulário de sete campos por vez, e
trinta eventos eram trinta idas e voltas.

`/admin/eventos` ganhou a aba "Colar lista", no formato
`ano | título | matérias | data escrita`. As matérias são aceitas por nome ou
por slug, e o ano aceita `1789`, `-350`, `350 a.C.` e intervalos.

**`lerAno` mudou de casa e ficou mais rígido.** Foi de `admin/eventos/actions.ts`
(que é `'use server'`) para `lib/tempo.ts`, o lado puro, porque a
pré-visualização roda no navegador e precisa da MESMA leitura — duas cópias
discordariam no primeiro formato exótico. E passou a exigir que sobre
exatamente um número: a versão antiga varria os dígitos com
`replace(/[^\d-]/g, '')`, então "1914 até 1918" virava o ano **19141918** em
silêncio — um evento a dezenove milhões de anos daqui, que no eixo esmagaria
todos os outros contra a margem. Pego por teste, não na tela.

**Tudo ou nada.** Uma linha ruim cancela a remessa inteira. Inserir as boas
pareceria gentil e seria pior: o autor ficaria com uma lista pela metade sem
saber quais entraram, e reenviar duplicaria — não há chave única de título e ano
que impeça. O botão fica travado enquanto houver erro, e a pré-visualização
numera igual ao servidor (as duas tiram as linhas em branco antes de contar,
senão o "Linha 7" apontaria para o lugar errado).

O servidor **reanalisa o texto bruto** e ignora o que a tela calculou: server
action é endereço público, e aceitar o JSON pronto deixaria qualquer um
escrever `ano_inicio` direto na tabela.

**11. A folha tem régua, e imagem e tabela podem sair das margens.**
`lib/pagina.ts` é a fonte única: folha de **920px**, margem padrão **150** de
cada lado — o que devolve exatamente a coluna de 620px que o editor já tinha,
então nenhum resumo existente mudou de aparência. A folga até 880px é o que dá
para onde crescer; sem ela, a régua só saberia apertar.

As margens são **duas colunas em `resumos`** (`margem_esq`, `margem_dir`), e não
uma "largura do texto": a régua tem dois marcadores independentes, e uma largura
única só saberia centralizar.

Três guardas em série, e é de propósito: `ajustarMargens` prende enquanto o
autor arrasta, roda de novo na server action, e o `check`
`resumos_margens_validas` é a palavra final. Mesmo princípio dos ciclos e do
RLS — a interface ajuda, o banco decide.

A régua é desenhada na **largura real** da folha, não em miniatura: régua
reduzida obriga a converter "arrastei 3px, mexi quanto?" na cabeça. O arrasto
escuta no `window` e não no marcador — o ponteiro sai de um alvo de 13px no
primeiro movimento rápido, e o marcador escaparia da mão.

**Abaixo de `sm`/`md` as margens são ignoradas** e vale um recuo fixo de 24px:
150px numa tela de 390px não deixaria coluna nenhuma.

**O escape.** `data-escapa="sim"` anula o recuo com margem negativa do tamanho
exato das margens, e o elemento ocupa a folha inteira. Uma regra só de CSS
atende imagem e tabela — são as duas coisas que o autor pediu que tivessem
liberdade, e regra única não tem como divergir. No celular a regra é outra
(`-1.5rem`), senão o escape puxaria a imagem 150px para fora da tela.

A tabela do `TableKit` é desligada (`table: false`) e entra `TabelaLivre` no
lugar, que é a mesma extensão com o atributo `escapa`. Registrar as duas daria
conflito de nome de nó.

**11c. A imagem é `<figure>`, e o painel tem quase tudo o que o Docs tem.**
`@tiptap/extension-image` foi **removido do projeto**: ele grava um `<img>`
solto, e legenda pede `<figcaption>` com um pai, e "texto ao redor" pede o
`float` num elemento que ENVOLVA a imagem. Os dois são estrutura, não atributo.
No lugar entrou um nó próprio em `admin/editor/imagem.ts`.

**A regra que manda em tudo ali:** a página do aluno renderiza HTML cru, sem
React — então tudo o que se vê tem de sair do HTML gravado. Modos fechados
(quebra, alinhamento, escapa, recolorir) vão em `data-*` que o CSS lê; valores
contínuos (largura, giro, brilho, borda) vão em `style` embutido, porque
seletor de atributo não cobre número livre. Os `data-*` dos contínuos também
são gravados — é o que o `parseHTML` relê ao reabrir, já que ninguém decompõe
uma string de `style`.

**As alças de redimensionar são uma SOBREPOSIÇÃO, não um NodeView**
(`AlcasImagem.tsx`). Um NodeView criaria duas renderizações da mesma imagem — a
do React, que o autor vê, e a do `renderHTML`, que o aluno recebe — e elas
divergiriam no primeiro ajuste, levando o WYSIWYG junto. A camada de alças é
medida por cima da figura de verdade e some quando ela é desmarcada. Só as
alças da direita puxam: as da esquerda exigiriam mover a imagem enquanto ela
cresce, e numa figura centralizada o desenho fugiria do ponteiro.

**O que o Docs tem e aqui NÃO tem, de propósito:**

- **Atrás do texto / à frente do texto.** Exigem posição absoluta por cima do
  texto, que só funciona com página de largura fixa. O resumo é uma coluna que
  muda de largura com a régua e com a tela — a imagem cairia em cima da frase
  errada em metade dos aparelhos.
- **Fixar posição na página.** Não há páginas: o resumo é uma rolagem só.
- **Recortar e máscara de forma.** Pedem uma interface de recorte própria; a
  altura fixa com `object-fit: cover` cobre o caso simples.

Os ajustes de cor são **filtros de CSS**, então não tocam no arquivo: dá para
voltar atrás sempre, e a mesma imagem serve a dois resumos com ajustes
diferentes. O preço é que o aluno baixa a original.

Uma armadilha do `float`: sem `clear: both` no fim de `.conteudo-resumo`, uma
figura com texto ao redor no final do resumo vaza para fora e sobe por cima dos
backlinks. E abaixo de 640px o `float` é desligado — numa coluna de celular
sobrariam três palavras por linha ao lado da imagem.

**11b. Imagem: upload por server action, largura em porcentagem.**
O bucket `imagens` é **público** porque a imagem é servida direto no `<img>` da
página; URL assinada teria de ser gerada a cada leitura e venceria no meio da
aula. Isso não afrouxa o conteúdo — o resumo continua barrado por plano, e o que
fica público é um arquivo em caminho com uuid.

O upload passa por **server action**, não pelo navegador: a chave do cliente é a
anônima, e quem decide é a policy `admin envia imagens` — do lado do cliente não
haveria nada a conferir. O nome do arquivo é um uuid, e não o original: nome
vindo do Windows traz acento, espaço e parêntese, e dois prints "Captura de
tela.png" se sobrescreveriam em silêncio.

**A largura da imagem é porcentagem da coluna, nunca pixel.** Pixel amarraria a
imagem à largura da folha do dia em que foi inserida — bastaria arrastar a régua,
ou o aluno abrir no celular, para estourar.

Colar e arrastar são `handlePaste`/`handleDrop`, que devolvem `true` na hora e
sobem o arquivo depois: handler de ProseMirror é síncrono, e esperar o upload
dentro dele travaria o editor. Quem avisa é o rodapé de status — sem ele, colar
um print de 4 MB numa conexão ruim pareceria não ter feito nada. Os uploads vão
**em série**: cinco arquivos soltos de uma vez disputariam a banda de subida e
entrariam fora de ordem.

Não há `remotePatterns` no `next.config.ts` e não faz falta: o corpo do resumo é
HTML cru com `<img>`, não `next/image`.

**12. Todo título é um grafo, e por isso não tem tamanho.**
O editor deixou de chamar `h2/h3/h4` de "Título 1/2/3" e passou a chamar de
**Grafo 1/2/3**. Não é troca de rótulo: cada um deles vira um NÓ no `/mapa`,
pendurado no resumo que o contém e nos títulos de nível acima. O resumo é um
grafo, e cada seção dentro dele é outro.

Disso decorre o que se vê na página: **os três saem no corpo do texto, só em
negrito**. Grafo não tem tamanho — "Leis de Newton" não é uma coisa *maior* que
"1ª Lei", é uma coisa que *contém* a outra, e escala tipográfica diria a
primeira. O que marca hierarquia agora é a margem acima (1.8em / 1.5em / 1.3em),
que é ritmo e não tamanho. `font-size: 1em` e não `1rem`, para o título
acompanhar quem o cerca quando estiver dentro de uma tabela ou lista.

**O peso é 800 no título e 500 no `strong`, e a distância entre os dois é a
decisão.** Se o negrito marca o grafo, ele não pode marcar mais nada — e era
o que estava acontecendo: 700 contra 600 leem quase igual no desenho da
Nunito, então o resumo virava um borrão de negrito onde o nó do mapa não se
distinguia de um termo qualquer. Agora o peso responde uma pergunta só: isto
é um nó ou não é? Os dois valores são um par; mexer num sem o outro fecha a
distância de novo.

O `strong` não desce a peso normal porque ele é a única marca que sobra
dentro de grifo e de wikilink — nos dois a cor da matéria é anulada de
propósito (senão o termo brigaria com o pastel e com o lilás). Sem peso E sem
cor, o destaque ali sumiria. Vale notar que a Nunito entra como fonte
variável, então 800 e 500 são desenhos de verdade, não o negrito sintético
que o navegador improvisa engrossando o traço.

**Isto NÃO contradiz a decisão 9**, e a diferença importa: lá o que se recusa é
*inferir* hierarquia dos `[[wikilinks]]`, que formam um grafo sem raiz cuja
forma mudaria a cada resumo novo. Um sumário não é inferência — é estrutura que
o autor escreveu à mão, na ordem e no nível que quis, exatamente como o
`pai_id`. São a mesma espécie de dado em dois lugares diferentes.

**Nada disso vai para o banco.** Os nós de título são derivados na leitura, em
`lib/titulos.ts`, a partir do `corpo` que já existia. Sem tabela, sem trigger,
sem coluna: o sumário JÁ estava escrito no HTML, e materializá-lo criaria uma
segunda cópia para manter em dia a cada tecla do autor. O preço é que o `/mapa`
passa a carregar o `corpo` de todos os resumos — no servidor, e só a lista de
títulos desce para o navegador.

Quatro detalhes que não dá para adivinhar lendo o código:

- **`extrairTitulos` e `ancorarTitulos` são o mesmo cálculo.** A primeira diz ao
  mapa para onde apontar, a segunda grava o `id` na página. Se divergirem, o
  link cai no topo do resumo **em silêncio** — navegador não reclama de âncora
  que não existe. Por isso as duas passam pelo mesmo `percorrer`, e por isso as
  duas rodam sobre o `corpo` CRU, antes de questões, wikilinks e fórmulas.
- **Título repetido ganha sufixo** (`exemplo`, `exemplo-2`). "Exemplo" e
  "Resumo" aparecem três vezes no mesmo documento; sem isso, os três nós
  levariam ao primeiro.
- **A pilha de níveis tolera salto.** Um `h2` seguido direto de um `h4` pendura
  o `h4` no `h2`, porque a pilha só desempilha o que for mais fundo. Salto
  acontece em texto real e não é erro do autor.
- **Resumo fora do plano não abre os títulos.** Os nomes das seções já são
  conteúdo — o sumário de "Dinâmica" entrega a estrutura da aula inteira. O nó
  do resumo continua na tela com o cadeado, que é o que interessa mostrar.

No desenho, o título é **vazado** e o resumo é **preenchido** — nas duas visões,
com a mesma regra, para quem aprendeu a ler uma não precisar reaprender na
outra. Distinguir por tamanho estava fora de questão: foi justamente o tamanho
que saiu dos títulos no corpo do texto, e reintroduzi-lo no mapa faria o desenho
contradizer a página.

**12b. A cor que o autor escolhe agora ganha da cor da matéria.**
Ao lado das sete bolinhas prontas há um seletor livre. As bolinhas ficam porque
são um clique só para o caso comum; o seletor é para quando nenhuma serve.

O que se grava continua sendo o par `light-dark(claro, escuro)` da decisão 4b —
a cor mora no HTML do resumo para sempre e precisa ler nos dois temas. Como o
autor escolhe UMA cor, o par é derivado em `lib/cor.ts`. **O cabeçalho daquele
arquivo é a leitura obrigatória de quem for mexer**: ele mede os seis pares
escritos à mão e mostra que só o matiz e o brilho seguem regra; a saturação foi
ajustada no olho, par a par, e o fator ×0,7 do código é aproximação declarada,
não reprodução. Cor derivada não sai idêntica à do `materias.ts`.

A armadilha que isso destravou: `.conteudo-resumo strong` e os títulos pintam de
`--cor-materia`, e **herança sempre perde para uma regra que casa**. Sem a linha
nova em `globals.css`, pintar um trecho de vermelho deixaria de fora justamente
as palavras em negrito dentro dele — as que o autor mais quer destacar. A regra
é `span[style*='color'] strong`, e não `[style*='color']`, porque a segunda
casaria também com `background-color` e arrastaria `<figure>` para dentro.

**12c. O grafo pode dividir a linha com a explicação.**
Botão `T¶` na barra do editor, que grava `data-corrido="sim"` no título. É o
formato de origem dos resumos — `**Termo:** definição;` —, e depois da decisão
12 o grafo já era igual a esse termo em tudo menos numa coisa: o termo dividia a
linha, o grafo ainda a ocupava sozinho.

**12c-bis. Quem liga o modo, na prática, é o `:`.**
O botão exigia que o autor lembrasse dele. Os dois pontos, não: no formato de
origem eles são exatamente onde o nome do assunto acaba, e o autor já os digita.
Uma regra de digitação em `tituloCorrido.ts` liga o modo corrido, abre o
parágrafo da explicação e leva o cursor para lá.

Só dentro de um grafo (prosa comum é cheia de dois pontos), só com o cursor no
fim (senão um `:` corrigido no meio partiria o título em dois) e só uma vez
(com o modo já ligado, o parágrafo existe). Quando a quebra não era desejada —
"Capítulo 3: Dinâmica" — o Backspace desfaz: o TipTap liga `undoInputRule` a
ele por padrão, e o `:` volta a ser texto comum. O botão `T¶` fica, porque é
ele que DESLIGA o modo e que serve a quem escreveu o título antes de decidir.

**O `:` fica gravado no título, como texto** — é o que o autor digitou e o que
o documento de origem tem. Inventá-lo no CSS (`::after`) faria a página mostrar
caractere que não está no HTML, que é a armadilha da decisão 1 de novo. Quem o
tira do RÓTULO do nó é `lib/titulos.ts`: no mapa não há definição do outro lado,
e o nó se chamaria "Leis de Newton:", com um sinal apontando para nada. Some só
quando encerra o título, então "Razão 3:4" continua inteiro — e as âncoras não
mudam, porque `comoAncora` já descartava o caractere.

Uma armadilha do TipTap que custou uma leitura do `node_modules`: quando a regra
roda, **o caractere digitado ainda NÃO está no documento** (`textBefore` é o
texto do bloco MAIS o que se digitou, e só para casar). Cabe ao handler inserir
o `:`; sem isso a regra dispara e o caractere some.

**O título continua sendo um bloco `h2/h3/h4` separado do parágrafo**, e isso é
o que sustenta o resto: `lib/titulos.ts` segue lendo só o título ao montar o nó,
o nível continua dizendo quem pendura em quem, e o leitor de tela continua
anunciando um cabeçalho. Se a explicação fosse para dentro do título, o nó do
mapa passaria a se chamar "Leis de Newton todo corpo permanece em repouso ou…".
Fazer do grafo uma marca dentro do parágrafo (como o negrito) foi descartado
pelo mesmo motivo: marca não tem nível, e sem nível não há árvore.

Quem junta as duas linhas é o `float` do `globals.css`. `display: run-in` está
morto nos navegadores, e pôr os dois em `inline` custaria as margens — caixa
inline não tem margem vertical, e o espaçamento do resumo inteiro sai de margem.

**A regra que vai quebrar se alguém mexer:** a margem de cima do título corrido
e a do elemento seguinte têm que ser IGUAIS, e por isso o valor está escrito
duas vezes em vez de herdado. A conta: a "coruja" (`> * + *`) põe todo o
espaçamento na margem de CIMA, então a margem de baixo do anterior é sempre 0;
**float não colapsa margem com ninguém**, e bloco no fluxo normal colapsa. Com
os dois valores iguais, os dois pousam na mesma linha; diferentes, o texto
começa acima ou abaixo do título e o efeito se desfaz.

E o `clear: both` vai no SEGUNDO vizinho, nunca no primeiro — o primeiro é
justamente a explicação, que tem que subir. Limpar um só basta.

Conferido medindo no Chrome, e não no olho: título e explicação com `top`
idêntico (diferença 0px), primeira linha ao lado do título e as seguintes de
volta à margem, bloco posterior abaixo. **Vale o aviso para quem for repetir o
teste:** uma página solta sem o *preflight* do Tailwind dá resultado errado — as
margens que o navegador dá de graça a `p` e `h1..h6` (15px) desalinham o par e
empurram a última linha. O primeiro teste caiu exatamente nessa e acusou um
defeito que não existia.

**12d. O trilho mostra o grafo enquanto o resumo é lido.**
Coluna estreita à esquerda da folha, em `resumos/[slug]/Trilho.tsx`, com as
seções do resumo (que são nós do mapa, decisão 12) e as arestas que saem daqui
— os `[[wikilinks]]` do corpo, recuados sob a seção em que aparecem.

A tese do produto é "resumos interligados", e até aqui a tela onde o aluno passa
o dia mostrava o grafo só como lista de cartões no rodapé.

**Ele não encosta na coluna de texto, e some antes de encostar.** A folha
continua com os 920px e as margens da régua (decisão 11); o trilho ocupa o vão
à esquerda e desaparece abaixo de 1340px de janela, onde esse vão acaba. A
conta do ponto de corte está no `globals.css` — barra lateral (260) + trilho
(128) + vão (24) + folha (920) = 1332. Quem mexer num desses números mexe no
`@media` junto.

**A armadilha, e ela quebra em silêncio:** o trilho acha o `<a>` do wikilink no
texto pela POSIÇÃO, contando os links na ordem em que `renderizarWikilinks` os
escreve. Não é por `id` porque gravar um mudaria também o HTML que o editor
mostra, e o WYSIWYG (decisão 4) obriga os dois a serem o mesmo documento. Duas
coisas desalinham essa contagem, e as duas existem no acervo:

- wikilink que NÃO resolve vira `<span>`, não `<a>`, e não pode gastar índice;
- wikilink DENTRO de um título vira `<a>` como qualquer outro, e gasta índice
  sem virar item do trilho.

`extrairTrilho` (em `lib/titulos.ts`, junto de `percorrer`, pelo mesmo motivo
que obriga `extrairTitulos` e `ancorarTitulos` a andarem juntas) trata as duas.
Quem mexer em `renderizarWikilinks` tem que conferir se a contagem ainda bate —
o sintoma é o link errado acendendo no texto, e nada avisa.

**12e. "Cai em" põe a decisão 9i na página do resumo.**
`edital_topicos` sabe desde 24/08 em que provas cada resumo é cobrado, e a
página nunca mostrou. As etiquetas vão no CABEÇALHO: quem estuda para uma prova
decide pelo que cai nela, e essa decisão acontece antes de ler.

Não são links — `/edital` não recebe filtro por prova, e etiqueta que não leva a
lugar nenhum é pior que etiqueta que não clica. Somem quando o resumo não é
cobrado por edital nenhum, que é a maior parte do acervo de `comum`.

## Imagem: feito em agosto/2026

O site já exibe imagem. Colar (Ctrl+V), arrastar o arquivo e o botão da barra
funcionam, com alinhamento, quatro larguras e a saída das margens — ver decisões
11 e 11b. A armadilha antiga (colar não dava erro, o ProseMirror descartava em
silêncio) está fechada.

Ficou de fora de propósito: **redimensionar arrastando o canto** e **legenda**.
As duas pedem um NodeView do TipTap, que é um pedaço à parte; as quatro larguras
prontas cobrem o caso comum, e a legenda dá para escrever como parágrafo logo
abaixo enquanto isso.

Continua valendo o atalho para tirar as imagens do Google Docs: **`.docx` é um
zip**. Baixando o documento como Word, as imagens ficam todas em `word/media/`,
já separadas. Não precisa salvar uma a uma, e não vale baixar pelo MCP do Drive
— o conteúdo vem em base64 para dentro da conversa, o que é inviável para o
documento mestre de 13 MB.

E segue pendente o caso que motivou tudo: a questão de colisão em
`quantidade-de-movimento` diz "a situação ilustrada a seguir" e a ilustração
ainda não foi colocada. Agora dá — é só abrir o resumo no editor e colar.

## Publicação

O site está no ar em **https://plataforma-grafos.vercel.app**
(Vercel, time `ae-5672`, projeto `plataforma-grafos`).

O nome **Plataforma Grafos** vale em toda a infraestrutura, e isso foi acertado de
uma vez: repositório, projeto da Vercel, projeto do Supabase, `package.json` e a
pasta no disco. O nome antigo (`plataforma-mestre-ronny`) não sobrou em lugar
nenhum — inclusive o endereço `plataforma-mestre-ronny.vercel.app`, que a Vercel
mantinha ligado desde a renomeação do projeto e foi desligado. Link velho dá 404,
e é de propósito: dois endereços servindo o mesmo site é o tipo de coisa que
alguém descobre no dia em que um dos dois para de funcionar sozinho.

- Código em **https://github.com/Nanorix10/plataforma-grafos** (público, branch `main`),
  conectado à Vercel: **todo `git push` na `main` publica sozinho**. Não é preciso
  rodar `vercel deploy` na mão.
- O repositório é público, mas nenhuma chave vai junto: o `.gitignore` bloqueia
  `.env*`. As chaves vivem só no `.env.local` (local) e no painel da Vercel.
- As variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` já estão
  cadastradas na Vercel nos três ambientes. Se as chaves do Supabase mudarem, é preciso
  atualizar nos dois lugares: `.env.local` e a Vercel.
- O `vercel link` escreveu um `VERCEL_OIDC_TOKEN` no fim do `.env.local`. É normal.

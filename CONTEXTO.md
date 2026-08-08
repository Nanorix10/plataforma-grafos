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

Falta: **pagamento automático** — `planos_usuarios.ativo` continua sendo virado à
mão depois de um Pix pessoal, só que agora por um botão e não por SQL. Quando
automatizar, um webhook do gateway (Asaas, Efí Bank ou PagBank) deve atualizar
essa mesma coluna, e a tela de pessoas segue valendo para os casos manuais.

> Confirmação de e-mail é configuração do painel do Supabase (Authentication →
> Providers → Email), não do código. Com ela ligada, quem se cadastra só entra
> depois de clicar no link recebido; desligada, entra na hora.

## Próximo passo combinado: suporte a imagem

O site **não exibe imagem nenhuma** hoje, e isso não é lacuna de conteúdo — é
ausência de infraestrutura. Não há `@tiptap/extension-image`, botão no editor,
bucket no Storage, regra de CSS para `img` nem `remotePatterns` no
`next.config.ts`.

Armadilha a saber: colar uma imagem no editor hoje **não dá erro** — o
ProseMirror valida o conteúdo contra o esquema e descarta em silêncio o que não
reconhece. Quem colar vai ver a imagem sumir sem nenhuma mensagem.

Consequência imediata: a questão de colisão em `quantidade-de-movimento` diz "a
situação ilustrada a seguir" e a ilustração não tem para onde ir. Não adianta
tentar recolocar pelo editor.

O que falta construir, de uma vez:

1. `@tiptap/extension-image` + botão na barra do `EditorCorpo`
2. Bucket no Supabase Storage, com RLS deixando só admin subir e todos lerem
3. Server action de upload em `admin/editor/actions.ts`
4. Regra de `img` em `.conteudo-resumo` (largura máxima, cantos, legenda)

Para tirar as imagens do Google Docs, o atalho é que **`.docx` é um zip**:
baixando o documento como Word, as imagens ficam todas em `word/media/`, já
separadas. Não precisa salvar uma a uma, e não vale baixar pelo MCP do Drive —
o conteúdo vem em base64 para dentro da conversa, o que é inviável para o
documento mestre de 13 MB.

## Publicação

O site está no ar em **https://plataforma-grafos.vercel.app**
(Vercel, time `ae-5672`, projeto `plataforma-grafos`).

> A pasta local ainda se chama `plataforma-mestre-ronny` — é só o nome do diretório
> no disco, não afeta nada. O projeto se chama **Plataforma Grafos**.

- Código em **https://github.com/Nanorix10/plataforma-grafos** (público, branch `main`),
  conectado à Vercel: **todo `git push` na `main` publica sozinho**. Não é preciso
  rodar `vercel deploy` na mão.
- O repositório é público, mas nenhuma chave vai junto: o `.gitignore` bloqueia
  `.env*`. As chaves vivem só no `.env.local` (local) e no painel da Vercel.
- As variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` já estão
  cadastradas na Vercel nos três ambientes. Se as chaves do Supabase mudarem, é preciso
  atualizar nos dois lugares: `.env.local` e a Vercel.
- O `vercel link` escreveu um `VERCEL_OIDC_TOKEN` no fim do `.env.local`. É normal.

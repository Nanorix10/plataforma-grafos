# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**O aluno de vestibular seriado** — PASSE (UFMS), PAS UEM e PAS UnB. Prova por
etapa ao longo do ensino médio, então ele convive com o mesmo edital por anos,
não por um semestre.

Ele lê em **dois aparelhos com pesos diferentes**: o celular para revisar, o
notebook para sentar e estudar. Nenhum dos dois é exceção — uma superfície que
só existe numa das larguras precisa dizer isso explicitamente, porque metade do
uso não a verá.

**O autor/admin** (Leandro) é o segundo usuário, e não é hipotético: escreve
todo o material, importa acervo por migration, e desde agosto/2026 libera acesso
e dá selo de admin pela própria interface (`/admin/pessoas`) em vez do SQL
Editor do Supabase.

## Product Purpose

Um acervo de **resumos interligados** (estilo Obsidian) para os três processos
seletivos. O aluno assina um plano e lê; os resumos se conectam por
`[[wikilinks]]` e formam um grafo navegável.

**O aluno chega por quatro portas, todas confirmadas como reais:** revisar às
vésperas da prova, percorrer o edital do começo ao fim, tirar uma dúvida pontual
de um assunto, e ver como os assuntos se conectam. As quatro coexistem — o
produto não pode ser desenhado como se só a última importasse, nem como se ela
fosse enfeite.

Sucesso, hoje: **converter e ativar**. O site está no ar e ainda não tem nenhum
aluno pagante.

## Positioning

**Material original escrito por quem prestou a prova**, não compilado de
terceiros nem redigido por professor supondo onde o aluno trava. A landing usa
reputação como argumento, e isso obriga o resto do produto a nunca afirmar o que
não pode atribuir.

**As conexões são o mecanismo, não a decoração.** Um trigger no Postgres
(`sync_conexoes_resumo`) extrai os `[[wikilinks]]` do corpo e sincroniza a
tabela `conexoes` — backlinks, grafo e trilho saem de dado real, não de
curadoria manual. Um concorrente que publique PDF não copia isso sem refazer o
acervo inteiro.

**Cobertura por processo seletivo, nunca recurso trancado.** Os três planos
entregam exatamente as mesmas funções; muda só quais provas o acesso abre.

## Operating Context

**Do lado do aluno:** lista de resumos filtrada pelo plano, página do resumo com
backlinks, mapa (grafo d3), linha do tempo e o edital como eixo próprio. A
sidebar estilo Obsidian atravessa tudo que exige login (`src/app/(app)/`).

**Do lado do autor:** editor TipTap com visual de documento em `/admin/editor`,
autocomplete de `[[`, salvamento automático que grava só o `corpo`;
`/admin/pessoas` para liberar acesso; `/admin/eventos` para a linha do tempo. O
acervo em massa não entra pela interface — entra por migration gerada a partir
dos `.docx` do autor pelos scripts em `supabase/ferramentas/`.

**O material de origem é documento de verdade** (cadernos por matéria, 59 provas
da escola, editais oficiais), e a conferência do que já foi publicado contra o
que falta é trabalho corrente, não um evento único.

## Capabilities and Constraints

- **RLS é a única proteção real.** Tudo roda com a chave anônima; quem impede um
  não-admin de escrever são as policies no Postgres. O cookie `visao`
  (alternador "ver como aluno") é conveniência de interface e **não** é
  segurança — `isAdmin` é a visão efetiva, `isAdminReal` é a permissão.
- **Cadastro é aberto**, e quem se cadastra cai no plano `nenhum`, com lista de
  processos vazia: conta criada, nenhum resumo liberado. Existe portanto um
  estado de "cadastrado e sem acesso" que é rotina, não erro.
- **`resumos.processo_slug` é escalar** — um resumo pertence a um processo. O
  processo `comum` existe para o conteúdo que cai em mais de um edital ou em
  nenhum; ele nunca aparece nas telas que listam "os vestibulares", porque
  ninguém presta Conteúdo comum.
- **O wikilink é gravado como texto literal `[[Título]]` dentro do HTML**, não
  como nó do TipTap, e o trigger resolve o destino **pelo título** — dois
  resumos com o mesmo título quebram conexões em silêncio.
- **Preço: não decidido.** `preco: null` em `lib/planos.ts` é estado declarado,
  e a interface é obrigada a tratá-lo em vez de mostrar valor de mentira.
  Pagamento hoje é Pix manual, com `planos_usuarios.ativo` no braço; o checkout
  do Mercado Pago, quando entrar, lê esse mesmo arquivo.
- **Não há suíte de testes** — nenhum runner, nenhum arquivo. Verificação é
  build mais exercitar a rota.
- Vocabulário do domínio, a usar sem traduzir: **resumo**, **wikilink**,
  **conexões** (cita) vs. **pai_id** (contém), **matéria**, **processo**,
  **visão** (`mental`/`grafo`), **edital**.

## Brand Commitments

Nome: **Plataforma Grafos**. Produção em `plataforma-grafos.vercel.app`.

A linguagem visual é **vinculante e já documentada**: `docs/identidade-visual.md`,
com o ADR `docs/adr/0001-identidade-visual.md` estabelecendo que **o
`globals.css` é a fonte de verdade** — quando os dois divergirem, o CSS ganha e
o documento é corrigido, nunca o contrário. Trabalho visual novo lê aqueles dois
antes de propor qualquer coisa.

O que aquele documento fixa, em resumo: contorno em vez de preenchimento;
elevação por superfície começando pelo anel de 1px; acento lilás escasso;
neutros mornos (vermelho acima do azul) porque o aluno passa a tarde na tela;
três famílias tipográficas com papéis que não se cruzam; e motivos que nascem do
conteúdo — grafo e faixa —, nada de ícone ou ilustração avulsa.

## Evidence on Hand

**Real e atribuível** — as conquistas do autor em `lib/autor.ts`: 1º lugar em
medicina no PASSE da UFMS entre todos os candidatos (2025), 920 na redação do
ENEM cursando o primeiro ano do ensino médio (2025), medalha de ouro no ranking
Poliedro no Colégio Harmonia (2025). É a única prova de terceiro na landing.

**Real:** o acervo em si — centenas de resumos escritos pelo autor e importados
por migration, com as oito matérias por disciplina fechadas e as provas da
escola em curso.

**Ausente de propósito, e a ausência é regra:** `DEPOIMENTOS` é uma lista vazia
e a seção some da página em vez de aparecer com exemplo. Numa landing que vende
reputação, depoimento inventado não é placeholder — é a destruição do argumento,
e não se desinventa. **Nunca preencher com nome fictício.**

**Não existe ainda:** preço, métrica de uso, número de alunos, aprovação de
aluno. Nada disso pode ser afirmado ou estimado em superfície nenhuma.

## Product Principles

1. **Onde a reputação é o argumento, nada é inventado.** Depoimento vazio some,
   preço indeciso não vira `R$ 00`, conquista sem atribuição não entra.
2. **As conexões são o produto.** Grafo, backlinks, trilho e linha do tempo saem
   de dado real; se um deles vira enfeite, o diferencial some junto.
3. **Plano é cobertura, nunca recurso trancado.** Nenhuma tela pode sugerir que
   o plano mais caro destrava função.
4. **Duas velocidades no mesmo conteúdo.** Revisar no celular e estudar no
   notebook são cenários distintos; toda superfície declara para qual foi
   desenhada, e o que só existe numa largura assume o custo de sumir na outra.
5. **Um fato, um arquivo.** Nome, cobertura, preço, cor de matéria e token visual
   têm cada um sua fonte única (`planos.ts`, `processos.ts`, `materias.ts`,
   `globals.css`); tela nenhuma reescreve à mão o que já está lá.

## Accessibility & Inclusion

Sem norma declarada pelo usuário, mas o código já pratica uma régua e ela deve
ser preservada: rótulos ligados, `autoComplete`, `aria-live` nos erros,
`aria-expanded`/`aria-current`, ícones decorativos como `aria-hidden`, anéis de
foco visíveis e `prefers-reduced-motion`. O **critério 2.5.8 da WCAG 2.2** (alvo
de toque de 24px) aparece citado e resolvido no código, com o recuo negativo
devolvendo o alinhamento que o padding tirou.

**Cor nunca é a única pista:** o nome da matéria acompanha o marcador colorido
em todos os lugares — sidebar, cartões e nós do grafo —, o que também resolve
daltonismo.

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
```

`(app)` é um **route group** — os parênteses não aparecem na URL.

## Decisões que não dá pra adivinhar lendo o código

**1. Wikilink é texto literal, não nó do TipTap.**
O editor grava `[[Título]]` como texto puro dentro do HTML. Isso é de propósito:
o trigger `sync_conexoes_resumo` no Postgres lê o campo `corpo` com a regex
`\[\[(.+?)\]\]` pra popular a tabela `conexoes`. Se alguém transformar o wikilink
num nó customizado com atributos, o grafo e os backlinks param de funcionar.

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

**5. `getClaims()`, não `getUser()`.**
`getClaims()` valida o JWT localmente; `getUser()` faz ida e volta na rede. Trocar
de volta reintroduz latência em toda navegação.

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

## Estado atual

Feito: landing, login, lista e página de resumo, backlinks, grafo, conexões
automáticas (trigger), admin/editor com editor rico, alternador admin/aluno,
sidebar estilo Obsidian, otimizações de performance.

Falta: **pagamento automático** — hoje `planos_usuarios.ativo` é atualizado na mão
depois de um Pix pessoal. Quando automatizar, um webhook do gateway (Asaas, Efí Bank
ou PagBank) deve atualizar essa mesma coluna.

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

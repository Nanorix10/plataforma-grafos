# Plataforma Mestre Ronny

Site de resumos interligados (estilo Obsidian) para PASSE, PAS UEM e PAS UnB.

## Como rodar localmente

1. Instale as dependências:
   ```
   npm install
   ```

2. Copie `env.example` para `.env.local` e preencha com os dados do seu projeto Supabase
   (Project Settings → API → Project URL e chave `anon` `public`):
   ```
   cp env.example .env.local
   ```

3. No SQL Editor do seu projeto Supabase, rode o conteúdo de `supabase/schema.sql`
   pra criar as tabelas (matérias, resumos, conexões, planos).

4. Rode o site:
   ```
   npm run dev
   ```
   Acesse em http://localhost:3000

   > **Sobre velocidade:** `npm run dev` recompila cada página no primeiro acesso e é
   > normal ele levar ~3s por navegação. Isso **não** é a velocidade real do site. Pra
   > ver como fica de verdade (~0,02s por página), rode:
   > ```
   > npm run build
   > npm start
   > ```

## Estrutura

- `/` — landing page pública
- `/login` — cadastro e login (Supabase Auth)
- `/resumos` — lista de resumos do aluno logado, filtrados pelo plano
- `/resumos/[slug]` — um resumo, com os `[[wikilinks]]` virando links de verdade
- `/mapa` — grafo visual das conexões entre resumos (estilo Obsidian)
- `/admin/editor` — editor de resumos (só admin)

Tudo que exige login vive no grupo de rotas `src/app/(app)/`, que tem um layout
compartilhado com a **barra lateral estilo Obsidian** (`Sidebar.tsx`): busca, árvore
de matérias colapsável, atalho pro mapa e o alternador de visão. Parênteses no nome
da pasta são um *route group* do Next — **não** aparecem na URL.

### Alternar entre admin e aluno

O botão "Ver como aluno" no rodapé da barra lateral grava um cookie `visao`.
`getSessao()` lê esse cookie e devolve:

- `isAdmin` — a visão **efetiva**, que a interface deve usar
- `isAdminReal` — a permissão de verdade, só pra decidir se o botão aparece

Isso é conveniência de interface, **não** segurança: quem impede um não-admin de
escrever são as policies de RLS no Postgres.

## O que falta ligar

- ~~**Editor de texto rico**~~ — feito: `/admin/editor` usa TipTap num visual de
  documento (folha branca sobre fundo cinza), com toolbar estilo Google Docs:
  desfazer/refazer, estilo de parágrafo, tamanho de fonte, negrito/itálico/sublinhado/
  tachado, cor de texto, marca-texto, alinhamento, listas, citação, código, divisória,
  link externo e wikilink. Aceita atalhos de markdown (`## `, `- `, `**negrito**`).
  Rodapé mostra contagem de palavras e status do **salvamento automático** (só para
  resumo já existente; grava apenas o `corpo` 1,2s após parar de digitar, via
  `salvarCorpoAuto` — de propósito não mexe em título/slug/matéria, pra um autosave
  nunca sobrescrever esses campos com valor velho).
  Digitar `[[` abre o autocomplete dos resumos
  existentes. **Importante:** o wikilink é gravado como texto literal `[[Título]]`
  dentro do HTML, e não como nó customizado — é assim que o trigger
  `sync_conexoes_resumo` continua encontrando as conexões. O corpo é salvo como HTML
  no campo `resumos.corpo`, estilizado pela classe `.conteudo-resumo` em
  `globals.css`, usada tanto no editor quanto na página publicada.

- ~~**Admin/editor**~~ — feito: `/admin/editor` lista, cria, edita e exclui resumos,
  protegido por `planos_usuarios.is_admin` (RLS em `resumos` também exige admin pra
  insert/update/delete). Pra virar admin, rode o comando comentado no fim de
  `supabase/schema.sql` (trocando o e-mail). Sem isso, `/admin/editor` redireciona
  pra `/resumos`.
- ~~**Conexões automáticas**~~ — feito: um trigger no Postgres (`sync_conexoes_resumo`
  em `supabase/schema.sql`) extrai os `[[links]]` do `corpo` sempre que um resumo é
  inserido/atualizado e sincroniza a tabela `conexoes`. Backlinks já aparecem em
  "resumos relacionados" na página do resumo. Se o banco já tinha resumos antes desse
  trigger existir, rode `update resumos set corpo = corpo;` uma vez pra sincronizar.
- **Pagamento:** por enquanto o campo `planos_usuarios.ativo` é atualizado manualmente
  (Pix pessoal). Quando for automatizar, um webhook do gateway escolhido (Asaas, Efí
  Bank ou PagBank) deve atualizar essa mesma tabela.

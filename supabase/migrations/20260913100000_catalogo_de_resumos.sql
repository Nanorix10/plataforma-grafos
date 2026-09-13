-- Contexto desta dupla de migrations (a outra e' `..._corpo_so_com_plano.sql`)
--
-- Antes: `create policy ... for select using (true)` em `resumos`. Qualquer
-- conta autenticada lia qualquer linha -- e `corpo` e' uma coluna dessa tabela.
-- Como o cadastro e' aberto (decisao 1b) e a chave anonima esta' no JavaScript
-- publico, bastava criar conta de graca e fazer um select para levar os 249
-- resumos. O bloqueio por plano existia so' em `PLANO_PROCESSOS`, no servidor
-- da aplicacao: protegia a TELA, nao o DADO.
--
-- O `PRODUCT.md` afirma que "RLS e' a unica protecao real". Para escrita era
-- verdade; para leitura, nao era.
--
-- A postura e' fechado por padrao: a tabela inteira passa a exigir plano, e o
-- que e' catalogo sai por uma vista explicita. Coluna nova em `resumos` nasce
-- protegida, sem ninguem precisar lembrar.
--
-- Aplicadas em DUAS etapas de proposito. Esta primeira so' ACRESCENTA: nada
-- deixa de funcionar se ela rodar sozinha. A segunda e' que fecha a porta, e
-- so' foi aplicada depois de esta ser conferida em producao.

-- ---------------------------------------------------------------------------
-- 1. A regra de acesso passa a existir no banco
-- ---------------------------------------------------------------------------
-- `lib/planos.ts` continua dono do nome comercial, do preco e da vitrine. O que
-- desce para ca' e' so' QUAIS PROCESSOS CADA PLANO ABRE, porque e' a unica parte
-- que a policy precisa saber -- e uma policy nao pode depender de um arquivo
-- TypeScript.
--
-- Sim, a lista existe nos dois lugares. Ela falha para o lado seguro: se os
-- dois discordarem, o banco nega e o aluno ve^ a tela de bloqueio; nada vaza.
-- Mudou `processos` em `lib/planos.ts`? Gere uma migration junto.
create table if not exists plano_processos (
  plano         text not null,
  processo_slug text not null references processos_seletivos(slug) on delete cascade,
  primary key (plano, processo_slug)
);

alter table plano_processos enable row level security;

drop policy if exists "todos leem o mapa de planos" on plano_processos;
create policy "todos leem o mapa de planos"
  on plano_processos for select to authenticated using (true);

-- `nenhum` fica FORA de proposito: lista vazia e' o estado de quem so' criou
-- conta, e uma linha aqui daria acervo de graca.
insert into plano_processos (plano, processo_slug) values
  ('passe',    'passe'),
  ('passe',    'comum'),
  ('completo', 'passe'),
  ('completo', 'pas-uem'),
  ('completo', 'pas-unb'),
  ('completo', 'comum'),
  ('pas',      'pas-uem'),
  ('pas',      'pas-unb'),
  ('pas',      'comum')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 2. O catalogo: tudo menos o corpo
-- ---------------------------------------------------------------------------
-- A barra lateral, a lista e o mapa precisam dos 249 titulos, inclusive os
-- bloqueados, com o cadeado -- e' o que prova que existe acervo. So' o texto sai
-- de alcance.
--
-- A vista roda com os privilegios do dono (`security_invoker` fica no padrao
-- `false`), entao ela ATRAVESSA o RLS da tabela de baixo de proposito: e'
-- exatamente o que a torna um catalogo. `corpo` nao esta' na lista de colunas,
-- entao nao ha' o que atravessar. O linter do Supabase marca isto como
-- `security_definer_view`; aqui e' a intencao, nao um descuido.
--
-- `margem_esq`/`margem_dir` tambem ficam de fora: sao regua de edicao, e o
-- catalogo nao desenha folha nenhuma.
drop view if exists resumos_catalogo;
create view resumos_catalogo as
  select id, slug, titulo, materia_slug, processo_slug, definicao, pai_id
  from resumos;

revoke all on resumos_catalogo from anon;
grant select on resumos_catalogo to authenticated;

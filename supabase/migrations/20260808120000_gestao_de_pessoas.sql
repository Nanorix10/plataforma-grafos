-- Gestão de alunos e admins pela própria interface.
--
-- O que existia: `planos_usuarios` guardava plano/ativo/is_admin, mas só tinha
-- policy de SELECT do próprio registro. Não havia UPDATE nenhum — nem para
-- admin —, então liberar um aluno depois do Pix exigia abrir o SQL Editor do
-- Supabase. E não havia como listar quem tinha se cadastrado: a linha em
-- `planos_usuarios` só nascia se alguém a criasse à mão.
--
-- O cadastro em si já era aberto, e o acesso já era fechado por padrão: sem
-- linha (ou com `ativo = false`) o plano é 'nenhum', que não libera processo
-- seletivo algum. Isto aqui não afrouxa nada disso — só dá ao admin as
-- ferramentas para enxergar e liberar.

-- ============================================
-- 1. E-mail visível para o admin
-- ============================================
-- `auth.users` não é legível pelas policies normais, e o projeto roda só com a
-- chave anônima (não há service_role em lugar nenhum — ver env.example). Sem o
-- e-mail copiado para cá, a tela de gestão mostraria uma lista de UUIDs e o
-- Ronny não teria como saber quem pagou.
alter table planos_usuarios
  add column if not exists email text;

alter table planos_usuarios
  add column if not exists criado_em timestamptz default now();

-- ============================================
-- 2. Quem se cadastra aparece na lista
-- ============================================
-- Sem este trigger, quem cria conta não deixa rastro em `planos_usuarios` — o
-- admin não veria o cadastro para poder liberar depois do pagamento.
--
-- `security definer` porque roda no contexto do signup, quando ainda não há
-- sessão com permissão de escrever aqui.
create or replace function criar_plano_do_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into planos_usuarios (user_id, email, plano, ativo, is_admin)
  values (new.id, new.email, 'nenhum', false, false)
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists trg_criar_plano_do_usuario on auth.users;
create trigger trg_criar_plano_do_usuario
  after insert on auth.users
  for each row
  execute function criar_plano_do_usuario();

-- Quem já tinha conta antes deste trigger entra na lista agora.
insert into planos_usuarios (user_id, email, plano, ativo, is_admin)
select u.id, u.email, 'nenhum', false, false
from auth.users u
on conflict (user_id) do update set email = excluded.email;

-- ============================================
-- 3. Quem é admin, sem recursão de RLS
-- ============================================
-- As policies de `resumos` perguntam "existe linha em planos_usuarios com
-- is_admin?" direto. Isso funciona lá porque é OUTRA tabela. Nas policies da
-- própria `planos_usuarios` o mesmo `select` dispararia a policy de select
-- dela, que dispararia o select de novo — recursão infinita, e o Postgres
-- recusa. `security definer` roda fora do RLS e corta o laço.
create or replace function eh_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from planos_usuarios
    where user_id = auth.uid() and is_admin = true
  );
$$;

-- ============================================
-- 4. Policies
-- ============================================
-- Ler: cada um vê o próprio registro; o admin vê todos.
drop policy if exists "admin ve todos os planos" on planos_usuarios;
create policy "admin ve todos os planos"
  on planos_usuarios for select
  to authenticated
  using (eh_admin());

-- Escrever: só admin, e com uma trava.
--
-- `user_id <> auth.uid() or is_admin = true` impede o admin de tirar o próprio
-- selo de admin. Sem isso, um clique errado na própria linha tranca a pessoa
-- para fora da gestão, e a única saída seria voltar ao SQL Editor — exatamente
-- o que esta migration veio eliminar. Mexer no próprio plano continua liberado.
drop policy if exists "admin gerencia planos" on planos_usuarios;
create policy "admin gerencia planos"
  on planos_usuarios for update
  to authenticated
  using (eh_admin())
  with check (
    eh_admin()
    and (user_id <> auth.uid() or is_admin = true)
  );

-- Não há policy de INSERT nem de DELETE de propósito: a linha de plano nasce e
-- morre junto da conta — pelo trigger acima e pelo cascade logo abaixo.

-- ============================================
-- 5. Apagar a conta apaga o plano junto
-- ============================================
-- A chave estrangeira era `references auth.users(id)` sem cascade. Com o
-- trigger acima toda conta passa a ter uma linha aqui, então excluir um usuário
-- pelo painel do Supabase passaria a esbarrar na FK e falhar. Cascade resolve.
alter table planos_usuarios
  drop constraint if exists planos_usuarios_user_id_fkey;
alter table planos_usuarios
  add constraint planos_usuarios_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- ============================================
-- Schema da Plataforma Grafos
-- Rode isso no SQL Editor do seu projeto Supabase
-- ============================================

-- Matérias e suas cores oficiais
create table materias (
  slug text primary key,
  nome text not null,
  cor text not null -- hex, ex: '#FD0032'
);

insert into materias (slug, nome, cor) values
  ('portugues', 'Língua Portuguesa', '#FD0032'),
  ('literatura', 'Literatura', '#A82C32'),
  ('matematica', 'Matemática', '#185E9E'),
  ('fisica', 'Física', '#008C92'),
  ('quimica', 'Química', '#AC2573'),
  ('biologia', 'Biologia', '#3F7848'),
  ('geografia', 'Geografia', '#BC462F'),
  ('filosofia', 'Filosofia', '#4E648C'),
  ('sociologia', 'Sociologia', '#AC2956'),
  ('historia', 'História', '#6C0B6A'),
  ('arte', 'Arte', '#4B3784'),
  ('redacao', 'Redação', '#5E93A3');

-- Processos seletivos cobertos
create table processos_seletivos (
  slug text primary key,
  nome text not null
);
insert into processos_seletivos (slug, nome) values
  ('passe', 'PASSE UFMS'),
  ('pas-uem', 'PAS UEM'),
  ('pas-unb', 'PAS UnB');

-- Resumos (as "notas" estilo Obsidian)
create table resumos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  materia_slug text references materias(slug),
  processo_slug text references processos_seletivos(slug),
  corpo text not null default '', -- markdown com [[wikilinks]]
  -- resumo em que este mora. null = está na raiz da matéria.
  -- "contém" (estrutura à mão) é outro eixo, e não substitui `conexoes`, que
  -- é "cita" (extraído dos [[wikilinks]]). Ver a migration de hierarquia.
  pai_id uuid references resumos(id) on delete set null,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- Conexões entre resumos (extraídas dos [[wikilinks]] ao salvar)
create table conexoes (
  origem_id uuid references resumos(id) on delete cascade,
  destino_id uuid references resumos(id) on delete cascade,
  primary key (origem_id, destino_id)
);

-- Planos de assinatura do aluno
create table planos_usuarios (
  user_id uuid references auth.users(id) primary key,
  plano text not null default 'nenhum', -- 'passe' | 'pas' | 'completo' | 'nenhum'
  ativo boolean not null default false,
  atualizado_em timestamptz default now()
);

-- ============================================
-- Row Level Security
-- ============================================
alter table resumos enable row level security;
alter table conexoes enable row level security;
alter table planos_usuarios enable row level security;

-- Qualquer usuário autenticado pode LER resumos
-- (o controle real de "pode ver o conteúdo completo" fica na aplicação,
--  comparando plano_usuario.plano com resumo.processo_slug)
create policy "usuarios autenticados podem ler resumos"
  on resumos for select
  to authenticated
  using (true);

create policy "usuarios autenticados podem ler conexoes"
  on conexoes for select
  to authenticated
  using (true);

-- Cada usuário só vê o próprio plano
create policy "usuario ve o proprio plano"
  on planos_usuarios for select
  to authenticated
  using (auth.uid() = user_id);

-- Escrita (criar/editar resumos) fica restrita ao admin.
-- planos_usuarios.is_admin marca quem tem acesso ao /admin/editor.
alter table planos_usuarios add column if not exists is_admin boolean not null default false;

create policy "admin pode inserir resumos"
  on resumos for insert
  to authenticated
  with check (
    exists (select 1 from planos_usuarios where user_id = auth.uid() and is_admin = true)
  );

create policy "admin pode editar resumos"
  on resumos for update
  to authenticated
  using (
    exists (select 1 from planos_usuarios where user_id = auth.uid() and is_admin = true)
  )
  with check (
    exists (select 1 from planos_usuarios where user_id = auth.uid() and is_admin = true)
  );

create policy "admin pode excluir resumos"
  on resumos for delete
  to authenticated
  using (
    exists (select 1 from planos_usuarios where user_id = auth.uid() and is_admin = true)
  );

-- Pra virar admin, rode (trocando o e-mail pelo seu):
-- insert into planos_usuarios (user_id, is_admin)
-- select id, true from auth.users where email = 'seu@email.com'
-- on conflict (user_id) do update set is_admin = true;

-- ============================================
-- Conexões automáticas
-- Sempre que um resumo é inserido ou tem o `corpo` atualizado
-- (via SQL Editor hoje, ou via um futuro admin/editor), extrai os
-- [[wikilinks]] e sincroniza a tabela `conexoes`. `security definer`
-- pra poder gravar em `conexoes` independente de quem disparou o insert.
-- ============================================
create or replace function sync_conexoes_resumo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  titulo_link text;
  destino_id uuid;
begin
  delete from conexoes where origem_id = new.id;

  for titulo_link in
    select (regexp_matches(new.corpo, '\[\[(.+?)\]\]', 'g'))[1]
  loop
    select id into destino_id from resumos where titulo = titulo_link;
    if destino_id is not null and destino_id <> new.id then
      insert into conexoes (origem_id, destino_id)
      values (new.id, destino_id)
      on conflict do nothing;
    end if;
  end loop;

  return new;
end;
$$;

create trigger trg_sync_conexoes_resumo
  after insert or update of corpo on resumos
  for each row
  execute function sync_conexoes_resumo();

-- Pra rodar num banco que já tem resumos cadastrados antes deste trigger
-- existir, refaz um "update" vazio no corpo pra disparar a sincronização:
-- update resumos set corpo = corpo;


-- ============================================
-- Definição breve
-- Frase curta que explica o tópico, escrita à mão no editor.
-- Aparece ao passar o mouse num nó do mapa, pra dar contexto sem
-- precisar abrir o resumo. Texto puro de propósito: vai dentro de um
-- balão pequeno, então formatação atrapalharia.
-- ============================================
alter table resumos add column if not exists definicao text not null default '';

-- Nome, texto e ponto do rótulo de cada estrutura de um modelo 3D,
-- editáveis pelo admin dentro do próprio modelo (decisão 28 do CONTEXTO.md).
--
-- Linha ausente = vale o "texto de fábrica" escrito no .html do modelo.
-- Coluna nula = idem, só para aquele campo. Por isso "restaurar o original"
-- é um UPDATE que anula campos, e não um DELETE: não há policy de delete.
create table public.modelos3d_partes (
  modelo text not null check (modelo ~ '^[a-z0-9_-]{1,40}$'),
  parte text not null check (parte ~ '^[a-z0-9_]{1,40}$'),
  nome text check (nome is null or char_length(trim(nome)) between 1 and 80),
  curto text check (curto is null or char_length(trim(curto)) between 1 and 40),
  so text check (so is null or char_length(so) <= 40),
  descricao text check (descricao is null or char_length(descricao) <= 1500),
  -- { "animal": [x, y, z], "vegetal": [x, y, z] } em coordenadas do modelo
  ancoras jsonb not null default '{}'::jsonb check (jsonb_typeof(ancoras) = 'object'),
  atualizado_em timestamptz not null default now(),
  primary key (modelo, parte)
);

alter table public.modelos3d_partes enable row level security;

-- Ler: todo mundo, inclusive sem conta — o modelo da Célula está na amostra grátis.
create policy "todos leem os textos dos modelos 3d"
  on public.modelos3d_partes for select to anon, authenticated using (true);

-- Escrever: só admin, pela mesma eh_admin() de eventos e pessoas.
create policy "admin cria texto de modelo 3d"
  on public.modelos3d_partes for insert to authenticated with check (eh_admin());
create policy "admin edita texto de modelo 3d"
  on public.modelos3d_partes for update to authenticated using (eh_admin()) with check (eh_admin());

grant select on public.modelos3d_partes to anon, authenticated;
grant insert, update on public.modelos3d_partes to authenticated;

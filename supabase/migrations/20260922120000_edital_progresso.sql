-- O aluno marca, no edital, o que já estudou.
--
-- ## Por que uma tabela própria, e não uma coluna em `leituras`
--
-- `leituras` é por RESUMO; esta marca é por TÓPICO DO EDITAL, e os dois não
-- se correspondem. Hoje 1114 tópicos apontam para só 44 resumos, e um mesmo
-- resumo cobre vários tópicos ("Gêneros literários" responde a três itens do
-- PASSE). Marcar o resumo marcaria os três de uma vez; marcar o tópico é o que
-- o aluno fez.
--
-- ## Por que a marca é declaração, e não dedução
--
-- Nada aqui é preenchido a partir de `leituras`. Abrir um resumo não é ter
-- estudado o tópico, e o aluno pode ter estudado pelo caderno — tópico sem
-- resumo nenhum também é marcável. Mesmo motivo pelo qual a decisão 16 recusou
-- a marca "lido": o site não afirma nada sobre o aluno que o aluno não disse.
--
-- ## Por que desmarcar APAGA a linha
--
-- Em `leituras` a linha carrega duas marcas e sobrevive a qualquer uma delas.
-- Aqui a linha É a marca: ausência já quer dizer "não marcado", e guardar
-- `marcado = false` criaria um terceiro estado que ninguém lê.

create table if not exists edital_progresso (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  topico_id  uuid not null references edital_topicos (id) on delete cascade,
  marcado_em timestamptz not null default now(),
  primary key (user_id, topico_id)
);

alter table edital_progresso enable row level security;

-- Sem policy de update: a linha não tem nada que mude. Marcar é insert,
-- desmarcar é delete.

create policy "aluno le o proprio progresso"
  on edital_progresso for select to authenticated
  using (user_id = auth.uid());

-- O tópico tem de existir e ser legível — a policy CONSULTA `edital_topicos`
-- em vez de repetir a regra dele, mesmo desenho de `leituras` (decisão 16).
create policy "aluno marca topico do edital"
  on edital_progresso for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from edital_topicos t where t.id = edital_progresso.topico_id)
  );

create policy "aluno desmarca o proprio progresso"
  on edital_progresso for delete to authenticated
  using (user_id = auth.uid());

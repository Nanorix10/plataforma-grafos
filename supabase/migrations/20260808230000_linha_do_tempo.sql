-- Linha do tempo interativa.
--
-- Um eixo único, com filtro por matéria, para situar eventos históricos das
-- humanidades (História, Filosofia, Literatura, Arte, Sociologia). O que o
-- aluno ganha é o que nenhum resumo isolado dá: ver que Sócrates e a Grécia
-- clássica são o MESMO momento, e que o Renascimento e as Grandes Navegações
-- se sobrepõem.
--
-- ============================================
-- Por que uma tabela nova, e não um campo em `resumos`
-- ============================================
-- Um resumo cobre vários eventos ("Revolução Francesa" tem 1789, 1791, 1793 e
-- 1799 dentro), e o autor vai querer marcar evento que ainda NÃO tem resumo —
-- o pedido foi "todos os eventos históricos que eu quiser". Um campo de ano no
-- resumo daria conta de nenhum dos dois casos.
--
-- O vínculo com resumo existe e é OPCIONAL (`resumo_id`). Quando há, clicar no
-- evento leva ao resumo; quando não há, o evento vive só com sua descrição.
--
-- ============================================
-- Por que ano é INTEIRO, e não `date`
-- ============================================
-- O material tem "séc. V a.C.", "1789", "476–1453" e "14/07/1789" lado a lado.
-- `date` resolve o último e atrapalha os outros: obriga a inventar mês e dia
-- para "século XV", e o a.C. do Postgres não sobrevive bem à viagem até o
-- JavaScript.
--
-- Então são dois campos com papéis separados:
--   `ano_inicio`/`ano_fim`  inteiros, negativo = a.C. — POSICIONAM no eixo
--   `rotulo_data`           texto livre — é o que o aluno LÊ
--
-- Assim "séc. XV" aparece escrito como o autor quer e ainda cai entre 1401 e
-- 1500. Vazio, o rótulo é derivado dos anos no código (lib/eventos.ts).
--
-- `ano_fim` nulo = evento pontual; preenchido = período, e vira barra no eixo.
--
-- ============================================
-- Sobre o ano zero
-- ============================================
-- Historicamente ele não existe: 1 a.C. é seguido de 1 d.C. Nada aqui proíbe
-- gravar 0 — recusar a entrada faria a tela brigar com quem digitou "0" para
-- dizer "início da era", e o erro de um ano não muda nada num eixo de milênios.
create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  ano_inicio integer not null,
  ano_fim integer,
  rotulo_data text not null default '',
  materia_slug text not null references materias(slug),
  -- `set null` e não `cascade`: apagar um resumo não pode apagar o evento
  -- histórico junto. O fato continua valendo sem o texto que falava dele.
  resumo_id uuid references resumos(id) on delete set null,
  descricao text not null default '',
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now(),

  -- período invertido desenharia uma barra de largura negativa, que some
  constraint eventos_periodo_valido
    check (ano_fim is null or ano_fim >= ano_inicio)
);

-- O eixo é sempre lido em ordem cronológica, e a tela de admin também lista
-- assim. Sem índice, todo carregamento vira sort completo.
create index if not exists eventos_ano_inicio_idx on eventos (ano_inicio);

-- Buscar "os eventos deste resumo" é o caminho do backlink no futuro, e o
-- `on delete set null` acima já obriga o Postgres a varrer esta coluna.
create index if not exists eventos_resumo_id_idx on eventos (resumo_id);

-- ============================================
-- Row Level Security
-- ============================================
alter table eventos enable row level security;

-- Ler: qualquer pessoa autenticada, como em `resumos`.
--
-- Evento NÃO é gateado por plano de propósito. Ele é só título, data e uma
-- linha de descrição — o conteúdo de verdade está no resumo, e esse continua
-- barrado: clicar num evento cujo resumo é de outro processo cai na tela
-- "faz parte de outro plano" que já existe. Gatear aqui também deixaria a
-- linha do tempo vazia para quem acabou de se cadastrar, e ela é justamente
-- uma boa vitrine do que a plataforma tem.
drop policy if exists "usuarios autenticados podem ler eventos" on eventos;
create policy "usuarios autenticados podem ler eventos"
  on eventos for select
  to authenticated
  using (true);

-- Escrever: só admin. `eh_admin()` é `security definer` e já existe desde a
-- migration de gestão de pessoas — usar a função em vez de repetir o
-- `exists (select 1 from planos_usuarios ...)` mantém uma definição só de
-- "quem é admin" no banco.
drop policy if exists "admin insere eventos" on eventos;
create policy "admin insere eventos"
  on eventos for insert
  to authenticated
  with check (eh_admin());

drop policy if exists "admin edita eventos" on eventos;
create policy "admin edita eventos"
  on eventos for update
  to authenticated
  using (eh_admin())
  with check (eh_admin());

drop policy if exists "admin exclui eventos" on eventos;
create policy "admin exclui eventos"
  on eventos for delete
  to authenticated
  using (eh_admin());

-- ============================================
-- Nada de restringir às cinco matérias
-- ============================================
-- O pedido nasceu das humanidades, mas um `check (materia_slug in (...))` só
-- criaria uma migration futura no dia em que a história da ciência entrar em
-- Física ou Química. A tela de cadastro oferece todas as matérias, e a linha
-- do tempo mostra chip apenas para as que têm evento — o recorte acontece
-- sozinho, pelos dados.

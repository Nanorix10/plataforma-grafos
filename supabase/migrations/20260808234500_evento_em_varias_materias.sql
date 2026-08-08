-- Um evento pode pertencer a várias matérias.
--
-- O caso que obriga: o Renascimento é História, Arte, Literatura e Filosofia ao
-- mesmo tempo. Com uma matéria só, o autor teria de escolher uma e mentir, ou
-- cadastrar o mesmo evento quatro vezes — e aí ligar/desligar um chip esconde
-- três cópias e deixa uma, que é pior do que não filtrar.
--
-- ============================================
-- Array, e não tabela de junção
-- ============================================
-- A junção seria o desenho "certo" de livro, e aqui pagaria caro por nada: a
-- linha do tempo carrega TODOS os eventos de uma vez e filtra no navegador,
-- então não existe consulta "eventos da matéria X" para um índice servir. A
-- junção acrescentaria uma tabela, três policies e um join em toda leitura para
-- responder algo que ninguém pergunta ao Postgres.
--
-- O que se perde com o array é a chave estrangeira, e é isso que o trigger
-- abaixo devolve. Vale o mesmo princípio dos ciclos e do RLS: a interface
-- ajuda, mas quem tem a palavra final é o banco.
alter table eventos
  add column if not exists materia_slugs text[] not null default '{}';

-- Os eventos que já existem viram array de um elemento. Roda antes de qualquer
-- constraint, senão o `check` de "pelo menos uma matéria" recusaria as linhas
-- que ainda estão com o array vazio do default.
update eventos
  set materia_slugs = array[materia_slug]
  where materia_slug is not null and cardinality(materia_slugs) = 0;

-- Evento sem matéria nenhuma não teria chip que o mostrasse: ficaria no banco e
-- sumiria da tela, que é o pior tipo de dado perdido.
alter table eventos drop constraint if exists eventos_tem_materia;
alter table eventos
  add constraint eventos_tem_materia check (cardinality(materia_slugs) > 0);

-- ============================================
-- A integridade que o array não dá sozinho
-- ============================================
-- `check` não aceita subconsulta, então a validação vive num trigger. Sem ela,
-- um slug digitado errado numa migration futura entra calado e o evento some da
-- linha do tempo — o componente procura a cor em MATERIAS, não acha, e o chip
-- nunca aparece.
create or replace function checar_materias_do_evento()
returns trigger
language plpgsql
as $$
declare
  invalida text;
begin
  select s into invalida
  from unnest(new.materia_slugs) as s
  where not exists (select 1 from materias m where m.slug = s)
  limit 1;

  if invalida is not null then
    raise exception 'matéria inexistente em materia_slugs: %', invalida;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_checar_materias_do_evento on eventos;
create trigger trg_checar_materias_do_evento
  before insert or update of materia_slugs on eventos
  for each row
  execute function checar_materias_do_evento();

-- ============================================
-- A coluna antiga sai
-- ============================================
-- Manter as duas seria manter duas verdades sobre a mesma coisa, e a primeira
-- divergência apareceria como um evento que filtra por uma matéria e desenha
-- com a cor de outra. O `update` acima já salvou o conteúdo.
alter table eventos drop column if exists materia_slug;

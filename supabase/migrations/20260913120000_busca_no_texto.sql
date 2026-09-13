-- Busca dentro do TEXTO do resumo, e nao so' no titulo.
--
-- A busca da barra filtrava os 249 TITULOS ja' em memoria: instantanea, e cega
-- para a palavra no meio do texto. Nao e' assim que se estuda -- o professor
-- cita um termo e o aluno vai atras dele, nao do nome do capitulo.
--
-- `unaccent` e' obrigatorio, nao enfeite: medido neste banco, sem ele
-- `mitocondria` NAO acha `mitocôndria` e `celula` nao acha `células`. Ninguem
-- digita acento no celular procurando coisa.
create extension if not exists unaccent;

-- Configuracao propria = portugues + tirar acento. `to_tsvector` com config
-- literal e' IMMUTABLE, que e' o que permite a coluna gerada abaixo.
drop text search configuration if exists portugues_sem_acento;
create text search configuration portugues_sem_acento (copy = portuguese);
alter text search configuration portugues_sem_acento
  alter mapping for hword, hword_part, word
  with unaccent, portuguese_stem;

-- O corpo e' HTML e NAO precisa ser limpo antes: o parser do Postgres reconhece
-- tag e a descarta sozinho. Conferido num resumo real de Fisica, que indexou
-- `aceler`, `centripet`, `trajetor` e nenhum `div` ou `class`.
--
-- Coluna GERADA, e nao trigger: nao tem como ficar dessincronizada do corpo,
-- nem por um update que esqueca de a atualizar.
--
-- Titulo com peso A e corpo com B: quem procura "Mitose" quer o resumo CHAMADO
-- Mitose antes dos que so' o mencionam.
alter table resumos
  add column if not exists busca tsvector
  generated always as (
    setweight(to_tsvector('portugues_sem_acento', coalesce(titulo, '')), 'A') ||
    setweight(to_tsvector('portugues_sem_acento', coalesce(corpo, '')), 'B')
  ) stored;

create index if not exists resumos_busca_idx on resumos using gin (busca);

-- SECURITY INVOKER (o padrao): roda com as permissoes de QUEM CHAMA, entao a
-- policy de `resumos` se aplica dentro dela -- a busca nunca devolve resumo
-- fora do plano. Trocar para DEFINER furaria a protecao criada em 13/09.
--
-- O trecho sai de HTML, entao carrega o que o HTML deixa: a troca de tag por
-- espaco gera rios de espaco, e as entidades chegam cruas. A limpeza acontece
-- aqui porque no cliente ele e' desenhado como TEXTO, sem interpretacao.
--
-- Marcadores `«»` e nao `<mark>`: devolver HTML para ser injetado seria abrir
-- uma porta de script por causa de um grifo. O cliente PARTE a string neles.
create or replace function buscar_no_texto(termo text, limite int default 12)
returns table (slug text, titulo text, materia_slug text, trecho text)
language sql
stable
as $$
  select r.slug, r.titulo, r.materia_slug,
         ts_headline(
           'portugues_sem_acento',
           btrim(regexp_replace(
             replace(replace(replace(replace(replace(
               regexp_replace(coalesce(r.corpo, ''), '<[^>]*>', ' ', 'g'),
               '&nbsp;', ' '), '&amp;', '&'), '&lt;', '<'), '&gt;', '>'), '&quot;', '"'),
             '\s+', ' ', 'g')),
           plainto_tsquery('portugues_sem_acento', termo),
           'StartSel=«,StopSel=»,MaxWords=24,MinWords=10,MaxFragments=1,FragmentDelimiter= … '
         ) as trecho
  from resumos r
  where r.busca @@ plainto_tsquery('portugues_sem_acento', termo)
  order by ts_rank(r.busca, plainto_tsquery('portugues_sem_acento', termo)) desc,
           r.titulo
  limit least(greatest(limite, 1), 30);
$$;

-- `revoke ... from anon` NAO basta: toda funcao nasce com EXECUTE para PUBLIC,
-- e `anon` herda dali -- conferido, `has_function_privilege('anon', ...)`
-- continuava true depois do revoke do papel. Quem perde o privilegio e' PUBLIC.
--
-- O RLS ja' devolvia vazio para anonimo. Isto e' a segunda tranca: sem login a
-- funcao nem se deixa chamar (401, nao lista vazia).
revoke all on function buscar_no_texto(text, int) from public;
revoke all on function buscar_no_texto(text, int) from anon;
grant execute on function buscar_no_texto(text, int) to authenticated;

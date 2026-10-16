-- Amostra gratis: um resumo inteiro legivel por quem NAO tem conta.
--
-- Para o video de lancamento. A decisao 14 fechou `resumos` por padrao (so' le^
-- quem tem plano que cobre o processo) e tirou o catalogo do `anon`. Nada disso
-- muda aqui: o que entra e' uma porta NOMEADA, linha a linha.
--
-- 1. `amostra` nasce `false` em toda linha. Abrir um resumo e' um ato explicito,
--    como liberar um aluno (decisao 1b).
-- 2. Uma policy de select A MAIS. Policies permissivas se somam por OU: a do
--    plano continua igual, e a linha marcada passa a ser lida tambem por `anon`
--    e por conta sem plano. As outras linhas seguem devolvendo zero.
-- 3. `amostra_contexto(slug)`: o pouco de catalogo que a pagina publica precisa
--    para os [[wikilinks]], os vizinhos e o "Cai em" -- so' dos resumos LIGADOS
--    a uma amostra. Reabrir `resumos_catalogo` ao `anon` entregaria os 254
--    titulos e definicoes a qualquer um; isto entrega meia duzia.
--
-- Para reverter:
--   drop function if exists amostra_contexto(text);
--   drop policy if exists "amostra e' publica" on resumos;
--   alter table resumos drop column if exists amostra;

alter table resumos add column if not exists amostra boolean not null default false;

drop policy if exists "amostra e' publica" on resumos;
create policy "amostra e' publica"
  on resumos for select to anon, authenticated
  using (amostra);

-- `security definer` de proposito: `conexoes`, `edital_topicos` e o catalogo
-- sao so' de `authenticated`, e quem chama isto nao tem conta. O corte e' o
-- `where ... amostra` logo na primeira CTE: slug que nao e' amostra devolve
-- null, e o resto da funcao nao roda sobre nada.
create or replace function amostra_contexto(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with recursive a as (
    select id, pai_id, materia_slug from resumos where slug = p_slug and amostra
  ),
  caminho as (
    select r.id, r.slug, r.titulo, r.materia_slug, r.pai_id, 1 as nivel
      from resumos r join a on r.id = a.pai_id
    union all
    select r.id, r.slug, r.titulo, r.materia_slug, r.pai_id, c.nivel + 1
      from resumos r join caminho c on r.id = c.pai_id
     where c.nivel < 20
  )
  select jsonb_build_object(
    'citados', coalesce((
      select jsonb_agg(jsonb_build_object(
        'slug', d.slug, 'titulo', d.titulo, 'materia_slug', d.materia_slug, 'definicao', d.definicao))
        from conexoes c join resumos d on d.id = c.destino_id
       where c.origem_id = a.id), '[]'::jsonb),
    'citam', coalesce((
      select jsonb_agg(jsonb_build_object(
        'slug', o.slug, 'titulo', o.titulo, 'materia_slug', o.materia_slug, 'definicao', o.definicao))
        from conexoes c join resumos o on o.id = c.origem_id
       where c.destino_id = a.id), '[]'::jsonb),
    'irmaos', coalesce((
      select jsonb_agg(jsonb_build_object(
        'slug', s.slug, 'titulo', s.titulo, 'materia_slug', s.materia_slug, 'definicao', s.definicao))
        from (
          select slug, titulo, materia_slug, definicao from resumos s
           where s.id <> a.id
             and (case when a.pai_id is not null then s.pai_id = a.pai_id
                       else s.materia_slug = a.materia_slug end)
           order by s.titulo
           limit 4
        ) s), '[]'::jsonb),
    'caminho', coalesce((
      select jsonb_agg(jsonb_build_object(
        'slug', c.slug, 'titulo', c.titulo, 'materia_slug', c.materia_slug) order by c.nivel desc)
        from caminho c), '[]'::jsonb),
    'provas', coalesce((
      select jsonb_agg(distinct jsonb_build_object('processo_slug', e.processo_slug, 'etapa', e.etapa))
        from edital_topicos e where e.resumo_id = a.id), '[]'::jsonb)
  )
  from a
$$;

revoke all on function amostra_contexto(text) from public;
grant execute on function amostra_contexto(text) to anon, authenticated;

-- A primeira amostra, escolhida pelo autor em 16/10/2026: cai no PASSE 1 e no
-- PAS UEM 1, entao serve aos dois publicos do video.
update resumos set amostra = true where slug = 'funcoes-inorganicas';

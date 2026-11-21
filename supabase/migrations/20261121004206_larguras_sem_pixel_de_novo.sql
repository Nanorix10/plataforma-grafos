-- Decisão 32, onda 2 refeita: as 33 figuras em pixel passam para "Coluna".
--
-- POR QUE AGORA DÁ: a primeira tentativa (20261121001414) foi desfeita porque
-- "Coluna" esticava a imagem até a largura da legenda. O conserto de CSS
-- (PR #176) fez a imagem em Coluna nunca passar do próprio arquivo, e com ele
-- as 33 figuras, trocadas para 100%, saem idênticas: 33 de 33 a 1440px e a
-- 375px, medidas nas páginas reais com as legendas reais.
--
-- O QUE FAZ: troca style="width:Npx" + data-largura="Npx" por 100% nas <img>,
-- nas duas ordens de atributo que o acervo tem. Tabelas (<table>, <col>) ficam
-- de fora. Os 3 bovinos de "Codominância" já são Estreita e não são tocados.
--
-- CÓPIA DE SEGURANÇA: backup.corpo_antes_larguras_2 (schema fora da API).
-- PARA DESFAZER:
--   update public.resumos r set corpo = b.corpo
--     from backup.corpo_antes_larguras_2 b where b.id = r.id;

create table backup.corpo_antes_larguras_2 as
  select id, slug, corpo, versao, now() as guardado_em
  from public.resumos
  where corpo ~ 'data-largura="[0-9]+px"';

revoke all on backup.corpo_antes_larguras_2 from public, anon, authenticated;

update public.resumos
   set corpo = regexp_replace(
         corpo,
         'style="width: ?[0-9]+px;?"( data-largura=")[0-9]+px"',
         'style="width:100%"\1100%"',
         'g')
 where corpo ~ 'data-largura="[0-9]+px"';

update public.resumos
   set corpo = regexp_replace(
         corpo,
         '(<img[^>]*data-largura=")[0-9]+px("[^>]*style=")width: ?[0-9]+px;?"',
         '\1100%\2width:100%"',
         'g')
 where corpo ~ 'data-largura="[0-9]+px"';

do $$
declare
  guardados int;
  diferentes int;
  sobrando int;
  estreitas int;
begin
  select count(*) into guardados from backup.corpo_antes_larguras_2;
  if guardados <> 17 then
    raise exception 'Esperava 17 resumos com figura em pixel e achei %. Nada foi gravado.', guardados;
  end if;

  select count(*) into diferentes
    from backup.corpo_antes_larguras_2 b
    join public.resumos r on r.id = b.id
   where regexp_replace(b.corpo, '<[^>]+>', '', 'g')
      <> regexp_replace(r.corpo, '<[^>]+>', '', 'g');
  if diferentes > 0 then
    raise exception 'O texto de % resumo(s) mudou. Nada foi gravado.', diferentes;
  end if;

  select count(*) into sobrando
    from public.resumos r, regexp_matches(r.corpo, '(<img[^>]*(width: ?[0-9]+px|data-largura="[0-9]+px")[^>]*>)', 'g') t;
  if sobrando > 0 then
    raise exception '% figura(s) em pixel sobraram. Nada foi gravado.', sobrando;
  end if;

  select count(*) into estreitas
    from public.resumos r, regexp_matches(r.corpo, '(data-tamanho="estreita")', 'g') t;
  if estreitas <> 3 then
    raise exception 'Esperava os 3 bovinos estreitos e achei %. Nada foi gravado.', estreitas;
  end if;
end;
$$;

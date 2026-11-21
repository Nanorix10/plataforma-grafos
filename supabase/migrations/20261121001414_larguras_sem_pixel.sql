-- Decisão 32, onda 2: nenhuma figura do acervo com largura em pixel.
--
-- O QUE FAZ: as 36 figuras gravadas com largura em pixel (style="width:Npx" e
-- data-largura="Npx", em 18 resumos) passam para um dos três tamanhos.
--   - 33 viram "Coluna" (100%). Nelas a largura em pixel era a largura do
--     próprio arquivo, e "Coluna" mostra o arquivo até o limite do texto:
--     medido com o CSS do site a 1440px e a 375px, NADA muda na tela.
--   - 3 (os bovinos de "Codominância", hoje 320px) viram "Estreita":
--     data-tamanho="estreita" na <figure>, 372px no computador, os três
--     iguais. Escolha do autor em 20/11/2026. No celular, nada muda.
--
-- O acervo grava a largura de dois jeitos ("width:392px" e "width: 566px;"),
-- e o padrão cobre os dois. Tabelas (<table>, <col>) também gravam largura em
-- pixel e ficam de fora: são do editor de tabelas, não de figuras.
--
-- CÓPIA DE SEGURANÇA: backup.corpo_antes_larguras (schema fora da API).
-- PARA DESFAZER:
--   update public.resumos r set corpo = b.corpo
--     from backup.corpo_antes_larguras b where b.id = r.id;

create table backup.corpo_antes_larguras as
  select id, slug, corpo, versao, now() as guardado_em
  from public.resumos
  where corpo ~ 'data-largura="[0-9]+px"';

revoke all on backup.corpo_antes_larguras from public, anon, authenticated;

-- os bovinos primeiro: a marca vai na <figure>, antes de a largura sair do pixel
update public.resumos
   set corpo = regexp_replace(
         corpo,
         '(<figure class="figura"[^>]*)(>\s*<img src="/img/resumos/biologia/bovino-(branca|ruao|vermelha)\.webp")',
         '\1 data-tamanho="estreita"\2',
         'g')
 where slug = 'codominancia'
   and corpo !~ 'data-tamanho';

update public.resumos
   set corpo = regexp_replace(
         corpo,
         'style="width: ?[0-9]+px;?"( data-largura=")[0-9]+px"',
         'style="width:100%"\1100%"',
         'g')
 where corpo ~ 'data-largura="[0-9]+px"';

-- A outra ordem: em 5 figuras (Ortografia e Movimentos retilíneos) o
-- data-largura vem ANTES do style, depois de atributos soltos que um editor
-- antigo serializou no HTML (largura=, quebra=, brilho=...). Os soltos ficam:
-- o editor não os lê e os reescreve limpos na próxima vez que o resumo for
-- salvo; tirá-los aqui seria mexer além do que esta onda promete.
update public.resumos
   set corpo = regexp_replace(
         corpo,
         '(<img[^>]*data-largura=")[0-9]+px("[^>]*style=")width: ?[0-9]+px;?"',
         '\1100%\2width:100%"',
         'g')
 where corpo ~ 'data-largura="[0-9]+px"';

-- A PROVA: texto idêntico, nenhum pixel sobrando, exatamente 3 estreitas.
do $$
declare
  diferentes int;
  sobrando int;
  estreitas int;
begin
  select count(*) into diferentes
    from backup.corpo_antes_larguras b
    join public.resumos r on r.id = b.id
   where regexp_replace(b.corpo, '<[^>]+>', '', 'g')
      <> regexp_replace(r.corpo, '<[^>]+>', '', 'g');
  if diferentes > 0 then
    raise exception 'O texto de % resumo(s) mudou. Nada foi gravado.', diferentes;
  end if;

  select count(*) into sobrando
    from public.resumos r, regexp_matches(r.corpo, '(<img[^>]*(width: ?[0-9]+px|data-largura="[0-9]+px")[^>]*>)', 'g') t;
  if sobrando > 0 then
    raise exception '% largura(s) em pixel sobraram. Nada foi gravado.', sobrando;
  end if;

  select count(*) into estreitas
    from public.resumos r, regexp_matches(r.corpo, '(data-tamanho="estreita")', 'g') t;
  if estreitas <> 3 then
    raise exception 'Esperava 3 figuras estreitas e achei %. Nada foi gravado.', estreitas;
  end if;
end;
$$;

-- Desfaz a parte "Coluna" da onda 2 (20261121001414_larguras_sem_pixel).
--
-- POR QUÊ: o antes/depois foi medido com legendas de uma letra, e a conclusão
-- "33 ficam iguais" estava errada. Numa figura em bloco a <figure> é
-- fit-content, e a LEGENDA entra nessa conta: com a legenda real (140 letras
-- em média), a figura alarga até a coluna e a imagem em 100% estica junto.
-- Medido depois de aplicar, em ciclo-celular: a prófase foi de 392px para
-- 569px, ampliada além do próprio arquivo.
--
-- O QUE FAZ: os 17 resumos com as 33 figuras voltam ao corpo de antes da onda
-- 2, tirado de backup.corpo_antes_larguras. "Codominância" NÃO volta: os
-- bovinos como Estreita foram escolha do autor e saíram como esperado (os três
-- iguais, 60% da caixa da questão).
--
-- TRAVA: só restaura o resumo cuja versão é exatamente a que a onda 2 deixou
-- (antes + 1, ou + 2 nos dois que passaram pelo segundo padrão). Resumo
-- editado depois disso fica como está, e a contagem final acusa.

update public.resumos r
   set corpo = b.corpo
  from backup.corpo_antes_larguras b
 where b.id = r.id
   and b.slug <> 'codominancia'
   and r.versao = b.versao + case when b.slug in ('ortografia', 'movimentos-retilineos') then 2 else 1 end;

do $$
declare
  restaurados int;
  px int;
  estreitas int;
begin
  select count(*) into restaurados
    from backup.corpo_antes_larguras b join public.resumos r on r.id = b.id
   where b.slug <> 'codominancia' and r.corpo = b.corpo;
  if restaurados <> 17 then
    raise exception 'Esperava restaurar 17 resumos e restaurei %. Nada foi gravado.', restaurados;
  end if;

  select count(*) into px
    from public.resumos r, regexp_matches(r.corpo, '(data-largura="[0-9]+px")', 'g') t;
  if px <> 33 then
    raise exception 'Esperava 33 figuras de volta ao pixel e achei %. Nada foi gravado.', px;
  end if;

  select count(*) into estreitas
    from public.resumos r, regexp_matches(r.corpo, '(data-tamanho="estreita")', 'g') t;
  if estreitas <> 3 then
    raise exception 'Esperava os 3 bovinos estreitos e achei %. Nada foi gravado.', estreitas;
  end if;
end;
$$;

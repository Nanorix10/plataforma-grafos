-- Três correções de conteúdo em resumos de Geografia publicados, aprovadas
-- pelo autor. Cada bloco aborta se o trecho antigo não aparecer exatamente uma
-- vez no corpo atual.
--
-- 1. movimento-de-placas: graben não é subducção. Subducção é a placa oceânica
--    mergulhando sob a continental (Vestibular de Verão 2016, Prova 3 GEO, Q5,
--    item 01 correto, gabarito 23). "(epirogênese negativa)" fica: está no
--    caderno (Geografia.docx §00143).
-- 2. vulcanismo: o Pacífico não fica "entre África e Ásia". Vestibular de Verão
--    2019, Prova 2 GEO, Q32, item 04 correto (Círculo de Fogo do Pacífico),
--    gabarito 15; Vestibular de Verão 2022, Q34, item 16 incorreto ("Círculo
--    de Fogo do Atlântico"), gabarito 11.
-- 3. movimento-de-conveccao-do-magma: a astenosfera não é líquida. Nenhuma
--    prova trata do ponto; por isso a palavra só foi retirada, sem substituta.

do $$
declare
  antigo constant text := 'Graben: subducção ou rebaixamento (epirogênese negativa);';
  novo   constant text := 'Graben: rebaixamento ou abatimento (epirogênese negativa);';
  atual  text;
  n      int;
begin
  select corpo into atual from resumos where slug = 'movimento-de-placas';
  if atual is null then
    raise exception 'resumo movimento-de-placas não encontrado';
  end if;
  n := (length(atual) - length(replace(atual, antigo, ''))) / length(antigo);
  if n <> 1 then
    raise exception 'movimento-de-placas: trecho antigo aparece % vez(es); esperado 1', n;
  end if;
  update resumos
     set corpo = replace(corpo, antigo, novo)
   where slug = 'movimento-de-placas';
end $$;

do $$
declare
  antigo constant text := 'Maior concentração de vulcões ativos está no Oceano Pacifico, entre África e Ásia;';
  novo   constant text := 'Maior concentração de vulcões ativos está no Círculo de Fogo do Pacífico;';
  atual  text;
  n      int;
begin
  select corpo into atual from resumos where slug = 'vulcanismo';
  if atual is null then
    raise exception 'resumo vulcanismo não encontrado';
  end if;
  n := (length(atual) - length(replace(atual, antigo, ''))) / length(antigo);
  if n <> 1 then
    raise exception 'vulcanismo: trecho antigo aparece % vez(es); esperado 1', n;
  end if;
  update resumos
     set corpo = replace(corpo, antigo, novo)
   where slug = 'vulcanismo';
end $$;

do $$
declare
  antigo constant text := '<strong>astenosfera (líquida)</strong>';
  novo   constant text := '<strong>astenosfera</strong>';
  atual  text;
  n      int;
begin
  select corpo into atual from resumos where slug = 'movimento-de-conveccao-do-magma';
  if atual is null then
    raise exception 'resumo movimento-de-conveccao-do-magma não encontrado';
  end if;
  n := (length(atual) - length(replace(atual, antigo, ''))) / length(antigo);
  if n <> 1 then
    raise exception 'movimento-de-conveccao-do-magma: trecho antigo aparece % vez(es); esperado 1', n;
  end if;
  update resumos
     set corpo = replace(corpo, antigo, novo)
   where slug = 'movimento-de-conveccao-do-magma';
end $$;

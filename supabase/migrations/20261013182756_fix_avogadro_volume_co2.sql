-- O exemplo resolvido de `principio-de-avogadro` arredondava 224/44 para 5 L.
-- A conta dá 5,09 L: corrige para x ≈ 5,1 L. Aborta se o trecho antigo não
-- aparecer exatamente uma vez.
do $$
declare
  antigo constant text := 'data-latex="x=5L CO_2"';
  novo   constant text := 'data-latex="x\approx 5{,}1\ L\ CO_2"';
  atual  text;
  n      int;
begin
  select corpo into atual from resumos where slug = 'principio-de-avogadro';
  if atual is null then
    raise exception 'resumo principio-de-avogadro não encontrado';
  end if;
  n := (length(atual) - length(replace(atual, antigo, ''))) / length(antigo);
  if n <> 1 then
    raise exception 'trecho antigo aparece % vez(es); esperado 1', n;
  end if;
  update resumos
     set corpo = replace(corpo, antigo, novo)
   where slug = 'principio-de-avogadro';
end $$;

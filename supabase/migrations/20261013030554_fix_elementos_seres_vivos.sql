-- Características dos seres vivos: corrige a lista de elementos mais
-- abundantes, que omitia o oxigênio.
--
-- ## Fonte
-- O caderno (Biologia.docx §00088; Resumo para PAS UEM 1°etapa.docx §00739;
-- Resumo para PR1G4.docx §00037) lista "C, H, N, P e S" e, na linha seguinte,
-- cita a H2O como a molécula mais abundante nos seres vivos. As provas listam
-- o oxigênio:
-- - PAS-UEM 2020, 1ª etapa, questão 9 (gabarito 27), pdfs/pas20/e1.pdf p. 5:
--   "carbono, hidrogênio, oxigênio, nitrogênio, fósforo e enxofre";
-- - PAS-UEM 2024, 1ª etapa, questão 14 (gabarito 22), pdfs/pas24/E1.pdf p. 7:
--   "Carbono, oxigênio, hidrogênio, nitrogênio e fósforo".
--
-- ## Guarda
-- O trecho antigo tem de aparecer exatamente uma vez no corpo; senão, aborta.
-- md5 do corpo depois da troca (conferido em 12/10/2026):
-- 7484194d2f8fcdb1ad8179823b70578f.

do $$
declare
  antigo constant text := 'carbono (C), hidrogênio (H), nitrogênio (N), fósforo (P) e enxofre (S)';
  novo   constant text := 'carbono (C), hidrogênio (H), oxigênio (O), nitrogênio (N), fósforo (P) e enxofre (S)';
  atual  text;
  n      int;
begin
  select corpo into atual from resumos where slug = 'caracteristicas-dos-seres-vivos';
  if atual is null then
    raise exception 'resumo caracteristicas-dos-seres-vivos não encontrado';
  end if;
  n := (length(atual) - length(replace(atual, antigo, ''))) / length(antigo);
  if n <> 1 then
    raise exception 'trecho antigo aparece % vez(es); esperado 1', n;
  end if;
  update resumos
     set corpo = replace(corpo, antigo, novo)
   where slug = 'caracteristicas-dos-seres-vivos';
end $$;

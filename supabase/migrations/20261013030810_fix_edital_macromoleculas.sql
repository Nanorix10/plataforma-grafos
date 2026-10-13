-- Religa o tópico do PAS UEM 3ª etapa "Noções gerais sobre carboidratos,
-- lipídios e proteínas." a `macromoleculas`. A migration 20261007194940 fazia
-- essa ligação, mas em 12/10/2026 o tópico estava com resumo_id nulo no banco.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 3
   and e.texto = 'Noções gerais sobre carboidratos, lipídios e proteínas.'
   and e.resumo_id is null
   and r.slug = 'macromoleculas';

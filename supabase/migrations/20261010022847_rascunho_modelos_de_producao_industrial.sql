-- Modelos de produção industrial: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Junta três resumos em um.** Taylorismo, Fordismo e Toyotismo existiam como
-- resumos soltos (~500 caracteres cada, sem pai, sem edital, entrados em
-- 20260823190000). Decisão do autor: apagar os três e reuni-los aqui, cada um
-- como seção (grafo `h2`) do resumo novo.
--
-- ## Por que este tópico
--
-- Conferido no banco em 10/10/2026: nenhum resumo chamado "Modelos de produção
-- industrial" (slug livre); os três antigos sem nenhum tópico de edital.
-- Processo `comum`, como os três que ele substitui (decisão 1c).
--
-- ## Fontes, e só elas
--
-- 1. Caderno: `Resumos 2025/Resumos 3º bimestre/Resumo para PR2G1.docx`, seção
--    `GEOGRAFIA`, §00208–00227 do extrator (Toyotismo, Taylorismo, Fordismo).
--    Texto idêntico em `Materias e conteúdos feitos/Geografia.docx`,
--    §00317–00336. O contexto (Estados Unidos, Segunda Revolução Industrial,
--    fim do século XIX) vem de `Resumos 2026/Resumos 2°bi 2° ano/Resumo para
--    PR1G2.docx`, `GEOGRAFIA B`, §00087–00090.
-- 2. Edital: nenhum tópico ligado (ver abaixo).
-- 3. Provas: PAS-UEM 2024, etapa 2, questão 05 (gabarito 13), em
--    `Documents/UEM-Provas/pdfs/pas24/E2.pdf`, p. 6 — a questão e duas
--    pegadinhas (itens 02 e 16). PAS-UEM 2019, etapa 2, questão 08 (gabarito
--    15), em `pdfs/pas19/E2G1.pdf`, p. 6 — a pegadinha do item 16.
--
-- ## O que difere do caderno
--
-- - Ordem cronológica (Taylorismo → Fordismo → Toyotismo); o caderno abre
--   pelo Toyotismo.
-- - Tabela comparativa montada só com itens do caderno (reorganização, não
--   conteúdo novo).
--
-- ## Correções de conteúdo, decididas pelo autor em 10/10/2026
--
-- 1. Taylorismo: o caderno dizia "Estabelece o uso da linha de montagem."
--    (PR2G1 §00221). Item retirado: a linha de montagem com esteira é do
--    Fordismo. Na tabela, a linha "Linha de montagem" virou "Organização da
--    produção", e a célula do Taylorismo diz "Divisão da produção em etapas".
-- 2. Toyotismo: o caderno dizia "Funcionários especialistas por setor;"
--    (PR2G1 §00213). Trocado por "Funcionários polivalentes (atuam em várias
--    etapas);", e a tabela ganhou a linha "Funcionários".
-- 3. Fordismo: o caderno dizia "Taylorismo e fordismo no fim do século XIX"
--    (PR1G2 §00090). O Contexto do Fordismo data a linha de montagem de Ford
--    em 1913–14, no início do século XX; o Taylorismo segue no fim do XIX.
--
-- ## Edital
--
-- Nenhum tópico ligado; os candidatos ficam cobertos pela metade:
-- - PASSE 2ª etapa, geografia: "O processo de Industrialização, fordista e
--   pós-fordista, e os impactos ambientais…" — faltam pós-fordismo e impactos;
-- - PASSE 2ª etapa, história: "Mudanças no modo de produção: Taylorismo;
--   Fordismo. Contracultura…" — faltam contracultura e consumismo;
-- - PAS UEM 2ª etapa, "Sistemas de produção." — está no bloco do espaço rural.
--
-- ## Referências aos três resumos apagados (levantadas em 10/10/2026)
--
-- FKs para `resumos` (pg_constraint): resumos.pai_id, conexoes.origem_id,
-- conexoes.destino_id, eventos.resumo_id, edital_topicos.resumo_id,
-- leituras.resumo_id, grifos.resumo_id, respostas.resumo_id.
-- Na data: 0 filhos, 0 conexões, 0 eventos, 0 tópicos de edital, 0 grifos,
-- 0 respostas, 0 wikilinks `[[Taylorismo|Fordismo|Toyotismo]]` e 0 links
-- `/resumos/<slug>` no corpo de outros resumos; 1 leitura (sem favorito).
-- Mesmo assim, cada passo abaixo redireciona o que existir na hora em que a
-- migration rodar, e ela aborta se houver grifo ou resposta (não têm para onde
-- ir: o grifo se ancora num texto que deixa de existir).

-- 1. O resumo novo.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'modelos-de-producao-industrial',
  'Modelos de produção industrial',
  'geografia',
  'comum',
  'Taylorismo, Fordismo e Toyotismo: os métodos de organização da produção industrial, da linha de montagem ao Just in Time.',
  '<p>Métodos de organização da produção nas indústrias, que mudaram ao longo do tempo a forma de produzir;</p>
<ul><li><p><strong>Taylorismo:</strong> 1º método científico aplicado nas indústrias, com a produção dividida em etapas;</p></li>
<li><p><strong>Fordismo:</strong> o Taylorismo com esteira na linha de montagem, grandes estoques e veículos padronizados;</p></li>
<li><p><strong>Toyotismo:</strong> modelo japonês voltado à qualidade, sem grandes estoques;</p></li>
<li><p><strong>Obs:</strong> a industrialização brasileira em [[Industrialização do Brasil]].</p></li></ul>
<h2 data-corrido="sim">Taylorismo:</h2>
<p>1º método científico a ser aplicado nas indústrias;</p>
<ul><li><p><strong>Contexto:</strong> fim do século XIX, nos Estados Unidos, na Segunda [[Revolução Industrial]];</p></li>
<li><p><strong>Fundamento:</strong> divide a produção em várias etapas, com funcionários muito especializados;</p>
<ul><li><p>Cronometragem da produção;</p></li>
<li><p>Bônus salariais por produção;</p></li></ul></li>
<li><p><strong>Consequência:</strong> aumento da produtividade e da eficiência e, com isso, aumento do lucro;</p></li>
<li><p><strong>Obs:</strong> para os críticos, esse modelo causa a <strong>alienação</strong> do funcionário (não domina todo o processo).</p></li></ul>
<h2 data-corrido="sim">Fordismo:</h2>
<p>o Taylorismo observado, aplicado às fábricas e melhorado para a sua realidade;</p>
<ul><li><p><strong>Contexto:</strong> Estados Unidos, na Segunda Revolução Industrial; linha de montagem de Ford em 1913–14, no início do século XX;</p></li>
<li><p>Coloca uma <strong>esteira</strong> na linha de montagem;</p></li>
<li><p>Estabelece bônus por produtividade, finais de semana e aumento de salário;</p></li>
<li><p><strong>Grandes estoques:</strong> para atender a sociedade de consumo da época (American Way of Life);</p></li>
<li><p><strong>Estandardização:</strong> veículos padronizados, para aumentar a produtividade, ou seja, sem customização.</p></li></ul>
<h2 data-corrido="sim">Toyotismo:</h2>
<p>modelo japonês que mudou o método de produção;</p>
<ul><li><p><strong>Objetivo:</strong> a qualidade;</p></li>
<li><p><strong>Método Kaizen:</strong> melhora contínua e controle de qualidade em todas as etapas;</p></li>
<li><p><strong>Just in Time:</strong> fim dos grandes estoques;</p>
<ul><li><p><strong>Fundamento:</strong> evitar crises de superprodução e abrir a possibilidade de customização;</p></li>
<li><p><strong>Ex:</strong> carros sob demanda;</p></li></ul></li>
<li><p>Funcionários polivalentes (atuam em várias etapas);</p></li>
<li><p>Robotização e automação.</p></li></ul>
<h2>Comparação entre os modelos</h2>
<table><tbody><tr><th><p></p></th><th><p><strong>Taylorismo</strong></p></th><th><p><strong>Fordismo</strong></p></th><th><p><strong>Toyotismo</strong></p></th></tr>
<tr><td><p>Objetivo</p></td><td><p>Produtividade e eficiência</p></td><td><p>Produtividade</p></td><td><p>Qualidade</p></td></tr>
<tr><td><p>Organização da produção</p></td><td><p>Divisão da produção em etapas</p></td><td><p>Esteira na linha de montagem</p></td><td><p>Robotização e automação</p></td></tr>
<tr><td><p>Funcionários</p></td><td><p>Muito especializados</p></td><td><p>—</p></td><td><p>Polivalentes (atuam em várias etapas)</p></td></tr>
<tr><td><p>Estoques</p></td><td><p>—</p></td><td><p>Grandes estoques</p></td><td><p>Fim dos grandes estoques (Just in Time)</p></td></tr>
<tr><td><p>Produto</p></td><td><p>—</p></td><td><p>Padronizado, sem customização</p></td><td><p>Sob demanda, com customização</p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>O Toyotismo não foi desenvolvido na Inglaterra no século XIX; é um modelo japonês (PAS-UEM 2024, 2ª etapa);</p></li>
<li><p>O Taylorismo não é uma forma artesanal de organização do trabalho, nem valoriza a autonomia dos trabalhadores diante dos processos produtivos (PAS-UEM 2019, 2ª etapa);</p></li>
<li><p>Com a industrialização, os trabalhadores não passaram a dominar o ciclo produtivo do início ao fim (PAS-UEM 2024, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="368111a9-7276-4313-85c3-72efd4168274" data-gabarito="13"><p>(PAS-UEM 2024, 2ª etapa) Sobre a Revolução Industrial e a organização da produção no mundo capitalista, assinale o que for correto.</p><p>(01) O taylorismo consiste em organizar o processo produtivo de modo que cada trabalhador desempenhe tarefas especializadas e repetitivas, a fim de aumentar a produtividade no interior das fábricas.</p><p>(02) Desenvolvido na Inglaterra durante a segunda metade do século XIX, o toyotismo defende que a produção industrial seja realizada em pequena escala, a fim de garantir a qualidade dos produtos fabricados.</p><p>(04) Na segunda metade do século XVIII, a mecanização do setor têxtil proporcionou o aumento da produção por meio das invenções da máquina de fiar e dos teares hidráulico e mecânico.</p><p>(08) A industrialização possibilitou a separação entre o capital, representado pelos donos dos meios de produção, e o trabalho, representado pelos assalariados, diferenciando-se da organização corporativa da produção empregada pelos artesãos.</p><p>(16) Com a Revolução Industrial os trabalhadores passaram a dominar o ciclo produtivo do início ao fim, pois conheciam os procedimentos técnicos empregados na confecção de um produto.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. O Taylorismo divide a produção em várias etapas, com funcionários muito especializados, para aumentar a produtividade;</p><p>(02) Incorreta. O Toyotismo é um modelo japonês; o objetivo de qualidade está certo, a origem inglesa no século XIX não;</p><p>(04) Correta. A 1ª fase da Revolução Industrial surgiu na Inglaterra, com destaque para a produção de tecidos;</p><p>(08) Correta. A industrialização dividiu a sociedade em burguesia, dona dos meios de produção, e proletariado, assalariado;</p><p>(16) Incorreta. Com a produção dividida em etapas, o funcionário não domina todo o processo (alienação, segundo os críticos);</p><p><strong>Soma: 01 + 04 + 08 = 13</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Taylorismo:</h3>
<p>1º método científico aplicado nas indústrias; produção em etapas, cronometrada;</p>
<h3 data-corrido="sim">Fordismo:</h3>
<p>Taylorismo com esteira na linha de montagem, grandes estoques e veículos padronizados;</p>
<h3 data-corrido="sim">Estandardização:</h3>
<p>veículos padronizados, sem customização, para aumentar a produtividade;</p>
<h3 data-corrido="sim">Toyotismo:</h3>
<p>modelo japonês com objetivo na qualidade;</p>
<h3 data-corrido="sim">Método Kaizen:</h3>
<p>melhora contínua e controle de qualidade em todas as etapas;</p>
<h3 data-corrido="sim">Just in Time:</h3>
<p>fim dos grandes estoques, com produção sob demanda;</p>
<h3 data-corrido="sim">Alienação do funcionário:</h3>
<p>crítica ao Taylorismo: o funcionário não domina todo o processo.</p>'
)
on conflict (slug) do nothing;

-- 2. Trava: grifo ou resposta nos antigos não tem destino.
do $$
begin
  if exists (select 1 from grifos g join resumos r on r.id = g.resumo_id
              where r.slug in ('taylorismo', 'fordismo', 'toyotismo'))
     or exists (select 1 from respostas x join resumos r on r.id = x.resumo_id
                 where r.slug in ('taylorismo', 'fordismo', 'toyotismo')) then
    raise exception 'grifos ou respostas em taylorismo/fordismo/toyotismo: decidir antes de apagar';
  end if;
end $$;

-- 3. Redirecionar cada referência para o resumo novo.
with novo as (select id from resumos where slug = 'modelos-de-producao-industrial'),
     velhos as (select id from resumos where slug in ('taylorismo', 'fordismo', 'toyotismo'))
update resumos set pai_id = (select id from novo)
 where pai_id in (select id from velhos);

with novo as (select id from resumos where slug = 'modelos-de-producao-industrial'),
     velhos as (select id from resumos where slug in ('taylorismo', 'fordismo', 'toyotismo'))
update edital_topicos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

with novo as (select id from resumos where slug = 'modelos-de-producao-industrial'),
     velhos as (select id from resumos where slug in ('taylorismo', 'fordismo', 'toyotismo'))
update eventos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Histórico e favorito do aluno: uma linha por aluno no resumo novo, com a
-- visita mais recente e a estrela se ele tinha estrela em qualquer dos três.
insert into leituras (user_id, resumo_id, visto_em, favorito, favoritado_em)
select l.user_id,
       (select id from resumos where slug = 'modelos-de-producao-industrial'),
       max(l.visto_em), bool_or(l.favorito), max(l.favoritado_em)
  from leituras l
  join resumos r on r.id = l.resumo_id
 where r.slug in ('taylorismo', 'fordismo', 'toyotismo')
 group by l.user_id
on conflict (user_id, resumo_id) do update
   set visto_em = greatest(leituras.visto_em, excluded.visto_em),
       favorito = leituras.favorito or excluded.favorito,
       favoritado_em = coalesce(leituras.favoritado_em, excluded.favoritado_em);

-- Wikilinks no corpo de outros resumos. O trigger `sync_conexoes_resumo`
-- refaz as conexões desses resumos no próprio update.
update resumos
   set corpo = regexp_replace(corpo, '\[\[(Taylorismo|Fordismo|Toyotismo)\]\]',
                              '[[Modelos de produção industrial]]', 'g')
 where corpo ~ '\[\[(Taylorismo|Fordismo|Toyotismo)\]\]'
   and slug not in ('taylorismo', 'fordismo', 'toyotismo');

-- 4. Só então apagar os três. `conexoes` e `leituras` restantes saem em cascata.
delete from resumos where slug in ('taylorismo', 'fordismo', 'toyotismo');

-- 5. Refaz as conexões do resumo novo com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'modelos-de-producao-industrial';

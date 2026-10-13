-- Ligações químicas: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Junta dois resumos em um.** `ligacao-ionica` (418 caracteres) e
-- `ligacao-molecular-covalente` (1.091) existiam como fragmentos soltos, sem
-- pai e sem edital, e a ligação metálica não tinha resumo. Decisão do autor
-- (12/10/2026): apagar os dois e reuni-los aqui, cada ligação como seção
-- (grafo `h2`), seguindo o precedente de 20261012184837_rascunho_modelos_de_producao_industrial.
--
-- ## Por que este tópico
--
-- Conferido no banco em 12/10/2026: os tópicos 10 e 11 de química da 1ª etapa
-- do PAS-UEM sem resumo; slug `ligacoes-quimicas` livre. Processo `comum`
-- (decisão 1c): o assunto está no PAS-UEM e no PASSE (1ª etapa, tópicos 7–9).
--
-- ## Fontes, e só elas
--
-- 1. Caderno:
--    - `Resumos vestibulares/Resumo para PAS UEM 1°etapa.docx`, `QUÍMICA`,
--      §00608–00619 (ligação iônica e covalente, fórmulas de Lewis e
--      estrutural). Mesmo texto em `Materias e conteúdos feitos/Quimica.docx`
--      §00040–00051 e em `Resumos 2025/Resumos 3º bimestre/Resumo para PR1G2.docx`
--      §00100–00108.
--    - `Resumos 2025/Resumos 3º bimestre/Resumo para Simulado Poliedro.docx`,
--      `QUÍMICA B`, §00194–00216 (covalente coordenada, ligação metálica,
--      propriedades dos metais e três figuras).
--    - `Resumos 2025/Resumos 2º bimestre/Resumo para PR2G2.docx`, `QUÍMICA B`,
--      §00090–00094 (Regra do Octeto; iônica com diferença maior que 1,7).
--    - `Resumos 2025/Resumos 2º bimestre/Resumo para SH_ 2º dia.docx`,
--      `QUÍMICA B` (seção assinada por Alice, não pelo autor), §00196–00207:
--      só os trechos que não divergem do caderno do autor (ver abaixo).
-- 2. Edital: PAS-UEM 1ª etapa, química, tópicos 10 e 11.
-- 3. Provas (Documents/UEM-Provas/pdfs/):
--    - PAS-UEM 2018, 1ª etapa, questão 19 (gabarito 30), pas18/E1G1.pdf, p. 10:
--      a questão;
--    - PAS-UEM 2021, 1ª etapa, questão 15 (gabarito 10), pas21/E1.pdf, p. 7:
--      pegadinhas dos itens 04 e 16;
--    - PAS-UEM 2022, 1ª etapa, questão 21 (gabarito 25), pas22/E1.pdf, p. 8:
--      pegadinha do item 02;
--    - PAS-UEM 2022, 1ª etapa, questão 22 (gabarito 01), pas22/E1.pdf, p. 8:
--      pegadinha do item 04 e a definição de liga metálica do enunciado;
--    - PAS-UEM 2025, 1ª etapa, questão 38 (gabarito 25), pas25/E1.pdf, p. 18:
--      pegadinha do item 02.
--
-- ## O que difere do caderno
--
-- Decisões do autor em 12/10/2026, sobre o SH (§00197–00198):
-- 1. "H^{-2}" corrigido: o íon do hidrogênio com metal é H⁻.
-- 2. No critério de 1,7, só Na–Cl como exemplo (Δ = 3,16 − 0,93 = 2,23). O
--    SH dava também Na–H, que pelo próprio critério daria 1,27. "Entre um
--    metal e o hidrogênio" segue como está no caderno do autor.
-- 3. Retirado o item "compostos diretamente iônicos … supera 2,0: famílias
--    1A e 2A ligados a 6A ou 7A" (Mg–S 1,27; Ca–S 1,58; Li–I 1,68; Be–O 1,87).
--
-- Acréscimos além do caderno do autor, com a fonte:
-- - SH: transferência do par de elétrons para o átomo mais eletronegativo;
--   retículos cristalinos; a força eletrostática como fundamento do ponto de
--   fusão; fusão e dissolução que destroem o retículo; covalente com
--   diferença menor que 1,7 e deslocamento parcial do par; na coordenada, o
--   receptor que geralmente é o oxigênio e os pares não ligantes do átomo
--   central.
-- - Exemplo resolvido Na–Cl montado com os números do SH (ilustração de uma
--   definição já dada).
-- - Definição de liga metálica: enunciado de PAS-UEM 2022, 1ª etapa, Q22.
-- - Item (16) da resolução: conservação da quantidade de movimento (Física).
-- - Tabela comparativa montada só com itens das fontes.
--
-- ## Edital
--
-- Ligados: PAS-UEM 1ª etapa, química, 10 "Ligações Químicas." e 11 "Ligações
-- iônicas, covalentes e metálicas e as diferentes organizações das
-- partículas.". Fora, cobertos pela metade: 12 (faltam substâncias orgânicas
-- e inorgânicas), 14 (faltam propriedades dos moleculares e o cotidiano),
-- PASSE 1ª etapa 7–9 (não reservados a este rascunho).
--
-- ## Referências aos dois resumos apagados (levantadas em 12/10/2026)
--
-- 0 filhos, 0 tópicos de edital, 0 eventos, 0 leituras, 0 grifos, 0
-- respostas; 1 conexão: `eletrolise` → `ligacao-ionica`, pelo wikilink
-- `[[Ligação iônica]]`, trocado abaixo. Mesmo assim, cada passo redireciona o
-- que existir quando a migration rodar, e ela aborta se houver grifo ou
-- resposta.

-- 1. O resumo novo.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'ligacoes-quimicas',
  'Ligações químicas',
  'quimica',
  'comum',
  'Ligações iônica, covalente e metálica: como os átomos se unem pela regra do octeto e as propriedades que cada ligação dá às substâncias.',
  '<p>união entre átomos, que tendem a combinar-se de modo a ter, cada um, 8 elétrons na camada de valência;</p>
<ul><li><p><strong>Ligação iônica:</strong> entre átomos com grande diferença de eletronegatividade, com formação de cátions e ânions;</p></li>
<li><p><strong>Ligação molecular (covalente):</strong> compartilhamento de pares de elétrons entre ametais;</p></li>
<li><p><strong>Ligação metálica:</strong> entre metais, com um “mar de elétrons livres”;</p></li>
<li><p><strong>Obs:</strong> eletronegatividade e caráter metálico em [[Tabela Periódica]].</p></li></ul>
<h2 data-corrido="sim">Regra do Octeto:</h2>
<p>os átomos tendem a combinar-se de modo a ter, cada um, 8 elétrons na sua camada de valência, ficando com a mesma configuração eletrônica de um gás nobre;</p>
<ul><li><p><strong>Obs:</strong> na ligação covalente, as exceções são o hidrogênio, o berílio e o boro.</p></li></ul>
<h2 data-corrido="sim">Ligação iônica (eletrovalente):</h2>
<p>tipo de ligação química que ocorre entre átomos com grande diferença de eletronegatividade, geralmente entre um metal e um não-metal, ou entre um metal e o hidrogênio;</p>
<ul><li><p>Ligação caracterizada pela interação entre um cátion e um ânion;</p>
<ul><li><p>Com o metal, o hidrogênio forma o ânion <span data-type="inline-math" data-latex="\ce{H-}"></span>;</p></li></ul></li>
<li><p><strong>Fundamento:</strong> o par de elétrons que origina a ligação transfere-se inteiramente para o átomo mais eletronegativo, originando íons (cátions e ânions);</p></li>
<li><p><strong>Critério:</strong> diferença de eletronegatividade maior que 1,7: ligação predominantemente iônica;</p></li>
<li><p>Os íons tendem a se agrupar em estruturas denominadas <strong>retículos cristalinos</strong>.</p></li></ul>
<h3 data-corrido="sim">Exemplo resolvido:</h3>
<p>ligação entre sódio e cloro, com as eletronegatividades de Linus Pauling;</p>
<ol><li><p>Eletronegatividades: Na = 0,93 e Cl = 3,16;</p></li>
<li><p>Diferença: <span data-type="inline-math" data-latex="3{,}16-0{,}93=2{,}23"></span>;</p></li>
<li><p>Comparação com o critério: 2,23 &gt; 1,7, então a ligação é predominantemente iônica;</p></li>
<li><p>Íons formados: <span data-type="inline-math" data-latex="\ce{Na+}"></span> e <span data-type="inline-math" data-latex="\ce{Cl-}"></span>.</p></li></ol>
<h3 data-corrido="sim">Propriedades dos compostos iônicos:</h3>
<p>decorrem da estrutura cristalina;</p>
<ul><li><p>Elevados pontos de fusão (&gt;600 °C) e pontos de ebulição;</p>
<ul><li><p><strong>Fundamento:</strong> a forte atração elétrica entre os íons (força eletrostática) agrega esses íons em uma estrutura cristalina;</p></li></ul></li>
<li><p>Estrutura sólida e cristalina que não permite condução de elétrons, sendo condutores somente fundidos ou dissolvidos em água (substância polar);</p>
<ul><li><p><strong>Fundamento:</strong> a fusão e a dissolução em água destroem o retículo cristalino;</p></li>
<li><p><strong>Obs:</strong> composto iônico fundido em [[Eletrólise]].</p></li></ul></li></ul>
<h2 data-corrido="sim">Ligação molecular (covalente):</h2>
<p>ocorre por compartilhamento de pares de elétrons entre ametais;</p>
<ul><li><p><strong>Fundamento:</strong> com diferença de eletronegatividade menor que 1,7 (geralmente entre dois ametais), não há transferência de elétrons nem formação de íons;</p>
<ul><li><p>Ocorre um deslocamento parcial do par de elétrons envolvido na ligação;</p></li></ul></li>
<li><p>Os pares de elétrons compartilhados promovem o octeto dos átomos envolvidos, com exceção do hidrogênio, do berílio e do boro;</p></li>
<li><p>Moléculas com mais que dois átomos apresentam um átomo central no qual se identificam os <strong>pares ligantes</strong> e os <strong>pares não-ligantes</strong>;</p></li>
<li><p><strong>Fórmula de Lewis:</strong></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/formula-de-lewis.webp" alt="Fórmula de Lewis do gás carbônico, com os pares de elétrons entre o carbono e cada oxigênio." style="width:106px" data-largura="106px"></figure></li>
<li><p><strong>Fórmula estrutural:</strong></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/formula-estrutural.webp" alt="Fórmula estrutural do metano: o carbono no centro, ligado a quatro hidrogênios por traços." style="width:254px" data-largura="254px"></figure></li>
<li><p><strong>Obs:</strong> a forma da molécula em [[Geometria das moléculas]], e a polaridade em [[Polaridade das moléculas]].</p></li></ul>
<h3 data-corrido="sim">Ligação covalente coordenada:</h3>
<p>átomos de oxigênio fazem uso dos pares livres no átomo central;</p>
<ul><li><p>Um átomo recebe o par eletrônico de outro que já atingiu o octeto; geralmente, o átomo receptor é o oxigênio;</p></li>
<li><p>Só ocorre se já se esgotaram as possibilidades de ligações covalentes normais;</p></li>
<li><p>É feita a partir dos pares não ligantes do átomo central e de modo a garantir uma simetria espacial na disposição dos átomos.</p></li></ul>
<h2 data-corrido="sim">Ligação metálica:</h2>
<p>ocorre entre metais;</p>
<ul><li><p><strong>Fundamento:</strong> os átomos metálicos possuem poucos elétrons na camada de valência (1 a 3) e baixa eletronegatividade, o que facilita a perda desses elétrons;</p></li>
<li><p>Esses elétrons são liberados e formam um “<strong>mar de elétrons livres</strong>”, que se deslocam entre os cátions metálicos.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/ligacao-metalica-mar-de-eletrons.webp" alt="Modelo do mar de elétrons: camadas de íons metálicos positivos com elétrons livres entre eles." style="width:100%" data-largura="100%"></figure>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/reticulos-cristalinos-cubicos.webp" alt="Células unitárias de retículos cristalinos: cúbica simples, cúbica de corpo centrado e cúbica de face centrada, cada esfera representando um núcleo iônico." style="width:70%" data-largura="70%"></figure>
<h3 data-corrido="sim">Propriedades dos metais:</h3>
<p>decorrem da ligação metálica;</p>
<ul><li><p><strong>Condutividade elétrica:</strong> os elétrons livres se movimentam facilmente;</p></li>
<li><p><strong>Condutividade térmica:</strong> a movimentação dos elétrons transfere calor rapidamente;</p></li>
<li><p><strong>Maleabilidade:</strong> o metal pode ser moldado em chapas;</p></li>
<li><p><strong>Ductilidade:</strong> pode ser esticado em fios;</p></li>
<li><p><strong>Brilho metálico:</strong> os elétrons refletem a luz;</p></li>
<li><p>Sólidos à temperatura ambiente (exceto o mercúrio).</p></li></ul>
<h3 data-corrido="sim">Ligas metálicas:</h3>
<p>materiais que contêm dois ou mais elementos químicos, sendo pelo menos um deles um metal;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/ligas-metalicas-comerciais.webp" alt="Tabela com a composição de ligas comerciais e suas aplicações: ouro branco, amálgama, solda, duralumínio, latão, aço, aço inox, bronze e ferro-gusa." style="width:100%" data-largura="100%"></figure>
<h2>Comparação entre as ligações</h2>
<table><tbody><tr><th><p></p></th><th><p><strong>Iônica</strong></p></th><th><p><strong>Covalente</strong></p></th><th><p><strong>Metálica</strong></p></th></tr>
<tr><td><p>Entre</p></td><td><p>Metal e não-metal, ou metal e hidrogênio</p></td><td><p>Ametais</p></td><td><p>Metais</p></td></tr>
<tr><td><p>Diferença de eletronegatividade</p></td><td><p>Maior que 1,7</p></td><td><p>Menor que 1,7</p></td><td><p>—</p></td></tr>
<tr><td><p>Elétrons</p></td><td><p>Transferência para o átomo mais eletronegativo</p></td><td><p>Compartilhamento de pares</p></td><td><p>Mar de elétrons livres</p></td></tr>
<tr><td><p>Partículas</p></td><td><p>Cátions e ânions em retículo cristalino</p></td><td><p>Moléculas</p></td><td><p>Cátions metálicos e elétrons livres</p></td></tr>
<tr><td><p>Condução elétrica</p></td><td><p>Só fundidos ou dissolvidos em água</p></td><td><p>—</p></td><td><p>Sim (elétrons livres)</p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>O hidreto de fósforo (<span data-type="inline-math" data-latex="\ce{PH3}"></span>) não é composto iônico (PAS-UEM 2021, 1ª etapa);</p></li>
<li><p>No sulfeto de cálcio (<span data-type="inline-math" data-latex="\ce{CaS}"></span>), o cálcio não está na forma de cátion monovalente (PAS-UEM 2021, 1ª etapa);</p></li>
<li><p><span data-type="inline-math" data-latex="\ce{OF2}"></span> não é óxido iônico: oxigênio e flúor são ametais (PAS-UEM 2022, 1ª etapa);</p></li>
<li><p>No aço, o carbono não forma ligação metálica com o ferro: a ligação metálica ocorre entre metais (PAS-UEM 2022, 1ª etapa);</p></li>
<li><p>Em <span data-type="inline-math" data-latex="\ce{Ca(OH)2 -> CaO + H2O}"></span>, os três compostos não são todos iônicos: a água é molecular (PAS-UEM 2025, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="21d0dd0d-d623-4b31-af39-032ea7628445" data-gabarito="30"><p>(PAS-UEM 2018, 1ª etapa) Sobre o modelo de mar de elétrons, assinale o que for correto.</p><p>(01) Esse modelo estabelece que um metal sólido é formado por uma rede regular de íons metálicos que compartilham elétrons para satisfazer a regra do octeto.</p><p>(02) A formação do mar de elétrons é responsável por manter átomos metálicos unidos.</p><p>(04) O mar de elétrons é formado por elétrons da última camada eletrônica, os quais se desprendem de elementos metálicos devido à fraca atração exercida pelo núcleo.</p><p>(08) O movimento do mar de elétrons é responsável pela alta condutividade elétrica em metais.</p><p>(16) Quando isolado do resto do universo, o movimento do mar de elétrons deve ocorrer de modo a conservar a quantidade de movimento do sistema.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. Os elétrons da camada de valência são liberados e formam um mar de elétrons livres que se deslocam entre os cátions metálicos; não há compartilhamento de pares para satisfazer a regra do octeto;</p><p>(02) Correta. É o mar de elétrons livres, entre os cátions metálicos, que caracteriza a ligação metálica;</p><p>(04) Correta. Os átomos metálicos possuem poucos elétrons na camada de valência e baixa eletronegatividade, o que facilita a perda desses elétrons;</p><p>(08) Correta. Condutividade elétrica: os elétrons livres se movimentam facilmente;</p><p>(16) Correta. Num sistema isolado, a quantidade de movimento total se conserva, o que vale também para o movimento do mar de elétrons;</p><p><strong>Soma: 02 + 04 + 08 + 16 = 30</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Regra do Octeto:</h3>
<p>8 elétrons na camada de valência, com a configuração eletrônica de um gás nobre;</p>
<h3 data-corrido="sim">Ligação iônica:</h3>
<p>diferença de eletronegatividade maior que 1,7; metal e não-metal, ou metal e hidrogênio;</p>
<h3 data-corrido="sim">Retículo cristalino:</h3>
<p>estrutura em que os íons de um composto iônico se agrupam;</p>
<h3 data-corrido="sim">Condução dos compostos iônicos:</h3>
<p>só quando fundidos ou dissolvidos em água, que destroem o retículo cristalino;</p>
<h3 data-corrido="sim">Ligação molecular (covalente):</h3>
<p>compartilhamento de pares de elétrons entre ametais;</p>
<h3 data-corrido="sim">Exceções ao octeto:</h3>
<p>hidrogênio, berílio e boro;</p>
<h3 data-corrido="sim">Ligação covalente coordenada:</h3>
<p>usa os pares livres do átomo central, só depois de esgotadas as ligações covalentes normais;</p>
<h3 data-corrido="sim">Mar de elétrons livres:</h3>
<p>elétrons de valência dos metais que se deslocam entre os cátions metálicos.</p>'
)
on conflict (slug) do nothing;

-- 2. Trava: grifo ou resposta nos antigos não tem destino.
do $$
begin
  if exists (select 1 from grifos g join resumos r on r.id = g.resumo_id
              where r.slug in ('ligacao-ionica', 'ligacao-molecular-covalente'))
     or exists (select 1 from respostas x join resumos r on r.id = x.resumo_id
                 where r.slug in ('ligacao-ionica', 'ligacao-molecular-covalente')) then
    raise exception 'grifos ou respostas em ligacao-ionica/ligacao-molecular-covalente: decidir antes de apagar';
  end if;
end $$;

-- 3. Redirecionar cada referência para o resumo novo.
with novo as (select id from resumos where slug = 'ligacoes-quimicas'),
     velhos as (select id from resumos where slug in ('ligacao-ionica', 'ligacao-molecular-covalente'))
update resumos set pai_id = (select id from novo)
 where pai_id in (select id from velhos);

with novo as (select id from resumos where slug = 'ligacoes-quimicas'),
     velhos as (select id from resumos where slug in ('ligacao-ionica', 'ligacao-molecular-covalente'))
update edital_topicos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

with novo as (select id from resumos where slug = 'ligacoes-quimicas'),
     velhos as (select id from resumos where slug in ('ligacao-ionica', 'ligacao-molecular-covalente'))
update eventos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Histórico e favorito do aluno: uma linha por aluno no resumo novo, com a
-- visita mais recente e a estrela se ele tinha estrela em qualquer dos dois.
insert into leituras (user_id, resumo_id, visto_em, favorito, favoritado_em)
select l.user_id,
       (select id from resumos where slug = 'ligacoes-quimicas'),
       max(l.visto_em), bool_or(l.favorito), max(l.favoritado_em)
  from leituras l
  join resumos r on r.id = l.resumo_id
 where r.slug in ('ligacao-ionica', 'ligacao-molecular-covalente')
 group by l.user_id
on conflict (user_id, resumo_id) do update
   set visto_em = greatest(leituras.visto_em, excluded.visto_em),
       favorito = leituras.favorito or excluded.favorito,
       favoritado_em = coalesce(leituras.favoritado_em, excluded.favoritado_em);

-- Wikilinks no corpo de outros resumos (hoje, só `eletrolise`). O trigger
-- `sync_conexoes_resumo` refaz as conexões desses resumos no próprio update.
update resumos
   set corpo = regexp_replace(corpo, '\[\[(Ligação iônica|Ligação molecular \(covalente\))\]\]',
                              '[[Ligações químicas]]', 'g')
 where corpo ~ '\[\[(Ligação iônica|Ligação molecular \(covalente\))\]\]'
   and slug not in ('ligacao-ionica', 'ligacao-molecular-covalente');

-- 4. Só então apagar os dois. `conexoes` e `leituras` restantes saem em cascata.
delete from resumos where slug in ('ligacao-ionica', 'ligacao-molecular-covalente');

-- 5. Ligar o edital: só os tópicos cobertos por inteiro.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.materia_slug = 'quimica'
   and e.texto in ('Ligações Químicas.',
                   'Ligações iônicas, covalentes e metálicas e as diferentes organizações das partículas.')
   and e.resumo_id is null
   and r.slug = 'ligacoes-quimicas';

-- 6. Refaz as conexões do resumo novo com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'ligacoes-quimicas';

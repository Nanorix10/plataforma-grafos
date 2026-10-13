-- Célula: membrana, citoplasma, organelas e núcleo: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Junta treze resumos em um.** Membrana plasmática, Citoplasma, Citosol,
-- Citoesqueleto, Mitocôndria, Complexo Golgiense, Lisossomo, Centríolo,
-- Ribossomos, Retículo Endoplasmático Rugoso, Retículo Endoplasmático Liso,
-- Cloroplasto e Vacúolo existiam como resumos soltos (108 a 1.197
-- caracteres, sem pai), cópia literal do caderno. Decisão do autor
-- (13/10/2026): apagar os treze e reuni-los aqui, com a seção Núcleo, que não
-- tinha resumo. Transporte através da membrana continua resumo próprio e
-- passa a filho deste (pai_id); as figuras da célula animal e da célula
-- vegetal saem dele e vão para a abertura deste.
--
-- ## Por que este tópico
--
-- Conferido no banco em 12/10/2026: o PAS-UEM 1ª etapa nº 9 ("Componentes
-- celulares (membrana, citoplasma, núcleo) – estrutura e função.") estava sem
-- resumo, e nenhum fragmento o cobria inteiro (nenhum tratava do núcleo).
-- Processo `comum`, como os fragmentos.
--
-- ## Fontes, e só elas
--
-- 1. Caderno: `Materias e conteúdos feitos/Biologia.docx`, §00001–00010 e
--    §00028–00085 do extrator (membrana, citoplasma, organelas; figuras
--    image30, image64, image27 e image7). Cópias: `Resumos 2025/Resumos 2º
--    bimestre/Resumo para PR1G3.docx` e `Resumo para PR2G3.docx` (BIOLOGIA
--    A, que abre com as figuras da célula animal e vegetal). Núcleo:
--    `Resumos 2025/Resumos 3º bimestre/Resumo para Simulado Poliedro.docx`,
--    BIOLOGIA A, §00251–00264 (figura image10). Parede celular das
--    bactérias: `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para
--    PR2G4.docx`, §00134.
-- 2. Edital: PAS-UEM 1ª etapa nº 9.
-- 3. Provas: PAS-UEM 2018, etapa 1, questão 10 (gabarito 08),
--    `Documents/UEM-Provas/pdfs/pas18/E1G1.pdf`, p. 8: a questão.
--    Pegadinhas: PAS-UEM 2016, etapa 1, questão 14 (gabarito 13, item 16),
--    `pdfs/pas16/E1G1.pdf`, p. 8; PAS-UEM 2021, etapa 1, questão 10
--    (gabarito 02, item 01), `pdfs/pas21/E1.pdf`, p. 7; PAS-UEM 2022, etapa
--    1, questão 10 (gabarito 26, item 08), `pdfs/pas22/E1.pdf`, p. 7.
--
-- ## Correções de conteúdo, aprovadas pelo autor em 13/10/2026
--
-- a. Poliedro §00261 "Cromatina: DNA condensado" → "material genético (DNA)
--    do núcleo, descondensado" (o §00264 do próprio caderno, o resumo Ciclo
--    celular e a PAS-UEM 2022 E1 Q10 item 08).
-- b. Poliedro §00259 "Nucléolo: composto de DNA ribossômico" → a composição
--    sai; fica "produção de ribossomos".
-- c. Biologia.docx §00044 microfilamentos "Proteínas: actina e miosina" →
--    "Proteína: actina; a miosina atua associada a ela".
-- d. Biologia.docx §00001 membrana "organela celular" → "estrutura celular".
-- e. Biologia.docx §00072–00073 ribossomos "Produzidas no nucléolo; Aderidos
--    ao retículo…" → "em eucariontes, produzidos no nucléolo; podem estar
--    aderidos ao retículo endoplasmático rugoso".
--
-- ## Edital
--
-- Ligado: PAS-UEM 1ª etapa nº 9 (coberto inteiro).
-- Fora: PAS-UEM 1ª etapa nº 6 ("Biologia celular."), amplo demais (teoria
-- celular, procariontes × eucariontes); nº 12 ("Cariótipo humano."), que
-- fica para os cromossomos do Poliedro, §00264 em diante.
--
-- ## Referências aos treze resumos apagados (levantadas em 12/10/2026)
--
-- FKs para `resumos`: resumos.pai_id, conexoes.origem_id/destino_id,
-- eventos.resumo_id, edital_topicos.resumo_id, leituras.resumo_id,
-- grifos.resumo_id, respostas.resumo_id. Na data: 0 filhos, 2 conexões
-- (macromoleculas → membrana-plasmatica e virus → membrana-plasmatica, ambas
-- por `[[Membrana plasmática]]`), 0 eventos, 0 tópicos de edital, 0 grifos,
-- 0 respostas; 3 leituras (membrana, lisossomo, complexo golgiense). Cada
-- passo redireciona o que existir na hora, e a migration aborta se houver
-- grifo ou resposta.

-- 1. O resumo novo.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'celula',
  'Célula: membrana, citoplasma, organelas e núcleo',
  'biologia',
  'comum',
  'Membrana plasmática, citoplasma (citosol, citoesqueleto e organelas) e núcleo: estrutura e função de cada componente da célula.',
  '<p>componentes da célula, cada um com estrutura e função próprias;</p>
<ul><li><p><strong>Membrana plasmática:</strong> estrutura celular que separa o meio extracelular do meio intracelular;</p></li>
<li><p><strong>Citoplasma:</strong> espaço delimitado pela membrana plasmática, com o citosol, o citoesqueleto e as organelas;</p></li>
<li><p><strong>Núcleo:</strong> estrutura presente em células eucarióticas, que abriga o material genético (DNA).</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/celula-animal.webp" alt="Esquema da célula animal com as organelas anotadas e o destaque para as exclusivas dela: centríolos, que formam as fibras do fuso e os cílios e flagelos, e lisossomos, da digestão celular." style="width:100%" data-largura="100%"></figure>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/celula-vegetal.webp" alt="Esquema da célula vegetal com as organelas anotadas e o destaque para as exclusivas dela: vacúolo, de armazenamento e osmorregulação, e plastos como o cloroplasto, além da parede celular e do plasmodesmo." style="width:100%" data-largura="100%"></figure>
<h2 data-corrido="sim">Membrana plasmática:</h2>
<p>estrutura celular que separa o meio extracelular do meio intracelular; dá suporte e proteção ao conteúdo celular;</p>
<ul><li><p><strong>Permeabilidade:</strong> seletiva (semipermeável);</p></li>
<li><p><strong>Modelo:</strong> representa-se segundo o <strong>modelo mosaico fluido</strong>, proposto por Singer e Nicolson.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/membrana-mosaico-fluido.webp" alt="Corte da membrana no modelo mosaico fluido, com a bicamada fosfolipídica ao centro e, encaixados nela, colesterol, proteína periférica, proteína transmembranar, proteína de canal com poro, glicolipídio e glicoproteínas com carboidratos voltados para o fluido extracelular." style="width:100%" data-largura="100%"></figure>
<ul><li><p><strong>Composto por:</strong></p>
<ul><li><p><strong>Bicamada fosfolipídica:</strong> duas camadas de fosfolipídeos ([[Macromoléculas]]);</p></li>
<li><p><strong>Proteínas:</strong> canais ou carreadoras;</p></li>
<li><p><strong>Glicocálice ou glicoproteínas:</strong> estruturas compostas por carboidratos ligados às proteínas e aos lipídeos da membrana;</p>
<ul><li><p><strong>Função:</strong> reconhecem substâncias e outras células; retêm nutrientes e enzimas;</p></li>
<li><p><strong>Ocorrência:</strong> somente em células animais e protistas;</p></li></ul></li></ul></li>
<li><p><strong>Obs:</strong> a passagem de substâncias pela membrana está em [[Transporte através da membrana]].</p></li></ul>
<h2 data-corrido="sim">Citoplasma:</h2>
<p>espaço delimitado pela membrana plasmática;</p>
<ul><li><p><strong>Ocorrência:</strong> todas as células;</p></li>
<li><p><strong>Na célula eucarionte:</strong></p>
<ul><li><p>compreende a porção entre a membrana plasmática e o envoltório nuclear;</p></li>
<li><p>presença de núcleo;</p></li>
<li><p>diversas organelas membranosas.</p></li></ul></li></ul>
<h3 data-corrido="sim">Citosol:</h3>
<p>parte líquida do citoplasma;</p>
<ul><li><p><strong>Contém:</strong> vitaminas, sais, lipídeos e aminoácidos.</p></li></ul>
<h3 data-corrido="sim">Citoesqueleto:</h3>
<p>filamentos de proteína do citoplasma: microtúbulos, microfilamentos e filamentos intermediários;</p>
<ul><li><p><strong>Função:</strong> formação da estrutura celular, movimentação celular e sustentação celular.</p></li></ul>
<h4 data-corrido="sim">Microtúbulos:</h4>
<p>filamentos de tubulina;</p>
<ul><li><p><strong>Função:</strong> formação de cílios e flagelos;</p></li>
<li><p><strong>Divisão celular:</strong> fibras do fuso mitótico ([[Ciclo celular]]).</p></li></ul>
<h4 data-corrido="sim">Microfilamentos:</h4>
<p>filamentos de actina;</p>
<ul><li><p><strong>Proteína:</strong> actina; a miosina atua associada a ela;</p></li>
<li><p><strong>Função:</strong> movimentos celulares (pseudópodes);</p></li>
<li><p><strong>Ciclose:</strong> movimento do citoplasma.</p></li></ul>
<h4 data-corrido="sim">Filamentos intermediários:</h4>
<p>filamentos de queratina;</p>
<ul><li><p><strong>Função:</strong> suporte estrutural e resistência mecânica à célula;</p></li>
<li><p>compõem cabelos e unhas.</p></li></ul>
<h2 data-corrido="sim">Organelas:</h2>
<p>estruturas do citoplasma, cada uma com função própria;</p>
<h3 data-corrido="sim">Mitocôndria:</h3>
<p>produz ATP, por respiração aeróbia ([[Metabolismo energético]]);</p>
<ul><li><p>presença de ribossomos;</p></li>
<li><p>autoduplicação.</p></li></ul>
<h3 data-corrido="sim">Complexo golgiense:</h3>
<p>produção de lisossomos, secreção molecular, modificação de substâncias e formação do acrossomo do espermatozoide ([[Gametas e fecundação]]);</p>
<ul><li><p><strong>Composto por:</strong> 4 a 20 bolsas (cisternas) achatadas e empilhadas;</p></li>
<li><p>apresenta duas faces: cis e trans.</p></li></ul>
<h3 data-corrido="sim">Lisossomo:</h3>
<p>digestão intracelular;</p>
<ul><li><p><strong>Autofagia:</strong> digestão de componentes celulares;</p></li>
<li><p><strong>Heterofagia:</strong> digestão de componentes extracelulares;</p></li>
<li><p><strong>Origem:</strong> formado a partir do complexo golgiense, com enzimas digestivas previamente sintetizadas no retículo endoplasmático rugoso.</p></li></ul>
<h3 data-corrido="sim">Centríolo:</h3>
<p>formação de cílios e flagelos;</p>
<ul><li><p><strong>Localização:</strong> centrossomo;</p></li>
<li><p><strong>Composto por:</strong> tubulina.</p></li></ul>
<h3 data-corrido="sim">Ribossomos:</h3>
<p>síntese de proteínas;</p>
<ul><li><p>visíveis apenas ao microscópio eletrônico;</p></li>
<li><p><strong>Ocorrência:</strong> todas as células;</p></li>
<li><p><strong>Composto por:</strong> duas subunidades;</p></li>
<li><p><strong>Origem:</strong> em eucariontes, produzidos no nucléolo;</p></li>
<li><p><strong>Localização:</strong> podem estar aderidos ao retículo endoplasmático rugoso (granuloso).</p></li></ul>
<h3 data-corrido="sim">Retículo endoplasmático rugoso:</h3>
<p>síntese de proteínas;</p>
<ul><li><p>presença de ribossomos;</p></li>
<li><p><strong>Função:</strong> transporte e armazenamento.</p></li></ul>
<h3 data-corrido="sim">Retículo endoplasmático liso:</h3>
<p>síntese de lipídeos, desintoxicação e armazenamento de <span data-type="inline-math" data-latex="\ce{Ca^2+}"></span>;</p>
<h3 data-corrido="sim">Cloroplasto:</h3>
<p>fotossíntese e produção de oxigênio;</p>
<ul><li><p><strong>Pigmento verde:</strong> clorofila.</p></li></ul>
<h3 data-corrido="sim">Vacúolo:</h3>
<p>armazenamento de substâncias e controle osmótico;</p>
<ul><li><p><strong>Pulsátil:</strong> regula a quantidade de água e elimina o excesso de água.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/organelas-da-celula.webp" alt="Célula ao centro com setas apontando para o desenho ampliado de cada organela: mitocôndria, sistema golgiense, lisossomos, centríolos, plasmalema, retículo endoplasmático liso e rugoso, ribossomos, núcleo com nucléolo e DNA." style="width:100%" data-largura="100%"></figure>
<h2 data-corrido="sim">Núcleo celular:</h2>
<p>estrutura presente em células eucarióticas, que abriga o material genético (DNA) e controla as atividades celulares;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/nucleo-celular.webp" alt="Núcleo em corte: o envoltório nuclear com poros e ribossomos na face externa, a lâmina nuclear logo abaixo, o nucleoplasma com a cromatina e, no interior, o nucléolo." style="width:70%" data-largura="70%"></figure>
<ul><li><p><strong>Carioteca:</strong> membrana dupla lipoproteica que reveste o núcleo;</p></li>
<li><p><strong>Poros:</strong> aberturas na carioteca;</p>
<ul><li><p><strong>Função:</strong> controlam a entrada e a saída de substâncias;</p></li></ul></li>
<li><p><strong>Nucleoplasma:</strong> substância que preenche o compartimento nuclear;</p>
<ul><li><p><strong>Composto por:</strong> água, sais, proteínas e material genético;</p></li></ul></li>
<li><p><strong>Nucléolo:</strong> produção de ribossomos;</p></li>
<li><p><strong>Cromatina:</strong> material genético (DNA) do núcleo, descondensado;</p>
<ul><li><p><strong>Heterocromatina:</strong> inativa;</p></li>
<li><p><strong>Eucromatina:</strong> ativa;</p></li>
<li><p><strong>Obs:</strong> os filamentos de cromatina se dobram e formam os cromossomos, DNA altamente compactado ([[Ciclo celular]]).</p></li></ul></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>o núcleo não está presente em todas as células: é estrutura das células eucarióticas (PAS-UEM 2021, 1ª etapa);</p></li>
<li><p>as enzimas do lisossomo são sintetizadas no retículo endoplasmático rugoso, e não no citosol (PAS-UEM 2016, 1ª etapa);</p></li>
<li><p>a cromatina é o material genético do núcleo tanto das células eucarióticas animais quanto das vegetais (PAS-UEM 2022, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="2006eed2-a9ca-464e-9024-911f937ed6b9" data-gabarito="08"><p>(PAS-UEM 2018, 1ª etapa) Sobre os tipos celulares, assinale o que for correto.</p><p>(01) Retículo endoplasmático, complexo de Golgi e lisossomos são organelas exclusivas das células eucarióticas animais.</p><p>(02) Ribossomos são estruturas exclusivas das células procarióticas.</p><p>(04) Mitocôndrias são organelas exclusivas das células eucarióticas animais.</p><p>(08) Cloroplastos são organelas exclusivas das células eucarióticas vegetais.</p><p>(16) Paredes celulares são estruturas exclusivas das células eucarióticas vegetais.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. A célula vegetal também tem retículo endoplasmático e complexo golgiense;</p><p>(02) Incorreta. Os ribossomos estão presentes em todas as células;</p><p>(04) Incorreta. A célula vegetal também tem mitocôndrias;</p><p>(08) Correta. Os plastos, como o cloroplasto, são organelas exclusivas da célula vegetal;</p><p>(16) Incorreta. A parede celular também ocorre nas [[Bacterias]], que são procarióticas;</p><p><strong>Soma: 08</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Modelo mosaico fluido:</h3>
<p>representação da membrana plasmática proposta por Singer e Nicolson;</p>
<h3 data-corrido="sim">Glicocálice:</h3>
<p>carboidratos ligados às proteínas e aos lipídeos da membrana, que reconhecem substâncias e outras células;</p>
<h3 data-corrido="sim">Citosol:</h3>
<p>parte líquida do citoplasma;</p>
<h3 data-corrido="sim">Microtúbulos:</h3>
<p>filamentos de tubulina, que formam cílios, flagelos e as fibras do fuso mitótico;</p>
<h3 data-corrido="sim">Lisossomo:</h3>
<p>digestão intracelular; formado pelo complexo golgiense, com enzimas sintetizadas no retículo endoplasmático rugoso;</p>
<h3 data-corrido="sim">Retículo endoplasmático liso:</h3>
<p>síntese de lipídeos, desintoxicação e armazenamento de cálcio;</p>
<h3 data-corrido="sim">Carioteca:</h3>
<p>membrana dupla lipoproteica que reveste o núcleo;</p>
<h3 data-corrido="sim">Cromatina:</h3>
<p>material genético (DNA) do núcleo, descondensado: heterocromatina inativa e eucromatina ativa.</p>'
)
on conflict (slug) do nothing;

-- 2. Trava: grifo ou resposta nos antigos não tem destino.
do $$
begin
  if exists (select 1 from grifos g join resumos r on r.id = g.resumo_id
              where r.slug in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo'))
     or exists (select 1 from respostas x join resumos r on r.id = x.resumo_id
                 where r.slug in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo')) then
    raise exception 'grifos ou respostas nos fragmentos de célula: decidir antes de apagar';
  end if;
end $$;

-- 3. Redirecionar cada referência para o resumo novo.
with novo as (select id from resumos where slug = 'celula'),
     velhos as (select id from resumos where slug in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo'))
update resumos set pai_id = (select id from novo)
 where pai_id in (select id from velhos);

with novo as (select id from resumos where slug = 'celula'),
     velhos as (select id from resumos where slug in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo'))
update edital_topicos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

with novo as (select id from resumos where slug = 'celula'),
     velhos as (select id from resumos where slug in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo'))
update eventos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Histórico e favorito do aluno: uma linha por aluno no resumo novo, com a
-- visita mais recente e a estrela se ele tinha estrela em qualquer dos treze.
insert into leituras (user_id, resumo_id, visto_em, favorito, favoritado_em)
select l.user_id,
       (select id from resumos where slug = 'celula'),
       max(l.visto_em), bool_or(l.favorito), max(l.favoritado_em)
  from leituras l
  join resumos r on r.id = l.resumo_id
 where r.slug in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo')
 group by l.user_id
on conflict (user_id, resumo_id) do update
   set visto_em = greatest(leituras.visto_em, excluded.visto_em),
       favorito = leituras.favorito or excluded.favorito,
       favoritado_em = coalesce(leituras.favoritado_em, excluded.favoritado_em);

-- Wikilinks no corpo de outros resumos. O trigger `sync_conexoes_resumo`
-- refaz as conexões desses resumos no próprio update.
update resumos
   set corpo = regexp_replace(corpo, '\[\[(Membrana plasmática|Citoplasma|Citosol|Citoesqueleto|Mitocôndria|Complexo Golgiense|Lisossomo|Centríolo|Ribossomos|Retículo Endoplasmático Rugoso|Retículo Endoplasmático Liso|Cloroplasto|Vacúolo)\]\]',
                              '[[Célula: membrana, citoplasma, organelas e núcleo]]', 'g')
 where corpo ~ '\[\[(Membrana plasmática|Citoplasma|Citosol|Citoesqueleto|Mitocôndria|Complexo Golgiense|Lisossomo|Centríolo|Ribossomos|Retículo Endoplasmático Rugoso|Retículo Endoplasmático Liso|Cloroplasto|Vacúolo)\]\]'
   and slug not in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo');

-- 4. Só então apagar os treze. `conexoes` e `leituras` restantes saem em cascata.
delete from resumos where slug in ('membrana-plasmatica', 'citoplasma', 'citosol', 'citoesqueleto', 'mitocondria',
                     'complexo-golgiense', 'lisossomo', 'centriolo', 'ribossomos', 'reticulo-endoplasmatico-rugoso',
                     'reticulo-endoplasmatico-liso', 'cloroplasto', 'vacuolo');

-- 5. Transporte através da membrana vira filho; as figuras da célula animal e
-- da célula vegetal passaram para a abertura do pai (a das hemácias fica).
update resumos
   set pai_id = (select id from resumos where slug = 'celula'),
       corpo = regexp_replace(corpo,
         '<figure[^>]*><img src="/img/resumos/biologia/celula-(animal|vegetal)\.webp"[^>]*></figure>',
         '', 'g')
 where slug = 'transporte-atraves-da-membrana';

-- 6. Edital: o tópico que este resumo cobre inteiro.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.materia_slug = 'biologia'
   and e.texto = 'Componentes celulares (membrana, citoplasma, núcleo) – estrutura e função.'
   and e.resumo_id is null
   and r.slug = 'celula';

-- 7. Refaz as conexões do resumo novo com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'celula';

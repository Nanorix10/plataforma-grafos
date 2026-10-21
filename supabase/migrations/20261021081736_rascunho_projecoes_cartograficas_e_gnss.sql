-- Projeções cartográficas e GNSS: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Junta três resumos em um.** Superfícies das projeções cartográficas,
-- Projeções cartográficas clássicas e GNSS - (Global Positioning System)
-- existiam como resumos soltos (338 a 1.532 caracteres, sem pai), transcritos
-- da mesma seção do caderno. Decisão do autor (21/10/2026): apagar os três e
-- reuni-los aqui, cada bloco como seção (grafo `h2`).
--
-- ## Por que este tópico
--
-- Conferido no banco em 20/10/2026: os tópicos de cartografia do PAS-UEM
-- 1ª etapa (nº 4, 5 e 6) e do PASSE 1ª etapa (nº 6, 7 e 8) estão sem resumo,
-- e os três fragmentos não estavam ligados a nenhum. Processo `comum`
-- (decisão 1c).
--
-- ## Fontes, e só elas
--
-- 1. Caderno: `Resumos 2025/Resumos 2º bimestre/Resumo para PR1G1.docx`,
--    seção GEOGRAFIA, §00004–00036 do extrator. Cópia idêntica:
--    `Materias e conteúdos feitos/Geografia.docx`, §00001–00033.
-- 2. Edital: PAS-UEM 1ª etapa nº 4, 5 e 6; PASSE 1ª etapa nº 6, 7 e 8
--    (nenhum coberto inteiro; ver Edital).
-- 3. Provas: PAS-UEM 2024, etapa 1, questão 05 (gabarito 14), em
--    `Documents/UEM-Provas/pdfs/pas24/E1.pdf`, p. 6. Vestibular de Verão 2016,
--    Prova 3 – Geografia, questão 03 (gabarito 19), `pdfs/ve16/P3G1-GEO.pdf`,
--    p. 2. Vestibular de Inverno 2018, Prova 1, questão 37,
--    `pdfs/in18/P1G1.pdf`, p. 11: só o nome "Global Positioning System" do GPS.
--
-- ## Correções de conteúdo, aprovadas pelo autor em 21/10/2026
--
-- a. §00028 "GNSS - (Global Positioning System): sistema de localização
--    global" → título "GNSS", definido como "sistemas de posicionamento e
--    navegação por satélites" (Verão 2016, P3-GEO, q.03); "Global Positioning
--    System" passa para o item do GPS (Inverno 2018, P1, q.37).
-- b. §00032 "Bei Doun: China" sai: o nome do sistema é outro, e nenhuma fonte
--    traz a grafia certa.
-- c. §00026 Robinson "Criada em 1960" sai: a data não confere, e nenhuma
--    fonte traz outra.
-- d. §00031 "Galileu: Europa" fica como no caderno (aportuguesamento).
--
-- ## Edital
--
-- Nenhum tópico ligado. Pela metade: PAS-UEM 1ª nº 4 (falta orientação) e
-- nº 6 (só a primeira frase); PASSE 1ª nº 6 (faltam escala e sensoriamento).
-- Sem nada no caderno: PAS-UEM 1ª nº 5 (fusos), PASSE 1ª nº 7 (coordenadas)
-- e nº 8 (fusos).
--
-- ## Referências aos três resumos apagados (levantadas em 20/10/2026)
--
-- 0 filhos, 0 conexões, 0 eventos, 0 tópicos de edital, 0 leituras,
-- 0 grifos, 0 respostas, 0 wikilinks de entrada. Os passos de
-- redirecionamento ficam mesmo assim, para o que existir na hora, e a
-- migration aborta se houver grifo ou resposta.

-- 1. O resumo novo.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'projecoes-cartograficas-e-gnss',
  'Projeções cartográficas e GNSS',
  'geografia',
  'comum',
  'Superfícies cilíndrica, cônica e azimutal; projeções de Mercator, Peters e Robinson; e os sistemas GNSS com seus três segmentos.',
  '<p>projeções cartográficas e sistemas de posicionamento e navegação por satélites (GNSS);</p>
<ul><li><p><strong>Superfícies das projeções cartográficas:</strong> cilíndrico, cônico e azimutal/polar;</p></li>
<li><p><strong>Projeções cartográficas clássicas:</strong> Mercator, Peters e Robinson;</p></li>
<li><p><strong>GNSS:</strong> os sistemas de cada país e os três segmentos.</p></li></ul>
<h2 data-corrido="sim">Superfícies das projeções cartográficas:</h2>
<p>cada formato pode facilitar a elaborar e privilegiar alguma distorção;</p>
<h3 data-corrido="sim">Cilíndrico:</h3>
<p>ideal para baixas latitudes, altas latitudes muito distorcidas;</p>
<ul><li><p>Paralelos e meridianos formam ângulos retos.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/projecao-cilindrica.webp" alt="Globo dentro de um cilindro e o planisfério que ele produz, com paralelos e meridianos em ângulo reto e o Brasil em destaque." style="width:100%" data-largura="100%"></figure>
<h3 data-corrido="sim">Cônico:</h3>
<p>ideal para médias latitudes, distorce altas e baixas;</p>
<ul><li><p>Paralelos são curvados e meridianos são angulados.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/projecao-conica.webp" alt="Globo dentro de um cone e o mapa em leque que ele produz, com os paralelos curvados." style="width:528px" data-largura="528px"></figure>
<h3 data-corrido="sim">Azimutal/polar:</h3>
<p>ideal para altas latitudes, só é possível detalhar um polo por vez;</p>
<ul><li><p>Paralelos formam círculos e meridianos formam linhas anguladas;</p></li>
<li><p><strong>Ex:</strong> o emblema da ONU utiliza essa projeção.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/projecao-azimutal.webp" alt="Globo tangente a um plano e o mapa circular centrado no polo sul que ele produz, com os paralelos em círculos concêntricos." style="width:100%" data-largura="100%"></figure>
<h2 data-corrido="sim">Projeções cartográficas clássicas:</h2>
<p>cada uma possui conteúdo histórico próprio;</p>
<h3 data-corrido="sim">Mercator:</h3>
<p>cilíndrica (altas latitudes distorcidas) e conforme;</p>
<ul><li><p><strong>Contexto:</strong> elaborada no contexto das grandes navegações (séc. XVI);</p>
<ul><li><p><strong>Relação:</strong> [[Pré-História do Brasil]] (Escola de Sagres); [[Humanismo (século XV)]] (início das Grandes Navegações);</p></li></ul></li>
<li><p><strong>Eurocêntrica.</strong></p></li></ul>
<h3 data-corrido="sim">Peters:</h3>
<p>cilíndrica e equivalente;</p>
<ul><li><p><strong>Contexto:</strong> Guerra Fria e Pan-africanismo;</p></li>
<li><p><strong>Terceiro mundista</strong>, África com destaque;</p></li>
<li><p>Critica a projeção de Mercator.</p></li></ul>
<h3 data-corrido="sim">Robinson:</h3>
<p>pseudocilíndrica e afilática;</p>
<ul><li><p><strong>Função:</strong> didática e acadêmica;</p></li>
<li><p>Projeção do mapa-múndi.</p></li></ul>
<h2 data-corrido="sim">GNSS:</h2>
<p>sistemas de posicionamento e navegação por satélites; alguns países têm seu próprio sistema de localização:</p>
<ul><li><p><strong>GPS</strong> (Global Positioning System): EUA;</p></li>
<li><p><strong>Glonass:</strong> Rússia;</p></li>
<li><p><strong>Galileu:</strong> Europa;</p></li>
<li><p>Todo GNSS possui 3 segmentos:</p>
<ul><li><p>espacial;</p></li>
<li><p>controle;</p></li>
<li><p>usuário.</p></li></ul></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>o GPS é o sistema dos EUA; não foi desenvolvido na França para estimular o turismo internacional (UEM, Vestibular de Verão 2016);</p></li>
<li><p>a projeção de Mercator foi elaborada no século XVI e é eurocêntrica (PAS-UEM 2024, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="63104e28-0b76-4dd5-8573-bf7f8a57758f" data-gabarito="14"><p>(PAS-UEM 2024, 1ª etapa) Sobre as Grandes Navegações dos séculos XV e XVI e as representações cartográficas, assinale o que for correto.</p><p>(01) O marco inicial da expansão marítima portuguesa foi a tomada, no final do século XV, das Ilhas Canárias, arquipélago italiano situado na costa nordeste da África.</p><p>(02) A representação cartográfica de Mercator foi elaborada no século XVI e colocou a Europa em uma posição central no mapa, fortalecendo uma visão eurocêntrica do mundo.</p><p>(04) Em 1488, Bartolomeu Dias chegou ao Cabo das Tormentas, extremo meridional do continente africano, e demonstrou a existência de uma passagem para outro oceano, o Índico.</p><p>(08) O Planisfério Oval, elaborado pelo italiano Francesco Rosseli, na primeira metade do século XVI, apresentava dados de localização pouco precisos, pois o conhecimento cartográfico sobre o planeta ainda era limitado.</p><p>(16) Na primeira metade do século XVI, D. Henrique, o navegador, estendeu os domínios portugueses sobre a região de Ceuta, localizada nas Índias.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta, segundo o gabarito oficial: a tomada das Ilhas Canárias não foi o marco inicial da expansão marítima portuguesa, e o arquipélago não é italiano;</p><p>(02) Correta. A projeção de Mercator foi elaborada no contexto das grandes navegações (séc. XVI) e é eurocêntrica;</p><p>(04) Correta, segundo o gabarito oficial;</p><p>(08) Correta, segundo o gabarito oficial;</p><p>(16) Incorreta, segundo o gabarito oficial: Ceuta não está localizada nas Índias;</p><p><strong>Soma: 02 + 04 + 08 = 14</strong></p></div></aside>
<aside class="questao" data-id="7777cd11-77e5-4fda-bd77-e699a34b610c" data-gabarito="19"><p>(UEM, Vestibular de Verão 2016) A respeito de imagens de satélite e dos sistemas de posicionamento e navegação por satélites em áreas urbanas e rurais, assinale o correto.</p><p>(01) Os componentes dos novos sistemas de informação geográfica reúnem imagens de satélite que permitem observar a superfície da Terra mediante realização de voos virtuais e ajustes de zoom.</p><p>(02) As imagens feitas pelos satélites são convertidas em dados numéricos e enviadas a estações terrestres que as processam em computadores.</p><p>(04) O sistema de posicionamento global, conhecido como GPS, foi desenvolvido na França para estimular o turismo internacional.</p><p>(08) As imagens de satélites utilizadas na previsão do tempo são obtidas por equipamentos que monitoram o movimento das marés.</p><p>(16) O uso dos sistemas de posicionamento e navegação por satélites permite calcular com precisão a quantidade de adubo para cada tipo de plantação em cada parcela do solo.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta, segundo o gabarito oficial;</p><p>(02) Correta, segundo o gabarito oficial;</p><p>(04) Incorreta. O GPS é o sistema de posicionamento dos EUA;</p><p>(08) Incorreta, segundo o gabarito oficial: essas imagens não são obtidas por equipamentos que monitoram o movimento das marés;</p><p>(16) Correta, segundo o gabarito oficial;</p><p><strong>Soma: 01 + 02 + 16 = 19</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Superfície cilíndrica:</h3>
<p>ideal para baixas latitudes; paralelos e meridianos em ângulos retos;</p>
<h3 data-corrido="sim">Superfície cônica:</h3>
<p>ideal para médias latitudes; distorce altas e baixas;</p>
<h3 data-corrido="sim">Superfície azimutal/polar:</h3>
<p>ideal para altas latitudes; um polo por vez; emblema da ONU;</p>
<h3 data-corrido="sim">Mercator:</h3>
<p>cilíndrica e conforme; grandes navegações (séc. XVI); eurocêntrica;</p>
<h3 data-corrido="sim">Peters:</h3>
<p>cilíndrica e equivalente; Guerra Fria; terceiro mundista;</p>
<h3 data-corrido="sim">Robinson:</h3>
<p>pseudocilíndrica e afilática; didática e acadêmica;</p>
<h3 data-corrido="sim">Segmentos do GNSS:</h3>
<p>espacial, controle e usuário.</p>'
)
on conflict (slug) do nothing;

-- 2. Trava: grifo ou resposta nos fragmentos pede decisão antes de apagar.
do $$
begin
  if exists (select 1 from grifos g join resumos r on r.id = g.resumo_id
              where r.slug in ('superficies-das-projecoes-cartograficas',
                  'projecoes-cartograficas-classicas', 'gnss'))
     or exists (select 1 from respostas x join resumos r on r.id = x.resumo_id
                 where r.slug in ('superficies-das-projecoes-cartograficas',
                     'projecoes-cartograficas-classicas', 'gnss')) then
    raise exception 'grifos ou respostas nos fragmentos de cartografia: decidir antes de apagar';
  end if;
end $$;

-- 3. Redirecionar cada referência para o resumo novo.
with novo as (select id from resumos where slug = 'projecoes-cartograficas-e-gnss'),
     velhos as (select id from resumos where slug in ('superficies-das-projecoes-cartograficas',
                     'projecoes-cartograficas-classicas', 'gnss'))
update resumos set pai_id = (select id from novo)
 where pai_id in (select id from velhos);

with novo as (select id from resumos where slug = 'projecoes-cartograficas-e-gnss'),
     velhos as (select id from resumos where slug in ('superficies-das-projecoes-cartograficas',
                     'projecoes-cartograficas-classicas', 'gnss'))
update edital_topicos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

with novo as (select id from resumos where slug = 'projecoes-cartograficas-e-gnss'),
     velhos as (select id from resumos where slug in ('superficies-das-projecoes-cartograficas',
                     'projecoes-cartograficas-classicas', 'gnss'))
update eventos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Histórico e favorito do aluno: uma linha por aluno no resumo novo.
insert into leituras (user_id, resumo_id, visto_em, favorito, favoritado_em)
select l.user_id,
       (select id from resumos where slug = 'projecoes-cartograficas-e-gnss'),
       max(l.visto_em), bool_or(l.favorito), max(l.favoritado_em)
  from leituras l
  join resumos r on r.id = l.resumo_id
 where r.slug in ('superficies-das-projecoes-cartograficas',
                     'projecoes-cartograficas-classicas', 'gnss')
 group by l.user_id
on conflict (user_id, resumo_id) do update
   set visto_em = greatest(leituras.visto_em, excluded.visto_em),
       favorito = leituras.favorito or excluded.favorito,
       favoritado_em = coalesce(leituras.favoritado_em, excluded.favoritado_em);

-- Wikilinks no corpo de outros resumos.
update resumos
   set corpo = regexp_replace(corpo, '\[\[(Superfícies das projeções cartográficas|Projeções cartográficas clássicas|GNSS - \(Global Positioning System\))\]\]',
                              '[[Projeções cartográficas e GNSS]]', 'g')
 where corpo ~ '\[\[(Superfícies das projeções cartográficas|Projeções cartográficas clássicas|GNSS - \(Global Positioning System\))\]\]'
   and slug not in ('superficies-das-projecoes-cartograficas',
                     'projecoes-cartograficas-classicas', 'gnss');

-- 4. Só então apagar os três. `conexoes` e `leituras` restantes saem em cascata.
delete from resumos where slug in ('superficies-das-projecoes-cartograficas',
                     'projecoes-cartograficas-classicas', 'gnss');

-- 5. Edital: nenhum tópico coberto inteiro (ver cabeçalho).

-- 6. Refaz as conexões do resumo novo com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'projecoes-cartograficas-e-gnss';

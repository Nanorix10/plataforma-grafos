-- Domínios morfoclimáticos e biomas do Brasil: rascunhado por Claude no modelo
-- de docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Lacuna conferida no banco em 22/10/2026: nenhum resumo trata de biomas ou
-- domínios morfoclimáticos, e o PAS-UEM 2ª etapa (Geografia do Brasil) cobra
-- "Os biomas." (nº 6) e "Os domínios morfoclimáticos." (nº 7), ambos sem
-- resumo. Processo `pas-uem`: só esse edital traz o assunto inteiro. Sem pai:
-- não há resumo do mesmo assunto; Climas do Brasil e El Niño e La Niña entram
-- só como wikilink.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2025/Resumos 4° bimestre/Resumo para Simulado
--    Harmonia_ 2º dia.docx`, seção GEOGRAFIA, §00197–00284 do extrator. Sem
--    figuras. `Resumos vestibulares/Resumo para PAS UEM 2° etapa.docx`
--    (§00178–00179) só tem os títulos.
-- 2. Edital: PAS-UEM 2ª etapa, nº 6 e nº 7.
-- 3. Provas (Documents/UEM-Provas/pdfs):
--    - Vestibular de Inverno 2017, P3 Geografia, q.06 (gabarito 22),
--      in17/P3G1-GEO.pdf, p. 3: questão; seis domínios além das faixas de
--      transição; pegadinhas;
--    - Vestibular de Inverno 2018, P3 Geografia, q.06 (gabarito 24),
--      in18/P3G1-GEO.pdf, p. 3: questão; pegadinha;
--    - Vestibular de Inverno 2026, q.30 (gabarito 06), in26/P1.pdf, p. 17:
--      clima subtropical das Araucárias;
--    - PAS-UEM 2017, etapa 2, q.12 (gabarito 28): "Araucaria angustifolia";
--      Vestibular de Verão 2022, q.37: "pinheiro-do-paraná";
--    - Vestibular de Inverno 2019, q.14 (gabarito 27) e Verão 2021, q.34
--      (gabarito 24): "igapó"; pegadinha;
--    - PAS-UEM 2022, q.21 e Verão 2020, P2, q.33: "babaçu";
--    - PAS-UEM 2023, etapa 1, q.05: "Vale da Ribeira";
--    - PAS-UEM 2017, etapa 1, q.05: pradarias "conhecidas genericamente como
--      Pampas";
--    - PAS-UEM 2023, etapa 2, q.12 (gabarito 07), pas23/E2.pdf, p. 6:
--      pegadinha da savana.
--
-- ## O que difere do caderno (decisões do autor, 22/10/2026)
-- 1. §00261–00263 (campos sulinos, coxilhas, pradarias) saem das Araucárias e
--    formam o "Domínio das Pradarias": o caderno anuncia 6 domínios e listava 5.
-- 2. Araucárias: "Clima temperado" → "clima subtropical"; "Zona temperada" sai.
-- 3. "Iguapó ou carigapó" → "Igapó".
-- 4. "Maracaju, Canastra, Verdeiros" → "Maracaju, Canastra" ("Verdeiros" sem
--    fonte para a grafia).
-- 5. "Aracemia (Pinheiro do Paraná)" → "Araucaria angustifolia
--    (pinheiro-do-paraná)".
-- 6. "Bagaçú e Carnaúba" → "Babaçu e carnaúba".
-- 7. "Alto Ribeiro" → "Alto Ribeira".
-- O exemplo "Macaco" (§00240) fica como no caderno, sem fonte que o confirme.
-- Acréscimos com fonte: "Obs:" das Pampas (PAS-UEM 2017 E1 q.05); tabela
-- comparativa montada só com a seção. Normalizações de forma: ver o PR.
--
-- ## Edital
-- Ligados: PAS-UEM 2ª etapa, "Os biomas." e "Os domínios morfoclimáticos.".
-- De fora: PAS-UEM 1ª "Biomas." (biogeografia mundial, outro assunto do
-- caderno, §00131–00196); PASSE 1ª nº 3 (clima, solo, relevo, vegetação e
-- recursos hídricos: coberto pela metade). O PAS-UEM 3ª etapa não tem tópico
-- de biomas.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
select
  'dominios-morfoclimaticos-e-biomas-do-brasil',
  'Domínios morfoclimáticos e biomas do Brasil',
  'geografia',
  'pas-uem',
  'Classificação de Aziz Ab’Saber que divide o Brasil em seis domínios morfoclimáticos e a faixa de transição, por relevo, clima e vegetação.',
  '<p>Classificação do território brasileiro criada por Aziz Ab’Saber, que delimita seis domínios morfoclimáticos (e biomas) e a faixa de transição;</p>
<ul><li><p><strong>Critérios:</strong> relevo, clima, vegetação, hidrografia, geologia e pedologia;</p></li>
<li><p><strong>Domínios:</strong> Amazônico, do Cerrado, dos Mares de Morros, da Caatinga, das Araucárias e das Pradarias;</p></li>
<li><p><strong>Faixa de transição:</strong> Pantanal e Mata dos Cocais.</p></li></ul>
<h2 data-corrido="sim">Domínio Amazônico:</h2>
<p>terras baixas, clima equatorial úmido e vegetação ombrófila;</p>
<ul><li><p><strong>Relevo:</strong> terras baixas;</p>
<ul><li><p>raramente superam 800 metros;</p></li>
<li><p><strong>Exceção:</strong> Planalto das Guianas;</p></li></ul></li>
<li><p><strong>Clima:</strong> equatorial úmido, quente e úmido (ver [[Climas do Brasil]]);</p></li>
<li><p><strong>Vegetação:</strong> ombrófila, com três tipos de estratificação:</p>
<ul><li><p><strong>Igapó:</strong> raízes submersas e plantas aquáticas;</p></li>
<li><p><strong>Várzea:</strong> áreas de inundação periódica;</p></li>
<li><p><strong>Terra firme:</strong> não há inundação;</p></li></ul></li>
<li><p><strong>Impactos:</strong> invasão de áreas protegidas e demarcadas por garimpo e desmatamento ilegal;</p>
<ul><li><p>2024: recorde de queimadas, por El Niño (ver [[El Niño e La Niña]]) e incêndios criminosos;</p></li>
<li><p>área do desmatamento: RO, MT, PA, TO e MA.</p></li></ul></li></ul>
<h2 data-corrido="sim">Domínio do Cerrado:</h2>
<p>planaltos com várias nascentes, duas estações bem definidas e vegetação tropófila;</p>
<ul><li><p><strong>Relevo:</strong> planaltos onde estão várias nascentes;</p>
<ul><li><p>entre os planaltos, há planícies sedimentares;</p></li>
<li><p><strong>Ex:</strong> Maracaju, Canastra (Planalto brasileiro);</p></li></ul></li>
<li><p><strong>Ocorrência:</strong> Centro-Oeste, Sudeste, Norte, Nordeste e Sul;</p></li>
<li><p><strong>Clima:</strong> duas estações bem definidas:</p>
<ul><li><p>verão úmido;</p></li>
<li><p>inverno seco;</p></li></ul></li>
<li><p><strong>Vegetação:</strong> tropófila:</p>
<ul><li><p>adaptada ao período de estiagem e ao chuvoso;</p></li>
<li><p>é perene;</p></li></ul></li>
<li><p><strong>Impactos:</strong> atualmente, o domínio que mais sofre com o avanço do agro.</p></li></ul>
<h3 data-corrido="sim">Estratificação do Cerrado:</h3>
<p>formações da mais aberta à mais fechada;</p>
<ul><li><p><strong>Campo limpo:</strong> gramíneas;</p></li>
<li><p><strong>Campo sujo:</strong> pequenos arbustos;</p></li>
<li><p><strong>Campo cerrado:</strong> arbustos e pequenas árvores;</p></li>
<li><p><strong>Cerrado propriamente dito:</strong> arbustos, árvores e herbáceas;</p>
<ul><li><p>“stricto sensu”: espaçadas;</p></li></ul></li>
<li><p><strong>Cerradão:</strong> árvores de médio porte adensadas;</p></li>
<li><p><strong>Veredas:</strong> palmeiras em locais de solo úmido;</p></li>
<li><p><strong>Mata de galeria:</strong> mata ciliar.</p></li></ul>
<h2 data-corrido="sim">Domínio dos Mares de Morros:</h2>
<p>relevo mamelonar, vegetação de Mata Atlântica e clima tropical litorâneo;</p>
<ul><li><p><strong>Relevo:</strong> mamelonar / formato de ½ laranja;</p>
<ul><li><p>planaltos e serras desgastados;</p></li>
<li><p>presença de vales fundos;</p></li>
<li><p><strong>Ex:</strong> Rio do Rastro, Corvo Branco, Macaco, Mantiqueira, Borborema e Serra Geral;</p></li></ul></li>
<li><p><strong>Ocorrência:</strong> do Rio Grande do Norte ao Rio Grande do Sul;</p></li>
<li><p><strong>Vegetação:</strong> Mata Atlântica, ombrófila;</p>
<ul><li><p>as áreas mais preservadas estão no PETAR (Parque Estadual Turístico do Alto Ribeira);</p></li></ul></li>
<li><p><strong>Clima:</strong> tropical litorâneo ou úmido;</p>
<ul><li><p>tropical de altitude.</p></li></ul></li></ul>
<h2 data-corrido="sim">Domínio da Caatinga:</h2>
<p>planaltos, depressões e planícies, clima semiárido e vegetação xerófila;</p>
<ul><li><p><strong>Relevo:</strong> presença de planaltos;</p>
<ul><li><p><strong>Ex:</strong> Borborema;</p></li>
<li><p>há também depressões e planícies: Depressão Sertaneja; Planície do Paraíba;</p></li></ul></li>
<li><p><strong>Clima:</strong> semiárido;</p>
<ul><li><p>pouca chuva e mal distribuída;</p></li>
<li><p>seca no sertão;</p></li></ul></li>
<li><p><strong>Vegetação:</strong> xerófila;</p>
<ul><li><p>palma e cacto;</p></li>
<li><p>há árvores caducifólias.</p></li></ul></li></ul>
<h2 data-corrido="sim">Domínio das Araucárias:</h2>
<p>planícies e planaltos, clima subtropical e vegetação conífera;</p>
<ul><li><p><strong>Relevo:</strong> planícies e planaltos;</p>
<ul><li><p>podem ser encontrados cânions;</p></li></ul></li>
<li><p><strong>Clima:</strong> subtropical: quatro estações bem definidas, com chuvas bem distribuídas;</p></li>
<li><p><strong>Vegetação:</strong> conífera;</p>
<ul><li><p>folhas aciculifoliadas;</p></li>
<li><p>grande porte;</p></li>
<li><p><strong>Ex:</strong> <em>Araucaria angustifolia</em> (pinheiro-do-paraná).</p></li></ul></li></ul>
<h2 data-corrido="sim">Domínio das Pradarias:</h2>
<p>porção dos campos sulinos, com predomínio das coxilhas;</p>
<ul><li><p><strong>Relevo:</strong> coxilhas, pequenos morros de relevo suave;</p></li>
<li><p><strong>Vegetação:</strong> pradarias, que são pastos naturais;</p>
<ul><li><p><strong>Obs:</strong> as pradarias subtropicais e temperadas são conhecidas genericamente como Pampas.</p></li></ul></li></ul>
<h2 data-corrido="sim">Faixa de transição:</h2>
<p>encontro de domínios; são formações complexas entre um domínio e outro;</p>
<h3 data-corrido="sim">Pantanal:</h3>
<p>planície alagável pelo regime do Paraguai;</p>
<ul><li><p>Ciclo das Águas;</p></li>
<li><p><strong>Povo tradicional:</strong> pantaneiro;</p></li>
<li><p><strong>Ocorrência:</strong> Mato Grosso e Mato Grosso do Sul;</p></li>
<li><p><strong>Chiquitania ou Chaco:</strong> Bolívia e Paraguai.</p></li></ul>
<h3 data-corrido="sim">Mata dos Cocais:</h3>
<p>encontro do Cerrado, da Amazônia e da Caatinga;</p>
<ul><li><p><strong>Ocorrência:</strong> Ceará, Piauí e Maranhão;</p></li>
<li><p><strong>Povo tradicional:</strong> quebradeiras de coco;</p></li>
<li><p><strong>Babaçu e carnaúba:</strong> coqueiros usados na indústria cosmética.</p></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>Relevo</strong></p></th><th><p><strong>Clima</strong></p></th><th><p><strong>Vegetação</strong></p></th></tr>
<tr><td><p>Amazônico</p></td><td><p>terras baixas</p></td><td><p>equatorial úmido</p></td><td><p>ombrófila</p></td></tr>
<tr><td><p>Cerrado</p></td><td><p>planaltos com nascentes</p></td><td><p>verão úmido e inverno seco</p></td><td><p>tropófila</p></td></tr>
<tr><td><p>Mares de Morros</p></td><td><p>mamelonar</p></td><td><p>tropical litorâneo ou úmido</p></td><td><p>Mata Atlântica, ombrófila</p></td></tr>
<tr><td><p>Caatinga</p></td><td><p>planaltos, depressões e planícies</p></td><td><p>semiárido</p></td><td><p>xerófila</p></td></tr>
<tr><td><p>Araucárias</p></td><td><p>planícies e planaltos</p></td><td><p>subtropical</p></td><td><p>conífera</p></td></tr>
<tr><td><p>Pradarias</p></td><td><p>coxilhas</p></td><td><p>—</p></td><td><p>pradarias (pastos naturais)</p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>a vegetação dos Mares de Morros é a Mata Atlântica, e não a floresta equatorial (UEM, Vestibular de Inverno 2017);</p></li>
<li><p>o Centro-Oeste é área do Domínio do Cerrado, e não do Domínio das Araucárias (UEM, Vestibular de Inverno 2017);</p></li>
<li><p>a Floresta Amazônica não é homogênea: tem igapó, várzea e terra firme (UEM, Vestibular de Inverno 2018);</p></li>
<li><p>o igapó tem raízes submersas; não se desenvolve em terra firme nem em áreas não inundáveis (UEM, Vestibular de Inverno 2019; Vestibular de Verão 2021);</p></li>
<li><p>a savana não se associa às regiões de maior índice pluviométrico, como as das florestas tropicais (PAS-UEM 2023, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="3abe990d-594d-45eb-a33c-fa6b0c22b0da" data-gabarito="22"><p>(UEM, Vestibular de Inverno 2017) O geógrafo Aziz Nacib Ab’Saber delimitou domínios morfoclimáticos para o território brasileiro. Com base na classificação proposta por ele, assinale a(s) alternativa(s) correta(s).</p><p>(01) O domínio de mares de morros apresenta uma paisagem típica de áreas que foram modificadas devido à presença da floresta equatorial nas bordas dos planaltos.</p><p>(02) Apesar da extensão territorial do Brasil, foram identificados somente seis domínios morfoclimáticos, além das faixas de transição.</p><p>(04) O domínio da caatinga possui grande homogeneidade ecológica e fisiográfica, tendo sido identificado em diversas porções do Brasil.</p><p>(08) Na região Centro-Oeste, nas áreas de planaltos e de clima subtropical, foi delimitado o domínio das araucárias, cuja espécie se encontra em avançado estágio de regeneração.</p><p>(16) Os solos ácidos de algumas porções de domínios do cerrado estão sendo devastados em razão da expansão da agricultura e da pecuária, necessitando de correções para as destinações agropecuárias.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. A vegetação dos Mares de Morros é a Mata Atlântica, ombrófila; o clima equatorial é o do Domínio Amazônico;</p><p>(02) Correta. Ab’Saber delimitou seis domínios e a faixa de transição;</p><p>(04) Correta, segundo o gabarito oficial;</p><p>(08) Incorreta. O clima subtropical é o das Araucárias, mas o Centro-Oeste é área do Cerrado;</p><p>(16) Correta. O Cerrado é o domínio que mais sofre com o avanço do agro;</p><p><strong>Soma: 02 + 04 + 16 = 22</strong></p></div></aside>
<aside class="questao" data-id="c46020cb-7e52-442a-9190-a98dded48d8b" data-gabarito="24"><p>(UEM, Vestibular de Inverno 2018) Considerando as características naturais do território e também a influência das atividades socioeconômicas, assinale o que for correto sobre os biomas existentes no Brasil.</p><p>(01) A Floresta Amazônica é caracterizada pela homogeneidade das formações vegetais, o que a torna única no planeta.</p><p>(02) O desenvolvimento da silvicultura foi uma maneira encontrada pela indústria para explorar as matérias-primas dos biomas de modo sustentável, preservando a vegetação natural.</p><p>(04) Os manguezais compõem o bioma característico dos campos naturais e atualmente estão ameaçados de extinção devido ao avanço agrícola sobre essas formações vegetais.</p><p>(08) A Mata Atlântica, típica floresta pluvial, ocorre principalmente nas áreas litorâneas desde o Rio Grande do Norte até o Rio Grande do Sul.</p><p>(16) O Pantanal é formado por um complexo agrupamento de formações vegetais que lhe proporciona uma biodiversidade que se estende por parte dos estados de Mato Grosso e de Mato Grosso do Sul.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. A floresta tem três tipos de estratificação: igapó, várzea e terra firme;</p><p>(02) Incorreta, segundo o gabarito oficial;</p><p>(04) Incorreta, segundo o gabarito oficial;</p><p>(08) Correta. A Mata Atlântica, ombrófila, ocorre do Rio Grande do Norte ao Rio Grande do Sul;</p><p>(16) Correta. O Pantanal é formação complexa da faixa de transição, em Mato Grosso e Mato Grosso do Sul;</p><p><strong>Soma: 08 + 16 = 24</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Domínios morfoclimáticos:</h3>
<p>classificação de Aziz Ab’Saber: seis domínios e a faixa de transição;</p>
<h3 data-corrido="sim">Critérios de Ab’Saber:</h3>
<p>relevo, clima, vegetação, hidrografia, geologia e pedologia;</p>
<h3 data-corrido="sim">Estratificação do Domínio Amazônico:</h3>
<p>igapó, várzea e terra firme;</p>
<h3 data-corrido="sim">Clima do Domínio do Cerrado:</h3>
<p>duas estações bem definidas: verão úmido e inverno seco;</p>
<h3 data-corrido="sim">Relevo dos Mares de Morros:</h3>
<p>mamelonar, em formato de ½ laranja;</p>
<h3 data-corrido="sim">Vegetação da Caatinga:</h3>
<p>xerófila, com palma, cacto e árvores caducifólias;</p>
<h3 data-corrido="sim">Clima do Domínio das Araucárias:</h3>
<p>subtropical, com quatro estações bem definidas;</p>
<h3 data-corrido="sim">Faixa de transição:</h3>
<p>Pantanal e Mata dos Cocais.</p>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 2
   and e.texto = 'Os biomas.'
   and e.resumo_id is null
   and r.slug = 'dominios-morfoclimaticos-e-biomas-do-brasil';

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 2
   and e.texto = 'Os domínios morfoclimáticos.'
   and e.resumo_id is null
   and r.slug = 'dominios-morfoclimaticos-e-biomas-do-brasil';

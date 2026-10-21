-- Brasil colonial: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Junta sete resumos em um.** Capitanias hereditárias, Governo geral,
-- Invasão francesa, União Ibérica, Invasão holandesa, Maurício de Nassau e
-- Insurreição Pernambucana existiam como resumos soltos (39 a 311 palavras,
-- sem pai), cópia literal do caderno. Decisão do autor (21/10/2026): apagar
-- os sete e reuni-los aqui, um grafo por fase, em ordem. Administração e
-- governo de Pombal, O tráfico negreiro e as expressões de escravidão e
-- Expansão territorial passam a filhos deste (só pai_id, sem reescrita).
--
-- ## Por que este tópico
--
-- Conferido no banco em 20/10/2026: o PAS-UEM 1ª etapa nº 16 ("O período
-- colonial: economia, política, sociedade e cultura.") estava sem resumo, e
-- nenhum fragmento o cobria inteiro. Processo `comum`, como os fragmentos.
--
-- ## Fontes, e só elas
--
-- 1. Caderno: `Resumos 2025/Resumos 2º bimestre/Resumo para PR1G3.docx`,
--    HISTÓRIA, §00055–00064 do extrator (capitanias, sesmarias, engenhos,
--    governo geral, pacto colonial, plantation, Companhia de Jesus);
--    `Resumos 2025/Resumos 2º bimestre/Resumo para PR2G3.docx`, HISTÓRIA,
--    §00092–00130 (invasão francesa a Insurreição Pernambucana). Cópia:
--    `Resumo para SH_ 1º dia.docx`, §00118–00138. Sem figuras.
-- 2. Edital: PAS-UEM 1ª etapa nº 16.
-- 3. Provas: PAS-UEM 2023, etapa 1, questão 4 (gabarito 05), em
--    `Documents/UEM-Provas/pdfs/pas23/E1.pdf`, p. 5 do PDF: a questão e as
--    pegadinhas dos itens 02 e 08. PAS-UEM 2020, etapa 1, questão 4
--    (gabarito 25), `pdfs/pas20/e1.pdf`, p. 5 do PDF: a questão e a
--    pegadinha do item 02. Conferência das correções: Vestibular de Verão
--    2016, prova 3 (História), questão 13 (gabarito 19; item 02 correto,
--    França Antártica em 1555), `pdfs/ve16/P3G1-HIS.pdf`, p. 4; Vestibular
--    de Verão 2016, prova 1, questão 10 (gabarito 12; item 16 incorreto,
--    sesmarias não eram pequenas propriedades), `pdfs/ve16/P1G1.pdf`, p. 3.
--
-- ## Correções de conteúdo, aprovadas pelo autor em 21/10/2026
--
-- a. §00108 "os holandeses invadiram Portugal" → "os holandeses invadiram o
--    litoral (nordeste) do Brasil" (o próprio caderno, §00111).
-- b. §00057 "Sesmarias: pequenos lotes de terra doados aos colonos
--    portugueses" → "lotes de terra doados pelos donatários aos colonos
--    portugueses" (Verão 2016 P1 Q10; PAS 2023 E1 Q4, item 01).
-- c. §00093 "Villegagnon em 1550" → 1555 (Verão 2016 P3-HIS Q13, item 02).
-- d. §00128–00129: sai "também chamada de Guerra Basílico" e os anos sem
--    fonte; fica "encerrada em 1654" e "derrotados em duas batalhas em
--    Guararapes".
-- e. §00104 "Expulsão e criação da Guiana Francesa - 1620": sai o ano.
-- "Das 15 capitanias" e "1624" seguem o caderno, por decisão do autor.
--
-- ## Edital
--
-- Ligado: PAS-UEM 1ª etapa nº 16, coberto pelo pai com os três filhos.
-- Fora: PAS-UEM 1ª etapa nº 15 ("História do Brasil.", título de grupo);
-- PASSE 2ª etapa nº 2 ("Brasil Colônia…"), coberto pela metade: o caderno
-- não trata da colonização espanhola no sul de Mato Grosso.
--
-- ## Referências aos sete resumos apagados (levantadas em 21/10/2026)
--
-- FKs para `resumos`: resumos.pai_id, conexoes.origem_id/destino_id,
-- eventos.resumo_id, edital_topicos.resumo_id, leituras.resumo_id,
-- grifos.resumo_id, respostas.resumo_id. Na data: 0 filhos, 0 conexões,
-- 10 eventos, 0 tópicos de edital, 0 grifos, 0 respostas, 0 leituras,
-- 0 wikilinks de entrada. Cada passo redireciona o que existir na hora, e a
-- migration aborta se houver grifo ou resposta. A questão PAS-UEM 2023
-- mantém o data-id que tinha em Capitanias hereditárias.

-- 1. O resumo novo.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'brasil-colonial',
  'Brasil colonial',
  'historia',
  'comum',
  'Capitanias, governo geral, pacto colonial e plantation; as invasões francesa e holandesa até a Insurreição Pernambucana e a Paz de Haia.',
  '<p>organização política, econômica e social da colônia portuguesa na América, das capitanias hereditárias às reformas pombalinas;</p>
<ul><li><p><strong>Política:</strong> capitanias hereditárias, governo geral, União Ibérica e as reformas de [[Administração e governo de Pombal - SOMENTE as reformas pombalinas]] (1750–1777);</p></li>
<li><p><strong>Economia:</strong> engenhos de açúcar, pacto colonial e plantation; drogas do sertão e mineração de ouro em [[Expansão territorial]];</p></li>
<li><p><strong>Sociedade:</strong> mão de obra escrava, em [[O tráfico negreiro e as expressões de escravidão]]; a Companhia de Jesus junto aos indígenas;</p></li>
<li><p><strong>Invasões:</strong> franceses no Rio de Janeiro e no Maranhão; holandeses no nordeste, expulsos pela Insurreição Pernambucana.</p></li></ul>
<table><tbody><tr><td><p><strong>Período</strong></p></td><td><p>séc. XVI (capitanias hereditárias) a 1777 (fim do governo de Pombal)</p></td></tr>
<tr><td><p><strong>Lugar</strong></p></td><td><p>litoral do Brasil; Rio de Janeiro (França Antártica); Maranhão (França Equinocial); nordeste (Nova Holanda)</p></td></tr>
<tr><td><p><strong>Agentes</strong></p></td><td><p>Dom João III; donatários; Companhia de Jesus; Villegagnon; Estácio de Sá; Filipe II; Companhia das Índias Ocidentais; João Maurício de Nassau; senhores de engenho; D. João IV</p></td></tr>
<tr><td><p><strong>Documentos</strong></p></td><td><p>Carta Régia de 1570; Tratado de Haia (1661)</p></td></tr></tbody></table>
<h2 data-corrido="sim">Capitanias hereditárias:</h2>
<p>divisão do território em faixas de terra (capitanias), que eram doadas a nobres portugueses (donatários) para que estes as povoassem, explorassem e governassem;</p>
<ul><li><p><strong>Contexto:</strong> primeira forma de organização territorial e administrativa do Brasil, implementada por Dom João III;</p></li>
<li><p><strong>Sesmarias:</strong> lotes de terra doados pelos donatários aos colonos portugueses;</p></li>
<li><p>Das 15 capitanias, apenas São Vicente e Pernambuco prosperaram;</p></li>
<li><p>Os engenhos de açúcar eram a principal fonte de renda e trabalho;</p></li>
<li><p><strong>Desafios:</strong> piratas, tensões religiosas, alianças de europeus e nativos.</p></li></ul>
<h2 data-corrido="sim">Governo geral:</h2>
<p>centralização administrativa da colônia;</p>
<ul><li><p><strong>Pacto colonial:</strong> a colônia só poderia comercializar com a metrópole;</p></li>
<li><p><strong>Plantation:</strong> monocultura, latifúndios e mão de obra escrava;</p></li>
<li><p><strong>Companhia de Jesus:</strong> os jesuítas foram responsáveis por difundir a fé católica entre os indígenas;</p>
<ul><li><p><strong>Consequência:</strong> proibição da escravidão indígena na Carta Régia de 1570.</p></li></ul></li></ul>
<h2 data-corrido="sim">Invasão francesa:</h2>
<p>ocupação francesa do litoral, no Rio de Janeiro e no Maranhão;</p>
<h3 data-corrido="sim">França Antártica (1555–1565):</h3>
<p>desembarque com Villegagnon em 1555, no RJ;</p>
<ul><li><p>Tentativa de alianças com nativos por meio de casamentos;</p></li>
<li><p>Aliança com os Tamoios;</p></li>
<li><p>Chegada de representantes do calvinismo: tentativa de converter os indígenas;</p></li>
<li><p>Modos de vida dos indígenas;</p></li>
<li><p>Confederação dos Tamoios;</p></li>
<li><p><strong>Consequência:</strong> expulsão dos franceses por Estácio de Sá (1565).</p></li></ul>
<h3 data-corrido="sim">França Equinocial (1612):</h3>
<p>ocupação francesa no MA;</p>
<ul><li><p>Fundação da primeira capital francesa, São Luís do Maranhão;</p></li>
<li><p><strong>Causa da saída:</strong> brigas internas entre franceses e falta de recursos;</p></li>
<li><p><strong>Consequência:</strong> expulsão e criação da Guiana Francesa.</p></li></ul>
<h2 data-corrido="sim">União Ibérica:</h2>
<p>união entre Portugal e Espanha;</p>
<ul><li><p><strong>Contexto:</strong> o rei Filipe II, da Dinastia de Habsburgo, assume o trono português;</p></li>
<li><p><strong>Consequência:</strong> a Holanda tinha desavenças com a Espanha; por isso, os holandeses invadiram o litoral (nordeste) do Brasil;</p></li>
<li><p><strong>Companhia das Índias Ocidentais:</strong> empresa holandesa de comércio e guerra (fundada em 1621);</p>
<ul><li><p>Objetivo: desafiar o monopólio ibérico (espanhol e português) no comércio entre a Europa e as Américas;</p></li>
<li><p>Foco no comércio de açúcar, escravos e na captura de novos inimigos.</p></li></ul></li></ul>
<h2 data-corrido="sim">Invasão holandesa (1624):</h2>
<p>os holandeses invadem quase todo o litoral (nordeste) em 1624 e expulsam os portugueses;</p>
<ul><li><p><strong>Divergências:</strong> os holandeses não tinham o apoio da população;</p></li>
<li><p><strong>Causa:</strong> protestantismo holandês e saques feitos à Igreja;</p></li>
<li><p><strong>Solução proposta:</strong> encaminhar um governante para o Brasil.</p></li></ul>
<h2 data-corrido="sim">Maurício de Nassau (1637):</h2>
<p>governante enviado pela Holanda: João Maurício de Nassau chega em 1637;</p>
<ul><li><p>Passou a chamar o território de Nova Holanda;</p></li>
<li><p>Implantou um sistema de Administração e Justiça como o da Holanda;</p></li>
<li><p>Fundou uma cidade chamada Maurícia;</p>
<ul><li><p>Ordenou a construção de novos palácios, jardim botânico e zoológico;</p></li></ul></li>
<li><p>Incentivou a vinda de pintores, astrônomos e botânicos para estudar e catalogar as espécies locais;</p></li>
<li><p>Permitiu a liberdade de culto;</p>
<ul><li><p><strong>Fundamento:</strong> evitar conflitos entre católicos e calvinistas;</p></li></ul></li>
<li><p>Muitos judeus vieram para o Brasil e ajudaram na economia, principalmente na distribuição de produtos importados;</p></li>
<li><p>Concedeu empréstimos para senhores de engenho.</p></li></ul>
<h2 data-corrido="sim">Insurreição Pernambucana:</h2>
<p>revolta que expulsou os holandeses do Brasil, encerrada em 1654;</p>
<ul><li><p><strong>Causas:</strong></p>
<ul><li><p>Em Portugal, houve a Restauração, movimento lusitano responsável por colocar no trono D. João IV, da Dinastia Bragança, dando fim à União Ibérica;</p></li>
<li><p>A Holanda convoca o retorno de Maurício de Nassau;</p></li>
<li><p>Os senhores de engenho ficaram endividados com a Holanda e temiam perder suas terras;</p></li></ul></li>
<li><p>Os holandeses foram derrotados em duas batalhas em Guararapes;</p></li>
<li><p>Os holandeses se concentraram em Maurícia, mas em 1654 ataques de navios portugueses fizeram com que eles deixassem finalmente o Brasil;</p></li>
<li><p><strong>Consequência:</strong> o Tratado de Haia (1661), também conhecido como “Paz de Haia”, foi um tratado de paz entre Portugal e a Holanda.</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>o Governo-Geral foi centralização administrativa, não descentralização com mais poderes aos donatários (PAS-UEM 2023, 1ª etapa);</p></li>
<li><p>a invasão das terras açucareiras no século XVII foi holandesa, não inglesa (PAS-UEM 2023, 1ª etapa);</p></li>
<li><p>a União Ibérica não ampliou as relações comerciais do mercado colonial brasileiro com diversos países europeus (PAS-UEM 2020, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="7c8633e5-bf3c-5496-8401-0b96d075b5e6" data-gabarito="05"><p>(PAS-UEM 2023, 1ª etapa) Assinale o que for correto sobre a organização político-administrativa durante a colonização portuguesa na América.</p><p>(01) Na primeira metade do século XVI, a Coroa Portuguesa instituiu o regime de capitanias hereditárias na região litorânea do Brasil. Por meio da Carta de Doação, as capitanias foram doadas a donatários, que podiam fundar vilas, doar sesmarias e exercer o monopólio da justiça.</p><p>(02) O Governo-Geral estabelecido pela Coroa Portuguesa foi um esforço político-administrativo que objetivava fortalecer a descentralização da administração colonial e conferir mais poderes aos donatários.</p><p>(04) A União Ibérica, ocorrida entre 1580 e 1640, significou a união dos tronos espanhol e português, sob o controle do rei da Espanha. Como consequência para o Brasil, a união dessas coroas tornou sem efeito a linha divisória do Tratado de Tordesilhas, que dividia as terras da colônia espanhola e da colônia portuguesa.</p><p>(08) Na segunda metade do século XVII, os ingleses se organizaram militarmente e invadiram as terras da América portuguesa a fim de conquistar as zonas de produção açucareira. Essa invasão provocou diversos problemas administrativos, econômicos e políticos para Portugal.</p><p>(16) O domínio administrativo dos portugueses sobre as terras da América foi enfraquecido pela promulgação do Tratado de Madri, na primeira metade do século XVII. Esse tratado impôs uma redução da extensão de suas possessões territoriais e beneficiou os espanhóis na disputa pelas terras.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. As capitanias hereditárias, implementadas por Dom João III, eram faixas de terra doadas a donatários para que as povoassem, explorassem e governassem; os donatários doavam sesmarias aos colonos;</p><p>(02) Incorreta. O governo geral foi a centralização administrativa da colônia;</p><p>(04) Correta. Com Filipe II, da Dinastia de Habsburgo, no trono português, Portugal e Espanha ficaram unidos sob o mesmo rei;</p><p>(08) Incorreta. A invasão do litoral nordeste foi holandesa, em 1624, na primeira metade do século XVII;</p><p>(16) Incorreta, pelo gabarito oficial.</p><p><strong>Soma: 01 + 04 = 05</strong></p></div></aside>
<aside class="questao" data-id="1890a236-3f63-4289-a466-4791e4936934" data-gabarito="25"><p>(PAS-UEM 2020, 1ª etapa) Sobre a economia na América portuguesa, assinale o que for correto.</p><p>(01) A produção do açúcar no Brasil foi organizada a partir da formação de grandes propriedades rurais monocultoras, baseadas no trabalho escravo, e cuja produção se destinava ao mercado europeu.</p><p>(02) O período correspondente à “União Ibérica”, em que a Coroa portuguesa ficou sob o domínio espanhol, caracterizou-se pela ampliação das relações econômicas e comerciais do mercado colonial brasileiro com diversos países europeus.</p><p>(04) O sistema de plantation presente na organização econômica da América portuguesa inviabilizou o desenvolvimento de outras atividades comerciais locais, obrigando a importação de produtos de subsistência de outras regiões das Américas.</p><p>(08) Na primeira metade do século XVII, a economia açucareira da América portuguesa passou a sofrer a concorrência do açúcar produzido nas Antilhas.</p><p>(16) A economia mineradora estava articulada a diversas áreas da colônia portuguesa, pois gado, alimentos e mulas vinham do Sul e, também, do Nordeste, para atender as necessidades da região das minas, no Centro-Oeste.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. A plantation reunia monocultura, latifúndios e mão de obra escrava, e os engenhos de açúcar eram a principal fonte de renda e trabalho;</p><p>(02) Incorreta. Na União Ibérica, a Holanda, em desavença com a Espanha, criou a Companhia das Índias Ocidentais para desafiar o monopólio ibérico e invadiu o litoral nordeste do Brasil;</p><p>(04) Incorreta, pelo gabarito oficial;</p><p>(08) Correta, pelo gabarito oficial;</p><p>(16) Correta. As jazidas de ouro de Minas Gerais, Mato Grosso e Goiás deram origem a um novo ciclo econômico, articulado a outras áreas da colônia.</p><p><strong>Soma: 01 + 08 + 16 = 25</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Capitanias hereditárias:</h3>
<p>faixas de terra doadas a donatários para que as povoassem, explorassem e governassem;</p>
<h3 data-corrido="sim">Sesmarias:</h3>
<p>lotes de terra doados pelos donatários aos colonos portugueses;</p>
<h3 data-corrido="sim">Pacto colonial:</h3>
<p>a colônia só poderia comercializar com a metrópole;</p>
<h3 data-corrido="sim">Plantation:</h3>
<p>monocultura, latifúndios e mão de obra escrava;</p>
<h3 data-corrido="sim">França Antártica:</h3>
<p>ocupação francesa no RJ, com Villegagnon (1555), expulsa por Estácio de Sá (1565);</p>
<h3 data-corrido="sim">Companhia das Índias Ocidentais:</h3>
<p>empresa holandesa de comércio e guerra (1621) contra o monopólio ibérico;</p>
<h3 data-corrido="sim">Nova Holanda:</h3>
<p>nome que Maurício de Nassau (1637) deu ao território holandês;</p>
<h3 data-corrido="sim">Insurreição Pernambucana:</h3>
<p>revolta dos senhores de engenho endividados com a Holanda, encerrada em 1654 com a saída dos holandeses;</p>'
)
on conflict (slug) do nothing;

-- 2. Trava: grifo ou resposta nos antigos não tem destino.
do $$
begin
  if exists (select 1 from grifos g join resumos r on r.id = g.resumo_id
              where r.slug in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana'))
     or exists (select 1 from respostas x join resumos r on r.id = x.resumo_id
                 where r.slug in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana')) then
    raise exception 'grifos ou respostas nos fragmentos do Brasil colonial: decidir antes de apagar';
  end if;
end $$;

-- 3. Redirecionar cada referência para o resumo novo.
with novo as (select id from resumos where slug = 'brasil-colonial'),
     velhos as (select id from resumos where slug in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana'))
update resumos set pai_id = (select id from novo)
 where pai_id in (select id from velhos);

with novo as (select id from resumos where slug = 'brasil-colonial'),
     velhos as (select id from resumos where slug in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana'))
update edital_topicos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Os dez eventos da linha do tempo (Carta Régia de 1570, Villegagnon,
-- Tratado de Haia…).
with novo as (select id from resumos where slug = 'brasil-colonial'),
     velhos as (select id from resumos where slug in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana'))
update eventos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Histórico e favorito do aluno: uma linha por aluno no resumo novo, com a
-- visita mais recente e a estrela se ele tinha estrela em qualquer dos sete.
insert into leituras (user_id, resumo_id, visto_em, favorito, favoritado_em)
select l.user_id,
       (select id from resumos where slug = 'brasil-colonial'),
       max(l.visto_em), bool_or(l.favorito), max(l.favoritado_em)
  from leituras l
  join resumos r on r.id = l.resumo_id
 where r.slug in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana')
 group by l.user_id
on conflict (user_id, resumo_id) do update
   set visto_em = greatest(leituras.visto_em, excluded.visto_em),
       favorito = leituras.favorito or excluded.favorito,
       favoritado_em = coalesce(leituras.favoritado_em, excluded.favoritado_em);

-- Wikilinks no corpo de outros resumos. O trigger `sync_conexoes_resumo`
-- refaz as conexões desses resumos no próprio update.
update resumos
   set corpo = regexp_replace(corpo, '\[\[(Capitanias hereditárias|Governo geral|Invasão francesa|União Ibérica|Invasão holandesa|Maurício de Nassau|Insurreição Pernambucana)\]\]',
                              '[[Brasil colonial]]', 'g')
 where corpo ~ '\[\[(Capitanias hereditárias|Governo geral|Invasão francesa|União Ibérica|Invasão holandesa|Maurício de Nassau|Insurreição Pernambucana)\]\]'
   and slug not in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana');

-- 4. Só então apagar os sete. `conexoes` e `leituras` restantes saem em cascata.
delete from resumos where slug in ('capitanias-hereditarias', 'governo-geral', 'invasao-francesa',
                     'uniao-iberica', 'invasao-holandesa', 'mauricio-de-nassau',
                     'insurreicao-pernambucana');

-- 5. Os três filhos, sem reescrita.
update resumos
   set pai_id = (select id from resumos where slug = 'brasil-colonial')
 where slug in ('administracao-e-governo-de-pombal',
                'o-trafico-negreiro-e-as-expressoes-de-escravidao',
                'expansao-territorial');

-- 6. Edital: o tópico que este resumo cobre inteiro.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.materia_slug = 'historia'
   and e.texto = 'O período colonial: economia, política, sociedade e cultura.'
   and e.resumo_id is null
   and r.slug = 'brasil-colonial';

-- 7. Refaz as conexões do resumo novo com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'brasil-colonial';

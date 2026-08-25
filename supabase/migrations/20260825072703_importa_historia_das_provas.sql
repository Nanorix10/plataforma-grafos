-- Traz a História das provas da escola: vinte e cinco resumos e uma figura.
--
-- `processo_slug = 'comum'`, o destino combinado para material de prova de
-- escola em 2026-08-23 (decisão 1c). Segunda leva vinda das 59 provas, depois
-- da Sociologia (`20260825023940`).
--
-- **A História tinha DOIS resumos** — `Formação das Monarquias Nacionais` e
-- `Revoluções burguesas` — contra 79 tópicos de edital. Passa a ter 27.
--
-- ## O autor marca a matéria, e eu não estava lendo isso
--
-- A leva da Sociologia registrou que classificar a matéria automaticamente
-- falhou duas vezes (herdar do vizinho, segmentar por âncora do edital). O
-- diagnóstico estava certo, mas faltava um dado: **58 dos 59 documentos trazem
-- cabeçalhos de matéria escritos pelo próprio autor** — `HISTÓRIA B`, `ARTE`,
-- `FÍSICA A`, `GEOGRAFIA B` —, quase sempre com um ✅ ao lado, que é como ele
-- marca a seção já revisada.
--
-- Isso é sinal de origem, não inferência minha, e decidiu três casos que a
-- leitura do conteúdo tinha deixado em dúvida:
--
-- - `Missão artística francesa` está sob `ARTE ✅` — é Arte, não História,
--   embora fale de D. João VI e de 1816;
-- - `Sistema internacional moderno` está sob `GEOGRAFIA B ✅`, apesar de
--   Maquiavel, Hobbes, Locke e Montesquieu;
-- - `Fluxos migratórios`, que o edital casava com História, é a tipologia de
--   migração (pendular, sazonal, êxodo rural) — Geografia.
--
-- **O marcador não resolve tudo, e é honesto dizer onde ele falha:** o autor
-- não escreve um para cada matéria. No `Resumo para PR2G3` do 2º bimestre, a
-- seção de História e a de Arte vêm sem cabeçalho nenhum, logo depois de
-- `BIOLOGIA B✅` — então `Maurício de Nassau` e `Arte gótica` herdam "biologia"
-- de quem veio antes. Por isso estes 25 continuam saindo de lista curada à mão
-- e conferida lendo o conteúdo, e não de classificação automática.
--
-- ## O que ficou de fora, e por quê
--
-- **Trinta e quatro títulos sem texto.** São listas de edital: "Unificação
-- italiana;", "Imperialismo europeu;", "Antecedentes da Primeira Guerra
-- Mundial;" — o título e mais nada. Quase todos vêm do `Simulado Poliedro` de
-- 2026. Mesmo caso da "Primeira lei e noções de probabilidade" da Biologia:
-- publicar título sem corpo não ajuda, e escrever o texto é o que a decisão 9c
-- proíbe.
--
-- **Três com texto curto demais para virar resumo**, e estes valem aviso ao
-- autor porque são assuntos grandes:
--
-- - `Guerra fria` tem a definição e UMA linha ("disputa pela influência global
--   nos âmbitos político, econômico e ideológico");
-- - `Primeiro reinado` para no meio da frase: "Guerra da cisplatina: conflito
--   entre Império do Brasil e a";
-- - `Contracultura` tem três linhas, e é de Sociologia — já está publicada
--   dentro de `cultura` desde a leva de ontem.
--
-- **Seis fragmentos que são o mesmo conteúdo, picado.** No `PR2G3` do 2º
-- bimestre o tráfico negreiro aparece quebrado em "Relação Mercantil Inicial",
-- "Integração do Brasil no Comércio Transatlântico", "Volume do Tráfico de
-- Escravizados", "Comparação com Imigração Portuguesa", "Proporção de
-- desembarques" e "Característica Operacional (Viagens Bilaterais)". Os mesmos
-- números (14.900 viagens, 4,8 milhões de africanos, 86 para cada 14, 750 mil
-- portugueses) estão inteiros e em ordem no `SH 1º dia`, que é o que entra.
--
-- ## Dois casos de junção
--
-- `Período regencial` aparece em dois documentos: o do `Simulado Harmonia` tem
-- as regências, o Ato Adicional e o Golpe da Maioridade; o do `PR2G4` repete
-- três revoltas e acrescenta **Sabinada e Balaiada**. Entrou a união dos dois,
-- sob o título mais completo. Publicar os dois criaria título repetido, que
-- deixa o trigger `sync_conexoes_resumo` sem destino definido.
--
-- O `Congresso de Viena` aparece como seção dentro de `Era Napoleônica` e
-- também como tópico próprio, muito mais detalhado (os três princípios, a Santa
-- Aliança e as sete mudanças no mapa europeu). Os dois entram como o autor os
-- escreveu — a seção curta continua dentro da Era Napoleônica, porque tirá-la
-- de lá seria reescrever o texto dele.
--
-- ## Um título que o autor vai querer trocar
--
-- `Administração e governo de Pombal - SOMENTE as reformas pombalinas` entrou
-- **exatamente assim**. O "SOMENTE as reformas pombalinas" é recado dele para
-- ele mesmo, sobre o recorte da prova, e não nome de resumo — mas renomear é
-- decisão do autor, não de quem transporta (decisão 9c). Fica registrado para
-- ele trocar pelo editor em dois cliques.
--
-- ## A figura
--
-- Uma só: a pirâmide dos três Estados da França do Antigo Regime, em
-- `Revolução Francesa`. 17 KB no documento, 3,3 KB em WebP q82. Largura em
-- **porcentagem da coluna** (decisão 11b) — nunca pixel.
--
-- Os outros 24 resumos não têm figura nenhuma. Fórmula, também não — o extrator
-- achou UM `⟦…⟧` em toda a História, e ele não era fórmula: era o sinal `≠` que
-- o autor pôs antes de "Brasil pré-colonial", para avisar que aquilo NÃO é a
-- mesma coisa que Pré-História do Brasil. Entrou como texto, pela decisão 8b
-- (símbolo solto é texto, fórmula é KaTeX) — e quase se perdeu na transcrição,
-- porque um símbolo sozinho não parece conteúdo até se ver o que ele nega.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'pre-historia-do-brasil',
  'Pré-História do Brasil',
  'historia',
  'comum',
  'Da chegada dos primeiros humanos até a dos europeus: Luzia, os troncos linguísticos, os sambaquis — e a diferença entre Tordesilhas e a bula que veio antes.',
  '<p>período dado a chegada dos primeiros humanos, até a chegada dos europeus.</p>
<h2 data-corrido="sim">≠ Brasil pré-colonial:</h2>
<p>período que equivale desde a chegada dos europeus até 1530. Nesse tempo, havia apenas expedições. Antecedentes:</p>
<ul><li><p>Revolução de Ávis: crise sucessória ocorrida após a morte do monarca português Dom Fernando I.</p></li>
<li><p>Escola de Sagres: importante centro de estudos de navegação e cartografia, localizado na região do Algarve, em Portugal, fundada pelo Infante Dom Henrique, conhecido como o Navegador, e teve como objetivo principal o desenvolvimento de técnicas de navegação, aprimoramento de embarcações e estudos astronômicos. Desempenhou um papel crucial no período das Grandes Navegações</p></li>
<li><p><strong>Bula <em>Inter Coetera</em></strong>: bula papal assinada pelo Papa Alexandre VI. Estabelecia uma <strong>linha imaginária a 100 léguas a oeste das ilhas de Cabo Verde, dividindo o mundo</strong>. Portugal ficaria com o leste da linha e Espanha o oeste, dando maior acesso a Espanha ao Novo Mundo.</p></li>
<li><p><strong>Tratado de Tordesilhas</strong>: assinado um ano depois da anterior e sem intervenção da Igreja, deslocou a linha para <strong>370 léguas a oeste das ilhas de Cabo Verde, dando a Portugal uma faixa maior de território na América.</strong></p></li></ul>
<ul><li><p><strong>Sítios arqueológicos de Minas (onde foi encontrado o fóssil mais antigo da América, Luzia) e Piauí comprovam a presença humana no Brasil.</strong></p></li></ul>
<h2 data-corrido="sim">Índio:</h2>
<p>Termo que os colonizadores portugueses usaram ao chegar às Américas, acreditando estar nas Índias. Retrata os povos nativos do Brasil de maneira genérica, sem considerar as suas especificidades linguísticas e culturais;</p>
<h2 data-corrido="sim">Indígena:</h2>
<p>Natural do lugar em que vive.</p>
<h2>Troncos linguísticos</h2>
<ul><li><p><strong>Tronco tupi</strong>: é um grande agrupamento de línguas indígenas; uma das subfamílias do tronco tupi;</p></li>
<li><p><strong>Tronco macro-jê</strong>: distribuído pelas regiões não litorâneas e mais centrais do Brasil;</p></li></ul>
<h2 data-corrido="sim">Sambaquis:</h2>
<p>sítios arqueológicos formados por acúmulos de conchas, ossos, utensílios e restos de alimentos formados pelos tupi-guarani.</p>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'capitanias-hereditarias',
  'Capitanias hereditárias',
  'historia',
  'comum',
  'A primeira divisão administrativa do Brasil, e a conta que explica por que ela não deu certo: das quinze faixas, só duas prosperaram.',
  '<p><strong>divisão do território em faixas de terra (capitanias), que eram doadas a nobres portugueses (donatários) para que estes as povoassem, explorassem e governassem</strong>.</p>
<ul><li><p>Primeira forma de organização territorial e administrativa do Brasil, implementada por Dom João III;</p></li>
<li><p>Sesmarias: pequenos lotes de terra doados aos colonos portugueses.</p></li>
<li><p><strong>Das 15 capitanias, apenas São Vicente e Pernambuco prosperaram;</strong></p></li>
<li><p><strong>Os engenhos de açúcar eram a principal fonte de renda e trabalho;</strong></p></li>
<li><p><strong>Desafios: piratas, tensões religiosas, alianças de europeus e nativos.</strong></p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'governo-geral',
  'Governo geral',
  'historia',
  'comum',
  'A centralização que sucedeu as capitanias: pacto colonial, plantation e a Companhia de Jesus — com a Carta Régia que proibiu escravizar indígena.',
  '<p>centralização administrativa da colônia;</p>
<ul><li><p><strong>Pacto colonial: a colônia só poderia comercializar com a metrópole.</strong></p></li>
<li><p><strong>Plantation</strong>: monocultura, latifúndios e mão de obra escrava.</p></li>
<li><p><strong>Companhia de Jesus</strong>: os jesuítas foram responsáveis de difundir a fé católica entre os indígenas, causando a proibição da escravidão indígena na Carta Régia de 1570.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'invasao-francesa',
  'Invasão francesa',
  'historia',
  'comum',
  'As duas Franças no Brasil: a Antártica no Rio, com Villegagnon e os Tamoios, e a Equinocial no Maranhão, que fundou São Luís.',
  '<ul><li><p>Desembarque com Villegagnon em 1550.</p></li>
<li><p>França Antártica no RJ.</p></li>
<li><p>Tentativa de alianças com nativos por meio de casamentos.</p></li>
<li><p>Aliança com os Tamoios.</p></li>
<li><p>Chegada de representantes do calvinismo - tentativa de converter os indígenas</p></li>
<li><p>Modos de vida dos indígenas.</p></li>
<li><p>Confederação dos Tamoios.</p></li>
<li><p>Expulsão dos franceses por Estácio de Sá - 1565.</p></li>
<li><p>França Equinocial - 1612 no MA.</p></li>
<li><p>Fundação da Primeira Capital Francesa, São Luís do Maranhão.</p></li>
<li><p>Brigas internas entre franceses e falta de recursos contribuíram para a saída deles.</p></li>
<li><p>Expulsão e criação da Guiana Francesa - 1620.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'uniao-iberica',
  'União Ibérica',
  'historia',
  'comum',
  'Filipe II no trono português — e a consequência que a colônia pagou: a briga da Holanda com a Espanha vira invasão do Brasil.',
  '<ul><li><p>Rei Filipe II da Dinastia de Habsburgo assume o trono português.</p></li>
<li><p>União entre Portugal e Espanha.</p></li>
<li><p>A Holanda tinha desavenças com a Espanha, por isso, os holandeses invadiram Portugal.</p></li>
<li><p>Companhia das Índias Ocidentais: empresa holandesa de comércio e guerra (fundada em 1621). Seu objetivo era desafiar o monopólio ibérico (espanhol e português) no comércio entre a Europa e as Américas, com foco no comércio de açúcar, escravos e na captura de novos inimigos.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'invasao-holandesa',
  'Invasão holandesa',
  'historia',
  'comum',
  'Os holandeses tomam o litoral nordestino em 1624 — e descobrem que sem o apoio da população não se governa.',
  '<ul><li><p>Invadem quase todo o litoral (nordeste) em 1624 e expulsam os portugueses.</p></li>
<li><p>Divergências: os holandeses não tinham o apoio da população.</p></li>
<li><p>Protestantismo holandês e saques feitos à Igreja eram fatores.</p></li>
<li><p>Solução: encaminhar um governante para o Brasil.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'mauricio-de-nassau',
  'Maurício de Nassau',
  'historia',
  'comum',
  'O governante que a Holanda mandou: Maurícia, liberdade de culto, pintores e botânicos — e empréstimo a senhor de engenho.',
  '<ul><li><p>João Maurício de Nassau foi enviado em 1637.</p></li>
<li><p>Passou a chamar o território de Nova Holanda.</p></li>
<li><p>Implantou um sistema de Administração e Justiça como o da Holanda.</p></li>
<li><p>Fundou uma cidade chamada Maurícia (ordenou a construção de novos palácios, jardim botânico e zoológico).</p></li>
<li><p>Incentivou a vinda de pintores, astrônomos e botânicos para estudar e catalogar as espécies locais.</p></li>
<li><p>Permitiu a liberdade de culto (para evitar conflitos entre católicos e calvinistas).</p></li>
<li><p>Muitos judeus vieram para o Brasil e ajudaram na economia, principalmente na distribuição de produtos importados.</p></li>
<li><p>Outra política foi a de conceder empréstimos para senhores de engenhos.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'insurreicao-pernambucana',
  'Insurreição Pernambucana',
  'historia',
  'comum',
  'A dívida dos senhores de engenho vira guerra: Guararapes, a saída dos holandeses em 1654 e a Paz de Haia.',
  '<ul><li><p>Em Portugal, houve a Restauração, Movimento lusitano responsável por colocar no trono D. João IV da Dinastia Bragança, dando fim à União Ibérica.</p></li>
<li><p>Além disso, a Holanda convoca o retorno de Maurício de Nassau.</p></li>
<li><p>Os senhores de engenho ficaram endividados com a Holanda e temiam perder suas terras.</p></li>
<li><p>Inicia-se a Insurreição Pernambucana, também chamada de Guerra Basílico, com início em 1648 a 1654.</p></li>
<li><p>Em 1648, os holandeses foram derrotados em duas batalhas que ocorreram em Guararapes. Os holandeses se concentraram em Maurícia, mas em 1654, ataques de navios portugueses fizeram com que eles deixassem finalmente o Brasil.</p></li>
<li><p>O Tratado de Haia (1661), também conhecido como “Paz de Haia”, foi um tratado de paz entre Portugal e a Holanda.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'o-trafico-negreiro-e-as-expressoes-de-escravidao',
  'O tráfico negreiro e as expressões de escravidão',
  'historia',
  'comum',
  'Os números do tráfico para o Brasil: 14.900 viagens, 4,8 milhões de africanos, 86 desembarcados para cada 14 portugueses — e por que a rota era bilateral.',
  '<ul><li><p>Portugueses estabeleceram feitorias na África.</p></li>
<li><p>Objetivos: obter marfim, riquezas minerais e pessoas escravizadas.</p></li>
<li><p>O Brasil passou a participar de intenso comércio com África e Europa.</p></li>
<li><p><strong>Produtos negociados: açúcar, riquezas minerais, especiarias e pessoas escravizadas</strong>.</p></li>
<li><p>Cerca de 14.900 viagens transportaram 4,8 milhões de africanos para o Brasil.</p></li>
<li><p>No mesmo período, entraram 750 mil portugueses.</p></li>
<li><p>A cada 100 pessoas desembarcadas, 86 eram africanos escravizados e 14 eram portugueses.</p></li>
<li><p>95% das viagens que trouxeram africanos partiram dos próprios portos brasileiros.</p></li>
<li><p><strong>Principais portos:</strong> Rio de Janeiro, Bahia e Recife.</p></li>
<li><p><strong>Esse comércio era bilateral e favorecido pelas correntes de vento do Atlântico Sul, tornando as viagens mais curtas em comparação com as feitas pelas Antilhas e América do Norte</strong>.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'colonizacao-na-america',
  'Colonização na América',
  'historia',
  'comum',
  'Espanhola contra inglesa, lado a lado: encomienda e mita de um lado, autogoverno e puritanos do outro — com a tabela que compara as duas em sete linhas.',
  '<h2>América Espanhola</h2>
<ul><li><p>Os espanhóis <strong>dominaram os impérios inca (Andes) e astecas</strong>;</p>
<ul><li><p>A <strong>superioridade tecnológica militar</strong>, as <strong>doenças desconhecidas pelos nativos</strong>, as <strong>estratégias políticas</strong> e o <strong>incentivo às rivalidades locais possibilitaram subjugar essas populações</strong>;</p></li>
<li><p><strong>Houve muita resistência indígena</strong> e alguns povos mantiveram sua cultura e língua;</p></li></ul></li>
<li><p>Iniciou-se a <strong>racionalização da colonização</strong> no intuito de obter o máximo de lucro com as terras americanas;</p>
<ul><li><p>Uma das principais justificativas foi a <strong>expansão da fé católica</strong>;</p></li>
<li><p>A conversão dos indígenas foi elemento fundamental para o sucesso da colonização;</p></li></ul></li>
<li><p>A principal atividade de exploração nos primeiros séculos de colonização foi a <strong>extração de prata e ouro</strong>;</p>
<ul><li><p>Os espanhóis encontraram as riquíssimas <strong>minas de Potosí</strong> (atual Bolívia) e as <strong>minas de prata no México</strong>;</p></li></ul></li></ul>
<h3>Administração colonial</h3>
<ul><li><p>Baseada no <strong>mercantilismo</strong> (controle do Estado, exportar mais que importar, acumular ouro e prata)</p></li>
<li><p>Conselho Real e Supremo das Índias: nomeava vice-reis e fiscalizava.</p></li>
<li><p>Casa de Contratação: controlava comércio, impostos e riquezas.</p></li>
<li><p><strong>Divisão administrativa em Vice-Reinos</strong>:</p>
<ul><li><p>Nova Espanha;</p></li>
<li><p>Peru;</p></li>
<li><p>Rio de la Plata;</p></li>
<li><p>Nueva Granada;</p></li></ul></li></ul>
<h3>Sociedade</h3>
<p>extremamente <strong>estratificada</strong>;</p>
<ul><li><p>A menor parte da população concentrava riqueza, privilégios e prestígio; a maioria vivia em exploração e desigualdade;</p></li>
<li><p><strong>Mobilidade social difícil</strong>, mas havia exceções.</p></li>
<li><p><strong><em>Chapetones</em></strong>: espanhóis enviados para administrar os territórios coloniais;</p>
<ul><li><p>Ocupavam cargos administrativos e religiosos (vice-reis, governadores, capitães-gerais, arcebispos, bispos).</p></li></ul></li>
<li><p><strong><em>Criollos</em></strong>: descendentes de espanhóis nascidos na América:</p>
<ul><li><p>Menos privilegiados, mas exerciam controle sobre os <strong><em>Cabildos</em></strong> (órgãos com funções semelhantes às câmaras municipais portuguesas);</p></li></ul></li>
<li><p><strong>Mestiços</strong>: descendentes entre espanhóis, indígenas e africanos;</p></li></ul>
<ul><li><p>Não tinham os mesmos privilégios dos <em>criollos</em>, mas também não eram escravizados;</p></li>
<li><p>Principais atividades: artesanato, serviço doméstico ou administração (cargo mais importante possível para eles).</p></li></ul>
<ul><li><p><strong>Indígenas</strong>: submetidos a regimes de trabalho forçado;</p>
<ul><li><p><strong>Regime de <em>encomienda</em></strong>: <strong>o monarca espanhol dava a um título a um fidalgo espanhol</strong>, que passava a ser chamado <em>encomendero</em> e tinha o direito de <strong>cobrar tributos em espécie da população indígena</strong>. Em troca, o monarca ficava encarregado de garantir bem-estar e educação cristã para essa população;</p></li>
<li><p><strong>Regime <em>mita</em></strong>: <strong>pagamento de tributo ao Estado em forma de trabalho compulsório</strong>. Os indígenas eram sorteados a prestar serviço aos espanhóis por uma temporada, no entanto, a atividade era tão exaustiva que muitos acabavam falecendo antes de concluir seu tempo de trabalho;</p>
<ul><li><p>Ocorreu especialmente nas minas de Potosí;</p></li></ul></li></ul></li>
<li><p><strong>Escravizados africanos</strong>: trazidos para substituir a mão de obra indígena em declínio;</p>
<ul><li><p>Não era um número de escravizados tão alto quando comparada à escravização no Brasil, mas era um número significativo;</p></li></ul></li></ul>
<h2>América Inglesa</h2>
<ul><li><p>Interesse da Coroa inglesa: povoamento e desenvolvimento econômico a longo prazo;</p></li>
<li><p><strong>Puritanos perseguidos imigraram para o Norte buscando liberdade religiosa</strong>, <strong>criando colônias como refúgio dos dissidentes</strong>;</p></li>
<li><p>Maior autogoverno comparado ao modelo espanhol;</p></li></ul>
<h3>Diferenças entre o Norte e o Sul</h3>
<ul><li><p><strong>Norte</strong>:</p>
<ul><li><p>Colonos perseguidos religiosamente ou sem emprego; trabalhavam em fazendas, comércio e manufaturas;</p></li>
<li><p>Economia: policultura, pequenas propriedades, pesca, comércio;</p></li>
<li><p>Produção inicial de subsistência evoluiu para o comércio triangular (América, África e Europa);</p></li>
<li><p>Adotaram <strong>trabalho livre, autogoverno e liberdade religiosa</strong>;</p></li></ul></li>
<li><p><strong>Sul</strong>:</p>
<ul><li><p>Colonização voltada à exploração; plantation (grandes fazendas de algodão e fumo; mão de obra escravizada); produção voltada ao mercado externo.</p></li></ul></li></ul>
<h2>Generalizando</h2>
<table data-escapa="sim"><tbody><tr><th><p><strong>Colônia</strong></p></th><th><p><strong>América Espanhola</strong></p></th><th><p><strong>América Inglesa</strong></p></th></tr><tr><td><p><strong>Interesse da Coroa</strong></p></td><td><p>Exploração imediata de riquezas (ouro, prata).</p></td><td><p>Povoamento + desenvolvimento econômico a longo prazo.</p></td></tr><tr><td><p><strong>Justificativa</strong></p></td><td><p>Expansão da fé católica + lucro mercantilista.</p></td><td><p>Refúgio religioso (puritanos) + busca de oportunidades econômicas.</p></td></tr><tr><td><p><strong>Administração</strong></p></td><td><p>Centralizada: Conselho das Índias + Casa de Contratação. Vice-reinos (Nova Espanha, Peru, etc.).</p></td><td><p>Descentralizada: maior autogoverno (assembleias locais).</p></td></tr><tr><td><p><strong>Economia</strong></p></td><td><p>Mineração (ouro e prata). Posteriormente agricultura em haciendas.</p></td><td><p><strong>Norte</strong>: policultura, pesca, manufaturas, comércio triangular. <strong>Sul</strong>: plantation (algodão, tabaco) para exportação.</p></td></tr><tr><td><p><strong>Trabalho</strong></p></td><td><p>Forçado indígena (encomienda, mita) + africanos escravizados.</p></td><td><p><strong>Norte</strong>: trabalho livre predominante, mas também havia escravizados. <strong>Sul</strong>: escravização africana em larga escala.</p></td></tr><tr><td><p><strong>Sociedade</strong></p></td><td><p>Extremamente estratificada: chapetones &gt; criollos &gt; mestiços &gt; indígenas &gt; africanos.</p></td><td><p>Mais mobilidade no Norte (sociedade mais igualitária). Sul: elites agrárias → forte desigualdade social.</p></td></tr><tr><td><p><strong>Religião</strong></p></td><td><p>Catolicismo imposto (conversão forçada dos indígenas).</p></td><td><p>Liberdade religiosa maior (Norte).</p></td></tr></tbody></table>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'expansao-territorial',
  'Expansão territorial',
  'historia',
  'comum',
  'Drogas do sertão, ouro e bandeirantismo — e a distância entre o que os bandeirantes fizeram e o herói que historiadores paulistas construíram no século XX.',
  '<h2>Ciclos econômicos</h2>
<ul><li><p><strong>Após a decadência do ciclo da cana-de-açúcar, novos recursos econômicos foram explorados</strong>, chamadas <strong>drogas do sertão</strong>, um conjunto de especiarias, como guaraná, cacau, canela, castanhas e pimentas, o que garantiu a produtividade da região e aumento da defesa dos territórios com fortificações;</p></li>
<li><p>Com as explorações dos bandeirantes, foram descobertas jazidas de ouro em Minas Gerais, Mato Grosso e Goiás, causando um <strong>novo ciclo econômico em base a mineração de ouro</strong>;</p></li></ul>
<h2 data-corrido="sim">Bandeirantismo:</h2>
<p>explorações dos bandeirantes em bandeiras;</p>
<h3>Principais atividades</h3>
<ul><li><p><strong>Aprisionar indígenas</strong> para escravização;</p></li>
<li><p><strong>Caçar africanos escravizados fugidos</strong> (quilombolas);</p></li>
<li><p><strong>Explorar territórios</strong> em busca de riquezas minerais (ouro, pedras preciosas);</p></li>
<li><p><strong>Ampliar as fronteiras</strong> da colônia para além do que estabelecia o Tratado de Tordesilhas;</p></li></ul>
<ul><li><p>O nome bandeiras foi atribuído do hábito tupi de levantar bandeiras em momentos de declaração de guerras;</p></li>
<li><p>Os ataques bandeirantes eram direcionados aos indígenas e aos crescentes quilombos que se formavam ao longo do período colonial (se proliferaram à medida que o tráfico de africanos no Brasil aumentava);</p></li>
<li><p>Sua imagem foi transformada em símbolo de heroísmo na história nacional por historiadores paulistas no início do século XX, embora sua atuação real tenha sido marcada pela violência e exploração</p></li></ul>
<h3>Feitos na Sociedade</h3>
<ul><li><p>Foram responsáveis pela <strong>expansão territorial do Brasil</strong>, ocupando áreas como Paraná, Goiás, Mato Grosso e Minas Gerais;</p></li>
<li><p>Ajudaram a <strong>consolidar o tráfico interno de escravizados</strong>, sustentando a economia colonial;</p></li>
<li><p>Contribuíram para a <strong>descoberta de jazidas de ouro</strong>, o que fortaleceu economicamente a colônia;</p></li>
<li><p>Foram transformados em <strong>heróis nacionais</strong>;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'o-conceito-de-idade-media',
  'O conceito de idade média',
  'historia',
  'comum',
  'Por que o nome "Idade Média" é um julgamento, e não uma data — mais a Alta (dos francos a Carlos Magno) e a Baixa (cruzadas, guildas, Peste Negra).',
  '<p>período entre a queda de Roma (476) e a queda de Constantinopla (1453), quando a capital bizantina foi conquistada pelo Império turco-otomano;</p>
<ul><li><p>Foi criada quando as principais características davam sinais de esgotamento e <strong>novas formas políticas e sociais emergiam</strong>;</p></li>
<li><p>Para os pensadores da época, o esplendor da Antiguidade greco-romana teria sido interrompido e sucedido por um longo período de baixa produção cultural e predomínio da Igreja Católica;</p>
<ul><li><p>Eles entendiam que entre as luzes da Antiguidade e o Renascimento ocorrido na Idade Moderna teria predominado uma <strong>fase de trevas no cenário europeu: Idade Média</strong>;</p></li></ul></li></ul>
<h2 data-corrido="sim">A Alta Idade Média:</h2>
<p>fase de transição entre o fim do Império Romano e a formação da civilização europeia ocidental;</p>
<ul><li><p>Se inicia no século V e se prolonga até o século X;</p></li>
<li><p>Gradativa ocupação dos territórios romanos pelos povos germânicos;</p></li>
<li><p>Houve o aumento da ruralização, intensificação da ascensão e influência da Igreja Católica;</p></li></ul>
<h3>Reino Franco</h3>
<ul><li><p>Reinos germânicos, em geral, eram instáveis (mobilidade, guerras constantes, governos frágeis).</p></li>
<li><p>Francos conseguiram criar um reino duradouro.</p></li>
<li><p>Estratégia de dominação: expandiram-se pelo Baixo Reno até Bélgica e norte da França.</p></li></ul>
<h4 data-corrido="sim">Clóvis:</h4>
<ul><li><p>Converteu-se ao cristianismo, obtendo apoio da Igreja;</p></li>
<li><p>Expansão até os Pirineus</p></li>
<li><p>Fundação da Dinastia Merovíngia → unificação com idioma, religião, leis e costumes comuns;</p></li></ul>
<ul><li><p>Reis merovíngios ficaram conhecidos como “reis indolentes” (fracos);</p></li>
<li><p><em>Majordomus</em> (prefeitos do palácio) passaram a concentrar o poder político;</p></li></ul>
<h4 data-corrido="sim">Carlos Martel:</h4>
<ul><li><p>Derrotou os árabes na Batalha de Poitiers (732).</p></li>
<li><p>Conter o avanço islâmico e preservou o cristianismo na Europa;</p></li>
<li><p>Ganhou prestígio e <em>status</em> de rei de fato;</p></li></ul>
<h4 data-corrido="sim">Pepino, o Breve:</h4>
<ul><li><p>Depôs o último merovíngio e fundou a Dinastia Carolíngia.</p></li>
<li><p>Derrotou os lombardos e doou terras à Igreja → Patrimônio de São Pedro (origem dos Estados Pontifícios).</p></li></ul>
<h4 data-corrido="sim">Carlos Magno:</h4>
<ul><li><p>Ampliou o território contra saxões, lombardos e muçulmanos;</p></li>
<li><p>Coroado Imperador em 800 pelo papa Leão III → reforço da aliança entre Igreja e poder político.</p></li>
<li><p>Administração:</p>
<ul><li><p>Capital em Aachen.</p></li>
<li><p>Leis capitulares (primeiras escritas no Ocidente medieval).</p></li>
<li><p>Divisão em condados e marcas → vigiadas pelos missi dominici.</p></li>
<li><p>Economia: cunhagem de moedas e missões de conversão rural.</p></li>
<li><p>Cultura: Renascimento Carolíngio → preservação da herança romana, incentivo à educação e cópia de manuscritos.</p></li></ul></li></ul>
<ul><li><p>Após o Tratado de Verdun (843) e as novas invasões, a fragmentação política dividiu a Europa em múltiplos feudos, baseados em relações de suserania e vassalagem;</p>
<ul><li><p>Vikings (normandos), magiares (húngaros) e sarracenos (muçulmanos);</p></li></ul></li></ul>
<h2>A Baixa Idade Média</h2>
<ul><li><p><strong>Sociedade ainda feudal, mas com enfraquecimento da nobreza feudal e das relações servis e fortalecimento da burguesia urbana</strong>;</p></li>
<li><p>Reforço do poder dos reis e centralização política em alguns reinos;</p></li>
<li><p>Retomada e a intensificação das trocas comerciais;</p></li>
<li><p>O surgimento de novas relações econômicas e sociais;</p></li>
<li><p>Cruzadas: expedições militares e religiosas organizadas pela cristandade europeia entre os séculos XI e XIII, para reconquistar a Terra Santa (Jerusalém e arredores) do domínio muçulmano;</p>
<ul><li><p>Em total foram 8, mas só as primeiras 3 tiveram resultados favoráveis para os cristãos;</p></li>
<li><p>Fundação da Ordem dos Cavaleiros Templários;</p></li>
<li><p>Estimulou contatos culturais e comerciais com a Europa, Ásia e Oriente Médio;</p></li>
<li><p>Fortalecimento da burguesia mercantil;</p></li></ul></li>
<li><p>Aumento da produção artesanal em <strong>guildas</strong> e <strong>corporações de ofício</strong> (associações de artesãos e comerciantes);</p>
<ul><li><p>Crises:</p>
<ul><li><p><strong>Guerra dos Cem Anos</strong>: motivada pela crise de sucessão ao trono francês e pelas instabilidades políticas na região;</p></li>
<li><p><strong>Peste Negra</strong>: epidemia de peste bubônica originária da China que chegou a matar um terço da população europeia;</p></li></ul></li>
<li><p>Crise na agricultura e fome entre as populações;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'reforma-protestante',
  'Reforma Protestante',
  'historia',
  'comum',
  'As oito causas, os dois precursores queimados, e as quatro reformas — luterana, anabatista, calvinista e anglicana — com a resposta de Trento.',
  '<p>nome dado pela historiografia para o momento histórico em que houve a proliferação de igrejas cristãs que não se submeteram ao domínio papal;</p>
<h2>Causas</h2>
<h3 data-corrido="sim">A venda de indulgências:</h3>
<p>remissão de penas temporais pelos pecados perdoados pela confissão;</p>
<ul><li><p>Segundo a doutrina católica, o perdão pelos pecados cometidos por um fiel é obtido por meio da confissão. Porém, mesmo após o perdão, resta a pena temporal (o fiel deve em vida à Justiça Divina). Para melhorar sua pena, eram concedidas indulgências, onde poderia se redimir durante sua vida terrena;</p></li></ul>
<h3 data-corrido="sim">A simonia:</h3>
<p>compra ou venda ilícita de coisas espirituais (como indulgências e sacramentos) ou temporais ligadas às espirituais (como os benefícios eclesiásticos);</p>
<h3 data-corrido="sim">Condenação da usura:</h3>
<p>cobrança excessiva de juros em empréstimos ou a estipulação de lucros desproporcionais;</p>
<h3 data-corrido="sim">Ambição pelas terras e bens da Igreja:</h3>
<p>nobres e governantes desejavam confiscar propriedades e riquezas eclesiásticas.</p>
<h3 data-corrido="sim">Críticas aos abusos da Igreja Católica:</h3>
<p>o luxo, a corrupção e o distanciamento espiritual do clero geram indignação;</p>
<h3 data-corrido="sim">Humanismo renascentista:</h3>
<p>o pensamento crítico e a valorização da razão levaram as pessoas a questionar dogmas religiosos;</p>
<h3 data-corrido="sim">Imprensa e difusão de ideias:</h3>
<p>a circulação de panfletos e traduções da Bíblia com a <strong>invenção da imprensa de Gutenberg</strong> facilitou a divulgação das críticas e das novas doutrinas;</p>
<h2>Antecedentes da Reforma protestante</h2>
<p>as primeiras propostas de reformas na organização da Igreja Católica foram formuladas entre finais do século XIV e início do XV, com doutrinas propagadas por:</p>
<ul><li><p><strong>John Wyclif</strong> (1330 - 1384): criticava a venda de indulgências pela Igreja Católica, afirmando que a salvação era obtida por meio da fé em Deus e não por meios econômicos (não foi punido em vida pelas suas ideias, mas foi condenado por heresia após sua morte e seu corpo foi desenterrado e queimado).</p></li>
<li><p><strong>Jan Huss</strong> (1369 - 1415): retomou as críticas formuladas por Wyclif e defendeu que a autoridade da Bíblia estava acima da tradição da Igreja e da palavra do Papa. Essas propostas não agradaram as autoridades católicas e Huss morreu queimado na fogueira.</p></li></ul>
<h2>Reforma Luterana na Alemanha</h2>
<ul><li><p>Liderada pelo monge agostiniano <strong>Martinho Lutero</strong>;</p></li>
<li><p>Lutero fixou na porta da Igreja que ele era responsável em Wittenberg, <strong>95 teses</strong> que <strong>reclamavam dos poderes do papa e alguns dogmas católicos</strong>;</p></li>
<li><p>Lutero estruturou sua doutrina da seguinte forma:</p>
<ul><li><p>Justificação pela fé;</p></li>
<li><p>Livre interpretação da Bíblia;</p></li>
<li><p>Dois sacramentos: batismo e Eucaristia;</p></li>
<li><p>Abolição das imagens;</p></li>
<li><p>Tradução da Bíblia;</p></li>
<li><p>Culto no idioma nacional;</p></li>
<li><p>Fim do celibato clerical;</p></li></ul></li>
<li><p><strong>Dieta de Worms</strong>: assembleia convocada pelo imperador Carlos V para condenar as ideias de Lutero, declarado herege e fora da lei;</p>
<ul><li><p>Foi acolhido pela nobreza alemã e refugiado traduziu a Bíblia para o alemão;</p></li></ul></li></ul>
<h2>Movimento anabatista</h2>
<ul><li><p>Liderado por <strong>Thomas Münzer</strong>;</p></li>
<li><p>Batismo na idade adulto;</p></li>
<li><p>Igualdade entre camponeses e nobres e acesso à terra;</p></li>
<li><p>Foi severamente criticado por Lutero;</p></li>
<li><p>O movimento foi contido e Thomas foi preso, torturado e queimado na fogueira;</p></li></ul>
<h2>Reforma calvinista</h2>
<ul><li><p>Liderada por <strong>João Calvino</strong>;</p></li>
<li><p><strong>Predestinação absoluta</strong>: as pessoas já nasciam com um destino traçado por Deus desde o nascimento até a eternidade;</p></li>
<li><p><strong>Moral rígida</strong>;</p></li>
<li><p><strong>Enriquecimento pelo trabalho como sinal de salvação</strong>;</p></li></ul>
<h2>Anglicanismo na Inglaterra</h2>
<ul><li><p>O rei da Inglaterra <strong>Henrique VIII</strong> queria divorciar-se de sua esposa Catarina de Aragão, mas seu pedido foi recusado pelo papa;</p></li>
<li><p>Assim, o monarca rompe ligações com a Igreja por meio do <strong>Ato de Supremacia</strong>, documento que confirmava a soberania do rei sobre a Igreja e funda a Igreja da Inglaterra, sendo ele o chefe religioso;</p></li></ul>
<h2>Contrarreforma</h2>
<ul><li><p>A Igreja passou a reavaliar muitos de seus dogmas, doutrinas e práticas. Em 1545, o alto clero se reuniu no <strong>Concílio de Trento</strong>;</p>
<ul><li><p>Principais decisões tomadas: <strong>afastamento dos clérigos corruptos e o fim da venda de indulgências</strong>;</p></li>
<li><p><strong>Reafirmação de alguns dogmas católicos tradicionais</strong>, como o culto à Virgem Maria e aos santos, e reforçou a autoridade do papal. Manteve também o latim como língua litúrgica.</p></li>
<li><p><strong>Criação do Índex</strong>, uma lista de livro cujos conteúdos contrariavam a doutrina católica;</p></li>
<li><p><strong>A universalização do Tribunal do Santo Ofício</strong>: criado na Idade Média e tinha a função de investigar e julgar acusados de heresia, ou seja, quem contrariava algum dogma da igreja;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'a-revolucao-cientifica-sec-xvi-xviii',
  'A Revolução Científica (séc. XVI-XVIII)',
  'historia',
  'comum',
  'Método experimental contra dogma: Copérnico tira a Terra do centro, Galileu aponta o telescópio, Bacon escreve a regra.',
  '<ul><li><p>Método experimental X Dogmas (verdades inquestionáveis)</p></li>
<li><p><strong>Antropocentrismo</strong>: humano no centro das investigações e correntes de pensamento;</p></li>
<li><p>Nicolau Copérnico: astrônomo e matemático polonês;</p>
<ul><li><p>Conhecimento matemático permitiu chegar ao <strong>heliocentrismo</strong>: Sol ao centro do universo;</p></li></ul></li>
<li><p>Galileo Galilei: astrônomo, físico e engenheiro florentino;</p>
<ul><li><p>Observação direta e prática da realidade.</p></li>
<li><p>Olhou para o céu com o <strong>telescópio</strong>;</p></li>
<li><p>Corroborou o heliocentrismo;</p></li></ul></li>
<li><p>Francis Bacon: estabeleceu método científico com base na <strong>observação</strong> e na <strong>experimentação</strong>;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'revolucao-francesa',
  'Revolução Francesa',
  'historia',
  'comum',
  'A sociedade estamental em pirâmide, os Estados Gerais e a briga do voto — jacobinos contra girondinos, até a Bastilha e o Grande Medo.',
  '<p>transição da Idade Média à Contemporânea;</p>
<h2>França pré-revolucionária</h2>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/historia/piramide-dos-tres-estados.webp" alt="Pirâmide da sociedade francesa do Antigo Regime em três faixas: no topo, estreito, o Clero; no meio, a Nobreza; na base, larga, Burguesia, Camponeses e Sans-culottes." style="width:42%" data-largura="42%"></figure>
<h3>Divisão social da França no Antigo Regime</h3>
<ul><li><p><strong>1° Estado</strong>: Alto e Baixo Clero;</p></li>
<li><p><strong>2° Estado</strong>: Palaciana, provinciana e tragada;</p></li>
<li><p><strong>3° Estado</strong>: Alta e Baixa burguesia, camponeses e marginalizados;</p></li></ul>
<ul><li><p>Sociedade estamental;</p></li>
<li><p>Privilégios ao Primeiro e Segundo Estado;</p></li>
<li><p>Crise econômica;</p></li></ul>
<h2 data-corrido="sim">Assembleia dos Estados Gerais:</h2>
<p>assembleia com a participação dos 3 Estados</p>
<ul><li><p>A burguesia defendia o voto individual, pois tinha maioria e venceriam;</p></li>
<li><p>Isso não foi atendido, então o 3° Estado solicitou uma <strong>Assembleia Nacional Constituinte</strong>;</p>
<ul><li><p>Objetivo: restringir poderes do rei e ampliar direitos políticos.</p></li>
<li><p>Grupos políticos:</p>
<ul><li><p><strong>Jacobinos</strong>: pequena burguesia; desejavam reformas profundas na sociedade;</p></li>
<li><p><strong>Girondinos</strong>: alta burguesia; buscavam liberdade econômica sem reformas sociais;</p></li></ul></li>
<li><p>O rei dissolve a Assembleia, o que desencadeia a Revolução.</p></li>
<li><p>Tomada da Bastilha;</p></li>
<li><p>Período do Grande Medo: revoltas no campo e invasões de castelos.;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'revolucao-industrial',
  'Revolução Industrial',
  'historia',
  'comum',
  'Por que a Inglaterra primeiro, o que a máquina a vapor mudou, e o preço social: jornada longa, trabalho infantil e controle do tempo.',
  '<p>conjunto de transformações que possibilitou a mecanização da produção;</p>
<ul><li><p>Série de transformações políticas, econômicas e sociais;</p></li>
<li><p>Divisão da sociedade em burguesia e proletariado;</p></li></ul>
<h2>Pioneirismo inglês</h2>
<ul><li><p>Capitais acumulados;</p></li>
<li><p>Controle do campo;</p></li>
<li><p>Supremacia da marinha;</p></li>
<li><p>Monarquia parlamentar;</p></li>
<li><p>Posição geográfica favorável;</p></li>
<li><p>Fontes de energia;</p></li></ul>
<h2>Bases da revolução industrial</h2>
<ul><li><p>Crescimento populacional: na Inglaterra a população dobra num intervalo de 100 anos;</p></li>
<li><p>Desenvolvimento da indústria têxtil e siderúrgica, com algodão e ferro, respectivamente.</p></li>
<li><p>Novas fontes de energia, como o carvão.</p></li></ul>
<h2>1° Fase</h2>
<ul><li><p>Surge na Inglaterra;</p></li>
<li><p>Destaca-se na produção de tecidos e metais, especificamente o ferro.</p></li>
<li><p>Máquinas a vapor — carvão;</p></li></ul>
<h2>Transformações e problemas sociais</h2>
<ul><li><p>Sociedade de classes;</p></li>
<li><p>Salários baixos e longas jornadas de trabalho;</p></li>
<li><p>Trabalho infantil e acidentes frequentes;</p></li>
<li><p>Poluição e crescimento urbano;</p></li>
<li><p>Controle do tempo;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'era-napoleonica',
  'Era Napoleônica',
  'historia',
  'comum',
  'Os três períodos — Consulado, Império e Cem Dias — com o Bloqueio Continental que trouxe a corte para o Brasil e a campanha da Rússia que virou o jogo.',
  '<h2>Dividida em três períodos</h2>
<h3>Consulado (1799–1804)</h3>
<ul><li><p>Napoleão assume o poder através do golpe de 18 de Brumário, concentrando o poder como Primeiro Cônsul;</p></li>
<li><p><strong>Criação do Código Civil Napoleônico</strong>;</p>
<ul><li><p>Igualdade jurídica e liberdade civil (fim dos privilégios feudais);</p></li>
<li><p>Consolidação das conquistas burguesas da Revolução Francesa;</p></li></ul></li>
<li><p><strong>Criação dos liceus</strong>: ensino técnico, laico e meritocrático (liceus);</p></li>
<li><p>Incentivo a indústria e criação do Banco da França;</p></li></ul>
<h3>Império Napoleônico (1804–1815)</h3>
<ul><li><p>Napoleão se autoproclama Imperador: forte apoio popular;</p></li>
<li><p><strong>Expansão militar e política sobre a Europa</strong>;</p></li>
<li><p>Criação de Estados-satélites governados por parentes;</p></li>
<li><p><strong>Bloqueio continental</strong>: política que proibia os países europeus de comercializar com o Reino Unido;</p>
<ul><li><p>Objetivo: destruir a economia britânica;</p></li>
<li><p>Resultado: crise econômica na Europa e contrabando generalizado;</p></li>
<li><p>Portugal desobedece: invasão francesa (1807) e fuga da Corte portuguesa para o Brasil;</p></li></ul></li>
<li><p><strong>Guerras Napoleônicas</strong>: conflitos sucessivos contra coalizões europeias lideradas pela Inglaterra;</p></li>
<li><p>Declínio:</p>
<ul><li><p><strong>Resistência dos povos conquistados</strong> (movimentos nacionalistas);</p></li>
<li><p>Desgaste econômico e militar;</p></li>
<li><p><strong>Campanha fracassada na Rússia (1812): ponto de virada</strong>;</p>
<ul><li><p>Causa: retirada russa do Bloqueio Continental;</p></li>
<li><p>Estratégia russa de “terra arrasada”: destruição de recursos antes da invasão;</p></li>
<li><p>Frio e fome devastam o exército francês;</p></li></ul></li>
<li><p><strong>Primeira Saída de Napoleão (1814)</strong>: derrotado pela coalizão europeia, abdica e é exilado na Ilha de Elba.</p>
<ul><li><p>Luís XVIII (irmão de Luís XVI) assume: restauração da monarquia;</p></li></ul></li></ul></li></ul>
<h3>Governo dos Cem Dias (1815)</h3>
<ul><li><p>Napoleão retorna da Ilha de Elba e tenta restaurar glórias militares e reformar o império;</p></li>
<li><p>Derrotado definitivamente em Waterloo (1815);</p></li>
<li><p>Exilado em Santa Helena, onde morre (1821);</p></li>
<li><p><strong>Congresso de Viena (1815)</strong>:</p>
<ul><li><p>Objetivo: restaurar o Antigo Regime e conter o liberalismo;</p></li>
<li><p>Princípios: legitimidade, restauração e equilíbrio europeu;</p></li>
<li><p><strong>Formação da Santa Aliança (Rússia, Áustria e Prússia)</strong>: defesa do absolutismo;</p></li>
<li><p>Reforço do conservadorismo e oposição às independências e revoluções;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'congresso-de-viena-1814-1815',
  'Congresso de Viena (1814–1815)',
  'historia',
  'comum',
  'Restauração, legitimidade e equilíbrio: os três princípios que redesenharam o mapa europeu, mais a Santa Aliança e as sete mudanças territoriais.',
  '<p>reunião das principais potências europeias após a derrota de Napoleão (Inglaterra, Reino da Prússia, Império Austríaco e Império Russo);</p>
<h2>Objetivo</h2>
<ul><li><p>Reorganizar o mapa político da Europa após as guerras napoleônicas.</p></li>
<li><p>Conter ideias liberais e revolucionárias e restaurar as monarquias.</p></li></ul>
<ul><li><p>Durante o governo de cem dias de 1815, o congresso de Viena parou por um tempo, mas depois da derrota de Napoleão na batalha de Waterloo, o congresso voltou, trazendo como base, 3 princípios:</p>
<ul><li><p>Restauração: restaurar as monarquias derrubadas pela Revolução Francesa e por Napoleão;</p></li>
<li><p>Legitimidade: retomar as fronteiras da Europa anteriores a 1789;</p></li>
<li><p>Equilíbrio: manter equilíbrio militar entre as potências para evitar novas guerras.</p></li></ul></li>
<li><p>Para conter movimentos revolucionários de caráter liberal, foi organizada a chamada Santa Aliança: Aliança militar das monarquias europeias para reprimir movimentos liberais e revolucionários;</p></li></ul>
<h2>Principais mudanças na Europa</h2>
<ul><li><p>O Reino dos Países Baixos incorporou a Bélgica;</p></li>
<li><p>A Rússia expandiu territórios para Polônia, Finlândia e Bessarábia;</p></li>
<li><p>A Áustria ganhou territórios na Itália e nos Bálcãs;</p></li>
<li><p>A Prússia anexou partes da Saxônia, Polônia e regiões do Reno;</p></li>
<li><p>A Suíça tornou-se um Estado neutro;</p></li>
<li><p>Formação da Confederação Germânica com 39 Estados alemães;</p></li>
<li><p>Resumindo: restaurou as monarquias, reorganizou o mapa político da Europa, criou a Confederação Germânica e a Santa Aliança, além de buscar manter o equilíbrio de poder para evitar novas guerras;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'revolucao-de-1830',
  'Revolução de 1830',
  'historia',
  'comum',
  'O liberalismo chega ao poder pela burguesia: a Bélgica se separa, a Polônia é esmagada, Carlos X cai — e 1848 traz a Primavera dos Povos.',
  '<ul><li><p>Na Europa, no início do século XIX, as ideias liberais, promovidas pelo Iluminismo e difundidas por Napoleão, agradavam cada vez mais à burguesia;</p>
<ul><li><p>pregavam o fim da interferência do Estado na vida particular e pública</p></li>
<li><p>combatiam o mercantilismo</p></li></ul></li>
<li><p>As ideias liberais expandiram e muitos monarcas tiveram seus poderes limitados</p></li>
<li><p>A burguesia se organizou em partidos políticos e queriam manifestar seus interesses</p></li>
<li><p>A burguesia, que já tinha poder econômico, passou a exercer maior pressão sobre os governos e conseguiu se aproximar mais do poder político.</p></li>
<li><p>Assim, inspirados pela Revolução Francesa, muitas revoluções ocorreram na Europa, sobretudo na França</p></li></ul>
<h2>Motivações</h2>
<ul><li><p>O crescimento das ideias liberais ( limitar o poder do rei e dar mais participação política à burguesia);</p></li>
<li><p>Insatisfação com o absolutismo;</p></li>
<li><p>Más condições de vida da população (pobreza, desemprego, baixos salários e crises agrícolas);</p></li></ul>
<h2>Consequências</h2>
<ul><li><p>As revoluções ocorridas por volta de 1830 afetaram quase toda a Europa;</p></li>
<li><p>A Bélgica tornou-se independente da Holanda, estabelecendo uma monarquia liberal;</p></li>
<li><p>Na Europa Central e Oriental, esse processo revolucionário não foi tão bem-sucedido;</p></li>
<li><p>Na Polônia, a independência foi proclamada, porém a rebelião foi esmagada pelos russos;</p></li>
<li><p>Na França, as revoltas levaram à abdicação de Carlos X em 1830;</p></li>
<li><p>Luís Filipe de Orleans foi coroado e ficou conhecido como “o rei burguês”;</p></li>
<li><p>As revoluções da década de 1830 refletiram o forte descontentamento das classes populares;</p></li></ul>
<h2 data-corrido="sim">Primavera dos Povos (1848):</h2>
<p>foi uma série de revoluções populares que se espalharam pela Europa. Essas revoltas aconteceram por causa da crise econômica, das más condições de vida da população e falta de direitos/participações políticas, tinham ideias liberais, nacionalistas e sociais, com o objetivo de mudar os governos e ampliar a participação política.</p>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'crise-colonial',
  'Crise colonial',
  'historia',
  'comum',
  'O enfraquecimento do domínio português depois da abertura dos portos — e a Revolução Pernambucana de 1817, republicana e separatista.',
  '<p>enfraquecimento do controle de Portugal sobre o Brasil;</p>
<ul><li><p>Causada pelo avanço das ideias de liberdade e autonomia, contribuindo para a Independência de 1822;</p></li>
<li><p>Em palavras mais simples, o poder que Portugal tinha sobre a colônia que era o Brasil enfraqueceu muito quando o Brasil começou a ganhar mais autonomia e liberdade (como por exemplo com a abertura dos portos em 1808), com isso surgiram ideias mais liberais, o que também influenciou a independência;</p></li></ul>
<h2 data-corrido="sim">Revolução Pernambucana (1817):</h2>
<p>movimento republicano contra o domínio de Portugal;</p>
<ul><li><p>Motivos: aumento de impostos e a crise econômica;</p>
<ul><li><p>EUA domina o comércio de algodão;</p></li>
<li><p>Antilhas domina o comércio de açúcar;</p></li>
<li><p>Essas eram nossas principais fontes de renda;</p></li></ul></li>
<li><p>Caráter separatista;</p></li>
<li><p>Republicano;</p></li>
<li><p>Influências: independência dos EUA e ideias iluministas;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'periodo-joanino-1808-a-1821',
  'Período joanino (1808 a 1821)',
  'historia',
  'comum',
  'A corte no Rio: abertura dos portos, Banco do Brasil, Reino Unido a Portugal e Algarves — e a solução dinástica que deixou D. Pedro como regente.',
  '<p>intervalo em que D. João VI esteve no Brasil;</p>
<ul><li><p>A família real portuguesa vem ao Brasil fugindo da invasão de Portugal por Napoleão;</p></li></ul>
<h2>Contexto europeu</h2>
<ul><li><p>Fim da era Napoleônica (temos aqui, o congresso de Viena, que mudou a Europa em muitos aspectos, como visto anteriormente).</p></li>
<li><p>A corte portuguesa se recusa a voltar para Portugal e eleva o Brasil para Reino Unido a Portugal e Algarves (1815).</p></li>
<li><p>A corte portuguesa começa a pressionar a volta</p>
<ul><li><p>houveram revoluções, como a Revolução liberal do Porto (1820) e a pressão por parte da Elite, como consequência, a família real volta</p></li></ul></li>
<li><p>D. Pedro fica como príncipe regente, e isto foi uma solução dinástica:</p>
<ul><li><p>A solução encontrada foi deixar o príncipe como regente do Brasil para manter o controle político do território mesmo com a volta do rei para Portugal. Assim, o príncipe governaria em nome do rei, garantindo que o Brasil continuasse ligado à monarquia portuguesa e evitando revoltas ou a perda do poder português na colônia;</p></li></ul></li></ul>
<h2>Impactos econômicos</h2>
<ul><li><p>Com a <strong>abertura dos portos</strong> em 1808, o Brasil <strong>rompeu com o Pacto Colonial</strong>, sendo agora permitido comercializar com outras nações amigas, como o caso da Inglaterra.</p></li>
<li><p><strong>Tratado de navegação e comércio</strong> (1810) entre Inglaterra e Portugal, o que garantiu benefícios fiscais;</p></li>
<li><p><strong>Criação do Banco do Brasil</strong>;</p></li>
<li><p><strong>Casa da moeda</strong>;</p></li>
<li><p><strong>Primeiro Jornal</strong> “Jornal Gazeta do Rio de Janeiro”;</p></li>
<li><p><strong>Missão Artística Francesa</strong>: impulsionou a economia ao modernizar a infraestrutura urbana do Rio de Janeiro com o estilo neoclássico e introduzir o ensino técnico/artístico superior;</p></li>
<li><p><strong>Conquista de Territórios:</strong> Cisplatina e Guiana Francesa;</p></li></ul>'
) on conflict (slug) do nothing;

-- As cinco revoltas vêm de DOIS documentos: Cabanagem, Farrapos e Malês estão
-- nos dois; Sabinada e Balaiada só no `PR2G4`. Ver o cabeçalho.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'periodo-regencial-1831-1840',
  'Período regencial (1831–1840)',
  'historia',
  'comum',
  'As quatro regências, do governo de três meses ao regresso conservador — e as cinco revoltas que a instabilidade produziu, até o Golpe da Maioridade.',
  '<p>fase do Brasil Império em que o país foi governado por regentes, após a abdicação de D. Pedro I;</p>
<h2>Regências</h2>
<ul><li><p><strong>Trina Provisória (1831)</strong>: governo emergencial de três meses logo após a abdicação;</p></li>
<li><p><strong>Trina Permanente (1831-1834)</strong>: período de consolidação dos interesses da elite dominante;</p>
<ul><li><p>Criação da Guarda Nacional (1831);</p></li>
<li><p><strong>Ato Adicional:</strong></p>
<ul><li><p>Mudança de eleição de três regentes para um só;</p></li>
<li><p><strong>Criação de Assembleias Legislativas Provinciais</strong>: maior autonomia às províncias;</p></li></ul></li></ul></li>
<li><p><strong>Una de Padre Feijó (1835-1837)</strong>: marcada pelo avanço liberal e início de grandes revoltas;</p></li>
<li><p><strong>Una de Araújo Lima (1837-1840)</strong>: “regresso conservador” com maior centralização do poder;</p></li></ul>
<h2 data-corrido="sim">Revoltas:</h2>
<p>causadas pela instabilidade política;</p>
<ul><li><p><strong>Cabanagem (1835-1840)</strong>: ocorrida na província do Grão-Pará, recebeu esse nome porque boa parte dos integrantes dessa revolta moravam em cabanas e eram chamados de cabanos. Índios, mestiços e escravos buscavam melhores condições de vida;</p></li>
<li><p><strong>Guerra dos Farrapos (1835-1845)</strong>: conflito separatista ocorrido no sul do país. Foi uma revolta mobilizada por grandes proprietários de terra. Terminou com acordo de paz</p></li>
<li><p><strong>Revolta dos Malês (1835)</strong>: teve como fator motivador o fato de escravizados de origem islâmica querem sua liberdade religiosa;</p></li>
<li><p><strong>Sabinada (1837-1838)</strong>: liderada por Francisco Sabino, aconteceu por conta da insatisfação da população com a falta de autonomia política e administrativa da Bahia e também pelo recrutamento obrigatório para os baianos em função da Guerra dos Farrapos;</p></li>
<li><p><strong>Balaiada (1838-1841)</strong>: ocorrida na província do Maranhão, foi mobilizada através da reivindicação por melhores condições de vida da população. artesãos e escravos;</p></li></ul>
<ul><li><p>O período terminou com o <strong>Golpe da Maioridade</strong> em 1840, quando <strong>D. Pedro II foi declarado maior de idade aos 14 anos</strong> para pacificar o país;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'segundo-reinado',
  'Segundo reinado',
  'historia',
  'comum',
  'O parlamentarismo às avessas de D. Pedro II, as leis que adiaram a abolição uma a uma, e o café que pagou as ferrovias e trouxe o imigrante.',
  '<p>período do Brasil Império governado por D. Pedro II;</p>
<ul><li><p><strong>Iniciou com o Golpe da Maioridade</strong> (antecipação da ascensão do imperador aos 14 anos);</p></li></ul>
<h2>Grupos políticos</h2>
<ul><li><p><strong>Partido conservador</strong>: governo forte centralizado na figura do Imperador e na capital Rio de Janeiro;</p>
<ul><li><p>A autoridade central era essencial para manter a ordem e a unidade territorial;</p></li></ul></li>
<li><p><strong>Partido liberal:</strong> descentralização política e maior autonomia para as províncias e municípios;</p>
<ul><li><p>Críticos do excessivo poder pessoal do imperador e favoráveis à liberdade de imprensa e de assembleia;</p></li></ul></li></ul>
<h2 data-corrido="sim">Parlamentarismo às Avessas:</h2>
<p>sistema político do Segundo Reinado onde D. Pedro II, usando Poder Moderador, nomeava o Presidente do Conselho de Ministros (primeiro-ministro) antes das eleições;</p>
<ul><li><p>Diferente do modelo inglês, <strong>o imperador detinha controle superior</strong>, alternando conservadores e liberais para garantir estabilidade política;</p></li></ul>
<h2>Questões abolicionistas</h2>
<p>Inglaterra indica uma pressão para abolição da escravidão 1831 (para inglês ver);</p>
<ul><li><p><strong>Lei Eusébio de Queirós (1850)</strong>: primeira lei abolicionista do Segundo Reinado;</p>
<ul><li><p>Promulgada sob forte pressão inglesa, que chegou a autorizar a marinha britânica a aprisionar navios negreiros (Bill Aberdeen de 1845);</p></li>
<li><p>Proibiu definitivamente o tráfico intercontinental de africanos para o Brasil. Suas consequências foram imediatas e profundas;</p></li>
<li><p>Valorização do tráfico interno;</p></li></ul></li>
<li><p>O governo imperial adotou uma estratégia de abolição lenta e gradual, por meio de três leis principais:</p>
<ul><li><p><strong>Lei do ventre livre</strong>: filhos de escravos seriam cuidados por seus senhores até seus 8 anos de idade (construção de escolas públicas);</p></li>
<li><p><strong>Lei do Sexagenário</strong>: escravos a partir de 60 anos são livres;</p>
<ul><li><p>A maioria nem chega a essa idade;</p></li></ul></li>
<li><p><strong>Lei Aurea</strong>: proibição total da escravidão;</p>
<ul><li><p>Princesa Isabel assinou a lei, mas não previa medidas para os ex escravos entrarem na sociedade;</p></li></ul></li></ul></li></ul>
<h2>Economia</h2>
<p>o café consolidou-se como o motor da economia, trazendo riqueza e estrutura;</p>
<ul><li><p>Impulsionou a <strong>construção das primeiras ferrovias e portos</strong> no Vale da Paraíba e no Oeste Paulista;</p></li>
<li><p>Pelas questões abolicionistas, houve um <strong>grande incentivo à imigração europeia</strong> para aumentar a <strong>mão de obra nas lavouras</strong>;</p>
<ul><li><p><strong>Sistema de parcerias</strong>: os fazendeiros financiavam a vinda dos imigrantes e eles deviam pagar a dívida como o trabalho na colheita;</p>
<ul><li><p>Muitos fazendeiros agiam como donos de escravos, restringindo a liberdade dos imigrantes, impondos toques de recolher e utilizando agressão física;</p></li>
<li><p>Substituída pelo <strong>colonato</strong>: trabalho assalariado subvencionado pelo Estado;</p></li></ul></li></ul></li>
<li><p><strong>Lei de Terras</strong>: terras públicas (devolutas) só poderiam ser adquiridas por compra, e não mais por posse ou doação;</p>
<ul><li><p>Visava restringir o acesso à propriedade privada;</p></li></ul></li>
<li><p>Era Mauá: surto de industrialização e modernização urbana (iluminação a gás, telégrafo e estaleiras) entre 1850 e 1870, liderada pelo Barão de Mauá;</p>
<ul><li><p>Financiada pelos ganhos com o comércio do café;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'estados-unidos-no-sec-xix',
  'Estados Unidos no séc. XIX',
  'historia',
  'comum',
  'Marcha para o oeste, Doutrina Monroe e Destino Manifesto — a Guerra Civil que acabou com a escravidão sem acabar com o racismo, e o Big Stick.',
  '<ul><li><p>Expansão territorial: marcha para o oeste (tratado de Paris), guerra com o México, territórios como Louisiana, Flórida, alasca e o sudoeste;</p></li>
<li><p>Doutrina Monroe: continente americano sem intervenção europeia e vice-versa;</p>
<ul><li><p>“América aos americanos”;</p></li></ul></li>
<li><p>Destino Manifesto: crença que eles tinham uma missão divina de ocupar os demais territórios(genocidio indigena, exploração de imigrantes);</p>
<ul><li><p>Brancos, Protestantes, Anglo Saxônicos (W.A.S.P);</p></li></ul></li>
<li><p>Questão da escravidão:</p>
<ul><li><p>O norte já havia abdicado a escravidão e tinha indústrias e trabalho assalariado;</p></li>
<li><p>O sul utilizava a monocultura e a mão de obra escrava;</p></li></ul></li>
<li><p>Racismo: negros eram tidos como inferiores biologicamente, não podiam ser alfabetizados.</p>
<ul><li><p>Nesse contexto Abraham Lincoln vence a eleição;</p></li></ul></li>
<li><p>Guerra Civil: causa principal foi a escravidão, o norte venceu. No fim da reconstrução foi instalado as leis Jim Crow;</p>
<ul><li><p>Acabou com a escravidão, mas não com o racismo;</p></li>
<li><p>Ficou ainda mais intensificado, levando a separação social (darwinismo social);</p></li></ul></li>
<li><p>Corolário Roosevelt: política agressiva para dominar outros países da américa;</p>
<ul><li><p>Intervenção econômica nos países como caribe América Central e sul e Hawai (Big Stick) têm consequências até hoje;</p></li>
<li><p>Influência do destino manifesto, agora para todo o continente;</p></li>
<li><p>Tratava latino-americanos como incapazes de governar;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

-- Dois deslizes de digitação do documento entram como estão (decisão 9c): um "t"
-- solto no fim da linha da extinção das capitanias, e "(1755)e a" sem espaço.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'administracao-e-governo-de-pombal',
  'Administração e governo de Pombal - SOMENTE as reformas pombalinas',
  'historia',
  'comum',
  'O despotismo esclarecido aplicado à colônia: a expulsão dos jesuítas, a derrama, a capital que muda para o Rio e as duas companhias de comércio.',
  '<ul><li><p><strong>Marquês de Pombal</strong> (1750 - 1777), se tornou Secretário do Estado dos Negócios Interiores do Reino, ou seja, todos os assuntos econômicos, políticos e sociais da Coroa Portuguesa estavam sob seu controle;</p></li>
<li><p>Ele aboliu as relações de escravidão dentro de Portugal e proibiu a distinção de "cristãos novos” e "cristãos velhos". Seu governo também promoveu a reformulação da Universidade de Coimbra, visando uma formação mais ampla e mais técnica;</p></li>
<li><p>O governo constituiu em 1768, a <strong>Real Mesa Censória</strong>, cuja função era controlar todas as publicidades portuguesas, como: livros, panfletos e pesquisas científicas;</p>
<ul><li><p>Objetivo: perseguir e constranger seus opositores políticos, como a Companhia de Jesus, que defendia a submissão da figura do rei à dimensão espiritual da Igreja Católica.</p></li></ul></li>
<li><p>Pombal considerava a <strong>Companhia de Jesus</strong> um <strong>empecilho ao processo de racionalização e centralização da economia e do governo</strong>. Essa companhia foi expulsa de todo o território português por decreto (1759).</p>
<ul><li><p>As funções educacionais exercidas pelos jesuítas foram atribuídas às chamadas “aulas régias”, oferecidas por profissionais autônomos que prestariam serviços educacionais (essas missões foram deixadas sob o comando de pessoas de confiança do rei);</p></li>
<li><p>Essa medida gerou muitos conflitos na América portuguesa, pois os jesuítas foram um obstáculo à escravidão dos nativos, mas controlavam o trabalho indígena na exploração das drogas do sertão.</p></li></ul></li>
<li><p>Pombal também promoveu várias <strong>reformas</strong> que visavam <strong>fortalecer o controle sobre a economia colonial</strong>. O objetivo principal era ampliar a produção colonial para arrecadar mais impostos, especialmente no contexto da crise da produção aurífera;</p>
<ul><li><p>Um exemplo disso foi a criação (1751) de uma meta mínima de ouro que deveria ser coletada pelas Casas de Fundição. Caso as <strong>comarcas (tipo de divisão territorial comum na Península Ibérica)</strong> não atingissem a meta, seria colocada em prática a <strong>derrama</strong>, imposto que determinava aos habitantes da região mineradora complementar a diferença entre o que foi arrecadado e o valor mínimo determinado pela Coroa.</p></li></ul></li>
<li><p>Além da derrama, Marquês de Pombal tomou outras duas providências administrativas que tiveram grande impacto na sociedade colonial.</p>
<ul><li><p><strong>Extinção do regime das capitanias hereditárias</strong> (1759), dando mais eficiência para a ação centralizadora do governo pombalino sobre o território colonial. t</p></li>
<li><p><strong>Transferência da capital</strong> de Salvador para o RJ (1763), para aumentar o controle sobre a dinâmica econômica do Centro-Sul.</p></li></ul></li>
<li><p>Houve a criação de duas companhias mercantis, que foram determinantes na diversidade econômica colonial:</p>
<ul><li><p><strong>Companhia Geral do Comércio do Grão-Pará e Maranhão</strong> (1755)e a <strong>Companhia Geral do Comércio de Pernambuco e da Paraíba</strong> (1759)- ambas expressam a síntese do despotismo esclarecido: dinamizar a economia através de monopólios estatais, ou seja, o Estado destinaria recursos para financiar investimentos que estimulem a economia;</p>
<ul><li><p>Essas companhias visavam o desenvolvimento de regiões que tinham papéis econômicos secundários e passaram a ter protagonismo por conta de produtos como o algodão e, em menor escala, o arroz e as drogas do sertão;</p></li></ul></li></ul></li>
<li><p>A <strong>produção de algodão</strong> não exigia grandes extensões de terra, por isso sua exploração contribuiu para o espraiamento de pequenas e médias propriedades em regiões do norte da colônia. Assim, os pequenos e médios proprietários podiam intercalar seu cultivo, como mandioca, arroz… com a lavoura de algodão;</p></li></ul>'
) on conflict (slug) do nothing;

-- Decisão 9c: o trigger `sync_conexoes_resumo` roda no insert, e todo [[wikilink]]
-- que apontasse para um irmão inserido depois seria descartado em silêncio.
-- Este update vazio o dispara de novo, com os 25 já no banco.
update resumos set corpo = corpo where materia_slug = 'historia';

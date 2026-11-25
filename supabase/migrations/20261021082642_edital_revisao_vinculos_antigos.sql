-- Revisão dos vínculos antigos entre tópicos de edital e resumos.
--
-- Critério (decidido pelo dono): `edital_topicos.resumo_id` liga o tópico a UM
-- resumo, e o vínculo só se sustenta se esse resumo (com os filhos por
-- `pai_id`, quando é pai) cobre TODAS as partes que o texto do tópico pede.
-- Tópicos que são só título de bloco podem ficar ligados a um resumo que
-- cubra o bloco.
--
-- Escopo: todo vínculo não nulo, em todos os processos, EXCETO os ligados pela
-- onda 0 (20261012210346_edital_pas_uem_onda_0.sql) e pelas migrations
-- `*_rascunho_*` / `*_fix_edital_*` a partir de 20261012000000. Revisados em
-- 21/10/2026: 74 vínculos, lidos contra o corpo do resumo (sem tags) e o dos
-- filhos. Mantidos 40 (alguns como "duvidoso", listados no PR), desfeitos 33,
-- trocado 1.
--
-- Cada update casa também pelo resumo atual, para não desfazer uma ligação
-- feita depois desta revisão.

-- ── Troca ───────────────────────────────────────────────────────────────────

-- PAS-UEM 1ª etapa · matemática · 17 — "Noções de Estatística: frequência
-- absoluta; medidas de tendência central (média, mediana e moda) e medidas de
-- dispersão (variância e desvio-padrão)." Medidas de tendência central não traz
-- frequência absoluta nem dispersão. Estatística é pai de medidas-de-tendencia-
-- central, medidas-de-posicao e medidas-de-dispersao: o corpo traz tabelas de
-- frequência (absoluta e relativa) e o filho de dispersão traz variância e
-- desvio-padrão.
update edital_topicos set resumo_id = (select id from resumos where slug = 'estatistica')
 where id = '787aa6e1-b4ac-4952-b909-ba18f5a97f8a'
   and resumo_id = (select id from resumos where slug = 'medidas-de-tendencia-central');

-- ── Desfeitos: PAS-UEM 1ª etapa ─────────────────────────────────────────────

-- filosofia · 4 — "A filosofia grega: sofística, método socrático e dialética,
-- teoria das ideias, reminiscência, ciência e técnica, teses cosmológicas…".
-- Teoria das ideias tem um parágrafo só sobre mundo sensível × inteligível.
update edital_topicos set resumo_id = null
 where id = '4e56d9e5-4f90-42e5-b80e-4f62d9cd36bf'
   and resumo_id = (select id from resumos where slug = 'teoria-das-ideias');

-- física · 5 — "Relação funcional entre grandezas físicas e representação
-- gráfica." Grandezas físicas não trata de proporcionalidade nem de gráficos.
update edital_topicos set resumo_id = null
 where id = '17f0ebdf-b93f-4598-a0a3-5ddf8ed16654'
   and resumo_id = (select id from resumos where slug = 'grandezas-fisicas');

-- matemática · 1 — "Matrizes, Determinantes e Sistemas Lineares." (título de
-- bloco). Matrizes não cobre o bloco: sem determinantes nem sistemas.
update edital_topicos set resumo_id = null
 where id = '4f40c1e7-b5f6-444d-9bf5-287df4c341d0'
   and resumo_id = (select id from resumos where slug = 'matrizes');

-- matemática · 2 — "…adição e multiplicação de matrizes; multiplicação de
-- número por matriz; conceito e cálculo da inversa." Falta a matriz inversa
-- (só aparece em itens de questão).
update edital_topicos set resumo_id = null
 where id = '5b1fc5c5-ec5e-4d3e-bda6-66522db79c74'
   and resumo_id = (select id from resumos where slug = 'matrizes');

-- química · 29 — "Envolvimento das leis das reações químicas na produção de
-- compostos… benéficos ao meio ambiente, e de substâncias danosas." Reações
-- químicas não trata das leis nem dessa aplicação. (Leis ponderais cobre as
-- leis, mas não a aplicação; não proposto como troca.)
update edital_topicos set resumo_id = null
 where id = 'a863b95e-417c-4bca-9630-c0541ed0ccf7'
   and resumo_id = (select id from resumos where slug = 'reacoes-quimicas');

-- sociologia · 4 — "Os processos de socialização e as instituições sociais".
-- Instituições sociais não trata de socialização (primária, secundária).
update edital_topicos set resumo_id = null
 where id = '7533a216-0e2e-4f69-9143-84780b79a9e2'
   and resumo_id = (select id from resumos where slug = 'instituicoes-sociais');

-- sociologia · 5 — "Os processos de socialização nas diferentes instituições
-- sociais." Mesmo motivo: falta socialização.
update edital_topicos set resumo_id = null
 where id = 'ca0e07bb-6846-49e8-a322-582810d68314'
   and resumo_id = (select id from resumos where slug = 'instituicoes-sociais');

-- ── Desfeitos: PAS-UEM 2ª etapa ─────────────────────────────────────────────

-- arte · 9 — "Neoclassicismo na Europa e no Brasil." Do Brasil, só o nome de
-- Debret numa lista de artistas; falta Missão Artística Francesa/Academia.
update edital_topicos set resumo_id = null
 where id = '91f4f520-98a0-4998-9576-2f8834361fb2'
   and resumo_id = (select id from resumos where slug = 'neoclassicismo');

-- biologia · 7 — "Reprodução e desenvolvimento embrionário e pós-embrionário
-- humano." O resumo cobre só as quatro etapas embrionárias gerais; falta
-- reprodução humana e desenvolvimento pós-embrionário.
update edital_topicos set resumo_id = null
 where id = '8a07e2d7-c59d-48f3-ad2f-af25de492226'
   and resumo_id = (select id from resumos where slug = 'desenvolvimento-embrionario');

-- física · 3 — "Pressão, Lei de Stevin e princípio de Pascal." Princípio de
-- Pascal só traz a prensa hidráulica; falta pressão e Stevin (estão em outros
-- filhos de Mecânica: pressao-hidrostatica, pressao-absoluta).
update edital_topicos set resumo_id = null
 where id = 'ee8d54c7-390c-48c4-b9d0-5e2f0641af45'
   and resumo_id = (select id from resumos where slug = 'principio-de-pascal');

-- geografia · 4 — "Circulação atmosférica e os climas do Brasil." Climas do
-- Brasil não trata de circulação atmosférica (massas de ar estão em outro
-- resumo, massas-de-ar-do-brasil).
update edital_topicos set resumo_id = null
 where id = 'bd8272d7-fc63-4b1f-b369-53d6ef600137'
   and resumo_id = (select id from resumos where slug = 'climas-do-brasil');

-- história · 5 — "As revoluções burguesas na Inglaterra e na França." O resumo
-- cobre só as revoluções inglesas; falta a Revolução Francesa.
update edital_topicos set resumo_id = null
 where id = '14c60b02-596c-490d-af50-f4eb7ef0c71a'
   and resumo_id = (select id from resumos where slug = 'revolucoes-burguesas');

-- matemática · 1 — "Análise Combinatória, Probabilidades." (título de bloco).
-- Análise combinatória traz só os princípios de contagem e fatorial; não cobre
-- o bloco (sem probabilidades, sem arranjos/combinações).
update edital_topicos set resumo_id = null
 where id = '64f13261-2e04-4124-b0b4-36b5925ee23d'
   and resumo_id = (select id from resumos where slug = 'analise-combinatoria');

-- química · 10 — "Controle da velocidade de reações químicas em situações
-- cotidianas." Reações químicas não trata de cinética.
update edital_topicos set resumo_id = null
 where id = '739845e4-1f67-4c10-8b0c-c9038bac89ed'
   and resumo_id = (select id from resumos where slug = 'reacoes-quimicas');

-- ── Desfeitos: PAS-UEM 3ª etapa ─────────────────────────────────────────────

-- arte · 8 — "Arte Greco-Romana: arquitetura, pintura e escultura." Arte grega
-- não trata da arte romana (só cita as cópias romanas de esculturas).
update edital_topicos set resumo_id = null
 where id = '6d253156-475f-4536-b704-88ba9f05a86f'
   and resumo_id = (select id from resumos where slug = 'arte-grega');

-- biologia · 22 — "Energia e matéria nos ecossistemas: cadeias/teias
-- alimentares e ciclos biogeoquímicos." Falta cadeias e teias alimentares.
update edital_topicos set resumo_id = null
 where id = 'd2545a40-8d61-40b1-9f33-f37ed3921992'
   and resumo_id = (select id from resumos where slug = 'ciclos-biogeoquimicos');

-- biologia · 23 — "Sucessão ecológica e biomas: grandes biomas da terra e
-- biomas brasileiros." Falta biomas.
update edital_topicos set resumo_id = null
 where id = 'f82ed67c-9e48-411b-9386-fa0e5dfe203b'
   and resumo_id = (select id from resumos where slug = 'sucessao-ecologica');

-- ── Desfeitos: PASSE 1ª etapa ───────────────────────────────────────────────

-- biologia · 11 — "Ecologia: biomas; fluxo de energia nas cadeias tróficas e
-- ciclos biogeoquímicos." Falta biomas e fluxo de energia.
update edital_topicos set resumo_id = null
 where id = '8a22ff79-1ed7-4a2a-9341-0e94b807ca59'
   and resumo_id = (select id from resumos where slug = 'ciclos-biogeoquimicos');

-- biologia · 12 — "Ciclos biogeoquímicos e o equilíbrio… (efeito estufa,
-- aquecimento global, camada de ozônio e chuvas ácidas)." Falta a parte
-- ambiental inteira.
update edital_topicos set resumo_id = null
 where id = '9e37a5cc-b330-4ee9-a012-567a71a291c8'
   and resumo_id = (select id from resumos where slug = 'ciclos-biogeoquimicos');

-- filosofia · 5 — "Filosofia existencialista: Kierkegaard…; Heidegger: Ser e
-- angústia; Sartre…". A seção de Heidegger está vazia (só o título).
update edital_topicos set resumo_id = null
 where id = 'cbf8ba37-ec20-46ba-87b8-0dffb47a6495'
   and resumo_id = (select id from resumos where slug = 'existencialismo');

-- física · 7 — "Espectroscopia e efeito Doppler aplicada aos corpos
-- celestes." Falta espectroscopia e a aplicação astronômica.
update edital_topicos set resumo_id = null
 where id = '7bc669d3-5a07-4118-94ff-19a0a9a0cb71'
   and resumo_id = (select id from resumos where slug = 'efeito-doppler');

-- física · 17 — "Fenômenos ondulatórios: intensidade sonora. Efeito Doppler."
-- Falta intensidade sonora.
update edital_topicos set resumo_id = null
 where id = 'fe1678c4-aec9-444d-9dd3-c79e5169a106'
   and resumo_id = (select id from resumos where slug = 'efeito-doppler');

-- história · 7 — "Estados Nacionais Modernos. Reformas Religiosas. Expansão
-- Ultramarina. Conquistas e Colonização na América…". Colonização na América
-- cobre só a colonização espanhola e inglesa.
update edital_topicos set resumo_id = null
 where id = 'ceb457ad-31cf-4dbf-ab8a-abbdab47ae46'
   and resumo_id = (select id from resumos where slug = 'colonizacao-na-america');

-- literatura · 3 — "Gêneros literários e suas formas, metrificação e
-- versificação, análise literária, estilo individual e de época." Falta
-- metrificação, versificação e estilo.
update edital_topicos set resumo_id = null
 where id = 'e92956ec-6a70-4ac4-811c-18f299372482'
   and resumo_id = (select id from resumos where slug = 'generos-literarios');

-- literatura · 13 — "Dialogia e relações intertextuais e interdiscursivas…".
-- Gêneros literários não trata de intertextualidade.
update edital_topicos set resumo_id = null
 where id = '8f1a866a-c49e-4151-82a7-c9ea531ec725'
   and resumo_id = (select id from resumos where slug = 'generos-literarios');

-- matemática · 20 — "Noções de Análise Combinatória: arranjos e combinações."
-- O resumo não traz arranjos nem combinações.
update edital_topicos set resumo_id = null
 where id = '45c3efa3-f157-4303-bceb-120d13f47fec'
   and resumo_id = (select id from resumos where slug = 'analise-combinatoria');

-- química · 5 — "Historicidade dos elementos químicos: classificação de cada
-- grupo na tabela periódica." Tabela periódica traz as propriedades
-- periódicas; falta a história e os grupos.
update edital_topicos set resumo_id = null
 where id = 'c0414fcb-aff7-436a-940e-425f8d35f225'
   and resumo_id = (select id from resumos where slug = 'tabela-periodica');

-- química · 18 — "Reações químicas nos ciclos biogeoquímicos… equilíbrio
-- químico…". Reações químicas não trata de equilíbrio nem de ciclos.
update edital_topicos set resumo_id = null
 where id = '89e59f45-0b85-43be-b573-bbadd78b7592'
   and resumo_id = (select id from resumos where slug = 'reacoes-quimicas');

-- sociologia · 7 — "Comte e o positivismo; Durkheim (fato social, normal e
-- patológico, divisão do trabalho, suicídio); Weber (tipos ideais, tipos de
-- ação, dominação)." Max Weber cobre só os tipos de ação e a ética
-- protestante; falta Comte, Durkheim, tipos ideais e dominação.
update edital_topicos set resumo_id = null
 where id = 'bedcc7a1-4e31-4a69-951f-9f5d7bd64a05'
   and resumo_id = (select id from resumos where slug = 'max-weber');

-- ── Desfeitos: PASSE 2ª etapa ───────────────────────────────────────────────

-- história · 5 — "Revolução Industrial. Blocos e acordos econômicos."
-- Falta blocos e acordos econômicos.
update edital_topicos set resumo_id = null
 where id = '4320f96f-f0a7-4713-a307-0c00cea3abad'
   and resumo_id = (select id from resumos where slug = 'revolucao-industrial');

-- português · 2 — "Variações linguísticas (fonética, lexical, morfossintática)…,
-- preconceito linguístico e marcadores sociais." Falta preconceito
-- linguístico e os níveis fonético/lexical/morfossintático.
update edital_topicos set resumo_id = null
 where id = '9de7d51c-63ac-49be-847b-1a5c969f58fe'
   and resumo_id = (select id from resumos where slug = 'variacoes-linguisticas');

-- química · 2 — "Condições para ocorrência das reações; aspectos qualitativos
-- e quantitativos de reagentes e produtos em análises químicas." O resumo traz
-- condições de reação (pirólise, fotólise…), mas não a parte quantitativa.
update edital_topicos set resumo_id = null
 where id = '786f067f-0e60-483c-a8be-2f846a5ce6f4'
   and resumo_id = (select id from resumos where slug = 'reacoes-quimicas');

-- química · 7 — "Caracterização das reações considerando absorção e liberação
-- de energia." Reações químicas não trata de termoquímica.
update edital_topicos set resumo_id = null
 where id = '1963bac1-b0f3-41c1-bd1b-0f4b6115b3d0'
   and resumo_id = (select id from resumos where slug = 'reacoes-quimicas');

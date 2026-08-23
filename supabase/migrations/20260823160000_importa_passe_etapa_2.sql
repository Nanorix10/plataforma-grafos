-- Importa a 2ª etapa do PASSE, vinda de "Resumo para PASSE 2° etapa 2026.docx".
--
-- Dezessete resumos: dez pais, um por matéria, e sete filhos. O documento tem
-- dez matérias e **três** com texto: Língua Portuguesa (variações linguísticas,
-- funções da linguagem, ambiguidade e intertextualidade), História global
-- (formação das monarquias nacionais e revoluções burguesas) e Matemática (a
-- função logarítmica, que existe só como desenho). O resto é a lista do edital,
-- e entra como sumário do pai — a forma que o autor escolheu.
--
-- **É a primeira linha de História no site**, e a segunda matéria a estrear
-- nesta leva, depois da Sociologia na 2ª etapa do PAS UEM.
--
-- ## A Estatística não entra de novo, e isso é o ponto
--
-- O edital de Probabilidade e Estatística pede Medidas de tendência central e
-- Medidas de dispersão, e o documento traz as duas escritas — com o MESMO
-- texto que já está no banco desde a importação da 1ª etapa do PAS UEM
-- (comparado linha a linha, incluindo as fórmulas). Inserir de novo criaria
-- dois resumos com títulos iguais, e o trigger `sync_conexoes_resumo` resolve
-- `[[wikilink]]` por título: o destino ficaria indeterminado, em silêncio.
--
-- Quem resolve é a `20260823140000_processo_comum`, que move os dois para o
-- processo `comum` — aberto a todo plano. Elas aparecem para o aluno do PASSE
-- sem existirem duas vezes. Aqui elas só constam do sumário do pai.
--
-- ## Um tópico que só existe como desenho
--
-- "Função logarítmica" não tem uma linha escrita: tem o diagrama que liga
-- `bˣ = a` a `log_b a = x`, com base, expoente, logaritmando e resultado
-- anotados por cima. É conteúdo, e vira resumo — mesmo caso do "Níveis de
-- organização" da Biologia, que tinha ficado de fora da primeira leva por não
-- ter texto. O diagrama continua imagem porque os rótulos ligados por linha
-- são a explicação; virar KaTeX perderia as anotações. PNG → WebP q82:
-- 114 KB → 39 KB.
--
-- A ilusão da taça e dos dois rostos, que ilustra a ambiguidade visual,
-- também continua imagem pela mesma razão: ali a dupla leitura É o exemplo.
--
-- ## O que muda de FORMA
--
-- Mesmo mapeamento da `20260823150000`, que saiu de comparar o `.docx` da 1ª
-- etapa com o que já está no banco: nível 0 em negrito vira título do resumo e
-- o texto após os dois pontos vira o `<p>` de abertura; nível 1 com definição
-- vira `<h2 data-corrido="sim">`; nível 1 que só apresenta a lista abaixo vira
-- `<p>`; nível 2 e 3 que abrem seção viram `h3`/`h4` corridos; item folha
-- continua item de lista.
--
-- O sublinhado que abre um item vira texto puro (o `:` já marca o termo); o que
-- grifa no meio da frase vira `<strong>`. Em História isso aparece muito — o
-- autor grifa "sagrado, hereditário e ilimitado", "Bill of Rights",
-- "supremacia do Parlamento acima do rei" —, e sem a marca o resumo perderia
-- justamente o que ele quis destacar. `<strong>` pesa 500 e o título 800, então
-- negrito continua sendo grafo e só grafo (decisão 12).
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - "mais de f um significado", com um f solto, na abertura de Ambiguidade.
-- - "um efeito sugAestivo", com um A que entrou no meio da palavra. O A estava
--   em negrito no documento, e o negrito NÃO veio junto: no site ele marcaria
--   um grafo, e um grafo de uma letra dentro de uma palavra é ruído. A letra
--   ficou, que é o que o autor digitou.
-- - "Centrali" e "zação fortalecida após a Guerra dos Cem Anos" em dois itens
--   separados, na França. Continuam dois itens.
-- - "Inglaterra:Consolidada após a Guerra das Duas Rosas", sem espaço depois
--   dos dois pontos. Nenhum caractere foi acrescentado: o `:` fecha o grafo e o
--   resto virou a explicação ao lado, como em todo título corrido, então na
--   tela o espaço aparece sem existir no texto.
-- - "Pré- capitalismo/capitalismo comercial", com o espaço depois do hífen.
-- - "Tratado de Zamorra" (é Zamora) e "Oliver Crowell" (é Cromwell).
-- - "após crise   sucessória", com três espaços.
-- - "Função exponencial" aparece duas vezes no edital de Números e Álgebra, uma
--   delas sem nada depois dos dois pontos. As duas estão no sumário.
-- - O título do documento é "Resumos para PASSE 1ª etapa" e a linha seguinte diz
--   "Resumos para PASSE 2ª etapa". O conteúdo é todo da 2ª etapa — conferido
--   matéria por matéria contra o edital que o próprio documento lista —, então
--   o `processo_slug` é `passe` e o pai é o da 2ª etapa. O título de fora não
--   foi tocado.
--
-- Não há uma fórmula sequer nesta leva — a única matemática do documento é o
-- diagrama do logaritmo, que continua imagem. Nem `[[wikilink]]`, então não há
-- `update corpo = corpo` no fim.
-- `on conflict (slug) do nothing` deixa rodar de novo sem duplicar.

-- ============================================
-- 1. Os pais: um por matéria, com o sumário do edital
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'portugues-2-etapa-passe',
  'Língua Portuguesa na 2ª etapa do PASSE',
  'portugues',
  'passe',
  'O que a 2ª etapa cobre em Língua Portuguesa — e o que já está escrito.',
  '<p>As questões normalmente focam na interpretação de um texto, portanto os conteúdos a seguir são uma ajuda a este processo para resolver a questão.</p><p>Os tópicos da 2ª etapa, na ordem do documento. Os que já têm texto estão pendurados aqui como resumos.</p><ul><li><p>Gramática tradicional e contemporânea; relações de poder e variação linguística;</p></li><li><p>Variações linguísticas;</p></li><li><p>Gêneros textuais multimodais e multissemióticos (campos jornalístico, literário, científico);</p></li><li><p>Práticas de oralidade e escuta;</p></li><li><p>Figuras de linguagem, modalizadores, intertextualidade, polifonia, ambiguidade;</p></li><li><p>Funções da linguagem;</p></li><li><p>Ambiguidade;</p></li><li><p>Intertextualidade;</p></li><li><p>Fake news, cultura digital, Web 2.0, curadoria de informação;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'literatura-2-etapa-passe',
  'Literatura na 2ª etapa do PASSE',
  'literatura',
  'passe',
  'O que a 2ª etapa cobre em Literatura, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>“A arte das palavras não só escrita como também falada ou representada.” Aristóteles;</p></li><li><p>Romantismo em Portugal e no Brasil;</p></li><li><p>Realismo-Naturalismo em Portugal e no Brasil;</p></li><li><p>Parnasianismo e Simbolismo;</p></li><li><p>Aspectos éticos, estéticos, sociais e políticos nas obras;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- O documento separa "HISTÓRIA GLOBAL" e "HISTÓRIA REGIONAL" com dois
-- cabeçalhos de nome diferente. Como o site tem uma matéria `historia` só, os
-- dois viram seções do mesmo sumário, com os nomes que o autor deu.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'historia-2-etapa-passe',
  'História na 2ª etapa do PASSE',
  'historia',
  'passe',
  'O que a 2ª etapa cobre em História global e regional — e o que já está escrito.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento. Os que já têm texto estão pendurados aqui como resumos.</p><h2>História global</h2><ul><li><p>Mercantilismo; Brasil Colônia; colonização espanhola no sul de MT;</p></li><li><p>Formação das Monarquias Nacionais;</p></li><li><p>Revoluções burguesas;</p></li><li><p>Revolução Industrial; blocos econômicos; globalização;</p></li><li><p>Taylorismo e Fordismo; contracultura; consumismo;</p></li><li><p>Políticas ambientais (Estocolmo 1972 → Acordo de Paris 2015);</p></li><li><p>Movimentos estudantis; redemocratização no Brasil (1985–hoje);</p></li></ul><h2>História regional</h2><ul><li><p>Formação de MS: divisão do estado, questão indígena, conflitos de terra, migrações;</p></li><li><p>Agronegócio em MS; reforma agrária; revolução agroecológica;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'filosofia-2-etapa-passe',
  'Filosofia na 2ª etapa do PASSE',
  'filosofia',
  'passe',
  'O que a 2ª etapa cobre em Filosofia, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Formação do Estado: Bodin, Maquiavel, Hobbes, Rousseau;</p></li><li><p>Iluminismo: razão, liberdade, direitos naturais, progresso;</p></li><li><p>Escola de Frankfurt: Adorno, Marcuse, Horkheimer; indústria cultural;</p></li><li><p>Marx: materialismo histórico, crítica ao capitalismo;</p></li><li><p>Ecoética; desenvolvimento sustentável; responsabilidade socioambiental;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'geografia-2-etapa-passe',
  'Geografia na 2ª etapa do PASSE',
  'geografia',
  'passe',
  'O que a 2ª etapa cobre em Geografia, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Teorias populacionais (Malthusiana, Neomalthusiana, Reformista);</p></li><li><p>Dinâmica populacional brasileira; migrações; fronteiras de MS;</p></li><li><p>Globalização; Estado e Nação; território e territorialidades;</p></li><li><p>Conflitos: Oriente Médio, Europa, Ásia; migrações internacionais;</p></li><li><p>Agropecuária: sistemas convencionais e sustentáveis;</p></li><li><p>Povos tradicionais, indígenas e quilombolas em MS;</p></li><li><p>Industrialização fordista e pós-fordista; indústria cultural;</p></li><li><p>Fontes de energia; políticas ambientais internacionais (Estocolmo 1972 → Acordo de Paris 2015);</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sociologia-2-etapa-passe',
  'Sociologia na 2ª etapa do PASSE',
  'sociologia',
  'passe',
  'O que a 2ª etapa cobre em Sociologia, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Sociedades nômades e tradicionais; conflitos étnicos;</p></li><li><p>Fronteiras e trocas simbólicas;</p></li><li><p>Juventude: transição para a vida adulta; mídias digitais e formação de opinião;</p></li><li><p>Indústria cultural; padronização e lazer alienado;</p></li><li><p>Produção, tecnologia e sociedade de consumo;</p></li><li><p>Povos indígenas e quilombolas em MS; diversificação na produção de alimentos;</p></li><li><p>Movimentos socioambientais; fiscalização e gestão pública de recursos naturais;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- O documento divide a Matemática em três cabeçalhos, que aqui viram três
-- seções do mesmo sumário. Medidas de tendência central e Medidas de dispersão
-- constam da lista mas não viram resumo: já existem, e a
-- `20260823140000_processo_comum` as abriu para todo plano.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'matematica-2-etapa-passe',
  'Matemática na 2ª etapa do PASSE',
  'matematica',
  'passe',
  'O que a 2ª etapa cobre em Números e álgebra, Geometria e Estatística — e o que já está escrito.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento. Os que já têm texto estão pendurados aqui como resumos, e a Estatística já está no site desde a 1ª etapa do PAS UEM.</p><h2>Números e álgebra</h2><ul><li><p>Função exponencial: gráficos, crescimento, progressões geométricas (PG);</p></li><li><p>Função exponencial;</p></li><li><p>Função logarítmica: logaritmo decimal e natural, gráficos;</p></li><li><p>Matemática financeira: juros simples e compostos, amortização, fluxo de caixa;</p></li><li><p>Renda bruta e líquida; modelagem com funções exponenciais e logarítmicas;</p></li></ul><h2>Geometria e medidas</h2><ul><li><p>Semelhança e congruência de polígonos e triângulos;</p></li><li><p>Isometrias (reflexão, translação, rotação) e homotetias;</p></li><li><p>Relações métricas no triângulo retângulo; razões trigonométricas;</p></li><li><p>Lei dos senos e lei dos cossenos;</p></li><li><p>Polígonos regulares: ângulos, perímetro, área, ladrilhamento;</p></li><li><p>Áreas por decomposição, composição ou aproximação;</p></li></ul><h2>Probabilidade e estatística</h2><ul><li><p>Probabilidade simples e condicional;</p></li><li><p>Eventos mutuamente exclusivos, dependentes e independentes;</p></li><li><p>Espaços amostrais; experimentos aleatórios sucessivos;</p></li><li><p>Estatística: organização de dados, gráficos, medidas de tendência central e dispersão;</p></li><li><p>Medidas de tendência central;</p></li><li><p>Medidas de dispersão;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'fisica-2-etapa-passe',
  'Física na 2ª etapa do PASSE',
  'fisica',
  'passe',
  'O que a 2ª etapa cobre em Física, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Calorimetria: trocas de calor, transformação de energia;</p></li><li><p>Propagação do calor; sistemas termodinâmicos;</p></li><li><p>Eletrodinâmica: motores elétricos e geradores;</p></li><li><p>Geração e distribuição de energia elétrica; fontes renováveis;</p></li><li><p>Circuitos elétricos; segurança elétrica; automação;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'quimica-2-etapa-passe',
  'Química na 2ª etapa do PASSE',
  'quimica',
  'passe',
  'O que a 2ª etapa cobre em Química, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Soluções, dispersões, diluições e titulação;</p></li><li><p>Reações químicas: aspectos qualitativos e quantitativos;</p></li><li><p>Reações redox; células galvânicas (pilhas e baterias);</p></li><li><p>Termoquímica: Lei de Hess, entalpia, equações termoquímicas;</p></li><li><p>Petróleo: propriedades, extração, impactos socioambientais;</p></li><li><p>Tratamento de água e efluentes; gestão de resíduos;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'biologia-2-etapa-passe',
  'Biologia na 2ª etapa do PASSE',
  'biologia',
  'passe',
  'O que a 2ª etapa cobre em Biologia, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Intervenções humanas nos ecossistemas; biodiversidade;</p></li><li><p>Lixo eletroeletrônico e os 8 Rs;</p></li><li><p>Energias renováveis e não renováveis;</p></li><li><p>Aquecimento global; equilíbrio térmico;</p></li><li><p>Biotecnologia: biofábricas, nanotecnologia, automação agrícola;</p></li><li><p>Saneamento básico, imunização, ISTs;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 2. Língua Portuguesa: os quatro tópicos escritos
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'variacoes-linguisticas',
  'Variações linguísticas',
  'portugues',
  'passe',
  'As quatro variações — no tempo, no lugar, no grupo social e no meio.',
  '<p>conjunto das diferenças de realização linguística (falada ou escrita).</p><h2 data-corrido="sim">Histórica (diacrônica):</h2><p>refere-se aos estágios de desenvolvimento de uma língua ao longo da História.</p><h2 data-corrido="sim">Geográfica/regional (diatópica):</h2><p>variedade que a língua assume nos diferentes lugares onde é falada.</p><h2 data-corrido="sim">Social (diastrática):</h2><p>ocorrem conforme a classe social ou grupo social a que pertencem os usuários da língua.</p><ul><li><p>Jargão profissional: conjunto de termos usados por pessoas que compartilham a mesma atividade profissional. Ex: termos médicos, econômicos, judiciais, em marketing, etc.</p></li><li><p>Gíria: termos não convencionais utilizados em lugar de outras palavras correntes da língua. Trata-se de uma linguagem restrita de alguns grupos sociais, cujo uso afirma a identidade de seus usuários e marca sua diferença em relação ao restante da sociedade.</p></li></ul><h2 data-corrido="sim">Diamésica:</h2><p>refere-se à variação conforme o meio de comunicação utilizado;</p><ul><li><p>Ex: oral, escrito, digital, audiovisual, etc.;</p></li></ul>',
  (select id from resumos where slug = 'portugues-2-etapa-passe')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'funcoes-da-linguagem',
  'Funções da linguagem',
  'portugues',
  'passe',
  'As seis funções, cada uma pelo elemento da comunicação em que põe o foco.',
  '<h2 data-corrido="sim">Função referencial ou denotativa:</h2><p>possui o foco no referente, ou seja, no assunto da mensagem;</p><ul><li><p>Seu objetivo é informar o leitor de algo, com objetividade, clareza e impessoalidade;</p></li><li><p>Muito presente em notícias, memorandos, reportagens, textos científicos, ofícios, biografias;</p></li></ul><h2 data-corrido="sim">Função apelativa ou conativa:</h2><p>foco no receptor;</p><ul><li><p>É a tentativa do emissor de influenciar o receptor;</p></li><li><p>É marcado pelo uso frequente de vocativos e verbos no imperativo;</p></li><li><p>Pode ser encontrado em textos literários quando é feita referência ao leitor e textos publicitários;</p></li></ul><h2 data-corrido="sim">Função emotiva ou expressiva:</h2><p>foco no emissor, já que trata da expressão dos sentimentos, emoções e opiniões dele;</p><ul><li><p>É marcado pela subjetividade, uso da 1ª pessoa e marcas de emoção ou atitude por meio de interjeições, exclamações ou adjetivos;</p></li></ul><h2 data-corrido="sim">Função poética:</h2><p>o foco é a própria mensagem, priorizando sua forma estética e expressiva, e não o conteúdo em si;</p><ul><li><p>Costuma aparecer em letras de músicas e obras literárias;</p></li></ul><h2 data-corrido="sim">Função fática:</h2><p>foco no meio que transmite a mensagem (o canal de comunicação);</p><ul><li><p>Frases que testam ou mantêm o canal ativo;</p></li><li><p>Costumam ocorrer no início, no meio ou no fim da comunicação;</p></li></ul><h2 data-corrido="sim">Função metalinguística:</h2><p>foco no próprio código linguístico, ou seja, na linguagem usada para falar da própria linguagem;</p><ul><li><p>Explicações, definições e análises da linguagem dentro da linguagem;</p></li></ul>',
  (select id from resumos where slug = 'portugues-2-etapa-passe')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ambiguidade',
  'Ambiguidade',
  'portugues',
  'passe',
  'Os seis tipos de duplo sentido, cada um com o exemplo que o denuncia.',
  '<p>característica de textos que apresentam mais de f um significado;</p><h2 data-corrido="sim">Lexical:</h2><p>provocada pelo uso de palavras que apresentam mais de um significado;</p><ul><li><p>Ex: A Maria fez aquele jantar na sua casa.</p></li></ul><h2 data-corrido="sim">Fonética:</h2><p>recurso (ou ruído) proveniente da sonoridade emitida na pronúncia de palavras;</p><ul><li><p>Ex: Confusão entre palavras com mesma sonoridade, como “conserto” e “concerto”;</p></li></ul><h2 data-corrido="sim">Semântica (por referência):</h2><p>quando dois antecedentes possíveis, presentes na própria frase ou no contexto, causam o duplo sentido;</p><ul><li><p>Ex: O jovem disse ao chefe de seu pai que o admirava muito.</p></li></ul><h2 data-corrido="sim">Sintática (estrutural):</h2><p>ocorre quando uma frase pode ter múltiplas interpretações devido à sua estrutura gramatical;</p><ul><li><p>Ex: A menina viu sua irmã de binóculos no parque.</p></li></ul><h2 data-corrido="sim">De escopo:</h2><p>desencadeada pelo uso de palavras que sugerem diferentes possibilidades semânticas a partir das relações que elas estabelecem com seus referentes na sentença ou no contexto.</p><ul><li><p>Ex: Renata e Raul se separaram.</p><ul><li><p>I. Renata se separou de Raul, o qual se separou de Renata.</p></li><li><p>II. Renata e Raul se separaram de seus respectivos companheiros.</p></li></ul></li></ul><h2 data-corrido="sim">Visual (imagética):</h2><p>provocada pela dupla interpretação de imagens;</p><ul><li><p>Ex:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/ambiguidade-visual.webp" alt="Silhueta em preto e branco que tanto pode ser uma taça ao centro quanto dois rostos de perfil, um de frente para o outro." style="width:100%" data-largura="100%"></figure></li></ul><h2 data-corrido="sim">Duplo sentido:</h2><p>recurso intencional para criar humor, ironia ou um efeito sugAestivo;</p><ul><li><p>Ex: Vamos fazer um churrasco, eu levo a carne e você só leva linguiça (sentido sexual);</p></li></ul>',
  (select id from resumos where slug = 'portugues-2-etapa-passe')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'intertextualidade',
  'Intertextualidade',
  'portugues',
  'passe',
  'Paráfrase, paródia, citação, apropriação, alusão e epígrafe — as seis formas de um texto citar outro.',
  '<p>relação entre dois textos caracterizada pela referência de um pelo outro de maneira implícita ou explícita;</p><h2 data-corrido="sim">Paráfrase:</h2><p>falar do outro texto com outras palavras, mantendo o sentido;</p><h2 data-corrido="sim">Paródia:</h2><p>modificação de texto mudando o sentido;</p><h2 data-corrido="sim">Citação:</h2><p>faz o uso de um texto literalmente. Por isso, deve estar entre aspas;</p><h2 data-corrido="sim">Apropriação:</h2><p>utilizar o texto original com autorização;</p><h2 data-corrido="sim">Alusão:</h2><p>lembrança a outro texto já conhecido;</p><h2 data-corrido="sim">Epígrafe:</h2><p>citação de um texto já conhecido no início de uma obra;</p>',
  (select id from resumos where slug = 'portugues-2-etapa-passe')
)
on conflict (slug) do nothing;

-- ============================================
-- 3. História: os dois tópicos escritos
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'formacao-das-monarquias-nacionais',
  'Formação das Monarquias Nacionais',
  'historia',
  'passe',
  'Nação, Estado e Estado-Nação; o mercantilismo, a centralização em quatro reinos e o Antigo Regime.',
  '<h2 data-corrido="sim">Nação:</h2><p>conjunto de pessoas que compartilham cultura, língua, tradições e história comuns;</p><h2 data-corrido="sim">Estado:</h2><p>Instituição política com território definido, governo soberano e leis;</p><h2 data-corrido="sim">Estado-Nação:</h2><p>quando o Estado coincide com uma nação;</p><h2 data-corrido="sim">Pré- capitalismo/capitalismo comercial:</h2><p>racionalização da produção e na dinamização do comércio;</p><ul><li><p>Comércio marítimo e colonial;</p></li><li><p>Mercantilismo: forte intervencionismo estatal na economia, visando acumular riqueza e fortalecer o poder do Estado;</p><ul><li><p>Metalismo: riqueza medida pela quantidade de ouro e prata;</p></li><li><p>Balança comercial favorável: exportar mais do que importar;</p></li><li><p>Intervencionismo estatal: Estado regula a economia;</p></li><li><p>Colonialismo: exploração de colônias para enriquecer a metrópole;</p></li><li><p>Pacto colonial: colônias só podiam comercializar com a metrópole;</p></li><li><p>Protecionismo alfandegário: tarifas altas sobre produtos importados;</p></li></ul></li></ul><h2>Centralização do poder na Europa:</h2><h3 data-corrido="sim">Absolutismo monárquico:</h3><p>sistema político em que o rei concentra todos os poderes: executivo, legislativo e judiciário;</p><ul><li><p>O <strong>poder do monarca</strong> era considerado <strong>sagrado, hereditário e ilimitado</strong>;</p></li></ul><h3>Portugal:</h3><ul><li><p>Processo ligado à Reconquista Cristã (luta contra os muçulmanos na Península Ibérica);</p></li><li><p>Independência em 1143 com o Tratado de Zamorra.</p></li><li><p>Consolidada com a Dinastia de Avis (1385) após crise   sucessória;</p></li><li><p>Primeira monarquia nacional plenamente formada, iniciando a expansão marítima;</p></li></ul><h3>Espanha:</h3><ul><li><p>Unificação dos Reinos de Castela e Aragão com o casamento de Isabel e Fernando (1469);</p></li><li><p>Final da Guerra de Granada (1492): expulsão dos mouros e fim da Reconquista;</p></li><li><p>Unidade religiosa com a Inquisição e expulsão dos judeus;</p></li></ul><h3>França:</h3><ul><li><p>Centrali</p></li><li><p>zação fortalecida após a Guerra dos Cem Anos (1337–1453) contra a Inglaterra;</p></li><li><p>Fortalecimento da autoridade dos reis Capetíngios e Valois;</p></li></ul><h3 data-corrido="sim">Inglaterra:</h3><p>Consolidada após a Guerra das Duas Rosas (1455–1485) entre as casas de York e Lancaster;</p><ul><li><p>Vitória da Casa de Lancaster com Henrique VII, que inicia a Dinastia Tudor;</p></li></ul><h2>Teóricos absolutistas:</h2><ul><li><p>Jean Bodin: defensor da soberania absoluta do rei como garantia da ordem;</p></li><li><p>Jacques Bossuet: defensor do direito divino dos reis: o rei governa por vontade de Deus;</p></li><li><p>Thomas Hobbes: Justificava o absolutismo por meio do medo do caos. O povo entrega seus direitos ao soberano para garantir segurança e paz;</p></li><li><p>Nicolau Maquiavel: o governante deve manter o poder mesmo com ações moralmente duvidosas (“os fins justificam os meios”);</p></li></ul><h2 data-corrido="sim">Antigo Regime:</h2><p>nome dado ao conjunto de instituições políticas, sociais e econômicas anteriores à Revolução Francesa (1789);</p><ul><li><p>Absolutismo monárquico;</p></li><li><p>Sociedade estamental (dividida em clero, nobreza e povo);</p></li><li><p>Economia mercantilista;</p></li><li><p>Forte influência da Igreja Católica;</p></li><li><p>Será duramente criticado pelos filósofos iluministas, que propunham igualdade, liberdade e razão;</p></li></ul>',
  (select id from resumos where slug = 'historia-2-etapa-passe')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'revolucoes-burguesas',
  'Revoluções burguesas',
  'historia',
  'passe',
  'O Antigo Regime posto abaixo pelas duas revoluções inglesas, da Puritana à Gloriosa.',
  '<h2 data-corrido="sim">Conceito de Antigo Regime:</h2><p><strong>sistema político, social e econômico</strong> que predominou na Europa entre os séculos XV e XVIII, caracterizado pela <strong>monarquia absolutista</strong>, uma <strong>sociedade estamental</strong> dividida em ordens (clero, nobreza e o 3º Estado) e pela <strong>economia mercantilista</strong>;</p><h2>Revoluções Inglesas:</h2><h3>Revolução Puritana:</h3><ul><li><p>Enfrentamento entre Carlos I (absolutista), defendido pelos católicos e anglicanos e o Parlamento, dominado por puritanos e burgueses;</p></li><li><p>Com a liderança de Oliver Crowell, o Parlamento ganhou e iniciou-se a <strong>República de Commonwealth</strong>;</p></li><li><p><strong>Promulgação do Ato de Navegação</strong>: todos os produtos que entrassem ou saíssem da Inglaterra deveriam ser transportados somente por navios ingleses;</p></li></ul><h3>Restauração e Revolução Gloriosa:</h3><ul><li><p><strong>Retorno da monarquia</strong> com Carlos II e Jaime II; <strong>tentativa de restaurar o absolutismo</strong>;</p></li><li><p>Parlamento depõe Jaime II e convida Guilherme de Orange, assinando o <strong>Bill of Rights</strong>, que declarava a <strong>supremacia do Parlamento acima do rei</strong>;</p></li><li><p><strong>Instauração da monarquia constitucional</strong> e <strong>consolidação do liberalismo político</strong>;</p></li></ul>',
  (select id from resumos where slug = 'historia-2-etapa-passe')
)
on conflict (slug) do nothing;

-- ============================================
-- 4. Matemática: o tópico que só existe como desenho
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'funcao-logaritmica',
  'Função logarítmica',
  'matematica',
  'passe',
  'O diagrama que liga a potência ao logaritmo, com o nome de cada parte.',
  '<p>logaritmo decimal e natural, gráficos</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/logaritmo-partes.webp" alt="A equivalência entre a potência e o logaritmo, com cada parte anotada: em b elevado a x igual a a, b é a base, x o expoente e a o resultado da potência; em log de a na base b igual a x, b é a base, a o logaritmando e x o logaritmo." style="width:100%" data-largura="100%"></figure>',
  (select id from resumos where slug = 'matematica-2-etapa-passe')
)
on conflict (slug) do nothing;

-- ============================================
-- 5. Guardas
-- ============================================
do $$
declare
  n_novos int;
  n_orfaos int;
  n_titulos int;
  n_comum int;
begin
  select count(*) into n_novos
    from resumos
   where slug in (
     'portugues-2-etapa-passe', 'literatura-2-etapa-passe', 'historia-2-etapa-passe',
     'filosofia-2-etapa-passe', 'geografia-2-etapa-passe', 'sociologia-2-etapa-passe',
     'matematica-2-etapa-passe', 'fisica-2-etapa-passe', 'quimica-2-etapa-passe',
     'biologia-2-etapa-passe',
     'variacoes-linguisticas', 'funcoes-da-linguagem', 'ambiguidade',
     'intertextualidade', 'formacao-das-monarquias-nacionais',
     'revolucoes-burguesas', 'funcao-logaritmica');
  if n_novos <> 17 then
    raise exception 'esperava 17 resumos da 2ª etapa do PASSE, encontrei %', n_novos;
  end if;

  select count(*) into n_orfaos
    from resumos
   where slug in ('variacoes-linguisticas', 'funcoes-da-linguagem', 'ambiguidade',
                  'intertextualidade', 'formacao-das-monarquias-nacionais',
                  'revolucoes-burguesas', 'funcao-logaritmica')
     and pai_id is null;
  if n_orfaos <> 0 then
    raise exception '% filhos ficaram sem pai', n_orfaos;
  end if;

  select count(*) into n_titulos
    from (select titulo from resumos group by titulo having count(*) > 1) x;
  if n_titulos <> 0 then
    raise exception '% títulos repetidos no acervo', n_titulos;
  end if;

  -- A Estatística tem de continuar sendo DOIS resumos, e em `comum`. Se esta
  -- migration for aplicada sem a `20260823140000`, o aluno do PASSE abriria o
  -- sumário de Matemática e não acharia os dois tópicos que ele lista.
  select count(*) into n_comum
    from resumos
   where slug in ('medidas-de-tendencia-central', 'medidas-de-dispersao')
     and processo_slug = 'comum';
  if n_comum <> 2 then
    raise exception 'a Estatística não está em comum (encontrei %)', n_comum;
  end if;
end $$;

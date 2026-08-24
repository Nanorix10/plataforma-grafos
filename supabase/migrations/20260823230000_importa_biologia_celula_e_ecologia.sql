-- Importa a primeira metade da Biologia, vinda de "Materias e conteúdos feitos/
-- Biologia.docx": a célula, a origem da vida, a evolução e a ecologia.
--
-- Vinte e quatro resumos e dezesseis figuras. `processo_slug = 'comum'`, como as
-- outras matérias vindas dos documentos-mestre (decisão 1c). Todos na raiz.
--
-- ## Em duas migrations, e por quê
--
-- O documento tem quarenta e sete tópicos e oitenta e duas imagens — é o maior
-- da pasta, com 29 MB. Uma migration só passaria de 120 KB de SQL e ninguém
-- leria o diff. O corte segue a ordem do próprio documento: aqui vai até a
-- Eutrofização, e a segunda leva pega dos sistemas endócrino e nervoso em
-- diante, com a genética e a embriologia. Foi o que a Química fez em agosto,
-- pela mesma razão.
--
-- ## Três tópicos NÃO entraram, porque já estão no site
--
-- - **Características dos seres vivos** e **Ciclo celular** vieram da 1ª etapa
--   do PAS UEM em 21/08 (`20260821005035`), com o mesmo texto.
-- - **Conceitos-Chave e Estruturas** é nível 0 no documento, mas o conteúdo já
--   vive dentro do `ciclo-celular`, como a última seção dele.
--
-- Reinserir criaria títulos repetidos, e título repetido deixa o trigger
-- `sync_conexoes_resumo` sem destino definido. É a mesma conferência que a
-- Língua Portuguesa exigiu ontem: título a título contra o banco, antes de
-- escrever.
--
-- Os dois resumos que ficaram são de `pas-uem`, não de `comum`. Não mexi neles:
-- mudar o processo de conteúdo publicado é decisão de produto, e não havia nada
-- forçando aqui (ao contrário da Estatística, onde o título repetido forçava).
--
-- ## O que muda de FORMA
--
-- Mesmo mapeamento das outras migrations, com a regra do sublinhado já na
-- versão de três casos que a Filosofia fixou: grifo que cobre o item inteiro
-- vira texto puro, grifo que destaca um trecho dentro da frase vira `<strong>`,
-- e o `:` do começo do item continua marcando o termo sozinho.
--
-- A tabela das relações ecológicas veio como tabela DE VERDADE no `.docx` e
-- entra como `<table>`, com as seis colunas e as catorze linhas.
--
-- ## As dezesseis figuras
--
-- 7,41 MB no documento, 0,66 MB no repositório em WebP q82 — a maior economia
-- de todas as levas, porque o autor colou PNG de resolução alta.
--
-- Duas ganharam nome pelo que mostram e não pelo tópico onde estão:
-- `hemacias-nos-tres-meios` (que ilustra a osmose) e `ciclo-do-carbono-esquema`
-- (o diagrama de setas, para não confundir com os dois ciclos ilustrados).
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"Fatores"** é o título de um resumo, e sozinho não diz de que fatores se
--   trata (são os bióticos e abióticos de um ecossistema). Está assim no
--   documento, em nível 0, entre a Especiação e o Fluxo de energia.
-- - "Membrana plasmática: organela celular" — a membrana não é organela.
-- - "fibras de fuso mitódico", por mitótico, no Citoesqueleto.
-- - "digestão de componente celulares", no singular, no Lisossomo.
-- - "acreditava se", "respeitá los" e "analisá los" sem hífen.
-- - "identificou micro-organismo na água" e "encontrou diversos
--   micro-organismo", no singular, em Leeuwenhoek e Needham.
-- - "que teriam encontrado nessa condições favoráveis", na Panspermia.
-- - "novas forma de seres teriam surgido, os autotróficos", na hipótese
--   heterotrófica.
-- - "Seleção natural" aparece duas vezes: como um dos quatro pontos do
--   Darwinismo e de novo como fator evolutivo no Neodarwinismo.
-- - "Esdovagismo", que é dulotismo (ou "escravagismo"), na tabela das relações.
-- - "Sinfilia | humanos x abelha" — a sinfilia clássica é a das formigas com os
--   afídeos; a linha do pulgão já está ali ao lado.
-- - "Louva-Deus | Comem uns aos outros (=sp)" usa uma abreviação que só aparece
--   nessa célula.
--
-- As quatro fórmulas destes resumos passaram pelo KaTeX antes de entrar. Não há
-- `[[wikilink]]`. `on conflict (slug) do nothing` deixa rodar de novo sem
-- duplicar.

-- ============================================
-- 1. A célula e suas organelas
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'membrana-plasmatica',
  'Membrana plasmática',
  'biologia',
  'comum',
  'O mosaico fluido: bicamada, proteínas e glicocálice, e a permeabilidade que seleciona o que entra.',
  '<p>organela celular que separa o meio extracelular do meio intracelular; dá suporte e proteção ao conteúdo celular. Tem permeabilidade seletiva (semipermeável).</p><ul><li><p>Representa-se segundo o <strong>modelo mosaico fluido</strong> proposto por Singer e Nicolson.</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/membrana-mosaico-fluido.webp" alt="Corte da membrana no modelo mosaico fluido, com a bicamada fosfolipídica ao centro e, encaixados nela, colesterol, proteína periférica, proteína transmembranar, proteína de canal com poro, glicolipídio e glicoproteínas com carboidratos voltados para o fluido extracelular." style="width:100%" data-largura="100%"></figure><p>É composta por:</p><ul><li><p>Bicamada fosfolipídica: duas camadas de fosfolipídeos;</p></li><li><p>Proteínas: canais ou carreadoras;</p></li><li><p>Glicocálice ou glicoproteínas: estruturas compostas por carboidratos ligados às proteínas e aos lipídeos da membrana.</p><ul><li><p>Reconhecem substâncias e outras células;</p></li><li><p>Presentes somente em células animais e protistas;</p></li><li><p>Retém nutrientes e enzimas;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'transporte-atraves-da-membrana',
  'Transporte através da membrana',
  'biologia',
  'comum',
  'Passivo e ativo: difusão, osmose e os três meios, contra a bomba de sódio e potássio e as endocitoses.',
  '<h2 data-corrido="sim">Passivo:</h2><p>sem gasto de energia (ATP);</p><ul><li><p>Difusão simples: passagem de soluto do meio + concentrado para o - concentrado;</p></li><li><p>Difusão facilitada: passagem de soluto do meio + concentrado para o - concentrado com auxílio de proteínas carreadoras;</p></li><li><p>Osmose: passagem de solvente (água) do meio hipotônico para o meio hipertônico. Aquaporinas garantem o processo, funcionando como poros.</p><ul><li><p>Solução (meio) isotônica: a concentração de soluto <strong>é igua</strong>l dentro e fora da célula.</p></li><li><p>Solução (meio) hipertônica: a concentração de soluto <strong>é maior fora</strong> da célula do que dentro.</p></li><li><p>Solução (meio) hipotônica: a concentração de soluto <strong>é menor fora</strong> da célula do que dentro.</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/hemacias-nos-tres-meios.webp" alt="Hemácias nos três meios: normais em solução isotônica, inchadas e rompidas em solução hipotônica, e murchas com a borda recortada em solução hipertônica." style="width:100%" data-largura="100%"></figure><ul><li><p>Plasmólise: <strong>A célula vegetal</strong> perde água e a membrana se descola da parede celular ao ser colocada em uma solução hipertônica.</p></li></ul><h2 data-corrido="sim">Ativo:</h2><p>com gasto de energia (ATP), contra o gradiente de concentração</p><ul><li><p>Bomba de sódio e potássio: transporte de íons, mantendo a diferença de potencial elétrico.</p></li><li><p>Fagocitose: ingestão de grandes partículas;</p></li><li><p>Pinocitose: ingestão de líquidos;</p></li><li><p>Exocitose: liberação de substâncias para fora da célula;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/celula-animal.webp" alt="Esquema da célula animal com as organelas anotadas e o destaque para as exclusivas dela: centríolos, que formam as fibras do fuso e os cílios e flagelos, e lisossomos, da digestão celular." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/celula-vegetal.webp" alt="Esquema da célula vegetal com as organelas anotadas e o destaque para as exclusivas dela: vacúolo, de armazenamento e osmorregulação, e plastos como o cloroplasto, além da parede celular e do plasmodesmo." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'citoplasma',
  'Citoplasma',
  'biologia',
  'comum',
  'O espaço entre a membrana e o núcleo, e o que a célula eucarionte guarda nele.',
  '<p>espaço delimitado pela membrana plasmática.</p><ul><li><p>Está presente em todas as células,</p></li><li><p>No caso da <strong>célula eucarionte</strong>:</p><ul><li><p>Compreende a porção entre a membrana plasmática e o envoltório nuclear;</p></li><li><p>Presença de núcleo;</p></li><li><p>Diversas organelas membranosas.</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'citosol',
  'Citosol',
  'biologia',
  'comum',
  'A parte líquida do citoplasma, e o que está dissolvido nela.',
  '<p>parte líquida do citoplasma;</p><ul><li><p>Contém: vitaminas, sais, lipídeos e aminoácidos;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'citoesqueleto',
  'Citoesqueleto',
  'biologia',
  'comum',
  'Microtúbulos, microfilamentos e filamentos intermediários — que proteína e que função em cada um.',
  '<ul><li><p>Funções: formação da estrutura celular, participa da movimentação celular e sustentação celular;</p></li></ul><p>Tipos de filamento:</p><h2>Microtúbulos:</h2><ul><li><p>Proteína: tubulina</p></li><li><p>Formação de cílios e flagelos;</p></li><li><p>Divisão celular — fibras de fuso mitódico;</p></li></ul><h2>Microfilamentos:</h2><ul><li><p>Proteínas: actina e miosina;</p></li><li><p>Movimentos celulares: pseudópodes;</p></li><li><p>Ciclose: movimento do citoplasma;</p></li></ul><h2>Filamentos intermediários:</h2><ul><li><p>Proteína: queratina;</p></li><li><p>Composição de cabelos e unhas;</p></li><li><p>Suporte estrutural e resistência mecânica à célula.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'mitocondria',
  'Mitocôndria',
  'biologia',
  'comum',
  'Onde o ATP é produzido — e a organela que tem ribossomo e se autoduplica.',
  '<ul><li><p>Funções: produz ATP;</p></li><li><p>Respiração aeróbia;</p></li><li><p>Presença de ribossomos;</p></li><li><p>Autoduplicação.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'complexo-golgiense',
  'Complexo Golgiense',
  'biologia',
  'comum',
  'A face cis e a face trans, e o que sai dali: lisossomos, secreção e o acrossomo.',
  '<ul><li><p>Funções: produção de lisossomos, secreção molecular, modificação de substâncias e formação do acrossomo do espermatozóide;</p></li><li><p>Apresenta duas faces: cis e trans;</p></li><li><p>4 a 20 bolsas (cisternas) achatadas e empilhadas.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'lisossomo',
  'Lisossomo',
  'biologia',
  'comum',
  'A digestão intracelular, com a autofagia e a heterofagia.',
  '<ul><li><p>Funções: digestão intracelular, autofagia (digestão de componente celulares) e heterofagia (digestão de componentes extracelulares)</p></li><li><p>Formadas a partir do sistema golgiense, com enzimas digestivas previamente sintetizadas no retículo endoplasmático rugoso.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'centriolo',
  'Centríolo',
  'biologia',
  'comum',
  'Onde fica, do que é feito e o que ele forma.',
  '<ul><li><p>Funções: formação de cílios e flagelos;</p></li><li><p>Localizado no centrossomo;</p></li><li><p>Composição: tubulina.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ribossomos',
  'Ribossomos',
  'biologia',
  'comum',
  'A síntese de proteínas: duas subunidades, feitas no nucléolo, presentes em toda célula.',
  '<ul><li><p>Funções: síntese de proteínas;</p></li><li><p>Visível apenas no microscópio eletrônico;</p></li><li><p>Presente em todas as células;</p></li><li><p>Apresenta duas subunidades;</p></li><li><p>Produzidas no nucléolo;</p></li><li><p>Aderidos ao retículo endoplasmático granuloso/rugoso.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'reticulo-endoplasmatico-rugoso',
  'Retículo Endoplasmático Rugoso',
  'biologia',
  'comum',
  'O que tem ribossomo grudado, e por isso sintetiza proteína.',
  '<ul><li><p>Funções: síntese de proteínas;</p></li><li><p>Presença de ribossomos;</p></li><li><p>Transporte e armazenamento;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'reticulo-endoplasmatico-liso',
  'Retículo Endoplasmático Liso',
  'biologia',
  'comum',
  'Lipídeos, desintoxicação e o estoque de cálcio.',
  '<ul><li><p>Funções: síntese de lipídeos, desintoxicação, armazenamento de <span data-type="inline-math" data-latex="Ca^{++}"></span>;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'cloroplasto',
  'Cloroplasto',
  'biologia',
  'comum',
  'A fotossíntese e o pigmento que lhe dá a cor.',
  '<ul><li><p>Funções: fotossíntese, produção de oxigênio;</p></li><li><p>Pigmento verde: clorofila;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'vacuolo',
  'Vacúolo',
  'biologia',
  'comum',
  'Armazenar, controlar a osmose e, no pulsátil, expulsar o excesso de água.',
  '<ul><li><p>Funções: armazenar substâncias, controle osmótico, pulsátil (regula a quantidade de água, elimina o excesso de água);</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/organelas-da-celula.webp" alt="Célula ao centro com setas apontando para o desenho ampliado de cada organela: mitocôndria, sistema golgiense, lisossomos, centríolos, plasmalema, retículo endoplasmático liso e rugoso, ribossomos, núcleo com nucléolo e DNA." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 2. A origem da vida e a evolução
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'teorias-de-origem-da-vida',
  'Teorias de origem da vida',
  'biologia',
  'comum',
  'Da abiogênese à evolução química, com os experimentos que derrubaram cada uma.',
  '<h2 data-corrido="sim">Teoria criacionista:</h2><p>as diferentes formas de vida surgiram através da criação divina;</p><ul><li><p>Foge ao campo de ação do raciocínio científico, não podendo ser testada e nem refutada pelos métodos usados pela ciência;</p></li></ul><h2 data-corrido="sim">Abiogênese:</h2><p>alguns tipos de materiais possuem um tipo de “princípio ativo” capaz de gerar vida; Os principais defensores da abiogênese foram:</p><ul><li><p>Desde a antiguidade clássica, durante a vida do filósofo grego <strong>Aristóteles</strong>, acreditava se que a vida pudesse ser gerada espontaneamente, sem a participação de outros seres vivos e com a presença de uma força vital (vegetativa);</p></li><li><p>Van Helmont (1577): Divulgou uma receita para criar ratos a partir de uma camisa suada em contato com gérmen de trigo, abandonada em um lugar escuro, após 21 dias, produzindo ratos. Neste caso, o princípio ativo seria o suor humano;</p></li><li><p>Leeuwenhoek (1674): com o surgimento do microscópio, identificou micro-organismo na água, partes do corpo, no solo, etc.;</p></li><li><p>Needham (1745): analisou caldos nutritivos de carne aquecidos e fechados e encontrou diversos micro-organismo;</p></li></ul><h2 data-corrido="sim">Biogênese:</h2><p>um ser vivo só pode ser originado a partir de um ser vivo preexistente;</p><ul><li><p>Vários cientistas provaram que um ser vivo só se origina de outro ser vivo e contestaram a abiogênese. Os principais defensores da biogênese foram:</p><ul><li><p>Francesco Redi (1626): para provar a biogênese, colocou pedaços de carne crua dentro de frascos, deixando alguns abertos. Depois de vários dias, as larvas só apareceram na carne do frasco aberto. Redi observou que as moscas colocavam ovos sobre a carne e concluiu que a geração espontânea não tinha validade;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/experimento-de-redi.webp" alt="Experimento de Redi em três vidrarias com carne: a aberta, onde as moscas põem ovos e aparecem larvas; a coberta por gaze, com as larvas sobre a gaze; e a selada, onde nada aparece." style="width:100%" data-largura="100%"></figure><ul><li><p>Spallanzani (1770): contestou Needham repetindo seu experimento, porém ao invés de aquecer ele ferveu os caldos de carne tornando-os estéreis;</p></li><li><p>Louis Pasteur (1822): provou definitivamente a biogênese realizou um experimento com balão do tipo pescoço de cisne. O experimento demonstrou que mesmo após ter o material fervido, o mesmo não perdia a “força vital”, como acreditavam os defensores da abiogênese. Logo após a fervura, o pescoço da vidraria foi quebrado e houve o surgimento dos microrganismos;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/experimento-de-pasteur.webp" alt="Os cinco passos do experimento do pescoço de cisne: caldo no frasco, gargalo esticado e curvado, caldo fervido e esterilizado, caldo sem microrganismos com a poeira retida na curva, e o caldo com microrganismos depois que o gargalo é quebrado." style="width:100%" data-largura="100%"></figure><h2 data-corrido="sim">Teoria cosmogônica (Panspermia):</h2><p>supõe que a Terra tenha sido contaminada por microrganismos vindos do espaço, através de meteoros que teriam encontrado nessa condições favoráveis para evoluírem;</p><ul><li><p>Não é muito aceita pelo fato de que as formas de vida conhecidas hoje não resistiriam às adversidades cósmicas;</p></li></ul><h2 data-corrido="sim">Evolução química:</h2><p>compostos simples presentes na Terra primitiva passaram por diversas reações e formaram compostos tão complexos ao ponto de conceber seres vivos;</p><ul><li><p>Hipótese mais aceita atualmente;</p></li><li><p>Alexander Oparin: propôs que a atmosfera da Terra primitiva era rica em gases como metano, amônia, hidrogênio e vapor d’água. Segundo ele, essa atmosfera, em combinação com energia (como raios e calor), teria permitido a formação das primeiras moléculas orgânicas;</p></li><li><p>John Haldane: trabalhando de forma independente, chegou a conclusões semelhantes. Ele sugeriu que os oceanos primitivos funcionavam como uma "sopa nutritiva", onde moléculas orgânicas se acumularam e reagiram ao longo de milhões de anos;</p></li><li><p>A evolução do metabolismo pode ser explicada por duas hipóteses:</p><ul><li><p>Hipótese heterotrófica: os primeiros seres vivos eram incapazes de sintetizar o seu próprio alimento, sendo assim, obtinham seus nutrientes de fontes externas. À medida que foram se multiplicando, houve competição e a partir daí novas forma de seres teriam surgido, os autotróficos;</p><ul><li><p>Fermentação → Fotossíntese → Respiração aeróbica;</p></li></ul></li><li><p>Hipótese autotrófica: as primeiras células formadas utilizavam a energia proveniente da oxidação de substâncias inorgânicas para obterem os compostos orgânicos (nutrientes), ou seja, por quimiossíntese;</p><ul><li><p>Quimiossíntese → Fermentação → Fotossíntese → Respiração aeróbica;</p></li></ul></li></ul></li><li><p>Experimento de Miller-Urey: seu objetivo era testar se moléculas orgânicas essenciais poderiam surgir espontaneamente a partir das condições que imitavam a atmosfera primitiva da Terra;</p><ul><li><p>Forneceu evidências experimentais para teorias sobre a origem da vida, demonstrando que compostos inorgânicos poderiam ter se formado por processos químicos naturais, a partir da eletricidade e alta temperatura presentes na Terra primitiva;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/experimento-de-miller-urey.webp" alt="Aparelho de Miller-Urey com as quatro partes marcadas: A, o balão de água aquecido; B, a câmara de gases com eletrodos e faísca elétrica; C, o condensador resfriado; D, o reservatório onde se acumula a água com compostos orgânicos." style="width:100%" data-largura="100%"></figure><ul><li><p>A: aquecimento de uma solução;</p></li><li><p>B: descargas elétrica sobre os gases;</p></li><li><p>C: Condensação do vapor;</p></li><li><p>D: acúmulo do líquido resultante;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'lamarckismo',
  'Lamarckismo',
  'biologia',
  'comum',
  'As duas leis: uso e desuso, e a transmissão dos caracteres adquiridos.',
  '<h2 data-corrido="sim">Lei do uso e desuso:</h2><p>determinadas partes do corpo podem se desenvolver devido ao seu uso contínuo, ou atrofiar, em razão da falta de uso.</p><h2 data-corrido="sim">Lei da transmissão dos caracteres adquiridos:</h2><p>as características adquiridas ao longo da vida, resultantes do desenvolvimento pelo uso, ou da atrofia por desuso, seriam transmitidas aos descendentes por meio da reprodução.</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'darwinismo',
  'Darwinismo',
  'biologia',
  'comum',
  'Variação, seleção natural, hereditariedade e adaptação — e o que Darwin não soube explicar.',
  '<p>as espécies evoluem ao longo do tempo por meio da seleção natural;</p><h2 data-corrido="sim">Variação:</h2><p>em uma espécie, existem variações entre os indivíduos;</p><h2 data-corrido="sim">Seleção natural:</h2><p>indivíduos com características mais vantajosas para o ambiente têm mais chances de sobreviver e se reproduzir;</p><h2 data-corrido="sim">Hereditariedade:</h2><p>essas características vantajosas são passadas para os descendentes;</p><h2 data-corrido="sim">Adaptação:</h2><p>ao longo de muitas gerações, essas mudanças acumuladas levam à evolução das espécies;</p><h2 data-corrido="sim">Falha de Darwin:</h2><p>não soube explicar a origem da variabilidade entre os indivíduos e como as características eram passadas de geração a geração;</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'neodarwinismo',
  'Neodarwinismo',
  'biologia',
  'comum',
  'Os cinco fatores evolutivos: mutação, recombinação, seleção natural, deriva e migração.',
  '<p>união da teoria da seleção natural de Darwin com os conhecimentos da genética moderna;</p><p>Fatores evolutivos:</p><h2 data-corrido="sim">Mutação:</h2><p>alterações em genes ou cromossomos que produzem novas características.</p><ul><li><p>Tipos de célula que ocorrem:</p><ul><li><p>Somáticas: qualquer célula do corpo menos os gametas;</p></li><li><p>Germinativas: células que formam os gametas e estão localizadas nas gônadas;</p></li></ul></li><li><p>Causa:</p><ul><li><p>Espontâneas: ocorrem sem causa definida. São as mais comuns;</p></li><li><p>Induzidas: ocorrem devido ao contato com agentes mutagênicos. Ex: radiação solar, raio X.</p></li></ul></li></ul><h2>Recombinação gênica:</h2><ul><li><p>Fecundação: formação de filhos com junção de gametas;</p></li><li><p>Crossing-over ou Permutação: troca de pedaços entre cromátides-irmãs de cromossomos homólogos. Acontece na divisão celular.</p></li><li><p>Segregação independente (2ª lei de Mendel): princípio segundo o qual os alelos de genes diferentes (localizados em cromossomos distintos) se distribuem de forma independente para os gametas durante a meiose.</p></li></ul><h2 data-corrido="sim">Seleção natural:</h2><p>indivíduos com características mais vantajosas para o ambiente têm mais chances de sobreviver e se reproduzir.</p><ul><li><p>Seleção direcional: ocorre quando um dos extremos é favorecido.</p></li><li><p>Seleção estabilizadora: atua contra duas características extremas, favorecendo características intermediárias. Ex: bebês humanos com menos ou mais de 3 kg a 4 kg apresentam maiores riscos de mortalidade, desse modo sua frequência na população reduziu-se ao longo do tempo.</p></li><li><p>Seleção disruptiva: ocorre o favorecimento de dois extremos. As características intermediárias, nesse caso, não são selecionadas.</p></li></ul><h2 data-corrido="sim">Deriva genética:</h2><p>mudanças aleatórias que ocorrem na frequência genética de uma população.</p><ul><li><p>Efeito gargalo: quando uma população passa por uma redução significativa e abrupta em seu tamanho;</p></li><li><p>Efeito fundador: quando um pequeno grupo de indivíduos se separa de uma população maior e inicia uma nova população em uma área geográfica separada.</p></li></ul><h2 data-corrido="sim">Migração:</h2><p>também conhecida como fluxo gênico. Os indivíduos que migram entre diferentes populações levam consigo seus genes e, portanto, podem alterar a composição genética da população de destino.</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'especiacao',
  'Especiação',
  'biologia',
  'comum',
  'Os dois isolamentos e as duas especiações: alopátrica e simpátrica.',
  '<p>processo pelo qual uma espécie se divide em duas;</p><h2 data-corrido="sim">Isolamento geográfico:</h2><p>ocorre quando barreiras físicas (como montanhas, rios, desertos, oceanos ou distâncias) separam populações de uma mesma espécie, impedindo o cruzamento entre elas;</p><h2 data-corrido="sim">Isolamento reprodutivo:</h2><p>é a incapacidade de indivíduos de diferentes populações se reproduzirem com sucesso, mesmo que vivam no mesmo local ou entrem em contato;</p><h2 data-corrido="sim">Alopátrica:</h2><p>processo evolutivo em que novas espécies surgem a partir do isolamento geográfico de populações de uma espécie ancestral;</p><h2 data-corrido="sim">Simpátrica:</h2><p>processo evolutivo onde novas espécies surgem de uma espécie ancestral comum que vive na mesma área geográfica, sem separação física;</p>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 3. A ecologia
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'fatores',
  'Fatores',
  'biologia',
  'comum',
  'Os componentes bióticos e abióticos de um ecossistema, e o que cada grupo reúne.',
  '<h2 data-corrido="sim">Bióticos:</h2><p>todos os componentes vivos de um ecossistema;</p><ul><li><p>Formam as relações ecológicas e as cadeias alimentares;</p></li></ul><h2 data-corrido="sim">Abióticos:</h2><p>componentes físicos e químicos não vivos do ambiente;</p><ul><li><p>Climáticos: luz solar, temperatura, vento, umidade, precipitação;</p></li><li><p>Edáficos (do solo): tipo de solo, minerais, pH, textura;</p></li><li><p>Hídricos: água (disponibilidade, profundidade, salinidade).</p></li><li><p>Geológicos: Relevo, rochas, altitude;</p><ul><li><p>A dinâmica entre fatores bióticos e abióticos define o funcionamento e a saúde de um ecossistema, sendo fundamental para a conservação da biodiversidade e recursos naturais;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'fluxo-de-energia-nos-ecossistemas',
  'Fluxo de energia nos ecossistemas',
  'biologia',
  'comum',
  'Os três níveis tróficos, e a diferença entre cadeia e teia alimentar.',
  '<p>nos ecossistemas ocorre a transferência de energia de um organismo para outro em um fluxo unidirecional em que a energia vai sendo dissipada e transformada em calor, denominadas cadeias alimentares;</p><h2 data-corrido="sim">Nível trófico:</h2><p>posição ocupada por uma espécie na cadeia alimentar, determinada pelo número de estágios em que ocorre transferência de energia. Os seres vivos são classificados em três níveis tróficos:</p><ul><li><p>Produtores: captam energia da luz solar (fotossíntese) ou de reações químicas (quimiossíntese) e a transformam em energia química armazenada em moléculas orgânicas (autótrofos);</p><ul><li><p>Ex: plantas, algas, cianobactérias, algumas bactérias quimiossintetizantes.</p></li></ul></li><li><p>Consumidores: organismos heterótrofos de um ecossistema que se alimentam de outros organismos, sejam eles vegetais (consumidores primários) ou animais (consumidores terciários, quaternários, …);</p><ul><li><p>Seres que se alimentam tanto de consumidores quanto produtores são chamados de onívoros e podem ocupar mais de um nível trófico nas teias alimentares de que participam;</p></li><li><p>Ex: nos ecossistemas aquáticos, os consumidores primários são representados pelos organismos do zooplâncton;</p></li></ul></li><li><p>Decompositores: grupo de heterótrofos que transformam matéria orgânica em moléculas inorgânicas. Se alimentam de cadáveres e de restos de seres vivos, como fezes de animais, obtendo energia e matéria necessária para o metabolismo. Permitem reaproveitar elementos químicos.</p></li></ul><h2 data-corrido="sim">Cadeias alimentares:</h2><p>sequência linear de seres vivos em que um organismo serve de alimento para o organismo seguinte;</p><ul><li><p>Devem ser indicados em ordem e conectados por linhas com setas, que indicam corretamente o fluxo de energia. Cada organismo pode ocupar apenas um N.T em uma cadeia alimentar.</p></li><li><p>A análise das cadeias alimentares nos permite ver o crescimento das populações que compõem os níveis tróficos.</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/cadeias-alimentares.webp" alt="Duas cadeias alimentares lado a lado, a terrestre e a aquática, com os níveis tróficos rotulados ao centro: produtores, consumidores primários, secundários, terciários, quaternários e decompositores." style="width:100%" data-largura="100%"></figure><h2 data-corrido="sim">Teias alimentares:</h2><p>conjunto das cadeias alimentares interconectadas;</p><ul><li><p>A extinção de uma espécie na teia pode comprometer todos os outros níveis tróficos, causando um desequilíbrio ecológico;</p></li><li><p>Em uma teia os organismos podem ocupar mais de um N.T, ou seja, podem ser consumidores primários e, ao mesmo tempo, secundários;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/teia-alimentar.webp" alt="Teia alimentar com setas cruzadas ligando plantas, pulgão, joaninha, libélula, borboleta, sapo, pássaro, roedor, serpente e gavião, mostrando que um mesmo animal ocupa mais de um nível." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'relacoes-ecologicas',
  'Relações ecológicas',
  'biologia',
  'comum',
  'Harmônicas e desarmônicas, intra e interespecíficas — as catorze num quadro só.',
  '<h2 data-corrido="sim">Interespecífica:</h2><p>entre seres de diferentes espécies;</p><h2 data-corrido="sim">Intraespecífica:</h2><p>entre seres da mesma espécie;</p><h2 data-corrido="sim">Harmônica:</h2><p>nenhum ser é prejudicado e, pelo menos um é beneficiado;</p><h2 data-corrido="sim">Desarmônica:</h2><p>pelo menos um indivíduo é prejudicado;</p><table><tbody><tr><th><p>Relação</p></th><th><p>+/-</p></th><th><p>Intra inter</p></th><th><p>Desar. harm.</p></th><th><p>Exemplos</p></th><th><p>OBS</p></th></tr><tr><td><p>Sociedade</p></td><td><p>+/+</p></td><td><p>intra</p></td><td><p>harm.</p></td><td><p>abelhas / gorilas</p></td><td><p>-</p></td></tr><tr><td><p>Colônia</p></td><td><p>+/+</p></td><td><p>intra</p></td><td><p>harm.</p></td><td><p>bactérias</p></td><td><p>-</p></td></tr><tr><td><p>Mutualismo</p></td><td><p>+/+</p></td><td><p>inter</p></td><td><p>harm.</p></td><td><p>liquens / (fungos + algas)</p></td><td><p>Obrigatório / Simbiose</p></td></tr><tr><td><p>Protocooperação</p></td><td><p>+/+</p></td><td><p>inter</p></td><td><p>harm.</p></td><td><p>boi e garça</p></td><td><p>Facultativo</p></td></tr><tr><td><p>Comensalismo</p></td><td><p>+/0</p></td><td><p>inter</p></td><td><p>harm.</p></td><td><p>tubarão + rêmora / pássaro-palito + jacaré</p></td><td><p>Transporte ou alimento</p></td></tr><tr><td><p>Inquilinismo</p></td><td><p>+/0</p></td><td><p>inter</p></td><td><p>harm.</p></td><td><p>orquídea + árvore</p></td><td><p>Moradia ou transporte</p></td></tr><tr><td><p>Canibalismo</p></td><td><p>+/-</p></td><td><p>intra</p></td><td><p>desar.</p></td><td><p>Louva-Deus</p></td><td><p>Comem uns aos outros (=sp)</p></td></tr><tr><td><p>Competição intra.</p></td><td><p>-/-</p></td><td><p>intra</p></td><td><p>desar.</p></td><td><p>leões</p></td><td><p>disputam fêmeas, comida, abrigo.</p></td></tr><tr><td><p>Competição inter.</p></td><td><p>-/-</p></td><td><p>inter</p></td><td><p>desar.</p></td><td><p>Leões + hienas</p></td><td><p>disputam tudo, menos fêmeas</p></td></tr><tr><td><p>Amensalismo</p></td><td><p>-/0</p></td><td><p>inter</p></td><td><p>desar.</p></td><td><p>Manada de búfalos correndo nas gramíneas</p></td><td><p>um ser machuca o outro sem ser prejudicado</p></td></tr><tr><td><p>Predatismo</p></td><td><p>+/-</p></td><td><p>inter</p></td><td><p>desar.</p></td><td><p>Leão e zebra</p></td><td><p>(-) presa / (+) predador</p></td></tr><tr><td><p>Parasitismo</p></td><td><p>+/-</p></td><td><p>inter</p></td><td><p>desar.</p></td><td><p>cachorro e carrapato</p></td><td><p>um indivíduo se instala e retira nutrientes do outro</p></td></tr><tr><td><p>Esdovagismo</p></td><td><p>+/-</p></td><td><p>inter</p></td><td><p>desar.</p></td><td><p>formigas sanguinárias + outras formigas</p></td><td><p>-</p></td></tr><tr><td><p>Sinfilia</p></td><td><p>+/-</p></td><td><p>inter</p></td><td><p>desar.</p></td><td><p>pulgão x formiga / humanos x abelha</p></td><td><p>relação de exploração</p></td></tr></tbody></table>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ciclos-biogeoquimicos',
  'Ciclos biogeoquímicos',
  'biologia',
  'comum',
  'Água, carbono e nitrogênio — o caminho de cada elemento entre o vivo e o não vivo.',
  '<p>são padrões de movimento de elementos químicos nos seres vivos e nos componentes abióticos do ecossistema global;</p><h2>Água (hidrológico):</h2><ul><li><p>Não é um elemento químico, mas está intrinsecamente ligada a todos os processos metabólicos;</p></li><li><p>Pode ser considerado sob dois aspectos:</p></li></ul><h3>Ciclo curto:</h3><ul><li><p>A água dos grandes corpos de água (rios, lagos, oceanos) sofre <strong>evaporação</strong> pela ação do calor ambiental e o vapor liberado forma as nuvens;</p></li><li><p>Nas camadas mais altas da atmosfera, o vapor d’água sofre <strong>condensação</strong> e a água líquida volta ao solo na chuva (<strong>precipitação</strong>) infiltrando-se no solo (<strong>infiltração ou percolação</strong>);</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ciclo-curto-da-agua.webp" alt="Bloco-diagrama do ciclo curto da água, com as setas de evaporação nos oceanos, transporte sobre a terra, precipitação, descarga de rios, transpiração e percolação no subsolo." style="width:100%" data-largura="100%"></figure><h3>Ciclo longo:</h3><ul><li><p>Quando está no estado líquido, a água é <strong>absorvida pelos seres vivos</strong> e participa do metabolismo deles (como a fotossíntese) antes de ser devolvida ao ambiente na <strong>respiração</strong> e <strong>transpiração</strong> (nos mamíferos) ou <strong>evapotranspiração</strong> (nas plantas);</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ciclo-longo-da-agua.webp" alt="Ilustração do ciclo da água com as etapas nomeadas: vaporização no mar, condensação nas nuvens, precipitação sobre o morro, infiltração no solo e transpiração das árvores." style="width:100%" data-largura="100%"></figure><h2>Carbono:</h2><h3>Ciclo rápido (biológico):</h3><ul><li><p>Inicia quando organismos autótrofos “sequestram” o CO₂ da atmosfera para ser transformado em <strong>carboidratos</strong> (fotossíntese/quimiossíntese) (<strong>fixação</strong>) que seguidamente são usados pelas plantas e consumidos (<strong>nutrição</strong>) pelos seres vivos que comem essas plantas;</p></li><li><p>O carbono retorna ao ambiente pela <strong>respiração</strong> ou como matéria orgânica que sofrerá <strong>decomposição</strong> liberando novamente CO₂;</p><ul><li><p>Em certas condições ocorridas no passado, restos e cadáveres de grande quantidade de organismos de diversos níveis tróficos ficaram a salvo da decomposição. Os resíduos orgânicos desses seres foram soterrados e suas moléculas preservadas da decomposição. Essas substâncias sofreram lentas transformações e originaram os chamados <strong>combustíveis fósseis</strong>;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ciclo-do-carbono-esquema.webp" alt="Esquema de setas entre CO₂ atmosférico e matéria orgânica: a fotossíntese desce, e a respiração, a combustão e a decomposição sobem de volta." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ciclo-rapido-do-carbono.webp" alt="Ilustração do ciclo rápido do carbono: o sol e a fotossíntese transformando CO₂ em glicose na árvore e no capim, o boi ingerindo o carbono e a seta de respiração devolvendo CO₂ à atmosfera." style="width:100%" data-largura="100%"></figure><h3>Ciclo lento (geológico):</h3><ul><li><p>Sem participação de seres vivos;</p></li><li><p>Quando o CO₂ entra em contato com a chuva, este se dissolve formando uma solução ácida: H₂CO₃;</p></li><li><p>Quando a chuva precipita, o ácido dissolve rochas liberando minerais como sódio, potássio, magnésio, cálcio, etc., estes escoam para corpos d’água para formar <strong>rochas a base de carbono</strong>;</p></li><li><p><strong>A maior parte do carbono se encontra nos oceanos e na crosta terrestre em rochas sedimentares</strong>;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ciclo-lento-do-carbono.webp" alt="Ilustração do ciclo lento do carbono em três passos numerados: a chuva ácida com ácido carbônico, a dissolução dos minerais do solo, e o carbonato que depois de muito tempo vira rocha calcária no fundo do mar." style="width:100%" data-largura="100%"></figure><ul><li><p><strong>As ações humanas influenciam no ciclo global do carbono</strong>, uma vez que elas retiram o carbono armazenado nos depósitos fósseis numa velocidade superior à da absorção do carbono pelo ciclo;</p></li></ul><h2>Nitrogênio:</h2><ul><li><p>Principal reserva de nitrogênio é a atmosfera, sendo 78% de sua composição;</p></li><li><p>Inicia na <strong>fixação</strong>:</p><ul><li><p>Atmosférica: realizada por descargas elétricas (raios) de uma tempestade, que produz, principalmente, um composto nitrogenado chamado de nitrato (NO₃⁻), arrastado pela chuva ao solo, sendo posteriormente assimilado pelas plantas;</p><ul><li><p>Pouco nitrogênio é fixado desta maneira;</p></li></ul></li><li><p>Biológica: realizada por fungos, bactérias, cianobactérias (Nostoc) e <strong>bactérias Rhizobium</strong> presente em raízes de leguminosas, que transformam o <strong>nitrogênio em amônia</strong>;</p></li></ul></li><li><p>Após a fixação, bactérias transformam a amônia em nitritos (nitrosação) e seguidamente em nitratos (nitratação) na <strong>nitrificação</strong>:</p><ul><li><p>Nitrosação: <span data-type="inline-math" data-latex="NH_{3} (amônia)→N{O_{2}}^{-} (nitrito)"></span></p><ul><li><p>Feito por bactérias <strong>Nitrosomonas</strong> e <strong>Nitrosococcus</strong> por quimiossíntese;</p></li></ul></li><li><p>Nitratação: <span data-type="inline-math" data-latex="N{O_{2}}^{-} (nitrito)→N{O_{3}}^{-} (nitrato)"></span></p><ul><li><p>Feito por bactérias Nitrobacter por quimiossíntese;</p></li></ul></li></ul></li><li><p>Desnitrificação: devolução do N₂ à atmosfera;</p><ul><li><p><span data-type="inline-math" data-latex="N{O_{3}}^{-}→N_{2}"></span></p></li><li><p>Feita por bactérias Pseudomonas (respiração anaeróbica);</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ciclo-do-nitrogenio.webp" alt="Ciclo do nitrogênio com as etapas marcadas de A a F: fixação biológica pelos rizóbios da leguminosa, nutrição, amonificação pelos decompositores, nitrosação e nitratação pelas bactérias nitrosas e nítricas, e desnitrificação devolvendo N₂ à atmosfera." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'eutrofizacao',
  'Eutrofização',
  'biologia',
  'comum',
  'Da entrada de nutrientes à anóxia: as sete etapas que matam um corpo d’água.',
  '<p>acúmulo de matéria orgânica nos ambientes aquáticos, especialmente, onde a água é pouco movimentada, como em rios, lagos e represas;</p><p>Pode ter origem de forma:</p><ul><li><p>Natural: produzida pelos próprios elementos da natureza, ocorrendo de forma espontânea e lenta;</p></li><li><p>Antrópica ou artificial: provocada pelo homem e tem como principal causa a poluição das águas, falta de saneamento, acúmulo de lixo doméstico, despejo de efluentes nas águas e uso de fertilizantes que contaminam o lençol freático. Ocorre de forma rápida;</p></li></ul><p>Etapas:</p><ul><li><p>Aumento de nutrientes: a etapa inicial é a entrada de nutrientes, como nitrogênio e fósforo, na água devido a fatores naturais ou principalmente à ação humana (esgoto, fertilizantes agrícolas, resíduos industriais).</p></li><li><p>Proliferação de algas: o excesso de nutrientes provoca um crescimento explosivo de algas e cianobactérias, que formam uma camada espessa na superfície da água.</p></li><li><p>Bloqueio da luz e morte de plantas: essa camada de algas impede que a luz solar alcance as camadas mais profundas, levando à morte de plantas enraizadas e algas que realizam fotossíntese no fundo do corpo d''água.</p></li><li><p>Decomposição e consumo de oxigênio: as plantas mortas se tornam matéria orgânica, que é decomposta por bactérias aeróbicas. Esse processo consome o oxigênio dissolvido na água, reduzindo drasticamente sua concentração.</p></li><li><p>Hipóxia e morte de organismos: a falta de oxigênio causa a morte de peixes e outros animais que dependem dele para a respiração. Isso aumenta ainda mais a quantidade de matéria orgânica no fundo do corpo d''água.</p></li><li><p>Anóxia e produção de gases tóxicos: na ausência total de oxigênio (anóxia), a decomposição passa a ser feita por bactérias anaeróbicas, que liberam gases tóxicos como gás sulfídrico (odor de ovo podre) e metano.</p></li><li><p>Desequilíbrio e perda de biodiversidade: o ecossistema aquático fica desequilibrado, com a perda da maior parte da sua biodiversidade e a proliferação de organismos que sobrevivem em condições anóxicas.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- Guardas
-- ============================================
do $$
declare
  n_novos int;
  n_figuras int;
  n_titulos int;
begin
  select count(*) into n_novos
    from resumos
   where materia_slug = 'biologia' and processo_slug = 'comum';
  if n_novos <> 24 then
    raise exception 'esperava 24 resumos de Biologia em comum, encontrei %', n_novos;
  end if;

  select count(*) into n_figuras
    from (select regexp_matches(corpo, '<figure', 'g') from resumos
           where materia_slug = 'biologia' and processo_slug = 'comum') x;
  if n_figuras <> 16 then
    raise exception 'esperava 16 figuras nesta leva da Biologia, encontrei %', n_figuras;
  end if;

  select count(*) into n_titulos
    from (select titulo from resumos group by titulo having count(*) > 1) x;
  if n_titulos <> 0 then
    raise exception '% títulos repetidos no acervo', n_titulos;
  end if;
end $$;

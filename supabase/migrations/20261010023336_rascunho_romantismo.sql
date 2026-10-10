-- Romantismo: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- O resumo `romantismo` (literatura, processo `comum`, sem pai) já existia,
-- com ~4 mil caracteres no formato antigo, copiado de `Literatura.docx`, e
-- nenhum tópico de edital ligado. Conferido no banco em 10/10/2026. O autor
-- decidiu reescrevê-lo no modelo novo. Por isso esta migration é um UPDATE no
-- slug `romantismo`, e não um insert: id, slug, título, processo e pai ficam
-- como estão, e o evento "Romantismo" da linha do tempo (eventos.resumo_id)
-- continua ligado. Nenhum resumo cita [[Romantismo]] hoje.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2025/Resumos 4° bimestre/Resumo para Simulado Harmonia_
--    2º dia.docx`, LITERATURA, §00003–00085 do extrator (o mais completo).
--    Confrontado com `Materias e conteúdos feitos/Literatura.docx`
--    §00192–00239 e `Resumos 2025/Resumos 4° bimestre/Resumo para PR2G2.docx`
--    §00017–00069. "Casa Velha" (Harmonia §00087–00097) é outro tópico e
--    ficou de fora.
-- 2. Edital: PASSE, 2ª etapa, "Sentimento nacionalista, indianismo,
--    idealização amorosa, subjetividade, presença do pessimismo em obras
--    literárias;".
-- 3. Provas (conferidas no PDF, gabarito recalculado):
--    - PAS-UEM 2019, etapa 2, questão 33 (gabarito 11), pdfs/pas19/E2G1.pdf, p. 14 — a questão;
--    - PAS-UEM 2015, etapa 2, questão 33 (13), pdfs/pas15/E2G1CG.pdf, p. 18 — pegadinha, item 02;
--    - PAS-UEM 2016, etapa 2, questão 35 (16), pdfs/pas16/E2G1.pdf, p. 15 — pegadinha, item 01;
--    - PAS-UEM 2018, etapa 2, questão 33 (25), pdfs/pas18/E2G1.pdf, p. 15 — pegadinha (02) e a Obs. de ruptura (01);
--    - PAS-UEM 2020, etapa 2, questão 34 (14), pdfs/pas20/e2.pdf, p. 14 — pegadinha, item 16;
--    - PAS-UEM 2022, etapa 2, questão 34 (14), pdfs/pas22/E2.pdf, p. 13 — pegadinha, item 01.
--
-- ## O que difere do caderno
-- Decisões do autor (parada de erro de conteúdo, 10/10/2026):
-- 1. Espumas flutuantes: "NÃO pertence à 3ª geração, seu teor é mais
--    característico da 2ª" → "reúne a lírica amorosa de Castro Alves, mais
--    próxima da 2ª geração, e poemas sociais como 'O livro e a América'".
-- 2. Senhora: o enredo saiu (o caderno dizia "cem mil-réis" e "tutor dele";
--    no romance são cem contos de réis e Lemos, tutor de Aurélia). Senhora
--    fica só citada na Trilogia urbana.
-- 3. As características "índio como herói nacional", "nacionalismo",
--    "idealização" e "prosa poética" ficam nas duas partes: na 1ª geração da
--    poesia (como em Literatura.docx) e no romance indianista (como em
--    Harmonia e PR2G2). Na poesia, "O romance exalta" → "exalta" e "Prosa
--    poética e linguagem que mistura" → "Linguagem: mistura", para a frase
--    não ficar falsa. Os itens próprios da poesia do Harmonia continuam.
-- 4–8. Mantidos como no caderno, de forma consciente: a citação de Casimiro
--    de Abreu ("que eu tenho"), "a asa de graúna", "Lágrimas de Iracema",
--    Iracema acreditar que Martim foi morto, "Suspiros Poéticos" (sem "e
--    Saudades") e a 1ª instituição de ensino superior junto ao RJ.
-- Acréscimos: as frases de abertura dos grafos "Europa", "Características
-- literárias gerais" e "As três gerações"; a Obs. de ruptura (PAS-UEM 2018);
-- a tabela das gerações (montada a partir do "RESUMINDO" e dos autores do
-- caderno); a tabela indianista × urbano (a partir da "Diferença" do caderno).
-- Forma: enredos de Iracema e Lucíola em itens; "Teixeira e Souza" →
-- "Teixeira e Sousa"; "(de comício ou de grandiloquente)" → "(de comício ou
-- grandiloquente)"; os traços "- " das células da tabela retirados.
--
-- ## Edital
-- Ligado: PASSE, 2ª etapa, o tópico acima (coberto inteiro). De fora, por
-- cobertura pela metade: PASSE 2 "Romantismo em Portugal e no Brasil,
-- Realismo-naturalismo…"; PASSE 1 "Obras de leitura obrigatória –
-- I-Juca-Pirama…"; PAS UEM 2 "Gonçalves Dias / Álvares de Azevedo / Castro
-- Alves - Poemas selecionados:".

update resumos
   set definicao = 'A escola literária da burguesia no século XIX: contexto, características, as três gerações da poesia e os romances da prosa.',
       corpo = '<p>Escola literária da burguesia no século XIX;</p>
<ul><li><p><strong>Contexto:</strong> Revolução Francesa, Revolução Industrial e Independência do Brasil;</p></li>
<li><p><strong>No Brasil:</strong> de 1836 a 1881, em poesia e prosa;</p></li>
<li><p><strong>Poesia:</strong> as três gerações românticas;</p></li>
<li><p><strong>Prosa:</strong> os romances indianista, urbano, regional e histórico.</p></li></ul>
<h2 data-corrido="sim">Europa:</h2>
<p>principais autores do Romantismo europeu;</p>
<ul><li><p><strong>Victor Hugo:</strong> <em>Os miseráveis</em> → francês;</p></li>
<li><p><strong>Lord Byron:</strong> romantizar a morte → inglês.</p></li></ul>
<h2 data-corrido="sim">Romantismo no Brasil:</h2>
<p>poesia e prosa compõem o movimento no Brasil (ver [[Gêneros literários]]);</p>
<ul><li><p><strong>Início:</strong> 1836, com a obra <em>Suspiros Poéticos</em>, do autor Gonçalves de Magalhães;</p></li>
<li><p><strong>Fim:</strong> o Romantismo encerra em 1881, com a introdução do Realismo, com Machado;</p></li>
<li><p><strong>Na poesia:</strong> as três gerações românticas.</p></li></ul>
<h3 data-corrido="sim">Contexto histórico:</h3>
<p>surgiu no Brasil após a Independência (1822) e foi impulsionado pela necessidade de criar uma identidade nacional, rompendo com os padrões portugueses e valorizando a cultura e os elementos genuinamente brasileiros, como o indígena e a natureza;</p>
<ul><li><p>[[Revolução Francesa]];</p></li>
<li><p>[[Revolução Industrial]];</p></li>
<li><p>Independência do Brasil;</p></li>
<li><p>crescimento da corte brasileira: o RJ;</p></li>
<li><p>inauguração da 1ª biblioteca do Brasil;</p></li>
<li><p>inauguração de um centro de belas-artes no RJ, assim como da 1ª instituição de ensino superior.</p></li></ul>
<h2 data-corrido="sim">Características literárias gerais:</h2>
<p>traços comuns à poesia e à prosa românticas;</p>
<table><tbody><tr><td><p>Sentimentalismo</p></td><td><p>Presença de heróis</p></td><td><p>Saudosismo</p></td></tr>
<tr><td><p>Subjetividade</p></td><td><p>Narrativas lineares</p></td><td><p>Nacionalismo → patriotismo</p></td></tr>
<tr><td><p>Idealização dos personagens</p></td><td><p>Descritivismo</p></td><td><p>Lutas sociais</p></td></tr>
<tr><td><p>Religiosidade</p></td><td><p>Bom selvagem (herói nativo)</p></td><td><p>Fantasias</p></td></tr>
<tr><td><p>Escapismo</p></td><td><p>Ultrarromantismo</p></td><td><p>Morte/pessimismo</p></td></tr>
<tr><td><p>Presença de finais felizes</p></td><td><p></p></td><td><p></p></td></tr></tbody></table>
<ul><li><p><strong>Obs:</strong> o Romantismo rompe com os padrões clássicos de beleza (ver [[Arcadismo]]) e cria uma identidade estética para a burguesia ascendente e uma identidade própria para o Brasil (PAS-UEM 2018, 2ª etapa).</p></li></ul>
<h2 data-corrido="sim">As três gerações da poesia romântica no Brasil:</h2>
<p>nacionalista/indianista, ultrarromântica/mal do século e condoreira/social;</p>
<h3 data-corrido="sim">1ª geração:</h3>
<p>indianista / nacionalista;</p>
<ul><li><p>valoriza o bom-selvagem, ou seja, vê o índio como herói, valente e guerreiro;</p></li>
<li><p><strong>Índio como herói nacional;</strong></p></li>
<li><p><strong>Nacionalismo:</strong> exalta a natureza e a formação do povo brasileiro;</p>
<ul><li><p>presença de patriotismo: valorização/amor pela nação;</p></li></ul></li>
<li><p><strong>Idealização:</strong> a figura do indígena é idealizada, buscando uma identidade nacional baseada em seu passado;</p></li>
<li><p><strong>Linguagem:</strong> mistura lirismo e a criação de um Brasil épico;</p></li>
<li><p><strong>Ex:</strong> <em>I-Juca Pirama</em> e <em>Os Timbiras</em> (de Gonçalves Dias);</p></li>
<li><p><strong>Ex:</strong> <em>Canção do Exílio</em> – Gonçalves Dias;</p></li>
<li><p><strong>Outro autor importante:</strong> Gonçalves de Magalhães.</p></li></ul>
<h3 data-corrido="sim">2ª geração:</h3>
<p>mal do século / ultrarromântica / byronismo;</p>
<ul><li><p>textos mais pessimistas, que tratam sobre a morte;</p></li>
<li><p><strong>Escapismo:</strong> fuga da realidade;</p></li>
<li><p>fantasia;</p></li>
<li><p>amor platônico;</p></li>
<li><p>a mulher pode ser tratada como pura (virgem) ou sensualizada;</p></li>
<li><p>religiosidade;</p></li>
<li><p>gótico;</p></li>
<li><p>boemia;</p></li>
<li><p><strong>Principais autores:</strong></p>
<ul><li><p>Álvares de Azevedo: <em>Lira dos 20 anos</em> / <em>Noite na Taverna</em>;</p></li>
<li><p>Casimiro de Abreu: <em>Meus 8 anos</em> → “Oh, que saudades que eu tenho, da aurora da minha vida”;</p></li>
<li><p>Fagundes Varela;</p></li>
<li><p>Junqueira Freire.</p></li></ul></li></ul>
<h3 data-corrido="sim">3ª geração:</h3>
<p>condoreira / social;</p>
<ul><li><p>abolição da escravatura;</p></li>
<li><p>liberdade;</p></li>
<li><p>poesia social (de comício ou grandiloquente);</p></li>
<li><p><strong>Poeta dos escravos:</strong></p>
<ul><li><p>Castro Alves: <em>Navio Negreiro</em> / <em>Os Escravos</em>;</p></li>
<li><p><strong>Obs:</strong> <em>Espumas flutuantes</em> reúne a lírica amorosa de Castro Alves, mais próxima da 2ª geração, e poemas sociais como “O livro e a América”.</p></li></ul></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>1ª geração</strong></p></th><th><p><strong>2ª geração</strong></p></th><th><p><strong>3ª geração</strong></p></th></tr>
<tr><td><p>Nome</p></td><td><p>Nacionalista/Indianista</p></td><td><p>Ultrarromântica/Mal do Século</p></td><td><p>Condoreira/Social</p></td></tr>
<tr><td><p>Foco</p></td><td><p>nacionalismo, exaltação da natureza e do indígena</p></td><td><p>egocentrismo, pessimismo, subjetivismo e idealização amorosa</p></td><td><p>questões sociais, abolicionismo, liberdade e crítica política</p></td></tr>
<tr><td><p>Autores</p></td><td><p>Gonçalves Dias, Gonçalves de Magalhães</p></td><td><p>Álvares de Azevedo, Casimiro de Abreu, Fagundes Varela, Junqueira Freire</p></td><td><p>Castro Alves</p></td></tr></tbody></table>
<h2 data-corrido="sim">Prosa romântica:</h2>
<p>os romances indianista, urbano, regional e histórico;</p>
<h3 data-corrido="sim">Romantismo indianista:</h3>
<p>destaque para José de Alencar;</p>
<ul><li><p><strong>Trilogia indianista de Alencar:</strong> <em>Iracema</em>; <em>Ubirajara</em>; <em>O Guarani</em>;</p></li>
<li><p><strong>Características:</strong></p>
<ul><li><p><strong>Índio como herói nacional;</strong></p></li>
<li><p><strong>Nacionalismo:</strong> o romance exalta a natureza e a formação do povo brasileiro;</p></li>
<li><p><strong>Idealização:</strong> a figura do indígena é idealizada, buscando uma identidade nacional baseada em seu passado;</p></li>
<li><p><strong>Prosa poética:</strong> linguagem que mistura lirismo e a criação de um Brasil épico.</p></li></ul></li></ul>
<h4 data-corrido="sim">Iracema:</h4>
<p>narrativa que tem uma linguagem poética;</p>
<ul><li><p><strong>Parte histórica:</strong> a lenda do estado do Ceará – Lágrimas de Iracema;</p></li>
<li><p>Iracema é integrada à natureza → “seus cabelos são mais negros que a asa de graúna”;</p></li>
<li><p><strong>Enredo:</strong></p>
<ul><li><p>Martim, um colonizador português, se perde e é encontrado por Iracema, a “virgem dos lábios de mel”, que, após um susto inicial, o leva para sua tribo para curá-lo;</p></li>
<li><p>apesar das diferenças culturais e da hostilidade de seu povo, Iracema e Martim se apaixonam;</p></li>
<li><p>Iracema abandona a tribo para viver com Martim e lida com o ressentimento de seu povo, especialmente de Irapuã, que também a desejava;</p></li>
<li><p>o casal tem um filho, Moacir (“filho da dor”), que representa o início de uma nova nação;</p></li>
<li><p>Martim precisa sair para lutar, mas não tem tempo de avisar a amada, fazendo com que Iracema acredite que ele foi morto;</p></li>
<li><p>quando ele retorna, a encontra morrendo de saudade e fraqueza; Iracema morre nos braços de Martim.</p></li></ul></li></ul>
<h3 data-corrido="sim">Romantismo urbano:</h3>
<p>caracterizado pelo cenário (ambiente), pelos costumes (hábitos), pelos trajes e pelo amor entre os apaixonados;</p>
<ul><li><p><strong>Primeiros romances urbanos:</strong></p>
<ul><li><p><em>O filho do pescador</em> – Teixeira e Sousa;</p></li>
<li><p><em>A Moreninha</em> – Joaquim Manuel de Macedo: primeiro romance que a sociedade entende como urbano;</p></li></ul></li>
<li><p><strong>Trilogia urbana de José de Alencar:</strong> <em>Diva</em>; <em>Senhora</em>; <em>Lucíola</em>.</p></li></ul>
<h4 data-corrido="sim">Lucíola:</h4>
<p>narrativa construída em forma de carta, escrita por Paulo, um jovem provinciano, a uma amiga chamada G.M.;</p>
<ul><li><p>Paulo relata sua relação com Lúcia, uma mulher que vive como cortesã (prostituta de luxo) na alta sociedade carioca;</p></li>
<li><p>recém-chegado à cidade, Paulo fica encantado com a beleza e o mistério de Lúcia; ao descobrir a verdade, divide-se entre o amor e o preconceito moral que a sociedade impõe;</p></li>
<li><p>Lúcia, cujo verdadeiro nome é Maria da Glória, foi levada à prostituição por circunstâncias trágicas, mas mantém uma pureza interior e um desejo sincero de redenção;</p></li>
<li><p>a pureza de Paulo desperta em Lúcia o desejo de regeneração; o peso do passado e a condenação moral da sociedade são obstáculos intransponíveis;</p></li>
<li><p><strong>Desfecho:</strong> Lúcia adoece gravemente e morre; sua morte simboliza a purificação e a libertação da personagem, que encontra na morte a redenção que lhe foi negada em vida.</p></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>Romance indianista</strong></p></th><th><p><strong>Romance urbano</strong></p></th></tr>
<tr><td><p>Cenário</p></td><td><p>a natureza</p></td><td><p>a cidade</p></td></tr>
<tr><td><p>Foco</p></td><td><p>a figura do indígena como símbolo nacional</p></td><td><p>os costumes da cidade</p></td></tr>
<tr><td><p>Ex</p></td><td><p><em>Iracema</em>, <em>Ubirajara</em>, <em>O Guarani</em></p></td><td><p><em>A Moreninha</em>, <em>Diva</em>, <em>Senhora</em>, <em>Lucíola</em></p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>Álvares de Azevedo é da 2ª geração (ultrarromântica), não da 3ª (PAS-UEM 2015, 2ª etapa);</p></li>
<li><p>a linguagem romântica não é marcada pelo rigor formal nem por rígidos esquemas de métrica e de rimas (PAS-UEM 2018, 2ª etapa);</p></li>
<li><p><em>Canção do Exílio</em> é romântica, não barroca (PAS-UEM 2016, 2ª etapa);</p></li>
<li><p><em>Lucíola</em> é romance urbano, não indianista: a “asa da graúna” é de <em>Iracema</em> (PAS-UEM 2022, 2ª etapa);</p></li>
<li><p>o verdadeiro nome de Lúcia é Maria da Glória, não Ana da Glória (PAS-UEM 2020, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="d1d9176e-5654-4973-8425-85f42a079650" data-gabarito="11"><p>(PAS-UEM 2019, 2ª etapa) Assinale o que for correto.</p><p>(01) José de Alencar produziu obras que contemplaram diferentes temas importantes do Romantismo brasileiro, como se verifica em seus romances, que podem ser classificados como “indianistas”, “regionalistas”, “urbanos”.</p><p>(02) A produção lírica de Gonçalves Dias teve como um de seus pontos altos os poemas indianistas. Em consonância com a valorização da “cor local”, poemas como “Os timbiras” e “I-Juca Pirama” mostram-se ilustrativos desse momento do Romantismo no Brasil.</p><p>(04) Álvares de Azevedo foi um nome destoante dentre os autores da segunda geração romântica no Brasil, também chamada de “realista”. Sua produção, marcada por um discurso cientificista e repleta de termos técnicos das ciências naturais, faz que ele seja um precursor do naturalismo de meados do século XX.</p><p>(08) A terceira geração romântica no Brasil apresenta produções com temática social, tal como as questões ligadas ao sistema escravagista vigente na época.</p><p>(16) O principal autor do Romantismo brasileiro é o poeta Augusto dos Anjos. Tendo transitado entre as tendências das três gerações românticas, teve como ponto alto de sua produção lírica aquela que se vincula ao ultrarromantismo, trabalhando temas como o amor e a supremacia dos sentimentos e da intuição sobre a objetividade científica.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Alencar escreveu romances indianistas (<em>Iracema</em>, <em>Ubirajara</em>, <em>O Guarani</em>), urbanos (<em>Diva</em>, <em>Senhora</em>, <em>Lucíola</em>) e regionalistas;</p><p>(02) Correta. <em>I-Juca Pirama</em> e <em>Os Timbiras</em>, de Gonçalves Dias, são exemplos da 1ª geração, indianista/nacionalista;</p><p>(04) Incorreta. A 2ª geração é a ultrarromântica (mal do século / byronismo), não “realista”; Álvares de Azevedo é seu principal autor, com textos pessimistas que tratam sobre a morte;</p><p>(08) Correta. A 3ª geração, condoreira/social, aborda a abolição da escravatura e a liberdade (Castro Alves, o poeta dos escravos);</p><p>(16) Incorreta. Augusto dos Anjos não é autor do Romantismo; os principais poetas das três gerações são Gonçalves Dias, Álvares de Azevedo e Castro Alves.</p><p><strong>Soma: 01 + 02 + 08 = 11</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Início do Romantismo no Brasil:</h3>
<p>1836, com <em>Suspiros Poéticos</em>, de Gonçalves de Magalhães;</p>
<h3 data-corrido="sim">Fim do Romantismo no Brasil:</h3>
<p>1881, com a introdução do Realismo, com Machado;</p>
<h3 data-corrido="sim">1ª geração:</h3>
<p>nacionalista/indianista: nacionalismo, exaltação da natureza e do indígena (Gonçalves Dias);</p>
<h3 data-corrido="sim">2ª geração:</h3>
<p>ultrarromântica/mal do século: egocentrismo, pessimismo, subjetivismo e idealização amorosa (Álvares de Azevedo);</p>
<h3 data-corrido="sim">3ª geração:</h3>
<p>condoreira/social: questões sociais, abolicionismo, liberdade e crítica política (Castro Alves);</p>
<h3 data-corrido="sim">Trilogia indianista de Alencar:</h3>
<p><em>Iracema</em>, <em>Ubirajara</em> e <em>O Guarani</em>;</p>
<h3 data-corrido="sim">Trilogia urbana de Alencar:</h3>
<p><em>Diva</em>, <em>Senhora</em> e <em>Lucíola</em>.</p>'
 where slug = 'romantismo';

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'passe'
   and e.etapa = 2
   and e.materia_slug = 'literatura'
   and e.texto = 'Sentimento nacionalista, indianismo, idealização amorosa, subjetividade, presença do pessimismo em obras literárias;'
   and e.resumo_id is null
   and r.slug = 'romantismo';

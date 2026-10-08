-- Vírus: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
--
-- Lacuna conferida no banco em 08/10/2026: nenhum resumo tem "vírus" no
-- título nem no corpo (0 de 258). Tópico de edital: PAS UEM, 2ª etapa,
-- `Caracterização dos vírus.` Só esse edital pede o assunto: processo
-- `pas-uem`.
--
-- **Matéria: Biologia**, pelo cabeçalho do caderno (`BIOLOGIA B`).
--
-- ## Fontes, e só elas
--
-- 1. **Caderno do autor**: `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para
--    PR1G4.docx`, seção `BIOLOGIA B`, parágrafos 00147–00200 do extrator (o
--    `busca_caderno.py procurar` numera §00201–00258), com as duas figuras.
--    O `Resumo para Simulado Poliedro.docx` do mesmo bimestre traz o mesmo
--    texto palavra por palavra (§00685–00738), as mesmas figuras e mais três
--    linhas de edital sem conteúdo (Reprodução do HIV; Tipos de coronavírus;
--    Síndromes e doenças causadas por vírus), que ficaram de fora. O
--    `Resumo para PAS UEM 2° etapa.docx` só traz o edital colado.
-- 2. **Edital**: PAS UEM, 2ª etapa, `Caracterização dos vírus.`
-- 3. **Provas**: PAS-UEM 2016, etapa 2, questão 9 (gabarito 08), em
--    `Documents/UEM-Provas/pdfs/pas16/E2G1.pdf`, p. 7; PAS-UEM 2015, etapa 2,
--    questão 12 (gabarito 11, item 16 incorreto), em
--    `Documents/UEM-Provas/pdfs/pas15/E2G1CG.pdf`, p. 10, para a pegadinha.
--
-- ## O que difere do caderno
--
-- - A definição de "Bacteriófago" e os itens "Composto por", "Ciclo lítico" e
--   "Ciclo lisogênico" saem dos rótulos das duas figuras do caderno; o texto
--   do caderno só traz o título "Bacteriófago:" e as figuras.
-- - O parágrafo de abertura reúne as "Características gerais" do caderno, e
--   o parágrafo sob "Etapas da multiplicação viral" é uma frase de ligação
--   sobre as seis etapas do caderno.
-- - Normalizações de forma: "junto ao capsídeo formam o nucleocapsídeo" →
--   "Nucleocapsídeo: material genético junto ao capsídeo"; "usa de enzimas" →
--   "usa enzimas"; "usar de sua enzima própria" → "usar sua enzima própria";
--   "utiliza da maquinaria" → "utiliza a maquinaria"; "m.p." → "membrana
--   plasmática"; "RNA^{+}" → RNA<sup>+</sup>; nomes de doença em minúscula
--   depois da primeira palavra ("Febre Hemorrágica", "Condiloma Acuminado",
--   "Febre Amarela"); "Rabies Virus" → *Rabies virus*; *Aedes aegypti* em
--   itálico em vez de sublinhado; sujeito "o vírus" explícito em "Fixação" e
--   "Penetração"; "(se fundem a m.p. e saem…)" → "as partículas se fundem à
--   membrana plasmática e saem…".
--
-- ## Edital
--
-- Liga `Caracterização dos vírus.` (coberto inteiro). Fica de fora
-- `Doenças bacterianas, viroses, protozoonoses, verminoses.`: o resumo cobre
-- só as viroses.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'virus',
  'Vírus',
  'biologia',
  'pas-uem',
  'Partículas acelulares e parasitas intracelulares obrigatórios: estrutura, genômica viral, multiplicação e viroses.',
  '<p>partículas acelulares, parasitas intracelulares obrigatórios, que podem cristalizar e têm como material genético DNA ou RNA;</p>
<ul><li><p><strong>Estrutura:</strong> capsídeo, material genético e, em alguns, envelope;</p></li>
<li><p><strong>Genômica viral:</strong> DNA, RNA<sup>+</sup>, RNA<sup>−</sup> e retrovírus;</p></li>
<li><p><strong>Multiplicação viral:</strong> da fixação à liberação de novos vírions;</p></li>
<li><p><strong>Viroses:</strong> doenças causadas por vírus;</p></li>
<li><p><strong>Bacteriófago:</strong> estrutura e ciclos.</p></li></ul>
<h2 data-corrido="sim">Estrutura:</h2>
<p>formato diferenciado: helicoidal, circular, icosaédrico;</p>
<ul><li><p><strong>Capsídeo:</strong> envoltório do material genético composto por capsômeros, que são proteínas (ver [[Macromoléculas]]);</p></li>
<li><p><strong>Material genético:</strong> DNA ou RNA;</p></li>
<li><p><strong>Nucleocapsídeo:</strong> material genético junto ao capsídeo;</p></li>
<li><p><strong>Envelope</strong> (não está presente em todos): bicamada fosfolipídica derivada da membrana plasmática do hospedeiro (ver [[Membrana plasmática]]).</p></li></ul>
<h2 data-corrido="sim">Genômica viral:</h2>
<p>material genético viral: DNA ou RNA;</p>
<ul><li><p><strong>DNA:</strong></p>
<ul><li><p><strong>Composto por:</strong> fita dupla hélice;</p></li>
<li><p><strong>No hospedeiro:</strong> precisa virar RNA para começar a produzir proteínas próprias;</p></li></ul></li>
<li><p><strong>RNA<sup>+</sup>:</strong></p>
<ul><li><p><strong>Composto por:</strong> fita simples com códon de início AUG;</p></li>
<li><p><strong>No hospedeiro:</strong> pode começar imediatamente a produzir proteínas próprias;</p></li></ul></li>
<li><p><strong>RNA<sup>−</sup>:</strong></p>
<ul><li><p><strong>Composto por:</strong> fita simples sem o códon de início;</p></li>
<li><p><strong>No hospedeiro:</strong> usa enzimas para moldar uma fita de RNA<sup>+</sup> e começar a produzir proteínas;</p></li></ul></li>
<li><p><strong>Retrovírus:</strong></p>
<ul><li><p><strong>Composto por:</strong> fita simples;</p></li>
<li><p><strong>No hospedeiro:</strong> precisa usar sua enzima própria, a <strong>transcriptase reversa</strong>, para se tornar DNA, e depois passa pelo mesmo processo que o vírus de DNA.</p></li></ul></li></ul>
<h2 data-corrido="sim">Etapas da multiplicação viral:</h2>
<p>sequência que vai da fixação no hospedeiro à liberação de novas partículas virais;</p>
<h3 data-corrido="sim">Fixação:</h3>
<p>o vírus se fixa na membrana plasmática do hospedeiro;</p>
<h3 data-corrido="sim">Penetração:</h3>
<p>o vírus penetra o hospedeiro; pode ocorrer de várias formas diferentes, como por meio das proteínas de canal;</p>
<h3 data-corrido="sim">Desnudamento:</h3>
<p>o capsídeo libera o material genético no interior da célula;</p>
<h3 data-corrido="sim">Multiplicação viral:</h3>
<p>o genoma viral utiliza a maquinaria celular para sintetizar proteínas e duplicar o material genético;</p>
<h3 data-corrido="sim">Montagem:</h3>
<p>novas proteínas e genomas se organizam, formando novos vírions;</p>
<h3 data-corrido="sim">Liberação:</h3>
<p>novas partículas virais são liberadas;</p>
<ul><li><p><strong>Por lise:</strong> ruptura da célula;</p></li>
<li><p><strong>Por brotamento:</strong> as partículas se fundem à membrana plasmática e saem, ganhando o envelope viral.</p></li></ul>
<h2 data-corrido="sim">Viroses:</h2>
<p>doenças causadas por vírus;</p>
<ul><li><p><strong>Agente etiológico:</strong> causador da doença;</p>
<ul><li><p><strong>Ex:</strong> vírus da dengue;</p></li></ul></li>
<li><p><strong>Reservatório natural:</strong> portador natural do vírus que não fica doente;</p>
<ul><li><p><strong>Ex:</strong> <em>Aedes aegypti</em>;</p></li></ul></li>
<li><p><strong>Profilaxia:</strong> prevenção;</p></li>
<li><p><strong>Arbovírus:</strong> vírus portados por artrópodes (insetos, aracnídeos, crustáceos…);</p></li>
<li><p><strong>Endemia:</strong> casos recorrentes restritos a uma região geográfica específica;</p></li>
<li><p><strong>Epidemia:</strong> número acentuado de casos em regiões diferentes (não intercontinentais);</p></li>
<li><p><strong>Pandemia:</strong> número acentuado de casos que ultrapassou a barreira continental;</p></li>
<li><p><strong>Emergente:</strong> vírus desconhecido, descoberto recentemente;</p></li>
<li><p><strong>Reemergente:</strong> vírus já controlado que volta a ter grande quantidade de casos;</p></li>
<li><p><strong>Doenças e agentes etiológicos:</strong></p>
<ul><li><p>Covid-19: SARS-CoV-2;</p></li>
<li><p>Febre hemorrágica: vírus Sabiá (no Brasil);</p></li>
<li><p>Raiva/Hidrofobia: <em>Rabies virus</em>;</p></li>
<li><p>Aids: HIV;</p></li>
<li><p>Condiloma acuminado: HPV;</p></li>
<li><p>Dengue: vírus da dengue;</p></li>
<li><p>Febre amarela: vírus da febre amarela;</p></li>
<li><p>Gripe/Influenza: Influenza.</p></li></ul></li></ul>
<h2 data-corrido="sim">Bacteriófago:</h2>
<p>vírus que se liga à célula bacteriana e a infecta (ver [[Bacterias]]);</p>
<ul><li><p><strong>Composto por:</strong> capsídeo proteico, pescoço, bainha, placa basal e fibras da cauda;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/bacteriofago-estrutura.webp" alt="Estrutura do bacteriófago: capsídeo proteico no topo, pescoço, bainha, placa basal e fibras da cauda." style="width:70%" data-largura="70%"></figure></li>
<li><p><strong>Ciclo lítico:</strong> o DNA do fago entra na célula, o DNA do hospedeiro é digerido, a célula produz as proteínas do fago e os novos fagos montados são liberados pela lise da célula;</p></li>
<li><p><strong>Ciclo lisogênico:</strong> o DNA do fago se integra ao cromossomo bacteriano como <strong>prófago</strong>, não infeccioso, e é replicado com ele; em casos raros, o prófago se excisa e a célula entra no ciclo lítico.</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/bacteriofago-ciclos-litico-e-lisogenico.webp" alt="Ciclos lítico e lisogênico do bacteriófago: no lítico, o DNA do fago comanda a produção de novos fagos e a célula sofre lise; no lisogênico, o DNA do fago se integra ao cromossomo bacteriano como prófago e é replicado com ele." style="width:100%" data-largura="100%"></figure></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>vírus são acelulares; a prova os chamou de “organismos celulares considerados parasitas intracelulares obrigatórios”, e o item era incorreto (PAS-UEM 2015, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="79fa8514-98f9-49a5-bb83-d6ab93e35723" data-gabarito="08"><p>(PAS-UEM 2016, 2ª etapa) Desde março de 2014, meninas de 11 a 13 anos estão recebendo a vacina contra o papilomavírus humano (HPV), gratuitamente, nas escolas públicas e privadas e nos postos de saúde. O HPV é responsável por 95% dos casos de câncer de colo do útero. Sobre o assunto, e outros correlatos, é correto afirmar que</p><p>(01) por não conter o DNA do vírus, e sim partículas virais criadas em laboratório, a vacina contra o HPV não produzirá os anticorpos específicos contra esse vírus, sendo necessárias várias doses.</p><p>(02) todos os vírus possuem DNA na sua constituição; possuem também grande quantidade de mitocôndrias e retículo endoplasmático rugoso, essenciais para que possam se reproduzir.</p><p>(04) para invadir uma célula, as proteínas integrases do HPV se ligam às proteínas transcriptase presentes na membrana celular da célula hospedeira.</p><p>(08) nos retrovírus, primeiro deve ser sintetizado o DNA, a partir do RNA viral, para que a célula hospedeira possa produzir as proteínas virais.</p><p>(16) os vírus possuem genes para os três tipos de RNA (ribossômico, mensageiro e transportador), pois só utilizam aminoácidos e energia das células hospedeiras.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta, segundo o gabarito oficial: as partículas virais criadas em laboratório, mesmo sem o DNA do vírus, levam à produção de anticorpos específicos;</p><p>(02) Incorreta. O material genético dos vírus é DNA ou RNA; vírus são acelulares e não possuem mitocôndrias nem retículo endoplasmático rugoso;</p><p>(04) Incorreta. A transcriptase reversa é enzima própria dos retrovírus, e não proteína da membrana do hospedeiro; na fixação, o vírus se fixa na membrana plasmática do hospedeiro;</p><p>(08) Correta. No retrovírus, a transcriptase reversa transforma o RNA viral em DNA, que depois passa pelo mesmo processo que o vírus de DNA até a produção de proteínas;</p><p>(16) Incorreta. Na multiplicação viral, o genoma viral utiliza a maquinaria celular do hospedeiro para sintetizar proteínas;</p><p><strong>Soma: 08</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Capsídeo:</h3>
<p>envoltório do material genético, formado por capsômeros (proteínas);</p>
<h3 data-corrido="sim">Nucleocapsídeo:</h3>
<p>material genético junto ao capsídeo;</p>
<h3 data-corrido="sim">Envelope:</h3>
<p>bicamada fosfolipídica derivada da membrana plasmática do hospedeiro; não está presente em todos os vírus;</p>
<h3 data-corrido="sim">RNA<sup>+</sup> e RNA<sup>−</sup>:</h3>
<p>RNA<sup>+</sup> tem o códon AUG e produz proteínas imediatamente; RNA<sup>−</sup> precisa moldar uma fita de RNA<sup>+</sup>;</p>
<h3 data-corrido="sim">Retrovírus:</h3>
<p>RNA de fita simples que a transcriptase reversa transforma em DNA;</p>
<h3 data-corrido="sim">Etapas da multiplicação viral:</h3>
<p>fixação, penetração, desnudamento, multiplicação viral, montagem e liberação;</p>
<h3 data-corrido="sim">Lise e brotamento:</h3>
<p>lise, ruptura da célula; brotamento, fusão à membrana plasmática, ganhando o envelope;</p>
<h3 data-corrido="sim">Endemia, epidemia e pandemia:</h3>
<p>endemia, região específica; epidemia, regiões diferentes; pandemia, ultrapassa a barreira continental.</p>'
) on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 2
   and e.texto = 'Caracterização dos vírus.'
   and e.resumo_id is null
   and r.slug = 'virus';

-- Bactérias, protistas e fungos: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Só acrescenta.** Um resumo novo (pai) e uma única alteração em resumo
-- existente: `bacterias` passa a ter este como pai (`pai_id`), com o corpo
-- intocado e só se ainda não tiver pai. Nenhum delete, nenhum corpo publicado
-- reescrito, nenhum vínculo de edital trocado.
--
-- ## Por que este tópico
-- Conferido no banco em 22/10/2026: PAS-UEM 2ª etapa, biologia, tópicos 4
-- ("Caracterização dos reinos: Monera, Protista, Fungi, Plantae e Animália.")
-- e 5 ("Doenças bacterianas, viroses, protozoonoses, verminoses.") sem resumo.
-- O acervo tinha só `bacterias` (corpo curto, sem pai) e `virus` (ligado ao
-- tópico 3, não tocado). Processo `comum` (material de prova de escola).
--
-- ## Fontes, e só elas
-- 1. Caderno:
--    - `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para PR1G4.docx`,
--      BIOLOGIA A, §00004–00073 (protozoários; protozooses e tabela), e
--      BIOLOGIA B, §00116–00146 (domínios, reinos, figura image1 dos 5 reinos,
--      paredes celulares). Cópia no Simulado Poliedro do mesmo bimestre.
--    - `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para PR2G4.docx`,
--      BIOLOGIA B, §00127–00176 (bactérias e arqueas; figuras image8, image1,
--      image23, image4, image5, image19). Cópia no Simulado Harmonia, 2º dia.
-- 2. Edital: PAS-UEM 2ª etapa, biologia, tópicos 4 e 5 (nenhum ligado).
-- 3. Provas (Documents/UEM-Provas/pdfs):
--    - PAS-UEM 2015, 2ª etapa, questão 11 (gabarito 28), pas15/E2G1CG.pdf
--      p. 9 (impressa): a questão;
--    - PAS-UEM 2025, 2ª etapa, questão 33 (03), item 16, pas25/E2.pdf p. 16;
--      PAS-UEM 2018, 2ª etapa, questão 12 (07), item 16, pas18/E2G1.pdf p. 7;
--      PAS-UEM 2021, 2ª etapa, questão 10 (20), item 01, pas21/E2.pdf p. 6:
--      as pegadinhas.
--
-- ## O que difere do caderno (decisões do autor, 22/10/2026)
-- 1. Leishmaniose, coluna Ciclo (PR1G4 §00073): "barbeiro se infecta ao sugar
--    sangue" → "mosquito-palha se infecta ao sugar sangue" (vetor dado na
--    mesma linha do caderno).
-- 2. Tabela dos 5 reinos (figura image1, print de slide com ícone de áudio):
--    refeita em HTML, sem a figura. Fungi "com ou sem parede celular de
--    quitina" → "com parede celular de quitina" (§00145). Monera "Absor +
--    Ingestão" fica como no caderno ("absorção e ingestão") e vai ao PR como
--    suspeita.
-- 3. Fungi entra só com o que a tabela traz; morfologia, nutrição,
--    reprodução, micorrizas e liquens existem no caderno só como títulos
--    (Resumos 2026/Resumo para Simulado Poliedro.docx §00122–00124):
--    caderno primeiro.
-- Normalizações de forma: listadas no PR.
--
-- ## Edital
-- Nenhum tópico ligado. Tópico 4: Plantae e Animalia só aparecem na tabela, e
-- Fungi não tem texto próprio no caderno. Tópico 5: o caderno só traz
-- protozooses; doenças bacterianas e verminoses são só títulos, e viroses
-- estão em `virus`.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
select
  'bacterias-protistas-e-fungos',
  'Bactérias, protistas e fungos',
  'biologia',
  'comum',
  'Reinos Monera, Protoctista e Fungi: bactérias, arqueas, protozoários e protozooses, com a caracterização dos cinco reinos.',
  '<p>organismos dos reinos Monera, Protoctista e Fungi, caracterizados pelo tipo de célula, pela nutrição e pela organização corporal;</p>
<ul><li><p><strong>Domínios e reinos:</strong> onde cada grupo se encaixa na classificação;</p></li>
<li><p><strong>Bactérias e arqueas:</strong> procariontes do reino Monera;</p></li>
<li><p><strong>Protozoários e protozooses:</strong> eucariontes do reino Protoctista e as doenças que causam;</p></li>
<li><p><strong>Fungi:</strong> cogumelos, bolores e leveduras.</p></li></ul>
<h2 data-corrido="sim">Domínios e reinos:</h2>
<p>primeiros níveis taxonômicos, organizados hierarquicamente do menos específico ao mais específico;</p>
<ul><li><p><strong>Domínio:</strong> organismos com características celulares e moleculares semelhantes;</p>
<ul><li><p><strong>Eukarya:</strong> inclui todos os seres vivos de células eucariontes;</p></li>
<li><p><strong>Archaea:</strong> seres procariontes geralmente encontrados em ambientes extremos (temperatura e pH fora do normal);</p></li>
<li><p><strong>Bactéria:</strong> seres procariontes comuns;</p></li></ul></li>
<li><p><strong>Reino:</strong> organismos com características gerais semelhantes, como tipo de célula, nutrição e organização corporal;</p>
<ul><li><p><strong>Monera:</strong> bactérias e cianobactérias;</p></li>
<li><p><strong>Protoctista:</strong> algas e protozoários;</p></li>
<li><p><strong>Fungi:</strong> fungos;</p></li>
<li><p><strong>Metaphyta/Plantae:</strong> plantas, em [[Reino Plantae]];</p></li>
<li><p><strong>Metazoa/Animalia:</strong> animais;</p></li></ul></li>
<li><p><strong>Parede celular:</strong></p>
<ul><li><p>Monera: peptidoglicano (proteínas e açúcares); em ambiente extremo, o material da parede é outro, que varia com o tipo de ambiente;</p></li>
<li><p>Protoctista: parede celular de celulose somente nas algas;</p></li>
<li><p>Fungi: quitina (açúcar estrutural);</p></li>
<li><p>Metaphyta/Plantae: celulose (açúcar estrutural).</p></li></ul></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>Exemplos</strong></p></th><th><p><strong>Nº de células</strong></p></th><th><p><strong>Tipo de célula</strong></p></th><th><p><strong>Energia</strong></p></th><th><p><strong>Nos ecossistemas</strong></p></th></tr>
<tr><td><p><strong>Monera</strong></p></td><td><p>bactérias; cianobactérias</p></td><td><p>unicelulares</p></td><td><p>procarionte; parede celular</p></td><td><p>auto e heterótrofos; absorção e ingestão; foto e quimiossíntese</p></td><td><p>produtores; decompositores; microconsumidores</p></td></tr>
<tr><td><p><strong>Protista</strong></p></td><td><p>algas; protozoários</p></td><td><p>unicelulares; pluricelulares; coloniais</p></td><td><p>eucariontes, com ou sem parede celular</p></td><td><p>auto ou heterótrofos; fotossintetizantes; absorção ou ingestão</p></td><td><p>produtores; microconsumidores</p></td></tr>
<tr><td><p><strong>Fungi</strong></p></td><td><p>cogumelos; bolores; leveduras</p></td><td><p>unicelulares; pluricelulares; coloniais</p></td><td><p>eucariontes com parede celular de quitina</p></td><td><p>heterótrofos; absorção; fermentação</p></td><td><p>decompositores; microconsumidores</p></td></tr>
<tr><td><p><strong>Plantae</strong></p></td><td><p>todas as plantas</p></td><td><p>pluricelulares</p></td><td><p>eucariontes com parede celular</p></td><td><p>autótrofos; fotossintetizantes</p></td><td><p>produtores</p></td></tr>
<tr><td><p><strong>Animalia</strong></p></td><td><p>todos os animais</p></td><td><p>pluricelulares</p></td><td><p>eucariontes sem parede celular</p></td><td><p>heterótrofos; ingestão</p></td><td><p>consumidores</p></td></tr></tbody></table>
<h2 data-corrido="sim">Bactérias:</h2>
<p>organismos unicelulares procariontes;</p>
<h3>Célula bacteriana</h3>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/celula-bacteriana.webp" alt="Corte de uma bactéria em forma de bastão: cápsula, parede celular e membrana plasmática por fora, fímbrias na superfície e um flagelo; dentro, DNA, plasmídeo, ribossomos, inclusão e citosol." style="width:100%" data-largura="100%"></figure>
<ul><li><p><strong>Ausência de carioteca</strong> (envoltório nuclear);</p></li>
<li><p><strong>DNA circular</strong> e sem histonas (proteínas);</p></li>
<li><p><strong>Nucleoide:</strong> região que o DNA ocupa na célula bacteriana;</p></li>
<li><p><strong>Ausência de organelas membranosas</strong> (sistema de endomembranas);</p></li>
<li><p><strong>Ribossomos pequenos</strong>;</p></li>
<li><p><strong>Parede celular com peptidoglicanos</strong>;</p></li>
<li><p><strong>Plasmídeos:</strong> anéis pequenos de DNA.</p></li></ul>
<h3>Diversidade morfológica</h3>
<ul><li><p><strong>Formas possíveis das bactérias:</strong></p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/formas-das-bacterias.webp" alt="As formas das bactérias: cocos, bacilos, espiroquetas, vibrião e espirilos." style="width:70%" data-largura="70%"></figure>
<ul><li><p><strong>Formas de arranjo bacteriano:</strong></p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/arranjos-bacterianos.webp" alt="Arranjos bacterianos: diplococos, estreptococos, tétrade, estafilococos e sarcina; estreptobacilo e bacilo; vibrião, espirilo e espiroqueta." style="width:100%" data-largura="100%"></figure>
<h3>Diversidade metabólica</h3>
<ul><li><p><strong>Nutrição:</strong></p>
<ul><li><p><strong>Bactérias heterótrofas:</strong> decompositoras ou simbióticas;</p></li>
<li><p><strong>Bactérias autotróficas:</strong> produzem seu próprio alimento;</p>
<ul><li><p><strong>Fotossintetizantes oxigênicas:</strong> geram gás oxigênio e matéria orgânica a partir do <span data-type="inline-math" data-latex="\ce{CO2}"></span>; realizadas pelas cianobactérias;</p></li>
<li><p><strong>Fotossintetizantes anoxigênicas:</strong> sem produção de gás oxigênio; realizadas pelas sulfobactérias;</p></li>
<li><p><strong>Quimiossintetizantes</strong>;</p></li></ul></li></ul></li>
<li><p><strong>Produção de energia</strong>, em [[Metabolismo energético]]:</p>
<ul><li><p><strong>Fermentação:</strong> anaeróbica, sem participação de gás oxigênio;</p>
<ul><li><p>baixo rendimento energético;</p></li>
<li><p><strong>Anaeróbicas obrigatórias:</strong> morrem na presença de oxigênio;</p></li></ul></li>
<li><p><strong>Respiração celular:</strong> com participação de <span data-type="inline-math" data-latex="\ce{O2}"></span>;</p>
<ul><li><p>alto rendimento energético;</p></li>
<li><p>ausência de mitocôndrias;</p></li>
<li><p><strong>Aeróbias obrigatórias:</strong> precisam de gás oxigênio;</p></li></ul></li>
<li><p><strong>Bactérias anaeróbicas facultativas:</strong> podem utilizar o oxigênio ou não (fermentação).</p></li></ul></li></ul>
<h3>Reprodução</h3>
<ul><li><p><strong>Esporulação:</strong> formação de esporos de resistência;</p></li>
<li><p><strong>Bipartição:</strong> reprodução assexuada;</p></li>
<li><p><strong>Meios para a variabilidade genética:</strong></p>
<ul><li><p><strong>Mutações:</strong> alterações no material genético;</p></li>
<li><p><strong>Recombinações gênicas:</strong></p>
<ul><li><p><strong>Transdução:</strong> bacteriófagos ([[Vírus]]) transportam genes bacterianos de uma bactéria para outra;</p></li></ul></li></ul></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/transducao-bacteriana.webp" alt="Transdução em cinco passos: o bacteriófago injeta o DNA viral na bactéria 1; novos bacteriófagos levam DNA da bactéria 1; a bactéria se rompe; um deles injeta DNA viral e bacteriano na bactéria 2, que passa a ter variabilidade genética." style="width:70%" data-largura="70%"></figure>
<ul><li><p><strong>Transformação:</strong> bactérias absorvem e incorporam fragmentos de DNA livres no ambiente;</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/transformacao-bacteriana.webp" alt="Transformação: fragmentos de DNA no meio são absorvidos pela bactéria receptora, que se torna uma bactéria transformada." style="width:100%" data-largura="100%"></figure>
<ul><li><p><strong>Conjugação:</strong> bactéria doadora transfere DNA para uma bactéria receptora por meio de um tubo de conjugação.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/conjugacao-bacteriana.webp" alt="Conjugação: a bactéria doadora, com DNA e plasmídeo, liga-se à receptora pelo pilus; o plasmídeo passa pelo tubo de conjugação, e as duas terminam com o plasmídeo." style="width:70%" data-largura="70%"></figure>
<h2 data-corrido="sim">Arqueas:</h2>
<p>seres procariontes geralmente encontrados em ambientes extremos;</p>
<ul><li><p>ausência de peptidoglicanos na parede celular;</p></li>
<li><p>maior semelhança genética com eucariontes do que com bactérias;</p></li>
<li><p><strong>Arqueas termófilas:</strong> vivem em ambientes extremamente quentes e geralmente ácidos, como fontes termais submarinas e fendas vulcânicas;</p></li>
<li><p><strong>Arqueas halófilas:</strong> vivem em ambientes hipersalinos;</p></li>
<li><p><strong>Arqueas metanogênicas:</strong> anaeróbias obrigatórias e produtoras do gás metano (<span data-type="inline-math" data-latex="\ce{CH4}"></span>).</p></li></ul>
<h2 data-corrido="sim">Protozoários:</h2>
<p>organismos unicelulares, dotados de organelas e funções fisiológicas amplamente diversificadas entre as espécies;</p>
<ul><li><p>terminologia simplificada para agrupar os organismos eucariontes, em sua maioria heterotróficos, que não são animais, fungos ou plantas;</p>
<ul><li><p>o termo “protozoário” não faz referência a nenhum grupo taxonômico válido atualmente;</p></li></ul></li>
<li><p><strong>Características gerais:</strong></p>
<ul><li><p>seres eucariontes;</p></li>
<li><p>habitam, predominantemente, ambientes aquáticos: marinhos, salobros e de água doce;</p></li>
<li><p>alguns podem estar presentes em fluidos corporais de hospedeiros ou viver em simbiose com outros seres vivos;</p></li>
<li><p>podem existir como células isoladas ou formar colônias;</p></li>
<li><p>heterotróficos;</p></li>
<li><p>podem ser aeróbios ou anaeróbios;</p></li></ul></li>
<li><p><strong>Reprodução assexuada:</strong></p>
<ul><li><p><strong>Fissão binária:</strong> divisão mitótica da célula-mãe origina duas células-filhas idênticas;</p></li>
<li><p><strong>Brotamento:</strong> células-filhas são mantidas unidas à célula-mãe, podendo depois se soltar;</p></li></ul></li>
<li><p><strong>Reprodução sexuada:</strong></p>
<ul><li><p>o tipo mais frequente é a conjugação;</p></li>
<li><p>o número de células iniciais não aumenta;</p></li>
<li><p>a variabilidade genética ocorre pela troca de micronúcleos.</p></li></ul></li></ul>
<h3>Classificação pelas estruturas de locomoção</h3>
<ul><li><p><strong>Sarcodina/Rhizopoda:</strong> capazes de se locomover por meio da emissão de pseudópodes;</p></li>
<li><p><strong>Flagellata/Mastigophora:</strong> dotados de estruturas flagelares, incluindo organismos que apresentam, ou não, clorofila;</p></li>
<li><p><strong>Ciliophora:</strong> dotados de estruturas ciliares para a locomoção;</p></li>
<li><p><strong>Sporozoa:</strong> não apresentam estruturas de locomoção, mas são capazes de se deslocar no ambiente por mecanismos ainda não totalmente compreendidos.</p></li></ul>
<h3>Excreção e osmorregulação</h3>
<ul><li><p>protozoários de água doce recebem água por osmose, em [[Transporte através da membrana]];</p></li>
<li><p>osmorregulação realizada pelo vacúolo pulsátil (vacúolo contrátil);</p></li>
<li><p>eliminação da água excedente com gasto de energia (transporte ativo);</p></li>
<li><p><strong>Protozoário de água doce em água salgada:</strong> perde água por osmose e pode desidratar;</p></li>
<li><p><strong>Protozoário de água salgada em água doce:</strong> recebe muita água por osmose e pode sofrer lise (estourar).</p></li></ul>
<h3>Principais grupos com base na filogenia molecular</h3>
<ul><li><p><strong>Diplomonadida:</strong> vida livre ou associados ao intestino de animais;</p>
<ul><li><p>locomoção por flagelos;</p></li>
<li><p>podem apresentar dois núcleos;</p></li>
<li><p>reprodução assexuada por fissão binária;</p></li></ul></li>
<li><p><strong>Parabasalia:</strong> flagelados endossimbióticos, na maioria parasitas de animais;</p>
<ul><li><p>podem viver em mutualismo no sistema digestório de insetos;</p></li></ul></li>
<li><p><strong>Amoebozoa:</strong> formam pseudópodes para locomoção e alimentação;</p>
<ul><li><p>a maioria apresenta hábitos de vida livre;</p></li>
<li><p>reprodução assexuada por fissão binária;</p></li></ul></li>
<li><p><strong>Kinetoplastida:</strong> possuem um ou dois flagelos;</p>
<ul><li><p>apresentam mitocôndria com região rica em DNA chamada cinetoplasto;</p></li>
<li><p>incluem parasitas como tripanossomos e leishmanias;</p></li></ul></li>
<li><p><strong>Ciliophora:</strong> cílios para locomoção e alimentação;</p>
<ul><li><p>reprodução por fissão binária ou conjugação;</p></li></ul></li>
<li><p><strong>Apicomplexa:</strong> parasitas intracelulares obrigatórios;</p>
<ul><li><p>possuem complexo apical para invadir células hospedeiras;</p></li>
<li><p>realizam reprodução assexuada e sexuada;</p></li>
<li><p><strong>Ex:</strong> <em>Toxoplasma gondii</em> (toxoplasmose) e <em>Plasmodium</em> (malária).</p></li></ul></li></ul>
<h2>Protozooses</h2>
<ul><li><p><strong>Parasitologia:</strong> área da Biologia que estuda organismos parasitas e sua relação com os hospedeiros;</p>
<ul><li><p>os parasitas vivem em associação com outros seres vivos (hospedeiros), dos quais obtêm as condições ideais para sua sobrevivência;</p></li>
<li><p>os parasitas causam prejuízos ao hospedeiro, geralmente na forma de doenças;</p></li></ul></li>
<li><p><strong>Tipos de hospedeiro:</strong></p>
<ul><li><p><strong>Hospedeiro definitivo:</strong> ocorre a reprodução sexuada do parasita;</p></li>
<li><p><strong>Hospedeiro intermediário:</strong> ocorre a reprodução assexuada do parasita;</p></li></ul></li>
<li><p><strong>Tipos de parasitas:</strong></p>
<ul><li><p><strong>Monoxênicos:</strong> apresentam apenas um tipo de hospedeiro no ciclo de vida;</p></li>
<li><p><strong>Heteroxênicos:</strong> envolvem dois ou mais hospedeiros em diferentes fases do ciclo de vida;</p></li></ul></li>
<li><p><strong>Outros conceitos:</strong></p>
<ul><li><p><strong>Agente etiológico:</strong> organismo causador da doença;</p></li>
<li><p><strong>Vetores ou agentes transmissores:</strong> organismos responsáveis pela transmissão do parasita;</p></li>
<li><p><strong>Reservatórios:</strong> seres vivos que abrigam parasitas sem necessariamente manifestar a doença.</p></li></ul></li></ul>
<table data-escapa="sim"><tbody><tr><th><p><strong>Doença</strong></p></th><th><p><strong>Agente etiológico</strong></p></th><th><p><strong>Locomoção do parasita</strong></p></th><th><p><strong>Sintomas</strong></p></th><th><p><strong>Como ocorre a infecção</strong></p></th><th><p><strong>Profilaxia</strong></p></th><th><p><strong>Ciclo</strong></p></th></tr>
<tr><td><p>Amebíase ou diarreia amebiana</p></td><td><p><em>Entamoeba histolytica</em></p></td><td><p>pseudópodes</p></td><td><p>cólica, diarreia e fezes com sangue</p></td><td><p>ingestão de água ou alimentos contaminados com cistos maduros desse parasita</p></td><td><p>saneamento básico e higiene pessoal e alimentar</p></td><td><p>monoxênico (apenas um hospedeiro, o humano)</p></td></tr>
<tr><td><p>Giardíase ou diarreia esverdeada</p></td><td><p><em>Giardia lamblia</em></p></td><td><p>flagelos</p></td><td><p>diarreia, cólicas abdominais, inchaço, gases, náuseas e perda de peso</p></td><td><p>ingestão de cistos (ciclo fecal-oral), geralmente por água ou alimentos contaminados</p></td><td><p>saneamento básico adequado; higienização dos alimentos; higiene pessoal</p></td><td><p>ingestão de cistos → parasita coloniza o intestino → cistos eliminados nas fezes</p></td></tr>
<tr><td><p>Toxoplasmose</p></td><td><p>apicomplexo <em>Toxoplasma gondii</em></p></td><td><p>não apresenta estruturas especializadas de locomoção; é um parasita intracelular obrigatório</p></td><td><p>em geral é assintomática; os sintomas incluem febre, dor de cabeça e dor muscular</p></td><td><p>ingestão de oocistos contaminados em fezes de gatos infectados ou em água e alimentos</p></td><td><p>beber água potável, lavar alimentos, cozinhar bem carnes e evitar fezes de gatos</p></td><td><p>gato elimina o parasita nas fezes → contamina água, solo ou alimentos → humano se infecta ao ingerir</p></td></tr>
<tr><td><p>Malária</p></td><td><p>protozoários apicomplexos do gênero <em>Plasmodium</em></p></td><td><p>deslizamentos ou flexões do próprio corpo</p></td><td><p>febre alta, calafrios, tremores, suor profuso, dor de cabeça e no corpo, náuseas e cansaço</p></td><td><p>picada da fêmea do mosquito <em>Anopheles</em> (mosquito-prego)</p></td><td><p>uso de repelentes, inseticidas, evitar água parada e uso de telas contra mosquitos em janelas e portas</p></td><td><p>o mosquito pica um humano infectado, o protozoário se reproduz e o mosquito (infectado) pica outro ser humano</p></td></tr>
<tr><td><p>Mal de Chagas</p></td><td><p><em>Trypanosoma cruzi</em></p></td><td><p>flagelado</p></td><td><p>febre e mal-estar; cardiomegalia e alterações no sistema digestório</p></td><td><p>fezes do inseto barbeiro, transfusão de sangue, alimentos contaminados</p></td><td><p>melhoria das moradias, casas de alvenaria e telas em portas e janelas para evitar o barbeiro</p></td><td><p>barbeiro pica e defeca → parasita entra no corpo → invade células e se multiplica → barbeiro se infecta ao sugar sangue</p></td></tr>
<tr><td><p>Leishmaniose</p></td><td><p><em>Leishmania</em></p></td><td><p>flagelo</p></td><td><p>feridas e úlceras na pele, febre alta e aumento do fígado e do baço</p></td><td><p>picada da fêmea do mosquito flebótomo (mosquito-palha)</p></td><td><p>inseticidas, coleiras repelentes em animais e recolher animais de rua</p></td><td><p>mosquito-palha pica hospedeiro doente e se infecta → parasita entra no corpo → invade células e se multiplica → mosquito-palha se infecta ao sugar sangue</p></td></tr></tbody></table>
<h2 data-corrido="sim">Fungi:</h2>
<p>reino dos fungos;</p>
<ul><li><p><strong>Ex:</strong> cogumelos, bolores e leveduras;</p></li>
<li><p>unicelulares, pluricelulares ou coloniais;</p></li>
<li><p>eucariontes com parede celular de quitina;</p></li>
<li><p>heterótrofos por absorção; realizam fermentação;</p></li>
<li><p><strong>Nos ecossistemas:</strong> decompositores e microconsumidores.</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>os protistas não são só autótrofos e unicelulares: o reino reúne auto e heterótrofos, unicelulares, pluricelulares e coloniais (PAS-UEM 2025, 2ª etapa);</p></li>
<li><p>vírus não pertencem ao Reino Protista: são acelulares (PAS-UEM 2018, 2ª etapa);</p></li>
<li><p>o domínio Eukarya inclui todos os seres de células eucariontes, também os unicelulares, como os protozoários (PAS-UEM 2021, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="46f0d720-798e-4409-9cc1-8a82e660ae5c" data-gabarito="28"><p>(PAS-UEM 2015, 2ª etapa) Verifica-se na natureza grande diversidade de organismos que, por apresentarem diferentes características morfológicas, são classificados em diferentes grupos taxonômicos. Assim, considerando a taxonomia dos organismos vivos, assinale o que for correto.</p><p>(01) Os insetos, os anfíbios, os répteis e as aves são classificados no Reino Animalia porque apresentam respiração pulmonar.</p><p>(02) O Reino Plantae constitui um grupo taxonômico composto por organismos clorofilados e fotossintetizantes que, além de apresentarem vasos condutores, produzem flores e frutos.</p><p>(04) O Reino Fungi engloba organismos heterotróficos, unicelulares e pluricelulares que se reproduzem assexuadamente e sexuadamente.</p><p>(08) As bactérias e as cianobactérias são organismos procariontes pertencentes ao Reino Monera, cuja nutrição pode ser autotrófica ou heterotrófica.</p><p>(16) Os protozoários heterotróficos e muitas espécies de algas verdes são organismos eucariontes unicelulares incluídos no Reino Protoctista ou Protista.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. O Reino Animalia reúne eucariontes pluricelulares, sem parede celular e heterótrofos por ingestão; a respiração pulmonar não é o critério;</p><p>(02) Incorreta, segundo o gabarito oficial: vasos condutores, flores e frutos não caracterizam todo o Reino Plantae, definido por plantas pluricelulares, autótrofas e fotossintetizantes;</p><p>(04) Correta. Fungi reúne heterótrofos unicelulares, pluricelulares e coloniais;</p><p>(08) Correta. Monera reúne bactérias e cianobactérias, procariontes auto e heterótrofos;</p><p>(16) Correta. Protoctista reúne algas e protozoários, eucariontes.</p><p><strong>Soma: 04 + 08 + 16 = 28</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Peptidoglicano:</h3>
<p>componente da parede celular das bactérias; ausente nas arqueas;</p>
<h3 data-corrido="sim">Transdução:</h3>
<p>bacteriófagos transportam genes de uma bactéria para outra;</p>
<h3 data-corrido="sim">Transformação:</h3>
<p>bactérias incorporam fragmentos de DNA livres no ambiente;</p>
<h3 data-corrido="sim">Conjugação bacteriana:</h3>
<p>transferência de DNA da doadora à receptora por um tubo de conjugação;</p>
<h3 data-corrido="sim">Vacúolo pulsátil:</h3>
<p>elimina, com gasto de energia, a água que entra por osmose nos protozoários de água doce;</p>
<h3 data-corrido="sim">Apicomplexa:</h3>
<p>parasitas intracelulares obrigatórios com complexo apical; <em>Plasmodium</em> e <em>Toxoplasma</em>;</p>
<h3 data-corrido="sim">Hospedeiro definitivo:</h3>
<p>aquele em que ocorre a reprodução sexuada do parasita;</p>
<h3 data-corrido="sim">Parede celular dos fungos:</h3>
<p>quitina (açúcar estrutural).</p>'
on conflict (slug) do nothing;

-- `bacterias` vira filho, sem mexer no corpo; só se ainda estiver sem pai.
update resumos
   set pai_id = (select id from resumos where slug = 'bacterias-protistas-e-fungos')
 where slug = 'bacterias'
   and pai_id is null;

-- Dispara de novo o trigger dos [[wikilinks]].
update resumos set corpo = corpo where slug = 'bacterias-protistas-e-fungos';

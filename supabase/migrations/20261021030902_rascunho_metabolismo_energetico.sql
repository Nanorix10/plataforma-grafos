-- Metabolismo energético: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Reescreve um resumo que já existe**, por isso `update` e não `insert`.
-- Conferido no banco em 20/10/2026: `metabolismo-energetico` tinha ~180
-- caracteres de texto (produção de ATP; quebra de carboidratos, proteínas e
-- lipídeos) e cinco questões PAS sem resolução (corpo de 5.545 caracteres,
-- md5 2f776d9bdfa179f9835817ff0fb72660). As cinco ficam, com o mesmo
-- `data-id`, agora com resolução item a item.
--
-- ## Por que este tópico
-- PAS-UEM 1ª etapa, biologia, ordem 10: "Metabolismo energético: respiração
-- celular e fermentação; fotossíntese e quimiossíntese." Já ligado a este
-- resumo; o texto não cobria nenhuma das quatro partes. Processo `comum`
-- (mantido).
--
-- ## Fontes, e só elas
-- 1. Caderno:
--    - `Resumos 2025/Resumos 3º bimestre/Resumo para Simulado Poliedro.docx`,
--      BIOLOGIA A, §00218–00250 do extrator (respiração aeróbica, fermentação,
--      tabela aeróbica × fermentação, figura image104 da glicólise);
--    - `Resumos 2025/Resumos 2º bimestre/Resumo para SH_ 2º dia.docx`,
--      "BIOLOGIA A ✅- Davi Magi", §00126–00135 (fotossíntese; figura image9).
--      Seção assinada por Davi Magi: entra como acréscimo, por decisão do autor;
--    - `Materias e conteúdos feitos/Biologia.docx`: §00810–00814 (produção de
--      ATP, quebra de componentes), §00093–00103 (anabolismo; quimiossíntese),
--      §00137–00139 (hipótese autotrófica), §00244–00247 (nitrosação,
--      nitratação), §00012–00013 (transporte passivo, difusão simples);
--    - `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para PR2G4.docx`,
--      BIOLOGIA B, §00147–00158 (cianobactérias, fermentação anaeróbica,
--      ausência de mitocôndrias, anaeróbicas facultativas).
-- 2. Edital: PAS-UEM 1ª etapa nº 10.
-- 3. Provas (Documents/UEM-Provas/pdfs):
--    - PAS-UEM 2020, 1ª etapa, questão 10 (gabarito 03), pas20/e1.pdf p. 6: a
--      questão nova e uma pegadinha (item 08);
--    - PAS-UEM 2020, 1ª etapa, questão 15 (03), pas20/e1.pdf p. 7: pegadinha
--      do item 04;
--    - PAS-UEM 2015, 2ª etapa, questão 9 (07), pas15/E2G1CG.pdf p. 8:
--      pegadinha do item 16;
--    - PAS-UEM 2023, 1ª etapa, questões 10 (20), 11 (21) e 13 (24), pas23/E1.pdf
--      p. 5–6; PAS-UEM 2019, 2ª etapa, questão 14 (21), pas19/E2G1.pdf p. 7;
--      PAS-UEM 2024, 2ª etapa, questão 15 (28), pas24/E2.pdf p. 7: as cinco
--      questões que já estavam no resumo.
--
-- ## O que difere do caderno (decisões do autor, 20/10/2026)
-- Regra do autor: a correção só usa termos que já estejam no caderno ou numa
-- prova; o que precisaria de outra fonte sai.
-- 1. Krebs (Poliedro §00230), "produção de 4 ATPs e o consumo de 2" →
--    "sobram 2 ATP" (palavras do próprio caderno; o saldo fecha com 2 + 2 + 26
--    = ~30 de §00249).
-- 2. Cadeia respiratória (§00234–00236): "espaço intra-membranar" → "espaço
--    entre as membranas" (§00236); a frase dos hidrogênios que "carregam
--    fosfatos" → "os H+ presentes entre as membranas são direcionados para a
--    ATP sintase…", com a roda d'água do caderno. A união dos elétrons com o
--    oxigênio formando H2O é do próprio caderno (§00235).
-- 3. Local (§00219): "realizado pelas mitocôndrias" → "no citoplasma
--    (glicólise) e nas mitocôndrias (ciclo de Krebs e cadeia respiratória)"
--    (§00220, §00225, §00227, §00233; PAS-UEM 2020-1 q10 item 02).
-- 4. "Fermentação (respiração anaeróbica)" → "processo anaeróbico, sem a
--    presença de O2" (PR2G4 2º ano §00151; o caderno usa "respiração
--    anaeróbica" para a desnitrificação, Biologia.docx §00250).
-- 5. "Piruvato é transformado em etanol, CO2 e ATP" → "etanol e CO2"; os 2 ATP
--    vêm da glicólise (§00239 e figura image104). As figuras image37 e
--    image105 (que punham o ATP depois da fermentação) saíram.
-- 6. Fotossíntese (SH 2º dia): numeração dos fotossistemas tirada
--    ("fotossistemas (conjuntos de proteínas localizados na membrana)", do
--    próprio caderno); "liberando H2 e O2" → "liberando hidrogênio e O2", e o
--    hidrogênio capturado pelo NADP é do caderno (§00131); "(RUBP)" tirado;
--    "luz mecânica" → "a luz emitida nas frequências corretas" (sem
--    "artificial", que não está nas fontes); "refletida pelos cloroplastos" →
--    "pela clorofila" (PAS-UEM 2023-1 q11 item 08); fórmulas vazias "⟦⟧e ⟦⟧"
--    → CO2 e H2O (figura image9). A figura image55 (Editora Saraiva) saiu.
--
-- ## Edital
-- Nenhum update: o tópico nº 10 já aponta para este resumo. Fora: PAS-UEM 2ª
-- etapa "Respiração." (sistema respiratório) e Química 3ª etapa "Produção de
-- etanol: fermentação alcoólica…" (coberto pela metade).

update resumos
   set definicao = 'Produção de ATP na célula: respiração aeróbica, fermentação, fotossíntese e quimiossíntese.',
       corpo = '<p>produção de ATP (adenosina tri-fosfato);</p>
<ul><li><p><strong>Quebra de componentes:</strong> carboidratos; proteínas; lipídeos;</p></li>
<li><p><strong>Respiração aeróbica:</strong> quebra da glicose na presença de oxigênio;</p></li>
<li><p><strong>Fermentação:</strong> quebra da glicose sem a presença de <span data-type="inline-math" data-latex="\ce{O2}"></span>;</p></li>
<li><p><strong>Fotossíntese:</strong> construção de compostos orgânicos com a energia da luz solar;</p></li>
<li><p><strong>Quimiossíntese:</strong> construção de compostos orgânicos com a energia de reações químicas.</p></li></ul>
<h2 data-corrido="sim">Respiração aeróbica:</h2>
<p>quebra da glicose na presença de oxigênio, com liberação de energia, água e dióxido de carbono;</p>
<ul><li><p><strong>Ocorrência:</strong> no citoplasma (glicólise) e nas mitocôndrias (ciclo de Krebs e cadeia respiratória);</p>
<ul><li><p>a mitocôndria está em [[Célula: membrana, citoplasma, organelas e núcleo]];</p></li></ul></li>
<li><p><strong>Etapas:</strong> glicólise, ciclo de Krebs e cadeia respiratória.</p></li></ul>
<h3 data-corrido="sim">Glicólise:</h3>
<p>quebra da glicose em ácido pirúvico;</p>
<ul><li><p><strong>Ocorrência:</strong> fora da mitocôndria, no citoplasma;</p></li>
<li><p>a quebra da glicose gasta 2 ATP;</p></li>
<li><p>com a fragmentação da molécula, ocorre a liberação de íons <span data-type="inline-math" data-latex="\ce{H+}"></span>, capturados pelo NAD (molécula transportadora), e do piruvato (ácido pirúvico);</p></li>
<li><p>a glicose, ao ser quebrada, libera 4 ATP; descontados os 2 ATP gastos, sobram 2 ATP.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/glicolise.webp" alt="Glicólise: a glicose é quebrada em 2 moléculas de piruvato, com a formação de 2 ATP a partir de 2 ADP + Pi e a redução de 2 NAD a 2 NADH." style="width:70%" data-largura="70%"></figure>
<h3 data-corrido="sim">Ciclo de Krebs:</h3>
<p>etapa que ocorre no interior da mitocôndria, na matriz mitocondrial;</p>
<ul><li><p>começa com a formação de acetil-CoA, pela reação entre o piruvato e a coenzima A;</p></li>
<li><p>o acetil-CoA reage com o ácido oxalacético, formando ácido cítrico;</p></li>
<li><p>no final das reações há liberação de <span data-type="inline-math" data-latex="\ce{H+}"></span> e <span data-type="inline-math" data-latex="\ce{CO2}"></span>;</p>
<ul><li><p>o hidrogênio é capturado por moléculas de NAD e FAD, que o levam para a última etapa;</p></li></ul></li>
<li><p>sobram 2 ATP.</p></li></ul>
<h3 data-corrido="sim">Cadeia respiratória:</h3>
<p>etapa mais energética, que produz 26 ATP;</p>
<ul><li><p><strong>Ocorrência:</strong> nas cristas mitocondriais;</p></li>
<li><p>o <span data-type="inline-math" data-latex="\ce{NADH + H+}"></span> e o <span data-type="inline-math" data-latex="\ce{FADH2}"></span> liberam elétrons para o complexo de proteínas da membrana interior;</p></li>
<li><p>esses elétrons atraem <span data-type="inline-math" data-latex="\ce{H+}"></span> para o espaço entre as membranas, antes de retornarem para a matriz mitocondrial;</p></li>
<li><p>na matriz, os elétrons se unem a oxigênios, e hidrogênios se juntam a eles na formação de <span data-type="inline-math" data-latex="\ce{H2O}"></span>;</p></li>
<li><p><strong>ATP sintase:</strong> os <span data-type="inline-math" data-latex="\ce{H+}"></span> presentes entre as membranas são direcionados para a ATP sintase, enzima que, ao ser girada pelos hidrogênios que passam (como uma roda d’água), gera a energia necessária para a combinação de ADP + Pi (fosfato), formando ATP.</p></li></ul>
<h2 data-corrido="sim">Fermentação:</h2>
<p>processo anaeróbico, sem a presença de <span data-type="inline-math" data-latex="\ce{O2}"></span>;</p>
<ul><li><p><strong>Etapa única:</strong> glicólise; os 2 ATP da fermentação vêm dela;</p></li>
<li><p><strong>Fermentação alcoólica:</strong> feita por leveduras e algumas bactérias;</p>
<ul><li><p>o piruvato é transformado em etanol e <span data-type="inline-math" data-latex="\ce{CO2}"></span>;</p></li>
<li><p><strong>Ex:</strong> produção de pães e bebidas alcoólicas;</p></li></ul></li>
<li><p><strong>Fermentação lática:</strong> realizada por bactérias láticas (<em>Lactobacillus</em>) e células musculares humanas (em esforço intenso);</p>
<ul><li><p>o piruvato é transformado em ácido lático;</p></li>
<li><p><strong>Ex:</strong> produção de iogurte, queijos e conservas;</p></li></ul></li>
<li><p><strong>Obs:</strong> em [[Bacterias]], as anaeróbicas facultativas podem utilizar o oxigênio ou não (fermentação).</p></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>Aeróbica</strong></p></th><th><p><strong>Fermentação</strong></p></th></tr>
<tr><td><p>Oxigênio</p></td><td><p>usa <span data-type="inline-math" data-latex="\ce{O2}"></span></p></td><td><p>sem <span data-type="inline-math" data-latex="\ce{O2}"></span></p></td></tr>
<tr><td><p>Rendimento</p></td><td><p>~30 ATP</p></td><td><p>2 ATP</p></td></tr>
<tr><td><p>Produtos</p></td><td><p><span data-type="inline-math" data-latex="\ce{CO2}"></span> e <span data-type="inline-math" data-latex="\ce{H2O}"></span></p></td><td><p>etanol ou ácido lático</p></td></tr></tbody></table>
<h2 data-corrido="sim">Fotossíntese:</h2>
<p>processo de obtenção de energia realizado por seres fotossintetizantes (plantas, algas e algumas bactérias), baseado na absorção de luz, <span data-type="inline-math" data-latex="\ce{CO2}"></span> e <span data-type="inline-math" data-latex="\ce{H2O}"></span> para a obtenção de <span data-type="inline-math" data-latex="\ce{C6H12O6}"></span>, <span data-type="inline-math" data-latex="\ce{O2}"></span> e <span data-type="inline-math" data-latex="\ce{H2O}"></span>;</p>
<ul><li><p><strong>Fases:</strong> clara e escura;</p></li>
<li><p><strong>Obs:</strong> é o exemplo de anabolismo em [[Características dos seres vivos]];</p></li>
<li><p><strong>Fórmula principal:</strong></p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/equacao-da-fotossintese.webp" alt="Equação da fotossíntese: 6 CO2 (dióxido de carbono) + 12 H2O (água), com luz, formam 6 O2 (oxigênio) + C6H12O6 (glicose) + 6 H2O (água)." style="width:70%" data-largura="70%"></figure>
<h3 data-corrido="sim">Fase clara ou fotoquímica:</h3>
<p>dividida em duas etapas: a fotólise da água e a fosforilação do ADP;</p>
<ul><li><p><strong>Fotólise da água:</strong> ocorre nos fotossistemas (conjuntos de proteínas localizados na membrana); a energia luminosa é utilizada para a quebra da água, liberando hidrogênio e <span data-type="inline-math" data-latex="\ce{O2}"></span>;</p>
<ul><li><p>o hidrogênio é capturado pelo NADP, que vira <span data-type="inline-math" data-latex="\ce{NADPH2}"></span>, pois está transportando o hidrogênio;</p></li></ul></li>
<li><p><strong>Fosforilação:</strong> o fosfato (Pi) é combinado com a adenosina difosfato (ADP), formando a adenosina trifosfato (ATP), que será utilizada na fase escura;</p>
<ul><li><p><strong>Cíclica:</strong> os elétrons utilizados são capturados pelo aceptor de elétrons e retornam para a clorofila;</p></li>
<li><p><strong>Acíclica:</strong> os elétrons não retornam para a clorofila.</p></li></ul></li></ul>
<h3 data-corrido="sim">Fase escura ou química:</h3>
<p>produção de glicose e água;</p>
<ul><li><p>são formadas cadeias carbônicas a partir do <span data-type="inline-math" data-latex="\ce{CO2}"></span>;</p></li>
<li><p>o ATP entra no processo como fonte de energia, e o hidrogênio trazido pelo <span data-type="inline-math" data-latex="\ce{NADPH2}"></span> serve para reduzir o <span data-type="inline-math" data-latex="\ce{CO2}"></span>;</p></li>
<li><p>esses carbonos são absorvidos com o uso da enzima Rubisco;</p></li>
<li><p><strong>Obs:</strong> a fase clara é totalmente dependente de luz; a fase escura pode ocorrer tanto na ausência quanto na presença dela.</p></li></ul>
<h3 data-corrido="sim">Produtos:</h3>
<p>glicose, <span data-type="inline-math" data-latex="\ce{O2}"></span> e água;</p>
<ul><li><p><strong>Glicose:</strong> gerada na fase escura;</p></li>
<li><p><span data-type="inline-math" data-latex="\ce{O2}"></span>: liberado pela quebra da água;</p></li>
<li><p><strong>Água:</strong> formada pelos oxigênios liberados do <span data-type="inline-math" data-latex="\ce{CO2}"></span> e pelos hidrogênios resultantes da fase clara.</p></li></ul>
<h3 data-corrido="sim">Luz:</h3>
<p>a fotossíntese não ocorre apenas na presença de luz natural; a luz emitida nas frequências de onda corretas também a estimula;</p>
<ul><li><p>a cor de luz que menos estimula a fotossíntese é a verde, já que é refletida pela clorofila;</p></li>
<li><p>as que mais estimulam são a vermelha, a azul/roxa e a branca.</p></li></ul>
<h2 data-corrido="sim">Quimiossíntese:</h2>
<p>a energia utilizada para a construção de compostos orgânicos é proveniente de reações químicas exergônicas, ou seja, que liberam energia;</p>
<ul><li><p><strong>Ocorrência:</strong> realizada apenas por bactérias e arqueas;</p></li>
<li><p><strong>Ex:</strong> nitrosação (<em>Nitrosomonas</em> e <em>Nitrosococcus</em>) e nitratação (<em>Nitrobacter</em>), em [[Ciclos biogeoquímicos]];</p></li>
<li><p><strong>Obs:</strong> na hipótese autotrófica de [[Teorias de origem da vida]], a sequência é quimiossíntese → fermentação → fotossíntese → respiração aeróbica.</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>bactérias lácticas usadas em queijos não crescem aerobicamente: a fermentação lática é anaeróbica (PAS-UEM 2015, 2ª etapa);</p></li>
<li><p>nos procariotos, a extração de energia com oxigênio não se chama glicólise: a glicólise é só a primeira etapa da respiração (PAS-UEM 2020, 1ª etapa);</p></li>
<li><p>a reação <span data-type="inline-math" data-latex="\ce{FeS + H2S -> FeS2 + H2}"></span> + energia não é a dos organismos fermentadores, que partem da glicose (PAS-UEM 2020, 1ª etapa);</p></li>
<li><p>ser clorofilado também realiza respiração celular (PAS-UEM 2023, 1ª etapa);</p></li>
<li><p>a fotossíntese é endotérmica e a respiração celular é exotérmica, e não o contrário (PAS-UEM 2024, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="d7f8d121-fd8f-4ea8-873d-7979c7f8aaab" data-gabarito="03"><p>(PAS-UEM 2020, 1ª etapa) Considere um organismo unicelular que utiliza o oxigênio para a extração de energia das moléculas orgânicas e assinale o que for correto.</p><p>(01) Esse organismo pode ser composto por célula eucariótica ou por célula procariótica.</p><p>(02) Nos eucariotos, a extração de energia das moléculas orgânicas dependentes de oxigênio ocorre nas mitocôndrias, tanto nos eucariotos animais quanto nos vegetais.</p><p>(04) O oxigênio é transportado através da membrana plasmática por meio de proteínas canais, proteínas transmembranares.</p><p>(08) Nos procariotos esse processo é denominado “glicólise”.</p><p>(16) O transporte do oxigênio para o interior da célula desse organismo é denominado “transporte ativo”.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Há bactérias aeróbias obrigatórias, que precisam de gás oxigênio, e eucariotos que realizam respiração aeróbica;</p><p>(02) Correta. O ciclo de Krebs e a cadeia respiratória ocorrem nas mitocôndrias, em células animais e vegetais;</p><p>(04) Incorreta. O oxigênio atravessa a membrana por difusão simples, sem auxílio de proteínas;</p><p>(08) Incorreta. A glicólise é só a primeira etapa; o processo é a respiração celular, que nos procariotos ocorre com ausência de mitocôndrias;</p><p>(16) Incorreta. É transporte passivo, sem gasto de energia (ATP).</p><p><strong>Soma: 01 + 02 = 03</strong></p></div></aside>
<aside class="questao" data-id="cbfbdf9a-7cdb-52e3-90b4-4fd27bb89910" data-gabarito="21"><p>(PAS-UEM 2019, 2ª etapa) A participação dos fungos na fabricação de bebidas alcoólicas, pães, biscoitos, entre outros alimentos, é muito bem descrita na literatura científica. Sobre esses seres vivos e sua utilidade na indústria alimentícia, assinale o que for correto.</p><p>(01) Os fungos utilizados nessas aplicações pertencem ao gênero Saccharomyces.</p><p>(02) A classe dos Basidiomicetos engloba esses tipos de fungos.</p><p>(04) Os fungos usados nos processos industriais de produção de bebidas alcoólicas são usualmente chamados leveduras; sua principal função é converter os açúcares dos substratos em álcool etílico através da fermentação.</p><p>(08) Em dias frios, os pães tendem a crescer mais rapidamente, pois o fermento biológico presente na massa acelera seu metabolismo e sua reprodução.</p><p>(16) Na produção de pães e biscoitos, os fungos liberam gás carbônico (<span data-type="inline-math" data-latex="\ce{CO2}"></span>), que, ao expandir-se com o aumento da temperatura durante o cozimento, causa a expansão da massa, conferindo a esses alimentos textura característica.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta, segundo o gabarito oficial: as leveduras dessas aplicações são do gênero <em>Saccharomyces</em>;</p><p>(02) Incorreta, segundo o gabarito oficial: essas leveduras não pertencem à classe dos Basidiomicetos;</p><p>(04) Correta. As leveduras realizam a fermentação alcoólica: o piruvato é transformado em etanol e <span data-type="inline-math" data-latex="\ce{CO2}"></span>;</p><p>(08) Incorreta, segundo o gabarito oficial: o frio não acelera o metabolismo do fermento;</p><p>(16) Correta. O <span data-type="inline-math" data-latex="\ce{CO2}"></span> da fermentação alcoólica expande a massa.</p><p><strong>Soma: 01 + 04 + 16 = 21</strong></p></div></aside>
<aside class="questao" data-id="59cf09d0-6153-543e-8c3e-88ad77d2e665" data-gabarito="20"><p>(PAS-UEM 2023, 1ª etapa) Considere um ser que possua clorofila e assinale o que for correto.</p><p>(01) Esse ser produz oxigênio durante as vinte e quatro horas do dia.</p><p>(02) Por ser clorofilado, esse ser não realiza respiração celular.</p><p>(04) Se esse ser for multicelular, então possui o polissacarídeo celulose em suas células.</p><p>(08) Esse ser, com certeza, não é procarioto.</p><p>(16) Na cadeia alimentar, esse ser faz parte do grupo daqueles que fornecem matéria e energia, as quais possibilitam a vida dos demais grupos de organismos.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. A fase clara é totalmente dependente de luz; sem luz não há quebra da água nem liberação de <span data-type="inline-math" data-latex="\ce{O2}"></span>;</p><p>(02) Incorreta. Seres clorofilados também realizam respiração celular;</p><p>(04) Correta, segundo o gabarito oficial;</p><p>(08) Incorreta. As cianobactérias, procariontes, são fotossintetizantes e geram gás oxigênio;</p><p>(16) Correta. Seres clorofilados são produtores: captam a energia da luz solar e a transformam em energia química.</p><p><strong>Soma: 04 + 16 = 20</strong></p></div></aside>
<aside class="questao" data-id="94cd4665-ca02-5a7d-9823-c30225e9e297" data-gabarito="21"><p>(PAS-UEM 2023, 1ª etapa) Cloroplastos são responsáveis pela fotossíntese em plantas. Nesse processo, absorvem a luz solar e produzem matéria orgânica energizada. Sobre esse assunto, assinale o que for correto.</p><p>(01) A energia contida na matéria orgânica produzida na fotossíntese não foi criada, e sim transformada de energia luminosa em energia química.</p><p>(02) Os cloroplastos estão presentes em todas as células que realizam fotossíntese.</p><p>(04) A energia luminosa se propaga sob a forma de ondas eletromagnéticas. A energia química é armazenada nas substâncias e liberada nas reações químicas.</p><p>(08) A cor verde que se vê nas plantas é resultado da reflexão das luzes azul e laranja pelas moléculas de clorofila.</p><p>(16) A transformação da energia luminosa em ATP acontece porque, quando recebe luz, a molécula de clorofila perde elétrons que passam por vários transportadores. Esse fato marca o momento em que se inicia a transformação da energia luminosa em energia química.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. A energia luminosa é transformada em energia química, armazenada na glicose;</p><p>(02) Incorreta. As cianobactérias, procariontes, realizam fotossíntese sem cloroplastos;</p><p>(04) Correta;</p><p>(08) Incorreta. A clorofila reflete a luz verde; as luzes que mais estimulam a fotossíntese são a vermelha e a azul/roxa;</p><p>(16) Correta. Na fase clara, os elétrons da clorofila são capturados pelo aceptor de elétrons, e a energia luminosa forma ATP.</p><p><strong>Soma: 01 + 04 + 16 = 21</strong></p></div></aside>
<aside class="questao" data-id="57ec1170-417c-5632-a498-3d86206f025d" data-gabarito="24"><p>(PAS-UEM 2023, 1ª etapa) Com esforço muito intenso uma pessoa sedentária realizou a fermentação láctica do músculo. O gráfico a seguir apresenta as concentrações químicas de ácido e de glicose resultantes desse esforço. Com base no gráfico dado em µmol/L por minuto, assinale o que for correto.</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/questoes/pas-uem-2023-etapa-1-q13.webp" alt="Concentração (µmol/L) de ácido láctico, ácido pirúvico e glicose ao longo do tempo t (min), de 0 a 9." style="width:100%" data-largura="100%"></figure><p>(01) A quantidade de ácido láctico em <span data-type="inline-math" data-latex="t=3"></span> min de 200 mL de sangue é 200 mol.</p><p>(02) O rim é o órgão responsável pela conversão de ácido láctico em pirúvico.</p><p>(04) As concentrações dos ácidos se equiparam em <span data-type="inline-math" data-latex="t=6"></span> min.</p><p>(08) O ápice da dor e da fadiga muscular ocorre exatamente aos 4 minutos.</p><p>(16) Gliconeogênese é o processo de transformação do ácido pirúvico em glicose.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. Em <span data-type="inline-math" data-latex="t=3"></span> min há 10 µmol/L de ácido láctico; em 200 mL (0,2 L), <span data-type="inline-math" data-latex="10\cdot 0{,}2=2\ \mu\text{mol}"></span>, e não 200 mol;</p><p>(02) Incorreta, segundo o gabarito oficial: a conversão não é feita pelo rim;</p><p>(04) Incorreta. Em <span data-type="inline-math" data-latex="t=6"></span> min há cerca de 5 µmol/L de ácido láctico e 7 µmol/L de ácido pirúvico; as duas curvas se encontram perto de <span data-type="inline-math" data-latex="t=5"></span> min;</p><p>(08) Correta. O ácido láctico atinge o máximo, cerca de 16 µmol/L, aos 4 minutos;</p><p>(16) Correta, segundo o gabarito oficial.</p><p><strong>Soma: 08 + 16 = 24</strong></p></div></aside>
<aside class="questao" data-id="01e47b89-bea7-5e70-8fbd-bdbfa70de948" data-gabarito="28"><p>(PAS-UEM 2024, 2ª etapa) A interação energética e alimentar entre plantas e animais constitui uma espécie de “ciclo fechado” no qual a fotossíntese e a respiração animal podem ser entendidas como os dois sentidos da seguinte reação genérica:</p><p>Ciclo 1: <span data-type="inline-math" data-latex="\ce{H2O + CO2 -> }\text{carboidratos}"></span></p><p>Ciclo 2: <span data-type="inline-math" data-latex="\text{carboidratos}\ce{ -> H2O + CO2}"></span></p><p>A partir das informações acima, assinale o que for correto.</p><p>(01) O ciclo 1 é conduzido pelas plantas e é exotérmico.</p><p>(02) O ciclo 2 utiliza a luz solar e é, portanto, endotérmico.</p><p>(04) O ciclo 1 representa a produção de glicose.</p><p>(08) A clorofila das plantas absorve luz e promove a fosforilação de ADP em ATP.</p><p>(16) A etapa 2 é parte da respiração celular. Trata-se de um processo exotérmico cuja energia é aproveitada na síntese de ATP.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. O ciclo 1 é a fotossíntese, que usa a energia da luz: é endotérmico;</p><p>(02) Incorreta. O ciclo 2 é a respiração celular, que não usa luz e libera energia: é exotérmico;</p><p>(04) Correta. A fotossíntese produz glicose (<span data-type="inline-math" data-latex="\ce{C6H12O6}"></span>);</p><p>(08) Correta. Na fase clara, a fosforilação combina o fosfato (Pi) com o ADP, formando ATP;</p><p>(16) Correta. A respiração celular libera energia, aproveitada na formação de ATP.</p><p><strong>Soma: 04 + 08 + 16 = 28</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Glicólise:</h3>
<p>quebra da glicose em ácido pirúvico, no citoplasma; sobram 2 ATP;</p>
<h3 data-corrido="sim">Ciclo de Krebs:</h3>
<p>na matriz mitocondrial; acetil-CoA e ácido oxalacético formam ácido cítrico;</p>
<h3 data-corrido="sim">Cadeia respiratória:</h3>
<p>nas cristas mitocondriais; etapa mais energética, com 26 ATP;</p>
<h3 data-corrido="sim">Fermentação:</h3>
<p>sem <span data-type="inline-math" data-latex="\ce{O2}"></span>; etapa única, a glicólise; 2 ATP;</p>
<h3 data-corrido="sim">Fase clara:</h3>
<p>fotólise da água e fosforilação do ADP; totalmente dependente de luz;</p>
<h3 data-corrido="sim">Fase escura:</h3>
<p>cadeias carbônicas a partir do <span data-type="inline-math" data-latex="\ce{CO2}"></span>, com ATP e <span data-type="inline-math" data-latex="\ce{NADPH2}"></span>;</p>
<h3 data-corrido="sim">Quimiossíntese:</h3>
<p>energia de reações químicas exergônicas; bactérias e arqueas.</p>'
 where slug = 'metabolismo-energetico';

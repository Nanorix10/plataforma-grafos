-- Dispersões: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Pedido do autor em 14/10/2026: reescrever no modelo o resumo que já existe
-- (slug dispersoes, Química, processo pas-uem, sem pai). UPDATE no mesmo slug:
-- id, ligação ao edital e conexões ficam.
--
-- ## Fontes, e só elas
-- 1. Caderno: pro site/Materias e conteúdos feitos/Quimica.docx, §00118–00171
--    do extrator (texto idêntico em Resumos vestibulares/Resumo para PAS UEM
--    2° etapa.docx; Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para
--    PR1G1.docx acrescenta "sangue" aos coloides).
-- 2. Edital: PAS UEM etapa 2, "Classificação de soluções." (já ligado).
-- 3. Provas: PAS-UEM 2015, etapa 3, Q13 (05), pdfs/pas15/E3G1CG.pdf p. 11;
--    PAS-UEM 2021, etapa 2, Q21 (19), pdfs/pas21/E2.pdf p. 11;
--    PAS-UEM 2024, etapa 1, Q21 (13), pdfs/pas24/E1.pdf p. 9;
--    Fuvest (sacarose, alternativa A), do caderno.
--
-- ## O que difere do caderno (decisões do autor, 14/10/2026)
-- - Fuvest: "na solução de 160 tem 50 g de sacarose" → 50 g de água.
-- - Ex. de Cs da sacarose: 180 a 20 °C e 220 a 70 °C → 180 a 0 °C e 220 a
--   30 °C, os dados da tabela da Fuvest.
-- - "Cs é diretamente proporcional à temperatura" → na maioria dos sólidos
--   aumenta com a temperatura; há sais em que diminui (PAS-UEM 2015, E3 Q13).
-- - Supersaturada segue a UEM: excesso de soluto é corpo de fundo de solução
--   saturada. O exercício do KNO3 (Revisão) virou exemplo resolvido; 40 g a
--   20 °C passa a "saturada com corpo de fundo" e 120 g a 40 °C também.
-- A questão "(Revisão)" deixou de ser questão (data-id a041f8f1 sai): sem prova
-- de origem, ela é exemplo resolvido.
--
-- ## Edital
-- Nenhum tópico novo. "Processos de dissolução e solubilidade." (PAS e2) e
-- "Caracterização das soluções, dispersões, …" (PASSE e2) ficam cobertos pela
-- metade.

update resumos
   set definicao = 'Misturas de um disperso em um dispersante: soluções, coloides e suspensões, tipos de solução, coeficiente de solubilidade e saturação.',
       corpo = '<p>Misturas formadas por um disperso (soluto) e um dispersante (solvente);</p>
<ul><li><p><strong>Classificação:</strong> pelo tamanho das partículas dispersas, em soluções, coloides e suspensões;</p></li>
<li><p><strong>Soluções:</strong> sólidas, líquidas ou gasosas; eletrolíticas ou não eletrolíticas;</p></li>
<li><p><strong>Coeficiente de solubilidade (Cs):</strong> define se a solução é saturada, insaturada ou supersaturada;</p></li>
<li><p>A quantidade de soluto na solução é tratada em [[Concentração]].</p></li></ul>
<h2 data-corrido="sim">Solvente:</h2>
<p>quem dissolve;</p>
<ul><li><p>Em soluções aquosas, a água é sempre o solvente.</p></li></ul>
<h2 data-corrido="sim">Soluto:</h2>
<p>quem é dissolvido;</p>
<h2 data-corrido="sim">Classificação das dispersões:</h2>
<p>conforme o tamanho das partículas dispersas na solução;</p>
<table><tbody><tr><th><p><strong>Tipo de dispersão</strong></p></th><th><p><strong>Tamanho médio das partículas dispersas</strong></p></th><th><p><strong>Visibilidade do soluto</strong></p></th><th><p><strong>Características e natureza das partículas dispersas</strong></p></th><th><p><strong>Exemplos</strong></p></th></tr>
<tr><td><p><strong>Soluções</strong></p></td><td><p>&lt; 1 nm</p></td><td><p>Não a olho nu, nem a microscópio óptico.</p></td><td><p>Átomos, moléculas e íons.</p></td><td><p>Sal em água, álcool 70, ouro 18k.</p></td></tr>
<tr><td><p><strong>Coloides</strong></p></td><td><p>1 a 1000 nm</p></td><td><p>Não visível a olho nu e visível a ultramicroscópio.</p></td><td><p>Moléculas ou íons, grandes aglomerados de moléculas ou íons.</p></td><td><p>Gelatina em água, emulsões (cremes em geral, maionese), sangue.</p></td></tr>
<tr><td><p><strong>Suspensões</strong></p></td><td><p>&gt; 1000 nm</p></td><td><p>Visível a olho nu.</p></td><td><p>Aglomerados de moléculas ou íons.</p></td><td><p>Areia em água.</p></td></tr></tbody></table>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/tamanho-das-particulas-dispersas.webp" alt="Escala de diâmetro das partículas: até 1 nm são soluções verdadeiras, de 1 a 1.000 nm coloides, e acima de 1.000 nm suspensões." style="width:100%" data-largura="100%"></figure>
<h2 data-corrido="sim">Tipos de soluções:</h2>
<p>conforme o estado físico da solução;</p>
<ul><li><p><strong>Sólidas:</strong> ouro 18k, bronze, solda eletrônica;</p></li>
<li><p><strong>Líquidas:</strong> soro fisiológico, álcool 70, água potável filtrada, gasolina comum, acetona comum;</p></li>
<li><p><strong>Gasosas:</strong> qualquer mistura gasosa (ver [[Misturas gasosas]]).</p></li></ul>
<h2 data-corrido="sim">Solução eletrolítica:</h2>
<p>possui íons dispersos no solvente;</p>
<ul><li><p><strong>Ex:</strong> ácidos, bases e sais dissolvidos em <span data-type="inline-math" data-latex="\ce{H2O}"></span>.</p></li></ul>
<h2 data-corrido="sim">Solução não eletrolítica:</h2>
<p>não possui íons dispersos;</p>
<ul><li><p><strong>Ex:</strong> todos os carboidratos (açúcares) em <span data-type="inline-math" data-latex="\ce{H2O}"></span>.</p></li></ul>
<h2 data-corrido="sim">Coeficiente de solubilidade (Cs):</h2>
<p>indica a quantidade máxima de soluto que se dissolve em uma quantidade padrão de <span data-type="inline-math" data-latex="\ce{H2O}"></span>; <strong>ponto de saturação</strong>;</p>
<div data-type="block-math" data-latex="C_S=\frac{\text{gramas de soluto}}{100\ \text{g de}\ \ce{H2O}}"></div>
<ul><li><p><strong>Sólidos:</strong> na maioria, o Cs aumenta com a temperatura;</p>
<ul><li><p><strong>Ex:</strong> sacarose: <span data-type="inline-math" data-latex="180\ \text{g}/100\ \text{g de}\ \ce{H2O}"></span> a 0 °C; <span data-type="inline-math" data-latex="220\ \text{g}/100\ \text{g de}\ \ce{H2O}"></span> a 30 °C;</p></li>
<li><p><strong>Obs:</strong> há sais cujo Cs diminui com o aumento da temperatura (PAS-UEM 2015, 3ª etapa);</p></li></ul></li>
<li><p><strong>Gases:</strong> têm sua solubilidade diminuída com o aumento de temperatura.</p></li></ul>
<h3 data-corrido="sim">Saturação:</h3>
<p>comparação entre a quantidade de soluto e o Cs na temperatura da solução;</p>
<ul><li><p><strong>Saturada:</strong> atingiu o Cs máximo;</p>
<ul><li><p>o soluto que excede o Cs não se dissolve e forma o <strong>corpo de fundo</strong> (corpo de chão);</p></li></ul></li>
<li><p><strong>Insaturada:</strong> não atingiu o Cs;</p></li>
<li><p><strong>Supersaturada:</strong> contém dissolvido mais soluto do que a quantidade máxima definida pelo Cs, sem corpo de fundo.</p></li></ul>
<p><strong>Ex:</strong> soluções de <span data-type="inline-math" data-latex="\ce{KNO3}"></span> em 100 g de água;</p>
<table><tbody><tr><th><p><strong>Temperatura (°C)</strong></p></th><th><p><strong>0</strong></p></th><th><p><strong>20</strong></p></th><th><p><strong>40</strong></p></th><th><p><strong>60</strong></p></th><th><p><strong>100</strong></p></th></tr>
<tr><td><p>Solubilidade do <span data-type="inline-math" data-latex="\ce{KNO3}"></span> (g/100 g de água)</p></td><td><p>13,3</p></td><td><p>31,6</p></td><td><p>63,9</p></td><td><p>110</p></td><td><p>246</p></td></tr></tbody></table>
<ol><li><p>40 g a 20 °C: excede o Cs (31,6 g); saturada, com <span data-type="inline-math" data-latex="40-31{,}6=8{,}4\ \text{g}"></span> de corpo de fundo;</p></li>
<li><p>10 g a 0 °C: não alcança o Cs (13,3 g); insaturada;</p></li>
<li><p>120 g a 40 °C: excede o Cs (63,9 g); saturada, com <span data-type="inline-math" data-latex="120-63{,}9=56{,}1\ \text{g}"></span> de corpo de fundo;</p></li>
<li><p>120 g a 100 °C: não alcança o Cs (246 g); insaturada.</p></li></ol>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>o Cs nem sempre aumenta com a temperatura: no sal AB, cuja solubilidade diminui com o aquecimento, a solução saturada resfriada fica insaturada, não supersaturada (PAS-UEM 2015, 3ª etapa);</p></li>
<li><p>a solubilidade dos gases depende também da temperatura, não só da pressão (PAS-UEM 2021, 2ª etapa);</p></li>
<li><p>espuma de sabão não é solução (PAS-UEM 2021, 2ª etapa);</p></li>
<li><p>toda mistura gasosa é solução, mesmo com um gás polar e um apolar (PAS-UEM 2024, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="12e74d9b-8abd-44f7-b81b-bc849c5b5ab6" data-gabarito="05"><p>(PAS-UEM 2015, 3ª etapa) Dado o quadro referente à curva de solubilidade de um sal qualquer AB, cuja massa molar é 100 g/mol, em função da temperatura, e considerando-se que a equação que representa esses dados é da forma <span data-type="inline-math" data-latex="y=ax+b"></span>, assinale o que for correto.</p><table><tbody><tr><th><p><strong>Temperatura (ºC)</strong></p></th><th><p><strong>Solubilidade de AB (g/100 g <span data-type="inline-math" data-latex="\ce{H2O}"></span>)</strong></p></th></tr><tr><td><p>0</p></td><td><p><span data-type="inline-math" data-latex="1{,}50\times10^{-2}"></span></p></td></tr><tr><td><p>10</p></td><td><p><span data-type="inline-math" data-latex="1{,}40\times10^{-2}"></span></p></td></tr><tr><td><p>20</p></td><td><p><span data-type="inline-math" data-latex="1{,}30\times10^{-2}"></span></p></td></tr><tr><td><p>30</p></td><td><p><span data-type="inline-math" data-latex="1{,}20\times10^{-2}"></span></p></td></tr><tr><td><p>40</p></td><td><p><span data-type="inline-math" data-latex="1{,}10\times10^{-2}"></span></p></td></tr><tr><td><p>50</p></td><td><p><span data-type="inline-math" data-latex="1{,}00\times10^{-2}"></span></p></td></tr></tbody></table><p>(01) O coeficiente linear da equação que representa os dados da tabela dada é <span data-type="inline-math" data-latex="1{,}50\times10^{-2}"></span>.</p><p>(02) A 75 ºC a solubilidade de AB será de <span data-type="inline-math" data-latex="7{,}5\times10^{3}"></span> g/100 g <span data-type="inline-math" data-latex="\ce{H2O}"></span>.</p><p>(04) Adicionando-se <span data-type="inline-math" data-latex="6\times10^{-3}"></span> g de AB a 50 mL de água a 50 ºC haveria a formação de <span data-type="inline-math" data-latex="1\times10^{-3}"></span> g de corpo de fundo (corpo de chão).</p><p>(08) O Produto de Solubilidade (<span data-type="inline-math" data-latex="K_{ps}"></span>) de AB a 50 ºC é <span data-type="inline-math" data-latex="1\times10^{-3}"></span>.</p><p>(16) Uma solução saturada de AB, sem corpo de fundo, foi feita a 30 ºC e, posteriormente, resfriada lentamente até 10 ºC, obtendo-se dessa forma uma solução supersaturada.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Em 0 ºC, <span data-type="inline-math" data-latex="y=b=1{,}50\times10^{-2}"></span>;</p><p>(02) Incorreta. A solubilidade cai <span data-type="inline-math" data-latex="1\times10^{-3}"></span> g a cada 10 ºC, logo <span data-type="inline-math" data-latex="a=-1\times10^{-4}"></span>; em 75 ºC, <span data-type="inline-math" data-latex="y=1{,}50\times10^{-2}-75\times10^{-4}=7{,}5\times10^{-3}"></span> g, não <span data-type="inline-math" data-latex="7{,}5\times10^{3}"></span> g;</p><p>(04) Correta. A 50 ºC, o Cs é <span data-type="inline-math" data-latex="1{,}00\times10^{-2}"></span> g/100 g de água, logo <span data-type="inline-math" data-latex="5\times10^{-3}"></span> g em 50 g (50 mL) de água; <span data-type="inline-math" data-latex="6\times10^{-3}-5\times10^{-3}=1\times10^{-3}"></span> g de corpo de fundo;</p><p>(08) Incorreta. <span data-type="inline-math" data-latex="1{,}00\times10^{-2}"></span> g/100 g equivale a 0,1 g/L, ou <span data-type="inline-math" data-latex="1\times10^{-3}"></span> mol/L; para <span data-type="inline-math" data-latex="\ce{AB -&gt; A+ + B-}"></span>, <span data-type="inline-math" data-latex="K_{ps}=(1\times10^{-3})^2=1\times10^{-6}"></span>;</p><p>(16) Incorreta. A solubilidade de AB aumenta quando a temperatura diminui; resfriada até 10 ºC, a solução fica insaturada.</p><p><strong>Soma: 01 + 04 = 05</strong></p></div></aside>
<aside class="questao" data-id="8cbe1675-8f49-550c-863b-b2f3c91aa57f" data-gabarito="19"><p>(PAS-UEM 2021, 2ª etapa) A grande maioria das reações químicas se processa em meio aquoso, seja em escala ambiental, laboratorial, industrial, biológica, seja em qualquer outra. Dessa forma, o domínio do conhecimento sobre as soluções aquosas é de fundamental importância para o desenvolvimento da química. Sobre o assunto, assinale o que for correto.</p><p>(01) A dissolução de sais faz aumentar a densidade das soluções.</p><p>(02) Solução aquosa é uma mistura homogênea composta de água e de um ou mais solutos, como é o caso do soro fisiológico.</p><p>(04) A espuma de sabão é considerada uma solução composta por um líquido e um gás.</p><p>(08) Em água, a solubilidade dos sais depende da temperatura, e a solubilidade dos gases depende da pressão.</p><p>(16) Quando o objetivo é diminuir a concentração das substâncias dissolvidas em solução, usamos a técnica de diluição.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Os íons dissolvidos acrescentam massa sem aumento proporcional de volume;</p><p>(02) Correta. A água é o solvente; o soro fisiológico é solução líquida;</p><p>(04) Incorreta. A espuma de sabão é uma dispersão coloidal de gás em líquido, não uma solução;</p><p>(08) Incorreta. A solubilidade dos gases depende também da temperatura: diminui com o aumento de temperatura;</p><p>(16) Correta. A diluição acrescenta solvente e diminui a concentração (ver [[Concentração]]).</p><p><strong>Soma: 01 + 02 + 16 = 19</strong></p></div></aside>
<aside class="questao" data-id="02089c42-772d-50cc-bdaa-2e96500b4b8c" data-gabarito="13"><p>(PAS-UEM 2024, 1ª etapa) Assinale o que for correto a respeito de misturas e soluções.</p><p>(01) Mistura é a reunião de duas ou mais substâncias diferentes, e toda solução é uma mistura homogênea.</p><p>(02) Uma solução de <span data-latex="\ce{NaOH}" data-type="inline-math"></span> em água, de concentração 100g/L, possui menor concentração em mol/L que uma solução de <span data-latex="\ce{NaOH}" data-type="inline-math"></span> em água de concentração 1 mol/L.</p><p>(04) O leite de magnésia é um tipo de mistura definido como uma suspensão, ou seja, uma mistura heterogênea onde o soluto forma aglomerados de íons muito grandes no solvente.</p><p>(08) O mercúrio, apesar de ser muito prejudicial à vida, é usado em garimpos, pois forma uma solução com o ouro, facilitando a separação do metal nobre do solo.</p><p>(16) Uma mistura de dois gases diferentes em um cilindro, um polar (<span data-latex="\ce{SO2}" data-type="inline-math"></span>) e um apolar (<span data-latex="\ce{O2}" data-type="inline-math"></span>), forma uma mistura gasosa heterogênea.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Toda solução é mistura homogênea;</p><p>(02) Incorreta. Com <span data-type="inline-math" data-latex="\ce{NaOH}=40\ \text{g/mol}"></span>, 100 g/L equivale a <span data-type="inline-math" data-latex="\frac{100}{40}=2{,}5"></span> mol/L, maior que 1 mol/L;</p><p>(04) Correta. Na suspensão, os aglomerados de íons ou moléculas passam de 1000 nm e são visíveis;</p><p>(08) Correta. O mercúrio dissolve o ouro e forma uma solução (amálgama);</p><p>(16) Incorreta. Qualquer mistura gasosa é solução, portanto homogênea.</p><p><strong>Soma: 01 + 04 + 08 = 13</strong></p></div></aside>
<aside class="questao" data-id="c1d5f174-de0b-4303-a1bd-fa2e8181c481" data-gabarito="A"><p>(Fuvest) 160 gramas de uma solução aquosa saturada de sacarose a 30 °C são resfriados a 0 °C. Quanto do açúcar cristaliza?</p><table><tbody><tr><th><p><strong>Temperatura (°C)</strong></p></th><th><p><strong>Solubilidade da sacarose (g/100 g de <span data-type="inline-math" data-latex="\ce{H2O}"></span>)</strong></p></th></tr><tr><td><p>0</p></td><td><p>180</p></td></tr><tr><td><p>30</p></td><td><p>220</p></td></tr></tbody></table><p>A) 20 g</p><p>B) 40 g</p><p>C) 50 g</p><p>D) 64 g</p><p>E) 90 g</p><div class="resolucao"><p>1. A 30 °C, a solução saturada tem 220 g de sacarose para 100 g de água: <span data-type="inline-math" data-latex="220+100=320"></span> g de solução;</p><p>2. Se 320 g de solução têm 220 g de sacarose, 160 g de solução têm 110 g de sacarose e <span data-type="inline-math" data-latex="160-110=50"></span> g de água;</p><p>3. A 0 °C, o Cs é 180 g/100 g de água; em 50 g de água dissolvem-se no máximo 90 g de sacarose;</p><p>4. Cristalizam <span data-type="inline-math" data-latex="110-90=20"></span> g.</p><p><strong>Alternativa A</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Dispersões:</h3>
<p>misturas de um disperso (soluto) em um dispersante (solvente);</p>
<h3 data-corrido="sim">Soluções:</h3>
<p>partículas menores que 1 nm; átomos, moléculas e íons;</p>
<h3 data-corrido="sim">Coloides:</h3>
<p>partículas de 1 a 1000 nm; visíveis só ao ultramicroscópio;</p>
<h3 data-corrido="sim">Suspensões:</h3>
<p>partículas maiores que 1000 nm; visíveis a olho nu;</p>
<h3 data-corrido="sim">Solução eletrolítica:</h3>
<p>possui íons dispersos no solvente;</p>
<h3 data-corrido="sim">Coeficiente de solubilidade (Cs):</h3>
<p>quantidade máxima de soluto que se dissolve em 100 g de água;</p>
<h3 data-corrido="sim">Corpo de fundo:</h3>
<p>soluto que excede o Cs e não se dissolve, em solução saturada;</p>
<h3 data-corrido="sim">Solução supersaturada:</h3>
<p>mais soluto dissolvido do que o Cs, sem corpo de fundo.</p>'
 where slug = 'dispersoes';

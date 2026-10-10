-- Eletrostática: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Conferido no banco em 10/10/2026: o resumo `eletrostatica` já existia
-- (Física, processo `comum`, sem pai) com o corpo VAZIO e nenhum tópico de
-- edital ligado. Decisão do autor: preencher o existente. Por isso esta
-- migration é um `update` no slug, e não o `insert … on conflict do nothing`
-- do molde, que não faria nada. `definicao`, `processo_slug` e `pai_id` ficam
-- como estão: a definição já existe e cabe no modelo, `comum` é o destino do
-- material de prova de escola (decisão 1c), e não há resumo de eletricidade
-- que sirva de pai. Não há resumo próprio de campo nem de potencial elétrico
-- no catálogo, então o recorte aprovado pelo autor é um resumo só.
--
-- ## Fontes, e só elas
-- 1. Caderno, seção FÍSICA A:
--    - `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para PR1G3.docx`,
--      §00003–00010 do extrator (eletrização, força elétrica, série
--      triboelétrica); o mesmo texto está em `Resumo para Simulado
--      Poliedro.docx`, §00286–00293;
--    - `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para PR2G3.docx`,
--      §00003–00019 (campo, energia potencial, trabalho, potencial,
--      equilíbrio eletrostático, quatro figuras);
--    - `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para Simulado Harmonia_
--      1º dia.docx`, §00192–00209 (mesmo texto do PR2G3, mais as linhas sobre
--      a dependência do campo e do potencial com a distância e V = E·d);
--    - `Resumos vestibulares/Resumo para PAS UEM 1°etapa.docx`, tabela de
--      unidades (carga em C, potencial em V, campo em N/C).
-- 2. Edital: PAS UEM, etapa 3, Física.
-- 3. Provas, em Documents/UEM-Provas/pdfs:
--    - PAS-UEM 2017, etapa 3, questão 33 (gabarito 05), pas17/E3G1_FIS.pdf,
--      p. 2 — a questão;
--    - PAS-UEM 2019, etapa 3, questão 31 (gabarito 26), pas19/E3G1-FIS.pdf,
--      p. 2 — a pegadinha (item 04) e o texto do equilíbrio eletrostático
--      (item 16);
--    - PAS-UEM 2016, etapa 3, questão 13 (gabarito 02), pas16/E3G1.pdf, p. 9 —
--      o exemplo resolvido e o valor de k.
--
-- ## O que difere do caderno
-- - Decisão do autor (parada de erro de conteúdo): o Harmonia, §00197 do
--   extrator (§00268 no índice de busca), diz "O campo elétrico é inversamente
--   e exponencialmente proporcional à distância;". Corrigido para "O campo
--   elétrico é inversamente proporcional ao quadrado da distância;". Motivos:
--   a figura do próprio caderno logo acima (E = k|Q|/d²), a Lei de Coulomb do
--   PR1G3 ("A força é inversamente proporcional ao quadrado da distância") com
--   E = F/q, e a PAS-UEM 2016 E3 Q13, cujo gabarito 02 só fecha com
--   E = kQ/d².
-- - Acréscimos com fonte: valor de k (PAS-UEM 2016 Q13); unidades de Q, E e V
--   (tabela do PAS UEM 1ª etapa) e de F, d, Ep (SI, J/C = V do caderno);
--   regra de leitura da série triboelétrica (a seta + e − da figura);
--   τAB = EpA − EpB (das duas fórmulas de trabalho do caderno); a observação
--   de que V = E·d vale como produto em campo uniforme (PAS-UEM 2017 Q33,
--   item 02); V_ext = kQ/d na figura da esfera (V = kQ/d do caderno); o
--   enunciado do equilíbrio eletrostático (PAS-UEM 2019 Q31, item 16); as
--   definições curtas de campo e potencial, lidas de E = F/q e V = Ep/q.
-- - Forma: "força sob a carga de prova" → "sobre"; "Campo elétrica" →
--   "Campo elétrico"; E com barra → E com seta; "1{0}^{-19}" → 10⁻¹⁹ C.
--
-- ## Edital (PAS UEM, etapa 3, Física)
-- Ligados, cobertos inteiros: "Lei de Coulomb.", "Campo elétrico",
-- "Potencial elétrico.". Pela metade, de fora: "Eletrostática." (faltam
-- condutores e isolantes, conservação da carga, contato e indução) e "Carga
-- elétrica e processos de eletrização." (só o atrito). Não cobertos:
-- "Condutores e isolantes elétricos." e "Princípio de conservação da carga
-- elétrica.". PASSE, etapa 2, "Conhecimento e aplicação de conceitos de
-- eletrostática e circuitos elétricos…" fica de fora (pela metade).

update resumos
   set corpo = '<p>Ramo da Física que estuda as cargas elétricas em estado de repouso e os fenômenos associados a elas;</p>
<ul><li><p><strong>Eletrização:</strong> objetos ficam positivos ou negativos;</p></li>
<li><p><strong>Força elétrica:</strong> Lei de Coulomb;</p></li>
<li><p><strong>Campo elétrico:</strong> força sobre a carga de prova, por unidade de carga;</p></li>
<li><p><strong>Energia potencial elétrica e trabalho da força elétrica;</strong></p></li>
<li><p><strong>Potencial elétrico:</strong> energia potencial elétrica por unidade de carga;</p></li>
<li><p><strong>Equilíbrio eletrostático:</strong> o condutor eletrizado em repouso.</p></li></ul>

<h2 data-corrido="sim">Eletrização:</h2>
<p>objetos podem ficar positivos ou negativos quando atritados, dependendo de sua composição;</p>
<ul><li><p><span data-type="inline-math" data-latex="Q=n\cdot e"></span>;</p>
<ul><li><p><span data-type="inline-math" data-latex="Q"></span>: carga elétrica (C);</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span>: número de elétrons em falta ou em excesso;</p></li>
<li><p><span data-type="inline-math" data-latex="e"></span>: carga elementar (<span data-type="inline-math" data-latex="e=1{,}6\cdot 10^{-19}\ \text{C}"></span>);</p></li></ul></li>
<li><p><strong>Série triboelétrica:</strong> no atrito entre dois materiais, o mais acima na série fica positivo e o mais abaixo fica negativo.</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/serie-triboeletrica.webp" alt="Série triboelétrica, do polo positivo ao negativo: pele humana, couro, pele de coelho, vidro liso, cabelo humano, fibra sintética, lã, pele de gato, seda, alumínio, papel ou papelão fino, algodão, madeira, âmbar, borracha dura, poliéster, isopor, filme PVC, poliuretano, polipropileno, silicone e teflon." style="width:50%" data-largura="50%"></figure></li></ul>

<h2 data-corrido="sim">Força elétrica:</h2>
<p>Lei de Coulomb;</p>
<div data-type="block-math" data-latex="F=\frac{k\cdot |q_1|\cdot |q_2|}{d^2}"></div>
<ul><li><p><span data-type="inline-math" data-latex="F"></span>: força elétrica (N);</p></li>
<li><p><span data-type="inline-math" data-latex="k"></span>: constante eletrostática (<span data-type="inline-math" data-latex="k=9\cdot 10^{9}\ \text{N}\cdot\text{m}^2/\text{C}^2"></span>, no vácuo);</p></li>
<li><p><span data-type="inline-math" data-latex="q_1"></span> e <span data-type="inline-math" data-latex="q_2"></span>: cargas elétricas (C);</p></li>
<li><p><span data-type="inline-math" data-latex="d"></span>: distância entre as cargas (m);</p></li>
<li><p>A força é inversamente proporcional ao quadrado da distância.</p></li></ul>

<h2 data-corrido="sim">Campo elétrico:</h2>
<p>força elétrica sobre a carga de prova, por unidade de carga;</p>
<div data-type="block-math" data-latex="\vec{E}=\frac{\vec{F}}{q}"></div>
<ul><li><p><span data-type="inline-math" data-latex="\vec{E}"></span>: campo elétrico (N/C);</p></li>
<li><p><span data-type="inline-math" data-latex="\vec{F}"></span>: força sobre a carga de prova (N);</p></li>
<li><p><span data-type="inline-math" data-latex="q"></span>: valor da carga de prova (C);</p></li>
<li><p><strong>Carga puntiforme:</strong></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/campo-eletrico-carga-puntiforme.webp" alt="Campo elétrico de uma carga puntiforme: direção radial; sentido divergente para Q maior que zero e convergente para Q menor que zero; intensidade E igual a k vezes o módulo de Q, dividido por d ao quadrado." style="width:70%" data-largura="70%"></figure>
<ul><li><p>O campo elétrico é inversamente proporcional ao quadrado da distância;</p></li></ul></li>
<li><p><strong>Linhas de campo:</strong></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/linhas-de-campo-carga-puntiforme.webp" alt="Linhas de campo de uma carga puntiforme: para Q maior que zero, as linhas saem da carga; para Q menor que zero, as linhas chegam à carga." style="width:70%" data-largura="70%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/linhas-de-campo-duas-cargas.webp" alt="Linhas de campo de duas cargas: de mesmo módulo e sinais contrários, as linhas vão da positiva à negativa; de mesmo módulo e mesmo sinal, o campo é nulo no ponto médio, onde a densidade de linhas é nula; de sinais contrários, com a carga positiva 2,5 vezes maior em módulo, mais linhas partem da positiva." style="width:100%" data-largura="100%"></figure></li></ul>

<h2>Energia potencial elétrica</h2>
<div data-type="block-math" data-latex="E_p=\frac{k\cdot Q\cdot q}{d}"></div>
<ul><li><p><span data-type="inline-math" data-latex="E_p"></span>: energia potencial elétrica (J).</p></li></ul>

<h2>Trabalho da força elétrica</h2>
<ul><li><p>De um ponto A até um ponto B (ver [[Trabalho e energia]]): <span data-type="inline-math" data-latex="\tau_{AB}=k\cdot Q\cdot q\left(\frac{1}{d_A}-\frac{1}{d_B}\right)"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="\tau_{AB}=q\,(V_A-V_B)"></span>;</p></li>
<li><p><strong>Fundamento:</strong> <span data-type="inline-math" data-latex="\tau_{AB}=E_{pA}-E_{pB}"></span>.</p></li></ul>

<h2 data-corrido="sim">Potencial elétrico/tensão/voltagem:</h2>
<p>energia potencial elétrica por unidade de carga (ver [[Eletrodinâmica]]);</p>
<div data-type="block-math" data-latex="V=\frac{E_p}{q}\quad [\text{J/C}=\text{V}]"></div>
<ul><li><p><span data-type="inline-math" data-latex="V=\frac{k\cdot Q}{d}"></span>;</p>
<ul><li><p>O potencial é inversamente proporcional à distância;</p></li></ul></li>
<li><p><span data-type="inline-math" data-latex="V=E\cdot d"></span>;</p>
<ul><li><p><strong>Obs:</strong> em campo elétrico uniforme, a diferença de potencial entre dois pontos é o produto do campo pela distância, e não a razão;</p></li></ul></li>
<li><p><strong>Ex:</strong> (PAS-UEM 2016, 3ª etapa) esfera condutora eletrizada com carga <span data-type="inline-math" data-latex="Q&gt;0"></span>, no vácuo; no ponto P, a 2 m do centro, o campo tem intensidade <span data-type="inline-math" data-latex="9\cdot 10^{-2}\ \text{V/m}"></span>.</p>
<ol><li><p>Carga: <span data-type="inline-math" data-latex="E=\frac{k\cdot Q}{d^2}\Rightarrow Q=\frac{E\cdot d^2}{k}=\frac{9\cdot 10^{-2}\cdot 2^2}{9\cdot 10^{9}}=4\cdot 10^{-11}\ \text{C}"></span>;</p></li>
<li><p>Potencial em P: <span data-type="inline-math" data-latex="V=\frac{k\cdot Q}{d}=\frac{9\cdot 10^{9}\cdot 4\cdot 10^{-11}}{2}=0{,}18\ \text{V}"></span>.</p></li></ol></li></ul>

<h2 data-corrido="sim">Equilíbrio eletrostático:</h2>
<p>o campo elétrico resultante nos pontos internos de um condutor em equilíbrio eletrostático é nulo, e o potencial elétrico em todos os pontos internos e superficiais desse condutor é constante;</p>
<ul><li><p><strong>Esfera condutora de raio</strong> <span data-type="inline-math" data-latex="r"></span>:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/equilibrio-eletrostatico-esfera.webp" alt="Esfera condutora de raio r eletrizada positivamente, com um ponto externo X à distância d do centro: o potencial na superfície e o potencial interno valem k vezes Q dividido por r." style="width:100%" data-largura="100%"></figure>
<ul><li><p><span data-type="inline-math" data-latex="V_{\text{superfície}}=V_{\text{interno}}=\frac{k\cdot Q}{r}"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="V_{\text{ext}}=\frac{k\cdot Q}{d}"></span>.</p></li></ul></li></ul>

<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>em todo movimento espontâneo de cargas elétricas em um campo elétrico, a energia potencial elétrica diminui (PAS-UEM 2019, 3ª etapa).</p></li></ul></td></tr></tbody></table>

<aside class="questao" data-id="94eda87a-1bdc-4c52-9d54-054e71c93ec3" data-gabarito="05"><p>(PAS-UEM 2017, 3ª etapa) Sobre os conceitos relacionados a trabalho, potencial elétrico e energia potencial elétrica, assinale o que for correto.</p><p>(01) Quando uma força elétrica constante desloca uma carga elétrica positiva de um ponto A até um ponto B ao longo de uma linha de força de um campo elétrico uniforme, o trabalho realizado por essa força é positivo, e o potencial elétrico em A é maior que o potencial elétrico em B.</p><p>(02) A diferença de potencial elétrico entre dois pontos A e B de uma certa região do espaço, onde existe um campo elétrico uniforme, é dada pela razão entre a intensidade do campo elétrico nessa região e a distância entre os pontos A e B.</p><p>(04) O trabalho realizado por uma força elétrica de módulo F, quando esta desloca uma carga elétrica positiva q de um ponto A até um ponto B ao longo de uma linha de força de um campo elétrico uniforme de módulo E, é dado por: <span data-type="inline-math" data-latex="W_{AB}=q(V_A-V_B)"></span>, em que <span data-type="inline-math" data-latex="V_A"></span> e <span data-type="inline-math" data-latex="V_B"></span> são os potenciais elétricos nos pontos A e B, respectivamente.</p><p>(08) A quantidade de energia potencial elétrica acumulada por uma carga elétrica Q, disposta em um campo elétrico uniforme, é dependente da diferença de potencial elétrico no interior do campo.</p><p>(16) Em todo movimento espontâneo de cargas elétricas negativas, em um campo elétrico uniforme, a energia potencial elétrica dessas cargas aumenta e estas fluem para as regiões do campo elétrico de maior potencial elétrico.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Sobre a carga positiva, a força elétrica tem o sentido do campo, e o trabalho ao longo da linha de força é positivo; de <span data-type="inline-math" data-latex="\tau_{AB}=q(V_A-V_B)&gt;0"></span> com <span data-type="inline-math" data-latex="q&gt;0"></span>, vem <span data-type="inline-math" data-latex="V_A&gt;V_B"></span>;</p><p>(02) Incorreta. Em campo uniforme, a diferença de potencial é o produto <span data-type="inline-math" data-latex="E\cdot d"></span>, e não a razão;</p><p>(04) Correta. É a expressão <span data-type="inline-math" data-latex="\tau_{AB}=q(V_A-V_B)"></span>;</p><p>(08) Incorreta. De <span data-type="inline-math" data-latex="V=\frac{E_p}{q}"></span>, a energia potencial da carga depende do potencial elétrico no ponto onde ela está, e não da diferença de potencial no interior do campo;</p><p>(16) Incorreta. As cargas negativas fluem para as regiões de maior potencial, mas o trabalho da força elétrica é positivo (<span data-type="inline-math" data-latex="q&lt;0"></span> e <span data-type="inline-math" data-latex="V_A&lt;V_B"></span>), e a energia potencial elétrica diminui;</p><p><strong>Soma: 01 + 04 = 05</strong></p></div></aside>

<h2>Para revisar</h2>
<h3 data-corrido="sim">Carga elétrica de um corpo eletrizado:</h3>
<p><span data-type="inline-math" data-latex="Q=n\cdot e"></span>, com <span data-type="inline-math" data-latex="e=1{,}6\cdot 10^{-19}\ \text{C}"></span>;</p>
<h3 data-corrido="sim">Lei de Coulomb:</h3>
<p><span data-type="inline-math" data-latex="F=\frac{k\cdot |q_1|\cdot |q_2|}{d^2}"></span>, inversamente proporcional ao quadrado da distância;</p>
<h3 data-corrido="sim">Campo elétrico de carga puntiforme:</h3>
<p>radial, divergente para <span data-type="inline-math" data-latex="Q&gt;0"></span> e convergente para <span data-type="inline-math" data-latex="Q&lt;0"></span>, com <span data-type="inline-math" data-latex="E=\frac{k\cdot |Q|}{d^2}"></span>;</p>
<h3 data-corrido="sim">Potencial elétrico de carga puntiforme:</h3>
<p><span data-type="inline-math" data-latex="V=\frac{k\cdot Q}{d}"></span>, inversamente proporcional à distância;</p>
<h3 data-corrido="sim">Trabalho da força elétrica:</h3>
<p><span data-type="inline-math" data-latex="\tau_{AB}=q\,(V_A-V_B)"></span>;</p>
<h3 data-corrido="sim">Unidade de potencial elétrico:</h3>
<p>volt, <span data-type="inline-math" data-latex="\text{J/C}=\text{V}"></span>;</p>
<h3 data-corrido="sim">Condutor em equilíbrio eletrostático:</h3>
<p>campo interno nulo e potencial constante em todos os pontos internos e superficiais.</p>'
 where slug = 'eletrostatica';

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 3
   and e.materia_slug = 'fisica'
   and e.texto in ('Lei de Coulomb.', 'Campo elétrico', 'Potencial elétrico.')
   and e.resumo_id is null
   and r.slug = 'eletrostatica';

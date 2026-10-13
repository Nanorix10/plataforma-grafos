-- Funções inorgânicas: ácidos, bases, sais e óxidos: rascunhado por Claude no
-- modelo de docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e
-- revisado pelo autor. Aprovar o PR é publicar.
--
-- **Junta sete resumos em um.** Estudo dos Ácidos e classificação,
-- Nomenclatura de Ácidos, Estudo das Bases, Nomenclatura das Bases, Óxidos,
-- Formulação de Sais e Nomenclatura de Sais existiam como resumos soltos
-- (393 a 3.396 caracteres, sem pai). Decisão do autor (12/10/2026): apagar os
-- sete e reuni-los aqui, cada função como seção (grafo `h2`).
--
-- ## Por que este tópico
--
-- Conferido no banco em 12/10/2026: `edital_topicos.resumo_id` é único, e
-- nenhum fragmento cobria inteiro o PAS-UEM 1ª etapa nº 31 ("Funções
-- inorgânicas.") nem o nº 32 ("Características dos ácidos, das bases, dos sais
-- e dos óxidos."). O PASSE 1ª etapa nº 17 estava ligado a Nomenclatura de
-- Ácidos, que cobria só os ácidos. Processo `comum` (decisão 1c).
--
-- ## Fontes, e só elas
--
-- 1. Caderno: `Materias e conteúdos feitos/Quimica.docx`, §00320–00419 do
--    extrator (Estudo dos Ácidos e classificação até Nomenclatura de Sais) e
--    §00438 (dupla troca HCl + NaOH). Cópias: `Resumos 2025/Resumos 4°
--    bimestre/Resumo para PR1G2.docx` (ácidos e bases), `Resumo para
--    PR2G2.docx` (óxidos e sais), `Resumo para Simulado Harmonia_ 2º dia.docx`
--    (sais). A tabela de NOx das bases é a figura `image54.png`, transcrita.
-- 2. Edital: PAS-UEM 1ª etapa nº 31, 32 e 33; PASSE 1ª etapa nº 17.
-- 3. Provas: PAS-UEM 2018, etapa 2, questão 21 (gabarito 11), em
--    `Documents/UEM-Provas/pdfs/pas18/E2G1.pdf`, p. 11: a questão e duas
--    pegadinhas (itens 04 e 16). PAS-UEM 2022, etapa 1, questão 21 (gabarito
--    25), `pdfs/pas22/E1.pdf`, p. 9: pegadinha do item 02. PAS-UEM 2025,
--    etapa 1, questões 38 (gabarito 25; item 08, CaO óxido básico) e 40
--    (gabarito 18; item 02, dissociação × ionização), `pdfs/pas25/E1.pdf`,
--    p. 19. UEPG-PR 2020 e UEPG-PR 2022: as questões resolvidas do caderno.
--
-- ## Correções de conteúdo, aprovadas pelo autor em 12/10/2026
--
-- a. §00340 "HCl (ácido cianídrico)" → HCl, ácido clorídrico; HCN, cianídrico.
-- b. §00415 "Ca^{3+} + CO^{-} → CaCO3" → Ca²⁺ + CO₃²⁻ → CaCO₃.
-- c. §00402 "NOx do Oxigênio igual a 1" → igual a −1. A fórmula 2·nO/n elem.,
--    que o caderno punha sob Peróxidos, dá o NOx do metal e foi para a
--    nomenclatura dos óxidos iônicos.
-- d. §00333 faixas sobrepostas em 5% → forte α > 50%, moderado
--    5% ≤ α ≤ 50%, fraco α < 5%.
-- e. §00375 "bases de amônio que são gases extremamente voláteis" → o NH4OH é
--    instável e se decompõe em NH3 (volátil) e água.
-- f. §00401 "Duplos (misto): … Ex:" sem exemplo → Ex: Fe3O4.
-- g. §00411 "MnO2 – óxido mangânico" → óxido de manganês IV ou dióxido de
--    manganês.
-- h. §00362 "carbonato (CO3^-)" → CO₃²⁻.
-- i. §00363 resolução do item 04 da UEPG 2020: acrescentado que o H3PO3 é
--    diácido (só 2 hidrogênios ionizáveis).
--
-- ## Edital
--
-- Ligados: PAS-UEM 1ª etapa nº 31 e nº 32 (cobertos inteiros); PASSE 1ª etapa
-- nº 17 passa de Nomenclatura de Ácidos para este (passo 3).
-- Fora: PAS-UEM 1ª etapa nº 33 (indicadores, condutibilidade elétrica, reação
-- com metais, neutralização): o caderno não traz nada disso.
--
-- ## Referências aos sete resumos apagados (levantadas em 12/10/2026)
--
-- FKs para `resumos`: resumos.pai_id, conexoes.origem_id/destino_id,
-- eventos.resumo_id, edital_topicos.resumo_id, leituras.resumo_id,
-- grifos.resumo_id, respostas.resumo_id. Na data: 0 filhos, 0 conexões,
-- 0 eventos, 1 tópico de edital (PASSE 1ª etapa nº 17), 0 grifos,
-- 0 respostas, 0 wikilinks de entrada; 2 leituras. Cada passo redireciona o
-- que existir na hora, e a migration aborta se houver grifo ou resposta.

-- 1. O resumo novo.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'funcoes-inorganicas',
  'Funções inorgânicas: ácidos, bases, sais e óxidos',
  'quimica',
  'comum',
  'Ácidos, bases, sais e óxidos: classificação, fórmula e nomenclatura de cada função inorgânica, com a ionização e a dissociação na água.',
  '<p>grupos de compostos inorgânicos classificados pela composição e pelo comportamento na água, cada um com regra própria de fórmula e de nomenclatura;</p>
<ul><li><p><strong>Ácidos:</strong> compostos de natureza covalente que liberam o cátion <span data-type="inline-math" data-latex="\ce{H+}"></span> por ionização;</p></li>
<li><p><strong>Bases:</strong> compostos iônicos formados pelo íon hidroxila (<span data-type="inline-math" data-latex="\ce{OH-}"></span>) ligado a um metal ou ao grupo amônio (<span data-type="inline-math" data-latex="\ce{NH4+}"></span>);</p></li>
<li><p><strong>Sais:</strong> compostos formados sempre por um cátion e um ânion;</p></li>
<li><p><strong>Óxidos:</strong> compostos binários formados por qualquer elemento com oxigênio, exceto o flúor e os gases nobres.</p></li></ul>
<h2 data-corrido="sim">Ácidos:</h2>
<p>compostos de natureza covalente ([[Ligação molecular (covalente)]]);</p>
<ul><li><p><strong>Presença de oxigênio:</strong> com oxigênio, <strong>oxiácido</strong>; sem oxigênio, <strong>hidrácido</strong>;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{HCl}"></span> e <span data-type="inline-math" data-latex="\ce{HF}"></span> (hidrácidos); <span data-type="inline-math" data-latex="\ce{H3BO3}"></span> (oxiácido);</p></li></ul></li>
<li><p><strong>Número de elementos:</strong></p>
<ul><li><p><strong>Binário:</strong> <span data-type="inline-math" data-latex="\ce{HCl}"></span>, <span data-type="inline-math" data-latex="\ce{HBr}"></span>, <span data-type="inline-math" data-latex="\ce{HF}"></span>;</p></li>
<li><p><strong>Ternário:</strong> <span data-type="inline-math" data-latex="\ce{H2SO4}"></span>, <span data-type="inline-math" data-latex="\ce{H3PO4}"></span>, <span data-type="inline-math" data-latex="\ce{HCN}"></span>;</p></li>
<li><p><strong>Quaternário:</strong> <span data-type="inline-math" data-latex="\ce{H4Fe(CN)6}"></span>;</p></li></ul></li>
<li><p><strong>Hidrogênio ionizável:</strong> hidrogênio retirado do ácido sob a forma de cátion <span data-type="inline-math" data-latex="\ce{H+}"></span>;</p></li>
<li><p><strong>Número de hidrogênios ionizáveis:</strong></p>
<ul><li><p><strong>Monoácido:</strong> <span data-type="inline-math" data-latex="\ce{HCl}"></span>;</p></li>
<li><p><strong>Diácido:</strong> <span data-type="inline-math" data-latex="\ce{H2SO4}"></span>;</p></li>
<li><p><strong>Triácido:</strong> <span data-type="inline-math" data-latex="\ce{H3PO4}"></span>;</p></li>
<li><p><strong>Poliácido:</strong> <span data-type="inline-math" data-latex="\ce{H4Fe(CN)6}"></span>;</p></li></ul></li>
<li><p><strong>Força:</strong> medida pelo percentual de moléculas que ionizam em água (grau de ionização, <span data-type="inline-math" data-latex="\alpha"></span>);</p>
<ul><li><p><strong>Forte:</strong> <span data-type="inline-math" data-latex="\alpha &gt; 50\%"></span>;</p></li>
<li><p><strong>Moderado:</strong> <span data-type="inline-math" data-latex="5\% \le \alpha \le 50\%"></span>;</p></li>
<li><p><strong>Fraco:</strong> <span data-type="inline-math" data-latex="\alpha &lt; 5\%"></span>;</p></li></ul></li></ul>
<div data-type="block-math" data-latex="\alpha=\frac{\text{número de moléculas ionizadas}}{\text{número de moléculas dissolvidas}}\cdot 100\%"></div>
<ul><li><p><strong>Ionização:</strong> representada pela equação abaixo;</p></li></ul>
<div data-type="block-math" data-latex="H_xA \rightarrow x\,H^{+} + A^{x-}"></div>
<ul><li><p><span data-type="inline-math" data-latex="x"></span>: número de hidrogênios ionizáveis;</p></li>
<li><p><span data-type="inline-math" data-latex="A"></span>: o que está ligado ao <span data-type="inline-math" data-latex="\ce{H}"></span>;</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{H3PO4 -> 3H+ + PO4^3-}"></span>.</p></li></ul>
<h3 data-corrido="sim">Hidrácidos:</h3>
<p>nome formado por elemento ou grupo + ÍDRICO;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{HCl}"></span> (ácido clorídrico); <span data-type="inline-math" data-latex="\ce{HCN}"></span> (ácido cianídrico).</p></li></ul>
<h3 data-corrido="sim">Oxiácidos:</h3>
<p>nome que depende do NOx (número de oxidação: carga elétrica de um átomo na molécula) do elemento central e da sua família;</p>
<ul><li><p><strong>NOx do elemento central:</strong> <span data-type="inline-math" data-latex="NOx = 2\cdot n_{O} - n_{H}"></span>;</p>
<ul><li><p><span data-type="inline-math" data-latex="n_{O}"></span>: número de oxigênios;</p></li>
<li><p><span data-type="inline-math" data-latex="n_{H}"></span>: número de hidrogênios.</p></li></ul></li></ul>
<table><tbody><tr><th><p><strong>Nome</strong></p></th><th><p><strong>3A</strong></p></th><th><p><strong>4A</strong></p></th><th><p><strong>5A</strong></p></th><th><p><strong>6A</strong></p></th><th><p><strong>7A</strong></p></th></tr>
<tr><td><p>PER + elemento + ICO</p></td><td><p></p></td><td><p></p></td><td><p></p></td><td><p></p></td><td><p>7</p></td></tr>
<tr><td><p>elemento + ICO</p></td><td><p>3</p></td><td><p>4</p></td><td><p>5</p></td><td><p>6</p></td><td><p>5</p></td></tr>
<tr><td><p>elemento + OSO</p></td><td><p>1</p></td><td><p>2</p></td><td><p>3</p></td><td><p>4</p></td><td><p>3</p></td></tr>
<tr><td><p>HIPO + elemento + OSO</p></td><td><p></p></td><td><p></p></td><td><p>1</p></td><td><p>2</p></td><td><p>1</p></td></tr></tbody></table>
<ol><li><p>Calcula-se o NOx do boro no <span data-type="inline-math" data-latex="\ce{H3BO3}"></span>: <span data-type="inline-math" data-latex="NOx = 2\cdot 3 - 3 = 3"></span>;</p></li>
<li><p>O boro está na família 3A; na tabela, NOx 3 na família 3A corresponde a elemento + ICO;</p></li>
<li><p>Nome: ácido bórico.</p></li></ol>
<h3 data-corrido="sim">Desidratação:</h3>
<p>remoção de moléculas de água do ácido;</p>
<ul><li><p>Quando é possível, o ácido recebe o prefixo ORTO;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{H4SiO4}"></span> (ácido ortossilícico);</p></li></ul></li>
<li><p><strong>Intramolecular:</strong> remoção de uma molécula de água de <strong>uma molécula</strong> de ácido, que recebe o prefixo META;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="H_4SiO_4 - H_2O = H_2SiO_3"></span> (ácido metassilícico);</p></li></ul></li>
<li><p><strong>Intermolecular:</strong> remoção de uma molécula de água de <strong>duas moléculas</strong> de ácido;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="H_8Si_2O_8 - H_2O = H_6Si_2O_7"></span> (ácido pirossilícico);</p></li></ul></li>
<li><p>Ácidos com átomos de enxofre no lugar do oxigênio recebem o prefixo TIO.</p></li></ul>
<h2 data-corrido="sim">Bases:</h2>
<p>compostos iônicos ([[Ligação iônica]]) formados pelo íon hidroxila (<span data-type="inline-math" data-latex="\ce{OH-}"></span>) ligado a um metal ou ao grupo amônio (<span data-type="inline-math" data-latex="\ce{NH4+}"></span>);</p>
<ul><li><p><strong>Dissociação iônica:</strong> separação dos íons constituintes da estrutura, quando a base interage com a água;</p></li></ul>
<div data-type="block-math" data-latex="\ce{M(OH)_{x}(aq) -> x\,OH^{-}(aq) + M^{x+}(aq)}"></div>
<ul><li><p><span data-type="inline-math" data-latex="(aq)"></span>: à direita da fórmula, indica que o composto está dissolvido na água;</p></li>
<li><p><strong>Força:</strong> fortes (famílias 1A e 2A da [[Tabela Periódica]], exceto Mg) e fracas (as demais);</p></li>
<li><p><strong>Solubilidade:</strong> solúveis (1A e amônio), pouco solúveis (2A) e insolúveis (as demais);</p></li>
<li><p><strong>Estado físico:</strong> sólidos cristalinos, por serem compostos iônicos;</p>
<ul><li><p><strong>Obs:</strong> o <span data-type="inline-math" data-latex="\ce{NH4OH}"></span> é instável e se decompõe em <span data-type="inline-math" data-latex="\ce{NH3}"></span> (volátil) e água.</p></li></ul></li></ul>
<h3 data-corrido="sim">Nomenclatura das bases:</h3>
<p>hidróxido de + metal ou grupo;</p>
<ul><li><p><strong>Valências múltiplas:</strong> elementos das famílias B (exceto Zn e Ag) e da família 4A;</p>
<ul><li><p>Informa-se a valência em algarismos romanos, ou usa-se o sufixo ICO para a maior valência e OSO para a menor;</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{Fe(OH)3}"></span> (hidróxido de ferro III ou hidróxido férrico).</p></li></ul></li></ul>
<table><tbody><tr><th><p><strong>Elementos</strong></p></th><th><p><strong>NOx</strong></p></th></tr>
<tr><td><p>Mn</p></td><td><p>+2, +4, +6 ou +7</p></td></tr>
<tr><td><p>Fe, Co e Ni</p></td><td><p>+2 ou +3</p></td></tr>
<tr><td><p>Pb, Pt e Sn</p></td><td><p>+2 ou +4</p></td></tr>
<tr><td><p>Au</p></td><td><p>+1 ou +3</p></td></tr>
<tr><td><p>Cu e Hg</p></td><td><p>+1 ou +2</p></td></tr>
<tr><td><p>Cr</p></td><td><p>+2, +3 ou +6</p></td></tr></tbody></table>
<h2 data-corrido="sim">Sais:</h2>
<p>compostos formados sempre por um cátion e um ânion;</p>
<ul><li><p><strong>Fórmula geral:</strong> <span data-type="inline-math" data-latex="C^{x+} + A^{y-} \rightarrow C_{y}A_{x}"></span>;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{Na+ + Cl- -> NaCl}"></span> (sal comum);</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{Ca^2+ + CO3^2- -> CaCO3}"></span> (carbonato de cálcio);</p></li></ul></li>
<li><p><strong>Nomenclatura:</strong> nome do ânion + de + nome do cátion;</p>
<ul><li><p>Cada ânion tem seu nome, dado no exercício;</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{LiNO3}"></span> (nitrato de lítio; <span data-type="inline-math" data-latex="\ce{NO3-}"></span>: ânion nitrato);</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{AlPO4}"></span> (fosfato de alumínio; <span data-type="inline-math" data-latex="\ce{PO4^3-}"></span>: ânion fosfato);</p></li></ul></li>
<li><p><strong>Obs:</strong> ácido e base formam sal e água numa dupla troca ([[Reações químicas]]): <span data-type="inline-math" data-latex="\ce{HCl + NaOH -> NaCl + H2O}"></span>.</p></li></ul>
<h2 data-corrido="sim">Óxidos:</h2>
<p>compostos binários formados por qualquer elemento da Tabela Periódica com oxigênio, exceto o flúor e os gases nobres;</p>
<ul><li><p><strong>Iônicos:</strong> oxigênio ligado a um metal;</p>
<ul><li><p><strong>Básicos:</strong> metais das famílias 1A (alcalinos), 2A (alcalino-terrosos) e 1B; <strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{Na2O}"></span>, <span data-type="inline-math" data-latex="\ce{CaO}"></span>;</p></li>
<li><p><strong>Anfóteros:</strong> os demais metais; <strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{Fe2O3}"></span>;</p></li></ul></li>
<li><p><strong>Moleculares ou ácidos:</strong> oxigênio ligado a um ametal; <strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{CO2}"></span>, <span data-type="inline-math" data-latex="\ce{SO3}"></span>;</p>
<ul><li><p><strong>Indiferentes ou neutros:</strong> <span data-type="inline-math" data-latex="\ce{NO}"></span>, <span data-type="inline-math" data-latex="\ce{N2O}"></span> e <span data-type="inline-math" data-latex="\ce{CO}"></span>, exceções entre os moleculares;</p></li></ul></li>
<li><p><strong>Duplos ou mistos:</strong> valor de NOx fracionário; <strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{Fe3O4}"></span>;</p></li>
<li><p><strong>Peróxidos:</strong> valor de NOx do oxigênio igual a −1.</p></li></ul>
<h3 data-corrido="sim">Nomenclatura dos óxidos:</h3>
<p>uma regra para os moleculares e outra para os iônicos;</p>
<ul><li><p><strong>Moleculares ou ácidos:</strong> prefixo + óxido de + ametal;</p>
<ul><li><p>Prefixos: mono (só no oxigênio), di, tri, tetra, penta, hexa e hepta;</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{NO2}"></span> (dióxido de nitrogênio: 2 oxigênios);</p></li></ul></li>
<li><p><strong>Iônicos:</strong> óxido de + metal + NOx;</p>
<ul><li><p>O NOx vai em algarismos romanos, quando o metal tem mais de uma valência; os sufixos OSO e ICO também valem;</p></li>
<li><p><strong>NOx do metal:</strong> <span data-type="inline-math" data-latex="NOx = \frac{2\cdot n_O}{n_\text{elem.} } "></span>;</p>
<ul><li><p><span data-type="inline-math" data-latex="n_O"></span>: número de oxigênios;</p></li>
<li><p><span data-type="inline-math" data-latex="n_\text{elem.} "></span>: número de átomos do elemento.</p></li></ul></li></ul></li></ul>
<ol><li><p>No <span data-type="inline-math" data-latex="\ce{MnO2}"></span>, calcula-se o NOx do manganês: <span data-type="inline-math" data-latex="NOx = \frac{2\cdot 2}{1} = 4"></span>;</p></li>
<li><p>O manganês tem mais de uma valência (+2, +4, +6 ou +7), então o NOx entra no nome;</p></li>
<li><p>Nome: óxido de manganês IV, ou dióxido de manganês.</p></li></ol>
<h2>Comparação entre as funções</h2>
<table><tbody><tr><th><p></p></th><th><p><strong>Ácidos</strong></p></th><th><p><strong>Bases</strong></p></th><th><p><strong>Sais</strong></p></th><th><p><strong>Óxidos</strong></p></th></tr>
<tr><td><p>Composição</p></td><td><p>Hidrogênio ionizável ligado a um elemento ou grupo</p></td><td><p><span data-type="inline-math" data-latex="\ce{OH-}"></span> ligado a metal ou a <span data-type="inline-math" data-latex="\ce{NH4+}"></span></p></td><td><p>Cátion e ânion</p></td><td><p>Elemento e oxigênio (binário)</p></td></tr>
<tr><td><p>Natureza</p></td><td><p>Covalente</p></td><td><p>Iônica</p></td><td><p>—</p></td><td><p>Iônicos (com metal) ou moleculares (com ametal)</p></td></tr>
<tr><td><p>Na água</p></td><td><p>Ionização</p></td><td><p>Dissociação iônica</p></td><td><p>Dissociação iônica</p></td><td><p>—</p></td></tr>
<tr><td><p>Nome</p></td><td><p>-ídrico (hidrácido); tabela do NOx (oxiácido)</p></td><td><p>Hidróxido de + metal ou grupo</p></td><td><p>Ânion + de + cátion</p></td><td><p>Prefixos (moleculares); NOx (iônicos)</p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p><span data-type="inline-math" data-latex="\ce{HCl}"></span> não é oxiácido: não tem oxigênio, é hidrácido (PAS-UEM 2018, 2ª etapa);</p></li>
<li><p><span data-type="inline-math" data-latex="\ce{NaClO}"></span> não é óxido: óxido é binário, e o <span data-type="inline-math" data-latex="\ce{NaClO}"></span> tem três elementos (PAS-UEM 2018, 2ª etapa);</p></li>
<li><p><span data-type="inline-math" data-latex="\ce{OF2}"></span> não é óxido iônico: o flúor não é metal, e o flúor é exceção na definição de óxido (PAS-UEM 2022, 1ª etapa);</p></li>
<li><p>Ácido não sofre dissociação, e sim ionização (<span data-type="inline-math" data-latex="\ce{H3PO3}"></span> e <span data-type="inline-math" data-latex="\ce{H2SO4}"></span> na UEPG-PR 2020; PAS-UEM 2025, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="72a426c0-f5f4-4563-b260-42ff3d371880" data-gabarito="11"><p>(PAS-UEM 2018, 2ª etapa) Com base nos princípios fundamentais de química inorgânica sobre a classificação das substâncias, assinale o que for correto.</p><p>(01) <span data-type="inline-math" data-latex="\ce{NaOH}"></span> é uma base forte.</p><p>(02) <span data-type="inline-math" data-latex="\ce{NaCl}"></span> é um sal amplamente utilizado para temperar alimentos.</p><p>(04) <span data-type="inline-math" data-latex="\ce{HCl}"></span> é um oxiácido fraco.</p><p>(08) <span data-type="inline-math" data-latex="\ce{NH3}"></span> é uma base distinta das demais, pois não possui um metal em sua composição.</p><p>(16) <span data-type="inline-math" data-latex="\ce{NaClO}"></span> é um óxido.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. O sódio é da família 1A, e as bases da família 1A são fortes;</p><p>(02) Correta. O <span data-type="inline-math" data-latex="\ce{NaCl}"></span> é o sal comum;</p><p>(04) Incorreta. O <span data-type="inline-math" data-latex="\ce{HCl}"></span> não tem oxigênio: é hidrácido;</p><p>(08) Correta. As bases têm o <span data-type="inline-math" data-latex="\ce{OH-}"></span> ligado a um metal ou ao grupo amônio; a amônia não possui metal;</p><p>(16) Incorreta. Óxido é composto binário, e o <span data-type="inline-math" data-latex="\ce{NaClO}"></span> tem três elementos;</p><p><strong>Soma: 01 + 02 + 08 = 11</strong></p></div></aside>
<aside class="questao" data-id="60a3fb90-af79-4c2c-832f-2fc434fa0f38" data-gabarito="11"><p>(UEPG-PR 2020) Com relação aos ácidos apresentados, assinale o que for correto.</p><p>(01) <span data-type="inline-math" data-latex="\ce{HCl}"></span> é um monoácido denominado ácido clorídrico.</p><p>(02) <span data-type="inline-math" data-latex="\ce{H2CO3}"></span> é um diácido, onde o ânion divalente é denominado carbonato.</p><p>(04) <span data-type="inline-math" data-latex="\ce{H3PO3}"></span> é um triácido que libera por dissociação o ânion metafosfato (<span data-type="inline-math" data-latex="\ce{PO3^3-}"></span>).</p><p>(08) <span data-type="inline-math" data-latex="\ce{H3BO3}"></span> é um triácido denominado ácido bórico.</p><p>(16) <span data-type="inline-math" data-latex="\ce{H2SO4}"></span> é um monoácido, cuja dissociação total, em meio aquoso, libera íons <span data-type="inline-math" data-latex="\ce{H+}"></span> e <span data-type="inline-math" data-latex="\ce{HSO4-}"></span>.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Tem um hidrogênio ionizável e, como é hidrácido, recebe o sufixo -ídrico;</p><p>(02) Correta. Tem dois hidrogênios ionizáveis, e o ânion divalente é o carbonato (<span data-type="inline-math" data-latex="\ce{CO3^2-}"></span>);</p><p>(04) Incorreta. O <span data-type="inline-math" data-latex="\ce{H3PO3}"></span> é diácido (só 2 hidrogênios ionizáveis), e o processo não é dissociação, e sim ionização;</p><p>(08) Correta. O NOx do boro é 3 (<span data-type="inline-math" data-latex="2\cdot 3-3"></span>), e o boro está na família 3A: recebe o sufixo -ICO;</p><p>(16) Incorreta. Tem dois hidrogênios ionizáveis, e o ácido não sofre dissociação;</p><p><strong>Soma: 01 + 02 + 08 = 11</strong></p></div></aside>
<aside class="questao" data-id="1592c98d-4ed6-42ba-b022-b8becc1da875" data-gabarito="19"><p>(UEPG-PR 2022) Entre as alternativas que trazem reações de dissociação iônica dos hidróxidos de metais, assinale o que for correto.</p><p>(01) <span data-type="inline-math" data-latex="\ce{NaOH(s) -> Na+(aq) + OH-(aq)}"></span></p><p>(02) <span data-type="inline-math" data-latex="\ce{Ca(OH)2(s) -> Ca^2+(aq) + 2OH-(aq)}"></span></p><p>(04) <span data-type="inline-math" data-latex="\ce{Sr(OH)2(s) -> Sr^2+(aq) + OH-(aq)}"></span></p><p>(08) <span data-type="inline-math" data-latex="\ce{Fe(OH)3(s) -> Fe^3+(aq) + 2OH-(aq)}"></span></p><p>(16) <span data-type="inline-math" data-latex="\ce{Al(OH)3(s) -> Al^3+(aq) + 3OH-(aq)}"></span></p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta;</p><p>(02) Correta;</p><p>(04) Incorreta. O <span data-type="inline-math" data-latex="\ce{Sr(OH)2}"></span> tem 2 <span data-type="inline-math" data-latex="\ce{OH-}"></span>, e não um, como está nos produtos;</p><p>(08) Incorreta. O <span data-type="inline-math" data-latex="\ce{Fe(OH)3}"></span> tem 3 <span data-type="inline-math" data-latex="\ce{OH-}"></span>, e não 2, como está nos produtos;</p><p>(16) Correta;</p><p><strong>Soma: 01 + 02 + 16 = 19</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Hidrácido:</h3>
<p>ácido sem oxigênio, de nome elemento + ÍDRICO; Ex: <span data-type="inline-math" data-latex="\ce{HCl}"></span> (ácido clorídrico);</p>
<h3 data-corrido="sim">Oxiácido:</h3>
<p>ácido com oxigênio, de nome dado pelo NOx do elemento central e pela família;</p>
<h3 data-corrido="sim">Hidrogênio ionizável:</h3>
<p>hidrogênio retirado do ácido sob a forma de cátion <span data-type="inline-math" data-latex="\ce{H+}"></span>;</p>
<h3 data-corrido="sim">Grau de ionização:</h3>
<p>percentual de moléculas que ionizam: forte acima de 50%, fraco abaixo de 5%;</p>
<h3 data-corrido="sim">Dissociação iônica:</h3>
<p>separação dos íons da base quando interage com a água;</p>
<h3 data-corrido="sim">Nomenclatura das bases:</h3>
<p>hidróxido de + metal ou grupo; ICO para a maior valência, OSO para a menor;</p>
<h3 data-corrido="sim">Nomenclatura dos sais:</h3>
<p>nome do ânion + de + nome do cátion;</p>
<h3 data-corrido="sim">Óxido:</h3>
<p>composto binário de um elemento com oxigênio, exceto o flúor e os gases nobres.</p>'
)
on conflict (slug) do nothing;

-- 2. Trava: grifo ou resposta nos antigos não tem destino.
do $$
begin
  if exists (select 1 from grifos g join resumos r on r.id = g.resumo_id
              where r.slug in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais'))
     or exists (select 1 from respostas x join resumos r on r.id = x.resumo_id
                 where r.slug in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais')) then
    raise exception 'grifos ou respostas nos fragmentos de funções inorgânicas: decidir antes de apagar';
  end if;
end $$;

-- 3. Redirecionar cada referência para o resumo novo.
with novo as (select id from resumos where slug = 'funcoes-inorganicas'),
     velhos as (select id from resumos where slug in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais'))
update resumos set pai_id = (select id from novo)
 where pai_id in (select id from velhos);

-- Inclui o PASSE 1ª etapa nº 17, hoje em nomenclatura-de-acidos.
with novo as (select id from resumos where slug = 'funcoes-inorganicas'),
     velhos as (select id from resumos where slug in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais'))
update edital_topicos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

with novo as (select id from resumos where slug = 'funcoes-inorganicas'),
     velhos as (select id from resumos where slug in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais'))
update eventos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Histórico e favorito do aluno: uma linha por aluno no resumo novo, com a
-- visita mais recente e a estrela se ele tinha estrela em qualquer dos sete.
insert into leituras (user_id, resumo_id, visto_em, favorito, favoritado_em)
select l.user_id,
       (select id from resumos where slug = 'funcoes-inorganicas'),
       max(l.visto_em), bool_or(l.favorito), max(l.favoritado_em)
  from leituras l
  join resumos r on r.id = l.resumo_id
 where r.slug in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais')
 group by l.user_id
on conflict (user_id, resumo_id) do update
   set visto_em = greatest(leituras.visto_em, excluded.visto_em),
       favorito = leituras.favorito or excluded.favorito,
       favoritado_em = coalesce(leituras.favoritado_em, excluded.favoritado_em);

-- Wikilinks no corpo de outros resumos. O trigger `sync_conexoes_resumo`
-- refaz as conexões desses resumos no próprio update.
update resumos
   set corpo = regexp_replace(corpo, '\[\[(Estudo dos Ácidos e classificação|Nomenclatura de Ácidos|Estudo das Bases|Nomenclatura das Bases|Óxidos|Formulação de Sais|Nomenclatura de Sais)\]\]',
                              '[[Funções inorgânicas: ácidos, bases, sais e óxidos]]', 'g')
 where corpo ~ '\[\[(Estudo dos Ácidos e classificação|Nomenclatura de Ácidos|Estudo das Bases|Nomenclatura das Bases|Óxidos|Formulação de Sais|Nomenclatura de Sais)\]\]'
   and slug not in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais');

-- 4. Só então apagar os sete. `conexoes` e `leituras` restantes saem em cascata.
delete from resumos where slug in ('estudo-dos-acidos-e-classificacao', 'nomenclatura-de-acidos',
                     'estudo-das-bases', 'nomenclatura-das-bases', 'oxidos',
                     'formulacao-de-sais', 'nomenclatura-de-sais');

-- 5. Edital: os tópicos que este resumo cobre inteiros.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.materia_slug = 'quimica'
   and e.texto in ('Funções inorgânicas.',
                   'Características dos ácidos, das bases, dos sais e dos óxidos.')
   and e.resumo_id is null
   and r.slug = 'funcoes-inorganicas';

-- 6. Refaz as conexões do resumo novo com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'funcoes-inorganicas';

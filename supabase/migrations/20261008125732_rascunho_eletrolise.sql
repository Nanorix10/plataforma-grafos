-- Eletrólise: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Lacuna conferida no banco em 08/10/2026: nenhum resumo trata de eletrólise
-- nem de eletroquímica, e o edital do PAS UEM, etapa 3, cobra "Noções sobre
-- eletrólise.". Processo `comum`: o caderno é material de prova de escola
-- (PR2G1), cujo destino combinado é `comum` (decisão 1c). Sem pai: não há
-- resumo de eletroquímica ou de oxirredução no acervo.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2026/Resumos 2°bi 2° ano/Resumo para PR2G1.docx`, seção
--    QUÍMICA A, §00032–00047 do extrator, com cinco figuras. Os outros dois
--    documentos não têm texto: `Resumo para Simulado Harmonia_ 2º dia.docx`
--    (mesmo bimestre, §00016) traz só o título, e `Resumo para Simulado
--    Poliedro.docx` (§00150–00155) traz só a lista de conteúdos.
-- 2. Edital: PAS UEM, etapa 3, "Noções sobre eletrólise.".
-- 3. Provas: PAS-UEM 2018, etapa 3, questão 36 (gabarito 21), em
--    Documents/UEM-Provas/pdfs/pas18/E3G1_QUI.pdf, p. 2 — questão e pegadinhas.
--
-- ## O que difere do caderno
-- - Decisão do autor: a figura da eletrólise aquosa do NaCl entra como está.
--   A equação global dela não tem o coeficiente 2 no NaCl, e a semirreação do
--   cátodo escreve "e⁻(aq)"; os dois pontos foram apontados e o autor decidiu
--   manter.
-- - Acréscimos com fonte: "Sofre oxidação" no ânodo e "Sofre redução" no
--   cátodo (caderno, seção de pilhas, §00024 e §00027; PAS-UEM 2018 Q36,
--   itens 04 e 08); os cátions e ânions que competem na aquosa e os rótulos
--   "Ordem de descarga" (das figuras do próprio caderno).
-- - Forma: o emoticon ":-)" saiu; acentos normalizados (eletroquimico,
--   oxiredução, celula eletrolitica, liquido, Ignea).
-- - Figuras de fora, tratadas como forma (decisão do autor): duas capturas de
--   vídeo de um professor (image5, image9) e uma imagem vazia (image8).
--
-- ## Edital
-- Ligado: "Noções sobre eletrólise.". De fora: "Aplicações das pilhas e
-- eletrólise no cotidiano." (o resumo não trata de pilhas nem de aplicações)
-- e "Eletroquímica" (coberto só pela metade).

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
select
  'eletrolise',
  'Eletrólise',
  'quimica',
  'comum',
  'Processo eletroquímico não espontâneo em que a energia elétrica induz uma reação de oxirredução, em meio ígneo ou aquoso.',
  '<p>Processo eletroquímico não espontâneo que usa energia elétrica (ver [[Eletrodinâmica]]) para induzir uma reação de oxirredução;</p>
<ul><li><p><strong>Célula eletrolítica:</strong> onde a eletrólise ocorre;</p></li>
<li><p><strong>Eletrólise ígnea:</strong> composto iônico fundido;</p></li>
<li><p><strong>Eletrólise aquosa:</strong> sal dissolvido em água.</p></li></ul>
<h2 data-corrido="sim">Célula eletrolítica:</h2>
<p>recipiente com dois eletrodos mergulhados em um líquido, ligados aos terminais de uma pilha/bateria;</p>
<ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/celula-eletrolitica.webp" alt="Célula eletrolítica: gerador ligado a dois eletrodos inertes mergulhados no líquido, com o cátodo no polo negativo, o ânodo no polo positivo e os elétrons saindo do ânodo em direção ao cátodo pelo fio." style="width:50%" data-largura="50%"></figure></li>
<li><p><strong>Ânodo:</strong> polo positivo;</p>
<ul><li><p>Sofre oxidação;</p></li></ul></li>
<li><p><strong>Cátodo:</strong> polo negativo;</p>
<ul><li><p>Sofre redução.</p></li></ul></li></ul>
<h2 data-corrido="sim">Eletrólise ígnea:</h2>
<p>a corrente elétrica passa por um composto iônico fundido para realizar a reação;</p>
<ul><li><p><strong>Fundamento:</strong> por estar fundido, o composto iônico tem seus íons livres (ver [[Ligação iônica]]);</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{NaCl}"></span>;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/eletrolise-ignea-nacl.webp" alt="Eletrólise ígnea do cloreto de sódio: fusão 2 NaCl(s) → 2 Na⁺(l) + 2 Cl⁻(l); semirreação do ânodo 2 Cl⁻(l) → Cl₂(g) + 2 e⁻; semirreação do cátodo 2 Na⁺(l) + 2 e⁻ → 2 Na(s); equação global 2 NaCl(s) → 2 Na(s) + Cl₂(g)." style="width:100%" data-largura="100%"></figure></li></ul>
<h2 data-corrido="sim">Eletrólise aquosa:</h2>
<p>o sal reagente é dissolvido em água;</p>
<ul><li><p>Existem duas espécies com carga elétrica positiva e outras duas espécies com carga negativa, que irão competir pela prioridade da descarga no eletrodo;</p>
<ul><li><p><strong>Cátions:</strong> o do sal e o <span data-type="inline-math" data-latex="\ce{H+}"></span> da ionização da água;</p></li>
<li><p><strong>Ânions:</strong> o do sal e o <span data-type="inline-math" data-latex="\ce{OH-}"></span> da ionização da água;</p></li>
<li><p><strong>Ordem de descarga no cátodo:</strong></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/ordem-de-descarga-catodo.webp" alt="Facilidade de reagir na eletrólise, no cátodo: grupo 1, grupo 2 e alumínio, menor que H⁺, menor que os demais cátions." style="width:100%" data-largura="100%"></figure></li>
<li><p><strong>Ordem de descarga no ânodo:</strong></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/ordem-de-descarga-anodo.webp" alt="Facilidade de reagir na eletrólise, no ânodo: ânions oxigenados e flúor, menor que OH⁻, menor que os demais ânions." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="\ce{NaCl}"></span>.</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/eletrolise-aquosa-nacl.webp" alt="Eletrólise aquosa do cloreto de sódio: dissociação do sal, ionização da água, semirreação no cátodo com formação de H₂(g), semirreação no ânodo com formação de Cl₂(g) e a equação global, como no caderno." style="width:100%" data-largura="100%"></figure></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>a semirreação de oxidação ocorre no ânodo, e não no cátodo (PAS-UEM 2018, 3ª etapa);</p></li>
<li><p>a separação do composto iônico fundido em íons não é uma reação de oxirredução (PAS-UEM 2018, 3ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="17b0bc4f-f982-4f6c-b07a-d62836b08f9d" data-gabarito="21"><p>(PAS-UEM 2018, 3ª etapa) A eletrólise do óxido de alumínio pelo processo Hall-Heroult é um processo químico industrial utilizado na obtenção de alumínio metálico. De acordo com as reações químicas e as informações a seguir, assinale o que for correto.</p><p><span data-type="inline-math" data-latex="Q=i\cdot t"></span>; 1 mol de elétrons tem carga de <span data-type="inline-math" data-latex="9{,}6\times 10^{4}\ \text{C}"></span>.</p><p>(I) <span data-type="inline-math" data-latex="\ce{2 Al2O3 -&gt; 4 Al^3+ + 6 O^2-}"></span></p><p>(II) <span data-type="inline-math" data-latex="\ce{4 Al^3+ + 12 e- -&gt; 4 Al}"></span></p><p>(III) <span data-type="inline-math" data-latex="\ce{6 O^2- -&gt; 12 e- + 3 O2}"></span></p><p>(IV) <span data-type="inline-math" data-latex="\ce{3 O2 + 3 C -&gt; 3 CO2}"></span></p><p>(01) A equação global da produção industrial de alumínio é dada por: <span data-type="inline-math" data-latex="\ce{2 Al2O3 + 3 C -&gt; 4 Al + 3 CO2}"></span>.</p><p>(02) A reação (I) é um processo de oxirredução.</p><p>(04) A reação (II) caracteriza a redução do alumínio.</p><p>(08) A reação (III) ocorre no cátodo.</p><p>(16) Nesse processo, uma corrente de 10 A atravessando uma cuba eletrolítica por 30 minutos gera aproximadamente 1,7 g de alumínio metálico.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Somando (I), (II), (III) e (IV), cancelam-se <span data-type="inline-math" data-latex="\ce{4 Al^3+}"></span>, <span data-type="inline-math" data-latex="\ce{6 O^2-}"></span>, <span data-type="inline-math" data-latex="\ce{12 e-}"></span> e <span data-type="inline-math" data-latex="\ce{3 O2}"></span>, e resta <span data-type="inline-math" data-latex="\ce{2 Al2O3 + 3 C -&gt; 4 Al + 3 CO2}"></span>;</p><p>(02) Incorreta. A reação (I) é a separação do óxido fundido em íons; o alumínio continua com carga +3 e o oxigênio com carga −2, sem transferência de elétrons;</p><p>(04) Correta. O <span data-type="inline-math" data-latex="\ce{Al^3+}"></span> recebe elétrons e forma <span data-type="inline-math" data-latex="\ce{Al}"></span> metálico: redução;</p><p>(08) Incorreta. Na reação (III) o <span data-type="inline-math" data-latex="\ce{O^2-}"></span> perde elétrons: oxidação, que ocorre no ânodo;</p><p>(16) Correta. <span data-type="inline-math" data-latex="Q=10\cdot 1800=18000\ \text{C}"></span>; <span data-type="inline-math" data-latex="n_{e^-}=\frac{18000}{96000}=0{,}1875\ \text{mol}"></span>; pela reação (II), 3 mol de elétrons por mol de alumínio: <span data-type="inline-math" data-latex="n_{\text{Al}}=\frac{0{,}1875}{3}=0{,}0625\ \text{mol}"></span>; com a massa molar do alumínio de 27 g/mol, <span data-type="inline-math" data-latex="m=0{,}0625\cdot 27\approx 1{,}7\ \text{g}"></span>;</p><p><strong>Soma: 01 + 04 + 16 = 21</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Eletrólise:</h3>
<p>processo eletroquímico não espontâneo que usa energia elétrica para induzir uma reação de oxirredução;</p>
<h3 data-corrido="sim">Ânodo da célula eletrolítica:</h3>
<p>polo positivo, onde ocorre a oxidação;</p>
<h3 data-corrido="sim">Cátodo da célula eletrolítica:</h3>
<p>polo negativo, onde ocorre a redução;</p>
<h3 data-corrido="sim">Eletrólise ígnea:</h3>
<p>a corrente elétrica passa por um composto iônico fundido, com os íons livres;</p>
<h3 data-corrido="sim">Eletrólise aquosa:</h3>
<p>o sal é dissolvido em água, e os íons do sal competem com o H⁺ e o OH⁻ da água pela descarga;</p>
<h3 data-corrido="sim">Descarga no cátodo, em meio aquoso:</h3>
<p>grupo 1, grupo 2 e alumínio &lt; H⁺ &lt; demais cátions;</p>
<h3 data-corrido="sim">Descarga no ânodo, em meio aquoso:</h3>
<p>ânions oxigenados e flúor &lt; OH⁻ &lt; demais ânions.</p>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 3
   and e.texto = 'Noções sobre eletrólise.'
   and e.resumo_id is null
   and r.slug = 'eletrolise';

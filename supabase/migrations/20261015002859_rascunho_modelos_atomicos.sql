-- Modelos atômicos: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Pedido do autor em 14/10/2026: reescrever no modelo o resumo que já existe
-- (slug modelos-atomicos, Química, processo pas-uem, sem pai). UPDATE no mesmo
-- slug: id, ligações ao edital e os data-id das duas questões ficam.
--
-- ## Fontes, e só elas
-- 1. Caderno: pro site/Resumos vestibulares/Resumo para PAS UEM 1°etapa.docx,
--    seção QUÍMICA, §00556–00580 do extrator (figuras image85, image51,
--    image41, image33).
-- 2. Edital: PAS UEM etapa 1, "Estrutura atômica e Modelos atômicos."; PASSE
--    etapa 1, "Introdução ao estudo da Química e evolução dos modelos
--    atômicos;" (os dois já ligados).
-- 3. Provas: PAS-UEM 2017, etapa 1, Q19 (13), pdfs/pas17/E1G1.pdf p. 10;
--    PAS-UEM 2025, etapa 1, Q39 (14), pdfs/pas25/E1.pdf p. 19;
--    PAS-UEM 2015, etapa 1, Q20 (Física), pdfs/pas15/E1G1CG.pdf, só para a
--    órbita circular mantida pela força elétrica.
--
-- ## O que difere do caderno (decisões do autor, 14/10/2026)
-- - Thomson: "distribuídas ao redor do núcleo positivo" → distribuídas por uma
--   esfera de carga positiva; Obs: não há núcleo no modelo de Thomson.
-- - Rutherford, núcleo: "concentrar prótons e nêutrons" → concentra a carga
--   positiva e quase toda a massa; Obs: prótons nomeados depois, nêutrons por
--   Chadwick em 1932.
-- - Acréscimos das provas: o espalhamento de partículas α (PAS 2017, item 04)
--   e o espectro discreto da lâmpada de sódio (PAS 2017, item 08).
-- - Tabela comparativa dos quatro modelos, só com o que o corpo já diz.
-- - Títulos sem "1."–"4.": a página numera o Grafo 1 sozinha (decisão 24).
--
-- ## Edital
-- Nenhum tópico novo. "Átomo como unidade fundamental da matéria e a sua
-- estrutura atômica;" (PASSE e1) fica coberto pela metade.

update resumos
   set definicao = 'Teorias que explicam a composição da matéria: os modelos de Dalton, Thomson, Rutherford e Rutherford-Bohr e o que cada um propôs.',
       corpo = '<p>Teorias criadas para explicar a composição e o funcionamento da matéria;</p>
<ul><li><p><strong>Contexto:</strong> no século V a.C., na Grécia Antiga, os filósofos Leucipo e Demócrito propuseram a existência de partículas pequenas, indivisíveis e indestrutíveis como unidade constituinte da matéria;</p></li>
<li><p><strong>Modelo de Dalton:</strong> esfera maciça e indivisível (“bola de bilhar”);</p></li>
<li><p><strong>Modelo de Thomson:</strong> esfera positiva com elétrons distribuídos (“pudim de passas”);</p></li>
<li><p><strong>Modelo de Rutherford:</strong> núcleo e eletrosfera (“sistema planetário”);</p></li>
<li><p><strong>Modelo de Rutherford-Bohr:</strong> eletrosfera formada por camadas de energia.</p></li></ul>
<h2 data-corrido="sim">Modelo de Dalton:</h2>
<p>modelo da “bola de bilhar”;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/modelo-de-dalton.webp" alt="Átomos de hidrogênio, flúor, oxigênio, nitrogênio, carbono, cloro, enxofre e fósforo representados como esferas maciças de cores e tamanhos diferentes." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Primeira teoria proposta para tentar explicar a construção da matéria;</p></li>
<li><p>O átomo é uma <strong>esfera maciça</strong>, <strong>homogênea</strong>, <strong>indivisível</strong> e <strong>indestrutível</strong>;</p></li>
<li><p>Um elemento químico é definido pelo peso do seu átomo;</p></li>
<li><p>Uma reação química ocorre mediante a simples reorganização dos átomos, os quais mantêm a sua identidade.</p></li></ul>
<h2 data-corrido="sim">Modelo de Thomson:</h2>
<p>modelo do “pudim de passas”;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/modelo-de-thomson.webp" alt="Esfera de carga positiva, sem núcleo, com elétrons espalhados por toda ela." style="width:50%" data-largura="50%"></figure>
<ul><li><p>O átomo possui <strong>natureza elétrica</strong>, é <strong>divisível</strong> e <strong>formado por partículas subatômicas</strong>;</p></li>
<li><p>É <strong>eletricamente neutro</strong>, possuindo a mesma quantidade de partículas negativas e positivas;</p></li>
<li><p>As cargas elétricas negativas (elétrons) estão uniformemente distribuídas por uma esfera de carga positiva;</p>
<ul><li><p><strong>Fundamento:</strong> repulsão eletrostática entre as cargas negativas (ver [[Eletrostática]]);</p></li></ul></li>
<li><p><strong>Obs:</strong> não há núcleo no modelo de Thomson; o núcleo surge no modelo de Rutherford.</p></li></ul>
<h2 data-corrido="sim">Modelo de Rutherford:</h2>
<p>modelo do sistema planetário;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/modelo-de-rutherford.webp" alt="Núcleo ao centro e elétrons percorrendo órbitas ao redor dele." style="width:70%" data-largura="70%"></figure>
<ul><li><p><strong>Contexto:</strong> experimento de espalhamento de partículas α (ver [[Radioatividade]]) ao atravessarem uma folha fina de ouro, que refutou a ideia de um átomo maciço;</p></li>
<li><p>O átomo é formado por duas principais regiões:</p></li></ul>
<h3 data-corrido="sim">Núcleo:</h3>
<p>região central do átomo;</p>
<ul><li><p>Concentra a carga elétrica positiva e quase toda a massa do átomo em um pequeno volume, por isso apresenta alta massa e alta densidade;</p></li>
<li><p><strong>Obs:</strong> os prótons foram nomeados depois, e os nêutrons (partículas sem carga, descobertas por Chadwick em 1932) completaram o núcleo formado por prótons e nêutrons.</p></li></ul>
<h3 data-corrido="sim">Eletrosfera:</h3>
<p>região em torno do núcleo que abriga os elétrons;</p>
<ul><li><p>Como os elétrons são partículas minúsculas, assume-se que a eletrosfera é formada por extensos espaços vazios, por isso possui baixa densidade.</p></li></ul>
<h2 data-corrido="sim">Modelo de Rutherford-Bohr:</h2>
<p>evolução do modelo de Rutherford;</p>
<ul><li><p>A <strong>eletrosfera é formada por camadas de energia</strong> nas quais se distribuem os elétrons;</p></li>
<li><p>Os elétrons ocupam camadas eletrônicas com <strong>valores pré-definidos de energia</strong>;</p></li>
<li><p><strong>Transição eletrônica:</strong> os elétrons apenas transitam para uma camada de maior energia ao absorver energia de uma fonte externa, situação em que ficam instáveis;</p>
<ul><li><p>Para retomar a estabilidade, os elétrons retornam ao seu nível inicial, liberando a energia absorvida sob a forma de luz ou calor;</p></li></ul></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/transicao-eletronica.webp" alt="O elétron passa da camada E1 para a E2 ao receber a energia E2 − E1 e, ao voltar para E1, libera a mesma energia." style="width:100%" data-largura="100%"></figure>
<ul><li><p><strong>Consequência:</strong> explica o espectro luminoso discreto de um elemento, como o da lâmpada de sódio (PAS-UEM 2017, 1ª etapa).</p></li></ul>
<table><tbody><tr><th><p><strong>Modelo</strong></p></th><th><p><strong>Apelido</strong></p></th><th><p><strong>Átomo</strong></p></th></tr>
<tr><td><p>Dalton</p></td><td><p>bola de bilhar</p></td><td><p>esfera maciça, homogênea, indivisível e indestrutível</p></td></tr>
<tr><td><p>Thomson</p></td><td><p>pudim de passas</p></td><td><p>esfera positiva com elétrons distribuídos; divisível; sem núcleo</p></td></tr>
<tr><td><p>Rutherford</p></td><td><p>sistema planetário</p></td><td><p>núcleo pequeno, positivo e denso; eletrosfera com extensos espaços vazios</p></td></tr>
<tr><td><p>Rutherford-Bohr</p></td><td><p>evolução de Rutherford</p></td><td><p>elétrons em camadas com valores pré-definidos de energia</p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>os raios catódicos de Thomson contrariaram a indivisibilidade do átomo de Dalton, e não a confirmaram (PAS-UEM 2017, 1ª etapa);</p></li>
<li><p>no modelo de Rutherford-Bohr, o elétron é mantido em órbita pela atração elétrica do núcleo, e não pela gravitação (PAS-UEM 2017, 1ª etapa);</p></li>
<li><p>o elétron foi descoberto antes do modelo de Thomson, e não depois (PAS-UEM 2025, 1ª etapa);</p></li>
<li><p>no modelo de Bohr, a luz é emitida quando o elétron retorna a uma camada de menor energia, e não por uma órbita em espiral até o núcleo (PAS-UEM 2025, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="38183170-43d0-5af6-ad0c-d2ddc1795d6e" data-gabarito="13"><p>(PAS-UEM 2017, 1ª etapa) Sobre os modelos atômicos propostos para descrever a estrutura do átomo, assinale o que for correto.</p><p>(01) A teoria atômica proposta por Dalton assume que os átomos são os constituintes fundamentais da matéria, sendo, portanto, indivisíveis.</p><p>(02) Em seus experimentos com raios catódicos, Thomson forneceu evidências experimentais para a teoria atômica de Dalton.</p><p>(04) Observando o experimento de espalhamento de partículas α ao atravessarem uma folha fina de ouro, Rutherford refuta a ideia de um átomo maciço.</p><p>(08) O modelo atômico de Rutherford-Bohr explica o espectro luminoso discreto de uma lâmpada de sódio.</p><p>(16) No modelo atômico de Rutherford-Bohr, os elétrons descrevem uma órbita elíptica em torno do núcleo atômico, tal como em um sistema planetário. Trata-se, portanto, de um modelo compatível com a Lei da Gravitação Universal.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Para Dalton, o átomo é uma esfera maciça, indivisível e indestrutível, unidade constituinte da matéria;</p><p>(02) Incorreta. Os raios catódicos revelaram partículas negativas menores que o átomo, o que contrariou a indivisibilidade proposta por Dalton;</p><p>(04) Correta. O espalhamento mostrou um núcleo pequeno e denso e uma eletrosfera com extensos espaços vazios: o átomo não é maciço;</p><p>(08) Correta. Os elétrons ocupam camadas com valores pré-definidos de energia; ao retornar ao nível inicial, liberam luz com energias definidas, o que produz o espectro discreto;</p><p>(16) Incorreta. O elétron é mantido em órbita pela atração elétrica do núcleo, e não pela gravitação; o modelo não decorre da Lei da Gravitação Universal.</p><p><strong>Soma: 01 + 04 + 08 = 13</strong></p></div></aside>
<aside class="questao" data-id="eec2a855-9c2c-5bad-aea5-89c8e40215ab" data-gabarito="14"><p>(PAS-UEM 2025, 1ª etapa) Sobre a estrutura dos átomos, assinale o que for correto.</p><p>(01) Após Thomson sugerir seu modelo atômico, os cientistas descobriram o elétron.</p><p>(02) O modelo atômico de Dalton se assemelhava ao modelo dos gregos antigos Demócrito e Leucipo.</p><p>(04) O fenômeno da radioatividade mostrou que o átomo era bem mais complexo do que o sugerido pelo modelo de Dalton.</p><p>(08) Rutherford fez um experimento que demonstrou que os átomos deveriam se assemelhar ao Sistema Solar.</p><p>(16) No modelo atômico de Bohr, a emissão de luz ocorre porque os elétrons executam órbitas espirais até caírem no núcleo, liberando energia.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. O modelo de Thomson já parte de um átomo divisível, formado por partículas subatômicas: o elétron foi descoberto antes do modelo;</p><p>(02) Correta. Como Leucipo e Demócrito, Dalton propôs partículas indivisíveis e indestrutíveis como unidade constituinte da matéria;</p><p>(04) Correta. Na radioatividade, o núcleo emite radiações na forma de ondas ou partículas: o átomo tem estrutura interna, e não é uma esfera maciça e indivisível;</p><p>(08) Correta. O espalhamento das partículas α levou ao modelo do sistema planetário, com núcleo central e elétrons ao redor;</p><p>(16) Incorreta. O elétron não cai no núcleo: a luz é emitida quando ele retorna de uma camada de maior energia ao nível inicial.</p><p><strong>Soma: 02 + 04 + 08 = 14</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Modelo de Dalton:</h3>
<p>esfera maciça, homogênea, indivisível e indestrutível (“bola de bilhar”);</p>
<h3 data-corrido="sim">Modelo de Thomson:</h3>
<p>esfera de carga positiva com elétrons distribuídos, sem núcleo (“pudim de passas”);</p>
<h3 data-corrido="sim">Modelo de Rutherford:</h3>
<p>núcleo pequeno, positivo e denso, e eletrosfera com extensos espaços vazios (“sistema planetário”);</p>
<h3 data-corrido="sim">Modelo de Rutherford-Bohr:</h3>
<p>elétrons em camadas com valores pré-definidos de energia;</p>
<h3 data-corrido="sim">Transição eletrônica:</h3>
<p>o elétron absorve energia e sobe de camada; ao retornar ao nível inicial, libera a energia absorvida sob a forma de luz ou calor.</p>'
 where slug = 'modelos-atomicos';

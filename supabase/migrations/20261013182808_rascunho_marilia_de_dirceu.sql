-- Marília de Dirceu (Tomás Antônio Gonzaga): rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- PAS-UEM, 1ª etapa, literatura, tópicos 12 a 17 (Tomás Antônio Gonzaga –
-- Poemas selecionados), sem resumo ligado; conferido no banco em 12/10/2026.
-- O acervo só tinha Gonzaga dentro de `arcadismo`. Resumo novo, filho de
-- `arcadismo` por pai_id (decisão do autor na parada de tópico).
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2025/Resumos 2º bimestre/Resumo para PR2G2.docx`,
--    LITERATURA, §00028–00031 do extrator (as três partes da obra);
--    `Resumos 2025/Resumos 3º bimestre/Resumo para PR2G2.docx`, LITERATURA,
--    §00067–00070 (o autor). O mesmo texto do autor está em
--    `Materias e conteúdos feitos/Literatura.docx` §183–186 e no Simulado
--    Harmonia 2º dia (3º bi) §571–574.
-- 2. Edital: PAS-UEM, 1ª etapa, literatura, ordens 12–17 (títulos dos quatro
--    poemas e a edição utilizada).
-- 3. Provas (gabarito conferido no índice e no PDF):
--    - PAS-UEM 2021, etapa 1, questão 35 (25), pdfs/pas21/E1.pdf, p. 14 — a questão e a pegadinha 4;
--    - PAS-UEM 2015, etapa 1, questão 34 (10), pdfs/pas15/E1G1CG.pdf, p. 16 — pegadinha, item 04;
--    - PAS-UEM 2018, etapa 1, questão 33 (12), pdfs/pas18/E1G1.pdf, p. 14 — pegadinha, item 02;
--    - PAS-UEM 2016, etapa 1, questão 35 (11), pdfs/pas16/E1G1.pdf, p. 14 — pegadinha, item 16;
--    - PAS-UEM 2023, etapa 1, questão 33 (14), pdfs/pas23/E1.pdf, p. 12 — pegadinha, item 16.
--
-- ## O que difere do caderno
-- Sem parada de erro de conteúdo. Acréscimos: a abertura (lista que organiza
-- as partes), a tabela das partes (montada só com o texto do caderno), a
-- seção "Poemas selecionados" (títulos e edição do edital, sem análise), as
-- pegadinhas e a questão (provas), os pares de "Para revisar" (do caderno).
-- Forma: "Marilia" → "Marília"; "A primeira parte de Marília de Dirceu,
-- somos apresentados a Marília e ao pastor Dirceu" → "apresentação de
-- Marília e do pastor Dirceu"; "dedicado a sua amada" → "dedicada à sua
-- amada"; "exilado à África" → "exilado para a África"; parágrafos do caderno
-- partidos em itens rotulados.
--
-- ## Edital
-- Nenhum tópico ligado (decisão do autor). 13–16: o caderno não tem texto
-- sobre os quatro poemas (lacuna registrada no PR); 12: cabeçalho dos poemas,
-- coberto pela metade; 17: só a referência da edição.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, pai_id, corpo)
select
  'marilia-de-dirceu',
  'Marília de Dirceu (Tomás Antônio Gonzaga)',
  'literatura',
  'pas-uem',
  'A obra lírica de Tomás Antônio Gonzaga (Dirceu): as partes antes e depois da prisão e os poemas do edital do PAS-UEM.',
  (select id from resumos where slug = 'arcadismo'),
  '<p>obra lírica de Tomás Antônio Gonzaga, poeta do [[Arcadismo]] brasileiro, dedicada à sua amada Maria Doroteia (Marília);</p>
<ul><li><p><strong>Autor:</strong> Tomás Antônio Gonzaga, pseudônimo pastoril Dirceu;</p></li>
<li><p><strong>Primeira parte:</strong> escrita antes da prisão do autor;</p></li>
<li><p><strong>Segunda e terceira partes:</strong> a segunda, escrita durante a prisão; mudança de tom;</p></li>
<li><p><strong>Poemas selecionados:</strong> as quatro composições do edital do PAS-UEM.</p></li></ul>
<h2 data-corrido="sim">Tomás Antônio Gonzaga:</h2>
<p>um dos principais poetas do Arcadismo brasileiro;</p>
<ul><li><p><strong>Pseudônimo pastoril:</strong> Dirceu;</p></li>
<li><p><strong>Contexto:</strong> participou da Inconfidência Mineira (1789); foi preso e exilado para a África;</p></li>
<li><p><strong>Principais obras:</strong> <em>Marília de Dirceu</em> (maior poesia lírica do Brasil), dedicada à sua amada Maria Doroteia (Marília), e <em>Cartas Chilenas</em> (obra satírica), na qual critica o governo português no Brasil.</p></li></ul>
<h2 data-corrido="sim">Primeira parte:</h2>
<p>apresentação de Marília e do pastor Dirceu, voz lírica do poema, que expressa todo o seu amor pela jovem;</p>
<ul><li><p><strong>Contexto:</strong> escrita antes da prisão do autor;</p></li>
<li><p><strong>Espaço:</strong> ambos são retratados como pastores de ovelhas em um espaço bucólico e idealizado, sem localização geográfica definida;</p></li>
<li><p><strong>Exaltação da amada:</strong> forte preocupação em exaltar a beleza de Marília;</p></li>
<li><p><strong>Dignidade do eu lírico:</strong> afirmar-se digno de Marília, o que se evidencia na valorização de sua posição social nas primeiras liras;</p></li>
<li><p><strong>Planos de futuro:</strong> uma vida simples e feliz no campo ao lado de Marília, com filhos e em harmonia com a natureza;</p>
<ul><li><p>ideal típico do Arcadismo, movimento literário ao qual o autor pertence.</p></li></ul></li></ul>
<h2 data-corrido="sim">Segunda e terceira partes:</h2>
<p>mudança significativa de tom: o eu lírico mostra-se mais solitário, melancólico e pessimista;</p>
<ul><li><p><strong>Contexto:</strong> a segunda parte foi escrita durante o período em que o autor esteve preso;</p></li>
<li><p><strong>Sentimentos:</strong> tristeza, saudade e incerteza substituem o otimismo e os louvores à natureza da primeira parte;</p></li>
<li><p><strong>Consequência:</strong> a idealização amorosa dá lugar à dor da separação, e o ambiente bucólico é substituído pela dureza do cárcere.</p></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>Primeira parte</strong></p></th><th><p><strong>Segunda e terceira partes</strong></p></th></tr>
<tr><td><p>Momento</p></td><td><p>antes da prisão</p></td><td><p>durante a prisão (segunda parte)</p></td></tr>
<tr><td><p>Tom</p></td><td><p>otimismo e louvores à natureza</p></td><td><p>solidão, melancolia e pessimismo</p></td></tr>
<tr><td><p>Amor</p></td><td><p>idealização amorosa e exaltação da beleza de Marília</p></td><td><p>dor da separação</p></td></tr>
<tr><td><p>Espaço</p></td><td><p>ambiente bucólico</p></td><td><p>dureza do cárcere</p></td></tr></tbody></table>
<h2 data-corrido="sim">Poemas selecionados:</h2>
<p>composições de <em>Marília de Dirceu</em> indicadas no edital do PAS-UEM;</p>
<ul><li><p>“Eu, Marília, não sou algum vaqueiro” (lira I, parte I);</p></li>
<li><p>“Pintam, Marília, os poetas” (lira II, parte I);</p></li>
<li><p>“Eu, Marília, não fui nenhum vaqueiro” (lira XV, parte II);</p></li>
<li><p>“Adeus, cabana, adeus; adeus, ó gado” (soneto XI, parte III);</p></li>
<li><p><strong>Edição utilizada:</strong> GONZAGA, Tomás Antônio. <em>Marília de Dirceu</em>. São Paulo: Martin Claret, 2012.</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p><em>Marília de Dirceu</em> é de Tomás Antônio Gonzaga, não de Silva Alvarenga (PAS-UEM 2015, 1ª etapa);</p></li>
<li><p><em>Marília de Dirceu</em> é de Tomás Antônio Gonzaga, não de Cláudio Manuel da Costa (PAS-UEM 2018, 1ª etapa);</p></li>
<li><p><em>Cartas Chilenas</em> é a obra satírica de Gonzaga; o pseudônimo Dirceu pertence à lírica de <em>Marília de Dirceu</em> (PAS-UEM 2016, 1ª etapa);</p></li>
<li><p><em>Marília de Dirceu</em> pertence ao Arcadismo, não à primeira fase do [[Romantismo]] (PAS-UEM 2021, 1ª etapa);</p></li>
<li><p>o soneto “Mudam-se os tempos, mudam-se as vontades” é de Camões, não uma composição árcade inspirada em <em>Marília de Dirceu</em> (PAS-UEM 2023, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="bb04bf19-9d5b-41f8-b858-0a524d163f77" data-gabarito="25"><p>(PAS-UEM 2021, 1ª etapa) Com base em <em>Marília de Dirceu</em>, de Tomás Antônio Gonzaga, e no fragmento a seguir, assinale o que for correto.</p><p>Lira XXX</p><p>Junto a uma clara fonte / A mãe do Amor se sentou; / Encostou a mão no rosto, / No leve sono pegou.</p><p>Cupido que a viu de longe, / Contente ao lugar correu; / Cuidando que era Marília, / Na face um beijo lhe deu.</p><p>Acorda Vênus irada: / Amor a conhece; e então, / Da ousadia que teve / Assim lhe pede o perdão:</p><p>── Foi fácil, ó mãe formosa, / Foi fácil o engano meu; / Que o semblante de Marília / É todo o semblante teu.</p><p>GONZAGA, T. A. <em>Marília de Dirceu</em>. 2 ed. São Paulo: Martin Claret, 2012. p. 76.</p><p>(01) A presença de deuses mitológicos é constante na literatura neoclássica ou árcade, como se pode constatar na lira XXX pela presença de Cupido, deus do amor, e de Vênus, deusa da beleza.</p><p>(02) <em>Marília de Dirceu</em>, por seu espírito reformista e forte apelo religioso, constitui uma obra representativa das mais autênticas da primeira fase do Romantismo brasileiro, especialmente pela exaltação da paisagem intocada, da sacralidade na poesia e das desordens no campo do amor.</p><p>(04) Em <em>Marília de Dirceu</em>, o eu lírico dirige-se a Marília e a convida a abandonar o barulho da cidade e a desfrutar da perfeição do cenário bucólico, onde Vênus a espera: “Junto a uma clara fonte /A mãe do Amor se sentou;”.</p><p>(08) Em <em>Marília de Dirceu</em>, o eu lírico, ao descrever a natureza, sugere um espaço agradável e inocente. Há uma retomada de temas dos clássicos gregos e latinos, como o <em>locus amoenus</em> (lugar ameno) e o <em>fugere urbem</em> (fugir da cidade).</p><p>(16) Na lira transcrita, quando Cupido equipara a beleza de Marília àquela da deusa Vênus, a amada de Dirceu é elevada ao patamar de divindade.</p><div class="resolucao"><p>(01) Correta. O Arcadismo, ou Neoclassicismo, resgata as referências mitológicas; na lira, Cupido e Vênus;</p><p>(02) Incorreta. A obra pertence ao Arcadismo, movimento do século XVIII, e não ao Romantismo;</p><p>(04) Incorreta. A lira não traz convite a abandonar a cidade: narra o engano de Cupido, que beija Vênus cuidando que era Marília;</p><p>(08) Correta. O <em>locus amoenus</em> e o <em>fugere urbem</em> são características árcades, de inspiração clássica, presentes na obra;</p><p>(16) Correta. Cupido confunde Vênus com Marília, porque o semblante de uma é todo o semblante da outra: a beleza da amada é exaltada até o patamar da deusa.</p><p><strong>Soma: 01 + 08 + 16 = 25</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Pseudônimo pastoril de Gonzaga:</h3>
<p>Dirceu;</p>
<h3 data-corrido="sim">Marília:</h3>
<p>a amada Maria Doroteia, a quem a obra é dedicada;</p>
<h3 data-corrido="sim">Primeira parte:</h3>
<p>escrita antes da prisão; exaltação da beleza de Marília e espaço bucólico idealizado;</p>
<h3 data-corrido="sim">Segunda parte:</h3>
<p>escrita durante a prisão; tom solitário, melancólico e pessimista;</p>
<h3 data-corrido="sim">Espaço da segunda e da terceira partes:</h3>
<p>a dureza do cárcere substitui o ambiente bucólico;</p>
<h3 data-corrido="sim">Obra satírica de Gonzaga:</h3>
<p><em>Cartas Chilenas</em>, crítica ao governo português no Brasil.</p>'
on conflict (slug) do nothing;

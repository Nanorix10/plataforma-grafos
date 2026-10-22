-- Soluções: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- **Só acrescenta.** Novo resumo-pai; Dispersões e Concentração passam a
-- filhos dele por pai_id (só onde pai_id é nulo), sem tocar no corpo.
-- Nenhum delete, nenhum edital_topicos.resumo_id já preenchido é trocado.
--
-- ## Por que este tópico
-- Conferido no banco em 22/10/2026: PAS-UEM 2ª etapa, química, nº 1
-- ("Soluções.") sem resumo. Os nº 2 (Dispersões), 3 e 4 (Concentração) já
-- estão ligados e não são tocados.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos vestibulares/Resumo para PAS UEM 2° etapa.docx`,
--    QUÍMICA, §00003–00028 do extrator (soluto, solvente, tabela das
--    dispersões, tipos de soluções, Cs, gases); `Materias e conteúdos
--    feitos/Quimica.docx`, §00310 e §00317–00318 (interações semelhantes;
--    polar dissolve polar). Cópias: Quimica.docx §148–192; `Resumos 2025/
--    Resumos 4° bimestre/Resumo para PR1G2.docx`, QUÍMICA A, §108–152;
--    `Resumo para PAS UEM 1°etapa.docx` §716–717. Sem figuras.
-- 2. Edital: PAS-UEM 2ª etapa, química, nº 1.
-- 3. Provas: PAS-UEM 2019, etapa 2, questão 22 (gabarito 23), em
--    Documents/UEM-Provas/pdfs/pas19/E2G1.pdf, p. 10: questão e pegadinha.
--
-- ## O que difere do caderno
-- - Abertura montada da linha "Soluções" da tabela das dispersões.
-- - Resolução do item 16 da questão (pressão) apoiada só no gabarito
--   oficial: o caderno não trata de pressão.
--
-- ## Edital
-- Ligado: PAS-UEM 2ª etapa nº 1, coberto pelo pai com os dois filhos.
-- Fora, sem texto no caderno: nº 5 (concentrações no cotidiano), nº 6
-- (impactos; o caderno só tem o título), nº 8 (diluição e mistura).
-- Fora, pela metade: nº 7 (solubilidade sim; processos de dissolução não).

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
select
  'solucoes',
  'Soluções',
  'quimica',
  'pas-uem',
  'Dispersões com partículas menores que 1 nm: soluto e solvente, tipos de soluções, solubilidade e concentração.',
  '<p>dispersões cujas partículas dispersas são menores que 1 nm: átomos, moléculas e íons, não visíveis a olho nu nem ao microscópio óptico;</p>
<ul><li><p><strong>Composto por:</strong> um soluto (quem é dissolvido) e um solvente (quem dissolve);</p></li>
<li><p><strong>Classificação:</strong> pelo tamanho das partículas dispersas, pelo estado físico e pela presença de íons dispersos;</p></li>
<li><p><strong>Solubilidade:</strong> que soluto o solvente dissolve e em que quantidade máxima;</p></li>
<li><p><strong>Concentração:</strong> a quantidade de soluto/solvente presente na solução.</p></li></ul>
<h2 data-corrido="sim">Solvente:</h2>
<p>quem dissolve;</p>
<ul><li><p>Em soluções aquosas, a água é sempre o solvente.</p></li></ul>
<h2 data-corrido="sim">Soluto:</h2>
<p>quem é dissolvido;</p>
<h2 data-corrido="sim">Tipos de soluções:</h2>
<p>conforme o estado físico da solução;</p>
<ul><li><p><strong>Sólidas:</strong> ouro 18k, bronze, solda eletrônica;</p></li>
<li><p><strong>Líquidas:</strong> soro fisiológico, álcool 70, água potável filtrada, gasolina comum, acetona comum;</p></li>
<li><p><strong>Gasosas:</strong> qualquer mistura gasosa (ver [[Misturas gasosas]]).</p></li></ul>
<h2 data-corrido="sim">Solubilidade:</h2>
<p>substâncias com interações semelhantes são mais solúveis entre si;</p>
<ul><li><p><strong>Fundamento:</strong> as forças de interação molecular interferem diretamente nas propriedades físico-químicas das substâncias (ver [[Forças de interação molecular]]);</p></li>
<li><p>Polar dissolve polar e apolar dissolve apolar;</p></li>
<li><p><strong>Coeficiente de solubilidade (Cs):</strong> quantidade máxima de soluto que se dissolve em uma quantidade padrão de <span data-type="inline-math" data-latex="\ce{H2O}"></span>; ponto de saturação;</p></li>
<li><p><strong>Gases:</strong> têm sua solubilidade diminuída com o aumento de temperatura.</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>a solubilidade do <span data-type="inline-math" data-latex="\ce{O2}"></span> em água não é diretamente proporcional à temperatura: diminui com o aquecimento (PAS-UEM 2019, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="6359c2c2-3b0e-414d-9215-9c1d9df31973" data-gabarito="23"><p>(PAS-UEM 2019, 2ª etapa) Os peixes absorvem o gás oxigênio (<span data-type="inline-math" data-latex="\ce{O2}"></span>) dissolvido na água. Na natureza a quantidade adequada de <span data-type="inline-math" data-latex="\ce{O2}"></span> na água é fornecida pelo próprio ambiente. Entretanto, sabe-se que o aumento de descarte de rejeitos domésticos e industriais (não tratados corretamente e lançados em rios e lagos) causa uma drástica redução do <span data-type="inline-math" data-latex="\ce{O2}"></span> dissolvido nesses corpos d’água, o que pode ocasionar a mortandade de peixes. Com base nas informações do quadro a seguir, assinale o que for correto.</p><table><tbody><tr><th><p><strong>Temperatura (ºC)</strong></p></th><th><p><strong>7</strong></p></th><th><p><strong>10</strong></p></th><th><p><strong>15</strong></p></th><th><p><strong>20</strong></p></th><th><p><strong>25</strong></p></th></tr><tr><td><p>Solubilidade (mg/L), à pressão de 1 atm</p></td><td><p>11,5</p></td><td><p>11,0</p></td><td><p>9,8</p></td><td><p>8,8</p></td><td><p>8,0</p></td></tr></tbody></table><p>(01) Em regiões mais quentes haverá maior probabilidade de mortandade de peixes em casos de poluição aquática severa.</p><p>(02) A quantidade de <span data-type="inline-math" data-latex="\ce{O2}"></span> dissolvido na água a 25ºC é pelo menos 27,3% menor do que a 10ºC.</p><p>(04) A solubilidade do <span data-type="inline-math" data-latex="\ce{O2}"></span> a 20ºC é de <span data-type="inline-math" data-latex="2{,}75\times10^{-4}"></span> mol/L.</p><p>(08) A solubilidade do <span data-type="inline-math" data-latex="\ce{O2}"></span> em água é diretamente proporcional à temperatura.</p><p>(16) Em lagos com condições semelhantes de temperatura, mas posicionados geograficamente em diferentes altitudes (variação de pressão atmosférica), aquele que estiver no nível do mar terá maior concentração de <span data-type="inline-math" data-latex="\ce{O2}"></span> dissolvido.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. A solubilidade dos gases diminui com o aumento de temperatura: em água mais quente há menos <span data-type="inline-math" data-latex="\ce{O2}"></span> dissolvido;</p><p>(02) Correta. De 11,0 mg/L a 10 ºC para 8,0 mg/L a 25 ºC: <span data-type="inline-math" data-latex="\frac{11{,}0-8{,}0}{11{,}0}\approx0{,}273"></span>, ou 27,3%;</p><p>(04) Correta. Com <span data-type="inline-math" data-latex="\ce{O2}=32\ \text{g/mol}"></span>, <span data-type="inline-math" data-latex="M=\frac{8{,}8\times10^{-3}\ \text{g}}{32\ \text{g/mol}\cdot1\ \text{L}}=2{,}75\times10^{-4}\ \text{mol/L}"></span>;</p><p>(08) Incorreta. A solubilidade do <span data-type="inline-math" data-latex="\ce{O2}"></span> diminui com o aumento de temperatura: 11,5 mg/L a 7 ºC e 8,0 mg/L a 25 ºC;</p><p>(16) Correta. No nível do mar a pressão atmosférica é maior, e com ela a quantidade de <span data-type="inline-math" data-latex="\ce{O2}"></span> dissolvido.</p><p><strong>Soma: 01 + 02 + 04 + 16 = 23</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Solução:</h3>
<p>dispersão com partículas menores que 1 nm: átomos, moléculas e íons;</p>
<h3 data-corrido="sim">Solvente:</h3>
<p>quem dissolve; em soluções aquosas, a água;</p>
<h3 data-corrido="sim">Soluto:</h3>
<p>quem é dissolvido;</p>
<h3 data-corrido="sim">Solubilidade:</h3>
<p>substâncias com interações semelhantes são mais solúveis entre si;</p>
<h3 data-corrido="sim">Solubilidade dos gases:</h3>
<p>diminui com o aumento de temperatura.</p>'
on conflict (slug) do nothing;

update resumos
   set pai_id = (select id from resumos where slug = 'solucoes')
 where slug in ('dispersoes', 'concentracao')
   and pai_id is null;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 2
   and e.materia_slug = 'quimica'
   and e.texto = 'Soluções.'
   and e.resumo_id is null
   and r.slug = 'solucoes';

-- Refaz as conexões (trigger sync_conexoes_resumo) com todos já no banco.
update resumos set corpo = corpo where slug = 'solucoes';

-- Medidas de dispersão: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Pedido do autor em 14/10/2026: reescrever no modelo o resumo que já existe
-- (slug medidas-de-dispersao, pai Estatística, processo comum). O resumo antigo
-- era o transporte do caderno: sem abertura, sem questão, sem Para revisar, sem
-- wikilinks, com o Ex: do desvio-padrão vazio e x_2 no lugar de x_1. Por isso
-- esta migration é um UPDATE no mesmo slug (o id, o pai e as conexões ficam),
-- e não o INSERT do molde.
--
-- ## Fontes, e só elas
-- 1. Caderno: pro site/Resumos vestibulares/Resumo para PAS UEM 1°etapa.docx,
--    seção MATEMÁTICA, §00129–00144 do extrator (texto idêntico ao de
--    Resumo para PASSE 2° etapa 2026.docx, §00193–00208). Conferido também com
--    Resumos 2025/Resumos 3º bimestre/Resumo para Simulado Harmonia_ 2º dia.docx,
--    MATEMÁTICA C, §00110–00125.
-- 2. Edital: PAS UEM etapa 1, "Noções de Estatística: …"; PASSE etapa 2,
--    "Estatística: pesquisa e organização de dados, …".
-- 3. Provas: PAS-UEM 2025, etapa 1, questão 32 (gabarito 03), em
--    Documents/UEM-Provas/pdfs/pas25/E1.pdf, p. 17.
--
-- ## O que difere do caderno
-- Decisões do autor na parada de conteúdo (14/10/2026):
-- - desvio-padrão: (x_2 - x̄)² no primeiro termo → (x_1 - x̄)², como no
--   caderno Harmonia e na fórmula da variância;
-- - variância do exemplo: 28/6 ≈ 4,6 → 28/6 ≈ 4,67.
-- Normalização de forma: o "Simplificando: Ache… Subtraia… Deixe…" virou
-- "Procedimento:" em passos impessoais; "COLOCAR EM ROL!" virou Obs:.
-- Acréscimos: a lista da abertura (definição de cada medida a partir das
-- fórmulas do caderno), a resolução da questão e a pegadinha (item 16 da
-- PAS-UEM 2025, 1ª etapa).
--
-- ## Edital
-- Nenhum tópico ligado. O do PAS UEM etapa 1 junta tendência central e
-- dispersão e já aponta para Medidas de tendência central; o do PASSE etapa 2
-- cobre ainda pesquisa, gráficos e medidas de posição. Os dois ficam cobertos
-- pela metade por este resumo.

update resumos
   set definicao = 'Parâmetros que indicam o quanto os dados se afastam de um valor central: amplitude, desvio médio, variância e desvio-padrão.',
       corpo = '<p>Parâmetros estatísticos que indicam o grau de variabilidade ou afastamento dos dados em relação a um valor central (como a média);</p>
<ul><li><p><strong>Amplitude:</strong> diferença entre o último termo e o termo inicial do rol;</p></li>
<li><p><strong>Desvio médio:</strong> soma dos afastamentos de cada termo em relação à média, em módulo, dividida pelo número de termos;</p></li>
<li><p><strong>Variância:</strong> soma dos quadrados desses afastamentos, dividida pelo número de termos;</p></li>
<li><p><strong>Desvio-padrão:</strong> raiz quadrada da variância;</p></li>
<li><p>Desvio médio, variância e desvio-padrão partem da média aritmética <span data-type="inline-math" data-latex="\overline{x}"></span> (ver [[Medidas de tendência central]]), conteúdo de [[Estatística]].</p></li></ul>
<h2 data-corrido="sim">Amplitude (Amp):</h2>
<p>último termo menos o termo inicial;</p>
<div data-type="block-math" data-latex="Amp=\text{último termo}-\text{termo inicial}"></div>
<ul><li><p><strong>Obs:</strong> os dados têm de estar em rol (ordem crescente) antes do cálculo;</p></li>
<li><p><strong>Ex:</strong> amostra <span data-type="inline-math" data-latex="\{7,9,5,3,4,8\}"></span> → rol <span data-type="inline-math" data-latex="\{3,4,5,7,8,9\}"></span>;</p>
<ul><li><p><span data-type="inline-math" data-latex="Amp=9-3=6"></span>.</p></li></ul></li></ul>
<h2 data-corrido="sim">Desvio médio (d):</h2>
<p>média aritmética dos afastamentos, em módulo, de cada termo em relação à média;</p>
<div data-type="block-math" data-latex="d=\frac{|x_1-\overline{x}|+|x_2-\overline{x}|+\dots+|x_n-\overline{x}|}{n}"></div>
<ul><li><p><span data-type="inline-math" data-latex="x_1,x_2,\dots,x_n"></span>: valores dos dados;</p></li>
<li><p><span data-type="inline-math" data-latex="\overline{x}"></span>: média aritmética;</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span>: número de dados;</p></li>
<li><p><strong>Procedimento:</strong></p>
<ol><li><p>calcular a média aritmética <span data-type="inline-math" data-latex="\overline{x}"></span>;</p></li>
<li><p>subtrair a média de cada termo;</p></li>
<li><p>tomar o módulo de cada resultado (todos positivos);</p></li>
<li><p>somar os resultados e dividir pelo número de termos.</p></li></ol></li></ul>
<p><strong>Ex:</strong> amostra <span data-type="inline-math" data-latex="\{7,9,5,3,4,8\}"></span>;</p>
<ol><li><p>média: <span data-type="inline-math" data-latex="\overline{x}=\frac{7+9+5+3+4+8}{6}=\frac{36}{6}=6"></span>;</p></li>
<li><p>afastamentos em módulo: <span data-type="inline-math" data-latex="|7-6|=1"></span>, <span data-type="inline-math" data-latex="|9-6|=3"></span>, <span data-type="inline-math" data-latex="|5-6|=1"></span>, <span data-type="inline-math" data-latex="|3-6|=3"></span>, <span data-type="inline-math" data-latex="|4-6|=2"></span>, <span data-type="inline-math" data-latex="|8-6|=2"></span>;</p></li>
<li><p>desvio médio: <span data-type="inline-math" data-latex="d=\frac{1+3+1+3+2+2}{6}=\frac{12}{6}=2"></span>.</p></li></ol>
<h2 data-corrido="sim">Variância (Var):</h2>
<p>média aritmética dos quadrados dos afastamentos de cada termo em relação à média;</p>
<div data-type="block-math" data-latex="Var=\frac{(x_1-\overline{x})^2+(x_2-\overline{x})^2+\dots+(x_n-\overline{x})^2}{n}"></div>
<ul><li><p><span data-type="inline-math" data-latex="x_1,x_2,\dots,x_n"></span>: valores dos dados;</p></li>
<li><p><span data-type="inline-math" data-latex="\overline{x}"></span>: média aritmética;</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span>: número de dados.</p></li></ul>
<p><strong>Ex:</strong> amostra <span data-type="inline-math" data-latex="\{7,9,5,3,4,8\}"></span>, com <span data-type="inline-math" data-latex="\overline{x}=6"></span>;</p>
<ol><li><p>afastamentos: <span data-type="inline-math" data-latex="1,\ 3,\ -1,\ -3,\ -2,\ 2"></span>;</p></li>
<li><p>quadrados: <span data-type="inline-math" data-latex="1^2+3^2+(-1)^2+(-3)^2+(-2)^2+2^2=1+9+1+9+4+4=28"></span>;</p></li>
<li><p>variância: <span data-type="inline-math" data-latex="Var=\frac{28}{6}\approx 4{,}67"></span>.</p></li></ol>
<h2 data-corrido="sim">Desvio-padrão (σ):</h2>
<p>raiz quadrada da variância;</p>
<div data-type="block-math" data-latex="\sigma=\sqrt{\frac{(x_1-\overline{x})^2+(x_2-\overline{x})^2+\dots+(x_n-\overline{x})^2}{n}}=\sqrt{Var}"></div>
<ul><li><p><strong>Fundamento:</strong> o radicando é a própria variância, portanto o desvio-padrão se simplifica para <span data-type="inline-math" data-latex="\sqrt{Var}"></span>;</p></li>
<li><p><strong>Ex:</strong> amostra <span data-type="inline-math" data-latex="\{7,9,5,3,4,8\}"></span>, com <span data-type="inline-math" data-latex="Var=\frac{28}{6}"></span>;</p>
<ul><li><p><span data-type="inline-math" data-latex="\sigma=\sqrt{\frac{28}{6}}"></span>;</p></li></ul></li>
<li><p><strong>Obs:</strong> sem raiz exata, a raiz é mantida indicada; com raiz exata, numerador e denominador são extraídos separadamente;</p>
<ul><li><p><span data-type="inline-math" data-latex="\sqrt{\frac{9}{4}}=\frac{\sqrt{9}}{\sqrt{4}}=\frac{3}{2}"></span>.</p></li></ul></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>o desvio-padrão não é sempre maior que a variância: com <span data-type="inline-math" data-latex="Var=\frac{104}{3}\approx 34{,}7"></span>, <span data-type="inline-math" data-latex="\sigma\approx 5{,}9"></span> (PAS-UEM 2025, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="2a8bbcad-6a35-4793-be3c-4546cf37a3ff" data-gabarito="03"><p>(PAS-UEM 2025, 1ª etapa) Um professor registrou, em uma tabela, as notas de uma turma na disciplina de Matemática referentes às três avaliações aplicadas em um trimestre. Com base nessa tabela e sobre os conceitos de média, moda, mediana, variância e desvio padrão, assinale o que for correto.</p><table><tbody><tr><th><p><strong>Alunos</strong></p></th><th><p><strong>Avaliação 1</strong></p></th><th><p><strong>Avaliação 2</strong></p></th><th><p><strong>Avaliação 3</strong></p></th></tr><tr><td><p>Aluno A</p></td><td><p>56</p></td><td><p>66</p></td><td><p>70</p></td></tr><tr><td><p>Aluno B</p></td><td><p>87</p></td><td><p>90</p></td><td><p>93</p></td></tr><tr><td><p>Aluno C</p></td><td><p>64</p></td><td><p>56</p></td><td><p>80</p></td></tr><tr><td><p>Aluno D</p></td><td><p>35</p></td><td><p>56</p></td><td><p>91</p></td></tr><tr><td><p>Aluno E</p></td><td><p>93</p></td><td><p>35</p></td><td><p>56</p></td></tr></tbody></table><p>(01) A variância no conjunto das notas do aluno A é igual a <span data-type="inline-math" data-latex="\dfrac{104}{3}"></span>.</p><p>(02) O desvio padrão no conjunto das notas do aluno A é menor que 6.</p><p>(04) A média aritmética da avaliação 1 é menor que a moda da avaliação 2.</p><p>(08) A mediana da avaliação 3 é 78.</p><p>(16) O desvio padrão de um conjunto de dados é sempre maior que a variância desse mesmo conjunto.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. <span data-type="inline-math" data-latex="\overline{x}=\frac{56+66+70}{3}=64"></span>; <span data-type="inline-math" data-latex="Var=\frac{(-8)^2+2^2+6^2}{3}=\frac{64+4+36}{3}=\frac{104}{3}"></span>;</p><p>(02) Correta. <span data-type="inline-math" data-latex="\sigma=\sqrt{\frac{104}{3}}"></span>; como <span data-type="inline-math" data-latex="\frac{104}{3}&lt;36"></span>, <span data-type="inline-math" data-latex="\sigma&lt;\sqrt{36}=6"></span>;</p><p>(04) Incorreta. Média da avaliação 1: <span data-type="inline-math" data-latex="\frac{56+87+64+35+93}{5}=\frac{335}{5}=67"></span>; moda da avaliação 2: 56; <span data-type="inline-math" data-latex="67&gt;56"></span>;</p><p>(08) Incorreta. Rol da avaliação 3: <span data-type="inline-math" data-latex="\{56,70,80,91,93\}"></span>; a mediana é o termo central, 80;</p><p>(16) Incorreta. <span data-type="inline-math" data-latex="\sigma=\sqrt{Var}"></span>; no aluno A, <span data-type="inline-math" data-latex="\sigma\approx 5{,}9"></span> e <span data-type="inline-math" data-latex="Var\approx 34{,}7"></span>.</p><p><strong>Soma: 01 + 02 = 03</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Medidas de dispersão:</h3>
<p>indicam o grau de afastamento dos dados em relação a um valor central;</p>
<h3 data-corrido="sim">Amplitude (Amp):</h3>
<p>último termo menos o termo inicial, com os dados em rol;</p>
<h3 data-corrido="sim">Desvio médio (d):</h3>
<p><span data-type="inline-math" data-latex="d=\frac{|x_1-\overline{x}|+\dots+|x_n-\overline{x}|}{n}"></span>;</p>
<h3 data-corrido="sim">Variância (Var):</h3>
<p><span data-type="inline-math" data-latex="Var=\frac{(x_1-\overline{x})^2+\dots+(x_n-\overline{x})^2}{n}"></span>;</p>
<h3 data-corrido="sim">Desvio-padrão (σ):</h3>
<p><span data-type="inline-math" data-latex="\sigma=\sqrt{Var}"></span>.</p>'
 where slug = 'medidas-de-dispersao';

-- Terceiro resumo escrito no modelo de `docs/produto/modelo-de-resumo.md`, o
-- primeiro de Matemática: Progressões, rascunhado por Claude e revisado pelo
-- autor. Aprovar o PR é publicar (modelo, §6).
--
-- ## Por que este tópico
--
-- Lacuna conferida no banco em 08/10/2026: nenhum resumo trata de PA ou PG, e
-- o assunto aparece em cinco tópicos de edital (três do PAS UEM, etapa 3; dois
-- do PASSE). Está em mais de um edital: processo `comum` (decisão 1c). Pai:
-- *Álgebra*, ao lado de *Funções*.
--
-- ## Fontes, e só elas
--
-- 1. **Caderno do autor**, `Resumos 2025/Resumos 4° bimestre`, seção
--    `MATEMÁTICA B`: PA em `Resumo para PR1G1.docx` (parágrafos 00025–00032
--    do extrator) e PG em `Resumo para PR2G1.docx` (00036–00066).
-- 2. **Edital**: PAS UEM, etapa 3 — `Progressões.`, `Progressões
--    aritméticas: …` e `Progressões geométricas: …`.
-- 3. **Provas reais**, em `Documents/UEM-Provas/pdfs`:
--    - PAS-UEM 2025, etapa 3, questão 27 (gabarito 18) — questão;
--    - PAS-UEM 2021, etapa 1, questão 24 (gabarito 03) — questão e a
--      associação das progressões às funções afim e exponencial;
--    - PAS-UEM 2024, etapa 3, questão 35 (gabarito 05) — a definição de PA
--      (item 01, correto) e a pegadinha de Fibonacci (item 02);
--    - PAS-UEM 2015, etapa 1, questão 24 (gabarito 05) — "sequência numérica
--      é uma função" (item 01) e a pegadinha da PA de primeiro termo positivo
--      (item 02).
--
-- ## O que difere do caderno
--
-- Três correções de conteúdo, contra a regra 9c, apontadas no PR para o autor
-- decidir:
--
-- - Soma da PA: o caderno traz `(a1 - an)`; o correto é `(a1 + an)`. A própria
--   resolução do item 16 da PAS-UEM 2025 depende da fórmula com `+`.
-- - Soma da PG infinita: o caderno resolve `(2; 4; 8; 16; …)` e chega a `-2`.
--   A fórmula só vale para `-1 < q < 1`; com `q = 2` a soma não é finita. O
--   exemplo do caderno virou `Obs:`, e o exemplo resolvido usa a PG
--   decrescente que o próprio caderno dá na classificação, `(81; 27; 9; 3; 1)`.
-- - Soma finita da PG: acrescentado `q ≠ 1`, condição da fórmula.
--
-- Acréscimos: a definição de PA (o caderno só dá a razão; texto do item 01 da
-- PAS-UEM 2024), a associação às funções (PAS-UEM 2021), a tabela PA × PG
-- (montada só com o que está acima) e o `Ex:` de Malthus, que é frase do
-- caderno de Geografia do autor (`20261007190317`).
--
-- Normalização de forma: "tudo igual" → "todos os termos iguais"; "é como se
-- a gente pegasse o termo central…" → "o produto dos extremos é igual ao
-- quadrado do termo central"; "A multiplicação dos extremos é igual" → "O
-- produto dos extremos é igual ao produto de dois termos equidistantes deles";
-- `Q` → `q`; `N` → `n`; "Entre uma quantidade ímpar" → "Em uma quantidade
-- ímpar".
--
-- ## O edital ganha três tópicos
--
-- Os três do PAS UEM, etapa 3, que o resumo cobre por inteiro (lei de
-- formação, razão, termo geral, somas finita e infinita, associação à função).
-- Os dois do PASSE juntam a progressão a um estudo de função (afim e
-- exponencial) que este resumo não faz; ficam de fora.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, pai_id, corpo)
select
  'progressoes',
  'Progressões',
  'matematica',
  'comum',
  'Sequências numéricas em que cada termo, a partir do segundo, resulta do anterior somado (PA) ou multiplicado (PG) por uma constante, a razão.',
  (select id from resumos where slug = 'algebra'),
  '<p>Sequências numéricas em que cada termo, a partir do segundo, resulta do termo anterior por meio de uma operação com uma constante, a razão;</p>
<ul><li><p><strong>Progressão aritmética (PA):</strong> soma da razão <span data-type="inline-math" data-latex="r"></span>;</p></li>
<li><p><strong>Progressão geométrica (PG):</strong> multiplicação pela razão <span data-type="inline-math" data-latex="q"></span>;</p></li>
<li><p>Toda sequência numérica é uma função de <span data-type="inline-math" data-latex="\mathbb{N}^*"></span> em <span data-type="inline-math" data-latex="\mathbb{R}"></span> (ver [[Funções]]).</p></li></ul>
<h2 data-corrido="sim">Progressão aritmética (PA):</h2>
<p>sequência numérica em que a diferença entre dois termos consecutivos quaisquer é constante;</p>
<ul><li><p><strong>Razão de uma PA:</strong> <span data-type="inline-math" data-latex="r=a_n-a_{n-1}"></span>;</p></li>
<li><p><strong>Termo geral de uma PA:</strong></p>
<div data-type="block-math" data-latex="a_n=a_1+(n-1)\cdot r"></div>
<ul><li><p><span data-type="inline-math" data-latex="a_n"></span>: termo procurado;</p></li>
<li><p><span data-type="inline-math" data-latex="a_1"></span>: termo inicial;</p></li>
<li><p><span data-type="inline-math" data-latex="r"></span>: razão;</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span>: número de termos;</p></li>
<li><p><strong>Obs:</strong> os termos de uma PA são os valores de uma função afim <span data-type="inline-math" data-latex="f(x)=a+(x-1)\cdot r"></span>, com <span data-type="inline-math" data-latex="x\in\mathbb{N}^*"></span> (ver [[Função do 1º grau]]);</p></li></ul></li>
<li><p><strong>Soma dos termos de uma PA:</strong></p>
<div data-type="block-math" data-latex="S_n=\frac{(a_1+a_n)\cdot n}{2}"></div>
<ul><li><p><span data-type="inline-math" data-latex="S_n"></span>: soma dos <span data-type="inline-math" data-latex="n"></span> primeiros termos;</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span>: número de termos;</p></li></ul></li>
<li><p><strong>Propriedade:</strong> em uma quantidade ímpar de termos, a média aritmética entre eles é o termo do meio;</p>
<ul><li><p><span data-type="inline-math" data-latex="(a,b,c)\rightarrow\frac{a+c}{2}=b"></span>.</p></li></ul></li></ul>
<h2 data-corrido="sim">Progressão geométrica (PG):</h2>
<p>sequência numérica na qual cada termo, a partir do segundo, é o resultado da multiplicação do termo anterior por uma constante chamada <span data-type="inline-math" data-latex="q"></span>;</p>
<ul><li><p><strong>Classificação:</strong></p>
<ul><li><p><strong>Crescente:</strong> o termo anterior é menor do que o sucessor; Ex: <span data-type="inline-math" data-latex="(2;\ 4;\ 8;\ 16)"></span>, <span data-type="inline-math" data-latex="q=2"></span>;</p></li>
<li><p><strong>Decrescente:</strong> o termo anterior é maior do que o sucessor; Ex: <span data-type="inline-math" data-latex="(81;\ 27;\ 9;\ 3;\ 1)"></span>, <span data-type="inline-math" data-latex="q=\frac{1}{3}"></span>;</p></li>
<li><p><strong>Constante:</strong> todos os termos iguais; Ex: <span data-type="inline-math" data-latex="(2;\ 2;\ 2;\ 2)"></span>, <span data-type="inline-math" data-latex="q=1"></span>;</p></li>
<li><p><strong>Alternada:</strong> a razão é negativa e os termos alternam entre positivos e negativos; Ex: <span data-type="inline-math" data-latex="(2;\ -4;\ 8;\ -16;\ 32)"></span>, <span data-type="inline-math" data-latex="q=-2"></span>;</p></li></ul></li>
<li><p><strong>Termo geral de uma PG:</strong></p>
<div data-type="block-math" data-latex="a_n=a_1\cdot q^{n-1}"></div>
<ul><li><p><span data-type="inline-math" data-latex="a_n"></span>: termo procurado;</p></li>
<li><p><span data-type="inline-math" data-latex="a_1"></span>: termo inicial;</p></li>
<li><p><span data-type="inline-math" data-latex="q"></span>: razão, um termo dividido pelo termo anterior;</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span>: número de termos;</p></li>
<li><p><strong>Obs:</strong> os termos de uma PG de termo inicial 1 são os valores da função exponencial <span data-type="inline-math" data-latex="g(x)=q^{x-1}"></span>, com <span data-type="inline-math" data-latex="x\in\mathbb{N}^*"></span>;</p></li>
<li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="(2;\ 6;\ 18)"></span>, <span data-type="inline-math" data-latex="a_4=\,?"></span></p>
<ol><li><p><span data-type="inline-math" data-latex="a_1=2"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="q=\frac{6}{2}=\frac{18}{6}=3"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="n=4"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="a_4=2\cdot 3^{4-1}=2\cdot 3^{3}=2\cdot 27=54"></span>.</p></li></ol></li></ul></li>
<li><p><strong>Propriedades de uma PG:</strong></p>
<ul><li><p>O produto dos extremos é igual ao produto de dois termos equidistantes deles;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="(2;\ 4;\ 8;\ 16)\rightarrow 2\cdot 16=4\cdot 8=32"></span>;</p></li></ul></li>
<li><p>Em uma quantidade ímpar de termos, o produto dos extremos é igual ao quadrado do termo central;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="(4;\ 16;\ 64)\rightarrow 4\cdot 64=256"></span> e <span data-type="inline-math" data-latex="\sqrt{256}=16"></span>;</p></li></ul></li></ul></li>
<li><p><strong>Soma dos <span data-type="inline-math" data-latex="n"></span> primeiros termos de uma PG:</strong></p>
<div data-type="block-math" data-latex="S_n=\frac{a_1\cdot(q^n-1)}{q-1},\quad q\neq 1"></div>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="(1;\ 4;\ 16)"></span></p>
<ol><li><p><span data-type="inline-math" data-latex="a_1=1"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="q=\frac{16}{4}=\frac{4}{1}=4"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="n=3"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="S_3=\frac{1\cdot(4^3-1)}{4-1}=\frac{1\cdot(64-1)}{3}=\frac{63}{3}=21"></span>.</p></li></ol></li></ul></li>
<li><p><strong>Soma dos termos de uma PG infinita:</strong></p>
<div data-type="block-math" data-latex="S_\infty=\frac{a_1}{1-q},\quad -1&lt;q&lt;1"></div>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="(81;\ 27;\ 9;\ 3;\ 1;\ \dots)"></span>, <span data-type="inline-math" data-latex="q=\frac{1}{3}"></span> → <span data-type="inline-math" data-latex="S_\infty=\frac{81}{1-\frac{1}{3}}=\frac{81}{\frac{2}{3}}=121{,}5"></span>;</p></li>
<li><p><strong>Obs:</strong> em <span data-type="inline-math" data-latex="(2;\ 4;\ 8;\ 16;\ \dots)"></span>, <span data-type="inline-math" data-latex="q=2"></span>, os termos crescem indefinidamente e a soma infinita não é um número finito.</p></li></ul></li>
<li><p><strong>Ex:</strong> na Teoria Malthusiana, a população cresceria em progressão geométrica, enquanto a produção de alimentos cresceria apenas em progressão aritmética (ver [[Teorias demográficas]]).</p></li></ul>
<h2 data-corrido="sim">Comparação entre PA e PG:</h2>
<table><tbody><tr><th><p></p></th><th><p><strong>PA</strong></p></th><th><p><strong>PG</strong></p></th></tr>
<tr><td><p>Lei de formação</p></td><td><p>termo anterior somado a <span data-type="inline-math" data-latex="r"></span></p></td><td><p>termo anterior multiplicado por <span data-type="inline-math" data-latex="q"></span></p></td></tr>
<tr><td><p>Razão</p></td><td><p><span data-type="inline-math" data-latex="r=a_n-a_{n-1}"></span></p></td><td><p><span data-type="inline-math" data-latex="q=\frac{a_n}{a_{n-1}}"></span></p></td></tr>
<tr><td><p>Termo geral</p></td><td><p><span data-type="inline-math" data-latex="a_n=a_1+(n-1)\cdot r"></span></p></td><td><p><span data-type="inline-math" data-latex="a_n=a_1\cdot q^{n-1}"></span></p></td></tr>
<tr><td><p>Soma finita</p></td><td><p><span data-type="inline-math" data-latex="S_n=\frac{(a_1+a_n)\cdot n}{2}"></span></p></td><td><p><span data-type="inline-math" data-latex="S_n=\frac{a_1\cdot(q^n-1)}{q-1}"></span></p></td></tr>
<tr><td><p>Sequência constante</p></td><td><p><span data-type="inline-math" data-latex="r=0"></span></p></td><td><p><span data-type="inline-math" data-latex="q=1"></span></p></td></tr>
<tr><td><p>Função associada</p></td><td><p>afim</p></td><td><p>exponencial</p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>A sequência constante é uma PA de razão <span data-type="inline-math" data-latex="r=0"></span> (PAS-UEM 2025, 3ª etapa; PAS-UEM 2021, 1ª etapa);</p></li>
<li><p>Uma PA cujo primeiro termo é positivo não é necessariamente crescente: o crescimento depende do sinal de <span data-type="inline-math" data-latex="r"></span> (PAS-UEM 2015, 1ª etapa);</p></li>
<li><p><span data-type="inline-math" data-latex="(-1;\ 1;\ -1;\ 1;\ \dots)"></span> não é uma PA: a diferença entre termos consecutivos não é constante (PAS-UEM 2025, 3ª etapa);</p></li>
<li><p>A sequência de Fibonacci <span data-type="inline-math" data-latex="(1;\ 1;\ 2;\ 3;\ 5;\ 8;\ \dots)"></span> não é uma PG (PAS-UEM 2024, 3ª etapa);</p></li>
<li><p>Para <span data-type="inline-math" data-latex="q=1"></span>, o gráfico de <span data-type="inline-math" data-latex="g(x)=q^{x-1}"></span> está contido em uma reta paralela ao eixo das abscissas, não ao das ordenadas (PAS-UEM 2021, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="c5837014-5933-4afd-a10d-b3b3672b3245" data-gabarito="18"><p>(PAS-UEM 2025, 3ª etapa) Sobre progressões aritméticas (PA), assinale o que for correto.</p><p>(01) O quinto termo de uma PA que tem <span data-type="inline-math" data-latex="a_1=11"></span> e razão <span data-type="inline-math" data-latex="r=3"></span> é 26.</p><p>(02) Em uma PA que tem o termo <span data-type="inline-math" data-latex="a_8=13"></span> e o termo <span data-type="inline-math" data-latex="a_{10}=21"></span> deve-se ter o termo <span data-type="inline-math" data-latex="a_{18}=53"></span>.</p><p>(04) A sequência constante não é uma progressão aritmética.</p><p>(08) A sequência <span data-type="inline-math" data-latex="(-1,1,-1,1,-1,1,-1,\cdots)"></span> é uma progressão aritmética de razão <span data-type="inline-math" data-latex="r=(-1)^n,\ n\geq 1"></span>.</p><p>(16) A soma dos <span data-type="inline-math" data-latex="n"></span> primeiros números ímpares é <span data-type="inline-math" data-latex="n^2"></span>.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. <span data-type="inline-math" data-latex="a_5=11+(5-1)\cdot 3=23"></span>;</p><p>(02) Correta. <span data-type="inline-math" data-latex="a_{10}=a_8+2r\Rightarrow 21=13+2r\Rightarrow r=4"></span>; <span data-type="inline-math" data-latex="a_{18}=a_{10}+8r=21+32=53"></span>;</p><p>(04) Incorreta. A sequência constante é uma PA de razão <span data-type="inline-math" data-latex="r=0"></span>;</p><p>(08) Incorreta. A diferença entre termos consecutivos alterna entre 2 e −2; não é constante;</p><p>(16) Correta. <span data-type="inline-math" data-latex="(1,3,5,\dots)"></span> é uma PA com <span data-type="inline-math" data-latex="a_1=1"></span> e <span data-type="inline-math" data-latex="r=2"></span>; <span data-type="inline-math" data-latex="a_n=2n-1"></span> e <span data-type="inline-math" data-latex="S_n=\frac{(1+2n-1)\cdot n}{2}=n^2"></span>.</p><p><strong>Soma: 02 + 16 = 18</strong></p></div></aside>
<aside class="questao" data-id="1926f9d7-c8d4-407d-8c02-165a02c347ac" data-gabarito="03"><p>(PAS-UEM 2021, 1ª etapa) Considere as funções <span data-type="inline-math" data-latex="f,g:\mathbb{N}^*\rightarrow\mathbb{R}"></span> definidas por <span data-type="inline-math" data-latex="f(x)=a+(x-1)r"></span> e <span data-type="inline-math" data-latex="g(x)=q^{x-1}"></span>, em que <span data-type="inline-math" data-latex="a"></span>, <span data-type="inline-math" data-latex="r"></span> e <span data-type="inline-math" data-latex="q"></span> são números reais constantes, e sejam <span data-type="inline-math" data-latex="(f(x))"></span> e <span data-type="inline-math" data-latex="(g(x))"></span> as sequências definidas pelos valores dessas funções para <span data-type="inline-math" data-latex="x=1,2,3,\dots"></span>. Assinale o que for correto.</p><p>(01) Se <span data-type="inline-math" data-latex="0&lt;q&lt;1"></span>, então a sequência <span data-type="inline-math" data-latex="(g(x))"></span> é uma progressão geométrica decrescente.</p><p>(02) Se <span data-type="inline-math" data-latex="r=0"></span>, então a sequência <span data-type="inline-math" data-latex="(f(x))"></span> é uma progressão aritmética constante para qualquer valor de <span data-type="inline-math" data-latex="a"></span>.</p><p>(04) A função <span data-type="inline-math" data-latex="f"></span> que determina a sequência <span data-type="inline-math" data-latex="(1,-1,-3,-5,-7,\dots)"></span> é uma função afim cujos coeficientes linear e angular são números negativos.</p><p>(08) O gráfico da função <span data-type="inline-math" data-latex="g"></span> que determina a sequência <span data-type="inline-math" data-latex="\left(1,\frac{5}{4},\frac{25}{16},\frac{125}{64},\dots\right)"></span> passa pelo ponto de coordenadas <span data-type="inline-math" data-latex="\left(1,\frac{5}{4}\right)"></span>.</p><p>(16) Para <span data-type="inline-math" data-latex="q=1"></span> o gráfico de <span data-type="inline-math" data-latex="g"></span> está contido em uma reta paralela ao eixo das ordenadas.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. Com <span data-type="inline-math" data-latex="0&lt;q&lt;1"></span>, cada termo é o anterior multiplicado por um número menor que 1;</p><p>(02) Correta. <span data-type="inline-math" data-latex="f(x)=a+(x-1)\cdot 0=a"></span> para todo <span data-type="inline-math" data-latex="x"></span>;</p><p>(04) Incorreta. <span data-type="inline-math" data-latex="a=1"></span> e <span data-type="inline-math" data-latex="r=-2"></span>: <span data-type="inline-math" data-latex="f(x)=1+(x-1)\cdot(-2)=-2x+3"></span>; o coeficiente angular é negativo, mas o linear é positivo;</p><p>(08) Incorreta. <span data-type="inline-math" data-latex="g(1)=q^{0}=1"></span>; o gráfico passa por <span data-type="inline-math" data-latex="(1,1)"></span> e por <span data-type="inline-math" data-latex="\left(2,\frac{5}{4}\right)"></span>, não por <span data-type="inline-math" data-latex="\left(1,\frac{5}{4}\right)"></span>;</p><p>(16) Incorreta. <span data-type="inline-math" data-latex="g(x)=1"></span> para todo <span data-type="inline-math" data-latex="x"></span>; a reta é paralela ao eixo das abscissas.</p><p><strong>Soma: 01 + 02 = 03</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Progressão aritmética (PA):</h3>
<p>diferença constante <span data-type="inline-math" data-latex="r"></span> entre dois termos consecutivos;</p>
<h3 data-corrido="sim">Termo geral de uma PA:</h3>
<p><span data-type="inline-math" data-latex="a_n=a_1+(n-1)\cdot r"></span>;</p>
<h3 data-corrido="sim">Soma dos termos de uma PA:</h3>
<p><span data-type="inline-math" data-latex="S_n=\frac{(a_1+a_n)\cdot n}{2}"></span>;</p>
<h3 data-corrido="sim">Progressão geométrica (PG):</h3>
<p>cada termo é o anterior multiplicado pela razão <span data-type="inline-math" data-latex="q"></span>;</p>
<h3 data-corrido="sim">Termo geral de uma PG:</h3>
<p><span data-type="inline-math" data-latex="a_n=a_1\cdot q^{n-1}"></span>;</p>
<h3 data-corrido="sim">Soma dos n primeiros termos de uma PG:</h3>
<p><span data-type="inline-math" data-latex="S_n=\frac{a_1\cdot(q^n-1)}{q-1}"></span>, com <span data-type="inline-math" data-latex="q\neq 1"></span>;</p>
<h3 data-corrido="sim">Soma dos termos de uma PG infinita:</h3>
<p><span data-type="inline-math" data-latex="S_\infty=\frac{a_1}{1-q}"></span>, só para <span data-type="inline-math" data-latex="-1&lt;q&lt;1"></span>;</p>
<h3 data-corrido="sim">PA e PG constantes:</h3>
<p>PA de razão <span data-type="inline-math" data-latex="r=0"></span>; PG de razão <span data-type="inline-math" data-latex="q=1"></span>.</p>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 3
   and (e.texto = 'Progressões.'
        or e.texto like 'Progressões aritméticas: lei de formação%'
        or e.texto like 'Progressões geométricas: lei de formação%')
   and e.resumo_id is null
   and r.slug = 'progressoes';

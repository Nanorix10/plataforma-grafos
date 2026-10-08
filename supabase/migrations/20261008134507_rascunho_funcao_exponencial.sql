-- Função exponencial: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
--
-- Lacuna conferida no banco em 08/10/2026: nenhum resumo trata da função
-- exponencial (o termo só aparece de passagem em *Progressões* e em
-- *Matemática financeira*), e o assunto está em tópicos do PASSE (etapa 2) e
-- do PAS UEM (etapa 3). Está em mais de um edital: processo `comum` (decisão
-- 1c). Pai: *Álgebra*, ao lado de *Funções* e *Função logarítmica*.
--
-- ## Fontes, e só elas
--
-- 1. Caderno: `Resumos 2025/Resumos 4° bimestre/Resumo para PR2G1.docx`, seção
--    `MATEMÁTICA A`, §00004–00011 do extrator (definição, condição de
--    existência, domínio, imagem, e os exemplos 2^x e (1/2)^x com tabela e
--    gráfico, as duas figuras). O resto da seção (§00012–00034) é logaritmo e
--    fica para *Função logarítmica*. Outros documentos com o assunto:
--    `Resumo para PASSE 2° etapa 2026.docx` (§00154–00155, só o título do
--    tópico) e `Resumo para PR1G1.docx` (`MATEMÁTICA A`, §00004–00023,
--    equação exponencial; fora deste resumo, ver o PR).
-- 2. Edital: PAS UEM, etapa 3, "Funções exponenciais: propriedades, domínio,
--    imagem, crescimento, decrescimento e gráficos…"; PASSE, etapa 2, "Função
--    exponencial: estudo do crescimento…".
-- 3. Provas, em Documents/UEM-Provas/pdfs:
--    - PAS-UEM 2024, etapa 3, questão 31 (gabarito 09), pas24/E3.pdf p. 32 —
--      questão e duas pegadinhas (itens 02 e 04);
--    - PAS-UEM 2025, etapa 3, questão 30 (gabarito 26), pas25/E3.pdf p. 17 —
--      questão;
--    - PAS-UEM 2023, etapa 2, questão 22 (gabarito 29), pas23/E2.pdf p. 10 —
--      exemplo da dipirona e pegadinha do item 02;
--    - PAS-UEM 2016, etapa 1, questão 13 (gabarito 29), pas16/E1G1.pdf p. 8 —
--      exemplo da divisão binária e pegadinha do item 02.
--
-- ## O que difere do caderno
--
-- Nenhuma correção de conteúdo: toda afirmação e todo valor das tabelas do
-- caderno conferem. Acréscimos: "crescente para a > 1, decrescente para
-- 0 < a < 1" (generaliza os dois exemplos do caderno; item 02 da PAS-UEM
-- 2024); f(0) = 1 e o ponto (0, 1) (lido nas duas tabelas do caderno); os
-- passos de cálculo das tabelas; a seção Aplicações (provas acima, e frases já
-- publicadas em *Matemática financeira* e *Progressões*); a equivalência
-- b^x = a ⇔ log_b a = x (caderno, seção de logaritmo).
-- Normalizações de forma: "Note que a linha NUNCA vai encostar no eixo X" →
-- "o gráfico nunca intercepta o eixo x"; "Ex2:" → "Ex:".
--
-- ## Edital
--
-- Ligados: PAS UEM etapa 3 "Funções exponenciais: …" e PASSE etapa 2 "Função
-- exponencial: estudo do crescimento…". Fora: PASSE etapa 2 "Função
-- exponencial e Sequências numéricas: PG" (a PG está em *Progressões*; aqui só
-- a ponte), "Variação entre grandezas: relação entre variação exponencial e
-- logarítmica…" e "Funções como modelagem…" (pedem logaritmo e modelagem que
-- este resumo não faz).

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, pai_id, corpo)
select
  'funcao-exponencial',
  'Função exponencial',
  'matematica',
  'comum',
  'Função f(x) = a^x, com a > 0 e a ≠ 1, de domínio ℝ e imagem ℝ*₊; crescente para a > 1 e decrescente para 0 < a < 1.',
  (select id from resumos where slug = 'algebra'),
  '<p>função definida por <span data-type="inline-math" data-latex="f(x)=a^{x}"></span>, em que a base <span data-type="inline-math" data-latex="a"></span> é um número real positivo e diferente de 1;</p>
<ul><li><p><strong>Condição de existência:</strong> restrição sobre a base;</p></li>
<li><p><strong>Domínio e imagem:</strong> os conjuntos de entrada e de saída (ver [[Funções]]);</p></li>
<li><p><strong>Gráfico:</strong> crescente ou decrescente, conforme a base;</p></li>
<li><p><strong>Aplicações:</strong> modelos de crescimento e de decrescimento cobrados em prova.</p></li></ul>
<h2 data-corrido="sim">Condição de existência:</h2>
<p><span data-type="inline-math" data-latex="a&gt;0"></span> e <span data-type="inline-math" data-latex="a\neq 1"></span>;</p>
<h2 data-corrido="sim">Domínio e imagem:</h2>
<p>o domínio é o conjunto dos números reais, e a imagem, o dos reais positivos;</p>
<ul><li><p><strong>Domínio:</strong> <span data-type="inline-math" data-latex="D=\mathbb{R}"></span>;</p></li>
<li><p><strong>Imagem:</strong> <span data-type="inline-math" data-latex="Im=\mathbb{R}^{*}_{+}\rightarrow Im=\{y\in\mathbb{R}\mid y&gt;0\}"></span>;</p>
<ul><li><p><strong>Consequência:</strong> o gráfico nunca intercepta o eixo <span data-type="inline-math" data-latex="x"></span>;</p></li></ul></li>
<li><p><strong>Obs:</strong> <span data-type="inline-math" data-latex="f(0)=a^{0}=1"></span> para toda base; o gráfico passa pelo ponto <span data-type="inline-math" data-latex="(0,\ 1)"></span>.</p></li></ul>
<h2 data-corrido="sim">Gráfico:</h2>
<p>curva cujo comportamento depende da base <span data-type="inline-math" data-latex="a"></span>;</p>
<h3 data-corrido="sim">Função crescente:</h3>
<p>base <span data-type="inline-math" data-latex="a&gt;1"></span>; quanto maior <span data-type="inline-math" data-latex="x"></span>, maior <span data-type="inline-math" data-latex="f(x)"></span>;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="f(x)=2^{x}"></span></p>
<ol><li><p><span data-type="inline-math" data-latex="f(-2)=2^{-2}=\frac{1}{2^{2}}=\frac{1}{4}"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(-1)=2^{-1}=\frac{1}{2}"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(0)=2^{0}=1"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(1)=2^{1}=2"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(2)=2^{2}=4"></span>.</p></li></ol></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/funcao-exponencial-crescente.webp" alt="Tabela e gráfico de f(x) = 2 elevado a x: para x igual a −2, −1, 0, 1 e 2, y vale 1/4, 1/2, 1, 2 e 4; a curva sobe da esquerda para a direita, corta o eixo y em 1 e se aproxima do eixo x sem tocá-lo." style="width:100%" data-largura="100%"></figure>
<h3 data-corrido="sim">Função decrescente:</h3>
<p>base <span data-type="inline-math" data-latex="0&lt;a&lt;1"></span>; quanto maior <span data-type="inline-math" data-latex="x"></span>, menor <span data-type="inline-math" data-latex="f(x)"></span>;</p>
<ul><li><p><strong>Ex:</strong> <span data-type="inline-math" data-latex="f(x)=\left(\frac{1}{2}\right)^{x}"></span></p>
<ol><li><p><span data-type="inline-math" data-latex="f(-2)=\left(\frac{1}{2}\right)^{-2}=2^{2}=4"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(-1)=\left(\frac{1}{2}\right)^{-1}=2"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(0)=\left(\frac{1}{2}\right)^{0}=1"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(1)=\frac{1}{2}"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="f(2)=\left(\frac{1}{2}\right)^{2}=\frac{1}{4}"></span>.</p></li></ol></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/funcao-exponencial-decrescente.webp" alt="Tabela e gráfico de f(x) = (1/2) elevado a x: para x igual a −2, −1, 0, 1 e 2, y vale 4, 2, 1, 1/2 e 1/4; a curva desce da esquerda para a direita, corta o eixo y em 1 e se aproxima do eixo x sem tocá-lo." style="width:100%" data-largura="100%"></figure>
<h2 data-corrido="sim">Aplicações:</h2>
<p>modelos de crescimento e de decrescimento exponencial cobrados em prova;</p>
<ul><li><p><strong>Ex:</strong> divisão binária de bactérias: após <span data-type="inline-math" data-latex="t"></span> etapas de divisão, <span data-type="inline-math" data-latex="N(t)=2^{t}"></span> células, com <span data-type="inline-math" data-latex="t\in\mathbb{N}^{*}"></span> (PAS-UEM 2016, 1ª etapa);</p></li>
<li><p><strong>Ex:</strong> decaimento da dipirona, com meia-vida de 7 horas: <span data-type="inline-math" data-latex="D_t=D_0\cdot\left(\frac{1}{2}\right)^{\frac{t}{7}}"></span> (PAS-UEM 2023, 2ª etapa);</p>
<ul><li><p><span data-type="inline-math" data-latex="D_0"></span>: concentração inicial (mg);</p></li>
<li><p><span data-type="inline-math" data-latex="t"></span>: tempo (h);</p></li></ul></li>
<li><p><strong>Ex:</strong> juros compostos, <span data-type="inline-math" data-latex="M=C\cdot(1+i)^{t}"></span>: crescimento exponencial (ver [[Matemática financeira]]);</p></li>
<li><p><strong>Obs:</strong> os termos de uma PG de termo inicial 1 e razão <span data-type="inline-math" data-latex="q"></span> são os valores de <span data-type="inline-math" data-latex="g(x)=q^{x-1}"></span>, com <span data-type="inline-math" data-latex="x\in\mathbb{N}^{*}"></span> (ver [[Progressões]]);</p></li>
<li><p><strong>Obs:</strong> <span data-type="inline-math" data-latex="b^{x}=a\Leftrightarrow\log_{b}a=x"></span> (ver [[Função logarítmica]]).</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>A função <span data-type="inline-math" data-latex="f(x)=a^{x}"></span> não é crescente para toda base: com <span data-type="inline-math" data-latex="0&lt;a&lt;1"></span>, ela é decrescente (PAS-UEM 2024, 3ª etapa);</p></li>
<li><p><span data-type="inline-math" data-latex="\left(\frac{1}{10}\right)^{x}\geq\left(\frac{1}{100}\right)^{x}"></span> não vale para todo <span data-type="inline-math" data-latex="x\in\mathbb{R}"></span>: para <span data-type="inline-math" data-latex="x=-1"></span>, os valores são 10 e 100 (PAS-UEM 2024, 3ª etapa);</p></li>
<li><p>No decaimento exponencial a quantidade nunca chega a zero: 35 horas depois de uma dose de 200 mg de dipirona, com meia-vida de 7 horas, restam <span data-type="inline-math" data-latex="200\cdot\left(\frac{1}{2}\right)^{5}=6{,}25"></span> mg (PAS-UEM 2023, 2ª etapa);</p></li>
<li><p>A quantidade de células após <span data-type="inline-math" data-latex="t"></span> etapas de divisão binária é <span data-type="inline-math" data-latex="2^{t}"></span>, e não <span data-type="inline-math" data-latex="2t"></span> (PAS-UEM 2016, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="063562db-d6f1-4273-a288-c67e249f5bba" data-gabarito="09"><p>(PAS-UEM 2024, 3ª etapa) Com relação às funções logarítmicas e exponenciais, assinale o que for correto.</p><p>(01) Para qualquer que seja <span data-type="inline-math" data-latex="a&gt;0"></span> com <span data-type="inline-math" data-latex="a\neq 1"></span>, a função logarítmica <span data-type="inline-math" data-latex="\log_{a}(x)"></span> sempre terá uma única raiz em <span data-type="inline-math" data-latex="x=1"></span>.</p><p>(02) Para qualquer que seja <span data-type="inline-math" data-latex="a&gt;0"></span> com <span data-type="inline-math" data-latex="a\neq 1"></span>, a função exponencial <span data-type="inline-math" data-latex="f(x)=a^{x}"></span> será crescente.</p><p>(04) Dadas as funções <span data-type="inline-math" data-latex="f(x)=\left(\frac{1}{10}\right)^{x}"></span> e <span data-type="inline-math" data-latex="g(x)=\left(\frac{1}{100}\right)^{x}"></span>, temos que <span data-type="inline-math" data-latex="f(x)\geq g(x)"></span> para qualquer <span data-type="inline-math" data-latex="x\in\mathbb{R}"></span>.</p><p>(08) Para qualquer que seja <span data-type="inline-math" data-latex="a&gt;0"></span> com <span data-type="inline-math" data-latex="a\neq 1"></span>, o gráfico da função exponencial <span data-type="inline-math" data-latex="f(x)=a^{x}"></span> nunca corta o eixo <span data-type="inline-math" data-latex="x"></span>.</p><p>(16) Dadas as funções <span data-type="inline-math" data-latex="f(x)=\log_{\frac{1}{2}}(x)"></span> e <span data-type="inline-math" data-latex="g(x)=\log_{2}(x)"></span>, temos que <span data-type="inline-math" data-latex="g(x)\geq f(x)"></span> para qualquer <span data-type="inline-math" data-latex="x\in\mathbb{R}^{*}_{+}"></span>.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. <span data-type="inline-math" data-latex="\log_{a}x=0\rightarrow a^{0}=x\rightarrow x=1"></span>;</p><p>(02) Incorreta. Com <span data-type="inline-math" data-latex="0&lt;a&lt;1"></span> a função é decrescente; Ex: <span data-type="inline-math" data-latex="\left(\frac{1}{2}\right)^{x}"></span>;</p><p>(04) Incorreta. <span data-type="inline-math" data-latex="f(-1)=10"></span> e <span data-type="inline-math" data-latex="g(-1)=100"></span>; para <span data-type="inline-math" data-latex="x=-1"></span>, <span data-type="inline-math" data-latex="f(x)&lt;g(x)"></span>;</p><p>(08) Correta. <span data-type="inline-math" data-latex="Im=\mathbb{R}^{*}_{+}"></span>: <span data-type="inline-math" data-latex="a^{x}&gt;0"></span> para todo <span data-type="inline-math" data-latex="x"></span>;</p><p>(16) Incorreta. Para <span data-type="inline-math" data-latex="x=\frac{1}{2}"></span>: <span data-type="inline-math" data-latex="g\left(\frac{1}{2}\right)=-1"></span> e <span data-type="inline-math" data-latex="f\left(\frac{1}{2}\right)=1"></span>; logo, <span data-type="inline-math" data-latex="g(x)&lt;f(x)"></span>.</p><p><strong>Soma: 01 + 08 = 09</strong></p></div></aside>
<aside class="questao" data-id="96a87dd7-76ba-4d52-983b-644baa01d8e4" data-gabarito="26"><p>(PAS-UEM 2025, 3ª etapa) Suponha que o número de indivíduos de uma colônia seja dado pela função <span data-type="inline-math" data-latex="p(t)=10\cdot 2^{4t}"></span>, em que <span data-type="inline-math" data-latex="t"></span> é o tempo em anos. Assinale o que for correto.</p><p>(01) A população inicial é de 160 indivíduos.</p><p>(02) Depois de 3 meses a população dobra em relação à população inicial.</p><p>(04) Não há nenhum instante de tempo em que a população atinja 1 trilhão de indivíduos.</p><p>(08) <span data-type="inline-math" data-latex="p(t)^{2}=10\cdot p(2t)"></span>.</p><p>(16) <span data-type="inline-math" data-latex="p(10)&gt;10^{10}"></span>.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. <span data-type="inline-math" data-latex="p(0)=10\cdot 2^{0}=10"></span>;</p><p>(02) Correta. 3 meses <span data-type="inline-math" data-latex="=\frac{1}{4}"></span> de ano: <span data-type="inline-math" data-latex="p\left(\frac{1}{4}\right)=10\cdot 2^{1}=20=2\cdot p(0)"></span>;</p><p>(04) Incorreta. <span data-type="inline-math" data-latex="10\cdot 2^{4t}=10^{12}\rightarrow 2^{4t}=10^{11}"></span>; como a imagem de uma função exponencial é <span data-type="inline-math" data-latex="\mathbb{R}^{*}_{+}"></span>, existe <span data-type="inline-math" data-latex="t"></span> que satisfaz a igualdade;</p><p>(08) Correta. <span data-type="inline-math" data-latex="p(t)^{2}=100\cdot 2^{8t}"></span> e <span data-type="inline-math" data-latex="10\cdot p(2t)=10\cdot 10\cdot 2^{8t}=100\cdot 2^{8t}"></span>;</p><p>(16) Correta. <span data-type="inline-math" data-latex="p(10)=10\cdot 2^{40}"></span>; como <span data-type="inline-math" data-latex="2^{10}=1024&gt;10^{3}"></span>, <span data-type="inline-math" data-latex="2^{40}&gt;10^{12}"></span> e <span data-type="inline-math" data-latex="p(10)&gt;10^{13}&gt;10^{10}"></span>.</p><p><strong>Soma: 02 + 08 + 16 = 26</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Função exponencial:</h3>
<p><span data-type="inline-math" data-latex="f(x)=a^{x}"></span>, com <span data-type="inline-math" data-latex="a&gt;0"></span> e <span data-type="inline-math" data-latex="a\neq 1"></span>;</p>
<h3 data-corrido="sim">Domínio da função exponencial:</h3>
<p><span data-type="inline-math" data-latex="D=\mathbb{R}"></span>;</p>
<h3 data-corrido="sim">Imagem da função exponencial:</h3>
<p><span data-type="inline-math" data-latex="Im=\mathbb{R}^{*}_{+}"></span>; o gráfico nunca intercepta o eixo <span data-type="inline-math" data-latex="x"></span>;</p>
<h3 data-corrido="sim">Ponto comum a todos os gráficos:</h3>
<p><span data-type="inline-math" data-latex="(0,\ 1)"></span>, pois <span data-type="inline-math" data-latex="a^{0}=1"></span>;</p>
<h3 data-corrido="sim">Função exponencial crescente:</h3>
<p>base <span data-type="inline-math" data-latex="a&gt;1"></span>;</p>
<h3 data-corrido="sim">Função exponencial decrescente:</h3>
<p>base <span data-type="inline-math" data-latex="0&lt;a&lt;1"></span>.</p>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where ((e.processo_slug = 'pas-uem' and e.etapa = 3
         and e.texto like 'Funções exponenciais: propriedades, domínio, imagem%')
     or (e.processo_slug = 'passe' and e.etapa = 2
         and (e.texto like 'Função exponencial: estudo do crescimento%'
              -- decisão do autor (08/10): a ponte g(x) = q^(x-1) e o link para
              -- [[Progressões]] completam o tópico junto com aquele resumo
              or e.texto like 'Função exponencial e Sequências numéricas%')))
   and e.resumo_id is null
   and r.slug = 'funcao-exponencial';

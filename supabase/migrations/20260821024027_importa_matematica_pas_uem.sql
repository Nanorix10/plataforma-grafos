-- Importa a Matemática da 1ª etapa do PAS UEM.
--
-- Três resumos: "Sistemas lineares", "Medidas de tendência central" e "Medidas
-- de dispersão". São os tópicos escritos; os outros vinte e três da matéria são
-- a lista do edital, e não entram.
--
-- ## As duas imagens viraram fórmula, não figura
--
-- O documento tinha dois PRINTS de fórmula: o sistema na forma matricial e o
-- quadro da regra de Cramer. Print de fórmula não se seleciona, não acompanha o
-- tamanho da letra e — o que decide — tem fundo branco com traço escuro, então
-- no tema escuro do site ele apareceria como um retângulo aceso no meio do
-- texto. Os dois entram como `block-math`, que é a mesma decisão 9c ("fórmula é
-- nó do editor") aplicada a uma fórmula que chegou como imagem.
--
-- A quebra de linha das matrizes é `\cr`, e não a barra dupla: as duas fazem a
-- mesma coisa no KaTeX, e a barra dupla é frágil de transportar entre camadas.
--
-- ## Uma pontuação trocada, e é a única
--
-- No título da amplitude, "Amplitude (Amp) = último termo - termo inicial"
-- virou "Amplitude (Amp):" + a frase. É o formato corrido `Termo:` do resto do
-- material (decisão 12c), e sem isso o rótulo do nó no /mapa seria a linha
-- inteira, com o "(COLOCAR EM ROL!)" junto. Nenhuma palavra mudou.
--
-- ## O que eu NÃO consertei, e você precisa ver
--
-- Quatro coisas do original, todas transportadas como estão (decisão 9c: mostrar
-- e perguntar, nunca corrigir de passagem):
--
-- 1. **A classificação dos sistemas diz `D≠0` nos três casos.** No SPI e no
--    Sistema Impossível a frase ao lado diz "iguais a zero" e "igual a zero" —
--    a fórmula contradiz o texto que ela acompanha.
-- 2. **"Sistema Impossível (SP)"** — a sigla usual é SI.
-- 3. **"Determinante principal () diferente de zero"** — o parêntese está vazio
--    no documento, o símbolo que ia ali se perdeu antes de mim.
-- 4. **A soma das médias começa em `x_2`**: `x_2+x_2+x_3+x_4+...+x_n`, nas duas
--    vezes em que aparece, e o desvio-padrão também abre com `x_2`.
--
-- 5. **"Ache a média aritméticaX"** — falta o espaço antes do símbolo, e ele
--    falta no documento: ali o X é um objeto de equação colado na palavra.
--
-- ## O bloco "Média" solto ficou de fora
--
-- Antes de "Medidas de tendência central" o documento tem um tópico "Média" com
-- a média aritmética e a geométrica — as mesmas palavras que reaparecem dentro
-- de tendência central, que ainda traz a harmônica e a quadrática. Importar os
-- dois criaria dois nós iguais no mapa. Ficou o mais completo. Se o solto tiver
-- razão de existir separado, ele entra numa migration de uma linha.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sistemas-lineares',
  'Sistemas lineares',
  'matematica',
  'pas-uem',
  'Conjunto de equações lineares: a forma matricial, a classificação em SPD, SPI e SI, e a regra de Cramer.',
  '<p>conjunto de equações lineares;</p><h2 data-corrido="sim">Equação linear:</h2><p><span data-type="inline-math" data-latex="a_1x_1+a_2x_2+a_3x_3+...+a_nx_n=b"></span></p><ul><li><p><span data-type="inline-math" data-latex="x_1,x_2,x_3, ...,x_n"></span>: incógnitas de expoente 1;</p></li><li><p><span data-type="inline-math" data-latex="a_1, a{}_3, ..., a_n"></span>: coeficientes (sempre reais);</p></li><li><p>b: termo independente;</p></li></ul><h2 data-corrido="sim">Representação matricial:</h2><p>sistemas lineares podem ser escritos na forma matricial <span data-type="inline-math" data-latex="A⋅X=B"></span>;</p><ul><li><div data-type="block-math" data-latex="\begin{cases}5x+4y=1\cr 3x+7y=2\end{cases}\iff\underbrace{\begin{bmatrix}5&amp;4\cr 3&amp;7\end{bmatrix}}_{A}\underbrace{\begin{bmatrix}x\cr y\end{bmatrix}}_{X}=\underbrace{\begin{bmatrix}1\cr 2\end{bmatrix}}_{B}"></div></li></ul><h2>Classificação</h2><ul><li><p>Sistema Possível e Determinado (SPD): possui uma única solução;</p><ul><li><p>Determinante principal () diferente de zero;</p><ul><li><p><span data-type="inline-math" data-latex="D≠0"></span></p></li></ul></li></ul></li><li><p>Sistema Possível e Indeterminado (SPI):possui soluções infinitas;</p><ul><li><p>Determinante principal e determinantes secundários iguais a zero;</p><ul><li><p><span data-type="inline-math" data-latex="D≠0"></span> e <span data-type="inline-math" data-latex="D_x,D_y,...=0"></span></p></li></ul></li></ul></li><li><p>Sistema Impossível (SP): não possui solução;</p><ul><li><p>Determinante principal igual a zero e pelo menos um dos secundário diferente de zero;</p><ul><li><p><span data-type="inline-math" data-latex="D≠0"></span> e pelo menos um <span data-type="inline-math" data-latex="D_x,D_y,...≠0"></span></p></li></ul></li></ul></li></ul><h2>Regra de Cramer</h2><ul><li><div data-type="block-math" data-latex="\begin{cases}a_1x+b_1y=c_1\cr a_2x+b_2y=c_2\end{cases}\qquad x=\frac{D_x}{D}\qquad y=\frac{D_y}{D}"></div><div data-type="block-math" data-latex="D=\begin{vmatrix}a_1&amp;b_1\cr a_2&amp;b_2\end{vmatrix}\qquad D_x=\begin{vmatrix}c_1&amp;b_1\cr c_2&amp;b_2\end{vmatrix}\qquad D_y=\begin{vmatrix}a_1&amp;c_1\cr a_2&amp;c_2\end{vmatrix}"></div></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'medidas-de-tendencia-central',
  'Medidas de tendência central',
  'matematica',
  'pas-uem',
  'Média, moda e mediana — os valores que resumem uma amostra em torno de um centro.',
  '<p>valores estatísticos usados para representar e resumir um conjunto de dados em torno de um "centro";</p><h2>Média</h2><h3>Aritmética</h3><ul><li><p>Simples: <span data-type="inline-math" data-latex="\frac{x_2+x_2+x_3+x_4+...+x_n}{n}"></span></p><ul><li><p><span data-type="inline-math" data-latex="x_2+x_2+x_3+x_4+...+x_n"></span>: valores dos dados;</p></li><li><p>n: número de dados;</p></li></ul></li><li><p>Ponderada: <span data-type="inline-math" data-latex="\frac{p_1⋅x_1+p_2⋅x_2+...+p_n⋅x_n}{n}"></span></p><ul><li><p><span data-type="inline-math" data-latex="p_1, p_2,...,p_n"></span>: pesos;</p></li><li><p><span data-type="inline-math" data-latex="x_1,x_2,...,x_n"></span>: valores dos dados;</p></li></ul></li></ul><h3 data-corrido="sim">Geométrica:</h3><p><span data-type="inline-math" data-latex="G=\sqrt[n]{x_1⋅x_2⋅...⋅x_n}"></span></p><h3 data-corrido="sim">Harmônica:</h3><p><span data-type="inline-math" data-latex="H=\frac{n}{\frac{1}{x_1}+\frac{1}{x_2}+...+\frac{1}{n}}"></span></p><h3 data-corrido="sim">Quadrática:</h3><p><span data-type="inline-math" data-latex="Q=\sqrt{\frac{{x_1}^2+{x_2}^2+...+{x_n}^2}{n}}"></span></p><h2 data-corrido="sim">Moda:</h2><p>conjunto de valores que apresentam maior frequência/peso;</p><ul><li><p>Ex:<span data-type="inline-math" data-latex="\{1,2,3,5,6,6,7\}→moda=6"></span> (unimodal)</p><p><span data-type="inline-math" data-latex="\{1,1,2,3,4,4,5,8\}→moda=1 e 4"></span> (bimodal)</p><p><span data-type="inline-math" data-latex="\{0,1,3,4,6,7,8\}→ sem moda"></span> (amodal)</p></li></ul><h2 data-corrido="sim">Mediana:</h2><p>termo central da amostra(em rol);</p><ul><li><p>Ex: <span data-type="inline-math" data-latex="\{1,2,3, 3,5,7,9\}→Md=3"></span></p><p><span data-type="inline-math" data-latex="\{4,4,5, 6,8,8,9,10\}→Md=\frac{6+8}{2}=7"></span></p></li><li><p>Quantidade ímpar de dados→posição do termo central→<span data-type="inline-math" data-latex="\frac{n+1}{2}"></span></p></li><li><p>Quantidade par de dados→posição dos termos centrais→<span data-type="inline-math" data-latex="\frac{n+1}{2}"></span> e <span data-type="inline-math" data-latex="\frac{n}{2}+1"></span></p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'medidas-de-dispersao',
  'Medidas de dispersão',
  'matematica',
  'pas-uem',
  'Amplitude, desvio médio, variância e desvio-padrão: o quanto os dados se afastam da média.',
  '<p>parâmetros estatísticos que indicam o grau de variabilidade ou afastamento dos dados em relação a um valor central (como a média);</p><h2 data-corrido="sim">Amplitude (Amp):</h2><p>último termo - termo inicial (COLOCAR EM ROL!)</p><ul><li><p>Ex: Amostra = <span data-type="inline-math" data-latex="7,9,5,3,4,8"></span> → Amostra = <span data-type="inline-math" data-latex="3,4,5,7,8,9"></span></p></li><li><p>Amp = 9 - 3 = 6</p></li></ul><h2 data-corrido="sim">Desvio médio (d):</h2><p><span data-type="inline-math" data-latex="d=\frac{|x_1-x| + |x_2-x|+…+|x_n-x|}{n}"></span></p><ul><li><p>Simplificando: Ache a média aritméticaX. Subtraia cada termo pela média que você encontrou. Deixe todos os resultados positivos. Some os resultados e divida pelo número de termos.</p></li><li><p>Ex: Amostra = <span data-type="inline-math" data-latex="7,9,5,3,4,8"></span></p><ul><li><p><span data-type="inline-math" data-latex="x=\frac{7 + 9 + 5 + 3 + 4 + 8}{6}"></span> = <span data-type="inline-math" data-latex="\frac{36}{6}"></span> = 6</p></li><li><p>d=<span data-type="inline-math" data-latex="\frac{|7-6| + |9-6|+|5-6|+|3-6|+|4-6|+|8-6|}{6}"></span> = <span data-type="inline-math" data-latex="\frac{1+3+1+3+2+2}{6}=\frac{12 }{6}=2"></span></p></li></ul></li></ul><h2 data-corrido="sim">Variância (Var):</h2><p><span data-type="inline-math" data-latex="Var=\frac{(x_1-x)^2 + (x_2-x)^2+ …+(x_n-x)^2}{n}"></span></p><ul><li><p>Ex: Amostra = <span data-type="inline-math" data-latex="7,9,5,3,4,8"></span> → X = 6</p><ul><li><p>Var=<span data-type="inline-math" data-latex="\frac{(7 - 6)²+(9 - 6)²+(5 - 6)²+(3 - 6)²+(4 - 6)²+(8 - 6)²}{6}"></span> = <span data-type="inline-math" data-latex="\frac{1²+3²+(-1)²+(-3)²+(-2)²+2² }{6}"></span> = <span data-type="inline-math" data-latex="\frac{1 + 9 + 1 + 9 + 4 + 4 }{6}"></span> = <span data-type="inline-math" data-latex="\frac{28 }{6} ≈"></span> 4,6</p></li></ul></li></ul><h2 data-corrido="sim">Desvio-Padrão (σ):</h2><p><span data-type="inline-math" data-latex="σ=\sqrt{\frac{(x_2- x)^2+(x_2-x)^2+…+(x_n-x)^2}{n}}"></span></p><ul><li><p>Podemos perceber que o que está na raiz é a variância, portanto podemos simplificar o desvio-padrão para: <span data-type="inline-math" data-latex="\sqrt{Var}"></span></p></li><li><p>Ex: Como já calculamos, <span data-type="inline-math" data-latex="Var=\frac{28}{6}"></span>, portanto:</p><p>σ = <span data-type="inline-math" data-latex="\sqrt{ \frac{28}{6}}"></span> → neste caso, não temos raízes exatas, então pode manter assim, mas se fosse, por exemplo <span data-type="inline-math" data-latex="\sqrt{\frac{9}{4}}"></span>, ficaria <span data-type="inline-math" data-latex="\frac{\sqrt{9}}{\sqrt{4}}"></span> = <span data-type="inline-math" data-latex="\frac{3}{2}"></span>.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- Importa a parte da Física do PAS UEM 1ª etapa que ainda NÃO estava no site.
--
-- A Física é a única matéria com sobreposição: a Dinâmica e o que vem depois
-- dela já entraram em 08/08, vindas do documento "Dinâmica (revisado)", que é
-- outro arquivo. Este documento mestre cobre a matéria inteira, então aqui
-- entram só os cinco tópicos que faltavam — todos anteriores à Dinâmica na
-- ordem do documento:
--
--   Grandezas físicas, Cinemática, Movimentos retilíneos,
--   Lançamento horizontal e Lançamento oblíquo.
--
-- Os dez resumos que já existem não são tocados por esta migration. As figuras
-- que faltam a eles entram na seguinte.
--
-- ## Os cinco ficam na raiz, como no documento
--
-- Não pendurei "Movimentos retilíneos" e os dois lançamentos em "Cinemática".
-- No documento os cinco são itens irmãos, e `pai_id` é estrutura escrita à mão
-- pelo autor (decisão 9/12), não hierarquia que eu deva inferir. Se você quiser
-- os três pendurados na Cinemática, é um `update` de três linhas.
--
-- ## As três tabelas do SI são tabelas
--
-- As grandezas fundamentais, as derivadas e as vetoriais estavam em tabelas de
-- verdade no `.docx`, e entram como `<table>` — não como texto corrido nem como
-- imagem. A primeira linha vira `<th>` (no Docs ela vem em negrito) e o negrito
-- sai de dentro dela: `<th>` já é cabeçalho, e negrito no site significa outra
-- coisa.
--
-- ## Quinze figuras
--
-- Todas de `word/media`, convertidas para WebP e servidas de
-- `public/img/resumos/fisica/`, cada uma com `alt` escrito olhando o desenho.
-- Duas ganharam nome pelo que mostram, e não pelo tópico onde estão:
-- `area-do-grafico-v-t` e `area-do-grafico-a-t`.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- 1. **O símbolo do metro está `m²`** na tabela das grandezas fundamentais.
-- 2. **"Intensidade luminosa (l)"** — o símbolo usual é I, não l minúsculo. O
--    mesmo l aparece em "Comprimento (l)".
-- 3. **"Campo elétrica (E)"**, na tabela das vetoriais.
-- 4. **"Movimento acelerado: aceleração atua no mesmo sentido do movimento ()"**
--    — parêntese vazio, o símbolo se perdeu antes de mim.
-- 5. Os deslizes de digitação seguem todos: "propiedades", "númericamente",
--    "horizntal", "alébricamente", "possívle", "correspondea", "pertencente a
--    um corpo se desloca", "em um trajetória".
--
-- As 46 fórmulas destes cinco resumos passaram pelo KaTeX antes de entrar.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'grandezas-fisicas',
  'Grandezas físicas',
  'fisica',
  'pas-uem',
  'O que se mede e como se mede: as grandezas escalares, as vetoriais e as operações com vetores.',
  '<p>propiedades mensuráveis de um corpo ou fenômeno expressas númericamente (unidades de medida);</p><ul><li><p>Padronizadas pelo Sistema Internacional de Unidades (SI);</p><p>Podem ser:</p></li></ul><h2 data-corrido="sim">Escalares:</h2><p>totalmente definidas por valor e unidade;</p><ul><li><p>Ex: grandezas fundamentais do SI: independentes entre si;</p></li></ul><table><tbody><tr><th><p>Grandeza Fundamental</p></th><th><p>Unidade SI</p></th><th><p>Símbolo</p></th><th><p>Instrumento de Medida</p></th></tr><tr><td><p>Comprimento (l)</p></td><td><p>metro</p></td><td><p>m<sup>2</sup></p></td><td><p>Régua, fita métrica</p></td></tr><tr><td><p>Massa (m)</p></td><td><p>quilograma</p></td><td><p>kg</p></td><td><p>Balança</p></td></tr><tr><td><p>Tempo (t)</p></td><td><p>segundo</p></td><td><p>s</p></td><td><p>Relógio, cronômetro</p></td></tr><tr><td><p>Corrente elétrica (i)</p></td><td><p>ampere</p></td><td><p>A</p></td><td><p>Amperímetro</p></td></tr><tr><td><p>Temperatura (T)</p></td><td><p>kelvin</p></td><td><p>K</p></td><td><p>Termômetro</p></td></tr><tr><td><p>Quantidade de matéria (n)</p></td><td><p>mol</p></td><td><p>mol</p></td><td><p>Titulação</p></td></tr><tr><td><p>Intensidade luminosa (l)</p></td><td><p>candela</p></td><td><p>cd</p></td><td><p>Fotômetro</p></td></tr></tbody></table><ul><li><p>Todas as demais são derivadas dessas sete grandezas fundamentais;</p></li></ul><table><tbody><tr><th><p>Grandeza Fundamental</p></th><th><p>Unidade SI</p></th><th><p>Símbolo</p></th></tr><tr><td><p>Área (A)</p></td><td><p>metro quadrado</p></td><td><p>m<sup>2</sup></p></td></tr><tr><td><p>Volume (V)</p></td><td><p>metro cúbico</p></td><td><p>m<sup>3</sup></p></td></tr><tr><td><p>Carga elétrica (Q)</p></td><td><p>coulomb</p></td><td><p>C</p></td></tr><tr><td><p>Potencial elétrico (U) (V)</p></td><td><p>volt</p></td><td><p>V</p></td></tr><tr><td><p>Resistência elétrica (R)</p></td><td><p>ohm</p></td><td><p>Ω</p></td></tr><tr><td><p>Capacitância (C)</p></td><td><p>farad</p></td><td><p>F</p></td></tr><tr><td><p>Potência (P)</p></td><td><p>watt</p></td><td><p>W</p></td></tr><tr><td><p>Energia (E), trabalho (τ) (W), quantidade de calor (Q)</p></td><td><p>joule</p></td><td><p>J</p></td></tr><tr><td><p>Pressão (P)</p></td><td><p>pascal</p></td><td><p>Pa</p></td></tr><tr><td><p>Frequência (f)</p></td><td><p>hertz</p></td><td><p>Hz</p></td></tr></tbody></table><h2 data-corrido="sim">Vetoriais:</h2><p>requerem módulo (intensidade), direção e sentido;</p><table><tbody><tr><th><p>Grandeza Fundamental</p></th><th><p>Unidade SI</p></th><th><p>Símbolo</p></th></tr><tr><td><p>Distância (d)</p></td><td><p>metro</p></td><td><p>m</p></td></tr><tr><td><p>Velocidade (v)</p></td><td><p>metro por segundo</p></td><td><p><span data-type="inline-math" data-latex="m/s"></span></p></td></tr><tr><td><p>Velocidade angular (ω)</p></td><td><p>radiano por segundo</p></td><td><p><span data-type="inline-math" data-latex="rad/s"></span></p></td></tr><tr><td><p>Aceleração (a)</p></td><td><p>metro por segundo ao quadrado</p></td><td><p><span data-type="inline-math" data-latex="m/s^2"></span></p></td></tr><tr><td><p>Força (F)</p></td><td><p>newton</p></td><td><p>N</p></td></tr><tr><td><p>Campo elétrica (E)</p></td><td><p>Newton por Coulomb</p></td><td><p><span data-type="inline-math" data-latex="N/C"></span></p></td></tr><tr><td><p>Campo magnético, indutância magnética (B)</p></td><td><p>tesla</p></td><td><p>T</p></td></tr></tbody></table><h3 data-corrido="sim">Vetores:</h3><p>ente matemático que representa todos os segmentos de reta orientados com a mesma direção (horizntal, vertical ou diagonal), o mesmo sentido (direita, esquerda, para cima ou para baixo) e o mesmo módulo (valor númerico e unidade);</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/vetor.webp" alt="A direção do vetor é a da reta suporte, o sentido é a orientação da seta e o módulo é o tamanho do vetor." style="width:100%" data-largura="100%"></figure></li></ul><h4>Notação de vetores</h4><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/notacao-de-vetores.webp" alt="Um vetor força desenhado numa grade em que cada quadrado vale 1 N: direção horizontal, sentido para a esquerda, intensidade 3 N." style="width:100%" data-largura="100%"></figure></li></ul><h4>Operações com vetores</h4><ul><li><p>Adição:</p><ul><li><p>Método poligonal: o vetor resultante (<span data-type="inline-math" data-latex="{\vec{F}}_R"></span>) da soma é representado pelo segmento de reta orientado que se inicia na origem do primeiro vetor e termina na extremidade do último vetor;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/soma-metodo-poligonal.webp" alt="Quatro vetores desenhados um a partir da extremidade do anterior; o resultante liga a origem do primeiro à extremidade do último." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Método paralelogramo: aplicação da lei dos cossenos para obter alébricamente o módulo do vetor soma;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/soma-metodo-paralelogramo.webp" alt="Dois vetores partindo do mesmo ponto formam um paralelogramo, e a diagonal é o vetor soma: R² = X² + Y² + 2XY·cos α." style="width:100%" data-largura="100%"></figure></li><li><p>Se o vetor tem <span data-type="inline-math" data-latex="α=90°"></span>, é possívle usar o Teorema de Pitágoras;</p><ul><li><p><span data-type="inline-math" data-latex="R^2=X^2+Y^2"></span></p></li></ul></li></ul></li></ul></li><li><p>Subtração: correspondea a adicionar o oposto do vetor a ser subtraído;</p></li><li><p>Multiplicação por um escalar: multiplica o módulo, mantendo a direção e sentido;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/vetor-por-escalar.webp" alt="Multiplicar por 2 dobra o módulo e mantém o sentido; multiplicar por −0,5 reduz o módulo à metade e inverte o sentido." style="width:100%" data-largura="100%"></figure></li></ul></li></ul><ul><li><p>A letra grega maiúscula delta (Δ), quando acompanhada de uma grandeza, indica a variação desta, ou seja, a diferença de valores dessa grandeza entre um instante inicial e um instante final;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'cinematica',
  'Cinemática',
  'fisica',
  'pas-uem',
  'Os conceitos que descrevem o movimento: referencial, trajetória, velocidade e aceleração.',
  '<p>parte da Mecânica que estuda a geometria dos movimentos;</p><h2>Conceitos fundamentais</h2><h3 data-corrido="sim">Ponto material:</h3><p>corpo cujas dimensões são desprezíveis se comparadas às dimensões envolvidas no fenômeno;</p><h3 data-corrido="sim">Referencial:</h3><p>ponto a partir do qual se observa o movimento (ou repouso) de um corpo e sobre o qual é posicionado um sistema de coordenadas para, com base na observação, se obter os valores de posição, velocidade e aceleração da partícula como função do tempo;</p><h3 data-corrido="sim">Movimento/Repouso:</h3><p>estado em que um corpo altera ou não a sua posição no decorrer do tempo em relação ao referencial adotado;</p><h4 data-corrido="sim">Velocidade escalar:</h4><p>taxa de deslocamento de um corpo em relação ao tempo;</p><ul><li><p>Média (v<sub>m</sub>): deslocamento em um período de tempo dividido pelo período de tempo;</p><ul><li><p><span data-type="inline-math" data-latex="v_m=\frac{Δs}{Δt}"></span></p></li></ul></li><li><p>Instantânea (v): velocidade medida em um intervalo de tempo extremamente curto (que tende a zero), representando a velocidade do objeto naquele exato momento;</p></li><li><p>Movimento progressivo: mesmo sentido da orientação positiva da trajetória (v&gt;0);</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/movimento-progressivo.webp" alt="Movimento uniforme progressivo (v &gt; 0): os gráficos de espaço, velocidade e aceleração em função do tempo." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Movimento retrógrado: sentido contrário da orientação positiva da trajetória (v&lt;0);</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/movimento-retrogrado.webp" alt="Movimento uniforme retrógrado (v &lt; 0): os gráficos de espaço, velocidade e aceleração em função do tempo." style="width:100%" data-largura="100%"></figure></li></ul></li></ul><h4 data-corrido="sim">Aceleração escalar:</h4><p>variação da velocidade de um corpo em relação ao tempo;</p><ul><li><p>Média (a<sub>m</sub>): variação da velocidade em relação ao intervalo de tempo decorrido;</p><ul><li><p><span data-type="inline-math" data-latex="a_m=\frac{Δv}{Δt}"></span></p></li></ul></li><li><p>Instantânea (a): aceleração medida em um intervalo de tempo extremamente curto, que tende a zero;</p></li><li><p>Movimento acelerado: aceleração atua no mesmo sentido do movimento ();</p><ul><li><p>Aceleração e velocidade com mesmo sinal (positivo ou negativo);</p></li><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/movimento-acelerado.webp" alt="Movimento uniformemente variado com a &gt; 0: os gráficos de espaço, velocidade e aceleração em função do tempo." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Movimento retardado: aceleração atua no sentido contrário ao movimento;</p><ul><li><p>Aceleração e velocidade com sinais opostos;</p></li><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/movimento-retardado.webp" alt="Movimento uniformemente variado com a &lt; 0: os gráficos de espaço, velocidade e aceleração em função do tempo." style="width:100%" data-largura="100%"></figure></li></ul></li></ul><h3 data-corrido="sim">Trajetória:</h3><p>conjunto de posições ocupadas por um corpo no decorrer do tempo;</p><h4 data-corrido="sim">Espaço:</h4><p>posição de uma partícula em relação à sua trajetória;</p><ul><li><p>Função horária do espaço: relaciona os espaços de um móvel com os correspondentes instantes de tempo;</p></li><li><p>Variação de espaço (Δs): mudança de posição de um móvel;</p><ul><li><p>Ex: se um corpo, em um instante t<sub>1</sub>, possui espaço s<sub>1</sub> e, em um instante t<sub>2</sub>, possui espaço s<sub>2</sub>, temos que <span data-type="inline-math" data-latex="t_2-t_1=Δt"></span> e <span data-type="inline-math" data-latex="s_2-s_1=Δs"></span>;</p></li></ul></li></ul><h4 data-corrido="sim">Distância percorrida:</h4><p>comprimento total do caminho seguido por um objeto;</p><ul><li><p>Soma dos módulos de Δs em cada sentido de movimento;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'movimentos-retilineos',
  'Movimentos retilíneos',
  'fisica',
  'pas-uem',
  'MRU, MRUV e os movimentos verticais — a função horária de cada um.',
  '<p>deslocamento de um corpo em um trajetória em linha reta;</p><h2 data-corrido="sim">Movimento retilíneo uniforme (MRU):</h2><p>pertencente a um corpo se desloca mantendo sua velocidade escalar instantânea constante, igual a velocidade escalar média (<span data-type="inline-math" data-latex="v=v_m"></span>) e diferente de zero (<span data-type="inline-math" data-latex="v≠0"></span>);</p><ul><li><p><span data-type="inline-math" data-latex="v_m=v⇒v=\frac{Δs}{Δt}"></span></p></li><li><p>Função horária: <span data-type="inline-math" data-latex="s=s_0+v⋅t"></span></p><ul><li><p>s: espaço para um instante qualquer t;</p></li><li><p>s<sub>0</sub>: espaço constante para o instante <span data-type="inline-math" data-latex="t=0"></span> ;</p></li><li><p><span data-type="inline-math" data-latex="Δs=v⋅t"></span></p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/area-do-grafico-v-t.webp" alt="A variação de espaço é a área sob a curva do gráfico de velocidade por tempo." style="width:100%" data-largura="100%"></figure></li></ul></li></ul></li></ul><h2 data-corrido="sim">Movimento retilíneo uniformemente variado (MRUV):</h2><p>pertence a um corpo que se desloca com aceleração escalar constante e diferente de zero (<span data-type="inline-math" data-latex="a≠0"></span>);</p><ul><li><p>Função horária dos espaços: <span data-type="inline-math" data-latex="s=s_0+v_0t+\frac{at^2}{2}"></span></p><ul><li><p><span data-type="inline-math" data-latex="Δs=v_0t+\frac{at^2}{2}"></span></p></li></ul></li><li><p>Função horária da velocidade: <span data-type="inline-math" data-latex="v=v_0+at"></span></p><ul><li><p><span data-type="inline-math" data-latex="Δv=at"></span></p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/area-do-grafico-a-t.webp" alt="A variação de velocidade é a área sob a curva do gráfico de aceleração por tempo." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Velocidade média entre dois pontos da trajetória: <span data-type="inline-math" data-latex="v_m=\frac{v_1+v_2}{2}"></span></p></li></ul></li><li><p>Equação de Torricelli: <span data-type="inline-math" data-latex="v^2={v_0}^2+2a⋅Δs"></span></p><p>Para as anteriores:</p><ul><li><p>s: espaço para um instante qualquer t;</p></li><li><p>s<sub>0</sub>: espaço constante para o instante <span data-type="inline-math" data-latex="t=0"></span> ;</p></li><li><p>v<sub>0</sub>: velocidade constante para o instante <span data-type="inline-math" data-latex="t=0"></span>;</p></li></ul></li></ul><h2 data-corrido="sim">Movimentos verticais:</h2><p>fenômenos com influência constante da gravidade;</p><ul><li><p>Como a aceleração sempre é a mesma (g), os movimentos verticais são movimentos uniformemente variados;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/movimentos-verticais.webp" alt="Na subida a gravidade aponta contra a velocidade; na descida, a favor." style="width:268px" data-largura="268px"></figure></li></ul><h3>Lançamento vertical para cima</h3><ul><li><p><span data-type="inline-math" data-latex="h=h_0+{v_0t-\frac{gt^2}{2}}_{}"></span></p><ul><li><p><span data-type="inline-math" data-latex="Δh={v_0t-\frac{gt^2}{2}}_{}"></span></p></li></ul></li><li><p><span data-type="inline-math" data-latex="v=v_0-gt"></span></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/lancamento-vertical.webp" alt="Objeto solto do repouso caindo de uma altura h, com a aceleração da gravidade no sentido da trajetória." style="width:420px" data-largura="420px"></figure></li><li><p><span data-type="inline-math" data-latex="v^2= {v_0}^2-2g⋅Δh"></span></p></li></ul><h3>Queda livre</h3><ul><li><p><span data-type="inline-math" data-latex="h=\frac{gt^2}{2}"></span></p></li><li><p><span data-type="inline-math" data-latex="v=gt"></span></p></li><li><p><span data-type="inline-math" data-latex="v^2=2g⋅h"></span></p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'lancamento-horizontal',
  'Lançamento horizontal',
  'fisica',
  'pas-uem',
  'Objeto arremessado paralelamente ao solo: a componente horizontal constante e a vertical em queda livre.',
  '<p>um objeto é arremessado paralelamente ao solo (<span data-type="inline-math" data-latex="v_{y_0}=0"></span>), a partir de uma certa altura;</p><h2>Componente horizontal (v<sub>x</sub>)</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/lancamento-horizontal.webp" alt="Objeto arremessado horizontalmente do alto de uma altura h: a componente horizontal é constante e a aceleração é vertical, igual a g." style="width:100%" data-largura="100%"></figure><ul><li><p><span data-type="inline-math" data-latex="Δx=v_x⋅t"></span></p></li></ul><h2 data-corrido="sim">Componente vertical (v<sub>y</sub>):</h2><p>queda livre;</p><ul><li><p><span data-type="inline-math" data-latex="h=\frac{gt^2}{2}"></span></p></li><li><p><span data-type="inline-math" data-latex="v_y=gt"></span></p></li><li><p><span data-type="inline-math" data-latex="{v_y}^2=2gh"></span></p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'lancamento-obliquo',
  'Lançamento oblíquo',
  'fisica',
  'pas-uem',
  'Objeto lançado na diagonal: as componentes da velocidade, a altura e o alcance.',
  '<p>um objeto lançado na diagonal, formando um ângulo (<span data-type="inline-math" data-latex="θ"></span>) com a horizontal;</p><h2>Componente horizontal (v<sub>x</sub>)</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/lancamento-obliquo.webp" alt="Trajetória parabólica de um objeto lançado na diagonal, com as componentes horizontal e vertical da velocidade em cada ponto." style="width:100%" data-largura="100%"></figure><ul><li><p><span data-type="inline-math" data-latex="v_x=v_0⋅ cosθ"></span></p></li><li><p><span data-type="inline-math" data-latex="Δx=v_x⋅t"></span></p></li><li><p><span data-type="inline-math" data-latex="D=\frac{{v_0}^2 ⋅ sen(2Θ)}{g}"></span></p></li></ul><h2>Componente vertical (v<sub>y</sub>)</h2><ul><li><p><span data-type="inline-math" data-latex="v_{y_0}=v_0⋅ senθ"></span></p></li><li><p><span data-type="inline-math" data-latex="h=h_0+v_{y_0}t-\frac{gt^2}{2}"></span></p></li><li><p><span data-type="inline-math" data-latex="v_y=v_{y_0}-gt"></span></p></li><li><p><span data-type="inline-math" data-latex="{v_y}^2={v_{y_0}}^2-2gh"></span></p></li></ul>',
  null
)
on conflict (slug) do nothing;

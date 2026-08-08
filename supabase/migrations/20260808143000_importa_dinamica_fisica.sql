-- Importa a Dinâmica (Física, PAS UEM 1ª etapa) vinda do Google Docs.
--
-- Primeiro conteúdo real do site, e piloto da migração das outras matérias.
--
-- ## Por que o conteúdo entra por migração, e não por uma tela de importação
--
-- Uma tela de importação seria código novo para um problema que aparece uma vez
-- por matéria. A migração usa o `supabase db push` que já se roda aqui, fica
-- versionada, e o PR mostra exatamente que texto entrou no banco — o que uma
-- caixa de colar não mostra.
--
-- ## Um documento virou dez resumos
--
-- No Docs a Dinâmica é um tópico só, com cinco níveis de recuo. Aqui ela vira
-- um pai (`dinamica`) e nove filhos por `pai_id`, porque é isso que faz o mapa
-- de grafos ter nós de verdade em vez de um ponto único. O pai NÃO lista os
-- filhos em [[wikilink]]: conter e citar são os dois eixos separados da
-- migration de hierarquia, e linkar o filho que já está pendurado desenharia a
-- mesma relação duas vezes no mapa. Os wikilinks que existem aqui são citações
-- honestas — "plano inclinado" cita "forças da mecânica" porque usa a normal e
-- o peso, não porque mora dentro dele.
--
-- ## Formato do corpo
--
-- Fórmula é nó do editor (`data-type="inline-math"`), não `$…$`: assim ela
-- aparece renderizada TAMBÉM dentro do editor, e não como texto cru esperando
-- ser redigitada. Símbolo solto no meio da frase continua sendo texto com
-- <sub>/<sup>, conforme a decisão 8b do CONTEXTO.
--
-- `on conflict (slug) do nothing` deixa rodar de novo sem duplicar. Reimportar
-- por cima de uma edição feita no editor seria pior que não reimportar.

-- ============================================
-- 1. O pai
-- ============================================
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'dinamica',
  'Dinâmica',
  'fisica',
  'pas-uem',
  'Estuda o movimento dos corpos e as causas que o produzem ou modificam.',
  '<p>A <strong>dinâmica</strong> estuda o movimento dos corpos e as causas que os produzem ou modificam. A cinemática descreve <em>como</em> um corpo se move; a dinâmica responde <em>por que</em> ele se move assim.</p>
<ul><li><p><strong>Referencial inercial:</strong> sistema de referência em relação ao qual um corpo livre de forças (ou com resultante nula) permanece em repouso ou em MRU;</p>
<ul><li><p>Todo referencial em repouso ou em MRU em relação a um referencial inercial também é inercial;</p></li>
<li><p>A Terra é considerada, na prática, um referencial inercial — aproximação válida para a maioria dos problemas de vestibular;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 2. Os nove filhos
-- ============================================
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'leis-de-newton',
  'Leis de Newton',
  'fisica',
  'pas-uem',
  'Os três princípios que definem como os corpos respondem às forças aplicadas.',
  '<p>As <strong>leis de Newton</strong> definem o comportamento dos corpos em resposta às forças aplicadas.</p>
<ul><li><p><strong>1ª lei de Newton (Lei da Inércia):</strong> todo corpo em repouso ou em movimento retilíneo uniforme continua nesses estados, desde que seja nula a resultante das forças que nele atua;</p></li>
<li><p><strong>2ª lei de Newton (Princípio Fundamental da Dinâmica):</strong> <span data-type="inline-math" data-latex="F_R = m\,a"></span></p>
<ul><li><p>A aceleração e a força resultante devem ter obrigatoriamente mesma direção e sentido;</p></li></ul></li>
<li><p><strong>3ª lei de Newton (Ação e reação):</strong> se um corpo A exerce uma força de módulo F<sub>1</sub> em um corpo B, então o corpo B exerce uma força de módulo F<sub>2</sub> em A, tal que <span data-type="inline-math" data-latex="F_2 = -F_1"></span></p>
<ul><li><p>Mesmo módulo, mesma direção, sentidos contrários, e atuam em corpos diferentes;</p></li></ul></li></ul>
<aside class="questao"><p>(UFMS) Marcos está sem cinto de segurança, em uma via simples, a 108 km/h, quando observa um guarda de trânsito com um radar móvel. Instantaneamente, ele aciona os freios de seu carro e percebe que sua barriga toca no volante do veículo. Refletindo sobre sua aula de Física, percebe corretamente que a explicação é devido à:</p>
<p>A) 1ª Lei de Kepler.</p>
<p>B) 2ª Lei de Kepler.</p>
<p>C) 3ª Lei de Kepler.</p>
<p>D) 1ª Lei de Newton.</p>
<p>E) 3ª Lei de Newton.</p>
<div class="resolucao"><p>Marcos, ao frear, continuou em movimento e não parou junto com o carro. O fenômeno é explicado pela 1ª lei de Newton — a inércia mantém o corpo dele em movimento enquanto o carro desacelera.</p>
<p><strong>Resposta: D)</strong></p></div></aside>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'forcas-da-mecanica',
  'Forças da Mecânica',
  'fisica',
  'pas-uem',
  'Peso, normal, tração, atrito e elástica — as forças que aparecem em quase todo problema.',
  '<p>As principais forças da Mecânica. Quase todo problema de [[Leis de Newton]] começa por identificar quais delas atuam no corpo.</p>
<ul><li><p><strong>Força peso (P):</strong> força de atração da Terra sobre todos os corpos nas suas proximidades;</p>
<ul><li><p>Vertical, sempre apontando para o centro da Terra;</p></li>
<li><p>Sem a resistência do ar: <span data-type="inline-math" data-latex="P = m\,g"></span></p></li></ul></li>
<li><p><strong>Força normal (N):</strong> força que uma superfície exerce sobre um objeto para sustentá-lo, e para não ser atravessada;</p>
<ul><li><p>Perpendicular à superfície de contato;</p></li></ul></li>
<li><p><strong>Força de tração (T):</strong> transmitida por fios e cordas ideais;</p></li>
<li><p><strong>Força de atrito (F<sub>at</sub>):</strong> resiste ao deslizamento entre superfícies;</p>
<ul><li><p><strong>Cinético ou dinâmico:</strong> quando há movimento relativo entre as superfícies;</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{at} = \mu_c\,F_N"></span>, em que μ<sub>c</sub> é o coeficiente de atrito cinético;</p></li></ul></li>
<li><p><strong>Estático:</strong> quando não há movimento relativo entre as superfícies;</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{at}^{max} = \mu_e\,F_N"></span>, em que μ<sub>e</sub> é o coeficiente de atrito estático;</p></li></ul></li></ul></li>
<li><p><strong>Força elástica (F<sub>el</sub>):</strong> força restauradora exercida por corpos elásticos (molas, elásticos, arcos) quando deformados, comprimidos ou esticados além do seu comprimento natural;</p>
<ul><li><p>Sentido sempre oposto à força que causou a deformação;</p></li>
<li><p><strong>Lei de Hooke:</strong> <span data-type="inline-math" data-latex="F_{el} = k\,x"></span></p>
<ul><li><p><strong>k:</strong> constante elástica da mola, relativa à rigidez; quanto maior, mais difícil deformar;</p></li>
<li><p><strong>x:</strong> deformação, a diferença entre o comprimento atual e o comprimento natural;</p></li></ul></li>
<li><p>As molas podem ser associadas em…</p>
<ul><li><p>Série: <span data-type="inline-math" data-latex="\frac{1}{k_{eq}} = \frac{1}{k_1} + \frac{1}{k_2} + \dots + \frac{1}{k_n}"></span></p></li>
<li><p>Paralelo: <span data-type="inline-math" data-latex="k_{eq} = k_1 + k_2 + \dots + k_n"></span></p></li></ul></li></ul></li></ul>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'equilibrio',
  'Equilíbrio',
  'fisica',
  'pas-uem',
  'Ocorre quando a força resultante sobre um corpo é nula.',
  '<p>Há <strong>equilíbrio</strong> quando a resultante de todas as forças sobre um corpo é nula. Note que isso não significa parado: velocidade constante também é equilíbrio.</p>
<ul><li><p><strong>Estático:</strong> quando a velocidade vetorial é constante e igual a zero (v = 0);</p>
<ul><li><p><strong>Estável:</strong> ao deslocar o corpo de sua posição de equilíbrio, ele tende a voltar à posição inicial;</p></li>
<li><p><strong>Instável:</strong> ao deslocar o corpo de sua posição de equilíbrio, ele tende a se afastar ainda mais da posição inicial;</p></li>
<li><p><strong>Indiferente:</strong> ao deslocar o corpo de sua posição de equilíbrio, ele fica em equilíbrio na nova posição;</p></li></ul></li>
<li><p><strong>Dinâmico:</strong> quando a velocidade vetorial é constante e diferente de zero (v ≠ 0);</p>
<ul><li><p>Exemplo: movimento retilíneo uniforme;</p></li></ul></li></ul>
<p>Para um corpo extenso, força resultante nula não basta — ele ainda pode girar. Essa condição a mais está em [[Corpo rígido e máquinas]].</p>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'movimento-circular',
  'Movimento circular',
  'fisica',
  'pas-uem',
  'Analisa as forças que atuam sobre objetos em trajetórias curvas.',
  '<p>A <strong>dinâmica do movimento circular</strong> analisa as forças que atuam sobre objetos em trajetórias curvas. A chave é que a força centrípeta não é uma força nova: é o nome da resultante, que pode ser o atrito, a tração ou o peso — veja [[Forças da Mecânica]].</p>
<ul><li><p><strong>Aceleração centrípeta (a<sub>cp</sub>):</strong> altera a direção e o sentido do vetor velocidade, nunca o módulo;</p>
<ul><li><p><span data-type="inline-math" data-latex="a_{cp} = \frac{v^2}{r}"></span></p></li></ul></li>
<li><p><strong>Força centrípeta (F<sub>cp</sub>):</strong> força resultante responsável por mudar a direção e o sentido da velocidade do objeto;</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{cp} = m\,a_{cp} = \frac{m\,v^2}{r}"></span></p></li></ul></li>
<li><p><strong>Movimento em plano horizontal:</strong></p>
<ul><li><p><strong>Curva em perfil plano:</strong> quem faz a curva é o atrito;</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{cp} = F_{at} = \frac{m\,v^2}{r}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="v_{max} = \sqrt{\mu\,r\,g}"></span></p></li></ul></li>
<li><p><strong>Pista sobrelevada sem atrito:</strong></p>
<ul><li><p><span data-type="inline-math" data-latex="v = \sqrt{r\,g\,\tan\theta}"></span></p></li></ul></li>
<li><p><strong>Corpo preso a um fio:</strong></p>
<ul><li><p><span data-type="inline-math" data-latex="T = F_{cp} = \frac{m\,v^2}{r}"></span></p></li></ul></li></ul></li>
<li><p><strong>Movimento em plano vertical:</strong></p>
<ul><li><p><strong>Globo da morte:</strong> velocidade mínima no ponto mais alto;</p>
<ul><li><p><span data-type="inline-math" data-latex="v_{min} = \sqrt{r\,g}"></span></p></li></ul></li>
<li><p><strong>Lombada:</strong> <span data-type="inline-math" data-latex="F_N = P - F_{cp}"></span></p></li>
<li><p><strong>Depressão:</strong> <span data-type="inline-math" data-latex="F_N = F_{cp} + P"></span></p></li></ul></li></ul>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'plano-inclinado',
  'Plano inclinado',
  'fisica',
  'pas-uem',
  'Superfície plana inclinada em relação a um eixo horizontal.',
  '<p>O <strong>plano inclinado</strong> é uma superfície plana inclinada em relação a um eixo horizontal. O método é sempre o mesmo: decompor o peso em duas componentes, uma ao longo do plano e outra perpendicular a ele. As forças envolvidas estão em [[Forças da Mecânica]].</p>
<ul><li><p><strong>Componente ao longo do plano:</strong> <span data-type="inline-math" data-latex="P_x = P\operatorname{sen}\theta"></span> — é ela que puxa o corpo para baixo;</p></li>
<li><p><strong>Componente perpendicular:</strong> <span data-type="inline-math" data-latex="F_N = P_y = P\cos\theta"></span> — é ela que a normal equilibra;</p></li>
<li><p><strong>Aceleração sem atrito:</strong> <span data-type="inline-math" data-latex="a = g\operatorname{sen}\theta"></span></p>
<ul><li><p>Não depende da massa: dois corpos de massas diferentes descem o mesmo plano com a mesma aceleração;</p></li></ul></li></ul>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'quantidade-de-movimento',
  'Quantidade de movimento',
  'fisica',
  'pas-uem',
  'Mede a dificuldade de parar um corpo em movimento; conserva-se em toda colisão.',
  '<p>A <strong>quantidade de movimento (Q)</strong>, ou momento linear, é a grandeza vetorial que mede a dificuldade de parar um corpo em movimento.</p>
<ul><li><p><span data-type="inline-math" data-latex="Q = m\,v"></span></p></li>
<li><p>É diretamente proporcional à massa e à velocidade do corpo;</p></li>
<li><p><strong>Impulso (I):</strong> grandeza vetorial que mede a alteração da quantidade de movimento de um corpo devido à aplicação de uma força durante um intervalo de tempo;</p>
<ul><li><p><span data-type="inline-math" data-latex="I = F\,\Delta t"></span></p></li>
<li><p>É diretamente proporcional à força;</p></li></ul></li>
<li><p><strong>Teorema do impulso:</strong> <span data-type="inline-math" data-latex="I = \Delta Q"></span> — sai direto da 2ª lei de [[Leis de Newton]];</p>
<ul><li><p><span data-type="inline-math" data-latex="F = m\,a = \frac{m(v - v_0)}{t}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="F\,t = m(v - v_0)"></span></p></li></ul></li></ul>
<h2>Conservação</h2>
<ul><li><p><strong>Princípio da conservação da quantidade de movimento:</strong> em um sistema isolado, sem forças externas resultantes, a quantidade de movimento total antes de uma interação é igual à de depois;</p>
<ul><li><p><span data-type="inline-math" data-latex="Q_{antes} = Q_{depois}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="m_1 v_1 + m_2 v_2 = m_1 v_1^{\prime} + m_2 v_2^{\prime}"></span></p></li>
<li><p>Vale para qualquer tipo de colisão — o que muda entre elas é a energia cinética, não o momento;</p></li></ul></li></ul>
<h2>Colisões</h2>
<ul><li><p><strong>Colisão:</strong> interação entre dois ou mais corpos que altera a velocidade deles;</p>
<ul><li><p><strong>Coeficiente de restituição:</strong> <span data-type="inline-math" data-latex="e = \frac{v_b^{\prime} - v_a^{\prime}}{v_a - v_b}"></span></p></li>
<li><p><strong>Elástica:</strong> energia e quantidade de movimento se conservam; <span data-type="inline-math" data-latex="e = 1"></span></p></li>
<li><p><strong>Parcialmente elástica:</strong> a quantidade de movimento se conserva e há dissipação determinada de energia; <span data-type="inline-math" data-latex="0 &lt; e &lt; 1"></span></p></li>
<li><p><strong>Inelástica:</strong> a quantidade de movimento se conserva e a energia se dissipa ao máximo; <span data-type="inline-math" data-latex="e = 0"></span></p></li></ul></li></ul>
<aside class="questao"><p>(UFMS) A situação ilustrada representa uma colisão frontal entre dois corpos, ocorrida na Av. Mato Grosso, em Campo Grande-MS. Um estudante da Escola Estadual São José, localizada próximo ao acidente, fez a seguinte conclusão correta sobre o ocorrido:</p>
<p>A) os dois corpos tinham a mesma massa e velocidades de valores diferentes.</p>
<p>B) o corpo 1 tinha maior quantidade de movimento que o corpo 2.</p>
<p>C) a massa de 1 era maior que a massa de 2, e ambos tinham a mesma velocidade.</p>
<p>D) a quantidade de movimento dos dois corpos era exatamente igual.</p>
<p>E) foi um choque inelástico, e o corpo 2 tinha mais quantidade de movimento.</p>
<div class="resolucao"><p>Como se percebe na fórmula <span data-type="inline-math" data-latex="Q = m\,v"></span>, a quantidade de movimento varia em função da massa e da velocidade. Para que o corpo 1 tenha dominado a direção do movimento no sistema, ele precisava ter maior quantidade de movimento.</p>
<p><strong>Resposta: B)</strong></p></div></aside>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'trabalho-e-energia',
  'Trabalho e energia',
  'fisica',
  'pas-uem',
  'Trabalho, energia cinética e potencial, potência e a conservação da energia mecânica.',
  '<p><strong>Trabalho (τ):</strong> grandeza escalar que mede a energia transferida por uma força ao longo de um deslocamento.</p>
<ul><li><p><span data-type="inline-math" data-latex="\tau = F\,d\cos\theta"></span>, em que θ é o ângulo entre a força e o deslocamento;</p></li>
<li><p><strong>Motor (τ &gt; 0):</strong> quando 0° ≤ θ &lt; 90°, com a força a favor do movimento;</p></li>
<li><p><strong>Resistente (τ &lt; 0):</strong> quando 90° &lt; θ ≤ 180°, com a força contra o movimento;</p></li>
<li><p><strong>Nulo (τ = 0):</strong> quando θ = 90°, com a força perpendicular ao deslocamento;</p></li></ul>
<h2>Formas de energia</h2>
<ul><li><p><strong>Energia cinética (E<sub>c</sub>):</strong> energia associada ao movimento de um corpo;</p>
<ul><li><p><span data-type="inline-math" data-latex="E_c = \frac{m\,v^2}{2}"></span></p></li>
<li><p><strong>Teorema da energia cinética:</strong> <span data-type="inline-math" data-latex="\tau_{total} = \Delta E_c = E_{c,final} - E_{c,inicial}"></span></p></li></ul></li>
<li><p><strong>Energia potencial (E<sub>p</sub>):</strong> energia armazenada, associada à posição ou à deformação;</p>
<ul><li><p><strong>Gravitacional:</strong> <span data-type="inline-math" data-latex="E_p = m\,g\,h"></span></p></li>
<li><p><strong>Elástica:</strong> <span data-type="inline-math" data-latex="E_p = \frac{k\,x^2}{2}"></span> — a constante k é a mesma da Lei de Hooke, em [[Forças da Mecânica]];</p></li></ul></li>
<li><p><strong>Potência (Pot):</strong> taxa de realização de trabalho por unidade de tempo;</p>
<ul><li><p><span data-type="inline-math" data-latex="Pot = \frac{\tau}{\Delta t}"></span></p></li>
<li><p>Unidade no SI: watt (W);</p></li></ul></li></ul>
<h2>Conservação</h2>
<ul><li><p><strong>Forças conservativas:</strong> o trabalho realizado não depende da trajetória, apenas dos pontos inicial e final; o trabalho em um percurso fechado é nulo;</p>
<ul><li><p>Exemplos: peso, força elástica, força gravitacional;</p></li>
<li><p>Estão associadas a uma energia potencial;</p></li></ul></li>
<li><p><strong>Forças não conservativas (dissipativas):</strong> o trabalho depende da trajetória percorrida;</p>
<ul><li><p>Exemplos: atrito, resistência do ar;</p></li>
<li><p>Dissipam energia mecânica na forma de calor;</p></li></ul></li>
<li><p><strong>Princípio da conservação da energia mecânica:</strong> em um sistema onde atuam apenas forças conservativas, a energia mecânica total permanece constante;</p>
<ul><li><p><span data-type="inline-math" data-latex="E_m = E_c + E_p = \text{constante}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="E_{c,i} + E_{p,i} = E_{c,f} + E_{p,f}"></span></p></li>
<li><p>Com forças dissipativas, parte da energia vira calor e a energia mecânica final é menor: <span data-type="inline-math" data-latex="E_{m,i} = E_{m,f} + E_{dissipada}"></span></p></li></ul></li></ul>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'corpo-rigido-e-maquinas',
  'Corpo rígido e máquinas',
  'fisica',
  'pas-uem',
  'Centro de massa, torque e as máquinas simples que trocam força por deslocamento.',
  '<p>Até aqui os corpos foram tratados como pontos. Um <strong>corpo rígido</strong> tem extensão, então além de transladar ele pode girar — e isso exige uma condição de [[Equilíbrio]] a mais.</p>
<ul><li><p><strong>Sistema de partículas e centro de massa (CM):</strong> ponto que representa a posição média da massa de um sistema, ponderada pela distribuição de massa;</p>
<ul><li><p><span data-type="inline-math" data-latex="x_{CM} = \frac{m_1 x_1 + m_2 x_2 + \dots + m_n x_n}{m_1 + m_2 + \dots + m_n}"></span></p></li>
<li><p>Em corpos com distribuição de massa uniforme e forma simétrica, o CM coincide com o centro geométrico;</p></li>
<li><p>O movimento do CM obedece à 2ª lei de Newton como se toda a massa estivesse concentrada nele: <span data-type="inline-math" data-latex="F_{R,ext} = m_{total}\,a_{CM}"></span></p></li>
<li><p>Em uma explosão ou colisão sem forças externas, o CM do sistema mantém sua trajetória original;</p></li></ul></li>
<li><p><strong>Momento de uma força (torque, M):</strong> tendência de uma força em provocar rotação em torno de um eixo;</p>
<ul><li><p><span data-type="inline-math" data-latex="M = F\,d"></span>, em que d é o braço de alavanca — a distância perpendicular entre a linha de ação da força e o eixo de rotação;</p></li>
<li><p>Sentido horário e anti-horário devem ser convencionados com sinais opostos;</p></li></ul></li>
<li><p><strong>Condições de equilíbrio de um corpo rígido:</strong></p>
<ul><li><p><span data-type="inline-math" data-latex="\Sigma F = 0"></span> — equilíbrio de translação;</p></li>
<li><p><span data-type="inline-math" data-latex="\Sigma M = 0"></span> — equilíbrio de rotação;</p></li></ul></li></ul>
<h2>Máquinas simples</h2>
<ul><li><p><strong>Máquinas simples:</strong> dispositivos que alteram a intensidade, a direção ou o sentido de uma força, facilitando a realização de trabalho;</p>
<ul><li><p>Não multiplicam energia — apenas trocam força por deslocamento, ou o contrário;</p></li>
<li><p><strong>Polia fixa:</strong> muda apenas a direção da força aplicada, sem alterar sua intensidade; <span data-type="inline-math" data-latex="F = P"></span></p></li>
<li><p><strong>Polia móvel:</strong> reduz a força necessária pela metade, à custa de dobrar o deslocamento da corda; <span data-type="inline-math" data-latex="F = \frac{P}{2}"></span></p></li>
<li><p><strong>Associações de polias:</strong> quanto maior o número n de polias móveis, menor a força necessária; <span data-type="inline-math" data-latex="F = \frac{P}{2^n}"></span></p></li>
<li><p><strong>Alavancas:</strong> barra rígida que gira em torno de um ponto de apoio (fulcro), usada para ampliar força ou deslocamento;</p>
<ul><li><p>Condição de equilíbrio: <span data-type="inline-math" data-latex="F_{pot} \cdot d_{pot} = F_{res} \cdot d_{res}"></span></p></li></ul></li></ul></li></ul>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'gravitacao-e-kepler',
  'Gravitação e Kepler',
  'fisica',
  'pas-uem',
  'A força que rege a atração entre massas e as três leis do movimento planetário.',
  '<p>A <strong>Lei da Gravitação Universal</strong> descreve a atração entre quaisquer dois corpos com massa. Ela é o par ação-reação da 3ª lei em [[Leis de Newton]] em escala astronômica.</p>
<ul><li><p><span data-type="inline-math" data-latex="F = \frac{G\,M\,m}{d^2}"></span></p>
<ul><li><p><strong>M:</strong> massa maior, em kg;</p></li>
<li><p><strong>m:</strong> massa menor, em kg;</p></li>
<li><p><strong>d:</strong> distância entre os centros, em m;</p></li>
<li><p><strong>G:</strong> constante gravitacional, <span data-type="inline-math" data-latex="G = 6{,}67 \times 10^{-11}\ \mathrm{N}\cdot\mathrm{m}^2/\mathrm{kg}^2"></span></p></li></ul></li>
<li><p>A força gravitacional…</p>
<ul><li><p>sempre é atrativa;</p></li>
<li><p>é diretamente proporcional ao produto das massas;</p></li>
<li><p>é inversamente proporcional ao quadrado da distância;</p></li></ul></li>
<li><p><strong>Campo gravitacional (g):</strong> região do espaço ao redor de um corpo massivo onde outro corpo sofre a ação da força gravitacional;</p>
<ul><li><p><span data-type="inline-math" data-latex="g = \frac{G\,M}{d^2}"></span></p></li>
<li><p>Na superfície de um planeta, g equivale à aceleração da gravidade local;</p></li>
<li><p>É inversamente proporcional ao quadrado da distância — por isso g diminui com a altitude;</p></li></ul></li></ul>
<h2>Leis de Kepler</h2>
<ul><li><p><strong>1ª lei (das órbitas):</strong> os planetas se movem em órbitas elípticas ao redor do Sol, que ocupa um dos focos da elipse;</p></li>
<li><p><strong>2ª lei (das áreas):</strong> a linha imaginária que liga um planeta ao Sol varre áreas iguais em tempos iguais;</p>
<ul><li><p>Consequência: o planeta é mais rápido quando está mais perto do Sol;</p></li></ul></li>
<li><p><strong>3ª lei (dos períodos):</strong> o quadrado do período de revolução de um planeta é proporcional ao cubo do raio médio da órbita;</p>
<ul><li><p><span data-type="inline-math" data-latex="\frac{T_A^2}{r_A^3} = \frac{T_B^2}{r_B^3}"></span></p></li></ul></li></ul>',
  (select id from resumos where slug = 'dinamica')
)
on conflict (slug) do nothing;

-- ============================================
-- 3. Refaz as conexões
-- ============================================
-- O trigger `trg_sync_conexoes_resumo` resolve cada [[wikilink]] procurando um
-- resumo com aquele TÍTULO, e roda no momento do insert. Como os resumos
-- entraram em sequência, todo link que aponta para um irmão inserido depois não
-- achou destino e foi descartado em silêncio.
--
-- Este update vazio dispara o trigger de novo, agora com os dez já no banco.
-- É o mesmo remédio anotado no fim do schema.sql.
update resumos set corpo = corpo where materia_slug = 'fisica';

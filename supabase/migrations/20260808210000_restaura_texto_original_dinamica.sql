-- Devolve à Dinâmica o texto que o autor escreveu.
--
-- A migration anterior (20260808143000) foi apresentada como transporte do
-- Google Docs e não foi isso: ela reescreveu o material. Acrescentou umas quinze
-- frases explicativas que não existiam no original, cortou definições de termos
-- das fórmulas, renomeou itens ("Cinético/dinâmico" virou "Cinético ou
-- dinâmico", "1º Lei de Kepler" virou "1ª lei (das órbitas)"), inventou títulos
-- de seção ("Conservação", "Colisões", "Formas de energia", "Máquinas simples")
-- e apagou, sem avisar, a linha "depende do meio onde os corpos estão" da lista
-- de propriedades da força gravitacional.
--
-- O resumo é do autor e é ele quem responde por ele na frente dos alunos.
-- Julgar o conteúdo não era decisão a tomar em silêncio.
--
-- Esta migration devolve os dez corpos ao texto do documento, palavra por
-- palavra, inclusive onde o original tem um deslize de digitação ("A molas
-- podem ser associadas em…", "1º Lei de Kepler" com ordinal masculino). Corrigir
-- também seria mudar o texto; se o autor quiser, corrige pelo editor.
--
-- ## O que continua sendo decisão de estrutura, e por isso fica
--
-- A divisão em dez resumos ligados por `pai_id`, o bloco de questão resolvida e
-- as fórmulas como nó do editor foram combinados antes e permanecem. O que sai
-- é texto inventado, não estrutura.
--
-- ## Consequência: as conexões somem
--
-- Os oito [[wikilinks]] da versão anterior estavam todos dentro de frases
-- escritas por mim. Sem elas não sobra nenhum, e o trigger
-- `trg_sync_conexoes_resumo` vai zerar as conexões destes dez resumos no
-- próximo update — o grafo passa a mostrar só a árvore de contenção. Links
-- podem ser acrescentados pelo editor quando o autor quiser.
--
-- ## Definições curtas
--
-- `definicao` (o balão do mapa) recebe a própria definição do documento, quando
-- existe uma frase que serve. Nos quatro resumos que juntam vários tópicos do
-- original — forças, trabalho e energia, corpo rígido, gravitação — fica vazia,
-- em vez de eu escrever uma. Sem definição o nó simplesmente não ganha balão.

update resumos set
  definicao = 'Estuda o movimento dos corpos e as causas que os produzem ou modificam.',
  corpo = '<ul><li><p><strong>Dinâmica:</strong> estuda o movimento dos corpos e as causas que os produzem ou modificam;</p>
<ul><li><p><strong>Referencial inercial:</strong> sistema de referência em relação ao qual um corpo livre de forças (ou com resultante nula) permanece em repouso ou em MRU;</p>
<ul><li><p>Todo referencial em repouso ou em MRU em relação a um referencial inercial também é inercial;</p></li>
<li><p>A Terra é considerada, na prática, um referencial inercial (aproximação válida para a maioria dos problemas de vestibular);</p></li></ul></li></ul></li></ul>'
where slug = 'dinamica';

update resumos set
  definicao = 'Definem o comportamento dos corpos em resposta às forças aplicadas.',
  corpo = '<ul><li><p><strong>Leis de Newton:</strong> definem o comportamento dos corpos em resposta às forças aplicadas;</p>
<ul><li><p><strong>1ª lei de Newton (Lei da Inércia):</strong> todo corpo em repouso ou em movimento retilíneo uniforme continua nesses estados, desde que seja nula a resultante das forças que nele atua;</p></li>
<li><p><strong>2ª lei de Newton (Princípio Fundamental da Dinâmica):</strong> <span data-type="inline-math" data-latex="F_R = ma"></span></p>
<ul><li><p>A aceleração e a força resultante devem ter obrigatoriamente mesma direção e sentido;</p></li></ul></li>
<li><p><strong>3ª Lei de Newton (Ação e reação):</strong> se um corpo A exerce uma força de módulo F<sub>1</sub> em um corpo B, então o corpo B exerce uma força de módulo F<sub>2</sub> em A, tal que: <span data-type="inline-math" data-latex="F_2 = -F_1"></span></p>
<ul><li><p>Mesmo módulo, mesma direção, sentidos contrários e atuam em corpos diferentes;</p></li></ul></li>
<li><p>Questão resolvida:</p></li></ul></li></ul>
<aside class="questao"><p>(UFMS) Marcos está sem cinto de segurança, em uma via simples, a 108 km/h, quando observa um guarda de trânsito com um radar móvel. Instantaneamente, ele aciona os freios de seu carro e percebe que sua barriga toca no volante do veículo. Refletindo sobre sua aula de Física, percebe corretamente que a explicação é devido à:</p>
<p>A) 1ª Lei de Kepler.</p>
<p>B) 2ª Lei de Kepler.</p>
<p>C) 3ª Lei de Kepler.</p>
<p>D) 1ª Lei de Newton.</p>
<p>E) 3ª Lei de Newton</p>
<div class="resolucao"><p>Resolução: Marcos, ao frear, continuou em movimento e não parou junto com o carro. Este fenômeno é explicado pela 1ª lei de Newton. D)</p></div></aside>'
where slug = 'leis-de-newton';

update resumos set
  definicao = '',
  corpo = '<ul><li><p><strong>Principais forças da Mecânica:</strong></p>
<ul><li><p>Força peso (F<sub>P</sub>) (P): força de atração da Terra sobre todos os corpos nas suas proximidades;</p>
<ul><li><p>Vertical, sempre para o centro da Terra;</p></li>
<li><p>Sem a resistência do ar, <span data-type="inline-math" data-latex="P = mg"></span></p></li></ul></li>
<li><p>Força normal (F<sub>N</sub>) (N): força que uma superfície exerce sobre um objeto para sustentá-lo (e não ser atravessada);</p>
<ul><li><p>Perpendicular à superfície de contato;</p></li></ul></li>
<li><p>Força de tração (F<sub>T</sub>) (T): transmitida por fios/cordas ideais;</p></li>
<li><p>Força de atrito (F<sub>at</sub>):</p>
<ul><li><p><strong>Cinético/dinâmico:</strong> quando há movimento relativo entre as superfícies (deslizamento);</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{at} = \mu_c F_N"></span></p>
<ul><li><p>μ<sub>c</sub>: coeficiente de atrito cinético;</p></li></ul></li></ul></li>
<li><p><strong>Estático:</strong> quando não há movimento relativo entre as superfícies;</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{at\,max} = \mu_e F_N"></span></p>
<ul><li><p>μ<sub>e</sub>: coeficiente de atrito estático;</p></li></ul></li></ul></li></ul></li>
<li><p>Força elástica (F<sub>el</sub>): força restauradora exercida por corpos elásticos (molas, elásticos, arcos) quando deformados — comprimidos ou esticados além do seu comprimento natural;</p>
<ul><li><p>Sentido sempre oposto à força que causou a deformação;</p></li>
<li><p>Calculada pela Lei de Hooke: <span data-type="inline-math" data-latex="F_{el} = kx"></span></p>
<ul><li><p>F<sub>el</sub>: módulo da força elástica;</p></li>
<li><p>k: constante elástica da mola; relativo à rigidez; quanto maior é, mais difícil deformar;</p></li>
<li><p>x: deformação, diferença entre o comprimento atual e o comprimento natural;</p></li></ul></li>
<li><p>A molas podem ser associadas em…</p>
<ul><li><p>Série: <span data-type="inline-math" data-latex="\frac{1}{k_{eq}} = \frac{1}{k_1} + \frac{1}{k_2} + ... + \frac{1}{k_n}"></span></p></li>
<li><p>Paralelo: <span data-type="inline-math" data-latex="k_{eq} = k_1 + k_2 + ... + k_n"></span></p></li></ul></li></ul></li></ul></li></ul>'
where slug = 'forcas-da-mecanica';

update resumos set
  definicao = 'Ocorre quando a força resultante de todas as forças sobre um corpo é nula.',
  corpo = '<ul><li><p><strong>Equilíbrio:</strong> ocorre quando a força resultante de todas as forças sobre um corpo é nula;</p>
<ul><li><p>Estático: quando a velocidade vetorial é constante e igual a zero (v=0);</p>
<ul><li><p>Estável: ao deslocar o corpo de sua posição de equilíbrio, ele tende a voltar à sua posição inicial;</p></li>
<li><p>Instável: ao deslocar o corpo de sua posição de equilíbrio, ele tende a se afastar mais ainda da sua posição inicial;</p></li>
<li><p>Indiferente: ao deslocar o corpo de sua posição de equilíbrio, ele fica em equilíbrio na nova posição;</p></li></ul></li>
<li><p>Dinâmico: quando a velocidade vetorial é constante e diferente de zero (v≠0);</p>
<ul><li><p>Ex: movimento retilíneo uniforme;</p></li></ul></li></ul></li></ul>'
where slug = 'equilibrio';

update resumos set
  definicao = 'Analisa as forças que atuam sobre objetos em trajetórias curvas (movimentos curvilíneos).',
  corpo = '<ul><li><p><strong>Dinâmica do movimento circular:</strong> analisa as forças que atuam sobre objetos em trajetórias curvas (movimentos curvilíneos);</p>
<ul><li><p>Aceleração centrípeta: altera a direção e sentido do vetor velocidade;</p>
<ul><li><p><span data-type="inline-math" data-latex="a_{cp} = \frac{v^2}{r}"></span></p></li></ul></li>
<li><p>Força (resultante) centrípeta (F<sub>cp</sub>): força resultante responsável por mudar a direção e sentido da velocidade do objeto;</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{cp} = ma_{cp} = \frac{mv^2}{r}"></span></p></li></ul></li>
<li><p>Movimento em plano horizontal:</p>
<ul><li><p>Curva em perfil plano:</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{cp} = F_{at} = \frac{mv^2}{r}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="v_{\text{máx}} = \sqrt{\mu rg}"></span></p></li></ul></li>
<li><p>Movimento em pista sobrelevada sem atrito:</p>
<ul><li><p><span data-type="inline-math" data-latex="v = \sqrt{rg\tan\theta}"></span></p></li></ul></li>
<li><p>Corpo preso a um fio:</p>
<ul><li><p><span data-type="inline-math" data-latex="T = F_{cp} = \frac{mv^2}{r}"></span></p></li></ul></li></ul></li>
<li><p>Movimento em plano vertical:</p>
<ul><li><p>Globo da morte:</p>
<ul><li><p><span data-type="inline-math" data-latex="v_{min} = \sqrt{rg}"></span></p></li></ul></li>
<li><p>Lombada:</p>
<ul><li><p><span data-type="inline-math" data-latex="F_N = P - F_{cp}"></span></p></li></ul></li>
<li><p>Depressão:</p>
<ul><li><p><span data-type="inline-math" data-latex="F_N = F_{cp} + P"></span></p></li></ul></li></ul></li></ul></li></ul>'
where slug = 'movimento-circular';

update resumos set
  definicao = 'Superfície plana inclinada em relação a um eixo horizontal.',
  corpo = '<ul><li><p><strong>Plano inclinado:</strong> superfície plana inclinada em relação a um eixo horizontal;</p>
<ul><li><p><span data-type="inline-math" data-latex="P_x = P\operatorname{sen}\theta"></span></p></li>
<li><p><span data-type="inline-math" data-latex="F_N = P_y = P\cos\theta"></span></p></li>
<li><p><span data-type="inline-math" data-latex="a = g\operatorname{sen}\theta"></span></p></li></ul></li></ul>'
where slug = 'plano-inclinado';

update resumos set
  definicao = 'Grandeza física vetorial que mede a dificuldade de parar um corpo em movimento.',
  corpo = '<ul><li><p><strong>Quantidade de movimento (Q) (momento linear):</strong> grandeza física vetorial que mede a dificuldade de parar um corpo em movimento;</p>
<ul><li><p><span data-type="inline-math" data-latex="Q = mv"></span></p></li>
<li><p>É diretamente proporcional a…</p>
<ul><li><p>massa (m) do corpo;</p></li>
<li><p>velocidade (v) do corpo;</p></li></ul></li>
<li><p><strong>Impulso (I):</strong> grandeza vetorial que mede a alteração da quantidade de movimento (Q) de um corpo devido à aplicação de uma força durante um intervalo de tempo;</p>
<ul><li><p><span data-type="inline-math" data-latex="I = F\Delta t"></span></p>
<ul><li><p>F: força;</p></li>
<li><p>Δt: variação de tempo;</p></li></ul></li>
<li><p>É diretamente proporcional à força;</p></li></ul></li>
<li><p><strong>Teorema do impulso:</strong> <span data-type="inline-math" data-latex="I = \Delta Q"></span></p>
<ul><li><p><span data-type="inline-math" data-latex="F = ma"></span></p></li>
<li><p><span data-type="inline-math" data-latex="F = \frac{m(V - V_0)}{t}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="Ft = m(V - V_0)"></span></p></li></ul></li></ul></li>
<li><p><strong>Princípio da conservação da quantidade de movimento linear:</strong> em um sistema isolado (sem forças externas resultantes), a quantidade de movimento total antes de uma interação é igual à quantidade de movimento total depois;</p>
<ul><li><p><span data-type="inline-math" data-latex="Q_{antes} = Q_{depois}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="m_1v_1 + m_2v_2 = m_1v_1^{\prime} + m_2v_2^{\prime}"></span></p></li>
<li><p>Válido para qualquer tipo de colisão (elástica, inelástica ou parcialmente elástica) — o que muda é a energia cinética, não o momento;</p></li></ul></li>
<li><p><strong>Colisão:</strong> interação entre dois corpos ou mais que altera a velocidade dos corpos;</p>
<ul><li><p>Coeficiente de restituição:</p>
<ul><li><p><span data-type="inline-math" data-latex="e = \frac{V_b^{\prime} - V_a^{\prime}}{V_a - V_b}"></span></p></li></ul></li>
<li><p>Elástica: energia e quantidade de movimento se conservam;</p>
<ul><li><p><span data-type="inline-math" data-latex="e = 1"></span></p></li></ul></li>
<li><p>Parcialmente elástica/inelástica: a quantidade de movimento se conserva e dissipação determinada da energia;</p>
<ul><li><p><span data-type="inline-math" data-latex="0 &lt; e &lt; 1"></span></p></li></ul></li>
<li><p>Inelástica: quantidade de movimento se conserva e a energia se dissipa ao máximo;</p>
<ul><li><p><span data-type="inline-math" data-latex="e = 0"></span></p></li></ul></li>
<li><p>Questão resolvida:</p></li></ul></li></ul>
<aside class="questao"><p>(UFMS) A situação ilustrada a seguir representa uma colisão frontal entre dois corpos, ocorrida na Av. Mato Grosso, em Campo Grande-MS. Um estudante da Escola Estadual São José, localizada próximo ao acidente, fez a seguinte conclusão correta sobre o ocorrido:</p>
<p>A) os dois corpos tinham a mesma massa e velocidades de valores diferentes.</p>
<p>B) o corpo 1 tinha maior quantidade de movimento que o corpo 2.</p>
<p>C) a massa de 1 era maior que a massa de 2, e ambos tinham a mesma velocidade.</p>
<p>D) a quantidade de movimento dos dois corpos era exatamente igual.</p>
<p>E) foi um choque inelástico, e o corpo 2 tinha mais quantidade de movimento.</p>
<div class="resolucao"><p>Resolução: Como se pode perceber na fórmula (Q=mv), a quantidade de movimento varia em função da massa e da velocidade, portanto, para que o corpo 1 tenha dominado a direção do movimento no sistema, ele deveria ter maior quantidade de movimento e, assim, maior massa e maior velocidade. B)</p></div></aside>'
where slug = 'quantidade-de-movimento';

update resumos set
  definicao = '',
  corpo = '<ul><li><p><strong>Trabalho (τ):</strong> grandeza escalar que mede a energia transferida por uma força ao longo de um deslocamento;</p>
<ul><li><p><span data-type="inline-math" data-latex="\tau = Fd\cos\theta"></span></p>
<ul><li><p>F: módulo da força;</p></li>
<li><p>d: deslocamento;</p></li>
<li><p>θ: ângulo entre a força e o deslocamento;</p></li></ul></li>
<li><p>Motor (τ&gt;0): quando 0°≤θ&lt;90° (força a favor do movimento);</p></li>
<li><p>Resistente (τ&lt;0): quando 90°&lt;θ≤180° (força contra o movimento);</p></li>
<li><p>Nulo (τ=0): quando θ=90° (força perpendicular ao deslocamento);</p></li></ul></li>
<li><p><strong>Energia cinética (E<sub>c</sub>):</strong> energia associada ao movimento de um corpo;</p>
<ul><li><p><span data-type="inline-math" data-latex="E_c = \frac{mv^2}{2}"></span></p></li>
<li><p>Teorema da energia cinética (trabalho-energia): <span data-type="inline-math" data-latex="\tau_{total} = \Delta E_c = E_{c\,final} - E_{c\,inicial}"></span></p></li></ul></li>
<li><p><strong>Energia potencial (E<sub>p</sub>):</strong></p>
<ul><li><p>Gravitacional: energia associada à posição de um corpo em um campo gravitacional;</p>
<ul><li><p><span data-type="inline-math" data-latex="E_p = mgh"></span></p></li></ul></li>
<li><p>Elástica: energia armazenada em um corpo elástico deformado;</p>
<ul><li><p><span data-type="inline-math" data-latex="E_p = \frac{kx^2}{2}"></span></p></li></ul></li></ul></li>
<li><p><strong>Potência (Pot):</strong> taxa de realização de trabalho (ou transferência de energia) por unidade de tempo;</p>
<ul><li><p><span data-type="inline-math" data-latex="Pot = \frac{\tau}{\Delta t}"></span></p></li>
<li><p>Unidade SI: watt (W);</p></li></ul></li>
<li><p><strong>Forças conservativas:</strong> o trabalho realizado não depende da trajetória, apenas dos pontos inicial e final; o trabalho em um percurso fechado é nulo;</p>
<ul><li><p>Ex: peso, força elástica, força gravitacional;</p></li>
<li><p>Estão associadas a uma energia potencial;</p></li></ul></li>
<li><p><strong>Forças não conservativas (dissipativas):</strong> o trabalho depende da trajetória percorrida;</p>
<ul><li><p>Ex: atrito, resistência do ar;</p></li>
<li><p>Dissipam energia mecânica na forma de calor;</p></li></ul></li>
<li><p><strong>Princípio da conservação da energia mecânica:</strong> em um sistema onde atuam apenas forças conservativas, a energia mecânica total permanece constante;</p>
<ul><li><p><span data-type="inline-math" data-latex="E_m = E_c + E_p = constante"></span></p></li>
<li><p><span data-type="inline-math" data-latex="E_{c\,inicial} + E_{p\,inicial} = E_{c\,final} + E_{p\,final}"></span></p></li>
<li><p>Quando há forças dissipativas (atrito), parte da energia mecânica se converte em calor e a energia mecânica final é menor:</p>
<ul><li><p><span data-type="inline-math" data-latex="E_{m\,inicial} = E_{m\,final} + E_{dissipada}"></span></p></li></ul></li></ul></li></ul>'
where slug = 'trabalho-e-energia';

update resumos set
  definicao = '',
  corpo = '<ul><li><p><strong>Sistema de partículas e centro de massa (CM):</strong> ponto que representa a posição média da massa de um sistema de partículas, ponderada pela distribuição de massa;</p>
<ul><li><p><span data-type="inline-math" data-latex="x_{CM} = \frac{m_1x_1 + m_2x_2 + ... + m_nx_n}{m_1 + m_2 + ... + m_n}"></span></p></li>
<li><p>Em corpos com distribuição de massa uniforme e forma simétrica, o CM coincide com o centro geométrico;</p></li>
<li><p>O movimento do CM de um sistema de partículas obedece à 2ª Lei de Newton como se toda a massa do sistema estivesse concentrada nele:</p>
<ul><li><p><span data-type="inline-math" data-latex="F_{R\,ext} = m_{total}\,a_{CM}"></span></p></li></ul></li>
<li><p>Em uma explosão ou colisão sem forças externas, o CM do sistema mantém sua trajetória original;</p></li></ul></li>
<li><p><strong>Equilíbrio de corpo rígido:</strong> além da força resultante nula (ΣF=0), exige que o momento (torque) resultante também seja nulo;</p>
<ul><li><p>Momento de uma força (torque) (M): tendência de uma força em provocar rotação em torno de um eixo;</p>
<ul><li><p><span data-type="inline-math" data-latex="M = Fd"></span></p>
<ul><li><p>F: força aplicada;</p></li>
<li><p>d: braço de alavanca (distância perpendicular entre a linha de ação da força e o eixo de rotação);</p></li></ul></li>
<li><p>Sentido horário e anti-horário devem ser convencionados com sinais opostos;</p></li></ul></li>
<li><p>Condições de equilíbrio de um corpo rígido:</p>
<ul><li><p><span data-type="inline-math" data-latex="\Sigma F = 0"></span> (equilíbrio de translação);</p></li>
<li><p><span data-type="inline-math" data-latex="\Sigma M = 0"></span> (equilíbrio de rotação);</p></li></ul></li></ul></li>
<li><p><strong>Polias e máquinas simples:</strong> dispositivos que alteram a intensidade, direção ou sentido de uma força, facilitando a realização de trabalho;</p>
<ul><li><p>Não multiplicam energia — apenas trocam força por deslocamento (ou vice-versa);</p></li>
<li><p>Polia fixa: muda apenas a direção da força aplicada; não altera sua intensidade;</p>
<ul><li><p><span data-type="inline-math" data-latex="F = P"></span></p></li></ul></li>
<li><p>Polia móvel: reduz a força necessária pela metade, à custa de dobrar o deslocamento da corda;</p>
<ul><li><p><span data-type="inline-math" data-latex="F = \frac{P}{2}"></span></p></li></ul></li>
<li><p>Sistemas de polias (associações): quanto maior o número de polias móveis (n), menor a força necessária;</p>
<ul><li><p><span data-type="inline-math" data-latex="F = \frac{P}{2^n}"></span> (para associações ideais simples)</p></li></ul></li>
<li><p>Alavancas: barra rígida que gira em torno de um ponto de apoio (fulcro), usada para ampliar força ou deslocamento;</p>
<ul><li><p>Condição de equilíbrio: <span data-type="inline-math" data-latex="F_{\text{potência}} \cdot d_{\text{potência}} = F_{\text{resistência}} \cdot d_{\text{resistência}}"></span></p></li></ul></li></ul></li></ul>'
where slug = 'corpo-rigido-e-maquinas';

update resumos set
  definicao = '',
  corpo = '<ul><li><p><strong>Lei da Gravitação Universal:</strong></p>
<ul><li><p><span data-type="inline-math" data-latex="F = \frac{GMm}{d^2}"></span></p>
<ul><li><p>F: força gravitacional (N);</p></li>
<li><p>M: massa maior (kg);</p></li>
<li><p>m: massa menor (kg);</p></li>
<li><p>d: distância (m);</p></li>
<li><p>G: constante gravitacional;</p>
<ul><li><p><span data-type="inline-math" data-latex="G = 6{,}67 \times 10^{-11}\ \mathrm{N} \cdot \mathrm{m}^2/\mathrm{kg}^2"></span></p></li></ul></li></ul></li>
<li><p>A força gravitacional…</p>
<ul><li><p>sempre é uma força atrativa;</p></li>
<li><p>é diretamente proporcional ao produto das massas;</p></li>
<li><p>é inversamente proporcional ao quadrado das distâncias;</p></li>
<li><p>depende do meio onde os corpos estão;</p></li></ul></li>
<li><p><strong>Campo gravitacional (g):</strong> região do espaço ao redor de um corpo massivo onde outro corpo sofre a ação da força gravitacional;</p>
<ul><li><p><span data-type="inline-math" data-latex="g = \frac{GM}{d^2}"></span></p>
<ul><li><p>g: intensidade do campo gravitacional (m/s²);</p></li>
<li><p>M: massa do corpo que gera o campo;</p></li>
<li><p>d: distância ao centro do corpo que gera o campo;</p></li></ul></li>
<li><p>Na superfície de um planeta, g equivale à aceleração da gravidade local;</p></li>
<li><p>É inversamente proporcional ao quadrado da distância — por isso g diminui com a altitude;</p></li></ul></li></ul></li>
<li><p><strong>Leis de Kepler:</strong> três leis fundamentais que descrevem o movimento dos planetas ao redor do Sol;</p>
<ul><li><p>1º Lei de Kepler: os planetas se movem em órbitas elípticas ao redor do Sol, que ocupa um dos focos da elipse;</p></li>
<li><p>2º Lei de Kepler: a linha imaginária que liga um planeta ao Sol varre áreas iguais em tempos iguais;</p></li>
<li><p>3º Lei de Kepler: o quadrado do período de revolução de um planeta (tempo que leva para dar uma volta completa em torno do Sol) é proporcional ao cubo da distância média (raio) entre o planeta e o Sol;</p>
<ul><li><p><span data-type="inline-math" data-latex="\frac{T_A^2}{r_A^3} = \frac{T_B^2}{r_B^3}"></span></p></li></ul></li></ul></li></ul>'
where slug = 'gravitacao-e-kepler';

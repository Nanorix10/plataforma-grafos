-- Importa o que faltava do documento-mestre de Física, vindo de "Materias e
-- conteúdos feitos/Física.docx": a hidrostática, a acústica e os pedaços que os
-- resumos já publicados não tinham.
--
-- Nove resumos novos, quatro figuras e quatro `update`. `processo_slug =
-- 'comum'`, como as outras matérias vindas dos documentos-mestre (decisão 1c) —
-- e é o certo aqui de novo: o efeito Doppler é cobrado tanto pelo PASSE
-- ("Espectroscopia e efeito Doppler aplicada aos corpos celestes") quanto pela
-- 2ª etapa do PAS UEM, e a hidrostática também.
--
-- É a oitava e última matéria do recorte por disciplina que tem conteúdo. Sobra
-- a Matemática, que tem treze linhas.
--
-- ## Esta matéria é o contrário da Química
--
-- Lá, metade do documento era novidade. Aqui, dos trinta tópicos de nível 0,
-- **catorze já estão publicados e o documento não acrescenta uma linha a eles**
-- — força de atrito, resultante centrípeta, atrito em curva, pista sobrelevada,
-- plano vertical, movimentos verticais, energia cinética, energia potencial
-- gravitacional, leis de Kepler, gravitação universal, quantidade de movimento,
-- impulso de força constante, teorema do impulso e colisão.
--
-- O que sobra se divide em três:
--
-- - **nove tópicos novos**, e dois deles são áreas inteiras que o site não
--   tinha: a hidrostática (densidade, pressão, vasos comunicantes, Pascal) e a
--   acústica (efeito Doppler e nível sonoro);
-- - **um tópico parcialmente novo**, "Movimentos de rotação", que só acrescenta
--   três coisas ao `movimento-circular` — ver abaixo;
-- - **cinco questões resolvidas** dentro de tópicos já publicados, que a
--   importação da 1ª etapa do PAS UEM não trouxe porque não estavam lá.
--
-- ## "Movimentos de rotação" NÃO virou resumo
--
-- Ele traz `ω=2πf`, `v=2πrf`, a conversão rpm/Hz e a relação de polias
-- não-concêntricas. As duas primeiras já estão em `movimento-circular` — a
-- primeira como `f=1/T=ω/2π`, que é a mesma coisa escrita ao contrário. Um
-- resumo separado com quatro linhas competiria com um de 2.294 caracteres que
-- cobre rotação a fundo, e o aluno teria dois nós no mapa para o mesmo assunto.
--
-- Então o que ele tem de novo — `v=2πrf`, a conversão de unidade e as polias —
-- entra dentro do `movimento-circular`, e o resto não entra.
--
-- ## A conferência, e a armadilha nova que ela achou
--
-- A lição da Química ("comparar conteúdo, não contagem de tags") não bastou
-- aqui, e por pouco. Comparado o TEXTO dos trinta tópicos contra o texto dos
-- vinte e um resumos publicados, "Movimentos de rotação" aparecia como 100%
-- novo. Estava errado: eu tinha removido as tags do HTML para comparar, e **o
-- LaTeX mora dentro do atributo `data-latex`** — sai junto com a tag. Foi
-- preciso extrair as fórmulas à parte para ver que `f=1/T=ω/2π` já estava lá.
--
-- Corolário para a próxima matéria: **em Física, comparar só o texto é comparar
-- metade.** São 226 fórmulas no documento contra 150 já publicadas.
--
-- Um falso positivo do outro lado, pelo mesmo descuido: sondei "Princípio de
-- Pascal" pela palavra "Pascal" e deu casado — porque `pascal (Pa)` é a unidade
-- de pressão listada na tabela de `grandezas-fisicas`.
--
-- ## As figuras deste documento estão ancoradas na seção ANTERIOR
--
-- E é sistemático, não um caso isolado:
--
-- - a figura do lançamento oblíquo (o canhão) está ancorada na última linha do
--   exercício do lançamento **horizontal**;
-- - a figura do trabalho (a pessoa puxando o bloco, com `F`, `θ`, `F cos θ` e
--   `d` marcados) está ancorada na última linha do exercício do lançamento
--   **oblíquo**.
--
-- As duas primeiras já estão publicadas com o nome certo, então o estrago ficou
-- só na leitura. A do trabalho é nova e entra em `trabalho-e-energia`, ao lado
-- da definição que ela ilustra — que é onde ela estaria se o autor a tivesse
-- ancorado um parágrafo adiante.
--
-- ## Quatro figuras novas
--
-- 1,01 MB no documento, 78 KB no repositório em WebP q82. As quatro outras
-- âncoras do documento (atrito, lançamento horizontal, lançamento oblíquo e a
-- lei das áreas) já estão no repositório desde agosto — conferidas pelas
-- dimensões, batem pixel a pixel.
--
-- **Duas delas são fotos de caderno.** A questão dos vasos comunicantes e o
-- esboço da prensa hidráulica são manuscritos fotografados, não diagramas como
-- o resto do acervo. Entram porque carregam conteúdo que não existe em outro
-- lugar: no caso dos vasos comunicantes, a resolução inteira só existe ali —
-- o texto do documento diz "Questão resolvida:" e passa direto para a imagem.
-- **Vale avisar o autor**, porque é o tipo de coisa que ele pode querer
-- redigitar.
--
-- ## O "rpm ⇄ Hz" virou texto
--
-- A quinta âncora de `movimentos-de-rotação` é um retângulo de fundo branco com
-- "rpm ⇄ Hz" e as setas ÷60 e ×60. É conversão de unidade escrita como desenho;
-- entra como duas linhas de texto, pela mesma razão que a Química converteu os
-- prints de tabela — print não se seleciona, não rola no celular e acende no
-- tema escuro.
--
-- ## O que eu NÃO trouxe, por decisão do autor
--
-- Em "Movimento uniformemente variado" as três funções horárias vêm com
-- mnemônicos que o autor escreveu para si ("sorvetão", "vovô ateu" e um terceiro
-- para a equação de Torricelli). As fórmulas já estão publicadas em
-- `movimentos-retilineos`; perguntado em 2026-08-24, ele escolheu que os
-- apelidos ficassem só no documento dele.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"[dβ]"**, com beta no lugar do B, nas duas fórmulas do nível sonoro. A
--   unidade é o decibel, dB.
-- - **"J = N/m"** em Trabalho — joule é newton VEZES metro, não dividido.
--   Este não entra, porque o tópico de trabalho já está publicado e a linha
--   errada ficaria sozinha; fica o registro. **Vale avisar o autor.**
-- - **"Em uma local onde g = 10m/s²"**, na questão da pressão absoluta.
-- - **"pesco tapa"**, o apelido que o autor dá à propriedade do logaritmo de
--   potência, na resolução do nível sonoro. Este entra: está no meio da
--   resolução e tirá-lo deixaria o passo sem explicação.
-- - **"massa específica … 'mesma' coisa da densidade"**, com as aspas do autor.
--
-- Uma linha do documento NÃO entrou por ser repetição, não por erro: "se houver
-- uma força oposta (180°) ao movimento, o cosseno desta será -1" diz o mesmo que
-- o "Resistente (t<0): quando 90<t<=180 (forca contra o movimento)" que
-- `trabalho-e-energia` ja publica.
--
-- Os nós de fórmula passaram pelo KaTeX antes de entrar — e desta vez o
-- validador precisou ser consertado primeiro. Ele procurava a classe
-- `katex-error`, que o modo não-estrito NÃO emite: ali o erro é marcado pela
-- COR do `errorColor`. Com o cheque errado, dois `\sen` (que não existem no
-- KaTeX; o comando é `\sin`, e os resumos publicados usam "senθ" em texto
-- puro) passariam e sairiam em vermelho na tela do aluno.
--
-- Não há `[[wikilink]]`. `on conflict (slug) do nothing` deixa rodar de novo sem
-- duplicar, e os quatro `update` têm guarda `not like`.
--
-- O número da versão é o que ficou registrado no histórico do Supabase, e o
-- arquivo foi renomeado para ele.

-- ============================================
-- 1. A hidrostática, que o site não tinha
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'hidrostatica',
  'Hidrostática',
  'fisica',
  'comum',
  'Densidade e massa específica — que o documento trata como a mesma coisa — e a conta da densidade de uma mistura.',
  '<ul><li><p>Densidade de um corpo: <span data-type="inline-math" data-latex="d=\frac{m}{V}"></span> [kg/m³ ou g/cm³]</p></li>
<li><p>Massa específica da substância: <span data-type="inline-math" data-latex="μ=\frac{m}{V}"></span> → “mesma” coisa da densidade</p></li></ul>
<aside class="questao"><p>40 cm³ de um líquido possuem massa 20g e 60g de outro líquido possuem volume 60 cm³. Qual a densidade da mistura?</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="d =\frac{m_1 + m_2}{V_1 + V_2}"></span> → <span data-type="inline-math" data-latex="d=\frac{20 + 60}{40 + 60}"></span> → <span data-type="inline-math" data-latex="d=\frac{80}{100}"></span> → <span data-type="inline-math" data-latex="d=0,8 g/cm³"></span></p>
</div></aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'pressao-hidrostatica',
  'Pressão hidrostática',
  'fisica',
  'comum',
  'A pressão que a coluna de líquido faz sobre quem está embaixo dela, e de onde sai o d·g·h.',
  '<ul><li><p>Pressão: <span data-type="inline-math" data-latex="P =\frac{F}{A}"></span> [N/m² ou Pa]</p></li>
<li><p><span data-type="inline-math" data-latex="P_h=\frac{F}{A}=\frac{m . g}{A}=\frac{d.V.g}{A}=\frac{d . A . h . g}{A}"></span> → <span data-type="inline-math" data-latex="P_h=d⋅g⋅h"></span></p></li></ul>
<aside class="questao"><p>Um mergulhador está a 5 metros de profundidade em água doce cuja massa volumétrica (densidade) é 1000 kg/m³. Calcule a pressão hidrostática exercida pela coluna de água sobre o mergulhador. Use g=10m/s².</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="P_h= ?"></span>   <span data-type="inline-math" data-latex="d=1000 kg/m³"></span>   <span data-type="inline-math" data-latex="g=10 m/s²"></span>   <span data-type="inline-math" data-latex="h = 5 m"></span></p>
<p><span data-type="inline-math" data-latex="P_h=d⋅g⋅h"></span> → <span data-type="inline-math" data-latex="P_h=1000⋅10⋅5=50.000 Pa"></span></p>
</div></aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'pressao-absoluta',
  'Pressão absoluta',
  'fisica',
  'comum',
  'A pressão do líquido somada à da atmosfera que está por cima dele.',
  '<ul><li><p><span data-type="inline-math" data-latex="P_{abs}=P_{atm}+P_h"></span></p></li></ul>
<aside class="questao"><p>Em uma local onde g = 10m/s² e a <span data-type="inline-math" data-latex="P_{atm}"></span> vale 1,04 . <span data-type="inline-math" data-latex="10^{5}"></span> Pa, determine a pressão absoluta sobre um corpo mergulhado em um líquido de densidade 2400 kg/m³ a uma profundidade de 20 m.</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="g=10 m/s²"></span>   <span data-type="inline-math" data-latex="P_{atm}"></span> = 1,04 . <span data-type="inline-math" data-latex="10^{5}"></span>   <span data-type="inline-math" data-latex="d=2400 kg/m³"></span>   <span data-type="inline-math" data-latex="h = 20 m"></span>   <span data-type="inline-math" data-latex="P_{abs}"></span> = ?</p>
<p><span data-type="inline-math" data-latex="P_{abs}=P_{atm}+P_h"></span> → <span data-type="inline-math" data-latex="P_{abs}=P_{atm}+d⋅g⋅h"></span></p>
<p><span data-type="inline-math" data-latex="P_{abs}= 1,04⋅10^{5}+2400⋅10⋅20"></span></p>
<p><span data-type="inline-math" data-latex="P_{abs}= 1,04⋅10^{5}+480000"></span></p>
<p><span data-type="inline-math" data-latex="P_{abs}= 1,04⋅10^{5}+4,8⋅10^{5}=5,84⋅10^{5} Pa"></span></p>
</div></aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'vasos-comunicantes',
  'Vasos comunicantes',
  'fisica',
  'comum',
  'Dois líquidos que não se misturam num tubo em U: as alturas ficam na razão inversa das densidades.',
  '<ul><li><p><span data-type="inline-math" data-latex="d_a⋅h_a=d_b⋅h_b"></span></p>
<ul><li><p><span data-type="inline-math" data-latex="d"></span>: densidade do fluido;</p></li>
<li><p><span data-type="inline-math" data-latex="h"></span>: altura;</p></li></ul></li>
<li><p><span data-type="inline-math" data-latex="P_{atm}+ d_1. g . h_1 = P_{gás}"></span></p></li></ul>
<aside class="questao"><p>Questão resolvida:</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/vasos-comunicantes-questao.webp" alt="Duas resoluções de tubo em U lado a lado. À esquerda, manuscrita: com o líquido 1 de densidade 0,8 g/cm³ e o 2 de 1 g/cm³, alturas de 6 cm e 2 cm, calcula-se x = h1 + h2 = 8,8 cm. À direita, digitada: com d1 = 2 g/cm³, h1 = 10 cm e h2 = 8 cm, aplica-se d1·h1 = d2·h2 e chega-se a d2 = 2,5 g/cm³." style="width:100%" data-largura="100%"></figure>
</aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'principio-de-pascal',
  'Princípio de Pascal',
  'fisica',
  'comum',
  'A prensa hidráulica: a pressão se transmite igual, então a força cresce na razão das áreas — e o deslocamento paga a conta.',
  '<ul><li><p><span data-type="inline-math" data-latex="P_1=P_2"></span></p></li>
<li><p><span data-type="inline-math" data-latex="\frac{F_1}{A_1}=\frac{F_2}{A_2}"></span> → <span data-type="inline-math" data-latex="\frac{m_1 . g}{A_1}=\frac{m_2 . g}{A_2}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="A_1⋅d_1=A_2⋅d_2"></span></p>
<ul><li><p><span data-type="inline-math" data-latex="d"></span>: deslocamento;</p></li></ul></li></ul>
<aside class="questao"><p>Considere a figura:</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/prensa-hidraulica.webp" alt="Esboço à mão de uma prensa hidráulica em papel pautado: dois êmbolos ligados pelo líquido, o da esquerda estreito, com raio R1 de 2 cm e a força F1 apontando para baixo, e o da direita largo, com raio R2 de 10 cm." style="width:100%" data-largura="100%"></figure>
<p>Se F1 = 2N, R1 = 2 cm e R2 = 10 cm, qual o valor de F2?</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="\frac{2}{r² . π}"></span> = <span data-type="inline-math" data-latex="\frac{F_2}{r² . π}"></span> → corta os <span data-type="inline-math" data-latex="π"></span></p>
<p><span data-type="inline-math" data-latex="\frac{2}{2²}"></span> = <span data-type="inline-math" data-latex="\frac{F_2}{10²}"></span> → <span data-type="inline-math" data-latex="\frac{2}{4}"></span> = <span data-type="inline-math" data-latex="\frac{F_2}{100}"></span> → 2.100 = 4.F2</p>
<p>4. F2 = 200 → F2 = 50N</p>
</div></aside>'
) on conflict (slug) do nothing;

-- ============================================
-- 2. A acústica, que o site também não tinha
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'efeito-doppler',
  'Efeito Doppler',
  'fisica',
  'comum',
  'Por que a sirene fica aguda ao vir e grave ao ir — e a regra de sinal que decide o + e o − da fórmula.',
  '<p>mudança aparente na frequência de uma onda (sonora ou luminosa) causada pelo movimento relativo entre a fonte emissora e o observador;</p>
<ul><li><p>Ex: som de uma sirene, que fica mais agudo (frequência maior) ao se aproximar e mais grave (frequência menor) ao se afastar.</p></li>
<li><p>Fórmula: <span data-type="inline-math" data-latex="f'' = f . \left(\frac{V ± V_0}{V ± V_f}\right)"></span></p>
<ul><li><p><span data-type="inline-math" data-latex="f''"></span>: frequência aparente</p></li>
<li><p><span data-type="inline-math" data-latex="f"></span>: frequência real</p></li>
<li><p><span data-type="inline-math" data-latex="V"></span>: velocidade do som/da luz</p></li>
<li><p><span data-type="inline-math" data-latex="V_0"></span>: velocidade do observador;</p>
<ul><li><p>Se o OBSERVADOR está se <strong>aproximando</strong>, <span data-type="inline-math" data-latex="+V_0"></span>;</p></li>
<li><p>Se o OBSERVADOR está se <strong>afastando</strong>, <span data-type="inline-math" data-latex="-V_0"></span>;</p></li></ul></li>
<li><p><span data-type="inline-math" data-latex="V_f"></span>: velocidade da fonte;</p>
<ul><li><p>Se a FONTE está se <strong>aproximando</strong>, <span data-type="inline-math" data-latex="-V_f"></span>;</p></li>
<li><p>Se a FONTE está se <strong>afastando</strong>, <span data-type="inline-math" data-latex="+V_f"></span>;</p></li></ul></li></ul></li></ul>
<aside class="questao"><p>Um trem parte de uma estação com o seu apito ligado, que emite um som com frequência de 940 Hz. Enquanto ele afasta-se, uma pessoa parada percebe esse som com uma frequência de 900 Hz. Sendo a velocidade do som no ar igual a 340 m/s, calcule a velocidade do trem ao passar pela estação.</p>
<div class="resolucao"><p>Resolução:</p>
<p>Primeiro vamos analisar as grandezas:</p>
<p><span data-type="inline-math" data-latex="f=940 Hz"></span></p>
<p><span data-type="inline-math" data-latex="f''=900 Hz"></span></p>
<p><span data-type="inline-math" data-latex="V_0=0"></span> (pois a pessoa está sentada, parada)</p>
<p><span data-type="inline-math" data-latex="V_f= ?"></span></p>
<p><span data-type="inline-math" data-latex="V=340 m/s"></span></p>
<p>Detalhe: o trem está se afastando (fonte) portanto será positivo!</p>
<p><span data-type="inline-math" data-latex="f'' = f . \left(\frac{V ± V_0}{V ± V_f}\right)"></span> → 900 = 940 . (<span data-type="inline-math" data-latex="\frac{340 ± 0}{340 + V_f}"></span>) → <span data-type="inline-math" data-latex="\frac{900}{940}"></span> = <span data-type="inline-math" data-latex="\frac{340}{340+ V_f}"></span></p>
<p><span data-type="inline-math" data-latex="\frac{90}{94}"></span> = <span data-type="inline-math" data-latex="\frac{340}{340+ V_f}"></span> → 90 . (340 + Vf) = 340 . 94</p>
<p>30600 + 90 Vf = 31960 → 31960 - 30600 = 90Vf</p>
<p>90 Vf = 1360 → Vf = <span data-type="inline-math" data-latex="\frac{1360}{90}"></span> = <strong>15,1 m/s</strong></p>
</div></aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'nivel-sonoro',
  'Nível sonoro',
  'fisica',
  'comum',
  'O decibel é logarítmico: a conta que converte intensidade sonora em dB, e a volta dela.',
  '<p>grandeza física que mede a intensidade de um som, ou seja, a quantidade de energia sonora em relação à capacidade do ouvido humano de percebê-la.</p>
<ul><li><p><span data-type="inline-math" data-latex="N=10⋅\log\frac{I}{I_0}"></span> [dβ]</p>
<ul><li><p>Caso o exercício não forneça, use <span data-type="inline-math" data-latex="I_0= 10^{-12}\frac{w}{m²}"></span></p></li></ul></li>
<li><p><span data-type="inline-math" data-latex="ΔN=10⋅\log\frac{I_2}{I_1}"></span> [dβ]</p></li></ul>
<aside class="questao"><p>Um estudante, após assistir a uma aula de Física sobre intensidade sonora, resolveu descobrir qual era o nível sonoro marcado na sala de sua casa quando o horário de tráfego de veículos na região onde mora era intenso. Um aplicativo de celular que simula um decibelímetro revelou que o nível sonoro era de 90 dB. Sabendo que a intensidade mínima que corresponde ao limiar da audição humana corresponde a <span data-type="inline-math" data-latex="10^{-12}\frac{w}{m²}"></span>, determine, em <span data-type="inline-math" data-latex="\frac{w}{m²}"></span>, a intensidade sonora referente à medida feita pelo garoto:</p>
<div class="resolucao"><p>Resolução:</p>
<p>Aplicando a equação que determina o nível de intensidade sonora e sabendo que o nível medido foi de 90 dB, temos: <span data-type="inline-math" data-latex="N = 10⋅\log \frac{I}{I_0}"></span> [dβ]</p>
<p><span data-type="inline-math" data-latex="90=10⋅\log\frac{I}{I_0}"></span> → passe o 10 dividindo</p>
<p><span data-type="inline-math" data-latex="9=\log\frac{I}{I_0}"></span> → use a propriedade do log que o logaritmo da divisão corresponde ao logaritmo da subtração, veja:</p>
<p><span data-type="inline-math" data-latex="9=\log I – \log I_0"></span></p>
<p><span data-type="inline-math" data-latex="9=\log I – \log 10^{-12}"></span></p>
<p><span data-type="inline-math" data-latex="9= \log I-(-12)⋅\log 10"></span> → aplique a propriedade do “pesco tapa”</p>
<p>Como log 10 = 1, temos: <span data-type="inline-math" data-latex="9=\log I+12"></span></p>
<p><span data-type="inline-math" data-latex="-3=\log I"></span></p>
<p><span data-type="inline-math" data-latex="I =10^{-3}\frac{w}{m²}"></span></p>
</div></aside>'
) on conflict (slug) do nothing;

-- ============================================
-- 3. Os dois avulsos da mecânica
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'composicao-de-movimentos',
  'Composição de movimentos',
  'fisica',
  'comum',
  'Barco no rio, pessoa na esteira: quando somar e quando subtrair as velocidades para achar a resultante.',
  '<ul><li><p>A favor do arrastamento: <span data-type="inline-math" data-latex="v_A+v_B=v_r"></span></p></li>
<li><p>Contra o arrastamento: <span data-type="inline-math" data-latex="v_A-v_B=v_r"></span></p></li>
<li><p><span data-type="inline-math" data-latex="v=\frac{Δs}{Δt}"></span></p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'impulso-de-uma-forca-variavel',
  'Impulso de uma força variável',
  'fisica',
  'comum',
  'Quando a força não é constante, o impulso deixa de ser F·Δt e passa a ser a área embaixo do gráfico da força pelo tempo.',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/impulso-area-do-grafico.webp" alt="Gráfico da força em newtons pelo tempo em segundos: a força cresce em linha reta de F inicial, no instante inicial, até F final, no instante final. A região entre a reta e o eixo do tempo está marcada como “Área = Impulso”." style="width:100%" data-largura="100%"></figure>'
) on conflict (slug) do nothing;

-- ============================================
-- 4. O que faltava dentro de resumos já publicados
-- ============================================
--
-- Os quatro `update` abaixo têm guarda `not like`, então a migration roda de
-- novo sem empilhar cópia.

-- 4a. Movimento circular: o que "Movimentos de rotação" tinha de novo.

update resumos set
  corpo = corpo || '<h2>Movimentos de rotação</h2>
<ul><li><p><span data-type="inline-math" data-latex="ω=2πf"></span></p></li>
<li><p><span data-type="inline-math" data-latex="v=2π⋅r⋅f"></span></p></li>
<li><p><span data-type="inline-math" data-latex="ω"></span>: velocidade angular <strong>(rad/s)</strong></p></li>
<li><p><span data-type="inline-math" data-latex="v"></span>: qualquer velocidade que não seja angular.</p></li>
<li><p><span data-type="inline-math" data-latex="f"></span>: frequência <strong>(rpm ou Hz)</strong></p>
<ul><li><p>de rpm para Hz, dividir por 60;</p></li>
<li><p>de Hz para rpm, multiplicar por 60;</p></li></ul></li>
<li><p>Polias não-concêntricas: <span data-type="inline-math" data-latex="r_Af_A=r_Bf_B"></span></p></li></ul>',
  atualizado_em = now()
where slug = 'movimento-circular' and corpo not like '%Polias não-concêntricas%';

-- 4b. Lançamento horizontal: a questão resolvida.

update resumos set
  corpo = corpo || '<aside class="questao"><p>Ex: 1) (RE) Um pássaro voa horizontalmente, a 20,0 m do solo, com velocidade constante de módulo 3,0 m/s. Quando passa exatamente sobre uma menina parada no solo, um galho cai da boca do passarinho. Desprezando-se qualquer atrito do galho com o ar e considerando-se g = 10,0 m/s², calcule</p>
<p>a) o tempo gasto pelo galho para atingir o solo, considerado plano; <span data-type="inline-math" data-latex="t= ?"></span></p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="h=\frac{gt^{2}}{2} → 20=\frac{10t^{2}}{2}=5t^{2}"></span></p>
<p><span data-type="inline-math" data-latex="t^{2}=\frac{20}{5}=4"></span></p>
<p><span data-type="inline-math" data-latex="t=2 s"></span></p></div>
<p>b) a distância entre a jovem e o ponto onde o galho atinge o solo. <span data-type="inline-math" data-latex="Δx= ?"></span></p>
<div class="resolucao"><p><span data-type="inline-math" data-latex="Δx=V_x⋅t → Δx=3⋅2"></span></p>
<p><span data-type="inline-math" data-latex="Δx=6 m"></span></p></div></aside>',
  atualizado_em = now()
where slug = 'lancamento-horizontal' and corpo not like '%Um pássaro voa horizontalmente%';

-- 4c. Lançamento oblíquo: a questão resolvida.

update resumos set
  corpo = corpo || '<aside class="questao"><p>Ex: 4) (RE) Um projétil é lançado do solo, com uma velocidade de 50 m/s, numa direção que forma um ângulo θ com a horizontal. Determine o alcance horizontal do projétil, sabendo que sen <span data-type="inline-math" data-latex="Θ"></span> = 4/5 e cos <span data-type="inline-math" data-latex="Θ"></span> = 3/5. (Adote g = 10 m/s² e despreze o efeito do ar.)</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="Δx= ?"></span></p>
<p><span data-type="inline-math" data-latex="V_x=V_0⋅ cosθ"></span></p>
<p><span data-type="inline-math" data-latex="V_x= 50 ⋅ \frac{3}{5}=30 m/s"></span></p>
<p><span data-type="inline-math" data-latex="V_{0y}=V_0⋅ senθ"></span></p>
<p><span data-type="inline-math" data-latex="V_{0y}=50 ⋅\frac{4}{5}=40 m/s"></span></p>
<p><span data-type="inline-math" data-latex="V_y=V_{0y}-gt"></span></p>
<p><span data-type="inline-math" data-latex="0=40-10t→t=4 s"></span> (na altura máxima)</p>
<p>tempo total (<span data-type="inline-math" data-latex="t_T"></span>) = tempo na subida + tempo na descida</p>
<p><span data-type="inline-math" data-latex="t_T= 4+4= 8 s"></span></p>
<p><span data-type="inline-math" data-latex="Δx=V_x⋅t"></span></p>
<p><span data-type="inline-math" data-latex="Δx=30⋅8"></span></p>
<p><span data-type="inline-math" data-latex="Δx=240 m"></span></p></div></aside>',
  atualizado_em = now()
where slug = 'lancamento-obliquo' and corpo not like '%Um projétil é lançado do solo%';

-- 4d. Trabalho e energia: a figura da definição, a decomposição da resultante
--     e as três questões resolvidas.
--
-- A figura entra ao lado da definição, e não no fim: ela mostra `F`, `θ`,
-- `F cos θ` e `d` marcados sobre um bloco sendo puxado, que é exatamente o que
-- a fórmula diz. No documento ela está ancorada na seção anterior — ver o
-- cabeçalho.

update resumos set
  corpo = replace(
    corpo,
    '<li><p>θ: ângulo entre a força e o deslocamento;</p></li></ul></li>',
    '<li><p>θ: ângulo entre a força e o deslocamento;</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/trabalho-de-uma-forca.webp" alt="Uma pessoa puxa um bloco por uma corda inclinada. A força F aponta ao longo da corda; o ângulo θ é medido entre ela e a horizontal, e a componente F cos θ aparece na horizontal, no mesmo sentido do deslocamento d, que leva o bloco da posição inicial à final." style="width:100%" data-largura="100%"></figure></li>
<li><p><span data-type="inline-math" data-latex="\tau_R=\tau_P+\tau_N+\tau_{f_{at}}+\tau_F"></span></p></li>')
where slug = 'trabalho-e-energia' and corpo not like '%trabalho-de-uma-forca.webp%';

update resumos set
  corpo = corpo || '<aside class="questao"><p>Ex: 5) (PR1G4) Um bloco de peso 90 N é arrastado sobre um piso horizontal por meio de uma força constante de intensidade F = 50 N, inclinada de <span data-type="inline-math" data-latex="α"></span> com a horizontal, tal que <span data-type="inline-math" data-latex="sen α=0,6"></span> e <span data-type="inline-math" data-latex="cos α=0,8"></span>. Se, num deslocamento de 20 m o trabalho da força resultante vale 680 J, determine o módulo do trabalho da força de atrito.</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="\tau_{f_{at}}= ?"></span></p>
<p><span data-type="inline-math" data-latex="\tau_F=F⋅d⋅cosθ"></span></p>
<p><span data-type="inline-math" data-latex="\tau_F=50⋅20⋅0,8=1000⋅0,8= 800 J"></span></p>
<p><span data-type="inline-math" data-latex="680=\tau_P+\tau_N+\tau_{f_{at}}+\tau_F"></span></p>
<p><span data-type="inline-math" data-latex="680=0+0+\tau_{f_{at}}+800"></span></p>
<p><span data-type="inline-math" data-latex="\tau_{f_{at}}=680-800"></span></p>
<p><span data-type="inline-math" data-latex="\tau_{f_{at}}=120 J"></span></p></div></aside>
<aside class="questao"><p>Ex: 2) (PR2G4) Tracionando-se uma mola com uma força de intensidade 90 N, a deformação é de 1,5 m. Calcule a energia potencial elástica armazenada na mola, quando a deformação for de 3 m.</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="E_{P_e}=\frac{k⋅3^{2}}{2}= ?"></span></p>
<p><span data-type="inline-math" data-latex="F=k⋅x→k=\frac{F}{x}"></span></p>
<p><span data-type="inline-math" data-latex="k=\frac{90}{1,5}=60 N"></span></p>
<p><span data-type="inline-math" data-latex="E_{P_e}=\frac{60 ⋅ 9}{2}=\frac{540}{2}"></span></p>
<p><span data-type="inline-math" data-latex="E_{P_e}= 270 J"></span></p></div></aside>
<aside class="questao"><p>Ex: 3) (PR2G4) Uma pedra de 7 kg é lançada do solo, verticalmente para cima, com uma energia cinética de 504 J. Considere g = 10 m/s² e despreze o efeito do ar. Se num determinado instante a sua velocidade for de 4 m/s, ela estará a uma altura do solo, em metros, de…</p>
<div class="resolucao"><p>Resolução:</p>
<p><span data-type="inline-math" data-latex="h_B= ?"></span></p>
<p><span data-type="inline-math" data-latex="E_{M_A}=E_{M_B}"></span></p>
<p><span data-type="inline-math" data-latex="E_{C_A}=E_{C_B}+E_{P_B}→\frac{mv_A^{2}}{2}=\frac{mv_B^{2}}{2}+mgh_B"></span></p>
<p><span data-type="inline-math" data-latex="504=\frac{7⋅4^{2}}{2}+7⋅10⋅h_B"></span></p>
<p><span data-type="inline-math" data-latex="504=56+70h_B"></span></p>
<p><span data-type="inline-math" data-latex="448=70h"></span></p>
<p><span data-type="inline-math" data-latex="h_B=\frac{448}{70}=6,4 m"></span></p></div></aside>',
  atualizado_em = now()
where slug = 'trabalho-e-energia' and corpo not like '%Um bloco de peso 90 N%';

-- O trigger `trg_sync_conexoes_resumo` roda no insert e resolve cada
-- `[[wikilink]]` procurando o resumo de destino pelo título. Estes nove não
-- trazem wikilink nenhum, mas o update vazio é o fecho padrão das migrations
-- de importação (decisão 9c) e custa nada.
update resumos set corpo = corpo where materia_slug = 'fisica';

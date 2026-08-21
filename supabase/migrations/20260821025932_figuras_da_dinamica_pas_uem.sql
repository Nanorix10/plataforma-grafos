-- Leva aos dez resumos da Dinâmica as dezesseis figuras do documento mestre.
--
-- A Dinâmica entrou em 08/08 a partir do documento "Dinâmica (revisado)",
-- exportado em TEXTO — e texto exportado não traz imagem. O documento mestre do
-- PAS UEM, agora em `.docx`, tem as mesmas seções COM os desenhos. O texto dos
-- dez resumos não muda uma palavra aqui: eles só ganham as figuras.
--
-- Seis resumos recebem: leis-de-newton (2), forcas-da-mecanica (3),
-- movimento-circular (7), plano-inclinado (1), quantidade-de-movimento (2) e
-- gravitacao-e-kepler (1). Os outros quatro não têm figura no documento.
--
-- ## Cada figura vai onde a frase que ela ilustra está
--
-- A âncora de cada `replace` é a frase equivalente no texto REVISADO, que nem
-- sempre é igual à do mestre — os dois documentos são versões diferentes da
-- mesma matéria. Onde a frase não bate, a figura não entra, e é por isso que o
-- `do $$` no fim exige as dezesseis: `replace` que não acha a âncora não dá
-- erro, só não faz nada.
--
-- A do gráfico do impulso entra DENTRO do item da lista, e não depois dele: um
-- `<figure>` solto entre `</li>` e `<li>` seria filho direto do `<ul>`, que só
-- aceita `<li>`.
--
-- A da colisão entra ANTES da alternativa A, entre o enunciado e as opções, que
-- é onde a questão da UFMS diz "a situação ilustrada a seguir".
--
-- ## O que NÃO entrou, e precisa de você
--
-- Sobraram cinco figuras da parte CINEMÁTICA do movimento circular
-- (circunferência, ângulo de 360°, radiano, a relação ângulo/arco e a tabela
-- linear × angular). Elas não têm onde entrar: o resumo `movimento-circular`
-- que existe no site tem título "Movimento circular", mas o conteúdo dele é só
-- a DINÂMICA do movimento circular — a cinemática (período, frequência,
-- velocidade angular) não está em resumo nenhum. Isso é um resumo faltando, e
-- não uma figura órfã.
update resumos set corpo = replace(corpo,
  'desde que seja nula a resultante das forças que nele atua;</p>',
  'desde que seja nula a resultante das forças que nele atua;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/inercia.webp" alt="Quatro quadros com um passageiro dentro de um vagão: em repouso, em MRU, freando e acelerando para a direita." style="width:100%" data-largura="100%"></figure>')
 where slug = 'leis-de-newton';

update resumos set corpo = replace(corpo,
  'Mesmo módulo, mesma direção, sentidos contrários e atuam em corpos diferentes;</p>',
  'Mesmo módulo, mesma direção, sentidos contrários e atuam em corpos diferentes;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/acao-e-reacao.webp" alt="Uma pessoa empurra a parede e é empurrada de volta: as duas forças têm o mesmo módulo e não se anulam, porque atuam em corpos diferentes." style="width:100%" data-largura="100%"></figure>')
 where slug = 'leis-de-newton';

update resumos set corpo = replace(corpo,
  'μ<sub>e</sub>: coeficiente de atrito estático;</p>',
  'μ<sub>e</sub>: coeficiente de atrito estático;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/atrito.webp" alt="Gráfico da força de atrito pela força aplicada: ela cresce enquanto o corpo está parado, chega ao máximo na iminência do movimento e cai para o valor cinético." style="width:100%" data-largura="100%"></figure>')
 where slug = 'forcas-da-mecanica';

update resumos set corpo = replace(corpo,
  'Série: <span data-type="inline-math" data-latex="\frac{1}{k_{eq}} = \frac{1}{k_1} + \frac{1}{k_2} + ... + \frac{1}{k_n}"></span></p>',
  'Série: <span data-type="inline-math" data-latex="\frac{1}{k_{eq}} = \frac{1}{k_1} + \frac{1}{k_2} + ... + \frac{1}{k_n}"></span></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/molas-em-serie.webp" alt="Duas molas de constantes k1 e k2 ligadas uma na outra, em série." style="width:100%" data-largura="100%"></figure>')
 where slug = 'forcas-da-mecanica';

update resumos set corpo = replace(corpo,
  'Paralelo: <span data-type="inline-math" data-latex="k_{eq} = k_1 + k_2 + ... + k_n"></span></p>',
  'Paralelo: <span data-type="inline-math" data-latex="k_{eq} = k_1 + k_2 + ... + k_n"></span></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/molas-em-paralelo.webp" alt="Duas molas de constantes k1 e k2 presas lado a lado na mesma parede, em paralelo." style="width:100%" data-largura="100%"></figure>')
 where slug = 'forcas-da-mecanica';

update resumos set corpo = replace(corpo,
  'analisa as forças que atuam sobre objetos em trajetórias curvas (movimentos curvilíneos);</p>',
  'analisa as forças que atuam sobre objetos em trajetórias curvas (movimentos curvilíneos);</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/dinamica-do-movimento-circular.webp" alt="Corpo em trajetória circular: a velocidade é tangente à circunferência e a força centrípeta aponta para o centro em cada ponto." style="width:100%" data-largura="100%"></figure>')
 where slug = 'movimento-circular';

update resumos set corpo = replace(corpo,
  '<p>Curva em perfil plano:</p>',
  '<p>Curva em perfil plano:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/curva-plana.webp" alt="Curva de uma pista plana, com o raio R medido a partir do centro da curva." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/curva-plana-forcas.webp" alt="Ciclista inclinado numa curva, com o peso, a normal e a resultante que aponta para o centro." style="width:385px" data-largura="385px"></figure>')
 where slug = 'movimento-circular';

update resumos set corpo = replace(corpo,
  '<p>Corpo preso a um fio:</p>',
  '<p>Corpo preso a um fio:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/corpo-preso-a-um-fio.webp" alt="Corpo girando sobre uma mesa preso por um fio de raio r: a tração no fio é a força centrípeta." style="width:100%" data-largura="100%"></figure>')
 where slug = 'movimento-circular';

update resumos set corpo = replace(corpo,
  '<p>Globo da morte:</p>',
  '<p>Globo da morte:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/globo-da-morte.webp" alt="Motocicleta em quatro posições dentro do globo, com o peso e a normal em cada uma delas." style="width:100%" data-largura="100%"></figure>')
 where slug = 'movimento-circular';

update resumos set corpo = replace(corpo,
  '<p>Lombada:</p>',
  '<p>Lombada:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/lombada.webp" alt="Carro no alto de uma lombada: a normal aponta para cima, o peso para baixo, e a resultante para o centro da curva." style="width:100%" data-largura="100%"></figure>')
 where slug = 'movimento-circular';

update resumos set corpo = replace(corpo,
  '<p>Depressão:</p>',
  '<p>Depressão:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/depressao.webp" alt="Carro no fundo de uma depressão: a normal aponta para cima, o peso para baixo, e a resultante para o centro da curva, que agora está acima." style="width:100%" data-largura="100%"></figure>')
 where slug = 'movimento-circular';

update resumos set corpo = replace(corpo,
  '<strong>Plano inclinado:</strong> superfície plana inclinada em relação a um eixo horizontal;</p>',
  '<strong>Plano inclinado:</strong> superfície plana inclinada em relação a um eixo horizontal;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/plano-inclinado.webp" alt="Bloco sobre o plano inclinado, com o peso decomposto em Px e Py e a normal perpendicular à superfície." style="width:600px" data-largura="600px"></figure>')
 where slug = 'plano-inclinado';

update resumos set corpo = replace(corpo,
  '<li><p>É diretamente proporcional à força;</p>',
  '<li><p>É diretamente proporcional à força;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/quantidade-de-movimento.webp" alt="Gráfico da força pelo tempo: a área sob a curva é o impulso." style="width:100%" data-largura="100%"></figure>')
 where slug = 'quantidade-de-movimento';

update resumos set corpo = replace(corpo,
  '<p>A) os dois corpos tinham a mesma massa e velocidades de valores diferentes.</p>',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/colisao-frontal.webp" alt="Os dois corpos imediatamente antes da colisão, durante a colisão e imediatamente depois." style="width:324px" data-largura="324px"></figure><p>A) os dois corpos tinham a mesma massa e velocidades de valores diferentes.</p>')
 where slug = 'quantidade-de-movimento';

update resumos set corpo = replace(corpo,
  '2º Lei de Kepler: a linha imaginária que liga um planeta ao Sol varre áreas iguais em tempos iguais;</p>',
  '2º Lei de Kepler: a linha imaginária que liga um planeta ao Sol varre áreas iguais em tempos iguais;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/lei-das-areas.webp" alt="A linha que liga o planeta ao Sol varre áreas iguais em tempos iguais: a área A1 no intervalo t1 e a área A2 no intervalo t2." style="width:100%" data-largura="100%"></figure>')
 where slug = 'gravitacao-e-kepler';

do $$
declare n int;
begin
  select count(*) into n from (
    select regexp_matches(corpo, '<figure', 'g') from resumos
     where slug in ('leis-de-newton', 'forcas-da-mecanica', 'movimento-circular',
                    'plano-inclinado', 'quantidade-de-movimento', 'gravitacao-e-kepler')
  ) x;
  if n <> 16 then
    raise exception 'esperava 16 figuras na Dinâmica, encontrei %', n;
  end if;
end $$;

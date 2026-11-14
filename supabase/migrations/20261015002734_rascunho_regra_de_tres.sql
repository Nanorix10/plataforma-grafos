-- Regra de três: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Lacuna conferida no banco em 14/10/2026: nenhum resumo trata de regra de três
-- nem de grandezas proporcionais. O assunto aparece no PAS UEM, etapa 1
-- ("Razões e proporções; divisão proporcional; regras de três simples e
-- compostas.") e no PASSE, etapa 1 ("Grandezas diretamente ou inversamente
-- proporcionais." e "Variação entre grandezas (proporcionalidade e não
-- proporcionalidade);"). Está em mais de um edital: processo `comum`
-- (decisão 1c). Sem pai: nenhum resumo de Matemática o contém hoje.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2025/Resumos 4° bimestre/Resumo para Simulado
--    Harmonia_ 2º dia.docx`, seção MATEMÁTICA C, §00552–00590 do extrator
--    (regra de três simples e composta). O EDROS 1ª série (§00108–00110) só
--    lista os títulos.
-- 2. Edital: os três tópicos acima.
-- 3. Provas: PAS-UEM 2025, etapa 1, questão 25 (gabarito 06), em
--    Documents/UEM-Provas/pdfs/pas25/E1.pdf, p. 15. Conferida no PDF e
--    recalculada item a item. A mesma questão já está em *Matemática
--    financeira*; aqui ela é resolvida por regra de três.
--
-- ## O que difere do caderno
-- Decisão do autor na parada de conteúdo (14/10/2026): o caderno define DP
-- como "as duas grandezas aumentam ou diminuem" e IP como "uma aumenta e a
-- outra diminui", o que descreve só o sentido (lado e área do quadrado crescem
-- juntos e não são DP). Corrigido para razão constante (DP) e produto constante
-- (IP); o sentido do caderno ficou como item `Sentido:`, e entrou um `Obs:`.
--
-- Acréscimos: as fórmulas y/x = k e x·y = k; a tabela DP × IP, montada só com
-- o que está acima; o passo 3 da composta ("inverter a razão de toda grandeza
-- IP"), que o caderno faz no exemplo e não lista no passo a passo.
--
-- Normalizações de forma: segunda pessoa e coloquialismos tirados ("vamos
-- analisar", "você consegue prever", "Supomos que eu fui", "Simplifique se
-- possível pois te ajuda", "tabelinha", "virar de ponta cabeça" → "a razão é
-- invertida"); `X` → `x`; o exemplo das canetas virou enunciado.
--
-- ## Edital
-- Ligado: PASSE, etapa 1, "Grandezas diretamente ou inversamente
-- proporcionais.", coberto inteiro. Ficam de fora, cobertos pela metade: PAS
-- UEM etapa 1 (falta razão, proporção e divisão proporcional, que o caderno não
-- traz) e PASSE etapa 1 "Variação entre grandezas" (falta não proporcionalidade
-- além do Obs:).

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
select
  'regra-de-tres',
  'Regra de três',
  'matematica',
  'comum',
  'Método para determinar um valor desconhecido a partir de grandezas diretamente ou inversamente proporcionais: duas grandezas (simples) ou mais (composta).',
  '<p>método para determinar um valor desconhecido a partir de grandezas proporcionais, conhecido um caso da relação entre elas;</p>
<ul><li><p><strong>Grandezas proporcionais:</strong> diretamente (DP) ou inversamente (IP) proporcionais;</p></li>
<li><p><strong>Regra de três simples:</strong> duas grandezas;</p></li>
<li><p><strong>Regra de três composta:</strong> três ou mais grandezas.</p></li></ul>
<h2 data-corrido="sim">Grandezas diretamente proporcionais (DP):</h2>
<p>a razão entre os valores correspondentes das duas grandezas é constante; quando uma dobra, a outra dobra;</p>
<div data-type="block-math" data-latex="\frac{y}{x}=k"></div>
<ul><li><p><span data-type="inline-math" data-latex="x"></span>, <span data-type="inline-math" data-latex="y"></span>: valores correspondentes das duas grandezas;</p></li>
<li><p><span data-type="inline-math" data-latex="k"></span>: constante de proporcionalidade;</p></li>
<li><p><strong>Sentido:</strong> as duas grandezas aumentam ou diminuem juntas;</p></li>
<li><p><strong>Obs:</strong> aumentar junto não basta; a razão tem de se manter constante;</p></li>
<li><p><strong>Ex:</strong> número de canetas e preço pago; pagamento dividido proporcionalmente à área pintada (ver [[Matemática financeira]]).</p></li></ul>
<h2 data-corrido="sim">Grandezas inversamente proporcionais (IP):</h2>
<p>o produto entre os valores correspondentes das duas grandezas é constante; quando uma dobra, a outra cai à metade;</p>
<div data-type="block-math" data-latex="x\cdot y=k"></div>
<ul><li><p><strong>Sentido:</strong> quando uma grandeza aumenta, a outra diminui;</p></li>
<li><p><strong>Ex:</strong> velocidade e tempo para percorrer uma mesma distância (ver [[Movimentos retilíneos]]).</p></li></ul>
<h2 data-corrido="sim">Regra de três simples:</h2>
<p>segue uma proporção entre duas grandezas; a partir de um caso conhecido, determina-se o valor desconhecido;</p>
<ul><li><p><strong>Procedimento:</strong></p>
<ol><li><p>separar as grandezas em colunas;</p></li>
<li><p>analisar se as grandezas são DP ou IP;</p></li>
<li><p>DP: multiplicar cruzado; IP: multiplicar em linha.</p></li></ol></li>
<li><p><strong>Ex (DP):</strong> 1 caneta custa R$ 2,00; quanto custam 2 canetas?</p>
<table><tbody><tr><th><p>número de canetas</p></th><th><p>preço (R$)</p></th></tr>
<tr><td><p>1</p></td><td><p>2</p></td></tr>
<tr><td><p>2</p></td><td><p><span data-type="inline-math" data-latex="x"></span></p></td></tr></tbody></table>
<ol><li><p>quanto mais canetas, maior o preço: DP;</p></li>
<li><p>multiplicação cruzada: <span data-type="inline-math" data-latex="1\cdot x=2\cdot 2"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="x=4"></span>; as 2 canetas custam R$ 4,00.</p></li></ol></li>
<li><p><strong>Ex (IP):</strong> uma pessoa leva 3 horas para chegar a um lugar andando a 10 km/h; outra pessoa precisa percorrer a mesma distância em 2 horas. Qual a velocidade necessária?</p>
<table><tbody><tr><th><p>tempo (h)</p></th><th><p>velocidade (km/h)</p></th></tr>
<tr><td><p>3</p></td><td><p>10</p></td></tr>
<tr><td><p>2</p></td><td><p><span data-type="inline-math" data-latex="x"></span></p></td></tr></tbody></table>
<ol><li><p>se a velocidade aumenta, o tempo diminui: IP;</p></li>
<li><p>multiplicação em linha: <span data-type="inline-math" data-latex="3\cdot 10=2\cdot x"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="30=2x\rightarrow x=15"></span>; a velocidade necessária é 15 km/h.</p></li></ol></li></ul>
<h2 data-corrido="sim">Regra de três composta:</h2>
<p>relaciona três ou mais grandezas, com um valor desconhecido;</p>
<ul><li><p><strong>Procedimento:</strong></p>
<ol><li><p>organizar os dados em tabela;</p></li>
<li><p>descobrir se cada grandeza é DP ou IP em relação à que tem o <span data-type="inline-math" data-latex="x"></span>;</p></li>
<li><p>inverter a razão de toda grandeza IP;</p></li>
<li><p>igualar a razão da grandeza com o <span data-type="inline-math" data-latex="x"></span> ao produto das demais razões, simplificar e multiplicar cruzado.</p></li></ol></li>
<li><p><strong>Ex:</strong> (Cefet-MG) Em uma empresa, 10 funcionários produzem 150 peças em 30 dias úteis. O número de funcionários que a empresa vai precisar para produzir 200 peças, em 20 dias úteis, é igual a: A) 18; B) 20; C) 22; D) 24.</p>
<table><tbody><tr><th><p>funcionários</p></th><th><p>peças</p></th><th><p>dias</p></th></tr>
<tr><td><p>10</p></td><td><p>150</p></td><td><p>30</p></td></tr>
<tr><td><p><span data-type="inline-math" data-latex="x"></span></p></td><td><p>200</p></td><td><p>20</p></td></tr></tbody></table>
<ol><li><p>para produzir mais peças, são necessários mais funcionários: peças é DP;</p></li>
<li><p>para realizar o mesmo trabalho em menos dias, são necessários mais funcionários: dias é IP, e a razão é invertida;</p></li>
<li><p><span data-type="inline-math" data-latex="\frac{10}{x}=\frac{150}{200}\cdot\frac{20}{30}"></span>;</p></li>
<li><p>simplificando: <span data-type="inline-math" data-latex="\frac{10}{x}=\frac{15}{20}\cdot\frac{2}{3}=\frac{30}{60}=\frac{1}{2}"></span>;</p></li>
<li><p>multiplicação cruzada: <span data-type="inline-math" data-latex="10\cdot 2=x\cdot 1\rightarrow x=20"></span>; alternativa B.</p></li></ol></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>DP</strong></p></th><th><p><strong>IP</strong></p></th></tr>
<tr><td><p>O que é constante</p></td><td><p>a razão <span data-type="inline-math" data-latex="\frac{y}{x}"></span></p></td><td><p>o produto <span data-type="inline-math" data-latex="x\cdot y"></span></p></td></tr>
<tr><td><p>Sentido</p></td><td><p>aumentam ou diminuem juntas</p></td><td><p>uma aumenta, a outra diminui</p></td></tr>
<tr><td><p>Regra de três simples</p></td><td><p>multiplicar cruzado</p></td><td><p>multiplicar em linha</p></td></tr>
<tr><td><p>Regra de três composta</p></td><td><p>a razão é mantida</p></td><td><p>a razão é invertida</p></td></tr></tbody></table>
<aside class="questao" data-id="4b2f08fe-30a0-4c9b-a5d9-56a03a97169a" data-gabarito="6"><p>(PAS-UEM 2025, 1ª etapa) O custo total para pintar uma casa é composto por duas parcelas: o custo da mão de obra e o custo do material. Para pintar uma casa, João e Pedro cobraram R$ 30,00/m² pela mão de obra. O pagamento total da mão de obra da pintura da casa foi de R$ 75.000,00 e foi dividido proporcionalmente à área que cada um pintou. Considere que João recebeu um pagamento de R$ 45.000,00. Assinale o que for correto.</p><p>(01) A área pintada por João foi inferior à área pintada por Pedro.</p><p>(02) João recebeu 60% do pagamento total.</p><p>(04) A área total pintada por João e Pedro foi de 2.500 m².</p><p>(08) Pedro pintou mais de 1.200 m².</p><p>(16) Se a mão de obra representa 40% do custo total da pintura dessa casa, então o montante gasto com material foi de R$ 120.000,00.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>Área e pagamento são DP: 1 m² corresponde a R$ 30,00. João: <span data-type="inline-math" data-latex="\frac{1}{x}=\frac{30}{45000}\rightarrow x=1500"></span> m²; Pedro recebeu <span data-type="inline-math" data-latex="75000-45000=30000"></span> reais, ou seja, <span data-type="inline-math" data-latex="\frac{30000}{30}=1000"></span> m²;</p><p>(01) Incorreta. João pintou 1.500 m², mais que os 1.000 m² de Pedro;</p><p>(02) Correta. <span data-type="inline-math" data-latex="\frac{45000}{75000}=0{,}6=60\%"></span>;</p><p>(04) Correta. <span data-type="inline-math" data-latex="1500+1000=2500"></span> m²;</p><p>(08) Incorreta. Pedro pintou 1.000 m²;</p><p>(16) Incorreta. Custo total e porcentagem são DP: <span data-type="inline-math" data-latex="\frac{40}{100}=\frac{75000}{x}\rightarrow x=187500"></span>; material: <span data-type="inline-math" data-latex="187500-75000=112500"></span> reais.</p><p><strong>Soma: 02 + 04 = 06</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Grandezas diretamente proporcionais:</h3>
<p>a razão entre os valores correspondentes é constante;</p>
<h3 data-corrido="sim">Grandezas inversamente proporcionais:</h3>
<p>o produto entre os valores correspondentes é constante;</p>
<h3 data-corrido="sim">Regra de três simples:</h3>
<p>proporção entre duas grandezas, com um valor desconhecido;</p>
<h3 data-corrido="sim">Regra de três composta:</h3>
<p>proporção entre três ou mais grandezas, com um valor desconhecido;</p>
<h3 data-corrido="sim">Grandezas DP na regra de três simples:</h3>
<p>multiplica-se cruzado;</p>
<h3 data-corrido="sim">Grandezas IP na regra de três simples:</h3>
<p>multiplica-se em linha;</p>
<h3 data-corrido="sim">Grandeza IP na regra de três composta:</h3>
<p>a razão dela é invertida.</p>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'passe'
   and e.etapa = 1
   and e.texto = 'Grandezas diretamente ou inversamente proporcionais.'
   and e.resumo_id is null
   and r.slug = 'regra-de-tres';

update resumos set corpo = corpo where slug = 'regra-de-tres';

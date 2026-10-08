-- Estatística: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- O resumo `estatistica` existia com o corpo VAZIO (só a definição), como pai
-- de `medidas-de-tendencia-central` e `medidas-de-dispersao`. Conferido no
-- banco em 08/10/2026. Esta migration preenche o corpo; a definição, o
-- processo (`comum`) e o pai (nenhum) ficam como estão. O `where` só age se o
-- corpo ainda estiver vazio, para não sobrescrever um texto que o autor
-- tenha escrito no editor.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2025/Resumos 3º bimestre/Resumo para PR1G1.docx`,
--    MATEMÁTICA C, §00129–00145, com a tabela de frequência (image8); e
--    `Resumos 2025/Resumos 4° bimestre/Resumo para PR2G1.docx`, MATEMÁTICA C,
--    §00087–00090 (pesquisa amostral e censitária). O exemplo de amplitude
--    (7, 9, 5, 3, 4, 8) é o do próprio caderno, em `Resumo para PAS UEM
--    1°etapa.docx` §00129–00130.
-- 2. Edital: PAS UEM, etapa 1 — "Interpretação de gráficos e de tabelas,
--    tabelas de frequência." e "Estatística e Análise de Dados.".
-- 3. Provas: PAS-UEM 2023, etapa 1, questão 24 (gabarito 12), em
--    Documents/UEM-Provas/pdfs/pas23/E1.pdf, p. 10; o gráfico foi recortado
--    do PDF.
--
-- ## O que difere do caderno
-- - Decisão do autor (parada): "Variável discreta: não assume valores
--   decimais, somente naturais" → "assume valores inteiros, obtidos por
--   contagem" (a definição do caderno restringia demais).
-- - Acréscimos: a fórmula f_r = f_a / n (ilustração da definição de
--   frequência relativa); "a amostra é um subconjunto da população" (para o
--   link com Teoria elementar dos conjuntos); as frases de abertura de
--   "Variáveis estatísticas", "Tabelas de frequência" e "Gráficos".
-- - Forma: "População VS Amostra: todo / parcela" → "população é o todo;
--   amostra é uma parcela da população"; "valores quebrados, fracionados,
--   decimais" → "valores fracionários e decimais"; "etc." retirado dos
--   exemplos.
--
-- ## Edital
-- Ligados: os dois tópicos do PAS UEM, etapa 1, acima. O resumo, com os
-- filhos, cobre "Estatística e Análise de Dados."; o de gráficos e tabelas,
-- ele cobre sozinho.

update resumos
   set corpo = '<p>Ciência que trata de métodos e procedimentos científicos destinados ao planejamento, à organização e à interpretação de dados;</p>
<ul><li><p><strong>População e amostra:</strong> o todo e uma parcela dele;</p></li>
<li><p><strong>Variáveis estatísticas:</strong> qualitativas e quantitativas;</p></li>
<li><p><strong>Rol:</strong> os dados em ordem;</p></li>
<li><p><strong>Tabelas de frequência:</strong> frequência absoluta e relativa;</p></li>
<li><p><strong>Gráficos:</strong> de linhas, de barras e de setores.</p></li></ul>
<h2 data-corrido="sim">População e amostra:</h2>
<p>população é o todo; amostra é uma parcela da população;</p>
<ul><li><p><strong>Obs:</strong> a amostra é um subconjunto da população (ver [[Teoria elementar dos conjuntos]]);</p></li>
<li><p><strong>Pesquisa amostral:</strong> pesquisa feita com uma parte da população;</p>
<ul><li><p><strong>Ex:</strong> pesquisa sobre a matéria favorita dos 1º anos feita apenas com o 1º C, ou seja, com uma amostra dos 1º anos;</p></li></ul></li>
<li><p><strong>Pesquisa censitária:</strong> coleta dados de todos os indivíduos de uma população;</p>
<ul><li><p><strong>Ex:</strong> a escola tem 100 alunos, e a coordenadora faz uma pesquisa para saber qual modalidade incrementar na interclasse; todos os 100 alunos respondem à pesquisa.</p></li></ul></li></ul>
<h2 data-corrido="sim">Variáveis estatísticas:</h2>
<p>dividem-se em qualitativas e quantitativas;</p>
<h3 data-corrido="sim">Variável qualitativa:</h3>
<p>aquela que não pode ser expressa numericamente, mas sim organizada e classificada;</p>
<ul><li><p><strong>Ex:</strong> escolaridade, profissão, estado civil.</p></li></ul>
<h3 data-corrido="sim">Variável quantitativa:</h3>
<p>aquela que pode ser expressa numericamente;</p>
<ul><li><p><strong>Variável contínua:</strong> pode assumir valores fracionários e decimais;</p>
<ul><li><p><strong>Ex:</strong> peso, altura, tempo;</p></li></ul></li>
<li><p><strong>Variável discreta:</strong> assume valores inteiros, obtidos por contagem (ver [[Conjuntos numéricos]]);</p>
<ul><li><p><strong>Ex:</strong> 1, 2, 3.</p></li></ul></li></ul>
<h2 data-corrido="sim">Rol:</h2>
<p>organização de um conjunto de dados em ordem crescente ou decrescente;</p>
<ul><li><p><strong>Amplitude:</strong> diferença entre o maior e o menor dado, calculada no rol;</p>
<ul><li><p><strong>Ex:</strong> amostra <span data-type="inline-math" data-latex="7,\ 9,\ 5,\ 3,\ 4,\ 8"></span></p>
<ol><li><p>Rol: <span data-type="inline-math" data-latex="3,\ 4,\ 5,\ 7,\ 8,\ 9"></span>;</p></li>
<li><p>Amplitude: <span data-type="inline-math" data-latex="9-3=6"></span>.</p></li></ol></li></ul></li></ul>
<h2 data-corrido="sim">Tabelas de frequência:</h2>
<p>organizam os dados com o número de vezes que cada valor aparece;</p>
<ul><li><p><strong>Frequência absoluta:</strong> número de vezes que um determinado valor aparece em um conjunto de dados;</p></li>
<li><p><strong>Frequência relativa:</strong> proporção de um valor em relação ao total de dados, expressa em fração, decimal ou porcentagem;</p>
<div data-type="block-math" data-latex="f_r=\frac{f_a}{n}"></div>
<ul><li><p><span data-type="inline-math" data-latex="f_r"></span>: frequência relativa;</p></li>
<li><p><span data-type="inline-math" data-latex="f_a"></span>: frequência absoluta;</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span>: total de dados;</p></li></ul></li>
<li><p><strong>Ex:</strong> intenções de voto de 50 entrevistados.</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/tabela-de-frequencia-intencoes-de-voto.webp" alt="Tabela de frequência das intenções de voto: votariam, frequência absoluta 28 e relativa 28/50 = 0,56 (56%); não votariam, 18 e 18/50 = 0,36 (36%); indecisos, 4 e 4/50 = 0,08 (8%); total 50, 1 e 100%." style="width:80%" data-largura="80%"></figure></li></ul>
<h2 data-corrido="sim">Gráficos:</h2>
<p>representam visualmente os dados;</p>
<ul><li><p><strong>Gráfico de linhas;</strong></p></li>
<li><p><strong>Gráfico de barras;</strong></p></li>
<li><p><strong>Gráfico de setores:</strong> deve ser proporcional.</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>a frequência relativa do valor que aparece 4 vezes em 12 dados é <span data-type="inline-math" data-latex="\frac{4}{12}\approx 33{,}3\%"></span>, e não 30% (PAS-UEM 2023, 1ª etapa);</p></li>
<li><p>a média de um gráfico de barras é a soma de todos os valores dividida pelo número de barras; no consumo mensal de um ano, divide-se por 12 (PAS-UEM 2023, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="b20b4efb-7c13-4581-9898-ec5ea8252d23" data-gabarito="12"><p>(PAS-UEM 2023, 1ª etapa) Considere o gráfico de barras do consumo de água de um pequeno edifício:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/consumo-de-agua-grafico-de-barras.webp" alt="Gráfico de barras do consumo de água, em metros cúbicos, de janeiro a dezembro: 3, 6, 6, 6, 12, 12, 12, 12, 6, 6, 6 e 9." style="width:100%" data-largura="100%"></figure><p>Com base nesse gráfico, assinale o que for correto.</p><p>(01) O consumo médio semestral é de <span data-type="inline-math" data-latex="45\ \text{m}^3"></span>.</p><p>(02) A frequência relativa do maior consumo é de 30%.</p><p>(04) A moda do consumo mensal é <span data-type="inline-math" data-latex="6\ \text{m}^3"></span>.</p><p>(08) A variância do consumo é de <span data-type="inline-math" data-latex="9{,}5\ \text{m}^3"></span>.</p><p>(16) A média de consumo é <span data-type="inline-math" data-latex="9\ \text{m}^3"></span>.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. Consumo do ano: <span data-type="inline-math" data-latex="3+3\cdot 6+4\cdot 12+3\cdot 6+9=96\ \text{m}^3"></span>; por semestre, <span data-type="inline-math" data-latex="\frac{96}{2}=48\ \text{m}^3"></span>;</p><p>(02) Incorreta. O maior consumo, 12, aparece em 4 dos 12 meses: <span data-type="inline-math" data-latex="f_r=\frac{4}{12}\approx 33{,}3\%"></span>;</p><p>(04) Correta. O valor 6 aparece 6 vezes, a maior frequência absoluta;</p><p>(08) Correta. Média <span data-type="inline-math" data-latex="\frac{96}{12}=8"></span>; <span data-type="inline-math" data-latex="Var=\frac{(3-8)^2+6\cdot(6-8)^2+4\cdot(12-8)^2+(9-8)^2}{12}=\frac{25+24+64+1}{12}=\frac{114}{12}=9{,}5"></span>;</p><p>(16) Incorreta. A média é <span data-type="inline-math" data-latex="\frac{96}{12}=8\ \text{m}^3"></span>.</p><p><strong>Soma: 04 + 08 = 12</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Estatística:</h3>
<p>ciência do planejamento, da organização e da interpretação de dados;</p>
<h3 data-corrido="sim">População e amostra:</h3>
<p>população, o todo; amostra, uma parcela da população;</p>
<h3 data-corrido="sim">Pesquisa censitária e pesquisa amostral:</h3>
<p>censitária, todos os indivíduos da população; amostral, uma parte dela;</p>
<h3 data-corrido="sim">Variável qualitativa:</h3>
<p>não pode ser expressa numericamente; é organizada e classificada;</p>
<h3 data-corrido="sim">Variável contínua e variável discreta:</h3>
<p>contínua, valores fracionários e decimais; discreta, valores inteiros obtidos por contagem;</p>
<h3 data-corrido="sim">Rol:</h3>
<p>dados em ordem crescente ou decrescente;</p>
<h3 data-corrido="sim">Frequência absoluta e frequência relativa:</h3>
<p>absoluta, número de vezes que o valor aparece; relativa, <span data-type="inline-math" data-latex="\frac{f_a}{n}"></span>.</p>'
 where slug = 'estatistica'
   and coalesce(corpo, '') = '';

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.texto in ('Interpretação de gráficos e de tabelas, tabelas de frequência.',
                   'Estatística e Análise de Dados.')
   and e.resumo_id is null
   and r.slug = 'estatistica';

-- Medidas de posição: rascunhado por Claude e revisado pelo autor.
-- Aprovar o PR é publicar.
--
-- ## EXCEÇÃO ao §6 do modelo, por decisão do autor (08/10/2026)
-- Nenhuma das três fontes traz o assunto: o caderno não tem quartis, decis
-- nem percentis, e nenhuma prova da UEM do índice os cobra. O autor decidiu
-- abrir uma exceção: o texto segue as definições usuais de livro didático.
-- A terminologia acompanha a dos irmãos (rol, mediana, amplitude) e o
-- exemplo resolvido usa a amostra do caderno (7, 9, 5, 3, 4, 8), a mesma de
-- Medidas de tendência central. Sem questão: não há prova sobre o assunto.
-- Sem caixa de pegadinhas: o modelo só as aceita de prova real.
--
-- O método dos quartis é o das medianas das metades, que é o de ensino
-- médio; a Obs de Percentis avisa que há outros métodos.
--
-- ## Edital
-- Fonte do escopo: PASSE, etapa 2 — "Estatística: pesquisa e organização de
-- dados, interpretação de gráficos, medidas de tendência central e medidas
-- de dispersão; medidas de posição (mediana, quartis, decis e percentis).".
-- O tópico pede a família inteira, então é ligado ao pai, `estatistica`, que
-- passa a ter os três filhos que o cobrem. Processo `passe`: só esse edital
-- pede medidas de posição.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, pai_id, corpo)
select
  'medidas-de-posicao',
  'Medidas de posição',
  'matematica',
  'passe',
  'Quartis, decis e percentis: separatrizes que dividem o rol em partes com a mesma quantidade de dados.',
  (select id from resumos where slug = 'estatistica'),
  '<p>Separatrizes: valores que dividem o rol em partes com a mesma quantidade de dados;</p>
<ul><li><p><strong>Quartis:</strong> dividem o rol em 4 partes;</p></li>
<li><p><strong>Decis:</strong> dividem o rol em 10 partes;</p></li>
<li><p><strong>Percentis:</strong> dividem o rol em 100 partes.</p></li></ul>
<h2 data-corrido="sim">Quartis:</h2>
<p>três valores, <span data-type="inline-math" data-latex="Q_1"></span>, <span data-type="inline-math" data-latex="Q_2"></span> e <span data-type="inline-math" data-latex="Q_3"></span>, que dividem o rol em 4 partes;</p>
<ul><li><p><span data-type="inline-math" data-latex="Q_1"></span>: primeiro quartil; 25% dos dados ficam abaixo dele;</p></li>
<li><p><span data-type="inline-math" data-latex="Q_2"></span>: segundo quartil; é a mediana (ver [[Medidas de tendência central]]);</p></li>
<li><p><span data-type="inline-math" data-latex="Q_3"></span>: terceiro quartil; 75% dos dados ficam abaixo dele;</p></li>
<li><p><strong>Procedimento:</strong></p>
<ol><li><p>organizar os dados em rol;</p></li>
<li><p><span data-type="inline-math" data-latex="Q_2"></span>: mediana do rol inteiro;</p></li>
<li><p><span data-type="inline-math" data-latex="Q_1"></span>: mediana da metade inferior, abaixo de <span data-type="inline-math" data-latex="Q_2"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="Q_3"></span>: mediana da metade superior, acima de <span data-type="inline-math" data-latex="Q_2"></span>.</p></li></ol></li>
<li><p><strong>Ex:</strong> amostra <span data-type="inline-math" data-latex="7,\ 9,\ 5,\ 3,\ 4,\ 8"></span></p>
<ol><li><p>Rol: <span data-type="inline-math" data-latex="3,\ 4,\ 5,\ 7,\ 8,\ 9"></span>;</p></li>
<li><p><span data-type="inline-math" data-latex="Q_2=\frac{5+7}{2}=6"></span>;</p></li>
<li><p>Metade inferior <span data-type="inline-math" data-latex="3,\ 4,\ 5"></span>: <span data-type="inline-math" data-latex="Q_1=4"></span>;</p></li>
<li><p>Metade superior <span data-type="inline-math" data-latex="7,\ 8,\ 9"></span>: <span data-type="inline-math" data-latex="Q_3=8"></span>.</p></li></ol></li>
<li><p><strong>Amplitude interquartil:</strong> <span data-type="inline-math" data-latex="AIQ=Q_3-Q_1"></span>; mede a dispersão da metade central dos dados (ver [[Medidas de dispersão]]);</p>
<ul><li><p><strong>Ex:</strong> no rol acima, <span data-type="inline-math" data-latex="AIQ=8-4=4"></span>.</p></li></ul></li></ul>
<h2 data-corrido="sim">Decis:</h2>
<p>nove valores, de <span data-type="inline-math" data-latex="D_1"></span> a <span data-type="inline-math" data-latex="D_9"></span>, que dividem o rol em 10 partes;</p>
<ul><li><p><span data-type="inline-math" data-latex="D_k"></span>: <span data-type="inline-math" data-latex="k\cdot 10\%"></span> dos dados ficam abaixo dele;</p></li>
<li><p><span data-type="inline-math" data-latex="D_5"></span> é a mediana.</p></li></ul>
<h2 data-corrido="sim">Percentis:</h2>
<p>noventa e nove valores, de <span data-type="inline-math" data-latex="P_1"></span> a <span data-type="inline-math" data-latex="P_{99}"></span>, que dividem o rol em 100 partes;</p>
<ul><li><p><span data-type="inline-math" data-latex="P_k"></span>: <span data-type="inline-math" data-latex="k\%"></span> dos dados ficam abaixo dele;</p></li>
<li><p><strong>Equivalências:</strong> <span data-type="inline-math" data-latex="P_{25}=Q_1"></span>; <span data-type="inline-math" data-latex="P_{50}=Q_2=D_5"></span> (mediana); <span data-type="inline-math" data-latex="P_{75}=Q_3"></span>; <span data-type="inline-math" data-latex="P_{10k}=D_k"></span>;</p></li>
<li><p><strong>Obs:</strong> há mais de um método para localizar decis e percentis em um rol; quando a prova adota um, ela o informa.</p></li></ul>
<h2 data-corrido="sim">Comparação entre as separatrizes:</h2>
<table><tbody><tr><th><p><strong>Separatriz</strong></p></th><th><p><strong>Partes</strong></p></th><th><p><strong>Valores</strong></p></th><th><p><strong>Mediana</strong></p></th></tr>
<tr><td><p>Quartis</p></td><td><p>4</p></td><td><p><span data-type="inline-math" data-latex="Q_1"></span> a <span data-type="inline-math" data-latex="Q_3"></span></p></td><td><p><span data-type="inline-math" data-latex="Q_2"></span></p></td></tr>
<tr><td><p>Decis</p></td><td><p>10</p></td><td><p><span data-type="inline-math" data-latex="D_1"></span> a <span data-type="inline-math" data-latex="D_9"></span></p></td><td><p><span data-type="inline-math" data-latex="D_5"></span></p></td></tr>
<tr><td><p>Percentis</p></td><td><p>100</p></td><td><p><span data-type="inline-math" data-latex="P_1"></span> a <span data-type="inline-math" data-latex="P_{99}"></span></p></td><td><p><span data-type="inline-math" data-latex="P_{50}"></span></p></td></tr></tbody></table>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Separatrizes:</h3>
<p>valores que dividem o rol em partes com a mesma quantidade de dados;</p>
<h3 data-corrido="sim">Quartis:</h3>
<p><span data-type="inline-math" data-latex="Q_1"></span>, <span data-type="inline-math" data-latex="Q_2"></span> e <span data-type="inline-math" data-latex="Q_3"></span>; dividem o rol em 4 partes;</p>
<h3 data-corrido="sim">Separatrizes iguais à mediana:</h3>
<p><span data-type="inline-math" data-latex="Q_2=D_5=P_{50}"></span>;</p>
<h3 data-corrido="sim">Amplitude interquartil:</h3>
<p><span data-type="inline-math" data-latex="AIQ=Q_3-Q_1"></span>;</p>
<h3 data-corrido="sim">Decis e percentis:</h3>
<p>decis, 10 partes (<span data-type="inline-math" data-latex="D_1"></span> a <span data-type="inline-math" data-latex="D_9"></span>); percentis, 100 partes (<span data-type="inline-math" data-latex="P_1"></span> a <span data-type="inline-math" data-latex="P_{99}"></span>).</p>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'passe'
   and e.etapa = 2
   and e.texto like 'Estatística: pesquisa e organização de dados%'
   and e.resumo_id is null
   and r.slug = 'estatistica';

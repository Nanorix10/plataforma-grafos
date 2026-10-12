-- Termoquímica: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- Lacuna conferida no banco em 12/10/2026: nenhum resumo trata de termoquímica
-- ou entalpia, e o edital cobra o assunto no PAS-UEM, etapa 2 (ordens 22–26), e
-- no PASSE, etapa 2 (ordens 8–9). Processo `comum`: o caderno é material de
-- prova de escola (PR2G1) e o assunto está nos dois editais (decisão 1c). Sem
-- pai: não há resumo de termoquímica ou de energia nas reações no acervo.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2026/Resumos 3°bi 2° ano/Resumo para PR2G1.docx`, seção
--    QUÍMICA A, §00096–00105 do extrator, com duas figuras. Os outros
--    documentos só têm títulos: `Resumo para PAS UEM 2° etapa.docx`
--    (§00103–00106) e `Resumo para PASSE 2° etapa 2026.docx` (§00221).
--    O exemplo de reação exotérmica vem de `Materias e conteúdos feitos/
--    Quimica.docx`, §00530 ("Reações de Combustão: processo exotérmico").
-- 2. Edital: PAS-UEM, etapa 2, "Reações exotérmicas e endotérmicas: calor
--    envolvido nas transformações químicas e suas representações gráficas.".
-- 3. Provas: PAS-UEM 2022, etapa 2, questão 19 (gabarito 25), em
--    Documents/UEM-Provas/pdfs/pas22/E2.pdf, p. 9 — questão e pegadinha;
--    PAS-UEM 2023, etapa 2, questão 20 (gabarito 10), em
--    Documents/UEM-Provas/pdfs/pas23/E2.pdf, p. 9 — exemplo e pegadinhas;
--    PAS-UEM 2019, etapa 2, questão 20, item 01 (gabarito 23), em
--    Documents/UEM-Provas/pdfs/pas19/E2G1.pdf — "a pressão constante".
--
-- ## O que difere do caderno
-- - Conferência: nenhum erro de conteúdo; fórmula, sinais de ΔH e figuras
--   são coerentes entre si e com as provas.
-- - Acréscimos com fonte: unidade kJ nos símbolos e "Obs: medida a pressão
--   constante" (PAS-UEM 2019 Q20, 2022 Q19); "Ex:" exotérmica = combustão
--   (Quimica.docx §00530); "Ex:" endotérmica = decomposição do HCl
--   (PAS-UEM 2023 Q20); "Fundamento:" Hp < Hr / Hp > Hr (lido das figuras do
--   caderno); tabela comparativa montada só com o conteúdo da seção.
-- - Forma: "quimica" → "química"; o sublinhado de "Variação de entalpia",
--   "Exotérmicas" e "Endotérmicas" virou grafo corrido.
--
-- ## Edital
-- Ligado: PAS-UEM 2 "Reações exotérmicas e endotérmicas: calor envolvido nas
-- transformações químicas e suas representações gráficas.". De fora, cobertos
-- pela metade ou não cobertos: PAS-UEM 2 "Termoquímica" (título do bloco, que
-- inclui energia de ligação e contexto cotidiano), "Princípio da conservação
-- da energia. Energia de ligação.", "Entalpia envolvida nas diferentes
-- transformações.", "Compreensão dos conceitos de termoquímica em contextos
-- cotidianos."; PASSE 2 "Lei de Hess, equação termoquímica e entalpia;" e
-- "Determinação da variação de entalpia nos processos físicos e químicos".

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
select
  'termoquimica',
  'Termoquímica',
  'quimica',
  'comum',
  'Parte da Química que estuda as trocas de calor nos fenômenos químicos, medidas pela variação de entalpia das reações exotérmicas e endotérmicas.',
  '<p>Parte da Química que estuda as trocas de calor que ocorrem durante os fenômenos químicos (ver [[Reações químicas]]);</p>
<ul><li><p><strong>Variação de entalpia:</strong> quantidade de calor absorvido ou liberado por uma reação química;</p></li>
<li><p><strong>Reações exotérmicas:</strong> liberam calor;</p></li>
<li><p><strong>Reações endotérmicas:</strong> absorvem calor.</p></li></ul>
<h2 data-corrido="sim">Variação de entalpia:</h2>
<p>grandeza que revela a quantidade de calor absorvido ou liberado por uma reação química;</p>
<div data-type="block-math" data-latex="\Delta H=H_{produtos}-H_{reagentes}"></div>
<ul><li><p><span data-type="inline-math" data-latex="\Delta H"></span>: variação de entalpia (kJ);</p></li>
<li><p><span data-type="inline-math" data-latex="H_{produtos}"></span>: entalpia dos produtos (kJ);</p></li>
<li><p><span data-type="inline-math" data-latex="H_{reagentes}"></span>: entalpia dos reagentes (kJ);</p></li>
<li><p><strong>Obs:</strong> medida a pressão constante.</p></li></ul>
<h2 data-corrido="sim">Reações exotérmicas:</h2>
<p>liberam calor;</p>
<ul><li><p><span data-type="inline-math" data-latex="\Delta H&lt;0"></span>;</p></li>
<li><p><strong>Fundamento:</strong> a entalpia dos produtos é menor que a dos reagentes;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/diagrama-entalpia-reacao-exotermica.webp" alt="Diagrama de entalpia de uma reação exotérmica: no eixo vertical, a entalpia H; no horizontal, o caminho da reação. A linha dos reagentes, em H R, fica acima da linha dos produtos, em H P, e a seta do ΔH aponta para baixo." style="width:70%" data-largura="70%"></figure></li>
<li><p><strong>Ex:</strong> [[Reações de Combustão]].</p></li></ul>
<h2 data-corrido="sim">Reações endotérmicas:</h2>
<p>absorvem calor;</p>
<ul><li><p><span data-type="inline-math" data-latex="\Delta H&gt;0"></span>;</p></li>
<li><p><strong>Fundamento:</strong> a entalpia dos produtos é maior que a dos reagentes;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/diagrama-entalpia-reacao-endotermica.webp" alt="Diagrama de entalpia de uma reação endotérmica: no eixo vertical, a entalpia H; no horizontal, o caminho da reação. A linha dos reagentes, em H R, fica abaixo da linha dos produtos, em H P, e a seta do ΔH aponta para cima." style="width:70%" data-largura="70%"></figure></li>
<li><p><strong>Ex:</strong> decomposição do HCl, <span data-type="inline-math" data-latex="\ce{2HCl(g) -&gt; H2(g) + Cl2(g)}\quad \Delta H=+184{,}6\ \text{kJ}"></span>.</p></li></ul>
<table><tbody><tr><th><p></p></th><th><p><strong>Exotérmica</strong></p></th><th><p><strong>Endotérmica</strong></p></th></tr>
<tr><td><p>Calor</p></td><td><p>liberado</p></td><td><p>absorvido</p></td></tr>
<tr><td><p>Sinal do ΔH</p></td><td><p><span data-type="inline-math" data-latex="\Delta H&lt;0"></span></p></td><td><p><span data-type="inline-math" data-latex="\Delta H&gt;0"></span></p></td></tr>
<tr><td><p>Entalpias</p></td><td><p><span data-type="inline-math" data-latex="H_{produtos}&lt;H_{reagentes}"></span></p></td><td><p><span data-type="inline-math" data-latex="H_{produtos}&gt;H_{reagentes}"></span></p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>reação com ΔH positivo é endotérmica, e não exotérmica (PAS-UEM 2023, 2ª etapa);</p></li>
<li><p>reações com ΔH negativo são exotérmicas, e não endotérmicas (PAS-UEM 2022, 2ª etapa);</p></li>
<li><p>uma reação endotérmica em recipiente imerso em água absorve calor da água, que é resfriada (PAS-UEM 2023, 2ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="8889f64b-b805-4863-929b-3f3d7116fe72" data-gabarito="25"><p>(PAS-UEM 2022, 2ª etapa) Considere as seguintes reações a pressão constante, em que (g) é o estado gasoso, (l) é o estado líquido e (s) é o estado sólido. (Informações adicionais: calor específico de <span data-type="inline-math" data-latex="\ce{H2O(l)}"></span> = 4,2 J/g°C, calor latente de vaporização de <span data-type="inline-math" data-latex="\ce{H2O(l)}"></span> = 2.264 J/g, calor latente de fusão de <span data-type="inline-math" data-latex="\ce{H2O(s)}"></span> = 336 J/g, sob pressão de 1 atm).</p><p>(I) <span data-type="inline-math" data-latex="\ce{H2(g) + 1/2 O2(g) -&gt; H2O(s)}\quad \Delta H=-291{,}8\ \text{kJ}"></span></p><p>(II) <span data-type="inline-math" data-latex="\ce{H2(g) + 1/2 O2(g) -&gt; H2O(l)}\quad \Delta H=-285{,}8\ \text{kJ}"></span></p><p>(III) <span data-type="inline-math" data-latex="\ce{H2(g) + 1/2 O2(g) -&gt; H2O(g)}\quad \Delta H=-241{,}8\ \text{kJ}"></span></p><p>Assinale o que for correto.</p><p>(01) A entalpia (H) é uma grandeza que expressa a quantidade de energia disponível em um sistema; essa energia pode ser transformada em calor em um processo a pressão constante.</p><p>(02) As três reações apresentadas ocorrem por processos endotérmicos.</p><p>(04) De acordo com a reação (II), para obtermos 180 g de água líquida ocorre uma variação de entalpia total de –51.444 kJ.</p><p>(08) Para fundir 100 g de gelo a 0 °C, o sistema precisa fornecer 33,6 kJ de calor para o gelo.</p><p>(16) Para evaporar 100 g de água a 20 °C, completamente por processo de ebulição a pressão de 1 atm, são necessários 260 kJ de calor.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. A pressão constante, a variação de entalpia corresponde ao calor liberado ou absorvido pela reação;</p><p>(02) Incorreta. As três reações têm <span data-type="inline-math" data-latex="\Delta H&lt;0"></span>: são exotérmicas;</p><p>(04) Incorreta. Com a massa molar da água de 18 g/mol, 180 g correspondem a 10 mol; pela reação (II), <span data-type="inline-math" data-latex="\Delta H=10\cdot(-285{,}8)=-2858\ \text{kJ}"></span>;</p><p>(08) Correta. Na fusão (ver [[Calor latente]]), <span data-type="inline-math" data-latex="Q=m\cdot L=100\cdot 336=33600\ \text{J}=33{,}6\ \text{kJ}"></span>;</p><p>(16) Correta. Aquecimento de 20 °C a 100 °C: <span data-type="inline-math" data-latex="Q_1=m\cdot c\cdot \Delta T=100\cdot 4{,}2\cdot 80=33600\ \text{J}"></span>; vaporização: <span data-type="inline-math" data-latex="Q_2=m\cdot L=100\cdot 2264=226400\ \text{J}"></span>; total: <span data-type="inline-math" data-latex="Q_1+Q_2=260000\ \text{J}=260\ \text{kJ}"></span>;</p><p><strong>Soma: 01 + 08 + 16 = 25</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Termoquímica:</h3>
<p>parte da Química que estuda as trocas de calor que ocorrem durante os fenômenos químicos;</p>
<h3 data-corrido="sim">Variação de entalpia:</h3>
<p>quantidade de calor absorvido ou liberado por uma reação química;</p>
<h3 data-corrido="sim">Cálculo da variação de entalpia:</h3>
<p>ΔH = H produtos − H reagentes;</p>
<h3 data-corrido="sim">Reação exotérmica:</h3>
<p>libera calor, com ΔH &lt; 0;</p>
<h3 data-corrido="sim">Reação endotérmica:</h3>
<p>absorve calor, com ΔH &gt; 0;</p>
<h3 data-corrido="sim">Diagrama de entalpia da reação exotérmica:</h3>
<p>reagentes acima dos produtos, com a seta do ΔH para baixo.</p>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 2
   and e.texto = 'Reações exotérmicas e endotérmicas: calor envolvido nas transformações químicas e suas representações gráficas.'
   and e.resumo_id is null
   and r.slug = 'termoquimica';

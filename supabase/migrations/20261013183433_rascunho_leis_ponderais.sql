-- Leis ponderais: reescrito por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- **Reescreve o resumo que já existe** (`update`, mesmo slug e título). Na data
-- (12/10/2026) ele tinha 0 grifos, 0 respostas, 0 leituras e nenhum wikilink de
-- entrada; o corpo antigo era o texto do caderno transportado, sem abertura,
-- questão, pegadinhas nem "Para revisar". Não se funde com Princípio de
-- Avogadro (decisão do autor, 13/10/2026).
--
-- ## Por que este tópico
-- Conferido no banco em 12/10/2026: o PAS-UEM 1ª etapa nº 28 ("Leis que regem as
-- reações químicas.") estava ligado a `reacoes-quimicas`, cujo corpo não cita
-- Lavoisier, Proust nem Gay-Lussac. O PASSE 1ª etapa nº 16 já é deste resumo.
-- Processo `comum` (decisão 1c), mantido.
--
-- ## Fontes, e só elas
-- 1. Caderno: `Resumos 2025/Resumos 2º bimestre/Resumo para PR2G2.docx`, seção
--    QUÍMICA A, §00057–00064 do extrator (cópia idêntica em
--    `Materias e conteúdos feitos/Quimica.docx`, §00117–00123). Figuras:
--    image8.png (já publicada como lavoisier-e-proust.webp) e image7.png
--    (transcrita como equação e tabela).
-- 2. Edital: PAS-UEM 1ª etapa nº 28; PASSE 1ª etapa nº 16.
-- 3. Provas: PAS-UEM 2015, etapa 1, questão 12 (gabarito 20), em
--    `Documents/UEM-Provas/pdfs/pas15/E1G1CG.pdf`, p. 9: a questão e três
--    pegadinhas (itens 01, 02, 08). PAS-UEM 2024, etapa 1, questão 15
--    (gabarito 25), `pdfs/pas24/E1.pdf`, p. 8: pegadinha do item 04. PAS-UEM
--    2023, etapa 1, questão 15 (gabarito 14), `pdfs/pas23/E1.pdf`, p. 7:
--    pegadinha do item 16. PAS-UEM 2017, etapa 2, questão 20 (gabarito 15),
--    item 02: fonte da condição de mesma temperatura e pressão.
--
-- ## O que difere do caderno
-- a. Correção aprovada pelo autor (13/10/2026): Gay-Lussac ganha "nas mesmas
--    condições de temperatura e pressão" (fonte: o Princípio de Avogadro do
--    caderno, PR1G2 §00056, e PAS-UEM 2017, 2ª etapa, questão 20, item 02).
-- b. Acréscimos lidos da figura e da tabela do caderno: `Ex:` de Lavoisier e
--    de Proust, a `Consequência:` de Proust (a massa dobra junto) e o exemplo
--    resolvido de Gay-Lussac (proporção 1 : 1 : 1/2 aplicada a 2 L).
-- c. Normalizações de forma: "suma" → "soma"; "produtos formulados" →
--    "produtos formados"; "igual a soma dos reagentes" → "igual à soma das
--    massas dos reagentes"; "proporções fixa em volume" → "proporção fixa em
--    volume"; "M reagentes= M produtos" → m_reagentes = m_produtos;
--    "fixas/constantes" → "fixas ou constantes".
--
-- ## Edital
-- Liga: PAS-UEM 1ª etapa nº 28, tirado de `reacoes-quimicas` (só se ainda
-- estiver lá). Fica: PASSE 1ª etapa nº 16, já ligado. Fora: PAS-UEM nº 25 e
-- nº 26 (não tratam do assunto) e nº 27 (de `calculo-estequiometrico`).

-- 1. O corpo novo.
update resumos
   set definicao = 'Lavoisier, Proust e Gay-Lussac: as leis que regem as massas e os volumes numa reação química.',
       corpo = '<p>princípios que descrevem as relações de massas entre as substâncias que participam de reações químicas ([[Reações químicas]]);</p>
<ul><li><p><strong>Lei de Lavoisier:</strong> conservação das massas;</p></li>
<li><p><strong>Lei de Proust:</strong> proporções fixas ou constantes;</p></li>
<li><p><strong>Lei volumétrica de Gay-Lussac:</strong> proporção fixa em volume, nas reações entre gases.</p></li></ul>
<h2 data-corrido="sim">Lei de Lavoisier (conservação das massas):</h2>
<p>em uma reação, a soma das massas dos produtos formados deve ser igual à soma das massas dos reagentes iniciais;</p>
<div data-type="block-math" data-latex="m_{\text{reagentes}} = m_{\text{produtos}}"></div>
<ul><li><p><span data-type="inline-math" data-latex="m_{\text{reagentes}}"></span>: massa total dos reagentes (g);</p></li>
<li><p><span data-type="inline-math" data-latex="m_{\text{produtos}}"></span>: massa total dos produtos (g);</p></li>
<li><p><strong>Enunciado:</strong> <em>na natureza, nada se cria e nada se perde, tudo se transforma</em>;</p></li>
<li><p><strong>Obs:</strong> a lei é melhor observada quando a reação é feita em sistema fechado;</p>
<ul><li><p><strong>Fundamento:</strong> o sistema fechado impede o escape de gás para a atmosfera ou a entrada de ar no sistema;</p></li></ul></li>
<li><p><strong>Ex:</strong> 2 g de hidrogênio + 16 g de oxigênio formam 18 g de água.</p></li></ul>
<h2 data-corrido="sim">Lei das proporções fixas ou constantes (Proust):</h2>
<p>em uma reação, os reagentes sempre reagem em uma proporção fixa e constante, formando sempre o mesmo produto;</p>
<ul><li><p><strong>Consequência:</strong> dobrando a massa de um reagente, dobra a massa do outro reagente e a do produto;</p></li>
<li><p><strong>Ex:</strong> 2 g de hidrogênio reagem com 16 g de oxigênio, e 4 g de hidrogênio reagem com 32 g de oxigênio.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/lavoisier-e-proust.webp" alt="Hidrogênio mais oxigênio formando água, em duas linhas: 2g mais 16g dão 18g, e 4g mais 32g dão 36g. A conservação da massa total é a Lei de Lavoisier; a proporção fixa entre os reagentes, que dobra junto, é a Lei de Proust." style="width:100%" data-largura="100%"></figure>
<h2 data-corrido="sim">Lei volumétrica de Gay-Lussac:</h2>
<p>em uma reação envolvendo gases, nas mesmas condições de temperatura e pressão, a proporção em mols sempre equivale à proporção, em litros, dos volumes (proporção fixa em volume);</p>
<ul><li><p><strong>Ex:</strong> decomposição do vapor de água;</p></li></ul>
<div data-type="block-math" data-latex="\ce{H2O(v) -&gt; H2(g) + 1/2 O2(g)}"></div>
<table><tbody><tr><th><p><strong><span data-type="inline-math" data-latex="\ce{H2O(v)}"></span></strong></p></th><th><p><strong><span data-type="inline-math" data-latex="\ce{H2(g)}"></span></strong></p></th><th><p><strong><span data-type="inline-math" data-latex="\ce{O2(g)}"></span></strong></p></th></tr>
<tr><td><p>1 L</p></td><td><p>1 L</p></td><td><p>0,5 L</p></td></tr>
<tr><td><p>1,5 L</p></td><td><p>1,5 L</p></td><td><p>0,75 L</p></td></tr>
<tr><td><p>2 L</p></td><td><p>2 L</p></td><td><p>1 L</p></td></tr></tbody></table>
<ol><li><p>Lê-se a proporção em mols na equação: <span data-type="inline-math" data-latex="1 : 1 : \tfrac{1}{2}"></span>;</p></li>
<li><p>Pela Lei de Gay-Lussac, a mesma proporção vale para os volumes dos gases;</p></li>
<li><p>Com 2 L de vapor de água: <span data-type="inline-math" data-latex="2 \cdot 1 = 2"></span> L de <span data-type="inline-math" data-latex="\ce{H2}"></span> e <span data-type="inline-math" data-latex="2 \cdot \tfrac{1}{2} = 1"></span> L de <span data-type="inline-math" data-latex="\ce{O2}"></span>.</p></li></ol>
<ul><li><p><strong>Obs:</strong> as relações de mol, massa e volume são a base do [[Cálculo estequiométrico]].</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>a lei de Lavoisier é a conservação das massas, e não a Lei das Proporções Definidas, que é a de Proust (PAS-UEM 2015, 1ª etapa);</p></li>
<li><p>a lei de Lavoisier é observada em sistema fechado, e não em sistema aberto (PAS-UEM 2015, 1ª etapa);</p></li>
<li><p>a degradação do corpo de um animal morto não é perda de matéria: a matéria se transforma, e a lei de Lavoisier se aplica (PAS-UEM 2015, 1ª etapa);</p></li>
<li><p>segundo Lavoisier, a quantidade de átomos é igual nos dois lados da equação: átomos não são convertidos em energia (PAS-UEM 2024, 1ª etapa);</p></li>
<li><p>uma equação não balanceada, como <span data-type="inline-math" data-latex="\ce{C2H6O + 3O2 -&gt; CO2 + H2O}"></span>, não está de acordo com a lei de Lavoisier (PAS-UEM 2023, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="e2b1ba3d-bda8-486e-ad66-d6e0be29d5aa" data-gabarito="20"><p>(PAS-UEM 2015, 1ª etapa) Os estudos experimentais realizados por Lavoisier o levaram a formular uma importante lei da Química, a qual também pode ser aplicada a sistemas biológicos. Sobre o assunto, assinale o que for correto.</p><p>(01) O corpo de um animal morto é degradado com o tempo. Isso significa perda de matéria e, portanto, a Lei de Lavoisier não pode ser aplicada nesta situação.</p><p>(02) A Lei de Lavoisier é comprovada em sistemas abertos, como ocorre em todos os sistemas biológicos.</p><p>(04) A respiração celular é semelhante a uma reação de combustão que ocorre em nosso corpo, onde a glicose é o combustível e o oxigênio é o comburente.</p><p>(08) A lei enunciada por Lavoisier ficou conhecida como Lei das Proporções Definidas.</p><p>(16) O processo de respiração celular é uma reação de combustão; no entanto sua energia é liberada em diferentes etapas para que não ocorram danos às células.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. Na natureza nada se perde, tudo se transforma: a matéria do corpo se transforma, e a lei de Lavoisier se aplica;</p><p>(02) Incorreta. A lei de Lavoisier é melhor observada em sistema fechado, que impede o escape de gás e a entrada de ar;</p><p>(04) Correta. Conforme o gabarito oficial; o item trata da respiração celular ([[Metabolismo energético]]);</p><p>(08) Incorreta. A lei de Lavoisier é a conservação das massas; a das proporções definidas é a de Proust;</p><p>(16) Correta. Conforme o gabarito oficial; o item trata da respiração celular;</p><p><strong>Soma: 04 + 16 = 20</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Leis ponderais:</h3>
<p>princípios que descrevem as relações de massas entre as substâncias de uma reação;</p>
<h3 data-corrido="sim">Lei de Lavoisier:</h3>
<p>a massa dos reagentes é igual à massa dos produtos; nada se cria, nada se perde, tudo se transforma;</p>
<h3 data-corrido="sim">Sistema fechado:</h3>
<p>condição em que a lei de Lavoisier é melhor observada, sem escape de gás nem entrada de ar;</p>
<h3 data-corrido="sim">Lei de Proust:</h3>
<p>os reagentes reagem sempre em proporção fixa e constante;</p>
<h3 data-corrido="sim">Lei volumétrica de Gay-Lussac:</h3>
<p>entre gases, nas mesmas condições de temperatura e pressão, a proporção em mols equivale à proporção em volume.</p>'
 where slug = 'leis-ponderais';

-- 2. Edital: o nº 28 passa de reacoes-quimicas para este, só se ainda estiver lá.
update edital_topicos e
   set resumo_id = novo.id
  from resumos novo, resumos atual
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.materia_slug = 'quimica'
   and e.texto = 'Leis que regem as reações químicas.'
   and e.resumo_id = atual.id
   and atual.slug = 'reacoes-quimicas'
   and novo.slug = 'leis-ponderais';

-- 3. Refaz as conexões com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'leis-ponderais';

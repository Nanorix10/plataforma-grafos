-- Importa o documento-mestre de Matemática, vindo de "Materias e conteúdos
-- feitos/Matemática.docx": a análise combinatória.
--
-- **Um** resumo e três figuras. `processo_slug = 'comum'`, como as outras
-- matérias vindas dos documentos-mestre (decisão 1c).
--
-- Com ele, as oito matérias do recorte por disciplina estão no site. O que
-- sobra da pasta "pro site" são as 59 provas da escola e dois PDFs.
--
-- ## É o menor documento da pasta, e não é engano
--
-- 644 KB, treze linhas, um único tópico de nível 0. A Matemática do autor está
-- quase toda nos outros recortes — o que existe por matéria é só a
-- combinatória, e mesmo assim só os três princípios de contagem, sem arranjo,
-- combinação nem permutação.
--
-- Conferido contra o banco antes de escrever: a Matemática tem seis resumos
-- publicados (funções do 1º e 2º grau, logarítmica, medidas de tendência
-- central, de dispersão e sistemas lineares) e nenhum deles toca em
-- combinatória. Nenhum título do acervo colide.
--
-- ## As três figuras
--
-- 165 KB no documento, 44 KB no repositório em WebP q82. São diagramas de Venn
-- e entram a 100%: cada um é o desenho do princípio que está ao lado dele, e a
-- diferença entre "dois conjuntos separados" e "dois conjuntos que se cruzam"
-- é justamente o que a figura mostra.
--
-- Nenhuma é PNG de 1×1, e o documento não tem caixa de texto — os dois cheques
-- que a Biologia e o programa do PAS/UEM tornaram obrigatórios.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- **A fórmula da inclusão-exclusão para TRÊS conjuntos está incompleta.** O
-- documento traz
--
--     n(A∪B∪C) = n(A)+n(B)+n(C)-n(A∩B)
--
-- e o certo seria
--
--     n(A∪B∪C) = n(A)+n(B)+n(C)-n(A∩B)-n(A∩C)-n(B∩C)+n(A∩B∩C)
--
-- Faltam três termos. Entra como está — transportar não é reescrever, e
-- inventar os termos que faltam é exatamente o que a decisão 9c proíbe em
-- letra. **Vale avisar o autor**, porque a figura ao lado tem as três
-- interseções desenhadas e a fórmula não as usa: quem estudar por ela erra.
--
-- Também ficam como estão **"Principio fundamental da contagem"**, sem acento
-- no "Princípio", e o "f" solto que o documento tem como último parágrafo.
--
-- Os nós de fórmula passaram pelo KaTeX antes de entrar, com o cheque da COR do
-- `errorColor` — não o da classe `katex-error`, que o modo não-estrito não
-- emite e que deixou dois `\sen` passarem na Física.
--
-- Não há `[[wikilink]]`. `on conflict (slug) do nothing` deixa rodar de novo
-- sem duplicar.
--
-- O número da versão é o que ficou registrado no histórico do Supabase, e o
-- arquivo foi renomeado para ele.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'analise-combinatoria',
  'Análise combinatória',
  'matematica',
  'comum',
  'Os três princípios de contagem — somar quando as decisões são independentes, descontar a interseção quando não são, e multiplicar quando uma vem depois da outra.',
  '<h2 data-corrido="sim">Princípio aditivo:</h2>
<p>Se uma decisão A pode ser tomada de <span data-type="inline-math" data-latex="x"></span> maneiras, e uma decisão B pode ser tomada de <span data-type="inline-math" data-latex="y"></span> maneiras, sendo elas independentes, então o número de maneiras de tomar as decisões A ou B é <span data-type="inline-math" data-latex="x+y"></span>;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/conjuntos-disjuntos.webp" alt="Diagrama de Venn: dentro do retângulo do universo U, dois conjuntos A e B desenhados como elipses separadas, sem nenhum ponto em comum." style="width:100%" data-largura="100%"></figure>
<div data-type="block-math" data-latex="n(A∪B)=n(A)+n(B)"></div>
<h2>Princípio da inclusão-exclusão</h2>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/intersecao-de-dois-conjuntos.webp" alt="Diagrama de Venn: dentro do universo U, os conjuntos A e B como dois círculos que se sobrepõem, com uma região comum no meio." style="width:100%" data-largura="100%"></figure>
<div data-type="block-math" data-latex="n(A∪B)=n(A)+n(B)-n(A∩B)"></div>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/matematica/intersecao-de-tres-conjuntos.webp" alt="Diagrama de Venn: dentro do universo U, os conjuntos A, B e C como três círculos que se cruzam dois a dois e têm também uma região comum aos três no centro." style="width:100%" data-largura="100%"></figure>
<div data-type="block-math" data-latex="n(A∪B∪C)=n(A)+n(B)+n(C)-n(A∩B)"></div>
<h2 data-corrido="sim">Principio fundamental da contagem (da multiplicação):</h2>
<p>se uma decisão A pode ser tomada de <span data-type="inline-math" data-latex="x"></span> maneiras e se, para cada uma das x escolhas, outra decisão B pode ser tomada de <span data-type="inline-math" data-latex="y"></span> maneiras, então o número de maneiras de tomar as decisões A e B é <span data-type="inline-math" data-latex="x⋅y"></span>;</p>'
) on conflict (slug) do nothing;

-- O trigger `trg_sync_conexoes_resumo` roda no insert e resolve cada
-- `[[wikilink]]` procurando o resumo de destino pelo título. Este não traz
-- wikilink nenhum, mas o update vazio é o fecho padrão das migrations de
-- importação (decisão 9c) e custa nada.
update resumos set corpo = corpo where materia_slug = 'matematica';

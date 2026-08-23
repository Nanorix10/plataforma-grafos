-- Importa a 2ª etapa do PAS UEM, vinda de "Resumo para PAS UEM 2° etapa.docx".
--
-- Dezenove resumos: onze pais, um por matéria, e oito filhos — os tópicos que
-- estão escritos. O documento tem doze matérias e **três** com texto: Química
-- (Dispersões e Concentração), Física (as três dilatações, propagação de calor
-- e calor latente) e Sociologia (Durkheim). O resto é a lista do edital.
--
-- ## Por que agora existe um resumo-pai por matéria
--
-- Nas importações de agosto todo resumo entrou na raiz, e o comentário da
-- cinemática dizia por quê: `pai_id` é estrutura escrita à mão pelo autor, não
-- hierarquia que o migrador deva inferir. Aqui o autor pediu — perguntado sobre
-- o que fazer com os cento e vinte tópicos do edital que não têm uma linha, ele
-- escolheu "entram só como sumário do pai".
--
-- Então cada matéria ganha um resumo cujo corpo é a lista dos tópicos daquela
-- etapa, na ordem do documento, e os tópicos escritos ficam pendurados nele por
-- `pai_id`. O aluno passa a ver o edital inteiro — o que já tem e o que falta —
-- em vez de uma matéria que parece não existir. E o mapa ganha onze nós com
-- ramo, que é o desenho que o documento sempre teve e o site ainda não.
--
-- O pai NÃO linka os filhos em `[[…]]`: conter e citar são os dois eixos da
-- decisão 9, e linkar quem já está pendurado desenha a mesma relação duas vezes.
--
-- Redação ficou de fora. O edital dela no documento é a letra "R", sozinha —
-- um marcador que o autor deixou para preencher depois. Um resumo com um
-- caractere não é sumário de nada.
--
-- ## O que muda de FORMA
--
-- O mapeamento saiu de comparar o `.docx` da 1ª etapa com o que já está no
-- banco (`substancias`, `propriedades-da-materia`, `ciclo-celular`), e não de
-- gosto. É o mesmo documento e o mesmo autor, então o resultado sai igual ao
-- que ele já aprovou:
--
-- - tópico em NEGRITO no nível 0 → título do resumo, e a definição que vem
--   depois dos dois pontos vira o `<p>` de abertura do corpo;
-- - nível 1 com definição → `<h2 data-corrido="sim">Termo:</h2>` mais o
--   parágrafo, que é o formato de origem `**Termo:** definição;`;
-- - nível 1 que só apresenta a lista abaixo ("Tipos de soluções:") → `<p>`,
--   como o "Fases da mitose:" do ciclo celular;
-- - nível 2 e 3 que abrem seção → `h3`/`h4` corridos; item folha continua item
--   de lista;
-- - equação OMML → `<span data-type="inline-math">`, com `{x}_{0}` normalizado
--   para `x_0`, que é como as fórmulas já gravadas se escrevem;
-- - `m²` e `Q_A` que no Docs eram sobrescrito e subscrito de TEXTO viram
--   `<sup>`/`<sub>`, nunca o caractere Unicode (decisão 8b).
--
-- **O sublinhado do documento não tem par no site.** O autor marca o termo
-- definido sublinhando-o ("__Solvente__: quem dissolve"). Onde ele abre um
-- item, o `:` já cumpre o papel e o sublinhado vira texto puro — foi o que a
-- importação da Química fez, e manter diferente deixaria dois resumos irmãos
-- com aparências distintas. Onde ele grifa no MEIO da frase ("ponto de
-- saturação"), vira `<strong>`: ali não há dois pontos para marcar nada, e sem
-- a marca a ênfase sumiria. Negrito continua sendo grafo e só grafo (decisão
-- 12) — `<strong>` pesa 500, o título pesa 800.
--
-- ## Duas "imagens" que não eram imagem
--
-- As tabelas de solubilidade das duas questões (a do KNO₃ e a da sacarose)
-- vinham como print. Print de tabela não se seleciona, não rola no celular e
-- tem fundo branco — no tema escuro seria um retângulo aceso no meio do texto.
-- As duas entram como `<table>` de verdade, com os mesmos números.
--
-- A terceira imagem continua imagem, porque ali o desenho É a explicação: a
-- escala de diâmetro que separa solução verdadeira, colóide e suspensão.
-- PNG → WebP q82: 57 KB no documento, 14 KB no repositório.
--
-- ## Os dois exemplos resolvidos viraram questão com gaveta
--
-- O do nitrato de potássio e o da sacarose da Fuvest. No Docs a resolução fica
-- logo abaixo do enunciado, e o olho a lê antes de a cabeça tentar — é o
-- problema que `aside class="questao"` + `div class="resolucao"` existe para
-- resolver. O texto é o mesmo, palavra por palavra; muda só quando a resposta
-- aparece.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **A tabela das solidariedades está com as colunas trocadas.** O cabeçalho
--   diz "orgânica" na coluna das sociedades simples, pré-capitalistas, de
--   direito repressivo e trabalho rudimentar — que é a descrição da mecânica em
--   Durkheim, e vice-versa. Entrou exatamente como está no documento. **Vale
--   avisar o autor**, porque isso é o que o aluno vai decorar.
-- - "Calor e equilíbrio térmicoi", com o i sobrando, no edital de Física.
-- - "calor da mudança de estado físico de um substância", em Calor latente.
-- - "Variação de estado fisico" e "Equilibrio térmico" sem acento, no mesmo.
-- - "analisá los" e "respeitá los" sem hífen, em Durkheim.
-- - "socieades humanas", em Suicídio.
-- - "Soluções não-eletrolítica" com o s fora do sublinhado, em Dispersões.
-- - "todos os carboidratos (açúcares) em H₂O;;" com dois pontos e vírgula.
-- - "É diretamente proporcional a temperatura", sem crase.
--
-- As trinta e oito fórmulas destes resumos passaram pelo KaTeX (com mhchem)
-- antes de entrar: nenhuma falha. Não há `[[wikilink]]` nesta leva, então
-- também não há `update corpo = corpo` no fim. `on conflict (slug) do nothing`
-- deixa rodar de novo sem duplicar.

-- ============================================
-- 1. Os pais: um por matéria, com o sumário do edital
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'quimica-2-etapa-pas-uem',
  'Química na 2ª etapa do PAS UEM',
  'quimica',
  'pas-uem',
  'O que a 2ª etapa cobre em Química, na ordem do documento — e o que já está escrito.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento. Os que já têm texto estão pendurados aqui como resumos.</p><ul><li><p>Dispersões;</p></li><li><p>Concentração;</p></li><li><p>Impactos das soluções no corpo humano e no ambiente;</p></li><li><p>Teoria das colisões (aspectos qualitativos);</p></li><li><p>Fatores que afetam a velocidade de reações;</p></li><li><p>Lei cinética das reações;</p></li><li><p>Energia de ativação e catalisadores;</p></li><li><p>Representação gráfica de processos cinéticos;</p></li><li><p>Conceito de equilíbrio químico;</p></li><li><p>Constante de equilíbrio;</p></li><li><p>Princípio de Le Chatelier;</p></li><li><p>Equilíbrios ácido-base em solução;</p></li><li><p>Produto iônico da água, pH e pOH;</p></li><li><p>Princípio da conservação de energia; energia de ligação;</p></li><li><p>Reações exotérmicas e endotérmicas;</p></li><li><p>Entalpia e suas representações gráficas;</p></li><li><p>Termoquímica em contextos cotidianos;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'fisica-2-etapa-pas-uem',
  'Física na 2ª etapa do PAS UEM',
  'fisica',
  'pas-uem',
  'O que a 2ª etapa cobre em Física, na ordem do documento — e o que já está escrito.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento. Os que já têm texto estão pendurados aqui como resumos.</p><ul><li><p>Densidade e massa específica;</p></li><li><p>Pressão, Lei de Stevin e Princípio de Pascal;</p></li><li><p>Empuxo e Princípio de Arquimedes;</p></li><li><p>Vazão e equação da continuidade;</p></li><li><p>Equação de Bernoulli;</p></li><li><p>Temperatura e Lei Zero da Termodinâmica;</p></li><li><p>Escalas termométricas;</p></li><li><p>Dilatação térmica de sólidos e líquidos;</p></li><li><p>Dilatação linear;</p></li><li><p>Dilatação superficial;</p></li><li><p>Dilatação volumétrica;</p></li><li><p>Gases ideais e equação de Clapeyron;</p></li><li><p>Teoria cinética dos gases;</p></li><li><p>Calor e equilíbrio térmicoi;</p></li><li><p>Capacidade térmica e calor específico;</p></li><li><p>Propagação de calor;</p></li><li><p>Calor latente;</p></li><li><p>Condutores e isolantes térmicos;</p></li><li><p>Primeira Lei da Termodinâmica;</p></li><li><p>Máquinas térmicas e ciclo de Carnot;</p></li><li><p>Entropia e Segunda Lei da Termodinâmica;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'matematica-2-etapa-pas-uem',
  'Matemática na 2ª etapa do PAS UEM',
  'matematica',
  'pas-uem',
  'O que a 2ª etapa cobre em Matemática, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Princípio multiplicativo e aditivo;</p></li><li><p>Problemas de contagem;</p></li><li><p>Fatorial, arranjo, combinação e permutação;</p></li><li><p>Conceito de probabilidade e espaços amostrais;</p></li><li><p>Probabilidade da união e interseção de eventos;</p></li><li><p>Geometria Plana;</p></li><li><p>Congruência de triângulos;</p></li><li><p>Semelhança de triângulos;</p></li><li><p>Relações métricas no triângulo retângulo;</p></li><li><p>Relações trigonométricas no triângulo retângulo;</p></li><li><p>Lei dos Senos e Lei dos Cossenos;</p></li><li><p>Área de triângulos e quadriláteros (trapézio, paralelogramo, losango, quadrado);</p></li><li><p>Área de polígonos regulares;</p></li><li><p>Funções reais: conceito e relação de dependência;</p></li><li><p>Função do 1º grau: propriedades, coeficientes, raízes, gráfico e função inversa;</p></li><li><p>Função do 2º grau: propriedades, raízes, máximo/mínimo e gráfico;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'portugues-2-etapa-pas-uem',
  'Língua Portuguesa na 2ª etapa do PAS UEM',
  'portugues',
  'pas-uem',
  'O que a 2ª etapa cobre em Língua Portuguesa. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Compreensão e interpretação de textos;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'literatura-2-etapa-pas-uem',
  'Literatura na 2ª etapa do PAS UEM',
  'literatura',
  'pas-uem',
  'O que a 2ª etapa cobre em Literatura. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>“A arte das palavras não só escrita como também falada ou representada.” Aristóteles;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'biologia-2-etapa-pas-uem',
  'Biologia na 2ª etapa do PAS UEM',
  'biologia',
  'pas-uem',
  'O que a 2ª etapa cobre em Biologia, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Regras de nomenclatura, classificação e sistemática filogenética;</p></li><li><p>Caracterização dos vírus;</p></li><li><p>Reino Monera, Protista, Fungi, Plantae e Animalia;</p></li><li><p>Doenças bacterianas, viroses, protozoonoses e verminoses;</p></li><li><p>Morfologia e fisiologia: poríferos, cnidários, platelmintos, nematelmintos, moluscos, anelídeos, artrópodes, equinodermos, protocordados e vertebrados;</p></li><li><p>Reprodução e desenvolvimento embrionário e pós-embrionário humano;</p></li><li><p>Sistemas: revestimento, sustentação e locomoção, nutrição, circulação, respiração, excreção, coordenação nervosa e hormonal, órgãos sensoriais;</p></li><li><p>Tecidos vegetais;</p></li><li><p>Morfologia de órgãos vegetativos e reprodutivos;</p></li><li><p>Briófitas, pteridófitas, gimnospermas e angiospermas (morfologia, reprodução e ciclos de vida);</p></li><li><p>Absorção e transporte de substâncias nas plantas;</p></li><li><p>Transpiração e gutação;</p></li><li><p>Crescimento e desenvolvimento vegetal;</p></li><li><p>Ciência e saúde relacionados aos conteúdos da Etapa 2;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'geografia-2-etapa-pas-uem',
  'Geografia na 2ª etapa do PAS UEM',
  'geografia',
  'pas-uem',
  'O que a 2ª etapa cobre em Geografia, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Estrutura geológica e relevo do Brasil;</p></li><li><p>Circulação atmosférica e climas do Brasil;</p></li><li><p>Bacias hidrográficas;</p></li><li><p>Biomas brasileiros;</p></li><li><p>Domínios morfoclimáticos;</p></li><li><p>Recursos naturais e impactos ambientais;</p></li><li><p>Industrialização e distribuição espacial das indústrias;</p></li><li><p>Matriz energética;</p></li><li><p>Estrutura fundiária e colonização;</p></li><li><p>Relações de trabalho no campo;</p></li><li><p>Reforma agrária e conflitos rurais;</p></li><li><p>Transformações tecnológicas no campo;</p></li><li><p>Cooperativas e agroindústrias;</p></li><li><p>Fronteiras agrícolas e êxodo rural;</p></li><li><p>Urbanização brasileira;</p></li><li><p>Hierarquia das cidades e rede urbana;</p></li><li><p>Problemas socioambientais urbanos;</p></li><li><p>Produção, transporte e comunicação;</p></li><li><p>Composição étnica da população;</p></li><li><p>Dinâmica populacional (natalidade, mortalidade, IDH, pirâmides etárias);</p></li><li><p>Movimentos migratórios;</p></li><li><p>Diversidade cultural;</p></li><li><p>Regionalização do Brasil;</p></li><li><p>Aspectos geográficos do Paraná;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'arte-2-etapa-pas-uem',
  'Arte na 2ª etapa do PAS UEM',
  'arte',
  'pas-uem',
  'O que a 2ª etapa cobre em Arte, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>A voz cantada;</p></li><li><p>Música corporal;</p></li><li><p>Orquestra;</p></li><li><p>Música ocidental: período moderno e romântico;</p></li><li><p>MPB — Música Popular Brasileira;</p></li><li><p>Música sertaneja;</p></li><li><p>Neoclassicismo na Europa e no Brasil;</p></li><li><p>Renascimento na Itália;</p></li><li><p>Barroco na Europa e no Brasil;</p></li><li><p>Teatro engajado e Teatro do Oprimido;</p></li><li><p>Processos de criação teatral: teatro paranaense, amador e universitário;</p></li><li><p>O corpo na dança;</p></li><li><p>Dança Moderna;</p></li><li><p>Danças folclóricas;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'filosofia-2-etapa-pas-uem',
  'Filosofia na 2ª etapa do PAS UEM',
  'filosofia',
  'pas-uem',
  'O que a 2ª etapa cobre em Filosofia, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Ética da virtude;</p></li><li><p>Deontologia;</p></li><li><p>Utilitarismo;</p></li><li><p>Direitos humanos, bioética e ética ambiental;</p></li><li><p>A pólis grega e o Estado moderno;</p></li><li><p>Formas de governo;</p></li><li><p>Estado e sociedade civil; soberania; cidadania;</p></li><li><p>Liberalismo, socialismo e contratualismo;</p></li><li><p>Justiça distributiva;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sociologia-2-etapa-pas-uem',
  'Sociologia na 2ª etapa do PAS UEM',
  'sociologia',
  'pas-uem',
  'O que a 2ª etapa cobre em Sociologia, na ordem do documento — e o que já está escrito.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento. Os que já têm texto estão pendurados aqui como resumos.</p><ul><li><p>Constituição das sociedades modernas e surgimento da sociologia;</p></li><li><p>Émile Durkheim;</p></li><li><p>Max Weber;</p></li><li><p>Karl Marx;</p></li><li><p>Teorias sociológicas contemporâneas;</p></li><li><p>Princípios teóricos e metodológicos da investigação sociológica;</p></li><li><p>Método etnográfico e saber antropológico;</p></li><li><p>Diversidade cultural e etnocentrismo;</p></li><li><p>Cultura brasileira e suas matrizes étnicas;</p></li><li><p>Organização do trabalho em diversas formas de vida social;</p></li><li><p>Trabalho nas sociedades capitalistas (constituição histórica);</p></li><li><p>Trabalho, novas tecnologias e globalização;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- O documento abre DUAS seções chamadas "HISTÓRIA": a segunda tem um item só,
-- do Paraná no século XIX, e é claramente a história regional. As duas entram
-- num pai só, na ordem em que aparecem — inventar um segundo resumo a partir de
-- um cabeçalho repetido seria adivinhar o que o autor quis.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'historia-2-etapa-pas-uem',
  'História na 2ª etapa do PAS UEM',
  'historia',
  'pas-uem',
  'O que a 2ª etapa cobre em História, na ordem do documento. Nenhum tópico escrito ainda.',
  '<p>Os tópicos da 2ª etapa, na ordem do documento.</p><ul><li><p>Renascimento, Reforma Religiosa e Revolução Científica;</p></li><li><p>Colonização nas Américas e Mercantilismo;</p></li><li><p>Sociedades indígenas e impacto das invasões;</p></li><li><p>Revoluções burguesas (Inglaterra e França);</p></li><li><p>Revolução Industrial e desenvolvimento do capitalismo;</p></li><li><p>Liberalismo e pensamento protecionista (séc. XVIII e XIX);</p></li><li><p>Crise dos impérios coloniais e independências nas Américas;</p></li><li><p>Conservadorismo, nacionalismo e socialismo no séc. XIX;</p></li><li><p>EUA: formação, expansão, guerra civil e industrialização;</p></li><li><p>Brasil Imperial (1822–1889): economia, política, sociedade e cultura;</p></li><li><p>Paraná no século XIX: indígenas, europeus, africanos, conflitos e trabalho;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 2. Química: os dois tópicos escritos
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'dispersoes',
  'Dispersões',
  'quimica',
  'pas-uem',
  'Soluto e solvente, os três tamanhos de partícula, o coeficiente de solubilidade e a saturação.',
  '<p>misturas formadas por um disperso (soluto) e um dispersante (solvente);</p><h2 data-corrido="sim">Solvente:</h2><p>quem dissolve;</p><h2 data-corrido="sim">Soluto:</h2><p>quem é dissolvido;</p><p>Em soluções aquosas, a água é sempre o solvente;</p><p>São classificados conforme o tamanho das partículas dispersas na solução:</p><table><tbody><tr><th><p>Tipo de Dispersão</p></th><th><p>Tamanho médio das partículas dispersas</p></th><th><p>Visibilidade do soluto</p></th><th><p>Características e natureza das partículas dispersas</p></th><th><p>Exemplos</p></th></tr><tr><td><p>Soluções</p></td><td><p>&lt; 1 nm</p></td><td><p>Não a olho nu, nem a microscópio óptico.</p></td><td><p>Átomos, moléculas e íons.</p></td><td><p>Sal em água, álcool 70, ouro 18k.</p></td></tr><tr><td><p>Colóides</p></td><td><p>1 a 1000 nm</p></td><td><p>Não visível a olho nu e visível a ultramicroscópio.</p></td><td><p>Moléculas ou íons, grandes aglomerados de moléculas ou íons.</p></td><td><p>Gelatina em água, emulsões (cremes em geral, maionese).</p></td></tr><tr><td><p>Suspensões</p></td><td><p>&gt;1000 nm</p></td><td><p>Visível a olho nu.</p></td><td><p>Aglomerados de moléculas ou íons.</p></td><td><p>Areia em água.</p></td></tr></tbody></table><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/tamanho-das-particulas-dispersas.webp" alt="Escala de diâmetro das partículas: até 1 nm são soluções verdadeiras, de 1 a 1.000 nm colóides, e acima de 1.000 nm suspensões." style="width:100%" data-largura="100%"></figure><p>Tipos de soluções:</p><ul><li><p>Sólidas: ouro 18k, bronze, solda eletrônica;</p></li><li><p>Líquidas: soro fisiológico, álcool 70, água potável filtrada, gasolina comum, acetona comum;</p></li><li><p>Gasosas: qualquer mistura gasosa;</p></li></ul><h2 data-corrido="sim">Solução eletrolítica:</h2><p>possui íons dispersos no solvente.</p><ul><li><p>Ex: ácidos, bases e sais dissolvidos em H<sub>2</sub>O;</p></li></ul><h2 data-corrido="sim">Soluções não-eletrolíticas:</h2><p>não possuem íons dispersos;</p><ul><li><p>Ex: todos os carboidratos (açúcares) em H<sub>2</sub>O;;</p></li></ul><h2 data-corrido="sim">Coeficiente de solubilidade (Cs):</h2><p>indica a quantidade máxima de soluto que se dissolve em uma quantidade padrão de H<sub>2</sub>O; <strong>ponto de saturação</strong>;</p><ul><li><p><span data-type="inline-math" data-latex="C_S=\frac{gramas de soluto}{100g H_2O}"></span></p></li><li><p>É diretamente proporcional a temperatura;</p><ul><li><p>Ex: <span data-type="inline-math" data-latex="C_s sacarose=180/100g H_2O  a  20°C"></span></p><p><span data-type="inline-math" data-latex="C_s sacarose=220/100g H_2O  a  70°C"></span></p></li></ul></li><li><p>Os gases têm sua solubilidade diminuída com o aumento de temperatura;</p></li><li><p>Saturação:</p><ul><li><p>Saturada: atingiu o Cs máximo;</p></li><li><p>Insaturada: não atingiu o Cs;</p></li><li><p>Supersaturada: contém mais soluto do que a quantidade máxima definida pelo Cs;</p></li></ul></li></ul><h2>Questões resolvidas:</h2><aside class="questao"><p>(Revisão) A solubilidade do nitrato de potássio em água, em função da temperatura, é dada na tabela abaixo. Considerando-se soluções de KNO<sub>3</sub> em 100 g de água, assinale o que for correto.</p><table><tbody><tr><th><p>Temperatura (°C)</p></th><td><p>0</p></td><td><p>20</p></td><td><p>40</p></td><td><p>60</p></td><td><p>100</p></td></tr><tr><th><p>Solubilidade do KNO<sub>3</sub> (g/100 g de água)</p></th><td><p>13,3</p></td><td><p>31,6</p></td><td><p>63,9</p></td><td><p>110</p></td><td><p>246</p></td></tr></tbody></table><p>(01) A 20°C uma solução com 40 gramas está saturada.</p><p>(02) A 0°C uma solução com 10 gramas está insaturada.</p><p>(04) A 40°C uma solução com 120 gramas está supersaturada.</p><p>(08) A 100°C uma solução com 120 gramas está saturada.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Não, pois, por ter mais soluto do que a solubilidade definida a 20 °C, é supersaturada;</p><p>(02) Sim, pois a quantidade de soluto não alcança a solubilidade a 0 °C;</p><p>(04) Sim, pois há mais soluto do que a solubilidade definida a 40 °C;</p><p>(08) Não, pois a quantidade de soluto não alcança a solubilidade a 100 °C</p><p><strong>Soma: 2 + 4 = 6</strong></p></div></aside><aside class="questao"><p>(Fuvest) 160 gramas de uma solução aquosa saturada de sacarose a 30°C são resfriados a 0 °C. Quanto do açúcar cristaliza?</p><table><tbody><tr><th><p>Temperatura °C</p></th><th><p>Solubilidade da sacarose g/100 g de H<sub>2</sub>O</p></th></tr><tr><td><p>0</p></td><td><p>180</p></td></tr><tr><td><p>30</p></td><td><p>220</p></td></tr></tbody></table><p>a. 20 g  b. 40 g  c. 50 g  d. 64 g  e. 90 g</p><div class="resolucao"><p>A 30 °C, a solubilidade da sacarose é de 220 g para cada 100 g de água. A massa total da solução saturada a 30 °C é a soma da massa de sacarose e da massa de água:</p><p>220 g (sacarose) + 100 g (água) = 320 g (solução)</p><p>Se 320 g da solução tem 220 g de sacarose, <strong>160 g da solução tem 110 g de sacarose.</strong></p><p>Como a solução é a mistura da sacarose com água, <strong>na solução de 160 tem 50 g de sacarose</strong> (160 g – 110 g = 50 g).</p><p>A 0 °C, a solubilidade da sacarose é de 180 g para cada 100 g de água.</p><p>Como a massa da água na solução é de 50 g, <strong>a massa máxima de sacarose que pode ser dissolvida é 90 g</strong>.</p><p>Como só 90 g de sacarose serão dissolvidos na solução a 0 °C, o resto se cristalizará, ou seja, 110g – 90 g = <strong>20 g</strong></p></div></aside>',
  (select id from resumos where slug = 'quimica-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'concentracao',
  'Concentração',
  'quimica',
  'pas-uem',
  'Concentração comum, molaridade, título e ppm — quanto soluto há na solução.',
  '<p>mostra a quantidade de soluto/solvente que está presente na solução;</p><ul><li><p><span data-type="inline-math" data-latex="m=m_1+m_2"></span></p><ul><li><p><span data-type="inline-math" data-latex="m"></span>: massa da solução</p></li><li><p><span data-type="inline-math" data-latex="m_1"></span>: massa do soluto</p></li><li><p><span data-type="inline-math" data-latex="m_2"></span>: massa do solvente</p></li></ul></li></ul><h2 data-corrido="sim">Concentração comum (C):</h2><p>indica a massa do soluto em gramas presentes em 1L de solução;</p><ul><li><p><span data-type="inline-math" data-latex="C=\frac{m_1}{V(L)}"></span>;</p></li></ul><h2 data-corrido="sim">Concentração molar ou Molaridade (M):</h2><p>mostra o n° de mols de soluto presentes em 1L de solução;</p><ul><li><p><span data-type="inline-math" data-latex="M=\frac{n_1}{V(L)}"></span> ou <span data-type="inline-math" data-latex="M=\frac{m_1}{MM_1⋅V(L)}"></span>;</p><ul><li><p><span data-type="inline-math" data-latex="n=\frac{m}{MM}"></span>;</p></li></ul></li><li><p><span data-type="inline-math" data-latex="M=\frac{C}{MM_1}"></span> e <span data-type="inline-math" data-latex="C=M⋅MM_1"></span>;</p></li></ul><h2 data-corrido="sim">Título (τ):</h2><p>indica a % de soluto e solvente de massa na solução;</p><ul><li><p><span data-type="inline-math" data-latex="τ=\frac{m_1}{m}"></span> %soluto ou <span data-type="inline-math" data-latex="τ=\frac{m_2}{m}"></span> %solvente;</p></li></ul><h2 data-corrido="sim">Concentração em partes por milhão (ppm):</h2><p>1 parte de soluto para 10 partes de solução;</p><ul><li><p><span data-type="inline-math" data-latex="1 ppm=1 mg soluto/kg solução"></span>;</p></li><li><p><span data-type="inline-math" data-latex="1 ppm= 1 mg soluto/L solução"></span>;</p></li><li><p><span data-type="inline-math" data-latex="1 ppm=1 cm^{3} soluto/m^{3} solução"></span>;</p></li></ul>',
  (select id from resumos where slug = 'quimica-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

-- ============================================
-- 3. Física: as três dilatações, a propagação e o calor latente
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'dilatacao-linear',
  'Dilatação linear',
  'fisica',
  'pas-uem',
  'O comprimento que muda com a temperatura, e as duas formas de escrever a conta.',
  '<p>mudança do comprimento de um objeto quando é aquecido;</p><ul><li><p><span data-type="inline-math" data-latex="Δl=l_0⋅α⋅ΔT"></span> ou <span data-type="inline-math" data-latex="l=l_0(1+α+ΔT)"></span></p></li></ul>',
  (select id from resumos where slug = 'fisica-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'dilatacao-superficial',
  'Dilatação superficial',
  'fisica',
  'pas-uem',
  'A área que cresce com a temperatura, e o que é cada letra da fórmula.',
  '<ul><li><p><span data-type="inline-math" data-latex="Δs=s_0⋅β⋅ΔT"></span> ou <span data-type="inline-math" data-latex="s=s_0(1+β+ΔT)"></span></p><ul><li><p><span data-type="inline-math" data-latex="s_0"></span>: área superficial;</p></li><li><p><span data-type="inline-math" data-latex="ΔT"></span>: variação da temperatura;</p></li><li><p><span data-type="inline-math" data-latex="β"></span>: coeficiente de dilatação superficial;</p></li></ul></li></ul>',
  (select id from resumos where slug = 'fisica-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'dilatacao-volumetrica',
  'Dilatação volumétrica',
  'fisica',
  'pas-uem',
  'O volume que cresce com a temperatura, o γ que vale 3α, e a dilatação aparente.',
  '<ul><li><p><span data-type="inline-math" data-latex="Δv=v_0⋅γ⋅ΔT"></span></p><ul><li><p><span data-type="inline-math" data-latex="Δv"></span>: variação do volume;</p></li><li><p><span data-type="inline-math" data-latex="γ"></span>: coeficiente de dilatação volumétrica;</p><ul><li><p><span data-type="inline-math" data-latex="γ=3α"></span></p></li></ul></li><li><p><span data-type="inline-math" data-latex="ΔT"></span>: variação da temperatura;</p></li></ul></li><li><p><span data-type="inline-math" data-latex="Δv=Δv_{reci}+Δv_{ap}"></span></p></li></ul>',
  (select id from resumos where slug = 'fisica-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'propagacao-de-calor',
  'Propagação de calor',
  'fisica',
  'pas-uem',
  'Condução, convecção e irradiação — e por que a garrafa térmica barra as três.',
  '<p>transferência do calor de um corpo com maior temperatura para um com menor temperatura;</p><h2 data-corrido="sim">Condução:</h2><p>calor transportado através da agitação das moléculas;</p><ul><li><p><span data-type="inline-math" data-latex="Φ=\frac{Q}{Δt}=\frac{-k⋅A⋅ΔT}{L}"></span></p><ul><li><p><span data-type="inline-math" data-latex="A"></span>: área da seção transversal (m<sup>2</sup>);</p></li><li><p><span data-type="inline-math" data-latex="ΔT"></span>: diferença de temperatura;</p></li><li><p><span data-type="inline-math" data-latex="L"></span>: espessura ou comprimento do material (m);</p></li></ul></li></ul><h2 data-corrido="sim">Convecção:</h2><p>calor transportado pelo movimento de massa de fluidos (líquidos ou gases);</p><h2 data-corrido="sim">Irradiação:</h2><p>calor propagado por ondas eletromagnéticas;</p><p>Ex: garrafa térmica;</p><ul><li><p>Parede impede a condução e convecção;</p></li><li><p>Parede espelhada impede a irradiação;</p></li></ul>',
  (select id from resumos where slug = 'fisica-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'calor-latente',
  'Calor latente',
  'fisica',
  'pas-uem',
  'O calor que muda o estado sem mudar a temperatura, ao lado do que muda a temperatura.',
  '<p>calor da mudança de estado físico de um substância;</p><h2 data-corrido="sim">Variação de estado fisico:</h2><p><span data-type="inline-math" data-latex="Q=mL"></span></p><h2 data-corrido="sim">Variação de temperatura:</h2><p><span data-type="inline-math" data-latex="Q=m⋅c⋅ΔT"></span></p><h2 data-corrido="sim">Equilibrio térmico:</h2><p><span data-type="inline-math" data-latex="Q_A+Q_B=0"></span></p>',
  (select id from resumos where slug = 'fisica-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

-- ============================================
-- 4. Sociologia: Durkheim, a primeira linha da matéria no site
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'emile-durkheim',
  'Émile Durkheim',
  'sociologia',
  'pas-uem',
  'O fato social, a consciência coletiva, as duas solidariedades e os quatro suicídios.',
  '<p>sociólogo, filósofo e antropólogo judeu francês positivista;</p><p>Definiu que a Sociologia…</p><ul><li><p>É uma ciência autônoma, diferente das demais ciências;</p></li><li><p>Estuda os fatos sociais (suas funções, efeitos);</p><ul><li><p>Fato social: instrumento social e cultural que determina a maneira de agir, pensar e sentir na vida de um indivíduo;</p><ul><li><p>São…</p><ul><li><p>Coercitivos: aplicam uma “força” sobre os indivíduos que os obriga a respeitá los;</p></li><li><p>Objetivos: independem das subjetividade individuais;</p></li><li><p>Exteriores: acontecem externamente ao indivíduo e este as absorve pela coerção a ele aplicada;</p></li></ul></li></ul></li></ul></li><li><p>Usa de uma metodologia científica para a investigação;</p><ul><li><p>Considerar os fatos sociais como coisas e analisá los com imparcialidade, racionalidade e objetividade;</p></li></ul></li></ul><h2 data-corrido="sim">Sociedade:</h2><p>organismo funcional, superior e anterior aos indivíduos que os molda através dos fatos sociais;</p><ul><li><p>Consciência coletiva: sistema das representações coletivas em uma determinada sociedade;</p></li><li><p>A educação é uma das formas pelas quais os indivíduos aprendem e incorporam os fatos sociais;</p></li><li><p>Divisão social do trabalho: diferentes as atribuições produtivas individuais e coletivas, entre os membros de uma sociedade;</p><ul><li><p>Solidariedade: laço moral e social que une os indivíduos, garantindo a coesão e a ordem na sociedade;</p></li></ul><table><tbody><tr><th><p></p></th><th><p>Solidariedade orgânica</p></th><th><p>Solidariedade mecânica</p></th></tr><tr><th><p>Objetivo</p></th><td><p>Coesão social</p></td><td><p>Coesão social</p></td></tr><tr><th><p>Sociedades</p></th><td><p>Simples</p></td><td><p>Complexas</p></td></tr><tr><th><p>Modo de produção</p></th><td><p>Pré-capitalista</p></td><td><p>Capitalista</p></td></tr><tr><th><p>Divisão do trabalho</p></th><td><p>Rudimentar ou inexistente. As pessoas desenvolvem as mesmas tarefas.</p></td><td><p>Complexa, as funções são especializadas, gerando uma interdependência entre as distintas tarefas e os indivíduos.</p></td></tr><tr><th><p>Direito</p></th><td><p>Repressivo: punir o transgressor (dor, perda de liberdade/bens)</p></td><td><p>Restitutivo: restaurar a ordem das coisas, reparar o dano e restabelecer relações.</p></td></tr><tr><th><p>Indivíduos</p></th><td><p>Independentes e semelhantes entre si.</p></td><td><p>Diferentes entre si, mas interdependentes.</p></td></tr><tr><th><p>Fator de coesão social</p></th><td><p>Força da tradição, das crenças e dos hábitos comuns.</p></td><td><p>A divisão do trabalho social e a interdependência entre os diferentes sujeitos.</p></td></tr></tbody></table></li><li><p>Normalidade social: conjunto de fatos sociais, comuns, que ocorrem com frequência;</p><ul><li><p>Mantêm a integridade social;</p></li></ul></li><li><p>Patologia social: desequilíbrio entre as normas e entre os indivíduos;</p><ul><li><p>Causa conflitos e desintegração social;</p></li><li><p>Precursor da anomia social: desrespeito às leis, normas sociais e práticas coletivas;</p><ul><li><p>Quebra dos laços de solidariedade social;</p></li></ul></li><li><p>Suicídio: fato social presente em todas as socieades humanas;</p><ul><li><p>Egoísta: causado por um individualismo exacerbado, distanciado das relações entre o indivíduo e a sociedade;</p></li><li><p>Altruísta: realizado em nome à uma causa e identificação do indivíduo em um grupo;</p></li><li><p>Anômico: concretizado pela ausência de regras e limites sociais e desorientação do indivíduo;</p></li><li><p>Fatalista: decorre do excesso de regulação social e controle moral em uma realidade extremamente opressora;</p><ul><li><p>Única saída do indivíduo diante do contexto social altamente impositivo;</p></li></ul></li></ul></li></ul></li></ul>',
  (select id from resumos where slug = 'sociologia-2-etapa-pas-uem')
)
on conflict (slug) do nothing;

-- ============================================
-- 5. Guardas
-- ============================================
do $$
declare
  n_novos int;
  n_orfaos int;
  n_titulos int;
begin
  select count(*) into n_novos
    from resumos
   where slug in (
     'quimica-2-etapa-pas-uem', 'fisica-2-etapa-pas-uem', 'matematica-2-etapa-pas-uem',
     'portugues-2-etapa-pas-uem', 'literatura-2-etapa-pas-uem', 'biologia-2-etapa-pas-uem',
     'geografia-2-etapa-pas-uem', 'arte-2-etapa-pas-uem', 'filosofia-2-etapa-pas-uem',
     'sociologia-2-etapa-pas-uem', 'historia-2-etapa-pas-uem',
     'dispersoes', 'concentracao', 'dilatacao-linear', 'dilatacao-superficial',
     'dilatacao-volumetrica', 'propagacao-de-calor', 'calor-latente', 'emile-durkheim');
  if n_novos <> 19 then
    raise exception 'esperava 19 resumos da 2ª etapa do PAS UEM, encontrei %', n_novos;
  end if;

  -- Um `select` de `pai_id` que não acha o pai grava null sem reclamar, e o
  -- filho reapareceria solto na raiz — que é justamente o que o sumário do pai
  -- veio desfazer.
  select count(*) into n_orfaos
    from resumos
   where slug in ('dispersoes', 'concentracao', 'dilatacao-linear',
                  'dilatacao-superficial', 'dilatacao-volumetrica',
                  'propagacao-de-calor', 'calor-latente', 'emile-durkheim')
     and pai_id is null;
  if n_orfaos <> 0 then
    raise exception '% filhos ficaram sem pai', n_orfaos;
  end if;

  -- Título repetido quebra o `[[wikilink]]` em silêncio (o trigger casa por
  -- título), então a conta é sobre o acervo inteiro, não só sobre esta leva.
  select count(*) into n_titulos
    from (select titulo from resumos group by titulo having count(*) > 1) x;
  if n_titulos <> 0 then
    raise exception '% títulos repetidos no acervo', n_titulos;
  end if;
end $$;

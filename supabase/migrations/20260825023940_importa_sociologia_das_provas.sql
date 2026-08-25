-- Traz a Sociologia das provas da escola: doze resumos, nenhuma figura.
--
-- `processo_slug = 'comum'`, o destino combinado para o material de prova de
-- escola em 2026-08-23 (decisão 1c) — não é de vestibular nenhum, e o autor
-- quis que valesse para todo plano.
--
-- É a primeira leva vinda das 59 provas, e ela sai da matéria mais magra do
-- acervo: **a Sociologia tinha UM resumo** (`Émile Durkheim`) contra 48 tópicos
-- de edital. Passa a ter treze.
--
-- ## Como estes doze foram achados, e por que não foi por classificação
--
-- As provas são organizadas por prova, não por matéria: cada documento cobre o
-- bimestre inteiro de uma turma e mistura Física, Filosofia e Sociologia. O
-- inventário de 2026-08-24 (ver `inventario_de_provas.py` e a página "Provas da
-- escola" no vault) mapeou 812 tópicos distintos nos 59 documentos, mas
-- **classificar a matéria automaticamente falhou duas vezes**:
--
-- - herdar do vizinho classificado punha "Era Napoleônica" em Filosofia e
--   "Cálculo do Nox" em Matemática;
-- - segmentar o documento em blocos, usando os tópicos casados com o edital
--   como âncora, punha "Reforma Protestante" em Biologia e "método de pesquisa
--   da sociologia" em Matemática.
--
-- A causa é estrutural e vale registrar: **as matérias com poucos resumos
-- publicados são exatamente as que têm poucas âncoras**, então os blocos delas
-- são engolidos pelos vizinhos que têm. Sociologia, História e Arte — as três
-- mais vazias — são as que a inferência mais erra.
--
-- Estes doze saíram de uma lista curada à mão sobre os 812 títulos, e conferida
-- lendo o conteúdo. São 61 tópicos de Sociologia nos documentos.
--
-- ## Vinte e sete dos 61 NÃO viraram resumo, porque não têm texto
--
-- São títulos soltos de lista de edital: "Marx: dialética e materialismo
-- histórico.", "Questões de gênero;", "Origem da sociologia;", "Karl Marx:" —
-- o título e mais nada. Quase todos vêm do `Simulado Poliedro` de 2026 e dos
-- documentos do 1º ano, que são listas de conteúdo e não resumos.
--
-- É o mesmo caso da "Primeira lei e noções de probabilidade" da Biologia:
-- publicar um resumo com título e nada dentro não ajuda ninguém, e escrever o
-- texto é o que a decisão 9c proíbe. Três exceções tinham uma linha de verdade
-- e entraram dentro de outros resumos: "TABUS" e "Complexo cultural" foram para
-- `cultura`, e "Poliandria" para `familia`.
--
-- ## Por que doze resumos e não trinta e quatro
--
-- Os documentos quebram em tópico de nível 0 coisas que são um assunto só:
-- "Cultura erudita", "Cultura formal", "Cultura informal", "Cultura material",
-- "Cultura imaterial", "Cultura popular", "Traço cultural", "Área cultural" e
-- "Complexo cultural" são nove tópicos de 130 a 230 caracteres cada.
--
-- Nove resumos de duas linhas competiriam entre si no grafo e no `/resumos`.
-- Entraram como seções de `cultura` — e **isso não perde granularidade
-- nenhuma**: pela decisão 12, cada `h2` dentro do corpo já É um nó do mapa,
-- pendurado no resumo que o contém. O aluno continua achando "Cultura
-- imaterial" no mapa; ela só deixa de ser uma página de duas linhas.
--
-- O mesmo vale para Renda, Riqueza e as duas pobrezas dentro de
-- `desigualdade-social`, e para as formas de governo dentro de `poder`.
--
-- ## "Poder e dominação (cap. 11 e 12)" era um superconjunto
--
-- O maior tópico de Sociologia das provas (4.703 caracteres, no Simulado
-- Harmonia do 4º bimestre) não é um assunto: é um **capítulo de apostila**, e
-- contém dentro dele "Os três poderes", "Democracia direta e indireta",
-- "Democracia liberal", "Poder", "E. Goffman" e "P. Bourdieu" — que também
-- existem como tópicos avulsos noutro documento, com o texto idêntico.
--
-- Ele foi desmontado nos assuntos que carrega, e o título de capítulo não
-- virou resumo: "cap. 11 e 12" não é nó de grafo, é referência a um material
-- que o aluno do site não tem.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"Michael Foucault"**, em Controle social. O nome é Michel. Aparece uma
--   vez só, e no mesmo resumo em que o "M. Foucault" do outro documento entrou
--   como seção — então o aluno vê as duas grafias na mesma página.
--   **Vale avisar o autor.**
-- - **"Tipos de desposses"**, por despossessão. O corpo do tópico usa
--   "Despossessão psicológica" e "Despossessão política" corretamente; só o
--   título está torto. Virou seção de `desigualdade-social` com o nome do
--   documento.
-- - **"foi um dos primeiros à organizar"**, com crase, em Positivismo.
-- - **"o protestantes praticavam"**, em Max Weber.
-- - **"Ação social afetiva [ou emotiva]"** — os colchetes são do autor.
-- - **"Estado metafísico"** onde as outras duas são "Estágio Teológico" e
--   "Estado Positivo": a lei dos três estados de Comte mistura "estágio" e
--   "estado" no documento.
--
-- Nenhum destes doze tem figura: a Sociologia inteira das provas tem zero
-- âncoras de imagem.
--
-- Não há `[[wikilink]]`. `on conflict (slug) do nothing` deixa rodar de novo
-- sem duplicar.
--
-- O número da versão é o que ficou registrado no histórico do Supabase, e o
-- arquivo foi renomeado para ele.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'cultura',
  'Cultura',
  'sociologia',
  'comum',
  'Do menor componente ao conjunto: traço, complexo e área cultural — e os pares que o vestibular cobra, material e imaterial, formal e informal, popular e erudita.',
  '<h2 data-corrido="sim">Aculturação:</h2>
<p>processo de assimilação e combinação de duas ou mais culturas diferentes (perdas ou ganhos culturais);</p>
<h2 data-corrido="sim">Traço cultural:</h2>
<p>são os menores componentes de uma cultura, entendidos apenas quando integrados, ou seja, em conjunto, demonstram como pensam e agem indivíduos de determinada cultura;</p>
<h2 data-corrido="sim">Complexo cultural:</h2>
<p>combinação de traços culturais;</p>
<h2 data-corrido="sim">Área cultural:</h2>
<p>espaço geográfico onde determinada cultura se manifesta, combinando diferentes traços e padrões que compõem o complexo cultural.</p>
<ul><li><p>Ex: área cultural do Oriente Médio.</p></li></ul>
<h2 data-corrido="sim">Contracultura:</h2>
<p>contestações sociais aos padrões vigentes, ao sistema em que se vive, gerando novas propostas, novos valores e novos comportamentos;</p>
<ul><li><p>Ex: legalização do aborto e da maconha. Início do movimento hippie nos EUA, 1960;</p></li></ul>
<h2 data-corrido="sim">Cultura popular:</h2>
<p>produzida por setores sociais considerados populares, e pelas classes sociais mais baixas.</p>
<ul><li><p>Ex: lavagem da Igreja Bonfim, estilos musicais rurais e iguarias gastronômicas.</p></li></ul>
<h2 data-corrido="sim">Cultura erudita:</h2>
<p>cultura que compreende valores de classes econômicas mais altas, com estilos diferentes das populares, pela capacidade e reconhecimento mais amplo.</p>
<ul><li><p>Ex: ouvir óperas, participar de concertos e viagens internacionais.</p></li></ul>
<h2 data-corrido="sim">Cultura material:</h2>
<p>compreende elementos concretos, físicos e palpáveis, como sítios arqueológicos, prédios históricos, obras de arte.</p>
<h2 data-corrido="sim">Cultura imaterial:</h2>
<p>envolve aspectos abstratos, como técnicas, saberes, e modo de fazer, além de questões relacionadas ao pensamento e a linguagem.</p>
<h2 data-corrido="sim">Cultura formal:</h2>
<p>são aquelas escritas e normatizadas por estatutos e leis, implicando em punições dos mais variados tipos (multas, prisões, punições corporais).</p>
<h2 data-corrido="sim">Cultura informal:</h2>
<p>são entendidos como normas, porém não estão formalizados legalmente, não estão escritas.</p>
<ul><li><p>Ex: usar vestimentas adequadas em alguns lugares.</p></li></ul>
<h2 data-corrido="sim">Tabus:</h2>
<p>regras rígidas de proteção.</p>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'instituicoes-sociais',
  'Instituições sociais',
  'sociologia',
  'comum',
  'O que faz de algo uma instituição, os quatro tipos, e as três que o vestibular cobra: escola, igreja e Estado.',
  '<ul><li><p>Atendem finalidades, objetivos.</p></li>
<li><p>Estáveis, duradouras.</p></li>
<li><p>Coercitivas (influência sobre a vida social e o comportamento dos indivíduos).</p></li>
<li><p>Estruturadas (constituídas de forma elaborada e forte), estruturais (oferecem bases para firmar e manter a estrutura social).</p></li>
<li><p>Valorativas; disseminam intenções éticas.</p></li></ul>
<h2>Tipos de instituições sociais</h2>
<ul><li><p><strong>Espontânea</strong>: surgem das relações cotidianas e naturais entre indivíduos em sua sociedade (família).</p></li>
<li><p><strong>Criadas</strong>: constituídas intencionalmente, com o propósito de organizar a sociedade (escola, igreja, banco).</p></li>
<li><p><strong>Reguladora</strong>: elaboradas para estabelecer regras que normatizam e guiam as relações sociais no aspecto da vida pública (economia, Estado e legislação).</p></li>
<li><p><strong>Operacional</strong>: auxiliam na realização das práticas sociais ligadas à satisfação de desejos, necessidades e sonhos (lazer e transporte).</p></li></ul>
<h2>Instituições importantes</h2>
<h3 data-corrido="sim">Escolas e instituições educacionais (educação):</h3>
<ul><li><p>Responsável pela transmissão de conhecimento;</p></li>
<li><p>Contribui no ensino de importantes aspectos culturais e sociais e participa na manutenção e perpetuação da cultura.</p></li>
<li><p>Prepara os indivíduos para cumprir papéis sociais e profissionais;</p></li>
<li><p>Consiste em um dos ambientes promotores de sociabilidade.</p></li></ul>
<h3 data-corrido="sim">Igreja (religião):</h3>
<p>materialização da religião em um tempo e em uma comunidade de pessoas da mesma fé.</p>
<ul><li><p>Dissemina valores;</p></li>
<li><p>Institui regras de comportamento;</p></li>
<li><p>Auxilia na adaptação a normas e padrões sociais;</p></li>
<li><p>Incentiva práticas solidárias e compassivas.</p></li></ul>
<h3 data-corrido="sim">Estado (Estado brasileiro, cidadania):</h3>
<ul><li><p>Usa poder, força e lei;</p></li>
<li><p>Possui autoridade;</p></li>
<li><p>Poderes executivo, legislativo e judiciário.</p></li>
<li><p>Composto por território, população e governo (governo é responsável pela política e o gerenciamento do Estado).</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'familia',
  'Família',
  'sociologia',
  'comum',
  'A instituição que faz a socialização primária: quem manda nela, o que mudou nas últimas décadas, e as três formas de matrimônio.',
  '<p>promove socialização primária, sustento econômico, moradia, vestuário, transmissão da cultura, procriação.</p>
<ul><li><p><strong>Patriarcado</strong>: prevalece a autoridade dos meninos sobre as meninas</p></li>
<li><p><strong>Matriarcado</strong>: onde a responsabilidade repousa sobre a mulher;</p></li>
<li><p><strong>Sociedade igualitária</strong>: homens e mulheres partilham suas autoridades;</p></li></ul>
<h2>Mudanças na família</h2>
<ul><li><p><strong>redução na quantidade de filhos</strong>;</p></li>
<li><p><strong>alto número de casais que optam por não ter filhos;</strong></p></li>
<li><p>comportamento: (<strong>geração canguru</strong>) - homens que não saem da casa dos pais;</p></li>
<li><p><strong>divórcio</strong>: diminuição na duração do casamento;</p></li>
<li><p><strong>mulher no mercado de trabalho</strong>;</p></li>
<li><p>mulheres solteiras com filhos;</p></li>
<li><p><strong>uniões homoafetivas</strong>.</p></li></ul>
<h2>Formas de matrimônio</h2>
<h3 data-corrido="sim">Monogamia:</h3>
<p>é a condição daquele que é monogâmico, ou seja, tem um só parceiro. É a forma de matrimônio que ocorre entre um homem e uma mulher. Ex: Brasil.</p>
<h3 data-corrido="sim">Poligamia:</h3>
<p>sistema onde o homem tem mais de uma mulher ao mesmo tempo, ou até mesmo, sendo menos comum, onde a mulher tem mais de um marido simultaneamente. Ex: É proibido no Brasil.</p>
<h3 data-corrido="sim">Poliandria:</h3>
<p>mulher que tem dois maridos ao mesmo tempo. (somente mulheres). Também é proibido no Brasil.</p>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'estratificacao-social',
  'Estratificação social',
  'sociologia',
  'comum',
  'A sociedade em camadas: com e sem mobilidade, os quatro modelos históricos, e as três esferas em que Weber a divide.',
  '<p>divisão da sociedade em camadas ou estratos sociais, geralmente representada como uma pirâmide, com poucos no topo (mais poder e riqueza) e muitos na base (menos recursos e poder). <strong>Nunca houve uma sociedade plenamente igualitária.</strong></p>
<h2>Dois tipos de estratificação</h2>
<h3 data-corrido="sim">Com mobilidade social:</h3>
<p>permite a mudança de posição social entre os estratos.</p>
<ul><li><p><strong>Horizontal</strong>: lenta, de geração em geração, séculos.</p></li>
<li><p><strong>Vertical</strong>: rápida, abrupta, “do dia para a noite”</p></li>
<li><p><strong>Mobilidade intergeracional:</strong> mobilidade entre estratos sociais que ocorre ao longo da vida de um indivíduo, dentro da mesma geração.</p>
<ul><li><p>Quanto <strong>mais mobilidade</strong> uma estrutura permitir, <strong>mais aberto</strong> é o seu sistema.</p></li></ul></li>
<li><p>Fatores como preconceitos, discriminação, estigmas sociais, violência, problemas de acesso à saúde, educação, falta de emprego e oportunidades dificultam a mobilidade vertical.</p></li></ul>
<h3 data-corrido="sim">Sem mobilidade social:</h3>
<p>os indivíduos nascem e morrem no mesmo estrato, sem possibilidade de ascensão ou queda social.</p>
<h2>Os modelos de sociedade existente</h2>
<ul><li><p><strong>Estamentos:</strong> divisão hierárquica típica do feudalismo na sociedade europeia, a diferença entre as classes era dada por convenções ou leis. <strong>Sistema fechado (sem mobilidade) e hereditário</strong>.</p></li>
<li><p><strong>Escravidão:</strong> onde indivíduos e grupos de indivíduos são considerados propriedades de outros <strong>(não existe mais)</strong>.</p></li>
<li><p><strong>Classes sociais:</strong> marcou as sociedades modernas, espalhou-se pelo mundo até a contemporaneidade. Possui <strong>sistema aberto e flexibilidade</strong>, podendo mudar facilmente de camada social. <strong>A ordem econômica define seu funcionamento.</strong></p></li>
<li><p><strong>Castas:</strong> sistemas de estratificação social que organizam em grupos diferentes de maneira <strong>hierárquica e hereditária</strong>. <strong>Sem mobilidade social e baseado na pureza religiosa e origem familiar.</strong></p></li></ul>
<h2>O que compõe uma classe social</h2>
<ul><li><p>Diversidade de tarefas;</p></li>
<li><p>Variedade de posições, funções, direitos, e deveres dos trabalhadores;</p></li>
<li><p>Mobilidade econômica e social;</p></li>
<li><p>Escolha profissional;</p></li>
<li><p>Trabalho e sonhos pessoais;</p></li>
<li><p>Oportunidades de vida;</p></li></ul>
<h2 data-corrido="sim">Max Weber:</h2>
<p>utiliza o conceito de "tipo ideal" como um modelo teórico construído a partir de traços mais comuns observados na realidade. É uma ferramenta analítica para comparar e compreender fenômenos sociais. Ele aplica isso à estratificação em três esferas: classe (econômica), estamento (social) e partido (política).</p>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'desigualdade-social',
  'Desigualdade social',
  'sociologia',
  'comum',
  'Renda não é riqueza, e pobreza relativa não é pobreza absoluta — mais a despossessão, que é a pobreza que não se mede em dinheiro.',
  '<p>processo existente nas relações da sociedade, presente em todos os países do mundo.</p>
<ul><li><p><strong>Faz parte das relações sociais</strong>, por determinar um lugar aos desiguais, seja por questões econômicas, de <strong>gênero</strong>, de <strong>cor</strong>, de <strong>crença</strong>, de círculo ou grupo social (aumentando a desigualdade social);</p></li></ul>
<h2 data-corrido="sim">Renda:</h2>
<p>contabiliza todas as remunerações recebidas de salários, aluguéis, juros e lucros disponíveis para serem gastos e poupados por indivíduos ou famílias.</p>
<h2 data-corrido="sim">Riqueza:</h2>
<p>todo conjunto de bens ativos de um indivíduo, incluindo valor de propriedades, ações, títulos, fundos, consórcios, conta-corrente, poupança, fundos individuais, objetos de coleções valiosas;</p>
<h2 data-corrido="sim">Pobreza relativa:</h2>
<p>mede a carência de recursos e oportunidades, em comparação com as outras populações do mesmo país. Ex: Rio Grande do Sul, Interior do Amazonas. Pode ser comparada entre países;</p>
<h2 data-corrido="sim">Pobreza absoluta:</h2>
<p>pessoa ou família que se encontra abaixo do mínimo necessário para poder garantir sua subsistência. Essa pessoa ou família está abaixo da linha de pobreza;</p>
<h2>Tipos de desposses</h2>
<ul><li><p><strong>Despossessão psicológica</strong>: diz respeito a um <strong>sentimento de autodesvalorização</strong> das populações pobres em relação às ricas, ou de um país pobre em relação a um país rico. Sob essa ótica, <strong>a linha da pobreza, o significado da pobreza e suas respectivas características variam de sociedade para sociedade</strong>;</p></li>
<li><p><strong>Despossessão política:</strong> outro lado da pobreza contemporânea e diz respeito à incapacidade de certos grupos sociais terem qualquer participação efetiva na vida pública ou acesso aos mecanismos de interferência e ação política.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'controle-social',
  'Controle social',
  'sociologia',
  'comum',
  'Como a sociedade mantém todo mundo na linha — e o que acontece quando não mantém. Foucault, o panóptico e os dois tipos de Bobbio.',
  '<p>conjunto heterogêneo de recursos materiais e simbólicos disponíveis em uma sociedade para assegurar que os indivíduos se comportem de maneira previsível e conforme as regras e preceitos vigentes;</p>
<ul><li><p>O <strong>conceito de controle social</strong> tem origem na sociologia americana da segunda década do século XX;</p></li>
<li><p>Desempenha um importante papel na sociedade ao <strong>assegurar a coesão social</strong>;</p></li>
<li><p>O aumento de comportamentos desviantes indica falhas nos elementos do controle social;</p></li></ul>
<h2 data-corrido="sim">Desvio social:</h2>
<p>desvio social é um comportamento que viola normas e expectativas de uma sociedade, podendo variar de atos banais a comportamentos ilegais. é qualquer ação que viole a organização da sociedade, ex: roubar e ser mal educado te tornam uma pessoa desviante.</p>
<h2 data-corrido="sim">Michael Foucault:</h2>
<p>autor do livro “Vigiar e Punir”</p>
<ul><li><p>Segundo o autor, <strong>a construção do sujeito dócil, útil e submisso à ordem</strong> estabelecida é possível somente por meio de <strong>processos “disciplinadores”</strong>, nos quais o <strong>corpo e a mente do sujeito</strong> são <strong>moldados</strong> conforme o que se pede no meio social;</p></li>
<li><p><strong>Panoptismo</strong>: <strong>sistema de vigilância e controle</strong> onde a visibilidade constante dos indivíduos e a <strong>incerteza sobre serem observados levam ao autocontrole e à conformidade</strong>;</p></li>
<li><p><strong>Dispositivos de poder</strong>: qualquer coisa (discurso, leis, técnicas, estratégias…) utilizada para organizar o comportamento de uma pessoa/comunidade, em outras palavras, são métodos com o objetivo de manter todo mundo na linha;</p></li></ul>
<h2 data-corrido="sim">Norberto Bobbio:</h2>
<p>existem dois tipos de controle social:</p>
<ul><li><p><strong>Externa</strong>: refere-se às <strong>ferramentas de intervenção direta</strong> acionadas quando o indivíduo não se dispõe à uniformidade do comportamento geral;</p>
<ul><li><p>Ex: exclusão social, sanções, punições, polícia, leis;</p></li></ul></li>
<li><p><strong>Interno</strong>: está associada <strong>àquilo que o meio social consegue interiorizar</strong>, isto é, tornar uma ideia, pensamentos ou qualquer outra característica, parte da consciência de um indivíduo.</p>
<ul><li><p>Não ameaçam uma pessoa externamente, mas agem por meio de sua própria consciência;</p></li>
<li><p>Ex: valores morais e éticos, autodisciplina;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'max-weber',
  'Max Weber',
  'sociologia',
  'comum',
  'A sociologia compreensiva: os quatro tipos de ação social, e a tese de que o capitalismo nasceu de uma ética religiosa.',
  '<p>estudioso de filosofia, história e direito e professor da Universidade de Heidelberg;</p>
<ul><li><p>A função da sociologia é interpretar o sentido que os indivíduos dão às suas ações para explicar suas causas e efeitos, ou seja, <strong>a sociologia deve ser compreensiva</strong>;</p></li></ul>
<h2 data-corrido="sim">Ação social:</h2>
<p>ação/atitude/comportamento/conduta/posicionamento tomados por um indivíduo, <strong>sempre orientado pela resposta ou pela reação das outras pessoas</strong>;</p>
<ul><li><p>É o próprio indivíduo quem dá sentido à sua ação social, estabelecendo relações entre causa e efeito, a fim de obter o efeito desejado;</p></li>
<li><p>Ocorre quando as ações de duas ou mais pessoas se orientam uma pela outra, criando um sentido compartilhado;</p></li>
<li><p>Tipos:</p>
<ul><li><p><strong>Ação racional referente a fins</strong>: orientado pela busca de objetivos, motivado por alcançar objetivos, ter sucesso nessa busca, para a realização pessoal;</p></li>
<li><p><strong>Ação racional referente a valores</strong>: ação dirigida por crenças e valores, independente dos resultados;</p></li>
<li><p><strong>Ação social afetiva [ou emotiva]</strong>: determinada por ligações emocionais, afetivas, sentimentais com outras pessoas;</p></li>
<li><p><strong>Ação social tradicional</strong>: determinada por hábitos, costumes e modelos;</p></li></ul></li></ul>
<h2>Ética protestante e o espírito do capitalismo</h2>
<p>obra mais famosa de Weber;</p>
<ul><li><p>Define o <strong>capitalismo como uma mentalidade (<em>ethos</em>)</strong>:</p>
<ul><li><p><strong>Busca racional e sistemática do lucro</strong>, encarada não como ganância, mas como um <strong>dever moral e uma virtude;</strong></p></li>
<li><p>Pelo Calvinismo, o <strong>sucesso material através do trabalho árduo</strong> passou a ser interpretado como um <strong>indício da graça divina</strong>;</p></li></ul></li>
<li><p>Diferente do monges católicos que se retiravam do mundo e valorizavam a pobreza, o protestantes praticavam a “ascese” no mundo cotidiano;</p>
<ul><li><p>Evitar o desperdício, o luxo e o ócio. Focar na disciplina e na poupança;</p></li></ul></li>
<li><p>Em resumo, a vida econômica moderna, ocidental, baseada no capitalismo e na racionalidade, tem suporte e fundamento na ética protestante, também pautada no trabalho e no enriquecimento;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'positivismo',
  'Positivismo',
  'sociologia',
  'comum',
  'Comte e a ideia de que só a ciência conhece: a lei dos três estados, e o lema que foi parar na bandeira do Brasil.',
  '<p>corrente ideológica que defende a ciência baseada na observação e experimentação (método positivo) como a única fonte legítima de conhecimento;</p>
<ul><li><p>A sociedade deve ser pensada, organizada e dirigida pelo uso da razão e pelo pensamento científico;</p></li>
<li><p>Negação da metafísica e da teologia;</p></li></ul>
<h2 data-corrido="sim">Criada por Auguste Comte:</h2>
<p>pai da Sociologia, foi um dos primeiros à organizar o estudo da sociedade como uma ciência separada;</p>
<ul><li><p><strong>O Amor por princípio, e a Ordem por base; O Progresso por fim;</strong></p></li></ul>
<h2>Lei dos três estados</h2>
<ul><li><p><strong>Estágio Teológico</strong>: explicações sobrenaturais para as coisas que são resultantes de ações dos deuses;</p></li>
<li><p><strong>Estado metafísico</strong>: explicações abstratas para todas as coisas;</p></li>
<li><p><strong>Estado Positivo</strong>: explicações científicas baseadas na observação e nas leis da natureza;</p>
<ul><li><p>Haveria a criação de uma “nova moral”, que já não se baseava mais em deuses inexistentes e na destruição do velho mundo;</p></li>
<li><p>Objetivo final do positivismo;</p></li></ul></li></ul>
<h2>Princípios vitais da sociedade</h2>
<ul><li><p><strong>Princípio estático</strong>: formas simples e elementares de uma estrutura social;</p>
<ul><li><p>Ex: instituições como família, Estado, religião;</p></li></ul></li>
<li><p><strong>Princípio dinâmico</strong>: formas mais complexas de uma estrutura social passam por processo de desenvolvimento;</p>
<ul><li><p>Ex: Lei dos três estados de desenvolvimento;</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'poder',
  'Poder',
  'sociologia',
  'comum',
  'Determinar a ação do outro: as formas de governo, a tripartição de Montesquieu e as duas democracias.',
  '<p>capacidade de determinar a ação do outro. se aplicarmos essa definição em nossa vida, perceberemos que o poder está profundamente imerso nas nossas relações sociais. as relações de poder têm importante função de organizar a vida em sociedade, ex: na escola.</p>
<ul><li><p><strong>Teocracia</strong>: governo baseado na religião;</p></li>
<li><p><strong>Monarquia</strong>: sistema em que o poder se concentra em um único governante (rei);</p></li>
<li><p><strong>Absolutismo</strong>: regime em que o rei possui poder total sobre o Estado, sem limites ou divisões de autoridade;</p></li>
<li><p><strong>Estado Democrático</strong>: sistema em que o poder é distribuído entre os cidadãos e exercido por representantes escolhidos pelo povo;</p></li>
<li><p><strong>República</strong>: governo em que o chefe de Estado é eleito pelo povo por tempo limitado para administrar o bem público;</p></li></ul>
<h2>Os três poderes</h2>
<p>teoria política que se consolidou no século XVIII e que foi adotada em nosso país; Criada por Montesquieu (iluminista francês do século XVIII); A tripartição do poder no Brasil foi estabelecida pela Constituição Federal de 1988. Os poderes são:</p>
<h3 data-corrido="sim">Executivo:</h3>
<ul><li><p><strong>Composto por:</strong> o presidente, a nível federal; os governadores, a nível estadual; os prefeitos, a nível municipal. Junto desses estão os ministros, que auxiliam o presidente; os secretários estaduais, que auxiliam os governadores; e os secretários municipais, que auxiliam os prefeitos.</p></li>
<li><p><strong>Funções:</strong> responsável pela administração do Estado, governar o povo e promover o bem-estar social através de políticas públicas.</p></li></ul>
<h3 data-corrido="sim">Legislativo:</h3>
<ul><li><p><strong>Composto por:</strong> senadores, deputados federais, deputados estaduais, deputados distritais e vereadores.</p></li>
<li><p><strong>Funções</strong>: Função de legislar, isto é, de propor leis para o Estado e de realizar ações de fiscalização do Executivo,</p></li></ul>
<h3 data-corrido="sim">Judiciário:</h3>
<ul><li><p><strong>Composto por:</strong> juízes, desembargadores e ministros, além de servidores públicos.</p></li>
<li><p><strong>Funções:</strong> Interpretar e executar as leis, devendo sempre observar os limites da legislação brasileira e obedecer o que é determinado pela Constituição, mediar os conflitos entre cidadãos e entre os cidadãos e o Estado, além de procurar garantir o respeito aos direitos da população brasileira.</p></li></ul>
<h2>Democracia direta e indireta</h2>
<h3 data-corrido="sim">Democracia direta:</h3>
<p>é um sistema de governo onde os cidadãos tomam decisões políticas diretamente, sem representantes eleitos. O povo vota em leis, políticas públicas e outras questões, seja em assembleias ou através de mecanismos como o plebiscito e o referendo.</p>
<ul><li><p><strong>Plebiscito</strong></p>
<ul><li><p>O que é: Consulta popular antes da criação de uma lei ou decisão política importante.</p></li>
<li><p>Função: O povo autoriza ou nega que algo seja feito.</p></li></ul></li>
<li><p><strong>Referendo</strong></p>
<ul><li><p>O que é: Consulta popular depois que uma lei já foi aprovada.</p></li>
<li><p>Função: O povo confirma ou rejeita a decisão do Congresso.</p></li></ul></li></ul>
<h3 data-corrido="sim">Democracia indireta:</h3>
<p>também chamada de democracia representativa, é um sistema em que os cidadãos elegem representantes para tomar decisões políticas em seu nome.</p>
<h2>Democracia liberal</h2>
<ul><li><p>A democracia liberal NASCE DA LUTA SOCIAIS e de confrontos</p></li>
<li><p>É um sistema político que combina eleições livres (democracia) com a garantia aos direitos individuais e às liberdades civis (liberalismo).</p></li>
<li><p>Ela defende que o poder do Estado deve ser limitado por leis e dividido entre os poderes Executivo, Legislativo e Judiciário, garantindo liberdade de imprensa, de expressão, de religião e direito à propriedade privada.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'erving-goffman',
  'Erving Goffman',
  'sociologia',
  'comum',
  'O que a prisão mostra que a rua esconde: dentro da instituição, quem você é na sociedade deixa de importar.',
  '<ul><li><p>Estudou como as <strong>instituições controlam a vida das pessoas</strong>. Ele analisou o comportamento humano dentro de lugares como prisões;</p></li>
<li><p>Percebeu que, no dia a dia, nós <strong>seguimos regras sociais sem perceber</strong>. Nas instituições (prisões), essas regras ficam muito mais rígidas e controladas;</p></li>
<li><p>Diferencia o mundo da sociedade e o mundo da instituição com base nos seus comportamentos.</p></li></ul>
<h2>Mundo da instituição × mundo da sociedade</h2>
<ul><li><p><strong>Mundo da sociedade</strong>: na sociedade, eu sou uma aluna, uma filha, uma amiga, exerço uma função, sigo as minhas regras, sigo os meus horários;</p></li>
<li><p><strong>Na instituição</strong>, quem eu sou na sociedade não importa, o que importa é que eu devo seguir as leis e obrigações impostas, eu não tenho mais autonomia e sou controlada pela instituição;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'pierre-bourdieu',
  'Pierre Bourdieu',
  'sociologia',
  'comum',
  'Capital cultural: a herança que não é dinheiro mas anda junto com ele, e que decide quem aprende coisa nova com facilidade.',
  '<h2 data-corrido="sim">Capital cultural:</h2>
<p>hábitos culturais, adquiridos pela família, que farão diferença na vida adulta. Avaliados muitas vezes pela condição econômica.</p>
<ul><li><p>Existem outros tipos de riqueza além de riqueza econômica.</p></li>
<li><p>Pessoas que têm muitas experiências na vida, como viagens, passeios, compartilhamento de cultura, etc. tendem a ter mais facilidade em aprender coisas novas. Contudo, geralmente essa riqueza cultural vem junto com a econômica:</p>
<ul><li><p>Uma pessoa rica, desde pequena está em contato com outras culturas, tradições e etc, adquirindo, ao longo da vida, riquezas imateriais.</p></li>
<li><p>Bourdieu diz que, esta pessoa rica tende a ser melhor nas coisas que uma pessoa que nunca viajou por exemplo, pois já possui essa capacidade de aprender e vivenciar coisas novas.</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'capitalismo-ao-longo-da-historia',
  'Capitalismo ao longo da história',
  'sociologia',
  'comum',
  'As quatro fases: comercial, industrial, financeiro e informacional — e o que muda de uma para a outra.',
  '<ul><li><p><strong>Capitalismo comercial</strong>: expansão comercial européia: mercantilismo.</p></li>
<li><p><strong>Capitalismo industrial</strong>: emergência, expansão e centralidade das fábricas.</p></li>
<li><p><strong>Capitalismo financeiro</strong>: capital bancário, empresarial, bolsa, mercado de ações…</p></li>
<li><p><strong>Capitalismo informacional</strong>: tecnologias da informação e o capital no mundo industrializado.</p></li></ul>'
) on conflict (slug) do nothing;

-- O trigger `trg_sync_conexoes_resumo` roda no insert e resolve cada
-- `[[wikilink]]` procurando o resumo de destino pelo título. Estes doze não
-- trazem wikilink nenhum, mas o update vazio é o fecho padrão das migrations
-- de importação (decisão 9c) e custa nada.
update resumos set corpo = corpo where materia_slug = 'sociologia';

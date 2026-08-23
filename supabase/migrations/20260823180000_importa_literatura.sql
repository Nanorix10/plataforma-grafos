-- Importa a Literatura, vinda de "Materias e conteúdos feitos/Literatura.docx".
--
-- Oito resumos, e é a matéria inteira: gêneros literários mais as sete escolas
-- que o documento cobre, do Trovadorismo ao Romantismo. **Literatura não tinha
-- uma linha de conteúdo no site** — só os dois sumários de edital que entraram
-- hoje de manhã.
--
-- ## Por que `comum`, e não PASSE ou PAS UEM
--
-- Esta é a primeira leva vinda dos documentos-mestre por matéria, que é outro
-- recorte do mesmo material: em vez de "o que cai na 2ª etapa do PAS UEM", é
-- "tudo o que eu já escrevi de Literatura". O texto não se dirige a um
-- vestibular — Trovadorismo e Barroco caem nos três —, e amarrá-lo a um deles
-- esconderia de dois terços dos alunos um conteúdo que eles precisam.
--
-- `comum` existe exatamente para isso (decisão 1c) e todo plano à venda o
-- inclui. É a mesma escolha que o autor fez para o material de prova de escola.
--
-- ## Sem pai, e isso é o contrário do que fiz de manhã
--
-- Os oito ficam na raiz. O sumário do pai resolvia um problema que aqui não
-- existe: lá o documento era uma lista de edital com seis tópicos escritos, e
-- sem o pai a matéria parecia não existir. Aqui está tudo escrito, e as sete
-- escolas são irmãs em ordem cronológica — pendurá-las num "Escolas literárias"
-- que o autor não escreveu seria inventar hierarquia, que é justamente o que a
-- decisão 9 recusa.
--
-- ## O que muda de FORMA
--
-- Mesmo mapeamento das duas migrations de hoje, que saiu de comparar o `.docx`
-- da 1ª etapa do PAS UEM com o que já está no banco: nível 0 em negrito vira
-- título do resumo e o texto após os dois pontos vira o `<p>` de abertura;
-- nível 1 com definição vira `<h2 data-corrido="sim">`; nível 1 ou 2 que só
-- apresenta a lista abaixo vira `<p>`; nível 2 que abre seção vira `h3`; daí
-- para baixo a estrutura do documento vira lista aninhada, como no ciclo
-- celular.
--
-- **O itálico veio junto, e ele significa alguma coisa aqui.** O autor
-- italiciza os termos latinos — <em>carpe diem</em>, <em>fugere urbem</em>,
-- <em>inutilia truncat</em>, <em>aurea mediocritas</em>, <em>locus amoenus</em>,
-- <em>memento mori</em> — e o título das obras que cita. É a convenção
-- tipográfica de sempre para língua estrangeira, e o `<em>` do editor a
-- reproduz. Já o sublinhado que abre um item continua virando texto puro, com
-- o `:` marcando o termo, e o do meio da frase vira `<strong>`.
--
-- A única "imagem" do documento é um espaçador de 1×1 pixel, do mesmo tipo que
-- a importação da Química descartou. Não entra nada.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"Trovadorismo (séculos XII e XII)"**, com o segundo século repetido — é
--   XII e XIII. Está no TÍTULO do resumo, então aparece na barra lateral e no
--   mapa. É o mais visível dos deslizes desta leva.
-- - "textos escritos para serem encenado", em Dramático.
-- - "Uso da medida nova", "Busca da beleza formal" e mais três características
--   do Classicismo estão em nível 1, irmãs de "Características literárias:" em
--   vez de filhas dela. Continuam onde estavam.
-- - "crítica a pedofilia" sem crase, em O velho da Horta.
-- - "Hipérbato: inversão sintática" está listado entre as características do
--   Cultismo, junto com Metáfora, Antítese, Paradoxo e Prosopopeia, que são
--   figuras de linguagem e não traços da escola.
-- - "Considerado com um filósofo da religião" (por "como"), em Vieira.
-- - "adequar os textos bíblicos a realidade humana", sem crase.
-- - "Santo António" com o acento português, no sermão.
-- - "os deuses voltam–se para a natureza", com travessão no lugar do hífen.
-- - A tabela de características do Romantismo tem uma célula vazia na última
--   linha, porque a terceira coluna acabou antes. Entrou como está.
--
-- Não há fórmula nem `[[wikilink]]` nesta leva, então não há
-- `update corpo = corpo` no fim. `on conflict (slug) do nothing` deixa rodar de
-- novo sem duplicar.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'generos-literarios',
  'Gêneros literários',
  'literatura',
  'comum',
  'Narrativo, lírico e dramático — o que define cada um e os subgêneros que cabem neles.',
  '<h2 data-corrido="sim">Narrativo (épico):</h2><p>toda forma de narrativa literária;</p><ul><li><p>Aquele em que um narrador conta (em versos ou não), as peripécias de personagens envolvidos nos mais diferentes eventos e situações;</p></li></ul><p>Elementos:</p><ul><li><p>Enredo: história que narra uma sucessão dos acontecimentos;</p></li><li><p>Narrador: aquele que narra a história;</p></li><li><p>Personagens: pessoas que estão presentes na história;</p></li><li><p>Tempo: o período em que acontece a história;</p></li><li><p>Espaço: local onde se passa a história;</p></li></ul><p>Subgêneros:</p><ul><li><p>Epopeia: narrativa longa sobre fatos grandiosos de um herói ou de um povo;</p></li><li><p>Romance: narrativa extensa escrita em prosa que revela ações de personagens dentro de uma história;</p></li><li><p>Novela: escrita em prosa, é uma narrativa longa, porém mais breve e mais dinâmica que o romance;</p></li><li><p>Conto: escrito em prosa, é uma narrativa mais objetiva e curta que a novela e o romance;</p></li><li><p>Crônica: narrativa breve que foca em acontecimentos do cotidiano;</p></li><li><p>Fábula: narrativa fantasiosa que procura ensinar sobre algo;</p></li></ul><h2 data-corrido="sim">Lírico:</h2><p>textos organizados em versos, preocupados em expressar e traduzir sentimentos e expressar emoções;</p><ul><li><p>Não há narrador, mas há o eu lírico: eu poético que expressa as emoções imaginadas pelo poeta;</p></li><li><p>Gênero <strong>subjetivo</strong>, centrado em seu jeito e universo interior;</p></li></ul><p>Subgêneros:</p><ul><li><p>Soneto: poema de forma fixa, formado por catorze versos (dois quartetos e dois tercetos);</p></li><li><p>Poesia: texto poético formado por versos que se agrupam em estrofes;</p></li><li><p>Ode: poema de exaltação composta para ser declamada ou cantada;</p></li><li><p>Haicai: poema de forma fixa de origem japonesa, formado por três versos;</p></li><li><p>Hino: poema que homenageia alguém ou venera algo;</p></li><li><p>Sátira: poema que ridiculariza pessoas ou costumes;</p></li></ul><h2 data-corrido="sim">Dramático:</h2><p>textos escritos para serem encenado, também chamados de textos dialogados;</p><ul><li><p>Geralmente divididos em atos, quando as ações ocorrem num mesmo espaço, e cenas, quando há mudança de local e personagens;</p></li><li><p>Presença de diálogos entre os personagens;</p></li></ul><p>Subgêneros:</p><ul><li><p>Tragédia: texto teatral trágico com tensão permanente e final infeliz;</p></li><li><p>Comédia: texto teatral humorístico que satiriza diversos aspectos da sociedade;</p></li><li><p>Tragicomédia: texto teatral que reúne aspectos trágicos e cômicos;</p></li><li><p>Farsa: texto teatral curto e cômico, formado por um ato;</p></li><li><p>Auto: texto teatral de abordagem mais religiosa e moralista;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'trovadorismo',
  'Trovadorismo (séculos XII e XII)',
  'literatura',
  'comum',
  'As cantigas da Idade Média, líricas e satíricas, e a vassalagem que lhes dá a metáfora.',
  '<p>movimento literário da Idade Média, com origem no sul da França e forte expressão na Península Ibérica;</p><h2 data-corrido="sim">Vassalagem:</h2><p>relação feudal de lealdade e troca de serviços entre um suserano e seu vassalo;</p><h2 data-corrido="sim">Cantigas:</h2><p>poemas compostos para serem cantados e acompanhados com música;</p><ul><li><p>Compiladas em cancioneiros;</p></li></ul><h3>Líricas:</h3><ul><li><p>Cantigas de amor: expressão amorosa do eu lírico masculino (vassalo trovador).</p></li><li><p>Cantigas de amigo: expressão amorosa do eu lírico feminino (compositores homens)</p></li></ul><h3>Satíricas:</h3><ul><li><p>Cantigas de escárnio;</p><ul><li><p>Crítica indireta;</p></li><li><p>Linguagem ambígua;</p></li><li><p>Ironia;</p></li></ul></li><li><p>Cantigas de maldizer;</p><ul><li><p>Crítica direta;</p></li><li><p>Mais rude;</p></li><li><p>Palavrões e obscenidades;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'humanismo',
  'Humanismo (século XV)',
  'literatura',
  'comum',
  'A passagem do teocentrismo ao antropocentrismo, a prosa de Fernão Lopes e o teatro de Gil Vicente.',
  '<p>transição entre Idade Média e Renascimento;</p><h2>Contexto Histórico e Social:</h2><ul><li><p>Transição do teocentrismo medieval para o antropocentrismo renascentista.</p></li><li><p>Fortalecimento do poder real, crescimento da burguesia e do comércio.</p></li><li><p>Influência da cultura clássica (valorização do homem, da razão e da história).</p></li><li><p>Formação do Estado moderno português e início das Grandes Navegações.</p></li></ul><h2>Manifestações Literárias:</h2><h3>Prosa Histórica:</h3><ul><li><p>Fernão Lopes: cronista oficial da monarquia portuguesa.</p><ul><li><p>Introduz o realismo, a observação social e o senso de veracidade nos textos históricos.</p></li><li><p>Ex: <em>Crônica de D. Pedro I</em>.</p></li></ul></li></ul><h2>Poesia Palaciana:</h2><ul><li><p>Continuidade da poesia trovadoresca, mas agora nos ambientes cortesãos.</p></li><li><p>Substituição da medida velha (redondilha) pela medida nova (decassílabos).</p></li><li><p>Temática amorosa ainda presente, porém com maior refinamento formal e intelectualização.</p></li></ul><h3>Teatro de Gil Vicente:</h3><ul><li><p>Marco da dramaturgia portuguesa;</p></li><li><p>Mistura entre elementos medievais (moralismo, alegorias religiosas) e renascentistas (crítica social);</p></li><li><p>Crítica ao clero, à burguesia e à corrupção geral da sociedade;</p></li><li><p>Obras principais:</p><ul><li><p><em>Auto da Barca do Inferno</em>: julgamento moral das almas; sátira de todos os setores sociais;</p></li><li><p><em>Farsa de Inês Pereira</em>: crítica ao casamento por interesse e à hipocrisia da sociedade;</p></li></ul></li><li><p>Uso de linguagem acessível e personagens-tipo;</p></li><li><p><em>O velho da Horta</em>: crítica a pedofilia e assédio de mais velhos a “crianças” mesmo quando casados;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'classicismo',
  'Classicismo (século XVI)',
  'literatura',
  'comum',
  'O Renascimento em Portugal, a medida nova e os dois Camões — o dos sonetos e o de Os Lusíadas.',
  '<p>renascimento Literário em Portugal;</p><h2>Contexto Histórico e Cultural</h2><ul><li><p>Influência direta do Renascimento italiano.</p></li><li><p>Racionalismo, harmonia, equilíbrio e culto à Antiguidade Clássica (Grécia e Roma).</p></li><li><p>Expansão marítima portuguesa (Descobrimentos);</p></li></ul><h2>Características literárias:</h2><ul><li><p><strong>Antropocentrismo</strong> e ideal de medida perfeita;</p></li><li><p>Influência de <strong>autores clássicos</strong> (Horácio, Virgílio, Ovídio);</p></li><li><p>Uso da <strong>medida nova</strong> (versos decassílabos, soneto);</p></li><li><p>Busca da <strong>beleza formal</strong> e da universalidade temática;</p></li></ul><h2>Poesia Lírica – Luís de Camões</h2><ul><li><p>Amor como conflito entre razão e emoção.</p></li><li><p>Sonetos amorosos: idealização da amada + sofrimento do eu lírico.</p></li><li><p>Sonetos filosóficos: efemeridade da vida, <em>carpe diem</em>, vaidade do mundo.</p></li></ul><h2>Poesia Épica – Os Lusíadas</h2><ul><li><p>Publicado em 1572.<br>Epopeia nacionalista que exalta os feitos do povo português.</p></li><li><p>Combina:</p></li><li><p>Mitologia greco-romana + fatos históricos reais.</p></li><li><p>Forma clássica (oitava rima, versos decassílabos).</p></li><li><p>Estrutura: 10 cantos → proêmio, invocação, dedicatória, narrativa épica.</p></li><li><p>Destaques:</p></li><li><p>Canto I: exaltação dos heróis lusitanos.</p></li><li><p>Velho do Restelo: crítica ao expansionismo desenfreado.</p></li><li><p>Ilha dos Amores: alegoria da recompensa heroica.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'quinhentismo',
  'Quinhentismo (século XVI no Brasil)',
  'literatura',
  'comum',
  'Os primeiros textos escritos no Brasil: a literatura de informação e a de catequese.',
  '<p>literatura de Informação e Catequese;</p><h2>Contexto Histórico</h2><ul><li><p>Colonização do Brasil a partir de 1500.</p></li><li><p>Primeiros textos produzidos em solo brasileiro.</p></li><li><p>Finalidade prática, não estética: descrever, catalogar e justificar a colonização.</p></li></ul><h2>Vertentes</h2><h3>Literatura de Informação:</h3><ul><li><p>Escrita por viajantes, cronistas e exploradores.</p></li><li><p>Descreve a terra, o clima, a flora, a fauna e os indígenas.</p></li><li><p>Visão eurocêntrica: o Brasil como paraíso exótico e fonte de riqueza.</p></li><li><p>Destaques:</p><ul><li><p><em>Carta de Pero Vaz de Caminha</em> (1500): “certidão de nascimento do Brasil”.</p></li><li><p>Gabriel Soares de Sousa, Fernão Cardim: cronistas naturalistas.</p></li></ul></li></ul><h3>Literatura Jesuítica/catequética:</h3><ul><li><p>Objetivo catequético.</p></li><li><p>Escrito por missionários como Padre José de Anchieta.</p></li><li><p>Produção em português, latim e tupi.</p></li><li><p>Textos teatrais e poéticos para doutrinar indígenas.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'barroco',
  'Barroco (seiscentismo ou gongorismo)',
  'literatura',
  'comum',
  'O dualismo entre céu e inferno, o cultismo e o conceptismo, e os dois nomes: Gregório de Matos e Vieira.',
  '<h2>Contexto histórico: reformas religiosas;</h2><ul><li><p>Reforma protestante;</p></li><li><p>Contrarreforma católica;</p></li></ul><h2>Características literárias:</h2><h3 data-corrido="sim">Dualismo:</h3><p>Céu X inferno; pecado X arrependimento;</p><h3 data-corrido="sim">Cultismo:</h3><p>jogo de palavras;</p><ul><li><p>Vocabulário culto, rebuscado;</p></li><li><p>Presença de figuras de linguagem;</p></li></ul><h3 data-corrido="sim">Metáfora:</h3><p>comparação sem o conectivo “como”;</p><ul><li><p>Ex: “Minha vida é um palco iluminado.”</p></li></ul><h3 data-corrido="sim">Hipérbole:</h3><p>exagero</p><ul><li><p>Ex: “Te trago mil rosas roubadas.”</p></li></ul><h3>Antítese:</h3><ul><li><p>Ideias opostas.</p></li></ul><h3>Paradoxo:</h3><ul><li><p>No paradoxo, é necessário que uma das ideias não exista para que a situação tenha lógica.</p></li></ul><h3 data-corrido="sim">Prosopopeia:</h3><p>características humanas em seres não humanos.</p><h3 data-corrido="sim">Hipérbato:</h3><p>inversão sintática.</p><h3 data-corrido="sim">Conceptismo:</h3><p>jogo de ideia, Barrocos, argumentos;</p><h3 data-corrido="sim">Fusionismo:</h3><p>mescla de ideias profanas e sagradas;</p><h3 data-corrido="sim">Feísmo:</h3><p>ser humano sendo visto em seu estado de sofrimento.</p><h2>Autores principais:</h2><ul><li><p>Na poesia: <strong>Gregório de Matos Guerra</strong>, que recebeu a alcunha (apelido) de “O boca do inferno”</p><ul><li><p>Pela suas críticas foi exilado à África;</p></li><li><p>Produziu poemas:</p><ul><li><p>Satíricos: “Não sabe governar sua cozinha, e querem governar o mundo inteiro”</p></li><li><p>Líricos:</p><ul><li><p>Amorosos: a mulher é vista segundo o preceito dualista - ora angelical, ora sensual;</p></li><li><p>Filosóficos: <em>carpe diem</em>, efemeridade e <em>memento mori;</em></p></li><li><p>Religiosos: arrependido, pede perdão a Deus;</p></li></ul></li></ul></li></ul></li><li><p>Na prosa: <strong>Padre Antônio Vieira</strong>;</p><ul><li><p>Foi importante tanto para o Barroco no Brasil como em Portugal;</p></li><li><p>Considerado com um <strong>filósofo da religião</strong>;</p></li><li><p><strong>Defendia os indígenas, adequar os textos bíblicos a realidade humana</strong>;</p></li><li><p>Ficou conhecido pelos seus sermões;</p></li><li><p>Os principais são:</p><ul><li><p><em>Sermão da Sexagésima;</em></p></li><li><p><em>Sermão de Santo António aos Peixes</em>;</p></li></ul></li><li><p>Sua retórica era impecável, poder de persuasão, usava interrogações em seus sermões com o intuito de incluir o ouvinte (leitor) na mensagem;</p></li><li><p>A arte de produzir sermões - metalinguagem era uma de suas práticas (<em>memento mori</em>).</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'arcadismo',
  'Arcadismo',
  'literatura',
  'comum',
  'A fuga da cidade e a vida pastoril, os lemas latinos e os poetas da Inconfidência.',
  '<p>movimento literário que surgiu no Brasil no séc. XVIII, também conhecido como <strong>Neoclassicismo</strong> ou <strong>Setecentismo</strong> por resgatar valores clássicos de produção, assim como as referências mitológicas;</p><ul><li><p>Desenvolveu-se entre 1768 e 1836, tendo como marco inicial a publicação de <em>Obras Poéticas</em> de Cláudio Manuel da Costa;</p></li><li><p>Origem do nome: Arcádia - local mitológico que, para encontrar paz e equilíbrio, os deuses voltam–se para a natureza;</p></li><li><p>Buscava a vida simples e natural, em oposição ao artificialismo do Barroco, com forte presença do bucolismo (vida pastoril) e da natureza como refúgio;</p></li><li><p><strong>Só existiu na poesia (lírica, épica e satírica)</strong>;</p></li></ul><h2>Contexto histórico:</h2><ul><li><p>Inconfidência Mineira: muitos poetas árcades participaram da Inconfidência Mineira (1789), movimento que buscava a independência do Brasil de Portugal, como Cláudio Manuel da Costa e Tomás Antônio Gonzaga;</p></li><li><p>Influência do Iluminismo: valorização da razão, a ciência e o questionamento das tradições;</p></li><li><p>Transição Colonial: surgimento de temas nativistas que valorizavam elementos da terra brasileira;</p></li><li><p>Ciclo do Ouro em Minas Gerais: período de grande prosperidade econômica e cultural na região. Vila Rica (atual Ouro Preto) tornou-se o centro cultural da colônia;</p></li></ul><h2 data-corrido="sim">Características Literárias:</h2><p>simplicidade, clareza e idealização da vida campestre, em oposição ao rebuscamento barroco:</p><ul><li><p>Bucolismo: valorização da vida pastoril e campestre, com pastores idealizados em ambientes naturais;</p></li><li><p><em>Fugere urbem</em>: fuga da cidade e busca pelo refúgio na natureza, em oposição à vida urbana;</p></li><li><p><em>Inutilia truncat</em>: cortar o inútil, busca pela simplicidade e clareza na expressão;</p></li><li><p><em>Aurea mediocritas:</em> encontrar a felicidade na moderação, no contentamento com o suficiente;</p></li><li><p><em>Carpe diem</em>: aproveitar o dia, viver o momento presente;</p></li><li><p><em>Locus amoenus</em>: representação do lugar ameno e agradável, com paisagens idealizadas;</p></li><li><p>Pastoralismo: idealização da vida simples dos pastores como símbolo de pureza e harmonia com a natureza.</p></li><li><p>Inspiração clássica: retorno aos modelos greco-latinos, com uso de pseudônimos pastoris e referências mitológicas;</p></li><li><p><strong>Objetividade e preocupação com o fazer poético.</strong></p></li></ul><h2>Principais autores:</h2><ul><li><p>Cláudio Manuel da Costa: produz a primeira obra árcade <em>Obras Poéticas</em>;</p><ul><li><p>Pseudônimo: Glauceste Satúrnio;</p></li><li><p>Principais obras: <em>Obras Poéticas</em> e <em>Vila Rica</em> (poema épico) e sonetos;</p></li></ul></li><li><p>Tomás Antônio Gonzaga: um dos principais poetas do Arcadismo brasileiro;</p><ul><li><p>Pseudônimo pastoril: Dirceu;</p></li><li><p>Foi preso e exilado à África por participar da Inconfidência Mineira;</p></li><li><p>Principais obras: <em>Marília de Dirceu</em> (maior poesia lírica do Brasil) dedicado a sua amada Maria Doroteia (Marília) e <em>Cartas Chilenas</em> (obra satírica) na qual critica o governo português no Brasil;</p></li></ul></li><li><p>Frei Santa Rita Durão:</p><ul><li><p>Principal obra: <em>Caramuru</em> (poema épico) narra a história de Diogo Álvares Correia, náufrago português que viveu entre os indígenas na Bahia no século XVI;</p></li></ul></li><li><p>Basílio da Gama:</p><ul><li><p>Principal obra: <em>O Uraguai</em> narra os conflitos entre portugueses e espanhóis contra os índios guaranis e jesuítas nas Missões do Sul. A obra é considerada inovadora por apresentar o índio como herói e criticar a ação dos jesuítas;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'romantismo',
  'Romantismo',
  'literatura',
  'comum',
  'A escola da burguesia no século XIX, e as três gerações da poesia romântica brasileira.',
  '<p>escola literária da burguesia: séc XIX;</p><h2>Europa:</h2><ul><li><p>Victor Hugo: <em>os miseráveis</em> → Francês;</p></li><li><p>Lord Byron → romantizar a morte → inglês;</p></li></ul><ul><li><p>Início: 1836, com a obra <em>Suspiros Poéticos</em>, do autor Gonçalves de Magalhães;</p></li><li><p>O romantismo encerra em 1881, com a introdução do realismo, com Machado;</p></li><li><p><strong>Poesia e prosa</strong>: compõem o movimento no Brasil;</p></li><li><p>Na poesia, temos as 3 gerações românticas;</p></li></ul><h2>Características literárias gerais:</h2><table><tbody><tr><td><p>- Sentimentalismo</p></td><td><p>- Presença de heróis</p></td><td><p>- Saudosismo</p></td></tr><tr><td><p>- Subjetividade</p></td><td><p>- Narrativas lineares</p></td><td><p>- Nacionalismo → patriotismo</p></td></tr><tr><td><p>- Idealização dos personagens</p></td><td><p>- Descritivismo</p></td><td><p>- Lutas sociais</p></td></tr><tr><td><p>- Religiosidade</p></td><td><p>- Bom selvagem (herói nativo)</p></td><td><p>- Fantasias</p></td></tr><tr><td><p>- Escapismo</p></td><td><p>- Ultrarromantismo</p></td><td><p>- Morte/pessimismo</p></td></tr><tr><td><p>- Presença de finais felizes</p></td><td><p></p></td><td><p></p></td></tr></tbody></table><h2>Contexto histórico:</h2><ul><li><p>Revolução Francesa;</p></li><li><p>Revolução Industrial;</p></li><li><p>Independência do Brasil;</p></li><li><p>Crescimento da corte brasileira: o RJ;</p></li><li><p>Inauguração da 1ª biblioteca do Brasil;</p></li><li><p>Inauguração de um centro de belas Artes no RJ, assim como a 1ª instituição de Ensino Superior;</p></li><li><p>Surgiu no Brasil após a Independência (1822) e foi impulsionado pela necessidade de criar uma identidade nacional, rompendo com os padrões portugueses e valorizando a cultura e os elementos genuinamente brasileiros, como o indígena e a natureza;</p></li></ul><h2>As três gerações da poesia romântica no Brasil:</h2><h3 data-corrido="sim">1ª geração:</h3><p>indianista / nacionalista;</p><ul><li><p><strong>Índio como herói nacional;</strong></p></li><li><p>Nacionalismo: O romance exalta a natureza e a formação do povo brasileiro;</p></li><li><p>Idealização: A figura do indígena é idealizada, buscando uma identidade nacional baseada em seu passado;</p></li><li><p>Prosa poética e linguagem que mistura lirismo e a criação de um Brasil épico;</p></li><li><p>Ex: <em>I-Juca Pirama</em> e <em>os Timbiras</em> (de Gonçalves Dias);</p></li></ul><h3 data-corrido="sim">2ª geração:</h3><p>mal do século / ultrarromântica / byronismo</p><ul><li><p>Textos mais pessimistas, que tratam sobre a morte;</p></li><li><p>Escapismo: fuga da realidade;</p></li><li><p>Fantasia;</p></li><li><p>Amor platônico;</p></li><li><p>A mulher pode ser tratada como pura (virgem) ou sensualizada;</p></li><li><p>Religiosidade;</p></li><li><p>Gótico;</p></li><li><p>Boemia;</p></li><li><p>Principais autores:</p><ul><li><p>Álvares de Azevedo: <em>Lira dos 20 anos</em> / <em>Noite na Taverna</em>;</p></li><li><p>Casimiro de Abreu: <em>Meus 8 anos</em> → “Oh, que saudades que eu tenho, da aurora da minha vida”;</p></li><li><p>Fagundes Varela;</p></li><li><p>Junqueira Freire;</p></li></ul></li></ul><h3 data-corrido="sim">3ª geração:</h3><p>condoreira;</p><ul><li><p>Abolição da escravatura;</p></li><li><p>Liberdade;</p></li><li><p>Poesia social (de comício ou de grandiloquente);</p></li><li><p>Poeta dos escravos:</p><ul><li><p>Castro Alves: <em>Navio Negreiro</em> / <em>Os Escravos</em>;</p></li><li><p>*<em>Espumas flutuantes</em> de Castro Alves NÃO pertence à 3ª geração, seu teor é mais característico da 2ª.</p></li></ul></li></ul><p>RESUMINDO: a Primeira Geração (Nacionalista/Indianista) foca no nacionalismo, na exaltação da natureza e do indígena; a Segunda Geração (Ultrarromântica/Mal do Século) é marcada pelo egocentrismo, pessimismo, subjetivismo e idealização amorosa; e a Terceira Geração (Condoreira/Social) aborda questões sociais, o abolicionismo, a liberdade e a crítica política.</p>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- Guardas
-- ============================================
do $$
declare
  n_novos int;
  n_titulos int;
begin
  select count(*) into n_novos
    from resumos
   where materia_slug = 'literatura' and processo_slug = 'comum';
  if n_novos <> 8 then
    raise exception 'esperava 8 resumos de Literatura em comum, encontrei %', n_novos;
  end if;

  select count(*) into n_titulos
    from (select titulo from resumos group by titulo having count(*) > 1) x;
  if n_titulos <> 0 then
    raise exception '% títulos repetidos no acervo', n_titulos;
  end if;
end $$;

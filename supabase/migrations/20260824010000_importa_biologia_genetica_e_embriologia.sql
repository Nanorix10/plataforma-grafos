-- Importa a segunda metade da Biologia, vinda de "Materias e conteúdos feitos/
-- Biologia.docx": os sistemas endócrino e nervoso, a genética e a embriologia.
--
-- Vinte resumos e quarenta e oito figuras. `processo_slug = 'comum'`, como
-- as outras matérias vindas dos documentos-mestre (decisão 1c). Todos na raiz.
--
-- Fecha o documento, que veio em duas migrations por ser o maior da pasta —
-- quarenta e sete tópicos, oitenta e duas imagens, 29 MB. A primeira leva
-- (`20260823230000`) foi da célula até a Eutrofização; esta pega do Sistema
-- endócrino em diante.
--
-- ## Dois tópicos NÃO entraram, porque já estão no site
--
-- São os mesmos dois que a primeira leva já tinha deixado de fora, e que caem
-- nesta metade do documento:
--
-- - **Ciclo celular** veio da 1ª etapa do PAS UEM em 21/08 (`20260821005035`),
--   com o mesmo texto e as mesmas treze figuras da mitose e da meiose — que por
--   isso já estão no repositório e não voltam aqui.
-- - **Conceitos-Chave e Estruturas** é nível 0 no documento, mas o conteúdo já
--   vive dentro do `ciclo-celular`, como a última seção dele.
--
-- Conferido título a título contra o banco antes de escrever, como a Língua
-- Portuguesa obrigou: os vinte títulos que entram não existem em resumo
-- nenhum do acervo, em matéria nenhuma. Título repetido deixaria o trigger
-- `sync_conexoes_resumo` sem destino definido.
--
-- ## Um tópico ficou de fora porque está VAZIO no documento
--
-- **"Primeira lei e noções de probabilidade"** é nível 0, entre os Heredogramas
-- e a Codominância, e tem exatamente uma linha embaixo: "Questão resolvida:".
-- A questão nunca foi escrita — não há texto, tabela nem imagem depois dela.
--
-- Entrar assim publicaria um resumo com um título e nada dentro; inventar a
-- questão é o que a decisão 9c proíbe em letra. Fica de fora, e **vale avisar o
-- autor**: a 2ª lei de Mendel está aqui, e o site vai ter a segunda sem a
-- primeira até ele escrever esse pedaço.
--
-- ## O que muda de FORMA
--
-- Mesmo mapeamento das outras migrations, com a regra do sublinhado na versão
-- de três casos que a Filosofia fixou: grifo que cobre o item inteiro vira
-- texto puro, grifo que destaca um trecho dentro da frase vira `<strong>`, e o
-- `:` do começo do item continua marcando o termo sozinho.
--
-- O recuo do documento chega a nove níveis aqui (o Sistema endócrino desce de
-- glândula a hormônio a sintoma). Segue o que o `ciclo-celular` já fazia, que é
-- o irmão deste texto: os primeiros níveis viram `h2`/`h3` com
-- `data-corrido="sim"`, e do quarto em diante vira lista aninhada. Nove `<ul>`
-- encaixados empurrariam o texto para fora da coluna de 620px.
--
-- ## Duas "imagens" que não eram imagem
--
-- - A **tabela de genótipos do sistema ABO** (tipo sanguíneo × genótipo) vinha
--   como print. Entra como `<table>`, com os genótipos em `<sup>` de texto —
--   é símbolo solto, não fórmula (decisão 8b).
-- - O **quadro de genes e fenótipos** da questão da UEA, que o próprio
--   enunciado chama de "o quadro", também era print. Vira `<table>`.
--
-- É o que a Química fez em agosto, e pela mesma razão: print de tabela não se
-- seleciona, não rola no celular e tem fundo branco — no tema escuro seria um
-- retângulo aceso no meio do texto.
--
-- A tabela do sistema Rh (hemácia / genótipo / fator / plasma) **continua
-- imagem**: duas das células são desenhos de hemácia, e virar `<table>` jogaria
-- fora justamente o que ela mostra.
--
-- ## As quarenta e oito figuras
--
-- 11,78 MB no documento, 1,45 MB no repositório em WebP q82.
--
-- Todas entram com `width:100%`, e não com a largura que têm no documento. Ali
-- o autor as deixou entre 160px e 740px numa folha que se aproxima com o zoom;
-- aqui a coluna tem 620px fixos e cada uma destas é um diagrama rotulado — a
-- de glândulas endócrinas está a 213px no `.docx` e tem doze rótulos.
--
-- As três exceções são as **fotos de bovino** (ruão, vermelha e branca) da
-- questão de codominância, a 320px: são um comparativo de três fenótipos lado a
-- lado, e a 100% viram uma coluna de vacas enormes empurrando o enunciado para
-- baixo da dobra.
--
-- Duas ganharam nome pelo que mostram e não pelo tópico onde estão:
-- `ciclo-do-calcio` (o diagrama de setas da calcitonina com o paratormônio, que
-- está dentro da Tireoide) e `derivados-dos-folhetos-germinativos` (a lista de
-- órgãos por folheto, que está na Organogênese).
--
-- ## A figura da simbologia mudou de parágrafo
--
-- Em Heredogramas o autor escreveu "Simbologia:" e, no parágrafo seguinte,
-- "Herança:" com a imagem da legenda de símbolos ancorada nele. A imagem É a
-- simbologia — quadrado, círculo, losango, gêmeos, casal consanguíneo. Entrou
-- sob "Simbologia", senão o site publicaria um item "Simbologia:" vazio seguido
-- de "Herança:" com a legenda errada embaixo.
--
-- Pela mesma razão, o **quadro de Punnett** da questão de codominância entrou
-- depois da frase que termina em "…um quadro de Punnet →", e não antes dela: no
-- documento ele flutua à direita dessa frase, e a seta aponta para o lado. Numa
-- coluna só, acima da frase, a seta apontaria para o nada.
--
-- Fora essas duas, as quarenta e seis figuras restantes estão exatamente onde o
-- documento as ancorou.
--
-- ## Quatro figuras que o documento PERDEU
--
-- A Gametogênese aponta quatro vezes para `media/image38.png`, e esse arquivo
-- tem 70 bytes: é um PNG de 1×1 pixel, o marcador que o Word deixa quando a
-- imagem se perde. As quatro chamadas ficaram sem figura nenhuma — as duas dos
-- rótulos "Masculinos"/"Femininos", a do fim da espermatogênese e a do fim da
-- ovogênese. Não há o que importar, e **vale avisar o autor**: o resumo de
-- Gametogênese é o único desta leva sem imagem alguma.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"Prevenção…"** é título de resumo e vem com reticências, porque no
--   documento ele emenda nos filhos ("contra IST's", "contra entorpecentes").
--   Entrou como "Prevenção", sem as reticências — no site o título é um nó do
--   grafo, não o começo de uma frase. O texto dos filhos está intacto.
-- - **"Bacterias"**, sem acento, é o título do tópico no documento.
-- - "Cocos; bolinahs" e "Vibrias; espiroque", em Bacterias — são anotações
--   inacabadas do próprio autor, e "Vibriões" está escrito "Vibrias".
-- - "Metabolismo energético" tem três linhas: carboidratos, proteínas e
--   lipídeos, com "Lipideos" sem acento. É o último tópico do documento.
-- - "espermatozóide", "ovogônia", "haplóide" e "diplóide" com o acento do
--   acordo velho, ao lado de "haploide" e "diploide" sem ele, às vezes na mesma
--   frase.
-- - "esqueleto hirostático", por hidrostático, no Celoma.
-- - "prenchida" e "orgãos internos", no mesmo item do Celoma.
-- - "Bem dissolvida apenas nos mamíferos placentários", na Placenta — deve ser
--   "desenvolvida".
-- - "um único dentrito", por dendrito, no neurônio bipolar.
-- - "cromossomas duplicados", na espermatogênese.
-- - "o Diminui o volume de urina excretado" e "o Retém água no organismo" —
--   o "o" solto é marca de lista que virou texto no documento, sob o ADH.
-- - "Esta ovócito primário", "a probabilidade de o casal gerar" e os demais
--   deslizes de concordância seguem como estão.
-- - "Situação I/II/III" das três genealogias de eritroblastose só existe dentro
--   da imagem; o texto não as chama.
--
-- Os cinco nós de fórmula destes resumos passaram pelo KaTeX em modo estrito
-- antes de entrar: dois são o íon cálcio da calcitonina e do paratormônio, três
-- são as contas das questões resolvidas. O `75%` da última entrou como `75\%` —
-- sem a barra o KaTeX lê o `%` como início de comentário e engole o resto.
--
-- Não há `[[wikilink]]`. `on conflict (slug) do nothing` deixa rodar de novo sem
-- duplicar.

-- ============================================
-- 1. Os sistemas endócrino e nervoso
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sistema-endocrino',
  'Sistema endócrino',
  'biologia',
  'comum',
  'Glândula por glândula: que hormônio cada uma libera, e o que a falta e o excesso de cada um provocam.',
  '<p>responsável pelo controle das atividades metabólicas do organismo;</p>
<p>Atua a longo prazo, através de sinais químicos, executados por substâncias denominadas…</p>
<ul><li><p>Hormônios: substâncias que atuam controlando o funcionamento de alguns órgãos;</p></li>
<li><p>Glândulas endócrinas: produzem e secretam hormônios diretamente na corrente sanguínea;</p></li></ul>
<h2 data-corrido="sim">Hipotálamo:</h2>
<p>recebe informações do sistema nervoso e secreta hormônios que atuam sobre a hipófise anterior (adenohipófise);</p>
<ul><li><p>Possui neurônios que produzem os hormônios (oxitocina e Antidiurético “ADH”) que são armazenados e liberados pela hipófise posterior (neurohipófise);</p></li></ul>
<h2>Hipófise:</h2>
<h3 data-corrido="sim">Adenohipófise:</h3>
<p>libera os hormônios…</p>
<ul><li><p>Hormônio do crescimento ou somatotrófico (GH/SH): promove o crescimento das cartilagens e dos ossos;</p>
<ul><li><p>Influencia o metabolismo das proteínas, carboidratos e lipídios;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/glandulas-endocrinas-no-corpo.webp" alt="Silhueta do corpo humano com as glândulas endócrinas assinaladas de cima para baixo: hipotálamo e hipófise na cabeça, glândulas parótidas e glândula tireoide no pescoço, glândulas suprarrenais sobre os rins, pâncreas no abdome, e as gônadas — ovários no sexo feminino, testículos no masculino." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Deficiência na infância provoca o nanismo. (A)</p></li>
<li><p>Excesso na infância provoca o gigantismo. (B)</p></li>
<li><p>Excesso no adulto provoca a acromegalia. (C)</p></li></ul></li></ul></li>
<li><p>Tireotrofina (TSH): estimula a glândula tireóide a produzir o hormônio Tiroxina;</p>
<ul><li><p>Deficiência pode causar o hipotiroidismo;</p></li>
<li><p>Excesso pode causar o hipertireoidismo;</p></li></ul></li>
<li><p>Adrenocorticotrófico (ACTH): estimula o córtex da glândula suprarrenal a produzir os hormônios glicocorticóides (cortisol);</p></li>
<li><p>Prolactina (LTH):</p>
<ul><li><p>Desenvolvimento das mamas</p></li>
<li><p>Produção de leite</p></li>
<li><p>Homens (função desconhecida)</p></li></ul></li>
<li><p>Folículo estimulante (FSH):</p>
<ul><li><p>Homem: o induz a produção de espermatozóide;</p></li>
<li><p>Mulher:</p>
<ul><li><p>Promove o desenvolvimento do folículo ovariano;</p></li>
<li><p>Estimula o ovário a produzir estrógeno;</p></li></ul></li></ul></li>
<li><p>Luteinizante (LH):</p>
<ul><li><p>Homem: o induz o testículo a produzir testosterona</p></li>
<li><p>Mulher:</p>
<ul><li><p>Estimula a ovulação;</p></li>
<li><p>Desenvolvimento do corpo lúteo (amarelo);</p></li></ul></li></ul></li></ul>
<h3 data-corrido="sim">Neurohipófise:</h3>
<p>armazena e libera dois hormônios produzidos pelo hipotálamo;</p>
<ul><li><p>Antidiurético (ADH) ou Vasopressina:</p>
<ul><li><p>É liberado quando o volume de sangue cai abaixo de certo nível;</p></li>
<li><p>Estimula a reabsorção de água nos rins;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/hipofise-e-hipotalamo.webp" alt="Corte da hipófise pendurada no hipotálamo: os neurônios do hipotálamo descem em feixe até a neurohipófise, de onde saem os hormônios ADH e oxitocina; ao lado ficam o lobo intermédio e a adenohipófise." style="width:100%" data-largura="100%"></figure>
<ul><li><p>o Diminui o volume de urina excretado (antidiurético)</p></li>
<li><p>o Retém água no organismo;</p></li></ul></li>
<li><p>Sua deficiência provoca uma perda de água excessiva e muita sede, síndrome denominada <em>diabetes insípidos</em>;</p></li></ul></li>
<li><p>Oxitocina</p>
<ul><li><p>Promove contrações no útero durante o parto;</p></li>
<li><p>Contração da musculatura lisa das glândulas mamárias, causando a ejeção do leite;</p>
<ul><li><p>O estímulo para a liberação da oxitocina é a sucção da mama pelo bebê;</p></li></ul></li></ul></li></ul>
<h2 data-corrido="sim">Tireoide:</h2>
<p>localizado no pescoço, logo abaixo das cartilagens da glote; produz três hormônios:</p>
<ul><li><p>Triiodotironina (T3) e Tiroxina (T4):</p>
<ul><li><p>Estimulam o metabolismo energético</p></li>
<li><p>Aumentam a taxa de respiração celular</p></li>
<li><p>O excesso desses hormônios causa o <strong>hipertireoidismo</strong>;</p>
<ul><li><p>Hiperatividade (calor, sudorese);</p></li>
<li><p>Perda de peso;</p></li>
<li><p>Nervosismo;</p></li>
<li><p>Exoftalmia (olhos arregalados para fora das órbitas);</p></li>
<li><p>Bócio (inchaço do pescoço formando um papo);</p></li></ul></li>
<li><p>A falta desse hormônios pode causar <strong>hipotireoidismo</strong>:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/tireoide-e-paratireoides.webp" alt="Desenho da tireoide vista de frente, em vermelho e com o formato de borboleta, e as quatro glândulas paratireoides como pontos amarelos grudados nela." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Pode ser causada devido à carência de iodo na alimentação, pois o iodo é parte constituinte dos hormônios da tireóide;</p></li>
<li><p>Destruição auto-imune da tireóide (tireoidite);</p></li>
<li><p>Consequências:</p>
<ul><li><p>Diminuição do metabolismo celular;</p></li>
<li><p>Ganho de peso</p></li>
<li><p>Bradicardia (desaceleração dos batimentos cardíacos);</p></li>
<li><p>Mixedema (inchaço da pele);</p></li>
<li><p>Bócio;</p></li></ul></li></ul></li></ul></li>
<li><p>Calcitonina: atua diminuindo a quantidade do íon cálcio (<span data-type="inline-math" data-latex="Ca^{+2}"></span>) do sangue e aumentando a concentração deste íon nos ossos.</p>
<ul><li><p>Ação: Hipocalcemiante;</p></li></ul></li></ul>
<h2 data-corrido="sim">Paratireoides:</h2>
<p>produz paratormônio;</p>
<ul><li><p>Responsável pelo aumento do nível de cálcio (<span data-type="inline-math" data-latex="Ca^{+2}"></span>) no sangue;</p></li>
<li><p>Retira cálcio dos ossos, aumentando o nível deste íon na corrente sanguínea;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ciclo-do-calcio.webp" alt="Diagrama em ciclo: o cálcio alto no sangue libera calcitonina, que deposita cálcio nos ossos; o cálcio baixo no sangue libera paratormônio, que retira cálcio dos ossos e devolve o nível ao ponto de partida." style="width:100%" data-largura="100%"></figure></li></ul>
<h2 data-corrido="sim">Suprarrenais (adrenais):</h2>
<p>localizados sobre os rins e dividida em duas regiões:</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/suprarrenal-cortex-e-medula.webp" alt="A glândula suprarrenal em cima do rim e, ao lado, seu corte ampliado: o córtex, na borda, produz cortisol e aldosterona; a medula, no miolo, produz epinefrina e norepinefrina." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Cortisol (hidrocortisona): liberado em situações de estresse</p>
<ul><li><p>É controlado pelo hormônio ACTH produzido pela adenohipófise;</p></li>
<li><p>Atua na produção de glicose a partir de proteínas e gorduras (↑glicemia);</p></li>
<li><p>Reduz inflamações e alergias;</p></li></ul></li>
<li><p>Aldosterona:</p>
<ul><li><p>É controlado pelo hormônio ACTH produzido pela adenohipófise;</p></li>
<li><p>Realiza a reabsorção de sódio (Na+) e a excreção de potássio (K+) nos rins;</p></li>
<li><p>Aumenta a pressão arterial e a volemia (volume de sangue circulante);</p></li></ul></li>
<li><p>Epinefrina (adrenalina): prepara o organismo para enfrentar situações de estresse;</p>
<ul><li><p>Contração dos vasos sanguíneos (vasoconstrição);</p></li>
<li><p>Aumenta a taxa de açúcares no sangue;</p></li>
<li><p>Redistribui sangue para os órgãos e músculos;</p></li></ul></li>
<li><p>Norepinefrina (noradrenalina): atua em conjunto com a epinefrina nas respostas a situações de estresse;</p>
<ul><li><p>Acelera os batimentos cardíacos (taquicardia);</p></li>
<li><p>Mantém a pressão sanguínea em níveis normais;</p></li></ul></li></ul>
<h2 data-corrido="sim">Pâncreas:</h2>
<p>localizado no lado esquerdo da cavidade abdominal; produz dois hormônios:</p>
<ul><li><p>Insulina:</p>
<ul><li><p>Aumenta a permeabilidade da membrana celular à glicose;</p></li>
<li><p>No fígado a insulina promove a formação do glicogênio;</p></li>
<li><p>Ação hipoglicemiante (diminui a quantidade de glicose no sangue);</p></li></ul></li>
<li><p>Glucagon:</p>
<ul><li><p>Efeito inverso ao da insulina</p></li>
<li><p>No fígado, o glucagon estimula a transformação do glicogênio em várias moléculas de glicose, que serão enviadas para o sangue;</p></li>
<li><p>Ação hiperglicemiante (aumenta a quantidade de glicose no sangue);</p></li></ul></li></ul>
<h2>Gônadas:</h2>
<ul><li><p>Testículos (homem): localizados no interior da bolsa escrotal;</p>
<ul><li><p>Sofre influência dos hormônios…</p>
<ul><li><p>FSH: induz a produção de espermatozóides;</p></li>
<li><p>LH: induz a produção de <strong>testosterona</strong> (hormônio sexual masculino):</p>
<ul><li><p>Aparecimento das características sexuais secundárias masculinas (barba, pelos pubianos, engrossamento da voz, desenvolvimento da musculatura, etc.);</p></li>
<li><p>Amadurecimento dos órgãos genitais;</p></li>
<li><p>Libido sexual;</p></li></ul></li></ul></li></ul></li>
<li><p>Ovários (mulher): localizados no interior da cavidade pélvica; produz:</p>
<ul><li><p>Estrógeno:</p>
<ul><li><p>Produzido pelos folículos ovarianos (folículos de Graaf);</p></li>
<li><p>Determina o aparecimento das características sexuais secundárias femininas (mamas, pêlos pubianos, acúmulo de gordura em algumas regiões, etc.);</p></li>
<li><p>Estimula o desenvolvimento do endométrio para receber o embrião;</p></li>
<li><p>Induz o amadurecimento dos órgãos genitais;</p></li>
<li><p>Libido sexual;</p></li></ul></li>
<li><p>Progesterona:</p>
<ul><li><p>Produzida pelo corpo amarelo (corpo lúteo) que se origina do folículo ovariano rompido durante a ovulação;</p></li>
<li><p>Juntamente com o estrógeno, a progesterona atua preparando a parede do endométrio uterino para receber o embrião;</p></li>
<li><p>Estimula o desenvolvimento das glândulas mamárias;</p></li></ul></li>
<li><p>Sofrem influência dos hormônios FSH e LH produzidos pela adenohipófise;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sistema-nervoso',
  'Sistema nervoso',
  'biologia',
  'comum',
  'Central e periférico, do cérebro ao nervo raquidiano, e os neurônios classificados por estrutura e por função.',
  '<p>rede de comunicação e controle do corpo;</p>
<p>Dividido em:</p>
<h2 data-corrido="sim">Central:</h2>
<p>processamento e integração de informações</p>
<h3 data-corrido="sim">Encéfalo:</h3>
<p>é constituído por três órgãos principais</p>
<ul><li><p>Cérebro: órgão mais importante do sistema nervoso;</p>
<ul><li><p>Dividido em hemisfério direito e esquerdo;</p></li>
<li><p>Córtex cerebral: responsável pelo pensamento, visão, audição, tato, paladar, fala, escrita, etc.;</p></li></ul></li>
<li><p>Cerebelo: coordena os movimentos precisos do corpo, além de manter o equilíbrio;</p>
<ul><li><p>Regula o grau de contração dos músculos em repouso;</p></li></ul></li>
<li><p>Tronco encefálico: conduz os impulsos nervosos do cérebro para a médula espinhal e vice-versa;</p>
<ul><li><p>Produz estímulos nervosos que controlam as atividades vitais, como os movimentos respiratórios, batimentos cardíacos e os reflexos (tosse, espirro, deglutição, etc.);</p></li></ul></li>
<li><p>Médula espinhal: cordão do tecido nervoso situado na coluna vertebral;</p>
<ul><li><p>Está conectada ao tronco encefálico;</p></li>
<li><p>Conduz os impulsos nervosos do restante do corpo para o cérebro;</p></li></ul></li></ul>
<h2 data-corrido="sim">Periférico:</h2>
<p>conecta o sistema nervoso central ao resto do corpo;</p>
<ul><li><p>Somático: regula as ações voluntárias;</p></li>
<li><p>Autônomo: atua de modo integrado com o sistema nervoso central e apresenta duas subdivisões:</p>
<ul><li><p>Simpático: estimula o funcionamento dos órgãos;</p></li>
<li><p>Parassimpático: inibe seu funcionamento;</p>
<ul><li><p>Os dois sistemas anteriores têm, em geral, funções contrárias;</p></li></ul></li></ul></li></ul>
<p>Existem dois tipos de nervos:</p>
<ul><li><p>Nervos cranianos: saem do encéfalo e transmitem mensagens sensoriais ou motoras, especialmente para as áreas da cabeça e do pescoço;</p></li>
<li><p>Nervos raquidianos: saem da médula espinhal e são formados por…</p>
<ul><li><p>Neurônios sensoriais: recebem estímulos do ambiente;</p></li>
<li><p>Neurônios motores: levam impulsos do sistema nervoso central para os músculos ou para as glândulas;</p></li></ul></li></ul>
<h2 data-corrido="sim">Neurônios:</h2>
<p>células especializadas na condução de impulsos nervosos;</p>
<p>Podem ser, segundo a estrutura,...</p>
<ul><li><p>Multipolar: possui um só axônio e vários dendritos;</p></li>
<li><p>Bipolar: possui um único axônio e um único dentrito;</p></li>
<li><p>Pseudo-unipolar: possui um único alongamento citoplasmático;</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/tipos-de-neuronio.webp" alt="Os três tipos de neurônio lado a lado: o bipolar, com um dendrito acima e um axônio abaixo; o multipolar, com vários dendritos partindo do corpo celular; e o pseudo-unipolar, com um único prolongamento saindo do corpo. Nos três, uma seta marca a direção do impulso até o terminal axônico." style="width:100%" data-largura="100%"></figure>
<p>Podem ser, segundo sua função, …</p>
<ul><li><p>Sensitivos ou aferentes: captam a mensagem do meio externo e interno;</p></li>
<li><p>Motores ou eferentes: efetuam uma ação;</p></li>
<li><p>Associativos: estabelecem conexões entre outros neurônios;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'prevencao',
  'Prevenção',
  'biologia',
  'comum',
  'Contra IST, contra entorpecentes e contra a automedicação — inclusive por que largar o antibiótico no meio cria bactéria resistente.',
  '<ul><li><p>contra IST''s (infecções sexualmente transmissíveis):</p>
<ul><li><p>Uso de preservativos nas relações sexuais;</p></li>
<li><p>Vacinação contra certas doenças;</p></li>
<li><p>Testagem regular e exames periódicos;</p></li></ul></li>
<li><p>contra entorpecentes:</p>
<ul><li><p>Educação e informação pela família e por políticas públicas (se aplicam também às ISTs);</p></li>
<li><p>Atividades alternativas;</p></li>
<li><p>Desenvolvimentos de habilidades e valores;</p></li></ul></li>
<li><p>contra intoxicação e automedicação: uso racional de medicamentos;</p>
<ul><li><p>Sempre consultar profissionais de saúde (médicos, dentistas, farmacêuticos) antes de usar qualquer medicamento;</p></li>
<li><p>Seguir rigorosamente a prescrição;</p>
<ul><li><p>Não completar o ciclo do tratamento pode fazer as <strong>bactérias sobreviventes desenvolverem resistência ao medicamento</strong>;</p></li></ul></li>
<li><p>Verifique sempre contraindicações e efeitos colaterais;</p></li>
<li><p>Armazene medicamentos em locais seguros (fora do alcance de crianças);</p></li>
<li><p>Descarte de medicamentos vencidos em pontos de coleta;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 2. Gametogênese, heredogramas e os grupos sanguíneos
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'gametogenese',
  'Gametogênese',
  'biologia',
  'comum',
  'Espermatogênese e ovogênese fase a fase — multiplicação, crescimento, maturação e diferenciação.',
  '<p>produção de gametas:</p>
<ul><li><p>Nos testículos (túbulos seminíferos); Masculinos</p></li>
<li><p>Hormônio testosterona;</p></li>
<li><p>Nos ovários; Femininos</p></li>
<li><p>Hormônios estrogênio e progesterona;</p></li></ul>
<h2>Espermatogênese:</h2>
<ul><li><p>Multiplicação (ou Proliferação):</p>
<ul><li><p>O que acontece: as espermatogônias, células germinativas diploides (2n), multiplicam-se por mitoses sucessivas.</p></li>
<li><p>Resultado: Aumento da quantidade de espermatogônias, garantindo um reservatório contínuo de células para as etapas seguintes.</p></li></ul></li>
<li><p>Crescimento:</p>
<ul><li><p>O que acontece: algumas espermatogônias aumentam de volume e duplicam o seu material genético, passando por um período de interfase.</p></li>
<li><p>Resultado: As células passam a ser chamadas de espermatócitos primários (espermatócitos I), mantendo o seu estado diplóide (2n).</p></li></ul></li>
<li><p>Maturação (Meiose):</p>
<ul><li><p>Primeira Divisão Meiótica (Meiose I): Cada espermatócito primário passa por uma divisão reducional, resultando em dois espermatócitos secundários (espermatócitos II), que são haploides (n), mas com os cromossomas duplicados.</p></li>
<li><p>Segunda Divisão Meiótica (Meiose II): Os dois espermatócitos secundários sofrem outra divisão, uma equacional, formando quatro espermátides haploides (n).</p></li></ul></li>
<li><p>Diferenciação:</p>
<ul><li><p>A fase final que transforma as espermátides redondas e indiferenciadas em espermatozóides maduros e funcionais.</p></li></ul></li></ul>
<h2>Ovogênese (ovulogênese):</h2>
<ul><li><p>Multiplicação (ou Proliferação):</p>
<ul><li><p>O que acontece: As células germinativas primordiais nos ovários começam a se dividir por mitose.</p></li>
<li><p>Resultado: Este processo aumenta o número de células, originando as ovogônias, que servem como uma reserva de células para futuras formações de óvulos.</p></li></ul></li>
<li><p>Crescimento:</p>
<ul><li><p>O que acontece: as ovogônias crescem em volume e acumulam substâncias nutritivas (vitelo).</p></li>
<li><p>Resultado: a ovogônia se transforma em um ovócito primário. Este ovócito primário inicia a primeira divisão da meiose, mas o processo é pausado na prófase I.</p></li></ul></li>
<li><p>Maturação:</p>
<ul><li><p>O que acontece: com a chegada da puberdade e os estímulos hormonais, a meiose I é completada.</p></li>
<li><p>Resultado: O ovócito primário se divide em duas células de tamanhos desiguais:</p></li>
<li><p>Ovócito secundário: é a célula maior, rica em citoplasma e substâncias nutritivas, liberada durante a ovulação.</p></li>
<li><p>Primeiro corpúsculo polar: É uma célula muito menor que praticamente não recebe citoplasma e degenerará.</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'heredogramas',
  'Heredogramas',
  'biologia',
  'comum',
  'A legenda dos símbolos e as quatro heranças que se leem numa genealogia — autossômicas e ligadas ao X.',
  '<p>Simbologia:</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/simbologia-dos-heredogramas.webp" alt="Legenda dos símbolos do heredograma: quadrado é homem e círculo é mulher, vazios sem o fenótipo e cheios com o fenótipo; losango é sexo não especificado; a linha horizontal liga o casal, a linha dupla o casal consanguíneo e a linha cortada o casal sem descendentes; símbolo riscado é morto; e os gêmeos idênticos saem de um ponto só, os fraternos de dois." style="width:100%" data-largura="100%"></figure>
<p>Herança:</p>
<ul><li><p>Autossômica recessiva: ocorre em frequência similar em homens e mulheres; pais de indivíduos afetados que não possuem a característica são heterozigotos, e geralmente a característica pula gerações;</p>
<ul><li><p>Ex:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/heredograma-autossomica-recessiva.webp" alt="Genealogia de três gerações em que os afetados aparecem na geração I e na III, mas não em toda a II — a característica pula uma geração, e homens e mulheres são atingidos na mesma proporção." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p>Autossômica dominante: ocorre em frequência similar em homens e mulheres; normalmente, a característica está presente em todas as gerações;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/heredograma-autossomica-dominante.webp" alt="Genealogia de quatro gerações com pelo menos um indivíduo afetado em cada uma delas, homens e mulheres igualmente." style="width:100%" data-largura="100%"></figure></li>
<li><p>Ligada ao X recessiva: mais comum em homens, o pai não transmite a característica para o filho do sexo masculino, e todas as filhas de um homem afetado são portadoras do gene em questão;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/heredograma-ligada-ao-x-recessiva.webp" alt="Genealogia com os genótipos XX e XY anotados sobre cada indivíduo e o X portador marcado em vermelho: o homem afetado da geração I passa o X a todas as filhas, que aparecem afetadas, e nenhum filho homem o recebe dele." style="width:100%" data-largura="100%"></figure></li>
<li><p>Ligada ao X dominante: geralmente, todas as filhas de um homem afetado são afetadas, e o pai não transmite a característica para o filho do sexo masculino;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/heredograma-ligada-ao-x-dominante.webp" alt="Genealogia de três gerações com XX e XY anotados e o X marcado em vermelho, partindo da mulher afetada da geração I e atingindo filhos e filhas." style="width:100%" data-largura="100%"></figure></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'codominancia',
  'Codominância',
  'biologia',
  'comum',
  'O heterozigoto que mostra os dois fenótipos ao mesmo tempo, no gado Shorthorn — com a questão da FGV resolvida.',
  '<p>heterozigoto com a presença simultânea dos dois fenótipos;</p>
<p>Padrão de herança em bovinos:</p>
<p>Questão resolvida:</p>
<aside class="questao"><p>(FGV-SP) O padrão genético da cor da pelagem na raça bovina Shorthorn é um exemplo de codominância cujos dois alelos autossômicos envolvidos na pigmentação do pelo se manifestam no heterozigoto, denominado ruão. Os homozigotos apresentam a cor da pelagem vermelha ou branca.</p>
<p>Um criador dessa raça, ao cruzar um casal de animais cuja pelagem é do tipo ruão, em três gestações subsequentes, obteve, em cada gestação, uma fêmea com pelagem vermelha. A probabilidade de repetição idêntica desses resultados nas próximas três gestações seguidas, a partir dos mesmos animais reprodutores, é de</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/bovino-ruao.webp" alt="Foto de um bovino de pelagem ruã, castanho-avermelhada salpicada de branco, com a legenda “Ruão”." style="width:320px" data-largura="320px"></figure>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/bovino-vermelha.webp" alt="Foto de um bovino de pelagem inteiramente vermelha, com a legenda “Vermelha”." style="width:320px" data-largura="320px"></figure>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/bovino-branca.webp" alt="Foto de um bovino de pelagem inteiramente branca, com a legenda “Branca”." style="width:320px" data-largura="320px"></figure>
<p>a) 1/16.   b) 1/24.   c) 1/128.   d) 1/512.   e) 1/4 096.</p>
<div class="resolucao"><p>Como ambos os alelos são dominantes, pode-se representar a hereditariedade em um quadro de Punnet →</p>
<table><tbody><tr><td><p></p></td><td><p>V</p></td><td><p>B</p></td></tr><tr><td><p>V</p></td><td><p>VV</p></td><td><p>VB</p></td></tr><tr><td><p>B</p></td><td><p>VB</p></td><td><p>BB</p></td></tr></tbody></table>
<p>Assim, a probabilidade de nascer uma vaca vermelha (VV) é de 25%, ou seja, 1/4.</p>
<p>Com isso, a probabilidade de nascer uma fêmea vermelha será: <span data-type="inline-math" data-latex="\frac{1}{4}⋅\frac{1}{2}=\frac{1}{8}"></span></p>
<p>Como são três gestações: <span data-type="inline-math" data-latex="\frac{1}{8}⋅\frac{1}{8}⋅\frac{1}{8}=\frac{1}{512}"></span> d)</p></div></aside>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sistema-abo',
  'Sistema ABO',
  'biologia',
  'comum',
  'Aglutinogênio, aglutinina e genótipo de cada tipo — e quem pode doar para quem.',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/tipos-sanguineos-e-aglutinogenios.webp" alt="As quatro hemácias lado a lado: tipo A com aglutinogênio A e aglutinina anti-B no plasma, tipo B com aglutinogênio B e anti-A, tipo AB com os dois aglutinogênios e sem aglutininas, e tipo O sem aglutinogênio nenhum e com as aglutininas anti-A e anti-B." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Aglutinogênios: polissacarídeos na membrana plasmática; definem o tipo sanguíneo do indivíduo;</p></li>
<li><p>Aglutinina: anticorpos que reconhecem especificamente aglutinogênios diferentes recebidos por transfusão sanguínea.</p></li></ul>
<p>São expressadas e transmitidas aos descendentes por meio de seus respectivos genótipos;</p>
<table><tbody><tr><th><p>Tipo sanguíneo</p></th><th><p>Genótipo</p></th></tr><tr><td><p>A</p></td><td><p>I<sup>A</sup>I<sup>A</sup> ou I<sup>A</sup>i</p></td></tr><tr><td><p>B</p></td><td><p>I<sup>B</sup>I<sup>B</sup> ou I<sup>B</sup>i</p></td></tr><tr><td><p>AB</p></td><td><p>I<sup>A</sup>I<sup>B</sup></p></td></tr><tr><td><p>O</p></td><td><p>ii</p></td></tr></tbody></table>
<h2>Transfusão sanguínea:</h2>
<ul><li><p>Pessoas do <strong>grupo A</strong>:</p>
<ul><li><p>Podem doar para pessoas dos grupos A e AB;</p></li>
<li><p>Podem receber das pessoas dos grupos A e O.</p></li></ul></li>
<li><p>Pessoas do <strong>grupo B</strong>:</p>
<ul><li><p>Podem doar para pessoas dos grupos B e AB;</p></li>
<li><p>Podem receber das pessoas dos grupos B e O.</p></li></ul></li>
<li><p>Pessoas do <strong>grupo AB</strong>:</p>
<ul><li><p>Podem doar para pessoas do grupo AB;</p></li>
<li><p>Podem receber das pessoas dos grupos A, B, AB e O (são consideradas <strong>receptoras universais</strong>).</p></li></ul></li>
<li><p>Pessoas do <strong>grupo O</strong>:</p>
<ul><li><p>Podem doar para pessoas dos grupos A, B, AB e O;</p></li>
<li><p>Podem receber das pessoas do grupo O (são consideradas <strong>doadoras universais</strong>).</p></li></ul></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/quem-doa-para-quem-no-abo.webp" alt="Quatro gotas de sangue grandes — AB, A, B e O — e, embaixo de cada uma, as gotas menores dos tipos que ela pode receber: AB recebe só de AB, A recebe de A e AB, B recebe de B e AB, e O recebe de O, A, B e AB." style="width:100%" data-largura="100%"></figure>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/esquema-de-transfusao-abo.webp" alt="Esquema em losango das doações: O no topo doa para A, para B e para AB; A e B doam para AB na base; e cada tipo doa para o seu igual, marcado pelas setas laterais." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sistema-rh',
  'Sistema Rh',
  'biologia',
  'comum',
  'O fator Rh, a eritroblastose fetal e as três situações em que a mãe Rh− pode sensibilizar-se.',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/sistema-rh-hemacia-genotipo-e-plasma.webp" alt="Tabela de duas colunas comparando os dois fatores: a hemácia com o aglutinogênio Rh, de genótipo RR ou Rr, tem plasma sem anticorpos anti-Rh; a hemácia lisa, de genótipo rr, só apresenta anticorpos anti-Rh depois de exposição prévia." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Eritroblastose fetal (doença hemolítica do recém-nascido): doença de origem imunitária caracterizada pela aglutinação seguida de hemólise das hemácias fetais.</p>
<ul><li><p>Pode ocorrer quando mulheres Rh− já sensibilizadas geram crianças com fenótipo Rh+;</p></li>
<li><p>Ex:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/tres-situacoes-de-eritroblastose.webp" alt="Três genealogias lado a lado, todas com pai Rh+ e mãe rr Rh−: na primeira o pai é RR e todo filho sai Rr Rh+; na segunda o pai é Rr e metade dos filhos sai rr Rh−; na terceira o pai é R_ e o filho representado é Rr Rh+." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p>Transfusão sanguínea:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/transfusao-no-sistema-rh.webp" alt="Esquema com duas setas circulares: Rh+ doa para Rh+ e Rh− doa para Rh−, e uma seta única leva do Rh− ao Rh+, que é o único sentido possível entre os dois." style="width:100%" data-largura="100%"></figure></li></ul>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 3. Populações, gametas e as leis de Mendel
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'dinamica-de-populacoes',
  'Dinâmica de populações',
  'biologia',
  'comum',
  'Os quatro fatores que mexem no tamanho de uma população, e onde o potencial biótico esbarra na resistência do meio.',
  '<p>parte da ecologia que estuda as variações de ocorrência de indivíduos da mesma espécie;</p>
<ul><li><p>Quatro fatores que influenciam:</p>
<ul><li><p>Imigração: número de indivíduos que, vindos de outras áreas, entram na população;</p></li>
<li><p>Emigração: número de indivíduos que saem da população;</p></li>
<li><p>Natalidade: números de indivíduos que nascem por unidade de tempo;</p></li>
<li><p>Mortalidade: número de indivíduos que morrem;</p></li></ul></li>
<li><p>Potencial biótico ou reprodutivo: capacidade inata de uma população aumentar o número de componentes em condições ambientais ótimas;</p></li>
<li><p>Resistência ambiental ou do meio: todos os fatores que impedem uma população de se desenvolver na velocidade máxima;</p></li>
<li><p>Carga biótica máxima: estabilização do potencial biótica com a resistência ambiental;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/curva-de-crescimento-populacional.webp" alt="Gráfico de número de indivíduos por tempo: a curva preta do potencial biótico dispara para cima, a curva vermelha de crescimento real sobe em S e passa a oscilar em torno da linha azul da carga biótica máxima, e a área entre as duas é a resistência do meio." style="width:100%" data-largura="100%"></figure></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sucessao-ecologica',
  'Sucessão ecológica',
  'biologia',
  'comum',
  'Primária e secundária, e o que aumenta da ecese ao clímax.',
  '<p>série de mudanças que ocorrem na comunidade dos ecossistemas até que eles atinjam a estabilidade (clímax);</p>
<ul><li><p>Primária: colonização de uma área jamais ocupada previamente por nenhum outro ser vivo; Ex: colonização de rochas recém-formadas;</p></li>
<li><p>Secundária: colonização de uma área anteriormente já ocupada. Ex: colonização de áreas desmatadas;</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/sucessao-ecologica-primaria.webp" alt="Blocos de terreno em sequência ao longo de uma seta de tempo: superfície rochosa nua, líquens e musgos, gramíneas e ervas na ecese, arbustos e árvores de pequeno porte na sere, e por fim árvores de grande porte com plantas tolerantes à sombra no clímax." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Aumento do(a)…</p>
<ul><li><p>Biodiversidade;</p></li>
<li><p>Números e indivíduos;</p></li>
<li><p>Biomassa;</p></li>
<li><p>Porte dos animais;</p></li>
<li><p>Nichos ecológicos;</p></li>
<li><p>Relações ecológicas;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'gametas-e-fecundacao',
  'Gametas e fecundação',
  'biologia',
  'comum',
  'As partes do espermatozóide e do óvulo, e as quatro etapas da fecundação até a barreira contra a polispermia.',
  '<h2>Gameta masculino (espermatozóide):</h2>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/espermatozoide.webp" alt="Espermatozóide dividido em cabeça, peça intermediária e cauda: na cabeça, o acrossomo em amarelo cobrindo o núcleo em azul; na peça intermediária, o centríolo e a mitocôndria em espiral; e a cauda terminando no flagelo." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Produzidos nos testículos, nas gônadas masculinas;</p></li>
<li><p>Na cabeça, encontram-se:</p>
<ul><li><p>Acrossomo: vesícula derivada do complexo golgiense que ocupa o espaço entre a membrana plasmática e o envoltório nuclear. Abriga enzimas digestivas que contribuem na penetração do espermatozóide no gameta feminino, porque atuam na digestão da zona pelúcida (camada que envolve o óvulo);</p></li>
<li><p>Núcleo: lote haplóide de cromossomos paternos que constituirão a metade dos cromossomos do novo organismo caso aconteça a fecundação;</p></li></ul></li>
<li><p>A <strong>mitocôndria</strong> produz energia para o deslocamento;</p></li>
<li><p>Flagelo: formado por micro filamentos contráteis que promovem os movimentos do gameta;</p></li></ul>
<h2>Gameta feminino (óvulo):</h2>
<ul><li><p>Produzidos nas gônadas femininas, denominadas ovários;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ovocito.webp" alt="Corte do ovócito: o citoplasma ao centro com os cromossomos na metáfase II e uma mitocôndria, o corpúsculo polar encostado na borda, a membrana plasmática envolvida pela zona pelúcida e, por fora, a coroa de células foliculares; um espermatozóide se aproxima pela direita." style="width:100%" data-largura="100%"></figure></li>
<li><p>Coroa radiata: fina e frouxa camada de células foliculares;</p></li>
<li><p>Zona pelúcida: grossa camada gelatinosa de glicoproteínas aderida à membrana plasmática do ovócito; importante para o <strong>reconhecimento celular</strong>;</p></li>
<li><p>Corpúsculo polar: célula haplóide pequena que se forma durante a ovogênese (a produção de óvulos) e geralmente não se desenvolve;</p></li></ul>
<h2 data-corrido="sim">Fecundação:</h2>
<p>processo em que ocorre a união (fusão) de um par de gametas — conjuntos haplóides de cromossomos de dois organismos — com a formação de uma única célula diplóide, denominada zigoto ou célula-ovo;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/etapas-da-fecundacao.webp" alt="Corte da superfície do ovócito com quatro espermatozóides numerados de A a D em momentos diferentes: A atravessando as células foliculares, B preso à zona pelúcida pelos receptores ZP3, C com as membranas já fundidas, e D entrando enquanto os grânulos corticais são liberados por exocitose." style="width:100%" data-largura="100%"></figure>
<ul><li><p><strong>A.</strong> Espermatozoide passa pelas células foliculares e chega à zona pelúcida, na qual se prende aos receptores ZP3 (glicoproteínas);</p></li>
<li><p><strong>B.</strong> Liberação de enzimas do acrossomo (reação acrossomal) e digestão da zona pelúcida;</p></li>
<li><p><strong>C.</strong> Fusão das membranas do espermatozóide e do ovócito após reconhecimento celular;</p></li>
<li><p><strong>D.</strong> Entrada do espermatozoide no ovócito e exocitose dos grânulos corticais, evitando polispermia (entrada de mais espermatozoides);</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  '2a-lei-de-mendel',
  '2ª lei de Mendel',
  'biologia',
  'comum',
  'A segregação independente e a proporção 9:3:3:1, com a questão da UEA resolvida.',
  '<p>lei da recombinação ou da segregação independente;</p>
<ul><li><p>Defende que <strong>aspectos/características são herdadas de formas diferentes</strong>;</p></li>
<li><p>Os pares de fatores para duas ou mais características segregam-se de forma independente na formação dos gametas;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/segregacao-independente-em-vvrr.webp" alt="Célula de um indivíduo VVrr acompanhada da metáfase I à metáfase II: os pares se alinham de dois modos possíveis e o resultado são quatro células, todas Vr, mostrando que os dois pares se separam sem depender um do outro." style="width:100%" data-largura="100%"></figure></li>
<li><p>Cruzamento entre duplo-heterozigotos resulta na <strong>proporção fenotípica 9:3:3:1</strong>;</p>
<ul><li><p>Ex: ervilhas amarela (V) ou verdes (v) e lisa (R) ou rugosa:</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/quadro-de-punnett-das-ervilhas.webp" alt="Quadro de Punnett de quatro por quatro com os gametas VR, Vr, vR e vr nas bordas e as dezesseis ervilhas resultantes desenhadas nas células — amarelas lisas, amarelas rugosas, verdes lisas e verdes rugosas, cada uma com o genótipo escrito embaixo." style="width:100%" data-largura="100%"></figure></li></ul></li></ul>
<p>Questão resolvida:</p>
<aside class="questao"><p>(UEA/SIS-AM 2023) Uma espécie de planta pode produzir flores vermelhas ou brancas e folhas largas ou estreitas. Essas características são determinadas por diferentes genes que se segregam independentemente. O quadro ilustra a relação entre os genes e os respectivos fenótipos.</p>
<table><tbody><tr><th><p>Genes</p></th><th><p>Fenótipos</p></th></tr><tr><td><p><em>B</em></p></td><td><p>Flores vermelhas</p></td></tr><tr><td><p><em>b</em></p></td><td><p>Flores brancas</p></td></tr><tr><td><p><em>E</em></p></td><td><p>Folhas largas</p></td></tr><tr><td><p><em>e</em></p></td><td><p>Folhas estreitas</p></td></tr></tbody></table>
<p>Uma planta 1 que produz flores vermelhas e folhas largas foi cruzada com uma planta 2 que produz flores brancas e folhas estreitas. Desse cruzamento, nasceram plantas com ambas as características recessivas. Desse modo, afirma-se que a planta 1 apresenta o genótipo</p>
<p>a) bbEe.	b) BBee.	c) BbEE.	d) BBEE.	e) BbEe</p>
<div class="resolucao"><p>Para haver características recessivas entre os descendentes, é necessário que a planta 1 seja heterozigota, pois a planta dois é homozigótica. Ou seja, e) BbEe.</p></div></aside>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'interacao-genica',
  'Interação gênica',
  'biologia',
  'comum',
  'Quando um gene inibe o outro: epistasia dominante nas abóboras (12:3:1) e recessiva nas cebolas (9:3:4).',
  '<p>determinada pela ação conjunta de dois ou mais genes;</p>
<ul><li><p>Simples: sem epistasia;</p>
<ul><li><p>Manutenção da proporção fenotípica 9:3:3:1;</p></li>
<li><p>Ex: herança de cristas de galinha;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/cristas-de-galinha.webp" alt="Os quatro tipos de crista com o genótipo de cada um: crista ervilha rrEe ou rrEE, crista rosa Rree ou RRee, crista noz RrEe, RrEE, RREe ou RREE, e crista simples rree." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/cruzamento-das-cristas-9-3-3-1.webp" alt="Cruzamento em três linhas: na geração P, crista noz com crista simples; em F1, duas cristas noz; e em F2, crista noz, rosa, ervilha e simples na proporção 9 : 3 : 3 : 1." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p>Epistática: quando um gene inibe a ação do outro;</p>
<ul><li><p>Dominante: alelo dominante tem ação inibidora;</p>
<ul><li><p>Ex: cor de abóboras;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/epistasia-dominante-nas-aboboras.webp" alt="Cruzamento de duas abóboras brancas YyRr: a descendência sai branca em Y_R_ (9) e yyR_ (3), alaranjada em Y_rr (3) e verde em yyrr (1)." style="width:100%" data-largura="100%"></figure>
<ul><li><p><em>Y</em>: cor amarela;</p></li>
<li><p><em>y</em>: cor verde;</p></li>
<li><p><em>R</em>: inibe a cor (cor branca);</p></li>
<li><p><em>r</em>: permite a cor;</p></li></ul></li>
<li><p>Ao ser anulado um gene, a <strong>proporção fenotípica fica 12:3:1</strong>;</p></li></ul></li>
<li><p>Recessiva: alelo recessivo tem ação inibidora;</p>
<ul><li><p>Ex: cor de bulbo de cebolas</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/epistasia-recessiva-nas-cebolas.webp" alt="Cruzamento de duas cebolas vermelhas BbCc: a descendência sai vermelha em B_C_ (9), alaranjada em C_bb (3) e branca em __cc (4)." style="width:100%" data-largura="100%"></figure>
<ul><li><p><em>B</em>: cor vermelha;</p></li>
<li><p><em>b</em>: cor laranja;</p></li>
<li><p><em>C</em>: permite a cor;</p></li>
<li><p><em>c</em>: inibe a cor (cor branca);</p></li></ul></li>
<li><p>Ao ser anulado um gene, a <strong>proporção fenotípica fica 9:3:4</strong>;</p></li></ul></li></ul></li></ul>
<p>Questão resolvida:</p>
<aside class="questao"><p>(Uerj) Admita uma raça de cães cujo padrão de coloração da pelagem depende de dois tipos de genes. A presença do alelo <em>e</em>, recessivo, em dose dupla, impede que ocorra a deposição de pigmento por outro gene, resultando na cor dourada. No entanto, basta um único gene <em>E</em>, dominante, para que o animal não tenha a cor dourada e exiba pelagem chocolate ou preta. Caso o animal apresente um alelo <em>E</em> dominante e, pelo menos, um alelo <em>B</em> dominante, sua pelagem será preta; caso o alelo <em>E</em> dominante ocorra associado ao gene <em>b</em> duplo recessivo, sua coloração será chocolate. Observe o esquema.</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/pelagem-dos-caes.webp" alt="Esquema em chaves: de ee saem dois cães de pelagem dourada, tanto com bb quanto com BB ou Bb; de EE ou Ee sai um cão chocolate quando bb e um cão preto quando BB ou Bb." style="width:100%" data-largura="100%"></figure>
<p>Identifique o tipo de herança encontrada no padrão de pelagem desses animais, justificando sua resposta. Em seguida, indique o genótipo de um casal de cães com pelagem chocolate que já gerou um filhote dourado. Calcule, ainda, a probabilidade de que esse casal tenha um filhote de pelagem chocolate.</p>
<div class="resolucao"><p>Como há um gene recessivo que inibe a ação de outro quando é expresso, o tipo de herança é epistática recessiva.</p>
<p>Para um casal gerar um filho homozigótico do gene <em>b</em> (pelagem dourada), os dois precisam ter também o gene, ou seja, os dois são <em>Eebb</em>. A probabilidade de o casal gerar um filhote chocolate seria:</p>
<p><span data-type="inline-math" data-latex="\frac{3}{4}(gene E)⋅1 (gene b)=\frac{3}{4} ou 75\%"></span></p></div></aside>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- 4. Embriologia, herança do sexo e o que fecha o documento
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'tipos-de-ovos',
  'Tipos de ovos',
  'biologia',
  'comum',
  'Quanto vitelo e onde: dos alécitos dos placentários aos megalécitos das aves.',
  '<ul><li><p>Alécitos: praticamente desprovido de vitelo;</p>
<ul><li><p>Presente em mamíferos placentários;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ovo-alecito.webp" alt="Círculo amarelo-claro quase sem grânulos, com o núcleo pequeno encostado no centro e o citoplasma ocupando o resto." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p>Oligolécitos (isolécitos/homolécitos): pequena quantidade de vitelo distribuída pelo citoplasma;</p>
<ul><li><p>Encontrados em poríferos, cnidários, helmintos, anelídeos, equinodermas e protocordados;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ovo-oligolecito.webp" alt="Círculo com grânulos de vitelo pequenos e espalhados por igual pelo citoplasma, e o núcleo no meio." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p>Centrolécitos: média quantidade de vitelo distribuída na região central da célula;</p>
<ul><li><p>Encontrados na maioria dos artrópodes;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ovo-centrolecito.webp" alt="Círculo em que os grânulos de vitelo se concentram num anel em volta do núcleo, no centro, deixando a borda do citoplasma limpa." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p>Mesolécitos (heterolécitos): média quantidade de vitelo distribuída de forma heterogênea no citoplasma;</p>
<ul><li><p>Polo animal: tem o núcleo e a menor quantidade de vitelo; divisões celulares mais rápidas</p></li>
<li><p>Polo vegetativo (vegetal): tem mais vitelo;</p></li>
<li><p>Encontrado em alguns peixes e nos anfíbios;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ovo-mesolecito.webp" alt="Círculo com o núcleo na metade de cima, o polo animal, onde os grânulos de vitelo são poucos e miúdos; na metade de baixo, o polo vegetal, eles são maiores e mais numerosos." style="width:100%" data-largura="100%"></figure></li></ul></li>
<li><p>Megalécitos (telolécitos): têm grande quantidade de vitelo, que ocupa quase toda a célula;</p>
<ul><li><p>Polo animal (disco germinativo): tem restritamente o núcleo e o citoplasma;</p></li>
<li><p>Polo vegetativo (vegetal): tem o vitelo; não ocorrem divisões celulares;</p></li>
<li><p>São encontrados em répteis, aves, diversos peixes, mamíferos ovíparos (ornitorrinco e equidna) e moluscos cefalópodes (polvos e lulas);</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/ovo-megalecito.webp" alt="Esfera quase toda tomada por uma massa alaranjada de vitelo, o polo vegetal, com uma calota fina de citoplasma e o núcleo no alto, que é o polo animal." style="width:100%" data-largura="100%"></figure></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'tipos-de-segmentacao',
  'Tipos de segmentação',
  'biologia',
  'comum',
  'Holoblástica e meroblástica, e o tipo de ovo que cada uma exige.',
  '<ul><li><p>Holoblástica: divisões no ovo inteiro;</p>
<ul><li><p>Igual: produz blastômeros de mesmo tamanho;</p>
<ul><li><p></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/segmentacao-holoblastica-igual.webp" alt="Sequência de quatro etapas: o ovo com o núcleo ao centro se divide em dois blastômeros iguais, depois em quatro e por fim em oito, todos do mesmo tamanho." style="width:100%" data-largura="100%"></figure></li>
<li><p>Ocorre em ovos oligolécitos;</p></li></ul></li>
<li><p>Desigual: produz blastômeros de diferentes tamanhos;</p>
<ul><li><p></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/segmentacao-holoblastica-desigual.webp" alt="Sequência em que o sulco de clivagem corta o ovo inteiro, mas o polo com vitelo se divide mais devagar: o resultado são micrômeros pequenos em cima e macrômeros grandes embaixo." style="width:100%" data-largura="100%"></figure></li>
<li><p>Ocorre em ovos mesolécitos;</p></li></ul></li></ul></li>
<li><p>Meroblástica: divisões em apenas uma região do ovo;</p>
<ul><li><p>Discoidal: formação de novas células ocorre apenas na região do disco germinativo;</p>
<ul><li><p></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/segmentacao-meroblastica-discoidal.webp" alt="Sequência em que só a calota azul do disco germinativo se divide, uma, duas, três vezes e depois muitas, enquanto a massa de vitelo embaixo permanece inteira." style="width:100%" data-largura="100%"></figure></li>
<li><p>Ocorre em ovos megalécitos;</p></li></ul></li>
<li><p>Superficial: apenas os núcleos se dividem inicialmente, sem que ocorra a formação de células individualizadas;</p>
<ul><li><p></p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/segmentacao-meroblastica-superficial.webp" alt="Sequência num ovo alongado: o núcleo único se multiplica em vários núcleos soltos no vitelo, que só depois migram para a periferia e formam as células na superfície." style="width:100%" data-largura="100%"></figure></li>
<li><p>Ocorre em ovos centrolécitos;</p></li></ul></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'desenvolvimento-embrionario',
  'Desenvolvimento embrionário',
  'biologia',
  'comum',
  'Do zigoto ao órgão em quatro etapas: segmentação, gastrulação, neurulação e organogênese.',
  '<p>processo de formação de um novo ser a partir do zigoto (união do óvulo e espermatozóide);</p>
<h2 data-corrido="sim">1. Segmentação:</h2>
<p>desde a 1° divisão do zigoto até a formação da blástula;</p>
<ul><li><p>A células embrionárias, denominadas blastômeros, dividem-se rapidamente, mas sem crescer, formando-se assim a <strong>mórula</strong>;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/do-zigoto-a-morula.webp" alt="Quatro estágios em fila: o zigoto com um núcleo, depois quatro células, depois oito, e por fim a mórula, um aglomerado maciço de dezenas de células do mesmo tamanho do zigoto." style="width:100%" data-largura="100%"></figure></li>
<li><p>Na mórula, acumula-se líquido no interior em uma cavidade, formando-se a <strong>blastocele</strong> e deixando as células na superfície em uma estrutura chamada <strong>blástula</strong>;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/blastula-em-corte.webp" alt="A mórula cortada ao meio revelando a blástula: uma esfera oca com a blastocele no centro e a blastoderme de uma camada de células ao redor, micrômeros de um lado e macrômeros do outro." style="width:100%" data-largura="100%"></figure></li></ul>
<h2 data-corrido="sim">2. Gastrulação:</h2>
<p>multiplicação das células embrionárias até formar a gástrula (“esboço” do tubo digestório e diferenciação dos folhetos germinativos);</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/gastrulacao.webp" alt="Três cortes em sequência: a blástula com a blastocele, depois a invaginação de um lado empurrando a parede para dentro, e por fim a gástrula com o arquêntero forrado de endoderme, a ectoderme por fora e o blastóporo como abertura." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Folhetos germinativos/embrionários: ectoderme, mesoderme e endoderme;</p></li>
<li><p>Arquêntero: intestino primitivo;</p>
<ul><li><p>Blastóporo: abertura do arquêntero para o meio externo;</p></li></ul></li></ul>
<h2 data-corrido="sim">3. Neurulação:</h2>
<p>formação do sistema nervoso central;</p>
<ul><li><p>Neste estágio, o embrião é chamado de nêurula;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/neurulacao.webp" alt="Seis cortes transversais do embrião: a placa neural na ectoderme se dobra, forma a dobra neural, fecha-se em tubo neural e mergulha; embaixo dele a mesoderme separa a notocorda e abre o celoma, com o intestino forrado de endoderme na base." style="width:100%" data-largura="100%"></figure></li>
<li><p>Tubo neural: tubo de células ao longo do dorso originada do dobramento da placa neural para dentro do corpo do embrião;</p></li>
<li><p>Notocorda: bastão sólido de células que se isola da mesoderme e se instala paralelamente ao tubo neural;</p>
<ul><li><p>Exclusiva dos cordados;</p></li>
<li><p>Desaparecem na fase adulta da maioria das espécies;</p></li></ul></li>
<li><p>Celoma: cavidade prenchida por fluido na parte interior da mesoderme;</p>
<ul><li><p>Funciona como esqueleto hirostático</p></li>
<li><p>Aloja orgãos internos;</p></li></ul></li></ul>
<h2 data-corrido="sim">4. Organogênese:</h2>
<p>folhetos germinativos (tecidos embrionários) se diferenciam em tecidos e órgãos;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/derivados-dos-folhetos-germinativos.webp" alt="O que cada folheto origina. Ectoderme: sistema nervoso, formado a partir do tubo neural; epiderme e seus anexos (pelos, unhas, garras, certas glândulas); epitélio de revestimento anal, bucal e nasal; esmalte dentário. Mesoderme: derme; coração, vasos sanguíneos e sangue; músculos, ossos e cartilagens; rins, ureteres e gônadas. Endoderme: fígado e pâncreas; tireoide e paratireoides; revestimentos da bexiga urinária, do sistema respiratório e do tubo digestório, exceto os revestimentos anal, bucal e nasal, que são de origem ectodérmica." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'anexos-embrionarios',
  'Anexos embrionários',
  'biologia',
  'comum',
  'Placenta, cório, alantóide, saco vitelínico e âmnio — e o que muda entre o ovo do réptil e o útero do placentário.',
  '<p>estruturas formadas a partir dos folhetos germinativos que não fazem parte do corpo, mas ali estão para auxiliá-lo;</p>
<ul><li><p>Placenta: faz a comunicação fisiológica entre mãe e feto;</p>
<ul><li><p>É responsável pela produção de hormônios, realização de trocas gasosas, nutrição, eliminação dos resíduos nitrogenados e defesa imunológica do embrião;</p></li>
<li><p>Bem dissolvida apenas nos mamíferos placentários;</p></li>
<li><p>Formada por tecidos da parede do útero (tecidos maternos — endométrio) e pelas vilosidades coriônicas (tecidos fetais — cório);</p></li></ul></li>
<li><p>Cório: membrana bem vascularizada que envolve completamente os outros anexos;</p>
<ul><li><p>Formado pela ectoderme e mesoderme;</p></li>
<li><p>Nos vertebrados ovíparos, se une ao alantóide formando o alantocório, que fica sob a casca dos ovos e se espalha por todo o espaço disponível;</p></li>
<li><p>Nos mamíferos placentários, o cório é responsável pela formação das vilosidades coriônicas da placenta;</p></li>
<li><p>Produz o hormônio gonadotrofina coriônica, que informa a presença do bebê no corpo da mãe;</p></li></ul></li>
<li><p>Alantóide: pequena bolsa que absorve oxigênio e elimina gás carbônico;</p>
<ul><li><p>Surge de uma envaginação da parte posterior do intestino do embrião;</p></li>
<li><p>Em répteis e aves, além das trocas gasosas, armazena ácido úrico (produto da excreção) e absorve cálcio da casca do ovo, utilizando-o na formação do esqueleto (facilitando rompimento da casca por ocasião do nascimento);</p></li></ul></li>
<li><p>Saco vitelínico: armazena muito vitelo e tem as paredes repletas de vasos sanguíneos, o que possibilita contínua nutrição do embrião;</p>
<ul><li><p>Formado do crescimento da endoderme e da mesoderme sobre a massa de vitelo;</p></li>
<li><p>Nos mamíferos placentários é reduzida, visto que a nutrição ocorre via placentária. Nesses, é responsável pela produção das hemácias;</p></li></ul></li>
<li><p>Âmnio: bolsa membranosa, cheia de líquido amniótico, onde o embrião está mergulhado;</p>
<ul><li><p>Formada pelo crescimento da ectoderme e da mesoderme ao redor do corpo do embrião;</p></li>
<li><p>Serve para evitar o ressecamento, proteção contra infecções e possíveis traumatismos que possam atingir o ventre materno (choques mecânicos);</p></li>
<li><p>Representa uma importante adaptação dos répteis, pois lhes permitiu avançar em terras secas, e independência da água para a reprodução;</p></li></ul></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/anexos-embrionarios.webp" alt="Corte do embrião no útero: o cório envolve tudo por fora, o âmnio delimita a cavidade amniótica onde o embrião flutua, o alantoide e o saco vitelínico descem pelo cordão umbilical, e as vilosidades coriônicas se encaixam na parede do útero formando a placenta." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'heranca-do-sexo',
  'Herança do sexo',
  'biologia',
  'comum',
  'Ligada ao X, influenciada pelo sexo ou materna — e a doença que serve de exemplo de cada uma.',
  '<ul><li><p>Herança ligada ao cromossomo X recessiva:</p>
<ul><li><p>Genes recessivos no X que afetam principalmente homens.</p></li>
<li><p>Exemplos: Daltonismo, Hemofilia, Distrofia Muscular de Duchenne, Adrenoleucodistrofia.</p></li></ul></li>
<li><p>Herança ligada ao cromossomo X dominante:</p>
<ul><li><p>Genes dominantes no X que afetam ambos os sexos.</p></li>
<li><p>Exemplos: Síndrome da Feminização Testicular (Insensibilidade a Andrógenos), Raquitismo Hipofosfatêmico.</p></li></ul></li>
<li><p>Herança autossômica influenciada pelo sexo:</p>
<ul><li><p>Gene autossômico com expressão diferente entre sexos.</p></li>
<li><p>Exemplos: Calvície precoce, Gota.</p></li></ul></li>
<li><p>Herança materna (extranuclear):</p>
<ul><li><p>Transmissão mitocondrial apenas pela mãe.</p></li>
<li><p>Exemplos: Neuropatia Óptica de Leber, Síndrome MELAS;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'bacterias',
  'Bacterias',
  'biologia',
  'comum',
  'Procarionte com peptidoglicano e plasmídeo, classificada pela forma: cocos, bacilos, vibriões e espiroquetas.',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/estrutura-da-bacteria.webp" alt="Corte de uma bactéria em forma de bastão: por fora, cápsula, parede celular e membrana plasmática, com fímbrias na superfície e um flagelo numa das pontas; dentro, o DNA enovelado, o plasmídeo em anel, ribossomos, grânulo de alimento e citosol." style="width:100%" data-largura="100%"></figure>
<ul><li><p>Procariontes;</p></li>
<li><p>Possuem ribossomos;</p></li>
<li><p>Peptidoglicano: componente da parede celular;</p></li>
<li><p>Formam colonias;</p></li>
<li><p>Classificados pela morfologia:</p>
<ul><li><p>Cocos; bolinahs</p></li>
<li><p>Bacillus; bastões</p></li>
<li><p>Vibrias; espiroque</p></li>
<li><p>Espiroquetas;</p></li></ul></li>
<li><p>Decompositores;</p></li>
<li><p>Patógenos;</p></li>
<li><p>Auto e heterótrofos;</p></li>
<li><p>Plasmídeo;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'metabolismo-energetico',
  'Metabolismo energético',
  'biologia',
  'comum',
  'A produção de ATP e os três componentes cuja quebra a sustenta.',
  '<p>produção de ATP (adenosina tri-fosfato);</p>
<ul><li><p>Quebra de componentes:</p>
<ul><li><p>Carboidratos;</p></li>
<li><p>Proteínas;</p></li>
<li><p>Lipideos;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

-- O trigger `trg_sync_conexoes_resumo` roda no insert e resolve cada
-- `[[wikilink]]` procurando o resumo de destino pelo título. Estes vinte não
-- trazem wikilink nenhum, mas o update vazio é o fecho padrão das migrations de
-- importação (decisão 9c) e custa nada.
update resumos set corpo = corpo where materia_slug = 'biologia';

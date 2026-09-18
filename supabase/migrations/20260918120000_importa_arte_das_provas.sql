-- Traz a Arte das provas da escola: quatro resumos, nenhuma figura.
--
-- `processo_slug = 'comum'`, o destino combinado para material de prova de
-- escola em 2026-08-23 (decisão 1c). Terceira leva vinda das 59 provas, depois
-- da Sociologia (`20260825023940`) e da História (`20260825072703`).
--
-- **A Arte tinha ZERO resumos** — era, com a Redação, uma das duas matérias
-- vazias do site — contra 57 tópicos de edital. Passa a ter quatro.
--
-- ## O marcador do autor derrubou três dos oito candidatos
--
-- O inventário de 2026-08-24 listava oito tópicos como Arte. Lidos os
-- documentos, o cabeçalho de matéria escrito pelo próprio autor — a régua que a
-- leva da História estabeleceu — desmente três deles, e os três são erro de
-- casamento por palavra solta, não erro de leitura de conteúdo:
--
-- - `Vanguardas europeias (1905-1945)` está sob `# LITERATURA` no PR2G1 do 3º
--   bimestre do 2º ano. São 3.284 caracteres, o maior texto que o inventário
--   atribuía a Arte, e tratam Fauvismo, Cubismo e Surrealismo como movimentos
--   LITERÁRIOS: manifesto, verso livre, caligrama, Apollinaire e Breton;
-- - `Cultura popular` está sob `SOCIOLOGIA` no PR1G4 do 3º bimestre, no meio da
--   série que vai de Tylor à cultura imaterial. Além de não ser Arte, já está
--   publicado: a leva de Sociologia de 24/08 trouxe o resumo `Cultura`;
-- - `Período` está sob `LÍNGUA PORTUGUESA` no PR1G1 do 1º bimestre do 2º ano, e
--   é análise sintática: frase, oração, período simples e composto. O casamento
--   automático o levou para Arte porque o edital do PAS UEM diz "Música
--   ocidental do período clássico" — a palavra bateu, o assunto não.
--
-- ## E um quinto é Arte, mas não vira resumo
--
-- `Música Popular brasileira`, sob `# ARTE` no PR2G4 do 2º bimestre do 2º ano,
-- tem uma frase inteira: "Parte da cultura popular (manifestações criadas e
-- transmitidas organicamente pelo povo — folclore, música, dança, festas.
-- Transmitida oralmente entre gerações)". Ao lado dela, `Cinema Nacional:` é
-- título sem nenhum texto. Mesmo critério que barrou `Guerra fria` e
-- `Primeiro reinado` na leva da História: publicar título sem corpo não ajuda, e
-- escrever o texto é o que a decisão 9c proíbe.
--
-- **Este é o aviso ao autor**, e ele pesa mais que os da leva anterior: a MPB é
-- tópico de edital do PAS UEM na 1ª etapa ("Gêneros musicais: samba, bossa nova,
-- rock") e na 2ª ("Gêneros musicais: Música Popular Brasileira e Música
-- sertaneja"), e a Música é uma das quatro áreas em que o edital divide a
-- matéria. Das quatro, só Artes Visuais entra aqui. Música, Artes Cênicas e
-- Dança seguem sem uma linha escrita.
--
-- ## Sem hierarquia, por decisão de 2026-09-18
--
-- Os quatro são todos de Artes Visuais e caberiam numa árvore de duas camadas,
-- no molde da Física (Artes Visuais > Arte Medieval > bizantina e gótica). O
-- autor preferiu publicá-los soltos, como estão hoje Química, Geografia e
-- Biologia. O custo está registrado e é conhecido: no mapa de conexões a Arte
-- entra como mais uma estrela de folhas sem pai, que é o diagnóstico da síntese
-- `Organização da Biologia no site`.
--
-- ## O que o edital ganha, e o que ele não ganha
--
-- Dois tópicos são casados aqui, e são casamentos exatos:
-- `Neoclassicismo na Europa e no Brasil.` (2ª etapa) e
-- `Arte Greco-Romana: arquitetura, pintura e escultura.` (3ª etapa).
--
-- O terceiro, `Arte Medieval: Romântica, Bizantina e Gótica.` (3ª etapa), fica
-- SEM casar de propósito. Ele pede três estilos e temos dois; apontá-lo para a
-- bizantina ou para a gótica marcaria como coberto um tópico que está coberto
-- pela metade. É exatamente o defeito que a síntese da Biologia nomeou — o
-- `/edital` contando a cobertura para baixo — e não vale repeti-lo aqui.
--
-- Os 57 tópicos de Arte vêm todos do PAS UEM. Nem o PASSE nem o PAS UnB têm uma
-- linha de Arte em `edital_topicos`.
--
-- ## Fidelidade do texto
--
-- Os quatro textos são do autor, palavra por palavra, com a estrutura de lista
-- que ele escreveu. Nenhum tem figura ou fórmula — a Arte é a única matéria do
-- inventário com zero figuras, então não se aplica aqui o cuidado da decisão 9c
-- com o `.docx`.
--
-- Uma ressalva de forma: `Arte bizantina` foi lida por um caminho que devolve o
-- texto sem marcação, então os negritos que o autor porventura tenha nos rótulos
-- (`Contexto:`, `Características:`) não foram reproduzidos. O texto está
-- completo; o que falta é ênfase, e ela se corrige pelo editor.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'arte-grega',
  'Arte grega',
  'arte',
  'comum',
  'Simetria, proporção e o nu, nos quatro períodos que vão do geométrico ao helenístico — e a razão de conhecermos as esculturas gregas por cópias romanas.',
  '<ul><li><p>Simetria, proporção e equilíbrio;</p></li>
<li><p>Antropomórficos (seres sobrenaturais com aparência humana);</p></li>
<li><p>Desenvolvimento de técnicas;</p></li>
<li><p>Valorização do nu;</p></li>
<li><p><strong>Períodos:</strong></p>
<ul><li><p><strong>Geométrico</strong>: humanas estilizadas; representação do funeral em vasos (crateras) como registro do cotidiano e reputação social do defunto; grafismo (maneira negra ou figura vermelha);</p></li>
<li><p><strong>Arcaico</strong>: políticas de incentivo à arte e à cultura (patrocínio); sorriso arcaico; templos: casas terrestres, e tesouro para os deuses; ordens gregas: dórica, jônica e coríntia;</p></li>
<li><p><strong>Clássico</strong>: auge da arte grega, marcada pela busca do equilíbrio, proporção e beleza idealizada; período de construção de grandes templos como o Partenon.</p></li>
<li><p><strong>Helenístico</strong>: emoção, movimento exagerado, realismo dramático.</p></li></ul></li>
<li><p><strong>Arte grega e romana</strong>: os romanos se inspiraram profundamente na Grécia. Os artistas romanos procuraram fazer cópias fidedignas das obras gregas; grande parte das esculturas gregas são conhecidas hoje pelas cópias romanas.</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'arte-bizantina',
  'Arte bizantina',
  'arte',
  'comum',
  'A arte a serviço da catequese e do imperador: mosaico narrativo, ícone frontal — e a Questão Iconoclasta, que destruiu boa parte do que ela produziu.',
  '<p>Contexto:</p>
<ul><li><p>Ocorreu no Império romano do Oriente (Império Bizantino);</p></li>
<li><p>Recebeu influência de diferentes regiões, devido à localização geográfica de Constantinopla. Essa tendência agregou elementos culturais de Roma, da Grécia e do Oriente.</p></li>
<li><p>Tem suas raízes na arte paleocristã:</p>
<ul><li><p>Técnica helenística;</p></li>
<li><p>Arte em catacumbas que prezam pela narrativa;</p></li>
<li><p>Não valoriza a beleza terrena;</p></li>
<li><p>Objetivo de fazer reconhecer os símbolos e as passagens cristãs, ao invés de inferir dramaticidade nas cenas, como a arte grega fazia.</p></li></ul></li>
<li><p>O cristianismo foi assimilado por Roma como religião oficial no final do século IV por Constantino;</p></li></ul>
<p>Características:</p>
<ul><li><p>Objetivo de catequização (“a Bíblia dos que não sabem ler”);</p></li>
<li><p>Representação de personalidades oficiais como personagens sagrados;</p></li>
<li><p>Presença marcante do uso de cores;</p></li>
<li><p>Retrato do Imperador (figura de referência sagrada, pois governava em nome de Deus);</p></li>
<li><p>Uso da pintura e mosaico com caráter narrativo.</p></li>
<li><p>Arquitetura:</p>
<ul><li><p>Elementos do estilo greco-romano;</p></li>
<li><p>Cúpula central;</p></li>
<li><p>Semi Cúpula;</p></li>
<li><p>Nave longitudinal;</p></li>
<li><p>Abside: extremidade em semicírculo;</p></li>
<li><p>Nártex: zona de entrada de um templo.</p></li>
<li><p>Arquitetura de caráter majestoso, transmitindo poder, proteção e espiritualidade.</p></li>
<li><p>Mistura de função religiosa e representação do poder imperial.</p></li></ul></li>
<li><p>Ícone: uma imagem de Cristo, a Virgem, ou um santo.</p>
<ul><li><p>Mais religiosos do que estéticos por natureza;</p></li>
<li><p>Manifestaram a presença única da figura representada por meio de uma semelhança com aquela figura;</p></li>
<li><p>Frontalidade (atemporal, estático, rígido e sem movimento);</p></li>
<li><p>Questão Iconoclasta: um movimento que questionava a adoração de imagens religiosas no Império Bizantino. Levou a destruição de muitos ícones entre os séculos VIII e IX;</p></li>
<li><p>Dípticos: códice feito de duas placas enceradas, sobre as quais se escrevia com um estilete. Função devocional;</p></li>
<li><p>Trípticos: o painel central é maior, com os laterais menores que podem ser fechados sobre o central. Função devocional.</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'arte-gotica',
  'Arte gótica',
  'arte',
  'comum',
  'A catedral que fica leve e sobe: arcobotante, ogiva e vitral — mais a estética macabra que a Peste Negra trouxe junto.',
  '<ul><li><p><strong>Contexto</strong>:</p>
<ul><li><p>A Igreja mantinha-se atuante na sociedade;</p></li>
<li><p>Surgimento da burguesia;</p></li>
<li><p>Guildas medievais: corporação de artesãos que transmitem o conhecimento aos filhos e aprendizes.</p></li></ul></li>
<li><p><strong>Arquitetura</strong>:</p>
<ul><li><p>Fins religiosos;</p></li>
<li><p>Estruturas mais leves, com vãos mais amplos;</p></li>
<li><p>Vitrais, rosáceas: filtros de luz com cenas bíblicas.</p></li></ul></li>
<li><p>Flor-de-lis: símbolo de pureza e realeza divina.</p></li>
<li><p>Gárgulas: funcionam como calhas para a água da chuva e também decoram as igrejas, protegendo a estrutura;</p></li>
<li><p>Quimeras: criaturas fantásticas que decoram as construções afastando maus espíritos e simbolizando poder;</p></li>
<li><p>Arcobotante e arcos ogivais;</p></li>
<li><p>Abóbada de cruzaria;</p></li>
<li><p>Verticalismo: direciona o olhar para o céu (espiritualidade).</p></li>
<li><p><strong>Escultura</strong>:</p>
<ul><li><p>Colunar: integrada às colunas das catedrais.</p></li>
<li><p>Jacente/arca tumular;</p></li>
<li><p>De devoção, vulto redondo;</p></li>
<li><p>Relevo escultórico;</p></li></ul></li>
<li><p><strong>Iluminuras</strong>:</p>
<ul><li><p>Pinturas minuciosas em manuscritos religiosos, usadas para ilustrar textos sagrados e transmitir ensinamentos visuais à população.</p></li>
<li><p>Letras capitular, miniatura, marginália;</p></li>
<li><p>Função de embelezar o texto, humor ou representação do texto escrito.</p></li></ul></li>
<li><p><strong>Estética macabra</strong>: surgiu com o impacto de crises como a <strong>Peste Negra</strong> e guerras.</p>
<ul><li><p>Expressa a efemeridade da vida, o medo da morte e o juízo final.</p></li>
<li><p>Exemplo: “O Triunfo da Morte” – Giacomo Borlone de Buschis (séc. XV, Clusone, Itália);</p></li>
<li><p>Cena: três nobres vivos encontram três cadáveres;</p></li>
<li><p>Mensagem: todos morrem, independentemente de classe social → alerta espiritual.</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'neoclassicismo',
  'Neoclassicismo',
  'arte',
  'comum',
  'A volta do greco-romano pela mão do Iluminismo e da Revolução Francesa: rigor geométrico, mármore sem pintura e figura idealizada sem expressão.',
  '<ul><li><p>A volta do clássico greco-romano;</p></li>
<li><p>Valorização da racionalidade e moral;</p></li>
<li><p><strong>Contexto:</strong></p>
<ul><li><p>[[Revolução Francesa]];</p></li>
<li><p>A descoberta de Pompéia e Herculano;</p></li>
<li><p>Iluminismo;</p></li>
<li><p>Reação ao luxo e a futilidade da monarquia;</p></li></ul></li>
<li><p><strong>Características:</strong></p>
<ul><li><p>Valorização da estética e dos temas clássicos;</p></li>
<li><p>Rigor geométrico;</p></li>
<li><p>Perfeição formal;</p></li>
<li><p>Pureza, clareza e equilíbrio formal;</p></li>
<li><p>Academicismo: aplicação dos ideais e modelos greco-romanos na arte, com ênfase no racionalismo;</p></li>
<li><p>Beleza canônica: conjunto de regras, padrões ou proporções estabelecidas para descrever o corpo humano ideal;</p></li>
<li><p>Imitação da natureza;</p></li>
<li><p>Temas históricos, heróicos e moral;</p></li>
<li><p>Uso de mármore (sem pintura);</p></li>
<li><p>Figuras idealizadas e sem expressão;</p></li>
<li><p>Formalismo e racionalismo; mensagem moral ou pedagógica (exaltação da virtude e da Ordem).</p></li></ul></li>
<li><p><strong>Arquitetura:</strong></p>
<ul><li><p>Pórticos com colunas;</p></li>
<li><p>Fachadas retas com frontões;</p></li>
<li><p>Paredes claras e sem elementos de corretivos;</p></li>
<li><p>Construções como símbolo de autoridade e poder (monumentais e em grande escala).</p></li></ul></li>
<li><p><strong>Artistas:</strong></p>
<ul><li><p>Jacques-Louis David;</p></li>
<li><p>Jean August Ingres;</p></li>
<li><p>Jean-Baptiste Debret;</p></li>
<li><p>Angelica Kauffmann;</p></li>
<li><p>Antonio Canova.</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

-- Os dois casamentos exatos com o edital do PAS UEM. O terceiro candidato,
-- `Arte Medieval: Romântica, Bizantina e Gótica.`, fica de fora pelo motivo
-- explicado no cabeçalho.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.materia_slug = 'arte'
   and e.resumo_id is null
   and (
     (e.texto = 'Neoclassicismo na Europa e no Brasil.' and r.slug = 'neoclassicismo')
     or
     (e.texto = 'Arte Greco-Romana: arquitetura, pintura e escultura.' and r.slug = 'arte-grega')
   );

-- Decisão 9c: o trigger `sync_conexoes_resumo` roda no insert, e todo [[wikilink]]
-- que apontasse para um irmão inserido depois seria descartado em silêncio.
-- Este update vazio o dispara de novo, com os quatro já no banco.
update resumos set corpo = corpo where materia_slug = 'arte';

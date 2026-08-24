-- Importa a Filosofia, vinda de "Materias e conteúdos feitos/Filosofia.docx".
--
-- Nove resumos, dos sofistas ao Renascimento. A matéria tinha **um** resumo no
-- site (`filosofia-da-linguagem`, escrito direto no editor em agosto) mais os
-- dois sumários de edital de hoje de manhã.
--
-- `processo_slug = 'comum'`, como a Literatura e a Geografia: o documento-mestre
-- é o material por disciplina, e Sócrates cai nos três vestibulares (decisão 1c).
-- Os nove ficam na raiz.
--
-- ## O sublinhado aqui é quase um sistema, e isso mudou a regra
--
-- Este é o documento em que o autor mais grifa: linhas inteiras de Sócrates e de
-- Agostinho vêm sublinhadas. A regra que eu vinha usando — sublinhado no meio da
-- frase vira `<strong>`, sublinhado que abre o item vira texto puro — produzia
-- aqui parágrafos inteiros em negrito, o que não destaca nada e ainda briga com
-- a decisão 12 (negrito é grafo, e o `<strong>` de peso 500 é o que sobra para
-- ênfase).
--
-- Então a regra ganhou um terceiro caso, e ele vale daqui para a frente:
-- **sublinhado que cobre o item INTEIRO também vira texto puro**. Só vira
-- `<strong>` o grifo que destaca um trecho DENTRO de uma frase que tem outro
-- trecho sem grifo — que é a única situação em que a marca informa alguma coisa.
--
-- ## Uma imagem entrou, a outra virou tabela
--
-- - **Ato e potência** continua imagem: o desenho do jovem e do idoso é o que
--   explica o par, e o texto ao lado não o repete. WebP q82, 356 KB → 45 KB.
-- - **O quadro do meio-termo** (excesso / falta / virtude, com audácia, prazer e
--   honra) vinha como print de tabela. Print de tabela não se seleciona, não rola
--   no celular e traz fundo claro para dentro do tema escuro. Entrou como
--   `<table>` de verdade, com as mesmas doze células.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - "No interior do homem habita a verdade. ”Se não crerdes, não entendereis.”
--   — a primeira aspa de fechamento está no lugar de uma de abertura, e as duas
--   citações ficaram dentro do mesmo par.
-- - "Toda substância (qualquer coisa que existe no mundo material) é composto
--   pela união" — "é composto" por "é composta".
-- - "Divisão da sociedade e suas correspondentes virtude", no singular.
-- - "entre os excesso e a falta dos extremos", em Aristóteles.
-- - "Ama e fazei o que quiseres", que mistura as duas pessoas (é "ama e faze").
-- - "Séc. V a IX" para a Patrística, que costuma ser datada do séc. II ao VIII.
-- - "Humanismo:grande fenômeno espiritual" — este eu **consertei**, e é preciso
--   dizer por quê: o espaço não faltava no documento, ele foi comido pelo meu
--   extrator, o mesmo defeito da `20260823200000`. Aqui ele foi pego antes de
--   entrar, junto com "da areté", "nas coisas" e "é um bem em si".
--
-- Não há fórmula nem `[[wikilink]]` nesta leva. `on conflict (slug) do nothing`
-- deixa rodar de novo sem duplicar.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sofistas',
  'Sofistas',
  'filosofia',
  'comum',
  'Os professores de retórica das Ágoras, e as três críticas que Sócrates lhes fazia.',
  '<p>professores de Retórica (arte de falar) e da <em>areté</em> (ser eficiente em algo, excelência, virtude) que debatiam assuntos políticos nas Ágoras. Eram <strong>criticados</strong> por Sócrates por:</p><ul><li><p>Serem céticos (questionamento da possibilidade da existência de verdade absoluta) e relativistas (verdade é relativa ao contexto individual);</p></li><li><p>Serem ausentes de Ética;</p></li><li><p>Cobrar pelos seus ensinamentos;</p></li><li><p>Os mais importantes foram:</p></li></ul><h2 data-corrido="sim">Protágoras:</h2><p>cético e relativista;</p><ul><li><p>“O homem é a medida de todas as coisas”</p></li></ul><h2 data-corrido="sim">Antífon:</h2><p>defendia que as leis humanas (nomos) muitas vezes vão contra a natureza/lei natural (physis).</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'socrates',
  'Sócrates',
  'filosofia',
  'comum',
  'O autoconhecimento como caminho da virtude, e a maiêutica que faz o outro parir a própria resposta.',
  '<ul><li><p>“Só sei que nada sei.” “Conhece-te a ti mesmo”.</p></li><li><p>Filosofia centrada no ser humano.</p></li><li><p>Busca da virtude (<em>areté</em>) pelo autoconhecimento: A verdadeira excelência está em viver uma vida justa, ética e sábia — e isso só é possível com o autoconhecimento.</p></li><li><p>O conhecimento de si mesmo é essencial para uma vida virtuosa e feliz;</p></li><li><p>O mal é sempre resultado da ignorância sobre o verdadeiro Bem, pois ninguém age mal voluntariamente ao compreender plenamente a virtude;</p></li><li><p>O objetivo de Sócrates (e de sua filosofia) era despertar as pessoas para uma vida examinada, fundamentada no autoconhecimento e na busca racional da virtude (<em>areté</em>). Ele via a filosofia não como um sistema teórico, mas como uma prática transformadora, um exame constante de si e dos valores que guiam a existência individual e coletiva;</p></li></ul><h2 data-corrido="sim">Método socrático (maiêutica, “parir ideias”):</h2><p>forma de ensinar por meio do diálogo e ironia. Busca <strong>levar o outro a descobrir a verdade por si mesmo.</strong></p><ul><li><p>Dois momentos:</p><ul><li><p>Ironia: questiona e desmonta falsas certezas;</p></li><li><p>Maiêutica: ajuda o interlocutor a “dar à luz” o conhecimento por meio de perguntas.</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'teoria-das-ideias',
  'Teoria das Ideias',
  'filosofia',
  'comum',
  'O mundo sensível e o mundo inteligível: onde Platão põe a realidade verdadeira.',
  '<p>para <strong>Platão</strong>, a realidade verdadeira <strong>não está nas coisas materiais que vemos e tocamos</strong> (<strong>Mundo Sensível</strong>), mas sim em <strong>Ideias ou Formas perfeitas</strong>, que existem num<strong> plano superior e eterno </strong>(<strong>Mundo Inteligível)</strong>.</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'a-republica',
  'A República',
  'filosofia',
  'comum',
  'A cidade justa em três classes, a alma em três partes, e a caverna que explica as duas.',
  '<p><strong>diálogo</strong> de <strong>Platão</strong> sobre a <strong>justiça</strong>. Ele critica a visão sofista de que a justiça é o interesse do mais forte e propõe que ela<strong> é um bem em si, essencial para a felicidade</strong>. Para entender a justiça no indivíduo, ele propõe observar uma cidade ideal, acreditando que seria mais fácil enxergar a justiça em larga escala. Assim, ele cria o conceito da "cidade justa" e depois o aplica à alma humana.</p><p>Divisão da sociedade e suas correspondentes virtude:</p><ul><li><p>Governantes (filósofos-reis): guiados pela razão e responsáveis por governar. Razão</p></li><li><p>Guardiões (guerreiros): responsáveis por proteger a cidade. Ânimo ou coragem</p></li><li><p>Produtores (agricultores, artesãos, comerciantes, etc.): cuidam das necessidades materiais. Moderação</p></li></ul><ul><li><p>A justiça consiste na <strong>harmonia e ordenação correta dessas partes tanto na cidade quanto na alma individual</strong>, que também é composta por três partes: <strong>apetitiva (instintos, produtores), irascível (vontade, guerreiros) e racional (governantes).</strong></p></li></ul><h2 data-corrido="sim">Alegoria/mito da Caverna:</h2><p>Platão usa essa alegoria para <strong>mostrar como a maioria das pessoas vive na ignorância</strong> (como prisioneiros em uma caverna, vendo apenas sombras), e como o filósofo, ao buscar o conhecimento verdadeiro, pode sair da caverna e enxergar a realidade (o mundo das ideias).</p><ul><li><p>É também uma forma didática de explicar a Teoria das Ideias: os sentidos nos mostram sombras da realidade, mas o conhecimento verdadeiro só é possível quando a alma se volta para o mundo das ideias por meio da razão e da filosofia.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'aristoteles',
  'Aristóteles',
  'filosofia',
  'comum',
  'As quatro causas, o hilemorfismo, o meio-termo da virtude e o homem como animal político.',
  '<p>nasceu em Estagira (daí o apelido “o Estagirita”). Entrou na Academia de Platão aos 17 anos e permaneceu lá por cerca de 20 anos. Após a morte de Platão, fundou o Liceu em Atenas.</p><ul><li><p><strong>Diferente de Platão</strong>, que valorizava o mundo das ideias, Aristóteles focava na observação da realidade concreta. <strong>Sua filosofia era empírica, buscando compreender o mundo a partir da experiência sensível</strong>.</p></li><li><p>É considerado <strong>o primeiro cientista</strong> por estudar diversas áreas do conhecimento e dividi-las em disciplinas:</p><ul><li><p>1. Ciências teoréticas ou especulativas (<em>theoría</em>): ciências que buscam o saber por si mesmo; o estudo amplo da realidade</p><ul><li><p>Ciências naturais: Física, Biologia, Astronomia, Metafísica, …;</p></li></ul></li><li><p>2. Ciências práticas (<em>práxis</em>): ciências que buscam o saber para, através dele, alcançar a perfeição moral;</p><ul><li><p>Ação humana: ética e política;</p></li></ul></li><li><p>3. Ciências produtivas ou criativas (<em>poiésis</em>): ciências que buscam o saber em função do fazer, isto é, visando produzir determinados objetos;</p><ul><li><p>Construção de coisas que servem às necessidades humanas e Retórica;</p></li></ul></li></ul></li><li><p>“Todos os homens, por natureza, tendem ao saber”, pois o homem ama as sensações, em especial o ver, e a experiência sensível é o ponto de partida para a ciência e a filosofia;</p></li></ul><h2 data-corrido="sim">Teoria das Quatro Causas:</h2><p>segundo Aristóteles, para entender completamente algo (um ser, um objeto ou um fenômeno), era preciso investigar quatro tipos de causas que explicam sua existência.</p><ul><li><p>1. Causa material: do que é feito?</p></li><li><p>2. Causa formal: o que é?</p></li><li><p>3. Causa eficiente: quem ou o que fez?</p></li><li><p>4. Causa final (teleologia): para que serve?</p></li></ul><h2 data-corrido="sim">Teoria do Hilemorfismo (ou das Substâncias):</h2><p>toda substância (qualquer coisa que existe no mundo material) é composto pela <strong>união inseparável de matéria (<em>hyle</em>) e forma (<em>morphé</em></strong>);</p><ul><li><p>Matéria (<em>hyle</em>): é aquilo de que uma coisa é feita, o elemento potencial. Ex: madeira;</p><ul><li><p>Toda matéria tem <strong>potência</strong>: capacidade de vir a ser.</p></li></ul></li><li><p>Forma (<em>morphé</em>): resultado do <strong>ato</strong> que organiza a matéria, tornando-a um ser definido; causa final. Ex: uma mesa de madeira;</p><ul><li><p>Toda substância tem atributos (características):</p></li></ul></li><li><p>Acidentes/contingências: características que uma substância pode assumir e deixar de ter sem deixar de ser o que ela é;</p><ul><li><p>Ex: cor do cabelo de uma pessoa, a altura de uma árvore, a roupa que alguém veste;</p></li></ul></li><li><p>Essenciais/necessários: características que, se mudadas, a faz deixar de ser ela mesma;</p><ul><li><p>Ex: um triângulo ter três lados; o ser humano ter racionalidade;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/filosofia/ato-e-potencia.webp" alt="Um rosto jovem rotulado “jovem em ato” e um rosto idoso rotulado “idoso em potência”; abaixo, um corpo com a legenda “a matéria dessa pessoa seria o seu corpo” e uma silhueta clara com “a sua forma seria a sua alma”." style="width:100%" data-largura="100%"></figure><h2 data-corrido="sim">Ética para Aristóteles:</h2><p>“Toda arte e toda investigação, bem como toda ação e toda escolha, visam a um bem qualquer; e por isso foi dito, não sem razão, que <strong>o bem é aquilo a que todas as coisas tendem</strong>.”</p><h3>Finalidade (<em>telos</em>):</h3><ul><li><p>Para Aristóteles, tudo que existe tem uma finalidade (ideia denominada <strong>teleologia</strong>), ou seja, <strong>toda ação visa um bem</strong>;</p></li><li><p>A finalidade do ser humano é a <strong><em>eudaimonia</em></strong> (felicidade, bem-viver, plenitude), alcançada pelo uso da <strong>razão</strong>, a <strong>prudência</strong> como guia das ações e exercício das <strong>virtudes</strong> (<em>areté</em>);</p><ul><li><p>Virtude é a disposição para agir racionalmente. Encontra-se no <strong>meio-termo (justa medida)</strong> entre os excesso e a falta dos extremos;</p><table><tbody><tr><th><p>Extremo do excesso</p></th><th><p>Extremo da falta</p></th><th><p>Meio-termo (Virtude)</p></th></tr><tr><td><p>Audácia</p></td><td><p>Medo/Covardia</p></td><td><p>Coragem</p></td></tr><tr><td><p>Prazer</p></td><td><p>Sofrimento</p></td><td><p>Temperança</p></td></tr><tr><td><p>Honra (ambição)</p></td><td><p>Desonra (humildade inadequada)</p></td><td><p>Justo orgulho</p></td></tr></tbody></table></li><li><p>A virtude é gerada e desenvolvida pelo <strong>ensino</strong> ou pelo <strong>hábito</strong>;</p></li></ul></li></ul><h3>Política:</h3><ul><li><p><strong>O homem é um animal político</strong>, ou seja, ele só alcança a plenitude (<em>eudaimonia</em>) vivendo em sociedade. Torna-se, então, <strong>uma necessidade natural</strong>;</p></li><li><p>A ética busca o bem individual e a política o bem comum, então <strong>a política é a continuação da ética ao nível coletivo</strong>;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'filosofia-helenistica',
  'Filosofia Helenística',
  'filosofia',
  'comum',
  'Epicurismo, ceticismo e estoicismo — três caminhos para a mesma ataraxia.',
  '<p>conjunto de correntes filosóficas que se desenvolveram após a morte de Alexandre, o Grande (323 a.C.), no período chamado <strong>Helenismo</strong> que acaba na consolidação do Império Romano (aprox. século II d.C.) e caracteriza-se pela <strong>fusão da cultura grega com elementos orientais</strong>;</p><ul><li><p>Os filósofos helenistas tinham como objetivo proporcionar ao homem a <strong><em>ataraxia</em> (paz de espírito</strong>), propondo caminhos baseados na ética e nas virtudes morais para alcançar este objetivo;</p></li></ul><h2 data-corrido="sim">Epicurismo:</h2><p>a verdade e o bem, o bom e o verdadeiro trazem prazer, portanto nos fazem alcançar a <em>ataraxia</em>;</p><ul><li><p><strong>O prazer é uma expressão da natureza humana</strong>, e, quando se desfruta moderadamente dos prazeres, <strong>o prazer tem o papel de levar o ser humano à paz de espírito</strong>;</p></li><li><p>Alguns prazeres, para Epicuro: fazer poucas coisas; comer moderadamente, ter amizades e boas companhias, ter independência econômica, ter tempo para reflexões filosóficas, <strong>ter uma vida simples</strong> (em contraposição ao luxo e à riqueza);</p></li><li><p>A virtude está em desfrutar moderadamente dos prazeres da vida humana;</p></li></ul><h2 data-corrido="sim">Ceticismo (pirronismo):</h2><p>tudo é duvidoso: é impossível conhecer a verdade ou compreender alguma coisa (<em>acatalepsia</em>);</p><ul><li><p>“A toda razão opõe-se uma razão de igual valor”, ou seja,<strong> todas as razões e os argumentos são equivalentes</strong>, não havendo porque escolher entre uma filosofia ou outra;</p><ul><li><p>Procurar a verdade/filosofia verdadeira causa confronto de ideias e perturba a alma, logo deve-se “suspender o juízo”, abdicar do que pensamos, de nossas ideias e opiniões para alcançar a <em>ataraxia</em>;</p></li></ul></li><li><p>A virtude é ser razoável (ter bom senso, ser moderado e ponderado);</p></li></ul><h2 data-corrido="sim">Estoicismo:</h2><p>a harmonia está na aceitação das leis do universo (logos); não se deve revoltar-se contra os sofrimentos e adversidades, deve-se aceitar as coisas como elas são;</p><ul><li><p>A virtude está em não sofrer por aquilo que não podemos controlar: morte, intempéries da natureza, passagem do tempo, velhice, o que pensam de nós;</p></li><li><p>A razão é a maior faculdade humana. Deve ser usada para agir com virtude e para alcançar a <em>ataraxia</em>.</p></li><li><p>As principais virtudes, para o Estoicismo:</p><ul><li><p>Coragem: discernimento de quando ter medo e quando não ter medo;</p></li><li><p>Inteligência: conhecer o bem e o mal;</p></li><li><p>Justiça: saber dar a cada um o que lhe é devido.</p></li></ul></li><li><p>O estoicismo influenciou fortemente o cristianismo com as ideias de autocontrole, submissão à razão divina e a ética rigorosa e austera, rígida e inflexível;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'patristica',
  'Patrística',
  'filosofia',
  'comum',
  'Os Padres da Igreja lendo Platão, e o Agostinho que separa livre-arbítrio de liberdade.',
  '<p>o primeiro período da Filosofia Medieval, caracterizado pelos estudos filosóficos e pela exegese bíblica feita pelos primeiros Padres da Igreja: os pais da Igreja.</p><ul><li><p>Séc. V a IX;</p></li></ul><h2>Características:</h2><ul><li><p>Teocentrismo: Deus como centro, ponto de partida, princípio e fundamento</p></li><li><p>Teologia: cristianismo, <strong>a fé cristã + filosofia</strong></p></li><li><p>Neoplatonismo: retomada das ideias de Platão;</p></li><li><p>Conflito de culturas entre <strong>cristianismo, judaísmo, helenismo e formas diversas de paganismo;</strong> tentativa de conciliação entre a maior parte delas;</p></li><li><p>Os <strong>filósofos da Patrística</strong> eram, em primeiro lugar, <strong>teólogos</strong>; eram <strong>pensadores do cristianismo nascente</strong>;</p></li><li><p>Não haveria uma oposição entre fé e razão, mas uma relação de <strong>complementaridade</strong>;</p></li></ul><h2 data-corrido="sim">Santo Agostinho:</h2><p>foi responsável por efetuar pela primeira vez uma verdadeira <strong>reunião da tradição grega com o novo pensamento cristão</strong> e o fez utilizando-se da <strong>filosofia de Platão</strong>;</p><ul><li><p>A influência platônica sobre o pensamento de Agostinho é mais clara em dois pontos:</p><ul><li><p>Distinção entre o reino do sensível e o do inteligível: assim como Platão, <strong>defendia a existência de ideias eternas e imutáveis</strong>, ainda que ele às vezes use outros termos para se referir a elas, como “<strong>realidades inteligíveis</strong>” ou “<strong>razões incorpóreas e eternas</strong>”, e considerava que elas <strong>existiam na mente divina</strong>;</p></li><li><p>Teoria da iluminação: o homem possui dentro de si uma <strong>centelha divina</strong>, a Verdade, que vem de Deus. <strong>Ao refletir sobre si</strong>, o homem se <strong>aproxima de Deus, pois foi criado à sua imagem</strong>. No entanto, a razão humana é limitada; por isso, apenas pela fé o homem pode alcançar o verdadeiro conhecimento;</p><ul><li><p>Deus ilumina a mente humana, revelando a Verdade, mas nem tudo pode ser plenamente compreendido, pois há mistérios que pertencem ao mundo espiritual;</p></li></ul></li></ul></li><li><p>“No interior do homem habita a verdade. ”Se não crerdes, não entendereis.”</p></li><li><p>O problema do livre-arbítrio e da liberdade:</p><ul><li><p>Agostinho diferencia livre-arbítrio de liberdade;</p><ul><li><p>Livre-arbítrio é a capacidade de eleição entre duas ou mais possibilidades;</p></li><li><p>Liberdade é a escolha do bem, também chamada de boa vontade;</p><ul><li><p>“Um homem bom é livre, mesmo quando é escravo. Um homem mau é escravo, mesmo quando é rei. Não serve a outros homens, mas a seus caprichos. Tem tantos senhores quantos vícios.”</p></li></ul></li></ul></li><li><p>Sem o auxílio de Deus, o ser humano tem livre-arbítrio para escolher o bem, mas não o faz;</p></li><li><p>“Ama e fazei o que quiseres.”</p></li><li><p>Em resumo,<strong> o ser humano precisaria da graça divina para usar seu livre-arbítrio de modo a ser realmente livre</strong>;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'escolastica',
  'Escolástica',
  'filosofia',
  'comum',
  'A filosofia que entra na escola e na universidade, e o Tomás de Aquino que traz Aristóteles de volta.',
  '<p>corrente filosófica e cultural que marca a baixa Idade Média na Europa;</p><ul><li><p>Séc. XIII e XIV;</p></li><li><p>“Resposta” à crise social e religiosa, e ponto culminante do renascimento carolíngio (reinado de Carlos Magno);</p></li><li><p><strong>Institucionalização do conhecimento</strong>; <strong>filosofia ensinada nas escolas cristãs</strong>;</p><ul><li><p>Escolas catedrais e palatinas:</p><ul><li><p>Instituições localizadas nas catedrais e nos palácios;</p></li><li><p>Popularização do ensino: artes liberais e cristianismo;</p></li></ul></li><li><p>Universidades:</p><ul><li><p>Cultura acadêmica;</p></li><li><p>Disseminação do conhecimento;</p></li><li><p>Elaboração da cultura;</p></li></ul></li></ul></li><li><p>Retomada da filosofia aristotélica;</p></li></ul><h2>Santo Tomás de Aquino:</h2><ul><li><p>Sobre Aristóteles: o filósofo grego desenvolveu ao máximo a capacidade humana de pensar sem o auxílio da fé;</p></li><li><p>Santo Tomás de Aquino + Aristóteles: elevação da dignidade da razão natural, agora iluminada pela luz divina;</p></li><li><p>A fé e a filosofia pretendem chegar à verdade;</p></li><li><p>Verdade:</p><ul><li><p>Filosofia e ciência: verdades acessíveis à razão natural (raciocínio lógico);</p></li><li><p>Filosofia e teologia: verdades confirmadas pela revelação divina (texto bíblico);</p></li><li><p>Teologia sobreposta à filosofia: mística – verdades reveladas, inacessíveis à razão natural;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'renascimento',
  'Renascimento',
  'filosofia',
  'comum',
  'O antropocentrismo contra o teocentrismo, e os três nomes: Erasmo, Thomas More e Maquiavel.',
  '<p>retorno aos ideais greco-romanos;</p><h2 data-corrido="sim">Humanismo:</h2><p>grande fenômeno espiritual de “regeneração” e de “reforma”, no qual o retorno aos antigos significou revivência das origens, “volta aos princípios”, ou seja, retorno ao autêntico;</p><h3>Antropocentrismo x Teocentrismo:</h3><ul><li><p>Antropocentrismo: coloca o ser humano no centro do universo; valoriza a experiência humana, a razão e a autonomia intelectual.</p></li><li><p>Teocentrismo: visão medieval que colocava Deus como centro de tudo e explicava o mundo por meio da fé.</p></li><li><p>O Humanismo rompe com o teocentrismo ao enfatizar:</p><ul><li><p>Valorização do pensamento crítico e racional;</p></li><li><p>Retorno às fontes clássicas (Grécia e Roma);</p></li><li><p>Defesa da educação, das artes e da observação da realidade;</p></li><li><p>Mudança na mentalidade: do foco na salvação espiritual para o foco na vida terrena;</p></li></ul></li></ul><h3>Características:</h3><ul><li><p>Individualismo prático e teórico;</p></li><li><p>Exaltação da vida mundana;</p></li><li><p>Acentuado sensualismo;</p></li><li><p>Mundanização da religião;</p></li><li><p>Paganismo (indivíduos não batizados e/ou adeptos do politeísmo);</p></li><li><p>Liberdade em relação às autoridades espirituais;</p></li><li><p>Valorização da história;</p></li><li><p>Naturalismo filosófico;</p></li><li><p>Extraordinário gosto artístico;</p></li></ul><h2>Erasmo de Roterdã:</h2><ul><li><p><strong>Anseia por uma renovação religiosa</strong>, da mesma forma como o humanismo renascentista deseja;</p></li><li><p><strong>Tece críticas à Igreja e ao clero renascentista</strong> (nesta época a Igreja Católica passava por uma crise interna, ligada à interferência da nobreza nos cargos sacerdotais);</p></li><li><p>Antecipa alguns pensamentos e posicionamentos de Martinho Lutero, porém, <strong>nunca pretendeu uma separação da Igreja</strong>;</p></li><li><p>Manteve-se <strong>neutro em seu posicionamento religioso</strong>: nem a favor do clero corrompido de Roma, nem a favor da reforma protestante e das propostas de Lutero;</p></li><li><p>Defendia o estudo dos textos bíblicos em grego e latim para combater erros teológicos;</p></li></ul><h2 data-corrido="sim">Thomas More:</h2><p>autor da obra <em>Utopia</em>;</p><ul><li><p><em>Utopia</em> não é um projeto político real, mas um instrumento crítico;</p></li><li><p><strong>Indica os males sociais da época</strong>, como injustiça, ganância, desigualdade e corrupção;</p></li><li><p><strong>Propõe reflexão</strong> sobre a possibilidade ou impossibilidade de concretizar ideais perfeitos;</p></li><li><p>Valor renascentista: <strong>defesa da liberdade interior, educação integral e autonomia racional</strong>;</p></li><li><p>Sociedade utópica guiada pela razão, igualdade, vida comunitária e ausência de propriedade privada;</p></li><li><p>Mesmo a defesa irrecusável da Igreja por Thomas Morus, e sua oposição perseverante a Henrique VIII, demonstra o valor supremo que tinha a liberdade interior para o homem renascentista;</p></li></ul><h2 data-corrido="sim">Maquiavel:</h2><p>fundador da ciência política e autor do livro <em>O príncipe</em>;</p><h3 data-corrido="sim"><em>Virtú</em>:</h3><p>conjunto de qualidades que torna um governante apto a liderar e a manter o poder;</p><ul><li><p>Força de vontade individual para enfrentar a <strong>fortuna (acaso, fatalismo, destino inevitável)</strong>;</p></li><li><p>Para fazer ações políticas, o governante deve dominar a <em>fortuna</em> com a <em>virtú</em>;</p></li><li><p>Ética maquiavélica: princípios que orientam o comportamento do príncipe:</p><ul><li><p>Ações políticas eficazes para comandar o povo;</p><ul><li><p>Os fins justificam os meios;</p></li></ul></li><li><p>Preocupação com a estabilidade do poder (o poder deve ser duradouro);</p></li><li><p>É fundamental que o <strong>poder do príncipe</strong> seja <strong>sustentado pelo apoio popular</strong>;</p></li><li><p>Para Maquiavel, não há um bem absoluto nem um mal absoluto: há um <strong>jogo político entre o bem e o mal</strong>;</p></li></ul></li><li><p>Assim, o Príncipe (governante) deve:</p><ul><li><p>Buscar <strong>equilíbrio</strong> entre:</p><ul><li><p>Liberalidade e parcimônia;</p></li><li><p>Crueldade e clemência;</p></li><li><p>Ser amado e temido (se não puder ambos, <strong>melhor ser temido do que amado</strong>);</p></li></ul></li><li><p>Evitar o desprezo e o ódio;</p></li><li><p>Garantir a manutenção e estabilidade do Estado;</p></li></ul></li></ul>',
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
   where materia_slug = 'filosofia' and processo_slug = 'comum';
  if n_novos <> 9 then
    raise exception 'esperava 9 resumos de Filosofia em comum, encontrei %', n_novos;
  end if;

  select count(*) into n_titulos
    from (select titulo from resumos group by titulo having count(*) > 1) x;
  if n_titulos <> 0 then
    raise exception '% títulos repetidos no acervo', n_titulos;
  end if;
end $$;

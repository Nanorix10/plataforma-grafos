-- Importa a Língua Portuguesa, vinda de "Materias e conteúdos feitos/Língua
-- Portuguesa.docx".
--
-- Vinte resumos e dezessete figuras, de subsistemas linguísticos a
-- predicado. `processo_slug = 'comum'`, como a Literatura, a Geografia e a
-- Filosofia (decisão 1c). Todos na raiz.
--
-- ## Cinco tópicos do documento NÃO entraram, porque já estão no site
--
-- Este é o primeiro documento-mestre que cruza com conteúdo publicado, e o
-- cruzamento é grande:
--
-- - **Variações linguísticas**, **Funções da linguagem**, **Ambiguidade** e
--   **Intertextualidade** já entraram hoje de manhã pela 2ª etapa do PASSE, com
--   o mesmo texto. Comparado item a item: as quatro são a mesma coisa.
-- - **Período** já está dentro de `frase-oracao-e-periodo`, da 1ª etapa do PAS
--   UEM, com os mesmos dois exemplos ("Faltam apenas alguns dias" e "Não sei se
--   tenho coragem").
--
-- Reinserir criaria títulos repetidos, e título repetido deixa o trigger
-- `sync_conexoes_resumo` sem destino definido — ele resolve `[[wikilink]]` com
-- `where titulo = …`. Ficam de fora, e o acervo continua com uma versão só.
--
-- **Qual versão ficou, e por quê.** Onde os dois documentos divergem, ficou a
-- que já estava: o `.docx` do PASSE foi modificado em julho/2026 e este em
-- fevereiro/2026, então o do PASSE é o texto mais recente do autor. A diferença
-- visível é uma só: em Ambiguidade, aqui está "um efeito sugestivo" e no site
-- está "sugAestivo". **O site está com a versão mais nova, e ela tem o A
-- sobrando** — vale ele decidir qual quer.
--
-- ## Um tópico entra sabendo que repete parte de outro
--
-- **Conjunções Coordenativas e Subordinativas** cobre um terreno que
-- `frase-oracao-e-periodo` já pisa: a tabela das coordenativas aparece nos dois.
-- Entra assim mesmo porque traz o que o outro não tem — as nove subordinadas
-- adverbiais, cada uma com exemplo, que hoje o site só nomeia. **Fica o aviso:
-- os dois resumos se sobrepõem em parte, e juntá-los é decisão do autor**, não
-- de quem está migrando.
--
-- ## As dezessete figuras continuam figuras, e isso é uma escolha
--
-- Nas migrations de hoje eu converti para `<table>` toda tabela que chegou como
-- print — as de solubilidade, a do meio-termo de Aristóteles. Aqui **não**, e a
-- razão é a densidade: os quadros de ortografia, acentuação, homônimos e
-- parônimos têm dezenas de células, e o que ensina neles é o **realce dentro da
-- palavra** ("con**sent**ir – consen**s**o", "obt**er** – obten**ç**ão"). Cada
-- célula transcrita é uma chance de trocar a letra realçada, e o aluno decora o
-- que está escrito ali. Transcrever de olho um quadro de ortografia não é
-- transportar, é reescrever com risco.
--
-- 1,79 MB no documento, 0,82 MB no repositório em WebP q82.
--
-- ## O que muda de FORMA
--
-- Mesmo mapeamento das outras migrations de hoje. As duas tabelas que vieram
-- como tabela DE VERDADE no `.docx` (advérbios e conjunções coordenadas) entram
-- como `<table>`. Nas células delas o Docs quebrava a linha no meio da lista;
-- as quebras viraram espaço, porque eram quebra de linha da caixa e não item
-- novo.
--
-- Os dois mnemônicos do autor eram equação OMML e entram como fórmula:
-- `A^{3}CE` para as coordenadas e `C^{6}FPT` para as adverbiais.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"FIguras de construção"**, com o I maiúsculo, está no TÍTULO do resumo.
-- - "Vamos fazer um churrasco, eu levo a carne e você só leva linguiça (sentido
--   sexual); ]" — o colchete solto no fim ficou. (Este item vive em Ambiguidade,
--   que não entrou; fica registrado porque está no documento.)
-- - "uma palavra primitiva deriva novas palavra", no singular.
-- - "redução de um palavra primitiva", em Regressiva.
-- - "elementos de diferentes origens etimológicos", concordando no masculino.
-- - "Chove chuva, chove sem parar (Jorge Bem Jor)" — é Jorge Ben Jor.
-- - "Minha foz do Iguaçu polo sul meu azul luz do sentimento nu (Djavan)" está
--   sem pontuação, como no documento.
-- - "Cacofonia: vício de linguagem que promove uma união não harmônica de sons
--   diferentes" — cacofonia é o som novo e indesejado que nasce do encontro, não
--   a desarmonia.
-- - "Retos: fazem papel de sujeito" e a lista logo abaixo começa em "Tu", sem o
--   "Eu".
-- - "Oblíquos" lista "nós" e "ele" entre os oblíquos, que são retos.
-- - "sinteticamente, são classificados" (por sintaticamente), nos possessivos.
-- - "Ex: Em seu novo carro, ele vai para a faculdade; [ele] vai de ônibus" — o
--   exemplo de elipse traz o termo omitido escrito entre colchetes.
-- - "Voz passiva sintética: … O sujeito vem explícito" — na sintética o agente é
--   que fica oculto; o sujeito é o paciente.
--
-- Não há `[[wikilink]]` nesta leva. As duas fórmulas passaram pelo KaTeX.
-- `on conflict (slug) do nothing` deixa rodar de novo sem duplicar.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'subsistemas-linguisticos',
  'Subsistemas linguísticos',
  'portugues',
  'comum',
  'Gramática, léxico, semântica e discurso — as quatro camadas em que a língua se divide.',
  '<h2 data-corrido="sim">Gramática:</h2><p>regras e princípios que regem o funcionamento de uma língua;</p><ul><li><p>Fonologia: sons e pronúncia das palavras;</p></li><li><p>Morfologia: estrutura, formação e classificação das palavras;</p></li><li><p>Sintaxe: organização das palavras e frases, a função das orações e a concordância;</p></li></ul><h2 data-corrido="sim">Léxico:</h2><p>conjunto de palavras da língua;</p><h2 data-corrido="sim">Semântica:</h2><p>criação e modificação de sentido;</p><ul><li><p>Denotação: emprego do sentido real, literal das palavras e expressões;</p><ul><li><p>Ex: Depois de jogar bola, nós comemos um churrasco;</p></li></ul></li><li><p>Conotação: emprego do sentido subjetivo, figurado das palavras e expressões,</p><ul><li><p>Ex: Ele comeu bola na prova de matemática;</p></li></ul></li></ul><h2 data-corrido="sim">Discurso:</h2><p>materialização do contexto sócio-histórico;</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'modalidade-da-lingua',
  'Modalidade da língua',
  'portugues',
  'comum',
  'Verbal, não verbal e multimodal.',
  '<h2 data-corrido="sim">Verbal:</h2><p>uso de palavras como meio de comunicação (escrita ou oral);</p><h2 data-corrido="sim">Não verbal:</h2><p>uso de códigos linguísticos simbólicos (visual ou outros tipos);</p><h2 data-corrido="sim">Multimodal:</h2><p>união da linguagem verbal e não verbal;</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'discurso',
  'Discurso',
  'portugues',
  'comum',
  'Direto, indireto e indireto livre — de quem é a voz que se ouve.',
  '<h2 data-corrido="sim">Direto:</h2><p>fala da personagem é reproduzida integralmente, mantendo a voz original;</p><ul><li><p>Uso de travessão, dois pontos, aspas ou reticências para marcar a fala;</p></li><li><p>Ex: Maria disse: “Eu vou ao cinema hoje.”</p></li></ul><h2 data-corrido="sim">Indireto:</h2><p>fala da personagem é contada pelo narrador, com as palavras dele;</p><h2 data-corrido="sim">Indireto livre:</h2><p>mistura do direto com o indireto, onde a fala do personagem se mistura à narrativa do narrador, sem as marcas do discurso direto;</p><ul><li><p>O narrador assume os pensamentos e sentimentos da personagem, criando uma fusão entre os dois discursos;</p></li><li><p>Ex: Maria estava ansiosa para ir ao cinema. Ela realmente precisava relaxar. (A frase “Ela realmente precisava relaxar” pode ser a reflexão de Maria, mas está inserida na narrativa do narrador).</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sinais-de-pontuacao',
  'Sinais de pontuação',
  'portugues',
  'comum',
  'Os dez sinais e o que cada um faz na frase.',
  '<ul><li><p>Ponto final (.): marca o fim de uma frase declarativa;</p></li><li><p>Vírgula (,): separa elementos dentro de uma frase e orações curtas;</p></li><li><p>Ponto e vírgula (;): liga orações independentes que têm relação entre si;</p></li><li><p>Dois-pontos (:): introduz uma lista, uma citação, uma explicação ou uma fala direta;</p></li><li><p>Ponto de interrogação (?): usado no final de perguntas;</p></li><li><p>Ponto de exclamação (!): expressa emoções fortes como surpresa, alegria ou admiração;</p></li><li><p>Reticências (...): indicam uma interrupção, hesitação, dúvida ou que o sentido da frase está incompleto;</p></li><li><p>Travessão (—): usado no início de falas de personagens ou para destacar um termo dentro de uma frase;</p></li><li><p>Aspas (“”): usadas para destacar citações diretas, palavras estrangeiras ou títulos;</p></li><li><p>Parênteses (()): envolvem informações secundárias ou adicionais dentro de um texto.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'figuras-de-linguagem',
  'Figuras de linguagem',
  'portugues',
  'comum',
  'Metáfora, metonímia, sinestesia, catacrese e as figuras de som.',
  '<p>envolvem a substituição de um termo por outro com base em semelhanças ou associações de sentido;</p><h2 data-corrido="sim">Metáfora:</h2><p>comparação implícita, sem conectivo;</p><ul><li><p>Ex: Seu olhar é doce;</p></li></ul><h2 data-corrido="sim">Metonímia:</h2><p>substituição de uma palavra por outra com base em uma relação de proximidade, como a parte pelo todo ou o autor pela obra;</p><ul><li><p>Ex: Ler Machado de Assis (a obra);</p></li></ul><h2 data-corrido="sim">Sinestesia:</h2><p>mistura de diferentes sensações;</p><ul><li><p>Ex: "cheiro doce" ou "som áspero";</p></li></ul><h2 data-corrido="sim">Catacrese:</h2><p>uso de uma palavra em sentido figurado, pois faltava um termo específico para ela.</p><ul><li><p>Ex: "pé da mesa", "dente de alho";</p></li></ul><h2 data-corrido="sim">Aliteração:</h2><p>repetição de sons de consoantes;</p><ul><li><p>Ex: Chove chuva, chove sem parar (Jorge Bem Jor).</p></li></ul><h2 data-corrido="sim">Assonância:</h2><p>repetição de sons de vogais;</p><ul><li><p>Ex: Minha foz do Iguaçu polo sul meu azul luz do sentimento nu (Djavan)</p></li></ul><h2 data-corrido="sim">Cacofonia:</h2><p>vício de linguagem que promove uma união não harmônica de sons diferentes;</p><ul><li><p>Ex: Neste sábado, acontece a Cantata de Natal Municipal na Morada do Baís;</p><ul><li><p>“na Morada” pode ocasionar uma ambiguidade fonética;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'figuras-de-construcao',
  'FIguras de construção',
  'portugues',
  'comum',
  'Elipse, zeugma, hipérbato, silepse e as outras — o que a sintaxe faz de propósito.',
  '<h2 data-corrido="sim">Elipse:</h2><p>omissão de um termo que pode ser facilmente subentendido pelo contexto;</p><ul><li><p>Ex: Em seu novo carro, ele vai para a faculdade; [ele] vai de ônibus. (O segundo termo "ele" está subentendido);</p></li></ul><h2 data-corrido="sim">Zeugma:</h2><p>omissão de um termo que já foi mencionado anteriormente na frase;</p><ul><li><p>Ex: Um deles queria saber dos meus estudos; outro, se trazia coleção de selos. (O verbo "queria" está subentendido na segunda oração);</p></li></ul><h2 data-corrido="sim">Hipérbato:</h2><p>inversão da ordem direta de termos em uma oração ou de orações em um período;</p><ul><li><p>Exemplo: Está pronto o almoço. (Ordem direta: "O almoço está pronto.");</p></li></ul><h2 data-corrido="sim">Silepse:</h2><p>concordância que se dá com a ideia e não com a palavra gramatical, podendo ser de gênero, número ou pessoa;</p><h2 data-corrido="sim">Assíndeto:</h2><p>omissão da conjunção que liga termos semelhantes na oração;</p><h2 data-corrido="sim">Polissíndeto:</h2><p>repetição da conjunção para ligar termos semelhantes;</p><h2 data-corrido="sim">Anáfora:</h2><p>repetição de uma ou mais palavras no início de orações ou versos consecutivos;</p><h2 data-corrido="sim">Anacoluto:</h2><p>uma interrupção ou quebra na construção da frase;</p><ul><li><p>Ex: Eu, que era branca e linda, eis-me medonha e escura. (A estrutura se quebra com a inserção do "eis-me");</p></li></ul><h2 data-corrido="sim">Pleonasmo:</h2><p>A repetição desnecessária de uma ideia para dar ênfase;</p><ul><li><p>Ex: Entra pra dentro;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'figuras-de-pensamento',
  'Figuras de pensamento',
  'portugues',
  'comum',
  'Antítese, eufemismo, hipérbole e ironia — quando a ideia é que se desloca.',
  '<p>ocorrem quando há uma mudança na relação de ideias para expressar um significado mais intenso;</p><h2 data-corrido="sim">Antítese:</h2><p>aproximação de palavras ou ideias de sentidos opostos;</p><ul><li><p>Ex: "o ódio e o amor";</p></li></ul><h2 data-corrido="sim">Eufemismo:</h2><p>suavização de uma expressão;</p><ul><li><p>Ex: "O avô foi jogar xadrez com São Pedro" (em vez de dizer que morreu);</p></li></ul><h2 data-corrido="sim">Hipérbole:</h2><p>exagerar intencionalmente para enfatizar algo.</p><ul><li><p>Ex: "Estou morrendo de saudade";</p></li></ul><h2 data-corrido="sim">Ironia:</h2><p>uso de uma palavra ou expressão que diz o oposto do que se quer expressar;</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'fonetica',
  'Fonética',
  'portugues',
  'comum',
  'Fonemas e letras, dígrafos e dífonos, e os encontros vocálicos e consonantais.',
  '<ul><li><p>Fonemas: sons (vogais e consoantes);</p></li><li><p>Letras: grafias</p></li></ul><h2 data-corrido="sim">Dígrafos:</h2><p>sequência de duas letras que formam um único fonema (um som).</p><ul><li><p>Vocálicos: an, am, en, em, in, im, on, om, un, e um</p></li><li><p>Consonantais: ch, gu, lh, nh, qu, rr, sc, sç, ss, xc e xs.</p></li></ul><h2 data-corrido="sim">Dífonos:</h2><p>dois sons resultantes de apenas uma letra (x).</p><h2>Encontros vocálicos:</h2><ul><li><p>Ditongo: emissão de dois fonemas vocálicos (uma vogal e uma semivogal) em uma mesma sílaba.</p><ul><li><p>Crescente: <strong>semivogal + vogal</strong>. Ex: pátio;</p></li><li><p>Decrescente: <strong>vogal + semivogal</strong>. Ex: herói</p></li></ul></li><li><p>Tritongos: encontro de três sons vocálicos em uma mesma sílaba: <strong>semivogal + vogal + semivogal.</strong></p></li><li><p>Hiatos: encontro de duas vogais em uma palavra pronunciadas em sílabas diferentes.</p></li></ul><h2 data-corrido="sim">Encontros consonantais:</h2><p>sequência de duas ou mais consoantes juntas na mesma palavra, sem que haja uma vogal entre elas.</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'acentuacao',
  'Acentuação',
  'portugues',
  'comum',
  'Que terminação leva acento em cada tonicidade, mais os hiatos, o ter/vir e o acento diferencial.',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/acentuacao.webp" alt="Quadro de acentuação por tonicidade: monossílabo tônico e oxítona em a(s), e(s), o(s) — a oxítona também em em(ns) —, paroxítona em l, n, r, x, ã, ão, us, um(ns), om, on(s), ps, i(s) e ditongo oral crescente, e todas as proparoxítonas, com exemplos em cada linha." style="width:100%" data-largura="100%"></figure><ul><li><p>Acentuam-se os monossílabos tônicos terminados em:</p><ul><li><p>“a(s)”, “e(s)”, “o(s)”</p></li></ul></li><li><p>Acentuam-se as oxítonas terminadas em:</p><ul><li><p>“a(s)”, “e(s)”, “o(s)”, “em(ns)”;</p></li></ul></li><li><p>Acentuam-se as paroxítonas terminadas em:</p><ul><li><p>“l”, “n”, “r”, “x”, “ã”, “ão”, “us”, “um(ns)”, “om”, “on(s)”, “ps", “i(s)” e ditongo oral crescente (menos ei, oi);</p></li></ul></li><li><p>Acentuam-se todas as proparoxítonas;</p></li><li><p>São acentuados os hiatos:</p><ul><li><p>“i” e “u”. Ex: saída, saúde;</p></li><li><p>Exceções: hiato seguido de “nh” (rainha) e hiato precedido de ditongo (baiuca);</p></li></ul></li><li><p>Verbos “ter” e “vir” e derivados:</p><ul><li><p>Ele tem / eles têm</p></li><li><p>Ele vem / eles vêm</p></li><li><p>Ele mantém / eles mantêm</p></li><li><p>Ele intervém / eles intervêm;</p></li></ul></li><li><p>Acento diferencial: somente em “pôr/por”, “pôde/pode” e “fôrma/forma” (facultativo);</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ortografia',
  'Ortografia',
  'portugues',
  'comum',
  'Os quadros de cada fonema, o hífen, os porquês, mal e mau, onde e aonde, homônimos e parônimos.',
  '<h2>Fonema /s/:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/fonema-s-1.webp" alt="Quadro do fonema /s/, primeira parte: S em palavras de radicais terminados em sent, nd, rt, pel, corr, rg e no sufixo -ense; SS em radicais terminados em gred, ced e prim, verbos em tir ou meter, e na terminação -isse." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/fonema-s-2.webp" alt="Quadro do fonema /s/, segunda parte: C nos sufixos -ecer e -ice; Ç nos sufixos -aça(o), -iço(a), -uço(a), -ança e -ção; C ou Ç após ditongo; SC, SÇ, X e XC em palavras de razão etimológica." style="width:100%" data-largura="100%"></figure><h2>Fonema /z/:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/fonema-z.webp" alt="Quadro do fonema /z/: Z em derivadas de palavras com z, substantivos em -eza, sufixo -izar e verbos em -uzir; S em palavras terminadas em -esa, -isa, -oso(a), -ese, -ase, -ose, depois de ditongo, em derivadas de palavras com s e nas formas de pôr e querer; X em casos etimológicos." style="width:100%" data-largura="100%"></figure><h2>Fonema /ʒ/:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/fonema-j.webp" alt="Quadro do fonema /ʒ/: G em palavras terminadas em -ágio, -égio, -ígio, -ógio, -úgio e em -agem, -igem, -ugem (com as exceções lambujem e pajem); J em formas derivadas de verbos em -jar e em palavras de origem africana, tupi ou árabe." style="width:100%" data-largura="100%"></figure><h2>Fonema /ʃ/:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/fonema-x.webp" alt="Quadro do fonema /ʃ/: X após ditongo, após as sílabas iniciais en- e me-, e em palavras de origem indígena e africana; CH em palavras de origem latina, espanhola e francesa." style="width:100%" data-largura="100%"></figure><h2>Emprego do hífen:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/emprego-do-hifen.webp" alt="Quadro do hífen em quatro princípios: com qualquer prefixo antes de H; com prefixo terminado em vogal antes da mesma vogal; com prefixo terminado em consoante antes da mesma consoante; e sempre com além-, aquém-, ex-, pós-, pré-, pró-, recém-, bem-, sem- e vice-." style="width:100%" data-largura="100%"></figure><h2>Uso dos porquês:</h2><ul><li><p>Por que: pergunta;</p></li><li><p>Porque: resposta;</p></li><li><p>Por quê: fim da frase;</p></li><li><p>Porquê: substantivo;</p></li></ul><h2>Mal e mau:</h2><ul><li><p>Mau: adjetivo que se opõe a “bom”;</p><ul><li><p>É bom ser mau. O que o lado do bem tem de bom?</p></li></ul></li><li><p>Mal: advérbio que se opõe a “bem”;</p><ul><li><p>Ele foi mal no teste;</p></li></ul></li></ul><h2 data-corrido="sim">Onde:</h2><p>para indicar lugar estático, ausência de movimento;</p><ul><li><p>Ex: onde você estuda?</p></li></ul><h2 data-corrido="sim">Aonde:</h2><p>para expressar movimento de um lugar a outro;</p><ul><li><p>Ex: Aonde você foi?</p></li></ul><h2 data-corrido="sim">Homônimos:</h2><p>são palavras com significados diferentes, mas que apresentam a mesma grafia e/ou pronúncia;</p><ul><li><p>Perfeitos: com a mesma grafia e pronúncia;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/homonimos-perfeitos.webp" alt="Quadro de homônimos perfeitos, com os dois sentidos de amo, cedo, manga, são e verão." style="width:566px" data-largura="566px"></figure><ul><li><p>Homógrafos: grafia idêntica e pronúncia diferente;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/homonimos-homografos.webp" alt="Quadro de homônimos homógrafos, com o par aberto e fechado de acerto, almoço, colher, começo e jogo." style="width:567px" data-largura="567px"></figure><ul><li><p>Homófonos: pronúncia idêntica e grafia diferente;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/homonimos-homofonos.webp" alt="Quadro de homônimos homófonos: asso e aço, assento e acento, conserto e concerto, decente e descente, nós e noz, paço, passo e passa, remissão e remição, senso e censo, sessão, seção e cessão, tacha e taxa." style="width:571px" data-largura="571px"></figure><h2 data-corrido="sim">Parônimos:</h2><p>palavras parecidas em sua pronúncia e/ou representação gráfica que apresentam significados distintos.</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/paronimos.webp" alt="Quadro de oito pares parônimos com exemplo de uso: mas e mais, senão e se não, tampouco e tão pouco, demais e de mais, a fim de e afim, a princípio e em princípio, ao encontro de e de encontro a, em vez de e ao invés de." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'formacao-de-palavras',
  'Estrutura e processos de formação de palavras',
  'portugues',
  'comum',
  'Derivação, composição, neologismo, siglagem, abreviatura, hibridismo e onomatopeia.',
  '<h2 data-corrido="sim">Derivação:</h2><p>processo por meio do qual uma palavra primitiva deriva novas palavra;</p><ul><li><p>Prefixal: morfema antes do radical; Ex: infeliz;</p></li><li><p>Sufixal: morfema depois do radical; Ex: felizmente;</p></li><li><p>Prefixal e sufixal: infelizmente;</p></li><li><p>Parassintética: acréscimo de prefixo e sufixo sem possibilidade de retirá-los; Ex: anoitecer;</p></li><li><p>Regressiva (deverbal): redução de um palavra primitiva; Ex: falar → fala; voar → voo;</p></li><li><p>Imprópria: alteração da classe gramatical; Ex: o não do meu pai dói;</p></li></ul><h2 data-corrido="sim">Composição:</h2><p>junção de dois ou mais radicais;</p><ul><li><p>Justaposição: formação de palavras compostas cujos elementos se unem mantendo a forma dos radicais. Ex: manga-rosa, passatempo;</p></li><li><p>Aglutinação: formação de palavras em que duas ou mais palavras se juntam, e pelo menos uma delas sofre alteração fonética ou gráfica, como a perda de letras ou sons. Ex: planalto, embora, fidalgo;</p></li></ul><h2 data-corrido="sim">Neologismo:</h2><p>processo por meio do qual uma palavra resulta do emprego de palavras novas, derivadas ou formadas de palavras já existentes na mesma língua ou em outra;</p><ul><li><p>Ex: navegador (internet), <em>delivery</em>, mouse, futebol, etc.;</p></li></ul><h2 data-corrido="sim">Siglagem:</h2><p>processo morfológico de formar uma sigla a partir das letras iniciais de um grupo de palavras.</p><ul><li><p>Ex: INSS – Instituto Nacional do Seguro Social;</p></li></ul><h2 data-corrido="sim">Abreviatura:</h2><p>redução de uma palavra até o limite de sua compreensão;</p><ul><li><p>Ex: metrô (metroviário), foto (fotografia), pneu (pneumático);</p></li></ul><h2 data-corrido="sim">Hibridismo:</h2><p>palavras compostas ou derivadas por elementos de diferentes origens etimológicos;</p><ul><li><p>Ex: monóculo (grego “<em>mónos</em>” e latim “<em>oculos</em>”), burocracia (francês “<em>bureau</em>” e grego “<em>cracia</em>”);</p></li></ul><h2 data-corrido="sim">Onomatopeia:</h2><p>reprodução imitativa de sons.</p><ul><li><p>Ex: zunzum, toc-toc, tum-tum;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'morfossintaxe',
  'Morfossintaxe',
  'portugues',
  'comum',
  'Que função sintática cada classe assume: o substantivo, o adjetivo e os pronomes.',
  '<p>estudo das formas gramaticais (morfologia) e das relações combinatórias por elas exercidas em um sintagma ou em uma sentença (sintaxe);</p><h2 data-corrido="sim">Substantivo:</h2><p>núcleo sintático; núcleo informacional de uma construção nominal;</p><ul><li><p>Sujeito: aquele que pratica a ação do qual se fala;</p><ul><li><p>Ex: Chegaram atrasados os amigos (núcleo) de João;</p></li></ul></li><li><p>Objeto direto: complemento verbal sem preposição;</p><ul><li><p>Ex: Comprei uma bolsa (núcleo) de couro;</p></li></ul></li><li><p>Objeto indireto: complemento verbal com preposição;</p><ul><li><p>Ex: Preciso de bons conselhos (núcleo);</p></li></ul></li><li><p>Adjuntos adnominais: termo que acompanha ou caracteriza um substantivo</p><ul><li><p>Ex: Isto é brincadeira de criança (núcleo);</p></li></ul></li></ul><h2 data-corrido="sim">Adjetivo:</h2><p>possui 3 classificações sintáticas;</p><ul><li><p>Predicativo do sujeito: característica do sujeito;</p><ul><li><p>Ex: Elas são lindas;</p></li></ul></li><li><p>Predicativo do objeto: característica do objeto;</p><ul><li><p>Ex: Eu acho as minhas filhas (O.D.) lindas;</p></li></ul></li><li><p>Adjunto adnominal: vem junto ao substantivo;</p><ul><li><p>Ex: As minhas lindas filhas são adultas já;</p></li></ul></li></ul><h2>Pronomes:</h2><h3>Pessoais:</h3><ul><li><p>Retos: fazem papel de sujeito;</p><ul><li><p>Tu, ele(a), nós, vós, eles(as);</p></li></ul></li><li><p>Oblíquos: são complementos verbais OD ou OI;</p><ul><li><p>Me, mim, te, ti, o, a, lhe, se, nos, nós, ele;</p></li></ul></li></ul><h3 data-corrido="sim">Possessivos:</h3><p>sinteticamente, são classificados, na maioria das vezes, como <strong>adjuntos adnominais</strong>, acompanhando o substantivo;</p><ul><li><p>Ex: O meu gato fugiu;</p></li><li><p>Em algumas situações, o uso dos pronomes possessivos pode causar <strong>ambiguidade</strong>;</p><ul><li><p>Ex: A aluna perguntou ao professor se ele encontrou o seu livro;</p></li></ul></li></ul><h3>Demonstrativos:</h3><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/pronomes-demonstrativos.webp" alt="Quadro dos pronomes demonstrativos com exemplo de uso: as formas invariáveis isto, isso e aquilo, e as variáveis este(s)/esta(s), esse(s)/essa(s) e aquele(s)/aquela(s)." style="width:100%" data-largura="100%"></figure><ul><li><p>“Este(s)” e “esta(s)” atuam com <strong>função catafórica</strong>, pois fazem referência a informações que estão localizadas após eles.</p></li><li><p>“Esse(s)” e “essa(s)” atuam com <strong>função anafórica</strong>, pois retoma informações localizadas anteriormente a ele;</p></li></ul><h3 data-corrido="sim">Relativos:</h3><p>retomam termos que já apareceram no texto;</p><ul><li><p>“Que”: refere-se a pessoas, seres em geral, objetos, etc.;</p></li><li><p>“Quem”: faz referência a seres humanos;</p></li><li><p>“Onde”: sempre faz referência a lugar e é equivalente à forma “em que”;</p></li><li><p>“Como” e “quando”: equivalem a “pelo(a) qual” e “em que”, demarcando ideias de modo e tempo, respectivamente;</p></li><li><p>“Cujo(s)” e “cuja(s)”: demarcam relação de posse;</p></li><li><p>“Quanto(s)” e “quanta(s)”: são usados após pronomes indefinidos, como tudo, todo(s), toda(s), tanto(s), tanta(s);</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'classes-gramaticais',
  'Classes gramaticais',
  'portugues',
  'comum',
  'As nove classes e a função básica de cada uma, entre variáveis e invariáveis.',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/classes-gramaticais.webp" alt="Quadro das classes gramaticais e suas funções básicas: entre as variáveis, substantivo, adjetivo, artigo, numeral, pronome e verbo; entre as invariáveis, advérbio, preposição e conjunção." style="width:100%" data-largura="100%"></figure><ul><li><p>Variáveis: todas que apresentam algum tipo de flexão (gênero, número e grau);</p></li><li><p>Invariáveis: não apresentam nenhum tipo de flexão;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'interjeicao',
  'Interjeição',
  'portugues',
  'comum',
  'A classe que é uma frase inteira numa palavra, e as dez emoções que ela marca.',
  '<p>palavras que expressam sentimentos e sensações. É uma classe especial que atua como uma frase-vocábulo ou marcador conversacional (uma palavra que funciona como frase com sentido completo);</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/interjeicoes.webp" alt="Quadro das interjeições por classificação, com exemplos: alegria, aplauso, alívio, desejo, surpresa, dor, tristeza, silêncio, medo e invocação." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'relacoes-entre-as-classes-gramaticais',
  'Relações entre as classes gramaticais',
  'portugues',
  'comum',
  'Como as classes se organizam em torno de um núcleo no sintagma nominal.',
  '<ul><li><p>Cada classe gramatical estabelece determinadas relações com as demais em <strong>sintagmas nominais</strong> (sequência de palavras organizadas em torno de um núcleo);</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/sintagma-nominal.webp" alt="Três sintagmas nominais destrinchados em especificador, núcleo e modificador: “A câmara municipal” (artigo, substantivo, adjetivo), “Três carteiras novas” (numeral, substantivo, adjetivo) e “Meu novo emprego” (pronome, adjetivo, substantivo)." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/sintagma-na-sentenca.webp" alt="A frase “Os estudantes discutiram rapidamente as questões” dividida em sujeito, núcleo da sentença, modificador do verbo e complemento verbal, com a classe de cada palavra embaixo." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/relacoes-entre-as-classes.webp" alt="Diagrama com o substantivo e o verbo como dois centros: pronome, artigo, numeral e adjetivo apontam para o substantivo; o advérbio aponta para o verbo, para o adjetivo e para si mesmo; preposição e conjunção envolvem os dois centros, e a interjeição fica de fora, sozinha." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'vozes-verbais',
  'Vozes Verbais',
  'portugues',
  'comum',
  'Ativa, passiva (analítica e sintética) e reflexiva — quem age e quem sofre a ação.',
  '<h2 data-corrido="sim">Voz ativa:</h2><p>sujeito gramatical é o agente da ação;</p><ul><li><p>Ex: Vi o menino no parque. A criança arrumou os brinquedos.</p></li></ul><h2 data-corrido="sim">Voz passiva:</h2><p>sujeito gramatical é o paciente de uma ação praticada pelo agente da passiva;</p><ul><li><p>Analítica: usa-se a locução verbal formada pelos verbos ser/estar/ficar + particípio (normalmente é o verbo ser);</p><ul><li><p>Ex: Os brinquedos foram arrumados pela criança.</p></li></ul></li><li><p>Sintética: usa-se o verbo transitivo direto (VTD) ou transitivo direto e indireto (VTDI) acompanhado do pronome apassivador se. O sujeito vem explícito e o verbo concorda com ele em número e pessoa.</p><ul><li><p>Ex: Arrumaram-se os brinquedos. Adotaram-se dois cachorros.</p></li></ul></li></ul><h2 data-corrido="sim">Voz reflexiva:</h2><p>o sujeito gramatical é ao mesmo tempo, o agente e o paciente da ação;</p><ul><li><p>Ex: Vi-me ao espelho.</p></li><li><p>Recíproca: ocorre quando o verbo se encontra no plural (normalmente) e há dois seres ou mais praticando a mesma ação verbal;</p><ul><li><p>Ex: Os jogadores se insultaram durante a partida. Nós nos veremos na escola.</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'adverbios-e-adjuntos-adverbiais',
  'Advérbios e Adjuntos Adverbiais',
  'portugues',
  'comum',
  'As nove circunstâncias, com os advérbios e as locuções que dão cada uma.',
  '<p>classe gramatical e função sintática exercida por eles, respectivamente, que adiciona uma circunstância à oração;</p><table><tbody><tr><th><p>CLASSIFICAÇÃO</p></th><th><p>ADVÉRBIOS</p></th><th><p>LOCUÇÃO ADVERBIAL</p></th></tr><tr><td><p>Causa</p></td><td><p>Pois.</p></td><td><p>Por causa de; devido a; graças a; por; em virtude de; em razão de; por.</p></td></tr><tr><td><p>Afirmação</p></td><td><p>Certamente; realmente; sim; decerto.</p></td><td><p>Com certeza; sem dúvida; de fato.</p></td></tr><tr><td><p>Negação</p></td><td><p>Absolutamente; não; nunca; jamais</p></td><td><p>De forma alguma; de modo algum.</p></td></tr><tr><td><p>Dúvida</p></td><td><p>Porventura; possivelmente; talvez.</p></td><td><p>Por certo; quem sabe.</p></td></tr><tr><td><p>Intensidade</p></td><td><p>Bastante; muito; pouco; bem; demais; mais; menos; quanto; tanto; tão</p></td><td><p>De muito; de todo; por completo; por demais.</p></td></tr><tr><td><p>Modo</p></td><td><p>Bem; depressa; devagar; mal; melhor; rapidamente; simplesmente</p></td><td><p>À toa; à vontade; ao contrário; de regra; em silêncio; às pressas.</p></td></tr><tr><td><p>Lugar</p></td><td><p>Abaixo; acima; aqui; aí; aquém; além; atrás; através; dentro; fora; perto; onde</p></td><td><p>À direita; à esquerda; ao lado; de perto; em cima; por ali; por aqui; por perto.</p></td></tr><tr><td><p>Tempo</p></td><td><p>Agora; ainda; ontem; hoje; antes; depois; breve; cedo; então; nunca; sempre</p></td><td><p>À noite; à tarde; de dia; de manhã; de vez em quando; em breve.</p></td></tr><tr><td><p>Meio</p></td><td><p></p></td><td><p>Por meio de; mediante; graças a; através.</p></td></tr></tbody></table>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'conjuncoes-coordenativas-e-subordinativas',
  'Conjunções Coordenativas e Subordinativas',
  'portugues',
  'comum',
  'As cinco coordenadas em A³CE e as nove adverbiais em C⁶FPT, cada uma com exemplo.',
  '<ul><li><p>A diferença principal é que orações coordenadas são independentes e têm sentido completo sozinhas, enquanto orações subordinadas são dependentes da oração principal para terem sentido.</p></li></ul><h2 data-corrido="sim">Coordenadas:</h2><p><span data-type="inline-math" data-latex="A^{3}CE"></span></p><table><tbody><tr><th><p>Classificação</p></th><th><p>Explicação</p></th><th><p>Quais são?</p></th><th><p>Exemplo</p></th></tr><tr><td><p>Aditivas</p></td><td><p>adiciona uma informação</p></td><td><p>e; nem; mas também…</p></td><td><p>Estudei para a prova <strong>e</strong> revisei todo o conteúdo</p></td></tr><tr><td><p>Adversativas</p></td><td><p>contradiz uma opinião</p></td><td><p>mas; porém; contudo…</p></td><td><p>Queria sair, <strong>mas </strong>precisava terminar o trabalho.</p></td></tr><tr><td><p>Alternativas</p></td><td><p>escolha/realização de duas ou mais ações</p></td><td><p>ou…ou; ora…ora</p></td><td><p><strong>Ou </strong>você arruma o seu quarto, <strong>ou </strong>não irá à festa</p></td></tr><tr><td><p>Conclusiva</p></td><td><p>resultado/ consequência</p></td><td><p>portanto; logo; pois</p></td><td><p>Estudei bastante, <strong>portanto </strong>devo tirar uma boa nota</p></td></tr><tr><td><p>Explicativa</p></td><td><p>motivo/explicação</p></td><td><p>que; porque; pois…</p></td><td><p>Não fui à aula, <strong>porque </strong>estava me sentindo mal</p></td></tr></tbody></table><h2>Subordinadas:</h2><p>Existem 2 tipos:</p><h3 data-corrido="sim">integrantes:</h3><p>que/se</p><h3 data-corrido="sim">adverbiais:</h3><p><span data-type="inline-math" data-latex="C^{6}FPT"></span></p><ul><li><p><strong>Causal:</strong> faltei hoje de manhã, <strong>porque</strong> estava chovendo</p><ul><li><p>motivo de um fato/o porque aquilo aconteceu</p></li><li><p>Exemplos: porque, pois, porquanto, visto que, já que…</p></li></ul></li><li><p><strong>Concessiva</strong>: <strong>embora</strong> esteja chovendo, irei à praia</p><ul><li><p>oposição, concessão</p></li><li><p>Exemplos: embora, ainda que, mesmo que…</p></li></ul></li><li><p><strong>Comparativa</strong>: ele é <strong>tão</strong> esperto, <strong>quanto</strong> o seu amigo</p><ul><li><p>comparação entre duas coisas</p></li><li><p>Exemplos: como, assim como, mais do que, tal qual…</p></li></ul></li><li><p><strong>Condicional</strong>: <strong>se</strong> você lavar a louça, sairá mais tarde</p><ul><li><p>condição</p></li><li><p>Exemplos: se, caso, desde que, contanto que…</p></li></ul></li><li><p><strong>Consecutiva</strong>: estudei <strong>tanto</strong>, <strong>que</strong> gabaritei o simulado</p><ul><li><p>consequência/resultado</p></li><li><p>Exemplos: tanto que, de modo que, de forma que, tal que…</p></li></ul></li><li><p><strong>Conformativa</strong>: choveu, <strong>conforme</strong> a meteorologia</p><ul><li><p>É meio que quando as duas orações concordam uma com a outra, elas apresentam ideias parecidas. O que a oração principal disse realmente era verdade/aconteceu</p></li><li><p>Exemplos: conforme, segundo, consoante…</p></li></ul></li><li><p><strong>Final</strong>: estudarei, <strong>a fim de que</strong> passe o ano</p><ul><li><p>Objetivo, com que finalidade</p></li><li><p>Exemplos: para que, a fim de que…</p></li></ul></li><li><p><strong>Proporcional</strong>: <strong>quanto</strong> mais estudo, <strong>mais</strong> aprendo</p><ul><li><p>proporção, na mesma medida</p></li><li><p>Exemplos: à medida que, ao passo que…</p></li></ul></li><li><p><strong>Temporal </strong>quando o inverno chegar eu quero estar junto a ti</p><ul><li><p>É uma relação de tempo, indica que as oração ocorreram ao mesmo tempo, uma antes ou depois da outra e assim por diante…</p></li><li><p>Exemplos: quando, enquanto, assim que, antes que…</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sujeito',
  'Sujeito',
  'portugues',
  'comum',
  'Simples, composto, oculto, indeterminado e inexistente.',
  '<p>parte da oração sobre a qual a restante oração se refere, ou seja, de quem ou do que se fala;</p><h2 data-corrido="sim">Simples:</h2><p>tem apenas um núcleo.</p><ul><li><p>Ex: O paciente foi atendido.</p></li></ul><h2 data-corrido="sim">Composto:</h2><p>tem mais do que um núcleo.</p><ul><li><p>Ex: Mousses e brownies são os meus doces preferidos.</p></li></ul><h2 data-corrido="sim">Oculto (elíptico, desinencial ou implícito):</h2><p>quando é identificado pela desinência verbal ou pelo contexto.</p><ul><li><p>Ex: (Nós) Andamos a tarde toda.</p></li></ul><h2 data-corrido="sim">Indeterminado:</h2><p>não se pode determinar quem realizou a ação.</p><ul><li><p>Ex: Opinam sobre tudo.</p></li></ul><h2 data-corrido="sim">Inexistente:</h2><p>ocorre em orações sem sujeito, geralmente com o verbo haver no sentido de existir, ou com verbos que indicam fenômenos da natureza.</p><ul><li><p>Ex: Amanheceu.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'predicado',
  'Predicado',
  'portugues',
  'comum',
  'Verbal, nominal e verbo-nominal — quantos núcleos e de que tipo.',
  '<h2 data-corrido="sim">Verbal:</h2><p>o núcleo é um verbo que indica uma ação;</p><ul><li><p>Ex: "O cachorro rosnou para o desconhecido."</p></li></ul><h2 data-corrido="sim">Nominal:</h2><p>o núcleo é um predicativo do sujeito, ou seja, uma qualidade ou estado do sujeito, ligado por um verbo de ligação;</p><ul><li><p>Ex: "Os alunos estão apressados." (Verbo de ligação: estão; Núcleo: apressados)</p></li></ul><h2 data-corrido="sim">Verbo-nominal:</h2><p>possui dois núcleos: um verbo de ação e um predicativo do sujeito;</p><ul><li><p>Ex: "Os jurados consideraram o réu culpado." (Verbo de ação: consideraram; Predicativo do sujeito: culpado)</p></li></ul>',
  null
)
on conflict (slug) do nothing;

-- ============================================
-- Guardas
-- ============================================
do $$
declare
  n_novos int;
  n_figuras int;
  n_titulos int;
begin
  select count(*) into n_novos
    from resumos
   where materia_slug = 'portugues' and processo_slug = 'comum';
  if n_novos <> 20 then
    raise exception 'esperava 20 resumos de Língua Portuguesa em comum, encontrei %', n_novos;
  end if;

  select count(*) into n_figuras
    from (select regexp_matches(corpo, '<figure', 'g') from resumos
           where materia_slug = 'portugues' and processo_slug = 'comum') x;
  if n_figuras <> 17 then
    raise exception 'esperava 17 figuras na Língua Portuguesa, encontrei %', n_figuras;
  end if;

  select count(*) into n_titulos
    from (select titulo from resumos group by titulo having count(*) > 1) x;
  if n_titulos <> 0 then
    raise exception '% títulos repetidos no acervo', n_titulos;
  end if;
end $$;

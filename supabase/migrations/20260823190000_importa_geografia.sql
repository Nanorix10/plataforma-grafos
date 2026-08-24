-- Importa a Geografia, vinda de "Materias e conteúdos feitos/Geografia.docx".
--
-- Trinta e um resumos e trinta figuras. É a matéria inteira do documento, da
-- cartografia à hidrografia, passando por tectônica, solos, indústria, clima e
-- energia. **Geografia não tinha uma linha de conteúdo no site** — só os dois
-- sumários de edital que entraram hoje de manhã.
--
-- `processo_slug = 'comum'` pelo mesmo motivo da Literatura: o documento-mestre
-- é o material por disciplina, não por prova, e placa tectônica cai nos três
-- vestibulares. Ver a decisão 1c.
--
-- Os trinta e um ficam na raiz. O documento os escreve como irmãos, e pendurar
-- uns nos outros seria inferir hierarquia que o autor não escreveu (decisão 9).
--
-- ## As trinta figuras
--
-- Todas em `public/img/resumos/geografia/`, WebP q82: **7,76 MB no documento,
-- 1,25 MB no repositório**. Nenhuma virou texto ou fórmula — aqui o desenho É a
-- explicação em todos os casos: as três superfícies de projeção com o mapa que
-- cada uma produz, o corte da Terra com os modelos estático e dinâmico lado a
-- lado, os blocos-diagrama dos três movimentos de placa, o mapa batimétrico da
-- dorsal mesoatlântica, os seis climogramas e as duas cartas de massas de ar.
--
-- Os nomes descrevem o que a figura MOSTRA, não o tópico onde ela está:
-- `horst-e-graben`, `vale-do-rift`, `partes-de-um-rio`. Os seis climogramas são
-- `climograma-<clima>`; a cidade de cada um fica no `alt`, que é onde ela
-- informa sem virar nome de arquivo comprido.
--
-- ## O que muda de FORMA
--
-- Mesmo mapeamento das outras migrations de hoje, tirado de comparar o `.docx`
-- da 1ª etapa do PAS UEM com o que já estava no banco: nível 0 em negrito vira
-- título e o texto após os dois pontos vira o `<p>` de abertura; nível 1 com
-- definição vira `<h2 data-corrido="sim">`; nível 1 ou 2 que só apresenta a
-- lista abaixo vira `<p>`; nível 2 que abre seção vira `h3`; daí para baixo a
-- estrutura vira lista aninhada.
--
-- O sublinhado que abre um item vira texto puro (o `:` já marca o termo) e o do
-- meio da frase vira `<strong>`. **Uma exceção:** quando o sublinhado cobre a
-- definição INTEIRA logo após os dois pontos do título — "Vulcanismo: toda ação
-- relacionada aos vulcões" —, ele também vira texto puro. Grifar o `<p>` de
-- abertura inteiro não destaca nada, só engrossa a linha.
--
-- Os termos em itálico do autor (<em>El Niño</em>, <em>La Niña</em>) vieram
-- como `<em>`, como os latinismos da Literatura.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"GNSS - (Global Positioning System)"** está no título de um resumo, e as
--   duas siglas não são a mesma coisa: GPS é o sistema americano, GNSS é o nome
--   genérico — que o próprio resumo explica logo abaixo, ao listar Glonass,
--   Galileu e Bei Doun ao lado do GPS.
-- - As quatro características do Neoliberalismo ("Diminuição do Estado mínimo",
--   "Desburocratização…", "Privatização…", "Corte de gastos públicos") estão em
--   nível 0 no documento, irmãs do próprio título em vez de filhas dele. Entram
--   como a lista de abertura do resumo, que é onde elas já estavam sendo lidas.
-- - "Diminuição do Estado mínimo" — o neoliberalismo defende o Estado mínimo,
--   então "diminuição do Estado" ou "Estado mínimo", não os dois.
-- - "São os pinheiros da industrialização", por pioneiros.
-- - "Clicólise", por ciclólise.
-- - "Bei Doun", por BeiDou.
-- - "Custo elevado de implementação de baixo de manutenção", no Ferroviário.
-- - "Depender em grande parte do uso do contêiner", na Intermodalidade.
-- - "Guerra do Yon Kippur", por Yom Kippur, nas duas vezes em que aparece.
-- - "Perda de fertilidade, de massa do sol", por solo, na Desertificação.
-- - "Colagem - uso de calcário no solo", por calagem.
-- - "Brasil (maior parte])", com um colchete sobrando, no SAG-Guaraní.
-- - "Seguem o princípio da a isostasia", com o artigo repetido.
-- - "Criada por Alfred Wegener" — a tectônica de placas é posterior a ele; o que
--   Wegener criou foi a deriva continental, como o próprio item diz em seguida.
-- - "Oceano Pacifico" sem acento; "pré-colombinos" por pré-colombianos;
--   "Bento Rodriguez" por Rodrigues; "Sta. Barbara" sem acento; "Africa" sem
--   acento na projeção de Peters; "elaborar" por elaboração, na abertura.
-- - "Tchernozion", grafia que varia muito em português (tchernozion,
--   chernozem); ficou a do documento.
-- - O ponto e vírgula que fecha "El Niño e La Niña;" não foi para o título do
--   resumo. Título não é item de lista, e o sinal apareceria na barra lateral e
--   no mapa apontando para nada — é a mesma razão pela qual `lib/titulos.ts` já
--   descarta os dois pontos do fim de um grafo.
--
-- Não há fórmula nem `[[wikilink]]` nesta leva, então não há
-- `update corpo = corpo` no fim. `on conflict (slug) do nothing` deixa rodar de
-- novo sem duplicar.
--
-- ## Retificação
--
-- Esta migration entrou creditando ao autor dois erros que eram MEUS:
-- "aqualidade" e "linhademontagem" saíram colados porque o extrator com que li
-- o `.docx` apagava o espaço quando ele caía sozinho num run sublinhado. Havia
-- um terceiro caso, "Just in Time- carros". Os três estão consertados na
-- `20260823200000_conserta_espacos_perdidos_na_geografia`, que explica o
-- defeito e o alcance da varredura.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'superficies-das-projecoes-cartograficas',
  'Superfícies das projeções cartográficas',
  'geografia',
  'comum',
  'Cilíndrica, cônica e azimutal — que latitude cada superfície acerta e qual ela distorce.',
  '<p>cada formato pode facilitar a elaborar e privilegiar alguma distorção;</p><h2>Cilíndrico:</h2><ul><li><p>Ideal para baixas latitudes, altas latitudes muito distorcidas;</p></li><li><p>Paralelos e meridianos formam ângulos retos;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/projecao-cilindrica.webp" alt="Globo dentro de um cilindro e o planisfério que ele produz, com paralelos e meridianos em ângulo reto e o Brasil em destaque." style="width:100%" data-largura="100%"></figure><h2>Cônico:</h2><ul><li><p>Ideal para médias latitudes, distorce altas e baixas;</p></li><li><p>Paralelos são curvados e meridianos são angulados;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/projecao-conica.webp" alt="Globo dentro de um cone e o mapa em leque que ele produz, com os paralelos curvados." style="width:528px" data-largura="528px"></figure><h2>Azimutal/polar:</h2><ul><li><p>Ideal para altas latitudes, só é possível detalhar um polo por vez;</p></li><li><p>Paralelos formam círculos e meridianos formam linhas anguladas;</p></li><li><p>O emblema da ONU utiliza essa projeção.</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/projecao-azimutal.webp" alt="Globo tangente a um plano e o mapa circular centrado no polo sul que ele produz, com os paralelos em círculos concêntricos." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'projecoes-cartograficas-classicas',
  'Projeções cartográficas clássicas',
  'geografia',
  'comum',
  'Mercator, Peters e Robinson — e o que cada uma quis dizer no seu tempo.',
  '<p>cada uma possui conteúdo histórico próprio;</p><h2 data-corrido="sim">Mercator:</h2><p>cilíndrica (altas latitudes distorcidas) e conforme;</p><ul><li><p>Elaborada no contexto das <strong>grandes navegações</strong> (séc. XVI); <strong>eurocêntrica</strong>.</p></li></ul><h2 data-corrido="sim">Peters:</h2><p>cilíndrica e equivalente;</p><ul><li><p>Contexto da Guerra Fria e Pan-africanismo; <strong>terceiro mundista</strong>, Africa com destaque;</p></li><li><p>Critica a projeção de Mercator;</p></li></ul><h2 data-corrido="sim">Robinson:</h2><p>pseudo cilíndrica e afilática;</p><ul><li><p>Função didática e acadêmica;</p></li><li><p>Criada em 1960;</p></li><li><p>Projeção do mapa-múndi;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'gnss',
  'GNSS - (Global Positioning System)',
  'geografia',
  'comum',
  'Os quatro sistemas de localização por satélite e os três segmentos que todos têm.',
  '<p>sistema de localização global; alguns países tem seu próprio sist. de localização:</p><ul><li><p>GPS: EUA;</p></li><li><p>Glonass: Rússia;</p></li><li><p>Galileu: Europa;</p></li><li><p>Bei Doun: China;</p></li><li><p>Todo GNSS possui 3 segmentos:</p></li><li><p>espacial;</p></li><li><p>controle;</p></li><li><p>usuário.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'neoliberalismo',
  'Neoliberalismo',
  'geografia',
  'comum',
  'O que substituiu o keynesianismo, por onde entrou e quem o formulou.',
  '<ul><li><p>Diminuição do Estado mínimo;</p></li><li><p>Desburocratização e desregulação do mercado e trabalho;</p></li><li><p>Privatização de empresas estatais;</p></li><li><p>Corte de gastos públicos;</p></li></ul><ul><li><p>Substituiu o keynesianismo (que gerava inflação, déficit público e retração do PIB);</p></li><li><p>Foi implementado pela 1ª vez na América no Chile (governo ditatorial de Augusto Pinochet, década de 1970);</p></li><li><p>No contexto de Guerra Fria, os responsáveis por disseminar os ideais neoliberais foram os EUA (presidente Ronald Reagan) e Inglaterra (1ª ministra Margaret Thatcher);</p></li><li><p>No Brasil, o neoliberalismo chegou na década de 1990 (governo Collor);</p></li><li><p>Principais economistas do neoliberalismo:</p><ul><li><p>Hayek (escola de Chicago);</p></li><li><p>Friedman (escola de Chicago);</p></li><li><p>Mises (Escola Austríaca).</p></li></ul></li><li><p>Surgem organizações internacionais com foco na economia:</p><ul><li><p>FMI;</p></li><li><p>OMC: regula a economia global e busca eliminar o protecionismo.</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'globalizacao',
  'Globalização',
  'geografia',
  'comum',
  'A fábula e a perversidade — o que ela abre e quem ela deixa de fora.',
  '<p>Pontos positivos: (fabula)</p><ul><li><p>Educação, informações, compras, trabalhos, interação, etc.</p></li></ul><p>Pontos negativos: (perversidade)</p><ul><li><p>Exclusão digital ou excluídos digitais: pessoas que não tem acesso às ferramentas de globalização;</p></li><li><p>Perdem chances de emprego e estudo.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'blocos-economicos',
  'Blocos econômicos e suas características',
  'geografia',
  'comum',
  'USMCA, Mercosul e União Europeia — três graus diferentes de integração.',
  '<h2 data-corrido="sim">USMCA:</h2><p>Zona de livre comércio;</p><ul><li><p>Antigo Nafta;</p></li><li><p>Mudança feita no 1º governo Trump 2018; mantida nos mesmos moldes por Biden 2020</p></li><li><p>Promoveu maior protecionismo aos EUA;</p></li><li><p>Não há livre circulação;</p></li></ul><h2 data-corrido="sim">Mercosul:</h2><p>União aduaneira (TEC);</p><ul><li><p><strong>Não é um mercado comum</strong>;</p></li><li><p><strong>A TEC não está implementada de forma igual;</strong></p></li><li><p>Fundadores: Brasil, Argentina, Paraguai e Uruguai;</p><ul><li><p>Venezuela está suspensa atualmente;</p></li><li><p>Bolívia entrou no bloco por último em 2024;</p></li></ul></li><li><p>Brasil é muito beneficiado pelos acordos do Mercosul;</p></li><li><p>Há previsão de melhora nos indicadores econômicos devido à rota oceânica.</p></li></ul><h2 data-corrido="sim">União Europeia:</h2><p>União política e monetária</p><ul><li><p>Bloco mais antigo e mais desenvolvida;</p></li><li><p>União política pelo Parlamento Europeu;</p></li><li><p>Possui 27 membros;</p></li><li><p>Criado a partir do Tratado de Maastricht;</p></li><li><p>Toma decisões sobre questões migratórias que devem ser seguidos pelos seus membros (um dos motivos para o Brexit)</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'camadas-da-terra',
  'Camadas da Terra',
  'geografia',
  'comum',
  'O modelo estático, por composição, e o dinâmico, por comportamento — o mesmo planeta cortado de dois jeitos.',
  '<p>duas formas de classificar:</p><h2>Estática:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/camadas-da-terra.webp" alt="Corte da Terra em fatia, com o modelo estático à esquerda (crosta, manto superior e inferior, núcleo) e o dinâmico à direita (litosfera, astenosfera, mesosfera, núcleo externo e interno), com as profundidades em quilômetros." style="width:348px" data-largura="348px"></figure><ul><li><p>Crosta;</p></li><li><p>Manto;</p><ul><li><p>Superior;</p></li><li><p>Inferior;</p></li></ul></li><li><p>Núcleo;</p><ul><li><p>Externo</p></li><li><p>Interno</p></li></ul></li></ul><h2>Dinâmica:</h2><ul><li><p>Litosfera - Placas;</p></li><li><p>Astenosfera - Convecção do magma;</p></li><li><p>Mesosfera;</p></li><li><p>Núcleo;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'teoria-da-tectonica-de-placas',
  'Teoria da tectônica de placas',
  'geografia',
  'comum',
  'A deriva continental de Wegener, os vinte anos de descrédito e a dorsal que lhe deu razão.',
  '<ul><li><p>Criada por Alfred Wegener e inicialmente chamada de “deriva continental”;</p><ul><li><p>Teoria da Pangeia;</p></li></ul></li><li><p>Para chegar a essa conclusão fez estudos pedológicos(solos), geológicos, formato e fósseis de plantas.</p><ul><li><p>Costa da América do Sul (leste) e na Costa Africana (Oeste);</p></li></ul></li><li><p>Após concluir a pesquisa, a academia não aceitou integralmente seu estudo;</p><ul><li><p>Ficou em descrédito por 20 anos;</p></li><li><p><strong>Havia limitações tecnológicas</strong> na época dos seus estudos;</p></li></ul></li><li><p>Na Guerra Fria foi descoberta a<strong> dorsal mesoatlântica</strong>, concluindo que a teoria de Wegener estava correta;</p><ul><li><p>Levou a descoberta das placas tectônicas e do movimento de convecção do magma;</p></li></ul></li><li><p><strong>As placas possuem direcionamento, mas não estão a deriva;</strong></p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'movimento-de-conveccao-do-magma',
  'Movimento de convecção do magma',
  'geografia',
  'comum',
  'O motor que move as placas: a diferença de densidade do magma da astenosfera.',
  '<ul><li><p>É o movimento que direciona as <strong>placas litosféricas</strong> sobre a <strong>astenosfera (líquida)</strong>;</p></li><li><p>O movimento das placas é baseado na <strong>diferença de densidade do magma da astenosfera;</strong></p></li><li><p>O movimento das placas é contínuo, mesmo após algum choque;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/conveccao-do-magma.webp" alt="Corte do manto sob o oceano com a célula de convecção: material ascendente na dorsal, resfriamento nas laterais e retorno à zona de alta temperatura, com uma ilha vulcânica à esquerda." style="width:592px" data-largura="592px"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'movimento-de-placas',
  'Movimento de placas',
  'geografia',
  'comum',
  'Orogênicos e epirogênicos: os que se encontram de lado e os que sobem e descem no lugar.',
  '<ul><li><p>Ao todo há 2 tipos de movimentos de placas;</p></li></ul><h2 data-corrido="sim">Orogênicos:</h2><p>horizontais</p><h3>Convergente:</h3><ul><li><p>Também chamado de destrutivo;</p></li><li><p>Encontro de placas;</p></li><li><p>Resultados:</p><ul><li><p>Dobramentos modernos</p></li><li><p>Subducção de placa</p></li><li><p>Soerguimento de placa</p></li><li><p>Formação de fossas submarinas (menos no encontro de duas placas continentais)</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/movimento-convergente.webp" alt="Bloco-diagrama de duas placas convergentes: a oceânica mergulha sob a continental e o magma sobe até a cadeia de montanhas." style="width:567px" data-largura="567px"></figure><h3>Divergente:</h3><ul><li><p>Separação de placas;</p></li><li><p>Também chamado de construtivo;</p></li><li><p>“Constrói” rochas, montanhas e solos;</p></li><li><p>Grandes fendas são abertas, formando vulcões e fossas;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/movimento-divergente.webp" alt="Bloco-diagrama de duas placas divergentes, com as setas apontando para lados opostos e o magma subindo pela fenda entre elas." style="width:542px" data-largura="542px"></figure><ul><li><p>Ex: Dorsal Mesoatlântica</p><ul><li><p>Sul e Norte Americanas</p></li><li><p>Africana e Euroasiática;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/dorsal-mesoatlantica.webp" alt="Mapa batimétrico do Atlântico com a Dorsal Mesoatlântica correndo de norte a sul e os limites das placas Norte-Americana, Sul-Americana, Africana e Eurasiana." style="width:100%" data-largura="100%"></figure><ul><li><p>Ex: Vale do Rift/Rift Valley</p><ul><li><p>Africana e Arábica afastando-se;</p></li><li><p>Chifre da África;</p></li><li><p>Concentração de vulcões</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/vale-do-rift.webp" alt="Mapa do leste africano com a zona do Rift em traço interrompido, o Mar Vermelho separando a placa Africana da Arábica e os vulcões marcados em triângulo." style="width:454px" data-largura="454px"></figure><h3>Tangencial</h3><ul><li><p>Também chamado de conservativo;</p></li><li><p>Alto risco de desastre;</p></li><li><p>Há dois bons exemplos</p><ul><li><p>Placa da Anatólia</p></li><li><p>Possui contato com outras 3 placas: helênica, arábica e africana;</p></li><li><p>Terremoto em 2023 na Turquia;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/movimento-tangencial.webp" alt="Bloco-diagrama de duas placas deslizando lado a lado, com as setas amarelas apontando em sentidos opostos ao longo da falha." style="width:409px" data-largura="409px"></figure><h2 data-corrido="sim">Epirogênicos:</h2><p>verticais</p><ul><li><p>Ocorrem em partes de uma placa, formando depressões e planaltos, sem choque de placas;</p></li><li><p>Horst: soerguimento ou elevação (epirogênese positiva);</p></li><li><p>Graben: subducção ou rebaixamento (epirogênese negativa);</p></li><li><p>Seguem o princípio da a <strong>isostasia</strong>: o equilíbrio entre diferentes massas da crosta terrestre sobre a astenosfera, semelhante ao equilíbrio de blocos de gelo flutuando na água.</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/horst-e-graben.webp" alt="Corte do relevo com os blocos de falha: o horst erguido entre duas falhas e o graben rebaixado, com as setas indicando o sentido do movimento." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/isostasia.webp" alt="Dois blocos mostrando a isostasia: em cima, o peso do gelo afunda a crosta; embaixo, derretido o gelo, a superfície retorna ao nível anterior." style="width:482px" data-largura="482px"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'formacao-das-rochas',
  'Processo de formação das rochas e suas fases (tipos de rochas)',
  'geografia',
  'comum',
  'Ígnea, metamórfica e sedimentar — como cada uma se forma e o que se acha dentro dela.',
  '<ul><li><p>Rochas são compostas por minerais;</p></li><li><p>Forma, estrutura, cor… são dadas pelos minerais;</p><ul><li><p>Ex: Feldspato, pirita, quartzo…</p></li></ul></li><li><p>As rochas são divididas em 3 grupos:</p></li></ul><h2>Ígnea ou magmática:</h2><ul><li><p>Vem da solidificação do magma;</p></li><li><p>Podem ser extrusivas/vulcânicas ou intrusivas/plutônicas;</p><ul><li><p>Ex. de vulcânica: basalto</p></li><li><p>Ex de plutônica: granito</p></li></ul></li><li><p>Podem ser encontrados minerais metálicos</p></li><li><p>Os solos próximos a essas regiões possuem elevada fertilidade.</p></li></ul><h2>Metamórfica:</h2><ul><li><p>Rochas que sofrem alterações químicas de composição;</p></li><li><p>Mudança em cor e formato dos seus minerais;</p></li><li><p>Tempo + Pressão + Temperatura  (Rochas soterradas)</p></li><li><p>Ex: mármore, gnaisse, morro do Pão-de-Açúcar (RJ)</p></li><li><p>Presença de minerais metálicos como ouro, ferro, manganês…</p></li></ul><h2>Sedimentar:</h2><ul><li><p>Rochas que possuem matéria orgânica (carbono)</p></li><li><p>O processo de formação dessas rochas é denominado <strong>litificação</strong> ou <strong>diagênese;</strong></p></li><li><p><strong>Litificação</strong>→compactação→cimentação *mudanças na estrutura física</p></li><li><p>Ex: carvão mineral, calcário</p></li><li><p>Podemos encontrar nas bacias sedimentares jazidas de petróleo, carvão mineral e gás natural (hidrocarbonetos: petróleo e gás natural);</p></li><li><p>Formação de cavernas e grutas de calcário.</p><ul><li><p>Bonito, MS - Gruta do Lago Azul</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/transformacao-entre-rochas.webp" alt="Esquema com as três palavras Ígnea, Metamórfica e Sedimentar ligadas por setas nos dois sentidos, mostrando que qualquer uma pode virar qualquer outra." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/ciclo-das-rochas.webp" alt="Ciclo das rochas em círculo: do magma às rochas magmáticas por arrefecimento, delas a sedimentos por intemperismo, a rochas sedimentares por diagênese, a metamórficas por pressão e temperatura, e de volta ao magma por fusão." style="width:569px" data-largura="569px"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'vulcanismo',
  'Vulcanismo',
  'geografia',
  'comum',
  'O que o vulcão dá e o que ele cobra — solo fértil de um lado, gás tóxico do outro.',
  '<p>toda ação relacionada aos vulcões;</p><p>Há pontos positivos sobre o vulcanismo:</p><ul><li><p>Solos férteis;</p></li><li><p>Pesquisas científicas;</p></li><li><p>Mineração;</p></li></ul><p>Pontos negativos:</p><ul><li><p>Emissão de gases tóxicos;</p></li><li><p>Rochas lançadas com cinzas;</p></li><li><p>Magma em si;</p></li></ul><ul><li><p>Podem modificar o clima, como o Krakatoa;</p></li><li><p><strong>Modificam o relevo criando novas rochas</strong>;</p></li><li><p>Formam solos como o Basáltico;</p></li><li><p>Maior concentração de vulcões ativos está no Oceano Pacifico, entre África e Ásia;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'tipos-de-solo',
  'Tipos de solo',
  'geografia',
  'comum',
  'Latossolo, neossolo, argissolo e os outros — inclusive a terra preta de índio, o único solo antrópico do mundo.',
  '<ul><li><p>Pedologia: estudo sobre a formação dos solos;</p><ul><li><p>Composição do solo: ar, água, mat. orgânica e sais minerais;</p></li></ul></li><li><p>Locais com clima tropical e equatorial possuem solos mais desenvolvidos;</p><ul><li><p>Grande quantidade de intemperismo químico;</p></li></ul></li></ul><h2 data-corrido="sim">Latossolo:</h2><p>solo maduro/ desenvolvido; possui todas as camadas;</p><h2 data-corrido="sim">Neossolo:</h2><p>solo jovem/ pouco desenvolvido (litossolo);</p><h2 data-corrido="sim">Argissolo:</h2><p>solo muito intemperizados, com horizonte B marcado pelo acúmulo de argila. Geralmente ácido e pobre em nutrientes;</p><h2 data-corrido="sim">Plintossolo:</h2><p>solo com acúmulo acentuado de óxidos de ferro e/ou alumínio. Apresenta cor avermelhada ou alaranjada;</p><h2 data-corrido="sim">Vertissolo (massapê):</h2><p>solo com abundância de matéria orgânica e fertilidade natural, além de ser muito argiloso e pegajoso. Comum no Recôncavo Baiano e outras regiões do litoral nordestino;</p><h2 data-corrido="sim">TPI:</h2><p>“terra preta de índio”</p><ul><li><p>Único solo antrópico do mundo;</p></li><li><p>Criado por povos pré-colombinos;</p></li><li><p>Solo altamente fértil;</p></li><li><p>No Brasil está em regiões da Amazônia;</p></li></ul><h2 data-corrido="sim">Basáltico:</h2><p>origem da rocha basalto; vulcânica;</p><ul><li><p>Está localizado onde houve derramamento vulcânico;</p></li><li><p>Centro-oeste, sudeste e sul;</p></li><li><p>Cor avermelhada e muito fértil;</p></li></ul><h2>Tchernozion:</h2><ul><li><p>Solo muito rico;</p></li><li><p>Locais de clima subtropical;</p></li><li><p>Argentina e Ucrânia possuem esse solo em abundância;</p></li><li><p>Guerra da Ucrânia (geopolítica);</p></li><li><p>Solo muito escuro;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'erosao',
  'Erosão',
  'geografia',
  'comum',
  'Voçoroca, desertificação, arenização, salinização, lixiviação e lateralização — seis formas de perder o solo.',
  '<p>remoção de vegetação deixa o solo exposto a perdas de massa</p><ul><li><p>Eólica, fluvial ou pluvial;</p></li></ul><h2 data-corrido="sim">Voçoroca:</h2><p>aberturas no solo muito profundas;</p><ul><li><p>Causada pela erosão hídrica e eólica superficial e sub-superficial;</p></li><li><p>3 etapas: sulco→ravina→voçoroca</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/tipos-de-erosao.webp" alt="Seis fotografias sob o título Tipos de erosão: à esquerda a laminar, com o solo lavado em manta; à direita a linear, em sulcos, ravinas e voçorocas cada vez mais fundos." style="width:100%" data-largura="100%"></figure><h2 data-corrido="sim">Desertificação:</h2><p>processo de mudança de características locais do solo;</p><ul><li><p>Associado com mudanças climáticas;</p></li><li><p>A ação humana pode acelerar o processo;</p></li><li><p>Perda de fertilidade, de massa do sol e possível perda total e sem regeneração;</p></li></ul><h2 data-corrido="sim">Arenização:</h2><p>processo de afloramento de areia no solo;</p><ul><li><p>Solo de arenito;</p></li><li><p>Locais onde há uso inadequado de maquinário agrícola;</p></li><li><p>Região sul do Brasil possui locais com esse processo: Alegrete, São Borja e Unistalda;</p></li><li><p>Na separação da Gondwana o Brasil possuía um deserto na sua porção sudeste-sul (Deserto de Botucatu)</p></li><li><p>Deserto soterrado e criação de solo acima dele;</p></li></ul><h2 data-corrido="sim">Salinização:</h2><p>processo de acúmulo de sais na camada superior do solo;</p><ul><li><p>Causada por má irrigação e por águas captadas do lençol freático ou aquífero;</p></li><li><p>Comum no semiárido, mas pode ocorrer no tropical;</p></li><li><p>Acidificação do solo e perda de fertilidade;</p></li></ul><h2 data-corrido="sim">Lixiviação:</h2><p>lavagem vertical do solo;</p><ul><li><p>Comum em climas chuvosos;</p></li><li><p>As chuvas constantes carregam minerais para as partes mais profundas do solo;</p></li><li><p>Geram acidez;</p></li><li><p>Ex: solo amazônico;</p></li></ul><h2 data-corrido="sim">Lateralização:</h2><p>acúmulo de óxidos de ferro e alumínio na camada superior do solo;</p><ul><li><p>Comum em climas tropicais;</p></li><li><p>Camada avermelhada e rígida que remove a fertilidade do solo;</p></li><li><p>Também podem ser chamados de canga;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'praticas-de-conservacao',
  'Práticas de conservação',
  'geografia',
  'comum',
  'Mecânicas, edáficas e vegetativas — o que se faz para o solo não ir embora.',
  '<p>formas de se evitar a erosão, a fertilidade ou a recuperação desses recursos.</p><p>São divididas em 3 etapas:</p><h2>Mecânica:</h2><ul><li><p>Objetivo de evitar a erosão;</p></li><li><p>Ex: <strong>terraceamento</strong>: construir degraus para diminuir a velocidade do escoamento artificial (muito usado na Ásia para a Rizicultura).</p></li></ul><h2>Edáficas:</h2><ul><li><p>Recuperação da fertilidade;</p></li><li><p>Ex1: <strong>NPK</strong> - serve para recuperar o solo da acidez.</p></li><li><p>Ex2: <strong>Colagem</strong> - uso de calcário no solo.</p></li><li><p>Ex3: <strong>Adubação verde</strong> - plantação de leguminosas para recuperar Nitrogênio.</p></li><li><p>Ex4: <strong>Rotação</strong> de culturas - troca da cultura produzida para não exaurir o solo com algum nutriente.</p></li><li><p>Ex5: <strong>Curvas de nível</strong> - são plantações que acompanham o desenho do relevo. Evitam erosão e a perda de fertilidade.</p></li></ul><h2>Vegetativas:</h2><ul><li><p>Evitar a erosão e recuperar o solo ao mesmo tempo;</p></li><li><p>Ex1: <strong>geotêxtil</strong> - grades feitas de fibra vegetal, colocadas no solo para segurar a terra e se decompor recuperando o solo.</p></li><li><p>Ex2: <strong>plantio direto na palha</strong> - consiste no plantio da nova cultura na palha (restos) da cultura anterior.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'horizontes-e-perfis-de-solo',
  'Horizontes e perfis de solo',
  'geografia',
  'comum',
  'De O a R: as seis camadas do perfil, da serrapilheira à rocha matriz.',
  '<ul><li><p>O: camada mais fina, possui boa mat. orgânica (húmus), possui <strong>serrapilheira</strong>;</p><ul><li><p>Camada de matéria orgânica em decomposição que se forma na superfície do solo, principalmente em florestas e bosques;</p></li></ul></li><li><p>A: camada mais rica em matéria orgânica; onde as raízes de árvore, plantas e outras culturas agrícolas buscam minerais; mais seres vivos e mais minerais;</p></li><li><p>E: transição entre A e B; menor concentração de seres vivos e minerais; coloração mais clara</p></li><li><p>B: seres vivos e minerais podem ser inexistentes ou muito reduzidos; coloração muito mais clara; pedaços pequenos de rocha matriz (regolitos);</p></li><li><p>C: sem mineiras ou seres vivos; grandes pedaços de rocha matriz;</p></li><li><p>R: base do solo; influência na formação do solo;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/horizontes-do-solo.webp" alt="Perfil vertical do solo com as camadas marcadas de cima para baixo: O sob a grama, A, E, B, C e R sobre a rocha não alterada." style="width:369px" data-largura="369px"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'sistemas-industriais',
  'Sistemas industriais',
  'geografia',
  'comum',
  'Clássica, via prussiana, planificada e tardia — quatro caminhos para a mesma indústria.',
  '<p>a forma com que países desenvolveram sua indústria (contexto político e econômico);</p><p>Ao todo há 4 tipos:</p><h2>Clássica:</h2><ul><li><p>São os pinheiros da industrialização;</p></li><li><p>Inglaterra, França, EUA, Itália, Espanha, …;</p></li></ul><h2>Via Prussiana:</h2><ul><li><p>Governos centralizadores que apoiaram a indústria pela burguesia;</p></li><li><p>Japão e Alemanha;</p></li></ul><h2>Planificada:</h2><ul><li><p>O Estado é dono das fábricas e decide como será distribuído o lucro;</p></li><li><p>U.R.S.S. e seus aliados próximos;</p></li></ul><h2>Tardia:</h2><ul><li><p>Países que se industrializaram por último;</p></li><li><p>São/foram muito dependentes de tecnologia e indústrias estrangeiras;</p></li><li><p>Brasil, China, Índia, Coreia do Sul, Paraguai, Taiwan, …;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/bens-de-capital-e-de-consumo.webp" alt="Esquema da indústria em dois sentidos: para cima, bens de capital (minérios, intermediário e capital); para baixo, bens de consumo não durável, semidurável e durável, com alimentos, têxtil e carro como exemplos." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'dit',
  'DIT',
  'geografia',
  'comum',
  'As três divisões internacionais do trabalho, cada uma num esquema de quem manda o quê para quem.',
  '<h2>1º DIT:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/dit-primeira.webp" alt="Esquema da primeira DIT: as colônias mandam matéria-prima para as metrópoles e recebem manufaturados de volta." style="width:100%" data-largura="100%"></figure><h2>2º DIT:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/dit-segunda.webp" alt="Esquema da segunda DIT: colônias e ex-colônias mandam matéria-prima para as metrópoles desenvolvidas e recebem industrializados." style="width:100%" data-largura="100%"></figure><h2>3º DIT:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/dit-terceira.webp" alt="Esquema da terceira DIT: os países subdesenvolvidos e emergentes mandam commodities, juros da dívida e industrializados; os desenvolvidos mandam capitais, empréstimos e produtos tecnológicos." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'industrializacao-do-brasil',
  'Industrialização do Brasil',
  'geografia',
  'comum',
  'De Vargas ao período militar: quem industrializou o país e com que obra.',
  '<h2>Era Vargas:</h2><ul><li><p>A partir de 1930;</p></li><li><p>Para superar a crise de 1929, Vargas incentiva a indústria nacional com subsídios;</p></li><li><p>Elite cafeeira investe na indústria- indústria pesada;</p></li><li><p>Nacional desenvolvimento;</p></li><li><p>Petrobrás, Vale do Rio Doce, CSN, Fábrica Nacional de motores;</p></li><li><p>CLT- Consolidação das leis trabalhistas;</p></li><li><p>Criação do ABC paulista;</p></li></ul><h2>Juscelino Kubitschek-JK:</h2><ul><li><p>Rodoviarismo: interliga as regiões do Brasil pelas rodovias radiais;</p></li><li><p>Atrai montadoras estrangeiras;</p></li><li><p>50 anos em 5 (slogan);</p></li><li><p>Construção de Brasília no centro das radiais;</p></li></ul><h2>Período Militar-1964:</h2><ul><li><p>Grandes obras de infraestrutura para transporte e energia;</p></li><li><p>Itaipu, transamazônica, Angra 1 e 2, Zona Franca de Manaus, Polo Industrial de Camaçari–BA;</p></li><li><p>Projeto Grande Carajás - Mineração;</p></li><li><p>Tentaram promover a desconcentração industrial;</p></li><li><p>Zona Franca de Manaus:</p><ul><li><p>Objetivo de ocupar e integrar a região;</p></li><li><p>Oferecem subsídios para as indústrias;</p></li><li><p>Construção na década de 1970;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'desconcentracao-industrial',
  'Desconcentração industrial',
  'geografia',
  'comum',
  'Por que a indústria começou a sair dos grandes centros nos anos 1970.',
  '<p>diminuição da busca de indústrias para os grandes centros;</p><ul><li><p>Migração industrial para as cidades médias;</p></li><li><p>Menor custo de vida;</p></li><li><p>Subsídios de governos estaduais e municipais;</p></li><li><p>Início na década de 1970</p></li><li><p>Ex: Camaçari–BA;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'toyotismo',
  'Toyotismo',
  'geografia',
  'comum',
  'O modelo japonês: qualidade, kaizen e o fim do estoque.',
  '<ul><li><p>Modelo japonês que mudou o método de produção;</p></li><li><p>Tinham como objetivo: <strong>aqualidade</strong>;</p></li><li><p><strong>Método Kaizen</strong>: melhora contínua e controle de qualidade em todas as etapas;</p></li><li><p>Fim dos grandes estoques para evitar crises de superprodução e abrir possibilidade de customização - Just in Time- carros sob demanda;</p></li><li><p>Funcionários especialistas por setor;</p></li><li><p>Robotização e automação.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'taylorismo',
  'Taylorismo',
  'geografia',
  'comum',
  'O primeiro método científico na fábrica: etapas, cronômetro e a alienação que os críticos apontam.',
  '<ul><li><p>1º método científico a ser aplicado nas indústrias (XIX);</p></li><li><p>Aumento da produtividade e eficiência, tendo como consequência, o aumento do lucro;</p></li><li><p>Divide a produção em várias etapas como funcionários muito especializados;</p></li><li><p>Para os críticos esse modelo causa a alienação do funcionário (não domina todo o processo);</p></li><li><p>Cronometragem da produção e bônus salariais por produção;</p></li><li><p>Estabelece o uso da <strong>linhademontagem.</strong></p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'fordismo',
  'Fordismo',
  'geografia',
  'comum',
  'O que Ford acrescentou ao taylorismo: a esteira, o grande estoque e o carro sem customização.',
  '<ul><li><p>Observa o Taylorismo e aplica nas suas fábricas e o melhora para sua realidade;</p></li><li><p>Coloca uma esteira na linha de montagem;</p></li><li><p>Estabelece bônus por produtividade, finais de semana e aumento de salário;</p></li><li><p>Estabelecimento de grandes estoques, para atender a sociedade de consumo da época (American Way of Life);</p></li><li><p>Os veículos eram padronizados (estandardização), para aumentar a produtividade, ou seja, sem customização.</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'grandes-projetos-mineradores-do-brasil',
  'Grandes projetos mineradores do Brasil',
  'geografia',
  'comum',
  'Carajás, o Quadrilátero Ferrífero e o Urucum — o que se tira, por onde sai e o que já rompeu.',
  '<h2>Projeto Grande Carajás:</h2><ul><li><p>Estado do Pará e partes do MA e TO;</p></li><li><p>Começa a ser explorado no período militar – 1970;</p></li><li><p>Ferro, nióbio, manganês, zinco, bauxita (alumínio), cobre, …;</p></li><li><p>Maior parte dos minérios é destinada ao mercado externo;</p><ul><li><p>China, UE, EUA, Canadá, Japão;</p></li></ul></li><li><p>Estrada de ferro Carajás;</p><ul><li><p>Portos: São Luís, Itaqui, Ponta do Madeira;</p></li><li><p>UHE de Tucuruí no Pará – Rio Tocantins;</p></li></ul></li><li><p>Região do Vale do Rio Trombetas;</p></li><li><p>Questão indígena;</p><ul><li><p>Invasão e exploração de terras Yanomami;</p></li><li><p>Ouro, assoreamentos e contaminação;</p></li><li><p>AM e RR;</p></li></ul></li></ul><h2>Quadrilátero Ferrífero:</h2><ul><li><p>Região mais antiga de exploração mineral;</p></li><li><p>Estado de MG;</p><ul><li><p>BH, Ouro Preto, Mariana, Brumadinho, Bento Rodriguez, Congonhas, Sta. Barbara;</p></li></ul></li><li><p>Ferro, níquel, manganês, bauxita, zinco, …;</p></li><li><p>Abastece os grandes centros do Brasil pela proximidade;</p><ul><li><p>ABCD Paulista;</p></li></ul></li><li><p>Estrada de ferro Vitória-Minas;</p><ul><li><p>Destino: Porto de Tubarão–ES;</p></li></ul></li><li><p>Desastres:</p><ul><li><p>Mariana — 2015:</p><ul><li><p>Rompimento da barragem do Fundão, contaminação da Bacia do Rio Doce;</p></li><li><p>Samarco (Vale) e BHP Billiton;</p></li><li><p>Rejeitos contaminam o Atlântico;</p></li></ul></li><li><p>Brumadinho — 2019:</p><ul><li><p>Rompimento da barragem de rejeitos;</p></li><li><p>Rio Paraopeba contaminado;</p></li><li><p>Maior acidente envolvendo mineração do Brasil;</p></li><li><p>Chega ao Atlântico e contamina APA’s, no Estado da Bahia;</p></li><li><p>Solo contaminado;</p></li><li><p>Possibilidade de recuperação a longo prazo com medidas humanas – desassoreamento;</p></li></ul></li></ul></li></ul><h2>Maciço do Urucum:</h2><ul><li><p>Está no MS, na porção pantaneira do estado;</p></li><li><p>É uma intrusão, ígnea numa bacia sedimentar;</p></li><li><p>Localizado em Corumbá;</p></li><li><p>Pouco explorado pela distância;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ciclones',
  'Ciclones e suas características',
  'geografia',
  'comum',
  'Furacão, tufão e tornado são o mesmo fenômeno — muda onde nasce e a escala com que se mede.',
  '<ul><li><p>Perturbação atmosférica em vórtex.</p><ul><li><p>AP e BP.</p></li></ul></li><li><p>Tufão, furacão e tornado são ciclones.</p></li></ul><h2>Furacão:</h2><ul><li><p>Originados em água (atlântico) quando a água superficial passa de 27ºC;</p></li><li><p>Perdem força quando chegam ao solo;</p></li><li><p>Podem durar mais de 7 dias;</p></li><li><p>Escala Saffir-Simpson (F1 ao F5);</p></li><li><p>Podem ser tropicais ou extra-tropicais.</p></li><li><p>Brasil: 2004 — Furacão Catarina–RS — F2;</p></li><li><p><strong>Tufões são a mesma coisa, porém formados no Pacífico ou no Índico;</strong></p></li></ul><h2>Tornados:</h2><ul><li><p>Origem em terra firme;</p></li><li><p>Intensidade elevada e duração curta;</p></li><li><p>Escala Fujita;</p></li><li><p>Chega facilmente a 300km/h;</p></li><li><p>Duração de aproximadamente 15 minutos.</p></li></ul><ul><li><p>Ciclogênese: <strong>formação.</strong></p></li><li><p>Clicólise: <strong>fim.</strong></p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'el-nino-e-la-nina',
  'El Niño e La Niña',
  'geografia',
  'comum',
  'Alísios fracos e fortes, e o que cada fase faz chover ou secar em cada região do Brasil.',
  '<ul><li><p>São eventos naturais que podem ser intensificados pela ação humana;</p></li><li><p>Altera as zonas de pressão a nível global;</p></li><li><p>Causado pelo fortalecimento ou enfraquecimento dos alísios e alteração na célula de Walker;</p></li></ul><h2><em>El Niño</em>:</h2><ul><li><p>Alísios: fracos;</p></li><li><p>Walker: Bipartida;</p></li><li><p>Águas do pacífico equatorial/tropical, aquecimento anormal;</p></li><li><p>Regiões do Brasil</p><ul><li><p>Norte e Nordeste: seca;</p></li><li><p>Sul: chuvas intensas;</p></li><li><p>Centro-oeste: intensificação do clima local;</p></li><li><p>Sudeste: temperaturas Acima da Média</p></li></ul></li><li><p>Dura entre 9 e 12 meses ;</p></li><li><p>Ásia e Oceania seguem o padrão do norte do Brasil;</p></li><li><p>Ausência de ressurgência;</p></li><li><p>Pouca presença de peixe, ou seja menor piscosidade;</p></li><li><p>Secas nos continentes a oeste;</p></li></ul><h2><em>La Niña</em>:</h2><ul><li><p>Oposto de El Niño;</p></li><li><p>Alísios: fortes;</p></li><li><p>Walker: intensificado;</p></li><li><p>Águas do Pacífico tropical: frias;</p></li><li><p>Regiões do Brasil:</p><ul><li><p>Norte e Nordeste: chuvosos;</p></li><li><p>Sul: secas;</p></li><li><p>Centro-oeste: intensificação;</p></li><li><p>Sudeste: temperaturas amenas;</p></li></ul></li><li><p>Dura entre 12 e 24 meses;</p></li><li><p>Ressurgência intensificada:</p><ul><li><p>Águas Profundas e frias que chegam a superfície do Pacífico;</p></li></ul></li><li><p>chuvas intensas nos continentes a oeste;</p></li><li><p>maior ressurgência e maior piscosidade</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/el-nino-e-la-nina.webp" alt="Três blocos do Pacífico equatorial comparados: ano normal, com alísios soprando para a Indonésia e ressurgência na costa sul-americana; ano de El Niño, com alísios fracos e a água quente deslocada para leste; ano de La Niña, com alísios fortes e ressurgência intensificada." style="width:593px" data-largura="593px"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'climas-do-brasil',
  'Climas do Brasil',
  'geografia',
  'comum',
  'Os seis climas, cada um com a sua temperatura média, a sua chuva e o climograma de uma cidade.',
  '<h2>Tropical continental:</h2><ul><li><p>Estações bem definidas;</p><ul><li><p>Verão: chuvoso/úmido;</p></li><li><p>Inverno: seco;</p></li></ul></li><li><p>Precipitação: 1500 mm/ano;</p></li><li><p>Temperatura média: 26 °C</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/climograma-tropical.webp" alt="Climograma do clima tropical em Goiânia (GO): chuva concentrada de outubro a março e quase nula no meio do ano, com a temperatura variando pouco em torno de 23 °C." style="width:100%" data-largura="100%"></figure><h2>Tropical úmido:</h2><ul><li><p>Influenciado pela maritimidade;</p></li><li><p>Precipitação: 2500 mm/ano;</p></li><li><p>Temperatura: 25 °C;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/climograma-tropical-umido.webp" alt="Climograma do clima tropical úmido em Santos (SP): chove em todos os meses, com máximo no verão, e a temperatura média anual fica em 21,8 °C." style="width:100%" data-largura="100%"></figure><h2>Tropical de altitude:</h2><ul><li><p>Cidades mais altas do sudeste;</p><ul><li><p>Ex: Campos do Jordão (1600 m)</p></li></ul></li><li><p>Parece com o clima do sul;</p></li><li><p>Temperatura: 20 °C;</p></li><li><p>Precipitação: 1560 mm/ano;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/climograma-tropical-de-altitude.webp" alt="Climograma do clima tropical de altitude em São Sebastião do Paraíso (MG), a 975 m: chuva de verão marcada e temperatura média anual de 19,4 °C." style="width:100%" data-largura="100%"></figure><h2>Equatorial úmido:</h2><ul><li><p>Temperaturas elevadas o ano todo;</p></li><li><p>Precipitação: 3000 mm/ano;</p></li><li><p>Chuvas bem distribuídas;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/climograma-equatorial.webp" alt="Climograma do clima equatorial em Belém (PA): mais de 2.500 mm de chuva por ano e a linha de temperatura praticamente reta em 26,8 °C." style="width:100%" data-largura="100%"></figure><h2>Semiárido:</h2><ul><li><p>Pouca chuva e má distribuição;</p></li><li><p>Temperatura: 27 °C;</p></li><li><p>Precipitação: 750 mm/ano;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/climograma-semiarido.webp" alt="Climograma do clima semiárido em Petrolina (PE): barras de chuva baixas e vários meses quase sem precipitação, com 435 mm no ano." style="width:100%" data-largura="100%"></figure><h2>Temperado:</h2><ul><li><p>Chuvas bem distribuídas e definidas;</p></li><li><p>Temperatura: 19 °C;</p></li><li><p>Precipitação: 2000 mm/ano;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/climograma-subtropical.webp" alt="Climograma do clima subtropical em Lages (SC): chuva distribuída por todos os meses e temperatura média anual de 16,6 °C, a mais baixa do conjunto." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'massas-de-ar-do-brasil',
  'Massas de ar do Brasil',
  'geografia',
  'comum',
  'As cinco massas, onde cada uma se forma e para onde ela leva a chuva ou o frio.',
  '<h2>Massa equatorial continental (mEc):</h2><ul><li><p>Quente e úmida;</p></li><li><p>Formada na <strong>região amazônica</strong> e <strong>vai em direção ao Centro-Oeste e Sudeste durante o verão</strong>;</p><ul><li><p>Rios voadores: deslocamento do vapor de água resultante da evapotranspiração da floresta;</p></li><li><p>Causa intensas precipitações nessas regiões;</p></li></ul></li></ul><h2>Massa equatorial atlântica (mEa):</h2><ul><li><p>Quente e úmida;</p></li><li><p>Formada pelos <strong>ventos alísios</strong> da <strong>região equatorial do oceano atlântico</strong>;</p></li><li><p>Contribui para a formação de chuvas no litoral das regiões Norte e Nordeste;</p></li></ul><h2>Massa tropical continental (mTc):</h2><ul><li><p>Quente e seca;</p></li><li><p>Formada na <strong>região do Chaco</strong> (norte da Argentina e sul da Bolívia);</p></li><li><p>Contribui para a diminuição de chuvas no oeste de Mato Grosso do Sul e do Paraná;</p></li></ul><h2>Massa Tropical Atlântica (mTa):</h2><ul><li><p>Quente e úmida;</p></li><li><p>Formada na <strong>região do Trópico de Capricórnio</strong> no Oceano Atlântico;</p></li><li><p>Importante para a formação do clima do Sul, Sudeste e parte do Nordeste;</p><ul><li><p>Responsável por parte das precipitações nessas áreas, especialmente no litoral;</p></li></ul></li></ul><h2>Massa polar atlântica (mPa):</h2><ul><li><p>Fria e úmida;</p></li><li><p>Formada sobre o Oceano Atlântico, entre o extremo sul da América do Sul e a Antártida;</p></li><li><p>Importante para a formação de invernos nas regiões Sul e Sudeste;</p><ul><li><p>Em momentos que ganha mais força, pode chegar até Manaus;</p></li><li><p>Friagem: repentina queda de temperatura em regiões de clima quente;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/massas-de-ar-do-brasil.webp" alt="Dois mapas do Brasil lado a lado, verão e inverno, com setas coloridas para cada massa de ar: no verão a equatorial continental domina o interior; no inverno a polar atlântica sobe pelo Sul e Sudeste." style="width:100%" data-largura="100%"></figure>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'fontes-de-energia',
  'Fontes de energia',
  'geografia',
  'comum',
  'Renováveis e não renováveis, com a vantagem e o preço ambiental de cada uma — e o lugar do Brasil em todas.',
  '<h2 data-corrido="sim">Primárias:</h2><p>formas de conseguir a energia; Ex: hidrelétrica – água</p><h2 data-corrido="sim">Secundárias:</h2><p>eletricidade, calor, movimento;</p><h2 data-corrido="sim">Renováveis:</h2><p>aquelas que se recuperam em maior velocidade do que se gasta;</p><h3 data-corrido="sim">Biomassa:</h3><p>queima de matéria orgânica;</p><h3 data-corrido="sim">Biodiesel:</h3><p>diesel feito a partir de sementes oleaginosas;</p><ul><li><p>Misturado ao diesel para reduzir sua poluição.</p></li></ul><h3 data-corrido="sim">Solar:</h3><p>painéis fotovoltaicos;</p><ul><li><p>Demanda limpeza e manutenção constantes;</p></li><li><p>A melhor região do BR é o Sertão Nordestino, porém não há aproveitamento;</p></li></ul><h3 data-corrido="sim">Eólica:</h3><p>motores e pás eólicas em parques eólicos;</p><ul><li><p>Maior potencial instalado: Nordeste;</p><ul><li><p>Litoral e partes do interior;</p></li><li><p>Rota dos ventos alísios;</p></li></ul></li><li><p>Desvantagens:</p><ul><li><p>Alteração ambiental: mudança de rota de aves e mortes de aves;</p></li><li><p>Desvalorização de imóveis: poluição sonora e visual;</p></li></ul></li></ul><h3>Hidrelétrica:</h3><ul><li><p>Fonte principal do Brasil;</p></li><li><p>Rios de planalto são preferenciais pela energia potencial gravitacional;</p></li><li><p>Itaipu: maior em geração de energia;</p><ul><li><p>Rio Paraná – Foz do Iguaçu;</p></li></ul></li><li><p>Jupiá – SP, MS e PR;</p></li><li><p>Desvantagens:</p><ul><li><p>Áreas de alagamento extensas;</p></li><li><p>Desequilíbrio ambiental;</p></li><li><p>Redução de biodiversidades;</p></li></ul></li></ul><h3>Etanol:</h3><ul><li><p>Brasil: feito a partir de cana-de-açúcar;</p></li><li><p>Produção pela cana a partir de pesquisas no Brasil na década de 1970;</p><ul><li><p>Contexto da Guerra do Yon Kippur;</p></li><li><p>Boicote da OPEP aos EUA, Europa e seus aliados;</p></li><li><p>Redução da dependência externa;</p></li></ul></li><li><p>Polui menos que a gasolina, mas possui menos eficiência;</p></li></ul><h3 data-corrido="sim">Geotérmica:</h3><p>usa calor do interior da Terra entre placas tectônicas;</p><ul><li><p>Usada na Islândia;</p></li><li><p>Limitada a locais com fissuras tectônicas;</p></li></ul><h2 data-corrido="sim">Não renováveis:</h2><p>qualquer fonte finita;</p><h3>Termelétrica:</h3><ul><li><p>Pode ser não renovável ou renovável;</p><ul><li><p>Depende do material da queima;</p></li><li><p>Carvão mineral é muito usado;</p></li></ul></li></ul><h3 data-corrido="sim">Nuclear:</h3><p>utiliza a fissão nuclear;</p><ul><li><p>A mais eficiente;</p></li><li><p>Elevado risco ambiental;</p></li><li><p>Gera lixo radioativo;</p></li><li><p>Acidentes:</p><ul><li><p>Chernobyl – Ucrânia;</p></li><li><p>Fukushima;</p></li></ul></li><li><p>Brasil:</p><ul><li><p>Domina a tecnologia;</p></li><li><p>Acordo EUA e Alemanha;</p></li><li><p>Apenas uso energético;</p></li><li><p>Usinas Angra 1, 2 e 3 (3 inativa por obras);</p></li></ul></li></ul><h3 data-corrido="sim">Petróleo:</h3><p>composto por hidrocarbonetos;</p><ul><li><p>Possui derivados importantes para o mundo;</p></li><li><p>Gasolina, Diesel e querosene de aviação (gás natural);</p></li><li><p>Emissão de CO₂, CO e SO₂;</p></li><li><p>OPEP;</p><ul><li><p>Cartel do Petróleo;</p></li><li><p>Oriente médio, África e A. do Sul;</p></li><li><p>1° choque do Petróleo – Yon Kippur;</p></li><li><p>2° choque do Petróleo – Irã x Iraque;</p></li></ul></li><li><p>Brasil:</p><ul><li><p>Petrobrás 2° governo Vargas;</p></li><li><p>Monopólio da prospecção, extração, refino, transporte e venda;</p></li><li><p>1° exploração: Bacia de Campos – RJ e ES;</p></li><li><p>Pré-sal reserva importante para exportação e combustível;</p></li><li><p>Margem equatorial: AP, MA e PA;</p><ul><li><p>Reserva grande e rica;</p></li><li><p>Royalties para o AP;</p></li><li><p>IcmBio, IBAMA x Petrobrás e Gov. Federal;</p></li></ul></li></ul></li></ul><h3 data-corrido="sim">Carvão mineral:</h3><p>hidrocarbonetos;</p><ul><li><p>Soterramentos de pântanos;</p></li><li><p>4 fases;</p><ul><li><p>1° turfa (+umidade e -carbono); 2° linhito; 3° hulha e 4° antracito (-umidade e +carbono);</p></li></ul></li><li><p>BR: Cinturão carbonífero - PR, SC e RS (baixa qualidade);</p></li><li><p>China: país que mais usa;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'modais-de-transporte',
  'Modais de transporte',
  'geografia',
  'comum',
  'Rodoviário, ferroviário, hidroviário, aeroviário e dutoviário — para que distância cada um serve.',
  '<h2 data-corrido="sim">Rodoviário:</h2><p>principal do Brasil;</p><ul><li><p>Incentivado desde a década de 1950;</p></li><li><p>JK – rodoviarismo;</p><ul><li><p>Rodovias radiais;</p><ul><li><p>Federais e estaduais;</p></li></ul></li><li><p>Montadoras estrangeiras;</p></li></ul></li><li><p>Ideal para curtas e médias distâncias;</p></li><li><p>Muito flexível para novos caminhos;</p></li></ul><h2>Ferroviário:</h2><ul><li><p>Ideal para longas distâncias;</p></li><li><p>Custo elevado de implementação de baixo de manutenção;</p></li><li><p>No Brasil não há padronização das bitolas;</p><ul><li><p>Problemas na integração;</p></li></ul></li><li><p>Flexibilidade nos combustíveis;</p></li></ul><h2>Hidroviário:</h2><ul><li><p>Subutilizado no Brasil;</p></li><li><p>3 tipos:</p><ul><li><p>Cabotagem: litoral sem se afastar da costa;</p></li><li><p>Interna: rios e lagos;</p></li><li><p>Oceânica: atravessar continentes pelo mar;</p></li></ul></li><li><p>Alta capacidade de carga e baixa manutenção;</p></li><li><p>Manutenção de portos e navios;</p><ul><li><p>Afundamento de leitos;</p></li></ul></li></ul><h2>Aeroviário:</h2><ul><li><p>Mais rápido e mais caro;</p></li><li><p>Manutenção cara, material humano caro, combustível caro;</p></li><li><p>Capacidade de carga varia conforme o avião;</p></li><li><p>Materiais tecnológicos, militares e medicamentos;</p></li></ul><h2 data-corrido="sim">Dutoviário:</h2><p>realizado por encanamentos;</p><ul><li><p>Oleoduto: petróleo;</p></li><li><p>Mineroduto: minérios (ferro);</p></li><li><p>Gasoduto: gás natural;</p></li><li><p>Levam grandes quantidades;</p></li><li><p>Nordstream 1 e 2;</p><ul><li><p>1 foi explodido na Guerra da Ucrânia;</p></li></ul></li><li><p>Gasbol;</p><ul><li><p>Brasil-Bolívia;</p></li><li><p>Maior da A. do Sul;</p></li><li><p>Passa por CG e chega até SP;</p></li></ul></li></ul><h2 data-corrido="sim">Intermodalidade:</h2><p>integração de modais;</p><ul><li><p>Depender em grande parte do uso do contêiner;</p></li><li><p>Terminais aduaneiros internos (porto seco);</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'hidrografia',
  'Hidrografia',
  'geografia',
  'comum',
  'O ciclo da água, os três tipos de aquífero, o Guarani e o Amazonas, e as partes de uma bacia.',
  '<ul><li><p>No Brasil, o principal uso recai sobre o setor agrícola;</p></li><li><p>A importância da água faz com que seu consumo elevado seja motivo de preocupação.</p></li></ul><h2>Ciclo da água:</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/ciclo-da-agua.webp" alt="Ciclo da água em círculo, com as setas ligando evaporação, condensação, precipitação, infiltração e afloramento, e de volta à evaporação." style="width:100%" data-largura="100%"></figure><ul><li><p>O ciclo da água pode ser alterado pelo homem:</p><ul><li><p>Remoção da cobertura vegetal para pastos ou para culturas diversas;</p></li><li><p>Impermeabilização em área urbanas;</p></li></ul></li><li><p>Assim o abastecimento de rios, aquíferos e lagos podem ser comprometidos;</p></li></ul><h2>Aquíferos:</h2><ul><li><p>São águas subterrâneas em reservas rochosas;</p></li><li><p>Dividida em três tipos:</p><ul><li><p>Suspenso: aquífero cercado por rochas impermeáveis e que perdeu a capacidade de abastecimento ou perda de água;</p></li><li><p>Livre: lençol freático;</p><ul><li><p>Limite superior: solo saturado;</p></li><li><p>Limite inferior: Rocha impermeável e semipermeável;</p></li><li><p>O nível freático pode ser alterado por questões climáticas;</p><ul><li><p>Secas e queimadas reduzem seu nível;</p></li><li><p>Períodos de chuva o elevam;</p></li></ul></li><li><p>Poço comum é utilizado nesse tipo de aquífero;</p></li></ul></li><li><p>Confinados</p><ul><li><p>Limite superior: Rocha semi permeável ou impermeável com trechos permeáveis  (zonas de recarga);</p></li><li><p>Limite inferior: Rocha impermeável;</p></li><li><p>São os <strong>mais profundos</strong> dos aquíferos;</p></li><li><p>Maiores reservas de água;</p></li><li><p>Seu uso pode ser ou não permitido;</p><ul><li><p>Pará: Belém, Alter do Chão, Santarém - Uso para abastecimento Urbano ;</p></li><li><p>MS: uso em períodos de seca para o Agro;</p></li></ul></li><li><p>Riscos de contaminação pelos defensivos agrícolas e contaminantes urbanos;</p></li></ul></li></ul></li></ul><h2>SAG-Guaraní:</h2><ul><li><p>Brasil (maior parte]), Paraguai, Uruguai e Argentina;</p><ul><li><p>MS com a maior parte;</p></li></ul></li><li><p>2° maior do mundo;</p></li><li><p>Importância natural muito grande;</p></li><li><p>Zonas de recarga do MS:</p><ul><li><p>Serra de Maracaju;</p></li><li><p>Margens do Rio Paraná na divisa MS-SP;</p></li></ul></li></ul><h2>SAGA-Amazonas:</h2><ul><li><p>Maior do mundo;</p></li><li><p>Brasil(maior parte), Venezuela, Guianas, Equador e Colômbia;</p></li><li><p>Todos os estados da região Norte, exceto TO;</p></li><li><p>Expansão da fronteira da soja pode gerar contaminação do aquífero por agrotóxicos;</p></li></ul><h2 data-corrido="sim">Bacia Hidrográfica:</h2><p>área drenada por um rio principal e seus afluentes;</p><ul><li><p>Elementos da composição:</p><ul><li><p>Nascente: regimes nival, pluvial, glacial e olho d’água;</p></li><li><p>Foz: estuário, mista ou delta (sedimentos ou produção);</p></li><li><p>Afluentes e subafluentes: alimentam o rio principal;</p></li><li><p>Divisor de águas: obstáculo de relevo que separa bacias hidrográficas;</p></li></ul></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/geografia/partes-de-um-rio.webp" alt="Bloco-diagrama de um rio com as partes anotadas: nascente e meandro na serra, confluência e afluente no meio do curso, e estuário, delta e foz na chegada ao mar." style="width:600px" data-largura="600px"></figure><ul><li><p>Rios perenes: aqueles que nunca secam totalmente mesmo na estiagem;</p><ul><li><p>Maior parte dos rios brasileiros;</p></li></ul></li><li><p>Rios intermitentes: aqueles que secam na estiagem;</p><ul><li><p>Afluentes do São Francisco no sertão nordestino;</p></li></ul></li><li><p>Montante: mais próximo da nascente;</p></li><li><p>Jusante: mais próximo da foz;</p></li></ul>',
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
   where materia_slug = 'geografia' and processo_slug = 'comum';
  if n_novos <> 31 then
    raise exception 'esperava 31 resumos de Geografia em comum, encontrei %', n_novos;
  end if;

  select count(*) into n_figuras
    from (select regexp_matches(corpo, '<figure', 'g') from resumos
           where materia_slug = 'geografia' and processo_slug = 'comum') x;
  if n_figuras <> 30 then
    raise exception 'esperava 30 figuras na Geografia, encontrei %', n_figuras;
  end if;

  select count(*) into n_titulos
    from (select titulo from resumos group by titulo having count(*) > 1) x;
  if n_titulos <> 0 then
    raise exception '% títulos repetidos no acervo', n_titulos;
  end if;
end $$;

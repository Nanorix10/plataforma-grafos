-- Importa a Química da 1ª etapa do PAS UEM.
--
-- Treze resumos, que são os tópicos escritos do documento. Os outros vinte da
-- matéria são a lista do edital, sem uma linha, e não entram.
--
-- ## Quinze equações nucleares estavam como IMAGEM, e agora são fórmula
--
-- Toda a notação de decaimento (a partícula alfa, a beta, o pósitron, o gama,
-- as duas leis de Soddy-Fajans, a fissão do urânio, a fusão do hidrogênio)
-- vinha no Docs como print. Print de equação não se seleciona, não acompanha o
-- tamanho da letra e tem fundo branco — no tema escuro do site seria um
-- retângulo aceso. As quinze entram como `block-math` na notação padrão
-- (número de massa em cima, atômico embaixo), e as trinta e duas fórmulas do
-- conjunto passaram pelo KaTeX antes de entrar: nenhuma falha.
--
-- Vinte imagens continuam imagens, porque ali o desenho É a explicação: o
-- diagrama de fases, os modelos atômicos, as setas das propriedades periódicas,
-- a curva da meia-vida, as fórmulas de Lewis e estrutural.
--
-- ## Dois exemplos resolvidos viraram questão com gaveta
--
-- O do polônio-218 (Fasm-SP) e o do volume de CO₂ na CNTP. No Docs a resolução
-- fica logo abaixo do enunciado, e o olho a lê antes de a cabeça tentar — é
-- exatamente o problema que o bloco `questao` + `resolucao` existe para
-- resolver. O texto é o mesmo, palavra por palavra; muda só quando a resposta
-- aparece. O do polônio tem duas gavetas, uma para cada item.
--
-- ## Três parágrafos foram remontados à mão
--
-- Onde o Docs põe rótulos flutuando por cima de uma imagem, a exportação
-- repete cada rótulo duas vezes e embaralha a ordem. São três casos: o
-- "Generalizando" do decaimento alfa (com "nº atômico = p" e "nº de massa =
-- p+n"), o diagrama da fissão ("Combustível nuclear", "Lixo nuclear",
-- "Energia") e o da fusão ("Muita Energia"). Cada rótulo aparece uma vez só, e
-- a equação que eles anotavam está logo acima.
--
-- Saíram três "imagens" que não são imagem: um espaçador de 1×1 pixel, o sinal
-- de + do diagrama da fissão (que a fórmula já traz) e a tarja "1 mol — 6·10²³
-- moléculas — 22,4 L — massa", que virou linha de texto.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- "Po₈₄²¹⁸cuja meia-vida" sem espaço, "n.º atômico", "eventos astrológicos"
-- (por astronômicos), "Misturas Heterogêneas (sólido-líquido);" fechando com
-- ponto e vírgula onde as irmãs usam dois pontos, e o "1ª E.I - energia para
-- remover o primeiro elétron <2ª E.I < 3 E.I" com o espaçamento torto.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'substancias',
  'Substâncias',
  'quimica',
  'pas-uem',
  'Simples, compostas, puras e misturas — os cortes com que a química classifica a matéria.',
  '<p>tipos de matéria que possuem uma composição fixa e propriedades bem definidas</p><h2 data-corrido="sim">Simples:</h2><p>com só um elemento químico;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/substancia-simples.webp" alt="Dois átomos de cloro, soltos e ligados: substância simples, com um só elemento químico." style="width:100%" data-largura="100%"></figure></li></ul><h2 data-corrido="sim">Compostas:</h2><p>com 2 ou mais elementos químicos;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/substancia-composta.webp" alt="Uma molécula de água, com um oxigênio e dois hidrogênios: substância composta." style="width:100%" data-largura="100%"></figure></li></ul><p>Podem ser ao mesmo tempo:</p><h2 data-corrido="sim">Puras:</h2><p>formadas por um único tipo de espécie química (átomos ou moléculas iguais), com composição e propriedades físicas constantes e bem definidas (densidade, ponto de fusão/ebulição), não se alterando mesmo com mudanças de estado físico;</p><ul><li><p>Ex: água destilada (H₂O), gás oxigênio (O₂), ouro (Au), sal de cozinha (NaCl);</p></li></ul><h2 data-corrido="sim">Misturas:</h2><p>união de duas ou mais substâncias puras (chamadas de componentes), onde cada uma mantém suas propriedades originais;</p><ul><li><p>Homogêneas (soluções): apresentam uma única fase visualmente uniforme em toda a sua extensão (ex: água com sal dissolvido, ar atmosférico);</p></li><li><p>Heterogêneas: apresentam duas ou mais fases, sendo possível notar partes diferentes a olho nu ou no microscópio (ex: água com óleo, granito, sangue);</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'propriedades-da-materia',
  'Propriedades da matéria',
  'quimica',
  'pas-uem',
  'As gerais, que toda matéria tem, e as específicas, que identificam cada substância.',
  '<p>características que permitem identificar, classificar e descrever a matéria em diferentes contextos;</p><h2 data-corrido="sim">Propriedades gerais:</h2><p>comuns a todos os tipos de matéria e não permitem diferenciar substâncias;</p><ul><li><p>Massa: quantidade de matéria que um corpo tem;</p><ul><li><p>Grandeza escalar medida em unidades do Sistema Internacional (SI), como o grama (g) e o quilograma (kg);</p></li></ul></li><li><p>Volume: medida quantitativa do espaço ocupado pela matéria;</p></li><li><p>Inércia: tendência de um corpo manter seu estado de movimento ou repouso;</p></li><li><p>Impenetrabilidade: indica que dois corpos não podem ocupar o mesmo lugar no espaço ao mesmo tempo;</p></li><li><p>Divisibilidade: a matéria pode ser dividida em partes cada vez menores;</p></li><li><p>Compressibilidade;</p></li><li><p>Elasticidade;</p></li></ul><h2 data-corrido="sim">Propriedades específicas:</h2><p>características únicas de cada substância que permitem identificar e diferenciar uma substância de outra;</p><h3 data-corrido="sim">Físicas:</h3><p>observadas sem alterar a composição da substância;</p><ul><li><p>Ponto de fusão (PF): temperatura na qual uma substância muda do estado sólido para o estado líquido, mantendo a pressão constante;</p></li><li><p>Ponto de ebulição (PE): temperatura na qual uma substância líquida passa para o estado gasoso, quando a pressão de vapor da substância se iguala à pressão externa;</p></li><li><p>Densidade: grau de compactação da matéria num determinado espaço;</p></li><li><p>Solubilidade: capacidade de uma substância se dissolver em outra, formando uma solução homogênea;</p></li><li><p>Condutividade elétrica: capacidade de uma substância conduzir corrente elétrica;</p></li><li><p>Magnetismo: propriedade de um material atrair ou repelir outros materiais magnéticos;</p></li><li><p>Dureza: resistência de um material à penetração ou abrasão;</p></li><li><p>Viscosidade: resistência de um fluido ao escoamento;</p></li></ul><h3 data-corrido="sim">Químicas:</h3><p>características de uma substância que se manifestam durante uma reação química, ou seja, quando a substância se transforma em outra;</p><ul><li><p>Combustibilidade: capacidade de uma substância queimar em presença de oxigênio;</p></li><li><p>Reatividade: facilidade com que uma substância reage com outras;</p></li><li><p>Oxidação: tendência de uma substância a perder elétrons;</p></li><li><p>Corrosividade: capacidade de uma substância corroer ou desgastar outros materiais;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'mudancas-de-estado-fisico',
  'Mudanças de estado físico',
  'quimica',
  'pas-uem',
  'Fusão, ebulição e o diagrama de fases, com o ponto triplo e o ponto crítico.',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/mudancas-de-estado.webp" alt="As mudanças de estado em ciclo: fusão, vaporização e sublimação são endotérmicas; solidificação, condensação e sublimação inversa são exotérmicas." style="width:100%" data-largura="100%"></figure><h2 data-corrido="sim">Ponto de fusão:</h2><p>temperatura na qual uma substância deixa de ser sólida e passa a ser líquida;</p><h2 data-corrido="sim">Ponto de ebulição:</h2><p>temperatura na qual uma substância deixa de ser líquida e passa a ser gasosa;</p><h2>Exemplos</h2><ul><li><p>S → L: gelo derretendo</p></li><li><p>L → G: água evaporando</p></li><li><p>G → L: o vapor da água quente do banho ao “encostar” na vidro do box, fica líquida</p></li><li><p>L → S: congelamento do gelo</p></li><li><p>S → G: naftalina</p></li><li><p>G → S: gelo seco</p></li></ul><h2 data-corrido="sim">Diagrama de fases:</h2><p>gráfico (pressão x temperatura) que mostra as regiões de estabilidade dos estados sólido, líquido e vapor de uma substância, delimitadas por curvas de equilíbrio;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/diagrama-de-fases.webp" alt="Diagrama de fases da água pura, com as regiões sólida, líquida e gasosa, o ponto triplo e o ponto crítico." style="width:100%" data-largura="100%"></figure></li><li><p>Ponto triplo: condições de temperatura e pressão em que podem existir, simultaneamente, estado sólido, líquido e gasoso;</p></li><li><p>Ponto crítico: condições de temperatura e pressão nas quais as fases líquida e gasosa se tornam indistinguíveis, formando um fluido homogêneo;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'processos-de-separacao-de-misturas',
  'Processos de separação de misturas',
  'quimica',
  'pas-uem',
  'Qual técnica serve para cada tipo de mistura, da filtração à cromatografia.',
  '<h2>Misturas Heterogêneas (sólido-líquido);</h2><ul><li><p>Filtração: separa um sólido insolúvel de um líquido, passando a mistura por um filtro (papel filtro, funil).</p></li><li><p>Decantação: o sólido mais denso deposita-se no fundo do recipiente por gravidade, e o líquido é despejado com cuidado.</p></li><li><p>Centrifugação: acelera a decantação usando força centrífuga (rotação), útil quando as partículas são muito pequenas ou leves.</p></li></ul><h2>Misturas Heterogêneas (sólido-sólido)</h2><ul><li><p>Peneiração/Tamisação: separa sólidos de tamanhos diferentes usando peneiras;</p></li><li><p>Separação magnética: usa um ímã para remover materiais magnéticos (como ferro) de uma mistura;</p></li><li><p>Levigação: usa uma corrente de água para arrastar o material mais leve, deixando o mais denso;</p></li><li><p>Ventilação: usa uma corrente de ar para separar partículas leves de pesadas;</p></li><li><p>Catação: separação manual, útil quando os componentes têm tamanhos/formas visíveis e diferentes</p></li></ul><h2>Misturas Heterogêneas (líquido-líquido, imiscíveis)</h2><ul><li><p>Decantação (funil de separação): separa líquidos que não se misturam (como água e óleo), aproveitando a diferença de densidade;</p></li></ul><h2>Misturas Homogêneas (sólido dissolvido em líquido)</h2><ul><li><p>Evaporação: o líquido evapora, deixando o sólido dissolvido como resíduo (ex: obter sal da água do mar);</p></li><li><p>Destilação simples: aquece a mistura para evaporar o líquido, que depois é condensado e recolhido separadamente — permite recuperar tanto o sólido quanto o líquido.</p></li></ul><h2>Misturas Homogêneas (líquido-líquido, miscíveis)</h2><ul><li><p>Destilação fracionada: separa líquidos com pontos de ebulição diferentes, usando uma coluna de fracionamento (ex: separação dos componentes do petróleo, produção de álcool).</p></li></ul><h2>Outras técnicas</h2><ul><li><p>Cromatografia: separa componentes de uma mistura com base na velocidade com que se movem através de um material (papel, por exemplo), muito usada para misturas complexas ou em pequenas quantidades.</p></li><li><p>Sublimação: aproveita quando um dos componentes passa diretamente do estado sólido para o gasoso (ex: separar iodo de areia);</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'modelos-atomicos',
  'Modelos atômicos',
  'quimica',
  'pas-uem',
  'De Dalton a Rutherford-Bohr: o que cada modelo explicava e o que ficou de cada um.',
  '<p>teorias criadas para explicar a composição e o funcionamento da matéria;</p><ul><li><p>No século V a.C, na Grécia Antiga, os filósofos Leucipo e Demócrito propuseram a existência de partículas pequenas, indivisíveis e indestrutíveis que eles acreditavam ser a unidade constituinte da matéria;</p></li></ul><h2 data-corrido="sim">1. Modelo de Dalton:</h2><p>modelo da “bola de bilhar”;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/cores-dos-elementos.webp" alt="A cor convencional de cada átomo nos modelos: hidrogênio, flúor, oxigênio, nitrogênio, carbono, cloro, enxofre e fósforo." style="width:100%" data-largura="100%"></figure></li><li><p>Primeira teoria proposta para tentar explicar a construção da matéria;</p></li><li><p>O átomo é uma esfera maciça, homogênea, indivisível e indestrutível;</p></li><li><p>Um elemento químico é definido pelo peso do seu átomo;</p></li><li><p>Uma reação química ocorre mediante a simples reorganização dos átomos, os quais mantêm a sua identidade;</p></li></ul><h2 data-corrido="sim">2. Modelo de Thomson:</h2><p>modelo do “pudim de passas”</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/modelo-de-thomson.webp" alt="Esfera positiva com elétrons distribuídos por toda ela: o pudim de passas de Thomson." style="width:500px" data-largura="500px"></figure></li><li><p>O átomo possui natureza elétrica, é divisível e formado por partículas subatômicas;</p></li><li><p>É eletricamente neutro, possuindo a mesma quantidade de partículas negativas e positivas;</p></li><li><p>As cargas elétricas negativas estão uniformemente distribuídas ao redor do núcleo positivo, por repulsão eletrostática;</p></li></ul><h2 data-corrido="sim">3. Modelo de Rutherford:</h2><p>modelo do sistema planetário;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/modelo-de-rutherford.webp" alt="Núcleo ao centro e elétrons em órbita ao redor: o modelo planetário de Rutherford." style="width:100%" data-largura="100%"></figure></li><li><p>O átomo é formado por duas principais regiões:</p></li></ul><h3 data-corrido="sim">Núcleo:</h3><p>região central do átomo;</p><ul><li><p>Apresenta alta massa e alta densidade por concentrar as partículas de carga elétrica positiva (prótons) e partículas sem carga (nêutrons) em um pequeno volume;</p></li></ul><h3 data-corrido="sim">Eletrosfera:</h3><p>região em torno do núcleo que abriga os elétrons;</p><ul><li><p>Como os elétrons são partículas minúsculas, assume-se que a eletrosfera é formada por extensos espaços vazios, por isso possui baixa densidade;</p></li></ul><h2 data-corrido="sim">4. Modelo de Rutherford-Bohr:</h2><p>evolução do modelo de Rutherford</p><ul><li><p>A eletrosfera é formada por camadas de energia nas quais se distribuem os elétrons;</p></li><li><p>Os elétrons ocupam camadas eletrônicas com valores pré-definidos de energia;</p></li><li><p>Transição eletrônica: os elétrons apenas transitam para uma camada de maior energia ao absorver energia de uma fonte externa, situação em que ficam instáveis. Para retomar a estabilidade, os elétrons retornam ao seu nível inicial, liberando a energia absorvida sob a forma de luz ou calor;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/transicao-eletronica.webp" alt="O elétron sobe de camada ao receber energia e volta ao nível inicial liberando a mesma energia." style="width:100%" data-largura="100%"></figure></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'tabela-periodica',
  'Tabela Periódica',
  'quimica',
  'pas-uem',
  'A estrutura da tabela e as propriedades que crescem numa direção e diminuem na outra.',
  '<p>modelo que agrupa todos os elementos químicos conhecidos e suas propriedades;</p><h2>Estrutura</h2><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/tabela-periodica-blocos.webp" alt="A tabela periódica dividida nos blocos s, p, d e f, com os grupos numerados de 1 a 18." style="width:100%" data-largura="100%"></figure></li><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/tabela-periodica-familias.webp" alt="As famílias da tabela: metais alcalinos, alcalinoterrosos, de transição, as famílias 3A a 8A e os metais de transição interna." style="width:600px" data-largura="600px"></figure></li></ul><h2>Propriedades Periódicas</h2><h3 data-corrido="sim">Eletroafinidade:</h3><p>capacidade de um átomo em capturar elétrons, com proporcional liberação de energia. (Direita e para cima).</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/eletroafinidade.webp" alt="Na tabela, a eletroafinidade cresce da esquerda para a direita e de baixo para cima." style="width:400px" data-largura="400px"></figure><h3 data-corrido="sim">Volume atômico:</h3><p>volume ocupado por 1 mol de átomos (<span data-type="inline-math" data-latex="6⋅{10}^{23}"></span>átomos). (Saindo do meio e para baixo).</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/volume-atomico.webp" alt="Na tabela, o volume atômico cresce do meio para as bordas e de cima para baixo." style="width:293px" data-largura="293px"></figure><h3 data-corrido="sim">Densidade:</h3><p>relação entre massa e o volume ocupado. (Ao meio e para baixo).</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/densidade-periodica.webp" alt="Na tabela, a densidade cresce das bordas para o meio e de cima para baixo." style="width:100%" data-largura="100%"></figure><h3 data-corrido="sim">Caráter metálico:</h3><p>capacidade de perder elétrons. (Esquerda e para baixo).</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/carater-metalico.webp" alt="Na tabela, o caráter metálico cresce da direita para a esquerda e de cima para baixo." style="width:608px" data-largura="608px"></figure><h3 data-corrido="sim">Raio atômico:</h3><p>distância média do núcleo ao elétron mais externo desse átomo;</p><ul><li><p>Ao transformar-se em íon, o raio atômico se vê alterado: se virou cátion, o raio diminui; se virou ânion, o raio aumenta.</p></li><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/raio-atomico.webp" alt="Na tabela, o raio atômico cresce da direita para a esquerda e de cima para baixo." style="width:600px" data-largura="600px"></figure></li></ul><h3 data-corrido="sim">Potencial (ou energia) de ionização:</h3><p>energia necessária à remoção de um elétron na C.V. (em kJ, kcal ou eV)</p><ul><li><p>1ª E.I - energia para remover o primeiro elétron &lt;2ª E.I &lt; 3 E.I &lt; …</p></li><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/energia-de-ionizacao.webp" alt="Na tabela, a energia de ionização cresce da esquerda para a direita e de baixo para cima." style="width:491px" data-largura="491px"></figure></li></ul><h3 data-corrido="sim">Ponto de fusão:</h3><p>determinados experimentalmente;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/ponto-de-fusao-periodico.webp" alt="Na tabela, o ponto de fusão cresce das bordas para o meio, com o carbono e o tungstênio nos extremos." style="width:380px" data-largura="380px"></figure></li></ul><h2 data-corrido="sim">Propriedades aperiódicas:</h2><p>características dos elementos químicos cujos valores não se repetem em intervalos regulares na tabela periódica, mas tendem a aumentar ou diminuir continuamente com o aumento do número atômico;</p><ul><li><p>Massa atômica: própria massa do átomo medida em unidades de massa atômica;</p></li><li><p>Calor específico: quantidade de calor necessária para aumentar em 1 °C a temperatura de 1 g da substância sem que ocorra alteração do estado físico;</p></li><li><p>Dureza: propriedade física de substâncias no estado sólido e se refere à sua resistência a danos, riscos ou penetração quando pressionadas;</p></li><li><p>Índice de refração: propriedade física e se relaciona com a diferença da velocidade da luz em dois meios diferentes;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ligacao-ionica',
  'Ligação iônica',
  'quimica',
  'pas-uem',
  'A ligação entre metal e não-metal, e o que ela faz com o ponto de fusão e a condução.',
  '<p>tipo de ligação química que ocorre entre átomos com grande diferença de eletronegatividade, geralmente entre um metal e um não-metal, ou entre um metal e o hidrogênio.</p><ul><li><p>Elevados pontos de fusão (&gt;600 °C) e pontos de ebulição.</p></li><li><p>Estrutura sólida e cristalina que não permite condução de elétrons, sendo condutores somente fundidos ou dissolvidos em água (substância polar).</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ligacao-molecular-covalente',
  'Ligação molecular (covalente)',
  'quimica',
  'pas-uem',
  'Compartilhamento de pares de elétrons entre ametais, com a fórmula de Lewis e a estrutural.',
  '<p>ocorre por compartilhamento de pares de elétrons entre ametais.</p><ul><li><p>Os pares de elétrons compartilhados promovem o octeto dos átomos envolvidos, com exceção do hidrogênio, berílio e boro.</p></li><li><p>Moléculas com mais que dois átomos apresentam um átomo central no qual se identificam os pares ligantes e os pares não-ligantes;</p></li><li><p>Ligações coordenadas: átomos de oxigênio fazem uso dos pares livres no átomo central.</p></li></ul><h2>Fórmula de Lewis</h2><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/formula-de-lewis.webp" alt="Fórmula de Lewis do gás carbônico, com os pares de elétrons entre o carbono e cada oxigênio." style="width:106px" data-largura="106px"></figure></li></ul><h2>Fórmula estrutural</h2><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/formula-estrutural.webp" alt="Fórmula estrutural do metano: o carbono no centro, ligado a quatro hidrogênios por traços." style="width:254px" data-largura="254px"></figure></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'forcas-de-interacao-molecular',
  'Forças de interação molecular',
  'quimica',
  'pas-uem',
  'Íon-dipolo, ligação de hidrogênio, dipolo-dipolo e London — e o que cada uma faz com as propriedades.',
  '<p>forças de natureza elétrica entre moléculas; interferem diretamente nas propriedades físico-químicas apresentadas pelas substâncias;</p><h2 data-corrido="sim">Íon-Dipolo:</h2><p>interação mais intensa entre uma molécula polar e um íon;</p><h2 data-corrido="sim">Interações de Hidrogênio:</h2><p>interação de força forte entre moléculas que contêm H ligado a F-O-N (os mais eletronegativos);</p><h2 data-corrido="sim">Dipolo-Dipolo (Dipolo-permanente):</h2><p>interação de força média entre moléculas polares;</p><h2 data-corrido="sim">Dipolo-induzido (Forças de London):</h2><p>interação de força fraca entre moléculas apolares; aparece pela polarização efêmera de uma molécula pelo movimento aleatório dos elétrons;</p><h2>Propriedades dos compostos influenciadas pelas interações</h2><ul><li><p>Ponto de Fusão e Ebulição: quanto mais fortes forem as forças intermoleculares, mais energia é necessária para separá-las e fazer a substância mudar de estado;</p></li><li><p>Solubilidade: substâncias com interações semelhantes são mais solúveis entre si</p><ul><li><p>Polar dissolve polar e apolar dissolve apolar;</p></li></ul></li><li><p>Densidade: quanto mais fortes forem as interações, maior a densidade da fase, pois as moléculas estão mais compactadas;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

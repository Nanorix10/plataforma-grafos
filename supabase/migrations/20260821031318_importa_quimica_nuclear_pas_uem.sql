-- Segunda metade da Química do PAS UEM: a parte nuclear e o mol.
--
-- Continua a `importa_quimica_pas_uem` (mesma leva, mesmo documento). Quatro
-- resumos: Radioatividade, Decaimentos radioativos, Reações nucleares e
-- Princípio de Avogadro. Está separada só porque a primeira já era grande — as
-- decisões são as mesmas, e estão escritas lá.
--
-- É aqui que moram as quinze equações que no Docs eram print e agora são
-- `block-math`, e as duas questões que ganharam gaveta de resolução.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'radioatividade',
  'Radioatividade',
  'quimica',
  'pas-uem',
  'As emissões alfa, beta e gama, com as duas leis de Soddy-Fajans.',
  '<p>fenômeno no qual um núcleo instável (energeticamente desbalanceado) se transforma em um núcleo estável emitindo radiações na forma de ondas ou partículas;</p><ul><li><p>Fenômeno natural ou artificial exclusivamente de origem nuclear;</p></li><li><p>Foi descoberta por Henry Becquerel, observando manchas em filmes fotográficos provocadas por um minério de urânio;</p></li><li><p>Marie e Pierre Curie descobriram os elementos rádio (Ra) e polônio (Po) pelo minério de urânio que continha impurezas mais radioativas que o urânio e batizaram o fenômeno como radioatividade;</p></li><li><p>Marie Curie e Rutherford definiram o modelo atômico planetário, onde o átomo é dividido em um núcleo com prótons e nêutrons e a eletrosfera com elétrons;</p></li></ul><h2>Principais emissões radioativas</h2><h3 data-corrido="sim">Radiação ou Partículas α:</h3><p>núcleos de Hélio lançadas para fora do núcleo atômico;</p><ul><li><div data-type="block-math" data-latex="{}_{2}^{4}\alpha"></div></li><li><p>Possui carga <span data-type="inline-math" data-latex="+2"></span>;</p></li><li><p>Possui baixo poder de penetração, porém alto poder ionizante (transformar átomos em íons);</p></li><li><p>Provoca queimaduras na parte profunda da pele, originando feridas que não cicatrizam;</p></li><li><p>São lentas (2.000 km/s) e pesadas;</p></li><li><p>1ª Lei de Soddy-Fajans: ao emitir uma partícula α , o átomo terá uma redução de 4 unidades de massa e 2 unidades de n.º atômico;</p></li></ul><p>Generalizando:</p><div data-type="block-math" data-latex="{}_{Z}^{A}E \rightarrow {}_{2}^{4}\alpha + {}_{Z-2}^{A-4}E''"></div><ul><li><p>nº atômico = p</p></li><li><p>nº de massa = p+n</p></li></ul><ul><li><p>Ex:</p><div data-type="block-math" data-latex="{}_{92}^{235}U \rightarrow {}_{2}^{4}\alpha + {}_{90}^{231}Th"></div></li></ul><h3 data-corrido="sim">Radiação ou partículas <span data-type="inline-math" data-latex="β^-"></span>:</h3><p>elétrons de alta energia;</p><ul><li><div data-type="block-math" data-latex="{}_{-1}^{0}\beta"></div></li><li><p>Por serem elétrons apresentam massa muito pequena e possuem carga negativa;</p></li><li><p>Originadas da quebra do nêutron no núcleo;</p><ul><li><div data-type="block-math" data-latex="{}_{0}^{1}n \rightarrow {}_{1}^{1}p + {}_{-1}^{0}e + {}_{0}^{0}\nu"></div></li></ul></li><li><p>Médio poder de penetração (provoca efeitos fisiológicos graves);</p></li><li><p>Velocidade de 280.000 km/s;</p></li><li><p>2ª Lei de Soddy-Fajans: ao emitir uma partícula β, o átomo tem a massa inalterada (isóbaro) e aumenta de 1 unidade o n.º atômico (originado da quebra do nêutron);</p><ul><li><p>Generalizando:</p><div data-type="block-math" data-latex="{}_{Z}^{A}E \rightarrow {}_{-1}^{0}\beta + {}_{Z+1}^{A}E''"></div></li><li><p>Ex:</p><div data-type="block-math" data-latex="{}_{83}^{210}Bi \rightarrow {}_{-1}^{0}\beta + {}_{84}^{210}Po"></div></li></ul></li></ul><h3 data-corrido="sim">Radiação ou partículas <span data-type="inline-math" data-latex="β^+"></span>:</h3><p>pósitrons (antipartícula do elétron) de alta energia;</p><ul><li><div data-type="block-math" data-latex="{}_{+1}^{0}\beta"></div></li><li><p>Surge quando um próton se transforma em um nêutron, emitindo um pósitron e um neutrino;</p><ul><li><div data-type="block-math" data-latex="{}_{1}^{1}p \rightarrow {}_{0}^{1}n \rightarrow {}_{+1}^{0}\beta + {}_{0}^{0}\gamma + {}_{0}^{0}\nu"></div></li></ul></li><li><p>Muito mais rara que a emissão de partículas alfa e beta -;</p></li></ul><h3 data-corrido="sim">Radiação γ:</h3><p>onda eletromagnética de altíssima energia;</p><ul><li><div data-type="block-math" data-latex="{}_{0}^{0}\gamma"></div></li><li><p>Velocidade de propagação igual à velocidade da luz: 300.000.000 m/s;</p></li><li><p>Alto poder de penetração;</p></li><li><p>Não costuma aparecer em equações nucleares, pois não altera o n.º atômico nem o n.º de massa;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'decaimentos-radioativos',
  'Decaimentos radioativos',
  'quimica',
  'pas-uem',
  'Meia-vida e as duas expressões que dizem quanto sobra da amostra depois de um tempo.',
  '<p>transformação espontânea do núcleo de um átomo instável, acompanhada da emissão de partículas ou radiação, resultando na formação de um novo isótopo ou de um átomo de outro elemento químico;</p><h2 data-corrido="sim">Meia-vida:</h2><p>tempo necessário para a desintegração da metade da amostra radioativa;</p><ul><li><p>É constante e não é afetada por condições externas;</p></li><li><p>Variam de elemento químico para elemento químico, podendo durar segundos ou até bilhões de anos;</p></li><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/curva-de-meia-vida.webp" alt="A massa do isótopo cai pela metade a cada meia-vida: 100%, 50%, 25%, 12,5%." style="width:100%" data-largura="100%"></figure><div data-type="block-math" data-latex="\frac{100\%}{2^0} \rightarrow \frac{100\%}{2^1} \rightarrow \frac{100\%}{2^2} \rightarrow \frac{100\%}{2^3}"></div></li></ul><ul><li><p>Existem duas expressões matemáticas para calcular os decaimentos radioativos:</p><ul><li><p><span data-type="inline-math" data-latex="\frac{A_0}{A_f}=\frac{m_0}{m_f}=2^x"></span></p><ul><li><p>A<sub>0</sub>: atividade inicial;</p></li><li><p>A<sub>f</sub>: atividade final;</p></li><li><p>x: número de intervalos de meia-vida;</p></li></ul></li><li><p><span data-type="inline-math" data-latex="t=x⋅P"></span></p><ul><li><p>t: tempo total de decaimento;</p></li><li><p>x: número de intervalos de meia-vida;</p></li><li><p>P: tempo de um período de meia-vida;</p></li></ul></li></ul></li></ul><aside class="questao"><p>Ex: (Fasm-SP) Numa sequência de desintegração radioativa que se inicia com o Po<sub>84</sub><sup>218</sup>cuja meia-vida é de 3 minutos, a emissão de uma partícula alfa gera o radioisótopo X, que, por sua vez, emite uma partícula beta, produzindo Y.</p><p>a) Partindo-se de 40 g de polônio-218, qual a massa, em gramas, restante após 12 minutos de desintegração? Apresente os cálculos.</p><div class="resolucao"><p>Resolução:</p><p><span data-type="inline-math" data-latex="m_f= ?"></span></p><p><span data-type="inline-math" data-latex="t=x⋅P→12=x⋅3"></span></p><p><span data-type="inline-math" data-latex="x=4"></span></p><p><span data-type="inline-math" data-latex="\frac{m_0}{m_f}=2^x→\frac{40}{m_f}=2^4=16"></span></p><p><span data-type="inline-math" data-latex="m_f=\frac{40}{16}=2,5 g"></span></p></div><p>b) Identifique os radioisótopos X e Y, indicando suas respectivas massas atômicas.</p><div class="resolucao"><p>Resolução:</p><p><span data-type="inline-math" data-latex="{Po}_{84}^{218}→α_2^4+Pb_{82}^{214}→β_{-1}^0+Bi_{83}^{214}"></span></p><p><span data-type="inline-math" data-latex="X=Pb_{82}^{214} Y=Bi_{83}^{214}"></span></p></div></aside>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'reacoes-nucleares',
  'Reações nucleares',
  'quimica',
  'pas-uem',
  'Transmutação, fissão e fusão — as três formas de mexer no núcleo.',
  '<h2 data-corrido="sim">Transmutação:</h2><p>transformação de um elemento químico em outro por meio de uma série de reações nucleares;</p><ul><li><p>Natural: transformação espontânea de um núcleo atômico em outro;</p><ul><li><p>Ex:</p><div data-type="block-math" data-latex="{}_{92}^{238}U \rightarrow {}_{2}^{4}\alpha + {}_{90}^{234}Th"></div></li></ul></li><li><p>Artificial: induzida por bombardeamento com partículas subatômicas;</p><ul><li><p>Ex:</p><div data-type="block-math" data-latex="{}_{7}^{14}N + {}_{2}^{4}\alpha \rightarrow {}_{8}^{17}O + {}_{1}^{1}p"></div></li></ul></li></ul><h2 data-corrido="sim">Fissão nuclear:</h2><p>quebra de um núcleo atômico pesado em dois núcleos menores, liberando uma enorme quantidade de energia;</p><div data-type="block-math" data-latex="{}_{92}^{235}U + {}_{0}^{1}n \rightarrow {}_{96}^{141}Ba + {}_{36}^{92}Kr + 3\,{}_{0}^{1}n"></div><ul><li><p>Combustível nuclear</p></li><li><p>Lixo nuclear</p></li><li><p>Energia</p></li></ul><ul><li><p>A energia liberada pode ser usada na geração de energia elétrica;</p></li><li><p>O urânio/plutônio também pode ser usado como combustível de submarinos e sondas-espaciais;</p></li></ul><h2 data-corrido="sim">Fusão nuclear:</h2><p>união de núcleos atômicos leves para formar um núcleo mais pesado, liberando uma quantidade 10 vezes maior de energia que a fissão.</p><div data-type="block-math" data-latex="{}_{1}^{2}H + {}_{1}^{3}H \rightarrow {}_{2}^{4}He + {}_{0}^{1}n"></div><ul><li><p>Muita Energia</p></li></ul><ul><li><p>Ocorre no Sol e em outras estrelas e eventos astrológicos;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'principio-de-avogadro',
  'Princípio de Avogadro',
  'quimica',
  'pas-uem',
  'Volumes iguais, mesmo número de moléculas: o mol e os 22,4 L da CNTP.',
  '<p>volumes iguais de gases diferentes, nas mesmas condições de temperatura e pressão, contêm o mesmo número de moléculas (e de mols);</p><h2 data-corrido="sim">Volume molar:</h2><p>espaço ocupado por 1 mol de qualquer gás;</p><ul><li><p>1 mol de qualquer gás ocupará o volume de 22,4 L na CNTP.</p></li></ul><p>1 mol — 6·10<sup>23</sup> moléculas — 22,4 L — massa</p><p>(massa em g/mol ou só g)</p><aside class="questao"><p>Ex: calcule o volume ocupado por 10g de CO<sub>2</sub> nas CNTP. (Dados: <span data-type="inline-math" data-latex="C=12; O=16"></span>)</p><div class="resolucao"><p>Resolução:</p><p><span data-type="inline-math" data-latex="1⋅12+2⋅16=12+32=44 g/mol"></span></p><p><span data-type="inline-math" data-latex="\frac{44g CO_2}{10g CO_2}=\frac{22,4 L}{x} ⇒ 44x=224 ⇒ x=\frac{224}{44}"></span></p><p><span data-type="inline-math" data-latex="x=5L CO_2"></span></p></div></aside>',
  null
)
on conflict (slug) do nothing;

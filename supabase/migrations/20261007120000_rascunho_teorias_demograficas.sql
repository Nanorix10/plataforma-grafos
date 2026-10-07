-- Primeiro resumo escrito no modelo de `docs/produto/modelo-de-resumo.md`:
-- Teorias demográficas, rascunhado por Claude e revisado pelo autor.
--
-- **Isto NÃO é migração no sentido da decisão 9c.** É o modo de autoria que o
-- modelo criou (§5): texto novo, com o caderno do autor como base, que só vira
-- acervo quando o autor aprovar o PR. Aprovar o PR é publicar.
--
-- ## Por que este tópico
--
-- É lacuna real nos dois editais que trazem o assunto, conferida no banco em
-- 07/10/2026 — nenhum resumo cita Malthus:
--
-- - PAS UEM, 3ª etapa: `Teorias demográficas.`
-- - PASSE, 2ª etapa: `As teorias populacionais (Malthusiana, Neomalthusiana e
--   Reformista) e a dinâmica populacional brasileira, por regiões: …`
--
-- Por estar nos dois, o processo é `comum` (decisão 1c).
--
-- ## Fontes, na ordem de autoridade do modelo
--
-- 1. **Caderno do autor**: `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para
--    PR2G2.docx`, seção `GEOGRAFIA A`, parágrafos 00035–00049 do extrator. As
--    quatro teorias, as quatro soluções e a tabela vêm de lá. A tabela entra
--    como está.
-- 2. **Edital**: os dois tópicos acima.
-- 3. **Prova real**: PAS-UEM 2015, etapa 3, questão 32 (gabarito 26), em
--    `Documents/UEM-Provas/pdfs/pas15/E3G1Geografia.pdf`, p. 2. Dela saem o nome
--    de Thomas Malthus, o pós-guerra da neomalthusiana, a explosão demográfica
--    de 1950–1970, a década de 1970 da ecomalthusiana, o nome "antimalthusiana"
--    e as duas primeiras pegadinhas (itens 01 e 04, os falsos).
-- 4. **Livro didático**: só explicação e exemplo. Cada trecho desses está
--    listado na descrição do PR, para o autor conferir.
--
-- ## O que difere do caderno, de propósito
--
-- - **A ordem das teorias é a cronológica** (malthusiana → neomalthusiana →
--   reformista → ecomalthusiana), e não a do caderno (reformista em segundo). A
--   reformista é resposta à neomalthusiana; lida antes dela, responde a algo
--   que o aluno ainda não viu. A tabela do autor mantém a ordem original.
-- - Nenhum dado numérico além dos que a prova traz. O exemplo de progressões
--   (1, 2, 4, 8, 16 contra 1, 2, 3, 4, 5) é ilustração, não estatística.
--
-- ## O edital ganha um tópico, não dois
--
-- Casa só o do PAS UEM, que é exato. O do PASSE pede também a dinâmica
-- populacional brasileira por regiões, que este resumo toca em uma seção e não
-- cobre; marcá-lo cobriria pela metade — o mesmo critério que deixou
-- `Arte Medieval` sem casar em `20260918120000`.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'teorias-demograficas',
  'Teorias demográficas',
  'geografia',
  'comum',
  'Quatro explicações para a relação entre população e pobreza — qual causa qual — e o que cada uma propõe fazer.',
  '<p>As teorias demográficas tentam explicar a relação entre o crescimento da população, os recursos disponíveis e a pobreza. São quatro, e todas respondem à mesma pergunta: <em>é o crescimento da população que causa a pobreza, ou é a pobreza que faz a população crescer?</em></p>
<p>Três delas dizem que a população vem primeiro e mudam só o motivo e o remédio. A quarta inverte a seta. Guardar essa pergunta é o que separa as quatro na prova.</p>
<h2>Teoria malthusiana</h2>
<p>Formulada por Thomas Malthus, parte de uma conta: a <strong>população cresceria em progressão geométrica</strong>, enquanto a <strong>produção de alimentos cresceria apenas em progressão aritmética</strong>.</p>
<p>Por que isso leva à fome: na progressão geométrica, cada geração multiplica a anterior (1, 2, 4, 8, 16…); na aritmética, cada geração só soma o mesmo tanto (1, 2, 3, 4, 5…). Em cinco passos, a população ficou 16 vezes maior e a comida, 5 vezes — e a distância entre as duas só aumenta. Por isso a teoria conclui que faltariam recursos naturais para alimentar todos.</p>
<p>A solução proposta por Malthus foi a <strong>sujeição moral</strong>: o <strong>adiamento do casamento</strong> e a <strong>abstinência sexual</strong>, para conter o nascimento de novos indivíduos.</p>
<p>A previsão não se cumpriu como ele imaginou: a produção de alimentos cresceu muito mais depressa que uma progressão aritmética, com a mecanização e as novas técnicas agrícolas. Mas a ideia de que os recursos são limitados voltou, com outra roupa, nas duas teorias que levam o nome dele.</p>
<h2>Teoria neomalthusiana</h2>
<p>Surgiu depois da Segunda Guerra Mundial, quando a população do planeta cresceu como nunca — o ritmo mais alto foi entre 1950 e 1970, a chamada <strong>explosão demográfica</strong>. Ela mantém a seta de Malthus, mas troca o motivo: defende que o <strong>crescimento populacional acelerado é a causa da pobreza</strong>.</p>
<p>O raciocínio já não é sobre comida, e sim sobre dinheiro público: quanto mais filhos uma família pobre tem, menos recursos o Estado tem para investir em infraestrutura e desenvolvimento econômico. Pense num país que, a cada geração, precisa construir o dobro de escolas e postos de saúde só para atender quem nasceu: sobra pouco para estradas, energia e indústria, e ele continua pobre.</p>
<p>A solução proposta: <strong>planejamento familiar rígido</strong> e uso em massa de <strong>métodos contraceptivos</strong> (pílulas, preservativos).</p>
<h2>Teoria reformista</h2>
<p>Também chamada de <strong>antimalthusiana</strong>, é a visão oposta à neomalthusiana, baseada em ideais sociais e críticos ao capitalismo. Ela inverte a seta: a superpopulação <strong>não é a causa, mas sim a consequência da pobreza</strong>.</p>
<p>O porquê: em países com grandes desigualdades sociais e falta de acesso à educação e à saúde, as famílias tendem a ter mais filhos. Onde muitas crianças morrem cedo e não há aposentadoria, ter muitos filhos é a garantia de que alguns cheguem à idade adulta, ajudem no trabalho e amparem os pais na velhice. Quando a vida melhora, esse motivo desaparece — e a natalidade cai sem que ninguém precise proibir nada. É a mesma lógica de [[Desigualdade social]]: o problema está em como a riqueza se distribui, não em quantas pessoas existem.</p>
<p>A solução proposta: <strong>reformas socioeconômicas</strong>, como melhor distribuição de renda e acesso à educação, que naturalmente levariam à queda da natalidade.</p>
<h2>Teoria ecomalthusiana</h2>
<p>Proposta na década de 1970, traz Malthus de volta pelo lado da natureza: o crescimento desenfreado da população exerce uma <strong>pressão insustentável sobre os recursos naturais</strong> da Terra — água, solo e energia (ver [[Fontes de energia]]).</p>
<p>É "malthusiana" porque repete a ideia central de Malthus — os recursos são limitados e a população cresce mais rápido do que eles —, só que o recurso que falta deixou de ser o alimento e passou a ser o meio ambiente. A pressão seria maior na zona intertropical, que reúne a maior biodiversidade do planeta e a maioria dos países pobres.</p>
<p>A solução proposta: <strong>preservação ambiental</strong> aliada ao <strong>controle do crescimento populacional</strong>, para garantir a sobrevivência do planeta.</p>
<h2>As quatro lado a lado</h2>
<table><tbody><tr><th><p><strong>Teoria</strong></p></th><th><p><strong>Causa da pobreza</strong></p></th><th><p><strong>Solução</strong></p></th></tr><tr><td><p>Malthusiana</p></td><td><p>Desequilíbrio entre população e alimentos</p></td><td><p>Abstinência sexual e casamento tardio</p></td></tr><tr><td><p>Neomalthusiana</p></td><td><p>Ter muitos filhos causa a pobreza do país</p></td><td><p>Métodos contraceptivos (pílulas, preservativos)</p></td></tr><tr><td><p>Reformista</p></td><td><p>A pobreza e má distribuição causam excesso de filhos</p></td><td><p>Reformas sociais e educação</p></td></tr><tr><td><p>Ecomalthusiana</p></td><td><p>Crescimento populacional esgota o meio ambiente</p></td><td><p>Desenvolvimento sustentável e controle populacional</p></td></tr></tbody></table>
<h2>E o Brasil?</h2>
<p>O Brasil é um bom caso para testar as teorias. Durante boa parte do século XX, as famílias brasileiras eram numerosas, sobretudo no campo. Com a [[Industrialização do Brasil]], a população foi para as cidades, as mulheres passaram a estudar mais e a trabalhar fora, e o número de filhos por família caiu — o padrão que a teoria reformista descreve: a natalidade acompanha as condições de vida.</p>
<p>É por isso que o edital do PASSE junta as teorias com a dinâmica populacional brasileira por regiões: as diferenças de natalidade entre as regiões do país são o lugar onde essas explicações se enfrentam.</p>
<table><tbody><tr><td><p><strong>Pegadinha:</strong> Malthus <em>descreveu</em> a fome como consequência do descompasso, mas não propôs guerras e epidemias como solução — a proposta dele era a sujeição moral (casamento tardio e abstinência). O PAS-UEM 2015 deu o item como falso.</p><p><strong>Pegadinha:</strong> os programas de controle de natalidade dos anos 1970, apoiados por instituições internacionais, miravam os países pobres, onde a população crescia mais depressa — não os desenvolvidos. Item falso na mesma prova.</p><p><strong>Pegadinha:</strong> não inverta a seta. Neomalthusiana: população → pobreza. Reformista: pobreza → população. As duas aparecem juntas, e a troca é o erro mais fácil de cometer.</p></td></tr></tbody></table>
<h2>Questão</h2>
<aside class="questao" data-id="fdd954e4-a361-4d01-93b3-190bb1be9769" data-gabarito="26"><p>(PAS-UEM 2015, 3ª etapa) Após a Segunda Guerra, os índices de crescimento populacional atingiram patamares elevados em escala planetária. Os níveis mais altos ocorreram entre 1950 e 1970 e preocuparam estudiosos e autoridades de diversos países sobre os problemas decorrentes deste elevado crescimento. Nesse período, teorias demográficas foram elaboradas para explicar as causas desse crescimento e como controlar a chamada “explosão demográfica”. Com base nestas informações, assinale o que for correto:</p><p>(01) Thomas Malthus, que propôs a chamada Teoria Malthusiana, acreditava que o descompasso entre o crescimento da população e a capacidade de produzir recursos necessários à sobrevivência da humanidade era a causa da existência de tanta fome e miséria no mundo. Sua proposta para a resolução desses problemas era a regulação natural da população, por meio de guerras e de epidemias.</p><p>(02) Proposta após a Segunda Guerra, a Teoria Neomalthusiana preconizava que a pobreza, a fome e a miséria se explicavam pela existência de população numerosa. O aumento da população impediria o crescimento econômico e a possibilidade de uma melhoria global da situação de vida nos países pobres. Segundo os seus defensores, o fim da pobreza estava no controle demográfico.</p><p>(04) Para controlar o grande crescimento populacional, na década de 1970, os governos dos países desenvolvidos adotaram como parte de suas políticas demográficas a implantação de rigorosos programas de controle da natalidade, apoiados por instituições internacionais com a distribuição de pílulas anticoncepcionais e a esterilização em massa.</p><p>(08) A Teoria Reformista ou Antimalthusiana atribuía aos países ricos a responsabilidade pelo excessivo crescimento demográfico e pela pobreza generalizada dos países pobres. Seus defensores propunham a adoção de reformas socioeconômicas para superar graves problemas socioeconômicos. A redução do ritmo de crescimento populacional ocorreria no momento em que a população tivesse melhor qualidade de vida.</p><p>(16) Segundo uma vertente de caráter ecológico, a da Teoria Ecomalthusiana, proposta na década de 1970, controlar o crescimento demográfico é uma forma de preservar a natureza. O crescimento demográfico acelerado pressiona a retirada de recursos naturais da área que possui a maior biodiversidade no planeta, a zona intertropical, onde está localizada a maioria dos países pobres, causando mais miséria e sérios danos ao ambiente.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Errado. O diagnóstico está certo, a solução não: Malthus propunha a sujeição moral — casamento tardio e abstinência sexual —, e não guerras e epidemias.</p><p>(02) Certo. É a tese neomalthusiana inteira: população numerosa causa pobreza, e o remédio é o controle demográfico.</p><p>(04) Errado. Os programas de controle de natalidade eram dirigidos aos países pobres, onde a população crescia mais depressa.</p><p>(08) Certo. A reformista inverte a seta: a natalidade cai quando a qualidade de vida melhora.</p><p>(16) Certo. A ecomalthusiana troca a falta de alimento pela pressão sobre a natureza.</p><p><strong>Soma: 2 + 8 + 16 = 26</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Teoria malthusiana:</h3>
<p>população cresce em progressão geométrica, alimentos em progressão aritmética; solução: sujeição moral.</p>
<h3 data-corrido="sim">Sujeição moral:</h3>
<p>adiamento do casamento e abstinência sexual, a proposta de Malthus para conter os nascimentos.</p>
<h3 data-corrido="sim">Explosão demográfica:</h3>
<p>crescimento populacional acelerado depois da Segunda Guerra, mais alto entre 1950 e 1970.</p>
<h3 data-corrido="sim">Teoria neomalthusiana:</h3>
<p>muitos filhos causam a pobreza; solução: planejamento familiar e métodos contraceptivos.</p>
<h3 data-corrido="sim">Teoria reformista (antimalthusiana):</h3>
<p>a pobreza causa o excesso de filhos; solução: reformas socioeconômicas e educação.</p>
<h3 data-corrido="sim">Teoria ecomalthusiana:</h3>
<p>o crescimento da população esgota o meio ambiente; solução: preservação ambiental e controle populacional.</p>'
) on conflict (slug) do nothing;

-- Casamento exato com o edital do PAS UEM. O do PASSE fica de fora pelo motivo
-- explicado no cabeçalho.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 3
   and e.texto = 'Teorias demográficas.'
   and e.resumo_id is null
   and r.slug = 'teorias-demograficas';

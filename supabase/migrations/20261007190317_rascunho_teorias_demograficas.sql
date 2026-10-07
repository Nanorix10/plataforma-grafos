-- Primeiro resumo escrito no modelo de `docs/produto/modelo-de-resumo.md`:
-- Teorias demográficas, rascunhado por Claude e revisado pelo autor.
--
-- **Isto NÃO é migração no sentido da decisão 9c.** É o modo de autoria que o
-- modelo criou (§6): texto novo, só com o que as três fontes abaixo sustentam,
-- que vira acervo quando o autor aprovar o PR. Aprovar o PR é publicar.
--
-- **Segunda versão (07/10).** A primeira estava em prosa, com exemplos e uma
-- seção sobre o Brasil que nenhuma fonte trazia. O autor pediu termos fiéis às
-- fontes, linguagem formal e tópicos só com o essencial, no estilo dele — e o
-- modelo foi revisado junto (§3, "O estilo do autor, medido").
--
-- ## Por que este tópico
--
-- Lacuna real nos dois editais que trazem o assunto, conferida no banco em
-- 07/10/2026 — nenhum resumo citava Malthus:
--
-- - PAS UEM, 3ª etapa: `Teorias demográficas.`
-- - PASSE, 2ª etapa: `As teorias populacionais (Malthusiana, Neomalthusiana e
--   Reformista) e a dinâmica populacional brasileira, por regiões: …`
--
-- Por estar nos dois, o processo é `comum` (decisão 1c).
--
-- ## Fontes, e só elas
--
-- 1. **Caderno do autor**: `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para
--    PR2G2.docx`, seção `GEOGRAFIA A`, parágrafos 00035–00049 do extrator. As
--    definições, os fundamentos, as soluções e a tabela (que entra como está).
-- 2. **Edital**: os dois tópicos acima.
-- 3. **PAS-UEM 2015, etapa 3, questão 32** (gabarito 26), em
--    `Documents/UEM-Provas/pdfs/pas15/E3G1Geografia.pdf`, p. 2: o nome de
--    Thomas Malthus, a proposição após a Segunda Guerra, a explosão
--    demográfica de 1950–1970, a década de 1970 e o caráter ecológico da
--    ecomalthusiana, a zona intertropical, o nome "Antimalthusiana" e as duas
--    pegadinhas (itens 01 e 04, os incorretos).
--
-- Único acréscimo fora delas: os primeiros termos de uma progressão
-- geométrica e de uma aritmética, como ilustração da definição que o caderno
-- já dá (modelo, §6).
--
-- ## O que difere do caderno, de propósito
--
-- - **Ordem cronológica** (malthusiana → neomalthusiana → reformista →
--   ecomalthusiana), e não a do caderno (reformista em segundo): a reformista
--   responde à neomalthusiana. A tabela mantém a ordem original.
-- - **Concordância**: "acreditam na falta de recursos" → "falta de recursos
--   naturais para alimentar toda a população", com a teoria como sujeito
--   (modelo, §3, correção de forma).
--
-- ## O edital ganha um tópico, não dois
--
-- Casa só o do PAS UEM, que é exato. O do PASSE pede também a dinâmica
-- populacional brasileira por regiões, que nenhuma das fontes traz; marcá-lo
-- cobriria pela metade — o mesmo critério que deixou `Arte Medieval` sem casar
-- em `20260918120000`.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'teorias-demograficas',
  'Teorias demográficas',
  'geografia',
  'comum',
  'Teorias que explicam a relação entre crescimento populacional, recursos naturais e pobreza, e as soluções que cada uma propõe.',
  '<p>Teorias que explicam a relação entre o crescimento populacional, os recursos naturais e a pobreza;</p>
<ul><li><p><strong>Malthusiana, Neomalthusiana e Ecomalthusiana:</strong> o crescimento populacional é causa da pobreza ou da escassez;</p></li>
<li><p><strong>Reformista:</strong> o crescimento populacional é consequência da pobreza.</p></li></ul>
<h2 data-corrido="sim">Teoria Malthusiana:</h2>
<p>falta de recursos naturais para alimentar toda a população;</p>
<ul><li><p><strong>Contexto:</strong> proposta por Thomas Malthus;</p></li>
<li><p><strong>Fundamento:</strong> a população cresceria em <strong>progressão geométrica</strong>, enquanto a produção de alimentos cresceria apenas em <strong>progressão aritmética</strong>;</p>
<ul><li><p><strong>Ex:</strong> população 1, 2, 4, 8, 16…; alimentos 1, 2, 3, 4, 5…;</p></li></ul></li>
<li><p><strong>Solução proposta:</strong> <strong>sujeição moral</strong>;</p>
<ul><li><p>Adiamento do casamento;</p></li>
<li><p>Abstinência sexual, para conter o nascimento de novos indivíduos.</p></li></ul></li></ul>
<h2 data-corrido="sim">Teoria Neomalthusiana:</h2>
<p>o crescimento populacional acelerado é a causa da pobreza;</p>
<ul><li><p><strong>Contexto:</strong> proposta após a Segunda Guerra Mundial, diante da <strong>explosão demográfica</strong> (maiores índices de crescimento entre 1950 e 1970);</p></li>
<li><p><strong>Fundamento:</strong> quanto mais filhos uma família pobre tem, menos recursos o Estado tem para investir em infraestrutura e desenvolvimento econômico;</p></li>
<li><p><strong>Solução proposta:</strong> planejamento familiar rígido e uso em massa de métodos contraceptivos (pílulas, preservativos).</p></li></ul>
<h2 data-corrido="sim">Teoria Reformista ou Antimalthusiana:</h2>
<p>a superpopulação não é a causa, mas sim a consequência da pobreza;</p>
<ul><li><p><strong>Contexto:</strong> visão oposta à neomalthusiana, baseada em ideais sociais e críticos ao capitalismo;</p></li>
<li><p><strong>Fundamento:</strong> em países com grandes desigualdades sociais (ver [[Desigualdade social]]) e falta de acesso à educação e à saúde, as famílias tendem a ter mais filhos;</p></li>
<li><p><strong>Solução proposta:</strong> reformas socioeconômicas (melhor distribuição de renda e acesso à educação), que levariam naturalmente à queda da natalidade.</p></li></ul>
<h2 data-corrido="sim">Teoria Ecomalthusiana:</h2>
<p>o crescimento desenfreado da população exerce uma pressão insustentável sobre os recursos naturais da Terra (água, solo, energia);</p>
<ul><li><p><strong>Contexto:</strong> proposta na década de 1970, de caráter ecológico;</p></li>
<li><p><strong>Fundamento:</strong> o crescimento demográfico acelerado pressiona a retirada de recursos naturais da zona intertropical, de maior biodiversidade do planeta e onde se localiza a maioria dos países pobres;</p></li>
<li><p><strong>Solução proposta:</strong> preservação ambiental aliada ao controle do crescimento populacional, para garantir a sobrevivência do planeta;</p></li>
<li><p><strong>Obs:</strong> recursos energéticos em [[Fontes de energia]].</p></li></ul>
<h2>Comparação entre as teorias</h2>
<table><tbody><tr><th><p><strong>Teoria</strong></p></th><th><p><strong>Causa da pobreza</strong></p></th><th><p><strong>Solução</strong></p></th></tr><tr><td><p>Malthusiana</p></td><td><p>Desequilíbrio entre população e alimentos</p></td><td><p>Abstinência sexual e casamento tardio</p></td></tr><tr><td><p>Neomalthusiana</p></td><td><p>Ter muitos filhos causa a pobreza do país</p></td><td><p>Métodos contraceptivos (pílulas, preservativos)</p></td></tr><tr><td><p>Reformista</p></td><td><p>A pobreza e má distribuição causam excesso de filhos</p></td><td><p>Reformas sociais e educação</p></td></tr><tr><td><p>Ecomalthusiana</p></td><td><p>Crescimento populacional esgota o meio ambiente</p></td><td><p>Desenvolvimento sustentável e controle populacional</p></td></tr></tbody></table>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p><ul><li><p>Malthus não propôs guerras e epidemias como solução; sua proposta foi a sujeição moral (PAS-UEM 2015);</p></li><li><p>Os programas de controle da natalidade da década de 1970 não são atribuídos aos governos dos países desenvolvidos (PAS-UEM 2015).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="fdd954e4-a361-4d01-93b3-190bb1be9769" data-gabarito="26"><p>(PAS-UEM 2015, 3ª etapa) Após a Segunda Guerra, os índices de crescimento populacional atingiram patamares elevados em escala planetária. Os níveis mais altos ocorreram entre 1950 e 1970 e preocuparam estudiosos e autoridades de diversos países sobre os problemas decorrentes deste elevado crescimento. Nesse período, teorias demográficas foram elaboradas para explicar as causas desse crescimento e como controlar a chamada “explosão demográfica”. Com base nestas informações, assinale o que for correto:</p><p>(01) Thomas Malthus, que propôs a chamada Teoria Malthusiana, acreditava que o descompasso entre o crescimento da população e a capacidade de produzir recursos necessários à sobrevivência da humanidade era a causa da existência de tanta fome e miséria no mundo. Sua proposta para a resolução desses problemas era a regulação natural da população, por meio de guerras e de epidemias.</p><p>(02) Proposta após a Segunda Guerra, a Teoria Neomalthusiana preconizava que a pobreza, a fome e a miséria se explicavam pela existência de população numerosa. O aumento da população impediria o crescimento econômico e a possibilidade de uma melhoria global da situação de vida nos países pobres. Segundo os seus defensores, o fim da pobreza estava no controle demográfico.</p><p>(04) Para controlar o grande crescimento populacional, na década de 1970, os governos dos países desenvolvidos adotaram como parte de suas políticas demográficas a implantação de rigorosos programas de controle da natalidade, apoiados por instituições internacionais com a distribuição de pílulas anticoncepcionais e a esterilização em massa.</p><p>(08) A Teoria Reformista ou Antimalthusiana atribuía aos países ricos a responsabilidade pelo excessivo crescimento demográfico e pela pobreza generalizada dos países pobres. Seus defensores propunham a adoção de reformas socioeconômicas para superar graves problemas socioeconômicos. A redução do ritmo de crescimento populacional ocorreria no momento em que a população tivesse melhor qualidade de vida.</p><p>(16) Segundo uma vertente de caráter ecológico, a da Teoria Ecomalthusiana, proposta na década de 1970, controlar o crescimento demográfico é uma forma de preservar a natureza. O crescimento demográfico acelerado pressiona a retirada de recursos naturais da área que possui a maior biodiversidade no planeta, a zona intertropical, onde está localizada a maioria dos países pobres, causando mais miséria e sérios danos ao ambiente.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. A solução proposta por Malthus era a sujeição moral (adiamento do casamento e abstinência sexual);</p><p>(02) Correta. Tese neomalthusiana: população numerosa como causa da pobreza; controle demográfico como solução;</p><p>(04) Incorreta. Os programas de controle da natalidade não são atribuídos aos governos dos países desenvolvidos;</p><p>(08) Correta. Tese reformista: a natalidade cai com a melhora da qualidade de vida;</p><p>(16) Correta. Tese ecomalthusiana: controle demográfico como forma de preservar a natureza.</p><p><strong>Soma: 02 + 08 + 16 = 26</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Teoria Malthusiana:</h3>
<p>população em progressão geométrica e alimentos em progressão aritmética; solução: sujeição moral;</p>
<h3 data-corrido="sim">Sujeição moral:</h3>
<p>adiamento do casamento e abstinência sexual;</p>
<h3 data-corrido="sim">Explosão demográfica:</h3>
<p>crescimento populacional acelerado após a Segunda Guerra, com maiores índices entre 1950 e 1970;</p>
<h3 data-corrido="sim">Teoria Neomalthusiana:</h3>
<p>o crescimento populacional causa a pobreza; solução: planejamento familiar e métodos contraceptivos;</p>
<h3 data-corrido="sim">Teoria Reformista:</h3>
<p>a pobreza causa o crescimento populacional; solução: reformas socioeconômicas;</p>
<h3 data-corrido="sim">Teoria Ecomalthusiana:</h3>
<p>o crescimento populacional esgota os recursos naturais; solução: preservação ambiental e controle populacional.</p>'
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

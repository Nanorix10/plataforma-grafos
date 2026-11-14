-- Liga à linha do tempo os resumos de Ciências Humanas que ainda não tinham
-- evento nenhum.
--
-- Em 22/10/2026, de 73 resumos de História, Geografia, Filosofia e Sociologia,
-- só 20 tinham evento. Esta migration acrescenta 20 eventos para 14 dos 53
-- restantes. Os outros 39 não trazem ano no texto do autor — ver o fim.
--
-- ## A regra é a mesma de `20260825081820_eventos_do_acervo`
--
-- Só vira evento o ano que está **no texto do autor**: corpo, definição ou o
-- próprio título ("A Revolução Científica (séc. XVI-XVIII)"). Nada é datado
-- por fora, a descrição fica vazia e o título é a palavra dele recortada.
-- Década vira o primeiro ano dela, e o rótulo guarda a frase ("década de 1970").
--
-- ## O que é novo: questão não conta como texto do autor
--
-- Boa parte das datas do acervo mora dentro de `<aside class="questao">`, e
-- alternativa de questão pode ser **falsa** de propósito. Então nenhuma data
-- foi tirada de questão. Ficaram de fora por isso:
--   - Sofistas: Sócrates (470–399 a.C.), Guerra do Peloponeso (404 a.C.);
--   - Renascimento: fundação de Bolonha, Paris, Oxford e Coimbra;
--   - Émile Durkheim: datas de Comte, Marx, Weber, Durkheim e de
--     *As regras do método sociológico* (1895);
--   - Estados Unidos no séc. XIX: independência (1776), Secessão (1861–1865);
--   - Revolução Industrial: Era Vargas (1930–1945);
--   - O tráfico negreiro: bula *Dum Diversas* (1492).
--
-- ## Fora, e vira pergunta
--
-- - "Concílio de Trento, realizado entre 1645 e 1663" (Revolução Científica):
--   o evento `Concílio de Trento` já existe com 1545, tirado da Reforma
--   Protestante. Os dois textos discordam; não criei um segundo.
-- - Datas vagas sem conta possível: "fim do século XIX" (Taylorismo),
--   "início do século XX" (bandeirante como herói), "século XX" para uma
--   pessoa (Bertrand Russell).
-- - Quantidades pescadas pela varredura: "1500 mm/ano", "Campos do Jordão
--   (1600 m)" em Climas do Brasil.

insert into eventos (titulo, ano_inicio, ano_fim, rotulo_data, materia_slugs, resumo_id, descricao)
select v.titulo, v.ano_inicio, v.ano_fim, v.rotulo_data, v.materias, r.id, ''
  from (values
    -- ---------- História ----------
    ('Revolução Científica',                         1501::int, 1800::int, 'séc. XVI-XVIII',            array['historia'],   'a-revolucao-cientifica-sec-xvi-xviii'),
    ('Estados Unidos no séc. XIX',                   1801,      1900,      'séc. XIX',                  array['historia'],   'estados-unidos-no-sec-xix'),
    ('Fim do Brasil pré-colonial',                   1530,      null::int, '',                          array['historia'],   'pre-historia-do-brasil'),
    -- ---------- Filosofia ----------
    ('Søren Kierkegaard',                            1813,      1855,      '',                          array['filosofia'],  'existencialismo'),
    ('Jean-Paul Sartre',                             1905,      1980,      '',                          array['filosofia'],  'existencialismo'),
    ('Albert Camus',                                 1913,      1960,      '',                          array['filosofia'],  'existencialismo'),
    ('O Ser e o Nada',                               1943,      null,      '',                          array['filosofia'],  'existencialismo'),
    ('O Existencialismo é um Humanismo',             1946,      null,      '',                          array['filosofia'],  'existencialismo'),
    -- ---------- Geografia ----------
    ('Projeção de Mercator',                         1501,      1600,      'séc. XVI',                  array['geografia'],  'projecoes-cartograficas-e-gnss'),
    ('Linha de montagem de Ford',                    1913,      1914,      '',                          array['geografia'],  'modelos-de-producao-industrial'),
    ('Incentivo ao rodoviarismo',                    1950,      null,      'desde a década de 1950',    array['geografia'],  'modais-de-transporte'),
    ('Explosão demográfica',                         1950,      1970,      '',                          array['geografia'],  'teorias-demograficas'),
    ('Teoria Ecomalthusiana',                        1970,      null,      'década de 1970',            array['geografia'],  'teorias-demograficas'),
    ('Início da desconcentração industrial',         1970,      null,      'década de 1970',            array['geografia'],  'desconcentracao-industrial'),
    ('Etanol de cana-de-açúcar no Brasil',           1970,      null,      'década de 1970',            array['geografia'],  'fontes-de-energia'),
    ('Projeto Grande Carajás',                       1970,      null,      '',                          array['geografia'],  'grandes-projetos-mineradores-do-brasil'),
    ('Neoliberalismo no Chile de Pinochet',          1970,      null,      'década de 1970',            array['geografia'],  'neoliberalismo'),
    ('Neoliberalismo no Brasil',                     1990,      null,      'década de 1990',            array['geografia'],  'neoliberalismo'),
    -- ---------- Sociologia ----------
    ('Origem do conceito de controle social',        1911,      1920,      'segunda década do século XX', array['sociologia'], 'controle-social')
  ) as v(titulo, ano_inicio, ano_fim, rotulo_data, materias, resumo_slug)
  join resumos r on r.slug = v.resumo_slug
 -- Rodar de novo não duplica: o mesmo título no mesmo resumo é o mesmo evento.
 where not exists (
   select 1 from eventos e where e.titulo = v.titulo and e.resumo_id = r.id
 );

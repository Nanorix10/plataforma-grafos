-- Enche a linha do tempo com o que o acervo já datou.
--
-- `/linha-do-tempo` está no ar desde agosto de 2026 e tinha **um** evento:
-- `queda da bastilha`, 1789, sem rótulo e sem resumo ligado. A decisão 9d
-- previu isso — "nasce vazia, e é o cadastro que a preenche" —, mas o cadastro
-- nunca aconteceu, enquanto o acervo ia a 232 resumos.
--
-- Esta é a **primeira migration que insere em `eventos`**. Até aqui a tabela só
-- era preenchida pela tela, e por isso um banco reconstruído a partir dos
-- arquivos vinha com o eixo vazio — o mesmo buraco de reprodutibilidade que a
-- `20260825072931` fechou no `edital_topicos`.
--
-- ## A regra: só vira evento quem tem o ano no texto do autor
--
-- Nada é datado por fora. "Todo mundo sabe que Tordesilhas é de 1494" não vale
-- — o texto dele diz "assinado um ano depois da anterior", e a bula anterior
-- não tem ano nenhum escrito, então Tordesilhas **não entra**. É a decisão 9c
-- aplicada a outro eixo: datar por fora é escrever.
--
-- Pelo mesmo motivo ficaram de fora `Sócrates`, `Sofistas`, `Aristóteles`,
-- `Teoria das Ideias` e `A República` — nenhum traz data no corpo.
--
-- - **título**: a palavra dele, recortada até virar nome. "Final da Guerra de
--   Granada", "Real Mesa Censória", "Governo dos Cem Dias".
-- - **ano_inicio/ano_fim** POSICIONAM; **rotulo_data** é o que o aluno LÊ, e
--   traz a frase dele quando ele escreveu século ("Séc. V a IX").
-- - **descricao vazia**: escrever um resumo do resumo seria inventar texto.
--   Quem explica é o resumo ligado.
-- - **resumo_id**: o resumo que explica o evento. É o que faz o eixo virar
--   porta de entrada para o acervo em vez de uma lista solta.
--
-- ## Século vira ano por conta, não por chute
--
-- Séc. V = 401–500, séc. XIII = 1201–1300, séc. XVIII = 1701–1800. É
-- aritmética, e a frase original fica no `rotulo_data` para o aluno ler o que o
-- autor escreveu.
--
-- ## O que a extração recusou
--
-- A varredura por números de 3 e 4 dígitos pesca quantidade junto com data:
-- "100 léguas a oeste", "14.900 viagens", "750 mil portugueses", "1500 mm/ano",
-- "Campos do Jordão (1600 m)". Nenhum desses é evento, e todos foram descartados
-- à mão — é a mesma lição do casamento do edital: **casar texto não é casar
-- conteúdo**.
--
-- ## O evento que já existia fica como está
--
-- `queda da bastilha` continua com o título e o ano que o autor digitou, em
-- minúscula. Ganha só o `resumo_id` da Revolução Francesa — preencher um nulo
-- não é alterar o que ele escreveu. Que ele se sobrepõe à "Tomada da Bastilha"
-- do corpo daquele resumo é observação para ele, não conserto meu.
--
-- ## Fora, e vira pergunta
--
-- `Trovadorismo (séculos XII e XII)` — o título repete "XII", e o segundo
-- deveria ser XIII. Datar exige escolher por ele.
--
-- Também: em `Formação das Monarquias Nacionais` está "Tratado de Zamorra",
-- com dois erres. O evento entrou com a grafia dele.

insert into eventos (titulo, ano_inicio, ano_fim, rotulo_data, materia_slugs, resumo_id, descricao)
select v.titulo, v.ano_inicio, v.ano_fim, v.rotulo_data, v.materias, r.id, ''
  from (values
    -- ---------- Idade Média ----------
    ('Idade Média',                                  476::int,  1453::int, '',                          array['historia'], 'o-conceito-de-idade-media'),
    ('Queda de Roma',                                476,       null::int, '',                          array['historia'], 'o-conceito-de-idade-media'),
    ('Batalha de Poitiers',                          732,       null,      '',                          array['historia'], 'o-conceito-de-idade-media'),
    ('Carlos Magno coroado Imperador',               800,       null,      '',                          array['historia'], 'o-conceito-de-idade-media'),
    ('Tratado de Verdun',                            843,       null,      '',                          array['historia'], 'o-conceito-de-idade-media'),
    ('Queda de Constantinopla',                      1453,      null,      '',                          array['historia'], 'o-conceito-de-idade-media'),
    -- ---------- Monarquias nacionais ----------
    ('Tratado de Zamorra',                           1143,      null,      '',                          array['historia'], 'formacao-das-monarquias-nacionais'),
    ('Guerra dos Cem Anos',                          1337,      1453,      '',                          array['historia'], 'formacao-das-monarquias-nacionais'),
    ('Dinastia de Avis',                             1385,      null,      '',                          array['historia'], 'formacao-das-monarquias-nacionais'),
    ('Guerra das Duas Rosas',                        1455,      1485,      '',                          array['historia'], 'formacao-das-monarquias-nacionais'),
    ('Casamento de Isabel e Fernando',               1469,      null,      '',                          array['historia'], 'formacao-das-monarquias-nacionais'),
    ('Final da Guerra de Granada',                   1492,      null,      '',                          array['historia'], 'formacao-das-monarquias-nacionais'),
    ('Antigo Regime',                                1401,      1800,      'séculos XV e XVIII',        array['historia'], 'revolucoes-burguesas'),
    -- ---------- Reforma ----------
    ('John Wyclif',                                  1330,      1384,      '',                          array['historia'], 'reforma-protestante'),
    ('Jan Huss',                                     1369,      1415,      '',                          array['historia'], 'reforma-protestante'),
    ('Concílio de Trento',                           1545,      null,      '',                          array['historia'], 'reforma-protestante'),
    -- ---------- Brasil colonial ----------
    ('Desembarque de Villegagnon',                   1550,      null,      '',                          array['historia'], 'invasao-francesa'),
    ('Expulsão dos franceses por Estácio de Sá',     1565,      null,      '',                          array['historia'], 'invasao-francesa'),
    ('Carta Régia de 1570',                          1570,      null,      '',                          array['historia'], 'governo-geral'),
    ('França Equinocial',                            1612,      null,      '',                          array['historia'], 'invasao-francesa'),
    ('Criação da Guiana Francesa',                   1620,      null,      '',                          array['historia'], 'invasao-francesa'),
    ('Companhia das Índias Ocidentais',              1621,      null,      '',                          array['historia'], 'uniao-iberica'),
    ('Invasão holandesa',                            1624,      null,      '',                          array['historia'], 'invasao-holandesa'),
    ('Maurício de Nassau enviado ao Brasil',         1637,      null,      '',                          array['historia'], 'mauricio-de-nassau'),
    ('Insurreição Pernambucana',                     1648,      1654,      '',                          array['historia'], 'insurreicao-pernambucana'),
    ('Tratado de Haia',                              1661,      null,      '',                          array['historia'], 'insurreicao-pernambucana'),
    -- ---------- Pombal ----------
    ('Marquês de Pombal',                            1750,      1777,      '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    ('Meta mínima de ouro das Casas de Fundição',    1751,      null,      '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    ('Companhia Geral do Comércio do Grão-Pará e Maranhão', 1755, null,    '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    ('Expulsão da Companhia de Jesus',               1759,      null,      '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    ('Extinção das capitanias hereditárias',         1759,      null,      '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    ('Companhia Geral do Comércio de Pernambuco e da Paraíba', 1759, null, '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    ('Transferência da capital para o Rio de Janeiro', 1763,    null,      '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    ('Real Mesa Censória',                           1768,      null,      '',                          array['historia'], 'administracao-e-governo-de-pombal'),
    -- ---------- Revolução Francesa e Napoleão ----------
    ('Revolução Francesa',                           1789,      null,      '',                          array['historia'], 'revolucao-francesa'),
    ('Consulado',                                    1799,      1804,      '',                          array['historia'], 'era-napoleonica'),
    ('Império Napoleônico',                          1804,      1815,      '',                          array['historia'], 'era-napoleonica'),
    ('Invasão francesa a Portugal',                  1807,      null,      '',                          array['historia'], 'era-napoleonica'),
    ('Campanha fracassada na Rússia',                1812,      null,      '',                          array['historia'], 'era-napoleonica'),
    ('Primeira Saída de Napoleão',                   1814,      null,      '',                          array['historia'], 'era-napoleonica'),
    ('Congresso de Viena',                           1814,      1815,      '',                          array['historia'], 'congresso-de-viena-1814-1815'),
    ('Governo dos Cem Dias',                         1815,      null,      '',                          array['historia'], 'era-napoleonica'),
    ('Batalha de Waterloo',                          1815,      null,      '',                          array['historia'], 'era-napoleonica'),
    ('Morte de Napoleão em Santa Helena',            1821,      null,      '',                          array['historia'], 'era-napoleonica'),
    ('Abdicação de Carlos X',                        1830,      null,      '',                          array['historia'], 'revolucao-de-1830'),
    ('Primavera dos Povos',                          1848,      null,      '',                          array['historia'], 'revolucao-de-1830'),
    -- ---------- Brasil império ----------
    ('Período joanino',                              1808,      1821,      '',                          array['historia'], 'periodo-joanino-1808-a-1821'),
    ('Abertura dos portos',                          1808,      null,      '',                          array['historia'], 'periodo-joanino-1808-a-1821'),
    ('Tratado de navegação e comércio',              1810,      null,      '',                          array['historia'], 'periodo-joanino-1808-a-1821'),
    ('Reino Unido a Portugal e Algarves',            1815,      null,      '',                          array['historia'], 'periodo-joanino-1808-a-1821'),
    ('Revolução Pernambucana',                       1817,      null,      '',                          array['historia'], 'crise-colonial'),
    ('Revolução liberal do Porto',                   1820,      null,      '',                          array['historia'], 'periodo-joanino-1808-a-1821'),
    ('Independência',                                1822,      null,      '',                          array['historia'], 'crise-colonial'),
    ('Período regencial',                            1831,      1840,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Regência Trina Provisória',                    1831,      null,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Regência Trina Permanente',                    1831,      1834,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Criação da Guarda Nacional',                   1831,      null,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Pressão inglesa pela abolição da escravidão',  1831,      null,      '',                          array['historia'], 'segundo-reinado'),
    ('Cabanagem',                                    1835,      1840,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Guerra dos Farrapos',                          1835,      1845,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Revolta dos Malês',                            1835,      null,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Regência Una de Padre Feijó',                  1835,      1837,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Sabinada',                                     1837,      1838,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Regência Una de Araújo Lima',                  1837,      1840,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Balaiada',                                     1838,      1841,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Golpe da Maioridade',                          1840,      null,      '',                          array['historia'], 'periodo-regencial-1831-1840'),
    ('Bill Aberdeen',                                1845,      null,      '',                          array['historia'], 'segundo-reinado'),
    ('Lei Eusébio de Queirós',                       1850,      null,      '',                          array['historia'], 'segundo-reinado'),
    ('Era Mauá',                                     1850,      1870,      '',                          array['historia'], 'segundo-reinado'),
    -- ---------- Literatura ----------
    ('Carta de Pero Vaz de Caminha',                 1500,      null,      '',                          array['literatura'], 'quinhentismo'),
    ('Humanismo',                                    1401,      1500,      'século XV',                 array['literatura'], 'humanismo'),
    ('Quinhentismo',                                 1501,      1600,      'século XVI no Brasil',      array['literatura'], 'quinhentismo'),
    ('Classicismo',                                  1501,      1600,      'século XVI',                array['literatura'], 'classicismo'),
    ('Publicação de Os Lusíadas',                    1572,      null,      '',                          array['literatura'], 'classicismo'),
    ('Arcadismo',                                    1768,      1836,      '',                          array['literatura'], 'arcadismo'),
    ('Inconfidência Mineira',                        1789,      null,      '',                          array['literatura'], 'arcadismo'),
    ('Romantismo',                                   1836,      1881,      '',                          array['literatura'], 'romantismo'),
    -- ---------- Filosofia ----------
    ('Filosofia Helenística',                        -323,      200,       'de 323 a.C. ao séc. II d.C.', array['filosofia'], 'filosofia-helenistica'),
    ('Patrística',                                   401,       900,       'Séc. V a IX',               array['filosofia'], 'patristica'),
    ('Escolástica',                                  1201,      1400,      'Séc. XIII e XIV',           array['filosofia'], 'escolastica'),
    -- ---------- Sociologia ----------
    ('Início do movimento hippie nos EUA',           1960,      null,      '',                          array['sociologia'], 'cultura'),
    ('Constituição Federal de 1988',                 1988,      null,      '',                          array['sociologia'], 'poder'),
    -- ---------- Geografia ----------
    ('Crise de 1929',                                1929,      null,      '',                          array['geografia'], 'industrializacao-do-brasil'),
    ('Período Militar',                              1964,      null,      '',                          array['geografia'], 'industrializacao-do-brasil')
  ) as v(titulo, ano_inicio, ano_fim, rotulo_data, materias, resumo_slug)
  left join resumos r on r.slug = v.resumo_slug;

-- O evento que o autor já tinha cadastrado ganha o resumo que o explica. Título
-- e ano continuam exatamente como ele digitou.
update eventos
   set resumo_id = (select id from resumos where slug = 'revolucao-francesa')
 where titulo = 'queda da bastilha' and resumo_id is null;

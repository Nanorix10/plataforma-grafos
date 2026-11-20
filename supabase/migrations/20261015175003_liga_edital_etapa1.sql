-- Liga tópicos do PAS UEM 1ª etapa a resumos que já existem no acervo
-- (decisão 9i: edital_topicos.resumo_id). Nenhum resumo novo, nenhum texto
-- alterado: só vínculo. Levantamento de 15/10/2026, conferindo o `corpo` de
-- cada candidato contra o tópico inteiro (regra da skill rascunhar-resumo:
-- só o coberto inteiro é ligado).
--
-- Cabeçalhos de seção seguem a convenção já aplicada no banco: o cabeçalho
-- liga ao resumo-guarda-chuva de mesmo nome ("Cinemática." → cinematica,
-- "Matrizes, Determinantes e Sistemas Lineares." → matrizes, "Ligações
-- Químicas." → ligacoes-quimicas, "Funções inorgânicas." → funcoes-inorganicas).
-- Os subtópicos de cada seção são julgados um a um.
--
-- ## Ligados (cobertos inteiros)
--
-- - Física 6, "Mecânica." → mecanica. Define a área e as subdivisões, e é o
--   pai dos 20 resumos de Mecânica (cinemática, dinâmica, estática, fluidos).
-- - Matemática 11, "Matemática Financeira." → matematica-financeira. Cabeçalho
--   ligado ao resumo de mesmo nome, como "Matrizes…" → matrizes.
-- - Química 25, "Representação das transformações químicas." → reacoes-quimicas.
--   Equações químicas, coeficientes, símbolos de estado físico (s, l, g, aq) e
--   das condições da reação (calor, luz, meio ácido, precipitado).
-- - Química 26, "Caracterização e identificação de substâncias." →
--   propriedades-da-materia. Propriedades gerais e específicas (físicas e
--   químicas) como meio de identificar a substância; o tópico vizinho 4
--   ("Propriedades físicas das substâncias como possibilidade de sua
--   identificação.") já aponta para o mesmo resumo.
--
-- ## De fora, cobertos pela metade
--
-- Física
-- - 2 "Noções de medição em Física." — grandezas-fisicas tem grandezas, SI e
--   instrumentos; faltam precisão, algarismos significativos e erro.
-- - 11 "Queda livre e movimento de projéteis." — dividido em três resumos:
--   queda livre em movimentos-retilineos, projéteis em lancamento-horizontal e
--   lancamento-obliquo.
-- - 15 "Dinâmica." — não há resumo-guarda-chuva de Dinâmica; leis-de-newton e
--   forcas-da-mecanica cobrem pedaços.
-- - 32 "Equilíbrio de uma partícula e equilíbrio de um corpo rígido." —
--   partícula em equilibrio, corpo rígido (torque) em corpo-rigido-e-maquinas.
--
-- Química
-- - 6 "Representação simbólica dos elementos, elementos e substâncias" —
--   substancias (simples × compostas) e formulas-quimicas (fórmulas) dividem.
-- - 12 e 14 (substâncias orgânicas/inorgânicas; propriedades de iônicos e
--   moleculares) — ligacoes-quimicas pela metade, já decidido no PR de
--   Ligações químicas.
-- - 15 "Polaridade das ligações e interações intermoleculares." — polaridade
--   em polaridade-das-moleculas, interações em forcas-de-interacao-molecular.
-- - 20 "Compreensão da radioatividade no cotidiano…" — radioatividade não
--   trata de usos (medicina, energia) nem de benefícios × malefícios.
-- - 21 "Cálculos Químicos." — cabeçalho de seção; calculo-estequiometrico não
--   é o guarda-chuva (a seção inclui equações, tipos de reação e leis).
-- - 22 "Equações químicas e balanceamento de reações (método por tentativas)."
--   — balanceamento-de-equacoes-quimicas só dá a ordem do método; o que é a
--   equação química está em reacoes-quimicas.
-- - 33 (propriedades de ácidos e bases) — funcoes-inorganicas não traz
--   indicadores, condutibilidade, reação com metais; já decidido no PR de
--   Funções inorgânicas.
--
-- Matemática
-- - 13 "Porcentagens; média aritmética (simples e ponderada), média
--   geométrica." — porcentagem em matematica-financeira, médias em
--   medidas-de-tendencia-central; a geométrica em nenhum.
-- - 15 (SAC, Price, inflação, IDH) — matematica-financeira não trata.
-- - 16 "Estatística e Análise de Dados." — estatistica é o guarda-chuva, mas
--   o corpo está vazio; e "Interpretação de gráficos e de tabelas" (18) não
--   tem resumo.
-- - 12 (razões, proporções, regra de três) — Regra de três está em rascunho
--   no PR #135; o vínculo vai com ele.
--
-- Biologia
-- - 6 "Biologia celular." — amplo demais para celula; já decidido no PR de
--   Célula.
-- - 7 "Composição química da célula." — macromoleculas cobre proteínas,
--   lipídios, carboidratos e ácidos nucleicos; faltam água e sais minerais.
-- - 11 "Metabolismo de controle: DNA, RNA, síntese proteica." — macromoleculas
--   não trata de transcrição nem tradução.
-- - 14/15 "Reprodução." / "Tipos de reprodução." — gametas-e-fecundacao só
--   cobre a sexuada.
-- - 19 "Métodos contraceptivos e IST." — prevencao fala de IST (preservativo,
--   vacina, testagem), não dos métodos contraceptivos.
--
-- Geografia
-- - 9 "Tectônica de placas." — dividido: a teoria (Wegener) em
--   teoria-da-tectonica-de-placas, os limites em movimento-de-placas.
-- - 18 "Tipos climáticos." — climas-do-brasil só traz os climas do Brasil.
-- - 4, 6, 13, 17 — cada um dividido entre resumos menores: localização em gnss;
--   representação cartográfica nas duas de projeções; agentes internos e
--   externos em vulcanismo e erosao; fenômenos climáticos em el-nino-e-la-nina
--   e ciclones.
--
-- História
-- - 6–10 "O Ocidente na Idade Média." e subtópicos — o-conceito-de-idade-media
--   é cronológico (Alta Idade Média, francos, Baixa Idade Média, crises); não
--   desenvolve sociedade feudal, economia medieval, Estado e Igreja, cultura.
-- - 12 "A crise da sociedade medieval e o nascimento do mundo moderno." — a
--   crise (Peste, Guerra dos Cem Anos) está em o-conceito-de-idade-media; o
--   nascimento do mundo moderno, não.
-- - 16 "O período colonial…" — capitanias-hereditarias, governo-geral etc.
--   são pedaços.
--
-- Literatura
-- - 12–16 (Tomás Antônio Gonzaga) — já decidido no PR de Marília de Dirceu.
-- - 26–31 (Camões) — classicismo trata da lírica camoniana em geral, sem os
--   cinco sonetos do edital.
-- - 5–10 (Gregório de Matos) — barroco não trata dos poemas do edital.
--
-- Sociologia
-- - 7/8 "O mundo do trabalho" — capitalismo-ao-longo-da-historia só lista as
--   fases do capitalismo.
--
-- Sem candidato no acervo: Arte (todos), Redação (todos), Filosofia 1–3 e
-- 5–11, Geografia 1–3, 5, 7, 11, 12, 14–16, 19, 22, 23, 25, 26, História 1–5, 11, 14, 15,
-- 17, 18, Literatura (demais), Português 1, 2, 5–9 (5, coesão, tem rascunho
-- próprio em outra branch), Química 1 e 34, Matemática 6–10 (conjuntos-numericos
-- tem corpo vazio), Biologia 1, 2, 8, 12, 16, 20–25, Sociologia 1–3, 6.

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.texto = 'Mecânica.'
   and e.resumo_id is null
   and r.slug = 'mecanica';

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.texto = 'Matemática Financeira.'
   and e.resumo_id is null
   and r.slug = 'matematica-financeira';

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.texto = 'Representação das transformações químicas.'
   and e.resumo_id is null
   and r.slug = 'reacoes-quimicas';

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.texto = 'Caracterização e identificação de substâncias.'
   and e.resumo_id is null
   and r.slug = 'propriedades-da-materia';

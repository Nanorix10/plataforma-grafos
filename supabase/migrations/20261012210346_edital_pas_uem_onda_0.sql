-- Onda 0 do plano de produção do PAS-UEM (1ª e 2ª etapas): liga ao edital
-- resumos que já existem e que cobrem o tópico INTEIRO.
--
-- Critério: um tópico só é ligado quando UM resumo cobre tudo o que ele pede.
-- `edital_topicos.resumo_id` aponta para um resumo só, então tópico repartido
-- entre vários resumos (ex.: "Queda livre e movimento de projéteis", dilatação
-- de sólidos e líquidos, coordenação nervosa e hormonal) fica de fora, e o
-- plano o trata como rascunho ou como resumo-pai.
--
-- Cada linha foi conferida contra o corpo do resumo em 12/10/2026.
--
-- Uma correção: o tópico "Matrizes associadas a um sistema de equações
-- lineares" (PAS-UEM, 1ª etapa, matemática, ordem 4) apontava para Geometria
-- analítica e passa a apontar para Sistemas lineares, que traz a
-- representação matricial.

with ligacao(etapa, materia_slug, ordem, slug) as (values
  -- 1ª etapa · biologia
  (1, 'biologia',   3, 'caracteristicas-dos-seres-vivos'),
  (1, 'biologia',   4, 'caracteristicas-dos-seres-vivos'),
  (1, 'biologia',   5, 'teorias-de-origem-da-vida'),
  (1, 'biologia',  17, 'gametogenese'),
  (1, 'biologia',  18, 'gametas-e-fecundacao'),
  -- 1ª etapa · física
  (1, 'fisica',     3, 'grandezas-fisicas'),
  (1, 'fisica',     8, 'cinematica'),
  (1, 'fisica',     9, 'movimentos-retilineos'),
  (1, 'fisica',    10, 'movimentos-retilineos'),
  (1, 'fisica',    14, 'movimentos-retilineos'),
  (1, 'fisica',    16, 'leis-de-newton'),
  (1, 'fisica',    17, 'leis-de-newton'),
  (1, 'fisica',    18, 'leis-de-newton'),
  (1, 'fisica',    19, 'leis-de-newton'),
  (1, 'fisica',    23, 'gravitacao-e-kepler'),
  (1, 'fisica',    24, 'gravitacao-e-kepler'),
  (1, 'fisica',    27, 'trabalho-e-energia'),
  (1, 'fisica',    28, 'trabalho-e-energia'),
  (1, 'fisica',    29, 'trabalho-e-energia'),
  (1, 'fisica',    30, 'quantidade-de-movimento'),
  (1, 'fisica',    31, 'corpo-rigido-e-maquinas'),
  (1, 'fisica',    33, 'corpo-rigido-e-maquinas'),
  -- 1ª etapa · geografia
  (1, 'geografia',  8, 'camadas-da-terra'),
  (1, 'geografia', 10, 'formacao-das-rochas'),
  (1, 'geografia', 20, 'tipos-de-solo'),
  -- 1ª etapa · história
  (1, 'historia',  13, 'formacao-das-monarquias-nacionais'),
  -- 1ª etapa · matemática
  (1, 'matematica', 4, 'sistemas-lineares'),
  (1, 'matematica', 5, 'sistemas-lineares'),
  -- 1ª etapa · língua portuguesa
  (1, 'portugues',  4, 'variacoes-linguisticas'),
  (1, 'portugues', 10, 'frase-oracao-e-periodo'),
  -- 1ª etapa · química
  (1, 'quimica',    2, 'mudancas-de-estado-fisico'),
  (1, 'quimica',    3, 'substancias'),
  (1, 'quimica',    4, 'propriedades-da-materia'),
  (1, 'quimica',    5, 'processos-de-separacao-de-misturas'),
  (1, 'quimica',    9, 'modelos-atomicos'),
  (1, 'quimica',   13, 'forcas-de-interacao-molecular'),
  (1, 'quimica',   16, 'radioatividade'),
  (1, 'quimica',   17, 'radioatividade'),
  (1, 'quimica',   18, 'reacoes-nucleares'),
  (1, 'quimica',   19, 'reacoes-nucleares'),
  (1, 'quimica',   27, 'calculo-estequiometrico'),
  -- 2ª etapa · física
  (2, 'fisica',     2, 'hidrostatica'),
  (2, 'fisica',    16, 'propagacao-de-calor'),
  -- 2ª etapa · geografia
  (2, 'geografia',  5, 'hidrografia'),
  -- 2ª etapa · história
  (2, 'historia',   3, 'colonizacao-na-america'),
  -- 2ª etapa · matemática
  (2, 'matematica', 2, 'analise-combinatoria'),
  (2, 'matematica', 3, 'analise-combinatoria'),
  (2, 'matematica',16, 'funcoes'),
  -- 2ª etapa · língua portuguesa
  (2, 'portugues',  7, 'formacao-de-palavras'),
  -- 2ª etapa · química
  (2, 'quimica',    2, 'dispersoes'),
  (2, 'quimica',    3, 'concentracao'),
  (2, 'quimica',    4, 'concentracao')
)
update edital_topicos e
   set resumo_id = r.id
  from ligacao l
  join resumos r on r.slug = l.slug
 where e.processo_slug = 'pas-uem'
   and e.etapa = l.etapa
   and e.materia_slug = l.materia_slug
   and e.ordem = l.ordem
   and (e.resumo_id is null
        or (l.etapa, l.materia_slug, l.ordem) = (1, 'matematica', 4));

-- O edital vira eixo próprio: `pai_id` volta a significar só "contém".
--
-- ## O defeito que esta migration corrige
--
-- `resumos.pai_id` estava carregando DOIS sentidos. A decisão 9 diz que ele é
-- "contém" — estrutura escrita à mão pelo autor — e que "cita" tem tabela
-- própria (`conexoes`). O sumário de edital, criado em 23/08, enfiou um
-- terceiro sentido ali: **"é cobrado em"**.
--
-- "Dinâmica contém Leis de Newton" é verdade. "Física na 2ª etapa do PAS UEM
-- contém Calor latente" não é: a etapa COBRA o tópico. O resultado foi o acervo
-- com três organizações convivendo — a 1ª etapa do PAS UEM por conteúdo, a 2ª
-- por edital, e os 114 resumos de `comum` sem hierarquia nenhuma.
--
-- A saída é a mesma da decisão 9d, que não enfiou "quando" dentro de `resumos`
-- e deu ao tempo uma tabela própria: **"cobrado em" ganha tabela própria.**
--
-- ## Por que tabela, e não uma coluna `etapa` em `resumos`
--
-- Porque a relação é N-para-N. Um mesmo resumo é cobrado em mais de uma etapa e
-- em mais de uma prova — foi exatamente isso que obrigou o processo `comum` a
-- existir (decisão 1c: a Estatística está escrita igual nos dois editais). Uma
-- coluna escalar repetiria o problema que o `comum` remendou.
--
-- A prova disso aparece já na carga: "Medidas de tendência central" e "Medidas
-- de dispersão" são resumos de `comum` e passam a constar do edital do PASSE
-- **e** do PAS UEM sem deixar de ser comuns. Com `pai_id` isso era impossível.
--
-- ## De onde vêm os tópicos
--
-- **2ª etapa — 217 tópicos, das duas provas.** Saem dos 21 resumos-sumário que
-- existem hoje: o `corpo` deles é uma `<ul>` plana, então a carga é derivada em
-- SQL do próprio banco. Ninguém transcreveu nada à mão, e é por isso que o
-- INSERT abaixo lê `resumos` em vez de trazer uma lista literal.
--
-- **1ª etapa do PAS UEM — 109 tópicos, sete matérias.** Do
-- `Resumo para PAS UEM 1°etapa.docx`, pela lista de nível 0, com
-- `supabase/ferramentas/docx_para_migration.py`. Esta etapa nunca teve sumário:
-- o material dela entrou em 21/08, antes da decisão do sumário existir.
--
-- O `;` e o `:` do fim de cada item caem. No documento são pontuação de lista
-- corrida; aqui cada tópico é uma LINHA e o sinal sobraria apontando para nada.
-- Mesmo raciocínio do `:` que `lib/titulos.ts` tira do rótulo do nó no mapa.
--
-- ## CINCO MATÉRIAS DA 1ª ETAPA FICARAM DE FORA (decisão 9c)
--
-- Não é omissão minha. **O documento da 1ª etapa não é um edital** — é o
-- conteúdo que o autor escreveu, e a lista de nível 0 dele é meio a meio:
-- onde ele AINDA NÃO escreveu, colou a lista do edital; onde escreveu, os
-- itens de nível 0 são os títulos do texto dele. As sete matérias que entram
-- são as do primeiro caso. As cinco de fora, e o motivo de cada uma:
--
-- - **Língua Portuguesa (13), Física (24) e Química (31)** são conteúdo, não
--   lista. Na Física, três dos itens de nível 0 nem são tópicos: são frases de
--   dentro do texto que ficaram promovidas a título ("Em uma explosão ou
--   colisão sem forças externas, o CM do sistema mantém sua trajetória
--   original", "F: força aplicada; d: braço de alavanca…"). Carregar isso
--   publicaria um edital que ninguém escreveu.
-- - **Geografia (16) está com a lista da FILOSOFIA.** Os dezesseis itens sob o
--   cabeçalho "GEOGRAFIA" (parágrafos 886 a 901) são "Surgimento do discurso
--   filosófico", "Ceticismo", "Racionalismo", "Empirismo", "Lógica
--   proposicional", "Teoria do silogismo categórico"… — e a seção FILOSOFIA,
--   logo abaixo (920 a 935), repete os MESMOS dezesseis. É um colar no lugar
--   errado, e carregá-lo faria a tela dizer que a Geografia cobra silogismo.
-- - **Redação (1) tem um tópico, e ele é a letra "R".** A seção foi começada e
--   abandonada.
--
-- **Vale perguntar ao autor pelos cinco.** O que falta é o edital dessas
-- matérias, que o material não tem — não é trabalho de extração.
--
-- ## O que mais muda
--
-- Os 15 resumos pendurados num sumário voltam à raiz, e os 21 sumários são
-- APAGADOS. Conferido antes: nada aponta para eles — zero linhas em `conexoes`,
-- zero eventos da linha do tempo, zero `[[wikilinks]]` no corpo de qualquer
-- resumo. O conteúdo deles (a lista) está inteiro em `edital_topicos`, e quem
-- passa a mostrá-lo é `/edital`, com a contagem de escritos que a página de
-- lista não sabia dar.
--
-- As policies são as quatro de `eventos`, sem invenção: leitura para qualquer
-- autenticado, escrita só com `eh_admin()`.

create table if not exists edital_topicos (
  id            uuid primary key default gen_random_uuid(),
  processo_slug text not null references processos_seletivos(slug) on delete cascade,
  etapa         smallint not null check (etapa between 1 and 4),
  materia_slug  text not null references materias(slug) on delete cascade,
  ordem         int not null,
  texto         text not null check (length(btrim(texto)) > 0),
  -- `on delete set null` como em `eventos.resumo_id`: apagar o resumo não pode
  -- apagar a linha do edital. O tópico continua sendo cobrado na prova; o que
  -- se perde é o texto que o cobria.
  resumo_id     uuid references resumos(id) on delete set null,
  criado_em     timestamptz default now(),
  atualizado_em timestamptz default now(),
  unique (processo_slug, etapa, materia_slug, ordem)
);

create index if not exists edital_topicos_resumo on edital_topicos (resumo_id);
create index if not exists edital_topicos_prova on edital_topicos (processo_slug, etapa, materia_slug, ordem);

alter table edital_topicos enable row level security;

create policy "usuarios autenticados podem ler edital" on edital_topicos
  for select using (true);
create policy "admin insere edital" on edital_topicos
  for insert with check (eh_admin());
create policy "admin edita edital" on edital_topicos
  for update using (eh_admin()) with check (eh_admin());
create policy "admin exclui edital" on edital_topicos
  for delete using (eh_admin());

-- ============================================
-- 1. A 2ª etapa, derivada dos próprios sumários
-- ============================================
--
-- `regexp_matches(..., 'g') with ordinality` devolve um item por `<li>` já na
-- ordem em que ele aparece no corpo — é ela que vira a coluna `ordem`.
--
-- O casamento com o resumo tem DOIS braços de propósito. O primeiro é o título
-- igual ao tópico ("Calor latente"). O segundo é o tópico que começa com o
-- título e continua depois de dois-pontos: o edital do PASSE escreve "Função
-- logarítmica: logaritmo decimal e natural, gráficos" e o resumo se chama só
-- "Função logarítmica". Sem esse braço, o único filho que não casava pelo
-- título ficaria sem tópico.

insert into edital_topicos (processo_slug, etapa, materia_slug, ordem, texto, resumo_id)
select
  i.processo_slug,
  2,
  i.materia_slug,
  i.ordem,
  i.texto,
  r.id
from (
  select s.processo_slug, s.materia_slug, u.ord as ordem,
         rtrim(btrim(regexp_replace(u.m[1], '<[^>]*>', '', 'g')), ';') as texto
  from resumos s
  cross join lateral (
    select m, ord
    from regexp_matches(s.corpo, '<li><p>(.*?)</p></li>', 'g') with ordinality as t(m, ord)
  ) u
  where s.titulo ilike '%etapa%'
) i
left join resumos r
  on r.titulo not ilike '%etapa%'
 and (i.texto = r.titulo or i.texto like r.titulo || ':%');

-- ============================================
-- 2. A 1ª etapa do PAS UEM, vinda do .docx
-- ============================================
--
-- Sete matérias. As outras cinco estão fora pelos motivos do cabeçalho.
-- `resumo_id` fica nulo aqui e é preenchido no passo 3.

insert into edital_topicos (processo_slug, etapa, materia_slug, ordem, texto)
values
  ('pas-uem', 1, 'literatura', 1, 'Ana Maria Machado — Isso ninguém me tira (literatura infantojuvenil)'),
  ('pas-uem', 1, 'literatura', 2, 'Gregório de Matos — 5 poemas selecionados (Barroco brasileiro)'),
  ('pas-uem', 1, 'literatura', 3, 'Tomás Antônio Gonzaga — 4 poemas de Marília de Dirceu (Arcadismo)'),
  ('pas-uem', 1, 'literatura', 4, 'Cláudio Manuel da Costa — 5 poemas selecionados (Arcadismo)'),
  ('pas-uem', 1, 'literatura', 5, 'Luís Vaz de Camões — 5 sonetos selecionados (Literatura portuguesa)'),
  ('pas-uem', 1, 'literatura', 6, 'Paulo Leminski — 6 poemas selecionados (Literatura contemporânea)'),
  ('pas-uem', 1, 'literatura', 7, 'Luís Fernando Veríssimo — 5 crônicas (Comédias para se ler na escola)'),
  ('pas-uem', 1, 'literatura', 8, 'Pepetela — A Montanha da água lilás (Literatura africana)'),
  ('pas-uem', 1, 'matematica', 1, 'Conceito e elementos de uma matriz'),
  ('pas-uem', 1, 'matematica', 2, 'Adição e multiplicação de matrizes'),
  ('pas-uem', 1, 'matematica', 3, 'Multiplicação de número por matriz'),
  ('pas-uem', 1, 'matematica', 4, 'Inversa de uma matriz quadrada'),
  ('pas-uem', 1, 'matematica', 5, 'Sistemas lineares: conjunto de equações lineares'),
  ('pas-uem', 1, 'matematica', 6, 'Matrizes associadas a sistemas de equações lineares'),
  ('pas-uem', 1, 'matematica', 7, 'Resolução e discussão de um sistema linear'),
  ('pas-uem', 1, 'matematica', 8, 'Números racionais e irracionais: operações e propriedades'),
  ('pas-uem', 1, 'matematica', 9, 'Ordem, valor absoluto, desigualdades e intervalos nos reais'),
  ('pas-uem', 1, 'matematica', 10, 'Representação decimal de frações ordinárias'),
  ('pas-uem', 1, 'matematica', 11, 'Unidades de massa, comprimento, área, volume, ângulos e tempo'),
  ('pas-uem', 1, 'matematica', 12, 'Conversão entre unidades de medida'),
  ('pas-uem', 1, 'matematica', 13, 'Unidades de transferência e armazenamento de dados'),
  ('pas-uem', 1, 'matematica', 14, 'Notação científica, algarismos significativos e erro em medidas'),
  ('pas-uem', 1, 'matematica', 15, 'Razões e proporções'),
  ('pas-uem', 1, 'matematica', 16, 'Divisão proporcional'),
  ('pas-uem', 1, 'matematica', 17, 'Regras de três simples e compostas'),
  ('pas-uem', 1, 'matematica', 18, 'Porcentagens'),
  ('pas-uem', 1, 'matematica', 19, 'Média'),
  ('pas-uem', 1, 'matematica', 20, 'Aumentos e descontos; lucro e prejuízo'),
  ('pas-uem', 1, 'matematica', 21, 'Juros simples e compostos'),
  ('pas-uem', 1, 'matematica', 22, 'Sistemas de amortização (Price e SAC)'),
  ('pas-uem', 1, 'matematica', 23, 'Inflação, indicadores socioeconômicos e IDH'),
  ('pas-uem', 1, 'matematica', 24, 'Frequência absoluta'),
  ('pas-uem', 1, 'matematica', 25, 'Medidas de tendência central'),
  ('pas-uem', 1, 'matematica', 26, 'Medidas de dispersão'),
  ('pas-uem', 1, 'matematica', 27, 'Interpretação de gráficos e tabelas de frequência'),
  ('pas-uem', 1, 'biologia', 1, 'Histórico, importância e abrangência da Biologia'),
  ('pas-uem', 1, 'biologia', 2, 'Características dos seres vivos'),
  ('pas-uem', 1, 'biologia', 3, 'Níveis de organização dos seres vivos'),
  ('pas-uem', 1, 'biologia', 4, 'Origem da vida'),
  ('pas-uem', 1, 'biologia', 5, 'Composição química da célula'),
  ('pas-uem', 1, 'biologia', 6, 'Nutrição e necessidades alimentares'),
  ('pas-uem', 1, 'biologia', 7, 'Membrana, citoplasma e núcleo: estrutura e função'),
  ('pas-uem', 1, 'biologia', 8, 'Metabolismo energético'),
  ('pas-uem', 1, 'biologia', 9, 'Metabolismo de controle: DNA, RNA e síntese proteica'),
  ('pas-uem', 1, 'biologia', 10, 'Cariótipo humano'),
  ('pas-uem', 1, 'biologia', 11, 'Ciclo celular'),
  ('pas-uem', 1, 'biologia', 12, 'Conceitos-Chave e Estruturas'),
  ('pas-uem', 1, 'biologia', 13, 'Tipos de reprodução'),
  ('pas-uem', 1, 'biologia', 14, 'Sistema genital masculino e feminino'),
  ('pas-uem', 1, 'biologia', 15, 'Formação de gametas'),
  ('pas-uem', 1, 'biologia', 16, 'Fecundação'),
  ('pas-uem', 1, 'biologia', 17, 'Métodos contraceptivos e IST'),
  ('pas-uem', 1, 'biologia', 18, 'Tecido epitelial'),
  ('pas-uem', 1, 'biologia', 19, 'Tecido conjuntivo (conectivo)'),
  ('pas-uem', 1, 'biologia', 20, 'Tecido muscular'),
  ('pas-uem', 1, 'biologia', 21, 'Tecido nervoso'),
  ('pas-uem', 1, 'biologia', 22, 'Ciência e saúde relacionados aos conteúdos da Etapa 1'),
  ('pas-uem', 1, 'arte', 1, 'Som, ruído e música'),
  ('pas-uem', 1, 'arte', 2, 'Parâmetros do som'),
  ('pas-uem', 1, 'arte', 3, 'Instrumentos musicais'),
  ('pas-uem', 1, 'arte', 4, 'Música ocidental contemporânea'),
  ('pas-uem', 1, 'arte', 5, 'Gêneros musicais: samba, bossa nova e rock'),
  ('pas-uem', 1, 'arte', 6, 'Arte Moderna na América Latina: estilos, vanguardas e artistas'),
  ('pas-uem', 1, 'arte', 7, 'Arte Contemporânea: performance, videoarte e instalação'),
  ('pas-uem', 1, 'arte', 8, 'Arte e política: movimentos feminista, negro, LGBT e indígena'),
  ('pas-uem', 1, 'arte', 9, 'Teatro Improvisacional: experimentação corporal, vocal e criação cênica'),
  ('pas-uem', 1, 'arte', 10, 'Elementos da linguagem teatral: jogo, ação, personagem e espaço cênico'),
  ('pas-uem', 1, 'arte', 11, 'Visualidades, sonoridades e dramaturgias'),
  ('pas-uem', 1, 'arte', 12, 'Relação espectador/cena e apreciação artística'),
  ('pas-uem', 1, 'arte', 13, 'Teatro, Cultura e Diversidade'),
  ('pas-uem', 1, 'arte', 14, 'Elementos da dança: movimento corporal, espaço e tempo'),
  ('pas-uem', 1, 'arte', 15, 'Dança contemporânea'),
  ('pas-uem', 1, 'arte', 16, 'Danças típicas brasileiras'),
  ('pas-uem', 1, 'filosofia', 1, 'Surgimento do discurso filosófico'),
  ('pas-uem', 1, 'filosofia', 2, 'Argumentação filosófica e experimentos de pensamento'),
  ('pas-uem', 1, 'filosofia', 3, 'A filosofia grega: sofística, método socrático, dialética, teoria das ideias'),
  ('pas-uem', 1, 'filosofia', 4, 'Conhecimento e reminiscência; ciência e técnica'),
  ('pas-uem', 1, 'filosofia', 5, 'Teses cosmológicas e antropológicas gregas'),
  ('pas-uem', 1, 'filosofia', 6, 'O problema da possibilidade do conhecimento'),
  ('pas-uem', 1, 'filosofia', 7, 'Validade da crença; distinção entre evidência e opinião; senso comum'),
  ('pas-uem', 1, 'filosofia', 8, 'Ceticismo'),
  ('pas-uem', 1, 'filosofia', 9, 'Racionalismo'),
  ('pas-uem', 1, 'filosofia', 10, 'Empirismo'),
  ('pas-uem', 1, 'filosofia', 11, 'Idealismo transcendental'),
  ('pas-uem', 1, 'filosofia', 12, 'Noção de consequência lógica; inferência válida e correta'),
  ('pas-uem', 1, 'filosofia', 13, 'Tipos de inferência: dedutiva, indutiva e abdutiva'),
  ('pas-uem', 1, 'filosofia', 14, 'Lógica proposicional clássica (operadores lógico-proposicionais)'),
  ('pas-uem', 1, 'filosofia', 15, 'Teoria do silogismo categórico (Quadrado de Oposições, figuras e modos válidos)'),
  ('pas-uem', 1, 'filosofia', 16, 'Falácias formais e não formais (semânticas, de relevância e indutivas)'),
  ('pas-uem', 1, 'sociologia', 1, 'O eu e o outro: relações entre indivíduo e sociedade'),
  ('pas-uem', 1, 'sociologia', 2, 'Interações, sociabilidades e identidades sociais'),
  ('pas-uem', 1, 'sociologia', 3, 'Ações individuais e ações coletivas'),
  ('pas-uem', 1, 'sociologia', 4, 'Processos de socialização nas diferentes instituições sociais'),
  ('pas-uem', 1, 'sociologia', 5, 'A juventude como categoria social'),
  ('pas-uem', 1, 'sociologia', 6, 'Diferentes modos de organização e divisão social no trabalho contemporâneo'),
  ('pas-uem', 1, 'historia', 1, 'Democracia, cidadania e escravidão na Grécia'),
  ('pas-uem', 1, 'historia', 2, 'Cultura da pólis'),
  ('pas-uem', 1, 'historia', 3, 'Expansão romana e política imperial'),
  ('pas-uem', 1, 'historia', 4, 'Crise do século III d.C.'),
  ('pas-uem', 1, 'historia', 5, 'Sociedade feudal'),
  ('pas-uem', 1, 'historia', 6, 'Economia medieval'),
  ('pas-uem', 1, 'historia', 7, 'Estado e Igreja na Idade Média'),
  ('pas-uem', 1, 'historia', 8, 'Cultura e saber medieval'),
  ('pas-uem', 1, 'historia', 9, 'Crise da sociedade medieval e nascimento do mundo moderno'),
  ('pas-uem', 1, 'historia', 10, 'Transformações na Europa Ocidental no fim da Idade Média'),
  ('pas-uem', 1, 'historia', 11, 'Formação dos Estados Nacionais'),
  ('pas-uem', 1, 'historia', 12, 'Grandes navegações e revolução comercial (a partir do séc. XV)'),
  ('pas-uem', 1, 'historia', 13, 'Brasil colonial: economia, política, sociedade e cultura'),
  ('pas-uem', 1, 'historia', 14, 'Colonização do Paraná');

-- ============================================
-- 3. Ligar os tópicos da 1ª etapa ao que já está escrito
-- ============================================
--
-- Mesma regra de casamento do passo 1, agora contra o acervo inteiro. O
-- conteúdo da 1ª etapa entrou em 21/08 e mora em `pas-uem` e em `comum`.

update edital_topicos e
set resumo_id = r.id
from resumos r
where e.etapa = 1
  and e.resumo_id is null
  and r.titulo not ilike '%etapa%'
  and (e.texto = r.titulo or e.texto like r.titulo || ':%');

-- ============================================
-- 4. Soltar os 15 e apagar os 21 sumários
-- ============================================
--
-- A ordem importa: soltar ANTES de apagar. `resumos_pai_id_fkey` não declara
-- `on delete set null`, então apagar um pai com filho vivo falharia — e é bom
-- que falhe, porque hierarquia sumindo em silêncio é o que a decisão 9 teme.

update resumos set pai_id = null
where pai_id in (select id from resumos where titulo ilike '%etapa%');

delete from resumos where titulo ilike '%etapa%';

-- O fecho de praxe das migrations de conteúdo (decisão 9c): dispara o trigger
-- `trg_sync_conexoes_resumo` com todo mundo já no banco.
update resumos set corpo = corpo;

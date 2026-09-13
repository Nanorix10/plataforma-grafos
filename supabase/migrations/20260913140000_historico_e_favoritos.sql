-- Historico de resumos abertos e favoritos do aluno.
--
-- O QUE ISTO RESOLVE
-- ------------------
-- Ate' agora o site nao lembrava de nada. O aluno fechava a aba no meio de um
-- resumo e, no dia seguinte, tinha de reencontra'-lo na arvore de 249 -- e a
-- lista `/resumos` nao tinha trabalho proprio: repetia o que a barra lateral ja'
-- faz melhor, com cartao maior.
--
-- Sao DUAS marcas, e a diferenca entre elas e' o ponto:
--
--   `visto_em`  -- o site anota sozinho. Nao afirma nada sobre o aluno, so'
--                  registra o que aconteceu: esta pagina foi aberta, nesta
--                  hora. Nao ha' como mentir porque nao ha' o que interpretar.
--   `favorito`  -- o aluno escolhe. E' a unica marca deliberada, e por isso a
--                  unica que pode significar "volto aqui".
--
-- Um "lido" foi considerado e descartado: ou depende de o aluno clicar um botao
-- (e ele esquece, e o numero passa a mentir), ou e' adivinhado por rolagem (e
-- adivinha errado). Historico da' a mesma resposta -- "onde eu estava?" -- sem
-- afirmar nada que possa ser falso.
--
-- UMA LINHA POR PAR, E NAO DUAS TABELAS
-- -------------------------------------
-- `(aluno, resumo)` e' a chave primaria: a linha E' a relacao entre os dois, e
-- as duas marcas sao atributos dela. Separar em `historico` e `favoritos` daria
-- duas tabelas com a mesma chave, quatro policies em vez de duas e duas
-- consultas onde uma basta -- pelo unico ganho de poder favoritar sem nunca ter
-- aberto, que nao e' um caso que exista.
create table if not exists leituras (
  -- `default auth.uid()` pelo mesmo motivo de `formulas_salvas`: o INSERT nao
  -- precisa mandar o dono, e a policy confere que ele e' quem esta' pedindo.
  -- `cascade` nos dois lados -- a linha nao significa nada sem o aluno, e menos
  -- ainda sem o resumo.
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  resumo_id uuid not null references resumos (id) on delete cascade,

  visto_em timestamptz not null default now(),

  favorito boolean not null default false,
  favoritado_em timestamptz,

  primary key (user_id, resumo_id),

  -- As duas colunas do favorito andam juntas ou nao andam. Sem isto um
  -- `update set favorito = true` que esquecesse a data passaria, e a lista de
  -- favoritos -- que e' ordenada por ela -- jogaria a linha para o fim sem
  -- ninguem entender por que^.
  constraint leituras_favorito_datado check (favorito = false or favoritado_em is not null)
);

-- "Os ultimos que eu abri" e' a consulta que roda toda vez que `/resumos`
-- carrega. A chave primaria comeca por `user_id` mas termina em `resumo_id`,
-- que nao ajuda a ordenar por data.
create index if not exists leituras_recentes_idx on leituras (user_id, visto_em desc);

alter table leituras enable row level security;

-- Ler: so' o dono. Nao ha' caso em que um aluno precise ver o historico de
-- outro, e admin tambem nao -- isto e' rastro de uso, nao conteudo do acervo.
create policy "aluno le as proprias marcas"
  on leituras for select to authenticated
  using (user_id = auth.uid());

-- Marcar: so' o que o aluno PODE LER.
--
-- O `exists` nao repete a regra de plano -- ele a CONSULTA. Uma subconsulta em
-- `resumos` dentro de uma policy tambem passa pelas policies de `resumos`, que
-- desde 13/09 so' devolvem o que o plano cobre. Entao a condicao "este resumo e'
-- meu de direito" sai de graca, e continua certa no dia em que a regra de plano
-- mudar: ha' um lugar so' que a define.
--
-- Sem isto, uma chamada forjada com a chave anonima (que esta' no JavaScript
-- publico) encheria o proprio historico de resumos bloqueados. Nao vazaria
-- texto nenhum -- o corpo continua fechado --, mas sujaria a tela com titulos
-- que o aluno nao comprou.
create policy "aluno marca o que pode ler"
  on leituras for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from resumos r where r.id = leituras.resumo_id)
  );

create policy "aluno atualiza as proprias marcas"
  on leituras for update to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from resumos r where r.id = leituras.resumo_id)
  );

-- Apagar existe para "limpar meu historico" -- uma tela que ainda nao ha', mas
-- rastro de uso e' do aluno, e uma marca que nao se desfaz vira um registro que
-- ele nao pediu.
create policy "aluno apaga as proprias marcas"
  on leituras for delete to authenticated
  using (user_id = auth.uid());

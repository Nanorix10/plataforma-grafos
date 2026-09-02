-- Fórmulas salvas
--
-- O editor de equações sabe escrever tudo o que o KaTeX desenha (decisão 8d),
-- mas nada do que o autor MONTA sobrevive ao fechar a barra. Uma fórmula de
-- vinte caracteres de LaTeX é remontada do zero toda vez que reaparece — e as
-- que reaparecem são justamente as centrais de cada matéria: Bhaskara,
-- Torricelli, Clapeyron, a síntese da amônia.
--
-- POR QUE TABELA, E NÃO O NAVEGADOR
-- ---------------------------------
-- `localStorage` sairia hoje e sem migration nenhuma, e morreria com a
-- primeira limpeza de dados do site, não existiria no outro computador nem no
-- celular, e não teria como ser recuperado. Isto é uma biblioteca construída
-- ao longo de meses, não uma preferência de interface.
--
-- POR QUE POR USUÁRIO, E NÃO COMPARTILHADA ENTRE ADMINS
-- ----------------------------------------------------
-- É a bancada de trabalho de quem escreve, não conteúdo do acervo. Quem lê é
-- só o dono (`user_id = auth.uid()`), e não "qualquer autenticado" como em
-- `eventos` — lá o dado É do acervo. Abrir depois para uma biblioteca comum
-- entre admins é uma policy a menos; fechar depois de aberta seria tirar da
-- vista o que alguém já usava.

create table if not exists formulas_salvas (
  id uuid primary key default gen_random_uuid(),

  -- `default auth.uid()` deixa o INSERT não precisar mandar o dono, e a policy
  -- de baixo confere que ele é mesmo quem está pedindo. `cascade`, e não o
  -- `set null` de `eventos.resumo_id`: lá o evento continua sendo verdade sem
  -- o resumo, aqui a linha não significa nada sem o dono.
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,

  nome text not null,
  latex text not null,

  -- "Linha própria" faz parte da fórmula, não do momento em que ela foi usada:
  -- um somatório em linha e em bloco são desenhos diferentes. Guardar só o
  -- LaTeX obrigaria a reajustar o interruptor a cada reuso.
  em_bloco boolean not null default false,

  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint formulas_salvas_nome_valido check (btrim(nome) <> '' and length(nome) <= 80),
  constraint formulas_salvas_latex_valido check (btrim(latex) <> '' and length(latex) <= 2000)
);

-- O NOME É A IDENTIDADE, e a unicidade ignora a caixa.
--
-- Salvar "Bhaskara" duas vezes atualiza a que existe em vez de criar uma gêmea
-- que o autor teria de distinguir no olho. E a comparação é sem caixa porque a
-- interface avisa "já existe" comparando sem caixa: com um índice sensível a
-- maiúsculas, a tela diria que vai substituir e o banco criaria uma segunda
-- linha — a interface mentiria, em silêncio.
create unique index if not exists formulas_salvas_nome_unico
  on formulas_salvas (user_id, lower(nome));

alter table formulas_salvas enable row level security;

-- Ler: só o dono. Não é conteúdo de aluno.
create policy "autor le as proprias formulas"
  on formulas_salvas for select to authenticated
  using (user_id = auth.uid());

-- Escrever: o dono E admin. O recorte por `auth.uid()` já bastaria para a
-- segurança; o `eh_admin()` é o que mantém a tabela significando o que ela diz
-- — a bancada de quem edita, e não linhas soltas de qualquer cadastrado.
create policy "admin salva as proprias formulas"
  on formulas_salvas for insert to authenticated
  with check (user_id = auth.uid() and eh_admin());

create policy "admin edita as proprias formulas"
  on formulas_salvas for update to authenticated
  using (user_id = auth.uid() and eh_admin())
  with check (user_id = auth.uid() and eh_admin());

create policy "admin exclui as proprias formulas"
  on formulas_salvas for delete to authenticated
  using (user_id = auth.uid() and eh_admin());

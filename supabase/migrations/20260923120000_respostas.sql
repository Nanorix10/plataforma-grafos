-- O aluno responde as questões do resumo, e o site lembra das que ele errou.
--
-- ## Cada questão ganha uma identidade
--
-- A questão é uma `<aside class="questao">` dentro do `corpo`, sem nada que a
-- distinga de outra. Para "a questão que o aluno errou" continuar sendo a mesma
-- depois que o autor edita o resumo, ela precisa de um id que viaje COM ela:
-- `data-id`, um uuid gravado no próprio HTML. O editor passa a preservá-lo e a
-- dar um a cada questão nova (`admin/editor/questaoResolvida.ts`).
--
-- Esta migration numera as que já existem (25, em 22 resumos). É um laço, e
-- não um `regexp_replace` só, porque cada questão precisa de um uuid DIFERENTE
-- e o replace usaria o mesmo em todas.
--
-- **Tem de rodar DEPOIS de o editor novo estar no ar.** O editor antigo não
-- conhece `data-id` e o descartaria no primeiro salvamento.
--
-- ## Por que `questao_id` não é chave estrangeira
--
-- A questão não é linha de tabela nenhuma: ela mora dentro do HTML. Se o autor
-- apagar a questão, a resposta fica sem destino — e continua servindo para a
-- lista "Para refazer" saber de que resumo ela era. `resumo_id` é FK, e é por
-- ele que a policy confere o plano.
--
-- ## Uma linha por aluno e questão, e vale a última tentativa
--
-- "Para refazer" pergunta "qual foi o último resultado", não "quantas vezes".
-- Acertar depois de ter errado tira a questão da lista — que é o ponto de
-- refazer.

do $$
declare
  r record;
  novo text;
begin
  for r in select id, corpo from resumos where corpo like '%<aside class="questao">%' loop
    novo := r.corpo;
    while strpos(novo, '<aside class="questao">') > 0 loop
      novo := overlay(
        novo
        placing ('<aside class="questao" data-id="' || gen_random_uuid()::text || '">')
        from strpos(novo, '<aside class="questao">')
        for length('<aside class="questao">')
      );
    end loop;
    update resumos set corpo = novo where id = r.id;
  end loop;
end $$;

create table if not exists respostas (
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  questao_id    uuid not null,
  resumo_id     uuid not null references resumos (id) on delete cascade,
  acertou       boolean not null,
  -- A letra marcada, a soma, ou nulo quando o aluno só disse "acertei/errei".
  resposta      text check (length(resposta) <= 8),
  -- O começo do enunciado, para a lista "Para refazer" dizer QUAL questão sem
  -- abrir o resumo. É rótulo, não conteúdo: se o autor reescrever o
  -- enunciado, o rótulo fica velho até a próxima tentativa.
  trecho        text not null default '' check (length(trecho) <= 200),
  respondido_em timestamptz not null default now(),
  primary key (user_id, questao_id)
);

create index if not exists respostas_erradas_do_aluno on respostas (user_id) where not acertou;

alter table respostas enable row level security;

create policy "aluno le as proprias respostas"
  on respostas for select to authenticated
  using (user_id = auth.uid());

-- Consulta `resumos` em vez de repetir a regra de plano, como `leituras`.
create policy "aluno responde o que pode ler"
  on respostas for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from resumos r where r.id = respostas.resumo_id)
  );

create policy "aluno refaz as proprias respostas"
  on respostas for update to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from resumos r where r.id = respostas.resumo_id)
  );

create policy "aluno apaga as proprias respostas"
  on respostas for delete to authenticated
  using (user_id = auth.uid());

-- A página do aluno: os dias em que ele estudou, e as contas do progresso.
--
-- ## `dias_de_estudo`: uma linha por aluno e dia
--
-- `leituras` guarda só a ÚLTIMA vez que cada resumo foi aberto — reabrir Mitose
-- hoje apaga a visita de ontem. Com ela não dá para contar dias seguidos sem
-- inventar. Esta tabela começa a contar agora, e nada do que veio antes é
-- reconstruído.
--
-- **O dia é o do relógio do aluno, e vem do navegador.** O servidor roda em
-- UTC: para quem abre um resumo às 22h em Campo Grande, o dia do servidor já é
-- o seguinte, e a sequência quebraria sem o aluno ter pulado dia nenhum. A
-- policy só aceita um dia a menos de 36 horas do relógio do servidor, que é o
-- que cabe entre os fusos do Brasil — nem ontem-de-mais nem amanhã. Forjar a
-- data é possível dentro dessa janela, e só engana a quem forja.
--
-- O dia conta quando o aluno ABRE UM RESUMO (`registrarVisita`). É o gesto de
-- estudo que o site já anota; responder questão e grifar acontecem dentro de
-- um resumo aberto.

create table if not exists dias_de_estudo (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dia     date not null,
  primary key (user_id, dia)
);

alter table dias_de_estudo enable row level security;

create policy "aluno le os proprios dias"
  on dias_de_estudo for select to authenticated
  using (user_id = auth.uid());

create policy "aluno anota o dia de hoje"
  on dias_de_estudo for insert to authenticated
  with check (
    user_id = auth.uid()
    and dia between (now() - interval '36 hours')::date and (now() + interval '36 hours')::date
  );

-- ## `meu_estudo()`: as contas que não valem trazer linha por linha
--
-- Somar grifos, respostas e tópicos marcados por etapa na aplicação exigiria
-- trazer centenas de linhas para contar. A função devolve só os números.
--
-- **`security invoker`** (o padrão, escrito por extenso de propósito): roda
-- com as permissões de quem chama, então as policies de cada tabela valem aqui
-- dentro e cada aluno só conta o que é dele. Trocar para `definer` contaria as
-- linhas de todo mundo.
--
-- **EXECUTE sai de PUBLIC E de `anon`, os dois.** A decisão 15 mediu que
-- revogar só de `anon` não bastava, porque ele herda de PUBLIC. Esta mediu o
-- contrário: revogado só de PUBLIC, `has_function_privilege('anon', …)`
-- continuou `true` — os privilégios padrão do Supabase dão EXECUTE ao `anon`
-- DIRETAMENTE em toda função nova. Fecha-se as duas portas.

create or replace function meu_estudo()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'grifos', (select count(*) from grifos),
    'grifos_com_nota', (select count(*) from grifos where nota is not null),
    'resumos_grifados', (select count(distinct resumo_id) from grifos),
    'respondidas', (select count(*) from respostas),
    'acertos', (select count(*) from respostas where acertou),
    'edital', coalesce((
      select jsonb_agg(jsonb_build_object(
        'processo', t.processo_slug,
        'etapa', t.etapa,
        'total', t.total,
        'marcados', t.marcados
      ) order by t.processo_slug, t.etapa)
      from (
        select e.processo_slug, e.etapa, count(*) as total, count(p.topico_id) as marcados
        from edital_topicos e
        left join edital_progresso p on p.topico_id = e.id
        group by e.processo_slug, e.etapa
      ) t
    ), '[]'::jsonb)
  )
$$;

revoke execute on function meu_estudo() from public;
revoke execute on function meu_estudo() from anon;
grant execute on function meu_estudo() to authenticated;

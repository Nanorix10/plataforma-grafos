-- O aluno grifa trechos do resumo e escreve nota neles.
--
-- ## A âncora é o TRECHO, não a posição
--
-- O autor reescreve os resumos o tempo todo (quatro só na semana desta
-- migration). Um grifo gravado como "caracteres 312 a 350" passaria a apontar
-- para outra frase na primeira edição, e ninguém perceberia — o site pintaria
-- com toda a confiança o trecho errado.
--
-- Então o grifo guarda o texto grifado (`exato`) e umas trinta letras de cada
-- lado (`prefixo`, `sufixo`). Ao abrir o resumo, o navegador procura `exato`
-- no texto; se ele aparece mais de uma vez, o que vem antes e depois desempata.
-- É o `TextQuoteSelector` do padrão W3C de anotação na web.
--
-- Se o autor reescreveu o trecho, o grifo fica ÓRFÃO: não pinta nada, e
-- aparece na lista do fim do resumo avisando que o texto mudou. **Ele não é
-- apagado.** A nota é do aluno, e perdê-la em silêncio porque o autor trocou
-- uma vírgula seria pior do que mostrar um trecho que não existe mais.
--
-- ## Uma linha por grifo, com id próprio
--
-- Ao contrário de `leituras` e `edital_progresso`, aqui não há chave natural:
-- o mesmo aluno grifa vários trechos do mesmo resumo, e dois grifos podem até
-- ter o mesmo texto em lugares diferentes.

create table if not exists grifos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  resumo_id    uuid not null references resumos (id) on delete cascade,
  exato        text not null check (length(btrim(exato)) between 1 and 2000),
  prefixo      text not null default '' check (length(prefixo) <= 64),
  sufixo       text not null default '' check (length(sufixo) <= 64),
  nota         text check (length(nota) <= 2000),
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists grifos_do_aluno_no_resumo on grifos (user_id, resumo_id);

alter table grifos enable row level security;

create policy "aluno le os proprios grifos"
  on grifos for select to authenticated
  using (user_id = auth.uid());

-- Consulta `resumos` em vez de repetir a regra de plano, como `leituras`
-- (decisão 16): a subconsulta passa pelas policies de lá, então "este resumo é
-- meu de direito" continua certo no dia em que a regra de plano mudar.
create policy "aluno grifa o que pode ler"
  on grifos for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from resumos r where r.id = grifos.resumo_id)
  );

-- O update existe para a NOTA. O trecho não muda depois de gravado — mudar o
-- trecho é tirar o grifo e fazer outro.
create policy "aluno edita a nota dos proprios grifos"
  on grifos for update to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from resumos r where r.id = grifos.resumo_id)
  );

create policy "aluno tira os proprios grifos"
  on grifos for delete to authenticated
  using (user_id = auth.uid());

-- Hierarquia entre resumos: um resumo pode estar DENTRO de outro.
--
-- Até aqui o acervo era plano — matéria e processo seletivo agrupavam, e os
-- [[wikilinks]] ligavam tudo com tudo. Só que os resumos são escritos em
-- tópicos que se desdobram em subtópicos cada vez mais específicos, e isso não
-- tinha onde ser gravado: "Atrito" está dentro de "Dinâmica", que está dentro
-- de "Mecânica", e o banco tratava os três como irmãos.
--
-- Por que uma coluna de pai, e não uma tabela de ligação: cada resumo tem no
-- máximo UM lugar onde mora. Uma tabela `pai/filho` permitiria dois pais, o que
-- transformaria a árvore num grafo e traria de volta exatamente o problema que
-- a hierarquia veio resolver — ficar sem raiz.
--
-- Isto NÃO substitui a tabela `conexoes`. São dois eixos diferentes e ambos
-- continuam valendo:
--   pai_id   → "contém"  (estrutura, escrita à mão pelo autor)
--   conexoes → "cita"    (referência, extraída dos [[wikilinks]] pelo trigger)
--
-- `on delete set null`, e não `cascade`: apagar "Dinâmica" não pode levar junto
-- "Atrito" e todo o resto da subárvore. Os filhos sobem para a raiz e o autor
-- decide onde recolocá-los.

alter table resumos
  add column if not exists pai_id uuid references resumos(id) on delete set null;

-- Um resumo não pode ser pai de si mesmo. Este é o ciclo de tamanho 1, o único
-- que dá pra barrar com CHECK; os maiores ficam com o trigger abaixo.
alter table resumos
  drop constraint if exists resumos_pai_nao_e_ele_mesmo;
alter table resumos
  add constraint resumos_pai_nao_e_ele_mesmo check (pai_id is distinct from id);

-- Busca por "quais são os filhos de X" acontece em toda montagem da árvore
-- (barra lateral e mapa), então o índice não é otimização prematura.
create index if not exists resumos_pai_id_idx on resumos (pai_id);

-- Ciclos maiores (A dentro de B, B dentro de A) precisam subir a cadeia para
-- serem detectados. Sem isto, um ciclo trava a montagem da árvore num laço
-- infinito — e o lugar certo de barrar é o banco, não a interface: o editor é
-- conveniência, o banco é a autoridade (mesmo princípio das policies de RLS).
create or replace function checar_ciclo_resumo()
returns trigger
language plpgsql
as $$
declare
  ancestral uuid := new.pai_id;
  saltos int := 0;
begin
  while ancestral is not null loop
    if ancestral = new.id then
      raise exception
        'Ciclo na hierarquia: % não pode ficar dentro de um resumo que já está dentro dele.',
        new.titulo;
    end if;

    -- trava de segurança: se os dados já estiverem inconsistentes por algum
    -- motivo, é melhor estourar com mensagem clara do que girar para sempre
    saltos := saltos + 1;
    if saltos > 100 then
      raise exception 'Hierarquia funda ou corrompida ao validar %.', new.titulo;
    end if;

    select pai_id into ancestral from resumos where id = ancestral;
  end loop;

  return new;
end;
$$;

drop trigger if exists trg_checar_ciclo_resumo on resumos;
create trigger trg_checar_ciclo_resumo
  before insert or update of pai_id on resumos
  for each row
  when (new.pai_id is not null)
  execute function checar_ciclo_resumo();

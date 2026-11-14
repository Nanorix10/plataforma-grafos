-- Versão do resumo: duas abas (ou dois admins) não gravam mais uma por cima da
-- outra sem saber (decisão 31 do CONTEXTO.md).
--
-- Antes, o último a gravar ganhava em silêncio. Agora o editor guarda a versão
-- que abriu e só grava `where versao = <a que abriu>`; se ninguém mais gravou,
-- o trigger sobe o número e o editor passa a usar o novo. Se outro gravou
-- antes, o update não acha a linha e a tela avisa em vez de apagar o trabalho
-- do outro.
--
-- Só ACRESCENTA: a coluna nasce com 1 em todas as linhas, e quem não manda a
-- versão (abas abertas antes do deploy, migrations de conteúdo) continua
-- gravando como antes — o trigger só soma.
--
-- `atualizado_em` existia desde o começo e nunca era tocado depois do insert;
-- o mesmo trigger passa a mantê-lo.
--
-- Para desfazer:
--   drop trigger trg_subir_versao_resumo on public.resumos;
--   drop function public.subir_versao_resumo();
--   alter table public.resumos drop column versao;

alter table public.resumos add column versao bigint not null default 1;

create function public.subir_versao_resumo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.versao := old.versao + 1;
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger trg_subir_versao_resumo
  before update on public.resumos
  for each row execute function public.subir_versao_resumo();

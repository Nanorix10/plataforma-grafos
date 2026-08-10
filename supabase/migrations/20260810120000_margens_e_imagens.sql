-- Margens por resumo (a régua) e o depósito das imagens.
--
-- ============================================
-- 1. As margens
-- ============================================
-- Dois inteiros e não um "largura do texto", porque a régua do editor tem dois
-- marcadores independentes: o autor pode querer a coluna deslocada para um dos
-- lados, e uma largura única só saberia centralizar.
--
-- O padrão 150 não é arbitrário: a folha tem 920px (lib/pagina.ts), então
-- 920 − 150 − 150 devolve exatamente a coluna de 620px que o editor já tinha.
-- Todo resumo que já existe continua com a aparência de hoje.
alter table resumos
  add column if not exists margem_esq integer not null default 150,
  add column if not exists margem_dir integer not null default 150;

-- O piso protege contra valor gravado fora da tela. `lib/pagina.ts` já prende
-- os números antes de salvar, mas isso é interface — e interface é
-- conveniência, o banco é quem tem a palavra final (mesmo princípio das
-- policies de RLS e do trigger de ciclos).
alter table resumos drop constraint if exists resumos_margens_validas;
alter table resumos
  add constraint resumos_margens_validas
  check (
    margem_esq >= 20 and margem_dir >= 20
    and 920 - margem_esq - margem_dir >= 280
  );

-- ============================================
-- 2. O depósito das imagens
-- ============================================
-- `public = true` porque a imagem de um resumo é servida direto no <img> da
-- página, e URL assinada teria de ser gerada a cada leitura — o que
-- transformaria uma página estática de texto numa consulta por imagem, e
-- venceria no meio da aula do aluno.
--
-- Isso NÃO afrouxa o acesso ao conteúdo: o resumo continua barrado por plano
-- na página, e o que fica público é só o arquivo, num caminho com uuid que
-- ninguém adivinha. Vale o mesmo raciocínio dos eventos da linha do tempo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'imagens',
  'imagens',
  true,
  5242880, -- 5 MB: print de tela e foto de livro cabem; vídeo disfarçado não
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Ler: qualquer um, que é o que `public = true` já implica no bucket — a
-- policy existe para o caso de alguém fechar o bucket depois e esperar que o
-- <img> continue funcionando para quem está logado.
drop policy if exists "imagens sao publicas para leitura" on storage.objects;
create policy "imagens sao publicas para leitura"
  on storage.objects for select
  to public
  using (bucket_id = 'imagens');

-- Escrever: só admin, pela mesma `eh_admin()` da gestão de pessoas. Sem isto,
-- qualquer pessoa autenticada poderia subir arquivo no projeto — inclusive
-- quem acabou de se cadastrar e ainda não tem plano nenhum.
drop policy if exists "admin envia imagens" on storage.objects;
create policy "admin envia imagens"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'imagens' and eh_admin());

drop policy if exists "admin atualiza imagens" on storage.objects;
create policy "admin atualiza imagens"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'imagens' and eh_admin())
  with check (bucket_id = 'imagens' and eh_admin());

drop policy if exists "admin apaga imagens" on storage.objects;
create policy "admin apaga imagens"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'imagens' and eh_admin());

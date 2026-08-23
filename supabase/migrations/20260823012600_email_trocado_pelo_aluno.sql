-- O aluno passa a trocar o próprio e-mail, e a cópia em `planos_usuarios`
-- precisa acompanhar.
--
-- `planos_usuarios.email` existe desde a migration de gestão de pessoas
-- (20260808120000) por um motivo específico: `auth.users` não é legível pelas
-- policies normais e o projeto roda só com a chave anônima, então sem a cópia a
-- tela `/admin/pessoas` mostraria uma lista de UUIDs.
--
-- O trigger de lá é `after insert on auth.users`: a cópia nascia com a conta e
-- nunca mais era tocada. Enquanto trocar de e-mail era pedido no WhatsApp e
-- feito à mão no SQL Editor, dava pra atualizar as duas pontas na mesma visita.
-- Agora que a troca acontece sozinha em `/conta`, ninguém está lá pra fazer
-- isso — e o admin veria para sempre o e-mail com que a pessoa se cadastrou,
-- que é justamente o que ela trocou porque não usa mais.
--
-- `security definer` pela mesma razão do trigger de insert: quem dispara é o
-- confirmador de e-mail do Supabase, sem sessão com permissão de escrever aqui.
-- E as policies de `planos_usuarios` só deixam o ADMIN dar update — o aluno não
-- consegue mexer na própria linha nem para consertar o próprio e-mail.

create or replace function sincronizar_email_do_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update planos_usuarios
     set email = new.email,
         atualizado_em = now()
   where user_id = new.id;
  return new;
end;
$$;

-- `of email` no lugar de um `after update` seco: `auth.users` é escrita a cada
-- login (`last_sign_in_at`) e a cada renovação de token. Sem a coluna no
-- gatilho, esta função rodaria em toda navegação de todo aluno para gravar o
-- mesmo e-mail de novo.
--
-- A condição `is distinct from` fecha o caso restante: um update que TOCA a
-- coluna sem mudar o valor (o próprio Supabase faz isso ao encerrar a troca)
-- ainda assim dispararia o gatilho.
drop trigger if exists trg_sincronizar_email_do_usuario on auth.users;
create trigger trg_sincronizar_email_do_usuario
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function sincronizar_email_do_usuario();

-- Quem já trocou de e-mail à mão antes disto volta a bater.
update planos_usuarios p
   set email = u.email,
       atualizado_em = now()
  from auth.users u
 where u.id = p.user_id
   and p.email is distinct from u.email;

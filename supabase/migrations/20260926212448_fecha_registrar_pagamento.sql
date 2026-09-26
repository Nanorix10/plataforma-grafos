-- `registrar_pagamento` é security definer e nasceu com EXECUTE para PUBLIC,
-- anon e authenticated — ou seja, qualquer um com a chave anônima (que está no
-- JavaScript público) chamava POST /rest/v1/rpc/registrar_pagamento com
-- p_status = 'approved' e ganhava plano ativo, sem pagar.
--
-- A função existe à espera do webhook do Mercado Pago, que ainda não existe
-- (a liberação continua manual, decisão 1b). Hoje ninguém a chama; no dia em
-- que o webhook entrar, ele chama pelo servidor com uma credencial própria, e
-- o grant vai para esse papel — nunca de volta para anon ou authenticated.
--
-- Revoga das três: revogar só de PUBLIC não fecha, porque o Supabase dá
-- EXECUTE ao anon diretamente em toda função nova (ver o aviso da decisão 23).
--
-- Criada fora das migrations, pelo SQL Editor; esta é a primeira vez que ela
-- aparece no repositório.

revoke execute on function public.registrar_pagamento(bigint, uuid, text, text, numeric, integer, text)
  from public, anon, authenticated;

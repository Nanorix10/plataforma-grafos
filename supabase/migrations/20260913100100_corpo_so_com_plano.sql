-- Segunda etapa: a tabela `resumos` fecha. Ver o cabecalho de
-- `..._catalogo_de_resumos.sql` para o porque'.
--
-- `ativo` entra na conta porque `lib/sessao.ts` ja' trata conta inativa como
-- plano `nenhum` -- sem isto o banco seria mais frouxo que a aplicacao, que e' o
-- avesso do que estas migrations existem para fazer.
--
-- Para reverter: apagar esta policy e recriar
--   create policy "usuarios autenticados podem ler resumos"
--     on resumos for select to authenticated using (true);
-- que e' o estado anterior -- e o buraco que isto fecha.

drop policy if exists "usuarios autenticados podem ler resumos" on resumos;

create policy "resumo legivel so com o plano que o cobre"
  on resumos for select to authenticated
  using (
    exists (
      select 1
      from planos_usuarios pu
      where pu.user_id = auth.uid()
        and (
          pu.is_admin = true
          or (
            pu.ativo = true
            and exists (
              select 1 from plano_processos pp
              where pp.plano = pu.plano
                and pp.processo_slug = resumos.processo_slug
            )
          )
        )
    )
  );

# Publicar um rascunho aprovado

Só a sessão principal executa estes passos, e só depois de o autor aprovar o PR na conversa. Um subagente não chega até aqui.

1. **Mesclar.** Use `gh pr merge <n> --merge`, que tem autorização permanente.
2. **Esperar o deploy.** Consulte o status `Vercel` do commit de merge (`gh api repos/Nanorix10/plataforma-grafos/commits/<sha>/status`) até ele virar `success`. Quando o PR traz imagens, confira que cada `/img/resumos/...` responde 200 em produção. Só depois disso o banco pode apontar para elas.
3. **Aplicar.** A CLI do Supabase não está vinculada neste ambiente, então a migration entra pelo MCP `apply_migration`, com os comandos do arquivo (o cabeçalho é comentário e pode ficar de fora).
4. **Conferir o banco.** O `md5(corpo)` tem de ser igual ao md5 do corpo extraído do arquivo. Confira também as conexões (uma por `[[wikilink]]`), o `pai_id` e os tópicos de edital ligados. Anote a versão registrada em `supabase_migrations.schema_migrations`.
5. **Renomear.** O banco registra a versão da hora em que a migration foi aplicada. Renomeie o arquivo para essa versão num PR à parte e mescle (precedentes: PRs #89 e #91).
6. **Conferir em produção,** logado, em `https://plataforma-grafos.vercel.app/resumos/<slug>`: o `h1`, a ficha (Dentro de, Cai em), o número de `.katex` contra o da prévia e nenhum em erro, os links, os itens clicáveis das questões e as figuras com `naturalWidth > 0`.
7. **Registrar** uma linha no `log.md` do vault (`C:\Users\leand\Documents\Obsidian\Claude`).

*Pronto quando* o md5 bate, a página em produção mostra o que a prévia mostrava e o log tem a entrada.

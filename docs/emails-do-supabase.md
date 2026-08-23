# Os e-mails do Supabase

Este projeto manda três e-mails, todos pelo Supabase: **confirmação de
cadastro**, **confirmação de troca de e-mail** e o aviso que acompanha a
segunda. Nenhum deles é código deste repositório — são modelos e configurações
do painel do Supabase, e é por isso que existe este arquivo: sem ele, a metade
da funcionalidade que vive fora do `git` não deixa rastro nenhum.

Projeto: **Plataforma Grafos** (`fprcopgihmxegagsqfqw`).

---

## 1. Site URL e Redirect URLs — o que precisa estar certo

`Authentication → URL Configuration`.

| Campo | Valor |
|---|---|
| Site URL | `https://plataforma-grafos.vercel.app` |
| Redirect URLs | `https://plataforma-grafos.vercel.app/**` e `http://localhost:3000/**` |

**A Site URL não pode ser o endereço do time** (`plataforma-grafos-ae-5672.vercel.app`).
Esse endereço exige login na Vercel: quem clicava no link do e-mail caía numa
tela pedindo acesso ao projeto, que só o Leandro tem. Está registrado como o
item 2 de `auditoria-seguranca.md` — o Davi passou por isso.

As **Redirect URLs** importam para a troca de e-mail: a action manda o aluno de
volta para o domínio por onde ele entrou (lido do cabeçalho do pedido, ver
`app/(app)/conta/actions.ts`), e o Supabase recusa o que não estiver na lista,
caindo na Site URL. Domínio novo — inclusive o de pré-visualização de um deploy,
se alguém for testar por lá — pede uma linha nova aqui.

---

## 2. As duas travas que precisam ficar como estão

`Authentication → Providers → Email` (ou `Sign In / Up`, conforme a versão do
painel).

**Secure email change: LIGADO.** É o que faz o Supabase mandar o link para o
endereço novo **e** um aviso para o antigo, cobrando confirmação nos dois. Sem
ele, quem conseguir a senha de alguém troca o e-mail sem que o dono fique
sabendo — e a mensagem que a tela de `/conta` mostra ("um aviso também vai para
o endereço antigo") passaria a ser mentira.

**Secure password change: DESLIGADO.** Com ele, `updateUser({ password })`
passa a exigir um código enviado por e-mail, e a tela de `/conta` não pede
código nenhum: ela já pede a senha atual, que é a mesma prova por um caminho
mais curto. Se alguém ligar, a troca de senha para de funcionar e o aluno recebe
a frase de `reauthentication_needed` em `lib/erros-auth.ts` — que existe
justamente para esse acidente não virar um erro em inglês.

---

## 3. Os modelos de e-mail (opcional, mas melhor)

`Authentication → Email Templates`.

O modelo padrão usa `{{ .ConfirmationURL }}`, que aponta para o
`/auth/v1/verify` do próprio Supabase: ele confere o código do lado deles e só
então redireciona para cá. **Funciona sem mexer em nada** — `app/auth/confirmar/route.ts`
reconhece esse caso (chega sem `token_hash` e sem `code`) e apenas leva o aluno
até `/conta` dizendo que deu certo.

Trocar os modelos melhora uma coisa só, e não é pouca: a conferência passa a
acontecer **neste site**, com `verifyOtp`, e é só assim que os cookies da sessão
são gravados no navegador que abriu o link. Sem isso, quem confirma a troca pelo
celular confirma de verdade, mas continua deslogado naquele aparelho.

Para adotar, troque o link de cada modelo por:

```
{{ .SiteURL }}/auth/confirmar?token_hash={{ .TokenHash }}&type=TIPO&next=/conta
```

Trocando `TIPO` conforme o modelo:

| Modelo | `type` | `next` |
|---|---|---|
| Confirm signup | `signup` | `/resumos` |
| Change Email Address | `email_change` | `/conta` |
| Reset Password | `recovery` | `/conta` |

(O modelo de recuperação de senha está aqui para o dia em que a tela de
"esqueci minha senha" existir. Hoje ela **não existe**: `/login` só entra e
cadastra, e quem esquece a senha ainda depende do Ronny. É a última peça de
suporte manual que sobrou nesta área.)

---

## 4. O limite de e-mails, que ninguém lembra na hora

O SMTP embutido do Supabase é de cortesia e tem limite baixo — poucos envios por
hora. Em uso normal é invisível, mas o produto vende **por etapa de vestibular**
e os cadastros chegam concentrados: uma divulgação boa põe dezenas de alunos
cadastrando na mesma tarde, e a partir do limite todos recebem
`over_email_send_rate_limit`.

Agora existe um segundo consumidor do mesmo limite — cada troca de e-mail gasta
dois envios, um para cada endereço. O erro já sai em português
(`lib/erros-auth.ts`), o que resolve a experiência e não o teto. A saída de
verdade é SMTP próprio (`Project Settings → Authentication → SMTP Settings`),
e é o item 4 de `auditoria-seguranca.md`.

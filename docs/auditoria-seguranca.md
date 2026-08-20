# Auditoria — achados de segurança e de fluxo

Levantado em 17/08/2026, com o site rodando e medindo contra o Supabase de
produção. Nada aqui foi corrigido: são diagnósticos, e as decisões são do
Leandro.

---

## 1. 🔴 O acervo pago é legível por qualquer conta grátis

**Gravidade: alta. É o modelo de negócio.**

### O que acontece

Uma conta recém-criada — cadastro aberto, sem pagamento, sem liberação — lê o
**corpo completo** de todos os resumos pela API REST do Supabase.

Medido com uma conta em `plano: 'nenhum'`, `ativo: false`, `is_admin: false`,
que é o estado exato de quem se cadastrou e nunca pagou:

| Medida | Resultado |
|---|---|
| Resumos legíveis | **13 de 13** |
| Com `corpo` completo | **13** |
| Conteúdo obtido | **20.184 caracteres** (~11 páginas) |
| Processos alcançados | `passe`, `pas-uem` |
| Matérias alcançadas | `filosofia`, `fisica`, `matematica` |

Sem login nenhum o RLS barra corretamente. O problema é que **o cadastro é
aberto por desenho** (decisão 1b), então a barreira custa dez segundos.

### Como reproduzir

```bash
# 1. criar conta em /login (ou pela API), sem pagar nada
# 2. pegar um access_token com email/senha
# 3. ler o acervo inteiro:
curl "https://<ref>.supabase.co/rest/v1/resumos?select=titulo,corpo" \
  -H "apikey: <chave anon>" \
  -H "Authorization: Bearer <access_token>"
```

A chave anon não é segredo: ela vai no JavaScript que todo visitante baixa, por
desenho do Next e do Supabase. Não há nada a esconder ali — quem protege é o
RLS.

### A causa

`supabase/schema.sql`:

```sql
create policy "usuarios autenticados podem ler resumos"
  on resumos for select
  to authenticated
  using (true);        -- <-- qualquer autenticado, qualquer linha
```

O paywall existe **só na aplicação**: `lib/resumos.ts` filtra por
`PLANO_PROCESSOS` em JavaScript, e `resumos/[slug]/page.tsx` confere `liberado`
antes de renderizar. Quem chama a API direto não passa por nenhum dos dois.

### Por que isso contradiz o próprio projeto

O `CONTEXTO.md` estabelece o princípio duas vezes:

> **Decisão 2:** "quem barra escrita de não-admin são as policies de RLS no
> Postgres."
>
> **Decisão 11:** "a interface ajuda, o banco decide."

Para **escrita** isso é verdade e está bem feito: as policies de insert, update
e delete de `resumos` exigem `is_admin`, e `planos_usuarios` está corretamente
trancada — cada usuário lê só a própria linha (confirmado: a consulta devolveu
1 linha). Para **leitura do conteúdo pago**, o banco não decide nada.

### O que torna o conserto menos óbvio do que parece

Não dá para simplesmente esconder as linhas de quem não tem plano. A lista
**precisa** mostrar o resumo bloqueado com cadeado — é decisão deliberada, e
aparece em três lugares do `CONTEXTO.md`: "resumo bloqueado não recebe cor"
(4c), "resumo fora do plano não abre os títulos" (12), e a tela de `/conta` que
mostra todos os vestibulares para o aluno ver o que ganharia trocando de plano
(9g).

Ou seja: **título e matéria são públicos de propósito; o `corpo` é que é o
produto.** O conserto precisa separar as duas coisas.

### Caminhos possíveis

1. **Separar o corpo em outra tabela** (`resumos_corpo`, 1-para-1), com policy
   que confere plano ativo. `resumos` continua legível e sustenta a lista com
   cadeado. Nativo do Postgres, e a interface não muda de aparência.
2. **Servir o corpo só por rota de servidor**, revogando o select da coluna. Faz
   o Next virar o único caminho, ao custo de uma rota nova e de perder a leitura
   direta que o `/mapa` usa hoje.
3. **Policy com o mapa plano→processos dentro do Postgres.** Exige mover esse
   mapa para o banco (tabela ou função) — hoje ele vive só em `lib/planos.ts`, e
   é justamente por isso que o banco não consegue decidir sozinho.

Qualquer um dos três é migration em banco de produção. Uma policy errada tranca
aluno pagante para fora, então vale rodar em ambiente separado antes.

### Nota sobre o escopo

Hoje o vazamento são ~11 páginas porque o acervo é pequeno. O plano de negócio
declarado é 180+ resumos: **o furo cresce junto com o produto**, e cada resumo
novo entra já exposto.

---

## 2. 🟠 Quem confirma o e-mail cai num muro da Vercel

**Gravidade: média. Atinge todo cliente novo, no primeiro contato.**

O e-mail de confirmação do Supabase leva para:

```
https://plataforma-grafos-ae-5672.vercel.app/
```

Esse é o endereço **do time** na Vercel, e ele exige login na Vercel. O endereço
público do site é `https://plataforma-grafos.vercel.app`.

Confirmado na prática: o Davi clicou no link do próprio e-mail e não conseguiu
concluir — caiu numa tela pedindo acesso ao projeto, que só o Leandro tem.

> A confirmação em si **funciona** — ela acontece no `/auth/v1/verify` do
> Supabase, antes do redirecionamento. O que quebra é a página onde o aluno
> aterrissa depois. Então o dano não é "ninguém consegue se cadastrar", é "todo
> aluno novo acha que não conseguiu".

**Conserto:** painel do Supabase → Authentication → URL Configuration → **Site
URL**, trocando para `https://plataforma-grafos.vercel.app`. É configuração de
painel, não código.

Vale conferir junto a lista de **Redirect URLs** do mesmo painel.

---

## 3. 🟡 Login com Google não existe, e a documentação diz que sim

Consultando `/auth/v1/settings` do projeto:

| Campo | Valor |
|---|---|
| `external.email` | `true` |
| `external.google` | **`false`** |
| `mailer_autoconfirm` | `false` (confirmação exigida) |
| `disable_signup` | `false` |

A tela de `/login` também não tem botão de Google nenhum — só e-mail e senha.

Contra isso:

- O `CONTEXTO.md` lista **"login Google funcionando"** entre as coisas feitas.
- O planejamento técnico decidiu **"Google + e-mail/senha (via Supabase Auth)"**.
- O checklist do produto pede **"login e senha, mas facilitado pelo google"**.

São três documentos afirmando o que não existe. Não é urgente como o item 1, mas
é atrito de cadastro num produto que vende para adolescente no celular — e é
documentação que engana quem chegar ao projeto depois.

---

## 4. 🟡 O limite de e-mail do Supabase é baixo, e ninguém vai saber por quê

O SMTP embutido do Supabase parou os cadastros com
`over_email_send_rate_limit` depois de poucas tentativas seguidas, por cerca de
uma hora.

Em uso normal isso é invisível. Mas o produto vende **por etapa de vestibular**,
então os cadastros chegam concentrados: uma divulgação bem-sucedida põe dezenas
de alunos cadastrando na mesma tarde, e a partir do limite todos recebem erro.

Hoje o erro pelo menos **fala português** ("Muitas tentativas seguidas. Espere
alguns minutos e tente de novo") — antes vinha `email rate limit exceeded` cru.
Mas quem for barrado não vai entender que o problema não é dele.

**Conserto:** configurar SMTP próprio no Supabase (Custom SMTP) antes da
primeira divulgação grande.

---

## O que foi verificado e está CORRETO

Registrado porque auditoria que só lista problema não diz onde não olhar de novo:

- **`planos_usuarios` está bem trancada.** A conta de teste leu exatamente 1
  linha, a própria. A recursão de policy e o "admin não tira o próprio selo"
  (decisão 1b) estão resolvidos como o `CONTEXTO.md` descreve.
- **Escrita em `resumos` exige `is_admin`** — insert, update e delete conferem.
- **Sem autenticação, o RLS barra tudo.** O vazamento do item 1 exige conta.
- **A chave anon publicada está limpa**, sem o BOM que o `CONTEXTO.md` registra
  como armadilha do PowerShell.
- **Não há `service_role` em lugar nenhum** do código nem do bundle.

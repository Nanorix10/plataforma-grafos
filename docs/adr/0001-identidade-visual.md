# ADR 0001 — O código é a verdade da identidade visual

- **Data:** 2026-08-17
- **Situação:** aceita

## Contexto

Existia um documento de identidade visual fora do repositório, escrito para
orientar quem fosse mexer no desenho do site. Ao usá-lo para trabalhar na
landing, ele e o `globals.css` discordavam em quase tudo o que importa:

| Assunto | O documento dizia | O código faz |
|---|---|---|
| Neutros | frios (`#f4f5f7` / `#0e0f18`) | **mornos** (`#F3F1EC` / `#12111A`) |
| Raio | 8px / 6px | **12px / 9px** |
| Mecanismo de tema | três cópias da paleta (`:root` + `@media` + `[data-theme]`) | **`light-dark()`, uma cópia**, com `data-tema` |
| Fontes | duas (Inter, IBM Plex Mono) | **três** — falta a Nunito, que é o corpo do resumo |
| Peso | "evitar 700/800" | **800 no título** do resumo, 500 no `strong`, e a distância entre os dois é a decisão |
| Tokens | não menciona | `--fonte-resumo`, `--acento-escuro`, `--stamp`, `--sombra-alta`, `--cor-materia` |

O documento não estava errado por descuido: ele fotografou um estado real e
anterior. A paleta esfriada é de antes do commit *"Aquece os neutros do site"*
(15/08/2026), e a descrição do tema é de antes da decisão 4b do `CONTEXTO.md`.

Duas fontes de verdade discordando sobre desenho é pior do que uma só incompleta:
quem lê o documento produz componente que não combina com o site, e quem lê o
código não sabe que existe uma intenção documentada em outro lugar.

## Decisão

**O `globals.css` é a fonte de verdade da identidade visual.** O documento passa a
viver dentro do repositório, em `docs/identidade-visual.md`, reescrito a partir do
CSS real e medido.

Quando os dois divergirem, o CSS ganha e o documento é corrigido — nunca o
contrário por reflexo.

Três coisas do documento antigo foram **preservadas**, porque ele estava à frente
do código nelas e não atrás:

1. **Os motivos de marca** (grafo, cartão-resposta, faixa) e a ideia de que a marca
   deve crescer a partir do conteúdo do produto.
2. **A regra do máximo um elemento em `--faixa` por tela.**
3. **O buraco do token de hero**, que o documento identificou e que virou
   `--t-hero`.

## Por que o código, e não o documento

O CSS não é só mais recente: cada valor dele carrega, em comentário, a razão de
ser aquele valor — por que os neutros são mornos, por que 12px e não 8px, por que
`light-dark()` em vez de três cópias, e as medições de contraste das 12 matérias
em WCAG AA. O documento trazia os valores sem as razões.

Adotar o documento como alvo custaria desfazer decisões justificadas e medidas
para casar com uma foto desatualizada, e reintroduziria o padrão de três cópias
da paleta que a decisão 4b recusa por escrito.

## Consequências

- Componente novo lê `docs/identidade-visual.md`, e o documento aponta para as
  decisões do `CONTEXTO.md` em vez de repeti-las.
- Todo par novo de cor e fundo é **medido** nos dois temas antes de entrar. Este
  projeto já teve comentário no CSS afirmando um contraste que a medição
  desmentiu, e é por isso que a regra é explícita.
- Este é o primeiro arquivo em `docs/adr/`. O `docs/agents/domain.md` prevê que a
  pasta nasça na primeira decisão que mereça arquivo próprio; as demais decisões
  continuam no `CONTEXTO.md`, e mudar isso não faz parte desta.
- O documento fora do repositório fica obsoleto de propósito. Se alguém o
  reencontrar, este ADR é o que explica por que ele não vale.

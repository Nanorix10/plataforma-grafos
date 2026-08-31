# Valores levantados do código (não estimar — o CSS ganha)

> [!warning] Isto é uma FOTO de 2026-08-26, e parte dela já caducou.
> O arquivo foi levantado para desenhar as três direções da landing. Desde
> então o código andou, e estas linhas contam três coisas erradas:
>
> - **A tipografia.** Interface e marca são **Bricolage Grotesque** (não Inter)
>   e o corpo do resumo é **Plus Jakarta Sans** (não Nunito), desde 27/08.
> - **O container.** É `.envelope` — `min(100% - 2*clamp(1.25rem,4vw,3.5rem),
>   1440px)` —, não 1120 com 32 de padding, desde 31/08.
> - **A landing não usa mais a Gabarito nem a escala de hero daqui.** Ela tem
>   gramática própria, monoespaçada, desde 31/08 (decisão 13 do `CONTEXTO.md`).
>
> O que continua valendo: as cores, as doze matérias, o ritmo de seção e —
> principalmente — a seção "Conteúdo real (nunca inventar)", que é a parte que
> este arquivo existe para proteger.

Fonte: `src/app/globals.css`, `docs/identidade-visual.md`, `src/lib/*`.

## Cor (lado CLARO do `light-dark()`)
page #F3F1EC · paper #FCFAF6 · panel #F6F3ED · raised #FAF7F1 · sel #EBE7DF
ink #1A1814 · ink-soft #3E3B33 · ink-dim #5A564B · ink-faint #6C6759
line #E7E3DA · line-forte #CFC9BC
acento #5B4BC4 · acento-claro #3F32A0 · acento-fraco rgba(91,75,196,.10)
faixa #262A60 · faixa-ink #F3F5FE · faixa-dim #C7C8F0 · erro #B3243C

## Tipo
mini 12 · peq 13 · base 15 · medio 17 · grande 22 · titulo 28
hero clamp(2.75rem, 6.4vw, 4.5rem) → 72px num quadro de 1200, 44px num de 390
display Gabarito (h1/h2, letter-spacing -.03em) · interface Inter · resumo Nunito

## Forma e ritmo
raio 12 · raio-peq 9 · sombra `0 0 0 1px #CFC9BC`
ritmo-secao clamp(3.5rem, 7vw, 5rem) → 80px em 1200, 56px em 390
container max-width 1120, padding 0 32 · nav 68px
.botao padding 10/16, raio 9, peso 600, 15px · .botao-primario contornado

## Matérias (hex claro)
portugues #C2334D · literatura #9C4B42 · matematica #1F5F9E · fisica #0B7A80
quimica #9E2E70 · biologia #3F7848 · geografia #A65224 · filosofia #4A5C8C
sociologia #A63A63 · historia #7A3785 · arte #5646A8 · redacao #3D7A8C

## Conteúdo real (nunca inventar)
- `lib/numeros.ts`: 24 matérias · 3 processos · 180+ resumos · Campo Grande MS
- `lib/autor.ts`: Leandro — 1º em medicina no PASSE/UFMS 2025; 920 na redação do
  ENEM 2025 cursando o 1º ano; ouro no ranking Poliedro/Colégio Harmonia 2025
- `lib/planos.ts`: **preco: null nos três** → marcador `[PREÇO]`
- `Depoimentos` devolve null sem depoimento cadastrado → **não entra**
- FAQ: 3 respostas prontas; prazo, reembolso e conta compartilhada ainda sem
  decisão → não entram

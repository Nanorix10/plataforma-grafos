# Moldes

Os moldes de HTML e SQL dos três resumos já publicados no modelo: `20261007190317_rascunho_teorias_demograficas.sql`, `20261007194940_rascunho_macromoleculas.sql` e `20261008122943_rascunho_progressoes.sql`. Na dúvida, o arquivo publicado vale mais do que este resumo dele.

## Corpo

O corpo vai para o banco do jeito que o editor TipTap grava. Uma tag fora destes moldes pode sumir quando o autor abrir o resumo no editor.

**Abertura:** um parágrafo com a definição, sem título, seguido da lista organizadora.

```html
<p>definição formal;</p>
<ul><li><p><strong>Parte A:</strong> o que é;</p></li>
<li><p><strong>Parte B:</strong> o que é.</p></li></ul>
```

**Grafo corrido:** um `h2` por conceito. O `h3`/`h4` de dentro segue o mesmo formato. A definição começa em minúscula.

```html
<h2 data-corrido="sim">Termo:</h2>
<p>definição em minúscula;</p>
<ul><li><p><strong>Fundamento:</strong> o porquê da fonte;</p>
<ul><li><p>sub-item;</p></li></ul></li>
<li><p><strong>Ex:</strong> exemplo da fonte.</p></li></ul>
```

**Fórmula:** o TeX vai sempre em atributo, nunca entre `$…$`. Dentro de atributo, escreva `<` como `&lt;` e `>` como `&gt;`. Química usa `\ce{...}`.

```html
<span data-type="inline-math" data-latex="a_n=a_1+(n-1)\cdot r"></span>
<div data-type="block-math" data-latex="S_n=\frac{(a_1+a_n)\cdot n}{2}"></div>
```

Símbolo nomeado com unidade, como sub-item: `<li><p><span data-type="inline-math" data-latex="v"></span>: velocidade (m/s);</p></li>`.

**Exemplo resolvido:** `<ol>` com um passo por item.

**Figura:** a legenda sai do `alt` (decisão 24). Para uma figura estreita, use `width:70%` e `data-largura="70%"`.

```html
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/<matéria>/<nome>.webp" alt="O que a figura mostra." style="width:100%" data-largura="100%"></figure>
```

**Tabela comparativa:** a primeira linha leva `<th>`, e cada célula tem um `<p>`.

```html
<table><tbody><tr><th><p></p></th><th><p><strong>A</strong></p></th><th><p><strong>B</strong></p></th></tr>
<tr><td><p>Critério</p></td><td><p>…</p></td><td><p>…</p></td></tr></tbody></table>
```

**Pegadinhas:** caixa de uma célula. Cada item traz a prova de origem entre parênteses. Sem prova, a caixa não entra.

```html
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>afirmação correta que a prova inverteu (PAS-UEM 2025, 3ª etapa).</p></li></ul></td></tr></tbody></table>
```

**Questão somatória:** os itens são parágrafos de primeiro nível no formato `(01)`, `(02)`, `(04)`. O `data-gabarito` é a soma, e cada item da resolução diz `Correta.` ou `Incorreta.`. A questão não tem título.

```html
<aside class="questao" data-id="<uuid>" data-gabarito="18"><p>(PAS-UEM 2025, 3ª etapa) Enunciado. Assinale o que for correto.</p><p>(01) …</p><p>(02) …</p><p>(04) …</p><p>(08) …</p><p>(16) …</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Incorreta. …;</p><p>(02) Correta. …;</p><p>…</p><p><strong>Soma: 02 + 16 = 18</strong></p></div></aside>
```

**Questão objetiva:** as alternativas são `A) …` a `E) …`, um parágrafo cada, em ordem, e o `data-gabarito` é a letra.

**Para revisar:** de 4 a 8 pares, cada um respondível de memória.

```html
<h2>Para revisar</h2>
<h3 data-corrido="sim">Termo:</h3>
<p>resposta em uma linha;</p>
```

## Migration

O corpo entra entre aspas simples. Confira que ele não tem nenhuma `'` (`grep -c "'" corpo.html` tem de dar 0); se tiver, troque por `’` ou dobre para `''`.

```sql
-- <Título>: rascunhado por Claude no modelo de docs/produto/modelo-de-resumo.md
-- (skill rascunhar-resumo) e revisado pelo autor. Aprovar o PR é publicar.
--
-- ## Por que este tópico
-- <lacuna conferida no banco em DD/MM/AAAA; tópicos de edital; processo>
--
-- ## Fontes, e só elas
-- 1. Caderno: <caminho no zip>, seção <CABEÇALHO>, §<ini>–<fim> do extrator.
-- 2. Edital: <tópicos>.
-- 3. Provas: <prova, etapa, questão (gabarito)>, em Documents/UEM-Provas/<pdf>, p. <n>.
--
-- ## O que difere do caderno
-- <decisões do autor nas paradas; acréscimos com fonte; normalizações de forma>
--
-- ## Edital
-- <tópicos ligados e os que ficaram de fora, com o motivo>

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, pai_id, corpo)
select
  '<slug>',
  '<Título>',
  '<matéria>',
  '<processo: comum quando está em mais de um edital (decisão 1c)>',
  '<definição: uma frase, até 160 caracteres>',
  (select id from resumos where slug = '<pai ou remova a linha e a coluna>'),
  '<corpo>'
on conflict (slug) do nothing;

update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = '<processo>'
   and e.etapa = <n>
   and e.texto = '<texto exato do tópico>'
   and e.resumo_id is null
   and r.slug = '<slug>';
```

## PR

Título: `Draft summary: <Título>`. O commit fica em inglês e o corpo do PR em português, com estas seções:

- **Tópico:** matéria, processo, pai, e a lacuna que o resumo preenche.
- **Fontes:** caderno, edital e provas.
- **Decisões do autor:** cada parada e a resposta dada.
- **Acréscimos além do caderno:** cada um com a fonte.
- **Normalizações de forma:** cada troca, no formato "antes" → "depois".
- **Figuras:** lista, com as suspeitas de origem externa marcadas.
- **Edital:** os tópicos ligados e os que ficaram de fora.
- **Ligações:** os `[[wikilinks]]`, todos conferidos.
- **Sugestões, fora do texto por falta de fonte.**
- **Prévia:** o relatório do script (fórmulas, links, questões).

Termine com a linha de atribuição do Claude Code.

-- Desfaz no conteúdo o que o defeito do `:` deixou gravado.
--
-- "Filosofia da Linguagem" foi escrito em 08/08, quando digitar dois pontos
-- num grafo embrulhava o resto do título em <strong> em vez de abrir o
-- parágrafo da explicação (a regra do `:` nunca rodava — `termoNegrito`
-- casava primeiro). O commit "Faz o negrito significar grafo, e só grafo"
-- corrigiu o editor, mas correção de editor não volta no que já está salvo.
--
-- Este é o único resumo do banco escrito naquela janela. Conferido varrendo o
-- `corpo` de todos os treze: nenhum outro tem <strong> dentro de h2/h3/h4.
--
-- ============================================
-- 1. A explicação sai de dentro do título
-- ============================================
-- O título volta a ser só o nome do assunto, com o `:` que o autor digitou
-- (decisão 12c-bis: o caractere fica gravado, quem o tira do rótulo do nó é
-- lib/titulos.ts). A explicação vira o parágrafo seguinte, em texto normal —
-- se o negrito marca o grafo, ele não pode marcar a definição também.
--
-- O `data-corrido="sim"` FICA nos dois: agora existe o parágrafo que ele
-- precisa puxar para o lado, que é justamente o formato de origem dos
-- resumos ("Termo: definição"). Antes ele flutuava sem par.
--
-- Nenhuma palavra muda. Os deslizes do original continuam onde estavam
-- ("bertrand" em minúscula, "filofia", "Witgenstei"): o texto é do autor, e
-- quem migra não corrige de passagem.
update resumos set
  corpo =
    '<h2 data-corrido="sim">Filosofia da linguagem:</h2>' ||
    '<p>ramo da filosofia que estuda a natureza, o uso, a interpretação e a essência do fenômeno linguístico;</p>' ||
    '<h3 data-corrido="sim">bertrand Russell:</h3>' ||
    '<p>influente filósofo, matemático, lógico e ativista político britânico do século XX;</p>' ||
    '<ul><li><p><strong>Criador da filofia da linguagem</strong></p></li></ul>' ||
    '<h3>Witgenstei</h3><p></p>',

  -- ============================================
  -- 2. As margens voltam ao padrão
  -- ============================================
  -- Estava em 20/20, o mínimo que o `check` aceita: coluna de 880px, contra os
  -- 620px de todos os outros resumos. Não foi escolha de leitura — é o valor
  -- que sobra quando a régua é arrastada até o fim. MARGEM_PADRAO de
  -- lib/pagina.ts é 150.
  margem_esq = 150,
  margem_dir = 150,

  -- ============================================
  -- 3. O slug perde os espaços
  -- ============================================
  -- Era `filosofia da linguagem`, com espaços de verdade — o único assim no
  -- banco. A URL virava /resumos/filosofia%20da%20linguagem. O slug sai do
  -- campo do formulário sem passar por nenhuma normalização (actions.ts só dá
  -- trim), então nada impedia.
  --
  -- Trocar não quebra link: a tabela `conexoes` está vazia nos dois sentidos
  -- para este resumo, e nenhum outro corpo o cita em [[...]].
  slug = 'filosofia-da-linguagem'

where id = '3408e509-c8d7-40a8-aa2f-48f43736b472';

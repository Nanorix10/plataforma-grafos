-- Importa a Língua Portuguesa da 1ª etapa do PAS UEM.
--
-- Vem do `.docx` desta vez (decisão 9c), então as sete imagens do documento
-- vieram junto — e uma delas não era imagem.
--
-- ## Um documento, um resumo
--
-- A matéria tem UM tópico escrito: a sequência frase → oração → período, com a
-- árvore inteira das orações pendurada no período composto. Os outros dez
-- tópicos são só a lista do edital, e não entram (nó de mapa que abre em branco
-- é pior que nó nenhum).
--
-- O título "Frase, oração e período" é a única coisa que não está escrita no
-- documento: lá os três são itens irmãos, sem um nome que os agrupe, e um
-- resumo precisa de título. São os três nomes do autor, na ordem dele.
--
-- ## A tabela das conjunções voltou a ser tabela
--
-- No Docs ela era um PRINT colado — a lista de conjunções coordenativas com os
-- conectivos e a relação semântica de cada uma. Imagem de tabela não se
-- seleciona, não se busca, não se lê em leitor de tela e some no zoom do
-- celular. O editor tem tabela de verdade desde sempre, então ela entra como
-- `<table>`, palavra por palavra do print.
--
-- As outras seis são exemplos anotados em cores e setas (a oração principal de
-- um lado, a subordinada do outro). Essas continuam imagem: o desenho é a
-- explicação. Cada uma leva no `alt` a frase de exemplo por extenso.
--
-- ## Duas coisas de forma
--
-- Os três itens em negrito viraram grafos `h2` no formato corrido `Termo:` +
-- explicação. Negrito dentro do título sai: o título já é o grafo, e no Docs o
-- item inteiro vinha em negrito de qualquer jeito.
--
-- O "Podem ser…" solto no meio da lista fica DENTRO do item que o precede. No
-- Docs ele aparece na margem, mas é ali que ele pertence — fechar a lista nele
-- jogaria "Subjetivas", "Predicativas" e as outras quatro para a raiz, e a
-- árvore que o autor montou com o recuo se desfaria.
--
-- Nenhuma palavra mudou, e os deslizes do original continuam ("linguistica",
-- "própia", "contruir", "oraçãoes", "poir conexão", "entre sí", "Apostativa").

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'frase-oracao-e-periodo',
  'Frase, oração e período',
  'portugues',
  'pas-uem',
  'Da frase ao período composto, com a árvore das orações coordenadas e subordinadas.',
  '<h2 data-corrido="sim">Frase:</h2><p>unidade da comunicação linguistica dotada de sentido completo e entonação própia;</p><h2 data-corrido="sim">Oração:</h2><p>estrutura linguistica organizada em torno de um verbo ou uma locução verbal podendo contruir sentido pleno ou depender sintaticamente de outras oraçãoes para ter sentido completo;</p><h2 data-corrido="sim">Período (sentença):</h2><p>frase organizada em uma ou mais orações (ex: "Ela cantou e ele dançou");</p><ul><li><p>Simples: formado por apenas uma oração (verbo/locução verbal);</p><ul><li><p>Ex: Faltam apenas alguns dias.</p></li></ul></li><li><p>Composto (complexa): formado por mais de uma oração (verbo/locução verbal);</p><ul><li><p>Ex: Não sei se tenho coragem.</p></li><li><p>Coordenação: articulação de orações equivalentes e independentes sintaticamente;</p><ul><li><p>Orações coordenadas assindéticas: articuladas por justaposição (sem conectivo);</p></li><li><p>Orações coordenadas sindéticas: articuladas poir conexão (com conectivo);</p><ul><li><table><tbody><tr><th><p>Conjunções coordenativas</p></th><th><p>Exemplos de conectivos mais comuns</p></th><th><p>Relação semântica/argumentativa</p></th></tr><tr><td><p>Aditivas</p></td><td><p>e, nem, não só… mas também, mas ainda</p></td><td><p>Soma de ideias</p></td></tr><tr><td><p>Alternativas</p></td><td><p>já… já, ou, ou… ou, ora… ora, quer… quer</p></td><td><p>Alternância ou escolha</p></td></tr><tr><td><p>Adversativas</p></td><td><p>contudo, mas, todavia, entretanto, no entanto, porém</p></td><td><p>Oposição</p></td></tr><tr><td><p>Conclusivas</p></td><td><p>portanto, assim, então, logo, por isso, pois (após o verbo)</p></td><td><p>Conclusão</p></td></tr><tr><td><p>Explicativas</p></td><td><p>pois (antes do verbo), porque, que, porquanto</p></td><td><p>Explicação</p></td></tr></tbody></table></li></ul></li></ul></li><li><p>Subordinação: articulação de orações dependentes sintaticamente entre sí;</p><ul><li><p>Orações subordinadas substantivas: funcionam sintaticamente como substantivo</p><ul><li><p>São introduzidas por conjunção integrante, normalmente que ou se;</p><p>Podem ser…</p></li><li><p>Subjetivas: atuar como sujeito para a oração principal:</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/subordinada-subjetiva.webp" alt="Ex.: “Interessa-me / que você compareça à reunião.” A primeira oração é a principal; a segunda, a subordinada substantiva subjetiva." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Predicativas: atua como predicativo do sujeito da oração principal;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/subordinada-predicativa.webp" alt="Ex.: “O problema é / que o prazo já se esgotou.” A segunda oração é a subordinada substantiva predicativa." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Completiva nominal: atua como complemento nominal da oração principal;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/subordinada-completiva-nominal.webp" alt="Ex.: “Chego à conclusão de que o contrato é legal.” A segunda oração é a subordinada substantiva completiva nominal." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Objetiva direta: atua como objeto direto da oração:</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/subordinada-objetiva-direta.webp" alt="Ex.: “Eles não permitem / que os índios vivam em paz.” A segunda oração é a subordinada substantiva objetiva direta." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Objetiva indireta: atua como objeto indireto da oração:</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/subordinada-objetiva-indireta.webp" alt="Ex.: “Ninguém desconfiava de que o plano fracassasse.” A segunda oração é a subordinada substantiva objetiva indireta." style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Apostativa: atua como aposto da oração principal;</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/portugues/subordinada-apositiva.webp" alt="Ex.: “Existe nos presídios esta lei: (que) ninguém denuncia ninguém.”" style="width:100%" data-largura="100%"></figure></li></ul></li><li><p>Podem ser expressas na forma reduzida:</p></li></ul></li><li><p>Adjetivas: funcionam sintaticamente como adjetivos;</p></li><li><p>Adverbiais:</p></li></ul></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

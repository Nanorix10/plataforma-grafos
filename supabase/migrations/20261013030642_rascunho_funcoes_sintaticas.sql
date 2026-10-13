-- Funções sintáticas: rascunhado por Claude no modelo de
-- docs/produto/modelo-de-resumo.md (skill rascunhar-resumo) e revisado pelo
-- autor. Aprovar o PR é publicar.
--
-- **Junta dois resumos em um.** Sujeito e Predicado existiam como resumos
-- soltos (918 e 659 caracteres, sem pai, sem edital, sem questão). Decisão do
-- autor em 12/10/2026: apagar os dois e reuni-los aqui, cada um como seção
-- (grafo `h2`) do resumo novo, ao lado dos termos integrantes e acessórios.
--
-- ## Por que este tópico
--
-- Conferido no banco em 12/10/2026: o tópico 3 de português da 1ª etapa do
-- PAS-UEM ("Funções sintáticas e produção do sentido.") estava sem resumo;
-- nenhum resumo chamado "Funções sintáticas" (slug livre). Objetos,
-- complemento nominal, agente da passiva, predicativos, adjunto adnominal,
-- aposto e vocativo não tinham resumo próprio. Processo `comum`, como os dois
-- que ele substitui (decisão 1c).
--
-- ## Fontes, e só elas
--
-- 1. Caderno:
--    - `Resumos 2026/Resumos 2°bi 2° ano/Resumo para PR1G1.docx`, seção
--      `LÍNGUA PORTUGUESA`, §00003–00036 do extrator (termos integrantes e
--      acessórios, aposto, vocativo). Texto idêntico em `Resumos 2026/Resumos
--      1º bimestre 2°ano/Resumo para Simulado Harmonia_ 1º dia.docx`,
--      §00003–00038.
--    - Sujeito: `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para
--      PR1G1.docx`, `LÍNGUA PORTUGUESA`, §00011–00021.
--    - Predicado: `Materias e conteúdos feitos/Língua Portuguesa.docx`,
--      §00400–00406.
--    - Transitividade: `Resumos 2026/Resumos 1º bimestre 2°ano/Resumo para
--      PR2G1.docx`, `LÍNGUA PORTUGUESA`, §00003–00011.
--    - Vocativo e função apelativa: `Materias e conteúdos feitos/Língua
--      Portuguesa.docx`, §00032.
-- 2. Edital: PAS-UEM, 1ª etapa, português, tópico 3.
-- 3. Provas, todas em `Documents/UEM-Provas/`:
--    - PAS-UEM 2024, etapa 1, questão 30 (gabarito 03), `pdfs/pas24/E1.pdf`,
--      p. 12: a questão, a Obs do objeto direto oculto e duas pegadinhas;
--    - PAS-UEM 2024, etapa 1, questão 31 (gabarito 14), mesma página: a Obs
--      do vocativo (item 08, correto);
--    - PAS-UEM 2019, etapa 1, questão 31 (gabarito 22), `pdfs/pas19/E1G1.pdf`,
--      p. 14: pegadinhas (itens 01 e 08);
--    - PAS-UEM 2016, etapa 1, questões 30 (gabarito 23) e 31 (gabarito 27),
--      `pdfs/pas16/E1G1.pdf`: o Ex do complemento nominal (Q30, item 16) e
--      pegadinhas (Q30, item 08; Q31, item 04);
--    - PAS-UEM 2018, etapa 1, questão 29 (gabarito 21), `pdfs/pas18/E1G1.pdf`:
--      pegadinha (item 02).
--
-- ## Correções de conteúdo, decididas pelo autor em 12/10/2026
--
-- 1. Predicado verbo-nominal: o caderno dizia "possui dois núcleos: um verbo
--    de ação e um predicativo do sujeito" e "(Verbo de ação: consideraram;
--    Predicativo do sujeito: culpado)" (Língua Portuguesa.docx
--    §00405–00406). "culpado" caracteriza o objeto "o réu": virou
--    "predicativo (do sujeito ou do objeto)" e "predicativo do objeto:
--    culpado".
-- 2. Sujeito: os cadernos de 2025 dizem "aquele que pratica a ação do qual se
--    fala" (Língua Portuguesa.docx §00214); a prova cobra que sujeito não é
--    necessariamente o agente (PAS 2019 Q31; PAS 2024 Q30). Fica a definição
--    de 2026 ("de quem ou do que se fala"), e a distinção vai para Pegadinhas.
--    O resumo `morfossintaxe` não muda.
-- 3. Verbo de ligação: o caderno dizia "indicam estado, sentimento, qualidade
--    ou defeito" (PR2G1 §00004); fica só "liga o sujeito ao predicativo"
--    (§00005). Os itens vazios do caderno ("Ex", "Objeto direto (VTD):",
--    "Objeto indireto (VTI):") saíram; VTD e VTI viraram um item cada, ligando
--    o verbo ao objeto que o próprio caderno pôs abaixo dele.
--
-- ## Edital
--
-- Ligado: PAS-UEM, 1ª etapa, português, "Funções sintáticas e produção do
-- sentido." A parte de "produção do sentido" não está no caderno: fica
-- coberta pelas questões e pelas Obs/pegadinhas tiradas delas (objeto oculto
-- recuperado pelo contexto, sujeito × agente, vocativo na interação).
-- O tópico 10 ("Período simples e produção de sentido.") continua em
-- `frase-oracao-e-periodo`.
--
-- ## Referências aos dois resumos apagados (levantadas em 12/10/2026)
--
-- FKs para `resumos`: resumos.pai_id, conexoes.origem_id/destino_id,
-- eventos.resumo_id, edital_topicos.resumo_id, leituras.resumo_id,
-- grifos.resumo_id, respostas.resumo_id. Na data: 0 filhos, 0 conexões,
-- 0 eventos, 0 tópicos de edital, 0 leituras, 0 grifos, 0 respostas e
-- 0 wikilinks `[[Sujeito]]`/`[[Predicado]]` em outros resumos. Mesmo assim,
-- cada passo abaixo redireciona o que existir na hora em que a migration
-- rodar, e ela aborta se houver grifo ou resposta.

-- 1. O resumo novo.
insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'funcoes-sintaticas',
  'Funções sintáticas',
  'portugues',
  'comum',
  'Os termos da oração: sujeito e predicado, termos integrantes (complementos, agente da passiva, predicativo) e acessórios (adjuntos, aposto, vocativo).',
  '<p>funções sintáticas (termos da oração): papel que cada termo exerce na oração;</p>
<ul><li><p><strong>Sujeito e predicado:</strong> sujeito simples, composto, oculto, indeterminado e inexistente; predicado verbal, nominal e verbo-nominal;</p></li>
<li><p><strong>Termos integrantes da oração:</strong> complemento nominal, objeto direto, objeto indireto, agente da passiva e predicativo;</p></li>
<li><p><strong>Termos acessórios da oração:</strong> adjunto adnominal, adjunto adverbial, aposto e vocativo;</p></li>
<li><p><strong>Obs:</strong> as orações que exercem essas funções em [[Frase, oração e período]]; a função sintática de cada classe de palavra em [[Morfossintaxe]].</p></li></ul>
<h2 data-corrido="sim">Sujeito:</h2>
<p>parte da oração sobre a qual a restante oração se refere, ou seja, de quem ou do que se fala;</p>
<ul><li><p><strong>Simples:</strong> tem apenas um núcleo;</p>
<ul><li><p><strong>Ex:</strong> O paciente foi atendido;</p></li></ul></li>
<li><p><strong>Composto:</strong> tem mais do que um núcleo;</p>
<ul><li><p><strong>Ex:</strong> Mousses e brownies são os meus doces preferidos;</p></li></ul></li>
<li><p><strong>Oculto (elíptico, desinencial ou implícito):</strong> identificado pela desinência verbal ou pelo contexto;</p>
<ul><li><p><strong>Ex:</strong> (Nós) Andamos a tarde toda;</p></li></ul></li>
<li><p><strong>Indeterminado:</strong> não se pode determinar quem realizou a ação;</p>
<ul><li><p><strong>Ex:</strong> Opinam sobre tudo;</p></li></ul></li>
<li><p><strong>Inexistente:</strong> ocorre em orações sem sujeito, geralmente com o verbo haver no sentido de existir, ou com verbos que indicam fenômenos da natureza;</p>
<ul><li><p><strong>Ex:</strong> Amanheceu.</p></li></ul></li></ul>
<h2 data-corrido="sim">Predicado:</h2>
<p>verbal, nominal ou verbo-nominal, conforme o núcleo;</p>
<ul><li><p><strong>Verbal:</strong> o núcleo é um verbo que indica uma ação;</p>
<ul><li><p><strong>Ex:</strong> “O cachorro rosnou para o desconhecido.”;</p></li></ul></li>
<li><p><strong>Nominal:</strong> o núcleo é um predicativo do sujeito, ou seja, uma qualidade ou estado do sujeito, ligado por um verbo de ligação;</p>
<ul><li><p><strong>Ex:</strong> “Os alunos estão apressados.” (verbo de ligação: estão; núcleo: apressados);</p></li></ul></li>
<li><p><strong>Verbo-nominal:</strong> possui dois núcleos: um verbo de ação e um predicativo (do sujeito ou do objeto);</p>
<ul><li><p><strong>Ex:</strong> “Os jurados consideraram o réu culpado.” (verbo de ação: consideraram; predicativo do objeto: culpado).</p></li></ul></li></ul>
<h3 data-corrido="sim">Predicação/transitividade verbal:</h3>
<p>relação que um verbo estabelece com os seus complementos na formação do predicado;</p>
<ul><li><p><strong>Verbo de ligação (VL):</strong> liga o sujeito ao predicativo;</p></li>
<li><p><strong>Verbo significativo/nocional:</strong> transmite uma ação;</p>
<ul><li><p><strong>Verbo transitivo direto (VTD):</strong> o complemento é o objeto direto;</p></li>
<li><p><strong>Verbo transitivo indireto (VTI):</strong> o complemento é o objeto indireto;</p></li>
<li><p><strong>Verbo intransitivo (VI):</strong> não necessita de complemento.</p></li></ul></li></ul>
<h2>Termos integrantes da oração</h2>
<h3 data-corrido="sim">Complemento nominal:</h3>
<p>termo preposicionado da oração que completa o sentido de um substantivo abstrato, um adjetivo ou um advérbio;</p>
<ul><li><p><strong>Ex:</strong> Já terminou a construção (subst. abstr.) do prédio;</p></li>
<li><p><strong>Ex:</strong> em “uso de uniforme”, “de uniforme” completa semântica e sintaticamente o nome “uso” (PAS-UEM 2016, 1ª etapa).</p></li></ul>
<h3 data-corrido="sim">Objeto direto:</h3>
<p>complemento verbal sem preposição;</p>
<ul><li><p><strong>Ex:</strong> Comprei uma bolsa (núcleo) de couro;</p></li>
<li><p><strong>Obs:</strong> pode ficar oculto e ser recuperado pelo contexto: em “— O senhor vende?”, o objeto direto é a ave citada antes no diálogo (PAS-UEM 2024, 1ª etapa).</p></li></ul>
<h3 data-corrido="sim">Objeto indireto:</h3>
<p>complemento verbal com preposição;</p>
<ul><li><p><strong>Ex:</strong> Preciso de bons conselhos (núcleo).</p></li></ul>
<h3 data-corrido="sim">Agente da passiva:</h3>
<p>sujeito da voz ativa na voz passiva analítica;</p>
<ul><li><p><strong>Ex:</strong> A apresentação foi realizada pela professora de filosofia;</p></li>
<li><p><strong>Obs:</strong> voz ativa, passiva e reflexiva em [[Vozes Verbais]].</p></li></ul>
<h3 data-corrido="sim">Predicativo do sujeito:</h3>
<p>característica do sujeito;</p>
<ul><li><p><strong>Ex:</strong> Elas são lindas.</p></li></ul>
<h3 data-corrido="sim">Predicativo do objeto:</h3>
<p>característica do objeto;</p>
<ul><li><p><strong>Ex:</strong> Eu acho as minhas filhas (O.D.) lindas.</p></li></ul>
<h2>Termos acessórios da oração</h2>
<h3 data-corrido="sim">Adjunto adnominal:</h3>
<p>qualifica ou especifica um nome, geralmente um substantivo;</p>
<ul><li><p><strong>Composto por:</strong> adjetivos, locuções adjetivas, artigos, pronomes e numerais;</p></li>
<li><p><strong>Ex:</strong> A sábia idosa sempre dava conselhos excelentes.</p></li></ul>
<h3 data-corrido="sim">Adjunto adverbial:</h3>
<p>indica circunstâncias relacionadas a verbos, adjetivos ou outros advérbios;</p>
<ul><li><p><strong>Ex:</strong> Como rápido; Como muito bem; Como muito;</p></li>
<li><p><strong>Obs:</strong> as circunstâncias, com os advérbios e as locuções de cada uma, em [[Advérbios e Adjuntos Adverbiais]].</p></li></ul>
<h3 data-corrido="sim">Aposto:</h3>
<p>explica ou especifica outro termo da oração;</p>
<ul><li><p><strong>Explicativo:</strong> oferece uma explicação sobre o termo anterior;</p>
<ul><li><p><strong>Ex:</strong> Machado de Assis, grande escritor brasileiro, fundou a Academia Brasileira de Letras;</p></li></ul></li>
<li><p><strong>Distributivo:</strong> retoma as explicações sobre os termos, contudo, de maneira separada na oração;</p>
<ul><li><p><strong>Ex:</strong> João e Maria vieram à festa; este trouxe o bolo, aquela, os doces;</p></li></ul></li>
<li><p><strong>Enumerativo:</strong> enumera as explicações sobre o termo;</p>
<ul><li><p><strong>Ex:</strong> Comprei vários itens: arroz, feijão, macarrão e óleo;</p></li></ul></li>
<li><p><strong>Resumidor/recapitulativo:</strong> resume os termos anteriores do enunciado;</p>
<ul><li><p><strong>Ex:</strong> Cansaço, fome, calor, tudo contribuía para o mau humor;</p></li></ul></li>
<li><p><strong>Específico:</strong> especifica um termo da oração;</p>
<ul><li><p><strong>Ex:</strong> O escritor Machado de Assis é muito estudado nas escolas.</p></li></ul></li></ul>
<h3 data-corrido="sim">Vocativo:</h3>
<p>termo usado para chamar ou interpelar alguém, um animal ou uma coisa;</p>
<ul><li><p><strong>Ex:</strong> Professora, queremos saber as notas;</p></li>
<li><p><strong>Obs:</strong> em “Sabe do que eu tenho medo, vó?”, “vó” tem função essencial para a interação verbal, mas acessória do ponto de vista sintático, no âmbito da oração (PAS-UEM 2024, 1ª etapa);</p></li>
<li><p><strong>Obs:</strong> o uso frequente de vocativos marca a função apelativa ou conativa, em [[Funções da linguagem]].</p></li></ul>
<table><tbody><tr><td><p><strong>Pegadinhas:</strong></p>
<ul><li><p>O sujeito não é necessariamente o ser que realiza a ação verbal: em “Cachorro faz muita falta.”, “Cachorro” é o sujeito, mas não realiza ação (PAS-UEM 2019, 1ª etapa);</p></li>
<li><p>O termo antes do verbo nem sempre é o sujeito: em “— O melro eu não vendo.”, “O melro” não é o sujeito de “vendo” (PAS-UEM 2024, 1ª etapa);</p></li>
<li><p>O termo depois do verbo nem sempre é o objeto direto: em “diz a professora”, “a professora” não é objeto direto de “diz” (PAS-UEM 2019, 1ª etapa);</p></li>
<li><p>Com o verbo haver no sentido de existir, a oração não tem sujeito: “convenções e liturgias”, em “há convenções e liturgias”, e “um ensaio”, em “Há um ensaio ali”, não são sujeito de “há” (PAS-UEM 2016 e 2018, 1ª etapa);</p></li>
<li><p>Termo preposicionado ligado ao verbo nem sempre o completa: “sem camisa”, em “entrar sem camisa”, não completa o sentido de “entrar”; e “de dentro d’água”, em “A irmãzinha o chama de dentro d’água.”, não é objeto indireto de “chama” (PAS-UEM 2016 e 2024, 1ª etapa).</p></li></ul></td></tr></tbody></table>
<aside class="questao" data-id="6b23a136-e646-4cc6-9c97-63fc9d25612a" data-gabarito="03"><p>(PAS-UEM 2024, 1ª etapa) As frases a seguir são do conto “Negócio de menino”, de Rubem Braga, um diálogo entre um menino e um adulto que vende passarinhos. Assinale o que for correto.</p><p>(01) Em “— Papai me disse que o senhor tem muito passarinho…” (linha 3), o sujeito sintático da forma verbal “disse” é “Papai”, que é interpretado como aquele que realiza a ação do verbo.</p><p>(02) Em “— O senhor vende?” (linha 15), o objeto direto está oculto e é interpretado como “uma coleirinha”, referido (no diálogo) na fala do adulto (linha 6).</p><p>(04) Em “— O melro eu não vendo.” (linha 37), a expressão “O melro” é o sujeito sintático da sentença, sobre o qual recai a ação do verbo “vendo”.</p><p>(08) Em “— O coleira o senhor também deixa por seis contos?” (linha 45), o sujeito sintático da sentença é “O coleira”, interpretado como aquele que realiza a ação verbal.</p><p>(16) Em “A irmãzinha o chama de dentro d’água.” (linhas 49 e 50), a expressão “de dentro d’água” é o objeto indireto de “chama”, interpretado como paciente da ação verbal.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta. “Papai” é de quem se fala e é quem pratica a ação de dizer;</p><p>(02) Correta. “Vender” pede complemento sem preposição; o objeto direto não aparece na pergunta e é recuperado pelo contexto: a coleirinha da fala anterior do adulto;</p><p>(04) Incorreta. O sujeito de “vendo” é “eu”; “O melro” é o objeto direto, anteposto ao sujeito;</p><p>(08) Incorreta. O sujeito de “deixa” é “o senhor”; “O coleira” é o objeto direto, anteposto;</p><p>(16) Incorreta. “de dentro d’água” indica a circunstância de lugar (adjunto adverbial); o termo que completa “chama” é o pronome “o”;</p><p><strong>Soma: 01 + 02 = 03</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Sujeito:</h3>
<p>de quem ou do que se fala; não é necessariamente quem realiza a ação;</p>
<h3 data-corrido="sim">Predicado verbo-nominal:</h3>
<p>dois núcleos: verbo de ação + predicativo (do sujeito ou do objeto);</p>
<h3 data-corrido="sim">Complemento nominal:</h3>
<p>termo preposicionado que completa um substantivo abstrato, um adjetivo ou um advérbio;</p>
<h3 data-corrido="sim">Objeto direto e objeto indireto:</h3>
<p>complementos verbais sem preposição e com preposição, respectivamente;</p>
<h3 data-corrido="sim">Agente da passiva:</h3>
<p>sujeito da voz ativa na voz passiva analítica;</p>
<h3 data-corrido="sim">Predicativo do objeto:</h3>
<p>característica do objeto (“acho as minhas filhas lindas”);</p>
<h3 data-corrido="sim">Aposto resumidor/recapitulativo:</h3>
<p>resume os termos anteriores (“Cansaço, fome, calor, tudo...”);</p>
<h3 data-corrido="sim">Vocativo:</h3>
<p>termo que chama ou interpela; acessório do ponto de vista sintático.</p>'
)
on conflict (slug) do nothing;

-- 2. Trava: grifo ou resposta nos antigos não tem destino.
do $$
begin
  if exists (select 1 from grifos g join resumos r on r.id = g.resumo_id
              where r.slug in ('sujeito', 'predicado'))
     or exists (select 1 from respostas x join resumos r on r.id = x.resumo_id
                 where r.slug in ('sujeito', 'predicado')) then
    raise exception 'grifos ou respostas em sujeito/predicado: decidir antes de apagar';
  end if;
end $$;

-- 3. Redirecionar cada referência para o resumo novo.
with novo as (select id from resumos where slug = 'funcoes-sintaticas'),
     velhos as (select id from resumos where slug in ('sujeito', 'predicado'))
update resumos set pai_id = (select id from novo)
 where pai_id in (select id from velhos);

with novo as (select id from resumos where slug = 'funcoes-sintaticas'),
     velhos as (select id from resumos where slug in ('sujeito', 'predicado'))
update edital_topicos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

with novo as (select id from resumos where slug = 'funcoes-sintaticas'),
     velhos as (select id from resumos where slug in ('sujeito', 'predicado'))
update eventos set resumo_id = (select id from novo)
 where resumo_id in (select id from velhos);

-- Histórico e favorito do aluno: uma linha por aluno no resumo novo, com a
-- visita mais recente e a estrela se ele tinha estrela em qualquer dos dois.
insert into leituras (user_id, resumo_id, visto_em, favorito, favoritado_em)
select l.user_id,
       (select id from resumos where slug = 'funcoes-sintaticas'),
       max(l.visto_em), bool_or(l.favorito), max(l.favoritado_em)
  from leituras l
  join resumos r on r.id = l.resumo_id
 where r.slug in ('sujeito', 'predicado')
 group by l.user_id
on conflict (user_id, resumo_id) do update
   set visto_em = greatest(leituras.visto_em, excluded.visto_em),
       favorito = leituras.favorito or excluded.favorito,
       favoritado_em = coalesce(leituras.favoritado_em, excluded.favoritado_em);

-- Wikilinks no corpo de outros resumos, com ou sem rótulo. O trigger
-- `sync_conexoes_resumo` refaz as conexões desses resumos no próprio update.
update resumos
   set corpo = regexp_replace(corpo, '\[\[(Sujeito|Predicado)(\|[^\]]*)?\]\]',
                              '[[Funções sintáticas\2]]', 'g')
 where corpo ~ '\[\[(Sujeito|Predicado)(\|[^\]]*)?\]\]'
   and slug not in ('sujeito', 'predicado');

-- 4. Só então apagar os dois. `conexoes` e `leituras` restantes saem em cascata.
delete from resumos where slug in ('sujeito', 'predicado');

-- 5. Refaz as conexões do resumo novo com todos já no banco (decisão 9c).
update resumos set corpo = corpo where slug = 'funcoes-sintaticas';

-- 6. Edital: só o tópico coberto por inteiro.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 1
   and e.materia_slug = 'portugues'
   and e.texto = 'Funções sintáticas e produção do sentido.'
   and e.resumo_id is null
   and r.slug = 'funcoes-sintaticas';

-- Liga os tópicos do edital aos resumos de História que acabaram de entrar.
--
-- `edital_topicos.resumo_id` é o vínculo do quarto eixo (decisão 9i): diz qual
-- resumo cobre aquele item cobrado. Ele é DERIVADO — sai do casamento entre o
-- título do resumo e o texto do tópico —, e por isso vinha sendo refeito à mão
-- depois de cada leva, fora de migration nenhuma.
--
-- **Isso era um buraco de reprodutibilidade:** um banco reconstruído a partir
-- das migrations vinha com o `/edital` sem cobertura nenhuma, e nada no
-- repositório dizia que faltava esse passo. Da Química à Sociologia, cinco
-- levas passaram assim. Esta fecha o buraco para a História; as anteriores
-- continuam por refazer, e isso está anotado no vault.
--
-- ## O casamento por frase erra, e este é o exemplo
--
-- A regra usa fronteira de palavra (`\m`/`\M`) para título de uma palavra só e
-- `like` para os de duas ou mais — foi o que impediu "Dinâmica" de casar dentro
-- de "termodinâmica". Mesmo assim ela errou aqui, e vale guardar o caso:
--
--   "Os Estados Unidos: formação socioeconômica, EXPANSÃO TERRITORIAL,
--    guerra civil e industrialização."
--
-- casou com o resumo `Expansão territorial` — que no site é sobre
-- bandeirantismo, drogas do sertão e ouro em Minas, ou seja, a expansão do
-- BRASIL. A frase bate; o assunto não. Quem cobre esse tópico é
-- `Estados Unidos no séc. XIX`, e é para lá que ele aponta abaixo.
--
-- A lição é a mesma da conferência de figuras da Química: **casar texto não é
-- casar conteúdo**. Ligação errada no `/edital` é pior que ligação nenhuma,
-- porque o aluno clica achando que vai achar a matéria da prova.

update edital_topicos e
   set resumo_id = c.rid
  from (
    select e2.id as eid, r.id as rid,
           row_number() over (partition by e2.id order by length(r.titulo) desc) as n
      from edital_topicos e2
      join resumos r
        on r.materia_slug = e2.materia_slug
       and r.materia_slug = 'historia'
       and ( (position(' ' in r.titulo) = 0
                and lower(e2.texto) ~ ('\m' || lower(r.titulo) || '\M'))
          or (position(' ' in r.titulo) > 0
                and lower(e2.texto) like '%' || lower(r.titulo) || '%') )
     where e2.resumo_id is null
  ) c
 where c.eid = e.id and c.n = 1;

-- A correção do caso acima. Vem DEPOIS, e não como exceção dentro da regra, para
-- o defeito continuar visível a quem ler.
update edital_topicos
   set resumo_id = (select id from resumos where titulo = 'Estados Unidos no séc. XIX')
 where texto like 'Os Estados Unidos: formação socioeconômica%';

-- Candidatas a `[[wikilink]]`: onde o título de um resumo é citado no corpo de
-- outro, sem que a ligação exista.
--
-- Uso: rode no SQL Editor do Supabase (ou pelo MCP). Ela NÃO escreve nada.
--
-- ## Por que este arquivo existe
--
-- O grafo de `/mapa` se chama "Mapa de conexões" e tinha UMA aresta em todo o
-- acervo (Função do 2º grau → Função do 1º grau). Nenhuma migration de
-- importação escreveu wikilink — todas dizem isso no cabeçalho —, então as duas
-- visões do mapa desenhavam a mesma coisa: a hierarquia do `pai_id`.
--
-- Esta consulta acha o que JÁ está escrito no texto e ainda não virou ligação.
-- Ela é o passo de leitura; marcar as menções aprovadas com `[[ ]]` é uma
-- migration à parte, e o trigger `sync_conexoes_resumo` preenche `conexoes`
-- sozinho a partir do `corpo`.
--
-- ## O filtro é a parte que importa
--
-- A versão ingênua (`corpo ilike '%' || titulo || '%'`) devolve 148 pares e é
-- lixo: casa "Célula" dentro de "Células", casa o título dentro do `alt=` de uma
-- figura, e casa a palavra comum que dá nome a um resumo ("Equilíbrio",
-- "Substâncias", "Fatores") em qualquer frase que a use no sentido corriqueiro.
--
-- O que este filtro tira, e por quê:
--
-- 1. `<figure>…</figure>` inteiro — o `alt` descreve a imagem, não é texto lido.
-- 2. `<h2|h3|h4>` — título já é nó do mapa (decisão 12); marcá-lo de novo
--    desenharia a mesma relação duas vezes, que é o que a decisão 9c recusa.
-- 3. `[[…]]` que já existe — senão a ligação feita à mão vira candidata.
-- 4. O resto das tags, para não casar dentro de `data-latex`, `src` ou `style`.
-- 5. `\m…\M` (fronteira de palavra do Postgres) no lugar de `%…%`.
-- 6. Título com menos de 5 caracteres.
-- 7. **Par pai↔filho**, e este é o filtro que a decisão 9c exige em letra: "o
--    pai não linka os filhos em `[[…]]` — conter e citar são os dois eixos da
--    decisão 9, e linkar quem já está pendurado desenharia a mesma relação duas
--    vezes". Sem ele, treze pares passavam, quase todos de um resumo-pai de
--    edital listando os próprios filhos (o de Física cita Calor latente e as
--    três dilatações; o de Português, quatro tópicos de uma vez).
--
-- Sobram 67 pares. A coluna `multipalavra` separa os dois graus de confiança:
-- título de várias palavras ("Medidas de tendência central") praticamente não
-- aparece por acaso; título de uma palavra só precisa de olho humano, e é por
-- isso que a saída traz o `contexto` — a frase em volta da menção.
--
-- **Nada aqui decide sozinho.** O autor aprova par a par antes de qualquer
-- escrita: marcar uma menção muda o `corpo` de um resumo publicado, e no texto
-- lido ela vira um link em negrito sublinhado.

with limpo as (
  select
    id, slug, titulo, materia_slug, pai_id,
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(corpo, '<figure[^>]*>.*?</figure>', ' ', 'gs'),
          '<h[234][^>]*>.*?</h[234]>', ' ', 'gs'),
        '\[\[.+?\]\]', ' ', 'g'),
      '<[^>]*>', ' ', 'g') as texto
  from resumos
),
pares as (
  select
    a.slug  as origem,
    a.materia_slug as materia_origem,
    b.titulo as alvo,
    b.slug  as destino,
    b.materia_slug as materia_destino,
    (b.titulo ~ '\s') as multipalavra,
    (a.materia_slug = b.materia_slug) as mesma_materia,
    substring(
      a.texto from '(?i).{0,45}\m'
        || regexp_replace(b.titulo, '([.*+?^${}()|\[\]\\])', '\\\1', 'g')
        || '\M.{0,35}'
    ) as contexto
  from limpo a
  join resumos b
    on a.id <> b.id
   and length(b.titulo) >= 5
   -- `coalesce` porque `pai_id` é nulo na maioria das linhas, e `NULL = x` não
   -- é falso: é NULL, que o `not` engole junto com a linha inteira
   and not coalesce(b.pai_id = a.id, false)
   and not coalesce(a.pai_id = b.id, false)
   and a.texto ~* ('\m' || regexp_replace(b.titulo, '([.*+?^${}()|\[\]\\])', '\\\1', 'g') || '\M')
)
select
  case when multipalavra then 'alta' else 'revisar' end as confianca,
  alvo, origem, materia_origem, materia_destino, mesma_materia, contexto
from pares
order by multipalavra desc, alvo, origem;

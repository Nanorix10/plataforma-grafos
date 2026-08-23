-- Cria o processo `comum` — o conteúdo que todo plano abre — e move a
-- Estatística para lá.
--
-- ## O problema que isto resolve
--
-- `resumos.processo_slug` é escalar: um resumo pertence a UM processo seletivo.
-- Isso serviu enquanto o acervo era só a 1ª etapa do PAS UEM, e quebra agora
-- que a 2ª etapa do PASSE entra: os dois editais pedem Medidas de tendência
-- central e Medidas de dispersão, e os dois documentos do autor trazem o MESMO
-- texto, palavra por palavra e fórmula por fórmula (conferido comparando o
-- `corpo` no banco com o `.docx` do PASSE).
--
-- As saídas sem esta migration eram duas, e as duas ruins:
--
-- - deixar como está, e o aluno do PASSE não vê um conteúdo que cai na prova
--   dele, mesmo tendo pago;
-- - inserir de novo com outro slug, e passam a existir dois resumos com o
--   MESMO título. O trigger `sync_conexoes_resumo` resolve `[[wikilink]]`
--   procurando `where titulo = ...`, então o destino de todo link para
--   "Medidas de dispersão" passaria a ser indeterminado — e em silêncio.
--
-- `comum` é um processo como os outros para o banco (mesma FK, mesma coluna),
-- e é o `lib/planos.ts` que o entrega a todos os planos à venda. `nenhum`
-- continua com a lista vazia: cadastro é aberto (decisão 1b), e pôr `comum`
-- ali daria acervo de graça a quem só criou conta.
--
-- É também onde vai morar o material das provas de escola (PR1G1, Simulado
-- Harmonia, Simulado Poliedro), que não é de vestibular nenhum e que o autor
-- quer liberado para todo mundo.
--
-- ## A segunda parte: devolver o x̄ que a importação de agosto perdeu
--
-- Não é melhoria, é fidelidade. No `.docx` a média aparece como `x` com barra
-- (`\overline{x}`, o OMML `m:bar`); a `20260821024027_importa_matematica_pas_uem`
-- entrou com um `x` pelado, e as chaves do conjunto `{7,9,5,3,4,8}` sumiram.
-- Num resumo de estatística essa barra É o conteúdo — `x` é um dado da amostra
-- e `x̄` é a média deles, e a fórmula do desvio médio subtrai justamente um do
-- outro. Sem ela a página afirma outra coisa que não a que o autor escreveu.
--
-- Um caso passou de fórmula a texto colado: "Ache a média aritméticaX." era
-- `\overline{X}` no documento, e ao virar letra solta grudou na palavra
-- anterior. Volta a ser fórmula, com o espaço no lugar.
--
-- Costura por `replace` ancorado, e não `corpo = '…'` inteiro: o diff mostra só
-- o que mudou, e nada passa por cima de um ajuste que o autor tenha feito no
-- editor nesse meio-tempo. O bloco `do $$` no fim recusa a migration se as
-- contas não baterem — `replace` que não acha a âncora não dá erro, só não faz
-- nada, e falha calada é o que não pode passar em conteúdo.

-- ============================================
-- 1. O processo
-- ============================================
insert into processos_seletivos (slug, nome)
values ('comum', 'Conteúdo comum')
on conflict (slug) do nothing;

-- ============================================
-- 2. A Estatística passa a valer para todo plano
-- ============================================
update resumos
   set processo_slug = 'comum'
 where slug in ('medidas-de-tendencia-central', 'medidas-de-dispersao');

-- ============================================
-- 3. O x̄ do desvio médio
-- ============================================
update resumos set corpo = replace(corpo,
  'data-latex="d=\frac{|x_1-x| + |x_2-x|+…+|x_n-x|}{n}"',
  'data-latex="d=\frac{|x_1-\overline{x}| + |x_2-\overline{x}|+…+|x_n-\overline{x}|}{n}"')
 where slug = 'medidas-de-dispersao';

update resumos set corpo = replace(corpo,
  '<p>Simplificando: Ache a média aritméticaX. Subtraia cada termo',
  '<p>Simplificando: Ache a média aritmética <span data-type="inline-math" data-latex="\overline{X}"></span>. Subtraia cada termo')
 where slug = 'medidas-de-dispersao';

update resumos set corpo = replace(corpo,
  'data-latex="x=\frac{7 + 9 + 5 + 3 + 4 + 8}{6}"',
  'data-latex="\overline{x}=\frac{7 + 9 + 5 + 3 + 4 + 8}{6}"')
 where slug = 'medidas-de-dispersao';

-- ============================================
-- 4. O x̄ da variância e do desvio-padrão
-- ============================================
update resumos set corpo = replace(corpo,
  'data-latex="Var=\frac{(x_1-x)^2 + (x_2-x)^2+ …+(x_n-x)^2}{n}"',
  'data-latex="Var=\frac{(x_1-\overline{x})^2 + (x_2-\overline{x})^2+ …+(x_n-\overline{x})^2}{n}"')
 where slug = 'medidas-de-dispersao';

update resumos set corpo = replace(corpo,
  '</span> → X = 6</p>',
  '</span> → <span data-type="inline-math" data-latex="\overline{X}"></span> = 6</p>')
 where slug = 'medidas-de-dispersao';

update resumos set corpo = replace(corpo,
  'data-latex="σ=\sqrt{\frac{(x_2- x)^2+(x_2-x)^2+…+(x_n-x)^2}{n}}"',
  'data-latex="σ=\sqrt{\frac{(x_2- \overline{x})^2+(x_2-\overline{x})^2+…+(x_n-\overline{x})^2}{n}}"')
 where slug = 'medidas-de-dispersao';

-- ============================================
-- 5. As chaves do conjunto da amostra
-- ============================================
-- Três ocorrências de "Amostra = {7,9,5,3,4,8}" e uma de "{3,4,5,7,8,9}".
-- O irmão `medidas-de-tendencia-central` já grava as chaves com `\{ \}`; aqui
-- elas tinham caído fora, e a amostra virava uma lista solta de números.
update resumos set corpo = replace(corpo,
  'data-latex="7,9,5,3,4,8"',
  'data-latex="\{7,9,5,3,4,8\}"')
 where slug = 'medidas-de-dispersao';

update resumos set corpo = replace(corpo,
  'data-latex="3,4,5,7,8,9"',
  'data-latex="\{3,4,5,7,8,9\}"')
 where slug = 'medidas-de-dispersao';

-- ============================================
-- 6. Guardas
-- ============================================
do $$
declare
  n_comum int;
  n_barra int;
  n_chaves int;
  corpo_disp text;
begin
  select count(*) into n_comum
    from resumos where processo_slug = 'comum';
  if n_comum <> 2 then
    raise exception 'esperava 2 resumos em comum, encontrei %', n_comum;
  end if;

  select corpo into corpo_disp
    from resumos where slug = 'medidas-de-dispersao';

  select count(*) into n_barra
    from regexp_matches(corpo_disp, '\\overline', 'g');
  if n_barra <> 12 then
    raise exception 'esperava 12 x-barra em medidas-de-dispersao, encontrei %', n_barra;
  end if;

  select count(*) into n_chaves
    from regexp_matches(corpo_disp, 'data-latex="\\\{', 'g');
  if n_chaves <> 4 then
    raise exception 'esperava 4 conjuntos com chave, encontrei %', n_chaves;
  end if;

  if corpo_disp like '%aritméticaX%' then
    raise exception 'o "aritméticaX" grudado continua lá';
  end if;
end $$;

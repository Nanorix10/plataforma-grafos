-- Devolve três espaços que a MINHA extração comeu na Geografia.
--
-- Não é deslize do autor, é defeito da ferramenta com que eu li o `.docx`, e a
-- migration anterior ainda por cima creditou dois deles a ele na seção "o que
-- eu NÃO consertei". Fica registrado nos dois lugares.
--
-- ## O defeito
--
-- No `.docx` uma frase costuma vir partida em vários `<w:r>`, e quando o autor
-- sublinha só um pedaço o espaço entre as palavras pode acabar num run marcado
-- sozinho — `a` + `<u> </u>` + `qualidade`. O meu extrator juntava marcas
-- vizinhas com uma expressão regular que apagava o miolo em vez de preservá-lo,
-- então esse espaço solto desaparecia e as palavras colavam.
--
-- Os três casos, e o que cada um deveria ser:
--
-- - Toyotismo: "aqualidade" → "a qualidade";
-- - Toyotismo: "Just in Time- carros" → "Just in Time - carros";
-- - Taylorismo: "linhademontagem" → "linha de montagem".
--
-- ## Por que só três, e por que só a Geografia
--
-- Varri os quatro documentos já importados hoje com o extrator consertado e
-- comparei o texto limpo linha a linha com o que tinha sido usado em cada
-- migration:
--
-- - **PAS UEM 2ª etapa**: nenhuma diferença;
-- - **Literatura**: nenhuma diferença;
-- - **Geografia**: estes três;
-- - **PASSE 2ª etapa**: sete linhas, e **nenhuma chegou ao banco**. Ali o espaço
--   perdido ficava sempre logo depois de um `:` que vira o fim de um título
--   corrido — "Conceito de Antigo Regime:sistema político…" —, e como o título
--   e a explicação viram elementos separados (`<h2>` e `<p>`), o espaço não
--   existiria no HTML de qualquer jeito. Conferido no banco, um por um.
--
-- O marcador `\x01` do Word (objeto embutido) também não entrou em resumo
-- nenhum: `select count(*) from resumos where corpo like '%' || chr(1) || '%'`
-- devolve zero.
--
-- Costura por `replace` ancorado, com guarda no fim: `replace` que não acha a
-- âncora não dá erro, só não faz nada.

update resumos set corpo = replace(corpo,
  'Tinham como objetivo: <strong>aqualidade</strong>;',
  'Tinham como objetivo: <strong>a qualidade</strong>;')
 where slug = 'toyotismo';

update resumos set corpo = replace(corpo,
  'customização - Just in Time- carros sob demanda;',
  'customização - Just in Time - carros sob demanda;')
 where slug = 'toyotismo';

update resumos set corpo = replace(corpo,
  'Estabelece o uso da <strong>linhademontagem.</strong>',
  'Estabelece o uso da <strong>linha de montagem.</strong>')
 where slug = 'taylorismo';

do $$
declare n int;
begin
  select count(*) into n
    from resumos
   where corpo like '%aqualidade%'
      or corpo like '%linhademontagem%'
      or corpo like '%Just in Time- carros%';
  if n <> 0 then
    raise exception 'ainda restam % resumos com as palavras coladas', n;
  end if;

  select count(*) into n
    from resumos
   where slug in ('toyotismo', 'taylorismo')
     and (corpo like '%a qualidade%' or corpo like '%linha de montagem%');
  if n <> 2 then
    raise exception 'esperava os dois resumos consertados, encontrei %', n;
  end if;
end $$;

-- Devolve à Biologia as quinze figuras que a exportação em texto tinha perdido.
--
-- A `20260821005035_importa_biologia_pas_uem` entrou a partir do texto exportado
-- do Google Docs, e ali imagem não existe: onde o documento desenha, o texto
-- deixava um marcador de lista vazio. Agora o mesmo documento veio em `.docx`,
-- que carrega as imagens de verdade, e elas voltam para o lugar exato em que o
-- autor as pôs.
--
-- Uma delas não era só ilustração: "Níveis de organização" tinha SÓ a imagem, e
-- por isso o tópico inteiro tinha ficado de fora. Ele volta aqui, com o esquema.
--
-- ## Por que as imagens moram no repositório, e não no bucket
--
-- O editor manda o que o autor sobe para o bucket `imagens` do Supabase, cuja
-- policy de INSERT exige uma sessão de admin autenticada — que uma migration
-- não tem. Estas quinze entram como arquivo estático em `public/img/resumos/
-- biologia/`, servido pela própria Vercel.
--
-- Não é só contorno: imagem importada é conteúdo versionado junto com o texto
-- que a cita, some e volta com um `git revert`, e o `<img src>` não distingue
-- as duas origens. Se um dia valer a pena unificar, um script sobe estas para o
-- bucket e um `replace` troca os caminhos.
--
-- PNG virou WebP com qualidade 82: 7,5 MB no documento, 0,44 MB no repositório,
-- sem perda visível num diagrama de traço e cor chapada.
--
-- ## Costura por `replace`, e não corpo reescrito
--
-- Cada figura entra por um `replace` ancorado na frase que ela ilustra. O diff
-- mostra as quinze inserções e mais nada — um `corpo = '…'` inteiro obrigaria a
-- reler 10 mil caracteres para achar o que mudou, e passaria por cima de
-- qualquer ajuste que o autor tenha feito no editor nesse meio-tempo.
--
-- A largura sai do tamanho natural: acima da coluna de leitura (620px) a figura
-- ocupa 100%, abaixo dela fica no tamanho em que foi desenhada, para não subir
-- borrada.
--
-- O bloco `do $$` no fim recusa a migration se as quinze não estiverem lá: um
-- `replace` que não acha a âncora não dá erro, só não faz nada — falha calada é
-- exatamente o que não pode passar em conteúdo.

update resumos set corpo = replace(corpo,
  '<h2 data-corrido="sim">Metabolismo:</h2>',
  '<h2>Níveis de organização</h2><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/niveis-de-organizacao.webp" alt="Sequência dos níveis de organização: átomo, molécula, organela, célula, tecido, órgão, sistema e organismo." style="width:585px" data-largura="585px"></figure><h2 data-corrido="sim">Metabolismo:</h2>')
 where slug = 'caracteristicas-dos-seres-vivos';

update resumos set corpo = replace(corpo,
  '<h2 data-corrido="sim">Nutrição:</h2>',
  '<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/catabolismo-e-anabolismo.webp" alt="Uma molécula complexa se quebra em moléculas simples liberando energia, no catabolismo, e o caminho inverso, no anabolismo." style="width:100%" data-largura="100%"></figure><h2 data-corrido="sim">Nutrição:</h2>')
 where slug = 'caracteristicas-dos-seres-vivos';

update resumos set corpo = replace(corpo,
  '<li><p><strong>Ocorrência:</strong> células somáticas (do corpo, não gametas);</p>',
  '<li><p><strong>Ocorrência:</strong> células somáticas (do corpo, não gametas);</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/mitose.webp" alt="Célula com a carioteca ainda inteira, os cromossomos condensados dentro do núcleo e os dois centrossomos com as fibras do áster." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Desaparecimento da carioteca (membrana nuclear);</p>',
  '<li><p>Desaparecimento da carioteca (membrana nuclear);</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/mitose-profase.webp" alt="Célula com o fuso já formado entre os dois centrossomos e os cromossomos ao centro." style="width:392px" data-largura="392px"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Cromossomos posicionados na região mediana;</p>',
  '<li><p>Cromossomos posicionados na região mediana;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/mitose-metafase.webp" alt="Cromossomos alinhados na região mediana, presos às fibras que partem dos dois polos." style="width:581px" data-largura="581px"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Separação das cromátides irmãs;</p>',
  '<li><p>Separação das cromátides irmãs;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/mitose-anafase.webp" alt="Cromátides irmãs separadas, puxadas para os polos opostos, com a célula começando a se estrangular no meio." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Diacinese: terminalização dos quiasmas; os nucléolos desaparecem; a carioteca desintegra-se;</p></li></ul>',
  '<li><p>Diacinese: terminalização dos quiasmas; os nucléolos desaparecem; a carioteca desintegra-se;</p></li></ul><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-profase-1.webp" alt="As cinco subfases da prófase I lado a lado: leptóteno, zigóteno, paquíteno, diplóteno e diacinese." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Cromossomos homólogos pareados, um oposto ao outro, presos às fibras do fuso na placa equatorial da célula;</p>',
  '<li><p>Cromossomos homólogos pareados, um oposto ao outro, presos às fibras do fuso na placa equatorial da célula;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-metafase-1.webp" alt="Cromossomos homólogos pareados na placa equatorial, com as fibras do fuso indicadas." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Não ocorre divisão do centrômero!</p>',
  '<li><p>Não ocorre divisão do centrômero!</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-anafase-1.webp" alt="Detalhe da anáfase I: dois pares de homólogos unidos por quiasmas, com os cinetócoros presos às fibras do fuso." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-anafase-1-b.webp" alt="Separação dos cromossomos homólogos duplicados para os polos opostos." style="width:572px" data-largura="572px"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>No final da Telófase I os cromossomos se desespiralizam;</p>',
  '<li><p>No final da Telófase I os cromossomos se desespiralizam;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-telofase-1.webp" alt="Duas células filhas se formando, cada uma com um novo núcleo, e a divisão citoplasmática entre elas." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Desaparecimento da carioteca;</p>',
  '<li><p>Desaparecimento da carioteca;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-profase-2.webp" alt="As duas células com os cromossomos voltando a condensar." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Os cromossomos associam-se as fibras do fuso, alinhando-se no equador da célula;</p>',
  '<li><p>Os cromossomos associam-se as fibras do fuso, alinhando-se no equador da célula;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-metafase-2.webp" alt="Cromossomos não homólogos pareados lado a lado na placa equatorial das duas células." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>Os cromossomos simples são puxados para os polos da célula;</p>',
  '<li><p>Os cromossomos simples são puxados para os polos da célula;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-anafase-2.webp" alt="Separação das cromátides irmãs nas duas células." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

update resumos set corpo = replace(corpo,
  '<li><p>A carioteca e o nucléolo reaparecem e os cromossomos se descondensam;</p>',
  '<li><p>A carioteca e o nucléolo reaparecem e os cromossomos se descondensam;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/meiose-telofase-2.webp" alt="Quatro células haploides, cada uma com um novo núcleo, ao fim da divisão citoplasmática." style="width:100%" data-largura="100%"></figure>')
 where slug = 'ciclo-celular';

do $$
declare n int;
begin
  select count(*) into n from (
    select regexp_matches(corpo, '<figure', 'g') from resumos
     where slug in ('caracteristicas-dos-seres-vivos', 'ciclo-celular')
  ) x;
  if n <> 15 then
    raise exception 'esperava 15 figuras na Biologia, encontrei %', n;
  end if;
end $$;

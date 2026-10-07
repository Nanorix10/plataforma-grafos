-- Segundo resumo escrito no modelo de `docs/produto/modelo-de-resumo.md`:
-- Macromoléculas, rascunhado por Claude e revisado pelo autor. Aprovar o PR é
-- publicar (modelo, §6).
--
-- ## Por que este tópico
--
-- Lacuna em três tópicos de edital, conferida no banco em 07/10/2026 — nenhum
-- resumo trata de carboidratos, lipídeos, proteínas ou ácidos nucleicos:
--
-- - PASSE, 1ª etapa: `Macromoléculas biológicas e os avanços tecnológicos para
--   evolução da vida;`
-- - PASSE, 1ª etapa: `Associação e caracterização das estruturas moleculares
--   dos carboidratos, das proteínas, dos lipídios e das vitaminas, …`
-- - PAS UEM, 3ª etapa: `Noções gerais sobre carboidratos, lipídios e
--   proteínas.`
--
-- Está em mais de um edital: processo `comum` (decisão 1c).
--
-- **Matéria: Biologia**, embora os três tópicos de edital sejam de Química. O
-- cabeçalho escrito pelo autor no caderno (`BIOLOGIA A`) é a régua, como na
-- leva da Arte (`20260918120000`).
--
-- ## Fontes, e só elas
--
-- 1. **Caderno do autor**: `Resumos 2026/Resumos 1°bimestre 1°ano/Resumo para
--    Simulado Harmonia_ 2º dia.docx`, seção `BIOLOGIA A`, parágrafos
--    00003–00068 do extrator, com as oito figuras. A tabela de classificação
--    dos monossacarídeos era imagem e virou tabela, com as fórmulas em `\ce`.
-- 2. **Edital**: os três tópicos acima.
-- 3. **PAS-UEM 2024, etapa 2, questão 13** (gabarito 23), em
--    `Documents/UEM-Provas/pdfs/pas24/E2.pdf`, p. 7.
--
-- Nada além delas. Os nomes das bases nitrogenadas e dos componentes do
-- nucleotídeo vêm dos rótulos das figuras do caderno.
--
-- ## O que difere do caderno, e o que ele traz que merece conferência
--
-- - Normalização de forma: `Esteróides`/`Carotenóides` → `Esteroides`/
--   `Carotenoides` (Acordo Ortográfico); "é composto" → "é composta" (a
--   maioria dos hormônios); "Extraído da cana" → "Extraída" (a sacarose).
-- - **A quitina está sob "Nos animais", como no caderno**, e o próprio item
--   cita a parede celular de fungos. Segue o caderno; apontado no PR (9c:
--   mostrar e perguntar).
-- - Sem caixa de pegadinhas: nenhuma prova consultada tem item falso sobre o
--   que o caderno cobre (modelo, §4).
--
-- ## O edital ganha um tópico, não três
--
-- Casa só o do PAS UEM, que o resumo cobre por inteiro. Os dois do PASSE pedem
-- também "os avanços tecnológicos" e "as vitaminas", que nenhuma fonte traz;
-- marcá-los cobriria pela metade.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'macromoleculas',
  'Macromoléculas',
  'biologia',
  'comum',
  'Moléculas orgânicas grandes formadas pela repetição de monômeros: proteínas, lipídeos, carboidratos e ácidos nucleicos.',
  '<p>Moléculas orgânicas grandes e complexas, essenciais para a vida, formadas pela repetição de unidades menores (monômeros) e cruciais para a estrutura e a função celular;</p>
<ul><li><p><strong>Proteínas:</strong> monômeros aminoácidos;</p></li>
<li><p><strong>Lipídeos:</strong> monômeros ácidos graxos;</p></li>
<li><p><strong>Carboidratos:</strong> monômeros monossacarídeos;</p></li>
<li><p><strong>Ácidos nucleicos:</strong> monômeros nucleotídeos.</p></li></ul>
<h2 data-corrido="sim">Proteínas:</h2>
<p>macromoléculas formadas pelos monômeros <strong>aminoácidos</strong>;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/aminoacido.webp" alt="Aminoácido: carbono alfa ligado a um hidrogênio, à terminação amina, à terminação carboxila e à cadeia lateral R." style="width:40%" data-largura="40%"></figure>
<ul><li><p><strong>Funções:</strong></p>
<ul><li><p><strong>Estrutural:</strong> componente fundamental de inúmeras partes dos organismos vivos; principal função;</p></li>
<li><p><strong>Transporte:</strong> carregar substâncias para diferentes partes do corpo;</p></li>
<li><p><strong>Regulação:</strong> a maioria dos hormônios é composta de proteínas e aminoácidos (ver [[Sistema endócrino]]);</p></li>
<li><p><strong>Defesa:</strong> anticorpos;</p></li>
<li><p><strong>Reserva energética:</strong> fonte de energia para a manutenção das funções celulares;</p></li>
<li><p><strong>Catálise:</strong> atuam como catalisadores (<strong>enzimas</strong>);</p>
<ul><li><p>Substâncias capazes de alterar a velocidade de ocorrência de uma reação química, diminuindo a energia de ativação necessária para a reação acontecer.</p></li></ul></li></ul></li></ul>
<h2 data-corrido="sim">Lipídeos:</h2>
<p>moléculas orgânicas insolúveis em água e solúveis em certas substâncias orgânicas, tais como álcool, éter e acetona, compostas por carbono, oxigênio e hidrogênio;</p>
<ul><li><p><strong>Composto por:</strong> monômeros <strong>ácidos graxos</strong>, longas cadeias de carbono e hidrogênio com um grupo carboxila (–COOH);</p>
<ul><li><p><strong>Saturados:</strong> somente ligações simples entre seus átomos; por isso, apresentam-se no estado sólido;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/acido-graxo-saturado.webp" alt="Ácido palmítico, ácido graxo saturado: cadeia reta de carbonos só com ligações simples, terminada no grupo carboxila." style="width:100%" data-largura="100%"></figure></li>
<li><p><strong>Insaturados:</strong> uma ou mais ligações duplas entre seus átomos de carbono; por isso, apresentam-se no estado líquido;</p>
<ul><li><p><strong>Configuração cis:</strong> molécula com uma “dobra”;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/acido-graxo-insaturado-cis.webp" alt="Ácido oleico, ácido graxo insaturado cis: a ligação dupla dobra a cadeia de carbonos." style="width:100%" data-largura="100%"></figure></li>
<li><p><strong>Configuração trans:</strong> estrutura semelhante à linear dos ácidos graxos saturados.</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/acido-graxo-insaturado-trans.webp" alt="Ácido elaídico, ácido graxo insaturado trans: mesmo com a ligação dupla, a cadeia permanece reta." style="width:100%" data-largura="100%"></figure></li></ul></li></ul></li>
<li><p><strong>Classificação:</strong></p>
<ul><li><p><strong>Glicerídeos:</strong> gorduras e óleos;</p></li>
<li><p><strong>Cerídeos:</strong> ceras;</p></li>
<li><p><strong>Fosfolipídeos:</strong> membranas celulares (ver [[Membrana plasmática]]);</p></li>
<li><p><strong>Esteroides:</strong> hormônios;</p></li>
<li><p><strong>Carotenoides:</strong> pigmentos.</p></li></ul></li></ul>
<h2 data-corrido="sim">Carboidratos (glicídios, sacarídeos ou açúcares):</h2>
<p>compostos formados basicamente por carbono (C), hidrogênio (H) e oxigênio (O);</p>
<h3 data-corrido="sim">Monossacarídeos:</h3>
<p>representam a menor parte de um carboidrato (monômero); classificados conforme o número de carbonos na sua constituição;</p>
<table><tbody><tr><th><p><strong>Nome</strong></p></th><th><p><strong>Fórmula molecular</strong></p></th></tr><tr><td><p>Trioses</p></td><td><p><span data-type="inline-math" data-latex="\ce{C3H6O3}"></span></p></td></tr><tr><td><p>Tetroses</p></td><td><p><span data-type="inline-math" data-latex="\ce{C4H8O4}"></span></p></td></tr><tr><td><p>Pentoses</p></td><td><p><span data-type="inline-math" data-latex="\ce{C5H10O5}"></span></p></td></tr><tr><td><p>Hexoses</p></td><td><p><span data-type="inline-math" data-latex="\ce{C6H12O6}"></span></p></td></tr><tr><td><p>Heptoses</p></td><td><p><span data-type="inline-math" data-latex="\ce{C7H14O7}"></span></p></td></tr></tbody></table>
<ul><li><p><strong>Pentoses:</strong></p>
<ul><li><p><strong>Ribose</strong> (<span data-type="inline-math" data-latex="\ce{C5H10O5}"></span>): constituinte da molécula de RNA;</p></li>
<li><p><strong>Desoxirribose</strong> (<span data-type="inline-math" data-latex="\ce{C5H10O4}"></span>): constituinte da molécula de DNA;</p></li></ul></li>
<li><p><strong>Hexoses:</strong></p>
<ul><li><p><strong>Glicose</strong> (<span data-type="inline-math" data-latex="\ce{C6H12O6}"></span>): principal fonte de energia para o trabalho celular (ver [[Metabolismo energético]]); gerada por meio da fotossíntese realizada pelos vegetais;</p></li>
<li><p><strong>Galactose</strong> (<span data-type="inline-math" data-latex="\ce{C6H12O6}"></span>): fornecimento de energia para a célula;</p></li>
<li><p><strong>Frutose</strong> (<span data-type="inline-math" data-latex="\ce{C6H12O6}"></span>): fornecimento de energia para a célula.</p></li></ul></li></ul>
<h3 data-corrido="sim">Oligossacarídeos:</h3>
<p>formados pela combinação de dois ou mais monossacarídeos por meio de uma <strong>ligação glicosídica</strong>;</p>
<ul><li><p><strong>Sacarose</strong> (<span data-type="inline-math" data-latex="\ce{C12H22O11}"></span>): dissacarídeo resultante da união de uma glicose e uma frutose;</p>
<ul><li><p>Forma mais comum de transporte de carboidratos nos vegetais;</p></li>
<li><p>Extraída da cana-de-açúcar; usada para fazer o açúcar comum;</p></li></ul></li>
<li><p><strong>Lactose</strong> (<span data-type="inline-math" data-latex="\ce{C12H22O11}"></span>): dissacarídeo resultante da união de uma glicose e uma galactose; açúcar constituinte do leite;</p></li>
<li><p><strong>Maltose</strong> (<span data-type="inline-math" data-latex="\ce{C12H22O11}"></span>): dissacarídeo resultante da união de duas glicoses.</p></li></ul>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/dissacarideos-ligacao-glicosidica.webp" alt="Formação da maltose, da lactose e da sacarose: dois monossacarídeos se unem pela ligação glicosídica e liberam uma molécula de água (síntese); o sentido inverso é a hidrólise." style="width:100%" data-largura="100%"></figure>
<h3 data-corrido="sim">Polissacarídeos:</h3>
<p>extensas cadeias de monossacarídeos, principalmente glicoses, unidos entre si por ligações glicosídicas;</p>
<ul><li><p><strong>Nos vegetais:</strong></p>
<ul><li><p><strong>Amido:</strong> reserva energética;</p></li>
<li><p><strong>Celulose:</strong> compõe a parede celular das células vegetais; função estrutural;</p></li></ul></li>
<li><p><strong>Nos animais:</strong></p>
<ul><li><p><strong>Glicogênio:</strong> reserva energética;</p></li>
<li><p><strong>Quitina:</strong> compõe o exoesqueleto dos artrópodes e a parede celular de fungos; função estrutural.</p></li></ul></li></ul>
<h2 data-corrido="sim">Ácidos nucleicos:</h2>
<p>armazenam as informações genéticas dos seres vivos;</p>
<ul><li><p><strong>Composto por:</strong> monômeros <strong>nucleotídeos</strong> (grupo fosfato, pentose e base nitrogenada);</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/nucleotideo-dna.webp" alt="Nucleotídeo do DNA: grupo fosfato ligado ao carbono 5 da pentose e base nitrogenada ligada ao carbono 1." style="width:70%" data-largura="70%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/biologia/bases-nitrogenadas.webp" alt="Bases nitrogenadas: púricas, adenina e guanina; pirimídicas, citosina, timina e uracila." style="width:70%" data-largura="70%"></figure></li>
<li><p><strong>Ácido desoxirribonucleico (DNA):</strong></p>
<ul><li><p>Pentose: desoxirribose;</p></li>
<li><p>Base nitrogenada exclusiva: timina;</p></li></ul></li>
<li><p><strong>Ácido ribonucleico (RNA):</strong></p>
<ul><li><p>Pentose: ribose;</p></li>
<li><p>Base nitrogenada exclusiva: uracila.</p></li></ul></li></ul>
<aside class="questao" data-id="27d604b6-df5b-4633-a7fd-058aa8d20dd5" data-gabarito="23"><p>(PAS-UEM 2024, 2ª etapa) Um nutricionista solicitou ao seu paciente com sobrepeso que anotasse em uma tabela a quantidade de macronutrientes ingeridos diariamente durante uma semana. A tabela a seguir mostra essas quantidades em gramas. Sobre essa tabela, e assuntos correlatos, assinale o que for correto.</p><table><tbody><tr><th><p></p></th><th><p>Carboidratos (g)</p></th><th><p>Lipídios (g)</p></th><th><p>Proteínas (g)</p></th></tr><tr><td><p>Segunda-feira</p></td><td><p>250</p></td><td><p>90</p></td><td><p>60</p></td></tr><tr><td><p>Terça-feira</p></td><td><p>175</p></td><td><p>80</p></td><td><p>80</p></td></tr><tr><td><p>Quarta-feira</p></td><td><p>250</p></td><td><p>100</p></td><td><p>70</p></td></tr><tr><td><p>Quinta-feira</p></td><td><p>225</p></td><td><p>120</p></td><td><p>70</p></td></tr><tr><td><p>Sexta-feira</p></td><td><p>250</p></td><td><p>95</p></td><td><p>50</p></td></tr><tr><td><p>Sábado</p></td><td><p>270</p></td><td><p>115</p></td><td><p>90</p></td></tr><tr><td><p>Domingo</p></td><td><p>300</p></td><td><p>100</p></td><td><p>60</p></td></tr></tbody></table><p>(01) As gorduras se dispõem em volta dos órgãos ou na parte mais profunda da pele, onde formam uma camada protetora. Além de proteger contra impactos mecânicos, essa camada atua como isolante térmico, porque o calor tem dificuldade de atravessar a gordura.</p><p>(02) Os carboidratos podem ser classificados em monossacarídeos, dissacarídeos e polissacarídeos. Monossacarídeos ou açúcares simples são os carboidratos, que não são quebrados pela digestão. Os dissacarídeos são carboidratos formados pela união de duas moléculas de monossacarídeos. Os principais dissacarídeos são a sacarose, a lactose e a maltose.</p><p>(04) A média de lipídios ingeridos durante a semana foi de 100g.</p><p>(08) A moda de carboidratos ingeridos durante a semana foi de 240g.</p><p>(16) A mediana de proteínas ingeridas durante a semana foi de 70g.</p><p>Dê a soma dos itens corretos.</p><div class="resolucao"><p>(01) Correta, segundo o gabarito oficial: a camada de gordura protege contra impactos mecânicos e atua como isolante térmico;</p><p>(02) Correta. Monossacarídeos são a menor parte de um carboidrato; dissacarídeos resultam da união de dois monossacarídeos (sacarose, lactose e maltose);</p><p>(04) Correta. <span data-type="inline-math" data-latex="\frac{90+80+100+120+95+115+100}{7}=\frac{700}{7}=100\text{ g}"></span>;</p><p>(08) Incorreta. A moda é 250 g, valor que se repete três vezes;</p><p>(16) Correta. Em ordem: 50, 60, 60, 70, 70, 80, 90; o termo central é 70 g.</p><p><strong>Soma: 01 + 02 + 04 + 16 = 23</strong></p></div></aside>
<h2>Para revisar</h2>
<h3 data-corrido="sim">Macromoléculas:</h3>
<p>moléculas orgânicas formadas pela repetição de monômeros;</p>
<h3 data-corrido="sim">Proteínas:</h3>
<p>monômeros aminoácidos; principal função estrutural;</p>
<h3 data-corrido="sim">Enzimas:</h3>
<p>proteínas catalisadoras; diminuem a energia de ativação da reação;</p>
<h3 data-corrido="sim">Ácidos graxos saturados e insaturados:</h3>
<p>saturados, só ligações simples (sólidos); insaturados, ligações duplas (líquidos);</p>
<h3 data-corrido="sim">Monossacarídeos:</h3>
<p>monômeros dos carboidratos, classificados pelo número de carbonos;</p>
<h3 data-corrido="sim">Ligação glicosídica:</h3>
<p>união de monossacarídeos que forma oligossacarídeos e polissacarídeos;</p>
<h3 data-corrido="sim">Polissacarídeos de reserva e estruturais:</h3>
<p>reserva: amido e glicogênio; estruturais: celulose e quitina;</p>
<h3 data-corrido="sim">DNA e RNA:</h3>
<p>DNA, desoxirribose e timina; RNA, ribose e uracila.</p>'
) on conflict (slug) do nothing;

-- Casamento exato com o edital do PAS UEM. Os dois do PASSE ficam de fora
-- pelo motivo explicado no cabeçalho.
update edital_topicos e
   set resumo_id = r.id
  from resumos r
 where e.processo_slug = 'pas-uem'
   and e.etapa = 3
   and e.texto = 'Noções gerais sobre carboidratos, lipídios e proteínas.'
   and e.resumo_id is null
   and r.slug = 'macromoleculas';

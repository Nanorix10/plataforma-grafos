-- Importa o documento-mestre da Química, vindo de "Materias e conteúdos
-- feitos/Quimica.docx": as fórmulas, os gases, a estequiometria, as funções
-- inorgânicas (ácidos, bases, sais e óxidos) e as reações.
--
-- Vinte resumos e nove figuras. `processo_slug = 'comum'`, como as outras
-- matérias vindas dos documentos-mestre (decisão 1c). Todos na raiz.
--
-- É a sétima das oito matérias do recorte por disciplina. Sobram Física — que
-- exige a mesma conferência que esta exigiu — e Matemática, que tem treze
-- linhas.
--
-- ## Doze tópicos NÃO entraram, porque já estão no site
--
-- O documento tem trinta e dois tópicos de nível 0 e a Química já tinha quinze
-- resumos publicados, vindos da 1ª e da 2ª etapa do PAS UEM. Onze títulos
-- batem exatamente, e um décimo segundo entra por outro caminho:
--
-- - **Princípio de Avogadro**, **Ligação iônica**, **Ligação molecular
--   (covalente)**, **Dispersões**, **Concentração**, **Mudanças de estado
--   físico**, **Radioatividade**, **Decaimentos radioativos**, **Reações
--   nucleares** e **Forças de interação molecular** — conferidos um a um
--   contra o `corpo` publicado, e não contra a contagem de figuras. Estão
--   completos.
-- - **Estrutura da Tabela Periódica** tem no documento trinta e um caracteres
--   e duas imagens; no site, `tabela-periodica` tem 1.586 caracteres e nove.
--   Aqui é o documento que está pobre.
-- - **Propriedades Periódicas** é nível 0 no documento, mas o conteúdo já vive
--   dentro de `tabela-periodica`, como a seção homônima dele — as sete
--   propriedades, com as mesmas sete figuras, palavra por palavra. É o caso do
--   "Conceitos-Chave e Estruturas" da Biologia.
--
-- Quatro resumos publicados não têm tópico correspondente no documento-mestre
-- (Modelos atômicos, Processos de separação de misturas, Propriedades da
-- matéria e Substâncias). Ficam como estão.
--
-- Conferido título a título contra o banco antes de escrever, como a Língua
-- Portuguesa obrigou: os vinte títulos que entram não existem em resumo
-- nenhum do acervo, em matéria nenhuma.
--
-- ## A conferência das "figuras faltando"
--
-- Vale registrar porque a primeira leitura foi errada e quase virou trabalho à
-- toa. Contadas as âncoras `[IMG]` do documento contra as tags `<img>` do
-- banco, pareciam faltar dezenove figuras em cinco resumos publicados — dez
-- só na Radioatividade.
--
-- Não falta nenhuma. Quinze daquelas âncoras são **fórmulas** que o autor
-- colou como PNG de fundo branco (a partícula alfa, o decaimento do urânio-235,
-- a quebra do nêutron, as duas leis de Soddy-Fajans), e a importação da 1ª
-- etapa já as gravou como KaTeX — que é o certo pela decisão 8b, e o motivo de
-- elas não aparecerem como `<img>`. As outras quatro são tabelas de questão
-- que a 2ª etapa transcreveu como `<table>`.
--
-- A lição para a Física, que vem com 226 fórmulas: **comparar conteúdo, não
-- contagem de tags.**
--
-- ## O que muda de FORMA
--
-- Mesmo mapeamento das outras migrations, com a regra do sublinhado na versão
-- de três casos que a Filosofia fixou: grifo que cobre o item inteiro vira
-- texto puro, grifo que destaca um trecho dentro da frase vira `<strong>`, e o
-- `:` do começo do item continua marcando o termo sozinho.
--
-- ## Quatro "imagens" que eram tabela
--
-- Entram como `<table>`, pela razão que a Biologia já tinha registrado: print
-- de tabela não se seleciona, não rola no celular e tem fundo branco — no tema
-- escuro seria um retângulo aceso no meio do texto.
--
-- - o **balanço de reagente limitante e excesso** da amônia com ácido
--   sulfúrico, em Cálculo estequiométrico;
-- - as **proporções volumétricas** da água em Gay-Lussac, que no print são uma
--   equação com três linhas de volumes embaixo — a equação virou fórmula de
--   bloco e os volumes, tabela;
-- - o **NOx dos metais de valência múltipla**, em Nomenclatura das Bases;
-- - o **quadro comparativo das emissões radioativas** — ver abaixo.
--
-- As outras duas tabelas-print do documento (solubilidade do KNO3 e da
-- sacarose) já estão transcritas em `dispersoes` desde 23/08.
--
-- ## O quadro das emissões mudou de resumo
--
-- O "QUADRO COMPARATIVO DAS PRINCIPAIS EMISSÕES RADIOATIVAS" (alfa, beta e
-- gama, cruzados com representação, massa, velocidade, mudança no nº atômico,
-- mudança no nº de massa e poder de penetração) está ancorado no documento
-- dentro de **Semelhanças atômicas**, que fala de isóbaros, isótonos, isótopos
-- e isoeletrônicos e não menciona emissão nenhuma.
--
-- O quadro é o resumo da **Radioatividade**, e é para lá que ele vai — o único
-- `update` desta migration. É o que a Biologia fez com a figura da simbologia
-- dos heredogramas, e pela mesma razão: âncora errada no documento publicaria
-- a tabela debaixo do título errado.
--
-- Com isso, Semelhanças atômicas fica sem figura alguma. São quatro linhas, e
-- é o documento que não tem mais nada ali.
--
-- ## Três "imagens" que não eram nada
--
-- - `image52` é um **sinal de "+"** solto, que o Word recortou da equação da
--   fissão como se fosse figura. A equação já está inteira em
--   `reacoes-nucleares`, como KaTeX.
-- - `image58`, a última âncora do documento, é uma **foto de banco de imagens
--   de um par de óculos escuros**, com a marca-d água da agência por cima. Cai
--   depois de "Libera menos energia comparada à combustão completa" e não tem
--   relação nenhuma com o texto. Não entra, e **vale avisar o autor**.
-- - `image28` é o PNG de 1×1 que o Word deixa quando a imagem se perde, e
--   aparece sete vezes. Nenhuma delas era figura.
--
-- ## As nove figuras
--
-- 1,49 MB no documento, 114 KB no repositório em WebP q82.
--
-- As cinco geometrias moleculares entram a **42% da coluna**, e não a 100%: são
-- modelos de bola-e-vareta sem rótulo nenhum, um por geometria, e a 100% cinco
-- deles em sequência viram uma parede de esferas que empurra a tabela de
-- polaridade para fora da tela. É o que os bovinos da codominância fizeram na
-- Biologia — só que em porcentagem, como manda a decisão 11b, e não nos 320px
-- que aquela migration usou.
--
-- Elas têm **fundo preto**, ao contrário de todas as outras do acervo. No tema
-- claro isso aparece como um retângulo escuro; é como o autor as fez, e
-- recortar o fundo mudaria a figura.
--
-- As outras quatro (Lavoisier e Proust, o parafuso telúrico, os membros da
-- equação química e o triângulo do fogo) entram a 100%, como as demais.
--
-- ## O que eu NÃO consertei (decisão 9c)
--
-- - **"Formula molecular"** sem acento, e o **zero no lugar da letra O** em
--   "0=16" e dentro da fórmula molecular da glicose, em Fórmulas químicas.
-- - Um **"J" solto** antes de "180 g = 100%", no cálculo da fórmula percentual
--   da glicose. É tecla batida sem querer, como o "o" solto do ADH na Biologia.
-- - **"a suma das massas"**, por "a soma", na Lei de Lavoisier.
-- - **"Ex:"** sem exemplo nenhum depois, nos óxidos duplos.
-- - **"HCl (ácido cianídrico)"**, em Nomenclatura de Ácidos: o exemplo do
--   sufixo -ídrico está com o nome do HCN. O ácido clorídrico aparece certo na
--   questão resolvida do mesmo resumo, o que torna o deslize visível ao aluno.
--   **Vale avisar o autor.**
-- - **"Soluções não-eletrolítica"** e outros deslizes de concordância seguem
--   como estão nos tópicos que já foram publicados.
-- - O **"*"** da tabela de polaridade, na coluna Polaridade, não tem legenda
--   em lugar nenhum do documento.
--
-- Os nós de fórmula passaram pelo KaTeX antes de entrar. Os `%` foram
-- escapados como `\%` — sem a barra o KaTeX lê o `%` como início de comentário
-- e engole o resto da linha.
--
-- Não há `[[wikilink]]`. `on conflict (slug) do nothing` deixa rodar de novo
-- sem duplicar.

-- ============================================
-- 1. Fórmulas, gases e estequiometria
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'formulas-quimicas',
  'Fórmulas químicas',
  'quimica',
  'comum',
  'As três formas de representar uma substância pura — molecular, mínima e percentual — e a regra de três que dá a porcentagem de cada elemento.',
  '<p>existem 3 fórmulas que representam uma substância pura;</p>
<h2 data-corrido="sim">Fórmula molecular:</h2>
<p>mostra todos os átomos que formam o composto químico;</p>
<ul><li><p>Ex: água: <span data-type="inline-math" data-latex="H_2O"></span>; glicose: <span data-type="inline-math" data-latex="C_6H_{12}O_6"></span>, etc.</p></li></ul>
<h2 data-corrido="sim">Fórmula mínima:</h2>
<p>fórmula molecular simplificada;</p>
<ul><li><p>Ex: Formula molecular: <span data-type="inline-math" data-latex="C_6H_{12}0_6"></span>; <span data-type="inline-math" data-latex="C_7H_{14}"></span></p>
<ul><li><p>Fórmula mínima: <span data-type="inline-math" data-latex="CH_2O"></span>; <span data-type="inline-math" data-latex="CH_2"></span></p></li></ul></li></ul>
<h2 data-corrido="sim">Fórmula percentual:</h2>
<p>mostra o % de cada elemento em uma substância pura.</p>
<ul><li><p>Regra para cálculo:</p>
<ul><li><p>1º calcular a massa molar</p></li>
<li><p>2º fazer regra de 3 entre a massa total e a massa de cada elemento.</p></li></ul></li></ul>
<aside class="questao"><p>Ex: Fórmula percentual da glicose <span data-type="inline-math" data-latex="(C_6H_{12}O_6)"></span>;</p>
<div class="resolucao">
<p><span data-type="inline-math" data-latex="C=12, H=1, 0=16"></span></p>
<p><span data-type="inline-math" data-latex="6⋅12+ 12⋅1+6⋅16=180 g/mol"></span></p>
<p>% de carbono:</p>
<p><span data-type="inline-math" data-latex="180 g = 100\%"></span></p>
<p><span data-type="inline-math" data-latex="72 g (C)=x"></span></p>
<p><span data-type="inline-math" data-latex="x=\frac{7200}{180}⇒x=40\% de C"></span></p>
<p>% de hidrogênio:</p>
<p>J<span data-type="inline-math" data-latex="180 g= 100\%"></span></p>
<p><span data-type="inline-math" data-latex="12 g (H)=x"></span></p>
<p><span data-type="inline-math" data-latex="x=\frac{1200}{180}⇒x=6,7\% de H"></span></p>
<p>Assim temos: <span data-type="inline-math" data-latex="C_{40\%}, H_{6,7\%}, O_{53,3\%}"></span></p>
</div></aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'balanceamento-de-equacoes-quimicas',
  'Balanceamento de equações químicas',
  'quimica',
  'comum',
  'A ordem em que os elementos são acertados numa equação: metal, ametal, carbono, hidrogênio e oxigênio.',
  '<h2>Ordem de balanceamento</h2>
<ul><li><p>Metal</p></li>
<li><p>Ametal</p></li>
<li><p>Carbono</p></li>
<li><p>Hidrogênio</p></li>
<li><p>Oxigênio</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'geometria-das-moleculas',
  'Geometria das moléculas',
  'quimica',
  'comum',
  'As cinco formas que uma molécula assume conforme o número de átomos e a existência de pares livres no átomo central.',
  '<ul><li><p><strong>Linear</strong>, nas moléculas com 2 ou 3 átomos (sem pares livres);</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/geometria-linear.webp" alt="Modelo de bola-e-vareta de uma molécula linear: o átomo central, em vermelho, com dois átomos brancos presos em lados opostos, formando uma linha reta." style="width:42%" data-largura="42%"></figure></li>
<li><p><strong>Angular</strong>, nas moléculas com 3 átomos e pares livres;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/geometria-angular.webp" alt="Modelo de bola-e-vareta de uma molécula angular: o átomo central, em vermelho, com dois átomos brancos formando um V aberto para baixo." style="width:42%" data-largura="42%"></figure></li>
<li><p><strong>Trigonal</strong>, nas moléculas com 4 átomos, sem pares livres;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/geometria-trigonal.webp" alt="Modelo de bola-e-vareta de uma molécula trigonal plana: o átomo central, em vermelho, com três átomos brancos distribuídos ao redor no mesmo plano." style="width:42%" data-largura="42%"></figure></li>
<li><p><strong>Piramidal</strong>, nas moléculas com 4 átomos e pares livres;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/geometria-piramidal.webp" alt="Modelo de bola-e-vareta de uma molécula piramidal: o átomo central, em vermelho, com três átomos brancos abaixo dele, formando a base de uma pirâmide." style="width:42%" data-largura="42%"></figure></li>
<li><p><strong>Tetraédrica</strong>, nas moléculas com 5 átomos;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/geometria-tetraedrica.webp" alt="Modelo de bola-e-vareta de uma molécula tetraédrica: o átomo central, em vermelho, com quatro átomos brancos ao redor — um acima e três formando a base." style="width:42%" data-largura="42%"></figure></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'polaridade-das-moleculas',
  'Polaridade das moléculas',
  'quimica',
  'comum',
  'Quando uma molécula é polar: depende de com quem o átomo central se liga e da geometria que a ligação produz.',
  '<p>depende da polaridade das ligações e da geometria molecular.</p>
<ul><li><p>Ligações entre átomos iguais são ditas apolares.</p>
<ul><li><p>Moléculas em que os átomos em torno do átomo central são iguais.</p></li></ul></li>
<li><p>Ligações entre átomos diferentes são ditas polares.</p>
<ul><li><p>Moléculas com pares livres são sempre polares.</p></li></ul></li></ul>
<table><thead><tr><th>Núm. de átomos</th><th>Pares livres</th><th>Geometria</th><th>Polaridade</th></tr></thead>
<tbody>
<tr><td>2</td><td>----</td><td>Linear</td><td>*</td></tr>
<tr><td>3</td><td>Não</td><td>Linear</td><td>*</td></tr>
<tr><td></td><td>Sim</td><td>Angular</td><td>Polar</td></tr>
<tr><td>4</td><td>Não</td><td>Trigonal</td><td>*</td></tr>
<tr><td></td><td>Sim</td><td>Piramidal</td><td>Polar</td></tr>
<tr><td>5</td><td>Não</td><td>Tetraédrica</td><td>*</td></tr>
<tr><td></td><td>Sim</td><td>Gangorra</td><td>Polar</td></tr>
</tbody></table>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'calculo-estequiometrico',
  'Cálculo estequiométrico',
  'quimica',
  'comum',
  'Como acertar as contas de uma reação real: converter para mol, e depois descontar rendimento, pureza e o reagente que sobra.',
  '<ul><li><p>Identificar a pergunta e dados fornecidos.</p></li>
<li><p>Converter os n.º mols para as unidades do dado e da pergunta.</p></li></ul>
<p>1 mol = 6·10<sup>23</sup> moléc. = massa molar (g/mol) = 22,4 L (CNTP)</p>
<h2 data-corrido="sim">Rendimento de uma reação:</h2>
<p>compara a quantidade de produto esperada <span data-type="inline-math" data-latex="(100\%)"></span> com a quantidade real do produto obtido <span data-type="inline-math" data-latex="(x\%)"></span>.</p>
<ul><li><p><span data-type="inline-math" data-latex="[quantidade esperada=100\%]"></span></p></li>
<li><p><span data-type="inline-math" data-latex="[quantidade obtida=x\%]"></span></p></li></ul>
<h2 data-corrido="sim">Pureza dos reagentes:</h2>
<p>as impurezas não reagem, devem ser desconsideradas do cálculo. Trabalhar apenas com a massa pura da amostra.</p>
<ul><li><p><span data-type="inline-math" data-latex="massa inicial=100\%"></span></p></li>
<li><p><span data-type="inline-math" data-latex="massa pura= x"></span></p></li></ul>
<aside class="questao"><p>Ex:</p>
<div class="resolucao">
<p>200g de calcário —— 100%</p>
<p>180g de CaCO<sub>3</sub> —— x</p>
<p><span data-type="inline-math" data-latex="x = 180/2 = 90\%"></span></p>
</div></aside>
<h2 data-corrido="sim">Reagentes em excesso:</h2>
<p>é identificado dividindo-se as quantidade reagentes dadas no enunciado pelas quantidades estequiométricas. O maior quociente indicará o excesso.</p>
<h2 data-corrido="sim">Reagente limitante:</h2>
<p>quantidade que reage.</p>
<table><thead><tr><th>Proporção estequiométrica</th><th>2 NH<sub>3</sub>(g)</th><th>H<sub>2</sub>SO<sub>4</sub>(aq)</th><th>(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>(aq)</th></tr></thead>
<tbody>
<tr><td>Quantidade colocada na reação</td><td>2 mol</td><td>2 mol</td><td>—</td></tr>
<tr><td>Quantidade que reage/forma</td><td>2 mol</td><td>1 mol</td><td>1 mol</td></tr>
<tr><td>Quantidade em excesso</td><td>0</td><td>1 mol</td><td>—</td></tr>
<tr><td></td><td><strong>Limitante</strong></td><td><strong>Excesso</strong></td><td></td></tr>
</tbody></table>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'leis-ponderais',
  'Leis ponderais',
  'quimica',
  'comum',
  'As três leis que regem as massas numa reação: Lavoisier conserva, Proust fixa a proporção e Gay-Lussac vale para o volume dos gases.',
  '<p>princípios que descrevem as relações de massas entre as substâncias que participam de reações químicas.</p>
<h2 data-corrido="sim">Lei de Lavoisier (conservação das massas):</h2>
<p>em uma reação, a suma das massas dos produtos formulados deve ser igual a soma dos reagentes iniciais. <em>Na natureza, nada se cria e nada se perde, tudo se transforma.</em></p>
<ul><li><p><span data-type="inline-math" data-latex="M reagentes= M produtos"></span></p></li>
<li><p>A Lei de Lavoisier será melhor observada quando a reação é feita em sistema fechado. Isso impede escape de gás para atmosfera ou entrada de ar no sistema.</p></li></ul>
<h2 data-corrido="sim">Lei das proporções fixas/constantes (Proust):</h2>
<p>em uma reação, os reagentes sempre reagem em uma proporção fixa e constante, formando sempre o mesmo produto.</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/lavoisier-e-proust.webp" alt="Hidrogênio mais oxigênio formando água, em duas linhas: 2g mais 16g dão 18g, e 4g mais 32g dão 36g. A conservação da massa total é a Lei de Lavoisier; a proporção fixa entre os reagentes, que dobra junto, é a Lei de Proust." style="width:100%" data-largura="100%"></figure>
<h2 data-corrido="sim">Lei volumétrica de Gay-Lussac:</h2>
<p>em uma reação envolvendo gases, a proporção em mols sempre equivale à proporção, em litros, dos volumes (proporções fixa em volume).</p>
<div data-type="block-math" data-latex="H_2O(v) \rightarrow H_2(g) + \frac{1}{2} O_2(g)"></div>
<table><thead><tr><th>H<sub>2</sub>O(v)</th><th>H<sub>2</sub>(g)</th><th>O<sub>2</sub>(g)</th></tr></thead>
<tbody>
<tr><td>1 L</td><td>1 L</td><td>0,5 L</td></tr>
<tr><td>1,5 L</td><td>1,5 L</td><td>0,75 L</td></tr>
<tr><td>2 L</td><td>2 L</td><td>1 L</td></tr>
</tbody></table>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'equacao-geral-dos-gases',
  'Equação geral dos gases',
  'quimica',
  'comum',
  'A equação que junta as três leis gasosas numa só, relacionando o estado inicial e o final de um gás.',
  '<p>reúne as 3 leis gasosas em uma única equação matemática;</p>
<div data-type="block-math" data-latex="\frac{P_O⋅V_O}{T_O}=\frac{P_I⋅V_I}{T_I}"></div>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'equacao-de-clapeyron',
  'Equação de Clapeyron',
  'quimica',
  'comum',
  'A equação dos gases ideais, símbolo por símbolo — inclusive qual valor de R usar conforme a unidade da pressão.',
  '<p>relaciona P, V e T com a quantidade de gás no recipiente (em mols ou em gramas);</p>
<div data-type="block-math" data-latex="P⋅V=n⋅R⋅T"></div>
<ul><li><p><span data-type="inline-math" data-latex="P"></span><strong>:</strong> pressão do gás em atm ou mmHg;</p></li>
<li><p><span data-type="inline-math" data-latex="V"></span><strong>:</strong> volume do gás em litros;</p></li>
<li><p><span data-type="inline-math" data-latex="n"></span><strong>:</strong> número de mols do gás;</p>
<ul><li><p><span data-type="inline-math" data-latex="n=\frac{\text{massa do gás (m)}}{\text{massa molar do gás (MM)}}"></span></p></li>
<li><p><span data-type="inline-math" data-latex="P⋅V=\frac{m}{MM}⋅R⋅T"></span></p></li></ul></li>
<li><p><span data-type="inline-math" data-latex="R"></span><strong>:</strong> constante universal dos gases;</p>
<ul><li><p>Utiliza-se <span data-type="inline-math" data-latex="R=0,082"></span> quando a pressão está em atm.</p></li>
<li><p>Utiliza-se <span data-type="inline-math" data-latex="R=62,3"></span> quando a pressão (<span data-type="inline-math" data-latex="P"></span>) está em mmHg.</p></li></ul></li>
<li><p><span data-type="inline-math" data-latex="T"></span><strong>:</strong> temperatura Kelvin</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'misturas-gasosas',
  'Misturas gasosas',
  'quimica',
  'comum',
  'Numa mistura, cada gás age como se estivesse sozinho: é o que as leis de Dalton e de Amagat formalizam para a pressão e para o volume.',
  '<ul><li><p>Em uma mistura de gases, cada gás se comporta como se estivesse sozinho no recipiente.</p></li>
<li><p>Não ocorre reação entre os gases.</p></li></ul>
<h2>Lei de Dalton das pressões parciais</h2>
<ul><li><p>Em uma mistura gasosa, a pressão total do sistema é obtida pela soma das pressões de cada gás.</p></li>
<li><p><span data-type="inline-math" data-latex="P_{total}=P_A+P_B+P_C+..."></span></p></li>
<li><p><span data-type="inline-math" data-latex="P_{total}⋅V=n_{total}⋅R⋅T"></span></p></li></ul>
<h2>Lei de Amagat dos volumes parciais</h2>
<ul><li><p>Em uma mistura gasosa, o volume total do sistema é obtido da soma dos volumes parciais de cada gás.</p></li>
<li><p><span data-type="inline-math" data-latex="P⋅V_{total}=n_{total}⋅R⋅T"></span></p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'semelhancas-atomicas',
  'Semelhanças atômicas',
  'quimica',
  'comum',
  'Os quatro "isos": o que dois átomos têm em comum quando são isóbaros, isótonos, isótopos ou isoeletrônicos.',
  '<ul><li><p><strong>Isóbaros</strong>: mesmo número de massa (A);</p></li>
<li><p><strong>Isótonos</strong>: mesmo número de nêutrons (n);</p></li>
<li><p><strong>Isótopos</strong>: mesmo número de prótons (p);</p></li>
<li><p><strong>Isoeletrônicos</strong>: mesmo número de elétrons (e);</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'parafuso-telurico',
  'Parafuso telúrico',
  'quimica',
  'comum',
  'A primeira tentativa de ordenar os elementos por massa atômica, enrolada num cilindro — o avô da tabela periódica.',
  '<p>arranjo dos elementos químicos <strong>pelas suas massas atômicas</strong>, em formato de espiral.</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/parafuso-telurico.webp" alt="O parafuso telúrico em duas vistas: à esquerda, o cilindro com os elementos dispostos em espiral ao longo do eixo da massa atômica; à direita, o mesmo cilindro desenrolado num plano, com a linha diagonal ligando os elementos na ordem crescente de massa." style="width:100%" data-largura="100%"></figure>'
) on conflict (slug) do nothing;

-- ============================================
-- 2. As funções inorgânicas
-- ============================================

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'estudo-dos-acidos-e-classificacao',
  'Estudo dos Ácidos e classificação',
  'quimica',
  'comum',
  'Como um ácido é classificado — por oxigênio, por número de elementos, por hidrogênios ionizáveis e pela força com que ioniza na água.',
  '<ul><li><p>São compostos de <strong>natureza covalente</strong>;</p></li>
<li><p>Um ácido pode ser classificado quanto à presença de Oxigênio (<strong>oxiácido</strong>) ou a ausência deste (<strong>hidrácido</strong>).</p></li>
<li><p>Pode ser classificado quanto ao número de elementos:</p>
<ul><li><p><strong>Binário</strong>; Ex: <span data-type="inline-math" data-latex="HCl, HBr, HF, ..."></span></p></li>
<li><p><strong>Ternário</strong>; Ex: <span data-type="inline-math" data-latex="H_2SO_4, H_3PO_4, HCN, ..."></span></p></li>
<li><p><strong>Quaternário</strong>; Ex: <span data-type="inline-math" data-latex="H_4Fe(CN)_6, ..."></span></p></li></ul></li>
<li><p>Um hidrogênio é <strong>ionizável</strong> quando é <strong>retirado do ácido</strong> sob a forma de <strong>cátion</strong> <span data-type="inline-math" data-latex="H^+"></span>;</p></li>
<li><p>O n° de hidrogênios ionizáveis classifica o ácido em:</p>
<ul><li><p><strong>Monoácido</strong>: <span data-type="inline-math" data-latex="HCl"></span></p></li>
<li><p><strong>Diácido</strong>: <span data-type="inline-math" data-latex="H_2SO_4"></span></p></li>
<li><p><strong>Triácido</strong>: <span data-type="inline-math" data-latex="H_3PO_4"></span></p></li>
<li><p><strong>Poliácido</strong>: <span data-type="inline-math" data-latex="H_4Fe(CN)_6"></span></p></li></ul></li>
<li><p>A força de um ácido é medida em função do percentual de moléculas que ionizam em água (<span data-type="inline-math" data-latex="α"></span>): <strong>forte</strong> (<span data-type="inline-math" data-latex="α≥50\%"></span>), <strong>moderado</strong> (<span data-type="inline-math" data-latex="5\%≤α&lt;50\%"></span>) e <strong>fraco</strong> (<span data-type="inline-math" data-latex="α≤5\%"></span>);</p>
<ul><li><p><span data-type="inline-math" data-latex="α=\frac{\text{número de moléculas ionizadas}}{\text{número de moléculas dissolvidas}}⋅100\%"></span></p></li>
<li><p>A ionização de um ácido é representada pela equação <span data-type="inline-math" data-latex="H_xA→x H^+ + A^{-x}"></span> onde:</p>
<ul><li><p><span data-type="inline-math" data-latex="x"></span>: número de hidrogênios;</p></li>
<li><p><span data-type="inline-math" data-latex="A"></span>: o que está ligado ao <span data-type="inline-math" data-latex="H"></span>;</p></li>
<li><p>Ex: <span data-type="inline-math" data-latex="H_3PO_4→3 H^+ + PO_4^{-3}"></span></p></li></ul></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'nomenclatura-de-acidos',
  'Nomenclatura de Ácidos',
  'quimica',
  'comum',
  'A regra do -ídrico para hidrácidos e a tabela de prefixos e sufixos dos oxiácidos, que sai do NOx e da família do elemento.',
  '<ul><li><p>Hidrácidos: <strong>elemento/grupo+ÍDRICO</strong>. Ex: <span data-type="inline-math" data-latex="HCl"></span> (ácido cianídrico);</p></li>
<li><p>Oxiácidos: depende do valor do <strong>NOx</strong> (número de oxidação; representa a <strong>carga elétrica de um átomo na molécula</strong>)</p>
<ul><li><p><span data-type="inline-math" data-latex="NOx=2⋅n°Oxig.-n°Hidr."></span></p></li></ul></li></ul>
<table><thead><tr><th>NOME</th><th>3A</th><th>4A</th><th>5A</th><th>6A</th><th>7A</th></tr></thead>
<tbody>
<tr><td>PER+elemento+ICO</td><td></td><td></td><td></td><td></td><td>7</td></tr>
<tr><td>elemento+ICO</td><td>3</td><td>4</td><td>5</td><td>6</td><td>5</td></tr>
<tr><td>elemento+OSO</td><td>1</td><td>2</td><td>3</td><td>4</td><td>3</td></tr>
<tr><td>HIPO+elemento+OSO</td><td></td><td></td><td>1</td><td>2</td><td>1</td></tr>
</tbody></table>
<h2 data-corrido="sim">Desidratação:</h2>
<p>remoção de moléculas de água do ácido;</p>
<ul><li><p>Quando é possível, o ácido recebe o prefixo +ORTO;</p>
<ul><li><p>Ex: <span data-type="inline-math" data-latex="H_4SiO_4"></span> (ácido ortossilícico);</p></li></ul></li>
<li><p><strong>Intramolecular</strong>: remoção de uma molécula de água de <strong>uma molécula</strong> de ácido, recebendo o prefixo +META;</p>
<ul><li><p>Ex: <span data-type="inline-math" data-latex="H_4SiO_4-H_2O=H_2SiO_3"></span> (ácido metassilícico);</p></li></ul></li>
<li><p><strong>Intermolecular</strong>: remoção de uma molécula de água de <strong>duas moléculas</strong> de ácido;</p>
<ul><li><p>Ex: <span data-type="inline-math" data-latex="H_8Si_2O_8-H_2O=H_6Si_2O_7"></span> (ácido pirossilícico);</p></li></ul></li>
<li><p>Ácidos com átomos de enxofre (Sn) em vez de oxigênio recebem o prefixo +TIO</p></li></ul>
<aside class="questao"><p>(UEPG-PR 2020) Com relação aos ácidos apresentados, assinale o que for correto.</p>
<p>01. <span data-type="inline-math" data-latex="HCl"></span> é um monoácido denominado ácido clorídrico.</p>
<p>02. <span data-type="inline-math" data-latex="H_2CO_3"></span> é um diácido, onde o ânion divalente é denominado carbonato.</p>
<p>04. <span data-type="inline-math" data-latex="H_3PO_3"></span> é um triácido que libera por dissociação o ânion metafosfato (<span data-type="inline-math" data-latex="PO_3^{-3}"></span>).</p>
<p>08. <span data-type="inline-math" data-latex="H_3BO_3"></span> é um triácido denominado ácido bórico.</p>
<p>16. <span data-type="inline-math" data-latex="H_2SO_4"></span> é um monoácido, cuja dissociação total, em meio aquoso, libera íons <span data-type="inline-math" data-latex="H^+"></span> e <span data-type="inline-math" data-latex="HSO_4^-"></span></p>
<div class="resolucao"><p>RESOLUÇÃO:</p>
<p>01. Sim, pois só tem um hidrogênio e, como é um hidrácido, recebe o sufixo -ídrico.</p>
<p>02. Sim, pois tem dois hidrogênios e o ânion divalente é denominado carbonato (<span data-type="inline-math" data-latex="CO_3^-"></span>).</p>
<p>04. Não, pois o nome do processo não é dissociação, mas sim ionização.</p>
<p>08. Sim, pois como o NOx do <span data-type="inline-math" data-latex="H_3BO_3"></span> é 3 (<span data-type="inline-math" data-latex="2⋅3-3"></span>) e o B está na família 3A, este recebe o sufixo -ICO.</p>
<p>16. Não, pois tem dois hidrogênios e não sofre dissociação.</p>
<p>Soma: 1 + 2 + 8 = 11</p></div></aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'estudo-das-bases',
  'Estudo das Bases',
  'quimica',
  'comum',
  'A hidroxila ligada a um metal: como as bases se dissociam na água e como são classificadas por força e por solubilidade.',
  '<ul><li><p>As bases são compostos iônicos formadas pelo íon hidroxila (<span data-type="inline-math" data-latex="OH^-"></span>) ligado a um metal ou ao grupo amônio (<span data-type="inline-math" data-latex="NH_4^+"></span>);</p></li>
<li><p>Quando interagem com água, passam pela <strong>dissociação iônica</strong> (separação dos íons constituintes de estrutura);</p>
<ul><li><p><span data-type="inline-math" data-latex="M(OH)_{x (aq)}→x OH^-_{(aq)}+M^{+x}_{(aq)}"></span></p>
<ul><li><p>O termo <span data-type="inline-math" data-latex="(aq)"></span> localizado à direita da fórmula do composto indica que ele está dissolvido na água;</p></li></ul></li></ul></li>
<li><p>Podem ser classificadas de acordo com dois critérios:</p>
<ul><li><p><strong>Força</strong>: fortes (1A e 2A, exceto Mg) e fracos (as demais);</p></li>
<li><p><strong>Solubilidade</strong>: solúveis (1A e amônio), pouco solúveis (2A) e insolúveis (as demais);</p></li></ul></li>
<li><p>Por serem compostos iônicos, as bases são <strong>sólidos cristalinos</strong>, com exceção de bases de amônio que são gases extremamente voláteis;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'nomenclatura-das-bases',
  'Nomenclatura das Bases',
  'quimica',
  'comum',
  'Hidróxido de alguma coisa — e o que fazer quando esse alguma coisa tem mais de uma valência possível.',
  '<ul><li><p>Regra geral: Hidróxido de (metal ou grupo)</p></li>
<li><p>Famílias B (exceto Zn e Ag) e família 4A apresentam múltiplas valências em seus elementos;</p></li></ul>
<table><thead><tr><th>Elementos</th><th>NOX</th></tr></thead>
<tbody>
<tr><td>Mn</td><td>+2, +4, +6 ou +7</td></tr>
<tr><td>Fe, Co e Ni</td><td>+2 ou +3</td></tr>
<tr><td>Pb, Pt e Sn</td><td>+2 ou +4</td></tr>
<tr><td>Au</td><td>+1 ou +3</td></tr>
<tr><td>Cu e Hg</td><td>+1 ou +2</td></tr>
<tr><td>Cr</td><td>+2, +3 ou +6</td></tr>
</tbody></table>
<ul><li><p>Nestes casos, informa-se a valência em algarismos ou usa-se o sufixo +ICO para a maior valência e +OSO para a menor valência;</p>
<ul><li><p>Ex: <span data-type="inline-math" data-latex="Fe(OH)_3"></span> (hidróxido de ferro III ou hidróxido férrico)</p></li></ul></li></ul>
<aside class="questao"><p>(UEPG-PR 2022) Entre as alternativas que trazem reações de dissociação iônica dos hidróxidos de metais, assinale o que for correto.</p>
<p>01. <span data-type="inline-math" data-latex="NaOH(s)→Na^+(aq)+OH^-(aq)"></span></p>
<p>02. <span data-type="inline-math" data-latex="Ca(OH)_2(s)→Ca^{2+}(aq)+2 OH^-(aq)"></span></p>
<p>04. <span data-type="inline-math" data-latex="Sr(OH)_2(s)→Sr^{2+}(aq)+OH^-(aq)"></span></p>
<p>08. <span data-type="inline-math" data-latex="Fe(OH)_3(s)→Fe^{3+}(aq)+2 OH^-(aq)"></span></p>
<p>16. <span data-type="inline-math" data-latex="Al(OH)_3(s)→Al^{3+}(aq)+3 OH^-(aq)"></span></p>
<div class="resolucao"><p>RESOLUÇÃO:</p>
<p>01. Sim.</p>
<p>02. Sim.</p>
<p>04. Não, pois o composto <span data-type="inline-math" data-latex="Sr(OH)_2(s)"></span> apresenta 2 <span data-type="inline-math" data-latex="OH^-"></span> e não um como está representado nos produtos.</p>
<p>08. Não, pois o composto <span data-type="inline-math" data-latex="Fe(OH)_3(s)"></span> apresenta 3 <span data-type="inline-math" data-latex="OH^-"></span> e não 2 como está representado nos produtos.</p>
<p>16. Sim.</p>
<p>Soma: 1 + 2 + 16 = 19</p></div></aside>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'oxidos',
  'Óxidos',
  'quimica',
  'comum',
  'Qualquer elemento com oxigênio, menos flúor e gases nobres: os cinco tipos e as duas regras de nomenclatura, uma para os iônicos e outra para os moleculares.',
  '<p>compostos binários formados por qualquer elemento da Tabela Periódica com oxigênio, exceto o Flúor e os Gases Nobres;</p>
<ul><li><p><strong>Iônicos</strong>: oxigênio ligado a um metal;</p>
<ul><li><p><strong>Básicos</strong>: metais das famílias 1A (alcalinos), 2A (alcalino-terrosos) e 1B; Ex: <span data-type="inline-math" data-latex="Na_2O"></span>;</p></li>
<li><p><strong>Anfóteros</strong>: os demais metais; Ex: <span data-type="inline-math" data-latex="Fe_2O_3"></span>;</p></li></ul></li>
<li><p><strong>Moleculares ou ácidos</strong>: oxigênio ligado a um ametal, exceto <span data-type="inline-math" data-latex="NO"></span>, <span data-type="inline-math" data-latex="N_2O"></span> e <span data-type="inline-math" data-latex="CO"></span> (óxidos <strong>indiferentes ou neutros</strong>); Ex: <span data-type="inline-math" data-latex="CO_2"></span>, <span data-type="inline-math" data-latex="SO_3"></span>;</p></li>
<li><p><strong>Duplos (misto)</strong>: valor de NOx fracionário; Ex:</p></li>
<li><p><strong>Peróxidos</strong>: valor de NOx do Oxigênio igual a 1;</p>
<ul><li><p><span data-type="inline-math" data-latex="NOx=\frac{2. n° Oxig.}{n° elem.}"></span></p></li></ul></li></ul>
<h2>Nomenclatura</h2>
<ul><li><p>Para os óxidos moleculares/ácidos a regra é: (prefixo ) + AMETAL</p>
<ul><li><p>Os prefixos são: mono (só no oxigênio), di, tri, tetra, penta, hexa e hepta.</p></li>
<li><p>Ex: <span data-type="inline-math" data-latex="NO_2"></span> - dióxido de nitrogênio (2 oxigênios);</p></li></ul></li>
<li><p>Os óxidos iônicos recebem o nome de acordo com a regra:</p>
<ul><li><p>ÓXIDO de METAL NOx;</p></li>
<li><p>O NOx, expresso em algarismos romanos, se couber. A opção OSO e ICO também é válida.</p></li>
<li><p>Ex: <span data-type="inline-math" data-latex="MnO_2"></span> - ÓXIDO MANGÂNICO ou ÓXIDO DE MANGANÊS IV</p>
<ul><li><p><span data-type="inline-math" data-latex="NOx=\frac{2. n° Oxig.}{n° elem.}"></span> → <span data-type="inline-math" data-latex="\frac{2. 2}{1}"></span> → 4</p></li></ul></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'formulacao-de-sais',
  'Formulação de Sais',
  'quimica',
  'comum',
  'A regra do cruzamento das cargas: a carga do cátion vira o índice do ânion, e vice-versa.',
  '<p>são formados sempre por um <strong>cátion</strong> e um <strong>ânion</strong>;</p>
<ul><li><p>Fórmula geral: <span data-type="inline-math" data-latex="C^{x+}+A^{y-}→C_yA_x"></span></p></li>
<li><p>Ex: <span data-type="inline-math" data-latex="Na^+ + Cl^-→NaCl"></span> - sal comum; <span data-type="inline-math" data-latex="Ca^{3+}+CO^-→CaCO_3"></span> - carbonato de cálcio;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'nomenclatura-de-sais',
  'Nomenclatura de Sais',
  'quimica',
  'comum',
  'Nome do ânion, "de", nome do cátion — a regra mais curta da química inorgânica.',
  '<ul><li><p>Regra geral: NOME DO ÂNION + de + NOME DO CÁTION;</p>
<ul><li><p>Cada ânion tem seu nome (serão dados no exercício);</p></li>
<li><p>Ex: <span data-type="inline-math" data-latex="LiNO_3"></span> - Nitrato de lítio (<span data-type="inline-math" data-latex="NO_3"></span>: ânion nitrato); <span data-type="inline-math" data-latex="AlPO_4"></span> - fosfato de alumínio (<span data-type="inline-math" data-latex="PO_4"></span>: ânion fosfato)</p></li></ul></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'reacoes-quimicas',
  'Reações químicas',
  'quimica',
  'comum',
  'Como se lê uma equação química — os dois membros, os coeficientes, os estados físicos — e os quatro tipos de reação inorgânica.',
  '<p>são expressas, graficamente, por meio de Equações Químicas;</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/membros-da-equacao-quimica.webp" alt="Os dois lados de uma equação química: à esquerda da seta, os reagentes, chamados de 1º membro; à direita, os produtos, o 2º membro." style="width:100%" data-largura="100%"></figure>
<ul><li><p>São balanceadas por meio dos <strong>coeficientes estequiométricos</strong>, números ao lado das fórmulas moleculares;</p></li>
<li><p>O estado físico dos compostos é representado ao lado de suas fórmulas pelos símbolos..</p>
<ul><li><p>(s): sólido</p></li>
<li><p>(l): líquido;</p></li>
<li><p>(g): gasoso;</p></li>
<li><p>(aq): aquoso;</p></li></ul></li></ul>
<h2>Classificação das reações inorgânicas</h2>
<ul><li><p><strong>Síntese (adição)</strong>: apresenta apenas um produto;</p>
<ul><li><p>Ex: <span data-type="inline-math" data-latex="CaO + CO_2 → CaCO_3"></span></p>
<ul><li><p><span data-type="inline-math" data-latex="CaCO_3"></span>: produto;</p></li></ul></li></ul></li>
<li><p><strong>Análise (decomposição)</strong>: apresenta apenas um reagente;</p>
<ul><li><p>Ex: <span data-type="inline-math" data-latex="2 AgCl→2 Ag+Cl_2"></span></p>
<ul><li><p><span data-type="inline-math" data-latex="AgCl"></span>: reagente;</p></li></ul></li></ul></li>
<li><p><strong>Simples Troca (deslocamento)</strong>: substância composta tem parte substituta por uma substância simples;</p>
<ul><li><p>Ex: <span data-type="inline-math" data-latex="Zn+2 HCl→ZnCl_2+H_2"></span></p></li></ul></li>
<li><p><strong>Dupla troca</strong>: reação entre duas substâncias compostas;</p>
<ul><li><p><span data-type="inline-math" data-latex="HCl+NaOH→NaCl+H_2O"></span></p></li></ul></li></ul>
<h2>Condições na qual a reação ocorre</h2>
<ul><li><p>Pirólise (<span data-type="inline-math" data-latex="Δ"></span>): calor;</p></li>
<li><p>Fotólise (<span data-type="inline-math" data-latex="λ"></span>): presença de luz;</p></li>
<li><p>Meio ácido (<span data-type="inline-math" data-latex="H^+"></span>): presença de <span data-type="inline-math" data-latex="H^+"></span>;</p></li>
<li><p>Precipitado (<span data-type="inline-math" data-latex="↓"></span>): formação de sólido insolúvel;</p></li></ul>'
) on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo)
values (
  'reacoes-de-combustao',
  'Reações de Combustão',
  'quimica',
  'comum',
  'O triângulo do fogo e a diferença que o oxigênio disponível faz: chama azul e gás carbônico, ou chama amarela, monóxido e fuligem.',
  '<p>processo exotérmico por meio do qual ocorre liberação de energia na forma de calor e de luz;</p>
<ul><li><p>Três fatores são necessários para iniciar uma combustão: <strong>combustível</strong>, <strong>comburente</strong> (reage com o combustível) e <strong>calor</strong> (energia de ativação);</p></li>
<li><p>Triângulo do fogo:</p>
<figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/quimica/triangulo-do-fogo.webp" alt="Triângulo do fogo: com uma chama no centro, cada lado do triângulo traz um dos três fatores da combustão — oxigênio à esquerda, calor à direita e combustível na base." style="width:100%" data-largura="100%"></figure></li></ul>
<h2 data-corrido="sim">Combustão Completa:</h2>
<p>ocorre quando há oxigênio suficiente para a oxidação completa do combustível.</p>
<ul><li><p>Os produtos principais são dióxido de carbono (<span data-type="inline-math" data-latex="CO_2"></span>) e água (<span data-type="inline-math" data-latex="H_2O"></span>);</p></li>
<li><p>Ex: combustão do metano — <span data-type="inline-math" data-latex="CH_4(g)+2 O_2(g)→CO_2(g)+2 H_2O(g)"></span></p></li>
<li><p>A chama é geralmente azul;</p></li></ul>
<h2 data-corrido="sim">Combustão Incompleta:</h2>
<p>Ocorre na ausência de oxigênio suficiente.</p>
<ul><li><p>Os produtos incluem dióxido de carbono (<span data-type="inline-math" data-latex="CO_2"></span>), água (<span data-type="inline-math" data-latex="H_2O"></span>), e também monóxido de carbono (<span data-type="inline-math" data-latex="CO"></span>) e/ou carbono (fuligem);</p></li>
<li><p>A chama tende a ser amarela ou alaranjada e é mais chamuscante;</p></li>
<li><p>Libera menos energia comparada à combustão completa;</p></li></ul>'
) on conflict (slug) do nothing;

-- ============================================
-- 3. O quadro das emissões, que estava no tópico errado
-- ============================================
--
-- Ancorado em "Semelhanças atômicas" no documento, mas é o resumo da
-- Radioatividade. O `not like` deixa a migration rodar de novo sem empilhar
-- uma segunda cópia da tabela.

update resumos set
  corpo = corpo || '<h2>Quadro comparativo das principais emissões radioativas</h2>
<table><thead><tr><th>RADIAÇÃO</th><th>ALFA</th><th>BETA</th><th>GAMA</th></tr></thead>
<tbody>
<tr><td><strong>Representação</strong></td><td><span data-type="inline-math" data-latex="{}_{2}^{4}\alpha"></span></td><td><span data-type="inline-math" data-latex="{}_{-1}^{0}\beta"></span></td><td><span data-type="inline-math" data-latex="{}_{0}^{0}\gamma"></span></td></tr>
<tr><td><strong>Massa</strong></td><td>4</td><td>0</td><td>0</td></tr>
<tr><td><strong>Velocidade</strong></td><td>5% de <em>c</em></td><td>95% de <em>c</em></td><td><em>c</em>*</td></tr>
<tr><td><strong>Mudança no n<sup>o</sup> atômico do emissor</strong></td><td>Diminui 2 unidades</td><td>Aumenta 1 unidade</td><td>Não há mudança</td></tr>
<tr><td><strong>Mudança no n<sup>o</sup> de massa do emissor</strong></td><td>Diminui 4 unidades</td><td>Não há mudança</td><td>Não há mudança</td></tr>
<tr><td><strong>Poder de penetração</strong></td><td>Baixo</td><td>Moderado</td><td>Alto</td></tr>
</tbody></table>
<p>*<em>c</em> = velocidade da luz no vácuo (300 000 km/s).</p>',
  atualizado_em = now()
where slug = 'radioatividade'
  and corpo not like '%Quadro comparativo das principais emissões radioativas%';

-- O trigger `trg_sync_conexoes_resumo` roda no insert e resolve cada
-- `[[wikilink]]` procurando o resumo de destino pelo título. Estes vinte não
-- trazem wikilink nenhum, mas o update vazio é o fecho padrão das migrations
-- de importação (decisão 9c) e custa nada.
update resumos set corpo = corpo where materia_slug = 'quimica';

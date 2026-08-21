-- Importa a Biologia da 1ª etapa do PAS UEM, vinda do Google Docs.
--
-- Segue o caminho aberto pela `importa_dinamica_fisica`: conteúdo entra por
-- migração, versionado e visível no diff, e não por uma tela de importação que
-- existiria para um problema que acontece uma vez por matéria.
--
-- ## O documento tem doze matérias e só cinco têm texto
--
-- O "Resumo para PAS UEM 1°etapa" lista o edital inteiro, mas a maior parte
-- das matérias é só a LISTA DE TÓPICOS do edital, sem uma linha escrita —
-- Geografia, Arte, Filosofia, Sociologia, História, Literatura e Redação estão
-- assim. Tópico vazio não vira resumo: entraria como nó do mapa que abre numa
-- página em branco, que é pior do que não existir.
--
-- Na Biologia o mesmo vale por dentro: dos vinte tópicos listados, dois estão
-- escritos — "Características dos seres vivos" e "Ciclo celular". São estes
-- dois que entram. Os outros dezoito continuam esperando o autor.
--
-- ## O que muda de forma, e o que não muda de palavra
--
-- Nenhuma palavra do texto foi reescrita, nem os deslizes ("organismo que são
-- incapazes", "propriedade que um sistema aberto (...) têm"). Quem migra não
-- corrige de passagem — é o mesmo princípio da `conserta_filosofia_da_linguagem`.
--
-- Três adaptações de FORMA, todas para devolver o que o Docs mostrava e a
-- exportação em texto perdeu:
--
-- 1. **Os tópicos em negrito viraram grafos** (`h2`/`h3`/`h4`), no formato
--    corrido `Termo:` + explicação, que é o formato de origem dos resumos
--    (decisão 12c). No Docs eles eram itens de lista em negrito com cinco
--    níveis de recuo; aqui cada um vira um nó do `/mapa`.
-- 2. **`H2O` voltou a ter o 2 subscrito.** A exportação achata o subscrito, e
--    a decisão 8b diz que símbolo solto no meio da frase é texto com `<sub>`.
-- 3. **Os marcadores vazios saíram.** Onde o Docs tinha um esquema desenhado
--    (as fases da mitose e da meiose, os níveis de organização), a exportação
--    deixou um item de lista vazio. As IMAGENS não vieram nesta migração —
--    ficam para uma segunda passada, que precisa baixar o .docx.
--
-- ## Sem wikilink nenhum, de propósito
--
-- O documento tem um link interno em "moléculas orgânicas", que aponta para
-- outro arquivo do Drive. Um `[[wikilink]]` sem resumo de destino não vira
-- link: `lib/wikilinks.ts` o imprime cru e apagado na tela do aluno. Então ele
-- entra quando a Química entrar, e não agora.
--
-- `on conflict (slug) do nothing` deixa rodar de novo sem duplicar, e sem
-- passar por cima de uma edição feita no editor.

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'caracteristicas-dos-seres-vivos',
  'Características dos seres vivos',
  'biologia',
  'pas-uem',
  'O que um ser vivo tem e a matéria bruta não — da composição química à hereditariedade.',
  '<h2>Composição química</h2>
<ul><li><p>Elementos mais abundantes: carbono (C), hidrogênio (H), nitrogênio (N), fósforo (P) e enxofre (S);</p>
<ul><li><p>Esses elementos formam moléculas orgânicas e moléculas inorgânicas, como H<sub>2</sub>O (molécula mais abundante em todos os seres vivos) e minerais;</p></li></ul></li></ul>
<h2 data-corrido="sim">Metabolismo:</h2>
<p>conjunto de reações químicas para obter, transformar e utilizar a energia para manter a vida;</p>
<ul><li><p>Catabolismo: reações químicas responsáveis pela quebra de moléculas complexas em outras mais simples;</p>
<ul><li><p>Ex: respiração celular aeróbica;</p></li></ul></li>
<li><p>Anabolismo: reações químicas responsáveis pela produção de moléculas complexas com base em outras mais simples;</p>
<ul><li><p>Ex: fotossíntese;</p></li></ul></li></ul>
<h2 data-corrido="sim">Nutrição:</h2>
<p>organismos vivos precisam se alimentar para adquirir nutrientes e energia para sua sobrevivência;</p>
<ul><li><p>Autótrofos: organismos capazes de produzir seu próprio alimento a partir de moléculas inorgânicas e de energia presentes no ambiente;</p>
<ul><li><p>Quimiossíntese: a energia utilizada para a construção de compostos orgânicos é proveniente de reações químicas exergônicas, ou seja, que liberam energia;</p>
<ul><li><p>Realizada apenas por bactérias e arqueas;</p></li></ul></li>
<li><p>Fotossíntese: a energia utilizada para a construção de compostos orgânicos provém da luz solar;</p>
<ul><li><p>Realizada por algumas bactérias, algas e plantas;</p></li></ul></li></ul></li>
<li><p>Heterótrofos: organismo que são incapazes de produzir seu próprio alimento e precisam ingerir matéria orgânica de outros seres vivos ou do ambiente para construir suas próprias moléculas orgânicas;</p>
<ul><li><p>Fungos, protozoários, animais e diversas bactérias;</p></li></ul></li></ul>
<h2 data-corrido="sim">Reação a estímulos:</h2>
<p>reagem a mudanças no ambiente, como luz, temperatura ou toque;</p>
<h2 data-corrido="sim">Homeostase:</h2>
<p>propriedade que um sistema aberto (semelhante ao dos seres vivos) têm de regular seu ambiente interno, de modo a manter uma condição estável mediante múltiplos ajustes controlados por mecanismos de regulação;</p>
<ul><li><p>Ex: equilíbrio hídrico nos animais;</p></li></ul>
<h2 data-corrido="sim">Crescimento e desenvolvimento:</h2>
<p>aumentam de tamanho e podem passar por transformações ao longo da vida;</p>
<h2 data-corrido="sim">Reprodução:</h2>
<p>organismos vivos possuem a capacidade de gerar descendentes e de se perpetuar;</p>
<ul><li><p>Sexuada: união de gametas dos progenitores;</p></li>
<li><p>Assexuada: acontece sem a participação de gametas, ou seja, não há mistura de material genético;</p></li></ul>
<h2 data-corrido="sim">Hereditariedade:</h2>
<p>capacidade dos seres vivos de transmitir as características dos pais para os filhos;</p>',
  null
)
on conflict (slug) do nothing;

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'ciclo-celular',
  'Ciclo celular',
  'biologia',
  'pas-uem',
  'A vida da célula em duas etapas: a interfase, que dura quase tudo, e a divisão.',
  '<p>Vida da célula, desde sua origem até sua divisão. É dividido em duas etapas:</p>
<h2 data-corrido="sim">Interfase:</h2>
<p>período entre duas divisões celulares; dura a maior parte do ciclo;</p>
<ul><li><p>G1: crescimento celular e síntese de organelas;</p></li>
<li><p>S: duplicação do DNA;</p></li>
<li><p>G2: checagem do DNA e síntese de proteínas para a divisão;</p></li></ul>
<h2 data-corrido="sim">Divisão celular:</h2>
<p>compreende a fase mitótica e a citocinese:</p>
<h3 data-corrido="sim">Fase M (Mitótica):</h3>
<p>quando a divisão de fato ocorre (mitose ou meiose);</p>
<h4 data-corrido="sim">Mitose (E!):</h4>
<p>processo contínuo, em que uma célula acaba por se transformar em duas células-filhas;</p>
<ul><li><p><strong>Função:</strong> formar células idênticas à célula original;</p>
<ul><li><p>Regeneração/cicatrização;</p></li>
<li><p>Desenvolvimento e crescimento do organismo;</p></li>
<li><p>Reprodução nos seres unicelulares;</p></li></ul></li>
<li><p><strong>Ocorrência:</strong> células somáticas (do corpo, não gametas);</p></li></ul>
<p>Fases da mitose:</p>
<ul><li><p>Prófase:</p>
<ul><li><p>Início da condensação cromossômica;</p></li>
<li><p>Duplicação dos centrossomos (centríolos);</p></li>
<li><p>Desaparecimento da carioteca (membrana nuclear);</p></li>
<li><p>Formação das fibras do áster (fibras do fuso);</p></li></ul></li>
<li><p>Metáfase:</p>
<ul><li><p>Centríolos dispostos nos polos opostos;</p></li>
<li><p>Crescimento das fibras do áster e do fuso;</p></li>
<li><p>Cromossomos posicionados na região mediana;</p></li>
<li><p>Condensação máxima dos cromossomos;</p></li></ul></li>
<li><p>Anáfase:</p>
<ul><li><p>Encurtamento das fibras do fuso;</p></li>
<li><p>Divisão longitudinal do centrômero;</p></li>
<li><p>Separação das cromátides irmãs;</p></li></ul></li>
<li><p>Telófase: inverso da prófase;</p>
<ul><li><p>Descondensação dos cromossomos;</p></li>
<li><p>Reaparecimento da carioteca e do nucléolo;</p></li>
<li><p>Citocinese: divisão do citoplasma, formando duas células filhas idênticas à mãe;</p></li></ul></li></ul>
<h4 data-corrido="sim">Meiose:</h4>
<p>divisão celular em que uma célula mãe sempre (2n) com cromossomos duplos origina, mediante duas divisões sucessivas, quatro células filhas contendo metade do número de cromossomos da célula mãe;</p>
<ul><li><p><strong>Função:</strong> reduzir o número de cromossomos pela metade e gera variabilidade genética;</p></li>
<li><p><strong>Ocorrência:</strong></p>
<ul><li><p>Nos Animais:</p>
<ul><li><p>Ocorre nas gônadas (testículos e ovários);</p></li>
<li><p>Forma os gametas (espermatozoides e óvulos);</p></li>
<li><p>Meiose Gamética;</p></li></ul></li>
<li><p>Em Algumas Espécies de Fungos, Protozoários e Algas:</p>
<ul><li><p>Ocorre imediatamente após a formação do zigoto;</p></li>
<li><p>Meiose Zigótica;</p></li></ul></li>
<li><p>Nas Plantas e Algumas Algas:</p>
<ul><li><p>Ocorre em indivíduos diploides;</p></li>
<li><p>Forma esporos haploides;</p></li>
<li><p>Meiose Espórica;</p></li></ul></li></ul></li></ul>
<p><strong>Etapas da meiose:</strong></p>
<ul><li><p>A etapa I é <strong>reducional (R!)</strong> e a etapa II é <strong>equacional (E!)</strong>;</p></li>
<li><p>Prófase I: fase mais longa da meiose; 5 subfases;</p>
<ul><li><p>Leptóteno: visualização dos cromômeros; início a condensação dos cromossomos;</p></li>
<li><p>Zigóteno: emparelhamento dos cromossomos homólogos; sinapse cromossômica;</p></li>
<li><p>Paquíteno: cromossomos continuam a se condensar; ocorrem quebras nas cromátides;</p>
<ul><li><p>Ocorre o crossing over (permutação): troca de fragmentos entres cromossomos homólogos que gera variabilidade genética;</p></li></ul></li>
<li><p>Diplóteno: cromossomos homólogos começam a se separar; cromátides visíveis; formação das quiasmas (crossing over);</p></li>
<li><p>Diacinese: terminalização dos quiasmas; os nucléolos desaparecem; a carioteca desintegra-se;</p></li></ul></li>
<li><p>Metáfase I:</p>
<ul><li><p>Cromossomos homólogos pareados, um oposto ao outro, presos às fibras do fuso na placa equatorial da célula;</p></li></ul></li>
<li><p>Anáfase I:</p>
<ul><li><p>Encurtamento das fibras do fuso.</p></li>
<li><p>Cromossomos homólogos se separam, indo cada um para um lado da célula;</p></li>
<li><p>Não ocorre divisão do centrômero!</p></li></ul></li>
<li><p>Telófase I:</p>
<ul><li><p>Célula mãe (2n) origina duas células filhas (n);</p></li>
<li><p>Os cromossomos continuam duplos e não ocorre divisão do centrômero!</p></li>
<li><p>Formação de duas novas cariotecas e de dois novos nucléolos;</p></li>
<li><p>No final da Telófase I os cromossomos se desespiralizam;</p></li></ul></li>
<li><p>Prófase II:</p>
<ul><li><p>Duplicação dos centríolos;</p></li>
<li><p>Espiralização dos cromossomos;</p></li>
<li><p>Desaparecimento da carioteca;</p></li></ul></li>
<li><p>Metáfase II:</p>
<ul><li><p>Cromossomos duplos não homólogos atingem o grau máximo de espiralização;</p></li>
<li><p>Os cromossomos associam-se as fibras do fuso, alinhando-se no equador da célula;</p></li></ul></li>
<li><p>Anáfase II:</p>
<ul><li><p>Ocorre o encurtamento das fibras do fuso e divisão do centrômero;</p></li>
<li><p>Cada cromossomo duplo origina duas cromátides irmãs (cromossomos simples);</p></li>
<li><p>Os cromossomos simples são puxados para os polos da célula;</p></li></ul></li>
<li><p>Telófase II:</p>
<ul><li><p>Ocorre divisão do citoplasma (citocinese) originando quatro células filhas;</p></li>
<li><p>As células filhas são haploides e possuem cromossomos simples;</p></li>
<li><p>A carioteca e o nucléolo reaparecem e os cromossomos se descondensam;</p></li></ul></li></ul>
<h2>Conceitos-Chave e Estruturas</h2>
<ul><li><p><strong>Cromossomo x Cromatina:</strong> diferença entre o DNA condensado e o descondensado;</p></li>
<li><p><strong>Cromátides-irmãs:</strong> as duas cópias idênticas de um cromossomo duplicado, unidas pelo centrômero;</p></li>
<li><p><strong>Cromossomos Homólogos:</strong> o par de cromossomos (um de origem materna e outro paterna) que contêm genes para as mesmas características;</p></li>
<li><p><strong>Centrômero:</strong> região que une as cromátides-irmãs;</p></li>
<li><p><strong>Centríolos e Fuso Mitótico:</strong> estruturas responsáveis pela movimentação dos cromossomos;</p></li>
<li><p><strong>Ploidia:</strong> conceito de células haplóides (n) e diploides;</p></li>
<li><p><strong>Diferença entre meiose e mitose:</strong> A mitose produz duas células-filhas geneticamente idênticas com o mesmo número de cromossomos da célula-mãe. Já a meiose resulta em quatro células-filhas geneticamente diferentes com metade do número de cromossomos da célula-mãe;</p></li>
<li><p><strong>Importância da Meiose para a Variabilidade Genética:</strong> Asseguram que os gametas resultantes sejam geneticamente únicos, aumentando a diversidade da prole e a capacidade de adaptação e evolução das espécies;</p></li></ul>',
  null
)
on conflict (slug) do nothing;

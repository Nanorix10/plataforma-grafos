-- O Movimento circular da CINEMÁTICA, que não existia no site.
--
-- A `figuras_da_dinamica_pas_uem` terminou apontando este buraco: sobraram
-- cinco figuras sem onde entrar, porque o resumo `movimento-circular` que
-- existia se chamava "Movimento circular" mas trazia só a DINÂMICA do
-- movimento circular — força centrípeta, curva, globo da morte. Período,
-- frequência, velocidade angular e a relação entre grandeza linear e angular
-- não estavam em resumo nenhum, e são conteúdo de prova.
--
-- ## O resumo antigo passa a se chamar pelo que ele é
--
-- `movimento-circular` vira `dinamica-do-movimento-circular`, com o título
-- "Dinâmica do movimento circular" — que é a primeira frase do próprio corpo
-- dele, e o nome do tópico no documento mestre. Ele continua pendurado na
-- Dinâmica pelo `pai_id`.
--
-- A troca de slug é segura: nenhum `[[wikilink]]` aponta para ele (o único
-- wikilink do banco liga as duas funções de Matemática), nenhum evento da linha
-- do tempo o referencia, e a tabela `conexoes` não tem linha com ele.
--
-- O slug livre fica com a cinemática, que é o que o aluno procura quando digita
-- "movimento circular".
--
-- ## Duas tabelas que eram print
--
-- A regra de três do radiano (ângulo × arco) e a relação linear × angular
-- (s = θ·R, v = ω·R, a = γ·R) vinham como imagem. Viraram `<table>`, pelo mesmo
-- motivo da tabela de conjunções do Português: print de tabela não se
-- seleciona, não se busca e não se lê em leitor de tela.
--
-- As 29 fórmulas passaram pelo KaTeX antes de entrar.

update resumos
   set slug = 'dinamica-do-movimento-circular',
       titulo = 'Dinâmica do movimento circular'
 where slug = 'movimento-circular';

insert into resumos (slug, titulo, materia_slug, processo_slug, definicao, corpo, pai_id)
values (
  'movimento-circular',
  'Movimento circular',
  'fisica',
  'pas-uem',
  'Ângulo, arco, radiano, velocidade e aceleração angulares, período e frequência — o MCU e o MCUV.',
  '<p>deslocamento de um corpo em uma trajetória circular;</p><h2>Grandezas angulares</h2><h3 data-corrido="sim">Ângulos (espaço angular):</h3><p>região ou a abertura formada entre duas semirretas que possuem a mesma origem;</p><ul><li><p>Em uma circunferência de centro C e raio R:</p><ul><li><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/circunferencia-arco.webp" alt="Circunferência de centro C e raio R, com o ângulo central θ e o arco s que ele abre." style="width:100%" data-largura="100%"></figure><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/circunferencia-volta-completa.webp" alt="A volta completa da circunferência, que equivale a 360°." style="width:100%" data-largura="100%"></figure></li><li><p>s: comprimento do arco de circunferência;</p></li><li><p>θ: ângulo central;</p><ul><li><p>Pode ser expresso em…</p><ul><li><p>graus (°): uma volta completa equivale a 360°;</p></li><li><p>radiano (rad): um radiano tem o comprimento da circunferência igual a R;</p><figure class="figura" data-quebra="bloco" data-alinhamento="centro"><img src="/img/resumos/fisica/radiano.webp" alt="Um radiano é o ângulo cujo arco tem o mesmo comprimento do raio." style="width:100%" data-largura="100%"></figure><ul><li><p>Uma volta completa equivale a 2𝜋 rad;</p></li><li><p>Se…</p><ul><li><table><tbody><tr><th><p>Ângulo</p></th><th><p>Arco</p></th></tr><tr><td><p>1 rad</p></td><td><p>R</p></td></tr><tr><td><p>θ rad</p></td><td><p>s</p></td></tr></tbody></table><p>Então (por regra de 3) temos:</p></li><li><p><span data-type="inline-math" data-latex="s=θ⋅R"></span></p></li><li><p><span data-type="inline-math" data-latex="θ=\frac{s}{R}"></span></p></li></ul></li></ul></li></ul></li></ul></li></ul></li></ul><h3 data-corrido="sim">Velocidade escalar tangencial (v):</h3><p>representa o movimento linear de um corpo em um determinado ponto da trajetória curva;</p><h3 data-corrido="sim">Velocidade escalar angular:</h3><p>mede a rapidez com que um objeto percorre um ângulo em um movimento circular;</p><ul><li><p>Média (ω<sub>m</sub>): ângulo percorrido por um móvel pelo tempo;</p><ul><li><p><span data-type="inline-math" data-latex="ω_m=\frac{Δθ}{Δt}"></span></p></li></ul></li><li><p>Instantânea (ω): velocidade medida em um intervalo de tempo extremamente curto (que tende a zero), representando a velocidade do objeto naquele exato momento;</p></li><li><p>Se <span data-type="inline-math" data-latex="v=\frac{s}{t}"></span> e <span data-type="inline-math" data-latex="s=θ⋅R"></span>, então…</p><ul><li><p><span data-type="inline-math" data-latex="v=ω⋅R"></span> e <span data-type="inline-math" data-latex="Δv=Δω⋅R"></span></p></li></ul></li></ul><h3 data-corrido="sim">Aceleração escalar angular:</h3><p>mede a rapidez com que a velocidade escalar angular de um corpo muda;</p><ul><li><p>Média (γ<sub>m</sub>): razão entre a variação de velocidade escalar angular (<span data-type="inline-math" data-latex="Δω_m=\frac{Δθ}{Δt}"></span>) e a variação de tempo (Δt);</p><ul><li><p><span data-type="inline-math" data-latex="γ_m=\frac{Δω}{Δt}"></span></p></li></ul></li><li><p>Instantânea (γ): aceleração medida em um intervalo de tempo extremamente curto (que tende a zero), representando a velocidade do objeto naquele exato momento;</p></li><li><p>Se <span data-type="inline-math" data-latex="a=\frac{v}{t}"></span> e <span data-type="inline-math" data-latex="v=ω⋅R"></span>, então…</p><ul><li><p><span data-type="inline-math" data-latex="a=γ⋅R"></span> e <span data-type="inline-math" data-latex="Δa=Δγ⋅R"></span></p><table><tbody><tr><th><p>Grandeza linear</p></th><th><p>=</p></th><th><p>Grandeza angular</p></th><th><p>·</p></th><th><p>Raio</p></th></tr><tr><td><p>s (m)</p></td><td><p>=</p></td><td><p>θ (rad)</p></td><td><p>·</p></td><td><p>R (m)</p></td></tr><tr><td><p>v (m/s)</p></td><td><p>=</p></td><td><p>ω (rad/s)</p></td><td><p>·</p></td><td><p>R (m)</p></td></tr><tr><td><p>a (m/s<sup>2</sup>)</p></td><td><p>=</p></td><td><p>γ (rad/s<sup>2</sup>)</p></td><td><p>·</p></td><td><p>R (m)</p></td></tr></tbody></table></li></ul></li></ul><h3 data-corrido="sim">Frequência (f):</h3><p>grandeza que mede a quantidade de vezes que um evento, oscilação ou ciclo se repete em um determinado intervalo de tempo;</p><ul><li><p><span data-type="inline-math" data-latex="f=\frac{1}{T}=\frac{ω}{2π}"></span></p></li></ul><h3 data-corrido="sim">Período (T):</h3><p>tempo que leva para completar um ciclo ou uma volta;</p><ul><li><p><span data-type="inline-math" data-latex="T=\frac{1}{f}=\frac{2π}{ω}"></span></p></li></ul><h2 data-corrido="sim">Movimento circular uniforme (MCU):</h2><p>movimento com velocidade escalar angular (e linear) instantânea e média iguais (<span data-type="inline-math" data-latex="ω_m=ω"></span>) e constantes;</p><ul><li><p><span data-type="inline-math" data-latex="ω_m=ω⇒ω=\frac{Δs}{Δt}"></span></p></li><li><p>Função horária: <span data-type="inline-math" data-latex="θ=θ_0+ω⋅t"></span></p><ul><li><p>θ: espaço angular para um instante qualquer t;</p></li><li><p>θ<sub>0</sub>: espaço angular constante para o instante <span data-type="inline-math" data-latex="t=0"></span> ;</p></li><li><p><span data-type="inline-math" data-latex="Δθ=ω⋅t"></span></p></li></ul></li></ul><h2 data-corrido="sim">Movimento circular uniformemente variado (MCUV):</h2><p>movimento de um corpo com aceleração escalar angular constante e diferente de zero (<span data-type="inline-math" data-latex="ω_0≠0"></span>);</p><ul><li><p>Função horária dos espaços: <span data-type="inline-math" data-latex="θ=θ_0+ω_0t+\frac{γt^2}{2}"></span></p><ul><li><p><span data-type="inline-math" data-latex="Δθ=ω_0t+\frac{γt^2}{2}"></span></p></li></ul></li><li><p>Função horária da velocidade: <span data-type="inline-math" data-latex="ω=ω_0+γt"></span></p><ul><li><p><span data-type="inline-math" data-latex="Δω=γt"></span></p></li><li><p>Velocidade média entre dois pontos da trajetória: <span data-type="inline-math" data-latex="γ_m=\frac{ω_1+ω_2}{2}"></span></p></li></ul></li><li><p>Equação de Torricelli: <span data-type="inline-math" data-latex="ω^2={ω_0}^2+2γ⋅Δθ"></span></p><p>Para as anteriores:</p><ul><li><p>θ: espaço angular para um instante qualquer t;</p></li><li><p>θ<sub>0</sub>: espaço angular constante para o instante <span data-type="inline-math" data-latex="t=0"></span> ;</p></li><li><p>ω<sub>0</sub>: velocidade angular constante para o instante <span data-type="inline-math" data-latex="t=0"></span>;</p></li></ul></li></ul>',
  null
)
on conflict (slug) do nothing;

do $$
begin
  if not exists (select 1 from resumos where slug = 'dinamica-do-movimento-circular') then
    raise exception 'o resumo antigo nao foi renomeado';
  end if;
  if not exists (select 1 from resumos where slug = 'movimento-circular' and corpo like '%MCUV%') then
    raise exception 'a cinematica do movimento circular nao entrou';
  end if;
end $$;

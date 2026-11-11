-- Põe o modelo 3D da célula (animal e vegetal) no resumo "Célula", logo
-- depois da primeira figura (o esquema 2D da célula animal): o aluno vê o
-- desenho plano e, em seguida, gira e abre a versão 3D. Pedido do autor
-- em 11/11/2026 (decisão 28).
--
-- Só ACRESCENTA: nenhuma letra do texto do autor muda. O iframe é exatamente
-- o que o nó `modelo3d` do editor grava, então abrir o resumo no editor não
-- o altera. Idempotente: não insere se o modelo já estiver no corpo.
-- O resumo tinha zero grifos (decisão 21), então nenhuma âncora se desloca.
update resumos
set corpo = overlay(
      corpo
      placing '</figure><iframe src="/modelos-3d/celula.html" width="100%" height="560" style="border:0;border-radius:8px" loading="lazy" title="Célula animal e vegetal em 3D" allowfullscreen="true"></iframe>'
      from strpos(corpo, '</figure>') for char_length('</figure>')
    ),
    atualizado_em = now()
where slug = 'celula'
  and strpos(corpo, '</figure>') > 0
  and corpo not like '%/modelos-3d/celula.html%';

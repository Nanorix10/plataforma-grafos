import { ListItem } from '@tiptap/extension-list'

/**
 * O item de lista pode começar por uma figura, e não só por um parágrafo.
 *
 * O item do kit exige `paragraph block*`: o primeiro filho TEM de ser texto.
 * Só que imagem como item da lista é um jeito de escrever do autor — sete
 * resumos publicados têm `<li><figure>…</figure></li>` (substâncias, tabela
 * periódica, grandezas físicas, eletrólise…), a figura no ponto exato da
 * árvore de tópicos a que ela pertence.
 *
 * Com a regra do kit, abrir um desses resumos já os estragava: ao ler o HTML,
 * o ProseMirror "conserta" o que o esquema não aceita — deixa um marcador
 * vazio no lugar, empurra a figura para fora da lista e parte a lista em duas.
 * E o salvamento automático gravava o conserto. Ninguém precisava tocar em
 * nada; bastava abrir.
 *
 * Mesmo arranjo de `TituloCorrido` e `TabelaLivre`: `listItem: false` no kit,
 * e esta extensão — com o mesmo nome de nó — entra no lugar. O nome se mantém
 * `listItem` porque é por ele que `sinkListItem`/`liftListItem` (os botões de
 * recuo) e o Tab acham o item.
 */
export const ItemComFigura = ListItem.extend({
  content: '(paragraph | image) block*',
})

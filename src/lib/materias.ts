/**
 * Cor de cada matéria — o marcador que aparece na sidebar, nos cartões e nos
 * nós do grafo.
 *
 * Cada matéria traz DOIS tons, e `light-dark()` escolhe conforme o tema. O
 * mesmo tom não serve para os dois fundos: um marcador legível sobre papel
 * branco fica pesado no escuro, e o clareado que funciona no escuro some no
 * branco. O matiz é o mesmo nos dois — quem já usa o site continua
 * reconhecendo "o azul é matemática" —, muda só a luminosidade.
 *
 * O valor é uma cor CSS, não um hexadecimal: serve em `style`, em classe do
 * Tailwind e nos atributos `fill`/`stroke` do SVG que o d3 escreve, que
 * aceitam qualquer cor válida.
 *
 * Cor é reforço, nunca a única pista: o nome da matéria acompanha o marcador
 * em todos os lugares, o que também resolve daltonismo.
 */
function corDaMateria(claro: string, escuro: string) {
  return `light-dark(${claro}, ${escuro})`
}

export const MATERIAS: Record<string, { nome: string; cor: string }> = {
  portugues:  { nome: 'Língua Portuguesa', cor: corDaMateria('#C2334D', '#E08088') },
  literatura: { nome: 'Literatura',        cor: corDaMateria('#9C4B42', '#BC7F7A') },
  matematica: { nome: 'Matemática',        cor: corDaMateria('#1F5F9E', '#7FA8CF') },
  fisica:     { nome: 'Física',            cor: corDaMateria('#0B7A80', '#4FB3B8') },
  quimica:    { nome: 'Química',           cor: corDaMateria('#9E2E70', '#C576A6') },
  biologia:   { nome: 'Biologia',          cor: corDaMateria('#3F7848', '#8FAE94') },
  geografia:  { nome: 'Geografia',         cor: corDaMateria('#A65224', '#C98663') },
  filosofia:  { nome: 'Filosofia',         cor: corDaMateria('#4A5C8C', '#8FA0C8') },
  sociologia: { nome: 'Sociologia',        cor: corDaMateria('#A63A63', '#CE7E9C') },
  historia:   { nome: 'História',          cor: corDaMateria('#7A3785', '#B57CB3') },
  arte:       { nome: 'Arte',              cor: corDaMateria('#5646A8', '#9B8CD1') },
  redacao:    { nome: 'Redação',           cor: corDaMateria('#3D7A8C', '#85B0BE') },
}

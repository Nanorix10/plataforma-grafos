/**
 * Cor de cada matéria — o marcador que aparece na sidebar, nos cartões e nos
 * nós do grafo.
 *
 * Os tons foram escolhidos para fundo ESCURO. As cores anteriores (#FD0032,
 * #185E9E, #6C0B6A…) eram saturadas e fundas porque disputavam com o branco;
 * sobre #161826 elas viram manchas sem contraste, e as escuras somem de vez.
 * Aqui cada matéria mantém o mesmo MATIZ de antes — quem já usa o site
 * continua reconhecendo "o azul é matemática" — só que clareado e
 * dessaturado até passar de 4,5:1 sobre o fundo do conteúdo.
 *
 * Cor é reforço, nunca a única pista: o nome da matéria acompanha o marcador
 * em todos os lugares, o que também resolve daltonismo.
 */
export const MATERIAS: Record<string, { nome: string; cor: string }> = {
  portugues:  { nome: 'Língua Portuguesa', cor: '#E08088' },
  literatura: { nome: 'Literatura',        cor: '#BC7F7A' },
  matematica: { nome: 'Matemática',        cor: '#7FA8CF' },
  fisica:     { nome: 'Física',            cor: '#4FB3B8' },
  quimica:    { nome: 'Química',           cor: '#C576A6' },
  biologia:   { nome: 'Biologia',          cor: '#8FAE94' },
  geografia:  { nome: 'Geografia',         cor: '#C98663' },
  filosofia:  { nome: 'Filosofia',         cor: '#8FA0C8' },
  sociologia: { nome: 'Sociologia',        cor: '#CE7E9C' },
  historia:   { nome: 'História',          cor: '#B57CB3' },
  arte:       { nome: 'Arte',              cor: '#9B8CD1' },
  redacao:    { nome: 'Redação',           cor: '#85B0BE' },
}

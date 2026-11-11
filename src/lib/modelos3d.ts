/**
 * Os modelos 3D que o autor pode inserir num resumo.
 *
 * Cada modelo é um .html autônomo em `public/modelos-3d/`, com o Three.js vindo
 * do cdnjs, e entra no corpo do resumo como `<iframe>`. Esta lista é o que o
 * botão "Modelo 3D" do editor oferece: arquivo novo em `public/modelos-3d/` só
 * aparece para o autor depois de entrar aqui.
 *
 * `titulo` vira o `title` do iframe, que é o que o leitor de tela anuncia.
 * `altura` é a do iframe ao inserir; sem ela, 450px. Modelo com barra de
 * ferramentas e cartão (os que usam `_base.js`) pede mais.
 *
 * `_base.js` não entra na lista: é o visualizador comum, não um modelo.
 */
export type Modelo3D = {
  arquivo: string
  titulo: string
  altura?: number
}

export const MODELOS_3D: Modelo3D[] = [
  { arquivo: 'celula.html', titulo: 'Célula animal e vegetal em 3D', altura: 560 },
  { arquivo: 'agua.html', titulo: 'Molécula de água em 3D' },
  { arquivo: 'coracao.html', titulo: 'Coração humano em 3D' },
]

/** Pasta pública dos modelos. O nó do editor só reconhece iframe que aponta para cá. */
export const PASTA_MODELOS_3D = '/modelos-3d/'

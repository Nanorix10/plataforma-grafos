/**
 * Converte a imagem para WebP e a reduz ANTES de subir.
 *
 * Um print colado entrava como o PNG cru, de até 5 MB, e era isso que o aluno
 * baixava no celular — enquanto as imagens que vêm com as migrations já moram
 * em `public/img/resumos/` em WebP (decisão 9c). Agora as duas origens chegam
 * no mesmo formato.
 *
 * Roda no navegador, num `<canvas>`: o upload passa por server action
 * (decisão 11b), e converter lá exigiria uma biblioteca nativa no servidor só
 * para isso. O navegador já sabe decodificar e codificar WebP.
 *
 * O que fica de fora, de propósito:
 * - **GIF**, que pode ser animado — o canvas guardaria só o primeiro quadro;
 * - **SVG**, que é vetor e já é leve; rasterizar pioraria as duas coisas.
 *
 * Em qualquer falha (navegador sem codificador WebP, arquivo que não
 * decodifica) o arquivo original sobe como antes: otimizar é ganho, nunca
 * motivo para recusar uma imagem.
 */

/** O dobro da folha (920px, `lib/pagina.ts`): nítida em tela de alta densidade
 * mesmo quando a figura sai das margens e ocupa a folha inteira. */
const LADO_MAXIMO = 1840

/** A mesma qualidade das imagens das migrations (skill `rascunhar-resumo`). */
const QUALIDADE = 0.82

const CONVERTE = ['image/png', 'image/jpeg', 'image/webp']

export async function otimizarImagem(original: File): Promise<File> {
  if (!CONVERTE.includes(original.type)) return original
  try {
    const bmp = await createImageBitmap(original)
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bmp.width, bmp.height))
    const l = Math.max(1, Math.round(bmp.width * escala))
    const a = Math.max(1, Math.round(bmp.height * escala))

    const tela = document.createElement('canvas')
    tela.width = l
    tela.height = a
    const ctx = tela.getContext('2d')
    if (!ctx) {
      bmp.close()
      return original
    }
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bmp, 0, 0, l, a)
    bmp.close()

    const blob = await new Promise<Blob | null>((ok) => tela.toBlob(ok, 'image/webp', QUALIDADE))
    // Navegador sem codificador WebP devolve PNG em silêncio: aí não há ganho.
    if (!blob || blob.type !== 'image/webp') return original
    // Sem redução de tamanho e sem ganho de bytes, o original é melhor.
    if (escala === 1 && blob.size >= original.size) return original

    const nome = original.name.replace(/\.[^.]+$/, '') || 'imagem'
    return new File([blob], `${nome}.webp`, { type: 'image/webp' })
  } catch {
    return original
  }
}

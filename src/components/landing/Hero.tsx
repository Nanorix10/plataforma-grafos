import { MATERIAS } from '@/lib/materias'
import Grafo from '@/components/marca/Grafo'

/**
 * O cartão-resposta do hero — bolhas de múltipla escolha, uma por matéria.
 *
 * É o motivo de marca mais diferenciado que o produto tem: nenhum concorrente
 * do nicho usa a linguagem visual da prova em si. Fica onde estava; o que muda
 * é que agora ele divide a tela com o grafo, e os dois juntos dizem as duas
 * metades do produto — "isto é vestibular" e "isto é interligado".
 */
const CARTAO_RESPOSTA = [
  { num: '01', label: 'Biologia — PAS UEM', marcada: 0, cor: MATERIAS.biologia.cor },
  { num: '02', label: 'Química — PASSE UFMS', marcada: 0, cor: MATERIAS.quimica.cor },
  { num: '03', label: 'Matemática — PAS UnB', marcada: 1, cor: MATERIAS.matematica.cor },
  { num: '04', label: 'Geografia — PASSE UFMS', marcada: 2, cor: MATERIAS.geografia.cor },
  { num: '05', label: 'Literatura — PAS UEM', marcada: 0, cor: MATERIAS.literatura.cor },
  { num: '06', label: 'Física — PAS UnB', marcada: 2, cor: MATERIAS.fisica.cor },
]

export default function Hero() {
  return (
    /* `relative` + `overflow-hidden` seguram o grafo: ele é maior que o hero
       de propósito (a textura precisa sangrar para não parecer um quadro
       pendurado), e sem o corte ele criaria barra de rolagem horizontal. */
    <header className="relative overflow-hidden">
      {/* A mesma superfície do `/mapa`: `.quadro` é o fundo quadriculado que o
          mapa do produto já usa. A landing passa a pisar no mesmo chão que a
          ferramenta — consistência de marca que não custou token novo. */}
      <div aria-hidden="true" className="quadro absolute inset-0">
        <Grafo className="absolute inset-0 w-full h-full opacity-[0.38]" />
        {/* Esmaecimento até `--page` na base. Sem ele o grafo encosta na faixa
            azul-marinho da seção seguinte com uma borda dura, e o que era
            textura vira um bloco recortado. */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--page)]" />
      </div>

      <div className="relative max-w-[1120px] mx-auto px-8 pt-[var(--ritmo-secao)] pb-[var(--ritmo-secao)] grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-end">
        <div>
          <div className="rotulo-secao mb-4 text-[var(--acento-claro)]">
            Preparação PASSE · PAS-UEM · PAS-UnB
          </div>
          <h1 className="text-[length:var(--t-hero)] leading-[1.1] font-medium tracking-[-0.02em] mb-5 max-w-[640px]">
            Estude com quem já corrigiu a prova mil vezes.
          </h1>
          <p className="text-base leading-relaxed text-[var(--ink-dim)] max-w-[460px] mb-8">
            Resumos organizados por matéria e por processo seletivo, interligados
            entre si — lidos no próprio site, sem baixar nada e sempre na versão
            mais recente.
          </p>
          <div className="flex items-center gap-5 flex-wrap">
            <a href="#planos" className="botao botao-primario">
              Ver planos de acesso
            </a>
            <a
              href="#materias"
              className="text-sm underline underline-offset-[3px] decoration-[var(--ink-faint)] hover:decoration-[var(--ink)]"
            >
              Ver matérias disponíveis
            </a>
          </div>
        </div>

        <div className="bg-[var(--paper)] rounded-[var(--raio)] p-[1.375rem] shadow-[var(--sombra)]">
          <div className="rotulo-secao mb-3.5">Cartão-resposta</div>
          {CARTAO_RESPOSTA.map((linha) => (
            <div key={linha.num} className="flex items-center gap-3 py-2.5">
              <span className="text-[length:var(--t-mini)] text-[var(--ink-faint)] w-[18px]">
                {linha.num}
              </span>
              <span className="text-[length:var(--t-peq)] flex-1 text-[var(--ink-soft)]">
                {linha.label}
              </span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border"
                    style={
                      i === linha.marcada
                        ? { background: linha.cor, borderColor: 'transparent' }
                        : { borderColor: 'var(--line-forte)' }
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}

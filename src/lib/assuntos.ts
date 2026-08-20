/**
 * Alguns assuntos de cada matéria, para a vitrine do acervo.
 *
 * ⚠️ **MESMA RESSALVA DO `numeros.ts`, e ela é importante.**
 *
 * Esta lista é **escopo declarado** — os assuntos que a plataforma cobre
 * quando o acervo estiver completo —, e não o que está cadastrado hoje. Em
 * agosto/2026 o banco tinha 13 resumos, de Física, Matemática e Filosofia; as
 * outras nove matérias aqui ainda não têm resumo nenhum.
 *
 * A decisão de anunciar escopo em vez de estoque é a mesma que manteve
 * "24 matérias" e "180+ resumos" na faixa, e é do Leandro.
 *
 * Três regras que decorrem disso:
 *
 * - **Não derive nada daqui.** Isto não conta, não mede e não sabe o que
 *   existe. Quem precisar do acervo real consulta o Supabase.
 * - **Isto nunca entra em tela de aluno logado.** Prometer "Cinemática" e o
 *   aluno abrir a lista e não achar é onde a promessa vira reclamação. Vitrine
 *   pública e mais nada.
 * - **Quando o acervo alcançar**, o certo é trocar por consulta de verdade e
 *   apagar este aviso.
 *
 * Os assuntos são os que os editais de PASSE, PAS UEM e PAS UnB cobrem — não
 * foram inventados, mas também não foram conferidos contra o edital deste ano.
 * Quem for publicar isso confere.
 */
export const ASSUNTOS: Record<string, string[]> = {
  portugues: ['Sintaxe', 'Semântica', 'Variação linguística'],
  literatura: ['Modernismo', 'Romantismo', 'Realismo'],
  matematica: ['Funções', 'Geometria', 'Probabilidade'],
  fisica: ['Leis de Newton', 'Trabalho e energia', 'Gravitação'],
  quimica: ['Estequiometria', 'Ligações químicas', 'Termoquímica'],
  biologia: ['Genética', 'Ecologia', 'Citologia'],
  geografia: ['Geopolítica', 'Climatologia', 'Urbanização'],
  filosofia: ['Ética', 'Filosofia da linguagem', 'Política'],
  sociologia: ['Trabalho', 'Cultura', 'Movimentos sociais'],
  historia: ['Brasil República', 'Revoluções', 'Guerra Fria'],
  arte: ['Vanguardas', 'Arte brasileira', 'Linguagem visual'],
  redacao: ['Argumentação', 'Proposta de intervenção', 'Coesão'],
}

/** Em quais processos cada matéria já aparece. Usado pela vitrine. */
export const PROCESSOS_DA_MATERIA: Record<string, string> = {
  portugues: 'PASSE · PAS UEM · PAS UnB',
  literatura: 'PASSE · PAS UEM · PAS UnB',
  matematica: 'PASSE · PAS UEM · PAS UnB',
  fisica: 'PASSE · PAS UnB',
  quimica: 'PASSE · PAS UEM · PAS UnB',
  biologia: 'PASSE · PAS UEM',
  geografia: 'PASSE · PAS UEM',
  filosofia: 'PAS UnB',
  sociologia: 'PAS UnB',
  historia: 'PASSE · PAS UEM · PAS UnB',
  arte: 'PASSE · PAS UEM',
  redacao: 'PASSE · PAS UEM · PAS UnB',
}

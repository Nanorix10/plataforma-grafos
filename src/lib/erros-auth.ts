import type { AuthError } from '@supabase/supabase-js'

/**
 * Traduz o erro do Supabase para o que o ALUNO precisa fazer.
 *
 * Antes a tela mostrava `error.message` cru. O que chegava ao aluno era
 * "Invalid login credentials", "email rate limit exceeded", "missing email or
 * phone" — inglês de desenvolvedor, numa tela de vestibulando brasileiro, sem
 * dizer o que fazer a seguir. Erro que não diz o próximo passo é um beco.
 *
 * **A chave é o `code`, não a `message`.** A mensagem do Supabase é texto livre
 * em inglês e muda entre versões sem aviso; o código é contrato. Comparar
 * frase é o tipo de casamento que quebra em silêncio numa atualização de
 * dependência — e quebra pro lado ruim, voltando a vazar inglês pro aluno.
 *
 * Cobre os dois caminhos da tela de acesso (entrar e criar conta). Códigos de
 * SMS, MFA e SSO ficam de fora de propósito: o projeto não usa nenhum dos três,
 * e traduzir o que não pode acontecer é manutenção sem leitor.
 */
const POR_CODIGO: Record<string, string> = {
  // --- entrar ---
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed:
    'Falta confirmar seu e-mail. Abra o link que enviamos e depois entre.',
  user_banned: 'Esta conta está bloqueada. Fale com a gente para resolver.',

  // --- criar conta ---
  user_already_exists: 'Este e-mail já tem conta. Troque para "Entrar".',
  email_exists: 'Este e-mail já tem conta. Troque para "Entrar".',
  identity_already_exists: 'Este e-mail já tem conta. Troque para "Entrar".',
  weak_password: 'Senha fraca. Use pelo menos 6 caracteres.',
  email_address_invalid: 'Esse e-mail não parece válido. Confira a digitação.',
  signup_disabled: 'O cadastro está fechado no momento.',
  email_provider_disabled: 'O cadastro por e-mail está desligado no momento.',

  // --- limites ---
  over_email_send_rate_limit:
    'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  over_request_rate_limit:
    'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',

  // --- entrada malformada ---
  validation_failed: 'Preencha e-mail e senha para continuar.',
  captcha_failed: 'Não foi possível confirmar que você não é um robô. Tente de novo.',
}

/**
 * Reserva por status HTTP, para código que ainda não existia quando isto foi
 * escrito. Sem ela, um código novo cairia na frase genérica e o aluno perderia
 * a única pista útil que ainda dava para dar: se o problema é dele ou nosso.
 */
const POR_STATUS: Record<number, string> = {
  429: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  500: 'Nosso servidor falhou. Tente de novo em instantes.',
  502: 'Nosso servidor falhou. Tente de novo em instantes.',
  503: 'Nosso servidor falhou. Tente de novo em instantes.',
}

const GENERICO = 'Não deu para concluir. Tente de novo em instantes.'

export function mensagemDeErro(erro: AuthError): string {
  const traduzido =
    (erro.code && POR_CODIGO[erro.code]) ||
    (erro.status && POR_STATUS[erro.status]) ||
    null

  /* O original nunca é jogado fora — só sai da TELA e vai pro console. Quem
     depura precisa dele, e quem estuda não tem o que fazer com ele. Sem este
     `console.error`, um código novo do Supabase viraria "não deu para
     concluir" sem deixar rastro de qual era. */
  if (!traduzido) {
    console.error('[auth] erro sem tradução:', erro.code, erro.status, erro.message)
  }

  return traduzido ?? GENERICO
}

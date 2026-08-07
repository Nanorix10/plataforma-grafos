-- Definição breve de cada resumo.
--
-- Frase curta escrita à mão no editor, que aparece num balão ao passar o mouse
-- num nó do mapa de conexões. Serve pra dar contexto sem obrigar o aluno a
-- abrir o resumo inteiro.
--
-- Texto puro de propósito: o balão é pequeno, então formatação atrapalharia.
-- `default ''` e `not null` pra que os resumos já existentes fiquem com string
-- vazia em vez de null — quem não tem definição simplesmente não ganha balão,
-- e o código não precisa tratar dois casos diferentes de "vazio".

alter table resumos
  add column if not exists definicao text not null default '';

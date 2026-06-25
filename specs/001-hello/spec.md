# Spec: 001 — Hello World (base de layout, versão e loading)

## Contexto e problema
Precisamos validar e consolidar a base visual compartilhada por todas as telas
(layout, CSS e JS), expor a versão da aplicação de forma única (tela + logs) e
dar feedback de espera ao usuário em submissões, evitando cliques duplicados.

## Usuários e cenários
- Como visitante, quero abrir uma tela simples e enviar meu nome, recebendo uma
  saudação, para confirmar que a base funciona.
- Como desenvolvedor/operador, quero ver a versão da app na tela e no log de
  startup, para saber exatamente o que está no ar.
- Como usuário, ao enviar um formulário, quero feedback de "carregando" e o botão
  bloqueado, para não clicar duas vezes.

## Requisitos funcionais
- RF1: Tela pública `/hello` que usa o layout base (CSS/JS compartilhados).
- RF2: Footer presente em todas as telas exibindo nome e **versão** da app.
- RF3: A **mesma versão** é registrada no log quando a app sobe (startup).
- RF4: Em qualquer formulário, ao submeter, o botão de submit é desabilitado e
  mostra um indicador de "carregando" (com opt-out via `data-no-loading`).

## Regras de negócio
- RN1: A versão tem fonte única (build do Gradle); sem duplicação de string.

## Fora de escopo
- Persistência, autenticação da tela hello (é pública).

## Critérios de aceite
- [ ] `/hello` abre sem login, com layout, footer e versão.
- [ ] Log de startup contém a versão.
- [ ] Enviar o form bloqueia o botão e exibe o spinner.

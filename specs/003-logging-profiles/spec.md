# Spec: 003 — Logging por Profile (dev/test/prod)

## Contexto e problema
1. **Favicon 404**: Requisição `/favicon.ico` gera erro 404 no log, polui GlobalExceptionHandler.
2. **SQL logging**: Hibernate SQL debug aparece em todos os profiles; deve ser dev/test only.
3. **Prod limpo**: Produção não deve logar SQL detalhado (segurança + performance).

## Usuários e cenários
- Como desenvolvedor, quero ver SQL em dev/test para debugging.
- Como ops, não quero SQL logado em produção (segurança, ruído de log).
- Como usuário/browser, não quero erros de favicon poluindo logs.

## Requisitos funcionais
- RF1: `/favicon.ico` retorna 204 No Content (não erro 404).
- RF2: Hibernate SQL logging (`org.hibernate.SQL: DEBUG`) apenas em dev/test.
- RF3: `format_sql: true` apenas em dev.
- RF4: GlobalExceptionHandler não registra erros de favicon.

## Fora de escopo
- Adicionar favicon visual (pode ser vazio).
- Outras configurações de logging.

## Critérios de aceite
- [ ] Requisição `/favicon.ico` não gera erro 404 no log.
- [ ] Dev/test: `org.hibernate.SQL: DEBUG` logado (SQL visível).
- [ ] Prod: sem SQL debug logging.
- [ ] Sem `ERROR` no GlobalExceptionHandler para favicon.

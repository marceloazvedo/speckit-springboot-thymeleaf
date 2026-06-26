# Plan: 003 — Logging por Profile

## Abordagem

### 1. Favicon (404 silence)
- Adicionar `favicon.ico` vazio em `static/` (retorna 200 OK)
  OU silenciar erro em `GlobalExceptionHandler` para `NoResourceFoundException`

Escolha: **adicionar favicon vazio** (simples, evita exceção)

### 2. SQL Logging por profile
- `application.yml` (base): sem logging Hibernate SQL
- `application-dev.yml`: `org.hibernate.SQL: DEBUG`, `format_sql: true`
- `application-test.yml`: `org.hibernate.SQL: DEBUG`, `format_sql: false`
- `application-prod.yml`: nem criado (herda base, sem SQL)

## Arquivos a alterar
1. `static/favicon.ico` — criar vazio (ou 1x1 PNG)
2. `src/main/resources/application.yml` — remover `hibernate.SQL: DEBUG`
3. `src/main/resources/application-dev.yml` — mover SQL logging aqui
4. `src/main/resources/application-test.yml` — adicionar SQL logging
5. `src/main/resources/application-prod.yml` — criar (mesmo que vazio)

## Sequência
1. Criar favicon.ico vazio
2. Retirar SQL logging do application.yml base
3. Adicionar em dev + test profiles
4. Criar prod profile (vazio, herda base)
5. Testar em cada profile
6. Commit + PR

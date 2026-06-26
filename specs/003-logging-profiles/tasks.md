# Tasks: 003 — Logging por Profile

## Task 1: Criar favicon vazio
- [ ] Abrir/criar `app/src/main/resources/static/favicon.ico`
- [ ] Adicionar ícone vazio (ou copiar qualquer PNG 1x1)
  - Simples: arquivo vazio (0 bytes) funciona no navegador

## Task 2: Limpar application.yml base
- [ ] Abrir `app/src/main/resources/application.yml`
- [ ] Remover seção `logging.level.org.hibernate.SQL: DEBUG`
- [ ] Manter apenas configs comuns (datasource, flyway, jpa básico)

## Task 3: Adicionar logging em application-dev.yml
- [ ] Abrir `app/src/main/resources/application-dev.yml`
- [ ] Adicionar/atualizar:
  ```yaml
  logging:
    level:
      org.springframework.security: INFO
      org.hibernate.SQL: DEBUG
  spring:
    jpa:
      properties:
        hibernate:
          format_sql: true
  ```

## Task 4: Adicionar logging em application-test.yml
- [ ] Abrir `app/src/main/resources/application-test.yml`
- [ ] Adicionar seção logging com `org.hibernate.SQL: DEBUG`
- [ ] `format_sql: false` (testes não precisam formatação)

## Task 5: Criar application-prod.yml
- [ ] Criar `app/src/main/resources/application-prod.yml` vazio ou com comentário
- [ ] Herda tudo de application.yml (sem overrides)

## Task 6: Testar
- [ ] Dev: `bootRun -Dspring.profiles.active=dev` → SQL logado
- [ ] Test: roda testes → SQL logado
- [ ] (Prod não testável localmente, mas arquivo existe)
- [ ] Requisição `/favicon.ico` não gera 404 no log

## Task 7: Commit + PR
- [ ] Commit: "Adiciona logging por profile + favicon vazio"
- [ ] Push para `feature/novo-trabalho`
- [ ] Abrir PR

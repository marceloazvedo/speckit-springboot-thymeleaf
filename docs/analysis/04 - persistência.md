# 04 — Persistência

**Sumário:** Persistência **não implementada** — sem entidades, migrations ou repositórios em `app/`.
Modelo normativo: PostgreSQL, Flyway como fonte única do schema, `ddl-auto: validate`, entidade JPA
como domínio, repositórios como `port/` dentro de cada domínio (Art. I, III e VII).

## Estado real
- Entidades: **nenhuma**.
- Migrations Flyway: **nenhuma** (diretório `app/src/main/resources/db/migration/` inexistente).
- Repositórios: **nenhum**.

## Regras constitucionais
- Art. VII (`memory/constitution.md:35-37`): Flyway é a fonte do schema (`V1__`, `V2__`, ...), incluindo tabelas do Spring Session; proibido `ddl-auto` que altere schema — apenas `validate`.
- Art. III (`memory/constitution.md:20`): entidade JPA **é** o domínio; invariantes via fábrica no `companion object`.
- Art. IX (`memory/constitution.md:44-45`): persistência testada com Testcontainers (PostgreSQL real); **proibido mockar banco**.

## Planejado pela 000-foundation
### Migrations
- `V1__spring_session.sql` — tabelas `SPRING_SESSION` / `SPRING_SESSION_ATTRIBUTES` (`specs/000-foundation/plan.md:24-25`, task T3 em `specs/000-foundation/tasks.md:7`).

### Configuração JPA/Flyway (`specs/000-foundation/plan.md:17-22`)
- `spring.flyway.enabled: true`
- `spring.jpa.hibernate.ddl-auto: validate`
- `spring.session.jdbc.initialize-schema: never` (schema da sessão vem do Flyway, não do Spring Session)
- Datasource Postgres por env var; profile `local`.

### Entidades
- Apenas `shared/domain/BaseEntity.kt` (superclasse cross-cutting, task T4 em `specs/000-foundation/tasks.md:8`). Sem entidade de negócio na Feature 0.
- Primeira entidade real virá com `001-user` (`specs/000-foundation/spec.md:20`).

### Repositórios
- Nenhum na Feature 0. Convenção futura: `port/...Repository.kt` (Spring Data) dentro do pacote do domínio (`.specify/templates/plan-template.md:19-20`); cada feature traz sua migration `Vn__<descricao>.sql`.

### Testes de persistência
- `support/PostgresContainer.kt` (Testcontainers + Kotest) — `specs/000-foundation/plan.md:36`, task T8 (`specs/000-foundation/tasks.md:12`).

## Convenções para próximas features (template)
- T2: migration Flyway `Vn__...sql`; T3: repository (port) + teste Testcontainers (`.specify/templates/tasks-template.md:9-10`).
- Domínios não compartilham entidades; referência cruzada por `id` (`memory/constitution.md:22`) — em nível de schema, usar FK por id sem mapear associação JPA entre domínios distintos.

## Pontos de atenção
1. Numeração Flyway é global ao app: `V1__spring_session.sql` reserva o V1; features seguintes começam em `V2__`. Coordenar numeração entre branches para evitar colisão.
2. `initialize-schema: never` + `ddl-auto: validate` exigem que o Flyway rode antes; validar ordem de inicialização na implementação.
3. `BaseEntity.kt` não tem especificação de campos (id, auditoria?) — decidir na T4 e documentar aqui após implementação.

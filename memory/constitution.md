# Constituição do Projeto

Princípios invioláveis. Qualquer plano/spec/código que os viole deve ser corrigido.
Alterar exige emenda explícita (ver Governança no fim).

## Art. I — Stack fixada
Spring Boot 3 (última), Thymeleaf (última), jQuery (última), Bootstrap,
PostgreSQL, Spring Security, Spring Data JPA, Spring Session (JDBC/PostgreSQL).
Versões pinadas; troca exige emenda.

## Art. II — Plataforma
Kotlin sobre JVM 21. Virtual threads habilitados:
`spring.threads.virtual.enabled: true` no `application.yml`.

## Art. III — Arquitetura
Clean Architecture enxuta + pacote por domínio (vertical slice).
Fluxo: Controller → Facade → Service → port (Repository/Client/Publisher).
- Facade é a única porta de entrada do domínio e a fronteira `@Transactional`.
- Service = uma função pequena e específica (um verbo). Proibido "service gigante".
- Entidade JPA é o domínio; invariantes via fábrica no `companion object`.
- `shared/` só cross-cutting; `infra/` global só para adapters com IO externo.
- Domínios se comunicam por `id`/Facade, nunca importando a entidade do outro.

## Art. IV — SOLID & DRY
Controllers finos, regra em service/domínio, sem lógica em template.
Zero duplicação de fragmento Thymeleaf (usar `th:fragment`/layout).

## Art. V — Server-side rendering first
Thymeleaf renderiza. jQuery é progressive enhancement. Proibido SPA.

## Art. VI — Segurança por padrão
CSRF ligado. Autenticação obrigatória por padrão (allowlist explícita).
Sessão persistida no PostgreSQL via Spring Session JDBC.

## Art. VII — Persistência & migrations
Flyway é a fonte do schema (`V1__`, `V2__`, ...), incluindo as tabelas do
Spring Session. Proibido `ddl-auto` que altere schema (apenas `validate`).

## Art. VIII — Efeitos colaterais externos só após commit
E-mail, mensageria e chamadas externas disparam via evento de domínio +
`@TransactionalEventListener(phase = AFTER_COMMIT)`. Nunca dentro da transação.

## Art. IX — Disciplina de testes
Kotest + MockK. Persistência testada com Testcontainers (PostgreSQL real) —
proibido mockar banco. Todo controller tem teste `MockMvc`.

## Art. X — Idioma & estilo
Código em inglês; comentários e mensagens de commit em português.
ktlint obrigatório; build de CI falha em violação de estilo.

## Art. XI — Assets
jQuery e Bootstrap via WebJars (servidos pela JVM). Sem CDN externo
(coerência com a política de CSP do Spring Security).

## Art. XII — Configuração externa
Nada hardcoded. Configuração por profile em `application.yml`. Segredos por
variável de ambiente.

---
## Governança
- Versão: 1.0.0
- Emendas: alterar um artigo exige PR dedicado, justificativa e bump de versão.
- Em conflito, a constituição prevalece sobre qualquer plano ou preferência.

# Plano Técnico: 000 — Foundation

## Estrutura criada em app/
```
app/
├── build.gradle.kts        # Spring Boot 3, Kotlin, JVM21, plugins JPA/Spring,
│                           #   Flyway, WebJars, Kotest/MockK/Testcontainers, ktlint
├── settings.gradle.kts
└── src/main/kotlin/com/example/app/
    ├── AppApplication.kt
    └── shared/
        ├── config/ SecurityConfig.kt · SessionConfig.kt · WebConfig.kt
        ├── web/    HomeController.kt · GlobalExceptionHandler.kt · LayoutAdvice.kt
        └── domain/ BaseEntity.kt
```

## application.yml (pontos-chave)
- `spring.threads.virtual.enabled: true`
- `spring.session.store-type: jdbc` + `spring.session.jdbc.initialize-schema: never`
- `spring.flyway.enabled: true`
- `spring.jpa.hibernate.ddl-auto: validate`
- datasource Postgres por env var; profile `local`.

## Migrations Flyway
- `V1__spring_session.sql` — tabelas SPRING_SESSION / SPRING_SESSION_ATTRIBUTES.

## Segurança
- `SecurityConfig`: form login, CSRF on, `/` e webjars públicos, `/app/**` autenticado.
- Usuário bootstrap a partir do `application.yml` (temporário; substituído pela 001-user).

## Web / Thymeleaf
- `layout.html` + fragments `navbar.html`, `alerts.html` (Bootstrap via WebJars).
- `home.html`, `login.html`. `static/js/app.js` (jQuery).

## Testes
- `support/PostgresContainer.kt` (Testcontainers + Kotest).
- `HomeControllerTest` (MockMvc): `/` 200; `/app` redireciona p/ login.

## Checagem constitucional
- [x] Art. II virtual threads · [x] Art. VI segurança · [x] Art. VII Flyway/validate
- [x] Art. IX testes · [x] Art. XI WebJars

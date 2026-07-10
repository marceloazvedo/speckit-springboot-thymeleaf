# 02 — Arquitetura

**Sumário:** Arquitetura-alvo é Clean Architecture enxuta com pacote por domínio (vertical slice),
fluxo Controller → Facade → Service → port (Art. III). **Nada está implementado** — `app/` vazio.
Este documento consolida a arquitetura normativa para orientar a implementação da 000-foundation em diante.

## Estado real
- `app/` contém apenas `.gitkeep`. Não há camadas, pacotes nem classes para avaliar.
- Aderência à Clean Arch: **não aplicável ainda** (código zero). Nenhuma violação de código possível.
- Violação documental encontrada: ver seção "Desvios" abaixo.

## Arquitetura normativa (Art. III — `memory/constitution.md:15-22`)

### Fluxo por domínio
```
Controller → Facade (@Transactional) → Service (um verbo) → port (Repository/Client/Publisher)
```
- **Facade**: única porta de entrada do domínio; fronteira transacional (`memory/constitution.md:18`).
- **Service**: função pequena e específica, um verbo. Proibido "service gigante" (`memory/constitution.md:19`).
- **Entidade JPA é o domínio**; invariantes via fábrica no `companion object` (`memory/constitution.md:20`).
- **port**: interfaces de saída (Repository/Client/Publisher) dentro do domínio; implementações concretas com IO externo em `infra/` global (`memory/constitution.md:21`).
- **Comunicação entre domínios**: apenas por `id` e via Facade; proibido importar entidade de outro domínio (`memory/constitution.md:22`).

### Pacotes
- `app/src/main/kotlin/com/example/app/<dominio>/` — vertical slice por domínio (`.specify/templates/plan-template.md:6`).
- `shared/` — somente cross-cutting (config, `BaseEntity`); nunca regra de negócio (`memory/constitution.md:21`).
- `infra/` — somente adapters de saída com IO externo.

### Regras complementares
- SOLID & DRY: controllers finos, regra em service/domínio, sem lógica em template; zero duplicação de fragmento Thymeleaf (Art. IV, `memory/constitution.md:24-26`).
- SSR first: Thymeleaf renderiza; jQuery é progressive enhancement; proibido SPA (Art. V, `memory/constitution.md:28-29`).
- Efeitos externos (e-mail, mensageria, chamadas externas) somente via evento de domínio + `@TransactionalEventListener(phase = AFTER_COMMIT)` (Art. VIII, `memory/constitution.md:39-41`).

## Estrutura planejada pela 000-foundation (`specs/000-foundation/plan.md:3-15`)
```
app/
├── build.gradle.kts
├── settings.gradle.kts
└── src/main/kotlin/com/example/app/
    ├── AppApplication.kt
    └── shared/
        ├── config/ SecurityConfig.kt · SessionConfig.kt · WebConfig.kt
        ├── web/    HomeController.kt · GlobalExceptionHandler.kt · LayoutAdvice.kt
        └── domain/ BaseEntity.kt
```
Coerente com a constituição: a Feature 0 só cria `shared/` (cross-cutting), sem domínio de negócio —
o fluxo Facade/Service começa a valer a partir da `001-user`.

## Desvios encontrados (documentais)
1. **`specs/000-foundation/plan.md:6`** — comentário do `build.gradle.kts` menciona "Spring Boot 3".
   Contradiz Art. I pós-emenda 1.1.0 (`memory/constitution.md:7`, `memory/constitution.md:63`).
   Implementar com **Spring Boot 4**; a constituição prevalece (`memory/constitution.md:66`).
2. **`specs/000-foundation/plan.md:40-41`** — checklist constitucional já marcado `[x]` sem código existente.
   Marcações refletem o design do plano, não implementação verificada. Revalidar após implementar.
3. `HomeController` planejado em `shared/web/` (`specs/000-foundation/plan.md:13`) — aceitável para a Feature 0
   (página inicial sem regra de negócio), mas atenção: `shared/` não pode acumular controllers de domínio no futuro.

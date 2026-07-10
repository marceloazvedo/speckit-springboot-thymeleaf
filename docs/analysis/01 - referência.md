# 01 — Referência

**Sumário:** Repositório é um kit de Spec-Driven Development (SDD) para Spring Boot 4 + Thymeleaf em Kotlin.
Governança completa (constituição v1.1.0, specs, templates, scripts), porém **zero código implementado**:
`app/` contém apenas `.gitkeep`. Primeiro passo de desenvolvimento é a Feature `000-foundation`.

## Estado real do projeto

| Área | Estado |
|---|---|
| Governança SDD (`memory/`, `.specify/`, `specs/`) | Pronta |
| Constituição | v1.1.0 — `memory/constitution.md` |
| Feature 000-foundation (spec/plan/tasks) | Escrita, **não implementada** (todas as tasks em aberto — `specs/000-foundation/tasks.md:5-13`) |
| Código Spring Boot (`app/`) | **Inexistente** (`app/.gitkeep` apenas) |
| Migrations, testes, templates Thymeleaf | Inexistentes |

## Mapa do repositório
- `memory/constitution.md` — 12 artigos invioláveis; prevalece sobre planos (`memory/constitution.md:66`).
- `CLAUDE.md` — regras operacionais do agente (fluxo, proibições, convenções).
- `README.md` — fluxo SDD: constitution → /specify → /clarify → /plan → /tasks → /analyze → /implement (`README.md:7`).
- `.specify/templates/` — `spec-template.md`, `plan-template.md`, `tasks-template.md`.
- `.specify/scripts/create-feature.sh` — scaffold de nova feature; numera automaticamente (`001`, `002`, ...) e copia os 3 templates.
- `specs/000-foundation/` — Feature 0: esqueleto do app (spec, plan, tasks).
- `app/` — local obrigatório do projeto Spring Boot (`CLAUDE.md`, seção "Localização do código"). Vazio.
- `docs/analysis/` — esta documentação.
- `.claude/agents/`, `.claude/skills/`, `.agents/skills/`, `agent/skills/` — agentes e skills do tooling de IA (fora do escopo do app).

## Stack fixada (Art. I e II da constituição)
- Spring Boot 4 (última), Thymeleaf, jQuery, Bootstrap — `memory/constitution.md:6-9`.
- PostgreSQL, Spring Security, Spring Data JPA, Spring Session JDBC.
- Kotlin / JVM 21, virtual threads (`spring.threads.virtual.enabled: true`) — `memory/constitution.md:11-13`.
- Assets via WebJars, sem CDN externo — `memory/constitution.md:51-53`.

## Mapa de domínios
**Nenhum domínio existe ainda.** Planejados:
1. `000-foundation` — esqueleto (não é domínio de negócio): `shared/` + segurança + sessão + Flyway (`specs/000-foundation/spec.md`).
2. `001-user` — primeiro domínio real, referenciado como próximo passo em `specs/000-foundation/spec.md:20` e `specs/000-foundation/plan.md:29` (spec ainda não criada em `specs/`).

Convenção de pacotes futura: `app/src/main/kotlin/com/example/app/<dominio>/` (`.specify/templates/plan-template.md:6`).

## Como criar novas features
```
./.specify/scripts/create-feature.sh <nome-do-dominio>
```
Gera `specs/NNN-<nome>/{spec,plan,tasks}.md` a partir dos templates.

## Inconsistência conhecida
- `specs/000-foundation/plan.md:6` comenta "Spring Boot 3" no `build.gradle.kts`,
  mas a constituição v1.1.0 fixa **Spring Boot 4** (`memory/constitution.md:7`, emenda em `memory/constitution.md:63`).
  Na implementação, vale a constituição (`memory/constitution.md:66`). Detalhes em `05 - pendências.md`.

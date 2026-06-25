# Spec Kit — Spring Boot + Thymeleaf (Kotlin)

Kit de **Spec-Driven Development (SDD)** para apps Spring Boot 4 + Thymeleaf em Kotlin.
O código é consequência da spec, nunca o ponto de partida.

## Fluxo
constitution → /specify → /clarify → /plan → /tasks → /analyze → /implement

## Estrutura
- `memory/constitution.md` — regras invioláveis (stack, arquitetura, segurança)
- `CLAUDE.md` — como o agente de IA deve trabalhar
- `.specify/templates/` — modelos de spec, plan e tasks
- `.specify/scripts/create-feature.sh` — scaffold de uma nova feature
- `specs/000-foundation/` — esqueleto do app (Feature 0)
- `app/` — projeto Spring Boot (sempre aqui)
- `docs/analysis/` — saída do agente de análise inicial

## Começando
1. Rode a análise inicial (o agente pergunta na 1ª sessão).
2. Implemente a `000-foundation`.
3. Crie features: `./.specify/scripts/create-feature.sh user`

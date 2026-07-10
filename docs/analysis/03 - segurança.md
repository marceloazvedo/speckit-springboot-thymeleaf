# 03 — Segurança

**Sumário:** Segurança ainda **não implementada** (código zero em `app/`). Modelo normativo:
autenticação obrigatória por padrão com allowlist explícita, CSRF ligado, sessão persistida no
PostgreSQL via Spring Session JDBC (Art. VI). A 000-foundation define as primeiras rotas e o form login.

## Estado real
- Não existe `SecurityConfig.kt`, `SessionConfig.kt` nem `application.yml`. Tudo abaixo é o **plano** a implementar.

## Regras constitucionais (Art. VI — `memory/constitution.md:31-33`)
- CSRF **ligado**.
- Autenticação **obrigatória por padrão**; rotas públicas só via allowlist explícita.
- Sessão HTTP persistida no PostgreSQL via Spring Session JDBC.
- Complemento Art. XI (`memory/constitution.md:51-53`): assets via WebJars, sem CDN externo, coerente com política de CSP.

## Rotas planejadas (000-foundation)

| Rota | Acesso | Fonte |
|---|---|---|
| `/` | Pública | `specs/000-foundation/spec.md:25`, `specs/000-foundation/plan.md:28` |
| WebJars (assets) | Pública | `specs/000-foundation/plan.md:28` |
| `/app/**` | Autenticada | `specs/000-foundation/spec.md:25`, `specs/000-foundation/plan.md:28` |
| Login | Form login do Spring Security | `specs/000-foundation/spec.md:14` |

## Autenticação
- Form login do Spring Security com CSRF ativo (`specs/000-foundation/spec.md:14`).
- **Usuário bootstrap** definido no `application.yml` — explicitamente temporário, substituído pela feature `001-user` (`specs/000-foundation/plan.md:29`).

## Sessão JDBC
- `spring.session.store-type: jdbc` + `spring.session.jdbc.initialize-schema: never` (`specs/000-foundation/plan.md:19`).
- Tabelas `SPRING_SESSION` / `SPRING_SESSION_ATTRIBUTES` criadas por Flyway em `V1__spring_session.sql` (`specs/000-foundation/plan.md:24-25`), conforme Art. VII (`memory/constitution.md:36-37`).
- Critério de aceite: sessão sobrevive a restart (`specs/000-foundation/spec.md:26`).

## Configuração e segredos
- Art. XII (`memory/constitution.md:55-57`): nada hardcoded; configuração por profile em `application.yml`; segredos por variável de ambiente.
- Datasource Postgres por env var; profile `local` (`specs/000-foundation/plan.md:22`).

## Testes de segurança exigidos
- Teste de fumaça MockMvc: `/` retorna 200; `/app` redireciona para login (`specs/000-foundation/spec.md:27`, `specs/000-foundation/plan.md:37`).

## Pontos de atenção para a implementação
1. Garantir que a allowlist seja **mínima e explícita** (`/`, login, webjars, assets estáticos, página de erro) — qualquer rota nova nasce protegida.
2. Usuário bootstrap no `application.yml`: senha **deve** vir de variável de ambiente (Art. XII), nunca commitada.
3. Plan menciona política de CSP via Art. XI, mas não detalha headers CSP no `SecurityConfig` — definir na implementação.
4. Rota de logout e proteção CSRF no form de logout não estão especificadas — cobrir na implementação da T5 (`specs/000-foundation/tasks.md:9`).

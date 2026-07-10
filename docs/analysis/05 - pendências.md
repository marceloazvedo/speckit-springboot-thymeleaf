# 05 — Pendências

**Sumário:** Principal pendência é a implementação integral da Feature `000-foundation` (9 tasks abertas).
Uma inconsistência documental relevante: `plan.md` da 000-foundation cita "Spring Boot 3" enquanto a
constituição v1.1.0 fixa Spring Boot 4. Demais itens são lacunas de especificação e organização do repo.

## P1 — Inconsistências com a constituição

### P1.1 Spring Boot 3 vs 4 (alta prioridade)
- `specs/000-foundation/plan.md:6` — comentário do `build.gradle.kts`: "Spring Boot 3, Kotlin, JVM21, ...".
- Constituição v1.1.0 fixa **Spring Boot 4** (`memory/constitution.md:7`); emenda registrada em `memory/constitution.md:63` (3.5 é o último 3.x, EOL OSS 2026-06-30).
- Regra de conflito: constituição prevalece (`memory/constitution.md:66`).
- **Ação:** corrigir o plan.md (via feature branch + PR) e implementar T1 com Spring Boot 4.

### P1.2 Checklist constitucional pré-marcado
- `specs/000-foundation/plan.md:40-41` — Art. II, VI, VII, IX e XI marcados `[x]` sem nenhum código existente.
- Risco: falsa sensação de conformidade. **Ação:** tratar como "atendido pelo design"; revalidar cada item após implementação (critérios de aceite em `specs/000-foundation/spec.md:24-27` seguem `[ ]`, corretamente).

## P2 — Implementação pendente (código zero)
- `app/` contém apenas `.gitkeep`. Todas as 9 tasks da 000-foundation em aberto (`specs/000-foundation/tasks.md:5-13`):
  T1 Gradle/ktlint · T2 AppApplication + application.yml · T3 V1__spring_session.sql · T4 BaseEntity ·
  T5 SecurityConfig/SessionConfig/WebConfig · T6 HomeController/GlobalExceptionHandler/LayoutAdvice ·
  T7 templates + app.js · T8 Testcontainers + HomeControllerTest · T9 .editorconfig/ktlint.
- Feature `001-user` mencionada (`specs/000-foundation/spec.md:20`, `specs/000-foundation/plan.md:29`) mas sem diretório em `specs/` — criar com `./.specify/scripts/create-feature.sh user` quando chegar a hora.

## P3 — Lacunas de especificação (resolver na implementação da 000-foundation)
1. **CSP não detalhada** — Art. XI cita coerência com CSP (`memory/constitution.md:53`), mas o plan não define headers no `SecurityConfig` (`specs/000-foundation/plan.md:27-29`).
2. **Logout** — rota e CSRF do logout não especificados (spec cobre apenas login).
3. **Usuário bootstrap** — `specs/000-foundation/plan.md:29` prevê credenciais no `application.yml`; senha deve vir de env var (Art. XII, `memory/constitution.md:55-57`), nunca commitada.
4. **BaseEntity sem contrato** — campos (id, versão, auditoria) não especificados (`specs/000-foundation/plan.md:14`).
5. **Página de erro** — RF6 (`specs/000-foundation/spec.md:17`) sem template correspondente listado no plan (`specs/000-foundation/plan.md:31-33` lista só layout, navbar, alerts, home, login). Incluir `error.html` na T7.
6. **Versões pinadas** — Art. I exige versões pinadas (`memory/constitution.md:9`); plan não fixa versões de Gradle/Kotlin/deps. Definir na T1 (idealmente com version catalog).

## P4 — Organização do repositório (baixa prioridade)
1. **Skills duplicadas**: `.agents/skills/` e `agent/skills/` contêm o mesmo conjunto caveman (README/SKILL/scripts idênticos em ambos). Provável sobra de instalação; avaliar remover uma das cópias.
2. `docs/analysis/.gitkeep` pode ser removido agora que a pasta tem conteúdo.

## P5 — Riscos
| Risco | Impacto | Mitigação |
|---|---|---|
| Implementar T1 seguindo o plan desatualizado (Boot 3) | Retrabalho de upgrade + violação Art. I | Corrigir P1.1 antes de iniciar T1 |
| Spring Boot 4 recente: WebJars/Spring Session/Flyway com breaking changes vs guias de Boot 3 | Ajustes de config imprevistos | Validar starters e propriedades na doc oficial do Boot 4 durante T1/T2 |
| Colisão de numeração Flyway entre features paralelas | Falha de migration | V1 reservado à sessão; coordenar `Vn` por PR |
| Credencial bootstrap esquecida após 001-user | Backdoor em produção | Task explícita de remoção na 001-user |

## Ordem sugerida de ataque
1. PR corrigindo `specs/000-foundation/plan.md:6` (P1.1).
2. Implementar 000-foundation na ordem T1→T9, cobrindo lacunas do P3.
3. Revalidar checklist constitucional do plan e critérios de aceite da spec.
4. Atualizar estes documentos (`docs/analysis/`) — os docs 02–04 hoje descrevem o estado normativo/planejado e devem passar a refletir o código real.

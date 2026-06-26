# Plan: 004 — Obra CRUD

## Arquitetura
Clean Arch: Controller → Facade → Service → Repository
- **Domínio:** `Obra.kt` (entidade JPA, invariantes)
- **Service:** `CreateObra.kt` (one-verb, validação, persistência)
- **Facade:** `ObraFacade.kt` (orquestração @Transactional)
- **Controller:** `ObraController.kt` (GET/POST /app/obras)
- **Repository:** `ObraRepository.kt` (Spring Data port)
- **Templates:** `fragments/sidebar.html`, `obra/list.html`, `obra/create.html`

## Fluxo
1. User logado acessa `/app` → sidebar renderizado em `layout.html`
2. Clica "Obras" → GET `/app/obras` → listagem
3. Clica "Nova Obra" → POST form → ObraController → ObraFacade → CreateObra → ObraRepository
4. Validação em Service + HTML5 (client)
5. Obra persistida + redireciona para listagem

## Arquivos a criar/alterar
**Criar:**
- `app/src/main/kotlin/br/com/custocasa/obra/domain/Obra.kt`
- `app/src/main/kotlin/br/com/custocasa/obra/port/ObraRepository.kt`
- `app/src/main/kotlin/br/com/custocasa/obra/service/CreateObra.kt`
- `app/src/main/kotlin/br/com/custocasa/obra/ObraFacade.kt`
- `app/src/main/kotlin/br/com/custocasa/obra/ObraController.kt`
- `app/src/main/resources/db/migration/V3__obras.sql` (tabela)
- `app/src/main/resources/templates/fragments/sidebar.html`
- `app/src/main/resources/templates/obra/list.html`
- `app/src/main/resources/templates/obra/create.html`

**Alterar:**
- `app/src/main/resources/templates/layout.html` (incluir sidebar)
- `app/src/main/resources/templates/dashboard.html` (usar sidebar)

## Sequência
1. Criar Obra entity + invariantes
2. Criar ObraRepository (Spring Data)
3. Criar CreateObra service (validação)
4. Criar ObraFacade (@Transactional)
5. Criar ObraController (GET /list, POST /create)
6. Criar V3__obras.sql migration
7. Criar templates (sidebar, list, create)
8. Testar em navegador (cadastro + listagem)
9. Commit + PR

# Tasks: 004 — Obra CRUD

## Task 1: Criar Obra entity
- [ ] Criar `app/src/main/kotlin/br/com/custocasa/obra/domain/Obra.kt`
- [ ] Estender `BaseEntity` (id, createdAt, updatedAt automáticos)
- [ ] Campos: `userId: UUID`, `nome: String`, `custoPrevisto: BigDecimal`, `dataInicio: LocalDate`, `dataFimPrevista: LocalDate`
- [ ] Invariantes: nome não-vazio, datas lógicas (início < fim)
- [ ] Fábrica: `Obra.create(userId, nome, custo, dataInicio, dataFim): Obra`

## Task 2: Criar ObraRepository
- [ ] Criar `app/src/main/kotlin/br/com/custocasa/obra/port/ObraRepository.kt`
- [ ] `JpaRepository<Obra, UUID>`
- [ ] `fun findByUserId(userId: UUID): List<Obra>`

## Task 3: Criar CreateObra service
- [ ] Criar `app/src/main/kotlin/br/com/custocasa/obra/service/CreateObra.kt`
- [ ] `execute(command: CreateObraCommand): Obra`
- [ ] Validação: nome não-vazio, datas lógicas
- [ ] Persiste via `obraRepository.save()`
- [ ] Exceptions: `InvalidObraException`

## Task 4: Criar ObraFacade
- [ ] Criar `app/src/main/kotlin/br/com/custocasa/obra/ObraFacade.kt`
- [ ] `@Service`, `@Transactional`
- [ ] `create(command): Obra` → delega a CreateObra
- [ ] `listByUser(userId): List<Obra>` → ObraRepository

## Task 5: Criar ObraController
- [ ] Criar `app/src/main/kotlin/br/com/custocasa/obra/ObraController.kt`
- [ ] `GET /app/obras` → listagem (model com obras + username)
- [ ] `GET /app/obras/create` → form vazio
- [ ] `POST /app/obras/create` → valida + cria + redireciona para listagem
- [ ] Use `authentication.name` para get userId (do username)

## Task 6: Criar V3__obras.sql
- [ ] Criar migration com tabela `obras`
- [ ] Colunas: id, user_id, nome, custo_previsto, data_inicio, data_fim_prevista, created_at, updated_at
- [ ] FK: `user_id → users.id`
- [ ] Index: `user_id`

## Task 7: Criar sidebar
- [ ] Criar `app/src/main/resources/templates/fragments/sidebar.html`
- [ ] Menu com links: "Obras" → `/app/obras`
- [ ] CSS: sidebar vertical na esquerda, com navegação
- [ ] Apareça apenas se autenticado (security check)

## Task 8: Criar templates de obra
- [ ] `app/src/main/resources/templates/obra/list.html` (layout + tabela de obras)
- [ ] `app/src/main/resources/templates/obra/create.html` (layout + form)
- [ ] Form com validation HTML5 (required, type=date, etc)

## Task 9: Alterar layout.html
- [ ] Incluir `<div layout:fragment="sidebar">` no layout
- [ ] Sidebar fica no topo de dashboard.html

## Task 10: Testar
- [ ] Login com usuário
- [ ] Acessa `/app/obras` → listagem (vazia)
- [ ] Clica "Nova Obra" → form
- [ ] Preenche e envia → sucesso
- [ ] Volta à listagem → obra aparece

## Task 11: Commit + PR
- [ ] Commit: "Implementa 004-obra-crud: menu sidebar + cadastro de obras"
- [ ] Push para `feature/nova-spec`
- [ ] Abrir PR

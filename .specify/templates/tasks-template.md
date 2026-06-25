# Tarefas: [NOME DA FEATURE]

Ordem de implementação. Cada tarefa tem teste. **Não rodar build/test sem ordem.**

## Domínio
- [ ] T1. Entidade + invariantes + teste Kotest da fábrica.

## Persistência
- [ ] T2. Migration Flyway `Vn__...sql`.
- [ ] T3. Repository (port) + teste Testcontainers.

## Aplicação
- [ ] T4. Service `<Verbo>` + teste Kotest/MockK.
- [ ] T5. Facade (`@Transactional`) orquestrando os services.

## Saída externa (se houver)
- [ ] T6. port + impl em infra/ + evento AFTER_COMMIT + teste.

## Web
- [ ] T7. Controller + form + teste MockMvc.
- [ ] T8. Views/fragments Thymeleaf + jQuery (se necessário).

## Fechamento
- [ ] T9. Atualizar `docs/analysis/` se a feature mudar a arquitetura.

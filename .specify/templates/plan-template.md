# Plano Técnico: [NOME DA FEATURE]

> O COMO. Vinculado à constituição e à arquitetura por domínio.

## Domínio(s) afetado(s)
Pacote(s): `app/src/main/kotlin/com/example/app/<dominio>/`

## Checagem constitucional
- [ ] Art. III arquitetura (Controller→Facade→Service→port)
- [ ] Art. VI segurança (rotas e auth definidas)
- [ ] Art. VIII efeitos externos só pós-commit (se houver)
- [ ] Art. IX testes (Kotest + Testcontainers + MockMvc)

## Domínio (entidade = domínio)
- Entidade(s) JPA, invariantes, fábrica no companion.
- Enums/value types.

## Persistência
- `port/...Repository.kt` (Spring Data) — queries necessárias.
- Migration Flyway: `Vn__<descricao>.sql`.

## Aplicação
- Facade (`@Transactional`): casos de uso e orquestração.
- Services (um verbo cada): liste cada um e sua responsabilidade.

## Saída externa (se houver)
- `port/...Client|Publisher.kt` + impl em `infra/...`.
- Evento de domínio + listener `AFTER_COMMIT`.

## Web (Thymeleaf)
- Controller, rotas, forms (DTO de borda).
- Views/fragments: `templates/<dominio>/...`. jQuery necessário?

## Segurança
- Rotas públicas vs autenticadas; roles.

## Testes
- Kotest (services/domínio) + MockK.
- Testcontainers (repositórios).
- MockMvc (controllers).

## Riscos / decisões em aberto
- ...

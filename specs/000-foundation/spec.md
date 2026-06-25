# Spec: 000 — Foundation (esqueleto do app)

## Contexto e problema
Toda feature futura precisa de um app Spring Boot base, seguro e rodável,
sobre o qual os domínios serão construídos. Esta é a Feature 0.

## Usuários e cenários
- Como desenvolvedor, quero subir o app base com layout, segurança e sessão no
  banco, para começar a implementar domínios sem reescrever infraestrutura.

## Requisitos funcionais
- RF1: App Spring Boot sobe na JVM 21 com virtual threads ativos.
- RF2: Página inicial pública renderizada com layout Bootstrap (WebJars).
- RF3: Área protegida exige login (form login do Spring Security, CSRF ativo).
- RF4: Sessão HTTP persistida no PostgreSQL (Spring Session JDBC).
- RF5: Schema versionado via Flyway (inclui tabelas do Spring Session).
- RF6: Tratamento global de erros com página amigável.

## Fora de escopo
- Domínio de usuário real (vem na feature `001-user`).
- Qualquer regra de negócio.

## Critérios de aceite
- [ ] App sobe com profile `local` apontando para Postgres.
- [ ] `/` pública; `/app/**` exige autenticação.
- [ ] Sessão sobrevive a restart (persistida no banco).
- [ ] Teste de fumaça (MockMvc) verde para `/` e redirecionamento de login.

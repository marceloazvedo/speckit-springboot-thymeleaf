# Plano Técnico: 001 — Hello World

## Domínio(s) afetado(s)
- `br.com.custocasa.hello` (novo slice)
- `br.com.custocasa.shared.version` (novo, cross-cutting da versão)
- `br.com.custocasa.shared.web` (LayoutAdvice) e base de templates/estáticos

## Checagem constitucional
- [x] Art. III arquitetura (Controller→Facade→Service)
- [x] Art. IV SOLID/DRY (versão com fonte única; base CSS/JS reaproveitada)
- [x] Art. V SSR + jQuery progressive enhancement (loading)
- [x] Art. IX testes (Kotest + MockMvc)
- **Exceção registrada:** o `HelloFacade` **não** usa `@Transactional` porque a
  feature não tem persistência nem IO. O Facade permanece como porta de entrada
  do domínio (Art. III); a fronteira transacional volta a valer quando houver banco.

## Versão (fonte única → tela + log)
- `build.gradle.kts`: `springBoot { buildInfo() }` gera `build-info.properties`.
- `VersionProvider`: lê `BuildProperties` de forma opcional (`ObjectProvider`),
  fallback `"dev"` quando ausente (ex.: testes de fatia).
- `StartupVersionLogger`: `ApplicationReadyEvent` → `log.info` com a versão.
- `LayoutAdvice`: `@ModelAttribute("appVersion")` e `currentYear` para o footer.

## Web (Thymeleaf)
- `fragments/footer.html` incluído no `layout.html` (todas as telas).
- `hello.html` (form de nome) + link no `navbar`.
- `app.js`: loading no submit (desabilita botão + spinner; opt-out `data-no-loading`;
  reabilita no `pageshow`).

## Aplicação
- `HelloController` (`GET`/`POST /hello`) → `HelloFacade.greet(name)` → `GreetVisitor.execute(name)`.

## Segurança
- `/hello` público (já coberto por allowlist do `SecurityConfig`? incluir `/hello`).

## Testes
- `HelloControllerTest` (Kotest `@WebMvcTest`): `GET /hello` 200; `POST /hello` 200 + modelo com saudação.
- Ajustar `HomeControllerTest` para importar `VersionProvider` (LayoutAdvice passou a depender dele).

## Riscos / decisões em aberto
- Versões de libs best-effort; validar no 1º build.

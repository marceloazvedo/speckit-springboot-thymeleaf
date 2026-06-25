# Tarefas: 001 — Hello World

**Não rodar build/test sem ordem explícita.**

## Versão
- [ ] T1. `build.gradle.kts`: `springBoot { buildInfo() }`.
- [ ] T2. `shared/version/VersionProvider.kt`.
- [ ] T3. `shared/version/StartupVersionLogger.kt`.
- [ ] T4. `LayoutAdvice`: + `appVersion` e `currentYear`.

## Base (layout / footer / loading)
- [ ] T5. `fragments/footer.html` + incluir no `layout.html`.
- [ ] T6. `app.js`: comportamento de loading no submit (+ opt-out e pageshow).
- [ ] T7. `custocasa.css`: ajuste do footer. `navbar.html`: link "Hello".

## Slice hello
- [ ] T8. `hello/service/GreetVisitor.kt`.
- [ ] T9. `hello/HelloFacade.kt` (sem @Transactional — ver plan).
- [ ] T10. `hello/HelloController.kt` + `templates/hello.html`.
- [ ] T11. `SecurityConfig`: liberar `/hello`.

## Testes
- [ ] T12. `hello/HelloControllerTest.kt` (Kotest @WebMvcTest).
- [ ] T13. Ajustar `HomeControllerTest` (importar `VersionProvider`).

# Tasks: 002 — Sticky Footer

## Task 1: Adicionar estilos Flexbox
- [ ] Abrir `app/src/main/resources/static/css/custocasa.css`
- [ ] Adicionar:
  ```css
  html, body {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  main {
    flex: 1;
  }
  ```
- [ ] Verificar se há conflito com estilos existentes (navbar, container padding)

## Task 2: Verificar structure HTML do layout
- [ ] Abrir `app/src/main/resources/templates/layout.html`
- [ ] Confirmar que tem tags semânticas: `<html>`, `<body>`, `<main>`, `<footer>`
- [ ] Se não tiver, adicionar (sem alterar conteúdo)

## Task 3: Testar em navegador
- [ ] Rodar app com `bootRun` profile dev
- [ ] Abrir `/` (página curta) → footer deve estar no bottom
- [ ] Abrir `/dashboard` ou página longa → footer segue scroll normal
- [ ] Testar em diferentes resoluções (DevTools responsive mode)
- [ ] Verificar mobile (375px), tablet (768px), desktop (1440px)

## Task 4: Commit + PR
- [ ] Commit: "Implementa sticky footer com Flexbox"
- [ ] Push para `feature/novo-trabalho`
- [ ] Abrir PR
- [ ] Aguardar aprovação

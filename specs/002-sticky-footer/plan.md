# Plan: 002 — Sticky Footer

## Abordagem
Usar **Flexbox** (CSS) no body/html para forçar footer para baixo:
- `html` + `body`: `display: flex; flex-direction: column; height: 100vh`
- `main` (conteúdo): `flex-grow: 1` (expande e empurra footer para baixo)
- `footer`: sem flex, colado ao fim

Vantagem: sem JS, sem fixed positioning, responsivo automático.

## Arquivos a alterar
1. `app/src/main/resources/static/css/custocasa.css` — adicionar estilos Flexbox
2. `app/src/main/resources/templates/layout.html` — verificar structure (main/footer tags)

## Arquivos a testar (não alterar)
- `app/src/main/resources/templates/home.html`
- `app/src/main/resources/templates/login.html`
- `app/src/main/resources/templates/dashboard.html`
- `app/src/main/resources/templates/user/register.html`

## Sequência
1. Adicionar CSS Flexbox em custocasa.css
2. Verificar layout.html tem tags semânticas (html > body > main + footer)
3. Testar em navegador (diferentes tamanhos de viewport)
4. Commit + PR

# Spec: 004 — Obra CRUD (menu + cadastro + listagem)

## Contexto e problema
CustoCasa precisa rastrear obras (projetos de construção/reforma). Usuários precisam
de um lugar centralizado (menu sidebar) para acessar a gestão de obras: cadastrar,
listar e gerenciar informações básicas (nome, custo previsto, datas).

## Usuários e cenários
- Como proprietário, quero cadastrar uma obra com nome, custo e prazos.
- Como usuário logado, quero ver todas as minhas obras em uma listagem.
- Como usuário, quero acessar essas funcionalidades via menu sidebar na página.

## Requisitos funcionais
- RF1: Sidebar (menu vertical) aparece em todas as páginas após login.
- RF2: Sidebar tem link "Obras" que leva para listagem de obras.
- RF3: Listagem de obras mostra: nome, custo previsto, datas (início/fim).
- RF4: Botão "Nova Obra" na listagem abre form de cadastro.
- RF5: Form de cadastro com campos: nome, custo previsto, data início, data fim.
- RF6: Validação: nome obrigatório, datas lógicas (início < fim).
- RF7: Obra é persistida no banco e associada ao usuário logado.

## Fora de escopo
- Edição/exclusão de obras (vira próxima spec).
- Relatórios ou análise de custos.
- Múltiplos usuários por obra.

## Critérios de aceite
- [ ] Sidebar renderizado em `/app` (página protegida).
- [ ] Sidebar tem link "Obras" → `/app/obras`.
- [ ] GET `/app/obras` lista obras do usuário logado (tabela ou cards).
- [ ] POST `/app/obras` cria nova obra (validação, persistência).
- [ ] Form HTML5 com validação client-side (datas, obrigatórios).
- [ ] Obra aparece na listagem imediatamente após criação.

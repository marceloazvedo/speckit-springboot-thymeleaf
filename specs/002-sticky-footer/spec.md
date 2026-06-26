# Spec: 002 — Sticky Footer (rodapé fixo na tela)

## Contexto e problema
O footer da página não permanece fixo na base da janela do navegador quando o
conteúdo é curto. Isso causa visual desagradável, deixando espaço em branco
entre o conteúdo e o rodapé.

## Usuários e cenários
- Como usuário, quero que o footer sempre fique na base da tela, mesmo quando
  a página tem pouco conteúdo.

## Requisitos funcionais
- RF1: Footer permanece fixo no rodapé da viewport quando conteúdo < viewport height.
- RF2: Footer não sobrepõe conteúdo quando página é longa (scroll normal).
- RF3: Layout responsivo: funciona em desktop, tablet, mobile.

## Fora de escopo
- Alterações no conteúdo do footer.
- Mudanças na estrutura HTML do layout.

## Critérios de aceite
- [ ] Página curta (ex: /): footer colado no bottom sem espaço em branco.
- [ ] Página longa (ex: com muito conteúdo): footer segue scrollagem normal.
- [ ] Sem overflow, sem fixed positioning que quebre layout.
- [ ] Teste responsivo em mobile, tablet, desktop.

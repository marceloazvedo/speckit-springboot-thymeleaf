# Escopo — v1

Decisões tomadas no briefing de 2026-08-06. Este documento registra **o que entra, o que fica
de fora e por quê** — para que nenhuma decisão precise ser relitigada depois.

## Contexto

O CustoCasa em Kotlin/Spring Boot está no ar (`app.custocasa.com.br`), com tráfego pago rodando,
mas **os usuários se cadastram e param de usar**. Não é problema de stack — é de ativação.

A hipótese que orienta o produto novo: **na obra não tem sinal.** Se o app não abre em pé na loja
de material ou no meio do terreno, o hábito de lançar gasto nunca se forma. Por isso o
offline-first não é capricho técnico; é a aposta de ativação.

O escopo funcional vem da planilha que o desenvolvedor usa de verdade na obra dele — que hoje é
**mais completa que o sistema em produção**.

## Entra no v1

### Gasto
Os 14 campos da planilha real. O sistema atual só tem 11 — os quatro marcados com ✚ são
justamente os de controle que faltam, e são a razão de a planilha ainda existir.

| Campo | Observação |
|---|---|
| Data | |
| Descrição | obrigatório; com autocomplete dos itens já lançados |
| Unidade | lista (un, sc, m², m³, kg…) |
| Quantidade | |
| Valor unitário | |
| Valor total | |
| Fornecedor | |
| ✚ Está pago? | |
| ✚ Está entregue? | |
| ✚ Quantos entregues? | admite entrega parcial |
| Forma de pagamento | lista |
| Banco usado | lista |
| Observação | texto livre |

Quantidade, unidade e valor unitário ficam atrás de um "detalhar" — o caminho rápido é
data + descrição + valor, para o lançamento caber em 10 segundos no celular.

### Obra
Nome, tipo, orçamento, datas. Multi-tenant desde o início (`user_id` + `project_id`).

### Categorização
Lista única de categorias, tom sério, sem emoji.

### Autenticação
Sessão em cookie HttpOnly, senha com argon2id, sessão persistida no Postgres.

### Sync
Offline-first com o contrato descrito no [CLAUDE.md](CLAUDE.md).

## Fica de fora do v1

| Item | Motivo |
|---|---|
| **Foto da nota fiscal** | Binário de 2–5 MB não cabe na mesma fila de sync que linhas JSON. É onde esse tipo de app quebra. Se voltar, vem como fila de upload separada. |
| **Parcelamento** | Registrado como desejo, não como requisito. |
| **Anotações e Tarefas** | Eram fake door no sistema antigo (menu "Em breve" para medir demanda). Não são a causa do abandono. P2. |
| **Billing / assinatura** | Sem usuário ativo, cobrar não é o gargalo. |

## Por último

**Cadastro por polling** — o único componente a reaproveitar do legado: lead cai no Firestore,
um poller consome e dispara convite por magic link via fila. Fica para o fim do projeto.

## Pendências

- Fechar a taxonomia de etapas e tipos de insumo.
- Definir as listas fixas de unidade, forma de pagamento e banco.
- Decidir se fornecedor vira cadastro próprio (permite "quanto já paguei nesse fornecedor?")
  ou segue como texto com autocomplete.

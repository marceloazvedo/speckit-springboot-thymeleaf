# CustoCasa — Go + React (PWA offline-first)

SaaS de controle de custo de obra. Backend Go, frontend React como PWA instalável.
Produto **novo** — não é port do CustoCasa em Kotlin. Ver [ESCOPO.md](ESCOPO.md).

## Guard rails (invioláveis)

1. **Planejar antes de executar.** Apresente o plano e aguarde confirmação.
2. **Só gere ou altere arquivos após o "ok" explícito.** Nunca assuma que a autorização
   de um passo cobre o próximo.
3. **Nunca trabalhe direto na `main`.** Toda alteração nasce em `feature/<kebab-case>` e vira PR.
4. **Nunca faça merge de PR.** Abra e deixe aguardando revisão. O merge é sempre do desenvolvedor.
5. **Nunca suba o servidor** (`go run`, `npm run dev`, `docker compose up`). Subir a aplicação é
   responsabilidade do desenvolvedor. Para validar, use `go build`, `go vet`, `npm run build`
   e `npm run typecheck`.
6. **Nunca rode testes por conta própria.** Só sob comando explícito.
7. **Nunca `git add .`.** Stage seletivo, arquivo por arquivo. Se algo cheirar a segredo
   (`.env`, `*credentials*`, `*.pem`, chave de API), pare e avise antes.
8. **Segredo nunca entra no repositório** — nem como valor default. Toda credencial vem de
   variável de ambiente, sem fallback embutido no código ou no yaml.

### Repositório legado — somente leitura

O CustoCasa antigo vive em `../speckit-springboot-thymeleaf` (Kotlin/Spring Boot, em produção).
Serve como referência de domínio e de produto. **Nunca altere, builde, teste ou commite nada lá.**

## Stack

**Backend** — Go 1.25 · Gin · caarlos0/env · pgx/v5 · goose (migrations) · argon2id · testcontainers.
**Frontend** — React 19 · Vite 7 · TypeScript · Tailwind 4 · vite-plugin-pwa.
Estado com `useReducer` + Context persistido em `localStorage`. Sem lib de estado externa.

Trocar qualquer item da stack exige decisão explícita do desenvolvedor.

## Estrutura

```
backend-go/
  cmd/server/
  internal/
    domain/      tipos do negócio, sem dependência de framework ou banco
    auth/        sessão em cookie HttpOnly + argon2id
    obra/  gasto/    handler → service → port (um pacote por domínio)
    sync/        push/pull, cursor, resolução de conflito
    postgres/    pgx, transação, upsert, retry
    httpx/       middleware, rate limit, resposta e erro
  migrations/    goose, fonte única do schema
frontend-react/
  src/lib/       store, sync, api, storage, types
  src/components/
```

Regras:
- Um pacote por domínio (vertical slice). Domínios se falam por `id`, nunca importando
  o tipo interno do outro.
- `domain/` não conhece Fiber, pgx nem HTTP.
- `httpx/` e `postgres/` são cross-cutting — nunca contêm regra de negócio.
- Handler fino: valida entrada, chama service, formata resposta. Regra mora no service.

## Contrato de sincronizável

Offline-first: o app escreve local e a rede nunca é pré-requisito para lançar um gasto.
Toda tabela que sincroniza carrega estas colunas:

```sql
id          UUID PRIMARY KEY   -- gerado pelo CLIENTE, o que torna o push idempotente
user_id     UUID NOT NULL
created_at  TIMESTAMPTZ        -- relógio do cliente
updated_at  TIMESTAMPTZ        -- relógio do cliente; resolve conflito por last-write-wins
deleted_at  TIMESTAMPTZ        -- tombstone; NULL = vivo
change_seq  BIGINT DEFAULT nextval('change_seq')  -- relógio do servidor; é o cursor
```

`change_seq` vem de uma **SEQUENCE única compartilhada por todas as tabelas**, para que um
cursor só cubra o sync inteiro. Um `BIGSERIAL` por tabela criaria numerações independentes
e quebraria a propriedade.

Regras que não podem ser invertidas:
- **Push antes de pull.** No primeiro sync o servidor está vazio; puxar primeiro tratando a
  resposta como verdade apagaria os lançamentos locais.
- **O cursor só avança no pull.** O cursor devolvido pelo push pularia registros gravados por
  outro aparelho no meio.
- **Exclusão é lógica.** Apagar de fato não deixa nada para contar ao servidor, e o outro
  aparelho reenviaria o registro.

## Deploy

Origem única atrás do Caddy: `/api/*` vai para o container Go, o resto para o nginx que
serve o `dist/`. Sem CORS, cookie de sessão first-party — que é o arranjo que o Safari não quebra.

Os headers de cache do nginx não são detalhe: `sw.js`, `registerSW.js`, `manifest.webmanifest`
e `index.html` precisam revalidar sempre, senão o app instalado na tela de início congela numa
versão antiga e nunca mais enxerga um deploy. `/assets/*` tem hash no nome e é imutável.

## Convenções

- **Código em inglês. Commits e documentação em português.**
- **Comentário explica o *porquê*, nunca o *quê*.** Em TypeScript: nenhum comentário. Em Go: só doc comment
  de símbolo exportado (pacote, func, type, const). Decisão não óbvia, armadilha conhecida e invariante
  inline merecem comentário.
- Migrations são a fonte única do schema. Nada de criação de tabela em código.
- Teste de persistência roda contra Postgres real via testcontainers. **Proibido mockar banco.**
- `gofmt` e `go vet` limpos antes de qualquer PR.

## Fluxo de PR

Commit em português: primeira linha imperativa, corpo em bullets com o que mudou e por quê.
PR com `## Summary` e `## Test plan`. Passos manuais pós-merge (env var, config externa)
ganham seção própria.

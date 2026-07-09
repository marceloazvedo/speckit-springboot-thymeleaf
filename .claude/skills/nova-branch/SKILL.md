---
name: nova-branch
description: Inicia uma nova frente de trabalho no repositório — checkout na main, atualiza do remoto e cria uma feature branch. SEMPRE pergunta o nome da branch antes de criar. Use quando o usuário pedir para começar algo novo, criar branch, ou disser "vamos começar/fazer X".
---

# Nova Branch

Fluxo padrão para começar trabalho novo, respeitando a regra inviolável do projeto:
**nunca trabalhar direto na main/master — sempre feature branch → PR**.

## Passos (nesta ordem)

1. **Confirmar o repositório.** Padrão: `app/` (código Spring Boot). Se o trabalho for de
   governança (memory, specs, `.mcp.json`), usar a raiz. Na dúvida, perguntar.

2. **Ir para a main e atualizar do remoto:**
   ```bash
   git checkout main
   git fetch origin
   git reset --hard origin/main
   ```
   (Se houver trabalho local não commitado que deva ser preservado, avisar o usuário
   antes do `reset --hard`.)

3. **SEMPRE perguntar o nome da branch antes de criar.** Nunca inventar/assumir.
   Sugerir um nome no formato `feature/<algo-descritivo-em-kebab-case>` conforme o que
   o usuário quer fazer, mas esperar a confirmação/ajuste dele.

4. **Criar a branch:**
   ```bash
   git checkout -b feature/<nome-confirmado>
   ```

5. **Confirmar** a branch ativa e o último commit (`git log --oneline -1`).

## Regras

- **Nunca pular a pergunta do nome da branch** — é o ponto central desta skill.
- **Nunca criar a branch sem antes atualizar a main** com o remoto.
- **Prefixo `feature/` obrigatório** (convenção do projeto).
- Nunca fazer merge em main/master — isso é sempre do usuário, via PR.

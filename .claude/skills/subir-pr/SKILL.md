---
name: subir-pr
description: Commita o trabalho da branch atual, faz push para o remoto e abre a PR no GitHub. Usar quando o desenvolvedor mandar "subir" o trabalho concluído.
---

# Subir PR

Fluxo padrão para publicar o trabalho da branch atual: commit → push → PR.
Respeita a regra inviolável do projeto: **nunca commitar direto na main/master**.

## Pré-checagens (nesta ordem)

1. **Confirmar a branch atual** (`git branch --show-current`):
   - Se for `main`/`master`: **PARAR** e avisar — sugerir criar branch antes (skill `nova-branch`).
   - Deve ter prefixo `feature/`.
2. **Revisar o que vai subir** (`git status --short`):
   - Stage **seletivo** dos arquivos do trabalho — nunca `git add .` cego.
   - **Nunca** incluir: `target/`, chaves/credenciais (`*firebase-adminsdk*.json`,
     `localstack/secrets/`), `.env`, arquivos gerados.
   - Se aparecer arquivo suspeito de conter segredo, avisar o desenvolvedor antes.

## Passos

3. **Commit** (mensagem em português, convenção do projeto):
   - Primeira linha: resumo imperativo do que foi feito.
   - Corpo: bullets do que mudou e porquê (quando relevante).
   - Rodapé: `Co-Authored-By: Claude <modelo> <noreply@anthropic.com>`.
4. **Push** com upstream: `git push -u origin <branch>`.
5. **Abrir a PR** via `gh pr create`:
   - Título = resumo do commit.
   - Corpo: `## Summary` (o que e porquê) + `## Test plan` (checklist verificável).
   - Se houver passos manuais pós-merge (env vars, config externa), seção própria.
6. **Informar a URL da PR** ao desenvolvedor.

## Regras

- **Só executar quando o desenvolvedor mandar explicitamente** — nunca commitar por conta.
- Merge da PR é sempre do desenvolvedor — nunca mergear.
- Se já existir PR aberta para a branch, só commitar + push (a PR atualiza sozinha) e avisar.
- Commits em português; código em inglês (convenções do projeto).

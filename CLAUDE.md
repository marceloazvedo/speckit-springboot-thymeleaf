# Orientação do Agente — Spring Boot + Thymeleaf Spec Kit

## Projeto
App Spring Boot 4 + Thymeleaf em Kotlin (JVM 21, virtual threads).
Stack e regras: ver `memory/constitution.md` (fonte da verdade, inviolável).

## Localização do código
O projeto Spring Boot mora **SEMPRE** em `app/`. Caminhos: `app/src/main/kotlin/...`.
A governança (memory, .specify, specs, docs) fica na raiz.

## Fluxo de trabalho (obrigatório)
1. **Planejar antes de executar.** Apresente o plano e aguarde confirmação.
2. **Só execute (gerar/alterar arquivos) após o "ok" explícito do usuário.**
3. Nunca assuma autorização de um passo anterior para o próximo.

## Proibições
- **Nunca** rode build (`./gradlew build`), testes (`test`) ou `bootRun`
  por conta própria. Build e testes **somente** sob comando explícito.

## Convenções de código
- **Código em inglês**; **commits em português**.
- **Sem comentários no código.** O desenvolvedor é experiente; se precisar entender código, ele solicitará explicação.
- **ktlint** garante o estilo (rode só quando solicitado).

## Arquitetura (resumo; detalhe na constitution)
Clean Architecture enxuta + **pacote por domínio** (vertical slice):
`Controller → Facade (@Transactional) → Service (um verbo) → port (Repository/Client/Publisher)`.
- Entidade JPA **é** o domínio.
- `shared/` = cross-cutting (config, BaseEntity), nunca regra de negócio.
- `infra/` global = adapters de saída concretos (só quando há IO externo).
- Domínios não se referenciam por entidade; usam `id` e passam pelo Facade.

## Análise inicial
Se `docs/analysis/` estiver vazio, **pergunte ao desenvolvedor** se ele deseja
rodar a análise inicial (agente `initial-analysis`) antes de começar.
A saída são documentos numerados em `docs/analysis/` (`01 - referência.md`, ...).

## Caveman (objetividade)
Por padrão, responda em **caveman ultra** (comunicação comprimida, fragmentos,
sem filler). Skill em `.claude/skills/caveman/SKILL.md` (MIT, © 2026 Julius Brussee).
Valem as exceções de clareza do skill (avisos de segurança, confirmações de ações
irreversíveis, sequências multi-passo). Desligar: "normal mode".

### Instalação completa (primeira sessão)
Se `.claude/.caveman-setup-done` não existir, pergunte ao desenvolvedor se ele
deseja instalar o **caveman completo** (plugin + hooks globais: auto-ativação e
statusline) via:
  curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
Registre a decisão em `.claude/.caveman-setup-done` (não versionado) para não
perguntar de novo neste clone. A skill local já funciona sem o plugin.

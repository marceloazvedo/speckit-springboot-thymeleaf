---
name: agentes-criados
description: Registro de agentes customizados criados para este projeto e reutilizáveis
metadata:
  type: reference
---

# Agentes Customizados

## 1. growth-conversao
- **Arquivo**: `.claude/agents/growth-conversao.md`
- **Especialidade**: Growth/conversão, análise de funil, onboarding, priorização de experimentos
- **Contexto**: CustoCasa (SaaS controle de custos de obra)
- **Uso**: Quando analisar/refinar estratégia de ativação, descobrir fricção no funil, copy de e-mail

## 2. initial-analysis
- **Arquivo**: `.claude/agents/initial-analysis.md`
- **Especialidade**: Análise inicial de codebase, gera documentos em `docs/analysis/`
- **Uso**: Primeira sessão em um projeto (app/ vazio) ou quando fazer diagnóstico estruturado

## 3. product-spec-refinement (NEW)
- **Arquivo**: `.claude/agents/product-spec-refinement.md`
- **Especialidade**: Validação de specs (SDD), expansão de casos de uso, MVP scope, riscos, priorização
- **Genérico**: portável, sem acoplamento a um projeto específico
- **Uso**: Quando revisar/refinar spec antes de implementar, ou para priorizar roadmap
- **Entrada típica**: `Agent(subagent_type: "product-spec-refinement", prompt: "revise specs/NNN-feature/spec.md para viabilidade de produto, casos de uso, MVP scope. Contexto: [roadmap / análise anterior / arquitetura]")`
- **Saída**: relatório estruturado (validação, casos de uso expandidos, MVP scope, riscos, prioridade, próximos passos)

# 📅 Projeto: Migração do Catálogo de Serviços de TI para Azure/Angular com SSO Entra ID

## 🔖 Visão Geral

Este documento descreve a implementação de um novo Catálogo de Serviços de TI da empresa, migrando o conteúdo existente (hospedado atualmente no Vercel) para uma nova aplicação moderna baseada em tecnologias da Azure e Angular. A solução inclui autenticação via Entra ID, acesso baseado em perfis e recursos para edição de conteúdo e registro de leads/opportunities.

## 🔄 Stack Tecnológico

- **Frontend:** Angular + Ionic (UI)
- **Backend:** Azure Functions (.NET / C#)
- **Banco de Dados:** Cosmos DB (contêiner `content`)
- **Autenticação:** Entra ID (SSO)
- **Hospedagem:** Azure Static Web Apps + Azure Functions
- **Integração Contínua:** GitHub Actions

## ✅ Critérios de Aceitação

1. Conteúdo do catálogo migrado para a nova aplicação Angular na Azure.
2. Autenticação via Entra ID com acesso restrito a usuários da empresa.
3. Controle de acesso por perfil (grupo do Entra ID) para funcionalidades de edição.
4. CMS amigável para edição de conteúdo.
5. Tela para registro de ações comerciais e leads.
6. MVP estável publicado e acessível via navegador.

## 📓 Estrutura do App

- **Login:** via Entra ID
- **Home:** Apresentação do catálogo
- **Automatização (labs)**: lista de itens por área
- **Experiência em Clientes**: lista de itens por área
- **Tecnologias Avançadas**: lista de itens por área
- **Oportunidades**: tabela e formulário para registro
- **POCs**: tabela e formulário para registro

## 📂 Modelagem de Dados (Cosmos DB)

Container: `content`

- **Pages**: representação das seções principais do app
- **Items**: conteúdo vinculado a uma page (por idioma)
- **Opportunities**: registros de ações comerciais
- **POCs**: provas de conceito realizadas ou planejadas

Cada documento possui campos como:

```json
{
  "id": "automation_iot_en",
  "type": "item",
  "page": "automation",
  "key": "iot",
  "language": "en-US",
  "title": "Internet of Things",
  "description": "Smart devices working together."
}
```

## 🚀 API (Azure Functions)

| Método   | Rota                                            | Função                | Objetivo                     |
| -------- | ----------------------------------------------- | --------------------- | ---------------------------- |
| GET      | /api/pages                                      | GetPages              | Listar todas as páginas      |
| GET      | /api/pages/{pageKey}?lang=xx-XX                 | GetPageByKey          | Obter conteúdo de uma página |
| GET      | /api/pages/{pageKey}/items?lang=xx-XX           | GetItemsByPage        | Listar itens de uma página   |
| GET      | /api/pages/{pageKey}/items/{itemKey}?lang=xx-XX | GetItemByKey          | Obter um item específico     |
| POST     | /api/pages/{pageKey}/items                      | CreateItem            | Criar novo item              |
| PUT      | /api/pages/{pageKey}/items/{itemKey}            | UpdateItem            | Atualizar item existente     |
| DELETE   | /api/pages/{pageKey}/items/{itemKey}            | DeleteItem            | Remover item                 |
| GET/POST | /api/opportunities                              | OportunidadesFunction | CRUD de oportunidades        |
| GET/POST | /api/pocs                                       | POCsFunction          | CRUD de POCs                 |

## ⚙️ Segurança e Acesso

- **SSO (Single Sign-On):** via Entra ID com MSAL.js no Angular
- **Controle de Acesso (RBAC):** baseado em grupo no Entra ID (ex: `Catalogo-Editores`)
- **Funções Restritas:** Funções de edição disponíveis apenas para membros do grupo autorizado no Entra ID

## 🛠️ Processo de Deploy

1. Repositório GitHub (privado) com pipeline GitHub Actions
2. Azure Functions configurado com Deployment Center
3. Azure Static Web Apps para hospedar frontend Angular
4. Acesso autorizado à organização GitHub no portal Azure (OAuth Apps)
5. Secrets armazenados no GitHub e Azure (ex: string de conexão do Cosmos DB)

## 🌿 Boas Práticas Adotadas

- ✅ Segregação de responsabilidades (frontend/backend)
- ✅ Uso de arquitetura serverless com escalabilidade nativa
- ✅ Banco de dados NoSQL otimizado para leitura
- ✅ Versionamento via Git e CI/CD automatizado
- ✅ Acesso seguro via Entra ID com controle de roles/grupos
- ✅ Organização e estrutura clara de rotas e serviços por responsabilidades

## 📊 Planejamento e Estimativas

### Total: \~29 Pontos de Esforço (PE)

#### Sprint 1

- Descoberta & Planejamento
- Extração de Dados
- Configuração Azure
- Skeleton Angular
- Modelagem de Dados

#### Sprint 2

- Integração SSO Entra ID
- RBAC e grupos
- APIs Backend
- Frontend Visualização
- Migração de dados

#### Sprint 3

- Frontend UI Editor
- Tabela de Relatórios
- Testes & Correções
- Deploy & Documentação
- Demonstração e Feedback

## 📖 Histórias de Usuário

1. Como administrador de TI, quero migrar o catálogo para uma nova plataforma.
2. Como colaborador, quero acessar com minha conta (SSO) para segurança.
3. Como editor, quero editar os conteúdos com facilidade.
4. Como editor, quero registrar ações e leads para controle.
5. Como stakeholder, quero um MVP funcional publicado e documentado.

## 📗 Recomendações Futuras

- Avaliar uso de Application Insights para telemetria
- Considerar acessibilidade (WCAG) após MVP
- Integração com Power BI ou dashboards de acompanhamento
- Implementar cache de dados no frontend para otimizar chamadas repetidas
- Criar testes automatizados para regressão (Cypress / Playwright)
- Documentar estrutura e políticas de acesso via Entra ID de forma versionada no repositório

---

> Documentação criada por um time de engenharia comprometido com boas práticas, segurança e eficiência. Atualizações contínuas devem ser versionadas neste mesmo repositório.


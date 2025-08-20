Enabler: Automação da “Planilha B” a partir da “Planilha A” com Python + Power Automate + ServiceNow
Contexto e Problema

Hoje o processo de criação de solicitações de links de rede exige que o usuário forneça duas planilhas:

Planilha A (.xlsx): upload pelo usuário com dados-base.

Planilha B (.xlsx): versão enriquecida e com layout específico, exigida pela área operacional e anexada ao chamado no ServiceNow.

A geração da Planilha B é manual, sujeita a erros, demorada e não padronizada. Além disso, os arquivos podem conter múltiplas abas, o que aumenta a complexidade.

Objetivo do Enabler

Projetar e disponibilizar a base técnica (arquitetura, serviços, contratos e automações) para:

Transformar e enriquecer os dados da Planilha A (multi-aba) usando APIs externas.

Gerar automaticamente a Planilha B no layout exigido (ordem de colunas, nomes de abas, validações, estilos).

Permitir intervenção humana para preencher campos não automatizáveis antes da geração final.

Criar o ticket no ServiceNow, anexando a Planilha B final.

Escopo (deste Enabler)

Frontend (porta de entrada): Power Apps ou Web (React/Angular) para upload da Planilha A, visualização do rascunho da B e complementação de campos.

Orquestração: fluxos no Microsoft Power Automate (PA) para:

Chamar serviços Python (HTTP com OAuth).

Tratar rascunho/validações.

Criar registro no ServiceNow e anexar o .xlsx final.

Backend: microserviço Python (FastAPI) para:

Ler .xlsx multi-aba, mapear aliases de cabeçalhos, validar tipos e obrigatoriedades.

Enriquecer dados via APIs externas (batch, retries, cache opcional).

Mapear A→B por configuração (por aba).

Gerar Planilha B via template (.xltx), preservando layout/estilo.

Expor endpoints /transform, /validate, /finalize, /metadata.

Segurança e Operação:

Azure Key Vault (segredos), App Insights (telemetria), Storage (SharePoint/Blob).

Identidade/Autorização via Entra ID/Managed Identity.

Fora de Escopo (neste momento)

UI avançada com permissões/granularidade complexas.

Criação de catálogos ou formulários customizados no ServiceNow.

Suporte a formatos além de .xlsx (ex.: .csv) ou arquivos > X MB (definir limite).

Integração com outras plataformas de ITSM.

Fluxo de ponta a ponta (resumo)

Usuário faz upload da Planilha A (multi-aba).

PA salva o arquivo (SharePoint/Blob) e chama o FastAPI /transform.

Serviço ingere a planilha (todas as abas relevantes), valida cabeçalhos e tipos, chama APIs externas e gera rascunho da B (JSON + diagnóstico por célula; .xlsx opcional).

App exibe o rascunho, usuário complementa campos faltantes.

PA chama /validate; se sem violações, chama /finalize.

Serviço gera a Planilha B a partir do template (.xltx) e retorna URL segura.

PA cria o chamado no ServiceNow e anexa a Planilha B final.

Notificação ao solicitante (Teams/Email) com número do ticket.

Critérios de Aceite

 Upload de .xlsx com múltiplas abas suportado; seleção/detecção de abas pela presença de cabeçalhos esperados.

 Mapeamento A→B configurável (JSON): aliases de colunas, obrigatoriedades, regras por aba.

 Rascunho da B retornado em JSON com diagnóstico por linha/célula (MISSING/INVALID/WARNING).

 Validação final bloqueia geração se houver INVALID remanescente.

 Planilha B gerada idêntica ao template (nomes de abas, ordem de colunas, estilos/validações).

 Ticket no ServiceNow criado com a Planilha B anexada com sucesso.

 Logs e métricas em App Insights com Run ID correlacionando início-fim.

 Segredos e chaves no Key Vault; chamadas autenticadas via Entra ID/Managed Identity.

Requisitos Não Funcionais

Confiabilidade: retentativas e backoff nas chamadas a APIs externas; tolerância a timeouts parciais.

Desempenho: processar arquivos até N linhas em < T minutos (definir N/T).

Observabilidade: métricas (linhas processadas, tempo de enriquecimento, taxa de erro), logs estruturados (JSON).

Segurança: SAS de curto prazo para arquivos, princípio do menor privilégio, mascaramento de PII em logs.

Auditoria: “aba Log” na Planilha B (hash de origem, versão do serviço, data/hora, usuário).

Arquitetura e Tecnologias

Frontend: Power Apps (preferencial) ou React/Angular.

Orquestração: Power Automate (HTTP + conectores ServiceNow/Teams/Email).

Backend: Python FastAPI, pydantic, pandas, openpyxl/xlsxwriter, httpx (async), tenacity (retry).

Infra: Azure Functions/Container Apps, Azure Storage (Blob), SharePoint (opcional), Azure Key Vault, Application Insights, Redis (cache opcional).

Autenticação: Entra ID (OAuth 2.0) / Managed Identity.

Entregáveis deste Enabler

Especificação do mapeamento A→B (JSON) por aba.

Template oficial da Planilha B (.xltx) com validações/estilos.

Contrato de APIs do backend (OpenAPI) + exemplos.

Protótipo funcional do serviço /transform, /validate, /finalize.

Fluxos do Power Automate (Upload & Transform | Validate & Ticket).

Guia de Operação (runbook, limites, troubleshooting) e segurança (segredos/roles).

Plano de Testes

Unitários: validadores, mapeadores, clientes de API.

Integração: ingestão multi-aba, enriquecimento com mocks, geração do .xlsx final.

E2E: upload → rascunho → validação → finalize → ServiceNow (dev/sandbox).

Carga: arquivo grande (10k+ linhas) e medição de latência por etapa.

Riscos e Mitigações

Instabilidade/limite de APIs externas → fila, retentativas, cache, circuit breaker.

Variação de layout nas Planilhas A → tabela de aliases e detecção por cabeçalho.

Mudanças no layout da Planilha B → uso de template central versionado.

Falhas ao anexar no ServiceNow → reprocessamento automático/manual e DLQ (quarentena).

Dependências

Acesso/credenciais às APIs externas (contratos e limites).

Acesso ao ServiceNow (tabela/endpoint de criação + anexos).

Provisionamento de Key Vault / App Insights / Storage / Identidades.

Métricas de Sucesso (KPI)

% de campos preenchidos automaticamente (goal ≥ X%).

Tempo médio de processamento A→B (goal ≤ T).

Taxa de erro por etapa (ingestão, APIs, geração .xlsx, ServiceNow).

Satisfação do usuário (NPS interno) e redução de retrabalho.

Definição de Pronto (DoD)

Código versionado, pipeline com testes automatizados e lint.

Observabilidade ativa (logs/metrics/traces) e alertas básicos.

Documentação: contratos, template B, guia de operação e segurança.

Demonstração E2E aprovada com amostras reais (incluindo múltiplas abas).

Tarefas Sugeridas (quebrado em itens menores)

 Definir layout final da Planilha B e publicar template .xltx.

 Especificar mapeamentos por aba (A→B) e regras/aliases.

 Implementar /metadata e /transform (ingestão multi-aba + rascunho + diagnóstico).

 Implementar cliente das APIs externas (batch, retry, cache opcional).

 Implementar /validate e /finalize (geração .xlsx a partir do template).

 Montar Flow 1 (Upload & Transform) e Flow 2 (Validate & Ticket) no Power Automate.

 Integração com ServiceNow (criação do ticket + anexos).

 Observabilidade/segurança (Key Vault, App Insights, RBAC).

 Testes unitários, integração e E2E; ajuste de limites de performance.

 Documentar e realizar handover para o time de operação.

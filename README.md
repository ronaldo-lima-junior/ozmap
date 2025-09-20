# Serviço de Integração e Sincronização de Dados de Rede

Este repositório contém um serviço de backend, desenvolvido com **Node.js e TypeScript**, projetado para atuar como um middleware de integração entre um sistema de gerenciamento de ISP (provedor de internet) e a plataforma OZmap.

## Finalidade do Projeto

Muitos provedores de internet (ISPs) gerenciam sua infraestrutura de rede (como cabos de fibra óptica, caixas de atendimento e clientes conectados) em sistemas internos que nem sempre se comunicam com outras ferramentas essenciais.

Este serviço resolve esse problema atuando como uma ponte de dados automatizada. Ele extrai, transforma e carrega (ETL) informações de um sistema de origem para a plataforma OZmap, garantindo que a visualização da infraestrutura de rede esteja sempre atualizada e consistente.

Os principais objetivos e benefícios deste serviço são:

- **Automação:** Eliminar a necessidade de entrada manual de dados, reduzindo erros e economizando tempo.
    
- **Consistência dos Dados:** Manter a plataforma OZmap sincronizada com o sistema de origem, garantindo uma fonte única e confiável de informações sobre a rede.
    
- **Resiliência:** Lidar de forma inteligente com falhas de comunicação e limites de API, com um mecanismo de reprocessamento para garantir que nenhum dado seja perdido.
    
- **Escalabilidade:** Construído com uma arquitetura modular que permite a fácil adição de novas entidades para sincronização ou a adaptação a diferentes sistemas de origem.    

## Funcionalidades Principais ✅

- **Consulta Periódica:** Utiliza `node-cron` para buscar novos dados em intervalos configuráveis, operando em um processo filho (`child_process`) para não bloquear a thread principal.
    
- **Gerenciamento de Rate Limit:** Controla o fluxo de requisições à API de origem para respeitar o limite de 50 requisições por minuto, utilizando a biblioteca `bottleneck`.
    
- **Tratamento de Falhas e Reprocessamento:** Em caso de falhas no envio, o serviço registra o erro no MongoDB e garante que o item seja reprocessado na próxima execução.
    
- **Transformação de Dados:** Converte os dados do formato de origem para um padrão GeoJSON, mais robusto e ideal para a plataforma OZmap.
    
- **Logs Detalhados:** Utiliza `winston` para registrar todas as operações em arquivos e no console, facilitando a depuração e o monitoramento.
    
- **Ambiente Dockerizado:** O banco de dados MongoDB é facilmente gerenciado através de Docker e Docker Compose.
    

## Arquitetura da Solução ⚙️

A arquitetura foi projetada para ser modular e escalável:

1. **Scheduler:** O `node-cron` atua como gatilho, iniciando um **processo filho** (`worker.ts`) para realizar o trabalho pesado, mantendo o processo principal leve.
    
2. **Worker:** O `SyncService` orquestra todo o fluxo: busca, filtra (verificando o status no DB), transforma e envia os dados, tratando sucessos e falhas.
    
3. **Camada de Serviços:**
    
    - `IspService`: Comunica-se com a API de origem e gerencia o rate limiting.
        
    - `TransformationService`: Contém a lógica de conversão de dados.
        
    - `OzmapService (Mock)`: Simula a interface do SDK da OZmap, isolando o resto da aplicação dos detalhes de implementação do destino.
        
4. **Camada de Persistência:** O `Mongoose` é utilizado para modelar e persistir o estado de cada registro sincronizado no MongoDB.
    

## Tecnologias Utilizadas

- **Backend:** Node.js, TypeScript
    
- **Banco de Dados:** MongoDB (com Mongoose)
    
- **Ambiente:** Docker, Docker Compose
    
- **Bibliotecas Principais:**
    
    - `node-cron` (Agendamento de tarefas)
        
    - `bottleneck` (Rate Limiting)
        
    - `winston` (Logging)
        
    - `axios` (Requisições HTTP)
        
    - `json-server` (Mock da API)
## Pré-requisitos

Antes de começar, verifique que você tenha os seguintes softwares instalados na sua máquina:

- **Node.js:** v18 ou superior
    
- **NPM** (geralmente instalado com o Node.js)
    
- **Docker** e **Docker Compose**
---
## Passo a Passo para Execução

### 1. Configuração Inicial do Projeto

Primeiro, clone o repositório, entre na pasta do projeto e instale todas as dependências necessárias.

```
# 1. Clone o seu repositório
git clone https://github.com/ronaldo-lima-junior/ozmap.git

# 2. Entre na pasta do projeto
cd ozmap

# 3. Instale as dependências
npm install
```
---

### 2. Configure as Variáveis de Ambiente

Crie uma cópia do arquivo de exemplo `.env.example` para criar seu arquivo de configuração local `.env`. Os valores padrão já estão configurados para funcionar com o ambiente Docker.

```
cp .env.example .env
```
---
### 3. Inicie os Serviços (em 2 Terminais)

Para que o projeto funcione, você precisará rodar processos em **dois terminais separados** na pasta do projeto.

#### **No Terminal 1: Banco de Dados e Mock da API**

Este terminal irá subir o banco de dados em segundo plano e depois iniciar a API que simula o sistema do ISP.

```
# 1. Inicie o container do MongoDB (-d para rodar em background)
docker-compose up -d

# 2. Inicie o servidor da API
npm run mock:api
```

**➡️ Deixe este terminal aberto.** Ele estará servindo a API em `http://localhost:4000`.

---

#### **No Terminal 2: Aplicação Principal**

Este terminal irá compilar o código TypeScript e iniciar o serviço de sincronização.

```
# 1. Compile o código TypeScript para JavaScript (cria a pasta /build)
npm run build

# 2. Inicie a aplicação principal
npm start
```

**➡️ Monitore este terminal.** Você verá os logs indicando que o serviço foi iniciado. A primeira sincronização ocorrerá conforme o agendamento definido no arquivo `.env` (por padrão, a cada minuto).
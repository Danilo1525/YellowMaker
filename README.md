# YellowMaker

Sistema de gerenciamento de dashboards analíticos com arquitetura de microserviços.

## Arquitetura

- **Frontend**: React + Bun.js
- **Orchestrator**: Go (Golang)
- **Data Processor**: Python (FastAPI) + Pandas/DuckDB
- **Messaging**: Apache Kafka
- **Cache**: Redis
- **Database**: PostgreSQL (Metadata), DuckDB (Analytics)

## Pré-requisitos

- Docker & Docker Compose
- Bun (para desenvolvimento frontend local)
- Go 1.21+ (para desenvolvimento orchestrator local)
- Python 3.10+ (para desenvolvimento data-processor local)

## Como Rodar

1. **Clone o repositório**
2. **Inicie os serviços via Docker Compose**:
   ```bash
   docker-compose up --build
   ```

## Serviços

- **Frontend**: http://localhost:3000
- **Orchestrator API**: http://localhost:8080
- **Data Processor API**: http://localhost:8000/docs
- **Kafka UI** (se configurado): http://localhost:8081

## Estrutura do Projeto

- `frontend/`: Aplicação React
- `orchestrator/`: API Gateway e Lógica de Negócio em Go
- `data-processor/`: Motor de Análise em Python
- `shared/`: Schemas e Protos compartilhados

# Product Management

Sistema full stack de gerenciamento de produtos. O projeto entrega um CRUD completo com backend em Express + TypeScript, frontend em React + TypeScript, persistência em MySQL e uso de Docker Compose para provisionar o banco de dados.

## Tecnologias utilizadas

### Backend
- Node.js
- Express
- TypeScript
- mysql2
- Zod
- Dotenv
- ts-node-dev

### Frontend
- React
- TypeScript
- Vite
- Bootstrap

### Banco de dados
- MySQL

### Infraestrutura
- Docker
- Docker Compose

## Como instalar

### 1. Clonar o repositório

```bash
git clone https://github.com/iKelvinDev/product-management.git
cd product-management
```

### 2. Instalar dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

## Como configurar o ambiente

### Backend

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=product_management
```

### Frontend

Crie um arquivo `.env` dentro da pasta `frontend/`:

```env
VITE_API_URL=http://localhost:3001
```

## Banco de dados

O projeto utiliza **MySQL** para persistência dos dados.

A tabela principal da aplicação é criada automaticamente a partir do arquivo:

```txt
./mysql/init/01-schema.sql
```

Conteúdo do schema utilizado:

```sql
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Docker

Atualmente, o Docker Compose é usado para subir **apenas o banco de dados MySQL**. O backend e o frontend são executados separadamente na máquina local.

Para subir o banco:

```bash
docker compose up -d
```

Se for necessário recriar o banco do zero, use:

```bash
docker compose down -v
docker compose up -d
```

## Como rodar o backend

Depois de subir o banco com Docker, execute:

```bash
cd backend
npm run dev
```

O backend ficará disponível em:

```txt
http://localhost:3001
```

## Como rodar o frontend

Em outro terminal, execute:

```bash
cd frontend
npm run dev
```

O frontend ficará disponível em uma porta do Vite, normalmente:

```txt
http://localhost:5173
```

## Como acessar a aplicação

Com os três componentes prontos:
- MySQL rodando via Docker Compose
- Backend rodando localmente
- Frontend rodando localmente

A aplicação pode ser acessada em:
- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:3001`

## Rotas da API

### Listar produtos
```http
GET /products
```

### Buscar produto por ID
```http
GET /products/:id
```

### Criar produto
```http
POST /products
```

Exemplo de body:

```json
{
  "name": "Notebook X",
  "description": "Notebook para trabalho e estudos",
  "price": 3299.89,
  "category": "Electronics",
  "active": true
}
```

### Atualizar produto
```http
PUT /products/:id
```

### Remover produto
```http
DELETE /products/:id
```

## Funcionalidades

- Listagem de produtos
- Cadastro de produtos
- Edição de produtos
- Remoção de produtos
- Visualização de detalhes do produto
- Mensagens de sucesso, erro e carregamento
- Confirmação antes da exclusão

## Validação e tratamento de erros

No backend, os dados recebidos pela API passam por validação básica antes de serem processados. Também foram implementadas respostas HTTP adequadas e tratamento básico de erros para cenários como dados inválidos, recurso não encontrado e falhas internas.

No frontend, o sistema apresenta feedback visual para o usuário com mensagens de carregamento, sucesso, erro e confirmação antes da exclusão.

## Observações

- O projeto cobre o fluxo completo: Frontend → Requisição HTTP → API Backend → Dados → Resposta → Interface.
- A interface foi mantida simples e funcional.
- Atualmente, o Docker não sobe frontend e backend; ele sobe apenas o MySQL.
- Backend e frontend devem ser iniciados separadamente após a subida do banco.
- Após criar ou alterar arquivos `.env`, reinicie os servidores de desenvolvimento para garantir que as variáveis sejam carregadas corretamente.
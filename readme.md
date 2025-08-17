# SPS Test API - Desafio Técnico (Node.js + Express)

API RESTful para autenticação com JWT e CRUD de usuários usando armazenamento em memória. Projeto estruturado usando padrões Clean Architecture. Inclui rotas protegidas, validações, Swagger e testes e2e.

## ✨ Principais requisitos atendidos

Login seguro (POST /auth/login) com JWT (expiração configurável).

CRUD completo de usuários (/users).

Acesso restrito: todas as rotas (exceto login) exigem Bearer <token>.

Usuário admin seed: admin@sps.com / admin123 (hash com bcryptjs).

Armazenamento em memória (sem banco).

Documentação Swagger em /docs.

Testes de API (e2e) com Jest + supertest cobrindo fluxos principais.

## 🏗️ Arquitetura & Organização (Clean Architecture)
src/

  api/                # camada de entrega HTTP (Express)
  
    controllers/      # controladores finos (sem regra de negócio)
    middlewares/      # auth JWT, validação, etc.
    routes/           # definição das rotas
    
  application/        # casos de uso (regras de aplicação)
  
    use-cases/
    dtos/             # schemas para validação via middleware (zod)
    
  domain/             # erros de domínio
    errors/
    
  infrastructure/     # implementações de portas (repo, jwt, hash, config)
  
    persistence/      # repositório in-memory + seed
    security/         # jwt-token.service, bcrypt-hash.service
    config/           # carregamento e validação de env
    
  main/               # DI, app e inicialização
  
    container.js
    app.js
    index.js
    
docs/

  openapi.yaml        # spec OpenAPI/YAML
  
tests/                # testes (Jest + supertest)

  e2e/                # testes de ponta à ponta
  helpers/            # helper para instanciar o app

Fluxo de dependências: Routes → Controllers → Use Cases → Infra.

## 🧰 Stack & Decisões Técnicas

JWT: jsonwebtoken.

Hash: bcryptjs.

Validação: zod.

Docs: swagger-ui-express + openapi.yaml.

Testes: jest + supertest.

## ✅ Pré-requisitos

- **Node.js LTS**

- **npm**

### 🚀 Como rodar (dev)
### 1) Clonar e entrar
git clone ```https://github.com/Moreno1337/test-sps-server.git```

cd test-sps-server

### 2) Instalar dependências
npm install

### 4) Rodar em desenvolvimento
npm run dev

API: ```http://localhost:3000``` (porta padrão)

### 5) Healthcheck
```curl http://localhost:3000/health```

## 🧪 Testes

```npm test```

Testes e2e cobrem:
  - login OK/401
  - create 201/400
  - list 200
  - update 200 (inclui troca de senha e re-login)
  - delete 204/400
  - auth 401

## 📝 Documentação da API (Swagger)

UI: http://localhost:3000/docs

## 🔐 Segurança (resumo)

JWT com expiração (JWT_TTL) e verificação no middleware.

Senha sempre com hash (bcryptjs) — nunca armazenada em claro.

## ✅ Validação & Erros

Validação de entrada com Zod via middleware validate(schema).

## 🤝 Notas finais

O projeto prioriza separação de camadas, simplicidade e claridade para ser facilmente evoluído.

O README serve como guia rápido para avaliação e execução local.

Qualquer dúvida, abra uma issue ou entre em contato.

<h1 align="center">API de dados geográficos</h1>

<p align="center">
  Tecnologias utilizadas
</p>
<p align="center">
<img src="https://static-00.iconduck.com/assets.00/nestjs-icon-2048x2040-3rrvcej8.png" width="20px" alt="nestjs">
<img src="https://static-00.iconduck.com/assets.00/typescript-icon-icon-1024x1024-vh3pfez8.png" width="20px" alt="typescript">
<img src="https://cdn-icons-png.flaticon.com/512/5968/5968342.png" width="20px" alt="postgres">
<img src="https://static-00.iconduck.com/assets.00/swagger-icon-512x512-halz44im.png" width="20px" alt="swagger">
<img src="https://user-images.githubusercontent.com/30929568/112730670-de09a480-8f58-11eb-9875-0d9ebb87fbd6.png" width="20px" alt="typeorm">
</p>

## Configuração do Ambiente

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com a seguinte estrutura:

```env
# Configurações da API
NODE_ENV=production # Ou 'development' para ambiente de desenvolvimento
API_PORT=3000

# Configurações do Banco de Dados
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=123
DATABASE_PORT=5432
DATABASE_HOST=db # Ou 'localhost' para ambiente de desenvolvimento

# Segredo JWT
JWT_SECRET=secret

## Inicialização do projeto

```bash
$ npm install
```

## pgAdmin

Para acessar o pgAdmin, abra http://localhost:5050 no navegador. A porta padrão está configurada para 5050 no docker-compose.yml, mas pode ser alterada conforme necessário.
Utilize as credenciais abaixo:

```bash
email: admin@admin.com
senha: root
```



## Inicializando com Docker Compose

Utilize o docker-compose para inicializar os serviços necessários para o projeto.

````bash
docker-compose up -d --build # Para reconstruir e iniciar os containers
docker-compose up -d         # Para iniciar os containers
docker-compose down          # Para desligar os containers
````
Nesse caso não será necessário fazer as migrações do banco de dados, pois o docker-compose já faz isso.

Para visualizar os logs utilize o seguinte comando fora do container. (CTRL+C para sair)
```bash
docker logs app-1 -f
```


## Comandos de inicialização

Dentro do projeto, você pode utilizar os seguintes comandos:

```bash
npm run buid  # Compilar o projeto
npm run dev    # Iniciar em modo desenvolvimento
npm run prod   # Iniciar em modo produção
npm run start  # Iniciar com `nest start`
```

## Documentação
Para acessar a documentção da API, abra http://localhost:3000/api no navegador.

## Comandos de migração
Para gerenciar migrações do banco de dados:

```bash
npm run migration:run        # Executar migrações
npm run migration:generate   # Gerar novas migrações
npm run migration:create     # Criar migração
npm run migration:revert     # Reverter migração
npm run migration:show       # Mostrar migrações
```

Para adicionar as migrações ao Docker, execute o container temporário:
    
```bash 
docker-compose migration
```

## Testes

Para executar os testes, utilize o seguinte comando:

```bash
npm run test         # Executar testes unitários
npm run test:watch   # Executar testes em modo observação
```

## Lint

Para executar o lint, utilize o seguinte comando:

```bash
npm run lint
```



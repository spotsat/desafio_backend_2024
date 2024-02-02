<h1 align="center">API de dados geográficos</h1>

<p align="center">
<img src="https://static-00.iconduck.com/assets.00/nestjs-icon-2048x2040-3rrvcej8.png" width="20px" alt="nestjs">
<img src="https://static-00.iconduck.com/assets.00/typescript-icon-icon-1024x1024-vh3pfez8.png" width="20px" alt="typescript">
<img src="https://cdn-icons-png.flaticon.com/512/5968/5968342.png" width="20px" alt="postgres">
</p>

## Inicialização do projeto

```bash
$ npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

```bash
cp .env.example .env
```
No arquivo .env adicione as variáveis de ambiente necessárias. Se é para ambiente de produção ou deseolvimento. Para usar em produção, troque os valores de `NODE_ENV` e `DATABASE_HOST` para `production` e `host_do_banco` respectivamente.

## Inicializando com Docker Compose

Utilize o docker-compose para inicializar os serviços necessários para o projeto.
````bash
docker-compose up -d --build
````
ou
````bash
docker-compose up -d
````

Para criar migrações é necessário entrar no container da aplicação e executar o comando de migração.
```bash
docker exec -it desafio_backend_2024-app-1 /usr/src/app
```

Execute as migrations dentro do container para criar as tabelas no banco de dados.
```bash
npm run migration:run
```

Para visualizar os logs utilize o seguinte comando fora do container. (CTRL+C para sair)
```powershell
docker logs app-1 -f
```


## Comandos de inicialização
```bash
# development
$ npm run dev

# production mode
$ npm run prod
```

## Testes

```bash
# unit tests
$ npm run test
# unit tests watch
$ npm run test:watch





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
````
docker-compose up --build
````

Para acessar o container utilize o seguinte comando.
```powershell
docker exec -it app-1 /bin/bash
```

Para visualizar os logs utilize o seguinte comando fora do container. (CTRL+C para sair)
```powershell
docker logs app-1 -f
```

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test





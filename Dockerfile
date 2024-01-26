# Etapa 1: Construir a aplicação
FROM node:18-alpine as build
WORKDIR /usr/src/app

# Atualizar o npm para a última versão
RUN npm install -g npm@latest

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar arquivos do projeto
COPY . .

# Construir a aplicação
RUN npm run build

# Etapa 2: Executar a aplicação
FROM node:18-alpine
WORKDIR /usr/src/app

# Copiar pacotes e build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Expor a porta que a aplicação usa
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]

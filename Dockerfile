# Estágio 1: Construir a aplicação
FROM node:18-alpine as builder
WORKDIR /usr/src/app

# Atualizar o npm para a última versão
RUN npm install -g npm@latest

# Copiar os arquivos de definição de pacote e instalar as dependências
COPY package*.json ./
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio 2: Executar a aplicação
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]

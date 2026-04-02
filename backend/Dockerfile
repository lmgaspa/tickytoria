FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY src ./src
COPY tsconfig.json ./

# Compilar TypeScript
RUN npm run build

# Expor porta
EXPOSE 10000 9464

# Variários de ambiente
ENV NODE_ENV=production

# Iniciar aplicação
CMD ["npm", "start"]

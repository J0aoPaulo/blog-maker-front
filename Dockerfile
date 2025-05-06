  FROM node:18-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --ignore-scripts
  COPY . .
  RUN npm run build -- --configuration production   # produz dist/

  FROM node:18-alpine AS production
  WORKDIR /app
  # instala o servidor estático
  RUN npm install -g serve
  # copia apenas o dist gerado
  COPY --from=build /app/dist ./dist
  EXPOSE 4000
  # serve dist/ na porta 4000
  CMD ["node","dist/server/main.js"]
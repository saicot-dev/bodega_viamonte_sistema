# ---- Stage 1: build de la SPA (Vite) ----
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias con el lockfile (build reproducible)
COPY package*.json ./
RUN npm ci

# Copiar el resto del código y compilar (salida en /app/dist)
COPY . .
RUN npm run build

# ---- Stage 2: servir los estáticos con nginx ----
FROM nginx:1.27-alpine

# Reemplazar la config default de nginx por la nuestra (routing SPA + cache)
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build estático
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

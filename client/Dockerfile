# Etapa 1: Construcción
FROM node:20 as build
WORKDIR /app

ARG API_HOST
ARG API_BASE
ARG API_PORT

ENV VITE_API_HOST=$API_HOST
ENV VITE_API_BASE=$API_BASE
ENV VITE_API_PORT=$API_PORT

COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# Usamos la ruta completa para evitar el error "not found"
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
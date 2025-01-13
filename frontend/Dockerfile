# Usa una imagen base de Node
FROM node:20

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de proyecto
COPY package*.json ./

RUN npm install -g npm@11.0.0

# Instala dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto 8080
EXPOSE 8080

# Comando para iniciar el servidor de desarrollo
CMD ["npm", "run", "dev"]
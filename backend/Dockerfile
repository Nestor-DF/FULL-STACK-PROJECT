# Usa una imagen base de Node.js
FROM node:20

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

RUN npm install -g npm@11.0.0

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto del servidor
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["sh", "-c", "node setup.js && npm start"]

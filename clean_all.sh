#!/bin/bash

# ./clean_all.sh
# Da permisos de ejecución al script o ejecútalo como sudo

# Detener todos los contenedores
echo "Deteniendo todos los contenedores..."
docker stop $(docker ps -aq)

# Eliminar todos los contenedores
echo "Eliminando todos los contenedores..."
docker rm $(docker ps -aq)

# Eliminar todas las imágenes
echo "Eliminando todas las imágenes..."
docker rmi $(docker images -q)

# Limpiar volúmenes y recursos no utilizados
echo "Limpiando recursos no utilizados..."
docker system prune -a --volumes -f
docker volume rm $(docker volume ls -q)

# # Construir y levantar los servicios con docker-compose
# echo "Ejecutando docker-compose up --build..."
# docker-compose up --build
#!/bin/bash

# ./reset.sh
# Da permisos de ejecución al script o ejecútalo como sudo

docker-compose down --volumes

docker volume prune

docker-compose up --build
#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}======================================${NC}"
echo -e "${GREEN}  Iniciando entorno de desarrollo Chat  ${NC}"
echo -e "${YELLOW}======================================${NC}"

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Error: Docker y/o Docker Compose no están instalados${NC}"
  echo "Por favor instale Docker y Docker Compose primero"
  exit 1
fi

# Detener contenedores existentes (sin borrar volúmenes)
echo -e "${YELLOW}Deteniendo contenedores existentes...${NC}"
docker-compose down

# Construir las imágenes
echo -e "${YELLOW}Construyendo imágenes...${NC}"
docker-compose build --no-cache

# Iniciar los servicios
echo -e "${YELLOW}Iniciando servicios...${NC}"
docker-compose up -d

# Verificar que los servicios están corriendo
echo -e "${YELLOW}Verificando servicios...${NC}"
docker-compose ps

echo -e "${GREEN}Entorno iniciado correctamente${NC}"
echo -e "${YELLOW}======================================${NC}"
echo -e "${GREEN}INSTRUCCIONES DE ACCESO:${NC}"
echo -e "${YELLOW}======================================${NC}"
echo -e "Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "Backend: ${GREEN}http://localhost:8081${NC}"
echo -e "Grafana: ${GREEN}http://localhost:3001${NC} (admin/admin)"
echo -e "Prometheus: ${GREEN}http://localhost:9090${NC}"
echo -e "${YELLOW}======================================${NC}"
echo -e "${GREEN}PARA ACCEDER DESDE WSL2:${NC}"
echo -e "Usar la misma URL: ${GREEN}http://localhost:3000${NC}"
echo -e "${GREEN}PARA ACCEDER DESDE OTROS DISPOSITIVOS EN LA RED:${NC}"
echo -e "Usar la IP del servidor: ${GREEN}http://$(hostname -I | awk '{print $1}'):3000${NC}"
echo -e "${YELLOW}======================================${NC}"
echo -e "Para ver logs: ${GREEN}docker-compose logs -f [servicio]${NC}"
echo -e "Para detener: ${GREEN}docker-compose down${NC}"
echo -e "${YELLOW}======================================${NC}"

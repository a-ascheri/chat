#!/bin/bash

# Script de despliegue para plataformas en la nube (Render, Railway, etc.)
# Archivo: deploy.sh

echo "🚀 Iniciando despliegue del chat backend..."

# Configurar variables de entorno para producción
export SPRING_PROFILES_ACTIVE=prod
export SERVER_PORT=${PORT:-8080}

# Compilar la aplicación
echo "📦 Compilando aplicación..."
mvn clean package -DskipTests

# Verificar que el JAR se compiló correctamente
if [ ! -f target/*.jar ]; then
    echo "❌ Error: No se encontró el archivo JAR compilado"
    exit 1
fi

echo "✅ Compilación exitosa"

# Ejecutar la aplicación
echo "🔧 Iniciando servidor..."
java -jar -Dspring.profiles.active=prod target/*.jar

echo "✅ Servidor iniciado exitosamente"

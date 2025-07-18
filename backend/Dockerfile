# Dockerfile para backend Spring Boot - Optimizado para producción
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Configurar variables de entorno
ENV SPRING_PROFILES_ACTIVE=dev
ENV SERVER_PORT=8081
ENV SERVER_ADDRESS=0.0.0.0

EXPOSE 8081
ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "app.jar"]

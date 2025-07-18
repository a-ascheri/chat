# Guía de Uso y Solución de Problemas de Chat

## Configuración del Entorno

### Backend (Spring Boot)

1. **Configuración del Puerto**
   - El backend debe ejecutarse en el puerto 8081
   - Verificar en `application.yml` que `server.port = 8081`

2. **Configuración de CORS**
   - Se ha configurado CORS para aceptar solicitudes desde cualquier origen en desarrollo
   - Para producción, actualizar los orígenes permitidos en `WebConfig.java`

### Frontend (Next.js)

1. **Variables de Entorno**
   - Crear archivo `.env.local` en la carpeta frontend con:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8081/api/messages
   NEXT_PUBLIC_WS_URL=http://localhost:8081/ws
   NEXT_PUBLIC_AUTH_URL=http://localhost:8081/api/auth/login
   ```

2. **Desarrollo Local**
   - Ejecutar con `npm run dev` desde la carpeta frontend
   - Asegurarse que se ejecuta en puerto 3000

## Acceso desde Diferentes Entornos

### Localhost (Misma Máquina)

```
http://localhost:3000
```

### Desde WSL2

- La aplicación ahora detecta automáticamente si está siendo accedida desde WSL2
- Usar URL: `http://localhost:3000` 
- El frontend adaptará automáticamente las peticiones al backend

### Desde Otros Dispositivos en la LAN

- Usa la IP de la máquina donde se ejecuta el servidor:
```
http://[IP_DEL_SERVIDOR]:3000
```
- Ejemplos: `http://192.168.0.100:3000` o `http://172.23.234.53:3000`

## Solución de Problemas Comunes

### Error "Failed to fetch" en WSL2

Este problema ocurre cuando la aplicación no puede comunicarse correctamente entre WSL2 y el host Windows.

**Solución:** 
- Hemos implementado detección automática de la IP/hostname actual
- Las URLs del backend se adaptan automáticamente según el host de acceso

### Error "Username already taken"

Este mensaje indica que otro usuario activo está usando ese nombre de usuario.

**Solución:**
- Esperar 10 minutos para que el sistema libere el nombre de usuario inactivo
- O usar un nombre de usuario diferente

### Los Mensajes Aparecen con el Usuario Incorrecto

Este problema ocurre cuando las sesiones de usuarios no son independientes.

**Solución:**
- Hemos implementado un sistema de sesiones único por usuario
- Cada mensaje está asociado al usuario y sesión correctos
- El sistema ahora genera un `userId` y `sessionId` únicos para cada conexión

## Arquitectura Dockerizada

Para ejecutar la aplicación completa con Docker:

```bash
./start-dev.sh
```

Este script iniciará:
- Backend (Spring Boot) en puerto 8081
- Frontend (Next.js) en puerto 3000
- Redis para mensajería y cache
- PostgreSQL para datos persistentes
- Prometheus para métricas
- Grafana para monitoreo en puerto 3001

## Notas Adicionales

- Los tokens JWT ahora incluyen un `sessionId` único
- El sistema limpia automáticamente los usuarios inactivos después de 10 minutos
- Las URLs se adaptan automáticamente según el entorno de acceso

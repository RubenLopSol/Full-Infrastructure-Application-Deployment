# La Huella - análisis de sentimiento

Aplicación Next.js para análisis de sentimiento de comentarios de productos de calzado.

## 🚀 Despliegue Local

### Requisitos
- Node.js 20+ o 22+
- pnpm
- Docker

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd eu-devops-7-la-huella
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

4. **Build para producción**
   ```bash
   pnpm build
   pnpm start
   ```

## 🧪 Testing

### Ejecutar tests
```bash
# Ejecutar todos los tests
pnpm test

# Verificar linting
pnpm run lint
```


## 🐳 Docker

### Despliegue
```bash
# Levantar toda la infraestructura
docker-compose up -d

# Acceder a la aplicación
http://localhost
```

### Health Check
La aplicación incluye un endpoint de health check en `/api/health`


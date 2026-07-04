# API REST - Estudiantes

Esta API REST fue desarrollada con Node.js, Express y Prisma para gestionar estudiantes y autenticar usuarios mediante JWT.

## Características

- CRUD básico de estudiantes
- Registro y autenticación de usuarios
- Validación de datos con Zod
- Encriptación de contraseñas con bcryptjs
- Integración con PostgreSQL mediante Prisma
- Protección opcional con API Key

## Tecnologías utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- Zod

## Requisitos previos

- Node.js 18 o superior
- pnpm
- PostgreSQL en ejecución

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd api_rest
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
   JWT_SECRET=tu_clave_secreta
   API_KEY=tu_api_key_opcional
   ```

## Configuración de la base de datos

Genera el cliente de Prisma y aplica las migraciones:

```bash
pnpm db:generate
pnpm db:migrate
```

También puedes abrir Prisma Studio:

```bash
pnpm db:studio
```

## Ejecutar la aplicación

Modo desarrollo:

```bash
pnpm dev
```

La API quedará disponible en:

```bash
http://localhost:3000
```

## Endpoints principales

### Estudiantes

- `GET /` - Obtiene todos los estudiantes
- `POST /create` - Crea un nuevo estudiante
- `PUT /update/:id` - Actualiza un estudiante (actualmente con lógica básica de ejemplo)
- `DELETE /delete/:id` - Elimina un estudiante por ID
- `GET /test` - Endpoint de prueba

### Autenticación

- `POST /auth/login` - Inicia sesión y devuelve un token JWT

## Autenticación

Algunos endpoints requieren un token JWT en el header:

```http
Authorization: Bearer <token>
```

Si has configurado `API_KEY`, también puedes enviarla en el header:

```http
x-api-key: tu_api_key
```

## Estructura del proyecto

```text
src/
  index.js
  routes/
  middleware/
  lib/
prisma/
  schema.prisma
```

## Notas

- El proyecto está pensado como una base para construir una API más completa.
- Puedes extender los modelos, rutas y middlewares según las necesidades del negocio.

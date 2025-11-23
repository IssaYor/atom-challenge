# Atom Challenge – Backend

Backend del desafío técnico desarrollado con **Node.js + TypeScript** usando **Firebase Cloud Functions** y **Cloud Firestore** como base de datos.

---

## Descripción

La API expone endpoints para:

- **Autenticación de usuarios**: Registro y login con JWT.
- **Gestión de tareas personales**: CRUD de tareas protegidas con JWT.
- **Health check básico**.

Se aplican principios de **DDD (Domain-Driven Design)**, **repositorios**, **factories**, **servicios de dominio/aplicación**, **middleware de autenticación** y **CI/CD con GitHub Actions** para despliegue automático a Firebase.

---

## Tech Stack

- **Runtime**: Node.js 20 (Cloud Functions 2nd gen).
- **Lenguaje**: TypeScript.
- **Framework HTTP**: Express.
- **Infraestructura**: Firebase Cloud Functions y Firestore.
- **Autenticación**: JWT con middleware de verificación.
- **Testing**: Jest (unit + integration tests con supertest).
- **CI/CD**: GitHub Actions + `firebase-tools`.

---

## Arquitectura

Se sigue un estilo **DDD por capas**:

1. **Domain**:
   - Entidades (`User`, `Task`).
   - Interfaces de repositorio (`IUserRepository`, `ITaskRepository`).
   - Factories (`UserFactory`, `TaskFactory`) para reglas de negocio.
   - Errores de dominio (`ValidationError`, `NotFoundError`, etc.).
2. **Application**:
   - Servicios de aplicación:
     - `UserService`: lógica de usuarios.
     - `TaskService`: lógica de tareas.
   - Los servicios trabajan contra repositorios, sin conocer la infraestructura.
3. **Infrastructure**:
   - Repositorios (`FirestoreUserRepository`, `FirestoreTaskRepository`).
   - Configuración de Firebase (`firestoreClient`).
   - Capa HTTP (Express):
     - `app.ts`: composición de dependencias.
     - Routers (`authRoutes.ts`, `taskRoutes.ts`).
     - Middleware (`authMiddleware.ts`).
   - Servicio de JWT (`JwtService`).

Además, se aplica **Singleton/Composition Root** en `src/index.ts`:

- Se instancian una vez los repositorios (`FirestoreUserRepository`, `FirestoreTaskRepository`).
- Se crea la app Express con `createApp(...)`.
- Se expone como función HTTP de Firebase:

```ts
export const api = functions.https.onRequest(app);
```

---

## 🔒 Manejo seguro de JWT_SECRET

### Producción (Firebase Functions)

- No se sube el archivo `.env` al repositorio.
- Configura el secreto con el siguiente comando:

```bash
firebase functions:config:set jwt.secret="tu_secreto_super_seguro"
```

- Accede al secreto en tu código con `process.env.JWT_SECRET`.

### Desarrollo Local

- Configura el secreto en tu archivo `functions/.env`:

```env
JWT_SECRET=dev-secret
```

### Testing

- Configura el secreto en tu código de test:

```ts
const jwtService = new JwtService("test-secret");
```
- Esto asegura que los tests sean deterministas y no dependan de process.env.

---

## 🔄 CI/CD

El proyecto implementa un pipeline completo utilizando GitHub Actions, ejecutandose en cada push a `main`.

### Pasos principales del workflow:
1. **Checkout del código**: Se clona el repositorio en el runner.
2. **Instalación de Node.js + Firebase Tools**: Configuración del entorno necesario.
3. **Autenticación en Google Cloud**: Uso de una Service Account (JSON almacenado en GitHub Secrets).
4. **Instalación de dependencias**: Ejecución de `npm install`.
5. **Ejecución de testing**: Pruebas unitarias e integrales con Jest y Supertest.
6. **Build de la función**: Compilación del código TypeScript con `tsc`.
7. **Deploy automático a Firebase Functions**: Despliegue de las funciones a Firebase.

---
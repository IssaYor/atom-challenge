# Atom Challenge – Backend

Backend del desafío técnico desarrollado con **Node.js + TypeScript** usando **Firebase Cloud Functions** y **Cloud Firestore** como base de datos.

---

## Contenido

1. [Descripción](#-descripción)
2. [Tech Stack](#-tech-stack)
3. [Arquitectura](#-arquitectura)
4. [CI/CD](#-cicd)
5. [Ejemplo de Uso](#-ejemplo-de-uso)

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
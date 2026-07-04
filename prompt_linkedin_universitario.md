# Prompt — LinkedIn Universitario

## Contexto del proyecto

Estoy desarrollando una aplicación web llamada **UniLink** (o similar), un LinkedIn enfocado en estudiantes de una universidad peruana. El objetivo es centralizar ofertas de trabajo internas (de la propia universidad) y externas (de empresas), y permitir que los estudiantes tengan un perfil profesional dentro del ecosistema universitario.

El proyecto es para el curso de **Prácticas Preprofesionales**. El entregable actual es un **prototipo de frontend** con pocas pantallas, casi sin backend real. La arquitectura real se plantea como visión a futuro.

---

## Pantallas del prototipo (MVP)

1. **Landing / Login** — acceso con cuenta institucional de la universidad
2. **Feed de ofertas** — listado de ofertas internas y externas, con filtro por tipo
3. **Detalle de oferta** — descripción completa, empresa, requisitos y botón de postulación
4. **Perfil del estudiante** — foto, carrera, habilidades, CV descargable

Los datos son mock (JSON estático), no hay backend real en el prototipo.

---

## Stack del prototipo

- **Framework:** React + Vite
- **Estilos:** Tailwind CSS + shadcn/ui
- **Datos:** JSON mock local (sin API real)
- **Routing:** React Router
- **Estado:** useState / useContext (sin Redux por ahora)

---

## Arquitectura objetivo (visión real del sistema)

### 1. Frontend
- React + Vite + Tailwind CSS
- Organizado por features (perfil, ofertas, postulaciones, admin)
- Rutas protegidas según rol (estudiante / empresa / admin)

### 2. API Gateway
- Punto de entrada único para todas las peticiones
- Responsabilidades: autenticación, rate limiting, routing a microservicios
- Puede implementarse con Express middleware, Kong, o AWS API Gateway

### 3. Backend — Microservicios (Node.js o Django)

| Servicio | Responsabilidad |
|---|---|
| `auth-service` | Login SSO / LDAP con la universidad |
| `jobs-service` | CRUD de ofertas internas y externas |
| `profile-service` | Perfil del estudiante, CV, habilidades |
| `notif-service` | Notificaciones por email y push |

> Se puede empezar como monolito y separar en microservicios más adelante.

### 4. Base de datos

- **PostgreSQL** — datos relacionales: usuarios, ofertas, postulaciones, empresas
- **Redis** — caché de sesiones y resultados de búsqueda frecuentes

### 5. Servicios externos

- **Job APIs** — integración con LinkedIn Jobs, Bumeran, Computrabajo para importar ofertas externas automáticamente
- **Storage (S3 o similar)** — almacenamiento de CVs en PDF subidos por los estudiantes

---

## Roles del sistema

- **Estudiante** — ve ofertas, postula, gestiona su perfil
- **Empresa / empleador** — publica y gestiona sus ofertas
- **Admin universidad** — modera contenido, gestiona usuarios y ofertas internas

---

## Restricciones y decisiones de diseño

- El login debe integrarse con la cuenta institucional de la universidad (SSO o LDAP), no crear cuentas nuevas
- Las ofertas externas se importan automáticamente desde APIs de terceros; las internas las publica el admin
- Los CVs se suben en PDF y se almacenan en la nube
- El sistema debe escalar para toda la base de estudiantes de la universidad

---

## Lo que necesito de ti

[REEMPLAZA ESTA SECCIÓN con tu tarea específica, por ejemplo:]

- "Genera el componente React del Feed de ofertas con datos mock"
- "Crea el diseño de la base de datos PostgreSQL para este sistema"
- "Escríbeme el README del proyecto"
- "Genera el auth-service en Node.js con JWT"

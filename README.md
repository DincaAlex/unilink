# SanMarcos Jobs (UniLink)

LinkedIn enfocado en estudiantes de la **UNMSM**: centraliza ofertas de
prácticas internas (publicadas por la universidad/empresas) y externas, y
da a cada estudiante un perfil profesional dentro del ecosistema
universitario.

Proyecto del curso **Prácticas Preprofesionales**. Prototipo full-stack
simple: frontend en React y un backend ligero con base de datos real,
pensado para correr 100% en local sin necesidad de Docker ni servicios
externos.

## Stack

- **Frontend** (`sanmarcos-jobs/`): React + Vite + Tailwind CSS, React
  Router, Context API.
- **Backend** (`server/`): Node.js + Express + SQLite (`better-sqlite3`).
  Toda la base de datos vive en un solo archivo, `server/data.sqlite`.
- **Orquestación**: `concurrently`, para levantar frontend y backend con
  un solo comando.

## Requisitos

- Node.js 20 o superior.

## Instalación

Instalar dependencias en los tres `package.json` del proyecto:

```bash
npm install                    # raíz (concurrently)
npm install --prefix server    # backend
npm install --prefix sanmarcos-jobs   # frontend
```

## Cómo correrlo

Desde la raíz del repo:

```bash
npm run dev
```

Esto levanta:
- Backend (Express) en **http://localhost:3001**
- Frontend (Vite) en **http://localhost:5173**

La primera vez que arranca el backend, crea `server/data.sqlite` y lo
siembra automáticamente con datos de ejemplo (14 ofertas, un perfil de
estudiante, uno de empresa y las dos cuentas demo).

## Cuentas demo

| Rol | Correo | Contraseña |
|---|---|---|
| Estudiante | `admin@unmsm.edu.pe` | `unmsm2025` |
| Empresa | `maria.fernandez@talenthub.pe` | `talenthub2025` |

La pantalla de login tiene botones "Ver como estudiante" / "Ver como
empresa" que autocompletan estas credenciales.

## Estructura del repo

```
linkedin_lunatics/
├── package.json          # script raíz: npm run dev (concurrently)
├── server/                # backend
│   ├── index.js           # rutas Express (/api/*)
│   ├── db.js               esquema SQLite + seed inicial
│   ├── seedData.js         datos de ejemplo
│   └── data.sqlite         base de datos (se genera en runtime)
└── sanmarcos-jobs/         # frontend
    └── src/
        ├── context/AppDataContext.jsx   estado global (jobs, perfiles, sesión)
        ├── lib/api.js                    cliente HTTP hacia el backend
        └── pages/                        Login, Feed, Detalle de oferta,
                                           Publicar oferta, Perfil, Editar
                                           perfil, CV imprimible
```

## Funcionalidad

- Login con dos roles (estudiante / empresa).
- Feed de ofertas con filtros (tipo, modalidad, sueldo, antigüedad).
- Detalle de oferta y postulación (persiste en la base de datos).
- Perfil de estudiante y de empresa, editable (datos básicos + habilidades).
- Publicación de nuevas ofertas (solo cuenta empresa).
- Descarga de CV como vista imprimible (PDF vía el diálogo del navegador).

## Roles del sistema

- **Estudiante** — navega el feed de ofertas, postula, y gestiona su
  perfil/CV. Ve una card "Mis postulaciones" con el estado de cada una.
- **Empresa** — además de tener su propio perfil (ficha de empresa + CV
  del reclutador), puede publicar nuevas ofertas y ve una card "Ofertas
  publicadas" con las que ha creado.

No existe todavía un rol "Admin universidad" (mencionado en la visión
original del proyecto) que modere ofertas internas o gestione usuarios —
ver [Limitaciones conocidas](#limitaciones-conocidas).

## API (backend)

Base URL: `http://localhost:3001/api`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/login` | `{ email, password }` → `{ email, role }` o 401 |
| GET | `/jobs` | Lista todas las ofertas |
| GET | `/jobs/:id` | Detalle de una oferta |
| POST | `/jobs` | Crea una oferta (requiere header `x-role: empresa`) |
| GET | `/profile/student` | Perfil del estudiante |
| PUT | `/profile/student` | Actualiza perfil del estudiante |
| GET | `/profile/company` | Perfil de la empresa |
| PUT | `/profile/company` | Actualiza perfil de la empresa |
| GET | `/applications` | Postulaciones del estudiante |
| POST | `/applications` | `{ jobId }` → crea una postulación |

## Base de datos

SQLite (`server/data.sqlite`, modo WAL) con 5 tablas:

- `users` — credenciales y rol de las cuentas demo.
- `students` / `companies` — una fila cada una (perfil único); los campos
  con listas o estructuras anidadas (habilidades, experiencia, educación,
  certificaciones, idiomas) se guardan como texto JSON en la misma
  columna, para mantener el esquema simple.
- `jobs` — las ofertas (igual que arriba, `requirements`/`benefits`/`skills`
  se guardan como JSON).
- `applications` — una fila por postulación (`studentId`, `jobId`,
  `status`, `appliedDate`).

Se puede inspeccionar/editar con cualquier cliente SQLite (por ejemplo,
la herramienta **Database** de IntelliJ Ultimate: *Data Source → SQLite*
apuntando a `server/data.sqlite`).

## Notas de desarrollo

- **Reiniciar la base de datos desde cero**: detener el backend y borrar
  `server/data.sqlite` (y los archivos `-wal`/`-shm` si existen). Al
  volver a arrancar, se re-siembra automáticamente con los datos de
  ejemplo.
- **El backend usa `node --watch`** (nativo de Node 20+), así que
  reinicia solo al guardar cambios en `server/`.
- **Puerto ocupado al arrancar**: si `npm run dev` no toma los puertos
  `3001`/`5173`, probablemente quedó un proceso previo colgado. En
  Windows: `netstat -ano | findstr "3001 5173"` para ver el PID y
  `taskkill /PID <pid> /F` para cerrarlo.

## Limitaciones conocidas

Este es un prototipo de curso, no un sistema en producción:

- Login simple sin hashing de contraseñas ni JWT/sesiones — solo para demo.
- Sin rutas protegidas en el frontend.
- Edición de perfil limitada a campos básicos y habilidades (experiencia,
  educación, certificaciones e idiomas quedan de solo lectura).
- Una sola cuenta de empresa (no hay soporte multi-empresa).
- Sin tests automatizados.

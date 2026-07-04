# SanMarcos Jobs — Contexto del Proyecto

> Documento de referencia para continuar la implementación.
> Última actualización: 2026-05-29 (rev. 2)

---

## 1. Descripción general

**SanMarcos Jobs** es un portal de empleo universitario para estudiantes de la **Universidad Nacional Mayor de San Marcos (UNMSM)**, Lima, Perú. Funciona como un LinkedIn simplificado enfocado en prácticas preprofesionales.

- **Curso:** Prácticas Preprofesionales
- **Entregable actual:** Prototipo frontend con datos mock (sin backend real)
- **Estado:** 4 pantallas funcionales, diseño finalizado

---

## 2. Stack técnico

| Herramienta | Versión | Notas |
|---|---|---|
| Node.js | 20.17.0 | Versión instalada en la máquina (no actualizar sin revisar compatibilidad) |
| React | 18.3.1 | — |
| Vite | 5.4.11 | **No usar Vite 6+** — requiere Node 20.19+ que no está disponible |
| Tailwind CSS | 3.4.17 | Setup con PostCSS. **No usar Tailwind v4** — requiere `@tailwindcss/vite` incompatible con Node actual |
| React Router | 6.28.0 | BrowserRouter, rutas en `App.jsx` |
| Lucide React | 0.469.0 | Iconos |
| Fuentes | Google Fonts | IBM Plex Sans (body) + Cormorant Garamond (headings) — cargadas en `index.html` |

**Comando de desarrollo:**
```bash
cd sanmarcos-jobs
npm run dev
# Corre en http://localhost:5173 (o 5174 si el puerto está ocupado)
```

---

## 3. Estructura de archivos

```
sanmarcos-jobs/
├── index.html                  ← Google Fonts se cargan aquí
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                ← Entry point
│   ├── App.jsx                 ← Rutas
│   ├── index.css               ← Tailwind + estilos base (body font, colores base)
│   ├── components/
│   │   ├── Navbar.jsx          ← Navbar sticky, compartida por Feed/Detail/Profile
│   │   └── GlowInput.jsx       ← Input con efecto de borde dinámico (ver sección 6)
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── FeedPage.jsx
│   │   ├── JobDetailPage.jsx
│   │   └── ProfilePage.jsx
│   └── data/
│       └── mockData.js         ← Datos estáticos: jobs[] + student{}
```

---

## 4. Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `LoginPage` | Pantalla de acceso |
| `/feed` | `FeedPage` | Lista de ofertas con filtros |
| `/jobs/:id` | `JobDetailPage` | Detalle de una oferta |
| `/profile` | `ProfilePage` | Perfil del estudiante |
| `*` | Redirect `/` | Catch-all |

No hay autenticación real. El login verifica contra un usuario mock hardcodeado.

**Credenciales mock:**
```
Email:      admin@unmsm.edu.pe
Contraseña: unmsm2025
```

---

## 5. Datos mock (`mockData.js`)

### `jobs[]` — 14 ofertas, campos por oferta

```js
{
  id: Number,
  title: String,
  company: String,
  location: String,         // "Lima, Presencial" | "Lima, Híbrido" | "Lima, Remoto"
  modality: String,         // "Presencial" | "Híbrido" | "Remoto"  ← para filtrar
  type: "interna" | "externa",
  area: String,             // "Tecnología" | "Finanzas" | "Legal" | "Marketing" | etc.
  salary: String,           // "S/ 1,200 / mes"
  salaryNum: Number,        // valor numérico ← para filtrar por rango
  posted: String,           // "Hace N días"
  daysAgo: Number,          // días desde publicación ← para filtrar por fecha
  deadline: String,         // fecha límite ISO "YYYY-MM-DD"
  duration: String,         // "3 meses" | "4 meses" | "6 meses"
  hoursPerWeek: Number,     // horas semanales de dedicación
  status: String,           // "abierto" | "por_cerrar" | "cerrado"
  initials: String,         // iniciales de la empresa (no se usan en UI actual)
  color: String,            // color de la empresa (no se usa en UI actual)
  description: String,
  requirements: String[],
  benefits: String[],       // ej. ["Seguro médico", "Laptop corporativa"]
  skills: String[],
  applicants: Number,
}
```

#### Ofertas disponibles (resumen)

| id | Título | Empresa | Tipo | Modalidad | Sueldo | Status |
|---|---|---|---|---|---|---|
| 1 | Asistente de Investigación — IA | UNMSM · Ing. Sistemas | interna | Presencial | 1,200 | abierto |
| 2 | Practicante Desarrollo Web | BCP | externa | Híbrido | 1,800 | abierto |
| 3 | Auxiliar Administrativo — Decanato | UNMSM · Letras | interna | Presencial | 950 | por_cerrar |
| 4 | Analista de Datos Junior | Interbank | externa | Remoto | 2,000 | abierto |
| 5 | Monitor Académico — Cálculo I | UNMSM · Matemáticas | interna | Presencial | 600 | por_cerrar |
| 6 | Desarrollador Mobile React Native | Rappi Perú | externa | Híbrido | 2,500 | abierto |
| 7 | Practicante UX/UI | Yape (BCP) | externa | Híbrido | 1,600 | abierto |
| 8 | Asistente Legal — Prop. Intelectual | INDECOPI | externa | Presencial | 1,100 | abierto |
| 9 | Practicante de Contabilidad | EY Perú | externa | Híbrido | 1,700 | abierto |
| 10 | Practicante Marketing Digital | Alicorp | externa | Remoto | 1,400 | por_cerrar |
| 11 | Asistente de Laboratorio — Química | UNMSM · Química | interna | Presencial | 800 | por_cerrar |
| 12 | Desarrollador Backend Node.js | Culqi | externa | Remoto | 2,200 | abierto |
| 13 | Practicante de RRHH | Grupo Gloria | externa | Presencial | 1,200 | cerrado |
| 14 | Analista de Seguridad Informática | SUNAT | externa | Híbrido | 1,500 | abierto |

### `student{}` — perfil del usuario

```js
{
  name, career, faculty, semester, gpa,
  email, phone, location, bio,
  skills: String[],
  languages: [{ lang, level }],
  certifications: [{ name, issuer, year }],
  experience: [{ id, role, org, period, desc }],
  education: { degree, university, years },
  savedJobs: Number[],      // IDs de ofertas guardadas
  appliedJobs: [{ jobId, status, appliedDate }],
                            // status: "en_revision" | "entrevista" | "rechazado" | "aceptado"
}
```

Los datos del `student` deben coincidir con las credenciales de login (el email es el mismo).

---

## 6. Componentes reutilizables

### `<Navbar />`
- Sticky, fondo `#1c1c19`, borde inferior `#2a2a24`
- Logo con ícono de Briefcase en cuadro gold
- Links: Ofertas / Mi Perfil / Salir — con íconos Lucide
- Link activo detectado con `useLocation()`

### `<GlowInput variant="line" | "box" />`

Efecto de borde dinámico que responde a la posición del cursor:

- **`variant="line"`** — solo borde inferior. El color cambia de `rgba(196,152,58,0.18)` a gold intenso según proximidad del cursor. Usado en login.
- **`variant="box"`** — borde en caja con gradiente radial. El lado más cercano al cursor se ilumina en gold. Fondo base `#1c1c19`. Usado en el buscador del feed.

**Props:**
```jsx
// variant="line"
<GlowInput
  variant="line"
  type="email"
  placeholder="..."
  value={val}
  onChange={fn}
  className="py-2.5 text-sm text-[#f0ece4] placeholder-[#504c48]"
/>

// variant="box"
<GlowInput
  variant="box"
  type="text"
  placeholder="..."
  value={val}
  onChange={fn}
  inputClassName="pl-8 pr-3 py-2 text-sm text-[#f0ece4] placeholder-[#504c48]"
  className="..."   // clase para el wrapper (opcional)
/>
```

---

## 7. Sistema de diseño

### Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| BG principal | `#141412` | Fondo de página |
| Surface | `#1c1c19` | Cards, headers de sección, navbar |
| Border | `#2a2a24` | Bordes de cards, separadores |
| Texto principal | `#f0ece4` | Headings, texto importante |
| Texto secundario | `#ccc8c0` | Descripciones, body text |
| Texto muted | `#948f87` | Labels, metadata, nav inactivo |
| Texto dim | `#625e5a` | Fechas, info poco relevante |
| Gold (acento) | `#c4983a` | Botones primarios, estados activos, íconos de sección |
| Gold hover | `#d4aa4a` | Hover en botones gold |
| Gold dim | `#7a5f22` | Números de índice (01, 02...) |

### Tipografía

- **Headings / títulos de páginas:** `font-family: 'Cormorant Garamond', serif` — aplicar con clase `serif` definida en `index.css`, o directamente con `style={{ fontFamily: "'Cormorant Garamond', serif" }}`
- **Todo lo demás:** IBM Plex Sans (cargado en `index.html`, declarado como `font-family` del `body` en `index.css`)
- **Tamaño base body:** 15px
- **Labels / uppercase:** `text-xs tracking-[0.24em] uppercase font-medium text-[#948f87]`

### Bordes y forma

- **Sin bordes redondeados** en ningún elemento significativo (`rounded-none` implícito)
- `rounded-sm` (2px) solo si es absolutamente necesario — no usar `rounded-xl` ni `rounded-2xl`
- Separación visual por líneas finas (`border border-[#2a2a24]`) y espaciado, no por sombras ni gradientes de fondo

### Patrón de card

Usado en Feed (tarjetas de empleo), Profile (secciones) y Job Detail (secciones):

```jsx
// Card con header de sección
<div className="bg-[#1c1c19] border border-[#2a2a24] px-6 py-5">
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2a2a24]">
    <SomeIcon size={14} className="text-[#c4983a]" />
    <p className="text-xs tracking-[0.24em] uppercase font-medium text-[#948f87]">Label</p>
  </div>
  {/* contenido */}
</div>
```

### Patrón de header de página

Bloque oscuro con borde inferior, igual en todas las páginas interiores:

```jsx
<div className="bg-[#1c1c19] border-b border-[#2a2a24]">
  <div className="max-w-5xl mx-auto px-6 py-10">
    <p className="text-xs tracking-[0.28em] uppercase text-[#948f87] font-medium mb-3">
      Subtítulo / contexto
    </p>
    <h1 className="serif text-5xl text-[#f0ece4]">Título principal</h1>
  </div>
</div>
```

### Botón primario (gold)

```jsx
<button className="bg-[#c4983a] text-[#141412] text-xs tracking-[0.24em] uppercase font-semibold px-6 py-3 hover:bg-[#d4aa4a] transition-colors cursor-pointer">
  Acción
</button>
```

### Números de índice (estilo EVS)

```jsx
<span className="text-xs tabular-nums font-medium text-[#7a5f22]">
  {String(i + 1).padStart(2, '0')}
</span>
```

---

## 8. Filtros implementados en Feed

Lógica en `FeedPage.jsx`:

| Filtro | Estado | Opciones |
|---|---|---|
| Tipo | `activeType` | Todas / Internas / Externas |
| Búsqueda | `query` | Texto libre sobre `title` y `company` |
| Modalidad | `modality` | "" / Presencial / Híbrido / Remoto |
| Sueldo | `salary` | "" / `lt1000` / `1000-2000` / `gt2000` |
| Publicación | `days` | "" / 1 / 3 / 7 (días atrás) |

El botón "Limpiar" aparece solo cuando `modality || salary || days` es truthy.

---

## 9. Normas de diseño a respetar

1. **No usar indigo/azul** como color de acento — el único acento es gold `#c4983a`
2. **No usar `rounded-xl` o `rounded-2xl`** — el diseño es angular, editorial
3. **No usar `bg-slate-*` ni `border-slate-*`** — usar los tokens de color definidos arriba
4. **No usar `box-shadow`** para separar secciones — usar bordes finos
5. **Headings en serif** (Cormorant Garamond), body en IBM Plex Sans
6. **Labels/categorías** siempre en `uppercase tracking-[0.24em] font-medium text-[#948f87]`
7. El fondo `#141412` es el "negro cálido" — no reemplazar con `#000` ni `#0f172a` (azulado)
8. El `surface` `#1c1c19` es para cards y headers de sección. No `#1e293b` ni similares

---

## 10. Funcionalidades pendientes (visión futura)

Según el documento original del proyecto (`prompt_linkedin_universitario.md`):

- **Autenticación real** con SSO/LDAP de la UNMSM (campus virtual)
- **Backend microservicios** (Node.js o Django):
  - `auth-service`: login institucional
  - `jobs-service`: CRUD de ofertas
  - `profile-service`: perfil y CV
  - `notif-service`: notificaciones email/push
- **Base de datos:** PostgreSQL + Redis (caché de sesiones)
- **Integración con APIs externas:** LinkedIn Jobs, Bumeran, Computrabajo
- **Almacenamiento de CVs en PDF:** S3 o similar
- **Roles:** estudiante / empresa / admin universitario
- **Rutas protegidas** por rol
- **Pantalla de empresa** — publicar y gestionar ofertas
- **Panel de admin** — moderar contenido, gestionar usuarios

### Próximas pantallas sugeridas para el prototipo

- `PostulacionesPage` — historial de postulaciones del estudiante
- `EmpresaPage` — perfil de empresa con sus ofertas
- `AdminPage` — dashboard básico de administración

---

## 11. Decisiones técnicas tomadas

| Decisión | Motivo |
|---|---|
| Vite 5 en vez de 6+ | Node 20.17 instalado no soporta Vite 6 (requiere 20.19+) |
| Tailwind v3 en vez de v4 | Tailwind v4 usa `@tailwindcss/vite` incompatible con Node actual |
| Sin Redux / Zustand | Prototipo simple, `useState` es suficiente |
| Sin shadcn/ui | Diseño personalizado que no encaja con los componentes de shadcn |
| Sin backend real | Entregable es prototipo frontend — datos mock en JSON |
| Google Fonts en `index.html` | Más simple que importar en CSS para Vite 5 |

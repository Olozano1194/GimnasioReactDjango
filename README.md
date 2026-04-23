# Gym Control — Sistema de Gestión de Gimnasios

**ControlFit Colombia** es un sistema fullstack para la gestión integral de membresías en gimnasios. Permite administrar usuarios, membresías, pagos y servicios de forma eficiente, eliminando la necesidad de procesos manuales o hojas de cálculo.

---

## 🚀 Demo Visual

| Módulo | Vista |
|--------|-------|
| **Login** | ![Login](./imgReadme/login.png) |
| **Dashboard** | ![Home](./imgReadme/dashboard.png) |
| **Registro de Miembros** | ![Registro](./imgReadme/resgisterMember.png) |
| **Lista de Miembros** | ![Lista](./imgReadme/listMember.png) |
| **Asignar Membresías** | ![Asignar](./imgReadme/asignarmembresia.png) |
| **Lista de Asignar Membresías** | ![ListaMembresias](./imgReadme/listAsignarMembresia.png) |
| **Perfil de Usuario** | ![Perfil](./imgReadme/perfil.png) |

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Propósito |
|-------------|-----------|
| React 18 | UI interactiva |
| TypeScript | Tipado estático |
| Vite | Build tool rápida |
| Tailwind CSS | Estilos responsivos |
| Axios | HTTP client con interceptors |
| React Router v7 | Navegación |
| React Hook Form | Formularios |

### Backend
| Tecnología | Propósito |
|-------------|-----------|
| Django 5 | Framework Python |
| Django Rest Framework | API REST |
| PostgreSQL / MySql | Base de datos |
| SimpleJWT | Autenticación JWT |
| CORS Headers | Cross-origin config |

---

## 🔐 Sistema de Autenticación (JWT)

El proyecto implementa un sistema de autenticación robusto con **JWT** diseñado para uso en producción.

### Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  LOGIN                                                             │
│  ┌──────────┐    POST /token/     ┌─────────────────────┐         │
│  │ Frontend │ ──────────────────► │ Backend (Django)    │         │
│  └──────────┘    {email,pass}    │ - Valida credenciales│         │
│        ◄──────────────────────── │ - Genera JWTs        │         │
│        {access} + cookie         │ - Access: 30 min     │         │
│        (HttpOnly)               │ - Refresh: 7 días     │         │
│                               └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  REQUEST AUTORIZADA                                                │
│  ┌──────────┐   GET /api/v1/me/     ┌─────────────────────┐        │
│  │ Frontend │ ──────────────────► │ Authorization:      │        │
│  └──────────┐   Bearer {access}  │ Bearer {jwt}        │        │
│        ◄──────────────────────── │ Validado ✓          │        │
│        {user data}              └─────────────────────┘        │
└─────────��────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AUTO-REFRESH (cuando token expira)                        │
│  ┌──────────┐    401 ( unauthorized)                │
│  │ Frontend │ ◄────────────────────────              │
│  └──────────┘                                        │
│        │                                              │
│        ▼                                              │
│  ┌──────────┐   POST /token/refresh/                 │
│  │ Frontend │ ─────────────────────────────────►        │
│  └──────────┘   (cookie automática)                │
│        │                                              │
│        ▼                                              │
│  ┌──────────┐   {new access token}                 │
│  │ Frontend │ ◄─────────────────────────────────     │
│  └──────────┘   + reintenta request original         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LOGOUT                                                      │
│  ┌──────────┐   POST /token/blacklist/                  │
│  │ Frontend │ ──────────────────────────────────     │
│  └──────────┘   {refresh token}                        │
│        │                                              │
│        ▼                                              │
│  ┌──────────┐   Limpia:                            │
│  │ Frontend │ - Access token (memoria JS)         │
│  └──────────┘ - Refresh token (cookie)         │
│               - isAuthenticated = false          │
└─────────────────────────────────────────────────────┘
```

### Endpoints de Autenticación

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/gym/api/v1/token/` | Login (retorna access + cookie) |
| POST | `/gym/api/v1/token/refresh/` | Renovar access token |
| POST | `/gym/api/v1/token/blacklist/` | Invalidar refresh token |
| POST | `/gym/api/v1/register/` | Registro público (auto-crea gimnasio) |

### Seguridad

| Característica | Implementación |
|----------------|---------------|
| Access Token | Memoria JavaScript (no localStorage) |
| Refresh Token | Cookie HttpOnly (protegido contra XSS) |
| Expiración | Access: 30 min, Refresh: 7 días |
| Logout | Blacklist de refresh token |
| Auto-refresh | Interceptor axios 401 → refresh → retry |

---

## 📋 Características

- **Gestión de Miembros**: Registro, edición, eliminación y visualización
- **Control de Membresías**: Seguimiento de estados de pago y vencimiento
- **Multi-tenant**: Cada usuario tiene su propio gimnasio
- **Registro Público**: Usuarios nuevos pueden registrarse sin admin
- **Interfaz Responsiva**: Optimizado para tablets y escritorio
- **Exportación**: Reportes en Excel

---

## ⚙️ Configuración e Instalación

### 1. Clonar el repositorio

```bash
git clone <url_del_repositorio>
cd GimnasioReactDjango
```

### 2. Backend (Django)

#### Crear entorno virtual

```bash
python -m venv venv
```

#### Activar entorno virtual

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

#### Instalar dependencias

```bash
pip install -r requirements.txt
```

#### Configurar variables de entorno

```bash
# Copiar .env.example a .env y configurar
cp .env.example .env
```

#### Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Crear superusuario (opcional)

```bash
python manage.py createsuperuser
```

#### Iniciar servidor

```bash
python manage.py runserver
# Servidor disponible en http://localhost:8000
```

### 3. Frontend (React + Vite)

#### Instalar dependencias

```bash
cd gimnasioReact
npm install
```

#### Configurar variables de entorno

```bash
# Verificar .env tiene las URLs correctas
VITE_API_URL_DEV=http://localhost:8000/gym/api/v1
```

#### Iniciar desarrollo

```bash
npm run dev
# App disponible en http://localhost:5173
```

#### Build para producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
GimnasioReactDjango/
├── gimnasio/                    # Proyecto Django
│   ├── settings.py             # Configuración principal
│   ├── urls.py                  # Rutas principales
│   └── ...
├── gimnasioApp/                 # App principal Django
│   ├── models.py                # Modelos de datos
│   ├── views.py                 # Vistas/API
│   ├── serializers.py           # Serializadores DRF
│   ├── urls.py                  # Rutas API
│   └── ...
├── gimnasioReact/               # Frontend React
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios/         # axios instances
│   │   │   │   ├── axios.private.ts   # Con token
│   │   │   │   └── axios.public.ts    # Sin token
│   │   │   └── users/         # API calls
│   │   ├── components/        # Componentes React
│   │   ├── context/           # AuthContext
│   │   ├── layouts/          # Layouts
│   │   ├── model/
│   │   │   └── dto/          # TypeScript DTOs
│   │   ├── pages/            # Vistas/Páginas
│   │   ├── routes/          # Ruteo
│   │   ├── utils/           # Utilidades
│   │   │   └── authStorage.ts        # JWT storage
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env                  # Variables de entorno
│   └── package.json
├── .env.example
├── requirements.txt
└── README.md
```

### Estructura Frontend Detallada

| Carpeta | Contenido |
|---------|-----------|
| `src/api/axios/` | Instancias axios (public/private) |
| `src/api/users/` | Funciones API para usuarios |
| `src/model/dto/` | TypeScript interfaces |
| `src/context/` | AuthContext y Provider |
| `src/pages/auth/` | Login, Register, ForgetPassword |
| `src/pages/admin/` | Dashboard, membros, membresías |
| `src/routes/` | Ruteo y rutas protegidas |
| `src/utils/` | authStorage, helpers |

---

## 🔧 Variables de Entorno

### Backend (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgres://user:password@localhost:5432/gimnasio
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env)

```env
VITE_API_URL_DEV=http://localhost:8000/gym/api/v1
VITE_API_URL_PROD=https://tu-dominio.render.com/gym/api/v1
```

---

## 🧪 API Endpoints

### Autenticación

| Método | Endpoint | Público | Descripción |
|--------|----------|---------|-------------|
| POST | `/gym/api/v1/token/` | ✅ | Login |
| POST | `/gym/api/v1/token/refresh/` | ✅ | Refresh token |
| POST | `/gym/api/v1/token/blacklist/` | ❌ | Logout |
| POST | `/gym/api/v1/register/` | ✅ | Registro nuevo |

### Usuarios

| Método | Endpoint | Público | Descripción |
|--------|----------|---------|-------------|
| GET | `/gym/api/v1/me/` | ❌ | Perfil actual |
| GET | `/gym/api/v1/User/` | ❌ | Listar usuarios |
| POST | `/gym/api/v1/User/` | ❌ | Crear usuario |
| GET | `/gym/api/v1/User/{id}/` | ❌ | Ver usuario |
| PUT | `/gym/api/v1/User/{id}/` | ❌ | Actualizar usuario |
| DELETE | `/gym/api/v1/User/{id}/` | ❌ | Eliminar usuario |

### Miembros

| Método | Endpoint | Público | Descripción |
|--------|----------|---------|-------------|
| GET | `/gym/api/v1/UserGym/` | ❌ | Lista miembros |
| POST | `/gym/api/v1/UserGym/` | ❌ | Registrar miembro |
| GET | `/gym/api/v1/UserGymDay/` | ❌ | Miembros por día |

### Membresías

| Método | Endpoint | Público | Descripción |
|--------|----------|---------|-------------|
| GET | `/gym/api/v1/MemberShips/` | ❌ | Lista membresías |
| POST | `/gym/api/v1/MemberShips/` | ❌ | Crear membresía |
| GET | `/gym/api/v1/MemberShipsAsignada/` | ❌ | Membresías asignadas |
| POST | `/gym/api/v1/MemberShipsAsignada/` | ❌ | Asignar membresía |

---

## 📄 Licencia

MIT License —自由 para usar y modificar.

---

## 👤 Autor

Oscar Eduardo Lozano Bocanegra — [GitHub](https://github.com/Olozano1194)
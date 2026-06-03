# Atelier Store

Tienda online de arte y merchandise con sistema de membresía premium, gestión de artistas, y panel de administración.

##  Tecnologías

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Estilos
- **shadcn/ui** - Componentes UI (Radix UI)
- **React Router** - Enrutamiento
- **TanStack React Query** - Manejo de datos y caché
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Recharts** - Gráficos
- **Zod** - Validación de esquemas
- **React Hook Form** - Manejo de formularios

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcrypt/bcryptjs** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

##  Estructura del Proyecto

```
proyecto-sistemasInfo/
├── atelier-store-front-main/    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/         # Componentes UI reutilizables
│   │   ├── contexts/           # Contextos (Auth, Cart)
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilidades
│   │   ├── pages/              # Páginas de la aplicación
│   │   │   ├── Index.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Artists.tsx
│   │   │   ├── ArtistDetail.tsx
│   │   │   ├── Merch.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── CommunityPage.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── routes/             # Rutas protegidas
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── backend/                     # Backend (Node.js + Express)
    ├── config/
    │   └── database.js          # Configuración de MongoDB
    ├── controllers/            # Lógica de negocio
    ├── middleware/             # Middleware (auth, admin, membership)
    ├── models/                 # Modelos Mongoose
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   ├── Artist.js
    │   ├── Cart.js
    │   ├── Merch.js
    │   └── Inventory.js
    ├── routes/                 # Rutas API
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   ├── admin.js
    │   ├── exclusive.js
    │   ├── cart.js
    │   ├── artists.js
    │   ├── merch.js
    │   └── users.js
    ├── server.js               # Servidor Express
    ├── package.json
    └── .env                    # Variables de entorno
```

##  Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- MongoDB (local o en la nube)
- npm o yarn

### Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno en `.env`:
```env
MONGO_URI=tu_uri_de_mongodb
PORT=5000
JWT_SECRET=tu_secreto_jwt
```

4. Iniciar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará corriendo en `http://localhost:5000`

### Frontend

1. Navegar al directorio del frontend:
```bash
cd atelier-store-front-main
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

4. Para producción:
```bash
npm run build
npm run preview
```

##  API Endpoints

### Autenticación (`/api/auth`)
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `GET /check-membership` - Verificar membresía premium
- `GET /profile` - Obtener perfil de usuario
- `PUT /profile` - Actualizar perfil
- `GET /users` - Obtener todos los usuarios (admin)
- `DELETE /users/:id` - Eliminar usuario (admin)
- `PUT /users/:id` - Actualizar usuario (admin)

### Productos (`/api/products`)
- `GET /` - Obtener todos los productos
- `GET /:id` - Obtener producto por ID
- `GET /premium` - Obtener productos premium (requiere membresía)
- `POST /` - Crear producto (admin)
- `PUT /:id` - Actualizar producto (admin)
- `DELETE /:id` - Eliminar producto (admin)
- `GET /low-stock` - Obtener productos con bajo stock (admin)

### Pedidos (`/api/orders`)
- `POST /` - Crear pedido
- `GET /` - Obtener pedidos del usuario
- `GET /:id` - Obtener pedido por ID
- `PUT /:id/status` - Actualizar estado del pedido (admin)

### Carrito (`/api/cart`)
- `GET /` - Obtener carrito del usuario
- `POST /` - Agregar producto al carrito
- `PUT /:productId` - Actualizar cantidad
- `DELETE /:productId` - Eliminar del carrito
- `DELETE /` - Vaciar carrito

### Artistas (`/api/artists`)
- `GET /` - Obtener todos los artistas
- `GET /:id` - Obtener artista por ID
- `POST /` - Crear artista (admin)
- `PUT /:id` - Actualizar artista (admin)
- `DELETE /:id` - Eliminar artista (admin)

### Merchandise (`/api/merch`)
- `GET /` - Obtener todo el merch
- `GET /:id` - Obtener merch por ID
- `POST /` - Crear merch (admin)
- `PUT /:id` - Actualizar merch (admin)
- `DELETE /:id` - Eliminar merch (admin)

### Admin (`/api/admin`)
- Endpoints específicos para administración

### Exclusive (`/api/exclusive`)
- Contenido exclusivo para miembros premium

## 👥 Roles de Usuario

- **Usuario Regular**: Puede navegar, ver productos, agregar al carrito, y hacer pedidos
- **Miembro Premium**: Acceso a productos exclusivos y contenido premium
- **Administrador**: Acceso completo al panel de administración, gestión de productos, usuarios, pedidos, y artistas

##  Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación mediante JWT tokens
- Middleware de verificación de tokens
- Protección de rutas sensibles
- CORS configurado
- Validación de datos en backend

##  Características

- **Catálogo de Productos**: Navegación y filtrado de productos
- **Sistema de Artistas**: Perfiles de artistas con galerías
- **Merchandise**: Tienda de merchandise oficial
- **Carrito de Compras**: Gestión completa del carrito
- **Checkout**: Proceso de compra
- **Sistema de Membresía**: Acceso premium a contenido exclusivo
- **Panel de Administración**: Dashboard completo para gestión
- **Comunidad**: Página de comunidad
- **Diseño Responsivo**: Funciona en desktop y móvil
- **UI Moderna**: Componentes shadcn/ui con TailwindCSS

##  Scripts

### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Iniciar con nodemon (desarrollo)
```

### Frontend
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Previsualizar build de producción
npm run lint       # Ejecutar ESLint
```



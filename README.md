# Este es mi proyecto para TFG de Desarrollo Web.

#Tecnologias usadas

Frontend: 
- Next.js
- React
- Tailwind CSS

Backend:
- Node.js
- Express.js
- PostgreSQL
- JWT para autenticación
- Stripe en modo test.

#Funcionalidades principales

- Registro y login diferenciando entre **profesor** y **estudiante**
- Publicación de perfiles de profesor con experiencia y materias
- Buscador de profesores con detalle por perfil
- Reserva de clases con calendario y validaciones
- Visualización y gestión de clases reservadas
- Sistema de chat entre estudiante y profesor tras la reserva
- Cancelación de clases y visualización de clases pasadas
- Redirección automática tras login según rol
- Navbar dinámico
- Despliegue posible en Vercel (frontend) y Render (backend)

#Instalacion local 

Vamos con los requisitos previos:
- Node.js v18 o superior
- PostgreSQL instalado y corriendo localmente
- npm

#En primer lugar hay que clonar el repositorio:
```bash
git clone https://github.com/TU_USUARIO/clases-particulares.git
cd clases-particulares

# En segundo lugar se configura el backend:
cd backend
cp .env.example .env
npm install

Y hay que editar el archivo .env con tus valores:
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clases_particulares
DB_USER=postgres
DB_PASSWORD=tu_contraseña
JWT_SECRET=clave_secreta
STRIPE_SECRET_KEY=sk_test_XXXX

Luego crea la base de datos y ejecuta el script: node index.js

# En tercer lugar hay que configurar el frontend:

cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev

# Hay que asegurarse de que el valor de NEXT_PUBLIC_API_URL en env.local.example apunta a: http://localhost:4000

# Hay una opción de despliegue implementada de forma opcional: 

Vercel (frontend) donde se puede conectar la carpeta del frontend y configurar la NEXT_PUBLIC_API_URL como variable de entorno.
Render (Backend) subiendo la carpeta del backend, creando un servicio web de Node.js y configurando las variables de entorno de forma manual. 

#La estructura del proyecto es la siguiente:

clases-particulares/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   ├── index.js
│   └── .env.example
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── public/
│   └── .env.local.example
└── README.md

# Las funcionalidades que hemos completado son las siguientes:
- Login y registro funcional.
- Búsqueda y reserva de clases.
- Gestión de clases según el usuario.
- Sistema de chat privado por clase.
- Panel principal y navbar dinámico.
- Panel de reservas y clases pagadas.
- Control de acceso y rutas protegidas.

# Licencia y autoría

Trabajo final de grado- Universitat Oberta de Catalunya
Autor: Juan María Ramirez Carrasco
Curso: 2024-2025
Área: Desarrollo Web
Repositorio: 


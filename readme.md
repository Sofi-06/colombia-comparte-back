# Backend del proyecto

> Parte 1: Instalaciones

mkdir cms-multipais
cd cms-multipais
mkdir backend
cd backend

1. npm init -y
2. npm install express cors dotenv @supabase/supabase-js bcryptjs jsonwebtoken
3. npm install nodemon -D

> Parte 2: Actualizar el archivo package.json

{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/app.js",
  "scripts": {
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

> Parte 3: Estructura inicial del src para el backend

backend/
├── src/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   └── authController.js
│   ├── services/
│   │   └── authService.js
│   ├── repositories/
│   │   └── authRepository.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   └── app.js
├── .env
└── package.json


> Parte 4: Script SQL para Supabase (SQL Editor)
create table paises (
  id bigint generated always as identity primary key,
  nombre text not null,
  codigo text not null unique,
  slug text not null unique,
  estado text not null default 'activo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table roles (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  descripcion text,
  created_at timestamptz default now()
);

create table usuarios (
  id bigint generated always as identity primary key,
  nombre text not null,
  apellido text not null,
  email text not null unique,
  username text not null unique,
  password_hash text not null,
  rol_id bigint not null references roles(id),
  pais_id bigint references paises(id),
  estado text not null default 'activo',
  ultimo_acceso timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

> Parte 5: Insertamos datos iniciales

insert into paises (nombre, codigo, slug) values
('Colombia', 'CO', 'colombia'),
('Chile', 'CL', 'chile'),
('Ecuador', 'EC', 'ecuador');

insert into roles (nombre, descripcion) values
('superadmin', 'Administrador general del sistema'),
('admin_pais', 'Administrador de un país específico'),
('editor', 'Usuario editor de contenidos');


> Parte 6: Configurar el archivo .env
PORT=3001
SUPABASE_URL=URL_DE_SUPABASE
SUPABASE_SERVICE_ROLE_KEY=SERVICE_ROLE_KEY
JWT_SECRET=clave_segura_cms_usta_multipais_2026

> ruta:
- SUPABASE_URL:
project settings/ Data API/ API URL (Copy)
- SUPABASE_KEY
project settings/ API keys/ Legacy anon, service_role API keys/ service_role secret/ copy


> Parte 7: Archivos del proyecto
src/config/supabase.js
src/repositories/authRepository.js
src/services/authService.js
src/controllers/authController.js
src/routes/authRoutes.js
src/middlewares/authMiddleware.js
src/app.js

> Ejecutar el backend
npm run dev


> Parte 8: script de inicialización (seed) para crear el superadmin

- Crear carpeta scripts
mkdir src/scripts

- Crear archivo
src/scripts/createSuperAdmin.js

- Ejecutar el script Desde /backend:
node src/scripts/createSuperAdmin.js

> Parte 9: Probar login en Postman

- Método:
POST http://localhost:3001/api/auth/login

- Body/ raw/ json:
{
  "username": "superadmin",
  "password": "123456"
}

- Respuesta esperada:
{
  "message": "Inicio de sesión exitoso",
  "token": "...",
  "user": {
    "id": 1,
    "nombre": "Sergio",
    "apellido": "Puerto",
    "email": "sergio@demo.com",
    "username": "sergio",
    "rol": "superadmin",
    "pais": null
  }
}
> Con esto queda creado el login base del CMS administrativo multipaís con JWT.


> PARTE 10: Crear la ruta protegida de autenticación para probar que el JWT funciona.
- Crear src/controllers/profileController.js
- Crear src/routes/profileRoutes.js
- Modificar app.js

> Probar en postman:
- Probar ruta del login/ copiar el token

- Probar ruta protegida de perfil
Header:
GET http://localhost:3001/api/profile/me

- Authorization/ Bearer TOKEN (pegar el token generado del login)

> Parte 11: crear la ruta del RBAC: control de acceso basado en roles.

con esto se puede lograr:
+ login con JWT
+ middleware de autenticación
+ middleware de roles
+ protección por rol

- Crear src/middlewares/roleMiddleware.js

- Crear una ruta protegida de prueba:
src/controllers/adminController.js
src/routes/adminRoutes.js

- Actualizar app.js

- probar en postman la ruta del panel administrativo

1. hacer el login:
- Header:
POST http://localhost:3001/api/auth/login
- Body/ raw/ json:
{
  "username": "superadmin",
  "password": "123456"
}

2. copiar el token

3. Probar ruta protegida de panel administrativo 
- Header:
GET http://localhost:3001/api/admin/panel
- Authorization/ Bearer TOKEN (pegar el token generado del login)

> Parte 12: crear el módulo de usuarios:
servirá para que el superadmin cree administradores por país y editores, reutilizando JWT y RBAC.

- Objetivo
Permitir que el superadmin pueda:
+ listar usuarios
+ crear usuarios
+ asignar rol
+ asignar país
+ activar/inactivar usuarios

1. se crean los archivos:
src/
├── controllers/
│   └── userController.js
├── repositories/
│   └── userRepository.js
├── services/
│   └── userService.js
└── routes/
    └── userRoutes.js

src/repositories/userRepository.js
src/services/userService.js
src/controllers/userController.js
src/routes/userRoutes.js
Actualizar en app.js

- Probar en Postman:

1. Listar usuarios
GET http://localhost:3001/api/users
- Authorization/ Bearer TOKEN (pegar el token generado del login)

2. Crear admin de Colombia:
- POST 
http://localhost:3001/api/users

- Headers:
Authorization: Bearer TOKEN
Content-Type: application/json

Body/ raw/JSON:
{
  "nombre": "Admin",
  "apellido": "Colombia",
  "email": "admin.co@cms.com",
  "username": "admin_colombia",
  "password": "123456",
  "rol_id": 2,
  "pais_id": 1
}

1. Crear admin de Chile:
{
  "nombre": "Admin",
  "apellido": "Chile",
  "email": "admin.cl@cms.com",
  "username": "admin_chile",
  "password": "123456",
  "rol_id": 2,
  "pais_id": 2
}

1. Crear editor de Ecuador:
{
  "nombre": "Editor",
  "apellido": "Ecuador",
  "email": "editor.ec@cms.com",
  "username": "editor_ecuador",
  "password": "123456",
  "rol_id": 3,
  "pais_id": 3
}

> Parte 13: módulo lógico países: para consultar los países disponibles y usarlos al crear usuarios.

¿Para qué nos sirve este módulo?
  Este módulo será usado para:
+ cargar países en formularios
+ asignar país a usuarios
+ filtrar noticias
+ filtrar testimonios
+ filtrar solicitudes de contacto
+ controlar el alcance del admin_pais y del editor


1. Crear archivos:
src/
├── controllers/
│   └── countryController.js
├── repositories/
│   └── countryRepository.js
├── services/
│   └── countryService.js
└── routes/
    └── countryRoutes.js

src/repositories/countryRepository.js
src/services/countryService.js
src/controllers/countryController.js
src/routes/countryRoutes.js
Actualizar app.js

- Probar en Postman:

1. login con superadmin
- POST http://localhost:3001/api/auth/login
- Body:

{
  "username": "superadmin",
  "password": "123456"
}

- Copia el token.

2. Listar todos los países:
- GET http://localhost:3001/api/countries
- Header:
Authorization: Bearer TOKEN

3. Listar países activos:
- GET http://localhost:3001/api/countries/active
- Header:
Authorization: Bearer TOKEN

> Parte 14: 
> Crear el primer módulo de contenido del CMS: noticias.
Lo haremos con filtros por rol y país, para que superadmin vea todo y admin_pais/editor solo gestionen su portal.

Con este módulo tenemos:
+ crear noticias
+ listar noticias
+ editar noticias
+ eliminar noticias
+ filtrar por país según rol
+ proteger rutas con JWT
+ controlar permisos con RBAC


> Tabla noticias (supabase)
create table noticias (
  id bigint generated always as identity primary key,
  pais_id bigint not null references paises(id) on delete cascade,
  titulo text not null,
  slug text not null,
  resumen text not null,
  contenido text not null,
  imagen_principal_url text,
  autor_id bigint not null references usuarios(id),
  estado text not null default 'borrador',
  fecha_publicacion timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint noticias_estado_check check (estado in ('borrador', 'publicado', 'despublicado')),
  constraint noticias_slug_pais_unique unique (pais_id, slug)
);

> Crear archivos
src/
├── controllers/
│   └── newsController.js
├── repositories/
│   └── newsRepository.js
├── services/
│   └── newsService.js
└── routes/
    └── newsRoutes.js

src/repositories/newsRepository.js
src/services/newsService.js
src/controllers/newsController.js
src/routes/newsRoutes.js
Actualizar app.js

> Probar en Postman:
1. login con superadmin.
- POST http://localhost:3001/api/auth/login
- Body:

{
  "username": "superadmin",
  "password": "123456"
}

- Copia el token.

2. Crear noticia
- POST http://localhost:3001/api/news

- Headers:
Authorization: Bearer TOKEN
Content-Type: application/json

- Body/raw/JSON:
{
  "pais_id": 1,
  "titulo": "Nueva jornada de formación en Colombia",
  "resumen": "Se anuncia una nueva jornada de formación para participantes del portal Colombia.",
  "contenido": "Contenido completo de la noticia relacionada con la jornada de formación.",
  "imagen_principal_url": "https://placehold.co/800x400",
  "estado": "publicado"
}

3. Listar noticias:
GET http://localhost:3001/api/news

4. Editar noticia:
- PUT http://localhost:3001/api/news/1

- Body:
{
  "titulo": "Jornada de formación actualizada",
  "estado": "borrador"
}

5. Eliminar noticia:
- DELETE http://localhost:3001/api/news/1

6. Endpoint PÚBLICO para ver las noticias publicadas

GET /api/public/news/:countrySlug
+ NO requiere login
+ Solo noticias publicadas
+ Filtradas por país

- Público:
GET http://localhost:3001/api/news/public/colombia

- Detalle público:
GET http://localhost:3001/api/news/public/colombia/nueva-jornada-de-formacion-en-colombia

- Admin:
GET http://localhost:3001/api/news
Authorization: Bearer TOKEN


> Parte 15: 
> Crear el siguiente módulo de contenido del CMS: testimonios de éxito.

> Tabla testimonios (SQL editor supabase):
create table testimonios (
  id bigint generated always as identity primary key,
  pais_id bigint not null references paises(id) on delete cascade,
  nombre text not null,
  cargo text,
  empresa text,
  contenido text not null,
  foto_url text not null,
  instagram_url text,
  facebook_url text,
  estado text not null default 'borrador',
  destacado boolean not null default false,
  autor_id bigint not null references usuarios(id),
  fecha_publicacion timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint testimonios_estado_check check (estado in ('borrador', 'publicado', 'despublicado'))
);

> Crear archivos
src/
├── controllers/
│   └── testimonialController.js
├── repositories/
│   └── testimonialRepository.js
├── services/
│   └── testimonialService.js
└── routes/
    └── testimonialRoutes.js

src/repositories/testimonialRepository.js
src/services/testimonialService.js
src/controllers/testimonialController.js
src/routes/testimonialRoutes.js
Actualizar app.js

> Probar en Postman

1. Login con superadmin

- POST http://localhost:3001/api/auth/login
- Body:

{
  "username": "superadmin",
  "password": "123456"
}

- Copia el token.

2. Crear testimonio
- POST http://localhost:3001/api/testimonials

- Headers:
Authorization: Bearer TOKEN
Content-Type: application/json

- Body/raw/json:

{
  "pais_id": 1,
  "nombre": "Laura Martínez",
  "cargo": "Participante",
  "empresa": "Colombia Comparte",
  "contenido": "Gracias al programa pude fortalecer mis habilidades y conectar con nuevas oportunidades.",
  "foto_url": "https://i.pravatar.cc/200?img=12",
  "instagram_url": "https://instagram.com/laura",
  "facebook_url": "https://facebook.com/laura",
  "estado": "publicado",
  "destacado": true
}

3. Listar testimonios admin
- GET 
http://localhost:3001/api/testimonials

- Header:
Authorization: Bearer TOKEN

4.  Listar testimonios públicos por país
GET http://localhost:3001/api/testimonials/public/colombia

5. Editar testimonio
PUT http://localhost:3001/api/testimonials/1

- Header:
Authorization: Bearer TOKEN

Body:

{
  "contenido": "Testimonio actualizado desde el panel administrativo.",
  "estado": "publicado",
  "destacado": false
}


6. Eliminar testimonio
- DELETE http://localhost:3001/api/testimonials/1

- Header:
Authorization: Bearer TOKEN



> Parte 16: 
> Crear el siguiente módulo de contenido del CMS: solicitudes de contacto.

>Tabla solicitudes_contacto (Supabase SQL editor):
create table solicitudes_contacto (
  id bigint generated always as identity primary key,
  pais_id bigint not null references paises(id) on delete cascade,
  nombre text not null,
  correo text not null,
  telefono text not null,
  finalidad text not null,
  mensaje text,
  estado text not null default 'pendiente',
  observaciones_admin text,
  fecha_gestion timestamptz,
  gestionado_por bigint references usuarios(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint solicitudes_estado_check check (
    estado in ('pendiente', 'en_proceso', 'gestionada', 'cerrada')
  ),
  constraint solicitudes_finalidad_check check (
    finalidad in ('Servicio', 'Programa EDIFICA', 'Shows y conferencias')
  )
); 

> Crear archivos
src/
├── controllers/
│   └── contactRequestController.js
├── repositories/
│   └── contactRequestRepository.js
├── services/
│   └── contactRequestService.js
└── routes/
    └── contactRequestRoutes.js

src/repositories/contactRequestRepository.js
src/services/contactRequestService.js
src/controllers/contactRequestController.js
src/routes/contactRequestRoutes.js
Actualizar app.js

> Probar en Postman

1. Crear solicitud pública

No requiere token.

- POST http://localhost:3001/api/contact-requests/public

- Body:
{
  "pais_id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@email.com",
  "telefono": "3001234567",
  "finalidad": "Servicio",
  "mensaje": "Deseo recibir información sobre los servicios disponibles."
}

2. Listar solicitudes admin

Requiere token.

- GET http://localhost:3001/api/contact-requests

- Header:
Authorization: Bearer TOKEN

3. Cambiar estado de solicitud

- PUT http://localhost:3001/api/contact-requests/1/status

- Header:
Authorization: Bearer TOKEN

- Content-Type: application/json

Body/ raw/ json:

{
  "estado": "gestionada",
  "observaciones_admin": "Solicitud respondida por correo electrónico."
}


4. Eliminar solicitud
- DELETE http://localhost:3001/api/contact-requests/1

- Header:
Authorization: Bearer TOKEN

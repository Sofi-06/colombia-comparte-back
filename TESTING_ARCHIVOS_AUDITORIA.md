# Testing Archivos y Auditoría

## 1. Login (obtener token)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "123456"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "nombre": "Super",
    "apellido": "Admin",
    "email": "admin@cms.com",
    "username": "superadmin",
    "rol": "superadmin",
    "pais": null
  }
}
```

Copia el `token` para los siguientes requests.

---

## 2. Subir archivo (POST /api/archivos/upload)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X POST http://localhost:3001/api/archivos/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "archivo=@/ruta/a/tu/archivo.pdf" \
  -F "modulo=noticias" \
  -F "referencia_id=1"
```

**O con un archivo de prueba:**
```bash
TOKEN="<pega-aqui-el-token>"

# Crear archivo de prueba
echo "Contenido de prueba" > test.txt

# Subir
curl -X POST http://localhost:3001/api/archivos/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "archivo=@test.txt" \
  -F "modulo=testimonios" \
  -F "referencia_id=5"
```

**Respuesta esperada:**
```json
{
  "message": "Archivo subido correctamente",
  "data": {
    "id": 1,
    "nombre_archivo": "test.txt",
    "url": "https://..../storage/v1/object/public/archivos/testimonios/1715700000000-uuid-test.txt",
    "tipo_archivo": "text/plain",
    "modulo": "testimonios",
    "referencia_id": 5,
    "subido_por": 1,
    "created_at": "2026-05-14T10:30:00.000Z"
  }
}
```

---

## 3. Listar archivos (GET /api/archivos)

```bash
TOKEN="<pega-aqui-el-token>"

# Listar todos los archivos del usuario
curl -X GET http://localhost:3001/api/archivos \
  -H "Authorization: Bearer $TOKEN"
```

**O filtrar por módulo:**
```bash
TOKEN="<pega-aqui-el-token>"

curl -X GET "http://localhost:3001/api/archivos?modulo=noticias" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Obtener detalle de archivo (GET /api/archivos/:id)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X GET http://localhost:3001/api/archivos/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Eliminar archivo (DELETE /api/archivos/:id)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X DELETE http://localhost:3001/api/archivos/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "message": "Archivo eliminado correctamente"
}
```

---

## 6. Crear noticia (se registra en auditoría)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X POST http://localhost:3001/api/news \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pais_id": 1,
    "titulo": "Noticia de Prueba",
    "resumen": "Resumen de la noticia",
    "contenido": "Contenido completo de la noticia",
    "imagen_principal_url": "https://placehold.co/800x400",
    "estado": "publicado"
  }'
```

**La auditoría registrará: `CREAR_NOTICIA` en módulo `noticias`**

---

## 7. Crear usuario (se registra en auditoría)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@test.com",
    "username": "juanperez",
    "password": "Password123",
    "rol_id": 2,
    "pais_id": 1
  }'
```

**La auditoría registrará: `CREAR_USUARIO` en módulo `usuarios`**

---

## 8. Cambiar contraseña (se registra en auditoría)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X PUT http://localhost:3001/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password_actual": "123456",
    "nueva_password": "NewPassword123"
  }'
```

**La auditoría registrará: `CAMBIAR_CONTRASENA` en módulo `auth`**

---

## 9. Actualizar noticia (se registra en auditoría)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X PUT http://localhost:3001/api/news/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Noticia Actualizada",
    "estado": "borrador"
  }'
```

**La auditoría registrará: `ACTUALIZAR_NOTICIA` en módulo `noticias`**

---

## 10. Cambiar estado de noticia (se registra en auditoría)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X PATCH http://localhost:3001/api/news/1/estado \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "publicado"
  }'
```

**La auditoría registrará: `CAMBIAR_ESTADO_NOTICIA` en módulo `noticias`**

---

## 11. Eliminar noticia (se registra en auditoría)

```bash
TOKEN="<pega-aqui-el-token>"

curl -X DELETE http://localhost:3001/api/news/1 \
  -H "Authorization: Bearer $TOKEN"
```

**La auditoría registrará: `ELIMINAR_NOTICIA` en módulo `noticias`**

---

## Tabla de acciones registradas en auditoría

| Acción | Módulo | Endpoint | Método |
|--------|--------|----------|--------|
| INICIO_SESION | auth | /api/auth/login | POST |
| CAMBIAR_CONTRASENA | auth | /api/auth/change-password | PUT |
| CAMBIAR_PREGUNTA_SEGURIDAD | auth | /api/auth/security-question | PATCH |
| CREAR_USUARIO | usuarios | /api/users | POST |
| ACTUALIZAR_USUARIO | usuarios | /api/users/:id | PATCH |
| CAMBIAR_PASSWORD_USUARIO | usuarios | /api/users/:id/password | PUT |
| ELIMINAR_USUARIO | usuarios | /api/users/:id | DELETE |
| CREAR_NOTICIA | noticias | /api/news | POST |
| ACTUALIZAR_NOTICIA | noticias | /api/news/:id | PUT |
| CAMBIAR_ESTADO_NOTICIA | noticias | /api/news/:id/estado | PATCH |
| ELIMINAR_NOTICIA | noticias | /api/news/:id | DELETE |
| CREAR_TESTIMONIO | testimonios | /api/testimonials | POST |
| ACTUALIZAR_TESTIMONIO | testimonios | /api/testimonials/:id | PUT |
| CAMBIAR_ESTADO_TESTIMONIO | testimonios | /api/testimonials/:id/estado | PATCH |
| ELIMINAR_TESTIMONIO | testimonios | /api/testimonials/:id | DELETE |
| ACTUALIZAR_SOLICITUD | solicitudes_contacto | /api/contact-requests/:id | PUT |
| CAMBIAR_ESTADO_SOLICITUD | solicitudes_contacto | /api/contact-requests/:id/status | PUT |
| ELIMINAR_SOLICITUD | solicitudes_contacto | /api/contact-requests/:id | DELETE |
| SUBIR_ARCHIVO | archivos | /api/archivos/upload | POST |
| ELIMINAR_ARCHIVO | archivos | /api/archivos/:id | DELETE |

---

## Notas importantes

- **IP**: Se captura automáticamente desde `req.ip`
- **Usuario**: Se obtiene del JWT en el token
- **Timestamp**: Se registra automáticamente en Supabase con `created_at`
- **Superadmin**: Ve todos los archivos; otros roles solo ven los suyos
- **Bucket**: El archivo se sube a Supabase Storage en `archivos/[módulo]/[timestamp]-[uuid]-[nombre]`
- **Auditoría silenciosa**: Si la tabla `bitacora_auditoria` no existe, el backend solo advierte en consola, no falla la acción principal

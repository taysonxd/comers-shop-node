# 🛒 EcomSecure — Ecommerce fullstack con autenticación backend-driven

Comers Shop es una aplicación ecommerce construida con Next.js 15 y Express, que implementa un sistema de autenticación robusto y modular. Los tokens se manejan exclusivamente en el backend mediante cookies, con rotación segura y validación server-side. El frontend aprovecha el entorno server first para flujos desacoplados y seguros.

---

## 🧰 Tecnologías utilizadas

| Tecnología     | Justificación breve |
|----------------|---------------------|
| **Typescript** | Para llevar control preciso de los datos que se mueven a traves de la aplicacion y permitir unaa mejor depuracion de codigo y errores |
| **Express.js** | Backend modular con middleware desacoplado y lógica de reemisión segura |
| **Prisma ORM** | Acceso a base de datos tipado, migraciones y control de tokens de acceso |
| **JWT**        | Autenticación frontend-backend-driven con tokens JWT |

---

## 🛠️ Instrucciones para levantar el proyecto (local y producción)

### 1. Requerimientos previos

- Node.js ≥ 18
- PostgreSQL
- Npm

### 2. Instalación de dependencias

```bash
npm install
```

### 3. Configuración de variables de entorno

Archivos de entorno disponibles en la raiz del proyecto con las variables de entorno requeridas para levantar la aplicación

```bash
Local
.env.local.template

Produccion
.env.production.template
```

### 4. Ejecución de migraciones y seed

Al tener tener establecida la variable de entorno DATABASE_URL para conectar con la base de datos POSTGRESQL generar la base de datos con las migraciones de Prisma

```bash
## IMPORTANTE: ejecutar en este punto para que el cliente de Prisma este sincronizado con la base de datos y pueda interactuar con ella
# Generar el cliente de prisma justo despues de la instalacion de dependencias
npx prisma generate
```

```bash
#Entorno de desarollo
npx prisma migrate dev

#Entorno de producción
npx prisma migrate deploy
```

Ejecutar el script seed para poblar las tablas 

```bash
npm run seed
```

Para crear credenciales de prueba ejecutar el siguiente script

```bash
npm run seed:user

#Retorno esperado
✅ Usuario de prueba creado
email: demo@comershop.com
token de acceso para pruebas: [token generado]
```

### 5. Inicio de servidor backend

Teniendo la base de datos creada y en linea levantar el servidor de backend

```bash
#Entorno de desarrollo
    npm run dev
#Entorno de desarrollo

#Entorno de produccion
    #Iniciar la aplicacion usando PM2 
    pm2 start npm --name backend -- run start

    #Guardar configuración de PM2
    #Para el reinicio automático de los procesos si el servidor se reinicia
    pm2 save
    pm2 startup

    #Para verificar estado y logs de los procesos levantados
    pm2 list
    pm2 logs
#Entorno de produccion
```

### 6. Endpoints disponibles

```bash
/api/auth
    post -/google  # Autenticacion OAuth mediante Google
    (autenticada) post -/signOut # Elimina los tokens de autenticacion de JWT para invalidar la sesión
/api/products
    get  -/ # Listado de productos
    (autenticada) post -/ # Creacion de producto
/api/cart
    get  -/ # Listado de articulos en el carrito de compra
    (autenticada) post -/ # Agregar articulo al carrito de compra
    (autenticada) put  -/ # actualizar las cantidades de un articulo en el carrito de compra
    (autenticada) delete -/:itemId # Eliminacion de articulo del carrito de compra
```

### 7. Enlace de demo actualmente en linea

[https://comers-shop-node-production.up.railway.app/](https://comers-shop-node-production.up.railway.app/)


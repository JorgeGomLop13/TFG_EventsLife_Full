# EventsLife

## Descripción

Mi proyecto consiste en un marketplace de experiencias locales llamado **EventsLife**, donde se conectan organizadores de eventos con personas interesadas en asistir.

La web permite que los organizadores publiquen sus eventos con toda la información detallada: descripción, duración, precio, localización, aforo máximo, etc. Los usuarios asistentes pueden apuntarse a los eventos que más les interesen.

Se diferencian dos tipos de usuarios:

- **Organizadores:**  
  Pueden gestionar sus eventos desde un panel de control, actualizar información, y en el futuro, tendrán un sistema de suscripción mensual para publicar eventos.

- **Asistentes:**  
  Pueden buscar y filtrar eventos por nombre o categoría, reservar plazas hasta completar aforo, y ver cuándo un evento ya no está disponible o está completo.

Además, hay un rol único de **administrador** que puede gestionar organizadores y eventos para garantizar el cumplimiento legal y ético.

**Pagos:**  
Se usa la API de Stripe para pagos seguros, y los organizadores deben vincular su cuenta Stripe para recibir pagos.

---

## Alcance

- Registro e inicio de sesión para asistentes y organizadores  
- Formulario para publicar eventos  
- Búsqueda y filtrado por nombre o categoría  
- Control de aforo en reservas  
- Panel de gestión para organizadores (editar, eliminar eventos)  
- Pagos seguros con Stripe  
- Envío de correos con entradas a asistentes  
- Edición de perfil (nombre, foto)  
- Traducción a español e inglés  
- Diseño responsive para todos los dispositivos  

### Mejoras posibles a futuro

- Integración con Google Maps para ubicación de eventos  
- Validación por correo electrónico mediante códigos  
- Ampliar cobertura geográfica más allá de Sevilla  

---

## Alternativas existentes en el mercado

| Plataforma     | Características principales                                     | Diferencias con EventsLife                                   |
|----------------|----------------------------------------------------------------|--------------------------------------------------------------|
| OnSevilla      | Información de eventos en Sevilla                              | No permite reservas ni pagos; solo informa                    |
| Fever          | Grandes eventos con acceso restringido para empresas           | EventsLife permite publicar a cualquier organizador pequeño  |
| Visita Sevilla | Portal turístico informativo                                   | No gestiona reservas ni pagos, está orientado a turistas     |

---

## Stack tecnológico

| Parte       | Tecnología                |
|-------------|--------------------------|
| Frontend    | Angular, SCSS, Tailwind   |
| Backend     | Laravel (PHP)             |
| Base datos  | MySQL                    |
| Adicionales | Stripe (pagos), Resend (emails), GitHub (versionado) |

---

## Objetivos

- Conectar organizadores de eventos locales con asistentes  
- Crear un marketplace intuitivo para promocionar pequeños negocios  
- Implementar pagos rápidos y seguros mediante Stripe  

---

## Requisitos del sistema

### Funcionales

- Gestión de usuarios: registro, inicio sesión, roles organizador/asistente  
- Gestión de eventos: creación, modificación y eliminación  
- Pagos: confirmación mediante Stripe  
- Control de aforo: eventos visibles con cartel cuando estén completos  
- Búsqueda y filtrado por nombre o categoría  
- Envío de correo con entradas a asistentes  

### No funcionales

- Tiempo de respuesta máximo: 4 segundos  
- Seguridad en pagos y datos  
- Soporte para 200-500 usuarios concurrentes  

### Interfaz

- UI clara y fácil de usar  
- Diseño responsive para móviles y pantallas diversas  
- Mensajes de confirmación en pagos y reservas  

---

### Variables de entorno

Copia el archivo `.env.example` a `.env` y actualiza las variables con tus credenciales reales:

```bash
cp .env.example .env
```

Este proyecto contiene dos carpetas principales:

- `EventsLife_back`: Backend (Laravel)
- `jenga`: Frontend (Angular)

### ⚙️ Instalación

1. Clona el repositorio  
   ```bash
   git clone https://github.com/JorgeGomLop13/TFG_EventsLife_Full.git
   cd events-life-fullhaz
   ```
2.  Instala las dependencias del backend:
    ```bash
    cd EventsLife_back
    npm install
    ```
3. Instala las dependencias del frontend:
   ```bash
   cd jenga
   npm install
   ```
4. Levanta la base de datos:
   ```bash
   cd EventsLife_back
   php artisan serve
   ```
5. Levanta el frontend:
   ```bash
   cd jenga
   ng serve
   ```


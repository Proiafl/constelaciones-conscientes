# Constelaciones Conscientes

Plataforma web para servicios de terapia sistémica y Constelaciones Familiares.

## Características

- **Landing Page Completa:** Diseño moderno y responsive con secciones de servicios, testimonios y contacto.
- **Reservas:** Formulario de contacto integrado con Supabase para gestión de consultas.
- **Pagos Online:** Integración con MercadoPago para automatizar el cobro de sesiones.
- **Backend:** Supabase (PostgreSQL + Edge Functions).

## Tecnologías

- **Frontend:**
  - Vite
  - React + TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Framer Motion

- **Backend:**
  - Supabase Database
  - Supabase Edge Functions (Deno)

## Configuración Local

1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar variables de entorno `.env`:
    ```env
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...
    ```
4.  Iniciar servidor de desarrollo:
    ```bash
    npm run dev
    ```

## Despliegue

El proyecto está listo para desplegar en Vercel, Netlify o cualquier host de estáticos. Asegúrate de configurar las variables de entorno en el panel de control del hosting.

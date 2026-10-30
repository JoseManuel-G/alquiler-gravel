# Ski Match

Comunidad para compartir esquí y snowboard. Next.js App Router, React, TypeScript, Tailwind y Supabase. Diseño responsive con navegación inferior en móvil.

## Desarrollo

Node 24 (ver `.nvmrc`).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Sin variables de Supabase funciona el catálogo de lanzamiento, las páginas de estaciones y la navegación. Los formularios explican que la comunidad está pendiente de activación; no hay cuentas, viajes, matches o chats simulados. El único perfil ficticio está identificado como demostración en la portada.

## Activar Supabase sin afectar a otros proyectos

1. Crea **un proyecto nuevo** en tu cuenta Supabase, dedicado a Ski Match. No ejecutes el esquema en un proyecto de otra aplicación.
2. En su SQL Editor ejecuta **una sola vez** `supabase/schema.sql`. Crea tablas, índices, RLS, funciones y las tres estaciones iniciales. La operación es transaccional; no es una migración idempotente sobre un esquema existente.
3. En Authentication → Providers activa email y **Confirm email**. Configura SMTP de producción y sus límites de envío antes de abrir el registro.
4. En Authentication → URL Configuration configura Site URL con tu dominio real de Vercel, y añade `https://TU-DOMINIO/cuenta` como Redirect URL permitida. En desarrollo puedes permitir también la ruta `/cuenta` de tu servidor local. No abras comodines de dominios arbitrarios.
5. En Vercel → Project → Settings → Environment Variables añade:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto nuevo.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave **pública publishable** de ese proyecto. También se admite la clave legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - `NEXT_PUBLIC_SITE_URL`: origen real de producción, por ejemplo `https://tu-proyecto.vercel.app`, sin barra final. Se usa para generar el sitemap.
6. Vuelve a desplegar en Vercel. Las variables públicas se incorporan al bundle durante la compilación. No basta con añadirlas sin un nuevo despliegue.
7. Prueba dos cuentas con emails verificables: registro → confirmación → perfil completo (18+) → viajes coincidentes → conexión → aceptación → chat. Prueba recuperación de contraseña y cierre de sesión. Prueba también crear un plan y aprobar una solicitud desde la cuenta organizadora.

**Nunca uses `service_role` o una clave secret en variables `NEXT_PUBLIC_*`, el navegador o el repositorio.** No necesitas compartir contraseñas ni claves privadas con el asistente.

Con Supabase configurado, las estaciones se leen desde la tabla `resorts`, sin ocultar errores de base de datos con datos de demostración. Para añadir estaciones, inserta filas con slug único, descripción, URL HTTPS de imagen con licencia y URL oficial; las páginas dinámicas aparecen sin cambiar código. La clave primaria UUID relaciona cada estación con viajes y planes.

## Funcionalidades

- Portada visual, buscador de destino/fecha/nivel y páginas de cada estación.
- Supabase Auth: email/contraseña, verificación, recuperación y cierre de sesión.
- Perfil: nombre, edad derivada, nivel, modalidad, biografía, preferencias y subida de foto con vista previa (JPG/PNG/WebP, hasta 5 MB).
- Viajes con búsqueda por solapamiento inclusivo de fechas, filtro de nivel y publicación/eliminación del propio viaje.
- Solicitudes de conexión únicas por pareja. Solo el destinatario puede aceptar/rechazar; una conexión aceptada habilita el chat.
- Chat privado persistente, actualizado cada cinco segundos. Se muestran los últimos 100 mensajes. Eliminar la conexión elimina su conversación.
- Planes con capacidad total, solicitudes y aprobación por el organizador. Las plazas se comprueban en una función transaccional con bloqueo para evitar sobreocupación.
- RLS: visitantes solo ven estaciones; miembros verificados con perfil completo ven viajes y perfiles públicos; cada participante solo ve sus conexiones, mensajes y solicitudes permitidas. Fecha de nacimiento y email no están en la vista pública.

## Validación

```bash
npm run lint
npm test
npm run build
npm start
```

`npm test` ejecuta el SQL real en PostgreSQL embebido (PGlite) y verifica aislamiento de usuarios, emails no confirmados, solapamiento de viajes, consentimiento antes del chat, suplantación de remitente, aprobación de planes y límite de plazas. Emula el contrato mínimo `auth.users`/`auth.uid()` de Supabase; **no sustituye** la validación de Auth/email/red contra un proyecto Supabase real.

El lockfile fija las versiones. No hay requisito de base de datos para compilar la portada sin integración. No ejecutes build y dev simultáneamente sobre la misma `.next`.

## Publicación

El README anterior indicaba que Vercel está conectado a `main`. Subir a `main` activa el despliegue si esa integración sigue habilitada; un push exitoso no confirma por sí solo que Vercel haya desplegado correctamente. No se modifica la configuración de tus otros proyectos Supabase. La rama principal no incluye secretos.

## Estado y límites del lanzamiento

- El documento recibido termina en «Preparar la posibilidad» dentro del apartado de autenticación. Se implementa el alcance disponible; cualquier contenido posterior no se ha recibido.
- Hay que crear/configurar el proyecto Supabase y las variables en Vercel para activar la comunidad. Sin ellas el sitio se mantiene explícitamente en preapertura.
- La integración real de Supabase Auth y los emails necesita validación con ese proyecto; las pruebas locales validan la lógica SQL y RLS.
- Las fotos son paisajes alpinos ilustrativos de Unsplash, **no fotografías verificadas de cada estación**. Se indica en las páginas. No se sirven condiciones meteorológicas ni estadísticas inventadas. Antes del lanzamiento sustituye las fotos por imágenes verificadas de cada estación con licencia y atribución. Consulta `ASSETS.md`.
- Completar identidad y contacto del operador, textos legales definitivos, canal de atención/moderación y procedimiento de exportación/eliminación de cuentas antes del registro público. Las páginas informativas son borradores transparentemente marcados, no asesoramiento legal.
- No hay notificaciones push/email para matches, geolocalización, pagos ni meteorología en vivo.
- Para escalar, añadir paginación de perfiles/planes, límites de uso, observabilidad, moderación y gestión de imágenes. El chat usa polling; no requiere configurar Realtime.

## Fotos de perfil

Después del esquema inicial, ejecuta `supabase/avatars.sql` en el SQL Editor del proyecto dedicado a Ski Match. No vuelvas a ejecutar `schema.sql` si ya está instalado. El archivo adicional se puede repetir y configura exclusivamente el bucket privado `avatars` y sus políticas.

Cada usuario sube y elimina solo archivos de su carpeta UUID. Solo el propietario o miembros con perfil completo pueden leer fotos mediante enlaces firmados de diez minutos. El límite de 5 MB y los tipos JPG/PNG/WebP se validan también en Storage. Las fotos nuevas se guardan al pulsar «Guardar perfil»; si falla el guardado del perfil se intenta retirar la subida. La eliminación de archivos antiguos es de mejor esfuerzo; para borrar cuentas hay que retirar también sus objetos de Storage.

La cabecera y la navegación móvil muestran la sesión activa; Cuenta confirma el email de la sesión. El registro distingue entre confirmación por correo y acceso inmediato cuando Confirm email está desactivado para pruebas.

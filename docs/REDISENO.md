# Auditoría y mapa del rediseño

Repositorio único: JoseManuel-G/alquiler-gravel. Next.js App Router + React + Supabase Auth/Storage/PostgreSQL. Se conserva el lockfile.

## Antes

- `/`: portada de marketing y, con sesión, menú de cuatro accesos.
- `/comunidad?view=…`: viajes, personas, solicitudes, planes y chat compartían un componente con navegación propia.
- `/estaciones/[slug]`: ficha, búsqueda, publicación y planes.
- `/cuenta`: Auth, recuperación, perfil y álbum privado.
- `/info/[slug]`: textos informativos; sitemap, robots y páginas de error.

Tablas reutilizadas: resorts, profiles/public_profiles, trips, connections, messages, plans y plan_members. Storage privado avatars. Las relaciones, RLS, solicitudes por pareja y consentimiento previo al chat se mantienen.

## Después

- `/` (Explorar): entrada pública y guía; destino/fechas persistentes compartidos.
- `/viajes`: descubrimiento y filtro «Los míos», detalle, conexión y edición.
- `/personas`: personas con viajes al destino/fechas, nivel y conexión.
- Botón global «+ Publicar viaje»: diálogo breve precargado.
- Avatar → perfil y funciones de gestión existentes.
- Icono de mensajes → panel con conversaciones y solicitudes existentes.
- Rutas antiguas siguen disponibles o remiten a la nueva sección, conservando enlaces anteriores y recuperación de contraseña.

## Integridad y costes

No se eliminan tablas, filas ni políticas sociales. Las adiciones de ocio son independientes. La guía es pública; no se vuelve pública la información social. No se consulta OpenAI desde el navegador ni al visitar una página. La automatización queda desactivada hasta la aprobación explícita de costes y la configuración de credenciales de servidor. Ningún contenido generado sin fuente se publica.

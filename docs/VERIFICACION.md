# Verificación del rediseño

## Comprobaciones realizadas

- ESLint y build de producción Next.js con TypeScript.
- Siete pruebas automatizadas, incluidas las anteriores de base de datos, álbum privado, consentimiento y grupos.
- La actualización SQL completa se aplica dos veces en PostgreSQL embebido sin eliminar usuarios, viajes ni políticas sociales.
- Descubrimiento por estación y solapamiento inclusivo de fechas; las fechas de nacimiento y emails no se devuelven en perfiles públicos.
- Visitantes pueden leer solo ocio activo no caducado. Borradores/revisión, cancelaciones, eventos pasados, errores de enlaces y registros internos quedan ocultos.
- Presupuesto persistente con reserva transaccional y deduplicación de invocaciones. Un cliente público no puede reservar ni leer los registros internos.
- Validación de URLs oficiales, bloqueo de credenciales/IP/dominios engañosos, exigencia de citas, imágenes nunca autorizadas por el modelo, fechas incompletas y verificación estructurada de cambios/cancelaciones.
- Fechas globales normalizadas, almacenamiento entre navegaciones y límites de día Europe/Madrid en horario de verano e invierno.
- Chromium de escritorio (1440 px) y móvil (390 px): entrada pública, selección, persistencia al ir a Viajes, diálogo de acceso y cierre con Escape, formulario de publicación, solicitud y Personas. Sin errores JavaScript ni desbordamiento horizontal.

La parte social del ensayo de navegador usa interceptación local con perfiles y viajes de prueba. No crea cuentas ni escribe en Supabase. Los datos de prueba no están en el catálogo ni en producción.

## Pendiente fuera del entorno de pruebas

1. Aplicar `supabase/redesign-update.sql` en el Supabase dedicado. Las credenciales disponibles aquí son públicas y no ejecutan DDL.
2. Confirmar registro y emails, recuperación, edición y chat entre dos cuentas verificables en producción. El recorrido conserva los componentes y políticas existentes, pero el ensayo local no sustituye esa comprobación.
3. Aprobar costes, configurar credenciales de servidor y derechos por fuente, verificar el primer lote con OpenAI y solo entonces programar Cron. La integración externa no se ha invocado con cargo a una cuenta del propietario.
4. Revisar disponibilidad/condiciones de las fuentes y cuotas reales de Vercel/Supabase. La llamada de prueba gratuita a Overpass agotó el tiempo; el importador devuelve error y no inventa resultados.

## Navegación de estaciones y aspecto deportivo

La guía incorpora «Todas las estaciones», que conserva las fechas. Se comprueba en Chromium el retorno explícito, Atrás y Adelante nativos, cambios de estación desde el selector y recarga de enlaces `?destino=…`. Se mantienen la publicación y acceso modal. Verificación móvil a 390 y 320 px sin desbordamiento horizontal. El nuevo aspecto deportivo utiliza azul noche, hielo y lima; no cambia datos, permisos ni activa automatizaciones.

## Personas con fichas individuales

Pruebas de `people-cards.test.mjs`: perfil con cero/una foto rechazado; dos archivos propios de imagen aceptados; archivos vacíos/huérfanos ajenos al álbum no cuentan; si se borran o invalidan archivos por otra vía, no se puede guardar el perfil ni enviar solicitudes con menos de dos; migración repetida conserva perfiles antiguos; destinatarios sin viaje vigente no aparecen ni admiten solicitudes; el solicitante sin viaje propio sí puede conectar con un destinatario con viaje; chat bloqueado hasta aceptación; reejecutar migraciones anteriores actualizadas mantiene los controles. La comprobación real en Storage queda pendiente de ejecutar `people-cards.sql` con credenciales del propietario.

## Compatibilidad de cuentas ya registradas

La corrección captura una sola vez los identificadores de Auth existentes en una tabla privada con RLS. Se comprueban cuentas antiguas sin fotos que pueden editar perfil, aparecer con viaje vigente y conectar; cuentas antiguas que completan su perfil más tarde; altas nuevas que siguen bloqueadas con cero/una foto y funcionan con dos; repetición de las migraciones sin ampliar la exención ni mover el instante inicial; denegación de lectura/escritura de la lista de exentos desde una sesión normal. Las fotos y registros existentes no se alteran.

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

# Guía de ocio: preparación y activación

Estado: frontend y backend preparados; llamadas de pago y programación DESACTIVADAS. No hay consultas a OpenAI desde una visita o desde el navegador. No se han creado cuentas externas ni se han enviado claves a terceros.

## Datos y fuentes

1. Aplicar `supabase/redesign-update.sql` en el proyecto Supabase dedicado a SKI MATCH. Es aditivo y repetible: conserva cuentas, perfiles, viajes, planes, solicitudes, conversaciones y sus políticas. Añade descubrimiento por destino, `leisure_items` y el registro privado `leisure_jobs`.
2. La carga inicial es un pequeño directorio manual con enlaces oficiales revisados el 4/11/2026, sin fotografías copiadas ni eventos ficticios. Las fichas caducan a los 30 días de esa revisión, aunque se repita el SQL después. El resto de categorías enlaza con portales oficiales mientras se amplía el catálogo.
3. Restaurantes: importador estructurado OpenStreetMap/Overpass, con atribución ODbL, IDs estables, coordenadas y direcciones disponibles. Las cajas geográficas son aproximaciones de las zonas de interés; no indican distancia al establecimiento. No se importan imágenes. La consulta inicial a Overpass desde este entorno agotó el tiempo: no se inventaron ni se cargaron resultados para sustituirla.
4. IA: Responses API de OpenAI con `web_search`, filtro por dominios oficiales, salida JSON Schema, validación independiente, control de URLs/redirects, trazabilidad y actualizaciones por clave estable. La extracción HTML estructurada requiere autorizar por separado cada dominio según sus términos. Sin autorización, no se extraen páginas completas.
5. Solo eventos con evidencia estructurada y fechas/horas explícitas pueden publicarse automáticamente. Las respuestas generativas quedan en `review` y son invisibles al público. Las actividades y locales investigados sin fuente estructurada suficiente también quedan en revisión. Una imagen requiere registro de derechos: el modelo nunca puede autorizarla por sí mismo.
6. Los cambios de fecha conservan la clave del evento; cancelaciones confirmadas se ocultan. Los posibles duplicados entre fuentes pasan a revisión. RLS oculta borradores, cancelados, enlaces rotos, fichas caducadas y eventos finalizados. No se muestran rutas de verano como seguras en invierno.

## Coste propuesto, pendiente de aceptación

Tarifas consultadas el 4/11/2026:

- Búsqueda web OpenAI: **10 USD por 1.000 llamadas (0,01 USD por búsqueda)**, más tokens de entrada/salida del modelo. Fuente: https://developers.openai.com/api/docs/pricing
- Plan inicial: 3 destinos. Eventos cada día; restaurantes y locales de après-ski semanalmente; actividades mensualmente. Aproximadamente 120 ejecuciones de categoría por mes, de las cuales unas 105 usan IA y unas 15 usan OpenStreetMap. El primer arranque y los reintentos pueden modificar esas cifras. Una invocación genera como máximo una búsqueda web por categoría y 2.600 tokens de salida.
- Estimación orientativa con un modelo pequeño compatible: **5–15 USD/mes en OpenAI**. No es una tarifa fija ni una garantía de facturación; depende del modelo, tokens y resultados de búsqueda. Confirmar el modelo y su precio al activar.
- Propuesta inicial: **presupuesto de 20 USD/mes**, con reserva conservadora de 0,15 USD por ejecución y bloqueo de nuevas ejecuciones cuando las reservas del mes alcanzan el presupuesto. Es un control interno de admisión, no un límite de facturación del proveedor. Se conserva la reserva también ante errores; no se reintenta automáticamente una misma ejecución fallida en ese periodo para evitar gasto duplicado.
- Vercel Cron está disponible en todos los planes, pero ejecuta Functions y consume sus cuotas. Hobby permite programación diaria por tarea. No se ha contratado un plan ni se garantiza coste cero si se exceden cuotas. Fuente: https://vercel.com/docs/cron-jobs/usage-and-pricing
- Supabase conserva su plan actual; el catálogo añade almacenamiento/consultas. Revisar uso en el panel, especialmente fotos y ancho de banda.

**Antes de activar, el propietario debe aprobar explícitamente presupuesto, modelo y uso programado.** No se ha añadido `vercel.json` con tareas activas; `docs/vercel-cron.example.json` es solo un ejemplo.

## Configuración posterior a la aprobación

Solo en el servidor de Vercel (nunca `NEXT_PUBLIC_*`):

- `SUPABASE_SERVICE_ROLE_KEY`: del Supabase dedicado a SKI MATCH.
- `OPENAI_API_KEY` y `OPENAI_RESEARCH_MODEL`: del proyecto OpenAI aprobado.
- `CRON_SECRET`: secreto aleatorio para autenticar el endpoint; Vercel lo envía como Bearer.
- `LEISURE_EXTRACTION_DOMAINS`: lista explícita de dominios cuya extracción estructurada esté autorizada; vacía por defecto.
- `LEISURE_MONTHLY_BUDGET_USD=20`, `LEISURE_JOB_RESERVATION_USD=0.15`.
- Solo después: `LEISURE_COST_APPROVED=true` y `LEISURE_AUTOMATION_ENABLED=true`.
- Copiar el ejemplo Cron al `vercel.json` del proyecto seleccionado y desplegar. Los horarios del ejemplo están en UTC; no representan una hora local exacta en cambios estacionales.

El endpoint `/api/cron/leisure?station=…` devuelve 401 sin el secreto; con secreto y sin activación devuelve `disabled`. Solo acepta las tres estaciones configuradas. No hay peticiones externas pagadas antes de pasar esas comprobaciones y reservar presupuesto.

## Verificación y límites pendientes

Las pruebas locales cubren SQL real (PGlite), permisos, filtros, caducidad, reservas de presupuesto y validación del contenido. Los ensayos de navegador usan datos locales controlados para la parte social; no crean usuarios ni escriben en producción. No sustituyen comprobar registro/email, conversaciones entre dos cuentas reales, ejecución de la migración, acceso a OpenAI y cuotas en Vercel/Supabase. Sin claves de servidor y aprobación no se ha ejecutado investigación facturable ni se ha confirmado una actualización programada real. El registro de candidatos permite revisar y publicar desde el SQL Editor; no se añade un panel de administración al producto.

# Fotografías

Imágenes remotas de Unsplash, bajo su licencia estándar: https://unsplash.com/license . Se cargan directamente desde `images.unsplash.com`; el navegador necesita acceso a ese host. No se han añadido fotos de personas reales para representar usuarios ficticios.

- Hero y fondos: `photo-1454496522488-7a8e488e8606` (cumbres alpinas).
- Primera tarjeta y demostración: `photo-1551524164-687a55dd1126`.
- Segunda tarjeta: `photo-1418985991508-e47386d96a71`.
- Tercera tarjeta: `photo-1517299321609-52687d1bc55a`.

Son fotografías ilustrativas de montaña/nieve, no imágenes geolocalizadas verificadas de Baqueira, Formigal o Sierra Nevada. La interfaz lo advierte. La política de red del entorno de desarrollo bloqueó la descarga de imágenes externas; no se pudo comprobar aquí la disponibilidad de cada original. Las URLs conocidas se incluyen como recursos remotos y deben comprobarse en el despliegue antes de abrir el registro.

Para sustituirlas: obtener permiso/licencia de cada estación o imágenes de Wikimedia Commons con metadatos comprobados; añadir el archivo y la atribución correspondiente y actualizar `resorts.image` en Supabase. El catálogo sin configurar usa `src/lib/resorts.ts`. La galería enlaza también la fuente oficial de cada estación.

Si una imagen remota no se puede cargar, `Photo` muestra `public/images/mountain.svg`, una ilustración original de reserva, con texto alternativo que identifica que la fotografía no está disponible.

## Rediseño de noviembre de 2026

Las tres fotografías ilustrativas de destino ya utilizadas se han descargado de sus URLs de Unsplash a `public/images/destinations/` para servirlas localmente. Se conserva la licencia estándar y la advertencia de que no son fotografías verificadas de las estaciones. Solo se usa la copia local si `resorts.image` conserva el identificador original; las imágenes que el propietario cambie en Supabase se respetan. No se han añadido fotos de personas ficticias ni copiado fotos de restaurantes, agendas o redes sociales.

La tarjeta ilustrativa de Baqueira usa la fotografía alpina `photo-1454496522488-7a8e488e8606`, ya utilizada en el fondo original del perfil. Las copias de Formigal y Sierra Nevada conservan los IDs indicados arriba.

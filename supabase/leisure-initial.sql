-- Optional manually verified source directory: 4 November 2026.
-- No scraped photos, invented events, opening times or summer safety claims.
-- Run after leisure.sql in SKI MATCH only. Does not alter social data.
begin;
insert into public.leisure_items(resort_id,source_key,category,name,description,location,source_url,source_name,subtype,distance_km,elevation_m,difficulty,winter_status,status,verified_at,expires_at,evidence)
select r.id,v.key,v.category,v.name,v.description,v.location,v.url,v.source,v.subtype,v.distance,v.elevation,v.difficulty,v.winter,'active','2026-11-04T12:00:00Z'::timestamptz,'2026-12-04T12:00:00Z'::timestamptz,jsonb_build_array(jsonb_build_object('method','manual_official_directory','url',v.url,'reviewed_on','2026-11-04'))
from (values
 ('baqueira-beret','official-salgorda','restaurant','La Sal Gorda','Establecimiento incluido en el directorio turístico de Val d’Aran. Consulta la fuente para confirmar horarios y disponibilidad.','Arties · Carretera Baqueira, 5','https://www.visitvaldaran.com/item/restaurant-la-sal-gorda/','Turismo Val d’Aran','Restaurante',null::double precision,null::integer,null::text,'unknown'),
 ('baqueira-beret','official-wellbourne','restaurant','Wellbourne Salardú','Restaurante recogido en el directorio turístico oficial. Consulta su ficha y confirma directamente la disponibilidad.','Salardú · Carrer dera Mòla, 5','https://www.visitvaldaran.com/item/restaurant-wellbourne/','Turismo Val d’Aran','Restaurante',null,null,null,'unknown'),
 ('formigal-panticosa','official-marchica','apres','M Experience · Formigal-Panticosa','Consulta las experiencias de après-ski en la web oficial. Las sesiones y fechas dependen de la programación del operador.','Formigal-Panticosa','https://www.aramon.com/m-experience/formigal-panticosa','Aramón','Après-ski',null,null,null,'unknown'),
 ('formigal-panticosa','official-petrosos','activity','Skimo · Petrosos','Circuito de esquí de montaña incluido en la información oficial de Panticosa. Consulta apertura, requisitos y condiciones antes de salir.','Panticosa','https://www.aramon.com/formigal-panticosa/rutas-skimo-panticosa.html','Aramón','Esquí de montaña',1.14,170,'Fácil según la fuente','winter'),
 ('formigal-panticosa','official-yandel','activity','Skimo · Yandel','Circuito de esquí de montaña descrito por el operador. Consulta la información actualizada de la estación y las condiciones de montaña.','Panticosa','https://www.aramon.com/formigal-panticosa/rutas-skimo-panticosa.html','Aramón','Esquí de montaña',2.5,332,'Moderada según la fuente','winter'),
 ('formigal-panticosa','official-bandera','activity','Skimo · La Bandera','Itinerario de esquí de montaña descrito en la web oficial de Panticosa. Requiere valorar el nivel propio y las condiciones de la jornada.','Panticosa','https://www.aramon.com/formigal-panticosa/rutas-skimo-panticosa.html','Aramón','Esquí de montaña',6,819,'Difícil según la fuente','winter')
) as v(slug,key,category,name,description,location,url,source,subtype,distance,elevation,difficulty,winter)
join public.resorts r on r.slug=v.slug
on conflict(resort_id,source_key) do nothing;
commit;

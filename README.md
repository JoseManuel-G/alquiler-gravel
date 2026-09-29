# J² Data & AI

Web corporativa de **J² Data & AI**, una consultora boutique especializada en estrategia, plataformas de datos, analítica e inteligencia artificial.

## Propuesta de servicios

- Estrategia, gobierno y arquitectura de datos.
- Plataformas modernas basadas en Lakehouse y Data Warehouse.
- Snowflake y Microsoft Fabric.
- Analítica con Power BI y modelos semánticos.
- Agentes de IA, RAG, Copilot y automatización.
- Optimización, observabilidad, rendimiento y FinOps.

## Equipo

- [Jaime Pérez Delso](https://www.linkedin.com/in/jaime-p%C3%A9rez-delso/)
- [José Manuel González Albaladejo](https://www.linkedin.com/in/jose-manuel-gonz%C3%A1lez-albaladejo/)

## Desarrollo local

El proyecto utiliza Next.js, React, TypeScript y Tailwind CSS.

```bash
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Verificación y producción

```bash
npm run build
npm start
```

La aplicación se genera como una web estática desde App Router. También expone `/robots.txt` y `/sitemap.xml`.

## Despliegue

El despliegue de producción está conectado a la rama `main` mediante Vercel. Cada cambio integrado y subido a `main` inicia un nuevo despliegue automático.

El dominio usado actualmente en los metadatos, el sitemap y `robots.txt` es `https://j2data.ai`. Si cambia el dominio definitivo, hay que actualizarlo en:

- `src/app/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`

## Estructura principal

```text
src/app/page.tsx       Contenido y estructura de la landing
src/app/globals.css    Sistema visual y diseño responsive
src/app/layout.tsx     Metadatos y configuración global
src/app/robots.ts      Directivas para buscadores
src/app/sitemap.ts     Sitemap del sitio
```

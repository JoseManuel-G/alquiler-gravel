import { Suspense } from "react";
import Image from "@/components/photo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowUpRight, ChevronRight } from "lucide-react";
import { getResorts } from "@/lib/catalog";
import { StationCommunity } from "@/components/station-community";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { resorts } = await getResorts();
  const r = resorts.find((r) => r.slug === slug);
  return {
    title: r?.name || "Estación no encontrada",
    description: r?.description,
  };
}
export default async function Station({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { resorts, demo, error } = await getResorts();
  if (error)
    return (
      <main className="container section">
        <h1>No hemos podido cargar la estación.</h1>
        <p className="notice">
          El catálogo no está disponible. Inténtalo de nuevo más tarde.
        </p>
        <Link className="button button-dark" href="/">
          Volver al inicio
        </Link>
      </main>
    );
  const r = resorts.find((r) => r.slug === slug);
  if (!r) notFound();
  return (
    <main className="container">
      <div className="breadcrumb">
        <Link href="/#estaciones">Estaciones</Link>
        <ChevronRight size={13} />
        <span>{r.name}</span>
      </div>
      <section className="resort-hero">
        <Image
          src={r.image}
          unoptimized
          fill
          priority
          sizes="100vw"
          alt={`Fotografía de montaña ilustrativa para descubrir ${r.name}`}
        />
        <div>
          <p className="kicker">ENCUENTRA TU MONTAÑA. ENCUENTRA TU GENTE.</p>
          <h1>{r.name}</h1>
          <p>
            <MapPin size={16} />
            {r.region}
          </p>
        </div>
      </section>
      <div className="resort-summary">
        <p>{r.description}</p>
        <aside>
          <a href={r.official_url} target="_blank" rel="noreferrer">
            Visitar web oficial <ArrowUpRight size={16} />
          </a>
          <p>
            Consulta el estado de pistas, remontes y meteorología directamente
            en la estación. No mostramos datos en tiempo real sin una fuente
            verificada.
          </p>
        </aside>
      </div>
      <Suspense
        fallback={<p className="loading">Preparando tu próxima escapada…</p>}
      >
        <StationCommunity resortId={r.id} demo={demo} />
      </Suspense>
      <section className="workspace-section">
        <p className="kicker">EL PAISAJE ES SOLO EL PRINCIPIO</p>
        <h2>Un poco de inspiración.</h2>
        <div className="gallery">
          <figure>
            <Image
              src={r.image}
              unoptimized
              fill
              sizes="65vw"
              alt="Paisaje alpino de inspiración"
            />
            <figcaption>El aire de montaña. Las ganas de volver.</figcaption>
          </figure>
          <figure>
            <Image
              src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=85"
              unoptimized
              fill
              sizes="35vw"
              alt="Panorámica de cumbres nevadas"
            />
            <figcaption>Nos vemos arriba.</figcaption>
          </figure>
        </div>
        <p className="gallery-note">
          Fotografías de inspiración de Unsplash. No representan necesariamente
          esta estación. Consulta la galería y la información actualizadas en su
          web oficial.
        </p>
      </section>
    </main>
  );
}

import Link from "next/link";
import Image from "@/components/photo";
import {
  ArrowRight,
  ArrowUpRight,
  MountainSnow,
  MapPin,
  HeartHandshake,
  Route,
  Snowflake,
  Check,
  MoveDown,
} from "lucide-react";
import { getResorts } from "@/lib/catalog";
import { Search } from "@/components/search";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { resorts, demo, error } = await getResorts();
  return (
    <main>
      <section className="hero">
        <Image
          className="hero-image"
          unoptimized
          src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2400&q=85"
          alt="Cumbres nevadas de los Alpes bajo el cielo azul"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="eyebrow">
            <span /> NUEVAS HUELLAS. NUEVAS CONEXIONES.
          </p>
          <h1>
            La montaña se disfruta
            <br />
            más <em>en compañía.</em>
          </h1>
          <p className="hero-description">
            Descubre estaciones de esquí, conecta con personas de tu nivel
            <br className="desktop-break" /> y comparte experiencias
            inolvidables en la nieve.
          </p>
          <div className="hero-actions">
            <Link href="#estaciones" className="button button-coral">
              Explorar estaciones <ArrowUpRight size={18} />
            </Link>
            <Link href="#como-funciona" className="hero-secondary">
              Cómo funciona{" "}
              <span>
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
          <div className="hero-bottom">
            <span>
              <MountainSnow size={17} /> LA MISMA PASIÓN. TU PRÓXIMO PLAN.
            </span>
            <span>
              DESLIZA PARA EXPLORAR <MoveDown size={15} />
            </span>
          </div>
        </div>
        <div className="search-wrap container">
          <Search resorts={resorts} />
        </div>
      </section>
      <div className="trust-strip container">
        <span>
          <Check size={15} /> Compañeros, no citas
        </span>
        <span>
          <Check size={15} /> Todos los niveles, una misma pasión
        </span>
        <span>
          <Check size={15} /> Esquí y snowboard
        </span>
      </div>
      <section id="estaciones" className="section container">
        <div className="section-heading">
          <div>
            <p className="kicker">EL PRIMER PASO ES ELEGIR DESTINO</p>
            <h2>
              Tu próxima aventura
              <br className="mobile-only" /> empieza aquí
              <span className="coral">.</span>
            </h2>
          </div>
          <p>
            Tres destinos. Infinitas formas de vivirlos.
            <br />
            Encuentra tu montaña. Y después, tu gente.
          </p>
        </div>
        {demo && (
          <p className="catalog-note">
            Explora el catálogo de lanzamiento · Las conexiones se activan al
            configurar la comunidad.
          </p>
        )}
        {error && (
          <p role="alert" className="notice">
            No podemos cargar las estaciones. Inténtalo de nuevo en unos
            minutos.
          </p>
        )}
        <div className="resort-grid">
          {resorts.map((r, i) => (
            <Link
              href={`/estaciones/${r.slug}`}
              key={r.id}
              className="resort-card"
            >
              <div className="resort-photo">
                <Image
                  unoptimized
                  src={r.image}
                  alt={`Paisaje de montaña para inspirar tu viaje a ${r.name}`}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <span className="photo-tag">
                  <Snowflake size={12} />
                  {i === 0
                    ? "EL VALLE TE ESPERA"
                    : i === 1
                      ? "ESPÍRITU AVENTURERO"
                      : "NIEVE Y LUZ DEL SUR"}
                </span>
                <span className="photo-index">0{i + 1} / ESPAÑA</span>
                <div className="photo-caption">
                  <MapPin size={13} />
                  {r.region}
                </div>
              </div>
              <div className="resort-title">
                <h3>{r.name}</h3>
                <span>
                  <ArrowUpRight size={22} />
                </span>
              </div>
              <p>{r.description}</p>
              <span className="resort-link">
                Explorar estación <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
        <p className="gallery-note" style={{ marginTop: 18, marginBottom: 0 }}>
          Fotografías alpinas de inspiración · No representan necesariamente las
          estaciones anunciadas.
        </p>
        <div className="coming-next">
          <MountainSnow size={19} />
          <span>El mapa sigue creciendo.</span>
          <p>Próximamente, más estaciones y nuevas aventuras.</p>
          <span className="small-pill">ESTO SOLO ACABA DE EMPEZAR</span>
        </div>
      </section>
      <section className="how-section" id="como-funciona">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="kicker">ASÍ DE FÁCIL. ASÍ DE BUENO.</p>
              <h2>De «quiero ir» a «nos vemos arriba».</h2>
            </div>
            <span className="handwritten">
              El mejor plan empieza contigo <ArrowUpRight size={24} />
            </span>
          </div>
          <div className="steps-grid">
            {[
              {
                icon: MapPin,
                title: "Elige tu estación.",
                text: "Descubre destinos increíbles y marca las fechas de tu próxima escapada.",
              },
              {
                icon: HeartHandshake,
                title: "Encuentra tu gente.",
                text: "Conecta con esquiadores y riders de tu nivel que estarán allí cuando tú.",
              },
              {
                icon: Route,
                title: "Disfruta de la montaña.",
                text: "Organiza un plan, comparte la primera bajada y deja que el resto fluya.",
              },
            ].map((s, i) => (
              <article key={s.title}>
                <div className="step-top">
                  <span className="step-icon">
                    <s.icon size={28} strokeWidth={1.5} />
                  </span>
                  <span className="step-number">0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="community-section container">
        <div className="community-copy">
          <p className="kicker">MISMA NIEVE. BUENA COMPAÑÍA.</p>
          <h2>
            Tu gente está
            <br />
            ahí fuera.
            <br />
            <span>O mejor, ahí arriba.</span>
          </h2>
          <p>
            Da igual si estás aprendiendo a girar o si buscas la primera huella.
            Hay alguien con tus mismas ganas de montaña.
          </p>
          <div className="community-values">
            <span>
              <Check size={17} /> Conecta por nivel, fechas y estación
            </span>
            <span>
              <Check size={17} /> Comparte bajadas, no expectativas
            </span>
          </div>
          <Link href="/comunidad" className="button button-dark">
            Conoce la comunidad <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="demo-scene">
          <div className="demo-dots" />
          <article className="demo-profile">
            <div className="demo-portrait">
              <Image
                unoptimized
                src="https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=650&q=85"
                alt="Esquiadores disfrutando de la montaña"
                fill
                sizes="400px"
              />
              <span className="demo-label">PERFIL DE DEMOSTRACIÓN</span>
              <span className="profile-location">
                <MapPin size={13} /> Baqueira Beret
              </span>
            </div>
            <div className="demo-profile-body">
              <h3>
                Alex, 29 <span>⛷</span>
              </h3>
              <p>Una bajada más. Siempre.</p>
              <div className="chips">
                <span>Intermedio</span>
                <span>Esquí</span>
                <span>Après-ski</span>
              </div>
              <Link href="/cuenta" className="button button-coral">
                Encuentra tus compañeros <HeartHandshake size={18} />
              </Link>
            </div>
          </article>
          <div className="floating-note">
            <span>✳</span>
            <div>
              La conexión empieza
              <br />
              <strong>con una misma pasión.</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="final-cta container">
        <div>
          <p className="kicker">EL PRÓXIMO RECUERDO ESTÁ POR HACER</p>
          <h2>
            La nieve pone el escenario.
            <br />
            Tú eliges la compañía.
          </h2>
        </div>
        <Link className="button button-coral" href="/cuenta">
          Crear mi cuenta <ArrowUpRight size={20} />
        </Link>
        <MountainSnow className="cta-mountain" size={230} strokeWidth={0.5} />
      </section>
    </main>
  );
}

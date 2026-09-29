import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Power BI",
    description:
      "Cuadros de mando que responden preguntas de negocio, con una experiencia clara y métricas en las que confiar.",
    tags: ["Dashboards", "DAX", "Modelado"],
  },
  {
    number: "02",
    title: "Microsoft Fabric",
    description:
      "Arquitecturas de datos modernas para reunir ingesta, transformación, gobierno y analítica en una única plataforma.",
    tags: ["Lakehouse", "Data Factory", "Real-Time"],
  },
  {
    number: "03",
    title: "Agentes & IA",
    description:
      "Agentes conectados a tus modelos semánticos para consultar, analizar y activar el conocimiento de tu compañía.",
    tags: ["Copilot", "Semantic models", "Automatización"],
  },
  {
    number: "04",
    title: "Optimización",
    description:
      "Auditoría y mejora de modelos, rendimiento y costes para que tu ecosistema de datos vuelva a ir rápido.",
    tags: ["Performance", "Gobierno", "FinOps"],
  },
];

const steps = [
  ["01", "Entender", "Nos sentamos con tu equipo, aterrizamos el reto y definimos juntos qué significa éxito."],
  ["02", "Diseñar", "Trazamos una solución pragmática, escalable y alineada con vuestra realidad tecnológica."],
  ["03", "Construir", "Trabajamos por entregas cortas y visibles. Sin cajas negras, con tu equipo siempre dentro."],
  ["04", "Transferir", "Documentamos, formamos y acompañamos para que la solución siga creciendo con vosotros."],
];

const jaimeLinkedIn = "https://www.linkedin.com/in/jaime-p%C3%A9rez-delso/";
const joseLinkedIn = "https://www.linkedin.com/in/jose-manuel-gonz%C3%A1lez-albaladejo/";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link href="#inicio" className="brand" aria-label="Jota Data, inicio">
          <span className="brand-mark">J²</span>
          <span className="brand-name">Data & AI</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <Link href="#servicios">Servicios</Link>
          <Link href="#nosotros">Nosotros</Link>
          <Link href="#metodo">Cómo trabajamos</Link>
        </nav>
        <Link href="#contacto" className="header-cta">
          Cuéntanos tu reto <Arrow />
        </Link>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="eyebrow"><span /> Consultoría boutique de datos & IA</div>
        <h1>
          Tus datos ya hablan.<br />
          <em>Hagamos que decidan.</em>
        </h1>
        <p className="hero-copy">
          Diseñamos soluciones de <strong>Power BI, Microsoft Fabric e IA</strong> que convierten la complejidad de tus datos en decisiones más rápidas y mejores.
        </p>
        <div className="hero-actions">
          <Link href="#contacto" className="button button-primary">Hablemos de tu proyecto <Arrow /></Link>
          <Link href="#servicios" className="text-link">Descubre cómo ayudamos <span>↓</span></Link>
        </div>
        <div className="hero-footer">
          <span>POWER BI</span><i />
          <span>MICROSOFT FABRIC</span><i />
          <span>AGENTES IA</span><i />
          <span>MODELOS SEMÁNTICOS</span>
        </div>
      </section>

      <section className="manifesto section-pad">
        <p className="section-kicker">Lo que nos mueve</p>
        <p className="manifesto-copy">
          No hacemos dashboards para decorar reuniones. Creamos sistemas de datos que <span>cambian cómo trabaja tu negocio.</span>
        </p>
        <div className="manifesto-note">
          <span className="note-line" />
          Estrategia y ejecución, en el mismo equipo.
        </div>
      </section>

      <section className="services section-pad" id="servicios">
        <div className="section-heading">
          <div>
            <p className="section-kicker light">En qué podemos ayudarte</p>
            <h2>De la pregunta<br />al impacto.</h2>
          </div>
          <p>Nos integramos con tu equipo para resolver retos concretos, desde la estrategia hasta el último detalle técnico.</p>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-number">{service.number}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <span className="service-arrow"><Arrow diagonal /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="team section-pad" id="nosotros">
        <div className="team-intro">
          <div>
            <p className="section-kicker">Quién está detrás</p>
            <h2>Dos perfiles.<br /><span>Una misma obsesión.</span></h2>
          </div>
          <p>Hacer que la tecnología sea útil de verdad. Sin capas innecesarias, sin presentaciones eternas y con una implicación que no se delega.</p>
        </div>
        <div className="team-grid">
          <article className="person-card person-dark">
            <div className="person-top">
              <span className="monogram">JP</span>
              <a href={jaimeLinkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn de Jaime Pérez Delso">in</a>
            </div>
            <div>
              <p className="person-role">DATA & BUSINESS INTELLIGENCE</p>
              <h3>Jaime<br />Pérez Delso</h3>
              <p className="person-copy">Conecta la visión de negocio con el dato para construir soluciones analíticas que las personas entienden, adoptan y usan.</p>
            </div>
          </article>
          <article className="person-card person-accent">
            <div className="person-top">
              <span className="monogram">JG</span>
              <a href={joseLinkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn de José Manuel González Albaladejo">in</a>
            </div>
            <div>
              <p className="person-role">DATA, FABRIC & ARTIFICIAL INTELLIGENCE</p>
              <h3>José Manuel<br />González Albaladejo</h3>
              <p className="person-copy">Convierte la complejidad técnica en arquitecturas y productos de datos sólidos, eficientes y preparados para la IA.</p>
            </div>
          </article>
        </div>
        <p className="profile-disclaimer">Conoce la trayectoria completa y actualizada de Jaime y José Manuel en sus perfiles de LinkedIn.</p>
      </section>

      <section className="method section-pad" id="metodo">
        <div className="section-heading method-heading">
          <div>
            <p className="section-kicker">Nuestra forma de trabajar</p>
            <h2>Cerca. Claro.<br />Sin sorpresas.</h2>
          </div>
          <p>Menos ceremonia, más colaboración. Un proceso sencillo para llegar antes a lo que importa.</p>
        </div>
        <div className="steps">
          {steps.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section-pad" id="contacto">
        <div className="contact-glow" aria-hidden="true" />
        <p className="section-kicker light">¿Tienes un reto entre manos?</p>
        <h2>Puede que seamos<br />el equipo que buscas.</h2>
        <p>Cuéntanos dónde estás y a dónde quieres llegar. La primera conversación corre de nuestra cuenta.</p>
        <div className="contact-links">
          <a href={jaimeLinkedIn} target="_blank" rel="noreferrer" className="button button-light">Hablar con Jaime <Arrow diagonal /></a>
          <a href={joseLinkedIn} target="_blank" rel="noreferrer" className="button button-outline">Hablar con José Manuel <Arrow diagonal /></a>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">J²</span><span>Data & AI</span></div>
        <p>Power BI · Microsoft Fabric · Inteligencia Artificial</p>
        <p>© {new Date().getFullYear()} J² Data & AI</p>
      </footer>
    </main>
  );
}

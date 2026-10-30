import Link from "next/link";
import { notFound } from "next/navigation";
const content: Record<
  string,
  { title: string; sections: { title: string; text: string }[] }
> = {
  nosotros: {
    title: "La montaña nos une.",
    sections: [
      {
        title: "Una pasión compartida",
        text: "Ski Match nace para encontrar compañeros de esquí y snowboard. Elige estación, comparte tus fechas y encuentra personas con las que disfrutar de la nieve.",
      },
      {
        title: "Compañeros, no citas",
        text: "Aquí puedes encontrar gente de tu nivel y organizar una escapada. Cada conexión requiere aceptación mutua. Empezamos con Baqueira Beret, Formigal-Panticosa y Sierra Nevada.",
      },
    ],
  },
  contacto: {
    title: "Hablemos de montaña.",
    sections: [
      {
        title: "Contacto en preparación",
        text: "El canal de atención todavía no está configurado. Antes de abrir el registro, el operador debe publicar aquí su identidad y un medio de contacto para consultas, incidencias y solicitudes de privacidad.",
      },
      {
        title: "Durante el lanzamiento",
        text: "No incluyas teléfonos, direcciones ni información sensible en perfiles o planes públicos. Puedes eliminar un viaje, salir de un plan o eliminar una conexión desde Comunidad.",
      },
    ],
  },
  privacidad: {
    title: "Tu privacidad importa.",
    sections: [
      {
        title: "Información provisional · antes de la apertura",
        text: "Esta página describe el funcionamiento técnico. El operador debe completar su identidad, contacto, base jurídica, periodos de conservación y proveedores antes de habilitar el registro público. No es una política legal definitiva.",
      },
      {
        title: "Tus datos",
        text: "Al activar Supabase, el email y las credenciales se gestionan con Supabase Auth. El perfil guarda nombre, fecha de nacimiento, nivel, modalidad, biografía, preferencias y una URL de foto opcional. Los miembros verificados ven tu edad, pero no tu fecha de nacimiento ni tu email.",
      },
      {
        title: "Viajes y conversaciones",
        text: "Los miembros verificados con perfil completo pueden consultar viajes y planes. Las solicitudes de conexión solo son visibles para sus participantes. Los mensajes solo pueden leerse en una conexión aceptada. Los organizadores gestionan las solicitudes de sus planes.",
      },
      {
        title: "Sesión e imágenes externas",
        text: "La sesión se conserva en el almacenamiento local de tu navegador hasta cerrar sesión o expirar. No incluimos analítica publicitaria. Las imágenes se cargan desde Unsplash y las fotos de perfil desde la URL elegida por cada miembro; esos proveedores reciben las solicitudes del navegador.",
      },
      {
        title: "Control de tus datos",
        text: "Puedes editar tu perfil, eliminar viajes y conexiones, cancelar tus planes o salir de planes. Para exportar o eliminar la cuenta completa, contacta con el operador, que deberá publicar un canal antes del lanzamiento. La eliminación de la cuenta en Supabase elimina en cascada sus datos asociados.",
      },
    ],
  },
  condiciones: {
    title: "La montaña, con respeto.",
    sections: [
      {
        title: "Condiciones provisionales",
        text: "El operador debe completar su identidad, contacto, condiciones definitivas y atención a incidencias antes de la apertura pública. Ski Match conecta compañeros de deporte; no es una agencia de viajes ni un servicio de guías.",
      },
      {
        title: "Solo mayores de edad",
        text: "La comunidad está reservada a mayores de 18 años. Proporciona información veraz y respeta a los demás. No se permite acoso, discriminación, suplantación, contenido ilegal ni publicidad no solicitada.",
      },
      {
        title: "Conexiones y planes",
        text: "Las conexiones requieren aceptación mutua y los planes aprobación del organizador. Verificar el email no acredita identidad o nivel deportivo. Conoce a tus compañeros en espacios públicos y no publiques información sensible.",
      },
      {
        title: "Seguridad en la montaña",
        text: "Comprueba pistas, tiempo e instrucciones en fuentes oficiales. Utiliza equipo adecuado y respeta tus capacidades. En una emergencia llama al 112. La plataforma no sustituye a guías, seguros o servicios de emergencia.",
      },
      {
        title: "Fotografías y estaciones",
        text: "Las fotografías de montaña son ilustrativas, proceden de Unsplash y no representan necesariamente la estación anunciada. No hay afiliación con las estaciones ni meteorología en tiempo real. Consulta las webs oficiales para apertura, pistas y servicios.",
      },
    ],
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: content[slug]?.title || "Información" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = content[slug];
  if (!page) notFound();
  return (
    <main className="container">
      <article className="legal-copy">
        <p className="kicker">SKI MATCH · NOS VEMOS ARRIBA</p>
        <h1>{page.title}</h1>
        {page.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
        <Link href="/" className="button button-dark">
          Volver a explorar
        </Link>
      </article>
    </main>
  );
}

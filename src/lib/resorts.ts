export type Resort = {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string;
  image: string;
  tag: string;
  official_url: string;
};
// Preview catalog only. Configured deployments read the canonical catalog from Supabase.
export const previewResorts: Resort[] = [
  {
    id: "baqueira-beret",
    slug: "baqueira-beret",
    name: "Baqueira Beret",
    region: "Val d’Aran · Lleida",
    description:
      "Entre bosques de abetos y cumbres del Pirineo. Descubre el carácter del valle y encuentra con quién compartir tu próxima bajada.",
    image:
      "https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=1200&q=85",
    tag: "ESPÍRITU PIRENAICO",
    official_url: "https://www.baqueira.es",
  },
  {
    id: "formigal-panticosa",
    slug: "formigal-panticosa",
    name: "Formigal-Panticosa",
    region: "Valle de Tena · Huesca",
    description:
      "Dos destinos, un mismo espíritu. Grandes paisajes, nuevos amigos y un plan que empieza en las pistas del valle de Tena.",
    image:
      "https://images.unsplash.com/photo-1418985991508-e47386d96a71?auto=format&fit=crop&w=1200&q=85",
    tag: "AVENTURA SIN LÍMITES",
    official_url: "https://www.formigal-panticosa.com",
  },
  {
    id: "sierra-nevada",
    slug: "sierra-nevada",
    name: "Sierra Nevada",
    region: "Sierra Nevada · Granada",
    description:
      "Nieve, luz del sur y horizontes que sorprenden. Vive la montaña a tu ritmo, con gente que comparte tus ganas de explorar.",
    image:
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1200&q=85",
    tag: "NIEVE CON ACENTO DEL SUR",
    official_url: "https://sierranevada.es",
  },
];

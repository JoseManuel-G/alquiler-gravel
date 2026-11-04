export const LEISURE_CATEGORIES = [
  { id: "restaurant", label: "Restaurantes", icon: "🍽" },
  { id: "apres", label: "Après-ski y fiesta", icon: "♫" },
  { id: "event", label: "Eventos", icon: "✦" },
  { id: "activity", label: "Rutas y actividades", icon: "↗" },
] as const;
export type LeisureCategory = typeof LEISURE_CATEGORIES[number]["id"];
export const OFFICIAL_SOURCES: Record<string, { name: string; url: string; agenda: string; domains: string[]; places: string; bbox: number[]; safety: string }> = {
 "baqueira-beret": { name: "Turismo Val d’Aran", url: "https://www.visitvaldaran.com/", agenda: "https://www.visitvaldaran.com/agenda/", domains: ["visitvaldaran.com", "baqueira.es", "conselharan.org"], places: "Baqueira, Vielha, Arties y Salardú", bbox: [42.60,0.70,42.85,1.02], safety: "https://lauegi.conselharan.org/" },
 "formigal-panticosa": { name: "Aramón Formigal-Panticosa", url: "https://www.aramon.com/formigal-panticosa", agenda: "https://www.aramon.com/formigal-panticosa", domains: ["aramon.com", "formigal-panticosa.com", "valledetena.com"], places: "Formigal, Sallent de Gállego y Panticosa", bbox: [42.65,-0.45,42.85,-0.20], safety: "https://www.aemet.es/es/eltiempo/prediccion/montana" },
 "sierra-nevada": { name: "Sierra Nevada", url: "https://sierranevada.es/es/", agenda: "https://sierranevada.es/es/invierno/eventos/", domains: ["sierranevada.es", "turismomonachil.com"], places: "Pradollano y Monachil", bbox: [37.02,-3.60,37.18,-3.30], safety: "https://www.aemet.es/es/eltiempo/prediccion/montana" },
};
export type LeisureItem = {
 id: string; resort_id: string; category: LeisureCategory; name: string; description: string; location: string;
 latitude: number | null; longitude: number | null; starts_at: string | null; ends_at: string | null;
 source_url: string; source_name: string; booking_url: string | null; image_url: string | null; image_license: string | null;
 verified_at: string; expires_at: string; status: string; subtype: string | null; distance_km: number | null; elevation_m: number | null; difficulty: string | null; winter_status: string;
};

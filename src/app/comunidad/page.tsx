import { Community } from "@/components/community";
export const metadata = { title: "La comunidad", robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
 const { view } = await searchParams;
 const allowed = ["publicados", "publicar", "personas", "conexiones", "mensajes", "viajes", "planes"];
 const selected = view && allowed.includes(view) ? view : "inicio";
 return <main><Community key={selected} initialView={selected} /></main>;
}

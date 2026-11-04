import { redirect } from "next/navigation";
export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
 const { view } = await searchParams;
 if (view === "personas") redirect("/personas");
 if (view === "publicar") redirect("/viajes?publish=1");
 if (view === "viajes") redirect("/viajes?mine=1");
 if (view === "mensajes" || view === "conexiones" || view === "planes") redirect(`/viajes?panel=${view}`);
 if (view === "publicados") redirect("/viajes");
 redirect("/");
}

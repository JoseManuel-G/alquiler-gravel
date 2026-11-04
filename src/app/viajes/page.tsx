import { SocialScreen } from "@/components/social-screen";
export const metadata = { title: "Viajes", robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ mine?: string; panel?: string; publish?: string }> }) {
 const p = await searchParams;
 const panel = p.panel === "mensajes" || p.panel === "conexiones" || p.panel === "planes" ? p.panel : undefined;
 return <SocialScreen key={`${p.mine}:${p.panel}:${p.publish}`} screen="trips" initialMine={p.mine === "1"} initialPanel={panel} initialPublish={p.publish === "1"}/>;
}

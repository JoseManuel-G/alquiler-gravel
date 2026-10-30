import { Community } from "@/components/community";
export const metadata = {
  title: "La comunidad",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main>
      <div className="container page-intro">
        <p className="kicker">COMPARTE ALGO MÁS QUE UNA BAJADA</p>
        <h1>Tu comunidad de montaña.</h1>
        <p>
          Viajes, planes y nuevas conexiones. Todo lo que necesitas para que tu
          próxima escapada empiece en buena compañía.
        </p>
      </div>
      <Community />
    </main>
  );
}

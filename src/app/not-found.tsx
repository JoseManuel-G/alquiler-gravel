import Link from "next/link";
import { MountainSnow } from "lucide-react";
export default function NotFound() {
  return (
    <main className="container section">
      <div className="empty-state">
        <MountainSnow size={48} />
        <p className="kicker">FUERA DE PISTA · 404</p>
        <h1>Esta ruta todavía no está trazada.</h1>
        <p>Volvamos a la montaña. Tu próxima aventura te está esperando.</p>
        <Link href="/" className="button button-coral">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

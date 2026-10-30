"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container section">
      <div className="empty-state">
        <h1>Una pausa en el camino.</h1>
        <p>
          No hemos podido cargar esta página. Vuelve a intentarlo en unos
          instantes.
        </p>
        <button className="button button-dark" onClick={reset}>
          Intentar de nuevo
        </button>
      </div>
    </main>
  );
}

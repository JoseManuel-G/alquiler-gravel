"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Users, Send, Check, X, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Photo from "./photo";
import { CommunityStart, PublishDestination } from "./community-start";
import { People } from "./people";
import { PublishedTrips } from "./published-trips";
import type { Person, Plan } from "./station-community";
type Connection = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string;
};
type Trip = {
  id: string;
  starts_on: string;
  ends_on: string;
  traveling_with?: string;
  party_size?: number;
  looking_for?: string;
  resort_id: string;
  resorts: { name: string; slug: string } | null;
};
type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};
type Member = { id: string; plan_id: string; user_id: string; status: string };
export function Community({ initialView = "inicio" }: { initialView?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(!supabase);
  const [tab, setTab] = useState(initialView);
  const [traveler, setTraveler] = useState<{ id: string; name: string } | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [profiles, setProfiles] = useState<Person[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [active, setActive] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (error) setMessage("No se pudo comprobar la sesión.");
      setUser(data.user);
      setLoaded(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => subscription.unsubscribe();
  }, []);
  const load = useCallback(async () => {
    if (!supabase || !user) return;
    const [t, c, p, m] = await Promise.all([
      supabase
        .from("trips")
        .select("*,resorts(name,slug)")
        .eq("user_id", user.id)
        .order("starts_on"),
      supabase
        .from("connections")
        .select("*")
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false }),
      supabase.from("plans").select("*").order("starts_on"),
      supabase.from("plan_members").select("*"),
    ]);
    const err = [t, c, p, m].find((r) => r.error)?.error;
    if (err) {
      setMessage("No se pudieron cargar todos los datos. " + err.message);
      return;
    }
    setTrips((t.data || []) as unknown as Trip[]);
    setConnections((c.data || []) as Connection[]);
    const memberships = (m.data || []) as Member[];
    setMembers(memberships);
    setPlans(
      ((p.data || []) as Plan[]).filter(
        (p) =>
          p.host_id === user.id ||
          memberships.some((m) => m.plan_id === p.id && m.user_id === user.id),
      ),
    );
    const ids = [
      ...new Set([
        ...(c.data || []).flatMap((c) => [c.requester_id, c.recipient_id]),
        ...memberships.map((m) => m.user_id),
      ]),
    ].filter((id) => id !== user.id);
    if (ids.length) {
      const { data, error } = await supabase
        .from("public_profiles")
        .select("*")
        .in("id", ids);
      if (error) setMessage(error.message);
      else setProfiles((data || []) as Person[]);
    }
  }, [user]);
  useEffect(() => {
    const task = setTimeout(() => void load(), 0);
    return () => clearTimeout(task);
  }, [load]);
  const loadMessages = useCallback(async () => {
    if (!supabase || !active) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("connection_id", active)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) setMessage(error.message);
    else setMessages(((data || []) as Message[]).reverse());
  }, [active]);
  useEffect(() => {
    if (!active || tab !== "mensajes") return;
    const initial = setTimeout(() => void loadMessages(), 0);
    const interval = setInterval(() => void loadMessages(), 5000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [active, tab, loadMessages]);
  const name = (id: string) =>
    profiles.find((p) => p.id === id)?.name || "Miembro";
  async function action(
    operation: () => PromiseLike<{ error: { message: string } | null }>,
    success: string,
  ) {
    setBusy(true);
    const { error } = await operation();
    setMessage(error ? error.message : success);
    if (!error) await load();
    setBusy(false);
  }
  async function send(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !user || !draft.trim() || !active) return;
    setBusy(true);
    const { error } = await supabase
      .from("messages")
      .insert({
        connection_id: active,
        sender_id: user.id,
        body: draft.trim(),
      });
    if (error) setMessage(error.message);
    else {
      setDraft("");
      await loadMessages();
    }
    setBusy(false);
  }
  if (tab === "inicio") return <CommunityStart />;
  if (!loaded) return <p className="loading">Cargando tu comunidad…</p>;
  if (!user || !supabase)
    return (
      <section className="container community-workspace">
        <div className="empty-state">
          <Users size={40} />
          <h2>
            Una misma pasión.
            <br />
            Muchas historias por compartir.
          </h2>
          <p>
            Guarda tus viajes, conecta con compañeros de tu nivel y organiza
            planes de esquí y snowboard. Las conversaciones empiezan cuando
            ambas personas aceptan conectar.
          </p>
          {!supabase && (
            <p>
              Estamos preparando la apertura de la comunidad. Mientras tanto,
              descubre tu próxima estación.
            </p>
          )}
          <div className="inline-actions">
            <Link className="button button-coral" href="/cuenta">
              Ir a mi cuenta
            </Link>
            <Link className="button button-light" href="/#estaciones">
              Explorar estaciones
            </Link>
          </div>
        </div>
      </section>
    );
  const db = supabase;
  const accepted = connections.filter((c) => c.status === "accepted");
  return (
    <section className="container community-workspace">
      <div className="community-toolbar"><Link href="/comunidad" className="text-button">← Inicio</Link><button className="text-button" onClick={() => setTab("viajes")}>Mis viajes</button><button className="text-button" onClick={() => setTab("conexiones")}>Conexiones{connections.some(c => c.status === "pending" && c.recipient_id === user.id) ? " · Nuevas" : ""}</button><button className="text-button" onClick={() => setTab("mensajes")}>Mensajes</button><button className="text-button" onClick={() => setTab("planes")}>Mis planes</button></div>
      {tab === "publicar" && <PublishDestination />}
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
      {tab === "publicados" && <PublishedTrips userId={user.id} traveler={traveler} onClearTraveler={() => setTraveler(null)} onManage={() => setTab("viajes")} onConnections={() => { void load(); setTab("conexiones"); }} onChat={async personId => {
        const { data, error } = await db.from("connections").select("id").eq("status", "accepted").or(`and(requester_id.eq.${user.id},recipient_id.eq.${personId}),and(requester_id.eq.${personId},recipient_id.eq.${user.id})`).maybeSingle();
        if (data && !error) { setActive(data.id); setTab("mensajes"); }
        else { void load(); setTab("conexiones"); }
      }} />}
      {tab === "personas" && <People userId={user.id} onTrips={person => { setTraveler({ id: person.id, name: person.name }); setTab("publicados"); }} />}
      {tab === "viajes" && (
        <>
          <div className="section-heading">
            <h2>Tu próximo destino.</h2>
            <Link href="/?action=publish#estaciones" className="button button-dark">
              Publicar un viaje
            </Link>
          </div>
          {trips.length ? (
            <div className="plan-list">
              {trips.map((t) => (
                <article key={t.id} className="plan-card">
                  <h3>{t.resorts?.name || "Estación"}</h3>
                  <p>{t.traveling_with || "Solo/a"}{(t.party_size || 1) > 1 ? ` · ${t.party_size} personas` : ""}</p>
                  {t.looking_for && <p>Buscamos: {t.looking_for}</p>}
                  <p>
                    {t.starts_on} → {t.ends_on}
                  </p>
                  <div className="inline-actions">
                    <Link
                      className="button button-light"
                      href={`/estaciones/${t.resorts?.slug}?from=${t.starts_on}&to=${t.ends_on}#companeros`}
                    >
                      Buscar compañeros
                    </Link>
                    <button
                      disabled={busy}
                      className="button button-outline"
                      onClick={() =>
                        void action(
                          () => db.from("trips").delete().eq("id", t.id),
                          "Viaje eliminado.",
                        )
                      }
                    >
                      <Trash2 size={15} />
                      Eliminar viaje
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Todavía no has publicado viajes.</h3>
              <p>
                Selecciona una estación y guarda tus fechas para que otros
                miembros puedan encontrarte.
              </p>
            </div>
          )}
        </>
      )}
      {tab === "conexiones" && (
        <>
          <h2>Tu gente de montaña.</h2>
          <div className="plan-list">
            {connections.map((c) => {
              const incoming = c.recipient_id === user.id;
              const other = incoming ? c.requester_id : c.recipient_id;
              const person = profiles.find(p => p.id === other);
              return (
                <article key={c.id} className="plan-card">
                  {profiles.find(p => p.id === other)?.avatar_url && <Photo src={profiles.find(p => p.id === other)!.avatar_url!} width={96} height={96} className="profile-photo" alt={`Foto de ${name(other)}`} />}
                  <h3>{name(other)}</h3>
                  {person && <><div className="chips"><span>{person.level}</span><span>{person.sport}</span></div><p>{person.bio}</p></>}
                  <p>
                    {c.status === "accepted"
                      ? "Conexión aceptada"
                      : c.status === "declined"
                        ? "Solicitud rechazada"
                        : incoming
                          ? "Quiere compartir unas bajadas contigo."
                          : "Tu solicitud está pendiente de respuesta."}
                  </p>
                  <div className="inline-actions">
                    {c.status === "pending" && incoming && (
                      <>
                        <button
                          disabled={busy}
                          className="button button-coral"
                          onClick={() =>
                            void action(
                              () =>
                                db.rpc("respond_connection", {
                                  connection: c.id,
                                  decision: "accepted",
                                }),
                              "¡Conexión aceptada! Ya podéis conversar.",
                            )
                          }
                        >
                          <Check size={16} />
                          Aceptar
                        </button>
                        <button
                          disabled={busy}
                          className="button button-outline"
                          onClick={() =>
                            void action(
                              () =>
                                db.rpc("respond_connection", {
                                  connection: c.id,
                                  decision: "declined",
                                }),
                              "Solicitud rechazada.",
                            )
                          }
                        >
                          <X size={16} />
                          Rechazar
                        </button>
                      </>
                    )}
                    {c.status === "accepted" && (
                      <button
                        className="button button-dark"
                        onClick={() => {
                          setActive(c.id);
                          setTab("mensajes");
                        }}
                      >
                        Abrir conversación
                      </button>
                    )}
                    <button
                      disabled={busy}
                      className="text-button"
                      onClick={() =>
                        void action(
                          () => db.from("connections").delete().eq("id", c.id),
                          "Conexión eliminada y conversación cerrada.",
                        )
                      }
                    >
                      {c.status === "pending"
                        ? "Cancelar solicitud"
                        : "Eliminar conexión"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          {!connections.length && (
            <div className="empty-state">
              <Users size={30} />
              <h3>Las buenas conexiones empiezan con un viaje.</h3>
              <p>
                Busca compañeros desde una estación y envía tu primera
                solicitud.
              </p>
            </div>
          )}
        </>
      )}
      {tab === "planes" && (
        <>
          <h2>Los planes que compartes.</h2>
          <div className="plan-list">
            {plans.map((p) => (
              <article className="plan-card" key={p.id}>
                <h3>{p.title}</h3>
                <p>
                  {p.starts_on} → {p.ends_on} · {p.level}
                </p>
                <p>{p.description}</p>
                {p.host_id === user.id ? (
                  <>
                    <p>
                      <strong>
                        Organizas este plan ·{" "}
                        {members.filter(
                          (m) => m.plan_id === p.id && m.status === "accepted",
                        ).length + 1}{" "}
                        / {p.capacity} plazas
                      </strong>
                    </p>
                    {members
                      .filter((m) => m.plan_id === p.id)
                      .map((m) => (
                        <div className="notice" key={m.id}>
                          <strong>{name(m.user_id)}</strong> ·{" "}
                          {m.status === "pending"
                            ? "Solicitud pendiente"
                            : m.status === "accepted"
                              ? "Aceptado"
                              : "Rechazado"}
                          {m.status === "pending" && (
                            <div className="inline-actions">
                              <button
                                disabled={busy}
                                className="button button-light"
                                onClick={() =>
                                  void action(
                                    () =>
                                      db.rpc("respond_plan", {
                                        membership: m.id,
                                        decision: "accepted",
                                      }),
                                    "Participante aceptado.",
                                  )
                                }
                              >
                                Aceptar
                              </button>
                              <button
                                disabled={busy}
                                className="text-button"
                                onClick={() =>
                                  void action(
                                    () =>
                                      db.rpc("respond_plan", {
                                        membership: m.id,
                                        decision: "declined",
                                      }),
                                    "Solicitud rechazada.",
                                  )
                                }
                              >
                                Rechazar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    <button
                      disabled={busy}
                      className="button button-outline"
                      onClick={() =>
                        void action(
                          () => db.from("plans").delete().eq("id", p.id),
                          "Plan cancelado.",
                        )
                      }
                    >
                      <Trash2 size={15} /> Cancelar plan
                    </button>
                  </>
                ) : (
                  <>
                    <p className="notice">
                      Estado de tu solicitud:{" "}
                      {members.find(
                        (m) => m.plan_id === p.id && m.user_id === user.id,
                      )?.status === "accepted"
                        ? "Aceptada"
                        : members.find(
                              (m) =>
                                m.plan_id === p.id && m.user_id === user.id,
                            )?.status === "declined"
                          ? "Rechazada"
                          : "Pendiente"}
                    </p>
                    <button
                      disabled={busy}
                      className="text-button"
                      onClick={() =>
                        void action(
                          () =>
                            db
                              .from("plan_members")
                              .delete()
                              .eq("plan_id", p.id)
                              .eq("user_id", user.id),
                          "Has salido del plan.",
                        )
                      }
                    >
                      Salir del plan
                    </button>
                  </>
                )}
              </article>
            ))}
          </div>
          {!plans.length && (
            <div className="empty-state">
              <h3>El próximo plan está por hacer.</h3>
              <p>
                Crea uno desde tu estación favorita o solicita unirte a un plan
                existente.
              </p>
              <Link href="/#estaciones" className="button button-dark">
                Descubrir destinos
              </Link>
            </div>
          )}
        </>
      )}
      {tab === "mensajes" && (
        <>
          <h2 style={{ marginBottom: 24 }}>Nos vemos arriba.</h2>
          {accepted.length ? (
            <div className="chat-layout">
              <aside className="chat-list">
                {accepted.map((c) => (
                  <button
                    key={c.id}
                    className={active === c.id ? "selected" : ""}
                    onClick={() => {
                      setActive(c.id);
                      setMessages([]);
                    }}
                  >
                    {name(
                      c.requester_id === user.id
                        ? c.recipient_id
                        : c.requester_id,
                    )}
                  </button>
                ))}
              </aside>
              <div className="chat-content">
                {active && accepted.some((c) => c.id === active) ? (
                  <>
                    <p className="muted">
                      Solo podéis leer esta conversación quienes formáis la
                      conexión. Se actualiza cada 5 segundos.
                    </p>
                    <div className="messages" aria-live="polite">
                      {!messages.length && (
                        <p className="muted">
                          Rompe el hielo. ¿Dónde quedamos para la primera
                          bajada?
                        </p>
                      )}
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={
                            m.sender_id === user.id ? "bubble mine" : "bubble"
                          }
                        >
                          {m.body}
                          <time dateTime={m.created_at}>
                            {new Date(m.created_at).toLocaleString("es-ES", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                      ))}
                    </div>
                    <form className="chat-form" onSubmit={send}>
                      <input
                        aria-label="Mensaje"
                        placeholder="Escribe un mensaje…"
                        value={draft}
                        maxLength={2000}
                        required
                        onChange={(e) => setDraft(e.target.value)}
                      />
                      <button
                        disabled={busy || !draft.trim()}
                        className="button button-coral"
                        aria-label="Enviar mensaje"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="empty-state">
                    <p>
                      Selecciona una conexión para abrir vuestra conversación.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <h3>Primero, una conexión.</h3>
              <p>
                Para conversar, ambos debéis aceptar la solicitud de conexión.
                Así, cada conversación empieza con ganas por las dos partes.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

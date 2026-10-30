"use client";
import Link from "next/link";
import Image from "@/components/photo";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  ArrowRight,
  Plus,
  CalendarDays,
  HeartHandshake,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
export type Person = {
  id: string;
  name: string;
  age: number;
  level: string;
  sport: string;
  bio: string;
  avatar_url: string | null;
  preferences: string;
};
export type Plan = {
  id: string;
  resort_id: string;
  host_id: string;
  title: string;
  description: string;
  starts_on: string;
  ends_on: string;
  level: string;
  capacity: number;
};
export function StationCommunity({
  resortId,
  demo,
}: {
  resortId: string;
  demo: boolean;
}) {
  const params = useSearchParams();
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || params.get("from") || "");
  const [intent, setIntent] = useState(params.get("action") === "publish" ? "publish" : "search");
  const [published, setPublished] = useState(false);
  const [travelingWith, setTravelingWith] = useState("Solo/a");
  const [partySize, setPartySize] = useState(1);
  const [lookingFor, setLookingFor] = useState("");
  const [level, setLevel] = useState(params.get("level") || "");
  const [user, setUser] = useState<User | null>(null);
  const [people, setPeople] = useState<
    (Person & { starts_on: string; ends_on: string })[]
  >([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  useEffect(() => {
    if (!supabase || demo) return;
    const db = supabase;
    void db.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => subscription.unsubscribe();
  }, [demo]);
  useEffect(() => {
    if (!supabase || demo || !user) return;
    void supabase
      .from("plans")
      .select("*")
      .eq("resort_id", resortId)
      .gte("ends_on", new Date().toISOString().slice(0, 10))
      .order("starts_on")
      .then(({ data, error }) => {
        if (error)
          setMessage("No se pudieron cargar los planes. " + error.message);
        else setPlans((data || []) as Plan[]);
      });
  }, [resortId, demo, user]);
  function validDates() {
    if (!from || !to || to < from) {
      setMessage(
        "Elige una fecha de inicio y una fecha de fin posterior o igual.",
      );
      return false;
    }
    if ((Date.parse(to) - Date.parse(from)) / 86400000 > 90) {
      setMessage("El viaje puede durar como máximo 90 días.");
      return false;
    }
    if (from < new Date().toLocaleDateString("en-CA")) {
      setMessage("Elige fechas actuales o futuras.");
      return false;
    }
    return true;
  }
  async function profileReady() {
    if (!supabase || !user) return false;
    const { data, error } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
    if (error) { setMessage("No se pudo comprobar tu perfil. Vuelve a intentarlo."); return false; }
    if (!data) { setMessage("Completa y guarda tu perfil en Mi cuenta antes de buscar compañeros o publicar viajes."); return false; }
    return true;
  }
  async function search(e: FormEvent) {
    e.preventDefault();
    if (!validDates()) return;
    if (!supabase || demo || !user) {
      setMessage(
        "Crea tu cuenta e inicia sesión para descubrir compañeros reales.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    if (!(await profileReady())) { setBusy(false); return; }
    const { data: trips, error } = await supabase
      .from("trips")
      .select("user_id,starts_on,ends_on")
      .eq("resort_id", resortId)
      .lte("starts_on", to)
      .gte("ends_on", from)
      .neq("user_id", user.id);
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }
    if (!trips?.length) {
      setPeople([]);
      setSearched(true);
      setBusy(false);
      return;
    }
    let q = supabase
      .from("public_profiles")
      .select("*")
      .in("id", [...new Set(trips.map((t) => t.user_id))]);
    if (level) q = q.eq("level", level);
    const { data: profiles, error: pe } = await q;
    if (pe) setMessage(pe.message);
    else {
      setPeople(
        (profiles || []).map((p) => ({
          ...p,
          ...trips.find((t) => t.user_id === p.id),
        })) as (Person & { starts_on: string; ends_on: string })[],
      );
      setSearched(true);
    }
    setBusy(false);
  }
  async function saveTrip() {
    if (!validDates() || !supabase || !user) return;
    setBusy(true);
    setMessage("");
    if (!(await profileReady())) { setBusy(false); return; }
    const { error } = await supabase
      .from("trips")
      .upsert(
        { user_id: user.id, resort_id: resortId, starts_on: from, ends_on: to, traveling_with: travelingWith, party_size: partySize, looking_for: lookingFor.trim() },
        {
          onConflict: "user_id,resort_id,starts_on,ends_on",
          ignoreDuplicates: false,
        },
      );
    setPublished(!error);
    setMessage(
      error
        ? error.code === "PGRST204" ? "Falta activar los datos de grupo: ejecuta trip-groups.sql en el Supabase de SKI MATCH." : "No se pudo guardar. Completa primero tu perfil y verifica tu email. " +
            error.message
        : "Viaje guardado. Ya pueden encontrarte en estas fechas.",
    );
    setBusy(false);
  }
  async function connect(id: string) {
    if (!supabase || !validDates()) return;
    setBusy(true);
    const { error } = await supabase.rpc("request_connection", {
      target_user: id,
      station: resortId,
      date_from: from,
      date_to: to,
    });
    setMessage(
      error
        ? error.message
        : "Solicitud enviada. Cuando la otra persona acepte podréis conversar en Comunidad.",
    );
    setBusy(false);
  }
  async function createPlan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase || !user) return;
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const { data, error } = await supabase
      .from("plans")
      .insert({
        host_id: user.id,
        resort_id: resortId,
        title: f.get("title"),
        description: f.get("description"),
        starts_on: f.get("starts_on"),
        ends_on: f.get("ends_on"),
        level: f.get("level"),
        capacity: Number(f.get("capacity")),
      })
      .select()
      .single();
    if (error) setMessage("No se pudo crear el plan. " + error.message);
    else {
      setPlans((p) => [data as Plan, ...p]);
      setShowPlan(false);
      setMessage("Plan creado. Puedes gestionar las solicitudes en Comunidad.");
    }
    setBusy(false);
  }
  async function join(plan: Plan) {
    if (!supabase || !user) return;
    setBusy(true);
    const { error } = await supabase
      .from("plan_members")
      .insert({ plan_id: plan.id, user_id: user.id, status: "pending" });
    setMessage(
      error
        ? error.code === "23505"
          ? "Ya has solicitado unirte a este plan."
          : error.message
        : "Solicitud enviada al organizador. Consulta su estado en Comunidad.",
    );
    setBusy(false);
  }
  return (
    <>
      <section className="workspace-section" id="companeros">
        <p className="kicker">EL DESTINO YA LO TIENES</p>
        <h2>Busca compañía o publica tu viaje</h2>
        <p className="muted">
          Buscar te muestra quién va a esta estación. Publicar hace que otras personas puedan encontrarte. Son dos acciones independientes.
        </p>
        {(!user || demo) && (
          <div className="notice">
            {demo
              ? "La comunidad aún no está activada. Los perfiles y los viajes reales aparecerán aquí cuando esté disponible."
              : "Inicia sesión para ver viajes y perfiles de miembros verificados."}{" "}
            <Link href="/cuenta">
              <strong>Ir a mi cuenta →</strong>
            </Link>
          </div>
        )}
        <div className="trip-intents" aria-label="¿Qué quieres hacer?">
          <button type="button" aria-pressed={intent === "search"} className={intent === "search" ? "trip-intent selected" : "trip-intent"} onClick={() => { setIntent("search"); setMessage(""); }}>
            <Users size={24} /><strong>Buscar compañeros</strong><span>Descubre quién coincide contigo y envía una solicitud.</span>
          </button>
          <button type="button" aria-pressed={intent === "publish"} className={intent === "publish" ? "trip-intent selected" : "trip-intent"} onClick={() => { setIntent("publish"); setMessage(""); }}>
            <CalendarDays size={24} /><strong>Publicar mi viaje</strong><span>Comparte cuándo vas para que puedan encontrarte.</span>
          </button>
        </div>
        <h3>{intent === "search" ? "¿Qué días quieres encontrar compañía?" : "¿Cuándo vas a esta estación?"}</h3>
        <p className="muted">Puedes elegir el mismo día de inicio y fin para una escapada de un día.</p>
        <form className="filters" onSubmit={(e) => { if (intent === "publish") { e.preventDefault(); void saveTrip(); } else void search(e); }}>
          <label className="field">
            Desde
            <input
              type="date"
              required
              value={from}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => { setFrom(e.target.value); if (!to || to < e.target.value) setTo(e.target.value); setSearched(false); setPublished(false); }}
            />
          </label>
          <label className="field">
            Hasta
            <input
              type="date"
              required
              value={to}
              min={from || new Date().toLocaleDateString("en-CA")}
              onChange={(e) => { setTo(e.target.value); setSearched(false); setPublished(false); }}
            />
          </label>
          {intent === "search" && <label className="field">
            Nivel
            <select aria-label="Nivel" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Todos los niveles</option>
              {["Principiante", "Intermedio", "Avanzado", "Experto"].map(
                (l) => (
                  <option key={l}>{l}</option>
                ),
              )}
            </select>
          </label>}
          {intent === "publish" && <div className="trip-group-fields"><label className="field">¿Con quién vas?<select value={travelingWith} onChange={e => { const value = e.target.value; setTravelingWith(value); setPartySize(value === "Solo/a" ? 1 : Math.max(2, partySize)); setPublished(false); }}>{["Solo/a", "Con amigos", "En pareja", "En familia"].map(v => <option key={v}>{v}</option>)}</select></label>
          {travelingWith !== "Solo/a" && <label className="field">¿Cuántos vais, incluyéndote?<input type="number" min={2} max={30} required value={partySize} onChange={e => { setPartySize(Number(e.target.value)); setPublished(false); }} /></label>}
          <label className="field">¿Qué compañía buscáis? · opcional<input maxLength={160} value={lookingFor} onChange={e => { setLookingFor(e.target.value); setPublished(false); }} placeholder="Por ejemplo: un grupo de amigas para esquiar y tomar algo" /><small>Describe el ambiente o el grupo que os gustaría conocer. Evita poner teléfonos u otros datos privados.</small></label></div>}
          <button disabled={busy || !user || demo} className="button button-dark">
            {busy ? "Un momento…" : intent === "publish" ? "Publicar mi viaje" : "Buscar compañeros"} <ArrowRight size={16} />
          </button>
        </form>
        {intent === "publish" && <p className="muted">Al publicar se compartirán tu perfil, esta estación y las fechas con los miembros. No se envían solicitudes automáticamente.</p>}
        {published && <div className="session-notice" role="status"><div><strong>¡Tu viaje ya está publicado!</strong><p>Ya pueden encontrarte para estas fechas.</p><Link href="/comunidad" className="button button-light">Ver y gestionar mi viaje</Link><button className="text-button" type="button" onClick={() => { setIntent("search"); setMessage(""); }}>Buscar compañeros ahora →</button></div></div>}
        {message && (
          <p className="notice" role="status">
            {message}
          </p>
        )}
        {intent === "search" && <div style={{ marginTop: 24 }}>
          {people.length ? (
            <div className="people-grid">
              {people.map((p) => (
                <article key={p.id} className="person-card">
                  <div className="avatar">
                    {p.avatar_url ? (
                      <Image
                        unoptimized
                        fill
                        src={p.avatar_url}
                        alt={p.name}
                        sizes="48px"
                      />
                    ) : (
                      p.name.charAt(0)
                    )}
                  </div>
                  <h3>
                    {p.name}, {p.age}
                  </h3>
                  <div className="chips">
                    <span>{p.level}</span>
                    <span>{p.sport}</span>
                  </div>
                  <p>{p.bio}</p>
                  <p>
                    {p.starts_on} → {p.ends_on}
                  </p>
                  <p>{p.preferences}</p>
                  <button
                    disabled={busy}
                    className="button button-coral"
                    onClick={() => connect(p.id)}
                  >
                    Conectar <HeartHandshake size={16} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Users size={32} />
              <h3>
                {searched
                  ? "La primera huella puede ser la tuya."
                  : "Tu gente, en tus fechas."}
              </h3>
              <p>
                {searched
                  ? "Todavía no hay compañeros que coincidan con esta búsqueda. Publica tu viaje, prueba otras fechas o invita a tus amigos."
                  : "Busca por fechas para descubrir a los compañeros que estarán en esta estación. Tú decides con quién conectar."}
              </p>
              {user && searched && <button type="button" className="button button-coral" onClick={() => setIntent("publish")}>Publicar mi viaje para que me encuentren</button>}
              <Link
                href={user ? "/comunidad" : "/cuenta"}
                className="button button-light"
              >
                {user ? "Ver mis viajes" : "Preparar mi próxima aventura"}{" "}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>}
      </section>
      <section className="workspace-section" id="planes">
        <div className="section-heading">
          <div>
            <p className="kicker">MÁS QUE UNA BAJADA</p>
            <h2>Un buen plan lo cambia todo.</h2>
          </div>
          {user && !demo ? (
            <button
              className="button button-dark"
              onClick={() => setShowPlan(!showPlan)}
            >
              <Plus size={16} />
              {showPlan ? "Cerrar formulario" : "Crear un plan"}
            </button>
          ) : (
            <Link href="/cuenta" className="button button-dark">
              Entra para crear un plan <Plus size={16} />
            </Link>
          )}
        </div>
        {showPlan && (
          <form className="panel form-stack" onSubmit={createPlan}>
            <h3>Un plan para compartir</h3>
            <label className="field">
              Título
              <input
                name="title"
                required
                minLength={5}
                maxLength={100}
                placeholder="Una mañana de bajadas tranquilas"
              />
            </label>
            <label className="field">
              Descripción
              <textarea
                name="description"
                required
                minLength={10}
                maxLength={1000}
                placeholder="Cuéntanos el plan y cómo os organizaréis. Evita publicar datos personales."
              />
            </label>
            <div className="form-row">
              <label className="field">
                Desde
                <input
                  name="starts_on"
                  type="date"
                  required
                  min={new Date().toLocaleDateString("en-CA")}
                  defaultValue={from}
                />
              </label>
              <label className="field">
                Hasta
                <input
                  name="ends_on"
                  type="date"
                  required
                  min={new Date().toLocaleDateString("en-CA")}
                  defaultValue={to}
                />
              </label>
              <label className="field">
                Nivel
                <select name="level">
                  {[
                    "Todos",
                    "Principiante",
                    "Intermedio",
                    "Avanzado",
                    "Experto",
                  ].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Plazas totales, incluyéndote
                <input
                  name="capacity"
                  type="number"
                  min={2}
                  max={30}
                  defaultValue={6}
                  required
                />
              </label>
            </div>
            <button disabled={busy} className="button button-coral">
              Publicar plan
            </button>
          </form>
        )}
        <div className="plan-list">
          {plans.map((p) => (
            <article className="plan-card" key={p.id}>
              <h3>{p.title}</h3>
              <div className="chips">
                <span>
                  {p.starts_on} → {p.ends_on}
                </span>
                <span>{p.level}</span>
                <span>Hasta {p.capacity} personas</span>
              </div>
              <p>{p.description}</p>
              {p.host_id === user?.id ? (
                <Link className="button button-light" href="/comunidad">
                  Gestionar mi plan
                </Link>
              ) : (
                <button
                  disabled={busy}
                  className="button button-outline"
                  onClick={() => join(p)}
                >
                  Solicitar unirme <ArrowRight size={16} />
                </button>
              )}
            </article>
          ))}
        </div>
        {!plans.length && (
          <div className="empty-state">
            <CalendarDays size={32} />
            <h3>Los grandes días empiezan con un plan.</h3>
            <p>
              No hay planes publicados que mostrar. Una escapada de fin de
              semana, unas bajadas a primera hora o un grupo para aprender: el
              siguiente puede ser el tuyo.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

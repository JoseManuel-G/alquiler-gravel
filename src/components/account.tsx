"use client";
import { useEffect, useState, type FormEvent } from "react";
import Image from "@/components/photo";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogOut, ArrowRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
const levels = ["Principiante", "Intermedio", "Avanzado", "Experto"];
export function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(!supabase);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [level, setLevel] = useState("Intermedio");
  const [sport, setSport] = useState("Esquí");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [preferences, setPreferences] = useState("");
  useEffect(() => {
    if (!supabase) return;
    const db = supabase;
    const load = async (u: User | null) => {
      setUser(u);
      if (u) {
        const { data, error } = await db
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .maybeSingle();
        if (error)
          setMessage(
            "No se pudo cargar tu perfil. Comprueba que se ha instalado el esquema de Supabase.",
          );
        if (data) {
          setName(data.name);
          setBirth(data.birth_date || "");
          setLevel(data.level);
          setSport(data.sport);
          setBio(data.bio || "");
          setAvatar(data.avatar_url || "");
          setPreferences(data.preferences || "");
        }
      }
      setLoaded(true);
    };
    void db.auth.getUser().then(({ data }) => load(data.user));
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === "PASSWORD_RECOVERY") setMode("new-password");
      else if (event === "SIGNED_IN")
        setTimeout(() => void load(session?.user || null), 0);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "");
    const password = String(f.get("password") || "");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/cuenta",
            data: { name: String(f.get("name") || "") },
          },
        });
        if (error) throw error;
        setMessage(
          "Cuenta solicitada. Revisa tu correo y confirma tu email antes de iniciar sesión.",
        );
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/cuenta",
        });
        if (error) throw error;
        setMessage(
          "Si existe una cuenta con ese email, recibirás un enlace de recuperación.",
        );
      } else if (mode === "new-password") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMode("login");
        setMessage("Contraseña actualizada.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Sesión iniciada. Completa tu perfil para participar.");
      }
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "No se pudo completar la operación.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name: name.trim(),
        birth_date: birth,
        level,
        sport,
        bio: bio.trim(),
        avatar_url: avatar.trim() || null,
        preferences: preferences.trim(),
      });
    setMessage(
      error
        ? "No se pudo guardar: " + error.message
        : "Perfil guardado. ¡Nos vemos arriba!",
    );
    setBusy(false);
  }
  if (!loaded) return <p className="loading">Cargando tu cuenta…</p>;
  return (
    <div className="container account-layout">
      <aside className="account-visual">
        <Image
          src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=85"
          unoptimized
          fill
          sizes="50vw"
          alt="Cumbres alpinas cubiertas de nieve"
        />
        <div>
          <p className="kicker">TU PRÓXIMA AVENTURA</p>
          <h2>
            Las mejores historias
            <br />
            empiezan en la montaña.
          </h2>
          <p>
            Una comunidad para compartir tu pasión por el esquí y el snowboard.
            A tu nivel. A tu ritmo.
          </p>
        </div>
      </aside>
      <section className="auth-panel">
        {!supabase && (
          <div className="notice">
            <ShieldCheck size={20} />
            <strong> La comunidad está en preparación.</strong>
            <p>
              Ya puedes explorar las estaciones. El registro y las conexiones
              estarán disponibles cuando se active la plataforma.
            </p>
          </div>
        )}
        {user && mode !== "new-password" ? (
          <>
            <p className="kicker">TU ESPACIO EN LA MONTAÑA</p>
            <h1>Mi perfil</h1>
            <p className="muted">{user.email}</p>
            <form className="form-stack" onSubmit={save}>
              <label className="field">
                Nombre público
                <input
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                Fecha de nacimiento · solo mayores de 18 años
                <input
                  type="date"
                  required
                  max={new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18),
                  )
                    .toISOString()
                    .slice(0, 10)}
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                />
              </label>
              <div className="form-row">
                <label className="field">
                  Nivel
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {levels.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Modalidad
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                  >
                    {["Esquí", "Snowboard", "Ambas"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                Sobre ti
                <textarea
                  maxLength={500}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="¿Qué hace que un día en la montaña sea perfecto para ti?"
                />
              </label>
              <label className="field">
                Preferencias
                <input
                  maxLength={150}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Primera hora, après-ski, bajadas tranquilas…"
                />
              </label>
              <label className="field">
                Foto de perfil · URL HTTPS
                <input
                  type="url"
                  pattern="https://.*"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://…"
                />
              </label>
              <p className="muted">
                Tu nombre, edad, nivel, foto y preferencias son visibles para
                los miembros verificados. Tu email y fecha de nacimiento no se
                muestran.
              </p>
              <button disabled={busy} className="button button-coral">
                {busy ? "Guardando…" : "Guardar perfil"}{" "}
                <ArrowRight size={16} />
              </button>
            </form>
            <div className="inline-actions" style={{ marginTop: 20 }}>
              <Link href="/comunidad" className="button button-light">
                Mis viajes y conexiones
              </Link>
              <button
                className="text-button"
                onClick={async () => {
                  await supabase?.auth.signOut();
                  setUser(null);
                  setMessage("Sesión cerrada.");
                }}
              >
                <LogOut size={14} /> Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="kicker">NOS VEMOS ARRIBA</p>
            <h1>
              {mode === "signup"
                ? "Encuentra tu gente."
                : mode === "reset"
                  ? "Vuelve a la aventura."
                  : mode === "new-password"
                    ? "Tu nueva contraseña."
                    : "Qué bueno verte."}
            </h1>
            <p className="muted">
              {mode === "signup"
                ? "Crea tu cuenta y empieza a compartir la montaña."
                : "Tu próximo plan en la nieve empieza aquí."}
            </p>
            {mode !== "new-password" && (
              <div className="tabs">
                <button
                  className={mode === "login" ? "selected" : ""}
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                >
                  Iniciar sesión
                </button>
                <button
                  className={mode === "signup" ? "selected" : ""}
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                >
                  Crear cuenta
                </button>
              </div>
            )}
            <form className="form-stack" onSubmit={submit}>
              {mode === "signup" && (
                <label className="field">
                  Tu nombre
                  <input
                    name="name"
                    required
                    maxLength={60}
                    autoComplete="given-name"
                  />
                </label>
              )}
              {mode !== "new-password" && (
                <label className="field">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@email.com"
                  />
                </label>
              )}
              {mode !== "reset" && (
                <label className="field">
                  Contraseña
                  <input
                    name="password"
                    type="password"
                    minLength={10}
                    maxLength={128}
                    required
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    placeholder="Al menos 10 caracteres"
                  />
                </label>
              )}
              {mode === "signup" && (
                <label className="muted">
                  <input type="checkbox" required /> Tengo al menos 18 años y
                  acepto las{" "}
                  <Link href="/info/condiciones">
                    <u>condiciones</u>
                  </Link>{" "}
                  y la{" "}
                  <Link href="/info/privacidad">
                    <u>política de privacidad</u>
                  </Link>
                  .
                </label>
              )}
              <button
                disabled={!supabase || busy}
                className="button button-coral"
              >
                {busy
                  ? "Un momento…"
                  : mode === "signup"
                    ? "Crear mi cuenta"
                    : mode === "reset"
                      ? "Enviar enlace"
                      : mode === "new-password"
                        ? "Actualizar contraseña"
                        : "Entrar a Ski Match"}{" "}
                <ArrowRight size={17} />
              </button>
              {mode === "login" && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setMode("reset");
                    setMessage("");
                  }}
                >
                  He olvidado mi contraseña
                </button>
              )}
            </form>
            <p className="prelaunch">
              Conexiones por una misma pasión. Ski Match es una comunidad
              deportiva, no una aplicación de citas.
            </p>
          </>
        )}
        {message && (
          <p className="notice" role="status">
            {message}
          </p>
        )}
      </section>
    </div>
  );
}

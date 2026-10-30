"use client";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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
  const [savedAvatar, setSavedAvatar] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);
  function choosePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage("Elige una foto JPG, PNG o WebP de hasta 5 MB.");
      e.target.value = "";
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setMessage("");
  }
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
          setSavedAvatar(data.avatar_url || "");
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/cuenta",
            data: { name: String(f.get("name") || "") },
          },
        });
        if (error) throw error;
        setMessage(
          data.session ? "¡Ya estás dentro! Completa tu perfil para participar." : "Cuenta solicitada. Revisa tu correo y confirma tu email antes de iniciar sesión.",
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
    setMessage("");
    let uploadedPath: string | null = null;
    try {
      let nextAvatar = avatar;
      if (photoFile) {
        const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[photoFile.type];
        uploadedPath = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("avatars").upload(uploadedPath, photoFile, { contentType: photoFile.type, upsert: false });
        if (error) throw new Error("No se pudo subir la foto. Comprueba que está configurado el almacenamiento de fotos. " + error.message);
        nextAvatar = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/avatars/${uploadedPath}`;
      }
      const { error } = await supabase.from("profiles").upsert({
        id: user.id, name: name.trim(), birth_date: birth, level, sport,
        bio: bio.trim(), avatar_url: nextAvatar || null, preferences: preferences.trim(),
      });
      if (error) throw error;
      const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/avatars/`;
      if (savedAvatar.startsWith(prefix) && savedAvatar !== nextAvatar)
        await supabase.storage.from("avatars").remove([savedAvatar.slice(prefix.length)]);
      setAvatar(nextAvatar);
      setSavedAvatar(nextAvatar);
      setPhotoFile(null);
      setPhotoPreview("");
      window.dispatchEvent(new Event("ski-profile-updated"));
      setMessage("Perfil guardado. ¡Nos vemos arriba!");
    } catch (error) {
      if (uploadedPath) await supabase.storage.from("avatars").remove([uploadedPath]);
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el perfil.");
    } finally { setBusy(false); }
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
        {message && <p className="notice" role="status">{message}</p>}
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
            <div className="profile-heading">
              {photoPreview || avatar ? <Image key={photoPreview || avatar} src={photoPreview || avatar} width={96} height={96} alt="Tu foto de perfil" className="profile-photo" /> : <div className="photo-placeholder" aria-label="Todavía no tienes foto">{name.slice(0, 1).toUpperCase() || "?"}</div>}
              <div><h1>{name.trim() || "Mi perfil"}</h1><p className="muted">Tu perfil en SKI MATCH</p><a href="#profile-photo" className="text-button">{avatar || photoFile ? "Cambiar mi foto" : "Añadir mi foto"}</a></div>
            </div>
            <div className="session-notice" role="status"><ShieldCheck size={20} /><div><strong>Has iniciado sesión</strong><br /><span>{user.email}</span></div></div>
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
              <div className="photo-editor">
                {photoPreview || avatar ? <Image key={photoPreview || avatar} src={photoPreview || avatar} width={96} height={96} alt="Tu foto de perfil" className="profile-photo" /> : <div className="photo-placeholder" aria-label="Sin foto">{name.slice(0, 1).toUpperCase() || "?"}</div>}
                <label className="field">
                  Foto de perfil
                  <input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} disabled={busy} aria-describedby="photo-help" />
                  <small id="photo-help">Elige una foto · JPG, PNG o WebP · Máximo 5 MB. Se subirá al guardar el perfil.</small>
                </label>
                {(avatar || photoFile) && <button type="button" className="text-button" disabled={busy} onClick={() => { setAvatar(""); setPhotoFile(null); setPhotoPreview(""); }}>Quitar foto</button>}
              </div>
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

      </section>
    </div>
  );
}

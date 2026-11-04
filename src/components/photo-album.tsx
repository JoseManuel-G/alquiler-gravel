"use client";
import { useEffect, useState, type ChangeEvent } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from "lucide-react";
import Photo from "./photo";
import { profilePhotoCount } from "@/lib/profile-photo-rules";
import { supabase } from "@/lib/supabase";

const bucket = "avatars";
const maxExtra = 4;
const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/avatars/`;
type AlbumPhoto = { path: string; url: string };
function useAlbum(userId: string, onPhotosChange?: (urls: string[]) => void) {
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) return;
      setLoading(true); setError("");
      try {
        const { data, error } = await supabase.storage.from(bucket).list(userId, { limit: 100, search: "gallery-", sortBy: { column: "name", order: "asc" } });
        if (!active) return;
        if (error) throw error;
        const rows = (data || []).filter(p => p.name.startsWith("gallery-") && p.id).map(p => { const path = `${userId}/${p.name}`; return { path, url: prefix + path }; });
        setPhotos(rows); onPhotosChange?.(rows.map(p => p.url));
      } catch { if (active) setError("No se pudieron cargar las fotos."); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [userId, revision, onPhotosChange]);
  return { photos, loading, error, refresh: () => setRevision(r => r + 1) };
}

export function PersonGallery({ userId, avatar, name, fallback }: { userId: string; avatar?: string | null; name: string; fallback?: React.ReactNode }) {
  const { photos, error } = useAlbum(userId);
  const [index, setIndex] = useState(0);
  const urls = [...new Set([avatar, ...photos.slice(0, maxExtra).map(p => p.url)].filter((p): p is string => !!p))];
  const current = index % Math.max(urls.length, 1);
  if (!urls.length) return <>{fallback || <div className="album-empty">{name.charAt(0).toUpperCase()}<span>Todavía sin foto</span></div>}</>;
  return <div className="person-gallery" role="group" aria-label={`Fotos de ${name}`}>
    <Photo key={urls[current]} src={urls[current]} fill sizes="(max-width: 700px) 100vw, 33vw" alt={`Foto ${current + 1} de ${name}`} className="gallery-image" />
    <span className="gallery-count" aria-live="polite">{current + 1} / {urls.length}</span>
    {urls.length > 1 && <><button type="button" className="gallery-arrow previous" aria-label={`Foto anterior de ${name}`} onClick={() => setIndex((current + urls.length - 1) % urls.length)}><ChevronLeft /></button><button type="button" className="gallery-arrow next" aria-label={`Foto siguiente de ${name}`} onClick={() => setIndex((current + 1) % urls.length)}><ChevronRight /></button></>}
    {error && <span className="gallery-count gallery-warning">No se pudieron cargar las demás fotos</span>}
  </div>;
}

export function AlbumEditor({ userId, enabled, portrait = "", profileSaved = false, onPhotosChange }: { userId: string; enabled: boolean; portrait?: string; profileSaved?: boolean; onPhotosChange?: (urls: string[]) => void }) {
  const { photos, loading, error, refresh } = useAlbum(userId,onPhotosChange);
  const canRemove = !profileSaved || profilePhotoCount(photos.map(p => p.url),portrait,`${prefix}${userId}/`)>2;
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => () => previews.forEach(url => URL.revokeObjectURL(url)), [previews]);
  function choose(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    e.target.value = "";
    if (photos.length + selected.length > maxExtra) { setMessage(`Puedes añadir hasta ${maxExtra} fotos adicionales.`); return; }
    if (selected.some(f => !["image/jpeg", "image/png", "image/webp"].includes(f.type) || f.size > 5 * 1024 * 1024)) { setMessage("Elige fotos JPG, PNG o WebP de hasta 5 MB cada una."); return; }
    setFiles(selected); setPreviews(selected.map(f => URL.createObjectURL(f))); setMessage("");
  }
  async function upload() {
    if (!supabase || !enabled || !files.length) return;
    setBusy(true); setMessage("");
    const uploaded: string[] = [];
    try {
      // Recheck the stored album in case another tab has added photos.
      const existing = await supabase.storage.from(bucket).list(userId, { limit: 100, search: "gallery-" });
      if (existing.error) throw existing.error;
      if ((existing.data || []).filter(p => p.name.startsWith("gallery-") && p.id).length + files.length > maxExtra) throw new Error("Ya tienes cuatro fotos adicionales. Quita alguna antes de añadir más.");
      for (const file of files) {
        const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
        const path = `${userId}/gallery-${crypto.randomUUID()}.${ext}`;
        const result = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
        if (result.error) throw result.error;
        uploaded.push(path);
      }
      setFiles([]); setPreviews([]); setMessage("¡Fotos guardadas! Ya aparecen en tus viajes y tu ficha."); refresh();
    } catch {
      if (uploaded.length) await supabase.storage.from(bucket).remove(uploaded);
      setMessage("No se pudieron guardar las fotos. Comprueba tu conexión y vuelve a intentarlo (máximo cuatro fotos adicionales)."); refresh();
    } finally { setBusy(false); }
  }
  async function remove(path: string) {
    if (!supabase || !canRemove) return;
    setBusy(true); setMessage("");
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      setMessage("Foto eliminada."); refresh();
    } catch { setMessage("No se pudo eliminar la foto. Vuelve a intentarlo."); }
    finally { setBusy(false); }
  }
  return <section className="album-editor" aria-labelledby="album-title"><h2 id="album-title">Tus fotos · mínimo dos</h2><p className="muted">Sube al menos dos fotos para completar tu perfil. Puedes hacerlo antes de guardar tus datos. Los miembros las verán en tus viajes y tu ficha.</p>
    {!enabled && <p className="notice">Inicia sesión para añadir fotos.</p>}
    {loading ? <p role="status">Cargando fotos…</p> : error ? <p className="notice" role="alert">{error} <button type="button" className="text-button" onClick={refresh}>Reintentar</button></p> : <div className="album-thumbnails">{photos.map(p => <div key={p.path}><Photo src={p.url} width={140} height={140} alt="Foto de tu álbum" /><button type="button" className="text-button" disabled={busy||!canRemove||p.url===portrait} title={p.url===portrait ? "Cambia la foto principal desde el campo de arriba" : !canRemove ? "Sube otra foto antes de eliminar esta: el mínimo es dos" : "Eliminar esta foto"} onClick={() => void remove(p.path)}><Trash2 size={14} />{p.url===portrait?"Foto principal":"Eliminar"}</button></div>)}</div>}
    {photos.length < maxExtra && <><div className="form-row"><label className="field"><span><ImagePlus size={18} /> Elegir de mi galería</span><input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={!enabled || loading || busy || !!error} onChange={choose} /></label><label className="field">Hacer una foto<input type="file" accept="image/jpeg,image/png,image/webp" capture="user" disabled={!enabled || loading || busy || !!error} onChange={choose} /></label></div><small>JPG, PNG o WebP · Hasta 5 MB por foto · {Math.max(0, maxExtra - photos.length)} huecos disponibles. La cámara depende del dispositivo y del navegador.</small></>}
    {!!previews.length && <><div className="album-thumbnails">{previews.map(url => <Photo key={url} src={url} width={140} height={140} alt="Vista previa antes de guardar" />)}</div><div className="inline-actions"><button type="button" className="button button-coral" disabled={busy} onClick={() => void upload()}>{busy ? "Guardando…" : `Guardar ${files.length} foto${files.length > 1 ? "s" : ""}`}</button><button type="button" className="text-button" disabled={busy} onClick={() => { setFiles([]); setPreviews([]); }}>Cancelar</button></div></>}
    {profileSaved && !canRemove && <p className="muted">Debes conservar dos fotos. Para cambiar una, sube primero la nueva.</p>}
    {message && <p className="notice" role="status">{message}</p>}
  </section>;
}

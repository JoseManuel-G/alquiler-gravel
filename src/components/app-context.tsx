"use client";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Resort } from "@/lib/resorts";
import { EMPTY_SELECTION, normalizeSelection, type TravelSelection } from "@/lib/travel-selection";
import { supabase } from "@/lib/supabase";
import { Account } from "./account";
const Social = dynamic(() => import("./community").then(m => m.Community), { loading: () => <p>Cargando…</p> });
const Editor = dynamic(() => import("./trip-editor").then(m => m.TripEditor), { loading: () => <p>Cargando…</p> });
const key = "skimatch-destination-v1";
let cachedRaw: string | null = null;
let cachedSelection = EMPTY_SELECTION;
let memoryOnly = false;
function snapshot() {
  if (typeof window === "undefined") return EMPTY_SELECTION;
  if (memoryOnly) return cachedSelection;
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { return cachedSelection; }
  if (raw !== cachedRaw) { cachedRaw = raw; try { cachedSelection = normalizeSelection(JSON.parse(raw || "null")); } catch { cachedSelection = EMPTY_SELECTION; } }
  return cachedSelection;
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener("skimatch-destination", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("skimatch-destination", callback); };
}
export type EditableTrip = { id: string; resort_id: string; starts_on: string; ends_on: string; traveling_with?: string; party_size?: number; looking_for?: string };
type App = {
  resorts: Resort[]; catalogError: boolean; selection: TravelSelection; select: (v: TravelSelection) => void;
  user: User | null; ready: boolean; avatar: string; name: string; requireAuth: (action: () => void) => void;
  publish: (trip?: EditableTrip) => void; social: (view?: "mensajes" | "conexiones" | "planes", personId?: string) => void; revision: number;
};
const Context = createContext<App | null>(null);
export const useApp = () => { const value = useContext(Context); if (!value) throw new Error("Missing SKI MATCH context"); return value; };
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const node = ref.current; node?.showModal(); return () => node?.close(); }, []);
  return <dialog ref={ref} className="sm-dialog" aria-label={title} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}><div className="sm-dialog-head"><strong>{title}</strong><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><X /></button></div>{children}</dialog>;
}
export function AppProvider({ children, resorts, catalogError }: { children: ReactNode; resorts: Resort[]; catalogError: boolean }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const selection = useSyncExternalStore(subscribe, snapshot, () => EMPTY_SELECTION);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!supabase);
  const [avatar, setAvatar] = useState(""); const [name, setName] = useState("");
  const [auth, setAuth] = useState(false); const pending = useRef<(() => void) | null>(null);
  const [editing, setEditing] = useState<EditableTrip | "new" | null>(null);
  const [socialView, setSocialView] = useState<"mensajes" | "conexiones" | "planes" | null>(null);
  const [chatPerson, setChatPerson] = useState<string | undefined>();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const task = setTimeout(() => { setEditing(null); setSocialView(null); setAuth(false); pending.current = null; }, 0);
    return () => clearTimeout(task);
  }, [pathname]);
  useEffect(() => {
    if (!supabase) return;
    const db = supabase; let active = true;
    async function profile(u: User | null) {
      if (!active) return;
      if (!u) { setAvatar(""); setName(""); return; }
      const { data } = await db.from("profiles").select("name,avatar_url").eq("id", u.id).maybeSingle();
      if (active) { setAvatar(data?.avatar_url || ""); setName(data?.name || u.user_metadata?.name || ""); }
    }
    void db.auth.getUser().then(({ data }) => { if (active) { setUser(data.user); setReady(true); void profile(data.user); } });
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user || null); setReady(true);
      setTimeout(() => {
        if (!active) return;
        void profile(session?.user || null);
        if (session?.user && pending.current) { const action = pending.current; pending.current = null; setAuth(false); action(); }
        if (!session) { setEditing(null); setSocialView(null); }
      }, 0);
    });
    const refresh = () => { void db.auth.getUser().then(({ data }) => profile(data.user)); };
    window.addEventListener("ski-profile-updated", refresh);
    return () => { active = false; subscription.unsubscribe(); window.removeEventListener("ski-profile-updated", refresh); };
  }, []);
  const select = (value: TravelSelection) => {
    cachedSelection = normalizeSelection(value); cachedRaw = JSON.stringify(cachedSelection);
    try { localStorage.setItem(key, cachedRaw); } catch { memoryOnly = true; }
    window.dispatchEvent(new Event("skimatch-destination"));
  };
  const requireAuth = (action: () => void) => { if (user) action(); else { pending.current = action; setAuth(true); } };
  const closeAuth = () => { pending.current = null; setAuth(false); };
  return <Context.Provider value={{ resorts, catalogError, selection, select, user, ready, avatar, name, requireAuth,
    publish: trip => requireAuth(() => setEditing(trip || "new")), social: (view = "mensajes", personId) => requireAuth(() => { setChatPerson(personId); setSocialView(view); }), revision }}>
    {children}
    {auth && <Modal title="Entra y continúa donde estabas" onClose={closeAuth}><Account compact /></Modal>}
    {editing && user && <Modal title={editing === "new" ? "Publicar un viaje" : "Editar mi viaje"} onClose={() => setEditing(null)}><Editor trip={editing === "new" ? undefined : editing} onSaved={() => { setEditing(null); setRevision(r => r + 1); }} /></Modal>}
    {socialView && user && <Modal title={socialView === "planes" ? "Tus planes" : "Mensajes y solicitudes"} onClose={() => setSocialView(null)}><Social key={`${socialView}:${chatPerson}`} initialView={socialView} initialPersonId={chatPerson} embedded /></Modal>}
  </Context.Provider>;
}

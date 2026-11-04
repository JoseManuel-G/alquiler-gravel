"use client";
import Link from "next/link";
import { MountainSnow, Compass, Users, UserRound, MessagesSquare, Plus, CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp } from "./app-context";
import Photo from "./photo";
export function Brand() { return <Link href="/" className="brand" aria-label="SKI MATCH, explorar"><MountainSnow size={30} strokeWidth={1.7} /><span>ski<span className="brand-light">match</span></span></Link>; }
export function Header() {
 const path = usePathname(); const app = useApp();
 const links = [{href:"/", label:"Explorar", Icon:Compass}, {href:"/viajes", label:"Viajes", Icon:CalendarDays}, {href:"/personas",label:"Personas", Icon:Users}];
 return <><header className="header sm-header"><div className="container header-inner"><Brand /><nav className="sm-primary" aria-label="Navegación principal">{links.map(({href,label}) => <Link key={href} href={href} aria-current={path===href ? "page" : undefined}>{label}</Link>)}</nav><div className="sm-header-actions"><button className="button button-coral sm-publish" onClick={() => app.publish()}><Plus size={18}/><span>Publicar viaje</span></button><button className="icon-button sm-messages" aria-label="Mensajes y solicitudes" onClick={() => app.social()}><MessagesSquare size={23}/></button>
 {app.user ? <details className="profile-menu"><summary aria-label="Abrir menú de mi perfil">{app.avatar ? <Photo key={app.avatar} src={app.avatar} width={40} height={40} alt="Mi perfil" /> : <span className="sm-avatar">{app.name.charAt(0).toUpperCase() || <UserRound size={20}/>}</span>}</summary><div><strong>{app.name || "Mi cuenta"}</strong><Link href="/cuenta">Mi perfil y fotos</Link><Link href="/viajes?mine=1">Mis viajes</Link><button onClick={() => app.social("conexiones")}>Solicitudes y conexiones</button><button onClick={() => app.social("planes")}>Mis planes compartidos</button><Link href="/cuenta">Cuenta y cerrar sesión</Link></div></details> : <button disabled={!app.ready} className="icon-button sm-login" aria-label="Iniciar sesión o registrarme" onClick={() => app.requireAuth(() => {})}><UserRound size={22}/></button>}
 </div></div></header><nav className="mobile-bottom sm-mobile-nav" aria-label="Navegación móvil">{links.map(({href,label,Icon}) => <Link key={href} href={href} aria-current={path===href ? "page" : undefined}><Icon size={21}/>{label}</Link>)}</nav></>;
}
export function Footer() {
 return <footer className="sm-footer"><div className="container"><div><Brand/><p>Montaña, planes y buena compañía.</p></div><nav aria-label="Información"><Link href="/info/nosotros">Sobre SKI MATCH</Link><Link href="/info/privacidad">Privacidad</Link><Link href="/info/condiciones">Condiciones</Link><Link href="/info/contacto">Contacto</Link></nav><small>© {new Date().getFullYear()} SKI MATCH</small></div></footer>;
}

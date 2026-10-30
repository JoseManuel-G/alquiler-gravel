"use client";
import Link from "next/link";
import {
  MountainSnow,
  Compass,
  Users,
  UserRound,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Ski Match, inicio">
      <MountainSnow size={31} strokeWidth={1.6} />
      <span>
        ski<span className="brand-light">match</span>
        <i>®</i>
      </span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav
            className={open ? "nav open" : "nav"}
            aria-label="Navegación principal"
          >
            <Link
              onClick={() => setOpen(false)}
              className={path === "/" ? "active" : ""}
              href="/#estaciones"
            >
              Explorar estaciones
            </Link>
            <Link onClick={() => setOpen(false)} href="/#como-funciona">
              Cómo funciona
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className={path === "/comunidad" ? "active" : ""}
              href="/comunidad"
            >
              La comunidad
            </Link>
          </nav>
          <Link className="button button-dark header-button" href="/cuenta">
            Únete a la aventura <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-button icon-button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <nav className="mobile-bottom" aria-label="Navegación móvil">
        <Link href="/#estaciones">
          <Compass size={20} />
          Explorar
        </Link>
        <Link href="/comunidad">
          <Users size={20} />
          Comunidad
        </Link>
        <Link href="/cuenta">
          <UserRound size={20} />
          Mi perfil
        </Link>
      </nav>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              La nieve nos une.
              <br />
              La aventura la compartimos.
            </p>
          </div>
          <div>
            <span>EXPLORA</span>
            <Link href="/#estaciones">Estaciones</Link>
            <Link href="/#como-funciona">Cómo funciona</Link>
            <Link href="/comunidad">La comunidad</Link>
          </div>
          <div>
            <span>SKI MATCH</span>
            <Link href="/info/nosotros">Sobre nosotros</Link>
            <Link href="/info/contacto">Contacto</Link>
            <Link href="/info/privacidad">Privacidad</Link>
            <Link href="/info/condiciones">Condiciones de uso</Link>
          </div>
          <div className="footer-note">
            <MountainSnow size={38} />
            <p>
              Menos «a ver si vamos».
              <br />
              <strong>Más «nos vemos arriba».</strong>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Ski Match. Hecho para compartir la
            montaña.
          </span>
          <span>ESPAÑA · 42°41′N 0°56′E</span>
        </div>
      </div>
    </footer>
  );
}

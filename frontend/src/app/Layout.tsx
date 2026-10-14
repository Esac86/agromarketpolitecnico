import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { NotificationBell } from "@/features/notifications/NotificationBell";
import { IconClose, IconMenu } from "@/shared/ui/icons";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

const enlace = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-surface-2 text-ink shadow-xs" : "text-muted hover:text-ink hover:bg-surface-2/60"
  }`;

const enlaceMovil = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2.5 text-base font-medium ${isActive ? "bg-surface-2 text-ink" : "text-ink"}`;

export function Layout() {
  const { usuario, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuAbierto(false), [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-bg selection:bg-accent/20">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/85 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-1.5 font-display text-lg font-semibold text-primary">
            🌾 AgroMarket
          </Link>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
            <NavLink to="/" end className={enlace}>
              Inicio
            </NavLink>
            {usuario && (
              <>
                <NavLink to="/publicar" className={enlace}>
                  Publicar
                </NavLink>
                <NavLink to="/mensajes" className={enlace}>
                  Mensajes
                </NavLink>
                {usuario.es_administrador && (
                  <NavLink to="/admin" className={enlace}>
                    Panel admin
                  </NavLink>
                )}
              </>
            )}
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <div className="h-4 w-px bg-line/80" />
            {usuario ? (
              <>
                <NotificationBell />
                <Link
                  to="/perfil"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-display text-sm font-semibold text-primary shadow-xs hover:ring-2 hover:ring-primary/20 transition-all"
                  title={usuario.nombre_completo}
                >
                  {usuario.nombre_completo.charAt(0)}
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-ink hover:bg-surface-2 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="rounded-xl bg-accent px-4 py-1.5 text-sm font-bold text-accent-ink shadow-xs hover:brightness-105 transition-all"
                >
                  Registrarme
                </Link>
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1 md:hidden">
            <ThemeToggle />
            {usuario && <NotificationBell />}
            <button
              onClick={() => setMenuAbierto((v) => !v)}
              className="rounded-lg p-2 text-ink hover:bg-surface-2"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            >
              {menuAbierto ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <nav className="border-t border-line px-4 pb-4 pt-2 md:hidden">
            <NavLink to="/" end className={enlaceMovil}>
              Inicio
            </NavLink>
            {usuario ? (
              <>
                <NavLink to="/publicar" className={enlaceMovil}>
                  Publicar
                </NavLink>
                <NavLink to="/mensajes" className={enlaceMovil}>
                  Mensajes
                </NavLink>
                <NavLink to="/perfil" className={enlaceMovil}>
                  Mi perfil
                </NavLink>
                {usuario.es_administrador && (
                  <NavLink to="/admin" className={enlaceMovil}>
                    Panel admin
                  </NavLink>
                )}
                <button onClick={logout} className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-danger">
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={enlaceMovil}>
                  Ingresar
                </NavLink>
                <NavLink to="/registro" className={enlaceMovil}>
                  Registrarme
                </NavLink>
              </>
            )}
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-line/80 bg-surface/50 backdrop-blur-xs">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-1.5 font-display text-lg font-bold text-primary">
                🌾 AgroMarket
              </div>
              <p className="max-w-sm text-sm text-muted">
                Marketplace digital especializado para el sector agropecuario y ganadero. Conectamos productores, criadores y proveedores con verificación de identidad y trazabilidad sanitaria obligatoria.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-success font-medium">
                  ✓ Verificación con Cédula
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-accent font-medium">
                  ✓ Sin Intermediarios
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Categorías</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><Link to="/?categoria=insumo_veterinario" className="hover:text-primary transition-colors">Insumos Veterinarios</Link></li>
                <li><Link to="/?categoria=alimento_balanceado" className="hover:text-primary transition-colors">Alimentos y Suplementos</Link></li>
                <li><Link to="/?categoria=animal_genetica" className="hover:text-primary transition-colors">Animales y Genética</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Proyecto</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><Link to="/terminos" className="hover:text-primary transition-colors">Términos del Servicio</Link></li>
                <li><Link to="/privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                <li><a href="https://agro.esacsalud.com/api/docs/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">API & Swagger</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-line/60 pt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
            <p>© 2026 AgroMarket — Proyecto de Emprendimiento de Base Tecnológica. Politécnico Grancolombiano.</p>
            <p className="text-[11px] text-muted/80">Facultad de Ingeniería, Diseño e Innovación</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconCattle, IconShieldCheck, IconWheat } from "@/shared/ui/icons";

const BENEFICIOS = [
  {
    Icono: IconShieldCheck,
    titulo: "Vendedores Verificados",
    desc: "Validación de cédula y antecedentes para negociar con confianza.",
  },
  {
    Icono: IconCattle,
    titulo: "Trazabilidad Sanitaria",
    desc: "Certificados y estado de salud al día en ganado y genética.",
  },
  {
    Icono: IconWheat,
    titulo: "Comercio Directo",
    desc: "Sin intermediarios ni comisiones abusivas entre el campo y tú.",
  },
];

export function AuthLayout({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto my-6 max-w-4xl overflow-hidden rounded-3xl border border-line bg-surface shadow-lifted sm:my-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* PANEL IZQUIERDO: MARCA Y CONFIANZA */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1d3a22] via-[#24492b] to-[#2c5734] p-8 text-primary-ink md:flex sm:p-10">
          {/* Glows decorativos */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-accent/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-success/20 blur-2xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight text-primary-ink">
              <span>🌾</span>
              <span>Agro<span className="text-accent">Market</span></span>
            </Link>
            <h2 className="mt-6 font-display text-2xl font-bold leading-snug text-primary-ink">
              El comercio agropecuario, directo y con total confianza.
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-primary-ink/80">
              Conectamos a productores, proveedores y compradores en toda Colombia con respaldo digital y trazabilidad real.
            </p>
          </div>

          <div className="relative z-10 my-8 space-y-3">
            {BENEFICIOS.map(({ Icono, titulo, desc }) => (
              <div
                key={titulo}
                className="flex items-start gap-3 rounded-2xl border border-primary-ink/15 bg-primary-ink/10 p-3 backdrop-blur-xs transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-ink font-bold shadow-xs">
                  <Icono className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary-ink">{titulo}</h4>
                  <p className="text-[11px] text-primary-ink/75 leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 border-t border-primary-ink/15 pt-4 text-[11px] text-primary-ink/70">
            🌱 Proyecto de Emprendimiento de Base Tecnológica · Politécnico Grancolombiano
          </div>
        </div>

        {/* PANEL DERECHO: FORMULARIO */}
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{titulo}</h1>
            <p className="mt-1.5 text-sm text-muted">{subtitulo}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

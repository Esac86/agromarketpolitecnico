import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconCattle, IconShieldCheck, IconWheat } from "@/shared/ui/icons";

const PUNTOS = [
  { Icono: IconShieldCheck, texto: "Vendedores con identidad verificada" },
  { Icono: IconCattle, texto: "Animales con trazabilidad sanitaria" },
  { Icono: IconWheat, texto: "Insumos y alimento en tu zona" },
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
    <div className="mx-auto my-8 max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface shadow-lifted sm:my-14">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* PANEL LATERAL MINIMALISTA */}
        <div className="hidden flex-col justify-between bg-primary p-8 text-primary-ink md:col-span-2 md:flex">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-semibold text-primary-ink">
              🌾 AgroMarket
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-primary-ink/80">
              Compra y venta directa entre productores y proveedores agropecuarios.
            </p>
          </div>

          <ul className="space-y-3">
            {PUNTOS.map(({ Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2.5 text-xs text-primary-ink/90 font-medium">
                <Icono className="h-4 w-4 shrink-0 text-accent" />
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FORMULARIO LIMPIO */}
        <div className="p-6 sm:p-8 md:col-span-3">
          <div className="mb-5">
            <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">{titulo}</h1>
            <p className="mt-1 text-xs text-muted">{subtitulo}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

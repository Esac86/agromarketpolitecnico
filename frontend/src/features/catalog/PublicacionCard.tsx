import { Link } from "react-router-dom";
import type { Publicacion } from "@/shared/api/types";
import { IconStar, IconLocation } from "@/shared/ui/icons";
import { CategoriaPlaceholder } from "./CategoriaPlaceholder";
import { CATEGORIA_LABEL, formatearPrecio } from "./labels";

const UNIDAD_POR_CATEGORIA: Record<string, string> = {
  animal_genetica: "unidad / lote",
  alimento_balanceado: "bulto",
  insumo_veterinario: "dosis / unidad",
};

export function PublicacionCard({ publicacion }: { publicacion: Publicacion }) {
  const portada = publicacion.imagenes[0]?.archivo;
  const esVerificado = publicacion.vendedor.estado_verificacion === "aprobado";
  const unidad = UNIDAD_POR_CATEGORIA[publicacion.categoria] || "unidad";

  return (
    <Link
      to={`/publicaciones/${publicacion.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted hover:border-primary/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
        {portada ? (
          <img
            src={portada}
            alt={publicacion.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        ) : (
          <CategoriaPlaceholder categoria={publicacion.categoria} className="h-full w-full" />
        )}

        {/* Badge flotante de vendedor verificado */}
        {esVerificado && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-success shadow-xs backdrop-blur-md">
            <span>🛡️</span>
            <span>Verificado</span>
          </div>
        )}

        {/* Badge de sanidad animal al día */}
        {publicacion.categoria === "animal_genetica" && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-medium text-primary-ink shadow-xs backdrop-blur-md">
            <span>✓ Sanidad al día</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {CATEGORIA_LABEL[publicacion.categoria]}
          </span>
          <span className="text-[11px] text-muted font-medium">
            Disp: {publicacion.cantidad_disponible}
          </span>
        </div>

        <h3 className="font-display text-base font-bold leading-snug text-ink line-clamp-2 group-hover:text-primary transition-colors">
          {publicacion.titulo}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted">
          <IconLocation className="h-3 w-3 shrink-0 text-muted/70" />
          <span className="truncate">{publicacion.ubicacion}</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-line/60 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-muted uppercase">Precio</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-lg font-bold text-ink">
                {formatearPrecio(publicacion.precio)}
              </span>
              <span className="text-[10px] text-muted font-normal">/{unidad}</span>
            </div>
          </div>

          {publicacion.vendedor.total_calificaciones > 0 ? (
            <span className="flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-ink">
              <IconStar className="h-3.5 w-3.5 fill-accent text-accent" />
              {Number(publicacion.vendedor.promedio_calificacion).toFixed(1)}
              <span className="text-[10px] text-muted">({publicacion.vendedor.total_calificaciones})</span>
            </span>
          ) : (
            <span className="text-[10px] text-muted italic">Nuevo vendedor</span>
          )}
        </div>
      </div>
    </Link>
  );
}

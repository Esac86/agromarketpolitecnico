import { useSearchParams } from "react-router-dom";
import { CATEGORIA_ICONOS, IconLocation, IconClose } from "@/shared/ui/icons";
import { usePublicaciones, type FiltrosCatalogo } from "./api";
import { CATEGORIA_LABEL } from "./labels";
import { PublicacionCard } from "./PublicacionCard";

type Categoria = keyof typeof CATEGORIA_LABEL;

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Leemos filtros reactivamente de la URL
  const categoria = (searchParams.get("categoria") as Categoria) || undefined;
  const ubicacion = searchParams.get("ubicacion") || undefined;
  const precio_min = searchParams.get("precio_min") || undefined;
  const precio_max = searchParams.get("precio_max") || undefined;

  const filtros: FiltrosCatalogo = {
    categoria,
    ubicacion,
    precio_min,
    precio_max,
  };

  const { data, isLoading } = usePublicaciones(filtros);

  function actualizar(campo: keyof FiltrosCatalogo, valor: string) {
    setSearchParams((prev) => {
      const nuevo = new URLSearchParams(prev);
      if (valor.trim()) {
        nuevo.set(campo, valor.trim());
      } else {
        nuevo.delete(campo);
      }
      return nuevo;
    });
  }

  function alternarCategoria(cat: Categoria) {
    setSearchParams((prev) => {
      const nuevo = new URLSearchParams(prev);
      if (nuevo.get("categoria") === cat) {
        nuevo.delete("categoria");
      } else {
        nuevo.set("categoria", cat);
      }
      return nuevo;
    });
  }

  function limpiarFiltros() {
    setSearchParams({});
  }

  const hayFiltrosActivos = Boolean(categoria || ubicacion || precio_min || precio_max);

  return (
    <div className="space-y-6">
      {/* HERO LIMPIO Y EQUILIBRADO */}
      <section className="-mx-4 bg-primary px-4 py-10 text-primary-ink sm:-mx-6 sm:px-6 sm:py-14 sm:rounded-3xl shadow-sm">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl text-primary-ink">
            Compra y vende directo, sin intermediarios ni desconfianza
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-ink/80 sm:text-base">
            Insumos veterinarios, alimento balanceado y animales de productores y proveedores
            verificados en todo el país.
          </p>
        </div>

        {/* BOTONES DE CATEGORÍAS (CONECTADOS A LA URL) */}
        <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5">
          {(Object.keys(CATEGORIA_LABEL) as Categoria[]).map((cat) => {
            const Icono = CATEGORIA_ICONOS[cat];
            const activa = categoria === cat;
            return (
              <button
                key={cat}
                onClick={() => alternarCategoria(cat)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  activa
                    ? "border-accent bg-accent text-accent-ink shadow-sm scale-102"
                    : "border-primary-ink/25 bg-primary-ink/10 text-primary-ink hover:bg-primary-ink/20"
                }`}
              >
                <Icono className="h-4 w-4" />
                {CATEGORIA_LABEL[cat]}
              </button>
            );
          })}
        </div>
      </section>

      {/* BARRA DE FILTROS MODERNA (TOOLBAR) */}
      <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft transition-colors">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Input Ubicación con Icono */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <IconLocation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Ubicación (ej: Casanare, Meta...)"
                value={ubicacion || ""}
                onChange={(e) => actualizar("ubicacion", e.target.value)}
                className="w-full rounded-xl border border-line bg-surface-2/40 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:bg-surface focus:outline-none"
              />
            </div>

            {/* Inputs de Rango de Precio */}
            <div className="flex items-center gap-2">
              <div className="relative w-28 sm:w-32">
                <input
                  type="number"
                  placeholder="Precio Mín."
                  value={precio_min || ""}
                  onChange={(e) => actualizar("precio_min", e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface-2/40 px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:bg-surface focus:outline-none"
                />
              </div>
              <span className="text-muted text-xs font-semibold">—</span>
              <div className="relative w-28 sm:w-32">
                <input
                  type="number"
                  placeholder="Precio Máx."
                  value={precio_max || ""}
                  onChange={(e) => actualizar("precio_max", e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface-2/40 px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:bg-surface focus:outline-none"
                />
              </div>
            </div>

            {/* Botón de limpiar filtros si hay alguno activo */}
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-1 rounded-xl bg-danger/10 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/20 transition-colors cursor-pointer"
              >
                <IconClose className="h-3.5 w-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Contador de publicaciones estilizado */}
          <div className="flex items-center justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink">
              <span className="h-2 w-2 rounded-full bg-success" />
              {isLoading
                ? "Buscando..."
                : `${data?.count ?? 0} publicación${data?.count === 1 ? "" : "es"}`}
            </span>
          </div>
        </div>
      </div>

      {/* CATÁLOGO DE PUBLICACIONES */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
              <div className="aspect-[4/3] animate-pulse bg-surface-2" />
              <div className="space-y-2.5 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
                <div className="mt-4 flex items-center justify-between pt-2">
                  <div className="h-5 w-24 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.results.length === 0 ? (
        <div className="my-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface/40 p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">No hay publicaciones con estos filtros</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Intenta ampliar el rango de precio o borrar la ubicación para ver todas las ofertas disponibles.
          </p>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-ink hover:brightness-105 cursor-pointer"
            >
              Ver todo el catálogo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.results.map((p) => (
            <PublicacionCard key={p.id} publicacion={p} />
          ))}
        </div>
      )}
    </div>
  );
}

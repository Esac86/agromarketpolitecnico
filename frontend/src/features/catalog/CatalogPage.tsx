import { useSearchParams } from "react-router-dom";
import { CATEGORIA_ICONOS, IconLocation, IconClose } from "@/shared/ui/icons";
import { usePublicaciones, type FiltrosCatalogo } from "./api";
import { CATEGORIA_LABEL, formatearPrecio } from "./labels";
import { PublicacionCard } from "./PublicacionCard";

type Categoria = keyof typeof CATEGORIA_LABEL;

// Departamentos agrícolas comunes de Colombia para autocompletar ubicación
const DEPARTAMENTOS_COLOMBIA = [
  "Antioquia",
  "Arauca",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Córdoba",
  "Cundinamarca",
  "Huila",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Quindío",
  "Risaralda",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
];

// Presets rápidos de precio
const PRESETS_PRECIO = [
  { label: "< $500 mil", min: "", max: "500000" },
  { label: "$500k - $2M", min: "500000", max: "2000000" },
  { label: "$2M - $10M", min: "2000000", max: "10000000" },
  { label: "> $10M", min: "10000000", max: "" },
];

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

  function aplicarPresetPrecio(min: string, max: string) {
    setSearchParams((prev) => {
      const nuevo = new URLSearchParams(prev);
      const curMin = nuevo.get("precio_min") || "";
      const curMax = nuevo.get("precio_max") || "";

      // Si ya está activo este preset, al hacer clic de nuevo se desactiva
      if (curMin === min && curMax === max) {
        nuevo.delete("precio_min");
        nuevo.delete("precio_max");
      } else {
        if (min) nuevo.set("precio_min", min);
        else nuevo.delete("precio_min");

        if (max) nuevo.set("precio_max", max);
        else nuevo.delete("precio_max");
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
      {/* DATALIST DE DEPARTAMENTOS */}
      <datalist id="departamentos-colombia">
        {DEPARTAMENTOS_COLOMBIA.map((dep) => (
          <option key={dep} value={dep} />
        ))}
      </datalist>

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

      {/* BARRA DE FILTROS DINÁMICA, MODERNA Y PROFESIONAL */}
      <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm transition-all space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* INPUT DE UBICACIÓN (TIPO LOCALIZACIÓN) */}
            <div className="group relative min-w-[220px] flex-1 sm:max-w-xs">
              <div className="relative flex items-center rounded-xl border border-line bg-surface-2/40 transition-colors focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/15">
                <IconLocation className="ml-3 h-4 w-4 shrink-0 text-muted transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  list="departamentos-colombia"
                  placeholder="Ubicación (ej: Casanare, Meta...)"
                  value={ubicacion || ""}
                  onChange={(e) => actualizar("ubicacion", e.target.value)}
                  className="w-full bg-transparent py-2 pl-2.5 pr-8 text-sm text-ink placeholder:text-muted/70 focus:outline-none"
                />
                {ubicacion && (
                  <button
                    type="button"
                    onClick={() => actualizar("ubicacion", "")}
                    className="absolute right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-muted hover:bg-line/60 hover:text-ink transition-colors cursor-pointer"
                    title="Borrar ubicación"
                  >
                    <IconClose className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* INPUTS DE RANGO DE PRECIO (TIPO MONEDA CON ADORNOS Y GRUPO INTEGRADO) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center rounded-xl border border-line bg-surface-2/40 p-0.5 focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                {/* PRECIO MÍNIMO */}
                <div className="relative flex items-center">
                  <span className="pl-2.5 text-xs font-bold text-muted select-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    inputMode="numeric"
                    placeholder="Precio mín."
                    value={precio_min || ""}
                    onChange={(e) => actualizar("precio_min", e.target.value)}
                    className="w-24 sm:w-28 bg-transparent py-1.5 pl-1 pr-6 text-sm text-ink placeholder:text-muted/70 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {precio_min && (
                    <button
                      type="button"
                      onClick={() => actualizar("precio_min", "")}
                      className="absolute right-1 text-muted hover:text-ink cursor-pointer"
                      title="Borrar mínimo"
                    >
                      <IconClose className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <span className="px-1 text-xs font-bold text-muted select-none">—</span>

                {/* PRECIO MÁXIMO */}
                <div className="relative flex items-center">
                  <span className="pl-1.5 text-xs font-bold text-muted select-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    inputMode="numeric"
                    placeholder="Precio máx."
                    value={precio_max || ""}
                    onChange={(e) => actualizar("precio_max", e.target.value)}
                    className="w-24 sm:w-28 bg-transparent py-1.5 pl-1 pr-6 text-sm text-ink placeholder:text-muted/70 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {precio_max && (
                    <button
                      type="button"
                      onClick={() => actualizar("precio_max", "")}
                      className="absolute right-1 text-muted hover:text-ink cursor-pointer"
                      title="Borrar máximo"
                    >
                      <IconClose className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PRESETS RÁPIDOS DE PRECIO */}
            <div className="hidden sm:flex items-center gap-1.5">
              {PRESETS_PRECIO.map((preset) => {
                const activo =
                  (precio_min || "") === preset.min && (precio_max || "") === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => aplicarPresetPrecio(preset.min, preset.max)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      activo
                        ? "border-primary bg-primary text-primary-ink shadow-2xs"
                        : "border-line bg-surface hover:bg-surface-2 text-muted hover:text-ink"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTADOR DE RESULTADOS CON DOT DINÁMICO */}
          <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-line/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2/60 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-2xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLoading ? "bg-accent animate-ping" : "bg-success"
                }`}
              />
              {isLoading
                ? "Buscando ofertas..."
                : `${data?.count ?? 0} publicación${data?.count === 1 ? "" : "es"}`}
            </span>
          </div>
        </div>

        {/* CHIPS DE FILTROS ACTIVOS ESTILO ESAC-SALUD */}
        {hayFiltrosActivos && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/50 text-xs">
            <span className="font-semibold text-muted">Filtros activos:</span>

            {categoria && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                🏷️ {CATEGORIA_LABEL[categoria]}
                <button
                  type="button"
                  onClick={() => alternarCategoria(categoria)}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                  title="Quitar filtro de categoría"
                >
                  <IconClose className="h-3 w-3" />
                </button>
              </span>
            )}

            {ubicacion && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                📍 {ubicacion}
                <button
                  type="button"
                  onClick={() => actualizar("ubicacion", "")}
                  className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                  title="Quitar filtro de ubicación"
                >
                  <IconClose className="h-3 w-3" />
                </button>
              </span>
            )}

            {(precio_min || precio_max) && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 font-medium text-accent-ink">
                💰{" "}
                {precio_min && precio_max
                  ? `${formatearPrecio(precio_min)} - ${formatearPrecio(precio_max)}`
                  : precio_min
                  ? `Desde ${formatearPrecio(precio_min)}`
                  : `Hasta ${formatearPrecio(precio_max!)}`}
                <button
                  type="button"
                  onClick={() => {
                    actualizar("precio_min", "");
                    actualizar("precio_max", "");
                  }}
                  className="rounded-full p-0.5 hover:bg-accent/25 cursor-pointer"
                  title="Quitar rango de precio"
                >
                  <IconClose className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={limpiarFiltros}
              className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <IconClose className="h-3 w-3" />
              Limpiar todo
            </button>
          </div>
        )}
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

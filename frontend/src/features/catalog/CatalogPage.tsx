import { useState } from "react";
import { CATEGORIA_ICONOS, IconSearch, IconClose } from "@/shared/ui/icons";
import { usePublicaciones, type FiltrosCatalogo } from "./api";
import { CATEGORIA_LABEL } from "./labels";
import { PublicacionCard } from "./PublicacionCard";

type Categoria = keyof typeof CATEGORIA_LABEL;

const DEPARTAMENTOS_FRECUENTES = [
  "Meta",
  "Casanare",
  "Antioquia",
  "Córdoba",
  "Cundinamarca",
  "Santander",
  "Boyacá",
  "Tolima",
  "Huila",
  "Valle del Cauca",
];

export function CatalogPage() {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({});
  const { data, isLoading } = usePublicaciones(filtros);

  function actualizar(campo: keyof FiltrosCatalogo, valor: string) {
    setFiltros((f) => ({ ...f, [campo]: valor.trim() || undefined }));
  }

  function alternarCategoria(categoria: Categoria) {
    setFiltros((f) => ({ ...f, categoria: f.categoria === categoria ? undefined : categoria }));
  }

  const hayFiltrosActivos = Object.values(filtros).some(Boolean);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HERO BANNER DE ALTO IMPACTO */}
      <section className="relative -mx-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d3822] via-[#274d2f] to-[#345e3a] px-5 py-12 text-primary-ink shadow-lifted sm:-mx-6 sm:px-10 sm:py-16">
        {/* Glow decorativo de fondo */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-success/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Trust Badges superiores */}
          <div className="mb-4 inline-flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-ink/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              🛡️ Verificación Oficial de Identidad
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 px-3 py-1 text-xs font-semibold text-accent-ink backdrop-blur-md">
              🐄 Trazabilidad Sanitaria Garantizada
            </span>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight sm:leading-tight">
            Compra y vende directo, <br className="hidden sm:inline" />
            <span className="text-accent underline decoration-accent/40 decoration-wavy underline-offset-4">sin intermediarios</span> ni desconfianza
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-primary-ink/85 font-normal">
            El primer marketplace verificado para el sector agropecuario y ganadero en Colombia. Ganado de genética, alimentos balanceados e insumos veterinarios directos de finca.
          </p>

          {/* BARRA DE BÚSQUEDA INTEGRADA FLOTANTE */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-surface p-2.5 text-ink shadow-lifted">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Ubicación (ej: Casanare, Meta, Yopal...)"
                  value={filtros.ubicacion || ""}
                  onChange={(e) => actualizar("ubicacion", e.target.value)}
                  className="w-full rounded-xl bg-surface-2/60 py-2.5 pl-9 pr-3 text-sm font-medium text-ink placeholder:text-muted/70 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Precio Mín."
                  value={filtros.precio_min || ""}
                  onChange={(e) => actualizar("precio_min", e.target.value)}
                  className="w-28 rounded-xl bg-surface-2/60 px-3 py-2.5 text-sm font-medium text-ink placeholder:text-muted/70 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Precio Máx."
                  value={filtros.precio_max || ""}
                  onChange={(e) => actualizar("precio_max", e.target.value)}
                  className="w-28 rounded-xl bg-surface-2/60 px-3 py-2.5 text-sm font-medium text-ink placeholder:text-muted/70 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {hayFiltrosActivos && (
                <button
                  onClick={() => setFiltros({})}
                  className="flex items-center justify-center gap-1 rounded-xl bg-danger/10 px-3 py-2.5 text-xs font-semibold text-danger hover:bg-danger/20 transition-colors"
                  title="Limpiar filtros"
                >
                  <IconClose className="h-3.5 w-3.5" />
                  Limpiar
                </button>
              )}
            </div>

            {/* Sugerencias rápidas de ubicación */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto px-1 py-1 text-xs scrollbar-none">
              <span className="text-muted shrink-0 text-[11px] font-medium">Departamentos:</span>
              {DEPARTAMENTOS_FRECUENTES.slice(0, 5).map((dep) => (
                <button
                  key={dep}
                  onClick={() => actualizar("ubicacion", dep)}
                  className={`shrink-0 rounded-lg px-2 py-0.5 transition-colors ${
                    filtros.ubicacion === dep
                      ? "bg-primary text-primary-ink font-semibold"
                      : "bg-surface-2 text-muted hover:text-ink hover:bg-surface-2/90"
                  }`}
                >
                  {dep}
                </button>
              ))}
            </div>
          </div>

          {/* BOTONES DE CATEGORÍA INTERACTIVOS */}
          <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5">
            {(Object.keys(CATEGORIA_LABEL) as Categoria[]).map((categoria) => {
              const Icono = CATEGORIA_ICONOS[categoria];
              const activa = filtros.categoria === categoria;
              return (
                <button
                  key={categoria}
                  onClick={() => alternarCategoria(categoria)}
                  className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    activa
                      ? "bg-accent text-accent-ink shadow-md scale-105 ring-2 ring-accent-ink/20"
                      : "border border-primary-ink/30 bg-primary-ink/10 text-primary-ink hover:bg-primary-ink/20 hover:scale-102"
                  }`}
                >
                  <Icono className="h-4 w-4" />
                  {CATEGORIA_LABEL[categoria]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CABECERA DE RESULTADOS */}
      <div className="flex items-center justify-between border-b border-line/70 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Catálogo de Publicaciones</h2>
          <p className="text-xs text-muted">
            {isLoading
              ? "Cargando ofertas del campo..."
              : `${data?.count ?? 0} producto${data?.count === 1 ? "" : "s"} disponible${data?.count === 1 ? "" : "s"}`}
          </p>
        </div>

        {hayFiltrosActivos && (
          <button
            onClick={() => setFiltros({})}
            className="text-xs font-semibold text-primary underline underline-offset-4 hover:opacity-80"
          >
            Mostrar todas las publicaciones
          </button>
        )}
      </div>

      {/* GRILLA DE PRODUCTOS O LOADING / EMPTY STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
              <div className="aspect-[4/3] animate-pulse bg-surface-2" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
                <div className="mt-4 flex items-center justify-between pt-2">
                  <div className="h-6 w-24 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-12 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.results.length === 0 ? (
        <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent text-2xl font-bold">
            🌾
          </div>
          <p className="font-display text-xl font-bold text-ink">No se encontraron ofertas activas</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            No encontramos publicaciones con los filtros aplicados. Intenta quitar la ubicación o el rango de precio para ver todas las ofertas.
          </p>
          {hayFiltrosActivos && (
            <button
              onClick={() => setFiltros({})}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-ink shadow-soft hover:brightness-105"
            >
              Restablecer filtros del catálogo
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

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIA_ICONOS, IconChevronDown, IconClose, IconLocation } from "@/shared/ui/icons";
import { usePublicaciones, type FiltrosCatalogo } from "./api";
import { CATEGORIA_LABEL, formatearPrecio } from "./labels";
import { PublicacionCard } from "./PublicacionCard";

type Categoria = keyof typeof CATEGORIA_LABEL;

interface DepartamentoInfo {
  nombre: string;
  region: string;
}

// Departamentos agropecuarios de Colombia con información contextual
const DEPARTAMENTOS_DETALLADOS: DepartamentoInfo[] = [
  { nombre: "Casanare", region: "Llanos Orientales · Ganadería y arroz" },
  { nombre: "Meta", region: "Llanos Orientales · Ganadería extensiva" },
  { nombre: "Antioquia", region: "Región Andina · Lechería y porcicultura" },
  { nombre: "Cundinamarca", region: "Sabana y Centro · Insumos y balanceados" },
  { nombre: "Córdoba", region: "Costa Caribe · Cría y ceba de ganado" },
  { nombre: "Santander", region: "Oriente · Avicultura y caprinos" },
  { nombre: "Boyacá", region: "Altiplano · Alimento, papa y lácteos" },
  { nombre: "Tolima", region: "Valle del Magdalena · Arroz y forrajes" },
  { nombre: "Huila", region: "Sur Andino · Café y piscicultura" },
  { nombre: "Valle del Cauca", region: "Suroccidente · Agroindustria y caña" },
  { nombre: "Cesar", region: "Costa Caribe · Doble propósito" },
  { nombre: "Caquetá", region: "Piedemonte Amazónico · Queso y carne" },
  { nombre: "Arauca", region: "Llanos · Ganado de carne" },
  { nombre: "Nariño", region: "Suroccidente · Lechería especializada" },
  { nombre: "Caldas", region: "Eje Cafetero · Frutales y café" },
  { nombre: "Risaralda", region: "Eje Cafetero · Avicultura e insumos" },
  { nombre: "Quindío", region: "Eje Cafetero · Porcicultura y café" },
  { nombre: "Norte de Santander", region: "Oriente · Bovinos e insumos" },
  { nombre: "Magdalena", region: "Caribe · Ganadería y palma" },
  { nombre: "Sucre", region: "Sabanas de Sucre · Ganadería cebuina" },
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

  // Estados locales para popovers personalizados (NO nativos)
  const [ubicacionMenuAbierto, setUbicacionMenuAbierto] = useState(false);
  const [precioMenuAbierto, setPrecioMenuAbierto] = useState(false);
  const [tempMin, setTempMin] = useState(precio_min || "");
  const [tempMax, setTempMax] = useState(precio_max || "");

  const ubicacionRef = useRef<HTMLDivElement>(null);
  const precioRef = useRef<HTMLDivElement>(null);

  // Cerrar popovers al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ubicacionRef.current && !ubicacionRef.current.contains(event.target as Node)) {
        setUbicacionMenuAbierto(false);
      }
      if (precioRef.current && !precioRef.current.contains(event.target as Node)) {
        setPrecioMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sincronizar inputs temporales de precio cuando cambia la URL
  useEffect(() => {
    setTempMin(precio_min || "");
    setTempMax(precio_max || "");
  }, [precio_min, precio_max]);

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
    setPrecioMenuAbierto(false);
  }

  function aplicarRangoPrecioManual() {
    setSearchParams((prev) => {
      const nuevo = new URLSearchParams(prev);
      if (tempMin.trim()) nuevo.set("precio_min", tempMin.trim());
      else nuevo.delete("precio_min");

      if (tempMax.trim()) nuevo.set("precio_max", tempMax.trim());
      else nuevo.delete("precio_max");
      return nuevo;
    });
    setPrecioMenuAbierto(false);
  }

  function limpiarRangoPrecio() {
    setTempMin("");
    setTempMax("");
    setSearchParams((prev) => {
      const nuevo = new URLSearchParams(prev);
      nuevo.delete("precio_min");
      nuevo.delete("precio_max");
      return nuevo;
    });
    setPrecioMenuAbierto(false);
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
    setTempMin("");
    setTempMax("");
  }

  const hayFiltrosActivos = Boolean(categoria || ubicacion || precio_min || precio_max);

  // Filtrar sugerencias de departamentos en base al texto escrito
  const departamentosFiltrados = DEPARTAMENTOS_DETALLADOS.filter((d) => {
    if (!ubicacion) return true;
    return (
      d.nombre.toLowerCase().includes(ubicacion.toLowerCase()) ||
      d.region.toLowerCase().includes(ubicacion.toLowerCase())
    );
  });

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

      {/* BARRA DE FILTROS TOTALMENTE PERSONALIZADA Y PROFESIONAL */}
      <div className="rounded-2xl border border-line bg-surface p-3.5 sm:p-4 shadow-sm transition-all space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* 1. INPUT DE UBICACIÓN CON AUTOCOMPLETADO PERSONALIZADO (NO NATIVO) */}
            <div ref={ubicacionRef} className="relative min-w-[220px] flex-1 sm:max-w-xs">
              <div
                className={`relative flex items-center rounded-xl border bg-surface-2/40 transition-all ${
                  ubicacionMenuAbierto
                    ? "border-primary bg-surface ring-2 ring-primary/20 shadow-sm"
                    : "border-line hover:border-line-hover hover:bg-surface-2/60"
                }`}
              >
                <IconLocation
                  className={`ml-3 h-4 w-4 shrink-0 transition-colors ${
                    ubicacion ? "text-primary" : "text-muted"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Ubicación (ej: Casanare, Meta...)"
                  value={ubicacion || ""}
                  onFocus={() => setUbicacionMenuAbierto(true)}
                  onChange={(e) => {
                    actualizar("ubicacion", e.target.value);
                    if (!ubicacionMenuAbierto) setUbicacionMenuAbierto(true);
                  }}
                  className="w-full bg-transparent py-2 pl-2.5 pr-8 text-sm text-ink placeholder:text-muted/70 focus:outline-none"
                />
                {ubicacion && (
                  <button
                    type="button"
                    onClick={() => {
                      actualizar("ubicacion", "");
                      setUbicacionMenuAbierto(false);
                    }}
                    className="absolute right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-muted hover:bg-line/60 hover:text-ink transition-colors cursor-pointer"
                    title="Borrar ubicación"
                  >
                    <IconClose className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* POPUP FLOTANTE DE SUGERENCIAS GEOGRÁFICAS */}
              {ubicacionMenuAbierto && (
                <div className="absolute top-full left-0 z-50 mt-1.5 w-full sm:w-80 rounded-2xl border border-line bg-surface/98 backdrop-blur-md p-1.5 shadow-lifted animate-in fade-in slide-in-from-top-1">
                  <div className="px-2.5 py-1.5 border-b border-line/60 flex items-center justify-between text-[11px] font-semibold text-muted">
                    <span>📍 Regiones y departamentos</span>
                    <span>{departamentosFiltrados.length} disponibles</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                    {departamentosFiltrados.length === 0 ? (
                      <div className="px-3 py-4 text-center text-xs text-muted">
                        No se encontró "{ubicacion}". Presiona Enter para buscar por este texto libre.
                      </div>
                    ) : (
                      departamentosFiltrados.map((dep) => (
                        <button
                          key={dep.nombre}
                          type="button"
                          onClick={() => {
                            actualizar("ubicacion", dep.nombre);
                            setUbicacionMenuAbierto(false);
                          }}
                          className={`w-full flex flex-col text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            ubicacion?.toLowerCase() === dep.nombre.toLowerCase()
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-surface-2 text-ink"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{dep.nombre}</span>
                            {ubicacion?.toLowerCase() === dep.nombre.toLowerCase() && (
                              <span className="text-[10px] text-primary">Seleccionado</span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted opacity-80">{dep.region}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. POPOVER DINÁMICO DE RANGO DE PRECIO ($ COP) */}
            <div ref={precioRef} className="relative">
              <button
                type="button"
                onClick={() => setPrecioMenuAbierto(!precioMenuAbierto)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                  precio_min || precio_max
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/15"
                    : "border-line bg-surface-2/40 hover:bg-surface-2 hover:border-line-hover text-ink"
                }`}
              >
                <span className="text-muted font-bold text-xs">$</span>
                <span className="text-xs sm:text-sm">
                  {precio_min && precio_max
                    ? `${formatearPrecio(precio_min)} — ${formatearPrecio(precio_max)}`
                    : precio_min
                    ? `Desde ${formatearPrecio(precio_min)}`
                    : precio_max
                    ? `Hasta ${formatearPrecio(precio_max)}`
                    : "Rango de precio"}
                </span>
                <IconChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
              </button>

              {/* MODAL / TARJETA FLOTANTE DE SELECCIÓN DE PRECIO */}
              {precioMenuAbierto && (
                <div className="absolute top-full left-0 z-50 mt-1.5 w-80 sm:w-88 rounded-2xl border border-line bg-surface/98 backdrop-blur-md p-4 shadow-lifted animate-in fade-in slide-in-from-top-1 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-line/60 pb-2">
                    <span className="font-display text-xs font-bold text-ink">
                      Rango de precio ($ COP)
                    </span>
                    {(tempMin || tempMax) && (
                      <button
                        type="button"
                        onClick={limpiarRangoPrecio}
                        className="text-[11px] font-semibold text-danger hover:underline cursor-pointer"
                      >
                        Restablecer
                      </button>
                    )}
                  </div>

                  {/* CAMPOS NUMÉRICOS DE MONEDA CON PREFIJO */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted mb-1">
                        Precio mínimo
                      </label>
                      <div className="flex items-center rounded-xl border border-line bg-surface-2/50 px-2.5 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <span className="text-xs font-bold text-muted mr-1.5">$</span>
                        <input
                          type="number"
                          min="0"
                          step="50000"
                          placeholder="0"
                          value={tempMin}
                          onChange={(e) => setTempMin(e.target.value)}
                          className="w-full bg-transparent text-xs font-semibold text-ink placeholder:text-muted/60 focus:outline-none"
                        />
                      </div>
                      {tempMin && (
                        <p className="mt-0.5 text-[10px] text-muted truncate">
                          {formatearPrecio(tempMin)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-muted mb-1">
                        Precio máximo
                      </label>
                      <div className="flex items-center rounded-xl border border-line bg-surface-2/50 px-2.5 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <span className="text-xs font-bold text-muted mr-1.5">$</span>
                        <input
                          type="number"
                          min="0"
                          step="50000"
                          placeholder="Sin límite"
                          value={tempMax}
                          onChange={(e) => setTempMax(e.target.value)}
                          className="w-full bg-transparent text-xs font-semibold text-ink placeholder:text-muted/60 focus:outline-none"
                        />
                      </div>
                      {tempMax && (
                        <p className="mt-0.5 text-[10px] text-muted truncate">
                          {formatearPrecio(tempMax)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PRESETS RÁPIDOS */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      Rangos sugeridos
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRESETS_PRECIO.map((preset) => {
                        const activo = tempMin === preset.min && tempMax === preset.max;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setTempMin(preset.min);
                              setTempMax(preset.max);
                            }}
                            className={`rounded-xl border py-1.5 px-2 text-xs font-medium text-center transition-all cursor-pointer ${
                              activo
                                ? "border-primary bg-primary text-primary-ink font-semibold shadow-2xs"
                                : "border-line bg-surface-2/40 hover:bg-surface-2 text-muted hover:text-ink"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* BOTÓN DE APLICAR */}
                  <div className="flex items-center gap-2 pt-2 border-t border-line/60">
                    <button
                      type="button"
                      onClick={() => setPrecioMenuAbierto(false)}
                      className="flex-1 rounded-xl border border-line py-1.5 text-xs font-semibold text-muted hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={aplicarRangoPrecioManual}
                      className="flex-1 rounded-xl bg-primary py-1.5 text-xs font-semibold text-primary-ink hover:brightness-105 transition-all shadow-2xs cursor-pointer"
                    >
                      Aplicar rango
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PRESETS RÁPIDOS EN TOOLBAR (DESKTOP) */}
            <div className="hidden sm:flex items-center gap-1.5">
              {PRESETS_PRECIO.map((preset) => {
                const activo =
                  (precio_min || "") === preset.min && (precio_max || "") === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => aplicarPresetPrecio(preset.min, preset.max)}
                    className={`rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      activo
                        ? "border-primary bg-primary text-primary-ink shadow-2xs font-semibold"
                        : "border-line bg-surface hover:bg-surface-2 text-muted hover:text-ink"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTADOR DE RESULTADOS CON STATUS INDICATOR */}
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
                  onClick={limpiarRangoPrecio}
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { IconCheck, IconClose, IconLocation, IconPackage, IconSearch } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { tiempoRelativo } from "@/shared/lib/tiempoRelativo";
import { CategoriaPlaceholder } from "@/features/catalog/CategoriaPlaceholder";
import { CATEGORIA_LABEL } from "@/features/catalog/labels";
import {
  useAprobarPublicacion,
  usePublicacionesModeracion,
  useRechazarPublicacion,
  useSuspenderPublicacion,
} from "./api";

const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

type Accion = "rechazar" | "suspender";

const ESTADOS_MODERACION = [
  { id: "pendiente", label: "Pendientes", badgeColor: "bg-warning/15 text-warning border-warning/30" },
  { id: "aprobada", label: "Aprobadas", badgeColor: "bg-success/15 text-success border-success/30" },
  { id: "rechazada", label: "Rechazadas", badgeColor: "bg-danger/15 text-danger border-danger/30" },
  { id: "suspendida", label: "Suspendidas", badgeColor: "bg-surface-2 text-muted border-line" },
] as const;

const MOTIVOS_SUGERIDOS = [
  "Falta registro ICA o certificado sanitario requerido",
  "Precio inconsistente o información engañosa",
  "Imágenes de baja calidad o que no corresponden",
  "Producto o servicio no permitido en el catálogo",
];

export function PublicacionesTab() {
  const [estado, setEstado] = useState<string>("pendiente");
  const [busqueda, setBusqueda] = useState("");
  const { data, isLoading } = usePublicacionesModeracion(estado);
  const aprobar = useAprobarPublicacion();
  const rechazar = useRechazarPublicacion();
  const suspender = useSuspenderPublicacion();
  const { notificar } = useToast();
  const [pendiente, setPendiente] = useState<{ id: number; accion: Accion; titulo: string } | null>(
    null,
  );
  const [motivo, setMotivo] = useState("");

  function confirmarAccion() {
    if (!pendiente) return;
    const mutation = pendiente.accion === "rechazar" ? rechazar : suspender;
    mutation.mutate(
      { id: pendiente.id, motivo: motivo.trim() || undefined },
      {
        onSuccess: () => {
          notificar(
            pendiente.accion === "rechazar"
              ? `Publicación "${pendiente.titulo}" rechazada.`
              : `Publicación "${pendiente.titulo}" suspendida.`,
          );
        },
      },
    );
    setPendiente(null);
    setMotivo("");
  }

  const items = (data?.results ?? []).filter((p) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      p.titulo.toLowerCase().includes(q) ||
      p.vendedor.nombre_completo.toLowerCase().includes(q) ||
      (p.ubicacion && p.ubicacion.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* BARRA DE FILTROS POR ESTADO + BÚSQUEDA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* PESTAÑAS DE ESTADO TIPO PÍLDORA */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-surface p-1 shadow-2xs">
          {ESTADOS_MODERACION.map((est) => {
            const activo = estado === est.id;
            return (
              <button
                key={est.id}
                type="button"
                onClick={() => setEstado(est.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activo
                    ? "bg-primary text-primary-ink shadow-2xs"
                    : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {est.label}
              </button>
            );
          })}
        </div>

        {/* BUSCADOR DENTRO DE LA LISTA */}
        <div className="relative min-w-[220px]">
          <IconSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por título o vendedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* RESULTADOS O ESTADOS DE CARGA */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-line bg-surface p-4">
              <div className="flex gap-4">
                <div className="h-18 w-24 rounded-xl bg-surface-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-surface-2" />
                  <div className="h-3 w-32 rounded bg-surface-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="my-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface/50 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted">
            <IconPackage className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-ink">
            No hay publicaciones en este estado
          </h3>
          <p className="mt-1 text-xs text-muted">
            {busqueda ? "Prueba con otro término de búsqueda." : `No se encontraron ofertas en estado "${estado}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="px-1 text-xs font-semibold text-muted">
            Mostrando <span className="text-ink">{items.length}</span> publicación(es)
          </p>

          {items.map((p) => (
            <Card
              key={p.id}
              className="group rounded-2xl transition-all hover:border-primary/40 hover:shadow-soft"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* THUMBNAIL CON BADGE DE CATEGORÍA */}
                <div className="relative h-20 w-24 sm:w-28 flex-none overflow-hidden rounded-xl border border-line bg-surface-2 shadow-2xs">
                  {p.imagenes[0] ? (
                    <img
                      src={p.imagenes[0].archivo}
                      alt={p.titulo}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <CategoriaPlaceholder categoria={p.categoria} className="h-full w-full" />
                  )}
                </div>

                {/* DETALLES DE LA PUBLICACIÓN */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <Link
                      to={`/publicaciones/${p.id}`}
                      className="font-display text-base font-bold text-ink hover:text-primary transition-colors"
                    >
                      {p.titulo}
                    </Link>
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-display text-xs font-bold text-accent-ink border border-accent/25">
                      {formatoPrecio.format(Number(p.precio))}
                    </span>
                  </div>

                  <p className="text-xs text-muted">
                    <span className="font-semibold text-ink">{CATEGORIA_LABEL[p.categoria]}</span>
                    {" · Vendedor: "}
                    <Link
                      to={`/usuarios/${p.vendedor.id}`}
                      className="font-semibold text-ink hover:text-primary underline underline-offset-2"
                    >
                      {p.vendedor.nombre_completo}
                    </Link>
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    {p.ubicacion && (
                      <span className="flex items-center gap-1">
                        <IconLocation className="h-3.5 w-3.5" />
                        {p.ubicacion}
                      </span>
                    )}
                    <span>Publicado {tiempoRelativo(p.creado_en)}</span>
                  </div>

                  {p.motivo_moderacion && (
                    <div className="mt-1.5 rounded-lg border border-danger/30 bg-danger/10 p-2 text-xs text-danger">
                      <strong>Motivo de moderación registrado:</strong> {p.motivo_moderacion}
                    </div>
                  )}
                </div>

                {/* ACCIONES DE MODERACIÓN */}
                <div className="flex flex-none items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/60">
                  {estado !== "aprobada" && (
                    <Button
                      className="inline-flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-2xs"
                      disabled={aprobar.isPending}
                      onClick={() =>
                        aprobar.mutate(
                          { id: p.id },
                          { onSuccess: () => notificar(`Publicación "${p.titulo}" aprobada.`) },
                        )
                      }
                    >
                      <IconCheck className="h-3.5 w-3.5" />
                      Aprobar
                    </Button>
                  )}

                  {estado !== "rechazada" && (
                    <Button
                      variante="danger"
                      className="inline-flex items-center gap-1.5 text-xs py-2 px-3 shadow-2xs"
                      onClick={() => setPendiente({ id: p.id, accion: "rechazar", titulo: p.titulo })}
                    >
                      <IconClose className="h-3.5 w-3.5" />
                      Rechazar
                    </Button>
                  )}

                  {estado === "aprobada" && (
                    <Button
                      variante="ghost"
                      className="text-xs py-2 px-3 text-warning border-warning/40 hover:bg-warning/10"
                      onClick={() => setPendiente({ id: p.id, accion: "suspender", titulo: p.titulo })}
                    >
                      Suspender
                    </Button>
                  )}
                </div>
              </div>

              {/* DRAWER / CAJA DE MOTIVO DE RECHAZO O SUSPENSIÓN */}
              {pendiente?.id === p.id && (
                <div className="mt-4 rounded-xl border border-danger/25 bg-danger/5 p-3.5 space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-danger">
                      Motivo de {pendiente.accion} para: <span className="text-ink">"{pendiente.titulo}"</span>
                    </label>
                    <span className="text-[10px] text-muted">Se notificará al vendedor</span>
                  </div>

                  {/* PRESETS RÁPIDOS DE MOTIVOS */}
                  <div className="flex flex-wrap gap-1.5">
                    {MOTIVOS_SUGERIDOS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setMotivo(sug)}
                        className="rounded-full border border-danger/20 bg-surface px-2.5 py-0.5 text-[11px] font-medium text-ink hover:bg-danger/10 hover:border-danger/40 transition-colors cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>

                  <textarea
                    autoFocus
                    className="w-full rounded-lg border border-line bg-surface p-2 text-xs text-ink outline-none focus:border-danger focus:ring-1 focus:ring-danger/20"
                    rows={2}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Escribe o selecciona un motivo sugerido..."
                  />

                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variante="ghost"
                      className="text-xs py-1.5"
                      onClick={() => {
                        setPendiente(null);
                        setMotivo("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variante="danger"
                      className="text-xs py-1.5 px-3"
                      disabled={rechazar.isPending || suspender.isPending}
                      onClick={confirmarAccion}
                    >
                      Confirmar {pendiente.accion === "rechazar" ? "Rechazo" : "Suspensión"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

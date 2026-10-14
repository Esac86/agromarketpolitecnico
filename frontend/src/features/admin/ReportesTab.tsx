import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { IconCheck, IconFlag, IconSearch } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { tiempoRelativo } from "@/shared/lib/tiempoRelativo";
import { useReportes, useResolverReporte } from "./api";

const ESTADO_TONO = {
  sin_revisar: "danger",
  en_revision: "warning",
  resuelto: "success",
} as const;

const ESTADO_LABEL = {
  sin_revisar: "Sin revisar",
  en_revision: "En revisión",
  resuelto: "Resuelto",
} as const;

export function ReportesTab() {
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const { data, isLoading } = useReportes();
  const resolver = useResolverReporte();
  const { notificar } = useToast();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-line bg-surface p-4">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-surface-2" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-surface-2" />
                <div className="h-3 w-64 rounded bg-surface-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const reportes = data?.results ?? [];

  const filtrados = reportes.filter((r) => {
    if (filtroEstado !== "todos" && r.estado !== filtroEstado) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      const matchMotivo = r.motivo.toLowerCase().includes(q);
      const matchDesc = r.descripcion?.toLowerCase().includes(q);
      const matchReporta = r.usuario_reporta_nombre.toLowerCase().includes(q);
      const matchPub = r.publicacion_reportada_titulo?.toLowerCase().includes(q);
      const matchUser = r.usuario_reportado_nombre?.toLowerCase().includes(q);
      return matchMotivo || matchDesc || matchReporta || matchPub || matchUser;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* FILTROS POR ESTADO + BÚSQUEDA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-surface p-1 shadow-2xs">
          {[
            { id: "todos", label: "Todos" },
            { id: "sin_revisar", label: "Sin revisar" },
            { id: "en_revision", label: "En revisión" },
            { id: "resuelto", label: "Resueltos" },
          ].map((f) => {
            const activo = filtroEstado === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltroEstado(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activo
                    ? "bg-primary text-primary-ink shadow-2xs"
                    : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <IconSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por motivo o usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="my-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface/50 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
            <IconFlag className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-ink">
            No hay reportes en esta sección
          </h3>
          <p className="mt-1 text-xs text-muted">
            {busqueda ? "No se encontraron coincidencias con tu búsqueda." : "No hay incidentes pendientes de moderación."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="px-1 text-xs font-semibold text-muted">
            Mostrando <span className="text-ink">{filtrados.length}</span> reporte(s)
          </p>

          {filtrados.map((r) => (
            <Card
              key={r.id}
              className="group rounded-2xl transition-all hover:border-primary/40 hover:shadow-soft"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3.5 min-w-0">
                  <span
                    className={`mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl shadow-2xs ${
                      r.estado === "resuelto"
                        ? "bg-success/15 text-success border border-success/25"
                        : "bg-danger/15 text-danger border border-danger/25"
                    }`}
                  >
                    <IconFlag className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-sm font-bold text-ink">{r.motivo}</p>
                      <Badge tono={ESTADO_TONO[r.estado]}>{ESTADO_LABEL[r.estado]}</Badge>
                    </div>

                    {r.descripcion && (
                      <p className="rounded-xl border border-line/70 bg-surface-2/40 p-2.5 text-xs text-ink/90 leading-relaxed">
                        "{r.descripcion}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted pt-0.5">
                      <span>
                        Reportado por: <strong className="text-ink">{r.usuario_reporta_nombre}</strong>
                      </span>
                      <span>·</span>
                      <span>{tiempoRelativo(r.creado_en)}</span>
                    </div>

                    <div className="pt-1">
                      {r.publicacion_reportada ? (
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2/60 px-2.5 py-1 text-xs">
                          <span className="font-semibold text-muted">Publicación reportada:</span>
                          <Link
                            to={`/publicaciones/${r.publicacion_reportada}`}
                            className="font-bold text-primary hover:underline"
                          >
                            {r.publicacion_reportada_titulo || `#${r.publicacion_reportada}`}
                          </Link>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2/60 px-2.5 py-1 text-xs">
                          <span className="font-semibold text-muted">Usuario reportado:</span>
                          <Link
                            to={`/usuarios/${r.usuario_reportado}`}
                            className="font-bold text-primary hover:underline"
                          >
                            {r.usuario_reportado_nombre || `#${r.usuario_reportado}`}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-none items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/60">
                  {r.estado !== "resuelto" && (
                    <Button
                      className="inline-flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-2xs"
                      disabled={resolver.isPending}
                      onClick={() =>
                        resolver.mutate(r.id, {
                          onSuccess: () => notificar("Reporte marcado como resuelto con éxito."),
                        })
                      }
                    >
                      <IconCheck className="h-3.5 w-3.5" />
                      Marcar Resuelto
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Lightbox } from "@/shared/ui/Lightbox";
import { IconCheck, IconClose, IconLocation, IconShieldCheck, IconUser } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { tiempoRelativo } from "@/shared/lib/tiempoRelativo";
import { TIPO_DOCUMENTO_LABEL } from "@/features/profile/labels";
import { useAprobarVerificacion, useRechazarVerificacion, useVerificacionesPendientes } from "./api";

export function VerificacionesTab() {
  const { data, isLoading } = useVerificacionesPendientes();
  const aprobar = useAprobarVerificacion();
  const rechazar = useRechazarVerificacion();
  const { notificar } = useToast();
  const [documentoAmpliado, setDocumentoAmpliado] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-line bg-surface p-5">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-xl bg-surface-2" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-surface-2" />
                <div className="h-3 w-64 rounded bg-surface-2" />
                <div className="h-3 w-48 rounded bg-surface-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="my-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface/50 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
          <IconShieldCheck className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-base font-bold text-ink">
          ¡Bandeja de verificaciones al día!
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted">
          No hay usuarios esperando validación de documento de identidad en este momento.
        </p>
      </div>
    );
  }

  const esImagen = (url: string) => /\.(png|jpe?g|webp|gif)$/i.test(url);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-muted">
          Mostrando <span className="text-ink">{data.results.length}</span> solicitud(es) pendiente(s)
        </p>
      </div>

      {data.results.map((u) => (
        <Card
          key={u.id}
          className="group transition-all hover:border-primary/40 hover:shadow-soft rounded-2xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* VISTA PREVIA DEL DOCUMENTO ADJUNTO */}
            <div className="flex-none">
              {u.documento_identidad_archivo ? (
                esImagen(u.documento_identidad_archivo) ? (
                  <button
                    type="button"
                    onClick={() => setDocumentoAmpliado(u.documento_identidad_archivo)}
                    className="relative flex h-20 w-24 overflow-hidden rounded-xl border border-line bg-surface-2 shadow-2xs hover:border-primary transition-all cursor-pointer group/thumb"
                    title="Clic para ampliar documento"
                  >
                    <img
                      src={u.documento_identidad_archivo}
                      alt="Documento de identidad"
                      className="h-full w-full object-cover transition-transform group-hover/thumb:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white text-[10px] font-bold">
                      Ampliar
                    </div>
                  </button>
                ) : (
                  <a
                    href={u.documento_identidad_archivo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-20 w-24 flex-col items-center justify-center rounded-xl border border-line bg-surface-2 text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors"
                    title="Abrir PDF en pestaña nueva"
                  >
                    <span className="text-lg">📄</span>
                    <span>Ver PDF</span>
                  </a>
                )
              ) : (
                <div className="flex h-20 w-24 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface-2 text-[11px] text-muted">
                  <IconUser className="h-5 w-5 opacity-40 mb-1" />
                  Sin archivo
                </div>
              )}
            </div>

            {/* DETALLES DEL USUARIO Y METADATOS */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/usuarios/${u.id}`}
                  className="font-display text-base font-bold text-ink hover:text-primary transition-colors"
                >
                  {u.nombre_completo}
                </Link>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-muted border border-line/60">
                  {u.email}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="font-semibold text-ink">
                  {TIPO_DOCUMENTO_LABEL[u.tipo_documento] ?? u.tipo_documento}: {u.numero_documento}
                </span>
                {u.telefono && (
                  <span className="inline-flex items-center gap-1">
                    📞 {u.telefono}
                  </span>
                )}
                {u.ubicacion && (
                  <span className="inline-flex items-center gap-1">
                    <IconLocation className="h-3.5 w-3.5" />
                    {u.ubicacion}
                  </span>
                )}
              </div>

              {u.fecha_solicitud_verificacion && (
                <p className="text-[11px] text-muted/80">
                  Enviado {tiempoRelativo(u.fecha_solicitud_verificacion)}
                </p>
              )}
            </div>

            {/* BOTONES DE DECISIÓN DE VERIFICACIÓN */}
            <div className="flex flex-none items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/60">
              <Button
                className="inline-flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-2xs"
                disabled={aprobar.isPending || rechazar.isPending}
                onClick={() =>
                  aprobar.mutate(u.id, {
                    onSuccess: () => notificar(`✅ ${u.nombre_completo} fue verificado con éxito.`),
                  })
                }
              >
                <IconCheck className="h-3.5 w-3.5" />
                {aprobar.isPending ? "Aprobando..." : "Aprobar"}
              </Button>

              <Button
                variante="danger"
                className="inline-flex items-center gap-1.5 text-xs py-2 px-3 shadow-2xs"
                disabled={aprobar.isPending || rechazar.isPending}
                onClick={() =>
                  rechazar.mutate(u.id, {
                    onSuccess: () => notificar(`Verificación de ${u.nombre_completo} rechazada.`),
                  })
                }
              >
                <IconClose className="h-3.5 w-3.5" />
                Rechazar
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {documentoAmpliado && (
        <Lightbox
          src={documentoAmpliado}
          alt="Documento de identidad"
          onClose={() => setDocumentoAmpliado(null)}
        />
      )}
    </div>
  );
}

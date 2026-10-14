import { useState } from "react";
import { IconFlag, IconPackage, IconShieldCheck } from "@/shared/ui/icons";
import { PublicacionesTab } from "./PublicacionesTab";
import { ReportesTab } from "./ReportesTab";
import { VerificacionesTab } from "./VerificacionesTab";
import { usePublicacionesModeracion, useReportes, useVerificacionesPendientes } from "./api";

const TABS = [
  { id: "verificaciones", label: "Verificaciones de Identidad", Icono: IconShieldCheck },
  { id: "publicaciones", label: "Moderación de Publicaciones", Icono: IconPackage },
  { id: "reportes", label: "Reportes de Seguridad", Icono: IconFlag },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * Los conteos reutilizan las mismas queries que ya corre cada pestaña (misma
 * queryKey → TanStack Query las deduplica), así que mostrarlos aquí no
 * duplica peticiones al backend.
 */
function useConteos() {
  const verificaciones = useVerificacionesPendientes();
  const publicaciones = usePublicacionesModeracion("pendiente");
  const reportes = useReportes();

  return {
    verificaciones: verificaciones.data?.count ?? 0,
    publicaciones: publicaciones.data?.count ?? 0,
    reportes: reportes.data?.results.filter((r) => r.estado !== "resuelto").length ?? 0,
    isLoading: verificaciones.isLoading || publicaciones.isLoading || reportes.isLoading,
  };
}

export function AdminPage() {
  const [tab, setTab] = useState<TabId>("verificaciones");
  const conteos = useConteos();

  return (
    <div className="space-y-6">
      {/* HERO PRINCIPAL EJECUTIVO (ESTILO ESAC-SALUD) */}
      <section className="-mx-4 bg-primary px-5 py-8 text-primary-ink sm:-mx-6 sm:px-8 sm:py-10 sm:rounded-3xl shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-ink/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-primary-ink/90">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Centro de Moderación y Control
            </div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl text-primary-ink">
              Panel Administrativo de AgroMarket
            </h1>
            <p className="text-xs sm:text-sm text-primary-ink/80 leading-relaxed">
              Auditoría de identidad de vendedores, moderación de calidad y sanidad en publicaciones y
              resolución de reportes comunitarios.
            </p>
          </div>

          {/* 3 TARJETAS KPI DE ACCESO RÁPIDO */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:w-auto">
            {/* KPI 1: VERIFICACIONES */}
            <button
              type="button"
              onClick={() => setTab("verificaciones")}
              className={`rounded-2xl border p-3 sm:p-4 text-left transition-all cursor-pointer ${
                tab === "verificaciones"
                  ? "border-accent bg-accent text-accent-ink shadow-md scale-102"
                  : "border-primary-ink/20 bg-primary-ink/10 text-primary-ink hover:bg-primary-ink/15"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold opacity-90 truncate">Verificaciones</span>
                <IconShieldCheck className="h-4 w-4 shrink-0 opacity-80" />
              </div>
              <div className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {conteos.isLoading ? "—" : conteos.verificaciones}
              </div>
              <p className="mt-0.5 text-[10px] font-medium opacity-75">
                {conteos.verificaciones === 1 ? "1 pendiente" : `${conteos.verificaciones} pendientes`}
              </p>
            </button>

            {/* KPI 2: PUBLICACIONES */}
            <button
              type="button"
              onClick={() => setTab("publicaciones")}
              className={`rounded-2xl border p-3 sm:p-4 text-left transition-all cursor-pointer ${
                tab === "publicaciones"
                  ? "border-accent bg-accent text-accent-ink shadow-md scale-102"
                  : "border-primary-ink/20 bg-primary-ink/10 text-primary-ink hover:bg-primary-ink/15"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold opacity-90 truncate">Publicaciones</span>
                <IconPackage className="h-4 w-4 shrink-0 opacity-80" />
              </div>
              <div className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {conteos.isLoading ? "—" : conteos.publicaciones}
              </div>
              <p className="mt-0.5 text-[10px] font-medium opacity-75">
                {conteos.publicaciones === 1 ? "1 en cola" : `${conteos.publicaciones} en cola`}
              </p>
            </button>

            {/* KPI 3: REPORTES */}
            <button
              type="button"
              onClick={() => setTab("reportes")}
              className={`rounded-2xl border p-3 sm:p-4 text-left transition-all cursor-pointer ${
                tab === "reportes"
                  ? "border-accent bg-accent text-accent-ink shadow-md scale-102"
                  : "border-primary-ink/20 bg-primary-ink/10 text-primary-ink hover:bg-primary-ink/15"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold opacity-90 truncate">Reportes</span>
                <IconFlag className="h-4 w-4 shrink-0 opacity-80" />
              </div>
              <div className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {conteos.isLoading ? "—" : conteos.reportes}
              </div>
              <p className="mt-0.5 text-[10px] font-medium opacity-75">
                {conteos.reportes === 1 ? "1 activo" : `${conteos.reportes} activos`}
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* BARRA DE PESTAÑAS TIPO PÍLDORA (SEGMENTED TABS) */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-xs">
        {TABS.map((t) => {
          const conteo = conteos[t.id];
          const activa = tab === t.id;
          const Icono = t.Icono;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activa
                  ? "bg-primary text-primary-ink shadow-sm"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              <Icono className="h-4 w-4 shrink-0" />
              <span>{t.label}</span>
              {conteo > 0 && (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                    activa
                      ? "bg-accent text-accent-ink"
                      : "bg-surface-2 text-ink border border-line"
                  }`}
                >
                  {conteo}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENIDO DE LA PESTAÑA */}
      <div className="pt-2">
        {tab === "verificaciones" && <VerificacionesTab />}
        {tab === "publicaciones" && <PublicacionesTab />}
        {tab === "reportes" && <ReportesTab />}
      </div>
    </div>
  );
}

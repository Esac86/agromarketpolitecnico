import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const clasesBase =
  "w-full rounded-xl border border-line bg-surface-2/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20";

function Etiqueta({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold text-ink/80 tracking-wide">{children}</label>;
}

interface CampoProps {
  etiqueta: string;
  error?: string;
}

export function Input({ etiqueta, error, ...props }: CampoProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <Etiqueta>{etiqueta}</Etiqueta>
      <input className={clasesBase} {...props} />
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export function Textarea({ etiqueta, error, ...props }: CampoProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="mb-4">
      <Etiqueta>{etiqueta}</Etiqueta>
      <textarea className={`${clasesBase} min-h-24 resize-y`} {...props} />
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export function Select({
  etiqueta,
  error,
  children,
  ...props
}: CampoProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="mb-4">
      <Etiqueta>{etiqueta}</Etiqueta>
      <select className={clasesBase} {...props}>
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

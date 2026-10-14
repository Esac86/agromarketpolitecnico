import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Field";
import { AuthLayout } from "./AuthLayout";

export function RegisterPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    password: "",
    telefono: "",
    ubicacion: "",
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  function campo(nombre: keyof typeof form) {
    return {
      value: form[nombre],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [nombre]: e.target.value })),
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones y la política de privacidad para continuar.");
      return;
    }
    setError(null);
    setCargando(true);
    try {
      await registrar(form);
      navigate("/perfil?bienvenida=1");
    } catch {
      setError("No se pudo completar el registro. Verifica los datos o si el correo ya está en uso.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout titulo="Crea tu cuenta" subtitulo="Empieza a comprar y vender en AgroMarket en minutos.">
      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          etiqueta="Nombre Completo o Razón Social"
          placeholder="Ej: Finca La Esperanza / Juan Pérez"
          required
          {...campo("nombre_completo")}
        />
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Input
            etiqueta="Correo Electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            {...campo("email")}
          />
          <Input
            etiqueta="Teléfono de Contacto"
            placeholder="310 000 0000"
            {...campo("telefono")}
          />
        </div>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Input
            etiqueta="Contraseña (mínimo 8 caracteres)"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            {...campo("password")}
          />
          <Input
            etiqueta="Ubicación Principal"
            placeholder="Ej: Yopal, Casanare"
            {...campo("ubicacion")}
          />
        </div>

        <label className="my-3 flex items-start gap-2.5 text-xs text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-primary accent-primary"
          />
          <span className="leading-relaxed">
            He leído y acepto los{" "}
            <Link to="/terminos" target="_blank" className="font-semibold text-primary underline underline-offset-2">
              Términos del Servicio
            </Link>{" "}
            y la{" "}
            <Link to="/privacidad" target="_blank" className="font-semibold text-primary underline underline-offset-2">
              Política de Privacidad
            </Link>
            .
          </span>
        </label>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs font-medium text-danger animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={cargando}
          className="mt-2 w-full rounded-xl py-3 font-bold shadow-soft transition-all active:scale-[0.99] cursor-pointer"
        >
          {cargando ? "Creando tu cuenta..." : "Crear mi cuenta gratis"}
        </Button>
      </form>

      <div className="mt-6 border-t border-line/70 pt-4 text-center text-sm text-muted">
        ¿Ya estás registrado?{" "}
        <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">
          Inicia sesión aquí
        </Link>
      </div>
    </AuthLayout>
  );
}

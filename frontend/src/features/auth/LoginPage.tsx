import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Field";
import { AuthLayout } from "./AuthLayout";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Email o contraseña incorrectos. Verifica tus credenciales.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout titulo="Inicia sesión" subtitulo="Ingresa tus credenciales para acceder a tu cuenta.">
      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          etiqueta="Correo Electrónico"
          type="email"
          placeholder="ejemplo@finca.co"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          etiqueta="Contraseña"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
          {cargando ? "Iniciando sesión..." : "Ingresar a mi cuenta"}
        </Button>
      </form>

      <div className="mt-8 border-t border-line/70 pt-5 text-center text-sm text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link to="/registro" className="font-bold text-primary hover:underline underline-offset-4">
          Regístrate gratis aquí
        </Link>
      </div>
    </AuthLayout>
  );
}

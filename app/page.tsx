"use client";

import { useRouter } from "next/navigation";
import { Shield, User, Info } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: string) => {
    // Navigate to dashboard and append the role as a query parameter
    // The DashboardLayout could pick this up to pre-select, but
    // just navigating is enough since we have a selector there.
    router.push(`/dashboard?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          ECTAX <span className="text-accent">Pólizas</span>
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sistema de Gestión de Pólizas Digital
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-10 px-6 shadow sm:rounded-lg sm:px-10 border border-border">

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8 flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Modo Demostración</p>
              <p className="text-sm text-blue-700 mt-1">No se requiere usuario ni contraseña. Selecciona un perfil para ingresar directamente al sistema interactivo.</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin('Admin')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
            >
              <Shield className="w-5 h-5" />
              Ingresar como Administrador
            </button>

            <button
              onClick={() => handleLogin('Vendedor')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
            >
              <User className="w-5 h-5 text-muted-foreground" />
              Ingresar como Vendedor
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Files,
    PenTool,
    LogOut,
    User,
    Users,
    Shield
} from "lucide-react";

export const RoleContext = createContext<{ role: string; setRole: (v: string) => void }>({ role: "Admin", setRole: () => { } });
export function useRole() { return useContext(RoleContext); }

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [role, setRole] = useState("Admin");

    useEffect(() => {
        const queryRole = searchParams.get('role');
        if (queryRole === 'Admin' || queryRole === 'Vendedor') {
            setRole(queryRole);
        }
    }, [searchParams]);

    const navigation = [
        { name: "Resumen", shortName: "Resumen", href: "/dashboard", icon: LayoutDashboard },
        { name: "Directorio de Clientes", shortName: "Clientes", href: "/dashboard/clientes", icon: Users },
        { name: "Soportes Comerciales", shortName: "Catálogo", href: "/dashboard/catalogo", icon: Files },
        { name: "Gestión Documental", shortName: "Documentos", href: "/dashboard/documentos", icon: FileText },
        { name: "Integración de Firma", shortName: "Firma", href: "/dashboard/firmas", icon: PenTool },
    ];

    if (role === "Admin") {
        navigation.push({ name: "Equipo de Ventas", shortName: "Equipo", href: "/dashboard/equipo", icon: Shield });
    }

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            <div className="flex h-screen bg-muted flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-primary text-primary-foreground flex flex-col md:h-full shadow-lg shrink-0">
                    <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                        <h1 className="text-xl font-bold tracking-tight">
                            ECTAX <span className="text-secondary font-medium">Pólizas</span>
                        </h1>
                    </div>

                    <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto hidden md:block">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? "bg-secondary text-primary"
                                        : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <Icon
                                        className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-primary-foreground/70"
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-white/10 hidden md:block shrink-0">
                        <div className="flex items-center px-2 py-3">
                            <div className="bg-accent/30 p-2 rounded-full">
                                <User className="h-5 w-5 text-secondary" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{role}</p>
                                <p className="text-xs text-primary-foreground/70">{role === 'Admin' ? 'admin@ectax.mx' : 'vendedor@ectax.mx'}</p>
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="mt-2 flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 text-primary-foreground/70" />
                            Cerrar Sesión
                        </Link>
                    </div>

                    {/* Mobile Navigation Bar */}
                    <div className="md:hidden flex justify-around py-1 px-1 bg-primary border-t border-white/10 shrink-0 w-full">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center p-1.5 flex-1 rounded-md transition-colors ${isActive
                                        ? "bg-secondary text-primary"
                                        : "text-primary-foreground/80 hover:text-white"
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mb-0.5" />
                                    <span className="text-[10px] leading-tight text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                        {item.shortName}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden w-full">
                    <header className="h-16 bg-card border-b border-border flex items-center px-4 md:px-6 shadow-sm z-10 shrink-0">
                        <h2 className="text-lg font-medium text-foreground truncate max-w-[50%]">
                            {navigation.find((n) => n.href === pathname)?.name || "Dashboard"}
                        </h2>

                        <div className="ml-auto flex items-center gap-3">
                            <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">Vista simulada:</span>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="bg-muted border border-border text-xs md:text-sm font-medium rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                            >
                                <option value="Admin">Administrador</option>
                                <option value="Vendedor">Vendedor</option>
                            </select>
                        </div>
                    </header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </RoleContext.Provider>
    );
}

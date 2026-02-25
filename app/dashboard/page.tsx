"use client";

import {
    Users,
    FileCheck,
    Clock,
    TrendingUp
} from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { name: "Pólizas Activas", value: "124", icon: FileCheck, trend: "+12%" },
        { name: "Clientes Válidos", value: "86", icon: Users, trend: "+4%" },
        { name: "Firmas Pendientes", value: "8", icon: Clock, trend: "-2%" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.name}
                            className="bg-card overflow-hidden shadow-sm rounded-lg border border-border"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-muted-foreground truncate">
                                                {item.name}
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-foreground">
                                                    {item.value}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-muted px-5 py-3">
                                <div className="text-sm text-foreground/80">
                                    <span className="text-green-600 font-medium">{item.trend}</span>{" "}
                                    desde el mes pasado
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-card shadow-sm rounded-lg border border-border p-6">
                <h3 className="text-lg leading-6 font-medium text-foreground mb-4">
                    Actividad Reciente
                </h3>
                <div className="flow-root">
                    <ul className="-mb-8">
                        <li className="relative pb-8 group cursor-pointer" onClick={() => window.location.href = '/dashboard/firmas/DOC-2026-001'}>
                            <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                                aria-hidden="true"
                            ></span>
                            <div className="relative flex space-x-3 hover:bg-muted/50 p-2 -ml-2 rounded-md transition-colors">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-accent flex items-center justify-center ring-8 ring-card">
                                        <FileCheck className="h-4 w-4 text-white" />
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            Póliza firmada por{" "}
                                            <span className="font-medium text-foreground">Empresa XYZ S.A.</span>
                                        </p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-muted-foreground">
                                        hace 2 horas
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="relative pb-8 group cursor-pointer" onClick={() => window.location.href = '/dashboard/clientes'}>
                            <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                                aria-hidden="true"
                            ></span>
                            <div className="relative flex space-x-3 hover:bg-muted/50 p-2 -ml-2 rounded-md transition-colors">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center ring-8 ring-card">
                                        <Users className="h-4 w-4 text-primary" />
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            Nuevo cliente registrado{" "}
                                            <span className="font-medium text-foreground">Juan Pérez (Persona Física)</span>
                                        </p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-muted-foreground">
                                        hace 5 horas
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="relative pb-8 group cursor-pointer" onClick={() => window.location.href = '/dashboard/firmas'}>
                            <div className="relative flex space-x-3 hover:bg-muted/50 p-2 -ml-2 rounded-md transition-colors">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center ring-8 ring-card border border-border">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            Documento enviado a firma a{" "}
                                            <span className="font-medium text-foreground">Comercializadora ABC</span>
                                        </p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-muted-foreground">
                                        hace 1 día
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

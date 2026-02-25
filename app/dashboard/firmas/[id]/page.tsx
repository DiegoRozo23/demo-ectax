"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText, Download, Mail, Eye, XCircle, Clock, Send } from "lucide-react";

const firmasDB = [
    {
        id: "DOC-2026-001",
        cliente: "Empresa XYZ S.A.",
        correo: "representante@empresaxyz.com",
        documento: "Contrato de Póliza - Plan Premium",
        estado: "firmado",
        fechaEnviado: "10 Feb 2026, 09:00 AM",
        fechaActualizacion: "11 Feb 2026, 14:30 PM",
    },
    {
        id: "DOC-2026-002",
        cliente: "Comercializadora ABC",
        correo: "legal@comercializadoraabc.mx",
        documento: "Condiciones Generales",
        estado: "pendiente",
        fechaEnviado: "11 Feb 2026, 10:30 AM",
        fechaActualizacion: "-",
    },
    {
        id: "DOC-2026-003",
        cliente: "Juan Pérez",
        correo: "juan.perez@email.com",
        documento: "Contrato de Comisión Mercantil",
        estado: "rechazado",
        fechaEnviado: "08 Feb 2026, 11:15 AM",
        fechaActualizacion: "09 Feb 2026, 16:45 PM",
    },
    {
        id: "DOC-2026-004",
        cliente: "Logística del Norte",
        correo: "direccion@logisticanorte.com",
        documento: "Adendum de Servicios",
        estado: "enviado",
        fechaEnviado: "12 Feb 2026, 08:20 AM",
        fechaActualizacion: "-",
    }
];

export default function FirmaDetallePage() {
    const params = useParams();
    const router = useRouter();
    const [notification, setNotification] = useState<string | null>(null);
    const docId = params?.id as string || "DOC-2026-002";

    // Find the current signature mock record
    const firma = firmasDB.find(f => f.id === docId) || firmasDB[1]; // fallback to pendiente

    const renderBadge = () => {
        switch (firma.estado) {
            case "firmado":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Firmado</span>;
            case "rechazado":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Rechazado</span>;
            case "enviado":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">Enviado</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">Pendiente</span>;
        }
    };

    const renderIcon = () => {
        switch (firma.estado) {
            case "firmado": return <CheckCircle2 className="h-8 w-8 text-emerald-600" />;
            case "rechazado": return <XCircle className="h-8 w-8 text-red-600" />;
            case "enviado": return <Send className="h-8 w-8 text-blue-600" />;
            default: return <Clock className="h-8 w-8 text-amber-600" />;
        }
    };

    const renderStatusText = () => {
        switch (firma.estado) {
            case "firmado": return "Este documento ha sido firmado exitosamente por todas las partes.";
            case "rechazado": return "El cliente ha declinado firmar este documento. Será necesario generar uno nuevo.";
            case "enviado": return "Documento enviado, pero el cliente aún no lo ha abierto.";
            default: return "El cliente ha abierto el documento pero aún no lo ha firmado.";
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => router.back()}
                        className="p-1 sm:p-2 mt-1 sm:mt-0 hover:bg-muted rounded-full transition-colors shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex flex-wrap items-center gap-2 sm:gap-3">
                            Firma: {docId}
                            {renderBadge()}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Visualización y trazabilidad del documento.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        onClick={() => {
                            setNotification("Documento reenviado nuevamente a " + firma.correo);
                            setTimeout(() => setNotification(null), 3000);
                        }}
                        className="flex w-full sm:w-auto justify-center items-center gap-2 border border-border bg-background px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        <Mail className="h-4 w-4" />
                        Reenviar
                    </button>
                    <button
                        onClick={() => {
                            setNotification("Descargando PDF original de " + firma.cliente);
                            setTimeout(() => setNotification(null), 3000);
                        }}
                        className="flex w-full sm:w-auto justify-center items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        <Download className="h-4 w-4" />
                        Descargar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Document Preview (Mock) */}
                <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:h-[600px]">
                    <div className="bg-muted p-3 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium truncate pr-2">
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate">{firma.documento}.pdf</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button className="p-1.5 hover:bg-background rounded-md text-muted-foreground">
                                <Eye className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center p-4 sm:p-8">
                        <div className="w-full h-full max-w-lg bg-white shadow-md flex flex-col items-center justify-center p-6 sm:p-8 text-center border-t-8 border-primary">
                            {/* Faked Documenso View */}
                            <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                                    {renderIcon()}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">ECTAX Digital</h3>
                                <p className="text-slate-500">{renderStatusText()}</p>

                                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Estado de Aprobación</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                                        <div className={`w-4 h-4 rounded-full border ${firma.estado === 'firmado' ? 'bg-emerald-500 border-emerald-600' : 'border-slate-300'}`}></div>
                                        Firma del Representante Legal
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className={`w-4 h-4 rounded-full border ${firma.estado === 'firmado' ? 'bg-emerald-500 border-emerald-600' : 'border-slate-300'}`}></div>
                                        Fecha de Aceptación {firma.estado === 'firmado' && <span className="text-xs text-muted-foreground ml-2">({firma.fechaActualizacion})</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg shadow-sm p-5">
                        <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Información del Envío</h3>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Destinatario</dt>
                                <dd className="font-medium mt-1">{firma.cliente}</dd>
                                <dd className="text-muted-foreground mt-0.5">{firma.correo}</dd>
                            </div>
                            <hr className="border-border" />
                            <div>
                                <dt className="text-muted-foreground">Enviado por</dt>
                                <dd className="font-medium mt-1">Administrador ECTAX</dd>
                            </div>
                            <hr className="border-border" />
                            <div>
                                <dt className="text-muted-foreground">Fecha de Envío</dt>
                                <dd className="font-medium mt-1">{firma.fechaEnviado}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-card border border-border rounded-lg shadow-sm p-5">
                        <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Historial de Auditoría</h3>
                        <div className="relative border-l border-border ml-3 space-y-6">
                            <div className="relative pl-6">
                                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-accent"></span>
                                <p className="text-sm font-medium">Documento Creado</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{firma.fechaEnviado}</p>
                            </div>
                            <div className="relative pl-6">
                                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-accent"></span>
                                <p className="text-sm font-medium">Enviado a firma</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{firma.fechaEnviado}</p>
                            </div>
                            {firma.estado === "enviado" ? (
                                <>
                                    <div className="relative pl-6">
                                        <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-muted border-border"></span>
                                        <p className="text-sm font-medium text-muted-foreground">Visto por destinatario</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Pendiente</p>
                                    </div>
                                </>
                            ) : (
                                <div className="relative pl-6">
                                    <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-accent"></span>
                                    <p className="text-sm font-medium text-foreground">Visto por destinatario</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{firma.fechaEnviado.replace("AM", "AM (aprox)")}</p>
                                </div>
                            )}

                            {firma.estado === "firmado" && (
                                <div className="relative pl-6">
                                    <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"></span>
                                    <p className="text-sm font-medium text-emerald-700">Firmado Exitosamente</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{firma.fechaActualizacion}</p>
                                </div>
                            )}
                            {firma.estado === "rechazado" && (
                                <div className="relative pl-6">
                                    <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-red-500"></span>
                                    <p className="text-sm font-medium text-red-700">Firma Rechazada</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{firma.fechaActualizacion}</p>
                                </div>
                            )}
                            {firma.estado === "pendiente" && (
                                <div className="relative pl-6">
                                    <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-muted border-border"></span>
                                    <p className="text-sm font-medium text-muted-foreground">Firmado</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Pendiente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {notification && (
                <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="w-5 h-5" />
                    {notification}
                </div>
            )}
        </div>
    );
}

"use client";

import { CheckCircle2, Clock, XCircle, Send, Search, User, Mail, FileText, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FirmasContent() {
    const [firmas, setFirmas] = useState([
        {
            id: "DOC-2026-001",
            cliente: "Empresa XYZ S.A.",
            documento: "Contrato de Póliza - Plan Premium",
            estado: "firmado",
            fechaEnviado: "10 Feb 2026",
            fechaActualizacion: "11 Feb 2026",
        },
        {
            id: "DOC-2026-002",
            cliente: "Comercializadora ABC",
            documento: "Condiciones Generales",
            estado: "pendiente",
            fechaEnviado: "11 Feb 2026",
            fechaActualizacion: "-",
        },
        {
            id: "DOC-2026-003",
            cliente: "Juan Pérez",
            documento: "Contrato de Comisión Mercantil",
            estado: "rechazado",
            fechaEnviado: "08 Feb 2026",
            fechaActualizacion: "09 Feb 2026",
        },
        {
            id: "DOC-2026-004",
            cliente: "Logística del Norte",
            documento: "Adendum de Servicios",
            estado: "enviado",
            fechaEnviado: "12 Feb 2026",
            fechaActualizacion: "-",
        },
    ]);

    const [notification, setNotification] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // New sending flow state
    const [isSending, setIsSending] = useState(false);

    // Mock clients for autofill
    const mockClients = [
        { id: "c1", name: "Juan Pérez", email: "juan.perez@email.com" },
        { id: "c2", name: "Empresa XYZ S.A.", email: "representante@empresaxyz.com" },
        { id: "c3", name: "Logística del Norte", email: "legal@logisticanorte.com.mx" }
    ];

    const [sendForm, setSendForm] = useState({
        documentId: "",
        clientId: "",
        signerName: "",
        signerEmail: "",
        message: "Por favor revisa y firma este documento electrónico."
    });

    const searchParams = useSearchParams();

    useEffect(() => {
        const clientParam = searchParams.get('cliente');
        if (clientParam) {
            // Find a mock client that matches part of the name
            const matchedClient = mockClients.find(c => clientParam.includes(c.name));
            if (matchedClient) {
                setSendForm(prev => ({
                    ...prev,
                    clientId: matchedClient.id,
                    signerName: matchedClient.name,
                    signerEmail: matchedClient.email
                }));
            } else {
                setSendForm(prev => ({
                    ...prev,
                    signerName: clientParam
                }));
            }
            setIsSending(true);
        }
    }, [searchParams]);

    const handleClientSelect = (clientId: string) => {
        const client = mockClients.find(c => c.id === clientId);
        if (client) {
            setSendForm({
                ...sendForm,
                clientId: clientId,
                signerName: client.name,
                signerEmail: client.email
            });
        } else {
            setSendForm({
                ...sendForm,
                clientId: "",
                signerName: "",
                signerEmail: ""
            });
        }
    };

    const filteredFirmas = firmas.filter(f =>
        f.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.documento.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendSignature = (e: React.FormEvent) => {
        e.preventDefault();

        const newDoc = {
            id: `DOC-2026-00${firmas.length + 1}`,
            cliente: sendForm.signerName,
            documento: sendForm.documentId === "plan_premium" ? "Contrato de Póliza - Plan Premium"
                : sendForm.documentId === "condiciones" ? "Condiciones Generales"
                    : "Documento Personalizado",
            estado: "enviado",
            fechaEnviado: "Ahora mismo",
            fechaActualizacion: "-",
        };

        setFirmas([newDoc, ...firmas]);
        setIsSending(false);
        setSendForm({ documentId: "", clientId: "", signerName: "", signerEmail: "", message: "Por favor revisa y firma este documento electrónico." });
        setNotification(`El documento ha sido enviado a ${sendForm.signerEmail} exitosamente vía Documenso.`);
        setTimeout(() => setNotification(null), 5000);
    };

    const getStatusBadge = (estado: string) => {
        switch (estado) {
            case "firmado":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Firmado
                    </span>
                );
            case "pendiente":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Pendiente
                    </span>
                );
            case "rechazado":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Rechazado
                    </span>
                );
            case "enviado":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                        <Send className="w-3.5 h-3.5 mr-1" />
                        Enviado
                    </span>
                );
            default:
                return null;
        }
    };

    if (isSending) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Enviar Documento a Firma</h2>
                        <p className="text-muted-foreground mt-1">
                            Configura el destinatario y envía el documento a través de Documenso.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSending(false)}
                        className="border border-border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>
                </div>

                <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
                    <form onSubmit={handleSendSignature}>
                        <div className="p-6 space-y-8">

                            {/* Paso 1: Documento */}
                            <div>
                                <h3 className="text-lg font-medium text-foreground flex items-center gap-2 mb-4">
                                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                    Seleccionar Documento
                                </h3>
                                <div className="ml-8">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Documento base
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <select
                                            required
                                            value={sendForm.documentId}
                                            onChange={e => setSendForm({ ...sendForm, documentId: e.target.value })}
                                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm bg-background text-foreground"
                                        >
                                            <option value="">Seleccione un documento del expediente...</option>
                                            <option value="plan_premium">Contrato de Póliza - Plan Premium (v1.2)</option>
                                            <option value="condiciones">Condiciones Generales Especiales (v1.0)</option>
                                            <option value="adendum">Adendum de Servicios Adicionales</option>
                                        </select>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        El documento será enrutado a Documenso para estampar los campos de firma automáticamente.
                                    </p>
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* Paso 2: Destinatario */}
                            <div>
                                <h3 className="text-lg font-medium text-foreground flex items-center gap-2 mb-4">
                                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                    Datos del Firmante
                                </h3>
                                <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Seleccionar Cliente del Directorio (Autocompletar)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <select
                                                value={sendForm.clientId}
                                                onChange={e => handleClientSelect(e.target.value)}
                                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm bg-background text-foreground"
                                            >
                                                <option value="">Ingresar datos manualmente...</option>
                                                {mockClients.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Nombre Completo o Empresa
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                value={sendForm.signerName}
                                                onChange={e => setSendForm({ ...sendForm, signerName: e.target.value })}
                                                className="block w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm bg-background text-foreground"
                                                placeholder="Ej. Juan Pérez"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                value={sendForm.signerEmail}
                                                onChange={e => setSendForm({ ...sendForm, signerEmail: e.target.value })}
                                                className="block w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm bg-background text-foreground"
                                                placeholder="juan.perez@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Mensaje para el firmante (Opcional)
                                        </label>
                                        <textarea
                                            value={sendForm.message}
                                            onChange={e => setSendForm({ ...sendForm, message: e.target.value })}
                                            rows={3}
                                            className="block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm bg-background text-foreground resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/50 px-6 py-4 border-t border-border flex justify-end gap-3 items-center">
                            <span className="text-sm text-muted-foreground mr-auto flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Integración activa con Documenso API
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsSending(false)}
                                className="px-4 py-2 border border-border bg-background text-foreground rounded-md text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50"
                                disabled={!sendForm.documentId || !sendForm.signerName || !sendForm.signerEmail}
                            >
                                <Send className="w-4 h-4" />
                                Enviar para Firma
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Integración de Firma Documenso</h2>
                    <p className="text-muted-foreground mt-1">
                        Monitoreo en tiempo real del estado de firmas de documentos enviados.
                    </p>
                </div>
                <button
                    onClick={() => setIsSending(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 shrink-0">
                    <Plus className="w-4 h-4" />
                    Nuevo Envío
                </button>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="relative rounded-md shadow-sm w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:ring-ring focus:border-ring block w-full pl-10 sm:text-sm border-input rounded-md py-2 bg-background text-foreground outline-none"
                            placeholder="Buscar por cliente, documento o ID..."
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    ID y Documento
                                </th>
                                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Estado de Firma
                                </th>
                                <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Fecha de Envío
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredFirmas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No se encontraron firmas que coincidan con tu búsqueda.
                                    </td>
                                </tr>
                            ) : filteredFirmas.map((firma) => (
                                <tr key={firma.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground whitespace-normal">{firma.documento}</div>
                                        <div className="text-sm text-muted-foreground">{firma.id}</div>
                                        <div className="sm:hidden mt-2 text-xs">
                                            <div className="text-muted-foreground">{firma.cliente}</div>
                                            <div className="mt-1.5 flex items-center flex-wrap gap-2">
                                                {getStatusBadge(firma.estado)} <span className="text-muted-foreground">• {firma.fechaEnviado}</span>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block md:hidden mt-2 text-xs">
                                            <div className="mt-1 flex items-center gap-2">
                                                {getStatusBadge(firma.estado)} <span className="text-muted-foreground">• {firma.fechaEnviado}</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:block lg:hidden mt-1.5 text-xs text-muted-foreground">
                                            Envío: {firma.fechaEnviado}
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{firma.cliente}</div>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(firma.estado)}
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{firma.fechaEnviado}</div>
                                        <div className="text-xs text-muted-foreground">Act.: {firma.fechaActualizacion}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/dashboard/firmas/${firma.id}`} className="text-accent hover:text-primary mr-4 transition-colors">
                                            Ver Detalles
                                        </Link>
                                        {firma.estado === 'pendiente' && (
                                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                                Recordatorio
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {notification && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="w-5 h-5" />
                    {notification}
                </div>
            )}
        </div>
    );
}

export default function FirmasPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando...</div>}>
            <FirmasContent />
        </Suspense>
    );
}

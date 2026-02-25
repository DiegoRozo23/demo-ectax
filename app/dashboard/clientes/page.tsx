"use client";

import { useState } from "react";
import { Plus, Search, Users, UserPlus, FileEdit, Trash2, Building2, User, CheckCircle2, FileText, UploadCloud, Download, Eye, X, ChevronRight, PenTool, Clock, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientesPage() {
    const [activeForm, setActiveForm] = useState<'add' | 'edit' | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'signatures'>('info');

    const router = useRouter();
    const basePath = process.env.NODE_ENV === 'production' ? '/demo-ectax' : '';

    // Mock client documents linked to real PDFs in public/documents
    const [clientDocs, setClientDocs] = useState([
        { id: "CL-001", file: "Copia de 20251113 EXTAX Quiénes somos.pdf", displayName: "Identificación Oficial", date: "24/02/2026", type: "PDF" },
        { id: "CL-001", file: "Datos Bancarios ECTAX.pdf", displayName: "Comprobante de Domicilio", date: "21/02/2026", type: "PDF" },
        { id: "CL-002", file: "Copia de 20251216 Producto ECTAX.pdf", displayName: "Acta Constitutiva", date: "15/01/2026", type: "PDF" },
    ]);

    // Mock signatures
    const [clientSignatures, setClientSignatures] = useState([
        { id: "DOC-2026-001", clientId: "CL-002", docName: "Contrato de Póliza - Plan Premium", status: "firmado", date: "10 Feb 2026" },
        { id: "DOC-2026-003", clientId: "CL-001", docName: "Contrato de Comisión Mercantil", status: "rechazado", date: "08 Feb 2026" },
        { id: "DOC-2026-004", clientId: "CL-001", docName: "Adendum de Servicios", status: "enviado", date: "12 Feb 2026" },
    ]);

    const [clientes, setClientes] = useState([
        {
            id: "CL-001",
            nombre: "Juan Pérez",
            tipo: "Persona Física",
            rfc: "PEJU800101XYZ",
            correo: "juan.perez@email.com",
            telefono: "55 1234 5678",
            estado: "Activo"
        },
        {
            id: "CL-002",
            nombre: "Empresa XYZ S.A.",
            tipo: "Persona Moral",
            rfc: "EXY900101ABC",
            correo: "representante@empresaxyz.com",
            telefono: "55 8765 4321",
            estado: "Activo"
        },
        {
            id: "CL-003",
            nombre: "Comercializadora ABC",
            tipo: "Persona Moral",
            rfc: "CAB801212DEF",
            correo: "legal@comercializadoraabc.mx",
            telefono: "33 1122 3344",
            estado: "Inactivo"
        }
    ]);

    const initialFormState = {
        nombre: "",
        tipo: "Persona Física",
        rfc: "",
        correo: "",
        telefono: ""
    };

    const [formData, setFormData] = useState(initialFormState);
    const [notification, setNotification] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [clientToDelete, setClientToDelete] = useState<{ id: string, nombre: string } | null>(null);

    const filteredClientes = clientes.filter((c: any) =>
        c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.rfc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.correo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveClient = (e: React.FormEvent) => {
        e.preventDefault();

        if (activeForm === 'edit' && editingId) {
            setClientes(clientes.map((c: any) => c.id === editingId ? { ...c, ...formData } : c));
            showNotification("Perfil de cliente actualizado exitosamente.");
        } else {
            const newClient = {
                id: `CL-00${clientes.length + 1}`,
                ...formData,
                estado: "Activo"
            };
            setClientes([newClient, ...clientes]);
            showNotification("Nuevo cliente añadido exitosamente.");
        }

        setActiveForm(null);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const openEditForm = (client: any) => {
        setFormData({
            nombre: client.nombre,
            tipo: client.tipo,
            rfc: client.rfc,
            correo: client.correo,
            telefono: client.telefono
        });
        setEditingId(client.id);
        setActiveForm('edit');
    };

    const confirmDelete = () => {
        if (clientToDelete) {
            setClientes(clientes.filter((c: any) => c.id !== clientToDelete.id));
            showNotification(`Cliente ${clientToDelete.nombre} eliminado del sistema.`);
            setClientToDelete(null);
        }
    };

    if (activeForm) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6">
                    <button onClick={() => {
                        setActiveForm(null);
                        setActiveTab('info');
                        setFormData(initialFormState);
                    }} className="hover:text-foreground transition-colors">
                        Directorio de Clientes
                    </button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-foreground">{activeForm === 'edit' ? formData.nombre : 'Nuevo Cliente'}</span>
                </nav>

                <div className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {activeForm === 'edit' ? 'Perfil del Cliente' : 'Añadir Nuevo Cliente'}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {activeForm === 'edit' ? 'Visualiza o actualiza el expediente del cliente.' : 'Ingresa los datos del nuevo cliente para registrarlo en el sistema.'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setActiveForm(null);
                            setActiveTab('info');
                            setFormData({ nombre: "", tipo: "Persona Física", rfc: "", correo: "", telefono: "" });
                        }}
                        className="border border-border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        Cancelar
                    </button>
                </div>

                {activeForm === 'edit' && (
                    <div className="flex flex-col sm:flex-row bg-muted p-1 rounded-md mb-6 w-full gap-1">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 px-4 py-2 sm:py-1.5 text-sm font-medium rounded-sm transition-colors text-center sm:text-left whitespace-nowrap ${activeTab === 'info' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <User className="w-4 h-4 inline sm:mr-2 mb-1 sm:mb-0" />
                            <span className="hidden sm:inline">Información General</span>
                            <span className="sm:hidden block mt-1">Info General</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`flex-1 px-4 py-2 sm:py-1.5 text-sm font-medium rounded-sm transition-colors text-center sm:text-left whitespace-nowrap ${activeTab === 'docs' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <FileText className="w-4 h-4 inline sm:mr-2 mb-1 sm:mb-0" />
                            <span className="hidden sm:inline">Expediente (Documentos)</span>
                            <span className="sm:hidden block mt-1">Documentos</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('signatures')}
                            className={`flex-1 px-4 py-2 sm:py-1.5 text-sm font-medium rounded-sm transition-colors text-center sm:text-left whitespace-nowrap ${activeTab === 'signatures' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <PenTool className="w-4 h-4 inline sm:mr-2 mb-1 sm:mb-0" />
                            <span className="hidden sm:inline">Estatus de Firmas</span>
                            <span className="sm:hidden block mt-1">Firmas</span>
                        </button>
                    </div>
                )}

                <div className="bg-card border border-border shadow-sm rounded-lg p-6">
                    {activeTab === 'info' ? (
                        <form className="space-y-6" onSubmit={handleSaveClient}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Tipo de Cliente
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="tipo" value="Persona Física" checked={formData.tipo === 'Persona Física'} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="text-primary focus:ring-primary" />
                                            <span className="text-sm">Persona Física</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="tipo" value="Persona Moral" checked={formData.tipo === 'Persona Moral'} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="text-primary focus:ring-primary" />
                                            <span className="text-sm">Persona Moral</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Nombre Completo / Razón Social *
                                    </label>
                                    <input required type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Ej. Juan Pérez" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        RFC *
                                    </label>
                                    <input required type="text" value={formData.rfc} onChange={(e) => setFormData({ ...formData, rfc: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Ej. PEJU800101XYZ" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Correo Electrónico *
                                    </label>
                                    <input required type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="ejemplo@correo.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Teléfono Principal
                                    </label>
                                    <input type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="10 dígitos" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveForm(null);
                                        setFormData({ nombre: "", tipo: "Persona Física", rfc: "", correo: "", telefono: "" });
                                    }}
                                    className="border border-border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                    {activeForm === 'edit' ? <FileEdit className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                    {activeForm === 'edit' ? 'Guardar Cambios' : 'Guardar Cliente'}
                                </button>
                            </div>
                        </form>
                    ) : activeTab === 'docs' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-foreground">Expediente Digital del Cliente</h3>
                                    <p className="text-sm text-muted-foreground">Documentos subidos y asociados a este cliente.</p>
                                </div>
                                <Link
                                    href={`/dashboard/documentos?cliente=${encodeURIComponent(`${formData.nombre} (${formData.tipo})`)}`}
                                    className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 flex items-center gap-2 transition-colors">
                                    <UploadCloud className="w-4 h-4" />
                                    Subir Archivo
                                </Link>
                            </div>

                            <div className="border border-border rounded-lg overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Archivo</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Tipo</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Fecha</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-card divide-y divide-border">
                                        {clientDocs.filter(doc => doc.id === editingId).length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                    No hay documentos asociados a este cliente.
                                                </td>
                                            </tr>
                                        ) : clientDocs.filter(doc => doc.id === editingId).map((doc, idx) => (
                                            <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-start gap-2">
                                                        <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-medium text-foreground whitespace-normal break-words" title={doc.displayName}>{doc.displayName}</span>
                                                            <span className="text-xs text-muted-foreground sm:hidden mt-0.5">{doc.type} • {doc.date}</span>
                                                            <span className="text-xs text-muted-foreground hidden sm:block md:hidden mt-0.5">{doc.date}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{doc.type}</td>
                                                <td className="hidden md:table-cell px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{doc.date}</td>
                                                <td className="px-4 py-3 text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <a href={`${basePath}/documents/${doc.file}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Ver archivo"><Eye className="w-4 h-4" /></a>
                                                        <a href={`${basePath}/documents/${doc.file}`} download={doc.file} className="text-muted-foreground hover:text-accent transition-colors" title="Descargar"><Download className="w-4 h-4" /></a>
                                                        <button className="text-muted-foreground hover:text-red-500 transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-foreground">Firmas Documenso</h3>
                                    <p className="text-sm text-muted-foreground">Monitoreo de documentos enviados a este cliente.</p>
                                </div>
                                <Link
                                    href={`/dashboard/firmas?cliente=${encodeURIComponent(formData.nombre)}`}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Nuevo Envío
                                </Link>
                            </div>

                            <div className="border border-border rounded-lg overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">ID y Documento</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Estado</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Fecha</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-card divide-y divide-border">
                                        {clientSignatures.filter(sig => sig.clientId === editingId).length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                    No hay firmas registradas para este cliente.
                                                </td>
                                            </tr>
                                        ) : clientSignatures.filter(sig => sig.clientId === editingId).map((sig, idx) => (
                                            <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-4 min-w-[200px]">
                                                    <div className="text-sm font-medium text-foreground whitespace-normal break-words">{sig.docName}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{sig.id} <span className="md:hidden">• {sig.date}</span></div>
                                                    <div className="sm:hidden mt-2 flex flex-wrap gap-1">
                                                        {sig.status === 'firmado' && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1" />Firmado</span>}
                                                        {sig.status === 'pendiente' && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" />Pendiente</span>}
                                                        {sig.status === 'rechazado' && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700"><X className="w-3 h-3 mr-1" />Rechazado</span>}
                                                        {sig.status === 'enviado' && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700"><Send className="w-3 h-3 mr-1" />Enviado</span>}
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm">
                                                    {sig.status === 'firmado' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1" />Firmado</span>}
                                                    {sig.status === 'pendiente' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" />Pendiente</span>}
                                                    {sig.status === 'rechazado' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700"><X className="w-3 h-3 mr-1" />Rechazado</span>}
                                                    {sig.status === 'enviado' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700"><Send className="w-3 h-3 mr-1" />Enviado</span>}
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">{sig.date}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={`/dashboard/firmas/${sig.id}`} className="text-accent hover:text-primary transition-colors inline-block mt-1">
                                                        Detalles
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Directorio de Clientes</h2>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los perfiles de personas físicas y morales asociadas a pólizas.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ nombre: "", tipo: "Persona Física", rfc: "", correo: "", telefono: "" });
                        setActiveForm('add');
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 shrink-0">
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                </button>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                    <div className="relative rounded-md shadow-sm max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-input rounded-md py-2 bg-background text-foreground outline-none"
                            placeholder="Buscar por nombre, RFC o correo..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Cliente / Empresa
                                </th>
                                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredClientes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No se encontraron clientes que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            ) : filteredClientes.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div
                                            className="flex items-center cursor-pointer group"
                                            onClick={() => openEditForm(cliente)}
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                                {cliente.tipo === 'Persona Moral' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cliente.nombre}</div>
                                                <div className="text-xs text-muted-foreground font-mono mt-0.5">{cliente.rfc}</div>
                                                <div className="sm:hidden mt-2 text-xs">
                                                    <div className="text-muted-foreground">{cliente.correo}</div>
                                                    <div className="text-muted-foreground mt-0.5">{cliente.telefono}</div>
                                                    <div className="mt-1.5">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${cliente.estado === 'Activo'
                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                                            }`}>
                                                            {cliente.estado}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:block md:hidden mt-1.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${cliente.estado === 'Activo'
                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                                        }`}>
                                                        {cliente.estado}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{cliente.correo}</div>
                                        <div className="text-sm text-muted-foreground">{cliente.telefono}</div>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cliente.estado === 'Activo'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                            }`}>
                                            {cliente.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditForm(cliente)}
                                            className="text-muted-foreground hover:text-accent mr-3 transition-colors" title="Editar">
                                            <FileEdit className="w-4 h-4 inline" />
                                        </button>
                                        <button
                                            onClick={() => setClientToDelete({ id: cliente.id, nombre: cliente.nombre })}
                                            className="text-muted-foreground hover:text-red-500 transition-colors" title="Eliminar">
                                            <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {clientToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-border shadow-xl rounded-lg p-6 max-w-sm w-full animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-foreground mb-2">Confirmar Eliminación</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            ¿Estás seguro de que deseas eliminar permanentemente a <strong>{clientToDelete.nombre}</strong> del sistema? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setClientToDelete(null)}
                                className="border border-border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="w-5 h-5" />
                    {notification}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRole } from "../layout";
import { Plus, Search, Shield, User, UserPlus, FileEdit, Trash2, Ban, Lock, Users } from "lucide-react";

export default function EquipoPage() {
    const { role } = useRole();

    const [equipo, setEquipo] = useState([
        {
            id: "VEND-001",
            nombre: "Carlos Mendoza",
            correo: "carlos.m@ectax.mx",
            telefono: "55 1122 3344",
            clientesAsignados: 12,
            estado: "Activo"
        },
        {
            id: "VEND-002",
            nombre: "Ana Ramírez",
            correo: "ana.r@ectax.mx",
            telefono: "55 2233 4455",
            clientesAsignados: 8,
            estado: "Activo"
        },
        {
            id: "VEND-003",
            nombre: "Roberto Gómez",
            correo: "roberto.g@ectax.mx",
            telefono: "55 3344 5566",
            clientesAsignados: 0,
            estado: "Suspendido"
        }
    ]);

    const [activeForm, setActiveForm] = useState<'add' | 'edit' | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [notification, setNotification] = useState<string | null>(null);

    const initialFormState = {
        nombre: "",
        correo: "",
        telefono: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    // If not admin, show unauthorized
    if (role !== "Admin") {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <Lock className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-foreground">Acceso Denegado</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Esta sección es exclusiva para Administradores. Tu rol actual es Vendedor, por lo que no tienes permisos para gestionar el equipo.
                </p>
            </div>
        );
    }

    const filteredEquipo = equipo.filter(v =>
        v.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.correo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveVendedor = (e: React.FormEvent) => {
        e.preventDefault();

        if (activeForm === 'edit' && editingId) {
            setEquipo(equipo.map(v => v.id === editingId ? { ...v, ...formData } : v));
            showNotification(`Perfil de ${formData.nombre} actualizado exitosamente.`);
        } else {
            const newVendedor = {
                id: `VEND-00${equipo.length + 1}`,
                ...formData,
                clientesAsignados: 0,
                estado: "Activo"
            };
            setEquipo([newVendedor, ...equipo]);
            showNotification(`Vendedor ${formData.nombre} invitado y añadido al equipo.`);
        }

        setActiveForm(null);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const openEditForm = (vendedor: any) => {
        setFormData({
            nombre: vendedor.nombre,
            correo: vendedor.correo,
            telefono: vendedor.telefono
        });
        setEditingId(vendedor.id);
        setActiveForm('edit');
    };

    const toggleEstado = (id: string, nombre: string, currentStatus: string) => {
        const newStatus = currentStatus === "Activo" ? "Suspendido" : "Activo";
        setEquipo(equipo.map(v => v.id === id ? { ...v, estado: newStatus } : v));
        showNotification(`Acceso de ${nombre} ${newStatus === 'Suspendido' ? 'suspendido' : 'reactivado'}.`);
    };

    if (activeForm) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {activeForm === 'edit' ? 'Editar Vendedor' : 'Invitar Nuevo Vendedor'}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {activeForm === 'edit' ? 'Modifica los datos del asesor comercial.' : 'Ingresa los datos del nuevo asesor comercial para enviarle una invitación.'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setActiveForm(null);
                            setFormData(initialFormState);
                        }}
                        className="border border-border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        Cancelar
                    </button>
                </div>

                <div className="bg-card border border-border shadow-sm rounded-lg p-6">
                    <form className="space-y-6" onSubmit={handleSaveVendedor}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Nombre Completo *
                                </label>
                                <input required type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Ej. Carlos Mendoza" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Correo Electrónico Institucional *
                                </label>
                                <input required type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="correo@ectax.mx" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Teléfono Móvil
                                </label>
                                <input type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="10 dígitos" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveForm(null);
                                    setFormData(initialFormState);
                                }}
                                className="border border-border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                {activeForm === 'edit' ? <FileEdit className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                {activeForm === 'edit' ? 'Guardar Cambios' : 'Enviar Invitación'}
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
                    <h2 className="text-2xl font-bold text-foreground">Equipo de Ventas</h2>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los asesores comerciales, suspende accesos y monitorea sus carteras de clientes.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFormData(initialFormState);
                        setActiveForm('add');
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 shrink-0">
                    <UserPlus className="w-4 h-4" />
                    Nuevo Vendedor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex items-center">
                    <div className="bg-accent/20 p-3 rounded-full text-accent mr-4">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Vendedores</p>
                        <p className="text-2xl font-bold text-foreground">{equipo.length}</p>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex items-center">
                    <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-600 mr-4">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Vendedores Activos</p>
                        <p className="text-2xl font-bold text-foreground">{equipo.filter(e => e.estado === 'Activo').length}</p>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex items-center">
                    <div className="bg-red-500/20 p-3 rounded-full text-red-600 mr-4">
                        <Ban className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Cuentas Suspendidas</p>
                        <p className="text-2xl font-bold text-foreground">{equipo.filter(e => e.estado === 'Suspendido').length}</p>
                    </div>
                </div>
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
                            placeholder="Buscar vendedor por nombre o correo..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Asesor
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Cartera de Clientes
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredEquipo.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No se encontraron vendedores que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            ) : filteredEquipo.map((v) => (
                                <tr key={v.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-accent/20 text-accent">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-foreground">{v.nombre}</div>
                                                <div className="text-xs text-muted-foreground font-mono mt-0.5">{v.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{v.correo}</div>
                                        <div className="text-sm text-muted-foreground">{v.telefono}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-primary">
                                            {v.clientesAsignados} clientes
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${v.estado === 'Activo'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                            {v.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditForm(v)}
                                            className="text-muted-foreground hover:text-accent mr-3 transition-colors" title="Editar Perfil">
                                            <FileEdit className="w-4 h-4 inline" />
                                        </button>
                                        <button
                                            onClick={() => toggleEstado(v.id, v.nombre, v.estado)}
                                            className={`transition-colors ${v.estado === 'Activo' ? 'text-muted-foreground hover:text-amber-600' : 'text-amber-600 hover:text-emerald-600'}`}
                                            title={v.estado === 'Activo' ? 'Suspender Acceso' : 'Reactivar Acceso'}>
                                            <Ban className="w-4 h-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {notification && (
                <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <Shield className="w-5 h-5" />
                    {notification}
                </div>
            )}
        </div>
    );
}

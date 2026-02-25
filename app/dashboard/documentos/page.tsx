"use client";

import { useState, useEffect, Suspense } from "react";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function DocumentosContent() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [client, setClient] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlClient = searchParams.get('cliente');
        if (urlClient) {
            setClient(urlClient);
        }
    }, [searchParams]);

    const [version, setVersion] = useState("1.0");
    const [tags, setTags] = useState("");
    const [notes, setNotes] = useState("");
    const [notification, setNotification] = useState<string | null>(null);
    const [recentDocs, setRecentDocs] = useState<{ file: string, client: string, date: string, version: string, tags: string }[]>([
        {
            file: "Contrato_Poliza_XYZ.pdf",
            client: "Empresa XYZ S.A. (Persona Moral)",
            date: "24/02/2026",
            version: "1.2",
            tags: "revisado, urgente, legal"
        },
        {
            file: "Comprobante_Domicilio_Perez.jpg",
            client: "Juan Pérez (Persona Física)",
            date: "23/02/2026",
            version: "1.0",
            tags: "anexo"
        }
    ]);

    const handleSave = () => {
        setRecentDocs([{
            file: uploadedFile!,
            client: client,
            date: new Date().toLocaleDateString(),
            version: version,
            tags: tags
        }, ...recentDocs]);
        setUploadedFile(null);
        setClient("");
        setVersion("1.0");
        setTags("");
        setNotes("");
        setNotification("Documento asociado correctamente.");
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setUploadedFile(e.dataTransfer.files[0].name);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedFile(e.target.files[0].name);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Gestión Documental</h2>
                    <p className="text-muted-foreground mt-1">
                        Carga documentos y asócialos a los perfiles de los clientes.
                    </p>
                </div>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-foreground mb-4">
                    Subir Nuevo Documento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Cliente
                        </label>
                        <select
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Seleccione un cliente...</option>
                            <option value="Juan Pérez (Persona Física)">Juan Pérez (Persona Física)</option>
                            <option value="Empresa XYZ S.A. (Persona Moral)">Empresa XYZ S.A. (Persona Moral)</option>
                            <option value="Comercializadora ABC (Persona Moral)">Comercializadora ABC (Persona Moral)</option>
                        </select>

                        <label className="block text-sm font-medium text-foreground mt-4 mb-2">
                            Tipo de Documento
                        </label>
                        <select className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                            <option value="ine">Identificación Oficial (INE/Pasaporte)</option>
                            <option value="csf">Constancia de Situación Fiscal</option>
                            <option value="comprobante">Comprobante de Domicilio</option>
                            <option value="acta">Acta Constitutiva</option>
                            <option value="poliza">Contrato de Póliza Firmado</option>
                        </select>

                        <label className="block text-sm font-medium text-foreground mt-4 mb-2">
                            Versión del Documento
                        </label>
                        <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="Ej. 1.0, 2.1-borrador"
                            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Etiquetas / Metadatos (Separados por coma)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="urgente, revisión, anexo..."
                            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />

                        <label className="block text-sm font-medium text-foreground mt-4 mb-2">
                            Observaciones Internas
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Notas sobre esta versión..."
                            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        ></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Archivo
                        </label>
                        {!uploadedFile ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors relative ${isDragging
                                    ? "border-ring bg-accent/5"
                                    : "border-border bg-muted/50"
                                    }`}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
                                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                                    <p className="text-sm text-center text-muted-foreground">
                                        <span className="font-semibold text-accent hover:text-primary transition-colors">
                                            Haz clic para seleccionar
                                        </span>{" "}
                                        o arrastra y suelta
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PDF, PNG, JPG (Max. 10MB)
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div className="border border-border rounded-lg p-4 flex items-center bg-card">
                                <File className="h-8 w-8 text-primary mr-3" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {uploadedFile}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Documento listo</p>
                                </div>
                                <button
                                    onClick={() => setUploadedFile(null)}
                                    className="p-1 hover:bg-muted rounded-full"
                                >
                                    <X className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        disabled={!uploadedFile || !client}
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Guardar y Asociar
                    </button>
                </div>
            </div>

            {recentDocs.length > 0 && (
                <div className="bg-card border border-border shadow-sm rounded-lg p-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">Documentos Recientes</h3>
                    <div className="space-y-3">
                        {recentDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-border rounded flex-col sm:flex-row gap-2">
                                <div className="flex items-center gap-3 w-full">
                                    <File className="h-6 w-6 text-primary" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{doc.file}</p>
                                            <span className="text-xs font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">v{doc.version}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">Cliente ID: {doc.client} • {doc.date}</p>
                                        {doc.tags && (
                                            <div className="flex gap-1 mt-1.5">
                                                {doc.tags.split(',').map((tag, i) => (
                                                    <span key={i} className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full border border-accent/20">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap self-start sm:self-auto">
                                    Asociado
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {notification && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="w-5 h-5" />
                    {notification}
                </div>
            )}
        </div>
    );
}

export default function DocumentosPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando...</div>}>
            <DocumentosContent />
        </Suspense>
    );
}

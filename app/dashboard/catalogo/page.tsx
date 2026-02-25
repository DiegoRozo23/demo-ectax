"use client";

import { FileText, Download, Eye, Video, Plus, UploadCloud, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRole } from "../layout";

export default function CatalogoPage() {
    const { role } = useRole();
    const [isAdding, setIsAdding] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("Todos");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const [documents, setDocuments] = useState([
        {
            title: "Demostración Interactiva ECTAX",
            description: "Video tutorial del sistema ECTAX Pólizas.",
            type: "video",
            file: "demo.mp4",
        },
        {
            title: "EXTAX Quiénes somos",
            description: "Presentación corporativa y valores de la empresa.",
            type: "pdf",
            file: "Copia de 20251113 EXTAX Quiénes somos.pdf",
        },
        {
            title: "Producto ECTAX",
            description: "Detalle completo de la oferta de pólizas ECTAX.",
            type: "pdf",
            file: "Copia de 20251216 Producto ECTAX.pdf",
        },
        {
            title: "Servicios Adicionales ECTAX",
            description: "Catálogo de servicios complementarios.",
            type: "pdf",
            file: "Copia de 20260106 Servicios Adicionales ECTAX.pdf",
        },
        {
            title: "ECTAX Asociado",
            description: "Información para nuevos asociados y comisionistas.",
            type: "pdf",
            file: "Copia de 20251113 ECTAX Asociado.pdf",
        },
        {
            title: "Condiciones Generales ECTAX",
            description: "Términos legales y condiciones del servicio.",
            type: "docx",
            file: "Copia de 20241214 CONDICIONES GENERALES ECTAX.docx",
        },
        {
            title: "Datos Bancarios ECTAX",
            description: "Información para pagos y transferencias.",
            type: "pdf",
            file: "Datos Bancarios ECTAX.pdf",
        },
    ]);

    const showNotification = (msg: string) => {
        setNotification(msg);
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

    const handleAddSupport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedFile) {
            alert("Por favor selecciona un archivo.");
            return;
        }

        const extension = uploadedFile.split('.').pop()?.toLowerCase() || "pdf";
        let type = "pdf";
        if (["mp4", "mov", "avi"].includes(extension)) type = "video";
        if (["doc", "docx"].includes(extension)) type = "docx";

        const newDoc = {
            title: formData.title,
            description: formData.description,
            type: type,
            file: uploadedFile,
        };

        setDocuments([newDoc, ...documents]);
        setIsAdding(false);
        setFormData({ title: "", description: "" });
        setUploadedFile(null);
        showNotification("Soporte comercial añadido exitosamente al catálogo.");
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = category === "Todos"
            ? true
            : category === "Videos"
                ? doc.type === "video"
                : ["pdf", "docx"].includes(doc.type);

        return matchesSearch && matchesCategory;
    });

    if (isAdding && role === "Admin") {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Subir Nuevo Soporte Comercial</h2>
                        <p className="text-muted-foreground mt-1">
                            Añade presentaciones, PDFs, o videos formativos al catálogo comercial de la red de asesores.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAdding(false)}
                        className="border border-border bg-background px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        Cancelar
                    </button>
                </div>

                <div className="bg-card border border-border shadow-sm rounded-lg p-6">
                    <form className="space-y-6" onSubmit={handleAddSupport}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Título del Soporte *
                                    </label>
                                    <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Ej. Presentación Comercial Q1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Descripción Corta *
                                    </label>
                                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" placeholder="Breve descripción del objetivo de este material..." />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Archivo (PDF, Video o Documento) *
                                </label>
                                {!uploadedFile ? (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-lg p-8 h-48 flex flex-col items-center justify-center transition-colors relative ${isDragging
                                            ? "border-ring bg-accent/5"
                                            : "border-border bg-muted/50"
                                            }`}
                                    >
                                        <input
                                            type="file"
                                            id="support-upload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="support-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                                            <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                                            <p className="text-sm text-center text-muted-foreground">
                                                <span className="font-semibold text-accent hover:text-primary transition-colors">
                                                    Haz clic para seleccionar
                                                </span>{" "}
                                                o arrastra y suelta
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="border border-border rounded-lg p-4 flex items-center bg-muted/50 h-48 justify-center">
                                        <div className="text-center flex flex-col items-center">
                                            <FileText className="h-10 w-10 text-primary mb-3" />
                                            <p className="text-sm font-medium text-foreground truncate max-w-xs px-4">
                                                {uploadedFile}
                                            </p>
                                            <p className="text-xs text-emerald-600 font-medium mt-1 mb-4">Archivo listo para subir</p>

                                            <button
                                                type="button"
                                                onClick={() => setUploadedFile(null)}
                                                className="text-xs text-muted-foreground flex items-center hover:text-red-500 transition-colors"
                                            >
                                                <X className="h-3 w-3 mr-1" />
                                                Remover y seleccionar otro
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end gap-3">
                            <button
                                type="submit"
                                disabled={!uploadedFile}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <Plus className="w-4 h-4" />
                                Guardar y Publicar
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
                    <h2 className="text-2xl font-bold text-foreground">
                        Catálogo de Pólizas y Soportes Comerciales
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Visualiza y descarga el material comercial y presentaciones de las pólizas.
                    </p>
                </div>

                {role === "Admin" && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2 shrink-0">
                        <Plus className="w-4 h-4" />
                        Añadir Soporte
                    </button>
                )}
            </div>

            {/* Filtros y Buscador */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="flex bg-muted p-1 rounded-md w-full md:w-auto">
                    {["Todos", "Videos", "Documentos"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${category === cat
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Buscar por título o descripción..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.length > 0 ? filteredDocuments.map((doc, idx) => (
                    <div
                        key={idx}
                        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
                    >
                        <div className="bg-muted p-6 flex justify-center items-center h-48 border-b border-border">
                            {doc.type === "pdf" ? (
                                <FileText className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                            ) : doc.type === "video" ? (
                                <Video className="h-16 w-16 text-accent group-hover:scale-110 transition-transform" />
                            ) : (
                                <FileText className="h-16 w-16 text-secondary-foreground group-hover:scale-110 transition-transform" />
                            )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg text-foreground mb-2">
                                {doc.title}
                            </h3>
                            <p className="text-muted-foreground text-sm flex-1">
                                {doc.description}
                            </p>

                            <div className="mt-4 flex gap-3">
                                {doc.type === "pdf" && (
                                    <a
                                        href={`/documents/${doc.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2 px-4 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Ver
                                    </a>
                                )}
                                {doc.type === "video" && (
                                    <button
                                        onClick={() => setPlayingVideo(doc.file === "demo.mp4" ? `/${doc.file}` : `/documents/${doc.file}`)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Ver Video
                                    </button>
                                )}
                                <a
                                    href={`/documents/${doc.file}`}
                                    download={doc.file.replace("Copia de ", "")}
                                    className="flex-1 flex items-center justify-center gap-2 border border-border bg-background text-foreground py-2 px-4 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar
                                </a>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-12 text-center bg-card border border-border rounded-xl border-dashed">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                        <h3 className="text-lg font-medium text-foreground">No se encontraron resultados</h3>
                        <p className="text-muted-foreground mt-1">Intenta buscar con otros términos o cambia la categoría.</p>
                    </div>
                )}
            </div>

            {playingVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative bg-black rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl border border-border/50">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setPlayingVideo(null)}
                                className="bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <video
                            src={playingVideo}
                            controls
                            autoPlay
                            className="w-full h-auto max-h-[85vh] object-contain outline-none"
                        />
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

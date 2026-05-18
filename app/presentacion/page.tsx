import PdfCarousel from '../components/PdfCarousel';

export default function PresentacionPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Producto ECTAX
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explora nuestra presentación interactiva inmersiva. No necesitas descargar ningún PDF.
          </p>
        </div>

        {/* Aquí inyectamos el PDF que copiamos previamente */}
        <div className="h-[80vh] min-h-[600px]">
          <PdfCarousel pdfUrl="/documents/Copia de 20251216 Producto ECTAX.pdf" />
        </div>
      </div>
    </main>
  );
}

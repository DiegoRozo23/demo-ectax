'use client';

import dynamic from 'next/dynamic';

const PdfCarouselClient = dynamic(() => import('./PdfCarouselClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[60vh] max-w-6xl mx-auto flex items-center justify-center bg-slate-900 rounded-2xl p-4 shadow-2xl">
      <div className="text-white text-center animate-pulse flex flex-col items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-presentation"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
        <span className="text-xl">Iniciando Presentación Interactiva...</span>
      </div>
    </div>
  )
});

export default function PdfCarousel({ pdfUrl }: { pdfUrl: string }) {
  return <PdfCarouselClient pdfUrl={pdfUrl} />;
}

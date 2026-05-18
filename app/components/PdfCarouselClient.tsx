'use client';
import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Keyboard } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import { Swiper as SwiperClass } from 'swiper/types';

// Usamos el worker de unpkg para evitar problemas de compilación en Next.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfCarousel({ pdfUrl }: { pdfUrl: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfConstraint, setPdfConstraint] = useState<{ width?: number, height?: number }>({ height: 600 });
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ajustar el tamaño del PDF dinámicamente según la proporción de la pantalla
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Margen responsivo: menos margen lateral en móviles
      const marginX = w < 640 ? 0.95 : 0.85; 
      const marginY = w < 640 ? 0.85 : 0.90;
      
      const availableW = w * marginX;
      const availableH = h * marginY;
      
      // Proporción aproximada de una presentación estándar (16:9 = ~1.77)
      const screenRatio = availableW / availableH;
      const estimatedPdfRatio = 16 / 9;

      if (screenRatio < estimatedPdfRatio) {
        // Pantalla más estrecha que la presentación (ej. celular vertical)
        // Restringimos por ANCHO
        setPdfConstraint({ width: Math.max(availableW, 250) });
      } else {
        // Pantalla más ancha (ej. laptop/desktop)
        // Restringimos por ALTO
        setPdfConstraint({ height: Math.max(availableH, 300) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Escuchar las flechas del teclado globalmente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!swiperInstance) return;
      if (e.key === 'ArrowRight') swiperInstance.slideNext();
      if (e.key === 'ArrowLeft') swiperInstance.slidePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [swiperInstance]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col justify-center items-center overflow-hidden">

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="text-white text-center py-20 animate-pulse">Cargando diapositivas...</div>}
        className="flex justify-center"
      >
        {numPages > 0 && (
          <>
            {/* Flecha Izquierda */}
            <button 
              onClick={() => swiperInstance?.slidePrev()}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[60] bg-black/30 hover:bg-black/50 sm:bg-white/10 sm:hover:bg-white/20 text-white p-2 sm:p-4 rounded-full backdrop-blur-md shadow-2xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-12 sm:h-12"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            {/* Flecha Derecha */}
            <button 
              onClick={() => swiperInstance?.slideNext()}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[60] bg-black/30 hover:bg-black/50 sm:bg-white/10 sm:hover:bg-white/20 text-white p-2 sm:p-4 rounded-full backdrop-blur-md shadow-2xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-12 sm:h-12"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <Swiper
              onSwiper={setSwiperInstance}
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              keyboard={{ enabled: false }}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={false}
              modules={[EffectCoverflow, Pagination, Navigation, Keyboard]}
              className="w-full h-full flex items-center justify-center"
            >
            {Array.from(new Array(numPages), (el, index) => (
              <SwiperSlide key={`page_${index + 1}`} className="!w-auto flex items-center justify-center transition-transform">
                <div className="shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-white rounded-lg overflow-hidden">
                  <Page
                    pageNumber={index + 1}
                    width={pdfConstraint.width}
                    height={pdfConstraint.height}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="select-none pointer-events-none"
                  />
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
          </>
        )}
      </Document>

    </div>
  );
}

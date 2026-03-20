'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FRAME_COUNT = 114;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Section 1: Intro (0% to 20%)
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);

  // Section 2: Expertise (20% to 50%)
  const y2 = useTransform(scrollYProgress, [0.2, 0.35, 0.5], [50, 0, -50]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.35, 0.5], [0, 1, 0]);

  // Section 3: Vision (50% to 80%)
  const y3 = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [50, 0, -50]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0, 1, 0]);

  // Section 4: Down arrow (80% to 100%)
  const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 0]);

  // Load images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const num = i.toString().padStart(4, '0');
      img.src = `/sequence/frame_${num}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
          // Only render initial frame if user is at the top of this section
          renderFrame(0, loadedImages); 
        }
      };
      loadedImages.push(img);
    }
  }, []);

  const renderFrame = (frameIndex: number, imgs: HTMLImageElement[]) => {
    if (!canvasRef.current || !imgs[frameIndex]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgs[frameIndex];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const imageAspectRatio = img.width / img.height;
    const canvasAspectRatio = canvas.width / canvas.height;

    let renderWidth = canvas.width;
    let renderHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspectRatio > canvasAspectRatio) {
      renderWidth = canvas.height * imageAspectRatio;
      offsetX = (canvas.width - renderWidth) / 2;
    } else {
      renderHeight = canvas.width / imageAspectRatio;
      offsetY = (canvas.height - renderHeight) / 2;
    }

    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  };

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (images.length === FRAME_COUNT) {
        let frameIndex = Math.floor(latest * FRAME_COUNT);
        if (frameIndex >= FRAME_COUNT) frameIndex = FRAME_COUNT - 1;
        requestAnimationFrame(() => renderFrame(frameIndex, images));
      }
    });
  }, [scrollYProgress, images]);

  useEffect(() => {
    const handleResize = () => {
      if (images.length === FRAME_COUNT) {
        let frameIndex = Math.floor(scrollYProgress.get() * FRAME_COUNT);
        if (frameIndex >= FRAME_COUNT) frameIndex = FRAME_COUNT - 1;
        renderFrame(frameIndex, images);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, scrollYProgress]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Canvas Render */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />
        
        {/* Dark Gradient Overlay for Contrast */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-0 bg-[#0a0a0a]/20 pointer-events-none" />
        
        {/* Overlay Layers inside sticky container */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Section 1 */}
          <motion.div
            style={{ y: y1, opacity: opacity1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-center text-white drop-shadow-2xl">
              Abhishek K<span className="text-blue-500">.</span>
            </h1>
            <p className="text-xl md:text-3xl mt-6 text-white/90 font-light tracking-wide drop-shadow-lg">
              Creative Developer & UI Designer.
            </p>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div 
            style={{ opacity: opacity1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="text-blue-500/70" size={24} />
            </motion.div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            style={{ y: y2, opacity: opacity2 }}
            className="absolute inset-0 flex flex-col items-start justify-center px-10 md:px-24"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold max-w-4xl leading-tight text-white drop-shadow-2xl">
              I build <span className="text-blue-400">high-performance</span>
              <br className="hidden md:block"/> digital experiences.
            </h2>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            style={{ y: y3, opacity: opacity3 }}
            className="absolute inset-0 flex flex-col items-end justify-center px-10 md:px-24 text-right"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold max-w-4xl leading-tight text-white drop-shadow-2xl">
              Bridging design <br className="hidden md:block"/> and <span className="text-purple-400">engineering.</span>
            </h2>
          </motion.div>
          
          {/* Section 4 */}
          <motion.div
            style={{ opacity: opacity4 }}
            className="absolute bottom-[10vh] left-0 right-0 flex justify-center"
          >
            <p className="text-sm uppercase tracking-widest text-white/60 drop-shadow-lg animate-pulse">
              Explore my work
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

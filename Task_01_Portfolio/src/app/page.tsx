'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ScrollyCanvas from '@/components/ScrollyCanvas';
import Intro from '@/components/Intro';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const canvasScale = useTransform(scrollYProgress, [0.8, 1], [1, 0.9]);
  const canvasZ = useTransform(scrollYProgress, [0.8, 1], [0, -200]);
  const canvasOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <main className="relative bg-[#0a0a0a]">
      <Navbar />
      
      <motion.div 
        id="home" 
        className="relative"
        style={{
          scale: canvasScale,
          z: canvasZ,
          opacity: canvasOpacity,
          transformStyle: "preserve-3d"
        }}
      >
        <ScrollyCanvas />
      </motion.div>

      <Intro />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}

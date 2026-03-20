'use client';

import { motion } from 'framer-motion';

export default function Intro() {
  return (
    <section id="intro" className="relative z-20 bg-[#0a0a0a] py-32 md:py-48 px-6 flex items-center justify-center border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white/90 leading-snug"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          I am a specialized developer obsessed with creating 
          <span className="text-white font-bold block mt-2 text-glow">fast, beautiful, and highly interactive</span> 
          digital experiences on the web.
        </motion.h2>
      </div>
    </section>
  );
}

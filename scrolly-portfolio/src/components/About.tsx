'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="relative z-20 bg-[#121212] py-32 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
        
        {/* Visual / Illustration Placeholder */}
        <motion.div 
          className="w-full md:w-1/2 aspect-square max-w-md mx-auto rounded-3xl glass flex items-center justify-center overflow-hidden relative border border-white/10"
          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
        >
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none z-10" />
          <Image 
            src="/profile.jpg"
            alt="Abhishek K."
            fill
            className="object-cover opacity-100"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Text Area */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col justify-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-blue-500 font-semibold tracking-[0.2em] uppercase text-sm mb-4">About Me</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-white/90">
            Developer / CS Student
          </h2>
          
          <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed">
            <p>
              I am a Computer Science student and a passionate developer with a strong focus on 
              <span className="text-white/90 font-medium"> modern web architecture </span> 
              and <span className="text-white/90 font-medium">AI tools integration</span>.
            </p>
            <p>
              My approach blends technical precision with high-end aesthetic sensibilities. 
              I believe great software isn&apos;t just functional; it leverages clean code, 
              robust performance fundamentals, and butter-smooth micro-interactions to deliver 
              client-ready, premium digital products.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

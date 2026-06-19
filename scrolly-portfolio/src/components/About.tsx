'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { premiumEase } from '@/lib/animations';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: premiumEase } 
  }
};

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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants} className="text-blue-500 font-semibold tracking-[0.2em] uppercase text-sm mb-4">About Me</motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-white/90">
            Developer / CSBS Student
          </motion.h2>
          
          <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed mb-10">
            <motion.p variants={itemVariants}>
              I am a Computer Science and Business Systems (CSBS) student, interested and enthusiastic about building modern <span className="text-blue-400 font-medium drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">tech-stack websites</span> and integrating <span className="text-blue-400 font-medium drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">AI/ML</span> models into real-world applications.
            </motion.p>
            <motion.p variants={itemVariants}>
              I am currently learning AI/ML and continuously exploring new technologies as a passionate tech enthusiast. My goal is to build clean, scalable, and high-performance digital products.
            </motion.p>
            <motion.p variants={itemVariants}>
              I also have experience working with simple <span className="text-blue-400 font-medium drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">backend systems</span> and API integrations, enabling me to create complete and functional web solutions.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <a 
              href="mailto:kokkiligaddaabhishek2006@gmail.com"
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium tracking-wide hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
              Email Me
            </a>
            <a 
              href="https://www.linkedin.com/in/abhishek-k-891683326/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white/10 text-white font-medium tracking-wide border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
            >
              View LinkedIn
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

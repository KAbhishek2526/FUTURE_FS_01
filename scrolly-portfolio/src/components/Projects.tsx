'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'E-commerce Intelligence',
    category: 'SaaS / Dashboard',
    desc: 'B2B analytics platform built with Next.js and Tailwind CSS featuring dynamic data visualization.',
    demo: '#',
    github: 'https://github.com/KAbhishek2526',
  },
  {
    id: 2,
    title: 'Restaurant Experience',
    category: 'Web Design',
    desc: 'An elegant, responsive marketing site for a fine dining restaurant with reservation workflows.',
    demo: '#',
    github: 'https://github.com/KAbhishek2526',
  },
  {
    id: 3,
    title: 'Creative Agency Site',
    category: 'Motion UI',
    desc: 'Award-winning portfolio featuring WebGL, custom cursor interactions, and page transitions.',
    demo: '#',
    github: 'https://github.com/KAbhishek2526',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative z-20 bg-[#121212] pt-12 pb-32 px-6 md:px-12 lg:px-24 border-t border-white/5">
      {/* Subtle top gradient transition */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#121212]/0 to-[#121212] pointer-events-none -translate-y-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            Selected <span className="text-blue-500">Work.</span>
          </motion.h2>
          <motion.p 
            className="text-white/60 text-lg md:text-xl max-w-2xl font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A collection of recent projects focusing on exceptional user experiences, 
            performance, and modern web architecture.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass p-8 rounded-[2rem] group flex flex-col justify-between h-full transform transition-all duration-300 hover:scale-[1.02] glow-blue"
            >
              <div>
                <div className="w-full aspect-video rounded-xl bg-white/5 mb-8 overflow-hidden relative border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Placeholder for project image */}
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    Image
                  </div>
                </div>
                
                <div className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase mb-4">
                  {project.category}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white/90 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  {project.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto">
                <a 
                  href={project.demo} 
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 text-white text-sm font-medium px-5 py-2.5 rounded-full backdrop-blur-md"
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
                <a 
                  href={project.github} 
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 text-white/80 hover:text-white text-sm font-medium px-5 py-2.5 rounded-full"
                >
                  <Github size={16} /> Source
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

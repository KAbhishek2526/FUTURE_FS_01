'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { premiumEase } from '@/lib/animations';
import MagneticButton from '@/components/MagneticButton';

const projects = [
  {
    id: 1,
    title: 'PocketM – Student Micro-Earning Platform',
    category: 'Product / FinTech',
    desc: (
      <div className="space-y-3 text-white/80">
        <p>
          PocketM is a campus-centric micro-earning platform tailored for college students to monetize their skills and free time.
        </p>
        <p>
          The app enables students to find and complete <strong className="text-blue-400 font-bold tracking-wide">on-campus micro-gigs</strong>, peer-to-peer services, and local tasks safely.
        </p>
        <p>
          By introducing a peer-trusted verification system, PocketM fosters a <strong className="text-blue-400 font-bold tracking-wide">secure network</strong> where students can earn, collaborate, and build their professional resume.
        </p>
      </div>
    ),
    shortDesc: 'A student-focused platform designed to help students earn money by completing structured tasks on campus.',
    tags: ['React Native', 'On-Campus Gigs', 'FinTech', 'Student Network'],
    image: '/microtask.png',
    demo: '#',
    github: 'https://github.com/KAbhishek2526/PocketM',
    featured: true,
  },
  {
    id: 2,
    title: 'AyuraBlend – Full-Stack E-Commerce Ecosystem',
    category: 'Full-Stack / E-Commerce',
    desc: (
      <div className="space-y-3 text-white/80">
        <p>
          AyuraBlend is a production-ready, scalable e-commerce ecosystem built for a premium herbal wellness startup, bridging the gap between customer storefronts and backend operations.
        </p>
        <p>
          Features a metrics-driven admin command center, <strong className="text-blue-400 font-bold tracking-wide">secure Razorpay checkout</strong>, and an automated WhatsApp logistics notification engine.
        </p>
        <p>
          Engineered with production-level CORS security middleware, a resilient server-side caching layer, and a <strong className="text-blue-400 font-bold tracking-wide">dynamic production-aware URL switcher</strong>.
        </p>
      </div>
    ),
    shortDesc: 'A scalable, full-stack e-commerce ecosystem for a premium herbal wellness startup featuring secure payments, automated logistics, and a metrics dashboard.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'Razorpay', 'WhatsApp API'],
    image: '/ayurablend.png',
    demo: 'https://ayurblend-storefront.vercel.app',
    github: 'https://github.com/KAbhishek2526/AyuraBlend',
  },
  {
    id: 3,
    title: 'OurMagic – Valentine\'s Day Special',
    category: 'Creative UI / Animation',
    desc: (
      <div className="space-y-3 text-white/80">
        <p>
          OurMagic is a highly personalized, password-protected digital experience designed as an interactive tribute journey.
        </p>
        <p>
          Features a dynamic twinkling starfield background, <strong className="text-blue-400 font-bold tracking-wide">custom interactive authorization</strong>, and reactive verification feedback.
        </p>
        <p>
          Built using complex Framer Motion transitions, responsive flex layouts, and optimized assets to create a seamless romantic narrative.
        </p>
      </div>
    ),
    shortDesc: 'A highly personalized, password-protected digital experience with custom interactive animations and a romantic narrative.',
    tags: ['Framer Motion', 'Interactive UI', 'Web Art', 'TailwindCSS'],
    image: '/ourmagic.png',
    demo: 'https://our-magic.vercel.app/',
    github: 'https://github.com/KAbhishek2526/OurMagic/blob/main/README.md',
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

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } }
              }}
              className={`glass p-8 rounded-[2rem] group flex flex-col justify-between h-full transform duration-300 hover-glow ${project.featured ? 'ring-[1.5px] ring-blue-500/50 bg-gradient-to-b from-blue-500/[0.05] to-transparent shadow-[0_8px_32px_rgba(59,130,246,0.1)]' : ''}`}
            >
              <div>
                <div className="w-full aspect-video rounded-xl bg-white/5 mb-8 overflow-hidden relative border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      Image
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
                    {project.category}
                  </div>
                  {project.tags && project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded-full bg-white/5 text-white/70 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white/90 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <div className="text-white/60 text-sm leading-relaxed mb-8">
                  {project.desc}
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-auto">
                <MagneticButton 
                  href={project.demo}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-full backdrop-blur-md transition-colors"
                >
                  <ExternalLink size={16} /> Live Demo
                </MagneticButton>
                <MagneticButton 
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                >
                  <Github size={16} /> Source
                </MagneticButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

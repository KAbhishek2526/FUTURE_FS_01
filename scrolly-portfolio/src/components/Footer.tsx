export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#0a0a0a] border-t border-white/5 py-12 px-6 md:px-12 lg:px-24">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-white/40">
        <p>© {new Date().getFullYear()} Abhishek K. All rights reserved.</p>
        
        <div className="flex items-center gap-6 mt-6 md:mt-0">
          <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
          <a href="#services" className="hover:text-blue-400 transition-colors">Services</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import logoImg from '../../assets/ayur_blend_logo.png';

export default function Footer() {
  return (
    <footer className="bg-primary text-bg py-12 px-8 text-center mt-auto flex flex-col items-center">
      <img src={logoImg} alt="AyuraBlend Logo" className="h-12 w-12 object-contain rounded-full mb-4 bg-white p-0.5" />
      <div className="font-serif text-2xl mb-6">AyuraBlend</div>
      <div className="flex gap-6 mb-8 text-primary-content">
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
        <a href="#" className="hover:text-white transition-colors">Facebook</a>
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
      </div>
      <p className="text-sm opacity-80">&copy; 2026 AyuraBlend. All rights reserved.</p>
    </footer>
  );
}

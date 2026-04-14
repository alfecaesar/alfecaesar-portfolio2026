import { useLayoutEffect, useRef, useState } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import type { Page } from '../types';
import gsap from 'gsap';

interface NavProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const links: { label: string; page: Page }[] = [
  { label: 'About', page: 'about' },
  { label: 'Portfolio', page: 'portfolio' },
  { label: 'History', page: 'history' },
  { label: 'Contact', page: 'contact' },
];

export default function Nav({ currentPage, navigate }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !navRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-nav-item]',
        { y: -10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
      );
    }, navRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleNav = (page: Page) => {
    navigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/85 backdrop-blur-md border-b border-white/5 theme-line">
      <nav className="max-w-5xl mx-auto px-5 sm:px-6 flex items-center justify-between h-16">
        <button
          data-nav-item
          onClick={() => handleNav('about')}
          className="flex items-center gap-2 theme-text-strong font-semibold tracking-wide hover:text-sky-400 transition-colors duration-200"
        >
          <Code2 size={20} className="text-sky-400" />
          <span className="text-[13px] sm:text-sm uppercase tracking-widest">Alfe Caesar</span>
        </button>

        <ul className="hidden md:flex items-center gap-2">
          {links.map(({ label, page }) => (
            <li key={page}>
              <button
                data-nav-item
                onClick={() => handleNav(page)}
                className={`px-4 py-2.5 text-[13px] sm:text-sm tracking-wide rounded-full transition-colors duration-200 ${
                  currentPage === page
                    ? 'text-sky-300 bg-sky-400/15 border border-sky-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0d0d0d]">
          <ul className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map(({ label, page }) => (
              <li key={page}>
                <button
                  onClick={() => handleNav(page)}
                  className={`w-full text-left px-4 py-3.5 text-[13px] tracking-wide rounded-xl transition-colors duration-200 ${
                    currentPage === page
                      ? 'text-sky-400 bg-sky-400/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

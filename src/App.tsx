import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import type { Page } from './types';

const validPages: Page[] = ['about', 'portfolio', 'history', 'contact', 'admin'];

function getInitialPage(): Page {
  const hash = window.location.hash.replace('#', '') as Page;
  return validPages.includes(hash) ? hash : 'about';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen theme-bg theme-text-body font-sans antialiased selection:bg-sky-400/30 selection:text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.08),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(56,189,248,0.05),transparent_28%)]" />
      <button
        type="button"
        onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        className="fixed right-2 sm:right-3 top-1/2 -translate-y-1/2 z-[60] p-2.5 rounded-l-xl rounded-r-md border border-white/15 bg-[#0d0d0d]/80 backdrop-blur-sm text-sky-300 hover:text-sky-200 hover:border-sky-300/40 transition-colors duration-200"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <Nav currentPage={currentPage} navigate={navigate} />
      <main className="relative">
        {currentPage === 'about' && <About />}
        {currentPage === 'portfolio' && <Portfolio />}
        {currentPage === 'history' && <History />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'admin' && <Admin />}
      </main>
      <Footer />
    </div>
  );
}

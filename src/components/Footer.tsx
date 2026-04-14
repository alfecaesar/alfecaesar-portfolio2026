import { Github, Mail, Sparkles } from 'lucide-react';
import { profile } from '../data/resume';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0d0d0d]/70 mt-24 backdrop-blur-sm theme-line">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-9 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5">
        <p className="theme-text-muted text-[13px] sm:text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-[11px] sm:text-xs theme-surface theme-text-muted">
          <Sparkles size={12} className="text-sky-400/80" />
          Built with React, Tailwind and Supabase
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-gray-500 hover:text-sky-300 hover:border-sky-400/30 transition-colors duration-200"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-gray-500 hover:text-sky-300 hover:border-sky-400/30 transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

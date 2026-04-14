import { ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../lib/siteData';
import { usePageAnimations } from '../lib/usePageAnimations';

export default function Portfolio() {
  const { data, isLoading } = useSiteData();
  const { portfolioItems } = data;
  const rootRef = usePageAnimations<HTMLDivElement>();

  return (
    <div ref={rootRef} className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <section data-animate className="relative py-14 md:py-16 overflow-hidden">
          <p className="text-sky-400 text-[11px] sm:text-xs tracking-[0.2em] uppercase mb-3">Selected projects</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold theme-text-strong mb-4">Portfolio</h1>
          <p className="theme-text-body max-w-xl text-[15px] sm:text-base">
            A collection of projects I have built and supported. Each card links to a live site.
          </p>
        </section>

        <div className="w-full h-px bg-white/5 mb-12" />

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading portfolio...</p>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {portfolioItems.map((item) => (
              <article
                key={item.id}
                data-animate
                data-hover-lift
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] theme-surface hover:border-sky-400/30 transition-colors duration-200"
              >
                <a href={item.siteUrl} target="_blank" rel="noopener noreferrer" className="block relative">
                  <img
                    src={item.thumbnailUrl}
                    alt={`${item.title} thumbnail`}
                    className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/70 via-transparent to-transparent opacity-70" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0d0d0d]/70 border border-white/10 text-sky-300">
                    <Sparkles size={12} />
                    Featured
                  </span>
                </a>
                <div className="p-4 sm:p-4.5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="theme-text-strong text-[15px] sm:text-base font-medium">{item.title}</h2>
                    <ArrowUpRight size={15} className="text-sky-400/70 mt-0.5" />
                  </div>
                  {item.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-1 rounded-full text-[11px] border border-white/10 bg-white/5 theme-text-body"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                  <a
                    href={item.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] sm:text-sm text-sky-300 px-3.5 py-2 rounded-full border border-sky-400/30 bg-sky-400/10 hover:bg-sky-400/20 transition-colors duration-200"
                  >
                    Visit site
                    <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

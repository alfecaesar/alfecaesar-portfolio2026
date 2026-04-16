import { ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSiteData } from '../lib/siteData';
import { usePageAnimations } from '../lib/usePageAnimations';

export default function Portfolio() {
  const { data, isLoading } = useSiteData();
  const { portfolioItems } = data;
  const rootRef = usePageAnimations<HTMLDivElement>();
  const animationDurationMs = 280;
  const frameRefs = useRef<Record<string, number>>({});
  const timeoutRefs = useRef<Record<string, number>>({});
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [itemPhases, setItemPhases] = useState<Record<string, 'hidden' | 'entering' | 'visible' | 'exiting'>>({});

  const allTools = useMemo(
    () => Array.from(new Set(portfolioItems.flatMap((item) => item.tools))).sort((a, b) => a.localeCompare(b)),
    [portfolioItems],
  );

  const matchesActiveTools = useCallback(
    (itemTools: string[]) => activeTool === null || itemTools.includes(activeTool),
    [activeTool],
  );

  const selectTool = (tool: string) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  useEffect(() => {
    setItemPhases(
      Object.fromEntries(
        portfolioItems.map((item) => [item.id, matchesActiveTools(item.tools) ? 'visible' : 'hidden']),
      ) as Record<string, 'hidden' | 'entering' | 'visible' | 'exiting'>,
    );
  }, [portfolioItems, matchesActiveTools]);

  useEffect(() => {
    setItemPhases((prev) => {
      const next = { ...prev };
      for (const item of portfolioItems) {
        const id = item.id;
        const shouldShow = matchesActiveTools(item.tools);
        const current = next[id] ?? 'hidden';

        if (shouldShow && (current === 'hidden' || current === 'exiting')) {
          next[id] = 'entering';
        } else if (!shouldShow && (current === 'visible' || current === 'entering')) {
          next[id] = 'exiting';
        }
      }
      return next;
    });
  }, [portfolioItems, matchesActiveTools]);

  useEffect(() => {
    for (const item of portfolioItems) {
      const id = item.id;
      const phase = itemPhases[id];

      if (phase === 'entering') {
        if (frameRefs.current[id]) {
          cancelAnimationFrame(frameRefs.current[id]);
        }
        frameRefs.current[id] = requestAnimationFrame(() => {
          setItemPhases((prev) => (prev[id] === 'entering' ? { ...prev, [id]: 'visible' } : prev));
        });
      }

      if (phase === 'exiting') {
        if (timeoutRefs.current[id]) {
          clearTimeout(timeoutRefs.current[id]);
        }
        timeoutRefs.current[id] = window.setTimeout(() => {
          setItemPhases((prev) => (prev[id] === 'exiting' ? { ...prev, [id]: 'hidden' } : prev));
        }, animationDurationMs);
      }
    }

    return () => {
      for (const frameId of Object.values(frameRefs.current)) {
        cancelAnimationFrame(frameId);
      }
      for (const timeoutId of Object.values(timeoutRefs.current)) {
        clearTimeout(timeoutId);
      }
      frameRefs.current = {};
      timeoutRefs.current = {};
    };
  }, [itemPhases, portfolioItems]);

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
          <>
            <section data-animate className="mb-8">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-sky-300/90 mb-3">Tools</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors duration-200 ${
                    activeTool === null
                      ? 'bg-sky-400/20 border-sky-400/50 theme-text-strong font-semibold'
                      : 'border-white/15 text-gray-300 hover:border-sky-400/30 hover:text-sky-200'
                  }`}
                >
                  All
                </button>
                {allTools.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => selectTool(tool)}
                    className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors duration-200 ${
                      activeTool === tool
                      ? 'bg-sky-400/20 border-sky-400/50 theme-text-strong font-semibold'
                        : 'border-white/15 text-gray-300 hover:border-sky-400/30 hover:text-sky-200'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </section>

            <section className="portfolio-grid-focus grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {portfolioItems.map((item) => {
                const phase = itemPhases[item.id] ?? 'hidden';
                if (phase === 'hidden') {
                  return null;
                }

                return (
                  <article
                    key={item.id}
                    data-animate
                    data-hover-lift
                    className={`portfolio-focus-card group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] theme-surface hover:border-sky-400/40 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.28),0_20px_38px_rgba(56,189,248,0.12)] transition-all duration-300 ease-out ${
                      phase === 'visible' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'
                    }`}
                  >
                    <a href={item.siteUrl} target="_blank" rel="noopener noreferrer" className="block relative">
                      <div className="relative overflow-hidden">
                        <img
                          src={item.thumbnailUrl}
                          alt={`${item.title} thumbnail`}
                          className="block w-full aspect-[16/10] object-cover portfolio-thumb-slow-zoom group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute -inset-px pointer-events-none bg-gradient-to-t from-[#0d0d0d]/80 via-[#0d0d0d]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#0d0d0d]/80 pointer-events-none" />
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0d0d0d]/70 border border-white/10 text-sky-300">
                          <Sparkles size={12} />
                          Featured
                        </span>
                      </div>
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
                        Visit
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

import { MapPin, Calendar, GraduationCap, Briefcase, Milestone, Building2 } from 'lucide-react';
import { useSiteData } from '../lib/siteData';
import { usePageAnimations } from '../lib/usePageAnimations';

export default function History() {
  const { data } = useSiteData();
  const { experience, education } = data;
  const rootRef = usePageAnimations<HTMLDivElement>();

  return (
    <div ref={rootRef} className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <section data-animate className="relative py-14 md:py-16 overflow-hidden">
          <p className="text-sky-400 text-[11px] sm:text-xs tracking-[0.2em] uppercase mb-3">Career timeline</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold theme-text-strong mb-4">History</h1>
          <p className="theme-text-body max-w-xl text-[15px] sm:text-base">
            A full account of my professional journey — from web developer to Shopify and WordPress specialist.
          </p>
        </section>

        <div className="w-full h-px bg-white/5 mb-16" />

        <section data-animate className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <Briefcase size={16} className="text-sky-400" />
            <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-sky-400">Work Experience</h2>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5" />

            <div className="flex flex-col gap-0">
              {experience.map((job, index) => (
                <div key={index} data-hover-lift className="relative pl-8 pb-12 last:pb-0 group">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-sky-400/40 group-hover:bg-sky-400 transition-colors duration-300 -translate-x-[3px]" />

                  <div className="p-5 sm:p-6 rounded-xl border border-white/5 bg-white/[0.02] theme-surface hover:border-sky-400/10 hover:bg-white/[0.03] transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="flex gap-5">
                        <h3 className="theme-text-strong font-semibold text-[15px] sm:text-base mb-1 inline-flex items-center gap-2">
                          <Milestone size={14} className="text-sky-400/80" />
                          {job.role}
                        </h3>
                        <p className="text-sky-400/80 text-[13px] sm:text-sm font-medium inline-flex items-center gap-2">
                          <Building2 size={13} />
                          {job.company}
                        </p>
                      </div>
                      {job.current && (
                        <span className="flex items-center gap-1.5 text-xs text-sky-400 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-[11px] sm:text-xs theme-text-muted mb-5">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {job.period}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        {job.location}
                      </span>
                    </div>

                    <ul className="flex flex-col gap-2">
                      {job.responsibilities.map((item, i) => (
                        <li key={i} className="text-[13px] sm:text-sm theme-text-body leading-relaxed flex gap-3">
                          <span className="w-1 h-1 rounded-full bg-sky-400/40 mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-white/5 mb-16" />

        <section data-animate>
          <div className="flex items-center gap-3 mb-10">
            <GraduationCap size={16} className="text-sky-400" />
            <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-sky-400">Education</h2>
          </div>

          <div className="flex flex-col gap-4">
            {education.map((edu, index) => (
              <div
                key={index}
                data-hover-lift
                className="p-5 sm:p-6 rounded-xl border border-white/5 bg-white/[0.02] theme-surface hover:border-sky-400/10 transition-all duration-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="theme-text-strong font-medium text-[15px] sm:text-base mb-1">{edu.degree}</h3>
                    <p className="theme-text-body text-[13px] sm:text-sm mb-1">{edu.school}</p>
                    <p className="theme-text-muted text-[11px] sm:text-xs flex items-center gap-1.5">
                      <MapPin size={10} />
                      {edu.location}
                    </p>
                  </div>
                  <span className="text-[11px] sm:text-xs text-sky-400/70 shrink-0 flex items-center gap-1.5">
                    <Calendar size={11} />
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

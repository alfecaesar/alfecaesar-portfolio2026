import { Github, Mail, Phone, MapPin, ExternalLink, Briefcase, Rocket, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useSiteData } from '../lib/siteData';
import { usePageAnimations } from '../lib/usePageAnimations';

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-lg border border-white/5 bg-white/[0.02]">
      <span className="text-[13px] sm:text-sm text-gray-400 w-40 sm:w-44 shrink-0">{name}</span>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < level ? 'bg-sky-400' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function About() {
  const { data } = useSiteData();
  const { profile, skills, cms, languages, techExpertise, profileBadges } = data;
  const rootRef = usePageAnimations<HTMLDivElement>();

  return (
    <div ref={rootRef} className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <section data-animate className="relative min-h-[58vh] md:min-h-[60vh] flex flex-col justify-center py-14 md:py-16 overflow-hidden">

          <p className="text-sky-400 text-[11px] sm:text-xs tracking-[0.2em] uppercase mb-4">Hello, I am</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold theme-text-strong leading-tight mb-4">
            {profile.name}
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl theme-text-muted font-light mb-7 md:mb-8">{profile.title}</h2>
          <p className="theme-text-body max-w-2xl leading-relaxed text-[15px] sm:text-base mb-9 md:mb-10">
            {profile.summary}
          </p>

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-9 md:mb-10 max-w-3xl">
            <div data-hover-lift className="p-4 sm:p-4.5 rounded-xl border border-white/10 bg-white/[0.03] theme-surface-soft">
              <Briefcase size={16} className="text-sky-400 mb-2" />
              <p className="theme-text-strong text-sm font-medium">15+ Years Experience</p>
              <p className="text-xs theme-text-muted mt-1">Web, Shopify, WordPress</p>
            </div>
            <div data-hover-lift className="p-4 sm:p-4.5 rounded-xl border border-white/10 bg-white/[0.03] theme-surface-soft">
              <Rocket size={16} className="text-sky-400 mb-2" />
              <p className="theme-text-strong text-sm font-medium">Performance Focused</p>
              <p className="text-xs theme-text-muted mt-1">Fast, scalable front-end</p>
            </div>
            <div data-hover-lift className="p-4 sm:p-4.5 rounded-xl border border-white/10 bg-white/[0.03] theme-surface-soft">
              <ShieldCheck size={16} className="text-sky-400 mb-2" />
              <p className="theme-text-strong text-sm font-medium">Production Ready</p>
              <p className="text-xs theme-text-muted mt-1">Testing and stability first</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-9 md:mb-10">
            <a
              href={`mailto:${profile.email}`}
              data-hover-lift
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-sky-400 text-[#0d0d0d] text-[13px] sm:text-sm font-semibold rounded-xl hover:bg-sky-300 transition-colors duration-200"
            >
              <Mail size={15} />
              Get In Touch
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-hover-lift
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border border-white/10 text-gray-300 text-[13px] sm:text-sm font-medium rounded-xl hover:border-sky-400/50 hover:text-sky-400 transition-colors duration-200"
            >
              <Github size={15} />
              GitHub
            </a>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-[13px] sm:text-sm theme-text-muted">
            <span className="flex items-center gap-2">
              <Mail size={14} className="text-sky-400/70" />
              {profile.email}
            </span>
            <span className="flex items-center gap-2">
              <Phone size={14} className="text-sky-400/70" />
              {profile.phone}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-sky-400/70" />
              {profile.location}
            </span>
          </div>
        </section>

        <div className="w-full h-px bg-white/5 mb-16" />

        <section data-animate className="mb-16">
          <h3 className="text-xs uppercase tracking-widest text-sky-400 mb-8 inline-flex items-center gap-2">
            <BadgeCheck size={14} />
            Verified Badges
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileBadges.map((badge) => (
              <a
                key={badge.id}
                href={badge.credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-hover-lift
                className="p-4 rounded-xl border border-white/10 bg-white/[0.02] theme-surface hover:border-sky-400/20 transition-colors duration-200"
              >
                <img
                  src={badge.imageUrl}
                  alt={badge.title}
                  className="w-50 h-50 object-contain mb-3"
                  loading="lazy"
                />
                <p className="text-[13px] sm:text-sm theme-text-strong leading-snug">{badge.title}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-xs text-sky-300">
                  View on Credly
                  <ExternalLink size={12} />
                </span>
              </a>
            ))}
          </div>
        </section>

        <div className="w-full h-px bg-white/5 mb-16" />

        <section data-animate className="mb-16">
          <h3 className="text-xs uppercase tracking-widest text-sky-400 mb-8">Technical Skills</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} />
            ))}
          </div>
        </section>

        <div className="w-full h-px bg-white/5 mb-16" />

        <section data-animate className="mb-16">
          <h3 className="text-xs uppercase tracking-widest text-sky-400 mb-8">Technical Expertise</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {techExpertise.map(({ category, items }) => (
              <div key={category} data-hover-lift className="p-6 rounded-xl border border-white/5 bg-white/[0.02] theme-surface">
                <h4 className="theme-text-strong font-medium mb-4">{category}</h4>
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item} className="text-sm theme-text-muted flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-sky-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full h-px bg-white/5 mb-16" />

        <div className="grid md:grid-cols-2 gap-16">
          <section data-animate>
            <h3 className="text-xs uppercase tracking-widest text-sky-400 mb-8">CMS Platforms</h3>
            <div className="flex flex-wrap gap-3">
              {cms.map((platform) => (
                <span
                  key={platform}
                  className="px-4 py-2 text-sm theme-text-body border border-white/10 rounded theme-surface hover:border-sky-400/30 hover:text-sky-300 transition-colors duration-200"
                >
                  {platform}
                </span>
              ))}
            </div>
          </section>

          <section data-animate>
            <h3 className="text-xs uppercase tracking-widest text-sky-400 mb-8">Languages</h3>
            <div className="flex flex-col gap-4">
              {languages.map((lang) => (
                <SkillBar key={lang.name} name={lang.name} level={lang.level} />
              ))}
            </div>
          </section>
        </div>

        <div className="w-full h-px bg-white/5 my-16 hidden" />

        <section data-animate className="hidden">
          <h3 className="text-xs uppercase tracking-widest text-sky-400 mb-8">Online Profile</h3>
          <a
            href={profile.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 theme-text-body hover:text-sky-400 transition-colors duration-200 text-sm"
          >
            <ExternalLink size={14} />
            {profile.portfolioUrl}
          </a>
        </section>
      </div>
    </div>
  );
}

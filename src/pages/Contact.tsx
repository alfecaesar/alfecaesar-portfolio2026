import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Github, Send, User, MessageSquareQuote } from 'lucide-react';
import { useSiteData } from '../lib/siteData';
import { usePageAnimations } from '../lib/usePageAnimations';
import { useForm } from '@formspree/react';

export default function Contact() {
  const { data } = useSiteData();
  const { profile, references } = data;
  const rootRef = usePageAnimations<HTMLDivElement>();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [state, handleSubmit] = useForm("xvzdgkjl");

  useEffect(() => {
    if (state.succeeded) {
      setSubmitted(true);
    }
  }, [state.succeeded]);

  return (
    <div ref={rootRef} className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <section data-animate className="relative py-14 md:py-16 overflow-hidden">
          <p className="text-sky-400 text-[11px] sm:text-xs tracking-[0.2em] uppercase mb-3">Let's talk</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold theme-text-strong mb-4">Contact Me</h1>
          <p className="theme-text-body max-w-xl text-[15px] sm:text-base">
            Have a project in mind or want to discuss an opportunity? Reach out — I'd love to hear from you.
          </p>
        </section>

        <div className="w-full h-px bg-white/5 mb-16" />

        <div data-animate className="grid md:grid-cols-2 gap-12 md:gap-16 mb-20">
          <div data-animate>
            <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-sky-400 mb-7 md:mb-8">Get In Touch</h2>
            <div className="flex flex-col gap-5 mb-10">
              <a
                href={`mailto:${profile.email}`}
                data-hover-lift
                className="flex items-center gap-4 theme-text-body hover:text-sky-400 transition-colors duration-200 group p-3.5 rounded-xl border border-white/5 theme-surface hover:border-sky-400/20"
              >
                <span className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-sky-400/30 transition-colors duration-200">
                  <Mail size={16} />
                </span>
                <div>
                  <p className="text-[11px] sm:text-xs theme-text-muted mb-0.5">Email</p>
                  <p className="text-[13px] sm:text-sm">{profile.email}</p>
                </div>
              </a>

              <div data-hover-lift className="flex items-center gap-4 theme-text-body p-3.5 rounded-xl border border-white/5 theme-surface hover:border-sky-400/20 transition-colors duration-200">
                <span className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-[11px] sm:text-xs theme-text-muted mb-0.5">Phone</p>
                  <p className="text-[13px] sm:text-sm">{profile.phone}</p>
                </div>
              </div>

              <div data-hover-lift className="flex items-center gap-4 theme-text-body p-3.5 rounded-xl border border-white/5 theme-surface hover:border-sky-400/20 transition-colors duration-200">
                <span className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin size={16} />
                </span>
                <div>
                  <p className="text-[11px] sm:text-xs theme-text-muted mb-0.5">Location</p>
                  <p className="text-[13px] sm:text-sm">{profile.location}</p>
                </div>
              </div>

              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-hover-lift
                className="flex items-center gap-4 theme-text-body hover:text-sky-400 transition-colors duration-200 group p-3.5 rounded-xl border border-white/5 theme-surface hover:border-sky-400/20"
              >
                <span className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-sky-400/30 transition-colors duration-200">
                  <Github size={16} />
                </span>
                <div>
                  <p className="text-[11px] sm:text-xs theme-text-muted mb-0.5">GitHub</p>
                  <p className="text-[13px] sm:text-sm">@{profile.github}</p>
                </div>
              </a>
            </div>
          </div>

          <div data-animate>
            <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-sky-400 mb-7 md:mb-8">Send a Message</h2>
            {submitted ? (
              <div className="p-6 rounded-lg border border-sky-400/20 bg-sky-400/5 text-center">
                <p className="text-sky-400 font-medium mb-2">Thank you for your message!</p>
                <p className="text-gray-500 text-sm">Your inquiry has been successfully sent, and I’ll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form method="POST" action="https://formspree.io/f/xvzdgkjl" onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] theme-surface">
                <div>
                  <label htmlFor="name" className="block text-[11px] sm:text-xs theme-text-muted uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[13px] sm:text-sm theme-text-strong placeholder-gray-700 focus:outline-none focus:border-sky-400/40 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] sm:text-xs theme-text-muted uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[13px] sm:text-sm theme-text-strong placeholder-gray-700 focus:outline-none focus:border-sky-400/40 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-[11px] sm:text-xs theme-text-muted uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[13px] sm:text-sm theme-text-strong placeholder-gray-700 focus:outline-none focus:border-sky-400/40 focus:bg-white/[0.07] transition-all duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  data-hover-lift
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-400 text-[#0d0d0d] text-[13px] sm:text-sm font-semibold rounded-xl hover:bg-sky-300 transition-colors duration-200 mt-2"
                >
                  <Send size={14} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-white/5 mb-16" />

        <section data-animate>
          <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-sky-400 mb-8 inline-flex items-center gap-2">
            <MessageSquareQuote size={14} />
            References
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {references.map((ref, index) => (
              <div
                key={index}
                data-hover-lift
                className="p-5 sm:p-5.5 rounded-xl border border-white/5 bg-white/[0.02] theme-surface hover:border-sky-400/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User size={14} className="text-sky-400/70" />
                  </span>
                  <div>
                    <p className="theme-text-strong text-[13px] sm:text-sm font-medium leading-tight">{ref.name}</p>
                    <p className="text-sky-400/60 text-xs">{ref.company}</p>
                  </div>
                </div>
                <a
                  href={`mailto:${ref.email}`}
                  className="text-[11px] sm:text-xs theme-text-muted hover:text-sky-400 transition-colors duration-200 break-all"
                >
                  {ref.email}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

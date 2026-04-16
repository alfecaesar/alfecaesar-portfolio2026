import { useEffect, useMemo, useState } from 'react';
import { LogIn, LogOut, Plus, Save, Trash2, Loader2, CheckCircle2, AlertCircle, GripVertical } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type ProfileForm = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  github_url: string;
  portfolio_url: string;
  summary: string;
};

type PortfolioFormItem = {
  id: string;
  display_order: number;
  title: string;
  site_url: string;
  thumbnail_url: string;
  tech_stack_text: string;
};

type ExperienceFormItem = {
  display_order: number;
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  responsibilities_text: string;
};

type EducationFormItem = {
  display_order: number;
  degree: string;
  school: string;
  period: string;
  location: string;
};

type SkillFormItem = {
  display_order: number;
  name: string;
  level: number;
};

type CmsFormItem = {
  display_order: number;
  name: string;
};

type LanguageFormItem = {
  display_order: number;
  name: string;
  level: number;
};

type ReferenceFormItem = {
  display_order: number;
  name: string;
  company: string;
  email: string;
};

type ExpertiseFormItem = {
  display_order: number;
  category: string;
  items_text: string;
};

type ProfileBadgeFormItem = {
  id: string;
  display_order: number;
  title: string;
  image_url: string;
  credly_url: string;
};

const inputClass =
  'w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-200 placeholder-gray-700 focus:outline-none focus:border-sky-400/40';

const sectionClass = 'p-5 rounded-lg border border-white/10 bg-white/[0.02]';

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState<{ text: string; kind: 'success' | 'error' | 'info' } | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    github_url: '',
    portfolio_url: '',
    summary: '',
  });
  const [portfolioForm, setPortfolioForm] = useState<PortfolioFormItem[]>([]);
  const [experienceForm, setExperienceForm] = useState<ExperienceFormItem[]>([]);
  const [educationForm, setEducationForm] = useState<EducationFormItem[]>([]);
  const [skillsForm, setSkillsForm] = useState<SkillFormItem[]>([]);
  const [cmsForm, setCmsForm] = useState<CmsFormItem[]>([]);
  const [languagesForm, setLanguagesForm] = useState<LanguageFormItem[]>([]);
  const [referencesForm, setReferencesForm] = useState<ReferenceFormItem[]>([]);
  const [expertiseForm, setExpertiseForm] = useState<ExpertiseFormItem[]>([]);
  const [profileBadgesForm, setProfileBadgesForm] = useState<ProfileBadgeFormItem[]>([]);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const isConfigured = useMemo(() => Boolean(supabase), []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => setSession(currentSession));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(text: string, kind: 'success' | 'error' | 'info' = 'success') {
    setToast({ text, kind });
  }

  function normalizeDisplayOrder<T extends { display_order: number }>(items: T[]): T[] {
    return items.map((item, index) => ({ ...item, display_order: index + 1 }));
  }

  function moveItem<T extends { display_order: number }>(items: T[], fromIndex: number, toIndex: number): T[] {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
      return items;
    }
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return normalizeDisplayOrder(next);
  }

  function onDragStart(sectionKey: string, index: number) {
    setDraggingKey(`${sectionKey}-${index}`);
    setDragOverKey(`${sectionKey}-${index}`);
  }

  function onDragEnd() {
    setDraggingKey(null);
    setDragOverKey(null);
  }

  function onDropReorder<T extends { display_order: number }>(
    e: React.DragEvent<HTMLElement>,
    sectionKey: string,
    dropIndex: number,
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
  ) {
    e.preventDefault();
    const dragPayload = e.dataTransfer.getData('text/plain');
    const [dragSection, dragIndexRaw] = dragPayload.split(':');
    if (dragSection !== sectionKey) return;
    const dragIndex = Number(dragIndexRaw);
    if (Number.isNaN(dragIndex)) return;
    setItems(moveItem(items, dragIndex, dropIndex));
    setDraggingKey(null);
    setDragOverKey(null);
  }

  function onDragOverReorder(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function onDragEnterReorder(sectionKey: string, index: number) {
    setDragOverKey(`${sectionKey}-${index}`);
  }

  function getDragVisualClass(sectionKey: string, index: number) {
    const idleClass = 'border-white/10';
    if (!draggingKey) {
      return idleClass;
    }

    const dragSeparator = draggingKey.lastIndexOf('-');
    if (dragSeparator < 0) {
      return idleClass;
    }
    const draggingSection = draggingKey.slice(0, dragSeparator);
    const draggingIndex = Number(draggingKey.slice(dragSeparator + 1));
    if (Number.isNaN(draggingIndex) || draggingSection !== sectionKey) {
      return idleClass;
    }

    const overSeparator = dragOverKey?.lastIndexOf('-') ?? -1;
    const dragOverSection = overSeparator >= 0 && dragOverKey ? dragOverKey.slice(0, overSeparator) : null;
    const dragOverIndex =
      overSeparator >= 0 && dragOverKey ? Number(dragOverKey.slice(overSeparator + 1)) : draggingIndex;

    if (index === draggingIndex) {
      return 'border-sky-400/70 opacity-75 scale-[0.975] rotate-[0.2deg] shadow-[0_14px_35px_rgba(56,189,248,0.2)]';
    }

    if (dragOverSection !== sectionKey || Number.isNaN(dragOverIndex)) {
      return idleClass;
    }

    if (index === dragOverIndex) {
      return 'border-sky-300/60 bg-sky-500/[0.12] scale-[1.01] shadow-[0_8px_24px_rgba(56,189,248,0.18)] animate-pulse';
    }

    if (draggingIndex < dragOverIndex && index > draggingIndex && index <= dragOverIndex) {
      return 'border-white/10 -translate-y-3 scale-[0.995]';
    }

    if (draggingIndex > dragOverIndex && index >= dragOverIndex && index < draggingIndex) {
      return 'border-white/10 translate-y-3 scale-[0.995]';
    }

    return idleClass;
  }

  function getDragTransitionStyle() {
    return {
      transitionDuration: '320ms',
      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      willChange: 'transform, opacity, box-shadow, border-color, background-color',
    } as const;
  }

  async function loadData() {
    if (!supabase) return;
    setIsLoading(true);
    setMessage('');

    const [
      profileRes,
      portfolioRes,
      experienceRes,
      educationRes,
      skillsRes,
      cmsRes,
      languagesRes,
      referencesRes,
      expertiseRes,
      badgesRes,
    ] = await Promise.all([
      supabase.from('profile').select('name,title,email,phone,location,github,github_url,portfolio_url,summary').eq('id', 'main').maybeSingle(),
      supabase.from('portfolio_items').select('id,display_order,title,site_url,thumbnail_url,tech_stack').order('display_order', { ascending: true }),
      supabase.from('experience').select('display_order,company,role,period,location,current,responsibilities').order('display_order', { ascending: true }),
      supabase.from('education').select('display_order,degree,school,period,location').order('display_order', { ascending: true }),
      supabase.from('skills').select('display_order,name,level').order('display_order', { ascending: true }),
      supabase.from('cms_platforms').select('display_order,name').order('display_order', { ascending: true }),
      supabase.from('languages').select('display_order,name,level').order('display_order', { ascending: true }),
      supabase.from('references_contacts').select('display_order,name,company,email').order('display_order', { ascending: true }),
      supabase.from('technical_expertise').select('display_order,category,items').order('display_order', { ascending: true }),
      supabase.from('profile_badges').select('id,display_order,title,image_url,credly_url').order('display_order', { ascending: true }),
    ]);

    const errors = [
      profileRes.error,
      portfolioRes.error,
      experienceRes.error,
      educationRes.error,
      skillsRes.error,
      cmsRes.error,
      languagesRes.error,
      referencesRes.error,
      expertiseRes.error,
      badgesRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      setMessage(errors[0]?.message ?? 'Failed loading admin data.');
      showToast(errors[0]?.message ?? 'Failed loading admin data.', 'error');
      setIsLoading(false);
      return;
    }

    setProfileForm({
      name: profileRes.data?.name ?? '',
      title: profileRes.data?.title ?? '',
      email: profileRes.data?.email ?? '',
      phone: profileRes.data?.phone ?? '',
      location: profileRes.data?.location ?? '',
      github: profileRes.data?.github ?? '',
      github_url: profileRes.data?.github_url ?? '',
      portfolio_url: profileRes.data?.portfolio_url ?? '',
      summary: profileRes.data?.summary ?? '',
    });
    setPortfolioForm(
      (((portfolioRes.data as Array<Omit<PortfolioFormItem, 'tech_stack_text'> & { tech_stack: string[] }>) ?? []).map((item) => ({
        ...item,
        tech_stack_text: (item.tech_stack ?? []).join(', '),
      }))),
    );
    setExperienceForm(
      (((experienceRes.data as Array<Omit<ExperienceFormItem, 'responsibilities_text'> & { responsibilities: string[] }>) ?? []).map((item) => ({
        ...item,
        responsibilities_text: (item.responsibilities ?? []).join('\n'),
      }))),
    );
    setEducationForm((educationRes.data as EducationFormItem[]) ?? []);
    setSkillsForm((skillsRes.data as SkillFormItem[]) ?? []);
    setCmsForm((cmsRes.data as CmsFormItem[]) ?? []);
    setLanguagesForm((languagesRes.data as LanguageFormItem[]) ?? []);
    setReferencesForm((referencesRes.data as ReferenceFormItem[]) ?? []);
    setExpertiseForm(
      (((expertiseRes.data as Array<Omit<ExpertiseFormItem, 'items_text'> & { items: string[] }>) ?? []).map((item) => ({
        ...item,
        items_text: (item.items ?? []).join('\n'),
      }))),
    );
    setProfileBadgesForm((badgesRes.data as ProfileBadgeFormItem[]) ?? []);

    setIsLoading(false);
    setMessage('Data loaded.');
    showToast('Data loaded.', 'info');
  }

  useEffect(() => {
    if (session) void loadData();
  }, [session]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
      return;
    }
    setPassword('');
    showToast('Signed in successfully.', 'success');
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage('Logged out.');
    showToast('Signed out.', 'info');
  }

  async function saveSingle(tableKey: string, saveFn: () => Promise<void>) {
    setIsSaving(tableKey);
    setMessage('');
    try {
      await saveFn();
      setMessage(`${tableKey} saved.`);
      showToast(`${tableKey} saved successfully.`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`Save failed for ${tableKey}: ${msg}`);
      showToast(`Save failed for ${tableKey}: ${msg}`, 'error');
    } finally {
      setIsSaving(null);
    }
  }

  function SaveActionButton({
    tableKey,
    label,
    onClick,
  }: {
    tableKey: string;
    label: string;
    onClick: () => void;
  }) {
    const saving = isSaving === tableKey;
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 bg-sky-400 text-[#0d0d0d] text-xs font-semibold rounded hover:bg-sky-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
      >
        {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
        {saving ? 'Saving...' : label}
      </button>
    );
  }

  async function saveProfile() {
    if (!supabase) return;
    const client = supabase;
    await saveSingle('profile', async () => {
      const { error } = await client.from('profile').upsert({ id: 'main', ...profileForm }, { onConflict: 'id' });
      if (error) throw error;
    });
  }

  async function replaceRows(table: string, rows: Record<string, unknown>[]) {
    if (!supabase) return;
    const client = supabase;
    const { error: deleteError } = await client.from(table).delete().not('display_order', 'is', null);
    if (deleteError) throw deleteError;
    if (rows.length === 0) return;
    const { error: insertError } = await client.from(table).insert(rows);
    if (insertError) throw insertError;
  }

  async function savePortfolio() {
    if (!supabase) return;
    const client = supabase;
    await saveSingle('portfolio_items', async () => {
      const normalized = normalizeDisplayOrder(
        portfolioForm.map((item) => ({
          id: item.id.trim(),
          display_order: item.display_order,
          title: item.title.trim(),
          site_url: item.site_url.trim(),
          thumbnail_url: item.thumbnail_url.trim(),
          tech_stack: item.tech_stack_text
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean),
        })),
      );
      if (normalized.some((x) => !x.id || !x.title || !x.site_url || !x.thumbnail_url)) {
        throw new Error('All fields are required.');
      }
      const { error: deleteError } = await client.from('portfolio_items').delete().not('id', 'is', null);
      if (deleteError) throw deleteError;
      if (normalized.length > 0) {
        const { error } = await client.from('portfolio_items').insert(normalized);
        if (error) throw error;
      }
      setPortfolioForm(
        normalized.map((item) => ({
          id: item.id,
          display_order: item.display_order,
          title: item.title,
          site_url: item.site_url,
          thumbnail_url: item.thumbnail_url,
          tech_stack_text: (item.tech_stack as string[]).join(', '),
        })),
      );
    });
  }

  async function saveExperience() {
    if (!supabase) return;
    await saveSingle('experience', async () => {
      const normalized = normalizeDisplayOrder(experienceForm).map((item) => ({
        display_order: item.display_order,
        company: item.company.trim(),
        role: item.role.trim(),
        period: item.period.trim(),
        location: item.location.trim(),
        current: item.current,
        responsibilities: item.responsibilities_text.split('\n').map((x) => x.trim()).filter(Boolean),
      }));
      await replaceRows('experience', normalized);
      setExperienceForm(normalizeDisplayOrder(experienceForm));
    });
  }

  async function saveEducation() {
    if (!supabase) return;
    await saveSingle('education', async () => {
      const normalized = normalizeDisplayOrder(educationForm);
      await replaceRows('education', normalized);
      setEducationForm(normalized);
    });
  }

  async function saveSkills() {
    if (!supabase) return;
    await saveSingle('skills', async () => {
      const normalized = normalizeDisplayOrder(skillsForm).map((item) => ({ ...item, level: Math.min(5, Math.max(1, item.level)) }));
      await replaceRows('skills', normalized);
      setSkillsForm(normalized);
    });
  }

  async function saveCms() {
    if (!supabase) return;
    await saveSingle('cms_platforms', async () => {
      const normalized = normalizeDisplayOrder(cmsForm);
      await replaceRows('cms_platforms', normalized);
      setCmsForm(normalized);
    });
  }

  async function saveLanguages() {
    if (!supabase) return;
    await saveSingle('languages', async () => {
      const normalized = normalizeDisplayOrder(languagesForm).map((item) => ({ ...item, level: Math.min(5, Math.max(1, item.level)) }));
      await replaceRows('languages', normalized);
      setLanguagesForm(normalized);
    });
  }

  async function saveReferences() {
    if (!supabase) return;
    await saveSingle('references_contacts', async () => {
      const normalized = normalizeDisplayOrder(referencesForm);
      await replaceRows('references_contacts', normalized);
      setReferencesForm(normalized);
    });
  }

  async function saveExpertise() {
    if (!supabase) return;
    await saveSingle('technical_expertise', async () => {
      const normalized = normalizeDisplayOrder(expertiseForm).map((item) => ({
        display_order: item.display_order,
        category: item.category.trim(),
        items: item.items_text.split('\n').map((x) => x.trim()).filter(Boolean),
      }));
      await replaceRows('technical_expertise', normalized);
      setExpertiseForm(normalizeDisplayOrder(expertiseForm));
    });
  }

  async function saveProfileBadges() {
    if (!supabase) return;
    const client = supabase;
    await saveSingle('profile_badges', async () => {
      const normalized = normalizeDisplayOrder(
        profileBadgesForm.map((item) => ({
          ...item,
          id: item.id.trim(),
          title: item.title.trim(),
          image_url: item.image_url.trim(),
          credly_url: item.credly_url.trim(),
        })),
      );
      if (normalized.some((x) => !x.id || !x.title || !x.image_url || !x.credly_url)) {
        throw new Error('All badge fields are required.');
      }
      const { error: deleteError } = await client.from('profile_badges').delete().not('id', 'is', null);
      if (deleteError) throw deleteError;
      if (normalized.length > 0) {
        const { error } = await client.from('profile_badges').insert(normalized);
        if (error) throw error;
      }
      setProfileBadgesForm(normalized);
    });
  }

  if (!isConfigured) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-4">Admin</h1>
          <p className="text-gray-400">Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to use this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <section className="py-10">
          <p className="text-sky-400 text-sm tracking-widest uppercase mb-3">Restricted area</p>
          <h1 className="text-4xl font-bold text-white mb-3">Admin</h1>
          <p className="text-gray-500 text-sm">Use `#admin` route. Writes are protected by Supabase Auth + RLS policies.</p>
        </section>

        <div className="w-full h-px bg-white/5 mb-10" />

        {!session ? (
          <form onSubmit={handleLogin} className="max-w-md flex flex-col gap-4">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-sky-400/40" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-sky-400/40" />
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-400 text-[#0d0d0d] text-sm font-semibold rounded hover:bg-sky-300 transition-colors duration-200">
              <LogIn size={14} />
              Sign In
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-400">Signed in as {session.user.email}</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => void loadData()} className="px-4 py-2 border border-white/10 text-gray-300 text-sm rounded hover:border-sky-400/40 hover:text-sky-300 transition-colors duration-200">Reload</button>
              <button type="button" onClick={() => void handleLogout()} className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-gray-300 text-sm rounded hover:border-sky-400/40 hover:text-sky-300 transition-colors duration-200">
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {message && <p className="text-sm text-sky-300 mb-6">{message}</p>}
        {isLoading && <p className="text-sm text-gray-500 mb-6">Loading data...</p>}

        {session && !isLoading && (
          <div className="flex flex-col gap-8">
            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-base font-medium">Profile</h2>
                <SaveActionButton tableKey="profile" label="Save Profile" onClick={() => void saveProfile()} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className={inputClass} />
                <input value={profileForm.title} onChange={(e) => setProfileForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className={inputClass} />
                <input value={profileForm.email} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className={inputClass} />
                <input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className={inputClass} />
                <input value={profileForm.location} onChange={(e) => setProfileForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className={`${inputClass} sm:col-span-2`} />
                <input value={profileForm.github} onChange={(e) => setProfileForm((p) => ({ ...p, github: e.target.value }))} placeholder="GitHub username" className={inputClass} />
                <input value={profileForm.github_url} onChange={(e) => setProfileForm((p) => ({ ...p, github_url: e.target.value }))} placeholder="GitHub URL" className={inputClass} />
                <input value={profileForm.portfolio_url} onChange={(e) => setProfileForm((p) => ({ ...p, portfolio_url: e.target.value }))} placeholder="Portfolio URL" className={`${inputClass} sm:col-span-2`} />
                <textarea value={profileForm.summary} onChange={(e) => setProfileForm((p) => ({ ...p, summary: e.target.value }))} rows={5} placeholder="Summary" className={`${inputClass} sm:col-span-2`} />
              </div>
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-base font-medium">Portfolio</h2>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setPortfolioForm((p) => [...p, { id: `project-${Date.now()}`, display_order: p.length + 1, title: '', site_url: '', thumbnail_url: '', tech_stack_text: '' }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40">
                    <Plus size={13} /> Add Item
                  </button>
                  <SaveActionButton tableKey="portfolio_items" label="Save Portfolio" onClick={() => void savePortfolio()} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {portfolioForm.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', `portfolio:${index}`);
                      onDragStart('portfolio', index);
                    }}
                    onDragOver={onDragOverReorder}
                    onDragEnter={() => onDragEnterReorder('portfolio', index)}
                    onDrop={(e) => onDropReorder(e, 'portfolio', index, portfolioForm, setPortfolioForm)}
                    onDragEnd={onDragEnd}
                    className={`p-4 rounded border theme-surface-soft ${getDragVisualClass('portfolio', index)}`}
                    style={getDragTransitionStyle()}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical size={12} />
                        Reorder
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={item.id} onChange={(e) => setPortfolioForm((p) => p.map((x, i) => (i === index ? { ...x, id: e.target.value } : x)))} placeholder="Stable ID" className={inputClass} />
                      <input value={item.title} onChange={(e) => setPortfolioForm((p) => p.map((x, i) => (i === index ? { ...x, title: e.target.value } : x)))} placeholder="Title" className={inputClass} />
                      <input value={item.site_url} onChange={(e) => setPortfolioForm((p) => p.map((x, i) => (i === index ? { ...x, site_url: e.target.value } : x)))} placeholder="Site URL" className={inputClass} />
                      <input value={item.thumbnail_url} onChange={(e) => setPortfolioForm((p) => p.map((x, i) => (i === index ? { ...x, thumbnail_url: e.target.value } : x)))} placeholder="Thumbnail URL" className={inputClass} />
                      <input
                        value={item.tech_stack_text}
                        onChange={(e) => setPortfolioForm((p) => p.map((x, i) => (i === index ? { ...x, tech_stack_text: e.target.value } : x)))}
                        placeholder="Tools/CMS (comma separated)"
                        className={`${inputClass} sm:col-span-2`}
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button type="button" onClick={() => setPortfolioForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-base font-medium">Experience</h2>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setExperienceForm((p) => [...p, { display_order: p.length + 1, company: '', role: '', period: '', location: '', current: false, responsibilities_text: '' }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"><Plus size={13} /> Add</button>
                  <SaveActionButton tableKey="experience" label="Save" onClick={() => void saveExperience()} />
                </div>
              </div>
              {experienceForm.map((item, index) => (
                <div
                  key={`exp-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `experience:${index}`);
                    onDragStart('experience', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('experience', index)}
                  onDrop={(e) => onDropReorder(e, 'experience', index, experienceForm, setExperienceForm)}
                  onDragEnd={onDragEnd}
                  className={`p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('experience', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input value={item.company} onChange={(e) => setExperienceForm((p) => p.map((x, i) => (i === index ? { ...x, company: e.target.value } : x)))} placeholder="Company" className={inputClass} />
                    <input value={item.role} onChange={(e) => setExperienceForm((p) => p.map((x, i) => (i === index ? { ...x, role: e.target.value } : x)))} placeholder="Role" className={inputClass} />
                    <input value={item.period} onChange={(e) => setExperienceForm((p) => p.map((x, i) => (i === index ? { ...x, period: e.target.value } : x)))} placeholder="Period" className={inputClass} />
                    <input value={item.location} onChange={(e) => setExperienceForm((p) => p.map((x, i) => (i === index ? { ...x, location: e.target.value } : x)))} placeholder="Location" className={inputClass} />
                    <label className="text-xs text-gray-300 flex items-center gap-2 sm:col-span-2"><input type="checkbox" checked={item.current} onChange={(e) => setExperienceForm((p) => p.map((x, i) => (i === index ? { ...x, current: e.target.checked } : x)))} /> Current role</label>
                    <textarea value={item.responsibilities_text} onChange={(e) => setExperienceForm((p) => p.map((x, i) => (i === index ? { ...x, responsibilities_text: e.target.value } : x)))} rows={4} placeholder="Responsibilities (one per line)" className={`${inputClass} sm:col-span-2`} />
                  </div>
                  <div className="mt-3 flex justify-end"><button type="button" onClick={() => setExperienceForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"><Trash2 size={12} /> Remove</button></div>
                </div>
              ))}
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-white text-base font-medium">Education</h2><div className="flex gap-2"><button type="button" onClick={() => setEducationForm((p) => [...p, { display_order: p.length + 1, degree: '', school: '', period: '', location: '' }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"><Plus size={13} /> Add</button><SaveActionButton tableKey="education" label="Save" onClick={() => void saveEducation()} /></div></div>
              {educationForm.map((item, index) => (
                <div
                  key={`edu-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `education:${index}`);
                    onDragStart('education', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('education', index)}
                  onDrop={(e) => onDropReorder(e, 'education', index, educationForm, setEducationForm)}
                  onDragEnd={onDragEnd}
                  className={`grid sm:grid-cols-2 gap-3 p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('education', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="sm:col-span-2 mb-1 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <input value={item.degree} onChange={(e) => setEducationForm((p) => p.map((x, i) => (i === index ? { ...x, degree: e.target.value } : x)))} placeholder="Degree" className={inputClass} />
                  <input value={item.school} onChange={(e) => setEducationForm((p) => p.map((x, i) => (i === index ? { ...x, school: e.target.value } : x)))} placeholder="School" className={inputClass} />
                  <input value={item.period} onChange={(e) => setEducationForm((p) => p.map((x, i) => (i === index ? { ...x, period: e.target.value } : x)))} placeholder="Period" className={inputClass} />
                  <input value={item.location} onChange={(e) => setEducationForm((p) => p.map((x, i) => (i === index ? { ...x, location: e.target.value } : x)))} placeholder="Location" className={inputClass} />
                  <div className="sm:col-span-2 flex justify-end"><button type="button" onClick={() => setEducationForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"><Trash2 size={12} /> Remove</button></div>
                </div>
              ))}
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-white text-base font-medium">Skills</h2><div className="flex gap-2"><button type="button" onClick={() => setSkillsForm((p) => [...p, { display_order: p.length + 1, name: '', level: 3 }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"><Plus size={13} /> Add</button><SaveActionButton tableKey="skills" label="Save" onClick={() => void saveSkills()} /></div></div>
              {skillsForm.map((item, index) => (
                <div
                  key={`skill-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `skills:${index}`);
                    onDragStart('skills', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('skills', index)}
                  onDrop={(e) => onDropReorder(e, 'skills', index, skillsForm, setSkillsForm)}
                  onDragEnd={onDragEnd}
                  className={`grid grid-cols-[1fr_auto_auto] gap-3 p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('skills', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="col-span-3 mb-1 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <input value={item.name} onChange={(e) => setSkillsForm((p) => p.map((x, i) => (i === index ? { ...x, name: e.target.value } : x)))} placeholder="Skill name" className={inputClass} />
                  <input type="number" min={1} max={5} value={item.level} onChange={(e) => setSkillsForm((p) => p.map((x, i) => (i === index ? { ...x, level: Number(e.target.value) || 1 } : x)))} className={`${inputClass} w-20`} />
                  <button type="button" onClick={() => setSkillsForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"><Trash2 size={12} /></button>
                </div>
              ))}
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-white text-base font-medium">CMS Platforms</h2><div className="flex gap-2"><button type="button" onClick={() => setCmsForm((p) => [...p, { display_order: p.length + 1, name: '' }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"><Plus size={13} /> Add</button><SaveActionButton tableKey="cms_platforms" label="Save" onClick={() => void saveCms()} /></div></div>
              {cmsForm.map((item, index) => (
                <div
                  key={`cms-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `cms:${index}`);
                    onDragStart('cms', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('cms', index)}
                  onDrop={(e) => onDropReorder(e, 'cms', index, cmsForm, setCmsForm)}
                  onDragEnd={onDragEnd}
                  className={`grid grid-cols-[1fr_auto] gap-3 p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('cms', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="col-span-2 mb-1 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <input value={item.name} onChange={(e) => setCmsForm((p) => p.map((x, i) => (i === index ? { ...x, name: e.target.value } : x)))} placeholder="Platform name" className={inputClass} />
                  <button type="button" onClick={() => setCmsForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"><Trash2 size={12} /></button>
                </div>
              ))}
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-white text-base font-medium">Languages</h2><div className="flex gap-2"><button type="button" onClick={() => setLanguagesForm((p) => [...p, { display_order: p.length + 1, name: '', level: 3 }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"><Plus size={13} /> Add</button><SaveActionButton tableKey="languages" label="Save" onClick={() => void saveLanguages()} /></div></div>
              {languagesForm.map((item, index) => (
                <div
                  key={`lang-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `languages:${index}`);
                    onDragStart('languages', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('languages', index)}
                  onDrop={(e) => onDropReorder(e, 'languages', index, languagesForm, setLanguagesForm)}
                  onDragEnd={onDragEnd}
                  className={`grid grid-cols-[1fr_auto_auto] gap-3 p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('languages', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="col-span-3 mb-1 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <input value={item.name} onChange={(e) => setLanguagesForm((p) => p.map((x, i) => (i === index ? { ...x, name: e.target.value } : x)))} placeholder="Language" className={inputClass} />
                  <input type="number" min={1} max={5} value={item.level} onChange={(e) => setLanguagesForm((p) => p.map((x, i) => (i === index ? { ...x, level: Number(e.target.value) || 1 } : x)))} className={`${inputClass} w-20`} />
                  <button type="button" onClick={() => setLanguagesForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"><Trash2 size={12} /></button>
                </div>
              ))}
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-white text-base font-medium">References</h2><div className="flex gap-2"><button type="button" onClick={() => setReferencesForm((p) => [...p, { display_order: p.length + 1, name: '', company: '', email: '' }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"><Plus size={13} /> Add</button><SaveActionButton tableKey="references_contacts" label="Save" onClick={() => void saveReferences()} /></div></div>
              {referencesForm.map((item, index) => (
                <div
                  key={`ref-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `references:${index}`);
                    onDragStart('references', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('references', index)}
                  onDrop={(e) => onDropReorder(e, 'references', index, referencesForm, setReferencesForm)}
                  onDragEnd={onDragEnd}
                  className={`grid sm:grid-cols-3 gap-3 p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('references', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="sm:col-span-3 mb-1 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <input value={item.name} onChange={(e) => setReferencesForm((p) => p.map((x, i) => (i === index ? { ...x, name: e.target.value } : x)))} placeholder="Name" className={inputClass} />
                  <input value={item.company} onChange={(e) => setReferencesForm((p) => p.map((x, i) => (i === index ? { ...x, company: e.target.value } : x)))} placeholder="Company" className={inputClass} />
                  <input value={item.email} onChange={(e) => setReferencesForm((p) => p.map((x, i) => (i === index ? { ...x, email: e.target.value } : x)))} placeholder="Email" className={inputClass} />
                  <div className="sm:col-span-3 flex justify-end"><button type="button" onClick={() => setReferencesForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"><Trash2 size={12} /> Remove</button></div>
                </div>
              ))}
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-white text-base font-medium">Technical Expertise</h2><div className="flex gap-2"><button type="button" onClick={() => setExpertiseForm((p) => [...p, { display_order: p.length + 1, category: '', items_text: '' }])} className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"><Plus size={13} /> Add</button><SaveActionButton tableKey="technical_expertise" label="Save" onClick={() => void saveExpertise()} /></div></div>
              {expertiseForm.map((item, index) => (
                <div
                  key={`expx-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `expertise:${index}`);
                    onDragStart('expertise', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('expertise', index)}
                  onDrop={(e) => onDropReorder(e, 'expertise', index, expertiseForm, setExpertiseForm)}
                  onDragEnd={onDragEnd}
                  className={`grid sm:grid-cols-2 gap-3 p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('expertise', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="sm:col-span-2 mb-1 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <input value={item.category} onChange={(e) => setExpertiseForm((p) => p.map((x, i) => (i === index ? { ...x, category: e.target.value } : x)))} placeholder="Category" className={inputClass} />
                  <div className="sm:col-span-1 flex justify-end"><button type="button" onClick={() => setExpertiseForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"><Trash2 size={12} /> Remove</button></div>
                  <textarea value={item.items_text} onChange={(e) => setExpertiseForm((p) => p.map((x, i) => (i === index ? { ...x, items_text: e.target.value } : x)))} rows={4} placeholder="Items (one per line)" className={`${inputClass} sm:col-span-2`} />
                </div>
              ))}
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-base font-medium">Profile Badges</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setProfileBadgesForm((p) => [
                        ...p,
                        {
                          id: `badge-${Date.now()}`,
                          display_order: p.length + 1,
                          title: '',
                          image_url: '',
                          credly_url: '',
                        },
                      ])
                    }
                    className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-200 text-xs rounded hover:border-sky-400/40"
                  >
                    <Plus size={13} /> Add
                  </button>
                  <SaveActionButton tableKey="profile_badges" label="Save" onClick={() => void saveProfileBadges()} />
                </div>
              </div>
              {profileBadgesForm.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `badges:${index}`);
                    onDragStart('badges', index);
                  }}
                  onDragOver={onDragOverReorder}
                  onDragEnter={() => onDragEnterReorder('badges', index)}
                  onDrop={(e) => onDropReorder(e, 'badges', index, profileBadgesForm, setProfileBadgesForm)}
                  onDragEnd={onDragEnd}
                  className={`grid sm:grid-cols-2 gap-3 p-4 rounded border theme-surface-soft mb-3 ${getDragVisualClass('badges', index)}`}
                  style={getDragTransitionStyle()}
                >
                  <div className="sm:col-span-2 mb-1 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase theme-text-strong font-semibold">Drag to sort</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 text-[11px] text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={12} />
                      Reorder
                    </button>
                  </div>
                  <input
                    value={item.id}
                    onChange={(e) => setProfileBadgesForm((p) => p.map((x, i) => (i === index ? { ...x, id: e.target.value } : x)))}
                    placeholder="Badge ID"
                    className={inputClass}
                  />
                  <input
                    value={item.title}
                    onChange={(e) => setProfileBadgesForm((p) => p.map((x, i) => (i === index ? { ...x, title: e.target.value } : x)))}
                    placeholder="Badge title"
                    className={inputClass}
                  />
                  <input
                    value={item.image_url}
                    onChange={(e) => setProfileBadgesForm((p) => p.map((x, i) => (i === index ? { ...x, image_url: e.target.value } : x)))}
                    placeholder="Badge image URL"
                    className={inputClass}
                  />
                  <input
                    value={item.credly_url}
                    onChange={(e) => setProfileBadgesForm((p) => p.map((x, i) => (i === index ? { ...x, credly_url: e.target.value } : x)))}
                    placeholder="Credly link"
                    className={inputClass}
                  />
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setProfileBadgesForm((p) => normalizeDisplayOrder(p.filter((_, i) => i !== index)))}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-400/30 rounded hover:bg-red-500/10"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <div
            className={`min-w-[240px] max-w-sm px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 ${
              toast.kind === 'success'
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                : toast.kind === 'error'
                  ? 'bg-red-500/15 border-red-400/40 text-red-200'
                  : 'bg-sky-500/15 border-sky-400/40 text-sky-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.kind === 'success' ? (
                <CheckCircle2 size={16} className="mt-0.5" />
              ) : toast.kind === 'error' ? (
                <AlertCircle size={16} className="mt-0.5" />
              ) : (
                <Loader2 size={16} className="mt-0.5" />
              )}
              <p className="text-xs sm:text-sm">{toast.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

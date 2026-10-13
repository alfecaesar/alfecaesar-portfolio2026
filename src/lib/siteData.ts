import { useEffect, useState } from 'react';
import {
  profile as fallbackProfile,
  experience as fallbackExperience,
  education as fallbackEducation,
  skills as fallbackSkills,
  cms as fallbackCms,
  languages as fallbackLanguages,
  references as fallbackReferences,
  techExpertise as fallbackTechExpertise,
} from '../data/resume';
import { fallbackPortfolioItems } from '../data/portfolio';
import { fallbackProfileBadges } from '../data/badges';
import { supabase } from './supabase';

type ProfileRow = {
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

type ExperienceRow = {
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  responsibilities: string[];
};

type EducationRow = {
  degree: string;
  school: string;
  period: string;
  location: string;
};

type SkillRow = {
  name: string;
  level: number;
};

type CmsRow = {
  name: string;
};

type LanguageRow = {
  name: string;
  level: number;
};

type ReferenceRow = {
  name: string;
  company: string;
  email: string;
};

type PortfolioRow = {
  id: string;
  title: string;
  site_url: string;
  thumbnail_url: string;
  tech_stack: string[];
};

type TechExpertiseRow = {
  category: string;
  items: string[];
};

type ProfileBadgeRow = {
  id: string;
  title: string;
  image_url: string;
  credly_url: string;
};

export interface SiteData {
  profile: typeof fallbackProfile;
  experience: typeof fallbackExperience;
  education: typeof fallbackEducation;
  skills: typeof fallbackSkills;
  cms: typeof fallbackCms;
  languages: typeof fallbackLanguages;
  references: typeof fallbackReferences;
  techExpertise: typeof fallbackTechExpertise;
  portfolioItems: typeof fallbackPortfolioItems;
  profileBadges: typeof fallbackProfileBadges;
}

const fallbackData: SiteData = {
  profile: fallbackProfile,
  experience: fallbackExperience,
  education: fallbackEducation,
  skills: fallbackSkills,
  cms: fallbackCms,
  languages: fallbackLanguages,
  references: fallbackReferences,
  techExpertise: fallbackTechExpertise,
  portfolioItems: fallbackPortfolioItems,
  profileBadges: fallbackProfileBadges,
};

let cachedData: SiteData | null = null;
let loadPromise: Promise<SiteData> | null = null;

async function fetchSiteData(): Promise<SiteData> {
  if (!supabase) {
    return fallbackData;
  }

  const [
    profileRes,
    experienceRes,
    educationRes,
    skillsRes,
    cmsRes,
    languagesRes,
    referencesRes,
    portfolioRes,
    expertiseRes,
    badgesRes,
  ] = await Promise.all([
    supabase.from('profile').select('name,title,email,phone,location,github,github_url,portfolio_url,summary').eq('id', 'main').maybeSingle(),
    supabase
      .from('experience')
      .select('company,role,period,location,current,responsibilities')
      .order('display_order', { ascending: true }),
    supabase.from('education').select('degree,school,period,location').order('display_order', { ascending: true }),
    supabase.from('skills').select('name,level').order('display_order', { ascending: true }),
    supabase.from('cms_platforms').select('name').order('display_order', { ascending: true }),
    supabase.from('languages').select('name,level').order('display_order', { ascending: true }),
    supabase.from('references_contacts').select('name,company,email').order('display_order', { ascending: true }),
    supabase.from('portfolio_items').select('id,title,site_url,thumbnail_url,tech_stack').order('display_order', { ascending: true }),
    supabase.from('technical_expertise').select('category,items').order('display_order', { ascending: true }),
    supabase.from('profile_badges').select('id,title,image_url,credly_url').order('display_order', { ascending: true }),
  ]);

  return {
    profile:
      profileRes.error || !profileRes.data
        ? fallbackProfile
        : {
            name: (profileRes.data as ProfileRow).name,
            title: (profileRes.data as ProfileRow).title,
            email: (profileRes.data as ProfileRow).email,
            phone: (profileRes.data as ProfileRow).phone,
            location: (profileRes.data as ProfileRow).location,
            github: (profileRes.data as ProfileRow).github,
            githubUrl: (profileRes.data as ProfileRow).github_url,
            portfolioUrl: (profileRes.data as ProfileRow).portfolio_url,
            summary: (profileRes.data as ProfileRow).summary,
            avatarUrl: fallbackProfile.avatarUrl,
          },
    experience:
      experienceRes.error || !experienceRes.data || experienceRes.data.length === 0
        ? fallbackExperience
        : (experienceRes.data as ExperienceRow[]),
    education:
      educationRes.error || !educationRes.data || educationRes.data.length === 0
        ? fallbackEducation
        : (educationRes.data as EducationRow[]),
    skills:
      skillsRes.error || !skillsRes.data || skillsRes.data.length === 0
        ? fallbackSkills
        : (skillsRes.data as SkillRow[]),
    cms:
      cmsRes.error || !cmsRes.data || cmsRes.data.length === 0
        ? fallbackCms
        : (cmsRes.data as CmsRow[]).map((item) => item.name),
    languages:
      languagesRes.error || !languagesRes.data || languagesRes.data.length === 0
        ? fallbackLanguages
        : (languagesRes.data as LanguageRow[]),
    references:
      referencesRes.error || !referencesRes.data || referencesRes.data.length === 0
        ? fallbackReferences
        : (referencesRes.data as ReferenceRow[]),
    techExpertise:
      expertiseRes.error || !expertiseRes.data || expertiseRes.data.length === 0
        ? fallbackTechExpertise
        : (expertiseRes.data as TechExpertiseRow[]),
    portfolioItems:
      portfolioRes.error || !portfolioRes.data || portfolioRes.data.length === 0
        ? fallbackPortfolioItems
        : (portfolioRes.data as PortfolioRow[]).map((item) => ({
            id: item.id,
            title: item.title,
            siteUrl: item.site_url,
            thumbnailUrl: item.thumbnail_url,
            tools: item.tech_stack ?? [],
          })),
    profileBadges:
      badgesRes.error || !badgesRes.data || badgesRes.data.length === 0
        ? fallbackProfileBadges
        : (badgesRes.data as ProfileBadgeRow[]).map((badge) => ({
            id: badge.id,
            title: badge.title,
            imageUrl: badge.image_url,
            credlyUrl: badge.credly_url,
          })),
  };
}

export function useSiteData() {
  const [data, setData] = useState<SiteData>(cachedData ?? fallbackData);
  const [isLoading, setIsLoading] = useState(!cachedData && !!supabase);

  useEffect(() => {
    let isMounted = true;

    if (cachedData) {
      return;
    }

    if (!loadPromise) {
      loadPromise = fetchSiteData().then((result) => {
        cachedData = result;
        return result;
      });
    }

    void loadPromise.then((result) => {
      if (!isMounted) {
        return;
      }
      setData(result);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}

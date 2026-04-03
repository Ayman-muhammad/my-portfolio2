export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  thumbnail_url: string;
  images: string[];
  tech_stack: string[];
  live_url: string;
  github_url: string;
  featured: boolean;
  views: number;
  order_index: number;
  created_at: string;
  content: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'design';
  proficiency: number;
  years_experience: number;
  icon_name: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  description: string[];
  skills_used: string[];
  order_index: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

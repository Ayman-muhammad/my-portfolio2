-- SQL for Supabase Setup

-- Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  tagline text not null,
  description text,
  thumbnail_url text,
  images text[],
  tech_stack text[],
  live_url text,
  github_url text,
  featured boolean default false,
  views integer default 0,
  order_index integer default 0,
  created_at timestamp with time zone default now(),
  content jsonb -- flexible case study content
);

-- Skills table
create table skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text check (category in ('frontend','backend','devops','design')),
  proficiency integer check (proficiency between 0 and 100),
  years_experience integer,
  icon_name text
);

-- Experience table
create table experience (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  role text not null,
  location text,
  period text not null,
  description text[],
  skills_used text[],
  order_index integer default 0
);

-- Contact submissions
create table contacts (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- RLS: Public read all tables, authenticated write contacts only
alter table projects enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;
alter table contacts enable row level security;

create policy "Public read projects" on projects for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read experience" on experience for select using (true);
create policy "Public insert contacts" on contacts for insert with check (true);

-- Function to increment views
create or replace function increment_project_views(project_slug text)
returns void as $$
begin
  update projects
  set views = views + 1
  where slug = project_slug;
end;
$$ language plpgsql security definer;

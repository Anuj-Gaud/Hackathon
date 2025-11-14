-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Drop existing policies first
drop policy if exists "Companies can view resumes for their applications" on storage.objects;
drop policy if exists "Users can upload their own resumes" on storage.objects;
drop policy if exists "Users can view their own resumes" on storage.objects;
drop policy if exists "Companies can upload their own logos" on storage.objects;
drop policy if exists "Company logos are viewable by everyone" on storage.objects;
drop policy if exists "Users can upload their own video resumes" on storage.objects;
drop policy if exists "Users can view their own video resumes" on storage.objects;
drop policy if exists "Companies can view video resumes for their applications" on storage.objects;

-- Create custom types
do $$ begin
    create type user_role as enum ('user', 'company', 'admin');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type job_type as enum ('full-time', 'part-time', 'contract', 'internship');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type application_status as enum ('pending', 'reviewing', 'accepted', 'rejected');
exception
    when duplicate_object then null;
end $$;

-- Drop existing tables if they exist
drop table if exists analytics cascade;
drop table if exists subscriptions cascade;
drop table if exists applications cascade;
drop table if exists internships cascade;
drop table if exists jobs cascade;
drop table if exists profiles cascade;

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role user_role default 'user' not null,
  company_name text,
  company_logo text,
  company_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create jobs table
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company_id uuid references profiles(id) on delete cascade not null,
  description text not null,
  requirements text[] not null,
  location text not null,
  type job_type not null,
  salary_range text,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create internships table
create table internships (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company_id uuid references profiles(id) on delete cascade not null,
  description text not null,
  requirements text[] not null,
  location text not null,
  duration text not null,
  stipend text,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create applications table
create table applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade,
  internship_id uuid references internships(id) on delete cascade,
  resume_url text not null,
  video_url text,
  video_thumbnail_url text,
  cover_letter text,
  status application_status default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_job_or_internship check (
    (job_id is not null and internship_id is null) or
    (job_id is null and internship_id is not null)
  )
);

-- Create subscriptions table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  plan_id text not null,
  status text not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create analytics table
create table analytics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade,
  internship_id uuid references internships(id) on delete cascade,
  event_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_job_or_internship check (
    (job_id is not null and internship_id is null) or
    (job_id is null and internship_id is not null)
  )
);

-- Create RLS policies

-- Profiles policies
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Jobs policies
alter table jobs enable row level security;

create policy "Jobs are viewable by everyone"
  on jobs for select
  using (true);

create policy "Companies can create jobs"
  on jobs for insert
  with check (
    auth.uid() = company_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'company'
    )
  );

create policy "Companies can update their own jobs"
  on jobs for update
  using (
    auth.uid() = company_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'company'
    )
  );

create policy "Companies can delete their own jobs"
  on jobs for delete
  using (
    auth.uid() = company_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'company'
    )
  );

-- Internships policies
alter table internships enable row level security;

create policy "Internships are viewable by everyone"
  on internships for select
  using (true);

create policy "Companies can create internships"
  on internships for insert
  with check (
    auth.uid() = company_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'company'
    )
  );

create policy "Companies can update their own internships"
  on internships for update
  using (
    auth.uid() = company_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'company'
    )
  );

create policy "Companies can delete their own internships"
  on internships for delete
  using (
    auth.uid() = company_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'company'
    )
  );

-- Applications policies
alter table applications enable row level security;

create policy "Users can view their own applications"
  on applications for select
  using (auth.uid() = user_id);

create policy "Companies can view applications for their jobs/internships"
  on applications for select
  using (
    exists (
      select 1 from jobs
      where id = applications.job_id and company_id = auth.uid()
    ) or
    exists (
      select 1 from internships
      where id = applications.internship_id and company_id = auth.uid()
    )
  );

create policy "Users can create applications"
  on applications for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'user'
    )
  );

create policy "Companies can update application status"
  on applications for update
  using (
    exists (
      select 1 from jobs
      where id = applications.job_id and company_id = auth.uid()
    ) or
    exists (
      select 1 from internships
      where id = applications.internship_id and company_id = auth.uid()
    )
  );

-- Subscriptions policies
alter table subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create subscriptions"
  on subscriptions for insert
  with check (auth.uid() = user_id);

-- Analytics policies
alter table analytics enable row level security;

create policy "Users can view their own analytics"
  on analytics for select
  using (auth.uid() = user_id);

create policy "Companies can view analytics for their jobs/internships"
  on analytics for select
  using (
    exists (
      select 1 from jobs
      where id = analytics.job_id and company_id = auth.uid()
    ) or
    exists (
      select 1 from internships
      where id = analytics.internship_id and company_id = auth.uid()
    )
  );

create policy "Users can create analytics events"
  on analytics for insert
  with check (auth.uid() = user_id);

-- Create functions and triggers

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_updated_at
  before update on profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on jobs
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on internships
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on applications
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on subscriptions
  for each row execute procedure public.handle_updated_at(); 
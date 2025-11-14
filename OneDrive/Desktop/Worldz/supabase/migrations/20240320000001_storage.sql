-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('resumes', 'resumes', true),
  ('company_logos', 'company_logos', true)
on conflict (id) do nothing;

-- Drop existing policies
drop policy if exists "Users can upload their own resumes" on storage.objects;
drop policy if exists "Users can view their own resumes" on storage.objects;
drop policy if exists "Companies can view resumes for their applications" on storage.objects;
drop policy if exists "Companies can upload their own logos" on storage.objects;
drop policy if exists "Company logos are viewable by everyone" on storage.objects;

-- Set up storage policies for resumes
create policy "Users can upload their own resumes"
on storage.objects for insert
with check (
  bucket_id = 'resumes' and
  auth.uid() = (storage.foldername(name))[1]::uuid
);

create policy "Users can view their own resumes"
on storage.objects for select
using (
  bucket_id = 'resumes' and
  auth.uid() = (storage.foldername(name))[1]::uuid
);

create policy "Companies can view resumes for their applications"
on storage.objects for select
using (
  bucket_id = 'resumes' and
  exists (
    select 1 from applications
    where resume_url = storage.objects.name and
    (
      exists (
        select 1 from jobs
        where id = applications.job_id and company_id = auth.uid()
      ) or
      exists (
        select 1 from internships
        where id = applications.internship_id and company_id = auth.uid()
      )
    )
  )
);

-- Set up storage policies for company logos
create policy "Companies can upload their own logos"
on storage.objects for insert
with check (
  bucket_id = 'company_logos' and
  auth.uid() = (storage.foldername(name))[1]::uuid and
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'company'
  )
);

create policy "Company logos are viewable by everyone"
on storage.objects for select
using (bucket_id = 'company_logos'); 
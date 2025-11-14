-- Create storage bucket for videos
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Add video columns if they don't exist
do $$ 
begin
    if not exists (
        select 1 
        from information_schema.columns 
        where table_name = 'applications' 
        and column_name = 'video_url'
    ) then
        alter table applications add column video_url text;
    end if;

    if not exists (
        select 1 
        from information_schema.columns 
        where table_name = 'applications' 
        and column_name = 'video_thumbnail_url'
    ) then
        alter table applications add column video_thumbnail_url text;
    end if;
end $$;

-- Drop existing policies
drop policy if exists "Users can upload their own video resumes" on storage.objects;
drop policy if exists "Users can view their own video resumes" on storage.objects;
drop policy if exists "Companies can view video resumes for their applications" on storage.objects;

-- Set up storage policies for videos
create policy "Users can upload their own video resumes"
on storage.objects for insert
with check (
  bucket_id = 'videos' and
  auth.uid() = (storage.foldername(name))[1]::uuid
);

create policy "Users can view their own video resumes"
on storage.objects for select
using (
  bucket_id = 'videos' and
  auth.uid() = (storage.foldername(name))[1]::uuid
);

create policy "Companies can view video resumes for their applications"
on storage.objects for select
using (
  bucket_id = 'videos' and
  exists (
    select 1 from applications
    where (video_url = storage.objects.name or video_thumbnail_url = storage.objects.name)
    and (
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

-- Function to generate video thumbnails
create or replace function generate_video_thumbnail()
returns trigger as $$
begin
  -- This is a placeholder for the actual thumbnail generation logic
  -- You would typically use a serverless function or external service
  -- to generate the thumbnail and update the video_thumbnail_url
  return new;
end;
$$ language plpgsql;

-- Trigger to generate thumbnails on video upload
drop trigger if exists on_video_upload on storage.objects;
create trigger on_video_upload
  after insert on storage.objects
  for each row
  when (NEW.bucket_id = 'videos')
  execute function generate_video_thumbnail(); 
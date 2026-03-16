-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Create enums
create type task_status as enum ('todo', 'in_progress', 'in_review', 'done');
create type task_priority as enum ('none', 'low', 'medium', 'high', 'urgent');

-- Tasks table
create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text default '',
  status task_status not null default 'todo',
  priority task_priority not null default 'none',
  due_date date,
  position integer not null default 0,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Labels table
create table public.labels (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  color text not null default '#6366f1',
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (name, user_id)
);

-- Junction table for task-label relationships
create table public.task_labels (
  task_id uuid not null references public.tasks(id) on delete cascade,
  label_id uuid not null references public.labels(id) on delete cascade,
  primary key (task_id, label_id)
);

-- Indexes
create index idx_tasks_user_status on public.tasks(user_id, status);
create index idx_tasks_user_position on public.tasks(user_id, position);
create index idx_labels_user on public.labels(user_id);
create index idx_task_labels_task on public.task_labels(task_id);
create index idx_task_labels_label on public.task_labels(label_id);

-- Enable RLS
alter table public.tasks enable row level security;
alter table public.labels enable row level security;
alter table public.task_labels enable row level security;

-- Tasks RLS policies
create policy "Users can view their own tasks"
  on public.tasks for select using (auth.uid() = user_id);

create policy "Users can create their own tasks"
  on public.tasks for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete using (auth.uid() = user_id);

-- Labels RLS policies
create policy "Users can view their own labels"
  on public.labels for select using (auth.uid() = user_id);

create policy "Users can create their own labels"
  on public.labels for insert with check (auth.uid() = user_id);

create policy "Users can update their own labels"
  on public.labels for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own labels"
  on public.labels for delete using (auth.uid() = user_id);

-- Task_labels RLS policies
create policy "Users can view their task labels"
  on public.task_labels for select using (
    exists (select 1 from public.tasks where tasks.id = task_labels.task_id and tasks.user_id = auth.uid())
  );

create policy "Users can add labels to their tasks"
  on public.task_labels for insert with check (
    exists (select 1 from public.tasks where tasks.id = task_labels.task_id and tasks.user_id = auth.uid())
    and exists (select 1 from public.labels where labels.id = task_labels.label_id and labels.user_id = auth.uid())
  );

create policy "Users can remove labels from their tasks"
  on public.task_labels for delete using (
    exists (select 1 from public.tasks where tasks.id = task_labels.task_id and tasks.user_id = auth.uid())
  );

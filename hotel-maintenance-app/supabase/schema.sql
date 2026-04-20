-- Create a table for public profiles (linked to auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('admin', 'manager', 'worker')) default 'worker',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Equipment Table
create table equipment (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text,
  type text,
  maintenance_interval_days integer default 7,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks Table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  equipment_id uuid references equipment(id) not null,
  assigned_worker_id uuid references profiles(id),
  due_date date not null,
  status text check (status in ('pending', 'completed', 'missed', 'overdue')) default 'pending',
  completed_at timestamp with time zone,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Photos Table
create table photos (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references tasks(id) not null,
  url text not null,
  type text check (type in ('before', 'after')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for other tables (simplified for now)
alter table equipment enable row level security;
alter table tasks enable row level security;
alter table photos enable row level security;

-- Basic policies (adjust as needed for strict role-based access)
create policy "Authenticated users can view all equipment" on equipment for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view all tasks" on tasks for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view all photos" on photos for select using (auth.role() = 'authenticated');

-- Managers and Admins can insert/update equipment
-- (Requires custom claims or checking profile role, for simplicity allowing auth users for now, can be refined)

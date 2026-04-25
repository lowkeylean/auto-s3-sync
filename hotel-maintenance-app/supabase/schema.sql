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

-- === ADDITIONS: run these in Supabase SQL Editor ===

-- Extend profiles with extra fields
alter table profiles
  add column if not exists employment_type text check (employment_type in ('staff', 'contractor')),
  add column if not exists sub_category text,
  add column if not exists tags text[] default '{}',
  add column if not exists status text check (status in ('active', 'inactive')) default 'active';

-- Defects table
create table if not exists defects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text not null,
  priority text check (priority in ('low', 'medium', 'high', 'critical')) not null default 'medium',
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  reported_by_id uuid references profiles(id),
  reported_by_name text,
  reported_by_role text,
  assigned_worker_id uuid references profiles(id),
  resolved_at timestamp with time zone,
  resolution_notes text,
  photo_url text,
  resolution_photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table defects enable row level security;

create policy "Authenticated users can view all defects" on defects
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert defects" on defects
  for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update defects" on defects
  for update using (auth.role() = 'authenticated');

-- Rooms table
create table if not exists rooms (
  id uuid default uuid_generate_v4() primary key,
  room_number text not null unique,
  floor integer not null,
  last_maintained timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table rooms enable row level security;

create policy "Authenticated users can view all rooms" on rooms
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can update rooms" on rooms
  for update using (auth.role() = 'authenticated');

-- Seed rooms (311 rooms across floors)
DO $$
DECLARE
  floor_configs int[][] := ARRAY[
    ARRAY[7,15],ARRAY[8,19],ARRAY[9,22],ARRAY[10,22],
    ARRAY[11,22],ARRAY[12,22],ARRAY[15,22],ARRAY[16,21],
    ARRAY[17,21],ARRAY[18,21],ARRAY[19,21],ARRAY[20,21],
    ARRAY[21,22],ARRAY[23,18],ARRAY[25,10],ARRAY[26,12]
  ];
  fc int[];
  floor_num int;
  room_count int;
  room_num int;
  room_number_str text;
BEGIN
  FOREACH fc SLICE 1 IN ARRAY floor_configs LOOP
    floor_num := fc[1];
    room_count := fc[2];
    FOR room_num IN 1..room_count LOOP
      room_number_str := floor_num::text || lpad(room_num::text, 2, '0');
      INSERT INTO rooms (room_number, floor, last_maintained)
      VALUES (room_number_str, floor_num, NOW() - (random() * 120 || ' days')::interval)
      ON CONFLICT (room_number) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

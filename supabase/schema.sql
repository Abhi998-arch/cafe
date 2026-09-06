-- Smart Cafe Ordering & Management Database Schema

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS & TYPE CONSTRAINTS
-- We use text constraints instead of raw enums to make adjustments simpler in client interfaces
-- if necessary, but keep strict checks.

-- 3. TABLES

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'kitchen', 'cafe', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Categories
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Menu Items
create table if not exists public.menu_items (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'PLACED' check (status in ('PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED')),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  menu_item_id uuid references public.menu_items(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null check (price >= 0)
);

-- Payments
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade unique not null,
  payment_method text not null check (payment_method in ('card', 'cash', 'upi')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ROW LEVEL SECURITY (RLS)

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- Helper functions (SECURITY DEFINER bypasses RLS to prevent infinite recursion)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

create or replace function public.is_staff_or_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('kitchen', 'cafe', 'admin')
  );
$$ language sql security definer stable;

-- Profiles Policies
drop policy if exists "Allow public read of profiles" on public.profiles;
create policy "Allow public read of profiles"
  on public.profiles for select
  using (true);

drop policy if exists "Allow users to update own profile" on public.profiles;
create policy "Allow users to update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Allow admin full access to profiles" on public.profiles;
create policy "Allow admin full access to profiles"
  on public.profiles for all
  using (public.is_admin());

-- Categories Policies
drop policy if exists "Allow public read of categories" on public.categories;
create policy "Allow public read of categories"
  on public.categories for select
  using (true);

drop policy if exists "Allow admin write of categories" on public.categories;
create policy "Allow admin write of categories"
  on public.categories for all
  using (public.is_admin());

-- Menu Items Policies
drop policy if exists "Allow public read of menu items" on public.menu_items;
create policy "Allow public read of menu items"
  on public.menu_items for select
  using (true);

drop policy if exists "Allow admin write of menu items" on public.menu_items;
create policy "Allow admin write of menu items"
  on public.menu_items for all
  using (public.is_admin());

-- Orders Policies
drop policy if exists "Allow users to read own orders" on public.orders;
create policy "Allow users to read own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_staff_or_admin());

drop policy if exists "Allow users to insert own orders" on public.orders;
create policy "Allow users to insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Allow staff and admin to update orders" on public.orders;
create policy "Allow staff and admin to update orders"
  on public.orders for update
  using (public.is_staff_or_admin());

-- Order Items Policies
drop policy if exists "Allow users to read own order items" on public.order_items;
create policy "Allow users to read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id and (
        orders.user_id = auth.uid() or public.is_staff_or_admin()
      )
    )
  );

drop policy if exists "Allow users to insert order items" on public.order_items;
create policy "Allow users to insert order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and orders.user_id = auth.uid()
    )
  );

-- Payments Policies
drop policy if exists "Allow users to read own payments" on public.payments;
create policy "Allow users to read own payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id and (
        orders.user_id = auth.uid() or public.is_staff_or_admin()
      )
    )
  );

drop policy if exists "Allow users to insert payments" on public.payments;
create policy "Allow users to insert payments"
  on public.payments for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and orders.user_id = auth.uid()
    )
  );

-- 5. PROFILE SYNC TRIGGER (ON AUTH SIGNUP)

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Customer'),
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. REALTIME REPLICATION ENABLEMENT
-- Ensure supabase_realtime publication is set up for updates
drop publication if exists supabase_realtime;
create publication supabase_realtime for table public.orders, public.order_items, public.menu_items, public.profiles;

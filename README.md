# ☕ Cafe Management System

A modern, full-stack cafe management system designed to streamline cafe operations across customers, staff, kitchen, and administrators.

The application provides separate workflows for ordering, menu management, order processing, staff management, analytics, and cafe operations.

---

## 🚀 Features

### 👤 Customer
- Secure authentication
- Browse cafe menu
- Add items to cart
- Place orders
- View order history
- Track orders

### 🛠️ Admin
- Admin dashboard
- Menu management
- Order management
- Staff management
- Sales and operational analytics
- Cafe management

### 👨‍🍳 Kitchen
- Kitchen dashboard
- View incoming orders
- Manage order preparation workflow
- Monitor active orders

### 🏪 Cafe Management
- Centralized cafe dashboard
- Role-based application experience
- Real-time data integration through Supabase

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend UI |
| TypeScript | Type-safe development |
| Vite | Development & build tooling |
| Supabase | Backend & database |
| Lucide React | Icons |
| CSS | UI styling |

---

## 📁 Project Structure

```text
cafe/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── cafe/
│   │   ├── common/
│   │   ├── customer/
│   │   └── kitchen/
│   ├── context/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   ├── supabaseClient.ts
│   └── types.ts
├── supabase/
│   └── schema.sql
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts

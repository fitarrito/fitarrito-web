# Database Architecture: Prisma, SQLite, and Supabase Explained

## 📚 Overview

This project uses **Prisma** as an ORM (Object-Relational Mapping) tool to interact with databases. Currently, it's configured to use **SQLite** for local development, but can be switched to **Supabase** (PostgreSQL) for production.

---

## 🔧 Part 1: What is Prisma?

**Prisma** is a modern ORM that:

- Generates type-safe database clients
- Provides a schema file to define your database structure
- Automatically creates migrations
- Gives you autocomplete and type safety in your code

### How Prisma Works in This Project:

1. **Schema Definition** (`prisma/schema.prisma`)

   ```prisma
   model MenuItem {
     id          Int        @id @default(autoincrement())
     title       String
     description String
     price       Int
     category    Category?  @relation(...)
     nutrients   Nutrient[]
   }
   ```

   - Defines your database structure
   - Creates relationships between tables
   - Specifies data types

2. **Client Generation**

   ```bash
   yarn prisma generate
   ```

   - Reads `schema.prisma`
   - Generates TypeScript types in `generated/prisma/`
   - Creates `PrismaClient` with type-safe methods

3. **Using Prisma in Code**
   ```typescript
   const prisma = new PrismaClient();
   const menuItems = await prisma.menuItem.findMany({
     include: { category: true, nutrients: true },
   });
   ```

---

## 💾 Part 2: SQLite (Current Setup)

**SQLite** is a file-based database - perfect for local development.

### Current Configuration:

**`.env` file:**

```env
DATABASE_URL="file:./prisma/dev.db"
```

**`prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### How SQLite Works:

1. **Database File**: `prisma/dev.db`

   - Single file containing all your data
   - No server needed
   - Perfect for development

2. **Migrations** (`prisma/migrations/`)

   - SQL files that create/alter tables
   - Applied with: `yarn prisma migrate deploy`
   - Creates tables: `Category`, `MenuItem`, `Nutrient`, `User`

3. **Seeding** (`prisma/seed.ts`)
   ```bash
   yarn prisma:seed
   ```
   - Reads `prisma/data/menu.json`
   - Inserts menu items into the database
   - Populates categories and nutrients

---

## ☁️ Part 3: Supabase (PostgreSQL)

**Supabase** is a cloud PostgreSQL database with additional features:

- Authentication
- Real-time subscriptions
- Storage
- Edge functions

### How Supabase Would Work:

**If you switch to Supabase:**

1. **Update `.env`:**

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

2. **Update `prisma/schema.prisma`:**

   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Push Schema:**

   ```bash
   yarn prisma generate
   yarn prisma db push
   ```

   - Creates tables in Supabase PostgreSQL database

4. **Supabase Client** (`lib/supabase.ts`)
   ```typescript
   import { createClient } from "@supabase/supabase-js";
   export const supabase = createClient(url, anonKey);
   ```
   - Used for authentication, real-time, storage
   - Separate from Prisma (which handles database queries)

---

## 🔄 Part 4: Complete Data Flow

### Current Setup (SQLite):

```
┌─────────────────────────────────────────────────────────┐
│ 1. Define Schema (prisma/schema.prisma)                 │
│    - Models: Category, MenuItem, Nutrient, User          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Generate Prisma Client                                │
│    yarn prisma generate                                  │
│    → Creates generated/prisma/PrismaClient.ts           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Create Database & Tables                             │
│    yarn prisma migrate deploy                           │
│    → Creates prisma/dev.db (SQLite file)                │
│    → Creates tables based on schema                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Seed Database                                         │
│    yarn prisma:seed                                      │
│    → Reads prisma/data/menu.json                        │
│    → Inserts data via PrismaClient                      │
│    → Populates: 6 categories, 6 menu items, 84 nutrients│
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 5. API Route Uses Prisma                                │
│    app/api/menu/route.ts                                │
│    → const prisma = new PrismaClient()                  │
│    → await prisma.menuItem.findMany()                   │
│    → Returns JSON to frontend                           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Frontend Fetches Data                                │
│    app/lib/features/menuSlice.tsx                       │
│    → fetch("/api/menu")                                 │
│    → Stores in Redux state                              │
│    → Components display menu                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step: What Happens When You Run Commands

### 1. `yarn prisma generate`

```
Input:  prisma/schema.prisma (your schema definition)
Output: generated/prisma/ (TypeScript client code)
Result: You can now use PrismaClient in your code
```

### 2. `yarn prisma migrate deploy`

```
Input:  prisma/migrations/*.sql (migration files)
Output: prisma/dev.db (SQLite database file)
Result: Tables created in database
```

### 3. `yarn prisma:seed`

```
Input:  prisma/data/menu.json (JSON data)
Process: prisma/seed.ts reads JSON
         Uses PrismaClient to insert data
Output: Data in prisma/dev.db
Result: Database populated with menu items
```

### 4. `yarn dev` (Next.js starts)

```
1. Next.js loads app/api/menu/route.ts
2. API route creates: const prisma = new PrismaClient()
3. Frontend calls: fetch("/api/menu")
4. API route executes: prisma.menuItem.findMany()
5. Prisma queries SQLite database (prisma/dev.db)
6. Returns JSON response
7. Frontend receives menu data
```

---

## 🔀 Key Differences: SQLite vs Supabase

| Feature        | SQLite (Current)             | Supabase (PostgreSQL)            |
| -------------- | ---------------------------- | -------------------------------- |
| **Location**   | Local file (`prisma/dev.db`) | Cloud database                   |
| **Setup**      | No server needed             | Requires Supabase account        |
| **Provider**   | `provider = "sqlite"`        | `provider = "postgresql"`        |
| **URL Format** | `file:./prisma/dev.db`       | `postgresql://user:pass@host/db` |
| **Best For**   | Development, testing         | Production, real apps            |
| **Features**   | Basic database               | Database + Auth + Real-time      |

---

## 🎯 Current Project State

**Active:**

- ✅ SQLite database (`prisma/dev.db`)
- ✅ Prisma ORM for queries
- ✅ Seeded with menu data
- ✅ API route (`/api/menu`) working

**Available but Not Active:**

- ⚠️ Supabase client created (`lib/supabase.ts`)
- ⚠️ Supabase credentials in `.env`
- ⚠️ Not currently used (Prisma handles all DB operations)

---

## 💡 When to Use Each

### Use SQLite When:

- Developing locally
- Testing features
- Quick prototyping
- No need for cloud features

### Use Supabase When:

- Deploying to production
- Need user authentication
- Want real-time features
- Need multiple developers accessing same data
- Want automatic backups

---

## 🤔 Why SQLite Instead of Cloud Database?

### Development Benefits:

1. **Zero Setup Time**

   - No account creation
   - No API keys to manage
   - Works immediately after `yarn install`

2. **Faster Development**

   - No network latency (queries are instant)
   - No connection overhead
   - Faster iteration cycles

3. **Cost-Free**

   - No cloud service costs
   - No usage limits
   - No billing surprises

4. **Easy Testing**

   - Can delete/reset database instantly
   - Each developer has isolated data
   - No conflicts with other developers

5. **Works Offline**

   - No internet required
   - No dependency on external services
   - Perfect for development on the go

6. **Simple Debugging**
   - Can inspect database file directly
   - Easy to backup/restore
   - No complex connection issues

### When You'll Switch to Supabase:

- **Production**: Real users need a reliable cloud database
- **Team Collaboration**: Multiple developers need shared data
- **Authentication**: Need user login/signup features
- **Real-time**: Need live updates (e.g., order status)
- **Scalability**: Need to handle many concurrent users
- **Backups**: Need automatic cloud backups

### Best Practice:

**Development**: SQLite (fast, simple, free)  
**Production**: Supabase/PostgreSQL (reliable, scalable, cloud-based)

This is a common pattern: use SQLite locally, then switch to PostgreSQL for production!

---

## 🔧 Switching Between SQLite and Supabase

To switch to Supabase:

1. **Update `.env`:**

   ```env
   DATABASE_URL="postgresql://postgres:password@host:port/db"
   ```

2. **Update `prisma/schema.prisma`:**

   ```prisma
   datasource db {
     provider = "postgresql"  // Change this
     url      = env("DATABASE_URL")
   }
   ```

3. **Regenerate and push:**

   ```bash
   yarn prisma generate
   yarn prisma db push
   ```

4. **Reseed if needed:**
   ```bash
   yarn prisma:seed
   ```

---

## 📚 Summary

- **Prisma** = ORM tool that generates type-safe database clients
- **SQLite** = File-based database (current setup, local development)
- **Supabase** = Cloud PostgreSQL (available but not active)
- **Flow**: Schema → Generate → Migrate → Seed → Query via API → Frontend

Your current setup uses Prisma + SQLite for a simple, local development database that works perfectly for building and testing your menu application!

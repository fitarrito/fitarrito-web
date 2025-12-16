# Supabase Setup Guide

## ✅ What's Already Done

- ✅ Prisma schema configured for PostgreSQL
- ✅ Supabase client created (`lib/supabase.ts`)
- ✅ Required packages installed
- ✅ Prisma CLI added to devDependencies

## 📋 Next Steps

### Step 1: Get Your API Keys

1. Go to your Supabase dashboard
2. Click **Settings** → **API** (in the left sidebar)
3. Copy these values:
   - **Project URL**: `https://dvscirnbbmuaiukzhmnu.supabase.co`
   - **anon public key**: (long string starting with `eyJ...`)

### Step 2: Create `.env.local` File

Create a file named `.env.local` in your project root with:

```env
# Database Connection
# Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL="postgresql://postgres.dvscirnbbmuaiukzhmnu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL="https://dvscirnbbmuaiukzhmnu.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

**Important:** Replace:

- `[YOUR-PASSWORD]` with your actual database password
- `your-anon-key-here` with the anon key from Step 1

### Step 3: Install Dependencies

```bash
yarn install
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Push Schema to Supabase

This will create your tables in Supabase:

```bash
npx prisma db push
```

### Step 6: Verify Connection

Open Prisma Studio to view your database:

```bash
npx prisma studio
```

This opens at `http://localhost:5555` and should show your Supabase database.

## 🎉 You're Done!

Your Supabase setup is complete. You can now:

- Use Prisma to interact with your database
- Use the Supabase client for authentication and real-time features
- View data in Prisma Studio

## 🔒 Security Notes

- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Keep your database password secure
- Never expose `service_role` key in client-side code

# Supabase Authentication Setup Guide

## ✅ What's Been Set Up

1. ✅ **Supabase Client** (`lib/supabase.ts`) - Configured and ready
2. ✅ **Authentication Redux Slice** (`app/lib/features/authSlice.tsx`) - Manages auth state
3. ✅ **useAuth Hook** (`app/lib/hooks/useAuth.ts`) - Custom hook for authentication
4. ✅ **Sign In Page** (`app/signin/page.tsx`) - Complete sign-in interface
5. ✅ **Sign Up Page** (`app/signup/page.tsx`) - Complete sign-up interface
6. ✅ **Protected Route Component** (`app/components/ProtectedRoute.tsx`) - Route protection

---

## 📋 Step 1: Configure Environment Variables

### Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: (starts with `eyJ...`)

### Update `.env` File

Add or update these variables in your `.env` file:

```env
# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

**Important:**

- These variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Never commit `.env` to Git (already in `.gitignore`)

---

## 📋 Step 2: Enable Email Authentication in Supabase

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Make sure **Email** provider is enabled
3. Configure email settings:
   - **Enable email confirmations**: Optional (recommended for production)
   - **Enable email change confirmations**: Optional

---

## 📋 Step 3: Test the Setup

### Start Your Development Server

```bash
yarn dev
```

### Test Sign Up

1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - Name (optional)
   - Email
   - Password (minimum 6 characters)
3. Click "Sign up"
4. Check your email for verification (if enabled)

### Test Sign In

1. Navigate to `http://localhost:3000/signin`
2. Enter your email and password
3. Click "Log in"
4. You should be redirected to the home page

---

## 🔧 How It Works

### Authentication Flow

```
1. User fills form → 2. useAuth hook → 3. Supabase API → 4. Redux Store → 5. UI Updates
```

### Components Structure

```
app/
├── signin/
│   └── page.tsx          # Sign in page route
├── signup/
│   └── page.tsx          # Sign up page route
└── components/
    ├── SignInPage.tsx    # Sign in component
    ├── SignUpPage.tsx    # Sign up component
    └── ProtectedRoute.tsx # Route protection wrapper
```

### State Management

- **Redux Store**: Manages auth state (user, session, loading, error)
- **useAuth Hook**: Provides authentication methods and state
- **Supabase Client**: Handles actual authentication with Supabase

---

## 🎯 Usage Examples

### Using Authentication in Components

```typescript
import { useAuth } from "@/app/lib/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protecting Routes

```typescript
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Accessing User Data

```typescript
import { useAppSelector } from "@/app/lib/hooks";

function UserProfile() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>User ID: {user?.id}</p>
      <p>Name: {user?.user_metadata?.name}</p>
    </div>
  );
}
```

---

## 🔐 Security Best Practices

1. **Never expose service_role key** in client-side code
2. **Use anon key** for client-side operations (already configured)
3. **Enable Row Level Security (RLS)** in Supabase for database tables
4. **Validate email** in production (enable email confirmations)
5. **Use strong passwords** (enforce minimum length in Supabase settings)

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

**Solution:** Make sure `.env` file has:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### "Invalid login credentials"

**Solution:**

- Check if email is verified (if email confirmation is enabled)
- Verify password is correct
- Check Supabase dashboard for user status

### Authentication state not persisting

**Solution:**

- Supabase handles session persistence automatically
- Check browser localStorage for `sb-*` keys
- Clear localStorage if needed: `localStorage.clear()`

### Redirect loop

**Solution:**

- Make sure ProtectedRoute is not used on signin/signup pages
- Check if user is being set correctly in Redux store

---

## 📚 Next Steps

1. **Add password reset functionality**

   - Create forgot password page
   - Use `supabase.auth.resetPasswordForEmail()`

2. **Add social authentication**

   - Enable Google/GitHub providers in Supabase
   - Update SignInPage to include social buttons

3. **Add user profile management**

   - Create profile page
   - Update user metadata

4. **Add role-based access**
   - Use Supabase RLS policies
   - Add roles to user metadata

---

## 🎉 You're Done!

Your Supabase authentication is now fully set up and ready to use!

**Available Routes:**

- `/signin` - Sign in page
- `/signup` - Sign up page

**Available Hooks:**

- `useAuth()` - Authentication hook with all methods

**Available Components:**

- `<ProtectedRoute>` - Protect routes that require authentication

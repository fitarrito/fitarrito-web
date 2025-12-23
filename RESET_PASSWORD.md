# Reset Password in Supabase

## Method 1: Reset Password via SQL (Quick Fix)

If you know the user exists but forgot the password:

1. **Go to SQL Editor:**

   - https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/sql/new

2. **Reset Password (This will set a new password):**
   ```sql
   -- First, get the user's encrypted password hash
   -- Then update it (Note: This requires knowing the password hash format)
   -- Better to use Method 2 or 3
   ```

⚠️ **Note:** Direct password updates via SQL are complex. Use Method 2 or 3 instead.

---

## Method 2: Delete User and Create New Account

**Fastest way for testing:**

1. **Delete the user:**

   ```sql
   DELETE FROM auth.users
   WHERE email = 'ranjaniashok1997@gmail.com';
   ```

2. **Go to your signup page:**

   - http://localhost:3000/signup

3. **Create a new account** with the same email and a new password

4. **Sign in** with the new password

---

## Method 3: Use Password Reset Email (Recommended)

1. **Go to your sign-in page:**

   - http://localhost:3000/signin

2. **Click "Forgot your password?" link**

3. **Enter your email** and request password reset

4. **Check your email** for the reset link

5. **Click the link** and set a new password

---

## Method 4: Check User Status in Supabase

Run this query to see full user details:

```sql
SELECT
  id,
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as has_password,
  created_at,
  last_sign_in_at,
  banned_until,
  confirmation_token,
  recovery_token
FROM auth.users
WHERE email = 'ranjaniashok1997@gmail.com';
```

**What to check:**

- `email_confirmed_at` should NOT be NULL
- `has_password` should be TRUE
- `banned_until` should be NULL (if not NULL, user is banned)

---

## Method 5: Unban User (If Banned)

If user is banned, unban them:

```sql
UPDATE auth.users
SET banned_until = NULL
WHERE email = 'ranjaniashok1997@gmail.com';
```

---

## Quick Test: Create Fresh Account

**Best for development testing:**

1. **Delete old user:**

   ```sql
   DELETE FROM auth.users WHERE email = 'ranjaniashok1997@gmail.com';
   ```

2. **Disable email confirmation** (if not already):

   - Go to: https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/auth/providers
   - Click "Email" → Toggle OFF "Confirm email"

3. **Sign up again** at http://localhost:3000/signup

4. **Sign in immediately** - should work!
